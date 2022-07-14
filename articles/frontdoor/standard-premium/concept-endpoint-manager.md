---
title: 'Azure Front Door: Endpoint Manager'
description: This article provides an overview of Azure Front Door Endpoint Manager.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/18/2021
ms.author: qixwang
---

# What is Azure Front Door Standard/Premium Endpoint Manager?

> [!NOTE]
> * This documentation is for Azure Front Door Standard/Premium. Looking for information on Azure Front Door? View [Azure Front Door Docs](../front-door-overview.md).

Endpoint Manager provides an overview of endpoints you've configured for your Azure Front Door. An endpoint is a logical grouping of domains and their associated configuration. Endpoint Manager helps you manage your collection of endpoints for CRUD (create, read, update, and delete) operation. You can manage the following elements for your endpoints through Endpoint Manager:

* Domains
* Origin Groups
* Routes
* Security

:::image type="content" source="../media/concept-endpoint-manager/endpoint-manager-1.png" alt-text="Screenshot of Endpoint Manager without configurations." lightbox="../media/concept-endpoint-manager/endpoint-manager-1-expanded.png":::

Endpoint Manager list how many instances of each element are created within an endpoint. The association status for each element will also be displayed. For example, you may create multiple domains and origin groups, and assign the association between them with different routes.

## Linked view

With the linked view within Endpoint Manager, you could easily identify the association between your Azure Front Door elements, such as:

* Which domains are associated to the current endpoint?
* Which origin group is associated to which domain?
* Which WAF policy is associated to which domain?

:::image type="content" source="../media/concept-endpoint-manager/endpoint-manager-2.png" alt-text="Screenshot of Endpoint Manager with configurations." lightbox="../media/concept-endpoint-manager/endpoint-manager-2-expanded.png":::

## Next Steps

Learn how to [create a Front Door Standard/Premium](create-front-door-portal.md).
