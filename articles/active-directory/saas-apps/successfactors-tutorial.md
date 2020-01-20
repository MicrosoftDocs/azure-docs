---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with SuccessFactors | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SuccessFactors.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 32bd8898-c2d2-4aa7-8c46-f1f5c2aa05f1
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 01/16/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with SuccessFactors

In this tutorial, you'll learn how to integrate SuccessFactors with Azure Active Directory (Azure AD). When you integrate SuccessFactors with Azure AD, you can:

* Control in Azure AD who has access to SuccessFactors.
* Enable your users to be automatically signed-in to SuccessFactors with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SuccessFactors single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* SuccessFactors supports **SP** initiated SSO.
* Once you configure the SuccessFactors you can enforce session controls, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session controls extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-aad)

## Adding SuccessFactors from the gallery

To configure the integration of SuccessFactors into Azure AD, you need to add SuccessFactors from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **SuccessFactors** in the search box.
1. Select **SuccessFactors** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for SuccessFactors

Configure and test Azure AD SSO with SuccessFactors using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in SuccessFactors.

To configure and test Azure AD SSO with SuccessFactors, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
	1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
	1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
2. **[Configure SuccessFactors SSO](#configure-successfactors-sso)** - to configure the Single Sign-On settings on application side.
	1. **[Create SuccessFactors test user](#create-successfactors-test-user)** - to have a counterpart of B.Simon in SuccessFactors that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **SuccessFactors** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Sign-on URL** textbox, type a URL using the following pattern:

    | |
    |--|
    | `https://<companyname>.successfactors.com/<companyname>`|
    | `https://<companyname>.sapsf.com/<companyname>`|
    | `https://<companyname>.successfactors.eu/<companyname>`|
    | `https://<companyname>.sapsf.eu`|

    b. In the **Identifier** textbox, type a URL using the following pattern:

    | |
    |--|
    | `https://www.successfactors.com/<companyname>`|
    | `https://www.successfactors.com`|
    | `https://<companyname>.successfactors.eu`|
    | `https://www.successfactors.eu/<companyname>`|
    | `https://<companyname>.sapsf.com`|
    | `https://hcm4preview.sapsf.com/<companyname>`|
    | `https://<companyname>.sapsf.eu`|
    | `https://www.successfactors.cn`|
    | `https://www.successfactors.cn/<companyname>`|

	c. In the **Reply URL** textbox, type a URL using the following pattern:

    | |
    |--|
    | `https://<companyname>.successfactors.com/<companyname>`|
    | `https://<companyname>.successfactors.com`|
    | `https://<companyname>.sapsf.com/<companyname>`|
    | `https://<companyname>.sapsf.com`|
    | `https://<companyname>.successfactors.eu/<companyname>`|
    | `https://<companyname>.successfactors.eu`|
    | `https://<companyname>.sapsf.eu`|
    | `https://<companyname>.sapsf.eu/<companyname>`|
    | `https://<companyname>.sapsf.cn`|
    | `https://<companyname>.sapsf.cn/<companyname>`|

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign-on URL, Identifier and Reply URL. Contact [SuccessFactors Client support team](https://www.successfactors.com/content/ssf-site/en/support.html) to get these values.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up SuccessFactors** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to SuccessFactors.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **SuccessFactors**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   	![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure SuccessFactors SSO

1. In a different web browser window, log in to your **SuccessFactors admin portal** as an administrator.

2. Visit **Application Security** and native to **Single Sign On Feature**.

3. Place any value in the **Reset Token** and click **Save Token** to enable SAML SSO.

    ![Configuring single sign-on on app side][11]

    > [!NOTE]
    > This value is used as the on/off switch. If any value is saved, the SAML SSO is ON. If a blank value is saved the SAML SSO is OFF.

4. Native to below screenshot and perform the following actions:

    ![Configuring single sign-on on app side][12]
  
    a. Select the **SAML v2 SSO** Radio Button
  
    b. Set the **SAML Asserting Party Name**(for example, SAML issuer + company name).

    c. In the **Issuer URL** textbox, paste the **Azure AD Identifier** value which you have copied from the Azure portal.

    d. Select **Assertion** as **Require Mandatory Signature**.

    e. Select **Enabled** as **Enable SAML Flag**.

    f. Select **No** as **Login Request Signature(SF Generated/SP/RP)**.

    g. Select **Browser/Post Profile** as **SAML Profile**.

    h. Select **No** as **Enforce Certificate Valid Period**.

    i. Copy the content of the downloaded certificate file from Azure portal, and then paste it into the **SAML Verifying Certificate** textbox.

    > [!NOTE] 
    > The certificate content must have begin certificate and end certificate tags.

5. Navigate to SAML V2, and then perform the following steps:

    ![Configuring single sign-on on app side][13]

    a. Select **Yes** as **Support SP-initiated Global Logout**.

    b. In the **Global Logout Service URL (LogoutRequest destination)** textbox, paste the **Sign-Out URL** value which you have copied form the Azure portal.

    c. Select **No** as **Require sp must encrypt all NameID element**.

    d. Select **unspecified** as **NameID Format**.

    e. Select **Yes** as **Enable sp initiated login (AuthnRequest)**.

    f. In the **Send request as Company-Wide issuer** textbox, paste **Login URL** value which you have copied from the Azure portal.

6. Perform these steps if you want to make the login usernames Case Insensitive.

	![Configure Single Sign-On][29]

	a. Visit **Company Settings**(near the bottom).

	b. Select checkbox near **Enable Non-Case-Sensitive Username**.

	c. Click **Save**.

	> [!NOTE]
    > If you try to enable this, the system checks if it creates a duplicate SAML login name. For example if the customer has usernames User1 and user1. Taking away case sensitivity makes these duplicates. The system gives you an error message and does not enable the feature. The customer needs to change one of the usernames so it’s spelled different.

### Create SuccessFactors test user

To enable Azure AD users to sign in to SuccessFactors, they must be provisioned into SuccessFactors. In the case of SuccessFactors, provisioning is a manual task.

To get users created in SuccessFactors, you need to contact the [SuccessFactors support team](https://www.successfactors.com/content/ssf-site/en/support.html).

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the SuccessFactors tile in the Access Panel, you should be automatically signed in to the SuccessFactors for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try SuccessFactors with Azure AD](https://aad.portal.azure.com)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect SuccessFactors with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

<!--Image references-->

[11]: ./media/successfactors-tutorial/tutorial_successfactors_07.png
[12]: ./media/successfactors-tutorial/tutorial_successfactors_08.png
[13]: ./media/successfactors-tutorial/tutorial_successfactors_09.png
[29]: ./media/successfactors-tutorial/tutorial_successfactors_10.png
