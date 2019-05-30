---
title: Migrate from Azure Container Service (ACS) to Azure Kubernetes Service (AKS)
description: Migrate from Azure Container Service (ACS) to Azure Kubernetes Service (AKS).
services: container-service
author: noelbundick
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 06/13/2018
ms.author: nobun
ms.custom: mvc
---

# Migrate from Azure Container Service (ACS) to Azure Kubernetes Service (AKS)

This article helps you plan and execute a successful migration between Azure Container Service (ACS) with Kubernetes and Azure Kubernetes Service (AKS). To help you make key decisions, this guide details the differences between ACS and AKS and provides an overview of the migration process.

## Differences between ACS and AKS

ACS and AKS differ in some key areas that affect migration. Before any migration, you should review and plan to address the following differences:

* AKS nodes use [managed disks](../virtual-machines/windows/managed-disks-overview.md).
    * Unmanaged disks must be converted before you can attach them to AKS nodes.
    * Custom `StorageClass` objects for Azure disks must be changed from `unmanaged` to `managed`.
    * Any `PersistentVolumes` should use `kind: Managed`.
* AKS supports [multiple node pools](https://docs.microsoft.com/azure/aks/use-multiple-node-pools) (currently in preview).
* Nodes based on Windows Server are currently in [preview in AKS](https://azure.microsoft.com/blog/kubernetes-on-azure/).
* AKS supports a limited set of [regions](https://docs.microsoft.com/azure/aks/quotas-skus-regions).
* AKS is a managed service with a hosted Kubernetes control plane. You might need to modify your applications if you've previously modified the configuration of your ACS masters.

## Differences between Kubernetes versions

If you're migrating to a newer version of Kubernetes (for example, from 1.7.x to 1.9.x), review the following resources to understand a few changes to the Kubernetes API:

* [Migrating a ThirdPartyResource to CustomResourceDefinition](https://kubernetes.io/docs/tasks/access-kubernetes-api/migrate-third-party-resource/)
* [Workloads API changes in versions 1.8 and 1.9](https://kubernetes.io/docs/reference/workloads-18-19/)

## Migration considerations

### Agent pools

Although AKS manages the Kubernetes control plane, you still define the size and number of nodes to include in your new cluster. Assuming you want a 1:1 mapping from ACS to AKS, you'll want to capture your existing ACS node information. Use this data when you create your new AKS cluster.

Example:

| Name | Count | VM size | Operating system |
| --- | --- | --- | --- |
| agentpool0 | 3 | Standard_D8_v2 | Linux |
| agentpool1 | 1 | Standard_D2_v2 | Windows |

Because additional virtual machines will be deployed into your subscription during migration, you should verify that your quotas and limits are sufficient for these resources. 

For more information, see [Azure subscription and service limits](https://docs.microsoft.com/azure/azure-subscription-service-limits). To check your current quotas, in the Azure portal, go to the [subscriptions blade](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade), select your subscription, and then select **Usage + quotas**.

### Networking

For complex applications, you'll typically migrate over time rather than all at once. That means that the old and new environments might need to communicate over the network. Applications that previously used `ClusterIP` services to communicate might need to be exposed as type `LoadBalancer` and be secured appropriately.

To complete the migration, you'll want to point clients to the new services that are running on AKS. We recommend that you redirect traffic by updating DNS to point to the Load Balancer that sits in front of your AKS cluster.

### Stateless applications

Stateless application migration is the most straightforward case. You'll apply your YAML definitions to the new cluster, make sure everything works as expected, and redirect traffic to activate your new cluster.

### Stateful applications

Carefully plan your migration of stateful applications to avoid data loss or unexpected downtime.

#### Highly available applications

You can deploy some stateful applications in a high availability configuration. These applications can copy data across replicas. If you currently use this sort of deployment, you might be able to create a new member on the new AKS cluster and then migrate with minimal effect on downstream callers. Generally, the migration steps for this scenario are:

1. Create a new secondary replica on AKS.
2. Wait for data to replicate.
3. Fail over to make a secondary replica the new primary.
4. Point traffic to the AKS cluster.

#### Migrating persistent volumes

If you're migrating existing persistent volumes to AKS, you'll generally follow these steps:

1. Quiesce writes to the application. (This step is optional and requires downtime.)
2. Take snapshots of the disks.
3. Create new managed disks from the snapshots.
4. Create persistent volumes in AKS.
5. Update pod specifications to [use existing volumes](https://docs.microsoft.com/azure/aks/azure-disk-volume) rather than PersistentVolumeClaims (static provisioning).
6. Deploy the application to AKS.
7. Validate.
8. Point traffic to the AKS cluster.

> [!IMPORTANT]
> If you choose not to quiesce writes, you'll need to replicate data to the new deployment. Otherwise you'll miss the data that was written after you took the disk snapshots.

Some open-source tools can help you create managed disks and migrate volumes between Kubernetes clusters:

* [Azure CLI Disk Copy extension](https://github.com/noelbundick/azure-cli-disk-copy-extension) copies and converts disks across resource groups and Azure regions.
* [Azure Kube CLI extension](https://github.com/yaron2/azure-kube-cli) enumerates ACS Kubernetes volumes and migrates them to an AKS cluster.

#### Azure Files

Unlike disks, Azure Files can be mounted to multiple hosts concurrently. In your AKS cluster, Azure and Kubernetes don't prevent you from creating a pod that your ACS cluster still uses. To prevent data loss and unexpected behavior, ensure that the clusters don't write to the same files at the same time.

If your application can host multiple replicas that point to the same file share, follow the stateless migration steps and deploy your YAML definitions to your new cluster. If not, one possible migration approach involves the following steps:

1. Deploy your application to AKS with a replica count of 0.
2. Scale the application on ACS to 0. (This step requires downtime.)
3. Scale the application on AKS up to 1.
4. Validate.
5. Point traffic to the AKS cluster.

If you want to start with an empty share and make a copy of the source data, you can use the [`az storage file copy`](https://docs.microsoft.com/cli/azure/storage/file/copy?view=azure-cli-latest) commands to migrate your data.

### Deployment strategy

We recommend that you use your existing CI/CD pipeline to deploy a known-good configuration to AKS. Clone your existing deployment tasks and ensure that `kubeconfig` points to the new AKS cluster.

If that's not possible, export resource definitions from ACS and then apply them to AKS. You can use `kubectl` to export objects.

```console
kubectl get deployment -o=yaml --export > deployments.yaml
```

Several open-source tools can help, depending on your deployment needs:

* [Velero](https://github.com/heptio/ark) (This tool requires Kubernetes 1.7.)
* [Azure Kube CLI extension](https://github.com/yaron2/azure-kube-cli)
* [ReShifter](https://github.com/mhausenblas/reshifter)

## Migration steps

1. [Create an AKS cluster](https://docs.microsoft.com/azure/aks/create-cluster) through the Azure portal, Azure CLI, or Azure Resource Manager template.

   > [!NOTE]
   > Find sample Azure Resource Manager templates for AKS at the [Azure/AKS](https://github.com/Azure/AKS/tree/master/examples/vnet) repository on GitHub.

2. Make any necessary changes to your YAML definitions. For example, replace `apps/v1beta1` with `apps/v1` for `Deployments`.

3. [Migrate volumes](#migrating-persistent-volumes) (optional) from your ACS cluster to your AKS cluster.

4. Use your CI/CD system to deploy applications to AKS. Or use kubectl to apply the YAML definitions.

5. Validate. Make sure that your applications work as expected and that any migrated data has been copied over.

6. Redirect traffic. Update DNS to point clients to your AKS deployment.

7. Finish post-migration tasks. If you migrated volumes and chose not to quiesce writes, copy that data to the new cluster.
