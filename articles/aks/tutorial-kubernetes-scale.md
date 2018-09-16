---
title: Kubernetes on Azure tutorial  - Scale Application
description: In this Azure Kubernetes Service (AKS) tutorial, you learn how to scale nodes and pods in Kubernetes, and implement horizontal pod autoscaling.
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: tutorial
ms.date: 08/14/2018
ms.author: iainfou
ms.custom: mvc

#Customer intent: As a developer or IT pro, I want to learn how to scale my applications in an Azure Kubernetes Service (AKS) cluster so that I can provide high availability or respond to customer demand and application load.
---

# Tutorial: Scale applications in Azure Kubernetes Service (AKS)

If you've been following the tutorials, you have a working Kubernetes cluster in AKS and you deployed the Azure Voting app. In this tutorial, part five of seven, you scale out the pods in the app and try pod autoscaling. You also learn how to scale the number of Azure VM nodes to change the cluster's capacity for hosting workloads. You learn how to:

> [!div class="checklist"]
> * Scale the Kubernetes nodes
> * Manually scale Kubernetes pods that run your application
> * Configure autoscaling pods that run the app front-end

In subsequent tutorials, the Azure Vote application is updated to a new version.

## Before you begin

In previous tutorials, an application was packaged into a container image, this image uploaded to Azure Container Registry, and a Kubernetes cluster created. The application was then run on the Kubernetes cluster. If you have not done these steps, and would like to follow along, return to the [Tutorial 1 – Create container images][aks-tutorial-prepare-app].

This tutorial requires that you are running the Azure CLI version 2.0.38 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Manually scale pods

When the Azure Vote front-end and Redis instance were deployed in previous tutorials, a single replica was created. To see the number and state of pods in your cluster, use the [kubectl get][kubectl-get] command as follows:

```console
kubectl get pods
```

The following example output shows one front-end pod and one back-end pod:

```
NAME                               READY     STATUS    RESTARTS   AGE
azure-vote-back-2549686872-4d2r5   1/1       Running   0          31m
azure-vote-front-848767080-tf34m   1/1       Running   0          31m
```

To manually change the number of pods in the *azure-vote-front* deployment, use the [kubectl scale][kubectl-scale] command. The following example increases the number of front-end pods to *5*:

```console
kubectl scale --replicas=5 deployment/azure-vote-front
```

Run [kubectl get pods][kubectl-get] again to verify that Kubernetes creates the additional pods. After a minute or so, the additional pods are available in your cluster:

```console
$ kubectl get pods

                                    READY     STATUS    RESTARTS   AGE
azure-vote-back-2606967446-nmpcf    1/1       Running   0          15m
azure-vote-front-3309479140-2hfh0   1/1       Running   0          3m
azure-vote-front-3309479140-bzt05   1/1       Running   0          3m
azure-vote-front-3309479140-fvcvm   1/1       Running   0          3m
azure-vote-front-3309479140-hrbf2   1/1       Running   0          15m
azure-vote-front-3309479140-qphz8   1/1       Running   0          3m
```

## Autoscale pods

Kubernetes supports [horizontal pod autoscaling][kubernetes-hpa] to adjust the number of pods in a deployment depending on CPU utilization or other select metrics. The [Metrics Server][metrics-server] is used to provide resource utilization to Kubernetes. To install the Metrics Server, clone the `metrics-server` GitHub repo and install the example resource definitions. To view the contents of these YAML definitions, see [Metrics Server for Kuberenetes 1.8+][metrics-server-github].

```console
git clone https://github.com/kubernetes-incubator/metrics-server.git
kubectl create -f metrics-server/deploy/1.8+/
```

To use the autoscaler, your pods must have CPU requests and limits defined. In the `azure-vote-front` deployment, the front-end container requests 0.25 CPU, with a limit of 0.5 CPU. The settings look like:

```yaml
resources:
  requests:
     cpu: 250m
  limits:
     cpu: 500m
```

The following example uses the [kubectl autoscale][kubectl-autoscale] command to autoscale the number of pods in the *azure-vote-front* deployment. If CPU utilization exceeds 50%, the autoscaler increases the pods up to a maximum of 10 instances:

```console
kubectl autoscale deployment azure-vote-front --cpu-percent=50 --min=3 --max=10
```

To see the status of the autoscaler, use the `kubectl get hpa` command as follows:

```
$ kubectl get hpa

NAME               REFERENCE                     TARGETS    MINPODS   MAXPODS   REPLICAS   AGE
azure-vote-front   Deployment/azure-vote-front   0% / 50%   3         10        3          2m
```

After a few minutes, with minimal load on the Azure Vote app, the number of pod replicas decreases automatically to three. You can use `kubectl get pods` again to see the unneeded pods being removed.

## Manually scale AKS nodes

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

## Next steps

In this tutorial, you used different scaling features in your Kubernetes cluster. You learned how to:

> [!div class="checklist"]
> * Scale the Kubernetes nodes
> * Manually scale Kubernetes pods that run your application
> * Configure autoscaling pods that run the app front-end

Advance to the next tutorial to learn how to update application in Kubernetes.

> [!div class="nextstepaction"]
> [Update an application in Kubernetes][aks-tutorial-update-app]

<!-- LINKS - external -->
[kubectl-autoscale]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#autoscale
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-scale]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#scale
[kubernetes-hpa]: https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/
[metrics-server-github]: https://github.com/kubernetes-incubator/metrics-server/tree/master/deploy/1.8%2B
[metrics-server]: https://kubernetes.io/docs/tasks/debug-application-cluster/core-metrics-pipeline/

<!-- LINKS - internal -->
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[aks-tutorial-update-app]: ./tutorial-kubernetes-app-update.md
[az-aks-scale]: /cli/azure/aks#az-aks-scale
[azure-cli-install]: /cli/azure/install-azure-cli
