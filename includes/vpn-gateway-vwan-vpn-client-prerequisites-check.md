---
ms.author: cherylmc
author: cherylmc
ms.date: 03/14/2025
ms.service: azure-vpn-gateway
ms.topic: include

 # this file is used for both virtual wan and vpn gateway. When modifying, make sure that your changes work for both environments.
---

## Run a prerequisites check manually

1. Open the Azure VPN Client and select the client connection profile that you want to check.
1. At the bottom of the page, click **Prerequisites** to open the prerequisites page.
1. Select **Run Prerequisites Test** to run the check.
1. After the prerequisites check has completed, the **Status** shows **Complete**. Review the results. If any test items don't pass, the status indicates that and prescriptive measures are provided to help you mitigate the issue.

    :::image type="content" source="./media/vpn-gateway-vwan-azure-vpn-client-prerequisites-check/error.png" alt-text="Screenshot of prerequisites test status results." lightbox="./media/vpn-gateway-vwan-azure-vpn-client-prerequisites-check/error-expand.png":::

## Disable automatic prerequisites checks

The **Enable Prerequisites Tests** setting lets you select to enable or disable automatic periodic prerequisites checks. This setting is enabled by default. To disable automatic prerequisite checks:

1. Open the Azure VPN Client.
1. Click **...** at the bottom of the page and select **Settings**.
1. On the Settings page, de-select **Enable Prerequisites Tests**. The setting is automatically saved. Items shown on the **Settings** page apply to all client connection profiles.
