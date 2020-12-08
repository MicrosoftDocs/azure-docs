---
title: Microsoft identity platform token exchange scenarios with SAML and OAuth
description: Learn about common token exchange scenarios when working with SAML and OAuth in the Microsoft identity platform.
services: active-directory
author: kenwith
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 12/07/2020
ms.author: kenwith
ms.reviewer: paulgarn
---

# Microsoft identity platform token exchange scenarios with SAML and OAuth

DO A REVIEW LOOP WITH KYLE AND MATHIAS.

SAML and OpenID Connect (OIDC) / OAuth are popular protocols used to implement Single Sign-On (SSO). Some apps might only implement SAML and others might only implement OIDC/OAuth. Both protocols use tokens to communicate secrets.

This article outlines common scenarios where you need to exchange tokens between SAML and OIDC/OAuth. Basic guidance is provided including what is supported, what is not supported, and what is possible though not recommended.

## Scenario: You have a SAML token and want to call Graph using an OAuth token

Most people finding article are looking for a way to get at Graph with a SAML token.

Is this scenario supported? Yes, but not simple, but doable with some caveats. You need to add OAuth stack into your app. Can do this with the right libraries. Might or might not be trivial. Assumption is that can be done (400 level stuff). Have to add in code to do the following...

Main idea is that there is no explicit token exchange. Rely on the session cookie. Sign in using SAML and get SAML token. Also have a session cookie in the browser. If you can invoke an OAuth flow and when it comes to ask user for credentials you find the session and CA passes and user is authorized, etc... then use the session to issue the OAuth token. 

There is a POC that calls endpoints directly. Couple people have worked on doing it with a library.

By definition this is adding OAuth stack into the app. Have SAML and adding OAuth stack. Should use MSAL to do this.

Can point to more extensive docs later on... 


### AD FS (on premises based identity management) compared to Azure AD (cloud based identity management)

Basic guidance on how to do it? Should we cover using AD FS vs. AAD and also ADAL vs. MSAL? Doesn't matter for this scenario. AD FS or AAD will provide the session cookie. Should work in both cases.

### ADAL vs MSAL (version 1 compared to version 2 of identity library)
Using ADAL library (often called v1 of Microsoft's identity library) compared to using MSAL (often called v2 of Microsoft's identity library). For more information about ADAL versus MSAL, see [Overview of Microsoft Authentication Library (MSAL)](msal-overview.md).

Think you can do this scenario with either ADAL or MSAL. Just invoking the regular authorization code flows for OAuth and requesting a Graph token. Unless things have changed. We should probably push the MSAL version since we are moving away from ADAL. 



## Scenario: You have an OAuth token and you want to call into an app implemented with SAML

Is this scenario supported? yes, possible. There is an OAuth grant that accepts a SAML token. Was added 2 or 3 years ago and documented in the reference. 

Basic guidance on how to do it? Should we cover using AD FS vs. AAD and also ADAL vs. MSAL? I put placeholder info below.
https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow#saml-assertions-obtained-with-an-oauth20-obo-flow shows info for MSAL.



### AD FS (on premises based identity management) compared to Azure AD (cloud based identity management)

### ADAL vs MSAL (version 1 compared to version 2 of identity library)
Using ADAL library (often called v1 of Microsoft's identity library) compared to using MSAL (often called v2 of Microsoft's identity library). For more information about ADAL versus MSAL, see [Overview of Microsoft Authentication Library (MSAL)](msal-overview.md).

Might be that MSAL endpoint doesn't support it but ADAL does. Need to confirm if this scenario works in MSAL or only in ADAL. (Randy or Adrian Fry - check with Paul)

ADAL details in https://docs.microsoft.com/en-us/azure/active-directory/azuread-dev/v1-oauth2-on-behalf-of-flow ... the V2 doc doesn't have the token request details. need to confirm and if it is supported in MSAL then pull this content to the MSAL doc.




## Scenario: Paul mentioned a couple of other scenarios to cover
You have an OIDC app talking to AD FS, AD FS is trusted by AAD. cannot submit the JWOT 
Apps running on AD FS and you want to move these resources to AAD. Face a choice of moving everything at once or translate an AD FS authorization to present to AAD. JWOT equivalent.



## Next steps
- [authentication flows and application scenarios](authentication-flows-app-scenarios.md)
