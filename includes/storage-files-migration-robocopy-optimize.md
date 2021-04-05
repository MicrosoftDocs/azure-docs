---
title: include file
description: include file
services: storage
author: fauhse
ms.service: storage
ms.topic: include
ms.date: 2/20/2020
ms.author: fauhse
ms.custom: include file
---

Speed and success rate of a given RoboCopy run will depend on several factors:

* IOPS on the source and target storage
* the available network bandwidth between source and target
* the ability to quickly process files and folders in a namespace
* the number of changes between RoboCopy runs


### IOPS and Bandwidth considerations

In this category, you need to consider abilities of the **source storage**, the **target storage**, and the **network** connecting them. The maximum possible throughput is determined by the slowest of these three components. Make sure your network infrastructure is configured to support optimal transfer speeds to its best abilities.

> [!CAUTION]
> While copying as fast as possible is often most desireable, consider the utilization of your local network and NAS appliance for other, often business critical tasks.

Copying as fast as possible might not be desirable when there is a risk that the migration could monopolize available resources.

* Consider when it's best in your environment to run migrations: during the day, off-hours, or during weekends.
* Also consider networking QoS on a Windows Server to throttle the RoboCopy speed and thus the impact on NAS and network.
* Avoid unnecessary work for the migration tools.

RobCopy itself also has the ability to insert inter-packet delays by specifying the `/IPG:n` switch where `n` is measured in milliseconds between RoboCopy packets. Using this switch can help avoid monopolization of resources on both IO constrained NAS devices, and highly utilized network links. 

`/IPG:n` cannot be used for precise network throttling to a certain Mbps. Use Windows Server Network QoS instead. RoboCopy entirely relies on the SMB protocol for all networking and thus doesn't have the ability to influence the network throughput itself, but it can slow down its utilization. 

A similar line of thought applies to the IOPS observed on the NAS. The cluster size on the NAS volume, packet sizes, and an array of other factors influence the observed IOPS. Introducing inter-packet delay is often the easiest way to control the load on the NAS. Test multiple values, for instance from about 20 milliseconds (n=20) to multiples of that to see how much delay allows your other requirements to be serviced while keeping the RoboCopy speed at it's maximum for your constraints.

### Processing speed

RoboCopy will traverse the namespace it is pointed to and evaluate each file and folder for copy. Every file will be evaluated during an initial copy and during catch-up copies. For example repeated runs of RoboCopy /MIR against the same source and target storage locations to minimize downtime and improve success rate of files copied.

We often default to considering bandwidth as the most limiting factor in a migration - and that can be true. But the ability to enumerate a namespace can influence the total time to copy even more for larger namespaces with smaller files. Consider that copying 1 TiB of small files will take considerably longer than copying 1 TiB of fewer but larger files - granted that all other variables are the same.

The cause for this difference is the processing power needed to walk through a namespace. RoboCopy supports multi-threaded copies through the `/MT:n` parameter where n stands for the number of processor threads. So when provisioning a machine specifically for RoboCopy, consider the number of processor cores and their relationship to the thread count they provide. Most common are two threads per core. The core and thread count of a machine is an important data point to decide what multi-thread values `/MT:n` you should specify. Also consider how many RoboCopy jobs you plan to run in parallel on a given machine.

More threads will copy our 1TiB example of small files considerably faster than fewer threads. At the same time, there is a decreasing return on investment on our 1TiB of larger files. They will still copy faster with more threads assigned but the diminishing return on investment begins with an increase in probability of getting constrained by network bandwidth or available IOPS.

### Avoid unnecessary work

Avoid large-scale changes in your namespace. That includes moving files between directories, changing properties at a large scale, or changing permissions (NTFS ACLs) because they often have a cascading change effect when folder ACLs closer to the root of a share are changed. Consequences can be:

* extended RoboCopy job run time due to each file and folder affected by an ACL change needing to be updated
* effectiveness of leveraging data moved earlier can decrease. For instance by using DataBox or an earlier RoboCopy run. More data will need to be copied when folder structures change after files had already been copied earlier. A RoboCopy job will not be able to "play back" a namespace change and rather will need to purge the files transported to for instance an Azure file share and upload the files in the new folder structure again to Azure.

Another important aspect is to use the RoboCopy tool effectively. With the recommended RoboCopy script, you will create and save a log file for errors. Copy errors can occur - that is normal. These errors often make it necessary to run multiple rounds of a copy tool like RoboCopy. An initial run, say from NAS to DataBox, and one or more extra ones with the /MIR switch to catch and retry files that didn't get copied.

You should be prepared to run multiple rounds of RoboCopy against a given namespace scope. Successive runs will finish faster as they have less to copy but are constrained increasingly by the speed of processing the namespace. When you run multiple rounds, you can speed up each round by not having RoboCopy try unreasonably hard to copy everything in a given run. These RoboCopy switches can make a significant difference:

* `/R:n` n = how often you retry to copy a failed file and 
* `/W:n` n = how many seconds to wait between retries

`/R:5 /W:5` is a reasonable setting that you can adjust to your liking. In this example, a failed file will be retried five times, with five-second wait time between retries. If the file still fails to copy, the next RoboCopy job will try again and often files that failed because they are in use or because of timeout issues might eventually be copied successfully this way.
   