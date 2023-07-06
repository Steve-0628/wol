'use client';
import * as React from 'react';

export default function Home(): React.ReactElement {
  const [sentTimes, setSentTimes] = React.useState(0);
  const [isFetching, setIsFetching] = React.useState(false);
  const [mac, setMac] = React.useState('');
  const buttonclick = (): void => {
    if (mac.length !== 17) {
      return;
    }
    setIsFetching(true);
    const doFetch = async (): Promise<void> => {
      const data = await fetch('/api/wol', { method: 'POST', body: JSON.stringify({
        mac: mac,
      }) });
      const json = await data.json();
      setIsFetching(false);
    };
    doFetch();
    setSentTimes((prev) => prev + 1);
  };

  // function buttonclick(): void {
  //   setLikes(1);
  // }

  const standarizeMacAddrs = (evt: HTMLInputElement): void => {
    setMac((prev) => {
      const inputMac: string = evt.value.toUpperCase();
      if (inputMac.length > 17) {
        return prev;
      }
      if (inputMac.match(/[^0-9A-F:]/g) === null && inputMac.length > prev.length && inputMac.length <= 17) {
        if (inputMac.length % 3 === 2 && inputMac.length < 17) {
          return inputMac + ':';
        }
        return inputMac;
      } else {
        if (inputMac.match(/[^0-9A-F:]/g) === null) {
          return inputMac;
        } else {
          return prev;
        }
      }
    });
  };

  return (
    <div>
      <p>
        <button onClick={buttonclick} disabled={isFetching} >WoL</button>
        <input type="text" value={mac} onChange={(evt): void => {standarizeMacAddrs(evt.target);} } />
        <span>{sentTimes}</span>
      </p>
    </div>
  );
}
