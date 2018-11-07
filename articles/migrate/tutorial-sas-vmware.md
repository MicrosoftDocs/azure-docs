---
title: Discover and assess on-premises VMware VMs for migration to Azure with the Azure Migrate Server Assessment Service | Microsoft Docs
description: Describes how to discover and assess on-premises VMware VMs for migration to Azure, using the Azure Migrate Server Assessment Service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 11/06/2018
ms.author: raynew
ms.custom: mvc
---

# Discover and assess on-premises VMware VMs for migration to Azure with the Server Assessment Service

As you move on-premises resources to the cloud, [Azure Migrate](migrate-overview.md) services help you to discover, assess, and migrate machines and workloads to Microsoft Azure. This article describes how to assess on-premises VMware VMs using the Azure Migrate Server Assessment Service to do the following:

- Assess suitability: Check whether VMware VMs can be migrated to Azure.
- Estimate sizing: Do performance-based sizing to figure out what VM sizes will be needed in Azure.
- Estimate costs: Figure out how much it will cost to run migrated machines in Azure.

> [!NOTE]
> The Azure Migrate Server Assessment service is currently in public preview. If you don't want to use this preview, you can assess VMware VMs using the earlier General Availability (GA) version of Azure Migrate. [Learn more](tutorial-assessment-vmware.md).


In this tutorial, you learn how to set up assessment for Azure VMs:

> [!div class="checklist"]
> * Create an Azure subscription if you don't have one, and make sure it has the correct permissions.
> * Create an account on the vCenter Server so that the Azure Migrate appliance can discover VMware VMs.
> * Create the appliance VM by downloading the OVF template, and importing it to vCenter Server to create the VM. Make sure the the appliance VM can connect to the required Azure Migrate URLs.
> * Set up the appliance for the first time, and start discovery. Verify that the discovered VMs appear in the Azure portal.
> * Group VMs and start an assessment for the group.
> * Review the assessment to plan your VM migration.


## Before you start

We recommend you do the following before you start this tutorial:

- [Learn about](migrate-overview.md#azure-migrate-services-public-preview) the public preview features.
- Learn about the service architecture for [VMware](migrate-overview.md#vmware-architecture), and [new features](migrate-overview.md#azure-migrate-services-public-preview).
- Review limitations for this public preview.


If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prerequisites

- **Azure account permissions**: When you log into Azure to set up discovery and assessment, your Azure account needs permission to create Azure Active Directory (Azure AD) apps.
- **VMware requirements**: The VMs that you want to discover and assess must be managed by vCenter Server version 5.5, 6.0, or 6.5. Additionally, you need an ESXi host with version 5.0 or higher to deploy the Azure Migrate appliance.
- **vCenter Server account**: You need a read-only account to access the vCenter Server. Azure Migrate uses this account to discover the on-premises VMs.
- **Appliance connectivity**: The Azure Migrate appliance that you deploy on a VMware VM needs internet activity to connect to Azure.


## Set up Azure permissions

Either a tenant/global admin assigns an account permissions to create Azure AD apps, or the Application Developer role (that has the permissions) can be assigned to the account.

### Grant account permissions

The tenant/global admin can grant permissions as follows

1. In Azure AD, the tenant/global admin should navigate to **Azure Active Directory** > **Users** > **User Settings**.
2. The admin should set **App registrations** to **Yes**.

    ![Azure AD permissions](./media/tutorial-sas-vmware/aad.png)

This is a default setting that isn't sensitive. [Learn more](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-applications-are-added#who-has-permission-to-add-applications-to-my-azure-ad-instance).

### Assign Application Developer role 

As an alternative, with the Application Developer role assigned, the account can create Azure AD apps. The tenant or global admin has permissions to assign this role. [Learn more](https://docs.microsoft.comazure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal).



## Set up a vCenter Server account

Azure Migrate needs access to VMware servers to automatically discover VMs for assessment. Before you deploy Azure Migrate, prepare a VMware account with the following properties:

- User type: At least a read-only user.
- Permissions: Data Center object –> Propagate to Child Object, role=Read-only
- Details: User assigned at datacenter level, and has access to all the objects in the datacenter.
- To restrict access, assign the No access role with the Propagate to child object, to the child objects (vSphere hosts, datastores, VMs, and networks).


## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Open Azure Migrate

1. In the Azure portal, click **All services**.
2. Search for **Azure Migrate**, and select **Azure Migrate - PREVIEW**  in the search results. This opens the Azure Migrate dashboard.


## Set up the Azure Migrate appliance VM

Azure Migrate creates an on-premises VM known as the Azure Migrate appliance. The appliance discovers on-premises VMware VMs, and sends metadata about them to Azure Migrate. To set up the appliance, you download an OVA template file, and import it to the on-premises vCenter server to create a VM.

### Download the OVA template

1. In the Azure Migrate dashboard, click **Discover a new site** > **Discover & Assess** > **Discover Machines**.
2. In **Discover machines** > **Are your machines virtualized?**, click **Yes, with VMWare vSphere hypervisor**.
3. Click **Download** to download the .OVA template file.

    ![Download .ova file](./media/tutorial-sas-vmware/download-appliance.png)


### Verify security

Check that the .OVA file is secure, before you deploy it.

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

Import the downloaded file to the vCenter Server, and create a VM from it.

1. In the vSphere Client console, click **File** > **Deploy OVF Template**.

    ![Deploy OVF](./media/tutorial-sas-vmware/deploy-ovf.png)

2. In the Deploy OVF Template Wizard > **Source**, specify the location of the .ova file.
3. In **Name** and **Location**, specify a friendly name for the collector VM, and the inventory object in which the VM
will be hosted.
5. In **Host/Cluster**, specify the host or cluster on which the collector VM will run.
7. In **Storage**, specify the storage destination for the collector VM.
8. In **Disk Format**, specify the disk type and size.
9. In **Network Mapping**, specify the network to which the collector VM will connect. The network needs internet connectivity, to send metadata to Azure.
10. Review and confirm the settings, then click **Finish**.


### Verify internet connectivity

The appliance VM needs internet connectivity to Azure. If you're using a URL-based proxy to control outbound connectivity, make sure these URLs are allowed.

**URL** | **Requirement**
--- | ---
*.portal.azure.com | Reach the Azure portal.
*.windows.net<br/><br/> *microsoftonline.com | Log in to Azure.<br/><br/>  Create Azure AD app and Service Principal objects for agent to service communications.
management.azure.com | Communicate with Azure Resource Manager to set up Azure Migrate artifacts.
dc.services.visualstudio.com | Upload app logs for internal monitoring.
*.vault.azure.net | Communication between agent and service (persistent secrets).

## Set up the appliance and start discovery

### Set up the appliance 

1. In the vSphere Client console, right-click the VM > **Open Console**.
2. Provide the language, time zone, and password preferences for the appliance.
3. On the desktop of the appliance VM, click the **Start discovery** shortcut. Alternatively, run remotely from **https://*appliance name or IP address*:44368**. 
4. Click **Check for updates** to verify that you're running the latest version of the app. If not, you can download the latest upgrade.
5. In **Set up prerequisites**, do the following:
    - **License**: Accept the license terms, and read the third-party information.
    - **Connectivity**: The app checks that the VM has internet access. If the VM accesses the internet via a proxy and not directly:
        - Click **Proxy settings**, and specify the proxy address and listening port, in the form http://ProxyIPAddress or http://ProxyFQDN.
        - Specify credentials if the proxy needs authentication.
        - Only HTTP proxy is supported.
        - The collector checks that the collector service is running. The service is installed by default on the collector VM.
    - **Time sync**: The time on the appliance should be in sync with internet time for discovery to function correctly.

### Register the appliance with Azure Migrate

Click **Log In**.
1. On the new tab, log in using the Azure credentials with the required permissions. 
2. After a successful logon, go back to the web app.
3. Select the subscription, resource group, and region in which you want to store the list of discovered VMs, and the VM metadata.
4. Select a site name. A site gathers together a group of discovered VMs.


### Start discovery

Now connect to the vCenter Server and start discovery. 

1. In **Specify vCenter Server details**, do the following:
    - Specify the name (FQDN) or IP address of the vCenter server. You can leave the default port, or specify a custom port on which your vCenter Server listens.
    - In **User name** and **Password**, specify the read-only account credentials that the appliance will use to discover VMs on the vCenter server.
    - In **Collection scope**, select a scope for VM discovery. The collector discovers VMs within the specified scope. Scope can be set to a specific folder, datacenter, or cluster.
2. Click **Validate connection** to make sure that the appliance can connect to vCenter Server.
3. After the connection is established, click **Save** > **Start discovery**.

It takes around 15 minutes for metadata for discovered VMs to appear in the portal. You can then run assessments. We recommend that you wait at least a day to create performance-based assessments, so that data can be collected.

### Verify VMs in the portal

After discovery you can view the VMs in the Azure portal, as follows:

1. Open the Azure Migrate dashboard
2. In the **Server Assessment Service** page, click the icon that displays the count for the discovered machines. 

Note the following: 
- The appliance continuously profiles the on-premises environment and sends metadata.
- For performance data, the appliance collects real-time data points every 20 seconds for each performance metrics, and rolls them up to a single single five minute data point, and sends it to Azure for assessment calculation.  
- [Learn more](https://docs.microsoft.com/azure/migrate/concepts-collector#what-data-is-collected) about the data that's collected by the appliance. 


## Assess machines

After VMs are discovered, you can assess them. There are two types of assessments you can run.

**Assessment** | **Details**
--- | ---
**Performance-based assessment** | Azure Migrate recommends a VM size based on the utilization data for CPU and memory.<br/><br/> Azure Migrate recommends disk types (standard or premium managed disks) based on the IOPS and throughput of the on-premises disks disks.
**As-is assessment** | Azure Migrate doesn't use performance data for recommendations.<br/><br/>It recommends a VM size based on the on-premises VM size<br/><br> It always recommends a standard managed disk. 
**Example assessment**/<br/> 4-core (20% utilization)<br/><br/> 8 GB RAM (10% utilization) | Performance-based assessment will base effective number of cores on core utilization (0.8 cores), and memory (0.8 GB) on RAM utilization. It will apply a default comfort factor of 30% to recommend Azure VM with ~1.4 cores (0.8 x1.3) and ~1.4 GB memory.<br/><br/> In an as-is assessment, the recommendation would be for a VM with 4 cores and 8 GB of memory.

### Before you start
Note the following:

- Assessments are a point-in-time snapshot of the data available in Azure Migrate at the time. They aren't automatically updated with the latest data.
- To update an assessment with the latest data, you need to recalculate the assessment.
- You can create as-is assessments immediately after discovery.
- For performance assessments, we recommend that you wait at least a day after discovery:
    - Performance metrics of each VM are updated every hour.
    - Collecting performance data takes time. Waiting at least a day ensures that there are enough performance data points before you run the assessment.

### Create an assessment.

1. On the Azure Migrate dashboard, click **Assess Servers**.
2. Click **View all** to review the assessment properties.
3. To create the group of VMs, specify a group name.
4. Select the machines that you want to add to the group.
5. Click **Create Assessment**, to create the group and the assessment.
6. After the assessment is created, view it in **Overview** > **Dashboard**.
7. Click **Export assessment**, to download it as an Excel file.


## Review the assessment

An assessment includes information about whether the on-premises VMs are suitable for migration to Azure, the right Azure VM size for the machine, and the estimated monthly Azure costs.

![Assessment report](./media/tutorial-assessment-vmware/assessment-report.png)

#### Review readiness

The Azure readiness view in the assessment shows the readiness status of each VM. Depending on the properties of the VM, each VM can be marked as:
- Ready for Azure
- Conditionally ready for Azure
- Not ready for Azure
- Readiness unknown

For VMs that are ready, Azure Migrate recommends a VM size in Azure. The size recommendation done by Azure Migrate depends on the sizing criterion specified in the assessment properties. If the sizing criterion is performance-based sizing, the size recommendation is done by considering the performance history of the VMs (CPU and memory) and disks (IOPS and throughput). If the sizing criterion is 'as on-premises', Azure Migrate does not consider the performance data for the VM and disks. The recommendation for the VM size in Azure is done by looking at the size of the VM on-premises and the disk sizing is done based on the Storage type specified in the assessment properties (default is premium disks). [Learn more](concepts-assessment-calculation.md) about how sizing is done in Azure Migrate.

For VMs that aren't ready or conditionally ready for Azure, Azure Migrate explains the readiness issues, and provides remediation steps.

The VMs for which Azure Migrate cannot identify Azure readiness (due to data unavailability) are marked as readiness unknown.

In addition to Azure readiness and sizing, Azure Migrate also suggests tools that you can use for the migrating the VM. This requires a deeper discovery of on the on-premises environment. [Learn more](how-to-get-migration-tool.md) about how you can do a deeper discovery by installing agents on the on-premises machines. If the agents are not installed on the on-premises machines, lift and shift migration is suggested using [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-overview). If the agents are installed on the on-premises machine, Azure Migrate looks at the processes running inside the machine and identifies whether the machine is a database machine or not. If the machine is a database machine, [Azure Database Migration Service](https://docs.microsoft.com/azure/dms/dms-overview) is suggested, else Azure Site Recovery is suggested as the migration tool.

  ![Assessment readiness](./media/tutorial-assessment-vmware/assessment-suitability.png)  

#### Monthly cost estimate

This view shows the total compute and storage cost of running the VMs in Azure along with the details for each machine. Cost estimates are calculated considering the size recommendations done by Azure Migrate for a machine, its disks, and the assessment properties.

> [!NOTE]
> The cost estimation provided by Azure Migrate is for running the on-premises VMs as Azure Infrastructure as a service (IaaS) VMs. Azure Migrate does not consider any Platform as a service (PaaS) or Software as a service (SaaS) costs.

Estimated monthly costs for compute and storage are aggregated for all VMs in the group.

![Assessment VM cost](./media/tutorial-assessment-vmware/assessment-vm-cost.png)

#### Confidence rating

Each performance-based assessment in Azure Migrate is associated with a confidence rating that ranges from 1 star to 5 star (1 star being the lowest and 5 star being the highest). The confidence rating is assigned to an assessment based on the availability of data points needed to compute the assessment. The confidence rating of an assessment helps you estimate the reliability of the size recommendations provided by Azure Migrate. Confidence rating is not applicable to as on-premises assessments.

For performance-based sizing, Azure Migrate needs the utilization data for CPU, memory of the VM. Additionally, for every disk attached to the VM, it needs the disk IOPS and throughput data. Similarly for each network adapter attached to a VM, Azure Migrate needs the network in/out to do performance-based sizing. If any of the above utilization numbers are not available in vCenter Server, the size recommendation done by Azure Migrate may not be reliable. Depending on the percentage of data points available, the confidence rating for the assessment is provided as below:

   **Availability of data points** | **Confidence rating**
   --- | ---
   0%-20% | 1 Star
   21%-40% | 2 Star
   41%-60% | 3 Star
   61%-80% | 4 Star
   81%-100% | 5 Star

An assessment may not have all the data points available due to one of the following reasons:

**One-time discovery**

- The statistics setting in vCenter Server is not set to level 3. Since the one-time discovery model depends on the statistics settings of vCenter Server, if the statistics setting in vCenter Server is lower than level 3, performance data for disk and network is not collected from vCenter Server. In this case, the recommendation provided by Azure Migrate for disk and network is not utilization-based. Without considering the IOPS/throughput of the disk, Azure Migrate cannot identify if the disk will need a premium disk in Azure, hence, in this case, Azure Migrate recommends Standard disks for all disks.
- The statistics setting in vCenter Server was set to level 3 for a shorter duration before kicking off the discovery. For example, let's consider the scenario where you change the statistics setting level to 3 today and kick off the discovery using the collector appliance tomorrow (after 24 hours). If you are creating an assessment for one day, you have all the data points and the confidence rating of the assessment would be 5 star. But if you are changing the performance duration in the assessment properties to one month, the confidence rating goes down as the disk and network performance data for the last one month would not be available. If you would like to consider the performance data of last one month, it is recommended that you keep the vCenter Server statistics setting to level 3 for one month before you kick off the discovery.

**Continuous discovery**

- You did not profile your environment for the duration for which you are creating the assessment. For example, if you are creating the assessment with performance duration set to 1 day, you need to wait for at least a day after you start the discovery for all the data points to get collected.

**Common reasons**  

- Few VMs were shut down during the period for which the assessment is calculated. If any VMs were powered off for some duration, we will not be able to collect the performance data for that period.
- Few VMs were created in between the period for which the assessment is calculated. For example, if you are creating an assessment for the performance history of last one month, but few VMs were created in the environment only a week ago. In such cases, the performance history of the new VMs will not be there for the entire duration.

> [!NOTE]
> If the confidence rating of any assessment is below 4 Stars, for one-time discovery model, we recommend you to change the vCenter Server statistics settings level to 3, wait for the duration that you want to consider for assessment (1 day/1 week/1 month)  and then do discovery and assessment. For the continuous discovery model, wait for at least a day for the appliance to profile the environment and then *Recalculate* the assessment. If the preceding cannot be done , performance-based sizing may not be reliable and it is recommended to switch to *as on-premises sizing* by changing the assessment properties.

## Next steps

- [Learn](how-to-modify-assessment.md) how to customize an assessment based on your requirements.
- Learn how to create high-confidence assessment groups using [machine dependency mapping](how-to-create-group-machine-dependencies.md)
- [Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
- [Learn](how-to-scale-assessment.md) how to discover and assess a large VMware environment.
- [Learn more](resources-faq.md) about the FAQs on Azure Migrate
