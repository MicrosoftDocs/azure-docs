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
- Set up a connection from local Entra ID to Azure Entra ID using the Entra ID connector or other method​.
- Add outbound allow rules: Connect your sensor to the Azure portal by adding these secured endpoints as outbound allow rules on your firewall, proxy server, and so on:
    - [Microsoft Graph](https://graph.microsoft.com/)
    - [MSAL](https://login.microsoftonline.com​​)
- For users that need SSO login access to the sensor work with the team that manages roles and permissions in your organization to:
    - Create relevant user groups in Entra ID. If you want to use existing groups, no action is required.
    - Ensure that each user has a **First name**, **Last name**, and **User principal name**.- 
- Verify that you have permission to view the new user groups in Entra ID from your Defender for IoT subscription account.
- Upgrade your sensors to version 24.1.2 or later.

## Create application ID on Azure Active Directory ​
​
1. In the Azure portal, open Microsoft Entra ID.
1. Select **Add > App registration**.

    :::image type="content" source="media/set-up-sso/create-application-id.png" alt-text="Screenshot of adding a new app registration on the Entra ID Overview page." lightbox="media/set-up-sso/create-application-id.png":::

1. In the **Register an application** page: 
    - Under **Name**, type a name for your application.
    - Under **Supported account types, select **Accounts in this organizational directory only (Microsoft only - single tenant)**.
    - Under **Redirect URI (optional)**, select **Single-page application (SPA)** and type the application's URI.

    :::image type="content" source="media/set-up-sso/register-application.png" alt-text="Screenshot of registering and application on Entra ID." lightbox="media/set-up-sso/register-application.png":::

1. Select **Register**.
    Entra ID displays your newly registered application.

## Add your sensors URIs​
​
1. In your new application, select **Authentication​**.
1. Under **Redirect URIs**, type your application's URI (IP or hostname), and select **Add URI**.
    
    If Entra ID adds the URI successfully, a "Your redirect URI is eligible for the Authorization Code Flow with PKCE" message is displayed.

    :::image type="content" source="media/set-up-sso/authentication.png" alt-text="Screenshot of setting up URIs for your application on the Entra ID Authentication page." lightbox="media/set-up-sso/authentication.png":::

## Grant access to application​

1. In your new application, from the left menu bar, select **API permissions​**.
1. Next to **Add a permission**, select **Grant admin consent for <Directory name>**.

    :::image type="content" source="media/set-up-sso/api-permissions.png" alt-text="Screenshot of setting up API permissions in Entra ID." lightbox="media/set-up-sso/api-permissions.png":::

## Create SSO configuration​

1. In [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/%7E/Getting_started) on the Azure portal, select **Sites and sensors** > **Sensor settings**.
1. On the **Sensor settings** page, select **+ Add**. In the **Basics** tab:
    1. Select your subscription.  
    1. Next to **Type**, select **Single sign-on**.
    1. Next to **Name** type a name for the relevant site.
    
        :::image type="content" source="media/set-up-sso/sensor-setting-sso.png" alt-text="Screenshot of creating a new Single sign-on sensor setting in Defender for IoT." lightbox="media/set-up-sso/sensor-setting-sso.png":::

1. Select **Next**.
1. In the **Settings** tab:
    1. Next to **Application name**, select the ID of the [application you created in Entra ID](#step-1-create-application-id-on-azure-active-directory-​).
    1. Under **Permissions management**, assign the **Admin**, **Security analyst**, and **Read only​** permissions to relevant groups. You can select multiple groups​.
    
        :::image type="content" source="media/set-up-sso/permissions-management.png" alt-text="Screenshot of setting up permissions in the Defender for IoT sensor settings." lightbox="media/set-up-sso/permissions-management":::    

    1. Make sure you've added allow rules on your firewall/proxy for the specified endpoints​. For more information, see the [Prerequisites](#prerequisites).

        :::image type="content" source="media/set-up-sso/permissions-management-outbound-rules.png" alt-text="Screenshot of the outbound allow rules section in the Defender for IoT sensor settings." lightbox="media/set-up-sso/permissions-management-outbound-rules":::

1. Select **Next**.
1. In the **Apply** tab, select the relevant sites. Toggle on **Add selection by specific zone/sensor** to also apply your setting to specific zones and sensors.​

    :::image type="content" source="media/set-up-sso/apply.png" alt-text="Screenshot of the Apply tab in the Defender for IoT sensor settings." lightbox="media/set-up-sso/apply":::

1. Select **Next**, review your configuration, and select **Create**.

## Sign in using SSO ​

To sign in using SSO:
​
1. Your user opens [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/%7E/Getting_started) on the Azure portal, and selects **SSO Sign-in**.

    :::image type="content" source="media/set-up-sso/sso-first-sign-in.png" alt-text="Screenshot of the first sign in to Defender for IoT on the Azure portal via SSO." lightbox="media/set-up-sso/sso-first-sign-in":::

> [!NOTE]
> Each user logging in via SSO must have a **First name**, **Last name**, and **User principal name**.

1. For the first sign in, in the **Sign in** page, your user types their credentials. 

   :::image type="content" source="media/set-up-sso/sso-first-sign-in-credentials.png" alt-text="Screenshot of the Sign in screen when signing in to Defender for IoT on the Azure portal via SSO." lightbox="media/set-up-sso/sso-first-sign-in-credentials":::

    For the next sign ins, this step isn't needed.

1. If you've set up [Multifactor authentication (MFA)](/entra/identity/authentication/tutorial-enable-azure-mfa), the user must approve their sign in on their authenticator app. 

    :::image type="content" source="media/set-up-sso/sso-mfa.png" alt-text="Screenshot of signing in to Defender for IoT on the Azure portal via MFA.":::

The **Overview** page is displayed.   ​
​
## Next steps

For more information, see:

- [Azure user roles for OT and Enterprise IoT monitoring with Defender for IoT](roles-azure.md)
- [Create and manage on-premises users for OT monitoring](how-to-create-and-manage-users.md)
- [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md)