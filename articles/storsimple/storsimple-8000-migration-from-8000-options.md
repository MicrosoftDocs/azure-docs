---
title: Data migration options from StorSimple 8000 series devices
description: Provides an overview of the options to migrate data from StorSimple 8000 series.
services: storsimple
author: alkohli

ms.service: storsimple
ms.topic: how-to
ms.date: 08/18/2022 
ms.author: alkohli

---
# Options to migrate data from StorSimple 8000 series

[!INCLUDE [storsimple-8000-eol-banner](../../includes/storsimple-8000-eol-banner-2.md)]

## Migration options

There are two main migration paths, cloud-side or on-premises:

### Cloud-side migrations

There are two Azure offerings you can migrate to from StorSimple: Azure Files and Azure Blob Storage. Alternatively, you can migrate your data to another cloud location of your choice. However, you must migrate your data into either Azure Files or Azure Blob Storage. Then you can migrate to a location of your choice. Azure can't assist with migrations to external services.

* **Azure file shares** </br>If you want to preserve your file and folder structure, ACLs, timestamps, attributes, and backups, then Azure Files is the ideal choice. Optionally, you can also make use of Azure File Sync and create an on-premises cache of your Azure file shares. Backup, cloud tiering, and multi-site sync are also highly utilized features that match or exceed previous StorSimple capabilities. To migrate to Azure Files, see [StorSimple 8100 and 8600 migration to Azure File Sync](../storage/files/storage-files-migration-storsimple-8000.md).
* Azure Blob Storage</br>If you don't want to preserve file and folder metadata, ACLs, or backups, and SMB access isn't important, then Azure Blob Storage may fit your needs. Specifically, the archive tier can provide long-term, cost efficient offline storage, if only the raw data needs to be preserved.

The StorSimple Data Manager can be used to move the latest StorSimple volume backup into a blob container.
The Data Manager has a dedicated migration service built-in, that allows you to split your StorSimple volumes into several Azure file shares, move all required backups, and preserves file fidelity to its best ability. To use this migration path, see [StorSimple 8100 and 8600 migration to Azure File Sync](../storage/files/storage-files-migration-storsimple-8000.md).

If neither of the Azure offerings are suitable for your data, you can migrate your data from either Azure Files or Azure Blob Storage to a location of your choice. RoboCopy or AzCopy can be helpful to accomplish such a move out. Check with the vendor of your choice to find the best possible migration path for data located in either Azure file shares or Azure blob containers.

### On-premises recall and copy


If you want to maintain an on-premises solution, it's generally better to first migrate cloud-side into a number of Azure file shares, then copy from the Azure file shares back to on-premises. Migrating cloud-side first is quicker and allows you to retain backups. This method would only require a final RoboCopy `/MIR` from the StorSimple appliance before cutting over users and apps to the new on-premises storage location.


Any file access against your StorSimple volume will cause the StorSimple appliance to either serve it from local cache or recall it from the cloud, on-demand. Theoretically, a RoboCopy run would sequentially recall all content and move it to a target storage device with SMB protocol capabilities. While this option can work, it will be slow. Furthermore, it has a chance to interrupt your business operations. The StorSimple appliances have a limited cache. Running RoboCopy will fill the cache and displace previously cached files that might be important to users or applications. Subsequent access to these files competes for space, network, and compute abilities of your Storimple appliance and may result in a degraded experience. 


## Migration - Frequently asked questions



### Q. What happens to the data I have stored in Azure - beyond the end-of-life date?

A. Data loss! Your data is stored in a proprietary format in Azure storage accounts. It will remain there beyond the end-of-life date, until you delete it. However, you will no longer be able to interpret the data once the StorSimple cloud service is turned off.

### Q. What happens to the data I have stored locally on my StorSimple device - beyond the end-of-life date?

A. You lose all data stored locally on your StorSimple device. Your StorSimple appliance has a limited, local cache capacity. Once the StorSimple cloud service is shut down, you won't be able to access tiered files that your local appliance only holds a cloud reference for. For a limited amount of time, it is likely but not guaranteed that you still have access to the files stored in the appliances local cache. However, you should never assume that even the locally cached files remain available past the end-of-life date. Eventually, the appliance will stop working when it is no longer able to reach the cloud service. To migrate and preserve your data, see [StorSimple 8100 and 8600 migration to Azure File Sync](../storage/files/storage-files-migration-storsimple-8000.md).

### Q. What happens if I want to keep my StorSimple 8000 series appliance - beyond the end-of-life date?

A. Depending on your contractual obligations, you may keep the appliance hardware. Microsoft won't request leased devices to be returned. The device will stop working. Microsoft won't provide hardware and software support. The StorSimple service won't work. Migration is required for business continuity before the end-of-life date. To migrate and preserve your data, see [StorSimple 8100 and 8600 migration to Azure File Sync](../storage/files/storage-files-migration-storsimple-8000.md).







### Q. How long does it take to complete a migration?

A. The time to migrate depends on several factors. We often default to considering bandwidth as the most limiting factor in a migration - and that can be true. But the ability to enumerate a namespace can influence the total time to copy even more for larger namespaces with smaller files. Consider that copying 1 TiB of small files will take considerably longer than copying 1 TiB of fewer but larger files. Assuming that all other variables remain the same. Other factors are the structure of your StorSimple deployment. That will determine how many migration jobs you can run in parallel.

## Next steps

* [Migrate data from a StorSimple 8000 series with the dedicated migration service](../storage/files/storage-files-migration-storsimple-8000.md).