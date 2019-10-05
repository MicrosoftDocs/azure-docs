---
title: Configure identity - Azure Event Grid IoT Edge | Microsoft Docs 
description: Configure Event Grid module's identity
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 10/05/2019
ms.topic: article
ms.service: event-grid
services: event-grid
---

# Configure identity for the Event Grid module

This article gives you examples of the possible identity configurations for an Event Grid module. By default, the Event Grid module will present its identity certificate as configured by the IoT security daemon. An identity certificate is presented by the Event Grid module on its outgoing calls that is, when it delivers events. A subscriber to an Event Grid event can then choose to validate that it's indeed the Event Grid module that sent the event before accepting the event.

See [Security and authentication](security-authentication.md) guide for all the possible configurations.

## Always present identity certificate
Here's an example configuration for always presenting an identity certificate on outgoing calls. 

```json
 {
  "Env": [
    "outbound:clientAuth:clientCert:enabled=true",
    "outbound:clientAuth:clientCert:source=IoTEdge"
  ]
}
 ```

## Don't present identity certificate
Here's an example configuration for not presenting an identity certificate on outgoing calls. 

```json
 {
  "Env": [
    "outbound:clientAuth:clientCert:enabled=false"
  ]
}
 ```
