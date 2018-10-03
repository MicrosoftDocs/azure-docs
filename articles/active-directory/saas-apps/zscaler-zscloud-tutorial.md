---
title: 'Tutorial: Azure Active Directory integration with Zscaler ZSCloud | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Zscaler ZSCloud.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman

ms.assetid: 411d5684-a780-410a-9383-59f92cf569b5
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/17/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Zscaler ZSCloud

In this tutorial, you learn how to integrate Zscaler ZSCloud with Azure Active Directory (Azure AD).

Integrating Zscaler ZSCloud with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Zscaler ZSCloud
- You can enable your users to automatically get signed-on to Zscaler ZSCloud (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Zscaler ZSCloud, you need the following items:

- An Azure AD subscription
- A Zscaler ZSCloud single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Zscaler ZSCloud from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Zscaler ZSCloud from the gallery
To configure the integration of Zscaler ZSCloud into Azure AD, you need to add Zscaler ZSCloud from the gallery to your list of managed SaaS apps.

**To add Zscaler ZSCloud from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

1. In the search box, type **Zscaler ZSCloud**.

	![Creating an Azure AD test user](./media/zscaler-zscloud-tutorial/tutorial_zscalerzscloud_search.png)

1. In the results panel, select **Zscaler ZSCloud**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/zscaler-zscloud-tutorial/tutorial_zscalerzscloud_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Zscaler ZSCloud based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Zscaler ZSCloud is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Zscaler ZSCloud needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Zscaler ZSCloud.

To configure and test Azure AD single sign-on with Zscaler ZSCloud, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Configuring proxy settings](#configuring-proxy-settings)** - to configure the proxy settings in Internet Explorer
1. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)**  - to test Azure AD single sign-on with Britta Simon.
1. **[Creating a Zscaler ZSCloud test user](#creating-a-zscaler-zscloud-test-user)** - to have a counterpart of Britta Simon in Zscaler ZSCloud that is linked to the Azure AD representation of user.
1. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Zscaler ZSCloud application.

**To configure Azure AD single sign-on with Zscaler ZSCloud, perform the following steps:**

1. In the Azure portal, on the **Zscaler ZSCloud** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/zscaler-zscloud-tutorial/tutorial_zscalerzscloud_samlbase.png)

1. On the **Zscaler ZSCloud Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/zscaler-zscloud-tutorial/tutorial_zscalerzscloud_url.png)

     In the **Sign-on URL** textbox, type the URL used by your users to sign-on to your ZScaler ZSCloud application.
	
	> [!NOTE] 
	> You have to update this value with the actual Sign-On URL. Contact [Zscaler ZSCloud Client support team](https://help.zscaler.com/zia) to get this value. 
 
1. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/zscaler-zscloud-tutorial/tutorial_zscalerzscloud_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On](./media/zscaler-zscloud-tutorial/tutorial_general_400.png)

1. On the **Zscaler ZSCloud Configuration** section, click **Configure Zscaler ZSCloud** to open **Configure sign-on** window. Copy the **SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/zscaler-zscloud-tutorial/tutorial_zscalerzscloud_configure.png) 

1. In a different web browser window, log in to your ZScaler ZSCloud company site as an administrator.

1. In the menu on the top, click **Administration**.
   
	![Administration](./media/zscaler-zscloud-tutorial/ic800206.png "Administration")

1. Under **Manage Administrators & Roles**, click **Manage Users & Authentication**.   
   			
	![Manage Users & Authentication](./media/zscaler-zscloud-tutorial/ic800207.png "Manage Users & Authentication")

1. In the **Choose Authentication Options for your Organization** section, perform the following steps:   
   				
	![Authentication](./media/zscaler-zscloud-tutorial/ic800208.png "Authentication")
   
    a. Select **Authenticate using SAML Single Sign-On**.

    b. Click **Configure SAML Single Sign-On Parameters**.

1. On the **Configure SAML Single Sign-On Parameters** dialog page, perform the following steps, and then click **Done**

	![Single Sign-On](./media/zscaler-zscloud-tutorial/ic800209.png "Single Sign-On")
	
	a. Paste the **SAML Single Sign-On Service URL** value into the **URL of the SAML Portal to which users are sent for authentication** textbox.
	
	b. In the **Attribute containing Login Name** textbox, type **NameID**.
	
	c. To upload your downloaded certificate, click **Zscaler pem**.
	
	d. Select **Enable SAML Auto-Provisioning**.

1. On the **Configure User Authentication** dialog page, perform the following steps:

    ![Administration](./media/zscaler-zscloud-tutorial/ic800210.png "Administration")
    
    a. Click **Save**.

    b. Click **Activate Now**.

## Configuring proxy settings
### To configure the proxy settings in Internet Explorer

1. Start **Internet Explorer**.

1. Select **Internet options** from the **Tools** menu for open the **Internet Options** dialog.   
  	
	 ![Internet Options](./media/zscaler-zscloud-tutorial/ic769492.png "Internet Options")

1. Click the **Connections** tab.   
  
	 ![Connections](./media/zscaler-zscloud-tutorial/ic769493.png "Connections")

1. Click **LAN settings** to open the **LAN Settings** dialog.

1. In the Proxy server section, perform the following steps:   
   
	![Proxy server](./media/zscaler-zscloud-tutorial/ic769494.png "Proxy server")

    a. Select **Use a proxy server for your LAN**.

    b. In the Address textbox, type **gateway.zscalerone.net**.

    c. In the Port textbox, type **80**.

    d. Select **Bypass proxy server for local addresses**.

    e. Click **OK** to close the **Local Area Network (LAN) Settings** dialog.

1. Click **OK** to close the **Internet Options** dialog.

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/zscaler-zscloud-tutorial/create_aaduser_01.png) 

1. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/zscaler-zscloud-tutorial/create_aaduser_02.png) 

1. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/zscaler-zscloud-tutorial/create_aaduser_03.png) 

1. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/zscaler-zscloud-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.

### Creating a Zscaler ZSCloud test user

To enable Azure AD users to log in to ZScaler ZSCloud, they must be provisioned to ZScaler ZSCloud.  
In the case of ZScaler ZSCloud, provisioning is a manual task.

### To configure user provisioning, perform the following steps:

1. Log in to your **Zscaler** tenant.

1. Click **Administration**.   
   
	![Administration](./media/zscaler-zscloud-tutorial/ic781035.png "Administration")

1. Click **User Management**.   
  		
	 ![Add](./media/zscaler-zscloud-tutorial/ic781037.png "Add")

1. In the **Users** tab, click **Add**.
      
	![Add](./media/zscaler-zscloud-tutorial/ic781037.png "Add")

1. In the Add User section, perform the following steps:
   	   	
	![Add User](./media/zscaler-zscloud-tutorial/ic781038.png "Add User")
   
    a. Type the **UserID**, **User Display Name**, **Password**, **Confirm Password**, and then select **Groups** and the **Department** of a valid AAD account you want to provision.

    b. Click **Save**.

> [!NOTE]
> You can use any other ZScaler ZSCloud user account creation tools or APIs provided by ZScaler ZSCloud to provision AAD user accounts.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Zscaler ZSCloud.

![Assign User][200] 

**To assign Britta Simon to Zscaler ZSCloud, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Zscaler ZSCloud**.

	![Configure Single Sign-On](./media/zscaler-zscloud-tutorial/tutorial_zscalerzscloud_app.png) 

1. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

If you want to test your single sign-on settings, open the Access Panel.

When you click the Zscaler ZSCloud tile in the Access Panel, you should get automatically signed-on to your Zscaler ZSCloud application.

For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/zscaler-zscloud-tutorial/tutorial_general_01.png
[2]: ./media/zscaler-zscloud-tutorial/tutorial_general_02.png
[3]: ./media/zscaler-zscloud-tutorial/tutorial_general_03.png
[4]: ./media/zscaler-zscloud-tutorial/tutorial_general_04.png

[100]: ./media/zscaler-zscloud-tutorial/tutorial_general_100.png

[200]: ./media/zscaler-zscloud-tutorial/tutorial_general_200.png
[201]: ./media/zscaler-zscloud-tutorial/tutorial_general_201.png
[202]: ./media/zscaler-zscloud-tutorial/tutorial_general_202.png
[203]: ./media/zscaler-zscloud-tutorial/tutorial_general_203.png

