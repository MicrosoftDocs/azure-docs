<properties 
   pageTitle="StorSimple system limits table"
   description="Describes system limits and recommended sizes for StorSimple components and connections."
   services="storsimple"
   documentationCenter="NA"
   authors="alkohli"
   manager="adinah"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="08/18/2015"
   ms.author="alkohli" />

| Limit identifier | Limit | Comments |
|----------------- | ------|--------- |
| Maximum number of storage account credentials | 64 | |
| Maximum number of volume containers | 64 | |
| Maximum number of volumes | 255 | |
| Maximum number of schedules per bandwidth template | 168 | A schedule for every hour, every day of the week (24*7). |
| Maximum size of a volume | 64 TB |  |
| Maximum number of iSCSI connections | 512 | |
| Maximum number of iSCSI connections from initiators | 512 | |
| Maximum number of access control records per device | 64 | |
| Maximum number of volumes per backup policy | 24 | |
| Maximum number of backups retained per backup policy | 64 | |
| Maximum number of schedules per backup policy | 10 | |
| Maximum number of snapshots of any type that can be retained per volume | 256 | This includes local snapshots and cloud snapshots. |
| Maximum number of snapshots that can be present in any device | 10,000 | |
| Maximum number of volumes that can be processed in parallel for backup, restore, or clone | 16 |<ul><li>If there are more than 16 volumes, they will be processed sequentially as processing slots become available.</li><li>New backups of a cloned or a restored volume cannot occur until the operation is finished.</li></ul>|
| Restore and clone recover time | < 2 minutes | <ul><li>The volume is made available within 2 minutes of restore or clone operation, regardless of the volume size.</li><li>The volume performance may initially be slower than normal as most of the data and metadata still resides in the cloud. Performance may increase as data flows from the cloud to the StorSimple device.</li><li>The total time to download metadata depends on the allocated volume size. Metadata is automatically brought into the device in the background at the rate of 5 minutes per TB of allocated volume data. This rate may be affected by Internet bandwidth to the cloud.</li><li>The restore or clone operation is complete when all the metadata is on the device.</li><li>Backup operations cannot be performed until the restore or clone operation is fully complete.|
| Thin-restore availability | Last failover | |
| Maximum client read/write throughput (when served from the SSD tier)* | 920/720 MB/s with a single 10GbE network interface | Up to 2x with MPIO and two network interfaces. |
| Maximum client read/write throughput (when served from the HDD tier)* | 120/250 MB/s |
| Maximum client read/write throughput (when served from the cloud tier)* | 11/41 MB/s | Read throughput depends on clients generating and maintaining sufficient I/O queue depth. |

&#42; Maximum throughput per I/O type was measured with 100 percent read and 100 percent write scenarios. Actual throughput may be lower and depends on I/O mix and network conditions.
