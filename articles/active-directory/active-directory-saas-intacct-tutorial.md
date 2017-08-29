---
title: 'Tutorial: Azure Active Directory integration with Intacct | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Intacct.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 92518e02-a62c-4b1b-a8e9-2803eb2b49ac
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/23/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Intacct

In this tutorial, you learn how to integrate Intacct with Azure Active Directory (Azure AD).

Integrating Intacct with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Intacct
- You can enable your users to automatically get signed-on to Intacct (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Intacct, you need the following items:

- An Azure AD subscription
- An Intacct single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Intacct from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Intacct from the gallery
To configure the integration of Intacct into Azure AD, you need to add Intacct from the gallery to your list of managed SaaS apps.

**To add Intacct from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Intacct**.

	![Creating an Azure AD test user](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_search.png)

5. In the results panel, select **Intacct**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Intacct based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Intacct is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Intacct needs to be established.

In Intacct, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Intacct, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating an Intacct test user](#creating-an-intacct-test-user)** - to have a counterpart of Britta Simon in Intacct that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Intacct application.

**To configure Azure AD single sign-on with Intacct, perform the following steps:**

1. In the Azure portal, on the **Intacct** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_samlbase.png)

3. On the **Intacct Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_url.png)

	In the **Reply URL** textbox, type a URL using the following pattern:
	| |
	|--|
	| `https://<companyname>.intacct.com/ia/acct/sso_response.phtml`|
	| `https://www.intacct.com/ia/acct/sso_response.phtml` |

	> [!NOTE] 
	> This value is not real. Update this value with the actual Reply URL. Contact [Intacct support team](https://us.intacct.com/support) to get this value.

4. On the **SAML Signing Certificate** section, click **Certificate(Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-intacct-tutorial/tutorial_general_400.png)

6. On the **Intacct Configuration** section, click **Configure Intacct** to open **Configure sign-on** window. Copy the **SAML Entity ID and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_configure.png) 

7. In a different web browser window, sign in to your Intacct company site as an administrator.

8. Click the **Company** tab, and then click **Company Info**.

    ![Company](./media/active-directory-saas-intacct-tutorial/ic790037.png "Company")

9. Click the **Security** tab, and then click **Edit**.

    ![Security](./media/active-directory-saas-intacct-tutorial/ic790038.png "Security")

10. In the **Single sign on (SSO)** section, perform the following steps:

   	![Single sign on](./media/active-directory-saas-intacct-tutorial/ic790039.png "single sign on")

    a. Select **Enable single sign on**.

    b. As **Identity provider type**, select **SAML 2.0**.

    c. In **Issuer URL** textbox, paste the value of **SAML Entity ID** which you have copied from Azure portal.
   
    d. In **Login URL** textbox, paste the value of **SAML Single Sign-On Service URL** which you have copied from Azure portal.

    e. Open your **base-64** encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **Certificate** box.
   
    f. Click **Save**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-intacct-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-intacct-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-intacct-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-intacct-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating an Intacct test user

To set up Azure AD users so they can sign in to Intacct, they must be provisioned into Intacct. For Intacct, provisioning is a manual task.

**To provision user accounts, perform the following steps:**

1. Sign in to your **Intacct** tenant.

2. Click the **Company** tab, and then click **Users**.

    ![Users](./media/active-directory-saas-intacct-tutorial/ic790041.png "Users")
3. Click the **Add** tab.

    ![Add](./media/active-directory-saas-intacct-tutorial/ic790042.png "Add")
4. In the **User Information** section, perform the following steps:

    ![User Information](./media/active-directory-saas-intacct-tutorial/ic790043.png "User Information")

    a. Enter the **User ID**, the **Last name**, **First name**, the **Email address**, the **Title**, and the **Phone** of an Azure AD account that you want to provision into the **User Information** section.

    b. Select the **Admin privileges** of an Azure AD account that you want to provision.
   
    c. Click **Save**. The Azure AD account holder receives an email and follows a link to confirm their account before it becomes active.

>[!NOTE]
>To provision Azure AD user accounts, you can use other Intacct user account creation tools or APIs that are provided by Intacct.
		
### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Intacct.

![Assign User][200] 

**To assign Britta Simon to Intacct, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Intacct**.

	![Configure Single Sign-On](./media/active-directory-saas-intacct-tutorial/tutorial_intacct_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration by using the Access Panel.

When you click the Intacct tile in the Access Panel, you should be automatically signed in to your Intacct application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-intacct-tutorial/tutorial_general_203.png

