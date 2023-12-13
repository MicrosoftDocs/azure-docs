---
title: Compare syntax for Azure Resource Manager templates in JSON and Bicep
description: Compares Azure Resource Manager templates developed with JSON and Bicep, and shows how to convert between the languages.
ms.topic: conceptual
ms.custom: devx-track-bicep, devx-track-arm-template
ms.date: 06/23/2023
---

# Comparing JSON and Bicep for templates

This article compares Bicep syntax with JSON syntax for Azure Resource Manager templates (ARM templates). In most cases, Bicep provides syntax that is less verbose than the equivalent in JSON.

If you're familiar with using JSON to develop ARM templates, use the following examples to learn about the equivalent syntax for Bicep.

## Compare complete files

The [Bicep Playground](https://aka.ms/bicepdemo) lets you view Bicep and equivalent JSON side by side. You can compare the implementations of the same infrastructure.

For example, you can view the file to deploy a [SQL server and database](https://aka.ms/bicepdemo#eJx1kctqwzAQRff+Ci0KsqF+JIvSGgohBLppS8FfMLUnQdSW5JGcLIL/vfJDaRrinebq3tGckQaChhmkI9InNMiMJSEP7JV1UrQdFmMZctPW/JERGtVRiW+kOh1GiaiiQE8d2nq3/d+AF9DoGndbPntqVYIVSv5Zbvt5xxyAqhFSODdYRe/qIHw0CDYGy44wjBatX2DMSVF1ifjHZlrGP0RJyqi9TYq2TifVbNbZ6iXOnuJsFWvCo8ATd5OeA8akw8uvduUkP3B+OTlRk9JIVqDJxxy7M11+R1uwepB7EX/non3QXzMO/7GAmFZg4RsMDrDrLM6eF2H5w3kKJUPdp670H93zJX7z03nwuUthQVZAFR9Ftxm6EYfhfwGNyOE5). The Bicep is about half the size of the ARM template.

:::image type="content" source="./media/compare-template-syntax/side-by-side.png" alt-text="Screenshot of side by side templates" link="https://aka.ms/bicepdemo#eJx1kctqwzAQRff+Ci0KsqF+JIvSGgohBLppS8FfMLUnQdSW5JGcLIL/vfJDaRrinebq3tGckQaChhmkI9InNMiMJSEP7JV1UrQdFmMZctPW/JERGtVRiW+kOh1GiaiiQE8d2nq3/d+AF9DoGndbPntqVYIVSv5Zbvt5xxyAqhFSODdYRe/qIHw0CDYGy44wjBatX2DMSVF1ifjHZlrGP0RJyqi9TYq2TifVbNbZ6iXOnuJsFWvCo8ATd5OeA8akw8uvduUkP3B+OTlRk9JIVqDJxxy7M11+R1uwepB7EX/non3QXzMO/7GAmFZg4RsMDrDrLM6eF2H5w3kKJUPdp670H93zJX7z03nwuUthQVZAFR9Ftxm6EYfhfwGNyOE5":::

## Expressions

To author an expression:

```bicep
func()
```

```json
"[func()]"
```

## Parameters

To declare a parameter with a default value:

```bicep
param orgName string = 'Contoso'
```

```json
"parameters": {
  "orgName": {
    "type": "string",
    "defaultValue": "Contoso"
  }
}
```

To get a parameter value, use the name you defined:

```bicep
name: orgName
```

```json
"name": "[parameters('orgName'))]"
```

## Variables

To declare a variable:

```bicep
var description = 'example value'
```

```json
"variables": {
  "description": "example value"
},
```

To get a variable value, use the name you defined:

```bicep
workloadSetting: description
```

```json
"workloadSetting": "[variables('description'))]"
```

## Strings

To concatenate strings:

```bicep
name: '${namePrefix}-vm'
```

```json
"name": "[concat(parameters('namePrefix'), '-vm')]"
```

## Logical operators

To return the logical **AND**:

```bicep
isMonday && isNovember
```

```json
[and(parameter('isMonday'), parameter('isNovember'))]
```

To conditionally set a value:

```bicep
isMonday ? 'valueIfTrue' : 'valueIfFalse'
```

```json
[if(parameters('isMonday'), 'valueIfTrue', 'valueIfFalse')]
```

## Deployment scope

To set the target scope of the deployment:

```bicep
targetScope = 'subscription'
```

```json
"$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#"
```

## Resources

To declare a resource:

```bicep
resource virtualMachine 'Microsoft.Compute/virtualMachines@2023-03-01' = {
  ...
}
```

```json
"resources": [
  {
    "type": "Microsoft.Compute/virtualMachines",
    "apiVersion": "2020-06-01",
    ...
  }
]
```

To conditionally deploy a resource:

```bicep
resource virtualMachine 'Microsoft.Compute/virtualMachines@2023-03-01' = if(deployVM) {
  ...
}
```

```json
"resources": [
  {
    "condition": "[parameters('deployVM')]",
    "type": "Microsoft.Compute/virtualMachines",
    "apiVersion": "2023-03-01",
    ...
  }
]
```

To set a resource property:

```bicep
sku: '2016-Datacenter'
```

```json
"sku": "2016-Datacenter",
```

To get the resource ID of a resource in the template:

```bicep
nic1.id
```

```json
[resourceId('Microsoft.Network/networkInterfaces', variables('nic1Name'))]
```

## Loops

To iterate over items in an array or count:

```bicep
[for storageName in storageAccountNames: {
  ...
}]
```

```json
"copy": {
  "name": "storagecopy",
  "count": "[length(parameters('storageAccountNames'))]"
},
...
```

## Resource dependencies

For Bicep, you can set an explicit dependency but this approach isn't recommended. Instead, rely on implicit dependencies. An implicit dependency is created when one resource declaration references the identifier of another resource.

The following shows a network interface with an implicit dependency on a network security group. It references the network security group with `netSecurityGroup.id`.

```bicep
resource netSecurityGroup 'Microsoft.Network/networkSecurityGroups@2022-11-01' = {
  ...
}

resource nic1 'Microsoft.Network/networkInterfaces@2022-11-01' = {
  name: nic1Name
  location: location
  properties: {
    ...
    networkSecurityGroup: {
      id: netSecurityGroup.id
    }
  }
}
```

If you must set an explicit dependence, use:

```bicep
dependsOn: [ storageAccount ]
```

```json
"dependsOn": ["[resourceId('Microsoft.Storage/storageAccounts', 'parameters('storageAccountName'))]"]
```

## Reference resources

To get a property from a resource in the template:

```bicep
storageAccount.properties.primaryEndpoints.blob
```

```json
[reference(resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))).primaryEndpoints.blob]
```

To get a property from an existing resource that isn't deployed in the template:

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' existing = {
  name: storageAccountName
}

// use later in template as often as needed
storageAccount.properties.primaryEndpoints.blob
```

```json
// required every time the property is needed
"[reference(resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName')), '2019-06-01').primaryEndpoints.blob]"
```

In Bicep, use the [nested accessor](operators-access.md#nested-resource-accessor) (`::`) to get a property on a resource nested within a parent resource:

```bicep
VNet1::Subnet1.properties.addressPrefix
```

For JSON, use reference function:

```json
[reference(resourceId('Microsoft.Network/virtualNetworks/subnets', variables('subnetName'))).properties.addressPrefix]
```

## Outputs

To output a property from a resource in the template:

```bicep
output hostname string = publicIP.properties.dnsSettings.fqdn
```

```json
"outputs": {
  "hostname": {
    "type": "string",
    "value": "[reference(resourceId('Microsoft.Network/publicIPAddresses', variables('publicIPAddressName'))).dnsSettings.fqdn]"
  },
}
```

To conditionally output a value:

```bicep
output hostname string = condition ? publicIP.properties.dnsSettings.fqdn : ''
```

```json
"outputs": {
  "hostname": {
    "condition": "[variables('condition')]",
    "type": "string",
    "value": "[reference(resourceId('Microsoft.Network/publicIPAddresses', variables('publicIPAddressName'))).dnsSettings.fqdn]"
  }
}
```

The Bicep ternary operator is the equivalent to the [if function](../templates/template-functions-logical.md#if) in an ARM template JSON, not the condition property. The ternary syntax has to evaluate to one value or the other. If the condition is false in the preceding samples, Bicep outputs a hostname with an empty string, but JSON outputs no values.

## Code reuse

To separate a solution into multiple files:

* For Bicep, use [modules](modules.md).
* For ARM templates, use [linked templates](../templates/linked-templates.md).

## Next steps

* For information about the Bicep, see [Bicep quickstart](./quickstart-create-bicep-use-visual-studio-code.md).
* To learn about converting templates between the languages, see [Converting ARM templates between JSON and Bicep](decompile.md).
