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

When you're importing an update into the Device Update for IoT Hub service, that update content may be processed within different Azure regions. The region used for processing depends on the region that your Device Update Instance was created in.

## Anti-malware scan

When you're using the Azure portal for importing your update, there's now an option to enable anti-malware scan. If you select the option to enable anti-malware scan, your update is sent to the Azure region that corresponds to the "Default scan region" column table in the **Region mapping for default and failover cases** section. If you don't select the option to enable anti-malware scan, your update is processed in the same region as your Device Update Instance, but it isn't scanned for malware. **Optional anti-malware scan is in Public Preview**.

If you're using the Azure CLI or directly calling Device Update APIs, your update isn't scanned for malware during the import process. It's processed in the same region as your Device Update Instance.

## Failover and BCDR

As an exception to the previous section, in cases where an Azure region is unavailable due to an outage, Device Update for IoT Hub supports business continuity and disaster recovery (BCDR) efforts with regional failover pairings. During an outage, data contained in the update files submitted to the Device Update service may be sent to a secondary Azure region for processing. This failover enables Device Update to continue scanning update files for malware if you select that option.

## Region mapping for default and failover cases


| Device Update Instance region|Default scan region|Failover scan region |
| -------- | -------- | -------- |
| North Europe | North Europe   | Sweden Central  |
|West Europe   | North Europe | Sweden Central  |
| UK South| North Europe   | Sweden Central |
|Sweden Central|Sweden Central| North Europe  |
|East US| East US   |East US 2 |
|East US 2| East US 2  |East US  |
|West US 2|West US 2| East US 2   |
|West US 3| West US 2| East US 2  |
|South Central US|West US 2| East US 2 |
|East US 2 (EUAP)|East US 2| East US|
|Australia East|North Europe| Sweden Central|
|Southeast Asia | West US 2| East US 2  |

## Next steps

[Learn about importing updates](.\import-update.md)
