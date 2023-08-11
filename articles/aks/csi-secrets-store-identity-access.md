---
title: Provide an access identity to the Azure Key Vault Provider for Secrets Store CSI Driver for Azure Kubernetes Service (AKS) secrets
description: Learn about the various methods that you can use to allow the Azure Key Vault Provider for Secrets Store CSI Driver to integrate with your Azure key vault.
author: nickomang 
ms.author: nickoman
ms.topic: article
ms.date: 02/27/2023
ms.custom: devx-track-azurecli, devx-track-linux
---

# Provide an identity to access the Azure Key Vault Provider for Secrets Store CSI Driver

The Secrets Store CSI Driver on Azure Kubernetes Service (AKS) provides various methods of identity-based access to your Azure key vault. This article outlines these methods and how to use them to access your key vault and its contents from your AKS cluster. For more information, see [Use the Secrets Store CSI Driver][csi-secrets-store-driver].

Currently, the following methods of access are available:

- Azure AD Workload identity
- User-assigned managed identity

## Access with an Azure AD workload identity

An [Azure AD workload identity][workload-identity] is an identity that an application running on a pod uses that authenticates itself against other Azure services that support it, such as Storage or SQL. It integrates with the native Kubernetes capabilities to federate with external identity providers. In this security model, the AKS cluster acts as token issuer. Azure Active Directory (Azure AD) then uses OpenID Connect (OIDC) to discover public signing keys and verify the authenticity of the service account token before exchanging it for an Azure AD token. Your workload can exchange a service account token projected to its volume for an Azure AD token using the Azure Identity client library using the Azure SDK or the Microsoft Authentication Library (MSAL).

> [!NOTE]
> This authentication method replaces Azure AD pod-managed identity (preview). The open source Azure AD pod-managed identity (preview) in Azure Kubernetes Service has been deprecated as of 10/24/2022.

### Prerequisites

Before you begin, you must have the following prerequisites in place:

- An existing Key Vault.
- An active Azure Subscription.
- An existing AKS cluster with `enable-oidc-issuer` and `enable-workload-identity` enabled

Azure AD workload identity is supported on both Windows and Linux clusters.

### Configure workload identity

1. Set your subscription using the [`az account set`][az-account-set] command.

    ```azurecli-interactive
    export SUBSCRIPTION_ID=<subscription id>
    export RESOURCE_GROUP=<resource group name>
    export UAMI=<name for user assigned identity>
    export KEYVAULT_NAME=<existing keyvault name>
    export CLUSTER_NAME=<aks cluster name>
    
    az account set --subscription $SUBSCRIPTION_ID
    ```

2. Create a managed identity using the [`az identity create`][az-identity-create] command.

    ```azurecli-interactive
    az identity create --name $UAMI --resource-group $RESOURCE_GROUP
    export USER_ASSIGNED_CLIENT_ID="$(az identity show -g $RESOURCE_GROUP --name $UAMI --query 'clientId' -o tsv)"
    export IDENTITY_TENANT=$(az aks show --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --query identity.tenantId -o tsv)
    ```

3. You need to set an access policy that grants the workload identity permission to access the Key Vault secrets, access keys, and certificates. Assign these rights using the [`az keyvault set-policy`][az-keyvault-set-policy] command.

    ```azurecli-interactive
    az keyvault set-policy -n $KEYVAULT_NAME --key-permissions get --spn $USER_ASSIGNED_CLIENT_ID
    az keyvault set-policy -n $KEYVAULT_NAME --secret-permissions get --spn $USER_ASSIGNED_CLIENT_ID
    az keyvault set-policy -n $KEYVAULT_NAME --certificate-permissions get --spn $USER_ASSIGNED_CLIENT_ID
    ```

4. Get the AKS cluster OIDC Issuer URL using the [`az aks show`][az-aks-show] command.

    ```bash
    export AKS_OIDC_ISSUER="$(az aks show --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --query "oidcIssuerProfile.issuerUrl" -o tsv)"
    echo $AKS_OIDC_ISSUER
    ```

5. You need to establish a federated identity credential between the Azure AD application and the service account issuer and subject. Get the object ID of the Azure AD application using the following commands. Make sure to update the values for `serviceAccountName` and `serviceAccountNamespace` with the Kubernetes service account name and its namespace.

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

6. Create the federated identity credential between the managed identity, service account issuer, and subject using the [`az identity federated-credential create`][az-identity-federated-credential-create] command.

    ```bash
    export FEDERATED_IDENTITY_NAME="aksfederatedidentity" # can be changed as needed
    az identity federated-credential create --name $FEDERATED_IDENTITY_NAME --identity-name $UAMI --resource-group $RESOURCE_GROUP --issuer ${AKS_OIDC_ISSUER} --subject system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}
    ```

7. Deploy a `SecretProviderClass` using the `kubectl apply` command and the following YAML script.

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

8. Deploy a sample pod using the `kubectl apply` command and the following YAML script.

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
          image: registry.k8s.io/e2e-test-images/busybox:1.29-1 
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

1. Access your key vault using the [`az aks show`][az-aks-show] command and the user-assigned managed identity you created when you [enabled a managed identity on your AKS cluster][use-managed-identity].

    ```azurecli-interactive
    az aks show -g <resource-group> -n <cluster-name> --query addonProfiles.azureKeyvaultSecretsProvider.identity.clientId -o tsv
    ```

    Alternatively, you can create a new managed identity and assign it to your virtual machine (VM) scale set or to each VM instance in your availability set using the following commands.

    ```azurecli-interactive
    az identity create -g <resource-group> -n <identity-name> 
    az vmss identity assign -g <resource-group> -n <agent-pool-vmss> --identities <identity-resource-id>
    az vm identity assign -g <resource-group> -n <agent-pool-vm> --identities <identity-resource-id>
    ```

2. Grant your identity the permissions that enable it to read and view the contents of your key vault using the following [`az keyvault set-policy`][az-keyvault-set-policy] commands for each object type.

    ```azurecli-interactive
    # Set policy to access keys in your key vault
    az keyvault set-policy -n <keyvault-name> --key-permissions get --spn <identity-client-id>

    # Set policy to access secrets in your key vault
    az keyvault set-policy -n <keyvault-name> --secret-permissions get --spn <identity-client-id>

    # Set policy to access certs in your key vault
    az keyvault set-policy -n <keyvault-name> --certificate-permissions get --spn <identity-client-id>
    ```

3. Create a `SecretProviderClass` using the following YAML. Make sure to use your own values for `userAssignedIdentityID`, `keyvaultName`, `tenantId`, and the objects to retrieve from your key vault.

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

4. Apply the `SecretProviderClass` to your cluster using the `kubectl apply` command.

    ```bash
    kubectl apply -f secretproviderclass.yaml
    ```

5. Create a pod using the following YAML.

    ```yml
    # This is a sample pod definition for using SecretProviderClass and the user-assigned identity to access your key vault
    kind: Pod
    apiVersion: v1
    metadata:
      name: busybox-secrets-store-inline-user-msi
    spec:
      containers:
        - name: busybox
          image: registry.k8s.io/e2e-test-images/busybox:1.29-1
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

6. Apply the pod to your cluster using the `kubectl apply` command.

    ```bash
    kubectl apply -f pod.yaml
    ```

## Next steps

To validate the secrets are mounted at the volume path specified in your pod's YAML, see [Use the Azure Key Vault Provider for Secrets Store CSI Driver in an AKS cluster][validate-secrets].

<!-- LINKS INTERNAL -->

[csi-secrets-store-driver]: ./csi-secrets-store-driver.md
[use-managed-identity]: ./use-managed-identity.md
[validate-secrets]: ./csi-secrets-store-driver.md#validate-the-secrets
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-identity-federated-credential-create]: /cli/azure/identity/federated-credential#az-identity-federated-credential-create
[workload-identity]: ./workload-identity-overview.md
[az-account-set]: /cli/azure/account#az-account-set
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-keyvault-set-policy]: /cli/azure/keyvault#az-keyvault-set-policy
