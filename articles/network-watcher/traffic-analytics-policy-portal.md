---
title: Manage traffic analytics using Azure Policy 
titleSuffix: Azure Network Watcher
description: Learn how to use Azure built-in policies to manage the deployment of Azure Network Watcher traffic analytics.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 04/30/2023
ms.author: halkazwini
ms.custom: template-how-to, engagement-fy23
---

# Manage traffic analytics using Azure Policy 

Azure Policy helps to enforce organizational standards and to assess compliance at-scale. Common use cases for Azure Policy include implementing governance for resource consistency, regulatory compliance, security, cost, and management. In this article, you learn how to use three built-in policies available for [Azure Network Watcher traffic analytics](./traffic-analytics.md) to manage your setup.

To learn more about Azure policy, see [What is Azure Policy?](../governance/policy/overview.md) and [Quickstart: Create a policy assignment to identify non-compliant resources](../governance/policy/assign-policy-portal.md).

## <a name="audit"></a>Audit flow logs using a built-in policy

**Network Watcher flow logs should have traffic analytics enabled** policy audits all existing Azure Resource Manager objects of type `Microsoft.Network/networkWatchers/flowLogs` and checks if traffic analytics is enabled via the `networkWatcherFlowAnalyticsConfiguration.enabled` property of the flow logs resource. It flags the flow logs resource that have the property set to false.

To assign policy and audit your flow logs, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter *policy*. Select **Policy** in the search results. 

    :::image type="content" source="./media/traffic-analytics-policy-portal/azure-portal.png" alt-text="Screenshot of searching for policy in the Azure portal." lightbox="./media/traffic-analytics-policy-portal/azure-portal.png":::

1. Select **Assignments**, then select on **Assign Policy**.

    :::image type="content" source="./media/traffic-analytics-policy-portal/assign-policy.png" alt-text="Screenshot of selecting Assign policy button in the Azure portal.":::

1. Select the ellipsis **...** next to **Scope** to choose your Azure subscription that has the flow logs that you want the policy to audit. You can also choose the resource group that has the flow logs. After you made your selections, select **Select** button.

    :::image type="content" source="./media/traffic-analytics-policy-portal/policy-scope.png" alt-text="Screenshot of selecting the scope of the policy in the Azure portal." lightbox="./media/traffic-analytics-policy-portal/policy-scope.png":::

1. Select the ellipsis **...** next to **Policy definition** to choose the built-in policy that you want to assign. Enter *traffic analytics* in the search box, and select **Built-in** filter. From the search results, select **Network Watcher flow logs should have traffic analytics enabled** and then select **Add**.

    :::image type="content" source="./media/traffic-analytics-policy-portal/audit-policy.png" alt-text="Screenshot of selecting the audit policy in the Azure portal." lightbox="./media/traffic-analytics-policy-portal/audit-policy.png":::

1. Enter a name in **Assignment name** and your name in **Assigned by**. This policy doesn't require any parameters.

1. Select **Review + create** and then **Create**.

    :::image type="content" source="./media/traffic-analytics-policy-portal/assign-audit-policy.png" alt-text="Screenshot of Basics tab to assign an audit policy in the Azure portal.":::

    > [!NOTE]
    > This policy doesn't require any parameters. It also doesn't contain any role definitions so you don't need create role assignments for the managed identity in the **Remediation** tab.

1. Select **Compliance**. Search for the name of your assignment and then select it.

    :::image type="content" source="./media/traffic-analytics-policy-portal/audit-policy-compliance.png" alt-text="Screenshot of Compliance page of Azure Policy in the Azure portal." lightbox="./media/traffic-analytics-policy-portal/audit-policy-compliance.png":::

1. **Resource compliance** list all non-compliant flow logs.

    :::image type="content" source="./media/traffic-analytics-policy-portal/audit-policy-compliance-details.png" alt-text="Screenshot of the audit policy compliance page in the Azure portal." lightbox="./media/traffic-analytics-policy-portal/audit-policy-compliance-details.png":::

## Deploy and configure traffic analytics using *deployIfNotExists* policies 

There are two *deployIfNotExists* policies available to configure NSG flow logs:

- **Configure network security groups to use specific workspace, storage account and flow log retention policy for traffic analytics**: This policy flags the network security group that doesn't have traffic analytics enabled. For a flagged network security group, either the corresponding NSG flow logs resource doesn't exist or the NSG flow logs resource exist but traffic analytics isn't enabled on it. You can create a *remediation* task if you want the policy to affect existing resources.
 
    Remediation can be assigned while assigning policy or after policy is assigned and evaluated. Remediation enables traffic analytics on all the flagged resources with the provided parameters. If a network security group already has flow logs enabled into a particular storage ID but it doesn't have traffic analytics enabled, then remediation enables traffic analytics on this network security group with the provided parameters. If the storage ID provided in the parameters is different from the one enabled for flow logs, then the latter gets overwritten with the provided storage ID in the remediation task. If you don't want to overwrite, use **Configure network security groups to enable traffic analytics** policy.

- **Configure network security groups to enable traffic analytics**: This policy is similar to the previous policy except that during remediation, it doesn't overwrite flow logs settings on the flagged network security groups that have flow logs enabled but traffic analytics disabled with the parameter provided in the policy assignment.

> [!NOTE]
> Network Watcher is a regional service so the two *deployIfNotExists* policies will apply to network security groups that exist in a particular region. For network security groups in a different region, create another policy assignment in that region.

To assign any of the *deployIfNotExists* two policies, repeat steps 1-4 from the [previous section](#audit) and then continue with the following steps: 

1. Select the ellipsis **...** next to **Policy definition** to choose the built-in policy that you want to assign. Enter *traffic analytics* in the search box, and select **Built-in** filter. From the search results, select **Network Watcher flow logs should have traffic analytics enabled** and then select **Add**.

    :::image type="content" source="./media/traffic-analytics-policy-portal/deploy-policy.png" alt-text="Screenshot of selecting a deployIfNotExists policy in the Azure portal." lightbox="./media/traffic-analytics-policy-portal/deploy-policy.png":::

1. Enter a name in **Assignment name** and your name in **Assigned by**.

    :::image type="content" source="./media/traffic-analytics-policy-portal/assign-deploy-policy-basics.png" alt-text="Screenshot of the Basics tab of assigning a deploy policy in the Azure portal." lightbox="./media/traffic-analytics-policy-portal/assign-deploy-policy-basics.png":::

1. Select **Next** button twice or select **Parameters** tab. Enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | Effect | Select **DeployIfNotExists**. |
    | Network security group region | Select the region of your network security group that you're targeting with the policy. |
    | Storage resource ID | Enter the full resource ID of the storage account. The storage account must be in the same region as the network security group. The format of storage resource ID is: `/subscriptions/<SubscriptionID>/resourceGroups/<ResouceGroupName>/providers/Microsoft.Storage/storageAccounts/<StorageAccountName>`. |
    | Traffic analytics processing interval in minutes | Select the frequency at which processed logs are pushed into the workspace. Currently available values are 10 and 60 minutes. Default value is 60 minutes. |
    | Workspace resource ID | Enter the full resource ID of the workspace where traffic analytics has to be enabled. The format of workspace resource ID is: `/subscriptions/<SubscriptionID>/resourcegroups/<ResouceGroupName>/providers/microsoft.operationalinsights/workspaces/<WorkspaceName>`. |
    | Workspace region | Select the region of your traffic analytics workspace. |
    | Workspace ID | Enter your traffic analytics workspace ID. |
    | Network Watcher resource group | Select the resource group of your Network Watcher. |
    | Network Watcher name | Enter the name of your Network Watcher. |
    | Number of days to retain flow logs | Enter the number of days for which flow logs data will be retained in the storage account. If you want to retain data forever, enter *0*.|

    > [!NOTE]
    > The region of traffic analytics workspace doesn't have to be the same as the region of targeted network security group.

    :::image type="content" source="./media/traffic-analytics-policy-portal/assign-deploy-policy-parameters.png" alt-text="Screenshot of the Parameters tab of assigning a deploy policy in the Azure portal." lightbox="./media/traffic-analytics-policy-portal/assign-deploy-policy-parameters.png":::

1. Select **Next** or **Remediation** tab. Enter or select the following values:

    | Setting | Value |
    | --- | --- |
    | Create Remediation task | Check the box if you want the policy to affect existing resources. |
    | Create a Managed Identity | Check the box. |
    | Type of Managed Identity | Select the type of Managed Identity that you want to use. |
    | System assigned identity location | Select the region of your Managed Identity. |

    :::image type="content" source="./media/traffic-analytics-policy-portal/assign-deploy-policy-remediation.png" alt-text="Screenshot of the Remediation tab of assigning a deploy policy in the Azure portal." lightbox="./media/traffic-analytics-policy-portal/assign-deploy-policy-remediation.png":::

1. Select **Review + create** and then **Create**.

1. Select **Compliance**. Search for the name of your assignment and then select it.

    :::image type="content" source="./media/traffic-analytics-policy-portal/audit-policy-compliance.png" alt-text="Screenshot of Compliance page of Azure Policy." lightbox="./media/traffic-analytics-policy-portal/audit-policy-compliance.png":::

1. **Resource compliance** list all non-compliant flow logs.

    :::image type="content" source="./media/traffic-analytics-policy-portal/audit-policy-compliance-details.png" alt-text="Screenshot of the audit policy compliance page in the Azure portal." lightbox="./media/traffic-analytics-policy-portal/audit-policy-compliance-details.png"::: 

## Troubleshooting

Remediation task fails with `PolicyAuthorizationFailed` error code: sample error example *The policy assignment `/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/DummyRG/providers/Microsoft.Authorization/policyAssignments/b67334e8770a4afc92e7a929/` resource identity doesn't have the necessary permissions to create deployment.*

In such scenario, the managed identity must be manually granted access. Go to the appropriate subscription/resource group (containing the resources provided in the policy parameters) and grant contributor access to the managed identity created by the policy. In the previous example, *b67334e8770a4afc92e7a929* has to be as the contributor.


## Next steps 

- Learn about [NSG flow logs built-in policies](./nsg-flow-logs-policy-portal.md)
- Learn more about [traffic analytics](./traffic-analytics.md)
