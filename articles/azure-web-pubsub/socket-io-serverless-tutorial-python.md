---
title: 'Tutorial: Publish data to Web PubSub for Socket.IO clients in Serverless Mode in Python with Azure Function'
description: In this tutorial, you learn how to use Web PubSub for Socket.IO with Azure Function in Serverless Mode to publish data to sockets with a real-time NASDAQ index update application
keywords: Socket.IO, serverless, azure function, Socket.IO on Azure, multi-node Socket.IO, scaling Socket.IO, socketio, azure socketio
author: zackliu
ms.author: chenyl
ms.date: 09/01/2024
ms.service: azure-web-pubsub
ms.topic: tutorial
---

# Tutorial: Publish data to Socket.IO clients in Serverless Mode in Azure Function with Python (Preview)

This tutorial guides you through how to publish data to Socket.IO clients in Serverless Mode in Python by creating a real-time NASDAQ index application integrated with Azure Function.

Find full code samples that are used in this tutorial:

- [Socket.IO Serverless Python Sample](https://github.com/Azure/azure-webpubsub/tree/main/sdk/webpubsub-socketio-extension/examples/publish-only-python)

> [!IMPORTANT]
> Default Mode needs a persistent server, you cannot integration Web PubSub for Socket.IO in default mode with Azure Function.

## Prerequisites

> [!div class="checklist"]
> * An Azure account with an active subscription. If you don't have one, you can [create a free account](https://azure.microsoft.com/free/). 
> * [Azure Function core tool](../azure-functions/functions-run-local.md)
> * Some familiarity with the Socket.IO library.

## Create a Web PubSub for Socket.IO resource in Serverless Mode

To create a Web PubSub for Socket.IO, you can use the following [Azure CLI](/cli/azure/install-azure-cli) command:

```azcli
az webpubsub create -g <resource-group> -n <resource-name>---kind socketio --service-mode serverless --sku Premium_P1
```

## Create an Azure Function project locally

You should follow the steps to initiate a local Azure Function project.

1. Follow to step to install the latest [Azure Function core tool](../azure-functions/functions-run-local.md#install-the-azure-functions-core-tools)

1. In the terminal window or from a command prompt, run the following command to create a project in the `SocketIOProject` folder:

    ```bash
    func init SocketIOProject --worker-runtime python
    ```

    This command creates a Python-based Function project. And enter the folder `SocketIOProject` to run the following commands.

1. Currently, the Function Bundle doesn't include Socket.IO Function Binding, so you need to manually add the package.

    1. To eliminate the function bundle reference, edit the host.json file and remove the following lines.

        ```json
        "extensionBundle": {
            "id": "Microsoft.Azure.Functions.ExtensionBundle",
            "version": "[4.*, 5.0.0)"
        }
        ```

    1. Run the command:

        ```bash
        func extensions install -p Microsoft.Azure.WebJobs.Extensions.WebPubSubForSocketIO -v 1.0.0-beta.4
        ```

1. Replace the content in `function_app.py` with the codes:

    ```python
    import random
    import azure.functions as func
    from azure.functions.decorators.core import DataType
    from azure.functions import Context
    import json

    app = func.FunctionApp()
    current_index= 14000

    @app.timer_trigger(schedule="* * * * * *", arg_name="myTimer", run_on_startup=False,
                use_monitor=False)
    @app.generic_output_binding("sio", type="socketio", data_type=DataType.STRING, hub="hub")
    def publish_data(myTimer: func.TimerRequest,
                    sio: func.Out[str]) -> None:
        change = round(random.uniform(-10, 10), 2)
        global current_index
        current_index = current_index + change
        sio.set(json.dumps({
            'actionName': 'sendToNamespace',
            'namespace': '/',
            'eventName': 'update',
            'parameters': [
                current_index
            ]
        }))

    @app.function_name(name="negotiate")
    @app.route(auth_level=func.AuthLevel.ANONYMOUS)
    @app.generic_input_binding("negotiationResult", type="socketionegotiation", hub="hub")
    def negotiate(req: func.HttpRequest, negotiationResult) -> func.HttpResponse:
        return func.HttpResponse(negotiationResult)

    @app.function_name(name="index")
    @app.route(auth_level=func.AuthLevel.ANONYMOUS)
    def index(req: func.HttpRequest) -> func.HttpResponse:
        path = './index.html'
        with open(path, 'rb') as f:
            return func.HttpResponse(f.read(), mimetype='text/html')
    ```

    Here's the explanation of these functions:

    - `publish_data`: This function updates the NASDAQ index every second with a random change and broadcasts it to connected clients with Socket.IO Output Binding.

    - `negotiate`: This function response a negotiation result to the client.

    - `index`: This function returns a static HTML page.


    Then add a `index.html` file

    Create the index.html file with the content:

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nasdaq Index</title>
        <style>
            /* Reset some default styles */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .container {
                background-color: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 300px;
                width: 100%;
            }

            .nasdaq-title {
                font-size: 2em;
                color: #003087;
                margin-bottom: 20px;
            }

            .index-value {
                font-size: 3em;
                color: #16a34a;
                margin-bottom: 30px;
                transition: color 0.3s ease;
            }

            .update-button {
                padding: 10px 20px;
                font-size: 1em;
                color: white;
                background-color: #003087;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            .update-button:hover {
                background-color: #002070;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="nasdaq-title">STOCK INDEX</div>
            <div id="nasdaqIndex" class="index-value">14,000.00</div>
        </div>

        <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
        <script>
            function updateIndexCore(newIndex) {
                newIndex = parseFloat(newIndex);
                currentIndex = parseFloat(document.getElementById('nasdaqIndex').innerText.replace(/,/g, ''))
                change = newIndex - currentIndex;
                // Update the index value in the DOM
                document.getElementById('nasdaqIndex').innerText = newIndex.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                
                // Optionally, change the color based on increase or decrease
                const indexElement = document.getElementById('nasdaqIndex');
                if (change > 0) {
                    indexElement.style.color = '#16a34a'; // Green for increase
                } else if (change < 0) {
                    indexElement.style.color = '#dc2626'; // Red for decrease
                } else {
                    indexElement.style.color = '#16a34a'; // Neutral color
                }
            }

            async function init() {
                const negotiateResponse = await fetch(`/api/negotiate`);
                if (!negotiateResponse.ok) {
                    console.log("Failed to negotiate, status code =", negotiateResponse.status);
                    return;
                }
                const negotiateJson = await negotiateResponse.json();
                socket = io(negotiateJson.endpoint, {
                    path: negotiateJson.path,
                    query: { access_token: negotiateJson.token}
                });

                socket.on('update', (index) => {
                    updateIndexCore(index);
                });
            }

            init();
        </script>
    </body>
    </html>
    ```

    The key part in the `index.html`:

    ```javascript
    async function init() {
        const negotiateResponse = await fetch(`/api/negotiate`);
        if (!negotiateResponse.ok) {
            console.log("Failed to negotiate, status code =", negotiateResponse.status);
            return;
        }
        const negotiateJson = await negotiateResponse.json();
        socket = io(negotiateJson.endpoint, {
            path: negotiateJson.path,
            query: { access_token: negotiateJson.token}
        });

        socket.on('update', (index) => {
            updateIndexCore(index);
        });
    }
    ```

    It first negotiates with the Function App to get the Uri and the path to the service. And register a callback to update index.

## How to run the App locally

After code is prepared, following the instructions to run the sample.

### Set up Azure Storage for Azure Function

Azure Functions requires a storage account to work even running in local. Choose either of the two following options:

* Run the free [Azurite emulator](../storage/common/storage-use-azurite.md).
* Use the Azure Storage service. This may incur costs if you continue to use it.

#### [Local emulation](#tab/storage-azurite) 

1. Install the Azurite

    ```bash
    npm install -g azurite
    ```

1. Start the Azurite storage emulator:

    ```bash
    azurite -l azurite -d azurite\debug.log
    ```

1. Make sure the `AzureWebJobsStorage` in *local.settings.json* set to `UseDevelopmentStorage=true`.

#### [Azure Blob Storage](#tab/azure-blob-storage) 

Update the project to use the Azure Blob Storage connection string.

```bash
func settings add AzureWebJobsStorage "<storage-connection-string>"
```

---

### Set up configuration of Web PubSub for Socket.IO

Add connection string to the Function APP:

```bash
func settings add WebPubSubForSocketIOConnectionString "<connection string>"
```

### Run Sample App

After tunnel tool is running, you can run the Function App locally:

```bash
func start
```

And visit the webpage at `http://localhost:7071/api/index`. 

:::image type="content" source="./media/socket-io-serverless-tutorial-python/python-sample.png" alt-text="Screenshot of the app.":::

## Next steps
Next, you can try to use Bicep to deploy the app online with identity-based authentication:

> [!div class="nextstepaction"]
> [Quickstart: Build chat app with Azure Function in Socket.IO Serverless Mode](./socket-io-serverless-quickstart.md)
