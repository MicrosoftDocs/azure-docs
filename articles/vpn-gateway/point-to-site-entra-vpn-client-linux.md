---
title: 'Configure Azure VPN Client - Microsoft Entra ID authentication - first-party App ID - Linux'
description: 'Learn how to configure the Azure VPN Client for Linux for Microsoft Entra ID authentication on Ubuntu.'
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: howto
ms.date: 04/09/2024
ms.author: cherylmc

---
# Configure the Azure VPN Client - Microsoft Entra ID authentication - Linux (Preview)

This article helps you configure the Azure VPN Client on a Linux computer (Ubuntu) to connect to a virtual network using a VPN Gateway point-to-site (P2S) VPN and Microsoft Entra ID authentication. For more information about point-to-site connections, see [About Point-to-Site connections](point-to-site-about.md).

[!INCLUDE [first-party authentication openvpn note](../../includes/vpn-gateway-entra-first-party-open-vpn-note.md)]

## Prerequisites

Complete the steps for the point-to-site server configuration. See [Configure a P2S VPN gateway for Microsoft Entra ID authentication - first-party App ID - Linux clients](point-to-site-entra-application-id-first-party.md). 

The Azure VPN Client for Linux uses a specific tenant configuration. You can't use this version of the Azure VPN Client with a point-to-site Microsoft Entra ID authentication that uses a third-party Application ID. For more information about Application IDs, see [What are application objects and where do they come from](https://learn.microsoft.com/entra/identity-platform/how-applications-are-added).

## Workflow

After your Azure VPN Gateway P2S server configuration is complete, your next steps are as follows:

1. Download and install the Azure VPN Client for Linux.
1. Generate the VPN client profile configuration package.
1. Import the client profile settings to the VPN client.
1. Create a connection.

## Download the Azure VPN Client for Linux

1. Linux uses a specific version of the Azure VPN Client. Use the following steps to download and install the latest version of the Azure VPN Client for Linux.

   > [!NOTE]
   > Add only the repository list of your Ubuntu version 20.04 or 22.04.
   > For more information, see the [Linux Software Repository for Microsoft Products](https://learn.microsoft.com/linux/packages).

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

1. Install the Azure VPN Client to each Linux computer.

## Generate VPN client profile configuration files

If you used the P2S server configuration steps for Linux as mentioned in the [prerequisite](#prerequisites), you've already generated and downloaded the VPN client profile configuration package that contains the VPN profile configuration files you'll need. If you need to generate the package again, see [Generate the VPN client profile configuration package](point-to-site-entra-application-id-first-party.md#download-the-vpn-client-profile-configuration-package).

## About VPN client profile configuration files for Linux

We're migrating the current Azure VPN Application ID to a first-party Application ID. The Azure VPN client for Linux is a newly released client and supports only first-party application App ID (not third-party). The Azure VPN client for Linux is also the *only* version of the Azure VPN client that supports the first-party App ID at this time. For more information, see [About VPN Gateway and first-party App IDs](point-to-site-entra-application-id-first-party.md).

In the Linux client setup, you must reference the new version of the Application ID (App ID).

First-party App ID - **c632b3df-fb67-4d84-bdcf-b95ad541b5c8**

The third-party version of the Application ID,  *41b23e61-6c1e-4545-b367-cd054e0ed4b4*, won’t work with a first-party version of the Azure VPN Client (in this case, the Linux client). However, if you have a custom App ID, you can use it with the Azure VPN Client for Linux.

For Microsoft Entra ID authentication, use the **azurevpnconfig_aad.xml** file. The file is located in the **AzureVPN** folder of the VPN client profile configuration package.

1. On the Azure VPN Client page, select **Import**.

   :::image type="content" source="media/point-to-site-entra-vpn-client-linux/import.png" alt-text="Screenshot of Azure VPN Client import selection." lightbox="media/point-to-site-entra-vpn-client-linux/import.png":::

1. Select **Import Profile** and browse to find the profile xml file. Select the file. With the file selected, select **OK**.

   :::image type="content" source="media/point-to-site-entra-vpn-client-linux/select-file.png" alt-text="Screenshot of Azure VPN Client showing the file to be imported." lightbox="media/point-to-site-entra-vpn-client-linux/select-file.png":::

1. View the connection profile information. Change the **Certificate Information** value to show the default **DigiCert_Global_Root G2.pem** or **DigiCert_Global_Root_CA.pem**. Don't leave blank.

1. If your VPN client profile contains multiple client authentications, for **Client Authentication, Authentication Type** select the option for **Microsoft Entra ID**.

   :::image type="content" source="media/point-to-site-entra-vpn-client-linux/server-validation.png" alt-text="Screenshot Server Validation and Client Authentication fields." lightbox="media/point-to-site-entra-vpn-client-linux/server-validation.png":::

1. For the **Tenant** field, specify the URL of your Microsoft Entra Tenant. Make sure the Tenant URL doesn't have a \ (backslash) at the end. Forward slash is permissible.

   The Tenant ID has the following structure:
`https://login.microsoftonline.com/{Entra TenantID}`

1. For the **Audience** field, specify the Application ID (App ID). The Azure VPN Client for Linux uses this specific first-party App ID for Azure Public: `41b23e61-6c1e-4545-b367-cd054e0ed4b4`. We also support a custom first-party App ID for this field.

   > [!NOTE]
   > The Azure VPN Client only supports Microsoft Entra ID authentication (first-party App ID) for the Azure public cloud.

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
