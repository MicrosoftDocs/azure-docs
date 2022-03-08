---
title: Provide an access identity to the Azure Key Vault Provider for Secrets Store CSI Driver for Azure Kubernetes Service (AKS) secrets
description: Learn about the various methods that you can use to allow the Azure Key Vault Provider for Secrets Store CSI Driver to integrate with your Azure key vault.
author: nickomang 
ms.author: nickoman
ms.service: container-service
ms.topic: article
ms.date: 10/13/2021
ms.custom: devx-track-azurecli
---

# Provide an identity to access the Azure Key Vault Provider for Secrets Store CSI Driver

The Secrets Store CSI Driver on Azure Kubernetes Service (AKS) provides a variety of methods of identity-based access to your Azure key vault. This article outlines these methods and how to use them to access your key vault and its contents from your AKS cluster. For more information, see [Use the Secrets Store CSI Driver][csi-secrets-store-driver].

## Use pod identities

Azure Active Directory (Azure AD) pod-managed identities use AKS primitives to associate managed identities for Azure resources and identities in Azure AD with pods. You can use these identities to grant access to the Azure Key Vault Secrets Provider for Secrets Store CSI driver.

### Prerequisites

- Ensure that the [Azure AD pod identity add-on][aad-pod-identity] has been enabled on your cluster.
- You must be using a Linux-based cluster.

### Usage

1. Follow the instructions in [Use Azure Active Directory pod-managed identities in Azure Kubernetes Service (Preview)][aad-pod-identity-create] to create a cluster identity, assign it permissions, and create a pod identity. Take note of the newly created identity's `clientId` and `name`.

1. Assign permissions to the new identity to enable it to read your key vault and view its contents by running the following commands:

    ```azurecli-interactive
    # set policy to access keys in your key vault
    az keyvault set-policy -n <keyvault-name> --key-permissions get --spn <pod-identity-client-id>
    # set policy to access secrets in your key vault
    az keyvault set-policy -n <keyvault-name> --secret-permissions get --spn <pod-identity-client-id>
    # set policy to access certs in your key vault
    az keyvault set-policy -n <keyvault-name> --certificate-permissions get --spn <pod-identity-client-id>
    ```

1. Create a `SecretProviderClass` by using the following YAML, using your own values for `aadpodidbinding`, `tenantId`, and the objects to retrieve from your key vault:

    ```yml
    # This is a SecretProviderClass example using aad-pod-identity to access the key vault
    apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      name: azure-kvname-podid
    spec:
      provider: azure
      parameters:
        usePodIdentity: "true"               # Set to true for using aad-pod-identity to access your key vault
        keyvaultName: <key-vault-name>       # Set to the name of your key vault
        cloudName: ""                        # [OPTIONAL for Azure] if not provided, the Azure environment defaults to AzurePublicCloud
        objects:  |
          array:
            - |
              objectName: secret1
              objectType: secret             # object types: secret, key, or cert
              objectVersion: ""              # [OPTIONAL] object versions, default to latest if empty
            - |
              objectName: key1
              objectType: key
              objectVersion: ""
        tenantId: <tenant-Id>                # The tenant ID of the key vault
    ```

1. Apply the `SecretProviderClass` to your cluster:

    ```bash
    kubectl apply -f secretproviderclass.yaml
    ```

1. Create a pod by using the following YAML, using the name of your identity:

    ```yml
    # This is a sample pod definition for using SecretProviderClass and aad-pod-identity to access the key vault
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

1. Apply the pod to your cluster:

    ```bash
    kubectl apply -f pod.yaml
    ```

## Use a user-assigned managed identity

1. To access your key vault, you can use the user-assigned managed identity that you created when you [enabled a managed identity on your AKS cluster][use-managed-identity]:

    ```azurecli-interactive
    az aks show -g <resource-group> -n <cluster-name> --query addonProfiles.azureKeyvaultSecretsProvider.identity.clientId -o tsv
    ```

    Alternatively, you can create a new managed identity and assign it to your virtual machine (VM) scale set or to each VM instance in your availability set:

    ```azurecli-interactive
    az identity create -g <resource-group> -n <identity-name> 
    az vmss identity assign -g <resource-group> -n <agent-pool-vmss> --identities <identity-resource-id>
    az vm identity assign -g <resource-group> -n <agent-pool-vm> --identities <identity-resource-id>
    ```

1. To grant your identity permissions that enable it to read your key vault and view its contents, run the following commands:

    ```azurecli-interactive
    # set policy to access keys in your key vault
    az keyvault set-policy -n <keyvault-name> --key-permissions get --spn <identity-client-id>
    # set policy to access secrets in your key vault
    az keyvault set-policy -n <keyvault-name> --secret-permissions get --spn <identity-client-id>
    # set policy to access certs in your key vault
    az keyvault set-policy -n <keyvault-name> --certificate-permissions get --spn <identity-client-id>
    ```

1. Create a `SecretProviderClass` by using the following YAML, using your own values for `userAssignedIdentityID`, `keyvaultName`, `tenantId`, and the objects to retrieve from your key vault:

    ```yml
    # This is a SecretProviderClass example using user-assigned identity to access your key vault
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
        keyvaultName: <key-vault-name>        # Set to the name of your key vault
        cloudName: ""                         # [OPTIONAL for Azure] if not provided, the Azure environment defaults to AzurePublicCloud
        objects:  |
          array:
            - |
              objectName: secret1
              objectType: secret              # object types: secret, key, or cert
              objectVersion: ""               # [OPTIONAL] object versions, default to latest if empty
            - |
              objectName: key1
              objectType: key
              objectVersion: ""
        tenantId: <tenant-id>                 # The tenant ID of the key vault
    ```

1. Apply the `SecretProviderClass` to your cluster:

    ```bash
    kubectl apply -f secretproviderclass.yaml
    ```

1. Create a pod by using the following YAML:

    ```yml
    # This is a sample pod definition for using SecretProviderClass and the user-assigned identity to access your key vault
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

1. Apply the pod to your cluster:

    ```bash
    kubectl apply -f pod.yaml
    ```

## Use a system-assigned managed identity

### Prerequisites

>[!IMPORTANT]
> Before you begin this step, [enable system-assigned managed identity][enable-system-assigned-identity] in your AKS cluster's VMs or scale sets.
>

### Usage

1. Verify that your virtual machine scale set or availability set nodes have their own system-assigned identity:

    ```azurecli-interactive
    az vmss identity show -g <resource group>  -n <vmss scalset name> -o yaml
    az vm identity show -g <resource group> -n <vm name> -o yaml
    ```

    >[!NOTE]
    > The output should contain `type: SystemAssigned`. Make a note of the `principalId`.
    > 
    > IMDS is looking for a System Assigned Identity on VMSS first, then it will look for a User Assigned Identity and pull that if there is only 1. If there are multiple User Assigned Identities IMDS will throw an error as it does not know which identity to pull.
    > 
1. To grant your identity permissions that enable it to read your key vault and view its contents, run the following commands:

    ```azurecli-interactive
    # set policy to access keys in your key vault
    az keyvault set-policy -n <keyvault-name> --key-permissions get --spn <identity-principal-id>
    # set policy to access secrets in your key vault
    az keyvault set-policy -n <keyvault-name> --secret-permissions get --spn <identity-principal-id>
    # set policy to access certs in your key vault
    az keyvault set-policy -n <keyvault-name> --certificate-permissions get --spn <identity-principal-id>
    ```

1. Create a `SecretProviderClass` by using the following YAML, using your own values for `keyvaultName`, `tenantId`, and the objects to retrieve from your key vault:

    ```yml
    # This is a SecretProviderClass example using system-assigned identity to access your key vault
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
        cloudName: ""                   # [OPTIONAL for Azure] if not provided, the Azure environment defaults to AzurePublicCloud
        objects:  |
          array:
            - |
              objectName: secret1
              objectType: secret        # object types: secret, key, or cert
              objectVersion: ""         # [OPTIONAL] object versions, default to latest if empty
            - |
              objectName: key1
              objectType: key
              objectVersion: ""
        tenantId: <tenant-id>           # The tenant ID of the key vault
    ```

1. Apply the `SecretProviderClass` to your cluster:

    ```bash
    kubectl apply -f secretproviderclass.yaml
    ```

1. Create a pod by using the following YAML:

    ```yml
    # This is a sample pod definition for using SecretProviderClass and system-assigned identity to access your key vault
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

To validate that the secrets are mounted at the volume path that's specified in your pod's YAML, see [Use the Azure Key Vault Provider for Secrets Store CSI Driver in an AKS cluster][validate-secrets].

<!-- LINKS INTERNAL -->

[csi-secrets-store-driver]: ./csi-secrets-store-driver.md
[aad-pod-identity]: ./use-azure-ad-pod-identity.md
[aad-pod-identity-create]: ./use-azure-ad-pod-identity.md#create-an-identity
[use-managed-identity]: ./use-managed-identity.md
[validate-secrets]: ./csi-secrets-store-driver.md#validate-the-secrets
[enable-system-assigned-identity]: ../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md#enable-system-assigned-managed-identity-on-an-existing-azure-vm

<!-- LINKS EXTERNAL -->
