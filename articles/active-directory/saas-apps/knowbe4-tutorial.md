---
title: 'Tutorial: Azure Active Directory integration with KnowBe4 Security Awareness Training | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and KnowBe4 Security Awareness Training.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 10/22/2020
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with KnowBe4 Security Awareness Training

In this tutorial, you learn how to integrate KnowBe4 Security Awareness Training with Azure Active Directory (Azure AD).
Integrating KnowBe4 Security Awareness Training with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to KnowBe4 Security Awareness Training.
* You can enable your users to be automatically signed-in to KnowBe4 Security Awareness Training (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with KnowBe4 Security Awareness Training, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* KnowBe4 Security Awareness Training single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* KnowBe4 Security Awareness Training supports **SP** initiated SSO

* KnowBe4 Security Awareness Training supports **Just In Time** user provisioning

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding KnowBe4 from the gallery

To configure the integration of KnowBe4 into Azure AD, you need to add KnowBe4 from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **KnowBe4** in the search box.
1. Select **KnowBe4** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO

In this section, you configure and test Azure AD single sign-on with KnowBe4 based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in KnowBe4 needs to be established.

To configure and test Azure AD single sign-on with KnowBe4, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD SSO with Britta Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD SSO.
2. **[Configure KnowBe4 Security Awareness Training SSO](#configure-knowbe4-security-awareness-training-sso)** - to configure the SSO settings on application side.
    * **[Create KnowBe4 Security Awareness Training test user](#create-knowbe4-security-awareness-training-test-user)** - to have a counterpart of Britta Simon in KnowBe4 Security Awareness Training that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **KnowBe4** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

	In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<companyname>.KnowBe4.com/auth/saml/<instancename>`

    > [!NOTE]
	> The sign on URL value is not real. Update this value with the actual Sign on URL. Contact [KnowBe4 Security Awareness Training Client support team](mailto:support@KnowBe4.com) to get this value. You can also refer to the pattern shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Raw)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificateraw.png)

6. On the **Set up KnowBe4 Security Awareness Training** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to KnowBe4.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **KnowBe4**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure KnowBe4 Security Awareness Training SSO

To configure single sign-on on **KnowBe4 Security Awareness Training** side, you need to send the downloaded **Certificate (Raw)** and appropriate copied URLs from Azure portal to [KnowBe4 Security Awareness Training support team](mailto:support@KnowBe4.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create KnowBe4 Security Awareness Training test user

In this section, a user called Britta Simon is created in KnowBe4. KnowBe4 supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in KnowBe4, a new one is created after authentication.

### Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

1. Click on **Test this application** in Azure portal. This will redirect to KnowBe4 Sign-on URL where you can initiate the login flow. 

2. Go to KnowBe4 Sign-on URL directly and initiate the login flow from there.

3. You can use Microsoft Access Panel. When you click the KnowBe4 tile in the Access Panel, this will redirect to KnowBe4 Sign-on URL. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Next steps

Once you configure KnowBe4 you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

