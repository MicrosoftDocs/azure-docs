<properties 
	pageTitle="Connect to an on-premises SQL Server from an Azure mobile service using Hybrid Connections - Azure Mobile Services" 
	description="Learn how to connect to an on-premises SQL Server from an Azure mobile service using Hybrid Connections" 
	services="mobile-services" 
	documentationCenter="" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="05/24/2015" 
	ms.author="glenga"/>

  
# Connect to an on-premises SQL Server from Azure Mobile Services using Hybrid Connections 

When your enterprise transitions to the cloud, you might not be able to migrate all of your assets to Azure right away. Hybrid connections lets Azure Mobile Services securely connect to your on-premises assets, to expose your on-premises data to your mobile clients. Supported assets include any resource that runs on a static TCP port, including Microsoft SQL Server, MySQL, HTTP Web APIs, and most custom web services. Hybrid Connections use Shared Access Signature (SAS) authorization to secure the connections from your mobile service and the on-premises Hybrid Connection Manager to the Hybrid Connection. For more information, see [Hybrid Connections Overview](integration-hybrid-connection-overview.md).

In this tutorial, you will learn how to modify a .NET backend mobile service to use a local on-premises SQL Server database instead of the default Azure SQL Database provisioned with your service. Hybrid Connections are also supported for a JavaScript backend mobile service, as described in [this article](http://blogs.msdn.com/b/azuremobile/archive/2014/05/12/connecting-to-an-external-database-with-node-js-backend-in-azure-mobile-services.aspx).

##Prerequisites##

This tutorial requires you to have the following: 

- **An existing .NET backend mobile service** <br/>Follow the tutorial [Get started with Mobile Services] to create and download a new .NET backend mobile service from the [Azure Management Portal].

[AZURE.INCLUDE [hybrid-connections-prerequisites](../includes/hybrid-connections-prerequisites.md)]

## Install SQL Server Express, enable TCP/IP, and create a SQL Server database on-premises

[AZURE.INCLUDE [hybrid-connections-create-on-premises-database](../includes/hybrid-connections-create-on-premises-database.md)]

## Create a Hybrid Connection

1. On the on-premises machine, log on to the [Azure Management Portal].

2. At the bottom of the navigation pane, select **+NEW** and then select **App Services**, **BizTalk Service**, and then **Custom Create**

3. Provide a **BizTalk Service Name** and select an **Edition**. 

	This tutorial uses **mobile1**. You will need to supply a unique name for your new BizTalk Service.

4. Once the BizTalk Service has been created, select the **Hybrid Connections** tab, then click **Add**.

	![Add Hybrid Connection][AddHC]

	This creates a new hybrid connection.

5. Provide a **Name** and **Host Name** for your hybrid connection and set **Port** to `1433`. 
  
	![Configure Hybrid Connection][ConfigureHC]

	The host name is the name of the on-premises server. This configures the hybrid connection to access SQL Server running on port 1433. If you are using a named SQL Server instance, instead use the static port you defined earlier.

6. After the new connection is created, the status of the of the new connection shows **On-premises setup incomplete**.

Next, you'll need to install the Hybrid Connection Manager on the on-premises computer.

<a name="InstallHCM"></a>
## Install the on-premises Hybrid Connection Manager to complete the connection

The Hybrid Connection Manager enables your on-premises machine to connect to Azure and relay TCP traffic. You must  install the manager on an on-premises computer, but it doesn't need to be the computer running your SQL Server instance.

1. Select the connection you just created (its **Status** should be **On-premesis setup incomplete**) click **On-premises Setup**.

	![On-Premises Setup](./media/mobile-services-dotnet-backend-hybrid-connections-get-started/5-1.png)

4. Click **Install and Configure**.

	This installs a customized instance of the Connection Manager, which is already pre-configured to work with the hybrid connection you just created.

3. Complete the rest of the setup steps for the Connection Manager.

	After the installation is complete, the hybrid connection status will change to **1 Instance Connected**. You may need to refresh the browser and wait a few minutes. 

The on-premises setup is now complete.

## Configure the mobile service project to connect to the SQL Server database

In this step, you edit the connection string that tells your mobile service where to find your SQL Server Express database when running on the local computer. The connection string is in the application's Web.config file, which contains configuration information for the application. This setting is overriden by the connection string setting in the portal, which you will add in the next section. You also must modify the mobile service project to use the new connection string.

> [AZURE.NOTE] To ensure that your application uses the database that you created in SQL Server Express, and not the one in Visual Studio's default LocalDB, it is important that you complete this step before running your project.

1. In Visual Studio 2013, open the project that defines your .NET-based mobile service. 

	To learn how to download your .NET backend project, see [Get started with Mobile Services](mobile-services-dotnet-backend-windows-store-dotnet-get-started.md) .

2. In Solution Explorer, open the Web.config file, locate the **connectionStrings** section, add a new SqlClient entry like the following, which points to the on-premises SQL Server database: 
	
	    <add name="OnPremisesDBConnection" 
         connectionString="Data Source=192.168.0.107,1433;
         Initial Catalog=OnPremisesDB;
         User ID=HybridConnectionLogin;
         Password=VicTor11;
         MultipleActiveResultSets=True"
         providerName="System.Data.SqlClient" />
	
3. Click **Save** in Visual Studio to save the Web.config file.

4. Expand the **Models** folder and open the data model file, which ends in *Context.cs*.

6. Modify the **DbContext** instance constructor to pass the value `OnPremisesDBConnection` to the base **DbContext** constructor, similar to the following snippet:

        public class hybridService1Context : DbContext
        {
            public hybridService1Context()
                : base("OnPremisesDBConnection")
            {
            }
        }

	The service will now use the connection string to connect to the SQL Server database.

4. With the .NET backend project set as the StartUp project, press F5 to build and run the mobile service project on the local computer. 
 
##Test the database connection locally

Before publishing to Azure and using the hybrid connection, it's a good idea to make sure that the connection to the database works correctly from your local computer. That way you can more easily diagnose and correct any connection issues before you start using the hybrid connection.

[AZURE.INCLUDE [mobile-services-dotnet-backend-test-local-service-api-documentation](../includes/mobile-services-dotnet-backend-test-local-service-api-documentation.md)]

## Update the service to use the on-premises connection string

Finally, you need to publish the mobile service to Azure and add an app setting to store the SQL Server connection string so that it can be used in Azure.  

1. On the **Configure** tab in **Connection Strings**, add an new connection string named `OnPremisesDBConnection` with a value like `Server=onPremisesServer,1433;Database=OnPremisesDB;User ID=HybridConnectionsLogin;Password=<**secure_password**>`.

	![Connection string for on-premises database][ConnectionString]

	Replace `<**secure_password**>` with the secure password for your on-premises database.

2. Press **Save** to save the hybrid connection and connection string you just created.

3. Using Visual Studio, publish your updated mobile service project to Azure.

4. Use either the **Try it now** button on the start page or a client app connected to your mobile service to invoke some operations to generate database changes. 

	>[AZURE.NOTE]When you use the **Try it now** button to launch the Help API pages, remember to supply your application key as the password (with a blank username).

4. In SQL Server Management Studio, connect to your SQL Server instance, open the Object Explorer, expand the **OnPremisesDB** database and expand **Tables**. 

5. Right-click the **hybridService1.TodoItems** table and choose **Select Top 1000 Rows** to view the results.

	![SQL Management Studio][SMS]

Note that changes generated in your app have been saved by your mobile service to your on-premises database using the hybrid connection.

##See Also##
 
+ [Hybrid Connections web site](../../services/biztalk-services/)
+ [Hybrid Connections overview](integration-hybrid-connection-overview.md)
+ [BizTalk Services: Dashboard, Monitor, Scale, Configure, and Hybrid Connection tabs](biztalk-dashboard-monitor-scale-tabs.md)

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

<!-- Links -->
[Azure Management Portal]: http://go.microsoft.com/fwlink/p/?linkid=213885

[Get started with Mobile Services]: mobile-services-dotnet-backend-windows-store-dotnet-get-started.md