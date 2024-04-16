---
title: Manage NSG flow logs using Azure Policy 
titleSuffix: Azure Network Watcher
description: Learn how to use Azure Policy built-in policies to audit network security groups and deploy Azure Network Watcher NSG flow logs.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 05/30/2023
ms.author: halkazwini
ms.custom: template-how-to, engagement-fy23
---

# Manage NSG flow logs using Azure Policy

Azure Policy helps you enforce organizational standards and assess compliance at scale. Common use cases for Azure Policy include implementing governance for resource consistency, regulatory compliance, security, cost, and management. To learn more about Azure policy, see [What is Azure Policy?](../governance/policy/overview.md) and [Quickstart: Create a policy assignment to identify non-compliant resources](../governance/policy/assign-policy-portal.md).

In this article, you learn how to use two built-in policies to manage your setup of network security group (NSG) flow logs. The first policy flags any network security group that doesn't have flow logs enabled. The second policy automatically deploys NSG flow logs that don't have flow logs enabled.

## Audit network security groups using a built-in policy

The **Flow logs should be configured for every network security group** policy audits all existing network security groups in a scope by checking all Azure Resource Manager objects of type `Microsoft.Network/networkSecurityGroups`. This policy then checks for linked flow logs via the flow logs property of the network security group, and it flags any network security group that doesn't have flow logs enabled.

To audit your flow logs using the built-in policy:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *policy*. Select **Policy** in the search results.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/portal.png" alt-text="Screenshot of searching for Azure Policy in the Azure portal." lightbox="./media/nsg-flow-logs-policy-portal/portal.png":::

1. Select **Assignments**, and then select **Assign policy**.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/assign-policy.png" alt-text="Screenshot of selecting the button for assigning a policy in the Azure portal.":::

1. Select the ellipsis (**...**) next to **Scope** to choose your Azure subscription that has the network security groups that you want the policy to audit. You can also choose the resource group that has the network security groups. After you make your selections, choose the **Select** button.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/policy-scope.png" alt-text="Screenshot of selecting the scope of the policy in the Azure portal." lightbox="./media/nsg-flow-logs-policy-portal/policy-scope.png":::

1. Select the ellipsis (**...**) next to **Policy definition** to choose the built-in policy that you want to assign. Enter *flow log* in the search box, and then select the **Built-in** filter. From the search results, select **Flow logs should be configured for every network security group**, and then select **Add**.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/audit-policy.png" alt-text="Screenshot of selecting the audit policy in the Azure portal." lightbox="./media/nsg-flow-logs-policy-portal/audit-policy.png":::

1. Enter a name in **Assignment name**, and enter your name in **Assigned by**.

    This policy doesn't require any parameters. It also doesn't contain any role definitions, so you don't need to create role assignments for the managed identity on the **Remediation** tab.

1. Select **Review + create**, and then select **Create**.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/assign-audit-policy.png" alt-text="Screenshot of the Basics tab to assign an audit policy in the Azure portal." lightbox="./media/nsg-flow-logs-policy-portal/assign-audit-policy.png":::

1. Select **Compliance**. Search for the name of your assignment, and then select it.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/audit-policy-compliance.png" alt-text="Screenshot of the Compliance page that shows noncompliant resources based on the audit policy." lightbox="./media/nsg-flow-logs-policy-portal/audit-policy-compliance.png":::

1. Select **Resource compliance** to get a list of all non-compliant network security groups.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/audit-policy-compliance-details.png" alt-text="Screenshot of the Policy compliance page that shows the noncompliant resources based on the audit policy." lightbox="./media/nsg-flow-logs-policy-portal/audit-policy-compliance-details.png":::

## Deploy and configure NSG flow logs using a built-in policy

The **Deploy a flow log resource with target network security group** policy checks all existing network security groups in a scope by checking all Azure Resource Manager objects of type `Microsoft.Network/networkSecurityGroups`. It then checks for linked flow logs via the flow logs property of the network security group. If the property doesn't exist, the policy deploys a flow log.

To assign the *deployIfNotExists* policy:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *policy*. Select **Policy** in the search results.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/portal.png" alt-text="Screenshot of searching for Azure Policy in the Azure portal." lightbox="./media/nsg-flow-logs-policy-portal/portal.png":::

1. Select **Assignments**, and then select **Assign policy**.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/assign-policy.png" alt-text="Screenshot of selecting the button for assigning a policy in the Azure portal.":::

1. Select the ellipsis (**...**) next to **Scope** to choose your Azure subscription that has the network security groups that you want the policy to audit. You can also choose the resource group that has the network security groups. After you make your selections, choose the **Select** button.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/policy-scope.png" alt-text="Screenshot of selecting the scope of the policy in the Azure portal." lightbox="./media/nsg-flow-logs-policy-portal/policy-scope.png":::

1. Select the ellipsis (**...**) next to **Policy definition** to choose the built-in policy that you want to assign. Enter *flow log* in the search box, and then select the **Built-in** filter. From the search results, select **Deploy a flow log resource with target network security group**, and then select **Add**.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/deploy-policy.png" alt-text="Screenshot of selecting the deployment policy in the Azure portal." lightbox="./media/nsg-flow-logs-policy-portal/deploy-policy.png":::

1. Enter a name in **Assignment name**, and enter your name in **Assigned by**.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/assign-deploy-policy-basics.png" alt-text="Screenshot of Basics tab to assign a deployment policy in the Azure portal." lightbox="./media/nsg-flow-logs-policy-portal/assign-deploy-policy-basics.png":::

1. Select **Next** button twice, or select the **Parameters** tab. Then enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | **NSG Region** | Select the region of your network security group that you're targeting with the policy. |
    | **Storage id** | Enter the full resource ID of the storage account. The storage account must be in the same region as the network security group. The format of storage resource ID is `/subscriptions/<SubscriptionID>/resourceGroups/<ResouceGroupName>/providers/Microsoft.Storage/storageAccounts/<StorageAccountName>`. |
    | **Network Watchers RG** | Select the resource group of your Azure Network Watcher instance. |
    | **Network Watcher name** | Enter the name of your Network Watcher instance. |

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/assign-deploy-policy-parameters.png" alt-text="Screenshot of the Parameters tab for assigning a deployment policy in the Azure portal." lightbox="./media/nsg-flow-logs-policy-portal/assign-deploy-policy-parameters.png":::

1. Select **Next** or the **Remediation** tab. Enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | **Create a remediation task** | Select the checkbox if you want the policy to affect existing resources. |
    | **Create a Managed Identity** | Select the checkbox. |
    | **Type of Managed Identity** | Select the type of managed identity that you want to use. |
    | **System assigned identity location** | Select the region of your system assigned identity. |
    | **Scope** | Select the scope of your user-assigned identity. |
    | **Existing user assigned identities** | Select your user-assigned identity. |

    > [!NOTE]
    > You need *Contributor* or *Owner* permission to use this policy.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/assign-deploy-policy-remediation.png" alt-text="Screenshot of the Remediation tab for assigning a deployment policy in the Azure portal." lightbox="./media/nsg-flow-logs-policy-portal/assign-deploy-policy-remediation.png":::

1. Select **Review + create**, and then select **Create**.

1. Select **Compliance**. Search for the name of your assignment, and then select it.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/deploy-policy-compliance.png" alt-text="Screenshot of the Compliance page that shows noncompliant resources based on the deployment policy." lightbox="./media/nsg-flow-logs-policy-portal/audit-policy-compliance.png":::

1. Select **Resource compliance** to get a list of all non-compliant network security groups.

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/deploy-policy-compliance-details.png" alt-text="Screenshot of the Policy compliance page that shows the noncompliant resources." lightbox="./media/nsg-flow-logs-policy-portal/deploy-policy-compliance-details.png":::

1. Leave the policy runs to evaluate and deploy flow logs for all non-compliant network security groups. Then select **Resource compliance** again to check the status of network security groups (you don't see noncompliant network security groups if the policy completed its remediation).

    :::image type="content" source="./media/nsg-flow-logs-policy-portal/deploy-policy-compliance-details-compliant-resources.png" alt-text="Screenshot of the Policy compliance page that shows all resources are compliant." lightbox="./media/nsg-flow-logs-policy-portal/deploy-policy-compliance-details-compliant-resources.png":::

## Next steps

- To learn more about NSG flow logs, see [Flow logs for network security groups](nsg-flow-logs-overview.md).
- To learn about using built-in policies with traffic analytics, see [Manage traffic analytics using Azure Policy](traffic-analytics-policy-portal.md).
- To learn how to use an Azure Resource Manager (ARM) template to deploy flow logs and traffic analytics, see [Configure NSG flow logs using an Azure Resource Manager template](quickstart-configure-network-security-group-flow-logs-from-arm-template.md).
