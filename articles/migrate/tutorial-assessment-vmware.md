---
title: Discover and assess on-premises VMware VMs for migration to Azure with Azure Migrate | Microsoft Docs
description: Describes how to discover and assess on-premises VMware VMs for migration to Azure, using the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 01/31/2019
ms.author: raynew
ms.custom: mvc
---

# Discover and assess on-premises VMware VMs for migration to Azure

The [Azure Migrate](migrate-overview.md) service assesses on-premises workloads for migration to Azure. 

This article describes how to discover and assess on-premises VMware VMs using the GA version of the Azure Migrate service. A newer version of the article is available, which describes how to assess VMware VMs using the public preview of the Azure Migrate Server Assessment service. [Learn more](migrate-overview.md#azure-migrate-services-public-preview) about the public preview, and [how to assess VMware VMs](tutorial-server-assessment-vmware.md) using the preview service

In this tutorial, you:

> [!div class="checklist"]
> * Create an account that Azure Migrate uses to discover on-premises VMs
> * Create an Azure Migrate project.
> * Set up an on-premises collector virtual machine (VM), to discover on-premises VMware VMs for assessment.
> * Group VMs and create an assessment.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

- **VMware**: The VMs that you plan to migrate must be managed by vCenter Server running version 5.5, 6.0, 6.5, or 6.7. Additionally, you need one ESXi host running version 5.5 or higher to deploy the collector VM.
- **vCenter Server account**: You need a read-only account to access the vCenter Server. Azure Migrate uses this account to discover the on-premises VMs.
- **Permissions**: On the vCenter Server, you need permissions to create a VM by importing a file in .OVA format.

## Create an account for VM discovery

Azure Migrate needs access to VMware servers to automatically discover VMs for assessment. Create a VMware account with the following properties. You specify this account during Azure Migrate setup.

- User type: At least a read-only user
- Permissions: Data Center object –> Propagate to Child Object, role=Read-only
- Details: User assigned at datacenter level, and has access to all the objects in the datacenter.
- To restrict access, assign the No access role with the Propagate to child object, to the child objects (vSphere hosts, datastores, VMs, and networks).


## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

## Create a project

1. In the Azure portal, click **Create a resource**.
2. Search for **Azure Migrate**, and select the service **Azure Migrate** in the search results. Then click **Create**.
3. Specify a project name, and the Azure subscription for the project.
4. Create a new resource group.
5. Specify the geography in which you want to create the project, then click **Create**.

    - You can only create an Azure Migrate project in the geographies summarized in the table.
    - You can assess any target Azure location.
    - The project geography specified is only used to store metadata gathered from the on-premises VMs.

**Geography** | **Storage location**
--- | ---
Azure Government | US Gov Virginia
Asia | Southeast Asia
Europe | North Europe or West Europe
Unites States | East US or West Central US


![Azure Migrate](./media/tutorial-assessment-vmware/project-1.png)


## Download the collector appliance

Azure Migrate creates an on-premises VM known as the collector appliance. This VM discovers on-premises VMware VMs, and sends metadata about them to the Azure Migrate service. To set up the collector appliance, you download an .OVA file, and import it to the on-premises vCenter server to create the VM.

1. In the Azure Migrate project, click **Getting Started** > **Discover & Assess** > **Discover Machines**.
2. In **Discover machines**, decide which version of the appliance you want to use, and click **Download**. We recommend using the continuous discovery option for more granular and accurate results.

    - **Download appliance for one-time discovery**: This appliance discovers on-premises machines at a single point in time. It gathers VM metadata, and gather performance data based on the last month of historical data stored in vCenter Server. It collects average counters for utilization data. If your on-premises environment changes, you need to run discovery again to reflect those changes.
    - **Download appliance for continuous discovery**: This appliance continually profiles the on-premise environment to gather real-time utilization data for VMs. It gathers VM metadata, and collects peak counters to measure utilization. It doesn't use vCenter Server statistics settings. You can stop discovery at any time. This appliance is in preview.
    - [Learn more](concepts-collector.md#discovery-process) about the data collected by Azure Migrate.

3. In **Copy project credentials**, copy the project ID and key. You need these when you configure the collector.

    ![Download .ova file](./media/tutorial-assessment-vmware/download-ova.png)

### Verify the collector appliance

Check that the .OVA file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the OVA:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\AzureMigrate\AzureMigrate.ova SHA256```
3. The generated hash should match the settings in the tables below, in accordance with the OVA version.

#### Continuous discovery

  For OVA version 1.0.10.11

  **Algorithm** | **Hash value**
    --- | ---
    MD5 | 5f6b199d8272428ccfa23543b0b5f600
    SHA1 | daa530de6e8674a66a728885a7feb3b0a2e8ccb0
    SHA256 | 85da50a21a7a6ca684418a87ccc1dd4f8aab30152c438a17b216ec401ebb3a21

  For OVA version 1.0.10.9

  **Algorithm** | **Hash value**
  --- | ---
  MD5 | 169f6449cc1955f1514059a4c30d138b
  SHA1 | f8d0a1d40c46bbbf78cd0caa594d979f1b587c8f
  SHA256 | d68fe7d94be3127eb35dd80fc5ebc60434c8571dcd0e114b87587f24d6b4ee4d

  For OVA version 1.0.10.4

  **Algorithm** | **Hash value**
  --- | ---
  MD5 | 2ca5b1b93ee0675ca794dd3fd216e13d
  SHA1 | 8c46a52b18d36e91daeae62f412f5cb2a8198ee5
  SHA256 | 3b3dec0f995b3dd3c6ba218d436be003a687710abab9fcd17d4bdc90a11276be


#### One-time discovery (deprecated now)

This model is now deprecated, support for existing appliances will be provided.

  For OVA version 1.0.9.15

  **Algorithm** | **Hash value**
  --- | ---
  MD5 | e9ef16b0c837638c506b5fc0ef75ebfa
  SHA1 | 37b4b1e92b3c6ac2782ff5258450df6686c89864
  SHA256 | 8a86fc17f69b69968eb20a5c4c288c194cdcffb4ee6568d85ae5ba96835559ba

  For OVA version 1.0.9.14

  **Algorithm** | **Hash value**
  --- | ---
  MD5 | 6d8446c0eeba3de3ecc9bc3713f9c8bd
  SHA1 | e9f5bdfdd1a746c11910ed917511b5d91b9f939f
  SHA256 | 7f7636d0959379502dfbda19b8e3f47f3a4744ee9453fc9ce548e6682a66f13c

  For OVA version 1.0.9.12

  **Algorithm** | **Hash value**
  --- | ---
  MD5 | d0363e5d1b377a8eb08843cf034ac28a
  SHA1 | df4a0ada64bfa59c37acf521d15dcabe7f3f716b
  SHA256 | f677b6c255e3d4d529315a31b5947edfe46f45e4eb4dbc8019d68d1d1b337c2e

## Create the collector VM

Now, import the OVA file to the vCenter Server, and create the collector VM.

1. In the vSphere Client console, click **File** > **Deploy OVF Template**.

    ![Deploy OVF](./media/tutorial-assessment-vmware/vcenter-wizard.png)

2. In the Deploy OVF Template Wizard > **Source**, specify the location of the OVA file.
3. In **Name** and **Location**, specify a friendly name for the collector VM, and the inventory object in which the VM
will be hosted.
5. In **Host/Cluster**, specify the host or cluster on which the collector VM will run.
7. In storage, specify the storage destination for the collector VM.
8. In **Disk Format**, specify the disk type and size.
9. In **Network Mapping**, specify the network to which the collector VM will connect. The network needs internet connectivity, to send metadata to Azure.
10. Review and confirm the settings, then click **Finish**.

## Discover VMs

### Before you start

Note the following before you start:
- Only English (United States) is supported for the collector VM operating system and interface language.
- If settings have been modified on a machine you want to access, perform discovery again before you run the assessment. To do this, in the collector, click **Start collection again**. In the portal, click **Recalculate** to get an updated assessment. 


1. In the vSphere Client console, right-click the VM > **Open Console**.
2. Provide the language, time zone, and password preferences for the appliance.
3. On the desktop, click the **Run collector** shortcut.
4. Click **Check for updates** in the top bar of the collector UI and verify that the collector is running on the latest version. If not, you can choose to download the latest upgrade package from the link and update the collector.
5. In the Azure Migrate Collector, open **Set up prerequisites**.
6. Select the Azure cloud to which you want to migrate (Azure Global or Azure Government).
7. Accept the license terms, and read the third-party information. The collector checks that the VM has internet access.
8. If the VM accesses the internet via a proxy, click **Proxy settings**, and specify the proxy address and listening port.
    - Enter the proxy address in the format http://ProxyIPAddress or http://ProxyFQDN. Only HTTP proxy is supported.
    - Specify credentials if the proxy needs authentication.
    - If you have an intercepting proxy, import the proxy certificate so that the connectivity works as expected. [Learn more]((concepts-collector.md#internet-connectivity-with-intercepting-proxy).
    - [Verify](https://docs.microsoft.com/azure/migrate/concepts-collector#collector-prerequisites) internet connectivity requirements and the [URLs](https://docs.microsoft.com/azure/migrate/concepts-collector#connect-to-urls) that the collector accesses.

9. The collector checks that the collector service is running. The service is installed by default on the collector VM.
10. Download and install VMware PowerCLI.
11 In **Specify vCenter Server details**, specify the name (FQDN) or IP address of the vCenter server.
12. In **User name** and **Password**, specify the read-only account credentials that the collector will use to discover VMs on the vCenter server.
13. In **Collection scope**, select a scope for VM discovery. The collector can only discover VMs within the specified scope. Scope can be set to a specific folder, datacenter, or cluster. It shouldn't contain more than 1500 VMs. [Learn more](how-to-scale-assessment.md) about how you can discover a larger environment.
14. In **Specify migration project**, specify the Azure Migrate project ID and key that you copied from the portal. If didn't copy them, open the Azure portal from the collector VM. In the project **Overview** page, click **Discover Machines**, and copy the values.  
15. In **View collection progress**, monitor discovery status. [Learn more](https://docs.microsoft.com/azure/migrate/concepts-collector#what-data-is-collected) about what data is collected by the Azure Migrate collector.
    - Select the Azure cloud to which you plan to migrate (Azure Global or Azure Government).
    - Accept the license terms, and read the third-party information.
    - The collector checks that the VM has internet access.
    - If the VM accesses the internet via a proxy, click **Proxy settings**, and specify the proxy address and listening port. Specify credentials if the proxy needs authentication. [Learn more](https://docs.microsoft.com/azure/migrate/concepts-collector#collector-prerequisites) about the internet connectivity requirements and the [list of URLs](https://docs.microsoft.com/azure/migrate/concepts-collector) that the collector accesses.

      > [!NOTE]
      > The proxy address needs to be entered in the form http://ProxyIPAddress or http://ProxyFQDN. Only HTTP proxy is supported. If you have an intercepting proxy, the internet connection might initially fail if you have not imported the proxy certificate; [learn more](https://docs.microsoft.com/azure/migrate/concepts-collector) on how you can fix this by importing the proxy certificate as a trusted certificate on the collector VM.



7. In **Specify migration project**, specify the Azure Migrate project ID and key that you copied from the portal. If didn't copy them, open the Azure portal from the collector VM. In the project **Overview** page, click **Discover Machines**, and copy the values.  
8. In **View collection progress**, monitor discovery status. [Learn more](https://docs.microsoft.com/azure/migrate/concepts-collector) about what data is collected by the Azure Migrate collector.

> [!NOTE]
> The collector only supports "English (United States)" as the operating system language and the collector interface language.
> If you change the settings on a machine you want to assess, trigger discover again before you run the assessment. In the collector, use the **Start collection again** option to do this. After the collection is done, select the **Recalculate** option for the assessment in the portal, to get updated assessment results.


### Verify VMs in the portal

After discovery is done you can verify that the VMware VMs appear in the portal:

- For continuous discovery the collector sends performance data at hourly intervals. You can review the machines in the portal an hour after starting the discovery. In order to collect performance data, we recommend you wait at least a day before creating any performance-based assessments.
- For one-time discovery, discovery time depends on how many VMs you are discovering. Typically, for 100 VMs, after the collector runs it takes around an hour to collect configuration and performance data. You can create assessments (as-is and performance-based assessments immediately after discovery finishes.

Review the VMs in the portal:

1. In the migration project, click **Manage** > **Machines**.
2. Check that the VMs you want to discover appear in the portal.


## Create and view an assessment

After discovery, you can create an assessment.

1. In the project **Overview** page, click **+Create assessment**.
2. Click **View all** to review the assessment properties.
3. Create the group, and specify a group name.
4. Select the machines that you want to add to the group.
5. Click **Create Assessment**, to create the group and the assessment.
6. After the assessment is created, view it in **Overview** > **Dashboard**.
7. Click **Export assessment**, to download it as an Excel file.

If VM settings change, run discovery again before you run an assessment. To do this:

1. In the collector, click  **Start collection again**. 
2. After discovery finishes, click **Recalculate** to get updated assessment results.


## Review an assessment

An assessment specifies:

- **Readiness**: Whether VMs are suitable for migration to Azure
- **Size estimation**: An estimated size for the Azure VM after migration.
- **Cost estimation**: The estimated monthly costs of running the VM in Azure.


![Assessment report](./media/tutorial-assessment-vmware/assessment-report.png)

### Review Azure readiness

The assessment shows VM readiness in one of the states summarized in the following table.

**State** | **Details**
--- | ---
**Ready** | Azure Migrate recommends a VM size in Azure:<br/><br/> - For performance-based assessment, sizing is based on VM CPU/RAM utilization and disk IOPS/throughput.<br/><br/> - For as-is assessment, sizing is based on the size of the on-premises VM, and disk storge type specified in the assessment (premium by default).<br/><br/> - [Learn more](concepts-assessment-calculation.md) about sizing.
**Conditionally ready** | Details of readiness issues and remediation steps.
**Not ready** | Details of readiness issues and remediation steps.
**Readiness unknown** | This state is used for VMs for which Azure Migrate can't assess readiness, due to data availability issues.



  ![Assessment readiness](./media/tutorial-assessment-vmware/assessment-suitability.png)  

#### Review monthly cost estimate

This view shows the estimate compute and storage cost of running the VMs in Azure. 

- Cost estimates are based on the size recommendations for a machine, and its disks and properties.
- Estimated monthly costs for compute and storage are aggregated for all VMs in the assessed group.
- The cost estimation is for running the on-premises VMs as IaaS VMs. Azure Migrate doesn't consider PaaS or SaaS costs. 

![Assessment VM cost](./media/tutorial-assessment-vmware/assessment-vm-cost.png)

### Review confidence ratings

When you run performance-based assessments, a confidence rating is assigned to the assessment.

- A rating from 1-star (lowest) to 5-star (highest) is awarded.
- The confidence rating helps you estimate the reliability of the size recommendations provided by the assessment.
- The confidence rating is based on the availability of data points needed to compute the assessment.
- To provide a rating Azure Migrate needs the utilization data for VM CPU/Memory, and the disk IOPS/throughput data. For each network adapter attached to a VM, Azure Migrate needs the network in/out data.
- In particular, if utilization data isn't available in vCenter Server, the size recommendation done by Azure Migrate might not be reliable. 

Depending on the percentage of data points available, the confidence rating for an assessment are summarized in the following table.

   **Data point availability** | **Confidence rating**
   --- | ---
   0%-20% | 1 Star
   21%-40% | 2 Star
   41%-60% | 3 Star
   61%-80% | 4 Star
   81%-100% | 5 Star

If you run a one-time discovery and the assessment is less than 4-star, make sure the statistic level in vCenter is set to 3, wait at least a day, and recalculate the assessment. If this isn't possible, run an as-is assessment instead.

#### Missing data points

An assessment might not have all the data points for a number of reasons:

- VMs might be powered off during the assessment and performance data isn't collected. I
- VMs might be created during the month on which performance history is based, thus their performance data is less than a month. 
- For continuous discovery, you didn't wait a day after starting discovery before creating the assessment.
- For one-time discovery, the statistics setting is vCenter Server might not be set to level 3. With a lower level, network and disk performance data isn't collected, and the assessment recommends standard disks by default.
- For one-time discovery, the statistics level might have been changed in the middle of the period for which you're collecting performance data. This will influence the confidence rating.


## Next steps

- [Learn](concepts-assessment-calculation.md) how assessments are calculated.
- [Learn](how-to-modify-assessment.md) how to customize an assessment.
- Learn how to increase the reliability of assessments using [machine dependency mapping](how-to-create-group-machine-dependencies.md)
