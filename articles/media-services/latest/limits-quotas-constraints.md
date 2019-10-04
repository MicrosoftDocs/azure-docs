---
title: Quotas and limitations in Azure Media Services v3 | Microsoft Docs
description: This topic describes quotas and limitations in Azure Media Services v3
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 05/16/2019
ms.author: juliako
---

# Quotas and limitations in Azure Media Services v3

This article describes quotas and limitations in Azure Media Services v3.

| Resource | Default Limit | 
| --- | --- | 
| Assets per Azure Media Services account | 1,000,000|
| Dynamic Manifest Filters|100|
| JobInputs per Job | 50  (fixed)|
| JobOutputs per Job | 20 (fixed) |
| TransformOutputs in a Transform | 20 (fixed) |
| Files per JobInput|10 (fixed)|
| File size| In some scenarios, there is a limit on the maximum file size supported for processing in Media Services. <sup>(1)</sup> |
| Jobs per Media Services account | 500,000 <sup>(2)</sup> (fixed)|
| Listing Transforms|Paginate the response, with 1000 Transforms per page|
| Listing Jobs|Paginate the response, with 500 Jobs per page|
| Live Events per Media Services account |5|
| Media Services accounts in a single subscription | 25 (fixed) |
| Live Outputs per Live Event |3 <sup>(3)</sup> |
| Max Live Output duration | 25 hours |
| Storage accounts | 100<sup>(4)</sup> (fixed) |
| Streaming Endpoints (stopped or running) per Media Services account|2 (fixed)|
| Streaming Policies | 100 <sup>(5)</sup> |
| Transforms per Media Services account | 100  (fixed)|
| Unique Streaming Locators associated with an Asset at one time | 100<sup>(6)</sup> (fixed) |
| Options per Content Key Policy |30 | 
| Licenses per month for each of the DRM types on Media Services key delivery service per account|1,000,000|

<sup>1</sup> The maximum size supported for a single blob is currently up to 5 TB in Azure Blob Storage. Additional limits apply in Media Services based on the VM sizes that are used by the service. The size limit applies to the files that you upload and also the files that get generated as a result of Media Services processing (encoding or analyzing). If your source file is larger than 260-GB, your Job will likely fail. 

The following table shows the limits on the media reserved units S1, S2, and S3. If your source file is larger than the limits defined in the table, your encoding job fails. If you encode 4K resolution sources of long duration, you're required to use S3 media reserved units to achieve the performance needed. If you have 4K content that's larger than the 260-GB limit on the S3 media reserved units, contact us at amshelp@microsoft.com for potential mitigations to support your scenario.

|Media reserved unit type	|Maximum input size (GB)|
|---|---|
|S1 |	26|
|S2	| 60|
|S3	|260|

<sup>2</sup> This number includes queued, finished, active, and canceled Jobs. It does not include deleted Jobs. 

Any Job record in your account older than 90 days will be automatically deleted, even if the total number of records is below the maximum quota. 

<sup>3</sup> Live Outputs start on creation and stop when deleted.

<sup>4</sup> The storage accounts must be from the same Azure subscription.

<sup>5</sup> When using a custom [Streaming Policy](https://docs.microsoft.com/rest/api/media/streamingpolicies), you should design a limited set of such policies for your Media Service account, and re-use them for your StreamingLocators whenever the same encryption options and protocols are needed. You should not be creating a new Streaming Policy for each Streaming Locator.

<sup>6</sup> Streaming Locators are not designed for managing per-user access control. To give different access rights to individual users, use Digital Rights Management (DRM) solutions.

## Support ticket

For resources that are not fixed, you may ask for the quotas to be raised, by opening a [support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Include detailed information in the request on the desired quota changes, use-case scenarios, and regions required. <br/>Do **not** create additional Azure Media Services accounts in an attempt to obtain higher limits.

## Next steps

[Overview](media-services-overview.md)
