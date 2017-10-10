---
title: What is an Azure API Management product?
description: This topic explains what an is an Azure API Management product.
services: api-management
documentationcenter: ''
author: juliako
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/05/2017
ms.author: apimpm

---

#  What is an API Management product?

In Azure API Management, a product contains one or more APIs as well as a usage quota and the terms of use. You can include a number of APIs and offer them to developers through the developer portal. Developers must first subscribe to a product to get access to the API. When they subscribe, they get a subscription key that is good for any API in that product.  

You can add an API during the product creation. You can add it to the product later, either from the Product's **Settings** page or while creating an API. 

## Add a product

When you add a product, you need to supply the following information. 

|Name|Description|
|---|---|
|Display name|The name as you want it to be shown in the **Developer portal**.|
|Name|A descriptive name of the product.|
|Description|The **Description** field allows you to provide detailed information about the product such as its purpose, the APIs it provides access to, and other useful information.|
|State|Press **Published** if you want to publish the product. Before the APIs in a product can be called, the product must be published. By default new products are unpublished, and are visible only to the  **Administrators** group.|
|Requires approval|Check **Require subscription approval** if you want an administrator to review and accept or reject subscription attempts to this product. If the box is unchecked, subscription attempts are auto-approved. |
|Subscription count limit|To limit the count of multiple simultaneous subscriptions, enter the subscription limit. |
|Legal terms|You can include the terms of use for the product which subscribers must accept in order to use the product.|
|APIs|During the product creation, you can add an existing API to it. Alternatively, you can add an existing APIs to an existing product.|

You will be able to update all of the information after you create the product by navigating to the product's **Settings** page.

## Next steps

* [How to create and publish a product](api-management-howto-add-products.md)
* [Import and publish your first API](api-management-get-started.md)