---
title: Configure encryption for Azure Elastic SAN volumes
description: Learn how to configure Azure Elastic SAN encryption with customer-managed keys (CMK) for volumes provisioned via Azure Container Storage by using Azure CLI.
author: saurabh0501
ms.service: azure-container-storage
ms.date: 01/28/2026
ms.author: saurabsharma
ms.topic: overview
# Customer intent: As a cloud administrator, I want to configure customer-managed keys for Azure Elastic SAN encryption when used with Azure Container Storage, so that my data management practices meet compliance requirements.
---

# Configure encryption for Azure Elastic SAN

All data written to an Elastic SAN volume is encrypted at rest with a data encryption key (DEK). Azure uses [envelope encryption](../../security/fundamentals/encryption-atrest.md#envelope-encryption-with-a-key-hierarchy) to encrypt the DEK with a key encryption key (KEK). By default, Azure uses a platform-managed KEK. You can use a customer-managed key (CMK) stored in Azure Key Vault.

This article shows how to configure encryption for an Elastic SAN volume group by using a CMK in Azure Key Vault.

## Prerequisites

- This article requires the latest version of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli). If you use Azure Cloud Shell, the latest version is already installed. If you run commands locally, use an account with administrative privileges.
- This article assumes you installed Azure Container Storage version 2.1.0 or later on your Azure Kubernetes Service (AKS) cluster.

## Configure the key vault

You can use a new or existing key vault to store customer-managed keys. The encrypted resource and the key vault can be in different regions or subscriptions in the same Microsoft Entra ID tenant. To learn more, see [Azure Key Vault Overview](/azure/key-vault/general/overview) and [What is Azure Key Vault?](/azure/key-vault/general/basic-concepts).

Encryption with customer-managed keys requires that both soft delete and purge protection are enabled for the key vault. Soft delete is enabled by default when you create a new key vault and can't be disabled. You can enable purge protection when you create the key vault or after it is created. Azure Elastic SAN encryption supports RSA keys of sizes 2048, 3072, and 4096.

Azure Key Vault supports authorization with Azure role-based access control (Azure RBAC). Microsoft recommends Azure RBAC over key vault access policies. For more information, see [Provide access to Key Vault keys, certificates, and secrets with Azure role-based access control](/azure/key-vault/general/rbac-guide).

Prepare a key vault for your volume group KEKs:

> [!div class="checklist"]
> - Create a new key vault with soft delete and purge protection enabled, or enable purge protection for an existing key vault.
> - Create or assign an Azure RBAC role that grants key permissions: get, wrapKey, and unwrapKey.

To create a new key vault using Azure CLI, call [az keyvault create](/cli/azure/keyvault#az-keyvault-create). The following example creates a new key vault with soft delete and purge protection enabled. The key vault permission model uses Azure RBAC. Replace the placeholder values in brackets with your own values.

```azurecli-interactive
az keyvault create --name <key-vault-name> --resource-group <resource-group-name> --location <location> --enable-purge-protection --retention-days 7
```

To enable purge protection on an existing key vault, see [Azure Key Vault recovery overview](/azure/key-vault/general/key-vault-recovery?tabs=azure-cli).

## Create a user-assigned managed identity and grant access to the key vault

Create a user-assigned managed identity in the managed resource group of your AKS cluster:

```azurecli
az identity create --name <identity-name> --resource-group <node-resource-group>
```

Get the identity IDs and store them in variables:

```azurecli
uai_id=$(az identity show --name <identity-name> --resource-group <node-resource-group> --query id -o tsv)
uai_principal_id=$(az identity show --ids "$uai_id" --query principalId -o tsv)
```

When you enable customer-managed encryption keys for an Elastic SAN volume group, you must specify a managed identity to authorize access to the key vault that contains the key.

If your key vault uses access policies, set the key permissions for the managed identity. If your vault uses Azure RBAC, assign an equivalent role instead.

```azurecli
az keyvault set-policy --name <key-vault-name> --resource-group <resource-group-name> --object-id $uai_principal_id --key-permissions get wrapKey unwrapKey
```

## Add a key

Before you add the key, make sure you have the **Key Vault Crypto Officer** role.

Get the vault URI and store it in a variable:

```azurecli
vault_uri=$(az keyvault show --name <key-vault-name> --resource-group <resource-group-name> --query "properties.vaultUri" -o tsv)
```

Create an encryption key:

```azurecli
az keyvault key create --name <key-name> --vault-name <key-vault-name> --kty RSA --size 2048
```

## Create a StorageClass

Create a YAML manifest file such as `storageclass.yaml`. Use the names and variables from the previous steps.

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azuresan-encrypted
provisioner: san.csi.azure.com
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
parameters:
  encryption.keyvaulturi: "${vault_uri}"
  encryption.keyname: <key-name>
  encryption.identity: "${uai_id}"
```

Apply the manifest to create the StorageClass.

```azurecli
kubectl apply -f storageclass.yaml
```

## Create a persistent volume claim

Create a YAML manifest file such as `acstor-pvc.yaml`.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-san-encrypted
spec:
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: azuresan-encrypted
```

Apply the manifest to create the PVC.

```azurecli
kubectl apply -f acstor-pvc.yaml
```

## Deploy a pod

Create a YAML manifest file such as `acstor-pod.yaml`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-san-encrypted
spec:
  nodeSelector:
    kubernetes.io/os: linux
  containers:
    - name: pod-san-encrypted
      image: mcr.microsoft.com/azurelinux/busybox:1.36
      command:
        - "/bin/sh"
        - "-c"
        - set -euo pipefail; trap exit TERM; while true; do echo "$(date)" >> /mnt/san/outfile; sleep 1; done
      volumeMounts:
        - name: persistent-storage-encrypted
          mountPath: /mnt/san
  volumes:
    - name: persistent-storage-encrypted
      persistentVolumeClaim:
        claimName: pvc-san-encrypted
```

Apply the manifest to deploy the pod.

```azurecli
kubectl apply -f acstor-pod.yaml
```

You should see output similar to the following:

```output
pod/pod-san-encrypted created
```

## Verify encryption on the volume group

Get the Elastic SAN volume handle from the persistent volume (PV):

```azurecli
kubectl get pv <pv-name> -o jsonpath='{.spec.csi.volumeHandle}'
```

Use the resource group, Elastic SAN name, and volume group name from the volume handle to get volume group details:

```azurecli
az elastic-san volume-group show --resource-group <resource-group-name> --elastic-san-name <elastic-san-name> --name <volume-group-name> --output json
```

Validate read and write operations on the encrypted volume:

```azurecli
kubectl exec pod-san-encrypted -- sh -c "echo 'testing encrypted storage' > /mnt/san/test-encryption.txt && cat /mnt/san/test-encryption.txt"
```

## Next steps

- [What is Azure Elastic SAN?](../elastic-san/elastic-san-introduction.md)
- [Manage customer keys for Azure Elastic SAN data encryption](../elastic-san/elastic-san-encryption-manage-customer-keys.md)
