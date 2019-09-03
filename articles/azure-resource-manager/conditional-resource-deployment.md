---
title: Conditional deployment withAzure Resource Manager templates
description: Describes how to conditionally deploy a resource in an Azure Resource Manager template.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 09/03/2019
ms.author: tomfitz
---

# Conditional deployment in Resource Manager templates

Sometimes you need to specify during deployment whether a resource in the template is deployed. You may want the flexibility to either deploy a new resource or use an existing resource.

When you must decide during deployment whether to create a resource, use the `condition` element. The value for this element resolves to true or false. When the value is true, the resource is created. When the value is false, the resource isn't created. The value can only be applied to the whole resource.

## New or existing resource

You can use conditional deployment to create a new resource or use an existing one. The following example shows how to use condition to deploy a new storage account or use an existing storage account.

```json
{
    "condition": "[equals(parameters('newOrExisting'),'new')]",
    "type": "Microsoft.Storage/storageAccounts",
    "name": "[variables('storageAccountName')]",
    "apiVersion": "2017-06-01",
    "location": "[parameters('location')]",
    "sku": {
        "name": "[variables('storageAccountType')]"
    },
    "kind": "Storage",
    "properties": {}
}
```

When the parameter **newOrExisting** is set to **new**, the condition evaluates to true. The storage account is deployed. However, when **newOrExisting** is set to **existing**, the condition evaluates to false and the storage account isn't deployed.

For a complete example template that uses the `condition` element, see [VM with a new or existing Virtual Network, Storage, and Public IP](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-new-or-existing-conditions).

## Functions with conditional deployment

If you use a [reference](resource-group-template-functions-resource.md#reference) or [list](resource-group-template-functions-resource.md#list) function with a resource that is conditionally deployed, the function is evaluated even if the resource isn't deployed. You get an error if the function refers to a resource that doesn't exist.

Use the [if](resource-group-template-functions-logical.md#if) function to make sure the function is only evaluated for conditions when the resource is deployed. See the [if function](resource-group-template-functions-logical.md#if) for a sample template that uses if and reference with a conditionally deployed resource.

## Next steps

* For recommendations about creating templates, see [Azure Resource Manager template best practices](template-best-practices.md).
* To create multiple instances of a resource, see [Resource, property, or variable iteration in Azure Resource Manager templates](resource-group-create-multiple.md).