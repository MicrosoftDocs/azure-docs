---
title: How to convert session token formats in .NET SDK - Azure Cosmos DB
description: Learn how to convert session token formats to ensure compatibilities between different .NET SDK versions
author: 
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: vitrinh
---

# Convert session token formats in .NET SDK

This article explains how to convert between different session token formats to ensure compatibility between SDK versions.
> [!NOTE]
> By default, SDK with keeps track of the session token automatically and it will use the most recent session token.  For more information, please visit [Utilize session tokens](https://docs.microsoft.com/en-us/azure/cosmos-db/how-to-manage-consistency#utilize-session-tokens). This article only applies to the following conditions:
> * The Azure Cosmos DB account has Session consistency
> * The session tokens are managed manually
> * Multiple versions of the SDK are used at the same time

## Session token formats

There are session token formats: Simple and Vector.  Simple session token format is used by the .NET SDK V1 and Vector session token format is used by the .NET SDK V2.  These two formats are not interchangeable and will need to be converted when passing to client with different versions.

### Simple session token

Simple session token has this format: {pkrangeid}:{globalLSN}

### Vector session token

Vector session token has this format: {pkrangeid}:{Version}#{GlobalLSN}#{RegionId1}={LocalLsn1}#{RegionId2}={LocalLsn2}....#{RegionIdN}={LocalLsnN}

## Convert to Simple session token

When passing a session token to .NET SDK V1, we need to make sure that it is a simple session token format.  To ensure the right format, use the following sample to convert it.

```csharp
private static readonly char[] SegmentSeparator = (new[] { '#' });
private static readonly char[] PkRangeSeparator = (new[] { ':' });

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

When passing a session token to .NET SDK V2, we need to make sure that it is a vector session token format.  To ensure the right format, use the following sample to convert it.

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