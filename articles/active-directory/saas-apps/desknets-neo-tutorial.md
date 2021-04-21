---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with desknets NEO | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and desknets NEO.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 04/08/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with desknet's NEO

In this tutorial, you'll learn how to integrate desknet's NEO with Azure Active Directory (Azure AD). When you integrate desknet's NEO with Azure AD, you can:

* Control in Azure AD who has access to desknet's NEO.
* Enable your users to be automatically signed-in to desknet's NEO with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* desknet's NEO single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* desknet's NEO supports **SP** initiated SSO.

## Adding desknet's NEO from the gallery

To configure the integration of desknet's NEO into Azure AD, you need to add desknet's NEO from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **desknet's NEO** in the search box.
1. Select **desknet's NEO** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for desknet's NEO

Configure and test Azure AD SSO with desknet's NEO using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in desknet's NEO.

To configure and test Azure AD SSO with desknet's NEO, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure desknet's NEO SSO](#configure-desknets-neo-sso)** - to configure the single sign-on settings on application side.
    1. **[Create desknet's NEO test user](#create-desknets-neo-test-user)** - to have a counterpart of B.Simon in desknet's NEO that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **desknet's NEO** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<CUSTOMER_NAME>.dn-cloud.com`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<CUSTOMER_NAME>.dn-cloud.com/cgi-bin/dneo/zsaml.cgi`

	c. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<CUSTOMER_NAME>.dn-cloud.com/cgi-bin/dneo/dneo.cgi`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [desknet's NEO Client support team](mailto:cloudsupport@desknets.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up desknet's NEO** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to desknet's NEO.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **desknet's NEO**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure desknet's NEO SSO

1. Sign in to your desknet's NEO company site as an administrator.

1. In the menu, click **SAML authentication link settings** icon.

    ![Screenshot for SAML authentication link settings.](./media/desknets-neo-tutorial/saml-authentication-icon.png)

1. In the **Common settings**, click **use** from SAML Authentication Collaboration.

    ![Screenshot for SAML authentication use.](./media/desknets-neo-tutorial/saml-authentication-use.png)

1. Perform the below steps in the **SAML authentication link settings** section.

    ![Screenshot for SAML authentication link settings section.](./media/desknets-neo-tutorial/saml-authentication.png)

    a. In the **Access URL** textbox, paste the **Login URL** value, which you have copied from the Azure portal.

    b. In the **SP Entity ID** textbox, paste the **Identifier** value, which you have copied from the Azure portal.

    c. Click **Choose File** to upload the downloaded **Certificate (Base64)** file from the Azure portal into the **x.509 Certificate** textbox.

    d. Click **change**.

### Create desknet's NEO test user

1. Sign in to your desknet's NEO company site as an administrator.

1. In the **menu**, click **Administrator settings** icon.

    ![Screenshot for Administrator settings.](./media/desknets-neo-tutorial/administrator-settings.png)

1. Click **settings** icon and select **User management** in the **Custom settings**.

    ![Screenshot for User management settings.](./media/desknets-neo-tutorial/user-management.png)

1. Click **Create user information**.

    ![Screenshot for User information button.](./media/desknets-neo-tutorial/create-new-user.png)

1. Fill the required fields in the below page and click **creation**.

    ![Screenshot for User creation section.](./media/desknets-neo-tutorial/create-new-user-2.png)

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to desknet's NEO Sign-on URL where you can initiate the login flow. 

* Go to desknet's NEO Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the desknet's NEO tile in the My Apps, this will redirect to desknet's NEO Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).


## Next steps

Once you configure desknet's NEO you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).


