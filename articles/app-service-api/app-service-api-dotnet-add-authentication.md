<properties 
	pageTitle="Protect an Azure API app" 
	description="Learn how to protect an Azure API app using Visual Studio." 
	services="app-service\api" 
	documentationCenter=".net" 
	authors="tdykstra" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="app-service-api" 
	ms.workload="web" 
	ms.tgt_pltfrm="dotnet" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/27/2015" 
	ms.author="tdykstra"/>

# Protect an API app: Add Azure Active Directory or social provider authentication

## Overview

This tutorial shows how to protect an API app so that only authenticated users can access it. The tutorial also shows code that you can use in an ASP.NET API app to retrieve information about the logged-on user.

You'll perform the following steps:

- Call the API app to verify that it's working.
- Apply authentication rules to the API app.
- Call the API app again to verify that it rejects unauthenticated requests.
- Log in to the configured provider.
- Call the API app again to verify that authenticated access works.
- Write and test code that retrieves claims for the logged-on user.

For more information about authentication in Azure App Service, see [Authentication for API apps and mobile apps](../app-service/app-service-authentication-overview.md).

## Prerequisites

This tutorial works with the API app that you created in [Create an API app](app-service-dotnet-create-api-app.md) and deployed in [Deploy an API app](app-service-dotnet-deploy-api-app.md).

## Use the browser to call the API app 

The simplest way to verify that your API app is publicly accessible is to call it from a browser.

1. In your browser, go to the [Azure preview portal].

3. From the home page click **Browse > API Apps** and then click the name of the API app you want to protect.

	![Browse](./media/app-service-api-dotnet-add-authentication/browse.png)

	![Select API app](./media/app-service-api-dotnet-add-authentication/select.png)

3. In the **API App** blade, click the **URL** to open a browser window that calls your API App.

	![API App blade](./media/app-service-api-dotnet-add-authentication/chooseapiappurl.png)

2. Add `/api/contacts/get/` to the URL in the browser address bar.

	For example, if your API app's URL is this:

    	https://microsoft-apiappeeb5bdsasd744e188be7fa26f239bd4b.azurewebsites.net/

	The complete URL would be this:

    	https://microsoft-apiappeeb5bdsasd744e188be7fa26f239bd4b.azurewebsites.net/api/contacts/get/

	Different browsers handle API calls differently. The image shows a successful call from a Chrome browser.

	![Chrome Get response](./media/app-service-api-dotnet-add-authentication/chromeget.png)

2. Save the URL you used; you'll use it again later in the tutorial.

## Protect the API app

When you deployed your API app, you deployed it to a resource group. You can add web apps and other API apps to the same resource group, and each API app within the resource group can have one of three accessibility settings:
<!--todo: diagram showing different accessibility settings-->

- **Public (anonymous)** - Anyone can call the API app from outside the resource group without being logged in.
- **Public (authenticated)** - Only authenticated users are allowed to call the API app from outside the resource group.
- **Internal** - Only other API apps in the same resource group are allowed to call the API app. (Calls from web apps are considered external even if the web apps are in the same resource group.)

When Visual Studio created the resource group for you, it also created a *gateway*.  A gateway is a special web app that handles all requests destined for API apps in the resource group.

When you go to the resource group's blade in the [Azure preview portal], you can see your API app and the gateway in the diagram.

![Resource group diagram](./media/app-service-api-dotnet-add-authentication/rgdiagram.png)

### <a id="apiapp"></a>Configure the API app to require authentication

To configure your API app to accept only authenticated requests, you'll set its accessibility to **Public (authenticated)** and you'll configure the gateway to require authentication from a provider such as Azure Active Directory, Google, or Facebook.

[AZURE.INCLUDE [app-service-api-config-auth](../../includes/app-service-api-config-auth.md)]

You have now protected the API app from unauthenticated access. Next you have to configure the gateway to specify which authentication provider to use.

### <a id="gateway"></a>Configure the gateway to use an authentication provider

[AZURE.INCLUDE [app-service-api-gateway-config-auth](../../includes/app-service-api-gateway-config-auth.md)]

## Verify that authentication works

**Note:** If you have a problem logging in when you do the following steps, try opening a private or incognito window.
 
1. Open a browser window, and in the address bar enter the URL that calls your API app's `Get` method, as you did earlier.

	This time the attempt to access the API app results in an error message.

	![Chrome Get response fail](./media/app-service-api-dotnet-add-authentication/chromegetfail.png)

2. In the browser, go to the login URL. The URL follows this pattern: 

    	http://[gatewayurl]/login/[providername]

	You can get the gateway URL from the **Gateway** blade in the [Azure preview portal]. (To get to the **Gateway** blade, click the gateway in the diagram shown on the **Resource group** blade.)

	![Gateway URL](./media/app-service-api-dotnet-add-authentication/gatewayurl.png)

	The [providername] must be one of the following values:
	
	* "microsoftaccount"
	* "facebook"
	* "twitter"
	* "google"
	* "aad"

	Here is a sample login URL for Azure Active Directory:

		https://dropboxrgaeb4ae60b7cb4f3d966dfa43.azurewebsites.net/login/aad/

	Notice that unlike the earlier URL, this one does not include your API app name:  the gateway is authenticating you, not the API app.  The gateway handles authentication for all API apps in the resource group.

3. Enter your credentials when the browser displays a login page. 
 
	If you configured Azure Active Directory login, use one of the users listed in the **Users** tab for the application you created in the Azure Active Directory tab of the [Azure portal], such as admin@contoso.onmicrosoft.com.

	![AAD users](./media/app-service-api-dotnet-add-authentication/aadusers.png)

	![Login page](./media/app-service-api-dotnet-add-authentication/ffsignin.png)

4. When the "login complete" message appears, enter the URL to your API app's Get method again.

	This time because you've authenticated, the call is successful. The gateway recognizes that you are an authenticated user and passes your request on to your API app.

	![Login completed](./media/app-service-api-dotnet-add-authentication/logincomplete.png)

	![Chrome Get response](./media/app-service-api-dotnet-add-authentication/chromeget.png)

	If you have enabled the Swagger UI, you can also go to the Swagger UI page now. However, you'll see a red **ERROR** icon at the bottom right corner of the page, and if you click the icon you'll see a message saying that the Swagger JSON file is inaccessible. This is because Swagger makes an AJAX call without including the Zumo token to try to retrieve the JSON file. This does not prevent the Swagger UI page from working.

## Use Postman to send a Post request

When you log in to the gateway, the gateway sends back an authentication token.  This token must be included with all requests from external sources that go through the gateway. When you access an API with a browser, the browser typically stores the token in a cookie and sends it along with all subsequent calls to the API.

So you can see what is happening in the background, in this section of the tutorial you use a browser tool to create and submit a Post request, and you get the authorization token from the cookie and include it in an HTTP header. This section is optional: in the previous section you already verified that the API app accepts only authenticated access.

These instructions show how to use the Postman tool in the Chrome browser, but you could do the same thing with any REST client tool and browser developer tools.

1. In a Chrome browser window, go through the steps shown in the previous section to authenticate, and then open developer tools (F12).

	![Go to Resources tab](./media/app-service-api-dotnet-add-authentication/resources.png)

3. In the **Resources** tab of Chrome developer tools, find the cookies for your gateway, and triple-click the Value of the **x-zumo-auth** cookie to select all of it.

	**Note:**  Make sure you get all of the cookie's value. If you double-click, you'll get only the first part of it.

5. Right-click the **Value** of the **x-zumo-auth** cookie, and then click **Copy**.

	![Copy auth token](./media/app-service-api-dotnet-add-authentication/copyzumotoken.png)

4. Install the Postman extension in your Chrome browser if you haven't done so yet.

6. Open the Postman extension.

7. In the Request URL field, enter the URL to your API app's Get method that you used previously, but omit `get/` from the end.
 
		http://[apiappurl]/api/contacts
    
8. Click **Headers**, and then add an *x-zumo-auth* header. Paste the token value from the clipboard into the **Value** field.

9. Add a *Content-Type* header with value *application/json*.

10. Click **form-data**, and then add a *contact* key with the following value:

		{   "Id": 0,   "Name": "Li Yan",   "EmailAddress": "yan@contoso.com" }

11. Click Send.

	The API app returns a *201 Created* response.

	![Add headers and body](./media/app-service-api-dotnet-add-authentication/addcontact.png)

12. To verify that this request would not work without the authentication token, delete the authentication header and click Send again.

	You get a *403 Forbidden* response.

	![403 Forbidden response](./media/app-service-api-dotnet-add-authentication/403forbidden.png)

## Get information about the logged-on user

In this section you change the code in the ContactsList API app so that it retrieves and returns the name and email address of the logged-on user.  

1. In Visual Studio, open the API app project that you deployed in [Deploy an API app](app-service-dotnet-deploy-api-app.md) and have been calling for this tutorial.

3. Open the apiapp.json file, and add a line that indicates the API app uses Azure Active Directory authentication.

		"authentication": [{"type": "aad"}]

	The final apiapp.json file will resemble the following example:

		{
		    "$schema": "http://json-schema.org/schemas/2014-11-01/apiapp.json#",
		    "id": "ContactsList",
		    "namespace": "microsoft.com",
		    "gateway": "2015-01-14",
		    "version": "1.0.0",
		    "title": "ContactsList",
		    "summary": "",
		    "author": "",
		    "endpoints": {
		        "apiDefinition": "/swagger/docs/v1",
		        "status": null
		    },
		    "authentication": [{"type": "aad"}]
		}

	This tutorial uses Azure Active Directory as an example. For other providers you would use the appropriate identifier. Here are the valid provider values:

	* "aad"
	* "microsoftaccount"
	* "google"
	* "twitter"
	* "facebook". 

3. In the *ContactsController.cs* file, add a `using` statement at the top of the file.

		using Microsoft.Azure.AppService.ApiApps.Service;

2. Replace the code  in the `Get` method with the following code.

		var runtime = Runtime.FromAppSettings(Request);
		var user = runtime.CurrentUser;
		TokenResult token = await user.GetRawTokenAsync("aad");
		var name = (string)token.Claims["name"];
		var email = (string)token.Claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"];
		return new Contact[]
		{
		    new Contact { Id = 1, EmailAddress = email, Name = name }
		};

	Instead of the three sample contacts, the code returns contact information for the logged-on user. 

	The sample code uses Azure Active Directory. For other providers you would use the appropriate token name and claims identifier as shown in the previous step.

	For information about Azure Active Directory claims that are available, see [Supported Token and Claim Types](https://msdn.microsoft.com/library/dn195587.aspx).

3. Add a using statement for `Microsoft.Azure.AppService.ApiApps.Service`.

		using Microsoft.Azure.AppService.ApiApps.Service;

3. Redeploy the project.  

	Visual Studio will remember the settings from when you deployed the project while following the [Deploy](app-service-dotnet-deploy-api-app.md) tutorial.  Right-click the project, click **Publish**, and then click **Publish** in the **Publish Web** dialog.

6. Follow the procedure you did earlier to send a Get request to the protected API app. 

	The response message shows the name and ID of the identity you used to log in.

	![Response message with logged on user](./media/app-service-api-dotnet-add-authentication/chromegetuserinfo.png)

## Next steps

You've seen how to protect an Azure API app by requiring Azure Active Directory or social provider authentication. For more information, see [Authentication for API apps and mobile apps](../app-service/app-service-authentication-overview.md). 

[Azure portal]: https://manage.windowsazure.com/
[Azure preview portal]: https://portal.azure.com/
