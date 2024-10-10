---
title: 'Deploy Azure Static Web Apps with Bicep'
description: Deploy Azure Static Web Apps using Bicep, and optionally link an existing Azure Functions app as the backend to your static web app.
services: static-web-apps
author: craigshoemaker
ms.service: azure-static-web-apps
ms.topic: how-to
ms.date: 08/28/2024
ms.author: cshoe
#customer intent: As a developer, I want create a Static Web App on Azure with a Bicep file so that the process can to automated.
---

# Deploy Azure Static Web Apps with Bicep

You can use a Bicep file to create an instance of Azure Static Web Apps. Bicep provides a declarative syntax to define and create Azure resources, which can be automated and repeated for consistency.

The steps in this article show you how to use Bicep to create a resource group and a Static Web Apps instance. After your static web app is created you still need to deploy your code using the typical methods of GitHub Actions, or using Azure Pipelines.

You can use Bicep along with Azure Verified Modules (AVM) to deploy your static web apps.

## Verified modules

The Bicep examples in this article use [Azure Verified Modules (AVM)](https://azure.github.io/Azure-Verified-Modules/) when possible and [Bicep](/azure/azure-resource-manager/bicep/) when AVM isn't available. AVM modules are recognizable because they reference modules that include `avm/res`, such as `br/public:avm/res/web/static-site:0.3.0`.

Using a verified module allows you to use opinionated managed Bicep code maintained by professional engineers fluent in Bicep. Since verified modules require support and dedicated attention, sometimes a module you need might not be available. If an AVM isn't available, you can code your [Bicep files](/azure/templates/) by hand.

## Prerequisites

- [Bicep tools](../azure-resource-manager/Bicep/install.md): Learn how to install Bicep tools.
- [Visual Studio Code extension for Bicep](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep): An optional extension that creates resources for you by running your Bicep file.

## Create a static web app resource

The following code creates a new resource group and a Static Web Apps resource and then outputs the default host name and static web app name.

Create a file named `main.bicep` file and paste in the following code.

Before you run this code, make sure to replace the `<REGION_NAME>` placeholder with your region name.

```Bicep
targetScope = 'subscription'

param location string ='<REGION_NAME>'

@description('String to make resource names unique')
var resourceToken = uniqueString(subscription().subscriptionId, location)

@description('Create a resource group')
resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: 'rg-swa-app-${resourceToken}'
  location: location
}

@description('Create a static web app')
module swa 'br/public:avm/res/web/static-site:0.3.0' = {
  name: 'client'
  scope: rg
  params: {
    name: 'swa-${resourceToken}'
    location: location
    sku: 'Free'
  }
}

@description('Output the default hostname')
output endpoint string = swa.outputs.defaultHostname

@description('Output the static web app name')
output staticWebAppName string = swa.outputs.name
```

This code:

- Scopes the action to the current Azure subscription.
- Generates a unique string to ensure the static web app name is globally unique.
- Creates a new resource group.
- Creates a new Static Web Apps instance using the free tier.
- Outputs the web app's URL.
- Outputs the static web app name.

After you execute this file, save the values of the output variables to a text editor.

See the next section if you want to link an existing Azure Functions app to your static web app.

## Link a Functions app

The code in the previous section demonstrates how to create a static web app using the free tier. If you want to link a managed backend to your static web app, you need to change to the [Standard hosting plan](/azure/static-web-apps/plans).

To link your Functions app to your static web app, you need the `resourceId` of your Functions App. You can get this value from the Azure portal, or you can use the following command to return your Functions app `resourceId`.

```azurecli
az functionapp show -n <FUNCTION-APP-NAME> -g <RESOURCE-GROUP-NAME> --query id --output tsv
```

Create a file named `config.bicep` file and paste in the following code.

Before you run this code, make sure to replace the placeholders surrounded by `<>` with your values.

```Bicep
targetScope = 'resourceGroup'

param location string = '<REGION_NAME>'
param staticWebAppName string = '<STATIC_WEB_APP_NAME>'
param functionsAppResourceId = '<FUNCTIONS_APP_RESOURCE_ID>'

@description('Get reference to the static web app')
resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' existing = {
  name: staticWebAppName
}

@description('Link backend to static web app')
resource linkedStaticWebAppBackend 'Microsoft.Web/staticSites/linkedBackends@2023-12-01' = {
  parent: staticWebApp
  name: 'linkedBackend'
  properties: {
    backendResourceId: functionsAppResourceId
    region: location
  }
}
```

This code:

- Scopes the action to the Azure resource group.
- Gets access to the existing static web app by name.
- Links the static web app to a Functions app using the Functions app `resourceId`.

## Deployment

Now that your Azure Static Web Apps instance is created, you can deploy your source code to the static web app with one of the following tools:

- [Azure Developer CLI (Recommended)](/azure/developer/azure-developer-cli)
- [Static Web Apps CLI](https://github.com/Azure/static-web-apps-cli)
- [GitHub Actions](https://docs.github.com/actions)
- [Azure Pipelines](/azure/devops/pipelines/overview-azure)

- **Local development environment**: Use [Azure Developer CLI](/azure/developer/azure-developer-cli) to deploy from your local machine. When running locally, you define your deployment in an `azure.yml` file. This file includes hooks that plug into the resource creation process at any point. These extensibility points help you during deployment, especially when different parts of your app need to know about each other at build time.

- **Production environment**: The ability to deploy from a GitHub Actions workflow file is a built-in feature when you create your static web app. Once the file is in your repository, you can edit the file as needed. Deployment from [other source code providers](external-providers.md) is also supported.

To learn more from a full end-to-end application that includes resource creation and application deployment, see [Serverless AI Chat with RAG using LangChain.js](https://github.com/Azure-Samples/serverless-chat-langchainjs).

## Faster deployments with the Azure Developer CLI

Azure Developer CLI (`azd`) uses Bicep files along with deployment configurations to create your application. Since version 1.4, `azd` checks the Bicep against cloud resources to determine if the underlying infrastructure as code (IaC) state requires updates. If the state remains unchanged, creation and configuration are skipped. To learn more about this performance improvement, see [azd provision is now faster when there are no infrastructure changes](
https://devblogs.microsoft.com/azure-sdk/azure-developer-cli-azd-october-2023-release/#azd-provision-is-now-faster-when-there-are-no-infrastructure-changes
).

## Related content

- [Awesome AZD](https://azure.github.io/awesome-azd/?tags=swa)
- [Public Bicep Registry](https://github.com/Azure/bicep-registry-modules)
- [Azure Developer CLI](/azure/developer/azure-developer-cli)
- [Static Web Apps CLI](https://github.com/Azure/static-web-apps-cli)
- [GitHub Actions](https://docs.github.com/actions)