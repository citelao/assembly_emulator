
// Infinite loop
// const emulatorCommands: EmulatorCommand[] = [
//     "nop",
//     "nop",
//     { command: "set", register: "rb", value: 50 },
//     { command: "set", register: "ra", value: 150 },
//     { command: "set", register: "rc", value: 2 },
//     { command: "set", register: "rb", value: 30 },
//     { command: "set", register: "ra", value: 30 },
//     { command: "set", register: "rc", value: 80 },
//     { command: "increment", register: "rc", by: 1 },
//     { command: "increment", register: "rc", by: 1 },
//     { command: "increment", register: "rc", by: 1 },
//     { command: "increment", register: "rc", by: 1 },
//     { command: "add", to: "rc", a: "rc", b: "ra" },
//     { command: "increment", register: "rc", by: 1 },
//     { command: "increment", register: "rc", by: 1 },
//     { command: "increment", register: "rc", by: 1 },
//     { command: "jump", to: 9 },
//     "nop",
// ];

// Terminating loop
// const emulatorCommands: EmulatorCommand[] = [
//     { command: "set", register: "ra", value: 3},
//     { command: "set", register: "rc", value: 0},
//     "nop",
//     "nop",
//     "nop",
//     "nop",
//     { command: "increment", register: "rc", by: 1 },
//     { command: "jeq", to: 9, a: "rc", b: "ra" },
//     { command: "jump", to: 3},
//     "nop",
//     "nop",
//     "nop",
//     "nop",
//     "nop",
//     "nop",
// ];

// Assignment
// const emulatorCommands: EmulatorCommand[] = [
//     "nop",
//     "nop",
//     "nop",
//     "nop",
//     "nop",
//     { command: "set", register: "ra", value: 3},
//     { command: "set", register: "rb", value: 30},
//     { command: "store", from: "rb", to: 1 },
//     { command: "store", from: "ra", to: 0 },
//     { command: "load", from: 0, to: "rc" },
// ];

// Draw something
// const emulatorCommands: EmulatorCommand[] = [
//     "nop",
//     "nop",
//     "nop",
//     "nop",
//     "nop",
//     { command: "set", register: "ra", value: 1},
//     ...times((GRAPHICS_WIDTH / 2) - 4, (i): EmulatorCommand => {
//         const row_offset = 3;
//         const skip = 2;
//         // const width = 5;
//         return {command: "store", from: "ra", to: row_offset * GRAPHICS_WIDTH + i + skip }; 
//     }),
//     ...times((GRAPHICS_WIDTH / 2) - 4, (i): EmulatorCommand => {
//         const row_offset = 3;
//         const skip = (GRAPHICS_WIDTH / 2) + 2;
//         // const width = 5;
//         return {command: "store", from: "ra", to: row_offset * GRAPHICS_WIDTH + i + skip }; 
//     }),
//     ...times((GRAPHICS_WIDTH / 2) - 2, (i): EmulatorCommand => {
//         const row_offset = 4;
//         const skip = 1;
//         // const width = 5;
//         return {command: "store", from: "ra", to: row_offset * GRAPHICS_WIDTH + i + skip }; 
//     }),
//     ...times((GRAPHICS_WIDTH / 2) - 2, (i): EmulatorCommand => {
//         const row_offset = 4;
//         const skip = (GRAPHICS_WIDTH / 2) + 1;
//         // const width = 5;
//         return {command: "store", from: "ra", to: row_offset * GRAPHICS_WIDTH + i + skip }; 
//     }),
//     ...times(GRAPHICS_WIDTH - 2, (i): EmulatorCommand => {
//         const row_offset = 5;
//         const skip = 1;
//         // const width = 5;
//         return {command: "store", from: "ra", to: row_offset * GRAPHICS_WIDTH + i + skip }; 
//     }),
//     ...times(GRAPHICS_WIDTH, (i): EmulatorCommand => {
//         const row_offset = 6;
//         return {command: "store", from: "ra", to: row_offset * GRAPHICS_WIDTH + i }; 
//     }),
//     ...times(GRAPHICS_WIDTH - 2, (i): EmulatorCommand => {
//         const row_offset = 7;
//         const skip = 1;
//         return {command: "store", from: "ra", to: row_offset * GRAPHICS_WIDTH + i + skip }; 
//     }),
//     ...times(GRAPHICS_WIDTH - 4, (i): EmulatorCommand => {
//         const row_offset = 8;
//         const skip = 2;
//         return {command: "store", from: "ra", to: row_offset * GRAPHICS_WIDTH + i + skip }; 
//     }),
//     ...times(GRAPHICS_WIDTH - 6, (i): EmulatorCommand => {
//         const row_offset = 9;
//         const skip = 3;
//         return {command: "store", from: "ra", to: row_offset * GRAPHICS_WIDTH + i + skip }; 
//     }),
//     ...times(GRAPHICS_WIDTH - 8, (i): EmulatorCommand => {
//         const row_offset = 10;
//         const skip = 4;
//         return {command: "store", from: "ra", to: row_offset * GRAPHICS_WIDTH + i + skip }; 
//     }),
//     ...times(GRAPHICS_WIDTH - 10, (i): EmulatorCommand => {
//         const row_offset = 11;
//         const skip = 5;
//         return {command: "store", from: "ra", to: row_offset * GRAPHICS_WIDTH + i + skip }; 
//     }),
//     ...times(GRAPHICS_WIDTH - 12, (i): EmulatorCommand => {
//         const row_offset = 12;
//         const skip = 6;
//         return {command: "store", from: "ra", to: row_offset * GRAPHICS_WIDTH + i + skip }; 
//     }),
//     ...times(GRAPHICS_WIDTH - 14, (i): EmulatorCommand => {
//         const row_offset = 13;
//         const skip = 7;
//         return {command: "store", from: "ra", to: row_offset * GRAPHICS_WIDTH + i + skip }; 
//     }),
// ];