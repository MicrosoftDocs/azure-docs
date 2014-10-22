<properties title="Understand the ISS OData feeds and selection paths" pageTitle=Understand the ISS OData feeds and selection paths" description="Learn about the OData feeds in ISS for retrieving data." metaKeywords="Intelligent Systems,ISS,IoT,data,endpoint,feed,selection path,OData" services="intelligent-systems" solutions="" documentationCenter="" authors="jdecker" manager="alanth" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="tbd" ms.date="11/13/2014" ms.author="jdecker" ms.prod="azure">

#Understand the OData feeds and selection paths in ISS
This section explains how the OData feeds are structured, what data is available at each feed, and the query parameters that are supported at each feed. This information is most useful when you use the REST APIs to connect to an OData feed.  

For information about how to connect to an OData feed, see [Retrieve your data from the OData feeds](./iss-retrieve-odata-feed.md).  

##Data feeds and selection paths
The data endpoint for ISS account provides three OData feeds and two different selection paths for each feed. The following diagram shows the three different feeds and the type of data available at each one:

![][1]

To connect to a feed, you will use the data endpoint URL that you received with your ISS account along with the feed names and selection paths described in the following tables. Combine these in the format <*data endpoint*>/<*selection path*>/<*feed name*>.   

**OData feed names**  

|Name of the OData feed	|Type of data at this feed
|-----------------------|
|**alarms**	|All properties defined for any alarms
|**events**	|All properties defined for any events</br></br>>[AZURE.NOTE] Since alarms are a type of event, the events feed includes properties defined for an alarm.
|**state**	|All properties defined on the device, except properties defined as part of an alarm or event

 
You can access each data feed through two different selection paths. The data is the same, but each path selects the data differently and supports different query parameters. The following table describes the default selections and lists the supported query parameters for each selection path:   

**Selection paths**  

|Selection path	|Filter	|Supported query parameters
|---------------|-------|
|**feed** (select by record count)	|Retrieves up to the most recent 1,000 rows for each currently-registered device</br></br>>[AZURE.NOTE] By default, **feed** retrieves only the most recent 10 rows for each device. This helps prevent accidental downloads of large amounts of data. Use the Rows query parameter to retrieve additional data. 	|•	*$select*</br></br>•	*Rows*
|**reporting** (select by time)	|Can retrieve all data received from any device in the past 366 days (even if a device is no longer registered to your ISS account)</br></br>>[AZURE.NOTE] By default, **reporting** retrieves only data received in the past hour. This helps prevent accidental downloads of large amounts of data. Use the *Hours* or *StartTime*/*EndTime* query parameters to retrieve additional data. 	|•	*$select*</br></br>•	*$top*</br></br>•	*Hours*</br></br>•	*StartTime*</br></br>•	*EndTime*

 
For information on how to override the default selections using Power Query, see [Use query parameters to customize the data you retrieve](./iss-build-query-retrieve-data.md). For details on how to use each of the query parameters in general, see [Data Endpoint REST APIs]().  

##Build the URLs for the OData feeds
To connect to an OData feed, you need the following information for your ISS account:  

-	Your ISS account name
-	The data endpoint URL for your account
-	The access key (for Power Query)
-	The authorization header (for REST APIs)  

You can get the data endpoint URL, access key, and authorization header for your account from the **Access keys** page in the ISS management portal. The base data endpoint for your account is usually   

https://<*ISS account name*>.data.intelligentsystems.azure.net/data.svc

To build the complete URL for each OData feed, use the following format:  

<*data endpoint*>/<*selection path*>/<*feed name*>  

The following diagram shows how the selections on the **Access keys** page map to the different parts of the URL:
![][2]


For example, if your data endpoint is **https://treyresearch.data.intelligentsystems.azure.net/data.svc** and you want to connect to the **state** feed through the **reporting** selection path, you would use the following URL:  

https://treyresearch.data.intelligentsystems.azure.net/data.svc/**reporting**/**state**  

When you connect to the feed, ISS returns the list of data sources available at the feed. To retrieve the actual data from your devices, add the name of a data source to the URL using the following format:  

<*data endpoint*>/<*selection path*>/<*feed name*>/<*data source*>  

For example, if you want to retrieve data from the data source **Performance.VendingMachine** using the same data endpoint and selection path, you would use the following URL:  

https://treyresearch.data.intelligentsystems.azure.net/data.svc/reporting/state/**Performance_VendingMachine** 

##Use query parameters 
You can use query parameters to filter the data you retrieve from a data source. To use a query parameter, add a question mark after the <*data source*> followed by the query parameter:   

<*data endpoint*>/<*selection path*>/<*feed name*>/<*data source*>?<*parameter*>  

For example, if you want to retrieve the past **24 hours** of data from the table Performance.VendingMachine, you would use the following URL:   
 

https://treyresearch.data.intelligentsystems.azure.net/data.svc/reporting/state/Performance_VendingMachine**?Hours=24** 

For more information on how to use query parameters with the OData feeds, see [Data Endpoint REST APIs]().  

**Retrieve data from all devices**  

|Description	|Query
|---------------|
|Retrieve recent data from all active devices	|http://<*data endpoint*>/feed/state/<*data source*>
|Retrieve last N records from all devices	|http://<*data endpoint*>/feed/state/<*data source*>?Rows=*n*</br></br>Where *n* is the number of rows you want to retrieve from each device. The default value is 10.
|Retrieve data from all devices over a specific time range|	http://<*data endpoint*>/reporting/state/<*data source*>?StartTime=YYYY-MM-DDThh:mm:ss.0000000Z&EndTime=YYYY-MM-DDThh:mm:ss.0000000Z</br></br>Start and end times must be specified in Coordinated Universal Time (UTC) format, for example, 2014-04-13Z, 2014-04-13T13:30:30Z, or 2014-04-13T13:30:30.0000000Z. 
|Retrieve data from all devices over a rolling time window in the past	|http://<*data endpoint*>/reporting/state/<*data source*>?Hours=*h*</br></br>Where *h* is the number of hours of data you want to retrieve. The default value is 1.

**Retrieve data from a specific device**  

|Description	|Query
|---------------|
|Retrieve data from a specific device |http://<*data endpoint*>/feed/state/<*data source*>/Device(’<*Device name*>’)</br></br>Where <*Device name*> is the unique identifier of a device registered to your account. You can find this value in the ISS_DeviceName column.
|Retrieve last N records from a specific device	|http://<*data endpoint*>/feed/state/<*data source*>/Device('<*Device name*>')?Rows=*n*</br></br>Where *n* is number of rows from each device.
|Retrieve data from a specific device over a specific time range	|http:// <*data endpoint*>/reporting/state/<*data source*>/Device('<*Device name*>')?StartTime=YYYY-MM-DDThh:mm:ss.0000000Z&EndTime=YYYY-MM-DDThh:mm:ss.0000000Z</br></br>Start and end times must be specified in Coordinated Universal Time (UTC) format, for example, *2014-04-13Z, 2014-04-13T13:30:30Z, or 2014-04-13T13:30:30.0000000Z*.
|Retrieve data from a specific device over a rolling time window in the past	|http:// <*data endpoint*>/reporting/state/<*data source*>/Device('<*Device name*>')?Hours=*h*</br></br>Where *h* is the number of hours of data you want to retrieve. The default value is 1.


[1]: ./media/iss-odata-feed/iss-odata-feed-01.png

[2]: ./media/iss-odata-feed/iss-odata-feed-02.png