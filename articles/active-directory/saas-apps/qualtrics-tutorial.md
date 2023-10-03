---
title: 'Tutorial: Microsoft Entra integration with SAP Qualtrics'
description: Learn how to configure single sign-on between Microsoft Entra ID and SAP Qualtrics.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---

# Tutorial: Microsoft Entra single sign-on (SSO) integration with SAP Qualtrics

In this tutorial, you'll learn how to integrate SAP Qualtrics with Microsoft Entra ID. When you integrate SAP Qualtrics with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to SAP Qualtrics.
* Enable your users to be automatically signed in to SAP Qualtrics with their Microsoft Entra accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To get started, you need:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A SAP Qualtrics subscription enabled for single sign-on (SSO).

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* SAP Qualtrics supports **SP** and **IDP** initiated SSO.
* SAP Qualtrics supports **Just In Time** user provisioning.

## Add SAP Qualtrics from the gallery

To configure the integration of SAP Qualtrics into Microsoft Entra ID, you need to add SAP Qualtrics from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **SAP Qualtrics** in the search box.
1. Select **SAP Qualtrics** from results, and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-single-sign-on-for-sap-qualtrics'></a>

## Configure and test Microsoft Entra single sign-on for SAP Qualtrics

Configure and test Microsoft Entra SSO with SAP Qualtrics, by using a test user called **B.Simon**. For SSO to work, you need to establish a linked relationship between a Microsoft Entra user and the related user in SAP Qualtrics.

To configure and test Microsoft Entra SSO with SAP Qualtrics, complete the following building blocks:

1. [Configure Microsoft Entra SSO](#configure-azure-ad-sso) to enable your users to use this feature.
    1. [Create a Microsoft Entra test user](#create-an-azure-ad-test-user) to test Microsoft Entra single sign-on with B.Simon.
    1. [Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user) to enable B.Simon to use Microsoft Entra single sign-on.
1. [Configure SAP Qualtrics SSO](#configure-sap-qualtrics-sso) to configure the single sign-on settings on the application side.
    1. [Create a SAP Qualtrics test user](#create-sap-qualtrics-test-user) to have a counterpart of B.Simon in SAP Qualtrics, linked to the Microsoft Entra representation of the user.
1. [Test SSO](#test-sso) to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SAP Qualtrics** application integration page, find the **Manage** section. Select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

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
    > These values are not real. Update these values with the actual Sign-on URL, Identifier, Reply URL, and Relay State. To get these values, contact the [Qualtrics Client support team](https://www.qualtrics.com/support/). You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, select the copy icon to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you create a test user called B.Simon.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you enable B.Simon to use Azure single sign-on by granting access to SAP Qualtrics.

1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. In the applications list, select **SAP Qualtrics**.
1. In the app's overview page, find the **Manage** section, and select **Users and groups**.
1. Select **Add user**. Then in the **Add Assignment** dialog box, select **Users and groups**.
1. In the **Users and groups** dialog box, select **B.Simon** from the list of users. Then choose **Select** at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list. Then choose **Select** at the bottom of the screen.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure SAP Qualtrics SSO

To configure single sign-on on the SAP Qualtrics side, send the copied **App Federation Metadata Url** to the [SAP Qualtrics support team](https://www.qualtrics.com/support/). The support team ensures that the SAML SSO connection is set properly on both sides.

### Create SAP Qualtrics test user

SAP Qualtrics supports just-in-time user provisioning, which is enabled by default. There is no additional action for you to take. If a user doesn't already exist in SAP Qualtrics, a new one is created after authentication.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to SAP Qualtrics Sign on URL where you can initiate the login flow.  

* Go to SAP Qualtrics Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the SAP Qualtrics for which you set up the SSO.

You can also use Microsoft My Apps to test the application in any mode. When you click the SAP Qualtrics tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the SAP Qualtrics for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

After you configure SAP Qualtrics, you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. For more information, see [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
