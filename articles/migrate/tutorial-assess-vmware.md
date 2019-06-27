---
title: Assess VMware VMs for migration to Azure with Azure Migrate
description: Describes how to assess on-premises VMware VMs for migration to Azure using Azure Migrate.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 06/24/2019
ms.author: raynew
---

# Assess VMware VMs with Azure Migrate Server Assessment

[Azure Migrate](migrate-services-overview.md) helps you to discover, assess, and migrate machines and workloads to Microsoft Azure. This article describes how to assess on-premises VMware VMs before migration. 

This tutorial is the second in a series that shows you how to assess and migrate VMware VMs to Azure using [Azure Migrate](migrate-services-overview.md) server assessment and migration. 

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Set up a Azure Migrate project.
> * Set up a Azure Migrate appliance that runs on-premises to assess VMs.
> * Start continuous discovery of on-premises VMs. The appliance sends metadata and performance data for discovered VMs to Azure.
> * Group discovered VMs, and assess the VM group.
> * Review the assessment.



> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. They use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the How Tos for VMware VM assessment and migration.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prerequisites

- Make sure that you [complete the first tutorial](tutorial-prepare-hyper-v.md) in the series to prepare VMware VMs for assessment. If you don't complete the first tutorial, the instructions in this tutorial won't work.
- If you've completed the first tutorial as expected, here's what you should have set up before you continue with the steps in the article:
    - [Azure permissions](tutorial-prepare-vmware.md#prepare-azure) for Azure Migrate should be configured. 
    - [VMware settings](tutorial-prepare-vmware.md#prepare-for-vmware-vm-assessment) should be verified, and you should have permissions to create a VM with an OVA template. You should have an account set up for VM discovery. Required ports should be available, and the appliance should to able to access Azure URLs.


## Set up an Azure Migrate project

Set up a new Azure Migrate project as follows.

1. In the Azure portal > **All services**, search for **Azure Migrate**.
2. Under **Services**, select **Azure Migrate**.

    ![Set up Azure Migrate](./media/tutorial-assess-vmware/azure-migrate.png)

3. In **Overview**, click **Assess and migrate servers**.
4. Under **Discover, assess and migrate servers**, click **Assess and migrate servers**.

    ![Discover and assess servers](./media/tutorial-assess-vmware/assess-migrate.png)

1. In **Discover, assess and migrate servers**, click **Add tools**.
2. In **Migrate project**, select your Azure subscription, and create a resource group if you don't have one. Remember that a new group requires [permissions to work with the Azure Migrate service](tutorial-prepare-vmware.md#assign-role-assignment-permissions).
3. In **Project Details**, specify the project name, and geography in which you want to create the project. You can create an Azure Migrate project in the regions summarized in the table.

    - The region specified for the project is only used to store the metadata gathered from on-premises VMs.
    - You can select any target region for the actual migration.
    
        **Geography** | **Region**
        --- | ---
        Asia | Southeast Asia
        Europe | North Europe or West Europe
        United States | East US or West Central US


    ![Create an Azure Migrate project](./media/tutorial-assess-vmware/migrate-project.png)

6. Click **Next**.
7. In **Select assessment tool**, select **Azure Migrate: Server Assessment** > **Next**.
8. In **Select migration tool**, select **Skip adding a migration tool for now** > **Next**.
9. In **Review + add tools**, review the settings and click **Add tools**.
10. To view the Azure Migrate project after it's created, in **Server**, click **See details for a different migrate project**.
11. In **Settings**, select the subscription and project.  **Azure Migrate: Server Assessment** will appear under **Assessment tools**.


## Set up the appliance VM

Deploy the Azure Migrate appliance as a VMware VM:

- The appliance discovers on-premises VMware VMs, and sends VM metadata and performance data to Azure Migrate.
- To set up the appliance, you download an OVA template file, and import it to vCenter Server to create a VM.

### Download the OVA template

1. Under **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, click **Discover**.
2. In **Discover machines** > **Are your machines virtualized?**, click **Yes, with VMWare vSphere hypervisor**.
3. Click **Download** to download the .OVA template file.

    ![Download .ova file](./media/tutorial-assess-vmware/download-ova.png)


### Verify OVA security

Check that the OVA file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the OVA:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\AzureMigrate\AzureMigrate.ova SHA256```
3. The generated hash should match these settings.


  For appliance version 1.0.0.5

  **Algorithm** | **Hash value**
  --- | ---
  MD5 | ddfdf21c64af02a222ed517ce300c977

For appliance version 1.19.5.10

    SHA256 | b2f72084f06bbce3b13f17e0c7fbac3cef3f01f780e16f7be6dd825d2131bd42

  
### Create the appliance VM

Import the downloaded OVA file to vCenter Server, and create a VM from it.

1. In the vSphere Client console, click **File** > **Deploy OVF Template**.

    ![Deploy OVF](./media/tutorial-assess-vmware/deploy-ovf.png)

2. In the Deploy OVF Template Wizard > **Source**, specify the location of the OVA file.
3. In **Name** and **Location**, specify a friendly name for the VM, and the inventory object in which the VM
will be hosted.
5. In **Host/Cluster**, specify the host or cluster on which the VM will run.
6. In **Storage**, specify the storage destination for the VM.
7. In **Disk Format**, specify the disk type and size.
8. In **Network Mapping**, specify the network to which the  VM will connect. The network needs internet connectivity, to send metadata to Azure.
9. Review and confirm the settings, then click **Finish**.


### Verify internet access

Make sure that the appliance has internet access and can reach the [Azure URLs](migrate-support-matrix-vmware.md#assessment-url-access-requirements).


### Configure the appliance

Set up the appliance for the first time.

1. In the vSphere Client console, right-click the VM > **Open Console**.
2. Provide the language, time zone, and password preferences for the appliance.
3. On the desktop of the appliance VM, click the **Start discovery** shortcut to open the appliance web app. Alternatively, run the app remotely from **https://*appliance name or IP address*:44368**.
4. In the web app > **Set up prerequisites**, do the following:
    - **License**: Accept the license terms, and read the third-party information.
    - **Connectivity**: The app checks that the VM has internet access. If the VM accesses the internet via a proxy and not directly:
        - Click **Proxy settings**, and specify the proxy address and listening port, in the form http://ProxyIPAddress or http://ProxyFQDN.
        - Specify credentials if the proxy needs authentication.
        - Only HTTP proxy is supported.
    - **Time sync**: The time on the appliance should be in sync with internet time for discovery to function correctly.
    - **Install updates**: Azure Migrate checks that the latest appliance updates are installed.
    - **Install VDDK**: Azure Migrate checks that the VMWare vSphere Virtual Disk Development Kit (VDDK) is installed. Azure Migrates uses the VDDK to replicate machines during migration to Azure. Download VDDK 6.7 from VMware, and extract the downloaded zip contents to the specified location on the appliance.

### Register the appliance with Azure Migrate

1. Click **Log In**. Disable the pop-up blocker.
2. On the new tab, log in using your Azure credentials. 
3. After a successful logon, go back to the web app.
4. Select the subscription in which the Azure Migrate project was created. The resource group is shown.
5. Specify a name for the appliance. The name should be alphanumeric with 14 characters or less.
6. Click **Register**.


## Start continuous discovery

Now connect to the vCenter Server and start discovery. 

1. In **Specify vCenter Server details**, do the following:
    - Specify the name (FQDN) or IP address of the the vCenter Server. You can leave the default port, or specify a custom port on which your vCenter Server listens.
    - In **User name** and **Password**, specify the read-only account credentials that the appliance will use to discover VMs on the vCenter server. Make sure that the account has the [required permissions](migrate-support-matrix-vmware.md#assessment-vcenter-server-permissions).
    - In **Collection scope**, select a scope for VM discovery. The collector discovers VMs within the specified scope. Scope can be set to a specific folder, datacenter, or cluster.
2. Click **Validate connection** to make sure that the appliance can connect to vCenter Server.
3. After the connection is established, click **Save** > **Start discovery**.


It takes around 15 minutes for metadata of discovered VMs to appear in the portal. After setting up the appliance, it continuously discovers configuration changes such as adding and removing VMs, disks, or network adapters, and sends VM metadata and performance data to Azure Migrate.

### Verify VMs in the portal

After discovery you can verify that the VMs appear in the Azure portal, as follows:

1. Open the Azure Migrate dashboard
2. In the **Server Assessment Service** page, click the icon that displays the count for the discovered machines. 

## Set up an assessment

### Assessment types

There are two types of assessments in Azure Migrate.

**Assessment type** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments that use collected performance data | VM size recommendation is based on CPU and memory utilization data.<br/><br/> Disk type recommendation (standard or premium managed disks) is on the IOPS and throughput of the on-premises disks.
**As-is** | Assessments that don't use performance data. <br/><br/>VM size recommendation is based on the on-premises VM size<br/><br/> The recommended disk type is always a standard managed disk. 

#### Example
For example if you have an on-premises VM with four cores at 20% utilization, and memory of 8 GB with 10% utilization, the assessments will be as follows:

- **Performance-based assessment**:
    - Recommends cores and RAM based on core (0.8 cores), and memory (0.8 GB) utilization.
    - The assessment applies a default comfort factor of 30%.
    - VM recommendation: ~1.4 cores (0.8 x1.3) and ~1.4 GB memory.
- **As-is assessment**:
    -  Recommends a VM with 4 cores; 8 GB of memory.



### Assessment best practices

The Azure Migrate appliance continuously profiles your on-premises environment, and sends metadata and performance data to Azure. Follow these best practices for creating assessments:

- **Create as-is assessments**: You can create as-is assessments immediately after discovery.
- **Create performance-based assessment**: After setting up discovery, we recommend that you wait at least a day before running a performance-based assessment:
    - Collecting performance data takes time. Waiting at least a day ensures that there are enough performance data points before you run the assessment.
    - For performance data, the appliance collects real-time data points every 20 seconds for each performance metrics, and rolls them up to a single five minute data point. The appliance sends the five-minute data point to Azure every hour for assessment calculation.  
- **Get the latest data**: Assessments aren't automatically updated with the latest data. To update an assessment with the latest data, you need to rerun it. 
- **Make sure durations match**: When you're running performance-based assessments, make sure your profile your environment for the assessment duration. For example, if you create an assessment with a performance duration set to 1 week, you need to wait for at least a week after you start discovery, for all the data points to be collected. If you don't the assessment won't get a five-star rating. 
- **Avoid missing data points**: The following issues might result in missing data points in a performance-based assessment:
    - VMs are powered off during the assessment and performance data isn't collected. 
    - If you create VMs during the month on which you base performance history. the data for those VMs will be less than a month. 
    - The assessment is created immediately after discovery, or the assessment time doesn't match the performance data collection time.
- **Learn more about assessments**:
    - [Learn more](https://docs.microsoft.com/azure/migrate/concepts-collector#what-data-is-collected) about what's collected by the appliance.
    - [Learn](concepts-assessment-calculation.md) how assessments are calculated.
    - [Learn](how-to-modify-assessment.md) how to customize an assessment.
    - [Learn more](concepts-assessment-calculation.md) about how sizing works.


### Create an assessment

Create a group of VMs, and run an assessment as follows:

1. Under **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, click **Assess**.

    ![Assess](./media/tutorial-assess-vmware/assess.png)

2. In **Assess servers**, specify a name for the assessment.
3. Click **View all** to verify the settings used for the assessment. You can modify assessment settings as required.

    ![Assessment properties](./media/tutorial-assess-vmware/view-all.png)

3. In **Select or create a group**, select **Create New**, and specify a group name. A group gathers together one or more VMs that you want to assess together.
4. In **Add machines to the group**, select VMs to add to the group.
5. Click **Create Assessment**, to create the group and the assessment.

    ![Create an assessment](./media/tutorial-assess-vmware/assessment-create.png)

6. After the assessment is created, view it in **Overview** > **Azure Migrate:Server Assessment**. I
7. Click **Export assessment**, to download it as an Excel file.


> [!NOTE]
> - If you add or remove machines from a group after you create an assessment, the assessment will be marked **out-of-sync**.
> - If there are on-premises changes to VMs that are in a group that's been assessed, the assessment is marked **outdated**.
> - To reflect any changes, or to get the latest data, click **Recalculate** to rerun the assessment.

## Review an assessment

An assessment specifies:

- **Azure readiness**: Whether machines are suitable for migration to Azure.
- **Monthly compute/storage costs**: The estimated monthly compute and storage costs of running VMs in Azure.
- **Monthly storage cost estimation**: Estimated costs for storage broken down into disk type (Standard HDD/SSD, Premium).

### View an assessment

1. In **Migration goals** >  **Servers**, click **Assessments** in **Azure Migrate: Server Assessment**.
2. In **Assessments**, click on an assessment to open it.

    ![Assessment summary](./media/tutorial-assess-vmware/assessment-summary.png)

### Review Azure readiness

In **Azure readiness**, verify whether VMs are ready for migration to Azure.

1. Review the VM status:
    - Ready: Azure Migrate recommends a VM size and cost estimates for VMs in the assessment.
    - Ready with conditions: Issues and suggested remediation shown.
    - Not ready for Azure: Issues and suggested remediation.
    - Readiness unknown: Used when Azure Migrate can't assess readiness, due to data availability issues.

2. Click on a VM to drill down to see recommended Azure sizing, as well as compute, storage, and network settings.


### Review monthly cost estimates

This view shows the estimate compute and storage cost of running VMs in Azure.

1. Review the montly compute and storage costs. Costs are aggregated for all VMs in the assessed group.
2. You can view the split between compute and storage.

    - Cost estimates are based on the size recommendations for a machine, and its disks and properties.
    - Estimated monthly costs for compute and storage are shown.
    - The cost estimation is for running the on-premises VMs as IaaS VMs. Azure Migrate doesn't consider PaaS or SaaS costs. 

### Review monthly storage cost estimates

This view shows aggregated storage costs for the group,  split over different types of storage disks.


### Review confidence rating 

When you run performance-based assessments, a confidence rating is assigned to the assessment. This isn't relevant if you're running an as-is on-premises assessment.

- A rating from 1-star (lowest) to 5-star (highest) is awarded.
- The confidence rating helps you estimate the reliability of the size recommendations provided by the assessment.
- The confidence rating is based on the availability of data points needed to compute the assessment.
- To provide a rating Azure Migrate needs the utilization data for VM CPU/Memory, and the disk IOPS/throughput data. For each network adapter attached to a VM, Azure Migrate needs the network in/out data.
- In particular, if utilization data isn't available, the size recommendation done by Azure Migrate might not be reliable. 

Depending on the percentage of data points available, the confidence rating for an assessment are summarized in the following table.

   **Data point availability** | **Confidence rating**
   --- | ---
   0%-20% | 1 Star
   21%-40% | 2 Star
   41%-60% | 3 Star
   61%-80% | 4 Star
   81%-100% | 5 Star

If the confidence rating of an assessment is below five stars, wait at least a day and then recalculate the assessment. If there's an issue, sizing recommendations with low confidence might not be reliable. In this case, we recommend that you modify the assessment to use on-premises as-is.


## Next steps

In this tutorial, you:
 
> [!div class="checklist"] 
> * Set up an Azure Migrate appliance
> * Created and reviewed an assessment

Continue to the next tutorial to migrate VMware VMs to Azure

> [!div class="nextstepaction"] 
> [Migrate VMware VMs](./tutorial-migrate-vmware.md) 




