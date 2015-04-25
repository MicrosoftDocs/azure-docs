<properties 
	pageTitle="Connect to an on-premises SQL Server from an Azure mobile service using Hybrid Connections - Azure Mobile Services" 
	description="Learn how to connect to an on-premises SQL Server from an Azure mobile service using Hybrid Connections" 
	services="mobile-services" 
	documentationCenter="" 
	authors="ggailey777" 
	manager="dwrede" 
	editor="mollybos"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="04/24/2015" 
	ms.author="glenga"/>

  
# Connect to an on-premises SQL Server from an Azure mobile service using Hybrid Connections 

When an enterprise transitions to the cloud, it is often required to leave some assets on-premises, whether for technical, compliance, or security reasons. Mobile Services enables you to easily create a cloud-hosted mobility layer on top of these assets, while safely connecting to them back on your premises using Hybrid Connections. Supported assets include any resource that runs on a static TCP port, including Microsoft SQL Server, MySQL, HTTP Web APIs, and most custom web services. 

In this tutorial, you will learn how to modify a .NET backend mobile service to use a local on-premises SQL Server database instead of the default Azure SQL Database provisioned with your service. While Hybrid Connections are supported for JavaScript backend mobile services, this topic only covers .NET backend mobile services.

This topic walks you through these basic steps:

1. [Prerequisites](#Prerequisites)
2. [Install SQL Server Express, enable TCP/IP, and create a SQL Server database on-premises](#InstallSQL)
3. [Create a Hybrid Connection](#CreateHC)
4. [Install the on-premises Hybrid Connection Manager to complete the connection](#InstallHCM)
5. [Modify a Mobile Service to use the connection](#CreateService)

<a name="Prerequisites"></a>
##Prerequisites##
To complete this tutorial, you'll need the following products. All are available in free versions, so you can start developing for Azure entirely for free.

- **Visual Studio 2013** - To download a free trial version of Visual Studio 2013, see [Visual Studio Downloads](http://www.visualstudio.com/downloads/download-visual-studio-vs). Install this before continuing.

- **SQL Server 2014 Express with Tools** - download Microsoft SQL Server Express for free at the [Microsoft Web Platform Database page](http://www.microsoft.com/web/platform/database.aspx). Choose the **Express** (not LocalDB) version. The **Express with Tools** version includes SQL Server Management Studio, which you will use in this tutorial.

You will also need an on-premises machine that will connect to Azure using Hybrid Connections. That machine must meet the following criteria:

- Able to connect to Azure over port 5671
- Able to reach the *hostname*:*portnumber* of the on-premises resource you want to connect to. The resource may or may not be hosted on the same machine. 

<a name="InstallSQL"></a>
## Install SQL Server Express, enable TCP/IP, and create a SQL Server database on-premises

To use an on-premises SQL Server or SQL Server Express database with a hybrid connection, TCP/IP needs to be enabled on a static port. Default instances on SQL Server use static port 1433, whereas named instances do not. 

For detailed instructions on how to configure SQL Server so it meets the conditions described above, see [Install SQL Server Express, enable TCP/IP, and create a SQL Server database on-premises](web-sites-hybrid-connection-connect-on-premises-sql-server.md#InstallSQL). If you already have SQL Server installed in a configuration and in an environment that meets the conditions described above, you can skip ahead and start with [Create a SQL Server database on-premises](web-sites-hybrid-connection-connect-on-premises-sql-server.md#CreateSQLDB). 

For the purposes of this tutorial, we will assume the database name is **OnPremisesDB**, it is running on port **1433** and the hostname of the machine is **onPremisesServer**.

<a name="CreateHC"></a>
## Create a Hybrid Connection
1. On the on-premises machine, log on to the [Azure Management Portal](http://go.microsoft.com/fwlink/p/?linkid=213885&clcid=0x409).

2. At the bottom of the navigation pane, select **+NEW** and then select **App Services**, **BizTalk Service**, and then **Custom Create**

	![Create BizTalk Service][CreateBTS]

3. Provide a **BizTalk Service Name** and select an **Edition**. 

	![Configure new BizTalk Service][ConfigureBTS]

	This tutorial uses **mobile1**. You will need to supply a unique name for your new BizTalk Service.

4. Once the BizTalk Service has been created, select the **Hybrid Connections** tab, then click **Add**.

	![Add Hybrid Connection][AddHC]

	This creates a new hybrid connection.

5. Provide a **Name** and **Host Name** for your hybrid connection and set **Port** to `1433`. 
  
	![Configure Hybrid Connection][ConfigureHC]

	The host name is the name of the on-premises server. This configures the hybrid connection to access SQL Server running on port 1433.

6. Once the new connection is created, it appears in the following table. 
 
	![Hybrid Connection successfully created][HCCreated]
	
	The status of the of the new connection shows **On-premises setup incomplete**.

Now, we need to install the Hybrid Connection Manager on the on-premises computer.

<a name="InstallHCM"></a>
## Install the on-premises Hybrid Connection Manager to complete the connection

The Hybrid Connection Manager enables your on-premises machine to connect to Azure and relay TCP traffic. You must  install this software on the on-premises computer you are trying to access from Azure.

1. Select the connection you just created and in the bottom bar click **On-premises Setup**.

	![On-Premises Setup][DownloadHCM]

4. Click **Install and Configure**.

	![Install Hybrid Connection Manager][InstallHCM]

	This installs a customized instance of the Connection Manager, which is already pre-configured to work with the hybrid connection you just created.

3. Complete the rest of the setup steps for the Connection Manager.

	![Hybrid Connection Manager setup][HCMSetup]

	When installation completes, the hybrid connection status will change to **1 Instance Connected**. You may need to refresh the browser and wait a few minutes. The on-premises setup is now complete.

	![Hybrid Connection connected][HCConnected]

<a name="CreateService"></a>
## Modify a Mobile Service to use the connection
### Associate hybrid connection with service
1. In the **Mobile Services** tab of the portal, select an existing mobile services or create a new one. 

	>[AZURE.NOTE]Be sure to either select a service that was created using the .NET Backend or create a new .NET backend mobile service. To learn how to create a new .NET backend mobile service, see [Get started with Mobile Services](mobile-services-dotnet-backend-windows-store-dotnet-get-started.md) 

2. On the **Configure** tab for your mobile service, find the **Hybrid Connections** section and select **Add Hybrid Connection**.

	![Associate Hybrid Connection][AssociateHC]

3. Select the hybrid connection we just created on the BizTalk Services tab, press **OK**. 

	![Pick associated Hybrid Connection][PickHC]

The mobile service is now associated with the new hybrid connection.

### Update the service to use the on-premises connection string
Finally, we need to create an app setting to store the value of the connection string to our on-premises SQL Server. We then need to modify the mobile service to use the new connection string. 

1. On the **Configure** tab in **Connection Strings**, add an new connection string named `OnPremisesDatabase` with a value like `Server=onPremisesServer,1433;Database=OnPremisesDB;User ID=sa;Password={password}`.

	![Connection string for on-premises database][ConnectionString]

	Replace `{password}` with the secure password for your on-premises database.

2. Press **Save** to save the hybrid connection and connection string we just created.

3. In Visual Studio 2013, open the project that defines your .NET-based mobile service. 

	To learn how to download your .NET backend project, see [Get started with Mobile Services](mobile-services-dotnet-backend-windows-store-dotnet-get-started.md) .
 
4. In Solution Explorer, expand the **Models** folder and open the data model file, which ends in *Context.cs*.

6. Modify the **DbContext** instance constructor to make it similar to the following snippet:

        public class hybridService1Context : DbContext
        {
            public hybridService1Context()
                : base("OnPremisesDatabase")
            {
            }
        
            // snipped
        }

	The service will now use the new hybrid connection string defined in Azure.

5. Publish your changes and use a client app connected to your mobile service to invoke some operations to generate database changes.

6. Open SQL Management Studio on the on-premises computer where SQL Server is running, then in Object Explorer, expand the **OnPremisesDB** database and expand **Tables**. 

9. Right-click the **hybridService1.TodoItems** table and choose **Select Top 1000 Rows** to view the results.

	![SQL Management Studio][SMS]

Changes generated in your app have been pushed by your mobile service to your on-premises database.

##See Also##
 
+ [Hybrid Connections web site](http://azure.microsoft.com/services/biztalk-services/)
+ [Hybrid Connections overview](http://go.microsoft.com/fwlink/p/?LinkID=397274)
+ [BizTalk Services: Dashboard, Monitor, Scale, Configure, and Hybrid Connection tabs](biztalk-dashboard-monitor-scale-tabs)

<!-- IMAGES -->
 
[CreateBTS]: ./media/mobile-services-dotnet-backend-hybrid-connections-get-started/1.png
[ConfigureBTS]: ./media/mobile-services-dotnet-backend-hybrid-connections-get-started/2.png
[AddHC]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/3.png
[ConfigureHC]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/4.png
[HCCreated]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/5.png
[InstallHCM]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/6.png
[HCMSetup]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/7.png
[HCConnected]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/8.png
[AssociateHC]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/9.png
[PickHC]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/10.png
[ConnectionString]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/11.png
[SMS]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/12.png
[DownloadHCM]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/5-1.png
