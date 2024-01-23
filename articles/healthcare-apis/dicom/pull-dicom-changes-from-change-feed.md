---
title:  Access DICOM Change Feed logs by using C# and the DICOM client package in Azure Health Data Services
description: Learn how to use C# code to consume Change Feed, a feature of the DICOM service that provides logs of all the changes in your organization's medical imaging data. The code example uses the DICOM client package to access and process the Change Feed.
author: mmitrik
ms.service: healthcare-apis
ms.subservice: dicom
ms.topic: how-to
ms.date: 1/18/2024
ms.author: mmitrik
---

# Access DICOM Change Feed logs by using C# and the DICOM client package

The Change Feed capability enables you to go through the history of the DICOM&reg; service and then act on the create and delete events. 

You access the Change Feed by using REST APIs. These APIs, along with sample usage of Change Feed, are documented in the [DICOM Change Feed overview](change-feed-overview.md). The version of the REST API should be explicitly specified in the request URL as described in the [API Versioning for DICOM service Documentation](api-versioning-dicom-service.md).

## Consume Change Feed

The C# code example shows how to consume Change Feed using the DICOM client package.

```csharp
const int limit = 10;
 
using HttpClient httpClient = new HttpClient { BaseAddress = new Uri("<URL>") };
using CancellationTokenSource tokenSource = new CancellationTokenSource();
 
int read;
List<ChangeFeedEntry> entries = new List<ChangeFeedEntry>();
DicomWebClient client = new DicomWebClient(httpClient);
do
{
    read = 0;
    DicomWebAsyncEnumerableResponse<ChangeFeedEntry> result = await client.GetChangeFeed(
        $"?offset={entries.Count}&limit={limit}&includeMetadata={true}",
        tokenSource.Token);
 
    await foreach (ChangeFeedEntry entry in result)
    {
        read++;
        entries.Add(entry);
    }
} while (read > 0);
```

To view and access the **ChangeFeedRetrieveService.cs** code example, see [Consume Change Feed](https://github.com/microsoft/dicom-server/blob/main/converter/dicom-cast/src/Microsoft.Health.DicomCast.Core/Features/DicomWeb/Service/ChangeFeedRetrieveService.cs).

## Next steps

For information, see the [DICOM service overview](dicom-services-overview.md).

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]
