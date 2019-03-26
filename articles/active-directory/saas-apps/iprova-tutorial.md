---
title: 'Tutorial: Azure Active Directory integration with iProva | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and iProva.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: barbkess

ms.assetid: 1eaeef9b-4479-4a9f-b1b2-bc13b857c75c
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 12/24/2018
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with iProva

In this tutorial, you learn how to integrate iProva with Azure Active Directory (Azure AD).
Integrating iProva with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to iProva.
* You can enable your users to be automatically signed in to iProva (single sign-on) with their Azure AD accounts.
* You can manage your accounts in one central location, the Azure portal.

For more information about software as a service (SaaS) app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with iProva, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a one-month trial on the [Microsoft Azure](https://azure.microsoft.com/pricing/free-trial/) website.
* An iProva SSO-enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment:

* iProva supports SP-initiated SSO.

## Add iProva from the gallery

To configure the integration of iProva into Azure AD, add iProva from the gallery to your list of managed SaaS apps.

To add iProva from the gallery, follow these steps:

1. In the [Azure portal](https://portal.azure.com), in the left pane, select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise Applications**, and then select **All Applications**.

	![The Enterprise Applications blade](common/enterprise-applications.png)

3. To add a new application, select **New application** at the top of the dialog box.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **iProva**. Select **iProva** from the result panel, and then select **Add** to add the application.

	 ![iProva in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with iProva based on a test user named Britta Simon.
For single sign-on to work, you must establish a link relationship between an Azure AD user and the related user in iProva.

To configure and test Azure AD single sign-on with iProva, complete the following building blocks:

- [Retrieve configuration information from iProva](#retrieve-configuration-information-from-iprova) as a preparation for the next steps.
- [Configure Azure AD single sign-on](#configure-azure-ad-single-sign-on) to enable your users to use this feature.
- [Configure iProva single sign-on](#configure-iprova-single-sign-on) to configure the single sign-on settings on the application side.
- [Create an Azure AD test user](#create-an-azure-ad-test-user) to test Azure AD single sign-on with Britta Simon.
- [Assign the Azure AD test user](#assign-the-azure-ad-test-user) to enable Britta Simon to use Azure AD single sign-on.
- [Create an iProva test user](#create-an-iprova-test-user) to have a counterpart of Britta Simon in iProva that's linked to the Azure AD representation of the user.
- [Test single sign-on](#test-single-sign-on) to verify whether the configuration works.

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

To configure Azure AD single sign-on with iProva, follow these steps.

1. In the [Azure portal](https://portal.azure.com/), on the **iProva** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. In the **Select a single sign-on method** dialog box, select the **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, select the **Edit** icon to open the **Basic SAML Configuration** dialog box.

	![Edit icon in Basic SAML Configuration](common/edit-urls.png)

4. In the **Basic SAML Configuration** section, follow these steps.

	a. Fill the **Identifier** box with the value that's displayed behind the label **EntityID** on the **iProva SAML2 info** page. This page is still open in your other browser tab.

	b. Fill the **Reply-URL** box with the value that's displayed behind the label **Reply URL** on the **iProva SAML2 info** page. This page is still open in your other browser tab.

	c. Fill the **Sign-on URL** box with the value that's displayed behind the label **Sign-on URL** on the **iProva SAML2 info** page. This page is still open in your other browser tab.

	![iProva domain and URLs single sign-on information](common/sp-identifier-reply.png)

5. The iProva application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on the application integration page. On the **Set up Single Sign-On with SAML** page, select the **Edit** icon to open the **User Attributes** dialog box.

	![User Attributes dialog box](common/edit-attribute.png)

6. In the **User Claims** section in the **User Attributes** dialog box, configure the SAML token attribute as shown in the previous image. Follow these steps.

	| Name | Source attribute| Namespace |
	| ---------------| -------- | -----|
	| `samaccountname` | `user.onpremisessamaccountname`| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims`|
	| | |

	a. Select **Add new claim** to open the **Manage user claims** dialog box.

	![User claims](common/new-save-attribute.png)

	![Manage user claims dialog box](common/new-attribute-details.png)

	b. In the **Name** box, enter the attribute name shown for that row.

	c. From the **Namespace** list, enter the namespace value shown for that row.

	d. Select the **Source** option as **Attribute**.

	e. From the **Source attribute** list, enter the attribute value shown for that row.

	f. Select **Ok**.

	g. Select **Save**.

7. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, select the **Copy** icon to copy the **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

### Configure iProva single sign-on

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

In this section, you create a test user in the Azure portal named Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory** > **Users** > **All users**.

    ![The Users and groups and All users links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user button](common/new-user.png)

3. In the **User** dialog box, follow these steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** box, enter a name like **BrittaSimon**.
  
    b. In the **User name** box, enter *yourname\@yourcompanydomain.extension*. 
    An example is BrittaSimon@contoso.com.

    c. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.

    d. Select **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to iProva.

1. In the Azure portal, select **Enterprise applications** > **All applications** > **iProva**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **iProva**.

	![The iProva link in the applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The Users and groups link](common/users-groups-blade.png)

4. Select **Add user**, and then select **Users and groups** in the **Add Assignment** dialog box.

    ![The Add Assignment dialog box](common/add-assign-user.png)

5. In the **Users and groups** dialog box, select **Britta Simon** in the **Users** list, and then choose **Select** at the bottom of the screen.

6. If you expect any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list. Choose **Select** at the bottom of the screen.

7. In the **Add Assignment** dialog box, select **Assign**.

### Create an iProva test user

1. Sign in to iProva by using the **Administrator** account.

2. Open the **Go to** menu.

3. Select **Application management**.

4. Select **Users** in the **Users and user groups** panel.

5. Select **Add**.

6. In the **Username** box, enter *brittasimon\@yourcompanydomain.extension*. 
    An example is BrittaSimon@contoso.com.

7. In the **Full name** box, enter a full name like **BrittaSimon**.

8. Select the **No password (use single sign-on)** option.

9. In the **E-mail address** box, enter *yourname\@yourcompanydomain.extension*. 
   An example is BrittaSimon@contoso.com.

10. Scroll down to the end of the page, and select **Finish**.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration by using the Access Panel.

When you select the iProva tile in the Access Panel, you should be automatically signed in to the iProva for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)
- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)
- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
- [iProva - How to configure SAML2 single sign-on](https://webshare.iprova.nl/0wqwm45yn09f5poh/Document.aspx)
