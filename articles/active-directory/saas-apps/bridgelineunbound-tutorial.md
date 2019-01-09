---
title: 'Tutorial: Azure Active Directory integration with Bridgeline Unbound | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Bridgeline Unbound.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: b018472f-c8b3-403d-ae66-9ed26a35f413
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/18/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Bridgeline Unbound

In this tutorial, you learn how to integrate Bridgeline Unbound with Azure Active Directory (Azure AD).

Integrating Bridgeline Unbound with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Bridgeline Unbound.
- You can enable your users to automatically get signed-on to Bridgeline Unbound (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Bridgeline Unbound, you need the following items:

- An Azure AD subscription
- A Bridgeline Unbound single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Bridgeline Unbound from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Bridgeline Unbound from the gallery
To configure the integration of Bridgeline Unbound into Azure AD, you need to add Bridgeline Unbound from the gallery to your list of managed SaaS apps.

**To add Bridgeline Unbound from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Bridgeline Unbound**, select **Bridgeline Unbound** from result panel then click **Add** button to add the application.

	![Bridgeline Unbound in the results list](./media/bridgelineunbound-tutorial/tutorial_bridgelineunbound_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Bridgeline Unbound based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Bridgeline Unbound is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Bridgeline Unbound needs to be established.

To configure and test Azure AD single sign-on with Bridgeline Unbound, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a Bridgeline Unbound test user](#create-a-bridgeline-unbound-test-user)** - to have a counterpart of Britta Simon in Bridgeline Unbound that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Bridgeline Unbound application.

**To configure Azure AD single sign-on with Bridgeline Unbound, perform the following steps:**

1. In the Azure portal, on the **Bridgeline Unbound** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/bridgelineunbound-tutorial/tutorial_bridgelineunbound_samlbase.png)
 
3. On the **Bridgeline Unbound Domain and URLs** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

	![Bridgeline Domain and URLs single sign-on information](./media/bridgelineunbound-tutorial/tutorial_bridgelineunbound_url.png)

    a. In the **Identifier** textbox, type a URL using the following pattern: `iApps_UPSTT_<ENVIRONMENTNAME>`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://<SUBDOMAIN>.iapps.com/SAMLAssertionService.aspx`

4. Check **Show advanced URL settings** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![Bridgeline Domain and URLs single sign-on information](./media/bridgelineunbound-tutorial/tutorial_bridgelineunbound_url1.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<SUBDOMAIN>.iapps.com/CommonLogin/login?<INSTANCENAME>`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-On URL. Contact [Bridgeline Unbound Client support team](mailto:support@iapps.com) to get these values. 

4. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![The Certificate download link](./media/bridgelineunbound-tutorial/tutorial_bridgelineunbound_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On Save button](./media/bridgelineunbound-tutorial/tutorial_general_400.png)

6. On the **Bridgeline Unbound Configuration** section, click **Configure Bridgeline Unbound** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Bridgeline Unbound Configuration](./media/bridgelineunbound-tutorial/tutorial_bridgelineunbound_configure.png) 

7. To configure single sign-on on **Bridgeline Unbound** side, you need to send the downloaded **Certificate (Base64)**, **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** to [Bridgeline Unbound support team](mailto:support@iapps.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/bridgelineunbound-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and grobridgelineinbound**, and then click **All users**.

    ![The "Users and grobridgelineinbound" and "All users" links](./media/bridgelineunbound-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/bridgelineunbound-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/bridgelineunbound-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Bridgeline Unbound test user

The objective of this section is to create a user called Britta Simon in Bridgeline Unbound. Bridgeline Unbound supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access Bridgeline Unbound if it doesn't exist yet.

>[!Note]
>If you need to create a user manually, contact [Bridgeline Unbound support team](mailto:support@iapps.com).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Bridgeline Unbound.

![Assign the user role][200] 

**To assign Britta Simon to Bridgeline Unbound, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Bridgeline Unbound**.

	![The Bridgeline Unbound link in the Applications list](./media/bridgelineunbound-tutorial/tutorial_bridgelineunbound_app.png)  

3. In the menu on the left, click **Users and grobridgelineinbound**.

	![The "Users and grobridgelineinbound" link][202]

4. Click **Add** button. Then select **Users and grobridgelineinbound** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and grobridgelineinbound** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and grobridgelineinbound** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Bridgeline Unbound tile in the Access Panel, you should get automatically signed-on to your Bridgeline Unbound application.
For more information about the Access Panel, see [Introduction to the Access Panel](../active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/bridgelineunbound-tutorial/tutorial_general_01.png
[2]: ./media/bridgelineunbound-tutorial/tutorial_general_02.png
[3]: ./media/bridgelineunbound-tutorial/tutorial_general_03.png
[4]: ./media/bridgelineunbound-tutorial/tutorial_general_04.png

[100]: ./media/bridgelineunbound-tutorial/tutorial_general_100.png

[200]: ./media/bridgelineunbound-tutorial/tutorial_general_200.png
[201]: ./media/bridgelineunbound-tutorial/tutorial_general_201.png
[202]: ./media/bridgelineunbound-tutorial/tutorial_general_202.png
[203]: ./media/bridgelineunbound-tutorial/tutorial_general_203.png

