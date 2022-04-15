---
title: 'Quickstart: Create a PHP web app'
description: Deploy your first PHP Hello World to Azure App Service in minutes. You deploy using Git, which is one of many ways to deploy to App Service.
ms.assetid: 6feac128-c728-4491-8b79-962da9a40788
ms.topic: quickstart
ms.date: 03/10/2022
ms.devlang: php
ms.custom: mode-other, devdivchpfy22
zone_pivot_groups: app-service-platform-windows-linux
---

# Create a PHP web app in Azure App Service

::: zone pivot="platform-windows"  
[!INCLUDE [quickstart-php-windows-](./includes/quickstart-php/quickstart-php-windows-pivot.md)]
::: zone-end  

::: zone pivot="platform-linux"
[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service.  This quickstart tutorial shows how to deploy a PHP app to Azure App Service on Linux.

You create and deploy the web app using [Azure CLI](/cli/azure/get-started-with-azure-cli).

![Sample app running in Azure](media/quickstart-php/hello-world-in-browser.png)

You can follow the steps here using a Mac, Windows, or Linux machine. Once the prerequisites are installed, it takes about five minutes to complete the steps.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Set up your initial environment

- Have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- <a href="https://git-scm.com/" target="_blank">Install Git</a>
- <a href="https://php.net/manual/install.php" target="_blank">Install PHP</a>
- Install <a href="/cli/azure/install-azure-cli" target="_blank">Azure CLI</a>, with which you run commands in any shell to provision and configure Azure resources.

## Download the sample locally

1. In a terminal window, run the following commands. It will clone the sample application to your local machine, and navigate to the directory containing the sample code.

    ```bash
    git clone https://github.com/Azure-Samples/php-docs-hello-world
    cd php-docs-hello-world
    ```
    
1. Make sure the default branch is `main`.

    ```bash
    git branch -m main
    ```
    
    > [!TIP]
    > The branch name change isn't required by App Service. However, since many repositories are changing their default branch to `main`, this quickstart also shows you how to deploy a repository from `main`.
    
## Run the app locally

1. Run the application locally so that you see how it should look when you deploy it to Azure. Open a terminal window and use the `php` command to launch the built-in PHP web server.

    ```bash
    php -S localhost:8080
    ```
    
1. Open a web browser, and navigate to the sample app at `http://localhost:8080`.

    You see the **Hello World!** message from the sample app displayed in the page.
    
    ![Sample app running locally](media/quickstart-php/localhost-hello-world-in-browser.png)
    
1. In your terminal window, press **Ctrl+C** to exit the web server.

## Deploy to Azure

In the terminal, deploy the code in your local folder using the  [`az webapp up`](/cli/azure/webapp#az_webapp_up) command:

```azurecli
az webapp up --sku F1 --name <app-name>
``` 

- If the `az` command isn't recognized, be sure you have the Azure CLI installed as described in [Set up your initial environment](#set-up-your-initial-environment).
- Replace `<app_name>` with a name that's unique across all of Azure (*valid characters are `a-z`, `0-9`, and `-`*). A good pattern is to use a combination of your company name and an app identifier.
- The `--sku F1` argument creates the web app on the Free pricing tier, which incurs a no cost.
- You can optionally include the argument `--location <location-name>` where `<location_name>` is an available Azure region. You can retrieve a list of allowable regions for your Azure account by running the [`az account list-locations`](/cli/azure/appservice#az_appservice_list_locations) command.
- The command creates a Linux app for Node.js by default. To create a Windows app instead, use the `--os-type` argument.
- If you see the error, "Could not auto-detect the runtime stack of your app," make sure you're running the command in the *myExpressApp* directory (See [Troubleshooting auto-detect issues with az webapp up](https://github.com/Azure/app-service-linux-docs/blob/master/AzWebAppUP/runtime_detection.md)).

The command may take a few minutes to complete. While running, it provides messages about creating the resource group, the App Service plan, and the app resource, configuring logging, and doing ZIP deployment. It then gives the message, "You can launch the app at http://&lt;app-name&gt;.azurewebsites.net", which is the app's URL on Azure.

<pre>
The webapp '&lt;app-name>' doesn't exist
Creating Resource group '&lt;group-name>' ...
Resource group creation complete
Creating AppServicePlan '&lt;app-service-plan-name>' ...
Creating webapp '&lt;app-name>' ...
Configuring default logging for the app, if not already enabled
Creating zip with contents of dir /home/cephas/myExpressApp ...
Getting scm site credentials for zip deployment
Starting zip deployment. This operation can take a while to complete ...
Deployment endpoint responded with status code 202
You can launch the app at http://&lt;app-name>.azurewebsites.net
{
  "URL": "http://&lt;app-name>.azurewebsites.net",
  "appserviceplan": "&lt;app-service-plan-name>",
  "location": "centralus",
  "name": "&lt;app-name>",
  "os": "&lt;os-type>",
  "resourcegroup": "&lt;group-name>",
  "runtime_version": "node|10.14",
  "runtime_version_detected": "0.0",
  "sku": "FREE",
  "src_path": "//home//cephas//myExpressApp"
}
</pre>

[!include [az webapp up command note](../../includes/app-service-web-az-webapp-up-note.md)]


1. Browse to your newly created web app. Replace _&lt;app-name>_ with your unique app name created in the prior step.

    ```bash
    http://<app-name>.azurewebsites.net
    ```

    Here's what your new web app should look like:

    ![Empty web app page](media/quickstart-php/app-service-web-service-created.png)

## Redeploy updates

1. Using a local text editor, open the `index.php` file within the PHP app, and make a small change to the text within the string next to `echo`:

    ```php
    echo "Hello Azure!";
    ```

1. Save your changes, then redeploy the app using the [az webapp up](/cli/azure/webapp#az-webapp-up) command again with no arguments:

    ```azurecli
    az webapp up
    ```

1. Once deployment has completed, return to the browser window that opened during the **Browse to the app** step, and refresh the page.

    ![Updated sample app running in Azure](media/quickstart-php/hello-azure-in-browser.png)

## Manage your new Azure app

1. Go to the <a href="https://portal.azure.com" target="_blank">Azure portal</a> to manage the web app you created. Search for and select **App Services**.

    ![Search for App Services, Azure portal, create PHP web app](media/quickstart-php/navigate-to-app-services-in-the-azure-portal.png)

2. Select the name of your Azure app.

    ![Portal navigation to Azure app](./media/quickstart-php/php-docs-hello-world-app-service-list.png)

    Your web app's **Overview** page will be displayed. Here, you can perform basic management tasks like **Browse**, **Stop**, **Restart**, and **Delete**.

    ![App Service page in Azure portal](media/quickstart-php/php-docs-hello-world-app-service-detail.png)

    The web app menu provides different options for configuring your app.

[!INCLUDE [cli-samples-clean-up](../../includes/cli-samples-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [PHP with MySQL](tutorial-php-mysql-app.md)

> [!div class="nextstepaction"]
> [Configure PHP app](configure-language-php.md)
::: zone-end  