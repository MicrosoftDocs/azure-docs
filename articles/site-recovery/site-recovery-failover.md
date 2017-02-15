---
title: Failover in Site Recovery | Microsoft Docs
description: Azure Site Recovery coordinates the replication, failover and recovery of virtual machines and physical servers. Learn about failover to Azure or a secondary datacenter.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.assetid: 44813a48-c680-4581-a92e-cecc57cc3b1e
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 2/15/2017
ms.author: raynew

---
# Failover in Site Recovery
This article describes how to failover virtual machines and physical servers protected by Site Recovery. 

## Prerequisites
Before you do a failover, you should do a [test failover](site-recovery-test-failover-to-azure.md) to ensure that everything is working as expected. 


## Failover considerations
* **IP address after failover**— By default a failed over machine will have a different IP address than the source machine. If you want to retain the same IP address see:
  * **Secondary site**—If you're failing over to a secondary site and you want to retain an IP address [read](http://blogs.technet.com/b/scvmm/archive/2014/04/04/retaining-ip-address-after-failover-using-hyper-v-recovery-manager.aspx) this article. Note that you can retain a public IP address if your ISP supports it.
  * **Azure**—If you're failing over to Azure you can specify the IP address you want to assign in the **Configure** tab of the virtual machine properties. You can't retain a public IP address after failover to Azure. You can retain non-RFC 1918 address spaces that are used as internal addresses.
* **Partial failover**—If you want to fail over part of a site rather than an entire site note that:

  * **Secondary site**—If you fail over part of a primary site to a secondary site and you want to connect back to the primary site, use a site-to-site VPN connection to connect failed over applications on the secondary site to infrastructure components running on the primary site. If an entire subnet fails over you can retain the virtual machine IP address. If you fail over a partial subnet you can't retain the virtual machine IP address because subnets can't be split between sites.
  * **Azure**—If you fail over a partial site to Azure and want to connect back to the primary site, you can use a site-to-site VPN to connect a failed over application in Azure to infrastructure components running on the primary site. Note that if the entire subnet fails over you can retain the virtual machine IP address. If you fail over a partial subnet you can't retain the virtual machine IP address because subnets can't be split between sites.
* **Drive letter**—If you want to retain the drive letter on virtual machines after failover you can set the SAN policy for the virtual machine to **On**. Virtual machine disks come online automatically. [Read more](https://technet.microsoft.com/library/gg252636.aspx).
* **Route client requests**—Site Recovery works with Azure Traffic Manager to route client requests to your application after failover.


## Run a failover
This procedure describes how to run a failover for a [recovery plan](site-recovery-create-recovery-plans.md). Alternatively you can run the failover for a single virtual machine or physical server from the **Replicated Items** page


![Failover](./media/site-recovery-failover/Failover.png)

1. Select **Recovery Plans** > *recoveryplan_name*. Click **Failover** 
2. On the **Failover** screen, select a **Recovery Point** to failover to. You can use one of the following options:
	1.    **Latest** (default): This option first processes all the data that has been sent to site recovery service to create a recovery point for each virtual machine before failing them over to it. This option provides the lowest RPO (Recovery Point Objective) as the virtual machine created after failover will have all the data that has been replicated to site recovery service when the failover was triggered. 
	1.  **Latest processed**: This options fails over all virtual machines of the recovery plan to the latest recovery point that has already been processed by site recovery service. When you are doing test failover of a virtual machine, time stamp of the latest processed recovery point is also shown. If you are doing failover of a recovery plan, you can go to individual virtual machine and look at **Latest Recovery Points** tile to get the this information. As no time is spent to process the unprocessed data, this option provides a low RTO (Recovery Time Objective) failover option. 
	1.    **Latest app-consistent**: This options fails over all virtual machines of the recovery plan to the latest application consistent recovery point that has already been processed by site recovery service. When you are doing test failover of a virtual machine, time stamp of the latest app-consistent recovery point is also shown. If you are doing failover of a recovery plan, you can go to individual virtual machine and look at **Latest Recovery Points** tile to get the this information. 
	1.	**Custom**: If you are doing test failover of a virtual machine then you can use this option to failover to a particular recovery point.

> [!NOTE]
> The option to choose a recovery point is only available when you are failing over to Azure. 
>
> 


1. If some of the virtual machines in the recovery plan were failed over in a previous run and now the virtual machines are active on both source and target location, you can use **Change direction** option to decide the direction in which the failover should happen.
1. If you're failing over to Azure and data encryption is enabled for the cloud (applies only when you have protected Hyper-v virtual machines from a VMM Server), in **Encryption Key** select the certificate that was issued when you enabled data encryption during setup on the VMM server.
1. Select **Shut down machine before beginning failover** if you want Site Recovery to attempt do a shutdown of source virtual machines before triggering the failover. Failover will continue even if shutdown fails.  
	 	 
> [!NOTE]
> In case of Hyper-v virtual machines, this option also tries to synchronize the on-premises data that has not yet been sent to the service before triggering the failover. 
>
> 
	 
1. You can follow the failover progress on the **Jobs** page. Note that even if errors occur during an unplanned failover, the recovery plan runs until it is complete.
1. After the failover, validate the virtual machine by logging into it. If you want to go another recovery point for the virtual machine then you can use **Change recovery point** option.
1. Once you are satisfied with the failed over virtual machine, you can **Commit** the failover. This will delete all the recovery points available with the service and **Change recovery point** option will no longer be available.

## Planned Failover
Apart from, Failover, Hyper-V virtual machines protected using Site Recovery also support **Planned failover**. This is a zero data loss failover option. When a planned failover is triggered, first the source virtual machines are shutdown, the the data yet to be synchronized is synchronized and then a failover is triggered. 


## Using scripts in Failover
You might want to automate certain actions while doing a failover. You can use scripts or [Azure automation runbooks](site-recovery-runbook-automation.md) in [recovery plans](site-recovery-create-recovery-plans.md) to do that.

## Next Steps
Once you have failed over virtual machines and the on-premises data center is available, you should [re-protect](site-recovery-how-to-reprotect.md) VMware virutal machines back to the on-premises data center.

Use **Planned Failover** option to **Failback** Hyper-v virtual machines back to on-premises from Azure.

If you have failed over a Hyper-v virtual machine to another on-premises data center managed by a VMM server and the primary data center is available then use **Reverse Replicate** option to start the replication back to the primary data center. 

