---
title: Use Azure VMware Solution with Azure Elastic SAN
description: Learn how to use Elastic SAN  with Azure VMware Solution.
ms.topic: how-to
ms.service: azure-vmware
author: ju-shim
ms.author: jushiman
ms.date: 6/18/2024
ms.custom: references_regions, engagement-fy23
---

# Use Azure VMware Solution with Azure Elastic SAN 

This article explains how to use Azure Elastic SAN as backing storage for Azure VMware Solution. [Azure VMware Solution](introduction.md) supports attaching iSCSI datastores as a persistent storage option. You can create Virtual Machine File System (VMFS) datastores with Azure Elastic SAN volumes and attach them to clusters of your choice. By using VMFS datastores backed by Azure Elastic SAN, you can expand your storage instead of scaling the clusters.

Azure Elastic storage area network (SAN) addresses the problem of workload optimization and integration between your large scale databases and performance-intensive mission-critical applications. For more information on Azure Elastic SAN, see [What is Azure Elastic SAN?](../storage/elastic-san/elastic-san-introduction.md).

To accompany the steps below, you can use this [interactive demo](https://regale.cloud/microsoft/play/4092/expand-storage-with-elastic-san#/0/0) as a visual representation of what you need to do to connect Elastic SAN and AVS.

## Prerequisites

The following prerequisites are required to continue.

- Have a fully configured Azure VMware solution private cloud in a [region that Elastic SAN is available in](../storage/elastic-san/elastic-san-create.md).
    - Size your ExpressRoute gateways to handle your elastic SAN's bandwidth capabilities. For example, a single ultra performance ExpressRoute gateway supports a bandwidth of 1,280 mbps. An individual elastic SAN datastore used to its full potential would use the entirety of that bandwidth. Multiple gateways might be required depending on your needs.
- Know the availability zone your private cloud is in. 
  - In the UI, select an Azure VMware Solution host.
    > [!NOTE]
    > The host exposes its availability zone. Use that availability zone when deploying other Azure resources for the same subscription.

- Have permission to set up new resources in the subscription your private cloud is in.
- Reserve a dedicated address block for your external storage.
- Use either the [Azure portal](/azure/storage/elastic-san/elastic-san-create?tabs=azure-portal), [Azure PowerShell module](/azure/storage/elastic-san/elastic-san-create?tabs=azure-powershell), or [Azure CLI](/azure/storage/elastic-san/elastic-san-create?tabs=azure-cli) to create an Elastic SAN that has at least 16 TiB base size and that is in the same region and availability zone as your private cloud.
    > [!NOTE]
    > Make sure CRC protection on your volume groups is disabled since it's not currently supported for Azure VMware Solution.


## Supported host types

You can use the following host types when Azure Elastic SAN is the backing storage for Azure VMware solution:

- AV36
- AV36P
- AV48
- AV52
- AV64

## Configuration recommendations

Use multiple private endpoints to establish multiple sessions between an Elastic SAN and each volume you intend to connect to your software defined data center (SDDC). Having multiple sessions provides better performance due to parallelization, and better reliability to handle single session disconnects. When you establish multiple sessions, it also mitigates the impact of session disconnects, as long as the connection is re-established within a few seconds, your other sessions help load-balance traffic.

   > [!NOTE]
   > Session disconnects might show up as "All Paths Down" or "APD" events, which can be seen in the Events section of the ESXi Host at vCenter. You can also see them in the logs: it shows the identifier of a device or filesystem, and states it entered the All Paths Down state.

When an Elastic SAN volume is attached to a cluster, it automatically attaches to all nodes. If you have 16 nodes and each node is configured to use eight iSCSI sessions that use the maximum number of connections (128). This would prevent you from attaching an additional node for maintenance. The following recommendations help you avoid this situation:

If your Elastic SAN is only connecting to a single cluster, and will only ever have 16 nodes in a cluster, use one of the following configurations:
- AV36, AV36P, AV52 - Six iSCSI sessions over three Private Endpoints
- AV64 - Seven iSCSI sessions over seven Private Endpoints

If your Elastic SAN is connecting to a single cluster that won't have 16 nodes, use one of the following configurations.
-  AV36, AV36P, AV52 - Eight iSCSI sessions over four Private Endpoints
- AV64 - Eight iSCSI sessions over eight Private Endpoints

If you're planning on connecting an Elastic SAN datastore to multiple clusters, you must calculate the number of hosts, sessions, and connections per cluster. An Elastic SAN datastore only supports a maximum of 128 connections, and each time you connect an Elastic SAN datastore to a cluster, it automatically connects to all nodes in that cluster. This can rapidly use up the available connections when each node in a cluster is establishing multiple connections.

## Configure Private Endpoint

Using the guidance from the previous section, create as many private endpoints for your volume groups as you need.

Edit your volume group, or create a new one. Then select **Networking**, then select **+ Create a private endpoint** under **Private endpoint connections**. You don't need to configure a dedicated virtual network for your Elastic SAN, since you're using private endpoint connections to access your Elastic SAN volumes.

Fill out the values in the menu that pops up, select the virtual network that has your [ExpressRoute connection configured](/azure/azure-vmware/tutorial-configure-networking#connect-expressroute-to-the-virtual-network-gateway), and the subnet that your applications are going to use to connect. When you're done, select **Add**, and **Save**.

 Repeat these steps to create as many private endpoints as you need.

:::image type="content" source="../storage/elastic-san/media/elastic-san-create/elastic-san-edit-volume-network.png" alt-text="Screenshot of the volume group private endpoint creation experience." lightbox="../storage/elastic-san/media/elastic-san-create/elastic-san-edit-volume-network.png":::

> [!NOTE]
> Using Private Endpoints provides the highest network security. However, since your private cloud connects to Elastic SAN in Azure through an ExpressRoute virtual network gateway, you might experience intermittent connectivity issues during [gateway maintenance](/azure/expressroute/expressroute-about-virtual-network-gateways). 
> These connectivity issues aren't expected to impact the availability of the datastore backed by Elastic SAN as the connection is re-established within seconds. The potential impact from gateway maintenance is covered under the [Service Level Agreement](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1) for ExpressRoute virtual network gateways and private endpoints.


## Configure external storage address block

Start by providing an IP block for deploying external storage. Navigate to the **Storage** tab in your Azure VMware Solution private cloud in the Azure portal. The address block should be a /24 network. 

:::image type="content" source="media/configure-azure-elastic-san/configure-external-storage-address-block.png" alt-text="Screenshot showing External storage address block tab." border="false"lightbox="media/configure-azure-elastic-san/configure-external-storage-address-block.png":::

- The address block must be unique and not overlap with the /22 used to create your Azure VMware Solution private cloud or any other connected Azure virtual networks or on-premises network. 
- The address block must fall within the following allowed network blocks: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. If you want to use a non-RFC 1918 address block, submit a support request. 
- The address block can't overlap any of the following restricted network blocks: 100.72.0.0/15 
- The address block provided is used to enable multipathing from the ESXi hosts to the target, it can’t be edited or changed. If you do need to change it, submit a support request.

## Add an Elastic SAN volume as a datastore

Configure all Private Endpoints before attaching a volume as a datastore. Adding Private Endpoints after a volume is attached as a datastore requires detaching the datastore and reconnecting it to the cluster.

Once your SDDC express route is connected with the private endpoint for your Elastic SAN volume group, use the following steps to connect the volume to your SDDC: 

1. From the left navigation in your Azure VMware Solution private cloud, select **Storage**, then **+ Connect Elastic SAN**.
1. Select your **Subscription**, **Resource**, **Volume Group**, **Volume(s)**, and **Client cluster**.
1. From section, "Rename datastore as per VMware requirements", under **Volume name** > **Data store name**, give names to the Elastic SAN volumes.
   > [!NOTE]
   > When creating virtual disks, use eager zeroed thick provisioning.
   > This means setting up virtual disks where all the space is reserved and cleaned out in advance, so they're ready for fast and secure use.

## Disconnect and delete an Elastic SAN-based datastore

To delete the Elastic SAN-based datastore, use the following steps from the Azure portal.

1. From the left navigation in your Azure VMware Solution private cloud, select **Storage**, then **Datastore list**.
1. On the far right is an **ellipsis**. Select **Delete** to disconnect the datastore from the clusters.  
1. Optionally, you can delete the volume you previously created in your Elastic SAN.
   > [!NOTE]
   > This operation can't be completed if virtual machines or virtual disks reside on an Elastic SAN VMFS Datastore.

## Resize an Elastic SAN-based datastore

To resize the Elastic SAN-based datastore, use the following steps from the Azure portal.

1. From the left navigation in your Azure VMware Solution private cloud, select **Operations**, then **Run Command**.
1. On the packages, go to the latest Azure VMware Solution VMFS package and select **Resize-VmfsVolume**.
1. In the run command, enter the ClusterName, DeviceNaaID or DatastoreName details and click **Run**.

![Resize-VmfsVolume.](media/configure-azure-elastic-san/resize-vmfsvolume.png)

   > [!NOTE]
   > Run Commands are executed one at a time in the order submitted.
