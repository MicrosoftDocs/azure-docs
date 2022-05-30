---
title: Tutorial - Visualize IoT device data from IoT Hub using Azure Web PubSub service and Azure Functions
description: A tutorial to walk through how to use Azure Web PubSub service and Azure Functions to monitor device data from IoT Hub.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.topic: tutorial 
ms.date: 06/01/2022
---

# Tutorial: Visualize IoT device data from IoT Hub using Azure Web PubSub service and Azure Functions

In this tutorial, you learn how to use Azure Web PubSub service and Azure Functions to build a serverless application with real-time data visualization from IoT Hub. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Build a serverless data visualization app
> * Work with Web PubSub function input and output bindings
> * Work together with Azure IoT hub
> * Run the sample functions locally

## Prerequisites

# [JavaScript](#tab/javascript)

* A code editor, such as [Visual Studio Code](https://code.visualstudio.com/)

* [Node.js](https://nodejs.org/en/download/), version 10.x.
   > [!NOTE]
   > For more information about the supported versions of Node.js, see [Azure Functions runtime versions documentation](../azure-functions/functions-versions.md#languages).

* [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) (v3 or higher preferred) to run Azure Function apps locally and deploy to Azure.

* The [Azure CLI](/cli/azure) to manage Azure resources.

---

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a Web PubSub instance
[!INCLUDE [create-instance-cli](includes/cli-awps-creation.md)]

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub-quickstart.md)]

## Create and run the functions locally

1. Make sure you have [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools#installing) installed. And then create an empty directory for the project. Run command under this working directory.

    # [JavaScript](#tab/javascript)
    ```bash
    func init --worker-runtime javascript
    ```
    ---

2. Update `host.json`'s `extensionBundle` to version larger than '3.3.0` which contains Web PubSub support.

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[3.3.*, 4.0.0)"
    }
}
```

3. Create an `index` function to read and host a static web page for clients.
    ```bash
    func new -n index -t HttpTrigger
    ```
   # [JavaScript](#tab/javascript)
   - Update `index/index.js` and copy following codes.
        ```js
        var fs = require("fs");
        var path = require("path");

        module.exports = function (context, req) {
        let index = path.join(
            context.executionContext.functionDirectory,
            "index.html"
        );
        fs.readFile(index, "utf8", function (err, data) {
            if (err) {
                console.log(err);
                context.done(err);
                return;
            }
            context.res = {
                status: 200,
                headers: {
                    "Content-Type": "text/html",
                },
                body: data,
            };
            context.done();
            });
        };

        ```

4. Create this 'index.html' file under the same folder as file 'index.js':

```html
<!doctype html>

<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <script src="https://code.jquery.com/jquery-3.4.0.min.js"
        integrity="sha256-BJeo0qm959uMBGb65z40ejJYGSgR7REI4+CW1fNKwOg=" crossorigin="anonymous"" type=" text/javascript"
        charset="utf-8"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js" type="text/javascript"
        charset="utf-8"></script>
    <script>
        $(document).ready(async () => {
            const res = await fetch(`/api/negotiate?id=${1}`);
            const data = await res.json();
            const webSocket = new WebSocket(data.url);

            // A class for holding the last N points of telemetry for a device
            class DeviceData {
                constructor(deviceId) {
                    this.deviceId = deviceId;
                    this.maxLen = 50;
                    this.timeData = new Array(this.maxLen);
                    this.temperatureData = new Array(this.maxLen);
                    this.humidityData = new Array(this.maxLen);
                }

                bind(chart) {
                    this.chart = chart;
                }

                addData(time, temperature, humidity) {
                    this.timeData.push(time);
                    this.temperatureData.push(temperature);
                    this.humidityData.push(humidity || null);

                    if (this.timeData.length > this.maxLen) {
                        this.timeData.shift();
                        this.temperatureData.shift();
                        this.humidityData.shift();
                    }
                }
            }

            // All the devices in the list (those that have been sending telemetry)
            class TrackedDevices {
                constructor() {
                    this.devices = [];
                }

                // Find a device based on its Id
                findDevice(deviceId) {
                    for (let i = 0; i < this.devices.length; ++i) {
                        if (this.devices[i].deviceId === deviceId) {
                            return this.devices[i];
                        }
                    }

                    return undefined;
                }

                getDevicesCount() {
                    return this.devices.length;
                }
            }

            const trackedDevices = new TrackedDevices();

            function initChart(canvasElement, device) {
                // Define the chart axes
                const chartData = {
                    datasets: [
                        {
                            fill: false,
                            label: "Temperature",
                            yAxisID: "Temperature",
                            borderColor: "rgba(255, 204, 0, 1)",
                            pointBoarderColor: "rgba(255, 204, 0, 1)",
                            backgroundColor: "rgba(255, 204, 0, 0.4)",
                            pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
                            pointHoverBorderColor: "rgba(255, 204, 0, 1)",
                            spanGaps: true,
                        },
                        {
                            fill: false,
                            label: "Humidity",
                            yAxisID: "Humidity",
                            borderColor: "rgba(24, 120, 240, 1)",
                            pointBoarderColor: "rgba(24, 120, 240, 1)",
                            backgroundColor: "rgba(24, 120, 240, 0.4)",
                            pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
                            pointHoverBorderColor: "rgba(24, 120, 240, 1)",
                            spanGaps: true,
                        },
                    ],
                };

                const chartOptions = {
                    responsive: true,
                    scales: {
                        yAxes: [
                            {
                                id: "Temperature",
                                type: "linear",
                                scaleLabel: {
                                    labelString: "Temperature (ºC)",
                                    display: true,
                                },
                                position: "left",
                            },
                            {
                                id: "Humidity",
                                type: "linear",
                                scaleLabel: {
                                    labelString: "Humidity (%)",
                                    display: true,
                                },
                                position: "right",
                            },
                        ],
                    },
                };

                chartData.labels = device.timeData;
                chartData.datasets[0].data = device.temperatureData;
                chartData.datasets[1].data = device.humidityData;

                // Get the context of the canvas element we want to select
                const ctx = canvasElement.getContext("2d");
                return new Chart(ctx, {
                    type: "line",
                    data: chartData,
                    options: chartOptions,
                });
            }

            const deviceCount = document.getElementById("deviceCount");

            // When a web socket message arrives:
            // 1. Unpack it
            // 2. Validate it has date/time and temperature
            // 3. Find or create a cached device to hold the telemetry data
            // 4. Append the telemetry data
            // 5. Update the chart UI
            webSocket.onmessage = function onMessage(message) {
                try {
                    const messageData = JSON.parse(message.data);
                    console.log(messageData);

                    // time and either temperature or humidity are required
                    if (
                        !messageData.MessageDate ||
                        (!messageData.IotData.temperature && !messageData.IotData.humidity)
                    ) {
                        return;
                    }

                    // find or add device to list of tracked devices
                    let existingDeviceData = trackedDevices.findDevice(
                        messageData.DeviceId
                    );

                    if (existingDeviceData) {
                        existingDeviceData.addData(
                            messageData.MessageDate,
                            messageData.IotData.temperature,
                            messageData.IotData.humidity
                        );
                    } else {
                        const newDeviceData = new DeviceData(messageData.DeviceId);
                        trackedDevices.devices.push(newDeviceData);
                        const numDevices = trackedDevices.getDevicesCount();
                        deviceCount.innerText =
                            numDevices === 1 ? `${numDevices} device` : `${numDevices} devices`;
                        newDeviceData.addData(
                            messageData.MessageDate,
                            messageData.IotData.temperature,
                            messageData.IotData.humidity
                        );

                        // add device to the UI list
                        const container = document.createElement("div");
                        container.className = "chartContainer";
                        const header = document.createElement("h3");
                        header.textContent = newDeviceData.deviceId;
                        container.appendChild(header);
                        const canvas = document.createElement("canvas");
                        container.appendChild(canvas);
                        document.getElementById("charts").appendChild(container);
                        newDeviceData.bind(initChart(canvas, newDeviceData));
                        existingDeviceData = newDeviceData;
                    }

                    existingDeviceData.chart.update();
                } catch (err) {
                    console.error(err);
                }
            };
        });


    </script>
    <style>
        body {
            font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
            padding: 50px;
            margin: 0;
            text-align: center;
        }

        .flexHeader {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-between;
        }

        #charts {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-around;
            align-content: stretch;
        }

        .chartContainer {
            flex-basis: 45%;
        }

        a {
            color: #00B7FF;
        }

        body select {
            padding: 10px 70px 10px 13px;
            max-width: 100%;
            height: auto;
            border: 1px solid #e3e3e3;
            border-radius: 3px;
            background: url("https://i.ibb.co/b7xjLrB/selectbox-arrow.png") right center no-repeat;
            background-color: #fff;
            color: #444444;
            line-height: 16px;
            appearance: none;
            /* this is must */
            -webkit-appearance: none;
            -moz-appearance: none;
        }

        /* body select.select_box option */
        body select option {
            padding: 0 4px;
        }

        /* for Edge */
        select::-ms-expand {
            display: none;
        }

        select:disabled::-ms-expand {
            background: #f60;
        }
    </style>

    <title>Temperature &amp; Humidity Real-time Data</title>
</head>

<body>
    <h1 class="flexHeader">
        <span id="deviceCount">0 devices</span>
        <span>Temperature & Humidity Real-time Data</span>
    </h1>
    <div id="charts">
    </div>
</body>

</html>
```

5. Create a `negotiate` function to help clients get service connection url with access token.
    ```bash
    func new -n negotiate -t HttpTrigger
    ```
    # [JavaScript](#tab/javascript)
   - Update `negotiate/function.json` to include input binding [`WebPubSubConnection`](reference-functions-bindings#input-binding), with the following json codes.
        ```json
        {
            "bindings": [
                {
                    "authLevel": "anonymous",
                    "type": "httpTrigger",
                    "direction": "in",
                    "name": "req"
                },
                {
                    "type": "http",
                    "direction": "out",
                    "name": "res"
                },
                {
                    "type": "webPubSubConnection",
                    "name": "connection",
                    "hub": "notification",
                    "direction": "in"
                }
            ]
        }
        ```
   - Update `negotiate/index.js` and copy following codes.
        ```js
        module.exports = function (context, req, connection) {
            context.res = { body: connection };
            context.done();
        };
        ```

6. Create a `messagehandler` function to generate notifications with `TimerTrigger`.
   ```bash
    func new --template "IoT Hub (Event Hub)" --name messagehandler
    ```
    # [JavaScript](#tab/javascript)
   - Update `messagehandler/function.json` to add [Web PubSub output binding](reference-functions-bindings#output-binding) with the following json codes. Please note that we use variable `%hubName%` as the hub name for both IoT eventHubName and Web PubSub hub.
        ```json
        {
            "bindings": [
            {
                "type": "eventHubTrigger",
                "name": "%hubName%",
                "direction": "in",
                "eventHubName": "samples-workitems",
                "connection": "",
                "cardinality": "many",
                "consumerGroup": "$Default",
                "dataType": "string"
            },
            {
                "type": "webPubSub",
                "name": "actions",
                "hub": "%hubName%",
                "direction": "out"
            }
            ]
        }
        ```
   - Update `messagehandler/index.js` and copy following codes. We can see from the code that for every message from IoT hub, we trigger the Web PubSub output binding to send the message to every client connected to Web PubSub service.
        ```js
        module.exports = function (context, IoTHubMessages) {
        IoTHubMessages.forEach((message) => {
            const deviceMessage = JSON.parse(message);
            context.log(`Processed message: ${message}`);
            context.bindings.actions = {
            actionName: "sendToAll",
            data: JSON.stringify({
                IotData: deviceMessage,
                MessageDate: deviceMessage.date || new Date().toISOString(),
                DeviceId: deviceMessage.deviceId,
            }),
            };
        });

        context.done();
        };
        ```

7. Update the settings
    
    1. Add `hubName` setting and the value is `{YourIoTHubName}` used when creating your IoT Hub：

        ```bash
        func settings add hubName "{YourIoTHubName}"
        ```

    2. Get the **Service Connection String** for IoT Hub using below CLI command, and set the `IOTHubConnectionString` with `<iot-connection-string>` replaced with your value as needed.

    ```azcli
    az iot hub connection-string show --policy-name service --hub-name {YourIoTHubName} --output table --default-eventhub
    ```
    ```bash
    func settings add IOTHubConnectionString "<iot-connection-string>"
    ```

    3. Get the **Connection String** for Web PubSub using below CLI command, and set the `WebPubSubConnectionString` with `<webpubsub-connection-string>` replaced with your value as needed.

    ```azcli
    az webpubsub key show --name "<your-unique-resource-name>" --resource-group "<your-resource-group>" --query primaryConnectionString
    ```
    ```bash
    func settings add WebPubSubConnectionString "<webpubsub-connection-string>"
    ```

    > [!NOTE]
    > `IoT Hub (Event Hub)` used in the sample has dependency on Azure Storage, but you can use local storage emulator when the Function is running locally. If you got some error like `There was an error performing a read operation on the Blob Storage Secret Repository. Please ensure the 'AzureWebJobsStorage' connection string is valid.`, you'll need to download and enable [Storage Emulator](../storage/common/storage-use-emulator.md).

    Now you're able to run your local function by command below.

    ```bash
    func start
    ```

    And checking the running logs, you can visit your local host static page by visiting: `https://localhost:7071/api/index`.

## Run the device to send data

### Register a device

A device must be registered with your IoT hub before it can connect.

If you already have a device registered in your IoT hub, you can skip this section.

1. Run the [az iot hub device-identity create](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-create) command in Azure Cloud Shell to create the device identity.

   **YourIoTHubName**: Replace this placeholder below with the name you chose for your IoT hub.

   **MyNodeDevice**: This is the name of the device you're registering. It's recommended to use **MyNodeDevice** as shown. If you choose a different name for your device, you also need to use that name throughout this article, and update the device name in the sample applications before you run them.

    ```azurecli-interactive
    az iot hub device-identity create \
      --hub-name {YourIoTHubName} --device-id MyNodeDevice
    ```

2. Run the [az iot hub device-identity connection-string show](/cli/azure/iot/hub/device-identity/connection-string#az-iot-hub-device-identity-connection-string-show) command in Azure Cloud Shell to get the _device connection string_ for the device you just registered:

    **YourIoTHubName**: Replace this placeholder below with the name you chose for your IoT hub.

    ```azurecli-interactive
    az iot hub device-identity connection-string show \
      --hub-name {YourIoTHubName} \
      --device-id MyNodeDevice \
      --output table
    ```

    Make a note of the device connection string, which looks like:

   `HostName={YourIoTHubName}.azure-devices.net;DeviceId=MyNodeDevice;SharedAccessKey={YourSharedAccessKey}`

- For quickest results, simulate temperature data using the [Raspberry Pi Azure IoT Online Simulator](https://azure-samples.github.io/raspberry-pi-web-simulator/#Getstarted). Paste in the **device connection string**, and select the **Run** button.

- If you have a physical Raspberry Pi and BME280 sensor, you may measure and report real temperature and humidity values by following the [Connect Raspberry Pi to Azure IoT Hub (Node.js)](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-raspberry-pi-kit-node-get-started) tutorial.

## Run the visualization website
Open function host index page: `http://localhost:7071/api/index` to view the real-time dashboard.

## Clean up resources

If you're not going to continue to use this app, delete all resources created by this doc with the following steps so you don't incur any charges:

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group you created. You may use the search box to find the resource group by its name instead.

1. In the window that opens, select the resource group, and then select **Delete resource group**.

1. In the new window, type the name of the resource group to delete, and then select **Delete**.

## Next steps

In this quickstart, you learned how to run a serverless chat application. Now, you could start to build your own application. 

> [!div class="nextstepaction"]
> [Tutorial: Create a simple chatroom with Azure Web PubSub](https://azure.github.io/azure-webpubsub/getting-started/create-a-chat-app/js-handle-events)

> [!div class="nextstepaction"]
> [Azure Web PubSub bindings for Azure Functions](https://azure.github.io/azure-webpubsub/references/functions-bindings)

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://github.com/Azure/azure-webpubsub/tree/main/samples)
