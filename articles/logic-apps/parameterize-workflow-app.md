---
title: Create parameters for workflows in single-tenant Azure Logic Apps
description: Define parameters for values that differ in workflows across deployment environments in single-tenant Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: azla
ms.topic: how-to
ms.date: 05/25/2021
---

# Create parameters for values that change in workflows across environments for single-tenant Azure Logic Apps

In Azure Logic Apps, you can use parameters to abstract values that might change between environments. By defining parameters to use in your workflows, you can first focus on designing your workflows, and then insert environment variables later. 

In *multi-tenant* Azure Logic Apps, you need to maintain environment variables across development, testing, and production environments. You can create and reference parameters in the Azure portal by using the designer and Azure Resource Manager (ARM) templates. Parameters are defined and set at deployment, so even if you need to change just one variable, you have to redeploy your logic app's ARM template. 

In *single-tenant* Azure Logic Apps, you can work with environment variables at runtime by using parameters in your app settings. This article shows how to edit, call, and reference environment variables with parameters. 

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A [logic app workflow hosted in single-tenant Azure Logic Apps](single-tenant-overview-compare.md). If you don't have one, [create your logic app (Standard) in the Azure portal](create-single-tenant-workflows-azure-portal.md) or [in Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md).

## Parameters versus app settings

Before you decide where to store your environment variables, review the following information.

If you already use Azure Functions or Azure Web Apps, you might be familiar with app settings. In Azure Logic Apps, app settings integrate with Azure Key Vault, so you can [directly reference secure strings](../app-service/app-service-key-vault-references.md), such as connection strings and keys. Using an ARM template, you can define app settings within your [logic app workflow definition](/azure/templates/microsoft.logic/workflows). You can then capture dynamically generated infrastructure values, such as connection endpoints, storage strings, and more. However, app settings have size limitations and can't be referenced from certain areas in Azure Logic Apps.

If you use workflows in multi-tenant Azure Logic Apps, you might also be familiar with parameters. You can use parameters in a wider range of use cases than app settings, such as supporting complex objects and values of large sizes. In Visual Studio Code, you can also reference parameters in your logic app project's **workflow.json** and **connection.json** files. If you're developing your workflows locally, these references also work in the Logic Apps Designer. If you want to use both options in your solution, you can also reference app settings using parameters.

Consider the recommendation to use parameters as the default mechanism for parameterization. That way, when you need to store secure keys or strings, you can follow the recommendation to reference app settings from your parameters.

## What is parameterization?

If you use Visual Studio Code, in your logic app project, you can define parameters in the **parameters.json** file. You can reference any parameter in **parameters.json** file from any workflow or connection object in your logic app. Parameterizing your workflow inputs in single-tenant Azure Logic Apps works similarly to multi-tenant Azure Logic Apps.

To reference parameters in your trigger or action inputs, use the expression `@parameters('<parameter-name>')`. 

> [!IMPORTANT]
> Make sure that you also include any parameters that you reference in your **parameters.json** file.

In *single-tenant* Azure Logic Apps, you can parameterize different parts of your **connections.json** file. You can then check your **connections.json** file into source control, and then manage any connections through your **parameters.json** file. To parameterize your **connections.json** file, replace the values for literals, such as `ConnectionRuntimeUrl`, with a single `parameters()` expression, for example, `@parameters('api-runtimeUrl')`.

You can also parameterize complex objects, such as the `authentication` JSON object. For example, replace the `authentication` object value with a string that holds a single parameters expression, such as `@parameters('api-auth')`. 

> [!NOTE]
> The only valid expression types in the **connections.json** file are `@parameters` and `@appsetting`.

## Define parameters

In single-tenant based workflows, you need to put all parameter values in a root-level JSON file named **parameters.json**. This file contains an object that contains key-value pairs. The keys are the names of each parameter, and the values are the structures for each parameter. Each structure needs to include both a `type` and `value` declaration.

> [!NOTE]
> The only valid expression type in the **parameters.json** file is `@appsetting`.

The following example shows a basic parameters file:

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
            "value": "@appsetting('<AzureFunctionsOperation-FunctionAppKey')" 
        } 
    } 
} 
```

Typically, you need to manage multiple versions of parameter files. You might have targeted values for different deployment environments, such as development, testing, and production. Managing these parameter files often works like managing ARM template parameter files. When you deploy to a specific environment, you promote the corresponding parameter file, generally through a pipeline for DevOps.

## Define app settings

In Azure Logic Apps, app settings contain global configuration options for all workflows in the same logic app. When you run workflows locally, these settings are accessible as local environment variables in the **local.settings.json** file. You can then reference these app settings in your parameters.

To add, update, or delete app settings, review the following sections:

* [ARM templates](#app-settings-in-an-arm-template-or-bicep-template)
* [Azure portal](#app-settings-in-the-azure-portal)
* [Azure CLI](#app-settings-using-azure-cli)

### App settings in an ARM template or Bicep template

To review and define your app settings in an ARM template or Bicep template, find your logic app's resource definition, and update the `appSettings` JSON object. For the full resource definition, see the [ARM template reference](/azure/templates/microsoft.web/sites).

This example shows file settings for either ARM templates or Bicep templates:

```json
"appSettings": [
    {
        "name": "string",
        "value": "string"
    },
    <...>
],
"appSettings": [  
    {  
    "name": "string",  
    "value": "string"  
    },  
    <...>
], 
```

### App settings in the Azure portal

To review the app settings for your logic app in the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com/) search box, find and open your single-tenant based logic app.
1. On your logic app menu, under **Settings**, select **Configuration**.
1. On the **Configuration** page, on the **Application settings** tab, review the app settings for your logic app.
1. To view all values, select **Show Values**. Or, to view a single value, select that value.

To add a new setting, follow these steps:

1. On the **Application settings** tab, under **Application settings**, select **New application setting**.
1. For **Name**, enter the *key* or name for your new setting.
1. For **Value**, enter the value for your new setting.
1. When you're ready to create your new *key-value* pair, select **OK**.

:::image type="content" source="./media/parameterize-workflow-app/portal-app-settings-values.png" alt-text="Screenshot showing the Azure portal and the configuration pane with the app settings and values for a single-tenant based logic app." lightbox="./media/parameterize-workflow-app/portal-app-settings-values.png":::

### App settings using Azure CLI

To review your current app settings using the Azure CLI, run the command, `az logicapp config appsettings list`. Make sure that your command includes the `--name -n` and `--resource-group -g` parameters, for example:

```azurecli
az logicapp config appsettings list --name logicAppName --resource-group resourceGroupName
```

To add or update an app setting using the Azure CLI, run the command `az logicapp config appsettings set`. Make sure that your command includes the `--name n` and `--resource-group -g` parameters. For example, the following command creates a setting with a key named `CUSTOM_LOGIC_APP_SETTING` with a value of `12345`:

```azurecli
az logicapp config appsettings set --name functionAppName --resource-group resourceGroupName --settings CUSTOM_LOGIC_APP_SETTING=12345 
```

## Next steps

> [!div class="nextstepaction"]
> [Single-tenant vs. multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md)
