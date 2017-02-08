---
title: Create, configure, and deploy a PHP web app to Azure | Microsoft Docs 
description: A tutorial that shows how to make a PHP (Laravel) web app run in Azure App Service. Learn how to configure Azure App Service to meet the requirements of the PHP framework you choose.
services: app-service\web
documentationcenter: php
author: cephalin
manager: wpickett
editor: ''
tags: mysql

ms.assetid: cb73859d-48aa-470a-b486-d984746d6d26
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: PHP
ms.topic: article
ms.date: 12/16/2016
ms.author: cephalin

---
# Create, configure, and deploy a PHP web app to Azure
[!INCLUDE [tabs](../../includes/app-service-web-get-started-nav-tabs.md)]

This tutorial shows you how to create, configure, and deploy a PHP web app for Azure, and how to configure Azure App Service to meet the
requirements of your PHP web app. By the end of the tutorial, you will have a working [Laravel](https://www.laravel.com/) web app running 
live in [Azure App Service](../app-service/app-service-value-prop-what-is.md).

As a PHP developer, you can bring your favorite PHP framework to Azure. This tutorial uses Laravel simply as a concrete 
app example. You will learn: 

* Deploy using Git
* Set PHP version
* Use a start file that is not in the root application directory
* Access environment-specific variables
* Update your app in Azure

You can apply what you learn here to other PHP web apps that you deploy to Azure.

[!INCLUDE [app-service-linux](../../includes/app-service-linux.md)]

## CLI versions to complete the task

You can complete the task using one of the following CLI versions:

- [Azure CLI 1.0](app-service-web-php-get-started-cli-nodejs.md) – our CLI for the classic and resource management deployment models
- [Azure CLI 2.0 (Preview)](app-service-web-php-get-started.md) - our next generation CLI for the resource management deployment model

## Prerequisites
* [PHP 7.0](http://php.net/downloads.php)
* [Composer](https://getcomposer.org/download/)
* [Azure CLI 2.0 Preview](/cli/azure/install-az-cli2)
* [Git](http://www.git-scm.com/downloads)
* A Microsoft Azure account. If you don't have an account, you can 
  [sign up for a free trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F) or 
  [activate your Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F).

> [!NOTE]
> See a web app in action. [Try App Service](https://azure.microsoft.com/try/app-service/) immediately and create a short-lived starter app—no credit 
> card required, no commitments.
> 
> 

## Create a PHP (Laravel) app on your dev machine
1. Open a new Windows command prompt, PowerShell window, Linux shell, or OS X terminal. Run the following commands to verify that the required tools are installed 
   properly on your machine. 
   
        php --version
        composer --version
        az --version
        git --version
   
    If you haven't installed the tools, see [Prerequisites](#Prerequisites) for download links.

2. Install Laravel like so:
   
        composer global require "laravel/installer"

3. `CD` into a working directory and create a new Laravel application like so:
   
        cd <working_directory>
        laravel new <app_name>
4. `CD` into the newly created `<app_name>` directory and test the app like so:
   
        cd <app_name>
        php artisan serve
   
    You should be able to navigate to http://localhost:8000 in a browser now and see the Laravel splash screen.
   
    ![Test your PHP (Laravel) app locally before deploying it to Azure](./media/app-service-web-php-get-started/laravel-splash-screen.png)

1. Initialize a Git repository and commit all code:

        git init
        git add .
        git commit -m "Hurray! My first commit for my Azure web app!"

So far, just the regular Laravel and Git workflow, and you're not here to <a href="https://laravel.com/docs/5.3" rel="nofollow">learn Laravel</a>. So let's move on.

## Create an Azure web app and set up Git deployment
> [!NOTE]
> "Wait! What if I want to deploy with FTP?" There's an [FTP tutorial](web-sites-php-mysql-deploy-use-ftp.md) for your needs. 
> 
> 

With the Azure CLI, you can create an web app in Azure App Service and set it up for Git deployment with a single line
of command. Let's do this.

1. Log in to Azure like this:
   
        az login
   
    Follow the help message to continue the login process.
   
3. Set the deployment user for App Service. You will deploy code using these credentials later.
   
        az appservice web deployment user set --user-name <username> --password <password>

3. Create a new [resource group](../azure-resource-manager/resource-group-overview.md). For this PHP tutorial, you don't really need to know
what it is.

        az group create --location "<location>" --name my-php-app-group

    To see what possible values you can use for `<location>`, use the `az appservice list-locations` CLI command.

3. Create a new "FREE" [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md). For this PHP tutorial, just 
know that you won't be charged for web apps in this plan.

        az appservice plan create --name my-php-appservice-plan --resource-group my-php-app-group --sku FREE

4. Create a new web app with a unique name in `<app_name>`.

        az appservice web create --name <app_name> --resource-group my-php-app-group --plan my-php-appservice-plan

5. Configure local Git deployment for your new web app with the following command:

        az appservice web source-control config-local-git --name <app_name> --resource-group my-php-app-group

    You will get a JSON output like this, which means that the remote Git repository is configured:

        {
        "url": "https://<deployment_user>@<app_name>.scm.azurewebsites.net/<app_name>.git"
        }

6. Add the URL in the JSON as a Git remote for your local repository (called `azure` for simplicity).

        git remote add azure https://<deployment_user>@<app_name>.scm.azurewebsites.net/<app_name>.git
   
<a name="configure"/>

## Configure the Azure web app
For your Laravel app to work in Azure, you need to pay attention to several things. You'll do this similar exercise
for your PHP framework of choice.

* Configure PHP 5.6.4 or above. See 
  [Latest Laravel 5.3 Server Requirements](https://laravel.com/docs/5.3#server-requirements) for the whole list of server
  requirements. The rest of the list are extensions that are already enabled by Azure's PHP installations. 
* Set the environment variables your app needs. Laravel uses the `.env` file for easy setting of environment 
  variables. However, since it is not supposed to be committed into source control (see 
  [Laravel Environment Configuration](https://laravel.com/docs/5.3/configuration#environment-configuration), 
  you will set the app settings of your Azure web app instead.
* Make sure that the Laravel app's entry point, `public/index.php`, is loaded first. See 
  [Laravel Lifecycle Overview](https://laravel.com/docs/5.3/lifecycle#lifecycle-overview). In other words, you need to
  set the web app's root URL to point to the `public` directory.
* Enable the Composer extension in Azure, since you have a composer.json. That way, you can let Composer worry about
  obtaining your required packages when you deploy with `git push`. It's a matter of convenience. 
  If you don't enable Composer automation, you just need to remove `/vendor` from the `.gitignore` file so that Git 
  includes ("un-ignores") everything in the `vendor` directory when committing and deploying code.

Let's configure these tasks sequentially.

1. Set the PHP version that your Laravel app requires.
   
        az appservice web config update --php-version 7.0 --name <app_name> --resource-group my-php-app-group
   
    You're done setting the PHP version! 

2. Generate a new `APP_KEY` for your Azure web app and set it as an app setting for your Azure web app.
   
        php artisan key:generate --show
        az appservice web config appsettings update --settings APP_KEY="<output_of_php_artisan_key:generate_--show>" --name <app_name> --resource-group my-php-app-group

3. Also, turn on Laravel debugging in order to preempt any cryptic `Whoops, looks like something went wrong.` page.
   
        az appservice web config appsettings update --settings APP_DEBUG=true --name <app_name> --resource-group my-php-app-group
   
    You're done setting environment variables!
   
   > [!NOTE]
   > Wait, let's slow down a bit and explain what Laravel does and what Azure does here. 
   > Laravel uses the `.env` file in the root directory to supply environment variables to the app, where you'll find 
   > the line `APP_DEBUG=true` (and also `APP_KEY=...`). This variable is accessed in `config/app.php` by the code 
   > `'debug' => env('APP_DEBUG', false),`. [env()](https://laravel.com/docs/5.3/helpers#method-env) is a Laravel helper 
   > method that uses the PHP [getenv()](http://php.net/manual/en/function.getenv.php) under the covers.
   > 
   > However, `.env` is ignored by Git because it's called out by the `.gitignore` file in the root directory. Simply put, `.env` 
   > in your local Git repository is not pushed to Azure with the rest of the files. Of course, you can just remove that line 
   > from `.gitignore`, but we've already established that committing this file into source control is not recommended. Nevertheless, 
   > you still need a way to specify these environment variables in Azure. 
   > 
   > The good news is that app settings in Azure App Service supports [getenv()](http://php.net/manual/en/function.getenv.php) 
   > in PHP. So while you can use FTP or other means to manually upload a `.env` file into Azure, you can just specify the variables
   > you want as Azure app settings without a `.env` in Azure, like you just did. Furthermore, if a variable is in both a `.env` file 
   > and in Azure app settings, the Azure app setting wins.     
   > 
   > 
4. The last two tasks (setting the virtual directory and enabling Composer) requires the [Azure portal](https://portal.azure.com), so log in to 
   the [portal](https://portal.azure.com) with your Azure account.
5. Starting from the left menu, click **App Services** > **&lt;app_name>** > **Extensions**.
   
    ![Enable Composer for your PHP (Laravel) app in Azure](./media/app-service-web-php-get-started/configure-composer-tools.png)
   
6. Click **Add** to add an extension.
7. Select **Composer** in the **Choose extension** [blade](../azure-resource-manager/resource-group-portal.md#manage-resources) (*blade*: a portal page that opens horizontally).
8. Click **OK** in the **Accept legal terms** [blade](../azure-resource-manager/resource-group-portal.md#manage-resources). 
9. Click **OK** in the **Add extension** [blade](../azure-resource-manager/resource-group-portal.md#manage-resources).
   
    When Azure is done adding the extension, you should see a friendly pop-up message in the corner, as well as 
    **Composer** listed in the **Extensions** [blade](../azure-resource-manager/resource-group-portal.md#manage-resources).
   
    ![Extensions blade after enabling Composer for your PHP (Laravel) app in Azure](./media/app-service-web-php-get-started/configure-composer-end.png)
   
    You're done enabling Composer!
10. Back in your web app's [resource blade](../azure-resource-manager/resource-group-portal.md#manage-resources), click **Application Settings**.
    
     ![Access Settings blade to set virtual directory for your PHP (Laravel) app in Azure](./media/app-service-web-php-get-started/configure-virtual-dir-settings.png)
    
     In the **Application Settings** [blade](../azure-resource-manager/resource-group-portal.md#manage-resources), note the PHP version you set earlier:
    
     ![PHP version in Settings blade for your PHP (Laravel) app in Azure](./media/app-service-web-php-get-started/configure-virtual-dir-settings-a-cli2.png)
    
     and the app settings you added:
    
     ![App settings in Settings blade for your PHP (Laravel) app in Azure](./media/app-service-web-php-get-started/configure-virtual-dir-settings-b.png)
11. Scroll to the bottom of the [blade](../azure-resource-manager/resource-group-portal.md#manage-resources) and change the root virtual directory to point to **site\wwwroot\public** instead of **site\wwwroot**.
    
     ![Set virtual directory for your PHP (Laravel) app in Azure](./media/app-service-web-php-get-started/configure-virtual-dir-public.png)
12. Click **Save** at the top of the [blade](../azure-resource-manager/resource-group-portal.md#manage-resources).
    
     You're done setting the virtual directory! 

## Deploy your web app with Git (and setting environment variables)
You're ready to deploy your code now. You'll do this back in your command prompt or terminal.

1. Push your code to the Azure web app like you would for any Git repository:
   
        git push azure master 
   
    When prompted, use the credentials you created earlier.

2. Let's see it run in the browser by running this command:
   
        az appservice web browse --name <app_name> --resource-group my-php-app-group
   
    Your browser should show you the Laravel splash screen.
   
    ![Laravel splash screen after deploying web app to Azure](./media/app-service-web-php-get-started/laravel-azure-splash-screen.png)
   
    Congratulations, you are now running a Laravel web app in Azure.

## Troubleshoot common errors
Here are some the errors you might run into when following this tutorial:

* [Azure CLI shows "'site' is not an azure command"](#clierror)
* [Web app shows HTTP 403 error](#http403)
* [Web app shows "Whoops, looks like something went wrong."](#whoops)
* [Web app shows "No supported encryptor found."](#encryptor)

<a name="clierror"></a>

### Azure CLI shows "'site' is not an azure command"
When running `azure site *` in the command-line terminal, you see the error `error:   'site' is not an azure command. See 'azure help'.` 

This is usually a result of switching in to "ARM" (Azure Resource Manager) mode. To resolve this, switch back into "ASM" (Azure Service
Management) mode by running `azure config mode asm`.

<a name="http403"></a>

### Web app shows HTTP 403 error
You have deployed your web app to Azure successfully, but when you browse to your Azure web app, you get an `HTTP 403` or 
`You do not have permission to view this directory or page.`

This is most likely because the web app can't find the entry point to the Laravel app. Make sure that you have changed the
root virtual directory to point to `site\wwwroot\public`, where Laravel's `index.php` is (see 
[Configure the Azure web app](#configure)).

<a name="whoops"></a>

### Web app shows "Whoops, looks like something went wrong."
You have deployed your web app to Azure successfully, but when you browse to your Azure web app, you get the cryptic message 
`Whoops, looks like something went wrong.`

To get a more descriptive error, enable Laravel debugging by setting `APP_DEBUG` environment variable to `true` 
(see [Configure the Azure web app](#configure)).

<a name="encryptor"></a>

### Web app shows "No supported encryptor found."
You have deployed your web app to Azure successfully, but when you browse to your Azure web app, you get the error message 
below:

![APP_KEY missing in your PHP (Laravel) app in Azure](./media/app-service-web-php-get-started/laravel-error-APP_KEY.png)

That's a nasty error, but at least it's not cryptic since you turned on Laravel debugging. A cursory search of the error
string on the Laravel forums will show you that it is due to not setting the APP_KEY in `.env`, or in your case, not having 
`.env` in Azure at all. You can fix this by adding setting `APP_KEY` as an Azure app setting 
(see [Configure the Azure web app](#configure)).

## Next Steps
Learn how to add data to your app by [creating a MySQL database in Azure](../store-php-create-mysql-database.md). Also,
check out more helpful links for PHP in Azure below:

* [PHP Developer Center](/develop/php/)
* [Create a web app from the Azure Marketplace](app-service-web-create-web-app-from-marketplace.md)
* [Configure PHP in Azure App Service Web Apps](web-sites-php-configure.md)
* [Convert WordPress to Multisite in Azure App Service](web-sites-php-convert-wordpress-multisite.md)
* [Enterprise-class WordPress on Azure App Service](web-sites-php-enterprise-wordpress.md)

