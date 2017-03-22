---
title: troubleshoot protection failures (Hyper-v to Azure) | Microsoft Docs
description: This article describes the common Hyper-v replication failures and how to troubleshoot them
services: site-recovery
documentationcenter: ''
author: asgang
manager: rochakm
editor: ''

ms.assetid: 
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 03/2/2017
ms.author: asgang

---
## Troubleshoot on-premises Hyper-V replication  issues

This article catalogs the most common errors and mitigation during the Hyper-v replication failures.
To start troubleshooting, connect to the on-premises Hyper-V manager console, select the virtual
machine, and see the replication health.

![Option to view replication health in the Hyper-V manager console](media/site-recovery-monitoring-and-troubleshooting/image12.png)

In this case, **Replication Health** is **Critical**. Right-click the virtual machine, and then click **Replication** > **View Replication Health** to see the details.

![Replication health for a specific virtual machine](media/site-recovery-monitoring-and-troubleshooting/image13.png)

If replication is paused for the virtual machine, right-click the virtual machine, and then click **Replication** > **Resume replication**.

![Option to resume replication in the Hyper-V manager console](media/site-recovery-monitoring-and-troubleshooting/image19.png)

    > [!NOTE]
	> If a virtual machine migrates to a new Hyper-V host that's within the cluster or a standalone machine and the Hyper-V host has been configured through Azure Site Recovery, replication for the virtual machine wouldn't be impacted. Ensure that the new Hyper-V host meets all the prerequisites and is configured by using Azure Site Recovery.


### Event Log
| Event sources | Details |
| --- |:--- |
| **Applications and Service Logs/Microsoft/VirtualMachineManager/Server/Admin** (Virtual Machine Manager server) |Provides useful logging to troubleshoot many different Virtual Machine Manager issues. |
| **Applications and Service Logs/MicrosoftAzureRecoveryServices/Replication** (Hyper-V host) |Provides useful logging to troubleshoot many Microsoft Azure Recovery Services Agent issues. <br/> ![Location of Replication event source for Hyper-V host](media/site-recovery-monitoring-and-troubleshooting/eventviewer03.png) |
| **Applications and Service Logs/Microsoft/Azure Site Recovery/Provider/Operational** (Hyper-V host) |Provides useful logging to troubleshoot many Microsoft Azure Site Recovery Service issues. <br/> ![Location of Operational event source for Hyper-V host](media/site-recovery-monitoring-and-troubleshooting/eventviewer02.png) |
| **Applications and Service Logs/Microsoft/Windows/Hyper-V-VMMS/Admin** (Hyper-V host) |Provides useful logging to troubleshoot many Hyper-V virtual machine management issues. <br/> ![Location of Virtual Machine Manager event source for Hyper-V host](media/site-recovery-monitoring-and-troubleshooting/eventviewer01.png) |

### Hyper-V replication logging options
All events that pertain to Hyper-V replication are logged in the Hyper-V-VMMS\\Admin log located under Applications and Services Logs\\Microsoft\\Windows. In addition, you can enable an Analytic log for the Hyper-V Virtual Machine Management Service. To enable this log, first make the Analytic and Debug logs viewable in the Event Viewer. Open Event Viewer, and then click **View** > **Show Analytic and Debug Logs**.

![The Show Analytic and Debug Logs option](media/site-recovery-monitoring-and-troubleshooting/image14.png)

An Analytic log is visible under **Hyper-V-VMMS**.

![The Analytic log in the Event Viewer tree](media/site-recovery-monitoring-and-troubleshooting/image15.png)

In the **Actions** pane, click **Enable Log**. After it's enabled, it
appears in **Performance Monitor** as an **Event Trace Session** located
under **Data Collector Sets.**

![Event Trace Sessions in the Performance Monitor tree](media/site-recovery-monitoring-and-troubleshooting/image16.png)

To view the collected information, first stop the tracing session by disabling the log. Save the log, and open it again in Event Viewer or use other tools to convert it as desired.

### Hyper-V Replica issues, fixed for Azure Site Recovery in the July 2016 update for Windows Server 2012 R2
Following improvements are made in [Hyper-v replica update](https://support.microsoft.com/en-in/help/3184854/hyper-v-replica-issues-are-fixed-for-azure-site-recovery-in-the-july-2016-update-for-windows-server-2012-r2) to fix issues related  re synchronization (resync) or paused state during replication, or time-outs during initial replication or delta replication.


**Issue 1**

A virtual machine goes into resynchronization because of high churn on one of the disks. The previous logic was that the virtual machine goes into resynchronization if the accumulated logs for a virtual machine go beyond 50 percent of a replicating virtual hard disk that's attached to the virtual machine. This was calculated based on the size of the lowest disk.

With this fix, the calculation for the 50 percent is based on the total of all the replicating virtual hard disks that are attached to the virtual machine, not to one of its virtual hard disks.

**Issue 2**

When the system performs resynchronization, and there's a tracking error, the state reverts to "resync required." Despite this error, the system that was used to continue trying to complete the resynchronization fails. This causes cyclic resynchronization.

With this fix, if the tracking for the virtual machine indicates an error, the system aborts the current resynchronization reverts to "resync required." This saves time and bandwidth usage.

**Issue 3**

During replication, there is currently a threshold value of "free storage space." This is set at 300 MB, at which point the virtual machine goes into resynchronization. The low value of 300 MB could cause the production virtual machine to be paused by Hyper-V.

With this fix, the threshold value at which the virtual machine goes into resynchronization is increased to 3 GB.

**Issue 4**

During resynchronization, the free storage space is not monitored. This may cause the production virtual machine to pause.

With this fix, the threshold value at which the virtual machine will stop resynchronization is set to 3 GB.

**Issue 5**

During the phase of initial replication, if the initial replication does not finish in five days, replication is stopped with a time-out error. The time-out value of five days is too low for deployments in which the initial disk size is quite large, the bandwidth is low, or both.

With this fix, the time-out for initial replication is increased to 30 days. At the end of this period, replication is paused, and the user must resume replication.

**Issue 6**

During the state of delta replication that occurs after initial replication, if the delta replication does not finish within six hours for a particular cycle, replication goes into a resynchronization-required state. The value of six hours is too low for deployments in which there's a lot of churn in a particular cycle, the bandwidth is low, or both. This is also true for the delta replication immediately after the initial replication.

With this fix, the time-out for a delta replication cycle is increased to 15 days.

### Virtual Machine Replication state on the Azure portal and Hyper-V console is out of sync

In case virtual machine initial replication job failed and you resume the replication through Hyper-V manager, you will see that ASR portal is not able to get the exact state of the machine and the protection state keep on showing critical even if the health of replication in hyper-v shows green.

On the portal, you see below error 
![IR error on the portal](media/site-recovery-protection-common-errors/hyper-v-IR-failure.png)

To make the replication health status of the machine in sync with hyper-v, use following steps 

1. Copy and save the [script](https://gallery.technet.microsoft.com/scriptcenter/Script-to-correct-virtual-d3bdd152) on Hyper-V host where you are seeing above issue 

2. Open power shell, run the script and after login to Azure select the subscription.  
![enter subscription](media/site-recovery-protection-common-errors/Enter-Subscription-Number.png)

3. Enter name of the vault 
 ![enter vault](media/site-recovery-protection-common-errors/enter-vaultname.png)

4. Enter location where you want to download the vault credential file 
![enter location ](media/site-recovery-protection-common-errors/enter-file-download-location.png)
5. Enter provider input whether you are using VMM or only Hyper-v server.
![enter provider ](media/site-recovery-protection-common-errors/E2A-B2A-Check-and-Input-Cloud-Name-SiteName.png)
6. Enter the virtual machine name 
![enter machine name](media/site-recovery-protection-common-errors/Virtual-Machine-Name.png)
7. Provide Storage account of the virtual machine
![enter storage account](media/site-recovery-protection-common-errors/Storage_Account.png)
8. This restarts the failed initial replication job on the portal and completes it successfully. It is to note that no data transfer is done again. 
![initial replication job](media/site-recovery-protection-common-errors/Job-status.png)
9. On the portal, you should see the status of machine to become green and protected 
![initial replication job](media/site-recovery-protection-common-errors/IR-job-success.png)

#### Following are some common protection errors and their resolutions. 
* [Enable protection failed since Agent not installed on host machine.](http://social.technet.microsoft.com/wiki/contents/articles/31105.enable-protection-failed-since-agent-not-installed-on-host-machine.aspx)
* [A suitable host for the replica virtual machine can't be found - Due to low compute resources.](http://social.technet.microsoft.com/wiki/contents/articles/25501.a-suitable-host-for-the-replica-virtual-machine-can-t-be-found-due-to-low-compute-resources.aspx)
* [A suitable host for the replica virtual machine can't be found - Due to no logical network attached.](http://social.technet.microsoft.com/wiki/contents/articles/25502.a-suitable-host-for-the-replica-virtual-machine-can-t-be-found-due-to-no-logical-network-attached.aspx)
* [Cannot connect to the replica host machine - connection could not be established.](http://social.technet.microsoft.com/wiki/contents/articles/31106.cannot-connect-to-the-replica-host-machine-connection-could-not-be-established.aspx)
## Next steps

Check other Azure Site Recovery common errors.
            





