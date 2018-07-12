---
title: 'Tutorial: Azure Active Directory integration with Screencast-O-Matic | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Screencast-O-Matic.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 525ad47d-5488-40e2-aeaf-ae6183745682
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/21/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Screencast-O-Matic

In this tutorial, you learn how to integrate Screencast-O-Matic with Azure Active Directory (Azure AD).

Integrating Screencast-O-Matic with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Screencast-O-Matic.
- You can enable your users to automatically get signed-on to Screencast-O-Matic (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Screencast-O-Matic, you need the following items:

- An Azure AD subscription
- A Screencast-O-Matic single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Screencast-O-Matic from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Screencast-O-Matic from the gallery
To configure the integration of Screencast-O-Matic into Azure AD, you need to add Screencast-O-Matic from the gallery to your list of managed SaaS apps.

**To add Screencast-O-Matic from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Screencast-O-Matic**, select **Screencast-O-Matic** from result panel then click **Add** button to add the application.

	![Screencast-O-Matic in the results list](./media/screencast-tutorial/tutorial_screencast_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Screencast-O-Matic based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Screencast-O-Matic is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Screencast-O-Matic needs to be established.

To configure and test Azure AD single sign-on with Screencast-O-Matic, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a Screencast-O-Matic test user](#create-a-screencast-o-matic-test-user)** - to have a counterpart of Britta Simon in Screencast-O-Matic that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Screencast-O-Matic application.

**To configure Azure AD single sign-on with Screencast-O-Matic, perform the following steps:**

1. In the Azure portal, on the **Screencast-O-Matic** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/screencast-tutorial/tutorial_screencast_samlbase.png)

3. On the **Screencast-O-Matic Domain and URLs** section, perform the following steps:

	![Screencast-O-Matic Domain and URLs single sign-on information](./media/screencast-tutorial/tutorial_screencast_url.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://screencast-o-matic.com/<InstanceName>`

	> [!NOTE] 
	> The Sign-on URL value is not real. Update the value with the actual Sign-On URL. Contact [Screencast-O-Matic Client support team](mailto:support@screencast-o-matic.com) to get the value. 
 
4. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/screencast-tutorial/tutorial_screencast_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On Save button](./media/screencast-tutorial/tutorial_general_400.png)

6. In a different web browser window, login to Screencast-O-Matic as an Administrator.

7. Click on **Subscription**.

	![The Subscription](./media/screencast-tutorial/tutorial_screencast_sub.png)

8. Under **Access page** section, Click **Setup**.

	![The Access](./media/screencast-tutorial/tutorial_screencast_setup.png)

9. On the **Setup Access Page**, perform the following steps:

	* Under **Access URL** section, type your instancename in the specified textbox.

	![The Access](./media/screencast-tutorial/tutorial_screencast_access.png)

	* Select **Require Domain User** under **SAML User Restriction (optional)** section.

	* Under **Upload IDP Metadata XML File**, Click **Choose File** to upload the metadata which you have downloaded from Azure portal.

	* Click **OK**.	

	![The Access](./media/screencast-tutorial/tutorial_screencast_save.png)

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/screencast-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/screencast-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/screencast-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/screencast-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Screencast-O-Matic test user

The objective of this section is to create a user called Britta Simon in Screencast-O-Matic. Screencast-O-Matic supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access Screencast-O-Matic if it doesn't exist yet.

>[!Note]
>If you need to create a user manually, contact [Screencast-O-Matic Client support team](mailto:support@screencast-o-matic.com).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Screencast-O-Matic.

![Assign the user role][200] 

**To assign Britta Simon to Screencast-O-Matic, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Screencast-O-Matic**.

	![The Screencast-O-Matic link in the Applications list](./media/screencast-tutorial/tutorial_screencast_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Screencast-O-Matic tile in the Access Panel, you should get automatically signed-on to your Screencast-O-Matic application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/screencast-tutorial/tutorial_general_01.png
[2]: ./media/screencast-tutorial/tutorial_general_02.png
[3]: ./media/screencast-tutorial/tutorial_general_03.png
[4]: ./media/screencast-tutorial/tutorial_general_04.png

[100]: ./media/screencast-tutorial/tutorial_general_100.png

[200]: ./media/screencast-tutorial/tutorial_general_200.png
[201]: ./media/screencast-tutorial/tutorial_general_201.png
[202]: ./media/screencast-tutorial/tutorial_general_202.png
[203]: ./media/screencast-tutorial/tutorial_general_203.png

