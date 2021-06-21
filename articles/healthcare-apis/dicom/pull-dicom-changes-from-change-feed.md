---
title:  Pull DICOM changes using the Change Feed 
description: This how-to guide explains how to pull DICOM changes using DICOM Change Feed for Azure Healthcare APIs.
author: stevewohl
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 06/21/2021
ms.author: aersoy
---

# Pull DICOM changes using the Change Feed

The DICOM Change Feed offers customers the ability to go through the history of the DICOM Service and act on the create and delete events in the service. This how-to guide describes how to consume Change Feed.

The Change Feed is accessed using REST APIs. These APIs along with sample usage of Change Feed are documented in the [Overview of DICOM Change Feed](overview_DICOM_change_feed.md).

## Consume Change Feed

The following C# code example shows how to consume Change Feed using the DICOM client package.

```csharp
public async Task<IReadOnlyList<ChangeFeedEntry>> RetrieveChangeFeedAsync(long offset, CancellationToken cancellationToken)
{
    var _dicomWebClient = new DicomWebClient(
                    new HttpClient { BaseAddress = dicomWebConfiguration.Endpoint },
                    sp.GetRequiredService<RecyclableMemoryStreamManager>(),
                    tokenUri: null);
    DicomWebResponse<IReadOnlyList<ChangeFeedEntry>> result = await _dicomWebClient.GetChangeFeed(
    $"?offset={offset}&limit={DefaultLimit}&includeMetadata={true}",
    cancellationToken);

    if (result?.Value != null)
    {
            return result.Value;
    }

    return Array.Empty<ChangeFeedEntry>();
}
```
To view and access the **ChangeFeedRetrieveService.cs** code example, see [Consume Change Feed](../../converter/dicom-cast/src/Microsoft.Health.DicomCast.Core/Features/DicomWeb/Service/ChangeFeedRetrieveService.cs).

 

### Next Steps

This how-to guide describes how to consume Change Feed. Change Feed allows you to monitor the history of the  DICOM Service. For more information about DICOM Services, see 

>[!div class="nextstepaction"]
>[Overview of DICOM Services](concepts_dicom_overview.md)
