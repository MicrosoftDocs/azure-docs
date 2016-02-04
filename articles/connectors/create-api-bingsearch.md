<properties
	pageTitle="Add the Bing Search API in PowerApps or logic apps | Microsoft Azure"
	description="Overview of the Bing Search API with REST API parameters"
	services=""
    suite=""
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service=""
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="02/04/2016"
   ms.author="mandia"/>

# Get started with the Bing Search API 
Connect to Bing Search to search news, search videos, and more. 

The Bing Search API can be used from PowerApps and logic apps. 

With Bing Search, you can: 

- Build your business flow based on the data you get from your search. 
- Use actions to search images, search the news, and more. These actions get a response, and then make the output available for other actions. For example, you can search for a video, and then use Twitter to post that video to a Twitter feed.
- Add the API to PowerApps Enterprise. Then, your users can use this API within their apps. 

For information on how to add an API in PowerApps Enterprise, go to [Register an API in PowerApps](..powerapps-register-from-available-apis.md). To add an operation in logic apps, see [Create a logic app](..app-service-logic-create-a-logic-app.md).

## Triggers and actions
Bing Search includes the following actions. There are no triggers. 

Triggers | Actions
--- | ---
None | <ul><li>Search web</li><li>Search videos</li><li>Search images</li><li>Search news</li><li>Search related</li><li>Search spellings</li><li>Search all</li></ul>

All APIs support data in JSON and XML formats.

## Add additional configuration
When you add Bing Search to PowerApps Enterprise, you are prompted for an account key. If you don't have a Bing Search key, use the free [Bing Search offer](https://datamarket.azure.com/dataset/bing/search) to get one. 


## Swagger REST API reference

### Search web 
Retrieves web sites from a Bing search.  
```GET: /Web```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|query|string|yes|query|none |Text to search for (example: 'xbox')|
|maxResult|integer|no|query|none |Maximum number of results to return|
|startOffset|integer|no|query| none|Number of results to skip|
|adultContent|string|no|query|none |Adult content filter. Valid values: <ul><li>Off</li><li>Moderate</li><li>Strict</li></ul>|
|market|string|no|query|none |Market or region to narrow the search (example: en-US)|
|longitude|number|no|query| none|Longitude (east/west coordinate) to narrow the search (example: 47.603450)|
|latitude|number|no|query| none|Latitude (north/south coordinate) to narrow the search (example: -122.329696)|
|webFileType|string|no|query|none |File type to narrow the search (example: 'DOC')|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Search videos 
Retrieves videos from a Bing search.  
```GET: /Video```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|query|string|yes|query|none |Text to search for (example: 'xbox')|
|maxResult|integer|no|query| none|Maximum number of results to return|
|startOffset|integer|no|query|none |Number of results to skip|
|adultContent|string|no|query|none |Adult content filter. Valid values: <ul><li>Off</li><li>Moderate</li><li>Strict</li></ul>|
|market|string|no|query|none |Market or region to narrow the search (example: en-US)|
|longitude|number|no|query|none |Longitude (east/west coordinate) to narrow the search (example: 47.603450)|
|latitude|number|no|query|none |Latitude (north/south coordinate) to narrow the search (example: -122.329696)|
|videoFilters|string|no|query|none |Filter search based on size, aspect, color, style, face or any combination thereof.  Valid values: <ul><li>Duration:Short</li><li>Duration:Medium</li><li>Duration:Long</li><li>Aspect:Standard</li><li>Aspect:Widescreen</li><li>Resolution:Low</li><li>Resolution:Medium</li><li>Resolution:High</li></ul> <p>For example: 'Duration:Short+Resolution:High'</p>|
|videoSortBy|string|no|query|none |Sort order for results. Valid values: <ul><li>Date</li><li>Relevance</li></ul> <p>Date sort order implies descending.</p>|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Search images    
Retrieves images from a Bing search.  
```GET: /Image```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|query|string|yes|query|none |Text to search for (example: 'xbox')|
|maxResult|integer|no|query|none |Maximum number of results to return|
|startOffset|integer|no|query|none |Number of results to skip|
|adultContent|string|no|query|none |Adult content filter. Valid values: <ul><li>Off</li><li>Moderate</li><li>Strict</li></ul>|
|market|string|no|query|none |Market or region to narrow the search (example: en-US)|
|longitude|number|no|query| none|Longitude (east/west coordinate) to narrow the search (example: 47.603450)|
|latitude|number|no|query|none |Latitude (north/south coordinate) to narrow the search (example: -122.329696)|
|imageFilters|string|no|query|none |Filter search based on size, aspect, color, style, face or any combination thereof. Valid values: <ul><li>Size:Small</li><li>Size:Medium</li><li>Size:Large</li><li>Size:Width:[Width]</li><li>Size:Height:[Height]</li><li>Aspect:Square</li><li>Aspect:Wide</li><li>Aspect:Tall</li><li>Color:Color</li><li>Color:Monochrome</li><li>Style:Photo</li><li>Style:Graphics</li><li>Face:Face</li><li>Face:Portrait</li><li>Face:Other</li></ul><p>For example: 'Size:Small+Aspect:Square'</p>|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Search news    
Retrieves news results from a Bing search.  
```GET: /News```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|query|string|yes|query|none |Text to search for (example: 'xbox')|
|maxResult|integer|no|query|none |Maximum number of results to return|
|startOffset|integer|no|query| none|Number of results to skip|
|adultContent|string|no|query|none |Adult content filter. Valid values: <ul><li>Off</li><li>Moderate</li><li>Strict</li></ul>|
|market|string|no|query|none |Market or region to narrow the search (example: en-US)|
|longitude|number|no|query|none |Longitude (east/west coordinate) to narrow the search (example: 47.603450)|
|latitude|number|no|query|none |Latitude (north/south coordinate) to narrow the search (example: -122.329696)|
|newsSortBy|string|no|query| none|Sort order for results. Valid values: <ul><li>Date</li><li>Relevance</li></ul> <p>Date sort order implies descending.</p>|
|newsCategory|string|no|query| |Category of news to narrow the search (example: 'rt_Business')|
|newsLocationOverride|string|no|query|none |Override for Bing location detection. This parameter is only applicable in en-US market. The format for input is US./<state /> (example: 'US.WA')|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Search spellings    
Retrieves spelling suggestions.  
```GET: /SpellingSuggestions```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|query|string|yes|query| none|Text to search for (example: 'xbox')|
|maxResult|integer|no|query|none |Maximum number of results to return|
|startOffset|integer|no|query| none|Number of results to skip|
|adultContent|string|no|query|none |Adult content filter. Valid values: <ul><li>Off</li><li>Moderate</li><li>Strict</li></ul>|
|market|string|no|query| none|Market or region to narrow the search (example: en-US)|
|longitude|number|no|query|none |Longitude (east/west coordinate) to narrow the search (example: 47.603450)|
|latitude|number|no|query|none |Latitude (north/south coordinate) to narrow the search (example: -122.329696)|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Search related    
Retrieves related search results from a Bing search.  
```GET: /RelatedSearch```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|query|string|yes|query|none |Text to search for (example: 'xbox')|
|maxResult|integer|no|query|none |Maximum number of results to return|
|startOffset|integer|no|query| none|Number of results to skip|
|adultContent|string|no|query|none |Adult content filter. Valid values: <ul><li>Off</li><li>Moderate</li><li>Strict</li></ul>|
|market|string|no|query|none |Market or region to narrow the search (example: en-US)|
|longitude|number|no|query|none |Longitude (east/west coordinate) to narrow the search (example: 47.603450)|
|latitude|number|no|query| none|Latitude (north/south coordinate) to narrow the search (example: -122.329696)|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


### Search all    
Retrieves all web sites, videos, images, etc. from a Bing search.  
```GET: /CompositeSearch```

| Name| Data Type|Required|Located In|Default Value|Description|
| ---|---|---|---|---|---|
|query|string|yes|query|none |Text to search for (example: 'xbox')|
|maxResult|integer|no|query|none |Maximum number of results to return|
|startOffset|integer|no|query|none |Number of results to skip|
|adultContent|string|no|query|none |Adult content filter. Valid values: <ul><li>Off</li><li>Moderate</li><li>Strict</li></ul>|
|market|string|no|query|none |Market or region to narrow the search (example: en-US)|
|longitude|number|no|query|none |Longitude (east/west coordinate) to narrow the search (example: 47.603450)|
|latitude|number|no|query|none |Latitude (north/south coordinate) to narrow the search (example: -122.329696)|
|webFileType|string|no|query|none |File type to narrow the search (example: 'DOC')|
|videoFilters|string|no|query|none |Filter search based on size, aspect, color, style, face or any combination thereof.  Valid values: <ul><li>Duration:Short</li><li>Duration:Medium</li><li>Duration:Long</li><li>Aspect:Standard</li><li>Aspect:Widescreen</li><li>Resolution:Low</li><li>Resolution:Medium</li><li>Resolution:High</li></ul> <p>For example: 'Duration:Short+Resolution:High'</p>|
|videoSortBy|string|no|query|none |Sort order for results. Valid values: <ul><li>Date</li><li>Relevance</li></ul> <p>Date sort order implies descending.</p>|
|imageFilters|string|no|query|none |Filter search based on size, aspect, color, style, face or any combination thereof. Valid values: <ul><li>Size:Small</li><li>Size:Medium</li><li>Size:Large</li><li>Size:Width:[Width]</li><li>Size:Height:[Height]</li><li>Aspect:Square</li><li>Aspect:Wide</li><li>Aspect:Tall</li><li>Color:Color</li><li>Color:Monochrome</li><li>Style:Photo</li><li>Style:Graphics</li><li>Face:Face</li><li>Face:Portrait</li><li>Face:Other</li></ul><p>For example: 'Size:Small+Aspect:Square'</p>|
|newsSortBy|string|no|query|none |Sort order for results. Valid values: <ul><li>Date</li><li>Relevance</li></ul> <p>Date sort order implies descending.</p>|
|newsCategory|string|no|query|none |Category of news to narrow the search (example: 'rt_Business')|
|newsLocationOverride|string|no|query|none |Override for Bing location detection. This parameter is only applicable in en-US market. The format for input is US./<state /> (example: 'US.WA')|

#### Response
|Name|Description|
|---|---|
|200|OK|
|default|Operation Failed.|


## Next steps

After you add the Bing Search API to PowerApps Enterprise, [give users permissions](../powerapps-manage-api-connection-user-access.md) to use the API in their apps.

[Create a logic app](..app-service-logic-create-a-logic-app.md).
