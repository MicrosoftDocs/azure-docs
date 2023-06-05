---
title: How to migrate Azure DDoS Protection tiers using Azure portal.
description: In this guide we'll walk through the steps to migrate Azure DDoS Protection tiers using Azure portal.
author: abell
ms.author: abell
ms.service: ddos-protection
ms.topic: how-to 
ms.date: 06/05/2023
ms.custom: template-how-to-pattern 
---

# How to migrate Azure DDoS Protection tiers using Azure portal

In this guide, we'll walk through the steps to migrate Azure DDoS Protection tiers using Azure portal. This guide follows the *Application running on load-balanced virtual machines* architecture. To learn more about the different architectures, see [Azure DDoS Protection reference architectures](./ddos-protection-reference-architectures.md#application-running-on-load-balanced-virtual-machines).


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [DDoS Network Protection](manage-ddos-protection.md) must be enabled on a virtual network or [DDoS IP Protection](manage-ddos-protection-powershell-ip.md) must be enabled on a public IP address. 


## Migrate to IP Protection 

You can migrate from Network Protection to IP Protection using the Azure portal. 

### Enable IP Protection 

To prevent DDoS protection downtime, you must enable IP Protection before disabling Network Protection.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search box at the top of the portal, enter **public IP Addresses**. Select **public IP Address**.
1. Select your Public IP address. In this example, select **myStandardPublicIP**.
1. In the **Overview** pane, select the **Properties** tab, then select **DDoS protection**. 

    :::image type="content" source="./media/ddos-migrate-ddos-protection/ddos-protection-view-status.png" alt-text="Screenshot showing view of Public IP Properties." lightbox="./media/ddos-migrate-ddos-protection/ddos-protection-view-status.png":::

1. In the **Configure DDoS protection** pane, under **Protection type**, select  **IP**, then select **Save**.

    :::image type="content" source="./media/ddos-migrate-ddos-protection/ddos-protection-select-status.png" alt-text="Screenshot of selecting IP Protection in Public IP Properties.":::


### Disable Network Protection

The DDoS Protection plan must be disassociated from the protected resources before you can delete the plan.

1. In the search box at the top of the portal, enter **DDoS protection plans**. Select your DDoS protection plan.
1. In the **Settings** pane, select the **Protected Resources** tab, then select the **Dissociate** icon for your service. Select **Yes** to confirm.

    :::image type="content" source="./media/ddos-migrate-ddos-protection/ddos-remove-protected-resources.png" alt-text="Screenshot of removing protected resources to DDoS protection plan.":::


<!-- Identify how to instruct the customer to delete the DDoS Protection plan. If the customer have multiple services under plan the customer should be aware that deleting will end protection for those services. -->



## Migrate to Network Protection

### Add Protected Resources to DDoS protection plan

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search box at the top of the portal, enter **DDoS protection plans**. Select your DDoS protection plan.
1. In the **Settings** pane, select the **Protected Resources** tab, then select **Add**. 

    :::image type="content" source="./media/ddos-migrate-ddos-protection/ddos-add-protected-resources.png" alt-text="Screenshot of adding protected resources to DDoS protection plan.":::

1. In the **Add virtual network to DDoS plan** pane, select the **Subscription** and **Resource group** that contains the protected resources you want to add to the plan, then select the **Virtual network**. Select **Add**.

    :::image type="content" source="./media/ddos-migrate-ddos-protection/ddos-add-virtual-network.png" alt-text="Screenshot of adding virtual network to DDoS protection plan.":::

### Disable IP Protection 

<!-- Identify when exactly Network Protection is enabled. Does changing the setting enable network protection or just disable IP Protection? -->

1. In the search box at the top of the portal, enter **public IP Addresses**. Select **public IP Address**.
1. Select your Public IP address. In this example, select **myStandardPublicIP**.
1. In the **Overview** pane, select the **Properties** tab, then select **DDoS protection**. 

    :::image type="content" source="./media/ddos-migrate-ddos-protection/ddos-protection-view-status.png" alt-text="Screenshot showing view of Public IP Properties." lightbox="./media/ddos-migrate-ddos-protection/ddos-protection-view-status.png":::

1. In the **Configure DDoS protection** pane, under **Protection type**, select **Network Protection**, then select **Save**.

    :::image type="content" source="./media/ddos-migrate-ddos-protection/ddos-protection-select-status-network-protection.png" alt-text="Screenshot of selecting Network Protection in Public IP Properties.":::

### Validate DDoS Protection Status

To validate the status of your protected resource follow the steps below.

1. Select **All resources** on the top, left of the portal.
1. Enter *public IP address* in the **Filter** box. When **public IP address** appear in the results, select it.
1. Select your public IP Address from the list.
1. In the **Overview** pane, select the **Properties** tab in the middle of the page, then select **DDoS protection**. 
1. View **Protection status** and verify your public IP is protected.

    :::image type="content" source="./media/ddos-migrate-ddos-protection/ddos-protection-view-status.png" alt-text="Screenshot showing view of Public IP Properties." lightbox="./media/ddos-migrate-ddos-protection/ddos-protection-view-status.png":::

## Next steps

- Learn how to [configure diagnostic logging](diagnostic-logging.md).