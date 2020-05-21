---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with PureCloud by Genesys | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and PureCloud by Genesys.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: e16a46db-5de2-4681-b7e0-94c670e3e54e
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 10/03/2019
ms.author: jeedes
ms.collection: M365-identity-device-management

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with PureCloud by Genesys

In this tutorial, you'll learn how to integrate PureCloud by Genesys with Azure Active Directory (Azure AD). After you do that, you can:

* Use Azure AD to control which users can access PureCloud by Genesys.
* Enable your users to be automatically signed-in to PureCloud by Genesys with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have one, you can get a [free account](https://azure.microsoft.com/free/).
* A PureCloud by Genesys single sign-on (SSO)–enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* PureCloud by Genesys supports **SP and IDP**–initiated SSO.

> [!NOTE]
> Because the ID for this application is a fixed-string value, only one instance can be configured in one tenant.

## Adding PureCloud by Genesys from the gallery

To configure integration of PureCloud by Genesys into Azure AD, you must add PureCloud by Genesys from the gallery to your list of managed SaaS apps. To do this, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) by using a work or school account or by using a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Go to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **PureCloud by Genesys** in the search box.
1. Select **PureCloud by Genesys** from the results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for PureCloud by Genesys

Configure and test Azure AD SSO with PureCloud by Genesys using a test user named **B.Simon**. For SSO to work, you must establish a link relationship between an Azure AD user and the related user in PureCloud by Genesys.

To configure and test Azure AD SSO with PureCloud by Genesys, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable B.Simon to use Azure AD single sign-on.
1. **[Configure PureCloud by Genesys SSO](#configure-purecloud-by-genesys-sso)** to configure the single sign-on settings on application side.
    1. **[Create a PureCloud by Genesys test user](#create-purecloud-by-genesys-test-user)** to have a counterpart of B.Simon in PureCloud by Genesys that's linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** to verify whether the configuration works.

## Configure Azure AD SSO

To enable Azure AD SSO in the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), on the **PureCloud by Genesys** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a Single Sign-On method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, if you want to configure the application in **IDP**-initiated mode, enter the values for the following fields:

    a. In the **Identifier** box, enter a URL that corresponds to your region:

	| |
	|--|
	| `https://login.mypurecloud.com/saml` |
	| `https://login.mypurecloud.de/saml` |
	| `https://login.mypurecloud.jp/saml` |
	| `https://login.mypurecloud.ie/saml` |
	| `https://login.mypurecloud.au/saml` |

    b. In the **Reply URL** box, enter a URL that corresponds to your region:

	| |
	|--|
    | `https://login.mypurecloud.com/saml` |
	| `https://login.mypurecloud.de/saml` |
	| `https://login.mypurecloud.jp/saml` |
	| `https://login.mypurecloud.ie/saml` |
	| `https://login.mypurecloud.com.au/saml`|

1. Select **Set additional URLs** and take the following step if you want to configure the application in **SP** initiated mode:

    In the **Sign-on URL** box, enter a URL that corresponds to your region:
	
	| |
	|--|
	| `https://login.mypurecloud.com` |
	| `https://login.mypurecloud.de` |
	| `https://login.mypurecloud.jp` |
	| `https://login.mypurecloud.ie` |
	| `https://login.mypurecloud.com.au` |

1. PureCloud by Genesys application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes:

	![image](common/default-attributes.png)

1. Additionally, PureCloud by Genesys application expects a few more attributes to be passed back in the SAML response, as shown in the following table. These attributes are also pre-populated, but you can review them as needed.

	| Name | Source attribute|
	| ---------------| --------------- |
	| Email | user.userprincipalname |
	| OrganizationName | `Your organization name` |

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. In the **Set up PureCloud by Genesys** section, copy the appropriate URL (or URLs), based on your requirements.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user named B.Simon in the Azure portal:

1. In the left pane of the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the user name in the following format: username@companydomain.extension. For example: `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then make note of the value that's displayed in the **Password** box.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you'll set up  B.Simon to use Azure single sign-on by granting access to PureCloud by Genesys.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **PureCloud by Genesys**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, and then select **Users and groups** in the **Add Assignment** dialog box.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog box, select **B.Simon** from the Users list, and then choose the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list, and then choose the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select the **Assign** button.

## Configure PureCloud by Genesys SSO

1. In a different web browser window, sign in to PureCloud by Genesys as an administrator.

1. Select **Admin** at the top and then go to **Single Sign-on** under **Integrations**.

	![Configure Single Sign-On](./media/purecloud-by-genesys-tutorial/configure01.png)

1. Switch to the **ADFS/Azure AD(Premium)** tab, and then follow these steps:

	![Configure Single Sign-On](./media/purecloud-by-genesys-tutorial/configure02.png)

	a. Select **Browse** to upload the base-64 encoded certificate that you downloaded from the Azure portal into the **ADFS Certificate**.

	b. In the **ADFS Issuer URI** box, paste the value of **Azure AD Identifier** that you copied from the Azure portal.

	c. In the **Target URI** box, paste the value of **Login URL** that you copied from the Azure portal.

	d. For the **Relying Party Identifier** value, go to the Azure portal, and then on the **PureCloud by Genesys** application integration page, select the **Properties** tab and copy the **Application ID** value. Paste it into the **Relying Party Identifier** box.

	![Configure Single Sign-On](./media/purecloud-by-genesys-tutorial/configure06.png)

	e. Select **Save**.

### Create PureCloud by Genesys test user

To enable Azure AD users to sign in to PureCloud by Genesys, they must be provisioned into PureCloud by Genesys. In PureCloud by Genesys, provisioning is a manual task.

**To provision a user account, follow these steps:**

1. Log in to PureCloud by Genesys as an administrator.

1. Select **Admin** at the top and go to **People** under **People & Permissions**.

	![Configure Single Sign-On](./media/purecloud-by-genesys-tutorial/configure03.png)

1. On the **People** page, select **Add Person**.

	![Configure Single Sign-On](./media/purecloud-by-genesys-tutorial/configure04.png)

1. In the **Add People to the Organization** dialog box, follow these steps:

	![Configure Single Sign-On](./media/purecloud-by-genesys-tutorial/configure05.png)

	a. In the **Full Name** box, enter the name of a user. For example: **B.simon**.

	b. In the **Email** box, enter the email of the user. For example: **b.simon\@contoso.com**.

	c. Select **Create**.

## Test SSO

In this section, you test your Azure AD single sign-on configuration by using the Access Panel.

When you select the **PureCloud by Genesys** tile in the Access Panel, you should be automatically signed in to the PureCloud by Genesys account that you set up SSO for. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of tutorials about how to integrate SaaS apps with Azure AD ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure AD?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure AD?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try PureCloud by Genesys with Azure AD](https://aad.portal.azure.com/)
