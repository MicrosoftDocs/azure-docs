---
title: 'Configure Azure VPN Client - Microsoft Entra ID authentication - Linux'
description: Learn how to configure the Linux Azure VPN Client for Microsoft Entra ID authentication for gateways configured to use the Microsoft-registered Azure VPN Client App ID.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 06/05/2024
ms.author: cherylmc
---

# Configure Azure VPN Client – Microsoft Entra ID authentication – Linux (Preview)

This article helps you configure the Azure VPN Client on a Linux computer (Ubuntu) to connect to a virtual network using a VPN Gateway point-to-site (P2S) VPN and Microsoft Entra ID authentication. For more information about point-to-site connections, see [About Point-to-Site connections](point-to-site-about.md).

The steps in this article apply to Microsoft Entra ID authentication using the Microsoft-registered Azure VPN Client app with associated App ID and Audience values. This article doesn't apply to the older, manually registered Azure VPN Client app for your tenant. For more information, see [About point-to-site VPN - Microsoft Entra ID authentication](point-to-site-about.md#entra-id).

[!INCLUDE [Supported versions](../../includes/vpn-gateway-azure-vpn-client-linux-supported-releases.md)]

## Prerequisites

Complete the steps for the point-to-site server configuration. See [Configure a P2S VPN gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).

## Workflow

After your Azure VPN Gateway P2S server configuration is complete, your next steps are as follows:

1. Download and install the Azure VPN Client for Linux.
1. Import the client profile settings to the VPN client.
1. Create a connection.

## Download and install the Azure VPN Client

Use the following steps to download and install the latest version of the Azure VPN Client for Linux.

> [!NOTE]
> Add only the repository list of your Ubuntu version 20.04 or 22.04.
> For more information, see the [Linux Software Repository for Microsoft Products](/linux/packages).

```CLI
# install curl utility
sudo apt-get install curl

# Install Microsoft's public key
curl -sSl https://packages.microsoft.com/keys/microsoft.asc | sudo tee /etc/apt/trusted.gpg.d/microsoft.asc

# Install the production repo list for focal
# For Ubuntu 20.04
curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list | sudo tee /etc/apt/sources.list.d/microsoft-
ubuntu-focal-prod.list

# Install the production repo list for jammy
# For Ubuntu 22.04
curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list | sudo tee /etc/apt/sources.list.d/microsoft-
ubuntu-jammy-prod.list

sudo apt-get update
sudo apt-get install microsoft-azurevpnclient
```

## Download VPN client profile configuration files

To configure your Azure VPN Client profile, you download a VPN Client profile configuration package from the Azure P2S gateway. This package contains the necessary settings to configure the VPN client.

If you used the P2S server configuration steps as mentioned in the [Prerequisites](#prerequisites) section, you've already generated and downloaded the VPN client profile configuration package that contains the VPN profile configuration files you'll need. If you need to generate configuration files, see [Download the VPN client profile configuration package](point-to-site-entra-gateway.md#download).

## About VPN client profile configuration files

In this section, you configure the Azure VPN client for Linux.

* If your P2S gateway configuration was previously configured to use the older, manually registered App ID versions, your P2S configuration doesn't support the Linux VPN client. See [About the Microsoft-registered App ID for Azure VPN Client](point-to-site-entra-gateway.md).

* For Microsoft Entra ID authentication, use the **azurevpnconfig_aad.xml** file. The file is located in the **AzureVPN** folder of the VPN client profile configuration package.

1. On the Azure VPN Client page, select **Import**.

   :::image type="content" source="media/point-to-site-entra-vpn-client-linux/import.png" alt-text="Screenshot of Azure VPN Client import selection." lightbox="media/point-to-site-entra-vpn-client-linux/import.png":::

1. Select **Import Profile** and browse to find the profile xml file. Select the file. With the file selected, select **OK**.

   :::image type="content" source="media/point-to-site-entra-vpn-client-linux/select-file.png" alt-text="Screenshot of Azure VPN Client showing the file to be imported." lightbox="media/point-to-site-entra-vpn-client-linux/select-file.png":::

1. View the connection profile information. Change the **Certificate Information** value to show the default **DigiCert_Global_Root G2.pem** or **DigiCert_Global_Root_CA.pem**. Don't leave blank.

1. If your VPN client profile contains multiple client authentications, for **Client Authentication, Authentication Type** select the option for **Microsoft Entra ID**.

   :::image type="content" source="media/point-to-site-entra-vpn-client-linux/server-validation.png" alt-text="Screenshot Server Validation and Client Authentication fields." lightbox="media/point-to-site-entra-vpn-client-linux/server-validation.png":::

1. For the **Tenant** field, specify the URL of your Microsoft Entra Tenant. Make sure the Tenant URL doesn't have a `\` (backslash) at the end. Forward slash is permissible.

   The Tenant ID has the following structure:
`https://login.microsoftonline.com/{Entra TenantID}`

1. For the **Audience** field, specify the Application ID (App ID).

   The App ID for Azure Public is: `c632b3df-fb67-4d84-bdcf-b95ad541b5c8`. We also support  custom App ID for this field.

1. For the **Issuer** field, specify the URL of the Secure Token Service. Include a trailing slash at the end of the Issuer value. Otherwise, the connection might fail.

   **Example:** `https://sts.windows.net/{AzureAD TenantID}/`

1. When the fields are filled in, click **Save**.

1. In the **VPN Connections** pane, select the connection profile that you saved. Then, from the dropdown, click **Connect**.

   :::image type="content" source="media/point-to-site-entra-vpn-client-linux/connect.png" alt-text="Screenshot showing the connection profile and the area to find connect in the dropdown." lightbox="media/point-to-site-entra-vpn-client-linux/connect.png":::

1. The web browser automatically appears. Fill in the username/password credentials for Microsoft Entra ID authentication, then connect.

   :::image type="content" source="media/point-to-site-entra-vpn-client-linux/credentials.png" alt-text="Screenshot of authentication credential sign in page." lightbox="media/point-to-site-entra-vpn-client-linux/credentials.png":::

1. If the connection is completed successfully, the client shows a green icon and the **Status Logs** window shows **Status = Connected**.

   :::image type="content" source="media/point-to-site-entra-vpn-client-linux/status-connected.png" alt-text="Screenshot of the vpn client with the status logs window showing connected." lightbox="media/point-to-site-entra-vpn-client-linux/status-connected.png":::

1. Once connected, the status changes to **Connected**. To disconnect from the session, from the dropdown, select **Disconnect**.

## Delete a VPN client profile

1. On the Azure VPN client, select the connection you want to remove. Then, from the dropdown, select **Remove**.

   :::image type="content" source="media/point-to-site-entra-vpn-client-linux/remove.png" alt-text="Screenshot of the vpn client with the dropdown showing three options: Connect, Configure, Remove." lightbox="media/point-to-site-entra-vpn-client-linux/remove.png":::

1. On **Remove VPN Connection?**, select **OK**.

   :::image type="content" source="media/point-to-site-entra-vpn-client-linux/remove-connection.png" alt-text="Screenshot of the vpn client with the Remove VPN Connection popup open." lightbox="media/point-to-site-entra-vpn-client-linux/remove-connection.png":::

## Check logs

To diagnose issues, you can use the Azure VPN Client **Logs**.

1. In the Azure VPN Client, go to **Settings**. In the right pane, select **Show Logs Directory**.

   :::image type="content" source="media/point-to-site-entra-vpn-client-linux/show-logs.png" alt-text="Screenshot of the vpn client showing the Show logs directory option." lightbox="media/point-to-site-entra-vpn-client-linux/show-logs.png":::

1. To access the log file, go to the **/var/log/azurevpnclient** folder and locate the **AzureVPNClient.log** file.

   :::image type="content" source="media/point-to-site-entra-vpn-client-linux/client-log.png" alt-text="Screenshot of the location of the Azure VPN Client log file." lightbox="media/point-to-site-entra-vpn-client-linux/client-log.png":::

## Next steps

* For more information about VPN Gateway, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md).

* For more information about point-to-site connections, see [About Point-to-Site connections](point-to-site-about.md).
