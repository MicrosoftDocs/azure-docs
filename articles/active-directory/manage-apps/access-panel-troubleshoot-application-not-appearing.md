---
title: An assigned application is not appearing on the access panel | Microsoft Docs
description: Troubleshoot why an application is not appearing in the Access Panel 
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
ms.date: 09/09/2018
ms.author: kenwith
ms.reviwer: japere
ms.collection: M365-identity-device-management
---

# An assigned application is not appearing on the access panel

The Access Panel is a web-based portal, which enables a user with a work or school account in Azure Active Directory (Azure AD) to view and start cloud-based applications that the Azure AD administrator has granted them access to. These applications are configured on behalf of the user in the Azure AD portal. The application must be configured properly and assigned to the user or a group the user is a member of to see the application in the Access Panel.

The type of apps a user may be seeing fall in the following categories:

-   Office 365 Applications

-   Microsoft and third-party applications configured with federation-based SSO

-   Password-based SSO applications

-   Applications with existing SSO solutions

## General issues to check first

-   If an application was just added to a user, try to sign in and out again into the user’s Access Panel after a few minutes to see if the application is added.

-   If a license was just removed from a user or group the user is a member of this may take a long time, depending on the size and complexity of the group for changes to be made. Allow for extra time before signing into the Access Panel.

## Problems related to application configuration

An application may not be appearing in a user’s Access Panel because it is not configured properly. Below are some ways you can troubleshoot issues related to application configuration:

-   [How to configure federated single sign-on for an Azure AD gallery application](#how-to-configure-federated-single-sign-on-for-an-azure-ad-gallery-application)

-   [How to configure federated single sign-on for a non-gallery application](#how-to-configure-federated-single-sign-on-for-a-non-gallery-application)

-   [How to configure a password single sign-on application for an Azure AD gallery application](#how-to-configure-password-single-sign-on-for-a-non-gallery-application)

-   [How to configure a password single sign-on application for a non-gallery application](#how-to-configure-password-single-sign-on-for-a-non-gallery-application)

### How to configure federated single sign-on for an Azure AD gallery application

All applications in the Azure AD gallery enabled with Enterprise Single Sign-On capability has a step-by-step tutorial available. You can access the [List of tutorials on how to integrate SaaS apps with Azure Active Directory](https://azure.microsoft.com/documentation/articles/active-directory-saas-tutorial-list/) for a detail step-by-step guidance.

To configure an application from the Azure AD gallery you need to:

-   [Add an application from the Azure AD gallery](#add-an-application-from-the-azure-ad-gallery)

-   [Configure the application’s metadata values in Azure AD (Sign on URL, Identifier, Reply URL)](#configure-single-sign-on-for-an-application-from-the-azure-ad-gallery)

-   [Select User Identifier and add user attributes to be sent to the application](#select-user-identifier-and-add-user-attributes-to-be-sent-to-the-application)

-   [Retrieve Azure AD metadata and certificate](#download-the-azure-ad-metadata-or-certificate)

-   [Configure Azure AD metadata values in the application (Sign on URL, Issuer, Logout URL and certificate)](#configure-single-sign-on-for-an-application-from-the-azure-ad-gallery)

#### Add an application from the Azure AD gallery

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

After a short period, you be able to see the application’s configuration pane.

#### Configure single sign-on for an application from the Azure AD gallery

To configure single sign-on for an application, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6. Select the application you want to configure single sign-on.

7. Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8. Select **SAML-based Sign-on** from the **Mode** dropdown.

9. Enter the required values in **Domain and URLs.** You should get these values from the application vendor.

   1. To configure the application as SP-initiated SSO, the Sign on URL it’s a required value. For some applications, the Identifier is also a required value.

   2. To configure the application as IdP-initiated SSO, the Reply URL it’s a required value. For some applications, the Identifier is also a required value.

10. **Optional:** click **Show advanced URL settings** if you want to see the non-required values.

11. In the **User attributes**, select the unique identifier for your users in the **User Identifier** dropdown.

12. **Optional:** click **View and edit all other user attributes** to edit the attributes to be sent to the application in the SAML token when users sign in.

    To add an attribute:

    1. click **Add attribute**. Enter the **Name** and the select the **Value** from the dropdown.

    2. click **Save.** You see the new attribute in the table.

13. click **Configure &lt;application name&gt;** to access documentation on how to configure single sign-on in the application. Also, you have the metadata URLs and certificate required to set up SSO with the application.

14. click **Save** to save the configuration.

15. Assign users to the application.

#### Select User Identifier and add user attributes to be sent to the application

To select the User Identifier or add user attributes, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want to show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6. Select the application you have configured single sign-on.

7. Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8. Under the **User attributes** section, select the unique identifier for your users in the **User Identifier** dropdown. The selected option needs to match the expected value in the application to authenticate the user.

   >[!NOTE] 
   >Azure AD selects the format for the NameID attribute (User Identifier) based on the value selected or the format requested by the application in the SAML AuthRequest. For more information visit the article [Single Sign-On SAML protocol](https://docs.microsoft.com/azure/active-directory/develop/active-directory-single-sign-on-protocol-reference#authnrequest) under the section NameIDPolicy.
   >
   >

9. To add user attributes, click **View and edit all other user attributes** to edit the attributes to be sent to the application in the SAML token when users sign in.

   To add an attribute:

   1. click **Add attribute**. Enter the **Name** and the select the **Value** from the dropdown.

   2. click **Save.** You will see the new attribute in the table.

#### Download the Azure AD metadata or certificate

To download the application metadata or certificate from Azure AD, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6. Select the application you have configured single sign-on.

7. Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8. Go to **SAML Signing Certificate** section, then click **Download** column value. Depending on what the application requires configuring single sign-on, you see either the option to download the Metadata XML or the Certificate.

   Azure AD doesn’t provide a URL to get the metadata. The metadata can only be retrieved as an XML file.

### How to configure federated single sign-on for a non-gallery application

To configure a non-gallery application, you need to have Azure AD premium and the application supports SAML 2.0. For more information about Azure AD versions, visit [Azure AD pricing](https://azure.microsoft.com/pricing/details/active-directory/).

-   [Configure the application’s metadata values in Azure AD (Sign on URL, Identifier, Reply URL)](#configure-single-sign-on-for-an-application-from-the-azure-ad-gallery)

-   [Select User Identifier and add user attributes to be sent to the application](#select-user-identifier-and-add-user-attributes-to-be-sent-to-the-application)

-   [Retrieve Azure AD metadata and certificate](#download-the-azure-ad-metadata-or-certificate)

-   [Configure Azure AD metadata values in the application (Sign on URL, Issuer, Logout URL and certificate)](#configure-the-application-for-password-single-sign-on-1)

#### Configure the application’s metadata values in Azure AD (Sign on URL, Identifier, Reply URL)

To configure single sign-on for an application that is not in the Azure AD gallery, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click the **Add** button at the top-right corner on the **Enterprise Applications** pane.

6. click **Non-gallery application** in the **Add your own app** section.

7. Enter the name of the application in the **Name** textbox.

8. Click **Add** button, to add the application.

9. Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

10. Select **SAML-based Sign-on** in the **Mode** dropdown.

11. Enter the required values in **Domain and URLs.** You should get these values from the application vendor.

    1. To configure the application as IdP-initiated SSO, enter the Reply URL and the Identifier.

    2.  **Optional:** To configure the application as SP-initiated SSO, the Sign on URL it’s a required value.

12. In the **User attributes**, select the unique identifier for your users in the **User Identifier** dropdown.

13. **Optional:** click **View and edit all other user attributes** to edit the attributes to be sent to the application in the SAML token when users sign in.

    To add an attribute:

    1. click **Add attribute**. Enter the **Name** and the select the **Value** from the dropdown.

    2. Click **Save.** You see the new attribute in the table.

14. click **Configure &lt;application name&gt;** to access documentation on how to configure single sign-on in the application. Also, you have Azure AD URLs and certificates required for the application.

#### Select User Identifier and add user attributes to be sent to the application

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
   >Azure AD selects the format for the NameID attribute (User Identifier) based on the value selected or the format requested by the application in the SAML AuthRequest. For more information visit the article [Single Sign-On SAML protocol](https://docs.microsoft.com/azure/active-directory/develop/active-directory-single-sign-on-protocol-reference#authnrequest) under the section NameIDPolicy.
   >
   >

9. To add user attributes, click **View and edit all other user attributes** to edit the attributes to be sent to the application in the SAML token when users sign in.

   To add an attribute:

   1. click **Add attribute**. Enter the **Name** and the select the **Value** from the dropdown.

   2. Click **Save.** You see the new attribute in the table.

#### Download the Azure AD metadata or certificate

To download the application metadata or certificate from Azure AD, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6. Select the application you have configured single sign-on.

7. Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8. Go to **SAML Signing Certificate** section, then click **Download** column value. Depending on what the application requires configuring single sign-on, you see either the option to download the Metadata XML or the Certificate.

Azure AD doesn’t provide a URL to get the metadata. The metadata can only be retrieved as an XML file.

### How to configure password single sign-on for an Azure AD gallery application

To configure an application from the Azure AD gallery you need to:

-   [Add an application from the Azure AD gallery](#add-an-application-from-the-azure-ad-gallery)

-   [Configure the application for password single sign-on](#configure-the-application-for-password-single-sign-on)

#### Add an application from the Azure AD gallery

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

#### Configure the application for password single sign-on

To configure single sign-on for an application, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6. Select the application you want to configure single sign-on.

7. Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8. Select the mode **Password-based Sign-on.**

9. [Assign users to the application](#how-to-assign-a-user-to-an-application-directly).

10. Additionally, you can also provide credentials on behalf of the user by selecting the rows of the users and clicking on **Update Credentials** and entering the username and password on behalf of the users. Otherwise, users be prompted to enter the credentials themselves upon launch.

### How to configure password single sign-on for a non-gallery application

To configure an application from the Azure AD gallery you need to:

-   [Add a non-gallery application](#add-a-non-gallery-application)

-   [Configure the application for password single sign-on](#configure-the-application-for-password-single-sign-on)

#### Add a non-gallery application

To add an application from the Azure AD Gallery, follow the steps below:

1.  Open the [Azure portal](https://portal.azure.com) and sign in as a **Global Administrator** or **Co-admin**.

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click the **Add** button at the top-right corner on the **Enterprise Applications** pane.

6.  click **Non-gallery application.**

7.  Enter the name of your application in the **Name** textbox. Select **Add.**

After a short period, you be able to see the application’s configuration pane.

#### <a name="configure-the-application-for-password-single-sign-on-1"></a> Configure the application for password single sign-on

To configure single sign-on for an application, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator** or **Co-admin.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5.  click **All Applications** to view a list of all your applications.

    1.  If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6.  Select the application you want to configure single sign-on.

7.  Once the application loads, click the **Single sign-on** from the application’s left-hand navigation menu.

8.  Select the mode **Password-based Sign-on.**

9.  Enter the **Sign-on URL**. This is the URL where users enter their username and password to sign in to. Ensure the sign-in fields are visible at the URL.

10. [Assign users to the application](#how-to-assign-a-user-to-an-application-directly).

11. Additionally, you can also provide credentials on behalf of the user by selecting the rows of the users and clicking on **Update Credentials** and entering the username and password on behalf of the users. Otherwise, users be prompted to enter the credentials themselves upon launch.

## Problems related to assigning applications to users

A user may not be seeing an application on their Access Panel because they are not assigned to the application. Below are some ways to check:

-   [Check if a user is assigned to the application](#check-if-a-user-is-assigned-to-the-application)

-   [How to assign a user to an application directly](#how-to-assign-a-user-to-an-application-directly)

-   [Check if a user is assigned to a license related to the application](#check-if-a-user-is-under-a-license-related-to-the-application)

-   [How to assign a license to a user](#how-to-assign-a-user-a-license)

### Check if a user is assigned to the application

To check if a user is assigned to the application, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

6. **Search** for the name of the application in question.

7. click **Users and groups**.

8. Check to see if your user is assigned to the application.

   * If not follow the steps in “How to assign a user to an application directly” to do so.

### How to assign a user to an application directly

To assign one or more users to an application directly, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator**.

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

After a short period, the users you have selected be able to launch these applications in the Access Panel.

### Check if a user is under a license related to the application

To check a user’s assigned licenses, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Users and groups** in the navigation menu.

5. click **All users**.

6. **Search** for the user you are interested in and **click the row** to select.

7. click **Licenses** to see which licenses the user currently has assigned.

   * If the user is assigned to an Office license this enables First Party Office applications to appear on the user’s Access Panel.

### How to assign a user a license 

To assign a license to a user, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Users and groups** in the navigation menu.

5.  click **All users**.

6.  **Search** for the user you are interested in and **click the row** to select.

7.  click **Licenses** to see which licenses the user currently has assigned.

8.  click the **Assign** button.

9.  Select **one or more products** from the list of available products.

10. **Optional** click the **assignment options** item to granularly assign products. Click **Ok** when this is completed.

11. Click the **Assign** button to assign these licenses to this user.

## Problems related to assigning applications to groups

A user may be seeing an application on their Access Panel because they are part of a group that has been assigned the application. Below are some ways to check:

-   [Check a user’s group memberships](#check-a-users-group-memberships)

-   [How to assign an application to a group directly](#how-to-assign-an-application-to-a-group-directly)

-   [Check if a user is part of group assigned to a license](#check-if-a-user-is-part-of-group-assigned-to-a-license)

-   [How to assign a license to a group](#how-to-assign-a-license-to-a-group)

### Check a user’s group memberships

To check a group’s membership, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Users and groups** in the navigation menu.

5. click **All users**.

6. **Search** for the user you are interested in and **click the row** to select.

7. click **Groups**.

8. Check to see if your user is part of a Group assigned to the application.

   * If you want to remove the user from the group, **click the row** of the group and select delete.

### How to assign an application to a group directly

To assign one or more groups to an application directly, follow the steps below:

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator**.

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Enterprise Applications** from the Azure Active Directory left-hand navigation menu.

5. click **All Applications** to view a list of all your applications.

   * If you do not see the application you want show up here, use the **Filter** control at the top of the **All Applications List** and set the **Show** option to **All Applications.**

6. Select the application you want to assign a user to from the list.

7. Once the application loads, click **Users and Groups** from the application’s left-hand navigation menu.

8. Click the **Add** button on top of the **Users and Groups** list to open the **Add Assignment** pane.

9. click the **Users and groups** selector from the **Add Assignment** pane.

10. Type in the **full group name** of the group you are interested in assigning into the **Search by name or email address** search box.

11. Hover over the **group** in the list to reveal a **checkbox**. Click the checkbox next to the group’s profile photo or logo to add your user to the **Selected** list.

12. **Optional:** If you would like to **add more than one group**, type in another **full group name** into the **Search by name or email address** search box, and click the checkbox to add this group to the **Selected** list.

13. When you are finished selecting groups, click the **Select** button to add them to the list of users and groups to be assigned to the application.

14. **Optional:** click the **Select Role** selector in the **Add Assignment** pane to select a role to assign to the groups you have selected.

15. Click the **Assign** button to assign the application to the selected groups.

After a short period, the users you have selected be able to launch these applications in the Access Panel.

### Check if a user is part of group assigned to a license

1. Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2. Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3. Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4. click **Users and groups** in the navigation menu.

5. click **All users**.

6. **Search** for the user you are interested in and **click the row** to select.

7. click **Groups**.

8. click the row of a specific group.

9. click **Licenses** to see which licenses the group has assigned to it.

   * If the group is assigned to an Office license this may enable certain First Party Office applications to appear on the user’s Access Panel.

### How to assign a license to a group

To assign a license to a group, follow the steps below:

1.  Open the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator.**

2.  Open the **Azure Active Directory Extension** by clicking **All services** at the top of the main left-hand navigation menu.

3.  Type in **“Azure Active Directory**” in the filter search box and select the **Azure Active Directory** item.

4.  click **Users and groups** in the navigation menu.

5.  click **All groups**.

6.  **Search** for the group you are interested in and **click the row** to select.

7.  click **Licenses** to see which licenses the group currently has assigned.

8.  click the **Assign** button.

9.  Select **one or more products** from the list of available products.

10. **Optional** click the **assignment options** item to granularly assign products. Click **Ok** when this is completed.

11. Click the **Assign** button to assign these licenses to this group. This may take a long time, depending on the size and complexity of the group.

>[!NOTE]
>To do this faster, consider temporarily assigning a license to the user directly. 
>
>

## Next steps
[Add new users to Azure Active Directory](./../fundamentals/add-users-azure-active-directory.md)

