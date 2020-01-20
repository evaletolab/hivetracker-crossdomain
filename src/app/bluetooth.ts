
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
  value: string;
  error: string;
}

