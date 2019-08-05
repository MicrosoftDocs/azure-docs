---
title: Microsoft identity platform and  SAML bearer assertion flow | Azure
description: 
services: active-directory
documentationcenter: ''
author: umeshbarapatre
manager: CelesteDG
editor: ''

ms.assetid: 
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/05/2019
ms.author: ryanwi
ms.reviewer: hirsin
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# Microsoft identity platform and OAuth 2.0 SAML bearer assertion flow
he OAuth 2.0 SAML bearer assertion flow describes how to request an OAuth access token using a SAML assertion when a client needs to use an existing trust relationship. The signature applied to the SAML assertion provides authentication of the authorized app. A SAML assertion is an XML security token issued by an identity provider and consumed by a service provider. The service provider relies on its content to identify the assertion’s subject for security-related purposes.

The SAML assertion is posted to the OAuth token endpoint.  The endpoint processes the assertion and issues an access token based on prior approval of the app. The client isn’t required to have or store a refresh token, nor is the client secret required to be passed to the token endpoint.

For applications that do interactive browser-based sign-in to get a SAML assertion and then want to add access to an OAuth protected API (such as Microsoft Graph), you can make an OAuth request to get an access token for the API. When the browser is redirected to Azure AD to authenticate the user, the browser will pick up the session from the SAML sign-in and the user doesn't need to enter their credentials.

The OAuth SAML Bearer Assertion flow is also supported for users authenticating with identity providers such as Active Directory Federation Services (ADFS) federated to Azure Active Directory.  The SAML assertion obtained from ADFS can be used in an OAuth flow to authenticate the user.

SAML Bearer Assertion Flow Microsoft Documentation suggest four authentication flows but also supports SAML Bearer assertion flow. This is useful in scenario when a user is trying to fetch data through Graph API, which only supports delegated permissions. In this case, client credentials flow, which is preferred for any background processes will not work. Also, when the information is being exchanged from few different systems then also the only resort is SAML Bearer flow.

What is the challenge in getting authenticated and access data through Office 365 and Azure AD was the question when i started working on this concept.

It all started with an intent of accessing the Graph API for different workloads in office 365 viz Accessing an outlook task, planner task or for that matter read Microsoft teams related information. There were couple of approaches to take in this scenario and no matter which approach we take, it all boils down to fetch an OAuth Token as any resource accessible through Graph API is secured with Azure AD. Basically, the need is to have the data in the background for the user, so the user should not be prompted for the credentials during the process. Hence as a first choice, client credentials flow is considered. This worked for quite a few APIs, I believe mostly for all of the Graph APIs that supports Application permission(for e.g SendMail, Read a sharepoint list item) while your register the App. However, for APIs that does not support, it is a complete dead end. To my research, there were no other flows that can help to fetch token/data without the prompt. Ultimately, in the end i came to know that OAuth2 Token endpoint for AAD supports SAML assertion and SAML assertion is basically in the user context, which means delegated permission will work. So in a nutshell below is the scenario.

![](./media/v2-saml-bearer-assertion/1.png)

## Get a SAML assertion, get an access token, and access Microsoft Graph
Now let us understand on how we can actually fetch SAML assertion programatically. This approach is tested with ADFS. However this works with any IDP that is supporting return of SAML assertion programatically.

### Pre-requisites

Establish a trust relationship between the authorization server/environment- O365 and the issuer of the SAML 2.0 bearer assertion, which is the identity provider - ADFS. To configure ADFS for single sign-on and as a identity provider you may refer to [this article](https://blogs.technet.microsoft.com/canitpro/2015/09/11/step-by-step-setting-up-ad-fs-and-enabling-single-sign-on-to-office-365/).

Register the application in the [portal](https://ms.portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade):
1. Log in to the [app registration blade of the portal](https://ms.portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) (Please note that we are using the v2.0 endpoints for Graph API and hence need to register the application in this portal. Otherwise we could have used the registrations in Azure active directory). 
1. In the left-hand navigation pane, select the Azure Active Directory service, and then select App registrations > New registration.
1. When the Register an application page appears, enter your application's registration information: 
    1. Name - Enter a meaningful application name that will be displayed to users of the app.
    1. Supported account types - Select which accounts you would like your application to support.
    1. Redirect URI (optional) - Select the type of app you're building, Web or Public client (mobile & desktop), and then enter the redirect URI (or reply URL) for your application.
    1. When finished, select Register.
1. Make a note of the Application ID (this is referred as client ID when required by the application).
1. Click "Generate New Password" under Application secrets section. Note that this will be flashed only once in the screen and make sure you note and save it in a safe place.
1. Under section "Microsoft Graph Permissions", add delegated permission for "Tasks.read" since we intend to use the Outlook Graph API. 
1. Click Save for saving the Application-related settings and data.

Postman Tool is required to test the Sample requests in three parts 

### Fetch the OAuth token and access Graph API 
This can be achieved with the POSTMAN tool for POC in three parts as below. The same can be converted to code in any platform of your choice.
1. Get the SAML assertion from ADFS
1. Get the OAuth2 token using the assertion
1. Get the data with the Oauth token 

### Get the SAML assertion from ADFS
1. Create a POST request to ADFS endpoint with SOAP envelope to fetch the SAML assertion

    ![](./media/v2-saml-bearer-assertion/2.png)

    Header values as below

    ![](./media/v2-saml-bearer-assertion/3.png)

    ADFS request body

    ![](./media/v2-saml-bearer-assertion/4.png)

Note: At the end of the post, I have attached the postman export files for reference. Once, this request is posted successfully, you should receive a SAML Assertion from ADFS Only the SAML:Assertion tag data is required for further requests Convert the same to base64 encoding to use in further requests.

### Get the OAuth2 token using the assertion 
In this step, we will fetch a OAuth2 token using the ADFS assertion response.

1. Create a POST request as shown below with the header values. 
    ![](./media/v2-saml-bearer-assertion/5.png)
1. In the Body of the request please do the following. Replace client_id, client_secret and assertion (base 64 encoded SAML assertion obtained in step #1)
    ![(./media/v2-saml-bearer-assertion/6.png)
1. Upon successful request, you will receive an access token from Azure active directory.

### Get the data with the Oauth token

For the POC, we will call Graph APIs (e.g outlook tasks in this example) 

1. Create a GET request as shown below with the access token fetched in the earlier step. 

    ![](./media/v2-saml-bearer-assertion/7.png)

1. Upon successful request, you will receive a json response.
