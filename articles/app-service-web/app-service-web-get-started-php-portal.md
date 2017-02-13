---
title: Deploy a WordPress app in the Azure portal in five minutes | Microsoft Docs
description: Learn how easy it is to run web apps in App Service by deploying a WordPress app. Start doing real development quickly and see results immediately.
services: app-service\web
documentationcenter: ''
author: cephalin
manager: wpickett
editor: ''

ms.assetid: 6feac128-c728-4491-8b79-962da9a40788
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 02/13/2017
ms.author: cephalin

---
# Deploy a WordPress app in the Azure portal in five minutes

This tutorial shows you how to deploy your first [WordPress](https://wordpress.org/) web app to [Azure App Service](../app-service/app-service-value-prop-what-is.md) 
in minutes.

![WordPress site](./media/app-service-web-get-started-php-portal/wpdashboard.png)

## Prerequisites
You need a Microsoft Azure account. If you don't have an account, you can 
[sign up for a free trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F) or 
[activate your Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F).

> [!NOTE]
> You can [Try App Service](https://azure.microsoft.com/try/app-service/) without an Azure account. Create a starter app and play with
> it for up to an hour--no credit card required, no commitments.
> 
> 

## Deploy the WordPress app
1. Sign in to the [Azure portal](https://portal.azure.com).

2. Open [https://portal.azure.com/#create/WordPress.WordPress](https://portal.azure.com/#create/WordPress.WordPress).

    This link is a shortcut to immediately configure a new WordPress app in the Azure portal.

3. Type a unique name for the web app in the **App name** box. You will see a green checkmark in the box if the name is unique in the `azurewebsites.net` domain.
   
5. In **Resource Group**, click **Create new** create a new [resource group](../azure-resource-manager/resource-group-overview.md), then give your resource group a name.

6. In **Database Provider**, select [**MySQL in App (Preview)**].

    > [!NOTE]
    > For production WordPress, you want the **ClearDB** option to create a full-featured MySQL database instead. 

7. Click **App Service plan/Location** > **Create New** to create a new [App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md).

8. In **App Service plan**, type the desired name.

9. In **Location**, choose a location to host your plan.

10. Click **Pricing tier** and select **F1 Free**,

11. Click **Select**, then **OK**, then **Create**. 

    Azure now creates your WordPress app based on your configuration. You should see a **Deployment started...** notification.
   
## Launch and manage your WordPress web app

When Azure completes app deployment you see another notification.

![Deployment succeeded - first WordPress in Azure App Service](./media/app-service-web-get-started-php-portal/deployment-succeeded.png)

1. Click the notification.

    You should now see your web app's management [blade](../azure-resource-manager/resource-group-portal.md#manage-resources) (*blade*: a portal page that opens horizontally).

3. In the top of the Overview page, click **Browse**.
   
    ![Browse - first WordPress in Azure App Service](./media/app-service-web-get-started-php-portal/browse.png)

    Now you see the WordPress **Welcome** page. Configure the WordPress installation and start playing with it!

    ![WordPress configuration - first WordPress in Azure App Service](./media/app-service-web-get-started-php-portal/wordpress-config.png)
    
## Next steps
[Create, configure, and deploy a Laravel web app to Azure](app-service-web-php-get-started.md). By following this tutorial, you will learn
the basic skills you need to run any PHP web app in Azure, such as:

* Create and configure apps in Azure from PowerShell/Bash.
* Set PHP version.
* Use a start file that is not in the root application directory.
* Enable Composer automation.
* Access environment-specific variables.
* Troubleshoot common errors.

Or, do more with your first web app. For example:

* Try out [other ways to deploy your code to Azure](web-sites-deploy.md). For example, to deploy from one of your GitHub repositories, simply select
  **GitHub** instead of **Local Git Repository** in **Deployment options**.
* Take your Azure app to the next level. Authenticate your users. Scale it based on demand. Set up some performance alerts. All with a few clicks. See 
  [Add functionality to your first web app](app-service-web-get-started-2.md).
