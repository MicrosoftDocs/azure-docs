---
title: Manage workflows with the Dapr extension for Azure Kubernetes Service (AKS)
description: Learn how to run and manage Dapr Workflow on your Azure Kubernetes Service (AKS) clusters via the Dapr extension.
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: nuversky
ms.service: azure-kubernetes-service
ms.topic: article
ms.date: 03/02/2023
ms.custom: devx-track-azurecli
---

# Manage workflows with the Dapr extension for Azure Kubernetes Service (AKS)

With the Dapr Workflow API, you can easily orchestrate messaging, state management, and failure-handling logic across various microservices. Dapr Workflow can help you create long-running, fault-tolerant, and stateful applications. 

In this guide, you'll use the [provided order processing workflow example][dapr-workflow-sample] to:

> [!div class="checklist"]
> - Install the Dapr extension on your AKS cluster.
> - Deploy the sample application to AKS. 
> - Start and query workflow instances using API calls.

The workflow example is an ASP.NET Core project with:
- A [`Program.cs` file][dapr-program] that contains the setup of the app, including the registration of the workflow and workflow activities.
- Workflow definitions found in the [`Workflows` directory][dapr-workflow-dir].
- Workflow activity definitions found in the [`Activities` directory][dapr-activities-dir].

> [!NOTE]
> Dapr Workflow is currently an [alpha][dapr-workflow-alpha] feature and is on a self-service, opt-in basis. Alpha Dapr APIs and components are provided "as is" and "as available," and are continually evolving as they move toward stable status. Alpha APIs and components are not covered by customer support.

## Pre-requisites

- An Azure subscription. [Don't have one? Create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- The latest version of the [Azure CLI][install-cli]
- Create an [AKS cluster][deploy-cluster]
- [An Azure Kubernetes Service RBAC Admin role](../role-based-access-control/built-in-roles.md#azure-kubernetes-service-rbac-admin)
- Log into [ghcr.io][gh-pat] using your GitHub Personal Access Token to authenticate to the container registry.
- Install .NET 6+
- Install Docker

## Set up the environment

Clone the example workflow application.

```sh
git clone https://github.com/shubham1172/dapr-workflows-aks-sample.git
```

Navigate to the root directory.

```sh
cd dapr-workflows-aks-sample
```

If you haven't already, log into [ghcr.io][gh-pat]. 

## Prepare the Docker image

Run the following commands to build and push the Docker image for the application.

```sh
docker build -t ghcr.io/shubham1172/dwf-sample:0.1.0 -f Deploy/Dockerfile .
docker push ghcr.io/shubham1172/dwf-sample:0.1.0
```

## Install Dapr on your AKS cluster

Once you've built the Docker image, install the Dapr extension on your AKS cluster. Before you do this, make sure you've [installed or updated the `k8s-extension`][k8s-ext]. 

```sh
az k8s-extension create --cluster-type managedClusters \
--cluster-name <myAKSCluster> \
--resource-group <myResourceGroup> \
--name dapr \
--extension-type Microsoft.Dapr
```

## Deploy to AKS

Run the following commands to the cluster:

- Install the Redis state store component and the sample app
- Expose the Dapr sidecar and the sample app

**Install Redis**

```sh
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install redis bitnami/redis
k apply -f Deploy/redis.yaml
```

**Install the sample app**

```sh
k apply -f Deploy/deployment.yaml
```

**Expose the Dapr sidecar and the sample app**

```sh
k apply -f Deploy/service.yaml
export SAMPLE_APP_URL=$(k get svc/workflows-sample -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
export DAPR_URL=$(k get svc/workflows-sample-dapr -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
```

## Run the workflow

Now that the application and Dapr have been deployed to the AKS cluster, you can now start and query workflow instances. Begin by making an API call to the sample app to restock items in the inventory:

```sh
curl -X GET $SAMPLE_APP_URL/stock/restock
```

Start the workflow:

```sh
curl -i -X POST $DAPR_URL/v1.0-alpha1/workflows/dapr/OrderProcessingWorkflow/1234/start \
  -H "Content-Type: application/json" \
  -d '{ "input" : {"Name": "Paperclips", "TotalCost": 99.95, "Quantity": 1}}'
```

Check the workflow status:

```sh
curl -i -X GET $DAPR_URL/v1.0-alpha1/workflows/dapr/OrderProcessingWorkflow/1234
```

## Next steps

<!-- Links Internal -->
[deploy-cluster]: ./tutorial-kubernetes-deploy-cluster.md
[install-cli]: /cli/azure/install-azure-cli
[k8s-ext]: ./dapr.md#set-up-the-azure-cli-extension-for-cluster-extensions

<!-- Links External -->
[dapr-workflow-sample]: https://github.com/shubham1172/dapr-workflows-aks-sample
[dapr-program]: https://github.com/shubham1172/dapr-workflows-aks-sample/blob/main/Program.cs
[dapr-workflow-dir]: https://github.com/shubham1172/dapr-workflows-aks-sample/tree/main/Workflows
[dapr-activities-dir]: https://github.com/shubham1172/dapr-workflows-aks-sample/tree/main/Activities
[dapr-workflow-alpha]: https://docs.dapr.io/operations/support/support-preview-features/#current-preview-features
[gh-pat]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-with-a-personal-access-token-classic
