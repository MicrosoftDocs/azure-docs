---
title: Deploy SSIS packages to cloud | Microsoft Docs
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
This quickstart describes how to provision managed-dedicated integration runtime in Azure. Then, you can use SQL Server Data Tools (SSDT) or SQL Server Management Studio (SSMS) to deploy SQL Server Integration Services (SSIS) packages to this runtime on Azure.  

## Prerequisites

- **Azure subscription**. If you don't have a subscription, you can create a [free trial](http://azure.microsoft.com/pricing/free-trial/) account.
- **Azure Storage account**. If you don't already have an Azure Storage account, create one in the Azure portal before you get started. To provision managed-dedicated integration runtime in the cloud, you first need to create a data factory. To create a data factory, you must specify a storage account where the logging information is stored. 
- **Azure SQL Database server** or **SQL Server Managed Instance**. If you don't already have a database server, create one in the Azure portal before you get started. This server hosts the SSIS Catalog database (SSISDB). We recommend that you create the database server in the same Azure region as the integration runtime. This configuration lets the integration runtime write execution logs to SSISDB without crossing Azure regions. 
- **Classic Virtual Network(VNet) (optional)**. You must have an Azure Virtual Network (VNet) if at least one of the following conditions is true:
    - You are hosting the SSIS Catalog database on a SQL Server Managed Instance which is part of a VNet.
    - You want to connect to on-premises data sources from SSIS packages running on a SQL Server Managed Instance.
- **Azure PowerShell**. Follow the instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps). You use PowerShell to run a script to provision managed-dedicated integration runtime that runs SSIS packages in the cloud. 


## Provision integration runtime
In this release, you must use PowerShell to provision an instance of managed-dedicated integration runtime that runs SSIS packages in the cloud. Currently, it's not possible to provision this runtime by using Azure portal. 

The PowerShell script in this section configures an instance of managed-dedicated integration runtime in the cloud that runs SSIS packages. After you run this script successfully, you can deploy and run SSIS packages in the Microsoft Azure cloud, in Azure SQL Database or on a SQL Server Managed Instance.

1. Launch the Windows PowerShell Integrated Scripting Environment (ISE).
2. In the ISE, run the following command from the command prompt.    
    ```powershell
    Set-ExecutionPolicy Unrestricted -Scope CurrentUser
    ```
3. Copy the PowerShell script in this section and paste it into the ISE.
4. Provide appropriate values for the script parameters in the "SSIS in Azure specifications" section at the beginning of the script. These parameters are described in the following section.
5. Run the script. Expect the `Start-AzureRmDataFactoryV2IntegrationRuntime` command near the end of the script to run for 20 to 30 minutes.

[!NOTE]
The script connects to your Azure SQL Database or SQL Server Managed Instance to prepare the SSIS Catalog database (SSISDB). The script also configures permissions and settings for your VNet, if specified, and joins the new instance of managed-dedicated integration runtime to the VNet.

### Parameters in script
Field | Description
----- | -----------
SubscriptionName | Your Azure subscription, under which the data factory and managed-dedicated integration runtime are created.
ResourceGroupName | Your Azure resource group name, in which the data factory and managed-dedicated integration runtime are created.
DataFactoryLocation| Region for the data factory.
DataFactoryName	|Name of the data factory. 
DataFactoryLoggingStorageAccountName | Azure storage account that stores logging information from Azure Data Factory.
DataFactoryLoggingStorageAccountKey | Storage account key for the logging storage account. 
MDIRName | Name of the managed-dedicated integration runtime.
MDIRLocation | Location of the managed-dedicated integration runtime. This should be the region where you have an existing Azure SQL database(DB) /Managed Instance (MI) server to host SSISDB and or an existing VNet that is connected to your on-prem network. If your existing Azure SQL database/MI server is not in the same region as your existing VNet, first create managed-dedicated integration runtime inside a new VNet in the same region as your existing Azure SQL DB/MI server, then configure a VNet-to-VNet connection with your existing VNet.  
MDIRNodeSize | The number of nodes (node size) of compute node that hosts managed-dedicated integration runtime.
MDIRNodeNumber | The number of nodes in your managed-dedicated integration runtime cluster. 
VnetId | The VNet resource ID for your managed-dedicated integration runtime to join. For example,/subscriptions/<subscription_guid>/resourceGroups/<group_name>/providers/Microsoft.ClassicNetwork/virtualNetworks/<vnet_name>.The VNet should be created under the same Azure subscription that is used to create the data factory and managed-dedicated integration runtime and in the same region as the managed-dedicated integration runtime. A VNet is only required if you have Azure SQL MI hosting SSISDB inside VNet or you need on-premises data access; otherwise leave this field empty.
SubnetName | The subnet name for your managed-dedicated integration runtime to join.This is only required if you have Azure SQL MI hosting SSISDB inside VNet and or you need on-prem data access, otherwise leave this field empty.
SSISDBServerEndpoint | The endpoint of your existing Azure SQL DB/MI server to host SSISDB. For example, ssistestdb.database.windows.net.
SSISDBServerAdminUserName | The admin username of your existing Azure SQL DB/MI server for us to prepare SSISDB on your behalf.
SSISDBServerAdminPassword | The admin password of your existing Azure SQL DB/MI server for us to prepare SSISDB on your behalf.
SSISDBPricingTier | The pricing tier for your SSISDB hosted by Azure SQL DB server. This is only required for Azure SQL DB server hosting SSISDB, otherwise leave this field empty for Azure SQL MI hosting SSISDB.


### Script

```powershell
##### Managed-dedicated integration runtime specifications ##### 

# If your input values contain special characters, for example "$", precede the special characters with the escape character "`". For example, "`$". 

# Azure Data Factory information
$SubscriptionName = "[your Azure subscription name]"
$ResourceGroupName = "[your Azure resource group name]"
$DataFactoryName = "[your ADFv2 name]"
$DataFactoryLocation = "EastUS"
$DataFactoryLoggingStorageAccountName = "[your storage account name]"
$DataFactoryLoggingStorageAccountKey = "[your storage account key]"

# Managed-dedicated integration runtime (that runs SSIS packages in the cloud) information
$MDIRName = "[Name of your managed-dedicated integration runtime]"
$MDIRDescription = "This is my managed-dedicated integration runtime instance"
$MDIRLocation = "EastUS"
$MDIRNodeSize = "Standard_D3_v2"
$MDIRNodeNumber = 2
$VnetId = "[your VNet resource ID or leave it empty]" # OPTIONAL
$SubnetName = "[your subnet name or leave it empty]" # OPTIONAL

# SSISDB info
$SSISDBServerEndpoint = "[your Azure SQL DB/MI server name].database.windows.net"
$SSISDBServerAdminUserName = "[your server admin username]"
$SSISDBServerAdminPassword = "[your server admin password]"
$SSISDBPricingTier = "[your Azure SQL DB pricing tier, e.g. S3, or leave this value empty for Azure SQL MI]" # Not applicable for Azure SQL MI

##### End of managed-dedicated integration runtime specifications ##### 

Login-AzureRmAccount
Select-AzureRmSubscription -SubscriptionName $SubscriptionName

##### Automatically configure VNet permissions and settings for managed-dedicated integration runtime to join ##### 

# Register to Azure Batch resource provider
if(![string]::IsNullOrEmpty($VnetId) -and ![string]::IsNullOrEmpty($SubnetName)){
$BatchObjectId = (Get-AzureRmADServicePrincipal -ServicePrincipalName "MicrosoftAzureBatch").Id
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Batch
while(!(Get-AzureRmResourceProvider -ProviderNamespace "Microsoft.Batch").RegistrationState.Contains("Registered"))
{
    Start-Sleep -s 10
}
# Assign VM contributor role to Microsoft.Batch
New-AzureRmRoleAssignment -ObjectId $BatchObjectId -RoleDefinitionName "Classic Virtual Machine Contributor" -Scope $VnetId
}

##### Provision Azure Data Factory V2 + Managed-dedicated Integration Runtime ##### 

New-AzureRmResourceGroup -Location $DataFactoryLocation -Name $ResourceGroupName
New-AzureRmDataFactoryV2 -Location $DataFactoryLocation -LoggingStorageAccountName $DataFactoryLoggingStorageAccountName -LoggingStorageAccountKey $DataFactoryLoggingStorageAccountKey -Name $DataFactoryName -ResourceGroupName $ResourceGroupName 

$SSISDBConnectionString = "Data Source=" + $SSISDBServerEndpoint + ";User ID="+ $SSISDBServerAdminUserName +";Password="+ $SSISDBServerAdminPassword
if(![string]::IsNullOrEmpty($VnetId) -and ![string]::IsNullOrEmpty($SubnetName))
{
New-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName -Type ManagedReserved -CatalogConnectionString $SSISDBConnectionString -CatalogPricingTier $SSISDBPricingTier -Description $MDIRDescription -ExecutionLocation $MDIRLocation -NodeSize $MDIRNodeSize -TargetNodesNumber $MDIRNodeNumber -VnetId $VnetId -Subnet $SubnetName
}
else
{
New-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName -Type ManagedReserved -CatalogConnectionString $SSISDBConnectionString -CatalogPricingTier $SSISDBPricingTier -Description $MDIRDescription -ExecutionLocation $MDIRLocation -NodeSize $MDIRNodeSize -TargetNodesNumber $MDIRNodeNumber
}

write-host("##### Starting #####")
Start-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName -Sync -Force
write-host("##### Completed #####")
write-host("If any cmdlet is unsuccessful, please consider using -Debug option for diagnostics.")

##### Get Managed-dedicated integration runtime status #####

#Get-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName
#Get-AzureRmDataFactoryV2IntegrationRuntimeStatus -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName

##### Clean up ######

#Stop-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName -Force
#Remove-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $MDIRName -ResourceGroupName $ResourceGroupName -Force
#Remove-AzureRmDataFactoryV2 -Name $DataFactoryName -ResourceGroupName $ResourceGroupName -Force
#Remove-AzureRmResourceGroup -Name $ResourceGroupName -Force


```

## Next steps

- Deploy a package. To deploy a package, you can choose from several tools and languages. For more info, see the following articles:
	- Deploy from SSMS
	- Deploy with T-SQL from SSMS
	- Deploy with T-SQL from VS Code
	- Deploy from command prompt
	- Deploy from PowerShell
	- Deploy from C# app
- Run a package. To run a package, you can choose from several tools and languages. For more info, see the following articles:
	- Run from SSMS
	- Run with T-SQL from SSMS
	- Run with T-SQL from VS Code
	- Run from command prompt
	- Run from PowerShell
	- Run from C# app
- Schedule a package. For more info, see Schedule page
