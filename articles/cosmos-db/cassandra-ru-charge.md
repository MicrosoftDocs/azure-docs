---
title: Find request unit charge
description: Learn how to find the request unit charge when using the Cassandra API
author: ThomasWeiss
ms.service: cosmos-db
ms.topic: sample
ms.date: 03/21/2019
ms.author: thweiss
---

This article explains how to find the request unit charge for operations executed against Azure Cosmos DB's Cassandra API.

When performing operations against Cosmos DB's Cassandra API, request unit charge is returned in the incoming payload as a field named `RequestCharge`.

# Finding the request unit charge from the DataStax .NET SDK

```csharp
RowSet rowSet = session.Execute("SELECT ALL");
double requestCharge = BitConverter.ToDouble(rowSet.Info.IncomingPayload["RequestCharge"], 0);
```

# Finding the request unit charge from the DataStax Java SDK

```java
ResultSet resultSet = session.execute("SELECT ALL");
Double requestCharge = resultSet.getExecutionInfo().getIncomingPayload().get("RequestCharge").getDouble();
```