---
title: User-defined types in Bicep
description: This article describes how to define and use user-defined data types in Bicep.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 10/23/2024
---

# User-defined data types in Bicep

Learn how to create user-defined data types in Bicep. For system-defined data types, see [Data types](./data-types.md). Using user-defined data types automatically enables [language version 2.0](../templates/syntax.md#languageversion-20) code generation.

[Bicep CLI version 0.12.X or higher](./install.md) is required to use this feature.

## Define types

You can use the `type` statement to create user-defined data types. You can also use type expressions in some places to define custom types.

```bicep
@<decorator>(<argument>)
type <user-defined-data-type-name> = <type-expression>
```

The [`@allowed`](./parameters.md#use-decorators) decorator is permitted only on [`param` statements](./parameters.md). To declare a type with a set of predefined values in a `type`, use [union type syntax](./data-types.md#union-types).

The valid type expressions include:

- Symbolic references are identifiers that refer to an *ambient* type (like `string` or `int`) or a user-defined type symbol declared in a `type` statement:

    ```bicep
    // Bicep data type reference
    type myStringType = string

    // user-defined type reference
    type myOtherStringType = myStringType
    ```

- Primitive literals, including strings, integers, and Booleans, are valid type expressions. For example:

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

    Each property in an object consists of a key and a value separated by a colon `:`. The key can be any string, with nonidentifier values enclosed in quotation marks. The value can be any type of expression.

    Properties are required unless they have an optionality marker `?` after the property value. For example, the `sku` property in the following example is optional:

    ```bicep
    type storageAccountConfigType = {
      name: string
      sku: string?
    }
    ```

  You can use decorators on properties. You can use an asterisk (`*`) to make all values require a constraint. You can define more properties by using `*`. This example creates an object that requires a key of type `int` named `id`. All other entries in the object must be a string value at least 10 characters long.

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

- Object types can use direct or indirect recursion if at least the leg of the path to the recursion point is optional. For example, the `myObjectType` definition in the following example is valid because the directly recursive `recursiveProp` property is optional:

    ```bicep
    type myObjectType = {
      stringProp: string
      recursiveProp: myObjectType?
    }
    ```

    The following type definition wouldn't be valid because none of `level1`, `level2`, `level3`, `level4`, or `level5` is optional.

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

- You can use [Bicep unary operators](./operators.md) with integer and Boolean literals or references to integer or Boolean literal-typed symbols:

    ```bicep
    type negativeIntLiteral = -10
    type negatedIntReference = -negativeIntLiteral

    type negatedBoolLiteral = !true
    type negatedBoolReference = !negatedBoolLiteral
    ```

- Unions can include any number of literal-typed expressions. Union types are translated into the [allowed-value constraint](./parameters.md#use-decorators) in Bicep, so only literals are permitted as members.

    ```bicep
    type oneOfSeveralObjects = {foo: 'bar'} | {fizz: 'buzz'} | {snap: 'crackle'}
    type mixedTypeArray = ('fizz' | 42 | {an: 'object'} | null)[]
    ```

You can use type expressions in the `type` statement, and you can also use type expressions to create user-defined data types, as shown in the following places:

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

With user-defined data types, it can look like:

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

Decorators are written in the format `@expression` and are placed above the declarations of the user-defined data type. The following table shows the available decorators for user-defined data types.

| Decorator | Apply to | Argument | Description |
| --------- | ----------- | ------- |
| [description](#description) | all |string | Provide descriptions for the user-defined data type. |
| [discriminator](#discriminator) | object | string | Use this decorator to ensure the correct subclass is identified and managed. |
| [export](#export) | all | none | Indicates that the user-defined data type is available for import by another Bicep file. |
| [maxLength](#length-constraints) | array, string | int | The maximum length for string and array data types. The value is inclusive. |
| [maxValue](#integer-constraints) | int | int | The maximum value for the integer data types. This value is inclusive. |
| [metadata](#metadata) | all | object | Custom properties to apply to the data types. Can include a description property that's equivalent to the description decorator. |
| [minLength](#length-constraints) | array, string | int | The minimum length for string and array data types. The value is inclusive. |
| [minValue](#integer-constraints) | int | int | The minimum value for the integer data types. This value is inclusive. |
| [sealed](#sealed) | object | none | Elevate [BCP089](./diagnostics/bcp089.md) from a warning to an error when a property name of a user-defined data type is likely a typo. For more information, see [Elevate error level](#elevate-error-level).|
| [secure](#secure-types) | string, object | none | Marks the types as secure. The value for a secure type isn't saved to the deployment history and isn't logged. For more information, see [Secure strings and objects](data-types.md#secure-strings-and-objects). |

Decorators are in the [sys namespace](bicep-functions.md#namespaces-for-functions). If you need to differentiate a decorator from another item with the same name, preface the decorator with `sys`. For example, if your Bicep file includes a variable named `description`, you must add the `sys` namespace when you use the `description` decorator.

### Discriminator

See [Tagged union data type](#tagged-union-data-type).

### Description

Add a description to the user-defined data type. You can use decorators on properties. For example:

```bicep
@description('Define a new object type.')
type obj = {
  @description('The object ID')
  id: int

  @description('Additional properties')
  @minLength(10)
  *: string
}
```

You can use Markdown-formatted text for the description text.

### Export

Use `@export()` to share the user-defined data type with other Bicep files. For more information, see [Export variables, types, and functions](./bicep-import.md#export-variables-types-and-functions).

### Integer constraints

You can set minimum and maximum values for integer type. You can set one or both constraints.

```bicep
@minValue(1)
@maxValue(12)
type month int
```

### Length constraints

You can specify minimum and maximum lengths for string and array types. You can set one or both constraints. For strings, the length indicates the number of characters. For arrays, the length indicates the number of items in the array.

The following example declares two types. One type is for a storage account name that must have 3 to 24 characters. The other type is an array that must have from one to five items.

```bicep
@minLength(3)
@maxLength(24)
type storageAccountName string

@minLength(1)
@maxLength(5)
type appNames array
```

### Metadata

If you have custom properties that you want to apply to a user-defined data type, add a metadata decorator. Within the metadata, define an object with the custom names and values. The object you define for the metadata can contain properties of any name and type.

You might use this decorator to track information about the data type that doesn't make sense to add to the [description](#description).

```bicep
@description('Configuration values that are applied when the application starts.')
@metadata({
  source: 'database'
  contact: 'Web team'
})
type settings object
```

When you provide a `@metadata()` decorator with a property that conflicts with another decorator, that decorator always takes precedence over anything in the `@metadata()` decorator. So, the conflicting property within the `@metadata()` value is redundant and is replaced. For more information, see [No conflicting metadata](./linter-rule-no-conflicting-metadata.md).

### Sealed

See [Elevate error level](#elevate-error-level).

### Secure types

You can mark a string or object user-defined data type as secure. The value of a secure type isn't saved to the deployment history and isn't logged.

```bicep
@secure()
type demoPassword string

@secure()
type demoSecretObject object
```

## Elevate error level

By default, declaring an object type in Bicep allows it to accept more properties of any type. For example, the following Bicep is valid but raises a warning of [BCP089]: `The property "otionalProperty" is not allowed on objects of type "{ property: string, optionalProperty: null | string }". Did you mean "optionalProperty"?`:

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

The warning informs you that the `anObject` type doesn't include a property named `otionalProperty`. Although no errors occur during deployment, the Bicep compiler assumes that `otionalProperty` is a typo and that you intended to use `optionalProperty` but misspelled it. Bicep alerts you to the inconsistency.

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

The Azure Resource Manager deployment engine also checks sealed types for other properties. Providing any extra properties for sealed parameters results in a validation error, which causes the deployment to fail. For example:

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

## Related content

For a list of the Bicep data types, see [Data types](./data-types.md).
