import { BEEconCMD } from './bluetooth';

const defaultHandler = (rsp) => {
  return "RAW:" + (rsp || []).join(':');
};



//
// FIXME protocol service should be refactored
export class BEEconDict {

  static commands: BEEconCMD[] = [
    {
      cmd: "0x06",
      text: "Get epoch time",
      payload: false
    },
    {
      cmd: "0x04",
      text: "Set epoch time",
      payload: true
    },
    {
      cmd: "0x07",
      text: "Set ID",
      payload: true
    },
    {
      cmd: "0x09",
      text: "Get ID",
      payload: false
    },
    {
      cmd: "0x0a",
      text: "Set sensor threshold",
      payload: true
    },
    {
      cmd: "0x0b",
      text: "Get sensor threshold",
      payload: false
    },
    {
      cmd: "0x0f",
      text: "Get last sensor measurement",
      payload: false
    },
    {
      cmd: "0x12",
      text: "Get All data logs",
      payload: true
    },
    {
      cmd: "0x15",
      text: "Get num logs & max logs",
      payload: false
    },
    {
      cmd: "0x18",
      text: "Get status",
      payload: false
    },
    {
      cmd: "0x22",
      text: "Get battery percentage",
      payload: false
    },
    {
      cmd: "0x23",
      text: "Set Beecon list",
      payload: true
    },
    {
      cmd: "0x25",
      text: "Get Beecon list",
      payload: false
    },
    {
      cmd: "0x28",
      text: "Get num Beecon in list",
      payload: false
    },
    {
      cmd: "0x2c",
      text: "Set thresholds 2?",
      payload: true
    }
  ];

  //
  // SPECs on PDF Document
  // Apparatus-APP air Protocol 1.0 (rev4)
  // The struct of the packet is:
  //  * SOF: 1 byte equal to 0x02
  //  * CMD: 1 byte for command identification
  //  * Data_length: 1 byte that is the length of the data field
  //  * data: variable length for the data.
  //  * CRC: 1 byte checksum of the packet.
  static prepareBufferCmd(cmd, data?) {
    let view;
    if (data) {
      const buffer = new ArrayBuffer(4 + data.length);
      view = new Uint8Array(buffer);

      view[0] = 0x02;
      view[1] = Number(cmd);
      view[2] = data.length;
      for (let i = 0; i < data.length; i++) {
        view[3 + i] = data[i];
      }
      //
      // CRC
      view[3 + data.length] = view.reduce((tot, num) => (tot += num), 0);
    } else {
      const buffer = new ArrayBuffer(4);
      view = new Uint8Array(buffer);
      view[0] = 0x02;
      view[1] = Number(cmd);
      view[2] = 0x00;
      //
      // CRC (FIXME this CRC function is not correct)
      view[3] = view.reduce((tot, num) => (tot += num));
    }
    return view;
  }


  //
  // decode buffer Get Sensors
  // 0x0b => 2:11:16:255:255:255:255:255:255:255:255:255:255:255:255:15:0:255:255:22
  // --> temp(Max[2],Min[2])
  // 0x09 => 2:8:6:1:0:0:0:0:65:76
  static decodeBuffer(bytes) {
    let raw = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      raw += bytes[i].toString();
      raw += ':';
    }

    return raw;
  }
}