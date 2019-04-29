---
title: Single sign-on - non-gallery applications - Azure Active Directory | Microsoft Docs
description: Configure single sign-on (SSO) to non-gallery applications in Azure Active Directory (Azure AD)
services: active-directory
author: CelesteDG
manager: mtillman
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: article
ms.workload: identity
ms.date: 04/22/2019
ms.author: celested
ms.reviewer: asmalser,luleon
ms.collection: M365-identity-device-management
---

# Configure single sign-on to non-gallery applications in Azure Active Directory

This article is about a feature that enables administrators to configure single sign-on to applications not present in the Azure Active Directory (Azure AD) app gallery *without writing code*. If you are instead looking for developer guidance on how to integrate custom apps with Azure AD through code, see [Authentication in Microsoft identity platform](../develop/authentication-scenarios.md).

The Azure AD application gallery provides a listing of applications that are known to support a form of single sign-on with Azure AD, as described in [Single sign-on to applications](what-is-single-sign-on.md). Once you (as an IT specialist or system integrator in your organization) have found the application you want to connect, you can get started by following the step-by-step instructions presented in the Azure portal to enable single sign-on.

The following capabilities are also available, according to your license agreement. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/active-directory/).

- Self-service integration of any application that supports [Security Assertion Markup Language (SAML) 2.0](https://wikipedia.org/wiki/SAML_2.0) identity providers, initiated by a Security Provider (SP) or an Identity Provider (IdP)
- Self-service integration of any web application that has an HTML-based sign-in page using [password-based SSO](what-is-single-sign-on.md#password-based-sso)
- Self-service connection of applications that use the [System for Cross-Domain Identity Management (SCIM) protocol for user provisioning](use-scim-to-provision-users-and-groups.md)
- Ability to add links to any application in the [Office 365 app launcher](https://www.microsoft.com/microsoft-365/blog/2014/10/16/organize-office-365-new-app-launcher-2/) or the [Azure AD access panel](what-is-single-sign-on.md#linked-sso)

This can include not only software as a service (SaaS) applications that you use but haven't been onboarded to the Azure AD application gallery yet, but third-party web applications that your organization has deployed to servers you control, either in the cloud or on-premises.

These capabilities, also known as *app integration templates*, provide standards-based connection points for apps that support SAML, SCIM, or forms-based authentication, and include flexible options and settings for compatibility with a broad number of applications.

## Adding an unlisted application

To connect an unlisted application using an app integration template, do the following:

1. Sign in to the [Azure Active Directory portal](https://aad.portal.azure.com/) using your Azure Active Directory administrator account.
2. Select **Enterprise Applications** > **New application**.
3. (Optional but recommended) In the **Add from the gallery** search box, type the display name of the application. If the application appears in the search results, select it and skip the rest of this procedure.
4. Select **Non-gallery application**. The Add your own application page appears.

   ![Add application](./media/configure-single-sign-on-non-gallery-applications/add-your-own-application.png)
5. Type the display name for your new application.
6. Select **Add**.

Adding an application this way provides a similar experience to the one available for pre-integrated applications. To start, select **Single sign-on** from the application’s sidebar. The next page, **Select a single sign-on method**, presents the options for configuring single sign-on: **SAML**, **Password-based**, and **Linked**.

![Select a single sign-on method](./media/configure-single-sign-on-non-gallery-applications/select-a-single-sign-on-method.png)

The options are described in the next sections of this article.

## SAML-based single sign-on

Select the **SAML** option to configure SAML-based authentication for the application. (This requires that the application support SAML 2.0.) The **Set up Single Sign-On with SAML** page appears.

![Set up single sign-on with SAML](./media/configure-single-sign-on-non-gallery-applications/set-up-single-sign-on-with-saml.png)

This page is organized into five different headings:

| Heading number | Heading name | For a summary of this heading, see: |
| --- | --- | --- |
| 1 | **Basic SAML Configuration** | [Enter basic SAML configuration](#enter-basic-saml-configuration) |
| 2 | **User Attributes & Claims** | [Review or customize the claims issued in the SAML token](#review-or-customize-the-claims-issued-in-the-saml-token) |
| 3 | **SAML Signing Certificate** | [Review certificate expiration data, status, and email notification](#review-certificate-expiration-data-status-and-email-notification) |
| 4 | **Set up \<application name>** | [Set up target application](#set-up-target-application) |
| 5 | **Test single sign-on with \<application name>** | [Test the SAML application](#test-the-saml-application) |

You should collect information on how to use the SAML capabilities of the application before continuing. Complete the following sections to configure single sign-on between the application and Azure AD.

### Enter basic SAML configuration

To set up Azure AD, go to the **Basic SAML Configuration** heading and select its **Edit** icon (a pencil). You can manually enter the values or upload a metadata file to extract the value of the fields.

![Basic SAML configuration](./media/configure-single-sign-on-non-gallery-applications/basic-saml-configuration.png)

The following two fields are required:

- **Identifier**. This value should uniquely identify the application for which single sign-on is being configured. You can find this value as the **Issuer** element in the **AuthnRequest** (SAML request) sent by the application. This value also appears as the **Entity ID** in any SAML metadata provided by the application. Check the application’s SAML documentation for details on what its **Entity ID** or **Audience** value is.

  The following is an example of how the **Identifier** or **Issuer** appears in the SAML request sent by the application to Azure AD:

  ```xml
  <samlp:AuthnRequest
  xmlns="urn:oasis:names:tc:SAML:2.0:metadata"
  ID="id6c1c178c166d486687be4aaf5e482730"
  Version="2.0" IssueInstant="2013-03-18T03:28:54.1839884Z"
  xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">
    <Issuer xmlns="urn:oasis:names:tc:SAML:2.0:assertion">https://www.contoso.com</Issuer>
  </samlp:AuthnRequest>
  ```

- **Reply URL**. The reply URL is where the application expects to receive the SAML token. This is also referred to as the assertion consumer service (ACS) URL. Check the application’s SAML documentation for details on what its SAML token reply URL or ACS URL is.

  To configure multiple reply URLs, you can use the following PowerShell script.

  ```powershell
  $sp = Get-AzureADServicePrincipal -SearchString "<Exact app name>"
  $app = Get-AzureADApplication -SearchString "<Exact app name>"
  $urllist = New-Object "System.Collections.Generic.List[String]"
  $urllist.Add("<reply URL 1>")
  $urllist.Add("<reply URL 2>")
  $urllist.Add("<reply URL 3>")
  Set-AzureADApplication -ObjectId $app.ObjectId -ReplyUrls $urllist
  Set-AzureADServicePrincipal -ObjectId $sp.ObjectId -ReplyUrls $urllist
  ```

The following three fields are optional:

- **Sign On URL (SP-initiated only)**. This value indicates where the user goes to sign in to this application. If the application is configured to perform service provider-initiated single sign-on, then when a user navigates to this URL, the service provider will do the necessary redirection to Azure AD to authenticate and sign in the user. If this field is populated, then Azure AD will use this URL to launch the application from Office 365 and the Azure AD Access Panel. If this field is omitted, then Azure AD will instead perform identity provider-initiated sign-on when the application is launched from Office 365, the Azure AD Access Panel, or the Azure AD single sign-on URL (which can be copied from the Dashboard page).

- **Relay State**. You can specify a relay state in SAML to instruct the application where to redirect users after authentication is completed. The value is typically a URL or URL path that takes users to a specific location within the application.

- **Logout URL**. This value is used to send the SAML logout response back to the application.

For more information, see [SAML 2.0 authentication requests and responses that Azure Active Directory (Azure AD) supports](../develop/single-sign-on-saml-protocol.md).

### Review or customize the claims issued in the SAML token

When a user authenticates to the application, Azure AD will issue a SAML token to the application that contains information (or claims) about the user that uniquely identifies them. By default this includes the user's username, email address, first name, and last name.

To view or edit the claims sent in the SAML token to the application, go to the **User Attributes & Claims** heading and select the **Edit** icon. The **User Attributes & Claims** page appears.

![User attributes and claims](./media/configure-single-sign-on-non-gallery-applications/user-attributes-and-claims.png)

There are two reasons why you might need to edit the claims issued in the SAML token:

- The application has been written to require a different set of claim URIs or claim values.
- Your application has been deployed in a way that requires the **Name identifier value** claim to be something other than the username (also known as the user principal name) stored in Azure Active Directory.

For more information, see [Customizing claims issued in the SAML token for enterprise applications](../develop/active-directory-saml-claims-customization.md).

### Review certificate expiration data, status, and email notification

When you create a gallery or a non-gallery application, Azure AD will create an application-specific certificate with an expiration date of 3 years from the date of creation. You need this certificate to set up the trust between Azure AD and the application. For details on the certificate format, see the application’s SAML documentation.

From Azure AD, you can download the active certificate in Base64 or Raw format directly from the main **Set up Single Sign-On with SAML** page. In addition, you can get the active certificate by downloading the application metadata XML file or by using the App federation metadata URL.

To view, create, or download your certificates (active or inactive), go to the **SAML Signing Certificate** heading and select the **Edit** icon. The **SAML Signing Certificate** appears.

![SAML signing certificate](./media/configure-single-sign-on-non-gallery-applications/saml-signing-certificate.png)

Verify the certificate has:

- The desired expiration date. You can configure the expiration date for at most three years.
- A status of active for the desired certificate. If the status is **Inactive**, change the status to **Active**. To change the status, right-click the desired certificate's row and select **Make certificate active**.
- The correct signing option and algorithm.
- The correct notification email address(es). When the active certificate is near the expiration date, Azure AD will send a notification to the email address configured in this field.  

For more information, see [Manage certificates for federated single sign-on in Azure Active Directory](manage-certificates-for-federated-single-sign-on.md) and [Certificate signing options](certificate-signing-options.md).

### Set up target application

To configure the application for single sign-on, locate the application's documentation. To find the documentation, go to the **Set up \<application name>** heading, and then select **View step-by-step instructions**. The documentation appears in the **Configure sign-on** page, and it will guide you in filling out the **Login URL**, **Azure AD Identifier**, and **Logout URL** values in the **Set up \<application name>** heading.

The required values vary according to the application. For details, see the application's SAML documentation. The **Login URL** and **Logout URL** values both resolve to the same endpoint, which is the SAML request-handling endpoint for your instance of Azure AD. The **Azure AD Identifier** is the value that appears as the **Issuer** in the SAML token that is issued to the application.

### Assign users and groups to your SAML application

Once your application has been configured to use Azure AD as a SAML-based identity provider, it is almost ready to test. As a security control, Azure AD won't issue a token allowing a user to sign into the application unless Azure AD has granted access to the user. Users may be granted access directly or through a group membership.

To assign a new user or group to your application:

1. In the application sidebar, and select **Users and groups**. The **<application name> - Users and groups** page appears, which shows the current list of assigned users and groups.
2. Select **Add Users**. The **Add Assignments** page appears.
3. Select **Users and groups**. The **Users and groups** page appears, showing a list of available users and groups.
4. Type or scroll to find the user or group you wish to assign from the list.
5. Select each user or group that you want to add, and then select the **Select** button. The **Users and groups** page disappears.
6. In the **Add Assignments** page, select **Assign**. The **<application name> - Users and groups** page appears with the additional users shown in the list.

   ![Application users and groups](./media/configure-single-sign-on-non-gallery-applications/application-users-and-groups.png)

From this list, you can remove a user, edit their role, or update their credentials (username and password) so that the user can authenticate to the application from within the user's Access Panel. You can edit or remove multiple users or groups at a time.

Assigning a user will allow Azure AD to issue a token for the user. It also causes a tile for this application to appear in the user's Access Panel. An application tile will also appear in the Office 365 application launcher if the user is using Office 365.

> [!NOTE]
> You can upload a tile logo for the application using the **Upload Logo** button on the **Configure** tab for the application.

### Test the SAML application

Before testing the SAML application, you must have set up the application with Azure AD and assigned users or groups to the application, as described in the previous sections. To test the SAML application, return to the **SAML-based sign-on** page by selecting **Single sign-on**. (If a different single sign-on method was in effect, select **Change single sign-on modes** > **SAML** as well.) Then in the **Test single sign-on with \<application name>** heading, select **Test**. For more information, see [How to debug SAML-based single sign-on to applications in Azure Active Directory](../develop/howto-v1-debug-saml-sso-issues.md).

## Password single sign-on

Select this option to configure [password-based single sign-on](what-is-single-sign-on.md) for a web application that has an HTML sign-in page. Password-based SSO, also referred to as password vaulting, enables you to manage user access and passwords to web applications that don't support identity federation. It's also useful for scenarios where several users need to share a single account, such as to your organization's social media app accounts.

When you select **Password-based**, you will be prompted to enter the URL of the application's web-based sign-in page.

![Password-based single sign-on](./media/configure-single-sign-on-non-gallery-applications/password-based-sso.png)

Then do the following steps:

1. Enter the URL. This string must be the page that includes the username input field.
2. Select **Save**. Azure AD tries to parse the sign-in page for a username input and a password input.
3. If Azure AD's parsing attempt fails, select **Configure Password Single Sign-on Settings** to display the **Configure sign-on** page. (If the attempt succeeds, you can disregard the rest of this procedure.)
4. Select **Manually detect sign-in fields**. Additional instructions describing the manual detection of sign-in fields are shown.

   ![Manual configuration of password-based single sign-on](./media/configure-single-sign-on-non-gallery-applications/password-configure-sign-on.png)
5. **Capture sign-in fields**. A capture status page opens in a new tab, showing the message **metadata capture is currently in progress**.
6. If the **Access Panel Extension Required** box appears in a new tab, select **Install Now** to install the **My Apps Secure Sign-in Extension** browser extension (requires Microsoft Edge, Chrome, or Firefox). Then install, launch, and enable the extension, and refresh the capture status page.

   The browser extension then opens another tab that displays the entered URL.
7. In the tab with the entered URL, proceed through the sign-in process. Fill in the username and password fields, and try to sign in. (You don't have to provide the correct password.)

   A prompt asks you to save the captured sign-in fields.
8. Select **OK**. The tab you were using to enter username and password information closes, the capture status page is updated with the message **Metadata has been updated for the application**, and then that browser tab closes.
9. In the Azure AD **Configure sign-on** page, select **Ok, I was able to sign-in to the app successfully**, and select **OK**.

Once the sign-in page is captured, users and groups may be assigned and credential policies can be set just like regular [password SSO apps](what-is-single-sign-on.md).

> [!NOTE]
> You can upload a tile logo for the application using the **Upload Logo** button on the **Configure** tab for the application.

## Existing single sign-on

Select this option to add a link to an application to your organization's Azure AD Access Panel or Office 365 portal. You can use this method to add links to custom web apps that currently use Active Directory Federation Services (or other federation service) instead of Azure AD for authentication. Or, you can add deep links to specific SharePoint pages or other web pages that you just want to appear on your user's Access Panels.

After you select **Linked**, you will be prompted to enter the URL of the application to link to. Type the URL and select **Save**. Users and groups may be assigned to the application, which causes the application to appear in the [Office 365 app launcher](https://blogs.office.com/2014/10/16/organize-office-365-new-app-launcher-2/) or the [Azure AD access panel](end-user-experiences.md) for those users.

> [!NOTE]
> You can upload a tile logo for the application using the **Upload Logo** button on the **Configure** tab for the application.

## Related articles

- [How to customize claims issued in the SAML token for pre-integrated apps](../develop/active-directory-saml-claims-customization.md)
- [Troubleshooting SAML-based single sign-on](../develop/howto-v1-debug-saml-sso-issues.md)
