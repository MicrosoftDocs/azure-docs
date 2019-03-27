---
title: Find request unit charge
description: Learn how to find the request unit charge when using the Gremlin API
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: sample
ms.date: 03/21/2019
ms.author: thweiss
---

# How to find the request unit charge when using the Gremlin API

This article explains how to find the request unit charge for operations executed against Azure Cosmos DB's Gremlin API.

Headers returned by the Gremlin API are mapped to custom status attributes which are currently surfaced by the Gremlin .NET and Java SDK. The request charge is available under the `x-ms-request-charge` key.

## From the Gremlin.NET SDK

```csharp
ResultSet<dynamic> results = client.SubmitAsync<dynamic>("g.V().count()").Result;
double requestCharge = (double)results.StatusAttributes["x-ms-request-charge"];
```

## From the Gremlin Java SDK

```java
ResultSet results = client.submit("g.V().count()");
Double requestCharge = (Double)results.statusAttributes().get().get("x-ms-request-charge");
```