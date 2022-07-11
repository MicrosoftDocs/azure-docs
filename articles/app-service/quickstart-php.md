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
[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service.  This quickstart shows how to deploy a PHP app to Azure App Service on Linux.

You create and deploy the web app using [Azure CLI](/cli/azure/get-started-with-azure-cli).

![Sample app running in Azure](media/quickstart-php/hello-world-in-browser.png)

You can follow the steps here using a Mac, Windows, or Linux machine. Once the prerequisites are installed, it takes about five minutes to complete the steps.

To complete this quickstart, you need:

1. An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
1. <a href="https://git-scm.com/" target="_blank">Git</a>
1. <a href="https://php.net/manual/install.php" target="_blank">PHP</a>
1. <a href="/cli/azure/install-azure-cli" target="_blank">Azure CLI</a> to run commands in any shell to provision and configure Azure resources.

## 1 - Set up the sample application

1. In a terminal window, run the following commands. It will clone the sample application to your local machine, and navigate to the directory containing the sample code.

    ```bash
    git clone https://github.com/Azure-Samples/php-docs-hello-world
    cd php-docs-hello-world
    ```

1. To run the application locally, use the `php` command to launch the built-in PHP web server.

    ```bash
    php -S localhost:8080
    ```
    
1. Browse to the sample application at `http://localhost:8080` in a web browser.
    
    ![Sample app running locally](media/quickstart-php/localhost-hello-world-in-browser.png)
    
1. In your terminal window, press **Ctrl+C** to exit the web server.

## 2 - Deploy your application code to Azure

Azure CLI has a command [`az webapp up`](/cli/azure/webapp#az_webapp_up) that will create the necessary resources and deploy your application in a single step.

In the terminal, deploy the code in your local folder using the  [`az webapp up`](/cli/azure/webapp#az_webapp_up) command:

```azurecli
az webapp up --runtime "php|8.0" --os-type=linux
```

- If the `az` command isn't recognized, be sure you have <a href="/cli/azure/install-azure-cli" target="_blank">Azure CLI</a> installed.
- The `--runtime "php|8.0"` argument creates the web app with PHP version 8.0.
- The `--os-type=linux` argument creates the web app on App Service on Linux.
- You can optionally specify a name with the argument `--name <app-name>`. If you don't provide one, then a name will be automatically generated.
- You can optionally include the argument `--location <location-name>` where `<location_name>` is an available Azure region. You can retrieve a list of allowable regions for your Azure account by running the [`az account list-locations`](/cli/azure/appservice#az_appservice_list_locations) command.
- If you see the error, "Could not auto-detect the runtime stack of your app," make sure you're running the command in the code directory (See [Troubleshooting auto-detect issues with az webapp up](https://github.com/Azure/app-service-linux-docs/blob/master/AzWebAppUP/runtime_detection.md)).

The command may take a few minutes to complete. While running, it provides messages about creating the resource group, the App Service plan, and the app resource, configuring logging, and doing ZIP deployment. It then gives the message, "You can launch the app at http://&lt;app-name&gt;.azurewebsites.net", which is the app's URL on Azure.

<pre>
The webapp '&lt;app-name>' doesn't exist
Creating Resource group '&lt;group-name>' ...
Resource group creation complete
Creating AppServicePlan '&lt;app-service-plan-name>' ...
Creating webapp '&lt;app-name>' ...
Configuring default logging for the app, if not already enabled
Creating zip with contents of dir /home/msangapu/myPhpApp ...
Getting scm site credentials for zip deployment
Starting zip deployment. This operation can take a while to complete ...
Deployment endpoint responded with status code 202
You can launch the app at http://&lt;app-name>.azurewebsites.net
{
  "URL": "http://&lt;app-name>.azurewebsites.net",
  "appserviceplan": "&lt;app-service-plan-name>",
  "location": "centralus",
  "name": "&lt;app-name>",
  "os": "linux",
  "resourcegroup": "&lt;group-name>",
  "runtime_version": "php|8.0",
  "runtime_version_detected": "0.0",
  "sku": "FREE",
  "src_path": "//home//msangapu//myPhpApp"
}
</pre>

[!include [az webapp up command note](../../includes/app-service-web-az-webapp-up-note.md)]

## 3 - Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`.

![Empty web app page](media/quickstart-php/hello-world-in-browser.png)

## 4 - Redeploy updates

1. Using a local text editor, open the `index.php` file within the PHP app, and make a small change to the text within the string next to `echo`:

    ```php
    echo "Hello Azure!";
    ```

1. Save your changes, then redeploy the app using the [az webapp up](/cli/azure/webapp#az-webapp-up) command again with these arguments:

    ```azurecli
    az webapp up --runtime "php|8.0" --os-type=linux
    ```

1. Once deployment has completed, return to the browser window that opened during the **Browse to the app** step, and refresh the page.

    ![Updated sample app running in Azure](media/quickstart-php/hello-azure-in-browser.png)

## 5 - Manage your new Azure app

1. Go to the <a href="https://portal.azure.com" target="_blank">Azure portal</a> to manage the web app you created. Search for and select **App Services**.

    ![Search for App Services, Azure portal, create PHP web app](media/quickstart-php/navigate-to-app-services-in-the-azure-portal.png)

2. Select the name of your Azure app.

    ![Portal navigation to Azure app](./media/quickstart-php/php-docs-hello-world-app-service-list.png)

    Your web app's **Overview** page will be displayed. Here, you can perform basic management tasks like **Browse**, **Stop**, **Restart**, and **Delete**.

    ![App Service page in Azure portal](media/quickstart-php/php-docs-hello-world-app-service-detail.png)

    The web app menu provides different options for configuring your app.

## Clean up resources

When you're finished with the sample app, you can remove all of the resources for the app from Azure. It will not incur extra charges and keep your Azure subscription uncluttered. Removing the resource group also removes all resources in the resource group and is the fastest way to remove all Azure resources for your app.

Delete the resource group by using the [az group delete](/cli/azure/group#az-group-delete) command.

```azurecli-interactive
az group delete --name myResourceGroup
```

This command may take a minute to run.

## Next steps

> [!div class="nextstepaction"]
> [PHP with MySQL](tutorial-php-mysql-app.md)

> [!div class="nextstepaction"]
> [Configure PHP app](configure-language-php.md)
::: zone-end  
