---
title: Use AAD authentication to access Azure Media Services API with REST | Microsoft Docs
description: This topic shows how to access Azure Media Services API with AAD authentication using REST.
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

# Use AAD authentication to access Azure Media Services API with REST

## Introduction

Azure Media Services team has released Azure AD authentication support for Azure Media Services access and has also announced the plan to deprecate ACS authentication for Azure Media Services access. Since every Azure subscription hence Azure Media Services account is attached to an Azure AD tenant, this authentication support brings lots of security benefits. For details of this change and migration (if you use Azure Media Services .NET SDK for your app), please see the following blog and documents:

- [Azure Media Services announces support for AAD and deprecation of ACS authentication](https://azure.microsoft.com/blog/azure%20media%20service%20aad%20auth%20and%20acs%20deprecation)
- [Accessing Azure Media Services API with AAD authentication overview](media-services-use-aad-auth-to-access-ams-api.md)
- [Use AAD authentication to access Azure Media Services API with .NET](media-services-dotnet-get-started-with-aad.md)
- [Getting started with AAD authentication using the Azure portal](media-services-portal-get-started-with-aad.md)

Some customers need to develop their Azure Media Services solutions under the following constraints:

1.	A programming language different from .NET/C# is used or the runtime environment is not even Windows;
2.	Azure AD libraries such as ADAL is not available for the chosen programming language or can not be used for their runtime environment.

Some customers have developed applications using REST API for both ACS authentication and Azure Media Services access. For these customers, we need a way to use only REST API for Azure AD authentication and subsequent Azure Media Services access, without relying on any of Azure AD libraries or Azure Media Services .NET SDK. This document presents such a solution and sample code. Since the code is all REST API calls without dependency on any Azure AD or Azure Media Services library, the code can be easily translated to any other programming languages.

## Design

We use the following authentication/authorization design:

1.  Authorization Protocol: OAuth 2.0. OAuth 2.0 is a web security standard covering both authentication and authorization. It is supported by Google, Microsoft, Facebook and PayPal, and ratified in 10/2012. Microsoft is firmly behind supporting OAuth 2.0 and OpenID Connect. Both of these standards are supported in a number of services and client libraries including Azure Active Directory, OWIN Katana, and Azure AD libraries.
2.  Grant Type: Client Credentials grant type. Client Credentials is one of the four grant types in OAuth 2.0. It is also often used for Azure AD Graph API access.
3.  Authentication mode: Service Principal. The other authentication mode is user/interactive authentication.

There are total of 4 applications/services involved in the AAD authentication and authorization flow for using Azure Media Services. These applications/services and the flow is described in the following table.

|Application Type |Application |Flow|
|---|---|---|
|Client | Customer app/solution | This app (actually its proxy) is registered in the AAD tenant under which the Azure subscription and the media service account reside. The service principal of the registered app is then granted with Owner or Contributor role in the Access Control (IAM) of the media service account. The service principal is represented by the app client ID and client secret. |
|Identity Provider (IDP) | Azure AD as IDP | The registered app service principal (client ID/client secret) is authenticated by Azure AD as the IDP. This authentication is performed internally and implicitly. As in Client Credentials Flow, what is authenticated is the client application instead of user. |
|Secure Token Service (STS)/OAuth Server | Azure AD as STS | Upon authentication by IDP (or OAuth Server in OAuth 2.0 term), an access_token (JWT) is issued by Azure AD as STS/OAuth Server for access to the mid-tier resource: in our case, AMS REST API endpoint. |
|Resource | Azure Media Services REST API | Every AMS REST API call is authorized by an access_token issued by Azure AD as STS/Auth Server. |

If you run the sample code and capture a JWT token/access_token, the JWT token contains the following attributes:

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

Here are the mappings between the attributes in the JWT token and the 4 applications/services in the above table:

|Application Type |Application |JWT Attribute |
|---|---|---|
|Client |Customer app/solution |appid: "02ed1e8e-af8b-477e-af3d-7e7219a99ac6" The client ID of an application you will register to AAD in the next section. |
|Identity Provider (IDP) | Azure AD as IDP |idp: "https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/"  The GUID is the ID of Microsoft tenant (microsoft.onmicrosoft.com). Each tenant has its own unique ID. |
|Secure Token Service (STS)/OAuth Server |Azure AD as STS |  iss: "https://sts.windows.net/72f988bf-86f1-41af-91ab-2d7cd011db47/" The GUID is the ID of Microsoft tenant (microsoft.onmicrosoft.com). |
|Resource | Azure Media Services REST API |aud: "https://rest.media.azure.net"  The recipient/audience of access_token. |

## Steps for Setup

Follow the following steps to register and configure an Azure AD application for AAD authentication and obtaining access token for calling Azure Media Services REST API endpoint.

1.	In the [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885), register an Azure AD application (for example, wzmediaservice) to the Azure AD tenant (for example, microsoft.onmicrosoft.com). It does not matter whether you registered as web app or native app. Also, you can choose any sign-on URL and reply URL (for example, http://wzmediaservice.com for both).
2. In the [Azure classic portal](http://go.microsoft.com/fwlink/?LinkID=213885), navigate to the **Configure** tab of your application and take a note of **client ID** and also generate a **client key** (client secret) under Keys section. 

	>[!NOTE] You need to take a note of the client secret since it will not be shown again.
	
3.	Go to the [Azure](http://ms.portal.azure.com) portal and navigate to the Media Services account -> Access Control (IAM) pane. Add a new member with either Owner or Contributor role. For the principal, you should search for the application name you registered in Step 1 (in the case of this example, wzmediaservice).

## Info to Collect

To prepare REST coding, we need to collect the following data points to be included in the code.

1.	Azure AD as an STS (Secure Token Service) endpoint: https://login.microsoftonline.com/microsoft.onmicrosoft.com/oauth2/token. From this endpoint, an access_token (JWT) is requested. In addition to serving as an Identity Provider, Azure AD also serves as an STS (Secure Token Service) issuing JWT token for resource access (access_token). A JWT token contains various claims.
2.	Azure Media Services REST API as resource or audience: https://rest.media.azure.net.
3.	Client ID: see step 2 in Steps for Setup
4.	Client secret: see step 2 in Steps for Setup
5.	Your media service account REST API endpoint in the following format:

	https://[media_service_account_name].restv2.[data_center].media.azure.net/API. 

	This is the endpoint against which all Azure Media Services REST API calls are made in your application. For example, https://willzhanmswjapan.restv2.japanwest.media.azure.net/API.

You can then put these 5 parameters in your web.config or app.config to be used by your code.

## Sample Code

You can find the sample code in [Azure Media Services sample repo](https://azure.microsoft.com/resources/samples/?service=media-services)

The sample code has 2 parts:

1.	A DLL library project containing all the REST API code for Azure AD authentication/authorization. It also contains a method for making REST API calls to Azure Media Services REST API endpoint, with access_token.
2.	A console test client, which initiates Azure AD authentication and calls different AMS REST API.

The sample project demonstrates/contains three features:

1.	Azure AD authentication via Client Credentials grant through only REST API;
2.	Azure Media Services access through only REST API;
3.	Azure Storage access through only REST API (as used for creating a media service account, again via REST API).


## Where is the Refresh Token?

Some readers might ask: Where is the refresh token? Why is refresh token not used?

The purpose of a refresh token is not for refreshing any access token. Instead it is designed to bypass end-user authentication/user intervention and still get a valid access token when the previous token expires. In other words, a better name of refresh token should be something like "bypass user re-login token".

If you are using OAuth 2.0 authorization (username/password) grant flow, i.e. acting on behalf of a user, a refresh token helps you get a renewed access token without asking user intervention. However, for OAuth 2.0 client credentials grant flow as we are using, the client is acting on its own behalf, and you don't need user intervention at all, and the authorization server doesn't need to (and won't) give you a refresh token either. If you debug the GetUrlEncodedJWT method, you notice that the response from token endpoint contains an access token, but no refresh token.

## Next steps

Get started with [uploading files to your account](media-services-dotnet-upload-files.md)