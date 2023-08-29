---
title: Join Azure-SSIS integration runtime to a virtual network via Azure PowerShell
description: Learn how to join Azure-SSIS integration runtime to a virtual network via Azure PowerShell. 
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 07/20/2023
author: chugugrace
ms.author: chugu 
ms.custom: devx-track-azurepowershell
---

# Join Azure-SSIS integration runtime to a virtual network via Azure PowerShell

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article shows you how to join your existing Azure-SQL Server Integration Services (SSIS) integration runtime (IR) in Azure Data Factory to a virtual network via Azure PowerShell. 

> [!NOTE]
> For Azure-SSIS IR in Azure Synapse Analytics, replace with corresponding Azure Synapse Analytics PowerShell interfaces:  [Set-AzSynapseIntegrationRuntime (Az.Synapse)](/powershell/module/az.synapse/set-azsynapseintegrationruntime), [Start-AzSynapseIntegrationRuntime](/powershell/module/az.synapse/start-azsynapseintegrationruntime) and [Stop-AzSynapseIntegrationRuntime](/powershell/module/az.synapse/stop-azsynapseintegrationruntime).

## Create variables

```powershell
$ResourceGroupName = "[your Azure resource group name]"
$DataFactoryName = "[your data factory name]"
$AzureSSISName = "[your Azure-SSIS IR name]"
# Virtual network info: Azure Resource Manager or Classic
$VnetId = "[your virtual network resource ID or leave it empty]" # REQUIRED if you use Azure SQL Database server configured with a private endpoint/IP firewall rule/virtual network service endpoint or Azure SQL Managed Instance that joins a virtual network to host SSISDB, or if you require access to on-premises data without configuring a self-hosted IR. We recommend Azure Resource Manager virtual network, because classic virtual network will be deprecated soon.
$SubnetName = "[your subnet name or leave it empty]" # WARNING: Use the same subnet as the one used for Azure SQL Database server configured with a virtual network service endpoint or a different subnet from the one used for Azure SQL Managed Instance that joins a virtual network
$SubnetId = $VnetId + '/subnets/' + $SubnetName 
# Virtual network injection method: Standard or Express. For comparison, see https://learn.microsoft.com/azure/data-factory/azure-ssis-integration-runtime-virtual-network-configuration.
$VnetInjectionMethod = "Standard" # Standard by default, whereas Express lets you use the express virtual network injection method
# Public IP address info: OPTIONAL to provide two standard static public IP addresses with DNS name under the same subscription and in the same region as your virtual network
$FirstPublicIP = "[your first public IP address resource ID or leave it empty]"
$SecondPublicIP = "[your second public IP address resource ID or leave it empty]"
```

## Configure a virtual network

Before you can join your Azure-SSIS IR to a virtual network, you need to configure the virtual network. To automatically configure virtual network permissions and settings for your Azure-SSIS IR to join a virtual network, add the following script:

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

The [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime-powershell.md) article shows you how to create an Azure-SSIS IR and join it to a virtual network in the same script. If you already have an Azure-SSIS IR, follow these steps to join it to a virtual network: 
1. Stop your Azure-SSIS IR. 
1. Configure your Azure-SSIS IR to join a virtual network. 
1. Start your Azure-SSIS IR. 

## Stop your Azure-SSIS IR

You have to stop your Azure-SSIS IR before you can join it to a virtual network. This command releases all of its nodes and stops billing:

```powershell
Stop-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
    -DataFactoryName $DataFactoryName `
    -Name $AzureSSISName `
    -Force 
```

## Configure your Azure-SSIS IR to join a virtual network

To join your Azure-SSIS IR to a virtual network, run the `Set-AzDataFactoryV2IntegrationRuntime` command: 

```powershell
Set-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
    -DataFactoryName $DataFactoryName `
    -Name $AzureSSISName `
    -SubnetId $SubnetId `
    -VNetInjectionMethod $VnetInjectionMethod

# Add public IP address parameters if you use the standard virtual network injection method and bring your own static public IP addresses
if($VnetInjectionMethod -eq "Standard")
{
    if(![string]::IsNullOrEmpty($FirstPublicIP) -and ![string]::IsNullOrEmpty($SecondPublicIP))
    {
        $publicIPs = @($FirstPublicIP, $SecondPublicIP)
        Set-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
            -DataFactoryName $DataFactoryName `
            -Name $AzureSSISName `
            -PublicIPs $publicIPs
    }
}
```

## Start your Azure-SSIS IR

To start your Azure-SSIS IR, run the following command: 

```powershell
Start-AzDataFactoryV2IntegrationRuntime -ResourceGroupName $ResourceGroupName `
    -DataFactoryName $DataFactoryName `
    -Name $AzureSSISName `
    -Force
```

If you use the express/standard virtual network injection method, this command takes 5/20-30 minutes to finish, respectively.

## Next steps

- [Configure a virtual network to inject Azure-SSIS IR](azure-ssis-integration-runtime-virtual-network-configuration.md)
- [Express virtual network injection method](azure-ssis-integration-runtime-express-virtual-network-injection.md)
- [Standard virtual network injection method](azure-ssis-integration-runtime-standard-virtual-network-injection.md)
- [Join Azure-SSIS IR to a virtual network via ADF UI](join-azure-ssis-integration-runtime-virtual-network-ui.md)

For more information about Azure-SSIS IR, see the following articles: 

- [Azure-SSIS IR](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides general conceptual information about IRs, including Azure-SSIS IR. 
- [Tutorial: Deploy SSIS packages to Azure](tutorial-deploy-ssis-packages-azure.md). This tutorial provides step-by-step instructions to create your Azure-SSIS IR. It uses Azure SQL Database server to host SSISDB. 
- [Create an Azure-SSIS IR](create-azure-ssis-integration-runtime.md). This article expands on the tutorial. It provides instructions on using Azure SQL Database server configured with a virtual network service endpoint/IP firewall rule/private endpoint or Azure SQL Managed Instance that joins a virtual network to host SSISDB. It shows you how to join your Azure-SSIS IR to a virtual network. 
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve and understand information about your Azure-SSIS IR.
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding more nodes.
