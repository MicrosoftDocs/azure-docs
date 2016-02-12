<properties 
	pageTitle="Get started with Azure App Service" 
	description="Get started with Azure App Service" 
	services="app-service"
	documentationCenter=""
	authors="cephalin" 
	manager="wpickett" 
	editor="" 
/>

<tags 
	ms.service="app-service" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/11/2016" 
	ms.author="cephalin"
/>
	
# Get started with Azure App Service

## Deploy a web app

First, let's quickly deploy a sample application to Azure App Service. 

1. Log into the [Azure portal](https://portal.azure.com) with a Microsoft account that has your Azure subscription.

1. Click on any one of the app samples below to deploy it to Azure App Service. If you have not yet logged into your Azure subscription, you will be redirected 
to the login page.

    - [**Deploy a simple HTML site**](https://deploy.azure.com/?repository=https://github.com/BlackrockDigital/startbootstrap-business-casual) - an open-source HTML 
    and [Bootstrap](https://getbootstrap.com/) template designed by [Start Bootstrap](https://startbootstrap.com/). This is a simple example that shows how 
    a basic app runs in App Service, with HTML, CSS, and image files.  
<!--        ![](./media/app-service-get-start/deploy-html-site.png) -->
    - [**Deploy a WordPress app**](https://deploy.azure.com/?repository=https://github.com/cephalin/WordPress), the most popular open-source content
    management system (CMS) based on PHP and MySQL. The deployed app is the default [WordPress blogging engine](https://github.com/WordPress/WordPress), with a 
    [custom deployment template](https://github.com/cephalin/WordPress/blob/master/azuredeploy.json) in the GitHub repository that custom-deploys a MySQL database 
    along with the app and simple 
    [configuration changes](https://github.com/cephalin/WordPress/blob/master/wp-config.php) to enable database access from the App Service app.  
<!--        ![](./media/app-service-get-start/deploy-wordpress-app.png) -->
    - [**Deploy the default app from MEAN.JS**](https://deploy.azure.com/?repository=https://github.com/cephalin/mean), an open-source MEAN 
    (MongoDB, Express, AngularJS, and Node.js) framework. The default codebase contains a CRUD sample and a chat sample. It lacks user-defined settings for social 
    login, but you can still use the manual sign-up/login UI. A [custom deployment template](https://github.com/cephalin/mean/blob/master/azuredeploy.json) in the GitHub
    repository custom-deploys a 
    MongoDB database to enable database access from the App Service app.  
<!--        ![](./media/app-service-get-start/deploy-mean-app.png) -->
    - [**Deploy the ContosoMoments app**](https://deploy.azure.com/?repository=https://github.com/azure-appservice-samples/ContosoMoments), a multi-channel photo sharing
    app built 
    with [Xamarin Platform for Visual Studio](https://xamarin.com/platform) that includes both web and native client apps. It brings together multiple components
    in Azure to enable the end-to-end scenario, including App Service (with WebJobs), SQL Database, Storage, and push notification with Notification Service. 
    A [custom deployment template](https://github.com/azure-appservice-samples/ContosoMoments/blob/master/azuredeploy.json) in the GitHub repository performs the complex 
    deployment for everything except
    for the native Windows Phone/iOS/Android apps themselves. 

2. Accept the default parameters as you desire and click **Next**. In most cases, the deployment template already defines default values for the parameters, 
or [https://deploy.azure.com](https://deploy.azure.com) may generate one. For some apps, you also need to supply a database password to use because the 
deployment template requires one.  
   ![](./media/app-service-get-start/deploy-contosomomemnts-app-config.png) 

3. Click **Deploy** to start the deploying to Azure.  
   ![](./media/app-service-get-start/deploy-contosomomemnts-app-deploy.png) 

4. Once deployment is finished, you can click the link for the app to browse to it, or click **Manage** to view and manage it in the Azure portal.  
   ![](./media/app-service-get-start/deploy-contosomomemnts-app-done.png) 

Congratulations! You have just deployed your first app to Azure App Service!

Click the **Manage** link to open the app's blade in the Azure portal.

![](./media/app-service-get-start/social-login-start.png) 

Your App Service app's blade surfaces a rich set of settings and tools for you to configure, monitor, and secure, and troubleshoot your app. Take a moment to 
familiarize yourself with this interface by performing some simple tasks:

- stop the app
- restart the app
- click the **Resource Group** link to see all the resources deployed in the resource group
- click **Settings** > **Properties** to see other information about your app

![](./media/app-service-get-start/social-login-portal.png)

>[AZURE.NOTE] The deployement method demonstrated here is [https://deploy.azure.com](https://deploy.azure.com), which deploys a [GitHub](https://github.com)-hosted 
repository to Azure App Service with or without a custom deployment template. This method makes it possible and easy for you to continously publish your app to Azure. 
There are many other ways to deploy your app to App Service, such as Visual Studio, 
Team Foundation Server, Git, and FTP. For example, the easiest way for ASP.NET developers to get started is with the .NET Azure SDK, which 
gives you a simple and intuitive tool to help you provision the App Service resources *everytime you create an ASP.NET project* in Visual Studio. For 
more information on deployment options, see [Deploy your app to Azure App Service](../app-service/web/web-sites-deploy.md).

## Authenticate your users

Now, let's see how easy it is to add authentication to your app. Assuming that you have deployed 
[the first sample app](https://github.com/BlackrockDigital/startbootstrap-business-casual): 

1. In your app's blade, that you just opened, click **Settings** > **Authentication / Authorization**.  
   ![](./media/app-service-get-start/social-login-settings.png)
    
2. Click **On** to turn on authentication.  
    ![](./media/app-service-get-start/social-login-auth-on.png)
    
4. In **Authentication Providers**, click **Azure Active Directory**.  
    ![](./media/app-service-get-start/aad-login-config.png)

5. In the **Azure Active Directory Settings** blade, click **Express**, then click **OK**. The default settings will create a new Azure AD application in
your default directory.  
    ![](./media/app-service-get-start/aad-login-express.png)

6. Click **Save**.  
    ![](./media/app-service-get-start/aad-login-save.png)

    Once the change is successful, you'll see the green notification bell turn green.

7. Back in your app's main blade, click the **URL** link (or **Browse** in the menu bar). Note that the link is an HTTP address.  
    ![](./media/app-service-get-start/aad-login-browse-click.png)  
    But once it opens the app in a new tab, the URL box redirects several times and finishes on your app with an HTTPS address. What you're seeing is that
    you're already logged into the Microsoft account with your Azure subscription, and you're automatically logged into the app using that account.  
    ![](./media/app-service-get-start/aad-login-browse-http-postclick.png)  
    So if you now open another browser (to ensure that you're not already logged in), you'll see a login screen when you navigate to the same app's URL:
    ![](./media/app-service-get-start/aad-login-browse.png)
    If you've never done anything with Azure Active Directory, your default directory might not have any Azure AD users. In that case, probably the only account
    in there is the Microsoft account with you Azure subscription, which is why you could be automatically logged into the app in the same browser earlier. 
    You can use that same Microsoft account to log in on this login page as well.

Congratulations! In a few click you were able to secure your app by enabling authentication with Azure Active Directory!

You may have noticed in the **Authentication / Authorization** blade that you can do a lot more, such as:

- Enable social login
- Enable multiple login options
- Change the default behavior when users first navigate to your app

App Service provides a turn-key solution for some of the common authentication needs so you don't need to provide the authentication logic yourself. 
For more information, see [...](https://something).

## Scale your app up and out

Next, let's scale your app. You scale your App Service app in two ways:

- [Scale up](https://en.wikipedia.org/wiki/Scalability#Horizontal_and_vertical_scaling): When you scale up an App Service app, you change the pricing
tier of the App Service plan the app belongs to. In additional to more CPU, memory, and disk space, scaling up gives you additional features, such 
as dedicated VM instances, autoscaling, SLA of 99.95%, custom domains, custom SSL certificates, deployment slots, backup and restore, and much more. 
Higher tiers provide more features to your App Service app.    
- [Scale out](https://en.wikipedia.org/wiki/Scalability#Horizontal_and_vertical_scaling): When you scale out an App Service app, you change the number 
of VM instances your app (or apps in the same App Service plan) runs on. With Standard tier or above, you can enable autoscaling of VM instances based
on performance metrics. 

Without further ado, let's set up autoscaling for your app.

1. First, let's scale up to enable autoscaling. In your app's blade, click **Settings** > **Scale Up (App Service Plan)**.  
    ![](./media/app-service-get-start/scale-up-settings.png)

2. Scroll and select the **S1 Standard** tier, the lowest tier that supports autoscaling (circled below), then click **Select**.  
    ![](./media/app-service-get-start/scale-up-select.png)

    You're done scaling up!
    
3. Next, let's configure autoscaling. In your app's blade, click **Settings** > **Scale Out (App Service Plan)**.  
    ![](./media/app-service-get-start/scale-out-settings.png)

4. Change **Scale by** to **CPU Percentage**. The sliders underneath the dropdown will change accordingly. Then, define a **Target range** between 
**40** and **80**, either by typing in the boxes on the side or by moving the sliders in the middle.  
    ![](./media/app-service-get-start/scale-out-configure.png)
    
    Based on this configuration, your app will automatically scale out (to the maximum of 10 instances) when CPU utilization is above 80% and 
    scale in (to the minimum of 1 instance) when CPU utilization is below 40%. 
    
5. Click **Save** in the menu bar.

Congratulations! You're done autoscaling your app!

You may have noticed in the **Scale Settings** blade that you can do a lot more, such as:

- Scale to a specific number of instances manually
- Scale by additional performance metrics, such as memory percentage or disk queue
- Customize scaling behavior when a performance rule is triggered
- Autoscale on a schedule
- Set autoscaling behavior for a future event

For more information on scaling up your app, see [Scale pricing tier in Azure App Service](app-service-scale.md). For more information on
scaling out, see [Scale instance count manually or automatically](../application-insights/insights-how-to-scale.md).

