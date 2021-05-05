---
title: Parameters in Bicep
description: Describes how to define parameters in a Bicep file.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 05/05/2021
---

# Parameters in Bicep

This article describes how to define and use parameters in your Bicep file. By providing different values for parameters, you can reuse a Bicep file for different environments.

Resource Manager resolves parameter values before starting the deployment operations. Wherever the parameter is used in Bicep, Resource Manager replaces it with the resolved value.

Each parameter must be set to one of the [data types](./data-types.md). You can add one or more [decorators](./file.dm#prameter-decorators) for each parameter. These decorators define the values that are allowed for the parameter.

[!INCLUDE [Bicep preview](../../../includes/resource-manager-bicep-preview.md)]

## Minimal declaration

At a minimum, every parameter needs a name and type. In Bicep, a parameter can't have the same name as a variable, resource, output, or other parameter in the same scope.

When you deploy a template via the Azure portal, camel-cased parameter names are turned into space-separated names. For example, *demoString* in the following example is shown as *Demo String*. For more information, see [Use a deployment button to deploy templates from GitHub repository](./deploy-to-azure-button.md) and [Deploy resources with ARM templates and Azure portal](./deploy-portal.md).

```bicep
param demoString string
param demoInt int
param demoBool bool
param demoObject object
param demoArray array
```

## Secure parameters

You can use the `@secure()` [decorator](./file.md#parameter-decorators) to mark string or object parameters as secure. The value of a secure parameter isn't saved to the deployment history and isn't logged.

```bicep
@secure()
param demoPassword string

@secure()
param demoSecretObject object
```

## Allowed values

You can define allowed values for a parameter. You provide the allowed values in an array. The deployment fails during validation if a value is passed in for the parameter that isn't one of the allowed values.

```bicep
@allowed([
  'one'
  'two'
])
param demoEnum string
```

## Default value

You can specify a default value for a parameter. The default value is used when a value isn't provided during deployment.

```bicep
param demoParam string = 'Contoso'
```

To specify a default value along with other properties for the parameter, use the following syntax.

```bicep
@allowed([
  'Contoso'
  'Fabrikam'
])
param demoParam string = 'Contoso'
```

You can use expressions with the default value. You can't use the [reference](./template-functions-resource.md#reference) function or any of the [list](./template-functions-resource.md#list) functions in the parameters section. These functions get the runtime state of a resource, and can't be executed before deployment when parameters are resolved.

Expressions aren't allowed with other parameter properties.

```bicep
param location string = resourceGroup().location
```

You can use another parameter value to build a default value. The following template constructs a host plan name from the site name.

```bicep
param siteName string = 'site${uniqueString(resourceGroup().id)}'
param hostingPlanName string = '${siteName}-plan'
```

## Length constraints

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

## Integer constraints

You can set minimum and maximum values for integer parameters. You can set one or both constraints.

```bicep
@minValue(1)
@maxValue(12)
param month int
```

## Description

You can add a description to a parameter to help users of your template understand the value to provide. When deploying the template through the portal, the text you provide in the description is automatically used as a tip for that parameter. Only add a description when the text provides more information than can be inferred from the parameter name.

```bicep
@description('Must be at least Standard_A3 to support 2 NICs.')
param virtualMachineSize string = 'Standard_DS1_v2'
```

## Use parameter

In Bicep, you use the parameter name. The following example uses a parameter value for a Key Vault name.

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

```bicep
param vNetSettings object = {
  name: 'VNet1'
  location: 'eastus'
  addressPrefixes: [
    {
      name: 'firstPrefix'
      addressPrefix: '10.0.0.0/22'
    }
  ]
  subnets: [
    {
      name: 'firstSubnet'
      addressPrefix: '10.0.0.0/24'
    }
    {
      name: 'secondSubnet'
      addressPrefix: '10.0.1.0/24'
    }
  ]
}
resource vnet 'Microsoft.Network/virtualNetworks@2020-06-01' = {
  name: vNetSettings.name
  location: vNetSettings.location
  properties: {
    addressSpace: {
      addressPrefixes: [
        vNetSettings.addressPrefixes[0].addressPrefix
      ]
    }
    subnets: [
      {
        name: vNetSettings.subnets[0].name
        properties: {
          addressPrefix: vNetSettings.subnets[0].addressPrefix
        }
      }
      {
        name: vNetSettings.subnets[1].name
        properties: {
          addressPrefix: vNetSettings.subnets[1].addressPrefix
        }
      }
    ]
  }
}
```

## Example templates

The following examples demonstrate scenarios for using parameters.

|Template  |Description  |
|---------|---------|
|[parameters with functions for default values](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/parameterswithfunctions.bicep) | Demonstrates how to use template functions when defining default values for parameters. The template doesn't deploy any resources. It constructs parameter values and returns those values. |
|[parameter object](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/parameterobject.bicep) | Demonstrates using an object for a parameter. The template doesn't deploy any resources. It constructs parameter values and returns those values. |

## Next steps

* To learn about the available properties for parameters, see [Understand the structure and syntax of Bicep files](./file.md).
* To learn about passing in parameter values as a file, see [Create Resource Manager parameter file](./parameter-files.md).
* For recommendations about creating parameters, see [Best practices - parameters](../templates/template-best-practices.md#parameters).
