---
title: Reliability in Azure Kubernetes Service (AKS)
description: Find out about resiliency in Azure Kubernetes Service (AKS), including transient faults, availability zones, multi-region support, backups, and service maintenance.
author: schaffererin
ms.author: schaffererin
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-kubernetes-service
ms.date: 03/18/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how AKS works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Kubernetes Service (AKS)

[Azure Kubernetes Service (AKS)](/azure/aks/what-is-aks) is a managed container orchestration service that simplifies the deployment, management, and operations of Kubernetes.

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

This article describes how to make Azure Kubernetes Service (AKS) resilient to a variety of potential outages and problems, including transient faults, availability zone outages, and region outages. It also describes how you can use backups to recover from other types of problems, and highlights some key information about the Azure Kubernetes Service (AKS) service level agreement (SLA).

## Production deployment recommendations

For recommendations about how to deploy reliable production workloads in AKS, see the following articles:

- [Deployment and cluster reliability best practices for AKS](/azure/aks/best-practices-app-cluster-reliability)
- [High availability (HA) and disaster recovery (DR) overview for AKS](/azure/aks/ha-dr-overview)
- [Zone resiliency considerations for AKS](/azure/aks/aks-zone-resiliency)

## Reliability architecture overview

When you create an AKS cluster, the Azure platform automatically creates and configures:

- A [control plane](/azure/aks/core-aks-concepts#control-plane) that has the API server, etcd, the scheduler, and other pods that are required to manage your workload.

- A [system node pool](/azure/aks/use-system-pools) to your subscription that hosts your add-ons and other pods that run in the *kube-system* namespace.

After this initial node pool setup is complete, you can [add or delete node pools](/azure/aks/create-node-pools) for your own user workloads. AKS doesn't manage node pools for reliability, and you must ensure that your workloads are resilient to infrastructure failures.

:::image type="content" source="./media/reliability-aks/control-plane-and-nodes.svg" alt-text="Diagram that shows the Kubernetes control plane and node components, including the system node pool and user node pools." border="false":::

Resiliency is a shared responsibility between you and Microsoft. As a compute service, AKS manages some aspects of your cluster's reliability, but you're responsible for managing other aspects.

- **Microsoft manages** the control plane and other managed components of AKS.

- **It's your responsibility to**:

   - *Define how components, including node pools and load balancers that attach to services, should be configured to meet your reliability requirements.* After you define the components, Microsoft then deploys and manages them on your behalf.

   - *Manage any components outside of the AKS cluster, including storage and databases.* Verify that these components meet your reliability requirements. When you deploy your workloads, ensure that other Azure components are also configured for resiliency by following the best practices for those services.

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

When you use AKS, transient faults can occur because of various reasons, including application crashes, pod scaling and balancing operations, node patching, and temporary infrastructure failures such as hardware or networking problems.

It's impossible to eliminate all transient faults, so clients that access your AKS-hosted applications should be prepared to retry failed requests and follow other transient fault handling recommendations. You can minimize the likelihood of transient faults and avoid or mitigate the downtime they might cause by following Kubernetes and Azure best practices in your deployment.

> [!div class="checklist"]
> - Set pod disruption budgets (PDBs) in your pod YAML to specify how many pods you need to have in a `Ready` state at a given time. When you set PDBs, AKS ensures a minimum availability of replicas when it runs operations to cordon and drain the nodes. If a PDB can't be satisfied during processes like upgrades, the pod continues to function and the operation might fail. For more information, see [PDBs](/azure/aks/best-practices-app-cluster-reliability#pod-disruption-budgets-pdbs).
> - Use `maxUnavailable` to define the maximum number of replicas that can become unavailable at a given time. For example, when you perform a rolling restart, AKS ensures that no more than the `maxUnavailable` number of pods are churned at a given time. For more information, see [maxUnavailable](/azure/aks/best-practices-app-cluster-reliability#maxunavailable).
> - Follow deployment best practices. Pod replicas can also fail because of application problems. For more information, see [Deployment-level best practices](/azure/aks/best-practices-app-cluster-reliability#deployment-level-best-practices) for AKS cluster reliability.

> [!NOTE]
> If you want AKS to validate your deployments for adherence to best practices and provide blocking or warning notifications, you can use [deployment safeguards](/azure/aks/deployment-safeguards). Deployment safeguards are a managed offering that helps enforce product best practices before your code gets deployed to the cluster.

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

When you deploy an AKS cluster into a region that supports availability zones, different components require different types of configuration.

The AKS control plane is zone resilient by default. If a zone fails, the control plane doesn't require any configuration or management to achieve resiliency. However, control plane resiliency isn't sufficient for your cluster to remain operational when a zone fails. For the system node pool and any user node pools that you deploy, you must enable availability zone support to help ensure that your workloads are resilient to availability zone failures.

### Requirements

**Region support:** You can deploy zone-resilient AKS clusters into any region that supports availability zones.

### Considerations

To enhance the reliability and resiliency of AKS production workloads in a region, you need to configure AKS for zone redundancy by making the following configurations:

- **Deploy multiple replicas.** Kubernetes spreads your pods across nodes based on node labels. To spread your workload across zones, you need to deploy multiple replicas of your pod. For instance, if you configure the node pool with three zones but only deploy a single replica of your pod, your deployment isn't zone resilient.

- **Enable automatic scaling.** Kubernetes node pools provide manual and automatic scaling options. By using manual scaling, you can add or delete nodes as needed, and pending pods wait until you scale up a node pool. AKS-managed scaling uses the [cluster autoscaler](/azure/aks/cluster-autoscaler) or [node autoprovisioning (NAP)](/azure/aks/node-autoprovision). AKS scales the node pool up or down based on the pod's requirements within your subscription's SKU quota and capacity. This method helps ensure that your pods are scheduled on available nodes in the availability zones.

- **Set pod topology constraints.** Use pod topology spread constraints to control how pods are spread across different nodes or zones. Constraints help you achieve HA, resiliency, and efficient resource usage. If you prefer to spread pods strictly across zones, you can set constraints to force a pod into a pending state to maintain the balance of pods across zones. For more information, see [Pod topology spread constraints](/azure/aks/best-practices-app-cluster-reliability#pod-topology-spread-constraints).

- **Configure zone-resilient networking.** If your pods serve external traffic, configure your cluster network architecture by using services like [Azure Application Gateway](../application-gateway/overview-v2.md), [Azure Load Balancer](../load-balancer/load-balancer-overview.md), or [Azure Front Door](../frontdoor/front-door-overview.md).

- **Ensure that dependencies are zone resilient.** Most AKS applications use other services for storage, security, or networking. Make sure that you review the zone resiliency recommendations for those services.

### Cost

There's no extra charge to enable availability zone support in AKS. You pay for the virtual machines (VMs) and other resources that you deploy in the availability zones.

### Configure availability zone support

- **Create a new AKS cluster that has availability zone support:** To configure availability zone support, see [Create an Azure Kubernetes Service (AKS) cluster that uses availability zones](/azure/aks/availability-zones).
- **Migration:** You can't enable availability zone support after you create a cluster. Instead, you need to create a new cluster that has availability zone support enabled and delete the existing cluster.
- **Disable availability zone support:** You can't disable availability zone support after you create a cluster. Instead, you need to create a new cluster that has availability zone support disabled and delete the existing cluster.

### Behavior when all zones are healthy

This section describes what to expect when AKS clusters are configured for availability zone support and all availability zones are operational.

- **Traffic routing between zones:** When you deploy an AKS cluster that uses availability zones, it's important to ensure that your networking components are also zone resilient. Depending on the load balancers and other networking components that you use, you might need to explicitly configure components to route traffic to the correct nodes in the correct zones and to respond to zone outages. For more information, see [Zone resiliency considerations for AKS](/azure/aks/aks-zone-resiliency).

- **Data replication between zones:** If you run a stateless workload, you should use managed Azure services, such [Azure databases](https://azure.microsoft.com/products/category/databases/), [Azure Managed Redis](https://azure.microsoft.com/products/managed-redis), or [Azure Storage](https://azure.microsoft.com/products/category/storage/) to store the application data. You can use these services to help ensure that your traffic can be moved across nodes and zones without risking data loss or affecting the user experience. You can use Kubernetes [deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), [services](https://kubernetes.io/docs/concepts/services-networking/service/), and [health probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) to manage stateless pods and ensure even distribution across zones.

   If you need to store state within your cluster by using Azure disks, use Azure zone-redundant storage to help ensure that your data is replicated across multiple availability zones. For more information, see [Choose the right disk type based on application needs](/azure/aks/aks-zone-resiliency#make-your-storage-disk-decision).

### Behavior during a zone failure

This section describes what to expect when an availability zone outage occurs while AKS clusters are configured with availability zone support.

- **Detection and response:** When a zone outage occurs, the control plane automatically fails over. If your node pools use availability zones and follow [zone resiliency best practices](#considerations), you can expect AKS to bring up nodes and replicas in the zones that are operational. AKS does this task automatically when you use managed solutions like cluster autoscaler or NAP. Without autoscaling, nodes and replicas remain in the *Pending* state and wait for manual intervention to scale up the node pool. 

   AKS also attempts to rebalance the pods across the healthy zones. If you choose to manually scale your node pool in a zone-down scenario, your pods might remain in the *Pending* state when there are no nodes available in the healthy zones. Scaling out in the remaining zones is also subject to the availability of quota and capacity for the VM SKU that you use.

- **Notification**: [!INCLUDE [Availability zone down notification partial bullet (Service Health and Resource Health)](./includes/reliability-availability-zone-down-notification-service-resource-partial-include.md)]

   You can also use your node or pod health metrics to monitor the health of your nodes and pods.

- **Active requests:** Any active requests might experience disruptions. Some requests can fail, and latency might increase while your workload fails over to another zone.

- **Expected data loss:** If you store state within your cluster by using Azure disks, and you use zone-redundant storage, then a zone failure isn't expected to cause any data loss.

- **Expected downtime:** If you correctly configure zone resiliency for your cluster and pods, then a zone failure isn't expected to cause downtime for your AKS workload.

- **Traffic rerouting:** Load balancers reroute new incoming requests to pods that run on healthy nodes.

For more information, see [Zone resiliency considerations for AKS](/azure/aks/aks-zone-resiliency).

### Zone recovery

When the availability zone recovers, failback behavior depends on the component:

- **Control plane:** AKS automatically restores control plane operations across all availability zones. No manual intervention is required.

- **Node pools and nodes:** Immediately after failback, nodes remain in the previously healthy zones and aren't restored in the recovered zone. However, the next time you perform a node-scaling operation, such as when you scale out your node pool, the node pool can create nodes in the recovered zone.

- **Pods:** Immediately after failback, pods continue to run on the nodes that they currently run on. When new pods are created or existing pods are re-created, they're eligible to use nodes in the recovered zone.

- **Storage:** Any storage attached to pods recovers based on [how zone-redundant storage works](/azure/storage/common/storage-redundancy).

### Test for zone failures

You can test your resiliency to availability zone failures by using the following methods:

- [Cordon and drain nodes in a single availability zone](/azure/aks/aks-zone-resiliency#method-1-cordon-and-drain-nodes-in-a-single-az)
- [Simulate an availability zone failure by using Azure Chaos Studio](/azure/aks/aks-zone-resiliency#method-2-simulate-an-az-failure-using-azure-chaos-studio)

## Resilience to region-wide failures

AKS clusters are single-region resources. If the region is unavailable, your AKS cluster is also unavailable.

### Custom multi-region solutions for resiliency

If you need to deploy your Kubernetes workload to multiple Azure regions, you have two options to manage the orchestration of these clusters.

- Use [Azure Kubernetes Fleet Manager](/azure/kubernetes-fleet/overview) if you want a simpler, managed experience. By using Azure Kubernetes Fleet Manager, you can:

  - Manage a set of AKS clusters as a single unit, and those clusters can be distributed across multiple Azure regions.

  - Automate specific aspects of cluster management, such as cluster and node image upgrades.

  - Use traffic distribution capabilities to spread traffic across the clusters and automatically fail over if a region is unavailable.

- Orchestrate failover by using a manual active-active or active-passive deployment model if your workload requires more nuanced control over the different components of interregional failovers. For more information, see [HA and DR overview for AKS](/azure/aks/ha-dr-overview).

## Backup and restore

Azure Backup has an extension that you can use to back up AKS cluster resources and persistent volumes that attach to the cluster. The Backup vault communicates with the AKS cluster through the extension to perform backup and restore operations.

If your AKS cluster is in a [region that's paired](./regions-paired.md), you can configure backups to be stored in geo-redundant storage. You can restore geo-redundant backups into the paired region.

For more information, see the following articles:

- [What is Azure Kubernetes Service backup?](/azure/backup/azure-kubernetes-service-backup-overview)
- [Back up AKS by using Azure Backup](/azure/backup/azure-kubernetes-service-cluster-backup)

[!INCLUDE [Backups include ](includes/reliability-backups-include.md)]

Strive to use stateless clusters that minimize the need for backup. Store data in external storage systems and databases instead of within your cluster.

## Resilience to service maintenance

AKS performs maintenance on your cluster, including updates to the cluster and node images. To ensure that Kubernetes maintains the minimum number of pod instances required to serve your production traffic even during upgrades, you should configure your pods to use pod disruption budgets.

To reduce service disruptions during critical time periods, AKS provides controls so that you can specify planned maintenance times. To learn more, see [Use planned maintenance to schedule and control upgrades for your Azure Kubernetes Service cluster](/azure/aks/planned-maintenance).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

AKS provides three [pricing tiers for cluster management](/azure/aks/free-standard-pricing-tiers): **Free**, **Standard**, and **Premium**. The Free tier enables you to use AKS to test your workloads. The Standard and Premium tiers are designed for production workloads. When you deploy an AKS cluster that has availability zones enabled, the uptime percentage defined in the SLA increases. However, the SLA applies only if you deploy a cluster in the Standard or Premium pricing tier.

## Related content

- [Reliability in Azure](./overview.md)
