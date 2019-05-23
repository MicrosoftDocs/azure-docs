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
ms.date: 05/15/2019
---

# Overview: Automate deployment for logic apps with Azure Resource Manager templates

When you're ready to automate how you create and deploy your logic app, you can expand your logic app's underlying workflow definition into an [Azure Resource Manager template](../azure-resource-manager/resource-group-overview.md). This template defines the infrastructure, resources, parameters, and other setup information for provisioning and deploying your logic app. When you use Resource Manager templates that *parameterize* (define parameters for) values that vary at deployment, you can repeatedly and consistently deploy logic apps to the environment, Azure resource group, and Azure subscription that you want.

For example, when deploying to development, test, and production environments, you're likely to have different connection strings for each environment. You can define parameters in your Resource Manager template for accepting those connection strings and provide those connection strings in a [parameter file](../azure-resource-manager/resource-group-template-deploy.md#parameter-files). Or, for parameter values that are sensitive or must be secured, you can store those values in [Azure Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md). That way, you can change the way that you configure your logic app deployment without having to update the template and redeploy your app.

This overview describes the high-level structure and syntax for a Resource Manager template that includes a logic app's workflow definition. Both the template and your workflow definition use JSON syntax but with some differences because the workflow definition is based on the [Workflow Definition Language schema](../logic-apps/logic-apps-workflow-definition-language.md). The examples in this overview also illustrate parameterized values that can vary at deployment. For the easiest way to create a valid parameterized template for your logic app, create your logic app in the Azure portal, and then [download your logic app into Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md#download-logic-app) where you've installed the Azure Logic Apps Tools for Visual Studio extension. Visual Studio automatically generates a template that's mostly ready for deployment.

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

Here are brief details about these attributes:

| Attribute | Required | Description |
|-----------|----------|-------------|
| `$schema` | Yes | The location for the JSON schema file that specifies the version for the Resource Manager template language |
| `contentVersion` | Yes | The version for this Resource Manager template |
| `parameters` | No | The template's parameters, which accept the values to use when creating and deploying resources in Azure, such as your logic app's name and location, information about your dev, test, and production environments, and so on. For full details, see [Parameters - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#parameters). |
| `variables` | No | The values that you construct and use for simplifying complex expressions throughout your Resource Manager template. That way, you only need to update the variable when those values change. For full details, see [Variables - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#variables). |
| `functions` | No | Any functions that you want to create and use repeatedly within your Resource Manager template. For full details, see [Functions - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#functions). |
| `resources` | Yes | The definitions for the resources that you want the Resource Manager template to deploy or update in an Azure resource group or subscription. For full details, see [Resources - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#resources). |
| `outputs` | No | The values that you want returned after deployment, for example, values from resources that the Resource Manager template deployed. For full details, see [Outputs - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#outputs). |
||||

<a name="template-parameters"></a>

## Template parameters

Your template's `parameters` attribute defines the parameters for the values that your template uses when creating and deploying resources in Azure. For example, your template's `resources` attribute, described later in this topic, uses these values when creating and deploying resources, such as your logic app, any connections used by your logic app, and other Azure resources. So, if your logic app creates connections to other services and systems by using [managed connectors](../connectors/apis-list.md), your template's `parameters` attribute also defines the parameters for the values that your template uses when creating and deploying the Azure resources for those connections. Also, if your logic app is linked to an [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md), the template defines the parameter that accepts the values to use for that integration account.

Template parameters are evaluated before deployment, so they can't use values that are available at runtime. In a template embedded with a logic app workflow definition, multiple `parameters` attributes that perform different functions also exist at other levels. For example, your workflow definition has a `parameters` section that defines the parameters for the values that your logic app uses at runtime. Template parameters can't reference the results from these workflow definition parameters. So, to provide the values for template parameters, store those values in a separate [parameter file](#template-parameter-files), which you can change based on your deployment needs.

The syntaxes that you use to evaluate expressions and functions also differ between templates and workflow definitions. When referencing parameter values, template expressions use square brackets (**[]**), while workflow definition expressions use the "at" symbol (**@**). While template parameters can reference only values available at deployment, workflow definition parameters can reference values available at deployment and runtime. Some template functions and workflow definition functions even use the same name. For example, both expressions use the `parameters()` function but with different syntaxes, and reference different parameter values.

* Template expression syntax:

  `"<attribute-name>": "[parameters('<template-parameter-name>')]"`

* Workflow definition expression syntax:

  `"<attribute-name>": "@parameters('<workflow-definition-parameter-name>')"`

For more information about parameters, see:

* [Template parameters](../azure-resource-manager/resource-group-authoring-templates.md#parameters)

* [Workflow definition parameters](#workflow-parameters)

For more information about functions, see:

* [Template functions](../azure-resource-manager/resource-group-template-functions.md)

* [Workflow definition functions](../logic-apps/workflow-definition-language-functions-reference.md)

### Parameters example

This example defines these template parameters:

* Name and location to use when creating and deploying a logic app

* Values to use when creating and deploying the Azure resource for an Office 365 Outlook connection

* ID to use for an integration account that's linked the logic app

The template's `resources` attribute references the template's parameter values for creating and deploying the Azure resources for your logic app and for the connection. For an example that shows how to provide the values for these template parameters, see [Template parameter files](#template-parameter-files).

> [!IMPORTANT]
> Templates that use the `resourceGroup()` function can deploy only to Azure resource groups, not Azure subscriptions. For more information, see [Resource functions for Azure Resource Manager templates](../azure-resource-manager/resource-group-template-functions-resource.md#resourcegroup).

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   // Define template parameters
   "parameters": {
      "LogicAppLocation": {
         "type": "string",
         "min length": 1,
         "defaultValue": "[resourceGroup().location]",
         "metadata": {
            "description": "The resource location to use for the logic app"
         }
      },
      "LogicAppName": {
         "type": "string",
         "minLength": 1,
         "maxLength": 80,
         "defaultValue": "MyLogicApp",
         "metadata": {
            "description": "The resource name to use for the logic app"
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
        "defaultValue": "<Office-365-account-name>",
         "metadata": {
            "description": "The display name to use for the Office 365 Outlook connection"
         }
      },
      "LogicAppIntegrationAccount": {
         "type":"securestring",
         "minLength": 1,
         "metadata": {
            "description": "The ID to use for the integration account"
         }
      }
   },
   "variables": {},
   "functions": [],
   "resources": [
      {
         "properties": {
            "state": "Enabled",
            // Reference the template parameter value for `LogicAppIntegrationAccount`
            "integrationAccount": {
               "id": "[parameters('LogicAppIntegrationAccount')]"
            },
            "definition": {<workflow-definition>},
            // Parameter values for workflow definition
            "parameters": {
               "$connections": {
                  "value": {
                     "office365": {
                        // To reference the resource group location, use resourceGroup().location
                        // To reference the logic app's location, use parameters('LogicAppLocation')
                        "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', <connection-resource-location>, '/managedApis/', 'office365')]",
                        // Reference the template parameter value for `office365_1_Connection_Name`
                        "connectionId": "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]",
                        // Reference the template parameter value for `office365_1_Connection_Name`
                        "connectionName": "[parameters('office365_1_Connection_Name')]"
                     }
                  }
               }
            },
            // Logic app resource information that references the template parameter value for `LogicAppName`
            "name": "[parameters('LogicAppName')]",
            "type": "Microsoft.Logic/workflows",
            // Reference the template parameter value for `LogicAppLocation`
            "location": "[parameters('LogicAppLocation')]",
            "tags": {
               "displayName": "LogicApp"
            },
            "apiVersion": "2016-06-01",
            "dependsOn": [
               // Reference the template parameter values for 'office365_1_Connection_Name`
              "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]"
            ]
         }
      },
      {
         // APIConnection resource information
         "type": "MICROSOFT.WEB/CONNECTIONS",
         "apiVersion": "2016-06-01",
         // Reference the template parameter value for 'office365_1_Connection_Name`
         "name": "[parameters('office365_1_Connection_Name')]",
         "location": "<connection-resource-location>",
         "properties": {
            "api": {
               // To reference the resource group location, use resourceGroup().location
               // To reference the logic app's location, use parameters('LogicAppLocation')
               "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', <connection-resource-location>, '/managedApis/', 'office365')]"
             },
             // Reference the template parameter value for 'office365_1_Connection_Display_Name`
             "displayName": "[parameters('office365_1_Connection_DisplayName')]"
         }
      }
   ],
   "outputs": {}
}
```

## Best practices for parameters

Here are some best practices for defining parameters:

* Define parameters only for values that vary, based on your deployment needs. Don't define parameters for values that stay the same across different deployment requirements.

* Provide default values for parameters except when parameters handle information that is sensitive or requires security. Always use parameters for user names, passwords, and secrets. To hide or protect sensitive information in parameters, follow the guidance in these topics:
  
  * [Security recommendations for template parameters](../azure-resource-manager/template-best-practices.md#parameters)

  * [Pass secure parameter values with Azure Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md)

* You can provide the values for your workflow definition's parameters by referencing your template's parameter values. However, using template expressions and functions, which are evaluated at deployment, inside your workflow definition where Workflow Definition Language expressions and functions are evaluated at runtime, can make code hard to read.

  Instead, you can define parameters for those template parameter values by using the `parameters` attribute *inside* the `definition` attribute for workflow definition. You then provide the values for your workflow definition parameters in the `parameters` attribute that declares the parameter values for the workflow definition.

* To differentiate template parameter names from workflow definition parameter names, use clearly labeled template parameter names, for example: `TemplateLogicAppName`

For more template best practices, see [Best practices for template parameters](../azure-resource-manager/template-best-practices.md#parameters)

<a name="template-parameter-files"></a>

## Template parameter files

To provide the values for Resource Manager template parameters, store those values in a [parameter file](../azure-resource-manager/resource-group-template-deploy.md#parameter-files). That way, you can use different parameter files based on where you want to create and deploy your logic app. Here is the syntax for a parameter file:

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
      <...>
   }
}
```

For example, this short parameter file provides values for the template parameters defined in the earlier template parameters example:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
   "contentVersion": "1.0.0.0",
   // Template parameter values
   "parameters": {
      "office365_1_Connection_Name": {
        "value": "office365-2"
      },
      "office365_1_Connection_DisplayName": {
        "value": "europe_division@fabrikam.com"
      },
     "LogicAppName": {
        "value": "Fabrikam-Email-Processor-Logic-App"
     },
     "LogicAppLocation": {
        "value": [
           "northeurope",
           "westeurope"
        ]
     },
     "LogicAppIntegrationAccount": {
        "value": {
           "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/fabrikam-integration-acount-rg/providers/Microsoft.Logic/integrationAccounts/fabrikam-integration-account"
        }
     }
   }
}
```

<a name="template-resources"></a>

## Template resources

Your template's `resources` attribute declares information for each resource that you want to create and deploy in Azure. This attribute references the values that pass through the template's `parameters` attribute by using an expression that's enclosed with square brackets (**[]**) and calls the `parameters()` function on the template parameter. In the template's `resources` attribute, the `properties` attribute contains the workflow definition for your logic app and any references to resources for connections used by your logic app. Under `properties`, other resource attributes reference the template parameter values used for creating and deploying your logic app:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "<template-version-number>",
   "parameters": {},
   "variables": {},
   "functions": [],
   "resources": [
      {
         "properties": {
            "state": "<enabled-or-disabled>",
            "definition": {<workflow-definition>},
            // Workflow definition parameter values
            "parameters": {
               "$connections" : {<references-to-template-parameter-values-for-connection-resources>}
            }
         },
         // Logic app resource information that references the template parameter value for `LogicAppName`
         "name": "[parameters('LogicAppName')]",
         "type": "Microsoft.Logic/workflows",
         "location": "[parameters('LogicAppLocation')",
         "tags": {
            "displayName": "LogicApp"
         },
         "apiVersion": "2016-06-01",
         "dependsOn": [<references-to-template-parameter-values-for-connection-resources>]
      },
      {
         // APIConnection resource information
         "type": "MICROSOFT.WEB/CONNECTIONS",
         "apiVersion": "2016-06-01",
         // Reference the template parameter value for 'office365_1_Connection_Name`
         "name": "[parameters('office365_1_Connection_Name')]",
         // To reference the resource group location, use "resourceGroup().location"
         // To reference the logic app's location, use "[parameters('LogicAppLocation')]"
         "location": "<connection-resource-location>",
         "properties": {
            "api": {
               // To reference the resource group location, use resourceGroup().location
               // To reference the logic app's location, use parameters('LogicAppLocation')
               "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', <connection-resource-location>, '/managedApis/', 'office365')]"
             },
             // Reference the template parameter value for 'office365_1_Connection_Display_Name`
             "displayName": "[parameters('office365_1_Connection_DisplayName')]"
         }
      }
   ],
   "outputs": {}
}
```

| Attribute | Required | Description |
|-----------|----------|-------------|
| `state` | Yes | The state for your logic app at deployment where `Enabled` means your logic app is live and `Disabled` means that your logic app is inactive |
| `definition` | Yes | Contains your logic app's underlying workflow definition, which describes how the Logic Apps service runs that workflow along with definitions for the trigger, actions, workflow parameters, outputs, schema, and so on. For more information, see [Logic app workflow definition](#workflow-definition). <p><p>To view the attributes in your logic app's workflow definition, switch from "design view" to "code view" in the Azure portal or Visual Studio, or by using a tool such as [Azure Resource Explorer](http://resources.azure.com). |
| `parameters` | No | If your logic app uses [managed connectors](../connectors/apis-list.md) for accessing other services and systems, the `$connections` attribute references the values used by the connections that your logic app creates. For more information, see [Logic app connections](#workflow-connections). |
||||

In this example, the template `resources` attribute declares resource information for an Office 365 Outlook connection and a logic app:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "<template-version-number>",
   "parameters": {},
   "variables": {},
   "functions": [],
   "resources": [
      {
         "properties": {
            "state": "Enabled",
            "definition": {<workflow-definition>},
            "parameters": {
               "$connections": {
                  "value": {
                     // Workflow definition parameter values for `office365` connection
                     "office365": {
                        // To reference the resource group location, use resourceGroup().location
                        // To reference the logic app's location, use parameters('LogicAppLocation')
                        "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', <connection-resource-location>, '/managedApis/', 'office365')]",
                        // Reference the template parameter value for `office365_1_Connection_Name`
                        "connectionId": "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]",
                        // References the template parameter value for `office365_1_Connection_Name`
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
            // Reference the template parameter value for 'office365_1_Connection_Name`
            "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]"
         ]
      },
      {
         // APIConnection resource information
         "type": "MICROSOFT.WEB/CONNECTIONS",
         "apiVersion": "2016-06-01",
         // Reference the template parameter value for 'office365_1_Connection_Name`
         "name": "[parameters('office365_1_Connection_Name')]",
         // To reference the resource group location, use "resourceGroup().location"
         // To reference the logic app's location, use "[parameters('LogicAppLocation')]"
         "location": "<connection-resource-location>",
         "properties": {
            "api": {
               // To reference the resource group location, use resourceGroup().location
               // To reference the logic app's location, use parameters('LogicAppLocation')
               "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', <connection-resource-location>, '/managedApis/', 'office365')]"
             },
             // Reference the template parameter value for 'office365_1_Connection_Display_Name`
             "displayName": "[parameters('office365_1_Connection_DisplayName')]"
         }
      }
   ],
   "outputs": {}
}
```

For more information about template resources, see these topics:

* [Resources - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#resources)
* [Best practices for template resources](../azure-resource-manager/template-best-practices.md#resources).

<a name="workflow-definition"></a>

## Logic app workflow definition

Inside your template's `resources` > `properties` attributes, the `definition` attribute contains your logic app's workflow definition, which is fully described in the [Schema reference for Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md) topic:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "<template-version-number>",
   "parameters": {},
   "variables": {},
   "functions": [],
   "resources": [
      {
         "properties": {
            "state": "Enabled",
            // Workflow definition starts here
            "definition": {
               "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
               "actions": {<action-definitions>},
               "parameters": {<workflow-definition-parameters>},
               "triggers": {<trigger-definition>},
               "contentVersion": <workflow-definition-version-number>,
               "outputs": {<workflow-outputs>}
            },
            // Workflow definition ends here
            "parameters": {<workflow-definition-parameter-values>}
         }
      }
   ],
   "outputs": {}
}
```

| Attribute | Required | Description |
|-----------|----------|-------------|
| `$schema` | Only when externally referencing a workflow definition | The location for the JSON schema file that describes the Workflow Definition Language version |
| `actions` | No | The definitions for one or more actions to execute at workflow runtime. For full details, see [Triggers and actions - Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md#triggers-actions). |
| `contentVersion` | No | The version number for your workflow definition |
| `outputs` | No | The definitions for the outputs to return from a workflow run. For full details, see [Outputs - Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md#outputs). |
| `parameters` | No | The definitions for one or more parameters that pass values for your workflow to use at runtime. For full details, see [Parameters - Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md#parameters). |
| `staticResults` | No | The definitions for one or more static results returned by actions as mock outputs when static results are enabled on those actions. For full details, see [Static results - Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md#static-results). |
| `triggers` | No | The definitions for one or more triggers that start your workflow. You can define more than one trigger, but only with the Workflow Definition Language, not visually through the Logic Apps Designer. For full details, see [Triggers and actions - Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md#triggers-actions). |
||||

For example, here's a logic app workflow definition that has these steps:

* An [Office 365 Outlook trigger](/connectors/office365/) that fires when a new email arrives
* An [Azure Blob Storage action](/connectors/azureblob/) that creates a blob for the email body and uploads that blob to an Azure storage container

```json
"definition": {
   "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
   // Workflow action definitions
   "actions": {
      "Create_blob": {
         "inputs": {
            "body": "@triggerBody()?['Body']",
            "host": {
               "connection": {
                  "name": "@parameters('$connections')['azureblob']['connectionId']"
               }
            },
            "method": "post",
            "path": "/datasets/default/files",
            "queries": {
               "folderPath": "/emails",
               "name": "@triggerBody()?['Subject']",
               "queryParametersSingleEncoded": true
            }
         },
         "runAfter": {},
         "runtimeConfiguration": {
            "contentTransfer": {
               "transferMode": "Chunked"
            }
         },
         "type": "ApiConnection"
      }
   },
   // Workflow definition parameters
   "parameters": {
      "$connections": {
         "defaultValue": {},
         "type": "Object"
      }
   },
   // Workflow trigger definition
   "triggers": {
      "When_a_new_email_arrives": {
         "inputs": {
            "host": {
               "connection": {
                  "name": "@parameters('$connections')['office365']['connectionId']"
               }
            },
            "method": "get",
            "path": "/Mail/OnNewEmail",
            "queries": {
               "fetchOnlyWithAttachment": false,
               "folderPath": "Inbox",
               "importance": "Any",
               "includeAttachments": false
            }
         },
         "recurrence": {
            "frequency": "Day",
            "interval": 1
         },
         "splitOn": "@triggerBody()?['value']",
         "type": "ApiConnection"
      }
   },
   "contentVersion": "1.0.0.0",
   "outputs": {}
},
```

<a name="workflow-parameters"></a>

## Workflow definition parameters

In your workflow definition's `parameters` attribute, you can add or edit any parameters that the workflow definition uses for accepting inputs at runtime. To make sure that the Logic App Designer can correctly show these parameters, note these practices:

* You can define parameters in triggers and actions:

  * Azure Functions app
  * Nested or child logic app workflow
  * API Management call
  * The runtime URL for an API connection
  * The `path` attribute for an APIConnection trigger or action

* Default values are required for workflow definition parameters except for values that are sensitive or require security. To hide or protect sensitive information in workflow definition parameters, follow the guidance in these topics:

  * [Security recommendations for action and input parameters](../logic-apps/logic-apps-securing-a-logic-app.md#secure-action-parameters-and-inputs)

  * [Pass secure parameter values with Azure Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md)

For more information about workflow definition parameters, see [Parameters - Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md#parameters).

<a name="workflow-connections"></a>

## Logic app connections

Inside your template's `resources` > `properties` > `parameters` attributes, the `$connections` attribute references the resources that securely store metadata for any connections that your logic app creates and uses through [managed connectors](../connectors/apis-list.md). This metadata can include information such as connection strings and access tokens, which you can put in your template's parameter file.

Each new connection that you create for a logic app also creates a resource with a unique name in Azure. So, when you have multiple connection resources for the same service or system, each resource name is appended with a number, which increments with each new connection created, for example, `office365`, `office365-1`, and so on.

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "<template-version-number>",
   "parameters": {},
   "variables": {},
   "functions": [],
   "resources": [
      {
         "properties": {
            "state": "Enabled",
            "definition": {<workflow-definition>},
            // Workflow definition parameter values
            "parameters": {
               "$connections": {
                  "value": {
                     // Workflow definition parameter values for Office 365 Outlook connection
                     "office365": {
                        // To reference the resource group location, use resourceGroup().location
                        // To reference the logic app's location, use parameters('LogicAppLocation')
                        "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', <connection-resource-location>, '/managedApis/', 'office365')]",
                        // Reference the template parameter value for `office365_1_Connection_Name`
                        "connectionId": "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]",
                        // Reference the template parameter value for `office365_1_Connection_Name`
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
            // Reference the template parameter value for 'office365_1_Connection_Name`
            "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]"
         ]
      },
      {
         // APIConnection resource information
         "type": "MICROSOFT.WEB/CONNECTIONS",
         "apiVersion": "2016-06-01",
         // Reference the template parameter value for 'office365_1_Connection_Name`
         "name": "[parameters('office365_1_Connection_Name')]",
         // To reference the resource group location, use "resourceGroup().location"
         // To reference the logic app's location, use "[parameters('LogicAppLocation')]"
         "location": "<connection-resource-location>",
         "properties": {
            "api": {
               "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', <connection-resource-location>, '/managedApis/', 'office365')]"
             },
             // Reference the template parameter value for 'office365_1_Connection_Display_Name`
             "displayName": "[parameters('office365_1_Connection_DisplayName')]"
         }
      }
   ],
   "outputs": {}
}
```

> [!NOTE]
> When you view your logic app's workflow definition outside a Resource Manager template, for example, in "code view", the `$connections` attribute appears at the same level as the `definition` attribute that contains your workflow definition:
>
> ```json
> {
>    "$connections": {<workflow-definition-parameter-values-for-connections>},
>    "definition": {<workflow-definition>}
> }
> ```

In this example, the `$connections` attribute contains an `office365` attribute, which references the resource for an Office 365 Outlook connection. In the `definition` attribute for your workflow definition, the trigger definition contains a `connection` > `name` attribute that uses the `parameters()` function to reference the `office365` attribute and child `connectionId` attribute:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "<template-version-number>",
   "parameters": {},
   "variables": {},
   "functions": [],
   "resources": [
      {
         "properties": {
            "state": "Enabled",
            // Workflow definition starts here
            "definition": {
               "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
               // Workflow definition actions
               "actions": {<one-or-more-action-definitions>},
               // Workflow definition parameters
               "parameters": {
                  "$connections": {
                     "defaultValue": {},
                     "type": "Object"
                  }
               },
               "triggers": {
                  // Workflow definition trigger
                  "When_a_new_email_arrives": {
                     "inputs": {
                        "host": {
                           // References to parameter values for workflow definition
                           "connection": {
                              "name": "@parameters('$connections')['office365']['connectionId']"
                           }
                        },
                        <...>
                     },
                     <...>
                  }
               },
               "contentVersion": <workflow-definition-version-number>,
               "outputs": {}
            },
            // Workflow definition parameter values
            "parameters": {
               "$connections": {
                  "value": {
                     // Workflow definition parameter values for Office 365 Outlook connection
                     "office365": {
                        // To reference the resource group location, use resourceGroup().location
                        // To reference the logic app's location, use parameters('LogicAppLocation')
                        "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', <connection-resource-location>, '/managedApis/', 'office365')]",
                        "connectionId": "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]",
                        "connectionName": "[parameters('office365_1_Connection_Name')]"
                     }
                  }
               }
            }
         }
      }
   ],
   "outputs": {}
}
```

<a name="full-example-template"></a>

## Full example template

Here is the parameterized sample template that this overview uses for the template attribute examples. The template includes a workflow definition that has an Office 365 Outlook trigger and an Azure Blob Storage action:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
     "LogicAppIntegrationAccount": {
        "type": "string",
        "minLength": 1
     },
     "office365_1_Connection_Name": {
        "type": "string",
        "defaultValue": "office365"
     },
     "office365_1_Connection_DisplayName": {
        "type": "string",
        "defaultValue": "<Office-365-account-name>"
     },
     "azureblob_1_Connection_Name": {
        "type": "string",
        "defaultValue": "azureblob"
     },
     "azureblob_1_Connection_DisplayName": {
        "type": "string",
        "defaultValue": "<Azure-Blob-Storage-connection-name>"
     },
     "azureblob_1_accountName": {
        "type": "string",
        "metadata": {
          "description": "Name of the storage account the connector should use."
        },
        "defaultValue": "<Azure-Blob-storage-account-name>"
     },
     "azureblob_1_accessKey": {
        "type": "securestring",
        "metadata": {
          "description": "Specify a valid primary/secondary storage account access key."
        }
     },
     "LogicAppLocation": {
        "type": "string",
        "minLength": 1,
        "allowedValues": [
          "[resourceGroup().location]"
        ],
        "defaultValue": "[resourceGroup().location]"
     },
     "LogicAppName": {
        "type": "string",
        "minLength": 1,
        "defaultValue": "<logic-app-name>"
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
                        // To reference the resource group location, use resourceGroup().location
                        // To reference the logic app's location, use parameters('LogicAppLocation')
                        "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', <connection-resource-location>, '/managedApis/', 'azureblob')]",
                        "connectionId": "[resourceId('Microsoft.Web/connections', parameters('azureblob_1_Connection_Name'))]",
                        "connectionName": "[parameters('azureblob_1_Connection_Name')]"
                     },
                     "office365": {
                        "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', <connection-resource-location>, '/managedApis/', 'office365')]",
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
         // To reference the resource group location, use "resourceGroup().location"
         // To reference the logic app's location, use "[parameters('LogicAppLocation')]"
         "location": "<connection-resource-location>",
         "properties": {
            "api": {
                // To reference the resource group location, use resourceGroup().location
                // To reference the logic app's location, use parameters('LogicAppLocation')
                "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', <connection-resource-location>, '/managedApis/', 'office365')]"
            },
            "displayName": "[parameters('office365_1_Connection_DisplayName')]"
         }
      },
      {
         "type": "MICROSOFT.WEB/CONNECTIONS",
         "apiVersion": "2016-06-01",
         "name": "[parameters('azureblob_1_Connection_Name')]",
         // To reference the resource group location, use "resourceGroup().location"
         // To reference the logic app's location, use "[parameters('LogicAppLocation')]"
         "location": "<connection-resource-location>",
         "properties": {
            "api": {
               // To reference the resource group location, use resourceGroup().location
               // To reference the logic app's location, use parameters('LogicAppLocation')
               "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', <connection-resource-location>, '/managedApis/', 'azureblob')]"
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

At deployment, your logic app works end-to-end with valid parameters. However, you must still authorize OAuth connections to generate a valid access token.

* To authorize OAuth connections, open your logic app in Logic App Designer. In the designer, authorize any required connections.

* For automated deployment, you can use a script that provides consent for each OAuth connection. Here's an example script in GitHub in the [LogicAppConnectionAuth](https://github.com/logicappsio/LogicAppConnectionAuth) project.

## Next steps

> [!div class="nextstepaction"]
> [Create logic app templates](../logic-apps/logic-apps-create-azure-resource-manager-templates.md)