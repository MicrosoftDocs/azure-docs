<properties
	pageTitle="Create an ASP.NET web app in Azure App Service"
	description="This tutorial shows you how to create an ASP.NET web project in Visual Studio 2013 and deploy it to a web app in Azure App Service. In less than 15 minutes you'll have an app up and running in the cloud."
	services="app-service\web"
	documentationCenter=".net"
	authors="tdykstra"
	manager="wpickett"
	editor="jimbe"/>

<tags
	ms.service="app-service-web"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="hero-article" 
	ms.date="06/26/2015"
	ms.author="tdykstra"/>

# Create an ASP.NET web app in Azure App Service

## Overview

This tutorial shows how to create an ASP.NET web application and deploy it to [App Service Web Apps](app-service-web-overview.md) by using Visual Studio 2015 or Visual Studio 2013. The tutorial assumes that you have no prior experience using Azure or ASP.NET. On completing the tutorial, you'll have a simple web application up and running in the cloud.

The following illustration shows the completed application:

![Web app home page](./media/web-sites-dotnet-get-started/deployedandazure.png)

You'll learn:

* How to enable your machine for Azure development by installing the Azure SDK.
* How to create a Visual Studio ASP.NET web project and deploy it to an Azure web app.
* How to make a change to the web project and redeploy the application.
* How to use the [Azure preview portal](/overview/preview-portal/) to monitor and manage your web app.

##<a name="video"></a>Sign up for Microsoft Azure

You need an Azure account to complete this tutorial:

* You can [open an Azure account for free](/pricing/free-trial/?WT.mc_id=A261C142F) - You get credits you can use to try out paid Azure services, and even after the credits are used up you can keep the account and use free Azure services, such as App Service Web Apps.
* You can [activate MSDN subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F) - Your MSDN subscription gives you credits every month that you can use for paid Azure services.

In this video, Scott Hanselman shows how easy it is to sign-up for a free trial of Microsoft Azure. (Duration: 1:58)

> [AZURE.VIDEO sign-up-for-microsoft-azure]

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

[AZURE.INCLUDE [install-sdk-2015-2013](../../includes/install-sdk-2015-2013.md)]

## Create an ASP.NET web application

Your first step is to create a web project in Visual Studio and a web app in Azure App Service. When that's done, you'll deploy the project to the web app to make it available on the Internet. 

The diagrams illustrate what you're doing in the create and deploy steps.

![Create](./media/web-sites-dotnet-get-started/Create_App.png)

![Deploy](./media/web-sites-dotnet-get-started/Deploy_App.png)

1. Open Visual Studio 2015 or Visual Studio 2013. 

	If you use Visual Studio 2013, the screens will be slightly different from the screenshots, but the procedures are essentially the same.

2. From the **File** menu, click **New > Project**.

3. In the **New Project** dialog box, click **C#** > **Web** > **ASP.NET Web Application**. If you prefer, you can choose **Visual Basic**.

3. Make sure that **.NET Framework 4.5.2** is selected as the target framework.

4.  [Application Insights](app-insights-overview.md) monitors your web app for availability, performance, and usage. Clear the **Add Application Insights to Project** check box if you don't want to try it.

4. Name the application **MyExample**.

5. Click **OK**.

	![New Project dialog box](./media/web-sites-dotnet-get-started/GS13newprojdb.png)

5. In the **New ASP.NET Project** dialog box, select the **MVC** template. If you prefer to work with ASP.NET Web Forms, you can select the **Web Forms** template.

	[MVC and Web Forms](http://www.asp.net/get-started/websites) are ASP.NET frameworks for developing web apps. For this tutorial you can choose either one, but if you choose Web Forms, you'll have to edit *Default.aspx* later where the tutorial instructs you to edit *Index.cshtml*.

7. Click **Change Authentication**.

	![New ASP.NET Project dialog box](./media/web-sites-dotnet-get-started/GS13changeauth.png)

6. In the **Change Authentication** dialog box, click **No Authentication**, and then click **OK**.

	![No Authentication](./media/web-sites-dotnet-get-started/GS13noauth.png)

	The sample application you're creating won't enable users to log in. The [Next Steps](#next-steps) section links to a tutorial that implements authentication and authorization.

5. In the **New ASP.NET Project** dialog box, leave the settings under **MicrosoftAzure** unchanged, and then click **OK**.

	![New ASP.NET Project dialog box](./media/web-sites-dotnet-get-started/GS13newaspnetprojdb.png)

	The default settings specify that Visual Studio will create an Azure web app for your web project. In the next section of the tutorial you'll deploy the web project to the newly created web app.

5. If you haven't already signed in to Azure, Visual Studio prompts you to do so. Sign in with the ID and password of the account that you use to manage your Azure subscription.

	When you're signed in, the **Configure Microsoft Azure Web App Settings** dialog box asks you what resources you want to create.

	![Signed in to Azure](./media/web-sites-dotnet-get-started/configuresitesettings.png)

3. In the **Configure Microsoft Azure Web App Settings** dialog box, enter a **Web App name** that is unique in the *azurewebsites.net* domain. For example, you can name it MyExample with numbers to the right to make it unique, such as MyExample810. If a default web name is created for you, it will be unique and you can use that. 

	If someone else has already used the name you enter, you'll see a red exclamation mark to the right instead of a green check mark, and you'll need to enter a different name. 

	Azure will use this name as the prefix for your application's URL. The complete URL will consist of this name plus *.azurewebsites.net* (as shown next to the **Web App name** text box). For example, if the name is `MyExample810`, the URL will be `MyExample810.azurewebsites.net`. The URL has to be unique. 

4. In the **App Service plan** drop-down, select **Create new App Service plan**.

	The [Next steps](#next-steps) section at the end of the tutorial has links to information about App Service plans.

5. Enter *MyExamplePlan*, or another name if you prefer, for the plan name.

6. In the **Resource group** drop-down, select **Create new resource group**.

	The [Next steps](#next-steps) section has links to information about resource groups.

5. Enter *MyExampleGroup*, or another name if you prefer, for the resource group name.

5. In the **Region** drop-down list, choose the location that is closest to you.

	This setting specifies which Azure data center your web app will run in. For this tutorial you can select any region and it won't make a noticeable difference, but for a production web app you want your web server to be as close as possible to the browsers accessing your site in order to minimize [latency](http://www.bing.com/search?q=web%20latency%20introduction&qs=n&form=QBRE&pq=web%20latency%20introduction&sc=1-24&sp=-1&sk=&cvid=eefff99dfc864d25a75a83740f1e0090).

5. Leave the database field unchanged.

	For this tutorial you aren't using a database. The [Next steps](#next-steps) section links to a tutorial that shows how to use a database.

6. Click **OK**.

	![](./media/web-sites-dotnet-get-started/configuresitesettings2.png)

	In a few seconds, Visual Studio creates the web project in the folder you specified, and it creates the web app in the Azure region you specified.  

	The **Solution Explorer** window shows the files and folders in the new project.

	![Solution Explorer](./media/web-sites-dotnet-get-started/solutionexplorer.png)

	The **Azure App Service Activity** window shows that the web app has been created.

	![Web app created](./media/web-sites-dotnet-get-started/GS13sitecreated1.png)

	And you can see the web app in **Server Explorer**.

	![Web app created](./media/web-sites-dotnet-get-started/siteinse.png)

## Deploy the application to Azure

7. In the **Azure App Service Activity** window, click **Publish MyExample to this Web App now**.

	![Web app created](./media/web-sites-dotnet-get-started/GS13sitecreated.png)

	In a few seconds the **Publish Web** wizard appears.

	Settings that Visual Studio needs to deploy your project to Azure have been saved in a *publish profile*. The wizard enables you to review and change those settings.

8. In the **Connection** tab of the **Publish Web** wizard, click **Next**.

	Visual Studio provides all the settings you need to deploy to your Azure web app.

	![Successfully validated connection](./media/web-sites-dotnet-get-started/GS13ValidateConnection.png)

10. In the **Settings** tab, click **Next**.

	You can accept the default values for **Configuration** and **File Publish Options**. 

	The **Configuration** drop-down enables you to deploy a Debug build for remote debugging. The [Next Steps](#next-steps) section links to a tutorial that shows how to run Visual Studio in debug mode remotely.

	![Settings tab](./media/web-sites-dotnet-get-started/GS13SettingsTab.png)

11. In the **Preview** tab, click **Publish**.

	If you want to see what files will be copied to Azure, you can click **Start Preview** before clicking **Publish**.

	![](./media/web-sites-dotnet-get-started/GS13previewoutput.png)

	Visual Studio begins the process of copying the files to the Azure server.

	The **Output** and **Azure App Service Activity** windows show what deployment actions were taken and report successful completion of the deployment.

	![Output window reporting successful deployment](./media/web-sites-dotnet-get-started/PublishOutput.png)

	Upon successful deployment, the default browser automatically opens to the URL of the deployed web app, and the application that you created is now running in the cloud. The URL in the browser address bar shows that the web app is being loaded from the Internet.

	![Web app running in Azure](./media/web-sites-dotnet-get-started/GS13deployedsite.png)

13. Close the browser.

## Make a change and redeploy

This section of the tutorial is optional. What you'll do is change the **h1** heading of the home page, run the project locally on your development computer to verify the change, and then deploy the change to Azure.

2. Open the *Views/Home/Index.cshtml* or *.vbhtml* file in **Solution Explorer**, change the **h1** heading from "ASP.NET" to "ASP.NET and Azure", and save the file.

	![MVC index.cshtml](./media/web-sites-dotnet-get-started/index.png)

	![MVC h1 change](./media/web-sites-dotnet-get-started/mvcandazure.png)

1. Press CTRL+F5 to see the updated heading by running the web app on your local computer.

	![Web app running locally](./media/web-sites-dotnet-get-started/localandazure.png)

	The `localhost` URL shows that it's running on your local computer. By default it's running in IIS Express, which is a lightweight version of IIS designed for use during web application development.

1. Close the browser.

1. In **Solution Explorer**, right-click the project, and choose **Publish**.

	![Chooose Publish](./media/web-sites-dotnet-get-started/choosepublish.png)

	The **Preview** tab of the **Publish Web** wizard appears. If you needed to change any publish settings you could choose a different tab, but now all you want to do is redeploy with the same settings.

2. In the **Publish Web** wizard, click **Publish**.

	![Click Publish](./media/web-sites-dotnet-get-started/GS13previewoutput.png)

	Visual Studio deploys the project to Azure and opens the web app in the default browser.

	![Changed web app deployed](./media/web-sites-dotnet-get-started/deployedandazure.png)

**Tip:** You can enable the **Web One Click Publish** toolbar for even quicker deployment. Click **View > Toolbars**, and then select **Web One Click Publish**. The toolbar enables you to select a profile, click a button to publish, or click a button to open the **Publish Web** wizard.

![Web One Click Publish Toolbar](./media/web-sites-dotnet-get-started/weboneclickpublish.png)

## Monitor and manage the web app in the management portal

The [Azure preview portal](/services/management-portal/) is a web interface that enables you to manage and monitor your Azure services, such as the web app you just created. In this section of the tutorial you look at some of what you can do in the portal.

1. In your browser, go to [https://portal.azure.com](), and sign in with your Azure credentials.

2. Click **Browse All > Web Apps**, then click the name of your web app.

	The **Web app** blade displays an overview of settings and usage statistics for your web app.

	![Web app blade](./media/web-sites-dotnet-get-started/portaldashboard.png)

	At this point your web app hasn't had much traffic and may not show anything in the graph. If you browse to your application, refresh the page a few times, and then refresh the portal page, you'll see some statistics show up.

3. Click **Settings** to see more options for configuring your web app.

	You see a list of types of settings.

	![](./media/web-sites-dotnet-get-started/portalconfigure1.png)

4. Click **Application settings** to see an example of the kinds of settings you can configure in the portal.

	For example, you can control the .NET version used for the web app, enable features such as [WebSockets](/blog/2013/11/14/introduction-to-websockets-on-windows-azure-web-sites/), set [connection string values](/blog/2013/07/17/windows-azure-web-sites-how-application-strings-and-connection-strings-work/), and more.

	![Portal web app configure tab](./media/web-sites-dotnet-get-started/portalconfigure2.png)

These are just a few of the management portal's features. You can create new web apps, delete existing web apps, stop and restart web apps, and manage other kinds of Azure services, such as databases and virtual machines.  

## Next steps

In this tutorial you've seen how to create a simple web application and deploy it to an Azure web app. Here are some related topics and resources for learning more about web apps in Azure App Service.

* Other ways to deploy a web project

	In this tutorial you saw the quickest way to create a web app and deploy it all in one operation. For an overview of other ways to deploy, by using Visual Studio or by [automating deployment](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/continuous-integration-and-continuous-delivery) from a [source control system](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/source-control), see [How to deploy an Azure web app](web-sites-deploy.md).

	Visual Studio can also generate Windows PowerShell scripts that enable you to automate deployment. For more information, see [Automate Everything (Building Real-World Cloud Apps with Azure)](http://www.asp.net/aspnet/overview/developing-apps-with-windows-azure/building-real-world-cloud-apps-with-windows-azure/automate-everything).

* How to manage a web app in Visual Studio

	For information about web app management functions that you can do in **Server Explorer**, see [Troubleshooting Azure web apps in Visual Studio](web-sites-dotnet-troubleshoot-visual-studio.md).

* How to troubleshoot a web app

	Visual Studio provides features that make it easy to view Azure logs as they are generated in real time. You can also run in debug mode remotely in Azure. For more information, see [Troubleshooting Azure web apps in Visual Studio](web-sites-dotnet-troubleshoot-visual-studio.md).

* How to add database and authorization functionality

	For a tutorial that shows how to access a database and restrict some application functions to authorized users, see [Deploy a secure ASP.NET MVC app with membership, OAuth, and SQL Database to an Azure web app](/develop/net/tutorials/web-site-with-sql-database/).

* How to add a custom domain name and SSL

	For information about how to use SSL and your own domain (for example www.contoso.com instead of contoso.azurewebsites.net), see the following resources:

	* [Configuring a custom domain name for an Azure Website](web-sites-custom-domain-name.md).
	* [Enable HTTPS for an Azure website](web-sites-configure-ssl-certificate.md)

* How to avoid wake-up wait time after idle time-outs

	By default, web apps are unloaded if they have been idle for some period of time. The first request after a web app has been unloaded has to wait for the web app to be reloaded. To avoid that wait time you can  enable the AlwaysOn feature. For more information, see configuration options in [How to configure web apps](web-sites-configure.md).

* How to add real-time features such as chat

	If your web app will include real-time features (such as a chat service, a game, a stock ticker, and so forth), you can get the best performance by using [ASP.NET SignalR](http://www.asp.net/signalr) with the [WebSockets](/blog/2013/11/14/introduction-to-websockets-on-windows-azure-web-sites/) transport method. For more information, see [Using SignalR with Azure web apps](http://www.asp.net/signalr/overview/signalr-20/getting-started-with-signalr-20/using-signalr-with-windows-azure-web-sites).

* How to choose between App Service, Cloud Services, and VMs for web applications

	In Azure you can run web applications in App Service Web Apps as shown in this tutorial, or in Cloud Services or in Virtual Machines. For more information, see [Azure web apps, cloud services, and VMs: When to use which?](/manage/services/web-sites/choose-web-app-service/).

* [How to choose or create an App Service plan](../app-service/azure-web-sites-web-hosting-plans-in-depth-overview.md)

* [How to choose or create a resource group](../azure-preview-portal-using-resource-groups.md)

## What's changed

* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)
* For a guide to the change of the old portal to the new portal see: [Reference for navigating the preview portal](http://go.microsoft.com/fwlink/?LinkId=529715)
 
