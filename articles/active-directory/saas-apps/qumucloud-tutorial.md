---
title: 'Tutorial: Azure Active Directory integration with Qumu Cloud | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Qumu Cloud.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: d8c4a97b-4de6-49d4-b64e-42222c2ec6c9
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/13/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Qumu Cloud

In this tutorial, you learn how to integrate Qumu Cloud with Azure Active Directory (Azure AD).

Integrating Qumu Cloud with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Qumu Cloud.
- You can enable your users to automatically get signed-on to Qumu Cloud (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Qumu Cloud, you need the following items:

- An Azure AD subscription
- A Qumu Cloud single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Qumu Cloud from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Qumu Cloud from the gallery
To configure the integration of Qumu Cloud into Azure AD, you need to add Qumu Cloud from the gallery to your list of managed SaaS apps.

**To add Qumu Cloud from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **Qumu Cloud**, select **Qumu Cloud** from result panel then click **Add** button to add the application.

	![Qumu Cloud in the results list](./media/qumucloud-tutorial/tutorial_qumucloud_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Qumu Cloud based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Qumu Cloud is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Qumu Cloud needs to be established.

To configure and test Azure AD single sign-on with Qumu Cloud, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a Qumu Cloud test user](#create-a-qumu-cloud-test-user)** - to have a counterpart of Britta Simon in Qumu Cloud that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Qumu Cloud application.

**To configure Azure AD single sign-on with Qumu Cloud, perform the following steps:**

1. In the Azure portal, on the **Qumu Cloud** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/qumucloud-tutorial/tutorial_qumucloud_samlbase.png)

1. On the **Qumu Cloud Domain and URLs** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

	![Qumu Cloud Domain and URLs single sign-on information](./media/qumucloud-tutorial/tutorial_qumucloud_url.png)

    a. In the **Identifier** textbox, type a URL using the following pattern: `https://<subdomain>.qumucloud.com/saml/SSO`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://<subdomain>.qumucloud.com/saml/SSO`

1. Check **Show advanced URL settings** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![Qumu Cloud Domain and URLs single sign-on information](./media/qumucloud-tutorial/tutorial_qumucloud_url1.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<subdomain>.qumucloud.com`
	 
	> [!NOTE] 
	> These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL. Contact [Qumu Cloud Client support team](mailto:support@qumu.com) to get these values.

1. Qumu Cloud application expects the SAML assertions in a specific format. Please configure the following claims for this application. You can manage the values of these attributes from the "**User Attributes**" section on application integration page. The following screenshot shows an example for this.
	
	![Configure Single Sign-On](./media/qumucloud-tutorial/attribute.png)
	
1. Click **View and edit all other user attributes** checkbox in the **User Attributes** section to expand the attributes. Perform the following steps on each of the displayed attributes-

	| Attribute Name | Attribute Value |
	| ---------------| --------------- |    
	| urn:oid:2.5.4.42 | user.givenname |
	| urn:oid:2.5.4.4 | user.surname |
	| urn:oid:0.9.2342.19200300.100.1.3 | user.mail |
	| urn:oid:0.9.2342.19200300.100.1.1 | user.userprincipalname |

	a. Click the attribute to open the **Edit Attribute** window.

	![Configure Single Sign-On](./media/qumucloud-tutorial/tutorial_attribute_04.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	![Configure Single Sign-On](./media/qumucloud-tutorial/tutorial_attribute_05.png)

	c. From the **Value** list, type the attribute value shown for that row.

	d. Keep the **Namespace** textbox blank.
	
	e. Click **Ok**.

1. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/qumucloud-tutorial/tutorial_qumucloud_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/qumucloud-tutorial/tutorial_general_400.png)
	
1. To configure single sign-on on **Qumu Cloud** side, you need to send the downloaded **Metadata XML** to [Qumu Cloud support team](mailto:support@qumu.com). They set this setting to have the SAML SSO connection set properly on both sides.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/qumucloud-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/qumucloud-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/qumucloud-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/qumucloud-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Qumu Cloud test user

The objective of this section is to create a user called Britta Simon in Qumu Cloud. Qumu Cloud supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access Qumu Cloud if it doesn't exist yet.
>[!Note]
>If you need to create a user manually, contact [Qumu Cloud Client support team](mailto:support@qumu.com).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Qumu Cloud.

![Assign the user role][200] 

**To assign Britta Simon to Qumu Cloud, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Qumu Cloud**.

	![The Qumu Cloud link in the Applications list](./media/qumucloud-tutorial/tutorial_qumucloud_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Qumu Cloud tile in the Access Panel, you should get automatically signed-on to your Qumu Cloud application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/qumucloud-tutorial/tutorial_general_01.png
[2]: ./media/qumucloud-tutorial/tutorial_general_02.png
[3]: ./media/qumucloud-tutorial/tutorial_general_03.png
[4]: ./media/qumucloud-tutorial/tutorial_general_04.png

[100]: ./media/qumucloud-tutorial/tutorial_general_100.png

[200]: ./media/qumucloud-tutorial/tutorial_general_200.png
[201]: ./media/qumucloud-tutorial/tutorial_general_201.png
[202]: ./media/qumucloud-tutorial/tutorial_general_202.png
[203]: ./media/qumucloud-tutorial/tutorial_general_203.png

