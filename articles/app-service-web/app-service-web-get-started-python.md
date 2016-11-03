---
title: Deploy your first Python web app to Azure in five minutes | Microsoft Docs
description: Learn how easy it is to run web apps in App Service by deploying a sample app. Start doing real development quickly and see results immediately.
services: app-service\web
documentationcenter: ''
author: cephalin
manager: wpickett
editor: ''

ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 10/13/2016
ms.author: cephalin

---
# Deploy your first Python web app to Azure in five minutes
This tutorial helps you deploy your first Python web app to [Azure App Service](../app-service/app-service-value-prop-what-is.md).
You can use App Service to create web apps, [mobile app back ends](/documentation/learning-paths/appservice-mobileapps/),
and [API apps](../app-service-api/app-service-api-apps-why-best-platform.md).

You will: 

* Create a web app in Azure App Service.
* Deploy sample Python code.
* See your code running live in production.
* Update your web app the same way you would [push Git commits](https://git-scm.com/docs/git-push).

## Prerequisites
* [Git](http://www.git-scm.com/downloads).
* [Azure CLI](../xplat-cli-install.md).
* A Microsoft Azure account. If you don't have an account, you can 
  [sign up for a free trial](/pricing/free-trial/?WT.mc_id=A261C142F) or 
  [activate your Visual Studio subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F).

> [!NOTE]
> You can [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751) without an Azure account. Create a starter app and play with
> it for up to an hour--no credit card required, no commitments.
> 
> 

## Deploy a Python web app
1. Open a new Windows command prompt, PowerShell window, Linux shell, or OS X terminal. Run `git --version` and `azure --version` to verify that Git and Azure CLI
   are installed on your machine.
   
    ![Test installation of CLI tools for your first web app in Azure](./media/app-service-web-get-started/1-test-tools.png)
   
    If you haven't installed the tools, see [Prerequisites](#Prerequisites) for download links.
2. Log in to Azure like this:
   
        azure login
   
    Follow the help message to continue the login process.
   
    ![Log in to Azure to create your first web app](./media/app-service-web-get-started/3-azure-login.png)
3. Change Azure CLI into ASM mode, then set the deployment user for App Service. You will deploy code using the credentials later.
   
        azure config mode asm
        azure site deployment user set --username <username> --pass <password>
4. Change to a working directory (`CD`) and clone the sample app like this:
   
        git clone https://github.com/Azure-Samples/app-service-web-python-get-started.git
5. Change to the repository of your sample app. For example:
   
        cd app-service-web-python-get-started
6. Create the App Service app resource in Azure with a unique app name and the deployment user you configured earlier. When you're prompted, specify the number of the desired region.
   
        azure site create <app_name> --git --gitusername <username>
   
    ![Create the Azure resource for your first web app in Azure](./media/app-service-web-get-started-languages/python-site-create.png)
   
    Your app is created in Azure now. Also, your current directory is Git-initialized and connected to the new App Service app as a Git remote.
    You can browse to the app URL (http://&lt;app_name>.azurewebsites.net) to see the beautiful default HTML page, but let's actually get your code there now.
7. Deploy your sample code to your Azure app like you would push any code with Git. When prompted, use the password you configured earlier.
   
        git push azure master
   
    ![Push code to your first web app in Azure](./media/app-service-web-get-started-languages/python-git-push.png)
   
    `git push` not only puts code in Azure, but also triggers deployment tasks in the deployment engine. 
    If you have any requirements.txt (Python) files in your project (repository) root, the deployment
    script restores the required packages for you. 

Congratulations, you have deployed your app to Azure App Service.

## See your app running live
To see your app running live in Azure, run this command from any directory in your repository:

    azure site browse

## Make updates to your app
You can now use Git to push from your project (repository) root anytime to make an update to the live site. You do it the same way as when you deployed your code
the first time. For example, every time you want to push a new change that you've tested locally, just run the following commands from your project 
(repository) root:

    git add .
    git commit -m "<your_message>"
    git push azure master

## Next steps
[Create, configure, and deploy a Django web app to Azure in Visual Studio](web-sites-python-ptvs-django-mysql.md). By following this tutorial, you will learn
the basic skills you need to run a Python web app in Azure, including:

* Create and deploy a Python app using a template.
* Set Python version.
* Create virtual environments.
* Connect to a database.

Or, do more with your first web app. For example:

* Try out [other ways to deploy your code to Azure](web-sites-deploy.md). For example, to deploy from one of your GitHub repositories, simply select
  **GitHub** instead of **Local Git Repository** in **Deployment options**.
* Take your Azure app to the next level. Authenticate your users. Scale it based on demand. Set up some performance alerts. All with a few clicks. See 
  [Add functionality to your first web app](app-service-web-get-started-2.md).

