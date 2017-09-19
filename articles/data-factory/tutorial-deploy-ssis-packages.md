---
title: Deploy SSIS packages to Azure | Microsoft Docs
description: This article explains how to deploy SSIS packages to managed-dedicated integration runtime provided by Azure Data Factory.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang: powershell
ms.topic: hero-article
ms.date: 09/06/2017
ms.author: spelluru

---
# Deploy SQL Server Integration Services (SSIS) packages to Azure 
This tutorial provides steps for provisioning a managed-dedicated integration runtime in Azure. Then, you can use SQL Server Data Tools (SSDT) or SQL Server Management Studio (SSMS) to deploy SQL Server Integration Services (SSIS) packages to this runtime on Azure. In this tutorial, you do the following steps: 

> [!div class="checklist"]
> * Create variables
> * Create a data factory. 
> * Create a managed-dedicated integration runtime
> * Start the managed-dedicated integration runtime
> * Deploy SSIS packages
> * Review the complete script


## Prerequisites

- **Azure subscription**. If you don't have a subscription, you can create a [free trial](http://azure.microsoft.com/pricing/free-trial/) account.
- **Azure Storage account**. If you don't already have an Azure Storage account, create one in the Azure portal before you get started. To provision managed-dedicated integration runtime in the cloud, you first need to create a data factory. To create a data factory, you must specify a storage account where the logging information is stored. 
- **Azure SQL Database server** or **SQL Server Managed Instance**. If you don't already have a database server, create one in the Azure portal before you get started. This server hosts the SSIS Catalog database (SSISDB). We recommend that you create the database server in the same Azure region as the integration runtime. This configuration lets the integration runtime write execution logs to SSISDB without crossing Azure regions. 
- **Classic Virtual Network(VNet) (optional)**. You must have an Azure Virtual Network (VNet) if at least one of the following conditions is true:
    - You are hosting the SSIS Catalog database on a SQL Server Managed Instance that is part of a VNet.
    - You want to connect to on-premises data sources from SSIS packages running on a SQL Server Managed Instance.
- **Azure PowerShell**. Follow the instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps). You use PowerShell to run a script to provision managed-dedicated integration runtime that runs SSIS packages in the cloud. 

## Overview

## Create variables
Define variables for use in the script in this tutorial:

```powershell
# Azure Data Factory information
$SubscriptionName = "<your azure subscription name>"
$ResourceGroupName = "<azure resource group name>"
$DataFactoryName = "<globablly unique name for your data factory>"
$DataFactoryLocation = "EastUS" # data factory v2 can be created only in east us region. 
$DataFactoryLoggingStorageAccountName = "<storage account name>"
$DataFactoryLoggingStorageAccountKey = "<storage account key>"

# Managed-dedicated integratin runtime
$MDIRName = "<name of managed-dedicated integration runtime>"
$MDIRDescription = "This is my managed-dedicated integration runtime instance"
$MDIRLocation = "EastUS" # only East US|North Europe are supported
$MDIRNodeSize = "Standard_A4_v2" # currently, only Standard_A4_v2|Standard_A8_v2|Standard_D1_v2|Standard_D2_v2|Standard_D3_v2|Standard_D4_v2 are supported 
$MDIRNodeNumber = 2 # only 1-10 nodes are supported
$MDIRMaxParallelExecutionsPerNode = 2 # only 1-8 parallel executions per node are supported
$VnetId = "" # OPTIONAL: only classic VNet is supported
$SubnetName = "" # OPTIONAL: only classic VNet is supported

# SSISDB info
$SSISDBServerEndpoint = "<your azure sql server name>.database.windows.net"
$SSISDBServerAdminUserName = "<sql server admin user ID>"
$SSISDBServerAdminPassword = "<sql server admin password>"
$SSISDBPricingTier = "<your azure sql database pricing tier, e.g. S0, S3, or leave it empty for azure sql managed instance>" # Not applicable for Azure SQL MI

##### End of managed-dedicated integration runtime specifications ##### 

$SSISDBConnectionString = "Data Source=" + $SSISDBServerEndpoint + ";User ID="+ $SSISDBServerAdminUserName +";Password="+ $SSISDBServerAdminPassword
```
## Create a resource group
Create an [Azure resource group](../azure-resource-manager/resource-group-overview.md) using the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command. A resource group is a logical container into which Azure resources are deployed and managed as a group. The following example creates a resource group named `myResourceGroup` in the `westeurope` location.

```powershell
New-AzureRmResourceGroup -Location $DataFactoryLocation -Name $ResourceGroupName
```

## Create a data factory
Run the following command to create a data factory:

```powershell
New-AzureRmDataFactoryV2 -Location $DataFactoryLocation -LoggingStorageAccountName $DataFactoryLoggingStorageAccountName -LoggingStorageAccountKey $DataFactoryLoggingStorageAccountKey -Name $DataFactoryName -ResourceGroupName $ResourceGroupName 
```

## Create integration runtime
Run the following command to create a managed-dedicated integration runtime that runs SSIS packages in Azure: 

```powershell
New-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName -Type Managed -CatalogServerEndpoint $SSISDBServerEndpoint -CatalogAdminUserName $SSISDBServerAdminUserName -CatalogAdminPassword $SSISDBServerAdminPassword -CatalogPricingTier $SSISDBPricingTier -Description $MDIRDescription -Location $MDIRLocation -NodeSize $MDIRNodeSize -NumberOfNodes $MDIRNodeNumber -MaxParallelExecutionsPerNode $MDIRMaxParallelExecutionsPerNode -VnetId $VnetId -Subnet $SubnetName
```

## Start integration runtime
Run the following command to start the managed-dedicated integration runtime: 

```powershell
Start-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName -Sync -Force
```
This command takes from **20 to 30 minutes** to complete. 

## Deploy SSIS packages
Now, use SQL Server Data Tools (SSDT) to deploy your SSIS packages to Azure. Connect to your Azure SQL server that hosts the SSIS catalog (SSISDB). The name of the Azure SQL server is in the format: <servername>.database.windows.net. See [Deploy packages](/sql/integration-services/packages/deploy-integration-services-ssis-projects-and-packages#deploy-packages-to-integration-services-server) article for instructions. 

## Parameters in script
Field | Description
----- | -----------
SubscriptionName | Your Azure subscription, under which the data factory and managed-dedicated integration runtime are created.
ResourceGroupName | Your Azure resource group name, in which the data factory and managed-dedicated integration runtime are created.
DataFactoryLocation| Region for the data factory.
DataFactoryName	|Name of the data factory. 
DataFactoryLoggingStorageAccountName | Azure storage account that stores logging information from Azure Data Factory.
DataFactoryLoggingStorageAccountKey | Storage account key for the logging storage account. 
MDIRName | Name of the managed-dedicated integration runtime.
MDIRLocation | Location of the managed-dedicated integration runtime. The value should be the region where you have an existing Azure SQL database(DB) /Managed Instance (MI) server to host SSISDB and or an existing VNet that is connected to your on-prem network. If your existing Azure SQL database/MI server is not in the same region as your existing VNet, first create managed-dedicated integration runtime inside a new VNet in the same region as your existing Azure SQL DB/MI server, then configure a VNet-to-VNet connection with your existing VNet.  
MDIRNodeSize | The number of nodes (node size) of compute node that hosts managed-dedicated integration runtime.
MDIRNodeNumber | The number of nodes in your managed-dedicated integration runtime cluster. 
VnetId | The VNet resource ID for your managed-dedicated integration runtime to join. For example,`/subscriptions/<subscription_guid>/resourceGroups/<group_name>/providers/Microsoft.ClassicNetwork/virtualNetworks/<vnet_name>`.The VNet should be created under the same Azure subscription that is used to create the data factory and managed-dedicated integration runtime and in the same region as the managed-dedicated integration runtime. A VNet is only required if you have Azure SQL MI hosting SSISDB inside VNet or you need on-premises data access; otherwise leave this field empty.
SubnetName | The subnet name for your managed-dedicated integration runtime to join. This field is required only if you have Azure SQL MI hosting SSISDB inside VNet and or you need on-prem data access, otherwise leave this field empty.
SSISDBServerEndpoint | The endpoint of your existing Azure SQL DB/MI server to host SSISDB. For example, ssistestdb.database.windows.net.
SSISDBServerAdminUserName | The admin username of your existing Azure SQL DB/MI server for us to prepare SSISDB on your behalf.
SSISDBServerAdminPassword | The admin password of your existing Azure SQL DB/MI server for us to prepare SSISDB on your behalf.
SSISDBPricingTier | The pricing tier for your SSISDB hosted by Azure SQL DB server. This field is required only for Azure SQL DB server hosting SSISDB, otherwise leave this field empty for Azure SQL MI hosting SSISDB.


## Complete script
In this release, you must use PowerShell to provision an instance of managed-dedicated integration runtime that runs SSIS packages in the cloud. Currently, it's not possible to provision this runtime by using Azure portal. 

The PowerShell script in this section configures an instance of managed-dedicated integration runtime in the cloud that runs SSIS packages. After you run this script successfully, you can deploy and run SSIS packages in the Microsoft Azure cloud, in Azure SQL Database or on a SQL Server Managed Instance.

1. Launch the Windows PowerShell Integrated Scripting Environment (ISE).
2. In the ISE, run the following command from the command prompt.    
    ```powershell
    Set-ExecutionPolicy Unrestricted -Scope CurrentUser
    ```
3. Copy the PowerShell script in this section and paste it into the ISE.
4. Provide appropriate values for the script parameters in the "SSIS in Azure specifications" section at the beginning of the script. These parameters are described in the next section.
5. Run the script. The `Start-AzureRmDataFactoryV2IntegrationRuntime` command near the end of the script runs for **20 to 30 minutes**.

> [!NOTE]
> The script connects to your Azure SQL Database or SQL Server Managed Instance to prepare the SSIS Catalog database (SSISDB). The script also configures permissions and settings for your VNet, if specified, and joins the new instance of managed-dedicated integration runtime to the VNet.


```powershell
Set-ExecutionPolicy Unrestricted -Scope CurrentUser

##### Managed-dedicated integratino runtime specifications

# If your inputs contain PSH special characters, e.g. "$", please precede it with the escape character "`" like "`$". 

# Azure Data Factory information
$SubscriptionName = "<your azure subscription name>"
$ResourceGroupName = "<azure resource group name>"
$DataFactoryName = "<globablly unique name for your data factory>"
$DataFactoryLocation = "EastUS" # data factory v2 can be created only in east us region. 
$DataFactoryLoggingStorageAccountName = "<storage account name>"
$DataFactoryLoggingStorageAccountKey = "<storage account key>"

# Managed-dedicated integratin runtime
$MDIRName = "<name of managed-dedicated integration runtime>"
$MDIRDescription = "This is my managed-dedicated integration runtime instance"
$MDIRLocation = "EastUS" # only East US|North Europe are supported
$MDIRNodeSize = "Standard_A4_v2" # currently, only Standard_A4_v2|Standard_A8_v2|Standard_D1_v2|Standard_D2_v2|Standard_D3_v2|Standard_D4_v2 are supported 
$MDIRNodeNumber = 2 # only 1-10 nodes are supported
$MDIRMaxParallelExecutionsPerNode = 2 # only 1-8 parallel executions per node are supported
$VnetId = "" # OPTIONAL: only classic VNet is supported
$SubnetName = "" # OPTIONAL: only classic VNet is supported

# SSISDB info
$SSISDBServerEndpoint = "<your azure sql server name>.database.windows.net"
$SSISDBServerAdminUserName = "<sql server admin user ID>"
$SSISDBServerAdminPassword = "<sql server admin password>"
$SSISDBPricingTier = "<your azure sql database pricing tier, e.g. S0, S3, or leave it empty for azure sql managed instance>" # Not applicable for Azure SQL MI

##### End of managed-dedicated integration runtime specifications ##### 

$SSISDBConnectionString = "Data Source=" + $SSISDBServerEndpoint + ";User ID="+ $SSISDBServerAdminUserName +";Password="+ $SSISDBServerAdminPassword

##### Validate Azure SQL DB/MI server ##### 

$sqlConnection = New-Object System.Data.SqlClient.SqlConnection $SSISDBConnectionString;
Try
{
    $sqlConnection.Open();
}
Catch [System.Data.SqlClient.SqlException]
{
    Write-Warning "Cannot connect to your Azure SQL DB logical server/Azure SQL MI server, exception: $_"  ;
    Write-Warning "Please make sure the server you specified has already been created. Do you want to proceed? [Y/N]"
    $yn = Read-Host
    if(!($yn -ieq "Y"))
    {
        Return;
    } 
}

##### Login and select Azure subscription #####

Login-AzureRmAccount
Select-AzureRmSubscription -SubscriptionName $SubscriptionName

##### Automatically configure VNet permissions/settings for managed-dedicated integration runtime to join ##### 

# Register to Azure Batch resource provider
if(![string]::IsNullOrEmpty($VnetId) -and ![string]::IsNullOrEmpty($SubnetName))
{
    $BatchObjectId = (Get-AzureRmADServicePrincipal -ServicePrincipalName "MicrosoftAzureBatch").Id
    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Batch
    while(!(Get-AzureRmResourceProvider -ProviderNamespace "Microsoft.Batch").RegistrationState.Contains("Registered"))
    {
	Start-Sleep -s 10
    }
    # Assign VM contributor role to Microsoft.Batch
    New-AzureRmRoleAssignment -ObjectId $BatchObjectId -RoleDefinitionName "Classic Virtual Machine Contributor" -Scope $VnetId
}

##### Provision data factory + managed-dedicated integration runtime ##### 
New-AzureRmResourceGroup -Location $DataFactoryLocation -Name $ResourceGroupName
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.DataFactory
New-AzureRmDataFactoryV2 -Location $DataFactoryLocation -LoggingStorageAccountName $DataFactoryLoggingStorageAccountName -LoggingStorageAccountKey $DataFactoryLoggingStorageAccountKey -Name $DataFactoryName -ResourceGroupName $ResourceGroupName 
New-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName -Type Managed -CatalogServerEndpoint $SSISDBServerEndpoint -CatalogAdminUserName $SSISDBServerAdminUserName -CatalogAdminPassword $SSISDBServerAdminPassword -CatalogPricingTier $SSISDBPricingTier -Description $MDIRDescription -Location $MDIRLocation -NodeSize $MDIRNodeSize -NumberOfNodes $MDIRNodeNumber -MaxParallelExecutionsPerNode $MDIRMaxParallelExecutionsPerNode -VnetId $VnetId -Subnet $SubnetName
write-host("##### Starting #####")
Start-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName -Sync -Force
write-host("##### Completed #####")
write-host("If any cmdlet is unsuccessful, please consider using -Debug option for diagnostics.")

##### Get managed-dedicated integration runtime status #####

#Get-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName
#Get-AzureRmDataFactoryV2IntegrationRuntimeStatus -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName

##### Reconfigure managed-dedicated integration runtime, e.g. scale out from 2 to 5 nodes #####

#Stop-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName 
#Set-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName -NumberOfNodes 5
#Start-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName -Sync

##### Clean up ######

#Stop-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName -Force
#Remove-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName -Force
#Remove-AzureRmDataFactoryV2 -Name $DataFactoryName -ResourceGroupName $ResourceGroupName -Force
#Remove-AzureRmResourceGroup -Name $ResourceGroupName -Force


```

## Next steps
See the following SSIS articles for deploying and running SSIS packages: 

- [Deploy SSIS packages](/sql/integration-services/packages/deploy-integration-services-ssis-projects-and-packages#deploy-packages-to-integration-services-server)
- [Run SSIS packages](/sql/integration-services/packages/run-integration-services-ssis-packages)
- [Schedule SSIS packages](/sql/integration-services/packages/sql-server-agent-jobs-for-packages)
