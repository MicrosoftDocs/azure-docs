---
title: Deploy an AI model on Azure Kubernetes Service (AKS) with the AI toolchain operator (Preview)
description: Learn how to enable the AI toolchain operator add-on on Azure Kubernetes Service (AKS) to simplify OSS AI model management and deployment.
ms.topic: article
ms.custom:
  - azure-kubernetes-service
  - ignite-2023
ms.date: 11/03/2023
---

# Deploy an AI model on Azure Kubernetes Service (AKS) with the AI toolchain operator (Preview)

The AI toolchain operator (KAITO) is a managed add-on for AKS that simplifies the experience of running OSS AI models on your AKS clusters. The AI toolchain operator automatically provisions the necessary GPU nodes and sets up the associated inference server as an endpoint server to your AI models. Using this add-on reduces your onboarding time and enables you to focus on AI model usage and development rather than infrastructure setup.

This article shows you how to enable the AI toolchain operator add-on and deploy an AI model on AKS.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Before you begin

* This article assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for AKS](./concepts-clusters-workloads.md).
* If you aren't familiar with Microsoft Entra Workload Identity, see the [Workload Identity overview](../active-directory/workload-identities/workload-identities-overview.md).
* For ***all hosted model inference files*** and recommended infrastructure setup, see the [KAITO GitHub repository](https://github.com/Azure/kaito).

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  * If you have multiple Azure subscriptions, make sure you select the correct subscription in which the resources will be created and charged using the [`az account set`][az-account-set] command.

    > [!NOTE]
    > The subscription you use must have GPU VM quota.

* Azure CLI version 2.47.0 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* Helm v3 installed. For more information, see [Installing Helm](https://helm.sh/docs/intro/install/).
* The Kubernetes command-line client, kubectl, installed and configured. For more information, see [Install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

## Enable the Azure CLI preview extension

* Enable the Azure CLI preview extension using the [`az extension add`][az-extension-add] command.

    ```azurecli-interactive
    az extension add --name aks-preview
    ```

## Register the `AIToolchainOperatorPreview` feature flag

1. Register the `AIToolchainOperatorPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --name AIToolchainOperatorPreview --namespace Microsoft.ContainerService
    ```

    It takes a few minutes for the status to show as *Registered*.

2. Verify the registration using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --name AIToolchainOperatorPreview --namespace Microsoft.ContainerService
    ```

3. When the status reflects as *Registered*, refresh the registration of the Microsoft.ContainerService resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

### Export environment variables

* To simplify the configuration steps in this article, you can define environment variables using the following commands. Make sure to replace the placeholder values with your own.

    ```azurecli-interactive
    export AZURE_SUBSCRIPTION_ID="mySubscriptionID"
    export AZURE_RESOURCE_GROUP="myResourceGroup"
    export CLUSTER_NAME="myClusterName"
    ```

## Enable the AI toolchain operator add-on on an AKS cluster

1. Create an Azure resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name AZURE_RESOURCE_GROUP --location eastus
    ```

2. Create an AKS cluster with the AI toolchain operator add-on enabled using the [`az aks create`][az-aks-create] command with the `--enable-ai-toolchain-operator`, `--enable-workload-identity`, and `--enable-oidc-issuer` flags.

    ```azurecli-interactive
    az aks create --resource-group AZURE_RESOURCE_GROUP --name CLUSTER_NAME --generate-ssh-keys --enable-managed-identity --enable-workload-identity --enable-oidc-issuer --enable-ai-toolchain-operator 
    ```

    > [!NOTE]
    > AKS creates a managed identity once you enable the AI toolchain operator add-on. The managed identity is used to access the AI toolchain operator workspace CRD. The AI toolchain operator workspace CRD is used to create and manage AI toolchain operator workspaces.
    >
    > AI toolchain operator enablement requires the enablement of workload identity and OIDC issuer.

## Connect to your cluster

1. Configure `kubectl` to connect to your cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group AZURE_RESOURCE_GROUP --name CLUSTER_NAME
    ```

2. Verify the connection to your cluster using the `kubectl get` command.

    ```azurecli-interactive
    kubectl get nodes
    ```

3. Export environment variables for the principal ID identity and client ID identity using the following commands:

    ```azurecli-interactive
    export MC_RESOURCE_GROUP=$(az aks show --resource-group AZURE_RESOURCE_GROUP --name CLUSTER_NAME --query nodeResourceGroup -o tsv)
    export PRINCIPAL_ID=$(az identity show --name "ai-toolchain-operator-{CLUSTER_NAME}" --resource-group "{MC_RESOURCE_GROUP} --query 'principalId' -o tsv)
    export CLIENT_ID=$(az identity show --name gpuIdentity --resource-group "${AZURE_RESOURCE_GROUP}" --subscription "${AZURE_SUBSCRIPTION_ID}" --query 'clientId' -o tsv)
    ```

## Create a role assignment for the principal ID identity

1. Create a new role assignment for the service principal using the [`az role assignment create`][az-role-assignment-create] command.

    ```azurecli-interactive
    az role assignment create --role "Contributor" --assignee "${PRINCIPAL_ID}" --scope "/subscriptions/${AZURE_SUBSCRIPTION_ID}/resourcegroups/${AZURE_RESOURCE_GROUP}"/providers/Microsoft.ContainerService/managedClusters/${CLUSTER_NAME}"
    ```

2. Get the AKS OIDC Issuer URL and export it as an environment variable using the following command:

    ```azurecli-interactive
    export AKS_OIDC_ISSUER=$(az aks show --resource-group "${AZURE_RESOURCE_GROUP}" --name "${CLUSTER_NAME}" --subscription "${AZURE_SUBSCRIPTION_ID}" --query "oidcIssuerProfile.issuerUrl" -o tsv)
    ```

## Establish a federated identity credential

* Create the federated identity credential between the managed identity, AKS OIDC issuer, and subject using the [`az identity federated-credential create`][az-identity-federated-credential-create] command.

    ```azurecli-interactive
    az identity federated-credential create --name "${FEDERATED_IDENTITY}" --identity-name "ai-toolchain-operator-{CLUSTER_NAME}" --resource-group "${AZURE_RESOURCE_GROUP} --issuer "${AKS_OIDC_ISSUER}" --subject system:serviceaccount:"kube-system":"gpu-provisioner" --audience api://AzureADTokenExchange --subscription "${AZURE_SUBSCRIPTION_ID}"
    ```

## Deploy a default hosted AI model

1. Deploy the Falcon 7B model YAML file from the GitHub repository using the `kubectl apply` command.

    ```azurecli-interactive
    kubectl apply -f https://raw.githubusercontent.com/Azure/kaito/main/examples/kaito_workspace_falcon_7b.yaml
    ```

2. Track the live resource changes in your workspace using the `kubectl get` command.

    ```azurecli-interactive
    kubectl get workspace workspace-falcon-7b -w
    ```

3. Check your service and get the service IP address using the `kubectl get svc` command.

    ```azurecli-interactive
    export SERVICE_IP=$(kubectl get svc workspace-falcon-7b -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    ```

4. Run the Falcon 7B model with a sample input of your choice using the following `curl` command:

    ```azurecli-interactive
    curl -X POST "http://SERVICE_IP:80/chat" -H "accept: application/json" -H "Content-Type: application/json" -d '{"prompt":"YOUR_PROMPT_HERE"}'
    ```

## Clean up resources

If you no longer need these resources, you can delete them to avoid incurring extra Azure charges.

* Delete the resource group and its associated resources using the [`az group delete`][az-group-delete] command.

    ```azurecli-interactive
    az group delete --name AZURE_RESOURCE_GROUP --yes --no-wait
    ```

## Next steps

For more inference model options, see the [KAITO GitHub repository](https://github.com/Azure/kaito).

<!-- LINKS -->
[az-group-create]: /cli/azure/group#az_group_create
[az-group-delete]: /cli/azure/group#az_group_delete
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[az-identity-federated-credential-create]: /cli/azure/identity/federated-credential#az_identity_federated_credential_create
[az-account-set]: /cli/azure/account#az_account_set
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-show]: /cli/azure/feature#az_feature_show
[az-provider-register]: /cli/azure/provider#az_provider_register
