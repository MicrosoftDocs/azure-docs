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
ms.date: 06/15/2017
ms.author: danlep
---

# Azure Container Service tutorial - Scale Application

If you have been following the tutorials, you have a working Kubernetes cluster in Azure Container Service and you deployed the Azure Voting app. In this tutorial, you scale out the pods in the app and try pod autoscaling. You also learn how to scale the number of agent nodes to change the cluster's capacity for hosting workloads.

Tasks completed in this tutorial include:

> [!div class="checklist"]
> * Scale the pods running the Azure Voting app front end
> * Scale the agent nodes in the cluster

This tutorial requires the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).  

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)] 

## Scale the pods

The previous tutorial deployed the Azure Vote front end and back each in a single pod. To verify this, run the following command:

```bash
kubectl get pods
```

Output is similar to the following:

```bash
NAME                               READY     STATUS    RESTARTS   AGE
azure-vote-back-2549686872-4d2r5   1/1       Running   0          31m
azure-vote-front-848767080-tf34m   1/1       Running   0          31m
```


Manually increase the number of pod replicas in the `azure-vote-front` deployment using the `kubectl scale` command. (You can separately scale the pods in `azure-vote-back` deployment.) This example increase the number to 4:

```bash

kubectl scale --replicas=4 deployment/azure-vote-front
```

Run `kubectl get pods` to verify that Kubernetes is creating the new pods. After a minute or so, the additional pods are running:

```bash
NAME                               READY     STATUS    RESTARTS   AGE
azure-vote-back-2549686872-4d2r5   1/1       Running   0          33m
azure-vote-front-848767080-1kt72   1/1       Running   0          1m
azure-vote-front-848767080-2b62d   1/1       Running   0          1m
azure-vote-front-848767080-78rf0   1/1       Running   0          1m
azure-vote-front-848767080-tf34m   1/1       Running   0          33m
```


Kubernetes supports [horizontal pod autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) to adjust the number of pods in a deployment depending on CPU utilization. The following example uses the `kubectl autoscale` command to autoscale the number of pods in the `azure-vote-front` deployment. If CPU utilization exceeds 80%, the autoscaler increases the pods to maximum of 10.


```bash

kubectl autoscale deployment azure-vote-front --cpu-percent=80 --min=1 --max=10
```

To see the status of the autoscaler, run the following command:

```bash
kubectl get hpa

```

Output:

```
NAME               REFERENCE                     TARGETS           MINPODS   MAXPODS   REPLICAS   AGE
azure-vote-front   Deployment/azure-vote-front   <unknown> / 50%   1         10        4          23s
```


After several minutes with minimal load on the Azure Vote app, the number of pod replicas decreases to 1.


## Scale the agents


If you created your cluster using the [tutorial](container-service-tutorial-kubernetes-deploy-cluster.md), it has 3 agent nodes. You can adjust the number of agents if you need to deploy more ore fewer container workloads on your cluster. Use the [az acs scale](/cli/azure/acs#scale) command, and specify the number of agents with the `--new-agent-count` parameter.

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
> * Scale the pods running the Azure Voting app front end
> * Scale the agent nodes in the cluster


Advance to the next tutorial to learn about updating the application on the cluster.

> [!div class="nextstepaction"]
> [Update Kubernetes application](./container-service-tutorial-kubernetes-update-application.md)