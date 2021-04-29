---
title: Create an Azure Blockchain Service member - Azure PowerShell
description: Create an Azure Blockchain Service member for a blockchain consortium using Azure PowerShell.
ms.reviewer: ravastra
ms.date: 9/22/2020
ms.topic: quickstart
ms.custom:
  - references_regions
  - devx-track-azurepowershell
  - mode-api
#Customer intent: As a network operator, I want use Azure Blockchain Service so that I can create a blockchain member on Azure
---

# Quickstart: Create an Azure Blockchain Service blockchain member using Azure PowerShell

In this quickstart, you deploy a new blockchain member and consortium in Azure Blockchain Service using Azure PowerShell.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

If you choose to use PowerShell locally, this article requires that you install the Az PowerShell
module and connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount)
cmdlet. For more information about installing the Az PowerShell module, see
[Install Azure PowerShell](/powershell/azure/install-az-ps).

> [!IMPORTANT]
> While the **Az.Blockchain** PowerShell module is in preview, you must install it separately from from
> the Az PowerShell module using the `Install-Module` cmdlet. Once this PowerShell module becomes
> generally available, it becomes part of future Az PowerShell module releases and available
> natively from within Azure Cloud Shell.

```azurepowershell-interactive
Install-Module -Name Az.Blockchain
```

[!INCLUDE [cloud-shell-try-it](../../../includes/cloud-shell-try-it.md)]

## Register resource provider

If this is your first time using the Azure Blockchain service, you must register the
**Microsoft.Blockchain** resource provider.

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Blockchain
```

## Choose a specific Azure subscription

If you have multiple Azure subscriptions, choose the appropriate subscription in which the resources
should be billed. Select a specific subscription using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

```azurepowershell-interactive
Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
```

## Define variables

You'll be using several pieces of information repeatedly. Create variables to store the information.

```azurepowershell-interactive
# Name of resource group used throughout this article
$resourceGroupName = 'myResourceGroup'

# Azure region
$location = 'eastus'
```

## Create a resource group

Create an [Azure resource group](../../azure-resource-manager/management/overview.md)
using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup)
cmdlet. A resource group is a logical container in which Azure resources are deployed and managed as
a group.

The following example creates a resource group based on the name in the `$resourceGroupName`
variable in the region specified in the `$location` variable.

```azurepowershell-interactive
New-AzResourceGroup -Name $resourceGroupName -Location $location
```

## Create a blockchain member

An Azure Blockchain Service member is a blockchain node in a private consortium blockchain network.
When provisioning a member, you can create or join a consortium network. You need at least one
member for a consortium network. The number of blockchain members needed by participants depends on
your scenario. Consortium participants may have one or more blockchain members or they may share
members with other participants. For more information on consortia, see
[Azure Blockchain Service consortium](consortium.md).

There are several parameters and properties you need to pass. Replace the example parameters with
your values.

```azurepowershell-interactive
$passwd = Read-Host -Prompt 'Enter the members default transaction node password' -AsSecureString
$csPasswd = Read-Host -Prompt 'Enter  the consortium account password' -AsSecureString

$memberParams = @{
  Name = 'myblockchainmember'
  ResourceGroupName = $resourceGroupName
  Consortium = 'myconsortium'
  ConsortiumManagementAccountPassword = $csPasswd
  Location = $location
  Password = $passwd
  Protocol = 'Quorum'
  Sku = 'S0'
}
New-AzBlockchainMember @memberParams
```

| Parameter | Description |
|---------|-------------|
| **ResourceGroupName** | Resource group name where Azure Blockchain Service resources are created. Use the resource group you created in the previous section.
| **Name** | A unique name that identifies your Azure Blockchain Service blockchain member. The name is used for the public endpoint address. For example, `myblockchainmember.blockchain.azure.com`.
| **Location** | Azure region where the blockchain member is created. For example, `westus2`. Choose the location that is closest to your users or your other Azure applications. Features may not be available in some regions. Azure Blockchain Data Manager is available in the following Azure regions: East US and West Europe.
| **Password** | The password for the member's default transaction node. Use the password for basic authentication when connecting to blockchain member's default transaction node public endpoint.
| **Protocol** | Blockchain protocol. Currently, _Quorum_ protocol is supported.
| **Consortium** | Name of the consortium to join or create. For more information on consortia, see [Azure Blockchain Service consortium](consortium.md).
| **ConsortiumManagementAccountPassword** | The consortium account password is also known as the member account password. The member account password is used to encrypt the private key for the Ethereum account that is created for your member. You use the member account and member account password for consortium management.
| **Sku** | Tier type. **S0** for standard or **B0** for basic. Use the _Basic_ tier for development, testing, and proof of concepts. Use the _Standard_ tier for production grade deployments. You should also use the _Standard_ tier if you are using Blockchain Data Manager or sending a high volume of private transactions. Changing the pricing tier between basic and standard after member creation is not supported.

It takes about 10 minutes to create the blockchain member and supporting resources.

## Clean up resources

You can use the blockchain member you created for the next quickstart or tutorial. When no longer
needed, you can delete the resources by deleting the `myResourceGroup` resource group you created
for the quickstart.

> [!CAUTION]
> The following example deletes the specified resource group and all resources contained within it.
> If resources outside the scope of this article exist in the specified resource group, they will
> also be deleted.

```azurepowershell-interactive
Remove-AzResourceGroup -Name $resourceGroupName
```

## Next steps

In this quickstart, you deployed an Azure Blockchain Service member and a new consortium. Try the
next quickstart to use Azure Blockchain Development Kit for Ethereum to attach to an Azure
Blockchain Service member.

> [!div class="nextstepaction"]
> [Use Visual Studio Code to connect to Azure Blockchain Service](connect-vscode.md)
