---
title: User-defined types in Bicep
description: Describes how to define and use user-defined data types in Bicep.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 01/09/2023
---

# User-defined data types in Bicep (Preview)

Learn how to use user-defined data types in Bicep.

[Bicep version 0.12.1 or newer](./install.md) is required to use this feature.

## Enable the preview feature

To enable this preview, modify your project's [bicepconfig.json](./bicep-config.md) file to include the following JSON:

```json
{
  "experimentalFeaturesEnabled": {
    "userDefinedTypes": true
  }
}
```

## User-defined data type syntax

You can use the `type` statement to define user-defined data types. In addition, you can also use type expressions in some places to define custom types.

```bicep
type <userDefinedDataTypeName> = <typeExpression>
```

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

- Array types can be declared by suffixing `[]` to any valid type expression:

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

    Each property in an object consists of key and value. The key and value are separated by a colon `:`. The key may be any string (values that would not be a valid identifier must be enclosed in quotes), and the value may be any type syntax expression.

    Properties are required unless they have an optionality marker `?` after the property value. For example, the `sku` property in the following example is optional:

    ```bicep
    type storageAccountConfigType = {
      name: string
      sku: string?
    }
    ```

  Decorators may be used on properties. `*` may be used to make all values require a constrant. Additional properties may still be defined when using `*`. This example creates an object that requires a key of type int named `id`, and that all other entries in the object must be a string value at least 10 characters long.

    ```bicep
    type obj = {
      @description('The object ID')
      id: int

      @description('Additional properties')
      @minLength(10)
      *: string
    }
    ```

    **Recursion**

    Object types may use direct or indirect recursion so long as at least leg of the path to the recursion point is optional. For example, the `myObjectType` definition in the following example is valid because the directly recursive `recursiveProp` property is optional:

    ```bicep
    type myObjectType = {
      stringProp: string
      recursiveProp: myObjectType?
    }
    ```

    But the following would not be valid because none of `level1`, `level2`, `level3`, `level4`, or `level5` is optional.

    ```bicep
    type invalidRecursiveObjectType = {
      level1: {
        level2: {
          level3: {
            level4: {
              level5: invalidRecursiveObject
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

- Unions may include any number of literal-typed expressions. Union types are translated into the [allowed-value constraint](./parameters.md#decorators) in Bicep, so only literals are permitted as members.

    ```bicep
    type oneOfSeveralObjects = {foo: 'bar'} | {fizz: 'buzz'} | {snap: 'crackle'}
    type mixedTypeArray = ('fizz' | 42 | {an: 'object'} | null)[]
    ```

In addition to be used in the `type` statement, type expressions can also be used in these places for creating user-defined date types:

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

## An example

A typical Bicep file to create a storage account looks like:

```bicep
param location string = resourceGroup().location
param storageAccountName string

@allowed([
  'Standard_LRS'
  'Standard_GRS'
])
param storageAccountSKU string = 'Standard_LRS'

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
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

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountConfig.name
  location: location
  sku: {
    name: storageAccountConfig.sku
  }
  kind: 'StorageV2'
}
```

## Next steps

- For a list of the Bicep data types, see [Data types](./data-types.md).
