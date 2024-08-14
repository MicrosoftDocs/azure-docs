---
title: 'Deploy Azure Static Web Apps with Bicep'
description: Deploy Azure Static Web Apps using Bicep including resource creation and configuration. Link your own Azure Function to support your static web app.
services: static-web-apps
ms.custom: 
author: craigshoemaker
ms.service: azure-static-web-apps
ms.topic: how-to
ms.date: 08/13/2024
ms.author: cshoe
#customer intent: As a developer, I want create a Static Web App on Azure with a Bicep file so that the process can to automated.
---

# Deploy Azure Static Web Apps with Bicep

Use a bicep file to create your Azure Static Web app to Azure. Bicep is a domain-specific language (DSL) that uses declarative syntax to define and create Azure resources define repeatedly in a consistent manner.

To deploy your app to Azure with Static Web Apps, you need to: 
* Create resources with Bicep
* Deploy your source code. Use one of the following tools to deploy your app:
    * [Azure Developer CLI](/azure/developer/azure-developer-cli)
    * [Static Web Apps CLI](https://github.com/Azure/static-web-apps-cli)
    * GitHub Action
 
## Bicep by example

The bicep examples in this article use [Azure Verified Modules (AVM)](https://azure.github.io/Azure-Verified-Modules/) when possible and [bicep](/azure/azure-resource-manager/bicep/) when AVM isn't available. You'll be able to recognize AVM because the referenced module includes `avm/res` such as `br/public:avm/res/web/static-site:0.3.0`.

```bicep
module swa 'br/public:avm/res/web/static-site:0.3.0' = {
  name: 'client'
  scope: rg
  params: {
    name: 'swa-${resourceToken}'
    location: location
    sku: 'Free'
    tags: union(tags, { 'service-name': 'client' })
  }
}
```

AVM allows you to adopt bicep code, which has been built and is maintained by professional engineers fluent in bicep. These modules aren't only supported and maintained, they're opinionated about what proper bicep files look like.

## Prerequisites

- [Bicep](../azure-resource-manager/bicep/install.md)
- Optional, [Visual Studio Code extension for Bicep](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). This extension is used to immediately run your bicep file, which creates your resources.

## Create a static web app resource

Create a `main.bicep` file with the bicep code below to:

* Create a unique string, `resourceToken`. 
* Create tags for the resources. Tags are filterable in the Azure portal. 
* Create a unique resource group.
* Create a Static web app.
    
```bicep
targetScope = 'subscription'

@description('The name of the Azure region that will be used for the deployment.')
param location string ='eastus2'

@description('Random string to make resource names unique')
var resourceToken = uniqueString(subscription().subscriptionId, location)

@description('Tags to be added to all resources')
var tags = { 'docs-bicep-example-swa': resourceToken }

@description('Create a resource group')
resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: 'rg-swa-app-${resourceToken}'
  location: location
  tags: tags
}

@description('Create a static web app')
module swa 'br/public:avm/res/web/static-site:0.3.0' = {
  name: 'client'
  scope: rg
  params: {
    name: 'swa-${resourceToken}'
    location: location
    sku: 'Free'
    tags: union(tags, { 'service-name': 'client' })
  }
}

@description('Put the default hostname in an output')
output endpoint string = swa.outputs.defaultHostname

@description('Save the static web app name in an output')
output staticWebAppName string = swa.outputs.name
```

Save the values of the output variables. You'll need these to configure the resources.

## Create a static web app with a linked backend function app

To create a static web app with a linked backend function app, you need to use a standard plan for your static web app and complete the following steps.

* [Create the Azure Function app](/azure/azure-functions/functions-create-first-function-bicep). You need the resourceId for the Function app, which looks like: `/subscriptions/<SUBSCRIPTION-ID>/resourcegroups/<RESOURCE-GROUP-NAME>/providers/Microsoft.Web/sites/<FUNCTION-APP-NAME>`.
* Create the static web app using the [bicep in the previous section](#create-a-static-web-app-resource).
* Link the static web app to the function app.

Create a `config.bicep` file to link the static web app to the function app. 

```bicep
targetScope = 'resourceGroup'

@description('The name of the Azure region that will be used for the deployment.')
param location string = 'eastus2'

@description('The Subscription ID')
param subscriptionId string = '<SUBSCRIPTION-ID>'

@description('The name of the Azure resource group.')
param resourceGroup string = '<RESOURCE-GROUP-NAME>'

@description('Azure Statoc web app name')
param staticWebAppName string = '<STATIC-WEB-APP-NAME>'

@description('Azure Function App name')
param functionAppName string = '<FUNCTION-APP-NAME>'

@description('Get reference to static web app')
resource staticWebApp 'Microsoft.Web/staticSites@2023-12-01' existing = {
  name: staticWebAppName
}

param functionAppResourceId string = '/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Web/sites/${functionAppName}'

@description('Link backend to static web app')
resource linkedStaticWebAppBackend 'Microsoft.Web/staticSites/linkedBackends@2023-12-01' = {
  parent: staticWebApp
  name: 'linkedBackend'
  properties: {
    backendResourceId: functionAppResourceId
    region: location
  }
}
```

## Deployment

After your resources are created, you'll want to deploy your application to the hosting environment. You may want to be able to deploy from both your local computer as you develop and GitHub Actions for your product workloads. 

* **Local development environment**: Local development environment deployments are completed with [Azure Developer CLI](/azure/developer/azure-developer-cli). This tool allows you to define your deployment in an `azure.yml` file. It includes hooks to plug into the resource creation process at any point to help with deploying full stack applications, which need to know about each other at build time.
* **Production environment**: The ability to deploy from a GitHub action workflow file is a built-in feature when you create your static web app. Once the file is in your repository, you can edit the file as needed. Deployment from [other source code providers](external-providers.md) is also supported.

Learn more from a full end-to-end application, which provides resource creation and application deployment: 

* [Serverless AI Chat with RAG using LangChain.js](https://github.com/Azure-Samples/serverless-chat-langchainjs)

## Related content

* [Awesome AZD](https://azure.github.io/awesome-azd/?tags=swa)

