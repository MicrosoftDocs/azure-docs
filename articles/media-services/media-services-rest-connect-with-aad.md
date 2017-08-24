---
title: Use Azure AD authentication to access Azure Media Services API with REST | Microsoft Docs
description: Learn how to access Azure Media Services API with Azure Active Directory authentication by using REST.
services: media-services
documentationcenter: ''
author: willzhan
manager: erikre
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/17/2017
ms.author: willzhan;juliako

---

# Use Azure AD authentication to access the Azure Media Services API with REST

The Azure Media Services team has released Azure Active Directory (Azure AD) authentication support for Azure Media Services access. It also announced plans to deprecate Azure Access Control service authentication for Media Services access. Because every Azure subscription, and every Media Services account, is attached to an Azure AD tenant, Azure AD authentication support brings many security benefits. For details about this change and migration (if you use the Media Services .NET SDK for your app), see the following blog posts and articles:

- [Azure Media Services announces support for Azure AD and deprecation of Access Control authentication](https://azure.microsoft.com/blog/azure%20media%20service%20aad%20auth%20and%20acs%20deprecation)
- [Access Azure Media Services API by using Azure AD authentication](media-services-use-aad-auth-to-access-ams-api.md)
- [Use Azure AD authentication to access Azure Media Services API by using Microsoft .NET](media-services-dotnet-get-started-with-aad.md)
- [Getting started with Azure AD authentication by using the Azure portal](media-services-portal-get-started-with-aad.md)

Some customers need to develop their Media Services solutions under the following constraints:

*	They use a programming language that is not Microsoft .NET or C#, or the runtime environment is not Windows.
*	Azure AD libraries such as Active Directory Authentication Libraries are not available for the programming language or can't be used for their runtime environment.

Some customers have developed applications by using REST API for both Access Control authentication and Azure Media Services access. For these customers, you need a way to use only the REST API for Azure AD authentication and subsequent Azure Media Services access. You need to not rely on any of the Azure AD libraries or on the Media Services .NET SDK. In this article, we describe a solution and provide sample code for this scenario. Because the code is all REST API calls, with no dependency on any Azure AD or Azure Media Services library, the code can easily be translated to any other programming language.

> [!IMPORTANT]
> Currently, Media Services supports the Azure Access Control services authentication model. However, Access Control authentication will be deprecated June 1, 2018. We recommend that you migrate to the Azure AD authentication model as soon as possible.


## Design

In this article, we use the following authentication and authorization design:

*  Authorization protocol: OAuth 2.0. OAuth 2.0 is a web security standard that covers both authentication and authorization. It is supported by Google, Microsoft, Facebook, and PayPal. It was ratified October 2012. Microsoft firmly supports OAuth 2.0 and OpenID Connect. Both of these standards are supported in multiple services and client libraries, including Azure Active Directory, Open Web Interface for .NET (OWIN) Katana, and Azure AD libraries.
*  Grant type: Client credentials grant type. Client credentials is one of the four grant types in OAuth 2.0. It's often used for Azure AD Microsoft Graph API access.
*  Authentication mode: Service principal. The other authentication mode is user or interactive authentication.

A total of four applications or services are involved in the Azure AD authentication and authorization flow for using Media Services. The applications and services, and the flow, are described in the following table:

|Application type |Application |Flow|
|---|---|---|
|Client | Customer app or solution | This app (actually, its proxy) is registered in the Azure AD tenant in which the Azure subscription and the media service account reside. The service principal of the registered app is then granted with Owner or Contributor role in the Access Control (IAM) of the media service account. The service principal is represented by the app client ID and client secret. |
|Identity Provider (IDP) | Azure AD as IDP | The registered app service principal (client ID and client secret) is authenticated by Azure AD as the IDP. This authentication is performed internally and implicitly. As in client credentials flow, the client is authenticated instead of the user. |
|Secure Token Service (STS)/OAuth server | Azure AD as STS | After authentication by the IDP (or OAuth Server in OAuth 2.0 terms), an access token or JSON Web Token (JWT) is issued by Azure AD as STS/OAuth Server for access to the middle-tier resource: in our case, the Media Services REST API endpoint. |
|Resource | Media Services REST API | Every Media Services REST API call is authorized by an access token that is issued by Azure AD as STS or the OAuth server. |

If you run the sample code and capture a JWT or an access token, the JWT has the following attributes:

    aud: "https://rest.media.azure.net",

    iss: "https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/",

    iat: 1497146280,

    nbf: 1497146280,
    exp: 1497150180,

    aio: "Y2ZgYDjuy7SptPzO/muf+uRu1B+ZDQA=",

    appid: "02ed1e8e-af8b-477e-af3d-7e7219a99ac6",

    appidacr: "1",

    idp: "https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/",

    oid: "a938cfcc-d3de-479c-b0dd-d4ffe6f50f7c",

    sub: "a938cfcc-d3de-479c-b0dd-d4ffe6f50f7c",

    tid: "72f988bf-86f1-41af-91ab-2d7cd011db47",

Here are the mappings between the attributes in the JWT and the four applications or services in the preceding table:

|Application type |Application |JWT attribute |
|---|---|---|
|Client |Customer app or solution |appid: "02ed1e8e-af8b-477e-af3d-7e7219a99ac6". The client ID of an application you will register to Azure AD in the next section. |
|Identity Provider (IDP) | Azure AD as IDP |idp: "https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/".  The GUID is the ID of Microsoft tenant (microsoft.onmicrosoft.com). Each tenant has its own, unique ID. |
|Secure Token Service (STS)/OAuth server |Azure AD as STS | iss: "https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/". The GUID is the ID of Microsoft tenant (microsoft.onmicrosoft.com). |
|Resource | Media Services REST API |aud: "https://rest.media.azure.net". The recipient or audience of the access token. |

## Steps for setup

To register and set up an Azure AD application for Azure AD authentication, and to obtain an access token for calling the Azure Media Services REST API endpoint, complete the following steps:

1.	In the [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885), register an Azure AD application (for example, wzmediaservice) to the Azure AD tenant (for example, microsoft.onmicrosoft.com). It doesn't matter whether you registered as web app or native app. Also, you can choose any sign-on URL and reply URL (for example, http://wzmediaservice.com for both).
2. In the [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885), go to the **Configure** tab of your application. Note the **client ID**. Then, under **Keys**, generate a **client key** (client secret). 

	> [!NOTE] 
	> Take note of the client secret. It won't be shown again.
	
3.	In the [Azure portal](http://ms.portal.azure.com), go to the Media Services account. Select the **Access Control** (IAM) pane. Add a new member that has either the Owner or the Contributor role. For the principal, search for the application name you registered in step 1 (in this example, wzmediaservice).

## Info to collect

To prepare REST coding, collect the following data points to include in the code:

*	Azure AD as an STS endpoint: https://login.microsoftonline.com/microsoft.onmicrosoft.com/oauth2/token. From this endpoint, a JWT access token is requested. In addition to serving as an IDP, Azure AD also serves as an STS. Azure AD issues a JWT for resource access (an access token). A JWT token has various claims.
*	Azure Media Services REST API as resource or audience: https://rest.media.azure.net.
*	Client ID: See step 2 in [Steps for setup](#steps-for-setup).
*	Client secret: See step 2 in  [Steps for setup](#steps-for-setup).
*	Your Media Services account REST API endpoint in the following format:

	https://[media_service_account_name].restv2.[data_center].media.azure.net/API 

	This is the endpoint against which all Media Services REST API calls in your application are made. For example, https://willzhanmswjapan.restv2.japanwest.media.azure.net/API.

You can then put these five parameters in your web.config or app.config file, to use in your code.

## Sample code

You can find the sample code in [Azure AD Authentication for Azure Media Services Access: Both via REST API](https://github.com/willzhan/WAMSRESTSoln).

The sample code has two parts:

*	A DLL library project that has all the REST API code for Azure AD authentication and authorization. It also has a method for making REST API calls to the Media Services REST API endpoint, with the access token.
*	A console test client, which initiates Azure AD authentication and calls different Media Services REST API.

The sample project has three features:

*	Azure AD authentications via the client credentials grant by using only the REST API.
*	Azure Media Services access by using only the REST API.
*	Azure Storage access by using only the REST API (as used to create a Media Services account, by using REST API).


## Where is the refresh token?

Some readers might ask: Where is the refresh token? Why not use a refresh token here?

The purpose of a refresh token is not to refresh an access token. Instead, it is designed to bypass end-user authentication or user intervention and still get a valid access token when an earlier token expires. A better name for a refresh token might be something like "bypass user re-sign-in token."

If you use the OAuth 2.0 authorization grant flow (username and password, acting on behalf of a user), a refresh token helps you get a renewed access token without requesting user intervention. However, for the OAuth 2.0 client credentials grant flow that we describe in this article, the client acts on its own behalf. You don't need user intervention at all, and the authorization server doesn't need to (and won't) give you a refresh token. If you debug the **GetUrlEncodedJWT** method, you notice that the response from the token endpoint has an access token, but no refresh token.

## Next steps

Get started with [uploading files to your account](media-services-dotnet-upload-files.md).
