---
title: Problems signing in to SAML-based single sign-on configured apps
description: Guidance for the specific errors when signing into an application you have configured for SAML-based federated single sign-on with Azure Active Directory
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: troubleshooting
ms.date: 02/18/2019
ms.author: kenwith
ms.reviewer: luleon, asteen
ms.custom: contperfq2
---

# Problems signing in to SAML-based single sign-on configured apps
To troubleshoot the sign-in issues below, we recommend the following to better diagnosis and automate the resolution steps:

- Install the [My Apps Secure Browser Extension](access-panel-extension-problem-installing.md) to help Azure Active Directory (Azure AD) to provide better diagnosis and resolutions when using the testing experience in the Azure portal.
- Reproduce the error using the testing experience in the app configuration page in the Azure portal. Learn more on [Debug SAML-based single sign-on applications](../azuread-dev/howto-v1-debug-saml-sso-issues.md)

If you use the [testing experience](../azuread-dev/howto-v1-debug-saml-sso-issues.md) in the Azure portal with the My Apps Secure Browser Extension, you don't need to manually follow the steps below to open the SAML-based single sign-on configuration page.

To open the SAML-based single sign-on configuration page:
1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Coadmin**.
1.  Open the **Azure Active Directory Extension** by selecting **All services** at the top of the main left-hand navigation menu.
1.  Type **“Azure Active Directory"** in the filter search box and select the **Azure Active Directory** item.
1.  Select **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.
1.  Select **All Applications** to view a list of all your applications.
	If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications**.
1.  Select the application you want to configure for single sign-on.
1. Once the application loads, select **Single sign-on** from the application’s left-hand navigation menu.
1. Select SAML-based SSO.

## Application not found in directory
`Error AADSTS70001: Application with Identifier 'https:\//contoso.com' was not found in the directory.`

**Possible cause**

The `Issuer` attribute sent from the application to Azure AD in the SAML request doesn’t match the Identifier value that's configured for the application in Azure AD.

**Resolution**

Ensure that the `Issuer` attribute in the SAML request matches the Identifier value configured in Azure AD.

On the SAML-based SSO configuration page, in the **Basic SAML configuration** section, verify that the value in the Identifier textbox matches the value for the identifier value displayed in the error.

## The reply address does not match the reply addresses configured for the application
`Error AADSTS50011: The reply address 'https:\//contoso.com' does not match the reply addresses configured for the application.`

**Possible cause**

The `AssertionConsumerServiceURL` value in the SAML request doesn't match the Reply URL value or pattern configured in Azure AD. The `AssertionConsumerServiceURL` value in the SAML request is the URL you see in the error.

**Resolution**

Ensure that the `AssertionConsumerServiceURL` value in the SAML request matches the Reply URL value configured in Azure AD. 

Verify or update the value in the Reply URL textbox to match the `AssertionConsumerServiceURL` value in the SAML request. 	
	
After you've updated the Reply URL value in Azure AD, and it matches the value sent by the application in the SAML request, you should be able to sign in to the application.

## User not assigned a role
`Error AADSTS50105: The signed in user 'brian\@contoso.com' is not assigned to a role for the application.`

**Possible cause**

The user has not been granted access to the application in Azure AD.

**Resolution**

To assign one or more users to an application directly, see [Quickstart: Assign users to an app](add-application-portal-assign-users.md).

## Not a valid SAML request
`Error AADSTS75005: The request is not a valid Saml2 protocol message.`

**Possible cause**

Azure AD doesn’t support the SAML request sent by the application for single sign-on. Some common issues are:
- Missing required fields in the SAML request
- SAML request encoded method

**Resolution**

1. Capture the SAML request. Follow the tutorial [How to debug SAML-based single sign-on to applications in Azure AD](../azuread-dev/howto-v1-debug-saml-sso-issues.md) to learn how to capture the SAML request.
1. Contact the application vendor and share the following info:
    - SAML request
    - [Azure AD Single Sign-on SAML protocol requirements](../develop/single-sign-on-saml-protocol.md)

The application vendor should validate that they support the Azure AD SAML implementation for single sign-on.

## Misconfigured application
`Error AADSTS650056: Misconfigured application. This could be due to one of the following: The client has not listed any permissions in the requested permissions in the client's application registration. Or, The admin has not consented in the tenant. Or, Check the application identifier in the request to ensure it matches the configured client application identifier. Please contact your admin to fix the configuration or consent on behalf of the tenant.`

**Possible cause**

The `Issuer` attribute sent from the application to Azure AD in the SAML request doesn’t match the Identifier value configured for the application in Azure AD.

**Resolution**

Ensure that the `Issuer` attribute in the SAML request matches the Identifier value configured in Azure AD. 

Verify that the value in the Identifier textbox matches the value for the identifier value displayed in the error.

## Certificate or key not configured
`Error AADSTS50003: No signing key configured.`

**Possible cause**

The application object is corrupted and Azure AD doesn’t recognize the certificate configured for the application.

**Resolution**

To delete and create a new certificate, follow the steps below:
1. On the SAML-based SSO configuration screen, select **Create new certificate** under the **SAML signing Certificate** section.
1. Select Expiration date and then click **Save**.
1. Check **Make new certificate active** to override the active certificate. Then, click **Save** at the top of the pane and accept to activate the rollover certificate.
1. Under the **SAML Signing Certificate** section, click **remove** to remove the **Unused** certificate.

## SAML Request not present in the request
`Error AADSTS750054: SAMLRequest or SAMLResponse must be present as query string parameters in HTTP request for SAML Redirect binding.`

**Possible cause**

Azure AD wasn’t able to identify the SAML request within the URL parameters in the HTTP request. This can happen if the application is not using HTTP redirect binding when sending the SAML request to Azure AD.

**Resolution**

The application needs to send the SAML request encoded into the location header using HTTP redirect binding. For more information about how to implement it, read the section HTTP Redirect Binding in the [SAML protocol specification document](https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf).

## Azure AD is sending the token to an incorrect endpoint
**Possible cause**

During single sign-on, if the sign-in request does not contain an explicit reply URL (Assertion Consumer Service URL) then Azure AD will select any of the configured reply URLs for that application. Even if the application has an explicit reply URL configured, the user may be to redirected https://127.0.0.1:444. 

When the application was added as a non-gallery app, Azure Active Directory created this reply URL as a default value. This behavior has changed and Azure Active Directory no longer adds this URL by default. 

**Resolution**

Delete the unused reply URLs configured for the application.

On the SAML-based SSO configuration page, in the **Reply URL (Assertion Consumer Service URL)** section, delete unused or default Reply URLs created by the system. For example, `https://127.0.0.1:444/applications/default.aspx`.


## Authentication method by which the user authenticated with the service doesn't match requested authentication method
`Error: AADSTS75011 Authentication method by which the user authenticated with the service doesn't match requested authentication method 'AuthnContextClassRef'. `

**Possible cause**

The `RequestedAuthnContext` is in the SAML request. This means the app is expecting the `AuthnContext` specified by the `AuthnContextClassRef`. However, the user has already authenticated prior to access the application and the `AuthnContext` (authentication method) used for that previous authentication is different from the one being requested. For example, a federated user access to myapps and WIA occurred. The `AuthnContextClassRef` will be `urn:federation:authentication:windows`. AAD won’t perform a fresh authentication request, it will use the authentication context that was passed-through it by the IdP (ADFS or any other federation service in this case). Therefore, there will be a mismatch if the app requests other than `urn:federation:authentication:windows`. Another scenario is when MultiFactor was used: `'X509, MultiFactor`.

**Resolution**


`RequestedAuthnContext` is an optional value. Then, if possible, ask the application if it could be removed.

Another option is to make sure the `RequestedAuthnContext` will be honored. This will be done by requesting a fresh authentication. By doing this, when the SAML request is processed, a fresh authentication will be done and the `AuthnContext` will be honored. To request a Fresh Authentication the SAML request most contain the value `forceAuthn="true"`. 



## Problem when customizing the SAML claims sent to an application
To learn how to customize the SAML attribute claims sent to your application, see [Claims mapping in Azure Active Directory](../develop/active-directory-claims-mapping.md).

## Errors related to misconfigured apps
Verify both the configurations in the portal match what you have in your app. Specifically, compare Client/Application ID, Reply URLs, Client Secrets/Keys, and App ID URI.

Compare the resource you’re requesting access to in code with the configured permissions in the **Required Resources** tab to make sure you only request resources you’ve configured.

## Next steps
- [Quickstart Series on Application Management](add-application-portal-assign-users.md)
- [How to debug SAML-based single sign-on to applications in Azure AD](../azuread-dev/howto-v1-debug-saml-sso-issues.md)
- [Azure AD Single Sign-on SAML protocol requirements](../develop/active-directory-single-sign-on-protocol-reference.md)
