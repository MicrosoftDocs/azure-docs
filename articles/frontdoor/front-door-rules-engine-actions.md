---
title: Azure Front Door 
description: This article provides a list of the various actions you can do with Azure Front Door Rules Engine.
services: frontdoor
documentationcenter: ''
author: megan-beatty
editor: ''
ms.service: frontdoor
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 4/30/2020
ms.author: mebeatty
# customer intent: As an IT admin, I want to learn about Front Door and what new features are available. 
---

# Azure Front Door Rules Engine Actions

In [AFD Rules Engine](front-door-rules-engine.md) a rule consists of zero or more match conditions and actions. This article provides detailed descriptions of the actions you can use in AFD Rules Engine.

An action defines the behavior that's applied to the request type that a match condition or set of match conditions identifies. In AFD Rules Engine, a rule can contain up to five actions, only one of which may be a route configuration override action (forward or redirect).

The following actions are available to use in Azure Front Door rules engine.  

## Modify request header

Use this action to modify headers that are present in requests sent to your origin.

### Required fields

Action | HTTP header name | Value
-------|------------------|------
Append | When this option is selected and the rule matches, the header specified in **Header name** is added to the request with the specified value. If the header is already present, the value is appended to the existing value. | String
Overwrite | When this option is selected and the rule matches, the header specified in **Header name** is added to the request with the specified value. If the header is already present, the specified value overwrites the existing value. | String
Delete | When this option is selected, the rule matches, and the header specified in the rule is present, the header is deleted from the request. | String

## Modify response header

Use this action to modify headers that are present in responses returned to your clients.

### Required fields

Action | HTTP Header name | Value
-------|------------------|------
Append | When this option is selected and the rule matches, the header specified in **Header name** is added to the response by using the specified **Value**. If the header is already present, **Value** is appended to the existing value. | String
Overwrite | When this option is selected and the rule matches, the header specified in **Header name** is added to the response by using the specified **Value**. If the header is already present, **Value** overwrites the existing value. | String
Delete | When this option is selected, the rule matches, and the header specified in the rule is present, the header is deleted from the response. | String

## Route configuration overrides 

### Route Type: Redirect

Use this action to redirect clients to a new URL. 

#### Required fields

Field | Description 
------|------------
Redirect Type | Select the response type to return to the requestor: Found (302), Moved (301), Temporary redirect (307), and Permanent redirect (308).
Redirect protocol | Match Request, HTTP, HTTPS.
Destination host | Select the host name you want the request to be redirected to. Leave blank to preserve the incoming host.
Destination path | Define the path to use in the redirect. Leave blank to preserve the incoming path.  
Query string | Define the query string used in the redirect. Leave blank to preserve the incoming query string. 
Destination fragment | Define the fragment to use in the redirect. Leave blank to preserve the incoming fragment. 


### Route Type: Forward

Use this action to forward clients to a new URL. This action also contains sub actions for URL rewrites and Caching. 

Field | Description 
------|------------
Backend pool | Select the backend pool to override and serve the requests from. This will show all your preconfigured Backend pools currently in your Front Door profile. 
Forwarding protocol | Match Request, HTTP, HTTPS.
URL rewrite | Use this action to rewrite the path of a request that's en route to your origin. If enabled, see below for additional fields required
Caching | Enabled, Disabled. See below for additional fields required if enabled. 

#### URL rewrite

Use this setting to configure an optional **Custom Forwarding Path** to use when constructing the request to forward to the backend.

Field | Description 
------|------------
Custom forwarding path | Define the path to forward the requests to. 

#### Caching

Use these settings to control how files are cached for requests that contain query strings and whether to cache your content based on all parameters or on selected parameters. You can use additional settings to overwrite the time to live (TTL) value to control how long contents stay in cache for requests that the rules match conditions specify. To force caching as an action, set the caching field to "Enabled." When you do this, this following options appear: 

Cache behavior |  Description              
---------------|----------------
Ignore query strings | Once the asset is cached, all subsequent requests ignore the query strings until the cached asset expires.
Cache every unique URL | Each request with a unique URL, including the query string, is treated as a unique asset with its own cache.
Ignore specified query strings | Request URL query strings listed in "Query parameters" setting are ignored for caching.
Include specified query strings | Request URL query strings listed in "Query parameters" setting are used for caching.

Additional fields |  Description 
------------------|---------------
Dynamic compression | Front Door can dynamically compress content on the edge, resulting in a smaller and faster response.
Query parameters | A comma separated list of allowed (or disallowed) parameters to use as a basis for caching.
Cache duration | Cache expiration duration in Days, Hours, Minutes, Seconds. All values must be Int. 

## Next steps

- Learn how to set up your first [Rules Engine configuration](front-door-tutorial-rules-engine.md). 
- Learn more about [Rules Engine match conditions](front-door-rules-engine-match-conditions.md)
- Learn more about [Azure Front Door Rules Engine](front-door-rules-engine.md)
