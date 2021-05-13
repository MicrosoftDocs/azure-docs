---
title: Parameterize your Azure Logic Apps single-tenant workflows
description: Use application settings and parameters to create, edit, update, and maintain your single-tenant logic apps.
services: logic-apps
ms.suite: integration
ms.reviewer: azla
ms.topic: conceptual
ms.date: 05/13/2021
---

# Parameterize your single-tenant logic app workflows

In Azure Logic Apps, you can use parameters to abstract values that might change between environments. Parameterizing your workflows helps you to write your logic apps first, then inject environment variables later. 

With *multi-tenant* Logic Apps, you need to maintain environment variables across development, testing, and production environments. You can create and reference parameters in the Azure portal by using the Logic Apps Designer and Azure Resource Manager (ARM) templates. Since parameters are defined and set at deployment, you need to redeploy your logic app's ARM template to change a single value. 

In *single-tenant* Logic Apps, you can use parameters in your app settings to work with environment variables at runtime. This article explains how to edit, call, and reference environment variables with parameters. 

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A [single-tenant logic app workflow](single-tenant-overview-compare.md). If you don't have one, create a single-tenant logic app [using the Azure portal](create-single-tenant-workflows-azure-portal.md) or [using Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md).

## App settings vs. parameters

Before you decide where to store your environment variables, review the following information.

If you already use Azure Functions or Azure Web Apps, you might already be familiar with app settings. In Logic Apps, app settings integrate with Azure Key Vault, so you can [directly reference secure strings](../app-service/app-service-key-vault-references.md), such as connection strings and keys. Using an ARM template, you can define app settings within your [logic app object](/azure/templates/microsoft.logic/workflows). You can then capture dynamically generated infrastructure values, such as connection endpoints, storage strings, and more. However, app settings have size limitations and can't be referenced from certain areas of Logic Apps.

If you use multi-tenant Logic Apps workflows, you might also be familiar with parameters. You can use parameters in a wider range of use cases than app settings, such as supporting complex objects and values of large sizes. You can also reference parameters in `workflow.json` and `connection.json` files. If you're developing your workflows locally, these references work in the Logic Apps Designer. You can also reference app settings using parameters, if you want to use both options together in your solution.

It's recommended to use parameters as the default mechanism for parameterization. Then, when you need to store secure keys or strings, it's recommended to reference app settings from your parameters.

## About parameterization

In Logic Apps, you can define parameters in the `parameters.json` file within your project. You can reference any parameter in `parameters.json` from any workflow or connection object in your logic app. Parameterization of your workflow inputs in single-tenant logic apps works similarly to parameterization in multi-tenant logic apps.

You can refer to parameters in your trigger or action inputs using the expression `@parameters('parameter_name')`. 

> [!IMPORTANT]
> Be sure to include any parameters that you reference in your `parameters.json` file, too.

In *single-tenant* Logic Apps, you can parameterize different portions of your `connections.json` file. You can then check your `connections.json` file into source control, while managing any connections through your `parameters.json` file. To parameterize your `connections.json` file, replace the values of literals (for example, `ConnectionRuntimeUrl`) with a single parameters expression (for example, `@parameters('api_runtimeUrl')`).

You can also parameterize complex objects, such as the authentication block. For example, replace the authentication block's object value with a string that holds a single parameters expression (for example, `@parameters('api_auth')`). 

> [!NOTE]
> The only types of valid expressions in the `connections.json` file are `@parameters` and `@appsetting`.

## Define parameters

In single-tenant Logic Apps workflows, you need to put all parameter values in a root-level file called `parameters.json`. This JSON file contains an object of key-value pairs. The keys are the names of each parameter, and the values are the structures of each parameter. Each structure needs to include both a `type` and `value` declaration.

> [!NOTE]
> The only type of valid expressions in the `parameters.json` file is `@appsetting`.

For example, a simple parameters file might look like:

```json
{ 
    "responseString": { 
        "type": "string", 
        "value": "hello" 
    }, 
    "functionAuth": { 
        "type": "object", 
        "value": { 
            "type": "QueryString", 
            "name": "Code", 
            "value": "@appsetting('azureFunctionOperation-functionAppKey')" 
        } 
    } 
} 
```

Typically, you need to manage multiple versions of parameter files. You might have targeted values for different deployment environments, such as development, testing, and production. Managing these parameter files often works like managing ARM template parameter files. When you deploy a specific environment, you promote the corresponding parameter file, generally through an Azure DevOps pipeline.

You can also replace parameter files dynamically using the Azure Command Line Interface (Azure CLI). **add command below**

```azurecli
az 
```

> [!NOTE]
> Similar functionalities for the Azure portal and Logic Apps Designer are not yet available.

## Define app settings

In Logic Apps, app settings contain global configuration options for all workflows in a logic app. When you run workflows locally, these settings are accessible as local environment variables in the `local.settings.json` file. You can then reference these app settings in your parameters.

You can add, update, or delete app settings as follows:
* [In ARM templates](#arm-template-app-settings)
* [In the Azure portal](#azure-portal-app-settings)
* [By using the Azure CLI](#azure-cli-app-settings)

### ARM template app settings

To review and define your app settings in an ARM or Bicep file in your logic app's resource definition, update the app setting object. For the full resource definition, see the [ARM template reference](/azure/templates/microsoft.web/sites).


Example of ARM file setting:
```armasm
"appSettings": [  
    {  
    "name": "string",  
    "value": "string"  
    },  
    <...>
], 
```

Example of Bicep file setting:
``` 
appSettings: [  
    {  
    name: 'string'  
    value: 'string'  
    }  
    <...>
] 
```

### Azure portal app settings

To review your app settings in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Choose Logic Apps from the **Azure services** section. Or, enter and select **Logic Apps** in the search box.
1. On the **Logic Apps** page, select the single-tenant logic app that you want to configure.
1. On your logic app's resource page menu, under **Settings**, select **Configuration**.
1. On the **Application settings** page, under the **Application settings** tab, review your configuration. 
1. Select **Show Values** to see all values. Or, click an individual value to show only that value.

To add a new setting:

1. Select **New application setting**.
1. For **Name**, enter your new setting's key.
1. For **Value**, enter the value for your new setting.
1. Select **OK** to create your new key-value pair.

:::image type="content" source="./media/parameterize-workflow-app/portal-app-settings-values.png" alt-text="Screenshot of Azure portal, showing configuration panel for single-tenant logic app settings and values." lightbox="./media/parameterize-workflow-app/portal-app-settings-values.png":::

### Azure CLI app settings

To review your current app settings using the Azure CLI, run the command `az logicapp config appsettings list`. Be sure to use the name (`--name -n`) and the resource group (`--resource-group -g`) parameters in your command. For example:

```azurecli
az logicapp config appsettings list --name LogicAppName --resource-group ResourceGroupName
```

To add or update an application setting using the Azure CLI, run the command `az logicapp config appsettings set`. Be sure to use the name and resource group parameters in your command. For example, the following command creates a setting with a key called `CUSTOM_LOGIC_APP_SETTING` with a value of `12345`:

```azurecli
az logicapp config appsettings set --name <FUNCTION_APP_NAME> \--resource-group <RESOURCE_GROUP_NAME> \--settings CUSTOM_LOGIC_APP_SETTING=12345 
```

For samples and more information on setting up your Logic Apps for DevOps deployments, see this doc **(link DevOps doc)**.
