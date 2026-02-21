use axum::{
    routing::post,
    Json, Router, http::StatusCode, response::IntoResponse,
};
use serde::Deserialize;
use std::path::PathBuf;
use url::Url;
use std::env;

#[derive(Deserialize)]
struct Payload {
    url: String,
    body: String,
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", post(save_page));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn save_page(Json(payload): Json<Payload>) -> impl IntoResponse {
    let parsed_url = match Url::parse(&payload.url) {
        Ok(u) => u,
        Err(e) => return (StatusCode::BAD_REQUEST, format!("Invalid URL: {}", e)).into_response(),
    };
    let basepath = env::var("BASE_DIRECTORY").unwrap_or("index".to_string());
    let mut dir_path = PathBuf::from(basepath);
    if let Some(host) = parsed_url.host_str() {
        dir_path.push(host);
    }
    if let Some(port) = parsed_url.port() {
        dir_path.push(port.to_string());
    }
    if let Some(segments) = parsed_url.path_segments() {
        for segment in segments {
            dir_path.push(segment);
        }
    }
    // Nodeの parsedUrl.search は "?" を含むが、Rustの url.query() は含まない
    if let Some(query) = parsed_url.query() {
        dir_path.push(format!("?{}", query)); 
    }
    if let Some(fragment) = parsed_url.fragment() {
        dir_path.push(format!("#{}", fragment));
    }
    if let Err(e) = tokio::fs::create_dir_all(&dir_path).await {
        return (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to create dir: {}", e)).into_response();
    }
    let filename = format!("{}.html", chrono::Utc::now().timestamp_millis());
    let file_path = dir_path.join(filename);
    if let Err(e) = tokio::fs::write(&file_path, payload.body).await {
        return (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to write file: {}", e)).into_response();
    }

    Json(serde_json::json!({ "message": "Hello WebSave!" })).into_response()
}
