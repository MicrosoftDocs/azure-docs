---
title: Create self-hosted integration runtime in Azure Data Factory | Microsoft Docs
description: Learn how you can use the SQL Server Stored Procedure Activity to invoke a stored procedure in an Azure SQL Database or Azure SQL Data Warehouse from a Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: monicar

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/10/2017
ms.author: spelluru

---

# Create an Azure-SSIS integration runtime in Azure Data Factory
This article provides steps for provisioning an Azure-SSIS integration runtime in Azure Data Factory. Then, you can use SQL Server Data Tools (SSDT) or SQL Server Management Studio (SSMS) to deploy SQL Server Integration Services (SSIS) packages to this runtime on Azure.

The tutorial: [Tutorial: deploy SQL Server Integration Services packages (SSIS) to Azure](tutorial-deploy-ssis-packages-azure.md) shows you how to create an Azure-SSIS Integration Runtime (IR) by using Azure SQL Database as the store for SSIS catalog. This article expands on the tutorial and shows you how to do the following: 

- Use Azure SQL Managed Instance (private preview) for hosting an SSIS catalog (SSISDB database).
- Join Azure-SSIS IR to an Azure virtual network (VNet). 

## Prerequisites

- **Azure subscription**. If you don't have a subscription, you can create a [free trial](http://azure.microsoft.com/pricing/free-trial/) account.
- **Azure SQL Database server** or **SQL Server Managed Instance (private preview) (Extended Private Preview)**. If you don't already have a database server, create one in the Azure portal before you get started. This server hosts the SSIS Catalog database (SSISDB). We recommend that you create the database server in the same Azure region as the integration runtime. This configuration lets the integration runtime write execution logs to SSISDB without crossing Azure regions. 
- **Classic Virtual Network(VNet) (optional)**. You must have an Azure Virtual Network (VNet) if at least one of the following conditions is true:
    - You are hosting the SSIS Catalog database on a SQL Server Managed Instance (private preview) that is part of a VNet.
    - You want to connect to on-premises data stores from SSIS packages running on an Azure-SSIS integration runtime.
- **Azure PowerShell**. Follow the instructions in [How to install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps). You use PowerShell to run a script to provision an Azure-SSIS integration runtime that runs SSIS packages in the cloud. 

## Create variables
Define variables for use in the script in this tutorial:

```powershell
# Azure Data Factory version 2 information
$SubscriptionName = "[your Azure subscription name]"
$ResourceGroupName = "[your Azure resource group name]"
$DataFactoryName = "[your data factory name]"
$DataFactoryLocation = "EastUS" # In public preview, only EastUS|EastUS2 are supported.

# Azure-SSIS integration runtime information - This is the Data Factory compute resource for running SSIS packages
$AzureSSISName = "[your Azure-SSIS integration runtime name]"
$AzureSSISDescription = "This is my Azure-SSIS integration runtime"
$AzureSSISLocation = "EastUS" # In public preview, only EastUS|NorthEurope are supported.
$AzureSSISNodeSize = "Standard_A4_v2" # In public preview, only Standard_A4_v2|Standard_A8_v2|Standard_D1_v2|Standard_D2_v2|Standard_D3_v2|Standard_D4_v2 are supported.
$AzureSSISNodeNumber = 2 # In public preview, only 1-10 nodes are supported.
$AzureSSISMaxParallelExecutionsPerNode = 2 # In public preview, only 1-8 parallel executions per node are supported.
$VnetId = "[your VNet resource ID or leave it empty]" # OPTIONAL: In public preview, only classic virtual network (VNET) is supported.
$SubnetName = "[your subnet name or leave it empty]" # OPTIONAL: In public preview, only classic VNet is supported.

# SSISDB info
$SSISDBServerEndpoint = "[your Azure SQL Database server name.database.windows.net or your Azure SQL Managed Instance (private preview) server endpoint]"
$SSISDBServerAdminUserName = "[your server admin username]"
$SSISDBServerAdminPassword = "[your server admin password]"
$SSISDBPricingTier = "[your Azure SQL Database pricing tier, e.g. S3, or leave it empty for Azure SQL Managed Instance (private preview)]" # Not applicable for Azure SQL Managed Instance (private preview)
```

## Validate the connection to database
Add the following script to validate your Azure SQL Database server server.database.windows.net or your Azure SQL Managed Instance (private preview) server endpoint. 

```powershell
$SSISDBConnectionString = "Data Source=" + $SSISDBServerEndpoint + ";User ID="+ $SSISDBServerAdminUserName +";Password="+ $SSISDBServerAdminPassword
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
```

## Log in and select subscription
Add the following code the script to log in and select your Azure subscription: 

```powershell
Login-AzureRmAccount
Select-AzureRmSubscription -SubscriptionName $SubscriptionName
```

## Configure virtual network
Add the following script to automatically configure virtual network permissions/settings for your Azure-SSIS integration runtime to join.

```powershell
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
```

## Create a resource group
Create an [Azure resource group](../azure-resource-manager/resource-group-overview.md) using the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command. A resource group is a logical container into which Azure resources are deployed and managed as a group. The following example creates a resource group named `myResourceGroup` in the `westeurope` location.

```powershell
New-AzureRmResourceGroup -Location $DataFactoryLocation -Name $ResourceGroupName
```

## Create a data factory
Run the following command to create a data factory:

```powershell
Set-AzureRmDataFactoryV2 -ResourceGroupName $ResourceGroupName `
                         -Location $DataFactoryLocation `
                         -Name $DataFactoryName
```

## Create an integration runtime
Run the following command to create an Azure-SSIS integration runtime that runs SSIS packages in Azure: 

```powershell
$secpasswd = ConvertTo-SecureString $SSISDBServerAdminPassword -AsPlainText -Force
$serverCreds = New-Object System.Management.Automation.PSCredential($SSISDBServerAdminUserName, $secpasswd)
Set-AzureRmDataFactoryV2IntegrationRuntime  -ResourceGroupName $ResourceGroupName `
                                            -DataFactoryName $DataFactoryName `
                                            -Name $AzureSSISName `
                                            -Type Managed `
                                            -CatalogServerEndpoint $SSISDBServerEndpoint `
                                            -CatalogAdminCredential $serverCreds `
                                            -CatalogPricingTier $SSISDBPricingTier `
                                            -Description $AzureSSISDescription `
                                            -Location $AzureSSISLocation `
                                            -NodeSize $AzureSSISNodeSize `
                                            -NodeCount $AzureSSISNodeNumber `
                                            -MaxParallelExecutionsPerNode $AzureSSISMaxParallelExecutionsPerNode `
                                            -VnetId $VnetId `
                                            -Subnet $SubnetName
```

## Start integration runtime
Run the following command to start the Azure-SSIS integration runtime: 

```powershell
write-host("##### Starting #####")
Start-AzureRmDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
                                             -DataFactoryName $DataFactoryName `
                                             -Name $AzureSSISName `
                                             -Force

write-host("##### Completed #####")
write-host("If any cmdlet is unsuccessful, please consider using -Debug option for diagnostics.")                                  
```
This command takes from **20 to 30 minutes** to complete. 

## Deploy SSIS packages
Now, use SQL Server Data Tools (SSDT) or SQL Server Management Studio (SSMS) to deploy your SSIS packages to Azure. Connect to your Azure SQL server that hosts the SSIS catalog (SSISDB). The name of the Azure SQL server is in the format: &lt;servername&gt;.database.windows.net (for Azure SQL Database). See [Deploy packages](/sql/integration-services/packages/deploy-integration-services-ssis-projects-and-packages#deploy-packages-to-integration-services-server) article for instructions. 

## Full script
In this release, you must use PowerShell to provision an instance of Azure-SSIS integration runtime that runs SSIS packages in the cloud. Currently, it's not possible to provision this runtime by using Azure portal. 

The PowerShell script in this section configures an instance of Azure-SSIS integration runtime in the cloud that runs SSIS packages. After you run this script successfully, you can deploy and run SSIS packages in the Microsoft Azure cloud with SSISDB hosted in Azure SQL Database or on a SQL Server Managed Instance (private preview).

1. Launch the Windows PowerShell Integrated Scripting Environment (ISE).
2. In the ISE, run the following command from the command prompt.    
    ```powershell
    Set-ExecutionPolicy Unrestricted -Scope CurrentUser
    ```
3. Copy the PowerShell script in this section and paste it into the ISE.
4. Provide appropriate values for the script parameters in the "SSIS in Azure specifications" section at the beginning of the script. These parameters are described in the next section.
5. Run the script. The `Start-AzureRmDataFactoryV2IntegrationRuntime` command near the end of the script runs for **20 to 30 minutes**.

> [!NOTE]
> The script connects to your Azure SQL Database or SQL Server Managed Instance (private preview) to prepare the SSIS Catalog database (SSISDB). The script also configures permissions and settings for your VNet, if specified, and joins the new instance of Azure-SSIS integration runtime to the VNet.


```powershell
# If your inputs contain PSH special characters, e.g. "$", please precede it with the escape character "`" like "`$". 
# Azure Data Factory v2 information
$SubscriptionName = "[your Azure subscription name]"
$ResourceGroupName = "[your Azure resource group name]"
$DataFactoryName = "[your data factory name]"
$DataFactoryLocation = "EastUS" # In Public Preview, only EastUS|EastUS2 are supported for now

# Azure-SSIS Integration Runtime info - This is Data Factory compute resource for running SSIS packages
$AzureSSISName = "[your Azure-SSIS Integration Runtime name]"
$AzureSSISDescription = "This is my Azure-SSIS Integration Runtime"
$AzureSSISLocation = "EastUS" # In Public Preview, only EastUS|NorthEurope are supported for now
$AzureSSISNodeSize = "Standard_A4_v2" # In Public Preview, only Standard_A4_v2|Standard_A8_v2|Standard_D1_v2|Standard_D2_v2|Standard_D3_v2|Standard_D4_v2 are supported for now
$AzureSSISNodeNumber = 2 # In Public Preview, only 1-10 nodes are supported for now
$AzureSSISMaxParallelExecutionsPerNode = 2 # In Public Preview, only 1-8 parallel executions per node are supported for now
$VnetId = "[your VNet resource ID or leave it empty]" # OPTIONAL: In Public Preview, only Classic VNet is supported for now
$SubnetName = "[your subnet name or leave it empty]" # OPTIONAL: In Public Preview, only Classic VNet is supported for now

# SSISDB info
$SSISDBServerEndpoint = "[your Azure SQL Database server name.database.windows.net or your Azure SQL Managed Instance (private preview) server endpoint]"
$SSISDBServerAdminUserName = "[your server admin username]"
$SSISDBServerAdminPassword = "[your server admin password]"
$SSISDBPricingTier = "[your Azure SQL Database pricing tier, e.g. S3, or leave it empty for Azure SQL Managed Instance (private preview)]" # Not applicable for Azure SQL Managed Instance (private preview)

##### Validate your Azure SQL Database/Managed Instance (private preview) server ##### 
$SSISDBConnectionString = "Data Source=" + $SSISDBServerEndpoint + ";User ID="+ $SSISDBServerAdminUserName +";Password="+ $SSISDBServerAdminPassword
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

##### Login and and select your Azure subscription #####
Login-AzureRmAccount
Select-AzureRmSubscription -SubscriptionName $SubscriptionName

##### Automatically configure VNet permissions/settings for your Azure-SSIS Integration Runtime to join ##### 
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

##### Provision your Azure Data Factory  + Azure-SSIS Integration Runtime ##### 
New-AzureRmResourceGroup -Location $DataFactoryLocation -Name $ResourceGroupName
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.DataFactory

$secpasswd = ConvertTo-SecureString $SSISDBServerAdminPassword -AsPlainText -Force
$serverCreds = New-Object System.Management.Automation.PSCredential($SSISDBServerAdminUserName, $secpasswd)

Set-AzureRmDataFactoryV2 -ResourceGroupName $ResourceGroupName `
                         -Location $DataFactoryLocation `
                         -Name $DataFactoryName
Set-AzureRmDataFactoryV2IntegrationRuntime  -ResourceGroupName $ResourceGroupName `
                                            -DataFactoryName $DataFactoryName `
                                            -Name $AzureSSISName `
                                            -Type Managed `
                                            -CatalogServerEndpoint $SSISDBServerEndpoint `
                                            -CatalogAdminCredential $serverCreds `
                                            -CatalogPricingTier $SSISDBPricingTier `
                                            -Description $AzureSSISDescription `
                                            -Location $AzureSSISLocation `
                                            -NodeSize $AzureSSISNodeSize `
                                            -NodeCount $AzureSSISNodeNumber `
                                            -MaxParallelExecutionsPerNode $AzureSSISMaxParallelExecutionsPerNode `
                                            -VnetId $VnetId `
                                            -Subnet $SubnetName
write-host("##### Starting #####")
Start-AzureRmDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
                                             -DataFactoryName $DataFactoryName `
                                             -Name $AzureSSISName `
                                             -Force
write-host("##### Completed #####")
write-host("If any cmdlet is unsuccessful, please consider using -Debug option for diagnostics.")

##### Clean up ######
#Stop-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName -Force
#Remove-AzureRmDataFactoryV2IntegrationRuntime -DataFactoryName $DataFactoryName -Name $AzureSSISName -ResourceGroupName $ResourceGroupName -Force
#Remove-AzureRmDataFactoryV2 -Name $DataFactoryName -ResourceGroupName $ResourceGroupName -Force
#Remove-AzureRmResourceGroup -Name $ResourceGroupName -Force
```

## Next steps
See the other Azure-SSIS IR topics in this documentation:

- [Azure-SSIS Integration Runtime](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides conceptual information about integration runtimes in general including the Azure-SSIS IR. 
- [Tutorial: deploy SSIS packages to Azure](tutorial-deploy-ssis-packages-azure.md). This article provides step-by-step instructions to create an Azure-SSIS IR and uses an Azure SQL database to host the SSIS catalog. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve information about an Azure-SSIS IR and descriptions of statuses in the returned information. 
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or remove an Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding more nodes to the IR. 
- [Join an Azure-SSIS IR to a VNet](join-azure-ssis-integration-runtime-virtual-network.md). This article provides conceptual information about joining an Azure-SSIS IR to an Azure virtual network (VNet). It also provides steps to use Azure portal to configure VNet so that Azure-SSIS IR can join the VNet. 