---
title: Attach Azure NetApp Files datastores to Azure VMware Solution hosts
description: Learn how to create Azure NetApp Files-based NFS datastores for Azure VMware Solution hosts.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 01/29/2025
ms.custom: "references_regions, engagement-fy23"
---

# Attach Azure NetApp Files datastores to Azure VMware Solution hosts

[Azure NetApp Files](../azure-netapp-files/azure-netapp-files-introduction.md) is an enterprise-class, high-performance, metered file storage service. The service supports the most demanding enterprise file-workloads in the cloud: databases, SAP, and high-performance computing applications, with no code changes. For more information on Azure NetApp Files, see [Azure NetApp Files](../azure-netapp-files/index.yml) documentation. 

[Azure VMware Solution](./introduction.md) supports attaching Network File System (NFS) datastores as a persistent storage option. You can create NFS datastores with Azure NetApp Files volumes and attach them to clusters of your choice. You can also create virtual machines (VMs) on different Azure NetApp Files datastores for optimal cost and performance.  

By using NFS datastores backed by Azure NetApp Files, you can expand your storage instead of scaling the clusters. You can also use Azure NetApp Files volumes to replicate data from on-premises or primary VMware vSphere environments for the secondary site. 

Create your Azure VMware Solution and create Azure NetApp Files NFS volumes in the virtual network connected to it using an ExpressRoute. Ensure there's connectivity from the private cloud to the NFS volumes created. Use those volumes to create NFS datastores and attach the datastores to clusters of your choice in a private cloud. As a native integration, you need no other permissions configured via vSphere.

The following diagram demonstrates a typical architecture of Azure NetApp Files backed NFS datastores attached to an Azure VMware Solution private cloud via ExpressRoute.

:::image type="content" source="media/attach-netapp-files-to-cloud/architecture-netapp-files-nfs-datastores.png" alt-text="Diagram shows the architecture of Azure NetApp Files backed NFS datastores attached to an Azure VMware Solution private cloud." lightbox="media/attach-netapp-files-to-cloud/architecture-netapp-files-nfs-datastores.png"::: 

>[!Note]
> NFS traffic from the ESXi hosts does not traverse any NSX components. Traffic traverses the ESXi VMkernel port directly to the NFS mount via the Azure network. 

## Prerequisites

Before you begin the prerequisites, review the [Performance best practices](#performance-best-practices) section to learn about optimal performance of NFS datastores on Azure NetApp Files volumes.

1. [Deploy Azure VMware Solution](./deploy-azure-vmware-solution.md) private cloud and a dedicated virtual network connected via ExpressRoute gateway. The virtual network gateway should be configured with the Ultra performance or ErGw3Az SKU and have FastPath enabled. For more information, see [Configure networking for your VMware private cloud](tutorial-configure-networking.md) and [Network planning checklist](tutorial-network-checklist.md).
1. Create an [NFSv3 volume for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-create-volumes.md) in the same virtual network created in the previous step.
    1. Verify connectivity from the private cloud to Azure NetApp Files volume by pinging the attached target IP.
    1. Based on your performance requirements, select the correct service level needed for the Azure NetApp Files capacity pool. Select option **Azure VMware Solution Datastore** listed under the **Protocol** section.
    1. Create a volume with **Standard** [network features](../azure-netapp-files/configure-network-features.md) if available for ExpressRoute FastPath connectivity.
    1. Under the **Protocol** section, select **Azure VMware Solution Datastore** to indicate the volume is created to use as a datastore for Azure VMware Solution private cloud.
    1. If you're using [export policies](../azure-netapp-files/azure-netapp-files-configure-export-policy.md) to control access to Azure NetApp Files volumes, enable the Azure VMware private cloud IP range, not individual host IPs. Faulty hosts in a private cloud could get replaced. If the IP isn't enabled, connectivity to datastore is impacted.

## Supported regions 

Azure NetApp Files datastores for Azure VMware Solution are currently supported in the following regions:

* Australia East
* Australia Southeast
* Brazil South
* Canada Central
* Canada East
* Central India
* Central US
* East Asia
* East US
* East US 2
* France Central
* Germany West Central
* Italy North 
* Japan East
* Japan West
* North Central US
* North Europe
* Qatar Central
* South Africa North
* South Central US
* Southeast Asia
* Sweden Central
* Switzerland North
* Switzerland West
* UK South
* UK West
* US Gov Arizona
* US Gov Virginia
* West Europe 
* West US
* West US 2
* West US 3

## Supported host types

Azure NetApp Files datastores for Azure VMware Solution are currently supported in the following host types:

* AV36 
* AV36P
* AV52
* AV64

## Performance best practices

There are some important best practices to follow for optimal performance of NFS datastores on Azure NetApp Files volumes.

- Create Azure NetApp Files volumes using **Standard** network features to enable optimized connectivity from Azure VMware Solution private cloud via ExpressRoute FastPath connectivity.
- For optimized performance, choose either **UltraPerformance** gateway or **ErGw3Az** gateway, and enable [FastPath](../expressroute/expressroute-howto-linkvnet-arm.md#configure-expressroute-fastpath) from a private cloud to Azure NetApp Files volumes virtual network. View more detailed information on gateway SKUs at [About ExpressRoute virtual network gateways](../expressroute/expressroute-about-virtual-network-gateways.md).
- Based on your performance requirements, select the correct service level needed for the Azure NetApp Files capacity pool. See [Service levels for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-service-levels.md) to understand the throughput allowed per provisioned TiB for each service level. 

    >[!IMPORTANT]
    > If you've changed the Azure NetApp Files volumes performance tier after creating the volume and datastore, see [Service level change for Azure NetApp files datastore](#service-level-change-for-azure-netapp-files-datastore) to ensure that volume/datastore metadata is in sync to avoid unexpected behavior in the portal or the API due to metadata mismatch. 
    
- Create one or more volumes based on the required throughput and capacity. See [Performance considerations](../azure-netapp-files/azure-netapp-files-performance-considerations.md) for Azure NetApp Files to understand how volume size, service level, and capacity pool QoS type determines volume throughput. For assistance calculating workload capacity and performance requirements, contact your Azure VMware Solution or Azure NetApp Files field expert. The default maximum number of Azure NetApp Files datastores is 8, but it can be increased to a maximum of 256 by submitting a support ticket. To submit a support ticket, see [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).
-  Ensure that the Azure VMware Solution private cloud and the Azure NetApp Files volumes are deployed within the same [availability zone](../reliability/availability-zones-overview.md) using the [the availability zone volume placement](../azure-netapp-files/manage-availability-zone-volume-placement.md) in the same subscription. Information regarding your AVS private cloud's availability zone can be viewed from the overview pane within the AVS private cloud.
 
For performance benchmarks that Azure NetApp Files datastores deliver for VMs on Azure VMware Solution, see [Azure NetApp Files datastore performance benchmarks for Azure VMware Solution](../azure-netapp-files/performance-benchmarks-azure-vmware-solution.md).  


### Considerations for Azure NetApp Files storage with cool access

When choosing to use [Azure NetApp Files storage with cool access](../azure-netapp-files/cool-access-introduction.md) on datastores for AVS, consider the performance characteristics of your workloads. Cool access is best suited for applications and workloads that primarily involve sequential I/O operations or tolerate varying read latency. Workloads with high random I/O and latency sensitivity should avoid using cool access due to an increase in latency when reading data from the cool tier.

Also consider adjusting cool access settings for the workload to fit the expected access patterns. For more information, see [Performance considerations for Azure NetApp Files storage with cool access](../azure-netapp-files/performance-considerations-cool-access.md).

**Use cases where cool access is a good fit:**

- Virtual machine templates and ISO files
- VMDKs with home directories (if not using Azure NetApp Files directly for this purpose)
- VMDKs with content repositories
- VMDKs with application data
- VMDKs with archive and application-level backup data
 
**Use cases to not use cool access:**

- VMDKs containing production database files with high random I/O and latency sensitivity
- VMDKs with operating system boot disks

## Attach an Azure NetApp Files volume to your private cloud

### [Portal](#tab/azure-portal)

To attach an Azure NetApp Files volume to your private cloud using Portal, follow these steps:

1. Sign in to the Azure portal.
1. Navigate to your Azure VMware Solution.
Under **Manage**, select **Storage**.
1. Select **Connect Azure NetApp Files volume**.
1. In **Connect Azure NetApp Files volume**, select the **Subscription**, **NetApp account**, **Capacity pool**, and **Volume** to be attached as a datastore.

:::image type="content" source="media/attach-netapp-files-to-cloud/connect-netapp-files-portal-experience-1.png" alt-text="Image shows the navigation to Connect Azure NetApp Files volume pop-up window." lightbox="media/attach-netapp-files-to-cloud/connect-netapp-files-portal-experience-1.png":::

1. Verify the protocol is NFS. You need to verify the virtual network and subnet to ensure connectivity to the Azure VMware Solution private cloud.
1. Under **Associated cluster**, in the **Client cluster** field, select one or more clusters to associate the volume as a datastore.
1. Under **Data store**, create a personalized name for your **Datastore name**.
    1. When the datastore is created, you should see all of your datastores in the **Storage**.
    2. Notice that the NFS datastores are added in vCenter Server.

### [Azure CLI](#tab/azure-cli)

To attach an Azure NetApp Files volume to your private cloud using Azure CLI, follow these steps:

1. Verify the VMware extension is installed. If the extension is already installed, verify you're using the latest version of the Azure CLI extension. If an older version is installed, update the extension.

    `az extension show --name vmware`

    `az extension list-versions -n vmware`

    `az extension update --name vmware`
1. If the VMware extension isn't already installed, install it.

    `az extension add --name vmware`
1. Create a datastore using an existing Azure NetApp Files volume in Azure VMware Solution private cloud cluster.

    `az vmware datastore netapp-volume create --name MyDatastore1 --resource-group MyResourceGroup –-cluster Cluster-1 --private-cloud MyPrivateCloud –-net-app-volume /subscriptions/<Subscription Id>/resourceGroups/<Resourcegroup name>/providers/Microsoft.NetApp/netAppAccounts/<Account name>/capacityPools/<pool name>/volumes/<Volume name>`
1. If needed, display the help on the datastores.

    `az vmware datastore -h`
1. Show the details of an Azure NetApp Files-based datastore in a private cloud cluster.

    `az vmware datastore show --name ANFDatastore1 --resource-group MyResourceGroup --cluster Cluster-1 --private-cloud MyPrivateCloud`
1. List all of the datastores in a private cloud cluster.

    `az vmware datastore list --resource-group MyResourceGroup --cluster Cluster-1 --private-cloud MyPrivateCloud`

---

## Protect Azure NetApp Files datastores and VMs

Cloud Backup for Virtual Machines is a plug-in for Azure VMware Solution that provides backup and restore capabilities for datastores and VMs residing on Azure NetApp Files datastores. With Cloud Backup for Virtual Machines, you can take VM-consistent snapshots for quick recovery points and easily restore VMs and VMDKs residing on Azure NetApp Files datastores. For more information, see [Install Cloud Backup for Virtual Machines](install-cloud-backup-virtual-machines.md).

## Service level change for Azure NetApp Files datastore

Based on performance requirements of the datastore, you can change the service level of the Azure NetApp Files volume used for the datastore. Use the instructions provided to [dynamically change the service level of a volume for Azure NetApp Files](../azure-netapp-files/dynamic-change-volume-service-level.md).

Changing the service level has no effect on the datastore or private cloud. There's no downtime and the volume IP address/mount path remains unchanged. However, the volume resource ID changes as a result of the capacity pool change. To correct any metadata mismatch, rerun the datastore creation in Azure CLI for the existing datastore with the new Resource ID for the Azure NetApp Files volume:

```azurecli
az vmware datastore netapp-volume create \
    --name <name of existing datastore> \
    --resource-group <resource group containing AVS private cloud> \
    --cluster <cluster name in AVS private cloud> \
    --private-cloud <name of AVS private cloud> \
    --net-app-volume /subscriptions/<subscription ID>/resourceGroups/<resource group>/providers/Microsoft.NetApp/netAppAccounts/<NetApp account>/capacityPools/<changed capacity pool>/volumes/<volume name>
```

>[!IMPORTANT]  
> The parameters for datastore **name**, **resource-group**, **cluster**, and **private-cloud** must be **exactly the same as those on the existing datastore in the private cloud**. The **volume-id** is the updated Resource ID of the Azure NetApp Files volume after the service level change.

## Disconnect an Azure NetApp Files-based datastore from your private cloud

You can use the instructions provided to disconnect an Azure NetApp Files-based datastore using either Azure portal or Azure CLI. There's no maintenance window required for this operation. The disconnect action only disconnects the Azure NetApp Files volume as a datastore, it doesn't delete the data or the Azure NetApp Files volume.

**Disconnect an Azure NetApp Files datastore using the Azure Portal**

1. Select the datastore you want to disconnect from.
1. Right-click on the datastore and select **disconnect**.

**Disconnect an Azure NetApp Files datastore using Azure CLI**

 `az vmware datastore delete --name ANFDatastore1 --resource-group MyResourceGroup --cluster Cluster-1 --private-cloud MyPrivateCloud`

## Next steps

Now that you attached a datastore on Azure NetApp Files-based NFS volume to your Azure VMware Solution hosts, you can create your VMs. Use the following resources to learn more.

- [Service levels for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-service-levels.md)
- Datastore protection using [Azure NetApp Files snapshots](../azure-netapp-files/snapshots-introduction.md)
- [About ExpressRoute virtual network gateways](../expressroute/expressroute-about-virtual-network-gateways.md)
- [Understand Azure NetApp Files backup](../azure-netapp-files/backup-introduction.md)
- [Guidelines for Azure NetApp Files network planning](../azure-netapp-files/azure-netapp-files-network-topologies.md)
- [Azure NetApp Files datastore performance benchmarks for Azure VMware Solution](../azure-netapp-files/performance-benchmarks-azure-vmware-solution.md)  

## Video: Deploy Azure VMware Solution with Azure NetApp Files datastore

> [!VIDEO https://learn-video.azurefd.net/vod/player?show=inside-azure-for-it&ep=how-to-deploy-azure-vmware-solution-with-azure-netapp-files-datastore]

## FAQs

- **Are there any special permissions required to create the datastore with the Azure NetApp Files volume and attach it onto the clusters in a private cloud?**
    
    No other special permissions are needed. The datastore creation and attachment is implemented via Azure VMware Solution control plane.

- **Which NFS versions are supported?**
  
     NFSv3 is supported for datastores on Azure NetApp Files.

- **Should Azure NetApp Files be in the same subscription as the private cloud?** 

    The recommendation is to create the Azure NetApp Files volumes for the datastores in the same virtual network that has connectivity to the private cloud.

- **How many datastores are we supporting with Azure VMware Solution?**

    The default maximum is 8 but it can be increased to 256 by submitting a support ticket. To submit a support ticket, go to [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

- **What latencies and bandwidth can be expected from the datastores backed by Azure NetApp Files?** 

    We're currently validating and working on benchmarking. For now, follow the [Performance best practices](#performance-best-practices) outlined in this article.

- **What are my options for backup and recovery?**
    
   Azure NetApp Files supports [snapshots](../azure-netapp-files/azure-netapp-files-manage-snapshots.md) of datastores for quick checkpoints for near term recovery or quick clones. Azure NetApp Files backup lets you offload your Azure NetApp Files snapshots to Azure storage. With snapshots, copies and stores-changed blocks relative to previously offloaded snapshots are stored in an efficient format. This ability decreases Recovery Point Objective (RPO) and Recovery Time Objective (RTO) while lowering backup data transfer burden on the Azure VMware Solution service.   

- **How do I monitor Storage Usage?**
    
    Use [Metrics for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-metrics.md) to monitor storage and performance usage for the Datastore volume and to set alerts.

- **What metrics are available for monitoring?**

    Usage and performance metrics are available for monitoring the Datastore volume. Replication metrics are also available for Azure NetApp Files datastore that can be replicated to another region using Cross Regional Replication. For more information about metrics, see [Metrics for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-metrics.md). 

- **What happens if a new node is added to the cluster, or an existing node is removed from the cluster?**

    When you add a new node to the cluster, it automatically gains access to the datastore. Removing an existing node from the cluster doesn't affect the datastore. 

- **How are the datastores charged, is there an additional charge?**

    Azure NetApp Files NFS volumes that are used as datastores are billed following the [capacity pool based billing model](../azure-netapp-files/azure-netapp-files-cost-model.md). Billing depends on the service level. There's no extra charge for using Azure NetApp Files NFS volumes as datastores.

- **Can a single Azure NetApp Files datastore be added to multiple clusters within the same Azure VMware Solution private cloud?**

    Yes, you can select multiple clusters at the time of creating the datastore. More clusters can be added or removed after the initial creation as well.

- **Can a single Azure NetApp Files datastore be added to multiple clusters within different Azure VMware Solution private clouds?**

    Yes, you can connect an Azure NetApp Files volume as a datastore to multiple clusters in different private clouds. Each private cloud needs connectivity via the ExpressRoute gateway in the Azure NetApp Files virtual network. Latency considerations apply.

- **Does NFS Traffic traverse NSX components?**

    No, NFS traffic from the ESXi hosts does not traverse any NSX components. Traffic traverses the ESXi VMkernel port directly to the NFS mount via the Azure network. 
