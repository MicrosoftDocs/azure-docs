---
title: 'Create an App Service app using Azure Bicep'
description: Create your first app to Azure App Service in seconds using Azure Bicep, which is one of many ways to deploy to App Service.
author: seligj95
ms.author: msangapu
ms.topic: article
ms.custom: devx-track-bicep
ms.date: 11/18/2022
---

# Create App Service app using Bicep

Get started with [Azure App Service](overview.md) by deploying an app to the cloud using a [Bicep](../azure-resource-manager/bicep/index.yml) file and [Azure CLI](/cli/azure/get-started-with-azure-cli) in Cloud Shell. Because you use a free App Service tier, you incur no costs to complete this quickstart.

Bicep is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. It provides concise syntax, reliable type safety, and support for code reuse. You can use Bicep instead of JSON to develop your Azure Resource Manager templates ([ARM templates](../azure-resource-manager/templates/overview.md)). The JSON syntax to create an ARM template can be verbose and require complicated expressions. Bicep syntax reduces that complexity and improves the development experience. Bicep is a transparent abstraction over ARM template JSON and doesn't lose any of the JSON template capabilities. During deployment, Bicep CLI transpiles a Bicep file into ARM template JSON.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

To effectively create resources with Bicep, you'll need to set up a Bicep [development environment](../azure-resource-manager/bicep/install.md). The Bicep extension for [Visual Studio Code](https://code.visualstudio.com/) provides language support and resource autocompletion. The extension helps you create and validate Bicep files and is recommended for those developers that will create resources using Bicep after completing this quickstart.

## Review the template

The template used in this quickstart is shown below. It deploys an App Service plan and an App Service app on Linux and a sample Node.js "Hello World" app from the [Azure Samples](https://github.com/Azure-Samples) repo.

```bicep
param webAppName string = uniqueString(resourceGroup().id) // Generate unique String for web app name
param sku string = 'F1' // The SKU of App Service Plan
param linuxFxVersion string = 'node|14-lts' // The runtime stack of web app
param location string = resourceGroup().location // Location for all resources
param repositoryUrl string = 'https://github.com/Azure-Samples/nodejs-docs-hello-world'
param branch string = 'main'
var appServicePlanName = toLower('AppServicePlan-${webAppName}')
var webSiteName = toLower('wapp-${webAppName}')

resource appServicePlan 'Microsoft.Web/serverfarms@2020-06-01' = {
  name: appServicePlanName
  location: location
  properties: {
    reserved: true
  }
  sku: {
    name: sku
  }
  kind: 'linux'
}

resource appService 'Microsoft.Web/sites@2020-06-01' = {
  name: webSiteName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: linuxFxVersion
    }
  }
}

resource srcControls 'Microsoft.Web/sites/sourcecontrols@2021-01-01' = {
  name: '${appService.name}/web'
  properties: {
    repoUrl: repositoryUrl
    branch: branch
    isManualIntegration: true
  }
}
```

Three Azure resources are defined in the template:

* [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms): create an App Service plan.
* [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites): create an App Service app.
* [**Microsoft.Web/sites/sourcecontrols**](/azure/templates/microsoft.web/sites/sourcecontrols): create an external git deployment configuration.

This template contains several parameters that are predefined for your convenience. See the table below for parameter defaults and their descriptions:

| Parameters | Type    | Default value                | Description |
|------------|---------|------------------------------|-------------|
| webAppName | string  | "webApp-**[`<uniqueString>`](../azure-resource-manager/templates/template-functions-string.md#uniquestring)**" | App name |
| location   | string  | "[[resourceGroup().location](../azure-resource-manager/templates/template-functions-resource.md#resourcegroup)]" | App region |
| sku        | string  | "F1"                         | Instance size  |
| linuxFxVersion   | string  | "NODE&#124;14-LTS"       | "Programming language stack &#124; Version" |
| repositoryUrl    | string  | "https://github.com/Azure-Samples/nodejs-docs-hello-world"    | External Git repo (optional) |
| branch    | string  | "master"    | Default branch for code sample |

---

## Deploy the template

Copy and paste the template to your preferred editor/IDE and save the file to your local working directory.

Azure CLI is used here to deploy the template. You can also use the Azure portal, Azure PowerShell, and REST API. To learn other deployment methods, see [Bicep Deployment Commands](../azure-resource-manager/bicep/deploy-cli.md).

The following code creates a resource group, an App Service plan, and a web app. A default resource group, App Service plan, and location have been set for you. Replace `<app-name>` with a globally unique app name (valid characters are `a-z`, `0-9`, and `-`).

Open up a terminal where the Azure CLI is installed and run the code below to create a Node.js app on Linux.

```azurecli-interactive
az group create --name myResourceGroup --location "southcentralus" &&
az deployment group create --resource-group myResourceGroup --template-file <path-to-template>
```

To deploy a different language stack, update `linuxFxVersion` with appropriate values. Samples are shown below. To show current versions, run the following command in the Cloud Shell: `az webapp config show --resource-group myResourceGroup --name <app-name> --query linuxFxVersion`

| Language    | Example                                              |
|-------------|------------------------------------------------------|
| **.NET**    | linuxFxVersion="DOTNETCORE&#124;3.0"                 |
| **PHP**     | linuxFxVersion="PHP&#124;7.4"                        |
| **Node.js** | linuxFxVersion="NODE&#124;10.15"                     |
| **Java**    | linuxFxVersion="JAVA&#124;1.8 &#124;TOMCAT&#124;9.0" |
| **Python**  | linuxFxVersion="PYTHON&#124;3.7"                     |
| **Ruby**    | linuxFxVersion="RUBY&#124;2.6"                       |

---

## Validate the deployment

Browse to `http://<app_name>.azurewebsites.net/` and verify it's been created.

## Clean up resources

When no longer needed, [delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group).

## Next steps

> [!div class="nextstepaction"]
> [Bicep documentation](../azure-resource-manager/bicep/index.yml)
> [!div class="nextstepaction"]
> [Bicep samples for Azure App Service](./samples-bicep.md)
