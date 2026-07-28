---
title: Use Azure VMware Solution with Azure Elastic SAN
description: Learn how to use Elastic SAN  with Azure VMware Solution.
ms.topic: how-to
ms.service: azure-vmware
author: jjaygbay1 
ms.author: jacobjaygbay
ms.date: 4/08/2026
ms.custom:
  - references_regions
  - engagement-fy23
  - sfi-image-nochange
# Customer intent: "As a cloud administrator, I want to integrate Azure Elastic SAN with Azure VMware Solution, so that I can optimize storage performance and enhance resource management for my virtual machines."
---

# Use Azure VMware Solution with Azure Elastic SAN 

This article explains how to use Azure Elastic SAN as backing storage for Azure VMware Solution. [Azure VMware Solution](introduction.md) supports attaching iSCSI datastores as a persistent storage option. You can create Virtual Machine File System (VMFS) datastores with Azure Elastic SAN volumes and attach them to clusters of your choice. By using VMFS datastores backed by Azure Elastic SAN, you can expand your storage instead of scaling the clusters.

Azure Elastic storage area network (SAN) addresses the problem of workload optimization and integration between your large scale databases and performance-intensive mission-critical applications. For more information on Azure Elastic SAN, see [What is Azure Elastic SAN?](../storage/elastic-san/elastic-san-introduction.md)

To accompany the steps in this article, use this [interactive demo](https://regale.cloud/microsoft/play/4092/expand-storage-with-elastic-san#/0/0) as a visual representation of what you need to do to connect Elastic SAN and AVS.

Unless explicitly noted, the following sections apply to both Azure VMware Solution Gen1 and Gen2 private clouds.

## Prerequisites

The following prerequisites are required to continue.

> [!IMPORTANT]
> As of November 2025, creating and deleting an Azure Elastic SAN based datastore in Azure VMware Solution requires appropriate permissions. If you're using built-in roles such as Owner and Contributor across these two services, you don't need to make any changes. If you're using custom roles, ensure you have the correct permissions configured.
><details><summary>For a complete list of required permissions, expand this section.</summary>
>
>To create an Elastic SAN datastore, you must have the following permissions:
>- `Microsoft.AVS/privateClouds/clusters/datastores/write`
>- `Microsoft.ElasticSan/elasticSans/volumeGroups/volumes/write`
>- `Microsoft.ElasticSan/elasticSans/volumeGroups/volumes/read`
>
>To delete an Elastic SAN datastore, you must have the following permissions:
>- `Microsoft.AVS/privateClouds/clusters/datastores/write`
>- `Microsoft.ElasticSan/elasticSans/volumeGroups/volumes/write`
>- `Microsoft.ElasticSan/elasticSans/volumeGroups/volumes/read`
>
>For information about creating and modifying custom roles, see [create or update Azure custom roles using the Azure portal](../role-based-access-control/custom-roles-portal.md).
</details>

- Have a fully configured Azure VMware Solution private cloud in a [region that Elastic SAN is available in](../storage/elastic-san/elastic-san-create.md).
    - Size your ExpressRoute gateways to handle your Elastic SAN's bandwidth capabilities. For example, a single ultra performance ExpressRoute gateway supports a bandwidth of 1,280 Mbps. An individual Elastic SAN datastore used to its full potential uses the entirety of that bandwidth. You might need multiple gateways depending on your needs.
- Know the availability zone your private cloud is in. 
  - In the UI, select an Azure VMware Solution host.
    > [!NOTE]
    > The host exposes its availability zone. Use that availability zone when deploying other Azure resources for the same subscription.

- Have permission to set up new resources in the subscription your private cloud is in.
- Reserve a dedicated address block for your external storage.
- Use either [Azure portal](/azure/storage/elastic-san/elastic-san-create?tabs=azure-portal), [Azure PowerShell module](/azure/storage/elastic-san/elastic-san-create?tabs=azure-powershell), or [Azure CLI](/azure/storage/elastic-san/elastic-san-create?tabs=azure-cli) to create an Elastic SAN that has at least a 16 TiB base size and is in the same region and availability zone as your private cloud.
    > [!NOTE]
    > Make sure the cyclic redundancy check (CRC) protection on your volume groups is disabled since it isn't currently supported for Azure VMware Solution.


## Supported host types

Use the following host types when Azure Elastic SAN is the backing storage for Azure VMware Solution:

- Azure VMware Solution Gen1: AV36, AV36P, AV48, AV52, AV64
- Azure VMware Solution Gen2: AV64

## Configuration recommendations

Use multiple private endpoints to establish multiple sessions between an Elastic SAN and each volume you intend to connect to your software defined data center (SDDC). Multiple sessions provide better performance through parallelization, and better reliability to handle single session disconnects. When you establish multiple sessions, you mitigate the impact of session disconnects. As long as the connection is re-established within a few seconds, your other sessions help load-balance traffic.

   > [!NOTE]
   > Session disconnects might show up as **All Paths Down** or **APD** events, which you can see in the **Events** section of the ESXi Host at vCenter. You can also see them in the logs: it shows the identifier of a device or filesystem, and states it entered the **All Paths Down** state.

When you attach an Elastic SAN volume to a cluster, it automatically attaches to all nodes. If you have 16 nodes and each node is configured to use eight iSCSI sessions that use the maximum number of connections (128), you can't attach an extra node for maintenance. The following recommendations help you avoid this situation:

If your Elastic SAN connects to only a single cluster, and the cluster only ever has 16 nodes, use one of the following configurations:
- AV36, AV36P, AV52 - Six iSCSI sessions over three private endpoints
- AV64 - Seven iSCSI sessions over seven private endpoints

If your Elastic SAN connects to only a single cluster that doesn't have 16 nodes, use one of the following configurations:
- AV36, AV36P, AV52 - Eight iSCSI sessions over four private endpoints
- AV64 - Eight iSCSI sessions over eight private endpoints

If you plan to connect an Elastic SAN datastore to multiple clusters, you must calculate the number of hosts, sessions, and connections per cluster. An Elastic SAN datastore only supports a maximum of 128 connections. Each time you connect an Elastic SAN datastore to a cluster, it automatically connects to all nodes in that cluster. This configuration can rapidly use up the available connections when each node in a cluster establishes multiple connections.

## Configure private endpoint

> [!IMPORTANT]
> The guidance in this section only applies to Azure VMware Solution Gen1. For Azure VMware Solution Gen2, create a private endpoint for the volume group and use private cloud connectivity. You don't need multiple private endpoints to scale iSCSI sessions for Azure VMware Solution Gen2. You can use a single private endpoint because Azure VMware Solution Gen2 clones iSCSI sessions. ExpressRoute isn't required when using Azure VMware Solution Gen2.

Using the guidance from the previous section, create as many private endpoints for your volume groups as you need.

Edit your volume group, or create a new one. Then select **Networking**, and under **Private endpoint connections**, select **+ Create a private endpoint**. You don't need to configure a dedicated virtual network for your Elastic SAN, since you're using private endpoint connections to access your Elastic SAN volumes.

Fill out the values in the menu that pops up. Select the virtual network that has your [ExpressRoute connection configured](/azure/azure-vmware/tutorial-configure-networking#connect-expressroute-to-the-virtual-network-gateway), and the subnet that your applications use to connect. When you're done, select **Add**, and **Save**.

 Repeat these steps to create as many private endpoints as you need.

:::image type="content" source="../storage/elastic-san/media/elastic-san-create/elastic-san-edit-volume-network.png" alt-text="Screenshot of the volume group private endpoint creation experience." lightbox="../storage/elastic-san/media/elastic-san-create/elastic-san-edit-volume-network.png":::

> [!NOTE]
> Using private endpoints provides the highest network security. However, since your private cloud connects to Elastic SAN in Azure through an ExpressRoute virtual network gateway for Azure VMware Solution Gen1, you might experience intermittent connectivity issues during [gateway maintenance](/azure/expressroute/expressroute-about-virtual-network-gateways). 
> These connectivity issues aren't expected to impact the availability of the datastore backed by Elastic SAN as the connection is re-established within seconds. The potential impact from gateway maintenance is covered under the [Service Level Agreement](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1) for ExpressRoute virtual network gateways and private endpoints.


## Configure external storage address block
> [!NOTE]
> This section applies to Azure VMware Solution Gen1 only

Start by providing an IP block for deploying external storage. Go to the **Storage** tab in your Azure VMware Solution private cloud in the Azure portal. The address block should be a /24 network. 

:::image type="content" source="media/configure-azure-elastic-san/configure-external-storage-address-block.png" alt-text="Screenshot showing External storage address block tab." border="false"lightbox="media/configure-azure-elastic-san/configure-external-storage-address-block.png":::

- The address block must be unique and not overlap with the /22 used to create your Azure VMware Solution private cloud or any other connected Azure virtual networks or on-premises network. 
- The address block must fall within the following allowed network blocks: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. If you want to use a non-RFC 1918 address block, submit a support request. 
- The address block can't overlap any of the following restricted network blocks: 100.72.0.0/15 
- The address block provided is used to enable multipathing from the ESXi hosts to the target, it can’t be edited or changed. If you do need to change it, submit a support request.

## Add an Elastic SAN volume as a datastore

Configure all private endpoints before attaching a volume as a datastore. Adding private endpoints after a volume is attached as a datastore requires detaching the datastore and reconnecting it to the cluster.

After your SDDC express route connects with the private endpoint for your Elastic SAN volume group, use the following steps to connect the volume to your SDDC: 

1. From the left navigation in your Azure VMware Solution private cloud, select **Storage**, and then select **+ Connect Elastic SAN**.
1. Select your **Subscription**, **Resource**, **Volume Group**, **Volumes**, and **Client cluster**.
1. In the section "Rename datastore as per VMware requirements", under **Volume name** > **Data store name**, give names to the Elastic SAN volumes.
   > [!NOTE]
   > When creating virtual disks, use eager zeroed thick provisioning.
   > This provisioning sets up virtual disks where all the space is reserved and cleaned out in advance, so they're ready for fast and secure use.

## Disconnect and delete an Elastic SAN-based datastore

To delete the Elastic SAN-based datastore, use the following steps from the Azure portal.

1. From the left navigation in your Azure VMware Solution private cloud, select **Storage**, and then select **Datastore list**.
1. On the far right, select the **ellipsis**. Select **Delete** to disconnect the datastore from the clusters.  
1. Optionally, you can delete the volume you previously created in your Elastic SAN.

   :::image type="content" source="media/configure-azure-elastic-san/disconnect-esan-based-datastore.png" alt-text="Screenshot showing Disconnect ESAN based datastore." border="false"lightbox="media/configure-azure-elastic-san/disconnect-esan-based-datastore.png":::
   
   > [!NOTE]
   > This operation can't be completed if virtual machines or virtual disks reside on an Elastic SAN VMFS Datastore.
   
## Resize an Elastic SAN-based datastore

To resize the Elastic SAN-based datastore, use the following steps from the Azure portal.

1. From the left navigation in your Azure VMware Solution private cloud, select **Operations**, and then select **Run Command**.
1. On the packages, go to the latest Azure VMware Solution VMFS package and select **Resize-VmfsVolume**.
1. In the run command, enter the ClusterName, DeviceNaaID, or DatastoreName details and select **Run**.

   :::image type="content" source="media/configure-azure-elastic-san/resize-vmfsvolume.png" alt-text="Screenshot showing Resize ESAN based datastore." border="false"lightbox="media/configure-azure-elastic-san/resize-vmfsvolume.png":::

   > [!NOTE]
   > Run Commands execute one at a time in the order submitted.
