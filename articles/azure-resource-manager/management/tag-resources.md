---
title: Tag resources, resource groups, and subscriptions for logical organization
description: Shows how to apply tags to organize Azure resources for billing and managing.
ms.topic: conceptual
ms.date: 05/25/2022
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Use tags to organize your Azure resources and management hierarchy

Tags are metadata elements that you apply to your Azure resources. They're key-value pairs that help you identify resources based on settings that are relevant to your organization. If you want to track the deployment environment for your resources, add a key named Environment. To identify the resources deployed to production, give them a value of Production. Fully formed, the key-value pair becomes, Environment = Production.

You can apply tags to your Azure resources, resource groups, and subscriptions.

For recommendations on how to implement a tagging strategy, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json).

Resource tags support all cost-accruing services. To ensure that cost-accruing services are provisioned with a tag, use one of the [tag policies](tag-policies.md).  

> [!WARNING]
> Tags are stored as plain text. Never add sensitive values to tags. Sensitive values could be exposed through many methods, including cost reports, commands that return existing tag definitions, deployment histories, exported templates, and monitoring logs.

> [!IMPORTANT]
> Tag names are case-insensitive for operations. A tag with a tag name, regardless of the casing, is updated or retrieved. However, the resource provider might keep the casing you provide for the tag name. You'll see that casing in cost reports.
>
> Tag values are case-sensitive.

[!INCLUDE [Handle personal data](../../../includes/gdpr-intro-sentence.md)]

## Required access

There are two ways to get the required access to tag resources.

- You can have write access to the `Microsoft.Resources/tags` resource type. This access lets you tag any resource, even if you don't have access to the resource itself. The [Tag Contributor](../../role-based-access-control/built-in-roles.md#tag-contributor) role grants this access. The tag contributor role, for example, can't apply tags to resources or resource groups through the portal. It can, however, apply tags to subscriptions through the portal. It supports all tag operations through Azure PowerShell and REST API.

- You can have write access to the resource itself. The [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role grants the required access to apply tags to any entity. To apply tags to only one resource type, use the contributor role for that resource. To apply tags to virtual machines, for example, use the [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor).

## PowerShell

### Apply tags

Azure PowerShell offers two commands to apply tags: [New-AzTag](/powershell/module/az.resources/new-aztag) and [Update-AzTag](/powershell/module/az.resources/update-aztag). You need to have the `Az.Resources` module 1.12.0 version or later. You can check your version with `Get-InstalledModule -Name Az.Resources`. You can install that module or [install Azure PowerShell](/powershell/azure/install-az-ps) version 3.6.1 or later.

The `New-AzTag` replaces all tags on the resource, resource group, or subscription. When you call the command, pass the resource ID of the entity you want to tag.

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

If you run the command again, but this time with different tags, notice that the earlier tags disappear.

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

To add tags to a resource that already has tags, use `Update-AzTag`. Set the `-Operation` parameter to `Merge`.

```azurepowershell-interactive
$tags = @{"Dept"="Finance"; "Status"="Normal"}
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

### List tags

To get the tags for a resource, resource group, or subscription, use the [Get-AzTag](/powershell/module/az.resources/get-aztag) command and pass the resource ID of the entity.

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

To remove specific tags, use `Update-AzTag` and set `-Operation` to `Delete`. Pass the resource IDs of the tags you want to delete.

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

Azure CLI offers two commands to apply tags: [az tag create](/cli/azure/tag#az-tag-create) and [az tag update](/cli/azure/tag#az-tag-update). You need to have the Azure CLI 2.10.0 version or later. You can check your version with `az version`. To update or install it, see [Install the Azure CLI](/cli/azure/install-azure-cli).

The `az tag create` replaces all tags on the resource, resource group, or subscription. When you call the command, pass the resource ID of the entity you want to tag.

The following example applies a set of tags to a storage account:

```azurecli-interactive
resource=$(az resource show -g demoGroup -n demoStorage --resource-type Microsoft.Storage/storageAccounts --query "id" --output tsv)
az tag create --resource-id $resource --tags Dept=Finance Status=Normal
```

When the command completes, notice that the resource has two tags.

```output
"properties": {
  "tags": {
    "Dept": "Finance",
    "Status": "Normal"
  }
},
```

If you run the command again, but this time with different tags, notice that the earlier tags disappear.

```azurecli-interactive
az tag create --resource-id $resource --tags Team=Compliance Environment=Production
```

```output
"properties": {
  "tags": {
    "Environment": "Production",
    "Team": "Compliance"
  }
},
```

To add tags to a resource that already has tags, use `az tag update`. Set the `--operation` parameter to `Merge`.

```azurecli-interactive
az tag update --resource-id $resource --operation Merge --tags Dept=Finance Status=Normal
```

Notice that the existing tags grow with the addition of the two new tags.

```output
"properties": {
  "tags": {
    "Dept": "Finance",
    "Environment": "Production",
    "Status": "Normal",
    "Team": "Compliance"
  }
},
```

Each tag name can have only one value. If you provide a new value for a tag, the new tag replaces the old value, even if you use the merge operation. The following example changes the `Status` tag from _Normal_ to _Green_.

```azurecli-interactive
az tag update --resource-id $resource --operation Merge --tags Status=Green
```

```output
"properties": {
  "tags": {
    "Dept": "Finance",
    "Environment": "Production",
    "Status": "Green",
    "Team": "Compliance"
  }
},
```

When you set the `--operation` parameter to `Replace`, the new set of tags replaces the existing tags.

```azurecli-interactive
az tag update --resource-id $resource --operation Replace --tags Project=ECommerce CostCenter=00123 Team=Web
```

Only the new tags remain on the resource.

```output
"properties": {
  "tags": {
    "CostCenter": "00123",
    "Project": "ECommerce",
    "Team": "Web"
  }
},
```

The same commands also work with resource groups or subscriptions. Pass them in the identifier of the resource group or subscription you want to tag.

To add a new set of tags to a resource group, use:

```azurecli-interactive
group=$(az group show -n demoGroup --query id --output tsv)
az tag create --resource-id $group --tags Dept=Finance Status=Normal
```

To update the tags for a resource group, use:

```azurecli-interactive
az tag update --resource-id $group --operation Merge --tags CostCenter=00123 Environment=Production
```

To add a new set of tags to a subscription, use:

```azurecli-interactive
sub=$(az account show --subscription "Demo Subscription" --query id --output tsv)
az tag create --resource-id /subscriptions/$sub --tags CostCenter=00123 Environment=Dev
```

To update the tags for a subscription, use:

```azurecli-interactive
az tag update --resource-id /subscriptions/$sub --operation Merge --tags Team="Web Apps"
```

### List tags

To get the tags for a resource, resource group, or subscription, use the [az tag list](/cli/azure/tag#az-tag-list) command and pass the resource ID of the entity.

To see the tags for a resource, use:

```azurecli-interactive
resource=$(az resource show -g demoGroup -n demoStorage --resource-type Microsoft.Storage/storageAccounts --query "id" --output tsv)
az tag list --resource-id $resource
```

To see the tags for a resource group, use:

```azurecli-interactive
group=$(az group show -n demoGroup --query id --output tsv)
az tag list --resource-id $group
```

To see the tags for a subscription, use:

```azurecli-interactive
sub=$(az account show --subscription "Demo Subscription" --query id --output tsv)
az tag list --resource-id /subscriptions/$sub
```

### List by tag

To get resources that have a specific tag name and value, use:

```azurecli-interactive
az resource list --tag CostCenter=00123 --query [].name
```

To get resources that have a specific tag name with any tag value, use:

```azurecli-interactive
az resource list --tag Team --query [].name
```

To get resource groups that have a specific tag name and value, use:

```azurecli-interactive
az group list --tag Dept=Finance
```

### Remove tags

To remove specific tags, use `az tag update` and set `--operation` to `Delete`. Pass the resource ID of the tags you want to delete.

```azurecli-interactive
az tag update --resource-id $resource --operation Delete --tags Project=ECommerce Team=Web
```

You've removed the specified tags.

```output
"properties": {
  "tags": {
    "CostCenter": "00123"
  }
},
```

To remove all tags, use the [az tag delete](/cli/azure/tag#az-tag-delete) command.

```azurecli-interactive
az tag delete --resource-id $resource
```

### Handling spaces

If your tag names or values include spaces, enclose them in quotation marks.

```azurecli-interactive
az tag update --resource-id $group --operation Merge --tags "Cost Center"=Finance-1222 Location="West US"
```

## ARM templates

You can tag resources, resource groups, and subscriptions during deployment with an ARM template.

> [!NOTE]
> The tags you apply through an ARM template or Bicep file overwrite any existing tags.

### Apply values

The following example deploys a storage account with three tags. Two of the tags (`Dept` and `Environment`) are set to literal values. One tag (`LastDeployed`) is set to a parameter that defaults to the current date.

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
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
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01",
      "name": "[concat('storage', uniqueString(resourceGroup().id))]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "tags": {
        "Dept": "Finance",
        "Environment": "Production",
        "LastDeployed": "[parameters('utcShort')]"
      },
      "properties": {}
    }
  ]
}
```

# [Bicep](#tab/bicep)

```Bicep
param location string = resourceGroup().location
param utcShort string = utcNow('d')

resource stgAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: 'storage${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  tags: {
    Dept: 'Finance'
    Environment: 'Production'
    LastDeployed: utcShort
  }
}
```

---

### Apply an object

You can define an object parameter that stores several tags and apply that object to the tag element. This approach provides more flexibility than the previous example because the object can have different properties. Each property in the object becomes a separate tag for the resource. The following example has a parameter named `tagValues` that's applied to the tag element.

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
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
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01",
      "name": "[concat('storage', uniqueString(resourceGroup().id))]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "tags": "[parameters('tagValues')]",
      "properties": {}
    }
  ]
}
```

# [Bicep](#tab/bicep)

```Bicep
param location string = resourceGroup().location
param tagValues object = {
  Dept: 'Finance'
  Environment: 'Production'
}

resource stgAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: 'storage${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  tags: tagValues
}
```

---

### Apply a JSON string

To store many values in a single tag, apply a JSON string that represents the values. The entire JSON string is stored as one tag that can't exceed 256 characters. The following example has a single tag named `CostCenter` that contains several values from a JSON string:

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01",
      "name": "[concat('storage', uniqueString(resourceGroup().id))]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "tags": {
        "CostCenter": "{\"Dept\":\"Finance\",\"Environment\":\"Production\"}"
      },
      "properties": {}
    }
  ]
}
```

# [Bicep](#tab/bicep)

```Bicep
param location string = resourceGroup().location

resource stgAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: 'storage${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  tags: {
    CostCenter: '{"Dept":"Finance","Environment":"Production"}'
  }
}
```

---

### Apply tags from resource group

To apply tags from a resource group to a resource, use the [resourceGroup()](../templates/template-functions-resource.md#resourcegroup) function. When you get the tag value, use the `tags[tag-name]` syntax instead of the `tags.tag-name` syntax, because some characters aren't parsed correctly in the dot notation.

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01",
      "name": "[concat('storage', uniqueString(resourceGroup().id))]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "tags": {
        "Dept": "[resourceGroup().tags['Dept']]",
        "Environment": "[resourceGroup().tags['Environment']]"
      },
      "properties": {}
    }
  ]
}
```

# [Bicep](#tab/bicep)

```Bicep
param location string = resourceGroup().location

resource stgAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: 'storage${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
  tags: {
    Dept: resourceGroup().tags['Dept']
    Environment: resourceGroup().tags['Environment']
  }
}
```

---

### Apply tags to resource groups or subscriptions

You can add tags to a resource group or subscription by deploying the `Microsoft.Resources/tags` resource type. You can apply the tags  to the target resource group or subscription you want to deploy. Each time you deploy the template you replace any previous tags.

# [JSON](#tab/json)

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
  "resources": [
    {
      "type": "Microsoft.Resources/tags",
      "name": "default",
      "apiVersion": "2021-04-01",
      "properties": {
        "tags": {
          "[parameters('tagName')]": "[parameters('tagValue')]"
        }
      }
    }
  ]
}
```

# [Bicep](#tab/bicep)

```Bicep
param tagName string = 'TeamName'
param tagValue string = 'AppTeam1'

resource applyTags 'Microsoft.Resources/tags@2021-04-01' = {
  name: 'default'
  properties: {
    tags: {
      '${tagName}': tagValue
    }
  }
}
```

---

To apply the tags to a resource group, use either Azure PowerShell or Azure CLI. Deploy to the resource group that you want to tag.

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

# [JSON](#tab/json)

```json
{
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
  "resources": [
    {
      "type": "Microsoft.Resources/tags",
      "apiVersion": "2021-04-01",
      "name": "default",
      "properties": {
        "tags": "[parameters('tags')]"
      }
    }
  ]
}
```

# [Bicep](#tab/bicep)

```Bicep
targetScope = 'subscription'

param tagObject object = {
  TeamName: 'AppTeam1'
  Dept: 'Finance'
  Environment: 'Production'
}

resource applyTags 'Microsoft.Resources/tags@2021-04-01' = {
  name: 'default'
  properties: {
    tags: tagObject
  }
}
```

---

## Portal

[!INCLUDE [resource-manager-tag-resource](../../../includes/resource-manager-tag-resources.md)]

## REST API

To work with tags through the Azure REST API, use:

* [Tags - Create Or Update At Scope](/rest/api/resources/tags/createorupdateatscope) (PUT operation)
* [Tags - Update At Scope](/rest/api/resources/tags/updateatscope) (PATCH operation)
* [Tags - Get At Scope](/rest/api/resources/tags/getatscope) (GET operation)
* [Tags - Delete At Scope](/rest/api/resources/tags/deleteatscope) (DELETE operation)

## SDKs

For examples of applying tags with SDKs, see:

* [.NET](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/resourcemanager/Azure.ResourceManager/samples/Sample2_ManagingResourceGroups.md)
* [Java](https://github.com/Azure-Samples/resources-java-manage-resource-group/blob/master/src/main/java/com/azure/resourcemanager/resources/samples/ManageResourceGroup.java)
* [JavaScript](https://github.com/Azure-Samples/azure-sdk-for-js-samples/blob/main/samples/resources/resources_example.ts)
* [Python](https://github.com/Azure-Samples/resource-manager-python-resources-and-groups)

## Inherit tags

Resources don't inherit the tags you apply to a resource group or a subscription. To apply tags from a subscription or resource group to the resources, see [Azure Policies - tags](tag-policies.md).

## Tags and billing

You can use tags to group your billing data. If you're running multiple VMs for different organizations, for example, use the tags to group usage by cost center. You can also use tags to categorize costs by runtime environment, such as the billing usage for VMs running in the production environment.

You can retrieve information about tags by downloading the usage file available from the Azure portal. For more information, see [Download or view your Azure billing invoice and daily usage data](../../cost-management-billing/manage/download-azure-invoice-daily-usage-date.md). For services that support tags with billing, the tags appear in the **Tags** column.

For REST API operations, see [Azure Billing REST API Reference](/rest/api/billing/).

## Limitations

The following limitations apply to tags:

* Not all resource types support tags. To determine if you can apply a tag to a resource type, see [Tag support for Azure resources](tag-support.md).
* Each resource, resource group, and subscription can have a maximum of 50 tag name-value pairs. If you need to apply more tags than the maximum allowed number, use a JSON string for the tag value. The JSON string can contain many of the values that you apply to a single tag name. A resource group or subscription can contain many resources that each have 50 tag name-value pairs.
* The tag name has a limit of 512 characters and the tag value has a limit of 256 characters. For storage accounts, the tag name has a limit of 128 characters and the tag value has a limit of 256 characters.
* Classic resources such as Cloud Services don't support tags.
* Azure IP Groups and Azure Firewall Policies don't support PATCH operations. PATCH API method operations, therefore, can't update tags through the portal. Instead, you can use the update commands for those resources. You can update tags for an IP group, for example, with the [az network ip-group update](/cli/azure/network/ip-group#az-network-ip-group-update) command.
* Tag names can't contain these characters: `<`, `>`, `%`, `&`, `\`, `?`, `/`

   > [!NOTE]
   > * Azure Domain Name System (DNS) zones don't support the use of spaces in the tag or a tag that starts with a number. Azure DNS tag names don't support special and unicode characters. The value can contain all characters.
   >
   > * Traffic Manager doesn't support the use of spaces, `#` or `:` in the tag name. The tag name can't start with a number.
   >
   > * Azure Front Door doesn't support the use of `#` or `:` in the tag name.
   >
   > * The following Azure resources only support 15 tags:
   >     * Azure Automation
   >     * Azure Content Delivery Network (CDN)
   >     * Azure DNS (Zone and A records)

## Next steps

* Not all resource types support tags. To determine if you can apply a tag to a resource type, see [Tag support for Azure resources](tag-support.md).
* For recommendations on how to implement a tagging strategy, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json).
