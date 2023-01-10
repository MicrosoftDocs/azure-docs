---
title: 'Tutorial: Azure AD SSO integration with Fidelity NetBenefits'
description: Learn how to configure single sign-on between Azure Active Directory and Fidelity NetBenefits.
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
# Tutorial: Azure AD SSO integration with Fidelity NetBenefits

In this tutorial, you'll learn how to integrate Fidelity NetBenefits with Azure Active Directory (Azure AD). When you integrate Fidelity NetBenefits with Azure AD, you can:

* Control in Azure AD who has access to Fidelity NetBenefits.
* Enable your users to be automatically signed-in to Fidelity NetBenefits with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Fidelity NetBenefits single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Fidelity NetBenefits supports **IDP** initiated SSO.

* Fidelity NetBenefits supports **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Fidelity NetBenefits from the gallery

To configure the integration of Fidelity NetBenefits into Azure AD, you need to add Fidelity NetBenefits from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Fidelity NetBenefits** in the search box.
1. Select **Fidelity NetBenefits** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Fidelity NetBenefits

Configure and test Azure AD SSO with Fidelity NetBenefits using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Fidelity NetBenefits.

To configure and test Azure AD SSO with Fidelity NetBenefits, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Fidelity NetBenefits SSO](#configure-fidelity-netbenefits-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Fidelity NetBenefits test user](#create-fidelity-netbenefits-test-user)** - to have a counterpart of B.Simon in Fidelity NetBenefits that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Fidelity NetBenefits** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** text box, type one of the following values:

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Fidelity NetBenefits.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Fidelity NetBenefits**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Fidelity NetBenefits SSO

To configure single sign-on on **Fidelity NetBenefits** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Fidelity NetBenefits support team](mailto:SSOMaintenance@fmr.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Fidelity NetBenefits test user

In this section, you create a user called Britta Simon in Fidelity NetBenefits. If you are creating Static federation, please work with your assigned **Fidelity Client Service Manager** to create users in Fidelity NetBenefits platform. These users must be created and activated before you use single sign-on.

For Dynamic Federation, users are created using Just In Time user provisioning. For using JIT based provisioning customers have to add some more claims in Azure AD like user's birthdate etc. These details are provided by the your assigned **Fidelity Client Service Manager** and they have to enable this dynamic federation for your instance.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the Fidelity NetBenefits for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Fidelity NetBenefits tile in the My Apps, you should be automatically signed in to the Fidelity NetBenefits for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Fidelity NetBenefits you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
