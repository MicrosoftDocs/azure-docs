---
title: How to configure federated single sign-on for an Azure AD Gallery application | Microsoft Docs
description: How to configure federated single sign-on for an existing Azure AD Gallery application and use tutorials to get going quickly
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG

ms.assetid: 
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 07/11/2017
ms.author: mimart

ms.collection: M365-identity-device-management
---

# How to configure federated single sign-on for an Azure AD Gallery application

All applications in the Azure AD gallery enabled with Enterprise single sign-on capability has a step-by-step tutorial available. You can access the [List of tutorials on how to integrate SaaS apps with Azure Active Directory](https://azure.microsoft.com/documentation/articles/active-directory-saas-tutorial-list/) for detailed step-by-step guidance.

## Overview of steps required
To configure an application from the Azure AD gallery you need to:

-   [Add an application from the Azure AD gallery](#add-an-application-from-the-azure-ad-gallery)

-   [Configure the application’s metadata values in Azure AD (Sign on URL, Identifier, Reply URL)](#configure-single-sign-on-for-an-application-from-the-azure-ad-gallery)

-   [Select User Identifier and add user attributes to be sent to the application](#select-user-identifier-and-add-user-attributes-to-be-sent-to-the-application)

-   [Retrieve Azure AD metadata and certificate](#download-the-azure-ad-metadata-or-certificate)

-   [Configure Azure AD metadata values in the application (Sign on URL, Issuer, Logout URL and certificate)](#configure-single-sign-on-for-an-application-from-the-azure-ad-gallery)

-   [Assign users to the application](#assign-users-to-the-application)

## Add an application from the Azure AD gallery

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

After a short period of time, you be able to see the application’s configuration pane.

## Configure single sign-on for an application from the Azure AD gallery

To configure single sign-on for an application, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin**.

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6. Select the application you want to configure single sign-on.

7. Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8. Select **SAML-based Sign-on** from the **Mode** dropdown.

9. Enter the required values in **Domain and URLs.** You should get these values from the application vendor.

   1. To configure the application as SP-initiated SSO, the Sign-on URL it’s a required value. For some applications, the Identifier is also a required value.

   2. To configure the application as IdP-initiated SSO, the Reply URL it’s a required value. For some applications, the Identifier is also a required value.

10. **Optional:** click **Show advanced URL settings** if you want to see the non-required values.

11. In the **User attributes**, select the unique identifier for your users in the **User Identifier** dropdown.

12. **Optional:** click **View and edit all other user attributes** to edit the attributes to be sent to the application in the SAML token when users sign in.

    To add an attribute:
   
    1. click **Add attribute**. Enter the **Name** and the select the **Value** from the dropdown.

    1. Click **Save.** You see the new attribute in the table.

13. click **Configure &lt;application name&gt;** to access documentation on how to configure single sign-on in the application. Also, you have the metadata URLs and certificate required to setup SSO with the application.

14. Click **Save** to save the configuration.

15. Assign users to the application.

## Select User Identifier and add user attributes to be sent to the application

To select the User Identifier or add user attributes, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6. Select the application you have configured single sign-on.

7. Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8. Under the **User attributes** section, select the unique identifier for your users in the **User Identifier** dropdown. The selected option needs to match the expected value in the application to authenticate the user.

   >[!NOTE] 
   >Azure AD select the format for the NameID attribute (User Identifier) based on the value selected or the format requested by the application in the SAML AuthRequest. For more information visit the article [Single Sign-On SAML protocol](https://docs.microsoft.com/azure/active-directory/develop/active-directory-single-sign-on-protocol-reference#authnrequest) under the section NameIDPolicy.
   >
   >

9. To add user attributes, click **View and edit all other user attributes** to edit the attributes to be sent to the application in the SAML token when users sign in.

   To add an attribute:
  
   1. click **Add attribute**. Enter the **Name** and the select the **Value** from the dropdown.

   2. Click **Save**. You see the new attribute in the table.

## Download the Azure AD metadata or certificate

To download the application metadata or certificate from Azure AD, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   *  If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications**.

6. Select the application you have configured single sign-on.

7. Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8. Go to **SAML Signing Certificate** section, then click **Download** column value. Depending on what the application requires configuring single sign-on, you see either the option to download the Metadata XML or the Certificate.

Azure AD also provides a URL to get the metadata. Follow this pattern to get the metadata URL specific to the application: `https://login.microsoftonline.com/<Directory ID>/federationmetadata/2007-06/federationmetadata.xml?appid=<Application ID>`

## Assign users to the application

To assign one or more users to an application directly, follow the steps below:

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

## Customizing the SAML claims sent to an application

To learn how to customize the SAML attribute claims sent to your application, see [Claims mapping in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-claims-mapping) for more information.

## Next steps
[Provide single sign-on to your apps with Application Proxy](application-proxy-configure-single-sign-on-with-kcd.md)



