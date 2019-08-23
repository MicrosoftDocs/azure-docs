---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

| Limit identifier | Limit | Comments |
| --- | --- | --- |
| Maximum number of storage account credentials |64 | |
| Maximum number of volume containers |64 | |
| Maximum number of volumes |255 | |
| Maximum number of schedules per bandwidth template |168 |A schedule for every hour, every day of the week. |
| Maximum size of a tiered volume on physical devices |64 TB for StorSimple 8100 and StorSimple 8600 |StorSimple 8100 and StorSimple 8600 are physical devices. |
| Maximum size of a tiered volume on virtual devices in Azure |30 TB for StorSimple 8010 <br></br> 64 TB for StorSimple 8020 |StorSimple 8010 and StorSimple 8020 are virtual devices in Azure that use Standard storage and Premium storage, respectively. |
| Maximum size of a locally pinned volume on physical devices |9 TB for StorSimple 8100 <br></br> 24 TB for StorSimple 8600 |StorSimple 8100 and StorSimple 8600 are physical devices. |
| Maximum number of iSCSI connections |512 | |
| Maximum number of iSCSI connections from initiators |512 | |
| Maximum number of access control records per device |64 | |
| Maximum number of volumes per backup policy |24 | |
| Maximum number of backups retained per backup policy |64 | |
| Maximum number of schedules per backup policy |10 | |
| Maximum number of snapshots of any type that can be retained per volume |256 |This amount includes local snapshots and cloud snapshots. |
| Maximum number of snapshots that can be present in any device |10,000 | |
| Maximum number of volumes that can be processed in parallel for backup, restore, or clone |16 |<ul><li>If there are more than 16 volumes, they're processed sequentially as processing slots become available.</li><li>New backups of a cloned or a restored tiered volume can't occur until the operation is finished. For a local volume, backups are allowed after the volume is online.</li></ul> |
| Restore and clone recover time for tiered volumes |<2 minutes |<ul><li>The volume is made available within 2 minutes of a restore or clone operation, regardless of the volume size.</li><li>The volume performance might initially be slower than normal as most of the data and metadata still resides in the cloud. Performance might increase as data flows from the cloud to the StorSimple device.</li><li>The total time to download metadata depends on the allocated volume size. Metadata is automatically brought into the device in the background at the rate of 5 minutes per TB of allocated volume data. This rate might be affected by Internet bandwidth to the cloud.</li><li>The restore or clone operation is complete when all the metadata is on the device.</li><li>Backup operations can't be performed until the restore or clone operation is fully complete. |
| Restore recover time for locally pinned volumes |<2 minutes |<ul><li>The volume is made available within 2 minutes of the restore operation, regardless of the volume size.</li><li>The volume performance might initially be slower than normal as most of the data and metadata still resides in the cloud. Performance might increase as data flows from the cloud to the StorSimple device.</li><li>The total time to download metadata depends on the allocated volume size. Metadata is automatically brought into the device in the background at the rate of 5 minutes per TB of allocated volume data. This rate might be affected by Internet bandwidth to the cloud.</li><li>Unlike tiered volumes, if there are locally pinned volumes, the volume data is also downloaded locally on the device. The restore operation is complete when all the volume data has been brought to the device.</li><li>The restore operations might be long and the total time to complete the restore will depend on the size of the provisioned local volume, your Internet bandwidth, and the existing data on the device. Backup operations on the locally pinned volume are allowed while the restore operation is in progress. |
| Thin-restore availability |Last failover | |
| Maximum client read/write throughput, when served from the SSD tier* |920/720 MB/sec with a single 10-gigabit Ethernet network interface |Up to two times with MPIO and two network interfaces. |
| Maximum client read/write throughput, when served from the HDD tier* |120/250 MB/sec | |
| Maximum client read/write throughput, when served from the cloud tier* |11/41 MB/sec |Read throughput depends on clients generating and maintaining sufficient I/O queue depth. |

&#42;Maximum throughput per I/O type was measured with 100 percent read and 100 percent write scenarios. Actual throughput might be lower and depends on I/O mix and network conditions.

