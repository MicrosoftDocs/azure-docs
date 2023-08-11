---
title: Choosing a region for Microsoft Azure Stack Edge Pro with GPU | Microsoft Docs
description: Explains region choices for Azure Stack Edge service, data storage, and devices for Azure Stack Edge Pro with GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 08/18/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to choose optimal region(s) to meet my performance needs, requirements, and data location preferences for my Azure Stack Edge devices and storage.
---
# Choosing a region for Azure Stack Edge

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-and-fpga-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-fpga-sku.md)]

This article describes region availability for the Azure Stack Edge service, data storage, and device shipments for an Azure Stack Edge device, and explains how your choice of regions affects service, performance, and billings.


## Overview

The Azure datacenters operate in multiple geographic regions around the world to meet customers' demands of performance, requirements, and preferences for data location. An Azure geography is a defined area of the world that contains at least one Azure region. An Azure region is an area within a geography, containing one or more datacenters.

Choosing an Azure region is very important, and the choice of region is influenced by factors such as data residency and sovereignty, service availability, performance, cost, and redundancy. For more information on how to choose a region, go to [Which Azure region is right for me?](https://azure.microsoft.com/overview/datacenters/how-to-choose/).

For an Azure Stack Edge Pro GPU device, the choice of region is determined by the following factors:

- Regions where the Azure Stack Edge service is available.
- Regions where the storage accounts that store Azure Stack Edge data should be located for the best performance.
- Countries/regions that the Azure Stack Edge device can be shipped to.


## Region availability for the service

The Azure Stack Edge service is currently supported in the US East, West Europe, and SE Asia public regions. **These three regions support geographic locations worldwide.**

The region of the service is the country or region assigned to the Azure Stack Edge management resource. The management resource uses the Azure Stack Edge service to activate, deploy, and return an Azure Stack Edge device.

The Azure Stack Edge service also monitors the health of the device - issues, errors, alerts, and whether the device is "alive". And the service monitors usage and consumption meters for billing - the control plane information on the device. The region assigned to the management resource is the region where billings occur.

The device must connect to the Azure Stack Edge service to activate. If you don't want any further interaction with the service, you can switch the device to disconnected mode. 

Data doesn't flow through the Azure Stack Edge service. Data flows between the device and the storage account that is deployed in the customer's region of data origin. 

In general, a location closest to the geographical region where the device is deployed is chosen. But the device and the service can also be deployed in different locations.

## Region availability for data storage

Azure Stack Edge data is stored in Azure storage accounts, and these accounts are available in all the Azure regions. When you create an Azure storage account, you choose the primary location of the storage account. That choice determines the region where the data resides.

You choose a storage account when you [create a share on your device](azure-stack-edge-gpu-deploy-add-shares.md#add-a-share). Your Azure Stack Edge service and Azure storage can be in two separate locations.

In general, choose the nearest region to your service for your storage account. However, the nearest Microsoft Azure region might not actually be the region with the lowest latency. The latency dictates network service performance and hence the performance of the device. So if you're choosing a storage account in a different region, it's important to know what the latencies are between your service and the region associated with your storage account.

## Region of device

To find out the countries/regions where Azure Stack Edge models are available, see the product overview:

- [Region availability for Azure Stack Edge Pro with GPU](azure-stack-edge-gpu-overview.md#region-availability)
- [Region availability for Azure Stack Edge Pro R](azure-stack-edge-pro-r-overview.md#region-availability)
- [Region availability for Azure Stack Edge Mini R](azure-stack-edge-mini-r-overview.md#region-availability)

Microsoft can ship physical hardware and provide hardware spare parts replacement for Azure Stack Edge to those geographic regions.

> [!IMPORTANT]
> Do not place an Azure Stack Edge physical device in a region where Azure Stack Edge is not supported. Microsoft will not be able to ship any replacement parts to countries/regions where Azure Stack Edge is not supported.


## Next steps

* Learn more about the [pricing for various Azure Stack Edge models](https://azure.microsoft.com/pricing/details/azure-stack/edge/).
* [Prepare to deploy your Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-prep.md).
