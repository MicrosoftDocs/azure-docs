---
title: Actions in the Standard rules engine for Azure CDN | Microsoft Docs
description: Reference documentation for actions in the Standard rules engine for Azure Content Delivery Network (Azure CDN).
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: article
ms.date: 02/27/2023
ms.author: duau

---

# Actions in the Standard rules engine for Azure CDN

In the [Standard rules engine](cdn-standard-rules-engine.md) for Azure Content Delivery Network (Azure CDN), a rule consists of one or more match conditions and an action. This article provides detailed descriptions of the actions you can use in the Standard rules engine for Azure CDN.

The second part of a rule is an action. An action defines the behavior that's applied to the request type that a match condition or set of match conditions identifies.

## Actions

The following actions are available to use in the Standard rules engine for Azure CDN. 

### Cache expiration

Use this action to overwrite the time to live (TTL) value of the endpoint for requests that the rules match conditions specify.

#### Required fields

Cache behavior |  Description              
---------------|----------------
Bypass cache | When this option is selected and the rule matches, the content isn't cached.
Override | When this option is selected and the rule matches, the TTL value returned from your origin is overwritten with the value specified in the action. This behavior is only be applied if the response is cacheable. For cache-control response header with values "no-cache", "private", "no-store", the action isn't applicable.
Set if missing | When this option gets selected and the rule matches, if no TTL value gets returned from your origin, the rule sets the TTL to the value specified in the action. This behavior only gets applied if the response is cacheable. For cache-control response header with values "no-cache", "private", "no-store", the action isn't applicable.

#### Extra fields

Days | Hours | Minutes | Seconds
-----|-------|---------|--------
Int | Int | Int | Int 

### Cache key query string

Use this action to modify the cache key based on query strings.

#### Required fields

Behavior | Description
---------|------------
Include | When this option gets selected and the rule matches, query strings specified in the parameters get included when the cache key gets generated. 
Cache every unique URL | When this option is selected and the rule matches, each unique URL has its own cache key. 
Exclude | When this option is selected and the rule matches, query strings specified in the parameters get excluded when the cache key gets generated.
Ignore query strings | When this option is selected and the rule matches, query strings aren't considered when the cache key is generated. 

### Modify request header

Use this action to modify headers that are present in requests sent to your origin.

#### Required fields

Action | HTTP header name | Value
-------|------------------|------
Append | When this option is selected and the rule matches, the header specified in **Header name** is added to the request with the specified value. If the header is already present, the value is appended to the existing value. | String
Overwrite | When this option is selected and the rule matches, the header specified in **Header name** is added to the request with the specified value. If the header is already present, the specified value overwrites the existing value. | String
Delete | When this option is selected, the rule matches, and the header specified in the rule is present, the header is deleted from the request. | String

### Modify response header

Use this action to modify headers that are present in responses returned to your clients.

#### Required fields

Action | HTTP Header name | Value
-------|------------------|------
Append | When this option is selected and the rule matches, the header specified in **Header name** is added to the response by using the specified **Value**. If the header is already present, **Value** is appended to the existing value. | String
Overwrite | When this option is selected and the rule matches, the header specified in **Header name** is added to the response by using the specified **Value**. If the header is already present, **Value** overwrites the existing value. | String
Delete | When this option is selected, the rule matches, and the header specified in the rule is present, the header is deleted from the response. | String

### URL redirect

Use this action to redirect clients to a new URL. 

#### Required fields

Field | Description 
------|------------
Type | Select the response type to return to the requestor: Found (302), Moved (301), Temporary redirect (307), and Permanent redirect (308).
Protocol | Match Request, HTTP, HTTPS.
Hostname | Select the host name you want the request to be redirected to. Leave blank to preserve the incoming host.
Path | Define the path to use in the redirect. Leave blank to preserve the incoming path.  
Query string | Define the query string used in the redirect. Leave blank to preserve the incoming query string. 
Fragment | Define the fragment to use in the redirect. Leave blank to preserve the incoming fragment. 

We highly recommend that you use an absolute URL. Using a relative URL might redirect Azure CDN URLs to an invalid path. 

### URL rewrite

Use this action to rewrite the path of a request that's en route to your origin.

#### Required fields

Field | Description 
------|------------
Source pattern | Define the source pattern in the URL path to replace. To match all URL paths, use a forward slash (**/**) as the source pattern value.
Destination | Define the destination path to use in the rewrite. The destination path overwrites the source pattern.
Preserve unmatched path | If set to **Yes**, the remaining path after the source pattern is appended to the new destination path. 

## Next steps

- [Azure CDN overview](cdn-overview.md)
- [Standard rules engine reference](cdn-standard-rules-engine-reference.md)
- [Match conditions in the Standard rules engine](cdn-standard-rules-engine-match-conditions.md)
- [Enforce HTTPS by using the Standard rules engine](cdn-standard-rules-engine.md)
