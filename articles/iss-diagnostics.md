<properties title="See ISS diagnostic data from your devices" pageTitle="See ISS diagnostic data from your devices" description="Learn how to use the debug OData feed in ISS to retrieve error messages from your devices." metaKeywords="Intelligent Systems,ISS,IoT,diagnostic,debug,error,OData" services="intelligent-systems" solutions="" documentationCenter="" authors="jdecker" manager="alanth" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="tbd" ms.date="11/13/2014" ms.author="jdecker" ms.prod="azure"> 

#See ISS diagnostic data from your devices
Azure Intelligent Systems Service (ISS) records error messages from your devices and makes these available at the **debug** OData feed. This topic describes how to connect to the **debug** feed and retrieve records from the **Diagnostics** data source.   

You can retrieve your data directly from the OData feed, or you can use the REST APIs to retrieve your data programmatically. For general information about how to use Microsoft Power Query for Excel with ISS OData feeds, see [Retrieve your data with Power Query](./iss-retrieve-odata-feed.md). For general information about how to use the ISS REST APIs, see [Data Endpoint REST APIs]().  

##Connect to the debug OData feed
The URL for the debug OData feed uses the following format:  

<*data endpoint*>/debug/Diagnostics  

For example, if your data endpoint is **https://treyresearch.data.intelligentsystems.azure.net/data.svc**, you would use the following URL:

https://treyresearch.data.intelligentsystems.azure.net/data.svc/debug/Diagnostics

To connect to the **Diagnostics** data source from Power Query, follow the procedure [To connect to ISS from Power Query](./iss-retrieve-odata-feed.md) in the topic [Retrieve your data from the OData feeds](./iss-retrieve-odata-feed.md).   

##Query parameters for the Diagnostics data source
The **Diagnostics** data source supports the *$top* and *$select* parameters. The following table explains how to use these parameters:

|Parameter 	|Description 
|-----------|-----------
|*$top*	|Retrieves a specified number of rows. The *$top* parameter will always get the most recent entries.</br></br>This parameter uses the following format:</br></br><*data endpoint*>/debug/Diagnostics?$top=<*number of rows to retrieve*></br></br>For example, if your data endpoint is **https://treyresearch.data.intelligentsystems.azure.net/data.svc** and you want to retrieve the 5 most recent rows, you would use the following URL:</br></br>https://treyresearch.data.intelligentsystems.azure.net/data.svc/debug/Diagnostics?$top=5
|$select	|Retrieves specific columns. This parameter uses the following format:</br></br>$select=<*Column 1*><*Column 2*><*Column 3*><*Column n*></br></br>Note that there is no space between the column names.</br></br>For example, if your data endpoint is **https://treyresearch.data.intelligentsystems.azure.net/data.svc** and you want to retrieve the **Message**, **MessageType**, **MessageDetails**, and **ExtraInformation** columns, you would use the following URL:</br></br>https://treyresearch.data.intelligentsystems.azure.net/data.svc/debug/Diagnostics?$select=Message,MessageType,MessageDetails,ExtraInformation


##Information in the Diagnostics data source
The table below describes the columns in the **Diagnostics** data source and what information is stored in each column. 

|Property	|EDM Type	|Description
|-----------|-----------|
|PartitionKey	|String	|System-generated unique ID.
|RowKey	|String	|An indexed copy of the Source column, to allow for easier filtering.
|Timestamp	|DateTime	|The time and date the message was added to the log.</br></br>This is used for optimistic concurrency checks (**ConcurrencyMode**=*fixed*). For information on optimistic concurrency checks, see [Optimistic Concurrency](http://go.microsoft.com/fwlink/p/?LinkId=403783).
|ExtraInformation	|String	|Link to any attachments stored as a blob (for any MessageDetails information that is larger than 64 KB). To retrieve an attachment, you can paste the link into a browser. If prompted, enter the credentials that you used to connect to the data endpoint.
|Message	|String	|The actual message text.
|MessageDetails	|String	|Additional context information. If this additional information is larger than 64 KB, there will be a link in the ExtraInformation column.
|MessageType	|String	|The classification of the message. This is usually **Information**, **Error**, or **Critical**..
|Scope	|String	|The scope of the message. Since most messages pertain to a particular device, this is usually the device ID.
|Source	|String	|The source of the message. This is usually the application name and version (if the message came from a device) or **Processing Engine** (if the message came from the service).
 
>[AZURE.NOTE] Some columns in the **Diagnostics** data source are followed by a timestamp column named *<Column name>_dt*. These timestamp columns indicate when the main column was last updated. The *<Column name>_dt* columns are mainly for system use. 
