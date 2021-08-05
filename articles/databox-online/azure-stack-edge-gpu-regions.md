---
title: Microsoft Azure Stack Edge Pro with GPU regions | Microsoft Docs
description: Explains Azure regions in which Azure Stack Edge Pro with GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R devices are available.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 08/03/2021
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

## Region availability for Azure Stack Edge service

The Azure Stack Edge service is currently supported in the US East, West Europe, and SE Asia public regions. **These three regions support geographic locations worldwide.**

The Azure Stack Edge service is used to create a management resource in the cloud when you order a device, provision virtual machines on the device, and manage and monitor the device. You assign a region or location when you create an Azure Stack Edge management resource.

The management resource uses the Azure Stack Edge service to order, activate, deploy, and return an Azure Stack Edge device. 

The Azure Stack Edge service also monitors the health of the device (issues, errors, alerts, and whether the device is "alive") and usage and consumption meters for billing - that is the control plane information on the device.

Data doesn't flow through the Azure Stack Edge service. Data flows between the appliance and the storage account deployed in the customer's region of data origin.

The device must connect to the Azure Stack Edge service to activate. If you don't want any further interaction with the service, you can switch the device to disconnected mode. LINK TO DISCONNECT PROCEDURE.

In general, a location closest to the geographical region where the device is deployed is chosen. But the device and the service can also be deployed in different locations.

## Region availability for data stored in Azure Stack Edge

Azure Stack Edge data is physically stored in Azure storage accounts, and these accounts are available in all the Azure regions. When you create an Azure storage account, the primary location of the storage account is chosen, and that determines the region where the data resides.

When you create an Azure Stack Edge management resource, you associate a storage account with it. Your Azure Stack Edge service and Azure storage can be in two separate locations.

In general, choose the nearest region to your service for your storage account.<!--Does this advice hold for Azure Stack Edge, where only three regions are available?--> However, the nearest Microsoft Azure region might not actually be the region with the lowest latency. It is the latency that dictates network service performance and hence the performance of the device. So if you are choosing a storage account in a different region, it is important to know what the latencies are between your service and the region associated with your storage account.

## Availability of Azure Stack Edge device

Depending upon the model, the Azure Stack Edge devices can be available in different geographies or countries/regions.<!--When I open the link to the supported regions, only one region is checked.-->

<!--### StorSimple physical device (Models 8100/8600)

If using a StorSimple 8100 or 8600 physical device, the device is available in the following countries/regions.

| #  | Country/Region        | #  | Country/Region     | #  | Country/Region      | #  | Country/Region             |
|----|-----------------------|----|--------------------|----|---------------------|----|----------------------------|
| 1  | Australia             | 16 | Hong Kong SAR      | 31 | New Zealand         | 46 | South Africa               |
| 2  | Austria               | 17 | Hungary            | 32 | Nigeria             | 47 | South Korea                |
| 3  | Bahrain               | 18 | Iceland            | 33 | Norway              | 48 | Spain                      |
| 4  | Belgium               | 19 | India              | 34 | Peru                | 49 | Sri Lanka                  |
| 5  | Brazil                | 20 | Indonesia          | 35 | Philippines         | 50 | Sweden                     |
| 6  | Canada                | 21 | Ireland            | 36 | Poland              | 51 | Switzerland                |
| 7  | Chile                 | 22 | Israel             | 37 | Portugal            | 52 | Taiwan                     |
| 8  | Colombia              | 23 | Italy              | 38 | Puerto Rico         | 53 | Thailand                   |
| 9  | Czech Republic        | 24 | Japan              | 39 | Qatar               | 54 | Turkey                     |
| 10 | Denmark               | 25 | Kenya              | 40 | Romania             | 55 | Ukraine                    |
| 11 | Egypt                 | 26 | Kuwait             | 41 | Russia              | 56 | United Arab Emirates       |
| 12 | Finland               | 27 | Macao SAR          | 42 | Saudi Arabia        | 57 | United Kingdom             |
| 13 | France                | 28 | Malaysia           | 43 | Singapore           | 58 | United States              |
| 14 | Germany               | 29 | Mexico             | 44 | Slovakia            | 59 | Vietnam                    |
| 15 | Greece                | 30 | Netherlands        | 45 | Slovenia            | 60 | Croatia                    |
-->
This list changes as more countries/regions are added. For a most up-to-date list of the geographic regions, go to the Azure Stack Edge Terms Appendix in the [Product terms](https://www.microsoft.com/en-us/licensing/product-licensing/products).<!--Are ASE terms included in this document?-->

Microsoft can ship physical hardware and provide hardware spare parts replacement for Azure Stack Edge to the geographies in the preceding list.

> [!IMPORTANT]
> Do not place an Azure Stack Edge physical device in a region where Azure Stack Edge is not supported. Microsoft will not be able to ship any replacement parts to countries/regions where Azure Stack Edge is not supported.<!--Does this apply to ASE?-->


## Next steps

* Learn more about the [pricing for various Azure Stack Edge models](https://azure.microsoft.com/pricing/calculator/#storsimple2).
* Learn more about [managing your Azure Stack Edge storage account](storsimple-8000-manage-storage-accounts.md).
* Learn more about how to [use the Azure Stack Edge service to administer your Azure Stack Edge device](storsimple-8000-manager-service-administration.md).
