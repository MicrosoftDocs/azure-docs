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
ms.date: 03/19/2018
ms.author: juliako
---

# Quotas and limitations in Azure Media Services v3

This topic describes quotas and limitations in Azure Media Services v3.

| Resource | Default Limit | 
| --- | --- | 
| Assets per Azure Media Services account | 1,000,000|
| JobInputs per Job | 100 |
| JobOutputs per Job | 30 (fixed) |
| File size| In some scenarios, there is a limit on the maximum file size supported for processing in Media Services. <sup>(1)</sup> |
| Jobs per Media Services account | 50,000<sup>(2)</sup> |
| LiveEvents per Media Services account |5|
| Media Services accounts in a single subscription | 25 (fixed) |
| StreamingPolicies | 1,000,000<sup>(3)</sup> |
| LiveOutputs in running state per LiveEvent |3|
| LiveOutputs in stopped state per LiveEvent |50|
| Storage accounts | 1,000<sup>(4)</sup> (fixed) |
| Streaming Endpoints in running state per Media Services account|2|
| Transforms per Media Services account | 20 |
| Unique StreamingLocators associated with an Asset at one time | 5<sup>(5)</sup> |
  
<sup>1</sup>The maximum size supported for a single blob is currently up to 5 TB in Azure Blob Storage. However, additional limits apply in Azure Media Services based on the VM sizes that are used by the service. If your source file is larger than 260 GB your Job will likely fail. If you have 4K content that is larger than 260 GB limit, contact us at amshelp@microsoft.com for potential mitigations to support your scenario.

<sup>2</sup> This number includes queued, finished, active, and canceled Jobs. It does not include deleted Jobs. 

Any Job record in your account older than 90 days will be automatically deleted, even if the total number of records is below the maximum quota. 

<sup>3</sup> There is a limit of 1,000,000 StreamingPolicy entries for different Media Services policies (for example, for StreamingLocator policy or ContentKeyAuthorizationPolicy). 

>[!NOTE]
> You should use the same policy ID if you are always using the same days / access permissions / etc. 

<sup>4</sup> The storage accounts must be from the same Azure subscription.

<sup>5</sup> StreamingLocators are not designed for managing per-user access control. To give different access rights to individual users, use Digital Rights Management (DRM) solutions.

## Support ticket

For resources that are not fixed, you may ask for the quotas to be raised, by opening a [support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Please include detailed information in the request on the desired quota changes, use-case scenarios, and regions required. <br/>Do **not** create additional Azure Media Services accounts in an attempt to obtain higher limits.

## Next steps

[Overview](media-services-overview.md)
