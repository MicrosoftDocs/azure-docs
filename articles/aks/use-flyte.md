---
title: Build and deploy data and machine learning pipelines with Flyte on Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn about Flyte, an open-source platform for building and deploying data and machine learning pipelines on Azure Kubernetes Service (AKS).
ms.topic: how-to
ms.date: 06/06/2024
author: schaffererin
ms.author: schaffererin
ms.service: azure-kubernetes-service
---

# Build and deploy data and machine learning pipelines with Flyte on Azure Kubernetes Service (AKS)

This article shows you how to use Flyte on Azure Kubernetes Service (AKS). Flyte is an open-source workflow orchestrator that unifies machine learning, data engineering, and data analytics stacks to help you build robust and reliable applications. When using Flyte as a Kubernetes-native workflow automation tool, you can focus on experimentation and providing business value without increasing your scope to infrastructure and resource management. Keep in mind that Flyte isn't officially supported by Microsoft, so use it at your own discretion.

For more information, see [Introduction to Flyte][flyte].


[!INCLUDE [open source disclaimer](./includes/open-source-disclaimer.md)]

## Flyte use cases

Flyte can be used for a variety of use cases, including:

* Deliver models for streamlined profit and loss financial calculations.
* Process petabytes of data to efficiently conduct 3D mapping of new areas.
* Quickly rollback to previous versions and minimize impact of bugs in your pipelines.

For more information, see [Core Flyte use cases](https://docs.flyte.org/en/latest/core_use_cases/index.html).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account][azure-free].
  * If you have multiple subscriptions, make sure you select the correct one using the `az account set --subscription <subscription-id>` command.
* The Azure CLI installed and configured. Check your version using the `az --version` command. If you need to install or upgrade, see [Install the Azure CLI][install-azure-cli].
* The Helm CLI installed and updated. Check your version using the `helm version` command. If you need to install or upgrade, see [Install Helm][install-helm].
* The `kubectl` CLI installed and updated. Install it locally using the `az aks install-cli` command or using [Install kubectl][install-kubectl].
* A local Docker development environment. For more information, see [Get Docker][get-docker].
* `flytekit` and `flytectl` installed. For more information, see [Flyte installation][flyte-install].

> [!NOTE]
> If you're using the Azure Cloud Shell, the Azure CLI, Helm, and kubectl are already installed.

### Set environment variables

* Set environment variables for use throughout the article. Replace the placeholder values with your own values.

    ```bash
    export RESOURCE_GROUP="<resource-group-name>"
    export LOCATION="<location>"
    export CLUSTER_NAME="<cluster-name>"
    export DNS_NAME_PREFIX="<dns-name-prefix>"
    ```

## Create an AKS cluster

1. Create an Azure resource group for the AKS cluster using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name $RESOURCE_GROUP --location $LOCATION
    ```

2. Create an AKS cluster using the [`az aks create`][az-aks-create] command with the `--enable-azure-rbac`, `--enable-managed-identity`, `--enable-aad`, and `--dns-name-prefix` parameters.

    ```azurecli-interactive
    az aks create --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --enable-azure-rbac --enable-managed-identity --enable-aad --dns-name-prefix $DNS_NAME_PREFIX  --generate-ssh-keys
    ```

## Connect to your AKS cluster

* Configure `kubectl` to connect to your AKS cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME
    ```

## Add the Flyte Helm repository

* Add the Flyte Helm repository using the `helm repo add` command.

    ```bash
    helm repo add flyteorg https://flyteorg.github.io/flyte
    ```

## Find Flyte Helm charts

1. Search for Flyte Helm charts using the `helm search repo` command.

    ```bash
    helm search repo flyteorg
    ```

    The following example output shows some of the available Flyte Helm charts:

    ```output
    NAME                    CHART VERSION   APP VERSION     DESCRIPTION
    flyteorg/flyte          v1.12.0                         A Helm chart for Flyte Sandbox
    flyteorg/flyte-binary   v1.12.0         1.16.0          Chart for basic single Flyte executable deployment
    flyteorg/flyte-core     v1.12.0                         A Helm chart for Flyte core
    flyteorg/flyte-deps     v1.12.0                         A Helm chart for Flyte dependencies
    flyteorg/flyte-sandbox  0.1.0           1.16.1          A Helm chart for the Flyte local sandbox
    flyteorg/flyteagent     v0.1.10                         A Helm chart for Flyte Agent
    ```

2. Update the repository using the `helm repo update` command.

    ```bash
    helm repo update
    ```

## Deploy a Flyte chart on AKS

In this section, you deploy the flyte-binary Helm chart so you can begin building and deploying data and machine learning pipelines with Flyte on AKS. The flyte-binary chart is a basic single Flyte executable deployment.

1. Create a namespace for your Flyte deployment using the `kubectl create namespace` command.

    ```bash
    kubectl create namespace <namespace-name>
    ```

2. Install a Flyte Helm chart using the `helm install` command. In this example, we use the `flyte-binary` chart.

    ```bash
    helm install flyte-binary flyteorg/flyte-core --namespace <namespace-name>
    ```

3. Verify that the Flyte deployment is running using the `kubectl get services` command.

    ```bash
    kubectl get services --namespace <namespace-name> --output wide
    ```

    The following condensed example output shows the Flyte deployment:

    ```output
    NAME                            TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)          AGE
    flyteorg-flyte-binary-grpc      ClusterIP      xx.x.xx.xxx    <none>          81/TCP           1m
    flyteorg-flyte-binary-http      ClusterIP      xx.x.xx.xxx    <none>          80/TCP           1m
    flyteorg-flyte-binary-webhook   ClusterIP      xx.x.xx.xxx    <none>          80/TCP           1m
    ```

## Next steps

In this article, you learned how to deploy a Flyte chart on AKS. To start building and deploying data and machine learning pipelines, see the following articles:

* [Perform exploratory data analysis (EDA) with Flyte and Jupyter notebooks][flyte-eda]
* [Orchestrate an ML pipeline with Flyte to predict housing prices across regions][flyte-pipelines]

<!-- LINKS -->
[az-group-create]: /cli/azure/group#az-group-create
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[flyte]: https://docs.flyte.org/en/latest/introduction.html
[azure-free]: https://azure.microsoft.com/free
[install-azure-cli]: /cli/azure/install-azure-cli
[install-helm]: https://helm.sh/docs/intro/install/
[install-kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[get-docker]: https://docs.docker.com/get-docker/
[flyte-install]: https://flyte-next.readthedocs.io/en/latest/introduction.html#installation
[flyte-eda]: https://docs.flyte.org/en/latest/flytesnacks/examples/exploratory_data_analysis/index.html
[flyte-pipelines]: https://docs.flyte.org/en/latest/flytesnacks/examples/house_price_prediction/index.html
