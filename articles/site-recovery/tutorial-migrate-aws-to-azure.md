---
title: Migrate VMs from AWS to Azure with Azure Site Recovery | Microsoft Docs
description: This article describes how to migrate VMs running in Amazon Web Services (AWS) to Azure, using Azure Site Recovery.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: ddb412fd-32a8-4afa-9e39-738b11b91118
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 11/01/2017
ms.author: raynew
ms.custom: MVC

---
# Migrate Amazon Web Services (AWS) VMs to Azure

This tutorial teaches you how to migrate Amazon Web Services (AWS) virtual machines (VMs), to Azure VMs using Site Recovery. When migrating EC2 instances to Azure, the VMsare treated as if they are physical, on-premises computers. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prepare Azure resources
> * Prepare the AWS EC2 instances for migration
> * Deploy a configuration server
> * Enable replication for VMs
> * Test the failover to make sure everything's working
> * Run a one-time failover to Azure

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prepare Azure resources 

You need to have a few resources ready in Azure for the migrated EC2 instances to use. These include a storage account, a vault, and a virtual network.

### Create a storage account

Images of replicated machines are held in Azure storage. Azure VMs are created from the storage
when you failover from on-premises to Azure.

1. In the [Azure portal](https://portal.azure.com) menu, click **New** -> **Storage** -> **Storage account**.
2. Enter a name for your storage account. For these tutorials, we use the name
   **awsmigrated2017**. The name must be unique within Azure, and be between 3 and 24
   characters, only numbers and lowercase letters.
3. Keep the defaults for **Deployment model**, **Account kind**, **Performance**, and **Secure transfer required**.
5. Select the default **RA-GRS** for **Replication**.
6. Select the subscription you want to use for this tutorial.
7. For **Resource group**, select **Create new**. In this example, we use **migrationRG** as the name.
8. Select **West Europe** as the location. 
9. Click **Create** to create the storage account.

### Create a vault

1. In the [Azure portal](https://portal.azure.com), in the left navigation, click **More services** and search for and select **Recovery Services vaults**.
2. In the Recovery Services vaults page, click **+ Add** in the upper left of the page.
3. For **Name**, type *myVault*. 
4. For **Subscription**, select the appropriate subscription.
4. For **Resource Group**, select **Use existing** and select *migrationRG*. 
5. In **Location**, select *West Europe*. 
5. To quickly access the new vault from the dashboard, select **Pin to dashboard**.
7. When you are done, click **Create**.

The new vault appears on the **Dashboard** > **All resources**, and on the main **Recovery Services vaults** page.

### Set up an Azure network

When the Azure VMs are created after the migration (failover), they're joined to this network.

1. In the [Azure portal](https://portal.azure.com), click **New** > **Networking** >
   **Virtual network**
3. For **Name**, type *myMigrationNetwork*.
4. Leave the default value for **Address space**.
5. For **Subscription**, select the appropriate subscription.
6. For **Resource group**, select **Use existing** and choose *migrationRG* from the drop-down.
7. For **Location**, select **West Europe**. 
8. Leave the defaults for **Subnet**, both the **Name** and **IP range**.
9. Leave **Service Endpoints** disabled.
10. When you are done, click **Create**.


## Prepare the EC2 instances

You need one or more VMs that you want to migrate. These EC2 instance should be running the 64-bit version of Windows Server 2008 R2 SP1 or later, Windows Server 2012, Windows Server 2012 R2 or Red Hat Enterprise Linux 6.7 (HVM virtualized instances only). The server must have only Citrix PV or AWS PV drivers. Instances running RedHat PV drivers aren't supported.

The Mobility service must be installed on each VM you want to replicate. Site Recovery installs this service automatically when you enable replication for the VM. For automatic installation, you need to prepare an account on the EC2 instances that Site Recovery will use to access the VM.

You can use a domain or local account. For Linux VMs, the account should be root on the source Linux
server. For Windows VMs, if you're not using a domain account, disable Remote User Access control
on the local machine:

  - In the registry, under **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System**,
    add the DWORD entry **LocalAccountTokenFilterPolicy** and set the value to 1.
	
You also need a separate EC2 instance that you can use as the Site Recovery configuration server. This instance must be running Windows Server 2012 R2. 
	

## Prepare the infrastructure 

On the portal page for your vault, select **Site Recovery** from the **Getting Started** section and then click **Prepare Infrastructure**.

### 1 Protection goal

Select the following values on the **Protection Goal** page:
   
|    |  | 
|---------|-----------|
| Where are your machines located? | **On-premises**|
| Where do you want to replicate your machines? |**To Azure**|
| Are your machines virtualized? | **Not virtualized / Other**|

When you are done, click **OK** to move to the next section.

### 2 Source Prepare 

On the **Prepare source** page, click **+ Configuration Server**. 

1. Use an EC2 instance running Windows Server 2012 R2 to create a configuration server and register it with your recovery vault.

2. Configure the proxy on the EC2 instance VM you are using as the configuration server so that it can access the [Service URLs](site-recovery-support-matrix-to-azure.md).

3. Download the [Microsoft Azure Site Recovery Unified Setup](http://aka.ms/unifiedinstaller_wus) program. You can download it to your local machine and then copy it over to the VM you are using as the configuration server.

4. Click on the **Download** button to download the vault registration key. Copy the downloaded file over to the VM you are using as the configuration server.

5. On the VM, right-click installer you downloaded for the **Microsoft Azure Site Recovery Unified Setup** and select **Run as administrator**. 

	1. In **Before You Begin**, select **Install the configuration server and process server** and then click **Next**.
	2. In **Third-Party Software License**, select **I accept the third-party license agreement.** and then click **Next**.
	3. In **Registration**, click browse and navigate to where you put the vault registration key file and then click **Next**.
	4. In **Internet Settings**, select **Connect to Azure Site Recovery without a proxy server.** and then click **Next**.
	5. In the **Prerequisites Check** page, it runs checks for several items. When it is complete, click **Next**. 
	6. In **MySQL Configuration**, provide the required passwords and then click **Next**.
	7. In **Environment Details**, select **No**, you don't need to protect VMware machines and then click **Next**.
	8. In **Install Location**, click **Next** to accept the default.
	9. In **Network Selection**, click **Next** to accept the default.
	10. In **Summary** click **Install**.
	11. **Installation Progress** shows you information about where you are in the installation process. When it is complete, click **Finish**. You get a pop-up about needing a possible reboot, click **OK**. You also get a pop-up about the Configuration Server Connection Passphrase,  copy the passphrase to your clipboard and save it somewhere safe.
    
6. On the VM, run **cspsconfigtool.exe** to create one or more management accounts on the configuration server. Make sure the management accounts have administrator permissions on the EC2 instances that you want to migrate. 

When you are done setting up the configuration server, go back to the portal and select the server you just created for **Configuration Server** and click *OK** to move on to step 3 Target Prepare.

### 3 Target Prepare 

In this section you enter information about the resources you created when you went through the [Prepare Azure resources](#prepare-azure-resources) section, earlier in this tutorial.

1. In **Subscription**, select the Azure subscription that you used for the [Prepare Azure](tutorial-prepare-azure.md) tutorial.
2. Select **Resource Manager** as the deployment model.
3. Site Recovery checks that you have one or more compatible Azure storage accounts and networks. These should be the resources you created when you went through the [Prepare Azure resources](#prepare-azure-resources) section, earlier in this tutorial
4. When you are done, click **OK**.


### 4 Replication settings Prepare 

You need to create a replication policy, before you can enable replication

1. Click **+ Replicate and Associate**.
2. In **Name**, type **myReplicationPolicy**.
3. Leave the rest of the default settings and click **OK** to create the policy. The new policy is automatically associated with the configuration server. 

### 5 Deployment planning Select 

In **Have you completed deployment planning?**, select **I will do it later** from the drop-down and then click **OK**.

When you are all done with all 5 sections of **Prepare infrastructure**, click **OK**.


## Enable replication

Enable replication for each VM you want to migrate. When replication is enabled, Site Recovery installs the Mobility service automatically. 

1. Open the [Azure portal](htts://portal.azure.com).
1. On the page for your vault, under **Getting Started**, click **Site Recovery**.
2. Under **For on-premises machines and Azure VMs**, click **Step 1:Replicate application**. Complete the wizard pages with the following information and click **OK** on each page when finished:
	- 1 Source Configure:
	  
    |  |  |
    |-----|-----|
    | Source: | **On Premises**|
	| Source location:| The name of your configuration server EC2 instance.|
	|Machine type: | **Physical machines**|
	| Process server: | Select the configuration server from the drop-down list.|
	
	- 2 Target Configure
		
    |  |  |
    |-----|-----|
    | Target: | Leave the default.|
	| Subscription: | Select the subscription you have been using.|
	| Post-failover resource group:| Use the resource group you created in the [Prepare Azure resources](#prepare-azure-resources) section.|
	| Post-failover deployment model: | Choose **Resource Manager**|
	| Storage account: | Choose the storage account you created in the [Prepare Azure resources](#prepare-azure-resources) section.|
	| Azure network: | Choose **Configure now for selected machines**|
	| Post-failover Azure network: | Choose the network you created in the [Prepare Azure resources](#prepare-azure-resources) section.|
	| Subnet: | Select the **default** from the drop-down.|
	
	- 3 Physical Machines Select
		
		Click **+ Physical machine** and then enter the **Name**, the **IP Address** and **OS Type** of the EC2 instance that you want to migrate and then click **OK**.
		
	- 4 Properties Configure Properties
		
		Select the account that you created on the configuration server from the drop-down and click **OK**.
		
	- 5 Replication Settings Configure replication settings
	
		Make sure the replication policy selected in the drop-down is **myReplicationPolicy** and then click **OK**.
		
3. When the wizard is complete, click **Enable replication**.
		

You can track progress of the **Enable Protection** job in **Monitoring and reports** > **Jobs** > **Site Recovery Jobs**. After the **Finalize Protection** job runs the machine is ready for failover.		
		
When you enable replication for a VM, it can take 15 minutes or longer for changes to take effect and appear in the portal.

## Run a test failover

When you run a test failover, the following happens:

1. A prerequisites check runs to make sure all of the conditions required for failover are in
   place.
2. Failover processes the data, so that an Azure VM can be created. If select the latest recovery
   point, a recovery point is created from the data.
3. An Azure VM is created using the data processed in the previous step.

In the portal, run the test failover as follows:

1. On the page for your vault, go to **Protected items** > **Replicated Items**> click the VM > **+ Test Failover**.

2. Select a recovery point to use for the failover:
    - **Latest processed**: Fails the VM over to the latest recovery point that was processed by
      Site Recovery. The time stamp is shown. With this option, no time is spent processing data, so
      it provides a low RTO (recovery time objective).
    - **Latest app-consistent**: This option fails over all VMs to the latest app-consistent
      recovery point. The time stamp is shown.
    - **Custom**: Select any recovery point.
3. In **Test Failover**, select the target Azure network to which Azure VMs will be connected after
   failover occurs. This should be the network you created in the [Prepare Azure resources](#prepare-azure-resources) section.
4. Click **OK** to begin the failover. You can track progress by clicking on the VM to open its
   properties. Or you can click the **Test Failover** job on the page for your vault in **Monitoring and reports** > **Jobs** >
   **Site Recovery jobs**.
5. After the failover finishes, the replica Azure VM appears in the Azure portal > **Virtual
   Machines**. Check that the VM is the appropriate size, that it's connected to the right network,
   and that it's running.
6. You should now be able to connect to the replicated VM in Azure.
7. To delete Azure VMs created during the test failover, click **Cleanup test failover** on the
   recovery plan. In **Notes**, record and save any observations associated with the test failover.

In some scenarios, failover requires additional processing that takes around eight to ten minutes to complete. 


## Migrate to Azure

Run an actual failover for the EC2 instances to migrate them to Azure VMs. 

1. In **Protected items** > **Replicated items** click the AWS instances > **Failover**.
2. In **Failover** select a **Recovery Point** to failover to. Select the latest recovery point.
3. Select **Shut down machine before beginning failover** if you want Site Recovery to attempt to do a shutdown of source virtual machines before triggering the failover. Failover continues even if shutdown fails. You can follow the failover progress on the **Jobs** page.
4. Check that the VM appears in **Replicated items**. 
5. Right-click each VM > **Complete Migration**. This finishes the migration process, stops replication for the AWS VM, and stops Site Recovery billing for the VM.

    ![Complete migration](./media/tutorial-migrate-aws-to-azure/complete-migration.png)

> [!WARNING]
> **Don't cancel a failover in progress**: Before failover is started, VM replication is stopped. If you cancel a failover in progress, failover stops, but the VM won't replicate again.  


    

## Next steps

In this topic, you’ve learned how to migrate AWS EC2 instances to Azure VMs. To learn more about Azure VMs, continue to the tutorials for Windows VMs.

> [!div class="nextstepaction"]
> [Azure Windows virtual machine tutorials](../virtual-machines/windows/tutorial-manage-vm.md)
