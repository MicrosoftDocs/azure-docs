---
title: 'Tutorial: Azure Active Directory integration with OfficeSpace Software | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and OfficeSpace Software.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 95d8413f-db98-4e2c-8097-9142ef1af823
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/27/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with OfficeSpace Software

In this tutorial, you learn how to integrate OfficeSpace Software with Azure Active Directory (Azure AD).

Integrating OfficeSpace Software with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to OfficeSpace Software.
- You can enable your users to automatically get signed-on to OfficeSpace Software (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with OfficeSpace Software, you need the following items:

- An Azure AD subscription
- A OfficeSpace Software single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding OfficeSpace Software from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding OfficeSpace Software from the gallery
To configure the integration of OfficeSpace Software into Azure AD, you need to add OfficeSpace Software from the gallery to your list of managed SaaS apps.

**To add OfficeSpace Software from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **OfficeSpace Software**, select **OfficeSpace Software** from result panel then click **Add** button to add the application.

	![OfficeSpace Software in the results list](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with OfficeSpace Software based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in OfficeSpace Software is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in OfficeSpace Software needs to be established.

In OfficeSpace Software, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with OfficeSpace Software, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a OfficeSpace Software test user](#create-a-officespace-software-test-user)** - to have a counterpart of Britta Simon in OfficeSpace Software that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your OfficeSpace Software application.

**To configure Azure AD single sign-on with OfficeSpace Software, perform the following steps:**

1. In the Azure portal, on the **OfficeSpace Software** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_samlbase.png)

3. On the **OfficeSpace Software Domain and URLs** section, perform the following steps:

	![OfficeSpace Software Domain and URLs single sign-on information](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<company name>.officespacesoftware.com/users/sign_in/saml`

	b. In the **Identifier** textbox, type a URL using the following pattern: `<company name>.officespacesoftware.com`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [OfficeSpace Software Client support team](mailto:support@officespacesoftware.com) to get these values. 

4. OfficeSpace Software application expects the SAML assertions in a specific format. Please configure the following claims for this application. You can manage the values of these attributes from the "**User Attributes**" section on application integration page. The following screenshot shows an example for this.
	
	![Configure attribute](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_attribute.png)

5. In the **User Attributes** section on the **Single sign-on** dialog, select **user.mail**  as **User Identifier** and for each row shown in the table below, perform the following steps:
    
	| Attribute Name | Attribute Value |
	| --- | --- |    
	| email | user.mail |
	| name | user.displayname |
	| first_name | user.givenname |
	| last_name | user.surname |

	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Add ](./media/active-directory-saas-officespace-tutorial/tutorial_attribute_04.png)

	![Configure attribute](./media/active-directory-saas-officespace-tutorial/tutorial_attribute_05.png)
	
	b. In the **Name** textbox, type the attribute name shown for that row.
	
	c. From the **Value** list, type the attribute value shown for that row.
	
	d. Click **Ok**
 
6. On the **SAML Signing Certificate** section, copy the **THUMBPRINT** value of the certificate.

	![The Certificate download link](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_certificate.png) 

7. Click **Save** button.

	![Configure Single Sign-On Save button](./media/active-directory-saas-officespace-tutorial/tutorial_general_400.png)

8. On the **OfficeSpace Software Configuration** section, click **Configure OfficeSpace Software** to open **Configure sign-on** window. Copy the **Sign-Out URL, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![OfficeSpace Software Configuration](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_configure.png) 

9. In a different web browser window, log into your OfficeSpace Software tenant as an administrator.

10. Go to **Settings** and click **Connectors**.

	![Configure Single Sign-On On App Side](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_002.png)

11. Click **SAML Authentication**.

	![Configure Single Sign-On On App Side](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_003.png)

12. In the **SAML Authentication** section, perform the following steps:

	![Configure Single Sign-On On App Side](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_004.png)

	a. In the **Logout provider url** textbox, paste the value of **Sign-Out URL** which you have copied from Azure portal.

	b. In the **Client idp target url** textbox, paste the value of **SAML Single Sign-On Service URL** which you have copied from Azure portal.

	c. Paste the **Thumbprint** value which you have copied from Azure portal, into the **Client IDP certificate fingerprint** textbox. 

	d. Click **Save Settings**.


> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/active-directory-saas-officespace-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/active-directory-saas-officespace-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/active-directory-saas-officespace-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/active-directory-saas-officespace-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a OfficeSpace Software test user

The objective of this section is to create a user called Britta Simon in OfficeSpace Software. OfficeSpace Software supports just-in-time provisioning, which is by default enabled.

There is no action item for you in this section. A new user will be created during an attempt to access OfficeSpace Software if it doesn't exist yet.

> [!NOTE]
> If you need to create an user manually, you need to Contact [OfficeSpace Software support team](mailto:support@officespacesoftware.com).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to OfficeSpace Software.

![Assign the user role][200] 

**To assign Britta Simon to OfficeSpace Software, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **OfficeSpace Software**.

	![The OfficeSpace Software link in the Applications list](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the OfficeSpace Software tile in the Access Panel, you should get automatically signed-on to your OfficeSpace Software application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-officespace-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-officespace-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-officespace-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-officespace-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-officespace-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-officespace-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-officespace-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-officespace-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-officespace-tutorial/tutorial_general_203.png

