---
title: Tag resources, resource groups, and subscriptions with Azure CLI
description: Shows how to use Azure CLI to apply tags to Azure resources.
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 04/19/2023
---

# Apply tags with Azure CLI

This article describes how to use Azure CLI to tag resources, resource groups, and subscriptions. For tag recommendations and limitations, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).

## Apply tags

Azure CLI offers two commands to apply tags: [az tag create](/cli/azure/tag#az-tag-create) and [az tag update](/cli/azure/tag#az-tag-update). You need to have the Azure CLI 2.10.0 version or later. You can check your version with `az version`. To update or install it, see [Install the Azure CLI](/cli/azure/install-azure-cli).

The `az tag create` replaces all tags on the resource, resource group, or subscription. When you call the command, pass the resource ID of the entity you want to tag.

The following example applies a set of tags to a storage account:

```azurecli-interactive
resource=$(az resource show -g demoGroup -n demostorage --resource-type Microsoft.Storage/storageAccounts --query "id" --output tsv)
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

## List tags

To get the tags for a resource, resource group, or subscription, use the [az tag list](/cli/azure/tag#az-tag-list) command and pass the resource ID of the entity.

To see the tags for a resource, use:

```azurecli-interactive
resource=$(az resource show -g demoGroup -n demostorage --resource-type Microsoft.Storage/storageAccounts --query "id" --output tsv)
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

## List by tag

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

## Remove tags

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

## Handling spaces

If your tag names or values include spaces, enclose them in quotation marks.

```azurecli-interactive
az tag update --resource-id $group --operation Merge --tags "Cost Center"=Finance-1222 Location="West US"
```

## Next steps

* Not all resource types support tags. To determine if you can apply a tag to a resource type, see [Tag support for Azure resources](tag-support.md).
* For recommendations on how to implement a tagging strategy, see [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json).
* For tag recommendations and limitations, see [Use tags to organize your Azure resources and management hierarchy](tag-resources.md).
