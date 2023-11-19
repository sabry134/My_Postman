const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

function sendRequest() {
  const urlInput = document.getElementById('urlInput').value;
  const methodSelect = document.getElementById('methodSelect');
  const selectedMethod = methodSelect.options[methodSelect.selectedIndex].value;
  const headersInput = document.getElementById('headersInput').value;
  const bodyInput = document.getElementById('bodyInput').value;

  const requestOptions = {
    method: selectedMethod,
    headers: parseHeaders(headersInput),
    body: bodyInput,
  };

  fetch(urlInput, requestOptions)
    .then(response => response.text())
    .then(data => {
      const responseContainer = document.getElementById('responseContainer');
      const truncatedData = data.length > 1000 ? data.substring(0, 1000) + '...' : data;
      let parsedData;

      try {
        parsedData = JSON.parse(data);
        responseContainer.innerHTML = `<pre>${JSON.stringify(parsedData, null, 2)}</pre>`;
      } catch (error) {
        responseContainer.innerHTML = `<pre>${truncatedData}</pre>`;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      const responseContainer = document.getElementById('responseContainer');
      responseContainer.innerHTML = `<pre>Error: ${error.message}</pre>`;
    });
}

function parseHeaders(headersInput) {
  const headers = new Headers();

  if (headersInput) {
    const headerLines = headersInput.split('\n');
    headerLines.forEach(line => {
      const [name, value] = line.split(':');
      if (name && value) {
        headers.append(name.trim(), value.trim());
      }
    });
  }

  return headers;
}
