---
title: 'Tutorial: Azure Active Directory integration with Costpoint | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Costpoint.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: celested

ms.assetid: 9ecc5f58-4462-4ade-ab73-0a4f61027504
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 08/06/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Integrate Costpoint with Azure Active Directory

In this tutorial, you'll learn how to integrate Costpoint with Azure Active Directory (Azure AD). When you integrate Costpoint with Azure AD, you can:

* Control in Azure AD who has access to Costpoint.
* Enable your users to be automatically signed-in to Costpoint with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Costpoint single sign-on (SSO) enabled subscription.

## Scenario Description

In this tutorial, you will configure and test Azure AD SSO in a test environment. Costpoint supports **SP and IDP** initiated SSO.

## Adding Costpoint from the gallery

To configure the integration of Costpoint into Azure AD, you need to add Costpoint from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Costpoint** in the search box.
1. Select **Costpoint** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on

Configure and test Azure AD SSO with Costpoint using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Costpoint.

To configure and test Azure AD SSO with Costpoint, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.
2. **[Configure Costpoint](#configure-costpoint)** to configure the SSO settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with B.Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable B.Simon to use Azure AD single sign-on.
5. **[Create Costpoint test user](#create-costpoint-test-user)** to have a counterpart of B.Simon in Costpoint that is linked to the Azure AD representation of user.
6. **[Test SSO](#test-sso)** to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Costpoint** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you have **Service Provider metadata file**, perform the following steps:

	> [!NOTE]
	> You will get the Service Provider metadata file from the **Generate Costpoint Metadata** section, which is explained later in the tutorial.
 
	1. Click **Upload metadata file**.
	
	1. Click on **folder logo** to select the metadata file and click **Upload**.
	
	1. Once the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values get auto populated in Costpoint section textboxes

		> [!Note]
		> If the **Identifier** and **Reply URL** values are not getting auto polulated, then fill in the values manually according to your requirement. Verify that **Identifier (Entity ID)** and **Reply URL (Assertion Consumer Service URL)** are correctly set and that **ACS URL** is a valid Costpoint URL ending with **/LoginServlet.cps**.

	1. Click **Set additional URLs**.

    1. In the **Relay State** text box, type a value using the following pattern:`system=[your system], (for example, **system=DELTEKCP**)`

1. If you wish to configure the application in **SP** initiated mode perform the following step:
	
	In the **Sign-on URL** text box, type a URL:
    `https://costpointteea.deltek.com/cpweb/cploginform.htm`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Relay State. Contact [Costpoint Client support team](https://www.deltek.com/about/contact-us) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click the copy icon to copy **App Federation Metadata Url** and save it to Notepad.

   ![The Certificate download link](common/copy-metadataurl.png)

### Generate Costpoint Metadata

Costpoint SAML SSO configuration is explained in the **DeltekCostpoint711Security.pdf** guide. From that refer to the **SAML Single Sign-on Setup -> Configure SAML Single Sign-on between Costpoint and Azure AD** section. Follow the instructions and generate **Costpoint SP Federation Metadata XML** file. Use this in the **Basic SAML Configuration** in Azure portal.

![Costpoint Configuration Utility](./media/costpoint-tutorial/config02.png)

> [!NOTE]
> You will get the **DeltekCostpoint711Security.pdf** guide from the [Costpoint Client support team](https://www.deltek.com/about/contact-us). If you do not have this file please contact them to get this file.

### Configure Costpoint

Return to **Costpoint Configuration Utility** and paste the **App Federation Metadata Url** into the **IdP Federation Metadata XML** text box and continue the instructions from the **DeltekCostpoint711Security.pdf** guide to finish the Costpoint SAML setup. 

![Costpoint Configuration Utility](./media/costpoint-tutorial/config01.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting B.simon access to Costpoint.

1. In the Azure portal, select **Enterprise Applications** > **All applications**.
1. In the applications list, select **Costpoint**.
1. In the **Manage** section of the app's overview page, select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, and select **Users and groups** in the **Add Assignment** dialog box.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog box, select **Britta Simon** from the Users list, and click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, click the **Assign** button.

### Create Costpoint test user

In this section, you will create a user in Costpoint. Assume the **User ID** is **B.SIMON** and the name **B.Simon**. Work with the [Costpoint Client support team](https://www.deltek.com/about/contact-us) to add the user in the Costpoint platform. The user must be created and activated before you use single sign-on.
 
Once created, the user's **Authentication Method** selection must be **Active Directory**, the **SAML Single Sign-on** check box must be selected, and the user name from Azure Active Directory must be **Active Directory or Certificate ID** (as shown below).

![Costpoint User](./media/costpoint-tutorial/user01.png)

### Test SSO

When you select the Costpoint tile in the Access Panel, you should be automatically signed in to the Costpoint for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)