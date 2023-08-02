---
title: Tutorial - Use a workload identity with an application on Azure Kubernetes Service (AKS)
description: In this Azure Kubernetes Service (AKS) tutorial, you deploy an Azure Kubernetes Service cluster and configure an application to use a workload identity.
ms.topic: tutorial
ms.custom: devx-track-azurecli, devx-track-linux
ms.date: 05/24/2023
---

# Tutorial: Use a workload identity with an application on Azure Kubernetes Service (AKS)

Azure Kubernetes Service (AKS) is a managed Kubernetes service that lets you quickly deploy and manage Kubernetes clusters. In this tutorial, you:

* Deploy an AKS cluster using the Azure CLI with OpenID Connect (OIDC) Issuer and managed identity.
* Create an Azure Key Vault and secret.
* Create an Azure Active Directory (Azure AD) workload identity and Kubernetes service account.
* Configure the managed identity for token federation.
* Deploy the workload and verify authentication with the workload identity.

## Before you begin

* This tutorial assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].
* If you aren't familiar with Azure AD workload identity, see the [Azure AD workload identity overview][workload-identity-overview].
* When you create an AKS cluster, a second resource group is automatically created to store the AKS resources. For more information, see [Why are two resource groups created with AKS?][aks-two-resource-groups]

## Prerequisites

* [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
* This article requires version 2.47.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
* The identity you use to create your cluster must have the appropriate minimum permissions. For more information on access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)][aks-identity-concepts].
* If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the [`az account`][az-account] command.

## Create a resource group

An [Azure resource group][azure-resource-group] is a logical group in which Azure resources are deployed and managed. When you create a resource group, you're prompted to specify a location. This location is the storage location of your resource group metadata and where your resources run in Azure if you don't specify another region during resource creation.

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

* Create a resource group using the [`az group create`][az-group-create] command.

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

## Export environmental variables

To help simplify steps to configure the identities required, the steps below define environmental variables for reference on the cluster.

* Create these variables using the following commands. Replace the default values for `RESOURCE_GROUP`, `LOCATION`, `SERVICE_ACCOUNT_NAME`, `SUBSCRIPTION`, `USER_ASSIGNED_IDENTITY_NAME`, and `FEDERATED_IDENTITY_CREDENTIAL_NAME`.

    ```bash
    export RESOURCE_GROUP="myResourceGroup"
    export LOCATION="westcentralus"
    export SERVICE_ACCOUNT_NAMESPACE="default"
    export SERVICE_ACCOUNT_NAME="workload-identity-sa"
    export SUBSCRIPTION="$(az account show --query id --output tsv)"
    export USER_ASSIGNED_IDENTITY_NAME="myIdentity"
    export FEDERATED_IDENTITY_CREDENTIAL_NAME="myFedIdentity"
    export KEYVAULT_NAME="azwi-kv-tutorial"
    export KEYVAULT_SECRET_NAME="my-secret"
    ```

## Create an AKS cluster

1. Create an AKS cluster using the [`az aks create`][az-aks-create] command with the `--enable-oidc-issuer` parameter to use the OIDC Issuer.

    ```azurecli-interactive
    az aks create -g "${RESOURCE_GROUP}" -n myAKSCluster --node-count 1 --enable-oidc-issuer --enable-workload-identity --generate-ssh-keys
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

2. Get the OIDC Issuer URL and save it to an environmental variable using the following command. Replace the default value for the arguments `-n`, which is the name of the cluster.

    ```azurecli-interactive
    export AKS_OIDC_ISSUER="$(az aks show -n myAKSCluster -g "${RESOURCE_GROUP}" --query "oidcIssuerProfile.issuerUrl" -otsv)"
    ```

    The variable should contain the Issuer URL similar to the following example:

    ```output
    https://eastus.oic.prod-aks.azure.com/00000000-0000-0000-0000-000000000000/00000000-0000-0000-0000-000000000000/
    ```

    By default, the Issuer is set to use the base URL `https://{region}.oic.prod-aks.azure.com`, where the value for `{region}` matches the location the AKS cluster is deployed in.

## Create an Azure Key Vault and secret

1. Create an Azure Key Vault in resource group you created in this tutorial using the [`az keyvault create`][az-keyvault-create] command.

    ```azurecli-interactive
    az keyvault create --resource-group "${RESOURCE_GROUP}" --location "${LOCATION}" --name "${KEYVAULT_NAME}"
    ```

    The output of this command shows properties of the newly created key vault. Take note of the two properties listed below:

   * `Name`: The vault name you provided to the `--name` parameter.
   * `vaultUri`: In the example, this is `https://<your-unique-keyvault-name>.vault.azure.net/`. Applications that use your vault through its REST API must use this URI.

    At this point, your Azure account is the only one authorized to perform any operations on this new vault.

2. Add a secret to the vault using the [`az keyvault secret set`][az-keyvault-secret-set] command. The password is the value you specified for the environment variable `KEYVAULT_SECRET_NAME` and stores the value of **Hello!** in it.

    ```azurecli-interactive
    az keyvault secret set --vault-name "${KEYVAULT_NAME}" --name "${KEYVAULT_SECRET_NAME}" --value 'Hello!' 
    ```

3. Add the Key Vault URL to the environment variable `KEYVAULT_URL` using the [`az keyvault show`][az-keyvault-show] command.

    ```bash
    export KEYVAULT_URL="$(az keyvault show -g "${RESOURCE_GROUP}" -n ${KEYVAULT_NAME} --query properties.vaultUri -o tsv)"
    ```

## Create a managed identity and grant permissions to access the secret

1. Set a specific subscription as the current active subscription using the [`az account set`][az-account-set] command.

    ```azurecli-interactive
    az account set --subscription "${SUBSCRIPTION}"
    ```

2. Create a managed identity using the [`az identity create`][az-identity-create] command.

    ```azurecli-interactive
    az identity create --name "${USER_ASSIGNED_IDENTITY_NAME}" --resource-group "${RESOURCE_GROUP}" --location "${LOCATION}" --subscription "${SUBSCRIPTION}"
    ```

3. Set an access policy for the managed identity to access the Key Vault secret using the following commands.

    ```azurecli-interactive
    export USER_ASSIGNED_CLIENT_ID="$(az identity show --resource-group "${RESOURCE_GROUP}" --name "${USER_ASSIGNED_IDENTITY_NAME}" --query 'clientId' -otsv)"
    ```

    ```azurecli-interactive
    az keyvault set-policy --name "${KEYVAULT_NAME}" --secret-permissions get --spn "${USER_ASSIGNED_CLIENT_ID}"
    ```

### Create Kubernetes service account

1. Create a Kubernetes service account and annotate it with the client ID of the managed identity created in the previous step using the [`az aks get-credentials`][az-aks-get-credentials] command. Replace the default value for the cluster name and the resource group name.

    ```azurecli-interactive
    az aks get-credentials -n myAKSCluster -g "${RESOURCE_GROUP}"
    ```

2. Copy the following multi-line input into your terminal and run the command to create the service account.

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      annotations:
        azure.workload.identity/client-id: ${USER_ASSIGNED_CLIENT_ID}
      name: ${SERVICE_ACCOUNT_NAME}
      namespace: ${SERVICE_ACCOUNT_NAMESPACE}
    EOF
    ```

    The following output resembles successful creation of the identity:

    ```output
    Serviceaccount/workload-identity-sa created
    ```

## Establish federated identity credential

* Create the federated identity credential between the managed identity, service account issuer, and subject using the [`az identity federated-credential create`][az-identity-federated-credential-create] command.

    ```azurecli-interactive
    az identity federated-credential create --name ${FEDERATED_IDENTITY_CREDENTIAL_NAME} --identity-name ${USER_ASSIGNED_IDENTITY_NAME} --resource-group ${RESOURCE_GROUP} --issuer ${AKS_OIDC_ISSUER} --subject system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}
    ```

    > [!NOTE]
    > It takes a few seconds for the federated identity credential to propagate after it's initially added. If a token request is immediately available after adding the federated identity credential, you may experience failure for a couple minutes, as the cache is populated in the directory with old data. To avoid this issue, you can add a slight delay after adding the federated identity credential.

## Deploy the workload

1. Deploy a pod that references the service account created in the previous step using the following command.

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: Pod
    metadata:
      name: quick-start
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

    The following output resembles successful creation of the pod:

    ```output
    pod/quick-start created
    ```

2. Check whether all properties are injected properly with the webhook using the [`kubectl describe`][kubelet-describe] command.

    ```bash
    kubectl describe pod quick-start
    ```

3. Verify the pod can get a token and access the secret from the Key Vault using the [`kubectl logs`][kubelet-logs] command.

    ```bash
    kubectl logs quick-start
    ```

    The following output resembles successful access of the token:

    ```output
    I1013 22:49:29.872708       1 main.go:30] "successfully got secret" secret="Hello!"
    ```

## Clean up resources

You may wish to leave these resources in place. If you no longer need these resources, use the following commands to delete them.

1. Delete the pod using the `kubectl delete pod` command.

    ```bash
    kubectl delete pod quick-start
    ```

2. Delete the service account using the `kubectl delete sa` command.

    ```bash
    kubectl delete sa "${SERVICE_ACCOUNT_NAME}" --namespace "${SERVICE_ACCOUNT_NAMESPACE}"
    ```

3. Delete the Azure resource group and all its resources using the [`az group delete`][az-group-delete] command.

    ```azurecli-interactive
    az group delete --name "${RESOURCE_GROUP}"
    ```

## Next steps

In this tutorial, you deployed a Kubernetes cluster and deployed a simple container application to test working with an Azure AD workload identity.

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
[az-group-delete]: /cli/azure/group#az-group-delete
[az-aks-create]: /cli/azure/aks#az-aks-create
[aks-two-resource-groups]: ../faq.md#why-are-two-resource-groups-created-with-aks
[az-keyvault-create]: /cli/azure/keyvault#az-keyvault-create
[az-keyvault-secret-set]: /cli/azure/keyvault/secret#az-keyvault-secret-set
[az-account-set]: /cli/azure/account#az-account-set
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-identity-federated-credential-create]: /cli/azure/identity/federated-credential#az-identity-federated-credential-create
[aks-solution-guidance]: /azure/architecture/reference-architectures/containers/aks-start-here
[az-keyvault-show]: /cli/azure/keyvault#az-keyvault-show
[workload-identity-overview]: ../../active-directory/workload-identities/workload-identities-overview.md
