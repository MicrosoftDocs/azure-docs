---
title: Assess Hyper-V VMs for migration to Azure with Azure Migrate | Microsoft Docs
description: Describes how to assess on-premises Hyper-V VMs for migration to Azure using Azure Migrate.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 06/26/2019
ms.author: raynew
ms.custom: mvc
---

# Assess Hyper-V VMs with Azure Migrate Server Assessment

As you move on-premises resources to the cloud, [Azure Migrate](migrate-overview.md) helps you to discover, assess, and migrate machines and workloads to Microsoft Azure. This article describes how to assess on-premises Hyper-V VMs before migrating them to Azure.

This tutorial is the second in a series that shows you how to assess and migrate Hyper-V VMs to Azure. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up an Azure Migrate project.
> * Set up and register an Azure Migrate appliance.
> * Start continuous discovery of on-premises VMs. 
> * Group discovered VMs, and assess the group.
> * Review the assessment.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. They use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the How Tos for Hyper-V assessment and migration.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prerequisites

- Make sure that you [complete the first tutorial](tutorial-prepare-hyper-v.md) in the series to prepare Hyper-V VMs for assessment. If you don't complete the first tutorial, the instructions in this tutorial won't work.
- If you've completed the first tutorial as expected, here's what you should have set up before you continue with the steps in the article:
    - [Azure permissions](tutorial-prepare-hyper-v.md#prepare-azure) for Azure Migrate should be configured. 
    - [Hyper-V](tutorial-prepare-hyper-v.md#prepare-for-hyper-v-assessment) clusters, hosts, and VMs should be ready for assessment.

## Set up an Azure Migrate project

1. In the Azure portal > **All services**, search for **Azure Migrate**.
2. In the search results, select **Azure Migrate**.

    ![Set up Azure Migrate](./media/tutorial-assess-hyper-v/azure-migrate.png)

3. In **Overview**, click **Assess and migrate servers**.
4. Under **Discover, assess and migrate servers**, click **Assess and migrate servers**.

    ![Discover and assess servers](./media/tutorial-assess-hyper-v/assess-migrate.png)

1. In **Discover, assess and migrate servers**, click **Add tools**.
2. In **Migrate project**, select your Azure subscription, and create a resource group if you don't have one. 
3. In **Project Details**, specify the project name, and geography in which you want to create the project. You can create an Azure Migrate project in the regions summarized in the table.


    ![Create an Azure Migrate project](./media/tutorial-assess-hyper-v/migrate-project.png)

6. Click **Next**.
7. In **Select assessment tool**, select **Azure Migrate: Server Assessment** > **Next**.
8. In **Select migration tool**, select **Skip adding a migration tool for now** > **Next**.
9. In **Review + add tools**, review the settings and click **Add tools**.
10. To view the Azure Migrate project after it's created, in **Server**, click **See details for a different migrate project**.
11. In **Settings**, select the subscription and project.  **Azure Migrate: Server Assessment** will appear under **Assessment tools**.



## Set up the appliance VM

Azure Migrate runs a lightweight appliance on a Hyper-V VM. This appliance performs VM discovery and sends VM metadata and performance data to Azure Migrate. To set up the appliance you:

- Download a compressed Hyper-V VHD from the Azure portal.
- Check that the appliance can reach Azure.
- Configure the appliance for the first time, and register it with Azure Migrate.

### Download the VHD

Download the zipped VHD template.

1. Under **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, click **Discover**.
2. In **Discover machines** > **Are your machines virtualized?**, click **Yes, with Hyper-V**.
3. Click **Download** to download the VHD file.


    ![Download VM](./media/tutorial-assess-hyper-v/download-appliance-hyperv.png)


### Verify security

Check that the zipped file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the VHD
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\AzureMigrate\AzureMigrate.ova SHA256```
3. The generated hash should match these settings.


  For appliance version 1.19.05.10

  **Algorithm** | **Hash value**
  --- | ---
  SHA256 | 598d2e286f9c972bb7f7382885e79e768eddedfe8a3d3460d6b8a775af7d7f79


  
### Create the appliance VM

Import the downloaded file to the Hyper-V host, and create a VM from it.

1. Extract the zipped VHD file to a folder on the Hyper-V host on which you'll set up the appliance VM. Three folders are extracted.
2. Open Hyper-V Manager. In **Actions**, click **Import Virtual Machine**.

    ![Deploy VHD](./media/tutorial-assess-hyper-v/deploy-vhd.png)

2. In the Import Virtual Machine Wizard > **Before you begin**, click **Next**.
3. In **Locate Folder**, specify the folder in which the extracted VHD is located. Then click **Next**.
1. In **Select Virtual Machine**, click **Next**.
2. In **Choose Import Type**, click **Copy the virtual machine (create a new unique ID)**. Then click **Next**.
3. In **Choose Destination**, leave the default setting unless you want a specific location. Click **Next**.
4. In **Storage Folders**, leave the default setting unless you need to modify. Click **Next**.
5. In **Choose Network**, specify the virtual switch that the VM will use. The switch needs internet connectivity to send data to Azure.
6. In **Summary**, review settings. Then click **Finish**.
7. In Hyper-V Manager > **Virtual Machines**, start the VM.


### Verify appliance access to Azure

Ensure that the appliance VM has internet connectivity to [Azure URLs](migrate-support-matrix-hyper-v.md#assessment-appliance-url-access).

### Configure the appliance

Set up the appliance for the first time.

1. In Hyper-V Manager > **Virtual Machines**, right-click the VM > **Connect**.
2. Provide the language, time zone, and password preferences for the appliance.
3. On the desktop of the appliance VM, click the **Start discovery** shortcut to open the appliance web app. Alternatively, run the web app remotely from **https://*appliance name or IP address*: 44368**. 
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
2. On the new tab, sign in using the Azure credentials with the required permissions. 
3. After a successful sign in, go back to the web app.
4. Select the subscription in which the Azure Migrate project was created. The resource group is shown.
5. Specify a name for the appliance. The name should be alphanumeric with 14 characters or less.
6. Click **Register**.


### Delegate credentials for SMB VHDs

If you're running VHDs on SMBs, you need to enable delegation of credentials from the appliance to the Hyper-V hosts you want to discover. If you didn't [do this in the previous tutorial](tutorial-prepare-hyper-v.md#enable-credssp-on-hosts), you can do this now from the appliance, as follows:


1. On the appliance VM, run this command. We're using HyperVHost1/HyperVHost2 as example host names.

    ```
    Enable-WSManCredSSP -Role Client -DelegateComputer HyperVHost1.contoso.com HyperVHost2.contoso.com -Force
    ```

2. Alternatively, you can do this in the Local Group Policy Editor:
    - Navigate to **Computer Configuration** > **Administrative Templates** > **System** > **Credentials Delegation**.
    - Double-click **Allow Delegating Fresh Credentials** > **Enabled**. In **Options**, click **Show**.
    - Add each Hyper-V host you want to discover to the list, with **wsman/** as a prefix.
    - Double-click **Allow delegating fresh credentials with NTLM-only server authentication**.
    - Again, add each Hyper-V host you want to discover to the list, with **wsman/** as a prefix.

If you enable delegation on a cluster, Azure Migrate automatically tracks added nodes. Remember to enable CredSSP on added nodes if needed. 


## Start continuous discovery

Now, connect to the Hyper-V host/cluster, and start VM discovery.

1. In **User name** and **Password**, specify the account credentials that you created for the appliance to discover VMs on the Hyper-V host/cluster. Specify a friendly name for the credentials, and click **Save details**.
2. Click **Add host**, and specify the Hyper-V hosts/clusters on which you want to discover VMs. Click **Validate**. After validation, the number of VMs that can be discovered on each host/cluster is shown.
    - If validation fails for a host, reviewing the error by hovering over the icon in the **Status** column. Fix and validate again with **Validate list**.
    - To remote any hosts/clusters, select > **Delete**.
    - You can't remove a specific host from a cluster. You can only remove the entire cluster.
    - You can add a cluster even if there are issues with specific hosts in the cluster.
3. After validation, click **Save and start discovery** to kick off the discovery process.

It takes around 15 minutes for metadata of discovered VMs to appear in the portal. 

### Verify VMs in the portal

After discovery finishes, you can verify that the VMs appear in the portal. 

1. Open the Azure Migrate dashboard
2. In the **Server Assessment Service** page, click the icon that displays the count for the discovered machines. 

## Set up an assessment

### Assessment types

There are two types of assessments in Azure Migrate.

**Assessment type** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments that use collected performance data | VM size recommendation is based on CPU and memory utilization data.<br/><br/> Disk type recommendation (standard or premium managed disks) is on the IOPS and throughput of the on-premises disks.
**As-is** | Assessments that don't use performance data. <br/><br/>VM size recommendation is based on the on-premises VM size<br/><br> The recommended disk type is always a standard managed disk. 

#### Example
For example if you have an on-premises VM with four cores at 20% utilization, and memory of 8 GB with 10% utilization, the assessments will be as follows:

- **Performance-based assessment**:
    - Recommends cores and RAM based on core (0.8 cores), and memory (0.8 GB) utilization.
    - The assessment applies a default comfort factor of 30%.
    - VM recommendation: ~1.4 cores (0.8 x1.3) and ~1.4 GB memory.
- **As-is assessment**:
    -  Recommends a VM with 4 cores; 8 GB of memory.

### Creating assessments

The Azure Migrate appliance continuously profiles your on-premises environment, and sends metadata and performance data to Azure. Follow these best practices for creating assessments:

- **Create as-is assessments**: You can create as-is assessments immediately after discovery.
- **Create performance-based assessment**: After setting up discovery, we recommend that you wait at least a day before running a performance-based assessment:
    - Collecting performance data takes time. Waiting at least a day ensures that there are enough performance data points before you run the assessment.
    - For performance data, the appliance collects real-time data points every 20 seconds for each performance metric, and rolls them up to a single five minute data point. The appliance sends the five-minute data point to Azure every hour for assessment calculation.  
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


Create a group and run an assessment as follows:

1. On the Azure Migrate dashboard, click **Create assessment**.
2. Before you start, click **View all** to review the assessment properties.

    ![Assessment properties](./media/tutorial-assess-hyper-v/assessment-properties.png)

3. Select **Create New** to create a new group. A group gathers together one or more VMs that you want to assess together.
4. Select the machines that you want to add to the group.
5. Click **Create Assessment**, to create the group and the assessment.

    ![Create an assessment](./media/tutorial-assess-hyper-v/assessment-create.png)

1. After the assessment is created, view it in **Overview** > **Dashboard**.
2. Click **Export assessment**, to download it as an Excel file.
3. Under **Migration goals**, click **Servers**.
4. Under **Assessment tools**, click **+Discover**.

## Review an assessment

An assessment specifies:

- **Azure readiness**: Whether VMs are suitable for migration to Azure.
- **Monthly cost estimation**: The estimated monthly compute and storage costs of running VMs in Azure.
- **Monthly storage cost estimation**: Estimated costs for disk storage after migration.


### View an assessment

1. In **Migration goals** >  **Servers**, click **Assessments** in **Azure Migrate: Server Assessment**.
2. In **Assessments**, click on an assessment to open it.

    ![Assessment summary](./media/tutorial-assess-hyper-v/assessment-summary.png)


### Review Azure readiness

In **Azure readiness**, verify whether VMs are ready for migration to Azure.

1. Review the VM status:
    - Ready: Azure Migrate recommends a VM size and cost estimates for VMs in the assessment.
    - Ready with conditions: Issues and suggested remediation shown.
    - Not ready for Azure: Issues and suggested remediation shown.
    - Readiness unknown: Used when Azure Migrate can't assess readiness, due to data availability issues.

2. Click on a VM to drill down to see source VM settings, and recommended target settings.

### Review monthly cost estimates

This view shows the estimate compute and storage cost of running VMs in Azure.

1. Review the monthly compute and storage costs. Costs are aggregated for all VMs in the assessed group.
2. You can view the split between compute and storage.

    - Cost estimates are based on the size recommendations for a machine, and its disks and properties.
    - Estimated monthly costs for compute and storage are shown.
    - The cost estimation is for running the on-premises VMs as IaaS VMs. Azure Migrate doesn't consider PaaS or SaaS costs. 

### Review monthly storage cost estimates

This view shows aggregated storage costs for the group,  split over different types of storage disks.


### Review confidence rating 

When you run performance-based assessments, a confidence rating is assigned to the assessment.

- A rating from 1-star (lowest) to 5-star (highest) is awarded.
- The confidence rating helps you estimate the reliability of the size recommendations provided by the assessment.
- The confidence rating is based on the availability of data points needed to compute the assessment.
- To provide a rating Azure Migrate needs the utilization data for VM CPU/Memory, and the disk IOPS/throughput data. For each network adapter attached to a VM, Azure Migrate needs the network in/out data.
- In particular, if utilization data isn't available in vCenter Server, the size recommendation done by Azure Migrate might not be reliable. 

Depending on the percentage of data points available, the confidence ratings for an assessment are summarized in the following table.

   **Data point availability** | **Confidence rating**
   --- | ---
   0%-20% | 1 Star
   21%-40% | 2 Star
   41%-60% | 3 Star
   61%-80% | 4 Star
   81%-100% | 5 Star

If the confidence rating of an assessment is below five stars, wait at least a day and then recalculate the assessment. If there's an issue, sizing recommendations with low confidence might not be reliable. In this case, we recommend that you modify the assessment to use on-premises as-is.

## Common assessment issues

There can be a number of issues with assessments.

###  Out-of-sync assessments

If you add or remove machines from a group after you create an assessment, the assessment you created will be marked **out-of-sync**. You need to run the assessment again (**Recalculate**) to reflect the group changes.

### Outdated assessments

If there are on-premises changes to VMs that are in a group that's been assessed, the assessment is marked **outdated**. To reflect the changes, run the assessment again.

### Missing data points

An assessment might not have all the data points for a number of reasons:

- VMs might be powered off during the assessment and performance data isn't collected. 
- VMs might be created during the month on which performance history is based, thus their performance data is less than a month. 
- The assessment was created immediately after discovery. In order to gather performance data for a specified amount of time, you need to wait the specified amount of time before you run an assessment. For example, if you want to assess performance data for a week, you need to wait a week after discovery. If you don't the assessment won't get a five-star rating. 




## Next steps

In this tutorial, you:
 
> [!div class="checklist"] 
> * Set up an Azure Migrate appliance
> * Created and reviewed an assessment

Continue to the next tutorial to migrate Hyper-V VMs to Azure

> [!div class="nextstepaction"] 
> [Migrate Hyper-V VMs](./tutorial-migrate-hyper-v.md) 


