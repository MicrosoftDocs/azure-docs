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

When you're ready to automate how you create and deploy your logic app, you can expand your logic app's underlying workflow definition into an [Azure Resource Manager template](../azure-resource-manager/resource-group-overview.md). This template defines the infrastructure, resources, parameters, and other setup information for provisioning and deploying your logic app. By using Resource Manager templates, you can repeatedly and consistently deploy logic apps to any environment, Azure subscription, and Azure resource group that you want.

For example, if you're deploying to a development, test, and production environment, you're likely using different connection strings in each environment. You can provide these connection strings for your template by creating a [parameter file](../azure-resource-manager/resource-group-template-deploy.md#parameter-files).

This article provides an overview about the high-level structure and syntax for a Resource Manager template compared to a logic app's underlying workflow definition. Both the template and your workflow definition use JSON but with some differences because the workflow definition also follows the [Workflow Definition Language schema](../logic-apps/logic-apps-workflow-definition-language.md).

For general information about Resource Manager templates, see these topics:

* [Azure Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md)
* [Azure Resource Manager template best practices](../azure-resource-manager/template-best-practices.md)

For a sample prebuilt template for a basic logic app, see [GitHub - azure-quickstart-templates/101-logic-app-create](https://github.com/Azure/azure-quickstart-templates/blob/master/101-logic-app-create).

<a name="template-structure"></a>

## Template structure

This section summarizes Resource Manager templates at a high level, which follow this structure:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "<template-version-number>",
   "parameters": {},
   "variables": {},
   "functions": [],
   "resources": [],
   "outputs": {}
}
```

Here are brief details about these attributes in Resource Manager templates. For full details, see [Azure Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md).

| Attribute | Required | Description |
|-----------|----------|-------------|
| `$schema` | Yes | The location for the JSON schema file that specifies the version for the Resource Manager template language |
| `contentVersion` | Yes | The version for this Resource Manager template |
| `parameters` | No | The Resource Manager template parameters to use for customizing resource deployment, for example, for dev, test, and production environments. For full details, see [Parameters - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#parameters). |
| `variables` | No | The values that you construct and use for simplifying complex expressions throughout your Resource Manager template. That way, you only need to update the variable when those values change. For full details, see [Variables - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#variables). |
| `functions` | No | Any functions that you want to create and use repeatedly within your Resource Manager template. For full details, see [Functions - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#functions). |
| `resources` | Yes | The definitions for the resources that you want the Resource Manager template to deploy or update in an Azure resource group or subscription. For full details, see [Resources - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#resources). |
| `outputs` | No | The values that you want returned after deployment, for example, values from resources that the Resource Manager template deployed. For full details, see [Outputs - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#outputs). |
||||

<a name="template-parameters"></a>

## Template parameters

Your Resource Manager template's `parameters` attribute defines the parameters for the values to use when deploying resources. You can also supply these parameter values to the template by using a [parameter file](../azure-resource-manager/resource-group-template-deploy.md#parameter-files). A template that includes a logic app workflow definition has more than one `parameters` attribute, which appears at different levels:

* Your template has its own `parameters` attribute, which differs from your logic app definition's `parameters` attribute. For example, to reference template parameter values, which are evaluated at deployment, expressions follow this syntax, which uses square brackets (**[ ]**):

  `"<attribute-name>": "[parameters('<template-parameter-name>')]"`

* Your logic app's workflow definition has its own `parameters` attribute where you define the parameters that your workflow definition uses to accept inputs from the template at runtime. To reference workflow definition parameter values, which are evaluated at runtime, expressions follow this syntax, which uses the at sign (**@**):

  `"<attribute-name>": "@parameters('<workflow-definition-parameter-name>')"`

For more information about parameters, see these topics:

* [Parameters - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#parameters)
* [Best practices for template parameters](../azure-resource-manager/template-best-practices.md#parameters)
* [Parameters in logic app workflow definitions](#workflow-parameters)

Note these particular practices for defining template parameters:

* Define parameters only for values that vary, based on the resources that you're deploying or based on the environment where you're deploying. Don't define parameters for values that always stay the same.

* Provide default values for parameters except when parameters handle information that is sensitive or require security. To hide or protect sensitive information in template parameters, follow the guidance in these topics:
  
  * [Security recommendations for template parameters](../azure-resource-manager/template-best-practices.md#parameters)
  * [Pass secure parameter values with Azure Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md)

* Differentiate template parameters from workflow definition parameters by using descriptive names.

The template's `resources` attribute uses the template's parameter values for creating and deploying your logic app. For example, these parameter values include the name for your logic app that the template creates and your logic app's location or region. For example, this Resource Manager template's `parameters` attribute defines the values that are used by the template's `resources` attribute, which is described in a later section, for creating and running the logic app:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {
      "logicAppLocation": {
         "type": "string",
         "defaultValue": "[resourceGroup().location]",
         "metadata": {
            "description": "Location of the logic app"
         }
      },
      "logicAppName": {
         "type": "string",
         "defaultValue": "<logic-app-name>",
         "minLength": 1,
         "maxLength": 80,
         "metadata": {
            "description": "The name of the logic app to create"
         }
      }
   },
   "variables": {},
   "functions": [],
   "resources": [],
   "outputs": {}
}
```

Here's another example where the template's `parameters` attribute defines a parameter for an integration account that's linked to your logic app:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {
      "logicAppLocation": {<...>},
      "logicAppName": {<...>},
      "IntegrationAccount": {
         "type":"string",
         "minLength": 1,
         "defaultValue": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group-name>/providers/Microsoft.Logic/integrationAccounts/<integration-account-name>"
      }
   },
   <...>
  }
  ```

<a name="template-parameter-files"></a>

## Template parameter files

To store values for Resource Manager template parameters, create a [parameter file](../azure-resource-manager/resource-group-template-deploy.md#parameter-files). For example, here is a short parameter file for the template parameters in the previous section:

```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {
     "logicAppName": {
        "value": "MyLogicAppName"
     },
     "logicAppLocation": {
        "value": [
           "northeurope",
           "westeurope"
        ]
     }
   }
}
```

<a name="template-resources"></a>

## Template resources

The Resource Manager template's `resources` attribute declares information about the resources that you want to deploy. This attribute can reference this information in the template's `parameters` attribute by using the `parameters()` function. For more information about template resources, see these topics:

* [Resources - Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md#resources)
* [Best practices for template resources](../azure-resource-manager/template-best-practices.md#resources).

Your logic app's workflow definition is an Azure resource. So, inside the template's `resources` attribute, the `properties` attribute contains information for your logic app resource:

```json
"resources": {
   "name": "[parameters('logicAppName')]",
   "type": "Microsoft.Logic/workflows",
   "location": "[parameters('logicAppLocation')",
   "tags": {
      "displayName": "LogicApp"
   },
   "apiVersion": "2016-06-01",
   "properties": {
      "$connections" : {<any-managed-connections-in-your-logic-app>},
      "definition": {<logic-app-workflow-definition>},
      "parameters": {}
   },
   "dependsOn": []
}
```

| Attribute | Required | Description |
|-----------|----------|-------------|
| `$connections` | No | If your logic app uses [managed connectors](../connectors/apis-list.md), the `$connections` attribute references other resources that store metadata about connections that your logic app makes to other services or systems. For more information, see [Connections](#workflow-connections). |
| `definition` | Yes | Contains your logic app's underlying workflow definition, which describes how the Logic Apps service runs that workflow along with definitions for the trigger, actions, workflow parameters, outputs, schema, and so on. For more information, see [Logic app workflow definition](#workflow-definition). |
| `parameters` | No | The parameters to use for values used by connections in your logic app as defined by the `$connections` attribute |
||||

You can view the attributes for your logic app by changing from "design view" to "code view" in the Azure portal or Visual Studio, or by using a tool such as [Azure Resource Explorer](http://resources.azure.com).

<a name="workflow-connections"></a>

## Logic app connections

The `$connections` attribute contains references to resources that securely store metadata about any connections used your logic apps through [managed connectors](../connectors/apis-list.md). Such metadata can include connection strings and access tokens. For example, here is a reference for an Office 365 Outlook connection:

```json
{
   "resources": {
      "properties": {
         "$connections": {
            "value": {
               "office365": {
                  "connectionId": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group-name>/providers/Microsoft.Web/connections/office365",
                  "connectionName": "office365",
                  "id": "/subscriptions/<Azure-subscription-ID>/providers/Microsoft.Web/locations/<logic-app-location>/managedApis/office365"
               }
            }
         },
         "definition": {<logic-app-workflow-definition>}
      }
   }
}
```

Inside your logic app definition, the trigger or action definition references information inside the `$connections` attribute. For example, inside the trigger definition, inside the `connection` attribute, the `name` attribute uses the `parameters()` function to reference the `office365` and `connectionId` attributes inside `$connections`:

```json
{
   "definition": {
      "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
      "actions": {<one-or-more-action-definitions>},
      "contentVersion": "1.0.0.0",
      "outputs": {},
      "parameters": {
         "$connections": {
            "defaultValue": {},
            "type": "Object"
         }
      },
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
                 "frequency": "Minute",
                 "interval": 3
             },
             "splitOn": "@triggerBody()?['value']",
             "type": "ApiConnection"
           }
      }
   }
}
```

<a name="workflow-definition"></a>

## Logic app workflow definition

Inside the `definition` attribute, your logic app's workflow definition has this high-level structure:

```json
"definition": {
   "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
   "contentVersion": "1.0.0.0",
   "actions": {<one-or-more-action-definitions>},
   "outputs": {},
   "parameters": {},
   "triggers": {<trigger-definition>}
}
```

For example, here's a logic app workflow definition that has these elements:

* A **Recurrence** trigger that fires hourly

* A basic HTTP action that calls a GET operation at a specific URI, `https://test.uri.com`

```json
"definition": {
  "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
  "actions": {
     "HTTP": {
        "inputs": {
           "authentication": {
              "password": "myPassword",
              "type": "Basic",
              "username": "myUserName"
           },
           "method": "GET",
           "uri": "https://test.uri.com"
         },
         "runAfter": {},
         "type": "Http"
     }
  },
  "contentVersion": "1.0.0.0",
  "outputs": {},
  "parameters": {},
  "triggers": {
     "Recurrence": {
        "recurrence": {
           "frequency": "Hour",
           "interval": 1
        },
        "type": "Recurrence"
     }
  }
}
```

<a name="workflow-parameters"></a>

## Workflow definition parameters

In your logic app workflow definition, you can add and edit any parameters that the workflow definition uses for accepting inputs at runtime. For more information about workflow definition parameters, see [Parameters - Workflow Definition Language](../logic-apps/logic-apps-workflow-definition-language.md#parameters).

Note these particular practices for defining workflow definition parameters and to make sure that the Logic Apps Designer can show those parameters correctly:

* You can use logic app parameters in these kinds of triggers and actions:

  * API connection runtime URL
  * API connection path
  * API Management call
  * Azure Functions app
  * Nested or child logic app workflow

* Provide default values for parameters except when parameters handle information that is sensitive or require security. To hide or protect sensitive information in workflow definition parameters, follow the guidance in these topics:

  * [Security recommendations for action and input parameters](../logic-apps/logic-apps-securing-a-logic-app.md#secure-action-parameters-and-inputs)
  * [Pass secure parameter values with Azure Key Vault](../azure-resource-manager/resource-manager-keyvault-parameter.md)

For example, suppose your logic app's workflow definition references a resource ID that represents an Azure function or a nested logic app workflow, and you want to deploy that resource ID along with your logic app as a single deployment. You can add that ID as a resource in your template and parameterize that ID. You can use this same approach for references to custom APIs or OpenAPI endpoints (formerly "Swagger") that you want deployed with each Azure resource group.

Here's an example that shows how you can parameterize the Azure Service Bus "Send message" action:

```json
"Send_message": {
   "type": "ApiConnection",
   "inputs": {
      "host": {
         "connection": {
            "name": "@parameters('$connections')['servicebus']['connectionId']"
         },
         // If the `host.runtimeUrl` property appears in your template, 
         // you can remove this property, which is optional, for example:
         "runtimeUrl": {}
      },
      "method": "POST",
      "path": "[concat('/@{encodeURIComponent(''', parameters('<Azure-Service-Bus-queue-name>'), ''')}/messages')]",
      "body": {
         "ContentData": "@{base64(triggerBody())}"
      },
      "queries": {
         "systemProperties": "None"
      }
   },
   "runAfter": {}
},
```

Here is a more extensive example Resource Manager template, which is updated from the [prebuilt sample template](https://github.com/Azure/azure-quickstart-templates/blob/master/101-logic-app-create/azuredeploy.json). The logic app workflow definition in this template runs hourly and pings the location specified by the `testUri` parameter. The template uses parameter values for the logic app name (`logicAppName`) and the URI (`testUri`) to ping for testing. This template also sets the logic app's location or Azure region to the same location as the Azure resource group (`[resourceGroup().location]`).

Here are descriptions for the parameters used in this template:

| Parameter | Description |
| --------- | ----------- |
| `logicAppName` | The name of the logic app that the template creates |
| `testUri` | The URI location to ping for testing |
| `logicAppLocation` | The location or Azure region where to create and deploy the logic app |
||||


```json
{
   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
   "contentVersion": "1.0.0.0",
   "parameters": {
      "logicAppName": {
         "type": "string",
         "minLength": 1,
         "maxLength": 80,
         "metadata": {
            "description": "The name of the logic app to create"
         }
      },
      "logicAppLocation": {
         "type": "string",
         "defaultValue": "[resourceGroup().location]",
         "metadata": {
            "description": "Location of the logic app"
         }
      },
      "testUri": {
         "type": "string",
         "defaultValue": "http://azure.microsoft.com/status/feed/",
         "metadata": {
            "description": "A test URI"
         }
      }
   },
   "variables": {},
   "resources": [ {
      "name": "[parameters('logicAppName')]",
      "type": "Microsoft.Logic/workflows",
      "location": "[parameters('logicAppLocation')",
      "tags": {
         "displayName": "LogicApp"
      },
      "apiVersion": "2016-06-01",
      "properties": {
         "definition": {
            "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-0601/workflowdefinition.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {
               "testURI": {
                  "type": "string",
                  "defaultValue": "[parameters('testUri')]"
               }
            },
            "actions": {
               "HTTP": {
                  "type": "Http",
                  "inputs": {
                     "method": "GET",
                     "uri": "@parameters('testUri')"
                  },
                  "runAfter": {}
               }
            },
            "triggers": {
               "Recurrence": {
                  "type": "Recurrence",
                  "recurrence": {
                     "frequency": "Hour",
                     "interval": 1
                  }
               }
            },
            "outputs": {}
         },
         "parameters": {}
      }
   } ],
   "outputs": {}
}
```

## Reference dependent resources

If your logic app has references to dependent resources, you can use [Azure Resource Manager template functions](../azure-resource-manager/resource-group-template-functions.md), such as `parameters()`, `variables()`, `resourceId()`, `concat()`, and so on, for referencing those dependencies.

For example, suppose your logic app references an Azure function that you want deployed with your logic app. This sample prebuilt template shows how a logic app references that function and how the template deploys that Azure function: [GitHub - azure-quickstart-templates/101-logic-app-and-function-app](https://github.com/Azure/azure-quickstart-templates/blob/master/101-logic-app-and-function-app)

## Authorize OAuth connections

At deployment, your logic app works end-to-end with valid parameters. However, you must still authorize OAuth connections to generate a valid access token.

* To authorize OAuth connections, open your logic app in Logic App Designer. In the designer, authorize any required connections.

* For automated deployment, you can use a script that provides consent for each OAuth connection. Here's an example script in GitHub in the [LogicAppConnectionAuth](https://github.com/logicappsio/LogicAppConnectionAuth) project.

## Next steps

> [!div class="nextstepaction"]
> [Create logic app templates](../logic-apps/logic-apps-create-azure-resource-manager-templates.md)