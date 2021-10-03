---
 title: include file for PowerShell for Azure DNS
 description: include file for PowerShell for Azure DNS
 services: dns
 author: subsarma
 ms.service: dns
 ms.topic: include file for PowerShell for Azure DNS
 ms.date: 04/28//2021
 ms.author: subsarma
 ms.custom: include file for PowerShell for Azure DNS, devx-track-azurepowershell
---

## Set up Azure PowerShell for Azure DNS

### Before you begin

[!INCLUDE [requires-azurerm](requires-azurerm.md)]

Verify that you have the following items before beginning your configuration.

* An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
* You need to install the latest version of the Azure Resource Manager PowerShell cmdlets. For more information, see [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs).

### Sign in to your Azure account

Open your PowerShell console and connect to your account. For more information, see [Sign in with Azure PowerShell](/powershell/azure/azurerm/authenticate-azureps).

```azurepowershell-interactive
Connect-AzAccount
```

### Select the subscription
 
Check the subscriptions for the account.

```azurepowershell-interactive
Get-AzSubscription
```

Choose which of your Azure subscriptions to use.

```azurepowershell-interactive
Select-AzSubscription -SubscriptionName "your_subscription_name"
```

### Create a resource group

Azure Resource Manager requires that all resource groups specify a location. This location is used as the default location for resources in that resource group. However, because all DNS resources are global, not regional, the choice of resource group location has no impact on Azure DNS.

You can skip this step if you are using an existing resource group.

```azurepowershell-interactive
New-AzResourceGroup -Name MyDNSResourceGroup -location "West US"
```
