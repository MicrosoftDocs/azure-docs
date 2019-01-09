---
title: Problems signing in to an application from the access panel | Microsoft Docs
description: How to troubleshoot issues accessing an application from the Microsoft Azure AD Access Panel at myapps.microsoft.com
services: active-directory
documentationcenter: ''
author: barbkess
manager: mtillman

ms.assetid: 
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/11/2017
ms.author: barbkess
ms.reviewer: japere
---

# Problems signing in to an application from the access panel

The Access Panel is a web-based portal which enables a user with a work or school account in Azure Active Directory (Azure AD) to view and start cloud-based applications that the Azure AD administrator has granted them access to. 

These applications are configured on behalf of the user in the Azure AD portal. The application must be configured properly and assigned to the user or a group the user is a member of to see the application in the Access Panel.

The type of apps a user may be seeing fall in the following categories:

-   Office 365 Applications

-   Microsoft and third-party applications configured with federation-based SSO

-   Password-based SSO applications

-   Applications with existing SSO solutions

## General issues to check first

-   Make sure your using a **browser** that meets the minimum requirements for the Access Panel.

-   Make sure the user’s browser has added the URL of the application to its **trusted sites**.

-   Make sure to check the application is **configured** correctly.

-   Make sure the user’s account is **enabled** for sign-ins.

-   Make sure the user’s account is **not locked out.**

-   Make sure the user’s **password is not expired or forgotten.**

-   Make sure **Multi-Factor Authentication** is not blocking user access.

-   Make sure a **Conditional Access policy** or **Identity Protection** policy is not blocking user access.

-   Make sure that a user’s **authentication contact info** is up to date to allow Multi-Factor Authentication or Conditional Access policies to be enforced.

-   Make sure to also try clearing your browser’s cookies and trying to sign in again.

## Meeting browser requirements for the Access Panel

The Access Panel requires a browser that supports JavaScript and has CSS enabled. To use password-based single sign-on (SSO) in the Access Panel, the Access Panel extension must be installed in the user’s browser. This extension is downloaded automatically when a user selects an application that is configured for password-based SSO.

For password-based SSO, the end user’s browsers can be:

-   Internet Explorer 8, 9, 10, 11 -- on Windows 7 or later

-   Edge on Windows 10 Anniversary Edition or later

-   Chrome -- on Windows 7 or later, and on MacOS X or later

-   Firefox 26.0 or later -- on Windows XP SP2 or later, and on Mac OS X 10.6 or later

## How to install the Access Panel Browser extension

To install the Access Panel Browser extension, follow the steps below:

1.  Open the [Access Panel](https://myapps.microsoft.com) in one of the supported browsers and sign in as a **user** in your Azure AD.

2.  Click a **password-SSO application** in the Access Panel.

3.  In the prompt asking to install the software, select **Install Now**.

4.  Based on your browser you are directed to the download link. **Add** the extension to your browser.

5.  If your browser asks, select to either **Enable** or **Allow** the extension.

6.  Once installed, **restart** your browser session.

7.  Sign in into the Access Panel and see if you can **launch** your password-SSO applications

You may also download the extension for Chrome and Edge from the direct links below:

-   [Chrome Access Panel Extension](https://chrome.google.com/webstore/detail/access-panel-extension/ggjhpefgjjfobnfoldnjipclpcfbgbhl)

-   [Edge Access Panel Extension](https://www.microsoft.com/store/apps/9pc9sckkzk84)

## How to configure federated single sign-on for an Azure AD gallery application

All application in the Azure AD gallery enabled with Enterprise Single Sign-On capability has a step-by-step tutorial available. You can access the [List of tutorials on how to integrate SaaS apps with Azure Active Directory](https://azure.microsoft.com/documentation/articles/active-directory-saas-tutorial-list/) for a detail step-by-step guidance.

To configure an application from the Azure AD gallery you need to:

-   [Add an application from the Azure AD gallery](#add-an-application)

-   [Configure the application’s metadata values in Azure AD (Sign on URL, Identifier, Reply URL)](#configure-single-sign-on-for-an-application-from-the-azure-ad-gallery)

-   [Select User Identifier and add user attributes to be sent to the application](#select-user-identifier-and-add-user-attributes-to-be-sent-to-the-application)

-   [Retrieve Azure AD metadata and certificate](#download-the-azure-ad-metadata-or-certificate)

-   [Configure Azure AD metadata values in the application (Sign on URL, Issuer, Logout URL and certificate)](#configure-single-sign-on-for-an-application-from-the-azure-ad-gallery)

-   [Assign users to the application](#assign-users-to-the-application)

### Add an application from the Azure AD gallery

To add an application from the Azure AD Gallery, follow the steps below:

1.  Open the [Azure portal](https://portal.azure.com) and sign in as a **Global Administrator** or **Co-admin**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click the **Add** button at the top-right corner on the **Enterprise Applications** pane.

6.  In the **Enter a name** textbox from the **Add from the gallery** section, type the name of the application.

7.  Select the application you want to configure for single sign-on.

8.  Before adding the application, you can change its name from the **Name** textbox.

9.  Click **Add** button, to add the application.

After a short period, you can see the application’s configuration pane.

### Configure single sign-on for an application from the Azure AD gallery

To configure single sign-on for an application, follow the steps below:

1.  <span id="_Hlk477187909" class="anchor"><span id="_Hlk477001983" class="anchor"></span></span>Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to configure single sign-on.

7.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8.  Select **SAML-based Sign-on** from the **Mode** dropdown.

9.  Enter the required values in **Domain and URLs.** You should get these values from the application vendor.

   1. To configure the application as SP-initiated SSO, the Sign-on URL is a required value. For some applications, the Identifier is also a required value.

   2. To configure the application as IdP-initiated SSO, the Reply URL is a required value. For some applications, the Identifier is also a required value.

10. **Optional:** click **Show advanced URL settings** if you want to see the non-required values.

11. In the **User attributes**, select the unique identifier for your users in the **User Identifier** dropdown.

12. **Optional:** click **View and edit all other user attributes** to edit the attributes to be sent to the application in the SAML token when users sign in.

   To add an attribute:

   1. click **Add attribute**. Enter the **Name** and the select the **Value** from the dropdown.

   2. Click **Save.** You see the new attribute in the table.

13. click **Configure &lt;application name&gt;** to access documentation on how to configure single sign-on in the application. Also, you have the metadata URLs and certificate required to setup SSO with the application.

14. Click **Save** to save the configuration.

15. Assign users to the application.

### Select User Identifier and add user attributes to be sent to the application

To select the User Identifier or add user attributes, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want to show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you have configured single sign-on.

7.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8.  Under the **User attributes** section, select the unique identifier for your users in the **User Identifier** dropdown. The selected option needs to match the expected value in the application to authenticate the user.

    >[!NOTE]
    >Azure AD select the format for the NameID attribute (User Identifier) based on the value selected or the format requested by the application in the SAML AuthRequest. For more information visit the article [Single Sign-On SAML protocol](https://docs.microsoft.com/azure/active-directory/develop/active-directory-single-sign-on-protocol-reference#authnrequest) under the section NameIDPolicy.
    >
    >

9.  To add user attributes, click **View and edit all other user attributes** to edit the attributes to be sent to the application in the SAML token when users sign in.

   To add an attribute:

   1. click **Add attribute**. Enter the **Name** and the select the **Value** from the dropdown.

   2. Click **Save.** You see the new attribute in the table.

### Download the Azure AD metadata or certificate

To download the application metadata or certificate from Azure AD, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you have configured single sign-on.

7.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8.  Go to **SAML Signing Certificate** section, then click **Download** column value. Depending on what the application requires configuring single sign-on, you see either the option to download the Metadata XML or the Certificate.

    Azure AD doesn’t provide a URL to get the metadata. The metadata can only be retrieved as an XML file.

## How to configure federated single sign-on for a non-gallery application

To configure a non-gallery application, you need to have Azure AD premium and the application supports SAML 2.0. For more information about Azure AD versions, visit [Azure AD pricing](https://azure.microsoft.com/pricing/details/active-directory/).

-   [Configure the application’s metadata values in Azure AD (Sign on URL, Identifier, Reply URL)](#configuring-single-sign-on)

-   [Select User Identifier and add user attributes to be sent to the application](#select-user-identifier-and-add-user-attributes-to-be-sent-to-the-application)

-   [Retrieve Azure AD metadata and certificate](#download-the-azure-ad-metadata-or-certificate)

-   [Configure Azure AD metadata values in the application (Sign on URL, Issuer, Logout URL and certificate)](#configuring-single-sign-on)

### Configure the application’s metadata values in Azure AD (Sign on URL, Identifier, Reply URL)

To configure single sign-on for an application that is not in the Azure AD gallery, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click the **Add** button at the top-right corner on the **Enterprise Applications** pane.

6.  click **Non-gallery application** in the **Add your own app** section.

7.  Enter the name of the application in the **Name** textbox.

8.  Click **Add** button, to add the application.

9.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

10. Select **SAML-based Sign-on** in the **Mode** dropdown

11. Enter the required values in **Domain and URLs.** You should get these values from the application vendor.

  1. To configure the application as IdP-initiated SSO, enter the Reply URL and the Identifier.

  2. **Optional:** To configure the application as SP-initiated SSO, the Sign-on URL is a required value.

12. In the **User attributes**, select the unique identifier for your users in the **User Identifier** dropdown.

13. **Optional:** click **View and edit all other user attributes** to edit the attributes to be sent to the application in the SAML token when users sign in.

   To add an attribute:

   1. click **Add attribute**. Enter the **Name** and the select the **Value** from the dropdown.

   2. Click **Save.** You see the new attribute in the table.

14. click **Configure &lt;application name&gt;** to access documentation on how to configure single sign-on in the application. Also, you have Azure AD URLs and certificate required for the application.

### Select User Identifier and add user attributes to be sent to the application

To select the User Identifier or add user attributes, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you have configured single sign-on.

7.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8.  Under the **User attributes** section, select the unique identifier for your users in the **User Identifier** dropdown. The selected option needs to match the expected value in the application to authenticate the user.

   >[!NOTE]
   >Azure AD select the format for the NameID attribute (User Identifier) based on the value selected or the format requested by the application in the SAML AuthRequest. For more information visit the article [Single Sign-On SAML protocol](https://docs.microsoft.com/azure/active-directory/develop/active-directory-single-sign-on-protocol-reference#authnrequest) under the section NameIDPolicy.
   >
   >

9.  To add user attributes, click **View and edit all other user attributes** to edit the attributes to be sent to the application in the SAML token when users sign in.

   To add an attribute:

   1.click **Add attribute**. Enter the **Name** and the select the **Value** from the dropdown.

   2 Click **Save.** You see the new attribute in the table.

### Download the Azure AD metadata or certificate

To download the application metadata or certificate from Azure AD, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you have configured single sign-on.

7.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8.  Go to **SAML Signing Certificate** section, then click **Download** column value. Depending on what the application requires configuring single sign-on, you see either the option to download the Metadata XML or the Certificate.

    Azure AD doesn’t provide a URL to get the metadata. The metadata can only be retrieved as an XML file.

## How to configure password single sign-on for an Azure AD gallery application

To configure an application from the Azure AD gallery you need to:

-   [Add an application from the Azure AD gallery](#add-an-application)

-   [Configure the application for password single sign-on](#configure-the-application)

### Add an application from the Azure AD gallery

To add an application from the Azure AD Gallery, follow the steps below:

1.  Open the [Azure portal](https://portal.azure.com) and sign in as a **Global Administrator** or **Co-admin**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click the **Add** button at the top-right corner on the **Enterprise Applications** pane.

6.  In the **Enter a name** textbox from the **Add from the gallery** section, type the name of the application

7.  Select the application you want to configure for single sign-on

8.  Before adding the application, you can change its name from the **Name** textbox.

9.  Click **Add** button, to add the application.

After a short period, you can see the application’s configuration pane.

### Configure the application for password single sign-on

To configure single sign-on for an application, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

 * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to configure single sign-on

7.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8.  Select the mode **Password-based Sign-on.**

9.  Assign users to the application.

10. Additionally, you can also provide credentials on behalf of the user by selecting the rows of the users and clicking on **Update Credentials** and entering the username and password on behalf of the users. Otherwise, users be prompted to enter the credentials themselves upon launch.

## How to configure password single sign-on for a non-gallery application

To configure an application from the Azure AD gallery you need to:

-   [Add a non-gallery application](#add-a-non-gallery-application)

-   [Configure the application for password single sign-on](#configure-the-application-for-password-single-sign-on)

### Add a non-gallery application

To add an application from the Azure AD Gallery, follow the steps below:

1.  Open the [Azure portal](https://portal.azure.com) and sign in as a **Global Administrator** or **Co-admin**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click the **Add** button at the top-right corner on the **Enterprise Applications** pane.

6.  click **Non-gallery application.**

7.  Enter the name of your application in the **Name** textbox. Select **Add.**

After a short period, you be able to see the application’s configuration pane.

### Configure the application for password single sign-on

To configure single sign-on for an application, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

 * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to configure single sign-on.

7.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8.  Select the mode **Password-based Sign-on.**

9.  Enter the **Sign-on URL**. This is the URL where users enter their username and password to sign in. Ensure the sign-in fields are visible at the URL.

10. Assign users to the application.

11. Additionally, you can also provide credentials on behalf of the user by selecting the rows of the users and clicking on **Update Credentials** and entering the username and password on behalf of the users. Otherwise, users be prompted to enter the credentials themselves upon launch.

## How to assign a user to an application directly

To assign one or more users to an application directly, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

  * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to assign a user to from the list.

7.  Once the application loads, click **Users and Groups** from the application’s left-hand navigation menu.

8.  Click the **Add** button on top of the **Users and Groups** list to open the **Add Assignment** pane.

9.  click the **Users and groups** selector from the **Add Assignment** pane.

10. Type in the **full name** or **email address** of the user you are interested in assigning into the **Search by name or email address** search box.

11. Hover over the **user** in the list to reveal a **checkbox**. Click the checkbox next to the user’s profile photo or logo to add your user to the **Selected** list.

12. **Optional:** If you would like to **add more than one user**, type in another **full name** or **email address** into the **Search by name or email address** search box, and click the checkbox to add this user to the **Selected** list.

13. When you are finished selecting users, click the **Select** button to add them to the list of users and groups to be assigned to the application.

14. **Optional:** click the **Select Role** selector in the **Add Assignment** pane to select a role to assign to the users you have selected.

15. Click the **Assign** button to assign the application to the selected users.

After a short period, the users you have selected be able to launch these applications in the Access Panel.

## If these troubleshooting steps do not the resolve the issue

open a support ticket with the following information if available:

-   Correlation error ID

-   UPN (user email address)

-   TenantID

-   Browser type

-   Time zone and time/timeframe during error occurs

-   Fiddler traces

## Next steps
[Provide single sign-on to your apps with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md)

