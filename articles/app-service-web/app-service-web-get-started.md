<properties 
	pageTitle="Get started with web apps in Azure App Service" 
	description="Learn how easy it is to run your web app live in App Service. Start doing real development in 5 minutes and see results immediately." 
	services="app-service\web"
	documentationCenter=""
	authors="cephalin" 
	manager="wpickett" 
	editor="" 
/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="hero-article"
	ms.date="04/04/2016" 
	ms.author="cephalin"
/>
	
# Get started with web apps in Azure App Service

This tutorial helps you to get started quickly with deploying web apps to [Azure App Service](../app-service/app-service-value-prop-what-is.md). With little action on your 
part, you will: 

- Deploy a sample web app (choose between ASP.NET, PHP, Node.js, Java, or Python).
- See your app running live in seconds.
- Update your web app the same way you would push [Git](http://www.git-scm.com/) commits.

You'll also take a first glance at the [Azure portal](https://portal.azure.com) and survey the features available there. 

## Prerequisites

To complete this tutorial, you need:

- Git. You can download the installation binary [here](http://www.git-scm.com/downloads). You should be able to run `git --version` from the command-line terminal
of your choice. 
- Basic knowledge of Git.
- Azure CLI. Installation instructions are [here](../xplat-cli-install.md). You should be able to run `azure --version` from the command-line terminal
of your choice.
- A Microsoft Azure account. If you don't have an account, you can 
[sign up for a free trial](/pricing/free-trial/?WT.mc_id=A261C142F) or 
[activate your Visual Studio subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F).

>[AZURE.NOTE] To see Azure App Service in action before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751). There, 
you can immediately create a short-lived starter app in App Service—no credit card required, no commitments.

## Deploy a web app

Let's deploy a web app to Azure App Service. 

1. Open a new Windows command prompt, Linux shell, or OS X terminal and `CD` into a working directory and clone the sample app like so:

        git clone <github_sample_url>

    For *&lt;github_sample_url>*, use one of the following URLs, depending on the framework you like: 

    - ASP.NET: [https://github.com/Azure-Samples/app-service-web-dotnet-get-started.git](https://github.com/Azure-Samples/app-service-web-dotnet-get-started.git)
    - PHP (CodeIgniter): [https://github.com/Azure-Samples/app-service-web-php-get-started.git](https://github.com/Azure-Samples/app-service-web-php-get-started.git)
    - Node.js (Express): [https://github.com/Azure-Samples/app-service-web-nodejs-get-started.git](https://github.com/Azure-Samples/app-service-web-nodejs-get-started.git) 
    - Java: [https://github.com/Azure-Samples/app-service-web-java-get-started.git](https://github.com/Azure-Samples/app-service-web-java-get-started.git)
    - Python (Django): [https://github.com/Azure-Samples/app-service-web-python-get-started.git](https://github.com/Azure-Samples/app-service-web-python-get-started.git)

2. `CD` into the root directory of your sample app. For example, 

        cd app-service-web-dotnet-get-started

3. Log in to Azure like so:

        azure login
    
    Follow the prompt to continue the login in a browser with a Microsoft account that has your Azure subscription.

4. Create the App Service app resource in Azure with a unique app name with the next command.

        azure site create --git <app_name>
      
    >[AZURE.NOTE] If you've never set up deployment credentials for your Azure subscription, you'll be prompted to create them. These credentials, not your
    Azure account credentials, are used by App Service only for Git deployments and FTP logins. 
    
    Your app is created in Azure now. Also, your current directory is Git-initialized and connected to the new App Service app as a Git remote.
    You can browse to see the app URL (http://&lt;app_name>.azurewebsites.net) to see the beautiful default HTML page, but let's actually get your own code there now.

4. Now, deploy your sample code to the new App Service app like you would push any code with Git:

        git push azure master 
    
    >[AZURE.NOTE] You'll be asked for your deployment password. If you're new to App Service, give the deployment password you just created and you're on your way.
    
    `git push` not only puts code in Azure, but also triggers deployment tasks in the deployment engine. If you have any package.json 
    (Node.js) or requirements.txt (Python) in your project (repository) root, or if you have a packages.config in your ASP.NET project, the deployment 
    scripts restores the required packages for you. You can also [enable the Composer extension](web-sites-php-mysql-deploy-use-git.md#composer) to automatically process composer.json files
    in your PHP app.

Congratulations, you have deployed your app to Azure App Service. 

## See your app running live

To see your app running live in Azure, run this command from any directory in your repository:

    azure site browse

## Make updates to your app

You can now use Git to push from your project (repository) root anytime to make an update to the live site. You do it the same way as when you deployed your app to Azure 
for the first time. For example, every time you want to push a new change that you've tested locally, just run the following commands from your project 
(repository) root:
    
    git add .
    git commit -m "<your_message>"
    git push azure master

## Other ways to deploy

There are various ways you can deploy your web app, and Git deploy from a local repository is just one of them. You can deploy directly from
Visual Studio, continuously deploy from GitHub, sync from DropBox or OneDrive, upload files via FTP, etc. 
For more information on deployment options, see [Deploy your app to Azure App Service](../app-service-web/web-sites-deploy.md).

## See your app on the Azure portal

Now, let's go to the Azure portal to see what you created:

1. Log in to the [Azure portal](https://portal.azure.com) with a Microsoft account that has your Azure subscription.

2. On the left bar, click **App Services**.

3. Click the app that you just created to open its page in the portal (called a [blade](../azure-portal-overview.md)). The **Settings** blade is also opened by default for your convenience.

    ![Portal view of first app in Azure App Service](./media/app-service-web-get-started/portal-view.png) 

The portal blade of your App Service app surfaces a rich set of settings and tools for you to configure, monitor, and secure, and troubleshoot your app. Take a moment to 
familiarize yourself with this interface by performing some simple tasks:

- stop the app
- restart the app
- click the **Resource Group** link to see all the resources deployed in the resource group
- click **Settings** > **Properties** to see other information about your app
- click **Tools** to access useful tools for monitoring and troubleshooting  

## Next steps

Take the app you deployed to the next level. Secure it with authentication. Scale it based on demand. Set up some performance alerts. All with a few clicks. See 
[Get started with Azure App Service - Part 2](app-service-web-get-started-2.md).

Or, further explore how to create a web app for App Service with a specific language framework:

- [Create an ASP.NET web app in Azure App Service](web-sites-dotnet-get-started.md)
- [Create a PHP web app in Azure App Service](web-sites-php-mysql-deploy-use-git.md)
- [Create a Node.js web app in Azure App Service](web-sites-nodejs-develop-deploy-mac.md)
- [Create a Java web app in Azure App Service](web-sites-java-get-started.md)
- [Create a Python web app in Azure App Service](web-sites-python-ptvs-django-mysql.md)

Or, find more content on the range of apps you can build on Azure App Service, including web apps, mobile app backends, and API apps. 

- [Create web apps](/documentation/learning-paths/appservice-webapps/)
- [Create mobile apps](/documentation/learning-paths/appservice-mobileapps/)
- [Create API apps](../app-service-api/app-service-api-apps-why-best-platform.md)
