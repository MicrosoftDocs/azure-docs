---
title: Azure Resource Manager templates for Azure Logic Apps
description: Learn about Azure Resource Manager templates to automate deployment for Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 08/20/2022
---

# Overview: Automate deployment for Azure Logic Apps by using Azure Resource Manager templates

[!INCLUDE [logic-apps-sku-consumption](../../includes/logic-apps-sku-consumption.md)]

When you're ready to automate creating and deploying your logic app, you can expand your logic app's underlying workflow definition into an [Azure Resource Manager template](../azure-resource-manager/management/overview.md). This template defines the infrastructure, resources, parameters, and other information for provisioning and deploying your logic app. By defining parameters for values that vary at deployment, also known as *parameterizing*, you can repeatedly and consistently deploy logic apps based on different deployment needs.

For example, if you deploy to environments for development, test, and production, you likely use different connection strings for each environment. You can declare template parameters that accept different connection strings and then store those strings in a separate [parameters file](../azure-resource-manager/templates/parameter-files.md). That way, you can change those values without having to update and redeploy the template. For scenarios where you have parameter values that are sensitive or must be secured, such as passwords and secrets, you can store those values in [Azure Key Vault](../azure-resource-manager/templates/key-vault-parameter.md) and have your parameters file retrieve those values. However, in these scenarios, you'd redeploy to retrieve the current values.

This overview describes the attributes in a Resource Manager template that includes a logic app workflow definition. Both the template and your workflow definition use JSON syntax, but some differences exist because the workflow definition also follows the [Workflow Definition Language schema](../logic-apps/logic-apps-workflow-definition-language.md). For example, template expressions and workflow definition expressions differ in how they [reference parameters](#parameter-references) and the values that they can accept.

> [!TIP]
> For the easiest way to get a valid parameterized logic app template that's mostly ready for deployment, use Visual Studio (free Community edition or greater) and the Azure Logic Apps Tools for Visual Studio. You can then either [create your logic app in Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md) or [find and download an existing logic app from Azure into Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md).
>
> Or, you can create logic app templates by using [Azure PowerShell with the LogicAppTemplate module](../logic-apps/logic-apps-create-azure-resource-manager-templates.md#azure-powershell).

The example logic app in this topic uses an [Office 365 Outlook trigger](/connectors/office365/) that fires when a new email arrives and an [Azure Blob Storage action](/connectors/azureblob/) that creates a blob for the email body and uploads that blob to an Azure storage container. The examples also show how to parameterize values that vary at deployment.

For more information about Resource Manager templates, see these topics:

* [Azure Resource Manager template structure and syntax](../azure-resource-manager/templates/syntax.md)
* [Azure Resource Manager template best practices](../azure-resource-manager/templates/best-practices.md)
* [Develop Azure Resource Manager templates for cloud consistency](../azure-resource-manager/templates/template-cloud-consistency.md)

For template resource information specific to logic apps, integration accounts, integration account artifacts, and integration service environments, see [Microsoft.Logic resource types](/azure/templates/microsoft.logic/allversions).

For sample logic app templates, see these examples:

* [Full template](#full-example-template) that's used for this topic's examples
* [Sample quickstart logic app template](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.logic/logic-app-create/azuredeploy.json) in GitHub

For the Logic Apps REST API, start with the [Azure Logic Apps REST API overview](/rest/api/logic).

<a name="template-structure"></a>

## Template structure

At the top level, a Resource Manager template follows this structure, which is fully described in the [Azure Resource Manager template structure and syntax](../azure-resource-manager/templates/syntax.md) topic:

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

For a logic app template, you primarily work with these template objects:

| Attribute | Description |
|-----------|-------------|
| `parameters` | Declares the [template parameters](../azure-resource-manager/templates/syntax.md#parameters) for accepting the values to use when creating and customizing resources for deployment in Azure. For example, these parameters accept the values for your logic app's name and location, connections, and other resources necessary for deployment. You can store these parameter values in a [parameters file](#template-parameter-files), which is described later in this topic. For general details, see [Parameters - Resource Manager template structure and syntax](../azure-resource-manager/templates/syntax.md#parameters). |
| `resources` | Defines the [resources](../azure-resource-manager/templates/syntax.md#resources) to create or update and deploy to an Azure resource group, such as your logic app, connections, Azure storage accounts, and so on. For general details, see [Resources - Resource Manager template structure and syntax](../azure-resource-manager/templates/syntax.md#resources). |
|||

Your logic app template uses this file name format:

**<*logic-app-name*>.json**

> [!IMPORTANT]
> Template syntax is case-sensitive so make sure that you use consistent casing. 

<a name="template-parameters"></a>

## Template parameters

A logic app template has multiple `parameters` objects that exist at different levels and perform different functions. For example, at the top level, you can declare [template parameters](../azure-resource-manager/templates/syntax.md#parameters) for the values to accept and use at deployment when creating and deploying resources in Azure, for example:

* Your logic app
* Connections that your logic app uses to access other services and systems through [managed connectors](../connectors/managed.md)
* Other resources that your logic app needs for deployment

  For example, if your logic app uses an [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) for business-to-business (B2B) scenarios, the template's top level `parameters` object declares the parameter that accepts the resource ID for that integration account.

Here is the general structure and syntax for a parameter definition, which is fully described by [Parameters - Resource Manager template structure and syntax](../azure-resource-manager/templates/syntax.md#parameters):

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
         "minLength": 1,
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

Except for parameters that handle values that are sensitive or must be secured, such as usernames, passwords, and secrets, all these parameters include `defaultValue` attributes, although in some cases, the default values are empty values. The deployment values to use for these template parameters are provided by the sample [parameters file](#template-parameter-files) described later in this topic.

For more information about securing template parameters, see these topics:

* [Security recommendations for template parameters](../azure-resource-manager/templates/best-practices.md#parameters)
* [Improve security for template parameters](../logic-apps/logic-apps-securing-a-logic-app.md#secure-parameters-deployment-template)
* [Pass secured parameter values with Azure Key Vault](../azure-resource-manager/templates/key-vault-parameter.md)

Other template objects often reference template parameters so that they can use the values that pass through template parameters, for example:

* Your [template's resources object](#template-resources), described later in this topic, defines each resource in Azure that you want to create and deploy, such as your [logic app's resource definition](#logic-app-resource-definition). These resources often use template parameter values, such as your logic app's name and location and connection information.

* At a deeper level in your logic app's resource definition, your [workflow definition's parameters object](#workflow-definition-parameters) declares parameters for the values to use at your logic app's runtime. For example, you can declare workflow definition parameters for the username and password that an HTTP trigger uses for authentication. To specify the values for workflow definition parameters, use the `parameters` object that's *outside* your workflow definition but still *inside* your logic app's resource definition. In this outer `parameters` object, you can reference previously declared template parameters, which can accept values at deployment from a parameters file.

When referencing parameters, template expressions and functions use different syntax and behave differently from workflow definition expressions and functions. For more information about these differences, see [References to parameters](#parameter-references) later in this topic.

<a name="best-practices-template-parameters"></a>

## Best practices - template parameters

Here are some best practices for defining parameters:

* Declare parameters only for values that vary, based on your deployment needs. Don't declare parameters for values that stay the same across different deployment requirements.

* Include the `defaultValue` attribute, which can specify empty values, for all parameters except for values that are sensitive or must be secured. Always use secured parameters for user names, passwords, and secrets. To hide or protect sensitive parameter values, follow the guidance in these topics:

  * [Security recommendations for template parameters](../azure-resource-manager/templates/best-practices.md#parameters)

  * [Improve security for template parameters](../logic-apps/logic-apps-securing-a-logic-app.md#secure-parameters-deployment-template)

  * [Pass secured parameter values with Azure Key Vault](../azure-resource-manager/templates/key-vault-parameter.md)

* To differentiate template parameter names from workflow definition parameter names, you can use descriptive template parameter names, for example: `TemplateFabrikamPassword`

For more template best practices, see [Best practices for template parameters](../azure-resource-manager/templates/best-practices.md#parameters).

<a name="template-parameter-files"></a>

## Template parameters file

To provide the values for template parameters, store those values in a [parameters file](../azure-resource-manager/templates/parameter-files.md). That way, you can use different parameters files based on your deployment needs. Here is the file name format to use:

* Logic app template file name: **<*logic-app-name*>.json**
* Parameters file name: **<*logic-app-name*>.parameters.json**

Here is the structure inside the parameters file, which includes a key vault reference for [passing a secured parameter value with Azure Key Vault](../azure-resource-manager/templates/key-vault-parameter.md):

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
               "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group-name>/Microsoft.KeyVault/vaults/<key-vault-name>"
            },
            "secretName: "<secret-name>"
         }
      },
      <other-parameter-values>
   }
}
```

This example parameters file specifies the values for the template parameters declared earlier in this topic:

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
      }
   }
}
```

<a name="template-resources"></a>

## Template resources

Your template has a `resources` object, which is an array that contains definitions for each resource to create and deploy in Azure, such as your [logic app's resource definition](#logic-app-resource-definition), [connection resource definitions](#connection-resource-definitions), and any other resources that your logic app needs for deployment.

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
      // Start connection resource definitions
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
> Templates can include resource definitions for multiple logic apps, so make sure that all your logic app resources specify the same Azure resource group. When you deploy the template to an Azure resource group by using Visual Studio, you're prompted for which logic app that you want to open. Also, your Azure resource group project can contain more than one template, so make sure that you select the correct parameters file when prompted.

<a name="view-resource-definitions"></a>

### View resource definitions

To review the resource definitions for all the resources in an Azure resource group, [download your logic app from Azure into Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md), which is the easiest way to create a valid parameterized logic app template that's mostly ready for deployment.

For general information about template resources and their attributes, see these topics:

* [Resources - Resource Manager template structure and syntax](../azure-resource-manager/templates/syntax.md#resources)
* [Best practices for template resources](../azure-resource-manager/templates/best-practices.md#resources)

<a name="logic-app-resource-definition"></a>

### Logic app resource definition

Your logic app's [workflow resource definition in a template](/azure/templates/microsoft.logic/workflows) starts with the `properties` object, which includes this information:

* Your logic app's state at deployment
* The ID for any integration account used by your logic app
* Your logic app's workflow definition
* A `parameters` object that sets the values to use at runtime
* Other resource information about your logic app, such as name, type, location, any runtime configuration settings, and so on

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
            "accessControl": {},
            "runtimeConfiguration": {}
         },
         "name": "[parameters('LogicAppName')]", // Template parameter reference
         "type": "Microsoft.Logic/workflows",
         "location": "[parameters('LogicAppLocation')]", // Template parameter reference
         "tags": {
           "displayName": "LogicApp"
         },
         "apiVersion": "2019-05-01",
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
| `integrationAccount` | No | Object | If your logic app uses an integration account, which stores artifacts for business-to-business (B2B) scenarios, this object includes the `id` attribute, which specifies the ID for the integration account. |
| `definition` | Yes | Object | Your logic app's underlying workflow definition, which is the same object that appears in code view and is fully described in the [Schema reference for Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md) topic. In this workflow definition, the `parameters` object declares parameters for the values to use at logic app runtime. For more information, see [Workflow definition and parameters](#workflow-definition-parameters). <p><p>To view the attributes in your logic app's workflow definition, switch from "design view" to "code view" in the Azure portal or Visual Studio, or by using a tool such as [Azure Resource Explorer](https://resources.azure.com). |
| `parameters` | No | Object | The [workflow definition parameter values](#workflow-definition-parameters) to use at logic app runtime. The parameter definitions for these values appear inside your [workflow definition's parameters object](#workflow-definition-parameters). Also, if your logic app uses [managed connectors](../connectors/managed.md) for accessing other services and systems, this object includes a `$connections` object that sets the connection values to use at runtime. |
| `accessControl` | No | Object | For specifying security attributes for your logic app, such as restricting IP access to request triggers or run history inputs and outputs. For more information, see [Secure access to logic apps](../logic-apps/logic-apps-securing-a-logic-app.md). |
| `runtimeConfiguration` | No | Object | For specifying any `operationOptions` properties that control the way that your logic app behaves at run time. For example, you can run your logic app in [high throughput mode](../logic-apps/logic-apps-limits-and-config.md#run-high-throughput-mode). |
|||||

For more information about resource definitions for these Logic Apps objects, see [Microsoft.Logic resource types](/azure/templates/microsoft.logic/allversions):

* [Workflow resource definition](/azure/templates/microsoft.logic/workflows)
* [Integration service environment resource definition](/azure/templates/microsoft.logic/integrationserviceenvironments)
* [Integration service environment managed API resource definition](/azure/templates/microsoft.logic/integrationserviceenvironments/managedapis)

* [Integration account resource definition](/azure/templates/microsoft.logic/integrationaccounts)

* Integration account artifacts:

  * [Agreement resource definition](/azure/templates/microsoft.logic/integrationaccounts/agreements)

  * [Assembly resource definition](/azure/templates/microsoft.logic/integrationaccounts/assemblies)

  * [Batch configuration resource definition](/azure/templates/microsoft.logic/integrationaccounts/batchconfigurations)

  * [Certificate resource definition](/azure/templates/microsoft.logic/integrationaccounts/certificates)

  * [Map resource definition](/azure/templates/microsoft.logic/integrationaccounts/maps)

  * [Partner resource definition](/azure/templates/microsoft.logic/integrationaccounts/partners)

  * [Schema resource definition](/azure/templates/microsoft.logic/integrationaccounts/schemas)

  * [Session resource definition](/azure/templates/microsoft.logic/integrationaccounts/sessions)

<a name="workflow-definition-parameters"></a>

## Workflow definition and parameters

Your logic app's workflow definition appears in the `definition` object, which appears in the `properties` object inside your logic app's resource definition. This `definition` object is the same object that appears in code view and is fully described in the [Schema reference for Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md) topic. Your workflow definition includes an inner `parameters` declaration object where you can define new or edit existing parameters for the values that are used by your workflow definition at runtime. You can then reference these parameters inside the trigger or actions in your workflow. By default, this `parameters` object is empty unless your logic app creates connections to other services and systems through [managed connectors](../connectors/managed.md).

To set the values for workflow definition parameters, use the `parameters` object that's *outside* your workflow definition but still *inside* your logic app's resource definition. In this outer `parameters` object, you can then reference your previously declared template parameters, which can accept values at deployment from a parameters file.

> [!TIP]
>
> As a best practice, don't directly reference template parameters, which are evaluated at deployment, 
> from inside the workflow definition. Instead, declare a workflow definition parameter, which you can 
> then set in the `parameters` object that's *outside* your workflow definition but still *inside* your 
> logic app's resource definition. For more information, see [References to parameters](#parameter-references).

This syntax shows where you can declare parameters at both the template and workflow definition levels along with where you can set those parameter values by referencing the template and workflow definition parameters:

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
               "<workflow-definition-parameter-name>": { 
                  "value": "[parameters('<template-parameter-name>')]"
               }
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

<a name="secure-workflow-definition-parameters"></a>

### Secure workflow definition parameters

For a workflow definition parameter that handles sensitive information, passwords, access keys, or secrets at runtime, declare or edit the parameter to use the `securestring` or `secureobject` parameter type. You can reference this parameter throughout and within your workflow definition. At the template's top level, declare a parameter that has the same type to handle this information at deployment.

To set the value for the workflow definition parameter, use the `parameters` object that's *outside* your workflow definition but still *inside* your logic app resource definition to reference the template parameter. Finally, to pass the value to your template parameter at deployment, store that value in [Azure Key Vault](../azure-resource-manager/templates/key-vault-parameter.md) and reference that key vault in the [parameters file](#template-parameter-files) that's used by your template at deployment.

This example template shows how you can complete these tasks by defining secured parameters when necessary so that you can store their values in Azure Key Vault:

* Declare secured parameters for the values used to authenticate access.
* Use these values at both the template and workflow definition levels.
* Provide these values by using a parameters file.

**Template**

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {
      <previously-defined-template-parameters>,
      // Additional template parameters for passing values to use in workflow definition
      "TemplateAuthenticationType": {
         "type": "string",
         "defaultValue": "",
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
               "actions": {<action-definitions>},
               // Workflow definition parameters
               "parameters": {
                  "authenticationType": {
                     "type": "string",
                     "defaultValue": "",
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
               "authenticationType": {
                  "value": "[parameters('TemplateAuthenticationType')]" // Template parameter reference
               },
               "fabrikamPassword": {                  
                  "value": "[parameters('TemplateFabrikamPassword')]" // Template parameter reference
               },
               "fabrikamUserName": {
                  "value": "[parameters('TemplateFabrikamUserName')]" // Template parameter reference
               }
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

**Parameters file**

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
   "contentVersion": "1.0.0.0",
   // Template parameter values
   "parameters": {
      <previously-defined-template-parameter-values>,
     "TemplateAuthenticationType": {
        "value": "Basic"
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

<a name="best-practices-workflow-definition-parameters"></a>

## Best practices - workflow definition parameters

To make sure that the Logic App Designer can correctly show workflow definition parameters, follow these best practices:

* Include the `defaultValue` attribute, which can specify empty values, for all parameters except for values that are sensitive or must be secured.

* Always use secured parameters for user names, passwords, and secrets. To hide or protect sensitive parameter values, follow the guidance in these topics:

  * [Security recommendations for action parameters](../logic-apps/logic-apps-securing-a-logic-app.md#secure-action-parameters)

  * [Security recommendations for parameters in workflow definitions](../logic-apps/logic-apps-securing-a-logic-app.md#secure-parameters-workflow)

  * [Pass secure parameter values with Azure Key Vault](../azure-resource-manager/templates/key-vault-parameter.md)

For more information about workflow definition parameters, see [Parameters - Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md#parameters).

<a name="connection-resource-definitions"></a>

## Connection resource definitions

When your logic app creates and uses connections to other services and system by using [managed connectors](../connectors/managed.md), your template's `resources` object contains the resource definitions for those connections. Although you create connections from within a logic app, connections are separate Azure resources with their own resource definitions. To review these connection resource definitions, [download your logic app from Azure into Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md), which is the easiest way to create a valid parameterized logic app template that's mostly ready for deployment.

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
      // Start connection resource definitions
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

Connection resource definitions reference the template's top-level parameters for their values so you can provide these values at deployment by using a parameters file. Make sure that connections use the same Azure resource group and location as your logic app.

Here is an example resource definition for an Office 365 Outlook connection and the corresponding template parameters:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   // Template parameters
   "parameters": {
      "LogicAppName": {<parameter-definition>},
      "LogicAppLocation": {<parameter-definition>},
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
      }
   },
   "variables": {},
   "functions": [],
   "resources": [
      {
         <logic-app-resource-definition>
      },
      // Office 365 Outlook API connection resource definition
      {
         "type": "Microsoft.Web/connections",
         "apiVersion": "2016-06-01",
         // Template parameter reference for connection name
         "name": "[parameters('office365_1_Connection_Name')]",
         // Template parameter reference for connection resource location. Must match logic app location.
         "location": "[parameters('LogicAppLocation')]",
         "properties": {
            "api": {
               // Connector ID
               "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'office365')]"
            },
            // Template parameter reference for connection display name
            "displayName": "[parameters('office365_1_Connection_DisplayName')]"
         }
      }
   ],
   "outputs": {}
}
```

Your logic app's resource definition also works with connection resource definitions in these ways:

* Inside your workflow definition, the `parameters` object declares a `$connections` parameter for the connection values to use at logic app runtime. Also, the trigger or action that creates a connection uses the corresponding values that pass through this `$connections` parameter.

* *Outside* your workflow definition but still *inside* your logic app's resource definition, another `parameters` object sets the values to use at runtime for the `$connections` parameter by referencing the corresponding template parameters. These values use template expressions to reference resources that securely store the metadata for the connections in your logic app.

  For example, metadata can include connection strings and access tokens, which you can store in [Azure Key Vault](../azure-resource-manager/templates/key-vault-parameter.md). To pass those values to your template parameters, you reference that key vault in the [parameters file](#template-parameter-files) that's used by your template at deployment. For more information about differences in referencing parameters, see [References to parameters](#parameter-references) later in this topic.

  When you open your logic app's workflow definition in code view through the Azure portal or Visual Studio, the `$connections` object appears outside your workflow definition but at the same level. This ordering in code view makes these parameters easier to reference when you manually update the workflow definition:

  ```json
  {
     "$connections": {<workflow-definition-parameter-connection-values-runtime},
     "definition": {<workflow-definition>}
  }
  ```

* Your logic app's resource definition has a `dependsOn` object that specifies the dependencies on the connections used by your logic app.

Each connection that you create has a unique name in Azure. When you create multiple connections to the same service or system, each connection name is appended with a number, which increments with each new connection created, for example, `office365`, `office365-1`, and so on.

This example shows the interactions between your logic app's resource definition and a connection resource definition for Office 365 Outlook:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   // Template parameters
   "parameters": {
      "LogicAppName": {<parameter-definition>},
      "LogicAppLocation": {<parameter-definition>},
      "office365_1_Connection_Name": {<parameter-definition>},
      "office365_1_Connection_DisplayName": {<parameter-definition>}
   },
   "variables": {},
   "functions": [],
   "resources": [
      {
         // Start logic app resource definition
         "properties": {
            <...>,
            "definition": {
               <...>,
               "parameters": {
                  // Workflow definition "$connections" parameter
                  "$connections": {
                     "defaultValue": {},
                     "type": "Object"
                  }
               },
               <...>
            },
            "parameters": {
               // Workflow definition "$connections" parameter values to use at runtime
               "$connections": {
                  "value": {
                     "office365": {
                        // Template parameter references
                        "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'office365')]",
                        "connectionId": "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]",
                        "connectionName": "[parameters('office365_1_Connection_Name')]"
                     }
                  }
               }
            }
         },
         <other-logic-app-resource-information>,
         "dependsOn": [
            "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]"
         ]
         // End logic app resource definition
      },
      // Office 365 Outlook API connection resource definition
      {
         "type": "Microsoft.Web/connections",
         "apiVersion": "2016-06-01",
         // Template parameter reference for connection name
         "name": "[parameters('office365_1_Connection_Name')]",
         // Template parameter reference for connection resource location. Must match logic app location.
         "location": "[parameters('LogicAppLocation')]",
         "properties": {
            "api": {
               // Connector ID
               "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'office365')]"
            },
            // Template parameter reference for connection display name
            "displayName": "[parameters('office365_1_Connection_DisplayName')]"
         }
      }
   ],
   "outputs": {}
}
```

<a name="secure-connection-parameters"></a>

### Secure connection parameters

For a connection parameter that handles sensitive information, passwords, access keys, or secrets, the connection's resource definition includes a `parameterValues` object that specifies these values in name-value pair format. To hide this information, you can declare or edit the template parameters for these values by using the `securestring` or `secureobject` parameter types. You can then store that information in [Azure Key Vault](../azure-resource-manager/templates/key-vault-parameter.md). To pass those values to your template parameters, you reference that key vault in the [parameters file](#template-parameter-files) that's used by your template at deployment.

Here is an example that provides the account name and access key for an Azure Blob Storage connection:

**Parameters file**

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
      "azureblob_1_Connection_Name": {
         "value": "Fabrikam-Azure-Blob-Storage-Connection"
      },
      "azureblob_1_Connection_DisplayName": {
         "value": "Fabrikam-Storage"
      },
      "azureblob_1_accountName": {
         "value": "Fabrikam-Storage-Account"
      },
      "azureblob_1_accessKey": {
         "reference": {
            "keyVault": {
               "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group-name>/Microsoft.KeyVault/vaults/fabrikam-key-vault"
            },
            "secretName": "FabrikamStorageKey"
         }
      }
   }
}
```

**Template**

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   // Template parameters
   "parameters": {
      "LogicAppName": {<parameter-definition>},
      "LogicAppLocation": {<parameter-definition>},
      "azureblob_1_Connection_Name": {<parameter-definition>},
      "azureblob_1_Connection_DisplayName": {<parameter-definition>},
      "azureblob_1_accountName": {
         "type": "string",
         "defaultValue": "",
         "metadata": {
            "description": "Name of the storage account the connector should use."
         }
      },
      "azureblob_1_accessKey": {
         "type": "secureobject",
         "metadata": {
            "description": "Specify a valid primary/secondary storage account access key."
         }
      }
   },
   "variables": {},
   "functions": [],
   "resources": [
      {
         "properties": {
            "state": "Disabled",
            "definition": {
               "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
               "actions": {
                  // Azure Blob Storage action
                  "Create_blob": {
                     "type": "ApiConnection",
                     "inputs": {
                        "host": {
                           "connection": {
                              // Workflow definition parameter reference for values to use at runtime
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
                  // Workflow definition parameter for values to use at runtime
                  "$connections": {
                     "defaultValue": {},
                     "type": "Object"
                  }
               },
               "triggers": {<trigger-definition>},
               "contentVersion": "1.0.0.0",
               "outputs": {}
            },
            "parameters": {
               "$connections": {
                  "value": {
                     // Template parameter references for values to use at runtime
                     "azureblob": {
                        "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'azureblob')]",
                        "connectionId": "[resourceId('Microsoft.Web/connections', parameters('azureblob_1_Connection_Name'))]",
                        "connectionName": "[parameters('azureblob_1_Connection_Name')]"
                    }
                  }
               }
            },
            "name": "[parameters('LogicAppName')]",
            "type": "Microsoft.Logic/workflows",
            "location": "[parameters('LogicAppLocation')]",
            "tags": {
               "displayName": "LogicApp"
            },
            "apiVersion": "2019-05-01",
            // Template parameter reference for value to use at deployment
            "dependsOn": [
               "[resourceId('Microsoft.Web/connections', parameters('azureblob_1_Connection_Name'))]"
            ]
         }
      },
      // Azure Blob Storage API connection resource definition
      {
         "type": "Microsoft.Web/connections",
         "apiVersion": "2016-06-01",
         "name": "[parameters('azureblob_1_Connection_Name')]",
         "location": "[parameters('LogicAppLocation')]",
         "properties": {
            "api": {
               "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'azureblob')]"
            },
            "displayName": "[parameters('azureblob_1_Connection_DisplayName')]",
            // Template parameter reference for values to use at deployment
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

<a name="authenticate-connections"></a>

### Authenticate connections

After deployment, your logic app works end-to-end with valid parameters. However, you must still authorize any OAuth connections to generate valid access tokens for [authenticating your credentials](../active-directory/develop/authentication-vs-authorization.md). For more information, see [Authorize OAuth connections](../logic-apps/logic-apps-deploy-azure-resource-manager-templates.md#authorize-oauth-connections).

Some connections support using an Azure Active Directory (Azure AD) [service principal](../active-directory/develop/app-objects-and-service-principals.md) to authorize connections for a logic app that's [registered in Azure AD](../active-directory/develop/quickstart-register-app.md). For example, this Azure Data Lake connection resource definition shows how to reference the template parameters that handle the service principal's information and how the template declares these parameters:

**Connection resource definition**

```json
{
   <other-template-objects>
   "type": "Microsoft.Web/connections",
   "apiVersion": "2016-06-01",
   "name": "[parameters('azuredatalake_1_Connection_Name')]",
   "location": "[parameters('LogicAppLocation')]",
   "properties": {
      "api": {
         "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', 'resourceGroup().location', '/managedApis/', 'azuredatalake')]"
      },
      "displayName": "[parameters('azuredatalake_1_Connection_DisplayName')]",
      "parameterValues": {
         "token:clientId": "[parameters('azuredatalake_1_token:clientId')]",
         "token:clientSecret": "[parameters('azuredatalake_1_token:clientSecret')]",
         "token:TenantId": "[parameters('azuredatalake_1_token:TenantId')]",
         "token:grantType": "[parameters('azuredatalake_1_token:grantType')]"
      }
   }
}
```

| Attribute | Description |
|-----------|-------------|
| `token:clientId` | The application or client ID associated with your service principal |
| `token:clientSecret` | The key value associated with your service principal |
| `token:TenantId` | The directory ID for your Azure AD tenant |
| `token:grantType` | The requested grant type, which must be `client_credentials`. For more information, see [Microsoft identity platform and the OAuth 2.0 client credentials flow](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md). |
|||

**Template parameter definitions**

The template's top level `parameters` object declares these parameters for the example connection:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {
      "azuredatalake_1_Connection_Name": {
        "type": "string",
        "defaultValue": "azuredatalake"
      },
      "azuredatalake_1_Connection_DisplayName": {
        "type": "string",
        "defaultValue": "<connection-name>"
      },
      "azuredatalake_1_token:clientId": {
        "type": "securestring",
        "metadata": {
          "description": "Client (or Application) ID of the Azure Active Directory application."
        }
      },
      "azuredatalake_1_token:clientSecret": {
        "type": "securestring",
        "metadata": {
          "description": "Client secret of the Azure Active Directory application."
        }
      },
      "azuredatalake_1_token:TenantId": {
        "type": "securestring",
        "metadata": {
          "description": "The tenant ID of for the Azure Active Directory application."
        }
      },
      "azuredatalake_1_token:resourceUri": {
        "type": "string",
        "metadata": {
          "description": "The resource you are requesting authorization to use."
        }
      },
      "azuredatalake_1_token:grantType": {
        "type": "string",
        "metadata": {
          "description": "Grant type"
        },
        "defaultValue": "client_credentials",
        "allowedValues": [
          "client_credentials"
        ]
      },
      // Other template parameters
   }
   // Other template objects
}
```

For more information about working with service principals, see these topics:

* [Create a service principal by using the Azure portal](../active-directory/develop/howto-create-service-principal-portal.md)
* [Create an Azure service principal by using Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps)
* [Create a service principal with a certificate by using Azure PowerShell](../active-directory/develop/howto-authenticate-service-principal-powershell.md)

<a name="parameter-references"></a>

## References to parameters

To reference template parameters, you can use template expressions with [template functions](../azure-resource-manager/templates/template-functions.md), which are evaluated at deployment. Template expressions use square brackets (**[]**):

`"<attribute-name>": "[parameters('<template-parameter-name>')]"`

To reference workflow definition parameters, you use [Workflow Definition Language expressions and functions](../logic-apps/workflow-definition-language-functions-reference.md), which are evaluated at runtime. You might notice that some template functions and workflow definition functions have the same name. Workflow definition expressions start with the "at" symbol (**@**):

`"<attribute-name>": "@parameters('<workflow-definition-parameter-name>')"`

You can pass template parameter values to your workflow definition for your logic app to use at runtime. However, avoid using template parameters, expressions, and syntax in your workflow definition because the Logic App Designer doesn't support template elements. Also, template syntax and expressions can complicate your code due to differences in when expressions are evaluated.

Instead, follow these general steps to declare and reference the workflow definition parameters to use at runtime, declare and reference the template parameters to use at deployment, and specify the values to pass in at deployment by using a parameters file. For full details, see the [Workflow definition and parameters](#workflow-definition-parameters) section earlier in this topic.

1. Create your template and declare the template parameters for the values to accept and use at deployment.

1. In your workflow definition, declare the parameters for the values to accept and use at runtime. You can then reference these values throughout and within your workflow definition.

1. In the `parameters` object that's *outside* your workflow definition but still *inside* your logic app's resource definition, set the values for your workflow definition parameters by referencing the corresponding template parameters. That way, you can pass template parameter values into your workflow definition parameters.

1. In the parameters file, specify the values for your template to use at deployment.

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
         "minLength": 1,
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
         }

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
            "state": "Disabled",
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
                        }
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
         "apiVersion": "2019-05-01",
         "dependsOn": [
            "[resourceId('Microsoft.Web/connections', parameters('azureblob_1_Connection_Name'))]",
            "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]"
         ]
      },
      {
         "type": "Microsoft.Web/connections",
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
         "type": "Microsoft.Web/connections",
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

## Next steps

> [!div class="nextstepaction"]
> [Create logic app templates](../logic-apps/logic-apps-create-azure-resource-manager-templates.md)
