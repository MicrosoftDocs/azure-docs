---
title: Configure dual-stack kubenet networking in Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn how to configure dual-stack kubenet networking in Azure Kubernetes Service (AKS)
author: asudbring
ms.author: allensu
ms.subservice: aks-networking
ms.custom: devx-track-azurecli, build-2023, devx-track-linux
ms.topic: how-to
ms.date: 06/27/2023
---

# Use dual-stack kubenet networking in Azure Kubernetes Service (AKS)

You can deploy your AKS clusters in a dual-stack mode when using [kubenet][kubenet] networking and a dual-stack Azure virtual network. In this configuration, nodes receive both an IPv4 and IPv6 address from the Azure virtual network subnet. Pods receive both an IPv4 and IPv6 address from a logically different address space to the Azure virtual network subnet of the nodes. Network address translation (NAT) is then configured so that the pods can reach resources on the Azure virtual network. The source IP address of the traffic is NAT'd to the node's primary IP address of the same family (IPv4 to IPv4 and IPv6 to IPv6).

This article shows you how to use dual-stack networking with an AKS cluster. For more information on network options and considerations, see [Network concepts for Kubernetes and AKS][aks-network-concepts].

## Limitations

* Azure route tables have a **hard limit of 400 routes per table**.
  * Each node in a dual-stack cluster requires two routes, one for each IP address family, so **dual-stack clusters are limited to 200 nodes**.
* In Azure Linux node pools, service objects are only supported with `externalTrafficPolicy: Local`.
* Dual-stack networking is required for the Azure virtual network and the pod CIDR.
  * Single stack IPv6-only isn't supported for node or pod IP addresses. Services can be provisioned on IPv4 or IPv6.
* The following features are **not supported on dual-stack kubenet**:
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

Kubernetes v1.23 brings stable upstream support for [IPv4/IPv6 dual-stack][kubernetes-dual-stack] clusters, including pod and service networking. Nodes and pods are always assigned both an IPv4 and an IPv6 address, while services can be dual-stack or single-stack on either address family.

AKS configures the required supporting services for dual-stack networking. This configuration includes:

* If using a managed virtual network, a dual-stack virtual network configuration.
* IPv4 and IPv6 node and pod addresses.
* Outbound rules for both IPv4 and IPv6 traffic.
* Load balancer setup for IPv4 and IPv6 services.

> [!NOTE]
> When using Dualstack with an [outbound type][outbound-type] user-defined routing, you should have a default route for both IPv4 and IPv6. If you only have a default route for IPv4, a warning will surface when creating a cluster. 

## Deploying a dual-stack cluster

The following attributes are provided to support dual-stack clusters:

* **`--ip-families`**: Takes a comma-separated list of IP families to enable on the cluster.
  * Only `ipv4` or `ipv4,ipv6` are supported.
* **`--pod-cidrs`**: Takes a comma-separated list of CIDR notation IP ranges to assign pod IPs from.
  * The count and order of ranges in this list must match the value provided to `--ip-families`.
  * If no values are supplied, the default value `10.244.0.0/16,fd12:3456:789a::/64` is used.
* **`--service-cidrs`**: Takes a comma-separated list of CIDR notation IP ranges to assign service IPs from.
  * The count and order of ranges in this list must match the value provided to `--ip-families`.
  * If no values are supplied, the default value `10.0.0.0/16,fd12:3456:789a:1::/108` is used.
  * The IPv6 subnet assigned to `--service-cidrs` can be no larger than a /108.

## Deploy a dual-stack AKS cluster

# [Azure CLI](#tab/azure-cli)

1. Create an Azure resource group for the cluster using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create -l <region> -n <resourceGroupName>
    ```

2. Create a dual-stack AKS cluster using the [`az aks create`][az-aks-create] command with the `--ip-families` parameter set to `ipv4,ipv6`.

    ```azurecli-interactive
    az aks create -l <region> -g <resourceGroupName> -n <clusterName> --ip-families ipv4,ipv6
    ```

3. Once the cluster is created, get the cluster admin credentials using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials -g <resourceGroupName> -n <clusterName>
    ```

# [Azure Resource Manager](#tab/azure-resource-manager)

1. Create the ARM template and pass `["IPv4", "IPv6"]` to the `ipFamilies` parameter to the `networkProfile` object.

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

2. Once the cluster is created, get the cluster admin credentials using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials -g <resourceGroupName> -n <clusterName>
    ```

> [!NOTE]
> For more information on deploying ARM templates, see the [Azure Resource Manager documentation][deploy-arm-template].

# [Bicep](#tab/bicep)

1. Create the Bicep template and pass `["IPv4", "IPv6"]` to the `ipFamilies` parameter to the `networkProfile` object.

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

2. Once the cluster is created, get the cluster admin credentials using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials -g <resourceGroupName> -n <clusterName>
    ```

> [!NOTE]
> For more information on deploying Bicep templates, see the [Bicep template documentation][deploy-bicep-template].

---

## Inspect the nodes to see both IP families

* Once the cluster is provisioned, confirm the nodes are provisioned with dual-stack networking using the `kubectl get nodes` command.

    ```bash-interactive
    kubectl get nodes -o=custom-columns="NAME:.metadata.name,ADDRESSES:.status.addresses[?(@.type=='InternalIP')].address,PODCIDRS:.spec.podCIDRs[*]"
    ```

    The output from the `kubectl get nodes` command shows the nodes have addresses and pod IP assignment space from both IPv4 and IPv6.

    ```output
    NAME                                ADDRESSES                           PODCIDRS
    aks-nodepool1-14508455-vmss000000   10.240.0.4,2001:1234:5678:9abc::4   10.244.0.0/24,fd12:3456:789a::/80
    aks-nodepool1-14508455-vmss000001   10.240.0.5,2001:1234:5678:9abc::5   10.244.1.0/24,fd12:3456:789a:0:1::/80
    aks-nodepool1-14508455-vmss000002   10.240.0.6,2001:1234:5678:9abc::6   10.244.2.0/24,fd12:3456:789a:0:2::/80
    ```

## Create an example workload

Once the cluster has been created, you can deploy your workloads. This article walks you through an example workload deployment of an NGINX web server.

### Deploy an NGINX web server

# [kubectl](#tab/kubectl)

1. Create an NGINX web server using the `kubectl create deployment nginx` command.

    ```bash-interactive
    kubectl create deployment nginx --image=nginx:latest --replicas=3
    ```

2. View the pod resources using the `kubectl get pods` command.

    ```bash-interactive
    kubectl get pods -o custom-columns="NAME:.metadata.name,IPs:.status.podIPs[*].ip,NODE:.spec.nodeName,READY:.status.conditions[?(@.type=='Ready')].status"
    ```

    The output shows the pods have both IPv4 and IPv6 addresses. The pods don't show IP addresses until they're ready.

    ```output
    NAME                     IPs                                NODE                                READY
    nginx-55649fd747-9cr7h   10.244.2.2,fd12:3456:789a:0:2::2   aks-nodepool1-14508455-vmss000002   True
    nginx-55649fd747-p5lr9   10.244.0.7,fd12:3456:789a::7       aks-nodepool1-14508455-vmss000000   True
    nginx-55649fd747-r2rqh   10.244.1.2,fd12:3456:789a:0:1::2   aks-nodepool1-14508455-vmss000001   True
    ```

# [YAML](#tab/yaml)

1. Create an NGINX web server using the following YAML manifest.

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

2. View the pod resources using the `kubectl get pods` command.

    ```bash-interactive
    kubectl get pods -o custom-columns="NAME:.metadata.name,IPs:.status.podIPs[*].ip,NODE:.spec.nodeName,READY:.status.conditions[?(@.type=='Ready')].status"
    ```

    The output shows the pods have both IPv4 and IPv6 addresses. The pods don't show IP addresses until they're ready.

    ```output
    NAME                     IPs                                NODE                                READY
    nginx-55649fd747-9cr7h   10.244.2.2,fd12:3456:789a:0:2::2   aks-nodepool1-14508455-vmss000002   True
    nginx-55649fd747-p5lr9   10.244.0.7,fd12:3456:789a::7       aks-nodepool1-14508455-vmss000000   True
    nginx-55649fd747-r2rqh   10.244.1.2,fd12:3456:789a:0:1::2   aks-nodepool1-14508455-vmss000001   True
    ```

---

## Expose the workload via a `LoadBalancer` type service

> [!IMPORTANT]
> There are currently **two limitations** pertaining to IPv6 services in AKS. These are both preview limitations and work is underway to remove them.
>
> 1. Azure Load Balancer sends health probes to IPv6 destinations from a link-local address. In Azure Linux node pools, this traffic can't be routed to a pod, so traffic flowing to IPv6 services deployed with `externalTrafficPolicy: Cluster` fail. IPv6 services must be deployed with `externalTrafficPolicy: Local`, which causes `kube-proxy` to respond to the probe on the node.
> 2. Only the first IP address for a service will be provisioned to the load balancer, so a dual-stack service only receives a public IP for its first-listed IP family. To provide a dual-stack service for a single deployment, please create two services targeting the same selector, one for IPv4 and one for IPv6.

# [kubectl](#tab/kubectl)

1. Expose the NGINX deployment using the `kubectl expose deployment nginx` command.

    ```bash-interactive
    kubectl expose deployment nginx --name=nginx-ipv4 --port=80 --type=LoadBalancer'
    kubectl expose deployment nginx --name=nginx-ipv6 --port=80 --type=LoadBalancer --overrides='{"spec":{"ipFamilies": ["IPv6"]}}'
    ```

    You receive an output that shows the services have been exposed.

    ```output
    service/nginx-ipv4 exposed
    service/nginx-ipv6 exposed
    ```

2. Once the deployment is exposed and the `LoadBalancer` services are fully provisioned, get the IP addresses of the services using the `kubectl get services` command.

    ```bash-interactive
    kubectl get services
    ```

    ```output
    NAME         TYPE           CLUSTER-IP               EXTERNAL-IP         PORT(S)        AGE
    nginx-ipv4   LoadBalancer   10.0.88.78               20.46.24.24         80:30652/TCP   97s
    nginx-ipv6   LoadBalancer   fd12:3456:789a:1::981a   2603:1030:8:5::2d   80:32002/TCP   63s
    ```

3. Verify functionality via a command-line web request from an IPv6 capable host. Azure Cloud Shell isn't IPv6 capable.

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

# [YAML](#tab/yaml)

1. Expose the NGINX deployment using the following YAML manifest.

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

2. Once the deployment is exposed and the `LoadBalancer` services are fully provisioned, get the IP addresses of the services using the `kubectl get services` command.

    ```bash-interactive
    kubectl get services
    ```

    ```output
    NAME         TYPE           CLUSTER-IP               EXTERNAL-IP         PORT(S)        AGE
    nginx-ipv4   LoadBalancer   10.0.88.78               20.46.24.24         80:30652/TCP   97s
    nginx-ipv6   LoadBalancer   fd12:3456:789a:1::981a   2603:1030:8:5::2d   80:32002/TCP   63s
    ```

3. Verify functionality via a command-line web request from an IPv6 capable host. Azure Cloud Shell isn't IPv6 capable.

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

---

<!-- LINKS - External -->
[kubernetes-dual-stack]: https://kubernetes.io/docs/concepts/services-networking/dual-stack/

<!-- LINKS - Internal -->
[outbound-type]: ./egress-outboundtype.md
[deploy-arm-template]: ../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md
[deploy-bicep-template]: ../azure-resource-manager/bicep/deploy-cli.md
[kubenet]: ./configure-kubenet.md
[aks-out-of-tree]: ./out-of-tree.md
[nat-gateway]: ../virtual-network/nat-gateway/nat-overview.md
[aks-network-concepts]: concepts-network.md
[az-group-create]: /cli/azure/group#az_group_create
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
