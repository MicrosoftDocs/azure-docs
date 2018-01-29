---
title: Azure resource not found errors | Microsoft Docs
description: Describes how to resolve errors when a resource cannot be found.
services: azure-resource-manager,azure-portal
documentationcenter: ''
author: tfitzmac
manager: timlt
editor: ''

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: support-article
ms.date: 09/13/2017
ms.author: tomfitz

---
# Resolve not found errors for Azure resources

This article describes the errors you may encounter when a resource cannot be found during deployment. 

## Symptom

When your template includes the name of a resource that cannot be resolved, you receive an error similar to:

```
Code=NotFound;
Message=Cannot find ServerFarm with name exampleplan.
```

If you attempt to use the [reference](resource-group-template-functions-resource.md#reference) or [listKeys](resource-group-template-functions-resource.md#listkeys) functions with a resource that cannot be resolved, you receive the following error:

```
Code=ResourceNotFound;
Message=The Resource 'Microsoft.Storage/storageAccounts/{storage name}' under resource
group {resource group name} was not found.
```

## Cause

Resource Manager needs to retrieve the properties for a resource, but cannot identify the resource in your subscription.

## Solution

### Solution 1

If you are attempting to deploy the missing resource in the template, check whether you need to add a dependency. Resource Manager optimizes deployment by creating resources in parallel, when possible. If one resource must be deployed after another resource, you need to use the **dependsOn** element in your template to create a dependency on the other resource. For example, when deploying a web app, the App Service plan must exist. If you have not specified that the web app depends on the App Service plan, Resource Manager creates both resources at the same time. You receive an error stating that the App Service plan resource cannot be found, because it does not exist yet when attempting to set a property on the web app. You prevent this error by setting the dependency in the web app.

```json
{
  "apiVersion": "2015-08-01",
  "type": "Microsoft.Web/sites",
  "dependsOn": [
    "[variables('hostingPlanName')]"
  ],
  ...
}
```

For suggestions on troubleshooting dependency errors, see [Check deployment sequence](resource-manager-troubleshoot-tips.md#check-deployment-sequence).

### Solution 2

When the resource exists in a different resource group than the one being deployed to, use the [resourceId function](resource-group-template-functions-resource.md#resourceid) to get the fully qualified name of the resource.

```json
"properties": {
    "name": "[parameters('siteName')]",
    "serverFarmId": "[resourceId('plangroup', 'Microsoft.Web/serverfarms', parameters('hostingPlanName'))]"
}
```

### Solution 3

Look for an expression that includes the [reference](resource-group-template-functions-resource.md#reference) function. The values you provide vary based on whether the resource is in the same template, resource group, and subscription. Double check that you are providing the required parameter values for your scenario. If the resource is in a different resource group, provide the full resource ID. For example, to reference a storage account in another resource group, use:

```json
"[reference(resourceId('exampleResourceGroup', 'Microsoft.Storage/storageAccounts', 'myStorage'), '2017-06-01')]"
```