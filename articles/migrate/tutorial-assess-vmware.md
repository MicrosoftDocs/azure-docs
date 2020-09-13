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
2. Under **Services**, select **Azure Migrate**.
3. In **Overview**, under **Discover, assess and migrate servers**, select **Assess and migrate servers**.

   ![Button to assess and migrate servers](./media/tutorial-assess-vmware/assess-migrate.png)

4. In **Getting started**, select **Add tools**.
5. In **Migrate project**, select your Azure subscription, and create a resource group if you don't have one.     
6. In **Project Details**, specify the project name and the geography in which you want to create the project. Review supported geographies for [public](migrate-support-matrix.md#supported-geographies-public-cloud) and [government clouds](migrate-support-matrix.md#supported-geographies-azure-government).

   ![Boxes for project name and region](./media/tutorial-assess-vmware/migrate-project.png)

7. Select **Next**.
8. In **Select assessment tool**, select **Azure Migrate: Server Assessment** > **Next**.

   ![Selection for the Server Assessment tool](./media/tutorial-assess-vmware/assessment-tool.png)

9. In **Select migration tool**, select **Skip adding a migration tool for now** > **Next**.
10. In **Review + add tools**, review the settings, and select **Add tools**.
11. Wait a few minutes for the Azure Migrate project to deploy. You'll be taken to the project page. If you don't see the project, you can access it from **Servers** in the Azure Migrate dashboard.

## Set up the Azure Migrate appliance

Azure Migrate:Server Assessment uses a lightweight Azure Migrate appliance. The appliance performs VM discovery and sends VM metadata and performance data to Azure Migrate. The appliance can be set up in a number of ways.

- Set up on a VMware VM using a downloaded OVA template. **This is the method used in this tutorial.**
- Set up on a VMware VM or physical machine with a PowerShell installer script. [This method](deploy-appliance-script.md) should be used if you can't set up a VM using an OVA template, or if you're in Azure Government.

After creating the appliance, you check that it can connect to Azure Migrate:Server Assessment, configure it for the first time, and register it with the Azure Migrate project.


### Generate the Azure Migrate project key

1. In **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, select **Discover**.
2. In **Discover machines** > **Are your machines virtualized?**, select **Yes, with VMware vSphere hypervisor**.
3. In **1:Generate Azure Migrate project key**, provide a name for the Azure Migrate appliance that you will set up for discovery of VMware VMs.The name should be alphanumeric with 14 characters or fewer.
1. Click on **Generate key** to start the creation of the required Azure resources. Please do not close the Discover machines page during the creation of resources.
1. After the successful creation of the Azure resources, an **Azure Migrate project key** is generated.
1. Copy the key as you will need it to complete the registration of the appliance during its configuration.

### Download the OVA template
In **2: Download Azure Migrate appliance**, select the .OVA file and click on **Download**. 


   ![Selections for Discover machines](./media/tutorial-assess-vmware/servers-discover.png)


   ![Selections for Generate Key](./media/tutorial-assess-vmware/generate-key-vmware.png)


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
        VMware (11.6 GB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2140333) | e9c9a1fe4f3ebae81008328e8f3a7933d78ff835ecd871d1b17f367621ce3c74

    - For Azure Government:
    
        **Algorithm** | **Download** | **SHA256**
        --- | --- | ---
        VMware (85 MB) | [Latest version](https://go.microsoft.com/fwlink/?linkid=2140337) | 47179f47eba2842337bbe533c424dd1da56baccdcf68b1d87b71a5a4280108c2


### Create the appliance VM

Import the downloaded file, and create a VM:

1. In the vSphere Client console, select **File** > **Deploy OVF Template**.

   ![Menu command for deploying an OVF template](./media/tutorial-assess-vmware/deploy-ovf.png)

2. In the Deploy OVF Template Wizard > **Source**, specify the location of the OVA file.
3. In **Name** and **Location**, specify a friendly name for the VM. Select the inventory object in which the VM will be hosted.
4. In **Host/Cluster**, specify the host or cluster on which the VM will run.
5. In **Storage**, specify the storage destination for the VM.
6. In **Disk Format**, specify the disk type and size.
7. In **Network Mapping**, specify the network to which the VM will connect. The network needs internet connectivity to send metadata to Azure Migrate Server Assessment.
8. Review and confirm the settings, and then select **Finish**.

## Verify appliance access to Azure

Make sure that the appliance VM can connect to Azure URLs for [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.

### Configure the appliance

Set up the appliance for the first time.

> [!NOTE]
> If you set up the appliance using a [PowerShell script](deploy-appliance-script.md) instead of the downloaded OVA, the first two steps in this procedure aren't relevant.

1. In the vSphere Client console, right-click the VM, and then select **Open Console**.
2. Provide the language, time zone, and password for the appliance.
3. Open a browser on any machine that can connect to the VM, and open the URL of the appliance web app: **https://*appliance name or IP address*: 44368**.

   Alternately, you can open the app from the appliance desktop by selecting the app shortcut.
1. Accept the **license terms**, and read the third-party information.
1. In the web app > **Set up prerequisites**, do the following:
   - **Connectivity**: The app checks that the VM has internet access. If the VM uses a proxy:
     - Click on **Set up proxy** to specify the proxy address (in the form http://ProxyIPAddress or http://ProxyFQDN) and listening port.
     - Specify credentials if the proxy needs authentication.
     - Only HTTP proxy is supported.
     - If you have added proxy details or disabled the proxy and/or authentication, click on **Save** to trigger connectivity check again.
   - **Time sync**: The time on the appliance should be in sync with internet time for discovery to work properly.
   - **Install updates**: The appliance ensures that the latest updates are installed. After the check completes, you can click on **View appliance services** to see the status and versions of the components running on the appliance.
   - **Install VDDK**: The appliance checks that VMware vSphere Virtual Disk Development Kit (VDDK) is installed. If it isn't installed, download VDDK 6.7 from VMware, and extract the downloaded zip contents to the specified location on the appliance, as provided in the **Installation instructions**.

     Azure Migrate Server Migration uses the VDDK to replicate machines during migration to Azure. 
1. If you want, you can **rerun prerequisites** at any time during appliance configuration to check if the appliance meets all the prerequisites.

### Register the appliance with Azure Migrate

1. Paste the **Azure Migrate project key** copied from the portal. If you do not have the key, go to **Server Assessment> Discover> Manage existing appliances**, select the appliance name you provided at the time of key generation and copy the corresponding key.
1. Click on **Log in**. It will open an Azure login prompt in a new browser tab. If it doesn't appear, make sure you've disabled the pop-up blocker in the browser.
1. On the new tab, sign in by using your Azure username and password.
   
   Sign-in with a PIN isn't supported.
3. After you successfully logged in, go back to the web app. 
4. If the Azure user account used for logging has the right [permissions](tutorial-prepare-vmware.md#prepare-azure) on the Azure resources created during key generation, the appliance registration will be initiated.
1. After appliance is successfully registered, you can see the registration details by clicking on **View details**.


## Start continuous discovery

The appliance needs to connect to vCenter Server to discover the configuration and performance data of the VMs.

1. In **Step 1: Provide vCenter Server credentials**, click on **Add credentials** to  specify a friendly name for credentials, add **Username** and **Password** for the vCenter Server account that the appliance will use to discover VMs on the vCenter Server instance.
    - You should have set up an account with the required permissions in the [previous tutorial](tutorial-prepare-vmware.md#set-up-permissions-for-assessment).
    - If you want to scope discovery to specific VMware objects (vCenter Server datacenters, clusters, a folder of clusters, hosts, a folder of hosts, or individual VMs.), review the instructions in [this article](set-discovery-scope.md) to restrict the account used by Azure Migrate.
1. In **Step 2: Provide vCenter Server details**, click on **Add discovery source** to select the friendly name for credentials from the drop-down, specify the **IP address/FQDN** of the vCenter Server instance. You can leave the **Port** to default (443) or specify a custom port on which vCenter Server listens and click on **Save**.
1. On clicking Save, appliance will try validating the connection to the vCenter Server with the credentials provided and show the **Validation status** in the table against the vCenter Server IP address/FQDN.
1. You can **revalidate** the connectivity to vCenter Server any time before starting the discovery.
1. In **Step 3: Provide VM credentials to discover installed applications and to perform agentless dependency mapping**, click **Add credentials**, and specify the operating system for which the credentials are provided, friendly name for credentials and the **Username** and **Password**. Then click on **Save**.

    - You optionally add credentials here if you've created an account to use for the [application discovery feature](how-to-discover-applications.md), or the [agentless dependency analysis feature](how-to-create-group-machine-dependencies-agentless.md).
    - If you do not want to use these features, you can click on the slider to skip the step. You can reverse the intent any time later.
    - Review the credentials needed for [application discovery](migrate-support-matrix-vmware.md#application-discovery-requirements), or for [agentless dependency analysis](migrate-support-matrix-vmware.md#dependency-analysis-requirements-agentless).

5. Click on **Start discovery**, to kick off VM discovery. After the discovery has been successfully initiated, you can check the discovery status against the vCenter Server IP address/FQDN in the table.

Discovery works as follows:
- It takes around 15 minutes for discovered VM metadata to appear in the portal.
- Discovery of installed applications, roles, and features takes some time. The duration depends on the number of VMs being discovered. For 500 VMs, it takes approximately one hour for the application inventory to appear in the Azure Migrate portal.

### Verify VMs in the portal

After discovery, you can verify that the VMs appear in the Azure portal:

1. Open the Azure Migrate dashboard.
2. In **Azure Migrate - Servers** > **Azure Migrate: Server Assessment**, select the icon that displays the count for **Discovered servers**.

## Set up an assessment

You can create two types of assessments by using Azure Migrate Server Assessment:

**Assessment Type** | **Details**
--- | --- 
**Azure VM** | Assessments to migrate your on-premises servers to Azure virtual machines. <br/><br/> You can assess your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md), [Hyper-V VMs](how-to-set-up-appliance-hyper-v.md), and [physical servers](how-to-set-up-appliance-physical.md) for migration to Azure using this assessment type. [Learn more](concepts-assessment-calculation.md)
**Azure VMware Solution (AVS)** | Assessments to migrate your on-premises servers to [Azure VMware Solution (AVS)](../azure-vmware/introduction.md). <br/><br/> You can assess your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md) for migration to Azure VMware Solution (AVS) using this assessment type. [Learn more](concepts-azure-vmware-solution-assessment-calculation.md)

Server Assessment provides two sizing criteria options:

**Sizing criteria** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments that make recommendations based on collected performance data | **Azure VM assessment**: VM size recommendation is based on CPU and memory utilization data.<br/><br/> Disk type recommendation (standard HDD/SSD or premium-managed disks) is based on the IOPS and throughput of the on-premises disks.<br/><br/> **Azure VMware Solution (AVS) assessment**: AVS nodes recommendation is based on CPU and memory utilization data.
**As-is on-premises** | Assessments that don't use performance data to make recommendations. | **Azure VM assessment**: VM size recommendation is based on the on-premises VM size<br/><br> The recommended disk type is based on what you select in the storage type setting for the assessment.<br/><br/> **Azure VMware Solution (AVS) assessment**: AVS nodes recommendation is based on the on-premises VM size.

## Run an assessment

Run an *Azure VM assessment* as follows:

1. Review the [best practices](best-practices-assessment.md) for creating assessments.
2. On the **Servers** tab, in the **Azure Migrate: Server Assessment** tile, select **Assess**.

   ![Location of the Assess button](./media/tutorial-assess-vmware/assess.png)

3. In **Assess servers**, select the assessment type as "Azure VM", select the discovery source and specify the assessment name.

    ![Assessment Basics](./media/tutorial-assess-vmware/assess-servers-azurevm.png)
 
4. Select **View all**, and then review the assessment properties.

   ![Assessment properties](./media/tutorial-assess-vmware/view-all.png)

5. Click **next** to **Select machines to assess**. In **Select or create a group**, select **Create New**, and specify a group name. A group gathers one or more VMs together for assessment.
6. In **Add machines to the group**, select VMs to add to the group.
7. Click **next** to **Review + create assessment** to review the assessment details.
8. Select **Create Assessment** to create the group and run the assessment.

   ![Assess servers](./media/tutorial-assess-vmware/assessment-create.png)

8. After the assessment is created, view it in **Servers** > **Azure Migrate: Server Assessment** > **Assessments**.
9. Select **Export assessment** to download it as an Excel file.

If you want to run an **Azure VMware Solution (AVS) assessment**, follow the steps mentioned [here](how-to-create-azure-vmware-solution-assessment.md).


## Review an assessment

An assessment describes:

- **Azure readiness**: Whether VMs are suitable for migration to Azure.
- **Monthly cost estimation**: The estimated monthly compute and storage costs for running the VMs in Azure.
- **Monthly storage cost estimation**: Estimated costs for disk storage after migration.

To view an assessment:

1. In **Migration goals** > **Servers**, select **Assessments** in **Azure Migrate: Server Assessment**.
2. In **Assessments**, select an assessment to open it.

   ![Assessment summary](./media/tutorial-assess-vmware/assessment-summary.png)

### Review Azure readiness

1. In **Azure readiness**, verify whether VMs are ready for migration to Azure.
2. Review the VM status:
    - **Ready for Azure**: Used when Azure Migrate recommends a VM size and cost estimates for VMs in the assessment.
    - **Ready with conditions**: Shows issues and suggested remediation.
    - **Not ready for Azure**: Shows issues and suggested remediation.
    - **Readiness unknown**: Used when Azure Migrate can't assess readiness because of data availability issues.

3. Select an **Azure readiness** status. You can view VM readiness details. You can also drill down to see VM details, including compute, storage, and network settings.

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
