---
title: Assess servers using imported server data with Azure Migrate Server Assessment
description: Describes how to assess on-premises servers for migration to Azure with Azure Migrate Server Assessment using imported data.
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 10/23/2019
ms.author: raynew
---

# Assess servers using imported data

This article explains how to assess on-premises servers with [Azure Migrate: Server Assessment](migrate-services-overview.md#azure-migrate-server-assessment-tool), by importing server metadata using CSV. With this method of assessment, you don't need to set up the Azure Migrate appliance to create an assessment. This is useful if: 

- You want to create a quick initial assessment before you deploy the appliance.
- You can't deploy the Azure Migrate appliance in your organization.
- You can't share credentials that allow access to on-premises servers.
- Security constraints prevent you from gathering and sending data collected by the appliance to Azure. With an imported file, you can control the data you share, and lots of data (for example providing IP addresses) is optional.


## Before you start

Note that:

- You can add up to a maximum of 20000 servers in a single CSV file.
- You can add up to 20000 servers in an Azure Migrate project using CSV.
- You can upload server information using CSV multiple times to Azure Migrate Server Assessment.
- Although gathering application information is useful when evaluating your on-premises environment for migration, Azure Migrate Server Assessment doesn't currently perform application-level assessment, and doesn't take applications into account when creating an assessment.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Set up an Azure Migrate project.
> * Fill in a CSV file with server information.
> * Import the file to add server information into Azure Migrate Server Assessment.
> * Create and review an assessment.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the How-to articles.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Set Azure permissions for Azure Migrate 

Your Azure account needs permissions to create an Azure Migrate project.

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
6. In **Project Details**, specify the project name, and the geography in which you want to create the project.

    - [Review](migrate-support-matrix.md#supported-geographies) supported geographies. The project geography is used only to store the metadata gathered from on-premises VMs.
    - You can select any target region when you run a migration.

    ![Create an Azure Migrate project](./media/tutorial-assess-import/migrate-project.png)


7. Click **Next**.
8. In **Select assessment tool**, select **Azure Migrate: Server Assessment** > **Next**.

    ![Create an Azure Migrate project](./media/tutorial-assess-import/assessment-tool.png)

9. In **Select migration tool**, select **Skip adding a migration tool for now** > **Next**.
10. In **Review + add tools**, review the settings, and click **Add tools**.
11. Wait a few minutes for the Azure Migrate project to deploy. You'll be taken to the project page. If you don't see the project, you can access it from **Servers** in the Azure Migrate dashboard.


## Prepare the CSV

Download the CSV template, and add server information to it.


### Download the template

1. In **Migration Goals** > **Servers** > **Azure Migrate: Server Assessment**, click **Discover**.
2. In **Discover machines**, select **Import using .CSV**.
3. Click **Download** to download the .CSV template. Alternatively, you can [download it directly](https://go.microsoft.com/fwlink/?linkid=2108404).

    ![Download .CSV template](./media/tutorial-assess-import/download-template.png)


### Add server information

Gather server data, and add it to the CSV file.

- To gather data, you can export it from tools you use for on-premises server management, such as VMware vSphere or your configuration management database (CMDB).
- To review sample data, download our [example file](https://go.microsoft.com/fwlink/?linkid=2108405).


The following table summarizes the file fields to fill in.

**Field name** | **Mandatory** | **Details**
--- | --- | ---
**Server name** | Yes | We recommend specifying the FQDN. 
**IP address** | No | Server address.
**Number of cores** | Yes | The number of processor cores allocated to the server.
**Memory** | Yes | Total RAM (MB) allocated to the server.
**OS name** | Yes | Server operating system.
**OS version** | No | Server operating system version.
**Number of disks** | No | Not needed if individual disk details are provided.
**Disk 1 size**  | No | Maximum size of disk (GB)<br/> You can add details for more disks by [adding columns](#add-multiple-disks) in the template. You can add up to eight disks.
**Disk 1 read ops** | No | Disk read operations per second.
**Disk 1 write ops** | No | Disk write operations per second.
**Disk 1 read throughput** | No | Data read from the disk per second in MB per second.
**Disk 1 write throughput** | No | Data written to disk per second in MB per second.
**CPU utilization percentage** | No | Percentage utilization of CPU.
**Memory utilization percentage** | No | Percentage utilization of RAM.
**Total disks read ops** | No | Disk read operations per second.
**Total disks write ops** | No | Disk write operations per second.
**Total disks read throughput** | No | Data read from the disk in MB per second.
**Total disks write throughput** | No | Data written to disk in MB per second.
**Network in throughput** | No | Data received by the server in MB per second.
**Network out throughput** | No | Data transmitted by the server in MB per second.
**Firmware type** | No | Server firmware. Values can be "BIOS" or "UEFI"
**Server type** | No | Values can be "Physical" or "Virtual".
**Hypervisor** | No | Hypervisor on which a machine is running. <br/> Values can be "VMware", "Hyper-V", "Xen", "AWS", "GCP", or "Other".
**Hypervisor version number** | No | Hypervisor version.
**Virtual machine ID** | No | VM identifier. This is the **InstanceUUid** for VMware vCenter VM, or **Hyper-V VM ID** for Hyper-V.
**Virtual machine manager ID** | No | This is the **InstanceUUid** for VMWare vCenter. Not needed for Hyper-V.
**MAC address**| No | Server MAC address.
**BIOS ID** | No | Server BIOS ID.
**Custom server ID**| No | Local unique server IDs on-premises. <br/> Useful for tracking the imported server by local ID. 
**Application 1 name** | No | Name of workloads running on the server.<br/> You can add details for more apps by [adding columns](#add-multiple-applications) in the template. You can add up to five applications.
**Application 1 type** | No | Type of workload running in the server
**Application 1 version** | No | Version of the workload running on the server.
**Application 1 license expiry** | No | License expiry of the for the workload (if applicable).
**Business unit** | No | Business unit the server belongs to.
**Business owner** | No | Business unit owner.
**Business application name** | No | Name of the application to which the app belongs.
**Location** | No | Datacenter in which the server is located.
**Server decommission date** | No | Decommission date of physical server or the underlying physical server of the virtual server

### Add operating systems

Assessment recognizes specific operating system names. Any operating system name you specify must match one of the options in the [supported names](#supported-operating-system-names) list.


### Add multiple disks

The template provides default fields for the first disk.  You can add similar columns for up to 8 disks. 

For example, to specify all fields for a second disk, add the columns:

Disk 2 size
Disk 2 read ops
Disk 2 write ops
Disk 2 read throughput
Disk 2 write throughput

Optionally you can add specific fields only for a disk.


### Add multiple applications

The template provides fields for a single application. You can add similar columns for up to five apps.  

For example, to specify all fields for a second app, add the columns:

Application 2 name
Application 2 type
Application 2 version
Application 2 license expiry


Optionally you can add specific fields only for an app.

> [!NOTE]
> App information is useful when evaluating your on-premises environment for migration. However, Azure Migrate Server Assessment doesn't currently perform app-level assessment, and doesn't take apps into account when creating an assessment.


## Upload the server information

After adding information to the CSV template, import the servers into Azure Migrate: Server Assessment.

1. In Azure Migrate > **Discover machines**, browse to the filled out template.
2. Click **Import**.
3. The import status is shown. 
    - If warnings appear in the status, you can either fix them, or continue without addressing them.
    - Improving server information as suggested in warnings improves assessment accuracy.
    - To view and fix warnings if they appear, click **Download warning details .CSV**. This downloads the CSV, with warnings added. You can review the warnings, and fix issues as needed. 
    If errors appear in the status (the import status is **Failed**), you need to fix these before you can continue with the import. To do this, download the CSV, that now has error details added. Review and address the errors as needed. Then upload the modified file again.
4. When the import status is **Completed**, the server information is imported.


> [!NOTE]
> To update server information uploaded to Azure Migrate, upload data for the server again, using the same **Server name**. Note that the **Server name** field can't be modified after importing the template. Deleting servers isn't currently supported.

## Updating server information

You can update a server information by uploading the data for the server again with the same **Server name**. You cannot modify the **Server name** field. 

Deleting servers is currently not supported.

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
> Confidence ratings are not assigned to assessments of servers imported into Azure Migrate Server Assessment using CSV.


## Supported operating system names

Name | Name
--- | ---
**A - H** | 
Apple Mac OS X 10 | Asianux 3<br/>Asianux 4<br/>Asianux 5
CentOS<br/>CentOS 4/5 | CoreOS Linux 
Debian GNU/Linux 4<br/>Debian GNU/Linux 5<br/>Debian GNU/Linux 6<br/>Debian GNU/Linux 7<br/>Debian GNU/Linux 8 | FreeBSD 
**I - R** | 
IBM OS/2 | MS-DOS |
Novell NetWare 5<br/>Novell NetWare 6 | Oracle Linux<br/> Oracle Linux 4/5<br/>Oracle Solaris 10<br/> Oracle Solaris 11 
Red Hat Enterprise Linux 2<br/>Red Hat Enterprise Linux 3<br/>Red Hat Enterprise Linux 4<br/>Red Hat Enterprise Linux 5<br/>Red Hat Enterprise Linux 6<br/>Red Hat Enterprise Linux 7<br/>Red Hat Fedora | 
**S-T** | 
SCO OpenServer 5<br/>SCO OpenServer 6<br/>SCO UnixWare 7 | Serenity Systems eComStation 1<br/>Serenity Systems eComStation 2
Sun Microsystems Solaris 8<br/>Sun Microsystems Solaris 9 | SUSE Linux Enterprise 10<br/> SUSE Linux Enterprise 11<br/>SUSE Linux Enterprise 12<br/>SUSE Linux Enterprise 8/9<br/>SUSE Linux Enterprise 11<br/>SUSE openSUSE
**U-Z** | 
Ubuntu Linux | VMware ESXi 4<br/>VMware ESXi 5<br/>VMware ESXi 6
Windows 10<br/>Windows 2000<br/>Windows 3<br/>Windows 7<br/>Windows 8<br/>Windows 95<br/>Windows 98<br/>Windows NT<br/>Windows Server (R) 2008<br/>Windows Server 2003 | Windows Server 2008<br/>Windows Server 2008 R2<br/>Windows Server 2012<br/>Windows Server 2012 R2<br/>Windows Server 2016<br/>Windows Server 2019<br/>Windows Server Threshold<br/>Windows Vista<br/>Windows Web Server 2008 R2<br/>Windows XP Professional
    

## Next steps

In this tutorial, you:

> [!div class="checklist"]
> * Imported servers to Azure Migrate: Server Assessment using CSV.
> * Created and reviewed an assessment

Now, [deploy an appliance](./migrate-appliance.md) for more accurate assessments, and gather servers together into groups for deeper assessment using [dependency analysis](./concepts-dependency-visualization.md).
