---
title: Enable client certificate authentication for Azure Web PubSub (Preview)
titleSuffix: Azure Web PubSub Service
description: Learn how to enable client certificate authentication for Azure Web PubSub (Preview)
author: ArchangelSDY
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 06/20/2023
ms.author: dayshen
---

# Enable client certificate authentication for Azure Web PubSub (Preview)

You can restrict access to your instance of Azure Web PubSub by enabling different types of authentication for it. One authentication method is to request a client certificate and validate the certificate in event handlers. This mechanism is called *client certificate authentication* or *Transport Layer Security (TLS) mutual authentication*. This article shows you how to set up your Web PubSub instance to use client certificate authentication.

> [!NOTE]
> Enabling client certificate authentication in a browser scenario generally is not recommended. Different browsers have different behaviors when they process a client certificate request, and you have little control in a JavaScript application. If you want to enable client certificate authentication, we recommend that you use it in scenarios in which you have strong control over TLS settings. An example is in a native application.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure account, you can [create an account for free](https://azure.microsoft.com/free/).
* An Azure Web PubSub instance (must be minimum Standard tier).
* A function created in Azure Functions to handle connect events.
* A client certificate. You need to know its SHA-1 thumbprint.

## Deploy Web PubSub

In this example, you use a function called `func-client-cert` as an event handler to process `connect` events. Clients connect to a hub called `echo`. Here are the Bicep and Azure Resource Manager templates you use to deploy an Azure Web PubSub service with client certificate authentication enabled and event handlers configured.

The templates enable client certificate authentication via the property `tls.clientCertEnabled`.

The templates configure an event handler for the `connect` event to validate the client thumbprint. Also note that `anonymousConnectPolicy` is set to `allow` so that clients no longer need to send access tokens.

### Bicep

```bicep
param name string
param hubName string = 'echo'
param eventHandlerUrl string = 'https://func-client-cert.azurewebsites.net/api/echo'
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

### Azure Resource Manager

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "name": {
            "type": "String"
        },
        "hubName": {
            "defaultValue": "echo",
            "type": "String"
        },
        "eventHandlerUrl": {
            "defaultValue": "https://func-client-cert.azurewebsites.net/api/echo",
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

## Validate a client certificate in an event handler

You can validate an incoming client certificate via its SHA-1 thumbprint in the `connect` event. The value is available in `clientCertificates` field. For more information, see [CloudEvents HTTP extension for event handler](reference-cloud-events.md#connect).

The following code samples have function codes that you can use to implement validation logic.

### JavaScript

```javascript
module.exports = async function (context, req) {
   // For client connect event
   if (req.headers && req.headers['ce-type'] == 'azure.webpubsub.sys.connect') {
      // CLIENT_CERT_THUMBPRINT should be configured as an environment variable of valid client certificate SHA-1 thumbprint
      var validCertThumbprint = process.env['CLIENT_CERT_THUMBPRINT'];
      var certThumbprint = null;
      if (req.body.clientCertificates) {
          certThumbprint = req.body.clientCertificates[0].thumbprint;
      }
      if (certThumbprint != validCertThumbprint) {
          context.log('Expect client cert:', validCertThumbprint, 'but got:', certThumbprint);
          context.res = {
              status: 403
          };
          return;
      }
   }

   context.res = {
     // status: 200, /* Defaults to 200 */
     headers: {
         'WebHook-Allowed-Origin': '*'
     },
   };
}
```

## Certificate rotation

If you want to rotate the certificate, you can update your event handler code to accept multiple thumbprints.

## Missing client certificate

Azure Web PubSub doesn't abort a TLS handshake when a client doesn't provide a client certificate. It's up to the event handler to decide whether to accept or reject a connection without a client certificate.

## Related content

* [How to configure event handler](howto-develop-eventhandler.md)
* [Golang sample](https://github.com/Azure/azure-webpubsub/blob/main/samples/golang/clientWithCert/Readme.md)
