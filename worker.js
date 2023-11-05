onmessage = (event) => {
  const { msg, data } = event.data;

  if (msg === "write") {
    writeFile(data);
  }
  if (msg === "read") {
    readFile();
  }
};

async function readFile() {
  try {
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle("pushup.txt");
    const file = await fileHandle.getFile();
    const existingData = await file.text();
    postMessage({ msg: "read", data: JSON.parse(existingData) });
  } catch {
    postMessage({ msg: "error", data:{} });
  }
}

async function writeFile(data) {
  const root = await navigator.storage.getDirectory();
  const draftHandle = await root.getFileHandle("pushup.txt", { create: true });
  const accessHandle = await draftHandle.createSyncAccessHandle();
  await accessHandle.truncate(0);
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(data);
  const writeBuffer = accessHandle.write(encodedMessage, { at: 0 });
  accessHandle.flush();
  accessHandle.close();
  readFile();
}
