---
title: Azure Container Service tutorial - Scale Application | Microsoft Docs
description: Azure Container Service tutorial - Scale Application
services: container-service
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Kubernetes, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: aurecli
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/21/2017
ms.author: danlep
---

# Scale Kubernetes pods and Kubernetes infrastructure

If you have been following the tutorials, you have a working Kubernetes cluster in Azure Container Service and you deployed the Azure Voting app. In this tutorial, you scale out the pods in the app and try pod autoscaling. You also learn how to scale the number of agent nodes to change the cluster's capacity for hosting workloads.

Tasks completed in this tutorial include:

> [!div class="checklist"]
> * Manually scale pods running the app front end
> * Autoscale pods running the app front end
> * Scale the agent nodes in the cluster

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).  

## Prerequisites

This tutorial is one of a multi-part series. You do not need to complete the full series to work through this tutorial, however the following items are required.

**ACS Kubernetes cluster** – see, [Create a Kubernetes cluster](container-service-tutorial-kubernetes-deploy-cluster.md) for information on creating the cluster.

**App deployed** - This tutorial assumes you’ve deployed the [Azure Voting sample app](container-service-tutorial-kubernetes-deploy-application.md) on the cluster. You can run the commands using another app of your choice.

## Manually scale pods

The previous tutorial deployed the Azure Vote front-end and back-end each in a single pod. To verify, run the following command:

```bash
kubectl get pods
```

Output is similar to the following:

```bash
NAME                               READY     STATUS    RESTARTS   AGE
azure-vote-back-2549686872-4d2r5   1/1       Running   0          31m
azure-vote-front-848767080-tf34m   1/1       Running   0          31m
```

Manually change the number of pods in the `azure-vote-front` deployment using the `kubectl scale` command. (You can separately scale the pods in the `azure-vote-back` deployment.) This example increases the number to 4:

```bash
kubectl scale --replicas=5 deployment/azure-vote-front
```

Run `kubectl get pods` to verify that Kubernetes is creating the pods. After a minute or so, the additional pods are running:

```bash
kubectl get pods
```

Output:

```bash
NAME                               READY     STATUS    RESTARTS   AGE
azure-vote-back-2549686872-4d2r5   1/1       Running   0          33m
azure-vote-front-848767080-1kt72   1/1       Running   0          1m
azure-vote-front-848767080-2b62d   1/1       Running   0          1m
azure-vote-front-848767080-78rf0   1/1       Running   0          1m
azure-vote-front-848767080-tf34m   1/1       Running   0          33m
```

## Autoscale pods

Kubernetes supports [horizontal pod autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) to adjust the number of pods in a deployment depending on CPU utilization or other metrics. 

To use the autoscaler, your pods must have CPU requests and limits defined. In the `azure-vote-front` deployment, each container requests 0.25 CPU, with a limit of 0.5 CPU. The settings look like:

```YAML
resources:
  requests:
     cpu: 250m
  limits:
     cpu: 500m
```

The following example uses the `kubectl autoscale` command to autoscale the number of pods in the `azure-vote-front` deployment. Here, if CPU utilization exceeds 50%, the autoscaler increases the pods to a maximum of 10.


```bash
kubectl autoscale deployment azure-vote-front --cpu-percent=50 --min=3 --max=10
```

To see the status of the autoscaler, run the following command:

```bash
kubectl get hpa
```

Output:

```bash
NAME               REFERENCE                     TARGETS        MINPODS   MAXPODS   REPLICAS   AGE
azure-vote-front   Deployment/azure-vote-front   0% / 50%       1         10        4          23s
```

After a few minutes with minimal load on the Azure Vote app, the number of pod replicas decreases automatically to 3.

## Scale the agents

If you created your Kubernetes cluster using default commands in the previous tutorial, it has three agent nodes. You can adjust the number of agents manually if you plan more or fewer container workloads on your cluster. Use the [az acs scale](/cli/azure/acs#scale) command, and specify the number of agents with the `--new-agent-count` parameter.

The following example reduces the number of agent nodes to 2 in the Kubernetes cluster named *myK8sCluster*. The command takes a couple of minutes to complete.

```azurecli-interactive
az acs scale --resource-group=myResourceGroup --name=myK8SCluster --new-agent-count 2
```

The command output shows the number of agent nodes in the value of `agentPoolProfiles:count`:

```azurecli
{
  "agentPoolProfiles": [
    {
      "count": 2,
      "dnsPrefix": "myK8SCluster-myK8SCluster-e44f25-k8s-agents",
      "fqdn": "",
      "name": "agentpools",
      "vmSize": "Standard_D2_v2"
    }
  ],
...

```

## Next steps

In this tutorial, you used different scaling features in your Kubernetes cluster. Tasks covered included:

> [!div class="checklist"]
> * Manually scale pods running the app front end
> * Autoscale pods running the app front end
> * Scale the agent nodes in the cluster

Advance to the next tutorial to learn about updating application in Kubernetes.

> [!div class="nextstepaction"]
> [Update an application in Kubernetes](./container-service-tutorial-kubernetes-app-update.md)


