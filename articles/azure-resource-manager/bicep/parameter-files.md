---
title: Create parameters files for Bicep deployment
description: Create parameters file for passing in values during deployment of a Bicep file
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 05/26/2023
---

# Create parameters files for Bicep deployment

Rather than passing parameters as inline values in your script, you can use a Bicep parameters file or a JSON parameters file that contains the parameter values. This article shows how to create parameters files.

A single Bicep file can have multiple Bicep parameters files associated with it. However, each Bicep parameters file is specifically intended for one particular Bicep file. This relationship is established using the `using` statement within the Bicep parameters file. For more information, see [Bicep parameters file](#bicep-parameters-file).

## Parameters file

A parameter file uses the following format:

# [Bicep parameters file](#tab/Bicep)

```bicep
using '<file-name>'

param <first-parameter-name> = <first-value>/<expression>
param <second-parameter-name> = <second-value>/<expression>
```

# [JSON parameters file](#tab/JSON)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "<first-parameter-name>": {
      "value": "<first-value>"
    },
    "<second-parameter-name>": {
      "value": "<second-value>"
    }
  }
}
```

---

It's worth noting that the parameters file saves parameter values as plain text. For security reasons, this approach is not recommended for sensitive values such as passwords. If you must pass a parameter with a sensitive value, keep the value in a key vault. Instead of adding the sensitive value to your parameters file, use the [getSecret function](bicep-functions-resource.md#getsecret) to retrieve it. For more information, see [Use Azure Key Vault to pass secure parameter value during Bicep deployment](key-vault-parameter.md).

## Parameter type formats

The following example shows the formats of different parameter types: string, integer, boolean, array, and object.

# [Bicep parameters file](#tab/Bicep)

```bicep
using './main.bicep'

param exampleString = 'test string'
param exampleInt = 2 + 2
param exampleBool = true
param exampleArray = [
  'value 1'
  'value 2'
]
param exampleObject = {
  property1: 'value 1'
  property2: 'value 2'
}
```

# [JSON parameters file](#tab/JSON)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "exampleString": {
      "value": "test string"
    },
    "exampleInt": {
      "value": 4
    },
    "exampleBool": {
      "value": true
    },
    "exampleArray": {
      "value": [
        "value 1",
        "value 2"
      ]
    },
    "exampleObject": {
      "value": {
        "property1": "value1",
        "property2": "value2"
      }
    }
  }
}
```

---

## File name

# [Bicep parameters file](#tab/Bicep)

Bicep parameters file has the file extension of `.bicepparam`.

To deploy to different environments, you create more than one parameters file. When you name the parameters files, identify their use such as development and production. For example, use _main.dev.biceparm_ and _main.prod.json_ to deploy resources.

# [JSON parameters file](#tab/JSON)

The general naming convention for the parameters file is to include _parameters_ in the Bicep file name. For example, if your Bicep file is named _azuredeploy.bicep_, your parameters file is named _azuredeploy.parameters.json_. This naming convention helps you see the connection between the Bicep file and the parameters.

To deploy to different environments, you create more than one parameters file. When you name the parameters files, identify their use such as development and production. For example, use _azuredeploy.parameters-dev.json_ and _azuredeploy.parameters-prod.json_ to deploy resources.

---

## Define parameter values

To determine how to define the parameter names and values, open your Bicep file. Look at the parameters section of the Bicep file. The following examples show the parameters from a Bicep file.

```bicep
@maxLength(11)
param storagePrefix string

@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_ZRS'
  'Premium_LRS'
])
param storageAccountType string = 'Standard_LRS'
```

In the parameters file, the first detail to notice is the name of each parameter. The parameter names in your parameters file must match the parameter names in your Bicep file.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storagePrefix": {
    },
    "storageAccountType": {
    }
  }
}
```

Notice the parameter type. The parameter types in your parameters file must use the same types as your Bicep file. In this example, both parameter types are strings.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storagePrefix": {
      "value": ""
    },
    "storageAccountType": {
      "value": ""
    }
  }
}
```

Check the Bicep file for parameters with a default value. If a parameter has a default value, you can provide a value in the parameters file but it's not required. The parameters file value overrides the Bicep file's default value.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storagePrefix": {
      "value": "" // This value must be provided.
    },
    "storageAccountType": {
      "value": "" // This value is optional. Bicep will use default value if not provided.
    }
  }
}
```

> [!NOTE]
> For inline comments, you can use either // or /* ... */. In Visual Studio Code, save the parameters files with the **JSONC** file type, otherwise you will get an error message saying "Comments not permitted in JSON".

Check the Bicep's allowed values and any restrictions such as maximum length. Those values specify the range of values you can provide for a parameter. In this example, `storagePrefix` can have a maximum of 11 characters and `storageAccountType` must specify an allowed value.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storagePrefix": {
      "value": "storage"
    },
    "storageAccountType": {
      "value": "Standard_ZRS"
    }
  }
}
```

> [!NOTE]
> Your parameters file can only contain values for parameters that are defined in the Bicep file. If your parameters file contains extra parameters that don't match the Bicep file's parameters, you receive an error.

## Generate parameters file

From Visual Studio Code, See [Generate parameters file](./visual-studio-code.md#generate-parameters-file).

jgao: test this function when it is available.

From Bicep CLI, see [Generate parameters file](./bicep-cli.md#generate-params).

## Convert between JSON parameters files and  Bicep parameters files

jgao: test this function when it is available.

```command
Bicep decompile-params params.json --bicep-file main.bicep
```

Bicep build-params params.bicepparam
--bicep-file <file> - don't document this feature.

## Deploy Bicep file with parameters file

From Azure CLI, pass a local parameters file using `@` and the parameters file name. For example, `@storage.parameters.json`.

```azurecli
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file storage.bicep \
  --parameters @storage.parameters.json
```

For more information, see [Deploy resources with Bicep and Azure CLI](./deploy-cli.md#parameters). To deploy _.bicep_ files you need Azure CLI version 2.20 or higher.

From Azure PowerShell, pass a local parameters file using the `TemplateParameterFile` parameter.

```azurepowershell
New-AzResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup `
  -TemplateFile C:\MyTemplates\storage.bicep `
  -TemplateParameterFile C:\MyTemplates\storage.parameters.json
```

For more information, see [Deploy resources with Bicep and Azure PowerShell](./deploy-powershell.md#parameters). To deploy _.bicep_ files you need Azure PowerShell version 5.6.0 or higher.

## Parameter precedence

You can use inline parameters and a local parameters file in the same deployment operation. For example, you can specify some values in the local parameters file and add other values inline during deployment. If you provide values for a parameter in both the local parameters file and inline, the inline value takes precedence.

It's possible to use an external parameters file, by providing the URI to the file. When you use an external parameters file, you can't pass other values either inline or from a local file. All inline parameters are ignored. Provide all parameter values in the external file.

## Parameter name conflicts

If your Bicep file includes a parameter with the same name as one of the parameters in the PowerShell command, PowerShell presents the parameter from your Bicep file with the postfix `FromTemplate`. For example, a parameter named `ResourceGroupName` in your Bicep file conflicts with the `ResourceGroupName` parameter in the [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) cmdlet. You're prompted to provide a value for `ResourceGroupNameFromTemplate`. To avoid this confusion, use parameter names that aren't used for deployment commands.

## Next steps

- For more information about how to define parameters in a Bicep file, see [Parameters in Bicep](./parameters.md).
- To get sensitive values, see [Use Azure Key Vault to pass secure parameter value during deployment](./key-vault-parameter.md).
