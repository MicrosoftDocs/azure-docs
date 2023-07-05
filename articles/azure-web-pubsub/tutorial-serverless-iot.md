---
title: Tutorial - Visualize IoT device data from IoT Hub using Azure Web PubSub service and Azure Functions
description: A tutorial to walk through how to use Azure Web PubSub service and Azure Functions to monitor device data from IoT Hub.
author: vicancy
ms.author: lianwei
ms.service: azure-web-pubsub
ms.custom: devx-track-azurecli
ms.topic: tutorial 
ms.date: 06/30/2022
---

# Tutorial: Visualize IoT device data from IoT Hub using Azure Web PubSub service and Azure Functions

In this tutorial, you'll learn how to use Azure Web PubSub service and Azure Functions to build a serverless application with real-time data visualization from IoT Hub.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Build a serverless data visualization app
> * Work together with Web PubSub function input and output bindings and Azure IoT hub
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

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub-cli](../../includes/iot-hub-include-create-hub-cli.md)]

## Create a Web PubSub instance

If you already have a Web PubSub instance in your Azure subscription, you can skip this section.

[!INCLUDE [create-instance-cli](includes/cli-awps-creation.md)]

## Create and run the functions locally

1. Create an empty folder for the project, and then run the following command in the new folder.

    # [JavaScript](#tab/javascript)
    ```bash
    func init --worker-runtime javascript
    ```
    ---

2. Update `host.json`'s `extensionBundle` to version _3.3.0_ or later to get Web PubSub support.

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
   - Update `index/index.js` with following code, which serves the HTML content as a static site.
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

4. Create an `index.html` file under the same folder as file `index.js`.

    ```html
    <!doctype html>

    <html lang="en">

    <head>
        <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js" type="text/javascript"
            charset="utf-8"></script>
        <script>
            document.addEventListener("DOMContentLoaded", async function (event) {
                const res = await fetch(`/api/negotiate?id=${1}`);
                const data = await res.json();
                const webSocket = new WebSocket(data.url);

                class TrackedDevices {
                    constructor() {
                        // key as the deviceId, value as the temperature array
                        this.devices = new Map();
                        this.maxLen = 50;
                        this.timeData = new Array(this.maxLen);
                    }

                    // Find a device temperature based on its Id
                    findDevice(deviceId) {
                        return this.devices.get(deviceId);
                    }

                    addData(time, temperature, deviceId, dataSet, options) {
                        let containsDeviceId = false;
                        this.timeData.push(time);
                        for (const [key, value] of this.devices) {
                            if (key === deviceId) {
                                containsDeviceId = true;
                                value.push(temperature);
                            } else {
                                value.push(null);
                            }
                        }

                        if (!containsDeviceId) {
                            const data = getRandomDataSet(deviceId, 0);
                            let temperatures = new Array(this.maxLen);
                            temperatures.push(temperature);
                            this.devices.set(deviceId, temperatures);
                            data.data = temperatures;
                            dataSet.push(data);
                        }

                        if (this.timeData.length > this.maxLen) {
                            this.timeData.shift();
                            this.devices.forEach((value, key) => {
                                value.shift();
                            })
                        }
                    }

                    getDevicesCount() {
                        return this.devices.size;
                    }
                }

                const trackedDevices = new TrackedDevices();
                function getRandom(max) {
                    return Math.floor((Math.random() * max) + 1)
                }
                function getRandomDataSet(id, axisId) {
                    return getDataSet(id, axisId, getRandom(255), getRandom(255), getRandom(255));
                }
                function getDataSet(id, axisId, r, g, b) {
                    return {
                        fill: false,
                        label: id,
                        yAxisID: axisId,
                        borderColor: `rgba(${r}, ${g}, ${b}, 1)`,
                        pointBoarderColor: `rgba(${r}, ${g}, ${b}, 1)`,
                        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.4)`,
                        pointHoverBackgroundColor: `rgba(${r}, ${g}, ${b}, 1)`,
                        pointHoverBorderColor: `rgba(${r}, ${g}, ${b}, 1)`,
                        spanGaps: true,
                    };
                }

                function getYAxy(id, display) {
                    return {
                        id: id,
                        type: "linear",
                        scaleLabel: {
                            labelString: display || id,
                            display: true,
                        },
                        position: "left",
                    };
                }

                // Define the chart axes
                const chartData = { datasets: [], };

                // Temperature (ºC), id as 0
                const chartOptions = {
                    responsive: true,
                    animation: {
                        duration: 250 * 1.5,
                        easing: 'linear'
                    },
                    scales: {
                        yAxes: [
                            getYAxy(0, "Temperature (ºC)"),
                        ],
                    },
                };
                // Get the context of the canvas element we want to select
                const ctx = document.getElementById("chart").getContext("2d");

                chartData.labels = trackedDevices.timeData;
                const chart = new Chart(ctx, {
                    type: "line",
                    data: chartData,
                    options: chartOptions,
                });

                webSocket.onmessage = function onMessage(message) {
                    try {
                        const messageData = JSON.parse(message.data);
                        console.log(messageData);

                        // time and either temperature or humidity are required
                        if (!messageData.MessageDate ||
                            !messageData.IotData.temperature) {
                            return;
                        }
                        trackedDevices.addData(messageData.MessageDate, messageData.IotData.temperature, messageData.DeviceId, chartData.datasets, chartOptions.scales);
                        const numDevices = trackedDevices.getDevicesCount();
                        document.getElementById("deviceCount").innerText =
                            numDevices === 1 ? `${numDevices} device` : `${numDevices} devices`;
                        chart.update();
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
                flex: 1;
                flex-basis: 40%;
                min-width: 30%;
                max-width: 100%;
            }

            a {
                color: #00B7FF;
            }
        </style>

        <title>Temperature Real-time Data</title>
    </head>

    <body>
        <h1 class="flexHeader">
            <span>Temperature Real-time Data</span>
            <span id="deviceCount">0 devices</span>
        </h1>
        <div id="charts">
            <canvas id="chart"></canvas>
        </div>
    </body>

    </html>
    ```

5. Create a `negotiate` function that clients use to get a service connection URL and access token.
    ```bash
    func new -n negotiate -t HttpTrigger
    ```
    # [JavaScript](#tab/javascript)
   - Update `negotiate/function.json` to include an input binding [`WebPubSubConnection`](reference-functions-bindings.md#input-binding), with the following json code.
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
                    "hub": "%hubName%",
                    "direction": "in"
                }
            ]
        }
        ```
   - Update `negotiate/index.js` to return the `connection` binding that contains the generated token.
        ```js
        module.exports = function (context, req, connection) {
            // Add your own auth logic here
            context.res = { body: connection };
            context.done();
        };
        ```

6. Create a `messagehandler` function to generate notifications by using the `"IoT Hub (Event Hub)"` template.
   ```bash
    func new --template "IoT Hub (Event Hub)" --name messagehandler
    ```
    # [JavaScript](#tab/javascript)
   - Update _messagehandler/function.json_ to add [Web PubSub output binding](reference-functions-bindings.md#output-binding) with the following json code. We use variable `%hubName%` as the hub name for both IoT eventHubName and Web PubSub hub.
        ```json
        {
            "bindings": [
                {
                    "type": "eventHubTrigger",
                    "name": "IoTHubMessages",
                    "direction": "in",
                    "eventHubName": "%hubName%",
                    "connection": "IOTHUBConnectionString",
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
   - Update `messagehandler/index.js` with the following code. It sends every message from IoT hub to every client connected to Web PubSub service using the Web PubSub output bindings.
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

7. Update the Function settings.
    
    1. Add `hubName` setting and replace `{YourIoTHubName}` with the hub name you used when creating your IoT Hub.

        ```bash
        func settings add hubName "{YourIoTHubName}"
        ```

    2. Get the **Service Connection String** for IoT Hub.

    ```azcli
    az iot hub connection-string show --policy-name service --hub-name {YourIoTHubName} --output table --default-eventhub
    ```

    Set `IOTHubConnectionString`, replacing `<iot-connection-string>` with the value.

    ```bash
    func settings add IOTHubConnectionString "<iot-connection-string>"
    ```

    3. Get the **Connection String** for Web PubSub.

    ```azcli
    az webpubsub key show --name "<your-unique-resource-name>" --resource-group "<your-resource-group>" --query primaryConnectionString
    ```

    Set `WebPubSubConnectionString`, replacing `<webpubsub-connection-string>` with the value.

    ```bash
    func settings add WebPubSubConnectionString "<webpubsub-connection-string>"
    ```

    > [!NOTE]
    > The `IoT Hub (Event Hub)` function trigger used in the sample has dependency on Azure Storage, but you can use a local storage emulator when the function is running locally. If you get an error such as `There was an error performing a read operation on the Blob Storage Secret Repository. Please ensure the 'AzureWebJobsStorage' connection string is valid.`, you'll need to download and enable [Storage Emulator](../storage/common/storage-use-emulator.md).

8. Run the function locally.

    Now you're able to run your local function by command below.

    ```bash
    func start
    ```

    You can visit your local host static page by visiting: `https://localhost:7071/api/index`.

## Run the device to send data

### Register a device

A device must be registered with your IoT hub before it can connect. If you already have a device registered in your IoT hub, you can skip this section.

1. Run the [az iot hub device-identity create](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-create) command in Azure Cloud Shell to create the device identity.

   **YourIoTHubName**: Replace this placeholder with the name you chose for your IoT hub.

    ```azurecli-interactive
    az iot hub device-identity create --hub-name {YourIoTHubName} --device-id simDevice
    ```

2. Run the [Az PowerShell module iot hub device-identity connection-string show](/cli/azure/iot/hub/device-identity/connection-string#az-iot-hub-device-identity-connection-string-show) command in Azure Cloud Shell to get the _device connection string_ for the device you just registered:

    **YourIoTHubName**: Replace this placeholder below with the name you chose for your IoT hub.

    ```azurecli-interactive
    az iot hub device-identity connection-string show --hub-name {YourIoTHubName} --device-id simDevice --output table
    ```

    Make a note of the device connection string, which looks like this:

   `HostName={YourIoTHubName}.azure-devices.net;DeviceId=simDevice;SharedAccessKey={YourSharedAccessKey}`

- For quickest results, simulate temperature data using the [Raspberry Pi Azure IoT Online Simulator](https://azure-samples.github.io/raspberry-pi-web-simulator/#Getstarted). Paste in the **device connection string**, and select the **Run** button.

- If you have a physical Raspberry Pi and BME280 sensor, you can measure and report real temperature and humidity values by following the [Connect Raspberry Pi to Azure IoT Hub (Node.js)](../iot-hub/iot-hub-raspberry-pi-kit-node-get-started.md) tutorial.

## Run the visualization website
Open function host index page: `http://localhost:7071/api/index` to view the real-time dashboard. Register multiple devices and you'll see the dashboard updates multiple devices in real-time. Open multiple browsers and you'll see every page is updated in real-time.

:::image type="content" source="media/tutorial-serverless-iot/iot-devices-sample.png" alt-text="Screenshot of multiple devices data visualization using Web PubSub service.":::

## Clean up resources

[!INCLUDE [quickstarts-free-trial-note](./includes/cli-delete-resources.md)]

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Create a simple chatroom with Azure Web PubSub](./tutorial-build-chat.md)

> [!div class="nextstepaction"]
> [Azure Web PubSub bindings for Azure Functions](./reference-functions-bindings.md)

> [!div class="nextstepaction"]
> [Explore more Azure Web PubSub samples](https://github.com/Azure/azure-webpubsub/tree/main/samples)
