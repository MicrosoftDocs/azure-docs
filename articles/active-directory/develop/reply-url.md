---
# required metadata
title: Azure Active Directory guided setups steps
description: App registration portal content
author: SureshJa
ms.author: sureshja
manager: 
ms.date: 09/06/2019
ms.topic: article
ms.subservice: develop
ms.service: active-directory

# optional metadata
ROBOTS: NOINDEX,NOFOLLOW
#audience:
#ms.devlang:
#ms.reviewer:
#ms.suite: 
#ms.tgt_pltfrm:
#ms.custom: 
#Do not delete this file. It compiles all the include files used in the Application Registration Portal but not rendered on docs.
ms.collection: M365-identity-device-management
---
# Reply URLs/redirect URls restrictions & limitations

## Maximum number of URIs
A maximum of 256 redirect URIs can be added to an app registration if the same is configured to sign in Microsoft work or school accounts in any organization's Azure AD tenant (i.e. `signInAudience` field in the application manifest is set to either *AzureADMyOrg* or *AzureADMultipleOrgs* )

A maximum of 100 redirect URIs can be added to an app registration if the same is configured to sign in users with personal Microsoft account, or a work or school account in any organization's Azure AD tenant (i.e. `signInAudience` field in the application manifest is set to either *AzureADandPersonalMicrosoftAccount*)

## Maximum URI length
A maximum of 256 characters are allowed for each redirect URI added to an app registration.

## Restrictions using a wildcard in URIs
While wildcard URIs (e.g. https://*.contoso.com) are convenient, they should be avoided. Using wildcards in the redirect URI has security implications. According to the OAuth 2.0 specification ([section 3.1.2 of RFC 6749](https://tools.ietf.org/html/rfc6749#section-3.1.2)) a redirection endpoint URI must be an absolute URI. 

Azure AD application model does not support Wildcard URIs for apps that are configured to sign in personal Microsoft accounts, or work or school accounts. However, wildcard URIs are allowed for apps that are configured to sign in Microsoft work or school accounts in an organization's Azure AD tenant today. 
 
> Note: Azure AD application model will be tightened to not support wildcard URIs for apps that are configured to sign in Microsoft work or school accounts as well. As a first step, the new [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) experience does not allow developers to add wildcard URIs on the UI. 

If your scenario requires you to add redirect URIs more than the maximum limit supported by Azure AD, instead of looking to add a wildcard redirect URI, you can consider one of the following approaches:

### 1. Add redirect URIs to ServicePrincipals
This approach is suitable if your scenario requires you to add new redirect URIs to your app registration for every new tenant you support. Under this approach, instead of adding redirect URIs to your app registration, you can add redirect URIs to the [ServicePrincipals](https://docs.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals#application-and-service-principal-relationship) that represent your app registration in any Azure AD tenant. 

### 2. Use state parameter
If you have a number of sub-domains, and if your scenario requires you to redirect users upon successful authentication to the same page where they started, this approach might be helpful. Under this approach:

1) Create a 'common' reply URL per application to process the security tokens you receive from the authorization endpoint.
2) Your application can send application-specific parameters (e.g., sub-domain URL where the user originated or anything like branding information) in the state parameter. When using state parameter, please ensure you guard against CSRF protection as specified in [section 10.12 of RFC 6749](https://tools.ietf.org/html/rfc6749#section-10.12)). 
3) The application specific parameters will include all the information needed for application to render the correct experience for the user (i.e. construct the appropriate application state). Please note that the Azure AD authorization endpoint strips HTML from the state parameter. So make sure you are not passing HTML content in state parameter.
4) When Azure AD sends a response to the 'common' reply URL, it will send the state parameter back to the application.
5) The application can then use the value in the state parameter to determine which URL to further send the user to. Please ensure you validate for CSRF protection.

> Note: This approach allows a compromized client to modify the additional parameters sent in the state thereby redirecting the user to a different URL, which is the [open redirector threat](https://tools.ietf.org/html/rfc6819#section-4.2.4) described in RFC 6819. Therefore, the client will need to protect these parameters by encrypting state or verifying it by some other means.