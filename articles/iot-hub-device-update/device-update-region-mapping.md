---
title: Region failover mapping - Device Update for Azure IoT Hub
description: Regional mapping for business continuity and disaster recovery (BCDR) for Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 08/31/2022
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub regional mapping for scan and failover 

When importing an update into the Device Update for IoT Hub service, that update content may be processed within different Azure regions depending on the region that your Device Update Instance was created in.

## Anti-malware scan

If you are using the Azure portal for importing your update, you will see an option to enable anti-malware scan. If you select the option to enable anti-malware scan, your update will be sent to the Azure region that corresponds to the "Normal" column table in the **Region mapping for normal and failover cases** section. If you don't select the option to enable anti-malware scan, your update will be processed in the same region as your Device Update Instance, but it won't be scanned for malware. **Optional anti-malware scan is in Public Preview**.

If you are using the Azure CLI or directly calling APIs, your update will not be scanned for malware during the import process and will be processed in the same region as your Device Update Instance. The optional scan functionality will be added to the Azure CLI and exposed via API in a future release.

## Failover and BCDR

As an exception to the previous section, in cases where an Azure region is unavailable due to an outage, Device Update for IoT Hub supports business continuity and disaster recovery (BCDR) efforts with regional failover pairings. During an outage, data contained in the update files submitted to the Device Update service may be sent to a secondary Azure region for processing. This failover enables Device Update to continue scanning update files for malware if you select that option. This will occur whether you select the option to enable anti-malware scan or not.

## Region mapping for normal and failover cases

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
