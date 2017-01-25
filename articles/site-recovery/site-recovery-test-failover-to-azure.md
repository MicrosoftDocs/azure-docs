---
title: Test Failover to Azure in Site Recovery | Microsoft Docs
description: Azure Site Recovery coordinates the replication, failover and recovery of virtual machines and physical servers. Learn about failover to Azure or a secondary datacenter.
services: site-recovery
documentationcenter: ''
author: prateek9us
manager: gauravd
editor: ''

ms.assetid: 44813a48-c680-4581-a92e-cecc57cc3b1e
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 1/09/2017
ms.author: pratshar

---
# Test 	Failover to Azure in Site Recovery

This article provides information and instructions for doing a test failover or a DR drill of virtual machines and physical servers that are protected with Site Recovery using Azure as the recovery site. 

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

Test failover is run to validate your replication strategy or perform a disaster recovery drill without any data loss or downtime. Doing a test failover doesn't have any impact on the ongoing replication or on your production environment. Test failover can be done either on a virtual machine or a [recovery plan](site-recovery-create-recovery-plans.md). When triggering a test failover you need to specify the network to which test virtual machines would connect to. Once a test failover is triggered you can track progress in the **Jobs** page.  


## Supported scenarios
Test failover is supported in all deployment scenarios other than [legacy VMware site to Azure](site-recovery-vmware-to-azure-classic-legacy.md). Test failover is also not supported when virtual machine has been failed over to Azure.  


## Run a test failover
This procedure describes how to run a test failover for a recovery plan. Alternatively you can also run test failover for a single machine by using the appropriate option on it. 

1. Select **Recovery Plans** > *recoveryplan_name*. Click **Test Failover**.
1. Select a **Recovery Point** to failover to. You can use one of the following options:
	1.  **Latest processed**: This options fails over all virtual machines of the recovery plan to the latest recovery point that has already been processed by site recovery service. When you are doing test failover of a virtual machine, time stamp of the latest processed recovery point is also shown. If you are doing failover of a recovery plan, you can go to individual virtual machine and look at **Latest Recovery Points** tile to get the this information. As no time is spent to process the unprocessed data, this option provides a low RTO (Recovery Time Objective) failover option. 
	1.    **Latest app-consistent**: This options fails over all virtual machines of the recovery plan to the latest application consistent recovery point that has already been processed by site recovery service. When you are doing test failover of a virtual machine, time stamp of the latest app-consistent recovery point is also shown. If you are doing failover of a recovery plan, you can go to individual virtual machine and look at **Latest Recovery Points** tile to get the this information. 
	1.    **Latest**: This option first processes all the data that has been sent to site recovery service to create a recovery point for each virtual machine before failing them over to it. This option provides the lowest RPO (Recovery Point Objective) as the virtual machine created after failover will have all the data that has been replicated to site recovery service when the failover was triggered. 
	1.	**Custom**: If you are doing test failover of a virtual machine then you can use this option to failover to a particular recovery point.
1. Select an **Azure virtual network**: Provide an Azure virtual network where the test virtual machines would be created. Site recovery attempts to create test virtual machines in a subnet of same name and using the same IP as that provided in **Compute and Network** settings of the virtual machine. If subnet of same name is not available in the Azure virtual network provided for test failover then test virtual machine is created in the first subnet alphabetically. If same IP is not available in the subnet then virtual machine will receive another IP address available in the subnet. Read this section for [more details](#creating-a-network-for-test-failover)
1. If you're failing over to Azure and data encryption is enabled, in **Encryption Key** select the certificate that was issued when you enabled data encryption during Provider installation. You can ignore this step if you have not enabled encryption on the virtual machine.
1. Track failover progress on the **Jobs** tab. You should be able to see the test replica machine in the Azure portal.
1. To initiate an RDP connection on the virtual machine you will need to [add a public ip](site-recovery-monitoring-and-troubleshooting.md#adding-a-public-ip-on-a-resource-manager-virtual-machine) on the network interface of the failed over virtual machine. If you are failing over to a Classic virtual machine then you will need to [add an endpoint](../virtual-machines/virtual-machines-windows-classic-setup-endpoints.md) on port 3389
1. Once you're done, click on **Cleanup test failover** on the recovery plan. In **Notes** record and save any observations associated with the test failover. This will delete the virtual machines that were created during test failover. 


> [!TIP]
> Site recovery attempts to create test virtual machines in a subnet of same name and using the same IP as that provided in **Compute and Network** settings of the virtual machine. If subnet of same name is not available in the Azure virtual network provided for test failover then test virtual machine is created in the first subnet alphabetically. If same IP is not available in the subnet then virtual machine will receive another IP address available in the subnet. 
>
> 


## Creating a network for test failover 
It is recommended that when you are doing a test failover you choose a network that is isolated from your production recovery site network that you provided in **Compute and Network** settings for the virtual machine. By default when you create an Azure virtual network, it is isolated from other networks. This network should mimic your production network:

1. Test network should have same number of subnets as that in your production network and with the same name as those of the subents in your production network.
1. Test network should use the same IP range as that of your production network.
1. Update the DNS of the Test Network as the IP that you gave as target IP for the DNS virtual machine under **Compute and Network** settings. Go through [test failover considerations for active directory](site-recovery-active-directory.md#test-failover-considerations) section for more details. 


## Test failover to a production network on recovery site 
It is recommended that when you are doing a test failover you choose a network that is different from your production recovery site network that you provided in **Compute and Network** settings for the virtual machine. But if you really want to validate end to end network connectivity in a failed over virtual machine, please note the following points:

1. Make sure that the primary virtual machine is shutdown when you are doing the test failover. If you don't do so there will be two virtual machines with the same identity running in the same network at the same time and that can lead to undesired consequences. 
1. Any changes that you make into the test failover virtual machines would be lost when you cleanup the test failover virtual machines. These changes will not be replicated back to the primary virtual machine.
1. This way of doing testing leads to a downtime of your production application. Users of the application should be asked to not to use the application when the DR drill is in progress.  



## Prepare Active Directory and DNS
To run a test failover for application testing, you’ll need a copy of the production Active Directory environment in your test environment. Go through [test failover considerations for active directory](site-recovery-active-directory.md#test-failover-considerations) section for more details. 

## Next Steps
Once you have successfully tried a test failover you can try doing a [failover](site-recovery-failover.md).

