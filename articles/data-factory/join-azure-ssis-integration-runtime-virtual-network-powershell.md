---
title: Join an Azure-SSIS integration runtime to a virtual network with Azure PowerShell
description: Learn how to join an Azure-SSIS integration runtime to an Azure virtual network using Azure PowerShell. 
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 07/16/2021
author: swinarko
ms.author: sawinark 
ms.custom: devx-track-azurepowershell
---

# Join an Azure-SSIS integration runtime to a virtual network with Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Define the variables

```powershell
$ResourceGroupName = "[your Azure resource group name]"
$DataFactoryName = "[your data factory name]"
$AzureSSISName = "[your Azure-SSIS IR name]"
# Virtual network info: Classic or Azure Resource Manager
$VnetId = "[your virtual network resource ID or leave it empty]" # REQUIRED if you use SQL Database with IP firewall rules/virtual network service endpoints or SQL Managed Instance with private endpoint to host SSISDB, or if you require access to on-premises data without configuring a self-hosted IR. We recommend an Azure Resource Manager virtual network, because classic virtual networks will be deprecated soon.
$SubnetName = "[your subnet name or leave it empty]" # WARNING: Use the same subnet as the one used for SQL Database with virtual network service endpoints, or a different subnet from the one used for SQL Managed Instance with a private endpoint
# Public IP address info: OPTIONAL to provide two standard static public IP addresses with DNS name under the same subscription and in the same region as your virtual network
$FirstPublicIP = "[your first public IP address resource ID or leave it empty]"
$SecondPublicIP = "[your second public IP address resource ID or leave it empty]"
```

## Configure a virtual network

Before you can join your Azure-SSIS IR to a virtual network, you need to configure the virtual network. To automatically configure virtual network permissions and settings for your Azure-SSIS IR to join the virtual network, add the following script:

```powershell
# Make sure to run this script against the subscription to which the virtual network belongs.
if(![string]::IsNullOrEmpty($VnetId) -and ![string]::IsNullOrEmpty($SubnetName))
{
    # Register to the Azure Batch resource provider
    $BatchApplicationId = "ddbf3205-c6bd-46ae-8127-60eb93363864"
    $BatchObjectId = (Get-AzADServicePrincipal -ServicePrincipalName $BatchApplicationId).Id
    Register-AzResourceProvider -ProviderNamespace Microsoft.Batch
    while(!(Get-AzResourceProvider -ProviderNamespace "Microsoft.Batch").RegistrationState.Contains("Registered"))
    {
    Start-Sleep -s 10
    }
    if($VnetId -match "/providers/Microsoft.ClassicNetwork/")
    {
        # Assign the VM contributor role to Microsoft.Batch
        New-AzRoleAssignment -ObjectId $BatchObjectId -RoleDefinitionName "Classic Virtual Machine Contributor" -Scope $VnetId
    }
}
```

## Create an Azure-SSIS IR and join it to a virtual network

You can create an Azure-SSIS IR and join it to a virtual network at the same time. For the complete script and instructions, see [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime-powershell.md).

## Join an existing Azure-SSIS IR to a virtual network

The [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md) article shows you how to create an Azure-SSIS IR and join it to a virtual network in the same script. If you already have an Azure-SSIS IR, follow these steps to join it to the virtual network: 
1. Stop the Azure-SSIS IR. 
1. Configure the Azure-SSIS IR to join the virtual network. 
1. Start the Azure-SSIS IR. 

## Stop the Azure-SSIS IR

You have to stop the Azure-SSIS IR before you can join it to a virtual network. This command releases all of its nodes and stops billing:

```powershell
Stop-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
    -DataFactoryName $DataFactoryName `
    -Name $AzureSSISName `
    -Force 
```

## Configure virtual network settings for the Azure-SSIS IR to join

To configure settings for the virtual network that the Azure-SSIS will join, use this script: 

```powershell
# Make sure to run this script against the subscription to which the virtual network belongs.
if(![string]::IsNullOrEmpty($VnetId) -and ![string]::IsNullOrEmpty($SubnetName))
{
    # Register to the Azure Batch resource provider
    $BatchApplicationId = "ddbf3205-c6bd-46ae-8127-60eb93363864"
    $BatchObjectId = (Get-AzADServicePrincipal -ServicePrincipalName $BatchApplicationId).Id
    Register-AzResourceProvider -ProviderNamespace Microsoft.Batch
    while(!(Get-AzResourceProvider -ProviderNamespace "Microsoft.Batch").RegistrationState.Contains("Registered"))
    {
        Start-Sleep -s 10
    }
    if($VnetId -match "/providers/Microsoft.ClassicNetwork/")
    {
        # Assign VM contributor role to Microsoft.Batch
        New-AzRoleAssignment -ObjectId $BatchObjectId -RoleDefinitionName "Classic Virtual Machine Contributor" -Scope $VnetId
    }
}
```

## Configure the Azure-SSIS IR

To join your Azure-SSIS IR to a virtual network, run the `Set-AzDataFactoryV2IntegrationRuntime` command: 

```powershell
Set-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
    -DataFactoryName $DataFactoryName `
    -Name $AzureSSISName `
    -VnetId $VnetId `
    -Subnet $SubnetName

# Add public IP address parameters if you bring your own static public IP addresses
if(![string]::IsNullOrEmpty($FirstPublicIP) -and ![string]::IsNullOrEmpty($SecondPublicIP))
{
    $publicIPs = @($FirstPublicIP, $SecondPublicIP)
    Set-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
        -DataFactoryName $DataFactoryName `
        -Name $AzureSSISName `
        -PublicIPs $publicIPs
}
```

## Start the Azure-SSIS IR

To start the Azure-SSIS IR, run the following command: 

```powershell
Start-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
    -DataFactoryName $DataFactoryName `
    -Name $AzureSSISName `
    -Force
```

This command takes 20 to 30 minutes to finish.

## Next steps
- [Join an Azure-SSIS integration runtime to a virtual network - Overview](join-azure-ssis-integration-runtime-virtual-network.md)
- [Azure-SSIS integration runtime virtual network configuration details](azure-ssis-integration-runtime-virtual-network-configuration.md)
- [Join an Azure-SSIS integration runtime to a virtual network with the Azure Data Factory Studio UI](join-azure-ssis-integration-runtime-virtual-network-ui.md)

For more information about Azure-SSIS IR, see the following articles: 
- [Azure-SSIS IR](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides general conceptual information about IRs, including Azure-SSIS IR. 
- [Tutorial: Deploy SSIS packages to Azure](./tutorial-deploy-ssis-packages-azure.md). This tutorial provides step-by-step instructions to create your Azure-SSIS IR. It uses Azure SQL Database to host the SSIS catalog. 
- [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md). This article expands on the tutorial. It provides instructions about using Azure SQL Database with virtual network service endpoints or SQL Managed Instance in a virtual network to host the SSIS catalog. It shows how to join your Azure-SSIS IR to a virtual network. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to get information about your Azure-SSIS IR. It provides status descriptions for the returned information. 
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding nodes.
