---
title: Azure API Management template data model reference | Microsoft Docs
description: Learn about the entity and type representations for common items used in the data models for the developer portal templates in Azure API Management.
services: api-management
documentationcenter: ''
author: dlepow
manager: erikre
editor: ''

ms.assetid: b0ad7e15-9519-4517-bb73-32e593ed6380
ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 11/04/2019
ms.author: danlep
---
# Azure API Management template data model reference
This topic describes the entity and type representations for common items used in the data models for the developer portal templates in Azure API Management.  
  
 For more information about working with templates, see [How to customize the API Management developer portal using templates](./api-management-developer-portal-templates.md).  

[!INCLUDE [api-management-portal-legacy.md](../../includes/api-management-portal-legacy.md)]

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Reference

-   [API](#API)  
-   [API summary](#APISummary)  
-   [Application](#Application)  
-   [Attachment](#Attachment)  
-   [Code sample](#Sample)  
-   [Comment](#Comment)  
-   [Filtering](#Filtering)  
-   [Header](#Header)  
-   [HTTP Request](#HTTPRequest)  
-   [HTTP Response](#HTTPResponse)  
-   [Issue](#Issue)  
-   [Operation](#Operation)  
-   [Operation menu](#Menu)  
-   [Operation menu item](#MenuItem)  
-   [Paging](#Paging)  
-   [Parameter](#Parameter)  
-   [Product](#Product)  
-   [Provider](#Provider)  
-   [Representation](#Representation)  
-   [Subscription](#Subscription)  
-   [Subscription summary](#SubscriptionSummary)  
-   [User account info](#UserAccountInfo)  
-   [User sign-in](#UseSignIn)  
-   [User sign-up](#UserSignUp)  
  
##  <a name="API"></a> API  
 The `API` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`id`|string|Resource identifier. Uniquely identifies the API within the current API Management service instance. The value is a valid relative URL in the format of `apis/{id}` where `{id}` is an API identifier. This property is read-only.|  
|`name`|string|Name of the API. Must not be empty. Maximum length is 100 characters.|  
|`description`|string|Description of the API. Must not be empty. May include HTML formatting tags. Maximum length is 1000 characters.|  
|`serviceUrl`|string|Absolute URL of the backend service implementing this API.|  
|`path`|string|Relative URL uniquely identifying this API and all of its resource paths within the API Management service instance. It is appended to the API endpoint base URL specified during the service instance creation to form a public URL for this API.|  
|`protocols`|array of number|Describes on which protocols the operations in this API can be invoked. Allowed values are `1 - http` and `2 - https`, or both.|  
|`authenticationSettings`|[Authorization server authentication settings](/rest/api/apimanagement/apimanagementrest/azure-api-management-rest-api-contract-reference#AuthenticationSettings)|Collection of authentication settings included in this API.|  
|`subscriptionKeyParameterNames`|object|Optional property that can be used to specify custom names for query and/or header parameters containing the subscription key. When this property is present, it must contain at least one of the two following properties.<br /><br /> `{   "subscriptionKeyParameterNames":   {     "query": “customQueryParameterName",     "header": “customHeaderParameterName"   } }`|  
  
##  <a name="APISummary"></a> API summary  
 The `API summary` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`id`|string|Resource identifier. Uniquely identifies the API within the current API Management service instance. The value is a valid relative URL in the format of `apis/{id}` where `{id}` is an API identifier. This property is read-only.|  
|`name`|string|Name of the API. Must not be empty. Maximum length is 100 characters.|  
|`description`|string|Description of the API. Must not be empty. May include HTML formatting tags. Maximum length is 1000 characters.|  
  
##  <a name="Application"></a> Application  
 The `application` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`Id`|string|The unique identifier of the application.|  
|`Title`|string|The title of the application.|  
|`Description`|string|The description of the application.|  
|`Url`|URI|The URI for the application.|  
|`Version`|string|Version information for the application.|  
|`Requirements`|string|A description of requirements for the application.|  
|`State`|number|The current state of the application.<br /><br /> - 0 - Registered<br /><br /> - 1 - Submitted<br /><br /> - 2 - Published<br /><br /> - 3 - Rejected<br /><br /> - 4 - Unpublished|  
|`RegistrationDate`|DateTime|The date and time the application was registered.|  
|`CategoryId`|number|The category of the application (Finance, entertainment, etc.)|  
|`DeveloperId`|string|The unique identifier of the developer that submitted the application.|  
|`Attachments`|Collection of [Attachment](#Attachment) entities.|Any attachments for the application such as screenshots or icons.|  
|`Icon`|[Attachment](#Attachment)|The icon the for the application.|  
  
##  <a name="Attachment"></a> Attachment  
 The `attachment` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`UniqueId`|string|The unique identifier for the attachment.|  
|`Url`|string|The URL of the resource.|  
|`Type`|string|The type of attachment.|  
|`ContentType`|string|The media type of the attachment.|  
  
##  <a name="Sample"></a> Code sample  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`title`|string|The name of the operation.|  
|`snippet`|string|This property is deprecated and should not be used.|  
|`brush`|string|Which code syntax coloring template to be used when displaying the code sample. Allowed values are `plain`, `php`, `java`, `xml`, `objc`, `python`, `ruby`, and `csharp`.|  
|`template`|string|The name of this code sample template.|  
|`body`|string|A placeholder for the code sample portion of the snippet.|  
|`method`|string|The HTTP method of the operation.|  
|`scheme`|string|The protocol to use for the operation request.|  
|`path`|string|The path of the operation.|  
|`query`|string|Query string example with defined parameters.|  
|`host`|string|The URL of the API Management service gateway for the API that contains this operation.|  
|`headers`|Collection of                                  [Header](#Header) entities.|Headers for this operation.|  
|`parameters`|Collection of [Parameter](#Parameter) entities.|Parameters that are defined for this operation.|  
  
##  <a name="Comment"></a> Comment  
 The `API` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`Id`|number|The ID of the comment.|  
|`CommentText`|string|The body of the comment. May include HTML.|  
|`DeveloperCompany`|string|The company name of the developer.|  
|`PostedOn`|DateTime|The date and time the comment was posted.|  
  
##  <a name="Issue"></a> Issue  
 The `issue` entity has the following properties.  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`Id`|string|The unique identifier for the issue.|  
|`ApiID`|string|The ID for the API for which this issue was reported.|  
|`Title`|string|Title of the issue.|  
|`Description`|string|Description of the issue.|  
|`SubscriptionDeveloperName`|string|First name of the developer that reported the issue.|  
|`IssueState`|string|The current state of the issue. Possible values are Proposed, Opened, Closed.|  
|`ReportedOn`|DateTime|The date and time the issue was reported.|  
|`Comments`|Collection of [Comment](#Comment) entities.|Comments on this issue.|  
|`Attachments`|Collection of [Attachment](api-management-template-data-model-reference.md#Attachment) entities.|Any attachments to the issue.|  
|`Services`|Collection of [API](#API) entities.|The APIs subscribed to by the user that filed the issue.|  
  
##  <a name="Filtering"></a> Filtering  
 The `filtering` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`Pattern`|string|The current search term; or `null` if there is no search term.|  
|`Placeholder`|string|The text to display in the search  box when there is no search term specified.|  
  
##  <a name="Header"></a> Header  
 This section describes the `parameter` representation.  
  
|Property|Type|Description|  
|--------------|-----------------|----------|  
|`name`|string|Parameter name.|  
|`description`|string|Parameter description.|  
|`value`|string|Header value.|  
|`typeName`|string|Data type of header value.|  
|`options`|string|Options.|  
|`required`|boolean|Whether the header is required.|  
|`readOnly`|boolean|Whether the header is read-only.|  
  
##  <a name="HTTPRequest"></a> HTTP Request  
 This section describes the `request` representation.  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`description`|string|Operation request description.|  
|`headers`|array of [Header](#Header) entities.|Request headers.|  
|`parameters`|array of [Parameter](#Parameter)|Collection of operation request parameters.|  
|`representations`|array of [Representation](#Representation)|Collection of operation request representations.|  
  
##  <a name="HTTPResponse"></a> HTTP Response  
 This section describes the `response` representation.  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`statusCode`|positive integer|Operation response status code.|  
|`description`|string|Operation response description.|  
|`representations`|array of [Representation](#Representation)|Collection of operation response representations.|  
  
##  <a name="Operation"></a> Operation  
 The `operation` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`id`|string|Resource identifier. Uniquely identifies the operation within the current API Management service instance. The value is a valid relative URL in the format of `apis/{aid}/operations/{id}` where `{aid}` is an API identifier and `{id}` is an operation identifier. This property is read-only.|  
|`name`|string|Name of the operation. Must not be empty. Maximum length is 100 characters.|  
|`description`|string|Description of the operation. Must not be empty. May include HTML formatting tags. Maximum length is 1000 characters.|  
|`scheme`|string|Describes on which protocols the operations in this API can be invoked. Allowed values are `http`, `https`, or both `http` and `https`.|  
|`uriTemplate`|string|Relative URL template identifying the target resource for this operation. May include parameters. Example: `customers/{cid}/orders/{oid}/?date={date}`|  
|`host`|string|The API Management gateway URL that hosts the API.|  
|`httpMethod`|string|Operation HTTP method.|  
|`request`|[HTTP Request](#HTTPRequest)|An entity containing request details.|  
|`responses`|array of [HTTP Response](#HTTPResponse)|Array of operation [HTTP Response](#HTTPResponse) entities.|  
  
##  <a name="Menu"></a> Operation menu  
 The `operation menu` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`ApiId`|string|The ID of the current API.|  
|`CurrentOperationId`|string|The ID of the current operation.|  
|`Action`|string|The menu type.|  
|`MenuItems`|Collection of [Operation menu item](#MenuItem) entities.|The operations for the current API.|  
  
##  <a name="MenuItem"></a> Operation menu item  
 The `operation menu item` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`Id`|string|The ID of the operation.|  
|`Title`|string|The description of the operation.|  
|`HttpMethod`|string|The Http method of the operation.|  
  
##  <a name="Paging"></a> Paging  
 The `paging` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`Page`|number|The current page number.|  
|`PageSize`|number|The maximum results to be displayed on a single page.|  
|`TotalItemCount`|number|The number of items for display.|  
|`ShowAll`|boolean|Whether to sho all results on a single page.|  
|`PageCount`|number|The number of pages of results.|  
  
##  <a name="Parameter"></a> Parameter  
 This section describes the `parameter` representation.  
  
|Property|Type|Description|  
|--------------|-----------------|----------|  
|`name`|string|Parameter name.|  
|`description`|string|Parameter description.|  
|`value`|string|Parameter value.|  
|`options`|array of string|Values defined for query parameter values.|  
|`required`|boolean|Specifies whether parameter is required or not.|  
|`kind`|number|Whether this parameter is a path parameter (1), or a querystring parameter (2).|  
|`typeName`|string|Parameter type.|  
  
##  <a name="Product"></a> Product  
 The `product` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`Id`|string|Resource identifier. Uniquely identifies the product within the current API Management service instance. The value is a valid relative URL in the format of `products/{pid}` where `{pid}` is a product identifier. This property is read-only.|  
|`Title`|string|Name of the product. Must not be empty. Maximum length is 100 characters.|  
|`Description`|string|Description of the product. Must not be empty. May include HTML formatting tags. Maximum length is 1000 characters.|  
|`Terms`|string|Product terms of use. Developers trying to subscribe to the product will be presented and required to accept these terms before they can complete the subscription process.|  
|`ProductState`|number|Specifies whether the product is published or not. Published products are discoverable by developers on the developer portal. Non-published products are visible only to administrators.<br /><br /> The allowable values for product state are:<br /><br /> - `0 - Not Published`<br /><br /> - `1 - Published`<br /><br /> - `2 - Deleted`|  
|`AllowMultipleSubscriptions`|boolean|Specifies whether a user can have multiple subscriptions to this product at the same time.|  
|`MultipleSubscriptionsCount`|number|Maximum number of subscriptions to this product a user is allowed to have at the same time.|  
  
##  <a name="Provider"></a> Provider  
 The `provider` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`Properties`|string dictionary|Properties for this authentication provider.|  
|`AuthenticationType`|string|The provider type. (Microsoft Entra ID, Facebook login, Google Account, Microsoft Account, Twitter).|  
|`Caption`|string|Display name of the provider.|  
  
##  <a name="Representation"></a> Representation  
 This section describes a `representation`.  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`contentType`|string|Specifies a registered or custom content type for this representation, for example, `application/xml`.|  
|`sample`|string|An example of the representation.|  
  
##  <a name="Subscription"></a> Subscription  
 The `subscription` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`Id`|string|Resource identifier. Uniquely identifies the subscription within the current API Management service instance. The value is a valid relative URL in the format of `subscriptions/{sid}` where `{sid}` is a subscription identifier. This property is read-only.|  
|`ProductId`|string|The product resource identifier of the subscribed product. The value is a valid relative URL in the format of `products/{pid}` where `{pid}` is a product identifier.|  
|`ProductTitle`|string|Name of the product. Must not be empty. Maximum length is 100 characters.|  
|`ProductDescription`|string|Description of the product. Must not be empty. May include HTML formatting tags. Maximum length is 1000 characters.|  
|`ProductDetailsUrl`|string|Relative URL to the product details.|  
|`state`|string|The state of the subscription. Possible states are:<br /><br /> - `0 - suspended` – the subscription is blocked, and the subscriber cannot call any APIs of the product.<br /><br /> - `1 - active` – the subscription is active.<br /><br /> - `2 - expired` – the subscription reached its expiration date and was deactivated.<br /><br /> - `3 - submitted` – the subscription request has been made by the developer, but has not yet been approved or rejected.<br /><br /> - `4 - rejected` – the subscription request has been denied by an administrator.<br /><br /> - `5 - cancelled` – the subscription has been canceled by the developer or administrator.|  
|`DisplayName`|string|Display name of the subscription.|  
|`CreatedDate`|dateTime|The date the subscription was created, in ISO 8601 format: `2014-06-24T16:25:00Z`.|  
|`CanBeCancelled`|boolean|Whether the subscription can be canceled by the current user.|  
|`IsAwaitingApproval`|boolean|Whether the subscription is awaiting approval.|  
|`StartDate`|dateTime|The start date for the subscription, in ISO 8601 format: `2014-06-24T16:25:00Z`.|  
|`ExpirationDate`|dateTime|The expiration date for the subscription, in ISO 8601 format: `2014-06-24T16:25:00Z`.|  
|`NotificationDate`|dateTime|The notification date for the subscription, in ISO 8601 format: `2014-06-24T16:25:00Z`.|  
|`primaryKey`|string|The primary subscription key. Maximum length is 256 characters.|  
|`secondaryKey`|string|The secondary subscription key. Maximum length is 256 characters.|  
|`CanBeRenewed`|boolean|Whether the subscription can be renewed by the current user.|  
|`HasExpired`|boolean|Whether the subscription has expired.|  
|`IsRejected`|boolean|Whether the subscription request was denied.|  
|`CancelUrl`|string|The relative Url to cancel the subscription.|  
|`RenewUrl`|string|The relative Url to renew the subscription.|  
  
##  <a name="SubscriptionSummary"></a> Subscription summary  
 The `subscription summary` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`Id`|string|Resource identifier. Uniquely identifies the subscription within the current API Management service instance. The value is a valid relative URL in the format of `subscriptions/{sid}` where `{sid}` is a subscription identifier. This property is read-only.|  
|`DisplayName`|string|The display name of the subscription|  
  
##  <a name="UserAccountInfo"></a> User account info  
 The `user account info` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`FirstName`|string|First name. Must not be empty. Maximum length is 100 characters.|  
|`LastName`|string|Last name. Must not be empty. Maximum length is 100 characters.|  
|`Email`|string|Email address. Must not be empty and must be unique within the service instance. Maximum length is 254 characters.|  
|`Password`|string|User account password.|  
|`NameIdentifier`|string|Account identifier, the same as the user email.|  
|`ProviderName`|string|Authentication provider name.|  
|`IsBasicAccount`|boolean|True if this account was registered using email and password; false if the account was registered using a provider.|  
  
##  <a name="UseSignIn"></a> User sign in  
 The `user sign in` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`Email`|string|Email address. Must not be empty and must be unique within the service instance. Maximum length is 254 characters.|  
|`Password`|string|User account password.|  
|`ReturnUrl`|string|The URL of the page where the user clicked sign in.|  
|`RememberMe`|boolean|Whether to save the current user's information.|  
|`RegistrationEnabled`|boolean|Whether registration is enabled.|  
|`DelegationEnabled`|boolean|Whether delegated sign in is enabled.|  
|`DelegationUrl`|string|The delegated sign in url, if enabled.|  
|`SsoSignUpUrl`|string|The single sign on URL for the user, if present.|  
|`AuxServiceUrl`|string|If the current user is an administrator, this is a link to the service instance in the Azure portal.|  
|`Providers`|Collection of [Provider](#Provider) entities|The authentication providers for this user.|  
|`UserRegistrationTerms`|string|Terms that a user must agree to before signing in.|  
|`UserRegistrationTermsEnabled`|boolean|Whether terms are enabled.|  
  
##  <a name="UserSignUp"></a> User sign up  
 The `user sign up` entity has the following properties:  
  
|Property|Type|Description|  
|--------------|----------|-----------------|  
|`PasswordConfirm`|boolean|Value used by the [sign-up](api-management-page-controls.md#sign-up)sign-up control.|  
|`Password`|string|User account password.|  
|`PasswordVerdictLevel`|number|Value used by the [sign-up](api-management-page-controls.md#sign-up)sign-up control.|  
|`UserRegistrationTerms`|string|Terms that a user must agree to before signing in.|  
|`UserRegistrationTermsOptions`|number|Value used by the [sign-up](api-management-page-controls.md#sign-up)sign-up control.|  
|`ConsentAccepted`|boolean|Value used by the [sign-up](api-management-page-controls.md#sign-up)sign-up control.|  
|`Email`|string|Email address. Must not be empty and must be unique within the service instance. Maximum length is 254 characters.|  
|`FirstName`|string|First name. Must not be empty. Maximum length is 100 characters.|  
|`LastName`|string|Last name. Must not be empty. Maximum length is 100 characters.|  
|`UserData`|string|Value used by the [sign-up](api-management-page-controls.md#sign-up) control.|  
|`NameIdentifier`|string|Value used by the [sign-up](api-management-page-controls.md#sign-up)sign-up control.|  
|`ProviderName`|string|Authentication provider name.|

## Next steps
For more information about working with templates, see [How to customize the API Management developer portal using templates](api-management-developer-portal-templates.md).
