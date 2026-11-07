---
title: Configure authentication for Azure Managed Grafana
description: Learn how Azure Managed Grafana authenticates to data sources by using a managed identity or an app registration and service principal.
ms.service: azure-managed-grafana
ms.topic: how-to
author: maud-lv
ms.author: malev
ms.date: 09/22/2026
ms.custom: sfi-image-nochange
--- 

# Configure authentication for Azure Managed Grafana

Azure Managed Grafana can authenticate to data sources that support Microsoft Entra authentication by using a system-assigned managed identity, a user-assigned managed identity, or an app registration and its service principal. This article explains the authentication options and shows you how to select the managed identity for your workspace.

Authentication identifies Azure Managed Grafana to the data source, but it doesn't grant access to monitoring data. After you configure an authentication method, [grant the identity access to the Azure Monitor data](./how-to-permissions.md) that your dashboards need. Then [configure your data source](./how-to-data-source-plugins-managed-identity.md) to use that authentication method.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Managed Grafana workspace. [Create an Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md).
- Permission to update the Azure Managed Grafana workspace, such as [Contributor](../role-based-access-control/built-in-roles/privileged.md#contributor).
- To use a user-assigned managed identity, you need permission to assign it to the workspace, such as the [Managed Identity Operator](../role-based-access-control/built-in-roles/identity.md#managed-identity-operator) role on the identity.

## Use a system-assigned managed identity

The system-assigned managed identity is the default authentication method in Azure Managed Grafana. The managed identity authenticates with Microsoft Entra ID, so you don't need to store credentials. When you create a workspace in the Azure portal, the identity is enabled by default. If the identity is disabled, you can enable it later.

To enable a system-assigned managed identity:

1. Select  **Settings** > **Identity**.
1. In the **System assigned** tab, set the status for **System assigned** to **On**.

    > [!NOTE]
    > Assigning multiple managed identities to a single Azure Managed Grafana resource isn't possible. If a user-assigned managed identity is already assigned to the Azure Managed Grafana resource, you must first remove the assignment from the **User assigned** tab before you can enable the system-assigned managed identity.
    >
    > Disabling a system-assigned managed identity deletes that identity. If you enable the system-assigned managed identity again, Azure creates a new identity with a different principal ID. Existing role assignments don't apply to the new identity.

    :::image type="content" source="media/authentication/system-assigned-managed-identity.png" alt-text="Screenshot of the Azure portal. Enabling a system-assigned managed identity.":::

1. Select **Save**.

Next, [grant the identity access to Azure Monitor data](./how-to-permissions.md).

## Use a user-assigned managed identity

User-assigned managed identities enable Azure resources to authenticate to cloud services without storing credentials in code. This type of managed identity is created as a standalone Azure resource, and has its own lifecycle. A single user-assigned managed identity can be shared across multiple resources. 

To assign a user-assigned managed identity:

1. Select  **Settings** > **Identity**.
1. In the **User assigned** tab, select **Add**.

    > [!NOTE]
    > Assigning multiple managed identities to a single Azure Managed Grafana resource isn't possible. You can only use one managed identity per resource. If a system-assigned identity is enabled, you must first disable it from the **System assigned** tab before you can enable the user-assigned identity. 

1. In the side panel, select a subscription and an identity, then select **Add**.

    :::image type="content" source="media/authentication/user-assigned-managed-identity.png" alt-text="Screenshot of the Azure portal. Enabling a user-assigned managed identity.":::

1. Select **Save**.

    > [!NOTE]
    > You can only assign one user-assigned managed identity per Azure Managed Grafana instance.

Next, [grant the identity access to Azure Monitor data](./how-to-permissions.md).

## Use a service principal for a data source

When you register an application in Microsoft Entra ID, Azure creates a service principal that represents the application in your tenant. Azure Managed Grafana can use this service principal to authenticate an individual data source by using the app registration's tenant ID, client ID, and client secret.

Unlike a managed identity, a service principal isn't assigned to the Azure Managed Grafana workspace. In the data source settings, select **App Registration** and enter the app registration details. You can use different app registrations for different data sources.

To use this authentication method, [configure the data source](./how-to-data-source-plugins-managed-identity.md), and then [grant the service principal access to Azure Monitor data](./how-to-permissions.md). Use the service principal object ID when you create the role assignment, not the application (client) ID.

## Related content

- [Troubleshoot common Azure Managed Grafana issues](./troubleshoot-managed-grafana.md)
- [Grant users and identities access to Azure Managed Grafana](./how-to-manage-access-permissions-users-identities.md)
- [Manage data sources in Azure Managed Grafana](./how-to-data-source-plugins-managed-identity.md)
- [Authenticate to Azure Managed Grafana data plane APIs with Microsoft Entra ID](./how-to-authenticate-data-plane-api.md)