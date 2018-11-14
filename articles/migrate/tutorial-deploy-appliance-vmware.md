---
title: Deploy the Azure Migrate appliance for discovery, assessment, and migration of VMware VMs to Azure with the Azure Migrate  | Microsoft Docs
description: Describes how to deploy the Azure Migrate appliance to discover, assess, and migrate on-premises VMware VMs to Azure, using Azure Migrate Server Assessment and Server Migration.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 11/14/2018
ms.author: raynew
ms.custom: mvc
---

# Deploy the Azure Migrate appliance for VMware VM assessment and migration 

As you move on-premises resources to the cloud, use [Azure Migrate](migrate-overview.md) to discover, assess, and migrate machines and workloads to Microsoft Azure. This article describes how to set up the Azure Migrate appliance to discover, assess, and migrate on-premises VMware VMs to Azure. After the appliance is deployed, you can run assessments and begin migration.

> [!NOTE]
> This article describes how to set up the appliance for use with Azure Migrate Server Assessment and Server Migration. This version of Azure Migrate is currently in public preview. If you're using the earlier General Availability (GA) version of Azure Migrate, you set up the appliance as described in [this article](tutorial-assessment-vmware.md).


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure subscription if you don't have one, and make sure it has the correct permissions.
> * Create an account on the vCenter Server so that the Azure Migrate can discover VMware VMs.
>   Azure Migrate uses the Azure Migrate appliance for discovery and assessment. The appliance runs on a VMware VM. Create the appliance VM by downloading the OVF template, and importing it to vCenter Server to create the VM. Make sure the the VM can connect to Azure Migrate URLs.
> * Set up the appliance for the first time, and register it with Azure Migrate.
> * Start discovery. 

## Before you start

We recommend you do the following before you start:

- Review the [new features and limitations](migrate-overview.md#azure-migrate-services-public-preview) for Server Assessment.
- Learn about [VMware](migrate-overview.md#vmware-architecture) assessment architecture and processes.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prerequisites

- **Azure account permissions**: When you log into Azure to set up discovery and assessment, the Azure account needs permission to create Azure Active Directory (Azure AD) apps.
- **VMware requirements**: The VMs that you want to discover and assess must be managed by vCenter Server version 5.5, 6.0, or 6.5. Additionally, you need an ESXi host with version 5.0 or higher to deploy the Azure Migrate appliance.
- **vCenter Server account**: You need a read-only account to access the vCenter Server. Azure Migrate uses this account to discover the on-premises VMs.
- **Appliance**: The Azure Migrate appliance that you deploy on a VMware VM needs internet activity to connect to Azure.


## Set up Azure permissions

Either a tenant/global admin can assign permissions to create Azure AD apps to the account, or assign the Application Developer role (that has the permissions) to the account.

### Grant account permissions

The tenant/global admin can grant permissions as follows

1. In Azure AD, the tenant/global admin should navigate to **Azure Active Directory** > **Users** > **User Settings**.
2. The admin should set **App registrations** to **Yes**.

    ![Azure AD permissions](./media/tutorial-deploy-appliance-vmware/aad.png)

> [!NOTE]
> This is a default setting that isn't sensitive. [Learn more](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-applications-are-added#who-has-permission-to-add-applications-to-my-azure-ad-instance).



### Assign Application Developer role 

The tenant/global admin has permissions to assign the role to the account. [Learn more](https://docs.microsoft.comazure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal).



## Set up a vCenter Server account

Azure Migrate needs access the vCenter Server to discover VMs for assessment. Before you deploy Azure Migrate, prepare a VMware account with the following properties:

- User type: At least a read-only user.
- Permissions: Data Center object –> Propagate to Child Object, role=Read-only
- Details: User assigned at datacenter level, and has access to all the objects in the datacenter.
- To restrict access, assign the No access role with the Propagate to child object, to the child objects (vSphere hosts, datastores, VMs, and networks).


## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Open Azure Migrate

1. In the Azure portal, click **All services**.
2. Search for **Azure Migrate**, and select **Azure Migrate - PREVIEW**  in the search results. This opens the Azure Migrate dashboard.


## Set up the appliance VM

Deploy the Azure Migrate appliance as a VMware VM:

- The appliance discovers on-premises VMware VMs, and sends VM metadata and performance data to Azure Migrate.
- To set up the appliance, you download an OVA template file, and import it to vCenter Server to create a VM.

### Download the OVA template

1. In the Azure Migrate dashboard, click **Discover a new site** > **Discover & Assess** > **Discover Machines**.
2. In **Discover machines** > **Are your machines virtualized?**, click **Yes, with VMWare vSphere hypervisor**.
3. Click **Download** to download the .OVA template file.

    ![Download .ova file](./media/tutorial-deploy-appliance-vmware/download-appliance.png)


### Verify OVA security

Check that the OVA file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the OVA:
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

Import the downloaded OVA file to vCenter Server, and create a VM from it.

1. In the vSphere Client console, click **File** > **Deploy OVF Template**.

    ![Deploy OVF](./media/tutorial-deploy-appliance-vmware/deploy-ovf.png)

2. In the Deploy OVF Template Wizard > **Source**, specify the location of the OVA file.
3. In **Name** and **Location**, specify a friendly name for the VM, and the inventory object in which the VM
will be hosted.
5. In **Host/Cluster**, specify the host or cluster on which the VM will run.
6. In **Storage**, specify the storage destination for the VM.
7. In **Disk Format**, specify the disk type and size.
8. In **Network Mapping**, specify the network to which the  VM will connect. The network needs internet connectivity, to send metadata to Azure.
9. Review and confirm the settings, then click **Finish**.


### Verify internet connectivity

The appliance VM needs internet connectivity to Azure. If you're using a URL-based proxy to control outbound connectivity, make sure these URLs are allowed.

**URL** | **Requirement**
--- | ---
*.portal.azure.com | Reach the Azure portal.
*.windows.net<br/><br/> *microsoftonline.com | Log into Azure.<br/><br/>  Create Azure AD app and Service Principal objects for agent to service communications.
management.azure.com | Communicate with Azure Resource Manager to set up Azure Migrate artifacts.
dc.services.visualstudio.com | Upload app logs for internal monitoring.
*.vault.azure.net | Communication between agent and service (persistent secrets).

### Configure the appliance

Set up the appliance for the first time, and register it with Azure Migrate.

1. In the vSphere Client console, right-click the VM > **Open Console**.
2. Provide the language, time zone, and password preferences for the appliance.
3. On the desktop of the appliance VM, click the **Start discovery** shortcut to open the appliance web app. Alternatively, run the app remotely from **https://*appliance name or IP address*:44368**. 
4. In the appliance web app, click **Check for updates** to verify that you're running the latest version of the app. If not, you can download the latest upgrade.
5. In **Set up prerequisites**, do the following:
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


## Start discovery

Now connect to the vCenter Server and start discovery. 

1. In **Specify vCenter Server details**, do the following:
    - Specify the name (FQDN) or IP address of the the vCenter Server. You can leave the default port, or specify a custom port on which your vCenter Server listens.
    - In **User name** and **Password**, specify the read-only account credentials that the appliance will use to discover VMs on the vCenter server.
    - In **Collection scope**, select a scope for VM discovery. The collector discovers VMs within the specified scope. Scope can be set to a specific folder, datacenter, or cluster.
2. Click **Validate connection** to make sure that the appliance can connect to vCenter Server.
3. After the connection is established, click **Save** > **Start discovery**.

It takes around 15 minutes for metadata of discovered VMs to appear in the portal. 

## Verify VMs in the portal

After discovery you can verify that the VMs appear in the Azure portal, as follows:

1. Open the Azure Migrate dashboard
2. In the **Server Assessment Service** page, click the icon that displays the count for the discovered machines. 

Note the following: 
- The appliance continuously profiles the on-premises environment and sends metadata.
- You can create as-is assessments immediately after discovery.
- For performance assessments, we recommend that you wait at least a day after discovery:
    - Collecting performance data takes time. Waiting at least a day ensures that there are enough performance data points before you run the assessment.
    - For performance data, the appliance collects real-time data points every 20 seconds for each performance metrics, and rolls them up to a single five minute data point. The appliance sends the five-minute data point to Azure every hour for assessment calculation.  
 

## Next steps

After discovery, you can run assessments, and migrate VMware VMs to Azure:

- [Learn](tutorial-server-assessment-vmware.md) how to create assessments for VMware VMs.
- [Learn](tutorial-server-migration-vmware.md) how to migrate VMware VMs to Azure
- [Learn more](https://docs.microsoft.com/azure/migrate/concepts-collector#what-data-is-collected) about the data that's collected by the appliance.

