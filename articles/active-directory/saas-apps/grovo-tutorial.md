---
title: 'Tutorial: Azure Active Directory integration with Grovo | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Grovo.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 399cecc3-aa62-4914-8b6c-5a35289820c1
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/12/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Grovo

In this tutorial, you learn how to integrate Grovo with Azure Active Directory (Azure AD).

Integrating Grovo with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Grovo.
- You can enable your users to automatically get signed-on to Grovo (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Grovo, you need the following items:

- An Azure AD subscription
- A Grovo single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Grovo from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Grovo from the gallery
To configure the integration of Grovo into Azure AD, you need to add Grovo from the gallery to your list of managed SaaS apps.

**To add Grovo from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **Grovo**, select **Grovo** from result panel then click **Add** button to add the application.

	![Grovo in the results list](./media/grovo-tutorial/tutorial_grovo_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Grovo based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Grovo is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Grovo needs to be established.

In Grovo, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Grovo, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a Grovo test user](#create-a-grovo-test-user)** - to have a counterpart of Britta Simon in Grovo that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Grovo application.

**To configure Azure AD single sign-on with Grovo, perform the following steps:**

1. In the Azure portal, on the **Grovo** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/grovo-tutorial/tutorial_grovo_samlbase.png)

1. On the **Grovo Domain and URLs** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

	![Grovo Domain and URLs single sign-on information](./media/grovo-tutorial/tutorial_grovo_url.png)

    a. In the **Identifier** textbox, type a URL using the following pattern: `https://<subdomain>.grovo.com/sso/saml2/metadata`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://<subdomain>.grovo.com/sso/saml2/saml-assertion`

1. Check **Show advanced URL settings**, perform the following step:

    ![Grovo Domain and URLs single sign-on information](./media/grovo-tutorial/tutorial_grovo_url1.png)

    a. In the **Relay state** textbox, type a URL using the following pattern:`https://<subdomain>.grovo.com`

	b. If you wish to configure the application in **SP** initiated mode, perform the following steps:

	![Grovo Domain and URLs single sign-on information](./media/grovo-tutorial/tutorial_grovo_url2.png)
	
	In the **Sign on URL** textbox, type a URL using the following pattern: `https://<subdomain>.grovo.com/sso/saml2/saml-assertion`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Identifier, Reply URL, Sign on URL and Relay state. Contact [Grovo support team](https://www.grovo.com/contact-us) to get these values.
 
1. Grovo application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the "**User Attributes**" section on application integration page. Please map **User Identifier** with **user.mail** and configure other attributes as shown in below screenshot.
	
	![Configure Single Sign-On attb](./media/grovo-tutorial/tutorial_grovo_attribute.png)
	
1. In the **User Attributes** section on the **Single sign-on** dialog, configure SAML token attribute as shown in the image and perform the following steps:
	
	| Attribute Name | Attribute Value |
	| ------------------- | -------------------- |    
	| First Name 		  | user.givenname |
	| Last Name 		  | user.surname |
	| Email Address       | user.mail    |
	| employeeID          | user.employeeid |

	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Single Sign-On Add](./media/grovo-tutorial/tutorial_attribute_04.png)

	![Configure Single Sign-On Addattb](./media/grovo-tutorial/tutorial_attribute_05.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. From the **Value** list, type the attribute value shown for that row.

	d. Leave the **Namespace** blank.
	
	e. Click **Ok**.


1. On the **SAML Signing Certificate** section, click **Certificate(Base64)** and then save the certificate file on your computer.

	![The Certificate download link](./media/grovo-tutorial/tutorial_grovo_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/grovo-tutorial/tutorial_general_400.png)

1. On the **Grovo Configuration** section, click **Configure Grovo** to open **Configure sign-on** window. Copy the **SAML Entity ID and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Grovo Configuration](./media/grovo-tutorial/tutorial_grovo_configure.png) 

1. In a different web browser window, login to Grovo as Administrator.

1. Go to **Admin** > **Integrations**.
 
	![Grovo Configuration](./media/grovo-tutorial/tutorial_grovo_admin.png) 

1. Click **SET UP** under **SP Initiated SAML 2.0** section.

	![Grovo Configuration](./media/grovo-tutorial/tutorial_grovo_setup.png)

1. In **SP Initiated SAML 2.0** popup window perform the following steps:

	![Grovo Configuration](./media/grovo-tutorial/tutorial_grovo_saml.png)

	a. In the **Entity id** textbox, paste the value of **SAML Entity ID**, which you have copied from Azure portal.

	b. In the **Single sign on service endpoint** textbox, paste the value of **SAML Single Sign-On Service URL**, which you have copied from Azure portal.

	c. Select **Single sign on service endpoint binding** as `urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect`.
	
	d. Open the downloaded **Base64 encoded certificate** from Azure portal in notepad, paste it into the **Public key** textbox.

	e. Click **Next**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/grovo-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/grovo-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/grovo-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/grovo-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
  
### Create a Grovo test user

The objective of this section is to create a user called Britta Simon in Grovo. Grovo supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access Grovo if it doesn't exist yet.
>[!Note]
>If you need to create a user manually, Contact [Grovo support team](https://www.grovo.com/contact-us).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Grovo.

![Assign the user role][200] 

**To assign Britta Simon to Grovo, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Grovo**.

	![The Grovo link in the Applications list](./media/grovo-tutorial/tutorial_grovo_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Grovo tile in the Access Panel, you should get automatically signed-on to your Grovo application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/grovo-tutorial/tutorial_general_01.png
[2]: ./media/grovo-tutorial/tutorial_general_02.png
[3]: ./media/grovo-tutorial/tutorial_general_03.png
[4]: ./media/grovo-tutorial/tutorial_general_04.png

[100]: ./media/grovo-tutorial/tutorial_general_100.png

[200]: ./media/grovo-tutorial/tutorial_general_200.png
[201]: ./media/grovo-tutorial/tutorial_general_201.png
[202]: ./media/grovo-tutorial/tutorial_general_202.png
[203]: ./media/grovo-tutorial/tutorial_general_203.png

