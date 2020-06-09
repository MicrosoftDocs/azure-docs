---
author: Juliako
ms.service: media-services
ms.topic: include
ms.date: 03/31/2020
ms.author: juliako
---

> [!NOTE]
> For resources that aren't fixed, open a support ticket to ask for an increase in the quotas. Don't create additional Azure Media Services accounts in an attempt to obtain higher limits.

### Account limits

| Resource | Default Limit | 
| --- | --- | 
| Media Services accounts in a single subscription | 25 (fixed) |

### Asset limits

| Resource | Default Limit | 
| --- | --- | 
| Assets per Media Services account | 1,000,000|

### Storage (media) limits

| Resource | Default Limit | 
| --- | --- | 
| File size| In some scenarios, there is a limit on the maximum file size supported for processing in Media Services. <sup>(1)</sup> |
| Storage accounts | 100<sup>(2)</sup> (fixed) |

<sup>1</sup> The maximum size supported for a single blob is currently up to 5 TB in Azure Blob Storage. Additional limits apply in Media Services based on the VM sizes that are used by the service. The size limit applies to the files that you upload and also the files that get generated as a result of Media Services processing (encoding or analyzing). If your source file is larger than 260-GB, your Job will likely fail. 

The following table shows the limits on the media reserved units S1, S2, and S3. If your source file is larger than the limits defined in the table, your encoding job fails. If you encode 4K resolution sources of long duration, you're required to use S3 media reserved units to achieve the performance needed. If you have 4K content that's larger than the 260-GB limit on the S3 media reserved units, open a support ticket.

|Media reserved unit type|Maximum input size (GB)|
|---|---|
|S1 |    26|
|S2    | 60|
|S3    |260|

<sup>2</sup> The storage accounts must be from the same Azure subscription.

### Jobs (encoding & analyzing) limits

| Resource | Default Limit | 
| --- | --- | 
| Jobs per Media Services account | 500,000 <sup>(3)</sup> (fixed)|
| Job inputs per Job | 50  (fixed)|
| Job outputs per Job | 20 (fixed) |
| Transforms per Media Services account | 100  (fixed)|
| Transform outputs in a Transform | 20 (fixed) |
| Files per job input|10 (fixed)|

<sup>3</sup> This number includes queued, finished, active, and canceled Jobs. It does not include deleted Jobs. 

Any Job record in your account older than 90 days will be automatically deleted, even if the total number of records is below the maximum quota. 

### Live streaming limits

| Resource | Default Limit | 
| --- | --- | 
| Live Events <sup>(4)</sup> per Media Services account |5|
| Live Outputs per Live Event |3 <sup>(5)</sup> |
| Max Live Output duration | [Size of the DVR window](../articles/media-services/latest/live-event-cloud-dvr.md) |

<sup>4</sup> For detailed information about Live Event limitations, see [Live Event types comparison and limitations](../articles/media-services/latest/live-event-types-comparison.md).

<sup>5</sup> Live Outputs start on creation and stop when deleted.

### Packaging & delivery limits

| Resource | Default Limit | 
| --- | --- | 
| Streaming Endpoints (stopped or running) per Media Services account|2 (fixed)|
| Dynamic Manifest Filters|100|
| Streaming Policies | 100 <sup>(6)</sup> |
| Unique Streaming Locators associated with an Asset at one time | 100<sup>(7)</sup> (fixed) |

<sup>6</sup> When using a custom [Streaming Policy](https://docs.microsoft.com/rest/api/media/streamingpolicies), you should design a limited set of such policies for your Media Service account, and re-use them for your StreamingLocators whenever the same encryption options and protocols are needed. You should not be creating a new Streaming Policy for each Streaming Locator.

<sup>7</sup> Streaming Locators are not designed for managing per-user access control. To give different access rights to individual users, use Digital Rights Management (DRM) solutions.

### Protection limits

| Resource | Default Limit | 
| --- | --- | 
| Options per Content Key Policy |30 | 
| Licenses per month for each of the DRM types on Media Services key delivery service per account|1,000,000|

### Support ticket

For resources that are not fixed, you may ask for the quotas to be raised, by opening a [support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Include detailed information in the request on the desired quota changes, use-case scenarios, and regions required. <br/>Do **not** create additional Azure Media Services accounts in an attempt to obtain higher limits.
