Resource|Default Limit|Maximum Limit
---|---|---
Azure Media Services (AMS) accounts in a single subscription||25
Assets per AMS account||1,000,000<sup>1</sup>
Chained tasks per job||30
Assets per task||50
Assets per job||100
Jobs per AMS account ||50,000<sup>2</sup>
Unique locators associated with an asset at one time||5<sup>4</sup>
Live channels per AMS account </p></td>|5</p></td>|N/A<sup>1</sup>
Programs in stopped state per channel </p></td>|50</p></td>|N/A<sup>1</sup>
Programs in running state per channel </p></td>|3</p></td>|3
Streaming endpoints in running state per AMS account</p></td>|2</p></td>|N/A<sup>1</sup>
Streaming units per streaming endpoint </p></td>|10 </p></td>|N/A<sup>1</sup>
Encoding units per AMS account </p></td>|25</p></td>|N/A<sup>1</sup>
Storage accounts | |1,000<sup>5</sup>
Policies || 1,000,000<sup>6</sup>

<sup>1</sup> You can request to update the limits for this quota by opening a support ticket. Do not create more AMS accounts to increase limits, instead submit a support ticket.

<sup>2</sup> This number includes queued, finished, active, and canceled jobs. It does not include deleted jobs. You can delete the old jobs using **IJob.Delete** or the **DELETE** HTTP request.

<sup>3</sup> When making a request to list Job entities, a maximum of 1,000 will be returned per request. If you need to keep track of all submitted Jobs, you can use top/skip as described in [OData system query options](http://msdn.microsoft.com/library/gg309461.aspx).

<sup>4</sup> Locators are not designed for managing per-user access control. To give different access rights to individual users, use Digital Rights Management (DRM) solutions.

<sup>5</sup> The storage accounts must be from the same Azure subscription.

<sup>6</sup> There is a limit of 1,000,000 policies for different AMS policies (for example, for Locator policy or ContentKeyAuthorizationPolicy). You should use the same policy ID if you are always using the same days / access permissions / etc.
