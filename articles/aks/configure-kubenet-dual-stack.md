---
title: Configure dual-stack kubenet networking in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to configure dual-stack kubenet networking in Azure Kubernetes Service (AKS)
author: asudbring
ms.author: allensu
ms.subservice: aks-networking
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 12/15/2021
---

# Use dual-stack kubenet networking in Azure Kubernetes Service (AKS)

AKS clusters can now be deployed in a dual-stack (using both IPv4 and IPv6 addresses) mode when using [kubenet][kubenet] networking and a dual-stack Azure virtual network. In this configuration, nodes receive both an IPv4 and IPv6 address from the Azure virtual network subnet. Pods receive both an IPv4 and IPv6 address from a logically different address space to the Azure virtual network subnet of the nodes. Network address translation (NAT) is then configured so that the pods can reach resources on the Azure virtual network. The source IP address of the traffic is NAT'd to the node's primary IP address of the same family (IPv4 to IPv4 and IPv6 to IPv6).

This article shows you how to use dual-stack networking with an AKS cluster. For more information on network options and considerations, see [Network concepts for Kubernetes and AKS][aks-network-concepts].

## Limitations
* Azure Route Tables have a hard limit of 400 routes per table. Because each node in a dual-stack cluster requires two routes, one for each IP address family, dual-stack clusters are limited to 200 nodes.
* In Mariner node pools, service objects are only supported with `externalTrafficPolicy: Local`.
* Dual-stack networking is required for the Azure Virtual Network and the pod CIDR - single stack IPv6-only isn't supported for node or pod IP addresses. Services can be provisioned on IPv4 or IPv6.
* Features **not supported on dual-stack kubenet** include:
   * [Azure network policies](use-network-policies.md#create-an-aks-cluster-and-enable-network-policy)
   * [Calico network policies](use-network-policies.md#create-an-aks-cluster-and-enable-network-policy)
   * [NAT Gateway][nat-gateway]
   * [Virtual nodes add-on](virtual-nodes.md#network-requirements)
   * [Windows node pools](./windows-faq.md)

## Prerequisites

* All prerequisites from [configure kubenet networking](configure-kubenet.md) apply.
* AKS dual-stack clusters require Kubernetes version v1.21.2 or greater. v1.22.2 or greater is recommended to take advantage of the [out-of-tree cloud controller manager][aks-out-of-tree], which is the default on v1.22 and up.
* If using Azure Resource Manager templates, schema version 2021-10-01 is required.

## Overview of dual-stack networking in Kubernetes

Kubernetes v1.23 brings stable upstream support for [IPv4/IPv6 dual-stack][kubernetes-dual-stack] clusters, including pod and service networking. Nodes and pods are always assigned both an IPv4 and an IPv6 address, while services can be single-stack on either address family or dual-stack.

AKS configures the required supporting services for dual-stack networking. This configuration includes:

*  Dual-stack virtual network configuration (if managed Virtual Network is used)
* IPv4 and IPv6 node and pod addresses
* Outbound rules for both IPv4 and IPv6 traffic
* Load balancer setup for IPv4 and IPv6 services

## Deploying a dual-stack cluster

Three new attributes are provided to support dual-stack clusters:
* `--ip-families` - takes a comma-separated list of IP families to enable on the cluster. 
  * Currently only `ipv4` or `ipv4,ipv6` are supported.
* `--pod-cidrs` - takes a comma-separated list of CIDR notation IP ranges to assign pod IPs from.
  * The count and order of ranges in this list must match the value provided to `--ip-families`.
  * If no values are supplied, the default values of `10.244.0.0/16,fd12:3456:789a::/64` will be used.
* `--service-cidrs` - takes a comma-separated list of CIDR notation IP ranges to assign service IPs from.
  * The count and order of ranges in this list must match the value provided to `--ip-families`.
  * If no values are supplied, the default values of `10.0.0.0/16,fd12:3456:789a:1::/108` will be used.
  * The IPv6 subnet assigned to `--service-cidrs` can be no larger than a /108.

### Deploy the cluster

# [Azure CLI](#tab/azure-cli)

Deploying a dual-stack cluster requires passing the `--ip-families` parameter with the parameter value of `ipv4,ipv6` to indicate that a dual-stack cluster should be created.

1. First, create a resource group to create the cluster in:
    ```azurecli-interactive
    az group create -l <Region> -n <ResourceGroupName>
    ```

1. Then create the cluster itself:
    ```azurecli-interactive
    az aks create -l <Region> -g <ResourceGroupName> -n <ClusterName> --ip-families ipv4,ipv6
    ```

# [Azure Resource Manager](#tab/azure-resource-manager)

When using an Azure Resource Manager template to deploy, pass `["IPv4", "IPv6"]` to the `ipFamilies` parameter to the `networkProfile` object. See the [Azure Resource Manager template documentation][deploy-arm-template] for help with deploying this template, if needed.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "clusterName": {
      "type": "string",
      "defaultValue": "aksdualstack"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "kubernetesVersion": {
      "type": "string",
      "defaultValue": "1.22.2"
    },
    "nodeCount": {
      "type": "int",
      "defaultValue": 3
    },
    "nodeSize": {
      "type": "string",
      "defaultValue": "Standard_B2ms"
    }
  },
  "resources": [
    {
      "type": "Microsoft.ContainerService/managedClusters",
      "apiVersion": "2021-10-01",
      "name": "[parameters('clusterName')]",
      "location": "[parameters('location')]",
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "agentPoolProfiles": [
          {
            "name": "nodepool1",
            "count": "[parameters('nodeCount')]",
            "mode": "System",
            "vmSize": "[parameters('nodeSize')]"
          }
        ],
        "dnsPrefix": "[parameters('clusterName')]",
        "kubernetesVersion": "[parameters('kubernetesVersion')]",
        "networkProfile": {
          "ipFamilies": [
            "IPv4",
            "IPv6"
          ]
        }
      }
    }
  ]
}
```

# [Bicep](#tab/bicep)

When using a Bicep template to deploy, pass `["IPv4", "IPv6"]` to the `ipFamilies` parameter to the `networkProfile` object. See the [Bicep template documentation][deploy-bicep-template] for help with deploying this template, if needed.

```bicep
param clusterName string = 'aksdualstack'
param location string = resourceGroup().location
param kubernetesVersion string = '1.22.2'
param nodeCount int = 3
param nodeSize string = 'Standard_B2ms'

resource aksCluster 'Microsoft.ContainerService/managedClusters@2021-10-01' = {
  name: clusterName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    agentPoolProfiles: [
      {
        name: 'nodepool1'
        count: nodeCount
        mode: 'System'
        vmSize: nodeSize
      }
    ]
    dnsPrefix: clusterName
    kubernetesVersion: kubernetesVersion
    networkProfile: {
      ipFamilies: [
        'IPv4'
        'IPv6'
      ]
    }
  }
}
```

---

Finally, after the cluster has been created, get the admin credentials:

```azurecli-interactive
az aks get-credentials -g <ResourceGroupName> -n <ClusterName> -a
```

### Inspect the nodes to see both IP families

Once the cluster is provisioned, confirm that the nodes are provisioned with dual-stack networking:

```bash-interactive
kubectl get nodes -o=custom-columns="NAME:.metadata.name,ADDRESSES:.status.addresses[?(@.type=='InternalIP')].address,PODCIDRS:.spec.podCIDRs[*]"
```

The output from the `kubectl get nodes` command will show that the nodes have addresses and pod IP assignment space from both IPv4 and IPv6.

```output
NAME                                ADDRESSES                           PODCIDRS
aks-nodepool1-14508455-vmss000000   10.240.0.4,2001:1234:5678:9abc::4   10.244.0.0/24,fd12:3456:789a::/80
aks-nodepool1-14508455-vmss000001   10.240.0.5,2001:1234:5678:9abc::5   10.244.1.0/24,fd12:3456:789a:0:1::/80
aks-nodepool1-14508455-vmss000002   10.240.0.6,2001:1234:5678:9abc::6   10.244.2.0/24,fd12:3456:789a:0:2::/80
```

## Create an example workload

### Deploy an nginx web server

Once the cluster has been created, workloads can be deployed as usual. A simple example webserver can be created using the following command:

# [`kubectl create`](#tab/kubectl)

```bash-interactive
kubectl create deployment nginx --image=nginx:latest --replicas=3
```

# [YAML](#tab/yaml)

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nginx
  name: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:latest
        name: nginx
```

---

Using the following `kubectl get pods` command will show that the pods have both IPv4 and IPv6 addresses (note that the pods will not show IP addresses until they are ready):

```bash-interactive
kubectl get pods -o custom-columns="NAME:.metadata.name,IPs:.status.podIPs[*].ip,NODE:.spec.nodeName,READY:.status.conditions[?(@.type=='Ready')].status"
```

```
NAME                     IPs                                NODE                                READY
nginx-55649fd747-9cr7h   10.244.2.2,fd12:3456:789a:0:2::2   aks-nodepool1-14508455-vmss000002   True
nginx-55649fd747-p5lr9   10.244.0.7,fd12:3456:789a::7       aks-nodepool1-14508455-vmss000000   True
nginx-55649fd747-r2rqh   10.244.1.2,fd12:3456:789a:0:1::2   aks-nodepool1-14508455-vmss000001   True
```

### Expose the workload via a `LoadBalancer`-type service

> [!IMPORTANT]
> There are currently two limitations pertaining to IPv6 services in AKS. These are both preview limitations and work is underway to remove them.
> * Azure Load Balancer sends health probes to IPv6 destinations from a link-local address. In Mariner node pools, this traffic cannot be routed to a pod and thus traffic flowing to IPv6 services deployed with `externalTrafficPolicy: Cluster` will fail. IPv6 services MUST be deployed with `externalTrafficPolicy: Local`, which causes `kube-proxy` to respond to the probe on the node, in order to function.
> * Only the first IP address for a service will be provisioned to the load balancer, so a dual-stack service will only receive a public IP for its first listed IP family. In order to provide a dual-stack service for a single deployment, please create two services targeting the same selector, one for IPv4 and one for IPv6.

IPv6 services in Kubernetes can be exposed publicly similarly to an IPv4 service.

# [`kubectl expose`](#tab/kubectl)

```bash-interactive
kubectl expose deployment nginx --name=nginx-ipv4 --port=80 --type=LoadBalancer'
kubectl expose deployment nginx --name=nginx-ipv6 --port=80 --type=LoadBalancer --overrides='{"spec":{"ipFamilies": ["IPv6"]}}'
```

```
service/nginx-ipv4 exposed
service/nginx-ipv6 exposed
```

# [YAML](#tab/yaml)

```yml
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: nginx
  name: nginx-ipv4
spec:
  externalTrafficPolicy: Cluster
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: nginx
  type: LoadBalancer
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: nginx
  name: nginx-ipv6
spec:
  externalTrafficPolicy: Cluster
  ipFamilies:
  - IPv6
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: nginx
  type: LoadBalancer

```

---

Once the deployment has been exposed and the `LoadBalancer` services have been fully provisioned, `kubectl get services` will show the IP addresses of the services:

```bash-interactive
kubectl get services
```

```output
NAME         TYPE           CLUSTER-IP               EXTERNAL-IP         PORT(S)        AGE
nginx-ipv4   LoadBalancer   10.0.88.78               20.46.24.24         80:30652/TCP   97s
nginx-ipv6   LoadBalancer   fd12:3456:789a:1::981a   2603:1030:8:5::2d   80:32002/TCP   63s
```

Next, we can verify functionality via a command-line web request from an IPv6 capable host (note that Azure Cloud Shell is not IPv6 capable):

```bash-interactive
SERVICE_IP=$(kubectl get services nginx-ipv6 -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
curl -s "http://[${SERVICE_IP}]" | head -n5
```

```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
```


<!-- LINKS - External -->
[kubernetes-dual-stack]: https://kubernetes.io/docs/concepts/services-networking/dual-stack/

<!-- LINKS - Internal -->
[deploy-arm-template]: ../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md
[deploy-bicep-template]: ../azure-resource-manager/bicep/deploy-cli.md
[kubenet]: ./configure-kubenet.md
[aks-out-of-tree]: ./out-of-tree.md
[nat-gateway]: ../virtual-network/nat-gateway/nat-overview.md
[install-azure-cli]: /cli/azure/install-azure-cli
[aks-network-concepts]: concepts-network.md
[aks-network-nsg]: concepts-network.md#network-security-groups
[az-group-create]: /cli/azure/group#az_group_create
[az-network-vnet-create]: /cli/azure/network/vnet#az_network_vnet_create
[az-ad-sp-create-for-rbac]: /cli/azure/ad/sp#az_ad_sp_create_for_rbac
[az-network-vnet-show]: /cli/azure/network/vnet#az_network_vnet_show
[az-network-vnet-subnet-show]: /cli/azure/network/vnet/subnet#az_network_vnet_subnet_show
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[az-aks-create]: /cli/azure/aks#az_aks_create
[byo-subnet-route-table]: #bring-your-own-subnet-and-route-table-with-kubenet
[develop-helm]: quickstart-helm.md
[use-helm]: kubernetes-helm.md
[virtual-nodes]: virtual-nodes-cli.md
[vnet-peering]: ../virtual-network/virtual-network-peering-overview.md
[express-route]: ../expressroute/expressroute-introduction.md
[network-comparisons]: concepts-network.md#compare-network-models
[custom-route-table]: ../virtual-network/manage-route-table.md
[user-assigned managed identity]: use-managed-identity.md#bring-your-own-control-plane-mi
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
