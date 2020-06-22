---
title: Data migration options from StorSimple 8000 series devices
description: Provides an overview of the options to migrate data from StorSimple 8000 series.
services: storsimple
author: priestlg

ms.service: storsimple
ms.topic: article
ms.date: 03/25/2020 
ms.author: v-grpr

---
# Options to migrate data from StorSimple 8000 series

> [!IMPORTANT]
> On December 31, 2022 the StorSimple 8000 series will reach end of support (EOS) status. We recommend that StorSimple 8000 series customers migrate to one of the alternatives described in the document.

StorSimple 8000 series is reaching [end of Support](https://support.microsoft.com/lifecycle/search?alpha=Azure%20StorSimple%208000%20Series) in December 2022. The customers who are running StorSimple 8000 series have an option to upgrade to other Azure first party hybrid services. This article describes the Azure hybrid options available to migrate data.

## Migration options

The customers using StorSimple 8000 series have Azure or third-party options.

### Azure options

#### Migrate to Azure File Sync

This brand new migration option enables customers to store their organization's file shares in the Azure Files. These files shares are then centralized for on-premises access using Azure File Sync (AFS). AFS can be deployed on a Windows Server host. The actual data migration is then performed as a host copy or using the migration tool.

For more information on how to migrate data to Azure File Sync, go to [StorSimple 8100 and 8600 migration to Azure File Sync](https://docs.microsoft.com/azure/storage/files/storage-files-migration-storsimple-8000).

### Third-party options

#### Migrate to Panzura Freedom NAS

StorSimple 5000-7000 series and StorSimple 8000 series customers can choose to migrate to Panzura Freedom NAS to keep their data in Azure. The Panzura Freedom solution provides a NAS solution that spans datacenters, offices, public and private clouds. The solution enables local, hybrid, and in-cloud data workflows for NFS, SMB, and mobile clients.

This migration is supported by Panzura and customers can get started by requesting migration support from the [Panzura website](https://panzura.com/migrate-storsimple-panzura/).

#### Migrate to Nasuni

Moving your entire StorSimple environment to a stable, secure, high performance file services platform is easy with Nasuni. Nasuni offers the security and performance of on-premises file storage while combining it with the scalability and durability of Azure.  As a leading Azure independent software vendor (ISV), Nasuni brings all the tools necessary to move your StorSimple data to a modern platform that lets you share and collaborate with your files across multiple locations.

Get started today: [Nasuni website](https://info.nasuni.com/storsimple8000-webinar).

<!-- 04/09/2020 v-grpr (priestlg) - As per request, commenting out this section because the information that will go into this section is forthcoming
#### Migrate to Cohesity

Cohesity enables you to migrate data from your current StorSimple 5000–7000 to the Cohesity Data Platform on Azure. The Cohesity Data Platform is a software-defined web-scale solution that consolidates files, backups, objects, and VMs onto a single cloud-native solution. After migration to the Data Platform, you can manage, protect, and provision data and apps from cloud to core through a single pane of glass. With Cohesity, start with as few as three nodes. 

Learn more on [migration to the Cohesity Data Platform](https://info.cohesity.com/migrate-from-storsimple-to-cohesity.html).

#### Migrate to Nasuni

Nasuni makes it easy for StorSimple 5000-7000 customers to migrate and keep their data in Azure.  Nasuni is a leading Azure-based NAS storage solution, giving customers the performance and security they expect from on-prem solutions, with cloud economics and scale.  In addition to high performance file storage, Nasuni and Azure handle backup and DR, while allowing you to share and collaborate on your data around the globe with centralized file storage management. 

Nasuni has the experience to make your migration easy – get started today: https://info.nasuni.com/nasuni-storsimple-migration

#### Migrate to Talon FAST

Talon makes it easy for StorSimple 5000-7000 customers to continue to leverage the benefits they valued so much in the StorSimple platform (small on-site footprint backed by unlimited cloud resources) with even greater function.  With the Talon FAST solution, customers can migrate and keep their data in Azure, while now having an even smaller software-only onsite footprint and adding benefits such as global file locking, global namespace, and multi-site collaboration.  Talon is a leading Azure ecosystem solution, working with global customers to migrate their on-premises file server workloads into a consolidated, Azure-based footprint without compromising user workflow or experience.  

Learn more about how to evolve to a cloud-consolidated enterprise at https://www.talonstorage.com/alliances/microsoft-storsimple.
-->

## Migration - Frequently asked questions

### Q. When do the StorSimple 8000 series devices reach end of service?

A. StorSimple 8000 series reach [end of support](https://support.microsoft.com/[lifecycle/search?alpha=Azure%20StorSimple%208000%20Series) in December 2022. The end of support implies that Microsoft will no longer be able to provide support for both hardware and software of these devices after December 2022. We strongly recommend that you start formulating a plan to migrate the data from your devices now.

### Q. What happens to the data I have stored in Azure?  

A. You can continue to use the data in Azure once you migrate it to a newer service.

### Q. What happens to the data I have stored locally on my StorSimple device?

A. The data that is on the local device can be copied to the newer service as described in the migration documents.

### Q. What happens if I want to keep my StorSimple 8000 series appliance?

A. While the services might continue to work, Microsoft will no longer be able to provide hardware and software support. Migration is strongly recommended for business continuity.

### Q. What options are available to migrate data from StorSimple 8000 series devices?

A. Depending on their scenario, StorSimple 8000 series users have the following migration options:

* **Migrate to Azure File Sync**: Use this option when you want to switch to Azure native format. You can use Azure File Sync for centralized management of file shares.

* **Other options**: You can contact Microsoft Support to discuss migration options not listed here.

### Q. Is migration to other storage solutions supported?

A. Yes. Migration to other storage solutions using host copy of the data is supported.

### Q. Is migration supported by Microsoft?

A. Migrating from 8000 series is a fully supported operation. In fact, Microsoft recommends reaching out to Support before you start migration. Migration is currently an assisted operation. If you intend to migrate data from your StorSimple 8000 series device, [contact StorSimple support](mailto:storsimp@microsoft.com).

### Q. What is the pricing model for migration to Azure File Sync?

A. When using Azure File Sync, the subscription fees for the service may apply. Customers will also have to pay ongoing storage costs. Refer to [AFS pricing]( https://azure.microsoft.com/pricing/details/storage/files/) for an estimate.

### Q. How long does it take to complete a migration?

A. The time to migrate data depends on the amount of the data and the upgrade option selected.

## Next steps

* [Migrate data from a StorSimple 8000 series to Azure File Sync](https://docs.microsoft.com/azure/storage/files/storage-files-migration-storsimple-8000)
