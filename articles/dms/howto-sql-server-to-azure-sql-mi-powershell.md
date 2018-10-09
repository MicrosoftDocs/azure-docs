---
title: Use Azure Database Migration Service module in Microsoft Azure PowerShell to migrate SQL Server on-premises to Azure SQL DB MI | Microsoft Docs
description: Learn to migrate from on-premises SQL Server to Azure SQL DB MI by using Azure PowerShell.
services: database-migration
author: pochiraju
ms.author: rajpo
manager: 
ms.reviewer: 
ms.service: database-migration
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 10/09/2018
---

# Migrate SQL Server on-premises to Azure SQL DB using Azure PowerShell
In this article, you migrate the **Adventureworks2012** database restored to an on-premises instance of SQL Server 2005 or above to an Azure SQL Database by using Microsoft Azure PowerShell. You can migrate databases from an on-premises SQL Server instance to Azure SQL Database by using the `AzureRM.DataMigration` module in Microsoft Azure PowerShell.

In this article, you learn how to:
> [!div class="checklist"]
> * Create a resource group.
> * Create an instance of the Azure Database Migration Service.
> * Create a migration project in an Azure Database Migration Service instance.
> * Run the migration.

## Prerequisites
To complete these steps, you need:

- [SQL Server 2016 or above](https://www.microsoft.com/sql-server/sql-server-downloads) (any edition)
- To enable the TCP/IP protocol, which is disabled by default with SQL Server Express installation. Enable the TCP/IP protocol by following the article [Enable or Disable a Server Network Protocol](https://docs.microsoft.com/sql/database-engine/configure-windows/enable-or-disable-a-server-network-protocol#SSMSProcedure).
- To configure your [Windows Firewall for database engine access](https://docs.microsoft.com/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
- An Azure SQL Database instance. You can create an Azure SQL Database instance by following the detail in the article [Create an Azure SQL database in the Azure portal](https://docs.microsoft.com/azure/sql-database/sql-database-get-started-portal).
- [Data Migration Assistant](https://www.microsoft.com/download/details.aspx?id=53595) v3.3 or later.
- To have created a VNET by using the Azure Resource Manager deployment model, which provides the Azure Database Migration Service with site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways).
- To have completed assessment of your on-premises database and schema migration using Data Migration Assistant as described in the article [ Performing a SQL Server migration assessment](https://docs.microsoft.com/sql/dma/dma-assesssqlonprem)
- To download and install the AzureRM.DataMigration module from the PowerShell Gallery by using [Install-Module PowerShell cmdlet](https://docs.microsoft.com/powershell/module/powershellget/Install-Module?view=powershell-5.1)
- To ensure that the credentials used to connect to source SQL Server instance has the [CONTROL SERVER](https://docs.microsoft.com/sql/t-sql/statements/grant-server-permissions-transact-sql) permission.
- To ensure that the credentials used to connect to target Azure SQL DB instance has the CONTROL DATABASE permission on the target Azure SQL Database databases.
- An Azure subscription. If you don't have one, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to your Microsoft Azure subscription
Use the directions in the article [Log in with Azure PowerShell](https://docs.microsoft.com/powershell/azure/authenticate-azureps?view=azurermps-4.4.1) to log in to your Azure subscription by using PowerShell.

## Create a resource group
An Azure resource group is a logical container into which Azure resources are deployed and managed. Create a resource group before you can create a virtual machine.

Create a resource group by using the [New-AzureRmResourceGroup](https://docs.microsoft.com/powershell/module/azurerm.resources/new-azurermresourcegroup?view=azurermps-4.4.1) command. 

The following example creates a resource group named *myResourceGroup* in the *EastUS* region.

```powershell
New-AzureRmResourceGroup -ResourceGroupName myResourceGroup -Location EastUS
```
## Create an instance of the Azure Database Migration Service 
You can create new instance of Azure Database Migration Service by using the `New-AzureRmDataMigrationService` cmdlet. 
This cmdlet expects the following required parameters:
- *Azure Resource Group name*. You can use [New-AzureRmResourceGroup](https://docs.microsoft.com/powershell/module/azurerm.resources/new-azurermresourcegroup?view=azurermps-4.4.1) command to create Azure Resource group as previously shown and provide its name as a parameter.
- *Service name*. String that corresponds to the desired unique service name for Azure Database Migration Service 
- *Location*. Specifies the location of the service. Specify an Azure data center location, such as West US or Southeast Asia
- *Sku*. This parameter corresponds to DMS Sku name. Currently supported Sku names are *Basic_1vCore*, *Basic_2vCores*, *GeneralPurpose_4vCores*
- *Virtual Subnet Identifier*. You can use cmdlet [New-AzureRmVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig?view=azurermps-4.4.1) to create a subnet. 

The following example creates a service named *MyDMS* in the resource group *MyDMSResourceGroup* located in the *East US* region using a virtual network named *MyVNET* and  subnet called *MySubnet*.

```powershell
 $vNet = Get-AzureRmVirtualNetwork -ResourceGroupName MyDMSResourceGroup -Name MyVNET

$vSubNet = Get-AzureRmVirtualNetworkSubnetConfig -VirtualNetwork $vNet -Name MySubnet

$service = New-AzureRmDms -ResourceGroupName myResourceGroup `
  -ServiceName MyDMS `
  -Location EastUS `
  -Sku Basic_2vCores `  
  -VirtualSubnetId $vSubNet.Id`
```

## Create a migration project
After creating an Azure Database Migration Service instance, create a migration project. An Azure Database Migration Service project requires connection information for both the source and target instances, as well as a list of databases that you want to migrate as part of the project.

### Create a Database Connection Info object for the source and target connections
You can create a Database Connection Info object by using the `New-AzureRmDmsConnInfo` cmdlet. This cmdlet expects the following parameters:
- *ServerType*. The type of database connection requested, for example, SQL, Oracle, or MySQL. Use SQL for SQL Server and Azure SQL.
- *DataSource*. The name or IP of a SQL Server instance or Azure SQL database.
- *AuthType*. The authentication type for connection, which can be either SqlAuthentication or WindowsAuthentication.
- *TrustServerCertificate* parameter sets a value that indicates whether the channel is encrypted while bypassing walking the certificate chain to validate trust. Value can be true or false.

The following example creates Connection Info object for source SQL Server called MySourceSQLServer using sql authentication: 

```powershell
$sourceConnInfo = New-AzureRmDmsConnInfo -ServerType SQL `
  -DataSource MySourceSQLServer `
  -AuthType SqlAuthentication `
  -TrustServerCertificate:$true
```

The next example shows creation of Connection Info for an Azure SQL Database Managed Instance server called ‘targetmanagedinstance.database.windows.net’ using sql authentication:

```powershell
$targetConnInfo = New-AzureRmDmsConnInfo -ServerType SQL `
  -DataSource "targetmanagedinstance.database.windows.net" `
  -AuthType SqlAuthentication `
  -TrustServerCertificate:$false
```

### Provide databases for the migration project
Create a list of `AzureRmDataMigrationDatabaseInfo` objects that specifies databases as part of the Azure Database Migration project that can be provided  as parameter for creation of the project. The Cmdlet `New-AzureRmDataMigrationDatabaseInfo` can be used to create AzureRmDataMigrationDatabaseInfo. 

The following example creates `AzureRmDataMigrationDatabaseInfo` project for the **AdventureWorks** database and adds it to the list to be provided as parameter for project creation.

```powershell
$dbInfo1 = New-AzureRmDataMigrationDatabaseInfo -SourceDatabaseName AdventureWorks
$dbList = @($dbInfo1)
```

### Create a project object
Finally you can create Azure Database Migration project called *MyDMSProject* located in *East US* using `New-AzureRmDataMigrationProject` and adding the previously created source and target connections and the list of databases to migrate.

```powershell
$project = New-AzureRmDataMigrationProject -ResourceGroupName myResourceGroup `
  -ServiceName $service.Name `
  -ProjectName MyDMSProject `
  -Location EastUS `
  -SourceType SQL `
  -TargetType SQLMI `
  -SourceConnection $sourceConnInfo `
  -TargetConnection $targetConnInfo `
  -DatabaseInfo $dbList
```

## Create and start a migration task
Finally, create and start Azure Database Migration task. Azure Database Migration task requires connection credential information for both source and target and list of database tables to be migrated in addition to the information already provided with the project created as a prerequisite. 

### Create credential parameters for source and target
Connection security credentials can be created as a [PSCredential](https://docs.microsoft.com/dotnet/api/system.management.automation.pscredential?redirectedfrom=MSDN&view=powershellsdk-1.1.0) object. 

The following example shows the creation of *PSCredential* objects for both source and target connections providing passwords as string variables *$sourcePassword* and *$targetPassword*. 

```powershell
$secpasswd = ConvertTo-SecureString -String $sourcePassword -AsPlainText -Force
$sourceCred = New-Object System.Management.Automation.PSCredential ($sourceUserName, $secpasswd)
$secpasswd = ConvertTo-SecureString -String $targetPassword -AsPlainText -Force
$targetCred = New-Object System.Management.Automation.PSCredential ($targetUserName, $secpasswd)
```

### Create backup fileshare object
Now create FileShare object representing the local SMB network share that the Azure Database Migration Service can take the source database backups to using the New-AzureRmDmsFileShare cmdlet.

```powershell
$backupPassword = ConvertTo-SecureString -String $password -AsPlainText -Force
$backupCred = New-Object System.Management.Automation.PSCredential ($backupUserName, $backupPassword)

$backupFileSharePath="\\10.0.0.76\SharedBackup"
$backupFileShare = New-AzureRmDmsFileShare -Path $backupFileSharePath -Credential $backupCred
```

### Create selected database object
The next step is to select the source and target databases by using the New-AzureRmDmsSelectedDB cmdlet, as shown in the following example:

```powershell
$selectedDbs = @()
$selectedDbs += New-AzureRmDmsSelectedDB -MigrateSqlServerSqlDbMi `
  -Name AdventureWorks2016 `
  -TargetDatabaseName AdventureWorks2016 `
  -BackupFileShare $backupFileShare `
```

### SAS URI for Azure Storage Container
Create variable containing the SAS URI that provides the Azure Database Migration Service with access to the storage account container to which the service uploads the backup files.

```powershell
$blobSasUri="https://mystorage.blob.core.windows.net/test?st=2018-07-13T18%3A10%3A33Z&se=2019-07-14T18%3A10%3A00Z&sp=rwdl&sv=2018-03-28&sr=c&sig=qKlSA512EVtest3xYjvUg139tYSDrasbftY%3D"
```

### Select logins
Create list of logins to be migrated as shown in below example:  Note, currently DMS supports migrating SQL logins only. 

```powershell
$selectedLogins = @("user1", "user2")
```

### Select agent jobs
Create list of agent jobs to be migrated as shown in below example:

>[!NOTE]
>Currently DMS supports the jobs with T-SQL subsystem job steps only.

```powershell
$selectedAgentJobs = @("agentJob1", "agentJob2")
```

### Create and start a migration task

Use the `New-AzureRmDataMigrationTask` cmdlet to create and start a migration task. This cmdlet expects the following parameters:
- *TaskType*. Type of migration task to create for SQL Server to Azure SQL Database Managaged Instance migration type *MigrateSqlServerSqlDbMi* is expected. 
- *Resource Group Name*. Name of Azure resource group in which to create the task.
- *ServiceName*. Azure Database Migration Service instance in which to create the task.
- *ProjectName*. Name of Azure Database Migration Service project in which to create the task. 
- *TaskName*. Name of task to be created. 
- *SourceConnection*. AzureRmDmsConnInfo object representing source SQL Server connection.
- *TargetConnection*. AzureRmDmsConnInfo object representing target Azure SQL Database Managed Instance connection.
- *SourceCred*. [PSCredential](https://docs.microsoft.com/dotnet/api/system.management.automation.pscredential?redirectedfrom=MSDN&view=powershellsdk-1.1.0) object for connecting to source server.
- *TargetCred*. [PSCredential](https://docs.microsoft.com/dotnet/api/system.management.automation.pscredential?redirectedfrom=MSDN&view=powershellsdk-1.1.0) object for connecting to target server.
- *SelectedDatabase*. AzureRmDataMigrationSelectedDB object representing the source and target database mapping.
- *BackupFileShare*. FileShare object representing the local network share that the Azure Database Migration Service can take the source database backups to.
- *BackupBlobSasUri*. The SAS URI that provides the Azure Database Migration Service with access to the storage account container to which the service uploads the backup files. Learn how to get the SAS URI for blob container.
- *SelectedLogins*. List of selected logins to migrate.
- *SelectedAgentJobs*. List of selected agent jobs to migrate.

The following example creates and starts a migration task named myDMSTask:

```powershell
$migTask = New-AzureRmDataMigrationTask -TaskType MigrateSqlServerSqlDbMi `
  -ResourceGroupName myResourceGroup `
  -ServiceName $service.Name `
  -ProjectName $project.Name `
  -TaskName myDMSTask `
  -SourceConnection $sourceConnInfo `
  -SourceCred $sourceCred `
  -TargetConnection $targetConnInfo `
  -TargetCred $targetCred `
  -SelectedDatabase  $selectedDbs`
  -BackupFileShare $backupFileShare `
  -BackupBlobSasUri $blobSasUri `
  -SelectedLogins $selectedLogins `
  -SelectedAgentJobs $selectedJobs `
```

## Monitor the migration
You can monitor the migration task running by querying the state property of the task as shown in the following example:

```powershell
if (($mytask.ProjectTask.Properties.State -eq "Running") -or ($mytask.ProjectTask.Properties.State -eq "Queued"))
{
  write-host "migration task running"
}
```

## Next steps
- Review the migration guidance in the Microsoft [Database Migration Guide](https://datamigration.microsoft.com/).