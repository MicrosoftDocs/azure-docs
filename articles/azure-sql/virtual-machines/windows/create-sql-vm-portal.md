---
title: Provision SQL Server on Azure VM (Azure portal)
description: This detailed guide explains available configuration options when deploying your SQL Server on Azure VM by using the Azure portal. 
services: virtual-machines-windows
documentationcenter: na
author: bluefooted
tags: azure-resource-manager
ms.assetid: 1aff691f-a40a-4de2-b6a0-def1384e086e
ms.service: virtual-machines-sql
ms.subservice: deployment

ms.topic: how-to
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: infrastructure-services
ms.date: 12/21/2021
ms.author: pamela
ms.reviewer: mathoma
ms.custom: contperf-fy22q1-portal
---
# Provision SQL Server on Azure VM (Azure portal)

[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides a detailed description of the available configuration options when deploying your SQL Server on Azure Virtual Machines (VMs) by using the Azure portal. For a quick guide, see the [SQL Server VM quickstart](sql-vm-create-portal-quickstart.md) instead. 


## Prerequisites 

An Azure subscription. Create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) to get started. 


## <a id="select"></a> Choose Marketplace image

Use the Azure Marketplace to choose one of several pre-configured images from the virtual machine gallery. 

The Developer edition is used in this article because it is a full-featured, free edition of SQL Server for development testing. You pay only for the cost of running the VM. However, you are free to choose any of the images to use in this walkthrough. For a description of available images, see the [SQL Server Windows Virtual Machines overview](sql-server-on-azure-vm-iaas-what-is-overview.md#payasyougo).

Licensing costs for SQL Server are incorporated into the per-second pricing of the VM you create and varies by edition and cores. However, SQL Server Developer edition is free for development and testing, not production. Also, SQL Express is free for lightweight workloads (less than 1 GB of memory, less than 10 GB of storage). You can also bring-your-own-license (BYOL) and pay only for the VM. Those image names are prefixed with {BYOL}. For more information on these options, see [Pricing guidance for SQL Server Azure VMs](pricing-guidance.md).

To choose an image, follow these steps: 

1. Select **Azure SQL** in the left-hand menu of the Azure portal. If **Azure SQL** is not in the list, select **All services**, then type *Azure SQL* in the search box. You can select the star next to **Azure SQL** to save it as a favorite to pin it to the left-hand navigation. 

1. Select **+ Create** to open the **Select SQL deployment option** page. Select the **Image** drop-down and then type **2019** in the SQL Server image search box. Choose a SQL Server image, such as **Free SQL Server License: SQL 2019 on Windows Server 2019** from the drop-down.  Choose **Show details** for additional information about the image. 


   ![Select SQL VM image](./media/create-sql-vm-portal/select-sql-vm-image-portal.png)

1. Select **Create**.


## Basic settings

The **Basics** tab allows you to select the subscription, resource group, and instance details. 

Using a new resource group is helpful if you are just testing or learning about SQL Server deployments in Azure. After you finish with your test, delete the resource group to automatically delete the VM and all resources associated with that resource group. For more information about resource groups, see [Azure Resource Manager Overview](../../../active-directory-b2c/overview.md).

On the **Basics** tab, provide the following information:

*  Under **Project Details**, make sure the correct subscription is selected. 
*  In the **Resource group** section, either select an existing resource group from the list or choose **Create new** to create a new resource group. A resource group is a collection of related resources in Azure (virtual machines, storage accounts, virtual networks, etc.). 

  ![Subscription](./media/create-sql-vm-portal/basics-project-details.png)

*  Under **Instance details**:

    1. Enter a unique **Virtual machine name**.  
    1. Choose a location for your **Region**. 
    1. For the purpose of this guide, leave **Availability options** set to _No infrastructure redundancy required_. To find out more information about availability options, see [Availability](../../../virtual-machines/availability.md). 
    1. In the **Image** list, select _Free SQL Server License: SQL Server 2019 Developer on Windows Server 2019_ if it's not already selected.
    1. Choose **Standard** for **Security type**. 
    1. Select **See all sizes** for the **Size** of the virtual machine and search for the **E4ds_v5** offering. This is one of the minimum recommended VM sizes for SQL Server on Azure VMs. If this is for testing purposes, be sure to clean up your resources once you're done with them to prevent any unexpected charges. For production workloads, see the recommended machine sizes and configuration in [Performance best practices for SQL Server in Azure Virtual Machines](./performance-guidelines-best-practices-vm-size.md).

    ![Instance details](./media/create-sql-vm-portal/basics-instance-details.png)

> [!IMPORTANT]
> The estimated monthly cost displayed on the **Choose a size** window does not include SQL Server licensing costs. This estimate is the cost of the VM alone. For the Express and Developer editions of SQL Server, this estimate is the total estimated cost. For other editions, see the [Windows Virtual Machines pricing page](https://azure.microsoft.com/pricing/details/virtual-machines/windows/) and select your target edition of SQL Server. Also see the [Pricing guidance for SQL Server Azure VMs](pricing-guidance.md) and [Sizes for virtual machines](../../../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

* Under **Administrator account**, provide a username and password. The password must be at least 12 characters long and meet the [defined complexity requirements](../../../virtual-machines/windows/faq.yml#what-are-the-password-requirements-when-creating-a-vm-).

   ![Administrator account](./media/create-sql-vm-portal/basics-administrator-account.png)

* Under **Inbound port rules**, choose **Allow selected ports** and then select **RDP (3389)** from the drop-down. 

   ![Inbound port rules](./media/create-sql-vm-portal/basics-inbound-port-rules.png)

You also have the option to enable the [Azure Hybrid Benefit](../../../virtual-machines/windows/hybrid-use-benefit-licensing.md) to use your own SQL Server license and save on licensing cost. 


## Disks

On the **Disks** tab, configure your disk options. 

* Under **OS disk type**, select the type of disk you want for your OS from the drop-down. Premium is recommended for production systems but is not available for a Basic VM. To use a Premium SSD, change the virtual machine size. 
* Under **Advanced**, select **Yes** under use **Managed Disks**.

Microsoft recommends Managed Disks for SQL Server. Managed Disks handles storage behind the scenes. In addition, when virtual machines with Managed Disks are in the same availability set, Azure distributes the storage resources to provide appropriate redundancy. For more information, see [Azure Managed Disks Overview](../../../virtual-machines/managed-disks-overview.md). For specifics about managed disks in an availability set, see [Use managed disks for VMs in availability set](../../../virtual-machines/availability.md).


  
  
## Networking

On the **Networking** tab, configure your networking options. 

* Create a new **virtual network** or use an existing virtual network for your SQL Server VM. Designate a **Subnet** as well. 

* Under **NIC network security group**, select either a basic security group or the advanced security group. Choosing the basic option allows you to select inbound ports for the SQL Server VM which are the same values configured on the **Basic** tab. Selecting the advanced option allows you to choose an existing network security group, or create a new one. 

* You can make other changes to network settings, or keep the default values.

## Management

On the **Management** tab, configure monitoring and auto-shutdown. 

* Azure enables **Boot diagnostics** by default with the same storage account designated for the VM. On this tab, you can change these settings and enable **OS guest diagnostics**. 
* You can also enable **System assigned managed identity** and **auto-shutdown** on this tab. 

## SQL Server settings

On the **SQL Server settings** tab, configure specific settings and optimizations for SQL Server. You can configure the following settings for SQL Server:

- [Connectivity](#connectivity)
- [Authentication](#authentication)
- [Azure Key Vault integration](#azure-key-vault-integration)
- [Storage configuration](#storage-configuration)
- [SQL instance settings](#sql-instance-settings)
- [Automated patching](#automated-patching)
- [Automated backup](#automated-backup)
- [Machine Learning Services](#machine-learning-services)


### Connectivity

Under **SQL connectivity**, specify the type of access you want to the SQL Server instance on this VM. For the purposes of this walkthrough, select **Public (internet)** to allow connections to SQL Server from machines or services on the internet. With this option selected, Azure automatically configures the firewall and the network security group to allow traffic on the port selected.

> [!TIP]
> By default, SQL Server listens on a well-known port, **1433**. For increased security, change the port in the previous dialog to listen on a non-default port, such as 1401. If you change the port, you must connect using that port from any client tools, such as SQL Server Management Studio (SSMS).

![SQL VM Security](./media/create-sql-vm-portal/azure-sqlvm-security.png)

To connect to SQL Server via the internet, you also must enable SQL Server Authentication, which is described in the next section.

If you would prefer to not enable connections to the Database Engine via the internet, choose one of the following options:

* **Local (inside VM only)** to allow connections to SQL Server only from within the VM.
* **Private (within Virtual Network)** to allow connections to SQL Server from machines or services in the same virtual network.

In general, improve security by choosing the most restrictive connectivity that your scenario allows. But all the options are securable through network security group (NSG) rules and SQL/Windows Authentication. You can edit the NSG after the VM is created. For more information, see [Security Considerations for SQL Server in Azure Virtual Machines](security-considerations-best-practices.md).

### Authentication

If you require SQL Server Authentication, select **Enable** under **SQL Authentication** on the **SQL Server settings** tab.

![SQL Server Authentication](./media/create-sql-vm-portal/azure-sqlvm-authentication.png)

> [!NOTE]
> If you plan to access SQL Server over the internet (the Public connectivity option), you must enable SQL Authentication here. Public access to the SQL Server requires SQL Authentication.

If you enable SQL Server Authentication, specify a **Login name** and **Password**. This login name is configured as a SQL Server Authentication login and a member of the **sysadmin** fixed server role. For more information about Authentication Modes, see [Choose an Authentication Mode](/sql/relational-databases/security/choose-an-authentication-mode).

If you prefer not to enable SQL Server Authentication, you can use the local Administrator account on the VM to connect to the SQL Server instance.

### Azure Key Vault integration

To store security secrets in Azure for encryption, select **SQL Server settings**, and scroll down to  **Azure key vault integration**. Select **Enable** and fill in the requested information. 

![Azure Key Vault integration](./media/create-sql-vm-portal/azure-sqlvm-akv.png)

The following table lists the parameters required to configure Azure Key Vault (AKV) Integration.

| PARAMETER | DESCRIPTION | EXAMPLE |
| --- | --- | --- |
| **Key Vault URL** |The location of the key vault. |`https://contosokeyvault.vault.azure.net/` |
| **Principal name** |Azure Active Directory service principal name. This name is also referred to as the Client ID. |`fde2b411-33d5-4e11-af04eb07b669ccf2` |
| **Principal secret** |Azure Active Directory service principal secret. This secret is also referred to as the Client Secret. |`9VTJSQwzlFepD8XODnzy8n2V01Jd8dAjwm/azF1XDKM=` |
| **Credential name** |**Credential name**: AKV Integration creates a credential within SQL Server and allows the VM to access the key vault. Choose a name for this credential. |`mycred1` |

For more information, see [Configure Azure Key Vault Integration for SQL Server on Azure VMs](azure-key-vault-integration-configure.md).

### Storage configuration


On the **SQL Server settings** tab, under **Storage configuration**, select **Change configuration** to open the **Configure storage** page and specify storage requirements. You can choose to leave the values at default, or you can manually change the storage topology to suit your IOPS needs. For more information, see [storage configuration](storage-configuration.md). 

![Screenshot that highlights where you can change the storage configuration.](./media/create-sql-vm-portal/sql-vm-storage-configuration-provisioning.png)

Under **Data storage**, choose the location for your data drive, the disk type, and the number of disks. You can also select the checkbox to store your system databases on your data drive instead of the local C:\ drive. 

![Screenshot that shows where you can configure the data files storage for your SQL VM](./media/create-sql-vm-portal/storage-configuration-data-storage.png)

Under **Log storage**, you can choose to use the same drive as the data drive for your transaction log files, or you can choose to use a separate drive from the drop-down. You can also choose the name of the drive, the disk type, and the number of disks. 

![Screenshot that shows where you can configure the transaction log storage for your SQL VM](./media/create-sql-vm-portal/storage-configuration-log-storage.png)

Configure your tempdb database settings under **Tempdb storage**, such as the location of the database files, as well as the number of files, initial size, and autogrowth size in MB. Currently, the max number of tempdb files. Currently, during deployment, the max number of tempdb files is 8, but more files can be added after the SQL Server VM is deployed.

![Screenshot that shows where you can configure the tempdb storage for your SQL VM](./media/create-sql-vm-portal/storage-configuration-tempdb-storage.png)

Select **OK** to save your storage configuration settings. 

### SQL instance settings 

Select **Change SQL instance settings** to modify SQL Server configuration options, such as the server collation, max degree of parallelism (MAXDOP), SQL Server min and max memory limits, and whether you want to optimize for ad-hoc workloads. 

![Screenshot that shows where you can configure the SQL Server settings for your SQL VM instance](./media/create-sql-vm-portal/sql-instance-settings.png). 

### SQL Server license

If you're a Software Assurance customer, you can use the [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) to bring your own SQL Server license and save on resources. Select **Yes** to enable the Azure Hybrid Benefit, and then confirm that you have Software Assurance by selecting the checkbox. 

![SQL VM License](./media/create-sql-vm-portal/azure-sqlvm-license.png)

If you chose a free license image, such as the developer edition, the **SQL Server license** option is grayed out. 

### Automated patching

**Automated patching** is enabled by default. Automated patching allows Azure to automatically apply SQL Server and operating system security updates. Specify a day of the week, time, and duration for a maintenance window. Azure performs patching in this maintenance window. The maintenance window schedule uses the VM locale. If you do not want Azure to automatically patch SQL Server and the operating system, select **Disable**.  

![SQL VM automated patching](./media/create-sql-vm-portal/azure-sqlvm-automated-patching.png)

For more information, see [Automated Patching for SQL Server in Azure Virtual Machines](automated-patching.md).

### Automated backup

Enable automatic database backups for all databases under **Automated backup**. Automated backup is disabled by default.

When you enable SQL automated backup, you can configure the following settings:

* Retention period for backups (up to 90 days)
* Storage account, and storage container, to use for backups
* Encryption option and password for backups
* Backup system databases
* Configure backup schedule

To encrypt the backup, select **Enable**. Then specify the **Password**. Azure creates a certificate to encrypt the backups and uses the specified password to protect that certificate. 

Choose **Select Storage Container** to specify the container where you want to store your backups. 

By default the schedule is set automatically, but you can create your own schedule by selecting **Manual**, which allows you to configure the backup frequency, backup time window, and the log backup frequency in minutes.

![SQL VM automated backups](./media/create-sql-vm-portal/automated-backup.png)

For more information, see [Automated Backup for SQL Server in Azure Virtual Machines](automated-backup-sql-2014.md).


### Machine Learning Services

You have the option to enable [Machine Learning Services](/sql/advanced-analytics/). This option lets you use machine learning with Python and R in SQL Server 2017. Select **Enable** on the **SQL Server Settings** window.


## 4. Review + create

On the **Review + create** tab:
1. Review the summary.
1. Select **Create** to create the SQL Server, resource group, and resources specified for this VM.

You can monitor the deployment from the Azure portal. The **Notifications** button at the top of the screen shows basic status of the deployment.

> [!NOTE]
> An example of time for Azure to deploy a SQL Server VM: A test SQL Server VM provisioned to the East US region with default settings takes approximately 12 minutes to complete. You might experience faster or slower deployment times based on your region and selected settings.

## <a id="remotedesktop"></a> Open the VM with Remote Desktop

Use the following steps to connect to the SQL Server virtual machine with Remote Desktop Protocol (RDP):

[!INCLUDE [Connect to SQL Server VM with remote desktop](../../../../includes/virtual-machines-sql-server-remote-desktop-connect.md)]

After you connect to the SQL Server virtual machine, you can launch SQL Server Management Studio and connect with Windows Authentication using your local administrator credentials. If you enabled SQL Server Authentication, you can also connect with SQL Authentication using the SQL login and password you configured during provisioning.

Access to the machine enables you to directly change machine and SQL Server settings based on your requirements. For example, you could configure the firewall settings or change SQL Server configuration settings.

## <a id="connect"></a> Connect to SQL Server remotely

In this walkthrough, you selected **Public** access for the virtual machine and **SQL Server Authentication**. These settings automatically configured the virtual machine to allow SQL Server connections from any client over the internet (assuming they have the correct SQL login).

> [!NOTE]
> If you did not select Public during provisioning, then you can change your SQL connectivity settings through the portal after provisioning. For more information, see  [Change your SQL connectivity settings](ways-to-connect-to-sql.md#change).

The following sections show how to connect over the internet to your SQL Server VM instance.

[!INCLUDE [Connect to SQL Server in a VM Resource Manager](../../../../includes/virtual-machines-sql-server-connection-steps-resource-manager.md)]

  > [!NOTE]
  > This example uses the common port 1433. However, this value will need to be modified if a different port (such as 1401) was specified during the deployment of the SQL Server VM. 


## Next steps

For other information about using SQL Server in Azure, see [SQL Server on Azure Virtual Machines](sql-server-on-azure-vm-iaas-what-is-overview.md) and the [Frequently Asked Questions](frequently-asked-questions-faq.yml).