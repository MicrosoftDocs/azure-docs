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

Azure App Configuration supports following methods to read and manage your configuration for deployment:
- [ARM template](./quickstart-resource-manager.md)
- [Bicep](./quickstart-bicep.md)
- Terraform

## Manage Azure App Configuration resources in deployment
### Authorization
You must have permissions to manage Azure App Configuration resources. Azure role-based access control (Azure RBAC) roles that provide these permissions include the Microsoft.AppConfiguration/configurationStores/write or Microsoft.AppConfiguration/configurationStores/* action. Built-in roles with this action include:
- The Azure Resource Manager Owner role
- The Azure Resource Manager Contributor role

To learn more about Azure RBAC and Microsoft Entra ID, see [Authorize access to Azure App Configuration using Microsoft Entra ID](./concetp-enable-rbac.md).

## Manage Azure App Configuration data in deployment
Azure App Configuration data, such as key-values and snapshots, can be managed in deployment. It's recommended to configure **Pass-through** ARM authentication mode to require proper Azure App Configuration data plane authorization.

### ARM authentication mode
# [Azure portal](#tab/portal)

To configure ARM authentication mode of Azure App Configuration resource in the Azure portal, follow these steps:

1. Navigate to your Azure App Configuration resource in the Azure portal.
2. Locate the **Access settings** setting under **Settings**.

    :::image type="content" border="true" source="./media/access-settings-blade.png" alt-text="Screenshot showing how to access an Azure App Configuration resources access settings blade":::

3. Select the recommended **Pass-through** authentication mode under **Azure Resource Manager Authentication Mode**.

    :::image type="content" border="true" source="./media/quickstarts/deployment/select-passthrough-authentication-mode.png" alt-text="Screenshot showing pass-through authentication mode being selected under Azure Resource Manager Authentication Mode":::

---

> [!NOTE]
> Local authentication mode is for backward compatibility and has several limitations. It does not support proper auditing for accessing data in deployment. Under local authentication mode, key-value data access inside an ARM template/Bicep/Terraform is disabled if [access key authentication is disabled](./howto-disable-access-key-authentication.md#limitations). Azure App Configuration data plane permissions are not required for accessing data under local authentication mode.

### Authorization
In addition to the permissions required for managing Azure App Configuration resource, you must have data plane permissions to read and manage Azure App Configuration data in deployment under pass-through mode. Azure App Configuration data plane permissions includes Microsoft.AppConfiguration/configurationStores/keyValues/read and Microsoft.AppConfiguration/configurationStores/snapshots/read. Built-in roles with this action include:
- App Configuration Data Owner
- App Configuration Data Reader

To learn more about Azure RBAC and Microsoft Entra ID, see [Authorize access to Azure App Configuration using Microsoft Entra ID](./concetp-enable-rbac.md)

### ARM private access
[Azure Resource Management Private Link](../../includes/resource-manager-create-rmpl.md) can be set up to restrict access for managing resources in your virtual network. Azure App Configuration supports ARM Private Link access to the App Configuration data with pass-through authentication mode and ARM private access enabled. 

# [Azure portal](#tab/portal)

To configure ARM private access of Azure App Configuration resource in the Azure portal, follow these steps:

1. Navigate to your Azure App Configuration resource in the Azure portal.
2. Locate the **Networking** setting under **Settings**.

    :::image type="content" border="true" source="./media/networking-blade.png" alt-text="Screenshot showing how to access an Azure App Configuration resources networking blade":::

3. Check **Enable Azure Resource Manager Private Access** under **Private Access**.

    :::image type="content" border="true" source="./media/quickstarts/deployment/enable-arm-private-access.png" alt-text="Screenshot showing pass-through authentication mode being selected under Azure Resource Manager Authentication Mode":::

> [!NOTE]
> ARM private access can only be enabled with pass-through authentication mode.

## Next steps

To learn about adding feature flag and Key Vault reference to an App Configuration store, check out the ARM template examples.

- [app-configuration-store-ff](https://azure.microsoft.com/resources/templates/app-configuration-store-ff/)
- [app-configuration-store-keyvaultref](https://azure.microsoft.com/resources/templates/app-configuration-store-keyvaultref/)
