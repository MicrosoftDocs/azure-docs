---
title: Use Key Management Service (KMS) etcd encryption in Azure Kubernetes Service (AKS) 
description: Learn how to use the Key Management Service (KMS) etcd encryption with Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 08/04/2023
---

# Add Key Management Service (KMS) etcd encryption to an Azure Kubernetes Service (AKS) cluster

This article shows you how to enable encryption at rest for your Kubernetes secrets in etcd using Azure Key Vault with the Key Management Service (KMS) plugin. The KMS plugin allows you to:

* Use a key in Key Vault for etcd encryption.
* Bring your own keys.
* Provide encryption at rest for secrets stored in etcd.
* Rotate the keys in Key Vault.

For more information on using the KMS plugin, see [Encrypting Secret Data at Rest](https://kubernetes.io/docs/tasks/administer-cluster/kms-provider/).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* Azure CLI version 2.39.0 or later. Run `az --version` to find your version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

> [!WARNING]
> KMS supports Konnectivity or [API Server Vnet Integration][api-server-vnet-integration]. 
> You can use `kubectl get po -n kube-system` to verify the results show that a konnectivity-agent-xxx pod is running. If there is, it means the AKS cluster is using Konnectivity. When using VNet integration, you can run the command `az aks show -g -n` to verify the setting `enableVnetIntegration` is set to **true**.

## Limitations

The following limitations apply when you integrate KMS etcd encryption with AKS:

* Deletion of the key, Key Vault, or the associated identity isn't supported.
* KMS etcd encryption doesn't work with system-assigned managed identity. The key vault access policy is required to be set before the feature is enabled. In addition, system-assigned managed identity isn't available until cluster creation. Consequently, there's a cycle dependency.
* Azure Key Vault with Firewall enabled to allow public access isn't supported. It blocks traffic from KMS plugin to the Key Vault.
* The maximum number of secrets supported by a cluster enabled with KMS is 2,000. However, it's important to note that [KMS V2][kms-v2-support] isn't limited by this restriction and can handle a higher number of secrets.
* Bring your own (BYO) Azure Key Vault from another tenant isn't supported.
* With KMS enabled, you can't change associated Azure Key Vault model (public, private). To [change associated key vault mode][changing-associated-key-vault-mode], you need to disable and enable KMS again.
* If a cluster is enabled with KMS and private key vault and isn't using the `API Server VNet integration` tunnel, then stop/start cluster isn't allowed.
* Using the Virtual Machine Scale Sets API to scale the nodes in the cluster down to zero deallocates the nodes, causing the cluster to go down and become unrecoverable.
* After you disable KMS, you can't destroy the keys. Otherwise, it causes the API server to stop working.

KMS supports [public key vault][Enable-KMS-with-public-key-vault] and [private key vault][Enable-KMS-with-private-key-vault].

## Enable KMS with public key vault

### Create a key vault and key

> [!WARNING]
> Deleting the key or the Azure Key Vault is not supported and will cause the secrets to be unrecoverable in the cluster.
>
> If you need to recover your Key Vault or key, see [Azure Key Vault recovery management with soft delete and purge protection](../key-vault/general/key-vault-recovery.md?tabs=azure-cli).

#### For non-RBAC key vault

Use `az keyvault create` to create a key vault.

```azurecli
az keyvault create --name MyKeyVault --resource-group MyResourceGroup
```

Use `az keyvault key create` to create a key.

```azurecli
az keyvault key create --name MyKeyName --vault-name MyKeyVault
```

Use `az keyvault key show` to export the key ID.

```azurecli
export KEY_ID=$(az keyvault key show --name MyKeyName --vault-name MyKeyVault --query 'key.kid' -o tsv)
echo $KEY_ID
```

The above example stores the key ID in *KEY_ID*.

#### For RBAC key vault

Use `az keyvault create` to create a key vault using Azure Role Based Access Control.

```azurecli
export KEYVAULT_RESOURCE_ID=$(az keyvault create --name MyKeyVault --resource-group MyResourceGroup  --enable-rbac-authorization true --query id -o tsv)
```

Assign yourself permission to create a key.

```azurecli-interactive
az role assignment create --role "Key Vault Crypto Officer" --assignee-object-id $(az ad signed-in-user show --query id --out tsv) --assignee-principal-type "User" --scope $KEYVAULT_RESOURCE_ID
```

Use `az keyvault key create` to create a key.

```azurecli
az keyvault key create --name MyKeyName --vault-name MyKeyVault
```

Use `az keyvault key show` to export the key ID.

```azurecli
export KEY_ID=$(az keyvault key show --name MyKeyName --vault-name MyKeyVault --query 'key.kid' -o tsv)
echo $KEY_ID
```

The above example stores the key ID in *KEY_ID*.

### Create a user-assigned managed identity

Use `az identity create` to create a user-assigned managed identity.

```azurecli
az identity create --name MyIdentity --resource-group MyResourceGroup
```

Use `az identity show` to get the identity object ID.

```azurecli
IDENTITY_OBJECT_ID=$(az identity show --name MyIdentity --resource-group MyResourceGroup --query 'principalId' -o tsv)
echo $IDENTITY_OBJECT_ID
```

The above example stores the value of the identity object ID in *IDENTITY_OBJECT_ID*.

Use `az identity show` to get the identity resource ID.

```azurecli
IDENTITY_RESOURCE_ID=$(az identity show --name MyIdentity --resource-group MyResourceGroup --query 'id' -o tsv)
echo $IDENTITY_RESOURCE_ID
```

The above example stores the value of the identity resource ID in *IDENTITY_RESOURCE_ID*.

### Assign permissions (decrypt and encrypt) to access key vault

#### For non-RBAC key vault

If your key vault is not enabled with  `--enable-rbac-authorization`, you can use `az keyvault set-policy` to create an Azure key vault policy.

```azurecli-interactive
az keyvault set-policy -n MyKeyVault --key-permissions decrypt encrypt --object-id $IDENTITY_OBJECT_ID
```

#### For RBAC key vault

If your key vault is enabled with `--enable-rbac-authorization`, you need to assign the "Key Vault Crypto User" RBAC role which has decrypt, encrypt permission.

```azurecli-interactive
az role assignment create --role "Key Vault Crypto User" --assignee-object-id $IDENTITY_OBJECT_ID --assignee-principal-type "ServicePrincipal" --scope $KEYVAULT_RESOURCE_ID
```

### Create an AKS cluster with KMS etcd encryption enabled

Create an AKS cluster using the [az aks create][az-aks-create] command with the `--enable-azure-keyvault-kms`, `--azure-keyvault-kms-key-vault-network-access` and `--azure-keyvault-kms-key-id` parameters to enable KMS etcd encryption.

```azurecli-interactive
az aks create --name myAKSCluster --resource-group MyResourceGroup --assign-identity $IDENTITY_RESOURCE_ID --enable-azure-keyvault-kms --azure-keyvault-kms-key-vault-network-access "Public" --azure-keyvault-kms-key-id $KEY_ID
```

### Update an existing AKS cluster to enable KMS etcd encryption

Use [az aks update][az-aks-update] with the `--enable-azure-keyvault-kms`, `--azure-keyvault-kms-key-vault-network-access` and `--azure-keyvault-kms-key-id` parameters to enable KMS etcd encryption on an existing cluster.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group MyResourceGroup --enable-azure-keyvault-kms --azure-keyvault-kms-key-vault-network-access "Public" --azure-keyvault-kms-key-id $KEY_ID
```

Use the following command to update all secrets. Otherwise, old secrets won't be encrypted. For larger clusters, you may want to subdivide the secrets by namespace or script an update.

```azurecli-interactive
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

### Rotate the existing keys

After changing the key ID (including key name and key version), you can use [az aks update][az-aks-update] with the `--enable-azure-keyvault-kms`, `--azure-keyvault-kms-key-vault-network-access` and `--azure-keyvault-kms-key-id` parameters to rotate the existing keys of KMS.

> [!WARNING]
> Remember to update all secrets after key rotation. Otherwise, the secrets will be inaccessible if the old keys don't exist or aren't working.
> 
> Once you rotate the key, the old key (key1) is still cached and shouldn't be deleted. If you want to delete the old key (key1) immediately, you need to rotate the key twice. Then key2 and key3 are cached, and key1 can be deleted without impacting existing cluster.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group MyResourceGroup  --enable-azure-keyvault-kms --azure-keyvault-kms-key-vault-network-access "Public" --azure-keyvault-kms-key-id $NEW_KEY_ID 
```

Use the following command to update all secrets. Otherwise, old secrets will still be encrypted with the previous key. For larger clusters, you may want to subdivide the secrets by namespace or script an update.

```azurecli-interactive
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

## Enable KMS with private key vault

If you enable KMS with private key vault, AKS will create a private endpoint and private link in the node resource group automatically. The key vault will be added a private endpoint connection with the AKS cluster.

### Create a private key vault and key

> [!WARNING]
> Deleting the key or the Azure Key Vault isn't supported and will cause the secrets to be unrecoverable in the cluster.
>
> If you need to recover your key vault or key, see [Azure Key Vault recovery management with soft delete and purge protection](../key-vault/general/key-vault-recovery.md?tabs=azure-cli).

Use `az keyvault create` to create a private key vault.

```azurecli
az keyvault create --name MyKeyVault --resource-group MyResourceGroup --public-network-access Disabled
```

It's not supported to create or update keys in private key vault without private endpoint. To manage private key vaults, you can refer to [Integrate Key Vault with Azure Private Link](../key-vault/general/private-link-service.md).

### Create a user-assigned managed identity

Use `az identity create` to create a user-assigned managed identity.

```azurecli
az identity create --name MyIdentity --resource-group MyResourceGroup
```

Use `az identity show` to get the identity object ID.

```azurecli
IDENTITY_OBJECT_ID=$(az identity show --name MyIdentity --resource-group MyResourceGroup --query 'principalId' -o tsv)
echo $IDENTITY_OBJECT_ID
```

The above example stores the value of the identity object ID in *IDENTITY_OBJECT_ID*.

Use `az identity show` to get identity resource ID.

```azurecli
IDENTITY_RESOURCE_ID=$(az identity show --name MyIdentity --resource-group MyResourceGroup --query 'id' -o tsv)
echo $IDENTITY_RESOURCE_ID
```

The above example stores the value of the identity resource ID in *IDENTITY_RESOURCE_ID*.

### Assign permissions (decrypt and encrypt) to access key vault

#### For non-RBAC key vault

If your key vault is not enabled with  `--enable-rbac-authorization`, you can use `az keyvault set-policy` to create an Azure key vault policy.

```azurecli-interactive
az keyvault set-policy -n MyKeyVault --key-permissions decrypt encrypt --object-id $IDENTITY_OBJECT_ID
```

#### For RBAC key vault

If your key vault is enabled with `--enable-rbac-authorization`, you need to assign a RBAC role that contains decrypt, encrypt permission.

```azurecli-interactive
az role assignment create --role "Key Vault Crypto User" --assignee-object-id $IDENTITY_OBJECT_ID --assignee-principal-type "ServicePrincipal" --scope $KEYVAULT_RESOURCE_ID
```

### Assign permission for creating private link

For private key vaults, you need the *Key Vault Contributor* role to create a private link between the private key vault and the cluster.

```azurecli-interactive
az role assignment create --role "Key Vault Contributor" --assignee-object-id $IDENTITY_OBJECT_ID --assignee-principal-type "ServicePrincipal" --scope $KEYVAULT_RESOURCE_ID
```

### Create an AKS cluster with private key vault and enable KMS etcd encryption

Create an AKS cluster using the [az aks create][az-aks-create] command with the `--enable-azure-keyvault-kms`, `--azure-keyvault-kms-key-id`, `--azure-keyvault-kms-key-vault-network-access` and `--azure-keyvault-kms-key-vault-resource-id` parameters to enable KMS etcd encryption with private key vault.

```azurecli-interactive
az aks create --name myAKSCluster --resource-group MyResourceGroup --assign-identity $IDENTITY_RESOURCE_ID --enable-azure-keyvault-kms --azure-keyvault-kms-key-id $KEY_ID --azure-keyvault-kms-key-vault-network-access "Private" --azure-keyvault-kms-key-vault-resource-id $KEYVAULT_RESOURCE_ID
```

### Update an existing AKS cluster to enable KMS etcd encryption with private key vault

Use [az aks update][az-aks-update] with the `--enable-azure-keyvault-kms`, `--azure-keyvault-kms-key-id`, `--azure-keyvault-kms-key-vault-network-access` and `--azure-keyvault-kms-key-vault-resource-id` parameters to enable KMS etcd encryption on an existing cluster with private key vault.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group MyResourceGroup --enable-azure-keyvault-kms --azure-keyvault-kms-key-id $KEY_ID --azure-keyvault-kms-key-vault-network-access "Private" --azure-keyvault-kms-key-vault-resource-id $KEYVAULT_RESOURCE_ID
```

Use the following command to update all secrets. Otherwise, old secrets won't be encrypted. For larger clusters, you may want to subdivide the secrets by namespace or script an update.

```azurecli-interactive
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

### Rotate the existing keys

After changing the key ID (including key name and key version), you can use [az aks update][az-aks-update] with the `--enable-azure-keyvault-kms`, `--azure-keyvault-kms-key-id`, `--azure-keyvault-kms-key-vault-network-access` and `--azure-keyvault-kms-key-vault-resource-id` parameters to rotate the existing keys of KMS.

> [!WARNING]
> Remember to update all secrets after key rotation. Otherwise, the secrets will be inaccessible if the old keys are not existing or working.
>
> Once you rotate the key, the old key (key1) is still cached and shouldn't be deleted. If you want to delete the old key (key1) immediately, you need to rotate the key twice. Then key2 and key3 are cached, and key1 can be deleted without impacting existing cluster.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group MyResourceGroup  --enable-azure-keyvault-kms --azure-keyvault-kms-key-id $NewKEY_ID --azure-keyvault-kms-key-vault-network-access "Private" --azure-keyvault-kms-key-vault-resource-id $KEYVAULT_RESOURCE_ID
```

Use the following command to update all secrets. Otherwise, old secrets will still be encrypted with the previous key. For larger clusters, you may want to subdivide the secrets by namespace or script an update.

```azurecli-interactive
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

## Update key vault mode

> [!NOTE]
> To change a different key vault with a different mode (public, private), you can run `az aks update` directly. To change the mode of attached key vault, you need to disable KMS and re-enable it with the new key vault IDs.

Below are the steps about how to migrate the attached public key vault to private mode.

### Disable KMS on the cluster

Disable the KMS on existing cluster and release the key vault.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group MyResourceGroup --disable-azure-keyvault-kms
```

### Change key vault mode

Update the key vault from public to private.

```azurecli-interactive
az keyvault update --name MyKeyVault --resource-group MyResourceGroup --public-network-access Disabled
```

### Enable KMS on the cluster with updated key vault

Re-enable the KMS with updated private key vault.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group MyResourceGroup  --enable-azure-keyvault-kms --azure-keyvault-kms-key-id $NewKEY_ID --azure-keyvault-kms-key-vault-network-access "Private" --azure-keyvault-kms-key-vault-resource-id $KEYVAULT_RESOURCE_ID
```

After configuring KMS, you can enable [diagnostic-settings for key vault to check the encryption logs](../key-vault/general/howto-logging.md).

## Disable KMS

Before disabling KMS, you can use the following Azure CLI command to verify if KMS is enabled.

```azurecli-interactive
az aks list --query "[].{Name:name, KmsEnabled:securityProfile.azureKeyVaultKms.enabled, KeyId:securityProfile.azureKeyVaultKms.keyId}" -o table
```

If the results confirm KMS is enabled, run the following command to disable KMS on the cluster.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group MyResourceGroup --disable-azure-keyvault-kms
```

Use the following command to update all secrets. Otherwise, the old secrets will still be encrypted with the previous key and the encrypt/decrypt permission on key vault is still required. For larger clusters, you may want to subdivide the secrets by namespace or script an update.

```azurecli-interactive
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

## KMS v2 support

Starting with AKS version 1.27, enabling the KMS feature configures KMS v2. With KMS v2, you aren't limited to the 2,000 secrets it supports. For more information, review [KMS V2 Improvements](https://kubernetes.io/blog/2023/05/16/kms-v2-moves-to-beta/).

### Migration to KMS v2

If your cluster version is less than 1.27 and you already enabled KMS, the upgrade to 1.27 or higher will be blocked. You use the following steps to migrate to KMS v2:

1. Disable KMS on the cluster.
2. Perform the storage migration.
3. Upgrade the cluster to version 1.27 or higher.
4. Re-enable KMS on the cluster.
5. Perform the storage migration.

#### Disable KMS

To disable KMS on an existing cluster, use the `az aks update` command with the `--disable-azure-keyvault-kms` argument.

```azurecli-interactive
az aks update --name myAKSCluster --resource-group MyResourceGroup --disable-azure-keyvault-kms
```

#### Storage migration

To update all secrets, use the `kubectl get secrets` command with the `--all-namespaces` argument.

```azurecli-interactive
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

#### Upgrade AKS cluster

To upgrade an AKS cluster, use the `az aks upgrade` command and specify the desired version as `1.27.x` or higher with the `--kubernetes-version` argument.

```azurecli-interactive
az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes-version <AKS version>
```

For example:

```azurecli-interactive
az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes-version 1.27.1
```

#### Re-enable KMS

You can reenable the KMS feature on the cluster to encrypt the secrets. Afterwards, the AKS cluster uses KMS v2.
If you don't want to do the KMS v2 migration, you can create a new version 1.27 and higher cluster with KMS enabled.

#### Storage migration

To re-encrypt all secrets under KMS v2, use the `kubectl get secrets` command with the `--all-namespaces` argument.

```azurecli-interactive
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

<!-- LINKS - Internal -->
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az extension add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-aks-update]: /cli/azure/aks#az_aks_update
[Enable-KMS-with-public-key-vault]: use-kms-etcd-encryption.md#enable-kms-with-public-key-vault
[Enable-KMS-with-private-key-vault]: use-kms-etcd-encryption.md#enable-kms-with-private-key-vault
[changing-associated-key-vault-mode]: use-kms-etcd-encryption.md#update-key-vault-mode
[install-azure-cli]: /cli/azure/install-azure-cli
[api-server-vnet-integration]: api-server-vnet-integration.md
[kms-v2-support]: use-kms-etcd-encryption.md#kms-v2-support
