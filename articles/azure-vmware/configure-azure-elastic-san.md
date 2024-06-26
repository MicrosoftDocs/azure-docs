---
title: Use Azure VMware Solution with Azure Elastic SAN
description: Learn how to use Elastic SAN  with Azure VMware Solution.
ms.topic: how-to
ms.service: azure-vmware
ms.author: v-suzuber
ms.date: 3/22/2024
ms.custom: references_regions, engagement-fy23
---

# Use Azure VMware Solution with Azure Elastic SAN (Integration in Preview)

This article explains how to use Azure Elastic SAN as backing storage for Azure VMware Solution. [Azure VMware Solution](introduction.md) supports attaching iSCSI datastores as a persistent storage option. You can create Virtual Machine File System (VMFS) datastores with Azure Elastic SAN volumes and attach them to clusters of your choice. By using VMFS datastores backed by Azure Elastic SAN, you can expand your storage instead of scaling the clusters.

Azure Elastic storage area network (SAN) addresses the problem of workload optimization and integration between your large scale databases and performance-intensive mission-critical applications. For more information on Azure Elastic SAN, see [What is Azure Elastic SAN?](../storage/elastic-san/elastic-san-introduction.md).

## Prerequisites

The following prerequisites are required to continue.

- Register for the preview by filling out the [form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR8FVh9RJVPdOk_mdTpp--pZUN0RKUklROEc4UE1RRFpRMkhNVFAySTM1TC4u).
- Verify you have a Dev/Test private cloud in a [region that Elastic SAN is available in](../storage/elastic-san/elastic-san-create.md).
- Know the availability zone your private cloud is in. 
	- In the UI, select an Azure VMware Solution host.
	> [!NOTE]
	> The host exposes its Availability Zone. You should use that AZ when deploying other Azure resources for the same subscription.
- You have permission to set up new resources in the subscription your private cloud is in.

## Set preview feature flags

To use ElasticSAN with Azure VMware Solution, you need to set three feature flags on your subscription:

- earlyAccess
- iSCSIMultipath
- ElasticSanDatastore

Setting a feature flag can be done in the subscription overview page in the Azure portal. 

1. Under the **Settings** section, select **Preview features**.
1. On the **Preview features** page, use the search bar to find the feature flags you need to register. Once found, select the feature flag you want to register and select **Register** at the top.
1. Verify the **State** of the feature is changed to **Registered** with a green checkmark.


## Set up Elastic SAN

In this section, you create a virtual network for your Elastic SAN. Then you create the Elastic SAN that includes creating at least one volume group and one volume that becomes your VMFS datastore. Next, you set up a Private Endpoint for your Elastic SAN that allows your private cloud to connect to the Elastic SAN volume. Then you're ready to add an Elastic SAN volume as a datastore in your private cloud.

1. Use one of the following instruction options to set up a dedicated virtual network for your Elastic SAN:
	- [Azure portal](../virtual-network/quick-create-portal.md)
	- [Azure PowerShell module](../virtual-network/quick-create-powershell.md)
	- [Azure CLI](../virtual-network/quick-create-cli.md)
1. Use one of the following instruction options to set up an Elastic SAN, your dedicated volume group, and initial volume in that group:
	> [!IMPORTANT]
	> Create your Elastic SAN in the same region and availability zone as your private cloud for best performance.
	- [Azure portal](/azure/storage/elastic-san/elastic-san-create?tabs=azure-portal)
	- [PowerShell](/azure/storage/elastic-san/elastic-san-create?tabs=azure-powershell)
	- [Azure CLI](/azure/storage/elastic-san/elastic-san-create?tabs=azure-cli)
1. Use one of the following instructions to configure a Private Endpoint (PE) for your Elastic SAN:
	> [!IMPORTANT]
	> You must have a Private Endpoint set up for your dedicated volume group to be able to connect your SDDC to the Elastic SAN.
	- [PowerShell](/azure/storage/elastic-san/elastic-san-networking?tabs=azure-powershell#configure-a-private-endpoint)
	- [Azure CLI](/azure/storage/elastic-san/elastic-san-networking?tabs=azure-cli#tabpanel_2_azure-cli)

## Add an Elastic SAN volume as a datastore

Once all three feature flags (earlyAccess, iSCSIMultipath, ElasticSanDatastore) are set on your subscription, you can use the Azure portal to add the Elastic SAN volume as a datastore in your private cloud. Use the steps in [configure external storage address block](#configure-external-storage-address-block) to add, connect, disconnect, and delete Elastic SAN. 

## Configure external storage address block

Start by providing an IP block for deploying external storage. Navigate to the **Storage** tab in your Azure VMware Solution private cloud in the Azure portal. The address block should be a /24 network. 

:::image type="content" source="media/configure-azure-elastic-san/configure-external-storage-address-block.png" alt-text="Screenshot showing External storage address block tab." border="false"lightbox="media/configure-azure-elastic-san/configure-external-storage-address-block.png":::

- The address block must be unique and not overlap with the /22 used to create your Azure VMware Solution private cloud or any other connected Azure virtual networks or on-premises network. 
- The address block must fall within the following allowed network blocks: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. If you want to use a non-RFC 1918 address block, submit a support request. 
- The address block can't overlap any of the following restricted network blocks: 100.72.0.0/15 
- The address block provided is used to enable multipathing from the ESXi hosts to the target, it can’t be edited or changed. If you do need to change it, submit a support request. 

After you provide an External storage address block, you can connect to an Elastic SAN volume from the same page.

## Connect Elastic SAN

First, you need to connect your SDDC express route with the private endpoint you set up for your Elastic SAN volume group. Instructions on how to establish this connection can be found in the Tutorial, [Configure networking for your VMware private cloud in Azure](../azure-vmware/tutorial-configure-networking.md). 

Once your SDDC express route is connected with the private endpoint for your Elastic SAN volume group, use the following steps to connect the volume to your SDDC: 

1. From the left navigation in your Azure VMware Solution private cloud, select **Storage**, then **+ Connect Elastic SAN**.
1. Select your **Subscription**, **Resource**, **Volume Group**, **Volume(s)**, and **Client cluster**.
1. From section, "Rename datastore as per VMware requirements", under **Volume name** > **Data store name**, give names to the Elastic SAN volumes.
	> [!NOTE]
	> For best performance, verify that your Elastic SAN volume and private cloud are in the same Region and Availability Zone.

## Disconnect and delete an Elastic SAN-based datastore

To delete the Elastic SAN-based datastore, use the following steps from the Azure portal.

1. From the left navigation in your Azure VMware Solution private cloud, select **Storage**, then **Datastore list**.
1. On the far right is an **ellipsis**. Select **Delete** to disconnect the datastore from the Cluster(s).
   
   :::image type="content" source="media/configure-azure-elastic-san/elastic-san-datastore-list-ellipsis-removal.png" alt-text="Screenshot showing Elastic SAN volume removal." border="false"lightbox="media/configure-azure-elastic-san/elastic-san-datastore-list-ellipsis-removal.png":::
   
1. Optionally you can delete the volume you previously created in your Elastic SAN.
	> [!NOTE]
	> This operation can't be completed if virtual machines or virtual disks reside on an Elastic SAN VMFS Datastore.
