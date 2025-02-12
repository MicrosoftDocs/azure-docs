---
title: 'Azure VPN Client prerequisites check'
titleSuffix: Azure VPN Gateway
description: Learn how run the Azure VPN Client prerequisites test to identify missing prerequisites and mitigate them.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 09/23/2024
ms.author: cherylmc

---
# Azure VPN Client prerequisites check for P2S VPN connections

If you're using the Azure VPN Client for Windows to connect to your point-to-site (P2S) VPN, you can run a prerequisites check to identify missing prerequisites and mitigate them. The **Run Prerequisites Test** feature checks the state of Windows services, background permissions for the client, local setting permissions, internet access, and user device time sync status. You can use this feature to do the following:

* Manually run a prerequisites check to identify missing prerequisites and mitigate them.
* Periodically run a prerequisites check automatically.

The **Run Prerequisites Test** feature is available in the Azure VPN Client for Windows, version 3.4.0.0 and later. It's not available for other versions of the Azure VPN Client. For Azure VPN Client version information, see [Azure VPN Client versions](azure-vpn-client-versions.md).

> [!NOTE]
> The prerequisites check is only available in the Azure VPN Client for Windows.

## Run a prerequisites check manually

1. Open the Azure VPN Client and select the client connection profile that you want to check.
1. At the bottom of the page, click **Prerequisites** to open the prerequisites page.
1. Select **Run Prerequisites Test** to run the check.
1. After the prerequisites check has completed, the **Status** shows **Complete**. Review the results. If any test items don't pass, the status indicates that and prescriptive measures are provided to help you mitigate the issue.

    :::image type="content" source="./media/azure-vpn-client-prerequisites-check/error.png" alt-text="Screenshot of prerequisites test status results." lightbox="./media/azure-vpn-client-prerequisites-check/error.png":::

## Disable automatic prerequisites checks

The **Enable Prerequisites Tests** setting lets you select to enable or disable automatic periodic prerequisites checks. This setting is enabled by default. To disable automatic prerequisite checks:

1. Open the Azure VPN Client.
1. Click **...** at the bottom of the page and select **Settings**.
1. On the Settings page, de-select **Enable Prerequisites Tests**. The setting is automatically saved. Items shown on the **Settings** page apply to all client connection profiles.

## Next steps

For more information about P2S VPN, see the following articles:

* [About point-to-site VPN](point-to-site-about.md)
* [About point-to-site VPN routing](vpn-gateway-about-point-to-site-routing.md)
