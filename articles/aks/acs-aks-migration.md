---
title: Migrate to Azure Kubernetes Service (AKS)
description: Migrate to Azure Kubernetes Service (AKS).
services: container-service
author: mlearned

ms.service: container-service
ms.topic: article
ms.date: 11/07/2018
ms.author: mlearned
ms.custom: mvc
---

# Migrate to Azure Kubernetes Service (AKS)

This article helps you plan and execute a successful migration to Azure Kubernetes Service (AKS). To help you make key decisions, this guide details the differences between non-AKS and AKS clusters and provides an overview of the migration process. This article doesn't cover every scenario, and where appropriate, the article contains links to more detailed information for planning a succesful migration.

If you're migrating to a newer version of Kubernetes, review [Kubernetes version and version skew support policy](https://kubernetes.io/docs/setup/release/version-skew-policy/#supported-versions) and [AKS supported Kubernetes versions](https://docs.microsoft.com/en-us/azure/aks/supported-kubernetes-versions) to understand the Kubernetes and AKS versioning strategies.

Details for business continuity planning, disaster recovery, and maximizing uptime are beyond the scope of this document.  Read more about [Best practices for business continuity and disaster recovery in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/operator-best-practices-multi-region) to learn more.

The scenarios where you want to utilize this document are:

* Migrating AKS Cluster using Availability Sets to Virtual Machine Scale Sets
* Migrating AKS cluster to use a [Standard SKU load balancer](https://docs.microsoft.com/azure/aks/load-balancer-standard)
* Migrating from Azure Container Service (ACS) to AKS
* Migrating from AKS Engine to AKS

In this article we will cover:

> [!div class="checklist"]
> * Considerations for migrating from Availablity Sets and Virtual Machine Scale Sets
> * Differences between AKS clusters and technologies such as ACS
> * Considerations for stateful and stateless applications
> * Considerations for different types of Azure storage

## Differences between Kubernetes clusters

AKS clusters and non-AKS Kubernetes clusters provide different capabilities and options.  For example, AKS supports a limited set of [regions](https://docs.microsoft.com/azure/aks/quotas-skus-regions). 

AKS is a managed service with a hosted Kubernetes control plane. You might need to modify your applications if you've previously modified the configuration of your ACS masters.

The following table provides details on the important technology differences.

| Cluster type | Managed Disks | [Multiple Node Pools](https://docs.microsoft.com/azure/aks/use-multiple-node-pools) | Standard SKU load balancer | Windows Server nodes|
|-----------------------------------------|----------|
| AKS - [VM Scale Sets](https://docs.microsoft.com/azure/virtual-machine-scale-sets) | Yes | Yes | Yes | Yes (preview)
| AKS - [VM Availability Sets](https://docs.microsoft.com/azure/virtual-machine-scale-sets/availability#availability-sets) | Yes | No | No | Yes (preview)
| [ACS](https://docs.microsoft.com/azure/container-service/) | No | No | No |
| [AKS engine](https://docs.microsoft.com/azure-stack/user/azure-stack-kubernetes-aks-engine-overview?view=azs-1908) | ? | ? | ? | ? | Yes 


## Existing Azure attached Services

When migrating clusters, the following Azure resources should not need additional migration work. You will have to ensure they have the proper connectivtity with the new AKS cluster.

* Azure Container Registry
* Log Analytics
* Application Insights
* Traffic Manager
* Storage Account
* External Databases

## Migration considerations

### Agent pools

Because additional virtual machines will be deployed into your subscription during migration, you should verify that your quotas and limits are sufficient for these resources. 

For more information, see [Azure subscription and service limits](https://docs.microsoft.com/azure/azure-subscription-service-limits). To check your current quotas, in the Azure portal, go to the [subscriptions blade](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade), select your subscription, and then select **Usage + quotas**.

### Networking

For complex applications, you'll typically migrate over time rather than all at once. That means that the old and new environments might need to communicate over the network. Applications that previously used `ClusterIP` services to communicate might need to be exposed as type `LoadBalancer` and be secured appropriately.

To complete the migration, you'll want to point clients to the new services that are running on AKS. We recommend that you redirect traffic by updating DNS to point to the Load Balancer that sits in front of your AKS cluster.

[Azure Traffic Manager](https://docs.microsoft.com/azure/traffic-manager/) can direct customers to the desired Kubernetes cluster and application instance.  Traffic Manager is a DNS-based traffic load balancer that can distribute network traffic across regions.  For the best performance and redundancy, direct all application traffic through Traffic Manager before it goes to your AKS cluster.

![AKS with Traffic Manager](media/operator-best-practices-bc-dr/aks-azure-traffic-manager.png)

In a multicluster deployment, customers should connect to a Traffic Manager DNS name that points to the services on each AKS cluster. Define these services by using Traffic Manager endpoints. Each endpoint is the *service load balancer IP*. Use this configuration to direct network traffic from the Traffic Manager endpoint in one region to the endpoint in a different region.

### Stateless applications

Stateless application migration is the most straightforward case. Apply your resource definitions (YAML or Helm) to the new cluster, make sure everything works as expected, and redirect traffic to activate your new cluster.

### Stateful applications

Carefully plan your migration of stateful applications to avoid data loss or unexpected downtime.

If you use Azure Files, you can mount the file share as a volume into the new cluster:
* [Mount Static Azure Files as a Volume](https://docs.microsoft.com/en-us/azure/aks/azure-files-volume#mount-the-file-share-as-a-volume)

If you use Azure Managed Disks, you can only mount the disk if unattached to any VM:
* [Mount Static Azure Disk as a Volume](https://docs.microsoft.com/en-us/azure/aks/azure-disk-volume#mount-disk-as-volume)

If neither of those approaches work, you can use a backup and restore options:
* [Velero on Azure](https://github.com/heptio/velero/blob/master/site/docs/master/azure-config.md)

__TODO__ Could use better integration with the sections below it.


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

We recommend that you use your existing Continuous Integration (CI) and Continuous Deliver (CD) pipeline to deploy a known-good configuration to AKS. Clone your existing deployment tasks and ensure that `kubeconfig` points to the new AKS cluster.

If that's not possible, export resource definitions from your existing Kubernetes cluster and then apply them to AKS. You can use `kubectl` to export objects.

```console
kubectl get deployment -o=yaml --export > deployments.yaml
```

Several open-source tools can help, depending on your deployment needs:

* [Velero](https://velero.io/) (Requires Kubernetes 1.7+)
* [Azure Kube CLI extension](https://github.com/yaron2/azure-kube-cli)
* [ReShifter](https://github.com/mhausenblas/reshifter)

In this article we covered:

> [!div class="checklist"]
> * Considerations for migrating from Availablity Sets and Virtual Machine Scale Sets
> * Differences between AKS clusters and technologies such ACS
> * Considerations for stateful and stateless applications
> * Considerations for different types of Azure storage