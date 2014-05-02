# How create and publish a product in Azure API Management

In Azure API Management, a product contains one or more APIs as well as a usage quota and the terms of use. Once a product is published, developers can subscribe to the product and begin to use the product's APIs. The topic provides a guide to creating a product, adding an API, and publishing it for developers.

## In this topic

-   [Create a product][]
-   [Add APIs to a product][]
-   [Add descriptive information to a product][]
-   [Publish a product][]
-   [Make a product visible to developers][]
-   [View subscribers to a product][]
-   [Next steps][]

## <a name="create-product"> </a>Create a product

In the API Management administrative portal, click on **Products** in the menu on the left to display the **Products** page.

![api-management-add-product][]

Click **add product** to display the **Add new product** pop up window. 

![api-management-add-new-product][]

Enter a descriptive name for the product in the **Name** field and a description of the product in the **Description** field. In this example we are creating a 30 Day Free Trial.

Check **Require subscription approval** if you want an administrator to review and accept or reject subscription attempts to this product. If the box is unchecked, subscription attempts will be auto-approved. For more information on subscriptions, see [View subscribers to a product][].

![api-management-products-page][]

Note that by default the product will be available to the **administrator** and **developer** roles.

To configure the product, click on either **configure** or the product name.

## <a name="add-apis"> </a>Add APIs to a product

The **Products** page contains four links for configuration: **summary**, **description**, **visibility**, and **developers**. The **summary** tab allows you to set your product to published (available for subscribing) or unpublished.

![api-management-free-trial][]

Before publishing your product you need to add one or more APIs. To do this, select **add API to the product**. A window will appear in which you can select an API to use.

![api-management-add-apis-to-product][]

Select the desired APIs and click **Save**.

## <a name="add-description"> </a>Add descriptive information to a product

The **Description** tab allows you to provide detailed information about the product such as its purpose, the APIs it uses, and other useful information. The content is targeted at the developers that will be calling the API and can be written in plain text or HTML markup.

![api-management-product-description][]

Select **Require subscription approval** if you want to manually approve all product subscription requests. By default all product subscriptions are granted automatically.

Optionally fill in the **Terms of use** field describing the terms of use for the product which subscribers must accept in order to use the product.

## <a name="publish-product"> </a>Publish a product

Before the APIs in a product can be called, the API must be published. On the **summary** tab for the API, click **publish**. To make a previously published product private, click **unpublish**.

![api-management-publish-product][]

## <a name="make-visible"> </a>Make a product visible to developers

The **visibility** tab allows you to choose which roles are able to view and subscribe to the product.

![api-management-product-visiblity][]

To enable or disable visibility for a role, check or uncheck the check box beside the role and then click **Save**.

## <a name="view-subscribers"> </a>View subscribers to a product

The **developers** tab the developers who have subscribed to the product. The details and settings for each developer can be viewed by clicking on the developer's name or on the details link to the right of the developer:

![api-management-developer-list][]

## <a name="next-steps"> </a>Next steps

Once the desired APIs are added and the product published, developers can subscribe to the product and begin to call the APIs. To view the usage of your product and monitor its health, see [Monitoring and analytics][].


[Create a product]: #create-product
[Add APIs to a product]: #add-apis
[Add descriptive information to a product]: #add-description
[Publish a product]: #publish-product
[Make a product visible to developers]: #make-visible
[View subscribers to a product]: #view-subscribers
[Next steps]: #next-steps

[api-management-add-product]: ./Media/api-management-add-product.png
[api-management-add-new-product]: ./Media/tn02_01_add_product.png
[api-management-products-page]: ./Media/tn02_02_products_page.png
[api-management-free-trial]: ./Media/tn02_03_freetrial_page.png
[api-management-add-apis-to-product]: ./Media/tn02_04_add_apis_product.png
[api-management-product-description]: ./Media/tn02_05_product_description.png
[api-management-publish-product]: ./Media/api-management-publish-product.png
[api-management-product-visiblity]: ./Media/tn02_06_visibility_page.png
[api-management-developer-list]: ./Media/tn02_07_developerlist.png
[api-management-]: ./Media/
[api-management-]: ./Media/
[api-management-]: ./Media/


[How to add operations to an API]: ./api-management-hotwo-add-operations
[How to add and publish a product]: ./api-management-howto-add-product
[Monitoring and analytics]: ./api-management-monitoring