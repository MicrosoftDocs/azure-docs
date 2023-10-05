---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with Cirrus Identity Bridge for Microsoft Entra ID'
description: Learn how to configure single sign-on between Microsoft Entra ID and Cirrus Identity Bridge for Microsoft Entra ID.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes

---

# Tutorial: Microsoft Entra single sign-on (SSO) integration with Cirrus Identity Bridge for Microsoft Entra ID

In this tutorial, you'll learn how to integrate Cirrus Identity Bridge for Microsoft Entra ID with Microsoft Entra ID using the Microsoft Graph API based integration pattern. When you integrate Cirrus Identity Bridge for Microsoft Entra ID with Microsoft Entra ID in this way, you can:

* Control who has access to InCommon or other multilateral federation service providers from Microsoft Entra ID.
* Enable your users to SSO to InCommon or other multilateral federation service providers with their Microsoft Entra accounts.
* Enable your users to access Central Authentication Service (CAS) applications with their Microsoft Entra accounts.
* Manage your application access in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Cirrus Identity Bridge for Microsoft Entra single sign-on (SSO) enabled subscription. If you are not already a subscriber, please visit the [Cirrus Identity Microsoft Entra ID Bridge Registration Page](https://info.cirrusidentity.com/cirrus-identity-azure-ad-app-gallery-registration).

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Cirrus Identity Bridge for Microsoft Entra ID supports **SP** and **IDP** initiated SSO.

<a name='before-adding-the-cirrus-identity-bridge-for-azure-ad-from-the-gallery'></a>

## Before adding the Cirrus Identity Bridge for Microsoft Entra ID from the gallery

When subscribing to the Cirrus Identity Bridge for Microsoft Entra ID, you will be asked for your Microsoft Entra TenantID. To view this:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).
1. Browse to **Identity** > **Overview** > **Properties**.
1. Scroll down to the **Tenant ID** section and you can find your tenant ID in the box.
1. Copy the value and send it to the Cirrus Identity contract representative you are working with.

To use the Microsoft Graph API integration, you must grant the Cirrus Identity Bridge for Microsoft Entra ID access to use the API in your tenant. To do this:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).
1. Edit the URL `https://login.microsoftonline.com/$TENANT_ID/adminconsent?client_id=ea71bc49-6159-422d-84d5-6c29d7287974&state=12345&redirect_uri=https://admin.cirrusidentity.com/azure-registration` replacing **$TENANT_ID** with the value for your Microsoft Entra tenant.
1. Paste the URL into the browser where you are signed in as a Global Administrator.
1. You will be asked to consent to grant access.
1. When successful, there should be a new application called Cirrus Bridge API. 
1. Advise the Cirrus Identity contract representative you are working with that you have successfully granted API access to the Cirrus Identity Bridge for Microsoft Entra ID.


Once Cirrus Identity has the Tenant ID, and access has been granted, we will provision Cirrus Identity Bridge for Microsoft Entra infrastructure and provide you with the following information unique to your subscription:

- Identifier URI/ Entity ID
- Redirect URI / Reply URL
- Single-logout URL
- SP Encryption Cert (if using encrypted assertions or logout)
- A URL for testing
- Additional instructions depending on the options included with your subscription


> [!NOTE] 
> If you are unable to grant API access to the Cirrus Identity Bridge for Microsoft Entra ID, the Bridge can be integrated using a traditional SAML2 integration. Advise the Cirrus Identity contract representative you are working with that you are not able to use MS Graph API integration.

<a name='add-cirrus-identity-bridge-for-azure-ad-from-the-gallery'></a>

## Add Cirrus Identity Bridge for Microsoft Entra ID from the gallery

To configure the integration of Cirrus Identity Bridge for Microsoft Entra ID into Microsoft Entra ID, you need to add Cirrus Identity Bridge for Microsoft Entra ID from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Cirrus Identity Bridge for Microsoft Entra ID** in the search box.
1. Select **Cirrus Identity Bridge for Microsoft Entra ID** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-cirrus-identity-bridge-for-azure-ad'></a>

## Configure and test Microsoft Entra SSO for Cirrus Identity Bridge for Microsoft Entra ID

Configure and test Microsoft Entra SSO with Cirrus Identity Bridge for Microsoft Entra ID using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Cirrus Identity Bridge for Microsoft Entra ID.

To configure and test Microsoft Entra SSO with Cirrus Identity Bridge for Microsoft Entra ID, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Cirrus Identity Bridge for Microsoft Entra SSO](#configure-cirrus-identity-bridge-for-azure-ad-sso)** - to configure the single sign-on settings on application side.
    1. **[Setup Cirrus Identity Bridge for Microsoft Entra ID testing](#setup-cirrus-identity-bridge-for-azure-ad-testing)** - to have a counterpart of B.Simon in Cirrus Identity Bridge for Microsoft Entra ID that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Cirrus Identity Bridge for Microsoft Entra ID** application integration page, find the **Manage** section and select **Properties**.
1. On the **Properties** page, toggle **Assignment Required** based on your access requirements. If set to **Yes**, you will need to assign the **Cirrus Identity Bridge for Microsoft Entra ID** application to an access control group on the **Users and Groups** page.
1. While still on the **Properties** page, toggle **Visible to users** to **No**. The initial integration will always represent the default integration used for multiple service providers. In this case, there will not be any one service provider to direct end users to. To make specific applications visible to end users, you will have to use linking single sign-on to give end user access in My Apps to specific service providers. [See here](../manage-apps/configure-linked-sign-on.md) for more details.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Cirrus Identity Bridge for Microsoft Entra ID** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<DOMAIN>/bridge`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<NAME>.proxy.cirrusidentity.com/module.php/saml/sp/saml2-acs.php/<NAME>_proxy`

1. Click Set additional URLs and perform the following step if you wish to configure the application in SP initiated mode:
 
    In the **Sign on URL** text box, type a value using the following pattern:
    `<CUSTOMER_LOGIN_URL>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier,Reply URL and Sign on URL. If you have not yet subscribed to the Cirrus Bridge, please visit the [registration page](https://info.cirrusidentity.com/cirrus-identity-azure-ad-app-gallery-registration). If you are an existing Cirrus Bridge customer, contact [Cirrus Identity Bridge for Microsoft Entra Client support team](https://www.cirrusidentity.com/resources/service-desk) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. Cirrus Identity Bridge for Microsoft Entra application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. Cirrus Identity Bridge for Microsoft Entra pre-populates **Attributes & Claims** which are typical for use with the InCommon trust federation. You can review and modify them to meet your requirements. Consult the [eduPerson schema specification](https://wiki.refeds.org/display/STAN/eduPerson) for more details.
	
	| Name |  Source Attribute|
	| ---------| --------- |
	| urn:oid:2.5.4.42 | user.givenname |
    | urn:oid:2.5.4.4 | user.surname |
    | urn:oid:0.9.2342.19200300.100.1.3 | user.mail |
    | urn:oid:1.3.6.1.4.1.5923.1.1.1.6 | user.userprincipalname |
    | cirrus.nameIdFormat | "urn:oasis:names:tc:SAML:2.0:nameid-format:transient" | 

    > [!NOTE]
    > These defaults assume the Microsoft Entra UPN is suitable to use as an eduPersonPrincipalName.

1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Cirrus Identity Bridge for Microsoft Entra ID.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Cirrus Identity Bridge for Microsoft Entra ID**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

<a name='configure-cirrus-identity-bridge-for-azure-ad-sso'></a>

## Configure Cirrus Identity Bridge for Microsoft Entra SSO

More documentation on configuring the Cirrus Bridge is available [from Cirrus Identity](https://blog.cirrusidentity.com/documentation/azure-bridge-setup). To also configure the Cirrus Bridge to support access for CAS services, CAS support is also available [for the Cirrus Bridge](https://blog.cirrusidentity.com/documentation/cas-bridge-setup).

<a name='setup-cirrus-identity-bridge-for-azure-ad-testing'></a>

### Setup Cirrus Identity Bridge for Microsoft Entra ID testing

In this section, you verify a user called Britta Simon can be used for testing. The [Cirrus Identity Bridge for Microsoft Entra ID support team](https://www.cirrusidentity.com/resources/service-desk) will provide a testing URL to verify Britta Simon is ready to use with the Cirrus Identity Bridge for Microsoft Entra platform. The test user Britta Simon will need to also be added to any applications using the Cirrus Identity Bridge for Microsoft Entra ID as a method to authenticate (for example, applications in multilateral federation metadata). 

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Cirrus Identity Bridge for Microsoft Entra ID Sign on URL where you can initiate the login flow.  

* Go to Cirrus Identity Bridge for Microsoft Entra Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Cirrus Identity Bridge for Microsoft Entra ID for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Cirrus Identity Bridge for Microsoft Entra ID tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Cirrus Identity Bridge for Microsoft Entra ID for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Cirrus Identity Bridge for Microsoft Entra ID you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

You can also create multiple App configurations for the Cirrus Identity Bridge for Microsoft Entra ID, when using MS Graph API integration. These allow you to implement different claims, access controls, or Microsoft Entra Conditional Access policies for groups of multilateral federation. See [here](https://blog.cirrusidentity.com/documentation/azure-bridge-setup) for further details. Many of these same access controls can also be applied to [CAS applications](https://blog.cirrusidentity.com/documentation/cas-bridge-setup).
