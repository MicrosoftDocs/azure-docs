---
title: 'Tutorial: Azure Active Directory integration with Soonr Workplace | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Soonr Workplace.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman

ms.assetid: b75f5f00-ea8b-4850-ae2e-134e5d678d97
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/11/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Soonr Workplace

In this tutorial, you learn how to integrate Soonr Workplace with Azure Active Directory (Azure AD).

Integrating Soonr Workplace with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Soonr Workplace
- You can enable your users to automatically get signed-on to Soonr Workplace (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Soonr Workplace, you need the following items:

- An Azure AD subscription
- A Soonr Workplace single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Soonr Workplace from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Soonr Workplace from the gallery
To configure the integration of Soonr Workplace into Azure AD, you need to add Soonr Workplace from the gallery to your list of managed SaaS apps.

**To add Soonr Workplace from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

1. In the search box, type **Soonr Workplace**.

	![Creating an Azure AD test user](./media/soonr-tutorial/tutorial_soonr_search.png)

1. In the results panel, select **Soonr Workplace**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/soonr-tutorial/tutorial_soonr_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Soonr Workplace based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Soonr Workplace is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Soonr Workplace needs to be established.

In Soonr Workplace, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Soonr Workplace, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Creating a Soonr Workplace test user](#creating-a-soonr-workplace-test-user)** - to have a counterpart of Britta Simon in Soonr Workplace that is linked to the Azure AD representation of user.
1. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Soonr Workplace application.

**To configure Azure AD single sign-on with Soonr Workplace, perform the following steps:**

1. In the Azure portal, on the **Soonr Workplace** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/soonr-tutorial/tutorial_soonr_samlbase.png)

1. On the **Soonr Workplace Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/soonr-tutorial/tutorial_soonr_url.png)

    a. In the **Identifier** textbox, type a URL using the following pattern: `https://<servername>.soonr.com/singlesignon/saml/metadata`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://<servername>.soonr.com/singlesignon/saml/SSO`

1. On the **Soonr Workplace Domain and URLs** section, If you wish to configure the application in **SP initiated mode**, perform the following steps:
	
	![Configure Single Sign-On](./media/soonr-tutorial/tutorial_soonr_url1.png)

	a. Click on the **Show advanced URL settings**.

	b. In the **Sign On URL** textbox, type a URL using the following pattern: `https://<servername>.soonr.com/singlesignon/saml/SSO`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Identifier, Sign on URL and Reply URL. Contact [Soonr Workplace support team](https://awp.autotask.net/help/) to get these values.
 
1. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![Configure Single Sign-On](./media/soonr-tutorial/tutorial_soonr_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On](./media/soonr-tutorial/tutorial_general_400.png)

1. On the **Soonr Workplace Configuration** section, click **Configure Soonr Workplace** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/soonr-tutorial/tutorial_soonr_configure.png) 

1. To configure single sign-on on **Soonr Workplace** side, you need to send the downloaded **Metadata XML**, **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** to [Soonr Workplace support team](https://awp.autotask.net/help/). They set this setting to have the SAML SSO connection set properly on both sides.

    >[!Note]
    >If you require assistance with configuring Autotask Workplace, please see [this page](https://awp.autotask.net/help/Content/0_HOME/Support_for_End_Clients.htm) to get assistance with your Workplace account.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/soonr-tutorial/create_aaduser_01.png) 

1. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/soonr-tutorial/create_aaduser_02.png) 

1. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/soonr-tutorial/create_aaduser_03.png) 

1. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/soonr-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Soonr Workplace test user

The objective of this section is to create a user called Britta Simon in Soonr Workplace. Work with [Soonr Workplace support team](https://awp.autotask.net/help/) to create a user in the platform. You can raise the support ticket with Soonr from <a href="https://na01.safelinks.protection.outlook.com/?url=http%3A%2F%2Fsoonr.com%2FAWPHelp%2FContent%2F0_HOME%2FSupport_for_End_Clients.htm&data=01%7C01%7Cv-saikra%40microsoft.com%7Ccbb4367ab09b4dacaac408d3eebe3f42%7C72f988bf86f141af91ab2d7cd011db47%7C1&sdata=FB92qtE6m%2Fd8yox7AnL2f1h%2FGXwSkma9x9H8Pz0955M%3D&reserved=0/">here</a>.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Soonr Workplace.

![Assign User][200] 

**To assign Britta Simon to Soonr Workplace, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Soonr Workplace**.

	![Configure Single Sign-On](./media/soonr-tutorial/tutorial_soonr_app.png) 

1. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.  

When you click the Soonr Workplace tile in the Access Panel, you should get automatically signed-on to your Soonr Workplace application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/soonr-tutorial/tutorial_general_01.png
[2]: ./media/soonr-tutorial/tutorial_general_02.png
[3]: ./media/soonr-tutorial/tutorial_general_03.png
[4]: ./media/soonr-tutorial/tutorial_general_04.png

[100]: ./media/soonr-tutorial/tutorial_general_100.png

[200]: ./media/soonr-tutorial/tutorial_general_200.png
[201]: ./media/soonr-tutorial/tutorial_general_201.png
[202]: ./media/soonr-tutorial/tutorial_general_202.png
[203]: ./media/soonr-tutorial/tutorial_general_203.png

