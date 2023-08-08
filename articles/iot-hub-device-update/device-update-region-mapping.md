---
title: Region failover mapping - Device Update for Azure IoT Hub
description: Regional mapping for business continuity and disaster recovery (BCDR) for Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 08/31/2022
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Regional failover mapping for Device Update for IoT Hub

In cases where an Azure region is unavailable due to an outage, Device Update for IoT Hub supports business continuity and disaster recovery (BCDR) efforts with regional failover pairings. During an outage, data contained in the update files submitted to the Device Update service may be sent to a secondary Azure region. This failover enables Device Update to continue scanning update files for malware and making the updates available on the service endpoints.

## Failover region mapping

| Region name |  Fails over to
| --- | --- |
| North Europe | West Europe |
| West Europe | North Europe |
| UK South | North Europe |
| Sweden Central | North Europe |
| East US | West US 2 |
| East US 2 | West US 2 |
| West US 2 | East US |
| West US 3 | East US |
| South Central US | East US |
| East US 2 (EUAP) | West US 2 |
| Australia East | Southeast Asia |
| Southeast Asia | Australia East |

## Next steps

[Learn about importing updates](.\import-update.md)
