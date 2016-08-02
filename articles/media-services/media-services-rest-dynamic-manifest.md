<properties 
	pageTitle="Creating Filters with Azure Media Services REST API" 
	description="This topic describes how to create filters so your client can use them to stream specific sections of a stream. Media Services creates dynamic manifests to achieve this selective streaming."
	services="media-services" 
	documentationCenter="" 
	authors="Juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="ne" 
	ms.topic="article" 
	ms.date="06/22/2016"  
	ms.author="juliako;cenkdin"/>

#Creating Filters with Azure Media Services REST API

> [AZURE.SELECTOR]
- [.NET](media-services-dotnet-dynamic-manifest.md)
- [REST](media-services-rest-dynamic-manifest.md)


Starting with 2.11 release, Media Services enables you to define filters for your assets. These filters are server side rules that will allow your customers to choose to do things like: playback only a section of a video (instead of playing the whole video), or specify only a subset of audio and video renditions that your customer's device can handle (instead of all the renditions that are associated with the asset). This filtering of your assets is archived through **Dynamic Manifest**s that are created upon your customer's request to stream a video based on specified filter(s).

For more detailed information related to filters and Dynamic Manifest, see [Dynamic manifests overview](media-services-dynamic-manifest-overview.md).

This topic shows how to use REST APIs to create, update, and delete filters. 

##Types used to create filters

The following types are used when creating filters:  

- [Filter](http://msdn.microsoft.com/library/azure/mt149056.aspx)
- [AssetFilter](http://msdn.microsoft.com/library/azure/mt149053.aspx)
- [PresentationTimeRange](http://msdn.microsoft.com/library/azure/mt149052.aspx)
- [FilterTrackSelect and FilterTrackPropertyCondition](http://msdn.microsoft.com/library/azure/mt149055.aspx)



>[AZURE.NOTE] When working with the Media Services REST API, the following considerations apply:
>
>When accessing entities in Media Services, you must set specific header fields and values in your HTTP requests. For more information, see [Setup for Media Services REST API Development](media-services-rest-how-to-use.md).

>After successfully connecting to https://media.windows.net, you will receive a 301 redirect specifying another Media Services URI. You must make subsequent calls to the new URI as described in [Connecting to Media Services using REST API](media-services-rest-connect-programmatically.md). 


##Create filters

###Create global Filters

To create a global Filter, use the following HTTP requests:  

####HTTP Request

Request Headers

	POST https://media.windows.net/API/Filters HTTP/1.1 
	DataServiceVersion:3.0 
	MaxDataServiceVersion: 3.0 
	Content-Type: application/json 
	Accept: application/json 
	Accept-Charset: UTF-8 
	Authorization: Bearer <token value> 
	x-ms-version: 2.11 
	x-ms-client-request-id: 00000000-0000-0000-0000-000000000000 
	Host:media.windows.net 

Request body 

	{  
	   "Name":"GlobalFilter",
	   "PresentationTimeRange":{  
	      "StartTimestamp":"0",
	      "EndTimestamp":"9223372036854775807",
	      "PresentationWindowDuration":"12000000000",
	      "LiveBackoffDuration":"0",
	      "Timescale":"10000000"
	   },
	   "Tracks":[  
	      {  
	         "PropertyConditions":
	              [  
	            {  
	               "Property":"Type",
	               "Value":"audio",
	               "Operator":"Equal"
	            },
	            {  
	               "Property":"Bitrate",
	               "Value":"0-2147483647",
	               "Operator":"Equal"
	            }
	         ]
	      }
	   ]
	}




####HTTP Response
	
	HTTP/1.1 201 Created 

###Create local AssetFilters

To create a local AssetFilter, use the following HTTP requests:  

####HTTP Request

Request Headers

	POST https://media.windows.net/API/AssetFilters HTTP/1.1 
	DataServiceVersion: 3.0 
	MaxDataServiceVersion: 3.0 
	Content-Type: application/json 
	Accept: application/json 
	Accept-Charset: UTF-8 
	Authorization: Bearer <token value> 
	x-ms-version: 2.11 
	x-ms-client-request-id: 00000000-0000-0000-0000-000000000000 
	Host: media.windows.net  

Request body 

	{   
	   "Name":"AssetFilter", 
	   "ParentAssetId":"nb:cid:UUID:536e555d-1500-80c3-92dc-f1e4fdc6c592", 
	   "PresentationTimeRange":{   
	      "StartTimestamp":"0", 
	      "EndTimestamp":"9223372036854775807", 
	      "PresentationWindowDuration":"12000000000", 
	      "LiveBackoffDuration":"0", 
	      "Timescale":"10000000" 
	   }, 
	   "Tracks":[   
	      {   
	         "PropertyConditions": 
	              [   
	            {   
	               "Property":"Type", 
	               "Value":"audio", 
	               "Operator":"Equal" 
	            }, 
	            {   
	               "Property":"Bitrate", 
	               "Value":"0-2147483647", 
	               "Operator":"Equal" 
	            } 
	         ] 
	      } 
	   ] 
	} 

####HTTP Response 

	HTTP/1.1 201 Created 
	. . . 

##List filters

###Get all global **Filter**s in the AMS account

To list filters, use the following HTTP requests: 

####HTTP Request
	 
	GET https://media.windows.net/API/Filters HTTP/1.1 
	DataServiceVersion:3.0 
	MaxDataServiceVersion: 3.0 
	Accept: application/json 
	Accept-Charset: UTF-8 
	Authorization: Bearer <token value> 
	x-ms-version: 2.11 
	Host: media.windows.net 
	
### Get **AssetFilter**s associated with an asset

####HTTP Request

	GET https://media.windows.net/API/Assets('nb%3Acid%3AUUID%3A536e555d-1500-80c3-92dc-f1e4fdc6c592')/AssetFilters HTTP/1.1 
	DataServiceVersion: 3.0 
	MaxDataServiceVersion: 3.0 
	Accept: application/json 
	Accept-Charset: UTF-8 
	Authorization: Bearer <token value> 
	x-ms-version: 2.11 
	x-ms-client-request-id: 00000000-0000-0000-0000-000000000000 
	Host: media.windows.net 

###Get an **AssetFilter** based on its Id

####HTTP Request

	GET https://media.windows.net/API/AssetFilters('nb%3Acid%3AUUID%3A536e555d-1500-80c3-92dc-f1e4fdc6c592__%23%23%23__TestFilter') HTTP/1.1 
	DataServiceVersion: 3.0 
	MaxDataServiceVersion: 3.0 
	Accept: application/json 
	Accept-Charset: UTF-8 
	Authorization: Bearer <token value> 
	x-ms-version: 2.11 
	x-ms-client-request-id: 00000000


##Update filters
 
Use PATCH, PUT or MERGE to update a filter with new property values.  For more information about these operations, see [PATCH, PUT, MERGE](http://msdn.microsoft.com/library/dd541276.aspx).
 
If you update a filter, it can take up to 2 minutes for streaming endpoint to refresh the rules. If the content was served using this filter (and cached in proxies and CDN caches), updating this filter can result in player failures. It is recommend to clear the cache after updating the filter. If this option is not possible, consider using a different filter.  
 
###Update global Filters

To update a global filter, use the following HTTP requests: 

####HTTP Request
 
Request headers: 

	MERGE https://media.windows.net/API/Filters('filterName') HTTP/1.1 
	DataServiceVersion:3.0 
	MaxDataServiceVersion: 3.0 
	Content-Type: application/json 
	Accept: application/json 
	Accept-Charset: UTF-8 
	Authorization: Bearer <token value> 
	x-ms-version: 2.11 
	x-ms-client-request-id: 00000000-0000-0000-0000-000000000000 
	Host: media.windows.net 
	Content-Length: 384
	
Request body: 
	
	{ 
	   "Tracks":[   
	      {   
	         "PropertyConditions": 
	         [   
	            {   
	               "Property":"Type", 
	               "Value":"audio", 
	               "Operator":"Equal" 
	            }, 
	            {   
	               "Property":"Bitrate", 
	               "Value":"0-2147483647", 
	               "Operator":"Equal" 
	            } 
	         ] 
	      } 
	   ] 
	} 

###Update local AssetFilters

To update a local filter, use the following HTTP requests: 

####HTTP Request

Request headers: 

	MERGE https://media.windows.net/API/AssetFilters('nb%3Acid%3AUUID%3A536e555d-1500-80c3-92dc-f1e4fdc6c592__%23%23%23__TestFilter')  HTTP/1.1 
	DataServiceVersion: 3.0 
	MaxDataServiceVersion: 3.0 
	Content-Type: application/json 
	Accept: application/json 
	Accept-Charset: UTF-8 
	Authorization: Bearer <token value> 
	x-ms-version: 2.11 
	x-ms-client-request-id: 00000000-0000-0000-0000-000000000000 
	Host: media.windows.net 
	
Request body: 
	
	{ 
	   "Tracks":[   
	      {   
	         "PropertyConditions": 
	         [   
	            {   
	               "Property":"Type", 
	               "Value":"audio", 
	               "Operator":"Equal" 
	            }, 
	            {   
	               "Property":"Bitrate", 
	               "Value":"0-2147483647", 
	               "Operator":"Equal" 
	            } 
	         ] 
	      } 
	   ] 
	} 


##Delete filters


###Delete global Filters

To delete a global Filter, use the following HTTP requests:
	
####HTTP Request

	DELETE https://media.windows.net/api/Filters('GlobalFilter') HTTP/1.1 
	DataServiceVersion:3.0 
	MaxDataServiceVersion: 3.0 
	Accept: application/json 
	Accept-Charset: UTF-8 
	Authorization: Bearer <token value> 
	x-ms-version: 2.11 
	Host: media.windows.net 


###Delete local AssetFilters

To delete a local AssetFilter, use the following HTTP requests:

####HTTP Request

	DELETE https://media.windows.net/API/AssetFilters('nb%3Acid%3AUUID%3A536e555d-1500-80c3-92dc-f1e4fdc6c592__%23%23%23__LocalFilter') HTTP/1.1 
	DataServiceVersion: 3.0 
	MaxDataServiceVersion: 3.0 
	Accept: application/json 
	Accept-Charset: UTF-8 
	Authorization: Bearer <token value> 
	x-ms-version: 2.11 
	Host: media.windows.net 

##Build streaming URLs that use filters

For information on how to publish and deliver your assets, see [Delivering Content to Customers Overview](media-services-deliver-content-overview.md).


The following examples show how to add filters to your streaming URLs.

**MPEG DASH** 

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=mpd-time-csf, filter=MyFilter)

**Apple HTTP Live Streaming (HLS) V4**

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=m3u8-aapl, filter=MyFilter)

**Apple HTTP Live Streaming (HLS) V3**

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=m3u8-aapl-v3, filter=MyFilter)

**Smooth Streaming**

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(filter=MyFilter)


**HDS**

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=f4m-f4f, filter=MyFilter)


##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]


##See Also 

[Dynamic manifests overview](media-services-dynamic-manifest-overview.md)
 

 
