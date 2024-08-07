---
author: cherylmc
ms.author: cherylmc
ms.date: 08/05/2024
ms.service: azure-vpn-gateway
ms.topic: include

# This include is for both VWAN and VPN Gateway
---

## Register an application

There are a couple of different ways to get to the **App registrations** page. One way is through the [Microsoft Entra admin center](https://entra.microsoft.com). You can also use the Azure portal and **Microsoft Entra ID**. Sign in with an account that has the [Cloud Application Administrator](https://learn.microsoft.com/entra/identity/role-based-access-control/permissions-reference#cloud-application-administrator) role or higher.

1. If you have access to multiple tenants, use the **Settings** icon in the top menu to switch to the tenant in which you want to register the application from the **Directories + subscriptions** menu.
1. Go to **App registrations** and select **New registration**.

   :::image type="content" source="./media/vpn-gateway-custom-audience/registration.png" alt-text="Screenshot shows the app registrations page with new registration selected." lightbox="./media/vpn-gateway-custom-audience/registration.png":::
1. On the **Register an application** page, enter a display **Name** for your application. Users of your application might see the display name when they use the app, for example during sign-in. You can change the display name at any time. Multiple app registrations can share the same name. The app registration's automatically generated Application (client) ID uniquely identifies your app within the identity platform.

   :::image type="content" source="./media/vpn-gateway-custom-audience/register-application.png" alt-text="Screenshot shows the register an application page." lightbox="./media/vpn-gateway-custom-audience/register-application.png":::
1. Specify who can use the application, sometimes called its *sign-in audience*. Select **Accounts in this organizational directory only (nameofyourdirectory only - Single tenant)**.
1. Leave **Redirect URI (optional)** alone for now as you configure a redirect URI in the next section.
1. Select **Register** to complete the initial app registration.

When registration finishes, the Microsoft Entra admin center displays the app registration's **Overview** pane. You see the **Application (client) ID**. Also called the *client ID*, this value uniquely identifies your application in the Microsoft identity platform. This is the custom audience value that you use when you configure your P2S gateway. Even though this value is present, you still need to complete the next sections to associate the Micrsoft-registered application to your application ID.

## Expose an API and add a scope

In this section, you create a scope to assign granular permissions.

1. In the left pane for the registered app, select **Expose an API**.

   :::image type="content" source="./media/vpn-gateway-custom-audience/expose-api.png" alt-text="Screenshot shows the Expose an API page." lightbox="./media/vpn-gateway-custom-audience/expose-api.png":::
1. Select **Add a scope**. On the **Add a scope** pane, view the Application ID URI. This field is generated automatically. This defaults to `api://<application-client-id>`. The App ID URI acts as the prefix for the scopes that you reference in your API's code, and it must be globally unique.

   :::image type="content" source="./media/vpn-gateway-custom-audience/add-scope.png" alt-text="Screenshot shows the Add a scope pane with the Application ID URI." lightbox="./media/vpn-gateway-custom-audience/add-scope.png":::

1. Select **Save and continue** to proceed to the next **Add a scope** pane.
1. In this **Add a scope** pane, specify the scope's attributes. For this walk-through, you can use the example values or specify your own.

   :::image type="content" source="./media/vpn-gateway-custom-audience/add-a-scope.png" alt-text="Screenshot shows the Add a scope pane with more settings." lightbox="./media/vpn-gateway-custom-audience/add-a-scope.png":::

    | Field |  Value |
    |-------|---------|
    | **Scope name** | Example: *p2s-vpn1* |
    | **Who can consent** | **Admins only** |
    | **Admin consent display name** | Example: *p2s-vpn1-users* |
    | **Admin consent description** | Example: *Access to the P2S VPN* |
    | **State** | **Enabled** |

1. Select **Add scope** to add the scope.

## Add the Azure VPN Client application

In this section, you associate the Microsoft-registered Azure VPN Client application ID.

1. On the **Expose an API** page, select **+ Add a client application**.

   :::image type="content" source="./media/vpn-gateway-custom-audience/add-client-application.png" alt-text="Screenshot shows the Add a client application selected." lightbox="./media/vpn-gateway-custom-audience/add-client-application.png":::
1. On the **Add a client application** pane, for **Client ID**, use the Azure Public Application ID for the Microsoft-registered Azure VPN Client app, `c632b3df-fb67-4d84-bdcf-b95ad541b5c8` unless you know you need a different value.

   :::image type="content" source="./media/vpn-gateway-custom-audience/authorized-scopes.png" alt-text="Screenshot shows the add a client application pane." lightbox="./media/vpn-gateway-custom-audience/authorized-scopes.png":::
1. Make sure **Authorized scopes** is selected.
1. Select **Add application**.

## Gather values

On the **Overview** page for your application, make a note of the following values that you need when you configure your point-to-site VPN gateway for Microsoft Entra ID authentication.

* Application (client) ID: This is the custom Audience ID that you use for the **Audience** field when you configure your P2S VPN gateway.
* Directory (tenent) ID: This value is part of the value required for the **Tenant** and **Issuer** field for the P2S VPN gateway.