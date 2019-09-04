---
title: Configure identity - Azure Event Grid IoT Edge | Microsoft Docs 
description: Configure Event Grid module's identity
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: 
ms.date: 07/26/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Configure Event Grid module's identity

This guide gives examples of the possible identity configurations an Event Grid module can be deployed under. By default Event Grid module will present its identity certificate as configured by IoT security daemon. An identity certificate is presented by Event Grid module on its outgoing calls that is, when it delivers events. A subscriber to an Event Grid event can then choose to validate that it is indeed Event Grid module before accepting the event.

See [Security and authentication](security-authentication.md) guide for all the possible configurations.

## Example 1: Always present identity certificate on outgoing calls

```json
 {
  "Env": [
    "outbound:clientAuth:clientCert:enabled=true",
    "outbound:clientAuth:clientCert:source=IoTEdge"
  ]
}
 ```

## Example 2: Don't present identity certificate on outgoing calls

```json
 {
  "Env": [
    "outbound:clientAuth:clientCert:enabled=false"
  ]
}
 ```
