---
title: 'Tutorial: Azure Active Directory integration with Ivanti Service Manager (ISM) | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Ivanti Service Manager (ISM).
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 14297c74-0d57-4146-97fa-7a055fb73057
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/20/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Ivanti Service Manager (ISM)

In this tutorial, you learn how to integrate Ivanti Service Manager (ISM) with Azure Active Directory (Azure AD).

Integrating Ivanti Service Manager (ISM) with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Ivanti Service Manager (ISM).
- You can enable your users to automatically get signed-on to Ivanti Service Manager (ISM) (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md)

## Prerequisites

To configure Azure AD integration with Ivanti Service Manager (ISM), you need the following items:

- An Azure AD subscription
- An Ivanti Service Manager (ISM) single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description

In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Ivanti Service Manager (ISM) from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Ivanti Service Manager (ISM) from the gallery

To configure the integration of Ivanti Service Manager (ISM) into Azure AD, you need to add Ivanti Service Manager (ISM) from the gallery to your list of managed SaaS apps.

**To add Ivanti Service Manager (ISM) from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]

3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Ivanti Service Manager (ISM)**, select **Ivanti Service Manager (ISM)** from result panel then click **Add** button to add the application.

	![Ivanti Service Manager (ISM) in the results list](./media/ivanti-service-manager-tutorial/tutorial-ivanti-service-manager-addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Ivanti Service Manager (ISM) based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Ivanti Service Manager (ISM) is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Ivanti Service Manager (ISM) needs to be established.

To configure and test Azure AD single sign-on with Ivanti Service Manager (ISM), you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating an Ivanti Service Manager (ISM) test user](#creating-an-ivanti-service-manager-ism-test-user)** - to have a counterpart of Britta Simon in Ivanti Service Manager (ISM) that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing single sign-on](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Ivanti Service Manager (ISM) application.

**To configure Azure AD single sign-on with Ivanti Service Manager (ISM), perform the following steps:**

1. In the Azure portal, on the **Ivanti Service Manager (ISM)** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Select a Single sign-on method** dialog, Click **Select** for **SAML** mode to enable single sign-on.

    ![Configure Single Sign-On](common/tutorial-general-301.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Configure Single Sign-On](common/editconfigure.png)

4. On the **Basic SAML Configuration** section, perform the following steps, if you wish to configure the application in **IDP** initiated mode:

	![Ivanti Service Manager (ISM) Domain and URLs single sign-on information](./media/ivanti-service-manager-tutorial/tutorial-ivanti-service-manager-url.png)

    a. In the **Identifier** textbox, type a URL using the following pattern:
	| |
	|--|
	| `https://<customer>.saasit.com/` |
	| `https://<customer>.saasiteu.com/` |
	| `https://<customer>.saasitau.com/` |

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://<customer>/handlers/sso/SamlAssertionConsumerHandler.ashx`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![Ivanti Service Manager (ISM) Domain and URLs single sign-on information](./media/ivanti-service-manager-tutorial/tutorial-ivanti-service-manager-url1.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<customer>.saasit.com/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL. Contact [Ivanti Service Manager (ISM) Client support team](https://www.ivanti.com/support/contact) to get these values.

6. On the **SAML Signing Certificate** page, in the **SAML Signing Certificate** section, click **Download** to download **Certificate (Raw)** and then save certificate file on your computer.

	![The Certificate download link](./media/ivanti-service-manager-tutorial/tutorial-ivanti-service-manager-certificate.png) 

7. On the **Set up Ivanti Service Manager (ISM)** section, copy the appropriate URL as per your requirement.

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

	![Ivanti Service Manager (ISM) Configuration](common/configuresection.png)

8. To configure single sign-on on **Ivanti Service Manager (ISM)** side, you need to send the downloaded **Certificate (Raw)**, and copied **Login URL**, **Azure AD Identifier**, **Logout URL**  to [Ivanti Service Manager (ISM) support team](https://www.ivanti.com/support/contact). They set this setting to have the SAML SSO connection set properly on both sides.

### Creating an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

	![Create Azure AD User][100]

2. Select **New user** at the top of the screen.

	![Creating an Azure AD test user](common/create-aaduser-01.png) 

3. In the User properties, perform the following steps.

	![Creating an Azure AD test user](common/create-aaduser-02.png)

    a. In the **Name** field, enter **BrittaSimon**.
  
    b. In the **User name** field, type **brittasimon@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Properties**, select the **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Select **Create**.

### Creating an Ivanti Service Manager (ISM) test user

The objective of this section is to create a user called Britta Simon in Ivanti Service Manager (ISM). Ivanti Service Manager (ISM) supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access Ivanti Service Manager (ISM) if it doesn't exist yet.
>[!Note]
>If you need to create a user manually, contact [Ivanti Service Manager (ISM) support team](https://www.ivanti.com/support/contact).

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Ivanti Service Manager (ISM).

1. In the Azure portal, select **Enterprise Applications**, select **All applications**.

	![Assign User][201]

2. In the applications list, select **Ivanti Service Manager (ISM)**.

	![Configure Single Sign-On](./media/ivanti-service-manager-tutorial/tutorial-ivanti-service-manager-app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. In the **Add Assignment** dialog select the **Assign** button.

### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Ivanti Service Manager (ISM) tile in the Access Panel, you should get automatically signed-on to your Ivanti Service Manager (ISM) application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: common/tutorial-general-01.png
[2]: common/tutorial-general-02.png
[3]: common/tutorial-general-03.png
[4]: common/tutorial-general-04.png

[100]: common/tutorial-general-100.png

[201]: common/tutorial-general-201.png
[202]: common/tutorial-general-202.png
[203]: common/tutorial-general-203.png
