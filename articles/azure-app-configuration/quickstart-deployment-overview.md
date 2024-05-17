---
title: Deployment overview
titleSuffix: Azure App Configuration
description: Learn how to use Azure App Configuration in deployment.
author: maud-lv
ms.author: haiyiwen
ms.date: 03/15/2024
ms.service: azure-app-configuration
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-bicep
---

# Deployment

Azure App Configuration supports the following methods to read and manage your configuration during deployment:

- [ARM template](./quickstart-resource-manager.md)
- [Bicep](./quickstart-bicep.md)
- Terraform

## Manage Azure App Configuration resources in deployment

### Azure Resource Manager Authorization

You must have Azure Resource Manager permissions to manage Azure App Configuration resources. Azure role-based access control (Azure RBAC) roles that provide these permissions include the Microsoft.AppConfiguration/configurationStores/write or Microsoft.AppConfiguration/configurationStores/* action. Built-in roles with this action include:

- Owner
- Contributor

To learn more about Azure RBAC and Microsoft Entra ID, see [Authorize access to Azure App Configuration using Microsoft Entra ID](./concept-enable-rbac.md).

## Manage Azure App Configuration data in deployment

Azure App Configuration data, such as key-values and snapshots, can be managed in deployment. When managing App Configuration data using this method, it's recommended to set your configuration store's Azure Resource Manager authentication mode to **Pass-through**. This authentication mode ensures that data access requires a combination of data plane and Azure Resource Manager management roles and ensuring that data access can be properly attributed to the deployment caller for auditing purpose.

> [!IMPORTANT]
> App Configuration control plane API version `2023-08-01-preview` or later is required to configure **Azure Resource Manager Authentication Mode** using [ARM template](./quickstart-resource-manager.md), [Bicep](./quickstart-bicep.md), or REST API. See the [REST API examples](https://github.com/Azure/azure-rest-api-specs/blob/main/specification/appconfiguration/resource-manager/Microsoft.AppConfiguration/preview/2023-08-01-preview/examples/ConfigurationStoresCreateWithDataPlaneProxy.json).

### Azure Resource Manager authentication mode

# [Azure portal](#tab/portal)

To configure the Azure Resource Manager authentication mode of an Azure App Configuration resource in the Azure portal, follow these steps:

1. Navigate to your Azure App Configuration resource in the Azure portal
2. Locate the **Access settings** setting under **Settings**

    :::image type="content" border="true" source="./media/access-settings-blade.png" alt-text="Screenshot showing how to access an Azure App Configuration resources access settings blade.":::

3. Select the recommended **Pass-through** authentication mode under **Azure Resource Manager Authentication Mode**

    :::image type="content" border="true" source="./media/quickstarts/deployment/select-passthrough-authentication-mode.png" alt-text="Screenshot showing pass-through authentication mode being selected under Azure Resource Manager Authentication Mode.":::

---

> [!NOTE]
> Local authentication mode is for backward compatibility and has several limitations. It does not support proper auditing for accessing data in deployment. Under local authentication mode, key-value data access inside an ARM template/Bicep/Terraform is disabled if [access key authentication is disabled](./howto-disable-access-key-authentication.md). Azure App Configuration data plane permissions are not required for accessing data under local authentication mode.

### Azure App Configuration Authorization

When your App Configuration resource has its Azure Resource Manager authentication mode set to **Pass-through**, you must have Azure App Configuration data plane permissions to read and manage Azure App Configuration data in deployment. This requirement is in addition to baseline management permission requirements of the resource. Azure App Configuration data plane permissions include Microsoft.AppConfiguration/configurationStores/\*/read and Microsoft.AppConfiguration/configurationStores/\*/write. Built-in roles with this action include:

- App Configuration Data Owner
- App Configuration Data Reader

To learn more about Azure RBAC and Microsoft Entra ID, see [Authorize access to Azure App Configuration using Microsoft Entra ID](./concept-enable-rbac.md).

### Private network access

When an App Configuration resource is restricted to private network access, deployments accessing App Configuration data through public networks will be blocked. To enable successful deployments when access to an App Configuration resource is restricted to private networks the following actions must be taken:

- [Azure Resource Management Private Link](../azure-resource-manager/management/create-private-link-access-portal.md) must be set up
- The App Configuration resource must have Azure Resource Manager authentication mode set to **Pass-through**
- The App Configuration resource must have Azure Resource Manager private network access enabled
- Deployments accessing App Configuration data must run through the configured Azure Resource Manager private link

If all of these criteria are met, then deployments accessing App Configuration data will be successful.

# [Azure portal](#tab/portal)

To enable Azure Resource Manager private network access for an Azure App Configuration resource in the Azure portal, follow these steps:

1. Navigate to your Azure App Configuration resource in the Azure portal
2. Locate the **Networking** setting under **Settings**

    :::image type="content" border="true" source="./media/networking-blade.png" alt-text="Screenshot showing how to access an Azure App Configuration resources networking blade.":::

3. Check **Enable Azure Resource Manager Private Access** under **Private Access**

    :::image type="content" border="true" source="./media/quickstarts/deployment/enable-azure-resource-manager-private-access.png" alt-text="Screenshot showing Enable Azure Resource Manager Private Access is checked.":::

> [!NOTE]
> Azure Resource Manager private network access can only be enabled under **Pass-through** authentication mode.

---

## Next steps

To learn about deployment using ARM template and Bicep, check the documentations linked below.

- [Quickstart: Create an Azure App Configuration store by using an ARM template](./quickstart-resource-manager.md)
- [Quickstart: Create an Azure App Configuration store using Bicep](./quickstart-bicep.md)
