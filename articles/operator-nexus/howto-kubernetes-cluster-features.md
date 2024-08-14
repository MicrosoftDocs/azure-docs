---
title: Understanding Kubernetes cluster feature in Azure Operator Nexus Kubernetes service #Required; page title is displayed in search results. Include the brand.
description: Working with Kubernetes cluster features in Azure Operator Nexus Kubernetes clusters #Required; article description that is displayed in search results. 
author: dramasamy #Required; your GitHub user alias, with correct capitalization.
ms.author: dramasamy #Required; microsoft alias of author; optional team alias.
ms.service: azure-operator-nexus #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 08/014/2024 #Required; mm/dd/yyyy format.
ms.custom: template-how-to-pattern #Required; leave this attribute/value as-is.
---

# Working with Kubernetes cluster features in Nexus Kubernetes clusters

In this article, you learn how to work with Nexus Kubernetes Cluster Features. Nexus Kubernetes Cluster Features is a functionality of the Nexus platform that allows customers to enhance their Nexus Kubernetes clusters by adding extra packages or features.

## Prerequisites

Before proceeding with this how-to guide, it's recommended that you:

* Refer to the Nexus Kubernetes cluster [QuickStart guide](./quickstarts-kubernetes-cluster-deployment-cli.md) for a comprehensive overview and steps involved.
* Ensure that you meet the outlined prerequisites to ensure smooth implementation of the guide.

## Limitations

* You can only create, delete, or update Kubernetes cluster features that have the `Required` field set to `False`.
* When installing a Kubernetes cluster feature for the first time, the feature's name should be one of the feature names listed in the table. For subsequent actions such as updates or deletions, the feature's name should be obtained using the `az networkcloud kubernetescluster feature list` command.
* The `metrics-server` feature can't be deleted if a Horizontal Pod Autoscaler (HPA) is in use within the cluster.
* Storage-related Kubernetes cluster features, such as `csi-nfs` and `csi-volume`, can't be deleted if the respective StorageClass is in use within the cluster.

## Default configuration

When a Nexus Kubernetes cluster is deployed, the list of required Kubernetes cluster features will be installed automatically. After deployment, you can manage optional Kubernetes cluster features by either installing them or uninstalling them (deleting them from the cluster).

You can't control the installation of Kubernetes cluster features marked as "Required." However, you can perform create, update, and delete operations on features that have the "Required" field set to "False." You also have the option to update any Kubernetes cluster features via the update command.

The following Kubernetes cluster features are available to each Nexus Kubernetes cluster. Features with "Required" set to "True" are always installed by default and can't be deleted.

| Name                     | Description | Required | Installed by default |
|--------------------------|-------------|----------|----------------------|
| azure-arc-k8sagents      | Arc connects Nexus Kubernetes Cluster | True | True |
| calico                   | Provides Container Network Interface (CNI) support     | True | True |
| cloud-provider-kubevirt  | Supports the Cluster API (CAPI) KubeVirt provider for managing virtual machine-based workloads in Kubernetes | True | True |
| ipam-cni-plugin          | Allocates IP addresses for Layer 3 networks connected to workload containers when `ipamEnabled` is set to True | True | True |
| metallb                  | Provides External IPs to LoadBalancer services for load balancing traffic within Kubernetes | True | True |
| multus                   | Supports multiple network interfaces to be attached to Kubernetes pods | True | True |
| node-local-dns           | Deploys NodeLocal DNSCache to improve DNS performance and reliability within the Kubernetes cluster | True | True |
| sriov-dp                 | Deploys an optional CNI plugin for Single Root I/O Virtualization (SR-IOV) to enhance network performance | True | True |
| azure-arc-servers        | Deploys Azure Arc-enabled servers on each control plane and agent pool node, allowing management of non-Azure resources alongside Azure resources | False | True |
| csi-nfs                  | Provides a Container Storage Interface (CSI) driver for NFS (Network File System) to support NFS-based storage in Kubernetes | False| True |
| csi-volume               | Supports the csi-nexus-volume storage class for persistent volume claims within Kubernetes | False | True |
| metrics-server           | Deploys the Metrics Server, which provides resource usage metrics for Kubernetes clusters, such as CPU and memory usage | False| True |

> [!NOTE]
> * For each cluster, you can create only one feature of each Kubernetes cluster feature type.
> * If you delete a Kubernetes cluster feature with the "Required" attribute set to "False," the related charts will be removed from the cluster.

## How to manage Kubernetes cluster features

The following interactions allow for the creation and management of the Kubernetes cluster feature configuration.

### Installing a Kubernetes cluster feature

To install a Kubernetes cluster feature in the cluster, use the `az networkcloud kubernetescluster feature create` command. If you have multiple Azure subscriptions, you must specify the subscription ID either by using the `--subscription` flag in the CLI command or by selecting the appropriate subscription ID with the [az account set](/cli/azure/account#az-account-set) command.

```azurecli
az networkcloud kubernetescluster feature create \
    --name "<FEATURE_NAME>" \
    --kubernetes-cluster-name "<KUBERNETES_CLUSTER_NAME>" \
    --resource-group "<RESOURCE_GROUP>" \
    --location "<LOCATION>" \
    --tags "<KEY1>=<VALUE1>" "<KEY2>=<VALUE2>"
```

* Replace the placeholders (`<FEATURE_NAME>`, `<KUBERNETES_CLUSTER_NAME>`, `<RESOURCE_GROUP>`, `<LOCATION>`, `<KEY1>=<VALUE1>`, and `<KEY2>=<VALUE2>`) with your specific information.
  
To see all available parameters and their descriptions, run the command:

```azurecli
az networkcloud kubernetescluster feature create --help
```

#### Kubernetes cluster feature configuration parameters

| Parameter name                        | Description                                                                         |
| --------------------------------------| ----------------------------------------------------------------------------------- |
| FEATURE_NAME                          | Name of Kubernetes cluster `feature`                                                |
| KUBERNETES_CLUSTER_NAME               | Name of Cluster                                                                     |
| LOCATION                              | The Azure Region where the Cluster is deployed                                      |
| RESOURCE_GROUP                        | The Cluster resource group name                                                     |
| KEY1                                  | Optional tag1 to pass to Kubernetes cluster feature create                          |
| VALUE1                                | Optional tag1 value to pass to Kubernetes cluster feature create                    |
| KEY2                                  | Optional tag2 to pass to Kubernetes cluster feature create                          |
| VALUE2                                | Optional tag2 value to pass to Kubernetes cluster feature create                    |

Specifying `--no-wait --debug` options in az command results in the execution of this command asynchronously. For more information, see [how to track asynchronous operations](howto-track-async-operations-cli.md).

### List the Kubernetes cluster feature

You can check the Kubernetes cluster feature resources for a specific cluster by using the `az networkcloud kubernetescluster feature list` command. This command displays a list of all features associated with the specified Kubernetes cluster:

```azurecli
az networkcloud kubernetescluster feature list \
  --kubernetes-cluster-name  "<KUBERNETES_CLUSTER_NAME>" \
  --resource-group "<RESOURCE_GROUP>"

```

### Retrieving a Kubernetes cluster feature

After a Kubernetes cluster is created, you can check the details of a specific Kubernetes cluster feature using the `networkcloud kubernetescluster feature show` command. This provides detailed information about the feature:

```azurecli
az networkcloud kubernetescluster feature show \
 --cluster-name "<KUBERNETES_CLUSTER_NAME>" \
 --resource-group "<RESOURCE_GROUP>"
```

This command returns a JSON representation of the Kubernetes cluster feature configuration.

### Updating a Kubernetes cluster feature

Much like the creation of a Kubernetes cluster feature, you can perform an update action to modify the tags assigned to the Kubernetes cluster feature. Use the following command to update the tags:

> [!IMPORTANT]
> * The `name` parameter should match the "Name" obtained from the output of the `az networkcloud kubernetescluster feature list` command. While the feature name provided during installation can be used initially, once the feature is installed, it is assigned a unique name. Therefore, always use the `list` command to get the actual resource name for update and delete operations, rather than relying on the initial feature name shown in the table.

```azurecli
az networkcloud kubernetescluster feature update \
  --name "<FEATURE_NAME>"   \
  --kubernetes-cluster-name "<KUBERNETES_CLUSTER_NAME>"  \
  --resource-group "<RESOURCE_GROUP>" \
  --tags <KEY1>="<VALUE1>" \
        <KEy2>="<VALUE2>"
```

Specifying `--no-wait --debug` options in az command results in the execution of this command asynchronously. For more information, see [how to track asynchronous operations](howto-track-async-operations-cli.md).

### Deleting Kubernetes cluster feature

Deleting a Kubernetes cluster feature removes the resource from the cluster. To delete a Kubernetes cluster feature, use the following command:

> [!IMPORTANT]
> * The `name` parameter should match the "Name" obtained from the output of the `az networkcloud kubernetescluster feature list` command. While the feature name provided during installation can be used initially, once the feature is installed, it is assigned a unique name. Therefore, always use the `list` command to get the actual resource name for update and delete operations, rather than relying on the initial feature name shown in the table.

```azurecli
az networkcloud kubernetescluster feature delete  \
   --name "<FEATURE_NAME>"  \
   --kubernetes-cluster-name "<KUBERNETES_CLUSTER_NAME>" \
   --resource-group "<RESOURCE_GROUP>"
```

Specifying `--no-wait --debug` options in az command results in the execution of this command asynchronously. For more information, see [how to track asynchronous operations](howto-track-async-operations-cli.md).

> [!NOTE]
> * If you attempt to delete a Kubernetes cluster feature that has `Required=True`, the command will fail and produce an error message stating, "delete not allowed for ... feature as it is a required feature."
> * In such cases, a subsequent show/list command will display the `provisioningState` as `Failed`. This is a known issue.
> * To correct the `provisioningState`, you can run a no-op command, such as updating the tags on the affected Kubernetes cluster feature. Use the `--tags` parameter of the update command to do this. This action will reset the `provisioningState` to `Succeeded`.
