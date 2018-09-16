---
title: Whitelist Egress Traffic from Azure Kubernetes Service (AKS) cluster
description: Whitelist egress traffic from an Azure Kubernetes Service (AKS) cluster
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 05/23/2018
ms.author: iainfou
---

# Azure Kubernetes Service (AKS) egress

By default, the egress address from an Azure Kubernetes Service (AKS) cluster is randomly assigned. This configuration is not ideal when needing to identify an IP address for accessing external services. This document details how to create and maintain a statically assigned egress IP address in an AKS cluster.

## Egress overview

Outbound traffic from an AKS cluster follows Azure Load Balancer conventions, which are documented [here][outbound-connections]. Before the first Kubernetes service of type `LoadBalancer` is created, the agent nodes are not part of any Azure Load Balancer pool. In this configuration, the nodes are without an instance level Public IP address. Azure translates the outbound flow to a public source IP address that is not configurable or deterministic.

Once a Kubernetes service of type `LoadBalancer` is created, agent nodes are added to an Azure Load Balancer pool. For outbound flow, Azure translates it to the first public IP address configured on the load balancer.

## Create a static public IP

To prevent random IP addresses from being used, create a static IP address and ensure the load balancer uses this address. The IP address needs to be created in the AKS **node** resource group.

Get the resource group name with the [az resource show][az-resource-show] command. Update the resource group name and cluster name to match your environment.

```
$ az resource show --resource-group myResourceGroup --name myAKSCluster --resource-type Microsoft.ContainerService/managedClusters --query properties.nodeResourceGroup -o tsv

MC_myResourceGroup_myAKSCluster_eastus
```

Next, use the [az network public-ip create][public-ip-create] command to create a static public IP address. Update the resource group name to match the name gatherred in the last step.

```console
$ az network public-ip create --resource-group MC_myResourceGroup_myAKSCluster_eastus --name myAKSPublicIP --allocation-method static --query publicIp.ipAddress -o table

Result
-------------
23.101.128.81
```

## Create a service with the static IP

Now that you have an IP address, create a Kubernetes service with the type `LoadBalancer` and assign the IP address to the service.

Create a file named `egress-service.yaml` and copy in the following YAML. Update the IP address to match your environment.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: aks-egress
spec:
  loadBalancerIP: 23.101.128.81
  type: LoadBalancer
  ports:
  - port: 8080
```

Create the service and deployment with the `kubectl apply` command.

```console
$ kubectl apply -f egress-service.yaml

service "aks-egress" created
```

Creating this service configures a new frontend IP on the Azure Load Balancer. If you do not have any other IPs configured, then **all** egress traffic should now use this address. When multiple addresses are configured on the Azure Load Balancer, egress uses the first IP on that load balancer.

## Verify egress address

To verify that the public IP address is being used, use a service such as `checkip.dyndns.org`.

Start and attach to a pod:

```console
$ kubectl run -it --rm aks-ip --image=debian
```

If needed, install curl in the container:

```console
$ apt-get update && apt-get install curl -y
```

Curl `checkip.dyndns.org`, which returns the egress IP address:

```console
$ curl -s checkip.dyndns.org

<html><head><title>Current IP Check</title></head><body>Current IP Address: 23.101.128.81</body></html>
```

You should see that the IP address matches the static IP address attached to the Azure load balancer.

## Ingress controller

To avoid maintaining multiple public IP addresses on the Azure Load Balancer, consider using an ingress controller. Ingress-controllers provide benefits such as load balancing, SSL/TLS termination, support for URI rewrites, and upstream SSL/TLS encryption. For more information about ingress-controllers in AKS, see the [Configure NGINX ingress controller in an AKS cluster][ingress-aks-cluster] guide.

## Next steps

Learn more about the software demonstrated in this document.

- [Helm CLI][helm-cli-install]
- [NGINX ingress controller][nginx-ingress]
- [Azure Load Balancer Outbound Connections][outbound-connections]

<!-- LINKS - internal -->
[az-resource-show]: /cli/azure/resource#az-resource-show
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-cloud-shell]: ../cloud-shell/overview.md
[aks-faq-resource-group]: faq.md#why-are-two-resource-groups-created-with-aks
[create-aks-cluster]: ./kubernetes-walkthrough.md
[helm-cli-install]: ./kubernetes-helm.md#install-helm-cli
[ingress-aks-cluster]: ./ingress-basic.md
[outbound-connections]: ../load-balancer/load-balancer-outbound-connections.md#scenarios
[public-ip-create]: /cli/azure/network/public-ip#az-network-public-ip-create

<!-- LINKS - external -->
[nginx-ingress]: https://github.com/kubernetes/ingress-nginx
