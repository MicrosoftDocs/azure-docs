---
title: Use Azure Database Migration Service module in Microsoft Azure PowerShell to migrate SQL Server on-premises to Azure SQL DB | Microsoft Docs
description: Learn to migrate from on-premises SQL Server to Azure SQL by using Azure PowerShell.
services: database-migration
author: HJToland3
ms.author: jtoland
manager: 
ms.reviewer: 
ms.service: database-migration
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 11/10/2017
---

# Migrate SQL Server on-premises to Azure SQL DB using Azure PowerShell
In this article, you migrate the **Adventureworks2012** database restored to an on-premises instance of SQL Server 2016 or above to an Azure SQL Database by using Microsoft Azure PowerShell.  You can migrate databases from an on-premises SQL Server instance to Azure SQL Database by using the `AzureRM.DataMigration` module in Microsoft Azure PowerShell.

In this article, you learn how to:
> [!div class="checklist"]
> * Create a resource group.
> * Create an instance of the Azure Database Migration Service.
> * Create a migration project in an Azure Database Migration Service instance.
> * Run the migration.


## Prerequisites
To complete these steps, you need:

- [SQL Server 2016 or above](https://www.microsoft.com/sql-server/sql-server-downloads) (any edition)
- TCP/IP protocol is disabled by default with SQL Server Express installation. Enable it by following the [instructions in this article](https://docs.microsoft.com/sql/database-engine/configure-windows/enable-or-disable-a-server-network-protocol#SSMSProcedure).
- To configure your [Windows Firewall for database engine access](https://docs.microsoft.com/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
- An Azure SQL Database instance. You can create an Azure SQL Database instance by following the detail in the article [Create an Azure SQL database in the Azure portal](https://docs.microsoft.com/azure/sql-database/sql-database-get-started-portal).
- [Data Migration Assistant](https://www.microsoft.com/download/details.aspx?id=53595) v3.3 or later.
- Azure Database Migration Service requires a VNET created by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways).
- Completed assessment of your on-premises database and schema migration using Data Migration Assistant as described in the article [ Performing a SQL Server migration assessment](https://docs.microsoft.com/sql/dma/dma-assesssqlonprem)
- Download and install AzureRM.DataMigration  module from PowerShell Gallery using [Install-Module PowerShell cmdlet](https://docs.microsoft.com/powershell/module/powershellget/Install-Module?view=powershell-5.1)
- The credentials used to connect to source SQL Server instance must have [CONTROL SERVER](https://docs.microsoft.com/sql/t-sql/statements/grant-server-permissions-transact-sql) permissions.
- The credentials used to connect to target Azure SQL DB instance must have CONTROL DATABASE permission on the target Azure SQL DB databases.

## Log in to your Microsoft Azure subscription
Use the directions in the article [Log in with Azure PowerShell](https://docs.microsoft.com/powershell/azure/authenticate-azureps?view=azurermps-4.4.1) to log in to your Azure subscription by using PowerShell.


## Create a resource group
An Azure resource group is a logical container into which Azure resources are deployed and managed. Create a resource group before you can create a virtual machine.

Create a resource group by using the [New-AzureRmResourceGroup](https://docs.microsoft.com/powershell/module/azurerm.resources/new-azurermresourcegroup?view=azurermps-4.4.1) command. 

The following example creates a resource group named *myResourceGroup* in the *EastUS* region.

```powershell
New-AzureRmResourceGroup -ResourceGroupName myResourceGroup -Location EastUS
```

## Create an Azure Database Migration Service instance 
You can create new instance of Azure Database Migration Service by using the `New-AzureRmDataMigrationService` cmdlet. 
This cmdlet expects the following required parameters:
- *Azure Resource Group name*. You can use [New-AzureRmResourceGroup](https://docs.microsoft.com/powershell/module/azurerm.resources/new-azurermresourcegroup?view=azurermps-4.4.1) command to create Azure Resource group as previously shown and provide its name as a parameter.
- *Service name*. String that corresponds to the desired unique service name for Azure Database Migration Service 
- *Location*. Specifies the location of the service. Specify an Azure data center location, such as West US or Southeast Asia
- *Sku*. This parameter corresponds to DMS Sku name. Currently supported Sku names are *Basic_1vCore*, *Basic_2vCores*, *GeneralPurpose_4vCores*
- *Virtual Subnet Identifier*. You can use cmdlet [New-AzureRmVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig?view=azurermps-4.4.1) to create a subnet. 

The following example creates a service named *MyDMS* in the resource group *MyDMSResourceGroup*, which is located in *East US* region using a virtual subnet called *MySubnet*.

```powershell
$service = New-AzureRmDms -ResourceGroupName myResourceGroup `
  -ServiceName MyDMS `
  -Location EastUS `
  -Sku Basic_2vCores `  
  -VirtualSubnetId
$vnet.Id`
```

## Create a migration project
After creating an Azure Database Migration Service instance, create a migration project. An Azure Database Migration Service project requires connection information for both the source and target instances, as well as a list of databases that you want to migrate as part of the project.

### Create a Database Connection Info object for the source and target connections
You can create a Database Connection Info object by using the `New-AzureRmDmsConnInfo` cmdlet.  This cmdlet expects the following parameters:
- *ServerType*. The type of database connection requested, for example, SQL, Oracle, or MySQL. Use SQL for SQL Server and SQL Azure.
- *DataSource*. The name or IP of a SQL instance or SQL Azure server.
- *AuthType*. The authentication type for connection, which can be either SqlAuthentication or WindowsAuthentication.
- *TrustServerCertificate* parameter sets a value that indicates whether the channel is encrypted while bypassing walking the certificate chain to validate trust. Value can be true or false.

THe following example creates Connection Info object for source SQL Server called MySQLSourceServer using sql authentication 

```powershell
$sourceConnInfo = New-AzureRmDmsConnInfo -ServerType SQL `
  -DataSource MySQLSourceServer `
  -AuthType SqlAuthentication `
  -TrustServerCertificate:$true
```

Next example shows creation of Connection Info for SQL Azure database server called MySQLAzureTarget using sql authentication

```powershell
$targetConnInfo = New-AzureRmDmsConnInfo -ServerType SQL `
  -DataSource "mysqlazuretarget.database.windows.net" `
  -AuthType SqlAuthentication `
  -TrustServerCertificate:$false
```

### Provide databases for the migration project
Create a list of `AzureRmDataMigrationDatabaseInfo` objects that specifies databases as part of the Azure Database Migration project that can be provided  as parameter for creation of the project. 
Cmdlet `New-AzureRmDataMigrationDatabaseInfo` can be used to create AzureRmDataMigrationDatabaseInfo. 

The following example creates `AzureRmDataMigrationDatabaseInfo` project for database AdventureWorks2016 and adds it to the list to be provided as parameter for project creation.

```powershell
$dbInfo1 = New-AzureRmDataMigrationDatabaseInfo -SourceDatabaseName AdventureWorks2016
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
  -TargetType SQLDB `
  -SourceConnection $sourceConnInfo `
  -TargetConnection $targetConnInfo `
  -DatabaseInfos $dbList
```

## Create and start a migration task

Finally, create and start Azure Database Migration task. Azure Database Migration task requires connection credential information for both source and target and list of database tables to be migrated in addition to the information already provided with the project created as a prerequisite. 

### Create credential parameters for source and target

Connection security credentials can be created as [PSCredential](https://docs.microsoft.com/dotnet/api/system.management.automation.pscredential?redirectedfrom=MSDN&view=powershellsdk-1.1.0) object. 

The following example shows the creation of *PSCredential* objects for both source and target connections providing passwords as string variables *$sourcePassword* and *$targetPassword*. 

```powershell
secpasswd = ConvertTo-SecureString -String $sourcePassword -AsPlainText -Force
$sourceCred = New-Object System.Management.Automation.PSCredential ($sourceUserName, $secpasswd)
$secpasswd = ConvertTo-SecureString -String $targetPassword -AsPlainText -Force
$targetCred = New-Object System.Management.Automation.PSCredential ($targetUserName, $secpasswd)
```

### Create a table map and select source and target parameters for migration
Another parameter needed for migration is mapping of tables from source to target to be migrated. Create dictionary of tables that provides a mapping between source and target tables for migration. The following example illustrates mapping between source and target tables Human Resources schema for the AdventureWorks 2016 database.

```powershell
$tableMap = New-Object 'system.collections.generic.dictionary[string,string]'
$tableMap.Add("HumanResources.Department", "HumanResources.Department")
$tableMap.Add("HumanResources.Employee","HumanResources.Employee")
$tableMap.Add("HumanResources.EmployeeDepartmentHistory","HumanResources.EmployeeDepartmentHistory")
$tableMap.Add("HumanResources.EmployeePayHistory","HumanResources.EmployeePayHistory")
$tableMap.Add("HumanResources.JobCandidate","HumanResources.JobCandidate")
$tableMap.Add("HumanResources.Shift","HumanResources.Shift")
```

The next step is to select the source and target databases and provide table mapping to migrate as a parameter by using the `New-AzureRmDmsSqlServerSqlDbSelectedDB` cmdlet, as shown in the following example:

```powershell
$selectedDbs = New-AzureRmDmsSqlServerSqlDbSelectedDB -Name AdventureWorks2016 `
  -TargetDatabaseName AdventureWorks2016 `
  -TableMap $tableMap
```

### Create and start a migration task

Use the `New-AzureRmDataMigrationTask` cmdlet to create and start a migration task. This cmdlet expects the following parameters:
- *TaskType*.  Type of migration task to create for SQL Server to SQL Azure migration type *MigrateSqlServerSqlDb* is expected. 
- *Resource Group Name*. Name of Azure resource group in which to create the task.
- *ServiceName*.  Azure Database Migration Service instance in which to create the task.
- *ProjectName*. Name of Azure Database Migration project in which to create the task. 
- *TaskName*. Name of task to be created. 
- *Source Connection*. AzureRmDmsConnInfo object representing source connection.
- *Target Connection*. AzureRmDmsConnInfo object representing target connection.
- *SourceCred*. [PSCredential](https://docs.microsoft.com/dotnet/api/system.management.automation.pscredential?redirectedfrom=MSDN&view=powershellsdk-1.1.0) object for connecting to source server.
- *TargetCred*. [PSCredential](https://docs.microsoft.com/dotnet/api/system.management.automation.pscredential?redirectedfrom=MSDN&view=powershellsdk-1.1.0) object for connecting to target server.
- *SelectedDatabase*. AzureRmDmsSqlServerSqlDbSelectedDB object representing the source and target database mapping.

The following example creates and starts a migration task named myDMSTask:

```powershell
$migTask = New-AzureRmDataMigrationTask -TaskType MigrateSqlServerSqlDb `
  -ResourceGroupName myResourceGroup `
  -ServiceName $service.Name `
  -ProjectName $project.Name `
  -TaskName myDMSTask `
  -SourceConnection $sourceConnInfo `
  -SourceCred $sourceCred `
  -TargetConnection $targetConnInfo `
  -TargetCred $targetCred `
  -SelectedDatabase  $selectedDbs`
```

## Monitor the migration
You can monitor the migration task running by querying the state property of the task as shown in the following example:

```powershell
if (($task.Properties.State -eq "Running") -or ($task.Properties.State -eq "Queued"))
{
  write-host "migration task running"
}
```

## Next steps
- Review the migration guidance in the [Microsoft Database Migration Guide](https://datamigration.microsoft.com/)