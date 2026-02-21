FROM rust:1.93.1-slim-trixie as builder

RUN cargo new --bin wol
WORKDIR /wol

COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml
RUN cargo build --release
RUN rm src/*.rs


COPY ./src ./src
RUN touch src/main.rs
RUN cargo build --release


FROM debian:trixie-20260202-slim
COPY --from=builder /wol/target/release/wol /


CMD ["/wol"]