<properties title="Build a query to retrieve your ISS data" pageTitle="Build a query to retrieve your ISS data" description="Learn how to build a custom query to retrieve your device data in ISS." metaKeywords="Intelligent Systems,ISS,IoT,get data,powerquery" services="intelligent-systems" solutions="" documentationCenter="" authors="jdecker" manager="alanth" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="tbd" ms.date="11/13/2014" ms.author="jdecker" ms.prod="azure">


#Build a query to retrieve your ISS data
You can control what data you retrieve from your Azure Intelligent Systems Service (ISS) account by adding selection information to the URL when you connect to the data endpoint. You can further customize your data selection by adding query parameters to the URL. The ISS management portal can help you build the URLs to customize the data you retrieve.  

This article explains how to use the ISS management portal to generate a customized URL and describes the most common query parameters. For a complete explanation of all the available data selection options on your Azure Intelligent Systems Service (ISS) account, see [Data feeds and selection paths](./iss-odata-feed.md).  

##Retrieve data from all devices that share the same model definition
1.	Log in to your ISS account and go to **Settings** > **Access keys**.
2.	Under **Data endpoint**, select **Recent feed** to retrieve the most recent data received from your devices. Select **Historical feed** to retrieve up to one year of data from your devices. 
3.	Select a data feed based on the type of data you want to retrieve:

	|Name of the OData feed	|Type of data at this feed
|-----------------------|------------------------
|Alarms	|All data received as part of an alarm
|Events	|All data received as part of an event</br></br>>[AZURE.NOTE] Since alarms are a type of event, this feed includes data received from alarms.
|State	|All other data received from the device

4.	Select the model that you want to retrieve data from. The 
5.	When you select a model, the ISS management portal builds the complete URI you need to connect to the OData feed. Click **Copy** to copy the URI to the clipboard.
![][1]

6.	Paste the URI into Microsoft Power Query for Excel or use it in an HTTP request for the Data Endpoint APIs.  

##Retrieve data from a single device

1.	Log in to your ISS account and go to **All devices**.
2.	Select the device you want to retrieve data from, and click **Device details**>**Device data**. The portal shows any data received from that device in the past hour.
3.	Select the **TIME PERIOD** that you want to see data from. Choose **Last hour** (default), **Last 24 hours**, **Last week**, or **Custom**.  

	When you select **Custom**, the **DATE RANGE** selector appears. Click the calendar icon, and then select a start date on the left calendar and an end date on the right calendar. Click the check mark to confirm, and wait for the portal to refresh the data on the screen.
 ![][2]

4.	When the portal displays the data you want to retrieve, click **Open in Excel**. The portal displays the complete URL for the OData feed, using the query parameters you selected.
5.	Click **Copy** to copy the URI to the clipboard.  

##Use query parameters to customize the data you retrieve
To prevent accidental downloads of large amounts of data, ISS restricts the amount of data available at the OData feed. However, you can easily override the default data restrictions by using query parameters.  

For an explanation of the query parameters for each OData feed, see [Feeds and selection paths](./iss-odata-feed.md). For more explanation and additional examples on how to use query parameters, see [Use query parameters](./iss-odata-feed.md).  

###Commonly-used query parameters

|If you want to…	|Use the selection path	|And add the following to the end of the URL
|-------------------|-----------------------------|--------------------------------
|Get data from a specific device	|Feed (current data)</br>-or-</br>Reporting (historical data)	|/Device(`'<Device name>'`</br></br>Where <*Device name*> is the unique identifier of a device registered to your account. You can find this value in the ISS_DeviceName column.
|Get data for the last hour|	Reporting (historical data)	|(nothing--this is the default)
|Get data for the last 24 hours	|Reporting (historical data)	|?Hours=24
|Get data from a date range	|Reporting (historical data)	|?StartTime=YYYY-MM-DDZ&EndTime=YYYY-MM-DDZ</br></br>For example, to get data for the month of August, 2014, add the following query to the end of the URL:</br></br>?StartTime=2014-08-01Z&EndTime=2014-08-31Z</br></br>(You must include the Z at the end of each date)
|Get data from a time range	|Reporting (historical data)	|?StartTime=YYYY-MM-DDThh:mm:ssZ&EndTime=YYYY-MM-DDThh:mm:ssZ</br></br>For example, to get data from 10:30 am on August 1st to 3:45 pm on August 2nd, add the following query to the end of the URL:</br></br>?StartTime=2014-08-01T10:30:00Z&EndTime=2014-08-01T15:45:00Z</br></br>(You must include the T between the date and the time, and you must include the Z at the end of each date)
|Get the most recent 10 rows	|Feed (current data)	|(nothing--this is the default)
|Get the most recent 100 rows	|Feed (current data)	|?Rows=100

###Use query parameters with Power Query
When you connect to your ISS account from Microsoft Power Query for Excel, when you enter the URL on the **OData feed** screen, just add any query parameters to the end of the of the URL:   

<*Complete URI from the Access Keys page*><*query parameter*>  

For example, suppose your want to retrieve the event data from the data source Sample_TestDevice, enter the **URL** in the following format:   

<*data endpoint*>/reporting/events/Sample_TestDevice**?Hours=48**


[1]: ./media/iss-build-query-retrieve-data/iss-build-query-retrieve-data-01.png
[2]: ./media/iss-build-query-retrieve-data/iss-build-query-retrieve-data-02.png