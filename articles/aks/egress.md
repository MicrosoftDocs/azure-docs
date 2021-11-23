---
title: Use static IP for egress traffic
titleSuffix: Azure Kubernetes Service
description: Learn how to create and use a static public IP address for egress traffic in an Azure Kubernetes Service (AKS) cluster
services: container-service
ms.topic: article
ms.date: 03/16/2021


#Customer intent: As an cluster operator, I want to define the egress IP address to control the flow of traffic from a known, defined address.
---

# Use a static public IP address for egress traffic with a *Basic* SKU load balancer in Azure Kubernetes Service (AKS)

By default, the egress IP address from an Azure Kubernetes Service (AKS) cluster is randomly assigned. This configuration is not ideal when you need to identify an IP address for access to external services, for example. Instead, you may need to assign a static IP address to be added to an allowlist for service access.

This article shows you how to create and use a static public IP address for use with egress traffic in an AKS cluster.

## Before you begin

This article assumes you are using the Azure Basic Load Balancer.  We recommend using the [Azure Standard Load Balancer](../load-balancer/load-balancer-overview.md), and you can use more advanced features for [controlling AKS egress traffic](./limit-egress-traffic.md).

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

You also need the Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

> [!IMPORTANT]
> This article uses the *Basic* SKU load balancer with a single node pool. This configuration is not available for multiple node pools since the *Basic* SKU load balancer is not supported with multiple node pools. See [Use a public Standard Load Balancer in Azure Kubernetes Service (AKS)][slb] for more details on using the *Standard* SKU load balancer.

## Egress traffic overview

Outbound traffic from an AKS cluster follows [Azure Load Balancer conventions][outbound-connections]. Before the first Kubernetes service of type `LoadBalancer` is created, the agent nodes in an AKS cluster are not part of any Azure Load Balancer pool. In this configuration, the nodes have no instance level Public IP address. Azure translates the outbound flow to a public source IP address that is not configurable or deterministic.

Once a Kubernetes service of type `LoadBalancer` is created, agent nodes are added to an Azure Load Balancer pool. Load Balancer Basic chooses a single frontend to be used for outbound flows when multiple (public) IP frontends are candidates for outbound flows. This selection is not configurable, and you should consider the selection algorithm to be random. This public IP address is only valid for the lifespan of that resource. If you delete the Kubernetes LoadBalancer service, the associated load balancer and IP address are also deleted. If you want to assign a specific IP address or retain an IP address for redeployed Kubernetes services, you can create and use a static public IP address.

## Create a static public IP

Get the resource group name with the [az aks show][az-aks-show] command and add the `--query nodeResourceGroup` query parameter. The following example gets the node resource group for the AKS cluster name *myAKSCluster* in the resource group name *myResourceGroup*:

```azurecli-interactive
$ az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv

MC_myResourceGroup_myAKSCluster_eastus
```

Now create a static public IP address with the [az network public ip create][az-network-public-ip-create] command. Specify the node resource group name obtained in the previous command, and then a name for the IP address resource, such as *myAKSPublicIP*:

```azurecli-interactive
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
```

You can later get the public IP address using the [az network public-ip list][az-network-public-ip-list] command. Specify the name of the node resource group, and then query for the *ipAddress* as shown in the following example:

```azurecli-interactive
$ az network public-ip list --resource-group MC_myResourceGroup_myAKSCluster_eastus --query [0].ipAddress --output tsv

40.121.183.52
```

## Create a service with the static IP

To create a service with the static public IP address, add the `loadBalancerIP` property and the value of the static public IP address to the YAML manifest. Create a file named `egress-service.yaml` and copy in the following YAML. Provide your own public IP address created in the previous step.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: azure-egress
spec:
  loadBalancerIP: 40.121.183.52
  type: LoadBalancer
  ports:
  - port: 80
```

Create the service and deployment with the `kubectl apply` command.

```console
kubectl apply -f egress-service.yaml
```

This service configures a new frontend IP on the Azure Load Balancer. If you do not have any other IPs configured, then **all** egress traffic should now use this address. When multiple addresses are configured on the Azure Load Balancer, any of these public IP addresses are a candidate for outbound flows, and one is selected at random.

## Verify egress address

To verify that the static public IP address is being used, you can use DNS look-up service such as `checkip.dyndns.org`.

Start and attach to a basic *Debian* pod:

```console
kubectl run -it --rm aks-ip --image=mcr.microsoft.com/aks/fundamental/base-ubuntu:v0.0.11
```

To access a web site from within the container, use `apt-get` to install `curl` into the container.

```console
apt-get update && apt-get install curl -y
```

Now use curl to access the *checkip.dyndns.org* site. The egress IP address is shown, as displayed in the following example output. This IP address matches the static public IP address created and defined for the loadBalancer service:

```console
$ curl -s checkip.dyndns.org

<html><head><title>Current IP Check</title></head><body>Current IP Address: 40.121.183.52</body></html>
```

## Next steps

To avoid maintaining multiple public IP addresses on the Azure Load Balancer, you can instead use an ingress controller. Ingress controllers provide additional benefits such as SSL/TLS termination, support for URI rewrites, and upstream SSL/TLS encryption. For more information, see [Create a basic ingress controller in AKS][ingress-aks-cluster].

<!-- LINKS - internal -->
[az-network-public-ip-create]: /cli/azure/network/public-ip#az_network_public_ip_create
[az-network-public-ip-list]: /cli/azure/network/public-ip#az_network_public_ip_list
[az-aks-show]: /cli/azure/aks#az_aks_show
[azure-cli-install]: /cli/azure/install-azure-cli
[ingress-aks-cluster]: ./ingress-basic.md
[outbound-connections]: ../load-balancer/load-balancer-outbound-connections.md#scenarios
[public-ip-create]: /cli/azure/network/public-ip#az_network_public_ip_create
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[slb]: load-balancer-standard.md
