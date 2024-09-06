---
 title: include file
 description: include file
 services: virtual-network-manager
 author: mbender
 ms.service: virtual-network-manager
 ms.topic: include
 ms.date: 06/26/2024
 ms.author: mbender-ms
ms.custom: include file
---

1. Browse to the **rg-learn-eastus-001** resource group, and select the **vnm-learn-eastus-001** network manager instance.

1. Under **Settings**, select **Network groups**. Then select **+ Create**.

    :::image type="content" source="./media/virtual-network-manager-create-network-group/add-network-group-2.png" alt-text="Screenshot of an empty list of network groups and the button for creating a network group.":::

1. On the **Create a network group** pane, then select **Create**:
   
   | **Setting** | **Value** |
    | --- | --- |
    | **Name** | Enter **ng-learn-prod-eastus-001**. |
    | **Description** | *(Optional)* Provide a description about this network group. |
    | **Member type** | Select **Virtual network** from the dropdown menu. |
    
    and select **Create**.

    :::image type="content" source="./media/virtual-network-manager-create-network-group/create-network-group.png" alt-text="Screenshot of the pane for creating a network group." lightbox="./media/virtual-network-manager-create-network-group/create-network-group.png":::

2. Confirm that the new network group is now listed on the **Network groups** pane.

    :::image type="content" source="./media/virtual-network-manager-create-network-group/network-groups-list.png" alt-text="Screenshot of a newly created network group on the pane that list network groups.":::
