---
title: "PowerShell: Migrate SQL Server to SQL Database" 
titleSuffix: Azure Database Migration Service
description: Learn to migrate a datagbase from SQL Server to Azure SQL Database by using Azure PowerShell with the Azure Database Migration Service.
services: database-migration
author: pochiraju
ms.author: rajpo
manager: craigg
ms.reviewer: craigg
ms.service: dms
ms.workload: data-services
ms.custom: "seo-lt-2019"
ms.topic: article
ms.date: 02/20/2020
---

# Migrate a SQL Server database to Azure SQL Database using Azure PowerShell

In this article, you migrate the **Adventureworks2012** database restored to an on-premises instance of SQL Server 2016 or above to an Azure SQL Database by using Microsoft Azure PowerShell. You can migrate databases from a SQL Server instance to Azure SQL Database by using the `Az.DataMigration` module in Microsoft Azure PowerShell.

In this article, you learn how to:
> [!div class="checklist"]
>
> * Create a resource group.
> * Create an instance of the Azure Database Migration Service.
> * Create a migration project in an Azure Database Migration Service instance.
> * Run the migration.

## Prerequisites

To complete these steps, you need:

* [SQL Server 2016 or above](https://www.microsoft.com/sql-server/sql-server-downloads) (any edition)
* To enable the TCP/IP protocol, which is disabled by default with SQL Server Express installation. Enable the TCP/IP protocol by following the article [Enable or Disable a Server Network Protocol](https://docs.microsoft.com/sql/database-engine/configure-windows/enable-or-disable-a-server-network-protocol#SSMSProcedure).
* To configure your [Windows Firewall for database engine access](https://docs.microsoft.com/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
* An Azure SQL Database instance. You can create an Azure SQL Database instance by following the detail in the article [Create an Azure SQL database in the Azure portal](https://docs.microsoft.com/azure/sql-database/sql-database-get-started-portal).
* [Data Migration Assistant](https://www.microsoft.com/download/details.aspx?id=53595) v3.3 or later.
* To have created a Microsoft Azure Virtual Network by using the Azure Resource Manager deployment model, which provides the Azure Database Migration Service with site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](https://docs.microsoft.com/azure/expressroute/expressroute-introduction) or [VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways).
* To have completed assessment of your on-premises database and schema migration using Data Migration Assistant as described in the article [Performing a SQL Server migration assessment](https://docs.microsoft.com/sql/dma/dma-assesssqlonprem)
* To download and install the Az.DataMigration module from the PowerShell Gallery by using [Install-Module PowerShell cmdlet](https://docs.microsoft.com/powershell/module/powershellget/Install-Module?view=powershell-5.1); be sure to open the PowerShell command window using run as an Administrator.
* To ensure that the credentials used to connect to source SQL Server instance has the [CONTROL SERVER](https://docs.microsoft.com/sql/t-sql/statements/grant-server-permissions-transact-sql) permission.
* To ensure that the credentials used to connect to target Azure SQL DB instance has the CONTROL DATABASE permission on the target Azure SQL Database databases.
* An Azure subscription. If you don't have one, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to your Microsoft Azure subscription

Use the directions in the article [Log in with Azure PowerShell](https://docs.microsoft.com/powershell/azure/authenticate-azureps) to sign in to your Azure subscription by using PowerShell.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed. Create a resource group before you can create a virtual machine.

Create a resource group by using the [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup) command.

The following example creates a resource group named *myResourceGroup* in the *EastUS* region.

```powershell
New-AzResourceGroup -ResourceGroupName myResourceGroup -Location EastUS
```

## Create an instance of Azure Database Migration Service

You can create new instance of Azure Database Migration Service by using the `New-AzDataMigrationService` cmdlet. 
This cmdlet expects the following required parameters:

* *Azure Resource Group name*. You can use [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup) command to create Azure Resource group as previously shown and provide its name as a parameter.
* *Service name*. String that corresponds to the desired unique service name for Azure Database Migration Service 
* *Location*. Specifies the location of the service. Specify an Azure data center location, such as West US or Southeast Asia
* *Sku*. This parameter corresponds to DMS Sku name. The currently supported Sku name is *GeneralPurpose_4vCores*.
* *Virtual Subnet Identifier*. You can use cmdlet [New-AzVirtualNetworkSubnetConfig](https://docs.microsoft.com/powershell/module/az.network/new-azvirtualnetworksubnetconfig) to create a subnet. 

The following example creates a service named *MyDMS* in the resource group *MyDMSResourceGroup* located in the *East US* region using a virtual network named *MyVNET* and  subnet called *MySubnet*.

```powershell
 $vNet = Get-AzVirtualNetwork -ResourceGroupName MyDMSResourceGroup -Name MyVNET

$vSubNet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $vNet -Name MySubnet

$service = New-AzDms -ResourceGroupName myResourceGroup `
  -ServiceName MyDMS `
  -Location EastUS `
  -Sku Basic_2vCores `  
  -VirtualSubnetId $vSubNet.Id`
```

## Create a migration project

After creating an Azure Database Migration Service instance, create a migration project. An Azure Database Migration Service project requires connection information for both the source and target instances, as well as a list of databases that you want to migrate as part of the project.

### Create a Database Connection Info object for the source and target connections

You can create a Database Connection Info object by using the `New-AzDmsConnInfo` cmdlet. This cmdlet expects the following parameters:

* *ServerType*. The type of database connection requested, for example, SQL, Oracle, or MySQL. Use SQL for SQL Server and Azure SQL.
* *DataSource*. The name or IP of a SQL Server instance or Azure SQL database.
* *AuthType*. The authentication type for connection, which can be either SqlAuthentication or WindowsAuthentication.
* *TrustServerCertificate* parameter sets a value that indicates whether the channel is encrypted while bypassing walking the certificate chain to validate trust. Value can be true or false.

The following example creates Connection Info object for source SQL Server called MySourceSQLServer using sql authentication:

```powershell
$sourceConnInfo = New-AzDmsConnInfo -ServerType SQL `
  -DataSource MySourceSQLServer `
  -AuthType SqlAuthentication `
  -TrustServerCertificate:$true
```

The next example shows creation of Connection Info for a server called SQLAzureTarget using sql authentication:

```powershell
$targetConnInfo = New-AzDmsConnInfo -ServerType SQL `
  -DataSource "sqlazuretarget.database.windows.net" `
  -AuthType SqlAuthentication `
  -TrustServerCertificate:$false
```

### Provide databases for the migration project

Create a list of `AzDataMigrationDatabaseInfo` objects that specifies databases as part of the Azure Database Migration project that can be provided  as parameter for creation of the project. The Cmdlet `New-AzDataMigrationDatabaseInfo` can be used to create AzDataMigrationDatabaseInfo. 

The following example creates `AzDataMigrationDatabaseInfo` project for the **AdventureWorks2016** database and adds it to the list to be provided as parameter for project creation.

```powershell
$dbInfo1 = New-AzDataMigrationDatabaseInfo -SourceDatabaseName AdventureWorks2016
$dbList = @($dbInfo1)
```

### Create a project object

Finally you can create Azure Database Migration project called *MyDMSProject* located in *East US* using `New-AzDataMigrationProject` and adding the previously created source and target connections and the list of databases to migrate.

```powershell
$project = New-AzDataMigrationProject -ResourceGroupName myResourceGroup `
  -ServiceName $service.Name `
  -ProjectName MyDMSProject `
  -Location EastUS `
  -SourceType SQL `
  -TargetType SQLDB `
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

The next step is to select the source and target databases and provide table mapping to migrate as a parameter by using the `New-AzDmsSelectedDB` cmdlet, as shown in the following example:

```powershell
$selectedDbs = New-AzDmsSelectedDB -MigrateSqlServerSqlDb -Name AdventureWorks2016 `
  -TargetDatabaseName AdventureWorks2016 `
  -TableMap $tableMap
```

### Create the migration task and start it

Use the `New-AzDataMigrationTask` cmdlet to create and start a migration task. This cmdlet expects the following parameters:

* *TaskType*. Type of migration task to create for SQL Server to Azure SQL Database migration type *MigrateSqlServerSqlDb* is expected. 
* *Resource Group Name*. Name of Azure resource group in which to create the task.
* *ServiceName*. Azure Database Migration Service instance in which to create the task.
* *ProjectName*. Name of Azure Database Migration Service project in which to create the task. 
* *TaskName*. Name of task to be created. 
* *SourceConnection*. AzDmsConnInfo object representing source SQL Server connection.
* *TargetConnection*. AzDmsConnInfo object representing target Azure SQL Database connection.
* *SourceCred*. [PSCredential](https://docs.microsoft.com/dotnet/api/system.management.automation.pscredential?redirectedfrom=MSDN&view=powershellsdk-1.1.0) object for connecting to source server.
* *TargetCred*. [PSCredential](https://docs.microsoft.com/dotnet/api/system.management.automation.pscredential?redirectedfrom=MSDN&view=powershellsdk-1.1.0) object for connecting to target server.
* *SelectedDatabase*. AzDataMigrationSelectedDB object representing the source and target database mapping.
* *SchemaValidation*. (optional, switch parameter) Following the migration, performs a comparison of the schema information between source and target.
* *DataIntegrityValidation*. (optional, switch parameter) Following the migration, performs a checksum-based data integrity validation between source and target.
* *QueryAnalysisValidation*. (optional, switch parameter) Following the migration, performs a quick and intelligent query analysis by retrieving queries from the source database and executes them in the target.

The following example creates and starts a migration task named myDMSTask:

```powershell
$migTask = New-AzDataMigrationTask -TaskType MigrateSqlServerSqlDb `
  -ResourceGroupName myResourceGroup `
  -ServiceName $service.Name `
  -ProjectName $project.Name `
  -TaskName myDMSTask `
  -SourceConnection $sourceConnInfo `
  -SourceCred $sourceCred `
  -TargetConnection $targetConnInfo `
  -TargetCred $targetCred `
  -SelectedDatabase  $selectedDbs `
```

The following example creates and starts the same migration task as above but also performs all three validations:

```powershell
$migTask = New-AzDataMigrationTask -TaskType MigrateSqlServerSqlDb `
  -ResourceGroupName myResourceGroup `
  -ServiceName $service.Name `
  -ProjectName $project.Name `
  -TaskName myDMSTask `
  -SourceConnection $sourceConnInfo `
  -SourceCred $sourceCred `
  -TargetConnection $targetConnInfo `
  -TargetCred $targetCred `
  -SelectedDatabase  $selectedDbs `
  -SchemaValidation `
  -DataIntegrityValidation `
  -QueryAnalysisValidation `
```

## Monitor the migration

You can monitor the migration task running by querying the state property of the task as shown in the following example:

```powershell
if (($mytask.ProjectTask.Properties.State -eq "Running") -or ($mytask.ProjectTask.Properties.State -eq "Queued"))
{
  write-host "migration task running"
}
```

## Deleting the DMS instance

After the migration is complete, you can delete the Azure DMS instance:

```powershell
Remove-AzDms -ResourceGroupName myResourceGroup -ServiceName MyDMS
```

## Next step

* Review the migration guidance in the Microsoft [Database Migration Guide](https://datamigration.microsoft.com/).
