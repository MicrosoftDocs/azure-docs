---
title: 'Create an App Service app using an Azure Resource Manager template'
description: Create your first app to Azure App Service in seconds using an Azure Resource Manager template (ARM template), which is one of many ways to deploy to App Service.
author: msangapu-msft
ms.author: msangapu
ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
ms.topic: quickstart
ms.date: 03/10/2022
ms.custom: subject-armqs, mode-arm, devdivchpfy22, devx-track-arm-template
zone_pivot_groups: app-service-platform-windows-linux
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./quickstart-arm-template-uiex
---

# Quickstart: Create App Service app using an ARM template

Get started with [Azure App Service](overview.md) by deploying an app to the cloud using an Azure Resource Manager template (ARM template) and [Azure CLI](/cli/azure/get-started-with-azure-cli) in Cloud Shell. Because you use a free App Service tier, you incur no costs to complete this quickstart.

 [!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

Use the following button to deploy on **Linux**:

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.web%2Fapp-service-docs-linux%2Fazuredeploy.json)

Use the following button to deploy on **Windows**:

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.web%2Fapp-service-docs-windows%2Fazuredeploy.json)

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Review the template

::: zone pivot="platform-windows"
The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/app-service-docs-windows). It deploys an App Service plan and an App Service app on Windows. It's compatible with .NET Core, .NET Framework, PHP, Node.js, and Static HTML apps. For Java, see [Create Java app](./quickstart-java.md).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.web/app-service-docs-windows/azuredeploy.json":::

Two Azure resources are defined in the template:

* [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms): create an App Service plan.
* [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites): create an App Service app.

This template contains several parameters that are predefined for your convenience. See the table below for parameter defaults and their descriptions:

| Parameters | Type    | Default value                | Description |
|------------|---------|------------------------------|-------------|
| webAppName | string  | "webApp-**[`<uniqueString>`](../azure-resource-manager/templates/template-functions-string.md#uniquestring)**" | App name |
| location   | string  | "[[resourceGroup().location](../azure-resource-manager/templates/template-functions-resource.md#resourcegroup)]" | App region |
| sku        | string  | "F1"                         | Instance size (F1 = Free Tier) |
| language   | string  | ".net"                       | Programming language stack (.NET, php, node, html) |
| helloWorld | boolean | False                        | True = Deploy "Hello World" app |
| repoUrl    | string  | " "                          | External Git repo (optional) |
::: zone-end
::: zone pivot="platform-linux"
The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/app-service-docs-linux). It deploys an App Service plan and an App Service app on Linux. It's compatible with all supported programming languages on App Service.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.web/app-service-docs-linux/azuredeploy.json":::

Two Azure resources are defined in the template:

* [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms): create an App Service plan.
* [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites): create an App Service app.

This template contains several parameters that are predefined for your convenience. See the table below for parameter defaults and their descriptions:

| Parameters | Type    | Default value                | Description |
|------------|---------|------------------------------|-------------|
| webAppName | string  | "webApp-**[`<uniqueString>`](../azure-resource-manager/templates/template-functions-string.md#uniquestring)**" | App name |
| location   | string  | "[[resourceGroup().location](../azure-resource-manager/templates/template-functions-resource.md#resourcegroup)]" | App region |
| sku        | string  | "F1"                         | Instance size (F1 = Free Tier) |
| linuxFxVersion   | string  | "DOTNETCORE&#124;3.0        | "Programming language stack &#124; Version" |
| repoUrl    | string  | " "                          | External Git repo (optional) |

---
::: zone-end

## Deploy the template

Azure CLI is used here to deploy the template. You can also use the Azure portal, Azure PowerShell, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-powershell.md).

The following code creates a resource group, an App Service plan, and a web app. A default resource group, App Service plan, and location have been set for you. Replace `<app-name>` with a globally unique app name (valid characters are `a-z`, `0-9`, and `-`).

::: zone pivot="platform-windows"
Run the code below to deploy a .NET framework app on Windows.

```azurecli-interactive
az group create --name myResourceGroup --location "southcentralus" &&
az deployment group create --resource-group myResourceGroup \
--parameters language=".net" helloWorld="true" webAppName="<app-name>" \
--template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/app-service-docs-windows/azuredeploy.json"
::: zone-end
::: zone pivot="platform-linux"
Run the code below to create a Python app on Linux.

```azurecli-interactive
az group create --name myResourceGroup --location "southcentralus" &&
az deployment group create --resource-group myResourceGroup --parameters webAppName="<app-name>" linuxFxVersion="PYTHON|3.7" \
--template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/app-service-docs-linux/azuredeploy.json"
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
::: zone-end

> [!NOTE]
> You can find more [Azure App Service template samples here](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Sites).

## Validate the deployment

Browse to `http://<app_name>.azurewebsites.net/` and verify it's been created.

## Clean up resources

When no longer needed, [delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group).

## Next steps

> [!div class="nextstepaction"]
> [Deploy from local Git](deploy-local-git.md)

> [!div class="nextstepaction"]
> [ASP.NET Core with SQL Database](tutorial-dotnetcore-sqldb-app.md)

> [!div class="nextstepaction"]
> [Python with Postgres](tutorial-python-postgresql-app.md)

> [!div class="nextstepaction"]
> [PHP with MySQL](tutorial-php-mysql-app.md)

> [!div class="nextstepaction"]
> [Connect to Azure SQL database with Java](/azure/azure-sql/database/connect-query-java?toc=%2fazure%2fjava%2ftoc.json)

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)
