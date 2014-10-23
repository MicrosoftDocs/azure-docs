<properties title="Understand the ISS OData feeds and selection paths" pageTitle="Understand the ISS OData feeds and selection paths" description="Learn about the OData feeds in ISS for retrieving data." metaKeywords="Intelligent Systems,ISS,IoT,data,endpoint,feed,selection path,OData" services="intelligent-systems" solutions="" documentationCenter="" authors="jdecker" manager="alanth" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="tbd" ms.date="11/13/2014" ms.author="jdecker" ms.prod="azure">

#Understand the OData feeds and selection paths in ISS
This section explains how the OData feeds are structured, what data is available at each feed, and the query parameters that are supported at each feed. This information is most useful when you use the REST APIs to connect to an OData feed.  

For information about how to connect to an OData feed, see [Retrieve your ISS data with Power Query](./iss-retrieve-odata-feed.md).  

##Data feeds and selection paths
The data endpoint for ISS account provides three OData feeds and two different selection paths for each feed. The following diagram shows the three different feeds and the type of data available at each one:

![][1]

To connect to a feed, you will use the data endpoint URL that you received with your ISS account along with the feed names and selection paths described in the following tables. Combine these in the format <*data endpoint*>/<*selection path*>/<*feed name*>.   

**OData feed names**  

|Name of the OData feed	|Type of data at this feed
|-----------------------|
|**alarms**	|All properties defined for any alarms
|**events**	|All properties defined for any events</br></br>Since alarms are a type of event, the events feed includes properties defined for an alarm.
|**state**	|All properties defined on the device, except alarms and events

 
You can access each data feed through two different selection paths. The data is the same, but each path selects the data differently and supports different query parameters. The following table describes the default selections and lists the supported query parameters for each selection path:   

**Selection paths**  

|Selection path	|Filter	|Supported query parameters
|---------------|-------|
|**feed** (select by record count)	|Retrieves up to the most recent 1,000 rows for each currently-registered device</br></br>>[AZURE.NOTE] By default, **feed** retrieves only the most recent 10 rows for each device. This helps prevent accidental downloads of large amounts of data. Use the Rows query parameter to retrieve additional data. 	|•	*$select*</br></br>•	*Rows*
|**reporting** (select by time)	|Can retrieve all data received from any device in the past 366 days (even if a device is no longer registered to your ISS account)</br></br>>[AZURE.NOTE] By default, **reporting** retrieves only data received in the past hour. This helps prevent accidental downloads of large amounts of data. Use the *Hours* or *StartTime*/*EndTime* query parameters to retrieve additional data. 	|•	*$select*</br></br>•	*$top*</br></br>•	*Hours*</br></br>•	*StartTime*</br></br>•	*EndTime*

 
For details on how to use each of the query parameters, see <a href="http://msdn.microsoft.com/library/azure/dn864893.aspx">data endpoint REST APIs</a>.  

##Build the URLs for the OData feeds
To connect to an OData feed, you need the following information for your ISS account:  

-	Your ISS account name
-	The data endpoint URL for your ISS account
-	The access key (for Power Query)
-	The authorization header (for REST APIs)  

You can get the data endpoint URL, access key, and authorization header for your account from the **Access keys** page in the ISS  portal. The base data endpoint for your account is usually   

	https://<*ISS account name*>.data.intelligentsystems.azure.net/data.svc

To build the complete URL for each OData feed, use the following format:  

<*data endpoint*>/<*selection path*>/<*feed name*>  

The following diagram shows how the selections on the **Access keys** page map to the different parts of the URL:
![][2]


For example, if your data endpoint is **https://treyresearch.data.intelligentsystems.azure.net/data.svc** and you want to connect to the **state** feed through the **reporting** selection path, you would use the following URL:  

https://treyresearch.data.intelligentsystems.azure.net/data.svc/**reporting**/**state**/?api-version=2014-10-31.Preview
>[AZURE.NOTE] The correct API version is included when you build the data endpoint feed URL in the ISS portal.  

When you connect to the feed, ISS returns the list of data sources available at the feed. To retrieve the actual data from your devices, add the name of a data source to the URL using the following format:  

<*data endpoint*>/<*selection path*>/<*feed name*>/<*data source*>  

For example, if you want to retrieve data from the data source **Performance.VendingMachine** using the same data endpoint and selection path, you would use the following URL:  

https://treyresearch.data.intelligentsystems.azure.net/data.svc/reporting/state/**Performance_VendingMachine** 




[1]: ./media/iss-odata-feed/iss-odata-feed-01.png

[2]: ./media/iss-odata-feed/iss-odata-feed-02.png