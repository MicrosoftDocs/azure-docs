---
title: Set up disaster recovery of on-premises Hyper-V VMs in VMM clouds to Azure with Azure Site Recovery  | Microsoft Docs
description: Learn how to set up disaster recovery of on-premises Hyper-V VMs in System Center VMM clouds to Azure, with the Azure Site Recovery service.
services: site-recovery
author: rayne-wiselman
ms.service: site-recovery
ms.topic: article
ms.date: 07/06/2018
ms.author: raynew
ms.custom: MVC
---

# Set up disaster recovery of on-premises Hyper-V VMs in VMM clouds to Azure

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your disaster recovery strategy by managing and orchestrating replication, failover, and failback of on-premises machines, and Azure virtual machines (VMs).

This tutorial shows you how to set up disaster recovery of on-premises Hyper-V VMs to Azure. The tutorial is relevant for Hyper-V VMs that are managed by System Center Virtual Machine Manager (VMM). In this tutorial, you learn how to:

> [!div class="checklist"]
> * Select your replication source and target.
> * Set up the source replication environment, including on-premises Site Recovery components, and the target replication environment.
> * Set up network mapping, to map between VMM VM networks, and Azure virtual networks.
> * Create a replication policy
> * Enable replication for a VM

This is the third tutorial in a series. This tutorial assumes that you have already completed the tasks in the previous tutorials:

1. [Prepare Azure](tutorial-prepare-azure.md)
2. [Prepare on-premises Hyper-V](tutorial-prepare-on-premises-hyper-v.md)

Before you start, it's helpful to [review the architecture](concepts-hyper-v-to-azure-architecture.md) for this disaster recovery scenario.



## Select a replication goal

1. In **All Services** > **Recovery Services vaults**, click the vault name we use in these tutorials, **ContosoVMVault**.
2. In **Getting Started**, click **Site Recovery**. Then click **Prepare Infrastructure**
3. In **Protection goal** > **Where are your machines located**, select **On-premises**.
4. In **Where do you want to replicate your machines**, select **To Azure**.
5. In **Are your machines virtualized**, select **Yes, with Hyper-V**.
6. In **Are you using System Center VMM**, select **Yes**. Then click **OK**.

    ![Replication goal](./media/hyper-v-vmm-azure-tutorial/replication-goal.png)



## Set up the source environment

When you set up the source environment, you install the Azure Site Recovery Provider and the Azure Recovery Services agent, and register on-premises servers in the vault. 

1. In **Prepare Infrastructure**, click **Source**.
2. In **Prepare source**, click **+ VMM** to add a VMM server. In **Add Server**, check that **System Center VMM server** appears in **Server type**.
3. Download the installer for the Microsoft Azure Site Recovery Provider.
4. Download the vault registration key. You need this when you run Provider setup. The key is valid for five days after you generate it.
5. Download the Recovery Services agent.

    ![Download](./media/hyper-v-vmm-azure-tutorial/download-vmm.png)

### Install the Provider on the VMM server

1. In the Azure Site Recovery Provider Setup wizard > **Microsoft Update**, opt in to use Microsoft Update to check for Provider updates.
2. In **Installation**, accept the default installation location for the Provider, and click **Install**. 
3. After installation, in the Microsoft Azure Site Recovery Registration Wizard > **Vault Settings**, click **Browse**, and in **Key file**, select the vault key file that you downloaded.
4. Specify the Azure Site Recovery subscription, and the vault name (**ContosoVMVault**). Specify a friendly name for the VMM server, to identify it in the vault.
5. In **Proxy Settings**, select **Connect directly to Azure Site Recovery without a proxy**.
6. Accept the default location for the certificate that's used to encrypt data. Encrypted data will be decrypted when you fail over.
7. In **Synchronize cloud metadata**, select **Sync cloud meta data to Site Recovery portal**. This action only needs to happen once on each server. Then click **Register**.
8. After the server is registered in the vault, click **Finish**.

After registration finishes, metadata from the server is retrieved by Azure Site Recovery, and the VMM server is displayed in **Site Recovery Infrastructure**.

### Install the Recovery Services agent

Install the agent on each Hyper-V host containing VMs you want to replicate.

1. In the Microsoft Azure Recovery Services Agent Setup Wizard > **Prerequisites Check**, click **Next**. Any missing prerequisites will automatically be installed.
2. In **Installation Settings**, accept the installation location, and the cache location. The cache drive needs at least 5 GB of storage. We recommend a drive with 600 GB or more of free space. Then click **Install**.
3. In **Installation**, when installation finishes, click **Close** to finish the wizard.

    ![Install agent](./media/hyper-v-vmm-azure-tutorial/mars-install.png)
    

## Set up the target environment

1. Click **Prepare infrastructure** > **Target**.
2. Select the subscription and the resource group (**ContosoRG**) in which the Azure VMs will be created after failover.
3. Select the **Resource Manager"** deployment model.

Site Recovery checks that you have one or more compatible Azure storage accounts and networks.


## Configure network mapping

1. In **Site Recovery Infrastructure** > **Network mappings** > **Network Mapping**, click the **+Network Mapping** icon.
2. In **Add network mapping**, select the source VMM server. Select **Azure** as the target.
3. Verify the subscription and the deployment model after failover.
4. In **Source network**, select the source on-premises VM network.
5. In **Target network**, select the Azure network in which replica Azure VMs will be located when they're created after failover. Then click **OK**.

    ![Network mapping](./media/hyper-v-vmm-azure-tutorial/network-mapping-vmm.png)

## Set up a replication policy

1. Click **Prepare infrastructure** > **Replication Settings** > **+Create and associate**.
2. In **Create and associate policy**, specify a policy name, **ContosoReplicationPolicy**.
3. Leave the default settings and click **OK**.
    - **Copy frequency** indicates that delta data (after initial replication) will replicate every five minutes.
    - **Recovery point retention** indicates that the retention windows for each recovery point will be two hours.
    - **App-consistent snapshot frequency** indicates that recovery points containing app-consistent snapshots will be created every hour.
    - **Initial replication start time**, indicates that initial replication will start immediately.
    - **Encrypt data stored on Azure** - the default **Off** setting indicates that at rest data in Azure isn't encrypted.
4. After the policy is created, click **OK**. When you create a new policy it's automatically associated with the VMM cloud.

## Enable replication

1. In **Replicate application**, click **Source**. 
2. In **Source**, select the VMM cloud. Then click **OK**.
3. In **Target**, verify Azure as the target, the vault subscription, and select the **Resource Manager** model.
4. Select the **contosovmsacct1910171607** storage account, and the **ContosoASRnet** Azure network.
5. In **Virtual machines** > **Select**, select the VM you want to replicate. Then click **OK**.

 You can track progress of the **Enable Protection** action in **Jobs** > **Site Recovery jobs**. After the **Finalize Protection** job completes, the initial replication is complete, and the VM is ready for failover.


## Next steps
[Run a disaster recovery drill](tutorial-dr-drill-azure.md)
