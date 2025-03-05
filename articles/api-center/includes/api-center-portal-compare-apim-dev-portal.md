---
title: Include file
description: Include file
services: api-center
author: dlepow

ms.service: azure-api-center
ms.topic: include
ms.date: 03/05/2025
ms.author: danlep
ms.custom: Include file
---

## Which portal to use: API Management's or API Center's?

The [Azure API Management](../../api-management/api-management-key-concepts.md) service and the [Azure API Center](../overview.md) service both offer portals for developers and other API users to discover and consume an organization's APIs:

* In API Management, the *developer portal* is where developers and API consumers can discover the APIs managed APIs, learn how to use them, request access, and try them out. 

* In API Center, the *API Center portal* is where developers and API consumers can discover and filter the API inventory and review API definitions and documentation.  

The portals have some common features, but also some distinct differences. Especially in organizations that adopt both services, the question arises: *Which portal should I use?* The following table compares key capabilities of the two portals. For some organizations, one portal may be preferable; for some, both may be needed.

| Feature | API Management portal | API Center portal |
| --- | --- | --- |
| Browse APIs in API Management instance | Yes | Yes<sup>1</sup> |
| Browse APIs in entire inventory | No | Yes<sup>1</sup> |
| Search and filter APIs | No | Yes |
| View API details and definitions | Yes | Yes |
| View API documentation | Yes | Yes |
| Configure basic branding | Yes | Yes |
| Add custom widgets | Yes | No |
| Self-host | Yes | Yes |
| Customize with WordPress | Yes | No |
| Integrate with Microsoft Entra | Yes | Yes |
| Access publicly | Yes | No |
| Test APIs in test console | Yes | No |
| Subscribe to APIs | Yes | No |
| View API usage analytics | Yes | No |

<sup>2</sup> Depends on import or integration of APIs from API sources. 

