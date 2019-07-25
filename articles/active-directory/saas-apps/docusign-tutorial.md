---
title: 'Tutorial: Azure Active Directory integration with DocuSign | Microsoft Docs'
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
ms.date: 04/01/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with DocuSign

In this tutorial, you learn how to integrate DocuSign with Azure Active Directory (Azure AD).
Integrating DocuSign with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to DocuSign.
* You can enable your users to be automatically signed-in to DocuSign (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with DocuSign, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* DocuSign single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* DocuSign supports **SP** initiated SSO

* DocuSign supports **Just In Time** user provisioning

## Adding DocuSign from the gallery

To configure the integration of DocuSign into Azure AD, you need to add DocuSign from the gallery to your list of managed SaaS apps.

**To add DocuSign from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **DocuSign**, select **DocuSign** from result panel then click **Add** button to add the application.

	 ![DocuSign in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with DocuSign based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in DocuSign needs to be established.

To configure and test Azure AD single sign-on with DocuSign, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure DocuSign Single Sign-On](#configure-docusign-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create DocuSign test user](#create-docusign-test-user)** - to have a counterpart of Britta Simon in DocuSign that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with DocuSign, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **DocuSign** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![DocuSign Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<subdomain>.docusign.com/organizations/<OrganizationID>/saml2/login/sp/<IDPID>`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<subdomain>.docusign.com/organizations/<OrganizationID>/saml2`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign-On URL and Identifier which is explained later **View SAML 2.0 Endpoints** section in the tutorial.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up DocuSign** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure DocuSign Single Sign-On

1. In a different web browser window, sign to your **DocuSign admin portal** as an administrator.

2. On the top right of the page click on profile **logo** and then click on **Go to Admin**.
  
    ![Configuring single sign-on][51]

3. On your domain solutions page, click on **Domains**

	![Configuring single sign-on][50]

4. Under the **Domains** section, click **CLAIM DOMAIN**.

    ![Configuring single sign-on][52]

5. On the **Claim a domain** dialog, in the **Domain Name** textbox, type your company domain, and then click **CLAIM**. Make sure that you verify the domain and the status is active.

    ![Configuring single sign-on][53]

6. On your domain solutions page, click **Identity Providers**.
  
    ![Configuring single sign-on][54]

7. Under **Identity Providers** section, click **ADD IDENTITY PROVIDER**. 

	![Configuring single sign-on][55]

8. On the **Identity Provider Settings** page, perform the following steps:

	![Configuring single sign-on][56]

    a. In the **Name** textbox, type a unique name for your configuration. Do not use spaces.

    b. In the **Identity Provider Issuer textbox**, paste the value of **Azure AD Identifier**, which you have copied from Azure portal.

    c. In the **Identity Provider Login URL** textbox, paste the value of **Login URL**, which you have copied from Azure portal.

    d. In the **Identity Provider Logout URL** textbox, paste the value of **Logout URL**, which you have copied from Azure portal.

    e. Select **Sign AuthN request**.

    f. As **Send AuthN request by**, select **POST**.

    g. As **Send logout request by**, select **GET**.

	h. In the **Custom Attribute Mapping** section, click on **ADD NEW MAPPING**.

	![Configuring single sign-on][62]

	i. Choose the field you want to map with Azure AD Claim. In this example, the **emailaddress** claim is mapped with the value of **http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress**. It is the default claim name from Azure AD for email claim and then click **SAVE**.

	![Configuring single sign-on][57]

	> [!NOTE]
	> Use the appropriate **User identifier** to map the user from Azure AD to DocuSign user mapping. Select the proper Field and enter the appropriate value based on your organization settings.

	j. In the **Identity Provider Certificates** section, click **ADD CERTIFICATE**, and then upload the certificate you have downloaded from Azure AD portal and click **SAVE**.

	![Configuring single sign-on][58]

	k. In the **Identity Providers** section, click **ACTIONS**, and then click **Endpoints**.

	![Configuring single sign-on][59]

	l. In the **View SAML 2.0 Endpoints** section on **DocuSign admin portal**, perform the following steps:

	![Configuring single sign-on][60]

	* Copy the **Service Provider Issuer URL**, and then paste it into the **Identifier** textbox in **Basic SAML Configuration** section on the Azure portal.

	* Copy the **Service Provider Login URL**, and then paste it into the **Sign On URL** textbox in **Basic SAML Configuration** section on the Azure portal.

	* Click **Close**

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type brittasimon@yourcompanydomain.extension. For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to DocuSign.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **DocuSign**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **DocuSign**.

	![The DocuSign link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create DocuSign test user

In this section, a user called Britta Simon is created in DocuSign. DocuSign supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in DocuSign, a new one is created after authentication.

>[!Note]
>If you need to create a user manually, contact [DocuSign support team](https://support.docusign.com/).

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the DocuSign tile in the Access Panel, you should be automatically signed in to the DocuSign for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

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
