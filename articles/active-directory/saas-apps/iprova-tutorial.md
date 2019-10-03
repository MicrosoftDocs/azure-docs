---
title: 'Tutorial: Azure Active Directory integration with iProva | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and iProva.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 1eaeef9b-4479-4a9f-b1b2-bc13b857c75c
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 04/14/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with iProva

In this tutorial, you learn how to integrate iProva with Azure Active Directory (Azure AD).
Integrating iProva with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to iProva.
* You can enable your users to be automatically signed-in to iProva (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with iProva, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* iProva single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* iProva supports **SP** initiated SSO

## Adding iProva from the gallery

To configure the integration of iProva into Azure AD, you need to add iProva from the gallery to your list of managed SaaS apps.

**To add iProva from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **iProva**, select **iProva** from result panel then click **Add** button to add the application.

	![iProva in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with iProva based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in iProva needs to be established.

To configure and test Azure AD single sign-on with iProva, you need to complete the following building blocks:

1. **[Retrieve configuration information from iProva](#retrieve-configuration-information-from-iprova)** as a preparation for the next steps.
2. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
3. **[Configure iProva Single Sign-On](#configure-iprova-single-sign-on)** - to configure the Single Sign-On settings on application side.
4. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
5. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
6. **[Create iProva test user](#create-iprova-test-user)** - to have a counterpart of Britta Simon in iProva that is linked to the Azure AD representation of user.
7. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Retrieve configuration information from iProva

In this section, you retrieve information from iProva to configure Azure AD single sign-on.

1. Open a web browser, and go to the **SAML2 info** page in iProva by using the following URL pattern:

	| | |
	|-|-|
	| `https://SUBDOMAIN.iprova.nl/saml2info`|
	| `https://SUBDOMAIN.iprova.be/saml2info`|
	| | |

	![View the iProva SAML2 info page](media/iprova-tutorial/iprova-saml2-info.png)

2. Leave the browser tab open while you proceed with the next steps in another browser tab.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with iProva, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **iProva** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![iProva Domain and URLs single sign-on information](common/sp-identifier-reply.png)

	a. Fill the **Identifier** box with the value that's displayed behind the label **EntityID** on the **iProva SAML2 info** page. This page is still open in your other browser tab.

	b. Fill the **Reply-URL** box with the value that's displayed behind the label **Reply URL** on the **iProva SAML2 info** page. This page is still open in your other browser tab.

	c. Fill the **Sign-on URL** box with the value that's displayed behind the label **Sign-on URL** on the **iProva SAML2 info** page. This page is still open in your other browser tab.

5. iProva application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

	![image](common/edit-attribute.png)

6. In the **User Claims** section on the **User Attributes** dialog, edit the claims by using **Edit icon** or add the claims by using **Add new claim** to configure SAML token attribute as shown in the image above and perform the following steps:

	| Name | Source Attribute| Namespace  |
	| ---------------| -------- | -----|
	| `samaccountname` | `user.onpremisessamaccountname`| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims`|

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. In the **Namespace** textbox, type the namespace value shown for that row.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

7. On the **Set up Single Sign-On with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

### Configure iProva Single Sign-On

1. Sign in to iProva by using the **Administrator** account.

2. Open the **Go to** menu.

3. Select **Application management**.

4. Select **General** in the **System settings** panel.

5. Select **Edit**.

6. Scroll down to **Access control**.

	![iProva Access control settings](media/iprova-tutorial/iprova-accesscontrol.png)

7. Find the setting **Users are automatically logged on with their network accounts**, and change it to **Yes, authentication via SAML**. Additional options now appear.

8. Select **Set up**.

9. Select **Next**.

10. iProva asks if you want to download federation data from a URL or upload it from a file. Select the **From URL** option.

	![Download Azure AD metadata](media/iprova-tutorial/iprova-download-metadata.png)

11. Paste the metadata URL you saved in the last step of the "Configure Azure AD single sign-on" section.

12. Select the arrow-shaped button to download the metadata from Azure AD.

13. When the download is complete, the confirmation message **Valid Federation Data file downloaded** appears.

14. Select **Next**.

15. Skip the **Test login** option for now, and select **Next**.

16. In the **Claim to use** drop-down box, select **windowsaccountname**.

17. Select **Finish**.

18. You now return to the **Edit general settings** screen. Scroll down to the bottom of the page, and select **OK** to save your configuration.

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type `brittasimon@yourcompanydomain.extension`. For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to iProva.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **iProva**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **iProva**.

	![The iProva link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create iProva test user

1. Sign in to iProva by using the **Administrator** account.

2. Open the **Go to** menu.

3. Select **Application management**.

4. Select **Users** in the **Users and user groups** panel.

5. Select **Add**.

6. In the **Username** box, enter the username of user like `BrittaSimon@contoso.com`.

7. In the **Full name** box, enter a full name of user like **BrittaSimon**.

8. Select the **No password (use single sign-on)** option.

9. In the **E-mail address** box, enter the email address of user like `BrittaSimon@contoso.com`.

10. Scroll down to the end of the page, and select **Finish**.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the iProva tile in the Access Panel, you should be automatically signed in to the iProva for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)