---
title: Set deployment order for resources in Bicep
description: Describes how to set one Azure resource as dependent on another resource in Bicep. The dependencies ensure resources are deployed in the correct order.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 05/20/2021
---

# Define the order for deploying resources in Bicep

When deploying resources, you may need to make sure some resources exist before other resources. For example, you need a logical SQL server before deploying a database. You establish this relationship by marking one .resource as dependent on the other resource. Order of resource deployment can be influenced in two ways: [implicit dependency](#implicit-dependency) and [explicit dependency](#explicit-dependency)

Azure Resource Manager evaluates the dependencies between resources, and deploys them in their dependent order. When resources aren't dependent on each other, Resource Manager deploys them in parallel. You only need to define dependencies for resources that are deployed in the same Bicep file.

## Implicit dependency

An implicit dependency is created when one resource declaration references the identifier of another resource declaration in an expression. For example, *dnsZone* is referenced by the second resource definition in the following example:

```bicep
resource dnsZone 'Microsoft.Network/dnszones@2018-05-01' = {
  name: 'myZone'
  location: 'global'
}

resource otherResource 'Microsoft.Example/examples@2020-06-01' = {
  name: 'exampleResource'
  properties: {
    // get read-only DNS zone property
    nameServers: dnsZone.properties.nameServers
  }
}
```


A nested resource also has an implicit dependency on its containing resource.

```bicep
resource myParent 'My.Rp/parentType@2020-01-01' = {
  name: 'myParent'
  location: 'West US'

  // depends on 'myParent' implicitly
  resource myChild 'childType' = {
    name: 'myChild'
  }
}
```

For more information, see [Set name and type for child resources in Bicep](./child-resource-name-type.md).

## Explicit dependency

An explicit dependency is declared via the `dependsOn` property within the resource declaration. The property accept an array of resource identifiers. Here is an example of one DNS zone depending on another explicitly:

```bicep
resource dnsZone 'Microsoft.Network/dnszones@2018-05-01' = {
  name: 'myZone'
  location: 'global'
}

resource otherZone 'Microsoft.Network/dnszones@2018-05-01' = {
  name: 'myZone'
  location: 'global'
  dependsOn: [
    dnsZone
  ]
}
```

While you may be inclined to use `dependsOn` to map relationships between your resources, it's important to understand why you're doing it. For example, to document how resources are interconnected, `dependsOn` isn't the right approach. You can't query which resources were defined in the `dependsOn` element after deployment. Setting unnecessary dependencies slows deployment time because Resource Manager can't deploy those resources in parallel.

Even though explicit dependencies are sometimes required, the need for them is rare. In most cases you have a symbolic reference available to imply the dependency between resources. If you find yourself using dependsOn you should consider if there is a way to get rid of it.

## reference and list functions

The [reference function](template-functions-resource.md#reference) enables an expression to derive its value from other JSON name and value pairs or runtime resources. The [list* functions](template-functions-resource.md#list) return values for a resource from a list operation.

Reference and list expressions implicitly declare that one resource depends on another. Whenever possible, use an implicit reference to avoid adding an unnecessary dependency.

To enforce an implicit dependency, refer to the resource by name, not resource ID. If you pass the resource ID into the reference or list functions, an implicit reference isn't created.

The general format of the `reference` function is:

```json
reference('resourceName').propertyPath
```

The general format of the `listKeys` function is:

```json
listKeys('resourceName', 'yyyy-mm-dd')
```

In the following example, a CDN endpoint explicitly depends on the CDN profile, and implicitly depends on a web app.

```json
{
    "name": "[variables('endpointName')]",
    "apiVersion": "2016-04-02",
    "type": "endpoints",
    "location": "[resourceGroup().location]",
    "dependsOn": [
      "[variables('profileName')]"
    ],
    "properties": {
      "originHostHeader": "[reference(variables('webAppName')).hostNames[0]]",
      ...
    }
```

To learn more, see [reference function](template-functions-resource.md#reference).

## Depend on resources in a loop

To deploy resources that depend on resources in a [copy loop](copy-resources.md), you have two options. You can either set a dependency on individual resources in the loop or on the whole loop.

> [!NOTE]
> For most scenarios, you should set the dependency on individual resources within the copy loop. Only depend on the whole loop when you need all of the resources in the loop to exist before creating the next resource. Setting the dependency on the whole loop causes the dependencies graph to expand significantly, especially if those looped resources depend on other resources. The expanded dependencies make it difficult for the deployment to complete efficiently.

The following example shows how to deploy multiple virtual machines. The template creates the same number of network interfaces. Each virtual machine is dependent on one network interface, rather than the whole loop.

```json
{
  "type": "Microsoft.Network/networkInterfaces",
  "apiVersion": "2020-05-01",
  "name": "[concat(variables('nicPrefix'),'-',copyIndex())]",
  "location": "[parameters('location')]",
  "copy": {
    "name": "nicCopy",
    "count": "[parameters('vmCount')]"
  },
  ...
},
{
  "type": "Microsoft.Compute/virtualMachines",
  "apiVersion": "2020-06-01",
  "name": "[concat(variables('vmPrefix'),copyIndex())]",
  "location": "[parameters('location')]",
  "dependsOn": [
    "[resourceId('Microsoft.Network/networkInterfaces',concat(variables('nicPrefix'),'-',copyIndex()))]"
  ],
  "copy": {
    "name": "vmCopy",
    "count": "[parameters('vmCount')]"
  },
  "properties": {
    "networkProfile": {
      "networkInterfaces": [
        {
          "id": "[resourceId('Microsoft.Network/networkInterfaces',concat(variables('nicPrefix'),'-',copyIndex()))]",
          "properties": {
            "primary": "true"
          }
        }
      ]
    },
    ...
  }
}
```

The following example shows how to deploy three storage accounts before deploying the virtual machine. Notice that the `copy` element has `name` set to `storagecopy` and the `dependsOn` element for the virtual machine is also set to `storagecopy`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2019-04-01",
      "name": "[concat(copyIndex(),'storage', uniqueString(resourceGroup().id))]",
      "location": "[resourceGroup().location]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "copy": {
        "name": "storagecopy",
        "count": 3
      },
      "properties": {}
    },
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2015-06-15",
      "name": "[concat('VM', uniqueString(resourceGroup().id))]",
      "dependsOn": ["storagecopy"],
      ...
    }
  ],
  "outputs": {}
}
```

## Circular dependencies

Resource Manager identifies circular dependencies during template validation. If you receive an error for a circular dependency, evaluate your template to see if any dependencies can be removed. If removing dependencies doesn't work, you can avoid circular dependencies by moving some deployment operations into child resources. Deploy the child resources after the resources that have the circular dependency. For example, suppose you're deploying two virtual machines but you must set properties on each one that refer to the other. You can deploy them in the following order:

1. vm1
2. vm2
3. Extension on vm1 depends on vm1 and vm2. The extension sets values on vm1 that it gets from vm2.
4. Extension on vm2 depends on vm1 and vm2. The extension sets values on vm2 that it gets from vm1.

For information about assessing the deployment order and resolving dependency errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](../templates/common-deployment-errors.md).

## Next steps

* To go through a tutorial, see [Tutorial: Create ARM templates with dependent resources](../templates/template-tutorial-create-templates-with-dependent-resources.md).
* For a Microsoft Learn module that covers resource dependencies, see [Manage complex cloud deployments by using advanced ARM template features](/learn/modules/manage-deployments-advanced-arm-template-features/).
* For recommendations when setting dependencies, see [ARM template best practices](../templates/template-best-practices.md).
* To learn about troubleshooting dependencies during deployment, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](../templates/common-deployment-errors.md).
* To learn about creating Azure Resource Manager templates, see [Understand the structure and syntax of ARM templates](../templates/template-syntax.md).
* For a list of the available functions in a template, see [ARM template functions](template-functions.md).
