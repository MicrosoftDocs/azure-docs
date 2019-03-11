---
title: Azure API Management page controls | Microsoft Docs
description: Learn about the page controls available for use in developer portal templates in Azure API Management.
services: api-management
documentationcenter: ''
author: vladvino
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/20/2017
ms.author: apimpm
---

# Azure API Management page controls
Azure API Management provides the following controls for use in the developer portal templates.  
  
To use a control, place it in the desired location in the developer portal template. Some controls, such as the [app-actions](#app-actions) control, have parameters, as shown in the following example:  
  
```xml  
<app-actions params="{ appId: '{{app.id}}' }"></app-actions>  
```  
  
 The values for the parameters are passed in as part of the data model for the template. In most cases, you can simply paste in the provided example for each control for it to work correctly. For more information on the parameter values, you can see the data model section for each template in which a control may be used.  
  
 For more information about working with templates, see [How to customize the API Management developer portal using templates](https://azure.microsoft.com/documentation/articles/api-management-developer-portal-templates/).  

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]
  
## Developer portal template page controls  
  
-   [app-actions](#app-actions)  
-   [basic-signin](#basic-signin)  
-   [paging-control](#paging-control)  
-   [providers](#providers)  
-   [search-control](#search-control)  
-   [sign-up](#sign-up)  
-   [subscribe-button](#subscribe-button)  
-   [subscription-cancel](#subscription-cancel)  
  
##  <a name="app-actions"></a> app-actions  
 The `app-actions` control provides a user interface for interacting with applications on the user profile page in the developer portal.  
  
 ![app&#45;actions control](./media/api-management-page-controls/APIM-app-actions-control.png "APIM app-actions control")  
  
### Usage  
  
```xml  
<app-actions params="{ appId: '{{app.id}}' }"></app-actions>  
```  
  
### Parameters  
  
|Parameter|Description|  
|---------------|-----------------|  
|appId|The id of the application.|  
  
### Developer portal templates  
 The `app-actions` control may be used in the following developer portal templates:  
  
-   [Applications](api-management-user-profile-templates.md#Applications)  
  
##  <a name="basic-signin"></a> basic-signin  
 The `basic-signin` control provides a control for collecting user sign-in information in the sign-in page in the developer portal.  
  
 ![basic&#45;signin control](./media/api-management-page-controls/APIM-basic-signin-control.png "APIM basic-signin control")  
  
### Usage  
  
```xml  
<basic-SignIn></basic-SignIn>  
```  
  
### Parameters  
 None.  
  
### Developer portal templates  
 The `basic-signin` control may be used in the following developer portal templates:  
  
-   [Sign in](api-management-page-templates.md#SignIn)  
  
##  <a name="paging-control"></a> paging-control  
 The `paging-control` provides paging functionality on developer portal pages that display a list of items.  
  
 ![paging control](./media/api-management-page-controls/APIM-paging-control.png "APIM paging control")  
  
### Usage  
  
```xml  
<paging-control></paging-control>  
```  
  
### Parameters  
 None.  
  
### Developer portal templates  
 The `paging-control` control may be used in the following developer portal templates:  
  
-   [API list](api-management-api-templates.md#APIList)  
  
-   [Issue list](api-management-issue-templates.md#IssueList)  
  
-   [Product list](api-management-product-templates.md#ProductList)  
  
##  <a name="providers"></a> providers  
 The `providers` control provides a control for selection of authentication providers in the sign-in page in the developer portal.  
  
 ![providers control](./media/api-management-page-controls/APIM-providers-control.png "APIM providers control")  
  
### Usage  
  
```xml  
<providers></providers>  
```  
  
### Parameters  
 None.  
  
### Developer portal templates  
 The `providers` control may be used in the following developer portal templates:  
  
-   [Sign in](api-management-page-templates.md#SignIn)  
  
##  <a name="search-control"></a> search-control  
 The `search-control` provides search functionality on developer portal pages that display a list of items.  
  
 ![search control](./media/api-management-page-controls/APIM-search-control.png "APIM search control")  
  
### Usage  
  
```xml  
<search-control></search-control>  
```  
  
### Parameters  
 None.  
  
### Developer portal templates  
 The `search-control` control may be used in the following developer portal templates:  
  
-   [API list](api-management-api-templates.md#APIList)  
  
-   [Product list](api-management-product-templates.md#ProductList)  
  
##  <a name="sign-up"></a> sign-up  
 The `sign-up` control provides a control for collecting user profile information in the sign-up page in the developer portal.  
  
 ![sign&#45;up control](./media/api-management-page-controls/APIM-sign-up-control.png "APIM sign-up control")  
  
### Usage  
  
```xml  
<sign-up></sign-up>  
```  
  
### Parameters  
 None.  
  
### Developer portal templates  
 The `sign-up` control may be used in the following developer portal templates:  
  
-   [Sign up](api-management-page-templates.md#SignUp)  
  
##  <a name="subscribe-button"></a> subscribe-button  
 The `subscribe-button` provides a control for subscribing a user to a product.  
  
 ![subscribe&#45;button control](./media/api-management-page-controls/APIM-subscribe-button-control.png "APIM subscribe-button control")  
  
### Usage  
  
```xml  
<subscribe-button></subscribe-button>  
```  
  
### Parameters  
 None.  
  
### Developer portal templates  
 The `subscribe-button` control may be used in the following developer portal templates:  
  
-   [Product](api-management-product-templates.md#Product)  
  
##  <a name="subscription-cancel"></a> subscription-cancel  
 The `subscription-cancel` control provides a control for canceling a subscription to a product in the user profile page in the developer portal.  
  
 ![subscription&#45;cancel control](./media/api-management-page-controls/APIM-subscription-cancel-control.png "APIM subscription-cancel control")  
  
### Usage  
  
```xml  
<subscription-cancel params="{ subscriptionId: '{{subscription.id}}', cancelUrl: '{{subscription.cancelUrl}}' }">  
</subscription-cancel>  
  
```  
  
### Parameters  
  
|Parameter|Description|  
|---------------|-----------------|  
|subscriptionId|The id of the subscription to cancel.|  
|cancelUrl|The subscription cancels URL.|  
  
### Developer portal templates  
 The `subscription-cancel` control may be used in the following developer portal templates:  
  
-   [Product](api-management-product-templates.md#Product)

## Next steps
For more information about working with templates, see [How to customize the API Management developer portal using templates](api-management-developer-portal-templates.md).