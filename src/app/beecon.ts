
//
// description of a BEEcon command
export interface BEEconCMD {
  cmd: string;
  text: string;
  payload: number[];
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

