---
title: How to modify access permissions to Azure Monitor
description: Learn how to manually set up permissions that allow your Azure Managed Grafana Preview workspace to access a data source
author: maud-lv 
ms.author: malev 
ms.service: managed-grafana 
ms.topic: how-to 
ms.date: 3/31/2022 
---

# How to modify access permissions to Azure Monitor

By default, when a Grafana workspace is created, Azure Managed Grafana grants it the Monitoring Reader role for all Azure Monitor data and Log Analytics resources within a subscription.

This means that the new Grafana workspace can access and search all monitoring data in the subscription, including viewing the Azure Monitor metrics and logs from all resources, and any logs stored in Log Analytics workspaces in the subscription.

In this article, you'll learn how to manually edit permissions for a specific resource.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet).
- An Azure Managed Grafana workspace. If you don't have one yet, [create a workspace](./quickstart-managed-grafana-portal.md).
- An Azure resource with monitoring data and write permissions, such as [User Access Administrator](../../articles/role-based-access-control/built-in-roles.md#user-access-administrator) or [Owner](../../articles/role-based-access-control/built-in-roles.md#owner)

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Edit Azure Monitor permissions for an Azure Managed Grafana workspace

To change permissions for a specific resource, follow these steps:

1. Open a resource that contains the monitoring data you want to retrieve. In this example, we're configuring an Application Insights resource.
1. Select **Access Control (IAM)**.
1. Under **Grant access to this resource**, select **Add role assignment**.

   :::image type="content" source="media/managed-grafana-how-to-permissions-iam.png" alt-text="Screenshot of the Azure platform to add role assignment in App Insights.":::

1. The portal lists various roles you can give to your Managed Grafana resource. Select a role. For instance, **Monitoring Reader**. Select this role.
1. Click **Next**.
      :::image type="content" source="media/managed-grafana-how-to-permissions-role.png" alt-text="Screenshot of the Azure platform and choose Monitor Reader.":::

1. For **Assign access to**, select **Managed Identity**.
1. Click **Select members**.

      :::image type="content" source="media/managed-grafana-how-to-permissions-members.png" alt-text="Screenshot of the Azure platform selecting members.":::

1. Select the **Subscription** containing your Managed Grafana workspace
1. Select a **Managed identity** from the options in the dropdown list
1. Select your Managed Grafana workspace from the list.
1. Click **Select** to confirm

      :::image type="content" source="media/managed-grafana-how-to-permissions-identity.png" alt-text="Screenshot of the Azure platform selecting the workspace.":::

1. Click **Next**, then **Review + assign** to confirm the application of the new permission

## Next steps

> [!div class="nextstepaction"]
> [How to configure data sources for Azure Managed Grafana](./how-to-data-source-plugins-managed-identity.md)