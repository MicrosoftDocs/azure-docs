---
title: 'Tutorial: Azure Active Directory integration with Mitel Connect | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Mitel Connect.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 204f540b-09f1-452b-a52f-78143710ef76
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 05/03/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Mitel MiCloud Connect

In this tutorial, you'll learn how to integrate Mitel MiCloud Connect with Azure Active Directory (Azure AD). Integrating MiCloud Connect with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to MiCloud Connect apps using their enterprise credentials.
* You can enable users on your account to be automatically signed-in to MiCloud Connect (Single Sign-On) with their Azure AD accounts.


If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with MiCloud Connect, you need the following items:

* An Azure AD subscription

  If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* A Mitel MiCloud Connect account

## Scenario description

In this tutorial, you'll configure and test Azure AD single sign-on (SSO).

* Mitel Connect supports **SP** initiated SSO

## Adding Mitel Connect from the gallery

To configure the integration of Mitel Connect into Azure AD, you need to add Mitel Connect from the gallery to your list of managed SaaS apps in the Azure portal.

**To add Mitel Connect from the gallery, do the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Click **Enterprise Applications** and then click **All Applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. Click **New application**.

	![The New application button](common/add-new-app.png)

4. Type **Mitel Connect** in the search field, click **Mitel Connect** from results panel, and then click **Add**.

	 ![Mitel Connect in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you'll configure and test Azure AD single sign-on with MiCloud Connect based on a test user named **Britta Simon**. For single sign-on to work, a link relationship between an Azure AD user and the related user in MiCloud Connect needs to be established.

To configure and test Azure AD single sign-on with MiCloud Connect, you need to complete the following steps:

1. **[Configure MiCloud Connect for SSO with Azure AD](#configure-micloud-connect-for-sso-with-azure-ad)** - to enable your users to use this feature and to configure the SSO settings on the application side.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
4. **[Create a Mitel MiCloud Connect test user](#create-a-mitel-micloud-connect-test-user)** - to have a counterpart of Britta Simon on your MiCloud Connect account that is linked to the Azure AD representation of the user.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure MiCloud Connect for SSO with Azure AD

In this section, you'll enable Azure AD single sign-on for MiCloud Connect in the Azure portal and configure your MiCloud Connect account to allow SSO using Azure AD.

To configure MiCloud Connect with SSO for Azure AD, it is easiest to open the Azure portal and the Mitel Account portal side by side. You'll need to copy some information from the Azure portal to the Mitel Account portal and some from the Mitel Account portal to the Azure portal.


1. To open the configuration page in the [Azure portal](https://portal.azure.com/), do the following:

    a. On the **Mitel Connect** application integration page, click **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

    b. In the **Select a Single sign-on method** dialog, click **SAML**.

    ![Single sign-on select mode](common/select-saml-option.png)
	
	The SAML-based sign-on page is displayed.

2. To open the configuration dialog in the Mitel Account portal, do the following:

    a. On the **Phone System** menu, click **Add-On Features**.

    b. To the right of **Single Sign-On**, click **Activate** or **Settings**.
    
    The Connect Single Sign-On Settings dialog box appears.
	
3. Select the **Enable Single Sign-On** check box.
    ![image](./media/mitel-connect-tutorial/Mitel_Connect_Enable.png)


4. In the Azure portal, click the **Edit** icon in the **Basic SAML Configuration** section.
    ![image](common/edit-urls.png)

    The Basic SAML Configuration dialog box appears.

5.  Copy the URL from the **Mitel Identifier (Entity ID)** field in the Mitel Account portal and paste it into the **Identifier (Entity ID)** field in the Azure portal.

6. Copy the URL from the **Reply URL (Assertion Consumer Service URL)** field in the Mitel Account portal and paste it into the **Reply URL (Assertion Consumer Service URL)** field in the Azure portal.  
   ![image](./media/mitel-connect-tutorial/Mitel_Azure_BasicConfig.png)

7. In the **Sign on URL** text box, type one of the following URLs:

    * **https://portal.shoretelsky.com** - to use the Mitel Account portal as your default Mitel application
    * **https://teamwork.shoretel.com** - to use Teamwork as your default Mitel application

    **NOTE**: The default Mitel application is the application accessed when a user clicks on the Mitel Connect tile in the Access Panel. This is also the application accessed when doing a test setup from Azure AD.

8. Click **Save** in the **Basic SAML Configuration** dialog box in the Azure portal.

9. In the **SAML Signing Certificate** section on the **SAML-based sign-on** page in the Azure portal, click **Download** next to **Certificate (Base64)** to download the **Signing Certificate** and save it to your computer.
    ![image](./media/mitel-connect-tutorial/Azure_SigningCert.png)

10. Open the Signing Certificate file in a text editor, copy all data in the file, and then paste the data in the **Signing Certificate** field in the Mitel Account portal. 
    ![image](./media/mitel-connect-tutorial/Mitel_Connect_SigningCert.png)

11. In the **Setup Mitel Connect** section on the **SAML-based sign-on** page of the Azure portal, do the following:

    a. Copy the URL from the **Login URL** field and paste it into the **Sign-in URL** field in the Mitel Account portal.

    b. Copy the URL from the **Azure AD Identifier** field and paste it into the **Entity ID** field in the Mitel Account portal.
    ![image](./media/mitel-connect-tutorial/Mitel_Azure_SetupConnect.png)

12. Click **Save** on the **Connect Single Sign-On Settings** dialog box in the Mitel Account portal.

### Create an Azure AD test user 

In this section, you'll create a test user named Britta Simon in the Azure portal.

1. In the Azure portal, in the left pane, click **Azure Active Directory**, click **Users**, and then click **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Click **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties dialog, do the following steps:

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field, type **BrittaSimon**.
  
    b. In the **User name** field, type brittasimon@\<yourcompanydomain\>.\<extension\>.  
For example, BrittaSimon@contoso.com.

    c. Select the **Show password** check box, and then write down the value that is displayed in the **Password** box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable Britta Simon to use Azure single sign-on by granting access to Mitel Connect.

1. In the Azure portal, click **Enterprise Applications**, and then click **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, click **Mitel Connect**.

	![The Mitel Connect link in the Applications list](common/all-applications.png)

3. In the menu on the left, click **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click **Add user**, then click **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog, select **Britta Simon** in the **Users** list, then click **Select** at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion, select the appropriate role for the user from the list in the **Select Role** dialog, and then click **Select** at the bottom of the screen.

7. In the **Add Assignment** dialog, click **Assign**.

### Create a Mitel MiCloud Connect test user

In this section, you create a user named Britta Simon on your MiCloud Connect account. Users must be created and activated before using single sign-on.

For details about adding users in the Mitel Account portal, see the [Adding a User](https://oneview.mitel.com/s/article/Adding-a-User-092815) article in the Mitel Knowledge Base.

Create a user on your MiCloud Connect account with the following details:

  * **Name:** Britta Simon

* **Business Email Address:** `brittasimon@<yourcompanydomain>.<extension>`   
(Example: [brittasimon@contoso.com](mailto:brittasimon@contoso.com))

* **Username:** `brittasimon@<yourcompanydomain>.<extension>`  
(Example: [brittasimon@contoso.com](mailto:brittasimon@contoso.com); the user’s username is typically the same as the user’s business email address)

**NOTE:** The user’s MiCloud Connect username must be identical to the user’s email address in Azure.

### Test single sign-on

In this section, you'll test your Azure AD single sign-on configuration using the Access Panel.

When you click the Mitel Connect tile in the Access Panel, you should be automatically redirected to sign in to the MiCloud Connect application you configured as your default in the **Sign on URL** field. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
