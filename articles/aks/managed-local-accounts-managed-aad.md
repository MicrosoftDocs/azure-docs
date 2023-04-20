---
title: Manage local accounts with AKS-managed Azure Active Directory integration
description: Learn how to managed local accounts when integrating Azure AD in your Azure Kubernetes Service (AKS) clusters.
ms.topic: article
ms.date: 04/20/2023
ms.custom: devx-track-azurecli
---

# Manage local accounts with AKS-managed Azure Active Directory integration

## Disable local accounts

When you deploy an AKS cluster, local accounts are enabled by default. Even when enabling RBAC or Azure AD integration, `--admin` access still exists as a non-auditable backdoor option. You can disable local accounts using the parameter `disable-local-accounts`. The `properties.disableLocalAccounts` field has been added to the managed cluster API to indicate whether the feature is enabled or not on the cluster.

> [!NOTE]
>
> * On clusters with Azure AD integration enabled, users assigned to an Azure AD administrators group specified by `aad-admin-group-object-ids` can still gain access using non-administrator credentials. On clusters without Azure AD integration enabled and `properties.disableLocalAccounts` set to `true`, any attempt to authenticate with user or admin credentials will fail.
>
> * After disabling local user accounts on an existing AKS cluster where users might have authenticated with local accounts, the administrator must [rotate the cluster certificates](certificate-rotation.md) to revoke certificates they might have had access to. If this is a new cluster, no action is required.

### Create a new cluster without local accounts

Create a new AKS cluster without any local accounts using the [`az aks create`][az-aks-create] command with the `disable-local-accounts` flag.

```azurecli-interactive
az aks create -g <resource-group> -n <cluster-name> --enable-aad --aad-admin-group-object-ids <aad-group-id> --disable-local-accounts
```

In the output, confirm local accounts have been disabled by checking the field `properties.disableLocalAccounts` is set to `true`.

```output
"properties": {
    ...
    "disableLocalAccounts": true,
    ...
}
```

Attempting to get admin credentials will fail with an error message indicating the feature is preventing access:

```azurecli-interactive
az aks get-credentials --resource-group <resource-group> --name <cluster-name> --admin

Operation failed with status: 'Bad Request'. Details: Getting static credential isn't allowed because this cluster is set to disable local accounts.
```

### Disable local accounts on an existing cluster

Disable local accounts on an existing Azure AD integration enabled AKS cluster using the [`az aks update`][az-aks-update] command with the `disable-local-accounts` parameter.

```azurecli-interactive
az aks update -g <resource-group> -n <cluster-name> --disable-local-accounts
```

In the output, confirm local accounts have been disabled by checking the field `properties.disableLocalAccounts` is set to `true`.

```output
"properties": {
    ...
    "disableLocalAccounts": true,
    ...
}
```

Attempting to get admin credentials will fail with an error message indicating the feature is preventing access:

```azurecli-interactive
az aks get-credentials --resource-group <resource-group> --name <cluster-name> --admin

Operation failed with status: 'Bad Request'. Details: Getting static credential isn't allowed because this cluster is set to disable local accounts.
```

### Re-enable local accounts on an existing cluster

AKS supports enabling a disabled local account on an existing cluster using the [`az aks update`][az-aks-update] command with the `enable-local-accounts` parameter.

```azurecli-interactive
az aks update -g <resource-group> -n <cluster-name> --enable-local-accounts
```

In the output, confirm local accounts have been re-enabled by checking the field `properties.disableLocalAccounts` is set to `false`.

```output
"properties": {
    ...
    "disableLocalAccounts": false,
    ...
}
```

Attempting to get admin credentials will succeed:

```azurecli-interactive
az aks get-credentials --resource-group <resource-group> --name <cluster-name> --admin

Merged "<cluster-name>-admin" as current context in C:\Users\<username>\.kube\config
```
