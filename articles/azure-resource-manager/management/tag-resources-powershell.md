---
title: Tag resources, resource groups, and subscriptions with Azure PowerShell
description: Shows how to use Azure PowerShell to apply tags to Azure resources.
ms.topic: conceptual
ms.custom: devx-track-azurepowershell
ms.date: 04/19/2023
---

# Apply tags with Azure PowerShell

This article describes how to use Azure PowerShell to tag resources, resource groups, and subscriptions. For tag recommendations and limitations, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).

## Apply tags

Azure PowerShell offers two commands to apply tags: [New-AzTag](/powershell/module/az.resources/new-aztag) and [Update-AzTag](/powershell/module/az.resources/update-aztag). You need to have the `Az.Resources` module 1.12.0 version or later. You can check your version with `Get-InstalledModule -Name Az.Resources`. You can install that module or [install Azure PowerShell](/powershell/azure/install-azure-powershell) version 3.6.1 or later.

The `New-AzTag` replaces all tags on the resource, resource group, or subscription. When you call the command, pass the resource ID of the entity you want to tag.

The following example applies a set of tags to a storage account:

```azurepowershell-interactive
$tags = @{"Dept"="Finance"; "Status"="Normal"}
$resource = Get-AzResource -Name demostorage -ResourceGroup demoGroup
New-AzTag -ResourceId $resource.id -Tag $tags
```

When the command completes, notice that the resource has two tags.

```output
Properties :
        Name    Value
        ======  =======
        Dept    Finance
        Status  Normal
```

If you run the command again, but this time with different tags, notice that the earlier tags disappear.

```azurepowershell-interactive
$tags = @{"Team"="Compliance"; "Environment"="Production"}
$resource = Get-AzResource -Name demostorage -ResourceGroup demoGroup
New-AzTag -ResourceId $resource.id -Tag $tags
```

```output
Properties :
        Name         Value
        ===========  ==========
        Environment  Production
        Team         Compliance
```

To add tags to a resource that already has tags, use `Update-AzTag`. Set the `-Operation` parameter to `Merge`.

```azurepowershell-interactive
$tags = @{"Dept"="Finance"; "Status"="Normal"}
$resource = Get-AzResource -Name demostorage -ResourceGroup demoGroup
Update-AzTag -ResourceId $resource.id -Tag $tags -Operation Merge
```

Notice that the existing tags grow with the addition of the two new tags.

```output
Properties :
        Name         Value
        ===========  ==========
        Status       Normal
        Dept         Finance
        Team         Compliance
        Environment  Production
```

Each tag name can have only one value. If you provide a new value for a tag, it replaces the old value even if you use the merge operation. The following example changes the `Status` tag from _Normal_ to _Green_.

```azurepowershell-interactive
$tags = @{"Status"="Green"}
$resource = Get-AzResource -Name demostorage -ResourceGroup demoGroup
Update-AzTag -ResourceId $resource.id -Tag $tags -Operation Merge
```

```output
Properties :
        Name         Value
        ===========  ==========
        Status       Green
        Dept         Finance
        Team         Compliance
        Environment  Production
```

When you set the `-Operation` parameter to `Replace`, the new set of tags replaces the existing tags.

```azurepowershell-interactive
$tags = @{"Project"="ECommerce"; "CostCenter"="00123"; "Team"="Web"}
$resource = Get-AzResource -Name demostorage -ResourceGroup demoGroup
Update-AzTag -ResourceId $resource.id -Tag $tags -Operation Replace
```

Only the new tags remain on the resource.

```output
Properties :
        Name        Value
        ==========  =========
        CostCenter  00123
        Team        Web
        Project     ECommerce
```

The same commands also work with resource groups or subscriptions. Pass them in the identifier of the resource group or subscription you want to tag.

To add a new set of tags to a resource group, use:

```azurepowershell-interactive
$tags = @{"Dept"="Finance"; "Status"="Normal"}
$resourceGroup = Get-AzResourceGroup -Name demoGroup
New-AzTag -ResourceId $resourceGroup.ResourceId -tag $tags
```

To update the tags for a resource group, use:

```azurepowershell-interactive
$tags = @{"CostCenter"="00123"; "Environment"="Production"}
$resourceGroup = Get-AzResourceGroup -Name demoGroup
Update-AzTag -ResourceId $resourceGroup.ResourceId -Tag $tags -Operation Merge
```

To add a new set of tags to a subscription, use:

```azurepowershell-interactive
$tags = @{"CostCenter"="00123"; "Environment"="Dev"}
$subscription = (Get-AzSubscription -SubscriptionName "Example Subscription").Id
New-AzTag -ResourceId "/subscriptions/$subscription" -Tag $tags
```

To update the tags for a subscription, use:

```azurepowershell-interactive
$tags = @{"Team"="Web Apps"}
$subscription = (Get-AzSubscription -SubscriptionName "Example Subscription").Id
Update-AzTag -ResourceId "/subscriptions/$subscription" -Tag $tags -Operation Merge
```

You may have more than one resource with the same name in a resource group. In that case, you can set each resource with the following commands:

```azurepowershell-interactive
$resource = Get-AzResource -ResourceName sqlDatabase1 -ResourceGroupName examplegroup
$resource | ForEach-Object { Update-AzTag -Tag @{ "Dept"="IT"; "Environment"="Test" } -ResourceId $_.ResourceId -Operation Merge }
```

## List tags

To get the tags for a resource, resource group, or subscription, use the [Get-AzTag](/powershell/module/az.resources/get-aztag) command and pass the resource ID of the entity.

To see the tags for a resource, use:

```azurepowershell-interactive
$resource = Get-AzResource -Name demostorage -ResourceGroup demoGroup
Get-AzTag -ResourceId $resource.id
```

To see the tags for a resource group, use:

```azurepowershell-interactive
$resourceGroup = Get-AzResourceGroup -Name demoGroup
Get-AzTag -ResourceId $resourceGroup.ResourceId
```

To see the tags for a subscription, use:

```azurepowershell-interactive
$subscription = (Get-AzSubscription -SubscriptionName "Example Subscription").Id
Get-AzTag -ResourceId "/subscriptions/$subscription"
```

## List by tag

To get resources that have a specific tag name and value, use:

```azurepowershell-interactive
(Get-AzResource -Tag @{ "CostCenter"="00123"}).Name
```

To get resources that have a specific tag name with any tag value, use:

```azurepowershell-interactive
(Get-AzResource -TagName "Dept").Name
```

To get resource groups that have a specific tag name and value, use:

```azurepowershell-interactive
(Get-AzResourceGroup -Tag @{ "CostCenter"="00123" }).ResourceGroupName
```

## Remove tags

To remove specific tags, use `Update-AzTag` and set `-Operation` to `Delete`. Pass the resource IDs of the tags you want to delete.

```azurepowershell-interactive
$removeTags = @{"Project"="ECommerce"; "Team"="Web"}
$resource = Get-AzResource -Name demostorage -ResourceGroup demoGroup
Update-AzTag -ResourceId $resource.id -Tag $removeTags -Operation Delete
```

The specified tags are removed.

```output
Properties :
        Name        Value
        ==========  =====
        CostCenter  00123
```

To remove all tags, use the [Remove-AzTag](/powershell/module/az.resources/remove-aztag) command.

```azurepowershell-interactive
$subscription = (Get-AzSubscription -SubscriptionName "Example Subscription").Id
Remove-AzTag -ResourceId "/subscriptions/$subscription"
```

## Next steps

* Not all resource types support tags. To determine if you can apply a tag to a resource type, see [Tag support for Azure resources](tag-support.md).
* For recommendations on how to implement a tagging strategy, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json).
* For tag recommendations and limitations, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).
