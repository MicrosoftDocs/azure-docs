---
title: 'Azure Virtual WAN: Restart a Network Virtual Appliance (NVA) in the hub'
description: Learn how to restart a Network Virtual Appliance in the Virtual WAN hub.
author: wtnlee
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 04/08/2024
ms.author: wellee
# Customer intent: As someone who has deployed a Network Virtual Appliance (NVA) in Virtual WAN, I want to restart the NVAs running in Virtual WAN.
---

# How to restart a Network Virtual Appliance in an Azure Virtual WAN hub

The following article shows you how to restart Network Virtual Appliances (NVAs) deployed in the Virtual WAN hub. This article doesn't apply to NVAs deployed as Virtual Machines or Virtual Machine Scale Sets in a Virtual Network connected to Virtual WAN hubs. This article also doesn't apply to SaaS solutions deployed in the Virtual WAN hub.

## Prerequisites

Verify that your deployment meets the following prerequisites before attempting to restart the NVA instances:
* A Network Virtual Appliance is deployed in a Virtual WAN hub. For more information on NVAs deployed in the Virtual WAN hub, see [Integrated NVA documentation](../../articles/virtual-wan/about-nva-hub.md).
* The Network Virtual Appliance's provisioning state is "Succeeded."

## Considerations
* Only one instance of a Virtual WAN NVA can be restarted at a time from Azure portal. If you need to restart multiple NVA instances, wait for an NVA instance to finish restarting before proceeding to the next instance. 
* You can only restart an NVA if the provisioning state of the NVA is succeeded. Wait for any ongoing operations to finish before restarting an NVA instance.  

## Restart the NVA

1. Navigate to your Virtual WAN hub and select **Network Virtual Appliances** under Third-party providers.
    :::image type="content" source="./media/network-virtual-appliance-restart/find-network-virtual-appliance.png"alt-text="Screenshot showing how to find NVA in Azure portal."lightbox="./media/network-virtual-appliance-restart/find-network-virtual-appliance.png":::
2. Select **Manage configurations** for the NVA you want to restart.
    :::image type="content" source="./media/network-virtual-appliance-restart/manage-configurations.png"alt-text="Screenshot showing how to manage configurations for NVA."lightbox="./media/network-virtual-appliance-restart/manage-configurations.png":::
3. Select **Instances** under Settings.
    :::image type="content" source="./media/network-virtual-appliance-restart/instances.png"alt-text="Screenshot showing instance level settings for NVA."lightbox="./media/network-virtual-appliance-restart/instances.png":::
4. Select the instance of the NVA you want to restart.
    :::image type="content" source="./media/network-virtual-appliance-restart/select-instance.png"alt-text="Screenshot showing how to select an NVA instance."lightbox="./media/network-virtual-appliance-restart/select-instance.png":::
5. Select **Restart**.
    :::image type="content" source="./media/network-virtual-appliance-restart/restart.png"alt-text="Screenshot showing how to restart an NVA instance."lightbox="./media/network-virtual-appliance-restart/restart.png":::
6. Confirm the restart by selecting **Yes**.
    :::image type="content" source="./media/network-virtual-appliance-restart/confirm-restart.png"alt-text="Screenshot showing how to confirm you want to restart an NVA instance."lightbox="./media/network-virtual-appliance-restart/confirm-restart.png":::
## Troubleshooting

The following section describes common issues associated with restarting an NVA instance.

* **NVA provisioning state needs to be successful**: If the NVA is in an "Updating" or "Failed" state, you can't execute restart operations on the NVA. Wait for any existing operation on the NVA to finish before trying to restart again.
* **Restart already in progress**: Multiple concurrent restart operations aren't supported. If there's a restart operation running on the NVA resource already, wait for the operation to finish before attempting to restart a different instance.
* **Operations on the NVA are not allowed at this time. Please try again later**: Try the restart-operation again in 15-30 minutes.
* **The NVA operation failed due to an intermittent error**: Try the restart operation again.