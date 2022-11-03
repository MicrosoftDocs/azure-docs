---
title: Tutorial - Use a workload identity with an application on Azure Kubernetes Service (AKS)
description: In this Azure Kubernetes Service (AKS) tutorial, you deploy an Azure Kubernetes Service cluster and configure an application to use a workload identity.
services: container-service
ms.topic: tutorial
ms.date: 09/29/2022
---

# Tutorial: Use a workload identity with an application on Azure Kubernetes Service (AKS)

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage Kubernetes clusters. In this tutorial, you will:

* Deploy an AKS cluster using the Azure CLI with OpenID Connect Issuer and managed identity.
* Create an Azure Key Vault and secret.
* Create an Azure Active Directory workload identity and Kubernetes service account
* Configure the managed identity for token federation
* Deploy the workload and verify authentication with the workload identity.

This tutorial assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [preview features callout](../includes/preview/preview-callout.md)]

- This article requires version 2.40.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

- You have installed the latest version of the `aks-preview` extension, version 0.5.102 or later.

- The identity you are using to create your cluster has the appropriate minimum permissions. For more information on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)][aks-identity-concepts].

- If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the
[az account][az-account] command.

## Create a resource group

An [Azure resource group][azure-resource-group] is a logical group in which Azure resources are deployed and managed. When you create a resource group, you are prompted to specify a location. This location is:

* The storage location of your resource group metadata.
* Where your resources will run in Azure if you don't specify another region during resource creation.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

Create a resource group using the [az group create][az-group-create] command.

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

The following output example resembles successful creation of the resource group:

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

## Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](../includes/preview/preview-callout.md)]

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

To get the OIDC Issuer URL and save it to an environmental variable, run the following command. Replace the default value for the arguments `-n`, which is the name of the cluster and `-g`, the resource group name:

```bash
export AKS_OIDC_ISSUER="$(az aks show -n myAKSCluster -g myResourceGroup --query "oidcIssuerProfile.issuerUrl" -otsv)"
```

## Export environmental variables

To help simplify steps to configure creating Azure Key Vault and other identities required, the steps below define
environmental variables for reference on the cluster.

Run the following commands to create these variables. Replace the default values for `RESOURCE_GROUP`, `LOCATION`, `KEYVAULT_SECRET_NAME`, `SERVICE_ACCOUNT_NAME`, `SUBSCRIPTION`, `UAID`, and `FICID`.  

```bash
# environment variables for the Azure Key Vault resource
export KEYVAULT_NAME="azwi-kv-tutorial"
export KEYVAULT_SECRET_NAME="my-secret"
export RESOURCE_GROUP="resourceGroupName"
export LOCATION="westcentralus"

# environment variables for the Kubernetes Service account & federated identity credential
export SERVICE_ACCOUNT_NAMESPACE="default"
export SERVICE_ACCOUNT_NAME="workload-identity-sa"

# environment variables for the Federated Identity
export SUBSCRIPTION="{your subscription ID}"
# user assigned identity name
export UAID="fic-test-ua"
# federated identity name
export FICID="fic-test-fic-name" 
```

## Create an Azure Key Vault and secret

Use the Azure CLI [az keyvault create][az-keyvault-create] command to create a Key Vault in the resource group created earlier.

```azurecli
az keyvault create --resource-group "${RESOURCE_GROUP}" --location "${LOCATION}" --name "${KEYVAULT_NAME}"
```

The output of this command shows properties of the newly created key vault. Take note of the two properties listed below:

* **Name**: The Vault name you provided to the `--name` parameter above.
* **vaultUri**: In the example, this is `https://<your-unique-keyvault-name>.vault.azure.net/`. Applications that use your vault through its REST API must use this URI.

At this point, your Azure account is the only one authorized to perform any operations on this new vault.

To add a secret to the vault, you need to run the Azure CLI [az keyvault secret set][az-keyvault-secret-set] command to create it. The password is the value you specified for the environment variable `KEYVAULT_SECRET_NAME` and stores the value of **Hello!** in it.

```azurecli
az keyvault secret set --vault-name "${KEYVAULT_NAME}" --name "${KEYVAULT_SECRET_NAME}" --value 'Hello!' 
```

## Create a managed identity and grant permissions to access the secret

Use the Azure CLI [az account set][az-account-set] command to set a specific subscription to be the current active subscription. Then use the [az identity create][az-identity-create] command to create a managed identity.

```azurecli
az account set --subscription "${SUBSCRIPTION}"
```

```azurecli
az identity create --name "${UAID}" --resource-group "${RESOURCE_GROUP}" --location "${LOCATION}" --subscription "${SUBSCRIPTION}"
```

Next, you need to set an access policy for the managed identity to access the Key Vault secret by running the following commands:

```bash
export USER_ASSIGNED_CLIENT_ID="$(az identity show --resource-group "${RESOURCE_GROUP}" --name "${UAID}" --query 'clientId' -otsv)"
```

```azurecli
az keyvault set-policy --name "${KEYVAULT_NAME}" --secret-permissions get --spn "${USER_ASSIGNED_CLIENT_ID}"
```

### Create Kubernetes service account

Create a Kubernetes service account and annotate it with the client ID of the Managed Identity created in the previous step. Use the [az aks get-credentials][az-aks-get-credentials] command and replace the default value for the cluster name and the resource group name.

```azurecli
az aks get-credentials -n myAKSCluster -g "${RESOURCE_GROUP}"
```

Copy and paste the following multi-line input in the Azure CLI.

```bash
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

The following output resembles successful creation of the identity:

```output
Serviceaccount/workload-identity-sa created
```

## Establish federated identity credential

Use the [az identity federated-credential create][az-identity-federated-credential-create] command to create the federated identity credential between the managed identity, the service account issuer, and the subject.

```azurecli
az identity federated-credential create --name ${FICID} --identity-name ${UAID} --resource-group ${RESOURCE_GROUP} --issuer ${AKS_OIDC_ISSUER} --subject system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}
```

> [!NOTE]
> It takes a few seconds for the federated identity credential to be propagated after being initially added. If a token request is made immediately after adding the federated identity credential, it might lead to failure for a couple of minutes as the cache is populated in the directory with old data. To avoid this issue, you can add a slight delay after adding the federated identity credential.

## Deploy the workload

Run the following to deploy a pod that references the service account created in the previous step.

```bash
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: quick-start
  namespace: ${SERVICE_ACCOUNT_NAMESPACE}
spec:
  serviceAccountName: ${SERVICE_ACCOUNT_NAME}
  containers:
    - image: ghcr.io/azure/azure-workload-identity/msal-go
      name: oidc
      env:
      - name: KEYVAULT_NAME
        value: ${KEYVAULT_NAME}
      - name: SECRET_NAME
        value: ${KEYVAULT_SECRET_NAME}
  nodeSelector:
    kubernetes.io/os: linux
EOF
```

The following output resembles successful creation of the pod:

```output
pod/quick-start created
```

To check whether all properties are injected properly by the webhook, use
the [kubectl describe][kubelet-describe] command:

```bash
kubectl describe pod quick-start
```

To verify that pod is able to get a token and access the secret from the Key Vault, use the
[kubectl logs][kubelet-logs] command:

```bash
kubectl logs quick-start
```

The following output resembles successful access of the token:

```output
I1013 22:49:29.872708       1 main.go:30] "successfully got secret" secret="Hello!"
```

## Clean up resources

If you plan to continue on to work with subsequent tutorials, you may wish to leave these resources in place.

When no longer needed, you can run the following Kubectl and the Azure CLI commands to remove the resource group and all related resources.

```bash
kubectl delete pod quick-start
```

```bash
kubectl delete sa "${SERVICE_ACCOUNT_NAME}" --namespace "${SERVICE_ACCOUNT_NAMESPACE}"
```

```azurecli
az group delete --name "${RESOURCE_GROUP}"
```

## Next steps

In this tutorial, you deployed a Kubernetes cluster and then deployed a simple container application to
test working with an Azure AD workload identity (preview).

This tutorial is for introductory purposes. For guidance on a creating full solutions with AKS for production, see [AKS solution guidance][aks-solution-guidance].

<!-- EXTERNAL LINKS -->
[kubelet-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubelet-logs]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs

<!-- INTERNAL LINKS -->
[kubernetes-concepts]: ../concepts-clusters-workloads.md
[aks-identity-concepts]: ../concepts-identity.md
[az-account]: /cli/azure/account
[azure-resource-group]: ../../azure-resource-manager/management/overview.md
[az-group-create]: /cli/azure/group#az-group-create
[az-aks-create]: /cli/azure/aks#az-aks-create
[aks-two-resource-groups]: ../faq.md#why-are-two-resource-groups-created-with-aks
[az-keyvault-create]: /cli/azure/keyvault#az-keyvault-create
[az-keyvault-secret-set]: /cli/azure/keyvault/secret#az-keyvault-secret-set
[az-account-set]: /cli/azure/account#az-account-set
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-identity-federated-credential-create]: /cli/azure/identity/federated-credential#az-identity-federated-credential-create
[aks-tutorial]: ../tutorial-kubernetes-prepare-app.md
[aks-solution-guidance]: /azure/architecture/reference-architectures/containers/aks-start-here