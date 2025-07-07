---
title: Create an App Service App by Using Bicep
description: Create your first Azure App Service app in seconds by using Bicep, which is one of many ways to deploy to App Service.
author: seligj95
ms.author: msangapu
ms.topic: quickstart
ms.custom: devx-track-bicep
ms.date: 05/01/2025
zone_pivot_groups: app-service-bicep
---

# Quickstart: Create an App Service app by using Bicep

In this quickstart, you get started with [Azure App Service](overview.md) by deploying an app to the cloud by using a [Bicep](../azure-resource-manager/bicep/index.yml) file and the [Azure CLI](/cli/azure/get-started-with-azure-cli) in Azure Cloud Shell. Because you use a free App Service tier, you incur no costs to complete this quickstart.

Bicep is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. It provides concise syntax, reliable type safety, and support for code reuse.

You can use Bicep instead of JSON to develop your [Azure Resource Manager templates (ARM templates)](../azure-resource-manager/templates/overview.md). The JSON syntax to create an ARM template can be verbose and require complicated expressions. Bicep syntax reduces that complexity and improves the development experience. Bicep is a transparent abstraction over ARM template JSON and doesn't lose any of the JSON template capabilities. During deployment, the Bicep CLI transpiles a Bicep file into ARM template JSON.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

To effectively create resources by using Bicep, you need to set up a Bicep [development environment](../azure-resource-manager/bicep/install.md). The Bicep extension for [Visual Studio Code](https://code.visualstudio.com/) provides language support and resource autocompletion. The extension helps you create and validate Bicep files. We recommend it for developers who will create resources by using Bicep after completing this quickstart.

## Review the template

::: zone pivot="app-service-bicep-linux"

This quickstart uses the following template. It deploys an App Service plan and an App Service app on Linux. It also deploys a sample Node.js *Hello World* app from the [Azure Samples](https://github.com/Azure-Samples) repo.

```bicep
param webAppName string = uniqueString(resourceGroup().id) // Generate a unique string for the web app name
param sku string = 'F1' // Tier of the App Service plan
param linuxFxVersion string = 'node|20-lts' // Runtime stack of the web app
param location string = resourceGroup().location // Location for all resources
param repositoryUrl string = 'https://github.com/Azure-Samples/nodejs-docs-hello-world'
param branch string = 'main'
var appServicePlanName = toLower('AppServicePlan-${webAppName}')
var webSiteName = toLower('wapp-${webAppName}')

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
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

resource appService 'Microsoft.Web/sites@2023-12-01' = {
  name: webSiteName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: linuxFxVersion
    }
  }
}

resource srcControls 'Microsoft.Web/sites/sourcecontrols@2023-12-01' = {
  parent: appService
  name: 'web'
  properties: {
    repoUrl: repositoryUrl
    branch: branch
    isManualIntegration: true
  }
}
```

The template defines three Azure resources:

* [Microsoft.Web/serverfarms](/azure/templates/microsoft.web/serverfarms): Create an App Service plan.
* [Microsoft.Web/sites](/azure/templates/microsoft.web/sites): Create an App Service app.
* [Microsoft.Web/sites/sourcecontrols](/azure/templates/microsoft.web/sites/sourcecontrols): Create an external Git deployment configuration.

The template contains the following parameters that are predefined for your convenience:

| Parameter | Type    | Default value                | Description |
|------------|---------|------------------------------|-------------|
| `webAppName` | string  | `webApp-<uniqueString>` | App name. For more information, see [String functions for ARM templates](../azure-resource-manager/templates/template-functions-string.md#uniquestring). |
| `location`   | string  | `resourceGroup().location` | App region. For more information, see [Resource functions for ARM templates](../azure-resource-manager/templates/template-functions-resource.md#resourcegroup). |
| `sku`        | string  | `F1`                         | Instance size.  |
| `linuxFxVersion`   | string  | `NODE`&#124;`20-LTS`       | Programming language stack and version. |
| `repositoryUrl`    | string  | `https://github.com/Azure-Samples/nodejs-docs-hello-world`    | External Git repo (optional). |
| `branch`    | string  | `master`    | Default branch for the code sample. |

---

## Deploy the template

Copy and paste the template into a blank file in your preferred editor or IDE. Then save the file to your local working directory. Use the *.bicep* file extension.

Here, you use the Azure CLI to deploy the template. You can also use the Azure portal, Azure PowerShell, or the REST API. To learn about other deployment methods, see [Deploy Bicep files with the Azure CLI](../azure-resource-manager/bicep/deploy-cli.md).

The following code creates a resource group, an App Service plan, and a web app. A default resource group, App Service plan, and location are set for you. Replace `<app-name>` with a globally unique app name. Valid characters are `a-z`, `0-9`, and a hyphen (`-`).

Open a terminal where the Azure CLI is installed. Run this code to create a Node.js app on Linux:

```azurecli-interactive
az group create --name myResourceGroup --location "southcentralus" &&
az deployment group create --resource-group myResourceGroup --template-file <path-to-template>
```

To deploy a different language stack, update `linuxFxVersion` with appropriate values. The following table lists examples. To show current versions, run the following command in Cloud Shell: `az webapp config show --resource-group myResourceGroup --name <app-name> --query linuxFxVersion`.

| Language    | Example                                              |
|-------------|------------------------------------------------------|
| .NET    | `linuxFxVersion="DOTNETCORE&#124;3.0"`                 |
| PHP     | `linuxFxVersion="PHP&#124;7.4"`                        |
| Node.js | `linuxFxVersion="NODE&#124;10.15"`                     |
| Java    | `linuxFxVersion="JAVA&#124;1.8 &#124;TOMCAT&#124;9.0"` |
| Python  | `linuxFxVersion="PYTHON&#124;3.8"`                     |

---

::: zone-end  

::: zone pivot="app-service-bicep-windows-container"

This quickstart uses the following template. It deploys an App Service plan and an App Service app on Windows. It also deploys a sample .NET *Hello World* app from the [Azure Samples](https://github.com/Azure-Samples) repo.

```bicep
param webAppName string = uniqueString(resourceGroup().id) // Generate a unique name for the web app
param location string = resourceGroup().location // Location for all resources
param sku string = 'P1V3' // Tier of the App Service plan
param dockerContainerImage string = 'mcr.microsoft.com/dotnet/framework/samples:aspnetapp' // Sample .NET app
var appServicePlanName = toLower('ASP-${webAppName}') // Generate a unique name for the App Service plan

resource appServicePlan 'Microsoft.Web/serverfarms@2021-02-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: sku
  }
  properties: {
    hyperV: true
  }
}

resource webApp 'Microsoft.Web/sites@2024-04-01' = {
  name: webAppName
  location: location
  kind:'app,container,windows'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      windowsFxVersion: 'DOCKER|${dockerContainerImage}'
      appCommandLine: ''
      alwaysOn: true
      minTlsVersion: '1.3'
    }
    httpsOnly: true
  }
}
```

The template defines two Azure resources:

* [Microsoft.Web/serverfarms](/azure/templates/microsoft.web/serverfarms): Create an App Service plan.
* [Microsoft.Web/sites](/azure/templates/microsoft.web/sites): Create an App Service app.

The template contains the following parameters that are predefined for your convenience:

| Parameter | Type    | Default value                | Description |
|------------|---------|------------------------------|-------------|
| `webAppName` | string  | `webApp-<uniqueString>` | App name. For more information, see [String functions for ARM templates](../azure-resource-manager/templates/template-functions-string.md#uniquestring). |
| `location`   | string  | `resourceGroup().location` | App region. For more information, see [Resource functions for ARM templates](../azure-resource-manager/templates/template-functions-resource.md#resourcegroup). |
| `sku`        | string  | `P1V3`                         | Instance size |
| `appServicePlanName`        | string  | `toLower('ASP-${webAppName}')`              | App Service plan name |
| `dockerContainerImage`    | string  | `mcr.microsoft.com/dotnet/framework/samples:aspnetapp`    | Container image sample |

---

## Deploy the template

Copy and paste the template to your preferred editor or IDE. Then save the file to your local working directory. Use the *.bicep* file extension.

Here, you use the Azure CLI to deploy the template. You can also use the Azure portal, Azure PowerShell, or the REST API. To learn about other deployment methods, see [Deploy Bicep files with the Azure CLI](../azure-resource-manager/bicep/deploy-cli.md).

The following code creates a resource group, an App Service plan, and a web app. A default resource group, App Service plan, and location are set for you. Replace `<app-name>` with a globally unique app name. Valid characters are `a-z`, `0-9`, and a hyphen (`-`).

Open a terminal where the Azure CLI is installed. Run this code to create a .NET app:

```azurecli-interactive
az group create --name myResourceGroup --location "southcentralus" &&
az deployment group create --resource-group myResourceGroup --template-file <path-to-template>
```

::: zone-end

## Validate the deployment

Browse to your app's URL and verify that you created the app.

## Clean up resources

When you no longer need the resources that you created for this quickstart, [delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group).

## Related content

* [Bicep documentation](../azure-resource-manager/bicep/index.yml)
* [Bicep files for Azure App Service](./samples-bicep.md)
