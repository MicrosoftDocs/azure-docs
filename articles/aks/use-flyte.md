---
title: Build and deploy data and machine learning pipelines with Flyte on Azure Kubernetes Service
titleSuffix: Azure Kubernetes Service
description: Learn about Flyte, an open-source platform for building and deploying data and machine learning pipelines on Azure Kubernetes Service.
ms.topic: how-to
ms.date: 05/17/2024
author: schaffererin
ms.author: schaffererin
---

# Build and deploy data and machine learning pipelines with Flyte on Azure Kubernetes Service (AKS)

This article shows you how to use Flyte, an open-source platform for building and deploying data and machine learning pipelines on Azure Kubernetes Service (AKS).

Flyte is a workflow orchestrator that unifies machine learning, data engineering, and data analytics stacks to help you build robust and reliable applications.

For more information, see [Introduction to Flyte](https://docs.flyte.org/en/latest/introduction.html).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* The Azure CLI installed and configured. Run `az --version` to check the version. If you need to install or upgrade, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli).
* The Helm CLI installed and updated. Run `helm version` to check the version. If you need to install or upgrade, see [Install Helm](https://helm.sh/docs/intro/install/).
* The `kubectl` CLI installed and updated. Run `az aks install-cli` to install it locally or see [Install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

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

In this article, you learned how to deploy a Flyte chart on AKS. To learn more about deployments on AKS, see the following articles:

* [Deploy an application that uses OpenAI on Azure Kubernetes Service (AKS)](./open-ai-quickstart.md)
* [Install existing applications with Helm on Azure Kubernetes Service (AKS)](./kubernetes-helm.md)
* [Deploy a containerized application to Azure Kubernetes Service (AKS)](./tutorial-kubernetes-deploy-application.md

<!-- LINKS -->
[az-group-create]: /cli/azure/group#az-group-create
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
