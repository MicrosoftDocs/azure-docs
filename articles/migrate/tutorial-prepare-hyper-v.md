---
title: Prepare to assess and migrate Hyper-V VMs to Azure with Azure Migrate | Microsoft Docs
description: Describes how to prepare for assessment and migration of on-premises Hyper-V VMs to Azure using Azure Migrate.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 05/13/2019
ms.author: raynew
ms.custom: mvc
---

# Prepare to assess and migrate Hyper-V VMs to Azure

This article describes how to prepare your on-premises environment and Azure resources so that you can migrate on-premises Hyper-V VMs to Azure with [Azure Migrate](migrate-services-overview.md)


In this tutorial, you learn how to:
> [!div class="checklist"]
> * Create an Azure subscription if you don't have one, and make sure it has the required permissions.
> * Verify on-premises Hyper-V requirements
> * Set up an account that Azure Migrate will use to discover VMs on Hyper-V hosts and clusters.
> * Create an Azure Migrate project.
> * Set up a lightweight Azure Migrate appliance that runs on-premises to discover and assess VMs. 
> * Start continuous discovery.


This article is the first tutorial in a series that shows you how to assess and migrate Hyper-V VMs. After you've completed this tutorial, you can run an assessment for Hyper-V VMs, and migrate them to Azure.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. They use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the How Tos for Hyper-V assessment and migration.


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prerequisites

Here's what you need before you can start assessing and migrating Hyper-V VMs

- **Azure account permissions**: When you log into Azure to set up discovery and assessment, your Azure account needs permission to create Azure Active Directory (Azure AD) apps.
- **Hyper-V requirements for VM migration**: Verify Hyper-V hosts are supported, and enable PowerShell remoting on each host
- **Account for discovery**: Set up a domain or local account with admin permissions on the Hyper-V hosts/cluster that Azure Migrate can use to discover the on-premises VMs.
- **Azure Migrate project** You need to set up an Azure Migrate project in the Azure portal.
- **Verify appliance requirements**: 
- **Azure Migrate appliance**: Azure Migrate runs a lightweight appliance on a Hyper-V VM. This appliance performs VM discovery and sends VM metadata and performance data to Azure Migrate. To set up the appliance you need to:<br/><br/> Verify requirements for the appliance.<br/><r/> Set up the appliance as a Hyper-V VM by downloading a compressed VM from Azure Migrate in the Azure portal.<br/><br/> Check that the appliance can reach Azure.<br/><br/> Configure the appliance for the first time, and register it with Azure Migrate.
- **Allow for VHDs on SMB**: If you run VHDs on SMB in your on-premises site, enable delegation of credentials from the appliance VM to the Hyper-V hosts/cluster running the VMs that you want to discover. This enables Azure Migrate to capture required information from the discovered machines.


## Set up Azure account permissions

Either a tenant/global admin can assign permissions to create Azure AD apps to the account, or assign the Application Developer role (that has the permissions) to the account.

### Grant account permissions

The tenant/global admin can grant permissions as follows

1. In Azure AD, the tenant/global admin should navigate to **Azure Active Directory** > **Users** > **User Settings**.
2. The admin should set **App registrations** to **Yes**.

    ![Azure AD permissions](./media/tutorial-prepare-hyper-v/aad.png)

> [!NOTE]
> This is a default setting that isn't sensitive. [Learn more](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-applications-are-added#who-has-permission-to-add-applications-to-my-azure-ad-instance).


### Assign Application Developer role 

The tenant/global admin has permissions to assign the role to the account. [Learn more](https://docs.microsoft.comazure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal).

## Verify Hyper-V host settings for VM migration

1. Make sure that Hyper-V hosts that run VMs you want to migrate are running Windows Server 2012 R2 or 2016, with the latest updates. In a cluster, all hosts should run one of these operating systems.
2. Set up PowerShell remoting on each host. To do this, run this command as an admin in the PowerShell console on the host machine: **Enable-PSRemoting -force**.

## Set up an account for VM discovery

Create an account that the Azure Migrate appliance can use to access Hyper-V hosts and cluster for VM discovery.

- A single set of credentials is required for all hosts and clusters that you want to include in the discovery.
- The account can be  a local or domain account, and needs admin privileges on Hyper-V host/cluster servers.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).


## Set up an Azure Migrate project

1. In the Azure portal, search for **Azure Migrate**.
2. In the search results, under **Services**, select **Migration projects**.
3. In **Migration projects**, click **Add**
4. In **Create migration project**, specify a project name.
1. Select the subscription and create a new resource group.
2. Specify the geography/region in which you want to create the project. You can create an Azure Migrate project in the regions summarized in the table.
    - The region specified for the project is only used to store the metadata gathered from on-premises VMs.
    - You can select any target region for the actual migration.
    
    **Geography** | **Region**
    --- | ---
    Asia | Southeast Asia
    Europe | North Europe or West Europe
    Unites States | East US or West Central US

6. Click **Create**.

    ![Create an Azure Migrate project](./media/tutorial-prepare-hyper-v/migrate-project.png)

## Verify appliance requirements

Before you set up the appliance as an on-premises Hyper-V VMs, make sure you have the following:

- The VHD you download to set up the appliance runs Hyper-V VM version 5.0.
- You need permissions to import this VM on a Hyper-V host.
- The Hyper-V host on which the appliance VM is located must be running Windows Server 2012 R2 or later, with the latest updates. 
- You should have enough capacity to allocate 16 GB RAM, four virtual processors, and one external virtual switch for the VM.
- The appliance VM can have a static or dynamic IP address.
- The appliance VM requires internet access.

## Set up the appliance VM

To set up the appliance VM for Hyper-V VM discovery and assessment, you download a zipped VHD template, and import it to the Hyper-V host to create the VM. 

Deploy the Azure Migrate appliance as a Hyper-V VM:

- The appliance discovers on-premises Hyper-V VMs, and sends VM metadata and performance data to Azure Migrate.
- To set up the appliance you download a zipped VHD file, and import it to the on-premises Hyper-V host/cluster to create a VM.

### Download the VHD

1. In the Azure Migrate dashboard, click **Discover a new site** > **Discover & Assess** > **Discover Machines**.
2. In **Discover machines** > **Are your machines virtualized?**, click **Yes, with Hyper-V**.
3. Click **Download** to download the zipped VHD.

    ![Download VM](./media/tutorial-prepare-hyper-v/download-appliance-hyperv.png)


### Verify security

Check that the zipped file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the VHD
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\AzureMigrate\AzureMigrate.ova SHA256```
3. The generated hash should match these settings.


  For OVA version 1.0.9.14

  **Algorithm** | **Hash value**
  --- | ---
  MD5 | C78457689822921B783467586AFB22B3
  SHA1 | F1338F9D9818DB61C88F8BDA1A8B5DF34B8C562D
  SHA256 | 0BE66C936BBDF856CF0CDD705719897075C0CEA5BE3F3B6F65E85D22B6F685BE

  
### Create the appliance VM

Import the downloaded file to the Hyper-V host, and create a VM from it.

1. Extract the zipped VHD file to a folder on the Hyper-V host on which you'll set up the appliance VM.
2. Open Hyper-V Manager. In **Actions**, click **Import Virtual Machine**.

    ![Deploy VHD](./media/tutorial-prepare-hyper-v/deploy-vhd.png)

2. In the Import Virtual Machine Wizard > **Before you begin**, click **Next**.
3. In **Locate Folder**, specify the folder in which the extracted VHD is located. Then click **Next**.
1. In **Select Virtual Machine**, click **Next**.
2. In **Choose Import Type**, click **Copy the virtual machine (dreate a new unique ID)**. Then click **Next**.
3. In **Choose Destination**, leave the default setting unless you want a specific location. Click **Next**.
4. In **Storage Folders**, leave the default setting unless you need to modify. Click **Next**.
5. In **Choose Network**, specify the virtual switch that the VM will use. The switch needs internet connectivity to send data to Azure.
6. In **Summary**, review settings. Then click **Finish**.
7. In Hyper-V Manager > **Virtual Machines**, start the VM.


### Verify appliance access to Azure

The appliance VM needs internet connectivity to Azure. If you're using a URL-based proxy to control outbound connectivity, make sure these URLs are allowed.

**URL** | **Reason**
--- | ---
*.portal.azure.com | Reach the Azure portal.
*.windows.net<br/><br/> *microsoftonline.com | Log in to Azure.<br/><br/>  Create Azure AD app and Service Principal objects for agent to service communications.
management.azure.com | Communicate with Azure Resource Manager to set up Azure Migrate artifacts.
dc.services.visualstudio.com | Upload app logs for internal monitoring.
*.vault.azure.net | Communication between agent and service (persistent secrets).

## Configure and register the appliance

Set up the appliance for the first time, and register it with Azure Migrate.

1. In Hyper-V Manager > **Virtual Machines**, right-click the VM > **Connect**.
2. Provide the language, time zone, and password preferences for the appliance.
3. On the desktop of the appliance VM, click the **Start discovery** shortcut to open the appliance web app. Alternatively, run the web app remotely from **https://*appliance name or IP address*:44368**. 
2. In the appliance web app, click **Check for updates** to verify that you're running the latest version of the app. If not, you can download the latest upgrade.
3. In **Set up prerequisites**, do the following:
    - **License**: Accept the license terms, and read the third-party information.
    - **Connectivity**: The app checks that the VM has internet access. If the VM accesses the internet via a proxy and not directly:
        - Click **Proxy settings**, and specify the proxy address and listening port, in the form http://ProxyIPAddress or http://ProxyFQDN.
        - Specify credentials if the proxy needs authentication.
        - Only HTTP proxy is supported.
        - The collector checks that the collector service is running. The service is installed by default on the collector VM.
    - **Time sync**: The time on the appliance should be in sync with internet time for discovery to function correctly.

### Register the appliance with Azure Migrate

1. Click **Log In**.
2. On the new tab, log in using the Azure credentials with the required permissions. 
3. After a successful logon, go back to the web app.
4. Select the subscription, resource group, and region in which you want to store the list of discovered VMs, and the VM metadata.
5. Select a site name. A site gathers together a group of discovered VMs.


## Start continuous discovery

Now, connect to the Hyper-V host/cluster, and start VM discovery.

1. In **User name** and **Password**, specify the account credentials that you created for the appliance to discover VMs on the Hyper-V host/cluster. Specify a friendly name for the credentials, and click **Save details**.
2. Click **Add host**, and specify the Hyper-V hosts/clusters on which you want to discover VMs. Click **Validate**. After validation, the number of VMs that can be discovered on each host/cluster is shown.
    - If validation fails for a host, reivewing the error by hovering over the icon in the **Status** column. Fix and validate again with **Validate list**.
    - To remote any hosts/clusters, select > **Delete**.
    - You can't remove a specific host from a cluster. You can only remove the entire cluster.
    - You can add a cluster even if there are issues with specific hosts in the cluster.
3. After validation, click **Save and start discovery** to kick off the discovery process.

It takes around 15 minutes for metadata of discovered VMs to appear in the portal. 

### Verify VMs in the portal

After discovery finishes, you can verify that the VMs appear in the portal. 

1. Open the Azure Migrate dashboard
2. In the **Server Assessment Service** page, click the icon that displays the count for the discovered machines. 

Note the following: 
- The appliance continuously profiles the on-premises environment and sends metadata.
- You can create as-is assessments immediately after discovery.
- For performance assessments, we recommend that you wait at least a day after discovery:
    - Collecting performance data takes time. Waiting at least a day ensures that there are enough performance data points before you run the assessment.
    - For performance data, the appliance collects real-time data points every 20 seconds for each performance metrics, and rolls them up to a single five minute data point. The appliance sends the five-minute data point to Azure every hour for assessment calculation.  
 

## Next steps

After the appliance is up and running, and continuously discovering VMs, you can:
> [!div class="nextstepaction"]
> [Run an assessment](azure-to-azure-tutorial-failover-failback.md)

## Next steps

In this tutorial, you used the Azure portal to: 
 
> [!div class="checklist"] 
> * Prepare for Hyper-V VM assessment and migration
> * Set up an Azure Migrate project
> * Set up an on-premises appliance
> * Kicked off continuous VM discovery

Continue to the next tutorial to assess Hyper-V VMs for migration to Azure

> [!div class="nextstepaction"] 
> [Assess Hyper-V VMs](./tutorial-server-assessment-hyper-v.md) 
