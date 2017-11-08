---
title: StorSimple region availability | Microsoft Docs
description: Explains the Azure regions in which the various StorSimple device models are available.
services: storsimple
documentationcenter: ''
author: alkohli
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/08/2017
ms.author: alkohli

---
# Available regions for your StorSimple 

## Overview

The Azure datacenters operate in multiple geographies around the world to meet customer's demands of performance, requirements, and preferences regarding data location. An Azure geography is a defined area of the world that contains at least one Azure Region. An Azure region is an area within a geography, containing one or more datacenters. When possible, regions are placed atleast 300 miles from each other. This placement ensures that in the unlikely event of a natural disaster, no more than one region is affected at the same time.

This tutorial describes the region availability for the StorSimple Device Manager service, the on-premises physical and the cloud devices. The information contained in this article is applicable to both, the StorSimple 8000 and 1200 series devices.

## StorSimple Device Manager service availability

StorSimple Device Manager service is not available in all the Azure regions. The service is currently supported in 12 public regions and 2 Azure Government regions.

You define a region or location when you first create the StorSimple Device Manager service. 
Typically, locations refers to the geographical location in which the StorSimple device will be deployed. But the device and the service can also be deployed in different locations.

Here is a list of regions where StorSimple Device Manager service is available and can be deployed.

## Azure storage account availability

Azure storage accounts are available in all the Azure regions. Storage account is where the data is physically stored. When you create a storage account, the primary location of the storage account is chosen.

When you first create a StorSimple Device Manager service and associate a storage account with it, the location where you deploy the service can be different from the primary location of the storage account. 

If you are using a cloud appliance, then we recommend that the region is which you deploy the service is the same as the region associated with the storage account used by the service. Storage accounts in different regions may result in poor performance. 

## StorSimple device availability

Depending upon the model, the StorSimple devices can be available in different countries or locations.

If using a StorSimple 8100 or 8600, then the physical device is available in the following countries. For a most up-to-date list of the countries, go to StorSimple country availability.

| #  | Country        | #  | Country     | #  | Country      | #  | Country              |
|----|----------------|----|-------------|----|--------------|----|----------------------|
| 1  | Australia      | 16 | Hong Kong   | 31 | New Zealand  | 46 | South Africa         |
| 2  | Austria        | 17 | Hungary     | 32 | Nigeria      | 47 | South Korea          |
| 3  | Bahrain        | 18 | Iceland     | 33 | Norway       | 48 | Spain                |
| 4  | Belgium        | 19 | India       | 34 | Peru         | 49 | Sri Lanka            |
| 5  | Brazil         | 20 | Indonesia   | 35 | Philippines  | 50 | Sweden               |
| 6  | Canada         | 21 | Ireland     | 36 | Poland       | 51 | Switzerland          |
| 7  | Chile          | 22 | Israel      | 37 | Portugal     | 52 | Taiwan               |
| 8  | Colombia       | 23 | Italy       | 38 | Puerto Rico  | 53 | Thailand             |
| 9  | Czech Republic | 24 | Japan       | 39 | Qatar        | 54 | Turkey               |
| 10 | Denmark        | 25 | Kenya       | 40 | Romania      | 55 | Ukraine              |
| 11 | Egypt          | 26 | Kuwait      | 41 | Russia       | 56 | United Arab Emirates |
| 12 | Finland        | 27 | Macau       | 42 | Saudi Arabia | 57 | United Kingdom       |
| 13 | France         | 28 | Malaysia    | 43 | Singapore    | 58 | United States        |
| 14 | Germany        | 29 | Mexico      | 44 | Slovakia     | 59 | Vietnam              |
| 15 | Greece         | 30 | Netherlands | 45 | Slovenia     | 60 | Croatia              |

The following countries will be added to the above list soon.

| # | Country    |
|---|------------|
| 1 | Argentina  |
| 2 | Bulgaria   |
| 3 | Costa Rica |
| 4 | Lebanon    |
| 5 | Morocco    |
| 6 | Pakistan   |
| 7 | Serbia     |

If using a StorSimple Cloud Appliance 8010 or 8020, then the device is supported and available in all the regions where the underlying VM is supported. The 8010 uses a Standard_A3 and the 8020 uses a Standard_DS3 VM to create a cloud appliance.

If using a 1200 series StorSimple Virtual Array, then the virtual disk image is supported in all Azure regions.

## Choosing Azure region

Choosing an Azure region is very important for your StorSimple solution. There are a number of factors to consider when choosing a region to deploy your services in:

- Data export and compliance - 
- Service availability - Both StorSimple service and device should be available in the selected region. See the list of the countries where the device is available.
- Performance - Latency dictates performance and the nearest Azure region may not be the region with the lowest latency. For higher performance, you want to choose the Azure region with the lowest latency. You can run the Azure speed test to determine the latency between you and each Azure region.
- Cost - the cost of the services varies by regions. If latency and compliance do not matter, then you can deploy your service in the cheapest region.
- Redundancy - 

## Next steps
* Learn more about the [StorSimple deployment process](storsimple-8000-deployment-walkthrough-u2.md).
* Learn more about [managing your StorSimple storage account](storsimple-8000-manage-storage-accounts.md).
* Learn more about how to [use the StorSimple Device Manager service to administer your StorSimple device](storsimple-8000-manager-service-administration.md).
