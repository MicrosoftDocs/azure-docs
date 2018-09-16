---
title: 'Tutorial: Azure Active Directory integration with SumoLogic | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SumoLogic.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman

ms.assetid: fbb76765-92d7-4801-9833-573b11b4d910
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/08/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with SumoLogic

In this tutorial, you learn how to integrate SumoLogic with Azure Active Directory (Azure AD).

Integrating SumoLogic with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to SumoLogic
- You can enable your users to automatically get signed-on to SumoLogic (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with SumoLogic, you need the following items:

- An Azure AD subscription
- A SumoLogic single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding SumoLogic from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding SumoLogic from the gallery
To configure the integration of SumoLogic into Azure AD, you need to add SumoLogic from the gallery to your list of managed SaaS apps.

**To add SumoLogic from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

1. In the search box, type **SumoLogic**.

	![Creating an Azure AD test user](./media/sumologic-tutorial/tutorial_sumologic_search.png)

1. In the results panel, select **SumoLogic**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/sumologic-tutorial/tutorial_sumologic_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with SumoLogic based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in SumoLogic is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in SumoLogic needs to be established.

In SumoLogic, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with SumoLogic, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Creating a SumoLogic test user](#creating-a-sumologic-test-user)** - to have a counterpart of Britta Simon in SumoLogic that is linked to the Azure AD representation of user.
1. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your SumoLogic application.

**To configure Azure AD single sign-on with SumoLogic, perform the following steps:**

1. In the Azure portal, on the **SumoLogic** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/sumologic-tutorial/tutorial_sumologic_samlbase.png)

1. On the **SumoLogic Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/sumologic-tutorial/tutorial_sumologic_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<tenantname>.SumoLogic.com`

	b. In the **Identifier** textbox, type a URL using the following pattern:
	| |
	|--|
	| `https://<tenantname>.us2.sumologic.com` |
	| `https://<tenantname>.sumologic.com` |
	| `https://<tenantname>.us4.sumologic.com` |
	| `https://<tenantname>.eu.sumologic.com` |
	| `https://<tenantname>.au.sumologic.com` |

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [SumoLogic Client support team](https://www.sumologic.com/contact-us/) to get these values. 
 
1. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/sumologic-tutorial/tutorial_sumologic_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On](./media/sumologic-tutorial/tutorial_general_400.png)

1. On the **SumoLogic Configuration** section, click **Configure SumoLogic** to open **Configure sign-on** window. Copy the **SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/sumologic-tutorial/tutorial_sumologic_configure.png) 

1. In a different web browser window, log in to your SumoLogic company site as an administrator.

1. Go to **Manage \> Security**.
   
    ![Manage](./media/sumologic-tutorial/ic778556.png "Manage")

1. Click **SAML**.
   
    ![Global security settings](./media/sumologic-tutorial/ic778557.png "Global security settings")

1. From the **Select a configuration or create a new one** list, select **Azure AD**, and then click **Configure**.
   
    ![Configure SAML 2.0](./media/sumologic-tutorial/ic778558.png "Configure SAML 2.0")

1. On the **Configure SAML 2.0** dialog, perform the following steps:
   
    ![Configure SAML 2.0](./media/sumologic-tutorial/ic778559.png "Configure SAML 2.0")
   
    a. In the **Configuration Name** textbox, type **Azure AD**. 

    b. Select **Debug Mode**.

    c. In the **Issuer** textbox, paste the value of **SAML Entity ID**, which you have copied from Azure portal. 

    d. In the **Authn Request URL** textbox, paste the value of **SAML Single Sign-On Service URL**, which you have copied from Azure portal.

    e. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste the entire Certificate into **X.509 Certificate** textbox.

    f. As **Email Attribute**, select **Use SAML subject**.  

    g. Select **SP initiated Login Configuration**.

    h. In the **Login Path** textbox, type **Azure** and click **Save**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/sumologic-tutorial/create_aaduser_01.png) 

1. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/sumologic-tutorial/create_aaduser_02.png) 

1. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/sumologic-tutorial/create_aaduser_03.png) 

1. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/sumologic-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a SumoLogic test user

In order to enable Azure AD users to log in to SumoLogic, they must be provisioned to SumoLogic.  

* In the case of SumoLogic, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to your **SumoLogic** tenant.

1. Go to **Manage \> Users**.
   
    ![Users](./media/sumologic-tutorial/ic778561.png "Users")

1. Click **Add**.
   
    ![Users](./media/sumologic-tutorial/ic778562.png "Users")

1. On the **New User** dialog, perform the following steps:
   
    ![New User](./media/sumologic-tutorial/ic778563.png "New User") 
 
    a. Type the related information of the Azure AD account you want to provision into the **First Name**, **Last Name**, and **Email** textboxes.
  
    b. Select a role.
  
    c. As **Status**, select **Active**.
  
    d. Click **Save**.

>[!NOTE]
>You can use any other SumoLogic user account creation tools or APIs provided by SumoLogic to provision AAD user accounts. 
> 

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to SumoLogic.

![Assign User][200] 

**To assign Britta Simon to SumoLogic, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **SumoLogic**.

	![Configure Single Sign-On](./media/sumologic-tutorial/tutorial_sumologic_app.png) 

1. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.

When you click the SumoLogic tile in the Access Panel, you should get automatically signed-on to your SumoLogic application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/sumologic-tutorial/tutorial_general_01.png
[2]: ./media/sumologic-tutorial/tutorial_general_02.png
[3]: ./media/sumologic-tutorial/tutorial_general_03.png
[4]: ./media/sumologic-tutorial/tutorial_general_04.png

[100]: ./media/sumologic-tutorial/tutorial_general_100.png

[200]: ./media/sumologic-tutorial/tutorial_general_200.png
[201]: ./media/sumologic-tutorial/tutorial_general_201.png
[202]: ./media/sumologic-tutorial/tutorial_general_202.png
[203]: ./media/sumologic-tutorial/tutorial_general_203.png

