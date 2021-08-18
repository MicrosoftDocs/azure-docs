---
title: 'Tutorial: Azure Active Directory integration with Skills Base | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Skills Base.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 07/22/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Skills Base

In this tutorial, you'll learn how to integrate Skills Base with Azure Active Directory (Azure AD). When you integrate Skills Base with Azure AD, you can:

* Control in Azure AD who has access to Skills Base.
* Enable your users to be automatically signed-in to Skills Base with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Skills Base single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Skills Base supports **SP** initiated SSO.
* Skills Base supports **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Skills Base from the gallery

To configure the integration of Skills Base into Azure AD, you need to add Skills Base from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Skills Base** in the search box.
1. Select **Skills Base** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Skills Base

Configure and test Azure AD SSO with Skills Base using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Skills Base.

To configure and test Azure AD SSO with Skills Base, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Skills Base SSO](#configure-skills-base-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Skills Base test user](#create-skills-base-test-user)** - to have a counterpart of B.Simon in Skills Base that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Skills Base** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following step:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://app.skills-base.com/o/<customer-unique-key>`

	> [!NOTE]
	> You can get the Sign-On URL from Skills Base application. Please login as an Administrator and to go to Admin-> Settings-> Instance details -> Shortcut link. Copy the Sign-On URL and paste it in above textbox.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up Skills Base** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Skills Base.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Skills Base**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Skills Base SSO

1. In a different web browser window, login to Skills Base as a Security Administrator.

2. From the left side of menu, under **ADMIN** click **Authentication**.

	![The admin](./media/skillsbase-tutorial/admin.png)

3. On the **Authentication** Page, select Single Sign-On as **SAML 2**.

	![Screenshot shows the Authentication page with SAML 2 selected for Sing Sign-on.](./media/skillsbase-tutorial/configuration.png)

4. On the **Authentication** Page, Perform the following steps:

	![Screenshot shows the Authentication page where you can enter the values described.](./media/skillsbase-tutorial/save-configuration.png)

	a. Click on **Update IdP metadata** button next to **Status** option and paste the contents of Metadata XML that you downloaded from the Azure portal in the specified textbox.

	> [!Note]
	> You can also validate idp metadata through the **Metadata validator** tool as highlighted in screenshot above.

	b. Click **Save**.

### Create Skills Base test user

In this section, a user called Britta Simon is created in Skills Base. Skills Base supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Skills Base, a new one is created after authentication.

> [!Note]
> If you need to create a user manually, follow the instructions [here](http://wiki.skills-base.net/index.php?title=Adding_people_and_enabling_them_to_log_in).

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Skills Base Sign-on URL where you can initiate the login flow. 

* Go to Skills Base Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Skills Base tile in the My Apps, this will redirect to Skills Base Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Skills Base you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
