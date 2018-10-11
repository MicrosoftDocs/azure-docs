---
title: Quotas and limitations in Azure Media Services v3 | Microsoft Docs
description: This topic describes quotas and limitations in Azure Media Services v3
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 08/26/2018
ms.author: juliako
---

# Quotas and limitations in Azure Media Services v3

This article describes quotas and limitations in Azure Media Services v3.

| Resource | Default Limit | 
| --- | --- | 
| Assets per Azure Media Services account | 1,000,000|
| Dynamic Manifest Filters|100|
| JobInputs per Job | 50  (fixed)|
| JobOutputs per Job/TransformOutputs in a Transform | 20 (fixed) |
| Files per JobInput|10 (fixed)|
| File size| In some scenarios, there is a limit on the maximum file size supported for processing in Media Services. <sup>(1)</sup> |
| Jobs per Media Services account | 500,000 <sup>(2)</sup> (fixed)|
| Listing Transforms|Paginate the response, with 1000 Transforms per page|
| Listing Jobs|Paginate the response, with 500 Jobs per page|
| LiveEvents per Media Services account |5|
| Media Services accounts in a single subscription | 25 (fixed) |
| LiveOutputs in running state per LiveEvent |3|
| Storage accounts | 100<sup>(4)</sup> (fixed) |
| Streaming Endpoints in running state per Media Services account|2|
| StreamingPolicies | 100 <sup>(3)</sup> |
| Transforms per Media Services account | 100  (fixed)|
| Unique StreamingLocators associated with an Asset at one time | 100<sup>(5)</sup> (fixed) |

<sup>1</sup> The maximum size supported for a single blob is currently up to 5 TB in Azure Blob Storage. However, additional limits apply in Azure Media Services based on the VM sizes that are used by the service. If your source file is larger than 260-GB, your Job will likely fail. If you have 4K content that is larger than 260-GB limit, contact us at amshelp@microsoft.com for potential mitigations to support your scenario.

<sup>2</sup> This number includes queued, finished, active, and canceled Jobs. It does not include deleted Jobs. 

Any Job record in your account older than 90 days will be automatically deleted, even if the total number of records is below the maximum quota. 

<sup>3</sup> When using a custom [StreamingPolicy](https://docs.microsoft.com/rest/api/media/streamingpolicies), you should design a limited set of such policies for your Media Service account, and re-use them for your StreamingLocators whenever the same encryption options and protocols are needed. You should not be creating a new StreamingPolicy for each StreamingLocator.

<sup>4</sup> The storage accounts must be from the same Azure subscription.

<sup>5</sup> StreamingLocators are not designed for managing per-user access control. To give different access rights to individual users, use Digital Rights Management (DRM) solutions.

## Support ticket

For resources that are not fixed, you may ask for the quotas to be raised, by opening a [support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Include detailed information in the request on the desired quota changes, use-case scenarios, and regions required. <br/>Do **not** create additional Azure Media Services accounts in an attempt to obtain higher limits.

## Next steps

[Overview](media-services-overview.md)
