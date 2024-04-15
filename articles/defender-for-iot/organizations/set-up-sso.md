---
title: Set up single sign-on for Microsoft Defender for IoT
description: Learn how to set up single sign-on (SSO) in the Azure portal for Microsoft Defender for IoT.
ms.date: 04/10/2024
ms.topic: how-to
#customer intent: As a security operator, I want to set up SSO for my users so that they can login easily to multiple applications.
---

# Set up single sign-on on the Azure portal

Single sign-on (SSO) is a session authentication process where users can access multiple sites or applications using a single set of credentials. 

In this article, you learn how to set up SSO for Defender for IoT in the Azure portal, to allow simple sign in for your organization's users. With SSO, your users don't need multiple login credentials across different sensors and sites. 

This process uses Entra ID, which simplifies the onboarding and offboarding processes, reduces administrative overhead, and ensures consistent access controls across the organization.

> [!NOTE]
> Signing in via SSO is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Prerequisites

Before you begin:
- [Synchronize on-premises active directory with Entra ID](/architecture/reference-architectures/identity/azure-ad).
- Add outbound allow rules to your firewall, proxy server, and so on. You can access the list of required endpoints from the [Sites and sensors page](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).
- For users that need SSO login access to the sensor work with the team that manages roles and permissions in your organization to:
    - Create relevant user groups in Entra ID. If you want to use existing groups, no action is required.
    - Ensure that each user has a **First name**, **Last name**, and **User principal name**.- 
- Verify that you have permission to view the new user groups in Entra ID from your Defender for IoT subscription account.
- If needed, set up [Multifactor authentication (MFA)](/entra/identity/authentication/tutorial-enable-azure-mfa).

## Create application ID on Azure Active Directory ​
​
1. In the Azure portal, open Microsoft Entra ID.
1. Select **Add > App registration**.

    :::image type="content" source="media/set-up-sso/create-application-id.png" alt-text="Screenshot of adding a new app registration on the Entra ID Overview page." lightbox="media/set-up-sso/create-application-id.png":::

1. In the **Register an application** page: 
    - Under **Name**, type a name for your application.
    - Under **Supported account types**, select **Accounts in this organizational directory only (Microsoft only - single tenant)**.
    - Under **Redirect URI (optional)**, select **Single-page application (SPA)** and type the IP or hostname address used to connect to the application.

    :::image type="content" source="media/set-up-sso/register-application.png" alt-text="Screenshot of registering and application on Entra ID." lightbox="media/set-up-sso/register-application.png":::

1. Select **Register**.
    Entra ID displays your newly registered application.

## Add your sensors URIs​
​
1. In your new application, select **Authentication​**.
1. Under **Redirect URIs**, add all relevant URIs, which are the IPs or hostnames for all connected sensors. Type the first URI and select **Add URI** to add more rows for more URIs.
    
    When Entra ID adds the URI successfully, a "Your redirect URI is eligible for the Authorization Code Flow with PKCE" message is displayed.

    :::image type="content" source="media/set-up-sso/authentication.png" alt-text="Screenshot of setting up URIs for your application on the Entra ID Authentication page." lightbox="media/set-up-sso/authentication.png":::

1. Select **Save**.

## Grant access to application​

1. In your new application, from the left menu bar, select **API permissions​**.
1. Next to **Add a permission**, select **Grant admin consent for \<Directory name\>**.

    :::image type="content" source="media/set-up-sso/api-permissions.png" alt-text="Screenshot of setting up API permissions in Entra ID." lightbox="media/set-up-sso/api-permissions.png":::

## Create SSO configuration​

1. In [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/%7E/Getting_started) on the Azure portal, select **Sites and sensors** > **Sensor settings**.
1. On the **Sensor settings** page, select **+ Add**. In the **Basics** tab:
    1. Select your subscription.  
    1. Next to **Type**, select **Single sign-on**.
    1. Next to **Name** type a name for the relevant site, and select **Next**.
    
        :::image type="content" source="media/set-up-sso/sensor-setting-sso.png" alt-text="Screenshot of creating a new Single sign-on sensor setting in Defender for IoT." lightbox="media/set-up-sso/sensor-setting-sso.png":::

1. In the **Settings** tab:
    1. Next to **Application name**, select the ID of the [application you created in Entra ID](#create-application-id-on-azure-active-directory-​​).
    1. Under **Permissions management**, assign the **Admin**, **Security analyst**, and **Read only​** permissions to relevant user groups. You can select multiple user groups​.
    
        :::image type="content" source="media/set-up-sso/permissions-management.png" alt-text="Screenshot of setting up permissions in the Defender for IoT sensor settings." lightbox="media/set-up-sso/permissions-management.png":::    

    1. Select **Next**. 
    
    > [!NOTE]
    > Make sure you've added allow rules on your firewall/proxy for the specified endpoints. You can access the list of required endpoints from the [Sites and sensors page](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).

1. In the **Apply** tab, select the relevant sites. Toggle on **Add selection by specific zone/sensor** to also apply your setting to specific zones and sensors.​

    :::image type="content" source="media/set-up-sso/apply.png" alt-text="Screenshot of the Apply tab in the Defender for IoT sensor settings." lightbox="media/set-up-sso/apply.png":::

1. Select **Next**, review your configuration, and select **Create**.

## Sign in using SSO ​

To test signing in with SSO:
​
1. Open [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/%7E/Getting_started) on the Azure portal, and select **SSO Sign-in**.

    TBD - SCREENSHOT

1. For the first sign in, in the **Sign in** page, type your personal credentials (your work email and password). 

   :::image type="content" source="media/set-up-sso/sso-first-sign-in-credentials.png" alt-text="Screenshot of the Sign in screen when signing in to Defender for IoT on the Azure portal via SSO." lightbox="media/set-up-sso/sso-first-sign-in-credentials.png":::
 
The Defender for IoT **Overview** page is displayed.   ​
​
## Next steps

For more information, see:

- [Azure user roles for OT and Enterprise IoT monitoring with Defender for IoT](roles-azure.md)
- [Create and manage on-premises users for OT monitoring](how-to-create-and-manage-users.md)
- [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md)