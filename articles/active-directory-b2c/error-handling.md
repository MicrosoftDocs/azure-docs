---
title: Handle errors in Azure Active Directory B2C
description: Help on handling commonly encountered error codes returned by the Azure Active Directory B2C service.
services: B2C
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 07/03/2019
ms.author: marsma
ms.subservice: B2C
---

# Handle errors in Azure Active Directory B2C

The following are some of the more commonly encountered errors when working with Azure Active Directory B2C. Each of the following sections contains the following information for an error code:

- Error code
- Error message
- Scenarios in which you might encounter the error
- Possible solutions for the error
- Link to related documentation

## AADB2C90002

> *The CORS resource '{0}' returned a 404 not found*

### Scenarios

Running the policy using Customized Page Layouts. For example:

Unified sign up or sign in page -> Custom page URI, which is uploaded in BLOBS

### Solutions

Make sure the Custom page URI is present at the location where it is uploaded/present.

### Related documentation

[Tutorial: Customize the interface of user experiences in Azure Active Directory B2C](tutorial-customize-ui.md)

## AADB2C90006

> *The redirect URI '{0}' provided in the request is not registered for the client id '{1}'*

### Scenarios

This scenario appears when we alter the Redirect URI in Runnow URL, for example if you replace `https://jwt.ms` with `https://jwt.ms1`

### Solutions

Redirect URI given in application and runnow URL should be same

### Related documentation

[Set redirect URLs to b2clogin.com for Azure Active Directory B2C](b2clogin.md)

## AADB2C90008

> *The request does not contain a client id*

### Scenarios

This scenario appears when we delete Client_ID parameter from the Run now url

### Solutions

Runnow URL must have the Client_ID parameter when you run the URL in browser

### Related documentation

[AAD Auth Failures - Providing incorrect client ID](/skype-sdk/websdk/docs/troubleshooting/auth/aadauth-clientid)

## AADB2C90013

> *The requested response type '{0}' provided in the request is not supported*

### Scenarios

While running the ‘Run now url’ with custom response types

### Solutions

Ensure the response_type is one of the supported types:

```yaml
"response_types_supported":
[
    "code",
    "code id_token",
    "code token",
    "code id_token token",
    "id_token",
    "id_token token",
    "token",
    "token id_token"
]
```

### Related documentation

[Overview of tokens in Azure Active Directory B2C](active-directory-b2c-reference-tokens.md)

## AADB2C90018

> *The client id '{0}' specified in the request is not registered in tenant '{1}'*

### Scenarios

1. This issue appears when the Client ID copied is incorrect in the runnow URL
1. When the application is created from Application Registration Portal

### Solutions

1. Make sure  Application ID in run now URL correctly
2. Make sure Applications are created from Azure AD B2C Blade not from Active Directory blade https://apps.dev.microsoft.com/

### Related documentation

[Quickstart: Register an application with the Microsoft identity platform](quickstart-register-app.md)

## AADB2C90046

> *We are having trouble loading your current state. You might want to try starting your session over from the beginning*

### Scenarios

While Running CSRF url

### Solutions

Check in the csrf url whether the `stateproperties` tag is missing.

### Related documentation

N/A

## AADB2C90047

> *The resource '{0}' contains script errors preventing it from being loaded*

### Scenarios

Running unified sign up or sign in page

### Solutions

1. Enable CORS While creating customization files
1. If CORS is enabled check for the allowed methods "GET" is checked or not, in the CORS Page.

### Related documentation

[Tutorial: Customize the interface of user experiences in Azure Active Directory B2C](tutorial-customize-ui.md)

## AADB2C90053

> *A user with the specified credential could not be found*

### Scenarios

In self-asserted page when password reset is requested for a non-AD user account.

### Solutions

The user should  sign in with only Registered AD users.

### Related documentation

[Configure password change using custom policies in Azure Active Directory B2C](active-directory-b2c-reference-password-change-custom.md)

## AADB2C90054

> *Invalid username or password.*

### Scenarios

Within a self-asserted page during sign in.

### Solutions

This issue is specific to custom policies. When adding custom policies, you need to add the extension apps to ensure sign-in works against the local account identity provider:

Ensure both **IdentityExperienceFramework** and **ProxyIdentityExperienceFramework** apps have been created in your Azure AD B2C tenant, and that their application IDs have been added to the *TrustFrameworkExtensions.xml* custom policy file.

### Related documentation

[Get started with custom policies in Azure Active Directory B2C](active-directory-b2c-get-started-custom.md)

## AADB2C90077

> *User does not have an existing session and request prompt parameter has a value of '{0}'*

### Scenarios

- Scenario 1
  - This issue appears when 'Web App Session lifetime(Minuets)' is expired and when you load the Runnow URL with Prompt='None'
- Scenario 2
  - This issue appears when SSO level in SUSI is set to 'Application' level and PE & PR policies are set to 'Policy' level and load the Runnow URL with Prompt='None'
  - This issue appears when SSO level in SUSI is set to 'Application' level and PE & PR policies are set to 'Tenant' level and load the Runnow URL with Prompt='None'
  - This issue appears when SSO level in SUSI is set to 'Application' level and PE & PR policies are set to 'Suppressed' level and load the Runnow URL with Prompt='None'
- Scenario 3
  - This issue appears when SSO level in SUSI is set to 'Tenant' level and PE & PR policies are set to 'Policy' level and load the Runnow URL with Prompt='None'
  - This issue appears when SSO level in SUSI is set to 'Tenant' level and PE & PR policies are set to 'Application' level and load the Runnow URL with Prompt='None'
  - This issue appears when SSO level in SUSI is set to 'Tenant' level and PE & PR policies are set to 'Suppressed' level and load the Runnow URL with Prompt='None'
- Scenario 4
  - This issue appears when SSO level in SUSI is set to 'Policy' level and PE & PR policies are set to 'Application' level and load the Runnow URL with Prompt='None'
  - This issue appears when SSO level in SUSI is set to 'Policy' level and PE & PR policies are set to 'Tenant' level and load the Runnow URL with Prompt='None'
  - This issue appears when SSO level in SUSI is set to 'Policy' level and PE & PR policies are set to 'Suppressed' level and load the Runnow URL with Prompt='None'
- Scenario 5
  - This issue appears when SSO level in SUSI is set to 'Suppressed' level and PE & PR policies are set to 'Application' level and load the Runnow URL with Prompt='None'
  - This issue appears when SSO level in SUSI is set to 'Suppressed' level and PE & PR policies are set to 'Application' level and load the Runnow URL with Prompt='None'
  - This issue appears when SSO level in SUSI is set to 'Suppressed' level and PE & PR policies are set to 'Policy' level and load the Runnow URL with Prompt='None'
  - This issue appears when SSO level in SUSI is set to 'Suppressed' level and PE & PR policies are set to 'Tenant' level and load the Runnow URL with Prompt='None'
- Scenario 6
  - This issue appears when you change the domain in the runnow URL and load the Runnow URL with Prompt=none

### Solutions

- **Scenario 1**: Make sure Web App Session lifetime is not expired
- **Scenarios 2, 3, 4, 5**: SSO level for the all the policies should be set as either Application or Tenant or Suppressed
- **Scenario 6**: Domain selected in the runnow URL should be correct while loading the Runnow URL with Prompt=none

### Related documentation

[Session and single sign-on configuration in Azure Active Directory B2C](active-directory-b2c-token-session-sso.md)

## AADB2C90080

> *The provided grant has expired. Please re-authenticate and try again. Current time: {0}, Grant issued time: {1}, Grant sliding window expiration time: {2}*

### Scenarios

1. While redeeming auth code to get access token using expired auth code
1. While redeeming refresh_token to get access token using expired refresh token

### Solutions

Ensure the auth code or refresh token has not expired prior to redeeming it.

### Related documentation

[OAuth 2.0 authorization code flow in Azure Active Directory B2C](active-directory-b2c-reference-oauth-code.md)

## AADB2C90088

> *The provided grant has not been issued for this endpoint*

### Scenarios

While trying to redeem the code.

### Solutions

Check whether the user flow is same as the one which is used to retrieve the code.

### Related documentation

[OAuth 2.0 authorization code flow in Azure Active Directory B2C](active-directory-b2c-reference-oauth-code.md)

## AADB2C90090

> *Sent in response to client when a grant token is in an unsupported format*

### Scenarios

While trying to redeem the code

### Solutions

Make sure entered code is valid and should be same as code received from auth code flow.

### Related documentation

[OAuth 2.0 authorization code flow in Azure Active Directory B2C](active-directory-b2c-reference-oauth-code.md)

## AADB2C90117

> *The scope '{0}' provided in the request is not supported*

### Scenarios

While trying to redeem the code

### Solutions

Check the requested scopes are valid and correct

### Related documentation

[OAuth 2.0 authorization code flow in Azure Active Directory B2C](active-directory-b2c-reference-oauth-code.md)

## AADB2C90128

> *The account associated with this grant no longer exists. Please reauthenticate and try again*

### Scenarios

While trying to Redeem the refresh token

### Solutions

Check whether the user is existing in AD

### Related documentation

N/A

## AADB2C90129

> *The provided grant has been revoked. Please reauthenticate and try again*

### Scenarios

While trying to redeem a refresh token during resource owner password credentials (ROPC) flow.

### Solutions

Ensure the refresh token has not expired before attempting to redeem the token.

### Related documentation

[Configure the resource owner password credentials flow in Azure AD B2C](configure-ropc.md)

## AADB2C90225

> *The username or password provided in the request are invalid*

### Scenarios

ROPC Postman Request for an ID token, access token, and a refresh token

### Solutions

1. If the user is not of a Registered AD user.
1. If Incorrect password is given for the user.
1. Check the user is not Blocked from sign in.

### Related documentation

[Configure the resource owner password credentials flow in Azure AD B2C](configure-ropc.md)
