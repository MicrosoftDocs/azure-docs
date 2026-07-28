---
title: Configure failover of multiple IP addresses with Azure Site Recovery
description: This article describes how to configure the failover of secondary IP configs for Azure virtual machines.
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: concept-article
ms.date: 02/11/2026
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
ms.custom:
  - engagement-fy23
  - sfi-image-nochange

# Customer intent: As a cloud administrator, I want to configure failover for secondary IP configurations of Azure virtual machines, so that I can ensure continuous availability and manage network settings during disaster recovery scenarios.
---
# Configure failover of multiple IP addresses with Azure Site Recovery

Every network interface card (NIC) attached to a virtual machine has one or more IP configurations associated with it. Each configuration has one static or dynamic private IP address. Each configuration can also have one public IP address resource associated with it. A public IP address resource has either a dynamic or static public IP address assigned to it. For more information, see [IP addresses in Azure](../virtual-network/ip-services/public-ip-addresses.md).

Azure Site Recovery automatically configures the failover of the primary IP configuration. This article describes how you can configure failover of secondary IP configuration with Site Recovery. This feature is supported only for Azure virtual machines.


## Configure secondary IP address failover via Azure portal

Site Recovery automatically configures the failover of your primary IP configuration when you enable replication for the virtual machine. You need to manually configure secondary IP configurations after the replication completes. For this configuration, you need a protected virtual machine that has one or more secondary IP configurations.

To configure secondary IP address failover, follow these steps:

1. Go to the **Network** section on the **Replicated items** page.

    :::image type="content" source="./media/concepts-multiple-ip-address-failover/network-tab.png" alt-text="Screenshot of Replicated Items Blade.":::
    

1. Under **Secondary IP Configuration**, select **Edit** to modify it.
 
    :::image type="content" source="./media/concepts-multiple-ip-address-failover/network-edit.png" alt-text="Screenshot of Network Tab Edit Mode." :::    

1. Select **+ IP configurations**. 
    You have two options: add all IP configurations, or select and add individual IP configurations.

    :::image type="content" source="./media/concepts-multiple-ip-address-failover/add-ip-configurations.png" alt-text="Screenshot of Add IP Configurations.":::

    > [!NOTE]
    > If you add a NIC to the source virtual machine while replication is ongoing, you must disable and re-enable replication to update the same settings for the target virtual machine. 

1. Select **Add all secondary IP configurations** to list all available configurations. You can now configure them as you like.

    :::image type="content" source="./media/concepts-multiple-ip-address-failover/add-all-ip-configurations.png" alt-text="Screenshot of All IP Configurations." lightbox="./media/concepts-multiple-ip-address-failover/add-all-ip-configurations-expanded.png":::    

1. Alternatively, select **Select and add secondary IP configurations** to open a pane where you can pick and add IP configurations you'd like to configure for failover.

    :::image type="content" source="./media/concepts-multiple-ip-address-failover/select-and-add-ip-configurations.png" alt-text="Screenshot of Select and Add IP Configurations." lightbox="./media/concepts-multiple-ip-address-failover/select-and-add-ip-configurations.png":::

    For each IP configuration that you add, you can configure the values for Private IP, Public IP, and Backend Pool for Failover and Test Failover separately. 

1. Save your changes.


## Next steps

Learn more about:

- [Traffic Manager with Azure Site Recovery](../site-recovery/concepts-traffic-manager-with-site-recovery.md).
- Traffic Manager [routing methods](../traffic-manager/traffic-manager-routing-methods.md).
- [Recovery plans](site-recovery-create-recovery-plans.md) to automate application failover.
