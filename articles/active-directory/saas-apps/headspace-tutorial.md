---
title: 'Tutorial: Microsoft Entra SSO integration with Headspace'
description: Learn how to configure single sign-on between Microsoft Entra ID and Headspace.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 07/10/2023
ms.author: jeedes

---

# Tutorial: Microsoft Entra SSO integration with Headspace

In this tutorial, you'll learn how to integrate Headspace with Microsoft Entra ID. When you integrate Headspace with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Headspace.
* Enable your users to be automatically signed-in to Headspace with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Headspace single sign-on (SSO) enabled subscription.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Microsoft Entra ID.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Headspace supports **SP** initiated SSO.
* Headspace supports **Just In Time** user provisioning.

## Add Headspace from the gallery

To configure the integration of Headspace into Microsoft Entra ID, you need to add Headspace from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Headspace** in the search box.
1. Select **Headspace** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-headspace'></a>

## Configure and test Microsoft Entra SSO for Headspace

Configure and test Microsoft Entra SSO with Headspace using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Headspace.

To configure and test Microsoft Entra SSO with Headspace, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Headspace SSO](#configure-headspace-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Headspace test user](#create-headspace-test-user)** - to have a counterpart of B.Simon in Headspace that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Headspace** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

    ![Screenshot shows to edit Basic S A M L Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type a value using the following pattern:
    `urn:auth0:<Auth0TenantName>:<CustomerConnectionName>`

    b. In the **Reply URL** textbox, type a value using the following pattern:
    `https://auth.<Environment>.headspace.com/login/callback?connection=<CustomerConnectionName>`

    c. In the **Sign on URL** textbox, type the URL:
    `https://headspace.com/sso-login`

    > [!Note]
    > These values are not real. Update these values with the actual Identifier and Reply URL. Contact [Headspace Client support team](mailto:employer-solution-squad@headspace.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. Headspace application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

    ![Screenshot shows the image of Headspace application.](common/default-attributes.png "Attributes")

1. In addition to above, Headspace application expects few more attributes to be passed back in SAML response, which are shown below. These attributes are also pre populated but you can review them as per your requirements.

    | Name | Source Attribute|
    | ------------ | --------- |
    | email | user.userprincipalname |
    | family_name | user.surname |
    | given_name | user.givenname |

1. In order to fill Headspace's requirements, please follow the steps below to correctly configure the necessary Attributes & Claims:

	1. Click the pencil or **Edit** in the Attributes & Claims modal which should open a new page.

	2. Update the claims to match the below image, see step 3 for configuring `email`.
	
    ![Screenshot shows the image of Headspace attributes.](./media/headspace-tutorial/claims.png "Attributes")

	3. Open to manage the `email` claim and select **Transform** as the Source type and configure the transformation to match the screenshot below.
	
    ![Screenshot shows the image of Headspace email claim.](./media/headspace-tutorial/email-attribute.png "Attributes")
    
1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (PEM)** and select **Download** to download the certificate and save it on your computer.

	![Screenshot shows the Certificate download link.](common/certificate-base64-download.png "Certificate")

1. On the **Set up Headspace** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate U R L.](common/copy-configuration-urls.png "Metadata")    

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you'll create a test user called B.Simon.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Headspace.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Headspace**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Headspace SSO

To configure single sign-on on **Headspace** side, you need to send the downloaded **Certificate (PEM)** and appropriate copied URLs from the application configuration to [Headspace support team](mailto:employer-solution-squad@headspace.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Headspace test user

In this section, a user called B.Simon is created in Headspace. Headspace supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Headspace, a new one is created after authentication.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to Headspace Sign on URL where you can initiate the login flow. 

* Go to Headspace Sign on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Headspace tile in the My Apps, this will redirect to Headspace Sign on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure Headspace you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
