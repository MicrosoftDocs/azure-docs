---
author: v-vprasannak
ms.service: azure-communication-services
ms.custom: devx-track-azurepowershell
ms.topic: include
ms.date: 04/29/2024
ms.author: v-vprasannak
---
## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- Install [Azure Az PowerShell](/powershell/azure/).

## Create Email Communication Service resource

To create an Email Communication Service resource, sign into your Azure account using the ```Connect-AzAccount``` using the following command and provide your credentials.

```PowerShell
PS C:\> Connect-AzAccount
```

First, install the Azure Communication Services module ```Az.Communication``` using the following command.

```PowerShell
PS C:\> Install-Module Az.Communication
```

To create a resource, run the following command:

```PowerShell
PS C:\> New-AzEmailService -ResourceGroupName ContosoResourceProvider1 -Name ContosoEmailServiceResource1 -DataLocation UnitedStates
```

If you want to select a specific subscription, you can also specify the ```--subscription``` flag and provide the subscription ID.

```PowerShell
PS C:\> New-AzEmailService -ResourceGroupName ContosoResourceProvider1 -Name ContosoEmailServiceResource1 -DataLocation UnitedStates -SubscriptionId SubscriptionID
```

You can configure your Communication Services resource with the following options:

* The [resource group](../../../../azure-resource-manager/management/manage-resource-groups-powershell.md).
* The name of the Email Communication Services resource.
* The geography to be associated with the resource.

In the next step, you can assign tags to the resource. Use tags to organize your Azure Email resources. For more information about tags, see the [resource tagging](../../../../azure-resource-manager/management/tag-resources.md).

## Manage your Email Communication Services resource

To add tags to your Email Communication Services resource, run the following commands. You can also target a specific subscription.

```PowerShell
PS C:\> Update-AzEmailService -Name ContosoEmailServiceResource1 -ResourceGroupName ContosoResourceProvider1 -Tag @{ExampleKey1="ExampleValue1"}

PS C:\> Update-AzEmailService -Name ContosoEmailServiceResource1 -ResourceGroupName ContosoResourceProvider1 -Tag @{ExampleKey1="ExampleValue1"} -SubscriptionId SubscriptionID
```

To list all of your Email Communication Service resources in a given subscription, use the following command:

```PowerShell
PS C:\> Get-AzEmailService -SubscriptionId SubscriptionID
```

To list all the information on a given resource, use the following command:

```PowerShell
PS C:\> Get-AzEmailService -Name ContosoEmailServiceResource1 -ResourceGroupName ContosoResourceProvider1
```

## Clean up resource

If you want to clean up and remove an Email Communication Services resource, You can delete your Email communication resource by running the following command:

```PowerShell
PS C:\> Remove-AzEmailService -Name ContosoEmailServiceResource1 -ResourceGroupName ContosoResourceProvider1
```

> [!NOTE]
> Resource deletion is **permanent** and no data, including Event Grid filters, phone numbers, or other data tied to your resource, can be recovered if you delete the resource.
