---
title: 'Tutorial: Azure Active Directory integration with Fidelity NetBenefits | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Fidelity NetBenefits.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 77dc8a98-c0e7-4129-ab88-28e7643e432a
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 02/12/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Fidelity NetBenefits

In this tutorial, you learn how to integrate Fidelity NetBenefits with Azure Active Directory (Azure AD).
Integrating Fidelity NetBenefits with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Fidelity NetBenefits.
* You can enable your users to be automatically signed-in to Fidelity NetBenefits (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Fidelity NetBenefits, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Fidelity NetBenefits single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Fidelity NetBenefits supports **IDP** initiated SSO

* Fidelity NetBenefits supports **Just In Time** user provisioning

## Adding Fidelity NetBenefits from the gallery

To configure the integration of Fidelity NetBenefits into Azure AD, you need to add Fidelity NetBenefits from the gallery to your list of managed SaaS apps.

**To add Fidelity NetBenefits from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Fidelity NetBenefits**, select **Fidelity NetBenefits** from result panel then click **Add** button to add the application.

	 ![Fidelity NetBenefits in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Fidelity NetBenefits based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Fidelity NetBenefits needs to be established.

To configure and test Azure AD single sign-on with Fidelity NetBenefits, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Fidelity NetBenefits Single Sign-On](#configure-fidelity-netbenefits-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Fidelity NetBenefits test user](#create-fidelity-netbenefits-test-user)** - to have a counterpart of Britta Simon in Fidelity NetBenefits that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Fidelity NetBenefits, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Fidelity NetBenefits** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Set up Single Sign-On with SAML** page, perform the following steps:

    ![Fidelity NetBenefits Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:

    For Testing Environment:
	`urn:sp:fidelity:geninbndnbparts20:uat:xq1`

	For Production Environment:
	`urn:sp:fidelity:geninbndnbparts20`

    b. In the **Reply URL** text box, type a URL that to be provided by Fidelity at time of implementation or contact your assigned Fidelity Client Service Manager.

5. Fidelity NetBenefits application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes, where as **nameidentifier** is mapped with **user.userprincipalname**. Fidelity NetBenefits application expects **nameidentifier** to be mapped with **employeeid** or any other claim which is applicable to your Organization as **nameidentifier**, so you need to edit the attribute mapping by clicking on **Edit** icon and change the attribute mapping.

	![image](common/edit-attribute.png)

	>[!Note]
	>Fidelity NetBenefits support Static and Dynamic Federation. Static means it will not use SAML based just in time user provisioning and Dynamic means it supports just in time user provisioning. For using JIT based provisioning customers have to add some more claims in Azure AD like user's birthdate etc. These details are provided by the your assigned **Fidelity Client Service Manager** and they have to enable this dynamic federation for your instance.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

7. On the **Set up Fidelity NetBenefits** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure Fidelity NetBenefits Single Sign-On

To configure single sign-on on **Fidelity NetBenefits** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Fidelity NetBenefits support team](mailto:SSOMaintenance@fmr.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon\@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Fidelity NetBenefits.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Fidelity NetBenefits**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Fidelity NetBenefits**.

	![The Fidelity NetBenefits link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Fidelity NetBenefits test user

In this section, you create a user called Britta Simon in Fidelity NetBenefits. If you are creating Static federation, please work with your assigned **Fidelity Client Service Manager** to create users in Fidelity NetBenefits platform. These users must be created and activated before you use single sign-on.

For Dynamic Federation, users are created using Just In Time user provisioning. For using JIT based provisioning customers have to add some more claims in Azure AD like user's birthdate etc. These details are provided by the your assigned **Fidelity Client Service Manager** and they have to enable this dynamic federation for your instance.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Fidelity NetBenefits tile in the Access Panel, you should be automatically signed in to the Fidelity NetBenefits for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

