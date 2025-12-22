---
title: Deployment Overview
titleSuffix: Azure App Configuration
description: Find out about roles, permissions, and authentication modes to use when you manage Azure App Configuration through your infrastructure deployment process.
author: maud-lv
ms.author: haiyiwen
ms.date: 08/13/2025
ms.service: azure-app-configuration
ms.topic: concept-article
ms.custom: subject-armqs, mode-arm, devx-track-bicep
# customer intent: As a developer, I want to become familiar with roles, permissions, and authentication modes for managing Azure App Configuration in deployment so that I can enhance security and accountability and reduce manual effort and errors by integrating my configuration into automated deployment processes.
---

# Deployment

Instead of manually configuring Azure App Configuration, you can treat your configuration as a deployable artifact. App Configuration supports the following methods for reading and managing your configuration during deployment:

- An [Azure Resource Manager template (ARM template)](./quickstart-resource-manager.md)
- [Bicep](./quickstart-bicep.md)
- Terraform

When you use automated deployment processes to manage your configuration, the service principals that perform the deployment need specific roles and permissions to access App Configuration resources and data. This article discusses those required roles and permissions. It also shows you how to configure deployments when you use a private network to access App Configuration.

## Manage App Configuration resources in deployment

You must have Azure Resource Manager permissions to manage App Configuration resources. 

### Azure Resource Manager authorization

Certain Azure role-based access control (Azure RBAC) roles provide the permissions you need to manage App Configuration resources. Specifically, roles that allow the following actions provide these permissions:

- `Microsoft.AppConfiguration/configurationStores/write`
- `Microsoft.AppConfiguration/configurationStores/*`

Built-in roles that allow these actions include the following roles:

- **Owner**
- **Contributor**

For more information about Azure RBAC and Microsoft Entra ID, see [Access Azure App Configuration using Microsoft Entra ID](./concept-enable-rbac.md).

## Manage App Configuration data in deployment

You can manage App Configuration data, such as key-values and snapshots, in deployment. When you manage App Configuration data as a deployable artifact, we recommend that you set your configuration store's Azure Resource Manager authentication mode to **Pass-through**. In this authentication mode:

- Data access requires a combination of data plane and Azure Resource Manager management roles.
- Data access can be attributed to the deployment caller for auditing purposes.

> [!IMPORTANT]
> App Configuration control plane API version `2023-08-01-preview` or later is required to configure the Azure Resource Manager authentication mode by using an [ARM template](./quickstart-resource-manager.md), [Bicep](./quickstart-bicep.md), or the REST API. For REST API examples, see the [azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/appconfiguration/resource-manager/Microsoft.AppConfiguration/AppConfiguration/preview/2025-02-01-preview/examples/ConfigurationStoresCreateWithDataPlaneProxy.json) GitHub repo.

### Azure Resource Manager authentication mode

To use the Azure portal to configure the Azure Resource Manager authentication mode of an App Configuration resource, take the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com), and go to your App Configuration resource.

1. Select **Settings** > **Access settings**.

    :::image type="content" border="true" source="./media/access-settings-blade.png" alt-text="Screenshot of the Azure portal side pane for an App Configuration resource. Under Settings, Access settings is highlighted.":::

1. On the **Access settings** page, go to the **Azure Resource Manager Authentication Mode** section. Next to **Authentication mode**, select an authentication mode. **Pass-through** is the recommended mode.

    :::image type="content" border="true" source="./media/quickstarts/deployment/select-passthrough-authentication-mode.png" alt-text="Screenshot of the Azure Resource Manager Authentication Mode section on the Access settings page. Pass-through is selected as the authentication mode." lightbox="./media/quickstarts/deployment/select-passthrough-authentication-mode.png":::

> [!NOTE]
> The **Local** authentication mode is provided for backward compatibility. There are several limitations to this mode:
> 
> - Proper auditing for accessing data in deployment isn't supported.
> - Key-value data access inside an ARM template, Bicep, and Terraform is disabled if [access key authentication is disabled](./howto-disable-access-key-authentication.md).
> - App Configuration data plane permissions aren't required for accessing data.

### App Configuration authorization

When the Azure Resource Manager authentication mode of your App Configuration resource is **Pass-through**, you must have App Configuration data plane permissions to read and manage App Configuration data in deployment. The resource can also have other baseline management permission requirements.

App Configuration data plane permissions include the following actions:

- `Microsoft.AppConfiguration/configurationStores/*/read`
- `Microsoft.AppConfiguration/configurationStores/*/write`

Built-in roles that allow data plane actions include the following roles:

- **App Configuration Data Owner**: Allows `Microsoft.AppConfiguration/configurationStores/*/read` and `Microsoft.AppConfiguration/configurationStores/*/write` actions, among others
- **App Configuration Data Reader**: Allows `Microsoft.AppConfiguration/configurationStores/*/read` actions

For more information about Azure RBAC and Microsoft Entra ID, see [Access Azure App Configuration using Microsoft Entra ID](./concept-enable-rbac.md).

### Private network access

When you restrict an App Configuration resource to private network access, deployments that access App Configuration data through public networks are blocked. For deployments to succeed when access to an App Configuration resource is restricted to private networks, you must take the following actions:

- Set up an [Azure Resource Management private link](../azure-resource-manager/management/create-private-link-access-portal.md).
- In your App Configuration resource, set the Azure Resource Manager authentication mode to **Pass-through**.
- In your App Configuration resource, enable Azure Resource Manager private network access.
- Run deployments accessing App Configuration data through the configured Azure Resource Manager private link.

When all these criteria are met, deployments can successfully access App Configuration data.

To use the Azure portal to enable Azure Resource Manager private network access for an App Configuration resource, take the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com), and go to your App Configuration resource.

1. Select **Settings** > **Networking**.

    :::image type="content" border="true" source="./media/networking-blade.png" alt-text="Screenshot of the Azure portal side pane for an App Configuration resource. Under Settings, Networking is highlighted.":::

1. Go to the **Private Access** tab, and then select **Enable Azure Resource Manager Private Network Access**. 

    :::image type="content" border="true" source="./media/quickstarts/deployment/enable-azure-resource-manager-private-access.png" alt-text="Screenshot of the Private Access tab on the Networking page. The Enable Azure Resource Manager Private Network Access setting is selected." lightbox="./media/quickstarts/deployment/enable-azure-resource-manager-private-access.png":::

> [!NOTE]
> You can enable Azure Resource Manager private network access only when you use **Pass-through** authentication mode.

## Next steps

To find out how to use an ARM template and Bicep for deployment, see the following quickstarts:

- [Quickstart: Create an Azure App Configuration store by using an ARM template](./quickstart-resource-manager.md)
- [Quickstart: Create an Azure App Configuration store using Bicep](./quickstart-bicep.md)
