---
title: 'Tutorial: Azure Active Directory integration with ProMaster (by Inlogik) | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and ProMaster (by Inlogik).
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 348dbd37-dc4f-49df-bb90-53d249d456b3
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 03/12/2020
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with ProMaster (by Inlogik)

In this tutorial, you learn how to integrate ProMaster (by Inlogik) with Azure Active Directory (Azure AD).
Integrating ProMaster (by Inlogik) with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to ProMaster (by Inlogik).
* You can enable your users to be automatically signed-in to ProMaster (by Inlogik) (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with ProMaster (by Inlogik), you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* ProMaster (by Inlogik) single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* ProMaster (by Inlogik) supports **SP** and **IDP** initiated SSO
* Once you configure ProMaster (by Inlogik) you can enforce session control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding ProMaster (by Inlogik) from the gallery

To configure the integration of ProMaster (by Inlogik) into Azure AD, you need to add ProMaster (by Inlogik) from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **ProMaster (by Inlogik)** in the search box.
1. Select **ProMaster (by Inlogik)** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with ProMaster (by Inlogik) based on a test user called **B.Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in ProMaster (by Inlogik) needs to be established.

To configure and test Azure AD single sign-on with ProMaster (by Inlogik), you need to complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure ProMaster (by Inlogik) SSO](#configure-promaster-by-inlogik-sso)** - to configure the single sign-on settings on application side.
    * **[Create ProMaster (by Inlogik) test user](#create-promaster-by-inlogik-test-user)** - to have a counterpart of B.Simon in ProMaster (by Inlogik) that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with ProMaster (by Inlogik), perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **ProMaster (by Inlogik)** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:

    ```http
    https://secure.inlogik.com/<COMPANYNAME>
    https://<CUSTOMDOMAIN>/SAMLBASE
    ```

    b. In the **Reply URL** text box, type a URL using the following pattern:

    ```http
    https://secure.inlogik.com/<COMPANYNAME>/saml/acs
    https://<CUSTOMDOMAIN>/SAMLBASE/saml/acs
    ```

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:

    ```http
    https://secure.inlogik.com/<COMPANYNAME>
    https://<CUSTOMDOMAIN>/SAMLBASE
    ```

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [ProMaster (by Inlogik) Client support team](https://www.inlogik.com/contact) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to ProMaster (by Inlogik).

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **ProMaster (by Inlogik)**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure ProMaster (by Inlogik) SSO

To configure single sign-on on **ProMaster (by Inlogik)** side, you need to send the **App Federation Metadata Url** to [ProMaster (by Inlogik) support team](https://www.inlogik.com/contact). They set this setting to have the SAML SSO connection set properly on both sides.

### Create ProMaster (by Inlogik) test user

In this section, you create a user called B.Simon in ProMaster (by Inlogik). Work with [ProMaster (by Inlogik) support team](https://www.inlogik.com/contact) to add the users in the ProMaster (by Inlogik) platform. Users must be created and activated before you use single sign-on.

### Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the ProMaster (by Inlogik) tile in the Access Panel, you should be automatically signed in to the ProMaster (by Inlogik) for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try ProMaster (by Inlogik) with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect ProMaster (by Inlogik) with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)
