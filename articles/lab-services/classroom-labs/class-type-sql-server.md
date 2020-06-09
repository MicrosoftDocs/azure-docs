---
title: Set up a lab to manage and develop with Azure SQL Database | Azure Lab Services
description: Learn how to set up a lab to manage and develop with Azure SQL Database.
services: lab-services
author: emaher

ms.service: lab-services
ms.topic: article
ms.date: 06/05/2020
ms.author: enewman
---

# Set up a lab to manage and develop with SQL Server

This article describes how to set up a lab for a basic SQL Server management and development class in Azure Lab Services.  Database concepts are one of the introductory courses taught in most of the Computer Science departments in college. Structured Query Language (SQL) is an international standard.  SQL is the standard language for relation database management including adding, accessing, and managing content in a database.  It is most noted for its quick processing, proven reliability, ease, and flexibility of use.

In this article, we'll show how to set up a virtual machine template in a lab with [Visual Studio 2019](https://visualstudio.microsoft.com/vs/), [SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15), and [Azure Data Studio](https://github.com/microsoft/azuredatastudio).  For this lab, we will use one shared [SQL Server Database](https://docs.microsoft.com/azure/sql-database/sql-database-technical-overview) for the entire lab. [Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-technical-overview) is Platform as a Service (PaaS) Database Engine offering from Azure.

## Lab configuration

To set up this lab, you need an Azure subscription and lab account to get started. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin. Once you get an Azure subscription, you can create a new lab account in Azure Lab Services. For more information about creating a new lab account, see [tutorial to setup a lab account](https://docs.microsoft.com/azure/lab-services/classroom-labs/tutorial-setup-lab-account). You can also use an existing lab account.

### Lab account settings

Enable the settings described in the table below for the lab account. For more information about how to enable marketplace images, see [Specify Marketplace images available to lab creators](specify-marketplace-images.md).

| Lab account setting | Instructions |
| ------------------- | ------------ |
| Marketplace image | Enable the ‘Visual Studio 2019 Community (latest release) on Windows 10 Enterprise N (x64)’ image for use within your lab account. |

### Shared resource configuration

To use a shared resource in Lab Services, you first need to create the virtual network and the resources itself.  To create the virtual network and connect it to the lab, follow [how to create a lab with a shared resource in Azure Lab Services](how-to-create-a-lab-with-shared-resource.md).  Remember, any resources external to Lab Services will be billed separately and will not be included in lab cost estimates.

>[!WARNING]
>Shared resources for a lab should be setup before the lab is created.  If the vnet is not [peered to the lab account](how-to-connect-peer-virtual-network.md) *before* the lab is created, the lab will not have access to the shared resource.

Now that the networking side of things is handled, lets create a SQL Server Database.  We are going to create a [single database](https://docs.microsoft.com/azure/sql-database/sql-database-single-database-get-started?tabs=azure-portal) as it is the quickest deployment option for Azure SQL Database.  For other deployment options, create an [elastic pool](https://docs.microsoft.com/azure/sql-database/sql-database-elastic-pool#creating-a-new-sql-database-elastic-pool-using-the-azure-portal), [managed instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-get-started), or [SQL virtual machine](https://docs.microsoft.com/azure/virtual-machines/windows/sql/quickstart-sql-vm-create-portal).

1. From the Azure portal menu, choose **Create new resource**.
2. Choose **SQL Database** and click the **Create** button.
3. On the **Basics** tab of the **Create SQL database** form, select the resource group for the database.  We will use *sqldb-rg*.
4. For **Database name**, enter *classlabdb*.
5. Under the **Server** setting, click **Create new** to create a new server to hold the database.
6. On the **New server** flyout, enter the Server name.  We will use *classlabdbserver*.  The server name must be globally unique.
7. Enter *azureuser* for the **Server admin login**.
8. Enter a memorable password.  Password must be at least eight characters in length and contain special characters.
9. Choose region for the **location**.  If possible, enter the same location as the lab account and peered vnet to minimize latency.
10. Click **OK** to return to the **Create SQL Database** form.
11. Click **Configure database** link under the **Compute + storage** setting.
12. Modify database settings as needed for the class.  You can choose between Provisioned and Serverless options.  For this example, we'll use the autoscaled Serverless option with max vCores of 4, min vCores of 1. We’ll keep the autopause setting at the minimum of 1 hour. Click **Apply**.
13. Click **Next: Networking** button.
14. On the Networking tab, choose Private endpoint for the **Connectivity method**.
15. Under the **Private endpoints** section, click **Add private endpoint**.
16. On the **Create private endpoint** flyout, choose the same resource group as your virtual network peered to the lab account.
17. For **Location**, choose the same location as the virtual network.
18. For **Name**, enter *labsql-endpt*.
19. Leave the Target subresource set to SqlServer.
20. For **Virtual network**, choose the same virtual network peered to the lab account.
21. For **Subnet**, choose subnet you want the endpoint hosted in.  The IP assigned to the endpoint will be from the range assigned to that subnet.
22. Set **Integrate with private DNS** to **No**. For simplicity, we’ll use Azure’s DNS over own private DNS zone or our own DNS servers.
23. Click **OK**.
24. Click **Next: Additional settings**.
25. For the **Use existing data** setting, choose **Sample**.  The data from the AdventureWorksLT database will be used when the database is created.
26. Click **Review + create**.
27. Click **Create**.

Once the SQL Database deployment successfully completes, we can create the lab and install software on the lab template machine.

### Lab settings

Use the settings in the table below when setting up a classroom lab. For more information how to create a classroom lab, see [set up a classroom lab tutorial](tutorial-setup-classroom-lab.md).

| Lab settings | Value/instructions |
| ------------ | ------------------ |
| Virtual Machine Size | Medium. This size is best suited for relational databases, in-memory caching, and analytics. |
| Virtual Machine Image | Visual Studio 2019 Community (latest release) on Windows 10 Enterprise N (x64) |

Now that our lab is created, let's modify the template machine with the software we need.

## Visual Studio

The image chosen above includes [Visual Studio 2019 Community](https://visualstudio.microsoft.com/vs/community/).  All workloads and tool sets are already installed on the image.  Use the Visual Studio Installer to [install any optional tools](https://docs.microsoft.com/visualstudio/install/modify-visual-studio?view=vs-2019) you may want.  [Sign in to Visual Studio](https://docs.microsoft.com/visualstudio/ide/signing-in-to-visual-studio?view=vs-2019#how-to-sign-in-to-visual-studio) to unlock the community edition.

Visual Studio includes the **Data storage and processing** tool set, which includes SQL Server Data Tools (SSDT).  For more information about SSDT’s capabilities, see [SQL Server Data Tools overview](https://docs.microsoft.com/sql/ssdt/sql-server-data-tools?view=sql-server-ver15).  To verify connection to the shared SQL Server for the class will be successful, see [connect to a database and browse existing objects](https://docs.microsoft.com/sql/ssdt/how-to-connect-to-a-database-and-browse-existing-objects?view=sql-server-ver15). If prompted add the template machine IP to the [list of allowed computers](https://docs.microsoft.com/azure/azure-sql/database/firewall-configure) that can connect to your SQL Server instance.

Visual Studio supports several workloads including **Web & cloud** and **Desktop & mobile** workloads.  Both of these workloads support SQL Server as a data source. For more information using ASP.NET Core to SQL Server, see [build an ASP.NET Core and SQL Database app in Azure App Service](https://docs.microsoft.com/azure/app-service/app-service-web-tutorial-dotnetcore-sqldb) tutorial.  Use [System.Data.SqlClient](https://docs.microsoft.com/dotnet/api/system.data.sqlclient) library to connect to a SQL Database from a [Xamarin](https://docs.microsoft.com/xamarin) app.

## Install Azure Data Studio

[Azure Data Studio](https://github.com/microsoft/azuredatastudio) is a multi-database, cross-platform desktop environment for data professionals using the family of on-premises and cloud data platforms on Windows, macOS, and Linux.

1. Download the [Azure Data Studio *system* installer for Windows](https://go.microsoft.com/fwlink/?linkid=2127432). To find installers for other supported operating systems, go to the [Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/download) download page.
2. On the **License Agreement** page, select **I accept the agreement**. Click **Next**.
3. On the **Select Destination Location** page, click **Next**.
4. On the **Select Start Menu Folder** page, click **Next**.
5. On the **Select Additional Tasks** page, check **Create a desktop icon** if you want a desktop icon.  Click **Next**.
6. On the **Ready to Install**, click **Next**.
7. Wait for the installer to run.  Click **Finish**.

Now that we have Azure Data Studio installed, let’s setup the connection to the Azure SQL Database.

1. On the **Welcome** page for Azure Data Studio, click the **New Connection** link.
2. In the **Connection Details** box, fill in necessary information.
    - Set **Server** to *classlabdbserver.database.windows.net*
    - Set **User** name to *azureuser*
    - Set **Password** to password used to create the database.
    - Check **Remember Password**.
    - For **Database**, select *classlabdb*.
3. Click **Connect**.

## Install SQL Server Management Studio

[SQL Server Management Studio (SSMS)](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15) is an integrated environment for managing any SQL infrastructure.  SSMS is a tool used by database administrators to deploy, monitor, and upgrade data infrastructure.

1. [Download Sql Server Management Studio](https://aka.ms/ssmsfullsetup). Once downloaded, start the installer.
2. On the **Welcome** page, click **Install**.
3. On the **Setup Completed** page, click **Close**.
4. Start Sql Server Management Studio.  
5. On the **Dependency Configuration process** page, click **Close**.

Not that SSMS is installed, you can [connect and query a SQL Server](https://docs.microsoft.com/sql/ssms/tutorials/connect-query-sql-server). When setting up the connection, use the following values:

- Server type: Database Engine
- Server name: *classlabdbserver.database.windows.net*
- Authentication: SQL Server Authentication
- Login: *azureuser*
- Password: password used to create the database.

## Cost estimate

Let's cover a possible cost estimate for this class. Estimate does not include the cost of running the SQL Server.  See [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database) for current details on database pricing.

We'll use a class of 25 students. There are 20 hours of scheduled class time. Also, each student gets 10 hours quota for homework or assignments outside scheduled class time. The virtual machine size we chose was medium, which is 42 lab units.

Here is an example of a possible cost estimate for this class:

25 students \* (20 scheduled hours \+ 10 quota hours) * 0.42 USD per hour = 315.00 USD

>[!IMPORTANT]
>Cost estimate is for example purposes only. For current details on pricing, see [Azure Lab Services Pricing](https://azure.microsoft.com/pricing/details/lab-services/).

## Next steps

Next steps are common to setting up any lab.

- [Create, manage, and publish a template](how-to-create-manage-template.md)
- [Add users](tutorial-setup-classroom-lab.md#add-users-to-the-lab)
- [Set quota](how-to-configure-student-usage.md#set-quotas-for-users)
- [Set a schedule](tutorial-setup-classroom-lab.md#set-a-schedule-for-the-lab)
- [Email registration links to students](how-to-configure-student-usage.md#send-invitations-to-users)
