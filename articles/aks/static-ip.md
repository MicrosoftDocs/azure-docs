---
title: Use a static IP address with the Azure Kubernetes Service (AKS) load balancer
description: Learn how to create and use a static IP address with the Azure Kubernetes Service (AKS) load balancer.
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 09/25/2018
ms.author: iainfou
---

# Use a static public IP address with the Azure Kubernetes Service (AKS) load balancer

By default, the public IP address assigned to a load balancer resource created by an AKS cluster is only valid for the lifespan of that resource. If you delete the Kubernetes service, the associated load balancer and IP address are also deleted. If you want to assign a specific IP address or retain an IP address for redeployed Kubernetes services, you can create and use a static public IP address. This article shows you how to create a static public IP address and assign it to your Kubernetes service.

## Create a static IP address

When you create a static public IP address for use with AKS, the IP address resource must be created in the **node** resource group. Get the resource group name with the [az aks show][az-aks-show] command and add the `--query nodeResourceGroup` query parameter. The following example gets the *nodeResourceGroup* for the AKS cluster name *myAKSCluster* in the resource group name *myResourceGroup*:

```azurecli
$ az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv

MC_myResourceGroup_myAKSCluster_eastus
```

Now create a static public IP address with the [az network public ip create][az-network-public-ip-create] command. Specify the node resource group name obtained in the previous command, and then a name for the IP address resource, such as *myAKSPublicIP*:

```azurecli
az network public-ip create \
    --resource-group MC_myResourceGroup_myAKSCluster_eastus \
    --name myAKSPublicIP \
    --allocation-method static
```

The IP address is shown, as shown in the following condensed example output:

```json
{
  "publicIp": {
    "dnsSettings": null,
    "etag": "W/\"6b6fb15c-5281-4f64-b332-8f68f46e1358\"",
    "id": "/subscriptions/<SubscriptionID>/resourceGroups/MC_myResourceGroup_myAKSCluster_eastus/providers/Microsoft.Network/publicIPAddresses/myAKSPublicIP",
    "idleTimeoutInMinutes": 4,
    "ipAddress": "40.121.183.52",
    [..]
  }
````

You can later get the public IP address using the [az network public-ip list][az-network-public-ip-list] command. Specify the name of the node resource group, and then query for the *ipAddress* as shown in the following example:

```azurecli
$ az network public-ip list --resource-group MC_myResourceGroup_myAKSCluster_eastus --query [0].ipAddress --output tsv

40.121.183.52
```

## Create a service using the static IP address

To create a service with the static IP address, add the `loadBalancerIP` property and the value of the static IP address to the YAML manifest, as shown in the following example:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: azure-vote-front
spec:
  loadBalancerIP: 40.121.183.52
  type: LoadBalancer
  ports:
  - port: 80
  selector:
    app: azure-vote-front
```

## Troubleshoot

If the static IP address defined in the *loadBalancerIP* property of the Kubernetes service manifest has not created, or has not been created in the node resource group, the load balancer service creation fails. To troubleshoot, review the service creation events with the [kubectl describe][kubectl-describe] command. Provide the name of the service as specified in the YAML manifest, as shown in the following example:

```console
kubectl describe service azure-vote-front
```

Information about the Kubernetes service resource is displayed. The *Events* at the end of the following example output indicate that the *user supplied IP Address was not found*. In these scenarios, verify that you have created the static public IP address in the node resource group and that the IP address specified in the Kubernetes service manifest is correct.

```
Name:                     azure-vote-front
Namespace:                default
Labels:                   <none>
Annotations:              <none>
Selector:                 app=azure-vote-front
Type:                     LoadBalancer
IP:                       10.0.18.125
IP:                       40.121.183.52
Port:                     <unset>  80/TCP
TargetPort:               80/TCP
NodePort:                 <unset>  32582/TCP
Endpoints:                <none>
Session Affinity:         None
External Traffic Policy:  Cluster
Events:
  Type     Reason                      Age               From                Message
  ----     ------                      ----              ----                -------
  Normal   CreatingLoadBalancer        7s (x2 over 22s)  service-controller  Creating load balancer
  Warning  CreatingLoadBalancerFailed  6s (x2 over 12s)  service-controller  Error creating load balancer (will retry): Failed to create load balancer for service default/azure-vote-front: user supplied IP Address 40.121.183.52 was not found
```

## Next steps

For additional control over the network traffic to your applications, you may want to instead create an ingress controller. You can also [create an ingress controller with a static public IP address][aks-static-ingress].

<!-- LINKS - External -->
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe

<!-- LINKS - Internal -->
[aks-faq-resource-group]: faq.md#why-are-two-resource-groups-created-with-aks
[az-network-public-ip-create]: /cli/azure/network/public-ip#az-network-public-ip-create
[az-network-public-ip-list]: /cli/azure/network/public-ip#az-network-public-ip-list
[az-aks-show]: /cli/azure/aks#az-aks-show
[aks-static-ingress]: ingress-static-ip.md
