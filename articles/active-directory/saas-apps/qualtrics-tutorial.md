---
title: 'Tutorial: Azure Active Directory integration with SAP Qualtrics | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SAP Qualtrics.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 4df889ab-2685-4d15-a163-1ba26567eeda
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 04/03/2020
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with SAP Qualtrics

In this tutorial, you'll learn how to integrate SAP Qualtrics with Azure Active Directory (Azure AD). When you integrate SAP Qualtrics with Azure AD, you can:

* Control in Azure AD who has access to SAP Qualtrics.
* Enable your users to be automatically signed in to SAP Qualtrics with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

To learn more about software as a service (SaaS) app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A SAP Qualtrics subscription enabled for single sign-on (SSO).

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* SAP Qualtrics supports **SP** and **IDP** initiated SSO.
* SAP Qualtrics supports **Just In Time** user provisioning.
* After you configure SAP Qualtrics, you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from conditional access. For more information, see [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Add SAP Qualtrics from the gallery

To configure the integration of SAP Qualtrics into Azure AD, you need to add SAP Qualtrics from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) by using either a work or school account, or a personal Microsoft account.
1. On the left pane, select **Azure Active Directory**.
1. Go to **Enterprise Applications**, and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, type **SAP Qualtrics** in the search box.
1. Select **SAP Qualtrics** from results, and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for SAP Qualtrics

Configure and test Azure AD SSO with SAP Qualtrics, by using a test user called **B.Simon**. For SSO to work, you need to establish a linked relationship between an Azure AD user and the related user in SAP Qualtrics.

To configure and test Azure AD SSO with SAP Qualtrics, complete the following building blocks:

1. [Configure Azure AD SSO](#configure-azure-ad-sso) to enable your users to use this feature.
    1. [Create an Azure AD test user](#create-an-azure-ad-test-user) to test Azure AD single sign-on with B.Simon.
    1. [Assign the Azure AD test user](#assign-the-azure-ad-test-user) to enable B.Simon to use Azure AD single sign-on.
1. [Configure SAP Qualtrics SSO](#configure-sap-qualtrics-sso) to configure the single sign-on settings on the application side.
    1. [Create a SAP Qualtrics test user](#create-sap-qualtrics-test-user) to have a counterpart of B.Simon in SAP Qualtrics, linked to the Azure AD representation of the user.
1. [Test SSO](#test-sso) to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **SAP Qualtrics** application integration page, find the **Manage** section. Select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot of Set up Single Sign-On with SAML page, with pencil icon highlighted](common/edit-urls.png)

1. On the **Set up single sign-on with SAML** page, if you want to configure the application in **IDP** initiated mode, enter the values for the following fields:
    
    a. In the **Identifier** text box, type a URL that uses the following pattern:

	`https://< DATACENTER >.qualtrics.com`
   
    b. In the **Reply URL** text box, type a URL that uses the following pattern:

    `https://< DATACENTER >.qualtrics.com/login/v1/sso/saml2/default-sp`

    c. In the **Relay State** text box, type a URL that uses the following pattern:

    `https://< brandID >.< DATACENTER >.qualtrics.com`

1. Select **Set additional URLs**, and perform the following step if you want to configure the application in **SP** initiated mode:

    In the **Sign-on URL** textbox, type a URL that uses the following pattern:

    `https://< brandID >.< DATACENTER >.qualtrics.com`

    > [!NOTE]
    > These values are not real. Update these values with the actual Sign-on URL, Identifier, Reply URL, and Relay State. To get these values, contact the [Qualtrics Client support team](https://www.qualtrics.com/support/). You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, select the copy icon to copy **App Federation Metadata Url** and save it on your computer.

	![Screenshot of SAML Signing Certificate, with copy icon highlighted](common/copy-metadataurl.png)

### Create an Azure AD test user

In this section, you create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory** > **Users** > **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write the password down.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you enable B.Simon to use Azure single sign-on by granting access to SAP Qualtrics.

1. In the Azure portal, select **Enterprise Applications** > **All applications**.
1. In the applications list, select **SAP Qualtrics**.
1. In the app's overview page, find the **Manage** section, and select **Users and groups**.

   ![Screenshot of the Manage section, with Users and groups highlighted](common/users-groups-blade.png)

1. Select **Add user**. Then in the **Add Assignment** dialog box, select **Users and groups**.

	![Screenshot of Users and groups page, with Add user highlighted](common/add-assign-user.png)

1. In the **Users and groups** dialog box, select **B.Simon** from the list of users. Then choose **Select** at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list. Then choose **Select** at the bottom of the screen.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure SAP Qualtrics SSO

To configure single sign-on on the SAP Qualtrics side, send the copied **App Federation Metadata Url** from the Azure portal to the [SAP Qualtrics support team](https://www.qualtrics.com/support/). The support team ensures that the SAML SSO connection is set properly on both sides.

### Create SAP Qualtrics test user

SAP Qualtrics supports just-in-time user provisioning, which is enabled by default. There is no additional action for you to take. If a user doesn't already exist in SAP Qualtrics, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration by using Access Panel.

When you select the SAP Qualtrics tile in Access Panel, you're automatically signed in to the SAP Qualtrics for which you set up SSO. For more information, see [Sign in and start apps from the My Apps portal](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [Tutorials for integrating SaaS applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try SAP Qualtrics with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [Protect SAP Qualtrics with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

