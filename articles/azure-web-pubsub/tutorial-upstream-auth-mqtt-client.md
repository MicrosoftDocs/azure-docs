---
title: Tutorial - Authenticate and authorize MQTT clients with Azure Web PubSub event handlers
description: A tutorial to walk through how to authenticate and authorize MQTT clients based on client certificates, username, and password.
author: Y-Sindo
ms.author: zityang
ms.service: azure-web-pubsub
ms.topic: tutorial
ms.date: 07/12/2024
---

# Tutorial - Authenticate and authorize MQTT clients based on client certificates with event handlers

In this tutorial, you'll learn how to write a .NET web server to authenticate and authorize MQTT clients.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure account, you can [create an account for free](https://azure.microsoft.com/free/).
* An Azure Web PubSub service (must be Standard tier or above).
* A client certificate in PEM format.
* [.NET Runtime](https://dotnet.microsoft.com/download/dotnet) installed.
* [Node.js](https://nodejs.org)

## Deploy Azure Web PubSub Service

Here are the Bicep/Azure Resource Manager templates to deploy an Azure Web PubSub service with client certificate authentication enabled and event handlers configured.

We configure the `connect` event handler to tell the service the webhook endpoint for authenticating and authorizing clients. We set it to `tunnel:///MqttConnect`. `tunnel://` is a special syntax leveraging the [awps-tunnel](./howto-web-pubsub-tunnel-tool.md) tool to expose your local auth server to public network. `/MqttConnect` is the endpoint that will be exposed by your local auth server.

We enable client certificate authentication via the property `tls.clientCertEnabled` so that the client certificate is sent to your server in the `connect` event.

Also note that `anonymousConnectPolicy` needs to be set to `allow` so clients no longer need to send access tokens.

# [Bicep](#tab/bicep)

```bicep
param name string
param hubName string = 'hub1'
param eventHandlerUrl string = 'tunnel:///MqttConnect'
param location string = resourceGroup().location

resource awps 'Microsoft.SignalRService/WebPubSub@2023-03-01-preview' = {
  name: name
  location: location
  sku: {
    name: 'Standard_S1'
    tier: 'Standard'
    size: 'S1'
    capacity: 1
  }
  properties: {
    tls: {
      clientCertEnabled: true
    }
  }
}

resource hub 'Microsoft.SignalRService/WebPubSub/hubs@2023-03-01-preview' = {
  parent: awps
  name: '${hubName}'
  properties: {
    eventHandlers: [
      {
        urlTemplate: eventHandlerUrl
        userEventPattern: '*'
        systemEvents: [
          'connect'
        ]
      }
    ]
    anonymousConnectPolicy: 'allow'
  }
}
```

# [Azure Resource Manager](#tab/arm)

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "name": {
            "type": "String"
        },
        "hubName": {
            "defaultValue": "hub1",
            "type": "String"
        },
        "eventHandlerUrl": {
            "defaultValue": "tunnel:///MqttConnect",
            "type": "String"
        },
        "location": {
            "defaultValue": "[resourceGroup().location]",
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.SignalRService/WebPubSub",
            "apiVersion": "2023-03-01-preview",
            "name": "[parameters('name')]",
            "location": "[parameters('location')]",
            "sku": {
                "name": "Standard_S1",
                "tier": "Standard",
                "size": "S1",
                "capacity": 1
            },
            "properties": {
                "tls": {
                    "clientCertEnabled": true
                }
            }
        },
        {
            "type": "Microsoft.SignalRService/WebPubSub/hubs",
            "apiVersion": "2023-03-01-preview",
            "name": "[concat(parameters('name'), '/', parameters('hubName'))]",
            "dependsOn": [
                "[resourceId('Microsoft.SignalRService/WebPubSub', parameters('name'))]"
            ],
            "properties": {
                "eventHandlers": [
                    {
                        "urlTemplate": "[parameters('eventHandlerUrl')]",
                        "userEventPattern": "*",
                        "systemEvents": [
                            "connect"
                        ]
                    }
                ],
                "anonymousConnectPolicy": "allow"
            }
        }
    ]
}
```

---

## Set Up Auth Server

We've provided an auth server sample [here](https://github.com/Azure/azure-webpubsub/tree/main/samples/csharp/mqttAuthServer). Please download the project.

Let's take a look at the project structure:
```
- mqttAuthServer
  - Models
    - MqttConnectEventRequest.cs
    - ...
  - MqttAuthServer.csproj
  - Program.cs
```

The `Models` directory contains all the model files to describe the request and response body of MQTT `connect` event. The `Program.cs` contains the logic to handle MQTT `connect` event, including parsing the client certificate contents from request, validating the certificates, and authorizing the client.

The following code snippet is the main logic of handling `connect` event request:
```cs
    var request = await httpContext.Request.ReadFromJsonAsync<MqttConnectEventRequest>();
    var certificates = request.ClientCertificates.Select(cert => GetCertificateFromPemString(cert.Content));
    // Simulate Logic to validate client certificate
    if (!request.Query.TryGetValue("failure", out _))
    {
        // As a demo, we just accept all client certificates and grant the clients with permissions to publish and subscribe to all the topics when the query parameter "success" is present.
        await httpContext.Response.WriteAsJsonAsync(new MqttConnectEventSuccessResponse()
        {
            Roles = ["webpubsub.joinLeaveGroup", "webpubsub.sendToGroup"]
        });
    }
    else
    {
        // If you want to reject the connection, you can return a MqttConnectEventFailureResponse
        var mqttCodeForUnauthorized = request.Mqtt.ProtocolVersion switch
        {
            4 => 5, // UnAuthorized Return Code in Mqtt 3.1.1
            5 => 0x87, // UnAuthorized Reason Code in Mqtt 5.0
            _ => throw new NotSupportedException($"{request.Mqtt.ProtocolVersion} is not supported.")
        };
        httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        await httpContext.Response.WriteAsJsonAsync(new MqttConnectEventFailureResponse(new MqttConnectEventFailureResponseProperties()
        {
            Code = mqttCodeForUnauthorized,
            Reason = "Invalid Certificate"
        }
        ));
    }
```

To run the project, execute the following command in the root directory.
```dotnetcli
dotnet run
```


### Expose Server Endpoint To Public Network

#### Download and install awps-tunnel
The tool runs on [Node.js](https://nodejs.org/) version 16 or higher.

```bash
npm install -g @azure/web-pubsub-tunnel-tool
```

#### Use the service connection string and run
```bash
export WebPubSubConnectionString="<your connection string>"
awps-tunnel run --hub {hubName} --upstream http://localhost:{portExposedByYourAuthServer}
```

## Implement MQTT Clients

We will implement the client side in Node.JS.

Initialize a NodeJS project with the following command.
```bash
npm init
```

Install the `mqtt` module.
```bash
npm install mqtt
```

Create a new file named `index.js`, and add the following code to the file.

```javascript
const mqtt = require('mqtt');

var client = mqtt.connect(`wss://{serviceName}.webpubsub.azure.com/clients/mqtt/hubs/{hubName}`,
    {
        clientId: "client1",
        cert: `-----BEGIN CERTIFICATE-----
{Complete the certificate here}
-----END CERTIFICATE-----`,
        key: `-----BEGIN PRIVATE KEY-----
{Complete the private key here}
-----END PRIVATE KEY-----`,
        protocolVersion: 5,
    });
client.on("connect", (connack) => {
    console.log("connack", connack);
});
client.on("error", (err) => {
    console.log(err);
});
```

Update the `index.js`:
* Update the `{serviceName}` and `{hubName}` variable according to the resources you created.
* Complete the client certificate and key in the file.

Then you're able to run the project with command
```bash
node index.js
```

If everything works well, you'll be able to see a successful CONNACK response printed in the console.

```
connack Packet {
  cmd: 'connack',
  retain: false,
  qos: 0,
  dup: false,
  length: 2,
  topic: null,
  payload: null,
  sessionPresent: false,
  returnCode: 0
}
```

To simulate the certificate validation failure, append a failure query to the connection URL as this
```js
var client = mqtt.connect(`wss://{serviceName}.webpubsub.azure.com/clients/mqtt/hubs/{hubName}?failure=xxx`,
```

And rerun the client, you'll be able to see an unauthorized CONNACK response.

## Next step

Now that you have known that how to authenticate and authorize MQTT clients e2e.
Next, you can check our event handler protocol for MQTT clients.

> [!div class="nextstepaction"]
> [Reference - CloudEvents extension for Azure Web PubSub MQTT event handler with HTTP protocol](./reference-mqtt-cloud-events.md)

