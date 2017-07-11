---
title: 'Tutorial: Azure Active Directory integration with PerformanceCentre | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and PerformanceCentre.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 65288c32-f7e6-4eb3-a6dc-523c3d748d1c
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/28/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with PerformanceCentre

In this tutorial, you learn how to integrate PerformanceCentre with Azure Active Directory (Azure AD).

Integrating PerformanceCentre with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to PerformanceCentre
- You can enable your users to automatically get signed-on to PerformanceCentre (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with PerformanceCentre, you need the following items:

- An Azure AD subscription
- A PerformanceCentre single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding PerformanceCentre from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding PerformanceCentre from the gallery
To configure the integration of PerformanceCentre into Azure AD, you need to add PerformanceCentre from the gallery to your list of managed SaaS apps.

**To add PerformanceCentre from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **PerformanceCentre**.

	![Creating an Azure AD test user](./media/active-directory-saas-performancecentre-tutorial/tutorial_performancecentre_search.png)

5. In the results panel, select **PerformanceCentre**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-performancecentre-tutorial/tutorial_performancecentre_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with PerformanceCentre based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in PerformanceCentre is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in PerformanceCentre needs to be established.

In PerformanceCentre, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with PerformanceCentre, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a PerformanceCentre test user](#creating-a-performancecentre-test-user)** - to have a counterpart of Britta Simon in PerformanceCentre that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your PerformanceCentre application.

**To configure Azure AD single sign-on with PerformanceCentre, perform the following steps:**

1. In the Azure portal, on the **PerformanceCentre** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-performancecentre-tutorial/tutorial_performancecentre_samlbase.png)

3. On the **PerformanceCentre Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-performancecentre-tutorial/tutorial_performancecentre_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `http://companyname.performancecentre.com/saml/SSO`

	b. In the **Identifier** textbox, type a URL using the following pattern: `http://companyname.performancecentre.com`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [PerformanceCentre Client support team](https://www.performancecentre.com/contact-us/) to get these values. 

4. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-performancecentre-tutorial/tutorial_performancecentre_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-performancecentre-tutorial/tutorial_general_400.png)

6. On the **PerformanceCentre Configuration** section, click **Configure PerformanceCentre** to open **Configure sign-on** window. Copy the **SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-performancecentre-tutorial/tutorial_performancecentre_configure.png) 

7. Sign-on to your **PerformanceCentre** company site as administrator.

8. In the tab on the left side, click **Configure**.
   
    ![Azure AD Single Sign-On][10]

9. In the tab on the left side, click **Miscellaneous**, and then click **Single Sign On**.
   
    ![Azure AD Single Sign-On][11]

10. As **Protocol**, select **SAML**.
   
    ![Azure AD Single Sign-On][12]

11. Open your downloaded metadata file in notepad, copy the content, paste it into the **Identity Provider Metadata** textbox, and then click **Save**.
   
    ![Azure AD Single Sign-On][13]

12. Verify that the values for the **Entity Base URL** and **Entity ID URL** are correct.
    
     ![Azure AD Single Sign-On][14]

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-performancecentre-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-performancecentre-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-performancecentre-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-performancecentre-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a PerformanceCentre test user

The objective of this section is to create a user called Britta Simon in PerformanceCentre.

**To create a user called Britta Simon in PerformanceCentre, perform the following steps:**

1. Sign on to your PerformanceCentre company site as administrator.

2. In the menu on the left, click **Interrelate**, and then click **Create Participant**.
   
    ![Create User][400]

3. On the **Interrelate - Create Participant** dialog, perform the following steps:
   
    ![Create User][401]
	
	a. Type the required attributes for Britta Simon into related textboxes.
	
	>[!IMPORTANT]
    >Britta's User Name attribute in PerformanceCentre must be the same as the User Name in Azure AD.
	
	b. Select **Client Administrator** as **Choose Role**.
	
	c. Click **Save**. 

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to PerformanceCentre.

![Assign User][200] 

**To assign Britta Simon to PerformanceCentre, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **PerformanceCentre**.

	![Configure Single Sign-On](./media/active-directory-saas-performancecentre-tutorial/tutorial_performancecentre_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD SSO configuration using the Access Panel.  

When you click the PerformanceCentre tile in the Access Panel, you should get automatically signed-on to your PerformanceCentre application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_general_04.png
[10]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_performancecentre_06.png
[11]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_performancecentre_07.png
[12]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_performancecentre_08.png
[13]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_performancecentre_09.png
[14]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_performancecentre_10.png

[100]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_general_203.png
[400]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_performancecentre_11.png
[401]: ./media/active-directory-saas-performancecentre-tutorial/tutorial_performancecentre_12.png

