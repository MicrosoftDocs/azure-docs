---
title: ''
description: 
services: static-web-apps
ms.custom: 
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 07/22/2024
ms.author: cshoe
#customer intent: As a developer, I want create a Static Web App on Azure with a Bicep file so that the process can to automated.
---

# Use Bicep to create an Azure Static Web Apps resource

Use a bicep file to create your Azure Static Web app to Azure. Bicep is a domain-specific language (DSL) that uses declarative syntax to define and create Azure resources define repeatedly in a consistent manner.

To deploy your app to Azure with Static Web Apps, you need to: 
* Create resources with Bicep
* Deploy your your app. Use one of the following tools to deploy your app:
    * [Azure Developer CLI](/azure/developer/azure-developer-cli)
    * [Static Web Apps CLI](https://github.com/Azure/static-web-apps-cli)
    * GitHub Action
 
## Prerequisites

- [Bicep](../azure-resource-manager/bicep/install.md)
- Optional, [Visual Studio Code extension for Bicep](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). This extension is used to immediately to run your bicep file which creates your resources.

## Create a static web app resource

Create a `main.bicep` file to create your static web app resource.
    
```bicep
metadata description = 'Creates an Azure Static Web Apps instance.'

// resource name prefix
param name string ='my-static-web-app'

// resource location
// or use `resourceGroup().location` to inherit the resource 
param location string = 'westus2' 

// create a service name with a random number
var serviceName = '${name}-${uniqueString(resourceGroup().id)}'

// Pricing tier
param sku object = {
  name: 'Free'
  tier: 'Free'
}

// Tags 
param tags object = {
  app: 'sales-portal'
  product: 'contoso-outdoor'
}

// Custom provider example
param properties object = {
  provider: 'Custom'
  branch: 'main'
  repositoryUrl: 'https://github.com/diberry/static-web-app-vite-react-typescript'
}

// Provision the Azure Static Web Apps instance
resource web 'Microsoft.Web/staticSites@2023-12-01' = {
  name: serviceName
  location: location
  tags: tags
  sku: sku
  properties: properties
}

output name string = web.name
output uri string = 'https://${web.properties.defaultHostname}'
```

## Create a static web resource with a linked backend function app

Create a `main.bicep` file which creates a static web app and [links to an existing Azure Functions app](functions-bring-your-own#link-an-existing-azure-functions-app). 

```bicep
metadata description = 'Creates an Azure Static Web Apps instance.'

// resource name prefix
param name string ='my-static-web-app'

// resource location
// or use `resourceGroup().location` to inherit the resource 
param location string = 'westus2' 

// create a service name with a random number
var serviceName = '${name}-${uniqueString(resourceGroup().id)}'

// Pricing tier
param sku object = {
  name: 'Free'
  tier: 'Free'
}

// Tags 
param tags object = {
  app: 'sales-portal'
  product: 'contoso-outdoor'
}

// Custom provider example
param properties object = {
  provider: 'Custom'
  branch: 'main'
  repositoryUrl: 'https://github.com/diberry/static-web-app-vite-react-typescript'
}

// Provision the Azure Static Web Apps instance
resource web 'Microsoft.Web/staticSites@2023-12-01' = {
  name: serviceName
  location: location
  tags: tags
  sku: sku
  properties: properties
}

output name string = web.name
output uri string = 'https://${web.properties.defaultHostname}'

// Linked Azure Function
param backendResourceId string
param backendLocation string

resource linkedStaticWebAppBackend 'Microsoft.Web/staticSites/linkedBackends@2023-12-01' = {
  parent: staticWebApp
  name: 'linkedBackend'
  properties: {
    backendResourceId: backendResourceId
    region: backendLocation
  }
}
```
Learn more from a full end-to-end application which provides resource creation and application deployment: 

* [Serverless AI Chat with RAG using LangChain.js](https://github.com/Azure-Samples/serverless-chat-langchainjs)

## Related content

* [Awesome AZD](https://azure.github.io/awesome-azd/?tags=swa)

