---
title: 'Tutorial: Azure Active Directory integration with Workpath | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Workpath.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 320b0daf-14be-4813-b59b-25a6a5070690
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/22/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Workpath

In this tutorial, you learn how to integrate Workpath with Azure Active Directory (Azure AD).

Integrating Workpath with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Workpath
- You can enable your users to automatically get signed-on to Workpath (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Workpath, you need the following items:

- An Azure AD subscription
- A Workpath single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Workpath from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Workpath from the gallery
To configure the integration of Workpath into Azure AD, you need to add Workpath from the gallery to your list of managed SaaS apps.

**To add Workpath from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Workpath**.

	![Creating an Azure AD test user](./media/active-directory-saas-workpath-tutorial/tutorial_workpath_search.png)

5. In the results panel, select **Workpath**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-workpath-tutorial/tutorial_workpath_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Workpath based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Workpath is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Workpath needs to be established.

In Workpath, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Workpath, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Workpath test user](#creating-a-workpath-test-user)** - to have a counterpart of Britta Simon in Workpath that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Workpath application.

**To configure Azure AD single sign-on with Workpath, perform the following steps:**

1. In the Azure portal, on the **Workpath** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-workpath-tutorial/tutorial_workpath_samlbase.png)

3. On the **Workpath Domain and URLs** section, If you wish to configure the application in **IDP** initiated mode perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-workpath-tutorial/tutorial_workpath_url.png)

    a. In the **Identifier** textbox, type a URL using the following pattern: `https://api.workpath.com/v1/saml/metadata/<instancename>`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://api.workpath.com/v1/saml/assert/<instancename>`

4. Check **Show advanced URL settings**. If you wish to configure the application in **SP** initiated mode, perform the following steps:

    ![Configure Single Sign-On](./media/active-directory-saas-workpath-tutorial/tutorial_workpath_url1.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<subdomain>.workpath.com/ `

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-on URL, Identifier and Reply URL. Contact [Workpath support team](https://help.workpath.com) to get these values.

5. Workpath application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the "**User Attributes**" section on application integration page. The following screenshot shows an example for this configuration. 

    ![Configure Single Sign-On](./media/active-directory-saas-workpath-tutorial/tutorial_workpath_attributes.png)
    
6. In the **User Attributes** section on the **Single sign-on** dialog, configure SAML token attribute as shown in the image and perform the following steps:
	
	| Attribute Name | Attribute Value |
	| ------------------- | -------------------- |    
	| first_name | user.givenname |
	| last_name | user.surname |
	
	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Single Sign-On](./media/active-directory-saas-workpath-tutorial/tutorial_attribute_04.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	![Configure Single Sign-On](./media/active-directory-saas-workpath-tutorial/tutorial_attribute_05.png)

	c. From the **Value** list, type the attribute value shown for that row.

    d. Leave the **Namespace** textbox blank.
	
	e. Click **Ok**.
    

7. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-workpath-tutorial/tutorial_workpath_certificate.png) 

8. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-workpath-tutorial/tutorial_general_400.png)

9. On the **Workpath Configuration** section, click **Configure Workpath** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-workpath-tutorial/tutorial_workpath_configure.png) 

10. To configure single sign-on on **Workpath** side, you need to send the downloaded **Metadata XML**, **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** to [Workpath support team](https://help.workpath.com). 

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-workpath-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-workpath-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-workpath-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-workpath-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Workpath test user

Workpath supports Just in time user provisioning. After authentication users are created in the application automatically. 


### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Workpath.

![Assign User][200] 

**To assign Britta Simon to Workpath, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Workpath**.

	![Configure Single Sign-On](./media/active-directory-saas-workpath-tutorial/tutorial_workpath_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Workpath tile in the Access Panel, you should get automatically signed-on to your Workpath application.
For more information about the Access Panel, see [introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-workpath-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-workpath-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-workpath-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-workpath-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-workpath-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-workpath-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-workpath-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-workpath-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-workpath-tutorial/tutorial_general_203.png

