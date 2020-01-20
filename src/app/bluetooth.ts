
export interface BEEcon {
  localName?: string;
  rssi?: number;
  address?: string;
  connected?: boolean;
  notify?: boolean;
}

export interface BEEconScan extends BEEcon {
  status: "scanStarted" | "scanStopped" | "scanResult" | "scanError" | "scanFilter" | "scanPaired" | "scanConnected" | "scanNotify" | string;
  error?: string;
  value?: string;
  list?: BEEcon[];
}

export const DEFAULT_SCAN_STATUS: BEEconScan = {
  status: "scanStopped"
};


//
// list of BLE actions needed for BEEcon
export interface BEEconService {
  characteristicsNotify(address: string);
  characteristicsCommand(address: string, cmd: string, payload?: number[]);
  connect(beecon: BEEcon);
  disconnect(addresses: string[]);
  init();
  askPermission();
  enable();
  disable();
  retrievePaired();
  scan();
  stop();
}

//
// description of a BEEcon command
export interface BEEconCMD {
  cmd: string;
  text: string;
  payload: boolean; // payload data ormat ex: 10-7-22 => [10,7,22]
}


//
// Run new job
export interface BEEconJob {
  action: string;
  addresses: string[];
  run: BEEconCMD;
}

//
// Return Job result
export interface BEEconJobResult {
  address: string;
  result: any;
  error: any;
}

