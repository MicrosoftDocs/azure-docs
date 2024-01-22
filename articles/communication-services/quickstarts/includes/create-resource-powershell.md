---
ms.custom: devx-track-azurepowershell
---
## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- Install the [Azure Az PowerShell Module](/powershell/azure/)

Note that if you're planning on using phone numbers, you can't use the free trial account. Check that your subscription meets all the [requirements](../../concepts/telephony/plan-solution.md) if you plan to purchase phone numbers before creating your resource. 

## Create Azure Communication Services resource

To create an Azure Communication Services resource, [sign in to Azure CLI](/cli/azure/authenticate-azure-cli). You can do this through the terminal using the ```Connect-AzAccount``` command and providing your credentials.

First, make sure to install the Azure Communication Services module ```Az.Communication``` using the following command.

```PowerShell
PS C:\> Install-Module Az.Communication
```

Run the following command to create the resource:

```PowerShell
PS C:\> New-AzCommunicationService -ResourceGroupName ContosoResourceProvider1 -Name ContosoAcsResource1 -DataLocation UnitedStates -Location Global
```

If you would like to select a specific subscription you can also specify the ```--subscription``` flag and provide the subscription ID.
```PowerShell
PS C:\> New-AzCommunicationService -ResourceGroupName ContosoResourceProvider1 -Name ContosoAcsResource1 -DataLocation UnitedStates -Location Global -SubscriptionId SubscriptionID
```

You can configure your Communication Services resource with the following options:

* The [resource group](../../../azure-resource-manager/management/manage-resource-groups-powershell.md)
* The name of the Communication Services resource
* The geography the resource will be associated with

In the next step, you can assign tags to the resource. Tags can be used to organize your Azure resources. See the [resource tagging documentation](../../../azure-resource-manager/management/tag-resources.md) for more information about tags.

## Manage your Communication Services resource

To add tags to your Communication Services resource, run the following commands. You can target a specific subscription as well.

```PowerShell
PS C:\> Update-AzCommunicationService -Name ContosoAcsResource1 -ResourceGroupName ContosoResourceProvider1 -Tag @{ExampleKey1="ExampleValue1"}

PS C:\> Update-AzCommunicationService -Name ContosoAcsResource1 -ResourceGroupName ContosoResourceProvider1 -Tag @{ExampleKey1="ExampleValue1"} -SubscriptionId SubscriptionID
```

To list all of your Azure Communication Services Resources in a given subscription use the following command:

```PowerShell
PS C:\> Get-AzCommunicationService -SubscriptionId SubscriptionID
```

To list all the information on a given resource use the following command:

```PowerShell
PS C:\> Get-AzCommunicationService -Name ContosoAcsResource1 -ResourceGroupName ContosoResourceProvider1
```
