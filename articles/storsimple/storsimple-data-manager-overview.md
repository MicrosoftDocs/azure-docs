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
ms.date: 01/10/2018
ms.author: vidarmsft
---

# StorSimple Data Manager overview

## Overview

Microsoft Azure StorSimple uses cloud storage as an extension of the on-premises solution and automatically tiers data across on-premises storage and the cloud. Data is stored in the cloud in a deduped and compressed format for maximum efficiency and to lower costs. As the data is stored in StorSimple format, it is not readily consumed by other cloud applications that you may want to use.

The StorSimple Data Manager enables you to seamlessly access the StorSimple native format data in the cloud. The Data Transformation service transforms StorSimple data into native blobs and files, which you can use with other services such as Azure Media Services, Azure HDInsights, and Azure Machine Learning.

This article provides an overview of the StorSimple Data Manager solution. It also explains how you can use this service to write applications that use StorSimple data and other Azure services in the cloud.

## How does it work?

The StorSimple Data Manager service identifies StorSimple data in the cloud from a StorSimple 8000 series on-premises device. The StorSimple data in the cloud is deduped, compressed StorSimple format. The Data Manager service provides APIs to extract the StorSimple format data and transform it into other formats such as Azure blobs and Azure Files. This transformed data is then readily consumed by Azure HDInsight and Azure Media services. The data transformation thus enables these services to operate upon the transformed StorSimple data from StorSimple 8000 series on-premises device. A high-level block diagram illustrating this is shown below.

![High-level diagram](./media/storsimple-data-manager-overview/storsimple-data-manager-overview.png)


## Data Manager use cases

You can use the Data Manager with Azure Functions, Azure Automation, and Azure Data Factory to have workflows running on your data as it comes into StorSimple. You might want to process your media content that you store on StorSimple with Azure Media Services, or run a Machine Learning algorithm on that data, or bring up a Hadoop cluster to analyse the data that you store on StorSimple. With the vast array of services available on Azure combined with the data on StorSimple, you can unlock the power of your data.


## Region availability

The StorSimple Data Manager is available in the following 7 regions:

 - Southeast Asia
 - East US
 - West US
 - West US 2
 - West Central US
 - North Europe
 - West Europe

However, the StorSimple Data Manager can be used to transform data in the following regions. This set is larger because the resource deployment in any of the above regions is capable of bringing up the transformation process in the below regions. So, as long as your data resides in any one of the 26 regions shown below, you can transform your data using this service.

<put the Job run regions.png file>

## Choosing a region

We recommend that:
 - Your source storage account (the one associated with your StorSimple device) and target storage account (where you want the data in native format) be in the same Azure region.
 - Bring up your Data Manager and job definition in the region which contains the StorSimple storage account. If this is not possible, bring up the Data Manager in the nearest Azure region and then create the Job Definition in the same region as your StorSimple storage account. 

    If your StorSimple storage account is not in the 26 regions that support job definition creation, we recommend that you do not run StorSimple Data Manager as you will see long latencies and potentially high egress charges.

## Security considerations

The StorSimple Data Manager needs the service data encryption key to transform from StorSimple format to native format. The service data encryption key is generated when the first device registers with the StorSimple service. For more information on this key, go to [StorSimple security](storsimple-8000-security.md). 

The service data encryption key provided as an input is stored in a key vault that is created when you create a Data Manager. The vault resides in the same Azure region as your StorSimple Data Manager. This key is deleted when you delete your Data Manager service.

This key is used by the compute resources use to do the transformation. These compute resources are location in the same Azure region as your job definition. This region may, or may not be the same as the region where you bring up your Data Manager.

If your Data Manager region is different from your job definition region, it is important that you understand what data/metadata resides in each of these regions. The diagram below illustrates this.

<slide 2>

## Next steps

[Use StorSimple Data Manager UI to transform your data](storsimple-data-manager-ui.md).