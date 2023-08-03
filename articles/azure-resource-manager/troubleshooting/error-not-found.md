---
title: Resource not found errors
description: Describes how to resolve errors when a resource can't be found. The error might occur when you deploy a Bicep file or Azure Resource Manager template, or when doing management tasks.
ms.topic: troubleshooting
ms.custom: devx-track-arm-template, devx-track-bicep
ms.date: 04/05/2023
---

# Resolve errors for resource not found

This article describes the error you see when a resource can't be found during an operation. Typically, you see this error when deploying resources with a Bicep file or Azure Resource Manager template (ARM template). You also see this error when doing management tasks and Azure Resource Manager can't find the required resource. For example, if you try to add tags to a resource that doesn't exist, you receive this error.

## Symptoms

There are two error codes that indicate the resource can't be found. The `NotFound` error returns a result similar to:

```Output
Code=NotFound;
Message=Cannot find ServerFarm with name exampleplan.
```

The `ResourceNotFound` error returns a result similar to:

```Output
Code=ResourceNotFound;
Message=The Resource 'Microsoft.Storage/storageAccounts/{storage name}' under resource
group {resource group name} was not found.
```

## Cause

Resource Manager needs to retrieve the properties for a resource, but can't find the resource in your subscription.

## Solution 1: Check resource properties

When you receive this error while doing a management task, check the values you provided for the resource. The three values to check are:

- Resource name
- Resource group name
- Subscription

If you're using PowerShell or Azure CLI, check that you're running commands in the subscription that contains the resource. You can change the subscription with [Set-AzContext](/powershell/module/Az.Accounts/Set-AzContext) or [az account set](/cli/azure/account#az-account-set). Many commands provide a subscription parameter that lets you specify a different subscription than the current context.

If you can't verify the properties, sign in to the [Microsoft Azure portal](https://portal.azure.com). Find the resource you're trying to use and examine the resource name, resource group, and subscription.

## Solution 2: Set dependencies

If you get this error when deploying a template, you may need to add a dependency. Resource Manager optimizes deployments by creating resources in parallel, when possible.

For example, when you deploy a web app, the App Service plan must exist. If you haven't specified that the web app depends on the App Service plan, Resource Manager creates both resources at the same time. The web app fails with an error that the App Service plan resource can't be found because it doesn't exist yet. You prevent this error by setting a dependency in the web app.

# [Bicep](#tab/bicep)

Use an [implicit dependency](../bicep/resource-dependencies.md#implicit-dependency) rather than the [resourceId](../bicep/bicep-functions-resource.md#resourceid) function. The dependency is created using a resource's [symbolic name](../bicep/file.md#bicep-format) and ID property.

For example, the web app's `serverFarmId` property uses `servicePlan.id` to create a dependency on the App Service plan.

```bicep
resource webApp 'Microsoft.Web/sites@2022-03-01' = {
  properties: {
    serverFarmId: servicePlan.id
  }
}

resource servicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: hostingPlanName
  ...
```

For most deployments, it's not necessary to use `dependsOn` to create an [explicit dependency](../bicep/resource-dependencies.md#explicit-dependency).

Avoid setting dependencies that aren't needed. Unnecessary dependencies prolong the deployment's duration because resources aren't deployed in parallel. Also, you might create circular dependencies that block the deployment.

# [JSON](#tab/json)

If a resource must be deployed after another resource, use the [dependsOn](../templates/resource-dependency.md#dependson) element in your template.

```json
{
  "type": "Microsoft.Web/sites",
  "apiVersion": "2022-03-01",
  "dependsOn": [
    "[variables('hostingPlanName')]"
  ],
  ...
}
```

Avoid setting dependencies that aren't needed. Unnecessary dependencies prolong the deployment's duration because resources aren't deployed in parallel. Also, you might create circular dependencies that block the deployment.

The [reference](../templates/template-functions-resource.md#reference) and [list*](../templates/template-functions-resource.md#list) functions create an implicit dependency on the referenced resource, when that resource is deployed in the same template and is referenced by its name (not resource ID). Therefore, you may have more dependencies than the dependencies specified in the `dependsOn` property.

The [resourceId](../templates/template-functions-resource.md#resourceid) function doesn't create an implicit dependency or validate that the resource exists. The [reference](../templates/template-functions-resource.md#reference) function and [list*](../templates/template-functions-resource.md#list) functions don't create an implicit dependency when the resource is referred to by its resource ID. To create an implicit dependency, pass the name of the resource that's deployed in the same template.

---

### Deployment order

When you see dependency problems, you need to gain insight into the order of resource deployment. You can use the portal to view the order of deployment operations:

1. Sign in to the [portal](https://portal.azure.com).
1. From the resource group's **Overview**, select the link for the deployment history.

    :::image type="content" source="media/error-not-found/select-deployment.png" alt-text="Screenshot of Azure portal highlighting the link to a resource group's deployment history in the Overview section.":::

1. For the **Deployment name** you want to review, select **Related events**.

    :::image type="content" source="media/error-not-found/select-deployment-events.png" alt-text="Screenshot of Azure portal showing a deployment name with the Related events link highlighted in the deployment history.":::

1. Examine the sequence of events for each resource. Pay attention to the status of each operation and it's time stamp. For example, the following image shows three storage accounts that deployed in parallel. Notice that the three storage account deployments started at the same time.

    :::image type="content" source="media/error-not-found/deployment-events-parallel.png" alt-text="Screenshot of Azure portal activity log displaying three storage accounts deployed in parallel, with their timestamps and statuses.":::

   The next image shows three storage accounts that aren't deployed in parallel. The second storage account depends on the first storage account, and the third storage account depends on the second storage account. The first storage account is labeled **Started**, **Accepted**, and **Succeeded** before the next is started.

    :::image type="content" source="media/error-not-found/deployment-events-sequence.png" alt-text="Screenshot of Azure portal activity log displaying three storage accounts deployed in sequential order, with their timestamps and statuses.":::

## Solution 3: Get external resource

# [Bicep](#tab/bicep)

Bicep uses the symbolic name to create an [implicit dependency](../bicep/resource-dependencies.md#implicit-dependency) on another resource. The [existing](../bicep/existing-resource.md) keyword references a deployed resource. If an existing resource is in a different resource group than the resource you want to deploy, include [scope](../bicep/bicep-functions-scope.md#resource-group-example) and use the [resourceGroup](../bicep/bicep-functions-scope.md#resourcegroup) function.

In this example, a web app is deployed that uses an existing App Service plan from another resource group.

```bicep
resource servicePlan 'Microsoft.Web/serverfarms@2022-03-01' existing = {
  name: hostingPlanName
  scope: resourceGroup(rgname)
}

resource webApp 'Microsoft.Web/sites@2022-03-01' = {
  name: siteName
  properties: {
    serverFarmId: servicePlan.id
  }
}
```

# [JSON](#tab/json)

When deploying a template and you need to get a resource that exists in a different subscription or resource group, use the [resourceId function](../templates/template-functions-resource.md#resourceid). This function returns the fully qualified name of the resource.

The subscription and resource group parameters in the `resourceId` function are optional. If you don't provide them, they default to the current subscription and resource group. When working with a resource in a different resource group or subscription, make sure you provide those values.

The following example gets the resource ID for a resource that exists in a different resource group.

```json
"properties": {
  "name": "[parameters('siteName')]",
  "serverFarmId": "[resourceId('plangroup', 'Microsoft.Web/serverfarms', parameters('hostingPlanName'))]"
}
```

---

## Solution 4: Get managed identity from resource

# [Bicep](#tab/bicep)

If you're deploying a resource with a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md), you must wait until that resource is deployed before retrieving values on the managed identity. Use an [implicit dependency](../bicep/resource-dependencies.md#implicit-dependency) for the resource that the identity is applied to. This approach ensures the resource and the managed identity are deployed before Resource Manager uses the dependency.

You can get the principal ID and tenant ID for a managed identity that's applied to a virtual machine. For example, if a virtual machine resource has a symbolic name of `vm`, use the following syntax:

```bicep
vm.identity.principalId

vm.identity.tenantId
```

# [JSON](#tab/json)

If you're deploying a resource with a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md), you must wait until that resource is deployed before retrieving values on the managed identity. If you pass the managed identity name to the [reference](../templates/template-functions-resource.md#reference) function, Resource Manager attempts to resolve the reference before the resource and identity are deployed. Instead, pass the name of the resource that the identity is applied to. This approach ensures the resource and the managed identity are deployed before Resource Manager resolves the reference function.

In the reference function, use `Full` to get all of the properties including the managed identity.

The pattern is:

`"[reference(resourceId(<resource-provider-namespace>, <resource-name>), <API-version>, 'Full').Identity.propertyName]"`

> [!IMPORTANT]
> Don't use the pattern:
>
> `"[reference(concat(resourceId(<resource-provider-namespace>, <resource-name>),'/providers/Microsoft.ManagedIdentity/Identities/default'),<API-version>).principalId]"`
>
> Your template will fail.

For example, to get the principal ID for a managed identity that is applied to a virtual machine, use:

```json
"[reference(resourceId('Microsoft.Compute/virtualMachines', variables('vmName')), '2022-03-01', 'Full').identity.principalId]",
```

Or, to get the tenant ID for a managed identity that is applied to a virtual machine scale set, use:

```json
"[reference(resourceId('Microsoft.Compute/virtualMachineScaleSets',  variables('vmNodeType0Name')), '2022-03-01', 'Full').Identity.tenantId]"
```

---

## Solution 5: Check functions

# [Bicep](#tab/bicep)

You can use a resource's symbolic name to get values from a resource. You can reference a storage account in the same resource group or another resource group using a symbolic name. To get a value from a deployed resource, use the [existing](../bicep/existing-resource.md) keyword. If a resource is in a different resource group, use `scope` with the [resourceGroup](../bicep/bicep-functions-scope.md#resourcegroup) function. For most cases, the [reference](../bicep/bicep-functions-resource.md#reference) function isn't needed.

The following example references an existing storage account in a different resource group.

```bicep
resource stgAcct 'Microsoft.Storage/storageAccounts@2022-05-01' existing = {
  name: stgname
  scope: resourceGroup(rgname)
}
```

# [JSON](#tab/json)

When you deploy a template, look for expressions that use the [reference](../templates/template-functions-resource.md#reference) or [listKeys](../templates/template-functions-resource.md#listkeys) functions. The values you provide vary based on whether the resource is in the same template, resource group, and subscription. Check that you're providing the required parameter values for your scenario. If the resource is in a different resource group, provide the full resource ID. For example, to reference a storage account in another resource group, use:

```json
"[reference(resourceId('exampleResourceGroup', 'Microsoft.Storage/storageAccounts', 'myStorage'), '2022-05-01')]"
```

---

## Solution 6: After deleting resource

When you delete a resource, there might be a short amount of time when the resource appears in the portal but isn't available. If you select the resource, you'll get an error that the resource is **Not found**.

:::image type="content" source="media/error-not-found/resource-not-found-portal.png" alt-text="Screenshot of Azure portal showing a deleted resource with a 'Not found' error message in the resource's Overview section.":::

Refresh the portal and the deleted resource should be removed from your list of available resources. If a deleted resource continues to be shown as available for more than a few minutes, [contact support](https://azure.microsoft.com/support/options/).
