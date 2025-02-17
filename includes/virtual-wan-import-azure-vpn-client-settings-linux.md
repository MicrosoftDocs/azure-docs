---
author: cherylmc
ms.author: cherylmc
ms.date: 02/10/2025
ms.service: azure-virtual-wan
ms.topic: include
---

In this section, you configure the Azure VPN client for Linux.

1. On the Azure VPN Client page, in the lower left pane, select **Import**.

1. Select **Import Profile** and browse to find the profile xml file. Select the file. With the file selected, select **OK**.

   :::image type="content" source="media/virtual-wan-import-azure-vpn-client-settings-linux/select-file.png" alt-text="Screenshot of Azure VPN Client showing the file to be imported." lightbox="media/virtual-wan-import-azure-vpn-client-settings-linux/select-file.png":::

1. View the connection profile information. Change the **Certificate Information** value to show the default **DigiCert_Global_Root G2.pem** or **DigiCert_Global_Root_CA.pem**. Don't leave blank.

1. If your VPN client profile contains multiple client authentications, for **Client Authentication, Authentication Type** select **Microsoft Entra ID** from the dropdown.

   :::image type="content" source="media/virtual-wan-import-azure-vpn-client-settings-linux/server-validation.png" alt-text="Screenshot Server Validation and Client Authentication fields." lightbox="media/virtual-wan-import-azure-vpn-client-settings-linux/server-validation.png":::

1. For the **Tenant** field, specify the URL of your Microsoft Entra Tenant. Make sure the Tenant URL doesn't have a `\` (backslash) at the end. Forward slash is permissible.

   The Tenant ID has the following structure:
`https://login.microsoftonline.com/{Entra TenantID}`

1. For the **Audience** field, specify the Application ID (App ID).

   The App ID for the Microsoft-registered Azure VPN Client is: `c632b3df-fb67-4d84-bdcf-b95ad541b5c8`. We also support  custom App ID for this field.

1. For the **Issuer** field, specify the URL of the Secure Token Service. Include a trailing slash at the end of the Issuer value. Otherwise, the connection might fail.

   **Example:** `https://sts.windows.net/{AzureAD TenantID}/`

1. When the fields are filled in, click **Save**.

1. In the **VPN Connections** pane, select the connection profile that you saved. Then, from the dropdown, click **Connect**.

   :::image type="content" source="media/virtual-wan-import-azure-vpn-client-settings-linux/connect.png" alt-text="Screenshot showing the connection profile and the area to find connect in the dropdown." lightbox="media/virtual-wan-import-azure-vpn-client-settings-linux/connect.png":::

1. The web browser automatically appears. Fill in the username/password credentials for Microsoft Entra ID authentication, then connect.

1. When the VPN connection completes successfully, the client profile shows a green icon and the **Status Logs** window shows **Status = Connected** in the left pane.

1. Once connected, the status changes to **Connected**. To disconnect from the session, from the dropdown, select **Disconnect**.

## Delete a VPN client profile

1. On the Azure VPN client, select the connection you want to remove. Then, from the dropdown, select **Remove**.

   :::image type="content" source="media/virtual-wan-import-azure-vpn-client-settings-linux/remove.png" alt-text="Screenshot of the vpn client with the dropdown showing three options: Connect, Configure, Remove." lightbox="media/virtual-wan-import-azure-vpn-client-settings-linux/remove.png":::

1. On **Remove VPN Connection?**, select **OK**.

## Check logs

To diagnose issues, you can use the Azure VPN Client **Logs**.

1. In the Azure VPN Client, go to **Settings**. In the right pane, select **Show Logs Directory**.

1. To access the log file, go to the **/var/log/azurevpnclient** folder and locate the **AzureVPNClient.log** file.