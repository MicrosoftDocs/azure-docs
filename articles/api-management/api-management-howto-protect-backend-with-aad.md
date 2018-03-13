---
title: Protect a Web API backend with Azure Active Directory and API Management | Microsoft Docs
description: Learn how to protect a Web API backend with Azure Active Directory and API Management.
services: api-management
documentationcenter: ''
author: apimpm
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/30/2017
ms.author: apimpm
---

# How to protect a Web API backend with Azure Active Directory and API Management

This article shows how to build a Web API backend and protect it using OAuth 2.0 protocol with Azure Active Directory and API Management.  

## Create an Azure AD directory

To secure your Web API backend using Azure Active Directory, you must first have an AAD tenant. 

First, visit [Azure portal](https://portal.azure.com/#create/Microsoft.AzureActiveDirectory) to create a new Azure AD directory. Once you complete the process, you get your own Azure AD tenant with the domain name you chose during sign-up.  In the [Azure portal](https://portal.azure.com), you can find your tenant by navigating to **Azure Active Directory** in the left-hand nav.

For more information, see [Create a tenant](https://docs.microsoft.com/azure/active-directory/develop/active-directory-howto-tenant).

In this example, a directory named **APIMDemo** is created with a default domain named **DemoAPIM.onmicrosoft.com**. 

## Create a Web API service secured by Azure Active Directory

In this step, a Web API backend is created using Visual Studio. To create Web API backend project in Visual Studio click **File**->**New**->**Project**, and choose **ASP.NET Web Application** from the **Web** templates list. 

Click **Web API** from the **Select a template list** to create a Web API project. To configure Azure Directory Authentication, click **Change Authentication**.

Click **Organizational Accounts**, and specify the **Domain** of your AAD tenant. In this example,  the domain is **DemoAPIM.onmicrosoft.com**. The domain of your directory can be obtained from the **Domains** tab of your directory.

Configure the desired settings in the **Change Authentication** dialog box and click **OK**.

When you click **OK** Visual Studio will attempt to register your application with your Azure AD directory and you may be prompted to sign in by Visual Studio. Sign in using an administrative account for your directory.

To configure this project as an Azure Web API check the box for **Host in the cloud** and then click **OK**.

You may be prompted to sign in to Azure, and then you can configure the Web App.

In this example,  a new **App Service plan** named **APIMAADDemo** is specified.

Click **OK** to configure the Web App and create the project.

## Add the code to the Web API project

The Web API in this example,  implements a basic calculator service using a model and a controller. To add the model for the service, right-click **Models** in **Solution Explorer** and choose **Add**, **Class**. Name the class `CalcInput` and click **Add**.

Add the following `using` statement to the top of the `CalcInput.cs` file.

```csharp
using Newtonsoft.Json;
```

Replace the generated class with the following code:

```csharp
public class CalcInput
{
    [JsonProperty(PropertyName = "a")]
    public int a;

    [JsonProperty(PropertyName = "b")]
    public int b;
}
```

Right-click **Controllers** in **Solution Explorer** and choose **Add**->**Controller**. Choose **Web API 2 Controller - Empty** and click **Add**. Type **CalcController** for the Controller name and click **Add**.

Add the following `using` statement to the top of the `CalcController.cs` file.

```csharp
using System.IO;
using System.Web;
using APIMAADDemo.Models;
```

Replace the generated controller class with the following code: This code implements the `Add`, `Subtract`, `Multiply`, and `Divide` operations of the Basic Calculator API.

```csharp
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
```

Build the solution.

## Publish the project to Azure

To publish the project to Azure, right-click the **APIMAADDemo** project in Visual Studio and choose **Publish**. Keep the default settings in the **Publish Web** dialog box and click **Publish**.

## Grant permissions to the Azure AD backend service application

A new application for the backend service is created in your Azure AD directory as part of the configuring and publishing process of your Web API project.

Click the name of the application to configure the required permissions. Navigate to the **Configure** tab and scroll down to the **permissions to other applications** section. Click the **Application Permissions** drop-down beside **Windows** **Azure Active Directory**, check the box for **Read directory data**, and click **Save**.

> [!NOTE]
> If **Windows** **Azure Active Directory** is not listed under permissions to other applications, click **Add application** and add it from the list.
> 
> 

Make a note of the **App Id URI** for use in a subsequent step when an Azure AD application is configured for the API Management developer portal.

## Import the Web API into API Management

APIs are configured from the Azure portal. For more information, see [Create a new APIM instance](get-started-create-service-instance.md) and [Import APIs](import-and-publish.md).

Operations can be [added to APIs manually](api-management-howto-add-operations.md), or they can be imported.

Create a file named `calcapi.json` with following contents and save it to your computer. Ensure that the `host` attribute points to your Web API backend. In this example,  `"host": "apimaaddemo.azurewebsites.net"` is used.

```json
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
            "type": "string",
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
            "type": "string",
            "default": "49",
            "enum": [
              "49"
            ]
          }
        ],
        "responses": { }
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
            "type": "string",
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
            "type": "string",
            "default": "50",
            "enum": [
              "50"
            ]
          }
        ],
        "responses": { }
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
            "type": "string",
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
            "type": "string",
            "default": "20",
            "enum": [
              "20"
            ]
          }
        ],
        "responses": { }
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
            "type": "string",
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
            "type": "string",
            "default": "5",
            "enum": [
              "5"
            ]
          }
        ],
        "responses": { }
      }
    }
  }
}
```

To import the calculator API, click **APIs** from the **API Management** menu on the left, and then click **Import API**.

Perform the following steps to configure the calculator API.

1. Select **OpenAPI specification**.
2. Click **Select a file**, browse to the `calculator.json` file you saved.
2. Type **calc** into the **Web API URL suffix** textbox.
3. Click in the **Products (optional)** box and choose **Starter**.
4. Click **Save** to import the API.

Once the API is imported, the summary page for the API is displayed in the Azure portal.

## Call the API unsuccessfully from the developer portal

At this point, the API has been imported into API Management, but cannot yet be called successfully from the developer portal because the backend service is protected with Azure AD authentication. 

Click **Developer portal** from the top of the Azure portal.

Click **APIs** and click the **Calculator** API.

Click **Try it**.

Click **Send** and note the response status of **401 Unauthorized**.

The request is unauthorized because the backend API is protected by Azure Active Directory. Before successfully calling the API the developer portal must be configured to authorize developers using OAuth 2.0. This process is described in the following sections:

## Register the developer portal as an AAD application
The first step in configuring the developer portal to authorize developers using OAuth 2.0 is to register the developer portal as an AAD application. 

Navigate to the Azure AD tenant. In this example, select **APIMDemo** and navigate to the **Applications** tab.

Click the **Add** button to create a new Azure Active Directory application, and choose **Add an application my organization is developing**.

Choose **Web application and/or Web API**, enter a name, and click the next arrow. In this example,  **APIMDeveloperPortal** is used.

For Sign-on URL,** enter the URL of your API Management service and append `/signin`. In this example,  `https://contoso5.portal.azure-api.net/signin` is used.

For App Id URL,** enter the URL of your API Management service and append some unique characters. These can be any desired characters and In this example,  `https://contoso5.portal.azure-api.net/dp` is used. When the  desired **App properties** are configured, click the check mark to create the application.

## Configure an API Management OAuth 2.0 authorization server

The next step is to configure an OAuth 2.0 authorization server in API Management. 

Click **Security** from the API Management menu on the left, click **OAuth 2.0**, and then click **Add authorization** server.

Enter a name and an optional description in the **Name** and **Description** fields. These fields are used to identify the OAuth 2.0 authorization server within the API Management service instance. In this example,  **Authorization server demo** is used. Later when you specify an OAuth 2.0 server to be used for authentication for an API, you will select this name.

For the Client registration page URL,** enter a placeholder value such as `http://localhost`.  The **Client registration page URL** points to the page that users can use to create and configure their own accounts for OAuth 2.0 providers that support user management of accounts. In this example,  users do not create and configure their own accounts so a placeholder is used.

Next, specify **Authorization endpoint URL** and **Token endpoint URL**.

These values can be retrieved from the **App Endpoints** page of the AAD application you created for the developer portal. To access the endpoints, navigate to the **Configure** tab for the AAD application and click **View endpoints**.

Copy the **OAuth 2.0 authorization endpoint** and paste it into the **Authorization endpoint URL** textbox.

Copy the **OAuth 2.0 token endpoint** and paste it into the **Token endpoint URL** textbox.

In addition to pasting in the token endpoint, add an additional body parameter named **resource** and for the value use the **App Id URI** from the AAD application for the backend service that was created when the Visual Studio project was published.

Next, specify the client credentials. These are the credentials for the resource you want to access, in this case the developer portal.

To get the **Client Id**, navigate to the **Configure** tab of the AAD application for the developer portal and copy the **Client Id**.

To get the Client Secret,** click the **Select duration** drop-down in the **Keys** section and specify an interval. In this example, one year is used.

Click **Save** to save the configuration and display the key. 

> [!IMPORTANT]
> Make a note of this key. Once you close the Azure Active Directory configuration window, the key cannot be displayed again.
> 
> 

Copy the key to the clipboard, switch back to the Azure portal, paste the key into the **Client Secret** textbox, and click **Save**.

Immediately following the client credentials is an authorization code grant. Copy this authorization code and switch back to your Azure AD developer portal application configure page, and paste the authorization grant into the **Reply URL** field, and click **Save** again.

The next step is to configure the permissions for the developer portal AAD application. Click **Application Permissions** and check the box for **Read directory data**. Click **Save** to save this change, and then click **Add application**.

Click the search icon, type **APIM** into the Starting with box, select **APIMAADDemo**, and click the check mark to save.

Click **Delegated Permissions** for **APIMAADDemo** and check the box for **Access APIMAADDemo**, and click **Save**. This allows the developer portal application to access the backend service.

## Enable OAuth 2.0 user authorization for the Calculator API

Now that the OAuth 2.0 server is configured, you can specify it in the security settings for your API.

Click **APIs** in the left menu of API Management instance, and click **Calculator** to view and configure its settings.

Navigate to the **Security** tab, check the **OAuth 2.0** checkbox, select the desired authorization server from the **Authorization server** drop-down, and click **Save**.

## Successfully call the Calculator API from the developer portal

Now that the OAuth 2.0 authorization is configured on the API, its operations can be successfully called from the developer center. 

Navigate back to the **Add two integers** operation of the calculator service in the developer portal and click **Try it**. Note the new item in the **Authorization** section corresponding to the authorization server you just added.

Select **Authorization code** from the authorization drop-down list and enter the credentials of the account to use. If you are already signed in with the account, you may not be prompted.

Click **Send** and note the **Response status** of **200 OK** and the results of the operation in the response content.

## Configure a desktop application to call the API

Configure a simple desktop application to call the API. The first step is to register the desktop application in Azure AD and give it access to the directory and to the backend service. 

## Configure a JWT validation policy to pre-authorize requests

Use the [Validate JWT](api-management-access-restriction-policies.md#ValidateJWT) policy to pre-authorize requests by validating the access tokens of each incoming request. If the request is not validated by the Validate JWT policy, the request is blocked by API Management and is not passed along to the backend.

```xml
<validate-jwt header-name="Authorization" failed-validation-httpcode="401" failed-validation-error-message="Unauthorized. Access token is missing or invalid.">
    <openid-config url="https://login.microsoftonline.com/DemoAPIM.onmicrosoft.com/.well-known/openid-configuration" />
    <required-claims>
        <claim name="aud">
            <value>https://DemoAPIM.NOTonmicrosoft.com/APIMAADDemo</value>
        </claim>
    </required-claims>
</validate-jwt>
```

For more information, see [Cloud Cover Episode 177: More API Management Features](https://azure.microsoft.com/documentation/videos/episode-177-more-api-management-features-with-vlad-vinogradsky/) and fast-forward to 13:50. Fast forward to 15:00 to see the policies configured in the policy editor and then to 18:50 for a demonstration of calling an operation from the developer portal both with and without the required authorization token.

## Next steps
* Check out more [videos](https://azure.microsoft.com/documentation/videos/index/?services=api-management) about API Management.
* For other ways to secure your backend service, see [Mutual Certificate authentication](api-management-howto-mutual-certificates.md).

[Create an API Management service instance]: get-started-create-service-instance.md
[Manage your first API]: import-and-publish.md
