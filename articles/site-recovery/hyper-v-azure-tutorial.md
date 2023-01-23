---
title: Set up Hyper-V disaster recovery using Azure Site Recovery  
description: Learn how to set up disaster recovery of on-premises Hyper-V VMs (without VMM) to Azure by using Site Recovery.
ms.service: site-recovery
ms.topic: tutorial
ms.date: 01/16/2023
ms.custom: MVC
ms.author: ankitadutta
author: ankitaduttaMSFT
---
# Set up disaster recovery of on-premises Hyper-V VMs to Azure

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your disaster-recovery strategy by managing and orchestrating replication, failover, and failback of on-premises machines and Azure virtual machines (VMs).

This is the third tutorial in a series. It shows you how to set up disaster recovery of on-premises Hyper-V VMs to Azure. This tutorial applies Hyper-V VMs that are not managed by Microsoft System Center Virtual Machine Manager (VMM).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up the source replication environment, including on-premises Site Recovery components and the target replication environment.
> * Create a replication policy.
> * Enable replication for a VM.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario. They use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the articles in the **How-to Guides** section of the [Site Recovery documentation](./index.yml).


## Prerequisites

This is the third tutorial in a series. It assumes that you have already completed the tasks in the previous tutorials:

1. [Prepare Azure](./tutorial-prepare-azure-for-hyperv.md)
2. [Prepare on-premises Hyper-V](./hyper-v-prepare-on-premises-tutorial.md)

## Prepare infrastructure

It is important to prepare the infrastructure before you set up disaster recovery of on-premises Hyper-V VMs to Azure.

### Deployment planning

1. In the [Azure portal](https://portal.azure.com), go to **Recovery Services vaults** and select the vault. We prepared the vault **ContosoVMVault** in the previous tutorial.
2. On the vault home page, select **Enable Site Recovery**.
1. Navigate to the bottom of the page, and select **Prepare infrastructure** under the **Hyper-V machines to Azure** section. This opens the **Prepare infrastructure** pane.
1. In the **Prepare infrastructure** pane, under **Deployment planning** tab do the following:
    > [!TIP]
    > If you're planning a large deployment, download the Deployment Planner for Hyper-V from the link on the page. [Learn more](hyper-v-deployment-planner-overview.md) about Hyper-V deployment planning.
    1. For this tutorial, we don't need the Deployment Planner. In **Deployment planning completed?**, select **I will do it later**. 
    1. Select **Next**.

    :::image type="content" source="./media/hyper-v-azure-tutorial/deployment-planning.png" alt-text="Screenshot displays Deployment settings page." lightbox="./media/hyper-v-azure-tutorial/deployment-planning.png":::

### Source settings

To set up the source environment, you create a Hyper-V site and add to that site the Hyper-V hosts containing VMs that you want to replicate. Then, you download and install the Azure Site Recovery Provider and the Azure Recovery Services agent on each host, and register the Hyper-V site in the vault.

1. In the **Source settings** tab, do the following:
    1. For **Are you Using System Center VMM to manage Hyper-V hosts?**, select **No**. This enables new options.
    1. Under **Hyper-V site** specify the site name. You can also use the **Add Hyper-V site** option to add a new Hyper-V site. In this tutorial we're using **ContosoHyperVSite**.
    1. Under **Hyper-V servers**, select **Add Hyper-V servers** to add servers.
         :::image type="content" source="./media/hyper-v-azure-tutorial/source-setting.png" alt-text="Screenshot displays Source settings page." lightbox="./media/hyper-v-azure-tutorial/source-setting.png":::

    1. On the new **Add Server** pane, do the following:
        1. [Download the installer](#install-the-provider) for the Microsoft Azure Site Recovery Provider.
            :::image type="content" source="./media/hyper-v-azure-tutorial/add-server.png" alt-text="Screenshot displays Add server page." lightbox="./media/hyper-v-azure-tutorial/add-server.png":::
        1. Download the vault registration key. You need this key to the Provider. The key is valid for five days. [Learn more](#install-the-provider-on-a-hyper-v-core-server).
        1. Select the site you created.
    1. Select **Next**.
        

Site Recovery checks if you have one or more compatible Azure storage accounts and networks.

#### Install the Provider

Install the downloaded setup file (AzureSiteRecoveryProvider.exe) on each Hyper-V host that you want to add to the Hyper-V site. Setup installs the Azure Site Recovery Provider and Recovery Services agent on each Hyper-V host.

1. Run the setup file.
2. In the Azure Site Recovery Provider Setup wizard > **Microsoft Update**, opt in to use Microsoft Update to check for Provider updates.
3. In **Installation**, accept the default installation location for the Provider and agent, and select **Install**.
4. After installation, in the Microsoft Azure Site Recovery Registration Wizard > **Vault Settings**, select **Browse**, and in **Key File**, select the vault key file that you downloaded.
5. Specify the Azure Site Recovery subscription, the vault name (**ContosoVMVault**), and the Hyper-V site (**ContosoHyperVSite**) to which the Hyper-V server belongs.
6. In **Proxy Settings**, select **Connect directly to Azure Site Recovery without a proxy**.
7. In **Registration**, after the server is registered in the vault, select **Finish**.

Metadata from the Hyper-V server is retrieved by Azure Site Recovery, and the server is displayed in **Site Recovery Infrastructure** > **Hyper-V Hosts**. This process can take up to 30 minutes.

#### Install the Provider on a Hyper-V core server

If you're running a Hyper-V core server, download the setup file and follow these steps:

1. Extract the files from AzureSiteRecoveryProvider.exe to a local directory by running this command:

    `AzureSiteRecoveryProvider.exe /x:. /q`
 
2. Run `.\setupdr.exe /i`. Results are logged to %Programdata%\ASRLogs\DRASetupWizard.log.

3. Register the server by running this command:

    ```
    cd "C:\Program Files\Microsoft Azure Site Recovery Provider"
    "C:\Program Files\Microsoft Azure Site Recovery Provider\DRConfigurator.exe" /r /Friendlyname "FriendlyName of the Server" /Credentials "path to where the credential file is saved"
    ```

### Target settings

Select and verify target resources:

1. In the **Target settings** tab, do the following:
    1. In **Subscription**, select the subscription and the resource group **ContosoRG** in which the Azure VMs will be created after failover.
    1. Under **Post-failover deployment model**, select the **Resource Manager** deployment model.
    1. Select **Next**.
 
    :::image type="content" source="./media/hyper-v-azure-tutorial/target-settings.png" alt-text="Screenshot displays Target settings." lightbox="./media/hyper-v-azure-tutorial/target-settings.png":::


### Replication policy

Under **Replication policy**, do the following:
1. Under **Replication policy**, specify the replication policy. 
    :::image type="content" source="./media/hyper-v-azure-tutorial/replication-policy.png" alt-text="Screenshot displays Replication policy." lightbox="./media/hyper-v-azure-tutorial/replication-policy.png":::
1. If you do not have a replication policy, use the **Create new policy and associate** option to create a new policy. 
1. In the **Create and associate policy** page, do the following:
    - **Name** - specify a policy name. We're using **ContosoReplicationPolicy**.
    - **Source type** - select the ContosoHyperVSite site.
    - **Target type** - verify the target (Azure), the vault subscription, and the Resource Manager deployment mode.
    - **Copy frequency** - indicates how often delta data (after initial replication) will replicate. The default frequency is every five minutes.
    - **Recovery point retention in hours** indicates that recovery points will be retained for two hours. The maximum allowed value for retention when protecting virtual machines hosted on Hyper-V hosts is 24 hours.
    - **App-consistent snapshot frequency** indicates that recovery points containing app-consistent snapshots will be created every hour.
    - **Initial replication start time** indicates that initial replication will start immediately.   
    
1. After the policy is created, select **OK**. When you create a new policy, it's automatically associated with the specified Hyper-V site. 
    :::image type="content" source="./media/hyper-v-azure-tutorial/create-policy.png" alt-text="Screenshot displays Create policy." lightbox="./media/hyper-v-azure-tutorial/create-policy.png":::
1. Select **Next**.

On the **Review** tab, review  your selections and select **Create**.

You can track progress in the notifications. After the job finishes, the initial replication is complete, and the VM is ready for failover.

## Enable replication

1.	In the [Azure portal](https://portal.azure.com), go to **Recovery Services vaults** and select the vault. 
2.	On the vault home page, select **Enable Site Recovery**.
3.	Navigate to the bottom of the page, and select **Enable replication** under the **Hyper-V machines to Azure** section.
1. Under **Source environment** tab, specify the **source location** and select **Next**.
   
    :::image type="content" source="./media/hyper-v-azure-tutorial/enable-replication-source.png" alt-text="Screenshot of the source environment page.":::

1. Under **Target environment** tab, do the following:
    1. In **Subscription**, specify the subscription name.
    1. For **Post-failover resource group**, specify the resource group name to fail over.
    1. For **Post-failover deployment model**, specify **Resource Manager**.
    1. In **Storage account**, specify the storage account name.
    1. Select **Next**.
    :::image type="content" source="./media/hyper-v-azure-tutorial/enable-replication-target.png" alt-text="Screenshot of the target environment page.":::

1. Under **Virtual machine selection** tab, select the VM that you want to replicate and select **Next**.
   
1. Under **Replication settings** tab, select and verify the disk details.
    :::image type="content" source="./media/hyper-v-azure-tutorial/enable-replication-settings.png" alt-text="Screenshot of the replication setting page.":::
1. Under **Replication policy** tab, verify that the correct replication policy is selected.
    :::image type="content" source="./media/hyper-v-azure-tutorial/enable-replication-policy.png" alt-text="Screenshot of the replication policy page.":::
1. Under **Review** tab, review your selections and select **Enable Replication**. 

## Next steps

[Learn more](tutorial-dr-drill-azure.md) about running a disaster recovery drill.