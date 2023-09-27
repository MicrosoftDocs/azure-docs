---
title: How to modify access permissions to Azure Monitor
description: Learn how to manually set up permissions that allow your Azure Managed Grafana instance to access a data source
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.custom: engagement-fy23
ms.topic: how-to 
ms.date: 02/23/2023 
---

# How to modify access permissions to Azure Monitor

By default, when a Grafana instance is created, Azure Managed Grafana grants it the Monitoring Reader role for all Azure Monitor data and Log Analytics resources within a subscription.

This means that the new Grafana instance can access and search all monitoring data in the subscription. It can view the Azure Monitor metrics and logs from all resources, and any logs stored in Log Analytics workspaces in the subscription.

In this article, learn how to manually grant permission for Azure Managed Grafana to access an Azure resource using a managed identity.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An Azure Managed Grafana instance. If you don't have one yet, [create an Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md).
- An Azure resource with monitoring data and write permissions, such as [User Access Administrator](../../articles/role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../../articles/role-based-access-control/built-in-roles.md#owner)

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Edit Azure Monitor permissions

To edit permissions for a specific resource, follow these steps.

### [Portal](#tab/azure-portal)

1. Open a resource that contains the monitoring data you want to retrieve. In this example, we're configuring an Application Insights resource.
1. Select **Access Control (IAM)**.
1. Under **Grant access to this resource**, select **Add role assignment**.

   :::image type="content" source="./media/permissions/permissions-iam.png" alt-text="Screenshot of the Azure platform to add role assignment in App Insights.":::

1. The portal lists all the roles you can give to your Azure Managed Grafana resource. Select a role. For instance, **Monitoring Reader**, and select **Next**.
      :::image type="content" source="./media/permissions/permissions-role.png" alt-text="Screenshot of the Azure platform and choose Monitor Reader.":::

1. For **Assign access to**, select **Managed identity**.
1. Click on **Select members**.

      :::image type="content" source="media/permissions/permissions-members.png" alt-text="Screenshot of the Azure platform selecting members.":::

1. Select the **Subscription** containing your Managed Grafana instance.
1. For **Managed identity**, select **Azure Managed Grafana**.
1. Select one or several Managed Grafana instances.
1. Click **Select** to confirm

      :::image type="content" source="media/permissions/permissions-managed-identities.png" alt-text="Screenshot of the Azure platform selecting the instance.":::

1. Select **Next**, then **Review + assign** to confirm the assignment of the new permission.

For more information about how to use Managed Grafana with Azure Monitor, go to [Monitor your Azure services in Grafana](../azure-monitor/visualize/grafana-plugin.md).

### [Azure CLI](#tab/azure-cli)

Assign a role assignment using the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command.

In the code below, replace the following placeholders:

- `<assignee>`: If its --assignee parameter then enter the assignee's object ID or user sign-in name or service principal name. If its --assignee-object-id parameter then enter object IDs for users or groups or service principals or managed identities. For managed identities use the principal ID. For service principals, use the object ID and not the app ID. For more information, refer [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command.
- `<roleNameOrId>`: Enter the role's name or ID. For Monitoring Reader, enter `Monitoring Reader` or `43d0d8ad-25c7-4714-9337-8ba259a9fe05`.
- `<scope>`: Enter the full ID of the resource Azure Managed Grafana needs access to.

```azurecli
az role assignment create --assignee "<assignee>" \
--role "<roleNameOrId>" \
--scope "<scope>"
```

or

```azurecli
az role assignment create --assignee-object-id "<assignee>" --assignee-principal-type "<ForeignGroup / Group / ServicePrincipal / User>" \
--role "<roleNameOrId>" \
--scope "<scope>"
```

Example: assigning permission for an Azure Managed Grafana instance to access an Application Insights resource using a managed identity.

```azurecli
az role assignment create --assignee-object-id "abcdef01-2345-6789-0abc-def012345678" --assignee-principal-type "ServicePrincipal" \
--role "Monitoring Reader" \
--scope "/subscriptions/abcdef01-2345-6789-0abc-def012345678/resourcegroups/my-rg/providers/microsoft.insights/components/myappinsights/"
```

For more information about assigning Azure roles using the Azure CLI, refer to the [Role based access control documentation](../role-based-access-control/role-assignments-cli.md).

---

## Next steps

> [!div class="nextstepaction"]
> [How to configure data sources for Azure Managed Grafana](./how-to-data-source-plugins-managed-identity.md)
