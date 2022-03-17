---
title: Configure client authentication of incoming calls - Azure Event Grid IoT Edge | Microsoft Docs 
description: Learn about the possible client authentication configurations for the Event Grid module.  
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 02/15/2022
ms.subservice: iot-edge
ms.topic: article
---

# Configure client authentication of incoming calls

This guide gives examples of the possible client authentication configurations for the Event Grid module. The Event Grid module supports two types of client authentication:

* Shared access signature (SAS) key-based
* Certificate-based

See [Security and authentication](security-authentication.md) guide for all the possible configurations.

> [!IMPORTANT]
> On March 31, 2023, Event Grid on Azure IoT Edge support will be retired, so make sure to transition to IoT Edge native capabilities prior to that date. For more information, see [Transition from Event Grid on Azure IoT Edge to Azure IoT Edge](transition.md). 



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
