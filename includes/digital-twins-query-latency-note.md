---
author: baanders
description: include for query API latency note
ms.service: digital-twins
ms.topic: include
ms.date: 09/21/2021
ms.author: baanders
---

>[!NOTE]
>After making a change to the data in your graph, there may be a latency of up to 10 seconds before the changes will be reflected in queries. 
>
>The [DigitalTwins API](../articles/digital-twins/concepts-apis-sdks.md#data-plane-apis) reflects changes immediately, so if you need an instant response, use an API request ([DigitalTwins GetById](/rest/api/digital-twins/dataplane/twins/digitaltwins_getbyid)) or an SDK call ([GetDigitalTwin](/dotnet/api/azure.digitaltwins.core.digitaltwinsclient.getdigitaltwin?view=azure-dotnet&preserve-view=true)) to get twin data instead of a query.