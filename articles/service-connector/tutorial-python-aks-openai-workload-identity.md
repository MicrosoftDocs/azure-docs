---
title: Connect to Azure OpenAI in AKS using workload identity.
titlesuffix: Service Connector
description: Learn how to connect to Azure OpenAI Service in Azure Kubernetes Service (AKS) using workload identity and Service Connector.
#customerintent: As a developer, I want to connect my AKS resource to Azure OpenAI Service using a workload identity.
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.custom: devx-track-python, build-2024
ms.topic: tutorial
ms.date: 05/07/2024
---

# Tutorial: Connect to Azure OpenAI Service in AKS using Workload Identity (preview)

In this tutorial, you learn how to create a pod in an Azure Kubernetes (AKS) cluster, which talks to Azure OpenAI Service using workload identity and Service Connector. In this tutorial, you complete the following tasks:

> [!div class="checklist"]
>
> * Create an AKS cluster and Azure OpenAI Service with `gpt-4` model deployment.
> * Create a connection between the AKS cluster and Azure OpenAI with Service Connector.
> * Clone a sample application that will talk to the Azure OpenAI service from an AKS cluster.
> * Deploy the application to a pod in AKS cluster and test the connection.
> * Clean up resources.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
* [!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
* Install [Docker ](https://docs.docker.com/get-docker/)and [kubectl](https://kubernetes.io/docs/tasks/tools/) to manage container image and Kubernetes resources.
* A basic understanding of container and AKS. Get started from [preparing an application for AKS](../aks/tutorial-kubernetes-prepare-app.md).
* A basic understanding of [workload identity](/entra/workload-id/workload-identities-overview).
* Access permissions to [create Azure OpenAI resources and to deploy models](../ai-services/openai/how-to/role-based-access-control.md).

## Create Azure resources

You start this tutorial by creating several Azure resources.

1. Create a resource group for this tutorial.

    ```azurecli-interactive
    az group create \
        --name MyResourceGroup \
        --location eastus
    ```

1. Create an AKS cluster with the following command, or by referring to the [AKS quickstart](../aks/learn/quick-kubernetes-deploy-cli.md). In this tutorial, we create the service connection and pod definition and deploy the sample application to this cluster.

    ```azurecli-interactive
    az aks create \
        --resource-group MyResourceGroup \
        --name MyAKSCluster \
        --enable-managed-identity \
        --node-count 1
        --generate-ssh-keys
    ```

1. Connect to the cluster using the [az aks get-credentials](/cli/azure/aks#az-aks-get-credentials) command.

    ```azurecli
    az aks get-credentials \
        --resource-group MyResourceGroup \
        --name MyAKSCluster
    ```

1. Create an Azure OpenAI Service resource using the [az cognitiveservices account create](/cli/azure/cognitiveservices/account#az-cognitiveservices-account-create) command. Optionally refer to [this tutorial](../ai-services/openai/how-to/create-resource.md) for more instructions. Azure OpenAI Service is the target service that we'll connect to the AKS cluster.

    ```azurecli
    az cognitiveservices account create \
        --resource-group MyResourceGroup \
        --name MyOpenAIService \
        --location eastus \
        --kind OpenAI \
        --sku s0 \
        --custom-domain myopenaiservice \
        --subscription <SubscriptionID>
    ```

1. Deploy a model with the [az cognitiveservices deployment create](/cli/azure/cognitiveservices/account/deployment#az-cognitiveservices-account-deployment-create) command. The model is used in the sample application to test the connection.

    ```azurecli-interactive
    az cognitiveservices account deployment create \
        --resource-group MyResourceGroup \
        --name MyOpenAIService
        --deployment-name MyModel \
        --model-name gpt-4 \
        --model-version 0613 \
        --model-format OpenAI \
        --sku-name "Standard"
        --capacity 1
    ```

1. Create an Azure Container Registry (ACR) resource with the [az acr create](/cli/azure/acr#az-acr-create) command, or referring to [this tutorial](../container-registry/container-registry-get-started-portal.md). The registry hosts the container image of the sample application, which the AKS pod definition consumes.

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
        --name MyRegistry \
        --anonymous-pull-enabled
    ```

1. Create a user-assigned managed identity with the [az identity create](/cli/azure/identity#az-identity-create) command, or by referring to [this tutorial](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities). When the connection is created, the user-assigned managed identity is used to enable the workload identity for AKS workloads.

    ```azurecli
    az identity create \
        --resource-group MyResourceGroup \
        --name MyIdentity
    ```

## Create a service connection in AKS with Service Connector (preview)

Create a service connection between an AKS cluster and Azure OpenAI Service in the Azure portal or the Azure CLI.

### [Portal](#tab/azure-portal)

Refer to the [AKS service connection quickstart](quickstart-portal-aks-connection.md) for instructions to create a new connection and fill in the settings referring to the examples in the following table. Leave all other settings with their default values.

1. Basics tab:

    | Setting             | Example value       | Description                                                                               |
    |---------------------|---------------------|-------------------------------------------------------------------------------------------|
    | **Kubernetes namespace** | *default*      | The Kubernetes namespace.                                                                 |
    | **Service type**    | *OpenAI Service*    | The target service type.                                                                  |
    | **Connection name** | *openai_conn*       | Use the connection name provided by Service Connector or choose your own connection name. |
    | **Subscription**    | `<MySubscription>`  | The subscription used for Azure OpenAI Service.                                           |
    | **OpenAI**          | `<MyOpenAIService>` | The target Azure OpenAI service you want to connect to.                                   |
    | **Client type**     | *Python*            | The code language or framework you use to connect to the target service.                  |

1. Authentication tab:

    | Authentication Setting         | Example value       | Description                                                             |
    |--------------------------------|---------------------|-------------------------------------------------------------------------|
    | **Authentication type**        | *Workload Identity* | Service Connector authentication type.                                  |
    | **Subscription**               | `<MySubscription>`  | The subscription that contains the user assigned managed identity.                         |
    | **User assigned managed identity** | `<MyIdentity>`  | A user assigned managed identity is needed to enable workload identity. |

Once the connection has been created, you can view its details in the **Service Connector** pane.

### [Azure CLI](#tab/azure-cli)

Use the Azure CLI command to create a service connection to the Azure OpenAI service, providing the following information:

* **Source compute service resource group name:** the resource group name of the AKS cluster.
* **AKS cluster name:** the name of your AKS cluster that connects to the target service.
* **Target service resource group name:** the resource group name of the Azure OpenAI service.
* **OpenAI service name:** the Azure OpenAI service that is connected.
* **User-assigned identity resource ID:** the resource ID of the user-assigned identity used to create the workload identity.

```azurecli
az aks connection create cognitiveservices \
   --workload-identity <user-identity-resource-id>
```

---

## Clone sample application

1. Clone the sample repository:

   ```Bash
   git clone https://github.com/Azure-Samples/serviceconnector-aks-samples.git
   ```

1. Go to the repository's sample folder for Azure OpenAI:

   ```Bash
   cd serviceconnector-aks-samples/azure-openai-workload-identity
   ```

1. Replace the `<MyModel>` placeholder in the `app.py` file with the model name we deployed.

## Build and push container images

1. Build and push the images to your ACR using the Azure CLI [az acr build](/cli/azure/acr#az_acr_build) command.

    ```azurecli-interactive
    az acr build --registry <MyRegistry> --image sc-demo-openai-identity:latest ./
    ```

1. View the images in your ACR instance using the [az acr repository list](/cli/azure/acr/repository#az_acr_repository_list) command.

    ```azurecli-interactive
    az acr repository list --name <MyRegistry> --output table
    ```

## Run application and test connection

1. Replace the placeholders in the `pod.yaml` file in the `azure-openai-workload-identity` folder.

   * Replace `<YourContainerImage>` with the name of the image we built earlier. For example, `<MyRegistry>.azurecr.io/sc-demo-openai-identity:latest`.
   * Replace `<ServiceAccountCreatedByServiceConnector>` with the service account created by Service Connector after the connection creation. You may check the service account name in the Azure portal, in the **Service Connector** pane.
   * Replace `<SecretCreatedByServiceConnector>` with the secret created by Service Connector after the connection creation. You may check the secret name in the Azure portal, in the **Service Connector** pane.

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

## Next steps

Read the following articles to learn more about Service Connector concepts and how it helps AKS connect to services.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)

> [!div class="nextstepaction"]
> [Use Service Connector to connect an AKS cluster to other cloud services](./how-to-use-service-connector-in-aks.md)
