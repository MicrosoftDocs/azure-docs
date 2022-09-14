---
title: Deploy and configure an Azure Kubernetes Service (AKS) cluster with workload identity (preview)
description: In this Azure Kubernetes Service (AKS) article, you deploy an Azure Kubernetes Service cluster and configure it with an Azure AD workload identity (preview).
services: container-service
ms.topic: article
ms.date: 09/13/2022
---

# Deploy and configure workload identity (preview) on an Azure Kubernetes Service (AKS) cluster

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage Kubernetes clusters. In this article, you will:

* Deploy an AKS cluster using the Azure CLI that includes the OpenID Connect Issuer and workload identity (preview)
* Grant access to your Azure Key Vault
* Create an Azure Active Directory (Azure AD) application and Kubernetes service account
* Configure the Azure AD app for token federation.

This article assumes you have a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts]. 

- This article requires version 2.32.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- You have installed the latest version of the `aks-preview` extension, version 0.5.102 or later.

- The identity you are using to create your cluster has the appropriate minimum permissions. For more details on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)][aks-identity-concepts].

- If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the
[az account][az-account] command.

## Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

To install the aks-preview extension, run the following command:

```azurecli
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli
az extension update --name aks-preview
```

## Create AKS cluster

Create an AKS cluster using the [az aks create][az-aks-create] command with the `--enable-oidc-issuer` parameter to use the OIDC Issuer. The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*:

```azurecli-interactive
az aks create -g myResourceGroup -n myAKSCluster --node-count 1 --enable-oidc-issuer --enable-workload-identity --generate-ssh-keys
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

> [!NOTE]
> When you create an AKS cluster, a second resource group is automatically created to store the AKS resources. For more information, see [Why are two resource groups created with AKS?][aks-two-resource-groups].

To get the OIDC Issuer URL, run the following command:

```azurecli
    AKS_OIDC_ISSUER=$(az aks show -n aks -g myResourceGroup --query "oidcIssuerProfile.issuerUrl" -otsv)
```

## Create a Managed Identity and grant permissions to access Azure Key Vault

This step is necessary if you need to access secrets, keys, and certificates that are mounted in Azure Key Vault from a pod. Perform the following steps to configure access with a managed identity. These steps assume you have an Azure Key Vault already created and configured in your subscription. If you don't have one, see [Create an Azure Key Vault using the Azure CLI][create-key-vault-azure-cli].

Before proceeding, you need the following information:

* Name of the Key Vault
* Resource group holding the Key Vault

1. Use the Azure CLI [az account set][az-account-set] command to set a specific subscription to be the current active subscription. Then use the [az identity create][az-identity-create] command to create a Managed Identity.

    ```azurecli
    az account set --subscription "subscriptionID
    ```

    ```azurecli
    az identity create --name "userAssignedIdentityName" --resource-group "resourceGroupName" --location "location" --subscription "subscriptionID"
    ```

2. Set an access policy for the Managed Identity to access the Key Vault secret by running the following commands:

    ```bash
    export USER_ASSIGNED_CLIENT_ID="$(az identity show --resource-group "resourceGroupName" --name "userAssignedIdentityName" --query 'clientId' -otsv)"
    ```

    ```azurecli
    az keyvault set-policy --name "keyVaultName" --secret-permissions get --spn "${USER_ASSIGNED_CLIENT_ID}"
    ```

## Create Kubernetes service account

Create a Kubernetes service account and annotate it with the client ID of the Managed Identity created in the previous step. Use the [az aks get-credentials][az-aks-get-credentials] command.

```azurecli
az aks get-credentials -n aks -g MyResourceGroup 
cat <<EOF | kubectl apply -f -
apiVersion: v1
 kind: ServiceAccount
 metadata:
   annotations:
     azure.workload.identity/client-id: ${USER_ASSIGNED_CLIENT_ID}
   labels:
     azure.workload.identity/use: "true"
   name: serviceAccountName
   namespace: serviceAccountNamespace
 EOF
```

The following output resemble successful creation of the identity:

```output
Serviceaccount/workload-identity-sa created
```

## Establish federated identity credential

Use the [az rest][az-rest] command to invoke a custom request to establish the federated identity credential between the Managed Identity, the service account issuer, and the subject.

```azurecli
az rest --method put --url "/subscriptions/${SUBSCRIPTION}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/${UAID}/federatedIdentityCredentials/${FICID}?api-version=2022-01-31-PREVIEW" --headers "Content-Type=application/json" --body "{'properties':{'issuer':'${AKS_OIDC_ISSUER}','subject':'system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}','audiences':['api://AzureADTokenExchange'] }}"
```

## Next steps

In this article, you deployed a Kubernetes cluster and configured it to use a workload identity in preparation for application workloads to authenticate with that credential.  

<!-- EXTERNAL LINKS -->

<!-- INTERNAL LINKS -->
[kubernetes-concepts]: ../concepts-clusters-workloads.md
[create-key-vault-azure-cli]: ../key-vault/general/quick-create-cli.md
[aks-identity-concepts]: ../concepts-identity.md
[az-account]: /cli/azure/account
[az-aks-create]: /cli/azure/aks#az-aks-create
[aks-two-resource-groups]: ../faq.md#why-are-two-resource-groups-created-with-aks
[az-account-set]: /cli/azure/account#az-account-set
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-rest]: /cli/azure/reference-index#az-rest