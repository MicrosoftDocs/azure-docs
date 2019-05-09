---
title: 'Tutorial: Azure Active Directory integration with Soloinsight-CloudGate SSO | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Soloinsight-CloudGate SSO.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 9263c241-85a4-4724-afac-0351d6275958
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 02/07/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Soloinsight-CloudGate SSO

In this tutorial, you learn how to integrate Soloinsight-CloudGate SSO with Azure Active Directory (Azure AD).
Integrating Soloinsight-CloudGate SSO with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Soloinsight-CloudGate SSO.
* You can enable your users to be automatically signed-in to Soloinsight-CloudGate SSO (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Soloinsight-CloudGate SSO, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Soloinsight-CloudGate SSO single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Soloinsight-CloudGate SSO supports **SP** initiated SSO

## Adding Soloinsight-CloudGate SSO from the gallery

To configure the integration of Soloinsight-CloudGate SSO into Azure AD, you need to add Soloinsight-CloudGate SSO from the gallery to your list of managed SaaS apps.

**To add Soloinsight-CloudGate SSO from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Soloinsight-CloudGate SSO**, select **Soloinsight-CloudGate SSO** from result panel then click **Add** button to add the application.

	 ![Soloinsight-CloudGate SSO in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Soloinsight-CloudGate SSO based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Soloinsight-CloudGate SSO needs to be established.

To configure and test Azure AD single sign-on with Soloinsight-CloudGate SSO, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Soloinsight-CloudGate SSO Single Sign-On](#configure-soloinsight-cloudgate-sso-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Soloinsight-CloudGate SSO test user](#create-soloinsight-cloudgate-sso-test-user)** - to have a counterpart of Britta Simon in Soloinsight-CloudGate SSO that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Soloinsight-CloudGate SSO, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Soloinsight-CloudGate SSO** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![Soloinsight-CloudGate SSO Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.sigateway.com/login`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.sigateway.com/process/sso`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier which is explained later in the **Configure Soloinsight-CloudGate SSO Single Sign-On** section of the tutorial.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up Soloinsight-CloudGate SSO** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure Soloinsight-CloudGate SSO Single Sign-On

1. To get the values that are to be pasted in the Azure portal while configuring Basic SAML, login to the CloudGate Web Portal using your credentials then access the SSO settings, which can be found on the following path **Home>Administration>System settings>General**.

	![CloudGate SSO Settings](./media/soloinsight-cloudgate-sso-tutorial/sso-main-settings.png)

2. **SAML Consumer URL**

	* Copy the links available against the **Saml Consumer URL** and the **Redirect URL** fields and paste them in the Azure Portal **Basic SAML Configuration** section for **Identifier (Entity ID)** and **Reply URL** fields respectively.

		![SAMLIdentifier](./media/soloinsight-cloudgate-sso-tutorial/saml-identifier.png)

3. **SAML Signing Certificate**

	* Go to the source of the Certificate (Base64) file that was downloaded from Azure Portal SAML Signing Certificate lists and right-click on it. Choose **Edit with Notepad++** option from the list. 

		![SAMLcertificate](./media/soloinsight-cloudgate-sso-tutorial/certificate-file.png)

	* Copy the content in the Certificate (Base64) Notepad++ file.

		![Certificate copy](./media/soloinsight-cloudgate-sso-tutorial/certificate-copy.png)

	* Paste the content in the CloudGate Web Portal SSO settings **Certificate** field and click on Save button.

		![Certificate portal](./media/soloinsight-cloudgate-sso-tutorial/certificate-portal.png)

4. **Default Group**

	* Select **Business Admin** from the drop-down list of the **Default Group** option in the CloudGate Web Portal

		![Default group](./media/soloinsight-cloudgate-sso-tutorial/default-group.png)

5. **AD Identifier and Login URL**

	* The copied **Login URL** from the Azure Portal **Set up Soloinsight-CloudGate SSO** configurations are to be entered in the CloudGate Web Portal SSO settings section. 

	* Paste the **Login URL** link from Azure Portal in the CloudGate Web Portal **AD Login URL** field.
	 
	* Paste the **Azure AD Identifier** link from Azure Portal in the CloudGate Web Portal **AD Identifier** field

		![Ad login](./media/soloinsight-cloudgate-sso-tutorial/ad-login.png)

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field, enter **BrittaSimon**.
  
    b. In the **User name** field, type **brittasimon\@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Soloinsight-CloudGate SSO.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Soloinsight-CloudGate SSO**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Soloinsight-CloudGate SSO**.

	![The Soloinsight-CloudGate SSO link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog, select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog, click the **Assign** button.

### Create Soloinsight-CloudGate SSO test user

To Create a test user, Select **Employees** from the main menu of your CloudGate Web Portal and fill out the Add New employee form. The Authority Level that is to be assigned to the test user is **Business Admin** Click on **Create** once all the required fields are filled.

![Employee test](./media/soloinsight-cloudgate-sso-tutorial/employee-test.png)

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Soloinsight-CloudGate SSO tile in the Access Panel, you should be automatically signed in to the Soloinsight-CloudGate SSO for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

