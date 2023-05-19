---
title: Provide an access identity to the Azure Key Vault Provider for Secrets Store CSI Driver for Azure Kubernetes Service (AKS) secrets
description: Learn about the various methods that you can use to allow the Azure Key Vault Provider for Secrets Store CSI Driver to integrate with your Azure key vault.
author: nickomang 
ms.author: nickoman
ms.topic: article
ms.date: 02/27/2023
ms.custom: devx-track-azurecli
---

# Provide an identity to access the Azure Key Vault Provider for Secrets Store CSI Driver

The Secrets Store CSI Driver on Azure Kubernetes Service (AKS) provides a variety of methods of identity-based access to your Azure key vault. This article outlines these methods and how to use them to access your key vault and its contents from your AKS cluster. For more information, see [Use the Secrets Store CSI Driver][csi-secrets-store-driver].

Currently, the following methods of access are available:

- Azure AD Workload identity (preview)
- User-assigned managed identity

## Access with an Azure AD workload identity (preview)

An [Azure AD workload identity][workload-identity] is an identity used by an application running on a pod that can authenticate itself against other Azure services that support it, such as Storage or SQL. It integrates with the capabilities native to Kubernetes to federate with external identity providers. In this security model, the AKS cluster acts as token issuer where Azure Active Directory uses OpenID Connect to discover public signing keys and verify the authenticity of the service account token before exchanging it for an Azure AD token. Your workload can exchange a service account token projected to its volume for an Azure AD token using the Azure Identity client library using the Azure SDK or the Microsoft Authentication Library (MSAL).

> [!NOTE]
> This authentication method replaces Azure AD pod-managed identity (preview). The open source Azure AD pod-managed identity (preview) in Azure Kubernetes Service has been deprecated as of 10/24/2022.

### Prerequisites

- Installed the latest version of the `aks-preview` extension, version 0.5.102 or later. To learn more, see [How to install extensions][how-to-install-extensions].
- Existing Keyvault
- Existing Azure Subscription with EnableWorkloadIdentityPreview feature enabled
- Existing AKS cluster with enable-oidc-issuer and enable-workload-identity enabled

Azure AD workload identity (preview) is supported on both Windows and Linux clusters.

### Configure workload identity

1. Use the Azure CLI `az account set` command to set a specific subscription to be the current active subscription. Then use the `az identity create` command to create a managed identity.

    ```azurecli-interactive
    export SUBSCRIPTION_ID=<subscription id>
    export RESOURCE_GROUP=<resource group name>
    export UAMI=<name for user assigned identity>
    export KEYVAULT_NAME=<existing keyvault name>
    export CLUSTER_NAME=<aks cluster name>
    
    az account set --subscription $SUBSCRIPTION_ID
    az identity create --name $UAMI --resource-group $RESOURCE_GROUP
    export USER_ASSIGNED_CLIENT_ID="$(az identity show -g $RESOURCE_GROUP --name $UAMI --query 'clientId' -o tsv)"
    export IDENTITY_TENANT=$(az aks show --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --query identity.tenantId -o tsv)
    ```

2. You need to set an access policy that grants the workload identity permission to access the Key Vault secrets, access keys, and certificates. The rights are assigned using the `az keyvault set-policy` command shown below.

    ```azurecli-interactive
    az keyvault set-policy -n $KEYVAULT_NAME --key-permissions get --spn $USER_ASSIGNED_CLIENT_ID
    az keyvault set-policy -n $KEYVAULT_NAME --secret-permissions get --spn $USER_ASSIGNED_CLIENT_ID
    az keyvault set-policy -n $KEYVAULT_NAME --certificate-permissions get --spn $USER_ASSIGNED_CLIENT_ID
    ```

3. Run the [az aks show][az-aks-show] command to get the AKS cluster OIDC issuer URL.

    ```bash
    export AKS_OIDC_ISSUER="$(az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --query "oidcIssuerProfile.issuerUrl" -o tsv)"
    echo $AKS_OIDC_ISSUER
    ```

    > [!NOTE]
    > If the URL is empty, verify you have installed the latest version of the `aks-preview` extension, version 0.5.102 or later. Also verify you've [enabled the
    > OIDC issuer][enable-oidc-issuer] (preview).

4. Establish a federated identity credential between the Azure AD application and the service account issuer and subject. Get the object ID of the Azure AD application. Update the values for `serviceAccountName` and `serviceAccountNamespace` with the Kubernetes service account name and its namespace.

    ```bash
    export SERVICE_ACCOUNT_NAME="workload-identity-sa"  # sample name; can be changed
    export SERVICE_ACCOUNT_NAMESPACE="default" # can be changed to namespace of your workload
    
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      annotations:
        azure.workload.identity/client-id: ${USER_ASSIGNED_CLIENT_ID}
      labels:
        azure.workload.identity/use: "true"
      name: ${SERVICE_ACCOUNT_NAME}
      namespace: ${SERVICE_ACCOUNT_NAMESPACE}
    EOF
    ```

    Next, use the [az identity federated-credential create][az-identity-federated-credential-create] command to create the federated identity credential between the Managed Identity, the service account issuer, and the subject. 

    ```bash
    export FEDERATED_IDENTITY_NAME="aksfederatedidentity" # can be changed as needed
    az identity federated-credential create --name $FEDERATED_IDENTITY_NAME --identity-name $UAMI --resource-group $RESOURCE_GROUP --issuer ${AKS_OIDC_ISSUER} --subject system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}
    ```
5. Deploy a `SecretProviderClass` by using the following YAML script, noticing that the variables will be interpolated:

    ```bash
    cat <<EOF | kubectl apply -f -
    # This is a SecretProviderClass example using workload identity to access your key vault
    apiVersion: secrets-store.csi.x-k8s.io/v1
    kind: SecretProviderClass
    metadata:
      name: azure-kvname-workload-identity # needs to be unique per namespace
    spec:
      provider: azure
      parameters:
        usePodIdentity: "false"
        useVMManagedIdentity: "false"          
        clientID: "${USER_ASSIGNED_CLIENT_ID}" # Setting this to use workload identity
        keyvaultName: ${KEYVAULT_NAME}       # Set to the name of your key vault
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
        tenantId: "${IDENTITY_TENANT}"        # The tenant ID of the key vault
    EOF
    ```

    > [!NOTE]
    > If you use `objectAlias` instead of `objectName`, make sure to update the YAML script.

6. Deploy a sample pod. Notice the service account reference in the pod definition:

    ```bash
    cat <<EOF | kubectl apply -f -
    # This is a sample pod definition for using SecretProviderClass and the user-assigned identity to access your key vault
    kind: Pod
    apiVersion: v1
    metadata:
      name: busybox-secrets-store-inline-user-msi
      labels:
        azure.workload.identity/use: true
    spec:
      serviceAccountName: ${SERVICE_ACCOUNT_NAME}
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
              secretProviderClass: "azure-kvname-workload-identity"
    EOF   
    ```

## Access with a user-assigned managed identity

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

    > [!NOTE]
    > If you use `objectAlias` instead of `objectName`, make sure to update the YAML script.

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
## Next steps

To validate that the secrets are mounted at the volume path that's specified in your pod's YAML, see [Use the Azure Key Vault Provider for Secrets Store CSI Driver in an AKS cluster][validate-secrets].

<!-- LINKS INTERNAL -->

[csi-secrets-store-driver]: ./csi-secrets-store-driver.md
[aad-pod-identity]: ./use-azure-ad-pod-identity.md
[aad-pod-identity-create]: ./use-azure-ad-pod-identity.md#create-an-identity
[use-managed-identity]: ./use-managed-identity.md
[validate-secrets]: ./csi-secrets-store-driver.md#validate-the-secrets
[enable-system-assigned-identity]: ../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md#enable-system-assigned-managed-identity-on-an-existing-azure-vm
[workload-identity-overview]: workload-identity-overview.md
[how-to-install-extensions]: /cli/azure/azure-cli-extensions-overview#how-to-install-extensions
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-rest]: /cli/azure/reference-index#az-rest
[az-identity-federated-credential-create]: /cli/azure/identity/federated-credential#az-identity-federated-credential-create
[enable-oidc-issuer]: use-oidc-issuer.md
[workload-identity]: ./workload-identity-overview.md
<!-- LINKS EXTERNAL -->
