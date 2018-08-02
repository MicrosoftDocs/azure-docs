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
ms.date: 08/02/2018 
ms.author: alkohli

---
# Options to migrate data from StorSimple 5000-7000 series 
StorSimple 5000-7000 series is reaching [end of Support](https://support.microsoft.com/lifecycle/search?alpha=StorSimple%205000%2F7000%20Series) in July 2019. The customers who are running StorSimple 5000-7000 series have an option to upgrade to other Azure first party hybrid services. This article describes the Azure hybrid options available to migrate data. 

## Migration options

The customers using StorSimple 5000-7000 series have the following two key options:

- **Upgrade to StorSimple 8000 Series** – Upgrade to StorSimple 8000 series and thus continue on the StorSimple platform.  This upgrade path requires customers to replace their 5000-7000 series devices with an 8000 series. The data is migrated from the 5000-7000 series device by using the migration tool. Once the migration is successfully complete, the StorSimple 8000 series devices will continue to tier data to Azure Blob Storage. 

    For more information on how to migrate data using a StorSimple 8000 series, go to [Migrate data from StorSimple 5000-7000 series to 8000 series device](storsimple-8000-migrate-from-5000-7000.md).

- **Migrate to Azure File Sync** – This brand new migration option enables customers to store their organization’s file shares in the Azure Files. These files shares are then centralized for on-premises access using Azure File Sync (AFS). AFS can be deployed on a Windows Server host. The actual data migration is then performed as a host copy or using the migration tool.

    For more information on how to migrate data to Azure File Sync, go to [Migrate data from StorSimple 5000-7000 series to Azure File Sync](https://aka.ms/StorSimpleMigrationAFS).

## Migration - Frequently asked questions

### Q. When do the StorSimple 5000 and 7000 series devices reach end of life? 

A. StorSimple 5000-7000 series reach [end of support life](https://support.microsoft.com/lifecycle/search?alpha=StorSimple%205000%2F7000%20Series) in July 2019. After this time, the devices will be out of support. We strongly recommend that you start formulating a plan to migrate the data from your devices now.

### Q. What options are available to migrate data from StorSimple 5000-7000 series devices? 

A. Depending on their scenario, StorSimple 5000-7000 series users have the following migration options. 

 - **Upgrade to 8000 series**: Use this option when you want to continue on StorSimple platform. 
 - **Migrate to Azure File Sync**: Use this option when you want to switch to Azure native format. You can use Azure File Sync for centralized management of file shares. 

You can contact Microsoft Support ot discuss migration options not listed here.

### Q. Is migration to other storage solutions supported?

A. Yes. Migration to other storage solutions using host copy of the data is supported.

### Q. Is migration supported by Microsoft? 

A. Migrating from 5000 or 7000 series is a fully supported operation. In fact, Microsoft recommends reaching out to Support before you start migration. Migration is currently an assisted operation. If you intend to migrate data from your StorSimple 5000-7000 series device, [Open a Support ticket](storsimple-8000-contact-microsoft-support.md).

### Q. How does the cost compare for the two listed migrations to Azure hybrid services? 

A. Cost of migration varies depending on the option you choose. While migration itself is free, if you decide to upgrade to a StorSimple 8000 series, there will be the cost of the hardware device. Similarly, when using Azure File Sync, the subscription fees for the service may apply. In each case, customers will also have to pay ongoing storage costs. Refer to [Microsoft pricing calculator for the respective services](https://azure.microsoft.com/pricing/#product-picker) for an estimate.  

## Next steps
 - [Migrate data from a StorSimple 5000-7000 series to an 8000 series device](storsimple-8000-migrate-from-5000-7000.md).
 - [Migrate data from a StorSimple 5000-7000 series to Azure File Sync](https://aka.ms/StorSimpleMigrationAFS)
