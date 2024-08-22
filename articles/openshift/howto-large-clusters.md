---
title: Deploy a large Azure Red Hat OpenShift cluster
description: Discover how to deploy a large Azure Red Hat OpenShift cluster.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 08/15/2024
---
# Deploy a large Azure Red Hat OpenShift cluster

This article provides the steps and best practices for deploying large scale Azure Red Hat OpenShift clusters up to 250 nodes. For clusters of that size, a combination of control plane nodes and infrastructure nodes is needed to ensure the cluster functions properly is recommended.

> [!CAUTION]
> Before deleting a large cluster, descale the cluster to 120 nodes or below.
> 

## Deploy a cluster

For clusters with over 101 control plane nodes, use the following [virtual machine instance types](support-policies-v4.md#supported-virtual-machine-sizes) size recommendations (or similar, newer generation instance types):

- Standard_D32s_v3
- Standard_D32s_v4
- Standard_D32s_v5

Following is a sample script using Azure CLI to deploy a cluster with Standard_D32s_v5 as the control plane node:

```azurecli
#az aro create \ --resource-group $RESOURCEGROUP \ --name $CLUSTER \ --vnet aro-vnet \ --master-subnet master-subnet \ --worker-subnet worker-subnet --master-vm-size Standard_D32s_v5
```

## Deploy infrastructure nodes for the cluster

For clusters with over 101 nodes, infrastructure nodes are required to separate cluster workloads (such as prometheus) to minimize contention with other workloads.
 
> [!NOTE]
> It's recommended that you deploy three (3) infrastructure nodes per cluster for redundancy and scalability needs. 
> 

The following instance types are recommended for infrastructure nodes:

- Standard_E16as_v5
- Standard_E16s_v5

For instructions on configuring infrastructure nodes, see [Deploy infrastructure nodes in an Azure Red Hat OpenShift cluster](howto-infrastructure-nodes.md).

## Add IP addresses to the cluster

A maximum of 20 IP addresses can be added to a load balancer. One (1) IP address is needed per 65 nodes, so a cluster with 250 nodes requires a minimum of four (4) IP addresses.

To add IP addresses to the load balancer using Azure CLI, run the following command:

`az aro update -n [clustername] –g [resourcegroup]  --lb-ip-count 20`

To add IP addresses through a rest API call:

```rest
az rest --method patch --url https://management.azure.com/subscriptions/fe16a035-e540-4ab7-80d9-373fa9a3d6ae/resourceGroups/shared-cluster/providers/Microsoft.RedHatOpenShift/OpenShiftClusters/shared-cluster?api-version=2023-07-01-preview --body '{"properties": {"networkProfile": {"loadBalancerProfile": {"managedOutboundIps": {"count": 5}}}}}' --headers "Content-Type=application/json"
```

