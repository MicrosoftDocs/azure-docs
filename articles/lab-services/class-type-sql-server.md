---
title: Set up a lab to manage SQL databases
titleSuffix: Azure Lab Services
description: Learn how to set up a lab in Azure Lab Services to manage and develop with Azure SQL Database.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 03/03/2023
---

# Set up a lab to manage and develop with SQL Server

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article describes how to set up a lab for a basic SQL Server management and development class in Azure Lab Services. You learn how to set up a virtual machine template in a lab with [Visual Studio 2019](https://visualstudio.microsoft.com/vs/), [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms), and [Azure Data Studio](https://github.com/microsoft/azuredatastudio). In this lab, you use an [Azure SQL database](/azure/azure-sql/database/sql-database-paas-overview) instance.

Database concepts are one of the introductory courses taught in most of the Computer Science departments in college. Structured Query Language (SQL) is an international standard.  SQL is the standard language for relation database management including adding, accessing, and managing content in a database.  It's most noted for its quick processing, proven reliability, ease, and flexibility of use.

## External resource configuration

To use a shared resource, such as an Azure SQL Database, in Azure Lab Services, you first need to create a virtual network and the resource.

1. Create the virtual network and connect it to the lab. 

    Follow these steps [to create a lab with a shared resource in Azure Lab Services](how-to-create-a-lab-with-shared-resource.md).  
    
    Any resources external to Azure Lab Services are billed separately and aren't included in lab cost estimates.

    To use any external resources, you need to [Connect to your virtual network in Azure Lab Services](how-to-connect-vnet-injection.md) with your lab plan.

    > [!IMPORTANT]
    > [Advanced networking](how-to-connect-vnet-injection.md) must be enabled during the creation of your lab     plan.  It can't be added later.

1. Create a [single database](/azure/azure-sql/database/single-database-create-quickstart?tabs=azure-portal) in Azure SQL:

    1. From the Azure portal menu, choose **Create new resource**.
    1. Choose **SQL Database**, and then select **Create**.
    1. On the **Basics** tab of the **Create SQL database** page, enter the following information:

        | Setting            | Value      |
        | ------------------ | ---------- |
        | **Resource group** | *sqldb-rg* |
        | **Database name**  | *classlabdb* |
        | **Server**         | Select **Create new** and enter the following information: <br/><br/>- **Server name**: Enter a unique server name. </br>- **Location**: If possible, enter the same location as the lab account and peered vnet to minimize latency. <br/>- **Authentication method**: *Use SQL authentication* </br>- **Server admin login**: *azureuser* </br>- **Password**: Enter a memorable password. Passwords must be at least eight characters in length and contain special characters.<br/><br/>Select **OK**, to confirm the server details. |
        | **Compute + storage** | Select **Configure database** and enter the following information: <br/><br/>- **Service tier**: *General Purpose*</br>- **Compute tier**: select the autoscaled *Serverless* option. <br/>- **Max vCores**: *4* <br/>- **Min vCores**: 1 <br/>- **Auto-pause delay**: keep the default value of 1 hour.<br/><br/>Select **Apply**.

    1. On the **Networking** tab:

        1. Select **Private endpoint** for the **Connectivity method**.
        1. Under the **Private endpoints** section, select **Add private endpoint**.
        1. On the **Create private endpoint** flyout, enter the following information, and then select **OK**:

            | Setting           | Value      |
            | ----------------- | ---------- |
            | **Resource group** | Select the same resource group as the virtual network that is connected to the lab plan or lab account. |
            | **Location** | Select the same location as the virtual network. |
            | **Name** | Enter *labsql-endpt*. |
            | **Target sub-resource** | Leave default value of *SqlServer*. |
            | **Virtual network** | Select the same virtual network peered to the lab plan or lab account. |
            | **Subnet** | Select the subnet you want the endpoint hosted in.  The IP address assigned to the endpoint is from the subnet's range. |
            | **Integrate with private DNS** | Select **No**. For simplicity, you use Azure's DNS over own private DNS zone or our own DNS servers. |

    1. On the **Additional settings** tab

        For the **Use existing data** setting, choose **Sample**.  The database is created with the *AdventureWorksLT* sample database.

    1. Select **Review + create**, and then select **Create** to create the Azure SQL database.

Alternately, Azure SQL also provides other deployment options, such as [elastic pool](/azure/azure-sql/database/elastic-pool-overview#create-a-new-sql-database-elastic-pool-by-using-the-azure-portal), [managed instance](/azure/azure-sql/managed-instance/instance-create-quickstart), or [SQL virtual machine](/azure/azure-sql/virtual-machines/windows/sql-vm-create-portal-quickstart).

Once the SQL database deployment successfully completes, you can create the lab and install software on the lab template machine.

## Lab configuration

[!INCLUDE [must have subscription](./includes/lab-services-class-type-subscription.md)]

### Lab plan settings

[!INCLUDE [must have lab plan](./includes/lab-services-class-type-lab-plan.md)]

This lab uses the Visual Studio 2019 Community (latest release) on Windows 10 Enterprise N (x64) Azure Marketplace image as the base VM image. You first need to enable this image in your lab plan to let lab creators select the image as a base image for their lab. 

Follow these steps to [enable these Azure Marketplace images available to lab creators](specify-marketplace-images.md). Select the *Visual Studio 2019 Community (latest release) on Windows 10 Enterprise N (x64)* Azure Marketplace image.

### Lab settings

First create a lab for your lab plan. [!INCLUDE [create lab](./includes/lab-services-class-type-lab.md)]  

Use the following settings when you create the lab:

| Lab setting | Value and description |
| ------------ | ------------------ |
| Virtual Machine Size | Medium. This size is best suited for relational databases, in-memory caching, and analytics. |
| Virtual Machine Image | Visual Studio 2019 Community (latest release) on Windows 10 Enterprise N (x64) |

Now that you created the lab, you can modify the template machine with the required software.

## Template configuration

### Visual Studio

The selected image includes [Visual Studio 2019 Community](https://visualstudio.microsoft.com/vs/community/).  All workloads and tool sets are already installed on the image.  You can use the Visual Studio Installer to [install any optional tools](/visualstudio/install/modify-visual-studio?view=vs-2019&preserve-view=true) you may want.  [Sign in to Visual Studio](/visualstudio/ide/signing-in-to-visual-studio?view=vs-2019&preserve-view=true#how-to-sign-in-to-visual-studio) to unlock the community edition.

Visual Studio includes the **Data storage and processing** tool set, which includes SQL Server Data Tools (SSDT).  For more information about SSDT's capabilities, see [SQL Server Data Tools overview](/sql/ssdt/sql-server-data-tools).  To verify the connection to the shared SQL Server for the class is successful, see [connect to a database and browse existing objects](/sql/ssdt/how-to-connect-to-a-database-and-browse-existing-objects). If prompted, add the template machine IP address to the [list of allowed computers](/azure/azure-sql/database/firewall-configure) that can connect to your SQL Server instance.

Visual Studio supports several workloads including **Web & cloud** and **Desktop & mobile** workloads.  Both of these workloads support SQL Server as a data source. For more information using ASP.NET Core to SQL Server, see [build an ASP.NET Core and SQL Database app in Azure App Service](../app-service/tutorial-dotnetcore-sqldb-app.md) tutorial.  Use the [System.Data.SqlClient](/dotnet/api/system.data.sqlclient) library to connect to a SQL Database from a [Xamarin](/xamarin) app.

### Install Azure Data Studio

[Azure Data Studio](https://github.com/microsoft/azuredatastudio) is a multi-database, cross-platform desktop environment for data professionals using the family of on-premises and cloud data platforms on Windows, macOS, and Linux.

1. Download the [Azure Data Studio *system* installer for Windows](https://go.microsoft.com/fwlink/?linkid=2127432). To find installers for other supported operating systems, go to the [Azure Data Studio](/azure-data-studio/download-azure-data-studio) download page.

1. On the **License Agreement** page, select **I accept the agreement**, and then select **Next**.

1. On the **Select Destination Location** page, select **Next**.

1. On the **Select Start Menu Folder** page, select **Next**.

1. On the **Select Additional Tasks** page, check **Create a desktop icon** if you want a desktop icon, and then select **Next**.

1. On the **Ready to Install**, select **Next**.

1. Wait for the installer to run.  Select **Finish**.

Now that you have installed Azure Data Studio, you can set up the connection to the Azure SQL database.

1. On the **Welcome** page for Azure Data Studio, select the **New Connection** link.

1. In the **Connection Details** box, fill in necessary information.

    - Set **Server** to *classlabdbserver.database.windows.net*
    - Set **User** name to *azureuser*
    - Set **Password** to password used to create the database.
    - Check **Remember Password**.
    - For **Database**, select *classlabdb*.

1. Select **Connect**.

### Install SQL Server Management Studio

[SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) is an integrated environment for managing any SQL infrastructure.  SSMS is a tool used by database administrators to deploy, monitor, and upgrade data infrastructure.

1. [Download Sql Server Management Studio](https://aka.ms/ssmsfullsetup), and then start the installer.

1. On the **Welcome** page, select **Install**.

1. On the **Setup Completed** page, select **Close**.

1. Start Sql Server Management Studio.

1. On the **Dependency Configuration process** page, select **Close**.


Now that you installed SSMS, you can [connect and query a SQL Server](/sql/ssms/tutorials/connect-query-sql-server). When setting up the connection, use the following values:

- **Server type**: *Database Engine*
- **Server name**: *classlabdbserver.database.windows.net*
- **Authentication**: *SQL Server Authentication*
- **Login**: *azureuser*
- **Password**: enter the password you used to create the database.

## Cost estimate

This section provides a cost estimate for running this class for 25 lab users. The estimate doesn't include the cost of running the Azure SQL database. See [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database) for current details on database pricing.

There are 20 hours of scheduled class time. Also, each user gets 10 hours quota for homework or assignments outside scheduled class time. The virtual machine size we chose was **Medium**, which is 42 lab units.

- 25 lab users &times; (20 scheduled hours + 10 quota hours) &times; 42 lab units

> [!IMPORTANT]
> The cost estimate is for example purposes only.  For current pricing information, see [Azure Lab Services pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

[!INCLUDE [next steps for class types](./includes/lab-services-class-type-next-steps.md)]
