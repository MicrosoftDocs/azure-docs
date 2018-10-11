---
title: 'Tutorial: Azure Active Directory integration with Zscaler Private Access (ZPA) | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Zscaler Private Access (ZPA).
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman

ms.assetid: 83711115-1c4f-4dd7-907b-3da24b37c89e
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/06/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Zscaler Private Access (ZPA)

In this tutorial, you learn how to integrate Zscaler Private Access (ZPA) with Azure Active Directory (Azure AD).

Integrating Zscaler Private Access (ZPA) with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Zscaler Private Access (ZPA)
- You can enable your users to automatically get signed-on to Zscaler Private Access (ZPA) (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure Management portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Zscaler Private Access (ZPA), you need the following items:

- An Azure AD subscription
- A Zscaler Private Access (ZPA) single-sign on enabled subscription


> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).


## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Zscaler Private Access (ZPA) from the gallery
1. Configuring and testing Azure AD single sign-on


## Adding Zscaler Private Access (ZPA) from the gallery
To configure the integration of Zscaler Private Access (ZPA) into Azure AD, you need to add Zscaler Private Access (ZPA) from the gallery to your list of managed SaaS apps.

**To add Zscaler Private Access (ZPA) from the gallery, perform the following steps:**

1. In the **[Azure Management Portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
1. Click **Add** button on the top of the dialog.

	![Applications][3]

1. In the search box, type **Zscaler Private Access (ZPA)**.

	![Creating an Azure AD test user](./media/zscalerprivateaccess-tutorial/tutorial_zscalerprivateaccess_001.png)

1. In the results panel, select **Zscaler Private Access (ZPA)**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/zscalerprivateaccess-tutorial/tutorial_zscalerprivateaccess_0001.png)


##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Zscaler Private Access (ZPA) based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Zscaler Private Access (ZPA) is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Zscaler Private Access (ZPA) needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Zscaler Private Access (ZPA).

To configure and test Azure AD single sign-on with Zscaler Private Access (ZPA), you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Creating a Zscaler Private Access (ZPA) test user](#creating-a-zscaler-private-access-(zpa)-test-user)** - to have a counterpart of Britta Simon in Zscaler Private Access (ZPA) that is linked to the Azure AD representation of her.
1. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure Management portal and configure single sign-on in your Zscaler Private Access (ZPA) application.

**To configure Azure AD single sign-on with Zscaler Private Access (ZPA), perform the following steps:**

1. In the Azure Management portal, on the **Zscaler Private Access (ZPA)** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, as **Mode** select **SAML-based Sign-on** to enable single sign on.
 
	![Configure Single Sign-On](./media/zscalerprivateaccess-tutorial/tutorial_general_300.png)
	
1. On the **Zscaler Private Access (ZPA) Domain and URLs** section, perform the following steps:
	
	![Configure Single Sign-On](./media/zscalerprivateaccess-tutorial/tutorial_zscalerprivateaccess_01.png)

	a. In the **Sign On URL** textbox, type a URL using the following pattern: `https://samlsp.private.zscaler.com/auth/login?domain=<your-domain-name>`

	b. In the **Identifier** textbox, type: `https://samlsp.private.zscaler.com/auth/metadata`

	> [!NOTE] 
	> Please note that these are not the real values. You have to update these values with the actual Sign On URL and Identifier. Here we suggest you to use the unique value of URL in the Identifier. Contact [Zscaler Private Access (ZPA) support team](https://help.zscaler.com/zpa-submit-ticket) to get these values.

1. On the **SAML Signing Certificate** section, click **Create new certificate**.

	![Configure Single Sign-On](./media/zscalerprivateaccess-tutorial/tutorial_general_400.png) 	

1. On the **Create New Certificate** dialog, click the calendar icon and select an **expiry date**. Then click **Save** button.

	![Configure Single Sign-On](./media/zscalerprivateaccess-tutorial/tutorial_general_500.png)

1. On the **SAML Signing Certificate** section, select **Make new certificate active** and click **Save** button.

	![Configure Single Sign-On](./media/zscalerprivateaccess-tutorial/tutorial_zscalerprivateaccess_02.png)

1. On the pop-up **Rollover certificate** window, click **OK**.

	![Configure Single Sign-On](./media/zscalerprivateaccess-tutorial/tutorial_general_600.png)

1. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![Configure Single Sign-On](./media/zscalerprivateaccess-tutorial/tutorial_zscalerprivateaccess_03.png) 

1. In a different web browser window, log into your Zscaler Private Access (ZPA) company site as an administrator.

1. Navigate to **Administrator** and then click **Idp Configuration**.

	![Configure Single Sign-On On App Side](./media/zscalerprivateaccess-tutorial/tutorial_zscalerprivateaccess_04.png)

1. In the **Idp Configuration** section, click **Add New IDP Configuration**.

	![Configure Single Sign-On On App Side](./media/zscalerprivateaccess-tutorial/tutorial_zscalerprivateaccess_05.png)

1. In the **New IDP Configuration** section, perform the following steps:

	![Configure Single Sign-On On App Side](./media/zscalerprivateaccess-tutorial/tutorial_zscalerprivateaccess_06.png)

	a. Click **Select File** and upload your downloaded metadata file.

	b. Click **Save** button.
	


### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure Management portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure Management portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/zscalerprivateaccess-tutorial/create_aaduser_01.png) 

1. Go to **Users and groups** and click **All users** to display the list of users.
	
	![Creating an Azure AD test user](./media/zscalerprivateaccess-tutorial/create_aaduser_02.png) 

1. At the top of the dialog click **Add** to open the **User** dialog.
 
	![Creating an Azure AD test user](./media/zscalerprivateaccess-tutorial/create_aaduser_03.png) 

1. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/zscalerprivateaccess-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**. 



### Creating a Zscaler Private Access (ZPA) test user

In this section, you create a user called Britta Simon in Zscaler Private Access (ZPA). Please work with [Zscaler Private Access (ZPA) support team](https://help.zscaler.com/zpa-submit-ticket) to add the users in the Zscaler Private Access (ZPA) platform.


### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting her access to Zscaler Private Access (ZPA).

![Assign User][200] 

**To assign Britta Simon to Zscaler Private Access (ZPA), perform the following steps:**

1. In the Azure Management portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Zscaler Private Access (ZPA)**.

	![Configure Single Sign-On](./media/zscalerprivateaccess-tutorial/tutorial_zscalerprivateaccess_50.png) 

1. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	


### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Zscaler Private Access (ZPA) tile in the Access Panel, you should get automatically signed-on to your Zscaler Private Access (ZPA) application.


## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/zscalerprivateaccess-tutorial/tutorial_general_01.png
[2]: ./media/zscalerprivateaccess-tutorial/tutorial_general_02.png
[3]: ./media/zscalerprivateaccess-tutorial/tutorial_general_03.png
[4]: ./media/zscalerprivateaccess-tutorial/tutorial_general_04.png

[100]: ./media/zscalerprivateaccess-tutorial/tutorial_general_100.png

[200]: ./media/zscalerprivateaccess-tutorial/tutorial_general_200.png
[201]: ./media/zscalerprivateaccess-tutorial/tutorial_general_201.png
[202]: ./media/zscalerprivateaccess-tutorial/tutorial_general_202.png
[203]: ./media/zscalerprivateaccess-tutorial/tutorial_general_203.png