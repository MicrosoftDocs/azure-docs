<properties 
   pageTitle="Learn Big Analytics and U-SQL using the Azure Preview portal Interactive tutorials | Azure" 
   description="Quick start with learning Big Analytics and U-SQL. " 
   services="big-analytics" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="big-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="09/29/2015"
   ms.author="jgao"/>


# Learn Big Analytics and U-SQL using the Azure Preview portal Interactive tutorials

The Azure preview portal provides several interactive tutorial for you to get started with Big Analytics. This articles shows you how to go through one of the tutorials for analyzing website logs.

For other tutorials, see:

- [Get started with Big Analytics using PowerShell](big-analytics-get-started-powershell.md)
- [Get started with Big Analytics using the Azure portal](big-analytics-get-started-portal.md)
- [Get started using Big Analytics SQLIP Studio](big-analytics-u-sql-studio-get-started.md) 


Alan's presentation:

	https://microsoft.sharepoint.com/teams/DPGBigDataTeam/_layouts/15/WopiFrame.aspx?sourcedoc={A142F9B5-CE82-405C-9F6D-133C01B89F67}&file=Web_Site_Log_Analysis.pptx&action=default


**Prerequisites**

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- **A Big Analytics account**.  See [Get Started with Azure Big Analytics using Azure Preview Portal](big-analytics-get-started-portal.md) or [Get Started with Azure Big Analytics using Azure PowerShell](big-analytics-get-started-powershell.md).



##Create a Big Analytics account [jgao: copied from the hero tutorial to make this tutorial complete.]

A Big Analytics account has an [Azure Data Lake]() account dependency.  You can create the Data Lake account beforehand or when you create your Big Analytics account.  

**To create a Big Analytics account**
[This procedure will change when the product releases.]

1. Sign on to the new [Azure portal](https://portal.azure.com/signin/index/?Microsoft_Azure_Kona=true&Microsoft_Azure_DataLake=true&hubsExtension_ItemHideKey=AzureDataLake_BigStorage%2cAzureKona_BigCompute).
2. Click **Home** on the left menu.
3. Click the **Marketplace** tile.  
3. Type **kona** in the search box on the **Everything** pane, and the press **ENTER**. You shall see **Kona** in the list.
4. Click **Kona** from the list.
5. Click **Create** in the bottom right corner.
6. Type or select the following:

	![Azure Big Analytics portal blade](./media/big-analytics-get-started-portal/big-analytics-portal-create-aba.png)


	- **Name**: Enter a name for the Big Analytics account.
	- **Data Lake**: Each Big Analytics account has a dependent Azure Data Lake account. The Big Analytics account and the dependent Data Lake account must be located in the same Azure data center. Follow the instruction to create a new Data Lake account, or select an existing one.
	- **Subscription**: Enter the Azure subscription that you want to associate with this Big Analytics account.
	- **Resource Group**. Select an existing Azure Resource Group or create a new one. Applications are typically made up of many components, for example a web app, database, database server, storage, and 3rd party services. Azure Resource Manager (ARM) enables you to work with the resources in your application as a group, referred to as an Azure Resource Group. You can deploy, update, monitor or delete all of the resources for your application in a single, coordinated operation. You use a template for deployment and that template can work for different environments such as testing, staging and production. You can clarify billing for your organization by viewing the rolled-up costs for the entire group. For more information, see [Azure Resource Manager Overview](resource-group-overview.md). 
	- **Location**. Select a data center for Big Analytics account.

7. Select **Pin to Startboard**. This is required for following this tutorial.
8. Click **Create**. It takes you to the HOME page of the portal. A new tile is added to the Home page. It takes a few moments to create a Big Analytics account. When the account is created, the portal shows the account on a blade.

	![Azure Big Analytics portal blade](./media/big-analytics-get-started-portal/big-analytics-portal-blade.png)

	[jgao: this screenshot needs to be updated]

##Run the Website Log Analysis interactive tutorial

**To open the Website Log Analytics interactive tutorial**

1. From the preview portal, click **Home** from the left menu.
2. Click the tile that are associated with the Big Analytics account.
3. Click **Quickstart** from the **Essentials** bar.

	![big analytics quickstart interactive tutorials](./media/big-analytics-use-interactive-tutorials/big-analytics-quickstart-button.png)

4. From the Quickstart blade, click **View interactive tutorials**.
5. Click **Website Log Analysis**.  The portal opens the tutorial in a new portal blade.


**To go through the tutorial**

1. From the **Tutorials** blade, click **1 Overview**.
2. Click **OK** on the bottom of the blade to move on to **2 Introduction**.
3. Click **OK** to move on to **3 The Sample Data**. Each Big Analytics job is to process some inbound data and produce the results in an outbound file.  This step shows you the information about where the inbound data is stored.  The Azure storage location is already linked to the Big Analytics account. So you don't need to do anything specific for preparing the inbound data.  The data schema is:

		[jgao: include the schema here so users know the inbound data format]

3. Click **OK** to move on to **4 Create TVF over weblog.log**. This is the first step of the two analysis steps.  This step creates a weblog external table [jgao: what is external table?  like in hive?]. TVF stands for Table Valued Function. When your jobs read from the TVF it will fetch data from the weblog file with the correct schema. This makes it easy for other people to reuse the data. The U-SQL script is:

		DROP DATABASE IF EXISTS SampleDBTutorials;
		CREATE DATABASE SampleDBTutorials;
		
		DROP FUNCTION IF EXISTS SampleDBTutorials.dbo.WeblogsView;
		
		//create table weblogs on space-delimited website log data
		CREATE FUNCTION SampleDBTutorials.dbo.WeblogsView()
		RETURNS @result TABLE
		(
		    s_date DateTime, s_time string, s_sitename string, cs_method string, 
		    cs_uristem string, cs_uriquery string, s_port int, cs_username string, 
		    c_ip string, cs_useragent string, cs_cookie string, cs_referer string, 
		    cs_host string, sc_status int, sc_substatus int, sc_win32status int, 
		    sc_bytes int, cs_bytes int, s_timetaken int
		)
		AS
		BEGIN
		
		    @result = EXTRACT
		        s_date DateTime, s_time string, s_sitename string, cs_method string,
		        cs_uristem string, cs_uriquery string, s_port int, cs_username string,
		        c_ip string, cs_useragent string, cs_cookie string, cs_referer string,
		        cs_host string, sc_status int, sc_substatus int, sc_win32status int,
		        sc_bytes int, cs_bytes int, s_timetaken int
		    FROM @"mafs://accounts/sandbox/fs/weblog.log"
		    USING new DefaultTextExtractor(delimiter : ' ', silent : true);
		
		RETURN;
		END;

4. Click **Submit job** beneath the U-SQL script. Notice the **NOTIFICATIONS** button on the lefe menu flashes. Click **NOTIFICATION** to see the details. [jgao: what would be an easy way to check the job status without leaving the blade?]
5. Click **OK** to move on to **5 Analyzing Referrers**. From the weblogs TVF we will create a table called ReferrersPerDay that groups the referrers, and HTTP statuses so we can analyze how often someone experiences successes or failures. We’ll output it into a table so future analysis performs better. 

		DROP TABLE IF EXISTS SampleDBTutorials.dbo.ReferrersPerDay;
		
		@weblog = SampleDBTutorials.dbo.WeblogsView();
		//create table RefersPerDay for storing references from external websites
		CREATE TABLE SampleDBTutorials.dbo.ReferrersPerDay
		(
		    INDEX idx1
		    CLUSTERED(Year ASC)
		    PARTITIONED BY HASH(Year)
		) AS 
		
		SELECT s_date.Year AS Year,
		       s_date.Month AS Month,
		       s_date.Day AS Day,
		       cs_referer, sc_status,
		       COUNT(DISTINCT c_ip) AS cnt
		FROM @weblog
		GROUP BY s_date,
		         cs_referer, sc_status;

4. We want to see which of our referrers run into errors when they try to visit our website. Let’s run a query over the table to see all the failed requests.

	@content =
	    SELECT *
	    FROM SampleDBTutorials.dbo.ReferrersPerDay
	    WHERE sc_status >=400 AND sc_status < 500;
	
	OUTPUT @content
	TO @"mafs://accounts/sandbox/fs/successfulResponses.log"
	USING new DefaultTextOutputter();


You can take a look at the output by looking at the Job Details or by browsing to the data directly
Submitted Jobs
[List to all Jobs that ran]
Output Files
[File 1]
