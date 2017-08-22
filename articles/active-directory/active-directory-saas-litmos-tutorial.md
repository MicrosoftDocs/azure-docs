---
title: 'Tutorial: Azure Active Directory integration with Litmos | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Litmos.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: cfaae4bb-e8e5-41d1-ac88-8cc369653036
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/19/2017
ms.author: jeedes
ms.reviewer: jeedes

---
# Tutorial: Azure Active Directory integration with Litmos

In this tutorial, you learn how to integrate Litmos with Azure Active Directory (Azure AD).

Integrating Litmos with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Litmos.
- You can enable your users to automatically get signed-on to Litmos (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Litmos, you need the following items:

- An Azure AD subscription
- A Litmos single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Litmos from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Litmos from the gallery
To configure the integration of Litmos into Azure AD, you need to add Litmos from the gallery to your list of managed SaaS apps.

**To add Litmos from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Litmos**, select **Litmos** from result panel then click **Add** button to add the application.

	![Litmos in the results list](./media/active-directory-saas-litmos-tutorial/tutorial_litmos_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Litmos based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Litmos is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Litmos needs to be established.

In Litmos, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Litmos, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a Litmos test user](#create-a-litmos-test-user)** - to have a counterpart of Britta Simon in Litmos that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Litmos application.

**To configure Azure AD single sign-on with Litmos, perform the following steps:**

1. In the Azure portal, on the **Litmos** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/active-directory-saas-litmos-tutorial/tutorial_litmos_samlbase.png)

3. On the **Litmos Domain and URLs** section, perform the following steps:

	![Litmos Domain and URLs single sign-on information](./media/active-directory-saas-litmos-tutorial/tutorial_litmos_url.png)

    a. In the **Identifier** textbox, type a URL using the following pattern: `https://<companyname>.litmos.com/account/Login`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://<companyname>.litmos.com/integration/samllogin`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Identifier and Reply URL, which are explained later in tutorial or contact [Litmos support team](https://www.litmos.com/contact-us/) to get these values.

4. On the **SAML Signing Certificate** section, click **Certificate(Base64)** and then save the certificate file on your computer.

	![The Certificate download link](./media/active-directory-saas-litmos-tutorial/tutorial_litmos_certificate.png)

5. As part of the configuration, you need to customize the **SAML Token Attributes** for your Litmos application.

	![Attribute Section](./media/active-directory-saas-litmos-tutorial/tutorial_attribute.png)
      	   
	| Attribute Name   | Attribute Value |   
    | ---------------  | ----------------|
	| FirstName |user.givenname |
	| LastName  |user.surname |
	| Email |user.mail |

	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Add attribute](./media/active-directory-saas-litmos-tutorial/tutorial_attribute_04.png)

	![Add attribute Dailog](./media/active-directory-saas-litmos-tutorial/tutorial_attribute_05.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. From the **Value** list, type the attribute value shown for that row.
	
	d. Click **Ok**.	 

6. Click **Save** button.

	![Configure Single Sign-On Save button](./media/active-directory-saas-litmos-tutorial/tutorial_general_400.png)

7. In a different browser window, sign-on to your Litmos company site as administrator.

8. In the navigation bar on the left side, click **Accounts**.
   
    ![Accounts Section on App Side][22] 

9. Click the **Integrations** tab.
   
    ![Integration Tab][23] 

10. On the **Integrations** tab, scroll down to **3rd Party Integrations**, and then click **SAML 2.0** tab.
   
    ![SAML 2.0 Section][24] 

11. Copy the value under **The SAML endpoint for litmos is:** and paste it into the **Reply URL** textbox in the **Litmos Domain and URLs** section in Azure portal. 
   
    ![SAML endpoint][26] 

12. In your **Litmos** application, perform the following steps:
    
     ![Litmos Application][25] 
     
	 a. Click **Enable SAML**.
    
	 b. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **SAML X.509 Certificate** textbox.
	 
	 c. Click **Save Changes**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/active-directory-saas-litmos-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/active-directory-saas-litmos-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/active-directory-saas-litmos-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/active-directory-saas-litmos-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
  
### Create a Litmos test user

The objective of this section is to create a user called Britta Simon in Litmos.  
The Litmos application supports Just-in-Time provisioning. This means, a user account is automatically created if necessary during an attempt to access the application using the Access Panel.

**To create a user called Britta Simon in Litmos, perform the following steps:**

1. In a different browser window, sign-on to your Litmos company site as administrator.

2. In the navigation bar on the left side, click **Accounts**.
   
    ![Accounts Section On App Side][22] 

3. Click the **Integrations** tab.
   
    ![Integrations Tab][23] 

4. On the **Integrations** tab, scroll down to **3rd Party Integrations**, and then click **SAML 2.0** tab.
   
    ![SAML 2.0][24] 
	
5. Select **Autogenerate Users**
   
    ![Autogenerate Users][27] 

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Litmos.

![Assign the user role][200] 

**To assign Britta Simon to Litmos, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Litmos**.

	![The Litmos link in the Applications list](./media/active-directory-saas-litmos-tutorial/tutorial_litmos_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.  

When you click the Litmos tile in the Access Panel, you should get automatically signed-on to your Litmos application. 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_04.png
[21]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_60.png
[22]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_61.png
[23]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_62.png
[24]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_63.png
[25]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_64.png
[26]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_65.png
[27]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_66.png

[100]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_203.png

