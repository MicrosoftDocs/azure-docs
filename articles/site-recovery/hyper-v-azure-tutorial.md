---
title: Set up Hyper-V disaster recovery by using Azure Site Recovery  
description: Learn how to set up disaster recovery of on-premises Hyper-V VMs (without SCVMM) to Azure by using Site Recovery and MARS.
ms.service: site-recovery
ms.topic: tutorial
ms.date: 05/04/2023
ms.custom: MVC, engagement-fy23, devx-track-linux
ms.author: ankitadutta
author: ankitaduttaMSFT
---
# Set up disaster recovery of on-premises Hyper-V VMs to Azure

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your disaster recovery strategy by managing and orchestrating replication, failover, and failback of on-premises machines and Azure virtual machines (VMs).

This tutorial is the third in a series that shows you how to set up on-premises Hyper-V VMs for disaster recovery to Azure. This tutorial applies to Hyper-V VMs that aren't managed by Microsoft System Center Virtual Machine Manager.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Set up the source replication environment, including on-premises Site Recovery components and the target replication environment.
> - Create a replication policy.
> - Enable replication for a VM.

> [!NOTE]
> We design tutorials to show the simplest deployment path for a scenario. The tutorials use default options when possible, and they don't show all possible settings and paths. For more information about a scenario, see the *How-to Guides* section of the [Site Recovery documentation](./index.yml).

## Prerequisites

This tutorial is the third in a series of tutorials. It assumes that you've already completed the tasks in the first two tutorials:

1. [Prepare Azure](./tutorial-prepare-azure-for-hyperv.md)
1. [Prepare on-premises Hyper-V](./hyper-v-prepare-on-premises-tutorial.md)

## Prepare the infrastructure

It's important to prepare the infrastructure before you set up disaster recovery of on-premises Hyper-V VMs to Azure.

### Deployment planning

1. In the [Azure portal](https://portal.azure.com), go to **Recovery Services vaults** and select your vault. In the preceding tutorial, you prepared the **ContosoVMVault** vault.
1. On the vault command bar, select **Enable Site Recovery**.
1. On **Site Recovery**, under the **Hyper-V machines to Azure** tile, select **Prepare infrastructure**.
1. On **Prepare infrastructure**, select the **Deployment planning** tab. For **Deployment planning completed?**, select **I will do it later**.

    > [!TIP]
    > For this tutorial, you don't need to use the Deployment Planner. If you're planning a large deployment, download the Deployment Planner for Hyper-V from the link on the pane. [Learn more](hyper-v-deployment-planner-overview.md) about Hyper-V deployment planning.
  
    :::image type="content" source="./media/hyper-v-azure-tutorial/deployment-planning.png" alt-text="Screenshot that shows the Deployment planning pane.":::
1. Select **Next**.

### Source settings

To set up the source environment, you create a Hyper-V site. You add to the site the Hyper-V hosts that contain VMs you want to replicate. Then, you download and install the Azure Site Recovery provider and the Microsoft Azure Recovery Services (MARS) agent for Azure Site Recovery on each host, and register the Hyper-V site in the vault.

1. On **Prepare infrastructure**, on the **Source settings** tab, complete these steps:
    1. For **Are you Using System Center VMM to manage Hyper-V hosts?**, select **No**.
    1. For **Hyper-V site**, enter a name for the site. You can also use the **Add Hyper-V site** option to add a new Hyper-V site. For example, use **ContosoHyperVSite**.
    1. For **Hyper-V servers**, select **Add Hyper-V server** to add a server.

         :::image type="content" source="./media/hyper-v-azure-tutorial/source-setting.png" alt-text="Screenshot that shows the Source settings pane with links to add a Hyper-V site and servers highlighted." :::
    1. On **Add Server**, complete these steps:
        1. [Download the installer](#install-the-provider) for the Microsoft Azure Site Recovery provider.

            :::image type="content" source="./media/hyper-v-azure-tutorial/add-server.png" alt-text="Screenshot that shows the Add server pane." :::
        1. Download the vault registration key. You need this key to access the provider. The key is valid for five days. [Learn more](#install-the-provider-on-a-hyper-v-core-server).
        1. Select the site you created.
1. Select **Next**.

Site Recovery checks for compatible Azure storage accounts and networks in your Azure subscription.

#### Install the provider

Install the downloaded setup file (*AzureSiteRecoveryProvider.exe*) on each Hyper-V host that you want to add to the Hyper-V site. Setup installs the Site Recovery provider and the Recovery Services agent (MARS for Azure Site Recovery) on each Hyper-V host.

1. Run the setup file.
1. In the Azure Site Recovery provider setup wizard, for **Microsoft Update**, opt in to use Microsoft Update to check for provider updates.
1. On **Installation**, accept the default installation location for the provider and agent, and then select **Install**.
1. After installation, in the Microsoft Azure Site Recovery Registration Wizard, for **Vault Settings**, select **Browse**. On **Key File**, select the vault key file that you downloaded.
1. Select the Azure Site Recovery subscription, the vault name (**ContosoVMVault**), and the Hyper-V site (**ContosoHyperVSite**) to which the Hyper-V server belongs.
1. On **Proxy Settings**, select **Connect directly to Azure Site Recovery without a proxy**.
1. On **Registration**, after the server is registered in the vault, select **Finish**.

Metadata from the Hyper-V server is retrieved by Azure Site Recovery, and the server appears in **Site Recovery Infrastructure** > **Hyper-V Hosts**. This process can take up to 30 minutes.

#### Install the provider on a Hyper-V Core server

If you're running a Hyper-V Core server, download the setup file and complete these steps:

1. Extract the files from *AzureSiteRecoveryProvider.exe* to a local directory by running this command:

    `AzureSiteRecoveryProvider.exe /x:. /q`

1. Run `.\setupdr.exe /i`. Results are logged to *%Programdata%\ASRLogs\DRASetupWizard.log*.

1. Register the server by running this command:

    ```cmd
    cd "C:\Program Files\Microsoft Azure Site Recovery Provider"
    "C:\Program Files\Microsoft Azure Site Recovery Provider\DRConfigurator.exe" /r /Friendlyname "FriendlyName of the Server" /Credentials "path to where the credential file is saved"
    ```

### Target settings

Select and verify target resources:

1. On **Prepare infrastructure**, on the **Target settings** tab, complete these steps:
    1. For **Subscription**, select the subscription and the resource group (**ContosoRG**) in which the Azure VMs will be created after failover.
    1. For **Post-failover deployment model**, select the **Resource Manager** deployment model.

    :::image type="content" source="./media/hyper-v-azure-tutorial/target-settings.png" alt-text="Screenshot that shows the Target settings pane.":::
1. Select **Next**.

### Replication policy

On **Prepare infrastructure**, on the **Replication policy** tab, complete these steps:

1. For **Replication policy**, select the replication policy.

    :::image type="content" source="./media/hyper-v-azure-tutorial/replication-policy.png" alt-text="Screenshot that shows the Replication policy tab, with the Create new policy and associate link highlighted.":::

   If you don't have a replication policy, select the **Create new policy and associate** link to create a new policy. On the **Create and associate policy** pane, complete these steps:
    1. For **Name**, enter a name for the policy. For example, use **ContosoReplicationPolicy**.
    1. For **Source type**, select the **ContosoHyperVSite** site.
    1. For **Target type**, verify the target (Azure), the vault subscription, and the Resource Manager deployment mode.
    1. For **Copy frequency**, select **5 Minutes**.
    1. For **Recovery point retention in hours**, select **2**.
    1. For **App-consistent snapshot frequency**, select **1**.
    1. For **Initial replication start time**, select **Immediately**.  
    1. Select **OK** to create the policy. When you create a new policy, it's automatically associated with the specified Hyper-V site.

    :::image type="content" source="./media/hyper-v-azure-tutorial/create-policy.png" alt-text="Screenshot that shows Create and associate policy pane and options.":::
1. Select **Next**.
1. On the **Review** tab, review your selections, and then select **Create**.

You can track progress in your Azure portal notifications. When the job finishes, the initial replication is complete, and the VM is ready for failover.

## Enable replication

1. In the [Azure portal](https://portal.azure.com), go to **Recovery Services vaults** and select the vault.
1. On the vault command bar, select **Enable Site Recovery**.
1. On **Site Recovery**, under the **Hyper-V machines to Azure** tile, select **Enable replication**.
1. On **Enable replication**, on the **Source environment** tab, select a source location, and then select **Next**.
  
    :::image type="content" source="./media/hyper-v-azure-tutorial/enable-replication-source.png" alt-text="Screenshot that shows the source environment pane.":::
1. On the **Target environment** tab, complete these steps:
    1. For **Subscription**, enter or select the subscription.
    1. For **Post-failover resource group**, select the resource group name to fail over to.
    1. For **Post-failover deployment model**, select **Resource Manager**.
    1. For **Storage account**, enter or select the storage account.

    :::image type="content" source="./media/hyper-v-azure-tutorial/enable-replication-target.png" alt-text="Screenshot that shows the target environment pane.":::
1. Select **Next**.
1. On the **Virtual machine selection** tab, select the VM to replicate, and then select **Next**.
1. On the **Replication settings** tab, select and verify the disk details, and then select **Next**.

    :::image type="content" source="./media/hyper-v-azure-tutorial/enable-replication-settings.png" alt-text="Screenshot that shows the replication settings pane.":::
1. On the **Replication policy** tab, verify that the correct replication policy is selected, and then select **Next**.

    :::image type="content" source="./media/hyper-v-azure-tutorial/enable-replication-policy.png" alt-text="Screenshot that shows the replication policy pane.":::
1. On the **Review** tab, review your selections, and then select **Enable Replication**.

## Next steps

Learn more about [running a disaster recovery drill](tutorial-dr-drill-azure.md).
