---
title: 'Tutorial: Build a PHP (Laravel) app with Azure Database for MySQL - Flexible Server on Azure App Service'
description: This tutorial explains how to build and deploy a PHP Laravel app with MySQL flexible server, secured within a VNet.
author: shreyaaithal
ms.author: shaithal
ms.service: mysql
ms.subservice: flexible-server
ms.topic: tutorial
ms.devlang: php
ms.date: 8/11/2020
ms.custom: mvc, build-2023, build-2023-dataai
---

# Tutorial: Build a PHP (Laravel) and MySQL Flexible Server app on Azure App Service

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

[Azure App Service](../../app-service/overview.md) provides a highly scalable, self-patching web hosting service using the Linux operating system. This tutorial shows how to create a secure PHP app in Azure App Service that's connected to a MySQL database (using Azure Database for MySQL - Flexible Server). When you're finished, you'll have a [Laravel](https://laravel.com/) app running on Azure App Service on Linux.

:::image type="content" source="./media/tutorial-php-database-app/azure-portal-browse-app-2.png" alt-text="Screenshot of the Azure app example titled Task List showing new tasks added.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a secure-by-default PHP and MySQL app in Azure
> * Configure connection secrets to MySQL using app settings
> * Deploy application code using GitHub Actions
> * Update and redeploy the app
> * Run database migrations securely
> * Stream diagnostic logs from Azure
> * Manage the app in the Azure portal

## Prerequisites

- An Azure subscription [!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]

## Sample application

To follow along with this tutorial, clone or download the sample application from the repository:

```terminal
git clone https://github.com/Azure-Samples/laravel-tasks.git
```

If you want to run the application locally, do the following:

- In **.env**, configure the database settings (like `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`) using settings in your local MySQL database. You need a local MySQL server to run this sample.
- From the root of the repository, start Laravel with the following commands:

    ```terminal
    composer install
    php artisan migrate
    php artisan key:generate
    php artisan serve
    ```

## 1 - Create App Service and MySQL resources

In this step, you create the Azure resources. The steps used in this tutorial create an App Service and Azure Database for MySQL - Flexible Server configuration that's secure by default. For the creation process, you'll specify:

* The **Name** for the web app. It's the name used as part of the DNS name for your webapp in the form of `https://<app-name>.azurewebsites.net`.
* The **Runtime** for the app. It's where you select the version of PHP to use for your app.
* The **Resource Group** for the app. A resource group lets you group (in a logical container) all the Azure resources needed for the application.

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app service step 1](./includes/tutorial-php-database-app/azure-portal-create-app-mysql-1.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-create-app-mysql-1-240px.png" alt-text="A screenshot showing how to use the search box in the top tool bar to find the Web App + Database creation wizard." lightbox="./media/tutorial-php-database-app/azure-portal-create-app-mysql-1.png"::: |
| [!INCLUDE [Create app service step 2](./includes/tutorial-php-database-app/azure-portal-create-app-mysql-2.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-create-app-mysql-2-240px.png" alt-text="A screenshot showing how to configure a new app and database in the Web App + Database wizard." lightbox="./media/tutorial-php-database-app/azure-portal-create-app-mysql-2.png"::: |
| [!INCLUDE [Create app service step 3](./includes/tutorial-php-database-app/azure-portal-create-app-mysql-3.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-create-app-mysql-3-240px.png" alt-text="A screenshot showing the form to fill out to create a web app in Azure." lightbox="./media/tutorial-php-database-app/azure-portal-create-app-mysql-3.png"::: |

## 2 - Set up database connectivity

The creation wizard generated [app settings](../../app-service/configure-common.md#configure-app-settings) for you to use to connect to the database, but not in a format that's useable for your code yet. In this step, you edit and update app settings to the format that your app needs.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Get connection string step 1](./includes/tutorial-php-database-app/azure-portal-get-connection-string-1.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-get-connection-string-1-240px.png" alt-text="A screenshot showing how to open the configuration page in App Service." lightbox="./media/tutorial-php-database-app/azure-portal-get-connection-string-1.png"::: |
| [!INCLUDE [Get connection string step 2](./includes/tutorial-php-database-app/azure-portal-get-connection-string-2.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-get-connection-string-2-240px.png" alt-text="A screenshot showing how to see the autogenerated connection string." lightbox="./media/tutorial-php-database-app/azure-portal-get-connection-string-2.png"::: |
| [!INCLUDE [Get connection string step 3](./includes/tutorial-php-database-app/azure-portal-get-connection-string-3.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-get-connection-string-3-240px.png" alt-text="A screenshot showing how to create an app setting." lightbox="./media/tutorial-php-database-app/azure-portal-get-connection-string-3.png"::: |
| [!INCLUDE [Get connection string step 4](./includes/tutorial-php-database-app/azure-portal-get-connection-string-4.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-get-connection-string-4-240px.png" alt-text="A screenshot showing all the required app settings in the configuration page." lightbox="./media/tutorial-php-database-app/azure-portal-get-connection-string-4.png"::: |

## 3 - Deploy sample code

In this step, you'll configure GitHub deployment using GitHub Actions. It's just one of many ways to deploy to App Service, but also a great way to have continuous integration in your deployment process. By default, every `git push` to your GitHub repository will kick off the build and deploy action. You'll make some changes to your codebase with Visual Studio Code directly in the browser, then let GitHub Actions deploy automatically for you.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Deploy sample code step 1](./includes/tutorial-php-database-app/azure-portal-deploy-sample-code-1.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-deploy-sample-code-1-240px.png" alt-text="A screenshot showing how to create a fork of the sample GitHub repository." lightbox="./media/tutorial-php-database-app/azure-portal-deploy-sample-code-1.png"::: |
| [!INCLUDE [Deploy sample code step 2](./includes/tutorial-php-database-app/azure-portal-deploy-sample-code-2.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-deploy-sample-code-2-240px.png" alt-text="A screenshot showing how to open the Visual Studio Code browser experience in GitHub." lightbox="./media/tutorial-php-database-app/azure-portal-deploy-sample-code-2.png"::: |
| [!INCLUDE [Deploy sample code step 3](./includes/tutorial-php-database-app/azure-portal-deploy-sample-code-3.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-deploy-sample-code-3-240px.png" alt-text="A screenshot showing Visual Studio Code in the browser and an opened file." lightbox="./media/tutorial-php-database-app/azure-portal-deploy-sample-code-3.png"::: |
| [!INCLUDE [Deploy sample code step 4](./includes/tutorial-php-database-app/azure-portal-deploy-sample-code-4.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-deploy-sample-code-4-240px.png" alt-text="A screenshot showing how to open the deployment center in App Service." lightbox="./media/tutorial-php-database-app/azure-portal-deploy-sample-code-4.png"::: |
| [!INCLUDE [Deploy sample code step 5](./includes/tutorial-php-database-app/azure-portal-deploy-sample-code-5.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-deploy-sample-code-5-240px.png" alt-text="A screenshot showing how to configure CI/CD using GitHub Actions." lightbox="./media/tutorial-php-database-app/azure-portal-deploy-sample-code-5.png"::: |
| [!INCLUDE [Deploy sample code step 6](./includes/tutorial-php-database-app/azure-portal-deploy-sample-code-6.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-deploy-sample-code-6-240px.png" alt-text="A screenshot showing how to open deployment logs in the deployment center." lightbox="./media/tutorial-php-database-app/azure-portal-deploy-sample-code-6.png"::: |
| [!INCLUDE [Deploy sample code step 7](./includes/tutorial-php-database-app/azure-portal-deploy-sample-code-7.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-deploy-sample-code-7-240px.png" alt-text="A screenshot showing how to commit your changes in the Visual Studio Code browser experience." lightbox="./media/tutorial-php-database-app/azure-portal-deploy-sample-code-7.png"::: |

## 4 - Generate database schema

The creation wizard puts the MySQL database server behind a private endpoint, so it's accessible only from the virtual network. Because the App Service app is already integrated with the virtual network, the easiest way to run database migrations with your database is directly from within the App Service container.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Generate database schema step 1](./includes/tutorial-php-database-app/azure-portal-generate-db-schema-1.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-generate-db-schema-1-240px.png" alt-text="A screenshot showing how to open the SSH shell for your app from the Azure portal." lightbox="./media/tutorial-php-database-app/azure-portal-generate-db-schema-1.png"::: |
| [!INCLUDE [Generate database schema step 2](./includes/tutorial-php-database-app/azure-portal-generate-db-schema-2.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-generate-db-schema-2-240px.png" alt-text="A screenshot showing the commands to run in the SSH shell and their output." lightbox="./media/tutorial-php-database-app/azure-portal-generate-db-schema-2.png"::: |

## 5 - Change site root

[Laravel application lifecycle](https://laravel.com/docs/8.x/lifecycle#lifecycle-overview) begins in the **/public** directory instead. The default PHP 8.0 container for App Service uses Nginx, which starts in the application's root directory. To change the site root, you need to change the Nginx configuration file in the PHP 8.0 container (*/etc/nginx/sites-available/default*). For your convenience, the sample repository contains a custom configuration file called *default*. As noted previously, you don't want to replace this file using the SSH shell, because your changes will be lost after an app restart. 

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Change site root step 1](./includes/tutorial-php-database-app/azure-portal-change-site-root-1.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-change-site-root-1-240px.png" alt-text="A screenshot showing how to open the general settings tab in the configuration page of App Service." lightbox="./media/tutorial-php-database-app/azure-portal-change-site-root-1.png"::: |
| [!INCLUDE [Change site root step 2](./includes/tutorial-php-database-app/azure-portal-change-site-root-2.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-change-site-root-2-240px.png" alt-text="A screenshot showing how to configure a startup command in App Service." lightbox="./media/tutorial-php-database-app/azure-portal-change-site-root-2.png"::: |

## 6 - Browse to the app

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Browse to app step 1](./includes/tutorial-php-database-app/azure-portal-browse-app-1.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-browse-app-1-240px.png" alt-text="A screenshot showing how to launch an App Service from the Azure portal." lightbox="./media/tutorial-php-database-app/azure-portal-browse-app-1.png"::: |
| [!INCLUDE [Browse to app step 2](./includes/tutorial-php-database-app/azure-portal-browse-app-2.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-browse-app-2-240px.png" alt-text="A screenshot of the Laravel app running in App Service." lightbox="./media/tutorial-php-database-app/azure-portal-browse-app-2.png"::: |

## 7 - Stream diagnostic logs

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Stream diagnostic logs step 1](./includes/tutorial-php-database-app/azure-portal-stream-diagnostic-logs-1.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-stream-diagnostic-logs-1-240px.png" alt-text="A screenshot showing how to enable native logs in App Service in the Azure portal." lightbox="./media/tutorial-php-database-app/azure-portal-stream-diagnostic-logs-1.png"::: |
| [!INCLUDE [Stream diagnostic logs step 2](./includes/tutorial-php-database-app/azure-portal-stream-diagnostic-logs-2.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-stream-diagnostic-logs-2-240px.png" alt-text="A screenshot showing how to view the log stream in the Azure portal." lightbox="./media/tutorial-php-database-app/azure-portal-stream-diagnostic-logs-2.png"::: |

## Clean up resources

When you're finished, you can delete all of the resources from your Azure subscription by deleting the resource group.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Remove resource group Azure portal 1](./includes/tutorial-php-database-app/azure-portal-clean-up-resources-1.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-clean-up-resources-1-240px.png" alt-text="A screenshot showing how to search for and navigate to a resource group in the Azure portal." lightbox="./media/tutorial-php-database-app/azure-portal-clean-up-resources-1.png"::: |
| [!INCLUDE [Remove resource group Azure portal 2](./includes/tutorial-php-database-app/azure-portal-clean-up-resources-2.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-clean-up-resources-2-240px.png" alt-text="A screenshot showing the location of the Delete Resource Group button in the Azure portal." lightbox="./media/tutorial-php-database-app/azure-portal-clean-up-resources-2.png"::: |
| [!INCLUDE [Remove resource group Azure portal 3](./includes/tutorial-php-database-app/azure-portal-clean-up-resources-3.md)] | :::image type="content" source="./media/tutorial-php-database-app/azure-portal-clean-up-resources-3-240px.png" alt-text="A screenshot of the confirmation dialog for deleting a resource group in the Azure portal." lightbox="./media/tutorial-php-database-app/azure-portal-clean-up-resources-3.png"::: |

## Frequently asked questions

- [How much does this setup cost?](#how-much-does-this-setup-cost)
- [How do I connect to the MySQL database that's secured behind the virtual network with other tools?](#how-do-i-connect-to-the-mysql-database-thats-secured-behind-the-virtual-network-with-other-tools)
- [How does local app development work with GitHub Actions?](#how-does-local-app-development-work-with-github-actions)
- [Why is the GitHub Actions deployment so slow?](#why-is-the-github-actions-deployment-so-slow)

#### How much does this setup cost?

Pricing for the create resources is as follows:

- The App Service plan is created in **Premium V2** tier and can be scaled up or down. See [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).
- The MySQL flexible server is created in **B1ms** tier and can be scaled up or down. With an Azure free account, **B1ms** tier is free for 12 months, up to the monthly limits. See [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/flexible-server/).
- The virtual network doesn't incur a charge unless you configure extra functionality, such as peering. See [Azure Virtual Network pricing](https://azure.microsoft.com/pricing/details/virtual-network/).
- The private DNS zone incurs a small charge. See [Azure DNS pricing](https://azure.microsoft.com/pricing/details/dns/). 

#### How do I connect to the MySQL database that's secured behind the virtual network with other tools?

- For basic access from a commmand-line tool, you can run `mysql` from the app's SSH terminal.
- To connect from a desktop tool like MySQL Workbench, your machine must be within the virtual network. For example, it could be an Azure VM that's connected to one of the subnets, or a machine in an on-premises network that has a [site-to-site VPN](../../vpn-gateway/vpn-gateway-about-vpngateways.md) connection with the Azure virtual network.
- You can also [integrate Azure Cloud Shell](../../cloud-shell/private-vnet.md) with the virtual network.

#### How does local app development work with GitHub Actions?

Take the autogenerated workflow file from App Service as an example, each `git push` kicks off a new build and deployment run. From a local clone of the GitHub repository, you make the desired updates push it to GitHub. For example:

```terminal
git add .
git commit -m "<some-message>"
git push origin main
```

#### Why is the GitHub Actions deployment so slow?

The autogenerated workflow file from App Service defines build-then-deploy, two-job run. Because each job runs in its own clean environment, the workflow file ensures that the `deploy` job has access to the files from the `build` job:

- At the end of the `build` job, [upload files as artifacts](https://docs.github.com/actions/using-workflows/storing-workflow-data-as-artifacts).
- At the beginning of the `deploy` job, download the artifacts.

Most of the time taken by the two-job process is spent uploading and download artifacts. If you want, you can simplify the workflow file by combining the two jobs into one, which eliminates the need for the upload and download steps.

## Summary

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a secure-by-default PHP and MySQL app in Azure
> * Configure connection secrets to MySQL using app settings
> * Deploy application code using GitHub Actions
> * Update and redeploy the app
> * Run database migrations securely
> * Stream diagnostic logs from Azure
> * Manage the app in the Azure portal

<a name="next"></a>

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Map custom DNS name to your app](../../app-service/app-service-web-tutorial-custom-domain.md)
> [!div class="nextstepaction"]
> [How to manage your resources in Azure portal](../../azure-resource-manager/management/manage-resources-portal.md)
> [!div class="nextstepaction"]
> [How to manage your server](how-to-manage-server-cli.md)
