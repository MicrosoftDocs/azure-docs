---
title: Quickstart - Create an Azure Kubernetes Service cluster in the portal
description: Learn how to use the Azure portal to quickly create an Azure Kubernetes Service (AKS) cluster, then deploy and monitor an application.
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: quickstart
ms.date: 09/24/2018
ms.author: iainfou
ms.custom: mvc
---

# Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster

In this quickstart, you deploy an AKS cluster using the Azure portal. A multi-container application consisting of web front end and a Redis instance is then run on the cluster. Once completed, the application is accessible over the internet.

![Image of browsing to Azure Vote sample application](media/container-service-kubernetes-walkthrough/azure-vote.png)

This quickstart assumes a basic understanding of Kubernetes concepts. For detailed information on Kubernetes, see the [Kubernetes documentation][kubernetes-documentation].

## Sign in to Azure

Sign in to the Azure portal at http://portal.azure.com.

## Create an AKS cluster

In the top left-hand corner of the Azure portal, select **Create a resource** > **Kubernetes Service**.

To create an AKS cluster, complete the following steps:

1. **Basics** - Configure the following options:
    - *PROJECT DETAILS*: Select an Azure subscription, then select or create an Azure resource group, such as *myResourceGroup*. Enter a **Kubernetes cluster name**, such as *myAKSCluster*.
    - *CLUSTER DETAILS*: Select a region, Kubernetes version, and DNS name prefix for the AKS cluster.
    - *SCALE*: Select a VM size for the AKS nodes. The VM size **cannot** be changed once an AKS cluster has been deployed.
        - Select the number of nodes to deploy into the cluster. For this quickstart, set **Node count** to *1*. Node count **can** be adjusted after the cluster has been deployed.
    
    ![Create AKS cluster - provide basic information](media/kubernetes-walkthrough-portal/create-cluster-basics.png)

    Select **Next: Authentication** when complete.

1. **Authentication**: Configure the following options:
    - Create a new service principal or *Configure* to use an existing one. When using an existing SPN, you need to provide the SPN client ID and secret.
    - Enable the option for Kubernetes role-based access controls (RBAC). These controls provide more fine-grained control over access to the Kubernetes resources deployed in your AKS cluster.

    Select **Next: Networking** when complete.

1. **Networking**: Configure the following networking options, which should be set as default:
    
    - **Http application routing** - Select **Yes** to configure an integrated ingress controller with automatic public DNS name creation. For more information on Http routing, see, [AKS HTTP routing and DNS][http-routing].
    - **Network configuration** - Select the **Basic** network configuration using the [kubenet][kubenet] Kubernetes plugin, rather than advanced networking configuration using [Azure CNI][azure-cni]. For more information on networking options, see [AKS networking overview][aks-network].
    
    Select **Next: Monitoring** when complete.

1. When deploying an AKS cluster, Azure Monitor for containers can be configured to monitor the health of the AKS cluster and pods running on the cluster. For more information on container health monitoring, see [Monitor Azure Kubernetes Service health][aks-monitor].

    Select **Yes** to enable container monitoring and select an existing Log Analytics workspace, or create a new one.
    
    Select **Review + create** and then **Create** when ready.

It takes a few minutes to create the AKS cluster and to be ready for use. Browse to the AKS cluster resource group, such as *myResourceGroup*, and select the AKS resource, such as *myAKSCluster*. The AKS cluster dashboard is shown, as in the following example screenshot:

![Example AKS dashboard in the Azure portal](media/kubernetes-walkthrough-portal/aks-portal-dashboard.png)

## Connect to the cluster

To manage a Kubernetes cluster, use [kubectl][kubectl], the Kubernetes command-line client. The `kubectl` client is pre-installed in the Azure Cloud Shell.

Open Cloud Shell using the button on the top right-hand corner of the Azure portal.

![Open the Azure Cloud Shell in the portal](media/kubernetes-walkthrough-portal/aks-cloud-shell.png)

Use the [az aks get-credentials][az-aks-get-credentials] command to configure `kubectl` to connect to your Kubernetes cluster. The following example gets credentials for the cluster name *myAKSCluster* in the resource group named *myResourceGroup*:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

To verify the connection to your cluster, use the [kubectl get][kubectl-get] command to return a list of the cluster nodes.

```azurecli-interactive
kubectl get nodes
```

The following example output shows the single node created in the previous steps.

```
NAME                       STATUS    ROLES     AGE       VERSION
aks-agentpool-14693408-0   Ready     agent     10m       v1.11.2
```

## Run the application

Kubernetes manifest files define a desired state for a cluster, including what container images should be running. In this quickstart, a manifest is used to create all the objects needed to run a sample Azure Vote application. These objects include two [Kubernetes deployments][kubernetes-deployment] - one for the Azure Vote front end, and the other for a Redis instance. Also, two [Kubernetes Services][kubernetes-service] are created - an internal service for the Redis instance, and an external service for accessing the Azure Vote application from the internet.

Create a file named `azure-vote.yaml` and copy into it the following YAML code. If you are working in Azure Cloud Shell, create the file using `vi` or `Nano`, as if working on a virtual or physical system.

```yaml
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: azure-vote-back
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: azure-vote-back
    spec:
      containers:
      - name: azure-vote-back
        image: redis
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 250m
            memory: 256Mi
        ports:
        - containerPort: 6379
          name: redis
---
apiVersion: v1
kind: Service
metadata:
  name: azure-vote-back
spec:
  ports:
  - port: 6379
  selector:
    app: azure-vote-back
---
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: azure-vote-front
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: azure-vote-front
    spec:
      containers:
      - name: azure-vote-front
        image: microsoft/azure-vote-front:v1
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 250m
            memory: 256Mi
        ports:
        - containerPort: 80
        env:
        - name: REDIS
          value: "azure-vote-back"
---
apiVersion: v1
kind: Service
metadata:
  name: azure-vote-front
spec:
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: azure-vote-front
```

Use the [kubectl apply][kubectl-apply] command to run the application.

```azurecli-interactive
kubectl create -f azure-vote.yaml
```

The following example output shows the Kubernetes resources created on your AKS cluster:

```
deployment "azure-vote-back" created
service "azure-vote-back" created
deployment "azure-vote-front" created
service "azure-vote-front" created
```

## Test the application

As the application is run, a [Kubernetes service][kubernetes-service] is created to expose the application to the internet. This process can take a few minutes to complete.

To monitor progress, use the [kubectl get service][kubectl-get] command with the `--watch` argument.

```azurecli-interactive
kubectl get service azure-vote-front --watch
```

Initially, the *EXTERNAL-IP* for the *azure-vote-front* service appears as *pending*.

```
NAME               TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
azure-vote-front   LoadBalancer   10.0.37.27   <pending>     80:30572/TCP   6s
```

Once the *EXTERNAL-IP* address has changed from *pending* to an *IP address*, use `CTRL-C` to stop the kubectl watch process.

```
azure-vote-front   LoadBalancer   10.0.37.27   52.179.23.131   80:30572/TCP   2m
```

Open a web browser to the external IP address of your service to see the Azure Vote App, as shown in the following example:

![Image of browsing to Azure Vote sample application](media/container-service-kubernetes-walkthrough/azure-vote.png)

## Monitor health and logs

When you created the cluster, container insights monitoring was enabled. This monitoring feature provides health metrics for both the AKS cluster and pods running on the cluster. For more information on container health monitoring, see [Monitor Azure Kubernetes Service health][aks-monitor].

It may take a few minutes for this data to populate in the Azure portal. To see current status, uptime, and resource usage for the Azure Vote pods, browse back to the AKS resource in the Azure portal, such as *myAKSCluster*. You can then access the health status as follows:

1. Under **Monitoring** on the left-hand side, choose **Insights (preview)**
1. Across the top, choose to **+ Add Filter**
1. Select *Namespace* as the property, then choose *\<All but kube-system\>*
1. Choose to view the **Containers**.

The *azure-vote-back* and *azure-vote-front* containers are displayed, as shown in the following example:

![View the health of running containers in AKS](media/kubernetes-walkthrough-portal/monitor-containers.png)

To see logs for the `azure-vote-front` pod, select the **View container logs** link on the right-hand side of the containers list. These logs include the *stdout* and *stderr* streams from the container.

![View the containers logs in AKS](media/kubernetes-walkthrough-portal/monitor-container-logs.png)

## Delete cluster

When the cluster is no longer needed, delete the cluster resource, which deletes all associated resources. This operation can be completed in the Azure portal by selecting the **Delete** button on the AKS cluster dashboard. Alternatively, the [az aks delete][az-aks-delete] command can be used in the Cloud Shell:

```azurecli-interactive
az aks delete --resource-group myResourceGroup --name myAKSCluster --no-wait
```

> [!NOTE]
> When you delete the cluster, the Azure Active Directory service principal used by the AKS cluster is not removed. For steps on how to remove the service principal, see [AKS service principal considerations and deletion][sp-delete].

## Get the code

In this quickstart, pre-created container images have been used to create a Kubernetes deployment. The related application code, Dockerfile, and Kubernetes manifest file are available on GitHub.

[https://github.com/Azure-Samples/azure-voting-app-redis][azure-vote-app]

## Next steps

In this quickstart, you deployed a Kubernetes cluster and deployed a multi-container application to it.

To learn more about AKS, and walk through a complete code to deployment example, continue to the Kubernetes cluster tutorial.

> [!div class="nextstepaction"]
> [AKS tutorial][aks-tutorial]

<!-- LINKS - external -->
[azure-vote-app]: https://github.com/Azure-Samples/azure-voting-app-redis.git
[azure-cni]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubenet]: https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#kubenet
[kubernetes-deployment]: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
[kubernetes-documentation]: https://kubernetes.io/docs/home/
[kubernetes-service]: https://kubernetes.io/docs/concepts/services-networking/service/

<!-- LINKS - internal -->
[az-aks-get-credentials]: /cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials
[az-aks-delete]: /cli/azure/aks#az-aks-delete
[aks-monitor]: ../monitoring/monitoring-container-health.md
[aks-network]: ./networking-overview.md
[aks-tutorial]: ./tutorial-kubernetes-prepare-app.md
[http-routing]: ./http-application-routing.md
[sp-delete]: kubernetes-service-principal.md#additional-considerations
