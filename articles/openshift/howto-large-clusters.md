---
title: Deploy a large Azure Red Hat OpenShift cluster
description: Discover how to deploy a large Azure Red Hat OpenShift cluster.
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
ms.topic: article
ms.date: 09/12/2024
---
# Deploy a large Azure Red Hat OpenShift cluster

This article provides the steps and best practices for deploying large scale Azure Red Hat OpenShift clusters up to 250 worker nodes. For clusters of that size, there are some recommendations regarding control plane nodes and infrastructure nodes.

> [!CAUTION]
> Before deleting a cluster with more than 120 nodes, scale down the cluster to 120 nodes or less.
> 

## Recommendations

### Control plane nodes

For clusters with over 100 worker nodes, the following [virtual machine instance types](support-policies-v4.md#supported-virtual-machine-sizes) (or similar, newer generation instance types) are recommended for control plane nodes:

- Standard_D32s_v3
- Standard_D32s_v4
- Standard_D32s_v5

### Infrastructure nodes

For clusters with over 100 worker nodes, infrastructure nodes are required to separate cluster workloads (such as Prometheus) to minimize contention with other workloads. You should deploy three (3) infrastructure nodes per cluster for redundancy and scalability needs.

The following instance types are recommended for infrastructure nodes:

- Standard_E16as_v5
- Standard_E16s_v5

For instructions on configuring infrastructure nodes, see [Deploy infrastructure nodes in an Azure Red Hat OpenShift cluster](howto-infrastructure-nodes.md). This will be configured after cluster deployment.

### Add IP addresses to the load balancer

Azure Red Hat OpenShift public clusters are created with a public load balancer that's used for outbound connectivity from inside the cluster. By default, one public IP address is configured on that public load balancer, and that limits the maximum node count of your cluster to 62. To be able to scale your cluster to the maximum supported number of 250 nodes, you need to assign multiple additional public IP addresses to the load balancer. You can configure up to 20 IP addresses per cluster. The outbound rules and frontend IP configurations are adjusted to accommodate the number of IP addresses.

For example, a cluster with 180 worker nodes needs at least (3) three IP addresses (180 nodes / 62 nodes per IP).

This can be accomplished as part of the cluster creation process or later, after the cluster is created.

## Deploy a cluster

When deploying a large cluster, you must start with at most 50 worker nodes at creation time, then scale the cluster out to the desired number of worker nodes, up to 250 worker nodes. 

> [!NOTE]
> While you can define up to 50 worker nodes at creation time, it's best to start with a small cluster (e.g, three (3) worker nodes) and then scale out to the desired number of worker nodes after the cluster is installed.
>

Follow the steps provided in [Create an Azure Red Hat OpenShift cluster](create-cluster.md?tabs=azure-cli) until the "Create the cluster" steps, then continue as instructed:

The sample command below using the Azure CLI can be used to deploy a cluster with Standard_D32s_v5 as the control plane nodes, requesting three public IP addresses, and defining nine worker nodes:

```azurecli
az aro create \ 
    --resource-group $RESOURCEGROUP \
    --name $CLUSTER \
    --vnet aro-vnet \
    --master-subnet master-subnet \
    --worker-subnet worker-subnet \
    --master-vm-size Standard_D32s_v5 \
    --worker-count 9 \
    --lb-ip-count 3
```

To add IP addresses to the load balancer using the Azure CLI after the cluster is created, run the following command:

```azurecli
az aro update
    --name <CLUSTER_NAME>
    –-resource-group <RESOURCE_GROUP>
    --lb-ip-count <PUBLIC_IP_COUNT>`
```

You can then configure the corresponding OpenShift MachineSets to obtain the number of worker nodes desired. See [Manually scaling a compute machine set](https://docs.openshift.com/container-platform/latest/machine_management/manually-scaling-machineset.html) for more details.

Once the cluster is successfully installed, proceed to deploying infrastructure nodes as defined in the [Infrastructure nodes](#infrastructure-nodes) section.
