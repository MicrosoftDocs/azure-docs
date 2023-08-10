---
title: Deploy and run workflows with the Dapr extension for Azure Kubernetes Service (AKS)
description: Learn how to deploy and run Dapr Workflow on your Azure Kubernetes Service (AKS) clusters via the Dapr extension.
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: nuversky
ms.service: azure-kubernetes-service
ms.topic: article
ms.date: 04/05/2023
ms.custom: devx-track-azurecli
---

# Deploy and run workflows with the Dapr extension for Azure Kubernetes Service (AKS)

With Dapr Workflow, you can easily orchestrate messaging, state management, and failure-handling logic across various microservices. Dapr Workflow can help you create long-running, fault-tolerant, and stateful applications.  

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

## Prerequisites

- An [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) with Owner or Admin role.
- The latest version of the [Azure CLI][install-cli]
- Latest [Docker][docker]
- Latest [Helm][helm]

## Set up the environment

### Clone the sample project

Clone the example workflow application. 

```sh
git clone https://github.com/Azure/dapr-workflows-aks-sample.git
```

Navigate to the sample's root directory.

```sh
cd dapr-workflows-aks-sample
```

### Create a Kubernetes cluster

Create a resource group to hold the AKS cluster.

```sh
az group create --name myResourceGroup --location eastus
```

Create an AKS cluster.

```sh
az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 2 --generate-ssh-keys 
```

[Make sure `kubectl` is installed and pointed to your AKS cluster.][kubectl] If you use [the Azure Cloud Shell][az-cloud-shell], `kubectl` is already installed. 

For more information, see the [Deploy an AKS cluster][cluster] tutorial.

## Deploy the application to AKS

### Install Dapr on your AKS cluster

Install the Dapr extension on your AKS cluster. Before you start, make sure you've:
- [Installed or updated the `k8s-extension`][k8s-ext]. 
- [Registered the `Microsoft.KubernetesConfiguration` service provider][k8s-sp]

```sh
az k8s-extension create --cluster-type managedClusters --cluster-name myAKSCluster --resource-group myResourceGroup --name dapr --extension-type Microsoft.Dapr
```

Verify Dapr has been installed by running the following command:

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

[Learn how to add configuration settings to the Dapr extension on your AKS cluster][dapr-config].

<!-- Links Internal -->
[deploy-cluster]: ./tutorial-kubernetes-deploy-cluster.md
[install-cli]: /cli/azure/install-azure-cli
[k8s-ext]: ./dapr.md#set-up-the-azure-cli-extension-for-cluster-extensions
[cluster]: ./tutorial-kubernetes-deploy-cluster.md
[k8s-sp]: ./dapr.md#register-the-kubernetesconfiguration-service-provider
[dapr-config]: ./dapr-settings.md
[az-cloud-shell]: ./learn/quick-kubernetes-deploy-powershell.md#azure-cloud-shell
[kubectl]: ./tutorial-kubernetes-deploy-cluster.md#connect-to-cluster-using-kubectl

<!-- Links External -->
[dapr-workflow-sample]: https://github.com/Azure/dapr-workflows-aks-sample
[dapr-program]: https://github.com/Azure/dapr-workflows-aks-sample/blob/main/Program.cs
[dapr-workflow-dir]: https://github.com/Azure/dapr-workflows-aks-sample/tree/main/Workflows
[dapr-activities-dir]: https://github.com/Azure/dapr-workflows-aks-sample/tree/main/Activities
[dapr-workflow-alpha]: https://docs.dapr.io/operations/support/support-preview-features/#current-preview-features
[deployment-yaml]: https://github.com/Azure/dapr-workflows-aks-sample/blob/main/Deploy/deployment.yaml
[docker]: https://docs.docker.com/get-docker/
[helm]: https://helm.sh/docs/intro/install/
