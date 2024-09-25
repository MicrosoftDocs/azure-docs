---
title: Configure multiple IP addresses for Azure Red Hat OpenShift cluster load balancers
description: Discover how to configure multiple IP addresses for ARO cluster load balancers.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: how-to
ms.date: 09/11/2024

#Customer intent: As an ARO SRE, I need to configure multiple outbound IP addresses per ARO cluster load balancers
---
# Configure multiple IP addresses per Azure Red Hat OpenShift cluster load balancer

Azure Red Hat OpenShift public clusters are created with a public load balancer that's used for outbound connectivity from inside the cluster. By default, one public IP address is configured on that public load balancer, and that limits the maximum node count of your cluster to 62. To be able to scale your cluster to the maximum supported number of 250 nodes, you need to assign multiple additional public IP addresses to the load balancer.

You can configure up to 20 IP addresses per cluster. The outbound rules and frontend IP configurations are adjusted to accommodate the number of IP addresses.

> [!CAUTION]
> Before deleting a cluster with more than 120 nodes, scale down the cluster to 120 nodes or less.
> 

## Requirements

The multiple public IPs feature is only available on the current network architecture used by ARO; older clusters don't support this feature. If your cluster was created before OpenShift Container Platform (OCP) version 4.5, this feature isn't available even if you upgraded your OCP version since then.

If you're unsure if your cluster was created before OCP version 4.5, use the following commands to check.

Get the cluster managed resource group:

```
RESOURCEGROUP=aro-rg   # the name of the resource group your cluster is in
CLUSTER=cluster        # the name of your cluster
CLUSTER_RESOURCEGROUP=$(az aro show -g $RESOURCEGROUP -n $CLUSTER --query clusterProfile.resourceGroupId -o tsv | awk -F'/' '{print $NF}')
```

List the network load balancers:

```
az network lb list -g $CLUSTER_RESOURCEGROUP -o table
```

If you have a loadbalancer named `$CLUSTER-public-lb`, the cluster has the older network architecture and can't use the multiple public IP feature.

## Create the cluster with multiple IP addresses 

To create a new ARO cluster with multiple managed IPs on the public load balancer, use the following command with the desired number of IPs in the `--load-balancer-managed-outbound-ip-count` parameter. In the example below, seven (7) IP addresses are created:

```
az aro create \
  --resource-group aroResourceGroup \
  --name aroCluster \
  --load-balancer-managed-outbound-ip-count 7
```

See [Deploy a large Azure Red Hat OpenShift cluster](howto-large-clusters.md) for more information about deploying a large cluster.

## Update the number of IP addresses on existing clusters

To update the number of managed IPs on the public load balancer of an existing ARO cluster, use the following command with the desired number of IPs in the `--load-balancer-managed-outbound-ip-count` parameter. In the example below, the number of IPs for the cluster will be updated to four (4):

```
az aro update \
  --resource-group aroResourceGroup \
  --name aroCluster \
  --load-balancer-managed-outbound-ip-count 4
```

You can use this update method to either increase or decrease the number of IPs on a cluster to be between 1 and 20. Scaling down the number of clusters can interrupt the outbound network traffic from the cluster.
