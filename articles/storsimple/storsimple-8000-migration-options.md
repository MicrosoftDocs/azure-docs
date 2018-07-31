---
title: Evaluate options to migrate data from StorSimple 5000-7000 series| Microsoft Docs
description: Provides an overview of the options to migrate data from StorSimple 5000-7000 series.
services: storsimple
documentationcenter: NA
author: alkohli
manager: twooley

ms.assetid: 
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 07/31/2018 
ms.author: alkohli

---
# Options to migrate data from StorSimple 5000-7000 series 

The customers who are running StorSimple 5000-7000 series have an option to upgrade to other Azure first party hybrid services. Here are the two key options:

- **Upgrade to StorSimple 8000 Series** – Upgrade to StorSimple 8000 series and thus continue on StorSimple platform.  This upgrade path requires customers to replace their 5000-7000 series devices with an 8000 series. The data is migrated from the 5000-7000 series device by using the migration tool. Once the migration is successfully complete, the StorSimple 8000 series devices will continue to tier data to Azure Blob Storage. 

    For more information on how to migrate data using a StorSimple 8000 series, go to [Migrate data from StorSimple 5000-7000 series to 8000 series device](storsimple-8000-migrate-from-5000-7000.md).

- **Migrate to Azure File Sync** – This brand new migration option enables customers to store their organization’s file shares in the Azure Files. These files shares are then centralized for on-premises access using Azure File Sync (AFS). AFS can be deployed on a Windows Server host. The actual data migration is then performed as a host copy or using the migration tool.

    For more information on how to migrate data to Azure File Sync, go to [Migrate data from StorSimple 5000-7000 series to Azure File Sync](link).

## Migration - Frequently asked questions

### Q. When do the StorSimple 5000 and 7000 series devices reach end of life? 

A. StorSimple 5000-7000 series reach end of support life in July 2019. After this time, the devices will be out of support. We strongly recommend that you start forumlating a plan to migrate the data from your devices now.

### Q. What options are available to migrate data from StorSimple 5000-7000 series devices? 

A. Depending on their scenario, StorSimple 5000-7000 series users have the following migration options. 

 - **Upgrade to 8000 series**: Use this option when you want to continue on StorSimple platform. 
 - **Migrate to Azure File Sync**: Use this option when you want to switch to Azure native format. You can use Azure File Sync for centralized management of file shares. 
 - **Migrate to Blobs**: Use this option when you want to use tiered blob storage service as the target for migration. 

### Q. Is migration supported by Microsoft? 

A. Migrating from 5000 or 7000 series is fully supported operation. In fact, Microsoft recommends reaching out to customer support before starting migration. Migration is currently an assisted operation. If you intend to migrate data from your StorSimple 5000-7000 series device, [Open a Support ticket](storsimple-8000-contact-microsoft-support.md).

### Q. How much does it cost to migrate? 

A. Cost of migration varies from service to service Migration itself can be performed for free of cost but customers have to pay ongoing storage costs and/or subscription fees for the target service. Please refer to Microsoft pricing calculator for an estimate.  

## Next steps
 - [Migrate data from a StorSimple 5000-7000 series to an 8000 series device](storsimple-8000-migrate-from-5000-7000.md).
 - [Migrate data from a StorSimple 5000-7000 series to Azure File Sync](link)
