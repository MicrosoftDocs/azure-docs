---
title: Manage access key authentication for an Azure App Configuration instance
titleSuffix: Azure App Configuration
description: Learn how to manage access key authentication for an Azure App Configuration instance.
ms.service: azure-app-configuration
author: maud-lv
ms.author: malev
ms.topic: how-to
ms.date: 04/05/2024
---

# Manage access key authentication for an Azure App Configuration instance

Every request to an Azure App Configuration resource must be authenticated. By default, requests can be authenticated with either Microsoft Entra credentials, or by using an access key. Of these two types of authentication schemes, Microsoft Entra ID provides superior security and ease of use over access keys, and is recommended by Microsoft. To require clients to use Microsoft Entra ID to authenticate requests, you can disable the usage of access keys for an Azure App Configuration resource. If you want to use access keys to authenticate the request, it's recommended to rotate access keys periodically to enhance security. See [recommendations for protecting application secrets](/azure/well-architected/security/application-secrets) to learn more.

## Enable access key authentication

Access key is enabled by default, you can use access keys in your code to authenticate requests.

# [Azure portal](#tab/portal)

To allow access key authentication for an Azure App Configuration resource in the Azure portal, follow these steps:

1. Navigate to your Azure App Configuration resource in the Azure portal.
1. Locate the **Access settings** setting under **Settings**.

    :::image type="content" border="true" source="./media/access-settings-blade.png" alt-text="Screenshot showing how to access an Azure App Configuration resources access key blade.":::

1. Set the **Enable access keys** toggle to **Enabled**.

    :::image type="content" border="true" source="./media/enable-access-keys.png" alt-text="Screenshot showing how to enable access key authentication for Azure App Configuration.":::

# [Azure CLI](#tab/azure-cli)

To enable access keys for Azure App configuration resource, use the following command. The `--disable-local-auth` option is set to `false` to enable access key-based authentication. 

```azurecli-interactive
az appconfig update \
    --name <app-configuration-name> \
    --resource-group <resource-group> \
    --disable-local-auth false
```

---

### Verify that access key authentication is enabled

To verify if access key authentication is enabled, check if you're able to get a list of read-only and read-write access keys. This list will only exist if access key authentication is enabled.

# [Azure portal](#tab/portal)

To check if access key authentication is enabled for an Azure App Configuration resource in the Azure portal, follow these steps:

1. Navigate to your Azure App Configuration resource in the Azure portal.
1. Locate the **Access settings** setting under **Settings**.

    :::image type="content" border="true" source="./media/access-settings-blade.png" alt-text="Screenshot showing how to access an Azure App Configuration resources access key blade.":::

1. Check if there are access keys displayed and if the toggled state of **Enable access keys** is enabled.

    :::image type="content" border="true" source="./media/get-access-keys-list.png" alt-text="Screenshot showing access keys for an Azure App Configuration resource.":::

# [Azure CLI](#tab/azure-cli)

To check if access key authentication is enabled for an Azure App Configuration resource, use the following command. The command will list the access keys for an Azure App Configuration resource.
If access key authentication is enabled, then read-only access keys and read-write access keys will be returned.

```azurecli-interactive
az appconfig credential list \
    --name <app-configuration-name> \
    --resource-group <resource-group>
```

---

## Disable access key authentication

Disabling access key authentication will delete all access keys. If any running applications are using access keys for authentication, they will begin to fail once access key authentication is disabled. Only requests that are authenticated using Microsoft Entra ID will succeed. For more information about using Microsoft Entra ID, see [Authorize access to Azure App Configuration using Microsoft Entra ID](./concept-enable-rbac.md). Enabling access key authentication again will generate a new set of access keys and any applications attempting to use the old access keys will still fail.

> [!WARNING]
> If any clients are currently accessing data in your Azure App Configuration resource with access keys, then Microsoft recommends that you migrate those clients to [Microsoft Entra ID](./concept-enable-rbac.md) before disabling access key authentication.

# [Azure portal](#tab/portal)

To disallow access key authentication for an Azure App Configuration resource in the Azure portal, follow these steps:

1. Navigate to your Azure App Configuration resource in the Azure portal.
1. Locate the **Access settings** setting under **Settings**.

    :::image type="content" border="true" source="./media/access-settings-blade.png" alt-text="Screenshot showing how to access an Azure App Configuration resources access key blade.":::

1. Set the **Enable access keys** toggle to **Disabled**.

    :::image type="content" border="true" source="./media/disable-access-keys.png" alt-text="Screenshot showing how to disable access key authentication for Azure App Configuration":::

# [Azure CLI](#tab/azure-cli)

To disable access keys for Azure App configuration resource, use the following command. The `--disable-local-auth` option is set to `true` to disable access key-based authentication. 

```azurecli-interactive
az appconfig update \
    --name <app-configuration-name> \
    --resource-group <resource-group> \
    --disable-local-auth true
```

---

### Verify that access key authentication is disabled

To verify that access key authentication is no longer permitted, a request can be made to list the access keys for the Azure App Configuration resource. If access key authentication is disabled, there will be no access keys, and the list operation will return an empty list.

# [Azure portal](#tab/portal)

To verify access key authentication is disabled for an Azure App Configuration resource in the Azure portal, follow these steps:

1. Navigate to your Azure App Configuration resource in the Azure portal.
1. Locate the **Access settings** setting under **Settings**.

    :::image type="content" border="true" source="./media/access-settings-blade.png" alt-text="Screenshot showing how to access an Azure App Configuration resources access key blade.":::

1. Check that there are no access keys displayed and the toggled state of **Enable access keys** is off.

    :::image type="content" border="true" source="./media/disable-access-keys.png" alt-text="Screenshot showing access keys being disabled for an Azure App Configuration resource":::

# [Azure CLI](#tab/azure-cli)

To verify access key authentication is disabled for an Azure App Configuration resource, use the following command. The command will list the access keys for an Azure App Configuration resource and if access key authentication is disabled the list will be empty.

```azurecli-interactive
az appconfig credential list \
    --name <app-configuration-name> \
    --resource-group <resource-group>
```

---

## Permissions for allowing or disallowing access key authentication

To modify the state of access key authentication for an Azure App Configuration resource, a user must have permissions to create and manage Azure App Configuration resources. Azure role-based access control (Azure RBAC) roles that provide these permissions include the **Microsoft.AppConfiguration/configurationStores/write** or **Microsoft.AppConfiguration/configurationStores/\*** action. Built-in roles with this action include:

- The Azure Resource Manager [Owner](../role-based-access-control/built-in-roles.md#owner) role
- The Azure Resource Manager [Contributor](../role-based-access-control/built-in-roles.md#contributor) role

These roles do not provide access to data in an Azure App Configuration resource via Microsoft Entra ID. However, they include the **Microsoft.AppConfiguration/configurationStores/listKeys/action** action permission, which grants access to the resource's access keys. With this permission, a user can use the access keys to access all the data in the resource.

Role assignments must be scoped to the level of the Azure App Configuration resource or higher to permit a user to allow or disallow access key authentication for the resource. For more information about role scope, see [Understand scope for Azure RBAC](../role-based-access-control/scope-overview.md).

Be careful to restrict assignment of these roles only to those users who require the ability to create an App Configuration resource or update its properties. Use the principle of least privilege to ensure that users have the fewest permissions that they need to accomplish their tasks. For more information about managing access with Azure RBAC, see [Best practices for Azure RBAC](../role-based-access-control/best-practices.md).

> [!NOTE]
> The classic subscription administrator roles Service Administrator and Co-Administrator include the equivalent of the Azure Resource Manager [Owner](../role-based-access-control/built-in-roles.md#owner) role. The **Owner** role includes all actions, so a user with one of these administrative roles can also create and manage App Configuration resources. For more information, see [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../role-based-access-control/rbac-and-directory-admin-roles.md#classic-subscription-administrator-roles).

> [!NOTE]
> When access key authentication is disabled and [ARM authentication mode](./quickstart-deployment-overview.md#azure-resource-manager-authentication-mode) of App Configuration store is local, the capability to read/write key-values in an [ARM template](./quickstart-resource-manager.md) will be disabled as well. This is because access to the Microsoft.AppConfiguration/configurationStores/keyValues resource used in ARM templates requires access key authentication with local ARM authentication mode. It's recommended to use pass-through ARM authentication mode. For more information, see [Deployment overview](./quickstart-deployment-overview.md).

## Access key rotation
Microsoft recommends periodic rotation of access keys to mitigate the risk of attack vectors from leaked secrets. Each Azure App Configuration resource includes two read-only access keys and two read-write access keys, designated as primary and secondary keys, to facilitate seamless secret rotation. This setup enables you to alternate access keys in your applications without causing any downtime.

You can rotate keys using the following procedure:

1. If you're using both keys in production, change your code so that only one access key is in use. In this example, let's say you decide to keep using your store's primary key.
You must have only one key in your code, because when you regenerate your secondary key, the older version of that key will stop working immediately, causing clients using the older key to get 401 access denied errors.

1. Once the primary key is the only key in use, you can regenerate the secondary key. 

    ### [Azure portal](#tab/portal)

    Go to your resource's page on the Azure portal, open the **Settings** > **Access settings** menu, and select **Regenerate** under **Secondary key**.

    :::image type="content" border="true" source="./media/regenerate-secondary-key.png" alt-text="Screenshot showing regenerate secondary key.":::

    ### [Azure CLI](#tab/azure-cli)

    To regenerate an access key for an App Configuration store, use the following command. 

    ```azurecli-interactive
    az appconfig credential regenerate  \
        --name <app-configuration-name> \
        --resource-group <resource-group> \
        --id <key-to-be-regenerated>
    ```

    ---

1. Next, update your code to use the newly generated secondary key.
It is advisable to review your application logs to confirm that all instances of your application have transitioned from using the primary key to the secondary key before proceeding to the next step.

1. Finally, you can invalidate the primary keys by regenerating them. Next time, you can alternate access keys between the secondary and primary keys using the same process.

## Next steps

- [Use customer-managed keys to encrypt your App Configuration data](concept-customer-managed-keys.md)
- [Using private endpoints for Azure App Configuration](concept-private-endpoint.md)
