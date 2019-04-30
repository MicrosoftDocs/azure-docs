---
title: 'Tutorial: Azure Active Directory integration with Atlassian Cloud | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Atlassian Cloud.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: barbkess

ms.assetid: 729b8eb6-efc4-47fb-9f34-8998ca2c9545
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 02/11/2018
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Atlassian Cloud

In this tutorial, you learn how to integrate Atlassian Cloud with Azure Active Directory (Azure AD).
Integrating Atlassian Cloud with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Atlassian Cloud.
* You can enable your users to be automatically signed-in to Atlassian Cloud (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Atlassian Cloud, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Atlassian Cloud single sign-on enabled subscription
* To enable Security Assertion Markup Language (SAML) single sign-on for Atlassian Cloud products, you need to set up Atlassian Access. Learn more about [Atlassian Access]( https://www.atlassian.com/enterprise/cloud/identity-manager).

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Atlassian Cloud supports **SP and IDP** initiated SSO

## Adding Atlassian Cloud from the gallery

To configure the integration of Atlassian Cloud into Azure AD, you need to add Atlassian Cloud from the gallery to your list of managed SaaS apps.

**To add Atlassian Cloud from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Atlassian Cloud**, select **Atlassian Cloud** from result panel then click **Add** button to add the application.

	 ![Atlassian Cloud in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Atlassian Cloud based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Atlassian Cloud needs to be established.

To configure and test Azure AD single sign-on with Atlassian Cloud, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Atlassian Cloud Single Sign-On](#configure-atlassian-cloud-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Atlassian Cloud test user](#create-atlassian-cloud-test-user)** - to have a counterpart of Britta Simon in Atlassian Cloud that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Atlassian Cloud, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Atlassian Cloud** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, If you wish to configure the application in **IDP** initiated mode, perform the following steps:

    ![[Application Name] Domain and URLs single sign-on information](common/idp-relay.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://auth.atlassian.com/saml/<unique ID>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://auth.atlassian.com/login/callback?connection=saml-<unique ID>`

	c. Click **Set additional URLs**.

	d. In the **Relay State** text box, type a URL using the following pattern:
    `https://<instancename>.atlassian.net`

    > [!NOTE]
    > The preceding values are not real. Update these values with the actual identifier and reply URL. You will get these real values from the Atlassian Cloud SAML Configuration screen which is explained later in the tutorial.

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![[Application Name] Domain and URLs single sign-on information](common/both-signonurl.png)

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<instancename>.atlassian.net`

    > [!NOTE]
	> The preceding Sign on URL value is not real. Update the value with the actual Sign on URL. Contact [Atlassian Cloud Client support team](https://support.atlassian.com/) to get this value.

6. Your Atlassian Cloud application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes, where as **nameidentifier** is mapped with **user.userprincipalname**. Atlassian Cloud application expects **nameidentifier** to be mapped with **user.mail**, so you need to edit the attribute mapping by clicking on **Edit** icon and change the attribute mapping.

	![image](common/edit-attribute.png)

7. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

8. On the **Set up Atlassian Cloud** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure Atlassian Cloud Single Sign-On

1. To get SSO configured for your application, sign in to the Atlassian portal with administrator credentials.

2. You need to verify your domain before going to configure single sign-on. For more information, see [Atlassian domain verification](https://confluence.atlassian.com/cloud/domain-verification-873871234.html) document.

3. In the left pane, select **SAML single sign-on**. If you haven't already done so, subscribe to Atlassian Identity Manager.

	![Configure single sign-on](./media/atlassian-cloud-tutorial/tutorial_atlassiancloud_11.png)

4. In the **Add SAML configuration** window, do the following:

	![Configure single sign-on](./media/atlassian-cloud-tutorial/tutorial_atlassiancloud_12.png)

	a. In the **Identity provider Entity ID** box, paste the SAML entity ID that you copied from the Azure portal.

    b. In the **Identity provider SSO URL** box, paste the SAML single sign-on service URL that you copied from the Azure portal.

    c. Open the downloaded certificate from the Azure portal in a .txt file, copy the value (without the *Begin Certificate* and *End Certificate* lines), and then paste it in the **Public X509 certificate** box.

    d. Click **Save Configuration**.

5. To ensure that you have set up the correct URLs, update the Azure AD settings by doing the following:

    ![Configure single sign-on](./media/atlassian-cloud-tutorial/tutorial_atlassiancloud_13.png)

	a. In the SAML window, copy the **SP Identity ID** and then, in the Azure portal, under Atlassian Cloud **Domain and URLs**, paste it in the **Identifier** box.

	b. In the SAML window, copy the **SP Assertion Consumer Service URL** and then, in the Azure portal, under Atlassian Cloud **Domain and URLs**, paste it in the **Reply URL** box. The sign-on URL is the tenant URL of your Atlassian Cloud.

	> [!NOTE]
	> If you're an existing customer, after you update the **SP Identity ID** and **SP Assertion Consumer Service URL** values in the Azure portal, select **Yes, update configuration**. If you're a new customer, you can skip this step.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon\@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Atlassian Cloud.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Atlassian Cloud**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, type and select **Atlassian Cloud**.

	![The Atlassian Cloud link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Atlassian Cloud test user

To enable Azure AD users to sign in to Atlassian Cloud, provision the user accounts manually in Atlassian Cloud by doing the following:

1. In the **Administration** pane, select **Users**.

	![The Atlassian Cloud Users link](./media/atlassian-cloud-tutorial/tutorial_atlassiancloud_14.png)

2. To create a user in Atlassian Cloud, select **Invite user**.

	![Create an Atlassian Cloud user](./media/atlassian-cloud-tutorial/tutorial_atlassiancloud_15.png)

3. In the **Email address** box, enter the user's email address, and then assign the application access.

	![Create an Atlassian Cloud user](./media/atlassian-cloud-tutorial/tutorial_atlassiancloud_16.png)

4. To send an email invitation to the user, select **Invite users**. An email invitation is sent to the user and, after accepting the invitation, the user is active in the system.

> [!NOTE]
> You can also bulk-create users by selecting the **Bulk Create** button in the **Users** section.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Atlassian Cloud tile in the Access Panel, you should be automatically signed in to the Atlassian Cloud for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
   
