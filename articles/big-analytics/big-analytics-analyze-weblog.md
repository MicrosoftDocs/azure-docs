# Analyze Website logs using Azure Big Analytics

[jgao: see big-analytics-use-interactive-tutorials.md]

Learn how to analyze website logs using Azure Big Analytics. For the information on analyzing website logs using Azure HDInsight, see []().

Alan's presentation:

	https://microsoft.sharepoint.com/teams/DPGBigDataTeam/_layouts/15/WopiFrame.aspx?sourcedoc={A142F9B5-CE82-405C-9F6D-133C01B89F67}&file=Web_Site_Log_Analysis.pptx&action=default


Basic Big Analytics process:

[image here] inbound data --> Big Analytics Job processing --> outbound results


**Prerequisites**

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

- Sample data: /samples/data


## TOC [The TOC will be removed before the release]



1. This Tutorial shows you how you can analyze website logs using Kona.

	Using some sample data we’ve published, we’ll teach you how to answer basic questions about website
	
	We’ve published the Sample data to an Azure Storage location. It’s already been linked to you Kona account so you don’t need to do anything here. We’re just giving you more information.
	
	The weblog sample data is stored at this location: /Samples/Data/
	[List of files here – like Jobs]

2. Since we’ll be using this data in multiple jobs, it’s easiest to begin by creating a “Table Valued Function (TVF)”. When your jobs read from the TVF it will fetch data from the weblog file with the correct schema. This makes it easy for other people to reuse the data.

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

3. From the weblogs TVF we will create a table called ReferrersPerDay that groups the referrers, and HTTP statuses so we can analyze how often someone experiences successes or failures. We’ll output it into a table so future analysis are more performant. 



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
