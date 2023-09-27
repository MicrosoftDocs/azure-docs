---
title: Build a business case or assess servers using an imported CSV file
description: Describes how to discover on-premises servers for migration to Azure using an imported CSV file in Azure Migrate
author: rashi-ms
ms.author: rajosh
ms.manager: ronai
ms.topic: tutorial
ms.date: 09/21/2023
ms.service: azure-migrate
ms.custom: engagement-fy23

---

# Tutorial: Build a business case or assess servers using an imported CSV file

As part of your migration journey to Azure, you discover your on-premises inventory and workloads.

This tutorial shows you how to build a business case or assess on-premises machines with the Azure Migrate: Discovery and Assessment tool, using an imported comma-separate values (CSV) file. 

If you use a CSV file, you don't need to set up the Azure Migrate appliance to discover servers. You can control the data you share in the file, and much of the data is optional. This method is useful if:

- You want to create a quick, initial business case or assessment before you deploy the appliance.
- You can't deploy the Azure Migrate appliance in your organization.
- You can't share credentials that allow access to on-premises servers.
- Security constraints prevent you from gathering and sending data collected by the appliance to Azure.

> [!NOTE]
> You can't migrate servers imported using a CSV file.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Set up an Azure account
> * Set up an Azure Migrate project
> * Prepare a CSV file
> * Import the file
> * Assess servers

> [!NOTE]
> Tutorials show the quickest path for trying out a scenario, and use default options where possible.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

- You can add up to 20,000 servers in a single CSV file, and in an Azure Migrate project. 
- Operating system names specified in the CSV file must contain and match [supported names](#supported-operating-system-names).

## Prepare an Azure user account

To create an Azure Migrate project, you need an account with:

- Contributor or Owner permissions on an Azure subscription.
- Permissions to register Azure Active Directory apps.

If you just created a free Azure account, you're the owner of your subscription. If you're not the subscription owner, work with the owner to assign the permissions as follows:

1. In the Azure portal, search for "subscriptions", and under **Services**, select **Subscriptions**.

    ![Search box to search for the Azure subscription](./media/tutorial-discover-import/search-subscription.png)

1. In the **Subscriptions** page, select the subscription in which you want to create an Azure Migrate project.

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | Role | Contributor or Owner |
    | Assign access to | User |
    | Members | azmigrateuser |

    ![Add role assignment page in Azure portal.](../../includes/role-based-access-control/media/add-role-assignment-page.png)

1. In the portal, search for users, and under **Services**, select **Users**.

1. In **User settings**, verify that Azure AD users can register applications (set to **Yes** by default).

    ![Verify in User Settings that users can register Active Directory apps](./media/tutorial-discover-import/register-apps.png)

## Set up a project

Set up a new Azure Migrate project if you don't have one.

1. In the Azure portal > **All services**, search for **Azure Migrate**.
2. Under **Services**, select **Azure Migrate**.
3. In **Get started**, select **Create project**.
5. In **Create project**, select your Azure subscription and resource group. Create a resource group if you don't have one.
6. In **Project Details**, specify the project name and the geography in which you want to create the project. Review supported geographies for [public](migrate-support-matrix.md#public-cloud) and [government clouds](migrate-support-matrix.md#azure-government).

   ![Boxes for project name and region](./media/tutorial-discover-import/new-project.png)  
    > [!Note]
    > - Use the **Advanced** configuration section to create an Azure Migrate project with private endpoint connectivity. [Learn more](discover-and-assess-using-private-endpoints.md#create-a-project-with-private-endpoint-connectivity).
    > - Ensure that you allow network access to the Azure vNet (*selected during project creation with private endpoint connectivity*) from the IP address of the machine that you choose to upload the CSV file from. 

7. Select **Create**.
8. Wait a few minutes for the Azure Migrate project to deploy.

The **Azure Migrate: Discovery and assessment** tool is added by default to the new project.

![Page showing Server Assessment tool added by default](./media/tutorial-discover-import/added-tool.png)

## Prepare the CSV

Download the CSV template and add server information to it.

### Download the template

1. In **Migration goals** > **Servers** > **Azure Migrate: Discovery and assessment**, select **Discover**.
2. In **Discover machines**, select **Import using CSV**.
3. Select **Download** to download the CSV template. Alternatively, you can [download it directly](https://go.microsoft.com/fwlink/?linkid=2109031).

    ![Download CSV template](./media/tutorial-discover-import/download-template.png)

### Add server information

Gather server data and add it to the CSV file.

- To gather data, you can export it from tools you use for on-premises server management, such as VMware vSphere or your configuration-management database (CMDB).
- To review sample data, download our [example file](https://go.microsoft.com/fwlink/?linkid=2109031).

The following table summarizes the file fields to fill in:

**Field name** | **Mandatory** | **Details**
--- | --- | ---
**Server name** | Yes | We recommend specifying the fully qualified domain name (FQDN).
**IP address** | No | Server address.
**Cores** | Yes | Number of processor cores allocated to the server.
**Memory** | Yes | Total RAM, in MB, allocated to the server.
**OS name** | Yes | Server operating system. <br/> Operating system names that match or contain the names in [this](#supported-operating-system-names) list are recognized by the assessment.
**OS version** | No | Server operating system version.
**OS architecture** | No | Server OS architecture <br/> Valid values are: x64, x86, amd64, 32-bit or 64-bit
**Server type** | No |Type of server <br/> Valid values are: Virtual, Physical
**Hypervisor** | No | If server type is Virtual, specify hypervisor name <br/> Valid values are: *VMware*, *Hyper-V*
**Number of disks** | No | Not needed if individual disk details are provided.
**Storage in use (In GB)** | No | You can add how much storage is in use per server.<br/> This field will **only be used in Azure VMware Solution assessment** sizing logic.
**Disk 1 size**  | No | Maximum size of disk, in GB.<br/>You can add details for more disks by [adding columns](#add-multiple-disks) in the template. You can add up to twenty disks.
**Disk 1 read ops** | No | Disk read operations per second.
**Disk 1 write ops** | No | Disk write operations per second.
**Disk 1 read throughput** | No | Data read from the disk per second, in MB per second.
**Disk 1 write throughput** | No | Data written to disk per second, in MB per second.
**CPU utilization percentage** | No | Percentage of CPU used.
**Memory utilization percentage** | No | Percentage of RAM used.
**Total disks read ops** | No | Disk-read operations per second.
**Total disks write ops** | No | Disk-write operations per second.
**Total disks read throughput** | No | Data read from the disk, in MB per second.
**Total disks write throughput** | No | Data written to disk, in MB per second.
**Network In throughput** | No | Data received by the server, in MB per second.
**Network Out throughput** | No | Data transmitted by the server, in MB per second.
**Firmware type** | No | Server firmware. Values can be "BIOS" or "UEFI".
**MAC address**| No | Server MAC address.

### Add operating systems

Assessment recognizes specific operating system names. Any name you specify must exactly match one of the strings in the [supported names list](#supported-operating-system-names).

### Add multiple disks

The template provides default fields for the first disk. You can add similar columns for up to twenty disks.

For example, to specify all fields for a second disk, add these columns:

- Disk 2 size
- Disk 2 read ops
- Disk 2 write ops
- Disk 2 read throughput
- Disk 2 write throughput

## Import the server information

After adding information to the CSV template, import the CSV file.

1. In **Migration goals** > **Servers** > **Azure Migrate: Discovery and assessment**, select **Discover**.
1. In **Discover machines**, select **Import using CSV** 
1. Upload the .csv file and select **Import**.
3. The import status is shown.
    - If warnings appear in the status, you can either fix them or continue without addressing them.
    - To improve assessment accuracy, improve the server information as suggested in warnings.
    - To view and fix warnings, select **Download warning details .CSV**. This operation downloads the CSV with warnings included. Review the warnings and fix issues as needed.
    - If errors appear in the status so that the import status is **Failed**, you must fix those errors before you can continue with the import:
        1. Download the CSV, which now includes error details.
        1. Review and address the errors as necessary.
        1. Upload the modified file again.
4. When the import status is **Completed**, the server information has been imported. Refresh if the import process doesn't seem to be complete.

## Update server information

You can update the information for a server by importing the data for the server again with the same **Server name**. You can't modify the **Server name** field. Deleting servers is currently not supported.

## Verify servers in the portal

To verify that the servers appear in the Azure portal after discovery:

1. Open the Azure Migrate dashboard.
2. On the **Azure Migrate - Servers** > **Azure Migrate: Discovery and assessment** page, select the icon that displays the count for **Discovered servers**.
3. Select the **Import based** tab.

## Supported operating system names

Operating system names provided in the CSV must contain and match. If they don't, you won't be able to assess them. 

**A-H** | **I-R** | **S-T** | **U-Z**
--- | --- | --- | ---
Asianux 3<br/>Asianux 4<br/>Asianux 5<br/>CentOS<br/>CentOS 4/5<br/>CoreOS Linux<br/>Debian GNU/Linux 4<br/>Debian GNU/Linux 5<br/>Debian GNU/Linux 6<br/>Debian GNU/Linux 7<br/>Debian GNU/Linux 8<br/>FreeBSD | IBM OS/2<br/>macOS X 10<br/>MS-DOS<br/>Novell NetWare 5<br/>Novell NetWare 6<br/>Oracle Linux<br/>Oracle Linux 4/5<br/>Oracle Solaris 10<br/>Oracle Solaris 11<br/>Red Hat Enterprise Linux 2<br/>Red Hat Enterprise Linux 3<br/>Red Hat Enterprise Linux 4<br/>Red Hat Enterprise Linux 5<br/>Red Hat Enterprise Linux 6<br/>Red Hat Enterprise Linux 7<br/>Red Hat Fedora | SCO OpenServer 5<br/>SCO OpenServer 6<br/>SCO UnixWare 7<br/> Serenity Systems eComStation<br/>Serenity Systems eComStation 1<br/>Serenity Systems eComStation 2<br/>Sun Microsystems Solaris 8<br/>Sun Microsystems Solaris 9<br/><br/>SUSE Linux Enterprise 10<br/>SUSE Linux Enterprise 11<br/>SUSE Linux Enterprise 12<br/>SUSE Linux Enterprise 8/9<br/>SUSE Linux Enterprise 11<br/>SUSE openSUSE | Ubuntu Linux<br/>VMware ESXi 4<br/>VMware ESXi 5<br/>VMware ESXi 6<br/>Windows 10<br/>Windows 2000<br/>Windows 3<br/>Windows 7<br/>Windows 8<br/>Windows 95<br/>Windows 98<br/>Windows NT<br/>Windows Server (R) 2008<br/>Windows Server 2003<br/>Windows Server 2008<br/>Windows Server 2008 R2<br/>Windows Server 2012<br/>Windows Server 2012 R2<br/>Windows Server 2016<br/>Windows Server 2019<br/>Windows Server Threshold<br/>Windows Vista<br/>Windows Web Server 2008 R2<br/>Windows XP Professional

## Business case considerations
- If you import servers by using a CSV file and build a business case:
    - Performance history duration in Azure settings will not be applicable
    - Servers where no performance data is specified will be classified as *unknown* in the business case utilization insights chart and will be sized as-is without rightsizing for Azure cost
    - Servers where server type and virtualization are not specified will be classified as *Not applicable* in virtualization distribution and no virtualization software cost will be added in on-premises cost


## Assessment considerations

- If you import servers by using a CSV file and creating an assessment with sizing criteria as "performance-based":
    - For Azure VM assessment, the performance values you specify (CPU utilization, Memory utilization, Disk IOPS and throughput) are used if you choose performance-based sizing. You will not be able to provide performance history and percentile information. 
    - For Azure VMware Solution assessment, the performance values you specify (CPU utilization, Memory utilization, Storage in use(GB)) are used if you choose performance-based sizing. You will not be able to provide performance history and percentile information. 
- To get an accurate OS suitability/readiness in Azure VM and Azure VMware Solution assessment, please enter the Operating system version and architecture in the respective columns.



## Next steps

In this tutorial, you:

> [!div class="checklist"]
> * Created an Azure Migrate project.
> * Discovered servers using an imported CSV file.
Now,  [build a quick business case](how-to-build-a-business-case.md) or run an assessment for [migration to Azure VMs](./tutorial-assess-vmware-azure-vm.md).
