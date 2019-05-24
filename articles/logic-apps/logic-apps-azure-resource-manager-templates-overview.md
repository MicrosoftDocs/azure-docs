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

When you're ready to automate creating and deploying your logic app, you can expand your logic app's underlying workflow definition into an [Azure Resource Manager template](../azure-resource-manager/resource-group-overview.md). This template defines the infrastructure, resources, parameters, and other information for provisioning and deploying your logic app. By defining parameters in your template for values that vary at deployment (*parameterizing*), you can repeatedly and consistently deploy logic apps based on different deployment needs.

For example, if you deploy to development, test, and production environments, you likely use different connection strings for each environment. You can define parameters in your Resource Manager template that accept different connection strings and then store those strings in a separate [parameter file](../azure-resource-manager/resource-group-template-deploy.md#parameter-files). For parameter values that are sensitive or must be secured, such as passwords and secrets, you can store those values in [Azure Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md) and have your parameter file retrieve those values. That way, you can change those values without having to update and redeploy the template.

This overview describes the high-level structure and syntax for a Resource Manager template that has an embedded logic app workflow definition. Both the template and your workflow definition use JSON syntax but with some differences because the workflow definition follows the [Workflow Definition Language schema](../logic-apps/logic-apps-workflow-definition-language.md). The examples in this overview also show how you can parameterize values that vary at deployment. For the easiest way to create a valid parameterized template for your logic app, you can download your logic app from the Azure portal into Visual Studio where you've installed the Azure Logic Apps Tools for Visual Studio extension. Or, you can use the PowerShell module for creating logic app templates. For more information, see [Create Azure Resource Manager templates for deploying logic apps](../logic-apps/logic-apps-create-azure-resource-manager-templates.md).

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

Here are brief details about these sections:

| Attribute | Required | Description |
|-----------|----------|-------------|
| `$schema` | Yes | The location for the JSON schema file that describes the version for the template language |
| `contentVersion` | Yes | The version for this template |
| `parameters` | No | The template parameters for the values to use when customizing resources for deployment in Azure, such as values to use for your logic app's name and location, information about your dev, test, and production environments, and so on. The values for these parameters are stored in a [parameter file](#template-parameter-files) that's described later in this topic. For full details, see [Parameters - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#parameters). |
| `variables` | No | Any values that you want to construct and use for simplifying complex expressions throughout your template. That way, you only need to update the variable when those values change. For full details, see [Variables - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#variables). |
| `functions` | No | Any functions that you want to create and use repeatedly within your template. For full details, see [Functions - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#functions). |
| `resources` | Yes | The definitions for the resources that the template deploys or updates inside an Azure resource group. For full details, see [Resources - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#resources). |
| `outputs` | No | Any values to return after deployment, for example, values from resources that the template deploys. For full details, see [Outputs - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#outputs). |
||||

<a name="template-parameters"></a>

## Template parameters

The template for a logic app has multiple `parameters` sections, which exist at different levels and perform different functions in the template. At the template's top level, the `parameters` section defines parameters for the values to use when creating and deploying resources in Azure, for example:

* The Azure resource for your logic app
* The Azure resources for the connections used by your logic app to access other services and systems through [managed connectors](../connectors/apis-list.md)
* Other Azure resources that your logic app needs for deployment

  For example, if your logic app uses an [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) for business-to-business (B2B) scenarios, the template's `parameters` section defines the parameter that accepts the resource ID for that integration account.

Here is an example that shows just the template parameters that accept the values for a logic app, connections, and an integration account:

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
         "defaultValue": "fabrikam-ops@fabrikam.com",
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
         "defaultValue": "fabrikam-email-storage-connection"
      },
      "azureblob_1_accountName": {
         "type": "string",
         "metadata": {
            "description": "Name of the storage account the connector should use."
         },
         "defaultValue": "fabemailstorage"
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

Other sections in the template use the values that pass into these template parameters. For example, your template's `resources` section, described later in this topic, defines each resource that you want to create and deploy in Azure. In this `resources` section, the `properties` section has a `parameters` section that specifies the values used at your logic app's runtime by referencing your template's parameter values. At a deeper level in the `resources` section, the `definition` section describes your workflow definition, which includes a `parameters` section that defines parameters for the values used at your logic app's runtime.

> [!NOTE] Keep in mind that template parameters are evaluated at deployment, while workflow definition parameters are evaluated at runtime. As a result, template parameters can reference only values available at deployment, not values available only at runtime. Workflow definition parameters can reference values available at both deployment and runtime.

For more information about parameters, see:

* [Template parameters](../azure-resource-manager/resource-group-authoring-templates.md#parameters)

* [Workflow definition parameters](#workflow-parameters)

## Best practices for parameters

Here are some best practices for defining parameters:

* Define parameters only for values that vary, based on your deployment needs. Don't define parameters for values that stay the same across different deployment requirements.

* Provide default values for parameters except when parameters handle information that is sensitive or requires security. Always use parameters for user names, passwords, and secrets. To hide or protect sensitive information in parameters, follow the guidance in these topics:
  
  * [Security recommendations for template parameters](../azure-resource-manager/template-best-practices.md#parameters)

  * [Pass secure parameter values with Azure Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md)

* To differentiate template parameter names from workflow definition parameter names, you can use descriptive template parameter names, for example: `TemplateLogicAppName`

For more template best practices, see [Best practices for template parameters](../azure-resource-manager/template-best-practices.md#parameters)

<a name="template-resources"></a>

## Template resources

The template for a logic app has a `resources` section that defines the resources to create and deploy for your logic app. For example, in the `resources` section, the `properties` section defines the resource to create and deploy for your logic app. Outside the `properties` section, the template defines the other resources used by your logic app, such as connection resources.

> [!NOTE]
> Connection resources must exist in the same Azure resource group and location as your logic app.

This example shows how the `resources` section defines the resources to create and deploy for a logic app. These resource definitions reference the values for the template parameters defined earlier in this topic:

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
            "state": "<logic-app-deployment-state>",
            // Reference template parameter value for integration account ID
            "integrationAccount": {
               "id": "[parameters('LogicAppIntegrationAccount')]"
            },
            "definition": {<workflow-definition>},
            // Reference template parameter values used 
            // by parameters inside workflow definition
            "parameters": {
               // Reference template parameter values used 
               // by connection parameters inside workflow definition
               "$connections": {
                  "value": {
                     "office365": {
                        // Connector ID, which must use same location as logic app
                        "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'office365')]",
                        // Reference template parameter value for connection resource name
                        "connectionId": "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]",
                        // Reference template parameter value for connection resource name
                        "connectionName": "[parameters('office365_1_Connection_Name')]"
                     },
                     "azureblob": {
                        "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'azureblob')]",
                        "connectionId": "[resourceId('Microsoft.Web/connections', parameters('azureblob_1_Connection_Name'))]",
                        "connectionName": "[parameters('azureblob_1_Connection_Name')]"
                    }
                  }
               }
            },
            // Logic app resource information
            // Reference template parameter value for logic app resource name
            "name": "[parameters('LogicAppName')]",
            "type": "Microsoft.Logic/workflows",
            // Reference template parameter value for logic app resource location
            "location": "[parameters('LogicAppLocation')]",
            "tags": {
               "displayName": "LogicApp"
            },
            "apiVersion": "2016-06-01",
            "dependsOn": [
               // Reference template parameter value for connection resource name
              "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]"
            ]
         }
      },
      // APIConnection resource information
      {
         "type": "MICROSOFT.WEB/CONNECTIONS",
         "apiVersion": "2016-06-01",
         // Reference template parameter value for connection resource name
         "name": "[parameters('office365_1_Connection_Name')]",
         // Connection resource location, which must use same location as logic app
         "location": "[parameters('LogicAppLocation')]",
         "properties": {
            "api": {
               // Connector ID, which must use same location as logic app
               "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'office365')]"
             },
             // Reference template parameter value for connection display name
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
            // Reference template parameter values for account name and access key
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

| Attribute | Required | Description |
|-----------|----------|-------------|
| `state` | Yes | The state for your logic app at deployment where `Enabled` means your logic app is live and `Disabled` means that your logic app is inactive. For example, if you're not ready for your logic app to go live but want to deploy a draft version, you can use the `Disabled` option. |
| `definition` | Yes | Your logic app's underlying workflow definition, which describes how the Logic Apps service runs that workflow along with definitions for the trigger, actions, workflow parameters, outputs, schema, and so on. For more information, see [Logic app workflow definition](#workflow-definition). <p><p>To view the attributes in your logic app's workflow definition, switch from "design view" to "code view" in the Azure portal or Visual Studio, or by using a tool such as [Azure Resource Explorer](http://resources.azure.com). |
| `parameters` | No | If your logic app uses [managed connectors](../connectors/apis-list.md) for accessing other services and systems, this section uses the `$connections` section to specify values used by the connections in your logic app. For more information, see [Logic app connections](#workflow-connections). |
||||

## Reference parameter values

To reference template parameter values, the resource definitions use template expressions and [Resource Manager template functions](../azure-resource-manager/azure-resource-manager/resource-group-template-functions). To reference workflow definition parameter values, you use [Workflow Definition Language expressions and functions](../logic-apps/workflow-definition-language-functions-reference.md). You might notice that some template functions and workflow definition functions have the same name. When referencing template parameter values, expressions use square brackets (**[]**). When referencing workflow definition parameter values, expressions use the "at" symbol (**@**). For example:

* Template expression syntax

  `"<attribute-name>": "[parameters('<template-parameter-name>')]"`

* Workflow definition expression syntax

  `"<attribute-name>": "@parameters('<workflow-definition-parameter-name>')"`

For more information about functions, see:

* [Template functions](../azure-resource-manager/resource-group-template-functions.md)

* [Workflow definition functions](../logic-apps/workflow-definition-language-functions-reference.md)

* You can provide the values for your workflow definition's parameters by referencing your template's parameter values. However, using template expressions and functions, which are evaluated at deployment, inside your workflow definition where Workflow Definition Language expressions and functions are evaluated at runtime, creates more complex code.

  Instead, you can define parameters for those template parameter values by using the `parameters` attribute *inside* the `definition` attribute for workflow definition. You then provide the values for your workflow definition parameters in the `parameters` attribute that declares the parameter values for the workflow definition.

## Example - template parameters & resources

This example template defines parameters for these values and shows how different sections reference these values:

* Name and location to use for creating and deploying a logic app

* Values to use for connecting to an Office 365 Outlook account

* Values to use for connecting to an Azure Blob storage account and access key

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
         "defaultValue": "fabrikam-ops@fabrikam.com",
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
         "defaultValue": "fabrikam-email-storage-connection"
      },
      "azureblob_1_accountName": {
         "type": "string",
         "metadata": {
            "description": "Name of the storage account the connector should use."
         },
         "defaultValue": "fabemailstorage"
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
   "resources": [
      {
         "properties": {
            "state": "Enabled",
            // Reference the template parameter value for the integration account ID
            "integrationAccount": {
               "id": "[parameters('LogicAppIntegrationAccount')]"
            },
            "definition": {<workflow-definition>},
            // Template parameter values used inside workflow definition
            "parameters": {
               "$connections": {
                  "value": {
                     "office365": {
                        // Connector ID, which must use same location as logic app
                        "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'office365')]",
                        // Reference the template parameter value for the connection's resource name
                        "connectionId": "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]",
                        // Reference the template parameter value for connection's display name
                        "connectionName": "[parameters('office365_1_Connection_Name')]"
                     }
                  }
               }
            },
            // Logic app resource information
            // Reference the template parameter value for the logic app name
            "name": "[parameters('LogicAppName')]",
            "type": "Microsoft.Logic/workflows",
            // Reference the template parameter value for the logic app location
            "location": "[parameters('LogicAppLocation')]",
            "tags": {
               "displayName": "LogicApp"
            },
            "apiVersion": "2016-06-01",
            "dependsOn": [
               // Reference the template parameter value for the connection's resource name
              "[resourceId('Microsoft.Web/connections', parameters('office365_1_Connection_Name'))]"
            ]
         }
      },
      {
         // APIConnection resource information
         "type": "MICROSOFT.WEB/CONNECTIONS",
         "apiVersion": "2016-06-01",
         // Reference the template parameter value for the connection's resource name
         "name": "[parameters('office365_1_Connection_Name')]",
         // Connection resource's location, which must use same location as logic app
         "location": "[parameters('LogicAppLocation')]",
         "properties": {
            "api": {
               // Connector name, which must use same location as logic app
               "id": "[concat(subscription().id, '/providers/Microsoft.Web/locations/', parameters('LogicAppLocation'), '/managedApis/', 'office365')]"
             },
             // Reference the template parameter value for the connection's display name
             "displayName": "[parameters('office365_1_Connection_DisplayName')]"
         }
      }
   ],
   "outputs": {}
}
```

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
      <more-parameter-values>
   }
}
```

For example, this parameter file provides the values for the template parameters defined earlier in this topic:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
   "contentVersion": "1.0.0.0",
   // Template parameter values
   "parameters": {
     "LogicAppName": {
        "value": "Fabrikam-Email-Processor-Logic-App"
     },
     "LogicAppLocation": {
        "value": "westeurope"
     },
      "office365_1_Connection_Name": {
        "value": "office365-2"
      },
      "office365_1_Connection_DisplayName": {
        "value": "fabrikam_europe@fabrikam.com"
      }
   }
}
```



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
Connection resources must exist in the same Azure resource group as your logic app.

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