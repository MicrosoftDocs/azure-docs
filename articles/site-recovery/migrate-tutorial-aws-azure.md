---
title: Migrate AWS VMs to Azure with the Azure Site Recovery service | Microsoft Docs
description: This article describes how to migrate Windows VMs running in Amazon Web Services (AWS) to Azure using Azure Site Recovery.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 09/09/2019
ms.author: raynew
ms.custom: MVC

---
# Migrate Amazon Web Services (AWS) VMs to Azure

This tutorial shows you how to migrate Amazon Web Services (AWS) virtual machines (VMs) to Azure VMs by using Azure Site Recovery. When you migrate AWS EC2 instances to Azure, the VMs are treated like physical, on-premises computers. In this tutorial, you learn how to:


> [!TIP]
> You should now use the Azure Migrate service to migrate AWS VMs to Azure, instead of the Azure Site Recovery service. [Learn more](../migrate/tutorial-migrate-physical-virtual-machines.md).


> [!div class="checklist"]
> * Verify prerequisites
> * Prepare Azure resources
> * Prepare AWS EC2 instances for migration
> * Deploy a configuration server
> * Enable replication for VMs
> * Test the failover to make sure everything's working
> * Run a onetime failover to Azure

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prerequisites
- Ensure that the VMs that you want to migrate are running a supported OS version. Supported versions include: 
  - Windows Server 2016 
  - Windows Server 2012 R2
  - Windows Server 2012 
  - 64-bit version of Windows Server 2008 R2 SP1 or later
  - Red Hat Enterprise Linux 6.4 to 6.10, 7.1 to 7.6 (HVM virtualized instances only)  *(Instances running RedHat PV drivers aren't supported.)*
  - CentOS 6.4 to 6.10, 7.1 to 7.6 (HVM virtualized instances only)
 
- The Mobility service must be installed on each VM that you want to replicate. 

    > [!IMPORTANT]
    > Site Recovery installs this service automatically when you enable replication for the VM. For automatic installation, you must prepare an account on the EC2 instances that Site Recovery will use to access the VM. 
    > You can use a domain or local account. 
    > - For Linux VMs, the account should be root on the source Linux server. 
    > - For Windows VMs, if you're not using a domain account, disable Remote User Access control on the local machine:
    >
    >      In the registry, under **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System**,
        add the DWORD entry **LocalAccountTokenFilterPolicy** and set the value to **1**.

- A separate EC2 instance that you can use as the Site Recovery configuration server. This instance must be running Windows Server 2012 R2.

## Prepare Azure resources

You must have a few resources ready in Azure for the migrated EC2 instances to use. These include a storage account, a vault, and a virtual network.

### Create a storage account

Images of replicated machines are held in Azure Storage. Azure VMs are created from storage when you fail over from on-premises to Azure.

1. In the [Azure portal](https://portal.azure.com), in the left menu, select **Create a resource** > **Storage** > **Storage account**.
2. Enter a name for your storage account. In these tutorials, we use the name **awsmigrated2017**. The name must:
    - Be unique in Azure
    - Be between 3 and 24 characters
    - Contain only numbers and lowercase letters
3. Leave the defaults for **Deployment model**, **Account kind**, **Performance**, and **Secure transfer required**.
5. For **Replication**, select the default **RA-GRS**.
6. Select the subscription that you want to use for this tutorial.
7. For **Resource group**, select **Create new**. In this example, we use **migrationRG** for the resource group name.
8. For **Location**, select **West Europe**.
9. Select **Create** to create the storage account.

### Create a vault

1. In the [Azure portal](https://portal.azure.com), select **All services**. Search for and then select **Recovery Services vaults**.
2. On the Azure Recovery Services vaults page, select **Add**.
3. For **Name**, enter **myVault**.
4. For **Subscription**, select the subscription that you want to use.
4. For **Resource Group**, select **Use existing**, and then select **migrationRG**.
5. For **Location**, select **West Europe**.
5. Select **Pin to dashboard** to be able to quickly access the new vault from the dashboard.
7. When you're done, select **Create**.

To see the new vault, go to **Dashboard** > **All resources**. The new vault also appears on the main **Recovery Services vaults** page.

### Set up an Azure network

When Azure VMs are created after the migration (failover), they're joined to this Azure network.

1. In the [Azure portal](https://portal.azure.com), select **Create a resource** > **Networking** >
   **Virtual network**.
3. For **Name**, enter **myMigrationNetwork**.
4. Leave the default value for **Address space** (must enter value).
5. For **Subscription**, select the subscription that you want to use.
6. For **Resource group**, select **Use existing**, and then select **migrationRG**.
7. For **Location**, select **West Europe**.
8. Under **Subnet**, leave the default values for **Name** and **IP range (must enter value)**.
9. Add instructions for DDoS protection settings.
10. Leave the **Service Endpoints** option disabled.
11. Add instructions for Firewall settings.
12. When you're done, select **Create**.

## Prepare the infrastructure

On your vault page in the Azure portal, in the **Getting Started** section, select **Site Recovery**, and then select **Prepare Infrastructure**. Complete the following steps.

### 1: Protection goal

On the **Protection Goal** page, select the following values:

|    |  |
|---------|-----------|
| Where are your machines located? |Select **On-premises**.|
| Where do you want to replicate your machines? |Select **To Azure**.|
| Are you performing a migration? | Select **Yes**, and then check the box next to **I underdstand, but I would like to continue with Azure Site Recovery.**
| Are your machines virtualized? |Select **Not virtualized / Other**.|

When you're done, select **OK** to move to the next section.

### 2: Select deployment planning

In **Have you completed deployment planning**, select **I will do it later**, and then select **OK**.

### 3: Prepare source

On the **Prepare source** page, select **+ Configuration Server**.

1. Use an EC2 instance that's running Windows Server 2012 R2 to create a configuration server and register it with your recovery vault.
2. Configure the proxy on the EC2 instance VM you're using as the configuration server so that it can access the [service URLs](site-recovery-support-matrix-to-azure.md).
3. Download [Microsoft Azure Site Recovery Unified Setup](https://aka.ms/unifiedinstaller_wus). You can download it to your local machine and then copy it to the VM you're using as the configuration server.
4. Select the **Download** button to download the vault registration key. Copy the downloaded file to the VM you're using as the configuration server.
5. On the VM, right-click the installer you downloaded for Microsoft Azure Site Recovery Unified Setup, and then select **Run as administrator**.

    1. Under **Before You Begin**, select **Install the configuration server and process server**, and then select **Next**.
    2. In **Third-Party Software License**, select **I accept the third-party license agreement**, and then select **Next**.
    3. In **Registration**, select **Browse**, and then go to where you put the vault registration key file. Select **Next**.
    4. In **Internet Settings**, select **Connect to Azure Site Recovery without a proxy server**, and then select **Next**.
    5. The **Prerequisites Check** page runs checks for several items. When it's finished, select **Next**.
    6. In **MySQL Configuration**, provide the required passwords, and then select **Next**.
    7. In **Environment Details**, select **No**. You don't need to protect VMware machines. Then, select **Next**.
    8. In **Install Location**, select **Next** to accept the default.
    9. In **Network Selection**, select **Next** to accept the default.
    10. In **Summary**, select **Install**.
    11. **Installation Progress** shows you information about the installation process. When it's finished, select **Finish**. A window displays a message about a reboot. Select **OK**. Next, a window displays a message about the configuration server connection passphrase. Copy the passphrase to your clipboard and save it somewhere safe.
6. On the VM, run cspsconfigtool.exe to create one or more management accounts on the configuration server. Make sure that the management accounts have administrator permissions on the EC2 instances that you want to migrate.

When you're done setting up the configuration server, go back to the portal and select the server that you created for **Configuration Server**. Select **OK** to go to 3: Prepare target.

### 4: Prepare target

In this section, you enter information about the resources that you created in [Prepare Azure resources](#prepare-azure-resources) earlier in this tutorial.

1. In **Subscription**, select the Azure subscription that you used for the [Prepare Azure](tutorial-prepare-azure.md) tutorial.
2. Select **Resource Manager** as the deployment model.
3. Site Recovery verifies that you have one or more compatible Azure storage account and network. These should be the resources that you created in [Prepare Azure resources](#prepare-azure-resources) earlier in this tutorial.
4. When you're done, select **OK**.

### 5: Prepare replication settings

Before you can enable replication, you must create a replication policy.

1. Select **Create and Associate**.
2. In **Name**, enter **myReplicationPolicy**.
3. Leave the rest of the default settings, and then select **OK** to create the policy. The new policy is automatically associated with the configuration server.

When you're finished with all five sections under **Prepare Infrastructure**, select **OK**.

## Enable replication

Enable replication for each VM that you want to migrate. When replication is enabled, Site Recovery automatically installs the Mobility service.

1. Go to the [Azure portal](https://portal.azure.com).
1. On the page for your vault, under **Getting Started**, select **Site Recovery**.
2. Under **For on-premises machines and Azure VMs**, select **Step 1: Replicate application**. Complete the wizard pages with the following information. Select **OK** on each page when you're done:
   - 1: Configure source

     |  |  |
     |-----|-----|
     | Source: | Select **On Premises**.|
     | Source location:| Enter the name of your configuration server EC2 instance.|
     |Machine type: | Select **Physical machines**.|
     | Process server: | Select the configuration server from the drop-down list.|

   - 2: Configure target

     |  |  |
     |-----|-----|
     | Target: | Leave the default.|
     | Subscription: | Select the subscription that you have been using.|
     | Post-failover resource group:| Use the resource group you created in [Prepare Azure resources](#prepare-azure-resources).|
     | Post-failover deployment model: | Select **Resource Manager**.|
     | Storage account: | Select the storage account that you created in [Prepare Azure resources](#prepare-azure-resources).|
     | Azure network: | Select **Configure now for selected machines**.|
     | Post-failover Azure network: | Choose the network you created in [Prepare Azure resources](#prepare-azure-resources).|
     | Subnet: | Select the **default** in the drop-down list.|

   - 3: Select physical machines

     Select **Physical machine**, and then enter the values for **Name**, **IP Address**, and **OS Type** of the EC2 instance that you want to migrate. Select **OK**.

   - 4: Configure properties

     Select the account that you created on the configuration server, and then select **OK**.

   - 5: Configure replication settings

     Make sure that the replication policy selected in the drop-down list is **myReplicationPolicy**, and then select **OK**.

3. When the wizard is finished, select **Enable replication**.

To track the progress of the **Enable Protection** job, go to **Monitoring and reports** > **Jobs** > **Site Recovery Jobs**. After the **Finalize Protection** job runs, the machine is ready for failover.        

When you enable replication for a VM, changes can take 15 minutes or longer to take effect and appear in the portal.

## Run a test failover

When you run a test failover, the following events occur:

- A prerequisites check runs to make sure that all the conditions required for failover are in place.
- Failover processes the data so that an Azure VM can be created. If you select the latest recovery point, a recovery point is created from the data.
- An Azure VM is created by using the data processed in the preceding step.

In the portal, run the test failover:

1. On the page for your vault, go to **Protected items** > **Replicated Items**. Select the VM, and then select **Test Failover**.
2. Select a recovery point to use for the failover:
    - **Latest processed**: Fails over the VM to the latest recovery point that was processed by Site Recovery. The time stamp is shown. With this option, no time is spent processing data, so it provides a low recovery time objective (RTO).
    - **Latest app-consistent**: This option fails over all VMs to the latest app-consistent recovery point. The time stamp is shown.
    - **Custom**: Select any recovery point.

3. In **Test Failover**, select the target Azure network to which Azure VMs will be connected after failover occurs. This should be the network you created in [Prepare Azure resources](#prepare-azure-resources).
4. Select **OK** to begin the failover. To track progress, select the VM to view its properties. Or you can select the **Test Failover** job on the page for your vault. To do this, select **Monitoring and reports** > **Jobs** >  **Site Recovery jobs**.
5. When the failover finishes, the replica Azure VM appears in the Azure portal. To view the VM, select **Virtual Machines**. Ensure that the VM is the appropriate size, that it's connected to the right network, and that it's running.
6. You should now be able to connect to the replicated VM in Azure.
7. To delete Azure VMs that were created during the test failover, select **Cleanup test failover** in the recovery plan. In **Notes**, record and save any observations associated with the test failover.

In some scenarios, failover requires additional processing. Processing takes 8 to 10 minutes to finish.

## Migrate to Azure

Run an actual failover for the EC2 instances to migrate them to Azure VMs:

1. In **Protected items** > **Replicated items**, select the AWS instances, and then select **Failover**.
2. In **Failover**, select a **Recovery Point** to failover to. Select the latest recovery point, and start the failover. You can follow the failover progress on the **Jobs** page.
1. Ensure that the VM appears in **Replicated items**.
2. Right-click each VM, and then select **Complete Migration**. This does the following:

   - This finishes the migration process, stops replication for the AWS VM, and stops Site Recovery billing for the VM.
   - This step cleans up the replication data. It doesn't delete the migrated VMs. 

     ![Complete migration](./media/migrate-tutorial-aws-azure/complete-migration.png)

> [!WARNING]
> *Don't cancel a failover that is in progress*. Before failover is started, VM replication is stopped. If you cancel a failover that is in progress, failover stops, but the VM won't replicate again.  


## Next steps

In this article, you learned how to migrate AWS EC2 instances to Azure VMs. To learn more about Azure VMs, continue to the tutorials for Windows VMs.

> [!div class="nextstepaction"]
> [Azure Windows virtual machine tutorials](../virtual-machines/windows/tutorial-manage-vm.md)
