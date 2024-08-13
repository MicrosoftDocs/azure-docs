---
title: Configure P2S access based on users and groups - Microsoft Entra ID authentication
titleSuffix: Azure VPN Gateway
description: Learn how to configure P2S access based on users and groups for Microsoft Entra ID authentication.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 08/12/2024
ms.author: cherylmc

---

# Scenario: Configure P2S access based on users and groups - Microsoft Entra ID authentication

This article walks you through a scenario to configure access based on users and groups for point-to-site (P2S) VPN connections that use Microsoft Entra ID authentication. This scenario, you configure this type of access using multiple custom audience app IDs with specified permissions, and multiple P2S VPN gateways. For more information about P2S protocols and authentication, see [About point-to-site VPN](point-to-site-about.md).

In this scenario, users have different access based on permissions to connect to specific P2S VPN gateways. At a high level, the workflow is as follows:

1. Create a custom app for each P2S VPN gateway that you want to configure for P2S VPN with Microsoft Entra ID authentication. Make a note of the custom app ID.
1. Add the Azure VPN Client application to the custom app configuration.
1. Assign user and group permissions per custom app.
1. When you configure your gateway for P2S VPN Microsoft Entra ID authentication, specify the Microsoft Entra ID tenant and the custom app ID that's associated with the users that you want to allow to connect via that gateway.
1. The Azure VPN Client profile on the client's computer is configured using the settings from the P2S VPN gateway to which the user has permissions to connect.
1. When a user connects, they're authenticated and are able to connect only to the P2S VPN gateway for which their account has permissions.

Considerations:

* You can't create this type of granular access if you have only one VPN gateway.
* Microsoft Entra ID authentication is supported only for OpenVPN® protocol connections and requires the Azure VPN Client.
*Take care configure each Azure VPN Client with the correct client profile package configuration settings to ensure that the user connects to the corresponding gateway to which they have permissions.
* When you use the configuration steps in this exercise, it might be easiest to run the steps for the first custom app ID and gateway all the way through, then repeat for each subsequent custom app ID and gateway.

## Prerequisites

* This scenario requires a Microsoft Entra tenant. If you don't already have a tenant, [Create a new tenant in Microsoft Entra ID](/entra/fundamentals/create-new-tenant). Make a note of the tenant ID. This value is needed when you configure your P2S VPN gateway for Microsoft Entra ID authentication.

* This scenario requires multiple VPN gateways. You can only assign one custom app ID per gateway.

  * If you don't already have at least two functioning VPN gateways that are compatible with Microsoft Entra ID authentication, see [Create and manage a VPN gateway - Azure portal](tutorial-create-gateway-portal.md) to create your VPN gateways.
  * Some gateway options are incompatible with P2S VPN gateways that use Microsoft Entra ID authentication. Basic SKU  and policy-based VPN types aren't supported. For more information about gateway SKUs, see [About gateway SKUs](about-gateway-skus.md). For more information about VPN types, see [VPN Gateway settings](vpn-gateway-about-vpn-gateway-settings.md#vpntype).

## Register an application

To create a custom audience app ID value, which is specified when you configure your VPN gateway, you must register an application. Register an application. For steps, see [Register an application](point-to-site-entra-register-custom-app.md#register-an-application).

* The **Name** field is user-facing. Use something intuitive that describes the users or groups that are connecting via this custom application.
* For the rest of the settings, use the settings shown in the article.

## Add a scope

Add a scope. Adding a scope is part of the sequence to configure permissions for users and groups. For steps, see [Expose an API and add a scope](point-to-site-entra-register-custom-app.md#expose-an-api-and-add-a-scope). Later, you assign users and groups permissions to this scope.

* Use something intuitive for the **Scope Name** field, such as Marketing-VPN-Users. Fill out the rest of the fields as necessary.
* For **State**, select **Enable**.

## Add the Azure VPN Client application

Add the Azure VPN Client application **Client ID** and specify the **Authorized scope**. When you add the application, we recommend that you use the **Microsoft-registered** Azure VPN Client app ID for Azure Public, `c632b3df-fb67-4d84-bdcf-b95ad541b5c8` when possible. This app value has global consent, which means you don't need to manually register it.  For steps, see [Add the Azure VPN Client application](point-to-site-entra-register-custom-app.md#add-the-azure-vpn-client-application).

After you add the Azure VPN Client application, go to the **Overview** page and copy and save the **Application (client) ID**. You'll need this information to configure your P2S VPN gateway.

## Assign users and groups

Assign permissions to the users and/or groups that connect to the gateway. If you're specifying a group, the user must be a direct member of the group. Nested groups aren't supported.

1. Go to your Microsoft Entra ID and select **Enterprise applications**.
1. From the list, locate the application you registered and click to open it.
1. Expand **Manage**, then select **Properties**. On the **Properties** page, verify that **Enabled for users to sign in** is set to **Yes**. If not, change the value to **Yes**.
1. For **Assignment required**, change the value to **Yes**. For more information about this setting, see [Application properties](/entra/identity/enterprise-apps/application-properties#enabled-for-users-to-sign-in).
1. If you've made changes, select **Save** at the top of the page.
1. In the left pane, select **Users and groups**. On the **Users and groups** page, select **+ Add user/group** to open the **Add Assignment** page.
1. Click the link under **Users and groups** to open the **Users and groups** page. Select the users and groups that you want to assign, then click **Select**.
1. After you finish selecting users and groups, select **Assign**.

## Configure a P2S VPN

After you've completed the steps in the previous sections, continue to [Configure P2S VPN Gateway for Microsoft Entra ID authentication – Microsoft-registered app](point-to-site-entra-gateway.md).

* When you configure each gateway, associate the appropriate custom audience App ID.
* Download the Azure VPN Client configuration packages to configure the Azure VPN Client for the users that have permissions to connect to the specific gateway.

## Configure the Azure VPN Client

Use the Azure VPN Client profile configuration package to configure the Azure VPN Client on each user's computer. Verify that the client profile corresponds to the P2S VPN gateway to which you want the user to connect.

## Next steps

* [Configure P2S VPN Gateway for Microsoft Entra ID authentication – Microsoft-registered app](point-to-site-entra-gateway.md).
* To connect to your virtual network, you must configure the Azure VPN client on your client computers. See [Configure a VPN client for P2S VPN connections](point-to-site-entra-vpn-client-windows.md).
* For frequently asked questions, see the **Point-to-site** section of the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#P2S).