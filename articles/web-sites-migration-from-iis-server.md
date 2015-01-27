<properties 
	pageTitle="Migrate your IIS Websites to Azure Websites using the Migration Assistant" 
	description="Shows how to use Azure Websites Migration Assistant to quickly migrate existing IIS websites to Azure Websites" 
	services="web-sites" 
	documentationCenter="" 
	authors="cephalin" 
	writer="cephalin" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="web-sites" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/20/2014" 
	ms.author="cephalin"/>

# Migrate your IIS Websites to Azure Websites using the Migration Assistant #
You can easily migrate to Azure Websites your existing websites that run on Internet Information Service (IIS) 6 or later. [Azure Websites Migration Assistant](https://www.movemetothecloud.net/) can analyze your IIS server installation, identify which sites can be migrated to Azure Websites, highlight any elements that cannot be migrated or are unsupported on the platform, and then migrate your websites and associated databases to Azure.

>[AZURE.NOTE] Windows Server 2003 will reach end of support on July 14th 2015. If you are currently your websites on an IIS server that is Windows Server 2003, Azure Websites is a low-risk, low-cost, and low-friction way to keep your websites online, and Azure Websites Migration Assistant can help automate the migration process for you. 

## Elements Verified During Compatibility Analysis ##
The Azure Websites Migration Assistant creates a readiness report to identify any potential causes for concern or blocking issues which may prevent a successful migration from on-premises IIS to Azure Websites. Some of the key items to be aware of are:

-	Port Bindings – Azure Websites only support Port 80 for HTTP and Port 443 for HTTPS traffic. Different port configurations will be ignored and traffic will be routed to 80 or 443. 
-	Authentication – Azure Websites supports Anonymous Authentication by default and Forms Authentication where specified by an application. Windows Authentication can be used by integrating with Azure Active Directory and ADFS only. All other forms of authentication, e.g. Basic Authentication, are not currently supported. 
-	Global Assembly Cache (GAC) – The GAC is not supported in Azure Websites. If your application references assemblies which you usually deploy to the GAC, you will need to deploy to the application bin folder on Azure Websites. 
-	IIS5 Compatibility Mode – This is not supported on Azure Websites. 
-	Application Pools – In Azure Websites, each site and its child applications run in the same application pool. If your site has multiple child applications utilizing multiple application pools, consolidate them to a single application pool with common settings or migrate each application to a separate website.
-	COM Components – Azure Websites does not allow the registration of COM Components on the platform. If your websites or applications make use of any COM Components, you must rewrite them in managed code and deploy them with the website or application.
-	ISAPI Filters – Azure Websites can support the use of ISAPI Filters. You need to do the following:
	-	deploy the DLLs with your website 
	-	register the DLLs using [Web.config](http://www.iis.net/configreference/system.webserver/isapifilters)
	-	place an applicationHost.xdt file in the site root with the content below:

			<?xml version="1.0"?>
			<configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
			<configSections>
			    <sectionGroup name="system.webServer">
			      <section name="isapiFilters" xdt:Transform="SetAttributes(overrideModeDefault)" overrideModeDefault="Allow" />
			    </sectionGroup>
			  </configSections>
			</configuration>

		For more examples of how to use XML Document Transformations with your website, see [Transform your Microsoft Azure Web Site](http://blogs.msdn.com/b/waws/archive/2014/06/17/transform-your-microsoft-azure-web-site.aspx).

-	Other components like SharePoint, front page server extensions (FPSE), FTP, SSL certificates will not be migrated.

## How to use the Azure Websites Migration Assistant ##
This section steps through an example to to migrate a few websites that use a SQL Server database and running on an on-premise Windows Server 2003 R2 (IIS 6.0) machine:

1.	On the IIS server or your client machine navigate to [https://www.movemetothecloud.net/](https://www.movemetothecloud.net/) 

	![](./media/web-sites-migration-from-iis-server/migration-tool-homepage.png)

2.	Install Azure Websites Migration Assistant by clicking on the **Dedicated IIS Server** button. More options will be options in the near future. 
4.	Click the **Install Tool** button to install Azure Websites Migration Assistant on your machine.

	![](./media/web-sites-migration-from-iis-server/install-page.png)

	>[AZURE.NOTE] You can also click **Download for offline install** to download a ZIP file for installing on servers not connected to the interent. Or, you can click **Upload an existing migration readiness report**, which is an advanced option to work with an existing migration readiness report that you previously generated (explained later).

5.	In the **Application Install** screen, click **Install** to install on your machine. It will also install corresponding dependencies like Web Deploy, DacFX, and IIS, if needed. 

	![](./media/web-sites-migration-from-iis-server/install-progress.png)

	Once installed, Azure Websites Migration Assistant automatically starts.
  
6.	Choose **Migrate sites and databases from a remote server to Azure**. Enter the administrative credentials for the remote server and click **Continue**. 

	![](./media/web-sites-migration-from-iis-server/migrate-from-remote.png)

	You can of course choose to migrate from the local server. The remote option is useful when you want to migrate websites from a production IIS server.
 
	At this point the migration tool will inspect the your IIS server's configuration, such as Sites, Applications, Application Pools, and dependencies to identify candidate websites for migration. 

8.	The screenshot below shows three websites – **Default Web Site**, **TimeTracker**, and **CommerceNet4**. All of them have an associated database that we want to migrate. Select all of the sites you would like to assess and then click **Next**.

	![](./media/web-sites-migration-from-iis-server/select-migration-candidates.png)
 
9.	Click **Upload** to upload the readiness report. If you click **save file locally**, you can run the migration tool again later and upload the saved readiness report as noted earlier.

	![](./media/web-sites-migration-from-iis-server/upload-readiness-report.png)
 
	Once you upload the readiness report, Azure performs readiness analysis and shows you the results. Read the assessment details for each website and make sure that you understand or have addressed all issues before you proceed. 
 
	![](./media/web-sites-migration-from-iis-server/readiness-assessment.png)

12.	Click **Begin Migration** to start the migration.You will now be redirected to Azure to log into your account. It is important that you log in with an account that has an active Azure Subscription. If you do not have an Azure account then you can sign up for a free trial here. 

13.	Select the tenant account, Azure subscription and region to use for your migrated Azure websites and databases, and then click **Start Migration**. You can select the websites to migrate later.

	![](./media/web-sites-migration-from-iis-server/choose-tenant-account.png)

14.	On the next screen you can make changes to the default migration settings, such as:

	- use an existing Azure SQL Database or create a new Azure SQL Database, and configure its credentials
	- select the websites to migrate
	- define names for the Azure websites and their linked SQL databases
	- customize the global settings and site-level settings

	The screenshot below shows all the websites selected for migration with the default settings.

	![](./media/web-sites-migration-from-iis-server/migration-settings.png)

	>[AZURE.NOTE] the **Enable Azure Active Directory** checkbox in custom settings integrates the Azure website with [Azure Active Directory](http://azure.microsoft.com/en-us/documentation/articles/active-directory-whatis/) (the **Default Directory**). For more information on syncing Azure Active Directory with your on-premise Active Directory, see [Directory integration](http://msdn.microsoft.com/library/jj573653).

16.	 Once you make all the desired changes, click **Create** to start the migration process. The migration tool will create the Azure SQL Database and Azure Website, and then publish the website content and databases. The migration progress is clearly shown in the migration tool, and you will see a summary screen at the end, which details the sites migrated, whether they were successful, links to the newly-created Azure websites. 

	If any error occurs during migration, the migration tool will clearly indicate the failure and rollback the changes. You will also be able to send the error report directly to the engineering team by clicking the **Send Error Report** button, with the captured failure call stack and build message body. 

	![](./media/web-sites-migration-from-iis-server/migration-error-report.png)

	If migrate succeeds without errors, you can also click the **Give Feedback** button to provide any feedback directly. 
 
20.	Click the links to the Azure websites and verify that the migration has succeeded.


