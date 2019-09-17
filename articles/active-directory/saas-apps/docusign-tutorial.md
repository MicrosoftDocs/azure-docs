---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with DocuSign | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and DocuSign.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: a691288b-84c1-40fb-84bd-5b06878865f0
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 09/02/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with DocuSign

In this tutorial, you'll learn how to integrate DocuSign with Azure Active Directory (Azure AD). When you integrate DocuSign with Azure AD, you can:

* Use Azure AD to control who has access to DocuSign
* Enable automatic sign-in to DocuSign for your users through their Azure AD accounts
* Manage your accounts in one central location: the Azure portal

To learn more about software as a service (SaaS) app integration with Azure AD, see [Single sign-on to applications in Azure AD](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/)
* A DocuSign single sign-on (SSO)–enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* DocuSign supports service provider (SP)-initiated SSO.

* DocuSign supports *just-in-time* user provisioning.

* DocuSign supports [automatic user provisioning](https://docs.microsoft.com/azure/active-directory/saas-apps/docusign-provisioning-tutorial).

## Adding DocuSign from the gallery

To configure the integration of DocuSign into Azure AD, you must add DocuSign from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) by using a work or school account, or by using a personal Microsoft account.
1. In the navigation pane on the left, select the **Azure Active Directory** service.
1. Go to **Enterprise Applications** and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, type **DocuSign** in the search box.
1. Select **DocuSign** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD single sign-on for DocuSign

Configure and test Azure AD SSO with DocuSign by using a test user named **B.Simon**. For SSO to work, you must establish a link relationship between an Azure AD user and the corresponding user in DocuSign.

To configure and test Azure AD SSO with DocuSign, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** so that your users can use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable B.Simon to use Azure AD single sign-on.
1. **[Configure DocuSign SSO](#configure-docusign-sso)** to configure the single sign-on settings on the application side.
    1. **[Create DocuSign test user](#create-docusign-test-user)** to generate a counterpart of B.Simon in DocuSign that's linked to the Azure AD representation of the user.
1. **[Test SSO](#test-sso)** to verify that the configuration works.

## Configure Azure AD SSO

To enable Azure AD SSO in the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), on the **DocuSign** application integration page, find the **Manage** section, and then select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, enter the values for the following fields:

	a. In the **Sign on URL** box, enter a URL using the following pattern:
    `https://<subdomain>.docusign.com/organizations/<OrganizationID>/saml2/login/sp/<IDPID>`

    b. In the **Identifier (Entity ID)** box, enter a URL using the following pattern:
    `https://<subdomain>.docusign.com/organizations/<OrganizationID>/saml2`

	> [!NOTE]
	> These bracketed values are placeholders. Replace them with the values in the actual sign-on URL and Identifier. These details are explained in the "View SAML 2.0 Endpoints" section later in this tutorial.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. In the "Set up DocuSign" section, copy the appropriate URL (or URLs) based on your requirements.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user named B.Simon in the Azure portal.

1. In the left pane of the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. At the top of the screen, select **New user**.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter **B.Simon**.  
   1. In the **User name** field, enter the username@companydomain.extension. For example: `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then make note of the value that's displayed in the **Password** box.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you'll grant B.Simon access to DocuSign so that this can use Azure single sign-on.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **DocuSign**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, and then in the **Add Assignment** dialog box, select **Users and groups**.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog box, select **B.Simon** from the **Users** list, and then press the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then press the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select the **Assign** button.

## Configure DocuSign SSO
select
1. To automate the configuration within DocuSign, you need to install **My Apps Secure Sign-in browser extension** by selecting **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, selecting **Setup DocuSign** directs you to the DocuSign application. From there, provide the admin credentials to sign into DocuSign. The browser extension will automatically configure the application for you and automate steps 3-5.

	![Setup configuration](common/setup-sso.png)

3. If you want to setup DocuSign manually, open a new web browser window and sign into your DocuSign company site as an administrator and perform the following steps:

4. On the upper right of the page, select the profile **logo** and then select **Go to Admin**.
  
    ![Configuring single sign-on][51]

5. On your domain solutions page, select **Domains**.

	![Configuring single sign-on][50]

6. Under the **Domains** section, select **CLAIM DOMAIN**.

    ![Configuring single sign-on][52]

7. On the **Claim a domain** dialog, in the **Domain Name** textbox, type your company domain, and then select **CLAIM**. Make sure that you verify the domain and the status is active.

    ![Configuring single sign-on][53]

8. On your domain solutions page, select **Identity Providers**.
  
    ![Configuring single sign-on][54]

9. Under **Identity Providers** section, select **ADD IDENTITY PROVIDER**. 

	![Configuring single sign-on][55]

10. On the **Identity Provider Settings** page, perform the following steps:

	![Configuring single sign-on][56]

    a. In the **Name** textbox, type a unique name for your configuration. Do not use spaces.

    b. In the **Identity Provider Issuer textbox**, paste the value of **Azure AD Identifier**, which you have copied from Azure portal.

    c. In the **Identity Provider Login URL** textbox, paste the value of **Login URL**, which you have copied from Azure portal.

    d. In the **Identity Provider Logout URL** textbox, paste the value of **Logout URL**, which you have copied from Azure portal.

    e. Select **Sign AuthN request**.

    f. As **Send AuthN request by**, select **POST**.

    g. As **Send logout request by**, select **GET**.

	h. In the **Custom Attribute Mapping** section, select **ADD NEW MAPPING**.

	![Configuring single sign-on][62]

	i. Choose the field you want to map with Azure AD Claim. In this example, the **emailaddress** claim is mapped with the value of **http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress**. It is the default claim name from Azure AD for email claim and then select **SAVE**.

	![Configuring single sign-on][57]

	> [!NOTE]
	> Use the appropriate **User identifier** to map the user from Azure AD to DocuSign user mapping. Select the proper Field and enter the appropriate value based on your organization settings.

	j. In the **Identity Provider Certificates** section, select **ADD CERTIFICATE**, and then upload the certificate you have downloaded from Azure AD portal and select **SAVE**.

	![Configuring single sign-on][58]

	k. In the **Identity Providers** section, select **ACTIONS**, and then select **Endpoints**.

	![Configuring single sign-on][59]

	l. In the **View SAML 2.0 Endpoints** section on **DocuSign admin portal**, follow these steps:

	![Configuring single sign-on][60]

	* Copy the **Service Provider Issuer URL**, and then paste it into the **Identifier** textbox in **Basic SAML Configuration** section on the Azure portal.

	* Copy the **Service Provider Login URL**, and then paste it into the **Sign On URL** textbox in **Basic SAML Configuration** section on the Azure portal.

	* Select **Close**.

### Create DocuSign test user

In this section, a user called B.Simon is created in DocuSign. DocuSign supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in DocuSign, a new one is created after authentication.

>[!Note]
>If you need to create a user manually, contact [DocuSign support team](https://support.docusign.com/).

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you select the DocuSign tile in the Access Panel, you should be automatically signed in to the DocuSign for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try DocuSign with Azure AD](https://aad.portal.azure.com/)

<!--Image references-->

[50]: ./media/docusign-tutorial/tutorial_docusign_18.png
[51]: ./media/docusign-tutorial/tutorial_docusign_21.png
[52]: ./media/docusign-tutorial/tutorial_docusign_22.png
[53]: ./media/docusign-tutorial/tutorial_docusign_23.png
[54]: ./media/docusign-tutorial/tutorial_docusign_19.png
[55]: ./media/docusign-tutorial/tutorial_docusign_20.png
[56]: ./media/docusign-tutorial/tutorial_docusign_24.png
[57]: ./media/docusign-tutorial/tutorial_docusign_25.png
[58]: ./media/docusign-tutorial/tutorial_docusign_26.png
[59]: ./media/docusign-tutorial/tutorial_docusign_27.png
[60]: ./media/docusign-tutorial/tutorial_docusign_28.png
[61]: ./media/docusign-tutorial/tutorial_docusign_29.png
[62]: ./media/docusign-tutorial/tutorial_docusign_30.png