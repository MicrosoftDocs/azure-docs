---
title: 'Tutorial: Azure Active Directory integration with ContractWorks | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and ContractWorks.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: e7b269d6-3c4e-4bc4-a55f-5071d1f52591
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/16/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with ContractWorks

In this tutorial, you learn how to integrate ContractWorks with Azure Active Directory (Azure AD).

Integrating ContractWorks with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to ContractWorks.
- You can enable your users to automatically get signed-on to ContractWorks (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with ContractWorks, you need the following items:

- An Azure AD subscription
- A ContractWorks single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding ContractWorks from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding ContractWorks from the gallery
To configure the integration of ContractWorks into Azure AD, you need to add ContractWorks from the gallery to your list of managed SaaS apps.

**To add ContractWorks from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **ContractWorks**, select **ContractWorks** from result panel then click **Add** button to add the application.

	![ContractWorks in the results list](./media/contractworks-tutorial/tutorial_contractworks_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with ContractWorks based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in ContractWorks is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in ContractWorks needs to be established.

To configure and test Azure AD single sign-on with ContractWorks, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a ContractWorks test user](#create-a-contractworks-test-user)** - to have a counterpart of Britta Simon in ContractWorks that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your ContractWorks application.

**To configure Azure AD single sign-on with ContractWorks, perform the following steps:**

1. In the Azure portal, on the **ContractWorks** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.

	![Single sign-on dialog box](./media/contractworks-tutorial/tutorial_contractworks_samlbase.png)

1. On the **ContractWorks Domain and URLs** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

	![ContractWorks Domain and URLs single sign-on information](./media/contractworks-tutorial/tutorial_contractworks_url.png)

    In the **Identifier** textbox, type a URL: `https://login.securedocs.com/saml/metadata`

1. Check **Show advanced URL settings** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![ContractWorks Domain and URLs single sign-on information](./media/contractworks-tutorial/tutorial_contractworks_url1.png)

    In the **Sign-on URL** textbox, type a URL: `https://login.securedocs.com/saml/hint`
	 
1. ContractWorks application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. The following screenshot shows an example for this.
	
	![Configure Single Sign-On](./media/contractworks-tutorial/tutorial_ContractWorks_attribute.png)

1. In the **User Attributes** section on the **Single sign-on** dialog, configure SAML token attribute as shown in the image above and perform the following steps:
    
	| Attribute Name | Attribute Value |
	| ---------------| --------------- |
	| mail | user.mail |
	| displayName | user.displayname |

	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Single Sign-On](./media/contractworks-tutorial/tutorial_attribute_04.png)

	![Configure Single Sign-On](./media/contractworks-tutorial/tutorial_attribute_05.png)
	
	b. In the **Name** textbox, type the attribute name shown for that row.
	
	c. From the **Value** list, type the attribute value shown for that row.

	d. Leave the **Namespace** blank.
	
	d. Click **Ok**

1. On the **SAML Signing Certificate** section, click the copy button to copy **App Federation Metadata Url** and paste it into notepad.
    
    ![Configure Single Sign-On](./media/contractworks-tutorial/tutorial_metadataurl.png)
     
1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/contractworks-tutorial/tutorial_general_400.png)

1. To configure single sign-on on **ContractWorks** side, you need to send the generated **App Federation Metadata Url** to [ContractWorks support team](mailto:support@contractworks.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/contractworks-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/contractworks-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/contractworks-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/contractworks-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a ContractWorks test user

In this section, you create a user called Britta Simon in ContractWorks. Work with [ContractWorks support team](mailto:support@contractworks.com) to add the users in the ContractWorks platform. Users must be created and activated before you use single sign-on. 

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to ContractWorks.

![Assign the user role][200] 

**To assign Britta Simon to ContractWorks, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **ContractWorks**.

	![The ContractWorks link in the Applications list](./media/contractworks-tutorial/tutorial_contractworks_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the ContractWorks tile in the Access Panel, you should get automatically signed-on to your ContractWorks application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/contractworks-tutorial/tutorial_general_01.png
[2]: ./media/contractworks-tutorial/tutorial_general_02.png
[3]: ./media/contractworks-tutorial/tutorial_general_03.png
[4]: ./media/contractworks-tutorial/tutorial_general_04.png

[100]: ./media/contractworks-tutorial/tutorial_general_100.png

[200]: ./media/contractworks-tutorial/tutorial_general_200.png
[201]: ./media/contractworks-tutorial/tutorial_general_201.png
[202]: ./media/contractworks-tutorial/tutorial_general_202.png
[203]: ./media/contractworks-tutorial/tutorial_general_203.png

