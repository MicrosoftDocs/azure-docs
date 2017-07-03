---
title: 'Tutorial: Azure Active Directory integration with ThirdLight | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and ThirdLight.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 168aae9a-54ee-4c2b-ab12-650a2c62b901
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/16/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with ThirdLight

In this tutorial, you learn how to integrate ThirdLight with Azure Active Directory (Azure AD).

Integrating ThirdLight with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to ThirdLight
- You can enable your users to automatically get signed-on to ThirdLight (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with ThirdLight, you need the following items:

- An Azure AD subscription
- A ThirdLight single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding ThirdLight from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding ThirdLight from the gallery
To configure the integration of ThirdLight into Azure AD, you need to add ThirdLight from the gallery to your list of managed SaaS apps.

**To add ThirdLight from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **ThirdLight**.

	![Creating an Azure AD test user](./media/active-directory-saas-thirdlight-tutorial/tutorial_thirdlight_search.png)

5. In the results panel, select **ThirdLight**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-thirdlight-tutorial/tutorial_thirdlight_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with ThirdLight based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in ThirdLight is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in ThirdLight needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in ThirdLight.

To configure and test Azure AD single sign-on with ThirdLight, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a ThirdLight test user](#creating-a-thirdlight-test-user)** - to have a counterpart of Britta Simon in ThirdLight that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your ThirdLight application.

**To configure Azure AD single sign-on with ThirdLight, perform the following steps:**

1. In the Azure portal, on the **ThirdLight** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-thirdlight-tutorial/tutorial_thirdlight_samlbase.png)

3. On the **ThirdLight Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-thirdlight-tutorial/tutorial_thirdlight_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<subdomain>.thirdlight.com/`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<subdomain>.thirdlight.com/saml/sp`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identiifer. Contact [ThirdLight Client support team](https://www.thirdlight.com/support) to get these values. 
 
4. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the XML file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-thirdlight-tutorial/tutorial_thirdlight_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-thirdlight-tutorial/tutorial_general_400.png)

6. In a different web browser window, log in to your ThirdLight company site as an administrator.

7. Go to **Configuration \> System Administration**, and then click **SAML2**.
   
    ![System Administration](./media/active-directory-saas-thirdlight-tutorial/ic805843.png "System Administration")

8. In the SAML2 configuration section, perform the following steps:
   
    ![SAML Single Sign-On](./media/active-directory-saas-thirdlight-tutorial/ic805844.png "SAML Single Sign-On")   

	 a. Select **Enable SAML2 Single Sign-On**.
 
	 b. As **Source for IdP Metadata**, select **Load IdP Metadata from XML**.
 
	 c. Open the downloaded metadata file, copy the content, and then paste it
     into the **IdP Metadata XML** textbox. 
	 
     d. Click **Save SAML2 settings**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-thirdlight-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-thirdlight-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-thirdlight-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-thirdlight-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of Britta Simon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a ThirdLight test user

To enable Azure AD users to log in to ThirdLight, they must be provisioned into ThirdLight.  
In the case of ThirdLight, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to your **ThirdLight** company site as an administrator.

2. Go to **Users** tab.

3. Select **Users and Groups**.

4. Click **Add new User** button.

5. Enter **the Username, Name or Description, Email, Choose a Preset or Group of New Members** of a valid AAD account you want to provision.

6. Click **Create**.

>[!NOTE]
>You can use any other Thirdlight user account creation tools or APIs provided by Thirdlight to provision AAD user accounts. 

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to ThirdLight.

![Assign User][200] 

**To assign Britta Simon to ThirdLight, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **ThirdLight**.

	![Configure Single Sign-On](./media/active-directory-saas-thirdlight-tutorial/tutorial_thirdlight_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the ThirdLight tile in the Access Panel, you should get automatically signed-on to your ThirdLight application.
For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-thirdlight-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-thirdlight-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-thirdlight-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-thirdlight-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-thirdlight-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-thirdlight-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-thirdlight-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-thirdlight-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-thirdlight-tutorial/tutorial_general_203.png

