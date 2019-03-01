---
title: Azure Resource Manager template structure and syntax | Microsoft Docs
description: Describes the structure and properties of Azure Resource Manager templates using declarative JSON syntax.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
ms.assetid: 19694cb4-d9ed-499a-a2cc-bcfc4922d7f5
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/01/2019
ms.author: tomfitz
---

# Understand the structure and syntax of Azure Resource Manager templates

This article describes the structure of an Azure Resource Manager template. It presents the different sections of a template and the properties that are available in those sections. The template consists of JSON and expressions that you can use to construct values for your deployment.

This article is intended for users who have some familiarity with Resource Manager templates. It provides detailed information about the structure and syntax of the template. If you want an introduction to creating a template, see [Create your first Azure Resource Manager template](resource-manager-create-first-template.md).

## Template format

In its simplest structure, a template has the following elements:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "",
    "parameters": {  },
    "variables": {  },
    "functions": [  ],
    "resources": [  ],
    "outputs": {  }
}
```

| Element name | Required | Description |
|:--- |:--- |:--- |
| $schema |Yes |Location of the JSON schema file that describes the version of the template language.<br><br> For resource group deployments, use: `https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#`<br><br>For subscription deployments, use: `https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#` |
| contentVersion |Yes |Version of the template (such as 1.0.0.0). You can provide any value for this element. Use this value to document significant changes in your template. When deploying resources using the template, this value can be used to make sure that the right template is being used. |
| parameters |No |Values that are provided when deployment is executed to customize resource deployment. |
| variables |No |Values that are used as JSON fragments in the template to simplify template language expressions. |
| functions |No |User-defined functions that are available within the template. |
| resources |Yes |Resource types that are deployed or updated in a resource group or subscription. |
| outputs |No |Values that are returned after deployment. |

Each element has properties you can set. The following example shows the full syntax for a template:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "",
    "parameters": {  
        "<parameter-name>" : {
            "type" : "<type-of-parameter-value>",
            "defaultValue": "<default-value-of-parameter>",
            "allowedValues": [ "<array-of-allowed-values>" ],
            "minValue": <minimum-value-for-int>,
            "maxValue": <maximum-value-for-int>,
            "minLength": <minimum-length-for-string-or-array>,
            "maxLength": <maximum-length-for-string-or-array-parameters>,
            "metadata": {
                "description": "<description-of-the parameter>" 
            }
        }
    },
    "variables": {
        "<variable-name>": "<variable-value>",
        "<variable-object-name>": {
            <variable-complex-type-value>
        },
        "<variable-object-name>": {
            "copy": [
                {
                    "name": "<name-of-array-property>",
                    "count": <number-of-iterations>,
                    "input": <object-or-value-to-repeat>
                }
            ]
        },
        "copy": [
            {
                "name": "<variable-array-name>",
                "count": <number-of-iterations>,
                "input": <object-or-value-to-repeat>
            }
        ]
    },
    "functions": [
      {
        "namespace": "<namespace-for-your-function>",
        "members": {
          "<function-name>": {
            "parameters": [
              {
                "name": "<parameter-name>",
                "type": "<type-of-parameter-value>"
              }
            ],
            "output": {
              "type": "<type-of-output-value>",
              "value": "<function-expression>"
            }
          }
        }
      }
    ],
    "resources": [
      {
          "condition": "<boolean-value-whether-to-deploy>",
          "apiVersion": "<api-version-of-resource>",
          "type": "<resource-provider-namespace/resource-type-name>",
          "name": "<name-of-the-resource>",
          "location": "<location-of-resource>",
          "tags": {
              "<tag-name1>": "<tag-value1>",
              "<tag-name2>": "<tag-value2>"
          },
          "comments": "<your-reference-notes>",
          "copy": {
              "name": "<name-of-copy-loop>",
              "count": "<number-of-iterations>",
              "mode": "<serial-or-parallel>",
              "batchSize": "<number-to-deploy-serially>"
          },
          "dependsOn": [
              "<array-of-related-resource-names>"
          ],
          "properties": {
              "<settings-for-the-resource>",
              "copy": [
                  {
                      "name": ,
                      "count": ,
                      "input": {}
                  }
              ]
          },
          "resources": [
              "<array-of-child-resources>"
          ]
      }
    ],
    "outputs": {
        "<outputName>" : {
            "condition": "<boolean-value-whether-to-output-value>",
            "type" : "<type-of-output-value>",
            "value": "<output-value-expression>"
        }
    }
}
```

This article describes the sections of the template in greater detail.

## Syntax

The basic syntax of the template is JSON. However, expressions and functions extend the JSON values available within the template.  Expressions are written within JSON string literals whose first and last characters are the brackets: `[` and `]`, respectively. The value of the expression is evaluated when the template is deployed. While written as a string literal, the result of evaluating the expression can be of a different JSON type, such as an array or integer, depending on the actual expression.  To have a literal string start with a bracket `[`, but not have it interpreted as an expression, add an extra bracket to start the string with `[[`.

Typically, you use expressions with functions to perform operations for configuring the deployment. Just like in JavaScript, function calls are formatted as `functionName(arg1,arg2,arg3)`. You reference properties by using the dot and [index] operators.

The following example shows how to use several functions when constructing a value:

```json
"variables": {
    "storageName": "[concat(toLower(parameters('storageNamePrefix')), uniqueString(resourceGroup().id))]"
}
```

For the full list of template functions, see [Azure Resource Manager template functions](resource-group-template-functions.md). 

## Parameters

In the parameters section of the template, you specify which values you can input when deploying the resources. These parameter values enable you to customize the deployment by providing values that are tailored for a particular environment (such as dev, test, and production). You don't have to provide parameters in your template, but without parameters your template would always deploy the same resources with the same names, locations, and properties.

The following example shows a simple parameter definition:

```json
"parameters": {
  "siteNamePrefix": {
    "type": "string",
    "metadata": {
      "description": "The name prefix of the web app that you wish to create."
    }
  },
},
```

For information about defining parameters, see [Parameters section of Azure Resource Manager templates](resource-manager-templates-parameters.md).

## Variables

In the variables section, you construct values that can be used throughout your template. You don't need to define variables, but they often simplify your template by reducing complex expressions.

### Available definitions

The following example shows the available options for defining a variable:

```json
"variables": {
    "<variable-name>": "<variable-value>",
    "<variable-name>": { 
        <variable-complex-type-value> 
    },
    "<variable-object-name>": {
        "copy": [
            {
                "name": "<name-of-array-property>",
                "count": <number-of-iterations>,
                "input": <object-or-value-to-repeat>
            }
        ]
    },
    "copy": [
        {
            "name": "<variable-array-name>",
            "count": <number-of-iterations>,
            "input": <object-or-value-to-repeat>
        }
    ]
}
```

For information about using `copy` to create several values for a variable, see [Variable iteration](resource-group-create-multiple.md#variable-iteration).

### Define and use a variable

The following example shows a variable definition. It creates a string value for a storage account name. It uses several template functions to get a parameter value, and concatenates it to a unique string.

```json
"variables": {
  "storageName": "[concat(toLower(parameters('storageNamePrefix')), uniqueString(resourceGroup().id))]"
},
```

You use the variable when defining the resource.

```json
"resources": [
  {
    "name": "[variables('storageName')]",
    "type": "Microsoft.Storage/storageAccounts",
    ...
```

### Configuration variables

You can use complex JSON types to define related values for an environment.

```json
"variables": {
    "environmentSettings": {
        "test": {
            "instanceSize": "Small",
            "instanceCount": 1
        },
        "prod": {
            "instanceSize": "Large",
            "instanceCount": 4
        }
    }
},
```

In parameters, you create a value that indicates which configuration values to use.

```json
"parameters": {
    "environmentName": {
        "type": "string",
        "allowedValues": [
          "test",
          "prod"
        ]
    }
},
```

You retrieve the current settings with:

```json
"[variables('environmentSettings')[parameters('environmentName')].instanceSize]"
```

### Variables example templates

These example templates demonstrate some scenarios for using variables. Deploy them to test how variables are handled in different scenarios. 

|Template  |Description  |
|---------|---------|
| [variable definitions](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/variables.json) | Demonstrates the different types of variables. The template doesn't deploy any resources. It constructs variable values and returns those values. |
| [configuration variable](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/variablesconfigurations.json) | Demonstrates the use of a variable that defines configuration values. The template doesn't deploy any resources. It constructs variable values and returns those values. |
| [network security rules](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.json) and [parameter file](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/multiplesecurityrules.parameters.json) | Constructs an array in the correct format for assigning security rules to a network security group. |


## Functions

Within your template, you can create your own functions. These functions are available for use in your template. Typically, you define complicated expression that you don't want to repeat throughout your template. You create the user-defined functions from expressions and [functions](resource-group-template-functions.md) that are supported in templates.

When defining a user function, there are some restrictions:

* The function can't access variables.
* The function can only use parameters that are defined in the function. When you use the [parameters function](resource-group-template-functions-deployment.md#parameters) within a user-defined function, you're restricted to the parameters for that function.
* The function can't call other user-defined functions.
* The function can't use the [reference function](resource-group-template-functions-resource.md#reference).
* Parameters for the function can't have default values.

Your functions require a namespace value to avoid naming conflicts with template functions. The following example shows a function that returns a storage account name:

```json
"functions": [
  {
    "namespace": "contoso",
    "members": {
      "uniqueName": {
        "parameters": [
          {
            "name": "namePrefix",
            "type": "string"
          }
        ],
        "output": {
          "type": "string",
          "value": "[concat(toLower(parameters('namePrefix')), uniqueString(resourceGroup().id))]"
        }
      }
    }
  }
],
```

You call the function with:

```json
"resources": [
  {
    "name": "[contoso.uniqueName(parameters('storageNamePrefix'))]",
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2016-01-01",
    "sku": {
      "name": "Standard_LRS"
    },
    "kind": "Storage",
    "location": "South Central US",
    "tags": {},
    "properties": {}
  }
]
```

## Resources
In the resources section, you define the resources that are deployed or updated. This section can get complicated because you must understand the types you're deploying to provide the right values.

```json
"resources": [
  {
    "apiVersion": "2016-08-01",
    "name": "[variables('webSiteName')]",
    "type": "Microsoft.Web/sites",
    "location": "[resourceGroup().location]",
    "properties": {
      "serverFarmId": "/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.Web/serverFarms/<plan-name>"
    }
  }
],
```

To conditionally include or exclude a resource during deployment, use the [Condition element](resource-manager-templates-resources.md#condition). For more information about the resources section, see [Resources section of Azure Resource Manager templates](resource-manager-templates-resources.md).

## Outputs

In the Outputs section, you specify values that are returned from deployment. Typically, you return values from resources that were deployed.

### Available properties

The following example shows the structure of an output definition:

```json
"outputs": {
    "<outputName>" : {
        "condition": "<boolean-value-whether-to-output-value>",
        "type" : "<type-of-output-value>",
        "value": "<output-value-expression>"
    }
}
```

| Element name | Required | Description |
|:--- |:--- |:--- |
| outputName |Yes |Name of the output value. Must be a valid JavaScript identifier. |
| condition |No | Boolean value that indicates whether this output value is returned. When `true`, the value is included in the output for the deployment. When `false`, the output value is skipped for this deployment. When not specified, the default value is `true`. |
| type |Yes |Type of the output value. Output values support the same types as template input parameters. |
| value |Yes |Template language expression that is evaluated and returned as output value. |

### Define and use output values

The following example shows how to return the resource ID for a public IP address:

```json
"outputs": {
  "resourceID": {
    "type": "string",
    "value": "[resourceId('Microsoft.Network/publicIPAddresses', parameters('publicIPAddresses_name'))]"
  }
}
```

The next example shows how to conditionally return the resource ID for a public IP address based on whether a new one was deployed:

```json
"outputs": {
  "resourceID": {
    "condition": "[equals(parameters('publicIpNewOrExisting'), 'new')]",
    "type": "string",
    "value": "[resourceId('Microsoft.Network/publicIPAddresses', parameters('publicIPAddresses_name'))]"
  }
}
```

For a simple example of conditional output, see [conditional output template](https://github.com/bmoore-msft/AzureRM-Samples/blob/master/conditional-output/azuredeploy.json).

After the deployment, you can retrieve the value with script. For PowerShell, use:

```powershell
(Get-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -Name <deployment-name>).Outputs.resourceID.value
```

For Azure CLI, use:

```azurecli-interactive
az group deployment show -g <resource-group-name> -n <deployment-name> --query properties.outputs.resourceID.value
```

You can retrieve the output value from a linked template by using the [reference](resource-group-template-functions-resource.md#reference) function. To get an output value from a linked template, retrieve the property value with syntax like: `"[reference('deploymentName').outputs.propertyName.value]"`.

When getting an output property from a linked template, the property name can't include a dash.

The following example shows how to set the IP address on a load balancer by retrieving a value from a linked template.

```json
"publicIPAddress": {
    "id": "[reference('linkedTemplate').outputs.resourceID.value]"
}
```

You can't use the `reference` function in the outputs section of a [nested template](resource-group-linked-templates.md#link-or-nest-a-template). To return the values for a deployed resource in a nested template, convert your nested template to a linked template.

### Output example templates

|Template  |Description  |
|---------|---------|
|[Copy variables](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/multipleinstance/copyvariables.json) | Creates complex variables and outputs those values. Doesn't deploy any resources. |
|[Public IP address](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/public-ip.json) | Creates a public IP address and outputs the resource ID. |
|[Load balancer](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/linkedtemplates/public-ip-parentloadbalancer.json) | Links to the preceding template. Uses the resource ID in the output when creating the load balancer. |


<a id="comments" />

## Comments and metadata

You have a few options for adding comments and metadata to your template.

You can add a `metadata` object almost anywhere in your template. Resource Manager ignores the object, but your JSON editor may warn you that the property isn't valid. In the object, define the properties you need.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "metadata": {
        "comments": "This template was developed for demonstration purposes.",
        "author": "Example Name"
    },
```

For **parameters**, add a `metadata` object with a `description` property.

```json
"parameters": {
    "adminUsername": {
      "type": "string",
      "metadata": {
        "description": "User name for the Virtual Machine."
      }
    },
```

When deploying the template through the portal, the text you provide in the description is automatically used as a tip for that parameter.

![Show parameter tip](./media/resource-group-authoring-templates/show-parameter-tip.png)

For **resources**, add a `comments` element or a metadata object. The following example shows both a comments element and a metadata object.

```json
"resources": [
  {
    "comments": "Storage account used to store VM disks",
    "apiVersion": "2018-07-01",
    "type": "Microsoft.Storage/storageAccounts",
    "name": "[concat('storage', uniqueString(resourceGroup().id))]",
    "location": "[parameters('location')]",
    "metadata": {
      "comments": "These tags are needed for policy compliance."
    },
    "tags": {
      "Dept": "[parameters('deptName')]",
      "Environment": "[parameters('environment')]"
    },
    "sku": {
      "name": "Standard_LRS"
    },
    "kind": "Storage",
    "properties": {}
  }
]
```

For **outputs**, add a metadata object to the output value.

```json
"outputs": {
    "hostname": {
      "type": "string",
      "value": "[reference(variables('publicIPAddressName')).dnsSettings.fqdn]",
      "metadata": {
        "comments": "Return the fully qualified domain name"
      }
    },
```

You can't add a metadata object to user-defined functions.

For inline comments, you can use `//` but this syntax doesn't work with all tools. You can't use Azure CLI to deploy the template with inline comments. And, you can't use the portal template editor to work on templates with inline comments. If you add this style of comment, be sure the tools you use support inline JSON comments.

```json
{
  "type": "Microsoft.Compute/virtualMachines",
  "name": "[variables('vmName')]", // to customize name, change it in variables
  "location": "[parameters('location')]", //defaults to resource group location
  "apiVersion": "2018-10-01",
  "dependsOn": [ // storage account and network interface must be deployed first
      "[resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]",
      "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
  ],
```

In VS Code, you can set the language mode to JSON with comments. The inline comments are no longer marked as invalid. To change the mode:

1. Open language mode selection (Ctrl+K M)

1. Select **JSON with Comments**.

   ![Select language mode](./media/resource-group-authoring-templates/select-json-comments.png)

## Template limits

Limit the size of your template to 1 MB, and each parameter file to 64 KB. The 1-MB limit applies to the final state of the template after it has been expanded with iterative resource definitions, and values for variables and parameters. 

You're also limited to:

* 256 parameters
* 256 variables
* 800 resources (including copy count)
* 64 output values
* 24,576 characters in a template expression

You can exceed some template limits by using a nested template. For more information, see [Using linked templates when deploying Azure resources](resource-group-linked-templates.md). To reduce the number of parameters, variables, or outputs, you can combine several values into an object. For more information, see [Objects as parameters](resource-manager-objects-as-parameters.md).

[!INCLUDE [arm-tutorials-quickstarts](../../includes/resource-manager-tutorials-quickstarts.md)]

## Next steps
* To view complete templates for many different types of solutions, see the [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/).
* For details about the functions you can use from within a template, see [Azure Resource Manager Template Functions](resource-group-template-functions.md).
* To combine several templates during deployment, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).
* For recommendations about creating templates, see [Azure Resource Manager template best practices](template-best-practices.md).
* For recommendations on creating Resource Manager templates that you can use across all Azure environments and Azure Stack, see [Develop Azure Resource Manager templates for cloud consistency](templates-cloud-consistency.md).
