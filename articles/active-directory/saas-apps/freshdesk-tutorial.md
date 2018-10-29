---
title: 'Tutorial: Azure Active Directory integration with FreshDesk | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and FreshDesk.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman

ms.assetid: c2a3e5aa-7b5a-4fe4-9285-45dbe6e8efcc
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/17/2018
ms.author: jeedes
ms.reviewer: jeedes

---
# Tutorial: Azure Active Directory integration with FreshDesk

In this tutorial, you learn how to integrate FreshDesk with Azure Active Directory (Azure AD).

Integrating FreshDesk with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to FreshDesk
- You can enable your users to automatically get signed-on to FreshDesk (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with FreshDesk, you need the following items:

- An Azure AD subscription
- A FreshDesk single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description

In this tutorial, you test Azure AD single sign-on in a test environment.
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding FreshDesk from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding FreshDesk from the gallery

To configure the integration of FreshDesk into Azure AD, you need to add FreshDesk from the gallery to your list of managed SaaS apps.

**To add FreshDesk from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]

3. Click **Add** button on the top of the dialog.

	![Applications][3]

4. In the search box, type **FreshDesk**. Select **FreshDesk** from the results panel, and then select the **Add** button to add the application.

	![Creating an Azure AD test user](./media/freshdesk-tutorial/tutorial_freshdesk_addfromgallery.png)

## Configuring and testing Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with FreshDesk based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in FreshDesk is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in FreshDesk needs to be established.

This link relationship is established by assigning the value of the **User Name** in Azure AD as the value of the **email address** in FreshDesk.

To configure and test Azure AD single sign-on with FreshDesk, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a FreshDesk test user](#creating-a-freshdesk-test-user)** - to have a counterpart of Britta Simon in FreshDesk that is linked to the Azure AD representation of her.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your FreshDesk application.

**To configure Azure AD single sign-on with FreshDesk, perform the following steps:**

1. In the Azure portal, on the **FreshDesk** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, as **Mode** select **SAML-based Sign-on** to enable single sign on.

	![Configure Single Sign-On](./media/freshdesk-tutorial/tutorial_freshdesk_samlbase.png)

3. On the **FreshDesk Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/freshdesk-tutorial/tutorial_freshdesk_url.png)

	a. In the **Sign on URL** textbox, type a URL using the following pattern: `https://<tenant-name>.freshdesk.com` or any other value Freshdesk has suggested.

	> [!NOTE]
	> Please note that this is not the real value. You have to update the value with the actual Sign-on URL. Contact [FreshDesk Client support team](https://freshdesk.com/helpdesk-software?utm_source=Google-AdWords&utm_medium=Search-IND-Brand&utm_campaign=Search-IND-Brand&utm_term=freshdesk&device=c&gclid=COSH2_LH7NICFVUDvAodBPgBZg) to get this value.

4. Your application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows an example for this. The default value of **User Identifier** is **user.userprincipalname** but **FreshDesk** expects this to be mapped with the user's email address. For that you can use **user.mail** attribute from the list or use the appropriate attribute value based on your organization configuration.

	![Configure Single Sign-On](./media/freshdesk-tutorial/tutorial_attribute.png)

5. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/freshdesk-tutorial/tutorial_freshdesk_certificate.png)

	> [!NOTE]
	> If you have any issues, please refer this [link](https://support.freshdesk.com/support/discussions/topics/317543).

6. Click **Save** button.

	![Configure Single Sign-On](./media/freshdesk-tutorial/tutorial_general_400.png)

7. Install **OpenSSL** in your system, if you have not installed in your system.

8. Open **Command Prompt** and run the following commands:

	a. Enter `openssl x509 -inform DER -in FreshDesk.cer -out certificate.crt` value in the command prompt.

	> [!NOTE]
	> Here **FreshDesk.cer** is the certificate which you have downloaded from the Azure portal.

	b. Enter `openssl x509 -noout -fingerprint -sha256 -inform pem -in certificate.crt` value in the command prompt. 
	
	> [!NOTE]
	> Here **certificate.crt** is the output certificate which is generated in the previous step.

	c. Copy the **Thumbprint** value and paste it into the Notepad. Remove colons from Thumbprint and obtain the final Thumbprint value.

9. On the **FreshDesk Configuration** section, click **Configure FreshDesk** to open Configure sign-on window. Copy the SAML Single Sign-On Service URL and Sign-Out URL from the **Quick Reference** section.

	![Configure Single Sign-On](./media/freshdesk-tutorial/tutorial_freshdesk_configure.png)

10. In a different web browser window, log into your Freshdesk company site as an administrator.

11. Select the **Settings icon** and in the **Security** section, perform the following steps:

	![Single Sign On](./media/freshdesk-tutorial/IC776770.png "Single Sign On")
  
	a. For **Single Sign On (SSO)**, select **On**.

	b. Select **SAML SSO**.

    c. In the **SAML Login URL** textbox, paste **SAML Single Sign-On Service URL** value, which you have copied from the Azure portal.

    d. In the **Logout URL** textbox, paste **Sign-Out URL** value, which you have copied from the Azure portal.

    e. In the **Security Certificate Fingerprint** textbox, paste **Thumbprint** value which you have obtained earlier after removing the colons.
  
	f. Click **Save**.

### Creating an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/freshdesk-tutorial/create_aaduser_01.png) 

2. Go to **Users and groups** and click **All users** to display the list of users.

	![Creating an Azure AD test user](./media/freshdesk-tutorial/create_aaduser_02.png) 

3. At the top of the dialog click **Add** to open the **User** dialog.

	![Creating an Azure AD test user](./media/freshdesk-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:

	![Creating an Azure AD test user](./media/freshdesk-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.

### Creating a FreshDesk test user

In order to enable Azure AD users to log into FreshDesk, they must be provisioned into FreshDesk.  
In the case of FreshDesk, provisioning is a manual task.

**To provision a user accounts, perform the following steps:**

1. Log in to your **Freshdesk** tenant.

2. In the menu on the top, click **Admin**.

   ![Admin](./media/freshdesk-tutorial/IC776772.png "Admin")

3. In the **General Settings** tab, click **Agents**.
  
   ![Agents](./media/freshdesk-tutorial/IC776773.png "Agents")

4. Click **New Agent**.

    ![New Agent](./media/freshdesk-tutorial/IC776774.png "New Agent")

5. On the Agent Information dialog, perform the following steps:

   ![Agent Information](./media/freshdesk-tutorial/IC776775.png "Agent Information")

   a. In the **Email** textbox, type the Azure AD email address of the Azure AD account you want to provision.

   b. In the **Full Name** textbox, type the name of the Azure AD account you want to provision.

   c. In the **Title** textbox, type the title of the Azure AD account you want to provision.

   d. Click **Save**.

	>[!NOTE]
	>The Azure AD account holder will get an email that includes a link to confirm the account before it is activated.
	>
	>[!NOTE]
	>You can use any other Freshdesk user account creation tools or APIs provided by Freshdesk to provision AAD user accounts to FreshDesk.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting her access to Box.

![Assign User][200]

**To assign Britta Simon to FreshDesk, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201]

2. In the applications list, select **FreshDesk**.

	![Configure Single Sign-On](./media/freshdesk-tutorial/tutorial_freshdesk_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.

### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the FreshDesk tile in the Access Panel, you should get login page to get signed-on to your FreshDesk application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/freshdesk-tutorial/tutorial_general_01.png
[2]: ./media/freshdesk-tutorial/tutorial_general_02.png
[3]: ./media/freshdesk-tutorial/tutorial_general_03.png
[4]: ./media/freshdesk-tutorial/tutorial_general_04.png

[100]: ./media/freshdesk-tutorial/tutorial_general_100.png

[200]: ./media/freshdesk-tutorial/tutorial_general_200.png
[201]: ./media/freshdesk-tutorial/tutorial_general_201.png
[202]: ./media/freshdesk-tutorial/tutorial_general_202.png
[203]: ./media/freshdesk-tutorial/tutorial_general_203.png