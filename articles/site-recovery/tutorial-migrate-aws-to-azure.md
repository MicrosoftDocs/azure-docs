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
ms.date: 09/20/2017
ms.author: raynew

---
# Migrate Amazon Web Services (AWS) VMs to Azure

This tutorial shows you how to migrate Amazon Web Services (AWS) virtual machines (VMs), to Azure using Site Recovery. When migrating EC2 intances to Azure VMs using Site Recovery, the EC2 instances are treated as if they are physical, on-premises machines. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prepare Azure resources
> * Deploy a configuration server
> * Enable replication for VMs
> * Test the failover to make sure everything's working
> * Run a one-time failover to Azure

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prepare Azure resources 


You need to have a few resources ready in Azure for the migrated EC2 instances to use. These include a storage account, a vault and a virtual network.
> * Create an Azure storage account.
> * Set an Azure network. When Azure VMs are created after failover, they're joined to this Azure network.

### Create a storage account

Images of replicated machines are held in Azure storage. Azure VMs are created from the storage
when you fail over from on-premises to Azure.

1. In the [Azure portal](https://portal.azure.com) menu, click **New** -> **Storage** -> **Storage account**.
2. Enter a name for your storage account. For these tutorials we will use the name
   **contosoawsmigrated**. The name must be unique within Azure, and be between 3 and 24
   characters, witn numbers and lowercase letters only.
3. Use the **Resource Manager** deployment model.
4. Select **General purpose** > **Standard**.
5. Select the default **RA-GRS** for storage redundancy.
6. Select the subscription in which you want to create the new storage account.
7. Specify a new resource group. An Azure resource group is a logical container into which Azure
   resources are deployed and managed. For this tutorial use the name **migrateRG**.
8. Select **West Europe** as the location. 
9. Click **Create** to create the storage account.

### Create a vault

1. Sign in to the [Azure portal](https://portal.azure.com) 
2. In the left navigation, click **More services** and search for and select **Recovery Services vaults**.
2. In the Recovery Services vaults page, click **+ Add** in the upper left of the page.
3. For **Name**, type *myVault*. 
4. For **Subscription**, select the appropriate subscription.
4. For **Resource Group**, select **Use existing** and select *migrateRG*. 
5. In **Location**, select *West Europe*. 
5. To quickly access the new vault from the dashboard, select **Pin to dashboard**.
7. When you are done, click **Create**.

The new vault will appear on the **Dashboard** > **All resources**, and on the main **Recovery Services vaults** page.

### Set up an Azure network

When the Azure VMs are created from storage after the migration (failover), they're joined to this network.

1. In the [Azure portal](https://portal.azure.com) menu, click **New** > **Networking** >
   **Virtual network**
2. Leave **Resource Manager** selected as the deployment model. 
3. For **Name**, type *myMigrationNetwork*.
4. Leave the default value for **Adress space**.
5. For **Subscription**, select the appropriate subscription.
6. For **Resource group**, select **Use existing** and choose *migrateRG* from the drop-down.
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

  - In the registery, under **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System**,
    add the DWORD entry **LocalAccountTokenFilterPolicy** and set the value to 1.
	
You also need a separate EC2 instance that you can use as the Site Recovery configuration server. This instance must be running Windows Server 2012 R2. 
	
## Create the configuration server

Use an EC2 instance to create a configuration server and register it with your recovery vault.

### Before you begin 

Configure the proxy on the EC2 instance so that it can access the [Service URLs](site-recovery-support-matrix-to-azure.md#service-urls).

Download the [Microsoft Azure Site Recovery Unified Setup](http://aka.ms/unifiedinstaller_wus) program. You can download it to your local machine and then copy it over to the VM.

In the [Azure portal], go to All resources > myVault > Properties and click the **Download** button to download the **Backup Credentials**. Copy the downloaded file over the to VM to use as the **Site Recovery Registration Key**.

### Install the configuration server

On the VM, right-click installer you downloaded for the **Microsoft Azure Site Recovery Unified Setup** and select **Run as administrator**. 

	1. In **Before You Begin**, select **Install the configuration server and process server** and then click **Next**.
	2. In **Third Party Software Licesnse**, select **I accept the third party license agreement.** and then click **Next**.
	3. In **Registration**, click browse and navigate to where you put the **Backup Credentials** file and then click **Next**.
	4. In **Internet Settings**, select **Connect to Azure Site Recovery without a proxy server.** and then click **Next**.
	5. In the **Prerequisites Check** page, it will run checks for several items. When it is complete, click **Next**. 
	6. In **MySQL Configuration**, provide the required passwords and then click **Next**.
	7. In **Environment Details**, select **No** and then click **Next**.
	8. In **Install Location**, click **Next** to accept the default.
	9. In **Network Selection**, click **Next** to accept the default.
	10. In **Summary** click **Install**.
	11. **Installation Progress** will show you information about where you are in the installation process. When it is complete, click **Finish**. You may need to OK a reboot for the installation to complete. You might also get a pop-up about a passphrase, copy it to your clipbloard and save it somewhere safe.
    
On the VM, run **cspsconfigtool.exe** to create one or more management accounts on the configuration server. Make sure the management accounts have administrator permissions on the EC2 instances that you want to migrate. 




## Prepare the infrastructure

1. On the page for your vault, select **Site Recovery** from the **Getting Started** section.
2. Click **Prepare Infrastructure**.

### 1 Protection goal

Select the following values on the **Protection Goal** page:

- **Where are your machines located?** = **On-premises**.
- **Where do you want to replicate your machines?** = select **To Azure**.
- **Are your machines virtualized?** = select "Not virtualized / Other**.

When you are done, click **OK** to move to the next section.

### 2 Source Prepare

On the **Prepare source** page, choose the configuration server that you created earlier from the drop-down and then click **OK**. 

### 3 Target Prepare 

In this section you will be entering in information about the the subscription you used and the resources you created when you went through the [Prepare Azure](tutorial-prepare-azure.md) tutorial before you started this tutorial.

1. In **Subscription**, select the Azure subscription that you used for the [Prepare Azure](tutorial-prepare-azure.md) tutorial.
2. Select **Resource Manager** as the deployment model.
3. Site Recovery checks that you have one or more compatible Azure storage accounts and networks. These should be the resources you created when you went through the [Prepare Azure](tutorial-prepare-azure.md) tutorial.
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

Enable replication for each VM you want to migrate. When replication is enables, Site Recovery will install the Mobility service automatically. 

1. On the page for you vault, under **Getting Started**, click **Site Recovery**.
2. Under **For on-premises machines and Azure VMs**, click **Step 1:Replicate application**. Complete the wizerd pages with the following information and click **OK** on each page when finished:
	- 1 Source Configure:
	
		Source: On Premises
		Source location: the name of your configuration server Ec2 instance
		Machine type: Physical machines
		Process server: select the configuration server from the drop-down list
	
	- 2 Target Configure
		
		Target: leave the default
		Subscription: use the subscription you used for the [Prepare Azure](tutorial-prepare-azure.md) tutorial
		Post-failover resource group: use the resource group you created during the [Prepare Azure](tutorial-prepare-azure.md) tutorial
		Post-failover deployment model: choose Resource manager
		Storage account: choose the storage account you creating for the [Prepare Azure](tutorial-prepare-azure.md) tutorial
		Azure network: choose **Configure now for selected machines**
		Post-failover Azure network: choose the network you created for the [Prepare Azure](tutorial-prepare-azure.md) tutorial
		Subnet: select the **default** from the drop-down
	
	- 3 Physical Machines Select
		
		Click **+ Physical machine** and then enter the **Name**, the **IP Address** and **OS Type** of the Ec2 instance that you want to migrate and then click **OK**.
		
	- 4 Properties Configure Properties
		
		Select the account that you created on the configuration server from the drop-down and click **OK**.
		
	- 5 Replication Settings Configure replication settings
	
		Make sure the replication policy selected in the drop-down is **myReplicationPolicy** and then click **OK**.
		
3. When the wizard is complete, click **Enable replication**.
		

You can track progress of the **Enable Protection** job in **Settings** > **Jobs** > **Site Recovery Jobs**. After the **Finalize Protection** job runs the machine is ready for failover.		
		
When you enable replication for a VM, it can take 15 minutes or longer for changes to take effect and appear in the portal.

## Run a test failover

Run a [test failover](tutorial-dr-drill-azure.md) to make sure everything's working as expected.


## Migrate to Azure

Run a fail over for EC2 instances. 

1. In **Settings** > **Replicated items** click the AWS instances > **Failover**.
2. In **Failover** select a **Recovery Point** to fail over to. Select the latest recovery point.
3. Select **Shut down machine before beginning failover** if you want Site Recovery to attempt to do a shutdown of source virtual machines before triggering the failover. Failover continues even if shutdown fails. You can follow the failover progress on the **Jobs** page.
4. Check that the VM appears in **Replicated items**. 
5. Right-click each VM > **Complete Migration**. This finishes the migration process, stops replication for the AWS VM, and stops Site Recovery billing for the VM.

    ![Complete migration](./media/tutorial-migrate-aws-to-azure/complete-migration.png)

> [!WARNING]
> **Don't cancel a failover in progress**: Before failover is started, VM replication is stopped. If you cancel a failover in progress, failover stops, but the VM won't replicate again.  


    

## Next steps

[Learn about](site-recovery-azure-to-azure-after-migration.md) replicating Azure VMs to another region after migration to Azure.
