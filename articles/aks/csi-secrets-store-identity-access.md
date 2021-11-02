---
title: Provide an access identity to the Azure Key Vault Provider for Secrets Store CSI Driver for Azure Kubernetes Service (AKS) secrets
description: Learn about the various methods that can be used to allow the Azure Key Vault Provider for Secrets Store CSI Driver to integrate with Azure Key Vault (AKV).
author: nickomang 
ms.author: nickoman
ms.service: container-service
ms.topic: article
ms.date: 10/13/2021
ms.custom: devx-track-azurecli
---

# Provide an identity to access Azure Key Vault Provider for Secrets Store CSI Driver

The Secrets Store CSI Driver on Azure Kubernetes Service (AKS) allows for various methods of identity-based access to Azure Key Vault (AKV). This article outlines these methods and how to use them to access an AKV instance and its content from your cluster. For more, see [Using the Secrets Store CSI Driver][csi-secrets-store-driver].

## Use Pod identity

Azure Active Directory pod-managed identities uses Kubernetes primitives to associate managed identities for Azure resources and identities in Azure Active Directory (AAD) with pods. These identities can be used to grant access to the Azure Key Vault Secrets Provider for Secrets Store CSI driver.

### Prerequisites

- Ensure the [AAD pod identity addon][aad-pod-identity] has been enabled on your cluster
- You must be using a Linux-based cluster

### Usage

1. Follow the steps in the [Use AAD pod-managed identities][aad-pod-identity-create] to create a cluster identity, assign it permissions, and create a pod identity. Take note of the newly-created identity's `clientId` and `name`.

2. Assign permissions to the new identity enabling it to read your AKV instance and view its content by running the following:

```azurecli-interactive
# set policy to access keys in your keyvault
az keyvault set-policy -n <keyvault-name> --key-permissions get --spn <pod-identity-client-id>
# set policy to access secrets in your keyvault
az keyvault set-policy -n <keyvault-name> --secret-permissions get --spn <pod-identity-client-id>
# set policy to access certs in your keyvault
az keyvault set-policy -n <keyvault-name> --certificate-permissions get --spn <pod-identity-client-id>
```

3. Create a SecretProviderClass with the following YAML, filling in your values for `aadpodidbinding`, `tenantId`, and objects to retrieve from your AKV instance:

```yml
# This is a SecretProviderClass example using aad-pod-identity to access Keyvault
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-kvname-podid
spec:
  provider: azure
  parameters:
    usePodIdentity: "true"               # Set to true for using aad-pod-identity to access keyvault
    keyvaultName: <key-vault-name>       # Set to the name of your Azure Key Vault instance
    cloudName: ""                        # [OPTIONAL for Azure] if not provided, azure environment will default to AzurePublicCloud
    objects:  |
      array:
        - |
          objectName: secret1
          objectType: secret             # object types: secret, key or cert
          objectVersion: ""              # [OPTIONAL] object versions, default to latest if empty
        - |
          objectName: key1
          objectType: key
          objectVersion: ""
    tenantId: <tenant-Id>                # The tenant ID of the Azure Key Vault instance
```

4. Apply the SecretProviderClass to your cluster:

```bash
kubectl apply -f secretproviderclass.yaml
```

5. Create a pod with the following YAML, filling in the name of your identity:

```yml
# This is a sample pod definition for using SecretProviderClass and aad-pod-identity to access Keyvault
kind: Pod
apiVersion: v1
metadata:
  name: busybox-secrets-store-inline-podid
  labels:
    aadpodidbinding: <name>                   # Set the label value to the name of your pod identity
spec:
  containers:
    - name: busybox
      image: k8s.gcr.io/e2e-test-images/busybox:1.29-1
      command:
        - "/bin/sleep"
        - "10000"
      volumeMounts:
      - name: secrets-store01-inline
        mountPath: "/mnt/secrets-store"
        readOnly: true
  volumes:
    - name: secrets-store01-inline
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: "azure-kvname-podid"
```

6. Apply the pod to your cluster:

```bash
kubectl apply -f pod.yaml
```

## Use a user-assigned managed identity

1. You can use the user-assigned managed identity created when [enabling managed identity on your AKS cluster][use-managed-identity] to access your AKV instance:

```azurecli-interactive
az aks show -g <resource-group> -n <cluster-name> --query identityProfile.kubeletidentity.clientId -o tsv
```

or you can create a new one and assign it to your virtual machine scale set, or each VM instance in your availability set:

```azurecli-interactive
az identity create -g <resource-group> -n <identity-name> 
az vmss identity assign -g <resource-group> -n <agent-pool-vmss> --identities <identity-resource-id>
az vm identity assign -g <resource-group> -n <agent-pool-vm> --identities <identity-resource-id>
```

2. Grant your identity permissions enabling it to read your AKV instance and view its content by running the following:

```azurecli-interactive
# set policy to access keys in your keyvault
az keyvault set-policy -n <keyvault-name> --key-permissions get --spn <identity-client-id>
# set policy to access secrets in your keyvault
az keyvault set-policy -n <keyvault-name> --secret-permissions get --spn <identity-client-id>
# set policy to access certs in your keyvault
az keyvault set-policy -n <keyvault-name> --certificate-permissions get --spn <identity-client-id>
```

3. Create a SecretProviderClass with the following YAML, filling in your values for `userAssignedIdentityID`, `keyvaultName`, `tenantId`, and objects to retrieve from your AKV instance:

```yml
# This is a SecretProviderClass example using user-assigned identity to access Keyvault
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-kvname-user-msi
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"
    useVMManagedIdentity: "true"          # Set to true for using managed identity
    userAssignedIdentityID: <client-id>   # Set the clientID of the user-assigned managed identity to use
    keyvaultName: <key-vault-name>        # Set to the name of your Azure Key Vault instance
    cloudName: ""                         # [OPTIONAL for Azure] if not provided, azure environment will default to AzurePublicCloud
    objects:  |
      array:
        - |
          objectName: secret1
          objectType: secret              # object types: secret, key or cert
          objectVersion: ""               # [OPTIONAL] object versions, default to latest if empty
        - |
          objectName: key1
          objectType: key
          objectVersion: ""
    tenantId: <tenant-id>                 # The tenant ID of the Azure Key Vault instance
```

4. Apply the SecretProviderClass to your cluster:

```bash
kubectl apply -f secretproviderclass.yaml
```

5. Create a pod with the following YAML, filling in the name of your identity:

```yml
# This is a sample pod definition for using SecretProviderClass and user-assigned identity to access Keyvault
kind: Pod
apiVersion: v1
metadata:
  name: busybox-secrets-store-inline-user-msi
spec:
  containers:
    - name: busybox
      image: k8s.gcr.io/e2e-test-images/busybox:1.29-1
      command:
        - "/bin/sleep"
        - "10000"
      volumeMounts:
      - name: secrets-store01-inline
        mountPath: "/mnt/secrets-store"
        readOnly: true
  volumes:
    - name: secrets-store01-inline
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: "azure-kvname-user-msi"
```

6. Apply the pod to your cluster:

```bash
kubectl apply -f pod.yaml
```

## Use a system-assigned managed identity

### Prerequisites

- [Enable system-assigned managed identity][enable-system-assigned-identity] in your cluster's VMs or scale sets

### Usage

1. Verify your virtual machine scale set or availability set nodes have their own system-assigned identity:

```azurecli-interactive
az vmss identity show -g <resource group>  -n <vmss scalset name> -o yaml
az vm identity show -g <resource group> -n <vm name> -o yaml
```

The output should contain `type: SystemAssigned`. Make a note of the `principalId`.

2. Assign permissions to the identity enabling it to read your AKV instance and view its content by running the following:

```azurecli-interactive
# set policy to access keys in your keyvault
az keyvault set-policy -n <keyvault-name> --key-permissions get --spn <identity-principal-id>
# set policy to access secrets in your keyvault
az keyvault set-policy -n <keyvault-name> --secret-permissions get --spn <identity-principal-id>
# set policy to access certs in your keyvault
az keyvault set-policy -n <keyvault-name> --certificate-permissions get --spn <identity-principal-id>
```

3. Create a SecretProviderClass with the following YAML, filling in your values for `keyvaultName`, `tenantId`, and objects to retrieve from your AKV instance:

```yml
# This is a SecretProviderClass example using system-assigned identity to access Keyvault
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-kvname-system-msi
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"
    useVMManagedIdentity: "true"    # Set to true for using managed identity
    userAssignedIdentityID: ""      # If empty, then defaults to use the system assigned identity on the VM
    keyvaultName: <key-vault-name>
    cloudName: ""                   # [OPTIONAL for Azure] if not provided, azure environment will default to AzurePublicCloud
    objects:  |
      array:
        - |
          objectName: secret1
          objectType: secret        # object types: secret, key or cert
          objectVersion: ""         # [OPTIONAL] object versions, default to latest if empty
        - |
          objectName: key1
          objectType: key
          objectVersion: ""
    tenantId: <tenant-id>           # The tenant ID of the Azure Key Vault instance
```

4. Apply the SecretProviderClass to your cluster:

```bash
kubectl apply -f secretproviderclass.yaml
```

5. Create a pod with the following YAML, filling in the name of your identity:

```yml
# This is a sample pod definition for using SecretProviderClass and system-assigned identity to access Keyvault
kind: Pod
apiVersion: v1
metadata:
  name: busybox-secrets-store-inline-system-msi
spec:
  containers:
    - name: busybox
      image: k8s.gcr.io/e2e-test-images/busybox:1.29-1
      command:
        - "/bin/sleep"
        - "10000"
      volumeMounts:
      - name: secrets-store01-inline
        mountPath: "/mnt/secrets-store"
        readOnly: true
  volumes:
    - name: secrets-store01-inline
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: "azure-kvname-system-msi"
```

## Next steps

[Validate the secrets][validate-secrets] are mounted at the volume path specified in your pod's YAML.

<!-- LINKS INTERNAL -->

[csi-secrets-store-driver]: ./csi-secrets-store-driver.md
[aad-pod-identity]: ./use-azure-ad-pod-identity.md
[aad-pod-identity-create]: ./use-azure-ad-pod-identity.md#create-an-identity
[use-managed-identity]: ./use-managed-identity.md
[validate-secrets]: ./csi-secrets-store-driver.md#validate-the-secrets
[enable-system-assigned-identity]: ../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md#enable-system-assigned-managed-identity-on-an-existing-azure-vm

<!-- LINKS EXTERNAL -->
