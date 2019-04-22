---
title: 'Tutorial: Azure Active Directory integration with BenSelect | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and BenSelect.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba

ms.assetid: ffa17478-3ea1-4356-a289-545b5b9a4494
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/23/2017
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with BenSelect

In this tutorial, you learn how to integrate BenSelect with Azure Active Directory (Azure AD).

Integrating BenSelect with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to BenSelect
- You can enable your users to automatically get signed-on to BenSelect (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with BenSelect, you need the following items:

- An Azure AD subscription
- A BenSelect single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding BenSelect from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding BenSelect from the gallery
To configure the integration of BenSelect into Azure AD, you need to add BenSelect from the gallery to your list of managed SaaS apps.

**To add BenSelect from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

1. In the search box, type **BenSelect**.

	![Creating an Azure AD test user](./media/benselect-tutorial/tutorial_benselect_search.png)

1. In the results panel, select **BenSelect**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/benselect-tutorial/tutorial_benselect_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with BenSelect based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in BenSelect is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in BenSelect needs to be established.

In BenSelect, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with BenSelect, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Creating a BenSelect test user](#creating-a-benselect-test-user)** - to have a counterpart of Britta Simon in BenSelect that is linked to the Azure AD representation of user.
1. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your BenSelect application.

**To configure Azure AD single sign-on with BenSelect, perform the following steps:**

1. In the Azure portal, on the **BenSelect** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/benselect-tutorial/tutorial_benselect_samlbase.png)

1. On the **BenSelect Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/benselect-tutorial/tutorial_benselect_url.png)

	In the **Reply URL** textbox, type a URL using the following pattern: `https://www.benselect.com/enroll/login.aspx?Path=<tenant name>`

	> [!NOTE] 
	> This value is not real. Update this value with the actual Reply URL. Contact [BenSelect support team](mailto:support@selerix.com) to get this value.
 
1. On the **SAML Signing Certificate** section, click **Certificate(Raw)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/benselect-tutorial/tutorial_benselect_certificate.png) 

1. BenSelect application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. The following screenshot shows an example for this.

	![Configure Single Sign-On](./media/benselect-tutorial/tutorial_benselect_06.png)

1. In the **User Attributes** section on the **Single sign-on** dialog:

	a. In the **User Identifier** dropdown list, select **ExtractMailPrefix**.

	b. In the **Mail** dropdown list, select **user.userprincipalname**.

1. Click **Save** button.

	![Configure Single Sign-On](./media/benselect-tutorial/tutorial_general_400.png)

1. On the **BenSelect Configuration** section, click **Configure BenSelect** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/benselect-tutorial/tutorial_benselect_configure.png) 

1. To configure single sign-on on **BenSelect** side, you need to send the downloaded **Certificate(Raw)** and **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** to [BenSelect support team](mailto:support@selerix.com).

   >[!NOTE]
   >You need to mention that this integration requires the SHA256 algorithm (SHA1 is not supported) to set the SSO on the appropriate server like app2101 etc. 
   
> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/benselect-tutorial/create_aaduser_01.png) 

1. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/benselect-tutorial/create_aaduser_02.png) 

1. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/benselect-tutorial/create_aaduser_03.png) 

1. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/benselect-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a BenSelect test user

The objective of this section is to create a user called Britta Simon in BenSelect. Work with [BenSelect support team](mailto:support@selerix.com) to add the users in the BenSelect account.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to BenSelect.

![Assign User][200] 

**To assign Britta Simon to BenSelect, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **BenSelect**.

	![Configure Single Sign-On](./media/benselect-tutorial/tutorial_benselect_app.png) 

1. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD SSO configuration using the Access Panel.

When you click the BenSelect tile in the Access Panel, you should get automatically signed-on to your BenSelect application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/benselect-tutorial/tutorial_general_01.png
[2]: ./media/benselect-tutorial/tutorial_general_02.png
[3]: ./media/benselect-tutorial/tutorial_general_03.png
[4]: ./media/benselect-tutorial/tutorial_general_04.png

[100]: ./media/benselect-tutorial/tutorial_general_100.png

[200]: ./media/benselect-tutorial/tutorial_general_200.png
[201]: ./media/benselect-tutorial/tutorial_general_201.png
[202]: ./media/benselect-tutorial/tutorial_general_202.png
[203]: ./media/benselect-tutorial/tutorial_general_203.png

