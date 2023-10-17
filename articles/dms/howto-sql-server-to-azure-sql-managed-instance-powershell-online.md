---
title: "PowerShell: Migrate SQL Server to SQL Managed Instance online"
titleSuffix: Azure Database Migration Service
description: Learn to online migrate from SQL Server to Azure SQL Managed Instance by using Azure PowerShell and the Azure Database Migration Service.
author: croblesm
ms.author: roblescarlos
ms.reviewer: randolphwest
ms.date: 12/16/2020
ms.service: dms
ms.topic: how-to
ms.custom:
  - devx-track-azurepowershell
  - sql-migration-content
---

# Migrate SQL Server to SQL Managed Instance online with PowerShell & Azure Database Migration Service

In this article, you online migrate the **Adventureworks2016** database restored to an on-premises instance of SQL Server 2005 or above to an Azure SQL SQL Managed Instance by using Microsoft Azure PowerShell. You can migrate databases from a SQL Server instance to an SQL Managed Instance by using the `Az.DataMigration` module in Microsoft Azure PowerShell.

In this article, you learn how to:
> [!div class="checklist"]
>
> * Create a resource group.
> * Create an instance of Azure Database Migration Service.
> * Create a migration project in an instance of Azure Database Migration Service.
> * Run the migration online.

[!INCLUDE [online-offline](../../includes/database-migration-service-offline-online.md)]

This article provides steps for an online migration, but it's also possible to migrate [offline](howto-sql-server-to-azure-sql-managed-instance-powershell-offline.md).


## Prerequisites

To complete these steps, you need:

* [SQL Server 2016 or above](https://www.microsoft.com/sql-server/sql-server-downloads) (any edition).
* A local copy of the **AdventureWorks2016** database, which is available for download [here](/sql/samples/adventureworks-install-configure).
* To enable the TCP/IP protocol, which is disabled by default with SQL Server Express installation. Enable the TCP/IP protocol by following the article [Enable or Disable a Server Network Protocol](/sql/database-engine/configure-windows/enable-or-disable-a-server-network-protocol#SSMSProcedure).
* To configure your [Windows Firewall for database engine access](/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
* An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.
* A SQL Managed Instance. You can create a SQL Managed Instance by following the detail in the article [Create a ASQL Managed Instance](/azure/azure-sql/managed-instance/instance-create-quickstart).
* To download and install [Data Migration Assistant](https://www.microsoft.com/download/details.aspx?id=53595) v3.3 or later.
* A Microsoft Azure Virtual Network created using the Azure Resource Manager deployment model, which provides the Azure Database Migration Service with site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](../expressroute/expressroute-introduction.md) or [VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md).
* A completed assessment of your on-premises database and schema migration using Data Migration Assistant, as described in the article [Performing a SQL Server migration assessment](/sql/dma/dma-assesssqlonprem).
* To download and install the `Az.DataMigration` module (version 0.7.2 or later) from the PowerShell Gallery by using [Install-Module PowerShell cmdlet](/powershell/module/powershellget/Install-Module).
* To ensure that the credentials used to connect to source SQL Server instance have the [CONTROL SERVER](/sql/t-sql/statements/grant-server-permissions-transact-sql) permission.
* To ensure that the credentials used to connect to target SQL Managed Instance has the CONTROL DATABASE permission on the target SQL Managed Instance databases.

    > [!IMPORTANT]
    > For online migrations, you must already have set up your Microsoft Entra credentials. For more information, see the article [Use the portal to create a Microsoft Entra application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md).

## Create a resource group

An Azure resource group is a logical container in which Azure resources are deployed and managed.

Create a resource group by using the [`New-AzResourceGroup`](/powershell/module/az.resources/new-azresourcegroup) command.

The following example creates a resource group named *myResourceGroup* in the *East US* region.

```powershell
New-AzResourceGroup -ResourceGroupName myResourceGroup -Location EastUS
```

## Create an instance of DMS

You can create new instance of Azure Database Migration Service by using the `New-AzDataMigrationService` cmdlet.
This cmdlet expects the following required parameters:

* *Azure Resource Group name*. You can use [`New-AzResourceGroup`](/powershell/module/az.resources/new-azresourcegroup) command to create an Azure Resource group as previously shown and provide its name as a parameter.
* *Service name*. String that corresponds to the desired unique service name for Azure Database Migration Service.
* *Location*. Specifies the location of the service. Specify an Azure data center location, such as West US or Southeast Asia.
* *Sku*. This parameter corresponds to DMS Sku name. Currently supported Sku names are *Basic_1vCore*, *Basic_2vCores*, *GeneralPurpose_4vCores*.
* *Virtual Subnet Identifier*. You can use the cmdlet [`New-AzVirtualNetworkSubnetConfig`](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) to create a subnet.

The following example creates a service named *MyDMS* in the resource group *MyDMSResourceGroup* located in the *East US* region using a virtual network named *MyVNET* and a subnet named *MySubnet*.


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
Define source and target connectivity connection strings.

The following script defines source SQL Server connection details: 

```powershell
# Source connection properties
$sourceDataSource = "<mysqlserver.domain.com/privateIP of source SQL>"
$sourceUserName = "domain\user"
$sourcePassword = "mypassword"
```

The following script defines the target SQL Managed Instance connection details: 

```powershell
# Target MI connection properties
$targetMIResourceId = "/subscriptions/<subid>/resourceGroups/<rg>/providers/Microsoft.Sql/managedInstances/<myMI>"
$targetUserName = "<user>"
$targetPassword = "<password>"
```



### Define source and target database mapping

Provide databases to be migrated in this  migration project

The following script maps source database to the respective new database on the target SQL Managed Instance with the provided name.

```powershell
# Selected databases (Source database name to target database name mapping)
$selectedDatabasesMap = New-Object System.Collections.Generic.Dictionary"[String,String]" 
$selectedDatabasesMap.Add("<source  database name>", "<target database name> ")
```

For multiple databases,  add the list of databases to the above script using the following format:

```powershell
$selectedDatabasesMap = New-Object System.Collections.Generic.Dictionary"[String,String]" 
$selectedDatabasesMap.Add("<source  database name1>", "<target database name1> ")
$selectedDatabasesMap.Add("<source  database name2>", "<target database name2> ")
```

### Create DMS Project

You can create an Azure Database Migration Service project within the DMS instance.

```powershell
# Create DMS project
$project = New-AzDataMigrationProject `
  -ResourceGroupName $dmsResourceGroupName `
  -ServiceName $dmsServiceName `
  -ProjectName $dmsProjectName `
  -Location $dmsLocation `
  -SourceType SQL `
  -TargetType SQLMI `

# Create selected databases object
$selectedDatabases = @();
foreach ($sourceDbName in $selectedDatabasesMap.Keys){
    $targetDbName = $($selectedDatabasesMap[$sourceDbName])
    $selectedDatabases += New-AzDmsSelectedDB -MigrateSqlServerSqlDbMi `
      -Name $sourceDbName `
      -TargetDatabaseName $targetDbName `
      -BackupFileShare $backupFileShare `
}
```



### Create a backup FileShare object

Now create a FileShare object representing the local SMB network share to which Azure Database Migration Service can take the source database backups using the New-AzDmsFileShare cmdlet.

```powershell
# SMB Backup share properties
$smbBackupSharePath = "\\shareserver.domain.com\mybackup"
$smbBackupShareUserName = "domain\user"
$smbBackupSharePassword = "<password>"

# Create backup file share object
$smbBackupSharePasswordSecure = ConvertTo-SecureString -String $smbBackupSharePassword -AsPlainText -Force
$smbBackupShareCredentials = New-Object System.Management.Automation.PSCredential ($smbBackupShareUserName, $smbBackupSharePasswordSecure)
$backupFileShare = New-AzDmsFileShare -Path $smbBackupSharePath -Credential $smbBackupShareCredentials
```

### Define the Azure Storage 

Select Azure Storage Container to be used for migration: 

```powershell
# Storage resource id
$storageAccountResourceId = "/subscriptions/<subscriptionname>/resourceGroups/<rg>/providers/Microsoft.Storage/storageAccounts/<mystorage>"
```


<a name='configure-azure-active-directory-app'></a>

### Configure Microsoft Entra App

Provide the required details for Microsoft Entra ID for an online SQL Managed Instance migration: 

```powershell
# AAD properties
$AADAppId = "<appid-guid>"
$AADAppKey = "<app-key>"

# Create AAD object
$AADAppKeySecure = ConvertTo-SecureString $AADAppKey -AsPlainText -Force
$AADApp = New-AzDmsAadApp -ApplicationId $AADAppId -AppKey $AADAppKeySecure
```


## Create and start a migration task

Next, create and start an Azure Database Migration Service task. Call the source and target using variables, and list the database tables to be migrated: 


```powershell
# Managed Instance online migration properties
$dmsTaskName = "testmigration1"

# Create source connection info
$sourceConnInfo = New-AzDmsConnInfo -ServerType SQL `
  -DataSource $sourceDataSource `
  -AuthType WindowsAuthentication `
  -TrustServerCertificate:$true
$sourcePasswordSecure = ConvertTo-SecureString -String $sourcePassword -AsPlainText -Force
$sourceCredentials = New-Object System.Management.Automation.PSCredential ($sourceUserName, $sourcePasswordSecure)

# Create target connection info
$targetConnInfo = New-AzDmsConnInfo -ServerType SQLMI `
    -MiResourceId $targetMIResourceId
$targetPasswordSecure = ConvertTo-SecureString -String $targetPassword -AsPlainText -Force
$targetCredentials = New-Object System.Management.Automation.PSCredential ($targetUserName, $targetPasswordSecure)
```

The following example creates and starts an online migration task: 

```powershell
# Create DMS migration task
$migTask = New-AzDataMigrationTask -TaskType MigrateSqlServerSqlDbMiSync `
  -ResourceGroupName $dmsResourceGroupName `
  -ServiceName $dmsServiceName `
  -ProjectName $dmsProjectName `
  -TaskName $dmsTaskName `
  -SourceConnection $sourceConnInfo `
  -SourceCred $sourceCredentials `
  -TargetConnection $targetConnInfo `
  -TargetCred $targetCredentials `
  -SelectedDatabase  $selectedDatabases `
  -BackupFileShare $backupFileShare `
  -AzureActiveDirectoryApp $AADApp `
  -StorageResourceId $storageAccountResourceId
```

For more information, see [New-AzDataMigrationTask](/powershell/module/az.datamigration/new-azdatamigrationtask).

## Monitor the migration

To monitor the migration, perform the following tasks.

### Check the status of task

```powershell
# Get migration task status details
$migTask = Get-AzDataMigrationTask `
                    -ResourceGroupName $dmsResourceGroupName `
                    -ServiceName $dmsServiceName `
                    -ProjectName $dmsProjectName `
                    -Name $dmsTaskName `
                    -ResultType DatabaseLevelOutput `
                    -Expand

# Task state will be either of 'Queued', 'Running', 'Succeeded', 'Failed', 'FailedInputValidation' or 'Faulted'
$taskState = $migTask.ProjectTask.Properties.State

# Display task state
$taskState | Format-List
```

Use the following to get list of errors:-

```powershell
# Get task errors
$taskErrors = $migTask.ProjectTask.Properties.Errors

# Display task errors
foreach($taskError in $taskErrors){
    $taskError |  Format-List
}


# Get database level details
$databaseLevelOutputs = $migTask.ProjectTask.Properties.Output

# Display database level details
foreach($databaseLevelOutput in $databaseLevelOutputs){

    # This is the source database name.
    $databaseName = $databaseLevelOutput.SourceDatabaseName;

    Write-Host "=========="
    Write-Host "Start migration details for database " $databaseName
    # This is the status for that database - It will be either of:
    # INITIAL, FULL_BACKUP_UPLOADING, FULL_BACKUP_UPLOADED, LOG_FILES_UPLOADING,
    # CUTOVER_IN_PROGRESS, CUTOVER_INITIATED, CUTOVER_COMPLETED, COMPLETED, CANCELLED, FAILED
    $databaseMigrationState = $databaseLevelOutput.MigrationState;

    # Details about last restored backup. This contains file names, LSN, backup date, etc 
    $databaseLastRestoredBackup = $databaseLevelOutput.LastRestoredBackupSetInfo
        
    # Details about last restored backup. This contains file names, LSN, backup date, etc 
    $databaseLastRestoredBackup = $databaseLevelOutput.LastRestoredBackupSetInfo

    # Details about last Currently active/most recent backups. This contains file names, LSN, backup date, etc 
    $databaseActiveBackpusets = $databaseLevelOutput.ActiveBackupSets

    # Display info
    $databaseLevelOutput | Format-List

    Write-Host "Currently active/most recent backupset details:"
    $databaseActiveBackpusets  | select BackupStartDate, BackupFinishedDate, FirstLsn, LastLsn -ExpandProperty ListOfBackupFiles | Format-List

    Write-Host "Last restored backupset details:"
    $databaseLastRestoredBackupFiles  | Format-List

    Write-Host "End migration details for database " $databaseName
    Write-Host "=========="
}
```

## Performing the cutover 

With an online migration, a full backup and restore of databases is performed, and then work proceeds on restoring the Transaction Logs stored in the BackupFileShare.

When the database in a Azure SQL Managed Instance is updated with latest data and is in sync with the source database, you can perform a cutover.

The following example will complete the cutover\migration. Users invoke this command at their discretion.

```powershell
$command = Invoke-AzDmsCommand -CommandType CompleteSqlMiSync `
                               -ResourceGroupName myResourceGroup `
                               -ServiceName $service.Name `
                               -ProjectName $project.Name `
                               -TaskName myDMSTask `
                               -DatabaseName "Source DB Name"
```

## Deleting the instance of Azure Database Migration Service

After the migration is complete, you can delete the Azure Database Migration Service instance:

```powershell
Remove-AzDms -ResourceGroupName myResourceGroup -ServiceName MyDMS
```

## Additional resources

For information about additional migrating scenarios (source/target pairs), see the Microsoft [Database Migration Guide](/data-migration/).

## Next steps

Find out more about Azure Database Migration Service in the article [What is the Azure Database Migration Service?](./dms-overview.md).
