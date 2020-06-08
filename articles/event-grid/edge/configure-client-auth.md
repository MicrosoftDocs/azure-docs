---
title: Configure client authentication of incoming calls - Azure Event Grid IoT Edge | Microsoft Docs 
description: Configure API protocols exposed by Event Grid on IoT Edge.  
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/03/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Configure client authentication of incoming calls

This guide gives examples of the possible client authentication configurations for the Event Grid module. The Event Grid module supports two types of client authentication:

* Shared access signature (SAS) key-based
* Certificate-based

See [Security and authentication](security-authentication.md) guide for all the possible configurations.

## Enable certificate-based client authentication, no self-signed certificates

```json
 {
  "Env": [
    "inbound__clientAuth__sasKeys__enabled=false",
    "inbound__clientAuth__clientCert__enabled=true",
    "inbound__clientAuth__clientCert__source=IoTEdge",
    "inbound__clientAuth__clientCert__allowUnknownCA=false"
  ]
}
 ```

## Enable certificate-based client authentication, allow self-signed certificates

```json
 {
  "Env": [
    "inbound__clientAuth__sasKeys__enabled=false",
    "inbound__clientAuth__clientCert__enabled=true",
    "inbound__clientAuth__clientCert__source=IoTEdge",
    "inbound__clientAuth__clientCert__allowUnknownCA=true"
  ]
}
```

>[!NOTE]
>Set the property **inbound__clientAuth__clientCert__allowUnknownCA** to **true** only in test environments as you might typically use self-signed certificates. For production workloads, we recommend that you set this property to **false** and certificates from a certificate authority (CA).

## Enable certificate-based and sas-key based client authentication

```json
 {
  "Env": [
    "inbound__clientAuth__sasKeys__enabled=true",
    "inbound__clientAuth__sasKeys__key1=<some-secret1-here>",
    "inbound__clientAuth__sasKeys__key2=<some-secret2-here>",
    "inbound__clientAuth__clientCert__enabled=true",
    "inbound__clientAuth__clientCert__source=IoTEdge",
    "inbound__clientAuth__clientCert__allowUnknownCA=true"
  ]
}
 ```

>[!NOTE]
>SAS key-based client authentication allows a non-IoT edge module to do management and runtime operations assuming of course the API ports are accessible outside the IoT Edge network.
