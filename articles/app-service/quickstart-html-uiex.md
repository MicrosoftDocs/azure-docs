---
title: 'QuickStart: Create a static HTML web app'
description: Deploy your first HTML Hello World to Azure App Service in minutes. You deploy using Git, which is one of many ways to deploy to App Service.
author: msangapu-msft

ms.assetid: 60495cc5-6963-4bf0-8174-52786d226c26
ms.topic: quickstart
ms.date: 08/23/2019
ms.author: msangapu
ms.custom: mvc, cli-validate, seodec18, devx-track-azurecli
adobe-target: true
adobe-target-activity: DocsExp–386541–A/B–Enhanced-Readability-Quickstarts–2.19.2021
adobe-target-experience: Experience B
adobe-target-content: ./quickstart-html-uiex
---

# Create a static HTML web app in Azure

This quickstart shows how to deploy a basic HTML+CSS site to <abbr title="Azure App Service provides a highly scalable, self-patching web hosting service">Azure App Service</abbr>. You'll complete this quickstart in [Cloud Shell](../cloud-shell/overview.md), but you can also run these commands locally with [Azure CLI](/cli/azure/install-azure-cli).

![Home page of sample app](media/quickstart-html/hello-world-in-browser-az.png)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

<hr/>

## 1. Download the sample

In [Cloud Shell](../cloud-shell/overview.md), create a quickstart directory and then change to it.

```bash
mkdir quickstart

cd $HOME/quickstart
```

Next, run the following command to clone the sample app repository to your quickstart directory.

```bash
git clone https://github.com/Azure-Samples/html-docs-hello-world.git
```

<hr/>

## 2. Create a web app

Change to the directory that contains the sample code and run the `az webapp up` command. In the following example, replace <abbr title="Valid characters characters are `a-z`, `0-9`, and `-`.">`<app-name>`</abbr> with a globally unique app name. Static content is indicated by the `--html` flag.

```bash
cd html-docs-hello-world

az webapp up --location westeurope --name <app_name> --html
```

The command may take a few minutes to complete. It lets you know what it's doing, and ends with "You can launch the app at http://&lt;app-name&gt;.azurewebsites.net", which is the app's URL on Azure. Make a note of the `resourceGroup` value. You need it for the [clean up resources](#6-clean-up-resources) section.

<details>
<summary>What's <code>az webapp up</code> doing?</summary>
<p>The <code>az webapp up</code> command does the following actions:</p>
<ul>
<li>Create a default <abbr title="Contains all of the Azure resources for the service.">resource group</abbr>.</li>
<li>Create a default <abbr title="Specifies the location, size, and features of the web server farm that hosts your app.">App Service plan</abbr>.</li>
<li><a href="/cli/azure/webapp?view=azure-cli-latest#az-webapp-create">Create an <abbr title="The representation of your web app, which contains your app code, DNS hostnames, certificates, and related resources.">App Service app</abbr></a> with the specified name.</li>
<li><a href="/azure/app-service/deploy-zip">Zip deploy</a> files from the current working directory to the app.</li>
</ul>
While running, it displays information similar to the following example:

```output
{
  "app_url": "https://&lt;app_name&gt;.azurewebsites.net",
  "location": "westeurope",
  "name": "&lt;app_name&gt;",
  "os": "Windows",
  "resourcegroup": "appsvc_rg_Windows_westeurope",
  "serverfarm": "appsvc_asp_Windows_westeurope",
  "sku": "FREE",
  "src_path": "/home/&lt;username&gt;/quickstart/html-docs-hello-world ",
  &lt; JSON data removed for brevity. &gt;
}
```

</details>

<hr/>

## 3. Browse to the app

In a browser, go to the app URL: `http://<app_name>.azurewebsites.net`.

The page is running as an Azure App Service web app.

![Sample app home page](media/quickstart-html/hello-world-in-browser-az.png)

**Congratulations!** You've deployed your first HTML app to App Service.

<hr/>

## 4. Update and redeploy the app

In the Cloud Shell, **type** `nano index.html` to open the nano text editor. In the `<h1>` heading tag, change "Azure App Service - Sample Static HTML Site" to "Azure App Service", as shown below.

![Nano index.html](media/quickstart-html/nano-index-html.png)

**Save** your changes and **exit** nano. Use the command `^O` to save and `^X` to exit.

You'll now redeploy the app with the same `az webapp up` command.

```bash
az webapp up --location westeurope --name <app_name> --html
```

Once deployment has completed, switch back to the browser window that opened in the **Browse to the app** step, and **refresh** the page.

![Updated sample app home page](media/quickstart-html/hello-azure-in-browser-az.png)

<hr/>

## 5. Manage your new Azure app

To manage the web app you created, in the [Azure portal](https://portal.azure.com), **search** for and **select** **App Services**.

![Select App Services in the Azure portal](./media/quickstart-html/portal0.png)

On the **App Services** page, select the name of your Azure app.

![Portal navigation to Azure app](./media/quickstart-html/portal1.png)

You see your web app's Overview page. Here, you can perform basic management tasks like browse, stop, start, restart, and delete.

![App Service blade in Azure portal](./media/quickstart-html/portal2.png)

The left menu provides different pages for configuring your app.

<hr/>

## 6. Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following command in the Cloud Shell. Remember that the resource group name was automatically generated for you in the [create a web app](#2-create-a-web-app) step.

```bash
az group delete --name appsvc_rg_Windows_westeurope
```

This command may take a minute to run.

<hr/>

## 7. Next steps

> [!div class="nextstepaction"]
> [Map custom domain](app-service-web-tutorial-custom-domain.md)
