---
title: 'Tutorial: Azure Active Directory integration with AirWatch | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and AirWatch.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 96a3bb1c-96c6-40dc-8ea0-060b0c2a62e5
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 07/11/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Integrate AirWatch with Azure Active Directory

In this tutorial, you'll learn how to integrate AirWatch with Azure Active Directory (Azure AD). When you integrate AirWatch with Azure AD, you can:

* Control in Azure AD who has access to AirWatch.
* Enable your users to be automatically signed-in to AirWatch with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get one-month free trial [here](https://azure.microsoft.com/pricing/free-trial/).
* AirWatch single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment. AirWatch supports **SP** initiated SSO.

## Adding AirWatch from the gallery

To configure the integration of AirWatch into Azure AD, you need to add AirWatch from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **AirWatch** in the search box.
1. Select **AirWatch** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on

Configure and test Azure AD SSO with AirWatch using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in AirWatch.

To configure and test Azure AD SSO with AirWatch, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
2. **[Configure AirWatch SSO](#configure-airwatch-sso)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Create AirWatch test user](#create-airwatch-test-user)** - to have a counterpart of Britta Simon in AirWatch that is linked to the Azure AD representation of user.
5. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
6. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **AirWatch** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** page, enter the values for the following fields:

    1. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<subdomain>.awmdm.com/AirWatch/Login?gid=companycode`

    1. In the **Identifier (Entity ID)** text box, type the value as:
    `AirWatch`

	> [!NOTE]
	> This value is not the real. Update this value with the actual Sign-on URL. Contact [AirWatch Client support team](https://www.air-watch.com/company/contact-us/) to get this value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. AirWatch application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

	![image](common/edit-attribute.png)

1. In the **User Claims** section on the **User Attributes** dialog, edit the claims by using **Edit icon** or add the claims by using **Add new claim** to configure SAML token attribute as shown in the image above and perform the following steps:

	| Name |  Source Attribute|
	|---------------|----------------|
	| UID | user.userprincipalname |
    | | |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the Metadata XML and save it on your computer.

   ![The Certificate download link](common/metadataxml.png)

1. On the **Set up AirWatch** section, copy the appropriate URL(s) based on your requirement.

   ![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure AirWatch SSO

1. In a different web browser window, sign in to your AirWatch company site as an administrator.

1. On the settings page. Select **Settings > Enterprise Integration > Directory Services**.

   ![Settings](./media/airwatch-tutorial/ic791921.png "Settings")

1. Click the **User** tab, in the **Base DN** textbox, type your domain name, and then click **Save**.

   ![User](./media/airwatch-tutorial/ic791922.png "User")

1. Click the **Server** tab.

   ![Server](./media/airwatch-tutorial/ic791923.png "Server")

1. Perform the following steps on the **LDAP** section:

	![Upload](./media/airwatch-tutorial/ic791924.png "LDAP")   

    a. As **Directory Type**, select **None**.

    b. Select **Use SAML For Authentication**.

1. On the **SAML 2.0** section, to upload the downloaded certificate, click **Upload**.

    ![Upload](./media/airwatch-tutorial/ic791932.png "Upload")

1. In the **Request** section, perform the following steps:

    ![Request](./media/airwatch-tutorial/ic791925.png "Request")  

    a. As **Request Binding Type**, select **POST**.

    b. In the Azure portal, on the **Configure single sign-on at AirWatch** dialog page, copy the **Login URL** value, and then paste it into the **Identity Provider Single Sign On URL** textbox.

    c. As **NameID Format**, select **Email Address**.

    d. As **Authentication Request Security**, select **None**.

    e. Click **Save**.

1. Click the **User** tab again.

    ![User](./media/airwatch-tutorial/ic791926.png "User")

1. In the **Attribute** section, perform the following steps:

    ![Attribute](./media/airwatch-tutorial/ic791927.png "Attribute")

    a. In the **Object Identifier** textbox, type `http://schemas.microsoft.com/identity/claims/objectidentifier`.

    b. In the **Username** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`.

    c. In the **Display Name** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`.

    d. In the **First Name** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`.

    e. In the **Last Name** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname`.

    f. In the **Email** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`.

    g. Click **Save**.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to AirWatch.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **AirWatch**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Create AirWatch test user

To enable Azure AD users to sign in to AirWatch, they must be provisioned in to AirWatch. In the case of AirWatch, provisioning is a manual task.

**To configure user provisioning, perform the following steps:**

1. Sign in to your **AirWatch** company site as administrator.

2. In the navigation pane on the left side, click **Accounts**, and then click **Users**.
  
   ![Users](./media/airwatch-tutorial/ic791929.png "Users")

3. In the **Users** menu, click **List View**, and then click **Add > Add User**.
  
   ![Add User](./media/airwatch-tutorial/ic791930.png "Add User")

4. On the **Add / Edit User** dialog, perform the following steps:

   ![Add User](./media/airwatch-tutorial/ic791931.png "Add User")

   a. Type the **Username**, **Password**, **Confirm Password**, **First Name**, **Last Name**, **Email Address** of a valid Azure Active Directory account you want to provision into the related textboxes.

   b. Click **Save**.

> [!NOTE]
> You can use any other AirWatch user account creation tools or APIs provided by AirWatch to provision Azure AD user accounts.

### Test SSO

When you select the AirWatch tile in the Access Panel, you should be automatically signed in to the AirWatch for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
