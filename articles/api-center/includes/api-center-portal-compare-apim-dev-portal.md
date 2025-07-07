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

## API Management and API Center portals

The [Azure API Management](../../api-management/api-management-key-concepts.md) and [Azure API Center](../overview.md) services both provide portals for developers to discover and consume APIs:

* The *API Management developer portal* allows users to find managed APIs, learn how to use them, request access, and test them.
* The *API Center portal* (preview) is a multi-gateway portal where  users can discover and filter the organization's complete API inventory.

While the two portals share some features, they also have distinct differences. The following table compares current capabilities to help determine which portal to use. Some organizations may prefer one portal, while others may need both.

| Feature | API Management developer portal | API Center portal (preview) |
| --- | --- | --- |
| Search and filter API inventory | API Management instance only | All APIs<sup>1</sup> |
| View API details and definitions | ✔️ | ✔️ |
| View API documentation | ✔️ | ✔️ |
| Customize with branding | ✔️ | Name only |
| Integrate with Microsoft Entra ID | ✔️ | ✔️ |
| Add custom widgets | ✔️ | ❌ |
| Customize with WordPress | ✔️ | ❌ |
| Test APIs in test console | ✔️ | ✔️ |
| Subscribe to APIs | ✔️ | ❌ |
| View API usage analytics | ✔️ | ❌ |

<sup>1</sup> The API Center portal can contain all APIs in your organization, including those managed in Azure API Management and other platforms, as well as unmanaged APIs and APIs under development.