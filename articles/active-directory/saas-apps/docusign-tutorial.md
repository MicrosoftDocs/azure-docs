---
title: 'Tutorial: Microsoft Entra SSO integration with DocuSign'
description: Learn how to configure single sign-on (SSO) between Microsoft Entra ID and DocuSign.
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

# Tutorial: Microsoft Entra SSO integration with DocuSign

In this tutorial, you'll learn how to integrate DocuSign with Microsoft Entra ID. When you integrate DocuSign with Microsoft Entra ID, you can:

* Use Microsoft Entra ID to control who has access to DocuSign.
* Enable automatic sign-in to DocuSign for your users through their Microsoft Entra accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A DocuSign subscription that's single sign-on (SSO) enabled.
* Control over your domain DNS. This is needed to claim domain on DocuSign. 

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you'll configure and test Microsoft Entra SSO in a test environment to verify that:

* DocuSign supports service provider **SP** initiated SSO.

* DocuSign supports **just-in-time** user provisioning.

* DocuSign supports [automatic user provisioning](./docusign-provisioning-tutorial.md).

## Add DocuSign from the gallery

To configure the integration of DocuSign into Microsoft Entra ID, you must add DocuSign from the gallery to your list of managed SaaS apps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **DocuSign** in the search box.
1. Select **DocuSign** from the results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. You can learn more about O365 wizards [here](/microsoft-365/admin/misc/azure-ad-setup-guides?view=o365-worldwide&preserve-view=true).

<a name='configure-and-test-azure-ad-sso-for-docusign'></a>

## Configure and test Microsoft Entra SSO for DocuSign

Configure and test Microsoft Entra SSO with DocuSign by using a test user named **B.Simon**. For SSO to work, you must establish a link relationship between a Microsoft Entra user and the corresponding user in DocuSign.

To configure and test Microsoft Entra SSO with DocuSign, perform the following steps:

1. [Configure Microsoft Entra SSO](#configure-azure-ad-sso) so that your users can use this feature.
    1. [Create a Microsoft Entra test user](#create-an-azure-ad-test-user) to test Microsoft Entra single sign-on with B.Simon.
    1. [Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user) to enable B.Simon to use Microsoft Entra single sign-on.
1. [Configure DocuSign SSO](#configure-docusign-sso) to configure the single sign-on settings on the application side.
    1. [Create a DocuSign test user](#create-docusign-test-user) to generate a counterpart of B.Simon in DocuSign that's linked to the Microsoft Entra representation of the user.
1. [Test SSO](#test-sso) to verify that the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

To enable Microsoft Entra SSO in the Azure portal, follow these steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **DocuSign** application integration page, find the **Manage** section, and then select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** textbox, type a URL using the following pattern:

    `https://<subdomain>.docusign.com/organizations/<OrganizationID>/saml2`

    b. In the **Reply URL** textbox, type a URL using one of the following patterns:
    
    | Reply URL |
    |-------------|
    | Production : |
    | `https://<subdomain>.docusign.com/organizations/<OrganizationID>/saml2/login/<IDPID>` |
    | `https://<subdomain>.docusign.net/SAML/` |
    | QA Instance :|
    | `https://<SUBDOMAIN>.docusign.com/organizations/saml2` |

    c. In the **Sign on URL** textbox, type a URL using the following pattern:

    `https://<subdomain>.docusign.com/organizations/<OrganizationID>/saml2/login/sp/<IDPID>`

	> [!NOTE]
	> These bracketed values are placeholders. Replace them with the values in the actual Identifier, Reply URL and Sign on URL. These details are explained in the "View SAML 2.0 Endpoints" section later in this tutorial.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)**. Select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. In the **Set up DocuSign** section, copy the appropriate URL (or URLs) based on your requirements.

	![Copy configuration URLs](common/copy-configuration-urls.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you'll create a test user named B.Simon.

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

In this section, you'll grant B.Simon access to DocuSign so that this user can use Azure single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **DocuSign**.
1. On the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, and then in the **Add Assignment** dialog box, select **Users and groups**.
1. In the **Users and groups** dialog box, select **B.Simon** from the **Users** list, and then press the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog box, select the **Assign** button.

## Configure DocuSign SSO
1. In a different web browser window, sign in to your up DocuSign company site as an administrator

4. In the upper-left corner of the page, select the  app launcher (9 dots), and then select **Admin**.
  
    ![Screenshot of Go to Admin under Profile.](media/docusign-tutorial/docusign-admin.png)

5. On your domain solutions page, select **Domains**.

    ![Screenshot of Select_Domains.](media/docusign-tutorial/domains.png)


6. In the **Domains** section, select **CLAIM DOMAIN**.

    ![Screenshot of Claim_domain.](media/docusign-tutorial/claim-domain.png)


7. In the **Claim a Domain** dialog box, in the **Domain Name** box, type your company domain, and then select **CLAIM**. Make sure you verify the domain and that its status is active.

    ![Screenshot of Claim a Domain/Domain Name dialog.](media/docusign-tutorial/claim-a-domain.png)

8. In the **Domains** section, select **Get Validation Token** of new domain added in the claim list.

    ![Screenshot of pending_Identity_provider.](media/docusign-tutorial/pending-Identity-provider.png)
    
9. Copy the **TXT Token**

    ![Screenshot of TXT_token.](media/docusign-tutorial/token.png)

10. Configure your DNS provider with the **TXT Token** by following these steps:

	a. Navigate to your domain's DNS record management page.
	b. Add a new TXT record.
	c. Name: @ or *
	d. Text: paste the **TXT Token** value, which you copied from the earlier step.
	e. TTL: Default or 1 hour / 3600 seconds


11. On the domain solutions page, select **Identity Providers**.
  
    ![Screenshot of Identity Providers option.](media/docusign-tutorial/identity-providers.png)

12. In the **Identity Providers** section, select **ADD IDENTITY PROVIDER**.

    ![Screenshot of Add Identity Provider option.](media/docusign-tutorial/add-identity-provider-option.png)


13. On the **Identity Provider Settings** page, follow these steps:

    a. In the **Custom Name** box, type a unique name for your configuration. Don't use spaces.
	
	![Screenshot of name_Identity_provider.](media/docusign-tutorial/add-identity-providers.png)

    b. In the **Identity Provider Issuer box**, paste the **Microsoft Entra Identifier** value, which you copied.

	![Screenshot of urls_Identity_provider.](media/docusign-tutorial/idp-urls.png)


    c. In the **Identity Provider Login URL** box, paste the **Login URL** value, which you copied from Azure portal.

    d. In the **Identity Provider Logout URL** box, paste the value of **Logout URL**, which you  copied from Azure portal.
   
       ![Screenshot of settings_Identity_provider.](media/docusign-tutorial/settings-Identity-provider.png)


    e. For **Send AuthN request by**, select **POST**.

    f. For **Send logout request by**, select **GET**.

    g. In the **Custom Attribute Mapping** section, select **ADD NEW MAPPING**.

       ![Screenshot of Custom Attribute Mapping UI.](media/docusign-tutorial/add-new-mapping.png)

    h. Choose the field you want to map to the Microsoft Entra claim. In this example, the **emailaddress** claim is mapped with the value of `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`. That's the default claim name from Microsoft Entra ID for the email claim. Select **SAVE**.

       ![Screenshot of Custom Attribute Mapping fields.](media/docusign-tutorial/email-address.png)

       > [!NOTE]
       > Use the appropriate **User identifier** to map the user from Microsoft Entra ID to DocuSign user mapping. Select the proper field, and enter the appropriate value based on your organization settings. Custom Attribute Mapping setting is not mandatory.

    i. In the **Identity Provider Certificates** section, select **ADD CERTIFICATE**, upload the certificate you downloaded from Azure portal, and select **SAVE**.

       ![Screenshot of Identity Provider Certificates/Add Certificate.](media/docusign-tutorial/certificates.png)

    j. In the **Identity Providers** section, select **ACTIONS**, and then select **Endpoints**.

       ![Screenshot of Identity Providers/Endpoints.](media/docusign-tutorial/identity-providers-endpoints.png)

    k. In the **View SAML 2.0 Endpoints** section of the DocuSign admin portal, follow these steps:

       ![Screenshot of View SAML 2.0 Endpoints.](media/docusign-tutorial/saml-endpoints.png)
       
       1. Copy the **Service Provider Issuer URL**, and then paste it into the **Identifier** box in **Basic SAML Configuration** section.
       
       1. Copy the **Service Provider Assertion Consumer Service URL**, and then paste it into the **Reply URL** box in **Basic SAML Configuration** section.
       
       1. Copy the **Service Provider Login URL**, and then paste it into the **Sign On URL** box in **Basic SAML Configuration** section. At the end of the **Service Provider Login URL** you will get the IDPID value.

       1. Select **Close**.

### Create DocuSign test user

In this section, a user named B.Simon is created in DocuSign. DocuSign supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in DocuSign, a new one is created after authentication.

> [!Note]
> If you need to create a user manually, contact the [DocuSign support team](https://support.docusign.com/).

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to DocuSign Sign-on URL where you can initiate the login flow. 

* Go to DocuSign Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the DocuSign tile in the My Apps, you should be automatically signed in to the DocuSign for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure DocuSign you can enforce Session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).
