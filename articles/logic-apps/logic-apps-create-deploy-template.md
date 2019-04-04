---
title: Create deployment templates for Azure Logic Apps | Microsoft Docs
description: Create Azure Resource Manager templates for deploying logic apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: article
ms.assetid: 85928ec6-d7cb-488e-926e-2e5db89508ee
ms.date: 10/18/2016
---

# Create Azure Resource Manager templates for deploying logic apps

When you create a logic app, you can expand your logic 
app's definition into an [Azure Resource Manager template](../azure-resource-manager/resource-group-overview.md). 
You can then use this template for automating deployments 
by defining the resources and parameters you want used for 
deployment and providing the parameter values through a 
[parameters file](../azure-resource-manager/resource-group-template-deploy.md#parameter-files).
That way, you can deploy logic apps more easily and 
to any environment or Azure resource group you want. 

Azure Logic Apps provides a 
[prebuilt logic apps Azure Resource Manager template](https://github.com/Azure/azure-quickstart-templates/blob/master/101-logic-app-create/azuredeploy.json) 
that you can reuse, not only for creating logic apps,
but also to define the resources and parameters to use for deployment. 
You can use this template for your own business scenarios or
customize the template to meet your requirements. Learn more about 
[Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md). 
For JSON syntax and properties, see [Microsoft.Logic resource types](/azure/templates/microsoft.logic/allversions).

For more about Azure Resource Manager templates, 
see these articles:

* [Author Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md)
* [Develop Azure Resource Manager templates for cloud consistency](../azure-resource-manager/templates-cloud-consistency.md)

## Logic app structure

Your logic app definition has these basic sections, which you 
can view by switching from "designer view" to "code view" or 
by using a tool such as [Azure Resource Explorer](http://resources.azure.com). 
Logic app definitions use Javascript Object Notation (JSON), 
so for more information about JSON syntax and properties, see 
[Microsoft.Logic resource types](/azure/templates/microsoft.logic/allversions).

* **Logic app resource**: Describes information such as your logic 
app's location or region, pricing plan, and workflow definition.

* **Workflow definition**: Describes your logic app's triggers and actions 
and how the Azure Logic Apps service runs the workflow. In code view, 
you can find the workflow definition in the `definition` section.

* **Connections**: If you use managed connectors in your logic app, 
the `$connections` section references other resources that securely 
store metadata about these connections between your logic app and other 
systems or services, such as connection strings and access tokens. 
Inside your logic app definition, references to these connections 
appear inside your logic app definition's `parameters` section.

To create a logic app template that you can use with Azure resource group deployments,
you must define the resources and parameterize as necessary. For example, if you're 
deploying to a development, test, and production environment, you likely want 
to use different connection strings to a SQL database in each environment.
Or, you might want to deploy within different subscriptions or resource groups.

## Create logic app deployment templates

For the easiest way to create a valid logic app deployment template, 
use Visual Studio and the Azure Logic Apps Tools for Visual Studio extension. 
By downloading your logic app from the Azure portal into Visual Studio, 
you get a valid deployment template that you can use with any Azure 
subscription and location. Also, downloading your logic app automatically 
parameterizes the logic app definition that's embedded in the template.
For more information about creating and managing logic apps in Visual Studio, 
see [Create logic apps with Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md) 
and [Manage logic apps with Visual Studio](../logic-apps/manage-logic-apps-with-visual-studio.md).

Other than Visual Studio or manually creating your 
template and the necessary parameters by following 
the guidance in this topic, you can also use the 
[PowerShell module for creating logic app templates](https://github.com/jeffhollan/LogicAppTemplateCreator). 
This open-source module first evaluates your logic app 
and any connections that the logic app uses. The module 
then generates template resources with the necessary 
parameters for deployment. For example, suppose you 
have a logic app that receives a message from an Azure 
Service Bus queue and adds data to an Azure SQL database. 
The module tool preserves all the orchestration logic 
and parameterizes the SQL and Service Bus connection 
strings so that you can set those values at deployment.

> [!IMPORTANT]
> Connections must exist in the same Azure resource group as the logic app.
> For the PowerShell module to work with any Azure tenant and subscription access token, 
> use the module with the [Azure Resource Manager client tool](https://github.com/projectkudu/ARMClient). 
> For more information, see this 
> [article about the Azure Resource Manager client tool](https://blog.davidebbo.com/2015/01/azure-resource-manager-client.html) discusses ARMClient in more detail.

### Install PowerShell module for logic app templates

For the easiest way to install the module from the 
[PowerShell Gallery](https://www.powershellgallery.com/packages/LogicAppTemplate/0.1), 
use this command:

`Install-Module -Name LogicAppTemplate`

You can also manually install the PowerShell module:

1. Download the latest [Logic App Template Creator](https://github.com/jeffhollan/LogicAppTemplateCreator/releases).

1. Extract the folder in your PowerShell module folder, 
which is usually `%UserProfile%\Documents\WindowsPowerShell\Modules`.

### Generate logic app template - PowerShell

After PowerShell is installed, you can generate a template by using the following command:

`armclient token $SubscriptionId | Get-LogicAppTemplate -LogicApp MyApp -ResourceGroup MyRG -SubscriptionId $SubscriptionId -Verbose | Out-File C:\template.json`

`$SubscriptionId` is the Azure subscription ID. This line first gets an access token via ARMClient, then pipes it through to the PowerShell script, and then creates the template in a JSON file.

## Parameters in logic app templates

After you create your logic app template, you can 
add and edit any necessary parameters. Your template 
has more than one `parameters` section, for example: 

* Your logic app's workflow definition has its own 
[`parameters` section](../logic-apps/logic-apps-workflow-definition-language.md#parameters) 
where you can define all the parameters that your 
logic app uses for accepting inputs at deployment.

* Your Resource Manager template has its own 
[`parameters` section](../azure-resource-manager/resource-group-authoring-templates.md#parameters), 
separate from your logic app's `parameters` section. 
For example:

  [!INCLUDE [logic-deploy-parameters](../../includes/app-service-logic-deploy-parameters.md)]

For example, suppose your logic app definition references 
a resource ID that represents an Azure function or a nested 
logic app workflow, and you want to deploy that resource ID 
along with your logic app as a single deployment. You can 
add that ID as a resource in your template and parameterize 
that ID. You can use this same approach for references to 
custom APIs or OpenAPI endpoints (formerly "Swagger") 
that you want deployed with each Azure resource group.

When you use parameters in your deployment template, 
follow this guidance so the Logic Apps Designer can 
show those parameters correctly:

* Use parameters only in these triggers and actions:

  * Azure Functions app
  * Nested or child logic app workflow
  * API Management call
  * API connection runtime URL
  * API connection path

* When you define parameters, make sure that you provide 
default values by using the `defaultValue` property value, 
for example:

  ```json
  "parameters": {
     "IntegrationAccount": {
        "type":"string",
        "minLength": 1,
        "defaultValue": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource=group-name>/providers/Microsoft.Logic/integrationAccounts/<integration-account-name>"
     }
  },
  ```

* To secure or hide sensitive information in templates, 
secure your parameters. Learn more about 
[how to use secured parameters](../logic-apps/logic-apps-securing-a-logic-app.md#secure-parameters-workflow).

Here's an example that shows how you can parameterize 
the Azure Service Bus "Send message" action:

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

### Reference dependent resources

If your logic app requires references to dependent resources, you can use 
[Azure Resource Manager template functions](../azure-resource-manager/resource-group-template-functions.md) 
in your logic app's deployment template. For example, suppose you want your 
logic app to reference an Azure function or an integration account with definitions 
for partners, agreements, and other artifacts you want deployed alongside your logic app.
You can use Resource Manager template functions, such as `parameters`, 
`variables`, `resourceId`, `concat`, and so on.

Here's an example that shows how you can replace the resource 
ID for an Azure function by defining these parameters:

``` json
"parameters": {
   "<Azure-function-name>": {
      "type": "string",
      "minLength": 1,
      "defaultValue": "<Azure-function-name>"
   }
},
```

Here's how you use these parameters when referencing the Azure function:

```json
"MyFunction": {
   "type": "Function",
   "inputs": {
      "body": {},
      "function": {
         "id":"[resourceid('Microsoft.Web/sites/functions','<Azure-Functions-app-name>', parameters('<Azure-function-name>'))]"
      }
   },
   "runAfter": {}
},
```

## Add logic app to resource group project

If you have an existing Azure Resource Group project, 
you can add your logic app to that project by using 
the JSON Outline window. You can also add another 
logic app alongside the app you previously created.

1. In Solution Explorer, open the `<template>.json` file.

2. From the **View** menu, select **Other Windows** > **JSON Outline**.

3. To add a resource to the template file, 
choose **Add Resource** at the top of the JSON Outline window. 
Or in the JSON Outline window, 
right-click **resources**, and select **Add New Resource**.

   ![JSON Outline window](./media/logic-apps-create-deploy-template/jsonoutline.png)

4. In the **Add Resource** dialog box, find and select **Logic App**. 
Name your logic app, and choose **Add**.

   ![Add resource](./media/logic-apps-create-deploy-template/addresource.png)

## Get support

For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).

## Next steps

> [!div class="nextstepaction"]
> [Deploy logic app templates](../logic-apps/logic-apps-create-deploy-azure-resource-manager-templates.md)
