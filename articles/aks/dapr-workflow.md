---
title: Deploy and run workflows with the Dapr extension for Azure Kubernetes Service (AKS)
description: Learn how to deploy and run Dapr Workflow on your Azure Kubernetes Service (AKS) clusters via the Dapr extension.
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: nuversky
ms.service: azure-kubernetes-service
ms.topic: article
ms.date: 03/06/2023
ms.custom: devx-track-azurecli
---

# Manage workflows with the Dapr extension for Azure Kubernetes Service (AKS)

With the Dapr Workflow API, you can easily orchestrate messaging, state management, and failure-handling logic across various microservices. Dapr Workflow can help you create long-running, fault-tolerant, and stateful applications. 

In this guide, you use the [provided order processing workflow example][dapr-workflow-sample] to:

> [!div class="checklist"]
> - Create an Azure Container Registry and an AKS cluster for this sample.
> - Install the Dapr extension on your AKS cluster.
> - Deploy the sample application to AKS. 
> - Start and query workflow instances using HTTP API calls.

The workflow example is an ASP.NET Core project with:
- A [`Program.cs` file][dapr-program] that contains the setup of the app, including the registration of the workflow and workflow activities.
- Workflow definitions found in the [`Workflows` directory][dapr-workflow-dir].
- Workflow activity definitions found in the [`Activities` directory][dapr-activities-dir].

> [!NOTE]
> Dapr Workflow is currently an [alpha][dapr-workflow-alpha] feature and is on a self-service, opt-in basis. Alpha Dapr APIs and components are provided "as is" and "as available," and are continually evolving as they move toward stable status. Alpha APIs and components are not covered by customer support.

## Pre-requisites

- An [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) with Owner or Admin role.
- The latest version of the [Azure CLI][install-cli]
- Latest [Docker][docker]
- Latest [Helm][helm]

## Set up the environment

### Download the sample project

Fork and clone the example workflow application. For more information on forking a repo, see GitHub's guide, [Fork a repo][gh-fork].

```sh
git clone https://github.com/<your-repo>/dapr-workflows-aks-sample.git
```

Navigate to the sample's root directory.

```sh
cd dapr-workflows-aks-sample
```

### Prepare the Docker image

Run the following commands to test that the Docker image works for the application.

```sh       
docker build -t ghcr.io/<your-repo>/workflows-sample:0.1.0 -f Deploy/Dockerfile .
docker push ghcr.io/<your-repo>/workflows-sample:0.1.0
```

### Create an Azure Container Registry

Create an Azure Container Registry (ACR) and log in to retrieve the ACR Login Server. 

```sh
az group create --name myResourceGroup --location eastus
az acr create --resource-group myResourceGroup --name acrName --sku Basic
az acr login --name acrName
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

Expected output:

```sh
acrName.azurecr.io
```

Tag the [Docker image](#prepare-the-docker-image) you prepared earlier and push to your new ACR using the result from the ACR query:

```sh
docker tag ghcr.io/<your-repo>/workflows-sample:0.1.0 acrName.azurecr.io/workflows-sample:0.1.0
docker push acrName.azurecr.io/workflows-sample:0.1.0
```

For more information, see the [Deploy and use ACR][acr] tutorial.

### Create a Kubernetes cluster

Create an AKS cluster and attach to your ACR:

```sh
az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 2 --generate-ssh-keys --attach-acr acrName
```

Make sure `kubectl` is installed and pointed to your AKS cluster.

For more information, see the [Deploy an AKS cluster][cluster] tutorial.

## Deploy the application to AKS

### Update the containers for deployment

Navigate to the [`deployment.yaml` file][deployment-yaml] in your fork of the sample project and open in your preferred code editor.

```sh
cd Deploy
code .
```

In the `deployment.yaml` file, update the `containers` spec value to your new ACR name and image:

```yaml
containers:
- name: workflows-sample
  image: acrName.azurecr.io/workflows-sample:0.1.0
```

Save and close the `deployment.yaml` file.

### Install Dapr on your AKS cluster

Install the Dapr extension on your AKS cluster. Before you start, make sure you've:
- [Installed or updated the `k8s-extension`][k8s-ext]. 
- [Registered the `Microsoft.KubernetesConfiguration` service provider][k8s-sp]

```sh
az k8s-extension create --cluster-type managedClusters --cluster-name myAKSCluster --resource-group myResourceGroup --name dapr --extension-type Microsoft.Dapr
```

Verify Dapr has been installed by running either of the following commands:

```sh
az k8s-extension show --cluster-type managedClusters --cluster-name myAKSCluster --resource-group myResourceGroup --name dapr
```

```sh
kubectl get pods -A
```

### Deploy the Redis Actor state store component

Navigate to the `Deploy` directory in your forked version of the sample:

```sh
cd Deploy
```

Deploy the Redis component:

```sh
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install redis bitnami/redis
kubectl apply -f redis.yaml
```

### Run the application

Once you've deployed Redis, deploy the application to AKS:

```sh
kubectl apply -f deployment.yaml
```

Expose the Dapr sidecar and the sample app:

```sh
kubectl apply -f service.yaml
export APP_URL=$(kubectl get svc/workflows-sample -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
export DAPR_URL=$(kubectl get svc/workflows-sample-dapr -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
```

Verify that the above commands were exported:

```sh
echo $APP_URL
echo $DAPR_URL
```

## Start the workflow

Now that the application and Dapr have been deployed to the AKS cluster, you can now start and query workflow instances. Begin by making an API call to the sample app to restock items in the inventory:

```sh
curl -X GET $APP_URL/stock/restock
```

Start the workflow:

```sh
curl -X POST $DAPR_URL/v1.0-alpha1/workflows/dapr/OrderProcessingWorkflow/1234/start \
  -H "Content-Type: application/json" \
  -d '{ "input" : {"Name": "Paperclips", "TotalCost": 99.95, "Quantity": 1}}'
```

Expected output:

```json
{"instance_id":"1234"}
```

Check the workflow status:

```sh
curl -X GET $DAPR_URL/v1.0-alpha1/workflows/dapr/OrderProcessingWorkflow/1234
```

Expected output:

```json
{
  "WFInfo":
    {
      "instance_id":"1234"
    },
    "start_time":"2023-03-03T19:19:16Z",
    "metadata":
    {
      "dapr.workflow.custom_status":"",
      "dapr.workflow.input":"{\"Name\":\"Paperclips\",\"Quantity\":1,\"TotalCost\":99.95}",
      "dapr.workflow.last_updated":"2023-03-03T19:19:33Z",
      "dapr.workflow.name":"OrderProcessingWorkflow",
      "dapr.workflow.output":"{\"Processed\":true}",
      "dapr.workflow.runtime_status":"COMPLETED"
    }
}
```

Notice that the workflow status is marked as completed.

## Next steps

In this guide, you deployed and ran workflows on a Dapr extension for AKS. You learned how to:

> [!div class="checklist"]
> - Create an Azure Container Registry and an AKS cluster for this sample.
> - Install the Dapr extension on your AKS cluster.
> - Deploy the sample application to AKS. 
> - Start and query workflow instances using HTTP API calls.

[Learn how to add configuration settings to the Dapr extension on your AKS cluster][dapr-config].

<!-- Links Internal -->
[deploy-cluster]: ./tutorial-kubernetes-deploy-cluster.md
[install-cli]: /cli/azure/install-azure-cli
[k8s-ext]: ./dapr.md#set-up-the-azure-cli-extension-for-cluster-extensions
[acr]: ./tutorial-kubernetes-prepare-acr.md
[cluster]: ./tutorial-kubernetes-deploy-cluster.md
[k8s-sp]: ./dapr.md#register-the-kubernetesconfiguration-service-provider
[dapr-config]: ./dapr-settings.md

<!-- Links External -->
[dapr-workflow-sample]: https://github.com/shubham1172/dapr-workflows-aks-sample
[dapr-program]: https://github.com/shubham1172/dapr-workflows-aks-sample/blob/main/Program.cs
[dapr-workflow-dir]: https://github.com/shubham1172/dapr-workflows-aks-sample/tree/main/Workflows
[dapr-activities-dir]: https://github.com/shubham1172/dapr-workflows-aks-sample/tree/main/Activities
[dapr-workflow-alpha]: https://docs.dapr.io/operations/support/support-preview-features/#current-preview-features
[gh-pat]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-with-a-personal-access-token-classic
[deployment-yaml]: https://github.com/hhunter-ms/dapr-workflows-aks-sample/blob/main/Deploy/deployment.yaml
[docker]: https://docs.docker.com/get-docker/
[helm]: https://helm.sh/docs/intro/install/
[gh-fork]: https://docs.github.com/en/get-started/quickstart/fork-a-repo