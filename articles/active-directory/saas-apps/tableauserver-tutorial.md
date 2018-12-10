---
title: 'Tutorial: Azure Active Directory integration with Tableau Server | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Tableau Server.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: c1917375-08aa-445c-a444-e22e23fa19e0
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/29/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Tableau Server

In this tutorial, you learn how to integrate Tableau Server with Azure Active Directory (Azure AD).

Integrating Tableau Server with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Tableau Server.
- You can enable your users to automatically get signed-on to Tableau Server (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md)

## Prerequisites

To configure Azure AD integration with Tableau Server, you need the following items:

- An Azure AD subscription
- A Tableau Server single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description

In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Tableau Server from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Tableau Server from the gallery

To configure the integration of Tableau Server into Azure AD, you need to add Tableau Server from the gallery to your list of managed SaaS apps.

**To add Tableau Server from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Tableau Server**, select **Tableau Server** from result panel then click **Add** button to add the application.

	![Tableau Server in the results list](./media/tableauserver-tutorial/tutorial-tableauserver-addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Tableau Server based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Tableau Server is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Tableau Server needs to be established.

To configure and test Azure AD single sign-on with Tableau Server, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Tableau Server test user](#creating-a-tableau-server-test-user)** - to have a counterpart of Britta Simon in Tableau Server that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing single sign-on](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Tableau Server application.

**To configure Azure AD single sign-on with Tableau Server, perform the following steps:**

1. In the Azure portal, on the **Tableau Server** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Select a Single sign-on method** dialog, Click **Select** for **SAML** mode to enable single sign-on.

    ![Configure Single Sign-On](common/tutorial-general-301.png)

3. Tableau Server application expects a custom claim **username** which needs to be defined as below. This is being used as user identifier instead of Unique user identifier claim. You can manage the values of these attributes from the **User Attributes & Claims** section on application integration page. Click **Edit** button to open **User Attributes & Claims** dialog.

	![image](./media/tableauserver-tutorial/tutorial-tableauserver-attribute.png)

4. In the **User Claims** section on the **User Attributes & Claims** dialog, configure SAML token attribute as shown in the image above and perform the following steps:
    
	| Attribute Name | Attribute Value |
	| ---------------| --------------- |    
	| username | user.userprincipalname |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](./media/tableauserver-tutorial/tutorial-tableauserver-add-attribute.png)

	![image](./media/tableauserver-tutorial/tutorial-tableauserver-manage-attribute.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Enter the **Namespace** value.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Save**.

5. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Configure Single Sign-On](common/editconfigure.png)

6. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://azure.<domain name>.link`
	
	b. In the **Identifier** textbox, type a URL using the following pattern: `https://azure.<domain name>.link`

	c. In the **Reply URL** textbox, type a URL using the following pattern: `https://azure.<domain name>.link/wg/saml/SSO/index.html`

	![image](./media/tableauserver-tutorial/tutorial-tableauserver-url.png)
	 
	> [!NOTE] 
	> The preceding values are not real values. Update the values with the actual URL and identifier from the Tableau Server configuration page which is explained later in the tutorial.

7. On the **SAML Signing Certificate** page, in the **SAML Signing Certificate** section, click **Download** to download **Federation Metadata XML** and then save certificate file on your computer.

	![The Certificate download link](./media/tableauserver-tutorial/tutorial-tableauserver-certificate.png) 

8. To get SSO configured for your application, you need to sign-on to your Tableau Server tenant as an administrator.

9. On the **Tableau Server Configuration** page, perform the following steps:
   
    ![Configure Single Sign-On](./media/tableauserver-tutorial/tutorial-tableauserver-001.png)

    a. In the Tableau Server configuration, click the **SAML** tab. 
  
    b. Select the checkbox of **Use SAML for single sign-on**.
   
    c. Tableau Server return URL—The URL that Tableau Server users will be accessing, such as http://tableau_server. Using http://localhost is not recommended. Using a URL with a trailing slash (for example, http://tableau_server/) is not supported. Copy **Tableau Server return URL** and paste it to Azure AD **Sign On URL** textbox in **Tableau Server Domain and URLs** section.
   
    d. SAML entity ID—The entity ID uniquely identifies your Tableau Server installation to the IdP. You can enter your Tableau Server URL again here, if you like, but it does not have to be your Tableau Server URL. Copy **SAML entity ID** and paste it to Azure AD **Identifier** textbox in **Tableau Server Domain and URLs** section.
     
    e. Click the **Export Metadata File** and open it in the text editor application. Locate Assertion Consumer Service URL with Http Post and Index 0 and copy the URL. Now paste it to Azure AD **Reply URL** textbox in **Tableau Server Domain and URLs** section.
   
    f. Locate your Federation Metadata file downloaded from Azure portal, and then upload it in the **SAML Idp metadata file**.
   
    g. Click the **OK** button in the Tableau Server Configuration page.
   
    >[!NOTE] 
	>Customer have to upload any certificate in the Tableau Server SAML SSO configuration and it will get ignored in the SSO flow.
	>If you need help configuring SAML on Tableau Server then please refer to this article [Configure SAML](https://onlinehelp.tableau.com/current/server/en-us/config_saml.htm).

### Creating an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

	![Create Azure AD User][100]

2. Select **New user** at the top of the screen.

	![Creating an Azure AD test user](common/create-aaduser-01.png) 

3. In the User properties, perform the following steps.

	![Creating an Azure AD test user](common/create-aaduser-02.png)

    a. In the **Name** field, enter **BrittaSimon**.
  
    b. In the **User name** field, type **brittasimon@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Properties**, select the **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Select **Create**.
  
### Creating a Tableau Server test user

The objective of this section is to create a user called Britta Simon in Tableau Server. You need to provision all the users in the Tableau server. 

That username of the user should match the value which you have configured in the Azure AD custom attribute of **username**. With the correct mapping the integration should work [Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on).

>[!NOTE]
>If you need to create a user manually, you need to contact the Tableau Server administrator in your organization.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Tableau Server.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**.

	![Assign User][201]

2. In the applications list, select **Tableau Server**.

	![Configure Single Sign-On](./media/tableauserver-tutorial/tutorial-tableauserver-app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. In the **Add Assignment** dialog, select the **Assign** button.

### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Tableau Server tile in the Access Panel, you should get automatically signed-on to your Tableau Server application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: common/tutorial-general-01.png
[2]: common/tutorial-general-02.png
[3]: common/tutorial-general-03.png
[4]: common/tutorial-general-04.png

[100]: common/tutorial-general-100.png

[201]: common/tutorial-general-201.png
[202]: common/tutorial-general-202.png
[203]: common/tutorial-general-203.png
