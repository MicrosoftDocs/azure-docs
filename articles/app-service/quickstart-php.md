---
title: 'Quickstart: Create a PHP Web App'
description: Deploy your first PHP Hello World to Azure App Service in minutes. You deploy using Git, which is one of many ways to deploy to App Service.
ms.assetid: 6feac128-c728-4491-8b79-962da9a40788
ms.topic: quickstart
author: msangapu-msft
ms.author: msangapu
ms.date: 04/22/2025
ms.devlang: php
ms.custom: mode-other, devdivchpfy22, devx-track-azurecli, linux-related-content
zone_pivot_groups: app-service-platform-windows-linux
---

# Create a PHP web app in Azure App Service

::: zone pivot="platform-windows"  
[!INCLUDE [quickstart-php-windows-](./includes/quickstart-php/quickstart-php-windows-pivot.md)]
::: zone-end  

::: zone pivot="platform-linux"
[Azure App Service](overview.md) provides a highly scalable, self-patching service for web hosting. This quickstart shows how to deploy a PHP app to Azure App Service on Linux.

:::image type="content" source="media/quickstart-php/hello-world-in-browser.png" alt-text="Screenshot of the sample app running in Azure.":::

You can follow the steps here using a Mac, Windows, or Linux machine. Once the prerequisites are installed, it takes about ten minutes to complete the steps.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
* [Git](https://git-scm.com/)
* [PHP](https://php.net/downloads.php)
* [Azure CLI](/cli/azure/install-azure-cli) to run commands in any shell to create and configure Azure resources.

## Download the sample repository

### [Azure CLI](#tab/cli)

In the following steps, you create the web app by using the [Azure CLI](/cli/azure/get-started-with-azure-cli), and then you deploy sample PHP code to the web app.

You can use the [Azure Cloud Shell](https://shell.azure.com).

1. In a terminal window, run the following commands to clone the sample application to your local machine and navigate to the project root.

    ```bash
    git clone https://github.com/Azure-Samples/php-docs-hello-world
    cd php-docs-hello-world
    ```

1. To run the application locally, use the `php` command to launch the built-in PHP web server.

    ```bash
    php -S localhost:8080
    ```

1. Browse to the sample application at `http://localhost:8080` in a web browser.

    :::image type="content" source="media/quickstart-php/localhost-hello-world-in-browser.png" alt-text="Screenshot of the sample app running locally.":::

1. In your terminal window, press **Ctrl+C** to exit the web server.

### [Portal](#tab/portal)

1. In your browser, navigate to the repository containing [the sample code](https://github.com/Azure-Samples/php-docs-hello-world).

1. In the upper right corner, select **Fork**.

    :::image type="content" source="media/quickstart-php/fork-php-docs-hello-world-repo.png" alt-text="Screenshot of the Azure Samples repo in GitHub, with the Fork option highlighted.":::

1. On the **Create a new fork** screen, confirm the **Owner** and **Repository name** fields. Select **Create fork**.

    :::image type="content" source="media/quickstart-php/fork-details-php-docs-hello-world-repo.png" alt-text="Screenshot of the Create a new fork page in GitHub for creating a new fork of Azure Samples.":::

>[!NOTE]
> This should take you to the new fork. Your fork URL looks something like this: `https://github.com/YOUR_GITHUB_ACCOUNT_NAME/php-docs-hello-world`

---

## Deploy your application code to Azure

### [Azure CLI](#tab/cli)

Azure CLI has a command [`az webapp up`](/cli/azure/webapp#az-webapp-up) that creates the necessary resources and deploys your application in a single step.

In the terminal, deploy the code in your local folder using the `az webapp up` command:

```azurecli
az webapp up --runtime "PHP:8.2" --os-type=linux
```

- If the `az` command isn't recognized, be sure you have [Azure CLI](/cli/azure/install-azure-cli) installed.
- The `--runtime "PHP:8.2"` argument creates the web app with PHP version 8.2.
- The `--os-type=linux` argument creates the web app on App Service on Linux.
- You can optionally specify a name with the argument `--name <app-name>`. If you don't provide one, then a name is automatically generated.
- You can optionally include the argument `--location <location-name>` where `<location_name>` is an available Azure region. You can retrieve a list of allowable regions for your Azure account by running the [`az account list-locations`](/cli/azure/appservice#az-appservice-list-locations) command.
- If you see the error **Could not auto-detect the runtime stack of your app**, make sure you're running the command in the code directory. To learn more, see [Troubleshooting auto-detect issues with az webapp up](https://github.com/Azure/app-service-linux-docs/blob/master/AzWebAppUP/runtime_detection.md).

The command can take a few minutes to complete. While it's running, it provides messages about creating the resource group, the App Service plan, and the app resource, configuring logging, and doing ZIP deployment. It then provides the app's URL on Azure.

```
The webapp '<app-name>' doesn't exist
Creating Resource group '<group-name>' ...
Resource group creation complete
Creating AppServicePlan '<app-service-plan-name>' ...
Creating webapp '<app-name>' ...
Configuring default logging for the app, if not already enabled
Creating zip with contents of <directory-location> ...
Getting scm site credentials for zip deployment
Starting zip deployment. This operation can take a while to complete ...
Deployment endpoint responded with status code 202
You can launch the app at http://<app-name>.azurewebsites.net
{
  "URL": "http://<app-name>.azurewebsites.net",
  "appserviceplan": "<app-service-plan-name>",
  "location": "centralus",
  "name": "<app-name>",
  "os": "linux",
  "resourcegroup": "<group-name>",
  "runtime_version": "php|8.2",
  "runtime_version_detected": "0.0",
  "sku": "FREE",
  "src_path": "<directory-path>"
}
```

[!include [az webapp up command note](../../includes/app-service-web-az-webapp-up-note.md)]

Browse to the deployed application in your web browser at the URL that's provided in the terminal.

### [Portal](#tab/portal)

1. Sign in to [the Azure portal](https://portal.azure.com).

1. At the top of the portal, type **app services** in the search box. Under **Services**, select **App Services**.

    :::image type="content" source="media/quickstart-php/azure-portal-search-for-app-services.png" alt-text="Screenshot of the Azure portal with app services typed in the search text box.":::

1. In the **App Services** page, select **+ Create** and choose **Web App**.

1. In the **Basics** tab:

    - Under **Resource group**, select **Create new**. Type *myResourceGroup* for the name.
    - Under **Name**, type a globally unique name for your web app.
    - Under **Publish**, select **Code**.
    - Under **Runtime stack** select **PHP 8.2**.
    - Under **Operating System**, select **Linux**.
    - Under **Region**, select an Azure region close to you.
    - Under **App Service Plan**, create an app service plan named *myAppServicePlan*.
    - Under **Pricing plan**, select **Free F1**.

    :::image type="content" source="./media/quickstart-php/app-service-details-php.png" lightbox="./media/quickstart-php/app-service-details-php.png" alt-text="Screenshot of new App Service app configuration for PHP in the Azure portal.":::

1. Select the **Deployment** tab at the top of the page.

1. Under **GitHub Actions settings**, set **Continuous deployment** to *Enable*.

1. Under **GitHub Actions details**, authenticate with your GitHub account, and select the following options:

    - For **Organization** select the organization where you forked the demo project.
    - For **Repository** select the *php-docs-hello-world* project.
    - For **Branch** select *main*.

    :::image type="content" source="media/quickstart-php/app-service-deploy-php.png" lightbox="media/quickstart-php/app-service-deploy-php.png" border="true" alt-text="Screenshot of the deployment options for a PHP app.":::

    > [!NOTE]
    > By default, the creation wizard [disables basic authentication](configure-basic-auth-disable.md) and GitHub Actions deployment is created [using a user-assigned identity](deploy-continuous-deployment.md#what-does-the-user-assigned-identity-option-do-for-github-actions). If you get a permissions error during resource creation, your Azure account might not have [enough permissions](deploy-continuous-deployment.md#why-do-i-see-the-error-you-do-not-have-sufficient-permissions-on-this-app-to-assign-role-based-access-to-a-managed-identity-and-configure-federated-credentials). You can [configure GitHub Actions deployment later](deploy-continuous-deployment.md) with an identity generated for you by an Azure administrator, or you can also enable basic authentication instead.

1. Select the **Review + create** button at the bottom of the page.

1. After validation runs, select the **Create** button at the bottom of the page.

1. After deployment is completed, select **Go to resource**.
  
1. Browse to the deployed application in your web browser at the URL provided.

---

The PHP sample code is running in an Azure App Service.

:::image type="content" source="media/quickstart-php/php-8-hello-world-in-browser.png" alt-text="Screenshot of the sample app running in Azure, showing Hello World.":::

**Congratulations!** You deployed your first PHP app to App Service using the Azure portal.

## Update and redeploy the app

### [Azure CLI](#tab/cli)

1. Locate the directory *php-docs-hello-world* and open the *index.php* file using a local text editor. Make a small change to the text within the string next to `echo`:

    ```php
    echo "Hello Azure!";
    ```

1. Save your changes, then redeploy the app using the [az webapp up](/cli/azure/webapp#az-webapp-up) command again with these arguments:

    ```azurecli
    az webapp up --runtime "PHP:8.2" --os-type=linux
    ```

1. Once deployment is completed, return to the browser window that opened during the **Browse to the app** step, and refresh the page.

    :::image type="content" source="media/quickstart-php/hello-azure-in-browser.png" alt-text="Screenshot of the updated sample app running in Azure.":::

### [Portal](#tab/portal)

1. Browse to your GitHub fork of php-docs-hello-world.

1. On your repo page, press `.` to start Visual Studio Code within your browser.

    :::image type="content" source="media/quickstart-php/forked-github-repo-press-period.png" alt-text="Screenshot of the forked php-docs-hello-world repo in GitHub with instructions to press the period key on this screen.":::

    > [!NOTE]
    > The URL changes from GitHub.com to GitHub.dev. This feature only works with repos that have files. This doesn't work on empty repos.

1. Edit *index.php* so that it shows *Hello Azure!* instead of *Hello World!*

    ```php
    <?php
        echo "Hello Azure!";
    ?>
    ```

1. From the **Source Control** menu, select the **Stage Changes** button to stage the change.

    :::image type="content" source="media/quickstart-php/visual-studio-code-in-browser-stage-changes.png" alt-text="Screenshot of Visual Studio Code in the browser, highlighting the Source Control navigation in the sidebar, then highlighting the Stage Changes button in the Source Control panel.":::

1. Enter a commit message such as *Hello Azure*. Then, select **Commit and Push**.

    :::image type="content" source="media/quickstart-php/visual-studio-code-in-browser-commit-push.png" alt-text="Screenshot of Visual Studio Code in the browser, Source Control panel with a commit message of Hello Azure.":::

1. After deployment is complete, return to the browser window that opened during the **Browse to the app** step, and refresh the page.

    :::image type="content" source="media/quickstart-php/php-8-hello-azure-in-browser.png" alt-text="Screenshot of the updated sample app running in Azure, showing Hello Azure.":::

---

## Manage your new Azure app

1. Go to the Azure portal to manage the web app you created. Search for and select **App Services**.

    :::image type="content" source="media/quickstart-php/azure-portal-search-for-app-services.png" alt-text="Screenshot of the Azure portal with app services typed in the search text box.":::

1. Select your Azure app to open it.

    :::image type="content" source="media/quickstart-php/app-service-list.png" alt-text="Screenshot of the App Services list in Azure. The name of the demo app service is highlighted.":::

    Your web app's **Overview** page should be displayed. Here, you can perform basic management tasks like **Browse**, **Stop**, **Restart**, and **Delete**.

    :::image type="content" source="media/quickstart-php/app-service-detail.png" alt-text="Screenshot of the App Service overview page in Azure portal. In the action bar, the Browse, Stop, Swap, Restart, and Delete button group is highlighted.":::

    The web app menu provides different options for configuring your app.

## Clean up resources

When you're finished with the sample app, you can remove all of the resources for the app from Azure so you can avoid extra charges and keep your Azure subscription uncluttered. Removing the resource group also removes all resources in the resource group and is the fastest way to remove all Azure resources for your app.

### [Azure CLI](#tab/cli)

Delete the resource group by using the [az group delete](/cli/azure/group#az-group-delete) command.

```azurecli-interactive
az group delete --name myResourceGroup
```

This command takes a minute to run.

### [Portal](#tab/portal)

1. From your App Service **Overview** page, select the resource group you created.

1. From the resource group page, select **Delete resource group**. Confirm the name of the resource group to finish deleting the resources.

---

::: zone-end

## Related content

* [Deploy a PHP, MySQL, and Redis app to Azure App Service](tutorial-php-mysql-app.md)
* [Configure a PHP app for Azure App Service](configure-language-php.md)
* [Secure your app with a custom domain and a managed certificate](tutorial-secure-domain-certificate.md)
