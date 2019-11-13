---
title: Actions in the Standard rules engine for Azure Content Delivery Network | Microsoft Docs
description: Reference documentation for actions in the Standard rules engine for Azure Content Delivery Network (Azure CDN).
services: cdn
author: mdgattuso

ms.service: azure-cdn
ms.topic: article
ms.date: 11/01/2019
ms.author: magattus

---

# Actions in the Standard rules engine for Azure Content Delivery Network

This article lists detailed descriptions of the actions you can use in the [Standard rules engine](cdn-standard-rules-engine.md) for Azure Content Delivery Network (Azure CDN) from Microsoft.

The second part of a rule is an action. An action defines the behavior that's applied to the request type that a set of match conditions identify.

## Actions

The following actions are available to use. 

## Cache expiration

Use this action to overwrite the time-to-live (TTL) value of the endpoint for requests that are specified by the rules match conditions.

**Required fields**

Cache behavior |  Description              
---------------|----------------
Bypass Cache | When this option is selected and the rule matches, the content isn't cached.
Override | When this option is selected and the rule matches, the TTL value returned from origin will be overwritten with the value specified in the action.
Set if missing | When this option is selected and the rule matches, if there was no TTL value returned from origin, the rule seta the TTL to the value specified in the action.

**Additional fields**

Days | Hours | Minutes | Seconds
-----|-------|---------|--------
Int | Int | Int | Int 

## Cache key query string

Use this action to modify the cache key based on query strings.

**Required fields**

Behavior | Description
---------|------------
Include | When this option is selected and the rule matches, query strings specified in the parameters are included when the cache key is generated. 
Cache every unique URL | When this option is selected and the rule matches, each unique URL has its own cache key. 
Exclude | When this option is selected and the rule matches, query strings specified in the parameters are excluded when the cache key is generated.
Ignore query strings | When this option is selected and the rule matches, query strings aren't considered when the cache key is generated. 

## Modify request header

Use this action to modify headers that are present in requests sent to your origin.

**Required fields**

Action | HTTP Header name | Value
-------|------------------|------
Append | When this option is selected and the rule matches, the header specified in Header name is added to the request with the specified value. If the header is already present, the value is appended to the existing value. | String
Overwrite | When this option is selected and the rule matches, the header specified in Header name is added to the request with the specified Value. If the header is already present, the Value will overwrite the existing value. | String
Delete | When this option is selected and the rule matches, and the header specified in the rule is present, it will be deleted from the request. | String

## Modify response header

Use this action to modify headers that are present in responses returned to your end clients.

**Required fields**

Action | HTTP Header name | Value
-------|------------------|------
Append | When this option is selected and the rule matches, the header specified in **Header name** is added to the response using the specified **Value**. If the header is already present, **Value** is appended to the existing value. | String
Overwrite | When this option is selected and the rule matches, the header specified in **Header name** is added to the response using the specified **Value**. If the header is already present, **Value** overwrites the existing value. | String
Delete | When this option is selected and the rule matches, and the header specified in the rule is present, the header is deleted from the response. | String

## URL redirect

Use this action to redirect end clients to a new URL. 

**Required fields**

Field | Description 
------|------------
Type | Select the response type to return to the requestor. Options are: 302 Found, 301 Moved, 307 Temporary redirect, and 308 Permanent redirect.
Protocol | Match Request, HTTP, or HTTPS.
Hostname | Select the hostname you want the request to be redirected to. Leave empty to preserve the incoming host.
Path | Define the path to use in the redirect. Leave empty to preserve the incoming path.  
Query String | Define the query string used in the redirect. Leave empty to preserve the incoming query string. 
Fragment | Define the fragment to use in the redirect. Leave empty to preserve the incoming fragment. 

We highly recommend that you use an absolute URL. Using a relative URL might redirect Azure CDN URLs to an invalid path. 

## URL rewrite

Use this action to rewrite the path of a request that's en route to your origin.

**Required fields**

Field | Description 
------|------------
Source Pattern | Define the source pattern in the URL path to replace. Currently, source pattern uses a prefix-based match. To match all URL paths, use “/” as the source pattern value.
Destination | Define the destination path to use in the rewrite. The destination path overwrites the source pattern.
Preserve unmatched path | If **Yes**, the remaining path after the source pattern is appended to the new destination path. 

## Next steps

- [Azure Content Delivery Network overview](cdn-overview.md)
- [Rules engine reference](cdn-standard-rules-engine-reference.md)
- [Rules engine match conditions](cdn-standard-rules-engine-match-conditions.md)
- [Enforce HTTPS by using the Standard rules engine](cdn-standard-rules-engine.md)
