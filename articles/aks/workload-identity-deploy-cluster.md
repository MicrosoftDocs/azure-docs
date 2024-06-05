---
title: Deploy and configure an AKS cluster with workload identity
description: In this Azure Kubernetes Service (AKS) article, you deploy an Azure Kubernetes Service cluster and configure it with a Microsoft Entra Workload ID.
author: tamram

ms.topic: article
ms.subservice: aks-security
ms.custom: devx-track-azurecli
ms.date: 05/28/2024
ms.author: tamram
---

# Deploy and configure workload identity on an Azure Kubernetes Service (AKS) cluster

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage Kubernetes clusters. This article shows you how to:

* Deploy an AKS cluster using the Azure CLI with the OpenID Connect issuer and a Microsoft Entra Workload ID.
* Create a Microsoft Entra Workload ID and Kubernetes service account.
* Configure the managed identity for token federation.
* Deploy the workload and verify authentication with the workload identity.
* Optionally grant a pod in the cluster access to secrets in an Azure key vault.

This article assumes you have a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts]. If you aren't familiar with Microsoft Entra Workload ID, see the following [Overview][workload-identity-overview] article.

## Prerequisites

* [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
* This article requires version 2.47.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
* Make sure that the identity that you're using to create your cluster has the appropriate minimum permissions. For more information about access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)][aks-identity-concepts].
* If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the [az account set][az-account-set] command.

> [!NOTE]
> You can use _Service Connector_ to help you configure some steps automatically. See also: [Tutorial: Connect to Azure storage account in Azure Kubernetes Service (AKS) with Service Connector using workload identity][tutorial-python-aks-storage-workload-identity].

## Set the active subscription

First, set your subscription as the current active subscription by calling the [az account set][az-account-set] command and passing in your subscription ID.

```azurecli-interactive
az account set --subscription <subscription-id>
```

## Export environment variables

To help simplify steps to configure the identities required, the steps below define environment variables that are referenced in the examples in this article. Remember to replace the values shown with your own values:

  ```azurecli-interactive
  export RESOURCE_GROUP="myResourceGroup"
  export LOCATION="eastus"
  export CLUSTER_NAME="myAKSCluster"
  export SERVICE_ACCOUNT_NAMESPACE="default"
  export SERVICE_ACCOUNT_NAME="workload-identity-sa"
  export SUBSCRIPTION="$(az account show --query id --output tsv)"
  export USER_ASSIGNED_IDENTITY_NAME="myIdentity"
  export FEDERATED_IDENTITY_CREDENTIAL_NAME="myFedIdentity"
  # Include these variables to access key vault secrets from a pod in the cluster.
  export KEYVAULT_NAME="keyvault-workload-id"
  export KEYVAULT_SECRET_NAME="my-secret"
  ```

## Create a resource group

An [Azure resource group][azure-resource-group] is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're prompted to specify a location. This location is the storage location of your resource group metadata and where your resources run in Azure if you don't specify another region during resource creation.

Create a resource group by calling the [az group create][az-group-create] command:

```azurecli-interactive
az group create --name "${RESOURCE_GROUP}" --location "${LOCATION}"
```

The following output example shows successful creation of a resource group:

```json
{
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup",
  "location": "eastus",
  "managedBy": null,
  "name": "myResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Create an AKS cluster

Create an AKS cluster using the [az aks create][az-aks-create] command with the `--enable-oidc-issuer` parameter to enable the OIDC issuer. The following example creates a cluster with a single node:

```azurecli-interactive
az aks create \
    --resource-group "${RESOURCE_GROUP}" \
    --name "${CLUSTER_NAME}" \
    --enable-oidc-issuer \
    --enable-workload-identity \
    --generate-ssh-keys
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

> [!NOTE]
> When you create an AKS cluster, a second resource group is automatically created to store the AKS resources. For more information, see [Why are two resource groups created with AKS?][aks-two-resource-groups].

## Update an existing AKS cluster

You can update an AKS cluster to use the OIDC issuer and enable workload identity by calling the [az aks update][az aks update] command with the `--enable-oidc-issuer` and the `--enable-workload-identity` parameters. The following example updates an existing cluster:

```azurecli-interactive
az aks update \
    --resource-group "${RESOURCE_GROUP}" \
    --name "${CLUSTER_NAME}" \
    --enable-oidc-issuer \
    --enable-workload-identity
```

## Retrieve the OIDC issuer URL

To get the OIDC issuer URL and save it to an environmental variable, run the following command:

```azurecli-interactive
export AKS_OIDC_ISSUER="$(az aks show --name "${CLUSTER_NAME}" \
    --resource-group "${RESOURCE_GROUP}" \
    --query "oidcIssuerProfile.issuerUrl" \
    --output tsv)"
```

The environment variable should contain the issuer URL, similar to the following example:

```output
https://eastus.oic.prod-aks.azure.com/00000000-0000-0000-0000-000000000000/11111111-1111-1111-1111-111111111111/
```

By default, the issuer is set to use the base URL `https://{region}.oic.prod-aks.azure.com/{tenant_id}/{uuid}`, where the value for `{region}` matches the location to which the AKS cluster is deployed. The value `{uuid}` represents the OIDC key, which is a randomly generated guid for each cluster that is immutable.

## Create a managed identity

Call the [az identity create][az-identity-create] command to create a managed identity.

```azurecli-interactive
az identity create \
    --name "${USER_ASSIGNED_IDENTITY_NAME}" \
    --resource-group "${RESOURCE_GROUP}" \
    --location "${LOCATION}" \
    --subscription "${SUBSCRIPTION}"
```

Next, create a variable for the managed identity's client ID.

```azurecli-interactive
export USER_ASSIGNED_CLIENT_ID="$(az identity show \
    --resource-group "${RESOURCE_GROUP}" \
    --name "${USER_ASSIGNED_IDENTITY_NAME}" \
    --query 'clientId' \
    --output tsv)"
```

## Create a Kubernetes service account

Create a Kubernetes service account and annotate it with the client ID of the managed identity created in the previous step. Use the [az aks get-credentials][az-aks-get-credentials] command and replace the values for the cluster name and the resource group name.

```azurecli-interactive
az aks get-credentials --name "${CLUSTER_NAME}" --resource-group "${RESOURCE_GROUP}"
```

Copy and paste the following multi-line input in the Azure CLI.

```azurecli-interactive
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  annotations:
    azure.workload.identity/client-id: "${USER_ASSIGNED_CLIENT_ID}"
  name: "${SERVICE_ACCOUNT_NAME}"
  namespace: "${SERVICE_ACCOUNT_NAMESPACE}"
EOF
```

The following output shows successful creation of the workload identity:

```output
serviceaccount/workload-identity-sa created
```

## Create the federated identity credential

Call the [az identity federated-credential create][az-identity-federated-credential-create] command to create the federated identity credential between the managed identity, the service account issuer, and the subject. For more information about federated identity credentials in Microsoft Entra, see [Overview of federated identity credentials in Microsoft Entra ID][federated-identity-credential].

```azurecli-interactive
az identity federated-credential create \
    --name ${FEDERATED_IDENTITY_CREDENTIAL_NAME} \
    --identity-name "${USER_ASSIGNED_IDENTITY_NAME}" \
    --resource-group "${RESOURCE_GROUP}" \
    --issuer "${AKS_OIDC_ISSUER}" \
    --subject system:serviceaccount:"${SERVICE_ACCOUNT_NAMESPACE}":"${SERVICE_ACCOUNT_NAME}" \
    --audience api://AzureADTokenExchange
```

> [!NOTE]
> It takes a few seconds for the federated identity credential to propagate after it is added. If a token request is made immediately after adding the federated identity credential, the request might fail until the cache is refreshed. To avoid this issue, you can add a slight delay after adding the federated identity credential.

## Deploy your application

When you deploy your application pods, the manifest should reference the service account created in the **Create Kubernetes service account** step. The following manifest shows how to reference the account, specifically the _metadata\namespace_ and _spec\serviceAccountName_ properties. Make sure to specify an image for `<image>` and a container name for `<containerName>`:

```yml
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: sample-workload-identity
  namespace: ${SERVICE_ACCOUNT_NAMESPACE}
  labels:
    azure.workload.identity/use: "true"  # Required. Only pods with this label can use workload identity.
spec:
  serviceAccountName: ${SERVICE_ACCOUNT_NAME}
  containers:
    - image: <image>
      name: <containerName>
EOF
```

> [!IMPORTANT]
> Ensure that the application pods using workload identity include the label `azure.workload.identity/use: "true"` in the pod spec. Otherwise the pods will fail after they are restarted.

## Grant permissions to access Azure Key Vault

The instructions in this step show how to access secrets, keys, or certificates in an Azure key vault from the pod. The examples in this section  configure access to secrets in the key vault for the workload identity, but you can perform similar steps to configure access to keys or certificates.

The following example shows how to use the Azure role-based access control (Azure RBAC) permission model to grant the pod access to the key vault. For more information about the Azure RBAC permission model for Azure Key Vault, see [Grant permission to applications to access an Azure key vault using Azure RBAC](../key-vault/general/rbac-guide.md).

1. Create a key vault with purge protection and RBAC authorization enabled. You can also use an existing key vault if it is configured for both purge protection and RBAC authorization:

    ```azurecli-interactive
    export KEYVAULT_RESOURCE_GROUP="myResourceGroup"
    export KEYVAULT_NAME="myKeyVault"

    az keyvault create \
        --name "${KEYVAULT_NAME}" \
        --resource-group "${KEYVAULT_RESOURCE_GROUP}" \
        --location "${LOCATION}" \
        --enable-purge-protection \
        --enable-rbac-authorization
    ```

1. Assign yourself the RBAC [Key Vault Secrets Officer](../role-based-access-control/built-in-roles/security.md#key-vault-secrets-officer) role so that you can create a secret in the new key vault:

    ```azurecli-interactive
    export KEYVAULT_RESOURCE_ID=$(az keyvault show --resource-group "${KEYVAULT_RESOURCE_GROUP}" \
        --name "${KEYVAULT_NAME}" \
        --query id \
        --output tsv)

    az role assignment create --assignee "\<user-email\>" \
        --role "Key Vault Secrets Officer" \
        --scope "${KEYVAULT_RESOURCE_ID}"
    ```

1. Create a secret in the key vault:

    ```azurecli-interactive
    export KEYVAULT_SECRET_NAME="my-secret"

    az keyvault secret set \
        --vault-name "${KEYVAULT_NAME}" \
        --name "${KEYVAULT_SECRET_NAME}" \
        --value "Hello\!"
    ```

1. Assign the [Key Vault Secrets User](../role-based-access-control/built-in-roles/security.md#key-vault-secrets-user) role to the user-assigned managed identity that you created previously. This step gives the managed identity permission to read secrets from the key vault:

    ```azurecli-interactive
    export IDENTITY_PRINCIPAL_ID=$(az identity show \
        --name "${USER_ASSIGNED_IDENTITY_NAME}" \
        --resource-group "${RESOURCE_GROUP}" \
        --query principalId \
        --output tsv)
    
    az role assignment create \
        --assignee-object-id "${IDENTITY_PRINCIPAL_ID}" \
        --role "Key Vault Secrets User" \
        --scope "${KEYVAULT_RESOURCE_ID}" \
        --assignee-principal-type ServicePrincipal
    ```

1. Create an environment variable for the key vault URL:

    ```azurecli-interactive
    export KEYVAULT_URL="$(az keyvault show \
        --resource-group ${KEYVAULT_RESOURCE_GROUP} \
        --name ${KEYVAULT_NAME} \
        --query properties.vaultUri \
        --output tsv)"
    ```

1. Deploy a pod that references the service account and key vault URL:

    ```yml
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: Pod
    metadata:
      name: sample-workload-identity-key-vault
      namespace: ${SERVICE_ACCOUNT_NAMESPACE}
      labels:
        azure.workload.identity/use: "true"
    spec:
      serviceAccountName: ${SERVICE_ACCOUNT_NAME}
      containers:
        - image: ghcr.io/azure/azure-workload-identity/msal-go
          name: oidc
          env:
          - name: KEYVAULT_URL
            value: ${KEYVAULT_URL}
          - name: SECRET_NAME
            value: ${KEYVAULT_SECRET_NAME}
      nodeSelector:
        kubernetes.io/os: linux
    EOF
    ```

To check whether all properties are injected properly by the webhook, use the [kubectl describe][kubectl-describe] command:

```azurecli-interactive
kubectl describe pod sample-workload-identity-key-vault | grep "SECRET_NAME:"
```

If successful, the output should be similar to the following:

```bash
      SECRET_NAME:                 ${KEYVAULT_SECRET_NAME}
```

To verify that pod is able to get a token and access the resource, use the kubectl logs command:

```azurecli-interactive
kubectl logs sample-workload-identity-key-vault
```

If successful, the output should be similar to the following:

```bash
I0114 10:35:09.795900       1 main.go:63] "successfully got secret" secret="Hello\\!"
```

> [!IMPORTANT]
> Azure RBAC role assignments can take up to ten minutes to propagate. If the pod is unable to access the secret, you may need to wait for the role assignment to propagate. For more information, see [Troubleshoot Azure RBAC](../role-based-access-control/troubleshooting.md#).

## Disable workload identity

To disable the Microsoft Entra Workload ID on the AKS cluster where it's been enabled and configured, you can run the following command:

```azurecli-interactive
az aks update \
    --resource-group "${RESOURCE_GROUP}" \
    --name "${CLUSTER_NAME}" \
    --disable-workload-identity
```

## Next steps

In this article, you deployed a Kubernetes cluster and configured it to use a workload identity in preparation for application workloads to authenticate with that credential. Now you're ready to deploy your application and configure it to use the workload identity with the latest version of the [Azure Identity][azure-identity-libraries] client library. If you can't rewrite your application to use the latest client library version, you can [set up your application pod][workload-identity-migration] to authenticate using managed identity with workload identity as a short-term migration solution.

<!-- EXTERNAL LINKS -->
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe

<!-- INTERNAL LINKS -->
[kubernetes-concepts]: concepts-clusters-workloads.md
[workload-identity-overview]: workload-identity-overview.md
[azure-resource-group]: ../azure-resource-manager/management/overview.md
[az-group-create]: /cli/azure/group#az-group-create
[aks-identity-concepts]: concepts-identity.md
[federated-identity-credential]: /graph/api/resources/federatedidentitycredentials-overview
[tutorial-python-aks-storage-workload-identity]: ../service-connector/tutorial-python-aks-storage-workload-identity.md
[az-aks-create]: /cli/azure/aks#az-aks-create
[az aks update]: /cli/azure/aks#az-aks-update
[aks-two-resource-groups]: faq.md#why-are-two-resource-groups-created-with-aks
[az-account-set]: /cli/azure/account#az-account-set
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-identity-federated-credential-create]: /cli/azure/identity/federated-credential#az-identity-federated-credential-create
[workload-identity-migration]: workload-identity-migrate-from-pod-identity.md
[azure-identity-libraries]: ../active-directory/develop/reference-v2-libraries.md
