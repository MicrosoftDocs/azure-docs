---
title: 'Tutorial: Build a PHP app with Azure Database for MySQL - Flexible Server'
description: This tutorial explains how to build a PHP app with flexible server and deploy it on Azure App Service.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.subservice: flexible-server
ms.topic: tutorial
ms.devlang: php
ms.date: 8/11/2022
ms.custom: mvc, devx-track-azurecli
---

# Tutorial: Deploy a PHP and MySQL - Flexible Server app on Azure App Service

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

[Azure App Service](../../app-service/overview.md) provides a highly scalable, self-patching web hosting service using the Linux operating system. 

This tutorial shows how to build and deploy a sample PHP application to Azure App Service, and integrate it with Azure Database for MySQL - Flexible Server on the back end. Here you'll use public access connectivity (allowed IP addresses) in the flexible server to connect to the App Service app.

In this tutorial, you'll learn how to:
> [!div class="checklist"]
>
> * Create a MySQL flexible server
> * Connect a PHP app to the MySQL flexible server
> * Deploy the app to Azure App Service
> * Update and redeploy the app

[!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]

## Prerequisites

- [Install Git](https://git-scm.com/).
- The [Azure Command-Line Interface (CLI)](/cli/azure/install-azure-cli).
- An Azure subscription [!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]

## Create an Azure Database for MySQL - Flexible Server

First, we'll provision a MySQL flexible server with public access connectivity, configure firewall rules to allow the application to access the server, and create a production database. 

To learn how to use private access connectivity instead and isolate app and database resources in a virtual network, see [Tutorial: Connect an App Services Web app to an Azure Database for MySQL - Flexible Server in a virtual network](tutorial-webapp-server-vnet.md).

### Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed. Let's create a resource group *rg-php-demo* using the [az group create](/cli/azure/group#az-group-create) command  in the *centralus* location.

1. Open command prompt. 
1. Sign in to your Azure account.
    ```azurecli-interactive
    az login
    ```
1. Choose your Azure subscription.
    ```azurecli-interactive
    az account set -s <your-subscription-ID>
    ```    
1. Create the resource group.
    ```azurecli-interactive
    az group create --name rg-php-demo --location centralus
    ```

### Create a MySQL flexible server

1. To create a MySQL flexible server with public access connectivity, run the following [`az flexible-server create`](/cli/azure/mysql/server#az-mysql-flexible-server-create) command. Replace your values for server name, admin username and password.

    ```azurecli-interactive
    az mysql flexible-server create \
    --name <your-mysql-server-name> \
    --resource-group rg-php-demo \
    --location centralus \
    --admin-user <your-mysql-admin-username> \
    --admin-password <your-mysql-admin-password>
    ```

    You’ve now created a flexible server in the CentralUS region. The server is based on the Burstable B1MS compute SKU, with 32 GB storage, a 7-day backup retention period, and configured with public access connectivity.

1. Next, to create a firewall rule for your MySQL flexible server to allow client connections, run the following command. When both starting IP and end IP are set to 0.0.0.0, only other Azure resources (like App Services apps, VMs, AKS cluster, etc.) can connect to the flexible server.

    ```azurecli-interactive
    az mysql flexible-server firewall-rule create \
     --name <your-mysql-server-name> \
     --resource-group rg-php-demo \
     --rule-name AllowAzureIPs \
     --start-ip-address 0.0.0.0 \
     --end-ip-address 0.0.0.0
    ```

1. To create a new MySQL production database *sampledb* to use with the PHP application, run the following command:

    ```azurecli-interactive
    az mysql flexible-server db create \
    --resource-group rg-php-demo \
    --server-name <your-mysql-server-name> \
    --database-name sampledb
    ```


## Build your application

For the purposes of this tutorial, we'll use a sample PHP application that displays and manages a product catalog. The application provides basic functionalities like viewing the products in the catalog, adding new products, updating existing item prices and removing products.

To learn more about the application code, go ahead and explore the app in the [GitHub repository](https://github.com/Azure-Samples/php-mysql-app-service). To learn how to connect a PHP app to MySQL flexible server, refer [Quickstart: Connect using PHP](connect-php.md).

In this tutorial, we'll directly clone the coded sample app and learn how to deploy it on Azure App Service.

1. To clone the sample application repository and change to the repository root, run the following commands:

    ```bash
    git clone https://github.com/Azure-Samples/php-mysql-app-service.git
    cd php-mysql-app-service
    ```

1. Run the following command to ensure that the default branch is `main`.

    ```bash
    git branch -m main
    ```

## Create and configure an Azure App Service Web App

In Azure App Service (Web Apps, API Apps, or Mobile Apps), an app always runs in an App Service plan. An App Service plan defines a set of compute resources for a web app to run. In this step, we'll create an Azure App Service plan and an App Service web app within it, which will host the sample application.

1. To create an App Service plan in the Free pricing tier, run the following command:

    ```azurecli-interactive
    az appservice plan create --name plan-php-demo \
    --resource-group rg-php-demo \
    --location centralus \
    --sku FREE --is-linux
    ```

1. If you want to deploy an application to Azure web app using deployment methods like FTP or Local Git, you need to configure a deployment user with username and password credentials. After you configure your deployment user, you can take advantage of it for all your Azure App Service deployments.

    ```azurecli-interactive
    az webapp deployment user set \
    --user-name <your-deployment-username> \
    --password <your-deployment-password>
    ```

1. To create an App Service web app with PHP 8.0 runtime and to configure  the Local Git deployment option to deploy your app from a Git repository on your local computer, run the following command. Replace `<your-app-name>` with a globally unique app name (valid characters are a-z, 0-9, and -).

    ```azurecli-interactive
    az webapp create \
    --resource-group rg-php-demo \
    --plan plan-php-demo \
    --name <your-app-name> \
    --runtime "PHP|8.0" \
    --deployment-local-git
    ```

    > [!IMPORTANT]
    > In the Azure CLI output, the URL of the Git remote is displayed in the deploymentLocalGitUrl property, with the format `https://<username>@<app-name>.scm.azurewebsites.net/<app-name>.git`. Save this URL, as you'll need it later.

1. Next we'll configure the MySQL flexible server database connection settings on the Web App.

    The `config.php` file in the sample PHP application retrieves the database connection information (server name, database name, server username and password) from environment variables using the `getenv()` function. In App Service, to set environment variables as **Application Settings** (*appsettings*), run the following command:

    ```azurecli-interactive
    az webapp config appsettings set \
    --name <your-app-name> \
    --resource-group rg-php-demo \
    --settings DB_HOST="<your-server-name>.mysql.database.azure.com" \
    DB_DATABASE="sampledb" \
    DB_USERNAME="<your-mysql-admin-username>" \
    DB_PASSWORD="<your-mysql-admin-password>" \
    MYSQL_SSL="true"
    ```
    
    Alternatively, you can use Service Connector to establish a connection between the App Service app and the MySQL flexible server. For more details, see [Integrate Azure Database for MySQL with Service Connector](../../service-connector/how-to-integrate-mysql.md).

## Deploy your application using Local Git

Now, we'll deploy the sample PHP application to Azure App Service using the Local Git deployment option.

1. Since you're deploying the main branch, you need to set the default deployment branch for your App Service app to main. To set the DEPLOYMENT_BRANCH under **Application Settings**, run the following command:

    ```azurecli-interactive
    az webapp config appsettings set \
    --name <your-app-name> \
    --resource-group rg-php-demo \
    --settings DEPLOYMENT_BRANCH='main'
    ```

1. Verify that you are in the application repository's root directory.

1. To add an Azure remote to your local Git repository, run the following command. Replace `<deploymentLocalGitUrl>` with the URL of the Git remote that you saved in the **Create an App Service web app** step.

    ```azurecli-interactive
    git remote add azure <deploymentLocalGitUrl>
    ```

1. To deploy your app by performing a `git push` to the Azure remote, run the following command. When Git Credential Manager prompts you for credentials, enter the deployment credentials that you created in **Configure a deployment user** step.

    ```azurecli-interactive
    git push azure main
    ```

The deployment may take a few minutes to succeed.

## Test your application

Finally, test the application by browsing to `https://<app-name>.azurewebsites.net`, and then add, view, update or delete items from the product catalog.

:::image type="content" source="media/tutorial-php-database-app/sample-php-app.png" alt-text="Screenshot showing the sample Product Catalog PHP Web App":::

Congratulations! You have successfully deployed a sample PHP application to Azure App Service and integrated it with Azure Database for MySQL - Flexible Server on the back end.

## Update and redeploy the app

To update the Azure app, make the necessary code changes, commit all the changes in Git, and then push the code changes to Azure.

```bash
git add .
git commit -m "Update Azure app"
git push azure main
```

Once the `git push` is complete, navigate to or refresh the Azure app to test the new functionality.

## Clean up resources

In this tutorial, you created all the Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following command in the Cloud Shell:

```azurecli-interactive
az group delete --name rg-php-demo
```

## Next steps

> [!div class="nextstepaction"]
> [How to manage your resources in Azure portal](../../azure-resource-manager/management/manage-resources-portal.md)

> [!div class="nextstepaction"]
> [How to manage your server](how-to-manage-server-cli.md)

