---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure Media Services v3 frequently asked questions| Microsoft Docs
description: This article gives answers to Azure Media Services v3 frequently asked questions.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 06/21/2019
ms.author: juliako
---

# Media Services v3 frequently asked questions

This article gives answers to Azure Media Services (AMS) v3 frequently asked questions.

## General

### What Azure roles can perform actions on Azure Media Services resources? 

See [Role-based access control (RBAC) for Media Services accounts](rbac-overview.md).

### How do I configure Media Reserved Units?

For the Audio Analysis and Video Analysis Jobs that are triggered by Media Services v3 or Video Indexer, it is highly recommended to provision your account with 10 S3 MRUs. If you need more than 10 S3 MRUs, open a support ticket using the [Azure portal](https://portal.azure.com/).

For details, see [Scale media processing with CLI](media-reserved-units-cli-how-to.md).

### What is the recommended method to process videos?

Use [Transforms](https://docs.microsoft.com/rest/api/media/transforms) to configure common tasks for encoding or analyzing videos. Each **Transform** describes a recipe, or a workflow of tasks for processing your video or audio files. A [Job](https://docs.microsoft.com/rest/api/media/jobs) is the actual request to Media Services to apply the **Transform** to a given input video or audio content. Once the Transform has been created, you can submit jobs using Media Services APIs, or any of the published SDKs. For more information, see [Transforms and Jobs](transforms-jobs-concept.md).

### How does pagination work?

When using pagination, you should always use the next link to enumerate the collection and not depend on a particular page size. For details and examples, see [Filtering, ordering, paging](entities-overview.md).

### What features are not yet available in Azure Media Services v3?

For details, see [feature gaps with respect to v2 APIs](migrate-from-v2-to-v3.md#feature-gaps-with-respect-to-v2-apis).

### What is the process of moving a Media Services account between subscriptions?  

For details, see [Moving a Media Services account between subscriptions](media-services-account-concept.md).

## Live streaming 

###  How to insert breaks/videos and image slates during live stream?

Media Services v3 live encoding does not yet support inserting video or image slates during live stream. 

You can use a [live on-premises encoder](recommended-on-premises-live-encoders.md) to switch the source video. Many apps provide ability to switch sources, including Telestream Wirecast, Switcher Studio (on iOS), OBS Studio (free app), and many more.

## Content protection

### Should I use a AES-128 clear key encryption or a DRM system?

Customers often wonder whether they should use AES encryption or a DRM system. The primary difference between the two systems is that with AES encryption the content key is transmitted to the client over TLS so that the key is encrypted in transit but without any additional encryption ("in the clear"). As a result, the key used to decrypt the content is accessible to the client player and can be viewed in a network trace on the client in plain text. AES-128 clear key encryption is suitable for use cases where the viewer is a trusted party (for example, encrypting corporate videos distributed within a company to be viewed by employees).

DRM systems like PlayReady, Widevine, and FairPlay all provide an additional level of encryption on the key used to decrypt the content compared to AES-128 clear key. The content key is encrypted to a key protected by the DRM runtime in additional to any transport level encryption provided by TLS. Additionally, decryption is handled in a secure environment at the operating system level, where it's more difficult for a malicious user to attack. DRM is recommended for use cases where the viewer might not be a trusted party and you require the highest level of security.

### How and where to get JWT token before using it to request license or key?

1. For production, you need to have a Secure Token Services (STS) (web service) which issues JWT token upon a HTTPS request. For test, you could use the code shown in **GetTokenAsync** method defined in [Program.cs](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithDRM/Program.cs).
2. Player will need to make a request, after a user is authenticated, to the STS for such a token and assign it as the value of the token. You can use the [Azure Media Player API](https://amp.azure.net/libs/amp/latest/docs/).

* For an example of running STS, with either symmetric and asymmetric key, please see [https://aka.ms/jwt](https://aka.ms/jwt). 
* For an example of a player based on Azure Media Player using such JWT token, see [https://aka.ms/amtest](https://aka.ms/amtest) (expand "player_settings" link to see the token input).

### How do you authorize requests to stream videos with AES encryption?

The correct approach is to leverage STS (Secure Token Service):

In STS, depending on user profile, add different claims (such as "Premium User", "Basic User", "Free Trial User"). With different claims in a JWT, the user can see different contents. Of course, for different content/asset, the ContentKeyPolicyRestriction will have the corresponding RequiredClaims.

Use Azure Media Services APIs for configuring license/key delivery and encrypting your assets (as shown in [this sample](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithAES/Program.cs)).

For more information, see:

- [Content protection overview](content-protection-overview.md)
- [Design of a multi-DRM content protection system with access control](design-multi-drm-system-with-access-control.md)

### HTTP or HTTPS?
The ASP.NET MVC player application must support the following:

* User authentication through Azure AD, which is under HTTPS.
* JWT exchange between the client and Azure AD, which is under HTTPS.
* DRM license acquisition by the client, which must be under HTTPS if license delivery is provided by Media Services. The PlayReady product suite doesn't mandate HTTPS for license delivery. If your PlayReady license server is outside Media Services, you can use either HTTP or HTTPS.

The ASP.NET player application uses HTTPS as a best practice, so Media Player is on a page under HTTPS. However, HTTP is preferred for streaming, so you need to consider the issue of mixed content.

* The browser doesn't allow mixed content. But plug-ins like Silverlight and the OSMF plug-in for smooth and DASH do allow it. Mixed content is a security concern because of the threat of the ability to inject malicious JavaScript, which can cause customer data to be at risk. Browsers block this capability by default. The only way to work around it is on the server (origin) side by allowing all domains (regardless of HTTPS or HTTP). This is probably not a good idea either.
* Avoid mixed content. Both the player application and Media Player should use HTTP or HTTPS. When playing mixed content, the silverlightSS tech requires clearing a mixed-content warning. The flashSS tech handles mixed content without a mixed-content warning.
* If your streaming endpoint was created before August 2014, it won't support HTTPS. In this case, create and use a new streaming endpoint for HTTPS.

In the reference implementation for DRM-protected contents, both the application and streaming are under HTTPS. For open contents, the player doesn't need authentication or a license, so you can use either HTTP or HTTPS.

### What is Azure Active Directory signing key rollover?
Signing key rollover is an important point to take into consideration in your implementation. If you ignore it, the finished system eventually stops working completely, within six weeks at the most.

Azure AD uses industry standards to establish trust between itself and applications that use Azure AD. Specifically, Azure AD uses a signing key that consists of a public and private key pair. When Azure AD creates a security token that contains information about the user, it's signed by Azure AD with a private key before it's sent back to the application. To verify that the token is valid and originated from Azure AD, the application must validate the token's signature. The application uses the public key exposed by Azure AD that is contained in the tenant's federation metadata document. This public key, and the signing key from which it derives, is the same one used for all tenants in Azure AD.

For more information on Azure AD key rollover, see [Important information about signing key rollover in Azure AD](../../active-directory/active-directory-signing-key-rollover.md).

Between the [public-private key pair](https://login.microsoftonline.com/common/discovery/keys/):

* The private key is used by Azure AD to generate a JWT.
* The public key is used by an application such as DRM license delivery services in Media Services to verify the JWT.

For security purposes, Azure AD rotates the certificate periodically (every six weeks). In the case of security breaches, the key rollover can occur any time. Therefore, the license delivery services in Media Services need to update the public key used as Azure AD rotates the key pair. Otherwise, token authentication in Media Services fails and no license is issued.

To set up this service, you set TokenRestrictionTemplate.OpenIdConnectDiscoveryDocument when you configure DRM license delivery services.

Here's the JWT flow:

* Azure AD issues the JWT with the current private key for an authenticated user.
* When a player sees a CENC with multi-DRM protected content, it first locates the JWT issued by Azure AD.
* The player sends a license acquisition request with the JWT to license delivery services in Media Services.
* The license delivery services in Media Services use the current/valid public key from Azure AD to verify the JWT before issuing licenses.

DRM license delivery services always check for the current/valid public key from Azure AD. The public key presented by Azure AD is the key used to verify a JWT issued by Azure AD.

What if the key rollover happens after Azure AD generates a JWT but before the JWT is sent by players to DRM license delivery services in Media Services for verification?

Because a key can be rolled over at any moment, more than one valid public key is always available in the federation metadata document. Media Services license delivery can use any of the keys specified in the document. Because one key might be rolled soon, another might be its replacement, and so forth.

### Where is the access token?
If you look at how a web app calls an API app under [Application identity with OAuth 2.0 client credentials grant](../../active-directory/develop/web-api.md), the authentication flow is as follows:

* A user signs in to Azure AD in the web application. For more information, see [Web browser to web application](../../active-directory/develop/web-app.md).
* The Azure AD authorization endpoint redirects the user agent back to the client application with an authorization code. The user agent returns the authorization code to the client application's redirect URI.
* The web application needs to acquire an access token so that it can authenticate to the web API and retrieve the desired resource. It makes a request to the Azure AD token endpoint and provides the credential, client ID, and web API's application ID URI. It presents the authorization code to prove that the user consented.
* Azure AD authenticates the application and returns a JWT access token that's used to call the web API.
* Over HTTPS, the web application uses the returned JWT access token to add the JWT string with a "Bearer" designation in the "Authorization" header of the request to the web API. The web API then validates the JWT. If validation is successful, it returns the desired resource.

In this application identity flow, the web API trusts that the web application authenticated the user. For this reason, this pattern is called a trusted subsystem. The [authorization flow diagram](https://docs.microsoft.com/azure/active-directory/active-directory-protocols-oauth-code) describes how authorization-code-grant flow works.

License acquisition with token restriction follows the same trusted subsystem pattern. The license delivery service in Media Services is the web API resource, or the "back-end resource" that a web application needs to access. So where is the access token?

The access token is obtained from Azure AD. After successful user authentication, an authorization code is returned. The authorization code is then used, together with the client ID and the app key, to exchange for the access token. The access token is used to access a "pointer" application that points to or represents the Media Services license delivery service.

To register and configure the pointer app in Azure AD, take the following steps:

1. In the Azure AD tenant:

   * Add an application (resource) with the sign-on URL https://[resource_name].azurewebsites.net/. 
   * Add an app ID with the URL https://[aad_tenant_name].onmicrosoft.com/[resource_name].

2. Add a new key for the resource app.

3. Update the app manifest file so that the groupMembershipClaims property has the value "groupMembershipClaims": "All".

4. In the Azure AD app that points to the player web app, in the section **Permissions to other applications**, add the resource app that was added in step 1. Under **Delegated permission**, select **Access [resource_name]**. This option gives the web app permission to create access tokens that access the resource app. Do this for both the local and deployed version of the web app if you develop with Visual Studio and the Azure web app.

The JWT issued by Azure AD is the access token used to access the pointer resource.

### What about live streaming?
The previous discussion focused on on-demand assets. What about live streaming?

You can use exactly the same design and implementation to protect live streaming in Media Services by treating the asset associated with a program as a VOD asset.

Specifically, to do live streaming in Media Services, you need to create a channel and then create a program under the channel. To create the program, you need to create an asset that contains the live archive for the program. To provide CENC with multi-DRM protection of the live content, apply the same setup/processing to the asset as if it were a VOD asset before you start the program.

### What about license servers outside Media Services?

Often, customers invested in a license server farm either in their own data center or one hosted by DRM service providers. With Media Services content protection, you can operate in hybrid mode. Contents can be hosted and dynamically protected in Media Services, while DRM licenses are delivered by servers outside Media Services. In this case, consider the following changes:

* STS needs to issue tokens that are acceptable and can be verified by the license server farm. For example, the Widevine license servers provided by Axinom require a specific JWT that contains an entitlement message. Therefore, you need to have an STS to issue such a JWT. 
* You no longer need to configure license delivery service in Media Services. You need to provide the license acquisition URLs (for PlayReady, Widevine, and FairPlay) when you configure ContentKeyPolicies.

### What if I want to use a custom STS?
A customer might choose to use a custom STS to provide JWTs. Reasons include:

* The IDP used by the customer doesn't support STS. In this case, a custom STS might be an option.
* The customer might need more flexible or tighter control to integrate STS with the customer's subscriber billing system. For example, an MVPD operator might offer multiple OTT subscriber packages, such as premium, basic, and sports. The operator might want to match the claims in a token with a subscriber's package so that only the contents in a specific package are made available. In this case, a custom STS provides the needed flexibility and control.

When you use a custom STS, two changes must be made:

* When you configure license delivery service for an asset, you need to specify the security key used for verification by the custom STS instead of the current key from Azure AD. (More details follow.) 
* When a JTW token is generated, a security key is specified instead of the private key of the current X509 certificate in Azure AD.

There are two types of security keys:

* Symmetric key: The same key is used to generate and to verify a JWT.
* Asymmetric key: A public-private key pair in an X509 certificate is used with a private key to encrypt/generate a JWT and with the public key to verify the token.

> [!NOTE]
> If you use .NET Framework/C# as your development platform, the X509 certificate used for an asymmetric security key must have a key length of at least 2048. This is a requirement of the class System.IdentityModel.Tokens.X509AsymmetricSecurityKey in .NET Framework. Otherwise, the following exception is thrown:
> 
> IDX10630: The 'System.IdentityModel.Tokens.X509AsymmetricSecurityKey' for signing cannot be smaller than '2048' bits.

## Media Services v2 vs v3 

### Can I use the Azure portal to manage v3 resources?

Currently, you cannot use the Azure portal to manage v3 resources. Use the [REST API](https://aka.ms/ams-v3-rest-ref), [CLI](https://aka.ms/ams-v3-cli-ref), or one of the supported [SDKs](media-services-apis-overview.md#sdks).

### Is there an AssetFile concept in v3?

The AssetFiles were removed from the AMS API in order to separate Media Services from Storage SDK dependency. Now Storage, not Media Services, keeps the information that belongs in Storage. 

For more information, see [Migrate to Media Services v3](migrate-from-v2-to-v3.md).

### Where did client-side storage encryption go?

It is now recommended to use the server-side storage encryption (which is on by default). For more information, see [Azure Storage Service Encryption for Data at Rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption).

## Next steps

[Media Services v3 overview](media-services-overview.md)
