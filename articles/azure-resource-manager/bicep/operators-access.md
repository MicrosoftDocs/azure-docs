---
title: Bicep access operators
description: Describes Bicep resource access operator and property access operator.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 07/22/2021
---

# Bicep access operators

The access operators are used to access properties of objects and resources. To run the examples, use Azure CLI or Azure PowerShell to [deploy a Bicep file](./quickstart-create-bicep-use-visual-studio-code.md#deploy-the-bicep-file).

| Operator | Name |
| ---- | ---- |
| `.` | [Nested resource accessor](#nested-resource-accessor) |
| `.`  | [Property accessor](#property-accessor) |

## Nested resource accessor

`<resource-symbolic-name>.<property-name>`

Nested resource accessors are used to access resources that are declared inside another resource. The symbolic name declared by a nested resource can normally only be referenced within the body of the containing resource. To reference a nested resource outside the containing resource, it must be qualified with the containing resource name and the [::](./child-resource-name-type.md) operator. Other resources declared within the same containing resource can use the name without qualification.

### Example

```bicep
resource myParent 'My.Rp/parentType@2020-01-01' = {
  name: 'myParent'
  location: 'West US'

  // declares a nested resource inside 'myParent'
  resource myChild 'childType' = {
    name: 'myChild'
    properties: {
      displayName: 'Child Resource'
    }
  }

  // 'myChild' can be referenced inside the body of 'myParent'
  resource mySibling 'childType' = {
    name: 'mySibling'
    properties: {
      displayName: 'Sibling of ${myChild.properties.displayName}'
    }
  }
}

// accessing 'myChild' here requires the resource access operator
output displayName string = myParent::myChild.properties.displayName
```

Because the declaration of `myChild` is contained within `myParent`, the access to `myChild`'s properties must be qualified with `myParent::`.

## Property accessor

`<object-name>.<property-name>`

Property accessors are used to access properties of an object. Property accessors can be used with any object, including parameters and variables of object types and object literals. Using a property accessor on an expression of non-object type is an error.

### Example

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

## Next steps

- To create a Bicep file, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
- For information about how to resolve Bicep type errors, see [Any function for Bicep](./bicep-functions-any.md).
- To compare syntax for Bicep and JSON, see [Comparing JSON and Bicep for templates](./compare-template-syntax.md).
- For examples of Bicep functions, see [Bicep functions](./bicep-functions.md).
