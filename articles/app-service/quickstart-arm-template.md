---
title: 'Create an App Service app using an Azure Resource Manager template'
description: Create your first app to Azure App Service in seconds using an Azure Resource Manager template (ARM template), which is one of many ways to deploy to App Service.
author: msangapu-msft
ms.author: msangapu
ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
ms.topic: quickstart
ms.date: 02/06/2024
ms.custom: subject-armqs, mode-arm, devdivchpfy22, devx-track-arm-template
zone_pivot_groups: app-service-platform-windows-linux-windows-container
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./quickstart-arm-template-uiex
---

# Quickstart: Create App Service app using an ARM template

::: zone pivot="platform-windows"
Get started with [Azure App Service](overview.md) by deploying an app to the cloud using an Azure Resource Manager template (ARM template) and [Azure CLI](/cli/azure/get-started-with-azure-cli) in Cloud Shell. A Resource Manager template is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. You incur no costs to complete this quickstart because you use a free App Service tier.

To complete this quickstart, you'll need an Azure account with an active subscription. If you don't have an Azure account, you can [create one for free](https://azure.microsoft.com/free/).

## Skip to the end

If you're familiar with using ARM templates, you can skip to the end by selecting this :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.web%2Fapp-service-docs-windows%2Fazuredeploy.json"::: button. This button opens the ARM template in the Azure portal. 

:::image type="content" source="media/quickstart-arm/create-windows-code.png" alt-text="Screenshot of the ARM Template in the Azure portal.":::

In the Azure portal, select **Create new** to create a new Resource Group and then select the **Review + create** button to deploy the app.

::: zone-end
::: zone pivot="platform-linux"
Get started with [Azure App Service](overview.md) by deploying an app to the cloud using an Azure Resource Manager template (ARM template) and [Azure CLI](/cli/azure/get-started-with-azure-cli) in Cloud Shell. A Resource Manager template is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. You incur no costs to complete this quickstart because you use a free App Service tier.

To complete this quickstart, you'll need an Azure account with an active subscription. If you don't have an Azure account, you can [create one for free](https://azure.microsoft.com/free/).

## Skip to the end

If you're familiar with using ARM templates, you can skip to the end by selecting this :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.web%2Fapp-service-docs-linux%2Fazuredeploy.json"::: button. This button opens the ARM template in the Azure portal. 

:::image type="content" source="media/quickstart-arm/create-linux.png" alt-text="Screenshot of the ARM Template in the Azure portal.":::

In the Azure portal, select **Create new** to create a new Resource Group and then select the **Review + create** button to deploy the app.
::: zone-end
::: zone pivot="platform-windows-container"
Get started with [Azure App Service](overview.md) by deploying an app to the cloud using an Azure Resource Manager template (ARM template) and [Azure CLI](/cli/azure/get-started-with-azure-cli) in Cloud Shell. A Resource Manager template is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. A premium plan is needed to deploy a Windows container app. See the [App Service pricing page](https://azure.microsoft.com/pricing/details/app-service/windows/#pricing) for pricing details.

## Skip to the end

If you're familiar with using ARM templates, you can skip to the end by selecting this :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.web%2Fapp-service-docs-windows-container%2Fazuredeploy.json"::: button. This button opens the ARM template in the Azure portal. 

:::image type="content" source="media/quickstart-arm/create-windows-container.png" alt-text="Screenshot of the ARM Template in the Azure portal.":::

In the Azure portal, select **Create new** to create a new Resource Group and then select the **Review + create** button to deploy the app.
::: zone-end

## Review the template

::: zone pivot="platform-windows"
The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/app-service-docs-windows). It deploys an App Service plan and an App Service app on Windows. It's compatible with .NET Core, .NET Framework, PHP, Node.js, and Static HTML apps. For Java, see [Create Java app](./quickstart-java.md).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.web/app-service-docs-windows/azuredeploy.json":::

Two Azure resources are defined in the template:

* [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms): create an App Service plan.
* [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites): create an App Service app.

This template contains several parameters that are predefined for your convenience. See the table  for parameter defaults and their descriptions:

| Parameters | Type    | Default value                | Description |
|------------|---------|------------------------------|-------------|
| webAppName | string  | `webApp-<uniqueString>` | App name based on a [unique string value](../azure-resource-manager/templates/template-functions-string.md#uniquestring) |
| appServicePlanName | string  | `webAppPlan-<uniqueString>` | App Service Plan name based on a [unique string value](../azure-resource-manager/templates/template-functions-string.md#uniquestring) |
| location   | string  | `[resourceGroup().location]` | [App region](../azure-resource-manager/templates/template-functions-resource.md#resourcegroup) |
| sku        | string  | `F1`                         | Instance size (F1 = Free Tier) |
| language   | string  | `.NET`                       | Programming language stack (.NET, php, node, html) |
| helloWorld | boolean | `False`                        | True = Deploy "Hello World" app |
| repoUrl    | string  | ` `                          | External Git repo (optional) |
::: zone-end
::: zone pivot="platform-linux"
The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/app-service-docs-linux). It deploys an App Service plan and an App Service app on Linux. It's compatible with all supported programming languages on App Service.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.web/app-service-docs-linux/azuredeploy.json":::

Two Azure resources are defined in the template:

* [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms): create an App Service plan.
* [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites): create an App Service app.

This template contains several parameters that are predefined for your convenience. See the table  for parameter defaults and their descriptions:

| Parameters | Type    | Default value                | Description |
|------------|---------|------------------------------|-------------|
| webAppName | string  | `webApp-<uniqueString>` | App name based on a [unique string value](../azure-resource-manager/templates/template-functions-string.md#uniquestring) |
| appServicePlanName | string  | `webAppPlan-<uniqueString>` | App Service Plan name based on a [unique string value](../azure-resource-manager/templates/template-functions-string.md#uniquestring) |
| location   | string  | `[resourceGroup().location]` | [App region](../azure-resource-manager/templates/template-functions-resource.md#resourcegroup)
| sku        | string  | `F1`                         | Instance size (F1 = Free Tier) |
| linuxFxVersion   | string  | `DOTNETCORE|3.0`        | "Programming language stack &#124; Version" |
| repoUrl    | string  | ` `                          | External Git repo (optional) |

---
::: zone-end
::: zone pivot="platform-windows-container"
The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/app-service-docs-windows-container/). It deploys an App Service plan and an App Service app on a Windows container.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.web/app-service-docs-windows-container/azuredeploy.json":::

Two Azure resources are defined in the template:

* [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms): create an App Service plan.
* [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites): create an App Service app.

This template contains several parameters that are predefined for your convenience. See the table  for parameter defaults and their descriptions:

| Parameters | Type    | Default value                | Description |
|------------|---------|------------------------------|-------------|
| webAppName | string  | `webApp-<uniqueString>` | App name based on a [unique string value](../azure-resource-manager/templates/template-functions-string.md#uniquestring) |
| appServicePlanName | string  | `webAppPlan-<uniqueString>` | App Service Plan name based on a [unique string value](../azure-resource-manager/templates/template-functions-string.md#uniquestring) |
| location   | string  | `[resourceGroup().location]`| [App region](../azure-resource-manager/templates/template-functions-resource.md#resourcegroup) |
| skuTier        | string  | `P1v3`                         | Instance size ([View available SKUs](configure-custom-container.md?tabs=debian&pivots=container-windows#customize-container-memory)) |
| appSettings | string  | `[{"name": "PORT","value": "8080"}]`| App Service listening port. Needs to be 8080. |
| kind       | string  | `windows`                          | Operating System |
| hyperv     | string  | `true`                          | Isolation mode |
| windowsFxVersion | string  | `DOCKER|mcr.microsoft.com/dotnet/samples:aspnetapp`                          | Container image |



::: zone-end
## Deploy the template

Azure CLI is used here to deploy the template. You can also use the Azure portal, Azure PowerShell, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-powershell.md).

The following code creates a resource group, an App Service plan, and a web app. A default resource group, App Service plan, and location have been set for you. Replace `<app-name>` with a globally unique app name (valid characters are `a-z`, `0-9`, and `-`).

::: zone pivot="platform-windows"
Run the following commands to deploy a .NET framework app on Windows.

```azurecli-interactive
az group create --name myResourceGroup --location "southcentralus"

az deployment group create --resource-group myResourceGroup \
--parameters language=".NET" helloWorld="true" webAppName="<app-name>" \
--template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/app-service-docs-windows/azuredeploy.json"
::: zone-end
::: zone pivot="platform-linux"
Run the following commands to create a Python app on Linux:

```azurecli-interactive
az group create --name myResourceGroup --location "southcentralus"

az deployment group create --resource-group myResourceGroup --parameters webAppName="<app-name>" linuxFxVersion="PYTHON|3.9" \
--template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/app-service-docs-linux/azuredeploy.json"
```

To deploy a different language stack, update `linuxFxVersion` with appropriate values. Samples are shown in the table. To show current versions, run the following command in the Cloud Shell: `az webapp config show --resource-group myResourceGroup --name <app-name> --query linuxFxVersion`

| Language    | Example                                              |
|-------------|------------------------------------------------------|
| **.NET**    | linuxFxVersion="DOTNETCORE&#124;3.0"                 |
| **PHP**     | linuxFxVersion="PHP&#124;7.4"                        |
| **Node.js** | linuxFxVersion="NODE&#124;10.15"                     |
| **Java**    | linuxFxVersion="JAVA&#124;1.8 &#124;TOMCAT&#124;9.0" |
| **Python**  | linuxFxVersion="PYTHON&#124;3.7"                     |

---
::: zone-end
::: zone pivot="platform-windows-container"
Run the following commands to deploy a [.NET app](https://mcr.microsoft.com/product/dotnet/samples/tags) on a Windows container.

```azurecli-interactive
az group create --name myResourceGroup --location "southcentralus"

az deployment group create --resource-group myResourceGroup \
--parameters webAppName="<app-name>" \
--template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/app-service-docs-windows-container/azuredeploy.json"
::: zone-end

> [!NOTE]
> You can find more [Azure App Service template samples here](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Sites).

## Validate the deployment

Browse to `http://<app_name>.azurewebsites.net/` and verify it's been created.
::: zone pivot="platform-windows"
:::image type="content" source="media/quickstart-arm/validate-windows-code.png" alt-text="Screenshot of the Windows code experience.":::
::: zone-end
::: zone pivot="platform-linux"
:::image type="content" source="media/quickstart-arm/validate-linux.png" alt-text="Screenshot of the Linux experience.":::
::: zone-end
::: zone pivot="platform-windows-container"
:::image type="content" source="media/quickstart-arm/validate-windows-container.png" alt-text="Screenshot of the Windows container experience.":::
::: zone-end

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
