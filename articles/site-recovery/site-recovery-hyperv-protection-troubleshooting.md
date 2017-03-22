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


## Troubleshoot on-premises Hyper-V replication  issues

This article catalogs the most common errors and mitigation during the Hyper-v replication failures.
Connect to the on-premises Hyper-V manager console, select the virtual
machine, and see the replication health.

![Option to view replication health in the Hyper-V manager console](media/site-recovery-monitoring-and-troubleshooting/image12.png)

In this case, **Replication Health** is **Critical**. Right-click the virtual machine, and then click **Replication** > **View Replication Health** to see the details.

![Replication health for a specific virtual machine](media/site-recovery-monitoring-and-troubleshooting/image13.png)

If replication is paused for the virtual machine, right-click the virtual machine, and then click **Replication** > **Resume replication**.

![Option to resume replication in the Hyper-V manager console](media/site-recovery-monitoring-and-troubleshooting/image19.png)

If a virtual machine migrates a new Hyper-V host that's within the cluster or a standalone machine and the Hyper-V host has been configured through Azure Site Recovery, replication for the virtual machine wouldn't be impacted. Ensure that the new Hyper-V host meets all the prerequisites and is configured by using Azure Site Recovery.

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

## Virtual Machine Replication state on the Azure portal and Hyper-V console is out of sync


This happen when virtual machine initial replication job failed and you resume the replication through Hyper-V manager. ASR portal is not able to get the exact state of the machine and the protection state keep on showing critical even if the health of replication in hyper-v shows green.

On the portal you will see below error 
![IR error on the portal](media/site-recovery-protection-common-errors/hyper-v-IR-failure.png)

To make the replication health status of the machine in sync with hyper-v use below steps 

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
8. This will restart the failed initial replication job on the portal and completes it successfully. No data transfer will be done again. 
![initial replication job](media/site-recovery-protection-common-errors/Job-status.png)
9. On the portal you should see the status of machine to become green and states protected 
![initial replication job](media/site-recovery-protection-common-errors/IR-job-success.png)

## Next steps

Check Azure Site Recovery common errors
            





