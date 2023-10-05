---
title: Parameters in Bicep files
description: Describes how to define parameters in a Bicep file.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 10/05/2023
---

# Parameters in Bicep

This article describes how to define and use parameters in a Bicep file. By providing different values for parameters, you can reuse a Bicep file for different environments.

Resource Manager resolves parameter values before starting the deployment operations. Wherever the parameter is used, Resource Manager replaces it with the resolved value.

Each parameter must be set to one of the [data types](data-types.md).

You are limited to 256 parameters in a Bicep file. For more information, see [Template limits](../templates/best-practices.md#template-limits).

For parameter best practices, see [Parameters](./best-practices.md#parameters).

### Training resources

If you would rather learn about parameters through step-by-step guidance, see [Build reusable Bicep templates by using parameters](/training/modules/build-reusable-bicep-templates-parameters).

## Declaration

Each parameter has a name and [data type](data-types.md). Optionally, you can provide a default value for the parameter.

```bicep
param <parameter-name> <parameter-data-type> = <default-value>
```

A parameter can't have the same name as a variable, resource, output, or other parameter in the same scope.

The following example shows basic declarations of parameters.

```bicep
param demoString string
param demoInt int
param demoBool bool
param demoObject object
param demoArray array
```

## Default value

You can specify a default value for a parameter. The default value is used when a value isn't provided during deployment.

```bicep
param demoParam string = 'Contoso'
```

You can use expressions with the default value. Expressions aren't allowed with other parameter properties. You can't use the [reference](bicep-functions-resource.md#reference) function or any of the [list](bicep-functions-resource.md#list) functions in the parameters section. These functions get the resource's runtime state, and can't be executed before deployment when parameters are resolved.

```bicep
param location string = resourceGroup().location
```

You can use another parameter value to build a default value. The following template constructs a host plan name from the site name.

:::code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/parameters/parameterswithfunctions.bicep" highlight="2":::

## Decorators

Parameters use decorators for constraints or metadata. The decorators are in the format `@expression` and are placed above the parameter's declaration. You can mark a parameter as secure, specify allowed values, set the minimum and maximum length for a string, set the minimum and maximum value for an integer, and provide a description of the parameter.

The following example shows two common uses for decorators.

```bicep
@secure()
param demoPassword string

@description('Must be at least Standard_A3 to support 2 NICs.')
param virtualMachineSize string = 'Standard_DS1_v2'
```

The following table describes the available decorators and how to use them.

| Decorator | Apply to | Argument | Description |
| --------- | ---- | ----------- | ------- |
| [allowed](#allowed-values) | all | array | Allowed values for the parameter. Use this decorator to make sure the user provides correct values. |
| [description](#description) | all | string | Text that explains how to use the parameter. The description is displayed to users through the portal. |
| [maxLength](#length-constraints) | array, string | int | The maximum length for string and array parameters. The value is inclusive. |
| [maxValue](#integer-constraints) | int | int | The maximum value for the integer parameter. This value is inclusive. |
| [metadata](#metadata) | all | object | Custom properties to apply to the parameter. Can include a description property that is equivalent to the description decorator. |
| [minLength](#length-constraints) | array, string | int | The minimum length for string and array parameters. The value is inclusive. |
| [minValue](#integer-constraints) | int | int | The minimum value for the integer parameter. This value is inclusive. |
| [secure](#secure-parameters) | string, object | none | Marks the parameter as secure. The value for a secure parameter isn't saved to the deployment history and isn't logged. For more information, see [Secure strings and objects](data-types.md#secure-strings-and-objects). |

Decorators are in the [sys namespace](bicep-functions.md#namespaces-for-functions). If you need to differentiate a decorator from another item with the same name, preface the decorator with `sys`. For example, if your Bicep file includes a parameter named `description`, you must add the sys namespace when using the **description** decorator.

```bicep
@sys.description('The name of the instance.')
param name string
@sys.description('The description of the instance to display.')
param description string
```

The available decorators are described in the following sections.

### Secure parameters

You can mark string or object parameters as secure. The value of a secure parameter isn't saved to the deployment history and isn't logged.

```bicep
@secure()
param demoPassword string

@secure()
param demoSecretObject object
```

### Allowed values

You can define allowed values for a parameter. You provide the allowed values in an array. The deployment fails during validation if a value is passed in for the parameter that isn't one of the allowed values.

```bicep
@allowed([
  'one'
  'two'
])
param demoEnum string
```

If you define allowed values for an array parameter, the actual value can be any subset of the allowed values.

### Length constraints

You can specify minimum and maximum lengths for string and array parameters. You can set one or both constraints. For strings, the length indicates the number of characters. For arrays, the length indicates the number of items in the array.

The following example declares two parameters. One parameter is for a storage account name that must have 3-24 characters. The other parameter is an array that must have from 1-5 items.

```bicep
@minLength(3)
@maxLength(24)
param storageAccountName string

@minLength(1)
@maxLength(5)
param appNames array
```

### Integer constraints

You can set minimum and maximum values for integer parameters. You can set one or both constraints.

```bicep
@minValue(1)
@maxValue(12)
param month int
```

### Description

To help users understand the value to provide, add a description to the parameter. When a user deploys the template through the portal, the description's text is automatically used as a tip for that parameter. Only add a description when the text provides more information than can be inferred from the parameter name.

```bicep
@description('Must be at least Standard_A3 to support 2 NICs.')
param virtualMachineSize string = 'Standard_DS1_v2'
```

Markdown-formatted text can be used for the description text:

```bicep
@description('''
Storage account name restrictions:
- Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
- Your storage account name must be unique within Azure. No two storage accounts can have the same name.
''')
@minLength(3)
@maxLength(24)
param storageAccountName string
```

When you hover your cursor over **storageAccountName** in VS Code, you see the formatted text:

:::image type="content" source="./media/parameters/vscode-bicep-extension-description-decorator-markdown.png" alt-text="Use Markdown-formatted text in VSCode":::

Make sure the text is well-formatted Markdown. Otherwise the text won't be rendered correctly.

### Metadata

If you have custom properties that you want to apply to a parameter, add a metadata decorator. Within the metadata, define an object with the custom names and values. The object you define for the metadata can contain properties of any name and type.

You might use this decorator to track information about the parameter that doesn't make sense to add to the [description](#description).

```bicep
@description('Configuration values that are applied when the application starts.')
@metadata({
  source: 'database'
  contact: 'Web team'
})
param settings object
```

When you provide a `@metadata()` decorator with a property that conflicts with another decorator, that decorator always takes precedence over anything in the `@metadata()` decorator. Consequently, the conflicting property within the @metadata() value is redundant and will be replaced. For more information, see [No conflicting metadata](./linter-rule-no-conflicting-metadata.md).

## Use parameter

To reference the value for a parameter, use the parameter name. The following example uses a parameter value for a key vault name.

```bicep
param vaultName string = 'keyVault${uniqueString(resourceGroup().id)}'

resource keyvault 'Microsoft.KeyVault/vaults@2019-09-01' = {
  name: vaultName
  ...
}
```

## Objects as parameters

It can be easier to organize related values by passing them in as an object. This approach also reduces the number of parameters in the template.

The following example shows a parameter that is an object. The default value shows the expected properties for the object. Those properties are used when defining the resource to deploy.

:::code language="bicep" source="~/azure-docs-bicep-samples/syntax-samples/parameters/parameterobject.bicep":::


## Next steps

- To learn about the available properties for parameters, see [Understand the structure and syntax of Bicep files](file.md).
- To learn about passing in parameter values as a file, see [Create a Bicep parameter file](parameter-files.md).
