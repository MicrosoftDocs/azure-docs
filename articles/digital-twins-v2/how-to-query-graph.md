---
# Mandatory fields.
title: Query the ADT graph
description: See how to get information out of an Azure Digital Twins (ADT) graph using the ADT query language.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/21/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Query the digital twin graph

Azure Digital Twins **Query APIs** let developers find sets of twins in the graph across relationships and applying filters.

Some example queries:

Get twins by properties
```sql
SELECT  * 
FROM DigitalTwins T  
WHERE T.$dtid in [‘123’, ‘456’]
AND T.firmwareVersion = ‘1.1’”
Get twins by model
SELECT  * 
FROM DigitalTwins T  
WHERE T.IS_OF_MODEL(T , ‘urn:contosocom:DigitalTwins:Space:3’)
AND T.roomSize > 50
```

Get twins by traversing relationships
```sql
SELECT *
FROM DigitalTwins space
JOIN device RELATED space.has  
WHERE space.$dtid = ‘Room 123’
AND device.$metadata.model = ‘urn:contosocom:DigitalTwins:MxChip:3’
AND has.role = ‘Operator’”
The following example shows how to execute queries:
var client = DigitalTwinsServiceClient.CreateFromConnectionString(“...”);
string results;
IAsynEnumerable<Result<JsonDocument>> result = client.Query(“querystring”);
```

This query returns results in the form of a JSON string. 
To parse the JSON results returned, use the JSON parser of your choice.