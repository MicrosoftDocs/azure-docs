---
title: 'Tutorial: Azure Active Directory integration with OfficeSpace Software | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and OfficeSpace Software.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 95d8413f-db98-4e2c-8097-9142ef1af823
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/10/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with OfficeSpace Software

In this tutorial, you learn how to integrate OfficeSpace Software with Azure Active Directory (Azure AD).

Integrating OfficeSpace Software with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to OfficeSpace Software
- You can enable your users to automatically get signed-on to OfficeSpace Software (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure Management portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with OfficeSpace Software, you need the following items:

- An Azure AD subscription
- An OfficeSpace Software single-sign on enabled subscription


> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get an one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).


## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding OfficeSpace Software from the gallery
2. Configuring and testing Azure AD single sign-on


## Adding OfficeSpace Software from the gallery
To configure the integration of OfficeSpace Software into Azure AD, you need to add OfficeSpace Software from the gallery to your list of managed SaaS apps.

**To add OfficeSpace Software from the gallery, perform the following steps:**

1. In the **[Azure Management Portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. Click **Add** button on the top of the dialog.

	![Applications][3]

4. In the search box, type **OfficeSpace Software**.

	![Creating an Azure AD test user](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_001.png)

5. In the results panel, select **OfficeSpace Software**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_0001.png)


##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with OfficeSpace Software based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in OfficeSpace Software is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in OfficeSpace Software needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in OfficeSpace Software.

To configure and test Azure AD single sign-on with OfficeSpace Software, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating an OfficeSpace Software test user](#creating-an-officespace-software-test-user)** - to have a counterpart of Britta Simon in OfficeSpace Software that is linked to the Azure AD representation of her.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure Management portal and configure single sign-on in your OfficeSpace Software application.

**To configure Azure AD single sign-on with OfficeSpace Software, perform the following steps:**

1. In the Azure Management portal, on the **OfficeSpace Software** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, as **Mode** select **SAML-based Sign-on** to enable single sign on.
 
	![Configure Single Sign-On](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_01.png)

3. On the **OfficeSpace Software Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_02.png)

    a. In the **Sign On URL** textbox, type a URL using the following pattern: `https://<company name>.officespacesoftware.com/users/sign_in/saml`

	b. In the **Identifier** textbox, type a value using the following pattern: `<company name>.officespacesoftware.com`

	> [!NOTE] 
	> Please note that these are not the real values. You have to update these values with the actual Sign On URL and Identifier. Contact [OfficeSpace Software support team](mailto:support@officespacesoftware.com) to get these values. 

4. OfficeSpace Software application expects the SAML assertions in a specific format. Please configure the following claims for this application. You can manage the values of these attributes from the "**User Attributes**" section on application integration page. The following screenshot shows an example for this.
	
	![Configure Single Sign-On](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_03.png)

5. In the **User Attributes** section on the **Single sign-on** dialog, select **user.mail**  as **User Identifier** and for each row shown in the table below, perform the following steps:
    
	| Attribute Name | Attribute Value |
	| --- | --- |    
	| email | user.mail |
	| name | user.displayname |
	| first_name | user.givenname |
	| last_name | user.surname |

	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Single Sign-On](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_04.png)

	![Configure Single Sign-On](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_05.png)
	
	b. In the **Name** textbox, type the attribute name shown for that row.
	
	c. From the **Value** list, type the attribute value shown for that row.
	
	d. Click **Ok**

6. On the **SAML Signing Certificate** section, click **Certificate (base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_08.png) 

7. Click **Save**.

	![Configure Single Sign-On](./media/active-directory-saas-officespace-tutorial/tutorial_general_400.png)

8. On the **OfficeSpace Software Configuration** section, click **Configure OfficeSpace Software** to open **Configure sign-on** window.

	![Configure Single Sign-On](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_09.png) 

	![Configure Single Sign-On](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_10.png)

9. In a different web browser window, log into your OfficeSpace Software tenant as an administrator.

10. Go to **Settings** and click **Connectors**.

	![Configure Single Sign-On On App Side](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_002.png)

11. Click **SAML Authentication**.

	![Configure Single Sign-On On App Side](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_003.png)

12. In the **SAML Authentication** section, perform the following steps:

	![Configure Single Sign-On On App Side](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_004.png)

	a. In the **Logout provider url** textbox put the value of **Sign-Out URL** from Azure AD application configuration window.

	b. In the **Client idp target url** textbox put the value of **SAML Single Sign-On Service URL** from Azure AD application configuration window.

	c. Copy the **Thumbprint** value from the downloaded certificate, and then paste it into the **Client idp cert fingerprint** textbox. 

	d. Click **Save Settings**.

	> [!NOTE]
	> For more details, see [How to retrieve a certificate's thumbprint value](http://youtu.be/YKQF266SAxI) 
  

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure Management portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure Management portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-officespace-tutorial/create_aaduser_01.png) 

2. Go to **Users and groups** and click **All users** to display the list of users.
	
	![Creating an Azure AD test user](./media/active-directory-saas-officespace-tutorial/create_aaduser_02.png) 

3. At the top of the dialog click **Add** to open the **User** dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-officespace-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-officespace-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**. 



### Creating an OfficeSpace Software test user

The objective of this section is to create a user called Britta Simon in OfficeSpace Software. OfficeSpace Software supports just-in-time provisioning, which is by default enabled.

There is no action item for you in this section. A new user will be created during an attempt to access OfficeSpace Software if it doesn't exist yet.

> [!NOTE]
> If you need to create an user manually, you need to Contact [OfficeSpace Software support team](mailto:support@officespacesoftware.com).


### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting her access to OfficeSpace Software.

![Assign User][200] 

**To assign Britta Simon to OfficeSpace Software, perform the following steps:**

1. In the Azure Management portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **OfficeSpace Software**.

	![Configure Single Sign-On](./media/active-directory-saas-officespace-tutorial/tutorial_officespace_50.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	


### Testing single sign-on

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