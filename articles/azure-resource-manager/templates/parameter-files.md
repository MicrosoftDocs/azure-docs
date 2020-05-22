---
title: Create parameter file
description: Create parameter file for passing in values during deployment of an Azure Resource Manager template
ms.topic: conceptual
ms.date: 04/20/2020
---
# Create Resource Manager parameter file

Rather than passing parameters as inline values in your script, you may find it easier to use a JSON file that contains the parameter values. This article shows how to create the parameter file.

## Parameter file

The parameter file has the following format:

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

Notice that the parameter values are stored as plain text in the parameter file. This approach works for values that aren't sensitive, such as specifying the SKU for a resource. It doesn't work for sensitive values, such as passwords. If you need to pass a sensitive value as a parameter, store the value in a key vault, and reference the key vault in your parameter file. The sensitive value is securely retrieved during deployment.

The following parameter file includes a plain text value and a value that is stored in a key vault.

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

To figure out how to define the parameter values, open the template you're deploying. Look at the parameters section of the template. The following example shows the parameters from a template.

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

The first detail to notice is the name of each parameter. The values in your parameter file must match the names.

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

Notice the type of the parameter. The values in your parameter file must have the same types. For this template, you can provide both parameters as strings.

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

Next, look for a default value. If a parameter has a default value, you can provide a value but you don't have to.

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

Finally, look at the allowed values and any restrictions like max length. They tell you the range of values you can provide for the parameter.

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

## Parameter type formats

The following example shows the formats of different parameter types.

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

## File name

The general convention for naming the parameter file is to add **.parameters** to the template name. For example, if your template is named **azuredeploy.json**, your parameter file is named **azuredeploy.parameters.json**. This naming convention helps you see the connection between the template and the parameters.

To deploy to different environments, create more than one parameter file. When naming the parameter file, add a way to identify its use. For example, use **azuredeploy.parameters-dev.json** and **azuredeploy.parameters-prod.json**


## Parameter precedence

You can use inline parameters and a local parameter file in the same deployment operation. For example, you can specify some values in the local parameter file and add other values inline during deployment. If you provide values for a parameter in both the local parameter file and inline, the inline value takes precedence.

It's possible to use an external parameter file, by providing the URI to the file. When you do this, you can't pass other values either inline or from a local file. All inline parameters are ignored. Provide all parameter values in the external file.

## Parameter name conflicts

If your template includes a parameter with the same name as one of the parameters in the PowerShell command, PowerShell presents the parameter from your template with the postfix **FromTemplate**. For example, a parameter named **ResourceGroupName** in your template conflicts with the **ResourceGroupName** parameter in the [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) cmdlet. You're prompted to provide a value for **ResourceGroupNameFromTemplate**. You can avoid this confusion by using parameter names that aren't used for deployment commands.

## Next steps

- To understand how to define parameters in your template, see [Parameters in Azure Resource Manager templates](template-parameters.md).
- For more information about using values from a key vault, see [Use Azure Key Vault to pass secure parameter value during deployment](key-vault-parameter.md).
- For more information about parameters, see [Parameters in Azure Resource Manager templates](template-parameters.md).
