---
title: Set deployment order for resources
description: Describes how to set one Azure resource as dependent on another resource during deployment. The dependencies ensure resources are deployed in the correct order.
ms.topic: conceptual
ms.date: 12/21/2020
---

# Define the order for deploying resources in ARM templates

When deploying resources, you may need to make sure some resources exist before other resources. For example, you need a logical SQL server before deploying a database. You establish this relationship by marking one resource as dependent on the other resource. Use the `dependsOn` element to define an explicit dependency. Use the **reference** or **list** functions to define an implicit dependency.

Azure Resource Manager evaluates the dependencies between resources, and deploys them in their dependent order. When resources aren't dependent on each other, Resource Manager deploys them in parallel. You only need to define dependencies for resources that are deployed in the same template.

## dependsOn

Within your Azure Resource Manager template (ARM template), the `dependsOn` element enables you to define one resource as a dependent on one or more resources. Its value is a JavaScript Object Notation (JSON) array of strings, each of which is a resource name or ID. The array can include resources that are [conditionally deployed](conditional-resource-deployment.md). When a conditional resource isn't deployed, Azure Resource Manager automatically removes it from the required dependencies.

The following example shows a network interface that depends on a virtual network, network security group, and public IP address. For the full template, see [the quickstart template for a Linux VM](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/vm-simple-linux/azuredeploy.json).

```json
{
    "type": "Microsoft.Network/networkInterfaces",
    "apiVersion": "2020-06-01",
    "name": "[variables('networkInterfaceName')]",
    "location": "[parameters('location')]",
    "dependsOn": [
      "[resourceId('Microsoft.Network/networkSecurityGroups/', parameters('networkSecurityGroupName'))]",
      "[resourceId('Microsoft.Network/virtualNetworks/', parameters('virtualNetworkName'))]",
      "[resourceId('Microsoft.Network/publicIpAddresses/', variables('publicIpAddressName'))]"
    ],
    ...
}
```

While you may be inclined to use `dependsOn` to map relationships between your resources, it's important to understand why you're doing it. For example, to document how resources are interconnected, `dependsOn` isn't the right approach. You can't query which resources were defined in the `dependsOn` element after deployment. Setting unnecessary dependencies slows deployment time because Resource Manager can't deploy those resources in parallel.

## Child resources

An implicit deployment dependency isn't automatically created between a [child resource](child-resource-name-type.md) and the parent resource. If you need to deploy the child resource after the parent resource, set the `dependsOn` property.

The following example shows a logical SQL server and database. Notice that an explicit dependency is defined between the database and the server, even though the database is a child of the server.

```json
"resources": [
  {
    "type": "Microsoft.Sql/servers",
    "apiVersion": "2020-02-02-preview",
    "name": "[parameters('serverName')]",
    "location": "[parameters('location')]",
    "properties": {
      "administratorLogin": "[parameters('administratorLogin')]",
      "administratorLoginPassword": "[parameters('administratorLoginPassword')]"
    },
    "resources": [
      {
        "type": "databases",
        "apiVersion": "2020-08-01-preview",
        "name": "[parameters('sqlDBName')]",
        "location": "[parameters('location')]",
        "sku": {
          "name": "Standard",
          "tier": "Standard"
          },
        "dependsOn": [
          "[resourceId('Microsoft.Sql/servers', concat(parameters('serverName')))]"
        ]
      }
    ]
  }
]
```

For the full template, see [quickstart template for Azure SQL Database](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.sql/sql-database/azuredeploy.json).

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

For information about assessing the deployment order and resolving dependency errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](common-deployment-errors.md).

## Next steps

* To go through a tutorial, see [Tutorial: Create ARM templates with dependent resources](template-tutorial-create-templates-with-dependent-resources.md).
* For a Microsoft Learn module that covers resource dependencies, see [Manage complex cloud deployments by using advanced ARM template features](/learn/modules/manage-deployments-advanced-arm-template-features/).
* For recommendations when setting dependencies, see [ARM template best practices](./best-practices.md).
* To learn about troubleshooting dependencies during deployment, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](common-deployment-errors.md).
* To learn about creating Azure Resource Manager templates, see [Understand the structure and syntax of ARM templates](./syntax.md).
* For a list of the available functions in a template, see [ARM template functions](template-functions.md).