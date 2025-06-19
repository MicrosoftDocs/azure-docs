---
title: Azure Device Update for IoT Hub limits | Microsoft Docs
description: Understand key limits for Azure Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 01/21/2025
ms.topic: conceptual
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Azure Device Update for IoT Hub limits

This article provides an overview of the various limits imposed on the Azure Device Update for IoT Hub resource and its associated operations. The article also indicates whether the Standard SKU limits are adjustable by contacting Microsoft Support.

## General availability limits

The following tables describe the limits for the Device Update service for the Standard and Free tiers. 

[!INCLUDE [device-update-for-iot-hub-limits](../../includes/device-update-for-iot-hub-limits.md)]

## Requirements for large-file downloads

To deploy large-file packages with file sizes larger than 100 MB, it's best to use byte range requests for reliable download performance. Device Update uses Content Delivery Networks (CDNs) that work optimally with range requests of 1 MB in size. Range requests larger than 100 MB aren't supported.

## Throttling limits

The following table shows the enforced throttles for operations in all Device Update tiers. Values apply to each individual Device Update instance.

|Device Update service API | Throttling rate |
|-------------------------|------------------|
|GetGroups |30/min|
|GetGroupDetails| 30/min|
|GetBestUpdates per group| 30/min|
|GetUpdateCompliance per group| 30/min|
|GetAllUpdateCompliance |30/min|
|GetSubgroupUpdateCompliance| 30/min|
|GetSubgroupBestUpdates| 30/min|
|CreateOrUpdateDeployment| 6/min |
|DeleteDeployment| 6/min |
|ProcessSubgroupDeployment | 6/min|
|Delete Update | 510/min*|
|Get File| 510/min*|
|Get Operation Status| 510/min*|
|Get Update| 510/min*|
|Import Update| 510/min*|
|List Files| 510/min*|
|List Names| 510/min*|
|List Providers| 510/min*|
|List Updates| 510/min*|
|List Versions| 510/min*|
|List Operation Statuses| 50/min|

\*The number of calls per minute is shared across all the listed operations.

Also, the number of concurrent asynchronous import and delete operations is limited to 10 total operation jobs.

## Related content

- [Create a Device Update account](create-device-update-account.md)
- [Troubleshoot common Device Update issues](troubleshoot-device-update.md)
