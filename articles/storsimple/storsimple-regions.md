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

## StorSimple device availability

Depending upon the model, the StorSimple devices can be available in different countries or locations.

If using a StorSimple 8100 or 8600, then the physical device is available in the following countries. For a most up-to-date list of the countries, go to StorSimple country availability.

If using a StorSimple Cloud Appliance 8010 or 8020, then the device is supported and available in all the regions where the underlying VM is supported. The 8010 uses a Standard_A3 and the 8020 uses a Standard_DS3 VM to create a cloud appliance.

If using a 1200 series StorSimple Virtual Array, then the virtual disk image is supported in all Azure regions.

## Choosing Azure region

Choosing an Azure region is very important. There are a number of factors to consider when choosing a region to deploy your services in:

- Data export and compliance - 
- Service availability - Both StorSimple service and device should be available in the selected region.
- Performance - Latency dictates performance and the nearest Azure region may not be the region with the lowest latency. For higher performance, you want to choose the Azure region with the lowest latency. You can run Azure speed test to determine the latency between you and each Azure region.
- Cost - the cost of the services varies by regions. If latency and compliance do not matter, then you can deploy your service in the cheapest region.
- Redundancy - 

## Next steps
* Learn more about the [StorSimple deployment process](storsimple-8000-deployment-walkthrough-u2.md).
* Learn more about [managing your StorSimple storage account](storsimple-8000-manage-storage-accounts.md).
* Learn more about how to [use the StorSimple Device Manager service to administer your StorSimple device](storsimple-8000-manager-service-administration.md).
