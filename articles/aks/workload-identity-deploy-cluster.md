---
title: Deploy and configure an Azure Kubernetes Service (AKS) cluster with workload identity
description: In this Azure Kubernetes Service (AKS) article, you deploy an Azure Kubernetes Service cluster and configure it with an Azure AD workload identity.
ms.topic: article
ms.custom: devx-track-azurecli, devx-track-linux
ms.date: 07/26/2023
---

# Deploy and configure workload identity on an Azure Kubernetes Service (AKS) cluster

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage Kubernetes clusters. In this article, you will:

* Deploy an AKS cluster using the Azure CLI that includes the OpenID Connect Issuer and an Azure AD workload identity
* Grant access to your Azure Key Vault
* Create an Azure Active Directory (Azure AD) workload identity and Kubernetes service account
* Configure the managed identity for token federation.

This article assumes you have a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts]. If you aren't familiar with Azure AD workload identity, see the following [Overview][workload-identity-overview] article.

- This article requires version 2.47.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- The identity you're using to create your cluster has the appropriate minimum permissions. For more information about access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)][aks-identity-concepts].

- If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the [az account][az-account] command.

## Export environmental variables

To help simplify steps to configure the identities required, the steps below define
environmental variables for reference on the cluster.

Run the following commands to create these variables. Replace the default values for `RESOURCE_GROUP`, `LOCATION`, `SERVICE_ACCOUNT_NAME`, `SUBSCRIPTION`, `USER_ASSIGNED_IDENTITY_NAME`, and `FEDERATED_IDENTITY_CREDENTIAL_NAME`.  

```bash
export RESOURCE_GROUP="myResourceGroup"
export LOCATION="westcentralus"
export SERVICE_ACCOUNT_NAMESPACE="default"
export SERVICE_ACCOUNT_NAME="workload-identity-sa"
export SUBSCRIPTION="$(az account show --query id --output tsv)"
export USER_ASSIGNED_IDENTITY_NAME="myIdentity"
export FEDERATED_IDENTITY_CREDENTIAL_NAME="myFedIdentity" 
```

## Create AKS cluster

Create an AKS cluster using the [az aks create][az-aks-create] command with the `--enable-oidc-issuer` parameter to use the OIDC Issuer. The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*:

```azurecli-interactive
az aks create -g "${RESOURCE_GROUP}" -n myAKSCluster --enable-oidc-issuer --enable-workload-identity --generate-ssh-keys
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

> [!NOTE]
> When you create an AKS cluster, a second resource group is automatically created to store the AKS resources. For more information, see [Why are two resource groups created with AKS?][aks-two-resource-groups].

## Update an existing AKS cluster

You can update an AKS cluster using the [az aks update][az aks update] command with the `--enable-oidc-issuer` and the `--enable-workload-identity` parameter to use the OIDC Issuer and enable workload identity. The following example updates a cluster named *myAKSCluster*:

```azurecli-interactive
az aks update -g "${RESOURCE_GROUP}" -n myAKSCluster --enable-oidc-issuer --enable-workload-identity
```

## Retrieve the OIDC Issuer URL

To get the OIDC Issuer URL and save it to an environmental variable, run the following command. Replace the default value for the arguments `-n`, which is the name of the cluster:

```bash
export AKS_OIDC_ISSUER="$(az aks show -n myAKSCluster -g "${RESOURCE_GROUP}" --query "oidcIssuerProfile.issuerUrl" -otsv)"
```

The variable should contain the Issuer URL similar to the following example:

```output
https://eastus.oic.prod-aks.azure.com/00000000-0000-0000-0000-000000000000/00000000-0000-0000-0000-000000000000/
```

By default, the Issuer is set to use the base URL `https://{region}.oic.prod-aks.azure.com/{uuid}`, where the value for `{region}` matches the location the AKS cluster is deployed in. The value `{uuid}` represents the OIDC key.

## Create a managed identity

Use the Azure CLI [az account set][az-account-set] command to set a specific subscription to be the current active subscription. Then use the [az identity create][az-identity-create] command to create a managed identity.

```azurecli-interactive
az identity create --name "${USER_ASSIGNED_IDENTITY_NAME}" --resource-group "${RESOURCE_GROUP}" --location "${LOCATION}" --subscription "${SUBSCRIPTION}"
```

Next, let's create a variable for the managed identity ID.

```bash
export USER_ASSIGNED_CLIENT_ID="$(az identity show --resource-group "${RESOURCE_GROUP}" --name "${USER_ASSIGNED_IDENTITY_NAME}" --query 'clientId' -otsv)"
```

## Create Kubernetes service account

Create a Kubernetes service account and annotate it with the client ID of the managed identity created in the previous step. Use the [az aks get-credentials][az-aks-get-credentials] command and replace the values for the cluster name and the resource group name.

```azurecli-interactive
az aks get-credentials -n myAKSCluster -g "${RESOURCE_GROUP}"
```

Copy and paste the following multi-line input in the Azure CLI.

```bash
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

The following output resembles successful creation of the identity:

```output
Serviceaccount/workload-identity-sa created
```

## Establish federated identity credential

Use the [az identity federated-credential create][az-identity-federated-credential-create] command to create the federated identity credential between the managed identity, the service account issuer, and the subject.

```azurecli-interactive
az identity federated-credential create --name ${FEDERATED_IDENTITY_CREDENTIAL_NAME} --identity-name "${USER_ASSIGNED_IDENTITY_NAME}" --resource-group "${RESOURCE_GROUP}" --issuer "${AKS_OIDC_ISSUER}" --subject system:serviceaccount:"${SERVICE_ACCOUNT_NAMESPACE}":"${SERVICE_ACCOUNT_NAME}" --audience api://AzureADTokenExchange
```

> [!NOTE]
> It takes a few seconds for the federated identity credential to be propagated after being initially added. If a token request is made immediately after adding the federated identity credential, it might lead to failure for a couple of minutes as the cache is populated in the directory with old data. To avoid this issue, you can add a slight delay after adding the federated identity credential.

## Deploy your application

When you deploy your application pods, the manifest should reference the service account created in the **Create Kubernetes service account** step. The following manifest shows how to reference the account, specifically *metadata\namespace* and *spec\serviceAccountName* properties:

```yml
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: quick-start
  namespace: "${SERVICE_ACCOUNT_NAMESPACE}"
  labels:
    azure.workload.identity/use: "true"
spec:
  serviceAccountName: "${SERVICE_ACCOUNT_NAME}"
EOF
```

> [!IMPORTANT]
> Ensure your application pods using workload identity have added the following label [azure.workload.identity/use: "true"] to your running pods/deployments, otherwise the pods will fail once restarted.

```bash
kubectl apply -f <your application>
```

To check whether all properties are injected properly by the webhook, use the [kubectl describe][kubectl-describe] command:

```bash
kubectl describe pod containerName
```

To verify that pod is able to get a token and access the resource, use the kubectl logs command:

```bash
kubectl logs containerName
```

## Optional - Grant permissions to access Azure Key Vault

This step is necessary if you need to access secrets, keys, and certificates that are mounted in Azure Key Vault from a pod. Perform the following steps to configure access with a managed identity. These steps assume you have an Azure Key Vault already created and configured in your subscription. If you don't have one, see [Create an Azure Key Vault using the Azure CLI][create-key-vault-azure-cli].

Before proceeding, you need the following information:

* Name of the Key Vault
* Resource group holding the Key Vault

You can retrieve this information using the Azure CLI command: [az keyvault list][az-keyvault-list].

1. Set an access policy for the managed identity to access secrets in your Key Vault by running the following commands:

    ```azurecli-interactive
    export RESOURCE_GROUP="myResourceGroup"
    export USER_ASSIGNED_IDENTITY_NAME="myIdentity"
    export KEYVAULT_NAME="myKeyVault"
    export USER_ASSIGNED_CLIENT_ID="$(az identity show --resource-group "${RESOURCE_GROUP}" --name "${USER_ASSIGNED_IDENTITY_NAME}" --query 'clientId' -otsv)"

    az keyvault set-policy --name "${KEYVAULT_NAME}" --secret-permissions get --spn "${USER_ASSIGNED_CLIENT_ID}"
    ```

## Disable workload identity

To disable the Azure AD workload identity on the AKS cluster where it's been enabled and configured, you can run the following command:

```azurecli-interactive
az aks update --resource-group myResourceGroup --name myAKSCluster --disable-workload-identity
```

## Next steps

In this article, you deployed a Kubernetes cluster and configured it to use a workload identity in preparation for application workloads to authenticate with that credential. Now you're ready to deploy your application and configure it to use the workload identity with the latest version of the [Azure Identity][azure-identity-libraries] client library. If you can't rewrite your application to use the latest client library version, you can [set up your application pod][workload-identity-migration] to authenticate using managed identity with workload identity as a short-term migration solution.

<!-- EXTERNAL LINKS -->
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe

<!-- INTERNAL LINKS -->
[kubernetes-concepts]: concepts-clusters-workloads.md
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[workload-identity-overview]: workload-identity-overview.md
[create-key-vault-azure-cli]: ../key-vault/general/quick-create-cli.md
[az-keyvault-list]: /cli/azure/keyvault#az-keyvault-list
[aks-identity-concepts]: concepts-identity.md
[az-account]: /cli/azure/account
[az-aks-create]: /cli/azure/aks#az-aks-create
[az aks update]: /cli/azure/aks#az-aks-update
[aks-two-resource-groups]: faq.md#why-are-two-resource-groups-created-with-aks
[az-account-set]: /cli/azure/account#az-account-set
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-identity-federated-credential-create]: /cli/azure/identity/federated-credential#az-identity-federated-credential-create
[workload-identity-migration]: workload-identity-migrate-from-pod-identity.md
[azure-identity-libraries]: ../active-directory/develop/reference-v2-libraries.md
