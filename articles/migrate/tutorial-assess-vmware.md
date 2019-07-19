---
title: Assess VMware VMs for migration to Azure with Azure Migrate
description: Describes how to assess on-premises VMware VMs for migration to Azure using Azure Migrate.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 07/12/2019
ms.author: hamusa
---

# Assess VMware VMs with Azure Migrate: Server Assessment

This article shows you how to assess on-premises VMware VMs, using the Azure Migrate: Server Assessment tool.

[Azure Migrate](migrate-services-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and third-party independent software vendor (ISV) offerings.



This tutorial is the second in a series that demonstrates how to assess and migrate VMware VMs to Azure. In this tutorial, you learn how to:
> [!div class="checklist"]
> * Set up an Azure Migrate project.
> * Set up an Azure Migrate appliance that runs on-premises to assess VMs.
> * Start continuous discovery of on-premises VMs. The appliance sends configuration and performance data for discovered VMs to Azure.
> * Group discovered VMs, and assess the VM group.
> * Review the assessment.



> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the How-to articles.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prerequisites

- [Complete](tutorial-prepare-vmware.md) the first tutorial in this series. If you don't, the instructions in this tutorial won't work.
- Here's what you should have done in the first tutorial:
    - [Set up Azure permissions](tutorial-prepare-vmware.md#prepare-azure) for Azure Migrate.
    - [Prepare VMware](tutorial-prepare-vmware.md#prepare-for-vmware-vm-assessment) for assessment. VMware settings should be verified, and you should have permissions to create a VMware VM with an OVA template. You should also have an account set up for VM discovery. Required ports should be available, and you should be aware of the URLs needed for access to Azure.


## Set up an Azure Migrate project

Set up a new Azure Migrate project as follows.

1. In the Azure portal > **All services**, search for **Azure Migrate**.
2. Under **Services**, select **Azure Migrate**.
3. In **Overview**, under **Discover, assess and migrate servers**, click **Assess and migrate servers**.

    ![Discover and assess servers](./media/tutorial-assess-vmware/assess-migrate.png)

4. In **Getting started**, click **Add tools**.
5. In **Migrate project**, select your Azure subscription, and create a resource group if you don't have one.     
6. In **Project Details**, specify the project name, and the geography in which you want to create the project. Asia, Europe, UK and the United States are supported.

    - The project geography is used only to store the metadata gathered from on-premises VMs.
    - You can select any target region when you run a migration.

    ![Create an Azure Migrate project](./media/tutorial-assess-vmware/migrate-project.png)


7. Click **Next**.
8. In **Select assessment tool**, select **Azure Migrate: Server Assessment** > **Next**.

    ![Create an Azure Migrate project](./media/tutorial-assess-vmware/assessment-tool.png)

9. In **Select migration tool**, select **Skip adding a migration tool for now** > **Next**.
10. In **Review + add tools**, review the settings, and click **Add tools**.
11. Wait a few minutes for the Azure Migrate project to deploy. You'll be taken to the project page. If you don't see the project, you can access it from **Servers** in the Azure Migrate dashboard.


## Set up the appliance VM

Azure Migrate: Server Assessment runs a lightweight VMware VM appliance.

- This appliance performs VM discovery and sends VM metadata and performance data to Azure Migrate Server Assessment.
- To set up the appliance you:
    - Download an OVA template file, and import it to vCenter Server.
    - Create the appliance, and check that it can connect to Azure Migrate Server Assessment.
    - Configure the appliance for the first time, and register it with the Azure Migrate project.
- You can set up multiple appliances for a single Azure Migrate project. Across all appliances, discovery of up to 35,000 VMs is supported. A maximum of 10,000 servers can be discovered per appliance.

### Download the OVA template

1. In **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, click **Discover**.
2. In **Discover machines** > **Are your machines virtualized?**, click **Yes, with VMWare vSphere hypervisor**.
3. Click **Download** to download the .OVA template file.

    ![Download .ova file](./media/tutorial-assess-vmware/download-ova.png)


### Verify security

Check that the OVA file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the OVA:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\AzureMigrate\AzureMigrate.ova SHA256```
3. For version 1.19.06.27, the generated hash should match these values. 

  **Algorithm** | **Hash value**
  --- | ---
  MD5 | 605d208ac5f4173383f616913441144e
  SHA256 | 447d16bd55f20f945164a1189381ef6e98475b573d6d1c694f3e5c172cfc30d4


### Create the appliance VM

Import the downloaded file, and create a VM.

1. In the vSphere Client console, click **File** > **Deploy OVF Template**.

    ![Deploy OVF](./media/tutorial-assess-vmware/deploy-ovf.png)

2. In the Deploy OVF Template Wizard > **Source**, specify the location of the OVA file.
3. In **Name** and **Location**, specify a friendly name for the VM. Select the inventory object in which the VM
will be hosted.
5. In **Host/Cluster**, specify the host or cluster on which the VM will run.
6. In **Storage**, specify the storage destination for the VM.
7. In **Disk Format**, specify the disk type and size.
8. In **Network Mapping**, specify the network to which the  VM will connect. The network needs internet connectivity, to send metadata to Azure Migrate Server Assessment.
9. Review and confirm the settings, then click **Finish**.


### Verify appliance access to Azure

Make sure that the appliance VM can connect to [Azure URLs](migrate-support-matrix-vmware.md#assessment-url-access-requirements).


### Configure the appliance

Set up the appliance using the following steps.

1. In the vSphere Client console, right-click the VM > **Open Console**.
2. Provide the language, time zone, and password for the appliance.
3. Open a browser on any machine that can connect to the VM, and open the URL of the appliance web app: **https://*appliance name or IP address*: 44368**.

   Alternately, you can open the app from the appliance desktop by clicking the app shortcut.
4. In the web app > **Set up prerequisites**, do the following:
    - **License**: Accept the license terms, and read the third-party information.
    - **Connectivity**: The app checks that the VM has internet access. If the VM uses a proxy:
        - Click **Proxy settings**, and specify the proxy address and listening port, in the form http://ProxyIPAddress or http://ProxyFQDN.
        - Specify credentials if the proxy needs authentication.
        - Only HTTP proxy is supported.
    - **Time sync**:The time on the appliance should be in sync with internet time for discovery to work properly.
    - **Install updates**: The appliance ensures that the latest updates are installed.
    - **Install VDDK**: The appliance checks that VMWare vSphere Virtual Disk Development Kit (VDDK) is installed.
        - Azure Migrate: Server Migration uses the VDDK to replicate machines during migration to Azure.
        - Download VDDK 6.7 from VMware, and extract the downloaded zip contents to the specified location on the appliance.

### Register the appliance with Azure Migrate

1. Click **Log In**. If it doesn't appear, make sure you've disabled the pop-up blocker in the browser.
2. On the new tab, sign in using your Azure credentials.
    - Sign in with your username and password.
    - Sign in with a PIN isn't supported.
3. After successfully signing in, go back to the web app.
2. Select the subscription in which the Azure Migrate project was created, then select the project.
3. Specify a name for the appliance. The name should be alphanumeric with 14 characters or less.
4. Click **Register**.


## Start continuous discovery

Now, connect from the appliance to vCenter Server, and start VM discovery.

1. In **Specify vCenter Server details**, specify the name (FQDN) or IP address of the vCenter Server. You can leave the default port, or specify a custom port on which your vCenter Server listens.
2. In **User name** and **Password**, specify the read-only account credentials that the appliance will use to discover VMs on the vCenter server. Make sure that the account has the [required permissions for discovery](migrate-support-matrix-vmware.md#assessment-vcenter-server-permissions). You can scope the discovery by limiting access to the vCenter account accordingly; learn more about scoping discovery [here](tutorial-assess-vmware.md#scoping-discovery).
3. Click **Validate connection** to make sure that the appliance can connect to vCenter Server.
4. After the connection is established, click **Save and start discovery**.

This starts discovery. It takes around 15 minutes for metadata of discovered VMs to appear in the portal.

### Scoping discovery

Discovery can be scoped by limiting access of the vCenter account used for discovery. You can set the scope to vCenter Server datacenters, clusters, folder of clusters, hosts, folder of hosts, or individual VMs. 

> [!NOTE]
> Today, Server Assessment is not able to discover VMs if the vCenter account has access granted at vCenter VM folder level. If you are looking to scope your discovery by VM folders, you can do so by ensuring the vCenter account has read-only access assigned at a VM level.  Following are instructions on how you can do this:
>
> 1. Assign read-only permissions on all the VMs in the VM folders to which you want to scope the discovery. 
> 2. Grant read-only access to all the parent objects where the VMs are hosted. All parent objects - host, folder of hosts, cluster, folder of clusters - in the hierarchy up to the data center are to be included. You do not need to propagate the permissions to all child objects.
> 3. Use the credentials for discovery selecting datacenter as *Collection Scope*. The RBAC set up ensures that the corresponding vCenter user will have access to only tenant-specific VMs.
>
> Note that folder of hosts and clusters are supported.

### Verify VMs in the portal

After discovery, you can verify that the VMs appear in the Azure portal.

1. Open the Azure Migrate dashboard.
2. In **Azure Migrate - Servers** > **Azure Migrate: Server Assessment** page, click the icon that displays the count for **Discovered servers**.

## Set up an assessment

There are two types of assessments you can create using Azure Migrate: Server Assessment.

**Assessment** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments based on collected performance data | **Recommended VM size**: Based on CPU and memory utilization data.<br/><br/> **Recommended disk type (standard or premium managed disk)**: Based on the IOPS and throughput of the on-premises disks.
**As on-premises** | Assessments based on on-premises sizing. | **Recommended VM size**: Based on the on-premises VM size<br/><br> **Recommended disk type**: Based on the storage type setting you select for the assessment.


### Run an assessment

Run an assessment as follows:

1. Review the [best practices](best-practices-assessment.md) for creating assessments.
2. In the **Servers** tab, in **Azure Migrate: Server Assessment** tile, click **Assess**.

    ![Assess](./media/tutorial-assess-vmware/assess.png)

2. In **Assess servers**, specify a name for the assessment.
3. Click **View all** to review the assessment properties.

    ![Assessment properties](./media/tutorial-assess-vmware/view-all.png)

3. In **Select or create a group**, select **Create New**, and specify a group name. A group gathers one or more VMs together for assessment.
4. In **Add machines to the group**, select VMs to add to the group.
5. Click **Create Assessment** to create the group, and run the assessment.

    ![Create an assessment](./media/tutorial-assess-vmware/assessment-create.png)

6. After the assessment is created, view it in **Servers** > **Azure Migrate: Server Assessment** > **Assessments**.
7. Click **Export assessment**, to download it as an Excel file.



## Review an assessment

An assessment describes:

- **Azure readiness**: Whether VMs are suitable for migration to Azure.
- **Monthly cost estimation**: The estimated monthly compute and storage costs for running the VMs in Azure.
- **Monthly storage cost estimation**: Estimated costs for disk storage after migration.

### View an assessment

1. In **Migration goals** >  **Servers**, click **Assessments** in **Azure Migrate: Server Assessment**.
2. In **Assessments**, click on an assessment to open it.

    ![Assessment summary](./media/tutorial-assess-vmware/assessment-summary.png)

### Review Azure readiness

1. In **Azure readiness**, verify whether VMs are ready for migration to Azure.
2. Review the VM status:
    - **Ready for Azure**: Azure Migrate recommends a VM size and cost estimates for VMs in the assessment.
    - **Ready with conditions**: Shows issues and suggested remediation.
    - **Not ready for Azure**: Shows issues and suggested remediation.
    - **Readiness unknown**: Used when Azure Migrate can't assess readiness, due to data availability issues.

2. Click on an **Azure readiness** status. You can view VM readiness details, and drill down to see VM details, including compute, storage, and network settings.



### Review cost details

This view shows the estimated compute and storage cost of running VMs in Azure.

1. Review the monthly compute and storage costs. Costs are aggregated for all VMs in the assessed group.

    - Cost estimates are based on the size recommendations for a machine, and its disks and properties.
    - Estimated monthly costs for compute and storage are shown.
    - The cost estimation is for running the on-premises VMs as IaaS VMs. Azure Migrate Server Assessment doesn't consider PaaS or SaaS costs.

2. You can review monthly storage cost estimates. This view shows aggregated storage costs for the assessed group, split over different types of storage disks.
3. You can drill down to see details for specific VMs.


### Review confidence rating

When you run performance-based assessments, a confidence rating is assigned to the assessment.

![Confidence rating](./media/tutorial-assess-vmware/confidence-rating.png)

- A rating from 1-star (lowest) to 5-star (highest) is awarded.
- The confidence rating helps you estimate the reliability of the size recommendations provided by the assessment.
- The confidence rating is based on the availability of data points needed to compute the assessment.

Confidence ratings for an assessment are as follows.

**Data point availability** | **Confidence rating**
--- | ---
0%-20% | 1 Star
21%-40% | 2 Star
41%-60% | 3 Star
61%-80% | 4 Star
81%-100% | 5 Star

[Learn more](best-practices-assessment.md#best-practices-for-confidence-ratings) about best practices for confidence ratings.


## Next steps

In this tutorial, you:

> [!div class="checklist"]
> * Set up an Azure Migrate appliance
> * Created and reviewed an assessment

Continue to the third tutorial in the series, to learn how to migrate VMware VMs to Azure with Azure Migrate Server Migration.

> [!div class="nextstepaction"]
> [Migrate VMware VMs](./tutorial-migrate-vmware.md)
