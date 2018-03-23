---
title: Kubernetes on Azure tutorial  - Scale Application
description: AKS tutorial - Scale Application
services: container-service
author: dlepow
manager: timlt

ms.service: container-service
ms.topic: tutorial
ms.date: 02/22/2018
ms.author: danlep
ms.custom: mvc
---

# Tutorial: Scale application in Azure Container Service (AKS)

If you've been following the tutorials, you have a working Kubernetes cluster in AKS and you deployed the Azure Voting app.

In this tutorial, part five of eight, you scale out the pods in the app and try pod autoscaling. You also learn how to scale the number of Azure VM nodes to change the cluster's capacity for hosting workloads. Tasks completed include:

> [!div class="checklist"]
> * Scale the Kubernetes Azure nodes
> * Manually scaling Kubernetes pods
> * Configuring Autoscale pods running the app front end

In subsequent tutorials, the Azure Vote application is updated, and Log Analytics is configured to monitor the Kubernetes cluster.

## Before you begin

In previous tutorials, an application was packaged into a container image, this image uploaded to Azure Container Registry, and a Kubernetes cluster created. The application was then run on the Kubernetes cluster.

If you have not done these steps, and would like to follow along, return to the [Tutorial 1 – Create container images][aks-tutorial-prepare-app].

## Scale AKS nodes

If you created your Kubernetes cluster using the commands in the previous tutorial, it has one node. You can adjust the number of nodes manually if you plan more or fewer container workloads on your cluster.

The following example increases the number of nodes to three in the Kubernetes cluster named *myAKSCluster*. The command takes a couple of minutes to complete.

```azurecli
az aks scale --resource-group=myResourceGroup --name=myAKSCluster --node-count 3
```

The output is similar to:

```
"agentPoolProfiles": [
  {
    "count": 3,
    "dnsPrefix": null,
    "fqdn": null,
    "name": "myAKSCluster",
    "osDiskSizeGb": null,
    "osType": "Linux",
    "ports": null,
    "storageProfile": "ManagedDisks",
    "vmSize": "Standard_D2_v2",
    "vnetSubnetId": null
  }
```

## Manually scale pods

Thus far, the Azure Vote front-end and Redis instance have been deployed, each with a single replica. To verify, run the [kubectl get][kubectl-get] command.

```azurecli
kubectl get pods
```

Output:

```
NAME                               READY     STATUS    RESTARTS   AGE
azure-vote-back-2549686872-4d2r5   1/1       Running   0          31m
azure-vote-front-848767080-tf34m   1/1       Running   0          31m
```

Manually change the number of pods in the `azure-vote-front` deployment using the [kubectl scale][kubectl-scale] command. This example increases the number to 5.

```azurecli
kubectl scale --replicas=5 deployment/azure-vote-front
```

Run [kubectl get pods][kubectl-get] to verify that Kubernetes is creating the pods. After a minute or so, the additional pods are running:

```azurecli
kubectl get pods
```

Output:

```
NAME                                READY     STATUS    RESTARTS   AGE
azure-vote-back-2606967446-nmpcf    1/1       Running   0          15m
azure-vote-front-3309479140-2hfh0   1/1       Running   0          3m
azure-vote-front-3309479140-bzt05   1/1       Running   0          3m
azure-vote-front-3309479140-fvcvm   1/1       Running   0          3m
azure-vote-front-3309479140-hrbf2   1/1       Running   0          15m
azure-vote-front-3309479140-qphz8   1/1       Running   0          3m
```

## Autoscale pods

Kubernetes supports [horizontal pod autoscaling][kubernetes-hpa] to adjust the number of pods in a deployment depending on CPU utilization or other select metrics.

To use the autoscaler, your pods must have CPU requests and limits defined. In the `azure-vote-front` deployment, the front-end container requests 0.25 CPU, with a limit of 0.5 CPU. The settings look like:

```YAML
resources:
  requests:
     cpu: 250m
  limits:
     cpu: 500m
```

The following example uses the [kubectl autoscale][kubectl-autoscale] command to autoscale the number of pods in the `azure-vote-front` deployment. Here, if CPU utilization exceeds 50%, the autoscaler increases the pods to a maximum of 10.


```azurecli
kubectl autoscale deployment azure-vote-front --cpu-percent=50 --min=3 --max=10
```

To see the status of the autoscaler, run the following command:

```azurecli
kubectl get hpa
```

Output:

```
NAME               REFERENCE                     TARGETS    MINPODS   MAXPODS   REPLICAS   AGE
azure-vote-front   Deployment/azure-vote-front   0% / 50%   3         10        3          2m
```

After a few minutes, with minimal load on the Azure Vote app, the number of pod replicas decreases automatically to 3.

## Next steps

In this tutorial, you used different scaling features in your Kubernetes cluster. Tasks covered included:

> [!div class="checklist"]
> * Manually scaling Kubernetes pods
> * Configuring Autoscale pods running the app front end
> * Scale the Kubernetes Azure nodes

Advance to the next tutorial to learn about updating application in Kubernetes.

> [!div class="nextstepaction"]
> [Update an application in Kubernetes][aks-tutorial-update-app]

<!-- LINKS - external -->
[kubectl-autoscale]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#autoscale
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-scale]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#scale
[kubernetes-hpa]: https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/

<!-- LINKS - internal -->
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[aks-tutorial-update-app]: ./tutorial-kubernetes-app-update.md
