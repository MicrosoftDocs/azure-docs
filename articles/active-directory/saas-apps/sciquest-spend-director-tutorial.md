---
title: 'Tutorial: Azure AD SSO integration with SciQuest Spend Director'
description: Learn how to configure single sign-on between Azure Active Directory and SciQuest Spend Director.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/17/2021
ms.author: jeedes
---
# Tutorial: Azure AD SSO integration with SciQuest Spend Director

In this tutorial, you'll learn how to integrate SciQuest Spend Director with Azure Active Directory (Azure AD). When you integrate SciQuest Spend Director with Azure AD, you can:

* Control in Azure AD who has access to SciQuest Spend Director.
* Enable your users to be automatically signed-in to SciQuest Spend Director with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SciQuest Spend Director single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* SciQuest Spend Director supports **SP** initiated SSO.
* SciQuest Spend Director supports **Just In Time** user provisioning.

## Add SciQuest Spend Director from the gallery

To configure the integration of SciQuest Spend Director into Azure AD, you need to add SciQuest Spend Director from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **SciQuest Spend Director** in the search box.
1. Select **SciQuest Spend Director** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for SciQuest Spend Director

Configure and test Azure AD SSO with SciQuest Spend Director using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in SciQuest Spend Director.

To configure and test Azure AD SSO with SciQuest Spend Director, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure SciQuest Spend Director SSO](#configure-sciquest-spend-director-sso)** - to configure the single sign-on settings on application side.
    1. **[Create SciQuest Spend Director test user](#create-sciquest-spend-director-test-user)** - to have a counterpart of B.Simon in SciQuest Spend Director that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **SciQuest Spend Director** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** box, type a URL using the following pattern:
    `https://<companyname>.sciquest.com`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<companyname>.sciquest.com/apps/Router/ExternalAuth/Login/<instancename>`
    
    c. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<companyname>.sciquest.com/apps/Router/SAMLAuth/<instancename>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [SciQuest Spend Director Client support team](https://www.jaggaer.com/contact-us/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up SciQuest Spend Director** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to SciQuest Spend Director.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **SciQuest Spend Director**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure SciQuest Spend Director SSO

To configure single sign-on on **SciQuest Spend Director** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [SciQuest Spend Director support team](https://www.jaggaer.com/contact-us/). They set this setting to have the SAML SSO connection set properly on both sides.

### Create SciQuest Spend Director test user

The objective of this section is to create a user called Britta Simon in SciQuest Spend Director.

You need to contact your [SciQuest Spend Director support team](https://www.jaggaer.com/contact-us/) and provide them with the details about your test account to get it created.

Alternatively, you can also leverage just-in-time provisioning, a single sign-on feature that is supported by SciQuest Spend Director.  
If just-in-time provisioning is enabled, users are automatically created by SciQuest Spend Director during a single sign-on attempt if they don't exist. This feature eliminates the need to manually create single sign-on counterpart users.

To get just-in-time provisioning enabled, you need to contact your [SciQuest Spend Director support team](https://www.jaggaer.com/contact-us/).

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to SciQuest Spend Director Sign-on URL where you can initiate the login flow. 

* Go to SciQuest Spend Director Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the SciQuest Spend Director tile in the My Apps, this will redirect to SciQuest Spend Director Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure SciQuest Spend Director you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).