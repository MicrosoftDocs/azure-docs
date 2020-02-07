---
title: Resource not found errors
description: Describes how to resolve errors when a resource can't be found when deploying with an Azure Resource Manager template.
ms.topic: troubleshooting
ms.date: 01/21/2020
---
# Resolve not found errors for Azure resources

This article describes the errors you may see when a resource can't be found during deployment.

## Symptom

When your template includes the name of a resource that can't be resolved, you receive an error similar to:

```
Code=NotFound;
Message=Cannot find ServerFarm with name exampleplan.
```

If you use the [reference](template-functions-resource.md#reference) or [listKeys](template-functions-resource.md#listkeys) functions with a resource that can't be resolved, you receive the following error:

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
  "type": "Microsoft.Web/sites",
  "apiVersion": "2015-08-01",
  "dependsOn": [
    "[variables('hostingPlanName')]"
  ],
  ...
}
```

But, you want to avoid setting dependencies that aren't needed. When you have unnecessary dependencies, you prolong the duration of the deployment by preventing resources that aren't dependent on each other from being deployed in parallel. In addition, you may create circular dependencies that block the deployment. The [reference](template-functions-resource.md#reference) function and [list*](template-functions-resource.md#list) functions creates an implicit dependency on the referenced resource, when that resource is deployed in the same template and is referenced by its name (not resource ID). Therefore, you may have more dependencies than the dependencies specified in the **dependsOn** property. The [resourceId](template-functions-resource.md#resourceid) function doesn't create an implicit dependency or validate that the resource exists. The [reference](template-functions-resource.md#reference) function and [list*](template-functions-resource.md#list) functions don't create an implicit dependency when the resource is referred to by its resource ID. To create an implicit dependency, pass the name of the resource that is deployed in the same template.

When you see dependency problems, you need to gain insight into the order of resource deployment. To view the order of deployment operations:

1. Select the deployment history for your resource group.

   ![select deployment history](./media/error-not-found/select-deployment.png)

2. Select a deployment from the history, and select **Events**.

   ![select deployment events](./media/error-not-found/select-deployment-events.png)

3. Examine the sequence of events for each resource. Pay attention to the status of each operation. For example, the following image shows three storage accounts that deployed in parallel. Notice that the three storage accounts are started at the same time.

   ![parallel deployment](./media/error-not-found/deployment-events-parallel.png)

   The next image shows three storage accounts that aren't deployed in parallel. The second storage account depends on the first storage account, and the third storage account depends on the second storage account. The first storage account is started, accepted, and completed before the next is started.

   ![sequential deployment](./media/error-not-found/deployment-events-sequence.png)

## Solution 2 - get resource from different resource group

When the resource exists in a different resource group than the one being deployed to, use the [resourceId function](template-functions-resource.md#resourceid) to get the fully qualified name of the resource.

```json
"properties": {
  "name": "[parameters('siteName')]",
  "serverFarmId": "[resourceId('plangroup', 'Microsoft.Web/serverfarms', parameters('hostingPlanName'))]"
}
```

## Solution 3 - check reference function

Look for an expression that includes the [reference](template-functions-resource.md#reference) function. The values you provide vary based on whether the resource is in the same template, resource group, and subscription. Double check that you're providing the required parameter values for your scenario. If the resource is in a different resource group, provide the full resource ID. For example, to reference a storage account in another resource group, use:

```json
"[reference(resourceId('exampleResourceGroup', 'Microsoft.Storage/storageAccounts', 'myStorage'), '2017-06-01')]"
```

## Solution 4 - get managed identity from resource

If you're deploying a resource that implicitly creates a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md), you must wait until that resource is deployed before retrieving values on the managed identity. If you pass the managed identity name to the [reference](template-functions-resource.md#reference) function, Resource Manager attempts to resolve the reference before the resource and identity are deployed. Instead, pass the name of the resource that the identity is applied to. This approach ensures the resource and the managed identity are deployed before Resource Manager resolves the reference function.

In the reference function, use `Full` to get all of the properties including the managed identity.

For example, to get the tenant ID for a managed identity that is applied to a virtual machine scale set, use:

```json
"tenantId": "[reference(concat('Microsoft.Compute/virtualMachineScaleSets/',  variables('vmNodeType0Name')), variables('vmssApiVersion'), 'Full').Identity.tenantId]"
```