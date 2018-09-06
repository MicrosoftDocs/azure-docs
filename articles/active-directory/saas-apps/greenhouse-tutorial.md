---
title: 'Tutorial: Azure Active Directory integration with Greenhouse | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Greenhouse.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: joflore

ms.assetid: 78ec1766-4f79-4f16-9a66-d5584c4b6151
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/19/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Greenhouse

In this tutorial, you learn how to integrate Greenhouse with Azure Active Directory (Azure AD).

Integrating Greenhouse with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Greenhouse.
- You can enable your users to automatically get signed-on to Greenhouse (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Greenhouse, you need the following items:

- An Azure AD subscription
- A Greenhouse single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Greenhouse from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Greenhouse from the gallery
To configure the integration of Greenhouse into Azure AD, you need to add Greenhouse from the gallery to your list of managed SaaS apps.

**To add Greenhouse from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **Greenhouse**, select **Greenhouse** from result panel then click **Add** button to add the application.

	![Greenhouse in the results list](./media/greenhouse-tutorial/tutorial_greenhouse_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Greenhouse based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Greenhouse is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Greenhouse needs to be established.

In Greenhouse, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Greenhouse, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a Greenhouse test user](#create-a-greenhouse-test-user)** - to have a counterpart of Britta Simon in Greenhouse that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Greenhouse application.

**To configure Azure AD single sign-on with Greenhouse, perform the following steps:**

1. In the Azure portal, on the **Greenhouse** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/greenhouse-tutorial/tutorial_greenhouse_samlbase.png)

1. On the **Greenhouse Domain and URLs** section, perform the following steps:

	![Greenhouse Domain and URLs single sign-on information](./media/greenhouse-tutorial/tutorial_greenhouse_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<companyname>.greenhouse.io`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<companyname>.greenhouse.io`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [Greenhouse Client support team](https://www.greenhouse.io/contact) to get these values. 
 


1. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/greenhouse-tutorial/tutorial_greenhouse_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/greenhouse-tutorial/tutorial_general_400.png)

1. To configure single sign-on on **Greenhouse** side, you need to send the downloaded **Metadata XML** to [Greenhouse support team](http://www.greenhouse.io/contact).

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/greenhouse-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/greenhouse-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/greenhouse-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/greenhouse-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Greenhouse test user

In order to enable Azure AD users to log into Greenhouse, they must be provisioned into Greenhouse. In the case of Greenhouse, provisioning is a manual task.

>[!NOTE]
>You can use any other Greenhouse user account creation tools or APIs provided by Greenhouse to provision AAD user accounts. 

**To provision a user accounts, perform the following steps:**

1. Log in to your **Greenhouse** company site as an administrator.

1. In the menu on the top, click **Configure**, and then click **Users**.
   
   ![Users](./media/greenhouse-tutorial/ic790791.png "Users")

1. Click **New Users**.
   
   ![New User](./media/greenhouse-tutorial/ic790792.png "New User")

1. In the **Add New User** section, perform the following steps:
   
   ![Add New User](./media/greenhouse-tutorial/ic790793.png "Add New User")

   a. In the **Enter user emails** textbox, type the email address of a valid Azure Active Directory account you want to provision.

   b. Click **Save**.    
   
      >[!NOTE]
      >The Azure Active Directory account holders will receive an email including a link to confirm the account before it becomes active.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Greenhouse.

![Assign the user role][200] 

**To assign Britta Simon to Greenhouse, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Greenhouse**.

	![The Greenhouse link in the Applications list](./media/greenhouse-tutorial/tutorial_greenhouse_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Greenhouse tile in the Access Panel, you should get automatically signed-on to your Greenhouse application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/greenhouse-tutorial/tutorial_general_01.png
[2]: ./media/greenhouse-tutorial/tutorial_general_02.png
[3]: ./media/greenhouse-tutorial/tutorial_general_03.png
[4]: ./media/greenhouse-tutorial/tutorial_general_04.png

[100]: ./media/greenhouse-tutorial/tutorial_general_100.png

[200]: ./media/greenhouse-tutorial/tutorial_general_200.png
[201]: ./media/greenhouse-tutorial/tutorial_general_201.png
[202]: ./media/greenhouse-tutorial/tutorial_general_202.png
[203]: ./media/greenhouse-tutorial/tutorial_general_203.png

