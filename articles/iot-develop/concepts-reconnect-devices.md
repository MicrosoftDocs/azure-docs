---
title: Strategy to reconnect devices to Azure IoT Hub
description: Describes key concepts and strategy for developers to reconnect devices to Azure IoT Hub. 
author: timlt
ms.author: timlt
ms.service: iot-develop
ms.topic: conceptual
ms.date: 03/22/2023
ms.custom: template-concept
---

# Strategy to reconnect devices to Azure IoT Hub
This article describes strategies that developers can use to reconnect devices to Azure IoT Hub.  It explains why devices disconnect and need to reconnect. And it offers a strategy to connect devices whether you use IoT Hub alone, or IoT Hub with Azure IoT Device Provisioning Service (DPS). 

## What causes disconnections
The most common reasons that devices disconnect from IoT Hub are the following:

- Expired SAS token or x.509 certificate. The device's SAS token or x.509 authentication certificate has expired. 
- Network interruption. The device's connection to the network is interrupted.
- Service disruption. The Azure IoT Hub service experiences errors or is unavailable. 
- Service reconfiguration. After you reconfigure IoT Hub service settings, it can force devices to disconnect. 

## Why you need a reconnect strategy

It's important to have a strategy to reconnect devices because there are three scenarios that could negatively impact your solution. 

### Mass reconnection attempts could cause a DDoS

For large fleets of devices numbering in the millions, a high number of connection attempts per second causes a condition similar to a distributed denial-of-service attack (DDoS). The issue can potentially extend beyond the tenant that owns the fleet,  and affect the entire scale-unit.  A DDoS could drive a large cost increase for your Azure IoT Hub resources, due to a need to scale out.  A DDoS could also hurt your solution's performance due to resource starvation. In the worse case, a DDoS can  cause service interruption. 

### Hub failure or reconfiguration

Requiring device to be re-provisioned to another Hub - [IoT Hub high availability and disaster recovery](https://learn.microsoft.com/azure/iot-hub/iot-hub-ha-dr).

### Limit re-provisioning to reduce costs

DPS has a per provisioning cost: [IoT Hub DPS pricing](https://azure.microsoft.com/pricing/details/iot-hub). 

## Reconnection concepts

1. Backoff with jitter (hub + dps)
1. Retriaable vs non retriable (DPS only)

    Non-retriable: 401, Unauthorized or 403, Forbidden or 404, Not Found
  
1. Fallback to DPS after 10 retry attempts (DPS only)

## Hub reconnection flow

When disconnected from Hub:

1. Utilize exponential backoff with jitter delay
1. Reconnect to Hub

[Diagram of retry workflow for IoT Hub.](https://www.plantuml.com/plantuml/svg/TP1DQeOm48RtSugvm7U18gADBeHI1Rr0I4PDrKIIaIAbTs_Gq7RHPfFXUNyOfWWiFH_R2hFHXBJjVAAceBpPsJWB41PZT-dbXj7AX1-0yJrBjKpU7LOBjpgVPVrG3dMUOzbrBuqeXwPz_TjOrQBfengzhPTs8lW4kAk5ivOKVvSbN9cW_b5ebUSFX5I0ZqV-AmLfJCgT0hY-2wHO8a_NpcuSyTtmZ6-6cJmKP7KyqnS0)

## Hub + DPS reconnection flow

When DPS connection failure:

1. Utilize expononential backoff with jitter delay
1. Reprovision to DPS

When Hub connection failure:

1. If it's a retriable error (500)
    * Utilize expononential backoff with jitter delay
    * Reconnect to Hub
1. If it's a retriable error, but reconnect has failure 10 times consecutively
    * Reprovision to DPS
1. If its a non-retriable error (401, Unauthorized or 403, Forbidden or 404, Not Found)
    * Reprovision to DPS

[Diagram of retry workflow for IoT Hub with DPS.](https://www.plantuml.com/plantuml/svg/VPDHJy8m58NVxw-upoOa-afm0GT64WEBy6PyA5k1ojOkRQSXXlzkIowksifRUywNdhExTcmiqxPhQjYBYYDlMdl4YfjIYzOA9G7CGSYMQTQWGot7Bq14V63bOQTL9wjSrKgFHglrP3tBCfmKnVCydwpdoqKQdCxo-SgvZbrg9dSSJW2lDsyu66GuBLO0vno_z5cKMcZr8Omhz9CKMuzCr9tcVKGAydtKTjiVun1Axo4dzXjldP4XcguikJ6H-xS204QQ1wCQW97qcqi1GzpGwbFOFRuBQxc6qsLmJzqc65okfEIbZSSs5QPCUNG4XSNU2xTQi4tDhurxeUHLBXWw5VGIBRrCzSYvxCYCEiH4eW00fkJBx_Lsqkk7CKJjW2EEyEusJTD58Iwxzo1WS4JunQ7-xp_rpu1Q11VGx-YzdDFQ_kQEkQowflu6B)


## Next steps
Learn how to use DPS to deploy devices at scale. 

- [Deploy devices at scale](../iot-dps/concepts-deploy-at-scale.md)

