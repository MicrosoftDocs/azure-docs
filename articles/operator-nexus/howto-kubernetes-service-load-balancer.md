---
title: Configure service load balancer in Azure Operator Nexus Kubernetes service
description: Configure service load balancer in Azure Operator Nexus Kubernetes service
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 06/27/2023
ms.custom: template-how-to-pattern, devx-track-bicep
---

# Configure service load-balancer in Azure Operator Nexus Kubernetes service

In this article, you learn how to configure a service load balancer in a Nexus Kubernetes cluster. The load balancer allows external services to access the services running within the cluster. The focus of this guide is on the configuration aspects, providing examples to help you understand the process. By following this guide, you're able to effectively configure service load balancers in your Nexus Kubernetes cluster.

## Prerequisites

Before proceeding with this how-to guide, it's recommended that you:
   * Refer to the Nexus Kubernetes cluster [quickStart guide](./quickstarts-kubernetes-cluster-deployment-bicep.md) for a comprehensive overview and steps involved.
   * Ensure that you meet the outlined prerequisites to ensure smooth implementation of the guide.
   * Knowledge of Kubernetes concepts, including deployments and services.
   * Contact your network administrator to acquire an IP address range that can be used for the load-balancer IP pool.

## Limitations
   * IP pool configuration is immutable: Once set, it can't be modified in a Nexus Kubernetes cluster.
   * IP pool names must start with a lowercase letter or a digit and end with a lowercase letter or digit.
   * IP pool names shouldn't exceed 63 characters to avoid potential issues or restrictions.
   * IP address pools shouldn't overlap with existing POD CIDR, Service CIDR, or CNI prefix to prevent conflicts and networking problems within the cluster.

> [!IMPORTANT]
> These instructions are for creating a new Nexus Kubernetes cluster. Avoid applying the Bicep template to an existing cluster, as IP pool configuration is immutable. Once a cluster is created with the IP pool configuration, it cannot be modified.

## Configuration options
Before configuring the IP address pool for the service load-balancer, it's important to understand the various configuration options available. These options allow you to define the behavior and parameters of the IP address pool according to your specific requirements.

Let's explore the configuration options for the IP address pool.

### Required parameters
The IP address pool configuration requires the presence of two fields: `addresses` and `name`. These fields are essential for defining the IP address range and identifying the pool.

   * The `addresses` field specifies the list of IP address ranges that can be used for allocation within the pool. You can define each range as a subnet in CIDR format or as an explicit start-end range of IP addresses.
   * The `name` field serves as a unique identifier for the IP address pool. It helps associate the pool with a BGP (Border Gateway Protocol) advertisement, enabling effective communication within the cluster.

> [!NOTE]
> To enable the Kubernetes `LoadBalancer` service to have a dual-stack address, make sure that the IP pool configuration includes both IPv4 and IPv6 CIDR/addresses.

### Optional parameters
In addition to the required fields, there are also optional fields available for further customization of the IP address pool configuration.

   * The `autoAssign` field determines whether IP addresses are automatically assigned from the pool. This field is a `string` type with a default value of `True`. You can set it to either `True` or `False` based on your preference.
   * The `onlyUseHostIps` field controls the use of IP addresses ending with `.0` and `.255` within the pool. Enabling this option restricts the usage to IP addresses between `.1` and `.254` (inclusive), excluding the reserved network and broadcast addresses.

## Bicep template parameters for IP address pool configuration

The following JSON snippet shows the parameters required for configuring the IP address pool in the Bicep template.

```json
"ipAddressPools": {
  "value": [
    {
      "addresses": ["<IP>/<CIDR>"],
      "name": "<pool-name>",
      "autoAssign": "True",  /* "True"/"False" */
      "onlyUseHostIps": "True"  /* "True"/"False" */
    }
  ]
}
```

<!-- > [!NOTE]
> The IP CIDR for the address field in the IP pool configuration can be specified as /32, which represents a single IP address. Additionally, the address field is an array, allowing for the inclusion of any number of /32 IP addresses in the pool configuration. Additionally, the IP pool configuration supports multiple IP pools, offering the flexibility to allocate specific IP ranges to different services or deployments within the Kubernetes cluster. -->

To add the IP pool configuration to your cluster, you need to update the `kubernetes-deploy-parameters.json` file that you created during the [quickStart](./quickstarts-kubernetes-cluster-deployment-bicep.md). Include the IP pool configuration in this file according to your desired settings.

After adding the IP pool configuration to your parameter file, you can proceed with deploying the Bicep template. This action sets up your new cluster with the specified IP address pool configuration, allowing you to utilize the IP pool as intended.

By following these instructions, you can create a new Nexus Kubernetes cluster with the desired IP pool configuration and take advantage of the IP address pool for your cluster services.

### Example parameters

This parameter file is intended to be used with the [quickStart guide](./quickstarts-kubernetes-cluster-deployment-bicep.md) Bicep template for creating a cluster with BGP load balancer enabled. It contains the necessary configuration settings to set up the cluster with BGP load balancer functionality. By using this parameter file with the Bicep template, you can create a cluster with the desired BGP load balancer capabilities.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "kubernetesClusterName":{
      "value": "lb-test-cluster"
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
    "ipAddressPools": {
      "value": [
        {
          "addresses": ["<IP>/<CIDR>"],
          "name": "<pool-name>",
          "autoAssign": "True",
          "onlyUseHostIps": "True"
        }
      ]
    }
  }
}
```

> [!NOTE]
> If you intend to create a DualStack service, ensure that the address pool contains both an IPv4 CIDR and an IPv6 CIDR. This allows for simultaneous support of both IPv4 and IPv6 addresses in your load balancer configuration.

## Example: Static IP address allocation for a service

To allocate a static IP address for a service, you can use the following commands.

### Create a deployment
```bash
kubectl create deployment nginx --image=nginx --port 80
```

### Static IP allocation (LoadBalancerIP)
```bash
kubectl expose deployment nginx \
    --name nginx-loadbalancer-pool1-static \
    --type LoadBalancer \
    --load-balancer-ip <IP from pool-1>
```
Replace `<IP from pool-1>` with the desired IP address from the IP pool.

### Static IP allocation (ExternalIP)
```bash
kubectl expose deployment nginx \
    --name nginx-clusterip-pool1-static \
    --type ClusterIP \
    --external-ip <IP from pool-1>
```

Replace `<IP from pool-1>` with the desired IP address from the IP pool.

## Example: IP address allocation for a service from specific IP pool

To allocate an IP address for a service from a specific IP pool, you can use the following command.

```bash
kubectl expose deployment nginx \
    --name nginx-loadbalancer-pool2-auto \
    --type LoadBalancer \
    --overrides '{"metadata":{"annotations":{"metallb.universe.tf/address-pool":"pool-2"}}}'
```

This command assigns an IP address to the service from the IP pool `pool-2`. Adjust the pool name as needed. Before trying out these examples, ensure that you have already created a Nexus Kubernetes cluster with two different IP address pools. If you haven't done so, follow the necessary steps to create the cluster and configure the IP pools accordingly.

> [!NOTE]
> The IP address pool name is case-sensitive. Make sure to use the correct case when specifying the pool name.

## Next steps
You can try deploying a network function (NF) within your Nexus Kubernetes cluster utilizing the newly configured load balancer. This configuration allows you to test the load balancing capabilities and observe how traffic is distributed among the instances of your NF.
