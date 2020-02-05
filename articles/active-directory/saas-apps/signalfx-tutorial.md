---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with SignalFx | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SignalFx.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 6d5ab4b0-29bc-4b20-8536-d64db7530f32
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 12/10/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with SignalFx

In this tutorial, you'll learn how to integrate SignalFx with Azure Active Directory (Azure AD). When you integrate SignalFx with Azure AD, you can:

* Control in Azure AD who has access to SignalFx.
* Enable your users to be automatically signed-in to SignalFx with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SignalFx single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* SignalFx supports **IDP** initiated SSO
* SignalFx supports **Just In Time** user provisioning

## Adding SignalFx from the gallery

To configure the integration of SignalFx into Azure AD, you need to add SignalFx from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **SignalFx** in the search box.
1. Select **SignalFx** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for SignalFx

Configure and test Azure AD SSO with SignalFx using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in SignalFx.

To configure and test Azure AD SSO with SignalFx, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure SignalFx SSO](#configure-signalfx-sso)** - to configure the single sign-on settings on application side.
    * **[Create SignalFx test user](#create-signalfx-test-user)** - to have a counterpart of B.Simon in SignalFx that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **SignalFx** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Set up single sign-on with SAML** page, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL: `https://api.signalfx.com/v1/saml/metadata`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://api.signalfx.com/v1/saml/acs/<integration ID>`

	> [!NOTE]
	> The preceding value is not real value. You update the value with the actual Reply URL, which is explained later in the tutorial.

1. SignalFx application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, SignalFx application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name |  Source Attribute|
	| ------------------- | -------------------- |
	| User.FirstName  | user.givenname |
	| User.email  | user.mail |
	| PersonImmutableID       | user.userprincipalname    |
	| User.LastName       | user.surname    |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up SignalFx** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to SignalFx.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **SignalFx**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure SignalFx SSO

1. Sign in to your SignalFx company site as administrator.

1. In SignalFx, on the top click **Integrations** to open the Integrations page.

	![SignalFx Integration](./media/signalfx-tutorial/tutorial_signalfx_intg.png)

1. Click on **Azure Active Directory** tile under **Login Services** section.

	![SignalFx saml](./media/signalfx-tutorial/tutorial_signalfx_saml.png)

1. Click on **NEW INTEGRATION** and under the **INSTALL** tab perform the following steps:

	![SignalFx samlintgpage](./media/signalfx-tutorial/tutorial_signalfx_azure.png)

	a. In the **Name** textbox type, a new integration name, like **OurOrgName SAML SSO**.

	b. Copy the **Integration ID** value and append to the **Reply URL** in the place of `<integration ID>` in the **Reply URL** textbox of **Basic SAML Configuration** section in Azure portal.

	c. Click on **Upload File** to upload the **Base64 encoded certificate** downloaded from Azure portal in the **Certificate** textbox.

	d. In the **Issuer URL** textbox, paste the value of **Azure AD Identifier**, which you have copied from the Azure portal.

	e. In the **Metadata URL** textbox, paste the **Login URL** which you have copied from the Azure portal.

	f. Click **Save**.

### Create SignalFx test user

The objective of this section is to create a user called Britta Simon in SignalFx. SignalFx supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access SignalFx if it doesn't exist yet.

When a user signs in to SignalFx from the SAML SSO for the first time, [SignalFx support team](mailto:kmazzola@signalfx.com) sends them an email containing a link that they must click through to authenticate. This will only happen the first time the user signs in; subsequent login attempts will not require email validation.

> [!Note]
> If you need to create a user manually, contact [SignalFx support team](mailto:kmazzola@signalfx.com)

## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the SignalFx tile in the Access Panel, you should be automatically signed in to the SignalFx for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try SignalFx with Azure AD](https://aad.portal.azure.com/)