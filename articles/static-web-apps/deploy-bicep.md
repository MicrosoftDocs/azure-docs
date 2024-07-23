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

# Use Bicep to provision an Azure Static Web Apps resource

Use a bicep file to create your Azure Static Web app to Azure. Bicep is a domain-specific language (DSL) that uses declarative syntax to define and create Azure resources define repeatedly in a consistent manner.

To provision resources, then deploy your source code, use [Azure Developer CLI](/azure/developer/azure-developer-cli). 
 
## Prerequisites

- [Bicep](../azure-resource-manager/bicep/install.md)
- Optional, [Visual Studio Code extension for Bicep](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). This extension is used to immediately run your bicep file.

## Create a static web app resource

Use a bicep file to create your static web app resource.

1. Create a `main.bicep` file and copy the following into the file. 
    
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

[!INCLUDE [Provision with Visual Studio Code](./includes/deploy-bicep-visual-studio-code.md)]

## Create a static web resource with a managed function

1. Select a Azure Functions bicep file from the [templates](https://github.com/Azure-Samples/function-app-arm-templates).
1. You need the Azure Function resource name to use in the next step.
1. Create a `main.bicep` file and copy the following into the file.

## Related content

* [Awesome AZD](https://azure.github.io/awesome-azd/?tags=swa)
