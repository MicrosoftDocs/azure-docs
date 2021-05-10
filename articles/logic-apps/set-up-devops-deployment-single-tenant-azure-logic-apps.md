---
title: Set up DevOps for single-tenant Azure Logic Apps (preview)
description: Learn to set up DevOps deployment for workflows in single-tenant Azure Logic Apps (preview).
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: conceptual
ms.date: 05/10/2021

// As a developer, I want to automate deployment for workflows hosted in single-tenant Azure Logic Apps by using DevOps tools and processes.
---

# Set up DevOps deployment for single-tenant Azure Logic Apps (preview) 

This article shows how to deploy a single-tenant based logic app project from Visual Studio Code to your infrastructure by using DevOps tools and processes. Based on whether you prefer GitHub or Azure DevOps for deployment, choose the path and tools that work best for your scenario. You can use the included samples that contain example logic app projects plus examples for Azure deployment using either GitHub or Azure DevOps.

> [!NOTE]
> Azure Logic Apps currently doesn't support Azure deployment slots.

For more information about DevOps for single-tenant, review [DevOps deployment for single-tenant Azure Logic Apps (preview)](devops-deployment-single-tenant-azure-logic-apps.md).

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A single-tenant based logic app project created with [Visual Studio Code and the Azure Logic Apps (Preview) extension](create-stateful-statless-workflows-visual-studio-code.md#prerequisites).

  If you don't already have a logic app project or infrastructure set up, you can use the included sample projects to deploy an example app and infrastructure, based on the source and deployment options you prefer to use. For more information about these sample projects and the resources included to run the example logic app, review [Deploy your infrastructure](#deploy-infrastructure).

- If you want to deploy to Azure, you need an existing **Logic App (Preview)** resource created in Azure. To quickly create an empty logic app resource, review [Create single-tenant based logic app workflows - Portal](create-stateful-stateless-workflows-azure-portal.md).

<a name="api-connection-resources"></a>

### API connection resources and access policies

In single-tenant Azure Logic Apps, every managed or API connection resource in your workflows requires an associated access policy. This policy needs your logic app's identity to provide the correct permissions for accessing the managed connector infrastructure. The included sample projects include an ARM template that includes all the necessary infrastructure resources, including these access policies.

The following diagram shows the dependencies between your logic app project and infrastructure resources:

![Conceptual diagram showing infrastructure dependencies for a logic app project in the single-tenant Azure Logic Apps model.](./media/set-up-devops-deployment-single-tenant-azure-logic-apps/infrastructure-dependencies.png)

<a name="deploy-infrastructure"></a>

## Deploy your infrastructure

If you don't already have a logic app project or infrastructure set up, you can use the following sample projects to deploy an example app and infrastructure, based on the source and deployment options you prefer to use:

- [GitHub sample for Logic Apps (single-tenant)](https://github.com/Azure/logicapps/tree/master/github-sample)

  This sample includes an example logic app project for single-tenant Azure Logic Apps plus examples for Azure deployment and GitHub Actions.

- [Azure DevOps sample for Logic Apps (single-tenant)](https://github.com/Azure/logicapps/tree/master/azure-devops-sample)

  This sample includes an example logic app project for single-tenant Azure Logic Apps plus examples for Azure deployment and Azure Pipelines.
  
Both samples include the following resources that a logic app uses to run.

| Resource name | Required | Description |
|---------------|----------|-------------|
| Logic App (Preview) | Yes | This Azure resource contains the workflows that run in single-tenant Azure Logic Apps. |
| Premium or App Service hosting plan | Yes | This Azure resource specifies the hosting resources to use for running your logic app, such as compute, processing, storage, networking, and so on. |
| Azure storage account | Yes, for stateless workflows | This Azure resource stores the metadata, state, inputs, outputs, run history, and other information about your workflows. |
| Application Insights | Optional | This Azure resource provides monitoring capabilities for your workflows. |
| API connections | Optional, if none exist | These Azure resources define any managed or API connections that your workflows use to run managed connector operations, such as Office 365, SharePoint, and so on. For more information, review [API connection resources and access policies](#api-connection-resources). |
| Azure Resource Manager (ARM) template | Optional | This Azure resource defines a baseline infrastructure deployment that you can reuse or [export](../azure-resource-manager/templates/template-tutorial-export-template.md). The template also includes the required access policies, for example, to use API connections. <p><p>**Important**: Exporting the ARM template won't include all the related parameters for any API connection resources that your workflows use. For more information, review [Find API connection parameters](#find-api-connection-parameters). |
||||

<a name="find-api-connection-parameters"></a>

### Find API connection parameters

> [!IMPORTANT]
> In your logic app project, the **connections.json** file contains metadata and endpoints for any managed or API connections and Azure Functions. 
> If you want to use different connections and functions for each environment, make sure that you parameterize this file and update the endpoints.

If your workflows use managed or API connections, using the export template capability won't include all related parameters. In an ARM template, an [API connection resource definition](logic-apps-azure-resource-manager-templates-overview.md#connection-resource-definitions) has the following general format:

```json
{
   "type": "Microsoft.Web/connections",
   "apiVersion": "2016–06–01",
   "location": "[parameters('location')]",
   "name": "[parameters('connectionName')]",
   "properties": {}
}
```

To understand the properties that you need to put in the ARM template you can use the following API:  

`PUT https://management.azure.com/subscriptions/{subscription}/providers/Microsoft.Web/locations/{location}/managedApis/{connector}?api-version=2018–07–01-preview`

## Set up build and release pipelines

After you logic app project is in your source code repository, you can create build and release pipelines that deploy logic apps to infrastructure inside or outside Azure.

### Build commands

:::row:::
   :::column:::
      **Project type**
   :::column-end:::
   :::column:::
      **More information**
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      NuGet-based
   :::column-end:::
   :::column:::
      The NuGet-based project structure is based on the .NET Framework. To build these projects, make sure to follow the build steps for .NET Standard. For more information, review the [Create a NuGet package using MSBuild](/nuget/create-packages/creating-a-package-msbuild) documentation.
   :::column-end:::
:::row-end:::
:::row:::
   :::column:::
      Bundle-based
   :::column-end:::
   :::column:::
      The extension bundle-based project isn't language specific and doesn't require any language-specific build steps. You can use any method to zip your project files.
      > [!IMPORTANT]
      > Make sure that the .zip file includes all workflow folders, configuration files such as host.json, connections.json, and any other related files.
   :::column-end:::
:::row-end:::

### Deploy your logic apps

Based on your scenario and whether you use GitHub, Azure DevOps, or Azure CLI, choose from the following deployment options.

#### GitHub

For GitHub deployments, you can deploy your logic app by using [GitHub Actions](https://docs.github.com/actions), for example, the GitHub Action in Azure Functions. This action requires that you pass through the following information:

* Your build artifact
* The logic app name to use for deployment
* Your publish profile

```yaml
- name: 'Run Azure Functions Action'
  uses: Azure/functions-action@v1
  id: fa
  with:
   app-name: {your-logic-app-name}
   package: '{your-build-artifact}.zip'
   publish-profile: {your-logic-app-publish-profile}
```

For more information, review the [Continuous delivery by using GitHub Action](../azure-functions/functions-how-to-github-actions.md) documentation.

#### Azure DevOps

For Azure DevOps deployments, you can deploy your logic app by using the [Azure Function App Deploy task](/devops/pipelines/tasks/deploy/azure-function-app) in Azure Pipelines, for example, the Azure Function App task. This action requires that you pass through the following information:

* Your build artifact
* The logic app name to use for deployment
* Your publish profile

```yml
- task: AzureFunctionApp@1
        displayName: 'Deploy logic app workflows'
        inputs:
        azureSubscription: '{your-service-connection}'
        appType: 'workflowapp'
        appName: '{your-logic-app-name}'
        package: '{your-build-artifact}.zip'
        deploymentMethod: 'zipDeploy'
```

For more information, review the [Deploy an Azure Function using Azure Pipelines](/devops/pipelines/targets/azure-functions-windows) documentation.

#### Azure CLI

If you use other deployment tools, you can deploy your logic app by using the single-tenant Logic Apps Azure CLI commands. For example, to deploy your zipped artifact to an Azure resource group, run the following CLI command:

```azurecli
az logicapp deployment source config-zip -g {your-resource-group} --name {your-logic-app-name} --src {your-build-artifact}.zip 
```

## Next steps

* [DevOps deployment for single-tenant Azure Logic Apps (preview)](devops-deployment-single-tenant-azure-logic-apps.md)

We'd like to hear about your experiences with the preview logic app resource type and preview single-tenant model!

- For bugs or problems, [create your issues in GitHub](https://github.com/Azure/logicapps/issues).
- For questions, requests, comments, and other feedback, [use this feedback form](https://aka.ms/logicappsdevops).