---
title: 'Tutorial: Azure Active Directory integration with Palo Alto Networks - GlobalProtect | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Palo Alto Networks - GlobalProtect.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: joflore

ms.assetid: 03bef6f2-3ea2-4eaa-a828-79c5f1346ce5
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/01/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Palo Alto Networks - GlobalProtect

In this tutorial, you learn how to integrate Palo Alto Networks - GlobalProtect with Azure Active Directory (Azure AD).

Integrating Palo Alto Networks - GlobalProtect with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Palo Alto Networks - GlobalProtect.
- You can enable your users to automatically get signed-on to Palo Alto Networks - GlobalProtect (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Palo Alto Networks - GlobalProtect, you need the following items:

- An Azure AD subscription
- A Palo Alto Networks - GlobalProtect single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Palo Alto Networks - GlobalProtect from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Palo Alto Networks - GlobalProtect from the gallery
To configure the integration of Palo Alto Networks - GlobalProtect into Azure AD, you need to add Palo Alto Networks - GlobalProtect from the gallery to your list of managed SaaS apps.

**To add Palo Alto Networks - GlobalProtect from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **Palo Alto Networks - GlobalProtect**, select **Palo Alto Networks - GlobalProtect** from result panel then click **Add** button to add the application.

	![Palo Alto Networks - GlobalProtect in the results list](./media/paloaltoglobalprotect-tutorial/tutorial_paloaltoglobal_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Palo Alto Networks - GlobalProtect based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Palo Alto Networks - GlobalProtect is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Palo Alto Networks - GlobalProtect needs to be established.

In Palo Alto Networks - GlobalProtect, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Palo Alto Networks - GlobalProtect, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a Palo Alto Networks - GlobalProtect test user](#create-a-palo-alto-networks---globalprotect-test-user)** - to have a counterpart of Britta Simon in Palo Alto Networks - GlobalProtect that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Palo Alto Networks - GlobalProtect application.

**To configure Azure AD single sign-on with Palo Alto Networks - GlobalProtect, perform the following steps:**

1. In the Azure portal, on the **Palo Alto Networks - GlobalProtect** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/paloaltoglobalprotect-tutorial/tutorial_paloaltoglobal_samlbase.png)

1. On the **Palo Alto Networks - GlobalProtect Domain and URLs** section, perform the following steps:

	![Palo Alto Networks - GlobalProtect Domain and URLs single sign-on information](./media/paloaltoglobalprotect-tutorial/tutorial_paloaltoglobal_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<Customer Firewall URL>`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<Customer Firewall URL>/SAML20/SP`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [Palo Alto Networks - GlobalProtect Client support team](https://support.paloaltonetworks.com/support) to get these values. 
 
1. Palo Alto Networks - GlobalProtect application expects the SAML assertions in a specific format. Please configure the following claims for this application. You can manage the values of these attributes from the "**User Attributes**" section on application integration page. The following screenshot shows an example for this.
	
	![Configure Single Sign-On](./media/paloaltoglobalprotect-tutorial/tutorial_paloaltoglobal_attribute.png)
	
1. In the **User Attributes** section on the **Single sign-on** dialog, configure SAML token attribute as shown in the image above and perform the following steps:
    
	| Attribute Name | Attribute Value |
	| --- | --- |    
	| username | user.userprincipalname |

	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Single Sign-On](./media/paloaltoglobalprotect-tutorial/tutorial_attribute_04.png)

	![Configure Single Sign-On](./media/paloaltoglobalprotect-tutorial/tutorial_attribute_05.png)
	
	b. In the **Name** textbox, type the attribute name shown for that row.
	
	c. From the **Value** list, type the attribute value shown for that row. We have mapped the value with user.userprincipalname as an example but you can map with your appropriate value. 
	
	d. Click **Ok**


1. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/paloaltoglobalprotect-tutorial/tutorial_paloaltoglobal_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/paloaltoglobalprotect-tutorial/tutorial_general_400.png)

1. Open the Palo Alto Networks Firewall Admin UI as an administrator in another browser window.

1. Click on **Device**.

	![Configure Palo Alto Single Sign-on](./media/paloaltoglobalprotect-tutorial/tutorial_paloaltoadmin_admin1.png)

1. Select **SAML Identity Provider** from the left navigation bar and click "Import" to import the metadata file.

	![Configure Palo Alto Single Sign-on](./media/paloaltoglobalprotect-tutorial/tutorial_paloaltoadmin_admin2.png)

1. Perform following actions on the Import window

	![Configure Palo Alto Single Sign-on](./media/paloaltoglobalprotect-tutorial/tutorial_paloaltoadmin_admin3.png)

	a. In the **Profile Name** textbox, provide a name e.g Azure AD GlobalProtect.
	
	b. In **Identity Provider Metadata**, click **Browse** and select the metadata.xml file which you have downloaded from Azure portal
	
	c. Click **OK**

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/paloaltoglobalprotect-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/paloaltoglobalprotect-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/paloaltoglobalprotect-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/paloaltoglobalprotect-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Palo Alto Networks - GlobalProtect test user

Palo Alto Networks - GlobalProtect supports Just-in-time user provisioning so a user will be automatically created in the system after the successful authentication if it doesn't already exists. You don't need to perform any action here. 

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Palo Alto Networks - GlobalProtect.

![Assign the user role][200] 

**To assign Britta Simon to Palo Alto Networks - GlobalProtect, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Palo Alto Networks - GlobalProtect**.

	![The Palo Alto Networks - GlobalProtect link in the Applications list](./media/paloaltoglobalprotect-tutorial/tutorial_paloaltoglobal_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Palo Alto Networks - GlobalProtect tile in the Access Panel, you should get automatically signed-on to your Palo Alto Networks - GlobalProtect application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/paloaltoglobalprotect-tutorial/tutorial_general_01.png
[2]: ./media/paloaltoglobalprotect-tutorial/tutorial_general_02.png
[3]: ./media/paloaltoglobalprotect-tutorial/tutorial_general_03.png
[4]: ./media/paloaltoglobalprotect-tutorial/tutorial_general_04.png

[100]: ./media/paloaltoglobalprotect-tutorial/tutorial_general_100.png

[200]: ./media/paloaltoglobalprotect-tutorial/tutorial_general_200.png
[201]: ./media/paloaltoglobalprotect-tutorial/tutorial_general_201.png
[202]: ./media/paloaltoglobalprotect-tutorial/tutorial_general_202.png
[203]: ./media/paloaltoglobalprotect-tutorial/tutorial_general_203.png

