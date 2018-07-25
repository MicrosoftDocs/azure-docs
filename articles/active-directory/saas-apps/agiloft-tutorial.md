---
title: 'Tutorial: Azure Active Directory integration with Agiloft | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Agiloft.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: joflore

ms.assetid: aca13814-cdbd-46b8-93dc-1578099c5ee4
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/09/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Agiloft

In this tutorial, you learn how to integrate Agiloft with Azure Active Directory (Azure AD).

Integrating Agiloft with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Agiloft.
- You can enable your users to automatically get signed-on to Agiloft (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Agiloft, you need the following items:

- An Azure AD subscription
- An Agiloft single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Agiloft from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Agiloft from the gallery
To configure the integration of Agiloft into Azure AD, you need to add Agiloft from the gallery to your list of managed SaaS apps.

**To add Agiloft from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Agiloft**, select **Agiloft** from result panel then click **Add** button to add the application.

	![Agiloft in the results list](./media/agiloft-tutorial/tutorial_agiloft_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Agiloft based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Agiloft is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Agiloft needs to be established.

In Agiloft, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Agiloft, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create an Agiloft test user](#create-an-agiloft-test-user)** - to have a counterpart of Britta Simon in Agiloft that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Agiloft application.

**To configure Azure AD single sign-on with Agiloft, perform the following steps:**

1. In the Azure portal, on the **Agiloft** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/agiloft-tutorial/tutorial_agiloft_samlbase.png)

3. On the **Agiloft Domain and URLs** section, perform the following steps if you wish to configure the application in IDP initiated mode:

	![Agiloft Domain and URLs single sign-on information](./media/agiloft-tutorial/tutorial_agiloft_url.png)

    a. In the **Identifier** textbox, type a URL using the following pattern: 
	| |
	|-|-|
	| `https://<subdomain>.saas.enterprisewizard.com/project/<KB_NAME>` |
	| `https://<subdomain>.agiloft.com/project/<KB_NAME>` |

	b. In the **Reply URL** textbox, type a URL using the following pattern:
	| |
	|-|-|
	| `https://<subdomain>.saas.enterprisewizard.com:443/gui2/spsamlsso?project=<KB_NAME>` |
	| `https://<subdomain>.agiloft.com:443/gui2/spsamlsso?project=<KB_NAME>` |

4. Check **Show advanced URL settings** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![Agiloft Domain and URLs single sign-on information](./media/agiloft-tutorial/tutorial_agiloft_url1.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: 
	| |
	|-|-|
	| `https://<subdomain>.saas.enterprisewizard.com/gui2/samlssologin.jsp?project=<KB_NAME>` |
	| `https://<subdomain>.agiloft.com/gui2/samlssologin.jsp?project=<KB_NAME>` |
	 
	> [!NOTE] 
	> These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL. Contact [Agiloft Client support team](https://www.agiloft.com/support-login.htm) to get these values. 

5. On the **SAML Signing Certificate** section, click **Certificate(Base64)** and then save the certificate file on your computer.

	![The Certificate download link](./media/agiloft-tutorial/tutorial_agiloft_certificate.png) 

6. Click **Save** button.

	![Configure Single Sign-On Save button](./media/agiloft-tutorial/tutorial_general_400.png)
	
7. On the **Agiloft Configuration** section, click **Configure Agiloft** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Agiloft Configuration](./media/agiloft-tutorial/tutorial_agiloft_configure.png) 

8. In a different web browser window, log in to your Agiloft company site as an administrator.

9. Click on **Setup** (on the Left Pane) and then **Access**.

	![Agiloft Configuration](./media/agiloft-tutorial/setup1.png) 

10. Click on   the button **“Configure SAML 2.0 Single Sign-On“**. 
	
	![Agiloft Configuration](./media/agiloft-tutorial/setup2.png) 

11. A wizard dialog appears. On the dialog, click on the TAB  **“Identity Provider Details”** and fill in the following fields:  
	
	![Agiloft Configuration](./media/agiloft-tutorial/setup4.png) 

	a. In **IdP Entity Id / Issuer** textbox, paste the value of **SAML Entity ID**, which you have copied from Azure portal.

	b. In **IdP Login URL** textbox, paste the value of **Single Sign-On Service URL**, which you have copied from Azure portal.

	c. In **IdP Logout URL** textbox, paste the value of **Sign-Out URL**, which you have copied from Azure portal.

	d. Open your **base-64 encoded certificate** in notepad downloaded from Azure portal, copy the content of it into your clipboard, and then paste it to the **IdP Provided X.509 certificate contents** textbox.

	e. Click **Finish**.


> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/agiloft-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/agiloft-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/agiloft-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/agiloft-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create an Agiloft test user

Application supports Just in time user provisioning and after authentication users will be created in the application automatically. There is no action for you in this section.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Agiloft.

![Assign the user role][200] 

**To assign Britta Simon to Agiloft, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Agiloft**.

	![The Agiloft link in the Applications list](./media/agiloft-tutorial/tutorial_agiloft_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Agiloft tile in the Access Panel, you should get automatically signed-on to your Agiloft application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/agiloft-tutorial/tutorial_general_01.png
[2]: ./media/agiloft-tutorial/tutorial_general_02.png
[3]: ./media/agiloft-tutorial/tutorial_general_03.png
[4]: ./media/agiloft-tutorial/tutorial_general_04.png

[100]: ./media/agiloft-tutorial/tutorial_general_100.png

[200]: ./media/agiloft-tutorial/tutorial_general_200.png
[201]: ./media/agiloft-tutorial/tutorial_general_201.png
[202]: ./media/agiloft-tutorial/tutorial_general_202.png
[203]: ./media/agiloft-tutorial/tutorial_general_203.png

