---
title: include file
description: include file
services: storage
author: khdownie
ms.service: azure-file-storage
ms.topic: include
ms.date: 06/22/2022
ms.author: kendownie
ms.custom: include file
---

Speed and success rate of a given RoboCopy run will depend on several factors:

* IOPS on the source and target storage
* the available network bandwidth between source and target
* the ability to quickly process files and folders in a namespace
* the number of changes between RoboCopy runs
* the size and number of files you need to copy


### IOPS and bandwidth considerations

In this category, you need to consider abilities of the **source storage**, the **target storage**, and the **network** connecting them. The maximum possible throughput is determined by the slowest of these three components. Make sure your network infrastructure is configured to support optimal transfer speeds to its best abilities.

> [!CAUTION]
> While copying as fast as possible is often most desireable, consider the utilization of your local network and NAS appliance for other, often business-critical tasks.

Copying as fast as possible might not be desirable when there's a risk that the migration could monopolize available resources.

* Consider when it's best in your environment to run migrations: during the day, off-hours, or during weekends.
* Also consider networking QoS on a Windows Server to throttle the RoboCopy speed.
* Avoid unnecessary work for the migration tools.

RoboCopy can insert inter-packet delays by specifying the `/IPG:n` switch where `n` is measured in milliseconds between RoboCopy packets. Using this switch can help avoid monopolization of resources on both IO constrained devices, and crowded network links.

`/IPG:n` can't be used for precise network throttling to a certain Mbps. Use Windows Server Network QoS instead. RoboCopy entirely relies on the SMB protocol for all networking needs. Using SMB is the reason why RoboCopy can't influence the network throughput itself, but it can slow down its use.

A similar line of thought applies to the IOPS observed on the NAS. The cluster size on the NAS volume, packet sizes, and an array of other factors influence the observed IOPS. Introducing inter-packet delay is often the easiest way to control the load on the NAS. Test multiple values, for instance from about 20 milliseconds (n=20) to multiples of that number. Once you introduce a delay, you can evaluate if your other apps can now work as expected. This optimization strategy will allow you to find the optimal RoboCopy speed in your environment.

### Processing speed

RoboCopy will traverse the namespace it's pointed to and evaluate each file and folder for copy. Every file will be evaluated during an initial copy and during catch-up copies. For example, repeated runs of RoboCopy /MIR against the same source and target storage locations. These repeated runs are useful to minimize downtime for users and apps, and to improve the overall success rate of files migrated.

We often default to considering bandwidth as the most limiting factor in a migration - and that can be true. But the ability to enumerate a namespace can influence the total time to copy even more for larger namespaces with smaller files. Consider that copying 1 TiB of small files will take considerably longer than copying 1 TiB of fewer but larger files, assuming that all other variables remain the same. Therefore, you may experience slow transfer if you're migrating a large number of small files. This is an expected behavior.

The cause for this difference is the processing power needed to walk through a namespace. RoboCopy supports multi-threaded copies through the `/MT:n` parameter where **n** stands for the number of threads to be used. So when provisioning a machine specifically for RoboCopy, consider the number of processor cores and their relationship to the thread count they provide. Most common are two threads per core. The core and thread count of a machine is an important data point to decide what multi-thread values `/MT:n` you should specify. Also consider how many RoboCopy jobs you plan to run in parallel on a given machine.

More threads will copy our 1-TiB example of small files considerably faster than fewer threads. At the same time, the extra resource investment on our 1 TiB of larger files may not yield proportional benefits. A high thread count will attempt to copy more of the large files over the network simultaneously. This extra network activity increases the probability of getting constrained by throughput or storage IOPS.

During a first RoboCopy into an empty target or a differential run with lots of changed files, you are likely constrained by your network throughput. Start with a high thread count for an initial run. A high thread count, even beyond your currently available threads on the machine, helps saturate the available network bandwidth. Subsequent /MIR runs are progressively impacted by processing items. Fewer changes in a differential run mean less transport of data over the network. Your speed is now more dependent on your ability to process namespace items than to move them over the network link. For subsequent runs, match your thread count value to your processor core count and thread count per core. Consider if cores need to be reserved for other tasks a production server may have.

> [!TIP]
> Rule of thumb: The first RoboCopy run, that will move a lot of data of a higher-latency network, benefits from over-provisioning the thread count (`/MT:n`). Subsequent runs will copy fewer differences and you are more likely to shift from network throughput constrained to compute constrained. Under these circumstances, it is often better to match the RoboCopy thread count to the actually available threads on the machine. Over-provisioning in that scenario can lead to more context shifts in the processor, possibly slowing down your copy.

### Avoid unnecessary work

Avoid large-scale changes in your namespace. For example, moving files between directories, changing properties at a large scale, or changing permissions (NTFS ACLs). Especially ACL changes can have a high impact because they often have a cascading change effect on files lower in the folder hierarchy. Consequences can be:

* extended RoboCopy job run time because each file and folder affected by an ACL change needing to be updated
* reusing data moved earlier may need to be recopied. For instance, more data will need to be copied when folder structures change after files had already been copied earlier. A RoboCopy job can't "play back" a namespace change. The next job must purge the files previously transported to the old folder structure and upload the files in the new folder structure again.

Another important aspect is to use the RoboCopy tool effectively. With the recommended RoboCopy script, you'll create and save a log file for errors. Copy errors can occur - that is normal. These errors often make it necessary to run multiple rounds of a copy tool like RoboCopy. An initial run, say from a NAS to DataBox or a server to an Azure file share. And one or more extra runs with the /MIR switch to catch and retry files that didn't get copied.

You should be prepared to run multiple rounds of RoboCopy against a given namespace scope. Successive runs will finish faster as they have less to copy but are constrained increasingly by the speed of processing the namespace. When you run multiple rounds, you can speed up each round by not having RoboCopy try unreasonably hard to copy everything in a given run. These RoboCopy switches can make a significant difference:

* `/R:n` n = how often you retry to copy a failed file and 
* `/W:n` n = how many seconds to wait between retries

`/R:5 /W:5` is a reasonable setting that you can adjust to your liking. In this example, a failed file will be retried five times, with five-second wait time between retries. If the file still fails to copy, the next RoboCopy job will try again. Often files that failed because they are in use or because of timeout issues might eventually be copied successfully this way.

### Windows Server 2022 and RoboCopy LFSM

The RoboCopy switch `/LFSM` can be used to avoid a RoboCopy job failing with a *volume full* error. RoboCopy will pause whenever a file copy would cause the destination volume's free space to go below a "floor" value.

Use RoboCopy with Windows Server 2022. Only this version of RoboCopy contains important bug fixes and features that make the switch compatible with additional flags needed in most migrations. For example, compatibility with the `/B` flag.

`/B` runs RoboCopy in the same mode that a backup application would use. This switch allows RoboCopy to move files that the current user doesn't have permissions for. 

Normally, RoboCopy can be run on the Source, Destination or a third machine. 

> [!IMPORTANT]
> If you intend to use `/LFSM`, RoboCopy must be run on the Windows Server 2022 target Azure File Sync server. 

Note also that with `/LFSM` you must also use a local path for the destination, not a UNC path. For example as a destination path you should use *E:\Foldername* rather than a UNC path like *\\\\ServerName\FolderName*.

> [!CAUTION]
> The currently available version of RoboCopy on Windows Server 2022 has a bug that causes the pauses to count against the per file error count. Apply the following workaround.

The recommended `/R:2 /W:1` flags increase the probability that a file is failed due to an `/LFSM` induced pause. In this example, a file that wasn't copied after 3 pauses because `/LFSM` caused the pause, will incorrectly make RoboCopy fail the file. The workaround for this is to use higher values for `/R:n` and `/W:n`. A good example is `/R:10 /W:1800` (10 retries of 30 minutes each). This should give the Azure File Sync tiering algorithm time to create space on the destination volume. 

This bug has been fixed but the fix is not yet publicly available. Check this paragraph for updates on the availability of the fix and how to deploy it.
