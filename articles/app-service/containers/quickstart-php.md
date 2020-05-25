---
title: 'Quickstart: Create a PHP app on Linux'
description: Get started with Linux apps on Azure App Service by deploying your first PHP app to a Linux container in App Service.
ms.assetid: 6feac128-c728-4491-8b79-962da9a40788
ms.topic: quickstart
ms.date: 05/25/2020
ms.custom: mvc, cli-validatem seodec18
---

# Create a PHP app in App Service on Linux

> [!NOTE]
> This article deploys an app to App Service on Linux. To deploy to App Service on _Windows_, see [Create a PHP app in Azure](../app-service-web-get-started-php.md).
>

[App Service on Linux](app-service-linux-intro.md) provides a highly scalable, self-patching web hosting service using the Linux operating system. This quickstart tutorial shows how to deploy a PHP app to Azure App Service on Linux using the [Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview).

![Sample app running in Azure](media/quickstart-php/hello-world-in-browser.png)

You can follow the steps in this article using a Mac, Windows, or Linux machine.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this quickstart:

* <a href="https://git-scm.com/" target="_blank">Install Git</a>
* <a href="https://php.net" target="_blank">Install PHP</a>

## Download the sample

In a terminal window, run the following commands to clone the sample application to your local machine, and navigate to the directory containing the sample code.

```bash
git clone https://github.com/Azure-Samples/php-docs-hello-world
cd php-docs-hello-world
```

## Run the app locally

Run the application locally so that you see how it should look when you deploy it to Azure. Open a terminal window and use the `php` command to launch the built-in PHP web server.

```bash
php -S localhost:8080
```

Open a web browser, and navigate to the sample app at `http://localhost:8080`.

You see the **Hello World!** message from the sample app displayed in the page.

![Sample app running locally](media/quickstart-php/localhost-hello-world-in-browser.png)

In your terminal window, press **Ctrl+C** to exit the web server.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Configure deployment user](../../../includes/configure-deployment-user.md)]

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group-linux.md)]

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux.md)]

## Create a web app

[!INCLUDE [Create web app](../../../includes/app-service-web-create-web-app-php-linux-no-h.md)] 

Browse to the site to see your newly created app with built-in image. Replace _&lt;app name>_ with your app name.

```bash
http://<app-name>.azurewebsites.net
```

Here is what your new app should look like:

![Empty app page](media/quickstart-php/app-service-web-service-created.png)

[!INCLUDE [Push to Azure](../../../includes/app-service-web-git-push-to-azure.md)] 

<pre>
Counting objects: 26, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (23/23), done.
Writing objects: 100% (26/26), 4.95 KiB | 0 bytes/s, done.
Total 26 (delta 9), reused 0 (delta 0)
remote: Deploy Async
remote: Updating branch 'master'.
remote: Updating submodules.
remote: Preparing deployment for commit id 'df425ea6ef'.
remote: Repository path is /home/site/repository
remote: Running oryx build...
remote: Build orchestrated by Microsoft Oryx, https://github.com/Microsoft/Oryx
remote: You can report issues at https://github.com/Microsoft/Oryx/issues
remote: .
remote: .
remote: .
remote: Deployment successful.
remote: Deployment Logs : 'https://&lt;app-name&gt;.scm.azurewebsites.net/newui/jsonviewer?view_url=/api/deployments/.../log'
To https://&lt;app-name&gt;.scm.azurewebsites.net/&lt;app-name&gt;.git
 * [new branch]      master -> master
</pre>

## Browse to the app

Browse to the deployed application using your web browser.

```bash
http://<app-name>.azurewebsites.net
```

The PHP sample code is running in App Service on Linux with built-in image.

![Sample app running in Azure](media/quickstart-php/hello-world-in-browser.png)

**Congratulations!** You've deployed your first PHP app to App Service on Linux.

## Update locally and redeploy the code

In the local directory, open the `index.php` file within the PHP app, and make a small change to the text within the string next to `echo`:

```php
echo "Hello Azure!";
```

Commit your changes in Git, and then push the code changes to Azure.

```bash
git commit -am "updated output"
git push azure master
```

Once deployment has completed, switch back to the browser window that opened in the **Browse to the app** step, and refresh the page.

![Updated sample app running in Azure](media/quickstart-php/hello-azure-in-browser.png)

## Manage your new Azure app

Go to the <a href="https://portal.azure.com" target="_blank">Azure portal</a> to manage the app you created.

From the left menu, click **App Services**, and then click the name of your Azure app.

![Portal navigation to Azure app](./media/quickstart-php/php-docs-hello-world-app-service-list.png)

You see your app's Overview page. Here, you can perform basic management tasks like browse, stop, start, restart, and delete.

![App Service page in Azure portal](media/quickstart-php/php-docs-hello-world-app-service-detail.png)

The left menu provides different pages for configuring your app. 

[!INCLUDE [cli-samples-clean-up](../../../includes/cli-samples-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: PHP app with MySQL](tutorial-php-mysql-app.md)

> [!div class="nextstepaction"]
> [Configure PHP app](configure-language-php.md)
