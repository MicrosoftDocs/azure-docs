---
title: "Data type map for indexers in Azure Search"
ms.custom: ""
ms.date: "2018-05-01"
ms.prod: "azure"
ms.reviewer: ""
ms.service: "search"
ms.suite: ""
ms.tgt_pltfrm: ""
ms.topic: "language-reference"
applies_to:
  - "Azure"
ms.assetid: 4350e176-696f-4a89-b4bb-794ace3c251e
caps.latest.revision: 10
author: "Brjohnstmsft"
ms.author: "brjohnst"
manager: "jhubbard"
translation.priority.mt:
  - "de-de"
  - "es-es"
  - "fr-fr"
  - "it-it"
  - "ja-jp"
  - "ko-kr"
  - "pt-br"
  - "ru-ru"
  - "zh-cn"
  - "zh-tw"
---
# Data type map for indexers in Azure Search
  When building a schema for an indexer, the data types used in the data source must map to an allowed data type for the fields in the target index.  

 This topic provides data type comparisons between SQL Data Types, JSON data types, and Azure Search. It contains the following:  

-   [SQL Server Data Types to Azure Search Data Types](#bkmk_sql_search)  

-   [JSON Data Types to Azure Search Data Types](#bkmk_json_search)  

 See [Indexer operations &#40;Azure Search Service REST API&#41;](indexer-operations.md) for links to topics about **indexers** and **data sources**.  

##  <a name="bkmk_sql_search"></a> SQL Server Data Types to Azure Search Data Types  

|SQL Server Data Type|Allowed target index field types|Notes|  
|--------------------------|--------------------------------------|-----------|  
|bit|Edm.Boolean, Edm.String||  
|int, smallint, tinyint|Edm.Int32, Edm.Int64, Edm.String||  
|bigint|Edm.Int64, Edm.String||  
|real, float|Edm.Double, Edm.String||  
|smallmoney, money<br /><br /> decimal<br /><br /> numeric|Edm.String|Azure Search does not support converting decimal types into Edm.Double because doing so would lose precision.|  
|char, nchar, varchar, nvarchar|Edm.String <br /><br/>Collection(Edm.String). See [Field Mapping Functions](create-indexer.md#FieldMappingFunctions) for details on how to transform a string column into a Collection(Edm.String)|  
|smalldatetime, datetime, datetime2, date, datetimeoffset|Edm.DateTimeOffset, Edm.String||  
|uniqueidentifer|Edm.String||  
|rowversion|N/A|Row-version columns cannot be stored in the search index, but they can be used for change tracking.|  
|geography|Edm.GeographyPoint|Only geography instances of type POINT with SRID 4326 (which is the default) are supported.|  
|time, timespan<br /><br /> varbinary<br /><br /> image<br /><br /> xml<br /><br /> geometry<br /><br /> CLR types|N/A|Not supported.|  

##  <a name="bkmk_json_search"></a> JSON Data Types to Azure Search Data Types  

|JSON data type|Allowed target index field types|  
|--------------------|--------------------------------------|  
|bool|Edm.Boolean, Edm.String|  
|Integral numbers|Edm.Int32, Edm.Int64, Edm.String|  
|Floating-point numbers|Edm.Double, Edm.String|  
|string|Edm.String|  
|arrays of primitive types, e.g. [ "a", "b", "c" ]|Collection(Edm.String)|  
|Strings that look like dates|Edm.DateTimeOffset, Edm.String|  
|GeoJSON point objects|Edm.GeographyPoint<br /><br /> GeoJSON points are JSON objects in the following format: {"type" : "Point", "coordinates": [long], [lat] }|  
|JSON objects|N/A<br /><br /> Not supported; Azure Search currently supports only primitive types and string collections|  


