<properties
	pageTitle="Configure APIs | Microsoft Azure"
	description="Configure APIs"
	services="power-apps"
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="power-apps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="" 
   ms.date="11/30/2015"
   ms.author="guayan"/>

# Configure APIs

The API you registered in App Service Environment is essentially a proxy to your backend service. This topic explains how to configure an API using the [Azure portal](https://portal.azure.com).

#### Prerequisites to get started

- Sign up for PowerApps Enterprise
- Create an App Service Environment

## General settings

1. In the [Azure portal](https://portal.azure.com), open the blade for API.
2. Click **All settings**.
3. Click **General**.
	![][11]

Here you can configure the following settings:

**Display name**. Provide a user friendly display name for the API. This will be used by PowerApps when listing available connections. By default, it uses the API's resource name.

**Icon URL**. Provide a custom icon for the API. This will be used by PowerApps when listing both available connections and my connections. By default, it uses the icon below. When set, the URL needs to be publicly accessible. It can be either a png or a svg file. When using a png file, 40 x 40 pixels is preferred.
![][12]

**URL scheme**. Specify which scheme or schemes you want this API to support. You can choose **HTTP**, **HTTPS** or **HTTP and HTTPS**. By default it will enable both HTTP and HTTPS. There is nothing you need to configure, develop or change on your backend service. App Service Environment will configure the scheme based on this configuration automatically.

**Authenticate with backend service**. After registering your backend service as an API in App Service Environment, it's a good idea to secure the backend so that clients will only call it via the registered API. Based on where your backend is deployed, following are the options:

- **Only accessible via this API**: This option is only available when your backend is deployed in the App Service Environment. When selected, it will disable any host name on your backend. Since the API proxy is running in the App Service Environment as well, it can still access your backend.
- **HTTP basic authentication**: This option is available regardless where you backend is deployed. When selected, you can specify a pair of user name and password. Then when the proxy calls your backend, it will use HTTP basic authentication to pass the user name and password in the HTTP Authorization header. Finally, your backend service needs to check for the user name and password.
	- To learn more about HTTP basic authentication, please see [RFC 2617, HTTP Authentication: Basic and Digest Access Authentication](http://www.ietf.org/rfc/rfc2617.txt).
	- To learn more about implementing HTTP basic authentication in ASP.NET Web API 2, please see [Authentication Filters in ASP.NET Web API 2](http://www.asp.net/web-api/overview/security/authentication-filters).

## API definition

1. In the [Azure portal](https://portal.azure.com), open the blade for API.
2. Click **All settings**.
3. Click **API definition**.
	![][13]

Here you can view and modify the API definition of your API. The supported API definition format is **Swagger 2.0**. The current API definition is in the embedded JSON editor. You can either edit inline or upload a new file. After clicking **Save** button, if there is any issue with the API definition, it will show the errors in this blade as well.

- To learn more about Swagger 2.0, please see the [Swagger official website](http://swagger.io).
- To learn more about how to get Swagger 2.0 when developing your API, please see
	- [Create an ASP.NET API app in Azure App Service]()
	- [Build and deploy a Java API app in Azure App Service]()
	- [Build and deploy a Node.js API app in Azure App Service]()
	- [Customize Swashbuckle-generated API definitions]()
- To learn more about best practices of using Swagger 2.0 for PowerApps, please see [Develop an API for PowerApps](powerapps-develop-api.md)

## Policy

1. In the [Azure portal](https://portal.azure.com), open the blade for API.
2. Click **All settings**.
3. Click **Policy**.
	![][14]

Here you can view and modify the policy of your API. This is the same policy supported by [Azure API Management](https://azure.microsoft.com/services/api-management). The current policy is in the embedded XML editor. You can either edit inline or upload a new file. After clicking **Save** button, if there is any issue with the API definition, it will show the errors in this blade as well.

To learn more about Azure API Management policy, please see [Policies in Azure API Management](https://azure.microsoft.com/documentation/articles/api-management-howto-policies).


## Summary and next steps


[11]: ./media/powerapps-configure-apis/api-settings-general.png
[12]: ./media/powerapps-configure-apis/api-default-icon.png
[13]: ./media/powerapps-configure-apis/api-settings-api-definition.png
[14]: ./media/powerapps-configure-apis/api-settings-policy.png