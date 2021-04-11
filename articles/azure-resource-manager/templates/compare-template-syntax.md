---
title: Compare syntax for Azure Resource Manager templates in JSON and Bicep
description: Compares Azure Resource Manager templates developed with JSON and Bicep, and shows how to convert between the languages.
ms.topic: conceptual
ms.date: 03/12/2021
---
# Comparing JSON and Bicep for templates

This article compares Bicep syntax with JSON syntax for Azure Resource Manager templates (ARM templates). In most cases, Bicep provides syntax that is less verbose than the equivalent in JSON.

If you're familiar with using JSON to develop ARM templates, use the following examples to learn about the equivalent syntax for Bicep.

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
param demoParam string = 'Contoso'
```

```json
"parameters": {
  "demoParam": {
    "type": "string",
    "defaultValue": "Contoso"
  }
}
```

To get a parameter value:

```bicep
demoParam
```

```json
[parameters('demoParam'))]
```

## Variables

To declare a variable:

```bicep
var demoVar = 'example value'
```

```json
"variables": {
  "demoVar": "example value"
},
```

To get a variable value:

```bicep
demoVar
```

```json
[variables('demoVar'))]
```

## Strings

To concatenate strings:

```bicep
'${namePrefix}-vm'
```

```json
[concat(parameters('namePrefix'), '-vm')]
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
resource vm 'Microsoft.Compute/virtualMachines@2020-06-01' = {
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
resource vm 'Microsoft.Compute/virtualMachines@2020-06-01' = if(deployVM) {
  ...
}
```

```json
"resources": [ 
  {
    "condition": "[parameters('deployVM')]",
    "type": "Microsoft.Compute/virtualMachines", 
    "apiVersion": "2020-06-01", 
    ... 
  } 
]
```

To set resource property:

```bicep
sku: '2016-Datacenter'
```

```json
"sku": "2016-Datacenter",
```

To get resource ID of resource in the template:

```bicep
nic1.id
```

```json
[resourceId('Microsoft.Network/networkInterfaces', variables('nic1Name'))]
```

## Loops

To iterate over items in an array or count:

```bicep
[for storageName in storageAccounts: {
  ...
}]
```

```json
"copy": {
  "name": "storagecopy",
  "count": "[length(parameters('storageAccounts'))]"
},
...
```

## Resource dependencies

To set dependency between resources:

For Bicep, either rely on automatic detection of dependencies or manually set dependency.

```bicep
dependsOn: [ stg ]
```

```json
"dependsOn": ["[resourceId('Microsoft.Storage/storageAccounts', 'parameters('storageAccountName'))]"]
```

## Reference resources

To get a property from a resource in the template:

```bicep
diagsAccount.properties.primaryEndpoints.blob
```

```json
[reference(resourceId('Microsoft.Storage/storageAccounts', variables('diagStorageAccountName'))).primaryEndpoints.blob]
```

To get a property from an existing resource that isn't deployed in the template:

```bicep
resource stg 'Microsoft.Storage/storageAccounts@2019-06-01' existing = {
  name: storageAccountName
}

// use later in template as often as needed
stg.properties.primaryEndpoints.blob
```

```json
// required every time the property is needed
"[reference(resourceId('Microsoft.Storage/storageAccounts/', parameters('storageAccountName')), '2019-06-01').primaryEndpoints.blob]"
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

## Code reuse

To separate a solution into multiple files:

* For Bicep, use [modules](bicep-tutorial-add-modules.md).
* For JSON, use [linked templates](linked-templates.md).

## Recommendations

* When possible, avoid using the [reference](template-functions-resource.md#reference) and [resourceId](template-functions-resource.md#resourceid) functions in your Bicep file. When you reference a resource in the same Bicep deployment, use the resource identifier instead. For example, if you've deployed a resource in your Bicep file with `stg` as the resource identifier, use syntax like `stg.id` or `stg.properties.primaryEndpoints.blob` to get property values. By using the resource identifier, you create an implicit dependency between resources. You don't need to explicitly set the dependency with the dependsOn property.
* If the resource isn't deployed in the Bicep file, you can still get a symbolic reference to the resource using the **existing** keyword.
* Use consistent casing for identifiers. If you're unsure what type of casing to use, try camel casing. For example, `param myCamelCasedParameter string`.
* Add a description to a parameter only when the description provides essential information to users. You can use `//` comments for some information.

## Next steps

* For information about the Bicep, see [Bicep tutorial](./bicep-tutorial-create-first-bicep.md).
* To learn about converting templates between the languages, see [Converting ARM templates between JSON and Bicep](bicep-decompile.md).
