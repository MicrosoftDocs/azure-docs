---
title: Create a Ruby web app in a Linux container in Azure | Microsoft Docs
description: Learn to create Ruby apps with Azure web wpp on Linux.
keywords: azure app service, linux, oss, ruby
services: app-service
documentationcenter: ''
author: wesmc7777
manager: syntaxc4
editor: ''

ms.assetid: 6d00c73c-13cb-446f-8926-923db4101afa
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 08/30/2017
ms.author: wesmc;rachelap;cephalin
---
# Create a Ruby web app in a Linux container in Azure

[Web Apps for Containers](app-service-linux-intro.md) provides a highly scalable, self-patching web hosting service using the Linux operating system. This quickstart shows you how to you deploy a basic Ruby on Rails app to Azure Web Apps for Containers. You create the web app using the [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli), and you use Git to deploy the Ruby code to the web app.

![Hello-world](./media/quickstart-ruby/hello-world-updated.png)

You can follow the steps below using a Mac or Linux machine. 

## Prerequisites

* [Install Ruby 2.4.1 or higher](https://www.ruby-lang.org/en/documentation/installation/#rubyinstaller).
* [Install Git](https://git-scm.com/downloads).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Download the sample

In a terminal window on your machine, run the following command to clone the sample app repository to your local machine:

```bash
git clone https://github.com/Azure-Samples/ruby-docs-hello-world
cd ruby-docs-hello-world
```

## Run the app locally

Start the rails server.

```bash
bin/rails server
```
	
Using your web browser, navigate to `http://localhost:3000` to test the app locally.	

![Hello-world](./media/quickstart-ruby/hello-world-configured.png)

In your terminal window, press **Ctrl+C** to exit the web server.

[!INCLUDE [Try Cloud Shell](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Configure deployment user](../../../includes/configure-deployment-user.md)]

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group.md)]

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux.md)]

## Create a web app

Create a [web app](../../app-service-web/app-service-web-overview.md) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp#create) command. Don't forget to replace `<app name>` with a unique app name.

The runtime in the following command is set to `ruby|2.3`. To see all supported runtimes, run [az webapp list-runtimes](/cli/azure/webapp#list-runtimes). 

```azurecli-interactive
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app name> --runtime "ruby|2.3" --deployment-local-git
```

[!INCLUDE [Create web app](../../../includes/app-service-web-create-web-app-result.md)] 

![Splash page](./media/quickstart-ruby/splash-page.png)

You’ve created an empty new web app in a Linux container, with git deployment enabled.

[!INCLUDE [Push to Azure](../../../includes/app-service-web-git-push-to-azure.md)] 

```bash
...
remote: Using actionpack 5.1.2
remote: Using actioncable 5.1.2
remote: Using actionmailer 5.1.2
remote: Using railties 5.1.2
remote: Using sprockets-rails 3.2.0
remote: Using coffee-rails 4.2.2
remote: Installing web-console 3.5.1
remote: Using rails 5.1.2
remote: Using sass-rails 5.0.6
remote: Bundle complete! 13 Gemfile dependencies, 66 gems now installed.
remote: Bundled gems are installed into /tmp/bundle.
remote: Zipping up bundle contents
remote: ......
remote: ~/site/repository
remote: Finished successfully.
remote: Running post deployment command(s)...
remote: Deployment successful.
remote: App container will begin restart within 10 seconds.
To https://<app name>.scm.azurewebsites.net/<app name>.git
   2267282..bc29d1f  master -> master
```

## Browse to the app locally

As shown in the console message when deployment finishes, wait 10 seconds for the app container to restart. 

Browse to the deployed application using your web browser.

```bash
http://<app_name>.azurewebsites.net
```

The Ruby sample code is running in an Azure App Service web app.

![updated web app](./media/quickstart-ruby/hello-world-updated.png)

**Congratulations!** You've deployed your first PHP app to App Service.

## Update locally and redeploy the code

Using a local text editor, open the `app/controllers/application_controller.rb` file within the PHP app, and make a small change to the text within the string next to `echo`:

```php
render html: "Hello Azure!"
```

Commit your changes in Git, and then push the code changes to Azure.

```bash
git commit -am "updated output"
git push azure master
```

Once deployment has completed, switch back to the browser window that opened in the **Browse to the app** step, and refresh the page.

![Updated sample app running in Azure](media/quickstart-ruby/hello-world-updated-azure.png)

## Manage your new Azure web app

Go to the <a href="https://portal.azure.com" target="_blank">Azure portal</a> to manage the web app you created.

From the left menu, click **App Services**, and then click the name of your Azure web app.

![Portal navigation to Azure web app](./media/quickstart-php/php-docs-hello-world-app-service-list.png)

You see your web app's Overview page. Here, you can perform basic management tasks like browse, stop, start, restart, and delete.

![App Service page in Azure portal](media/quickstart-php/php-docs-hello-world-app-service-detail.png)

The left menu provides different pages for configuring your app. 

[!INCLUDE [cli-samples-clean-up](../../../includes/cli-samples-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [Map an existing custom DNS name to Azure Web Apps](../../app-service-web/app-service-web-tutorial-custom-domain.md)
