<properties 
	pageTitle="Configure Content Key Authorization Policy using Portal" 
	description="Learn how to configure an authorization policy for a content key." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
 	ms.date="06/22/2016" 
	ms.author="juliako"/>



#Configure Content Key Authorization Policy 
[AZURE.INCLUDE [media-services-selector-content-key-auth-policy](../../includes/media-services-selector-content-key-auth-policy.md)]


##Overview

Microsoft Azure Media Services enables you to deliver MPEG-DASH, Smooth Streaming, and HTTP-Live-Streaming (HLS) streams protected with Advanced Encryption Standard (AES) (using 128-bit encryption keys) or [Microsoft PlayReady DRM](https://www.microsoft.com/playready/overview/). AMS also enables you to deliver DASH streams encrypted with Widevine DRM. Both PlayReady and Widevine are encrypted per the Common Encryption (ISO/IEC 23001-7 CENC) specification. 

Media Services also provides a **Key/License Delivery Service** from which clients can obtain AES keys or PlayReady/Widevine licenses to play the encrypted content. 

This topic shows how to use the **Azure Classic Portal** to configure the content key authorization policy. The key can later be used to dynamically encrypt your content. Note that currently you can encrypt the following streaming formats: HLS, MPEG DASH, and Smooth Streaming. You cannot encrypt HDS streaming format, or progressive downloads.
 
When a player requests a stream that is set to be dynamically encrypted, Media Services uses the configured key to dynamically encrypt your content using AES or DRM encryption. To decrypt the stream, the player will request the key from the key delivery service. To decide whether or not the user is authorized to get the key, the service evaluates the authorization policies that you specified for the key.


If you plan to have multiple content keys or want to specify a **Key/License Delivery Service** URL other than the Media Services key delivery service, use Media Services .NET SDK or REST APIs.

[Configure Content Key Authorization Policy using Media Services .NET SDK](media-services-dotnet-configure-content-key-auth-policy.md)

[Configure Content Key Authorization Policy using Media Services REST API](media-services-rest-configure-content-key-auth-policy.md)

###Some considerations apply:

- To be able to use dynamic packaging and dynamic encryption, you must make sure to have at least one streaming reserved unit. For more information, see [How to Scale a Media Service](media-services-manage-origins.md#scale_streaming_endpoints). 
- Your asset must contain a set of adaptive bitrate MP4s or adaptive bitrate Smooth Streaming files. For more information, see [Encode an asset](media-services-encode-asset.md).  
- The Key Delivery service caches ContentKeyAuthorizationPolicy and its related objects (policy options and restrictions) for 15 minutes.  If you create a ContentKeyAuthorizationPolicy and specify to use a “Token” restriction, then test it, and then update the policy to “Open” restriction, it will take roughly 15 minutes before the policy switches to the “Open” version of the policy.


##How to: configure the key authorization policy

To configure the key authorization policy, select the **CONTENT PROTECTION** page.
	
Media Services supports multiple ways of authenticating users who make key requests. The content key authorization policy can have **open**, **token**, or **IP** authorization restrictions (**IP** can be configured with REST or .NET SDK). 

###Open restriction

The **open** restriction means the system will deliver the key to anyone who makes a key request. This restriction might be useful for testing purposes.

![OpenPolicy][open_policy]

###Token restriction

To choose the token restricted policy, press the **TOKEN** button.

The **token** restricted policy must be accompanied by a token issued by a **Secure Token Service** (STS). Media Services supports tokens in the **Simple Web Tokens** ([SWT](https://msdn.microsoft.com/library/gg185950.aspx#BKMK_2)) format and **JSON Web Token** (JWT) format. For information, see [JWT token authentication](http://www.gtrifonov.com/2015/01/03/jwt-token-authentication-in-azure-media-services-and-dynamic-encryption/).

Media Services does not provide **Secure Token Services**. You can create a custom STS or leverage Microsoft Azure ACS to issue tokens. The STS must be configured to create a token signed with the specified key and issue claims that you specified in the token restriction configuration. The Media Services key delivery service will return the encryption key to the client if the token is valid and the claims in the token match those configured for the content key. For more information, see [Use Azure ACS to issue tokens](http://mingfeiy.com/acs-with-key-services).

When configuring the **TOKEN** restricted policy, you must set values for **verification key**, **issuer** and **audience**. The primary verification key contains the key that the token was signed with, issuer is the secure token service that issues the token. The audience (sometimes called scope) describes the intent of the token or the resource the token authorizes access to. The Media Services key delivery service validates that these values in the token match the values in the template.  

###PlayReady

When protecting your content with **PlayReady**, one of the things you need to specify in your authorization policy is an XML string that defines the PlayReady license template. By default, the following policy is set:
		
	<PlayReadyLicenseResponseTemplate xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/Azure/MediaServices/KeyDelivery/PlayReadyTemplate/v1">
	  <LicenseTemplates>
	    <PlayReadyLicenseTemplate><AllowTestDevices>true</AllowTestDevices>
	      <ContentKey i:type="ContentEncryptionKeyFromHeader" />
	      <LicenseType>Nonpersistent</LicenseType>
	      <PlayRight>
	        <AllowPassingVideoContentToUnknownOutput>Allowed</AllowPassingVideoContentToUnknownOutput>
	      </PlayRight>
	    </PlayReadyLicenseTemplate>
	  </LicenseTemplates>
	</PlayReadyLicenseResponseTemplate>

You can click the **import policy xml** button and provide a different XML which conforms to the  XML Schema defined [here](https://msdn.microsoft.com/library/azure/dn783459.aspx).


##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]


##Next Steps
Now that you have configured content key's authorization policy, go to the [How to: Use the Azure Classic Portal to enable encryption](media-services-manage-content.md#encrypt) topic.


[open_policy]: ./media/media-services-portal-configure-content-key-auth-policy/media-services-protect-content-with-open-restriction.png
[token_policy]: ./media/media-services-key-authorization-policy/media-services-protect-content-with-token-restriction.png

 