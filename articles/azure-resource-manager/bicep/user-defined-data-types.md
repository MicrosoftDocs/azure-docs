---
title: User-defined types in Bicep
description: Describes how to define and use user-defined data types in Bicep.
ms.topic: conceptual
ms.date: 01/04/2023
---

# User-defined data types in Bicep (Preview)

Learn how to use user-defined data types in Bicep.

Bicep version 1.2 or newer is required. To install the latest versions, see [Install](./install.md).

## Enable the preview feature

To enable this preview, modify your project's bicepconfig.json file to include the following JSON:

```json
{
  "experimentalFeaturesEnabled": {
    "userDefinedTypes": true
  }
}
```

## User-defined data type syntax

```bicep
Type <userDefinedDataTypeName> = <typeExpression>
```

Valid type expression include:

- Strings, integers, and booleans are valid data types to be used as type expressions.

    ```bicep
    type myStringLiteral = 'string'
    type myIntLiteral = 10
    type myBoolLiteral = true
    ```

- Symbolic references of [Bicep data types](./data-types.md) or user-defined data types are valid type expressions.

    ```bicep
    // Bicep data type reference
    type myStringType = string

    // user-defined type reference
    type myOtherStringType = myStringType
    ```

- Array types can be declared by suffixing `[]` to any valid type expression.

    ```bicep
    type myStrStringsType1 = string[]
    type myStrStringsType2 = ('a' | 'b' | 'c')[]

    type myIntArrayOfArraysType = int[][]

    type myMixedTypeArrayType = ('fizz' | 42 | {an: 'object'} | null)[]
    ```

    Both **myStrStringsType1** and **myStrStringsType2** define a new array of strings. **myStrStringsType2** is defined with three allowed values.

- Object types contain zero or more properties between curly brackets:

    ```bicep
    type storageAccountConfigType = {
      name: string
      sku: string
    }
    ```

    Each property in an object consists of key and value. The key and value are separated by a colon (:). The key may be any string (values that would not be a valid identifier must be enclosed in quotes), and the value may be any type syntax expression.

    Properties are required unless they have an optionality marker (?) between the property name and the colon. For example, the sku property in the following example is optional:

    ```bicep
    type storageAccountConfigType = {
      name: string
      sku?: string
    }
    ```

    **Recursion**

    Object types may use direct or indirect recursion so long as at least leg of the path to the recursion point is optional. For example, the myObject definition in the following example is valid because the directly recursive recursiveProp property is optional:

    ```bicep
    type myObject = {
      stringProp: string
      recursiveProp?: myObject
    }
    ```

    But the following would not be:

    ```bicep
    type invalidRecursiveObject = {
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

    Because none of level1, level2, level3, level4, or level5 is optional, there is no JSON object that would be able to fulfill this schema.

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

In addition to be used in the `type` statement, type expressions can also be used in these places:

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
      prperties: {
        sku: string
      }
    } = {
      name: 'store$(uniqueString(resourceGroup().id)))'
      prperties: {
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

* To learn about the available properties for user-defined functions, see [Understand the structure and syntax of ARM templates](./syntax.md).
* For a list of the available template functions, see [ARM template functions](template-functions.md).