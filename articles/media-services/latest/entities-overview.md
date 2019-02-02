---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Filtering, ordering, paging of Azure Media Services entities - Azure | Microsoft Docs
description: This article discusses filtering, ordering, paging of Azure Media Services entities.  
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 01/24/2019
ms.author: juliako
ms.custom: seodec18

---

# Filtering, ordering, paging of Media Services entities 

Media Services supports the following OData query options for Assets, Content Key Policies, Jobs, ...: 

* $filter 
* $orderby 
* $top 
* $skiptoken 

Operator description:

* Eq = equal to
* Ne = not equal to
* Ge = Greater than or equal to
* Le = Less than or equal to
* Gt = Greater than
* Lt = Less than

## Assets

### Filtering/ordering

The following table shows how these options may be applied to the Asset properties: 

|Name|Filter|Order|
|---|---|---|
|id|||
|name|Supports: Eq, Gt, Lt|Supports: Ascending and Descending|
|properties.alternateId |Supports: Eq||
|properties.assetId |Supports: Eq||
|properties.container |||
|properties.created|Supports: Eq, Gt, Lt| Supports: Ascending and Descending|
|properties.description |||
|properties.lastModified |||
|properties.storageAccountName |||
|properties.storageEncryptionFormat | ||
|type|||


....


## Content Key Policies

...

## Jobs

...

.
.
.

## Next steps

[Stream a file](stream-files-dotnet-quickstart.md)
