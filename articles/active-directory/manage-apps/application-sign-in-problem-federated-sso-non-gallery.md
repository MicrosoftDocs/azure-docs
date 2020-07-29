---
title: Problems signing in to non-gallery federated single sign-on app
description: Guidance for the specific problems you may face when signing in to an application configured for SAML-based federated single sign-on with Azure AD
services: active-directory
documentationcenter: ''
author: kenwith
manager: celestedg
ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 07/11/2017
ms.author: kenwith
ms.reviewer: asteen
ms.collection: M365-identity-device-management
---


# Problems signing in to a non-gallery application configured for federated single sign-on

To troubleshoot the sign-in issues below, we recommend you follow these suggestion to get better diagnosis and automate the resolution steps:

- Install the [My Apps Secure Browser Extension](access-panel-extension-problem-installing.md) to help Azure Active Directory (Azure AD) to provide better diagnosis and resolutions when using the testing experience in the Azure portal.
- Reproduce the error using the testing experience in the app configuration page in the Azure portal. Learn more on [Debug SAML-based single sign-on applications](../azuread-dev/howto-v1-debug-saml-sso-issues.md)

## Application not found in directory

*Error AADSTS70001: Application with Identifier `https://contoso.com` was not found in the directory*.

**Possible cause**

The Issuer attribute sends from the application to Azure AD in the SAML request doesn’t match the Identifier value configured in the application Azure AD.

**Resolution**

Ensure that the `Issuer` attribute in the SAML request matches the Identifier value configured in Azure AD. If you use the [testing experience](../azuread-dev/howto-v1-debug-saml-sso-issues.md) in the Azure portal with the My Apps Secure Browser Extension, you don't need to manually follow these steps.

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6. Select the application you want to configure single sign-on.

7. Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8. Once the application loads, open **Basic SAML configuration**. Verify that the value in the Identifier textbox matches the value for the identifier value displayed in the error.

## The reply address does not match the reply addresses configured for the application. 

*Error AADSTS50011: The reply address `https://contoso.com` does not match the reply addresses configured for the application* 

**Possible cause** 

The AssertionConsumerServiceURL value in the SAML request doesn't match the Reply URL value or pattern configured in Azure AD. The AssertionConsumerServiceURL value in the SAML request is the URL you see in the error. 

**Resolution** 

Ensure that the `Issuer` attribute in the SAML request matches the Identifier value configured in Azure AD. If you use the [testing experience](../azuread-dev/howto-v1-debug-saml-sso-issues.md) in the Azure portal with the My Apps Secure Browser Extension, you don't need to manually follow these steps.
 
1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.** 

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu. 

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item. 

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu. 

5. click **All Applications** to view a list of all your applications. 

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and       set the **Show** option to **All Applications.**
  
6. Select the application you want to configure single sign-on

7. Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8. Once the application loads, open **Basic SAML configuration**. Verify or update the value in the Reply URL textbox to match the `AssertionConsumerServiceURL` value in the SAML request.    
	
After you've updated the Reply URL value in Azure AD, and it matches the value sent by the application in the SAML request, you should be able to sign in to the application.

## User not assigned a role

*Error AADSTS50105: The signed in user `brian\@contoso.com` is not assigned to a role for the application*

**Possible cause**

The user has not been granted access to the application in Azure AD.

**Resolution**

To assign one or more users to an application directly, follow the steps below. If you use the [testing experience](../azuread-dev/howto-v1-debug-saml-sso-issues.md) in the Azure portal with the My Apps Secure Browser Extension, you don't need to manually follow these steps.

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6. Select the application you want to assign a user to from the list.

7. Once the application loads, click **Users and Groups** from the application’s left-hand navigation menu.

8. Click the **Add** button on top of the **Users and Groups** list to open the **Add Assignment** pane.

9. click the **Users and groups** selector from the **Add Assignment** pane.

10. Type in the **full name** or **email address** of the user you are interested in assigning into the **Search by name or email address** search box.

11. Hover over the **user** in the list to reveal a **checkbox**. Click the checkbox next to the user’s profile photo or logo to add your user to the **Selected** list.

12. **Optional:** If you would like to **add more than one user**, type in another **full name** or **email address** into the **Search by name or email address** search box, and click the checkbox to add this user to the **Selected** list.

13. When you are finished selecting users, click the **Select** button to add them to the list of users and groups to be assigned to the application.

14. **Optional:** click the **Select Role** selector in the **Add Assignment** pane to select a role to assign to the users you have selected.

15. Click the **Assign** button to assign the application to the selected users.

After a short period of time, the users you have selected be able to launch these applications using the methods described in the solution description section.

## Not a valid SAML Request

*Error AADSTS75005: The request is not a valid Saml2 protocol message.*

**Possible cause**

Azure AD doesn’t support the SAML Request sent by the application for Single Sign-on. Some common issues are:

-   Missing required fields in the SAML request

-   SAML request encoded method

**Resolution**

1.  Capture SAML request. follow the tutorial on [how to debug SAML-based single sign-on to applications in Azure AD](https://docs.microsoft.com/azure/active-directory/develop/active-directory-saml-debugging) to learn how to capture the SAML request.

2.  Contact the application vendor and share:

    -   SAML request

    -   [Azure AD Single Sign-on SAML protocol requirements](https://docs.microsoft.com/azure/active-directory/develop/active-directory-single-sign-on-protocol-reference)

The application vendor should validate that they support the Azure AD SAML implementation for single sign-on.

## Misconfigured application

*Error AADSTS650056: Misconfigured application. This could be due to one of the following: The client has not listed any permissions in the requested permissions in the client's application registration. Or, The admin has not consented in the tenant. Or, Check the application identifier in the request to ensure it matches the configured client application identifier. Please contact your admin to fix the configuration or consent on behalf of the tenant.*.

**Possible cause**

The `Issuer` attribute sent from the application to Azure AD in the SAML request doesn’t match the Identifier value configured for the application in Azure AD.

**Resolution**

Ensure that the `Issuer` attribute in the SAML request matches the Identifier value configured in Azure AD. If you use the [testing experience](../azuread-dev/howto-v1-debug-saml-sso-issues.md) in the Azure portal with the My Apps Secure Browser Extension, you don't need to manually follow these steps:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin**.

1.  Open the **Azure Active Directory Extension** by selecting **All services** at the top of the main left-hand navigation menu.

1.  Type **“Azure Active Directory"** in the filter search box and select the **Azure Active Directory** item.

1.  Select **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

1.  Select **All Applications** to view a list of all your applications.

	If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications**.

1.  Select the application you want to configure for single sign-on.

1.  Once the application loads, open **Basic SAML configuration**. Verify that the value in the Identifier textbox matches the value for the identifier value displayed in the error.

## Certificate or key not configured

Error AADSTS50003: No signing key configured.

**Possible cause**

The application object is corrupted and Azure AD doesn’t recognize the certificate configured for the application.

**Resolution**

To delete and create a new certificate, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6. Select the application you want to configure single sign-on.

7. Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8. click **Create new certificate** under the **SAML signing Certificate** section.

9. Select Expiration date. Then, click **Save.**

10. Check **Make new certificate active** to override the active certificate. Then, click **Save** at the top of the pane and accept to activate the rollover certificate.

11. Under the **SAML Signing Certificate** section, click **remove** to remove the **Unused** certificate.

## SAML Request not present in the request

*Error AADSTS750054: SAMLRequest or SAMLResponse must be present as query string parameters in HTTP request for SAML Redirect binding.*

**Possible cause**

Azure AD wasn’t able to identify the SAML request within the URL parameters in the HTTP request. This can happen if the application is not using HTTP redirect binding when sending the SAML request to Azure AD.

**Resolution**

The application needs to send the SAML request encoded into the location header using HTTP redirect binding. For more information about how to implement it, read the section HTTP Redirect Binding in the [SAML protocol specification document](https://docs.oasis-open.org/security/saml/v2.0/saml-bindings-2.0-os.pdf).

## Azure AD is sending the token to an incorrect endpoint

**Possible cause**

During single sign-on, if the sign-in request does not contain an explicit reply URL (Assertion Consumer Service URL) then Azure AD will select any of the configured rely URLs for that application. Even if the application has an explicit reply URL configured, the user may be to redirected https://127.0.0.1:444. 

When the application was added as a non-gallery app, Azure Active Directory created this reply URL as a default value. This behavior has changed and Azure Active Directory no longer adds this URL by default. 

**Resolution**

Delete the unused reply URLs configured for the application.

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin**.

2.  Open the **Azure Active Directory Extension** by selecting **All services** at the top of the main left-hand navigation menu.

3.  Type **“Azure Active Directory"** in the filter search box and select the **Azure Active Directory** item.

4.  Select **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  Select **All Applications** to view a list of all your applications.

	If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications**.

6.  Select the application you want to configure for single sign-on.

7.  Once the application loads, open **Basic SAML configuration**. In the **Reply URL (Assertion Consumer Service URL)**, delete unused or default Reply URLs created by the system. For example, `https://127.0.0.1:444/applications/default.aspx`.



## Problem when customizing the SAML claims sent to an application

To learn how to customize the SAML attribute claims sent to your application, see [Claims mapping in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-claims-mapping) for more information.

## Next steps
[Azure AD Single Sign-on SAML protocol requirements](https://docs.microsoft.com/azure/active-directory/develop/active-directory-single-sign-on-protocol-reference)
