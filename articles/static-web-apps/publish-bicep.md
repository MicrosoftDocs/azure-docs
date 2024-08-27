---
title: 'Deploy Azure Static Web Apps with Bicep'
description: Deploy Azure Static Web Apps using Bicep including resource creation and configuration. Link your own Azure Functions app to support your static web app.
services: static-web-apps
author: craigshoemaker
ms.service: azure-static-web-apps
ms.topic: how-to
ms.date: 08/13/2024
ms.author: cshoe
#customer intent: As a developer, I want create a Static Web App on Azure with a Bicep file so that the process can to automated.
---

# Deploy Azure Static Web Apps with Bicep

Use a Bicep file to create your Azure Static Web app to Azure. Bicep provides a declarative syntax to define and create Azure resources repeatedly in a consistent manner, which can be automated and repeated.

Your creation process should include all the resources in your application. This article details how to create the resource group that holds all the resources for your application, the Azure Static Web Apps resource, which contains your statically generated client application such as React, Vue, or Svelte, and the linked Azure Functions backend.

## Types of resource creation

 Bicep is one of several types of resource creation. These types include:

* [Azure Resource Management](/azure/azure-resource-manager/) (ARM): implement infrastructure as code for your Azure solutions, use Azure Resource Manager templates (ARM templates). The template is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. This older style is still in use but updated to Bicep or Azure Verified Modules. 
* [Bicep](/azure/azure-resource-manager/Bicep/): Bicep is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. In a Bicep file, you define the infrastructure you want to deploy to Azure, and then use that file throughout the development lifecycle to repeatedly deploy your infrastructure. Your resources are deployed in a consistent manner.
* [Azure verified modules (AVM)](https://azure.github.io/Azure-Verified-Modules): These modules represent the only standard from Microsoft for Bicep modules in the [Bicep Public Registry](https://github.com/Azure/bicep-registry-modules/tree/main/avm). Use AVM when possible because it consolidates and set the standards for what a good Infrastructure-as-Code module looks like.
* [Azure CLI](/cli/azure/)/[PowerShell](/powershell): These command line apps allow you to create resources. They have generally been superseded by Bicep and AVM but are still used for minor or quick fixes while the larger Bicep update may be more time-consuming. Learn to [create resources with the Azure CLI and a Bicep file](/azure/azure-resource-manager/bicep/deploy-cli#deploy-local-bicep-file). 
* [Azure portal](https://portal.azure.com/): Azure portal is a web-based visual interface for resource creation and configuration.

Creation and configuration can be done across all the tools listed above.  

## Bicep by example

The bicep examples in this article use [Azure Verified Modules (AVM)](https://azure.github.io/Azure-Verified-Modules/) when possible and [bicep](/azure/azure-resource-manager/bicep/) when AVM isn't available. AVM modules are recognizable because they reference modules that include `avm/res`, such as `br/public:avm/res/web/static-site:0.3.0`.

```Bicep
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

AVM allows you to use managed Bicep code, which has been built and is maintained by professional engineers fluent in Bicep. These modules aren't only supported and maintained, they're opinionated about what proper Bicep files look like.

Due to the work involved in owning and maintaining the AVM files, it takes time to specify the module, determine best practices, and find the appropriate owner/maintainer. For this reason, the module you need may not be available at this time. 

## Prerequisites

- [Bicep tools](../azure-resource-manager/Bicep/install.md)
- [Visual Studio Code extension for Bicep](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep): An optional extension that creates resources for you by running your Bicep file.

## Create a static web app resource

Create a file named `main.bicep` file and paste in the following code:

```Bicep
targetScope = 'subscription'

@description('The name of the Azure region that will be used for the deployment.')
param location string ='eastus2'

@description('Random string to make resource names unique')
var resourceToken = uniqueString(subscription().subscriptionId, location)

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
  }
}

@description('Put the default hostname in an output')
output endpoint string = swa.outputs.defaultHostname

@description('Save the static web app name in an output')
output staticWebAppName string = swa.outputs.name
```

This file creates the following resources for you:
* An application name as the `resourceToken` value
* Tags associated with your app to help you find and filter resources in the Azure portal
* A resource group for this application
* A static web app

Save the values of the output variables to a text editor. You'll need these to configure the resources. The next step is to include a linked backend Azure Functions app in the next section.

## Link a Functions app

To link a Functions app for your backend, use the Static Web Apps standard plan for your web app and complete the following steps.

To create the Azure Function app, follow the instructions provided in the Create the Azure Function app guide. You'll need the resourceId for the Function app, which looks like: /subscriptions/<SUBSCRIPTION-ID>/resourcegroups/<RESOURCE-GROUP-NAME>/providers/Microsoft.Web/sites/<FUNCTION-APP-NAME>.

Next, create the static web app using the Bicep template provided in the previous section. This sets up the necessary resources for your static web app. Finally, link the static web app to the function app to enable seamless integration between your front-end and back-end services.

Create a file named `config.bicep` file and paste in the following code: 

```Bicep
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

This file handles the following tasks:

* Creates variables to use in resource configuration.
* Create a reference to the existing static web app.
* Create a reference string for the existing functions app.
* Configure the static web app to link to the functions app.

## Deployment

Deploy your source code with one of the following tools to deploy your app:
    * [Azure Developer CLI (Recommended)](/azure/developer/azure-developer-cli)
    * [Static Web Apps CLI](https://github.com/Azure/static-web-apps-cli)
    * [GitHub Action](https://docs.github.com/actions)
    * [Azure DevOps](/azure/devops/pipelines/overview-azure)

* **Local development environment**: Use [Azure Developer CLI](/azure/developer/azure-developer-cli) to deploy from your local machine. When running locally, you define your deployment in an `azure.yml` file. This file includes hooks that plug into the resource creation process at any point to help you during deployment, especially when different parts of your app need to know about each other at build time.

* **Production environment**: The ability to deploy from a GitHub Actions workflow file is a built-in feature when you create your static web app. Once the file is in your repository, you can edit the file as needed. Deployment from [other source code providers](external-providers.md) is also supported.

To learn more from a full end-to-end application that includes resource creation and application deployment, see [Serverless AI Chat with RAG using LangChain.js](https://github.com/Azure-Samples/serverless-chat-langchainjs).

## Speeding up deployments with Azure Developer CLI

Azure Developer CLI (`azd`) uses Bicep files along with deployment configurations to create and provision your application. Since version 1.4, azd checks the Bicep against cloud resources to understand if the underlying infrastructure as code (IaC) state requires updates. If the state hasn't changed, creation and configuration is skipped. Learn more about this [performance improvement](
https://devblogs.microsoft.com/azure-sdk/azure-developer-cli-azd-october-2023-release/#azd-provision-is-now-faster-when-there-are-no-infrastructure-changes
).

## Azure samples 

The following samples create and deploy Azure Static Web apps with Azure Developer CLI:

* 

## Related content

* [Awesome AZD](https://azure.github.io/awesome-azd/?tags=swa)
* [Public Bicep Registry](https://github.com/Azure/bicep-registry-modules)
* [Azure Developer CLI](/azure/developer/azure-developer-cli)
* [Static Web Apps CLI](https://github.com/Azure/static-web-apps-cli)
* [GitHub Actions](https://docs.github.com/actions)
 