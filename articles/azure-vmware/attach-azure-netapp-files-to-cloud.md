---
title: Attach Azure NetApp Files datastores to a private cloud (Preview)
description: Learn how to create Azure NetApp Files-based NSF datastores for Azure VMware Solution private cloud.
ms.topic: how-to
ms.date: 03/24/2022
---

# Attach Azure NetApp Files datastores to a private cloud (Preview)

## Overview

[Azure VMware Solution](/azure/azure-vmware/introduction) private clouds support attaching Network File System (NFS) datastores, created with [Azure NetApp Files](/azure/azure-netapp-files/azure-netapp-files-introduction?branch=main) volumes, to clusters you choose to create virtual machines (VMs) for optimal cost and performance. 

Azure NetApp Files is an Azure service that's an enterprise-class, high-performance, metered file storage service. The service supports the most demanding enterprise file-workloads in the cloud: databases, SAP, and high-performance computing applications, with no code changes. For more information on Azure NetApp Files, see [Azure NetApp Files](/azure/azure-netapp-files) documentation.  

> [!IMPORTANT]
> Azure NetApp Files datastores for Azure VMware Solution (Preview) is currently in public preview. This version is provided without a service-level agreement and is not recommended for production workloads. Some features may not be supported or have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

By using NFS datastores backed by Azure NetApp Files, you can expand your storage instead of scaling the clusters. You can also use Azure NetApp Files volumes to replicate data from on-premises or primary VMware environments for the secondary site. 

Create your Azure VMware Solution and create Azure NetApp Files NFS volumes in the virtual network connected to it using an ExpressRoute. Make sure there's connectivity from the private cloud to the NFS volumes created. Use those volumes to create NFS datastores and attach the datastores to clusters of your choice in a private cloud. Since this is a native integration, no other permissions configured via vSphere are needed.

For best performance, create multiple datastores. Create your VMs with VMDKs from those datastores and stripe your logical volumes across the disks.

The diagram below demonstrates a typical architecture of Azure NetApp Files backed NFS datastores attached to an Azure VMware Solution private cloud via ExpressRoute.

:::image type="content" source="media/attach-netapp-files-to-cloud/architecture-netapp-files-nfs-datastores.png" alt-text="Diagram shows the architecture of Azure NetApp Files backed NFS datastores attached to an Azure VMware Solution private cloud." border="false":::

## Supported Regions

East US, US South Central, North Europe, West Europe, North Central US, Australia Southeast, France Central, Australia East, Brazil South, Canada Central, Canada East, Central US, Germany West Central, Japan West, Southeast Asia, Switzerland West, UK South, UK West and West US are currently supported and will be expanded to other Azure VMware Solution regions later in the preview. 

## Prerequisites

1.    [Deploy Azure VMware Solution private cloud](/azure/azure-vmware/deploy-azure-vmware-solution) with a virtual network configured. For more information, see [Network planning checklist and Configure networking for your VMware private cloud](/azure/azure-vmware/tutorial-network-checklist).
    1. Verify the subscription is registered to **Microsoft.AVS**.
        `az provider show -n "Microsoft.AVS" -- query registrationState`
1. If it's not already registered, register it, then deploy a private cloud.
    `az provider register -n "Microsoft.AVS"`
1. Create an [NFS volume for Azure NetApp Files](/azure/azure-netapp-files/azure-netapp-files-create-volumes) in the same virtual network as the Azure VMware Solution private cloud. 
    1. Ping the attached target IP to verify connectivity from the private cloud to Azure NetApp Files volume.
    1. Verify the subscription is registered to the `ANFAvsDataStore` feature in the `Microsoft.NetApp` namespace to identify and confirm the volume is for Azure VMware Solution NFS datastore.
    `az feature show --name "ANFAvsDataStore" --namespace "Microsoft.NetApp"`
    `az feature show --name "ANFAvsDataStore" --namespace "Microsoft.NetApp" --query properties.state`

## Attach an Azure NetApp Files volume to your private cloud

### [Portal](#tab/azure-portal)

To attach an Azure NetApp Files volume to your private cloud using Portal, follow these steps:

1. Sign in to the Azure portal.
1. Locate and select **Subscriptions**.
1. Select the subscription you want to use, select **Resource providers** under **Settings**.
1. Search for **Microsoft.AVS** and select it, then select *Register**.
1. Under **Settings**, select **Preview features**.
1. Search for and verify you're registered for both ``CloudSanExperience`` and ``AnfDatastoreExperience`` features.
1. Navigate to your Azure VMware Solution.
1. Under **Manage**, select **Storage (preview)**.
1. Select **Connect Azure NetApp Files volume**.
1. In **Connect Azure NetApp Files volume**, select the Subscription, NetApp Account, Capacity Pool, and ANF volume to be attached as a datastore.
1. Verify the protocol is NFS. You'll need to verify the virtual network and subnet to ensure connectivity to the Azure VMware Solution private cloud.
1. Select the clusters to associate the NFS volume as a datastore and provide a friendly name to the datastore.
1. When the datastore is created, you should see all of your datastores in the **Storage (preview)**.
1. You'll also notice that the NFS datastores are added in vCenter.
1. To disconnect from a datastore, select the datastore, right-click and select **disconnect**.
> [!NOTE]
> This action only disconnects the ANF volume as a datastore. It does not delete the data or the ANF volume.


### [Azure CLI](#tab/azure-cli)

To attach an Azure NetApp Files volume to your private cloud using Azure CLI, follow these steps:

1. Verify the subscription is registered to `CloudSanExperience` feature in the **Microsoft.AVS** namespace. If it's not already registered, then register it.
    1. `az feature show --name "CloudSanExperience" --namespace "Microsoft.AVS"`
    1. `az feature register --name "CloudSanExperience" --namespace "Microsoft.AVS"`
1. The registration should take approximately 15 minutes to complete. You can also check the status.
    1. `az feature show --name "CloudSanExperience" --namespace "Microsoft.AVS" --query properties.state`
1. If the registration is stuck in an intermediate state for longer than 15 minutes to complete, unregister, then re-register the flag.
    1. `az feature unregister --name "CloudSanExperience" --namespace "Microsoft.AVS"`
    1. `az feature register --name "CloudSanExperience" --namespace "Microsoft.AVS"`
1. Verify the subscription is registered to `AnfDatastoreExperience` feature in the **Microsoft.AVS** namespace. If it's not already registered, then register it.
    1. `az feature register --name " AnfDatastoreExperience" --namespace "Microsoft.AVS"`
    1. `az feature show --name "AnfDatastoreExperience" --namespace "Microsoft.AVS" --query properties.state`
1. Verify the VMware extension is installed. If the extension is already installed, verify you are using the latest version of the Azure CLI extension. If an older version is installed, update the extension.
    1. `az extension show --name vmware`
    1. `az extension list-versions -n vmware`
    1. `az extension update --name vmware`
1. If it's not already installed, install it.
    1. `az extension add --name vmware`
1. Create a datastore using an existing ANF volume in Azure VMware Solution private cloud cluster.
    1. `az vmware datastore netapp-volume create --name MyDatastore1 --resource-group MyResourceGroup –-cluster Cluster-1 --private-cloud MyPrivateCloud –-volume-id /subscriptions/<Subscription Id>/resourceGroups/<Resourcegroup name>/providers/Microsoft.NetApp/netAppAccounts/<Account name>/capacityPools/<pool name>/volumes/<Volume name>`
1. If needed, you can display the help on the datastores.
    1. `az vmware datastore -h`
1. Show the details of an ANF-based datastore in a private cloud cluster.
    1. `az vmware datastore show --name ANFDatastore1 --resource-group MyResourceGroup --cluster Cluster-1 --private-cloud MyPrivateCloud`
1. List all of the datastores in a private cloud cluster.
    1. `az vmware datastore list --resource-group MyResourceGroup --cluster Cluster-1 --private-cloud MyPrivateCloud`

---

## Delete an Azure NetApp Files-based datastore from your private cloud

You can delete an Azure NetApp Files-based datastore, which is used in Azure VMware Solution private cloud. Use the **Delete an ANF-based private cloud datastore** command, provided below, to perform this operation. There's no maintenance window required for this operation. After the deletion, the actual Azure NetApp Files (ANF) volume will still exist. 

**Delete an ANF based private cloud datastore**

`az vmware datastore delete --name ANFDatastore1 --resource-group MyResourceGroup --cluster Cluster-1 --private-cloud MyPrivateCloud`

## Next steps

Now that you've attached a datastore on Azure NetApp Files-based NFS volume to your Azure VMware Solution hosts, you can create your VMs.

## FAQs

- **Are there any special permissions required to create the datastore with the Azure NetApp Files volume and attach it onto the clusters in a private cloud?**
    
    No other special permissions are needed. The datastore creation and attachment is implemented via Azure VMware Solution RP.

- **Which NFS versions are supported?**
  
     NFSv3 is supported for datastores on Azure NetApp Files.

- **Should Azure NetApp Files be in the same subscription as the private cloud?** 

    It's recommended to use the Premium or Ultra tier for optimal performance.

- **What latencies and bandwidth can be expected from the datastores backed by Azure NetApp Files?** 

    We're currently validating and working on the benchmarking. For Azure NetApp Files volumes with "Basic" network features, the connectivity from Azure VMware Solution is bound by the bandwidth of the ExpressRoute circuit and the ExpressRoute Gateway along with the latency that comes with that architecture.

    For Azure NetApp Files volumes with "standard" network features (in Public preview), ExpressRoute FastPath is supported. When enabled, FastPath sends network traffic directly to Azure NEtApp Files volumes bypassing the gateway and providing higher bandwidth and lower latency.

    For higher bandwidth, create VMDKs and stripe the logical volumes across VMDKs. As a best practice, create multiple datastores on multiple ANF volumes.

    For more information, see [Guidelines for Azure NEtApp Files network planning](/azure/azure-netapp-files/azure-netapp-files-network-topologies) and [About Azure ExpressRoute FastPath](/azure/expressroute/about-fastpath).

- **What are my options for backup and recovery?**
    
   Azure NetApp Files support [snapshots](/azure/azure-netapp-files/azure-netapp-files-manage-snapshots) of datastores for quick checkpoints for near term recovery or quick clones. Azure NetApp Files backup provides the ability to offload your Azure NetApp Files snapshots to Azure storage. Only for this technology are copies and stores changed blocks relative to previously offloaded snapshots in an efficient format, dramatically increasing RPO/RTO while lowering backup data transfer burden on the AVS service.   

- **How do I monitor Storage Usage?**
    
    You can monitor storage and performance usage for datastores using Azure NetApp Files volume metrics blade for the Datastore volume and set alerts in Azure Monitor for these metrics.

- **What metrics are available for monitoring?**

    Usage and performance metrics are available for monitoring the Datastore volume. 

    Replication metrics are also available for ANF datastore and be replicated to another region using Cross Regional Replication. See [Metrics for Azure NetApp Files](/azure/azure-netapp-files/azure-netapp-files-metrics) for more details. 

- **What happens if a new node is added to the cluster, or an existing node is removed from the cluster?**

    When you add a new node to the cluster, it will automatically gain access to the datastore. Removing an existing node from the cluster won't affect the datastore. 

- **How are the datastores charged, is there an additional charge?**

    Azure NetApp Files NFS volumes that are used as datastores will be billed following the [capacity pool based billing model](/azure/azure-netapp-files/azure-netapp-files-cost-model). Billing will depend on the service level. There's no extra charge for using Azure NetApp Files NFS volumes as datastores. 

- **How many datastores are we supporting with Azure VMware Solution?**

    The default is eight but it can be changed.
