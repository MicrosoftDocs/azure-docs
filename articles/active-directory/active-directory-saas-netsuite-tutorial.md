---
title: 'Tutorial: Azure Active Directory integration with Netsuite | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Netsuite.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: dafa0864-aef2-4f5e-9eac-770504688ef4
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/31/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Netsuite

In this tutorial, you learn how to integrate Netsuite with Azure Active Directory (Azure AD).

Integrating Netsuite with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Netsuite
- You can enable your users to automatically get signed-on to Netsuite (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Netsuite, you need the following items:

- An Azure AD subscription
- A Netsuite single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Netsuite from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Netsuite from the gallery
To configure the integration of Netsuite into Azure AD, you need to add Netsuite from the gallery to your list of managed SaaS apps.

**To add Netsuite from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. Click **New application** button on the top of the dialog.

	![Applications][3]

4. In the search box, type **Netsuite**.

	![Creating an Azure AD test user](./media/active-directory-saas-netsuite-tutorial/tutorial_netsuite_search.png)

5. In the results panel, select **Netsuite**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-netsuite-tutorial/tutorial_netsuite_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Netsuite based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Netsuite is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Netsuite needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Netsuite.

To configure and test Azure AD single sign-on with Netsuite, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Netsuite test user](#creating-a-netsuite-test-user)** - to have a counterpart of Britta Simon in Netsuite that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Netsuite application.

**To configure Azure AD single sign-on with Netsuite, perform the following steps:**

1. In the Azure portal, on the **Netsuite** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-netsuite-tutorial/tutorial_netsuite_samlbase.png)

3. On the **Netsuite Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-netsuite-tutorial/tutorial_netsuite_url.png)

	In the **Reply URL** textbox, type a URL using the following pattern:
     `https://<tenant-name>.netsuite.com/saml2/acs`
     `https://<tenant-name>.na1.netsuite.com/saml2/acs`
     `https://<tenant-name>.na2.netsuite.com/saml2/acs`
     `https://<tenant-name>.sandbox.netsuite.com/saml2/acs`
     `https://<tenant-name>.na1.sandbox.netsuite.com/saml2/acs`
     `https://<tenant-name>.na2.sandbox.netsuite.com/saml2/acs`

	> [!NOTE] 
	> These are not real values. Update these values with the actual Reply URL. Contact [Netsuite support team](http://www.netsuite.com/portal/services/support.shtml) to get these values.
 
4. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the XML file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-netsuite-tutorial/tutorial_netsuite_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-netsuite-tutorial/tutorial_general_400.png)

6. On the **Netsuite Configuration** section, click **Configure Netsuite** to open **Configure sign-on** window. Copy the **SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-netsuite-tutorial/tutorial_netsuite_configure.png) 

7. Open a new tab in your browser, and sign into your Netsuite company site as an administrator.

8. In the toolbar at the top of the page, click **Setup**, then click **Setup Manager**.

    ![Configure Single Sign-On](./media/active-directory-saas-Netsuite-tutorial/ns-setup.png)

9. From the **Setup Tasks** list, select **Integration**.

	![Configure Single Sign-On](./media/active-directory-saas-Netsuite-tutorial/ns-integration.png)

10. In the **Manage Authentication** section, click **SAML Single Sign-on**.

	![Configure Single Sign-On](./media/active-directory-saas-Netsuite-tutorial/ns-saml.png)

11. On the **SAML Setup** page, perform the following steps:
   
    a. Copy the **SAML Single Sign-On Service URL** value from **Quick Reference** section of **Configure sign-on** and paste it into the **Identity Provider Login Page** field in Netsuite.

    ![Configure Single Sign-On](./media/active-directory-saas-netsuite-tutorial/ns-saml-setup.png)
  
    b. In Netsuite, select **Primary Authentication Method**.

    c. For the field labeled **SAMLV2 Identity Provider Metadata**, select **Upload IDP Metadata File**. Then click **Browse** to upload the metadata file that you downloaded from Azure portal.

    ![Configure Single Sign-On](./media/active-directory-saas-netsuite-tutorial/ns-sso-setup.png)

    d. Click **Submit**.

12. In Azure AD, Click on **View and edit all other user attributes** check-box and add attribute.

    ![Configure Single Sign-On](./media/active-directory-saas-Netsuite-tutorial/ns-attributes.png)

13. For the **Attribute Name** field, type in `account`. For the **Attribute Value** field, type in your Netsuite account ID. This value is constant and change with account. Instructions on how to find your account ID are included below:

      ![Configure Single Sign-On](./media/active-directory-saas-Netsuite-tutorial/ns-add-attribute.png)

    a. In Netsuite, click **Setup** from the top navigation menu.

    b. Then click under the **Setup Tasks** section of the left navigation menu, select the **Integration** section, and click **Web Services Preferences**.

    c. Copy your Netsuite Account ID and paste it into the **Attribute Value** field in Azure AD.

    ![Configure Single Sign-On](./media/active-directory-saas-Netsuite-tutorial/ns-account-id.png)

14. Before users can perform single sign-on into Netsuite, they must first be assigned the appropriate permissions in Netsuite. Follow the instructions below to assign these permissions.

    a. On the top navigation menu, click **Setup**, then click **Setup Manager**.
      
      ![Configure Single Sign-On](./media/active-directory-saas-Netsuite-tutorial/ns-setup.png)

    b. On the left navigation menu, select **Users/Roles**, then click **Manage Roles**.
      
      ![Configure Single Sign-On](./media/active-directory-saas-Netsuite-tutorial/ns-manage-roles.png)

    c. Click **New Role**.

    d. Type in a **Name** for your new role, and select the **Single Sign-On Only** checkbox.
      
      ![Configure Single Sign-On](./media/active-directory-saas-Netsuite-tutorial/ns-new-role.png)

    e. Click **Save**.

    f. In the menu on the top, click **Permissions**. Then click **Setup**.
      
       ![Configure Single Sign-On](./media/active-directory-saas-Netsuite-tutorial/ns-sso.png)

    g. Select **Set Up SAM Single Sign-on**, and then click **Add**.

    h. Click **Save**.

    i. On the top navigation menu, click **Setup**, then click **Setup Manager**.
      
       ![Configure Single Sign-On](./media/active-directory-saas-Netsuite-tutorial/ns-setup.png)

    j. On the left navigation menu, select **Users/Roles**, then click **Manage Users**.
      
       ![Configure Single Sign-On](./media/active-directory-saas-Netsuite-tutorial/ns-manage-users.png)

    k. Select a test user. Then click **Edit**.
      
       ![Configure Single Sign-On](./media/active-directory-saas-Netsuite-tutorial/ns-edit-user.png)

    l. On the Roles dialog, select the role that you have created and click **Add**.
      
       ![Configure Single Sign-On](./media/active-directory-saas-Netsuite-tutorial/ns-add-role.png)

    m. Click **Save**.
    
> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-netsuite-tutorial/create_aaduser_01.png) 

2.  To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-netsuite-tutorial/create_aaduser_02.png) 

3. At the top of the dialog, click **Add** to open the **User** dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-netsuite-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-netsuite-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**. 

### Creating a Netsuite test user

In this section, a user called Britta Simon is created in Netsuite. Netsuite supports just-in-time provisioning, which is enabled by default.
There is no action item for you in this section. If a user doesn't already exist in Netsuite, a new one is created when you attempt to access Netsuite.


### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Netsuite.

![Assign User][200] 

**To assign Britta Simon to Netsuite, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Netsuite**.

	![Configure Single Sign-On](./media/active-directory-saas-netsuite-tutorial/tutorial_netsuite_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

To test your single sign-on settings, open the Access Panel at [https://myapps.microsoft.com](https://myapps.microsoft.com/), sign into the test account, and click **Netsuite**.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)
* [Configure User Provisioning](active-directory-saas-netsuite-provisioning-tutorial.md)

<!--Image references-->

[1]: ./media/active-directory-saas-netsuite-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-netsuite-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-netsuite-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-netsuite-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-netsuite-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-netsuite-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-netsuite-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-netsuite-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-netsuite-tutorial/tutorial_general_203.png

