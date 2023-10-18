---
title: Microsoft Entra SSO integration with GovWin IQ
description: Learn how to configure single sign-on between Microsoft Entra ID and GovWin IQ.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 09/27/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with GovWin IQ

In this tutorial, you'll learn how to integrate GovWin IQ with Microsoft Entra ID. GovWin IQ by Deltek is the industry-leading platform providing the most comprehensive market intelligence for U.S. federal, state and local, and Canadian governments. When you integrate GovWin IQ with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to GovWin IQ.
* Enable your users to be automatically signed-in to GovWin IQ with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To integrate Microsoft Entra ID with GovWin IQ, you need:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* An active GovWin IQ Subscription. Single sign-on can be enabled at no cost. Make sure your Customer Success Manager has enabled a user at your organization as a SAML SSO Admin to perform the following steps.
* All users must have same email address in Azure as provisioned in GovWin IQ.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* GovWin IQ supports only **SP** initiated SSO.

> [!NOTE] 
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding GovWin IQ from the gallery

To configure the integration of GovWin IQ into Microsoft Entra ID, you need to add GovWin IQ from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **GovWin IQ** in the search box.
1. Select **GovWin IQ** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, and walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Microsoft Entra SSO for GovWin IQ

Configure and test Microsoft Entra SSO with GovWin IQ using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in GovWin IQ.

To configure and test Microsoft Entra SSO with GovWin IQ, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-microsoft-entra-sso)** - to enable your users to use this feature.
    1. **[Assign the Microsoft Entra ID test user](#assign-the-microsoft-entra-id-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure GovWin IQ SSO](#configure-govwin-iq-sso)** - to configure the single sign-on settings on application side.
    1. **[Assign GovWin IQ test user to SSO](#assign-govwin-iq-test-user-to-sso)** - to have a counterpart of B.Simon in GovWin IQ that is linked to the Microsoft Entra ID representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO in the Microsoft Entra admin center.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **GovWin IQ** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type the URL:
    `https://iq.govwin.com/cas`

    b. In the **Reply URL** textbox, enter the value from the GovWin IQ Reply URL field.
    
    Reply URL will be of the following pattern:
    `https://iq.govwin.com/cas/login?client_name=ORG_<ID>`

	c. In the **Sign on URL** textbox, enter the value from the GovWIn IQ Sign On URL field. 

    Sign on URL will be of the following pattern: 
    `https://iq.govwin.com/cas/clientredirect?client_name=ORG_<ID>`

	> [!NOTE]
    > Update these values with the actual Reply URL and Sign on URL found in the GovWin SAML Single Sign-On Configuration page, accessible by your designated SAML SSO Admin. Reach out to your [Customer Success Manager](mailto:CustomerSuccess@iq.govwin.com) for assistance. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Microsoft Entra admin center.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

### Assign the Microsoft Entra ID test user

In this section, you'll enable a test user to use Microsoft Entra single sign-on by granting access to GovWin IQ.

   > [!Note]
   > The user selected for testing must have an existing active GovWin IQ account. 

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **GovWin IQ**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select a test user from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure GovWin IQ SSO

1. Log in to GovWin IQ company site as the SAML SSO Admin user.

1. Navigate to [**SAML Single Sign-On Configuration** page](https://iq.govwin.com/neo/authenticationConfiguration/viewSamlSSOConfig) and perform the following steps:

    ![Screenshot shows settings of the configuration.](./media/govwin-iq-tutorial/settings.png "Account")

    1. Select **Azure** from the Identity Provider (IdP) dropdown.
    1. Copy **Identifier (EntityID)** value, paste this value into the **Identifier** textbox in the **Basic SAML Configuration** section in Microsoft Entra admin center.
    1. Copy **Reply URL** value, paste this value into the **Reply URL** textbox in the **Basic SAML Configuration** section in Microsoft Entra admin center.
    1. Copy **Sign On URL** value, paste this value into the **Sign on URL** textbox in the **Basic SAML Configuration** section in Microsoft Entra admin center.

1. In the **Metadata URL** textbox, paste the **App Federation Metadata Url**, which you have copied from the Microsoft Entra admin center.

    ![Screenshot shows metadata of the configuration.](./media/govwin-iq-tutorial/values.png "Folder")

1. Click **Submit IDP Metadata**.

### Assign GovWin IQ test user to SSO

1. In the [**SAML Single Sign-On Configuration** page](https://iq.govwin.com/neo/authenticationConfiguration/viewSamlSSOConfig), navigate to **Excluded Users** tab  and click **Select Users to Exclude from SSO**.

    ![Screenshot shows how to exclude users from the page.](./media/govwin-iq-tutorial/data.png "Users")

    > [!Note] 
    > Here you can select users to include or exclude from SSO. If you have a webservices subscription, the webservices user should always be excluded from SSO.

1. Next, click **Exclude All Users from SSO** for testing purposes. This is to prevent any impact to existing access for users while testing SSO.

1. Next, select the test user and click Add Selected Users to SSO.

1. Once testing is successful, add the rest of the users you want to enable for SSO.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.

> [!Note]
> It may take up to 10 minutes for the configuration to sync.

* Click on **Test this application** in Microsoft Entra admin center. This will redirect to GovWin IQ Sign-on URL where you can initiate the login flow.

* Go to GovWin IQ Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the GovWin IQ tile in the My Apps, this will redirect to GovWin IQ Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next Steps

Add all remaining users to the Microsoft Entra ID GovWin IQ app to enable SSO access. Once you configure GovWin IQ you can enforce session control, which protects exfiltration and infiltration of your organization's sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).