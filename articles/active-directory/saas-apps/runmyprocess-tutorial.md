---
title: 'Tutorial: Azure Active Directory integration with RunMyProcess | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and RunMyProcess.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba

ms.assetid: d31f7395-048b-4a61-9505-5acf9fc68d9b
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/12/2017
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with RunMyProcess

In this tutorial, you learn how to integrate RunMyProcess with Azure Active Directory (Azure AD).

Integrating RunMyProcess with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to RunMyProcess
- You can enable your users to automatically get signed-on to RunMyProcess (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with RunMyProcess, you need the following items:

- An Azure AD subscription
- A RunMyProcess single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial here:[Trial offer](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding RunMyProcess from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding RunMyProcess from the gallery
To configure the integration of RunMyProcess into Azure AD, you need to add RunMyProcess from the gallery to your list of managed SaaS apps.

**To add RunMyProcess from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

1. In the search box, type **RunMyProcess**.

	![Creating an Azure AD test user](./media/runmyprocess-tutorial/tutorial_runmyprocess_search.png)

1. In the results panel, select **RunMyProcess**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/runmyprocess-tutorial/tutorial_runmyprocess_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with RunMyProcess based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in RunMyProcess is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in RunMyProcess needs to be established.

In RunMyProcess, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with RunMyProcess, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Creating a RunMyProcess test user](#creating-a-runmyprocess-test-user)** - to have a counterpart of Britta Simon in RunMyProcess that is linked to the Azure AD representation of user.
1. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your RunMyProcess application.

**To configure Azure AD single sign-on with RunMyProcess, perform the following steps:**

1. In the Azure portal, on the **RunMyProcess** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/runmyprocess-tutorial/tutorial_runmyprocess_samlbase.png)

1. On the **RunMyProcess Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/runmyprocess-tutorial/tutorial_runmyprocess_url.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://live.runmyprocess.com/live/<tenant id>`

	> [!NOTE] 
	> The value is not real. Update the value with the actual Sign-On URL. Contact [RunMyProcess Client support team](mailto:support@runmyprocess.com) to get the value. 

1. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/runmyprocess-tutorial/tutorial_runmyprocess_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On](./media/runmyprocess-tutorial/tutorial_general_400.png)

1. On the **RunMyProcess Configuration** section, click **Configure RunMyProcess** to open **Configure sign-on** window. Copy the **Sign-Out URL, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/runmyprocess-tutorial/tutorial_runmyprocess_configure.png) 

1. In a different web browser window, sign-on to your RunMyProcess tenant as an administrator.

1. In left navigation panel, click **Account** and select **Configuration**.
   
    ![Configure Single Sign-On On App Side](./media/runmyprocess-tutorial/tutorial_runmyprocess_001.png)

1. Go to **Authentication method** section and perform below steps:
   
    ![Configure Single Sign-On On App Side](./media/runmyprocess-tutorial/tutorial_runmyprocess_002.png)

    a. As **Method**, select **SSO with Samlv2**. 

    b. In the **SSO redirect** textbox, paste the value of **SAML Single Sign-On Service URL**, which you have copied from Azure portal.

    c. In the **Logout redirect** textbox, paste the value of **Sign-Out URL**, which you have copied from Azure portal.

    d. In the **Name Id Format** textbox, type the value of **Name Identifier Format** as **urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress**.

    e. Copy the content of the downloaded certificate file and then paste it into the **Certificate** textbox. 
 
    f. Click **Save** icon.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/runmyprocess-tutorial/create_aaduser_01.png) 

1. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/runmyprocess-tutorial/create_aaduser_02.png) 

1. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/runmyprocess-tutorial/create_aaduser_03.png) 

1. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/runmyprocess-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a RunMyProcess test user

In order to enable Azure AD users to log in to RunMyProcess, they must be provisioned into RunMyProcess. In the case of RunMyProcess, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to your RunMyProcess company site as an administrator.

1. Click **Account** and select **Users** in left navigation panel, then click **New User**.
   
    ![New User](./media/runmyprocess-tutorial/tutorial_runmyprocess_003.png "New User")

1. In the **User Settings** section, perform the following steps:
   
    ![Profile](./media/runmyprocess-tutorial/tutorial_runmyprocess_004.png "Profile") 
  
    a. Type the **Name** and **E-mail** of a valid Azure AD account you want to provision into the related textboxes. 

    b. Select an **IDE language**, **Language**, and **Profile**. 

    c. Select **Send account creation e-mail to me**. 

    d. Click **Save**.
   
    >[!NOTE]
    >You can use any other RunMyProcess user account creation tools or APIs provided by RunMyProcess to provision Azure Active Directory user accounts. 
    > 

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to RunMyProcess.

![Assign User][200] 

**To assign Britta Simon to RunMyProcess, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **RunMyProcess**.

	![Configure Single Sign-On](./media/runmyprocess-tutorial/tutorial_runmyprocess_app.png) 

1. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD SSO configuration using the Access Panel.

When you click the RunMyProcess tile in the Access Panel, you should get automatically signed-on to your RunMyProcess application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/runmyprocess-tutorial/tutorial_general_01.png
[2]: ./media/runmyprocess-tutorial/tutorial_general_02.png
[3]: ./media/runmyprocess-tutorial/tutorial_general_03.png
[4]: ./media/runmyprocess-tutorial/tutorial_general_04.png

[100]: ./media/runmyprocess-tutorial/tutorial_general_100.png

[200]: ./media/runmyprocess-tutorial/tutorial_general_200.png
[201]: ./media/runmyprocess-tutorial/tutorial_general_201.png
[202]: ./media/runmyprocess-tutorial/tutorial_general_202.png
[203]: ./media/runmyprocess-tutorial/tutorial_general_203.png

