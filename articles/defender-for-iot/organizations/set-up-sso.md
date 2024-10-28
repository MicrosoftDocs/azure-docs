---
title: Set up single sign-on for Microsoft Defender for IoT sensor console
description: Learn how to set up single sign-on (SSO) in the Azure portal for Microsoft Defender for IoT.
ms.date: 04/10/2024
ms.topic: how-to
#customer intent: As a security operator, I want to set up SSO for my users so that they can log in to the sensor console easily to multiple applications.
---

# Set up single sign-on for the sensor console

In this article, you learn how to set up single sign-on (SSO) for the Defender for IoT sensor console using Microsoft Entra ID. With SSO, your organization's users can simply sign into the sensor console, and don't need multiple login credentials across different sensors and sites. 

Using Microsoft Entra ID simplifies the onboarding and offboarding processes, reduces administrative overhead, and ensures consistent access controls across the organization.

> [!NOTE]
> Signing in via SSO is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Prerequisites

Before you begin:
- [Synchronize on-premises active directory with Microsoft Entra ID](/azure/architecture/reference-architectures/identity/azure-ad).
- Add outbound allow rules to your firewall, proxy server, and so on. You can access the list of required endpoints from the [Sites and sensors page](how-to-manage-sensors-on-the-cloud.md#endpoint).
- If you don't have existing Microsoft Entra ID user groups to use for SSO authorization, work with your organization's identity manager to create relevant user groups.
- Verify that you have the following permissions:
    - A Member user on Microsoft Entra ID. 
    - Admin, Contributor, or Security Admin permissions on the Defender for IoT subscription.
- Ensure that each user has a **First name**, **Last name**, and **User principal name**.
- If needed, set up [Multifactor authentication (MFA)](/entra/identity/authentication/tutorial-enable-azure-mfa).

## Create application ID on Microsoft Entra ID
​
1. In the Azure portal, open Microsoft Entra ID.
1. Select **Add > App registration**.

    :::image type="content" source="media/set-up-sso/create-application-id.png" alt-text="Screenshot of adding a new app registration on the Microsoft Entra ID Overview page." lightbox="media/set-up-sso/create-application-id.png":::

1. In the **Register an application** page: 
    - Under **Name**, type a name for your application.
    - Under **Supported account types**, select **Accounts in this organizational directory only (Microsoft only - single tenant)**.
    - Under **Redirect URI**, add an IP or hostname for the first sensor on which you want to enable SSO. You continue to add URIs for the other sensors in the next step, [Add your sensor URIs](#add-your-sensor-uris).
    
    > [!NOTE]
    > Adding the URI at this stage is required for SSO to work. 
    
    :::image type="content" source="media/set-up-sso/register-application.png" alt-text="Screenshot of registering an application on Microsoft Entra ID." lightbox="media/set-up-sso/register-application.png":::

1. Select **Register**.
    Microsoft Entra ID displays your newly registered application.

## Add your sensor URIs
​
1. In your new application, select **Authentication​**.
1. Under **Redirect URIs**, the URI for the first sensor, added in the [previous step](#create-application-id-on-microsoft-entra-id), is displayed under **Redirect URIs**. To add the rest of the URIs: 
    1. Select **Add URI** to add another row, and type an IP or hostname. 
    1. Repeat this step for the rest of the connected sensors. 
    
        When Microsoft Entra ID adds the URIs successfully, a "Your redirect URI is eligible for the Authorization Code Flow with PKCE" message is displayed.

        :::image type="content" source="media/set-up-sso/authentication.png" alt-text="Screenshot of setting up URIs for your application on the Microsoft Entra ID Authentication page." lightbox="media/set-up-sso/authentication.png":::        

1. Select **Save**.

## Grant access to application​

1. In your new application, select **API permissions​**.
1. Next to **Add a permission**, select **Grant admin consent for \<Directory name\>**.

    :::image type="content" source="media/set-up-sso/api-permissions.png" alt-text="Screenshot of setting up API permissions in Microsoft Entra ID." lightbox="media/set-up-sso/api-permissions.png":::

## Create SSO configuration​

1. In [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/%7E/Getting_started) on the Azure portal, select **Sites and sensors** > **Sensor settings**.
1. On the **Sensor settings** page, select **+ Add**. In the **Basics** tab:
    1. Select your subscription.  
    1. Next to **Type**, select **Single sign-on**.
    1. Next to **Name**, type a name for the relevant site, and select **Next**.
    
        :::image type="content" source="media/set-up-sso/sensor-setting-sso.png" alt-text="Screenshot of creating a new Single sign-on sensor setting in Defender for IoT.":::

1. In the **Settings** tab:
    1. Next to **Application name**, select the ID of the [application you created in Microsoft Entra ID](#create-application-id-on-microsoft-entra-id).
    1. Under **Permissions management**, assign the **Admin**, **Security analyst**, and **Read only​** permissions to relevant user groups. You can select multiple user groups​.
    
        :::image type="content" source="media/set-up-sso/permissions-management.png" alt-text="Screenshot of setting up permissions in the Defender for IoT sensor settings.":::    

    1. Select **Next**. 
    
    > [!NOTE]
    > Make sure you've added allow rules on your firewall/proxy for the specified endpoints. You can access the list of required endpoints from the [Sites and sensors page](how-to-manage-sensors-on-the-cloud.md#endpoint).

1. In the **Apply** tab, select the relevant sites. 

    :::image type="content" source="media/set-up-sso/apply.png" alt-text="Screenshot of the Apply tab in the Defender for IoT sensor settings." lightbox="media/set-up-sso/apply.png":::

    You can optionally toggle on **Add selection by specific zone/sensor** to apply your setting to specific zones and sensors.​

1. Select **Next**, review your configuration, and select **Create**.

## Sign in using SSO ​

To test signing in with SSO:
​
1. Open [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/%7E/Getting_started) on the Azure portal, and select **SSO Sign-in**.

    :::image type="content" source="media/set-up-sso/sso-sign-in.png" alt-text="Screenshot of the sensor console login screen with SSO.":::

1. For the first sign in, in the **Sign in** page, type your personal credentials (your work email and password). 

   :::image type="content" source="media/set-up-sso/sso-first-sign-in-credentials.png" alt-text="Screenshot of the Sign in screen when signing in to Defender for IoT on the Azure portal via SSO.":::
 
The Defender for IoT **Overview** page is displayed.   ​
​
## Next steps

For more information, see:

- [Azure user roles for OT and Enterprise IoT monitoring with Defender for IoT](roles-azure.md)
- [Create and manage on-premises users for OT monitoring](how-to-create-and-manage-users.md)
- [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md)