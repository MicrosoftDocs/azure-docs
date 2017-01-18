>[!NOTE]
>For resources that are not fixed, you may ask for the quotas to be raised, by opening a support ticket. Do **not** create additional Azure Media Services accounts in an attempt to obtain higher limits.

| Resource | Default Limit | 
| --- | --- | 
| Azure Media Services (AMS) accounts in a single subscription | 25 (fixed) |
| Assets per AMS account | 1,000,000|
| Chained tasks per job | 30 (fixed) |
| Assets per task | 50 |
| Assets per job | 100 |
| Jobs per AMS account | 50,000<sup>2</sup> |
| Unique locators associated with an asset at one time | 5<sup>4</sup> |
| Live channels per AMS account |5|
| Programs in stopped state per channel |50|
| Programs in running state per channel |3|
| Streaming endpoints in running state per AMS account|2|
| Streaming units per streaming endpoint |10 |
| Media Reserved Units (RUs) per AMS account |25 (S1, S2)<br/>10 (S3) <sup>1</sup> | 
| Storage accounts | 1,000<sup>5</sup> (fixed) |
| Policies | |1,000,000<sup>6</sup> |
 
<sup>1</sup> S3 RUs are not available in India West.

<sup>2</sup> This number includes queued, finished, active, and canceled jobs. It does not include deleted jobs. You can delete the old jobs using **IJob.Delete** or the **DELETE** HTTP request.

<sup>3</sup> When making a request to list Job entities, a maximum of 1,000 will be returned per request. If you need to keep track of all submitted Jobs, you can use top/skip as described in [OData system query options](http://msdn.microsoft.com/library/gg309461.aspx).

<sup>4</sup> Locators are not designed for managing per-user access control. To give different access rights to individual users, use Digital Rights Management (DRM) solutions. For more information, see [this](../articles/media-services/media-services-content-protection-overview.md) section.

<sup>5</sup> The storage accounts must be from the same Azure subscription.

<sup>6</sup> There is a limit of 1,000,000 policies for different AMS policies (for example, for Locator policy or ContentKeyAuthorizationPolicy). 

>[!NOTE]
> You should use the same policy ID if you are always using the same days / access permissions / etc.

