---
title: Azure CDN from Microsoft Standard Rules Engine actions | Microsoft Docs
description: Reference documentation for Azure CDN from Microsoft Standard Rules Engine actions.
services: cdn
author: mdgattuso

ms.service: azure-cdn
ms.topic: article
ms.date: 11/01/2019
ms.author: magattus

---

# Azure CDN from Microsoft Standard Rules Engine actions

This article lists detailed descriptions of the available actions for Azure Content Delivery Network (CDN) from Microsoft [Standard Rules Engine](cdn-standard-rules-engine.md).

The second part of a rule is an action. An action defines the behavior that is applied to the request type that is identified by a set of match conditions.

## Actions

The following actions are available to use. 

## Cache Expiration

This action allows you to overwrite the TTL of the endpoint for requests specified by the rules match conditions.

**Required fields**

Cache Behavior |                
---------------|----------------
Bypass Cache | When this option is selected and the rule matches, the content will not be cached.
Override | When this option is selected and the rule matches, the TTL value returned from origin will be overwritten with the value specified in the action.
Set if missing | When this option is selected and the rule matches, if there was no TTL value returned from origin, the rule will set the TTL to the value specified in the action.

**Additional fields**

Days | Hours | Minutes | Seconds
-----|-------|---------|--------
Int | Int | Int | Int 

## Cache Key query string

This action allows you to modify the cache key based on query strings.

**Required fields**

Behavior | Description
---------|------------
Include | When this option is selected and the rule matches, query strings specified in the parameters will be included when generating the cache key. 
Cache every unique URL | When this option is selected and the rule matches, each unique URL will have its own cache key. 
Exclude | When this option is selected and the rule matches, query strings specified in the parameters will be excluded when generating the cache key.
Ignore query strings | When this option is selected and the rule matches, query strings will not be considered when generating the cache key. 

## Modify Request header

This action allows you to modify headers present in requests sent to your origin.

**Required fields**

Action | HTTP Header Name | Value
-------|------------------|------
Append | When this option is selected and the rule matches, the header specified in Header name will be added to the request with the specified Value. If the header is already present, the Value will be appended to the existing value. | String
Overwrite | When this option is selected and the rule matches, the header specified in Header name will be added to the request with the specified Value. If the header is already present, the Value will overwrite the existing value. | String
Delete | When this option is selected and the rule matches, and the header specified in the rule is present, it will be deleted from the request. | String

## Modify Response header

This action allows you to modify headers present in responses returned to your end clients

**Required fields**

Action | HTTP Header Name | Value
-------|------------------|------
Append | When this option is selected and the rule matches, the header specified in Header name will be added to the response with the specified Value. If the header is already present, the Value will be appended to the existing value. | String
Overwrite | When this option is selected and the rule matches, the header specified in Header name will be added to the response with the specified Value. If the header is already present, the Value will overwrite the existing value. | String
Delete | When this option is selected and the rule matches, and the header specified in the rule is present, it will be deleted from the response. | String

## URL Redirect

This action allows you to redirect end clients to a new URL. 

**Required fields**

Field | Description 
------|------------
Type | Select the response type that will be returned to the requestor. Options are - 302 Found, 301 Moved, 307 Temporary redirect, and 308 Permanent redirect
Protocol | Match Request, HTTP, or HTTPS
Hostname | Select the hostname the request will be redirected to. Leave empty to preserve the incoming host.
Path | Define the path to be used in the redirect. Leave empty to preserve the incoming path.  
Query String | Define the query string used in the redirect. Leave empty to preserve the incoming query string. 
Fragment | Define the fragment to be used in the redirect. Leave empty to preserve the incoming fragment. 

It is highly recommended to use an absolute URL. The use of a relative URL may redirect CDN URLs to an invalid path. 

## URL Rewrite

This action allows you to rewrite the path of a request en route to your origin.

**Required fields**

Field | Description 
------|------------
Source Pattern | Define the source pattern in the URL path to replace. Currently, source pattern uses a prefix-based match. To match all URL paths, use “/” as the source pattern value.
Destination | Define the destination path for be used in the rewrite. This will overwrite the source pattern
Preserve unmatched path | If Yes, the remaining path after the source pattern will be appended to the new destination path. 


[Back to top](#actions)

</br>

## Next steps

- [Azure Content Delivery Network overview](cdn-overview.md)
- [Rules engine reference](cdn-standard-rules-engine-reference.md)
- [Rules engine match conditions](cdn-standard-rules-engine-match-conditions.md)
- [Enforce HTTPS using the Standard Rules Engine](cdn-standard-rules-engine.md)
