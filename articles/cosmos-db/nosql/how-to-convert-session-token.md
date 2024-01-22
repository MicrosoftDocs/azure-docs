---
title: How to convert session token formats in .NET SDK - Azure Cosmos DB
description: Learn how to convert session token formats to ensure compatibilities between different .NET SDK versions
author: vinhms
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 04/30/2020
ms.author: vitrinh
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
---

# Convert session token formats in .NET SDK
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article explains how to convert between different session token formats to ensure compatibility between SDK versions.

> [!NOTE]
> By default, the SDK keeps track of the session token automatically and it will use the most recent session token.  For more information, please visit [Utilize session tokens](how-to-manage-consistency.md#utilize-session-tokens). The instructions in this article only apply with the following conditions:
> * Your Azure Cosmos DB account uses Session consistency.
> * You are managing the session tokens manually.
> * You are using multiple versions of the SDK at the same time.

## Session token formats

There are two session token formats: **simple** and **vector**.  These two formats are not interchangeable so, the format should be converted when passing to the client application with different versions.
- The **simple** session token format is used by the .NET SDK V1 (Microsoft.Azure.DocumentDB -version 1.x)
- The **vector** session token format is used by the .NET SDK V2 (Microsoft.Azure.DocumentDB -version 2.x)

### Simple session token

A simple session token has this format: `{pkrangeid}:{globalLSN}`

### Vector session token

A vector session token has the following format: 
`{pkrangeid}:{Version}#{GlobalLSN}#{RegionId1}={LocalLsn1}#{RegionId2}={LocalLsn2}....#{RegionIdN}={LocalLsnN}`

## Convert to Simple session token

To pass a session token to client using .NET SDK V1, use a **simple** session token format.  For example, use the following sample code to convert it.

```csharp
private static readonly char[] SegmentSeparator = (new[] { '#' });
private static readonly char[] PkRangeSeparator = (new[] { ':' });

// sessionTokenToConvert = session token from previous response
string[] items = sessionTokenToConvert.Split(PkRangeSeparator, StringSplitOptions.RemoveEmptyEntries);
string[] sessionTokenSegments = items[1].Split(SessionTokenHelpers.SegmentSeparator, StringSplitOptions.RemoveEmptyEntries);

string sessionTokenInSimpleFormat;

if (sessionTokenSegments.Length == 1)
{
    // returning the same token since it already has the correct format
    sessionTokenInSimpleFormat = sessionTokenToConvert;
}
else
{
    long version = 0;
    long globalLSN = 0;

    if (!long.TryParse(sessionTokenSegments[0], out version)
        || !long.TryParse(sessionTokenSegments[1], out globalLSN))
    {
        throw new ArgumentException("Invalid session token format", sessionTokenToConvert);
    }

    sessionTokenInSimpleFormat = string.Format("{0}:{1}", items[0], globalLSN);
}
```

## Convert to Vector session token

To pass a session token to client using .NET SDK V2, use the **vector** session token format.  For example, use the following sample code to convert it.

```csharp

private static readonly char[] SegmentSeparator = (new[] { '#' });
private static readonly char[] PkRangeSeparator = (new[] { ':' });

// sessionTokenToConvert = session token from previous response
string[] items = sessionTokenToConvert.Split(PkRangeSeparator, StringSplitOptions.RemoveEmptyEntries);
string[] sessionTokenSegments = items[1].Split(SegmentSeparator, StringSplitOptions.RemoveEmptyEntries);

string sessionTokenInVectorFormat;

if (sessionTokenSegments.Length == 1)
{
    long globalLSN = 0;
    if (long.TryParse(sessionTokenSegments[0], out globalLSN))
    {
        sessionTokenInVectorFormat = string.Format("{0}:-2#{1}", items[0], globalLSN);
    }
    else
    {
        throw new ArgumentException("Invalid session token format", sessionTokenToConvert);
    }
}
else
{
    // returning the same token since it already has the correct format
    sessionTokenInVectorFormat = sessionTokenToConvert;
}
```

## Next steps

Read the following articles:

* [Use session tokens to manage consistency in Azure Cosmos DB](how-to-manage-consistency.md#utilize-session-tokens)
* [Choose the right consistency level in Azure Cosmos DB](../consistency-levels.md)
* [Consistency, availability, and performance tradeoffs in Azure Cosmos DB](../consistency-levels.md)
* [Availability and performance tradeoffs for various consistency levels](../consistency-levels.md)
