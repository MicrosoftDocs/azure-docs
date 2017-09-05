---
title: Set up VMM and Hyper-V for replication to a secondary site with Azure Site Recovery| Microsoft Docs
description: Describes how to set up System Center VMM servers and Hyper-V hosts for replication to a secondary VMM site.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: d0389e3b-3737-496c-bda6-77152264dd98
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/30/2017
ms.author: raynew

---
# Step 4: Set up VMM and Hyper-V for Hyper-V VM replication to a secondary site 

After you've prepared for networking, set up System Center Virtual Machine Manager (VMM) servers and Hyper-V hosts for Hyper-V virtual machine (VM) replication to a secondary site, using [Azure Site Recovery](site-recovery-overview.md) in the Azure portal. 

After reading this article, post any comments at the bottom, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).



## Prepare VMM servers 

To prepare for deployment:


1. Make sure VMM servers comply with the [support requirements](site-recovery-support-matrix-to-sec-site.md#on-premises-servers), and [deployment prerequisites](vmm-to-vmm-walkthrough-prerequisites.md).
2. Make sure VMM servers are connected to the internet and have access to these URLs.
    
    [!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]
    
    - If you have IP address-based firewall rules, ensure they allow communication to Azure.
    - Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port.
    - Allow IP address ranges for the Azure region of your subscription, and for West US (used for Access Control and Identity Management).
3. Make sure the VMM server is [prepared for network mapping](vmm-to-vmm-walkthrough-network.md#prepare-for-network-mapping)


## Prepare Hyper-V hosts/clusters

1. Make sure Hyper-V hosts/clusters comply with the [support requirements](site-recovery-support-matrix-to-sec-site.md#on-premises-servers), and [deployment prerequisites](vmm-to-vmm-walkthrough-prerequisites.md).
2. Verify the requirements for [Hyper-V VMs](site-recovery-support-matrix-to-sec-site.md#support-for-replicated-machine-os-versions)
3. Verify [network](site-recovery-support-matrix-to-sec-site.md#network-configuration) and [storage](site-recovery-support-matrix-to-sec-site.md#storage) requirements.
4. Make sure Hyper-V hosts are connected to the internet and have access to these URLs.
    
    [!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]
    
    - If you have IP address-based firewall rules, ensure they allow communication to Azure.
    - Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port.
    - Allow IP address ranges for the Azure region of your subscription, and for West US (used for Access Control and Identity Management).

## Prepare for single server deployment


If you only have a single VMM server, you can replicate VMs in Hyper-V hosts in the VMM cloud to [Azure](hyper-v-site-walkthrough-overview.md) or to a secondary VMM cloud, as described in this document. We recommend the first option because replicating between clouds isn't seamless.

If you do want to replicate between clouds, you can replicate with a single standalone VMM server, or with a single VMM server deployed in a stretched Windows cluster

### Replicate with a standalone VMM server

In this scenario, you deploy the single VMM server as a virtual machine in the primary site, and replicate this VM to a secondary site using Site Recovery and Hyper-V Replica.

1. **Set up VMM on a Hyper-V VM**. We suggest that you colocate the SQL Server instance used by VMM on the same VM. This saves time as only one VM has to be created. If you want to use remote instance of SQL Server and an outage occurs, you need to recover that instance before you can recover VMM.
2. **Ensure the VMM server has at least two clouds configured**. One cloud will contain the VMs you want to replicate and the other cloud will serve as the secondary location. The cloud that contains the VMs you want to protect should comply with [prerequisites](#prerequisites).
3. Set up Site Recovery as described in this article. Create and register the VMM server in a vault, set up a replication policy, and enable replication. The source and target VMM names will be the same. Specify that initial replication takes place over the network.
4. When you set up network mapping you map the VM network for the primary cloud to the VM network for the secondary cloud.
5. In the Hyper-V Manager console, enable Hyper-V Replica on the Hyper-V host that contains the VMM VM, and enable replication on the VM. Make sure you don't add the VMM virtual machine to clouds that are protected by Site Recovery, to ensure that Hyper-V Replica settings aren't overridden by Site Recovery.
6. If you create recovery plans for failover you use the same VMM server for source and target.
7. In a complete outage, you fail over and recover as follows:

   1. Run an unplanned failover in the Hyper-V Manager console in the secondary site, to fail over the primary VMM VM to the secondary site.
   2. Verify that the VMM VM is up and running, and in the vault, run an unplanned failover to fail over the VMs from primary to secondary clouds. Commit the failover, and select an alternate recovery point if required.
   3. After the unplanned failover is complete, all resources can be accessed from the primary site again.
   4. When the primary site is available again, in the Hyper-V Manager console in the secondary site, enable reverse replication for the VMM VM. This starts replication for the VM from secondary to primary.
   5. Run a planned failover in the Hyper-V Manager console in the secondary site, to fail over the VMM VM to the primary site. Commit the failover. Then enable reverse replication, so that the VMM VM is again replicating from primary to secondary.
   6. In the Recovery Services vault, enable reverse replication for the workload VMs, to start replicating them from secondary to primary.
   7. In the Recovery Services vault, run a planned failover to fail back the workload VMs to the primary site. Commit the failover to complete it. Then enable reverse replication to start replicating the workload VMs from primary to secondary.

### Replicate with a stretched VMM cluster

Instead of deploying a standalone VMM server as a VM that replicates to a secondary site, you can make VMM highly available by deploying it as a VM in a Windows failover cluster. This provides workload resilience and protection against hardware failure. To deploy with Site Recovery the VMM VM should be deployed in a stretch cluster across geographically separate sites. To do this:

1. Install VMM on a virtual machine in a Windows failover cluster, and select the option to run the server as highly available during setup.
2. The SQL Server instance that's used by VMM should be replicated with SQL Server AlwaysOn availability groups, so that there's a replica of the database in the secondary site.
3. Follow the instructions in this article to create a vault, register the server, and set up protection. You need to register each VMM server in the cluster in the Recovery Services vault. To do this, you install the Provider on an active node, and register the VMM server. Then you install the Provider on other nodes.
4. When an outage occurs, the VMM server and its corresponding SQL Server database are failed over, and accessed from the secondary site.



## Next steps

Go to [Step 5: Set up a vault](vmm-to-vmm-walkthrough-create-vault.md).