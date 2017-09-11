---
title: 'Tutorial: Azure Active Directory integration with Workrite | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Workrite.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 2a5c2956-a011-4d5c-877b-80679b6587b5
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/19/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Workrite

In this tutorial, you learn how to integrate Workrite with Azure Active Directory (Azure AD).

Integrating Workrite with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Workrite.
- You can enable your users to automatically get signed-on to Workrite (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Workrite, you need the following items:

- An Azure AD subscription
- A Workrite single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Workrite from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Workrite from the gallery
To configure the integration of Workrite into Azure AD, you need to add Workrite from the gallery to your list of managed SaaS apps.

**To add Workrite from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Workrite**, select **Workrite** from result panel then click **Add** button to add the application.

	![Workrite in the results list](./media/active-directory-saas-workrite-tutorial/tutorial_workrite_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Workrite based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Workrite is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Workrite needs to be established.

In Workrite, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Workrite, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a Workrite test user](#create-a-workrite-test-user)** - to have a counterpart of Britta Simon in Workrite that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Workrite application.

**To configure Azure AD single sign-on with Workrite, perform the following steps:**

1. In the Azure portal, on the **Workrite** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/active-directory-saas-workrite-tutorial/tutorial_workrite_samlbase.png)

3. On the **Workrite Domain and URLs** section, perform the following steps:

	![Workrite Domain and URLs single sign-on information](./media/active-directory-saas-workrite-tutorial/tutorial_workrite_url.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://app.workrite.co.uk/securelogin/samlgateway.aspx?id=<uniqueid>`

	> [!NOTE] 
	> This value is not real. Update this value with the actual Sign-On URL. Contact [Workrite Client support team](mailto:support@workrite.co.uk) to get this value.

4. On the **SAML Signing Certificate** section, click **Certificate(Base64)** and then save the certificate file on your computer.

	![The Certificate download link](./media/active-directory-saas-workrite-tutorial/tutorial_workrite_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On Save button](./media/active-directory-saas-workrite-tutorial/tutorial_general_400.png)

6. On the **Workrite Configuration** section, click **Configure Workrite** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Workrite Configuration](./media/active-directory-saas-workrite-tutorial/tutorial_workrite_configure.png) 

7. To configure single sign-on on **Workrite** side, you need to send the downloaded **Certificate(Base64), Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** to [Workrite support team](mailto:support@workrite.co.uk).

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/active-directory-saas-workrite-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/active-directory-saas-workrite-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/active-directory-saas-workrite-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/active-directory-saas-workrite-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Workrite test user

The objective of this section is to create a user called Britta Simon in Workrite.

**To create a user called Britta Simon in Workrite, perform the following steps:**

1. Sign on to your workrite company site as administrator.

2. In the navigation pane, click **Admin**.
   
    ![Admin Control][400]

3. Go to Quick Links, and then click **Create a User**.
   
    ![Create User Section][401]

4. On the **Create User** dialog, perform the following steps:
   
    ![Create User Dailog][402]
	
	a. In the **Email** textbox, type the email address of user like Brittasimon@contoso.com.

	b. In the **First Name** textbox, type the firstname of user like Britta.

	c. In the **Surname** textbox, type the surname of user like Simon.
	
	d. Select **Client Administrator** as **Choose Role**.
	
	e. Click **Save**.   

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Workrite.

![Assign the user role][200] 

**To assign Britta Simon to Workrite, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Workrite**.

	![The Workrite link in the Applications list](./media/active-directory-saas-workrite-tutorial/tutorial_workrite_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

The objective of this section is to test your Azure AD SSO configuration using the Access Panel.

When you click the Workrite tile in the Access Panel, you should get automatically signed-on to your Workrite application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-workrite-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-workrite-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-workrite-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-workrite-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-workrite-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-workrite-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-workrite-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-workrite-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-workrite-tutorial/tutorial_general_203.png
[400]: ./media/active-directory-saas-workrite-tutorial/tutorial_workrite_400.png
[401]: ./media/active-directory-saas-workrite-tutorial/tutorial_workrite_401.png
[402]: ./media/active-directory-saas-workrite-tutorial/tutorial_workrite_402.png

