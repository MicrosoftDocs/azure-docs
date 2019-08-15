---
title: Azure resource not found errors | Microsoft Docs
description: Describes how to resolve errors when a resource cannot be found.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: troubleshooting
ms.date: 06/06/2018
ms.author: tomfitz

---
# Resolve not found errors for Azure resources

This article describes the errors you may see when a resource can't be found during deployment.

## Symptom

When your template includes the name of a resource that can't be resolved, you receive an error similar to:

```
Code=NotFound;
Message=Cannot find ServerFarm with name exampleplan.
```

If you use the [reference](resource-group-template-functions-resource.md#reference) or [listKeys](resource-group-template-functions-resource.md#listkeys) functions with a resource that can't be resolved, you receive the following error:

```
Code=ResourceNotFound;
Message=The Resource 'Microsoft.Storage/storageAccounts/{storage name}' under resource
group {resource group name} was not found.
```

## Cause

Resource Manager needs to retrieve the properties for a resource, but can't identify the resource in your subscription.

## Solution 1 - set dependencies

If you're trying to deploy the missing resource in the template, check whether you need to add a dependency. Resource Manager optimizes deployment by creating resources in parallel, when possible. If one resource must be deployed after another resource, you need to use the **dependsOn** element in your template. For example, when deploying a web app, the App Service plan must exist. If you haven't specified that the web app depends on the App Service plan, Resource Manager creates both resources at the same time. You get an error stating that the App Service plan resource can't be found, because it doesn't exist yet when attempting to set a property on the web app. You prevent this error by setting the dependency in the web app.

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

But, you want to avoid setting dependencies that aren't needed. When you have unnecessary dependencies, you prolong the duration of the deployment by preventing resources that aren't dependent on each other from being deployed in parallel. In addition, you may create circular dependencies that block the deployment. The [reference](resource-group-template-functions-resource.md#reference) function and [list*](resource-group-template-functions-resource.md#list) functions creates an implicit dependency on the referenced resource, when that resource is deployed in the same template and is referenced by its name (not resource ID). Therefore, you may have more dependencies than the dependencies specified in the **dependsOn** property. The [resourceId](resource-group-template-functions-resource.md#resourceid) function doesn't create an implicit dependency or validate that the resource exists. The [reference](resource-group-template-functions-resource.md#reference) function and [list*](resource-group-template-functions-resource.md#list) functions don't create an implicit dependency when the resource is referred to by its resource ID. To create an implicit dependency, pass the name of the resource that is deployed in the same template.

When you see dependency problems, you need to gain insight into the order of resource deployment. To view the order of deployment operations:

1. Select the deployment history for your resource group.

   ![select deployment history](./media/resource-manager-not-found-errors/select-deployment.png)

2. Select a deployment from the history, and select **Events**.

   ![select deployment events](./media/resource-manager-not-found-errors/select-deployment-events.png)

3. Examine the sequence of events for each resource. Pay attention to the status of each operation. For example, the following image shows three storage accounts that deployed in parallel. Notice that the three storage accounts are started at the same time.

   ![parallel deployment](./media/resource-manager-not-found-errors/deployment-events-parallel.png)

   The next image shows three storage accounts that aren't deployed in parallel. The second storage account depends on the first storage account, and the third storage account depends on the second storage account. The first storage account is started, accepted, and completed before the next is started.

   ![sequential deployment](./media/resource-manager-not-found-errors/deployment-events-sequence.png)

## Solution 2 - get resource from different resource group

When the resource exists in a different resource group than the one being deployed to, use the [resourceId function](resource-group-template-functions-resource.md#resourceid) to get the fully qualified name of the resource.

```json
"properties": {
    "name": "[parameters('siteName')]",
    "serverFarmId": "[resourceId('plangroup', 'Microsoft.Web/serverfarms', parameters('hostingPlanName'))]"
}
```

## Solution 3 - check reference function

Look for an expression that includes the [reference](resource-group-template-functions-resource.md#reference) function. The values you provide vary based on whether the resource is in the same template, resource group, and subscription. Double check that you're providing the required parameter values for your scenario. If the resource is in a different resource group, provide the full resource ID. For example, to reference a storage account in another resource group, use:

```json
"[reference(resourceId('exampleResourceGroup', 'Microsoft.Storage/storageAccounts', 'myStorage'), '2017-06-01')]"
```