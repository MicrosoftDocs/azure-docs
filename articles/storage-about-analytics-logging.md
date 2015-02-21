<properties 
	pageTitle="About Storage Analytics Logging" 
	description="Learn how to use storage analytics log, authenticated and authenticated requests, how logs are stored " 
	services="storage" 
	documentationCenter="" 
	authors="tamram" 
	manager="adinah" 
	editor="cgronlun"/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="tamram"/>

# About Storage Analytics Logging

## Overview
Storage Analytics logs detailed information about successful and failed requests to a storage service. This information can be used to monitor individual requests and to diagnose issues with a storage service. Requests are logged on a best-effort basis.

To use Storage Analytics, you must enable it individually for each service you want to monitor. You can enable it from the [Azure Management Portal](https://manage.windowsazure.com/); for details, see [How To Monitor a Storage Account](../how-to-monitor-a-storage-account). You can also enable Storage Analytics programmatically via the REST API or the client library. Use the Get Blob Service Properties, Get Queue Service Properties, and Get Table Service Properties operations to enable Storage Analytics for each service.

Log entries are created only if there is storage service activity. For example, if a storage account has activity in its Blob service but not in its Table or Queue services, only logs pertaining to the Blob service will be created.

##Logging authenticated requests
The following types of authenticated requests are logged:

- Successful requests

- Failed requests, including timeout, throttling, network, authorization, and other errors

- Requests using a Shared Access Signature (SAS), including failed and successful requests

- Requests to analytics data

Requests made by Storage Analytics itself, such as log creation or deletion, are not logged. A full list of the logged data is documented in the [Storage Analytics Logged Operations and Status Messages](https://msdn.microsoft.com/en-us/library/hh343260.aspx) and [Storage Analytics Log Format](https://msdn.microsoft.com/en-us/library/hh343259.aspx) topics.

##Logging anonymous requests
The following types of anonymous requests are logged:

- Successful requests

- Server errors

- Timeout errors for both client and server

- Failed GET requests with error code 304 (Not Modified)

All other failed anonymous requests are not logged. A full list of the logged data is documented in the [Storage Analytics Logged Operations and Status Messages](https://msdn.microsoft.com/en-us/library/hh343260.aspx) and [Storage Analytics Log Format](](https://msdn.microsoft.com/en-us/library/hh343259.aspx)) topics.

##How logs are stored
All logs are stored in block blobs in a container named $logs, which is automatically created when Storage Analytics is enabled for a storage account. The $logs container is located in the blob namespace of the storage account, for example: `http://<accountname>.blob.core.windows.net/$logs`. This container cannot be deleted once Storage Analytics has been enabled, though its contents can be deleted.

>[Azure.NOTE] The $logs container is not displayed when a container listing operation is performed, such as the [ListContainers](https://msdn.microsoft.com/en-us/library/ee758348.aspx) method. It must be accessed directly. For example, you can use the [ListBlobs](https://msdn.microsoft.com/en-us/library/ee772878.aspx) method to access the blobs in the `$logs` container.
As requests are logged, Storage Analytics will upload intermediate results as blocks. Periodically, Storage Analytics will commit these blocks and make them available as a blob.

Duplicate records may exist for logs created in the same hour. You can determine if a record is a duplicate by checking the **RequestId** and **Operation** number.

##Log naming conventions
Each log will be written in the following format:

    <service-name>/YYYY/MM/DD/hhmm/<counter>.log 

The following table describes each attribute in the log name:

| Attribute      	| Description                                                                                                                                                                                	|
|----------------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| <service-name> 	| The name of the storage service. For example: blob, table, or queue                                                                                                                        	|
| YYYY           	| The four digit year for the log. For example: 2011                                                                                                                                         	|
| MM             	| The two digit month for the log. For example: 07                                                                                                                                           	|
| DD             	| The two digit month for the log. For example: 07                                                                                                                                           	|
| hh             	| The two digit hour that indicates the starting hour for the logs, in 24 hour UTC format. For example: 18                                                                                   	|
| mm             	| The two digit number that indicates the starting minute for the logs. >[AZURE.NOTE]This value is unsupported in the current version of Storage Analytics, and its value will always be 00. 	|
| <counter>      	| A zero-based counter with six digits that indicates the number of log blobs generated for the storage service in an hour time period. This counter starts at 000000. For example: 000001   	|

The following is a complete sample log name that combines the above examples:

    blob/2011/07/31/1800/000001.log

The following is a sample URI that can be used to access the above log:

    https://<accountname>.blob.core.windows.net/$logs/blob/2011/07/31/1800/000001.log 

When a storage request is logged, the resulting log name correlates to the hour when the requested operation completed. For example, if a GetBlob request was completed at 6:30PM on 7/31/2011, the log would be written with the following prefix: `blob/2011/07/31/1800/`

##Log metadata
All log blobs are stored with metadata that can be used to identify what logging data the blob contains. The following table describes each metadata attribute:

| Attribute  	| Description                                                                                                                                                                                                                                               	|
|------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| LogType    	| Describes whether the log contains information pertaining to read, write, or delete operations. This value can include one type or a combination of all three, separated by commas.   Example 1: write Example 2: read,write Example 3: read,write,delete 	|
| StartTime  	| The earliest time of an entry in the log, in the form of YYYY-MM-DDThh:mm:ssZ. For example: 2011-07-31T18:21:46Z                                                                                                                                          	|
| EndTime    	| The latest time of an entry in the log, in the form of YYYY-MM-DDThh:mm:ssZ. For example: 2011-07-31T18:22:09Z                                                                                                                                            	|
| LogVersion 	| The version of the log format. Currently the only supported value is: 1.0                                                                                                                                                                                 	|

The following list displays complete sample metadata using the above examples:

- LogType=write 

- StartTime=2011-07-31T18:21:46Z 

- EndTime=2011-07-31T18:22:09Z 

- LogVersion=1.0 

##Accessing logging data

All data in the `$logs` container can be accessed by using the Blob service APIs, including the .NET APIs provided by the Azure managed library. The storage account administrator can read and delete logs, but cannot create or update them. Both the log’s metadata and log name can be used when querying for a log. It is possible for a given hour’s logs to appear out of order, but the metadata always specifies the timespan of log entries in a log. Therefore, you can use a combination of log names and metadata when searching for a particular log.

##Next steps

[Storage Analytics Log Format](https://msdn.microsoft.com/en-us/library/hh343259.aspx) 

[Storage Analytics Logged Operations and Status Messages](https://msdn.microsoft.com/en-us/library/hh343260.aspx) 

[About Storage Analytics Metrics](https://msdn.microsoft.com/en-us/library/hh343258.aspx) 