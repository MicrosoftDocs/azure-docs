---
title: How to create and publish a product in Azure API Management
description: Learn how to create and publish products in Azure API Management.
services: api-management
documentationcenter: ''
author: juliako
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.custom: mvc
ms.topic: tutorial
ms.date: 11/15/2017
ms.author: apimpm

---
# Create and publish a product  

In Azure API Management, a product contains one or more APIs as well as a usage quota and the terms of use. Once a product is published, developers can subscribe to the product and begin to use the product's APIs. The topic provides a guide to creating a product, adding an API, and publishing it for developers.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create and publish a product

![added product](media/api-management-howto-add-products/added-product.png)

Click on **Products** in the menu on the left to display the **Products** page, and click **Add Product**.

+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Also, complete the following tutorial: [Import and publish your first API](import-and-publish.md).

## Navigate to your APIM instance

Sign in to the [Azure portal](https://portal.azure.com) and navigate to your APIM instance.
    
1. Select **>**.
2. Type "api" in the search box.
3. Click **API Management services**.

	![Navigate](./media/api-management-get-started/navigate-to-api-management-services.png)

![New product][api-management-add-new-product]

1. Browse to your APIM instance.
2. Click on **Products** in the menu on the left to display the **Products** page.
3. Click **+ Product**.

    ![added product](media/api-management-howto-add-products/add-product.png)

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
    |APIs|During the product creation, you can add an existing API to it. Alternatively, you can add an existing APIs to an existing product.<br/>Products are associations of one or more APIs. You can include a number of APIs and offer them to developers through the developer portal. Developers must first subscribe to a product to get access to the API. When they subscribe, they get a subscription key that is good for any API in that product. If you created the APIM instance, you are an administrator already, so you are subscribed to every product by default. <br/>You can add an API during the product creation. You can add an API to the product later, either from the Products **Settings** page or while creating an API.|

4. Click **Save** to create the new product.

## Add more configurations

You can continue configuring the product after saving it by choosing the **Settings** tab located under your product. 

![Four multiple subscriptions][api-management-four-multiple-subscriptions]

Once all new product options are configured, click **Save** to create the new product.

![Products][api-management-products-page]

> By default new products are unpublished, and are visible only to the  **Administrators** group.
> 
> 

To configure a product, click on the product name in the **Products** tab.

## <a name="add-apis"> </a>Add APIs to a product
The **Products** page contains four links for configuration: **Summary**, **Settings**, **Visibility**, and **Subscribers**. The **Summary** tab is where you can add APIs and publish or unpublish a product.

![Summary][api-management-new-product-summary]

Before publishing your product you need to add one or more APIs. To do this, click **Add API to product**.

![Add APIs][api-management-add-apis-to-product]

Select the desired APIs and click **Save**.

## <a name="add-description"> </a>Add descriptive information to a product
The **Settings** tab allows you to provide detailed information about the product such as its purpose, the APIs it provides access to, and other useful information. The content is targeted at the developers that will be calling the API and can be written in plain text or HTML markup.

![Product settings][api-management-product-settings]

Check **Require subscription** to create a protected product that requires a subscription to be used, or clear the checkbox to create an open product that can be called without a subscription.

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create and publish a product

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Create blank API and mock API responses](mock-api-responses.md)
