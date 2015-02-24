<properties 
	pageTitle="Hybrid Connection: Connect an Azure Website to an On-Premises Resource" 
	description="Create a connection between an Azure website and an on-premises resource that uses a static TCP port" 
	services="web-sites" 
	documentationCenter="" 
	authors="cephalin" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="web-sites" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="2/12/2015" 
	ms.author="cephalin"/>

# Connect an Azure website to an on-premises resource using Hybrid Connections

You can connect a website on Microsoft Azure to any on-premises resource that uses a static TCP port, such as SQL Server, MySQL, HTTP Web APIs, Mobile Services, and most custom Web Services. This article shows you how to create a hybrid connection between an Azure website and an on-premises SQL Server database.

> [AZURE.NOTE] The Websites portion of the Hybrid Connections feature is available only in the [Azure Preview portal](https://portal.azure.com). To create a connection in BizTalk Services, see [Hybrid Connections](http://go.microsoft.com/fwlink/p/?LinkID=397274).  

## Prerequisites
- An Azure subscription. For a free subscription, see [Azure Free Trial](http://azure.microsoft.com/en-us/pricing/free-trial/). 

- To use an on-premises SQL Server or SQL Server Express database with a hybrid connection, TCP/IP needs to be enabled on a static port. Using a default instance on SQL Server is recommended because it uses static port 1433. For information on installing and configuring SQL Server Express for use with hybrid connections, see [Connect to an on-premises SQL Server from an Azure web site using Hybrid Connections](http://go.microsoft.com/fwlink/?LinkID=397979).

- The computer on which you install the on-premises Hybrid Connection Manager agent described later in this article:

	- Must be able to connect to Azure over port 5671
	- Must be able to reach the *hostname*:*portnumber* of your on-premises resource. 

> [AZURE.NOTE] The steps in this article assume that you are using the browser from the computer that will host the on-premises hybrid connection agent.


## Create a Website in the Azure Preview Portal ##

> [AZURE.NOTE] If you have already created a website in the Azure Preview Portal that you want to use for this tutorial, you can skip ahead to [Create a Hybrid Connection and a BizTalk Service](#CreateHC) and start from there.

1. In the lower left corner of the [Azure Preview Portal](https://portal.azure.com), click **New**, and then choose **Website**.
	
	![New button][New]
	
	![New website][NewWebsite]
	
2. On the **Website** blade, provide a name for your website, and then click **Create**. 
	
	![Website name][WebsiteCreationBlade]
	
3. After a few moments, the website is created and its website blade appears. The blade is a vertically scrollable dashboard that lets you manage your site.
	
	![Website running][WebSiteRunningBlade]
	
4. To verify the site is live, you can click the **Browse** icon to display the default page.
	
	![Click browse to see your website][Browse]
	
	![Default website page][DefaultWebSitePage]
	
Next, you will create a hybrid connection and a BizTalk service for the website.

<a name="CreateHC"></a>
## Create a Hybrid Connection and a BizTalk Service ##

1. Back in the Preview Portal, scroll down the blade for your website and choose **Hybrid connections**.
	
	![Hybrid connections][CreateHCHCIcon]
	
2. On the Hybrid connections blade, click **Add**.
	
	![Add a hybrid connnection][CreateHCAddHC]
	
3. The **Add a hybrid connection** blade opens.  Since this is your first hybrid connection, the **New hybrid connection** option is preselected, and the **Create hybrid connection** blade opens for you.
	
	![Create a hybrid connection][TwinCreateHCBlades]
	
	On the **Create hybrid connection blade**:
	- For **Name**, provide a name for the connection.
	- For **Hostname**, enter the name of the on-premises computer that hosts your resource.
	- For **Port**, enter the port number that your on-premises resource uses (1433 for a SQL Server default instance).
	- Click **Biz Talk Service**


4. The **Create Biz Talk Service** blade opens. Enter a name for the BizTalk service, and then click **OK**.
	
	![Create BizTalk service][CreateHCCreateBTS]
	
	The **Create Biz Talk Service** blade closes and you are returned to the **Create hybrid connection** blade.
	
5. On the Create hybrid connection blade, click **OK**. 
	
	![Click OK][CreateBTScomplete]
	
6. When the process completes, the Notifications area in the portal informs you that the connection has been successfully created.
	
	![Success notification][CreateHCSuccessNotification]
	
7. On the website blade, the **Hybrid connections** icon now shows that 1 hybrid connection has been created.
	
	![One hybrid connection created][CreateHCOneConnectionCreated]
	
At this point, you have completed an important part of the cloud hybrid connection infrastructure. Next, you will create a corresponding on-premises piece.

<a name="InstallHCM"></a>
## Install the on-premises Hybrid Connection Manager to complete the connection ##

1. On the website blade, click the Hybrid connections icon. 
	
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

<a name="NextSteps"></a>
## Next Steps ##

- For information on creating an ASP.NET web application that uses a hybrid connection, see [Connect to an on-premises SQL Server from an Azure web site using Hybrid Connections](http://go.microsoft.com/fwlink/?LinkID=397979).

- For information on using a hybrid connection with a mobile service, see [Connect to an on-premises SQL Server from an Azure mobile service using Hybrid Connections](../mobile-services-dotnet-backend-hybrid-connections-get-started/).

### Additional Resources

[Hybrid Connections overview](http://go.microsoft.com/fwlink/p/?LinkID=397274)

[Josh Twist introduces hybrid connections (Channel 9 video)](http://channel9.msdn.com/Shows/Azure-Friday/Josh-Twist-introduces-hybrid-connections)

[Hybrid Connections web site](http://azure.microsoft.com/en-us/services/biztalk-services/)

[BizTalk Services: Dashboard, Monitor, Scale, Configure, and Hybrid Connection tabs](../biztalk-dashboard-monitor-scale-tabs/)

[Building a Real-World Hybrid Cloud with Seamless Application Portability (Channel 9 video)](http://channel9.msdn.com/events/TechEd/NorthAmerica/2014/DCIM-B323#fbid=)

[Connect to an on-premises SQL Server from Azure Mobile Services using Hybrid Connections (Channel 9 video)](http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Connect-to-an-on-premises-SQL-Server-from-Azure-Mobile-Services-using-Hybrid-Connections)

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
