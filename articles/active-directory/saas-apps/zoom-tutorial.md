---
title: 'Tutorial: Azure Active Directory integration with Zoom | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Zoom.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 0ebdab6c-83a8-4737-a86a-974f37269c31
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 07/08/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Integrate Zoom with Azure Active Directory

In this tutorial, you'll learn how to integrate Zoom with Azure Active Directory (Azure AD). When you integrate Zoom with Azure AD, you can:

* Control in Azure AD who has access to Zoom.
* Enable your users to be automatically signed-in to Zoom with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Zoom single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Zoom supports **SP** initiated SSO

## Adding Zoom from the gallery

To configure the integration of Zoom into Azure AD, you need to add Zoom from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Zoom** in the search box.
1. Select **Zoom** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Zoom

Configure and test Azure AD SSO with Zoom using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Zoom.

To configure and test Azure AD SSO with Zoom, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
	1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
	1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
2. **[Configure Zoom SSO](#configure-zoom-sso)** - to configure the Single Sign-On settings on application side.
	1. **[Create Zoom test user](#create-zoom-test-user)** - to have a counterpart of B.Simon in Zoom that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Zoom** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<companyname>.zoom.us`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `<companyname>.zoom.us`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Zoom Client support team](https://support.zoom.us/hc/en-us) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. Zoom application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open **User Attributes** dialog.

	![image](common/edit-attribute.png)

6. In addition to above, Zoom application expects few more attributes to be passed back in SAML response. In the **User Claims** section on the **User Attributes** dialog, perform the following steps to add SAML token attribute as shown in the below table: 

	| Name | Namespace  |  Source Attribute|
	| ---------------| --------------- | --------- |
	| Email address  | user.mail  | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mail` |
	| First name  | user.givenname  | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname` |
	| Last name  | user.surname  | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname` |
	| Phone number  | user.telephonenumber  | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/phone` |
	| Department  | user.department  | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/department` |
	| role | 	user.assignedrole |`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role` |

	> [!NOTE]
	> Please click [here](https://docs.microsoft.com/azure/active-directory/develop/active-directory-enterprise-app-role-management) to know how to configure Role in Azure AD

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Select Source as **Attribute**.

	d. From the **Source attribute** list, type the attribute value shown for that row.

	e. Click **Ok**

	f. Click **Save**.

	> [!NOTE]
	> Zoom may expect group claim in SAML payload so if you have created any group then please contact [Zoom Client support team](https://support.zoom.us/hc/en-us) with the group information so that they can configure this group information at their end also. You also need to provide the Object ID to [Zoom Client support team](https://support.zoom.us/hc/en-us) so that they can configure at their end. Please follow the [document](https://support.zoom.us/hc/en-us/articles/115005887566) to get the Object ID.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up Zoom** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
	1. In the **Name** field, enter `B.Simon`.  
	1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
	1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
	1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Zoom.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Zoom**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   	![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Zoom SSO

1. In a different web browser window, sign in to your Zoom company site as an administrator.

2. Click the **Single Sign-On** tab.

    ![Single sign-on tab](./media/zoom-tutorial/ic784700.png "Single sign-on")

3. Click the **Security Control** tab, and then go to the **Single Sign-On** settings.

4. In the Single Sign-On section, perform the following steps:

    ![Single sign-on section](./media/zoom-tutorial/ic784701.png "Single sign-on")

    a. In the **Sign-in page URL** textbox, paste the value of **Login URL** which you have copied from Azure portal.

    b. For **Sign-out page URL** value, you need to go to the Azure portal and click on **Azure Active Directory** on the left then navigate to **App registrations**.

	![The Azure Active Directory button](./media/zoom-tutorial/appreg.png)

	c. Click on **Endpoints**

	![The End point button](./media/zoom-tutorial/endpoint.png)

	d. Copy the **SAML-P SIGN-OUT ENDPOINT** and paste it into **Sign-out page URL** textbox.

	![The Copy End point button](./media/zoom-tutorial/endpoint1.png)

    e. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **Identity provider certificate** textbox.

    f. In the **Issuer** textbox, paste the value of **Azure AD Identifier** which you have copied from Azure portal. 

    g. Click **Save**.

    > [!NOTE]
	> For more information, visit the zoom documentation [https://zoomus.zendesk.com/hc/articles/115005887566](https://zoomus.zendesk.com/hc/articles/115005887566)

### Create Zoom test user

In order to enable Azure AD users to sign in to Zoom, they must be provisioned into Zoom. In the case of Zoom, provisioning is a manual task.

### To provision a user account, perform the following steps:

1. Sign in to your **Zoom** company site as an administrator.

2. Click the **Account Management** tab, and then click **User Management**.

3. In the User Management section, click **Add users**.

    ![User management](./media/zoom-tutorial/ic784703.png "User management")

4. On the **Add users** page, perform the following steps:

    ![Add users](./media/zoom-tutorial/ic784704.png "Add users")

    a. As **User Type**, select **Basic**.

    b. In the **Emails** textbox, type the email address of a valid Azure AD account you want to provision.

    c. Click **Add**.

> [!NOTE]
> You can use any other Zoom user account creation tools or APIs provided by Zoom to provision Azure Active Directory user accounts.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Zoom tile in the Access Panel, you should be automatically signed in to the Zoom for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

