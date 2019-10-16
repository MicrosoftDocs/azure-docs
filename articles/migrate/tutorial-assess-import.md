---
title: Assess imported servers for migration to Azure with Azure Migrate
description: Describes how to assess imported on-premises servers for migration to Azure using Azure Migrate.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 10/15/2019
ms.author: hamusa
---

# Assess servers by importing into Azure Migrate: Server Assessment

This article shows you how to assess on-premises servers by importing server metadata using the Azure Migrate: Server Assessment tool. The import can be done by uploading a .CSV file containing the server information. There is no requirement to set up an appliance. 

Assessing using import is useful in the following scenarios:
 * You are looking for a quick initial assessment before you can deploy the appliance 
 * You are not able to deploy the Azure Migrate appliance or share credentials to on-premise servers.
 * Security constraints disallow deploying an appliance due to the data collected and sent by the appliance to Azure. With import, you can control what data you share. For example, providing IP address is optional.

[Azure Migrate](migrate-services-overview.md) provides a hub of tools that help you to discover, assess, and migrate apps, infrastructure, and workloads to Microsoft Azure. The hub includes Azure Migrate tools, and third-party independent software vendor (ISV) offerings.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Set up an Azure Migrate project.
> * Import servers to Azure Migrate by uploading server information in a .CSV file. 
> * Add configuration and performance data for these servers to Azure Migrate.
> * Group discovered servers, and assess the server group.
> * Review the assessment.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the How-to articles.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prerequisites

Your Azure account needs permissions to create an Azure Migrate project for assessment and migration.

1. In the Azure portal, open the subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and click it to view permissions.
3. You should have **Contributor** or **Owner** permissions.
    - If you just created a free Azure account, you're the owner of your subscription.
    - If you're not the subscription owner, work with the owner to assign the role.


## Set up an Azure Migrate project

Set up a new Azure Migrate project as follows.

1. In the Azure portal > **All services**, search for **Azure Migrate**.
2. Under **Services**, select **Azure Migrate**.
3. In **Overview**, under **Discover, assess and migrate servers**, click **Assess and migrate servers**.

    ![Discover and assess servers](./media/tutorial-assess-import/assess-migrate.png)

4. In **Getting started**, click **Add tools**.
5. In **Migrate project**, select your Azure subscription, and create a resource group if you don't have one.     
6. In **Project Details**, specify the project name, and the geography in which you want to create the project. Asia, Europe, UK and the United States are supported.

    - The project geography is used only to store the metadata gathered from on-premises VMs.
    - You can select any target region when you run a migration.

    ![Create an Azure Migrate project](./media/tutorial-assess-import/migrate-project.png)


7. Click **Next**.
8. In **Select assessment tool**, select **Azure Migrate: Server Assessment** > **Next**.

    ![Create an Azure Migrate project](./media/tutorial-assess-import/assessment-tool.png)

9. In **Select migration tool**, select **Skip adding a migration tool for now** > **Next**.
10. In **Review + add tools**, review the settings, and click **Add tools**.
11. Wait a few minutes for the Azure Migrate project to deploy. You'll be taken to the project page. If you don't see the project, you can access it from **Servers** in the Azure Migrate dashboard.


## Prepare the server information for upload

Azure Migrate: Server Assessment requires server information to be provided in a .CSV template.

- The .CSV file enables to provide server metadata and performance data to Azure Migrate Server Assessment.
- To prepare the .CSV file:
    - Download the template for .CSV file.
    - Populate the .CSV file with the required data. Note that not all values are mandatory.
- You can upload server information multiple times. A total of 20,000 servers can be added via .CSV. A maximum of 10,000 servers can be added in a single file

### Download the template

1. In **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, click **Discover**.
2. In **Discover machines**, choose **Import using .CSV**.
3. Click **Download** to download the .CSV template. You can also download it [here](https://go.microsoft.com/fwlink/?linkid=2108404).

    ![Download .CSV template](./media/tutorial-assess-import/download-template.png)


### Populate server information

Following are details on each field in the .CSV template. To gather this data, consider exporting it from tools you use to manage on-premise servers such as CMDBs, VMware vSphere. Download this [example file](https://go.microsoft.com/fwlink/?linkid=2108405) to review the sample data for each field.

**Field name** | **Mandatory / Optional** | **Details**
--- | --- | ---
Server name | Mandatory | Server name. <br/> It is recommended the fully qualified domain name is specified. 
IP address | Optional | IP address of server
Cores | Mandatory | No. of processor cores allocated to the machine
Memory (in MB) | Mandatory | Total RAM allocated to the server, in MB
OS name | Mandatory | Operating System of the server. Refer to the following section to know more on providing OS names.
OS version | Optional | Operating System version of the server
Number of disks | Optional | No. of disks. This is not required if individual disk details are provided.
Disk 1 size (in GB) | Optional | Maximum size of disk <br/> Add disk details for a second disk by adding an column in the template called "Disk 2 size". In this way, you can add upto 8 disks.
Disk 1 read ops (operations per second) | Optional | Disk read operations per second
Disk 1 write ops (operations per second) | Optional | Disk write operations per second
Disk 1 read throughput (MB per second) | Optional | Data read from the disk per second in MBPS
Disk 1 write throughput (MB per second) | Optional | Data written to disk per second in MBPS
CPU utilization percentage | Optional | Percentage utilization of CPU
Memory utilization percentage | Optional | Percentage utilization of RAM
Total disks read ops | Optional | Disk read operations per second
Total disks write ops | Optional | Disk write operations per second
Total disks read throughput | Optional | Data read from the disk per second in MBPS
Total disks write throughput | Optional | Data written to disk per second in MBPS
Network In throughput | Optional | Data received per second by the server in MBPS
Network Out throughput | Optional | Data transmitted per second by the srver in MBPS
Firmware type | Optional | Firmware type of server. <br/> Permitted values in this field are "BIOS" or "UEFI"
Server Type | Optional | Whether the server is physical or virtual. <br/> Permitted values in this field are "Physical" or "Virtual"
Hypervisor | Optional | Hypervisor that the server is running on. <br/> Permitted values in this field are "VMware", "Hyper-V", "Xen", "AWS", "GCP", "Other"
Hypervisor version number | Optional | Hypervisor version number
Virtual machine ID | Optional | VM InstanceUUid in case of vCenter VM (or) Hyper-V VM Id in case of Hyper-V 
Virtual machine manager ID | Optional | vCenter InstanceUUid in case of vCenter VM. Not needed for Hyper-V.
MAC address | Optional | MAC address of server
BIOS ID | Optional | BIOS ID of server
Custom server ID | Optional | Reference to local unique IDs in on-premises infrastructure. <br/> This is useful if you would like to track the imported server using the ID. 
Application 1 name | Optional | Name of the workload running in the server. The application details have to be shown like for apps and roles. <br/> Add details on a second application by adding an column in the template called "Application 2 name". In this way, you can add upto 5 applications.
Application 1 type | Optional | Type of workload running in the server
Application 1 version | Optional | Version of the workload running on the server
Application 1 license expiry | Optional | License expiry of the workload if applicable
Business unit | Optional | Business unit the server belongs to
Business owner | Optional | Business unit owner
Business application name | Optional | Name of the application the server belongs to
Location | Optional | Data center the server is located in
Groups | Optional | The server will be added to the specified Azure Migrate group. <br/> If a group with the name already exists, the server will be added to the group. If not, a new group with the specified name is created and the server is added to the group.
Server decommission date | Optional | Decommission date of physical server or the underlying physical server of the virtual server

### Populating Operating System information

Please ensure the OS names you provide match the name in the following list. The assessment recognizes an OS name that contains one of the following names. For example, providing an OS name of "Windows Server 2016 Datacenter" would work. On the other hand, "Windos Server 2016 Datacenter" would not work. 

    ```
    Apple Mac OS X 10
    Asianux 3
    Asianux 4
    Asianux 5
    CentOS
    CentOS 4/5
    CoreOS Linux
    Debian GNU/Linux 4
    Debian GNU/Linux 5
    Debian GNU/Linux 6
    Debian GNU/Linux 7
    Debian GNU/Linux 8
    FreeBSD
    IBM OS/2
    MS-DOS
    Novell NetWare 5
    Novell NetWare 6
    Oracle Linux
    Oracle Linux 4/5
    Oracle Solaris 10
    Oracle Solaris 11
    Red Hat Enterprise Linux 2
    Red Hat Enterprise Linux 3
    Red Hat Enterprise Linux 4
    Red Hat Enterprise Linux 5
    Red Hat Enterprise Linux 6
    Red Hat Enterprise Linux 7
    Red Hat Fedora
    SCO OpenServer 5
    SCO OpenServer 6
    SCO UnixWare 7
    Serenity Systems eComStation 1
    Serenity Systems eComStation 2
    Sun Microsystems Solaris 8
    Sun Microsystems Solaris 9
    SUSE Linux Enterprise 10
    SUSE Linux Enterprise 11
    SUSE Linux Enterprise 12
    SUSE Linux Enterprise 8/9
    SUSE openSUSE
    Ubuntu Linux
    VMware ESXi 4
    VMware ESXi 5
    VMware ESXi 6
    Windows 10
    Windows 2000
    Windows 3
    Windows 7
    Windows 8
    Windows 95
    Windows 98
    Windows NT
    Windows Server (R) 2008
    Windows Server 2003
    Windows Server 2008
    Windows Server 2008 R2
    Windows Server 2012
    Windows Server 2012 R2
    Windows Server 2016
    Windows Server 2019
    Windows Server Threshold
    Windows Vista
    Windows Web Server 2008 R2
    Windows XP Professional
    ```

### Adding multiple disks

Individual disk details are provided using the following fields. You can add upto 8 disks by adding more such columns. For example, you can specify size and throughput for a second disk by adding the columns: "Disk 2 size", "Disk 2 read ops", "Disk 2 write ops", "Disk 2 read throughput", "Disk 2 write througput"

    ```
    Disk 1 size
    Disk 1 read ops
    Disk 1 write ops
    Disk 1 read throughput
    Disk 1 write throughput
    ```

### Adding multiple applications

Individual application details are provided using the following fields. You can add upto 5 applications by adding more such columns. For example, you can specify name and type for a second second by adding the columns: "Application 2 name", "Application 2 type"

    ```
    Application 1 name
    Application 1 type
    Application 1 version
    Application 1 license expiry
    ```

## Upload the server information

Now, import the servers into Azure Migrate: Server Assessment.

1. In the Azure portal, in **Discover machines**, browse to the file populated with the server information.
2. Click **Import**. You can see the status of the import. When completed, you will see an **Import status** of **Completed** or **Failed**.
3. You may see warnings in the **Import status**. It is optional to address warnings. Click **Download warning details .CSV**. Warnings provide remediation guidance to help you improve the accuracy of the assessment by enhancing the server information provided. You can proceed with the assessments without addressing the remediation guidance provided as warnings. 
    - Open the .CSV file downloaded. This is the .CSV file you upload along with an additional column containing warnings.
    - Review the warnings in the **Error details** column.
    - Optionally, modify the server information as per the remediation guidance.
4. You may see errors in the **Import status**. You cannot proceed with the import without fixing these errors.
    - Open the .CSV file downloaded. This is the .CSV file you upload along with an additional column containing error details
    - Review the errors in the **Error details** column.
    - Address the errors as per the remediation guidance provided in the column
    - Upload the modified file again.

The servers have now been imported. 

### Verify servers in the portal

After discovery, you can verify that the servers appear in the Azure portal.

1. Open the Azure Migrate dashboard.
2. In **Azure Migrate - Servers** > **Azure Migrate: Server Assessment** page, click the icon that displays the count for **Discovered servers**.
3. Click on the **Import based** tab.

## Set up an assessment

There are two types of assessments you can create using Azure Migrate: Server Assessment.

**Assessment** | **Details** | **Data**
--- | --- | ---
**Performance-based** | Assessments based on performance data values specified | **Recommended VM size**: Based on CPU and memory utilization data.<br/><br/> **Recommended disk type (standard or premium managed disk)**: Based on the IOPS and throughput of the on-premises disks.
**As on-premises** | Assessments based on on-premises sizing. | **Recommended VM size**: Based on the server size specified<br/><br> **Recommended disk type**: Based on the storage type setting you select for the assessment.


### Run an assessment

Run an assessment as follows:

1. Review the [best practices](best-practices-assessment.md) for creating assessments.
2. In the **Servers** tab, in **Azure Migrate: Server Assessment** tile, click **Assess**.

    ![Assess](./media/tutorial-assess-physical/assess.png)

2. In **Assess servers**, specify a name for the assessment.
3. In **Discovery source**, select **Machines added via import to Azure Migrate**
3. Click **View all** to review the assessment properties.

    ![Assessment properties](./media/tutorial-assess-physical/view-all.png)

3. In **Select or create a group**, select **Create New**, and specify a group name. A group gathers one or more VMs together for assessment.
4. In **Add machines to the group**, select servers to add to the group.
5. Click **Create Assessment** to create the group, and run the assessment.

    ![Create an assessment](./media/tutorial-assess-physical/assessment-create.png)

6. After the assessment is created, view it in **Servers** > **Azure Migrate: Server Assessment** > **Assessments**.
7. Click **Export assessment**, to download it as an Excel file.



## Review an assessment

An assessment describes:

- **Azure readiness**: Whether servers are suitable for migration to Azure.
- **Monthly cost estimation**: The estimated monthly compute and storage costs for running the servers in Azure.
- **Monthly storage cost estimation**: Estimated costs for disk storage after migration.

### View an assessment

1. In **Migration goals** >  **Servers**, click **Assessments** in **Azure Migrate: Server Assessment**.
2. In **Assessments**, click on an assessment to open it.

    ![Assessment summary](./media/tutorial-assess-physical/assessment-summary.png)

### Review Azure readiness

1. In **Azure readiness**, verify whether the servers are ready for migration to Azure.
2. Review the status:
    - **Ready for Azure**: Azure Migrate recommends a VM size and cost estimates for VMs in the assessment.
    - **Ready with conditions**: Shows issues and suggested remediation.
    - **Not ready for Azure**: Shows issues and suggested remediation.
    - **Readiness unknown**: Used when Azure Migrate can't assess readiness, due to data availability issues.

2. Click on an **Azure readiness** status. You can view server readiness details, and drill down to see server details, including compute, storage, and network settings.

### Review cost details

This view shows the estimated compute and storage cost of running VMs in Azure.

1. Review the monthly compute and storage costs. Costs are aggregated for all servers in the assessed group.

    - Cost estimates are based on the size recommendations for a machine, and its disks and properties.
    - Estimated monthly costs for compute and storage are shown.
    - The cost estimation is for running the on-premises servers as IaaS VMs. Azure Migrate Server Assessment doesn't consider PaaS or SaaS costs.

2. You can review monthly storage cost estimates. This view shows aggregated storage costs for the assessed group, split over different types of storage disks.
3. You can drill down to see details for specific VMs.

> [!NOTE]
> Confidence ratings are not assigned to assessments of servers imported using .CSV file into Azure Migrate. 

## Next steps

In this tutorial, you:

> [!div class="checklist"]
> * Imported servers to Azure Migrate: Server Assessment using a .CSV file.
> * Created and reviewed an assessment

Continue to [deploy an appliance](./migrate-appliance.md) to get assessments of better accuracy, and to group your servers using [dependency analysis](./concepts-dependency-visualization.md).
