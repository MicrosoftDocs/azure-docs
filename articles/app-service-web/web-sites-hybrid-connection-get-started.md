<properties 
	pageTitle="Access on-premises resources using hybrid connections in Azure App Service" 
	description="Create a connection between a web app in Azure App Service and an on-premises resource that uses a static TCP port" 
	services="app-service" 
	documentationCenter="" 
	authors="cephalin" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="app-service" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/03/2016" 
	ms.author="cephalin"/>

#Access on-premises resources using hybrid connections in Azure App Service

You can connect an Azure App Service app to any on-premises resource that uses a static TCP port, such as SQL Server, MySQL, HTTP Web APIs, and most custom Web Services. This article shows you how to create a hybrid connection between App Service and an on-premises SQL Server database.

> [AZURE.NOTE] The Web Apps portion of the Hybrid Connections feature is available only in the [Azure Portal](https://portal.azure.com). To create a connection in BizTalk Services, see [Hybrid Connections](http://go.microsoft.com/fwlink/p/?LinkID=397274). 
> 
> This content also applies to Mobile Apps in Azure App Service. 

## Prerequisites
- An Azure subscription. For a free subscription, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/). 
 
	If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

- To use an on-premises SQL Server or SQL Server Express database with a hybrid connection, TCP/IP needs to be enabled on a static port. Using a default instance on SQL Server is recommended because it uses static port 1433. For information on installing and configuring SQL Server Express for use with hybrid connections, see [Connect to an on-premises SQL Server from an Azure web site using Hybrid Connections](http://go.microsoft.com/fwlink/?LinkID=397979).

- The computer on which you install the on-premises Hybrid Connection Manager agent described later in this article:

	- Must be able to connect to Azure over port 5671
	- Must be able to reach the *hostname*:*portnumber* of your on-premises resource. 

> [AZURE.NOTE] The steps in this article assume that you are using the browser from the computer that will host the on-premises hybrid connection agent.


## Create a web app in the Azure Portal ##

> [AZURE.NOTE] If you have already created a web app or Mobile App backend in the Azure Portal that you want to use for this tutorial, you can skip ahead to [Create a Hybrid Connection and a BizTalk Service](#CreateHC) and start from there.

1. In the upper left corner of the [Azure Portal](https://portal.azure.com), click **New** > **Web + Mobile** > **Web App**.
	
	![New web app][NewWebsite]
	
2. On the **Web app** blade, provide a URL and click **Create**. 
	
	![Website name][WebsiteCreationBlade]
	
3. After a few moments, the web app is created and its web app blade appears. The blade is a vertically scrollable dashboard that lets you manage your site.
	
	![Website running][WebSiteRunningBlade]
	
4. To verify the site is live, you can click the **Browse** icon to display the default page.
	
	![Click browse to see your web app][Browse]
	
	![Default web app page][DefaultWebSitePage]
	
Next, you will create a hybrid connection and a BizTalk service for the web app.

<a name="CreateHC"></a>
## Create a Hybrid Connection and a BizTalk Service ##

1. In your web app blade click on **All settings** > **Networking** > **Configure your hybrid connection endpoints**.
	
	![Hybrid connections][CreateHCHCIcon]
	
2. On the Hybrid connections blade, click **Add**.
	
	<!-- ![Add a hybrid connnection][CreateHCAddHC]
-->
	
3. The **Add a hybrid connection** blade opens.  Since this is your first hybrid connection, the **New hybrid connection** option is preselected, and the **Create hybrid connection** blade opens for you.
	
	![Create a hybrid connection][TwinCreateHCBlades]
	
	On the **Create hybrid connection blade**:
	- For **Name**, provide a name for the connection.
	- For **Hostname**, enter the name of the on-premises computer that hosts your resource.
	- For **Port**, enter the port number that your on-premises resource uses (1433 for a SQL Server default instance).
	- Click **Biz Talk Service**


4. The **Create BizTalk Service** blade opens. Enter a name for the BizTalk service, and then click **OK**.
	
	![Create BizTalk service][CreateHCCreateBTS]
	
	The **Create BizTalk Service** blade closes and you are returned to the **Create hybrid connection** blade.
	
5. On the Create hybrid connection blade, click **OK**. 
	
	![Click OK][CreateBTScomplete]
	
6. When the process completes, the notifications area in the Portal informs you that the connection has been successfully created.
	<!--- TODO

    Everything fails at this step. I can't create a BizTalk service in the dogfood portal. I switch to the classic portal
	(full portal) and created the BizTalk service but it doesn't seem to let you connnect them - When you finish the
	Create hybrid conn step, you get the following error
	Failed to create hybrid connection RelecIoudHC. The 
	resource type could not be found in the namespace 
	'Microsoft.BizTaIkServices for api version 2014-06-01'.
	
	The error indicates it couldn't find the type, not the instance.
	![Success notification][CreateHCSuccessNotification]
	-->
7. On the web app's blade, the **Hybrid connections** icon now shows that 1 hybrid connection has been created.
	
	![One hybrid connection created][CreateHCOneConnectionCreated]
	
At this point, you have completed an important part of the cloud hybrid connection infrastructure. Next, you will create a corresponding on-premises piece.

<a name="InstallHCM"></a>
## Install the on-premises Hybrid Connection Manager to complete the connection ##

1. On the web app's blade, click **All settings** > **Networking** > **Configure your hybrid connection endpoints**. 
	
	![Hybrid connections icon][HCIcon]
	
2. On the **Hybrid connections** blade, the **Status** column for the recently added endpoint shows **Not connected**. Click the connection to configure it.
	
	![Not connected][NotConnected]
	
	The Hybrid connection blade opens.
	
	![NotConnectedBlade][NotConnectedBlade]
	
3. On the blade, click **Listener Setup**.
	
	![Click Listener Setup][ClickListenerSetup]
	
4. The **Hybrid connection properties** blade opens. Under **On-premises Hybrid Connection Manager**, choose **Click here to install**.
	
	![Click here to install][ClickToInstallHCM]
	
5. In the Application Run security warning dialog, choose **Run** to continue.
	
	![Choose Run to continue][ApplicationRunWarning]
	
6.	In the **User Account Control** dialog, choose **Yes**.
	
	![Choose Yes][UAC]
	
7. The Hybrid Connection Manager is downloaded and installed for you. 
	
	![Installing][HCMInstalling]
	
8. When the install completes, click **Close**.
	
	![Click Close][HCMInstallComplete]
	
	On the **Hybrid connections** blade, the **Status** column now shows **Connected**. 
	
	![Connected Status][HCStatusConnected]

Now that the hybrid connection infrastructure is complete, you can create a hybrid application that uses it. 

>[AZURE.NOTE]The following sections show you how to use a hybrid connection with a Mobile Apps .NET backend project.

## Configure the Mobile App .NET backend project to connect to the SQL Server database

In App Service, a Mobile Apps .NET backend project is just an ASP.NET web app with an additional Mobile Apps SDK installed and initialized. To use your web app as a Mobile Apps backend, you must [download and initialize the Mobile Apps .NET backend SDK](../app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#install-sdk).  

For Mobile Apps, you also need to define a connection string for the on-premises database and modify the backend to use this connection. 

1. In Solution Explorer in Visual Studio, open the Web.config file for your Mobile App .NET backend, locate the **connectionStrings** section, add a new SqlClient entry like the following, which points to the on-premises SQL Server database:

	    <add name="OnPremisesDBConnection"
         connectionString="Data Source=OnPremisesServer,1433;
         Initial Catalog=OnPremisesDB;
         User ID=HybridConnectionLogin;
         Password=<**secure_password**>;
         MultipleActiveResultSets=True"
         providerName="System.Data.SqlClient" />

	Remember to replace `<**secure_password**>` in this string with the password you created for  *HybridConnectionLogin*.

3. Click **Save** in Visual Studio to save the Web.config file.

	> [AZURE.NOTE]This connection setting is used when running on the local computer. When running in Azure, this setting is overriden by the connection setting defined in the portal.

4. Expand the **Models** folder and open the data model file, which ends in *Context.cs*.

6. Modify the **DbContext** instance constructor to pass the value `OnPremisesDBConnection` to the base **DbContext** constructor, similar to the following snippet:

        public class hybridService1Context : DbContext
        {
            public hybridService1Context()
                : base("OnPremisesDBConnection")
            {
            }
        }

	The service will now use the new connection to the SQL Server database.

## Update the Mobile App backend to use the on-premises connection string

Next, you need to add an app setting for this new connection string so that it can be used from Azure.  

1. Back in the [Azure portal](https://portal.azure.com) in the web app backend code for your Mobile App, click **All settings**, then **Application settings**.

3. In the **Web app settings** blade, scroll down to **Connection strings** and add an new **SQL Server** connection string named `OnPremisesDBConnection` with a value like `Server=OnPremisesServer,1433;Database=OnPremisesDB;User ID=HybridConnectionsLogin;Password=<**secure_password**>`.

	Replace `<**secure_password**>` with the secure password for your on-premises database.

	![Connection string for on-premises database](./media/web-sites-hybrid-connection-get-started/set-sql-server-database-connection.png)

2. Press **Save** to save the hybrid connection and connection string you just created.

At this point you can republish the server project and test the new connection with your existing Mobile Apps clients. Data will be read from and written to the on-premises database using the hybrid connection.

<a name="NextSteps"></a>
## Next Steps ##

- For information on creating an ASP.NET web application that uses a hybrid connection, see [Connect to an on-premises SQL Server from an Azure web site using Hybrid Connections](http://go.microsoft.com/fwlink/?LinkID=397979). 

### Additional Resources

[Hybrid Connections overview](http://go.microsoft.com/fwlink/p/?LinkID=397274)

[Josh Twist introduces hybrid connections (Channel 9 video)](http://channel9.msdn.com/Shows/Azure-Friday/Josh-Twist-introduces-hybrid-connections)

[Hybrid Connections web site](https://azure.microsoft.com/services/biztalk-services/)

[BizTalk Services: Dashboard, Monitor, Scale, Configure, and Hybrid Connection tabs](../biztalk-services/biztalk-dashboard-monitor-scale-tabs.md)

[Building a Real-World Hybrid Cloud with Seamless Application Portability (Channel 9 video)](http://channel9.msdn.com/events/TechEd/NorthAmerica/2014/DCIM-B323#fbid=)

[Connect to an on-premises SQL Server from Azure Mobile Services using Hybrid Connections (Channel 9 video)](http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Connect-to-an-on-premises-SQL-Server-from-Azure-Mobile-Services-using-Hybrid-Connections)

## What's changed
* For a guide to the change from Websites to App Service see: [Azure App Service and Its Impact on Existing Azure Services](http://go.microsoft.com/fwlink/?LinkId=529714)

<!-- IMAGES -->
[New]:./media/web-sites-hybrid-connection-get-started/B01New.png
[NewWebsite]:./media/web-sites-hybrid-connection-get-started/B02NewWebsite.png
[WebsiteCreationBlade]:./media/web-sites-hybrid-connection-get-started/B03WebsiteCreationBlade.png
[WebSiteRunningBlade]:./media/web-sites-hybrid-connection-get-started/B04WebSiteRunningBlade.png
[Browse]:./media/web-sites-hybrid-connection-get-started/B05Browse.png
[DefaultWebSitePage]:./media/web-sites-hybrid-connection-get-started/B06DefaultWebSitePage.png
[CreateHCHCIcon]:./media/web-sites-hybrid-connection-get-started/C01CreateHCHCIcon.png
[CreateHCAddHC]:./media/web-sites-hybrid-connection-get-started/C02CreateHCAddHC.png
[TwinCreateHCBlades]:./media/web-sites-hybrid-connection-get-started/C03TwinCreateHCBlades.png
[CreateHCCreateBTS]:./media/web-sites-hybrid-connection-get-started/C04CreateHCCreateBTS.png
[CreateBTScomplete]:./media/web-sites-hybrid-connection-get-started/C05CreateBTScomplete.png
[CreateHCSuccessNotification]:./media/web-sites-hybrid-connection-get-started/C06CreateHCSuccessNotification.png
[CreateHCOneConnectionCreated]:./media/web-sites-hybrid-connection-get-started/C07CreateHCOneConnectionCreated.png
[HCIcon]:./media/web-sites-hybrid-connection-get-started/D01HCIcon.png
[NotConnected]:./media/web-sites-hybrid-connection-get-started/D02NotConnected.png
[NotConnectedBlade]:./media/web-sites-hybrid-connection-get-started/D03NotConnectedBlade.png
[ClickListenerSetup]:./media/web-sites-hybrid-connection-get-started/D04ClickListenerSetup.png
[ClickToInstallHCM]:./media/web-sites-hybrid-connection-get-started/D05ClickToInstallHCM.png
[ApplicationRunWarning]:./media/web-sites-hybrid-connection-get-started/D06ApplicationRunWarning.png
[UAC]:./media/web-sites-hybrid-connection-get-started/D07UAC.png
[HCMInstalling]:./media/web-sites-hybrid-connection-get-started/D08HCMInstalling.png
[HCMInstallComplete]:./media/web-sites-hybrid-connection-get-started/D09HCMInstallComplete.png
[HCStatusConnected]:./media/web-sites-hybrid-connection-get-started/D10HCStatusConnected.png
 