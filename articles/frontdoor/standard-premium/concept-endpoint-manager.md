---
title: Azure Front Door Endpoint Manager
description: This article provides an overview of Azure Front Door Endpoint Manager.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/18/2021
ms.author: qixwang
---

# What is Azure Front Door Standard/Premium (Preview) Endpoint Manager?

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [**Supplemental Terms of Use for Microsoft Azure Previews**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Endpoint Manager provides an overview of endpoints you've configured for your Azure Front Door. An endpoint is the logical group of a domain and the associated configuration. Endpoint Manager helps you manage your endpoint collection with CRUD (create, read, update, and delete) operation. You can manage the following elements for your endpoint through Endpoint Manager:

* Domains
* Origin Groups
* Routes
* Security

:::image type="content" source="../media/concept-endpoint-manager/EndpointManager1.png" alt-text="Front Door EndpointManager1":::

Endpoint Manager list how many instances of each element are created within an endpoint. The association status for each element will also be displayed. For example, you may create multiple domains and origin groups, and assign the association between them with different routes.

With the linked view within Endpoint Manager, you could easily identify the association between your Azure Front Door elements, such as:

* Which domains are associated/CNAME to the current endpoint?
* Which origin group is associated to which domain?
* Which WAF policy is associated to which domain?

:::image type="content" source="../media/concept-endpoint-manager/EndpointManager2.png" alt-text="Front Door EndpointManager2":::

## Next Steps

Learn how to [create a Front Door](create-front-door-portal.md).
