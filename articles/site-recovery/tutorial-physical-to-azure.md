---
title: Set up disaster recovery to Azure for physical on-premises servers with Azure Site Recovery | Microsoft Docs
description: Learn how to set up disaster recovery to Azure for on-premises Windows and Linux servers, with the Azure Site Recovery service.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 805f6946-c6da-491f-980e-bf724bebdf0b
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/13/2017
ms.author: raynew

---
# Set up disaster recovery to Azure for on-premises physical servers

The [Azure Site Recovery](site-recovery-overview.md) service manages and orchestrates replication, failover, and failback of on-premises machines, and Azure virtual machines (VMs).

This tutorial shows you how to set up disaster recovery of on-premises physical Windows and Linux servers to Azure. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up Azure and on-premises prerequisites
> * Create a Recovery Services vault for Site Recovery 
> * Set up the source and target replication environments
> * Create a replication policy
> * Enable replication for a server

## Prerequisites

To complete this tutorial:

- [Review](concepts-physical-to-azure-architecture.md) the scenario architecture and components.
- [Review](site-recovery-support-matrix-to-azure.md) the support requirements for all components.
- Make sure that machines that you want to replicate comply with [operating system requirements](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions), [file storage requirements](site-recovery-support-matrix-to-azure.md#supported-file-systems-and-guest-storage-configurations-on-linux-vmwarephysical-servers), and [prerequisites for Azure VMs](site-recovery-support-matrix-to-azure.md#failed-over-azure-vm-requirements).
- Prepare Azure, including an Azure subscription, an Azure virtual network, and a storage account.
- Prepare for installation of the Mobility service on each server you want to replicate.


### Set up an Azure account

Get a Microsoft [Azure account](http://azure.microsoft.com/).

- You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/).
- Find out about supported regions under Geographic Availability, in [Azure Site Recovery Pricing Details]((https://azure.microsoft.com/pricing/details/site-recovery/).
- Learn about [Site Recovery pricing](site-recovery-faq.md#pricing), and get [pricing details](https://azure.microsoft.com/pricing/details/site-recovery/).

### Verify Azure account permissions

Make sure your Azure account has permissions for replication of VMs to Azure.

- Review the [permissions](site-recovery-role-based-linked-access-control.md) you need.
- Verify/add permissions for [role-based access](../active-directory/role-based-access-control-configure.md).



### Set up an Azure network

Set up an [Azure network](../virtual-network/virtual-network-get-started-vnet-subnet.md).

- Azure VMs are placed in this network when they're created after failover.
- The network should be in the same region as the Recovery Services vault


## Set up an Azure storage account

Set up an [Azure storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account).

- Site Recovery replicates on-premises machines to Azure storage. Azure VMs are created from the storage after failover occurs.
- The storage account must be in the same region as the Recovery Services vault.
- The storage account can be standard or [premium](../storage/common/storage-premium-storage.md).
- If you set up a premium account, you will also need an additional standard account for log data.
- You can't replicate to premium accounts in Central and South India.


### Prepare an account for Mobility service installation

The Mobility service must be installed on each server you want to replicate. Site Recovery installs this service automatically when you enable replication for the server. To install automatically, you need to prepare an account that Site Recovery will use to access the server.

- You can use a domain or local account
- For Windows VMs, if you're not using a domain account, disable Remote User Access control on the local machine. To do this, in the register under **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System**, add the DWORD entry **LocalAccountTokenFilterPolicy**, with a value of 1.
- To add the registry entry to disable the setting from a CLI, type:
        ``REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1.``
- For Linux, the account should be root on the source Linux server.


## Create a vault

[!INCLUDE [site-recovery-create-vault](../../includes/site-recovery-create-vault.md)]

## Select a protection goal

Select what to replicate, and to replicate it to.

1. Click **Recovery Services vaults** > vault.
2. In the Resource Menu, click **Site Recovery** > **Prepare Infrastructure** > **Protection goal**.
3. In **Protection goal**, select **To Azure** > **Not virtualized/Other**.

## Set up the source environment

Set up the configuration server, register it in the vault, and discover VMs.

1. Click **Site Recovery** > **Prepare Infrastructure** > **Source**.
2. If you don’t have a configuration server, click **+Configuration server**.
3. In **Add Server**, check that **Configuration Server** appears in **Server type**.
4. Download the Site Recovery Unified Setup installation file.
5. Download the vault registration key. You need this when you run Unified Setup. The key is valid for five days after you generate it.

   ![Set up source](./media/tutorial-physical-to-azure/source-environment.png)


### Register the configuration server in the vault

Do the following before you start: 

- On the configuration server machine, make sure that the system clock is synchronized with a [Time Server](https://technet.microsoft.com/windows-server-docs/identity/ad-ds/get-started/windows-time-service/windows-time-service). It should match. If it's 15 minutes in front or behind, setup might fail.
- Make sure TLS 1.0 is enabled on the machine.
- Make sure the machine can access these URLs:
        [!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]

- Any IP address-based firewall rules should allow communication to Azure.
- Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port.
- Allow IP address ranges for the Azure region of your subscription, and for West US (used for Access Control and Identity Management).

Run Unified Setup as a Local Administrator, to install the configuration server, the process server, and the master target server.

[!INCLUDE [site-recovery-add-configuration-server](../../includes/site-recovery-add-configuration-server.md)]

After registration finishes, the configuration server is displayed on the **Settings** > **Servers** page in the vault.


## Set up the target environment

Select and verify target resources.

1. Click **Prepare infrastructure** > **Target**, and select the Azure subscription you want to use.
2. Specify the target deployment model.
3. Site Recovery checks that you have one or more compatible Azure storage accounts and networks.

   ![Target](./media/tutorial-physical-to-azure/network-storage.png)


## Create a replication policy

1. To create a new replication policy, click **Site Recovery infrastructure** > **Replication Policies** > **+Replication Policy**.
2. In **Create replication policy**, specify a policy name.
3. In **RPO threshold**, specify the RPO limit. This value specifies how often data recovery points are created. An alert is generated if continuous replication exceeds this limit.
4. In **Recovery point retention**, specify (in hours) how long the retention window is for each recovery point. Replicated VMs can be recovered to any point in a window. Up to 24 hours retention is supported for machines replicated to premium storage, and 72 hours for standard storage.
5. In **App-consistent snapshot frequency**, specify how often (in minutes) recovery points containing application-consistent snapshots will be created. Click **OK** to create the policy.

    ![Replication policy](./media/tutorial-physical-to-azure/replication-policy.png)
8. The new policy is automatically associated with the configuration server. By default, a matching policy is automatically created for failback. For example, if the replication policy is **rep-policy** then the failback policy will be **rep-policy-failback**. This policy isn't used until you initiate a failback from Azure.


## Enable replication

Enable replication for each server.

- Site Recovery will install the Mobility service when replication is enabled.
- When you enable replication for a server, it can take 15 minutes or longer for changes to take effect, and appear in the portal.

1. Click **Step 2: Replicate application** > **Source**.
2. In **Source**, select the configuration server.
3. In **Machine type**, select **Physical machines**.
4. Select the process server (the configuration server). Then click **OK**.
5. In **Target**, select the subscription and the resource group in which you want to create the Azure VMs after failover. Choose the deployment model that you want to use in Azure (classic or resource management).
6. Select the Azure storage account you want to use for replicating data. 
7. Select the Azure network and subnet to which Azure VMs will connect, when they're created after failover.
8. Select **Configure now for selected machines**, to apply the network setting to all machines you select for protection. Select **Configure later** to select the Azure network per machine. 
9. In **Physical Machines**, and click **+Physical machine**. Specify the name and IP address. Select the operating system of the machine you want to replicate. It takes a few minutes for the servers to be discovered and listed. 
10. In **Properties** > **Configure properties**, select the account that will be used by the process server to automatically install the Mobility service on the machine.
11. In **Replication settings** > **Configure replication settings**, verify that the correct replication policy is selected. 
12. Click **Enable Replication**. You can track progress of the **Enable Protection** job in **Settings** > **Jobs** > **Site Recovery Jobs**. After the **Finalize Protection** job runs the machine is ready for failover.


To monitor servers you add, you can check the last discovered time for them in **Configuration Servers** > **Last Contact At**. To add machines without waiting for a scheduled discovery time, highlight the configuration server (don’t click it), and click **Refresh**.

## Next steps

[Run a disaster recovery drill](site-recovery-test-failover-to-azure.md)
