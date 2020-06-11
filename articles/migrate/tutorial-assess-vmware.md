---
title: Assess VMware VMs with Azure Migrate Server Assessment
description: Describes how to assess on-premises VMware VMs for migration to Azure using Azure Migrate Server Assessment.
ms.topic: tutorial
ms.date: 06/03/2020
ms.custom: mvc
---

# Assess VMware VMs with Server Assessment

This article shows you how to assess on-premises VMware virtual machines (VMs), using the [Azure Migrate:Server Assessment](migrate-services-overview.md#azure-migrate-server-assessment-tool) tool.


This tutorial is the second in a series that demonstrates how to assess and migrate VMware VMs to Azure. In this tutorial, you learn how to:
> [!div class="checklist"]
> * Set up an Azure Migrate project.
> * Set up an Azure Migrate appliance that runs on-premises to assess VMs.
> * Start continuous discovery of on-premises VMs. The appliance sends configuration and performance data for discovered VMs to Azure.
> * Group discovered VMs, and assess the VM group.
> * Review the assessment.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the how-to articles.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

- [Complete the first tutorial](tutorial-prepare-vmware.md) in this series. If you don't, the instructions in this tutorial won't work.
- Here's what you should have done in the first tutorial:
    - [Prepare Azure](tutorial-prepare-vmware.md#prepare-azure) to work with Azure Migrate.
    - [Prepare VMware for assessment](tutorial-prepare-vmware.md#prepare-for-assessment) for assessment. This includes checking VMware settings, setting up an account that Azure Migrate can use to access vCenter Server.
    - [Verify](tutorial-prepare-vmware.md#verify-appliance-settings-for-assessment) what you need in order to deploy the Azure Migrate appliance for VMware assessment.

## Set up an Azure Migrate project

Set up a new Azure Migrate project as follows:

1. In the Azure portal > **All services**, search for **Azure Migrate**.
1. Under **Services**, select **Azure Migrate**.
1. In **Overview**, under **Discover, assess and migrate servers**, select **Assess and migrate servers**.

   ![Button to assess and migrate servers](./media/tutorial-assess-vmware/assess-migrate.png)

1. In **Getting started**, select **Add tools**.
1. In **Migrate project**, select your Azure subscription, and create a resource group if you don't have one.     
1. In **Project Details**, specify the project name and the geography in which you want to create the project. Review supported geographies for [public](migrate-support-matrix.md#supported-geographies-public-cloud) and [government clouds](migrate-support-matrix.md#supported-geographies-azure-government).

   ![Boxes for project name and region](./media/tutorial-assess-vmware/migrate-project.png)

1. Select **Next**.
1. In **Select assessment tool**, select **Azure Migrate: Server Assessment** > **Next**.

   ![Selection for the Server Assessment tool](./media/tutorial-assess-vmware/assessment-tool.png)

1. In **Select migration tool**, select **Skip adding a migration tool for now** > **Next**.
1. In **Review + add tools**, review the settings, and select **Add tools**.
1. Wait a few minutes for the Azure Migrate project to deploy. You'll be taken to the project page. If you don't see the project, you can access it from **Servers** in the Azure Migrate dashboard.

## Set up the Azure Migrate appliance

Azure Migrate:Server Assessment uses a lightweight Azure Migrate appliance. The appliance performs VM discovery and sends VM metadata and performance data to Azure Migrate. The appliance can be set up in a number of ways.

- Set up on a VMware VM using a downloaded OVA template. This is the method used in this tutorial.
- Set up on a VMware VM or physical machine with a PowerShell installer script. [This method](deploy-appliance-script.md) should be used if you can't set up a VM using an OVA template, or if you're in Azure Government.

After creating the appliance, you check that it can connect to Azure Migrate:Server Assessment, configure it for the first time, and register it with the Azure Migrate project.


### Download the OVA template

1. In **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, select **Discover**.
1. In **Discover machines** > **Are your machines virtualized?**, select **Yes, with VMWare vSphere hypervisor**.
1. Select **Download** to download the OVA template file.

   ![Selections for downloading an OVA file](./media/tutorial-assess-vmware/download-ova.png)

### Verify security

Check that the OVA file is secure, before you deploy it:

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the OVA file:
  
   ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
   
   Example usage: ```C:\>CertUtil -HashFile C:\AzureMigrate\AzureMigrate.ova SHA256```

3. Verify the latest appliance versions and hash values:

    - For the Azure public cloud:
    
        **Algorithm** | **Download** | **SHA256**
        --- | --- | ---
        VMware (10.9 GB) | [Latest version](https://aka.ms/migrate/appliance/vmware) | cacbdaef927fe5477fa4e1f494fcb7203cbd6b6ce7402b79f234bc0fe69663dd

    - For Azure Government:
    
        **Algorithm** | **Download** | **SHA256**
        --- | --- | ---
        VMware (63.1 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2120300&clcid=0x409 ) | 3d5822038646b81f458d89d706832c0a2c0e827bfa9b0a55cc478eaf2757a4de


### Create the appliance VM

Import the downloaded file, and create a VM:

1. In the vSphere Client console, select **File** > **Deploy OVF Template**.

   ![Menu command for deploying an OVF template](./media/tutorial-assess-vmware/deploy-ovf.png)

1. In the Deploy OVF Template Wizard > **Source**, specify the location of the OVA file.
1. In **Name** and **Location**, specify a friendly name for the VM. Select the inventory object in which the VM will be hosted.
1. In **Host/Cluster**, specify the host or cluster on which the VM will run.
1. In **Storage**, specify the storage destination for the VM.
1. In **Disk Format**, specify the disk type and size.
1. In **Network Mapping**, specify the network to which the VM will connect. The network needs internet connectivity to send metadata to Azure Migrate Server Assessment.
1. Review and confirm the settings, and then select **Finish**.

## Verify appliance access to Azure

Make sure that the appliance VM can connect to Azure URLs for [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.

### Configure the appliance

Set up the appliance for the first time.

> [!NOTE]
> If you set up the appliance using a [PowerShell script](deploy-appliance-script.md) instead of the downloaded OVA, the first two steps in this procedure aren't relevant.

1. In the vSphere Client console, right-click the VM, and then select **Open Console**.
1. Provide the language, time zone, and password for the appliance.
1. Open a browser on any machine that can connect to the VM, and open the URL of the appliance web app: **https://*appliance name or IP address*: 44368**.

   Alternately, you can open the app from the appliance desktop by selecting the app shortcut.
1. In the web app > **Set up prerequisites**, do the following:
   - **License**: Accept the license terms, and read the third-party information.
   - **Connectivity**: The app checks that the VM has internet access. If the VM uses a proxy:
     - Select **Proxy settings**, and specify the proxy address and listening port in the form http://ProxyIPAddress or http://ProxyFQDN.
     - Specify credentials if the proxy needs authentication.
     - Only HTTP proxy is supported.
   - **Time sync**: The time on the appliance should be in sync with internet time for discovery to work properly.
   - **Install updates**: The appliance ensures that the latest updates are installed.
   - **Install VDDK**: The appliance checks that VMWare vSphere Virtual Disk Development Kit (VDDK) is installed. If it isn't installed, download VDDK 6.7 from VMware, and extract the downloaded zip contents to the specified location on the appliance.

     Azure Migrate Server Migration uses the VDDK to replicate machines during migration to Azure.       

### Register the appliance with Azure Migrate

1. Select **Log In**. If it doesn't appear, make sure you've disabled the pop-up blocker in the browser.
1. On the new tab, sign in by using your Azure username and password.
   
   Sign-in with a PIN isn't supported.
1. After you successfully sign in, go back to the web app.
1. Select the subscription in which the Azure Migrate project was created, and then select the project.
1. Specify a name for the appliance. The name should be alphanumeric with 14 characters or fewer.
1. Select **Register**.


## Start continuous discovery

The appliance needs to connect to vCenter Server to discover the configuration and performance data of the VMs.

### Specify vCenter Server details
1. In **Specify vCenter Server details**, specify the name (FQDN) or IP address of the vCenter Server instance. You can leave the default port or specify a custom port on which vCenter Server listens.
2. In **User name** and **Password**, specify the vCenter Server account credentials that the appliance will use to discover VMs on the vCenter Server instance. 

    - You should have set up an account with the required permissions in the [previous tutorial](tutorial-prepare-vmware.md#set-up-permissions-for-assessment).
    - If you want to scope discovery to specific VMware objects (vCenter Server datacenters, clusters, a folder of clusters, hosts, a folder of hosts, or individual VMs.), review the instructions in [this article](set-discovery-scope.md) to restrict the account used by Azure Migrate.

3. Select **Validate connection** to make sure that the appliance can connect to vCenter Server.
4. In **Discover applications and dependencies on VMs**, optionally click **Add credentials**, and specify the operating system for which the credentials are relevant, and the credentials username and password. Then click **Add**.

    - You optionally add credentials here if you've created an account to use for the [application discovery feature](how-to-discover-applications.md), or the [agentless dependency analysis feature](how-to-create-group-machine-dependencies-agentless.md).
    - If you're not using these features, you can skip this setting.
    - Review the credentials needed for [app discovery](migrate-support-matrix-vmware.md#application-discovery-requirements), or for [agentless analysis](migrate-support-matrix-vmware.md#dependency-analysis-requirements-agentless).

5. **Save and start discovery**, to kick off VM discovery.

Discovery works as follows:
- It takes around 15 minutes for discovered VM metadata to appear in the portal.
- Discovery of installed applications, roles, and features takes some time. The duration depends on the number of VMs being discovered. For 500 VMs, it takes approximately one hour for the application inventory to appear in the Azure Migrate portal.

### Verify VMs in the portal

After discovery, you can verify that the VMs appear in the Azure portal:

1. Open the Azure Migrate dashboard.
1. In **Azure Migrate - Servers** > **Azure Migrate: Server Assessment**, select the icon that displays the count for **Discovered servers**.

## Set up an assessment

You can create two types of assessments by using Azure Migrate Server Assessment:

**Assessment** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments based on collected performance data | **Recommended VM size**: Based on CPU and memory utilization data.<br/><br/> **Recommended disk type (standard or premium managed disk)**: Based on the IOPS and throughput of the on-premises disks.
**As on-premises** | Assessments based on on-premises sizing | **Recommended VM size**: Based on the on-premises VM size.<br/><br> **Recommended disk type**: Based on the storage type setting that you select for the assessment.

## Run an assessment

Run an assessment as follows:

1. Review the [best practices](best-practices-assessment.md) for creating assessments.
1. On the **Servers** tab, in the **Azure Migrate: Server Assessment** tile, select **Assess**.

   ![Location of the Assess button](./media/tutorial-assess-vmware/assess.png)

1. In **Assess servers**, specify a name for the assessment.
1. Select **View all**, and then review the assessment properties.

   ![Assessment properties](./media/tutorial-assess-vmware/view-all.png)

1. In **Select or create a group**, select **Create New**, and specify a group name. A group gathers one or more VMs together for assessment.
1. In **Add machines to the group**, select VMs to add to the group.
1. Select **Create Assessment** to create the group and run the assessment.

   ![Assess servers](./media/tutorial-assess-vmware/assessment-create.png)

1. After the assessment is created, view it in **Servers** > **Azure Migrate: Server Assessment** > **Assessments**.
1. Select **Export assessment** to download it as an Excel file.

## Review an assessment

An assessment describes:

- **Azure readiness**: Whether VMs are suitable for migration to Azure.
- **Monthly cost estimation**: The estimated monthly compute and storage costs for running the VMs in Azure.
- **Monthly storage cost estimation**: Estimated costs for disk storage after migration.

To view an assessment:

1. In **Migration goals** > **Servers**, select **Assessments** in **Azure Migrate: Server Assessment**.
1. In **Assessments**, select an assessment to open it.

   ![Assessment summary](./media/tutorial-assess-vmware/assessment-summary.png)

### Review Azure readiness

1. In **Azure readiness**, verify whether VMs are ready for migration to Azure.
1. Review the VM status:
    - **Ready for Azure**: Used when Azure Migrate recommends a VM size and cost estimates for VMs in the assessment.
    - **Ready with conditions**: Shows issues and suggested remediation.
    - **Not ready for Azure**: Shows issues and suggested remediation.
    - **Readiness unknown**: Used when Azure Migrate can't assess readiness because of data availability issues.

1. Select an **Azure readiness** status. You can view VM readiness details. You can also drill down to see VM details, including compute, storage, and network settings.

### Review cost details

The assessment summary shows the estimated compute and storage cost of running VMs in Azure. Costs are aggregated for all VMs in the assessed group. You can drill down to see cost details for specific VMs.

> [!NOTE]
> Cost estimates are based on the size recommendations for a machine, its disks, and its properties. Estimates are for running the on-premises VMs as IaaS VMs. Azure Migrate Server Assessment doesn't consider PaaS or SaaS costs.

The aggregated storage costs for the assessed group are split over different types of storage disks. 

### Review confidence rating

Azure Migrate Server Assessment assigns a confidence rating to a performance-based assessment, from one star (lowest) to five stars (highest).

![Confidence rating](./media/tutorial-assess-vmware/confidence-rating.png)

The confidence rating helps you estimate the reliability of the assessment's size recommendations. The rating is based on the availability of data points needed to compute the assessment:

**Data point availability** | **Confidence rating**
--- | ---
0%-20% | 1 star
21%-40% | 2 stars
41%-60% | 3 stars
61%-80% | 4 stars
81%-100% | 5 stars

[Learn about best practices](best-practices-assessment.md#best-practices-for-confidence-ratings) for confidence ratings.

## Next steps

In this tutorial, you set up an Azure Migrate appliance. You also created and reviewed an assessment.

To learn how to migrate VMware VMs to Azure by using Azure Migrate Server Migration, continue to the third tutorial in the series:

> [!div class="nextstepaction"]
> [Migrate VMware VMs](./tutorial-migrate-vmware.md)
