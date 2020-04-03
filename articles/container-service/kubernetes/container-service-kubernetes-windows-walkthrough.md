---
title: (DEPRECATED) Quickstart - Azure Kubernetes cluster for Windows
description: Quickly learn to create a Kubernetes cluster for Windows containers in Azure Container Service with the Azure CLI.
author: dlepow

ms.service: container-service
ms.topic: conceptual
ms.date: 07/18/2017
ms.author: danlep
ms.custom: H1Hack27Feb2017, mvc, devcenter
---

# (DEPRECATED) Deploy Kubernetes cluster for Windows containers

[!INCLUDE [ACS deprecation](../../../includes/container-service-kubernetes-deprecation.md)]

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This guide details using the Azure CLI to deploy a [Kubernetes](https://kubernetes.io/docs/home/) cluster in [Azure Container Service](../container-service-intro.md). Once the cluster is deployed, you connect to it with the Kubernetes `kubectl` command-line tool, and you deploy your first Windows container.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli). 

> [!NOTE]
> Support for Windows containers on Kubernetes in Azure Container Service is in preview. 
>

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical group in which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

## Create Kubernetes cluster
Create a Kubernetes cluster in Azure Container Service with the [az acs create](/cli/azure/acs#az-acs-create) command. 

The following example creates a cluster named *myK8sCluster* with one Linux master node and two Windows agent nodes. This example creates SSH keys needed to connect to the Linux master. This example uses *azureuser* for an administrative user name and *myPassword12* as the password on the Windows nodes. Update these values to something appropriate to your environment. 



```azurecli-interactive 
az acs create --orchestrator-type=kubernetes \
    --resource-group myResourceGroup \
    --name=myK8sCluster \
    --agent-count=2 \
    --generate-ssh-keys \
    --windows --admin-username azureuser \
    --admin-password myPassword12
```

After several minutes, the command completes, and shows you information about your deployment.

## Install kubectl

To connect to the Kubernetes cluster from your client computer, use [`kubectl`](https://kubernetes.io/docs/user-guide/kubectl/), the Kubernetes command-line client. 

If you're using Azure CloudShell, `kubectl` is already installed. If you want to install it locally, you can use the [az acs kubernetes install-cli](/cli/azure/acs/kubernetes) command.

The following Azure CLI example installs `kubectl` to your system. On Windows, run this command as an administrator.

```azurecli-interactive 
az acs kubernetes install-cli
```


## Connect with kubectl

To configure `kubectl` to connect to your Kubernetes cluster, run the [az acs kubernetes get-credentials](/cli/azure/acs/kubernetes) command. The following example
downloads the cluster configuration for your Kubernetes cluster.

```azurecli-interactive 
az acs kubernetes get-credentials --resource-group=myResourceGroup --name=myK8sCluster
```

To verify the connection to your cluster from your machine, try running:

```azurecli-interactive
kubectl get nodes
```

`kubectl` lists the master and agent nodes.

```azurecli-interactive
NAME                    STATUS                     AGE       VERSION
k8s-agent-98dc3136-0    Ready                      5m        v1.5.3
k8s-agent-98dc3136-1    Ready                      5m        v1.5.3
k8s-master-98dc3136-0   Ready,SchedulingDisabled   5m        v1.5.3

```

## Deploy a Windows IIS container

You can run a Docker container inside a Kubernetes *pod*, which contains one or more containers. 

This basic example uses a JSON file to specify a Microsoft Internet Information Server (IIS) container, and then creates the pod using the `kubctl apply` command. 

Create a local file named `iis.json` and copy the following text. This file tells Kubernetes to run IIS on Windows Server 2016 Nano Server, using a public container image from [Docker Hub](https://hub.docker.com/r/microsoft/iis/). The container uses port 80, but initially is only accessible within the cluster network.

 ```JSON
 {
  "apiVersion": "v1",
  "kind": "Pod",
  "metadata": {
    "name": "iis",
    "labels": {
      "name": "iis"
    }
  },
  "spec": {
    "containers": [
      {
        "name": "iis",
        "image": "microsoft/iis:nanoserver",
        "ports": [
          {
          "containerPort": 80
          }
        ]
      }
    ],
    "nodeSelector": {
     "beta.kubernetes.io/os": "windows"
     }
   }
 }
 ```

To start the pod, type:
  
```azurecli-interactive
kubectl apply -f iis.json
```  

To track the deployment, type:
  
```azurecli-interactive
kubectl get pods
```

While the pod is deploying, the status is `ContainerCreating`. It can take a few minutes for the container to enter the `Running` state.

```azurecli-interactive
NAME     READY        STATUS        RESTARTS    AGE
iis      1/1          Running       0           32s
```

## View the IIS welcome page

To expose the pod to the world with a public IP address, type the following command:

```azurecli-interactive
kubectl expose pods iis --port=80 --type=LoadBalancer
```

With this command, Kubernetes creates a service and an Azure load balancer rule with a public IP address for the service. 

Run the following command to see the status of the service.

```azurecli-interactive
kubectl get svc
```

Initially the IP address appears as `pending`. After a few minutes, the external IP address of the `iis` pod is set:
  
```azurecli-interactive
NAME         CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE       
kubernetes   10.0.0.1       <none>          443/TCP        21h       
iis          10.0.111.25    13.64.158.233   80/TCP         22m
```

You can use a web browser of your choice to see the default IIS welcome page at the external IP address:

![Image of browsing to IIS](./media/container-service-kubernetes-windows-walkthrough/kubernetes-iis.png)  


## Delete cluster
When the cluster is no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, container service, and all related resources.

```azurecli-interactive 
az group delete --name myResourceGroup
```


## Next steps

In this quick start, you deployed a Kubernetes cluster, connected with `kubectl`, and deployed a pod with an IIS container. To learn more about Azure Container Service, continue to the Kubernetes tutorial.

> [!div class="nextstepaction"]
> [Manage an ACS Kubernetes cluster](container-service-tutorial-kubernetes-prepare-app.md)
