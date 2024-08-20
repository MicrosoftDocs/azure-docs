---
title: User-defined types in Bicep
description: Describes how to define and use user-defined data types in Bicep.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 08/16/2024
---

# User-defined data types in Bicep

Learn how to create user-defined data types in Bicep. For system-defined data types, see [Data types](./data-types.md).

[Bicep CLI version 0.12.X or higher](./install.md) is required to use this feature.

## Syntax

You can use the `type` statement to create user-defined data types. In addition, you can also use type expressions in some places to define custom types.

```bicep
type <user-defined-data-type-name> = <type-expression>
```

The [`@allowed`](./parameters.md#decorators) decorator is only permitted on [`param` statements](./parameters.md). To declare a type with a set of predefined values in a `type`, use [union type syntax](./data-types.md#union-types). 

The valid type expressions include:

- Symbolic references are identifiers that refer to an *ambient* type (like `string` or `int`) or a user-defined type symbol declared in a `type` statement:

    ```bicep
    // Bicep data type reference
    type myStringType = string

    // user-defined type reference
    type myOtherStringType = myStringType
    ```

- Primitive literals, including strings, integers, and booleans, are valid type expressions. For example:

    ```bicep
    // a string type with three allowed values.
    type myStringLiteralType = 'bicep' | 'arm' | 'azure'

    // an integer type with one allowed value
    type myIntLiteralType = 10

    // an boolean type with one allowed value
    type myBoolLiteralType = true
    ```

- You can declare array types by appending `[]` to any valid type expression:

    ```bicep
    // A string type array
    type myStrStringsType1 = string[]
    // A string type array with three allowed values
    type myStrStringsType2 = ('a' | 'b' | 'c')[]

    type myIntArrayOfArraysType = int[][]

    // A mixed-type array with four allowed values
    type myMixedTypeArrayType = ('fizz' | 42 | {an: 'object'} | null)[]
    ```

- Object types contain zero or more properties between curly brackets:

    ```bicep
    type storageAccountConfigType = {
      name: string
      sku: string
    }
    ```

    Each property in an object consists of a key and a value, separated by a colon `:`. The key can be any string, with nonidentifier values enclosed in quotes, and the value can be any type of expression.

    Properties are required unless they have an optionality marker `?` after the property value. For example, the `sku` property in the following example is optional:

    ```bicep
    type storageAccountConfigType = {
      name: string
      sku: string?
    }
    ```

  Decorators can be used on properties. `*` can be used to make all values require a constraint. Additional properties can still be defined when using `*`. This example creates an object that requires a key of type `int` named _id_, and that all other entries in the object must be a string value at least 10 characters long.

    ```bicep
    type obj = {
      @description('The object ID')
      id: int

      @description('Additional properties')
      @minLength(10)
      *: string
    }
    ```

    The following sample shows how to use the [union type syntax](./data-types.md#union-types) to list a set of predefined values:

    ```bicep
    type directions = 'east' | 'south' | 'west' | 'north'

    type obj = {
      level: 'bronze' | 'silver' | 'gold'
    }
    ```

    **Recursion**

    Object types can use direct or indirect recursion so long as at least leg of the path to the recursion point is optional. For example, the `myObjectType` definition in the following example is valid because the directly recursive `recursiveProp` property is optional:

    ```bicep
    type myObjectType = {
      stringProp: string
      recursiveProp: myObjectType?
    }
    ```

    But the following type definition wouldn't be valid because none of `level1`, `level2`, `level3`, `level4`, or `level5` is optional.

    ```bicep
    type invalidRecursiveObjectType = {
      level1: {
        level2: {
          level3: {
            level4: {
              level5: invalidRecursiveObjectType
            }
          }
        }
      }
    }
    ```

- [Bicep unary operators](./operators.md) can be used with integer and boolean literals or references to integer or boolean literal-typed symbols:

    ```bicep
    type negativeIntLiteral = -10
    type negatedIntReference = -negativeIntLiteral

    type negatedBoolLiteral = !true
    type negatedBoolReference = !negatedBoolLiteral
    ```

- Unions can include any number of literal-typed expressions. Union types are translated into the [allowed-value constraint](./parameters.md#decorators) in Bicep, so only literals are permitted as members.

    ```bicep
    type oneOfSeveralObjects = {foo: 'bar'} | {fizz: 'buzz'} | {snap: 'crackle'}
    type mixedTypeArray = ('fizz' | 42 | {an: 'object'} | null)[]
    ```

In addition to be used in the `type` statement, type expressions can also be used in these places for creating user-defined data types:

- As the type clause of a `param` statement. For example:

    ```bicep
    param storageAccountConfig {
      name: string
      sku: string
    }
    ```

- Following the `:` in an object type property. For example:

    ```bicep
    param storageAccountConfig {
     name: string
      properties: {
        sku: string
      }
    } = {
      name: 'store$(uniqueString(resourceGroup().id)))'
      properties: {
        sku: 'Standard_LRS'
      }
    }
    ```

- Preceding the `[]` in an array type expression. For example:

    ```bicep
    param mixedTypeArray ('fizz' | 42 | {an: 'object'} | null)[]
    ```

A typical Bicep file to create a storage account looks like:

```bicep
param location string = resourceGroup().location
param storageAccountName string

@allowed([
  'Standard_LRS'
  'Standard_GRS'
])
param storageAccountSKU string = 'Standard_LRS'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-04-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: storageAccountSKU
  }
  kind: 'StorageV2'
}
```

By using user-defined data types, it can look like:

```bicep
param location string = resourceGroup().location

type storageAccountSkuType = 'Standard_LRS' | 'Standard_GRS'

type storageAccountConfigType = {
  name: string
  sku: storageAccountSkuType
}

param storageAccountConfig storageAccountConfigType

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-04-01' = {
  name: storageAccountConfig.name
  location: location
  sku: {
    name: storageAccountConfig.sku
  }
  kind: 'StorageV2'
}
```

## Use decorators

The following table describes the available decorators and how to use them.

| Decorator | Argument | Description |
| --------- | ----------- | ------- |
| [discriminator]() | | |
| [description](#description) | string | Text that explains how to use the variable. |
| [export](./bicep-import.md#export-variables-types-and-functions) | none | Indicates that the variable can be imported by another file. |
| [sealed]() | | |

Decorators are in the [sys namespace](bicep-functions.md#namespaces-for-functions). If you need to differentiate a decorator from another item with the same name, preface the decorator with `sys`. For example, if your Bicep file includes a variable named `description`, you must add the sys namespace when using the **description** decorator.

### Descriminator

For more information, see [Tagged union data type](#tagged-union-data-type).

### Description

To help users understand the value to provide, add a description to the variable. Only add a description when the text provides more information than can be inferred from the variable name.

```bicep
@description('Create a unique storage account name.')
var storageAccountName = uniqueString(resourceGroup().id)
```

### Export

For more information, see [Export variable](./bicep-import.md#export-variables-types-and-functions).

### Sealed

For more information, see [Elevate error level](#elevate-error-level).

## Elevate error level

By default, declaring an object type in Bicep allows it to accept additional properties of any type. For example, the following Bicep is valid but raises a warning of [BCP089] - `The property "otionalProperty" is not allowed on objects of type "{ property: string, optionalProperty: null | string }". Did you mean "optionalProperty"?`:

```bicep
type anObject = {
  property: string
  optionalProperty: string?
}
 
param aParameter anObject = {
  property: 'value'
  otionalProperty: 'value'
}
```

The warning informs you that the _anObject_ type doesn't include a property named _otionalProperty_. While no errors occur during deployment, the Bicep compiler assumes _otionalProperty_ is a typo, that you intended to use _optionalProperty_ but misspelled it, and alert you to the inconsistency.

To escalate these warnings to errors, apply the `@sealed()` decorator to the object type:

```bicep
@sealed() 
type anObject = {
  property: string
  optionalProperty?: string
}
```

You get the same results by applying the `@sealed()` decorator to the `param` declaration:

```bicep
type anObject = {
  property: string
  optionalProperty: string?
}
 
@sealed() 
param aParameter anObject = {
  property: 'value'
  otionalProperty: 'value'
}
```

The ARM deployment engine also checks sealed types for additional properties. Providing any extra properties for sealed parameters results in a validation error, causing the deployment to fail. For example:

```bicep
@sealed()
type anObject = {
  property: string
}

param aParameter anObject = {
  property: 'value'
  optionalProperty: 'value'
}
```

## Tagged union data type

To declare a custom tagged union data type within a Bicep file, you can place a `discriminator` decorator above a user-defined type declaration. [Bicep CLI version 0.21.X or higher](./install.md) is required to use this decorator. The following example shows how to declare a tagged union data type:

```bicep
type FooConfig = {
  type: 'foo'
  value: int
}

type BarConfig = {
  type: 'bar'
  value: bool
}

@discriminator('type')
type ServiceConfig = FooConfig | BarConfig | { type: 'baz', *: string }

param serviceConfig ServiceConfig = { type: 'bar', value: true }

output config object = serviceConfig
```

For more information, see [Custom tagged union data type](./data-types.md#custom-tagged-union-data-type).

## Import types between Bicep files

Only user-defined data types that bear the `@export()` decorator can be imported to other templates.

The following example enables you to import the two user-defined data types from other templates:

```bicep
@export()
type myStringType = string

@export()
type myOtherStringType = myStringType
```

For more information, see [Import user-defined data types](./bicep-import-providers.md#import-user-defined-data-types-preview).

## Next steps

- For a list of the Bicep data types, see [Data types](./data-types.md).
