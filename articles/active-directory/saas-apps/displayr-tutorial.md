---
title: 'Tutorial: Azure Active Directory integration with Displayr | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Displayr.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/20/2019
ms.author: jeedes
---

# Tutorial: Integrate Displayr with Azure Active Directory

In this tutorial, you'll learn how to integrate Displayr with Azure Active Directory (Azure AD). When you integrate Displayr with Azure AD, you can:

* Control in Azure AD who has access to Displayr.
* Enable your users to be automatically signed-in to Displayr with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Displayr single sign-on (SSO) enabled company.

## Scenario description

In this tutorial, you will learn to configure Azure AD SSO in your Displayr company. Displayr supports **SP** initiated SSO.

## Adding Displayr from the gallery

To configure the integration of Displayr into Azure AD, you need to add Displayr from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Displayr** in the search box.
1. Select **Displayr** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure Azure AD single sign-on

To configure Azure AD SSO with Displayr, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.
2. **[Configure Displayr](#configure-displayr)** to configure the SSO settings on application side.
4. **[Restrict access to specific users](#restrict-access-to-specific-users)** to restrict which of your Azure AD users can sign in to Displayr.
6. **[Test SSO](#test-sso)** to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Displayr** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set-up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following step:

	a. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<YOURDOMAIN>.displayr.com`

	b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:`<YOURDOMAIN>.displayr.com`
	
	c. In the **Reply URL** text box, type `https://app.displayr.com/Login/ProcessSamlResponse`.
	
	d. Click **Save**.

	>[!NOTE]
	>These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Displayr Client support team](mailto:support@displayr.com) to get these values. You can also refer to the patterns shown in the Basic SAML Configuration section in the Azure portal.

1. On the **Set-up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

   ![The Certificate download link](common/certificatebase64.png)

1. Displayr application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open User Attributes dialog.

   ![Screenshot that shows the "User Attributes" section with the "Edit" icon highlighted.](common/edit-attribute.png)

1. In addition to above, Displayr application expects few more attributes to be passed back in SAML response. In the **User Attributes & Claims** section on the **Group Claims (Preview)** dialog, perform the following steps:

   a. Click **Add a group claim**.

      ![Screenshot that shows the "Group Claims (Preview) window with settings selected.](./media/displayr-tutorial/config05.png)

   b. Select **All Groups** from the radio list.

   c. Select **Source Attribute** of **Group ID**.

   f. Click **Save**.

1. On the **Set-up Displayr** section, copy the appropriate URL(s) based on your requirement.

   ![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure Displayr

1. To automate the configuration within Displayr, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **Setup Displayr** will direct you to the Displayr application. From there, provide the admin credentials to sign into Displayr. The browser extension will automatically configure the application for you and automate steps 3-6.

	![Setup configuration](common/setup-sso.png)

3. If you want to set up Displayr manually, open a new web browser window and sign into your Displayr company site as an administrator and perform the following steps:

4. Click on the **User** icon, then navigate to **Account settings**.

	![Screenshot that shows the "Settings" icon and "Account" selected.](./media/displayr-tutorial/config01.png)

5. Switch to **Settings** from the top menu and scroll down the page to click on **Configure Single Sign On (SAML)**.

	![Screenshot that shows the "Settings" tab selected and the "Configure Single Sign On (S A M L)" action selected.](./media/displayr-tutorial/config02.png)

6. On the **Single Sign On (SAML)** page, perform the following steps:

	![Configuration](./media/displayr-tutorial/config03.png)

	a. Check the **Enable Single Sign On (SAML)** box.

	b. Copy the actual **Identifier** value from the **Basic SAML Configuration** section of Azure AD and paste it into the **Issuer** text box.

	c. In the **Login URL** text box, paste the value of **Login URL**, which you have copied from Azure portal.

	d. In the **Logout URL** text box, paste the value of **Logout URL**, which you have copied from Azure portal.

	e. Open the Certificate (Base64) in Notepad, copy its content and paste it into the **Certificate** text box.

	f. **Group mappings** are optional.

	g. Click **Save**.	

### Restrict access to specific users

By default, all users in the tenant where you added the Displayr application can log in to Displayr by using SSO. If you want to restrict access to specific users or groups, see [Restrict your Azure AD app to a set of users in an Azure AD tenant](../develop/howto-restrict-your-app-to-a-set-of-users.md).

### Test SSO

When you select the Displayr tile in the Access Panel, you should be automatically signed in to the Displayr company for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/my-apps-portal-end-user-access.md).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](./tutorial-list.md)

- [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Azure Active Directory?](../conditional-access/overview.md)
