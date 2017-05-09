---
title: Manage Azure solutions with PowerShell | Microsoft Docs
description: Use Azure PowerShell and Resource Manager to manage your resources.
services: azure-resource-manager
documentationcenter: ''
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: b33b7303-3330-4af8-8329-c80ac7e9bc7f
ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: powershell
ms.devlang: na
ms.topic: article
ms.date: 04/19/2017
ms.author: tomfitz

---
# Manage resources with Azure PowerShell and Resource Manager
> [!div class="op_single_selector"]
> * [Portal](resource-group-portal.md)
> * [Azure CLI](xplat-cli-azure-resource-manager.md)
> * [Azure PowerShell](powershell-azure-resource-manager.md)
> * [REST API](resource-manager-rest-api.md)
>
>

In this article, you learn how to manage your solutions with Azure PowerShell and Azure Resource Manager. If you are not familiar with Resource Manager, see [Resource Manager Overview](resource-group-overview.md). This topic focuses on management tasks. You will:

1. Create a resource group
2. Add a resource to the resource group
3. Add a tag to the resource
4. Query resources based on names or tag values
5. Apply and remove a lock on the resource
6. Delete a resource group

This article does not show how to deploy a Resource Manager template to your subscription. For that information, see [Deploy resources with Resource Manager templates and Azure PowerShell](resource-group-template-deploy.md).

## Get started with Azure PowerShell

If you have not installed Azure PowerShell, see [How to install and configure Azure PowerShell](/powershell/azure/overview).

If you have installed Azure PowerShell in the past but have not updated it recently, consider installing the latest version. You can update the version through the same method you used to install it. For example, if you used the Web Platform Installer, launch it again and look for an update.

To check your version of the Azure Resources module, use the following cmdlet:

```powershell
Get-Module -ListAvailable -Name AzureRm.Resources | Select Version
```

This topic was updated for version 3.3.0. If you have an earlier version, your experience might not match the steps shown in this topic. For documentation about the cmdlets in this version, see [AzureRM.Resources Module](/powershell/module/azurerm.resources).

## Log in to your Azure account
Before working on your solution, you must log in to your account.

To log in to your Azure account, use the **Login-AzureRmAccount** cmdlet.

```powershell
Login-AzureRmAccount
```

The cmdlet prompts you for the login credentials for your Azure account. After logging in, it downloads your account settings so they are available to Azure PowerShell.

The cmdlet returns information about your account and the subscription to use for the tasks.

```powershell
Environment           : AzureCloud
Account               : example@contoso.com
TenantId              : {guid}
SubscriptionId        : {guid}
SubscriptionName      : Example Subscription One
CurrentStorageAccount :

```

If you have more than one subscription, you can switch to a different subscription. First, let's see all the subscriptions for your account.

```powershell
Get-AzureRmSubscription
```

It returns enabled and disabled subscriptions.

```powershell
SubscriptionName : Example Subscription One
SubscriptionId   : {guid}
TenantId         : {guid}
State            : Enabled

SubscriptionName : Example Subscription Two
SubscriptionId   : {guid}
TenantId         : {guid}
State            : Enabled

SubscriptionName : Example Subscription Three
SubscriptionId   : {guid}
TenantId         : {guid}
State            : Disabled
```

To switch to a different subscription, provide the subscription name with the **Set-AzureRmContext** cmdlet.

```powershell
Set-AzureRmContext -SubscriptionName "Example Subscription Two"
```

## Create a resource group
Before deploying any resources to your subscription, you must create a resource group that will contain the resources.

To create a resource group, use the **New-AzureRmResourceGroup** cmdlet. The command uses the **Name** parameter to specify a name for the resource group and the **Location** parameter to specify its location.

```powershell
New-AzureRmResourceGroup -Name TestRG1 -Location "South Central US"
```

The output is in the following format:

```powershell
ResourceGroupName : TestRG1
Location          : southcentralus
ProvisioningState : Succeeded
Tags              :
ResourceId        : /subscriptions/{guid}/resourceGroups/TestRG1
```

If you need to retrieve the resource group later, use the following cmdlet:

```powershell
Get-AzureRmResourceGroup -ResourceGroupName TestRG1
```

To get all the resource groups in your subscription, do not specify a name:

```powershell
Get-AzureRmResourceGroup
```

## Add resources to a resource group
To add a resource to the resource group, you can use the **New-AzureRmResource** cmdlet or a cmdlet that is specific to the type of resource you are creating (like **New-AzureRmStorageAccount**). You might find it easier to use a cmdlet that is specific to a resource type because it includes parameters for the properties that are needed for the new resource. To use **New-AzureRmResource**, you must know all the properties to set without being prompted for them.

However, adding a resource through cmdlets might cause future confusion because the new resource does not exist in a Resource Manager template. Microsoft recommends defining the infrastructure for your Azure solution in a Resource Manager template. Templates enable you to reliably and repeatedly deploy your solution. For this topic, you create a storage account with a PowerShell cmdlet, but later you generate a template from your resource group.

The following cmdlet creates a storage account. Instead of using the name shown in the example, provide a unique name for the storage account. The name must be between 3 and 24 characters in length, and use only numbers and lower-case letters. If you use the name shown in the example, you receive an error because that name is already in use.

```powershell
New-AzureRmStorageAccount -ResourceGroupName TestRG1 -AccountName mystoragename -Type "Standard_LRS" -Location "South Central US"
```

If you need to retrieve this resource later, use the following cmdlet:

```powershell
Get-AzureRmResource -ResourceName mystoragename -ResourceGroupName TestRG1
```

## Add a tag

Tags enable you to organize your resources according to different properties. For example, you may have several resources in different resource groups that belong to the same department. You can apply a department tag and value to those resources to mark them as belonging to the same category. Or, you can mark whether a resource is used in a production or test environment. In this topic, you apply tags to only one resource, but in your environment it most likely makes sense to apply tags to all your resources.

The following cmdlet applies two tags to your storage account:

```powershell
Set-AzureRmResource -Tag @{ Dept="IT"; Environment="Test" } -ResourceName mystoragename -ResourceGroupName TestRG1 -ResourceType Microsoft.Storage/storageAccounts
 ```

Tags are updated as a single object. To add a tag to a resource that already includes tags, first retrieve the existing tags. Add the new tag to the object that contains the existing tags, and reapply all the tags to the resource.

```powershell
$tags = (Get-AzureRmResource -ResourceName mystoragename -ResourceGroupName TestRG1).Tags
$tags += @{Status="Approved"}
Set-AzureRmResource -Tag $tags -ResourceName mystoragename -ResourceGroupName TestRG1 -ResourceType Microsoft.Storage/storageAccounts
```

## Search for resources

Use the **Find-AzureRmResource** cmdlet to retrieve resources for different search conditions.

* To get a resource by name, provide the **ResourceNameContains** parameter:

  ```powershell
  Find-AzureRmResource -ResourceNameContains mystoragename
  ```

* To get all the resources in a resource group, provide the **ResourceGroupNameContains** parameter:

  ```powershell
  Find-AzureRmResource -ResourceGroupNameContains TestRG1
  ```

* To get all the resources with a tag name and value, provide the **TagName** and **TagValue** parameters:

  ```powershell
  Find-AzureRmResource -TagName Dept -TagValue IT
  ```

* To all the resources with a particular resource type, provide the **ResourceType** parameter:

  ```powershell
  Find-AzureRmResource -ResourceType Microsoft.Storage/storageAccounts
  ```

## Lock a resource

When you need to make sure a critical resource is not accidentally deleted or modified, apply a lock to the resource. You can specify either a **CanNotDelete** or **ReadOnly**.

To create or delete management locks, you must have access to `Microsoft.Authorization/*` or `Microsoft.Authorization/locks/*` actions. Of the built-in roles, only Owner and User Access Administrator are granted those actions.

To apply a lock, use the following cmdlet:

```powershell
New-AzureRmResourceLock -LockLevel CanNotDelete -LockName LockStorage -ResourceName mystoragename -ResourceType Microsoft.Storage/storageAccounts -ResourceGroupName TestRG1
```

The locked resource in the preceding example cannot be deleted until the lock is removed. To remove a lock, use:

```powershell
Remove-AzureRmResourceLock -LockName LockStorage -ResourceName mystoragename -ResourceType Microsoft.Storage/storageAccounts -ResourceGroupName TestRG1
```

For more information about setting locks, see [Lock resources with Azure Resource Manager](resource-group-lock-resources.md).

## Remove resources or resource group
You can remove a resource or resource group. When you remove a resource group, you also remove all the resources within that resource group.

* To delete a resource from the resource group, use the **Remove-AzureRmResource** cmdlet. This cmdlet deletes the resource, but does not delete the resource group.

  ```powershell
  Remove-AzureRmResource -ResourceName mystoragename -ResourceType Microsoft.Storage/storageAccounts -ResourceGroupName TestRG1
  ```

* To delete a resource group and all its resources, use the **Remove-AzureRmResourceGroup** cmdlet.

  ```powershell
  Remove-AzureRmResourceGroup -Name TestRG1
  ```

For both cmdlets, you are asked to confirm that you wish to remove the resource or resource group. If the operation successfully deletes the resource or resource group, it returns **True**.

## Run Resource Manager scripts with Azure Automation

This topic shows you how to perform basic operations on your resources with Azure PowerShell. For more advanced management scenarios, you typically want to create a script, and reuse that script as needed or on a schedule. [Azure Automation](../automation/automation-intro.md) provides a way for you to automate frequently used scripts that manage your Azure solutions.

The following topics show you how to use Azure Automation, Resource Manager, and PowerShell to effectively perform management tasks:

- For information about creating a runbook, see [My first PowerShell runbook](../automation/automation-first-runbook-textual-powershell.md).
- For information about working with galleries of scripts, see [Runbook and module galleries for Azure Automation](../automation/automation-runbook-gallery.md).
- For runbooks that start and stop virtual machines, see [Azure Automation scenario: Using JSON-formatted tags to create a schedule for Azure VM startup and shutdown](../automation/automation-scenario-start-stop-vm-wjson-tags.md).
- For runbooks that start and stop virtual machines off-hours, see [Start/Stop VMs during off-hours solution in Automation](../automation/automation-solution-vm-management.md).

## Next Steps
* To learn about creating Resource Manager templates, see [Authoring Azure Resource Manager Templates](resource-group-authoring-templates.md).
* To learn about deploying templates, see [Deploy an application with Azure Resource Manager Template](resource-group-template-deploy.md).
* You can move existing resources to a new resource group. For examples, see [Move Resources to New Resource Group or Subscription](resource-group-move-resources.md).
* For guidance on how enterprises can use Resource Manager to effectively manage subscriptions, see [Azure enterprise scaffold - prescriptive subscription governance](resource-manager-subscription-governance.md).

