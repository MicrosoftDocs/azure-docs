---
title: Best practices for configuring an Elastic SAN Preview
description: Elastic SAN best practices
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: sample
ms.date: 10/12/2022
ms.author: rogarana
ms.custom: ignite-2022, devx-track-azurepowershell
---

# Elastic SAN Preview best practices

 This article provides some general guidance and best practices for Azure Elastic SAN configurations and other Azure resources used with Elastic SAN.

## Elastic SAN

Keeping your Azure virtual machine (VM) and Elastic SAN in the same zone and same region minimizes latency and helps ensure you get the best performance.

When deploying an elastic SAN, ensure you allocate enough base capacity so that all your applications and workloads can meet their performance needs. To best determine your needs, collect performance metrics of your current workloads that you'd like to migrate. Examine the combined maximum IOPS and throughput for all these workloads over a period of time. Add some buffer to these figures if the data have any on-premises bottlenecks and to account for higher performance needs during spikes. After you've determined your needs, create an elastic SAN with enough base capacity that provides you the IOPS and throughput your workloads require. If you need more capacity but not more performance, use additional capacity, which costs less than base capacity. 

For best performance with your volumes, use multi-session connections.  multi-session connectivity has been optimized (32 sessions) through scripts on portal and documentation for providing best performance. Based on further performance improvements we will update this recommendation. NOTE: Windows software iSCSI initiator has a limit of maximum 256 sessions. Reduce # of sessions to each volume if you need to connect to more volumes from the client.

Elastic SAN uses VM network bandwidth, disk throughput limits on a VM do not apply. Choose a VM that can provide sufficient bandwidth for both production/VM-to-VM traffic and iSCSI traffic to attached Elastic SAN volume(s). 

iSCSI traffic isolation using a second vNIC - iSCSI traffic to Elastic SAN volumes cannot be redirected to a different vNIC on the VM due to lack of SendTargets support. Please redirect other production or VM to VM traffic to the secondary vNIC and use default (primary) vNIC for iSCSI throughput to attached Elastic SAN volumes. 

Enable “Accelerated Networking”. 


## MPIO

The following settings should provide optimal performance with MPIO on either Windows or Linux.

### Linux


|Setting  |Description  |Recommended value  |
|---------|---------|---------|
|polling_interval     |         |         |
|path_selector     |         |"round-robin 0"         |
|path_grouping_policy     |         |multibus         |
|path_checker     |         |tur         |
|checker_timeout     |         |30 sec         |
|failback     |         |immediate         |
|no_path_retry     |Number of retries until disable queueing, or "fail" means immediate failure (no queueing), "queue" means never stop queueing.         |>0         |
|user_friendly_names     |If set to "yes" create 'mpathn' names. Else use WWID as the alias.         |yes         |



### Windows

|Setting  |Description  |Dependency  |Recommended value  |
|---------|---------|---------|---------|
|Automatically claim iSCSI devices for MPIO     |Enable multipath support for iSCSI devices         |N/A         |TRUE         |
|Load balancing policy     |Load balancing policy         |N/A         |Round robin       |
|Disk time out     |Length of time the server waits before marking the I/O request as timed out.         |N/A         |120 sec         |

## iSCSI

If MPIO is enabled, set iSCSI timers to immediately defer commands to the multipathing layer. This ensures that I/O errors are retried and queued if all paths fail in the multipath layer.

### Windows

- Increase disk timeout value to prevent application from noticing I/O errors due to link loss. See MPIO Windows section for details.
- srbTimeoutDelta has a default value of 15 seconds. With the Microsoft iSCSI initiator, srbTimeoutDelta is added to the disk class driver's timeoutvalue (default of 10 seconds) when SCSI requests are being built. So the default SCCSI timeout value will be 25 seconds.
- DelaybetweenReconnect
- MaxConnectionRetries
- MaxRequestHoldTime
- LinkDownTime
- EnableNOPOut

### Linux

- NOP-Out interval and timeout: To help monitor problems, iSCSI layer sends a NOP-Out request to each target. If a NOP-Out request times out, the iSCSI layer responds by failing any running commands and instructing the SCSI layer to requeue those commands when possible. When multipath is being used, the SCSI layer will fail those running commands and defer them to the multipath layer. The multipath layer then retries those commands on another path. If multipath isn't being used, those commands are retried five times before failing altogether.