---
title: Create parameters for workflows in single-tenant Azure Logic Apps
description: Define parameters for values that differ in workflows across deployment environments in single-tenant Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: azla
ms.topic: how-to
ms.date: 06/08/2021
---

# Create parameters for values that change in workflows across environments for single-tenant Azure Logic Apps

In Azure Logic Apps, you can use parameters to abstract values that might change between environments. By defining parameters to use in your workflows, you can first focus on designing your workflows, and then insert your environment-specific variables later.

In *multi-tenant* Azure Logic Apps, you can create and reference parameters in the workflow designer, and then set the variables in your Azure Resource Manager (ARM) template and parameters files. Parameters are defined and set at deployment. So, even if you need to only change one variable, you have to redeploy your logic app's ARM template.

In *single-tenant* Azure Logic Apps, you can work with environment variables both at runtime and deployment time by using parameters and app settings. This article shows how to edit, call, and reference environment variables with the new single-tenant parameters experience.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A [logic app workflow hosted in single-tenant Azure Logic Apps](single-tenant-overview-compare.md).

  If you don't have a logic app, [create your logic app (Standard) in the Azure portal](create-single-tenant-workflows-azure-portal.md) or [in Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md).

## Parameters versus app settings

Before you decide where to store your environment variables, review the following information.

If you already use Azure Functions or Azure Web Apps, you might be familiar with app settings. In Azure Logic Apps, app settings integrate with Azure Key Vault. You can [directly reference secure strings](../app-service/app-service-key-vault-references.md), such as connection strings and keys. Similar to ARM templates, where you can define environment variables at deployment time, you can define app settings within your [logic app workflow definition](/azure/templates/microsoft.logic/workflows). You can then capture dynamically generated infrastructure values, such as connection endpoints, storage strings, and more. However, app settings have size limitations and can't be referenced from certain areas in Azure Logic Apps.

If you're familiar with workflows in multi-tenant Azure Logic Apps, you might also be familiar with parameters. You can use parameters in a wider range of use cases than app settings, such as supporting complex objects and values of large sizes. If you use Visual Studio Code as your local development tool, you can also reference parameters in your logic app project's **workflow.json** and **connections.json** files. If you want to use both options in your solution, you can also reference app settings using parameters.

> [!NOTE]
> For development, if you parameterize the **connections.json** file, the designer experience becomes restricted, both locally and in the Azure portal. 
> If you need to use the designer for development, use a non-parameterized **connections.json** file. Then, in your deployment pipelines, replace with 
> the parameterized file. The runtime still works with parameterization. Designer improvements are in development.

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

To replace parameter files dynamically using the Azure CLI, run the following command:

```azurecli
az functionapp deploy --resource-group MyResourceGroup --name MyLogicApp --src-path C:\parameters.json --type static --target-path parameters.json
```

If you have a NuGet-based Logic App project, you have to update your project file (**&lt;logic-app-name&gt;.csproj**) to include the parameters file in the build output, for example:
  
```csproj
<ItemGroup>
  <None Update="parameters.json">
    <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
  </None>
</ItemGroup>
```

> [!NOTE]
> Currently, the capability to dynamically replace parameter files is not yet available in the Azure portal or the workflow designer.

For more information about setting up your logic apps for DevOps deployments, review the following documentation:

- [DevOps deployment overview for single-tenant based logic apps](devops-deployment-single-tenant-azure-logic-apps.md)
- [Set up DevOps deployment for single-tenant based logic apps](set-up-devops-deployment-single-tenant-azure-logic-apps.md)

## Manage app settings

In single-tenant Azure Logic Apps, app settings contain global configuration options for *all the workflows* in the same logic app. When you run workflows locally in Visual Studio Code, these settings are accessible as local environment variables in the **local.settings.json** file. You can then reference these app settings in your parameters.

To add, update, or delete app settings, select and review the following sections for Visual Studio Code, Azure portal, Azure CLI, or ARM (Bicep) template.

### [Azure portal](#tab/azure-portal)

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

### [Azure CLI](#tab/azure-cli)

To review your current app settings using the Azure CLI, run the command, `az logicapp config appsettings list`. Make sure that your command includes the `--name -n` and `--resource-group -g` parameters, for example:

```azurecli
az logicapp config appsettings list --name MyLogicApp --resource-group MyResourceGroup
```

To add or update an app setting using the Azure CLI, run the command `az logicapp config appsettings set`. Make sure that your command includes the `--name n` and `--resource-group -g` parameters. For example, the following command creates a setting with a key named `CUSTOM_LOGIC_APP_SETTING` with a value of `12345`:

```azurecli
az logicapp config appsettings set --name MyLogicApp --resource-group MyResourceGroup --settings CUSTOM_LOGIC_APP_SETTING=12345 
```

### [Resource Manager or Bicep template](#tab/azure-resource-manager)

To review and define your app settings in an ARM template or Bicep template, find your logic app's resource definition, and update the `appSettings` JSON object. For the full resource definition, see the [ARM template reference](/azure/templates/microsoft.web/sites).

This example shows file settings for either ARM templates or Bicep templates:

```json
"appSettings": [
    {
        "name": "string",
        "value": "string"
    },
    {
        "name": "string",
        "value": "string"
    },
    <...>
], 
```

---

## Next steps

> [!div class="nextstepaction"]
> [Single-tenant vs. multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md)
