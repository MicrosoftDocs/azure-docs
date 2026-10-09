---
title: Grant Azure Monitor access to Azure Managed Grafana
description: Learn how to authorize the identity used by an Azure Managed Grafana data source to read Azure Monitor data.
author: maud-lv 
ms.author: malev 
ms.service: azure-managed-grafana
ms.topic: how-to 
ms.date: 09/22/2026
ms.custom:
  - engagement-fy23
#customer intent: I want to grant the Azure Monitor role to an Azure Managed Grafana workspace so that I can start monitoring an Azure service in Grafana.
---

# Grant Azure Monitor access to Azure Managed Grafana

Azure Managed Grafana can use its system-assigned managed identity, a user-assigned managed identity, or an app registration to authenticate to an Azure Monitor data source. The selected identity also needs an Azure role that authorizes it to read the monitoring data.

During workspace creation in the Azure portal, **Monitoring Reader** at the subscription scope is selected by default for the system-assigned managed identity. The role assignment is created only if the person creating the workspace has permission to assign Azure roles at that scope.

If the role wasn't assigned during creation, or if you want to use a narrower scope, follow the steps in this article. Grant access at the smallest scope that contains the monitoring data your dashboards need. You can assign the role at the subscription, resource group, or individual resource scope.

> [!NOTE]
> The **Monitoring Reader** role provides access to Azure Monitor metrics and logs. To query Prometheus data in an Azure Monitor workspace, grant **Monitoring Data Reader** instead. For more information, see [Connect an Azure Monitor workspace](./how-to-connect-azure-monitor-workspace.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Managed Grafana workspace. If you don't have one yet, [create an Azure Managed Grafana workspace](./quickstart-managed-grafana-portal.md).
- An Azure resource that contains the monitoring data you want to visualize.
- The object ID of the identity used by your Azure Monitor data source:
  - For managed identity authentication, [configure the system-assigned or user-assigned managed identity](./how-to-authentication-permissions.md).
  - For app registration authentication, use the object ID of the app registration's service principal, not its application (client) ID.
- Permission to create role assignments at the selected scope, such as [Role Based Access Control Administrator](../role-based-access-control/built-in-roles/privileged.md#role-based-access-control-administrator), [User Access Administrator](../role-based-access-control/built-in-roles/privileged.md#user-access-administrator), or [Owner](../role-based-access-control/built-in-roles/privileged.md#owner).
- To use the Azure CLI instructions, [Azure CLI](/cli/azure/install-azure-cli) version 2.75.0 or later. The `amg` extension installs automatically when you first run an `az grafana` command.

## Sign in to Azure

For the portal instructions, sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

For the Azure CLI instructions, sign in by running `az login`.

## Edit Azure Monitor permissions

Use either the Azure portal or Azure CLI to assign a role to the identity used by your Azure Monitor data source.

### [Portal](#tab/azure-portal)

1. Open the subscription, resource group, or resource that contains the monitoring data you want Azure Managed Grafana to access.

1. Select **Access control (IAM)**.
1. Select **Add** > **Add role assignment**.

    :::image type="content" source="./media/permissions/permissions-iam.png" alt-text="Screenshot of the Azure platform to add role assignment in App Insights.":::

1. On the **Role** tab, select **Monitoring Reader**, and then select **Next**.

    :::image type="content" source="./media/permissions/permissions-role.png" alt-text="Screenshot of the Azure platform to choose the Monitoring Reader role.":::
1. On the **Members** tab, select the member type for your data source identity:
    - For a system-assigned or user-assigned managed identity, select **Managed identity**, and then select **Select members**.
    - For an app registration, select **User, group, or service principal**, and then select **Select members**.

    :::image type="content" source="media/permissions/permissions-members.png" alt-text="Screenshot of the Azure platform selecting members.":::

1. Select the identity used by your Azure Monitor data source:
    - For the system-assigned identity, select **Azure Managed Grafana**, and then select your workspace.
    - For a user-assigned identity, select **User-assigned managed identity**, and then select the identity.
    - For an app registration, search for and select its name.
1. Select **Select**.

    :::image type="content" source="media/permissions/permissions-managed-identities.png" alt-text="Screenshot of the Azure platform selecting the workspace.":::

1. Select **Review + assign**, and then select **Review + assign** again to create the assignment.

To verify the assignment, return to **Access control (IAM)**, select **Role assignments**, and confirm that your workspace has the **Monitoring Reader** role.


### [Azure CLI](#tab/azure-cli)

Set `monitoringDataScope` to the resource ID of the subscription, resource group, or resource that contains the monitoring data your dashboards need. Set `assigneeObjectId` to the object ID of the managed identity or app registration used by your Azure Monitor data source. The commands assign and verify the **Monitoring Reader** role at the monitoring data scope.

```azurecli
monitoringDataScope="<monitoring-data-scope>"
assigneeObjectId="<identity-object-id>"

az role assignment create \
  --assignee-object-id "$assigneeObjectId" \
  --assignee-principal-type ServicePrincipal \
  --role "Monitoring Reader" \
  --scope "$monitoringDataScope"

az role assignment list \
  --assignee-object-id "$assigneeObjectId" \
  --fill-principal-name false \
  --role "Monitoring Reader" \
  --scope "$monitoringDataScope" \
  --output table
```

For more information, see [Assign Azure roles using Azure CLI](../role-based-access-control/role-assignments-cli.md).

---

For more information about using Azure Managed Grafana with Azure Monitor, see [Use Azure Managed Grafana with Azure Monitor](/azure/azure-monitor/visualize/visualize-use-managed-grafana-how-to).

## Related content

- [How to configure data sources for Azure Managed Grafana](./how-to-data-source-plugins-managed-identity.md)
- [Configure authentication for Azure Managed Grafana](./how-to-authentication-permissions.md)
- [Grant users and identities access to Azure Managed Grafana](./how-to-manage-access-permissions-users-identities.md)
- [Troubleshoot common Azure Managed Grafana issues](./troubleshoot-managed-grafana.md)
