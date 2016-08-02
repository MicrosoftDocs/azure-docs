<properties
	pageTitle="How to protect a Web API backend with Azure Active Directory and API Management"
	description="Learn how to protect a Web API backend with Azure Active Directory and API Management." 
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
	ms.date="05/24/2016"
	ms.author="sdanie"/>

# How to protect a Web API backend with Azure Active Directory and API Management

The following video shows how to build a Web API backend and protect it using OAuth 2.0 protocol with Azure Active Directory and API Management.  This article provides an overview and additional information for the steps in the video. This 24 minute video shows you how to:

-	Build a Web API backend and secure it with AAD - starting at 1:30
-	Import the API into API Management - starting at 7:10
-	Configure the Developer portal to call the API - starting at 9:09
-	Configure a desktop application to call the API - starting at 18:08
-	Configure a JWT validation policy to pre-authorize requests - starting at 20:47

>[AZURE.VIDEO protecting-web-api-backend-with-azure-active-directory-and-api-management]

## Create an Azure AD directory

To secure your Web API backed using Azure Active Directory you must first have a an AAD tenant. In this video a tenant named **APIMDemo** is used. To create an AAD tenant, sign-in to the [Azure Classic Portal](https://manage.windowsazure.com) and click **New**->**App Services**->**Active Directory**->**Directory**->**Custom Create**. 

![Azure Active Directory][api-management-create-aad-menu]

In this example a directory named **APIMDemo** is created with a default domain named **DemoAPIM.onmicrosoft.com**. This directory is used throughout the video.

![Azure Active Directory][api-management-create-aad]

## Create a Web API service secured by Azure Active Directory

In this step, a Web API backend is created using Visual Studio 2013. This step of the video starts at 1:30. To create Web API backend project in Visual Studio click **File**->**New**->**Project**, and choose **ASP.NET Web Application** from the **Web** templates list. In this video the project is named **APIMAADDemo**. Click **OK** to create the project. 

![Visual Studio][api-management-new-web-app]

Click **Web API** from the **Select a template list** to create a Web API project. To configure Azure Directory Authentication click **Change Authentication**.

![New project][api-management-new-project]

Click **Organizational Accounts**, and specify the **Domain** of your AAD tenant. In this example the domain is **DemoAPIM.onmicrosoft.com**. The domain of your directory can be obtained from the **Domains** tab of your directory.

![Domains][api-management-aad-domains]

Configure the desired settings in the **Change Authentication** dialog box and click **OK**.

![Change authentication][api-management-change-authentication]

When you click **OK** Visual Studio will attempt to register your application with your Azure AD directory and you may be prompted to sign in by Visual Studio. Sign in using an administrative account for your directory.

![Sign in to Visual Studio][api-management-sign-in-vidual-studio]

To configure this project as an Azure Web API check the box for **Host in the cloud** and then click **OK**.

![New project][api-management-new-project-cloud]

You may be prompted to sign in to Azure, and then you can configure the Web App.

![Configure][api-management-configure-web-app]

In this example a new **App Service plan** named **APIMAADDemo** is specified.

Click **OK** to configure the Web App and create the project.

## Add the code to the Web API project

The next step in the video adds the code to the Web API project. This step starts at 4:35.

The Web API in this example implements a basic calculator service using a model and a controller. To add the model for the service, right-click **Models** in **Solution Explorer** and choose **Add**, **Class**. Name the class `CalcInput` and click **Add**.

Add the following `using` statement to the top of the `CalcInput.cs` file.

	using Newtonsoft.Json;

 Replace the generated class with the following code.

    public class CalcInput
    {
        [JsonProperty(PropertyName = "a")]
        public int a;

        [JsonProperty(PropertyName = "b")]
        public int b;
    }

Right-click **Controllers** in **Solution Explorer** and choose **Add**->**Controller**. Choose **Web API 2 Controller - Empty** and click **Add**. Type **CalcController** for the Controller name and click **Add**.

![Add Controller][api-management-add-controller]

Add the following `using` statement to the top of the `CalcController.cs` file.

    using System.IO;
    using System.Web;
    using APIMAADDemo.Models;

Replace the generated controller class with the following code. This code implements the `Add`, `Subtract`, `Multiply`, and `Divide` operations of the Basic Calculator API.

    [Authorize]
    public class CalcController : ApiController
    {
        [Route("api/add")]
        [HttpGet]
        public HttpResponseMessage GetSum([FromUri]int a, [FromUri]int b)
        {
            string xml = string.Format("<result><value>{0}</value><broughtToYouBy>Azure API Management - http://azure.microsoft.com/apim/ </broughtToYouBy></result>", a + b);
            HttpResponseMessage response = Request.CreateResponse();
            response.Content = new StringContent(xml, System.Text.Encoding.UTF8, "application/xml");
            return response;
        }

        [Route("api/sub")]
        [HttpGet]
        public HttpResponseMessage GetDiff([FromUri]int a, [FromUri]int b)
        {
            string xml = string.Format("<result><value>{0}</value><broughtToYouBy>Azure API Management - http://azure.microsoft.com/apim/ </broughtToYouBy></result>", a - b);
            HttpResponseMessage response = Request.CreateResponse();
            response.Content = new StringContent(xml, System.Text.Encoding.UTF8, "application/xml");
            return response;
        }

        [Route("api/mul")]
        [HttpGet]
        public HttpResponseMessage GetProduct([FromUri]int a, [FromUri]int b)
        {
            string xml = string.Format("<result><value>{0}</value><broughtToYouBy>Azure API Management - http://azure.microsoft.com/apim/ </broughtToYouBy></result>", a * b);
            HttpResponseMessage response = Request.CreateResponse();
            response.Content = new StringContent(xml, System.Text.Encoding.UTF8, "application/xml");
            return response;
        }

        [Route("api/div")]
        [HttpGet]
        public HttpResponseMessage GetDiv([FromUri]int a, [FromUri]int b)
        {
            string xml = string.Format("<result><value>{0}</value><broughtToYouBy>Azure API Management - http://azure.microsoft.com/apim/ </broughtToYouBy></result>", a / b);
    	    HttpResponseMessage response = Request.CreateResponse();
    	    response.Content = new StringContent(xml, System.Text.Encoding.UTF8, "application/xml");
    	    return response;
    	}
    }

Press **F6** to build and verify the solution.

## Publish the project to Azure

In this step the Visual Studio project is published to Azure. This step of the video starts at 5:45.

To publish the project to Azure, right-click the **APIMAADDemo** project in Visual Studio and choose **Publish**. Keep the default settings in the **Publish Web** dialog box and click **Publish**.

![Web Publish][api-management-web-publish]

## Grant permissions to the Azure AD backend service application

A new application for the backend service is created in your Azure AD directory as part of the configuring and publishing process of your Web API project. In this step of the video, starting at 6:13, permissions are granted to the Web API backend.

![Application][api-management-aad-backend-app]

Click the name of the application to configure the required permissions. Navigate to the **Configure** tab and scroll down to the **permissions to other applications** section. Click the **Application Permissions** drop-down beside **Windows** **Azure Active Directory**, check the box for **Read directory data**, and click **Save**.

![Add permissions][api-management-aad-add-permissions]

>[AZURE.NOTE] If **Windows** **Azure Active Directory** is not listed under permissions to other applications, click **Add application** and add it from the list.

Make a note of the **App Id URI** for use in a subsequent step when an Azure AD application is configured for the API Management developer portal.

![App Id URI][api-management-aad-sso-uri]

## Import the Web API into API Management

APIs are configured from the API publisher portal, which is accessed through the Azure Classic Portal. To reach the publisher portal, click **Manage** in the Azure Classic Portal for your API Management service. If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Manage your first API][] tutorial.

![Publisher portal][api-management-management-console]

Operations can be [added to APIs manually](api-management-howto-add-operations.md), or they can be imported. In this video, operations are imported in Swagger format starting at 6:40.

Create a file named `calcapi.json` with following contents and save it to your computer. Ensure that the `host` attribute points to your Web API backend. In this example `"host": "apimaaddemo.azurewebsites.net"` is used.

{
"swagger": "2.0",
"info": {
"title": "Calculator",
"description": "Arithmetics over HTTP!",
"version": "1.0"
},
"host": "apimaaddemo.azurewebsites.net",
"basePath": "/api",
"schemes": [
"http"
],
"paths": {
"/add?a={a}&b={b}": {
		  "get": {
			"description": "Responds with a sum of two numbers.",
			"operationId": "Add two integers",
			"parameters": [
			  {
				"name": "a",
				"in": "query",
				"description": "First operand. Default value is <code>51</code>.",
				"required": true,
				"default": "51",
				"enum": [
				  "51"
				]
			  },
			  {
				"name": "b",
				"in": "query",
				"description": "Second operand. Default value is <code>49</code>.",
				"required": true,
				"default": "49",
				"enum": [
				  "49"
				]
			  }
			],
			"responses": {}
		  }
		},
		"/sub?a={a}&b={b}": {
		  "get": {
			"description": "Responds with a difference between two numbers.",
			"operationId": "Subtract two integers",
			"parameters": [
			  {
				"name": "a",
				"in": "query",
				"description": "First operand. Default value is <code>100</code>.",
				"required": true,
				"default": "100",
				"enum": [
				  "100"
				]
			  },
			  {
				"name": "b",
				"in": "query",
				"description": "Second operand. Default value is <code>50</code>.",
				"required": true,
				"default": "50",
				"enum": [
				  "50"
				]
			  }
			],
			"responses": {}
		  }
		},
		"/div?a={a}&b={b}": {
		  "get": {
			"description": "Responds with a quotient of two numbers.",
			"operationId": "Divide two integers",
			"parameters": [
			  {
				"name": "a",
				"in": "query",
				"description": "First operand. Default value is <code>100</code>.",
				"required": true,
				"default": "100",
				"enum": [
				  "100"
				]
			  },
			  {
				"name": "b",
				"in": "query",
				"description": "Second operand. Default value is <code>20</code>.",
				"required": true,
				"default": "20",
				"enum": [
				  "20"
				]
			  }
			],
			"responses": {}
		  }
		},
		"/mul?a={a}&b={b}": {
		  "get": {
			"description": "Responds with a product of two numbers.",
			"operationId": "Multiply two integers",
			"parameters": [
			  {
				"name": "a",
				"in": "query",
				"description": "First operand. Default value is <code>20</code>.",
				"required": true,
				"default": "20",
				"enum": [
				  "20"
				]
			  },
			  {
				"name": "b",
				"in": "query",
				"description": "Second operand. Default value is <code>5</code>.",
				"required": true,
				"default": "5",
				"enum": [
				  "5"
				]
			  }
			],
			"responses": {}
		  }
		}
	  }
	}

To import the calculator API, click **APIs** from the **API Management** menu on the left, and then click **Import API**.

![Import API button][api-management-import-api]

Perform the following steps to configure the calculator API.

1. Click **From file**, browse to the `calculator.json` file you saved, and click the **Swagger** radio button.
2. Type **calc** into the **Web API URL suffix** textbox.
3. Click in the **Products (optional)** box and choose **Starter**.
4. Click **Save** to import the API.

![Add new API][api-management-import-new-api]

Once the API is imported, the summary page for the API is displayed in the publisher portal.

## Call the API unsuccessfully from the developer portal

At this point, the API has been imported into API Management, but cannot yet be called successfully from the developer portal because the backend service is protected with Azure AD authentication. This is demonstrated in the video starting at 7:40 using the following steps.

Click **Developer portal** from the top-right side of the publisher portal.

![Developer portal][api-management-developer-portal-menu]

Click **APIs** and click the **Calculator** API.

![Developer portal][api-management-dev-portal-apis]

Click **Try it**.

![Try it][api-management-dev-portal-try-it]

Click **Send** and note the response status of **401 Unauthorized**.

![Send][api-management-dev-portal-send-401]

The request is unauthorized because the backend API is protected by Azure Active Directory. Before successfully calling the API the developer portal must be configured to authorize developers using OAuth 2.0. This process is described in the following sections.

## Register the developer portal as an AAD application

The first step in configuring the developer portal to authorize developers using OAuth 2.0 is to register the developer portal as an AAD application. This is demonstrated starting at 8:27 in the video.

Navigate to the Azure AD tenant from the first step of this video, in this example **APIMDemo** and navigate to the **Applications** tab.

![New application][api-management-aad-new-application-devportal]

Click the **Add** button to create a new Azure Active Directory application, and choose **Add an application my organization is developing**.

![New application][api-management-new-aad-application-menu]

Choose **Web application and/or Web API**, enter a name, and click the next arrow. In this example **APIMDeveloperPortal** is used.

![New application][api-management-aad-new-application-devportal-1]

For **Sign-on URL** enter the URL of your API Management service and append `/signin`. In this example **https://contoso5.portal.azure-api.net/signin **is used.

For **App Id URL** enter the URL of your API Management service and append some unique characters. These can be any desired characters and in this example **https://contoso5.portal.azure-api.net/dp** is used. When the  desired **App properties** are configured, click the check mark to create the application.

![New application][api-management-aad-new-application-devportal-2]

## Configure an API Management OAuth 2.0 authorization server

The next step is to configure an OAuth 2.0 authorization server in API Management. This step is demonstrated in the video starting at 9:43.

Click **Security** from the API Management menu on the left, click **OAuth 2.0**, and then click **Add authorization** server.

![Add authorization server][api-management-add-authorization-server]

Enter a name and an optional description in the **Name** and **Description** fields. These fields are used to identify the OAuth 2.0 authorization server within the API Management service instance. In this example **Authorization server demo** is used. Later when you specify an OAuth 2.0 server to be used for authentication for an API, you will select this name.

For the **Client registration page URL** enter a placeholder value such as `http://localhost`.  The **Client registration page URL** points to the page that users can use to create and configure their own accounts for OAuth 2.0 providers that support user management of accounts. In this example users do not create and configure their own accounts so a placeholder is used.

![Add authorization server][api-management-add-authorization-server-1]

Next, specify **Authorization endpoint URL** and **Token endpoint URL**.

![Authorization server][api-management-add-authorization-server-1a]

These values can be retrieved from the **App Endpoints** page of the AAD application you created for the developer portal. To access the endpoints navigate to the **Configure** tab for the AAD application and click **View endpoints**.

![Application][api-management-aad-devportal-application]

![View endpoints][api-management-aad-view-endpoints]

Copy the **OAuth 2.0 authorization endpoint** and paste it into the **Authorization endpoint URL** textbox.

![Add authorization server][api-management-add-authorization-server-2]

Copy the **OAuth 2.0 token endpoint** and paste it into the **Token endpoint URL** textbox.

![Add authorization server][api-management-add-authorization-server-2a]

In addition to pasting in the token endpoint, add an additional body parameter named **resource** and for the value use the **App Id URI** from the AAD application for the backend service that was created when the Visual Studio project was published.

![App Id URI][api-management-aad-sso-uri]

Next, specify the client credentials. These are the credentials for the resource you want to access, in this case the backend service.

![Client credentials][api-management-client-credentials]

To get the **Client Id**, navigate to the **Configure** tab of the AAD application for the backend service and copy the **Client Id**.

To get the **Client Secret** click the **Select duration** drop-down in the **Keys** section and specify an interval. In this example 1 year is used.

![Client ID][api-management-aad-client-id]

Click **Save** to save the configuration and display the key. 

>[AZURE.IMPORTANT] Make a note of this key. Once you close the Azure Active Directory configuration window, the key cannot be displayed again.

Copy the key to the clipboard, switch back to the publisher portal, paste the key into the **Client Secret** textbox, and click **Save**.

![Add authorization server][api-management-add-authorization-server-3]

Immediately following the client credentials is an authorization code grant. Copy this authorization code and switch back to your Azure AD developer portal application configure page, and paste the authorization grant into the **Reply URL** field, and click **Save** again.

![Reply URL][api-management-aad-reply-url]

The next step is to configure the permissions for the developer portal AAD application. Click **Application Permissions** and check the box for **Read directory data**. Click **Save** to save this change, and then click **Add application**.

![Add permissions][api-management-add-devportal-permissions]

Click the search icon, type **APIM** into the Starting with box, select **APIMAADDemo**, and click the check mark to save.

![Add permissions][api-management-aad-add-app-permissions]

Click **Delegated Permissions** for **APIMAADDemo** and check the box for **Access APIMAADDemo**, and click **Save**. This allows the developer portal application to access the backend service.

![Add permissions][api-management-aad-add-delegated-permissions]

## Enable OAuth 2.0 user authorization for the Calculator API

Now that the OAuth 2.0 server is configured, you can specify it in the security settings for your API. This step is demonstrated in the video starting at 14:30.

Click **APIs** in the left menu, and click  **Calculator** to view and configure its settings.

![Calculator API][api-management-calc-api]

Navigate to the **Security** tab, check the **OAuth 2.0** checkbox, select the desired authorization server from the **Authorization server** drop-down, and click **Save**.

![Calculator API][api-management-enable-aad-calculator]

## Successfully call the Calculator API from the developer portal

Now that the OAuth 2.0 authorization is configured on the API, its operations can be successfully called from the developer center. THis step is demonstrated in the video starting at 15:00.

Navigate back to the **Add two integers** operation of the calculator service in the developer portal and click **Try it**. Note the new item in the **Authorization** section corresponding to the authorization server you just added.

![Calculator API][api-management-calc-authorization-server]

Select **Authorization code** from the authorization drop-down list and enter the credentials of the account to use. If you are already signed in with the account you may not be prompted.

![Calculator API][api-management-devportal-authorization-code]

Click **Send** and note the **Response status** of **200 OK** and the results of the operation in the response content.

![Calculator API][api-management-devportal-response]

## Configure a desktop application to call the API

The next procedure in the video starts at 16:30 and configures a simple desktop application to call the API. The first step is to register the desktop application in Azure AD and give it access to the directory and to the backend service. At 18:25 there is a demonstration of the desktop application calling an operation on the calculator API.

## Configure a JWT validation policy to pre-authorize requests

The final procedure in the video starts at 20:48 and shows you how to use the [Validate JWT](https://msdn.microsoft.com/library/azure/034febe3-465f-4840-9fc6-c448ef520b0f#ValidateJWT) policy to pre-authorize requests by validating the access tokens of each incoming request. If the request is not validated by the Validate JWT policy, the request is blocked by API Management and is not passed along to the backend.

    <validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
        <openid-config url="https://login.windows.net/DemoAPIM.onmicrosoft.com/.well-known/openid-configuration" />
        <required-claims>
            <claim name="aud">
                <value>https://DemoAPIM.NOTonmicrosoft.com/APIMAADDemo</value>
            </claim>
        </required-claims>
    </validate-jwt>

For another demonstration of configuring and using this policy, see [Cloud Cover Episode 177: More API Management Features](https://azure.microsoft.com/documentation/videos/episode-177-more-api-management-features-with-vlad-vinogradsky/) and fast-forward to 13:50. Fast forward to 15:00 to see the policies configured in the policy editor and then to 18:50 for a demonstration of calling an operation from the developer portal both with and without the required authorization token.

## Next steps
-	Check out more [videos](https://azure.microsoft.com/documentation/videos/index/?services=api-management) about API Management.
-	For other ways to secure your backend service, see [Mutual Certificate authentication](api-management-howto-mutual-certificates.md) and [Connect via VPN or ExpressRoute](api-management-howto-setup-vpn.md).

[api-management-management-console]: ./media/api-management-howto-protect-backend-with-aad/api-management-management-console.png

[api-management-import-api]: ./media/api-management-howto-protect-backend-with-aad/api-management-import-api.png
[api-management-import-new-api]: ./media/api-management-howto-protect-backend-with-aad/api-management-import-new-api.png
[api-management-create-aad-menu]: ./media/api-management-howto-protect-backend-with-aad/api-management-create-aad-menu.png
[api-management-create-aad]: ./media/api-management-howto-protect-backend-with-aad/api-management-create-aad.png
[api-management-new-web-app]: ./media/api-management-howto-protect-backend-with-aad/api-management-new-web-app.png
[api-management-new-project]: ./media/api-management-howto-protect-backend-with-aad/api-management-new-project.png
[api-management-new-project-cloud]: ./media/api-management-howto-protect-backend-with-aad/api-management-new-project-cloud.png
[api-management-change-authentication]: ./media/api-management-howto-protect-backend-with-aad/api-management-change-authentication.png
[api-management-sign-in-vidual-studio]: ./media/api-management-howto-protect-backend-with-aad/api-management-sign-in-vidual-studio.png
[api-management-configure-web-app]: ./media/api-management-howto-protect-backend-with-aad/api-management-configure-web-app.png
[api-management-aad-domains]: ./media/api-management-howto-protect-backend-with-aad/api-management-aad-domains.png
[api-management-add-controller]: ./media/api-management-howto-protect-backend-with-aad/api-management-add-controller.png
[api-management-web-publish]: ./media/api-management-howto-protect-backend-with-aad/api-management-web-publish.png
[api-management-aad-backend-app]: ./media/api-management-howto-protect-backend-with-aad/api-management-aad-backend-app.png
[api-management-aad-add-permissions]: ./media/api-management-howto-protect-backend-with-aad/api-management-aad-add-permissions.png
[api-management-developer-portal-menu]: ./media/api-management-howto-protect-backend-with-aad/api-management-developer-portal-menu.png
[api-management-dev-portal-apis]: ./media/api-management-howto-protect-backend-with-aad/api-management-dev-portal-apis.png
[api-management-dev-portal-try-it]: ./media/api-management-howto-protect-backend-with-aad/api-management-dev-portal-try-it.png
[api-management-dev-portal-send-401]: ./media/api-management-howto-protect-backend-with-aad/api-management-dev-portal-send-401.png
[api-management-aad-new-application-devportal]: ./media/api-management-howto-protect-backend-with-aad/api-management-aad-new-application-devportal.png
[api-management-aad-new-application-devportal-1]: ./media/api-management-howto-protect-backend-with-aad/api-management-aad-new-application-devportal-1.png
[api-management-aad-new-application-devportal-2]: ./media/api-management-howto-protect-backend-with-aad/api-management-aad-new-application-devportal-2.png
[api-management-aad-devportal-application]: ./media/api-management-howto-protect-backend-with-aad/api-management-aad-devportal-application.png
[api-management-add-authorization-server]: ./media/api-management-howto-protect-backend-with-aad/api-management-add-authorization-server.png
[api-management-aad-sso-uri]: ./media/api-management-howto-protect-backend-with-aad/api-management-aad-sso-uri.png
[api-management-aad-view-endpoints]: ./media/api-management-howto-protect-backend-with-aad/api-management-aad-view-endpoints.png
[api-management-aad-client-id]: ./media/api-management-howto-protect-backend-with-aad/api-management-aad-client-id.png
[api-management-add-authorization-server-1]: ./media/api-management-howto-protect-backend-with-aad/api-management-add-authorization-server-1.png
[api-management-add-authorization-server-2]: ./media/api-management-howto-protect-backend-with-aad/api-management-add-authorization-server-2.png
[api-management-add-authorization-server-2a]: ./media/api-management-howto-protect-backend-with-aad/api-management-add-authorization-server-2a.png
[api-management-add-authorization-server-3]: ./media/api-management-howto-protect-backend-with-aad/api-management-add-authorization-server-3.png
[api-management-aad-reply-url]: ./media/api-management-howto-protect-backend-with-aad/api-management-aad-reply-url.png
[api-management-add-devportal-permissions]: ./media/api-management-howto-protect-backend-with-aad/api-management-add-devportal-permissions.png
[api-management-aad-add-app-permissions]: ./media/api-management-howto-protect-backend-with-aad/api-management-aad-add-app-permissions.png
[api-management-aad-add-delegated-permissions]: ./media/api-management-howto-protect-backend-with-aad/api-management-aad-add-delegated-permissions.png
[api-management-calc-api]: ./media/api-management-howto-protect-backend-with-aad/api-management-calc-api.png
[api-management-enable-aad-calculator]: ./media/api-management-howto-protect-backend-with-aad/api-management-enable-aad-calculator.png
[api-management-devportal-authorization-code]: ./media/api-management-howto-protect-backend-with-aad/api-management-devportal-authorization-code.png
[api-management-devportal-response]: ./media/api-management-howto-protect-backend-with-aad/api-management-devportal-response.png
[api-management-calc-authorization-server]: ./media/api-management-howto-protect-backend-with-aad/api-management-calc-authorization-server.png
[api-management-add-authorization-server-1a]: ./media/api-management-howto-protect-backend-with-aad/api-management-add-authorization-server-1a.png
[api-management-client-credentials]: ./media/api-management-howto-protect-backend-with-aad/api-management-client-credentials.png
[api-management-new-aad-application-menu]: ./media/api-management-howto-protect-backend-with-aad/api-management-new-aad-application-menu.png

[Create an API Management service instance]: api-management-get-started.md#create-service-instance
[Manage your first API]: api-management-get-started.md
