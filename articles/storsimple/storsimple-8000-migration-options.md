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
ms.date: 09/20/2018 
ms.author: alkohli

---
# Options to migrate data from StorSimple 5000-7000 series 

> [!IMPORTANT]
> On July 31, 2019 the StorSimple 5000/7000 series will reach end of support (EOS) status. We recommend that StorSimple 5000/7000 series customers migrate to one of the alternatives described in the document.

StorSimple 5000-7000 series is reaching [end of Support](https://support.microsoft.com/lifecycle/search?alpha=StorSimple%205000%2F7000%20Series) in July 2019. The customers who are running StorSimple 5000-7000 series have an option to upgrade to other Azure first party hybrid services. This article describes the Azure hybrid options available to migrate data. 

## Migration options

The customers using StorSimple 5000-7000 series have the following two key options:

- **Upgrade to StorSimple 8000 Series** – Upgrade to StorSimple 8000 series and thus continue on the StorSimple platform.  This upgrade path requires customers to replace their 5000-7000 series devices with an 8000 series. The data is migrated from the 5000-7000 series device by using the migration tool. Once the migration is successfully complete, the StorSimple 8000 series devices will continue to tier data to Azure Blob Storage. 

    For more information on how to migrate data using a StorSimple 8000 series, go to [Migrate data from StorSimple 5000-7000 series to 8000 series device](storsimple-8000-migrate-from-5000-7000.md).

- **Migrate to Azure File Sync** – This brand new migration option enables customers to store their organization’s file shares in the Azure Files. These files shares are then centralized for on-premises access using Azure File Sync (AFS). AFS can be deployed on a Windows Server host. The actual data migration is then performed as a host copy or using the migration tool.

    For more information on how to migrate data to Azure File Sync, go to [Migrate data from StorSimple 5000-7000 series to Azure File Sync](https://aka.ms/StorSimpleMigrationAFS).

## Migration - Frequently asked questions

### Q. When do the StorSimple 5000 and 7000 series devices reach end of service? 

A. StorSimple 5000-7000 series reach [end of service](https://support.microsoft.com/lifecycle/search?alpha=StorSimple%205000%2F7000%20Series) in July 2019. The end of service implies that Microsoft will no longer be able to provide support for both hardware and software of these device after July 2019. We strongly recommend that you start formulating a plan to migrate the data from your devices now.

### Q. What happens to the data I have stored in Azure?  

A. You can continue to use the data in Azure once you migrate it to a newer service. 


### Q.	What happens to the data I have stored locally on my StorSimple device? 

A. The data that is on the local device can be copied to the newer service as described in the migration documents.

###	What happens if I want to keep my StorSimple 5000/7000 series appliance? 

A. While the services might continue to work, Microsoft will no longer be able to provide hardware and software support. Migration is strongly recommended for business continuity.

### Q. What options are available to migrate data from StorSimple 5000-7000 series devices? 

A. Depending on their scenario, StorSimple 5000-7000 series users have the following migration options. 

 - **Upgrade to 8000 series**: Use this option when you want to continue on StorSimple platform. 
 - **Migrate to Azure File Sync**: Use this option when you want to switch to Azure native format. You can use Azure File Sync for centralized management of file shares. 

You can contact Microsoft Support to discuss migration options not listed here.

### Q. Is migration to other storage solutions supported?

A. Yes. Migration to other storage solutions using host copy of the data is supported.

### Q. Is migration supported by Microsoft? 

A. Migrating from 5000 or 7000 series is a fully supported operation. In fact, Microsoft recommends reaching out to Support before you start migration. Migration is currently an assisted operation. If you intend to migrate data from your StorSimple 5000-7000 series device, [Open a Support ticket](storsimple-8000-contact-microsoft-support.md).

### Q. What is the pricing model for both the migration options?

A. Cost of migration varies depending on the option you choose. While migration itself is free, if you decide to upgrade to a StorSimple 8000 series, there will be the cost of the hardware device. 

Similarly, when using Azure File Sync, the subscription fees for the service may apply. In each case, customers will also have to pay ongoing storage costs. Refer to the following for an estimate: 
- [StorSimple pricing](https://azure.microsoft.com/pricing/details/storsimple/)  
- [AFS pricing]( https://azure.microsoft.com/pricing/details/storage/files/)

### Q.	How long does it take to complete a migration?

A. The time to migrate data depends on the amount of the data and the upgrade option selected. 

### Q. What is the End of Support date for StorSimple 8000 series?

A. The End of Support date for StorSimple 8000 series is published [here](https://support.microsoft.com/lifecycle/search?alpha=Azure%20StorSimple%208000%20Series).


## Next steps
 - [Migrate data from a StorSimple 5000-7000 series to an 8000 series device](storsimple-8000-migrate-from-5000-7000.md).
 - [Migrate data from a StorSimple 5000-7000 series to Azure File Sync](storsimple-5000-7000-afs-migration.md)
