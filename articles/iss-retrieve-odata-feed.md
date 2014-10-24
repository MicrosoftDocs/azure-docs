<properties title="Retrieve your ISS data with Power Query for Excel" pageTitle="Retrieve your ISS data with Power Query for Excel" description="Learn how to use Power Query to retrieve your device data in ISS." metaKeywords="Intelligent Systems,ISS,IoT,powerquery,get data" services="intelligent-systems" solutions="" documentationCenter="" authors="jdecker" manager="alanth" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="tbd" ms.date="11/13/2014" ms.author="jdecker" ms.prod="azure">

#Retrieve your ISS data with Power Query
Your Azure Intelligent Systems Service (ISS) account provides OData feeds to make it easy to retrieve data from your devices: just use Microsoft Power Query for Excel to connect to the data endpoint for your Intelligent Systems Service account.   

Power Query is an add-in for Microsoft Office 365 ProPlus that brings advanced query and filtering options directly into Microsoft Excel 2013. For more information on Power Query, see [Microsoft Power Query for Excel Help](http://go.microsoft.com/fwlink/p/?LinkId=401291). To download the latest version of the Power Query add-in, see [Microsoft Power Query for Excel](http://go.microsoft.com/fwlink/p/?LinkId=401139).

Power Query allows 1,048,576 rows per worksheet or download. If your query contains around 1,000,000 rows, consider using the <a href="http://msdn.microsoft.com/library/azure/dn864893.aspx">data endpoint REST APIs</a> to retrieve your data.  
 
When you retrieve data from your account, you should consider the amount of data you are going to retrieve. The size of the data directly affects the performance of Power Query. For information on how to estimate the amount of data in a query, see [Manage your data](./iss-estimate-data-size.md).  

##Connect to your ISS account from Power Query
Before you connect Power Query to your ISS account, you will need the following information:  

-	Your ISS account name 
-	The data access key for your ISS account 
-	The complete URL of the OData feed that you want to connect to <p>You can build this URL in the ISS  portal; see [Build a query to retrieve your data](./iss-build-query-retrieve-data.md) for detailed instructions.


>[AZURE.NOTE] If you're not sure of the value for ISS account name or data access key, see [ISS endpoints and access keys](./iss-endpoints-access-keys.md) for more information.  

1.	In Excel 2013, open the workbook where you want to import your data. 
2.	In the ribbon, click **POWER QUERY** > **From Other Sources** > **From ODATA feed**. Power Query opens a wizard to help you connect to the OData feed.
![][1]
   
3.	Go to the ISS management portal and retrieve the URL and access key for the OData feed you want to connect to. See [Build a query to retrieve your data](./iss-build-query-retrieve-data.md) for detailed instructions.
4.	On the **OData feed** screen, paste the **URI** from the ISS management portal into the **URL** field, then click **OK**. Power Query opens the **Access an OData** feed screen.
![][2]

  
5.	On the left side of the **Access an OData feed** screen, select **Basic** for the authorization method. 
![][3]

  
	For the basic authorization options, enter the following information:  

	-	In **Username**, enter the name of your ISS account. 
	-	In **Password**, copy and paste the PRIMARY ACCESS KEY from the **Access keys** page in the ISS portal.
	-	In **Select which URL to apply these settings to**, select the complete URL for the OData feed that you want to access. 
   
6.	Click **Save**. Power Query will try to connect to the OData feed. If it can’t connect, Power Query opens **Query Editor** and displays an error message indicating the reason it can't connect.
7.	Power Query prompts you to select privacy settings for the feed. To avoid conflict with other users on your ISS account, set the privacy level to either **Organizational** or **Public**. Be sure to select the same privacy settings for all feeds at your data endpoint. For more information about the available privacy settings and what they mean, see [Privacy levels](http://go.microsoft.com/fwlink/p/?LinkId=402980).

	>[AZURE.NOTE] You can edit your credentials and privacy settings at any time. See [Edit credentials and privacy settings](#subheading1) for instructions.
 
	>[AZURE.NOTE] The first time you access a data source, Power Query may prompt you to enter your credentials twice.   
	
8. After Power Query connects to the OData feed, **Query Editor Navigator** opens and displays a list of models and functions available at that feed. If your URL contains a **feed** selection path, the functions help you select rows per device. If your URL contains a **reporting** selection path, the functions help you select a specific time period. 
![][5]


9. Select a function. **Enter Parameters** for the function opens.
![][6]<br>
	What to expect:
	+ **Rows: 50** will display 50 rows of data per device.
	+ **DeviceName: Test Device 1** will display 10 rows of data (the default) for the device **Test Device 1**.
	+ **Rows 50** and **DeviceName: Test Device 1** will display 50 rows of data for the device **Test Device 1**.
![][7]<br>
	Parameter combinations that you can use for the **Reporting** function:
	+ **StartTime**: displays data from the specified start time to the current time.
	+ **StartTime** and **EndTime**: displays data from the specified start time to the specified end time.
	+ **StartTime** and **Hours**: displays data from the specified start time to an end time computed by adding the number of hours to the start time.
	+ **Hours**: displays data for the specified number of hours prior to the current time. For example, if **Hours = 24**, data for the past 24 hours is displayed.
10. Enter the desired parameters and click **OK**.
11. Click **Apply & Close** to load the data into a new worksheet, or click **Transform** to use **Query Editor** to shape the data.   

You can use **Query Editor** to select ranges, filter rows, or otherwise transform your data before loading it into your worksheet. For additional information, see [Use Power Query to analyze your data](./iss-analyze.md).   

The next time you want to connect to the data feed, you can click **POWER QUERY** > **Recent Sources**, and select the data feed from the list. In **Query Editor** > **Applied Steps**, click **Invoked Function** to edit the function parameters. 

##<a name="subheading1"></a>Edit credentials and privacy settings
You can edit your credentials and privacy settings in Power Query at any time. 
 
![][4]
  
1.	Click **POWER QUERY** > **Data Source Settings**, then select the data source you want to edit. 
2.	Click **Edit credentials** to change your saved credentials for that data source, or click **Delete** to remove the data source completely. 
3.	Click the drop-down menu on the right side of the window to change the privacy settings.  

##Edit the connection to retrieve different data
To change the data you retrieve from your account, you can edit the URL that Power Query uses to connect to your ISS account.  
 
1.	Open the workbook that contains the Power Query query that you want to change.
2.	Open **Query Editor** and make sure you can see the formula bar. (On the **View** tab, select the box next to **Formula Bar**.)
3.	Under **APPLIED STEPS**, click **Source** (at the top of the **APPLIED STEPS** list). Power Query displays the URL for the OData feed in the formula bar.
4.	In the formula bar, delete the name of the data source and any query parameters (everything after the final forward slash). For example, if your original URL was 

	https://treyresearch.data.intelligentsystems.azure.net/data.svc/reporting/state/Performance_VendingMachine?Hours=48


	you would delete */Performance_VendingMachine?Hours=48*, leaving you with 


	https://treyresearch.data.intelligentsystems.azure.net/data.svc/reporting/state

5.	Power Query displays a list of all the data sources available at the feed. Select the data source you want to access.

	>[AZURE.NOTE] If you can't see the list of data sources, expand the **Navigation Pane** on the left side of **Query Editor**.</br>
	
	The first time you access each data source, Power Query prompts you to enter your credentials and select privacy settings.


[1]: ./media/iss-retrieve-odata-feed/iss-retrieve-odata-feed-01.png
[2]: ./media/iss-retrieve-odata-feed/iss-retrieve-odata-feed-02.png
[3]: ./media/iss-retrieve-odata-feed/iss-retrieve-odata-feed-03.png
[4]: ./media/iss-retrieve-odata-feed/iss-retrieve-odata-feed-04.png
[5]: ./media/iss-retrieve-odata-feed/iss-retrieve-odata-feed-05.png
[6]: ./media/iss-retrieve-odata-feed/iss-retrieve-odata-feed-06.png
[7]: ./media/iss-retrieve-odata-feed/iss-retrieve-odata-feed-07.png
