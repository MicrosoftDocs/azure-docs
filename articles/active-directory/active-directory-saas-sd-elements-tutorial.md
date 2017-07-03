---
title: 'Tutorial: Azure Active Directory integration with SD Elements | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SD Elements.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: f0386307-bb3b-4810-8d4b-d0bfebda04f4
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/03/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with SD Elements

In this tutorial, you learn how to integrate SD Elements with Azure Active Directory (Azure AD).

Integrating SD Elements with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to SD Elements
- You can enable your users to automatically get signed-on to SD Elements (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with SD Elements, you need the following items:

- An Azure AD subscription
- A SD Elements single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding SD Elements from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding SD Elements from the gallery
To configure the integration of SD Elements into Azure AD, you need to add SD Elements from the gallery to your list of managed SaaS apps.

**To add SD Elements from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **SD Elements**.

	![Creating an Azure AD test user](./media/active-directory-saas-sd-elements-tutorial/tutorial_sdelements_search.png)

5. In the results panel, select **SD Elements**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-sd-elements-tutorial/tutorial_sdelements_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with SD Elements based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in SD Elements is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in SD Elements needs to be established.

In SD Elements, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with SD Elements, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a SD Elements test user](#creating-a-sd-elements-test-user)** - to have a counterpart of Britta Simon in SD Elements that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your SD Elements application.

**To configure Azure AD single sign-on with SD Elements, perform the following steps:**

1. In the Azure portal, on the **SD Elements** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-sd-elements-tutorial/tutorial_sdelements_samlbase.png)

3. On the **SD Elements Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-sd-elements-tutorial/tutorial_sdelements_url.png)

    a. In the **Identifier** textbox, type a URL using the following pattern: `https://<tenantname>.sdelements.com/sso/saml2/metadata`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://<tenantname>.sdelements.com/sso/saml2/acs/`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [SD Elements support team](mailto:support@sdelements.com) to get these values.

4. SD Elements application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **"Attribute"** tab of the application. The following screenshot shows an example for this.

	![Configure Single Sign-On](./media/active-directory-saas-sd-elements-tutorial/tutorial_sdelements_attribute.png)

5. In the **User Attributes** section on the **Single sign-on** dialog, configure SAML token attribute as shown in the image and perform the following steps: 

    | Attribute Name | Attribute Value |
    | --- | --- |
	| email |user.mail |
	| firstname |user.givenname |
	| lastname |user.surname |

    a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Single Sign-On](./media/active-directory-saas-sd-elements-tutorial/tutorial_officespace_04.png)

	![Configure Single Sign-On](./media/active-directory-saas-sd-elements-tutorial/tutorial_officespace_05.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. From the **Value** list, type the attribute value shown for that row.

	d. Leave the **Namespace** blank.
	
	e. Click **Ok**.
 
6. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-sd-elements-tutorial/tutorial_sdelements_certificate.png) 

7. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-sd-elements-tutorial/tutorial_general_400.png)

8. On the **SD Elements Configuration** section, click **Configure SD Elements** to open **Configure sign-on** window. Copy the **SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-sd-elements-tutorial/tutorial_sdelements_configure.png) 

9. In a different browser window, sign-on to your SD Elements tenant as an administrator.

10. In the menu on the top, click **System**, and then **Single Sign-on**. 
   
    ![Configure Single Sign-On](./media/active-directory-saas-sd-elements-tutorial/tutorial_sd-elements_09.png) 

11. On the **Single Sign-On Settings** dialog, perform the following steps:
   
    ![Configure Single Sign-On](./media/active-directory-saas-sd-elements-tutorial/tutorial_sd-elements_10.png) 
   
    a. As **SSO Type**, select **SAML**.
   
    b. In the **Identity Provider Entity ID** textbox, paste the value of **SAML Entity ID**, which you have copied from Azure portal. 
   
    c. In the **Identity Provider Single Sign-On Service** textbox, paste the value of **SAML Single Sign-On Service URL**, which you have copied from Azure portal. 
   
    d. Click **Save**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-sd-elements-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-sd-elements-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-sd-elements-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-sd-elements-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a SD Elements test user

The objective of this section is to create a user called Britta Simon in SD Elements. In the case of SD Elements, creating SD Elements users is a manual task.

**To create Britta Simon in SD Elements, perform the following steps:**

1. In a web browser window, sign-on to your SD Elements company site as an administrator.

2. In the menu on the top, click **User Management**, and then **Users**.
   
    ![Creating a SD Elements test user](./media/active-directory-saas-sd-elements-tutorial/tutorial_sd-elements_11.png) 

3. Click **Add New User**.
   
    ![Creating a SD Elements test user](./media/active-directory-saas-sd-elements-tutorial/tutorial_sd-elements_12.png)
 
4. On the **Add New User** dialog, perform the following steps:
   
    ![Creating a SD Elements test user](./media/active-directory-saas-sd-elements-tutorial/tutorial_sd-elements_13.png) 
   
    a. In the **E-mail** textbox, enter the email of user like **brittasimon@contoso.com**.
   
    b. In the **First Name** textbox, enter the first name of user like **Britta**.
   
    c. In the **Last Name** textbox, enter the last name of user like **Simon**.
   
    d. As **Role**, select **User**. 
   
    e. Click **Create User**.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to SD Elements.

![Assign User][200] 

**To assign Britta Simon to SD Elements, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **SD Elements**.

	![Configure Single Sign-On](./media/active-directory-saas-sd-elements-tutorial/tutorial_sdelements_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.
  
When you click the SD Elements tile in the Access Panel, you should get automatically signed-on to your SD Elements application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-sd-elements-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-sd-elements-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-sd-elements-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-sd-elements-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-sd-elements-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-sd-elements-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-sd-elements-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-sd-elements-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-sd-elements-tutorial/tutorial_general_203.png

