---
 title: include file
 description: include file
 services: virtual-network-manager
 author: mbender
 ms.service: virtual-network-manager
 ms.topic: include
 ms.date: 10/22/2024
 ms.author: mbender-ms
ms.custom: include file
---

By using [Azure Policy](/azure/virtual-network-manager/concept-azure-policy-integration), you define a condition to dynamically add two virtual networks to your network group when the name of the virtual network includes *prod*:

1. From the list of network groups, select **network-group**. Under **Create policy to dynamically add members**, select **Create Azure policy**.
1. In the **Create Azure policy** window, select or enter the following information, and then select **Preview resources**.

    :::image type="content" source="./media/virtual-network-manager-define-azure-policy/network-group-conditional.png" alt-text="Screenshot of the pane for creating an Azure policy, including criteria for definitions.":::

    | Setting | Value |
    | ------- | ----- |
    | **Policy name** | Enter **azure-policy**. |
    | **Scope** | Choose **Select scopes** and then select your current subscription. |
    | **Parameter** | Select **Name** from the dropdown list.|
    | **Operator** | Select **Contains** from the dropdown list.|
    | **Condition** | Enter **-spoke**. |

2. The **Preview resources** pane shows the virtual networks for addition to the network group based on the defined conditions in Azure Policy. When you're ready, select **Close**.

    :::image type="content" source="media/virtual-network-manager-define-azure-policy/preview-virtual-networks.png" alt-text="Screenshot of Preview resources window with virtual networks in network group.":::

3. Select **Save** to deploy the group membership. It can take up to one minute for the policy to take effect and be added to your network group.

4. In the **Network Group** pane under **Settings**, select **Group members** to view the membership of the group based on the conditions that you defined in Azure Policy. Confirm that **Source** is listed as **azure-policy - subscriptions/<your_subscription_id>**.

    :::image type="content" source="media/virtual-network-manager-define-azure-policy/group-members-list.png" alt-text="Screenshot of listed group members with a configured source." lightbox="media/virtual-network-manager-define-azure-policy/group-members-list.png":::
