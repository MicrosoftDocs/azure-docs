---
title: Migrate to Azure Kubernetes Service (AKS)
description: Migrate to Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 02/25/2020
ms.custom: mvc
---

# Migrate to Azure Kubernetes Service (AKS)

This article helps you plan and execute a successful migration to Azure Kubernetes Service (AKS). To help you make key decisions, this guide provides details for the current recommended configuration for AKS. This article doesn't cover every scenario, and where appropriate, the article contains links to more detailed information for planning a successful migration.

This document can be used to help support the following scenarios:

* Migrating an AKS Cluster backed by [Availability Sets](https://docs.microsoft.com/azure/virtual-machines/windows/tutorial-availability-sets) to [Virtual Machine Scale Sets](https://docs.microsoft.com/azure/virtual-machine-scale-sets/overview)
* Migrating an AKS cluster to use a [Standard SKU load balancer](https://docs.microsoft.com/azure/aks/load-balancer-standard)
* Migrating from [Azure Container Service (ACS) - retiring January 31, 2020](https://azure.microsoft.com/updates/azure-container-service-will-retire-on-january-31-2020/) to AKS
* Migrating from [AKS engine](https://docs.microsoft.com/azure-stack/user/azure-stack-kubernetes-aks-engine-overview?view=azs-1908) to AKS
* Migrating from non-Azure based Kubernetes clusters to AKS

When migrating, ensure your target Kubernetes version is within the supported window for AKS. If using an older version, it may not be within the supported range and require upgrading versions to be supported by AKS. See [AKS supported Kubernetes versions](https://docs.microsoft.com/azure/aks/supported-kubernetes-versions) for more information.

If you're migrating to a newer version of Kubernetes, review [Kubernetes version and version skew support policy](https://kubernetes.io/docs/setup/release/version-skew-policy/#supported-versions).

Several open-source tools can help with your migration, depending on your scenario:

* [Velero](https://velero.io/) (Requires Kubernetes 1.7+)
* [Azure Kube CLI extension](https://github.com/yaron2/azure-kube-cli)
* [ReShifter](https://github.com/mhausenblas/reshifter)

In this article we will summarize migration details for:

> [!div class="checklist"]
> * AKS with Standard Load Balancer and Virtual Machine Scale Sets
> * Existing attached Azure Services
> * Ensure valid quotas
> * High Availability and business continuity
> * Considerations for stateless applications
> * Considerations for stateful applications
> * Deployment of your cluster configuration

## AKS with Standard Load Balancer and Virtual Machine Scale Sets

AKS is a managed service offering unique capabilities with lower management overhead. As a result of being a managed service, you must select from a set of [regions](https://docs.microsoft.com/azure/aks/quotas-skus-regions) which AKS supports. The transition from your existing cluster to AKS may require modifying your existing applications so they remain healthy on the AKS managed control plane.

We recommend using AKS clusters backed by [Virtual Machine Scale Sets](https://docs.microsoft.com/azure/virtual-machine-scale-sets) and the [Azure Standard Load Balancer](https://docs.microsoft.com/azure/aks/load-balancer-standard) to ensure you get features such as [multiple node pools](https://docs.microsoft.com/azure/aks/use-multiple-node-pools), [Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview), [Authorized IP ranges](https://docs.microsoft.com/azure/aks/api-server-authorized-ip-ranges), [Cluster Autoscaler](https://docs.microsoft.com/azure/aks/cluster-autoscaler), [Azure Policy for AKS](https://docs.microsoft.com/azure/governance/policy/concepts/rego-for-aks), and other new features as they are released.

AKS clusters backed by [Virtual Machine Availability Sets](https://docs.microsoft.com/azure/virtual-machine-scale-sets/availability#availability-sets) lack support for many of these features.

The following example creates an AKS cluster with single node pool backed by a virtual machine scale set. It uses a standard load balancer. It also enables the cluster autoscaler on the node pool for the cluster and sets a minimum of *1* and maximum of *3* nodes:

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

When migrating clusters you may have attached external Azure services. These do not require resource recreation, but they will require updating connections from previous to new clusters to maintain functionality.

* Azure Container Registry
* Log Analytics
* Application Insights
* Traffic Manager
* Storage Account
* External Databases

## Ensure valid quotas

Because additional virtual machines will be deployed into your subscription during migration, you should verify that your quotas and limits are sufficient for these resources. You may need to request an increase in [vCPU quota](https://docs.microsoft.com/azure/azure-portal/supportability/per-vm-quota-requests).

You may need to request an increase for [Network quotas](https://docs.microsoft.com/azure/azure-portal/supportability/networking-quota-requests) to ensure you don't exhaust IPs. See [networking and IP ranges for AKS](https://docs.microsoft.com/azure/aks/configure-kubenet) for additional information.

For more information, see [Azure subscription and service limits](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits). To check your current quotas, in the Azure portal, go to the [subscriptions blade](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade), select your subscription, and then select **Usage + quotas**.

## High Availability and Business Continuity

If your application cannot handle downtime, you will need to follow best practices for high availability migration scenarios.  Best practices for complex business continuity planning, disaster recovery, and maximizing uptime are beyond the scope of this document.  Read more about [Best practices for business continuity and disaster recovery in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/operator-best-practices-multi-region) to learn more.

For complex applications, you'll typically migrate over time rather than all at once. That means that the old and new environments might need to communicate over the network. Applications that previously used `ClusterIP` services to communicate might need to be exposed as type `LoadBalancer` and be secured appropriately.

To complete the migration, you'll want to point clients to the new services that are running on AKS. We recommend that you redirect traffic by updating DNS to point to the Load Balancer that sits in front of your AKS cluster.

[Azure Traffic Manager](https://docs.microsoft.com/azure/traffic-manager/) can direct customers to the desired Kubernetes cluster and application instance.  Traffic Manager is a DNS-based traffic load balancer that can distribute network traffic across regions.  For the best performance and redundancy, direct all application traffic through Traffic Manager before it goes to your AKS cluster.  In a multicluster deployment, customers should connect to a Traffic Manager DNS name that points to the services on each AKS cluster. Define these services by using Traffic Manager endpoints. Each endpoint is the *service load balancer IP*. Use this configuration to direct network traffic from the Traffic Manager endpoint in one region to the endpoint in a different region.

![AKS with Traffic Manager](media/operator-best-practices-bc-dr/aks-azure-traffic-manager.png)

[Azure Front Door Service](https://docs.microsoft.com/azure/frontdoor/front-door-overview) is another option for routing traffic for AKS clusters.  Azure Front Door Service enables you to define, manage, and monitor the global routing for your web traffic by optimizing for best performance and instant global failover for high availability. 

### Considerations for stateless applications

Stateless application migration is the most straightforward case. Apply your resource definitions (YAML or Helm) to the new cluster, make sure everything works as expected, and redirect traffic to activate your new cluster.

### Considerations for stateful applications

Carefully plan your migration of stateful applications to avoid data loss or unexpected downtime.

If you use Azure Files, you can mount the file share as a volume into the new cluster:
* [Mount Static Azure Files as a Volume](https://docs.microsoft.com/azure/aks/azure-files-volume#mount-the-file-share-as-a-volume)

If you use Azure Managed Disks, you can only mount the disk if unattached to any VM:
* [Mount Static Azure Disk as a Volume](https://docs.microsoft.com/azure/aks/azure-disk-volume#mount-disk-as-volume)

If neither of those approaches work, you can use a backup and restore options:
* [Velero on Azure](https://github.com/vmware-tanzu/velero-plugin-for-microsoft-azure/blob/master/README.md)

#### Azure Files

Unlike disks, Azure Files can be mounted to multiple hosts concurrently. In your AKS cluster, Azure and Kubernetes don't prevent you from creating a pod that your ACS cluster still uses. To prevent data loss and unexpected behavior, ensure that the clusters don't write to the same files at the same time.

If your application can host multiple replicas that point to the same file share, follow the stateless migration steps and deploy your YAML definitions to your new cluster. If not, one possible migration approach involves the following steps:

* Validate your application is working correctly.
* Point your live traffic to your new AKS cluster.
* Disconnect the old cluster.

If you want to start with an empty share and make a copy of the source data, you can use the [`az storage file copy`](https://docs.microsoft.com/cli/azure/storage/file/copy?view=azure-cli-latest) commands to migrate your data.


#### Migrating persistent volumes

If you're migrating existing persistent volumes to AKS, you'll generally follow these steps:

* Quiesce writes to the application. (This step is optional and requires downtime.)
* Take snapshots of the disks.
* Create new managed disks from the snapshots.
* Create persistent volumes in AKS.
* Update pod specifications to [use existing volumes](https://docs.microsoft.com/azure/aks/azure-disk-volume) rather than PersistentVolumeClaims (static provisioning).
* Deploy your application to AKS.
* Validate your application is working correctly.
* Point your live traffic to your new AKS cluster.

> [!IMPORTANT]
> If you choose not to quiesce writes, you'll need to replicate data to the new deployment. Otherwise you'll miss the data that was written after you took the disk snapshots.

Some open-source tools can help you create managed disks and migrate volumes between Kubernetes clusters:

* [Azure CLI Disk Copy extension](https://github.com/noelbundick/azure-cli-disk-copy-extension) copies and converts disks across resource groups and Azure regions.
* [Azure Kube CLI extension](https://github.com/yaron2/azure-kube-cli) enumerates ACS Kubernetes volumes and migrates them to an AKS cluster.


### Deployment of your cluster configuration

We recommend that you use your existing Continuous Integration (CI) and Continuous Deliver (CD) pipeline to deploy a known-good configuration to AKS. You can use Azure Pipelines to [build and deploy your applications to AKS](https://docs.microsoft.com/azure/devops/pipelines/ecosystems/kubernetes/aks-template?view=azure-devops). Clone your existing deployment tasks and ensure that `kubeconfig` points to the new AKS cluster.

If that's not possible, export resource definitions from your existing Kubernetes cluster and then apply them to AKS. You can use `kubectl` to export objects.

```console
kubectl get deployment -o=yaml --export > deployments.yaml
```

### Moving existing resources to another region

You may want to move your AKS cluster to a [different region supported by AKS][region-availability]. We recommend that you create a new cluster in the other region then deploy your resources and applications to your new cluster. In addition, if you have any services such as [Azure Dev Spaces][azure-dev-spaces] running on your AKS cluster, you will also need to install and configure those services on your cluster in the new region.


In this article we summarized migration details for:

> [!div class="checklist"]
> * AKS with Standard Load Balancer and Virtual Machine Scale Sets
> * Existing attached Azure Services
> * Ensure valid quotas
> * High Availability and business continuity
> * Considerations for stateless applications
> * Considerations for stateful applications
> * Deployment of your cluster configuration


[region-availability]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service
[azure-dev-spaces]: https://docs.microsoft.com/azure/dev-spaces/