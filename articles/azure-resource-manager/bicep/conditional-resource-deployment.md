---
title: Conditional deployment with Bicep
description: Describes how to conditionally deploy a resource in Bicep.

author: mumian
ms.author: jgao
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 10/20/2023
---

# Conditional deployments in Bicep with the if expression

To optionally deploy a resource or module in Bicep, use the `if` expression. An `if` expression includes a condition that resolves to true or false. When the `if` condition is true, the resource is deployed. When the value is false, the resource isn't created. The value can only be applied to the whole resource or module.

> [!NOTE]
> Conditional deployment doesn't cascade to [child resources](child-resource-name-type.md). If you want to conditionally deploy a resource and its child resources, you must apply the same condition to each resource type.

### Training resources

If you would rather learn about conditions through step-by-step guidance, see [Build flexible Bicep templates by using conditions and loops](/training/modules/build-flexible-bicep-templates-conditions-loops/).

## Define condition for deployment

In Bicep, you can conditionally deploy a resource by passing in a parameter that specifies whether the resource is deployed. You test the condition with an `if` expression in the resource declaration. The following example shows the syntax for an `if` expression in a Bicep file. It conditionally deploys a DNS zone. When `deployZone` is `true`, it deploys the DNS zone. When `deployZone` is `false`, it skips deploying the DNS zone.

```bicep
param deployZone bool

resource dnsZone 'Microsoft.Network/dnszones@2018-05-01' = if (deployZone) {
  name: 'myZone'
  location: 'global'
}
```

The next example conditionally deploys a module.

```bicep
param deployZone bool

module dnsZone 'dnszones.bicep' = if (deployZone) {
  name: 'myZoneModule'
}
```

Conditions may be used with dependency declarations. For [explicit dependencies](resource-dependencies.md), Azure Resource Manager automatically removes it from the required dependencies when the resource isn't deployed. For implicit dependencies, referencing a property of a conditional resource is allowed but may produce a deployment error.

## New or existing resource

You can use conditional deployment to create a new resource or use an existing one. The following example shows how to either deploy a new storage account or use an existing storage account.

```bicep
param storageAccountName string
param location string = resourceGroup().location

@allowed([
  'new'
  'existing'
])
param newOrExisting string = 'new'

resource saNew 'Microsoft.Storage/storageAccounts@2022-09-01' = if (newOrExisting == 'new') {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

resource saExisting 'Microsoft.Storage/storageAccounts@2022-09-01' existing = if (newOrExisting == 'existing') {
  name: storageAccountName
}

output storageAccountId string = ((newOrExisting == 'new') ? saNew.id : saExisting.id)
```

When the parameter `newOrExisting` is set to **new**, the condition evaluates to true. The storage account is deployed. Otherwise the existing storage account is used.

> [!WARNING]
> If you reference a conditionally-deployed resource that is not deployed. You will get an error saying the resource is not defined in the template.

## Runtime functions

If you use a [reference](./bicep-functions-resource.md#reference) or [list](./bicep-functions-resource.md#list) function with a resource that is conditionally deployed, the function is evaluated even if the resource isn't deployed. You get an error if the function refers to a resource that doesn't exist.

Use the [conditional expression ?:](./operators-logical.md#conditional-expression--) operator to make sure the function is only evaluated for conditions when the resource is deployed. The following example template shows how to use this function with expressions that are only conditionally valid.

```bicep
param vmName string
param location string
param logAnalytics string = ''

resource vmName_omsOnboarding 'Microsoft.Compute/virtualMachines/extensions@2023-03-01' = if (!empty(logAnalytics)) {
  name: '${vmName}/omsOnboarding'
  location: location
  properties: {
    publisher: 'Microsoft.EnterpriseCloud.Monitoring'
    type: 'MicrosoftMonitoringAgent'
    typeHandlerVersion: '1.0'
    autoUpgradeMinorVersion: true
    settings: {
      workspaceId: ((!empty(logAnalytics)) ? reference(logAnalytics, '2022-10-01').customerId : null)
    }
    protectedSettings: {
      workspaceKey: ((!empty(logAnalytics)) ? listKeys(logAnalytics, '2022-10-01').primarySharedKey : null)
    }
  }
}

output mgmtStatus string = ((!empty(logAnalytics)) ? 'Enabled monitoring for VM!' : 'Nothing to enable')
```

## Next steps

* Review the Learn module [Build flexible Bicep templates by using conditions and loops](/training/modules/build-flexible-bicep-templates-conditions-loops/).
* For recommendations about creating Bicep files, see [Best practices for Bicep](best-practices.md).
* To create multiple instances of a resource, see [Iterative loops in Bicep](loops.md).
