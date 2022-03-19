---
title: Reuse policy statements in Azure API Management | Microsoft Docs
description: Learn how to create and manage reusable policy fragments in Azure API Management. These fragments are XML code blocks with policy statements that can be included in any policy definition.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 03/18/2022
ms.author: danlep
---

# Reuse policy statements in your API Management policy definitions

This article shows you how to create and use *policy fragments* in your API Management policy definitions. Policy fragments are reusable XML code blocks containing one or more [policy](api-management-howto-policies.md) statements, and they can be included in any policy definition. Policy fragments can help you apply policy configurations repeatably and consistently within an API Managment instance.

## Create a policy fragment

* Name must be unique within service

* In editor, type or copy a sequence of policy statements between `<fragment>` and `</fragment>` tags:

```xml
<fragment>
<!-- Add one or more policy statements -->
</fragment>
```


* May not include section identifier (`<inbound>`, `<outbound>`, etc.) nor the `<base/>` element
* May not include another policy fragment

## Include a fragment in a policy definition

Use the `include-fragment` policy to add a policy fragment to a policy definition.

* Include a fragment at any scope and in any policy section
* If desired, include multiple fragments in a policy definition




> [!NOTE]
> Error saving policy if fragment uses policies that can't be used at the current scope or section, or if policy isn't configured properly.

## Manage policy fragments

* Update the policy
* Update affects all policy definitions where the fragment is included
* Delete removes all references from policy definitiions where the fragment is included

## Next steps


