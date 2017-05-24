---
title: Azure CLI Quickstart - Kubernetes cluster | Microsoft Docs
description: Quickly learn to create a Kubernetes cluster for Windows containers in Azure Container Service with the Azure CLI.
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: acs, azure-container-service, kubernetes
keywords: ''

ms.assetid: 
ms.service: container-service
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/24/2017
ms.author: danlep
ms.custom: H1Hack27Feb2017

---

# Create a Kubernetes cluster for Windows containers with the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This guide details using the Azure CLI to deploy a [Kubernetes](https://kubernetes.io/docs/home/) cluster in [Azure Container Service](container-service-intro.md). Once the cluster is deployed, you connect to it with the Kubernetes `kubectl` command-line tool, and you deploy your first Windows container.

To complete this quick start, make sure you have installed the latest [Azure CLI 2.0](/cli/azure/install-azure-cli). You can also use [Cloud Shell](/azure/cloud-shell/quickstart) from your browser.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

> [!NOTE]
> Support for Windows containers on Kubernetes in Azure Container Service is in preview. 
>



## Log in to Azure 

Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.

```azurecli
az login
```

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command. An Azure resource group is a logical group in which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli
az group create --name myResourceGroup --location eastus
```

## Create Kubernetes cluster
Create a Kubernetes cluster in Azure Container Service with the [az acs create](/cli/azure/acs#create) command. 

The following example creates a cluster named *myK8sCluster* with one Linux master node and two Windows agent nodes, and creates SSH keys and a [service principal](container-service-kubernetes-service-principal.md) if they don't already exist in the default locations. This example uses *azureuser* for an administrative user name and *myPassword12* as the password on the Windows nodes. Update these values to something appropriate to your environment. 



```azurecli
az acs create --orchestrator-type=kubernetes \
    --resource-group myResourceGroup \
    --name=myK8sCluster \
    --agent-count=2 \
    --generate-ssh-keys \
    --windows --admin-username azureuser \
    --admin-password myPassword12
```

After several minutes, the command completes, and you should have a working Kubernetes cluster.


## Install kubectl

To connect to the Kubernetes cluster from your client computer, use [`kubectl`](https://kubernetes.io/docs/user-guide/kubectl/), the Kubernetes command-line client. 

If you're using CloudShell, `kubectl` is alredy installed. If you want to install it locally, you can use the [az acs kubernetes install-cli](/cli/azure/acs/kubernetes#install-cli) command.

The following example installs `kubectl` to a full path you specify with the `--install-location` option. If you are running the Azure CLI on macOS or Linux, you might need to run with `sudo`.

```azurecli
sudo az acs kubernetes install-cli --install-location full-path-to-kubectl 
```

After `kubectl` is installed, add it to your system path. 

## Configure kubectl and connect

To connect `kubectl` to your Kubernetes cluster, run the [az acs kubernetes get-credentials](cli/azure/acs/kubernetes#get-credentials) command. The following example
downloads the cluster configuration for your Kubernetes cluster.

```azurecli
az acs kubernetes get-credentials --resource-group=myResourceGroup --name=myK8sCluster
```

Now you are ready to access your cluster from your machine. Try running:

```bash
kubectl get nodes
```

`kubectl` shows output similar to the following.

```bash


```



## Create your first Windows container

After creating the cluster and connecting with `kubectl`, try starting a Windows app from a Docker container and expose it to the internet. This basic example uses a JSON file to specify a Microsoft Internet Information Server (IIS) container, and then creates it using `kubctl apply`. 

1. Create a local file named `iis.json` and copy the following. This file tells Kubernetes to run IIS on Windows Server 2016 Server Core, using a public image from [Docker Hub](https://hub.docker.com/r/microsoft/iis/). The container uses port 80, but initially is only accessible within the cluster network.

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
          "image": "microsoft/iis",
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
2. To start the application, type:  
  
  ```bash
  kubectl apply -f iis.json
  ```  
3. To track the deployment of the container, type:  
  ```bash
  kubectl get pods
  ```
  While the container is deploying, the status is `ContainerCreating`. 

  ![IIS container in ContainerCreating state](media/container-service-kubernetes-windows-walkthrough/iis-pod-creating.png)   

  Because of the size of the IIS image, it can take several minutes for the container to enter the `Running` state.

  ![IIS container in Running state](media/container-service-kubernetes-windows-walkthrough/iis-pod-running.png)

4. To expose the container to the world, type the following command:

  ```bash
  kubectl expose pods iis --port=80 --type=LoadBalancer
  ```

  With this command, Kubernetes creates an Azure load balancer rule with a public IP address. The change takes a few minutes to propagate to the load balancer. For details, see [Load balance containers in a Kubernetes cluster in Azure Container Service](container-service-kubernetes-load-balancing.md).

5. Run the following command to see the status of the service.

  ```bash
  kubectl get svc
  ```

  Initially the IP address appears as `pending`:

  ![Pending external IP address](media/container-service-kubernetes-windows-walkthrough/iis-svc-expose.png)

  After a few minutes, the IP address is set:
  
  ![External IP address for IIS](media/container-service-kubernetes-windows-walkthrough/iis-svc-expose-public.png)


6. After the external IP address is available, you can browse to it in your browser:

  ![Image of browsing to IIS](media/container-service-kubernetes-windows-walkthrough/kubernetes-iis.png)  

7. To delete the IIS pod, type:

  ```bash
  kubectl delete pods iis
  ```

## Next steps

* To use the Kubernetes UI, run the `kubectl proxy` command. Then, browse to http://localhost:8001/ui.

* For steps to build a custom IIS website and run it in a Windows container, see the guidance at [Docker Hub](https://hub.docker.com/r/microsoft/iis/).

* To access the Windows nodes through an RDP SSH tunnel to the master with PuTTy, see the [ACS-Engine documentation](https://github.com/Azure/acs-engine/blob/master/docs/ssh.md#create-port-80-tunnel-to-the-master). 
