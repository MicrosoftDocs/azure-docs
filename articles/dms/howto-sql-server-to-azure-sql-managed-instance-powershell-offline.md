---
title: "PowerShell: Migrate SQL Server to SQL Managed Instance offline"
titleSuffix: Azure Database Migration Service
description: Learn to offline migrate from SQL Server to Azure SQL Managed Instance by using Azure PowerShell and the Azure Database Migration Service.
author: croblesm
ms.author: roblescarlos
ms.reviewer: craigg
ms.date: 12/16/2020
ms.service: dms
ms.topic: how-to
ms.custom:
  - seo-lt-2019
  - fasttrack-edit
  - devx-track-azurepowershell
---

# Migrate SQL Server to SQL Managed Instance offline with PowerShell & Azure Database Migration Service

In this article, you offline migrate the **Adventureworks2016** database restored to an on-premises instance of SQL Server 2005 or above to an Azure SQL SQL Managed Instance by using Microsoft Azure PowerShell. You can migrate databases from a SQL Server instance to an SQL Managed Instance by using the `Az.DataMigration` module in Microsoft Azure PowerShell.

In this article, you learn how to:
> [!div class="checklist"]
>
> * Create a resource group.
> * Create an instance of Azure Database Migration Service.
> * Create a migration project in an instance of Azure Database Migration Service.
> * Run the migration offline.

[!INCLUDE [online-offline](../../includes/database-migration-service-offline-online.md)]

This article provides steps for an offline migration, but it's also possible to migrate [online](howto-sql-server-to-azure-sql-managed-instance-powershell-online.md).


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


## Sign in to your Microsoft Azure subscription

Sign in to your Azure subscription by using PowerShell. For more information, see the article [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

## Create a resource group

An Azure resource group is a logical container in which Azure resources are deployed and managed.

Create a resource group by using the [`New-AzResourceGroup`](/powershell/module/az.resources/new-azresourcegroup) command.

The following example creates a resource group named *myResourceGroup* in the *East US* region.

```powershell
New-AzResourceGroup -ResourceGroupName myResourceGroup -Location EastUS
```

## Create an instance of Azure Database Migration Service

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

### Create a Database Connection Info object for the source and target connections

You can create a Database Connection Info object by using the `New-AzDmsConnInfo` cmdlet, which expects the following parameters:

* *ServerType*. The type of database connection requested, for example, SQL, Oracle, or MySQL. Use SQL for SQL Server and Azure SQL.
* *DataSource*. The name or IP of a SQL Server instance or Azure SQL Database instance.
* *AuthType*. The authentication type for connection, which can be either SqlAuthentication or WindowsAuthentication.
* *TrustServerCertificate*. This parameter sets a value that indicates whether the channel is encrypted while bypassing walking the certificate chain to validate trust. The value can be `$true` or `$false`.

The following example creates a Connection Info object for a source SQL Server called *MySourceSQLServer* using sql authentication:

```powershell
$sourceConnInfo = New-AzDmsConnInfo -ServerType SQL `
  -DataSource MySourceSQLServer `
  -AuthType SqlAuthentication `
  -TrustServerCertificate:$true
```

The next example shows creation of Connection Info for a Azure SQL Managed Instance named ‘targetmanagedinstance’:

```powershell
$targetResourceId = (Get-AzSqlInstance -Name "targetmanagedinstance").Id
$targetConnInfo = New-AzDmsConnInfo -ServerType SQLMI -MiResourceId $targetResourceId
```

### Provide databases for the migration project

Create a list of `AzDataMigrationDatabaseInfo` objects that specifies databases as part of the Azure Database Migration Service project, which can be provided as parameter for creation of the project. You can use the cmdlet `New-AzDataMigrationDatabaseInfo` to create `AzDataMigrationDatabaseInfo`.

The following example creates the `AzDataMigrationDatabaseInfo` project for the **AdventureWorks2016** database and adds it to the list to be provided as parameter for project creation.

```powershell
$dbInfo1 = New-AzDataMigrationDatabaseInfo -SourceDatabaseName AdventureWorks
$dbList = @($dbInfo1)
```

### Create a project object

Finally, you can create an Azure Database Migration Service project called *MyDMSProject* located in *East US* using `New-AzDataMigrationProject` and add the previously created source and target connections and the list of databases to migrate.

```powershell
$project = New-AzDataMigrationProject -ResourceGroupName myResourceGroup `
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

Next, create and start an Azure Database Migration Service task. This task requires connection credential information for both the source and target, as well as the list of database tables to be migrated and the information already provided with the project created as a prerequisite.

### Create credential parameters for source and target

Create connection security credentials as a [PSCredential](/dotnet/api/system.management.automation.pscredential) object.

The following example shows the creation of *PSCredential* objects for both the source and target connections, providing passwords as string variables *$sourcePassword* and *$targetPassword*.

```powershell
$secpasswd = ConvertTo-SecureString -String $sourcePassword -AsPlainText -Force
$sourceCred = New-Object System.Management.Automation.PSCredential ($sourceUserName, $secpasswd)
$secpasswd = ConvertTo-SecureString -String $targetPassword -AsPlainText -Force
$targetCred = New-Object System.Management.Automation.PSCredential ($targetUserName, $secpasswd)
```

### Create a backup FileShare object

Now create a FileShare object representing the local SMB network share to which Azure Database Migration Service can take the source database backups using the `New-AzDmsFileShare` cmdlet.

```powershell
$backupPassword = ConvertTo-SecureString -String $password -AsPlainText -Force
$backupCred = New-Object System.Management.Automation.PSCredential ($backupUserName, $backupPassword)

$backupFileSharePath="\\10.0.0.76\SharedBackup"
$backupFileShare = New-AzDmsFileShare -Path $backupFileSharePath -Credential $backupCred
```

### Create selected database object

The next step is to select the source and target databases by using the `New-AzDmsSelectedDB` cmdlet.

The following example is for migrating a single database from SQL Server to a Azure SQL Managed Instance:

```powershell
$selectedDbs = @()
$selectedDbs += New-AzDmsSelectedDB -MigrateSqlServerSqlDbMi `
  -Name AdventureWorks2016 `
  -TargetDatabaseName AdventureWorks2016 `
  -BackupFileShare $backupFileShare `
```

If an entire SQL Server instance needs a lift-and-shift into a Azure SQL Managed Instance, then a loop to take all databases from the source is provided below. In the following example, for $Server, $SourceUserName, and $SourcePassword, provide your source SQL Server details.

```powershell
$Query = "(select name as Database_Name from master.sys.databases where Database_id>4)";
$Databases= (Invoke-Sqlcmd -ServerInstance "$Server" -Username $SourceUserName
-Password $SourcePassword -database master -Query $Query)
$selectedDbs=@()
foreach($DataBase in $Databases.Database_Name)
    {
      $SourceDB=$DataBase
      $TargetDB=$DataBase

$selectedDbs += New-AzureRmDmsSelectedDB -MigrateSqlServerSqlDbMi `
                                              -Name $SourceDB `
                                              -TargetDatabaseName $TargetDB `
                                              -BackupFileShare $backupFileShare
      }
```

### SAS URI for Azure Storage Container

Create variable containing the SAS URI that provides the Azure Database Migration Service with access to the storage account container to which the service uploads the backup files.

```powershell
$blobSasUri="https://mystorage.blob.core.windows.net/test?st=2018-07-13T18%3A10%3A33Z&se=2019-07-14T18%3A10%3A00Z&sp=rwdl&sv=2018-03-28&sr=c&sig=qKlSA512EVtest3xYjvUg139tYSDrasbftY%3D"
```

> [!NOTE]
> Azure Database Migration Service does not support using an account level SAS token. You must use a SAS URI for the storage account container. [Learn how to get the SAS URI for blob container](../vs-azure-tools-storage-explorer-blobs.md#get-the-sas-for-a-blob-container).

### Additional configuration requirements

There are a few additional requirements you need to address:


* **Select logins**. Create a list of logins to be migrated as shown in the following example:

    ```powershell
    $selectedLogins = @("user1", "user2")
    ```

    > [!IMPORTANT]
    > Currently, Azure Database Migration Service only supports migrating SQL logins.

* **Select agent jobs**. Create list of agent jobs to be migrated as shown in the following example:

    ```powershell
    $selectedAgentJobs = @("agentJob1", "agentJob2")
    ```

    > [!IMPORTANT]
    > Currently, Azure Database Migration Service only supports jobs with T-SQL subsystem job steps.



### Create and start the migration task

Use the `New-AzDataMigrationTask` cmdlet to create and start a migration task.

#### Specify parameters

The `New-AzDataMigrationTask` cmdlet expects the following parameters:

* *TaskType*. Type of migration task to create for SQL Server to Azure SQL Managed Instance migration type *MigrateSqlServerSqlDbMi* is expected.
* *Resource Group Name*. Name of Azure resource group in which to create the task.
* *ServiceName*. Azure Database Migration Service instance in which to create the task.
* *ProjectName*. Name of Azure Database Migration Service project in which to create the task.
* *TaskName*. Name of task to be created.
* *SourceConnection*. AzDmsConnInfo object representing source SQL Server connection.
* *TargetConnection*. AzDmsConnInfo object representing target Azure SQL Managed Instance connection.
* *SourceCred*. [PSCredential](/dotnet/api/system.management.automation.pscredential) object for connecting to source server.
* *TargetCred*. [PSCredential](/dotnet/api/system.management.automation.pscredential) object for connecting to target server.
* *SelectedDatabase*. AzDataMigrationSelectedDB object representing the source and target database mapping.
* *BackupFileShare*. FileShare object representing the local network share that the Azure Database Migration Service can take the source database backups to.
* *BackupBlobSasUri*. The SAS URI that provides the Azure Database Migration Service with access to the storage account container to which the service uploads the backup files. Learn how to get the SAS URI for blob container.
* *SelectedLogins*. List of selected logins to migrate.
* *SelectedAgentJobs*. List of selected agent jobs to migrate.
* *SelectedLogins*. List of selected logins to migrate.
* *SelectedAgentJobs*. List of selected agent jobs to migrate.



#### Create and start a migration task

The following example creates and starts an offline migration task named **myDMSTask**:

```powershell
$migTask = New-AzDataMigrationTask -TaskType MigrateSqlServerSqlDbMi `
  -ResourceGroupName myResourceGroup `
  -ServiceName $service.Name `
  -ProjectName $project.Name `
  -TaskName myDMSTask `
  -SourceConnection $sourceConnInfo `
  -SourceCred $sourceCred `
  -TargetConnection $targetConnInfo `
  -TargetCred $targetCred `
  -SelectedDatabase  $selectedDbs `
  -BackupFileShare $backupFileShare `
  -BackupBlobSasUri $blobSasUri `
  -SelectedLogins $selectedLogins `
  -SelectedAgentJobs $selectedJobs `
```


## Monitor the migration

To monitor the migration, perform the following tasks.

1. Consolidate all the migration details into a variable called $CheckTask.

    To combine migration details such as properties, state, and database information associated with the migration, use the following code snippet:

    ```powershell
    $CheckTask = Get-AzDataMigrationTask -ResourceGroupName myResourceGroup `
                                         -ServiceName $service.Name `
                                         -ProjectName $project.Name `
                                         -Name myDMSTask `
                                         -ResultType DatabaseLevelOutput `
                                         -Expand
    Write-Host ‘$CheckTask.ProjectTask.Properties.Output’
    ```

2. Use the `$CheckTask` variable to get the current state of the migration task.

    To use the `$CheckTask` variable to get the current state of the migration task, you can monitor the migration task running by querying the state property of the task, as shown in the following example:

    ```powershell
    if (($CheckTask.ProjectTask.Properties.State -eq "Running") -or ($CheckTask.ProjectTask.Properties.State -eq "Queued"))
    {
      Write-Host "migration task running"
    }
    else if($CheckTask.ProjectTask.Properties.State -eq "Succeeded")
    {
      Write-Host "Migration task is completed Successfully"
    }
    else if($CheckTask.ProjectTask.Properties.State -eq "Failed" -or $CheckTask.ProjectTask.Properties.State -eq "FailedInputValidation" -or $CheckTask.ProjectTask.Properties.State -eq "Faulted")
    {
      Write-Host "Migration Task Failed"
    }
    ```


## Delete the instance of Azure Database Migration Service

After the migration is complete, you can delete the Azure Database Migration Service instance:

```powershell
Remove-AzDms -ResourceGroupName myResourceGroup -ServiceName MyDMS
```


## Next steps

Find out more about Azure Database Migration Service in the article [What is the Azure Database Migration Service?](./dms-overview.md).

For information about additional migrating scenarios (source/target pairs), see the Microsoft [Database Migration Guide](/data-migration/).
