---
title: Set up disaster recovery to Azure for on-premises VMware VMs with Azure Site Recovery | Microsoft Docs
description: Learn how to set up disaster recovery to Azure for on-premises VMware VMs with the Azure Site Recovery service.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: ca8e6cb6-fd80-4146-bfe7-eedab063b565
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/18/2017
ms.author: raynew

---
# Set up disaster recovery to Azure for on-premises VMware VMs

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your business continuity and disaster recovery (BCDR) strategy by keeping your business apps up and running available during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines (VMs), including replication, failover, and recovery.

This tutorial shows you how to set up disaster recovery to Azure for on-premises VMware VM running Windows. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Recovery Services vault for Site Recovery 
> * Set up the source and target replication environments 
> * Create a replication policy
> * Enable replication for a VM

Before you start, it's helpful to [review the architecture](concepts-vmware-to-azure-architecture.md) for disaster recovery scenario.


## Prerequisites

1. [Prepare](tutorial-prepare-azure.md) the Azure components, including an Azure subscription, storage account, and network.
2. [Prepare](tutorial-prepare-on-premises-vmware.md) on-premises VMware servers and VMs.


## Create a vault

[!INCLUDE [site-recovery-create-vault](../../includes/site-recovery-create-vault.md)]

## Select a protection goal

Select what you want to replicate, and where you want to replicate to.

1. Click **Recovery Services vaults** > vault.
2. In the Resource Menu, click **Site Recovery** > **Prepare Infrastructure** > **Protection goal**.
3. In **Protection goal**, select **To Azure** > **Yes, with VMware vSphere Hypervisor**.

## Set up the source environment

Set up the configuration server, register it in the vault, and discover VMs.

1. Click **Site Recovery** > **Step 1: Prepare Infrastructure** > **Source**.
2. Click **+Configuration server**.
3. In **Add Server**, check that **Configuration Server** appears in **Server type**.
4. Download the Site Recovery Unified Setup installation file.
5. Download the vault registration key. You need this when you run Unified Setup. The key is valid for five days after you generate it.

   ![Set up source](./media/tutorial-vmware-to-azure/source-settings.png)


### Register the configuration server in the vault

Do the following before you start:

- On the configuration server VM, make sure that the system clock is synchronized with a [Time Server](https://technet.microsoft.com/windows-server-docs/identity/ad-ds/get-started/windows-time-service/windows-time-service). It should match. If it's 15 minutes in front or behind, setup might fail.
- Make sure the configuration server VM can access these URLs:
        
        [!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]

- Any IP address-based firewall rules should allow communication to Azure.
- Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port.
- Allow IP address ranges for the Azure region of your subscription, and for West US (used for Access Control and Identity Management).

Then run setup as a Local Administrator on the configuration server VM.

[!INCLUDE [site-recovery-add-configuration-server](../../includes/site-recovery-add-configuration-server.md)]


### Connect to VMware servers

To discover VMs, you need to connect to on-premises VMware servers. 

- For the purposes of this tutorial, add the vCenter server, or vSphere hosts, using an account that has administrator privileges on the server.
- Added server might take 15 minutes or longer for them to appear in the portal.

### Add the account for automatic discovery

[!INCLUDE [site-recovery-add-vcenter-account](../../includes/site-recovery-add-vcenter-account.md)]

### Connect to servers

1. Select **+vCenter** to connect to a vCenter server or  vSphere ESXi host.
2. In **Add vCenter**, specify a friendly name for the server. Then, specify the IP address or FQDN.
3. Leave the port set to 443, unless your VMware servers listen for requests on a different port.
4. Select the account to use for connecting to the server. Click **OK**.

Site Recovery connects to VMware servers using the specified settings, and discovers VMs.


## Set up the target environment

Select and verify target resources. 

1. Click **Prepare infrastructure** > **Target**, and select the Azure subscription you want to use.
2. Specify whether your target deployment model is Resource Manager-based, or classic.
3. Site Recovery checks that you have one or more compatible Azure storage accounts and networks.

   ![Target](./media/tutorial-vmware-to-azure/storage-network.png)



## Create a replication policy

1. To create a replication policy, click **Site Recovery infrastructure** > **Replication Policies** > **+Replication Policy**.
2. In **Create replication policy**, specify a policy name.
3. In **RPO threshold**, specify the RPO limit. This value defines how often recovery points are created. An alert is generated if continuous replication exceeds this limit.
4. In **Recovery point retention**, specify (in hours) how long the retention window is for each recovery point. Replicated VMs can be recovered to any point in a window.
    - 24 hours retention is supported for machines replicated to premium storage
    - 72 hours is supported for standard storage.
5. In **App-consistent snapshot frequency**, specify how often (in minutes) recovery points containing application-consistent snapshots will be created. Click **OK** to create the policy.

    ![Replication policy](./media/tutorial-vmware-to-azure/replication-policy.png)

The policy is automatically associated with the configuration server. By default, a matching policy is automatically created for failback. For example, if the replication policy is **rep-policy** then the failback policy will be **rep-policy-failback**. This policy isn't used until you initiate a failback from Azure.


## Enable replication

- Site Recovery will install the Mobility service when replication is enabled.
- When you enable replication for a VM, it can take 15 minutes or longer for changes to take effect, and appear in the portal.

Enable replication as follows:

1. Click **Replicate application** > **Source**.
2. In **Source**, select the configuration server.
3. In **Machine type**, select **Virtual Machines**.
4. In **vCenter/vSphere Hypervisor**, select the vCenter server that manages the vSphere host, or select the host.
5. Select the process server (configuration server). IThen click **OK**.
6. In **Target**, select the subscription and the resource group in which you want to create the failed over VMs. Choose the deployment model that you want to use in Azure (classic or resource management), for the failed over VMs.
7. Select the Azure storage account you want to use for replicating data. 
8. Select the Azure network and subnet to which Azure VMs will connect, when they're created after failover.
9. Select **Configure now for selected machines**, to apply the network setting to all machines you select for protection. Select **Configure later** to select the Azure network per machine. 
10. In **Virtual Machines** > **Select virtual machines**, click and select each machine you want to replicate. You can only select machines for which replication can be enabled. Then click **OK**.
11. In **Properties** > **Configure properties**, select the account that will be used by the process server to automatically install the Mobility service on the machine.
12. In **Replication settings** > **Configure replication settings**, verify that the correct replication policy is selected. 
13. Click **Enable Replication**.


You can track progress of the **Enable Protection** job in **Settings** > **Jobs** > **Site Recovery Jobs**. After the **Finalize Protection** job runs the machine is ready for failover.

To monitor VMs you add, you can check the last discovered time for VMs in **Configuration Servers** > **Last Contact At**. To add VMs without waiting for the scheduled discovery, highlight the configuration server (don’t click it), and click **Refresh**.

## Next steps
[Run a disaster recovery drill](site-recovery-test-failover-to-azure.md)



