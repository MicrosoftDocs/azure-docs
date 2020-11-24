---
 title: include file for PowerShell for Azure DNS
 description: include file for PowerShell for Azure DNS
 services: dns
 author: subsarma
 ms.service: dns
 ms.topic: include file for PowerShell for Azure DNS
 ms.date: 03/21/2018
 ms.author: subsarma
 ms.custom: include file for PowerShell for Azure DNS
---

## Set up Azure PowerShell for Azure DNS

### Before you begin

[!INCLUDE [requires-azurerm](requires-azurerm.md)]

Verify that you have the following items before beginning your configuration.

* An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial/).
* You need to install the latest version of the Azure Resource Manager PowerShell cmdlets. For more information, see [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs).

In addition, to use Private Zones (Public Preview), you need to ensure you have the below PowerShell modules and versions. 
* AzureRM.Dns - [version 4.1.0](https://www.powershellgallery.com/packages/AzureRM.Dns/4.1.0) or above
* AzureRM.Network - [version 5.4.0](https://www.powershellgallery.com/packages/AzureRM.Network/5.4.0) or above

```powershell 
Find-Module -Name AzureRM.Dns 
``` 
 
```powershell 
Find-Module -Name AzureRM.Network 
``` 
 
The output of the above commands needs to show that the version of AzureRM.Dns is 4.1.0 or higher version, and for AzureRM.Network is 5.4.0 or higher version.  

In case your system has earlier versions, you can either install the latest version of Azure PowerShell, or download and install the above modules from the PowerShell Gallery, using the links above next to the Module versions. You can then install them using the below commands. Both the modules are required and are fully backwards compatible. 

```powershell
Install-Module -Name AzureRM.Dns -Force
```

```powershell
Install-Module -Name AzureRM.Network -Force
```

### Sign in to your Azure account

Open your PowerShell console and connect to your account. For more information, see [Sign in with AzureRM](/powershell/azure/azurerm/authenticate-azureps).

```powershell
Connect-AzureRmAccount
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
