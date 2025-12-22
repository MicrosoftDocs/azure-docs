---
title: "Tutorial: Connect AKS to Azure OpenAI with Service Connector and Workload Identity"
titleSuffix: Service Connector
description: "Complete step-by-step guide: Connect Azure Kubernetes Service (AKS) to Azure OpenAI using Service Connector with workload identity authentication"
#customer intent: As a developer, I want to connect my AKS resource to Azure OpenAI.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.custom: devx-track-python, build-2024, devx-track-azurecli
keywords: "azure openai aks, kubernetes openai, service connector, workload identity, aks authentication, azure ai kubernetes"
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
ms.topic: tutorial
ms.date: 09/30/2025
---

# Tutorial: Connect AKS to Azure OpenAI

This tutorial shows you how to connect your Azure Kubernetes Service (AKS) applications to Azure OpenAI using Service Connector with workload identity authentication. You'll establish credential-free connections by deploying a sample Python application that communicates with the Azure OpenAI.

You'll complete the following tasks:

> [!div class="checklist"]
>
> * Create an AKS cluster and Azure OpenAI resource with GPT-4 model
> * Configure Service Connector to establish the connection with workload identity
> * Clone a sample application
> * Build and push container images to Azure Container Registry
> * Deploy the application to AKS and verify the connection
> * Clean up resources

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
* [!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
* [Docker](https://docs.docker.com/get-docker/) and [kubectl](https://kubernetes.io/docs/tasks/tools/) to manage container images and Kubernetes resources.
* A basic understanding of containers and AKS. Get started from [preparing an application for AKS](/azure/aks/tutorial-kubernetes-prepare-app).
* Access permissions to [create Azure OpenAI resources and deploy models](/azure/ai-services/openai/how-to/role-based-access-control).

## Create Azure OpenAI and AKS resources

You start this tutorial by creating several Azure resources.

1. Create a resource group for this tutorial.

    ```azurecli-interactive
    az group create \
        --name MyResourceGroup \
        --location eastus
    ```

1. Create an AKS cluster with the following command, or by referring to the [AKS quickstart](/azure/aks/learn/quick-kubernetes-deploy-cli). In this tutorial, we create the service connection and pod definition and deploy the sample application to this cluster.

    ```azurecli-interactive
    az aks create \
        --resource-group MyResourceGroup \
        --name MyAKSCluster \
        --enable-managed-identity \
        --node-count 1 \
        --generate-ssh-keys
    ```

1. Connect to the cluster using the [az aks get-credentials](/cli/azure/aks#az-aks-get-credentials) command.

    ```azurecli
    az aks get-credentials \
        --resource-group MyResourceGroup \
        --name MyAKSCluster
    ```

1. Create an Azure OpenAI resource using the [az cognitiveservices account create](/cli/azure/cognitiveservices/account#az-cognitiveservices-account-create) command. Optionally refer to [this tutorial](/azure/ai-services/openai/how-to/create-resource) for more instructions. Azure OpenAI is the target service that the AKS cluster will connect to.

    ```azurecli
    az cognitiveservices account create \
        --resource-group MyResourceGroup \
        --name MyOpenAI \
        --location eastus \
        --kind OpenAI \
        --sku s0 \
        --custom-domain myopenai \
        --subscription <SubscriptionID>
    ```

1. Deploy a model with the [az cognitiveservices deployment create](/cli/azure/cognitiveservices/account/deployment#az-cognitiveservices-account-deployment-create) command. The model is used in the sample application to test the connection.

    ```azurecli-interactive
    az cognitiveservices account deployment create \
        --resource-group MyResourceGroup \
        --name MyOpenAI \
        --deployment-name MyModel \
        --model-name gpt-4 \
        --model-version 0613 \
        --model-format OpenAI \
        --sku-name "Standard" \
        --capacity 1
    ```

1. Create an Azure Container Registry (ACR) to store the containerized sample application. Use the [az acr create](/cli/azure/acr#az-acr-create) command, or refer to [this tutorial](/azure/container-registry/container-registry-get-started-portal).

    ```azurecli-interactive
    az acr create \
        --resource-group MyResourceGroup \
        --name myregistry \
        --sku Standard
    ```

1. Enable anonymous pull using [az acr update](/cli/azure/acr#az-acr-update) command so that the AKS cluster can consume the images in the registry.

    ```azurecli-interactive
    az acr update \
        --resource-group MyResourceGroup \
        --name myregistry \
        --anonymous-pull-enabled
    ```

1. Create a user-assigned managed identity with the [az identity create](/cli/azure/identity#az-identity-create) command, or by referring to [this tutorial](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities). When the connection is created, the user-assigned managed identity is used to enable the [workload identity](/entra/workload-id/workload-identities-overview) for AKS workloads.

    ```azurecli
    az identity create \
        --resource-group MyResourceGroup \
        --name MyIdentity
    ```

## Create a service connection from AKS to Azure OpenAI

Create a service connection between an AKS cluster and Azure OpenAI in the Azure portal or the Azure CLI.

### [Portal](#tab/azure-portal)

Refer to the [AKS service connection quickstart](quickstart-portal-aks-connection.md) for instructions to create a new connection and fill in the settings referring to the examples in the following table. Leave all other settings with their default values.

1. Basics tab:

    | Setting             | Example value     | Description                                                                               |
    |---------------------|-------------------| ------------------------------------------------------------------------------------------|
    | **Kubernetes namespace** | *default*    | The Kubernetes namespace.                                                                 |
    | **Service type**    | *OpenAI Service*  | The target service type.                                                                  |
    | **Connection name** | *openai_conn*     | Use the connection name provided by Service Connector or choose your own connection name. |
    | **Subscription**    | *My Subscription* | The Azure subscription containing your Azure OpenAI resource.                             |
    | **OpenAI**          | *MyOpenAI*        | The target Azure OpenAI resource you want to connect to.                                  |
    | **Client type**     | *Python*          | The programming language or framework for the connection configuration.                   |
    
1. Authentication tab:

| Authentication Setting         | Example value       | Description                                                             |
|--------------------------------|---------------------|-------------------------------------------------------------------------|
| **Authentication type**        | *Workload Identity* | The authentication method to connect the app to Azure OpenAI. Workload identity is recommended for enhanced security. Alternative methods include connection string and service principal, and require credential management considerations. |
| **Subscription**               | *My Subscription*   | The subscription that contains the user-assigned managed identity.                         |
| **User assigned managed identity** | *myidentity*    | The user-assigned managed identity that enables workload identity authentication for the AKS cluster. |

Once the connection is created, you can view its details in the **Service Connector** pane.

### [Azure CLI](#tab/azure-cli)

Create a service connection from AKS to the Azure OpenAI resource by running the [az aks connection create cognitiveservices](/cli/azure/aks/connection/create#az-aks-connection-create-cognitiveservices) command in the Azure CLI. 

```azurecli
az aks connection create cognitiveservices \
   --workload-identity <user-identity-resource-id>
```

When using the above command, Service Connector prompts you to specify the AKS resource group, AKS cluster name, target service resource group, cognitive service account name, and user-assigned identity resource ID step by step.

Alternatively, you can provide the complete command directly:

```azurecli
az aks connection create cognitiveservices \
   --workload-identity <user-identity-resource-id> \
   --resource-group <aks-cluster-resource-group> \
   --name <aks-cluster-name> \
   --target-resource-group <target-cognitive-services-resource-group> \
   --account <target-cognitive-services-account>
```

> [!NOTE]
> This tutorial uses workload identity for enhanced security. For development scenarios, you can also use connection string authentication by omitting the `--workload-identity` parameter and using `--secret` instead.

---

## Clone Python sample application

1. Clone the sample repository:

   ```Bash
   git clone https://github.com/Azure-Samples/serviceconnector-aks-samples.git
   ```

1. Go to the repository's sample folder for Azure OpenAI:

   ```Bash
   cd serviceconnector-aks-samples/azure-openai-workload-identity
   ```

1. Replace the `<MyModel>` placeholder in the `app.py` file with the model name we deployed.

## Build and push container images to Azure Container Registry

1. Build and push the images to your container registry using the Azure CLI [az acr build](/cli/azure/acr#az_acr_build) command.

    ```azurecli-interactive
    az acr build --registry myregistry --image sc-demo-openai-identity:latest ./
    ```

1. View the images in your container registry using the [az acr repository list](/cli/azure/acr/repository#az_acr_repository_list) command.

    ```azurecli-interactive
    az acr repository list --name myregistry --output table
    ```

## Deploy and test AKS to Azure OpenAI connection

1. Replace the placeholders in the `pod.yaml` file in the `azure-openai-workload-identity` folder.

   * Replace `<YourContainerImage>` with the name of the image you built earlier. For example `<myregistry>.azurecr.io/<sc-demo-openai-identity>:<latest>`.
   * Replace `<ServiceAccountCreatedByServiceConnector>` with the service account name. It can be found in the Azure portal, in the **Service Connector** pane.
   * Replace `<SecretCreatedByServiceConnector>` with the secret name. It can be found in the Azure portal, in the **Service Connector** pane.

1. Deploy the pod to your cluster with the `kubectl apply` command, which creates a pod named `sc-demo-openai-identity` in the default namespace of your AKS cluster. Install `kubectl` locally using the [az aks install-cli](/cli/azure/aks#az_aks_install_cli) command if it isn't installed. 

   ```Bash
   kubectl apply -f pod.yaml
   ```

1. Check if the deployment was successful by viewing the pod with `kubectl`.

   ```Bash
   kubectl get pod/sc-demo-openai-identity
   ```

1. Check that connection is established by viewing the logs with `kubectl`.

   ```Bash
   kubectl logs pod/sc-demo-openai-identity
   ```

## Clean up resources

If you no longer need the resources created in this tutorial, clean them up by deleting the resource group.

```azurecli
az group delete \
    --resource-group MyResourceGroup
```

## Related content

* [Connect to Azure AI services](./how-to-integrate-ai-services.md)
* [Connect to Azure OpenAI with Service Connector](./how-to-integrate-openai.md)
* [Azure AI multi-service resource integration](./how-to-integrate-cognitive-services.md)