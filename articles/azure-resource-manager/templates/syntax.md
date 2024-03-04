---
title: Template structure and syntax
description: Describes the structure and properties of Azure Resource Manager templates (ARM templates) using declarative JSON syntax.
ms.topic: conceptual
ms.custom: ignite-2022, devx-track-arm-template
ms.date: 05/01/2023
---

# Understand the structure and syntax of ARM templates

This article describes the structure of an Azure Resource Manager template (ARM template). It presents the different sections of a template and the properties that are available in those sections.

This article is intended for users who have some familiarity with ARM templates. It provides detailed information about the structure of the template. For a step-by-step tutorial that guides you through the process of creating a template, see [Tutorial: Create and deploy your first ARM template](template-tutorial-create-first-template.md). To learn about ARM templates through a guided set of Learn modules, see [Deploy and manage resources in Azure by using ARM templates](/training/paths/deploy-manage-resource-manager-templates/).

> [!TIP]
> Bicep is a new language that offers the same capabilities as ARM templates but with a syntax that's easier to use. If you're considering infrastructure as code options, we recommend looking at Bicep.
>
> To learn about the elements of a Bicep file, see [Understand the structure and syntax of Bicep files](../bicep/file.md).

## Template format

In its simplest structure, a template has the following elements:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "",
  "apiProfile": "",
  "parameters": {  },
  "variables": {  },
  "functions": [  ],
  "resources": [  ],
  "outputs": {  }
}
```

| Element name | Required | Description |
|:--- |:--- |:--- |
| $schema |Yes |Location of the JavaScript Object Notation (JSON) schema file that describes the version of the template language. The version number you use depends on the scope of the deployment and your JSON editor.<br><br>If you're using [Visual Studio Code with the Azure Resource Manager tools extension](quickstart-create-templates-use-visual-studio-code.md), use the latest version for resource group deployments:<br>`https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#`<br><br>Other editors (including Visual Studio) may not be able to process this schema. For those editors, use:<br>`https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#`<br><br>For subscription deployments, use:<br>`https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#`<br><br>For management group deployments, use:<br>`https://schema.management.azure.com/schemas/2019-08-01/managementGroupDeploymentTemplate.json#`<br><br>For tenant deployments, use:<br>`https://schema.management.azure.com/schemas/2019-08-01/tenantDeploymentTemplate.json#` |
| contentVersion |Yes |Version of the template (such as 1.0.0.0). You can provide any value for this element. Use this value to document significant changes in your template. When deploying resources using the template, this value can be used to make sure that the right template is being used. |
| apiProfile |No | An API version that serves as a collection of API versions for resource types. Use this value to avoid having to specify API versions for each resource in the template. When you specify an API profile version and don't specify an API version for the resource type, Resource Manager uses the API version for that resource type that is defined in the profile.<br><br>The API profile property is especially helpful when deploying a template to different environments, such as Azure Stack and global Azure. Use the API profile version to make sure your template automatically uses versions that are supported in both environments. For a list of the current API profile versions and the resources API versions defined in the profile, see [API Profile](https://github.com/Azure/azure-rest-api-specs/tree/master/profile).<br><br>For more information, see [Track versions using API profiles](./template-cloud-consistency.md#track-versions-using-api-profiles). |
| [parameters](#parameters) |No |Values that are provided when deployment is executed to customize resource deployment. |
| [variables](#variables) |No |Values that are used as JSON fragments in the template to simplify template language expressions. |
| [functions](#functions) |No |User-defined functions that are available within the template. |
| [resources](#resources) |Yes |Resource types that are deployed or updated in a resource group or subscription. |
| [outputs](#outputs) |No |Values that are returned after deployment. |

Each element has properties you can set. This article describes the sections of the template in greater detail.

## Parameters

In the `parameters` section of the template, you specify which values you can input when deploying the resources. You're limited to [256 parameters](../management/azure-subscription-service-limits.md#general-limits) in a template. You can reduce the number of parameters by using objects that contain multiple properties.

The available properties for a parameter are:

```json
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
}
```

| Element name | Required | Description |
|:--- |:--- |:--- |
| parameter-name |Yes |Name of the parameter. Must be a valid JavaScript identifier. |
| type |Yes |Type of the parameter value. The allowed types and values are **string**, **securestring**, **int**, **bool**, **object**, **secureObject**, and **array**. See [Data types in ARM templates](data-types.md). |
| defaultValue |No |Default value for the parameter, if no value is provided for the parameter. |
| allowedValues |No |Array of allowed values for the parameter to make sure that the right value is provided. |
| minValue |No |The minimum value for int type parameters, this value is inclusive. |
| maxValue |No |The maximum value for int type parameters, this value is inclusive. |
| minLength |No |The minimum length for string, secure string, and array type parameters, this value is inclusive. |
| maxLength |No |The maximum length for string, secure string, and array type parameters, this value is inclusive. |
| description |No |Description of the parameter that is displayed to users through the portal. For more information, see [Comments in templates](#comments). |

For examples of how to use parameters, see [Parameters in ARM templates](./parameters.md).

In Bicep, see [parameters](../bicep/file.md#parameters).

## Variables

In the `variables` section, you construct values that can be used throughout your template. You don't need to define variables, but they often simplify your template by reducing complex expressions. The format of each variable matches one of the [data types](data-types.md). You are limited to [256 variables](../management/azure-subscription-service-limits.md#general-limits) in a template.

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

For information about using `copy` to create several values for a variable, see [Variable iteration](copy-variables.md).

For examples of how to use variables, see [Variables in ARM template](./variables.md).

In Bicep, see [variables](../bicep/file.md#variables).

## Functions

Within your template, you can create your own functions. These functions are available for use in your template. Typically, you define complicated expressions that you don't want to repeat throughout your template. You create the user-defined functions from expressions and [functions](template-functions.md) that are supported in templates.

When defining a user function, there are some restrictions:

* The function can't access variables.
* The function can only use parameters that are defined in the function. When you use the [parameters function](template-functions-deployment.md#parameters) within a user-defined function, you're restricted to the parameters for that function.
* The function can't call other user-defined functions.
* The function can't use the [reference function](template-functions-resource.md#reference).
* Parameters for the function can't have default values.

```json
"functions": [
  {
    "namespace": "<namespace-for-functions>",
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
          "value": "<function-return-value>"
        }
      }
    }
  }
],
```

| Element name | Required | Description |
|:--- |:--- |:--- |
| namespace |Yes |Namespace for the custom functions. Use to avoid naming conflicts with template functions. |
| function-name |Yes |Name of the custom function. When calling the function, combine the function name with the namespace. For example, to call a function named `uniqueName` in the namespace contoso, use `"[contoso.uniqueName()]"`. |
| parameter-name |No |Name of the parameter to be used within the custom function. |
| parameter-value |No |Type of the parameter value. The allowed types and values are **string**, **securestring**, **int**, **bool**, **object**, **secureObject**, and **array**. |
| output-type |Yes |Type of the output value. Output values support the same types as function input parameters. |
| output-value |Yes |Template language expression that is evaluated and returned from the function. |

For examples of how to use custom functions, see [User-defined functions in ARM template](./user-defined-functions.md).

In Bicep, user-defined functions aren't supported. Bicep does support a variety of [functions](../bicep/bicep-functions.md) and [operators](../bicep/operators.md).

## Resources

In the `resources` section, you define the resources that are deployed or updated. You are limited to [800 resources](../management/azure-subscription-service-limits.md#general-limits) in a template.

You define resources with the following structure:

```json
"resources": [
  {
      "condition": "<true-to-deploy-this-resource>",
      "type": "<resource-provider-namespace/resource-type-name>",
      "apiVersion": "<api-version-of-resource>",
      "name": "<name-of-the-resource>",
      "comments": "<your-reference-notes>",
      "location": "<location-of-resource>",
      "dependsOn": [
          "<array-of-related-resource-names>"
      ],
      "tags": {
          "<tag-name1>": "<tag-value1>",
          "<tag-name2>": "<tag-value2>"
      },
      "identity": {
        "type": "<system-assigned-or-user-assigned-identity>",
        "userAssignedIdentities": {
          "<resource-id-of-identity>": {}
        }
      },
      "sku": {
          "name": "<sku-name>",
          "tier": "<sku-tier>",
          "size": "<sku-size>",
          "family": "<sku-family>",
          "capacity": <sku-capacity>
      },
      "kind": "<type-of-resource>",
      "scope": "<target-scope-for-extension-resources>",
      "copy": {
          "name": "<name-of-copy-loop>",
          "count": <number-of-iterations>,
          "mode": "<serial-or-parallel>",
          "batchSize": <number-to-deploy-serially>
      },
      "plan": {
          "name": "<plan-name>",
          "promotionCode": "<plan-promotion-code>",
          "publisher": "<plan-publisher>",
          "product": "<plan-product>",
          "version": "<plan-version>"
      },
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
]
```

| Element name | Required | Description |
|:--- |:--- |:--- |
| condition | No | Boolean value that indicates whether the resource will be provisioned during this deployment. When `true`, the resource is created during deployment. When `false`, the resource is skipped for this deployment. See [condition](conditional-resource-deployment.md). |
| type |Yes |Type of the resource. This value is a combination of the namespace of the resource provider and the resource type (such as `Microsoft.Storage/storageAccounts`). To determine available values, see [template reference](/azure/templates/). For a child resource, the format of the type depends on whether it's nested within the parent resource or defined outside of the parent resource. See [Set name and type for child resources](child-resource-name-type.md). |
| apiVersion |Yes |Version of the REST API to use for creating the resource. When creating a new template, set this value to the latest version of the resource you're deploying. As long as the template works as needed, keep using the same API version. By continuing to use the same API version, you minimize the risk of a new API version changing how your template works. Consider updating the API version only when you want to use a new feature that is introduced in a later version. To determine available values, see [template reference](/azure/templates/). |
| name |Yes |Name of the resource. The name must follow URI component restrictions defined in RFC3986. Azure services that expose the resource name to outside parties validate the name to make sure it isn't an attempt to spoof another identity. For a child resource, the format of the name depends on whether it's nested within the parent resource or defined outside of the parent resource. See [Set name and type for child resources](child-resource-name-type.md). |
| comments |No |Your notes for documenting the resources in your template. For more information, see [Comments in templates](#comments). |
| location |Varies |Supported geo-locations of the provided resource. You can select any of the available locations, but typically it makes sense to pick one that is close to your users. Usually, it also makes sense to place resources that interact with each other in the same region. Most resource types require a location, but some types (such as a role assignment) don't require a location. See [Set resource location](resource-location.md). |
| dependsOn |No |Resources that must be deployed before this resource is deployed. Resource Manager evaluates the dependencies between resources and deploys them in the correct order. When resources aren't dependent on each other, they're deployed in parallel. The value can be a comma-separated list of a resource names or resource unique identifiers. Only list resources that are deployed in this template. Resources that aren't defined in this template must already exist. Avoid adding unnecessary dependencies as they can slow your deployment and create circular dependencies. For guidance on setting dependencies, see [Define the order for deploying resources in ARM templates](./resource-dependency.md). |
| tags |No |Tags that are associated with the resource. Apply tags to logically organize resources across your subscription. |
| identity | No | Some resources support [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). Those resources have an identity object at the root level of the resource declaration. You can set whether the identity is user-assigned or system-assigned. For user-assigned identities, provide a list of resource IDs for the identities. Set the key to the resource ID and the value to an empty object. For more information, see [Configure managed identities for Azure resources on an Azure VM using templates](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md). |
| sku | No | Some resources allow values that define the SKU to deploy. For example, you can specify the type of redundancy for a storage account. |
| kind | No | Some resources allow a value that defines the type of resource you deploy. For example, you can specify the type of Azure Cosmos DB instance to create. |
| scope | No | The scope property is only available for [extension resource types](../management/extension-resource-types.md). Use it when specifying a scope that is different than the deployment scope. See [Setting scope for extension resources in ARM templates](scope-extension-resources.md). |
| copy |No |If more than one instance is needed, the number of resources to create. The default mode is parallel. Specify serial mode when you don't want all or the resources to deploy at the same time. For more information, see [Create several instances of resources in Azure Resource Manager](copy-resources.md). |
| plan | No | Some resources allow values that define the plan to deploy. For example, you can specify the marketplace image for a virtual machine. |
| properties |No |Resource-specific configuration settings. The values for the properties are the same as the values you provide in the request body for the REST API operation (PUT method) to create the resource. You can also specify a copy array to create several instances of a property. To determine available values, see [template reference](/azure/templates/). |
| resources |No |Child resources that depend on the resource being defined. Only provide resource types that are permitted by the schema of the parent resource. Dependency on the parent resource isn't implied. You must explicitly define that dependency. See [Set name and type for child resources](child-resource-name-type.md). |

In Bicep, see [resources](../bicep/file.md#resources).

## Outputs

In the `outputs` section, you specify values that are returned from deployment. Typically, you return values from resources that were deployed. You are limited to [64 outputs](../management/azure-subscription-service-limits.md#general-limits) in a template.

The following example shows the structure of an output definition:

```json
"outputs": {
  "<output-name>": {
    "condition": "<boolean-value-whether-to-output-value>",
    "type": "<type-of-output-value>",
    "value": "<output-value-expression>",
    "copy": {
      "count": <number-of-iterations>,
      "input": <values-for-the-variable>
    }
  }
}
```

| Element name | Required | Description |
|:--- |:--- |:--- |
| output-name |Yes |Name of the output value. Must be a valid JavaScript identifier. |
| condition |No | Boolean value that indicates whether this output value is returned. When `true`, the value is included in the output for the deployment. When `false`, the output value is skipped for this deployment. When not specified, the default value is `true`. |
| type |Yes |Type of the output value. Output values support the same types as template input parameters. If you specify **securestring** for the output type, the value isn't displayed in the deployment history and can't be retrieved from another template. To use a secret value in more than one template, store the secret in a Key Vault and reference the secret in the parameter file. For more information, see [Use Azure Key Vault to pass secure parameter value during deployment](key-vault-parameter.md). |
| value |No |Template language expression that is evaluated and returned as output value. Specify either **value** or **copy**. |
| copy |No | Used to return more than one value for an output. Specify **value** or **copy**. For more information, see [Output iteration in ARM templates](copy-outputs.md). |

For examples of how to use outputs, see [Outputs in ARM template](./outputs.md).

In Bicep, see [outputs](../bicep/file.md#outputs).

<a id="comments"></a>

## Comments and metadata

You have a few options for adding comments and metadata to your template.

### Comments

For inline comments, you can use either `//` or `/* ... */`. In Visual Studio Code, save the parameter files with comments as the **JSON with comments (JSONC)** file type, otherwise you will get an error message saying "Comments not permitted in JSON".

> [!NOTE]
>
> When using Azure CLI to deploy templates with comments, use version 2.3.0 or later, and specify the `--handle-extended-json-format` switch.

```json
{
  "type": "Microsoft.Compute/virtualMachines",
  "apiVersion": "2018-10-01",
  "name": "[variables('vmName')]", // to customize name, change it in variables
  "location": "[parameters('location')]", //defaults to resource group location
  "dependsOn": [ /* storage account and network interface must be deployed first */
    "[resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]",
    "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
  ],
```

In Visual Studio Code, the [Azure Resource Manager Tools extension](quickstart-create-templates-use-visual-studio-code.md) can automatically detect an ARM template and change the language mode. If you see **Azure Resource Manager Template** at the bottom-right corner of Visual Studio Code, you can use the inline comments. The inline comments are no longer marked as invalid.

:::image type="content" source="./media/template-syntax/resource-manager-template-editor-mode.png" alt-text="Screenshot of Visual Studio Code in Azure Resource Manager template mode.":::

In Bicep, see [comments](../bicep/file.md#comments).

### Metadata

You can add a `metadata` object almost anywhere in your template. Resource Manager ignores the object, but your JSON editor may warn you that the property isn't valid. In the object, define the properties you need.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
    "comments": "This template was developed for demonstration purposes.",
    "author": "Example Name"
  },
```

For `parameters`, add a `metadata` object with a `description` property.

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

:::image type="content" source="./media/template-syntax/show-parameter-tip.png" alt-text="Screenshot showing parameter tip in Azure portal.":::

For `resources`, add a `comments` element or a `metadata` object. The following example shows both a `comments` element and a `metadata` object.

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2018-07-01",
    "name": "[concat('storage', uniqueString(resourceGroup().id))]",
    "comments": "Storage account used to store VM disks",
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

For `outputs`, add a `metadata` object to the output value.

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

You can't add a `metadata` object to user-defined functions.

## Multi-line strings

You can break a string into multiple lines. For example, see the `location` property and one of the comments in the following JSON example.

> [!NOTE]
>
> To deploy templates with multi-line strings, use Azure PowerShell or Azure CLI. For CLI, use version 2.3.0 or later, and specify the `--handle-extended-json-format` switch.
>
> Multi-line strings aren't supported when you deploy the template through the Azure portal, a DevOps pipeline, or the REST API.


```json
{
  "type": "Microsoft.Compute/virtualMachines",
  "apiVersion": "2018-10-01",
  "name": "[variables('vmName')]", // to customize name, change it in variables
  "location": "[
    parameters('location')
    ]", //defaults to resource group location
  /*
    storage account and network interface
    must be deployed first
  */
  "dependsOn": [
    "[resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]",
    "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
  ],
```

In Bicep, see [multi-line strings](../bicep/file.md#multi-line-strings).

## Next steps

* To view complete templates for many different types of solutions, see the [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/).
* For details about the functions you can use from within a template, see [ARM template functions](template-functions.md).
* To combine several templates during deployment, see [Using linked and nested templates when deploying Azure resources](linked-templates.md).
* For recommendations about creating templates, see [ARM template best practices](./best-practices.md).
* For answers to common questions, see [Frequently asked questions about ARM templates](frequently-asked-questions.yml).