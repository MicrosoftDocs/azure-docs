---
title: Create parameter file
description: Create parameter file for passing in values during deployment of an Azure Resource Manager template
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 11/14/2022
---

# Create Resource Manager parameter file

Rather than passing parameters as inline values in your script, you can use a JSON file that contains the parameter values. This article shows how to create a parameter file that you use with a JSON template.

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [parameter files](../bicep/parameter-files.md).

## Parameter file

A parameter file uses the following format:

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

It's worth noting that the parameter file saves parameter values as plain text. For security reasons, this approach is not recommended for sensitive values such as passwords. If you must pass a parameter with a sensitive value, keep the value in a key vault. Then, in your parameter file, include a reference to the key vault. During deployment, the sensitive value is securely retrieved. For more information, see [Use Azure Key Vault to pass secure parameter value during deployment](./key-vault-parameter.md).

The following parameter file includes a plain text value and a sensitive value that's stored in a key vault.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "<first-parameter-name>": {
      "value": "<first-value>"
    },
    "<second-parameter-name>": {
      "reference": {
        "keyVault": {
          "id": "<resource-id-key-vault>"
        },
        "secretName": "<secret-name>"
      }
    }
  }
}
```

For more information about using values from a key vault, see [Use Azure Key Vault to pass secure parameter value during deployment](key-vault-parameter.md).

## Define parameter values

To determine how to define the parameter names and values, open your JSON template and review the  `parameters` section. The following example shows the JSON template's parameters.

```json
"parameters": {
  "storagePrefix": {
    "type": "string",
    "maxLength": 11
  },
  "storageAccountType": {
    "type": "string",
    "defaultValue": "Standard_LRS",
    "allowedValues": [
    "Standard_LRS",
    "Standard_GRS",
    "Standard_ZRS",
    "Premium_LRS"
    ]
  }
}
```

In the parameter file, the first detail to notice is the name of each parameter. The parameter names in your parameter file must match the parameter names in your template.

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

Notice the parameter type. The parameter types in your parameter file must use the same types as your template. In this example, both parameter types are strings.

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

Check the template for parameters with a default value. If a parameter has a default value, you can provide a value in the parameter file but it's not required. The parameter file value overrides the template's default value.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storagePrefix": {
      "value": "" // This value must be provided.
    },
    "storageAccountType": {
      "value": "" // This value is optional. Template will use default value if not provided.
    }
  }
}
```

Check the template's allowed values and any restrictions such as maximum length. Those values specify the range of values you can provide for a parameter. In this example, `storagePrefix` can have a maximum of 11 characters and `storageAccountType` must specify an allowed value.

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
> Your parameter file can only contain values for parameters that are defined in the template. If your parameter file contains extra parameters that don't match the template's parameters, you receive an error.

## Parameter type formats

The following example shows the formats of different parameter types: string, integer, boolean, array, and object.

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

## Deploy template with parameter file

From Azure CLI you pass a local parameter file using `@` and the parameter file name. For example, `@storage.parameters.json`.

```azurecli
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file storage.json \
  --parameters @storage.parameters.json
```

For more information, see [Deploy resources with ARM templates and Azure CLI](./deploy-cli.md#parameters).

From Azure PowerShell you pass a local parameter file using the `TemplateParameterFile` parameter.

```azurepowershell
New-AzResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup `
  -TemplateFile C:\MyTemplates\storage.json `
  -TemplateParameterFile C:\MyTemplates\storage.parameters.json
```

For more information, see [Deploy resources with ARM templates and Azure PowerShell](./deploy-powershell.md#pass-parameter-values).

> [!NOTE]
> It's not possible to use a parameter file with the custom template blade in the portal.

> [!TIP]
> If you're using the [Azure Resource Group project in Visual Studio](create-visual-studio-deployment-project.md), make sure the parameter file has its **Build Action** set to **Content**.

## File name

The general naming convention for the parameter file is to include _parameters_ in the template name. For example, if your template is named _azuredeploy.json_, your parameter file is named _azuredeploy.parameters.json_. This naming convention helps you see the connection between the template and the parameters.

To deploy to different environments, you create more than one parameter file. When you name the parameter files, identify their use such as development and production. For example, use _azuredeploy.parameters-dev.json_ and _azuredeploy.parameters-prod.json_ to deploy resources.

## Parameter precedence

You can use inline parameters and a local parameter file in the same deployment operation. For example, you can specify some values in the local parameter file and add other values inline during deployment. If you provide values for a parameter in both the local parameter file and inline, the inline value takes precedence.

It's possible to use an external parameter file, by providing the URI to the file. When you use an external parameter file, you can't pass other values either inline or from a local file. All inline parameters are ignored. Provide all parameter values in the external file.

## Parameter name conflicts

If your template includes a parameter with the same name as one of the parameters in the PowerShell command, PowerShell presents the parameter from your template with the postfix `FromTemplate`. For example, a parameter named `ResourceGroupName` in your template conflicts with the `ResourceGroupName` parameter in the [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) cmdlet. You're prompted to provide a value for `ResourceGroupNameFromTemplate`. To avoid this confusion, use parameter names that aren't used for deployment commands.

## Next steps

- For more information about how to define parameters in a template, see [Parameters in ARM templates](./parameters.md).
- For more information about using values from a key vault, see [Use Azure Key Vault to pass secure parameter value during deployment](key-vault-parameter.md).
