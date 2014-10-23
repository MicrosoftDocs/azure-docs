<properties title="Build a query to retrieve your ISS data" pageTitle="Build a query to retrieve your ISS data" description="Learn how to build a custom query to retrieve your device data in ISS." metaKeywords="Intelligent Systems,ISS,IoT,get data,powerquery" services="intelligent-systems" solutions="" documentationCenter="" authors="jdecker" manager="alanth" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="tbd" ms.date="11/13/2014" ms.author="jdecker" ms.prod="azure">


#Build a query to retrieve your ISS data
You can control the data you retrieve from your Azure Intelligent Systems Service (ISS) account by adding selection information to the URL when you connect to the data endpoint. You can further customize your data selection by adding query parameters to the URL. The ISS  portal can help you build the URLs to customize the data you retrieve.  

This article explains how to use the ISS  portal to generate a customized URL and describes the most common query parameters. For a complete explanation of all the available data selection options on your Intelligent Systems Service account, see [Data feeds and selection paths](./iss-odata-feed.md).  

##Retrieve data from all devices that share the same model definition
1.	Log in to your ISS account and go to **Settings** > **Access keys**.
2.	Under **Data endpoint**, select **Recent feed** to retrieve the most recent data received from your devices. Select **Historical feed** to retrieve up to one year of data from your devices. 
3.	Select a data feed based on the type of data you want to retrieve:
	+ **Alarms**: all data received as part of an alarm
	+ **Events**: all data received as part of an event. Since alarms are a type of event, this feed includes data received from alarms.
	+ **State**: all other data received from the device.
<br>
5.	The ISS  portal builds the complete URL to connect to the OData feed. Click **Copy** to copy the URL to the clipboard.
![][1]

6.	Paste the URL into Microsoft Power Query for Excel or use it in an HTTP request for the data endpoint APIs.  

##Retrieve data from a single device

1.	Log in to your ISS account and go to **All devices**.
2.	Select the device you want to retrieve data from, and click **Device details** > **Device data**. The portal shows any data received from that device in the past hour.
3.	Select the **TIME PERIOD** that you want to see data from. Choose **Last hour** (default), **Last 24 hours**, **Last week**, or **Custom**.  

	When you select **Custom**, the **DATE RANGE** selector appears. Click the calendar icon, and then select a start date on the left calendar and an end date on the right calendar. Click the check mark to confirm, and wait for the portal to refresh the data on the screen.
 ![][2]

4.	When the portal displays the data you want to retrieve, click **Open in Excel**. The portal displays the complete URL for the OData feed, using the query parameters you selected.
5.	Click **Copy** to copy the URL to the clipboard. 
6.	Paste the URL into Power Query for Excel. 




[1]: ./media/iss-build-query-retrieve-data/iss-build-query-retrieve-data-01.png
[2]: ./media/iss-build-query-retrieve-data/iss-build-query-retrieve-data-02.png