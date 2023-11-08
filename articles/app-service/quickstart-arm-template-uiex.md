---
title: 'Create an App Service app using an Azure Resource Manager template'
description: Create your first app to Azure App Service in seconds using an Azure Resource Manager template (ARM template), which is one of many ways to deploy to App Service.
author: msangapu-msft
ms.author: msangapu
ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
ms.topic: quickstart
ms.date: 10/16/2020
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
zone_pivot_groups: app-service-platform-windows-linux
ROBOTS: NOINDEX,NOFOLLOW
---

# Quickstart: Create App Service app using an ARM template

Get started with [Azure App Service](overview.md) by deploying a app to the cloud using an ARM template (A JSON file that declaratively defines one or more Azure resources and dependencies between the deployed resources. The template can be used to deploy the resources consistently and repeatedly.) and [Azure CLI](/cli/azure/get-started-with-azure-cli) in Cloud Shell. Because you use a free App Service tier, you incur no costs to complete this quickstart. The template uses declarative syntax. (In declarative syntax, you describe your intended deployment without writing the sequence of programming commands to create the deployment.)

 If your environment meets the prerequisites and you're familiar with using [ARM templates](../azure-resource-manager/templates/overview.md), select the **Deploy to Azure** button. The template will open in the Azure portal.

::: zone pivot="platform-windows"
[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.web%2Fapp-service-docs-windows%2Fazuredeploy.json)
::: zone-end

::: zone pivot="platform-linux"
[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.web%2Fapp-service-docs-linux%2Fazuredeploy.json)
::: zone-end

<hr/>

## 1. Prepare your environment

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

<hr/>

## 2. Review the template

::: zone pivot="platform-windows"
The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/app-service-docs-windows). It deploys an App Service plan and an App Service app on Windows.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.web/app-service-docs-windows/azuredeploy.json":::

<details>
<summary>What resources and parameters are defined in the template?</summary>

Two Azure resources are defined in the template:

* [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms): create an App Service plan.
* [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites): create an App Service app.

The following table details defaults parameters and their descriptions:

| Parameters | Type    | Default value                | Description |
|------------|---------|------------------------------|-------------|
| webAppName | string  | "webApp-**[`<uniqueString>`](../azure-resource-manager/templates/template-functions-string.md#uniquestring)**" | App name |
| location   | string  | "[[resourceGroup().location](../azure-resource-manager/templates/template-functions-resource.md#resourcegroup)]" | App region |
| sku        | string  | "F1"                         | Instance size (F1 = Free Tier) |
| language   | string  | ".net"                       | Programming language stack (.net, php, node, html) |
| helloWorld | boolean | False                        | True = Deploy "Hello World" app |
| repoUrl    | string  | " "                          | External Git repo (optional) |

---

</details>
::: zone-end
::: zone pivot="platform-linux"
The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/app-service-docs-linux). It deploys an App Service plan and an App Service app on Windows.

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.web/app-service-docs-linux/azuredeploy.json":::

This template includes Azure resources and parameters that are defined for your convenience.

<details>
<summary>What resources and parameters are defined in the template?</summary>

Two Azure resources are defined in the template:

* [**Microsoft.Web/serverfarms**](/azure/templates/microsoft.web/serverfarms): create an App Service plan.
* [**Microsoft.Web/sites**](/azure/templates/microsoft.web/sites): create an App Service app.

The following table details defaults parameters and their descriptions:

| Parameters | Type    | Default value                | Description |
|------------|---------|------------------------------|-------------|
| webAppName | string  | "webApp-**[`<uniqueString>`](../azure-resource-manager/templates/template-functions-string.md#uniquestring)**" | App name |
| location   | string  | "[[resourceGroup().location](../azure-resource-manager/templates/template-functions-resource.md#resourcegroup)]" | App region |
| sku        | string  | "F1"                         | Instance size (F1 = Free Tier) |
| linuxFxVersion   | string  | "DOTNETCORE&#124;3.0        | "Programming language stack &#124; Version" |
| repoUrl    | string  | " "                          | External Git repo (optional) |

---

</details>

::: zone-end

<hr/>

## 3. Deploy the template

::: zone pivot="platform-windows"
Run the code below to deploy a .NET framework app on Windows using Azure CLI. 

Replace \<app-name> (Valid characters characters are `a-z`, `0-9`, and `-`.) with a globally unique app name. To learn other deployment methods (You can also use the Azure portal, Azure PowerShell, and REST API.), see [Deploy templates](../azure-resource-manager/templates/deploy-powershell.md). You can find more [Azure App Service template samples here](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Sites).

```azurecli-interactive
az group create --name myResourceGroup --location "southcentralus" &&
az deployment group create --resource-group myResourceGroup \
--parameters language=".net" helloWorld="true" webAppName="<app-name>" \
--template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/app-service-docs-windows/azuredeploy.json"
```
::: zone-end
::: zone pivot="platform-linux"
Run the code below to create a Python app on Linux. 

Replace \<app-name\> with a globally unique app name. Valid characters characters are `a-z`, `0-9`, and `-`.

```azurecli-interactive
az group create --name myResourceGroup --location "southcentralus" &&
az deployment group create --resource-group myResourceGroup --parameters webAppName="<app-name>" linuxFxVersion="PYTHON|3.7" \
--template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/app-service-docs-linux/azuredeploy.json"
```
::: zone-end

<details>
<summary>What's the code doing?</summary>
<p>The commands do the following actions:</p>
<ul>
<li>Create a default resource group (A logical container for related Azure resources that you can manage as a unit.).</li>
<li>Create a default App Service plan (The plan that specifies the location, size, and features of the web server farm that hosts your app.).</li>
<li><a href="/cli/azure/webapp#az-webapp-create">Create an App Service app (The representation of your web app, which contains your app code, DNS hostnames, certificates, and related resources.)</a> with the specified name.</li>
</ul>
</details>

::: zone pivot="platform-windows"
<details>
<summary>How do I deploy a different language stack?</summary>
To deploy a different language stack, update language parameter (This template is compatible with .NET Core, .NET Framework, PHP, Node.js, and Static HTML apps.) with appropriate values. For Java, see <a href="/azure/app-service/quickstart-java-uiex">Create Java app</a>.

| Parameters | Type    | Default value                | Description |
|------------|---------|------------------------------|-------------|
| language   | string  | ".net"                       | Programming language stack (.net, php, node, html) |

---

</details>
::: zone-end
::: zone pivot="platform-linux"
<details>
<summary>How do I deploy a different language stack?</summary>
 
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

</details>
::: zone-end

<hr/>

## 4. Validate the deployment

Browse to `http://<app_name>.azurewebsites.net/` and verify it's been created.

<hr/>

## 5. Clean up resources

When no longer needed, [delete the resource group](../azure-resource-manager/management/delete-resource-group.md?tabs=azure-portal#delete-resource-group).

<hr/>

## Next steps

- [Deploy from local Git](deploy-local-git.md)
- [ASP.NET Core with SQL Database](tutorial-dotnetcore-sqldb-app.md)
- [Python with Postgres](tutorial-python-postgresql-app.md)
- [PHP with MySQL](tutorial-php-mysql-app.md)
- [Connect to Azure SQL database with Java](/azure/azure-sql/database/connect-query-java?toc=%2fazure%2fjava%2ftoc.json)
