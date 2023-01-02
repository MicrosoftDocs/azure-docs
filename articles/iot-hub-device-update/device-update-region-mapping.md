---
title: Region mapping for BCDR for Device Update for Azure IoT Hub | Microsoft Docs
description: Regional mapping for BCDR for Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 08/31/2022
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Regional mapping for BCDR for Device Update for IoT Hub

In cases where an Azure region is unavailable due to an outage, data contained in the update files submitted to the Device Update for IoT Hub service may be sent to a specific Azure region for the duration of the outage, for the purpose of anti-malware scanning and making the updates available on the Device Update service endpoints.

## Failover region mapping

| Region name |  Fails over to
| --- | --- |
| North Europe | West Europe |
| West Europe | North Europe |
| UK South | North Europe |
| Sweden Central | North Europe |
| East US | West US 2 |
| East US 2 | West US 2 |
| West US 2	| East US |
| West US 3	| East US |
| South Central US | East US |
| East US 2 (EUAP) | West US 2 |
| Australia East | Southeast Asia |
| Southeast Asia | Australia East |


## Next steps

[Learn about importing updates](.\import-update.md)


