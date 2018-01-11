---
title: Microsoft Azure StorSimple Data Manager overview | Microsoft Docs
description: Provides an overview of the StorSimple Data Manager serivce
services: storsimple
documentationcenter: NA
author: vidarmsft
manager: syadav
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 12/08/2017
ms.author: vidarmsft
---

# StorSimple Data Manager overview

## Overview

Microsoft Azure StorSimple uses cloud storage as an extension of the on-premises solution and automatically tiers data across on-premises storage and the cloud. Data is stored in the cloud in a deduped and compressed format for maximum efficiency and to lower costs. A side effect of this is that this data might not be readily consumable by other applications that you might want to use in the cloud.

The StorSimple Data Manager lets you overcome this and allows you to seamlessly access the StorSimple data in the cloud in the native format. The Data Transformation service transforms StorSimple data into native blobs and files, which you can then use with other Azure services such as Azure Media Services, Azure HDInsights and AzureML.

This article provides an overview of the StorSimple Data Manager solution. It also explains how you can use this service to write applications that use StorSimple data and other Azure services in the cloud.

## How does it work?

The StorSimple Data Manager service identifies StorSimple data in the cloud from a StorSimple 8000 series on-premises device. The StorSimple data in the cloud is deduped, compressed StorSimple format. The Data Manager service provides APIs to extract the StorSimple format data and transform it into other formats such as Azure blobs and Azure Files. This transformed data is then readily consumed by Azure HDInsight and Azure Media services. The data transformation thus enables these services to operate upon the transformed StorSimple data from StorSimple 8000 series on-premises device. A high-level block diagram illustrating this is shown below.

![High-level diagram](./media/storsimple-data-manager-overview/storsimple-data-manager-overview.png)

## Data Manager components

The StorSimple Data Manager solution consists of the following components: 

## Data Manager usecases

You can use the Data Manager in conjunction with Azure Functions, Azure Automation and Azure Data Factory to have workflows running on your data as it comes into StorSimple. You might want to process your media content that you store on StorSimple with Azure Media Services, or run a Machine Learning algorithm on that data, or bring up a Hadoop cluster to analyse the data that you store on StorSimple. With the vast array of services available on Azure combined with the data on StorSimple, you can unlock the power of your data.


## Region availability

The StorSimple Data Manager is available in the following 7 regions:
Southeast Asia
East US
West US
West US 2
West Central US
North Europe
West Europe

However, the StorSimple Data Manager can be used to transform data in the following regions. This set is larger because the resource deployment in any of the above regions is capable of bringing up the transformation process in the below regions. So, as long as your data resides in any one of the 26 regions shown below, you can transform your data using this service.

<put the Job run regions.png file>

## Recommendations on choosing regions

It is recommended that you have your source storage account (the one associated with your StorSimple device) and target storage account (where you want the data in native format) in the same Azure region.
It is also recommended that you bring up your Data Manager and Job Definition in the region which contains the StorSimple storage account. In case you are not able to do this, you should bring up the Data Manager in the nearest Azure region and then create the Job Definition in the same region as your StorSimple storage account. 
If your StorSimple storage account is not in the list of 26 regions that support Job Definition creation, running the StorSimple Data Manager is not recommended since you will see long latencies and potentially high egress charges.

## Security considerations

The StorSimple Data Manager needs the 'service data encryption key' to perform the transformation from StorSimple format to native format. The service data encryption key is the key that was generated when the first device registered with the StorSimple service (for more details on this key, please refer https://docs.microsoft.com/en-us/azure/storsimple/storsimple-8000-security). This key is stored in a Key Vault that is created when you create a Data Manager. It resides in the same Azure region as your StorSimple Data Manager. This key is deleted when you delete your Data Manager resource.

This key is used by the compute resources that we bring up to do the transformation. These compute resources are brought up in the Azure region in which you create the Job Definition. This region may, or may not be the same as the region where you bring up your Data Manager resource.

In case your Data Manager resource region is different from your Job Definition region, it is important that you understand what data/metadata resides in each of these regions. The diagram below illustrates this.

<slide 2>

## Next steps

[Use StorSimple Data Manager UI to transform your data](storsimple-data-manager-ui.md).