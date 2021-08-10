---
title: Microsoft Azure Stack Edge Pro with GPU regions | Microsoft Docs
description: Explains Azure regions in which Azure Stack Edge Pro with GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R devices are available.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 08/10/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to choose optimal region(s) to meet my performance needs, requirements, and data location preferences for my Azure Stack Edge devices and storage.
---
# Available regions for your Azure Stack Edge

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

## Overview

The Azure datacenters operate in multiple geographies around the world to meet customers' demands of performance, requirements, and preferences regarding data location. An Azure geography is a defined area of the world that contains at least one Azure region. An Azure region is an area within a geography, containing one or more datacenters.

Choosing an Azure region is very important, and the choice of region is influenced by factors such as data residency and sovereignty, service availability, performance, cost, and redundancy. For more information on how to choose a region, go to [Which Azure region is right for me?](https://azure.microsoft.com/overview/datacenters/how-to-choose/).

For an Azure Stack Edge device, the choice of region is specifically determined by the following factors:

- Regions where the Azure Stack Edge service is available.
- The countries/regions that the Azure Stack Edge device can be shipped to.
- The regions where the storage accounts that store Azure Stack Edge data should be located for optimum performance.

This article describes the region availability for the Azure Stack Edge service and for Azure Stack Edge Pro GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R devices.

## Region availability for the service

The Azure Stack Edge service is currently supported in the US East, West Europe, and SE Asia public regions. **These three regions support geographic locations worldwide.**

The management resource uses the Azure Stack Edge service to activate, deploy, and return an Azure Stack Edge device.

The Azure Stack Edge service also monitors the health of the device (issues, errors, alerts, and whether the device is "alive") and usage and consumption meters for billing - that is, the control plane information on the device.

The device must connect to the Azure Stack Edge service to activate. If you don't want any further interaction with the service, you can switch the device to disconnected mode.

The service region is the region that you assign when you create the management resource. 

Data doesn't flow through the Azure Stack Edge service. Data flows between the device and the storage account deployed in the customer's region of data origin. 

In general, a location closest to the geographical region where the device is deployed is chosen. But the device and the service can also be deployed in different locations.

## Region availability for data storage

Azure Stack Edge data is physically stored in Azure storage accounts, and these accounts are available in all the Azure regions. When you create an Azure storage account, the primary location of the storage account is chosen, and that determines the region where the data resides.

A storage account is assigned when you [create a share on your device](azure-stack-edge-gpu-deploy-add-shares.md#add-a-share). Your Azure Stack Edge service and Azure storage can be in two separate locations.

In general, choose the nearest region to your service for your storage account. However, the nearest Microsoft Azure region might not actually be the region with the lowest latency. It is the latency that dictates network service performance and hence the performance of the device. So if you are choosing a storage account in a different region, it is important to know what the latencies are between your service and the region associated with your storage account.

## Availability of device

To find out the countries and geographic regions where Azure Stack Edge models are available, see the product overview:

- [Region availability for Azure Stack Edge Pro with GPU](azure-stack-edge-gpu-overview.md#region-availability)
- [Region availability for Azure Stack Edge Pro R](azure-stack-edge-pro-r-overview.md#region-availability)
- [Region availability for Azure Stack Edge Mini R](azure-stack-edge-mini-r-overview.md#region-availability)

Microsoft can ship physical hardware and provide hardware spare parts replacement for Azure Stack Edge to those geographic regions.

> [!IMPORTANT]
> Do not place an Azure Stack Edge physical device in a region where Azure Stack Edge is not supported. Microsoft will not be able to ship any replacement parts to countries/regions where Azure Stack Edge is not supported.


## Next steps

* Learn more about the [pricing for various Azure Stack Edge models](https://azure.microsoft.com/pricing/details/azure-stack/edge/).
* [Prepare to deploy your Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-prep.md).
