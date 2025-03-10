---
title: Connect to Azure OpenAI in AKS using a connection string
titlesuffix: Service Connector
description: Learn how to connect Azure Kubernetes Service (AKS) to Azure OpenAI Service using a connection string and Service Connector
#customerintent: As a developer, I want to connect my AKS resource to Azure OpenAI Service using a connection string.
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.custom: devx-track-python, build-2024, devx-track-azurecli
ms.collection: ce-skilling-ai-copilot
ms.topic: tutorial
ms.date: 01/29/2025
---

# Tutorial: Connect to Azure OpenAI Service in AKS using a connection string

In this tutorial, you learn how to create a pod in an Azure Kubernetes (AKS) cluster that communicates with Azure OpenAI Service using a connection string. You complete the following tasks:

> [!div class="checklist"]
>
> * Create an AKS cluster and Azure OpenAI Service with `gpt-4` model deployment.
> * Create a connection between the AKS cluster and Azure OpenAI with Service Connector.
> * Clone a sample application that will talk to the OpenAI service from an AKS cluster.
> * Deploy the application to a pod in the AKS cluster and test the connection.
> * Clean up resources.

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable. See the [tutorial using a managed identity](tutorial-python-aks-openai-workload-identity.md).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
* [!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
* [Docker](https://docs.docker.com/get-docker/) and [kubectl](https://kubernetes.io/docs/tasks/tools/) to manage container images and Kubernetes resources.
* A basic understanding of containers and AKS. Get started from [preparing an application for AKS](/azure/aks/tutorial-kubernetes-prepare-app).
* Access permissions to [create Azure OpenAI Service resources and deploy models](/azure/ai-services/openai/how-to/role-based-access-control).

## Create Azure resources

1. Create a resource group for this tutorial.

    ```azurecli-interactive
    az group create \
        --name MyResourceGroup \
        --location eastus
    ```

1. Create an AKS cluster with the following command, or by referring to the [AKS quickstart](/azure/aks/learn/quick-kubernetes-deploy-cli). This cluster is where we create the service connection and pod definition and deploy the sample application.

    ```azurecli-interactive
    az aks create \
        --resource-group MyResourceGroup \
        --name MyAKSCluster \
        --enable-managed-identity \
        --node-count 1 \
       --generate-ssh-keys
    ```

1. Connect to the cluster using the [az aks get-credentials](/cli/azure/aks#az-aks-get-credentials) command.

    ```azurecli-interactive
    az aks get-credentials \
        --resource-group MyResourceGroup \
        --name MyAKSCluster
    ```

1. Create an Azure OpenAI Service resource using the [az cognitiveservices account create](/cli/azure/cognitiveservices/account#az-cognitiveservices-account-create) command. Optionally refer to [this tutorial](/azure/ai-services/openai/how-to/create-resource) for more instructions. Azure OpenAI Service is the target service that we'll connect to the AKS cluster.

    ```azurecli-interactive
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

1. Create an Azure Container Registry (ACR) resource with the [az acr create](/cli/azure/acr#az-acr-create) command, or referring to [this tutorial](/azure/container-registry/container-registry-get-started-portal). The registry hosts the container image of the sample application, which the AKS pod definition consumes.

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

## Create a service connection in AKS with Service Connector

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

    | Authentication Setting  | Example value       | Description                            |
    |-------------------------|---------------------|----------------------------------------|
    | **Authentication type** | *Connection String* | Service Connector authentication type. |

Once the connection has been created, you can view its details in the **Service Connector** pane.

## [Azure CLI](#tab/azure-cli)

Create a service connection to the Azure OpenAI service in AKS by running the [az aks connection create cognitiveservices](/cli/azure/aks/connection/create#az-aks-connection-create-cognitiveservices) command in the Azure CLI. 

```azurecli
az aks connection create cognitiveservices --secret
```

When using the above command, Service Connector prompts you to specify the AKS resource group, AKS cluster name, target service resource group, and cognitive service account name step by step.

Alternatively, you can provide the complete command directly:

```azurecli
az aks connection create cognitiveservices \
   --secret \
   --resource-group <aks-cluster-resource-group> \
   --name <aks-cluster-name> \
   --target-resource-group <target-cognitive-services-resource-group> \
   --account <target-cognitive-services-account>
```

---

## Clone sample application

1. Clone the sample repository:

   ```Bash
   git clone https://github.com/Azure-Samples/serviceconnector-aks-samples.git
   ```

1. Go to the repository's sample folder for Azure OpenAI:

   ```Bash
   cd serviceconnector-aks-samples/azure-openai-connection-string
   ```

1. Replace the `<MyModel>` placeholder in the `app.py` file with the model name we deployed.

## Build and push container images

1. Build and push the images to your container registry using the Azure CLI [az acr build](/cli/azure/acr#az_acr_build) command.

    ```azurecli-interactive
    az acr build --registry <MyRegistry> --image sc-demo-openai-connstr:latest ./
    ```

1. View the images in your container registry using the [az acr repository list](/cli/azure/acr/repository#az_acr_repository_list) command.

    ```azurecli-interactive
    az acr repository list --name <MyRegistry> --output table
    ```

## Run application and test connection

1. Replace the placeholders in the `pod.yaml` file in the `azure-openai-connection-string` folder.

   * Replace `<YourContainerImage>` with the name of the image we built earlier. For example: `<MyRegistry>.azurecr.io/sc-demo-openai-connstr:latest`.
   * Replace `<SecretCreatedByServiceConnector>` with the secret created by Service Connector. You may check the secret name in the Azure portal, in the **Service Connector** pane.

1. Deploy the pod to your cluster with the `kubectl apply` command. Install `kubectl` locally using the [az aks install-cli](/cli/azure/aks#az_aks_install_cli) command if it isn't installed. The command creates a pod named `sc-demo-openai-connstr` in the default namespace of your AKS cluster.

   ```Bash
   kubectl apply -f pod.yaml
   ```

1. Check if the deployment is successful by viewing the pod with `kubectl`.

   ```Bash
   kubectl get pod/sc-demo-openai-connstr
   ```

1. Check that the connection is working by viewing the logs with `kubectl`.

   ```Bash
   kubectl logs pod/sc-demo-openai-connstr
   ```

## Clean up resources

If you don't need these resources anymore, clean up the Azure resources created in this tutorial by deleting the resource group.

```azurecli-interactive
az group delete \
    --resource-group MyResourceGroup
```

## Related content

* [Connect to Azure OpenAI Service](./how-to-integrate-openai.md)
* [Connect to Azure OpenAI Service in AKS using Workload Identity](./tutorial-python-aks-openai-workload-identity.md)
* [Connect to an Azure AI multi-service resource](./how-to-integrate-cognitive-services.md)