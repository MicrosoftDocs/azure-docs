---
title: Audit and deploy virtual network flow logs using Azure Policy 
titleSuffix: Azure Network Watcher
description: Learn how to use Azure Policy built-in policies to audit virtual networks and deploy Azure Network Watcher virtual network flow logs.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 05/07/2024

#CustomerIntent: As an Azure administrator, I want to use Azure Policy to audit and deploy virtual network flow logs.
---

# Audit and deploy virtual network flow logs using Azure Policy

Azure Policy helps you enforce organizational standards and assess compliance at scale. Common use cases for Azure Policy include implementing governance for resource consistency, regulatory compliance, security, cost, and management. To learn more about Azure policy, see [What is Azure Policy?](../governance/policy/overview.md) and [Quickstart: Create a policy assignment to identify noncompliant resources](../governance/policy/assign-policy-portal.md).

In this article, you learn how to use two built-in policies to manage your setup of virtual network flow logs. The first policy flags any virtual network that doesn't have flow logging enabled. The second policy automatically deploys virtual network flow logs to virtual networks that don't have flow logging enabled.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A virtual network. If you need to create a virtual network, see [Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md?toc=/azure/network-watcher/toc.json).


## Audit flow logs configuration for virtual networks using a built-in policy

The **Audit flow logs configuration for every virtual network** policy audits all existing virtual networks  in a scope by checking all Azure Resource Manager objects of type `Microsoft.Network/virtualNetworks` for linked flow logs via the flow log property of the virtual network. It then flags any virtual network that doesn't have flow logging enabled.

To audit your flow logs using the built-in policy, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *policy*. Select **Policy** in the search results.

    :::image type="content" source="./media/vnet-flow-logs-policy/policy-portal-search.png" alt-text="Screenshot that shows how to search for Azure Policy in the Azure portal." lightbox="./media/vnet-flow-logs-policy/policy-portal-search.png":::

1. Select **Assignments**, and then select **Assign policy**.

    :::image type="content" source="./media/vnet-flow-logs-policy/assign-policy.png" alt-text="Screenshot that shows how to assign a policy in the Azure portal.":::

1. Select the ellipsis (**...**) next to **Scope** to choose your Azure subscription that has the virtual networks that you want to check using the policy. You can also choose the resource group that has the virtual networks. After you make your selections, select the **Select** button.

    :::image type="content" source="./media/vnet-flow-logs-policy/policy-scope.png" alt-text="Screenshot that shows how to define the scope of the policy in the Azure portal." lightbox="./media/vnet-flow-logs-policy/policy-scope.png":::

1. Select the ellipsis (**...**) next to **Policy definition** to choose the built-in policy that you want to assign. Enter ***flow log*** in the search box, and then select the **Built-in** filter. From the search results, select **Audit flow logs configuration for every virtual network**, and then select **Add**.

    :::image type="content" source="./media/vnet-flow-logs-policy/audit-policy.png" alt-text="Screenshot that shows how to select the audit policy in the Azure portal." lightbox="./media/vnet-flow-logs-policy/audit-policy.png":::

1. Enter a name in **Assignment name** or use the default name, and then enter your name in **Assigned by**.

    This policy doesn't require any parameters. It also doesn't contain any role definitions, so you don't need to create role assignments for the managed identity on the **Remediation** tab.

1. Select **Review + create**, and then select **Create**.

    :::image type="content" source="./media/vnet-flow-logs-policy/assign-audit-policy.png" alt-text="Screenshot that shows the Basics tab of assigning an audit policy in the Azure portal." lightbox="./media/vnet-flow-logs-policy/assign-audit-policy.png":::

1. Select **Compliance** and change the **Compliance state** filter to **Non-compliant** to list all noncompliant policies. Search for the name of your audit policy that you created, and then select it.

    :::image type="content" source="./media/vnet-flow-logs-policy/audit-policy-compliance.png" alt-text="Screenshot that shows the Compliance page, which lists noncompliant policies including the audit policy." lightbox="./media/vnet-flow-logs-policy/audit-policy-compliance.png":::

1. In the policy compliance page, change the **Compliance state** filter to **Non-compliant** to list all noncompliant virtual networks. In this example, there are three noncompliant virtual networks out of four.

    :::image type="content" source="./media/vnet-flow-logs-policy/audit-policy-compliance-details.png" alt-text="Screenshot that shows the noncompliant virtual networks based on the audit policy." lightbox="./media/vnet-flow-logs-policy/audit-policy-compliance-details.png":::

## Deploy and configure virtual network flow logs using a built-in policy

The **Deploy a flow log resource with target virtual network** policy checks all existing virtual networks in a scope by checking all Azure Resource Manager objects of type `Microsoft.Network/virtualNetworks`. It then checks for linked flow logs via the flow log property of the virtual network. If the property doesn't exist, the policy deploys a flow log.

> [!IMPORTANT]
> We recommend disabling network security group flow logs before enabling virtual network flow logs on the same underlying workloads to avoid duplicate traffic recording and additional costs. For example, if you enable network security group flow logs on the network security group of a subnet, then you enable virtual network flow logs on the same subnet or parent virtual network, you might get duplicate logging (both network security group flow logs and virtual network flow logs generated for all supported workloads in that particular subnet).

To assign the *deployIfNotExists* policy, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *policy*. Select **Policy** in the search results.

    :::image type="content" source="./media/vnet-flow-logs-policy/policy-portal-search.png" alt-text="Screenshot that shows how to search for Azure Policy in the Azure portal." lightbox="./media/vnet-flow-logs-policy/policy-portal-search.png":::

1. Select **Assignments**, and then select **Assign policy**.

    :::image type="content" source="./media/vnet-flow-logs-policy/assign-policy.png" alt-text="Screenshot that shows how to assign a policy in the Azure portal.":::

1. Select the ellipsis (**...**) next to **Scope** to choose your Azure subscription that has the virtual networks that you want to check using the policy. You can also choose the resource group that has the virtual networks. After you make your selections, select the **Select** button.

    :::image type="content" source="./media/vnet-flow-logs-policy/policy-scope.png" alt-text="Screenshot that shows how to define the scope of the policy in the Azure portal." lightbox="./media/vnet-flow-logs-policy/policy-scope.png":::

1. Select the ellipsis (**...**) next to **Policy definition** to choose the built-in policy that you want to assign. Enter ***flow log*** in the search box, and then select the **Built-in** filter. From the search results, select **Deploy a flow log resource with target virtual network**, and then select **Add**.

    :::image type="content" source="./media/vnet-flow-logs-policy/deploy-policy.png" alt-text="Screenshot that shows how to select the deployment policy in the Azure portal." lightbox="./media/vnet-flow-logs-policy/deploy-policy.png":::

    > [!NOTE]
    > You need *Contributor* or *Owner* permission to use this policy.

1. Enter a name in **Assignment name** or use the default name, and then enter your name in **Assigned by**.

    :::image type="content" source="./media/vnet-flow-logs-policy/assign-deploy-policy-basics.png" alt-text="Screenshot that shows the Basics tab of assigning a deployment policy in the Azure portal." lightbox="./media/vnet-flow-logs-policy/assign-deploy-policy-basics.png":::

1. Select **Next** button twice, or select the **Parameters** tab. Then select the following values:

    | Setting | Value |
    | --- | --- |
    | **Effect** | Select **DeployIfNotExists** to enable the execution of the policy. The other available option is: **Disabled**.|
    | **Virtual Network Region** | Select the region of your virtual network that you're targeting with the policy. |
    | **Storage Account** | Select the storage account. The storage account must be in the same region as the virtual network. |
    | **Network Watcher RG** | Select the resource group of your Network Watcher instance. The flow logs created by the policy are saved into this resource group. |
    | **Network Watcher** | Select the Network Watcher instance of the selected region. |
    | **Number of days to retain flowlogs** | Select the number of days that you want to keep your flow logs data in the storage account. The default value is 30 days. If you don't want to apply any retention policy, enter **0**. |

    :::image type="content" source="./media/vnet-flow-logs-policy/assign-deploy-policy-parameters.png" alt-text="Screenshot that shows the Parameters tab of assigning a deployment policy in the Azure portal." lightbox="./media/vnet-flow-logs-policy/assign-deploy-policy-parameters.png":::

1. Select **Next** or the **Remediation** tab.

1. Select **Create a remediation task** checkbox.

    :::image type="content" source="./media/vnet-flow-logs-policy/assign-deploy-policy-remediation.png" alt-text="Screenshot that shows the Remediation tab of assigning a deployment policy in the Azure portal." lightbox="./media/vnet-flow-logs-policy/assign-deploy-policy-remediation.png":::

1. Select **Review + create**, and then select **Create**.

1. Select **Compliance** and change the **Compliance state** filter to **Non-compliant** to list all noncompliant policies. Search for the name of your deploy policy that you created, and then select it.

    :::image type="content" source="./media/vnet-flow-logs-policy/deploy-policy-compliance.png" alt-text="Screenshot that shows the Compliance page, which lists noncompliant policies including the deployment policy." lightbox="./media/vnet-flow-logs-policy/audit-policy-compliance.png":::

1. In the policy compliance page, change the **Compliance state** filter to **Non-compliant** to list all noncompliant virtual networks. In this example, there are three noncompliant virtual networks out of four.

    :::image type="content" source="./media/vnet-flow-logs-policy/deploy-policy-compliance-details.png" alt-text="Screenshot that shows the noncompliant virtual networks based on the deploy policy." lightbox="./media/vnet-flow-logs-policy/deploy-policy-compliance-details.png":::

    > [!NOTE]
    > The policy takes some time to evaluate virtual networks in the specified scope and deploy flow logs for the noncompliant virtual networks. 

1. Go to **Flow logs** under **Logs** in **Network Watcher** to see the flow logs that were deployed by the policy.

    :::image type="content" source="./media/vnet-flow-logs-policy/flow-logs.png" alt-text="Screenshot that shows the flow logs list in Network Watcher." lightbox="./media/vnet-flow-logs-policy/flow-logs.png":::

1. In the policy compliance page, verify that all virtual networks in the specified scope are compliant.

    :::image type="content" source="./media/vnet-flow-logs-policy/deploy-policy-compliance-details-compliant.png" alt-text="Screenshot that shows there aren't any noncompliant virtual networks after the deployment policy deployed flow logs in the defined scope." lightbox="./media/vnet-flow-logs-policy/deploy-policy-compliance-details-compliant.png":::

    > [!NOTE]
    > It can take up to 24 hours to update resource compliance status in Azure Policy compliance page. For more information, see [Understand evaluation outcomes](../governance/policy/overview.md?toc=/azure/network-watcher/toc.json#understand-evaluation-outcomes).

 ## Related content

- [Virtual network flow logs](vnet-flow-logs-overview.md).
- [Manage virtual network flow logs using the Azure portal](vnet-flow-logs-portal.md).
