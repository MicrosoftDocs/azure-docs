---
title: Bicep accessor operators
description: Describes Bicep resource access operator and property access operator.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/23/2023
---

# Bicep accessor operators

The accessor operators are used to access child resources, properties on objects, and elements in an array. You can also use the property accessor to use some functions.

| Operator | Name |
| ---- | ---- |
| `[]` | [Index accessor](#index-accessor) |
| `.`  | [Function accessor](#function-accessor) |
| `::` | [Nested resource accessor](#nested-resource-accessor) |
| `.`  | [Property accessor](#property-accessor) |

## Index accessor

`array[integerIndex]`

`object['stringIndex']`

Use the index accessor to get either an element from an array or a property from an object.

For an **array**, provide the index as an **integer**. The integer matches the zero-based position of the element to retrieve.

For an **object**, provide the index as a **string**. The string matches the name of the object to retrieve.

The following example gets an element in an array.

```bicep
var arrayVar = [
  'Coho'
  'Contoso'
  'Fabrikan'
]

output accessorResult string = arrayVar[1]
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| accessorResult | string | 'Contoso' |

The next example gets a property on an object.

```bicep
var environmentSettings = {
  dev: {
    name: 'Development'
  }
  prod: {
    name: 'Production'
  }
}

output accessorResult string = environmentSettings['dev'].name
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| accessorResult | string | 'Development' |

## Function accessor

`resourceName.functionName()`

Two functions - [getSecret](bicep-functions-resource.md#getsecret) and [list*](bicep-functions-resource.md#list) - support the accessor operator for calling the function. These two functions are the only functions that support the accessor operator.

### Example

The following example references an existing key vault, then uses `getSecret` to pass a secret to a module.

```bicep
resource kv 'Microsoft.KeyVault/vaults@2023-02-01' existing = {
  name: kvName
  scope: resourceGroup(subscriptionId, kvResourceGroup )
}

module sql './sql.bicep' = {
  name: 'deploySQL'
  params: {
    sqlServerName: sqlServerName
    adminLogin: adminLogin
    adminPassword: kv.getSecret('vmAdminPassword')
  }
}
```

## Nested resource accessor

`parentResource::nestedResource`

A nested resource is a resource that is declared within another resource. Use the nested resource accessor `::` to access that nested resources from outside of the parent resource.

Within the parent resource, you reference the nested resource with just the symbolic name. You only need to use the nested resource accessor when referencing the nested resource from outside of the parent resource.

### Example

The following example shows how to reference a nested resource from within the parent resource and from outside of the parent resource.

```bicep
resource demoParent 'demo.Rp/parentType@2023-01-01' = {
  name: 'demoParent'
  location: 'West US'

  // Declare a nested resource within 'demoParent'
  resource demoNested 'childType' = {
    name: 'demoNested'
    properties: {
      displayName: 'The nested instance.'
    }
  }

  // Declare another nested resource
  resource demoSibling 'childType' = {
    name: 'demoSibling'
    properties: {
      // Use symbolic name to reference because this line is within demoParent
      displayName: 'Sibling of ${demoNested.properties.displayName}'
    }
  }
}

// Use nested accessor to reference because this line is outside of demoParent
output displayName string = demoParent::demoNested.properties.displayName
```

## Property accessor

`objectName.propertyName`

Use property accessors to access properties of an object. Property accessors can be used with any object, including parameters and variables that are objects. You get an error when you use the property access on an expression that isn't an object.

### Example

The following example shows an object variable and how to access the properties.

```bicep
var x = {
  y: {
    z: 'Hello'
    a: true
  }
  q: 42
}

output outputZ string = x.y.z
output outputQ int = x.q
```

Output from the example:

| Name | Type | Value |
| ---- | ---- | ---- |
| `outputZ` | string | 'Hello' |
| `outputQ` | integer | 42 |

Typically, you use the property accessor with a resource deployed in the Bicep file. The following example creates a public IP address and uses property accessors to return a value from the deployed resource.

```bicep
resource publicIp 'Microsoft.Network/publicIPAddresses@2022-11-01' = {
  name: publicIpResourceName
  location: location
  properties: {
    publicIPAllocationMethod: dynamicAllocation ? 'Dynamic' : 'Static'
    dnsSettings: {
      domainNameLabel: publicIpDnsLabel
    }
  }
}

// Use property accessor to get value
output ipFqdn string = publicIp.properties.dnsSettings.fqdn
```

## Next steps

- To run the examples, use Azure CLI or Azure PowerShell to [deploy a Bicep file](./quickstart-create-bicep-use-visual-studio-code.md#deploy-the-bicep-file).
- To create a Bicep file, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
- For information about how to resolve Bicep type errors, see [Any function for Bicep](./bicep-functions-any.md).
