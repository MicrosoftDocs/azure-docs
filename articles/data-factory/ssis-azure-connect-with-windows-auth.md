---
title: Access data stores and file shares with Windows authentication
description: Learn how to configure SSIS catalog in Azure SQL Database and Azure-SSIS Integration Runtime in Azure Data Factory to run packages that access data stores and file shares with Windows authentication.
ms.date: 08/10/2023
ms.topic: conceptual
ms.service: data-factory
ms.subservice: integration-services
author: chugugrace
ms.author: chugu
ms.reviewer: jburchel
---

# Access data stores and file shares with Windows authentication from SSIS packages in Azure

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

You can use Windows authentication to access data stores, such as SQL Servers, file shares, Azure Files, etc. from SSIS packages running on your Azure-SSIS Integration Runtime (IR) in Azure Data Factory (ADF) and Azure Synapse. Your data stores can be on premises, hosted on Azure Virtual Machines (VMs), or running in Azure as managed services. If they are on premises, you need to join your Azure-SSIS IR to a Virtual Network (Microsoft Azure Virtual Network) connected to your on-premises network, see [Join Azure-SSIS IR to a Microsoft Azure Virtual Network](./join-azure-ssis-integration-runtime-virtual-network.md). There are four methods to access data stores with Windows authentication from SSIS packages running on your Azure-SSIS IR:

| Connection method | Effective scope | Setup step | Access method in packages | Number of credential sets and connected resources | Type of connected resources | 
|---|---|---|---|---|---|
| Setting up an activity-level execution context | Per Execute SSIS Package activity | Configure the **Windows authentication** property to set up an "Execution/Run as" context when running SSIS packages as Execute SSIS Package activities in ADF pipelines.<br/><br/> For more info, see [Configure Execute SSIS Package activity](./how-to-invoke-ssis-package-ssis-activity.md). | Access resources directly in packages, for example, use UNC path to access file shares or Azure Files: `\\YourFileShareServerName\YourFolderName` or `\\YourAzureStorageAccountName.file.core.windows.net\YourFolderName` | Support only one credential set for all connected resources | - File shares on premises/Azure VMs<br/><br/> - Azure Files, see [Use an Azure file share](../storage/files/storage-how-to-use-files-windows.md)<br/><br/> - SQL Servers on premises/Azure VMs with Windows authentication<br/><br/> - Other resources with Windows authentication |
| Setting up a catalog-level execution context | Per Azure-SSIS IR, but is overridden when setting up an activity-level execution context (see above) | Execute SSISDB `catalog.set_execution_credential` stored procedure to set up an "Execution/Run as" context.<br/><br/> For more info, see the rest of this article below. | Access resources directly in packages, for example, use UNC path to access file shares or Azure Files: `\\YourFileShareServerName\YourFolderName` or `\\YourAzureStorageAccountName.file.core.windows.net\YourFolderName` | Support only one credential set for all connected resources | - File shares on premises/Azure VMs<br/><br/> - Azure Files, see [Use an Azure file share](../storage/files/storage-how-to-use-files-windows.md)<br/><br/> - SQL Servers on premises/Azure VMs with Windows authentication<br/><br/> - Other resources with Windows authentication |
| Persisting credentials via `cmdkey` command | Per Azure-SSIS IR, but is overridden when setting up an activity/catalog -level execution context (see above) | Execute `cmdkey` command in a custom setup script (`main.cmd`) when provisioning your Azure-SSIS IR, for example, if you use file shares, Azure Files, or SQL Server:<br/><br/> `cmdkey /add:YourFileShareServerName /user:YourDomainName\YourUsername /pass:YourPassword`,<br/><br/> `cmdkey /add:YourAzureStorageAccountName.file.core.windows.net /user:azure\YourAzureStorageAccountName /pass:YourAccessKey`, or<br/><br/> `cmdkey /add:YourSQLServerFullyQualifiedDomainNameOrIPAddress:YorSQLServerPort /user:YourDomainName\YourUsername /pass:YourPassword`.<br/><br/> For more info, see [Customize setup for Azure-SSIS IR](./how-to-configure-azure-ssis-ir-custom-setup.md). | Access resources directly in packages, for example, use UNC path to access file shares or Azure Files: `\\YourFileShareServerName\YourFolderName` or `\\YourAzureStorageAccountName.file.core.windows.net\YourFolderName` | Support multiple credential sets for different connected resources | - File shares on premises/Azure VMs<br/><br/> - Azure Files, see [Use an Azure file share](../storage/files/storage-how-to-use-files-windows.md)<br/><br/> - SQL Servers on premises/Azure VMs with Windows authentication<br/><br/> - Other resources with Windows authentication |
| Mounting drives at package execution time (non-persistent) | Per package | Execute `net use` command in Execute Process Task that is added at the beginning of control flow in your packages, for example, `net use D: \\YourFileShareServerName\YourFolderName` | Access file shares via mapped drives | Support multiple drives for different file shares | - File shares on premises/Azure VMs<br/><br/> - Azure Files, see [Use an Azure file share](../storage/files/storage-how-to-use-files-windows.md) |
|||||||

> [!WARNING]
> If you do not use any of the above methods to access data stores with Windows authentication, your packages that depend on Windows authentication are not able to access them and fail at run time. 

The rest of this article describes how to configure SSIS catalog (SSISDB) hosted in SQL Database/SQL Managed Instance to run packages on Azure-SSIS IR that use Windows authentication to access data stores. 

## You can only use one set of credentials

When you use Windows authentication in an SSIS package, you can only use one set of credentials. The domain credentials that you provide when you follow the steps in this article apply to all package executions - interactive or scheduled - on your Azure-SSIS IR until you change or remove them. If your package has to connect to multiple data stores with different sets of credentials, you should consider the above alternative methods.

## Provide domain credentials for Windows authentication

To provide domain credentials that let packages use Windows authentication to access data stores on premises, do the following things:

1. With SQL Server Management Studio (SSMS) or another tool, connect to SQL Database/SQL Managed Instance that hosts SSISDB. For more info, see [Connect to SSISDB in Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database).

2. With SSISDB as the current database, open a query window.

3. Run the following stored procedure and provide the appropriate domain credentials:

   ```sql
   catalog.set_execution_credential @user='<your user name>', @domain='<your domain name>', @password='<your password>'
   ```

4. Run your SSIS packages. The packages use the credentials that you provided to access data stores on premises with Windows authentication.

### View domain credentials

To view the active domain credentials, do the following things:

1. With SSMS or another tool, connect to SQL Database/SQL Managed Instance that hosts SSISDB. For more info, see [Connect to SSISDB in Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database).

2. With SSISDB as the current database, open a query window.

3. Run the following stored procedure and check the output:

   ```sql
   SELECT * 
   FROM catalog.master_properties
   WHERE property_name = 'EXECUTION_DOMAIN' OR property_name = 'EXECUTION_USER'
   ```

### Clear domain credentials
To clear and remove the credentials that you provided as described in this article, do the following things:

1. With SSMS or another tool, connect to SQL Database/SQL Managed Instance that hosts SSISDB. For more info, see [Connect to SSISDB in Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database).

2. With SSISDB as the current database, open a query window.

3. Run the following stored procedure:

   ```sql
   catalog.set_execution_credential @user='', @domain='', @password=''
   ```

## Connect to a SQL Server on premises

To check whether you can connect to a SQL Server on premises, do the following things:

1. To run this test, find a non-domain-joined computer.

2. On the non-domain-joined computer, run the following command to start SSMS with the domain credentials that you want to use:

   ```cmd
   runas.exe /netonly /user:<domain>\<username> SSMS.exe
   ```

3. From SSMS, check whether you can connect to the SQL Server on premises.

### Prerequisites

To access a SQL Server on premises from packages running in Azure, do the following things:

1.  In SQL Server Configuration Manager, enable TCP/IP protocol.

2. Allow access through Windows firewall. For more info, see [Configure Windows firewall to access SQL Server](/sql/sql-server/install/configure-the-windows-firewall-to-allow-sql-server-access).

3. Join your Azure-SSIS IR to a Microsoft Azure Virtual Network that is connected to the SQL Server on premises.  For more info, see [Join Azure-SSIS IR to a Microsoft Azure Virtual Network](./join-azure-ssis-integration-runtime-virtual-network.md).

4. Use SSISDB `catalog.set_execution_credential` stored procedure to provide credentials as described in this article.

## Connect to a file share on premises

To check whether you can connect to a file share on premises, do the following things:

1. To run this test, find a non-domain-joined computer.

2. On the non-domain-joined computer, run the following commands. These commands open a command prompt window with the domain credentials that you want to use and then test connectivity to the file share on premises by getting a directory listing.

   ```cmd
   runas.exe /netonly /user:<domain>\<username> cmd.exe
   dir \\fileshare
   ```

3. Check whether the directory listing is returned for the file share on premises.

### Prerequisites

To access a file share on premises from packages running in Azure, do the following things:

1. Allow access through Windows firewall.

2. Join your Azure-SSIS IR to a Microsoft Azure Virtual Network that is connected to the file share on premises.  For more info, see [Join Azure-SSIS IR to a Microsoft Azure Virtual Network](./join-azure-ssis-integration-runtime-virtual-network.md).

3. Use SSISDB `catalog.set_execution_credential` stored procedure to provide credentials as described in this article.

## Connect to a file share on Azure VM

To access a file share on Azure VM from packages running in Azure, do the following things:

1. With SSMS or another tool, connect to SQL Database/SQL Managed Instance that hosts SSISDB. For more info, see [Connect to SSISDB in Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database).

2. With SSISDB as the current database, open a query window.

3. Run the following stored procedure and provide the appropriate domain credentials:

   ```sql
   catalog.set_execution_credential @domain = N'.', @user = N'username of local account on Azure virtual machine', @password = N'password'
   ```

## Connect to a file share in Azure Files

For more info about Azure Files, see [Azure Files](https://azure.microsoft.com/services/storage/files/).

To access a file share in Azure Files from packages running in Azure, do the following things:

1. With SSMS or another tool, connect to SQL Database/SQL Managed Instance that hosts SSISDB. For more info, see [Connect to SSISDB in Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database).

2. With SSISDB as the current database, open a query window.

3. Run the following stored procedure and provide the appropriate domain credentials:

   ```sql
   catalog.set_execution_credential @domain = N'Azure', @user = N'<storage-account-name>', @password = N'<storage-account-key>'
   ```

## Next steps

- Deploy your packages. For more info, see [Deploy an SSIS project to Azure with SSMS](/sql/integration-services/ssis-quickstart-deploy-ssms).
- Run your packages. For more info, see [Run SSIS packages in Azure with SSMS](/sql/integration-services/ssis-quickstart-run-ssms).
- Schedule your packages. For more info, see [Schedule SSIS packages in Azure](/sql/integration-services/lift-shift/ssis-azure-schedule-packages-ssms).
