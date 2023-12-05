---
title: Disable access key authentication for an Azure App Configuration instance
titleSuffix: Azure App Configuration
description: Learn how to disable access key authentication for an Azure App Configuration instance
ms.service: azure-app-configuration
author: jimmyca15
ms.author: jimmyca
ms.topic: how-to
ms.date: 5/14/2021
---

# Disable access key authentication for an Azure App Configuration instance

Every request to an Azure App Configuration resource must be authenticated. By default, requests can be authenticated with either Microsoft Entra credentials, or by using an access key. Of these two types of authentication schemes, Microsoft Entra ID provides superior security and ease of use over access keys, and is recommended by Microsoft. To require clients to use Microsoft Entra ID to authenticate requests, you can disable the usage of access keys for an Azure App Configuration resource.

When you disable access key authentication for an Azure App Configuration resource, any existing access keys for that resource are deleted. Any subsequent requests to the resource using the previously existing access keys will be rejected. Only requests that are authenticated using Microsoft Entra ID will succeed. For more information about using Microsoft Entra ID, see [Authorize access to Azure App Configuration using Microsoft Entra ID](./concept-enable-rbac.md).

## Disable access key authentication

Disabling access key authentication will delete all access keys. If any running applications are using access keys for authentication they will begin to fail once access key authentication is disabled. Enabling access key authentication again will generate a new set of access keys and any applications attempting to use the old access keys will still fail.

> [!WARNING]
> If any clients are currently accessing data in your Azure App Configuration resource with access keys, then Microsoft recommends that you migrate those clients to [Microsoft Entra ID](./concept-enable-rbac.md) before disabling access key authentication.
> Additionally, it is recommended to read the [limitations](#limitations) section below to verify the limitations won't affect the intended usage of the resource.

# [Azure portal](#tab/portal)

To disallow access key authentication for an Azure App Configuration resource in the Azure portal, follow these steps:

1. Navigate to your Azure App Configuration resource in the Azure portal.
2. Locate the **Access keys** setting under **Settings**.

    :::image type="content" border="true" source="./media/access-keys-blade.png" alt-text="Screenshot showing how to access an Azure App Configuration resources access key blade":::

3. Set the **Enable access keys** toggle to **Disabled**.

    :::image type="content" border="true" source="./media/disable-access-keys.png" alt-text="Screenshot showing how to disable access key authentication for Azure App Configuration":::

# [Azure CLI](#tab/azure-cli)

The capability to disable access key authentication using the Azure CLI is in development.

---

### Verify that access key authentication is disabled

To verify that access key authentication is no longer permitted, a request can be made to list the access keys for the Azure App Configuration resource. If access key authentication is disabled there will be no access keys and the list operation will return an empty list.

# [Azure portal](#tab/portal)

To verify access key authentication is disabled for an Azure App Configuration resource in the Azure portal, follow these steps:

1. Navigate to your Azure App Configuration resource in the Azure portal.
2. Locate the **Access keys** setting under **Settings**.

    :::image type="content" border="true" source="./media/access-keys-blade.png" alt-text="Screenshot showing how to access an Azure App Configuration resources access key blade":::

3. Verify there are no access keys displayed and **Enable access keys** is toggled to **Disabled**.

    :::image type="content" border="true" source="./media/access-keys-disabled-portal.png" alt-text="Screenshot showing access keys being disabled for an Azure App Configuration resource":::

# [Azure CLI](#tab/azure-cli)

To verify access key authentication is disabled for an Azure App Configuration resource in the Azure portal, use the following command. The command will list the access keys for an Azure App Configuration resource and if access key authentication is disabled the list will be empty.

```azurecli-interactive
az appconfig credential list \
    --name <app-configuration-name> \
    --resource-group <resource-group>
```

If access key authentication is disabled then an empty list will be returned.

```
C:\Users\User>az appconfig credential list -g <resource-group> -n <app-configuration-name>
[]
```

---

## Permissions for allowing or disallowing access key authentication

To modify the state of access key authentication for an Azure App Configuration resource, a user must have permissions to create and manage Azure App Configuration resources. Azure role-based access control (Azure RBAC) roles that provide these permissions include the **Microsoft.AppConfiguration/configurationStores/write** or **Microsoft.AppConfiguration/configurationStores/\*** action. Built-in roles with this action include:

- The Azure Resource Manager [Owner](../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../role-based-access-control/built-in-roles.md#contributor) role

These roles do not provide access to data in an Azure App Configuration resource via Microsoft Entra ID. However, they include the **Microsoft.AppConfiguration/configurationStores/listKeys/action** action permission, which grants access to the resource's access keys. With this permission, a user can use the access keys to access all the data in the resource.

Role assignments must be scoped to the level of the Azure App Configuration resource or higher to permit a user to allow or disallow access key authentication for the resource. For more information about role scope, see [Understand scope for Azure RBAC](../role-based-access-control/scope-overview.md).

Be careful to restrict assignment of these roles only to those who require the ability to create an App Configuration resource or update its properties. Use the principle of least privilege to ensure that users have the fewest permissions that they need to accomplish their tasks. For more information about managing access with Azure RBAC, see [Best practices for Azure RBAC](../role-based-access-control/best-practices.md).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../role-based-access-control/built-in-roles.md#owner) role. The **Owner** role includes all actions, so a user with one of these administrative roles can also create and manage App Configuration resources. For more information, see [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

## Limitations

The capability to disable access key authentication has the following limitation:

### ARM template access

When access key authentication is disabled, the capability to read/write key-values in an [ARM template](./quickstart-resource-manager.md) will be disabled as well. This is because access to the Microsoft.AppConfiguration/configurationStores/keyValues resource used in ARM templates requires an Azure Resource Manager role, such as contributor or owner. When access key authentication is disabled, access to the resource requires one of the Azure App Configuration [data plane roles](concept-enable-rbac.md), therefore ARM template access is rejected.

## Next steps

- [Use customer-managed keys to encrypt your App Configuration data](concept-customer-managed-keys.md)
- [Using private endpoints for Azure App Configuration](concept-private-endpoint.md)
