## Set up Azure PowerShell for Azure DNS

### Before you begin

Verify that you have the following items before beginning your configuration.

* An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
* You need to install the latest version of the Azure Resource Manager PowerShell cmdlets. For more information, see [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs).

### Sign in to your Azure account

Open your PowerShell console and connect to your account. For more information, see [Using PowerShell with Resource Manager](../articles/azure-resource-manager/powershell-azure-resource-manager.md).

```powershell
Login-AzureRmAccount
```

### Select the subscription
 
Check the subscriptions for the account.

```powershell
Get-AzureRmSubscription
```

Choose which of your Azure subscriptions to use.

```powershell
Select-AzureRmSubscription -SubscriptionName "your_subscription_name"
```

### Create a resource group

Azure Resource Manager requires that all resource groups specify a location. This location is used as the default location for resources in that resource group. However, because all DNS resources are global, not regional, the choice of resource group location has no impact on Azure DNS.

You can skip this step if you are using an existing resource group.

```powershell
New-AzureRmResourceGroup -Name MyAzureResourceGroup -location "West US"
```

### Register resource provider

The Azure DNS service is managed by the Microsoft.Network resource provider. Your Azure subscription must be registered to use this resource provider before you can use Azure DNS. This is a one-time operation for each subscription.

```powershell
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network
```