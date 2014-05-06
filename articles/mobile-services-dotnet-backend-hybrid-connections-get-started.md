<properties linkid="mobile-services-dotnet-backend-hybrid-connections-get-started" urlDisplayName="Connect to an on-premises SQL Server from an Azure mobile service using Hybrid Connections" pageTitle="Connect to an on-premises SQL Server from an Azure mobile service using Hybrid Connections - Azure Mobile Services" metaKeywords="" description="Learn how to connect to an on-premises SQL Server from an Azure mobile service using Hybrid Connections" metaCanonical="" services="" documentationCenter="Mobile" title="Connect to an on-premises SQL Server from an Azure mobile service using Hybrid Connections" authors="yavorg" solutions="" manager="" editor="mollybos" />

# Connect to an on-premises SQL Server from an Azure mobile service using Hybrid Connections 

As enterprises transition to the cloud, it is frequently necessary to leave some assets on-premises: whether it is for technical, compliance, or security reasons. Mobile Services allows you to easily create a cloud-hosted mobility layer on top of these assets, while safely connecting to them back on your premises using Hybrid Connections. Supported assets include any resource that runs on a static TCP port, including Microsoft SQL Server, MySQL, HTTP Web APIs, and most custom Web Services. 

In this tutorial, you will learn how to modify a mobile service to use your local on-premises SQL Server database instead of the default Azure SQL Database provisioned with your service. 

Here are the main sections of this article:

[1. Prerequisites](#Prerequisites)

[2. Install SQL Server Express, enable TCP/IP, and create a SQL Server database on-premises](#InstallSQL)

[3. Create a Hybrid Connection](#CreateHC)

[4. Install the on-premises Hybrid Connection Manager to complete the connection](#InstallHCM)

[5. Modify a Mobile Service to use the connection](#CreateService)

<a name="Prerequisites"></a>
##Prerequisites##
To complete this tutorial, you'll need the following products. All are available in free versions, so you can start developing for Azure entirely for free.

- **Visual Studio 2013** - To download a free trial version of Visual Studio 2013, see [Visual Studio Downloads](http://www.visualstudio.com/downloads/download-visual-studio-vs). Install this before continuing.

- **SQL Server 2014 Express with Tools** - download Microsoft SQL Server Express for free at the [Microsoft Web Platform Database page](http://www.microsoft.com/web/platform/database.aspx). Choose the **Express** (not LocalDB) version. The **Express with Tools** version includes SQL Server Management Studio, which you will use in this tutorial.

You will also need an on-premises machine that will connect to Azure using Hybrid Connections. That machine needs to meet two criteria:
- Must be able to connect to Azure over port 5671
- Must be able to reach the *hostname*:*portnumber* of the on-premises resource you want to connect to. The resource may or may not be hosted on the same machine. 

<a name="InstallSQL"></a>
## Install SQL Server Express, enable TCP/IP, and create a SQL Server database on-premises

To use an on-premises SQL Server or SQL Server Express database with a hybrid connection, TCP/IP needs to be enabled on a static port. Default instances on SQL Server use static port 1433, whereas named instances do not. 

For detailed instructions on how to configure SQL Server so it meets the conditions described above, see [Install SQL Server Express, enable TCP/IP, and create a SQL Server database on-premises](/en-us/documentation/articles/web-sites-hybrid-connection-connect-on-premises-sql-server#InstallSQL). If you already have SQL Server installed in a configuration and in an environment that meets the conditions described above, you can skip ahead and start with [Create a SQL Server database on-premises](/en-us/documentation/articles/web-sites-hybrid-connection-connect-on-premises-sql-server#CreateSQLDB). 

For the purposes of this tutorial, we will assume the database name is **OnPremisesDB**, it is running on port **1433** and the hostname of the machine is **onPremisesServer**.

<a name="CreateHC"></a>
## Create a Hybrid Connection
1. On the on-premises machine, log on to the [Azure Management Portal](http://go.microsoft.com/fwlink/p/?linkid=213885&clcid=0x409).
2. 2.At the bottom of the navigation pane, select **+NEW** and then select **App Services**, **BizTalk Service**, and then **Custom Create**
![Create BizTalk Service][CreateBTS]
3. Enter the following settings. Pick a different service name if **mobile1** is already in use.
![Configure new BizTalk Service][ConfigureBTS]
4. Once the BizTalk Service has been created, select the **Hybrid Connections** tab. Create a new connection by pressing **Add**.
![Add Hybrid Connection][AddHC]
5. Fill in the following settings to configure the hybrid connection to access SQL Server running on port 1433. 
![Configure Hybrid Connection][ConfigureHC]
6. Once the connection is created, it will appear in the table, and its status field will indicate **On-premises setup incomplete**. 
![Hybrid Connection successfully created][HCCreated]

<a name="InstallHCM"></a>
## Install the on-premises Hybrid Connection Manager to complete the connection

1. Select the connection you just created and then select **On-premises Setup** in the bottom bar to continue. 
2. The Hybrid Connection Manager enables your on-premises machine to connect to Azure and relay TCP traffic. Select **Install and Configure** to install a customized instance of the Connection Manager, which is already pre-configured to work with the hybrid connection you just created. Be sure to complete this step on the on-premises machine you are trying to access from Azure.<br/>
![Install Hybrid Connection Manager][InstallHCM]
3. Complete the rest of the setup steps for the Connection Manager.
![Hybrid Connection Manager setup][HCMSetup]
4. When installation completes, the hybrid connection status will change to **1 Instance Connected**. You may need to refresh the browser and wait a few minutes. The on-premises setup is now complete.
![Hybrid Connection connected][HCConnected]

<a name="CreateService"></a>
## Modify a Mobile Service to use the connection
### Associate hybrid connection with service
1. In the **Mobile Services** tab of the portal, select an existing mobile services or create a new one. Be sure to select a service that was created using the .NET Backend. 
2. On the **Configure** tab for your mobile service, find the **Hybrid Connections** section and select **Add Hybrid Connection**.
![Associate Hybrid Connection][AssociateHC]
3. Select the hybrid connection we just created on the BizTalk Services tab, press **OK**. 
![Pick associated Hybrid Connection][PickHC]

### Update the service to use the on-premises connection string
We now need to create an app setting to store the value of the connection string to our on-premises SQL Server. 

1. Find the **App Settings** area on the **Configure** tab and create an app setting named **onPremisesDatabase** with a value similar to **Server=onPremisesServer,1433;Database=OnPremisesDB;User ID=sa;Password={password}**.
![App setting for connection string][AppSetting]
2. Press **Save** to save the hybrid connection and app setting we just created.
3. We need to modify our mobile service to use the new connection string. Whether you are creating a new mobile service or modifying an existing one, follow the steps similar to [Get started with Mobile Services](/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started/) to obtain the source code for your .NET-based mobile service. 
4. Modify the **DbContext** instance constructor to make it similar to the following snippet:

        public class hybridService1Context : DbContext
        {
            public hybridService1Context()
                : base(ConfigurationManager.AppSettings["onPremisesDatabase"])
            {
            }
        
            // snipped
        }
5. Publish your changes and use a client app connected to your mobile service to invoke some operations that would result in database changes.
6. Open SQL Management Studio on the on-premises computer where SQL Server is running. In Object Explorer, expand the **OnPremisesDB** database, and then expand **Tables**. Right-click the **hybridService1.TodoItems** table and choose **Select Top 1000 Rows** to view the results.
![SQL Management Studio][SMS]

##See Also##
 
+ [Hybrid Connections web site](http://azure.microsoft.com/en-us/services/biztalk-services/)
+ [Hybrid Connections overview](http://go.microsoft.com/fwlink/p/?LinkID=397274)
+ [BizTalk Services: Dashboard, Monitor, Scale, Configure, and Hybrid Connection tabs](http://azure.microsoft.com/en-us/documentation/articles/biztalk-dashboard-monitor-scale-tabs/)

<!-- IMAGES -->
 
[CreateBTS]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/1.png
[ConfigureBTS]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/2.png
[AddHC]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/3.png
[ConfigureHC]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/4.png
[HCCreated]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/5.png
[InstallHCM]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/6.png
[HCMSetup]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/7.png
[HCConnected]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/8.png
[AssociateHC]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/9.png
[PickHC]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/10.png
[AppSetting]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/11.png
[SMS]:./media/mobile-services-dotnet-backend-hybrid-connections-get-started/12.png
