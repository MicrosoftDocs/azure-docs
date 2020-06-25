---
title: Tag resources, resource groups, and subscriptions for logical organization
description: Shows how to apply tags to organize Azure resources for billing and managing.
ms.topic: conceptual
ms.date: 06/15/2020
---
# Use tags to organize your Azure resources and management hierarchy

You apply tags to your Azure resources, resource groups, and subscriptions to logically organize them into a taxonomy. Each tag consists of a name and a value pair. For example, you can apply the name "Environment" and the value "Production" to all the resources in production.

For recommendations on how to implement a tagging strategy, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json).

> [!IMPORTANT]
> Tag names are case-insensitive. Tag values are case-sensitive.

[!INCLUDE [Handle personal data](../../../includes/gdpr-intro-sentence.md)]

## Required access

To apply tags to a resource, you must have write access to the **Microsoft.Resources/tags** resource type. The [Tag Contributor](../../role-based-access-control/built-in-roles.md#tag-contributor) role lets you apply tags to an entity without having access to the entity itself. Currently, the tag contributor role can't apply tags to resources or resource groups through the portal. It can apply tags to subscriptions through the portal. It supports all tag operations through PowerShell and REST API.  

The [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role also grants the required access to apply tags to any entity. To apply tags to only one resource type, use the contributor role for that resource. For example, to apply tags to virtual machines, use the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor).

## PowerShell

### Apply tags

Azure PowerShell offers two commands for applying tags - [New-AzTag](/powershell/module/az.resources/new-aztag) and [Update-AzTag](/powershell/module/az.resources/update-aztag). You must have the Az.Resources module 1.12.0 or later. You can check your version with `Get-Module Az.Resources`. You can install that module or [install Azure PowerShell](/powershell/azure/install-az-ps) 3.6.1 or later.

The **New-AzTag** replaces all tags on the resource, resource group, or subscription. When calling the command, pass in the resource ID of the entity you wish to tag.

The following example applies a set of tags to a storage account:

```azurepowershell-interactive
$tags = @{"Dept"="Finance"; "Status"="Normal"}
$resource = Get-AzResource -Name demoStorage -ResourceGroup demoGroup
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

If you run the command again but this time with different tags, notice that the earlier tags are removed.

```azurepowershell-interactive
$tags = @{"Team"="Compliance"; "Environment"="Production"}
New-AzTag -ResourceId $resource.id -Tag $tags
```

```output
Properties :
        Name         Value
        ===========  ==========
        Environment  Production
        Team         Compliance
```

To add tags to a resource that already has tags, use **Update-AzTag**. Set the **-Operation** parameter to **Merge**.

```azurepowershell-interactive
$tags = @{"Dept"="Finance"; "Status"="Normal"}
Update-AzTag -ResourceId $resource.id -Tag $tags -Operation Merge
```

Notice that the two new tags were added to the two existing tags.

```output
Properties :
        Name         Value
        ===========  ==========
        Status       Normal
        Dept         Finance
        Team         Compliance
        Environment  Production
```

Each tag name can have only one value. If you provide a new value for a tag, the old value is replaced even if you use the merge operation. The following example changes the Status tag from Normal to Green.

```azurepowershell-interactive
$tags = @{"Status"="Green"}
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

When you set the **-Operation** parameter to **Replace**, the existing tags are replaced by the new set of tags.

```azurepowershell-interactive
$tags = @{"Project"="ECommerce"; "CostCenter"="00123"; "Team"="Web"}
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

The same commands also work with resource groups or subscriptions. You pass in the identifier for the resource group or subscription you want to tag.

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

### List tags

To get the tags for a resource, resource group, or subscription, use the [Get-AzTag](/powershell/module/az.resources/get-aztag) command and pass in the resource ID for the entity.

To see the tags for a resource, use:

```azurepowershell-interactive
$resource = Get-AzResource -Name demoStorage -ResourceGroup demoGroup
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

### List by tag

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

### Remove tags

To remove specific tags, use **Update-AzTag** and set **-Operation** to **Delete**. Pass in the tags you want to delete.

```azurepowershell-interactive
$removeTags = @{"Project"="ECommerce"; "Team"="Web"}
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

## Azure CLI

### Apply tags

When adding tags to a resource group or resource, you can either overwrite the existing tags or append new tags to existing tags.

To overwrite the tags on a resource, use:

```azurecli-interactive
az resource tag --tags 'Dept=IT' 'Environment=Test' -g examplegroup -n examplevnet --resource-type "Microsoft.Network/virtualNetworks"
```

To append a tag to the existing tags on a resource, use:

```azurecli-interactive
az resource update --set tags.'Status'='Approved' -g examplegroup -n examplevnet --resource-type "Microsoft.Network/virtualNetworks"
```

To overwrite the existing tags on a resource group, use:

```azurecli-interactive
az group update -n examplegroup --tags 'Environment=Test' 'Dept=IT'
```

To append a tag to the existing tags on a resource group, use:

```azurecli-interactive
az group update -n examplegroup --set tags.'Status'='Approved'
```

Currently, Azure CLI doesn't have a command for applying tags to subscriptions. However, you can use CLI to deploy an ARM template that applies the tags to a subscription. See [Apply tags to resource groups or subscriptions](#apply-tags-to-resource-groups-or-subscriptions).

### List tags

To see the existing tags for a resource, use:

```azurecli-interactive
az resource show -n examplevnet -g examplegroup --resource-type "Microsoft.Network/virtualNetworks" --query tags
```

To see the existing tags for a resource group, use:

```azurecli-interactive
az group show -n examplegroup --query tags
```

That script returns the following format:

```json
{
  "Dept"        : "IT",
  "Environment" : "Test"
}
```

### List by tag

To get all the resources that have a particular tag and value, use `az resource list`:

```azurecli-interactive
az resource list --tag Dept=Finance
```

To get resource groups that have a specific tag, use `az group list`:

```azurecli-interactive
az group list --tag Dept=IT
```

### Handling spaces

If your tag names or values include spaces, you must take a couple of extra steps. The following example applies all tags from a resource group to its resources when the tags may contain spaces.

```azurecli-interactive
jsontags=$(az group show --name examplegroup --query tags -o json)
tags=$(echo $jsontags | tr -d '{}"' | sed 's/: /=/g' | sed "s/\"/'/g" | sed 's/, /,/g' | sed 's/ *$//g' | sed 's/^ *//g')
origIFS=$IFS
IFS=','
read -a tagarr <<< "$tags"
resourceids=$(az resource list -g examplegroup --query [].id --output tsv)
for id in $resourceids
do
  az resource tag --tags "${tagarr[@]}" --id $id
done
IFS=$origIFS
```

## Templates

You can tag resources, resource groups, and subscriptions during deployment with a Resource Manager template.

### Apply values

The following example deploys a storage account with three tags. Two of the tags (`Dept` and `Environment`) are set to literal values. One tag (`LastDeployed`) is set to a parameter that defaults to the current date.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "utcShort": {
            "type": "string",
            "defaultValue": "[utcNow('d')]"
        },
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]"
        }
    },
    "resources": [
        {
            "apiVersion": "2019-04-01",
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[concat('storage', uniqueString(resourceGroup().id))]",
            "location": "[parameters('location')]",
            "tags": {
                "Dept": "Finance",
                "Environment": "Production",
                "LastDeployed": "[parameters('utcShort')]"
            },
            "sku": {
                "name": "Standard_LRS"
            },
            "kind": "Storage",
            "properties": {}
        }
    ]
}
```

### Apply an object

You can define an object parameter that stores several tags, and apply that object to the tag element. This approach provides more flexibility than the previous example because the object can have different properties. Each property in the object becomes a separate tag for the resource. The following example has a parameter named `tagValues` that is applied to the tag element.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]"
        },
        "tagValues": {
            "type": "object",
            "defaultValue": {
                "Dept": "Finance",
                "Environment": "Production"
            }
        }
    },
    "resources": [
        {
            "apiVersion": "2019-04-01",
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[concat('storage', uniqueString(resourceGroup().id))]",
            "location": "[parameters('location')]",
            "tags": "[parameters('tagValues')]",
            "sku": {
                "name": "Standard_LRS"
            },
            "kind": "Storage",
            "properties": {}
        }
    ]
}
```

### Apply a JSON string

To store many values in a single tag, apply a JSON string that represents the values. The entire JSON string is stored as one tag that can't exceed 256 characters. The following example has a single tag named `CostCenter` that contains several values from a JSON string:  

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]"
        }
    },
    "resources": [
        {
            "apiVersion": "2019-04-01",
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[concat('storage', uniqueString(resourceGroup().id))]",
            "location": "[parameters('location')]",
            "tags": {
                "CostCenter": "{\"Dept\":\"Finance\",\"Environment\":\"Production\"}"
            },
            "sku": {
                "name": "Standard_LRS"
            },
            "kind": "Storage",
            "properties": {}
        }
    ]
}
```

### Apply tags from resource group

To apply tags from a resource group to a resource, use the [resourceGroup](../templates/template-functions-resource.md#resourcegroup) function. When getting the tag value, use the `tags[tag-name]` syntax instead of the `tags.tag-name` syntax, because some characters aren't parsed correctly in the dot notation.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]"
        }
    },
    "resources": [
        {
            "apiVersion": "2019-04-01",
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[concat('storage', uniqueString(resourceGroup().id))]",
            "location": "[parameters('location')]",
            "tags": {
                "Dept": "[resourceGroup().tags['Dept']]",
                "Environment": "[resourceGroup().tags['Environment']]"
            },
            "sku": {
                "name": "Standard_LRS"
            },
            "kind": "Storage",
            "properties": {}
        }
    ]
}
```

### Apply tags to resource groups or subscriptions

You can add tags to a resource group or subscription by deploying the **Microsoft.Resources/tags** resource type. The tags are applied to the target resource group or subscription for the deployment. Each time you deploy the template you replace any tags there were previously applied.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "tagName": {
            "type": "string",
            "defaultValue": "TeamName"
        },
        "tagValue": {
            "type": "string",
            "defaultValue": "AppTeam1"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Resources/tags",
            "name": "default",
            "apiVersion": "2019-10-01",
            "dependsOn": [],
            "properties": {
                "tags": {
                    "[parameters('tagName')]": "[parameters('tagValue')]"
                }
            }
        }
    ]
}
```

To apply the tags to a resource group, use either PowerShell or Azure CLI. Deploy to the resource group that you want to tag.

```azurepowershell-interactive
New-AzResourceGroupDeployment -ResourceGroupName exampleGroup -TemplateFile https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/tags.json
```

```azurecli-interactive
az deployment group create --resource-group exampleGroup --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/tags.json
```

To apply the tags to a subscription, use either PowerShell or Azure CLI. Deploy to the subscription that you want to tag.

```azurepowershell-interactive
New-AzSubscriptionDeployment -name tagresourcegroup -Location westus2 -TemplateUri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/tags.json
```

```azurecli-interactive
az deployment sub create --name tagresourcegroup --location westus2 --template-uri https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/azure-resource-manager/tags.json
```

For more information about subscription deployments, see [Create resource groups and resources at the subscription level](../templates/deploy-to-subscription.md).

The following template adds the tags from an object to either a resource group or subscription.

```json
"$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "tags": {
            "type": "object",
            "defaultValue": {
                "TeamName": "AppTeam1",
                "Dept": "Finance",
                "Environment": "Production"
            }
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Resources/tags",
            "name": "default",
            "apiVersion": "2019-10-01",
            "dependsOn": [],
            "properties": {
                "tags": "[parameters('tags')]"
            }
        }
    ]
}
```

## Portal

[!INCLUDE [resource-manager-tag-resource](../../../includes/resource-manager-tag-resources.md)]

## REST API

To work with tags through the Azure REST API, use:

* [Tags - Create Or Update At Scope](/rest/api/resources/tags/createorupdateatscope) (PUT operation)
* [Tags - Update At Scope](/rest/api/resources/tags/updateatscope) (PATCH operation)
* [Tags - Get At Scope](/rest/api/resources/tags/getatscope) (GET operation)
* [Tags - Delete At Scope](/rest/api/resources/tags/deleteatscope) (DELETE operation)

## Inherit tags

Tags applied to the resource group or subscription aren't inherited by the resources. To apply tags from a subscription or resource group to the resources, see [Azure Policies - tags](tag-policies.md).

## Tags and billing

You can use tags to group your billing data. For example, if you're running multiple VMs for different organizations, use the tags to group usage by cost center. You can also use tags to categorize costs by runtime environment, such as the billing usage for VMs running in the production environment.

You can retrieve information about tags through the [Azure Resource Usage and RateCard APIs](../../billing/billing-usage-rate-card-overview.md) or the usage comma-separated values (CSV) file. You download the usage file from the [Azure Account Center](https://account.azure.com/Subscriptions) or Azure portal. For more information, see [Download or view your Azure billing invoice and daily usage data](../../billing/billing-download-azure-invoice-daily-usage-date.md). When downloading the usage file from the Azure Account Center, select **Version 2**. For services that support tags with billing, the tags appear in the **Tags** column.

For REST API operations, see [Azure Billing REST API Reference](/rest/api/billing/).

## Limitations

The following limitations apply to tags:

* Not all resource types support tags. To determine if you can apply a tag to a resource type, see [Tag support for Azure resources](tag-support.md).
* Each resource, resource group, and subscription can have a maximum of 50 tag name/value pairs. If you need to apply more tags than the maximum allowed number, use a JSON string for the tag value. The JSON string can contain many values that are applied to a single tag name. A resource group or subscription can contain many resources that each have 50 tag name/value pairs.
* The tag name is limited to 512 characters, and the tag value is limited to 256 characters. For storage accounts, the tag name is limited to 128 characters, and the tag value is limited to 256 characters.
* Tags can't be applied to classic resources such as Cloud Services.
* Tag names can't contain these characters: `<`, `>`, `%`, `&`, `\`, `?`, `/`

   > [!NOTE]
   > Currently, Azure DNS zones and Traffic Manager services also don't allow the use of spaces in the tag.
   >
   > Azure Front Door doesn't support the use of `#` in the tag name.

## Next steps

* Not all resource types support tags. To determine if you can apply a tag to a resource type, see [Tag support for Azure resources](tag-support.md).
* For recommendations on how to implement a tagging strategy, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json).
