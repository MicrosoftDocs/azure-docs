---
title: 'Tutorial: Azure Active Directory integration with Clarizen | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Clarizen.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 28acce3e-22a0-4a37-8b66-6e518d777350
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/10/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Clarizen

In this tutorial, you learn how to integrate Clarizen with Azure Active Directory (Azure AD).

Integrating Clarizen with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Clarizen
- You can enable your users to automatically get signed-on to Clarizen single sign-on (SSO) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure Management portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Clarizen, you need the following items:

- An Azure AD subscription
- A Clarizen single-sign on enabled subscription

>[!NOTE]
>To test the steps in this tutorial, we do not recommend using a production environment.
>

To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get an one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).


## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

* Adding Clarizen from the gallery
* Configuring and testing Azure AD single sign-on

## Add Clarizen from the gallery
To configure the integration of Clarizen into Azure AD, you need to add Clarizen from the gallery to your list of managed SaaS apps.

**To add Clarizen from the gallery, perform the following steps:**

1. In the **[Azure Management Portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. Click **Add** button on the top of the dialog.

	![Applications][3]

4. In the search box, type **Clarizen**.

	![Creating an Azure AD test user](./media/active-directory-saas-clarizen-tutorial/tutorial_clarizen_000.png)

5. In the results panel, select **Clarizen**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-clarizen-tutorial/tutorial_clarizen_0001.png)

##  Configure and test Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Clarizen based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Clarizen is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Clarizen needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Clarizen.

To configure and test Azure AD single sign-on with Clarizen, you need to complete the following building blocks:

1. **[Configuring Azure AD single sign-on](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Clarizen test user](#creating-a-clarizen-test-user)** - to have a counterpart of Britta Simon in Clarizen that is linked to the Azure AD representation of her.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure Management portal and configure single sign-on in your Clarizen application.

**To configure Azure AD single sign-on with Clarizen, perform the following steps:**

1. In the Azure Management portal, on the **Clarizen** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, as **Mode** select **SAML-based Sign-on** to enable single sign on.
 
	![Configure Single Sign-On](./media/active-directory-saas-clarizen-tutorial/tutorial_clarizen_01.png)

3. On the **Clarizen Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-clarizen-tutorial/tutorial_clarizen_02.png)
    1. In the **Identifier** textbox, type the value as: `Clarizen`
    2. In the **Reply URL** textbox, type a URL using the following pattern: `https://<company name>.clarizen.com/Clarizen/Pages/Integrations/SAML/SamlResponse.aspx`
	
	>[!NOTE] 
	>These are not the real values. You have to update these values with the actual Identifier and Reply URL. Here we suggest you to use the unique value of string in the Identifier. Contact [Clarizen support team](https://success.clarizen.com/hc/en-us/requests/new) to get these values.
	>
4. On the **SAML Signing Certificate** section, click **Create new certificate**.

	![Configure Single Sign-On](./media/active-directory-saas-clarizen-tutorial/tutorial_clarizen_03.png) 	

5. On the **Create New Certificate** dialog, click the calendar icon and select an **expiry date**. Then click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-clarizen-tutorial/tutorial_general_300.png)

6. On the **SAML Signing Certificate** section, select **Make new certificate active** and click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-clarizen-tutorial/tutorial_clarizen_04.png)

7. On the pop-up **Rollover certificate** window, click **OK**.

	![Configure Single Sign-On](./media/active-directory-saas-clarizen-tutorial/tutorial_general_400.png)

8. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-clarizen-tutorial/tutorial_clarizen_05.png) 

9. On the **Clarizen Configuration** section, click **Configure Clarizen** to open **Configure sign-on** window.

	![Configure Single Sign-On](./media/active-directory-saas-clarizen-tutorial/tutorial_clarizen_06.png) 

	![Configure Single Sign-On](./media/active-directory-saas-clarizen-tutorial/tutorial_clarizen_07.png)

10. In a different web browser window, log into your Clarizen company site as an administrator.

11. Click your user name, and then click **Settings**.

	![Settings](./media/active-directory-saas-clarizen-tutorial/tutorial_clarizen_001.png "Settings")

12. Click the **Global Settings** tab, and then, next to **Federated Authentication**, click **edit**.

	![Global Settings](./media/active-directory-saas-clarizen-tutorial/tutorial_clarizen_002.png "Global Settings")

13. On the **Federated Authentication** dialog, perform the following steps:

	![Federated Authentication](./media/active-directory-saas-clarizen-tutorial/tutorial_clarizen_003.png "Federated Authentication")
	1. Select **Enable Federated Authentication**.
	2. Click **Upload** to upload your downloaded certificate.
	3. In the **Sign-in URL** textbox, put the value of **SAML Single Sign-On Service URL** from Azure AD application configuration window.
	4. In the **Sign-out URL** textbox, put the value of **Sign-Out URL** from Azure AD application configuration window.
	5. Select **Use POST**.
	6. Click **Save**.

### Create an Azure AD test user
The objective of this section is to create a test user in the Azure Management portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure Management portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-clarizen-tutorial/create_aaduser_01.png) 

2. Go to **Users and groups** and click **All users** to display the list of users.
	
	![Creating an Azure AD test user](./media/active-directory-saas-clarizen-tutorial/create_aaduser_02.png) 

3. At the top of the dialog click **Add** to open the **User** dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-clarizen-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-clarizen-tutorial/create_aaduser_04.png) 
    1. In the **Name** textbox, type **BrittaSimon**.
    2. In the **User name** textbox, type the **email address** of BrittaSimon.
	3. Select **Show Password** and write down the value of the **Password**.
    4. Click **Create**. 

### Create a Clarizen test user

In order to enable Azure AD users to log into Clarizen, they must be provisioned into Clarizen.  

* In the case of Clarizen, provisioning is a manual task.

**To provision a user accounts, perform the following steps:**

1. Log in to your Clarizen company site as an administrator.

2. Click **People**.

    ![People](./media/active-directory-saas-clarizen-tutorial/create_aaduser_001.png "People")

3. Click **Invite User**.

	![Invite Users](./media/active-directory-saas-clarizen-tutorial/create_aaduser_002.png "Invite Users")

4. On the **Invite People** dialog page, perform the following steps:

	![Invite People](./media/active-directory-saas-clarizen-tutorial/create_aaduser_003.png "Invite People")
	1. In the **Email** textbox, type the email address of Britta Simon account.
    2. Click **Invite**.
	>[!NOTE]
    >The Azure Active Directory account holder will receive an email and follow a link to confirm their account before it becomes active.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting her access to Clarizen.

![Assign User][200] 

**To assign Britta Simon to Clarizen, perform the following steps:**

1. In the Azure Management portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Clarizen**.

	![Configure Single Sign-On](./media/active-directory-saas-clarizen-tutorial/tutorial_clarizen_50.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Clarizen tile in the Access Panel, you should get automatically signed-on to your Clarizen application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-clarizen-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-clarizen-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-clarizen-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-clarizen-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-clarizen-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-clarizen-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-clarizen-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-clarizen-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-clarizen-tutorial/tutorial_general_203.png
