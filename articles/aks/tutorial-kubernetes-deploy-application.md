---
title: Kubernetes on Azure tutorial - Deploy an application
description: In this Azure Kubernetes Service (AKS) tutorial, you deploy a multi-container application to your cluster using a custom image stored in Azure Container Registry.
ms.topic: tutorial
ms.date: 01/04/2023
ms.custom: mvc
#Customer intent: As a developer, I want to learn how to deploy apps to an Azure Kubernetes Service (AKS) cluster so that I can deploy and run my own applications.
---

# Tutorial: Run applications in Azure Kubernetes Service (AKS)

Kubernetes provides a distributed platform for containerized applications. You build and deploy your own applications and services into a Kubernetes cluster and let the cluster manage the availability and connectivity. In this tutorial, part four of seven, you deploy a sample application into a Kubernetes cluster. You learn how to:

> [!div class="checklist"]
>
> * Update a Kubernetes manifest file.
> * Run an application in Kubernetes.
> * Test the application.

In later tutorials, you'll scale out and update your application.

This quickstart assumes you have a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

> [!TIP]
> AKS clusters can use GitOps for configuration management. GitOp enables declarations of your cluster's state, which are pushed to source control, to be applied to the cluster automatically. To learn how to use GitOps to deploy an application with an AKS cluster, see the [prerequisites for Azure Kubernetes Service clusters][gitops-flux-tutorial-aks] in the [GitOps with Flux v2][gitops-flux-tutorial] tutorial.

## Before you begin

In previous tutorials, you packaged an application into a container image, uploaded the image to Azure Container Registry, and created a Kubernetes cluster.

To complete this tutorial, you need the pre-created `azure-vote-all-in-one-redis.yaml` Kubernetes manifest file. This file download was included with the application source code in a previous tutorial. Verify that you've cloned the repo and that you've changed directories into the cloned repo. If you haven't done these steps and would like to follow along, start with [Tutorial 1: Prepare an application for AKS][aks-tutorial-prepare-app].

### [Azure CLI](#tab/azure-cli)

This tutorial requires that you're running the Azure CLI version 2.0.53 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### [Azure PowerShell](#tab/azure-powershell)

This tutorial requires that you're running Azure PowerShell version 5.9.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install].

---

## Update the manifest file

In these tutorials, an Azure Container Registry (ACR) instance stores the container image for the sample application. To deploy the application, you must update the image name in the Kubernetes manifest file to include the ACR login server name.

### [Azure CLI](#tab/azure-cli)

Get the ACR login server name using the [az acr list][az-acr-list] command.

```azurecli
az acr list --resource-group myResourceGroup --query "[].{acrLoginServer:loginServer}" --output table
```

### [Azure PowerShell](#tab/azure-powershell)

Get the ACR login server name using the [Get-AzContainerRegistry][get-azcontainerregistry] cmdlet.

```azurepowershell
(Get-AzContainerRegistry -ResourceGroupName myResourceGroup -Name <acrName>).LoginServer
```

---

The sample manifest file from the git repo you cloned in the first tutorial uses the images from Microsoft Container Registry (*mcr.microsoft.com*). Make sure you're in the cloned *azure-voting-app-redis* directory, and then open the manifest file with a text editor, such as `vi`:

```console
vi azure-vote-all-in-one-redis.yaml
```

Replace *mcr.microsoft.com* with your ACR login server name. You can find the image name on line 60 of the manifest file. The following example shows the default image name:

```yaml
containers:
- name: azure-vote-front
  image: mcr.microsoft.com/azuredocs/azure-vote-front:v1
```

Provide your own ACR login server name so your manifest file looks similar to the following example:

```yaml
containers:
- name: azure-vote-front
  image: <acrName>.azurecr.io/azure-vote-front:v1
```

Save and close the file. In `vi`, use `:wq`.

## Deploy the application

To deploy your application, use the [`kubectl apply`][kubectl-apply] command, specifying the sample manifest file. This command parses the manifest file and creates the defined Kubernetes objects.

```console
kubectl apply -f azure-vote-all-in-one-redis.yaml
```

The following example output shows the resources successfully created in the AKS cluster:

```console
$ kubectl apply -f azure-vote-all-in-one-redis.yaml

deployment "azure-vote-back" created
service "azure-vote-back" created
deployment "azure-vote-front" created
service "azure-vote-front" created
```

## Test the application

When the application runs, a Kubernetes service exposes the application front end to the internet. This process can take a few minutes to complete.

To monitor progress, use the [`kubectl get service`][kubectl-get] command with the `--watch` argument.

```console
kubectl get service azure-vote-front --watch
```

Initially the *EXTERNAL-IP* for the *azure-vote-front* service shows as *pending*.

```output
azure-vote-front   LoadBalancer   10.0.34.242   <pending>     80:30676/TCP   5s
```

When the *EXTERNAL-IP* address changes from *pending* to an actual public IP address, use `CTRL-C` to stop the `kubectl` watch process. The following example output shows a valid public IP address assigned to the service:

```output
azure-vote-front   LoadBalancer   10.0.34.242   52.179.23.131   80:30676/TCP   67s
```

To see the application in action, open a web browser to the external IP address of your service.

:::image type="content" source="./media/container-service-kubernetes-tutorials/azure-vote.png" alt-text="Screenshot showing the container image Azure Voting App running in an AKS cluster opened in a local web browser" lightbox="./media/container-service-kubernetes-tutorials/azure-vote.png":::

If the application doesn't load, it might be an authorization problem with your image registry. To view the status of your containers, use the `kubectl get pods` command. If you can't pull the container images, see [Authenticate with Azure Container Registry from Azure Kubernetes Service](cluster-container-registry-integration.md).

## Next steps

In this tutorial, you deployed a sample Azure vote application to a Kubernetes cluster in AKS. You learned how to:

> [!div class="checklist"]
>
> * Update a Kubernetes manifest file.
> * Run an application in Kubernetes.
> * Test the application.

In  the next tutorial, you'll learn how to scale a Kubernetes application and the underlying Kubernetes infrastructure.

> [!div class="nextstepaction"]
> [Scale Kubernetes application and infrastructure][aks-tutorial-scale]

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get

<!-- LINKS - internal -->
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[aks-tutorial-scale]: ./tutorial-kubernetes-scale.md
[az-acr-list]: /cli/azure/acr
[azure-cli-install]: /cli/azure/install-azure-cli
[kubernetes-concepts]: concepts-clusters-workloads.md
[kubernetes-service]: concepts-network.md#services
[azure-powershell-install]: /powershell/azure/install-az-ps
[get-azcontainerregistry]: /powershell/module/az.containerregistry/get-azcontainerregistry
[gitops-flux-tutorial]: ../azure-arc/kubernetes/tutorial-use-gitops-flux2.md?toc=/azure/aks/toc.json
[gitops-flux-tutorial-aks]: ../azure-arc/kubernetes/tutorial-use-gitops-flux2.md?toc=/azure/aks/toc.json#for-azure-kubernetes-service-clusters
