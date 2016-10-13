<properties 
	pageTitle="How to create and publish a product in Azure API Management" 
	description="Learn how to create and publish products in Azure API Management." 
	services="api-management" 
	documentationCenter="" 
	authors="steved0x" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/09/2016" 
	ms.author="sdanie"/>

# How to create and publish a product in Azure API Management

In Azure API Management, a product contains one or more APIs as well as a usage quota and the terms of use. Once a product is published, developers can subscribe to the product and begin to use the product's APIs. The topic provides a guide to creating a product, adding an API, and publishing it for developers.

## <a name="create-product"> </a>Create a product

Operations are added and configured to an API in the publisher portal. To access the publisher portal, click **Manage** in the Azure Classic Portal for your API Management service.

![Publisher portal][api-management-management-console]

>If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

Click on **Products** in the menu on the left to display the **Products** page, and click **Add Product**.

![Products][api-management-products]

![New product][api-management-add-new-product]

Enter a descriptive name for the product in the **Name** field and a description of the product in the **Description** field.

Products in API Management can be **Open** or **Protected**. Protected products must be subscribed to before they can be used, while open products can be used without a subscription. Check **Require subscription** to create a protected product that requires a subscription. This is the default setting.

Check **Require subscription approval** if you want an administrator to review and accept or reject subscription attempts to this product. If the box is unchecked, subscription attempts will be auto-approved. For more information on subscriptions, see [View subscribers to a product][].

To allow developer accounts to subscribe multiple times to the product, check the **Allow multiple subscriptions** check box. If this box is not checked, each developer account can subscribe only a single time to the product.

![Unlimited multiple subscriptions][api-management-unlimited-multiple-subscriptions]

To limit the count of multiple simultaneous subscriptions, check the **Limit number of simultaneous subscriptions to** check box and enter the subscription limit. In the following example, simultaneous subscriptions are limited to four per developer account.

![Four multiple subscriptions][api-management-four-multiple-subscriptions]

Once all new product options are configured, click **Save** to create the new product.

![Products][api-management-products-page]

>By default new products are unpublished, and are visible only to the  **Administrators** group.

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

Select **Require subscription approval** if you want to manually approve all product subscription requests. By default all product subscriptions are granted automatically.

To allow developer accounts to subscribe multiple times to the product, check the **Allow multiple subscriptions** check box and optionally specify a limit. If this box is not checked, each developer account can subscribe only a single time to the product.

Optionally fill in the **Terms of use** field describing the terms of use for the product which subscribers must accept in order to use the product.

## <a name="publish-product"> </a>Publish a product

Before the APIs in a product can be called, the product must be published. On the **Summary** tab for the product, click **Publish**, and then click **Yes, publish it** to confirm. To make a previously published product private, click **Unpublish**.

![Publish product][api-management-publish-product]

## <a name="make-visible"> </a>Make a product visible to developers

The **Visibility** tab allows you to choose which roles are able to see the product on the developer portal and subscribe to the product.

![Product visibility][api-management-product-visiblity]

To enable or disable visibility of a product for the developers in a group, check or uncheck the check box beside the group and then click **Save**.

>For more information, see [How to create and use groups to manage developer accounts in Azure API Management][].

## <a name="view-subscribers"> </a>View subscribers to a product

The **Subscribers** tab lists the developers who have subscribed to the product. The details and settings for each developer can be viewed by clicking on the developer's name. In this example no developers have yet subscribed to the product.

![Developers][api-management-developer-list]

## <a name="next-steps"> </a>Next steps

Once the desired APIs are added and the product published, developers can subscribe to the product and begin to call the APIs. For a tutorial that demonstrates these items as well as advanced product configuration see [How create and configure advanced product settings in Azure API Management][].

For more information about working with products, see the following video.

> [AZURE.VIDEO using-products]

[Create a product]: #create-product
[Add APIs to a product]: #add-apis
[Add descriptive information to a product]: #add-description
[Publish a product]: #publish-product
[Make a product visible to developers]: #make-visible
[View subscribers to a product]: #view-subscribers
[Next steps]: #next-steps

[api-management-management-console]: ./media/api-management-howto-add-products/api-management-management-console.png
[api-management-add-product]: ./media/api-management-howto-add-products/api-management-add-product.png
[api-management-add-new-product]: ./media/api-management-howto-add-products/api-management-add-new-product.png
[api-management-unlimited-multiple-subscriptions]: ./media/api-management-howto-add-products/api-management-unlimited-multiple-subscriptions.png
[api-management-four-multiple-subscriptions]: ./media/api-management-howto-add-products/api-management-four-multiple-subscriptions.png
[api-management-products-page]: ./media/api-management-howto-add-products/api-management-products-page.png
[api-management-new-product-summary]: ./media/api-management-howto-add-products/api-management-new-product-summary.png
[api-management-add-apis-to-product]: ./media/api-management-howto-add-products/api-management-add-apis-to-product.png
[api-management-product-settings]: ./media/api-management-howto-add-products/api-management-product-settings.png
[api-management-publish-product]: ./media/api-management-howto-add-products/api-management-publish-product.png
[api-management-product-visiblity]: ./media/api-management-howto-add-products/api-management-product-visibility.png
[api-management-developer-list]: ./media/api-management-howto-add-products/api-management-developer-list.png



[api-management-products]: ./media/api-management-howto-add-products/api-management-products.png
[api-management-]: ./media/api-management-howto-add-products/
[api-management-]: ./media/api-management-howto-add-products/


[How to add operations to an API]: api-management-howto-add-operations.md
[How to create and publish a product]: api-management-howto-add-products.md
[Get started with Azure API Management]: api-management-get-started.md
[Create an API Management service instance]: api-management-get-started.md#create-service-instance
[Next steps]: #next-steps
[How to create and use groups to manage developer accounts in Azure API Management]: api-management-howto-create-groups.md
[How create and configure advanced product settings in Azure API Management]: api-management-howto-product-with-rules.md 