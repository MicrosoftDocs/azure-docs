---
title: (DEPRECATED) Azure Container Service tutorial - Scale Application
description: Azure Container Service tutorial - Scale Application
author: dlepow

ms.service: container-service
ms.topic: tutorial
ms.date: 09/14/2017
ms.author: danlep
ms.custom: mvc
---

# (DEPRECATED) Scale Kubernetes pods and Kubernetes infrastructure

> [!TIP]
> For the updated version this tutorial that uses Azure Kubernetes Service, see [Tutorial: Scale applications in Azure Kubernetes Service (AKS)](../../aks/tutorial-kubernetes-scale.md).

[!INCLUDE [ACS deprecation](../../../includes/container-service-kubernetes-deprecation.md)]

If you've been following the tutorials, you have a working Kubernetes cluster in Azure Container Service and you deployed the Azure Voting app. 

In this tutorial, part five of seven, you scale out the pods in the app and try pod autoscaling. You also learn how to scale the number of Azure VM agent nodes to change the cluster's capacity for hosting workloads. Tasks completed include:

> [!div class="checklist"]
> * Manually scaling Kubernetes pods
> * Configuring Autoscale pods running the app front end
> * Scale the Kubernetes Azure agent nodes

In subsequent tutorials, the Azure Vote application is updated, and Log Analytics is configured to monitor the Kubernetes cluster.

## Before you begin

In previous tutorials, an application was packaged into a container image, this image uploaded to Azure Container Registry, and a Kubernetes cluster created. The application was then run on the Kubernetes cluster. 

If you have not done these steps, and would like to follow along, return to the [Tutorial 1 – Create container images](./container-service-tutorial-kubernetes-prepare-app.md). 

## Manually scale pods

Thus far, the Azure Vote front-end and Redis instance have been deployed, each with a single replica. To verify, run the [kubectl get](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command.

Go to [https://shell.azure.com](https://shell.azure.com) to open Cloud Shell in your browser.

```console
kubectl get pods
```

Output:

```output
NAME                               READY     STATUS    RESTARTS   AGE
azure-vote-back-2549686872-4d2r5   1/1       Running   0          31m
azure-vote-front-848767080-tf34m   1/1       Running   0          31m
```

Manually change the number of pods in the `azure-vote-front` deployment using the [kubectl scale](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#scale) command. This example increases the number to 5.

```console
kubectl scale --replicas=5 deployment/azure-vote-front
```

Run [kubectl get pods](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) to verify that Kubernetes is creating the pods. After a minute or so, the additional pods are running:

```console
kubectl get pods
```

Output:

```output
NAME                                READY     STATUS    RESTARTS   AGE
azure-vote-back-2606967446-nmpcf    1/1       Running   0          15m
azure-vote-front-3309479140-2hfh0   1/1       Running   0          3m
azure-vote-front-3309479140-bzt05   1/1       Running   0          3m
azure-vote-front-3309479140-fvcvm   1/1       Running   0          3m
azure-vote-front-3309479140-hrbf2   1/1       Running   0          15m
azure-vote-front-3309479140-qphz8   1/1       Running   0          3m
```

## Autoscale pods

Kubernetes supports [horizontal pod autoscaling](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) to adjust the number of pods in a deployment depending on CPU utilization or other select metrics. 

To use the autoscaler, your pods must have CPU requests and limits defined. In the `azure-vote-front` deployment, the front-end container requests 0.25 CPU, with a limit of 0.5 CPU. The settings look like:

```yaml
resources:
  requests:
     cpu: 250m
  limits:
     cpu: 500m
```

The following example uses the [kubectl autoscale](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#autoscale) command to autoscale the number of pods in the `azure-vote-front` deployment. Here, if CPU utilization exceeds 50%, the autoscaler increases the pods to a maximum of 10.


```console
kubectl autoscale deployment azure-vote-front --cpu-percent=50 --min=3 --max=10
```

To see the status of the autoscaler, run the following command:

```console
kubectl get hpa
```

Output:

```output
NAME               REFERENCE                     TARGETS    MINPODS   MAXPODS   REPLICAS   AGE
azure-vote-front   Deployment/azure-vote-front   0% / 50%   3         10        3          2m
```

After a few minutes, with minimal load on the Azure Vote app, the number of pod replicas decreases automatically to 3.

## Scale the agents

If you created your Kubernetes cluster using default commands in the previous tutorial, it has three agent nodes. You can adjust the number of agents manually if you plan more or fewer container workloads on your cluster. Use the [az acs scale](/cli/azure/acs#az-acs-scale) command, and specify the number of agents with the `--new-agent-count` parameter.

The following example increases the number of agent nodes to 4 in the Kubernetes cluster named *myK8sCluster*. The command takes a couple of minutes to complete.

```azurecli-interactive
az acs scale --resource-group=myResourceGroup --name=myK8SCluster --new-agent-count 4
```

The command output shows the number of agent nodes in the value of `agentPoolProfiles:count`:

```output
{
  "agentPoolProfiles": [
    {
      "count": 4,
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
> * Manually scaling Kubernetes pods
> * Configuring Autoscale pods running the app front end
> * Scale the Kubernetes Azure agent nodes

Advance to the next tutorial to learn about updating application in Kubernetes.

> [!div class="nextstepaction"]
> [Update an application in Kubernetes](./container-service-tutorial-kubernetes-app-update.md)

