---
title: Overview - Automate logic app deployment with Azure Resource Manager templates - Azure Logic Apps
description: Overview for automating deployment for logic apps with Azure Resource Manager templates
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: article
ms.date: 05/28/2019
---

# Overview: Automate deployment for logic apps with Azure Resource Manager templates

When you're ready to automate creating and deploying your logic app, you can expand your logic app's underlying workflow definition into an [Azure Resource Manager template](../azure-resource-manager/resource-group-overview.md). This template defines the infrastructure, resources, parameters, and other information for provisioning and deploying your logic app. By defining parameters for values that vary at deployment, also known as *parameterizing*, you can repeatedly and consistently deploy logic apps based on different deployment needs.

For example, if you deploy to environments for development, test, and production, you likely use different connection strings for each environment. You can define template parameters that accept different connection strings and then store those strings in a separate [parameter file](../azure-resource-manager/resource-group-template-deploy.md#parameter-files). For parameter values that are sensitive or must be secured, such as passwords and secrets, you can store those values in [Azure Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md) and have your parameter file retrieve those values. That way, you can change those values without having to update and redeploy the template.

This overview describes the attributes in a Resource Manager template that includes a logic app workflow definition. Both the template and your workflow definition use JSON syntax, but some differences exist because the workflow definition also follows the [Workflow Definition Language schema](../logic-apps/logic-apps-workflow-definition-language.md). For example, template expressions and workflow definition expressions differ in how they [reference parameters](#parameter-references) and the values that they can accept.

> [!TIP]
> For the easiest way to get a valid parameterized template for your logic app that's mostly ready for deployment, either download your logic app from the Azure portal into Visual Studio where you've installed the Azure Logic Apps Tools for Visual Studio, or use the PowerShell module for creating logic app templates. For more information, see [Create Azure Resource Manager templates for logic apps](../logic-apps/logic-apps-create-azure-resource-manager-templates.md).

The example logic app in this topic uses an [Office 365 Outlook trigger](/connectors/office365/) that fires when a new email arrives and an [Azure Blob Storage action](/connectors/azureblob/) that creates a blob for the email body and uploads that blob to an Azure storage container. The examples also show how to parameterize values that vary at deployment.

For more information about Resource Manager templates, see these topics:

* [Azure Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md)

* [Azure Resource Manager template best practices](../azure-resource-manager/template-best-practices.md)

For sample templates, see these examples:

* [Full template](#full-example-template) that's used for this topic's examples

* [Sample quickstart logic app template](https://github.com/Azure/azure-quickstart-templates/blob/master/101-logic-app-create) in GitHub

<a name="template-structure"></a>

## Template structure

At the top level, a Resource Manager template follows this structure, which is fully described in the [Azure Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md) topic:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {},
   "variables": {},
   "functions": [],
   "resources": [],
   "outputs": {}
}
```

For logic app deployment, you primarily work with the template's parameters and resources sections:

| Attribute | Description |
|-----------|-------------|
| `parameters` | Defines the [template parameters](../azure-resource-manager/resource-group-authoring-templates.md#parameters) for accepting the values to use when creating and customizing resources for deployment in Azure. For example, these parameters accept the values for your logic app's name and location, connections, and other resources necessary for deployment. You can store these parameter values in a [parameter file](#template-parameter-files), which is described later in this topic. For general details, see [Parameters - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#parameters). |
| `resources` | Defines the [resources](../azure-resource-manager/resource-group-authoring-templates.md#resources) to create or update and deploy to an Azure resource group, such as your logic app, connections, Azure storage accounts, and so on. For general details, see [Resources - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#resources). |
||||

> [!IMPORTANT]
> Template syntax is case-sensitive so make sure that you use consistent casing.

<a name="template-parameters"></a>

## Template parameters

A logic app template has multiple parameters sections that exist at different levels and perform different functions. For example, at the top level, you can define [template parameters](../azure-resource-manager/resource-group-authoring-templates.md#parameters) for the values to accept and use at deployment when creating and deploying resources in Azure, for example:

* Your logic app

* Connections that your logic uses to access other services and systems through [managed connectors](../connectors/apis-list.md)

* Other resources that your logic app needs for deployment

  For example, if your logic app uses an [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) for business-to-business (B2B) scenarios, the template's top-level parameters section defines the parameter that accepts the resource ID for that integration account.

Here is the general structure and syntax for a parameter definition, which is fully described by [Parameters - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#parameters):

```json
"<parameter-name>": {
   "type": "<parameter-type>",
   "defaultValue": <default-parameter-value>,
   <other-parameter-attributes>,
   "metadata": {
      "description": "<parameter-description>"
   }
},
```

This example shows just the template parameters for the values used to create and deploy these resources in Azure:

* Name and location for your logic app

* ID to use for an integration account that's linked to the logic app

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   // Template parameters
   "parameters": {
      "LogicAppName": {
         "type": "string",
         "minLength": 1,
         "maxLength": 80,
         "defaultValue": "MyLogicApp",
         "metadata": {
            "description": "The resource name for the logic app"
         }
      },
      "LogicAppLocation": {
         "type": "string",
         "min length": 1,
         "defaultValue": "[resourceGroup().location]",
         "metadata": {
            "description": "The resource location for the logic app"
         }
      },
      "LogicAppIntegrationAccount": {
         "type":"string",
         "minLength": 1,
         "defaultValue": "/subscriptions/<Azure-subscription-ID>/resourceGroups/fabrikam-integration-account-rg/providers/Microsoft.Logic/integrationAccounts/fabrikam-integration-account",
         "metadata": {
            "description": "The ID to use for the integration account"
         }
      }
   },
   "variables": {},
   "functions": [],
   "resources": [],
   "outputs": {}
}
```

Except for parameters that handle values that are sensitive or must be secured, such as usernames, passwords, and secrets, all these parameters include `defaultValue` attributes, although in some cases, the default values are empty values. The deployment values to use for these template parameters are provided by the sample [parameter file](#template-parameter-files) described later in this topic.

To secure template parameters, see these topics:

* [Security recommendations for template parameters](../azure-resource-manager/template-best-practices.md#parameters)

* [Pass secure parameter values with Azure Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md)

Other template sections often reference template parameters so they can use the values that pass through template parameters, for example:

* Your [template's resources section](#template-resources), described later in this topic, defines each resource in Azure that you want to create and deploy, such as your [logic app's resource definition](#logic-app-resource). These resources often use template parameter values, such as your logic app's name and location and connection information.

* At a deeper level in your logic app's resource definition, your [workflow definition's parameters section](#workflow-definition-and-parameters) defines parameters for the values to use at your logic app's runtime. For example, you can define workflow definition parameters for the username and password that an HTTP trigger uses for authentication. To specify the values for workflow definition parameters, use the parameters section that's *outside* your workflow definition but still *inside* your logic app's resource definition. In this outer parameters section, you can reference previously defined template parameters, which can accept values at deployment from a parameter file.

When referencing parameters, template expressions and functions use different syntax and behave differently from workflow definition expressions and functions. For more information about these differences, see [References to parameters](#parameter-references) later in this topic.

<a name="best-practices-parameters"></a>

## Best practices for parameters

Here are some best practices for defining parameters:

* Define parameters only for values that vary, based on your deployment needs. Don't define parameters for values that stay the same across different deployment requirements.

* Include the `defaultValue` attribute, which can specify empty values, for all parameters except for values that are sensitive or must be secured. Always use secured parameters for user names, passwords, and secrets. To hide or protect sensitive parameter values, follow the guidance in these topics:
  
  * [Security recommendations for template parameters](../azure-resource-manager/template-best-practices.md#parameters)

  * [Pass secure parameter values with Azure Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md)

* To differentiate template parameter names from workflow definition parameter names, you can use descriptive template parameter names, for example: `TemplateFabrikamPassword`

For more template best practices, see [Best practices for template parameters](../azure-resource-manager/template-best-practices.md#parameters).

<a name="template-parameter-files"></a>

## Template parameter files

To provide the values for template parameters, store those values in a [parameter file](../azure-resource-manager/resource-group-template-deploy.md#parameter-files). That way, you can use different parameter files based on your deployment needs. Here is the syntax for naming a parameter file for a logic app template:

**<*logic-app-name*>.parameters.json**

Here is the syntax to use inside the parameter file, which includes the syntax for [passing a secure parameter value with Azure Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md):

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
   "contentVersion": "1.0.0.0",
   // Template parameter values
   "parameters": {
      "<parameter-name-1>": {
         "value": "<parameter-value>"
      },
      "<parameter-name-2>": {
         "value": "<parameter-value>"
      },
      "<secured-parameter-name>": {
         "reference": {
            "keyVault": {
               "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group-name>/Microsoft.KeyVault/vaults/<key-vault-name>",
            },
            "secretName: "<secret-name>"
         }
      },
      <other-parameter-values>
   }
}
```

This example parameter file specifies the values for the template parameters defined earlier in this topic:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
   "contentVersion": "1.0.0.0",
   // Template parameter values
   "parameters": {
     "LogicAppName": {
        "value": "Email-Processor-Logic-App"
     },
     "LogicAppLocation": {
        "value": "westeurope"
     },
     "TemplateFabrikamPassword": {
        "reference": {
           "keyVault": {
              "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group-name>/Microsoft.KeyVault/vaults/fabrikam-key-vault"
           },
           "secretName": "FabrikamPassword"
        }
     },
     "TemplateFabrikamUserName": {
        "reference": {
           "keyVault": {
              "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group-name>/Microsoft.KeyVault/vaults/fabrikam-key-vault"
           },
           "secretName": "FabrikamUserName"
        }
     }
   }
}
```

<a name="template-resources"></a>

## Template resources

Your template has a resources section, which specifies an array that has definitions for each resource to create and deploy in Azure, such as your [logic app's resource definition](#logic-app-resource), one or more [connection resource definitions](#connection-resource-definitions) if any, and any other resources that your logic app needs for deployment.

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {<template-parameters>},
   "variables": {},
   "functions": [],
   "resources": [
      {
         <logic-app-resource-definition>
      },
      // Connection resource definitions, if any
      {
         <connection-resource-definition-1>
      },
      {
         <connection-resource-definition-2>
      }
   ],
   "outputs": {}
}
```

> [!NOTE]
> Templates can include resource definitions for multiple logic apps, so make sure that all your logic app resources specify the same Azure resource group. When you deploy the template to an Azure resource group by using Visual Studio, you're prompted for which logic app that you want to open. Also, your Azure resource group project can contain more than one template, so make sure that you select the correct parameter file when prompted.

For general information about template resources and their attributes, see these topics:

* [Resources - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#resources)

* [Best practices for template resources](../azure-resource-manager/template-best-practices.md#resources).

<a name="logic-app-resource"></a>

### Logic app resource definition

Your logic app's resource definition starts with a properties section, which includes this information:

* Your logic app's state at deployment
* The ID for any integration account used by your logic app
* Your logic app's workflow definition
* A parameters section that specifies the values to use at runtime
* Other resource information about your logic app, such as name, type, location, and so on

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {<template-parameters>},
   "variables": {},
   "functions": [],
   "resources": [
      {
         // Start logic app resource definition
         "properties": {
            "state": "<Enabled or Disabled>",
            "integrationAccount": {
               "id": "[parameters('LogicAppIntegrationAccount')]" // Template parameter reference
            },
            "definition": {<workflow-definition>},
            "parameters": {<workflow-definition-parameter-values>},
            "accessControl": {}
         },
         "name": "[parameters('LogicAppName')]", // Template parameter reference
         "type": "Microsoft.Logic/workflows",
         "location": "[parameters('LogicAppLocation')]", // Template parameter reference
         "tags": {
           "displayName": "LogicApp"
         },
         "apiVersion": "2016-06-01",
         "dependsOn": [
         ]
      }
      // End logic app resource definition
   ],
   "outputs": {}
}
```

Here are the attributes that are specific to your logic app resource definition:

| Attribute | Required | Type | Description |
|-----------|----------|------|-------------|
| `state` | Yes | String | Your logic app's state at deployment where `Enabled` means your logic app is live and `Disabled` means that your logic app is inactive. For example, if you're not ready for your logic app to go live but want to deploy a draft version, you can use the `Disabled` option. |
| `integrationAccount` | No | Object | If your logic app uses an integration account, which stores artifacts for business-to-business (B2B) scenarios, this attribute includes the `id` attribute, which specifies the ID for the integration account. |
| `definition` | Yes | Object | Your logic app's underlying workflow definition, which specifies the Workflow Definition Language schema version to use and definitions for the trigger, actions, workflow definition parameters, outputs, and so on. For more information, see [Workflow definition and parameters](#workflow-definition-and-parameters). <p><p>To view the attributes in your logic app's workflow definition, switch from "design view" to "code view" in the Azure portal or Visual Studio, or by using a tool such as [Azure Resource Explorer](http://resources.azure.com). |
| `parameters` | No | Object | The [workflow definition parameter values](#workflow-definition-parameter-values) to use at your logic app's runtime. The parameter definitions for these values appear inside your [workflow definition's parameters section](#workflow-definition-and-parameters). Also, if your logic app uses [managed connectors](../connectors/apis-list.md) for accessing other services and systems, this attribute includes a `$connections` attribute that specifies the connection values to use at runtime. |
| `accessControl` | No | Object | For specifying security attributes for your logic app, such as restricting IP access to request triggers or run history inputs and outputs. For more information, see [Secure access to logic apps](../logic-apps/logic-apps-securing-a-logic-app.md). |
||||

For information about general resource attributes, see [Resources - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#resources).

<a name="workflow-definition-and-parameters"></a>

### Workflow definition and parameters

Your logic app's workflow definition appears in the `definition` section, which is inside the properties section for your logic app resource definition. The `definition` section is the same section that's fully described in the [Schema reference for Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md) topic. Your workflow definition has a `parameters` section where you can define new or edit existing parameters for values that your workflow definition uses at runtime. You can then reference these parameters inside the trigger or actions in your workflow. By default, this `parameters` section is empty unless your logic app creates connections to other services and systems through [managed connectors](../connectors/apis-list.md).

To specify the values for workflow definition parameters, use the next-level `parameters` section that's *outside* your workflow definition but still *inside* your logic app's resource definition. In this outer parameters section, you can reference previously defined parameters, which can accept values at deployment from a parameter file.

This syntax shows where you define the parameters at both template and workflow definition levels along with where you use the parameter values by referencing the parameters for both the template and workflow definition.

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   // Template parameters
   "parameters": {
      "<template-parameter-name>": {
         "type": "<parameter-type>",
         "defaultValue": "<parameter-default-value>",
         "metadata": {
            "description": "<parameter-description>"
         }
      }
   },
   "variables": {},
   "functions": [],
   "resources": [
      {
         // Start logic app resource definition
         "properties": {
            <other-logic-app-resource-properties>,
            "definition": {
               "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
               "actions": {<action-definitions>},
               // Workflow definition parameters
               "parameters": {
                  "<workflow-definition-parameter-name>": {
                     "type": "<parameter-type>",
                     "defaultValue": "<parameter-default-value>",
                     "metadata": {
                        "description": "<parameter-description>"
                     }
                  }
               },
               "triggers": {
                  "<trigger-name>": {
                     "type": "<trigger-type>",
                     "inputs": {
                         // Workflow definition parameter reference
                         "<attribute-name>": "@parameters('<workflow-definition-parameter-name')"
                     }
                  }
               },
               <...>
            },
            // Workflow definition parameter value
            "parameters": {
               "<workflow-definition-parameter-name>": "[parameters('<template-parameter-name>')]"
            },
            "accessControl": {}
         },
         <other-logic-app-resource-definition-attributes>
      }
      // End logic app resource definition
   ],
   "outputs": {}
}
```

```json
  {
     "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
     "contentVersion": "1.0.0.0",
     "parameters": {
        <previously-defined-template-parameters>,
        // New template parameters for passing workflow definition parameter values
        "TemplateAuthenticationType": {
           "type": "string",
           "defaultValue": "Basic",
           "metadata": {
              "description": "The type of authentication used for the Fabrikam portal"
           }
        },
        "TemplateFabrikamPassword": {
           "type": "securestring",
           "metadata": {
              "description": "The password for the Fabrikam portal"
           }
        },
        "TemplateFabrikamUserName": {
           "type": "securestring",
           "metadata": {
              "description": "The username for the Fabrikam portal"
           }
        }
     },
     "variables": {},
     "functions": [],
     "resources": [
        {
           // Start logic app resource definition
           "properties": {
              <other-logic-app-resource-properties>,
              // Start workflow definition
              "definition": {
                 "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
                 "actions": {
                 },
                 // Workflow definition parameters
                 "parameters": {
                    "authenticationType": {
                       "type": "string",
                       "defaultValue": "Basic",
                       "metadata": {
                          "description": "The type of authentication used for the Fabrikam portal"
                       }
                    },
                    "fabrikamPassword": {
                       "type": "securestring",
                       "metadata": {
                          "description": "The password for the Fabrikam portal"
                       }
                    },
                    "fabrikamUserName": {
                       "type": "securestring",
                       "metadata": {
                          "description": "The username for the Fabrikam portal"
                       }
                    }
                 },
                 "triggers": {
                    "HTTP": {
                       "inputs": {
                          "authentication": {
                             // Reference workflow definition parameters
                             "password": "@parameters('fabrikamPassword')",
                             "type": "@parameters('authenticationType')",
                             "username": "@parameters('fabrikamUserName')"
                          }
                       },
                       "recurrence": {<...>},
                       "type": "Http"
                    }
                 },
                 <...>
               },
               // End workflow definition
               // Start workflow definition parameter values
               "parameters": {
                  "authenticationType": "[parameters('TemplateAuthenticationType')]", // Template parameter reference
                  "fabrikamPassword": "[parameters('TemplateFabrikamPassword')]", // Template parameter reference
                  "fabrikamUserName": "[parameters('TemplateFabrikamUserName')]" // Template parameter reference
               },
               "accessControl": {}
            },
            <other-logic-app-resource-attributes>
         }
         // End logic app resource definition
     ],
     "outputs": {}
   }
   ```

To make sure that the Logic App Designer can correctly show workflow definition parameters, note these practices:

* You can define parameters for these kinds of triggers and actions:

  * Azure Functions app

  * Nested or child logic app workflow

  * API Management call

  * The runtime URL for an API connection

  * The `path` attribute for an APIConnection trigger or action

* Include the `defaultValue` attribute, which can specify empty values, for all parameters except for values that are sensitive or must be secured. Always use secured parameters for user names, passwords, and secrets. To hide or protect sensitive parameter values, follow the guidance in these topics:

  * [Security recommendations for action and input parameters](../logic-apps/logic-apps-securing-a-logic-app.md#secure-action-parameters-and-inputs)

  * [Pass secure parameter values with Azure Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md)

For more information about workflow definition parameters, see [Parameters - Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md#parameters).

This example shows just the template parameters for the values used to create and deploy these resources in Azure:

* Name and location for your logic app

* Values for connecting to an Office 365 Outlook account

* Values for connecting to an Azure Blob storage account, including an access key

* ID to use for an integration account that's linked to the logic app

Except for the parameter that uses the `securestring` type because the value is an access key, all the other parameters include `defaultValue` attributes, although in some cases, the default values are empty values. For more information, see [Best practices for template parameters](../azure-resource-manager/template-best-practices.md#parameters). The values provided for these template parameters are in the sample [parameter file](#template-parameter-files) that's described later in this topic.

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   // Template parameters
   "parameters": {
      "LogicAppName": {
         "type": "string",
         "minLength": 1,
         "maxLength": 80,
         "defaultValue": "MyLogicApp",
         "metadata": {
            "description": "The resource name for the logic app"
         }
      },
      "LogicAppLocation": {
         "type": "string",
         "min length": 1,
         "defaultValue": "[resourceGroup().location]",
         "metadata": {
            "description": "The resource location for the logic app"
         }
      },
      "office365_1_Connection_Name": {
         "type": "string",
         "defaultValue": "office365",
         "metadata": {
            "description": "The resource name for the Office 365 Outlook connection"
         }
      },
      "office365_1_Connection_DisplayName": {
         "type": "string",
         "defaultValue": "",
         "metadata": {
            "description": "The display name for the Office 365 Outlook connection"
         }
      },
      "azureblob_1_Connection_Name": {
         "type": "string",
         "defaultValue": "azureblob",
         "metadata": {
            "description": "The resource name for the Azure Blob storage account connection"
         }
      },
      "azureblob_1_Connection_DisplayName": {
         "type": "string",
         "defaultValue": "",
         "metadata": {
            "description": "The display name for the Azure Blob storage account connection"
         },

      },
      "azureblob_1_accountName": {
         "type": "string",
         "defaultValue": "",
         "metadata": {
            "description": "Name of the storage account the connector should use."
         }
      },
      "azureblob_1_accessKey": {
         "type": "securestring",
         "metadata": {
            "description": "Specify a valid primary/secondary storage account access key."
         }
      },
      "LogicAppIntegrationAccount": {
         "type":"string",
         "minLength": 1,
         "defaultValue": "/subscriptions/<Azure-subscription-ID>/resourceGroups/fabrikam-integration-account-rg/providers/Microsoft.Logic/integrationAccounts/fabrikam-integration-account",
         "metadata": {
            "description": "The ID to use for the integration account"
         }
      }
   },
   "variables": {},
   "functions": [],
   "resources": [],
   "outputs": {}
}
```

<a name="workflow-definition-parameter-values"></a>

## Workflow definition parameter values


  ```json
  {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {<template-parameter-definitions>},
      "variables": {},
      "functions": [],
      "resources": [
         {
            // Start logic app resource definition
            "properties": {
               <...>
               // Start workflow definition
               "definition": {
                  "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
                  "actions": {},
                  "parameters": {<workflow-parameter-definitions>},
                  "triggers": {},
                  <...>
               },
               "parameters": {<workflow-parameter-values>},
               "accessControl": {}
            },
            <more-logic-app-resource attributes>
            // End logic app resource definition
         },
     ],
     "outputs": {}
   }
   ```

<a name="connection-resource-definitions"></a>

## Connection resource definitions

Your template's `resources` attribute defines the resources that you want to create and deploy, including resources for any connections that your logic app creates and uses. This attribute has a `properties` attribute that defines your logic app resource and includes a `parameters` attribute in which the `$connections` attribute specifies the values for any connections that your workflow definition uses at runtime. These values use template expressions that reference resources that securely store metadata for the connections that your logic app creates and uses through [managed connectors](../connectors/apis-list.md). This metadata can include information such as connection strings and access tokens, which you can provide in a parameter file and pass through your template's parameters for use at deployment.

However, the `$connections` parameter definition itself appears *inside* your workflow definition's `definition` attribute, which has a `parameters` attribute that defines parameters for the values that your workflow definition accepts at runtime. The difference between whether parameter values are available at deployment versus runtime affect the syntax that you use for expressions that [reference parameters](#parameter-references) and the values that they can access.

This structure shows the different locations where the `$connections` parameter is defined and where the `$connection` parameter values are specified:

```json
{
   <other-template-attributes>
   "resources": [
      {
         // Logic app resource definition starts here
         "properties": {
            "definition": {
               <other-workflow-definition-attributes>,
               // Parameter definitions for values to use at runtime
               "parameters": {
                  // Parameter definitions for connection values to use at runtime
                  "$connections": {
                    "defaultValue": {},
                    "type": "Object"
                  }
               },
               <other-workflow-definition-attributes>
            },
            // Parameter values for use at runtime by workflow definition
            "parameters": {
               // Connection values to use at runtime by workflow definition
               "$connections": {},
            },
         },
         <logic-app-resource-definition>
      },
      // Logic app resource definition ends here
      // Connection resource definitions start here
      {
         <connection-resource-definition>
      }
   ],
   "outputs": {}
}
```

In your template, the `$connections` attribute appears in a different location compared to when you use code view in the Azure portal or Visual Studio to view the `$connections` attribute. In code view, the `$connections` attribute still appears outside the `definition` attribute for your workflow definition but at the same level:

```json
{
   "$connections": {<workflow-definition-parameter-values-for-connections>},
   "definition": {<workflow-definition>}
}
```

> [!NOTE]
> Make sure that connections in your template use the same Azure resource group and location as your logic app. Also, each connection that you create has a unique name in Azure. When you create multiple connections to the same service or system, each connection name is appended with a number, which increments with each new connection created, for example, `office365`, `office365-1`, and so on.

This example shows only the `$connections` workflow definition parameter that accepts the runtime values for the connections used by your logic app's workflow definition.

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {<template-parameters>},
   "variables": {},
   "functions": [],
   "resources": [
      {
         "properties": {
            "state": "Enabled",
            // Workflow definition starts here
            "definition": {
               "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
               "actions": {},
               // Workflow definition parameters
               "parameters": {
                  // Workflow definition parameters for connections
                  "$connections": {
                     "defaultValue": {},
                     "type": "Object"
                  }
               },
               "triggers": {},
               "contentVersion": "1.0.0.0",
               "outputs": {}
            },
            // Workflow definition ends here
            "parameters": {
               "$connections": {
                  "value": {
                     "<connection-values-for-workflow-definition-parameters>"
                  }
               },
               <other-workflow-definition-parameter-values>
            }
         }
      }
   ],
   "outputs": {}
}
```

This example just shows the workflow definition parameter value for the Office 365 Outlook connection, the logic app's resource definition, which specifies a dependency on that connection, and the connection's resource definition:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {},
   "variables": {},
   "functions": [],
   "resources": [
      {
         "properties": {
            "state": "Enabled",
            "definition": {
            },
            "parameters": {
               // Connection values for workflow definition parameters
               "$connections": {
                  "value": {
                     // Office 365 Outlook connection values for workflow definition parameters
                    "office365": {
                        // Connector ID, which must use same location as logic app
                        // To reference the resource group location instead, use resourceGroup().location
                        "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'office365')]",
                        // Reference the template parameter for `office365_1_Connection_Name`
                        "connectionId": "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]",
                        // Reference the template parameter for `office365_1_Connection_Name`
                        "connectionName": "[parameters('office365_1_Connection_Name')]"
                     }
                  }
               }
            }
         },
         // Logic app resource information
         "name": "[parameters('LogicAppName')]",
         "type": "Microsoft.Logic/workflows",
         "location": "[parameters('LogicAppLocation')]",
         "tags": {
            "displayName": "LogicApp"
         },
         "apiVersion": "2016-06-01",
         "dependsOn": [
            // Reference the template parameter for 'office365_1_Connection_Name`
            "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]"
         ]
      },
      {
         // Office 365 Outlook API connection resource definition
         "type": "MICROSOFT.WEB/CONNECTIONS",
         "apiVersion": "2016-06-01",
         "name": "[parameters('office365_1_Connection_Name')]",
         "location": "[parameters('LogicAppLocation')]",
         "properties": {
            "api": {
               "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'office365')]"
            },
            "displayName": "[parameters('office365_1_Connection_DisplayName')]"
         }
      }
   ],
   "outputs": {}
}
```

For a connection that requires authentication, the resource definition includes a `parameterValues` attribute, which specifies the authentication values in name-value pair format to use. You can then provide those values in the [template parameter file](#template-parameter-files).

Here is an example that specifies the account name and access key for an Azure Blob storage account connection:

```json
// Azure Blob Storage API connection resource definition
{
   "type": "MICROSOFT.WEB/CONNECTIONS",
   "apiVersion": "2016-06-01",
   "name": "[parameters('azureblob_1_Connection_Name')]",
   "location": "[parameters('LogicAppLocation')]",
   "properties": {
      "api": {
         "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'azureblob')]"
      },
      "displayName": "[parameters('azureblob_1_Connection_DisplayName')]",
      // Reference the template parameters for the authentication values to use
      "parameterValues": {
         "accountName": "[parameters('azureblob_1_accountName')]",
         "accessKey": "[parameters('azureblob_1_accessKey')]"
      }
   }
}
```

<a name="parameter-references"></a>

## References to parameters

To reference template parameters, you can use template expressions with [template functions](../azure-resource-manager/resource-group-template-functions.md), which are evaluated at deployment. Template expressions use square brackets (**[]**):

`"<attribute-name>": "[parameters('<template-parameter-name>')]"`

To reference workflow definition parameters, you use [Workflow Definition Language expressions and functions](../logic-apps/workflow-definition-language-functions-reference.md), which are evaluated at runtime. You might notice that some template functions and workflow definition functions have the same name. Workflow definition expressions start with the "at" symbol (**@**):

`"<attribute-name>": "@parameters('<workflow-definition-parameter-name>')"`

You can pass template parameter values to your workflow definition for your logic app to use at runtime. However, avoid mixing template expressions and syntax inside workflow definition expressions, which complicates your code due to the differences in when these expressions are evaluated. Instead, here's a way to pass values through your template parameters to your workflow definition and avoid referencing template parameters inside your workflow definition:

1. In your workflow definition's parameters section, define the parameters for the values that you want your logic app to accept and use at runtime.

1. In the parameters section that's *outside* your workflow definition but still *inside* your logic app's resource definition, specify the values for your workflow definition parameters by referencing the template parameters you want.

Here's an example that 

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
     <previously-defined-template-parameters>,
     // More template parameters for passing values to workflow definition parameters
     "TemplateFabrikamPassword": {
        "type": "securestring",
        "metadata": {
           "description": "The password for the Fabrikam portal"
        }
     },
     "TemplateFabrikamUserName": {
        "type": "securestring",
        "metadata": {
           "description": "The username for the Fabrikam portal"
        }
     }
  },
  "variables": {},
  "functions": [],
  "resources": [
     {
        // Start logic app resource definition
        "properties": {
           <other-logic-app-resource-properties>,
           // Start workflow definition
           "definition": {
              "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
              "actions": {<action-definitions>},
              // Workflow definition parameters
              "parameters": {
                 "fabrikamPassword": {
                    "type": "securestring"
                 },
                 "fabrikamUserName": {
                    "type": "securestring"
                 }
              },
              "triggers": {
                 "HTTP": {
                    "inputs": {
                       "authentication": {
                          "password": "@parameters('fabrikamPassword')",
                          "type": "Basic",
                          "username": "@parameters('fabrikamUserName')"
                       }
                    },
                    "recurrence": {<...>},
                    "type": "Http"
                 }
              },
              <...>
           },
           // End workflow definition
           // Workflow definition parameter values
           "parameters": {
              "fabrikamPassword": "[parameters('TemplateFabrikamPassword')]", // Template parameter reference
              "fabrikamUserName": "[parameters('TemplateFabrikamUserName')]" // Template parameter reference
           },
           "accessControl": {}
        },
        <other-logic-app-resource-attributes>
      }
      // End logic app resource definition
   ],
   "outputs": {}
}
```

<a name="full-example-template"></a>

## Full example template

Here is the parameterized sample template that's used by this topic's examples:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
   "parameters": {
      "LogicAppName": {
         "type": "string",
         "minLength": 1,
         "maxLength": 80,
         "defaultValue": "MyLogicApp",
         "metadata": {
            "description": "The resource name to use for the logic app"
         }
      },
      "LogicAppLocation": {
         "type": "string",
         "min length": 1,
         "defaultValue": "[resourceGroup().location]",
         "metadata": {
            "description": "The resource location to use for the logic app"
         }
      },
      "office365_1_Connection_Name": {
         "type": "string",
         "defaultValue": "office365",
         "metadata": {
            "description": "The resource name to use for the Office 365 Outlook connection"
         }
      },
      "office365_1_Connection_DisplayName": {
         "type": "string",
         "defaultValue": "",
         "metadata": {
            "description": "The display name to use for the Office 365 Outlook connection"
         }
      },
      "azureblob_1_Connection_Name": {
         "type": "string",
         "defaultValue": "azureblob",
         "metadata": {
            "description": "The resource name to use for the Azure Blob storage account connection"
         }
      },
      "azureblob_1_Connection_DisplayName": {
         "type": "string",
         "defaultValue": "",
         "metadata": {
            "description": "Name of the storage account the connector should use."
         },

      },
      "azureblob_1_accountName": {
         "type": "string",
         "defaultValue": "",
         "metadata": {
            "description": "Name of the storage account the connector should use."
         }
      },
      "azureblob_1_accessKey": {
         "type": "securestring",
         "metadata": {
            "description": "Specify a valid primary/secondary storage account access key."
         }
      },
      "LogicAppIntegrationAccount": {
         "type":"string",
         "minLength": 1,
         "defaultValue": "/subscriptions/<Azure-subscription-ID>/resourceGroups/fabrikam-integration-account-rg/providers/Microsoft.Logic/integrationAccounts/fabrikam-integration-account",
         "metadata": {
            "description": "The ID to use for the integration account"
         }
      }
   },
   "variables": {},
   "resources": [
      {
         "properties": {
            "state": "Enabled",
            "integrationAccount": {
              "id": "[parameters('LogicAppIntegrationAccount')]"
            },
            "definition": {
               "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
               "actions": {
                  "Create_blob": {
                     "type": "ApiConnection",
                     "inputs": {
                        "host": {
                           "connection": {
                              "name": "@parameters('$connections')['azureblob']['connectionId']"
                           }
                        },
                     },
                     "method": "post",
                     "body": "@triggerBody()?['Body']",
                     "path": "/datasets/default/files",
                     "queries": {
                        "folderPath": "/emails",
                        "name": "@triggerBody()?['Subject']",
                        "queryParametersSingleEncoded": true
                     },
                     "runAfter": {},
                     "runtimeConfiguration": {
                        "contentTransfer": {
                           "transferMode": "Chunked"
                        }
                     }
                  }
               },
               "parameters": {
                  "$connections": {
                     "defaultValue": {},
                     "type": "Object"
                  }
               },
               "triggers": {
                  "When_a_new_email_arrives": {
                     "type": "ApiConnection",
                     "inputs": {
                        "host": {
                           "connection": {
                              "name": "@parameters('$connections')['office365']['connectionId']"
                           }
                        },
                        "method": "get",
                        "path": "/Mail/OnNewEmail",
                        "queries": {
                           "folderPath": "Inbox",
                           "importance": "Any",
                           "fetchOnlyWithAttachment": false,
                           "includeAttachments": false
                        }
                     },
                     "recurrence": {
                        "frequency": "Day",
                        "interval": 1
                     },
                     "splitOn": "@triggerBody()?['value']"
                  }
               },
               "contentVersion": "1.0.0.0",
               "outputs": {}
            },
            "parameters": {
               "$connections": {
                  "value": {
                     "azureblob": {
                        "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'azureblob')]",
                        "connectionId": "[resourceId('Microsoft.Web/connections', parameters('azureblob_1_Connection_Name'))]",
                        "connectionName": "[parameters('azureblob_1_Connection_Name')]"
                     },
                     "office365": {
                        "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'office365')]",
                        "connectionId": "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]",
                        "connectionName": "[parameters('office365_1_Connection_Name')]"
                     }
                  }
               }
            },
            "accessControl": {}
         },
         "name": "[parameters('LogicAppName')]",
         "type": "Microsoft.Logic/workflows",
         "location": "[parameters('LogicAppLocation')]",
         "tags": {
            "displayName": "LogicApp"
         },
         "apiVersion": "2016-06-01",
         "dependsOn": [
            "[resourceId('Microsoft.Web/connections', parameters('azureblob_1_Connection_Name'))]",
            "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]"
         ]
      },
      {
         "type": "MICROSOFT.WEB/CONNECTIONS",
         "apiVersion": "2016-06-01",
         "name": "[parameters('office365_1_Connection_Name')]",
         "location": "[parameters('LogicAppLocation')]",
         "properties": {
            "api": {
                "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'office365')]"
            },
            "displayName": "[parameters('office365_1_Connection_DisplayName')]"
         }
      },
      {
         "type": "MICROSOFT.WEB/CONNECTIONS",
         "apiVersion": "2016-06-01",
         "name": "[parameters('azureblob_1_Connection_Name')]",
         "location": "[parameters('LogicAppLocation')]",
         "properties": {
            "api": {
               "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'azureblob')]"
            },
            "displayName": "[parameters('azureblob_1_Connection_DisplayName')]",
            "parameterValues": {
               "accountName": "[parameters('azureblob_1_accountName')]",
               "accessKey": "[parameters('azureblob_1_accessKey')]"
            }
         }
      }
   ],
   "outputs": {}
}
```

## Authorize OAuth connections

At deployment, your logic app works end-to-end with valid parameters. However, you must still authorize OAuth connections to generate a valid access token. Here are ways that you can authorize OAuth connections:

* For automated deployment, you can use a script that provides consent for each OAuth connection. Here's an example script in GitHub in the [LogicAppConnectionAuth](https://github.com/logicappsio/LogicAppConnectionAuth) project.

* To manually authorize OAuth connections, open your logic app in Logic App Designer. In the designer, authorize any required connections.

## Next steps

> [!div class="nextstepaction"]
> [Create logic app templates](../logic-apps/logic-apps-create-azure-resource-manager-templates.md)