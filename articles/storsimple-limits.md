<properties 
   pageTitle="StorSimple system limits" 
   description="Describes the limits for each StorSimple component or feature." 
   services="cloud-services, storage" 
   documentationCenter="NA" 
   authors="v-sharos" 
   manager="AdinaH" 
   editor=""/>

<tags
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD" 
   ms.date="02/16/2015"
   ms.author="v-sharos@microsoft.com"/>

# StorSimple system limits 

The following table shows the various system limits for your Microsoft Azure StorSimple system.

## Maximum values and recommendations

| Limit identifier                 | Limit | Comments                       |
| -------------------------------- | ----- | ------------------------------ |
| Maximum number of storage account credentials | 64 |                      |
| Maximum number of volume containers | 64 |                                |
| Maximum number of volumes        | 256   |                                |
| Maximum number of bandwidth templates | 25 |                              |
| Maximum number of schedules per bandwidth template | 168 | A schedule for every hour, every day of the week (24*7) |
| Maximum size of a volume         | 64 TB | The recommended size for NTFS volumes is 64 TB. |
| Maximum number of iSCSI connections | 512 |                               |
| Maximum number of iSCSI connections from initiators | 512 |               |
| Maximum number of access control records per device | 64 |                |
| Maximum number of volumes per backup policy         | 24 |                |
| Maximum number of backups retained per backup policy | 64 |               |
| Maximum number of snapshots of any type that can be retained per volume | 256 | |  
| Maximum number of snapshots that can be present in any device | 10,000 |  |
| Maximum number of volumes that can be processed in parallel for backup, restore, or clone | 16 | If there are more than 16 volumes, they will be processed sequentially as processing slots become available. New backups of a cloned or a restored volume cannot occur until the operation is completed.
| Processing rate for thin restore | 5 minutes/TB | <ul><li>Minimum time to make restored/cloned volume mountable, per TB of allocated volume data in backup. This rate is affected by Internet bandwidth to cloud.</li><li>Clone completion is done in background after volume is online, when performed on a different device than original. Time to completion is not included in this measurement.</li><li>Cloned volume is available for further backup operations after clone has completed.</li> | 
| Thin restore availability | Last failover |                               |
| Maximum client read/write throughput (when served from SSD tier)* | 920/720 MB/s with a single 10GbE network interface | Up to 2x with MPIO and two network interfaces. |
| Maximum client read/write throughput (when served from HDD tier)* | 120/250 MB/s ||
| Maximum client read/write throughput (when served from Cloud tier)* | 11/41 MB/s | Read throughput depends on clients generating and maintaining sufficient I/O queue depth. |

*Maximum throughput per I/O type was measured with 100 percent read and 100 percent write scenarios. Actual throughput may be lower and depends on I/O mix and network conditions.


## Next steps

[Get started with the StorSimple device](https://https://msdn.microsoft.com/library/azure/dn772363.aspx)
