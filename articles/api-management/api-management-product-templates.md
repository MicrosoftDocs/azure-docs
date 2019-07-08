---
title: Product templates in Azure API Management | Microsoft Docs
description: Learn how to customize the content of the product pages in the Azure API Management developer portal.
services: api-management
documentationcenter: ''
author: vladvino
manager: erikre
editor: ''

ms.assetid: 49f9254c-4c5f-4ed4-9c8d-798f44e805ee
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/09/2017
ms.author: apimpm
---
# Product templates in Azure API Management

Azure API Management provides you the ability to customize the content of developer portal pages using a set of templates that configure their content. Using [DotLiquid](http://dotliquidmarkup.org/) syntax and the editor of your choice, such as [DotLiquid for Designers](https://github.com/dotliquid/dotliquid/wiki/DotLiquid-for-Designers), and a provided set of localized [String resources](api-management-template-resources.md#strings), [Glyph resources](api-management-template-resources.md#glyphs), and [Page controls](api-management-page-controls.md), you have great flexibility to configure the content of the pages as you see fit using these templates.  
  
 The templates in this section allow you to customize the content of the product pages in the developer portal.  
  
-   [Product list](#ProductList)  
  
-   [Product](#Product)  
  
> [!NOTE]
>  Sample default templates are included in the following documentation, but are subject to change due to continuous improvements. You can view the live default templates in the developer portal by navigating to the desired individual templates. For more information about working with templates, see [How to customize the API Management developer portal using templates](https://azure.microsoft.com/documentation/articles/api-management-developer-portal-templates/).  

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]
  
##  <a name="ProductList"></a> Product list  
 The **Product list** template allows you to customize the body of the product list page in the developer portal.  
  
 ![Products list](./media/api-management-product-templates/APIM_ProductsListTemplatePage.png "APIM_ProductsListTemplatePage")  
  
### Default template  
  
```xml  
<search-control></search-control>  
<div class="row">  
    <div class="col-md-9">  
        <h2>{% localized "ProductsStrings|PageTitleProducts" %}</h2>  
    </div>  
</div>  
<div class="row">  
    <div class="col-md-12">  
	{% if products.size > 0 %}  
	<ul class="list-unstyled">  
	{% for product in products %}  
		<li>  
			<h3><a href="/products/{{product.id}}">{{product.title}}</a></h3>  
			{{product.description}}  
		</li>	  
	{% endfor %}  
	</ul>  
	<paging-control></paging-control>  
	{% else %}  
	{% localized "CommonResources|NoItemsToDisplay" %}  
	{% endif %}  
	</div>  
</div>  
```  
  
### Controls  
 The `Product list` template may use the following [page controls](api-management-page-controls.md).  
  
-   [paging-control](api-management-page-controls.md#paging-control)  
  
-   [search-control](api-management-page-controls.md#search-control)  
  
### Data model  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|Paging|[Paging](api-management-template-data-model-reference.md#Paging) entity.|The paging information for the products collection.|  
|Filtering|[Filtering](api-management-template-data-model-reference.md#Filtering) entity.|The filtering information for the products list page.|  
|Products|Collection of [Product](api-management-template-data-model-reference.md#Product) entities.|The products visible to the current user.|  
  
### Sample template data  
  
```json  
{  
    "Paging": {  
        "Page": 1,  
        "PageSize": 10,  
        "TotalItemCount": 2,  
        "ShowAll": false,  
        "PageCount": 1  
    },  
    "Filtering": {  
        "Pattern": null,  
        "Placeholder": "Search products"  
    },  
    "Products": [  
        {  
            "Id": "56f9445ffaf7560049060001",  
            "Title": "Starter",  
            "Description": "Subscribers will be able to run 5 calls/minute up to a maximum of 100 calls/week.",  
            "Terms": "",  
            "ProductState": 1,  
            "AllowMultipleSubscriptions": false,  
            "MultipleSubscriptionsCount": 1  
        },  
        {  
            "Id": "56f9445ffaf7560049060002",  
            "Title": "Unlimited",  
            "Description": "Subscribers have completely unlimited access to the API. Administrator approval is required.",  
            "Terms": null,  
            "ProductState": 1,  
            "AllowMultipleSubscriptions": false,  
            "MultipleSubscriptionsCount": 1  
        }  
    ]  
}  
```  
  
##  <a name="Product"></a> Product  
 The **Product** template allows you to customize the body of the product page in the developer portal.  
  
 ![Developer portal product page](./media/api-management-product-templates/APIM_ProductPage.png "APIM_ProductPage")  
  
### Default template  
  
```xml  
<h2>{{Product.Title}}</h2>  
<p>{{Product.Description}}</p>  
  
{% assign replaceString0 = '{0}' %}  
  
{% if Limits and Limits.size > 0 %}  
<h3>{% localized "ProductDetailsStrings|WebProductsUsageLimitsHeader"%}</h3>  
<ul>  
  {% for limit in Limits %}  
  <li>{{limit.DisplayName}}</li>  
  {% endfor %}  
</ul>  
{% endif %}  
  
{% if apis.size > 0 %}  
<p>  
  <b>  
    {% if apis.size == 1 %}  
    {% capture apisCountText %}{% localized "ProductDetailsStrings|TextblockSingleApisCount" %}{% endcapture %}  
    {% else %}  
    {% capture apisCountText %}{% localized "ProductDetailsStrings|TextblockMultipleApisCount" %}{% endcapture %}  
    {% endif %}  
  
    {% capture apisCount %}{{apis.size}}{% endcapture %}  
    {{ apisCountText | replace : replaceString0, apisCount }}  
  </b>  
</p>  
  
<ul>  
  {% for api in Apis %}  
  <li>  
    <a href="/docs/services/{{api.Id}}">{{api.Name}}</a>  
  </li>  
  {% endfor %}  
</ul>  
{% endif %}  
  
{% if subscriptions.size > 0 %}  
<p>  
  <b>  
    {% if subscriptions.size == 1 %}  
    {% capture subscriptionsCountText %}{% localized "ProductDetailsStrings|TextblockSingleSubscriptionsCount" %}{% endcapture %}  
    {% else %}  
    {% capture subscriptionsCountText %}{% localized "ProductDetailsStrings|TextblockMultipleSubscriptionsCount" %}{% endcapture %}  
    {% endif %}  
  
    {% capture subscriptionsCount %}{{subscriptions.size}}{% endcapture %}  
    {{ subscriptionsCountText | replace : replaceString0, subscriptionsCount }}  
  </b>  
</p>  
  
<ul>  
  {% for subscription in subscriptions %}  
  <li>  
    <a href="/developer#{{subscription.Id}}">{{subscription.DisplayName}}</a>  
  </li>  
  {% endfor %}  
</ul>  
{% endif %}  
{% if CannotAddBecauseSubscriptionNumberLimitReached %}  
<b>{% localized "ProductDetailsStrings|TextblockSubscriptionLimitReached" %}</b>  
{% elsif CannotAddBecauseMultipleSubscriptionsNotAllowed == false %}  
<subscribe-button></subscribe-button>  
{% endif %}  
```  
  
### Controls  
 The `Product list` template may use the following [page controls](api-management-page-controls.md).  
  
-   [subscribe-button](api-management-page-controls.md#subscribe-button)  
  
### Data model  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|Product|[Product](api-management-template-data-model-reference.md#Product)|The specified product.|  
|IsDeveloperSubscribed|boolean|Whether the current user is subscribed to this product.|  
|SubscriptionState|number|The state of the subscription. Possible states are:<br /><br /> -   `0 - suspended` – the subscription is blocked, and the subscriber cannot call any APIs of the product.<br />-   `1 - active` – the subscription is active.<br />-   `2 - expired` – the subscription reached its expiration date and was deactivated.<br />-   `3 - submitted` – the subscription request has been made by the developer, but has not yet been approved or rejected.<br />-   `4 - rejected` – the subscription request has been denied by an administrator.<br />-   `5 - cancelled` – the subscription has been cancelled by the developer or administrator.|  
|Limits|array|This property is deprecated and should not be used.|  
|DelegatedSubscriptionEnabled|boolean|Whether [delegation](https://azure.microsoft.com/documentation/articles/api-management-howto-setup-delegation/) is enabled for this subscription.|  
|DelegatedSubscriptionUrl|string|If delegation is enabled, the delegated subscription URL.|  
|IsAgreed|boolean|If the product has terms, whether the current user has agreed to the terms.|  
|Subscriptions|Collection of [Subscription summary](api-management-template-data-model-reference.md#SubscriptionSummary) entities.|The subscriptions to the product.|  
|Apis|Collection of [API](api-management-template-data-model-reference.md#API) entities.|The APIs in this product.|  
|CannotAddBecauseSubscriptionNumberLimitReached|boolean|Whether the current user is eligible to subscribe to this product with regard to the subscription limit.|  
|CannotAddBecauseMultipleSubscriptionsNotAllowed|boolean|Whether the current user is eligible to subscribe to this product with regard to multiple subscriptions being allowed or not.|  
  
### Sample template data  
  
```json  
{  
    "Product": {  
        "Id": "56f9445ffaf7560049060001",  
        "Title": "Starter",  
        "Description": "Subscribers will be able to run 5 calls/minute up to a maximum of 100 calls/week.",  
        "Terms": "",  
        "ProductState": 1,  
        "AllowMultipleSubscriptions": false,  
        "MultipleSubscriptionsCount": 1  
    },  
    "IsDeveloperSubscribed": true,  
    "SubscriptionState": 1,  
    "Limits": [],  
    "DelegatedSubscriptionEnabled": false,  
    "DelegatedSubscriptionUrl": null,  
    "IsAgreed": false,  
    "Subscriptions": [  
        {  
            "Id": "56f9445ffaf7560049070001",  
            "DisplayName": "Starter  (default)"  
        }  
    ],  
    "Apis": [  
        {  
            "id": "56f9445ffaf7560049040001",  
            "name": "Echo API",  
            "description": null,  
            "serviceUrl": "http://echoapi.cloudapp.net/api",  
            "path": "echo",  
            "protocols": [  
                2  
            ],  
            "authenticationSettings": null,  
            "subscriptionKeyParameterNames": null  
        }  
    ],  
    "CannotAddBecauseSubscriptionNumberLimitReached": false,  
    "CannotAddBecauseMultipleSubscriptionsNotAllowed": true  
}  
```

## Next steps
For more information about working with templates, see [How to customize the API Management developer portal using templates](api-management-developer-portal-templates.md).