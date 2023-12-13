---
title: Enable client certificate authentication for Azure Web PubSub Service (Preview)
titleSuffix: Azure Web PubSub Service
description: How to enable client certificate authentication for Azure Web PubSub Service (Preview)
author: ArchangelSDY
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 06/20/2023
ms.author: dayshen
---

# Enable client certificate authentication for Azure Web PubSub Service (Preview)

You can restrict access to your Azure Web PubSub Service by enabling different types of authentication for it. One way to do it is to request a client certificate and validate the certificate in event handlers. This mechanism is called TLS mutual authentication or client certificate authentication. This article shows how to set up your Azure Web PubSub Service to use client certificate authentication.

> [!Note]
> Enabling client certificate authentication in browser scenarios is generally not recommended. Different browsers have different behaviors when dealing with client certificate request, while you have little control in JavaScript appliations. If you want to enable client certificate authentication, we recommend you in scenarios where you have strong control over TLS settings, for example, in native applications.

## Prerequisites

* An Azure account with an active subscription. If you don't have an Azure account, you can [create an account for free](https://azure.microsoft.com/free/).
* An Azure Web PubSub service (must be Standard tier or above).
* An Azure Function used to handle connect events.
* A client certificate. You need to know its SHA-1 thumbprint.

## Deploy Azure Web PubSub Service

Suppose you're going to use a function called `func-client-cert` as event handler to process `connect` events. Clients connect to a hub called `echo`. Here are the Bicep/ARM templates to deploy an Azure Web PubSub service with client certificate authentication enabled and event handlers configured.

We enable client certificate authentication via the property `tls.clientCertEnabled`.

We configure an event handler for `connect` event so we can validate client thumbprint. Also note that `anonymousConnectPolicy` needs to be set to `allow` so clients no longer need to send access tokens. 

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

### ARM

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

## Validate client certificate in event handler

You can validate incoming client certificate via its SHA-1 thumbprint in the `connect` event. The value is available in `clientCertificates` field. See [CloudEvents HTTP extension for event handler](reference-cloud-events.md#connect).

Here are sample function codes to implement validation logic.

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

In case you want to rotate the certificate, you can update your event handler code to accept multiple thumbprints.

## Missing client certificate

Azure Web PubSub Service doesn't abort TLS handshake when clients don't provide client certificate. It's up to event handler to decide whether to accept or reject a connection without client certificate.

## Next steps

* [How to configure event handler](howto-develop-eventhandler.md)
* [Golang sample](https://github.com/Azure/azure-webpubsub/blob/main/samples/golang/clientWithCert/Readme.md)