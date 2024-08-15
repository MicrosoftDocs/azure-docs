---
author: cherylmc
ms.author: cherylmc
ms.date: 08/05/2024
ms.service: azure-vpn-gateway
ms.topic: include

# This include is for both VWAN and VPN Gateway
---

If you've already configured your P2S VPN gateway to use a custom value for the **Audience ID** field and you want to change to the new Microsoft-registered Azure VPN Client, you can authorize the new application by adding the client application to your API. Using this method, you don't need to change the settings on the Azure VPN gateway or your Azure VPN Clients if they're using the latest version of the client.

In the following steps, you add another authorized client application using the Microsoft-registered Azure VPN client App ID audience value. You don't change the value of the existing authorized client application. You can always delete the existing authorized client application if you're no longer using it.

1. There are a couple of different ways to get to the App registrations page. One way is through the [Microsoft Entra admin center](https://entra.microsoft.com). You can also use the Azure portal and **Microsoft Entra ID**. Sign in with an account that has the [Cloud Application Administrator](/entra/identity/role-based-access-control/permissions-reference#cloud-application-administrator) role or higher.
1. If you have access to multiple tenants, use the **Settings** icon in the top menu to switch to the tenant you want to use from the **Directories + subscriptions** menu.
1. Go to **App registrations** and locate display name for the registered app. Click to open the page.
1. Click **Expose an API**. On the **Expose an API** page, notice the previous Azure VPN Client audience value `Client Id` is present.

   :::image type="content" source="./media/vpn-gateway-custom-audience-change/change-add-client.png" alt-text="Screenshot shows the Expose an API page with Add a client application highlighted." lightbox="./media/vpn-gateway-custom-audience-change/change-add-client.png":::
1. Select **+ Add a client application**.
1. On the **Add a client application** pane, for **Client ID**, use the Azure Public Application ID for the Microsoft-registered Azure VPN Client app, `c632b3df-fb67-4d84-bdcf-b95ad541b5c8`.
1. Make sure **Authorized scopes** is selected. Then, click **Add application**.
1. On the **Expose an API** page, you'll now see both Client ID values listed. If you want to delete the previous version, click the value to open the **Edit a client application** page, and click **Delete**.
1. On the **Overview** page, notice that the values haven't changed. If you've already configured your gateway and clients using the custom Application (client) ID shown for the gateway **Audience ID** field and your clients are already configured to use this custom value, you don't need to make any additional changes.