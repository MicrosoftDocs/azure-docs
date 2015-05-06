<properties 
	pageTitle="Connect to on-premises SQL Server from a web app in Azure App Service using Hybrid Connections" 
	description="Create a web app on Microsoft Azure and connect it to an on-premises SQL Server database"
	services="app-service\web" 
	documentationCenter="" 
	authors="cephalin" 
	manager="wpickett" 
	editor="mollybos"/>

<tags 
	ms.service="app-service-web" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/23/2015" 
	ms.author="cephalin"/>

# Connect to on-premises SQL Server from a web app in Azure App Service using Hybrid Connections

Hybrid Connections can connect [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714) Web Apps to on-premises resources that use a static TCP port. Supported resources include Microsoft SQL Server, MySQL, HTTP Web APIs, Mobile Services, and most custom Web Services. 

In this tutorial, you will learn how to create an App Service web app in the [Azure preview](http://go.microsoft.com/fwlink/?LinkId=529715), connect the web app to your local on-premises SQL Server database using the new Hybrid Connection feature, create a simple ASP.NET application that will use the hybrid connection, and deploy the application to the App Service web app. The completed web app on Azure stores user credentials in a membership database that is on-premises. The tutorial assumes no prior experience using Azure or ASP.NET.

>[AZURE.NOTE] If you want to get started with Azure App Service before signing up for an Azure account, go to [Try App Service](http://go.microsoft.com/fwlink/?LinkId=523751), where you can immediately create a short-lived starter web app in App Service. No credit cards required; no commitments.

> [AZURE.NOTE] The Web Apps portion of the Hybrid Connections feature is available only in the [Azure preview portal](https://portal.azure.com). To create a connection in BizTalk Services, see [Hybrid Connections](http://go.microsoft.com/fwlink/p/?LinkID=397274).  

## Prerequisites ##

To complete this tutorial, you'll need the following products. All are available in free versions, so you can start developing for Azure entirely for free.

- **Azure subscription** - For a free subscription, see [Azure Free Trial](/pricing/free-trial/). 

- **Visual Studio 2013** - To download a free trial version of Visual Studio 2013, see [Visual Studio Downloads](http://www.visualstudio.com/downloads/download-visual-studio-vs). Install this before continuing.

- **Microsoft .NET Framework 3.5 Service Pack 1** - If your operating system is Windows 8.1, Windows Server 2012 R2, Windows 8, Windows Server 2012, Windows 7, or Windows Server 2008 R2, you can enable this in Control Panel > Programs and Features > Turn Windows features on or off. Otherwise, you can download it from the [Microsoft Download Center](http://www.microsoft.com/download/en/details.aspx?displaylang=en&id=22).

- **SQL Server 2014 Express with Tools** - download Microsoft SQL Server Express for free at the [Microsoft Web Platform Database page](http://www.microsoft.com/web/platform/database.aspx). Choose the **Express** (not LocalDB) version. The **Express with Tools** version includes SQL Server Management Studio, which you will use in this tutorial.

- **SQL Server Management Studio Express** - This is included with the SQL Server 2014 Express with Tools download mentioned above, but if you need to install it separately, you can download and install it from the [SQL Server Express download page](http://www.microsoft.com/web/platform/database.aspx).

The tutorial assumes that you have an Azure subscription, that you have installed Visual Studio 2013, and that you have installed or enabled .NET Framework 3.5. The tutorial shows you how to install SQL Server 2014 Express in a configuration that works well with the Azure Hybrid Connections feature (a default instance with a static TCP port). Before starting the tutorial, download SQL Server 2014 Express with Tools from the location mentioned above if you do not have SQL Server installed.

### Notes ###
To use an on-premises SQL Server or SQL Server Express database with a hybrid connection, TCP/IP needs to be enabled on a static port. Default instances on SQL Server use static port 1433, whereas named instances do not. 

The computer on which you install the on-premises Hybrid Connection Manager agent:

- Must have outbound connectivity to Azure over:

> <table border="1">
    <tr>
       <th><strong>Port</strong></th>
        <th>Why</th>
    </tr>
    <tr>
        <td>80</td>
        <td><strong>Required</strong> for HTTP port for certificate validation and optionally for data connectivity.</td>
    </tr>
    <tr>
        <td>443</td>
        <td><strong>Optional</strong> for data connectivity. If outbound connectivity to 443 is unavailable, TCP port 80 is used.</td>
    </tr>
	<tr>
        <td>5671 and 9352</td>
        <td><strong>Recommended</strong> but Optional for data connectivity. Note this mode usually yields higher throughput. If outbound connectivity to these ports is unavailable, TCP port 443 is used.</td>
	</tr>
</table>

- Must be able to reach the *hostname*:*portnumber* of your on-premises resource. 

The steps in this article assume that you are using the browser from the computer that will host the on-premises hybrid connection agent.

If you already have SQL Server installed in a configuration and in an environment that meets the conditions described above, you can skip ahead and start with [Create a SQL Server database on-premises](#CreateSQLDB).

<a name="InstallSQL"></a>
## A. Install SQL Server Express, enable TCP/IP, and create a SQL Server database on-premises ##

This section shows you how to install SQL Server Express, enable TCP/IP, and create a database so that your web application will work with the Azure Preview environment.

### Install SQL Server Express ###

1. To install SQL Server Express, run the **SQLEXPRWT_x64_ENU.exe** or **SQLEXPR_x86_ENU.exe** file that you downloaded. The SQL Server Installation Center wizard appears.
	
	![SQL Server Install][SQLServerInstall]
	
2. Choose **New SQL Server stand-alone installation or add features to an existing installation**. Follow the instructions, accepting the default choices and settings, until you get to the **Instance Configuration** page.
	
3. On the **Instance Configuration** page, choose **Default instance**.
	
	![Choose Default Instance][ChooseDefaultInstance]
	
	By default, the default instance of SQL Server listens for requests from SQL Server clients on static port 1433, which is what the Hybrid Connections feature requires. Named instances use dynamic ports and UDP, which are not supported by Hybrid Connections.
	
4. Accept the defaults on the **Server Configuration** page.
	
5. On the **Database Engine Configuration** page, under **Authentication Mode**, choose **Mixed Mode (SQL Server authentication and Windows authentication)**, and provide a password.
	
	![Choose Mixed Mode][ChooseMixedMode]
	
	In this tutorial, you will be using SQL Server authentication. Be sure to remember the password that you provide, because you will need it later.
	
6. Step through the rest of the wizard to complete the installation.

### Enable TCP/IP ###
To enable TCP/IP, you will use SQL Server Configuration Manager, which was installed when you installed SQL Server Express. Follow the steps in [Enable TCP/IP Network Protocol for SQL Server](http://technet.microsoft.com/library/hh231672%28v=sql.110%29.aspx) before continuing.

<a name="CreateSQLDB"></a>
### Create a SQL Server database on-premises ###

Your Visual Studio web application requires a membership database that can be accessed by Azure. This requires a SQL Server or SQL Server Express database (not the LocalDB database that the MVC template uses by default), so you'll create the membership database next. 

1. In SQL Server Management Studio, connect to the SQL Server you just installed. (If the **Connect to Server** dialog does not appear automatically, navigate to **Object Explorer** in the left pane, click **Connect**, and then click **Database Engine**.) 	
	![Connect to Server][SSMSConnectToServer]
	
	For **Server type**, choose **Database Engine**. For **Server name**, you can use **localhost** or the name of the computer that you are using. Choose **SQL Server authentication**, and then log in with the sa user name and the password that you created earlier. 
	
2. To create a new database by using SQL Server Management Studio, right-click **Databases** in Object Explorer, and then click **New Database**.
	
	![Create new database][SSMScreateNewDB]
	
3. In the **New Database** dialog, enter MembershipDB for the database name, and then click **OK**. 
	
	![Provide database name][SSMSprovideDBname]
	
	Note that you do not make any changes to the database at this point. The membership information will be added automatically later by your web application when you run it.
	
4. In Object Explorer, if you expand **Databases**, you will see that the membership database has been created.
	
	![MembershipDB created][SSMSMembershipDBCreated]
	
<a name="CreateSite"></a>
## B. Create a web app in the Azure preview portal ##

> [AZURE.NOTE] If you have already created a web app in the Azure preview portal that you want to use for this tutorial, you can skip ahead to [Create a Hybrid Connection and a BizTalk Service](#CreateHC) and continue from there.

1. In the [Azure preview portal](https://portal.azure.com), click **New** > **Web + Mobile** > **Web app**.
	
	![New button][New]
	
2. Configure your web app, and then click **Create**. 
	
	![Website name][WebsiteCreationBlade]
	
3. After a few moments, the web app is created and its web app blade appears. The blade is a vertically scrollable dashboard that lets you manage your web app.
	
	![Website running][WebSiteRunningBlade]
	
	To verify the web app is live, you can click the **Browse** icon to display the default page.
	
Next, you will create a hybrid connection and a BizTalk service for the web app.

<a name="CreateHC"></a>
## C. Create a Hybrid Connection and a BizTalk Service ##

1. Back in the portal, scroll down your web app's blade and click **Hybrid connections**.
	
	![Hybrid connections][CreateHCHCIcon]
	
2. On the Hybrid connections blade, click **Add** > **New hybrid connection**.
	
3. On the **Create hybrid connection blade**:
	- For **Name**, provide a name for the connection.
	- For **Hostname**, enter the computer name of your SQL Server host computer.
	- For **Port**, enter 1433 (the default port for SQL Server).
	- Click **Biz Talk Service** and enter a name for the BizTalk service.
	
	![Create a hybrid connection][TwinCreateHCBlades]
		
5. Click **OK** twice. 

	When the process completes, the **Notifications** area will flash a green **SUCCESS** and the **Hybrid connection** blade will show the new hybrid connection with the status as **Not connected**.
	
	![One hybrid connection created][CreateHCOneConnectionCreated]
	
At this point, you have completed an important part of the cloud hybrid connection infrastructure. Next, you will create a corresponding on-premises piece.

<a name="InstallHCM"></a>
## D. Install the on-premises Hybrid Connection Manager to complete the connection ##

1. In the **Hybrid connections** blade, click the hybrid connection you just created, then click **Listener Setup**.
	
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

Now that the hybrid connection infrastructure is complete, you will create a web application that uses it.

<a name="CreateASPNET"></a>
## E. Create a basic ASP.NET web project, edit the database connection string, and run the project locally ##

### Create a basic ASP.NET project ###
1. In Visual Studio, on the **File** menu, create a new Project:
	
	![New Visual Studio project][HCVSNewProject]
	
2. In the **Templates** section of the **New Project** dialog, select **Web** and choose **ASP.NET Web Application**, and then click **OK**.
	
	![Choose ASP.NET Web Application][HCVSChooseASPNET]
	
3. In the **New ASP.NET Project** dialog, choose **MVC**, and then click **OK**.
	
	![Choose MVC][HCVSChooseMVC]
	
4. When the project has been created, the application readme page appears. Do not run the web project yet.
	
	![Readme page][HCVSReadmePage]

### Edit the database connection string for the application ###

In this step, you edit the connection string that tells your application where to find your local SQL Server Express database. The connection string is in the application's Web.config file, which contains configuration information for the application. 

> [AZURE.NOTE] To ensure that your application uses the database that you created in SQL Server Express, and not the one in Visual Studio's default LocalDB, it is important that you complete this step before running your project.

1. In Solution Explorer, double-click the Web.config file.
	
	![Web.config][HCVSChooseWebConfig]
	
2. Edit the **connectionStrings** section to point to the SQL Server database on your local machine, following the syntax in the following example: 
	
	![Connection string][HCVSConnectionString]
	
	When composing the connection string, keep in mind the following:
	
	- If you are connecting to a named instance instead of a default instance (for example, YourServer\SQLEXPRESS), you must configure your SQL Server to use static ports. For information on configuring static ports, see [How to configure SQL Server to listen on a specific port](http://support.microsoft.com/kb/823938). By default, named instances use UDP and dynamic ports, which are not supported by Hybrid Connections. 
	
	- It is recommended that you specify the port (1433 by default, as shown in the example) n the connection string so that you can be sure that your local SQL Server has TCP enabled and is using the correct port. 
	
	- Remember to use SQL Server Authentication to connect, specifying the user ID and password in your connection string.
	
3. Click **Save** in Visual Studio to save the Web.config file.

### Run the project locally and register a new user ###

1. Now, run your new web project locally by clicking the browse button under Debug. This example uses Internet Explorer.
	
	![Run project][HCVSRunProject]
	
2. On the upper right of the default web page, choose **Register** to register a new account:
	
	![Register a new account][HCVSRegisterLocally]
	
3. Enter a user name and password:
	
	![Enter user name and password][HCVSCreateNewAccount]
	
	This automatically creates a database on your local SQL Server that holds the membership information for your application. One of the tables (**dbo.AspNetUsers**) holds web app user credentials like the ones that you just entered. You will see this table later in the tutorial.
	
4. Close the browser window of the default web page. This stops the application in Visual Studio.

You are now ready for the next step, which is to publish the application to Azure and test it.

<a name="PubNTest"></a>
## F. Publish the web application to Azure and test it ##

Now, you'll publish your application to your App Service web app and then test it to see how the hybrid connection you configured earlier is being used to connect your web app to the database on your local machine. 

### Publish the web application ###

1. You can download your publishing profile for the App Service web app in the Azure preview portal. On the blade for your web app, click **Get publish profile**, and then save the file to your computer.
	
	![Download publish profile][PortalDownloadPublishProfile]
	
	Next, you will import this file into your Visual Studio web application. 
	
2. In Visual Studio, right-click the project name in Solution Explorer and select **Publish**.
	
	![Select publish][HCVSRightClickProjectSelectPublish]
	
3. In the **Publish Web** dialog, on the **Profile** tab, choose **Import**.
	
	![Import][HCVSPublishWebDialogImport]
	
4. Browse to your downloaded publishing profile, select it, and then click **OK**.
	
	![Browse to profile][HCVSBrowseToImportPubProfile]
	
5. Your publishing information is imported and displays on the **Connection** tab of the dialog. 
	
	![Click Publish][HCVSClickPublish]
	
	Click **Publish**.
	
	When publishing completes, your browser will launch and show your now familiar ASP.NET application -- except that now it is live in the Azure cloud!

Next, you will use your live web application to see its Hybrid Connection in action.

### Test the completed web application on Azure ###

1. On the top right of your web page on Azure, choose **Log in**.
	
	![Test log in][HCTestLogIn]
	
2. Your App Service web app is now connected to your web application's membership database on your local machine. To verify this, log in with the same credentials that you entered in the local database earlier.
	
	![Hello greeting][HCTestHelloContoso]
	
3. To further test your new hybrid connection, log off of your Azure web application and register as another user. Provide a new user name and password, and then click **Register**.
	
	![Test register another user][HCTestRegisterRelecloud]
	
4. To verify that the new user's credentials have been stored in your local database through your hybrid connection, open SQL Management Studio on your local computer. In Object Explorer, expand the **MembershipDB** database, and then expand **Tables**. Right-click the **dbo.AspNetUsers** membership table and choose **Select Top 1000 Rows** to view the results.
	
	![View the results][HCTestSSMSTree]
	
5. Your local membership table now shows both accounts - the one that you created locally, and the one that you created in the Azure cloud. The one that you created in the cloud has been saved to your on-premises database through Azure's Hybrid Connection feature.
	
	![Registered users in on-premises database][HCTestShowMemberDb]
	
You have now created and deployed an ASP.NET web application that uses a hybrid connection between a web app in the Azure cloud and an on-premises SQL Server database. Congratulations!

## See Also ##
[Hybrid Connections overview](http://go.microsoft.com/fwlink/p/?LinkID=397274)

[Josh Twist introduces hybrid connections (Channel 9 video)](http://channel9.msdn.com/Shows/Azure-Friday/Josh-Twist-introduces-hybrid-connections)

[Hybrid Connections overview](/services/biztalk-services/)

[BizTalk Services: Dashboard, Monitor, Scale, Configure, and Hybrid Connection tabs](../biztalk-dashboard-monitor-scale-tabs/)

[Building a Real-World Hybrid Cloud with Seamless Application Portability (Channel 9 video)](http://channel9.msdn.com/events/TechEd/NorthAmerica/2014/DCIM-B323#fbid=)

[Connect to an on-premises SQL Server from an Azure mobile service using Hybrid Connections](mobile-services-dotnet-backend-hybrid-connections-get-started.md)

[Connect to an on-premises SQL Server from Azure Mobile Services using Hybrid Connections (Channel 9 video)](http://channel9.msdn.com/Series/Windows-Azure-Mobile-Services/Connect-to-an-on-premises-SQL-Server-from-Azure-Mobile-Services-using-Hybrid-Connections)

[ASP.NET Identity Overview](http://www.asp.net/identity)

[AZURE.INCLUDE [app-service-web-whats-changed](../includes/app-service-web-whats-changed.md)]
 

<!-- IMAGES -->
[SQLServerInstall]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/A01SQLServerInstall.png
[ChooseDefaultInstance]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/A02ChooseDefaultInstance.png
[ChooseMixedMode]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/A03ChooseMixedMode.png
[SSMSConnectToServer]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/A04SSMSConnectToServer.png
[SSMScreateNewDB]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/A05SSMScreateNewDBlh.png
[SSMSprovideDBname]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/A06SSMSprovideDBname.png
[SSMSMembershipDBCreated]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/A07SSMSMembershipDBCreated.png
[New]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/B01New.png
[NewWebsite]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/B02NewWebsite.png
[WebsiteCreationBlade]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/B03WebsiteCreationBlade.png
[WebSiteRunningBlade]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/B04WebSiteRunningBlade.png
[Browse]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/B05Browse.png
[DefaultWebSitePage]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/B06DefaultWebSitePage.png
[CreateHCHCIcon]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/C01CreateHCHCIcon.png
[CreateHCAddHC]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/C02CreateHCAddHC.png
[TwinCreateHCBlades]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/C03TwinCreateHCBlades.png
[CreateHCCreateBTS]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/C04CreateHCCreateBTS.png
[CreateBTScomplete]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/C05CreateBTScomplete.png
[CreateHCSuccessNotification]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/C06CreateHCSuccessNotification.png
[CreateHCOneConnectionCreated]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/C07CreateHCOneConnectionCreated.png
[HCIcon]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/D01HCIcon.png
[NotConnected]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/D02NotConnected.png
[NotConnectedBlade]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/D03NotConnectedBlade.png
[ClickListenerSetup]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/D04ClickListenerSetup.png
[ClickToInstallHCM]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/D05ClickToInstallHCM.png
[ApplicationRunWarning]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/D06ApplicationRunWarning.png
[UAC]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/D07UAC.png
[HCMInstalling]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/D08HCMInstalling.png
[HCMInstallComplete]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/D09HCMInstallComplete.png
[HCStatusConnected]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/D10HCStatusConnected.png
[HCVSNewProject]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/E01HCVSNewProject.png
[HCVSChooseASPNET]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/E02HCVSChooseASPNET.png
[HCVSChooseMVC]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/E03HCVSChooseMVC.png
[HCVSReadmePage]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/E04HCVSReadmePage.png
[HCVSChooseWebConfig]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/E05HCVSChooseWebConfig.png
[HCVSConnectionString]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/E06HCVSConnectionString.png
[HCVSRunProject]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/E06HCVSRunProject.png
[HCVSRegisterLocally]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/E07HCVSRegisterLocally.png
[HCVSCreateNewAccount]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/E08HCVSCreateNewAccount.png
[PortalDownloadPublishProfile]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/F01PortalDownloadPublishProfile.png
[HCVSPublishProfileInDownloadsFolder]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/F02HCVSPublishProfileInDownloadsFolder.png
[HCVSRightClickProjectSelectPublish]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/F03HCVSRightClickProjectSelectPublish.png
[HCVSPublishWebDialogImport]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/F04HCVSPublishWebDialogImport.png
[HCVSBrowseToImportPubProfile]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/F05HCVSBrowseToImportPubProfile.png
[HCVSClickPublish]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/F06HCVSClickPublish.png
[HCTestLogIn]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/F07HCTestLogIn.png
[HCTestHelloContoso]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/F08HCTestHelloContoso.png
[HCTestRegisterRelecloud]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/F09HCTestRegisterRelecloud.png
[HCTestSSMSTree]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/F10HCTestSSMSTree.png
[HCTestShowMemberDb]:./media/web-sites-hybrid-connection-connect-on-premises-sql-server/F11HCTestShowMemberDb.png
