---
title: Configure failover of multiple IP addresses with Azure Site Recovery
description: This article describes how to configure the failover of secondary IP configs for Azure virtual machines.
services: site-recovery
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: conceptual
ms.date: 04/29/2024
ms.author: ankitadutta
ms.custom: engagement-fy23

---
# Configure failover of multiple IP addresses with Azure Site Recovery

Every Network Interface Card (NIC) attached to a virtual machine has one or more IP configurations associated to it. Each configuration is assigned one static or dynamic private IP address. Each configuration may also have one public IP address resource associated to it. A public IP address resource has either a dynamic or static public IP address assigned to it. Learn more about [IP addresses in Azure](../virtual-network/ip-services/public-ip-addresses.md).

Azure Site Recovery automatically configures the failover of the Primary IP Configuration. This article describes how you can configure failover of Secondary IP configuration with Site Recovery. This is supported only for Azure virtual machines.


## Configure secondary IP address failover via Azure portal

Site Recovery automatically configures the failover of your Primary IP Configuration when you Enable Replication for the virtual machine. Secondary IP Configurations need to be manually configured after the replication completes. For this, you need a protected virtual machine that has one or more Secondary IP Configurations.

To configure secondary IP address failover, follow these steps:

1. Navigate to the **Network** section on the **Replicated items** page.

    :::image type="content" source="./media/concepts-multiple-ip-address-failover/network-tab.png" alt-text="Screenshot of Replicated Items Blade.":::
    

2. Under **Secondary IP Configuration**, select **Edit** to modify it.
 
    :::image type="content" source="./media/concepts-multiple-ip-address-failover/network-edit.png" alt-text="Screenshot of Network Tab Edit Mode." lightbox="./media/concepts-multiple-ip-address-failover/network-edit-expanded.png":::    

3. Select **+ IP configurations**. 
    You have two options, you can either add all IP configurations, or select and add individual IP configurations.

    :::image type="content" source="./media/concepts-multiple-ip-address-failover/add-ip-configurations.png" alt-text="Screenshot of Add IP Configurations.":::

    > [!NOTE]
    > If you add a NIC to the source virtual machine while replication is ongoing, you must disable and re-enable replication to update the same settings for the target virtual machine. 

4. Select **Add all secondary IP configurations** to list all available configurations. You can now configure them as you like.

    :::image type="content" source="./media/concepts-multiple-ip-address-failover/add-all-ip-configurations.png" alt-text="Screenshot of All IP Configurations." lightbox="./media/concepts-multiple-ip-address-failover/add-all-ip-configurations-expanded.png":::    

5. Alternatively, selecting **Select and add secondary IP configurations**, opens a pane where you can pick and add IP configurations you'd like to configure for failover.

    :::image type="content" source="./media/concepts-multiple-ip-address-failover/select-and-add-ip-configurations.png" alt-text="Screenshot of Select and Add IP Configurations." lightbox="./media/concepts-multiple-ip-address-failover/select-and-add-ip-configurations.png":::

    For each IP configuration that was added, you can configure the values for Private IP, Public IP, and Backend Pool for Failover and Test Failover separately. 

1. Save your changes.


## Next steps

Learn more about:

- [Traffic Manager with Azure Site Recovery](../site-recovery/concepts-traffic-manager-with-site-recovery.md)
- Traffic Manager [routing methods](../traffic-manager/traffic-manager-routing-methods.md).
- [Recovery plans](site-recovery-create-recovery-plans.md) to automate application failover.
