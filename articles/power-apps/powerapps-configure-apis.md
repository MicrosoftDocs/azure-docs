<properties
	pageTitle="Change or update your PowerApps API properties in the Azure portal | Microsoft Azure"
	description="Add a custom icon, update the XML policy, or update the Swagger definition of your PowerApps API"
	services=""
    suite="powerapps"
	documentationCenter="" 
	authors="MandiOhlinger"
	manager="dwrede"
	editor=""/>

<tags
   ms.service="powerapps"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="05/02/2016"
   ms.author="guayan"/>

# Update an existing API and its properties

> [AZURE.IMPORTANT] This topic is archived and will soon be removed. Come and see what we're up to at the new [PowerApps](https://powerapps.microsoft.com). 
> 
> - To learn more about PowerApps and to get started, go to [PowerApps](https://powerapps.microsoft.com).  
> - To learn more about custom APIs in PowerApps, go to [What are Custom APIs](https://powerapps.microsoft.com/tutorials/register-custom-api/). 

<!--Archived
The API you register in the app service environment is essentially a proxy to your backend service. Once you create the API, you may want to change its properties. For example, you may want to: 

- Add a custom icon for your API.
- Change how you secure the backend used by the API. 
- Update the display name of your API to a more user friendly name.


#### Prerequisites to get started

- Sign up for [PowerApps Enterprise](powerapps-get-started-azure-portal.md).
- Create an [app service environment](powerapps-get-started-azure-portal.md).
- Register an [API](powerapps-register-from-available-apis) in your environment.

## Add a custom icon or add a user friendly display name

1. In the [Azure portal](https://portal.azure.com), open the blade for your API.
2. Select **All settings**.
3. In **Settings**, select **General**:  
![][11]

In General, you can change the following settings:

Setting | Description
--- | ---
Display name | This name is used when listing the *Available connections* in PowerApps. By default, it uses the API's resource name, which may not be the best name for your PowerApps users. You can enter a user friendly display name. For example, you can name it **New Customer Orders** or **View Sales History**.  
Icon URL | You can add a custom icon for you API. The icon is used when listing the *Available connections* and *My connections* in PowerApps. By default, the following icon is used: <br/><br/>![][12] <br/><br/>When using a custom icon:<br/><ul><li>The URL to the icon must be publicly accessible.</li><li>It can be a .png or an .svg file. When using a png file, 40 x 40 pixels is preferred.</li></ul>
URL Scheme | Choose which scheme or schemes you want your API to support. You can choose **HTTP**, **HTTPS**, or **HTTP and HTTPS**. By default, HTTP and HTTPS are enabled. <br/><br/>The app service environment automatically configures the scheme based on the backend configuration. So if there is anything additional you need to configure, you can develop or change your backend service. 
Authenticate with backend service | After registering your backend service in the app service environment, it's a good idea to secure the backend so that clients only call it using your API. Based on where your backend is deployed,  the following options are available:<br/><br/><ul><li><strong>Only accessible via this API</strong>: This option is only available when your backend is deployed in the app service environment. When selected, it disables any host name on your backend. Since the API proxy is also running in the same app service environment, it can still access your backend.</li><li><strong>HTTP basic authentication</strong>: This option is available regardless of where you backend is deployed. When selected, you enter a user name and password. When the proxy calls your backend, it uses HTTP basic authentication to pass the username and password in the HTTP Authorization header. Finally, your backend service needs to confirm (authenticate) the user name and password entered.<br/><br/>To learn more about implementing HTTP basic authentication in ASP.NET Web API 2, see [Authentication Filters in ASP.NET Web API 2](http://www.asp.net/web-api/overview/security/authentication-filters).</li></ul>


## Update the Swagger of your API

1. In the [Azure portal](https://portal.azure.com), open the blade for your API.
2. Select **All settings**.
3. In **Settings**, select **API definition**:  
![][13]

**Swagger 2.0** is the supported API definition format. The current API definition is in the embedded JSON editor. You can edit inline or upload a new JSON file. After you **Save** your changes, any errors are shown in this blade, including any errors with the API definition.

- To learn more about Swagger 2.0, see the [official Swagger website](http://swagger.io).
- To learn more about how to get Swagger 2.0 when developing your API, see:  
	- [Create an ASP.NET API app in Azure App Service](../app-service-dotnet-create-api-app.md)
	- [Build and deploy a Java API app in Azure App Service](../app-service-api-java-api-app.md)
	- [Build and deploy a Node.js API app in Azure App Service](../app-service-api-nodejs-api-app.md)
	- [Customize Swashbuckle-generated API definitions](../app-service-api-dotnet-swashbuckle-customize.md)
- To learn more about best practices of using Swagger 2.0 for PowerApps, see [Develop an API for PowerApps](powerapps-develop-api.md).

## Update the XML policy of your API

1. In the [Azure portal](https://portal.azure.com), open the blade for your API.
2. Select **All settings**.
3. In **Settings**, select **Policy**:  
![][14]

This policy is the same policy supported by [Azure API Management](https://azure.microsoft.com/services/api-management/). The current policy is in the embedded XML editor. You can either edit inline or upload a new XML file. After you **Save** your changes, any errors are shown in this blade, including any issues with the API policy.

[Policies in Azure API Management](../api-management/api-management-howto-policies.md) is a good resource to learn more about configuring and understanding policies.


## Summary and next steps
After you create your API, you can use the steps in this topic to change its settings and even customize some settings. 

Here are some related topics and resources for learning more about PowerApps.

- [Configure an API to Connect to AAD Protected Backend](powerapps-configure-apis-aad.md)
- [Develop an API for PowerApps](powerapps-develop-api.md)
-->


[11]: ./media/powerapps-configure-apis/api-settings-general.png
[12]: ./media/powerapps-configure-apis/api-default-icon.png
[13]: ./media/powerapps-configure-apis/api-settings-api-definition.png
[14]: ./media/powerapps-configure-apis/api-settings-policy.png
