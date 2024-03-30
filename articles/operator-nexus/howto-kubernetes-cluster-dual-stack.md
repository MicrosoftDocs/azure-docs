---
title: Create dual-stack Azure Operator Nexus Kubernetes cluster
description: Learn how to create dual-stack Azure Operator Nexus Kubernetes cluster.
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 03/28/2024
ms.custom: template-how-to-pattern, devx-track-bicep
---

# Create dual-stack Azure Operator Nexus Kubernetes cluster

In this article, you learn how to create a dual-stack Nexus Kubernetes cluster. The dual-stack networking feature helps to enable both IPv4 and IPv6 communication in a Kubernetes cluster, allowing for greater flexibility and scalability in network communication. The focus of this guide is on the configuration aspects, providing examples to help you understand the process. By following this guide, you're able to effectively create a dual-stack Nexus Kubernetes cluster.

In a dual-stack Kubernetes cluster, both the nodes and the pods are configured with an IPv4 and IPv6 network address. This means that any pod that runs on a dual-stack cluster will be assigned both IPv4 and IPv6 addresses within the pod, and the cluster nodes' CNI (Container Network Interface) interface will also be assigned both an IPv4 and IPv6 address. However, any multus interfaces attached, such as SRIOV/DPDK, are the responsibility of the application owner and must be configured accordingly. 

Network Address Translation (NAT) is configured to enable pods to access resources within the local network infrastructure. The source IP address of the traffic from the pods (either IPv4 or IPv6) is translated to the node's primary IP address corresponding to the same IP family (IPv4 to IPv4 and IPv6 to IPv6). This setup ensures seamless connectivity and resource access for the pods within the on-premises environment.

## Prerequisites

Before proceeding with this how-to guide, it's recommended that you:

* Refer to the Nexus Kubernetes cluster [QuickStart guide](./quickstarts-kubernetes-cluster-deployment-bicep.md) for a comprehensive overview and steps involved.
* Ensure that you meet the outlined prerequisites to ensure smooth implementation of the guide.
* Knowledge of Kubernetes concepts, including deployments and services.
* The Layer 3 (L3) network used for the `cniNetworkId` must have both IPv4 and IPv6 addresses.

## Limitations

* Single stack IPv6-only isn't supported for node or pod IP addresses. Workload Pods and services can use dual-stack (IPv4/IPv6).
* Kubernetes administration API access to the cluster is IPv4 only. Any kubeconfig must be IPv4 because kube-vip for the kubernetes API server only sets up an IPv4 address.

## Configuration options

Operator Nexus Kubernetes dual-stack networking relies on the pod and service CIDR to enable both IPv4 and IPv6 communication. Before configuring the dual-stack networking, it's important to understand the various configuration options available. These options allow you to define the behavior and parameters of the dual-stack networking according to your specific requirements. Let's explore the configuration options for dual-stack networking.

### Required parameters

To configure dual-stack networking in your Operator Nexus Kubernetes cluster, you need to define the `Pod` and `Service` CIDRs. These configurations are essential for defining the IP address range for Pods and Kubernetes services in the cluster.

* The `podCidrs` parameter takes a list of CIDR notation IP ranges to assign pod IPs from. Example, `["10.244.0.0/16", "fd12:3456:789a::/64"]`.
* The `serviceCidrs` parameter takes a list of CIDR notation IP ranges to assign service IPs from. Example, `["10.96.0.0/16", "fd12:3456:789a:1::/108"]`.
* The IPv6 subnet assigned to `serviceCidrs` can be no larger than a `/108`.

## Bicep template parameters for dual-stack configuration

The following JSON snippet shows the parameters required for creating dual-stack cluster in the [QuickStart Bicep template](./quickstarts-kubernetes-cluster-deployment-bicep.md).

```json
    "podCidrs": {
      "value": ["10.244.0.0/16", "fd12:3456:789a::/64"]
    },
    "serviceCidrs": {
      "value": ["10.96.0.0/16", "fd12:3456:789a:1::/108"]
    },
```

To create a dual-stack cluster, you need to update the `kubernetes-deploy-parameters.json` file that you created during the [QuickStart](./quickstarts-kubernetes-cluster-deployment-bicep.md). Include the Pod and Service CIDR configuration in this file according to your desired settings, and change the cluster name to ensure that a new cluster is created with the updated configuration.

After updating the Pod and Service CIDR configuration to your parameter file, you can proceed with deploying the Bicep template. This action sets up your new dual-stack cluster with the specified Pod and Server CIDR configuration.

By following these instructions, you can create a dual-stack Nexus Kubernetes cluster with the desired IP pool configuration and take advantage of the dual-stack in your cluster services.

To enable dual-stack `LoadBalancer` services in your cluster, you must ensure that the [IP pools are configured](./howto-kubernetes-service-load-balancer.md) with both IPv4 and IPv6 addresses. This allows the LoadBalancer service to allocate IP addresses from the specified IP pools for the services, enabling effective communication between the services and the external network.

### Example parameters

This parameter file is intended to be used with the [QuickStart guide](./quickstarts-kubernetes-cluster-deployment-bicep.md) Bicep template for creating a dual-stack cluster. It contains the necessary configuration settings to set up the dual-stack cluster with BGP load balancer functionality. By using this parameter file with the Bicep template, you can create a dual-stack cluster with the desired BGP load balancer capabilities.

> [!IMPORTANT]
> These instructions are for creating a new Operator Nexus Kubernetes cluster. Avoid applying the Bicep template to an existing cluster, as Pod and Service CIDR configurations are immutable.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "kubernetesClusterName":{
      "value": "dual-stack-cluster"
    },
    "adminGroupObjectIds": {
      "value": [
        "00000000-0000-0000-0000-000000000000"
      ]
    },
    "cniNetworkId": {
      "value": "/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/l3Networks/<l3Network-name>"
    },
    "cloudServicesNetworkId": {
      "value": "/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/cloudServicesNetworks/<csn-name>"
    },
    "extendedLocation": {
      "value": "/subscriptions/<subscription_id>/resourceGroups/<managed_resource_group>/providers/microsoft.extendedlocation/customlocations/<custom-location-name>"
    },
    "location": {
      "value": "eastus"
    },
    "sshPublicKey": {
      "value": "ssh-rsa AAAAB...."
    },
    "podCidrs": {
      "value": ["10.244.0.0/16", "fd12:3456:789a::/64"]
    },
    "serviceCidrs": {
      "value": ["10.96.0.0/16", "fd12:3456:789a:1::/108"]
    },
    "ipAddressPools": {
      "value": [
        {
          "addresses": ["<IPv4>/<CIDR>", "<IPv6>/<CIDR>"],
          "name": "<pool-name>",
          "autoAssign": "True",
          "onlyUseHostIps": "True"
        }
      ]
    }
  }
}
```

## Inspect the nodes to see both IP families

* Once the cluster is provisioned, confirm the nodes are provisioned with dual-stack networking using the `kubectl get nodes` command.

  ```azurecli
  kubectl get nodes -o=custom-columns="NAME:.metadata.name,ADDRESSES:.status.addresses[?(@.type=='InternalIP')].address"
  ```

The output from the kubectl get nodes command shows the nodes have addresses and pod IP assignment space from both IPv4 and IPv6.

  ```output
  NAME                                              ADDRESSES
  dual-stack-cluster-374cc36c-agentpool1-md-6ff45   10.14.34.20,fda0:d59c:da0a:e22:a8bb:ccff:fe6d:9e2a,fda0:d59c:da0a:e22::11,fe80::a8bb:ccff:fe6d:9e2a    
  dual-stack-cluster-374cc36c-agentpool1-md-dpmqv   10.14.34.22,fda0:d59c:da0a:e22:a8bb:ccff:fe80:f66f,fda0:d59c:da0a:e22::13,fe80::a8bb:ccff:fe80:f66f    
  dual-stack-cluster-374cc36c-agentpool1-md-tcqpf   10.14.34.21,fda0:d59c:da0a:e22:a8bb:ccff:fed5:a3fb,fda0:d59c:da0a:e22::12,fe80::a8bb:ccff:fed5:a3fb    
  dual-stack-cluster-374cc36c-control-plane-gdmz8   10.14.34.19,fda0:d59c:da0a:e22:a8bb:ccff:fea8:5a37,fda0:d59c:da0a:e22::10,fe80::a8bb:ccff:fea8:5a37    
  dual-stack-cluster-374cc36c-control-plane-smrxl   10.14.34.18,fda0:d59c:da0a:e22:a8bb:ccff:fe7b:cfa9,fda0:d59c:da0a:e22::f,fe80::a8bb:ccff:fe7b:cfa9     
  dual-stack-cluster-374cc36c-control-plane-tjfc8   10.14.34.17,10.14.34.14,fda0:d59c:da0a:e22:a8bb:ccff:feaf:21ec,fda0:d59c:da0a:e22::c,fe80::a8bb:ccff:feaf:21ec
  ```

## Create an example workload

Once the cluster has been created, you can deploy your workloads. This article walks you through an example workload deployment of an NGINX web server.

### Deploy an NGINX web server

1. Create an NGINX web server using the `kubectl create deployment nginx` command.

  ```bash-interactive
  kubectl create deployment nginx --image=mcr.microsoft.com/cbl-mariner/base/nginx:1.22 --replicas=3
  ```

2. View the pod resources using the `kubectl get pods` command.

  ```bash-interactive
  kubectl get pods -o custom-columns="NAME:.metadata.name,IPs:.status.podIPs[*].ip,NODE:.spec.nodeName,READY:.status.conditions[?(@.type=='Ready')].status"
  ```

  The output shows the pods have both IPv4 and IPv6 addresses. The pods don't show IP addresses until they're ready.

  ```output
  NAME                     IPs                                                  NODE                                              READY
  nginx-7d566f5967-gtqm8   10.244.31.200,fd12:3456:789a:0:9ca3:8a54:6c22:1fc8   dual-stack-cluster-374cc36c-agentpool1-md-6ff45   True
  nginx-7d566f5967-sctn2   10.244.106.73,fd12:3456:789a:0:1195:f83e:f6bd:4809   dual-stack-cluster-374cc36c-agentpool1-md-tcqpf   True
  nginx-7d566f5967-wh2rp   10.244.100.196,fd12:3456:789a:0:c296:3da:b545:aa04   dual-stack-cluster-374cc36c-agentpool1-md-dpmqv   True
  ```

### Expose the workload via a `LoadBalancer` type service

1. Expose the NGINX deployment using the `kubectl expose deployment nginx` command.

  ```bash-interactive
  kubectl expose deployment nginx --name=nginx --port=80 --type=LoadBalancer --overrides='{"spec":{"ipFamilyPolicy": "PreferDualStack", "ipFamilies": ["IPv4", "IPv6"]}}'
  ```

  You receive an output that shows the services have been exposed.

  ```output
  service/nginx exposed
  ```

2. Once the deployment is exposed and the `LoadBalancer` services are fully provisioned, get the IP addresses of the services using the `kubectl get services` command.

  ```bash-interactive
  kubectl get services
  ```

  ```output
  NAME         TYPE           CLUSTER-IP     EXTERNAL-IP                                           PORT(S)        AGE
  nginx        LoadBalancer   10.96.119.27   10.14.35.240,fda0:d59c:da0a:e23:ffff:ffff:ffff:fffc   80:30122/TCP   10s
  ```

  ```bash-interactive
  kubectl get services nginx -ojsonpath='{.spec.clusterIPs}'
  ```

  ```output
  ["10.96.119.27","fd12:3456:789a:1::e6bb"]
  ```

## Next steps

You can try deploying a network function (NF) within your Nexus Kubernetes cluster utilizing the dual-stack address.
