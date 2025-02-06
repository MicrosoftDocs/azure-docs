---
title: Create parameters files for Bicep deployment
description: Create parameters file for passing in values when deploying a Bicep file.
ms.topic: how-to
ms.date: 01/10/2025
ms.custom: devx-track-bicep
---

# Create parameters files for Bicep deployment

Rather than passing parameters as inline values in your script, you can use a Bicep parameters file with the `.bicepparam` file extension or a JSON parameters file that contains the parameter values. This article shows how to create parameters files.

> [!NOTE]
> The Bicep parameters file is only supported in [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.18.4 or later, [Azure CLI](/cli/azure/install-azure-cli) version 2.47.0 or later, and [Azure PowerShell](/powershell/azure/install-azure-powershell) version 9.7.1 or later.

A single Bicep file can have multiple Bicep parameters files associated with it. However, each Bicep parameters file is intended for one particular Bicep file. This relationship is established with the [using statement](./bicep-using.md) within the Bicep parameters file.

You can compile Bicep parameters files into JSON parameters files to deploy with a Bicep file. See [build-params](./bicep-cli.md#build-params) for more information. You can also decompile a JSON parameters file into a Bicep parameters file. See [decompile-params](./bicep-cli.md#decompile-params) to learn more.

## Parameters file

A parameters file uses the following format:

# [Bicep parameters file](#tab/Bicep)

```bicep
using '<path>/<file-name>.bicep'

param <first-parameter-name> = <first-value>
param <second-parameter-name> = <second-value>
```

You can use the [using statement](./bicep-using.md) with a Bicep file, JSON Azure Resource Manager templates, Bicep modules, and template specs. For example:

```bicep
using './main.bicep'
...
```

```bicep
using './azuredeploy.json'
...
```

```bicep
using 'br/public:avm/res/storage/storage-account:0.9.0' 
...
```

```bicep
using 'br:myacr.azurecr.io/bicep/modules/storage:v1'
...
```

```bicep
using 'ts:00000000-0000-0000-0000-000000000000/myResourceGroup/storageSpec:1.0'
...
```

For more information, see the [using statement](./bicep-using.md).

You can use expressions with the default value. For example:

```bicep
using 'main.bicep'

param storageName = toLower('MyStorageAccount')
param intValue = 2 + 2
```

You can reference environment variables as parameter values. For example:

```bicep
using './main.bicep'

param intFromEnvironmentVariables = int(readEnvironmentVariable('intEnvVariableName'))
```

You can define and use variables. [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.21.X or later is required for using variables in `.bicepparam` files. Here are some examples:

```bicep
using './main.bicep'

var storagePrefix = 'myStorage'
param primaryStorageName = '${storagePrefix}Primary'
param secondaryStorageName = '${storagePrefix}Secondary'
```

```bicep
using './main.bicep'

var testSettings = {
  instanceSize: 'Small'
  instanceCount: 1
}

var prodSettings = {
  instanceSize: 'Large'
  instanceCount: 4
}

param environmentSettings = {
  test: testSettings
  prod: prodSettings
}
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

It's worth noting that the parameters file saves parameter values as plain text. For security reasons, this approach isn't recommended for sensitive values such as passwords. If you must pass a parameter with a sensitive value, keep the value in a key vault. Instead of adding a sensitive value to your parameters file, use the [getSecret function](bicep-functions-resource.md#getsecret) to retrieve it. For more information, see [Use Azure Key Vault to pass secure parameter value during Bicep deployment](key-vault-parameter.md).

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

Use Bicep syntax to declare [objects](./data-types.md#objects) and [arrays](./data-types.md#arrays).

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

To deploy to different environments, you create more than one parameters file. When you name multiple parameters files, label their use as development and production. For example, use _main.dev.bicepparam_ for development and _main.prod.bicepparam_ for production to deploy resources.

# [JSON parameters file](#tab/JSON)

The general naming convention for a parameters file is to include _parameters_ in the Bicep file name. For example, if your Bicep file is named _azuredeploy.bicep_, then your parameters file is named _azuredeploy.parameters.json_. This naming convention helps you see the connection between the Bicep file and the parameters.

To deploy to different environments, you create more than one parameters file. When you name multiple parameters files, label their use as development and production. For example, use _azuredeploy.parameters-dev.json_ for development and _azuredeploy.parameters-prod.json_ for production to deploy resources.

---

## Define parameter values

To determine how to define parameter names and values, open your Bicep file. Look at the **parameters** section of the Bicep file. The following examples show the parameters from a Bicep file named `main.bicep`:

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

# [Bicep parameters file](#tab/Bicep)

```bicep
using 'main.bicep'

param storagePrefix
param storageAccountType
```

The `using` statement ties the Bicep parameters file to a Bicep file. For more information, see [using statement](./bicep-using.md).

After typing the keyword `param` in Visual Studio Code, it prompts you the available parameters and their descriptions from the linked Bicep file:

:::image type="content" source="./media/parameter-files/bicep-parameters-file-visual-studio-code-prompt.png" alt-text="Screenshot of the prompt of the available parameters.":::

When hovering over a param name, you can see the parameter data type and description.

:::image type="content" source="./media/parameter-files/bicep-parameters-file-visual-studio-code-hover.png" alt-text="Screenshot of the parameter data type and description.":::

# [JSON parameters file](#tab/JSON)

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

---

Notice the parameter type. The parameter types in your parameters file must use the same types as your Bicep file. In this example, both parameter types are strings.

# [Bicep parameters file](#tab/Bicep)

```bicep
using 'main.bicep'

param storagePrefix = ''
param storageAccountType = ''
```

# [JSON parameters file](#tab/JSON)

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

---

Check the Bicep file for parameters with a default value. If a parameter has a default value, you can provide a value in the parameters file, but it isn't required. The parameters file value overrides the Bicep file's default value.

# [Bicep parameters file](#tab/Bicep)

```bicep
using 'main.bicep'

param storagePrefix = '' // This value must be provided.
param storageAccountType = '' // This value is optional. Bicep will use default value if not provided.
```

# [JSON parameters file](#tab/JSON)

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
> For inline comments, you can use either // or /* ... */. In Visual Studio Code, save parameters files with the `JSONC` file type; otherwise, you'll get an error message that says, "Comments not permitted in JSON."

---

Check the Bicep file's allowed values and any restrictions such as maximum length. Those values specify the range of values you can provide for a parameter. In this example, `storagePrefix` can have a maximum of 11 characters, and `storageAccountType` must specify an allowed value.

# [Bicep parameters file](#tab/Bicep)

```bicep
using 'main.bicep'

param storagePrefix = 'storage'
param storageAccountType = 'Standard_ZRS'
```

# [JSON parameters file](#tab/JSON)

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
> Your parameters file can only contain values for parameters that are defined in the Bicep file. If your parameters file contains extra parameters that don't match the Bicep file's parameters, you'll receive an error.

---

## Generate parameters file

You can create a parameters file two ways: either with Visual Studio Code or the Bicep CLI. Both tools allow you to use a Bicep file to generate a parameters file. See [Generate parameters file](./visual-studio-code.md#generate-parameters-file-command) for the Visual Studio Code method and [Generate parameters file](./bicep-cli.md#generate-params) for the Bicep CLI method.

## Build Bicep parameters file

From Bicep CLI, you can build a Bicep parameters file into a JSON parameters file. For more information, see [Build parameters file](./bicep-cli.md#build-params).

## Deploy Bicep file with parameters file

### Azure CLI

From Azure CLI, you can pass a parameters file with your Bicep file deployment.

# [Bicep parameters file](#tab/Bicep)

You can deploy a Bicep file by using a Bicep parameters file with [Azure CLI](./install.md#azure-cli) version 2.53.0 or later and [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.22.X or later. With the `using` statement within the Bicep parameters file, there's no need to provide the `--template-file` switch when specifying a Bicep parameters file for the `--parameters` switch.

```azurecli
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --parameters storage.bicepparam
```

# [JSON parameters file](#tab/JSON)

```azurecli
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file storage.bicep \
  --parameters storage.parameters.json
```

---

You can use inline parameters and a location parameters file in the same deployment operation. For example:

# [Bicep parameters file](#tab/Bicep)

```azurecli
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --parameters storage.bicepparam \
  --parameters storageAccountType=Standard_LRS
```

# [JSON parameters file](#tab/JSON)

```azurecli
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file storage.bicep \
  --parameters storage.parameters.json \
  --parameters storageAccountType=Standard_LRS
```

---

For more information, see [Deploy Bicep files with the Azure CLI](./deploy-cli.md#parameters).

### Azure PowerShell

From Azure PowerShell, pass a local parameters file using the `TemplateParameterFile` parameter.

# [Bicep parameters file](#tab/Bicep)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name ExampleDeployment `
  -ResourceGroupName ExampleResourceGroup `
  -TemplateFile C:\MyTemplates\storage.bicep `
  -TemplateParameterFile C:\MyTemplates\storage.bicepparam
```

# [JSON parameters file](#tab/JSON)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name ExampleDeployment `
  -ResourceGroupName ExampleResourceGroup `
  -TemplateFile C:\MyTemplates\storage.bicep `
  -TemplateParameterFile C:\MyTemplates\storage.parameters.json
```

---

You can use inline parameters and a location parameters file in the same deployment operation. For example:

# [Bicep parameters file](#tab/Bicep)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name ExampleDeployment `
  -ResourceGroupName ExampleResourceGroup `
  -TemplateFile C:\MyTemplates\storage.bicep `
  -TemplateParameterFile C:\MyTemplates\storage.bicepparam `
  -storageAccountType Standard_LRS
```

# [JSON parameters file](#tab/JSON)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name ExampleDeployment `
  -ResourceGroupName ExampleResourceGroup `
  -TemplateFile C:\MyTemplates\storage.bicep `
  -TemplateParameterFile C:\MyTemplates\storage.parameters.json `
  -storageAccountType Standard_LRS
```

---

For more information, see [Deploy Bicep files with Azure PowerShell](./deploy-powershell.md#parameters). To deploy `.bicep` files, you need Azure PowerShell version 5.6.0 or later.

## Parameter precedence

You can use inline parameters and a local parameters file in the same deployment operation. For example, you can specify some values in the local parameters file and add other values inline during deployment. If you provide values for a parameter in both the local parameters file and inline, the inline value takes precedence.

While external Bicep parameters files aren't currently supported, it's possible to use an external JSON parameters file by providing the URI to the file. When using an external parameters file, provide all parameter values in the external file since you can't pass other values either inline or from a local file, and all inline parameters are ignored.

## Parameter name conflicts

If your Bicep file includes a parameter with the same name as one of the parameters in the PowerShell command, PowerShell presents the parameter from your Bicep file with the `FromTemplate` postfix. For example, a parameter named `ResourceGroupName` in your Bicep file conflicts with the `ResourceGroupName` parameter in the [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) cmdlet. You're prompted to provide a value for `ResourceGroupNameFromTemplate`. To avoid this confusion, use parameter names that aren't used for deployment commands.

## Next steps

- For more information about how to define parameters in a Bicep file, see [Parameters in Bicep](./parameters.md).
- To get sensitive values, see [Use Azure Key Vault to pass secure parameter value during deployment](./key-vault-parameter.md).
