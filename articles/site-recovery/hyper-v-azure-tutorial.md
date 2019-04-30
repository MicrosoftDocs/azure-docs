---
title: Set up disaster recovery for on-premises Hyper-V VMs (without VMM) to Azure with Azure Site Recovery  | Microsoft Docs
description: Learn how to set up disaster recovery of on-premises Hyper-V VMs (without VMM) to Azure with the Azure Site Recovery service.
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 04/08/2019
ms.author: raynew
ms.custom: MVC
---

# Set up disaster recovery of on-premises Hyper-V VMs to Azure

c

> [!div class="checklist"]
> * Select your replication source and target.
> * Set up the source replication environment, including on-premises Site Recovery components, and the target replication environment.
> * Create a replication policy.
> * Enable replication for a VM.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario. They use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the article in the How To section of the Site Recovery Table of Contents.

## Before you begin
This is the third tutorial in a series. This tutorial assumes that you have already completed the tasks in the previous tutorials:

1. [Prepare Azure](tutorial-prepare-azure.md)
2. [Prepare on-premises Hyper-V](tutorial-prepare-on-premises-hyper-v.md)



## Select a replication goal

1. In **Recovery Services vaults**, select the vault. We prepared the vault **ContosoVMVault** in the previous tutorial.
2. In **Getting Started**, click **Site Recovery**. Then click **Prepare Infrastructure**
3. In **Protection goal** > **Where are your machines located?** select **On-premises**.
4. In **Where do you want to replicate your machines?**, select **To Azure**.
5. In **Are your machines virtualized?** select **Yes, with Hyper-V**.
6. In **Are you using System Center VMM to manage your Hyper-V hosts**, select **No**. Then click **OK**.

    ![Replication goal](./media/hyper-v-azure-tutorial/replication-goal.png)

## Confirm deployment planning

1. In **Deployment planning**, if you're planning a large deployment, download the Deployment Planner for Hyper-V from the link on the page. [Learn more](hyper-v-deployment-planner-overview.md) about Hyper-V deployment planning.
2. For the purposes of this tutorial, we don't need the deployment planner. In **Have you completed deployment planning?** select **I will do it later**. Then click **OK**.

    ![Deployment planning](./media/hyper-v-azure-tutorial/deployment-planning.png)

## Set up the source environment

To set up the source environment, you create a Hyper-V site, and add Hyper-V hosts containing VMs you want to replicate to the site. Then you download and install the Azure Site Recovery Provider and the Azure Recovery Services agent on each host, and register the Hyper-V site in the vault. 

1. Under **Prepare Infrastructure**, click **Source**.
2. In **Prepare source**, click **+Hyper-V Site**.
3. In **Create Hyper-V site**, and specify site name. We're using **ContosoHyperVSite**.

    ![Hyper-V site](./media/hyper-v-azure-tutorial/hyperv-site.png)

3. After the site is created, in **Prepare source** > **Step 1: Select Hyper-V site**, select the site you created.
4. Click **+Hyper-V Server**.

    ![Hyper-V server](./media/hyper-v-azure-tutorial/hyperv-server.png)

4. Download the installer for the Microsoft Azure Site Recovery Provider.
6. Download the vault registration key. You need this key to install the Provider. The key is valid for five days after you generate it.

    ![Download Provider](./media/hyper-v-azure-tutorial/download.png)
    

### Install the Provider

Install the downloaded setup file (AzureSiteRecoveryProvider.exe) on each Hyper-V host you want to add to the Hyper-V site. Setup installs the Azure Site Recovery Provider and Recovery Services agent, on each Hyper-V host.

1. Run the Setup file.
2. In the Azure Site Recovery Provider Setup wizard > **Microsoft Update**, opt in to use Microsoft Update to check for Provider updates.
3. In **Installation**, accept the default installation location for the Provider and agent, and click **Install**.
4. After installation, in the Microsoft Azure Site Recovery Registration Wizard > **Vault Settings**, click **Browse**, and in **Key File**, select the vault key file that you downloaded. 
5. Specify the Azure Site Recovery subscription, the vault name (**ContosoVMVault**), and the Hyper-V site (**ContosoHyperVSite**) to which the Hyper-V server belongs.
6. In **Proxy Settings**, select **Connect directly to Azure Site Recovery without a proxy**.
7. In **Registration**, After the server is registered in the vault, click **Finish**.

Metadata from the Hyper-V server is retrieved by Azure Site Recovery, and the server is displayed in **Site Recovery Infrastructure** > **Hyper-V Hosts**. This process can take up to 30 minutes.        

#### Install on Hyper-V core server

If you're running a Hyper-V core server, download the setup file and do the following:

1. Extract the files from AzureSiteRecoveryProvider.exe to a local directory by running

    `AzureSiteRecoveryProvider.exe /x:. /q`
 
2.	Run `.\setupdr.exe /i. Results are logged to %Programdata%\ASRLogs\DRASetupWizard.log.

3.	Register the server with this command:

    ```
    cd  C:\Program Files\Microsoft Azure Site Recovery Provider\DRConfigurator.exe" /r /Friendlyname "FriendlyName of the Server" /Credentials "path to where the credential file is saved"
    ```
 

## Set up the target environment

Select and verify target resources. 

1. Click **Prepare infrastructure** > **Target**.
2. Select the subscription and the resource group **ContosoRG**, in which the Azure VMs will be created after failover.
3. Select the **Resource Manager"** deployment model.

Site Recovery checks that you have one or more compatible Azure storage accounts and networks.


## Set up a replication policy

1. Click **Prepare infrastructure** > **Replication Settings** > **+Create and associate**.
2. In **Create and associate policy**, specify a policy name. We're using **ContosoReplicationPolicy**.
3. For this tutorial we'll leave the default settings.
    - **Copy frequency** indicates how often delta data (after initial replication) will replicate, every five minutes by default.
    - **Recovery point retention** indicates that recovery points will be retained for two hours.
    - **App-consistent snapshot frequency** indicates that recovery points containing app-consistent snapshots will be created every hour.
    - **Initial replication start time**, indicates that initial replication will start immediately.
4. After the policy is created, click **OK**. When you create a new policy, it's automatically associated with the specified Hyper-V site (in our tutorial that's **ContosoHyperVSite**)

    ![Replication policy](./media/hyper-v-azure-tutorial/replication-policy.png)


## Enable replication


1. In **Replicate application**, click **Source**. 
2. In **Source**, select the **ContosoHyperVSite** site. Then click **OK**.
3. In **Target**, verify Azure as the target, the vault subscription, and the **Resource Manager** deployment model.
4. If you're using tutorial settings, select the **contosovmsacct1910171607** storage account created in the previous tutorial for replicated data, and the **ContosoASRnet** network, in which Azure VMs will be located after failover.
5. In **Virtual machines** > **Select**, select the VM you want to replicate. Then click **OK**.

   You can track progress of the **Enable Protection** action in **Jobs** > **Site Recovery jobs**. After the **Finalize Protection** job completes, the initial replication is complete, and the virtual machine is ready for failover.

## Next steps
> [!div class="nextstepaction"]
> [Run a disaster recovery drill](tutorial-dr-drill-azure.md)
