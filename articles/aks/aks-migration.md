---
title: Migrate to Azure Kubernetes Service (AKS)
description: Migrate to Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 03/25/2021
ms.custom: mvc, devx-track-azurecli
---

# Migrate to Azure Kubernetes Service (AKS)

To help you plan and execute a successful migration to Azure Kubernetes Service (AKS), this guide provides details for the current recommended AKS configuration. While this article doesn't cover every scenario, it contains links to more detailed information for planning a successful migration.

This document helps support the following scenarios:

* Containerizing certain applications and migrating them to AKS using [Azure Migrate](../migrate/migrate-services-overview.md).
* Migrating an AKS Cluster backed by [Availability Sets](../virtual-machines/windows/tutorial-availability-sets.md) to [Virtual Machine Scale Sets](../virtual-machine-scale-sets/overview.md).
* Migrating an AKS cluster to use a [Standard SKU load balancer](./load-balancer-standard.md).
* Migrating from [Azure Container Service (ACS) - retiring January 31, 2020](https://azure.microsoft.com/updates/azure-container-service-will-retire-on-january-31-2020/) to AKS.
* Migrating from [AKS engine](/azure-stack/user/azure-stack-kubernetes-aks-engine-overview) to AKS.
* Migrating from non-Azure based Kubernetes clusters to AKS.
* Moving existing resources to a different region.

When migrating, ensure your target Kubernetes version is within the supported window for AKS. Older versions may not be within the supported range and will require a version upgrade to be supported by AKS. For more information, see [AKS supported Kubernetes versions](./supported-kubernetes-versions.md).

If you're migrating to a newer version of Kubernetes, review [Kubernetes version and version skew support policy](https://kubernetes.io/docs/setup/release/version-skew-policy/#supported-versions).

Several open-source tools can help with your migration, depending on your scenario:

* [Velero](https://velero.io/) (Requires Kubernetes 1.7+)
* [Azure Kube CLI extension](https://github.com/yaron2/azure-kube-cli)


In this article we will summarize migration details for:

> [!div class="checklist"]
> * Containerizing applications through Azure Migrate 
> * AKS with Standard Load Balancer and Virtual Machine Scale Sets
> * Existing attached Azure Services
> * Ensure valid quotas
> * High Availability and business continuity
> * Considerations for stateless applications
> * Considerations for stateful applications
> * Deployment of your cluster configuration

## Use Azure Migrate to migrate your applications to AKS

Azure Migrate offers a unified platform to assess and migrate to Azure on-premises servers, infrastructure, applications, and data. For AKS, you can use Azure Migrate for the following tasks:

* [Containerize ASP.NET applications and migrate to AKS](../migrate/tutorial-app-containerization-aspnet-kubernetes.md)
* [Containerize Java web applications and migrate to AKS](../migrate/tutorial-app-containerization-java-kubernetes.md)

## AKS with Standard Load Balancer and Virtual Machine Scale Sets

AKS is a managed service offering unique capabilities with lower management overhead. Since AKS is a managed service, you must select from a set of [regions](./quotas-skus-regions.md) which AKS supports. You may need to modify your existing applications to keep them healthy on the AKS-managed control plane during the transition from your existing cluster to AKS.

We recommend using AKS clusters backed by [Virtual Machine Scale Sets](../virtual-machine-scale-sets/index.yml) and the [Azure Standard Load Balancer](./load-balancer-standard.md) to ensure you get features such as:
* [Multiple node pools](./use-multiple-node-pools.md),
* [Availability Zones](../availability-zones/az-overview.md),
* [Authorized IP ranges](./api-server-authorized-ip-ranges.md),
* [Cluster Autoscaler](./cluster-autoscaler.md),
* [Azure Policy for AKS](../governance/policy/concepts/policy-for-kubernetes.md), and
* Other new features as they are released.

AKS clusters backed by [Virtual Machine Availability Sets](../virtual-machines/availability.md#availability-sets) lack support for many of these features.

The following example creates an AKS cluster with single node pool backed by a virtual machine (VM) scale set. The cluster:
* Uses a standard load balancer. 
* Enables the cluster autoscaler on the node pool for the cluster.
* Sets a minimum of *1* and maximum of *3* nodes.

```azurecli-interactive
# First create a resource group
az group create --name myResourceGroup --location eastus

# Now create the AKS cluster and enable the cluster autoscaler
az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --node-count 1 \
  --vm-set-type VirtualMachineScaleSets \
  --load-balancer-sku standard \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 3
```

## Existing attached Azure Services

When migrating clusters, you may have attached external Azure services. While the following services don't require resource recreation, they will require updating connections from previous to new clusters to maintain functionality.

* Azure Container Registry
* Log Analytics
* Application Insights
* Traffic Manager
* Storage Account
* External Databases

## Ensure valid quotas

Since other VMs will be deployed into your subscription during migration, you should verify that your quotas and limits are sufficient for these resources. If necessary, request an increase in [vCPU quota](../azure-portal/supportability/per-vm-quota-requests.md).

You may need to request an increase for [Network quotas](../azure-portal/supportability/networking-quota-requests.md) to ensure you don't exhaust IPs. For more information, see [networking and IP ranges for AKS](./configure-kubenet.md).

For more information, see [Azure subscription and service limits](../azure-resource-manager/management/azure-subscription-service-limits.md). To check your current quotas, in the Azure portal, go to the [subscriptions blade](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade), select your subscription, and then select **Usage + quotas**.

## High Availability and Business Continuity

If your application can't handle downtime, you will need to follow best practices for high availability migration scenarios. Read more about [Best practices for complex business continuity planning, disaster recovery, and maximizing uptime in Azure Kubernetes Service (AKS)](./operator-best-practices-multi-region.md).

For complex applications, you'll typically migrate over time rather than all at once, meaning the old and new environments might need to communicate over the network. Applications previously using `ClusterIP` services to communicate might need to be exposed as type `LoadBalancer` and be secured appropriately.

To complete the migration, you'll want to point clients to the new services that are running on AKS. We recommend that you redirect traffic by updating DNS to point to the Load Balancer sitting in front of your AKS cluster.

[Azure Traffic Manager](../traffic-manager/index.yml) can direct customers to the desired Kubernetes cluster and application instance. Traffic Manager is a DNS-based traffic load balancer that can distribute network traffic across regions. For the best performance and redundancy, direct all application traffic through Traffic Manager before it goes to your AKS cluster. 

In a multi-cluster deployment, customers should connect to a Traffic Manager DNS name that points to the services on each AKS cluster. Define these services by using Traffic Manager endpoints. Each endpoint is the *service load balancer IP*. Use this configuration to direct network traffic from the Traffic Manager endpoint in one region to the endpoint in a different region.

![AKS with Traffic Manager](media/operator-best-practices-bc-dr/aks-azure-traffic-manager.png)

[Azure Front Door Service](../frontdoor/front-door-overview.md) is another option for routing traffic for AKS clusters. With Azure Front Door Service, you can define, manage, and monitor the global routing for your web traffic by optimizing for best performance and instant global failover for high availability. 

### Considerations for stateless applications

Stateless application migration is the most straightforward case:
1. Apply your resource definitions (YAML or Helm) to the new cluster.
1. Ensure everything works as expected.
1. Redirect traffic to activate your new cluster.

### Considerations for stateful applications

Carefully plan your migration of stateful applications to avoid data loss or unexpected downtime.

* If you use Azure Files, you can mount the file share as a volume into the new cluster. See [Mount Static Azure Files as a Volume](./azure-files-volume.md#mount-file-share-as-a-persistent-volume).
* If you use Azure Managed Disks, you can only mount the disk if unattached to any VM. See [Mount Static Azure Disk as a Volume](./azure-disk-volume.md#mount-disk-as-a-volume).
* If neither of those approaches work, you can use a backup and restore options. See [Velero on Azure](https://github.com/vmware-tanzu/velero-plugin-for-microsoft-azure/blob/master/README.md).

#### Azure Files

Unlike disks, Azure Files can be mounted to multiple hosts concurrently. In your AKS cluster, Azure and Kubernetes don't prevent you from creating a pod that your AKS cluster still uses. To prevent data loss and unexpected behavior, ensure that the clusters don't write to the same files simultaneously.

If your application can host multiple replicas that point to the same file share, follow the stateless migration steps and deploy your YAML definitions to your new cluster. 

If not, one possible migration approach involves the following steps:

1. Validate your application is working correctly.
1. Point your live traffic to your new AKS cluster.
1. Disconnect the old cluster.

If you want to start with an empty share and make a copy of the source data, you can use the [`az storage file copy`](/cli/azure/storage/file/copy) commands to migrate your data.


#### Migrating persistent volumes

If you're migrating existing persistent volumes to AKS, you'll generally follow these steps:

1. Quiesce writes to the application. 
    * This step is optional and requires downtime.
1. Take snapshots of the disks.
1. Create new managed disks from the snapshots.
1. Create persistent volumes in AKS.
1. Update pod specifications to [use existing volumes](./azure-disk-volume.md) rather than PersistentVolumeClaims (static provisioning).
1. Deploy your application to AKS.
1. Validate your application is working correctly.
1. Point your live traffic to your new AKS cluster.

> [!IMPORTANT]
> If you choose not to quiesce writes, you'll need to replicate data to the new deployment. Otherwise you'll miss the data that was written after you took the disk snapshots.

Some open-source tools can help you create managed disks and migrate volumes between Kubernetes clusters:

* [Azure CLI Disk Copy extension](https://github.com/noelbundick/azure-cli-disk-copy-extension) copies and converts disks across resource groups and Azure regions.
* [Azure Kube CLI extension](https://github.com/yaron2/azure-kube-cli) enumerates ACS Kubernetes volumes and migrates them to an AKS cluster.


### Deployment of your cluster configuration

We recommend that you use your existing Continuous Integration (CI) and Continuous Deliver (CD) pipeline to deploy a known-good configuration to AKS. You can use Azure Pipelines to [build and deploy your applications to AKS](/azure/devops/pipelines/ecosystems/kubernetes/aks-template). Clone your existing deployment tasks and ensure that `kubeconfig` points to the new AKS cluster.

If that's not possible, export resource definitions from your existing Kubernetes cluster and then apply them to AKS. You can use `kubectl` to export objects. For example:

```console
kubectl get deployment -o yaml > deployments.yaml
```

Be sure to examine the output and remove any unnecessary live data fields.

### Moving existing resources to another region

You may want to move your AKS cluster to a [different region supported by AKS][region-availability]. We recommend that you create a new cluster in the other region, then deploy your resources and applications to your new cluster. 

In addition, if you have any services running on your AKS cluster, you will need to install and configure those services on your cluster in the new region.


In this article, we summarized migration details for:

> [!div class="checklist"]
> * AKS with Standard Load Balancer and Virtual Machine Scale Sets
> * Existing attached Azure Services
> * Ensure valid quotas
> * High Availability and business continuity
> * Considerations for stateless applications
> * Considerations for stateful applications
> * Deployment of your cluster configuration


[region-availability]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service
