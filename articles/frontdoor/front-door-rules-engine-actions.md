---
title: Azure Front Door | Microsoft Docs
description: This article provides an overview of Azure Front Door. Find out if it is the right choice for load-balancing user traffic for your application.
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
ms.author: megan-beatty
# customer intent: As an IT admin, I want to learn about Front Door and what new features are available. 
---

# Azure Front Door Rules Engine Actions

In [AFD Rules Engine](front-door-rules-engine.md) a rule consists of one or more match conditions and an action. This article provides detailed descriptions of the actions you can use in AFD Rules Engine.

The second part of a rule is an action. An action defines the behavior that's applied to the request type that a match condition or set of match conditions identifies. In AFD Rules Engine, a rule can contain up to five actions, only one of which may be a route configuration override (forward or redirect). 

## Actions

The following actions are available to use in Azure Front Door rules engine.  

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

### Route Configuration Overrides 

#### Cache expiration

Use this action to overwrite the time to live (TTL) value of the endpoint for requests that the rules match conditions specify.

##### Required fields

Cache behavior |  Description              
---------------|----------------
Bypass cache | When this option is selected and the rule matches, the content is not cached.
Override | When this option is selected and the rule matches, the TTL value returned from your origin is overwritten with the value specified in the action.
Set if missing | When this option is selected and the rule matches, if no TTL value was returned from your origin, the rule sets the TTL to the value specified in the action.

##### Additional fields

Days | Hours | Minutes | Seconds
-----|-------|---------|--------
Int | Int | Int | Int 

#### URL redirect

Use this action to redirect clients to a new URL. 

##### Required fields

Field | Description 
------|------------
Type | Select the response type to return to the requestor: Found (302), Moved (301), Temporary redirect (307), and Permanent redirect (308).
Protocol | Match Request, HTTP, HTTPS.
Hostname | Select the host name you want the request to be redirected to. Leave blank to preserve the incoming host.
Path | Define the path to use in the redirect. Leave blank to preserve the incoming path.  
Query string | Define the query string used in the redirect. Leave blank to preserve the incoming query string. 
Fragment | Define the fragment to use in the redirect. Leave blank to preserve the incoming fragment. 

We highly recommend that you use an absolute URL. Using a relative URL might redirect Azure CDN URLs to an invalid path. 

#### URL rewrite

Use this action to rewrite the path of a request that's en route to your origin.

##### Required fields

Field | Description 
------|------------
Source pattern | Define the source pattern in the URL path to replace. Currently, source pattern uses a prefix-based match. To match all URL paths, use a forward slash (**/**) as the source pattern value.
Destination | Define the destination path to use in the rewrite. The destination path overwrites the source pattern.
Preserve unmatched path | If set to **Yes**, the remaining path after the source pattern is appended to the new destination path. 

## Next steps

- Learn how to set up your first [Rules Engine configuration](front-door-tutorial-rules-engine.md). 
- Learn more about [Rules Engine match conditions](front-door-rules-engine-match-conditions.md)
- Learn more about [Azure Front Door rules engine](front-door-rules-engine.md)
