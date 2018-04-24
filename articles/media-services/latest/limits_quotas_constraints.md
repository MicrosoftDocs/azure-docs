---
title: Quotas and Limitations in Azure Media Services v3 | Microsoft Docs
description: This topic describes quotas and Limitations in Azure Media Services v3
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

# Quotas and Limitations in Azure Media Services v3

| Resource | Default Limit | 
| --- | --- | 
| Assets per Azure Media Services account | 1,000,000|
| Assets per job | 100 |
| Assets per task | 50 |
| Chained tasks per job | 30 (fixed) |
| File size| In some scenarios, there is a limit on the maximum file size supported for processing in Media Services. <sup>(1)</sup> |
| Jobs per Media Services account | 50,000<sup>(2)</sup> |
| Live channels per Media Services account |5|
| Media reserved units (RUs) per Media Services account |25 (S1)<br/>10 (S2, S3) <sup>(3)</sup> | 
| Media Services accounts in a single subscription | 25 (fixed) |
| Policies | 1,000,000<sup>(4)</sup> |
| Programs in running state per channel |3|
| Programs in stopped state per channel |50|
| Storage accounts | 1,000<sup>(5)</sup> (fixed) |
| Streaming endpoints in running state per Media Services account|2|
| Streaming units per streaming endpoint |10 |
| Transforms per account | 20 |
| Unique locators associated with an asset at one time | 5<sup>(6)</sup> |
  
<sup>1</sup>The maximum size supported for a single blob is currently up to 5 TB in Azure Blob Storage. However, additional limits apply in Azure Media Services based on the VM sizes that are used by the service. The following table shows the limits on each of the Media Reserved Units (S1, S2, S3.) If your source file is larger than the limits defined in the table, your encoding job will fail. If you are encoding 4K resolution sources of long duration, you are required to use S3 Media Reserved Units to achieve the performance needed. If you have 4K content that is larger than 260 GB limit on the S3 Media Reserved Units, contact us at amshelp@microsoft.com for potential mitigations to support your scenario.

| Media Reserved Unit type | Maximum Input Size (GB)| 
| --- | --- | 
|S1	| 325|
|S2	| 640|
|S3	| 260|

<sup>2</sup> This number includes queued, finished, active, and canceled jobs. It does not include deleted jobs. 

Any Job record in your account older than 90 days will be automatically deleted, along with its associated Task records, even if the total number of records is below the maximum quota. 

<sup>3</sup> If you change the RU type (for example, from S2 to S1,) the max RU limits are reset.

<sup>4</sup> There is a limit of 1,000,000 policies for different Media Services policies (for example, for Locator policy or ContentKeyAuthorizationPolicy). 

>[!NOTE]
> You should use the same policy ID if you are always using the same days / access permissions / etc. 

<sup>5</sup> The storage accounts must be from the same Azure subscription.

<sup>6</sup> Locators are not designed for managing per-user access control. To give different access rights to individual users, use Digital Rights Management (DRM) solutions.

## Support ticket

For resources that are not fixed, you may ask for the quotas to be raised, by opening a [support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Please include detailed information in the request on the desired quota changes, use-case scenarios, and regions required. <br/>Do **not** create additional Azure Media Services accounts in an attempt to obtain higher limits.

## Next steps

[Overview](media-services-overview.md)
