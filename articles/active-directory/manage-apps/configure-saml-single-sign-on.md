---
title: Understand SAML-based single sign-on (SSO) for apps in Azure Active Directory
description: Understand SAML-based single sign-on (SSO) for apps in Azure Active Directory
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 07/28/2020
ms.author: kenwith
ms.reviewer: arvinh,luleon
---

# Understand SAML-based single sign-on

In the [quickstart series](view-applications-portal.md) on application management, you learned how to use Azure AD as the Identity Provider (IdP) for an application. This article goes into more detail about the SAML-based option for single sign-on. 


## Before you begin

Using Azure AD as your Identity Provider (IdP) and configuring single sign-on (SSO) can be simple or complex depending on the application being used. Some applications can be configured with just a few actions. Others require in-depth configuration. To ramp knowledge quickly, walk through the [quickstart series](view-applications-portal.md) on application management. If the application you're adding is simple, then you probably don't need to read this article. If the application you're adding requires custom configuration for SAML-based SSO, then this article is for you.

In the [quickstart series](add-application-portal-setup-sso.md), there's an article on configuring single sign-on. In it, you learn how to access the SAML configuration page for an app. The SAML configuration page includes five sections. These sections are discussed in detail in this article.

> [!IMPORTANT] 
> There are some scenarios where the **Single sign-on** option will not be present in the navigation for an application in **Enterprise applications**. 
>
> If the application was registered using **App registrations** then the single sign-on capability is configured to use OIDC OAuth by default. In this case, the **Single sign-on** option won't show in the navigation under **Enterprise applications**. When you use **App registrations** to add your custom app, you configure options in the manifest file. To learn more about the manifest file, see [Azure Active Directory app manifest](https://docs.microsoft.com/azure/active-directory/develop/reference-app-manifest). To learn more about SSO standards, see [Authentication and authorization using Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/authentication-vs-authorization#authentication-and-authorization-using-microsoft-identity-platform). 
>
> Other scenarios where **Single sign-on** will be missing from the navigation include when an application is hosted in another tenant or if your account does not have the required permissions (Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal). Permissions can also cause a scenario where you can open **Single sign-on** but won't be able to save. To learn more about Azure AD administrative roles, see (https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles).


## Basic SAML configuration

You should get the values from the application vendor. You can manually enter the values or upload a metadata file to extract the value of the fields.

> [!TIP]
> Many apps have already been pre-configured to work with Azure AD. These apps are listed in the gallery of apps that you can browse when you add an app to your Azure AD tenant. The [quickstart series](add-application-portal-setup-sso.md) walks you through the process. For the apps in the gallery you will find detailed, step-by-step, instructions. To access the steps you can click the link on the SAML configuration page for the app as described in the quickstart series or you can browse a list of all app configuration tutorials at [SaaS app configuration tutorials](../saas-apps/tutorial-list.md).

| Basic SAML Configuration setting | SP-Initiated | idP-Initiated | Description |
|:--|:--|:--|:--|
| **Identifier (Entity ID)** | Required for some apps | Required for some apps | Uniquely identifies the application. Azure AD sends the identifier to the application as the Audience parameter of the SAML token. The application is expected to validate it. This value also appears as the Entity ID in any SAML metadata provided by the application. Enter a URL that uses the following pattern: 'https://<subdomain>.contoso.com' *You can find this value as the **Issuer** element in the **AuthnRequest** (SAML request) sent by the application.* |
| **Reply URL** | Required | Required | Specifies where the application expects to receive the SAML token. The reply URL is also referred to as the Assertion Consumer Service (ACS) URL. You can use the additional reply URL fields to specify multiple reply URLs. For example, you might need additional reply URLs for multiple subdomains. Or, for testing purposes you can specify multiple reply URLs (local host and public URLs) at one time. |
| **Sign-on URL** | Required | Don't specify | When a user opens this URL, the service provider redirects to Azure AD to authenticate and sign on the user. Azure AD uses the URL to start the application from Microsoft 365 or Azure AD My Apps. When blank, Azure AD does an IdP-initiated sign-on when a user launches the application from Microsoft 365, Azure AD My Apps, or the Azure AD SSO URL.|
| **Relay State** | Optional | Optional | Specifies to the application where to redirect the user after authentication is completed. Typically the value is a valid URL for the application. However, some applications use this field differently. For more information, ask the application vendor.
| **Logout URL** | Optional | Optional | Used to send the SAML Logout responses back to the application.

## User attributes and claims 

When a user authenticates to the application, Azure AD issues the application a SAML token with information (or claims) about the user that uniquely identifies them. By default, this information includes the user's username, email address, first name, and last name. You might need to customize these claims if, for example, the application requires specific claim values or a **Name** format other than username. 

> [!IMPORTANT]
> Many apps are already pre-configured and in the app gallery and you don't need to worry about setting user and group claims. The [quickstart series](add-application-portal.md) walks you through adding and configuring apps.


The **Unique User Identifier (Name ID)** identifier value is a required claim and is important. The default value is *user.userprincipalname*. The user identifier uniquely identifies each user within the application. For example, if the email address is both the username and the unique identifier, set the value to *user.mail*.

To learn more about customizing SAML claims, see [How to: customize claims issued in the SAML token for enterprise applications](../develop/active-directory-saml-claims-customization.md).

You can add new claims, for details see [Adding application-specific claims](../develop/active-directory-saml-claims-customization.md#adding-application-specific-claims) or to add group claims, see [Configure group claims](../hybrid/how-to-connect-fed-group-claims.md).


> [!NOTE]
> For additional ways to customize the SAML token from Azure AD to your application, see the following resources.
>- To create custom roles via the Azure portal, see [Configure role claims](../develop/active-directory-enterprise-app-role-management.md).
>- To customize the claims via PowerShell, see [Customize claims - PowerShell](../develop/active-directory-claims-mapping.md).
>- To modify the application manifest to configure optional claims for your application, see [Configure optional claims](../develop/active-directory-optional-claims.md).
>- To set token lifetime policies for refresh tokens, access tokens, session tokens, and ID tokens, see [Configure token lifetimes](../develop/active-directory-configurable-token-lifetimes.md). Or, to restrict authentication sessions via Azure AD Conditional Access, see [authentication session management capabilities](https://go.microsoft.com/fwlink/?linkid=2083106).

## SAML signing certificate

Azure AD uses a certificate to sign the SAML tokens it sends to the application. You need this certificate to configure the trust between Azure AD and the application. For details on the certificate format, see the application’s SAML documentation. For more information, see [Manage certificates for federated single sign-on](manage-certificates-for-federated-single-sign-on.md) and [Advanced certificate signing options in the SAML token](certificate-signing-options.md).

> [!IMPORTANT]
> Many apps are already pre-configured and in the app gallery and you don't need to dive into certificates. The [quickstart series](add-application-portal.md) walks you through adding and configuring apps.

From Azure AD, you can download the active certificate in Base64 or Raw format directly from the main **Set up Single Sign-On with SAML** page. Also, you can get the active certificate by downloading the application metadata XML file or by using the App federation metadata URL. To view, create, or download your certificates (active or inactive), follow these steps.

Some common things to check to verify a certificate include: 
   - *The correct expiration date.* You can configure the expiration date for up to three years into the future.
   - *A status of active for the right certificate.* If the status is **Inactive**, change the status to **Active**. To change the status, right-click the certificate's row and select **Make certificate active**.
   - *The correct signing option and algorithm.*
   - *The correct notification email address(es).* When the active certificate is near the expiration date, Azure AD sends a notification to the email address configured in this field.

Sometimes you might need to download the certificate. Be careful where you save it though! To download the certificate, select one of the options for Base64 format, Raw format, or Federation Metadata XML. Azure AD also provides the **App Federation Metadata Url** where you can access the metadata specific to the application in the format `https://login.microsoftonline.com/<Directory ID>/federationmetadata/2007-06/federationmetadata.xml?appid=<Application ID>`.

To make certificate changes, select the Edit button. There are several things you can do on the **SAML Signing Certificate** page:
   - Create a new certificate: select **New Certificate**, select the **Expiration Date**, and then select **Save**. To activate the certificate, select the context menu (**...**) and select **Make certificate active**.
   - Upload a certificate with private key and pfx credentials: select **Import Certificate** and browse to the certificate. Enter the **PFX Password**, and then select **Add**.  
   - Configure advanced certificate signing. For more information on these options, see [Advanced certificate signing options](certificate-signing-options.md).
   - Notify additional people when the active certificate is near its expiration date: enter the email addresses in the **Notification email addresses** fields.

## Set up the application to use Azure AD

The **Set up \<applicationName>** section lists the values that need to be configured in the application so it will use Azure AD as a SAML identity provider. You set the values on the configuration page on the applications website. For example, if you are configuring GitHub then you would go to the github.com site and set the values. If the application is already pre-configured and in the Azure AD gallery, then you will find a link to **View step-by-step instructions**. Otherwise, you will need to find the documentation for the application you are configuring. 

The **Login URL** and **Logout URL** values both resolve to the same endpoint, which is the SAML request-handling endpoint for Azure AD tenant. 

The **Azure AD Identifier** is the value of the **Issuer** in the SAML token issued to the application.

## Test single sign-on

Once you've configured your application to use Azure AD as a SAML-based identity provider, you can test the settings to see if single sign-on works for your account. 

Select **Test** and then choose to test with the currently signed in user or as someone else. 

If sign-on is successful, you're ready to assign users and groups to your SAML application. Congratulations!

If an error message appears, complete the following steps:

1. Copy and paste the specifics into the **What does the error look like?** box.

    ![Get resolution guidance](media/configure-single-sign-on-non-gallery-applications/error-guidance.png)

2. Select **Get resolution guidance**. The root cause and resolution guidance appear.  In this example, the user wasn't assigned to the application.

3. Read the resolution guidance and then attempt to fix the issue.

4. Run the test again until it completes successfully.

For more information, see [Debug SAML-based single sign-on to applications in Azure Active Directory](../azuread-dev/howto-v1-debug-saml-sso-issues.md).


## Next steps

- [Quickstart Series on Application Management](view-applications-portal.md)
- [Assign users or groups to the application](methods-for-assigning-users-and-groups.md)
- [Configure automatic user account provisioning](../app-provisioning/configure-automatic-user-provisioning-portal.md)
- [Single Sign-On SAML protocol](../develop/single-sign-on-saml-protocol.md)
