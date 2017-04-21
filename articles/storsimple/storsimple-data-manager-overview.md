---
title: Microsoft Azure StorSimple Data Manager overview | Microsoft Docs
description: Provides an overview of the StorSimple Data Manager serivce (private preview)
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
ms.date: 11/22/2016
ms.author: vidarmsft
---

# StorSimple Data Manager overview (Private Preview)

## Overview

Microsoft Azure StorSimple is a hybrid cloud storage solution that addresses the complexities of unstructured data commonly associated with file shares. StorSimple uses cloud storage as an extension of the on-premises solution and automatically tiers data across the on-premises storage and cloud storage. Integrated data protection, with local and cloud snapshots, eliminates the need for a sprawling storage infrastructure. Archival and disaster recovery is also seamless with the cloud acting as an offsite location.

The data transformation service that we are introducing in this document, allows you to seamlessly access the StorSimple data in the cloud. This service provides APIs to extract data from StorSimple and present it to other Azure services in formats that can be readily consumed. The formats supported in this preview are Azure blobs and Azure Media Services assets. This transformation enables you to easily wire up services such as Azure Media Services, Azure HDInsight, Azure Machine Learning, and Azure Search to operate data on StorSimple 8000 series on-premises device.

A high-level block diagram illustrating this is shown below.

![High-level diagram](./media//storsimple-data-manager-overview/high-level-diagram.png)

This document explains how you can sign up for a private preview of this service. It also explains how you can use this service to write applications that use StorSimple data and other Azure services in the cloud.

## Sign up for Data Manager preview
Before you sign up for the Data Manager service, review the following prerequisites.

### Prerequisites

This exercise assumes that you have
* an active Azure subscription.
* access to a registered StorSimple 8000 series device
* all the keys associated with the StorSimple 8000 series device.

### Sign up

The StorSimple Data Manager is in private preview. Perform the following steps to sign up for a private preview of this service:

1.	Log into the Azure portal with the StorSimple Data Manager extension at: [https://aka.ms/HybridDataManager](https://aka.ms/HybridDataManager). Use your Azure credentials to log in.

2.	Click the **+** icon to create a service. Click **Storage** and then click **See All** in the blade that opens up.

    ![Search StorSimple Data Manager Icon](./media/storsimple-data-manager-overview/search-data-manager-icon.png)

3. You see the StorSimple Data Manager icon.

    ![Select StorSimple Data Manager Icon](./media/storsimple-data-manager-overview/select-data-manager-icon.png)

4. Click StorSimple Data Manager icon and then click **Create**. Pick the subscription that you want to enable for the private preview and then click **Sign me up!**

    ![Sign me up](./media/storsimple-data-manager-overview/sign-me-up.png)

5. This sends a request to onboard you. We will onboard you as soon as possible. After your subscription is enabled, you can create a StorSimple Data Manager service.

6. To easily access the StorSimple Data Manager service, click the star icon to pin it to your favorites.

    ![Access StorSimple Data Managers](./media/storsimple-data-manager-overview/access-data-managers.png)


## Next steps

[Use StorSimple Data Manager UI to transform your data](storsimple-data-manager-ui.md).