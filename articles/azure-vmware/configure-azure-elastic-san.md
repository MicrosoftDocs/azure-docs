---
title: Configure Azure Elastic SAN (Preview)
description: Learn how to use Elastic SAN with Azure VMware Solution
ms.topic: how-to
ms.service: azure-vmware
ms.author: v-suzuber
ms.date: 11/07/2023
ms.custom: references_regions
---

# Configure Azure Elastic SAN (Preview)

In this article, learn how to configure Azure Elastic SAN or delete an Elastic SAN-based datastore.

## What is Azure Elastic SAN 

[Azure Elastic storage area network](https://review.learn.microsoft.com/azure/storage/elastic-san/elastic-san-introduction?branch=main) (SAN) addresses the problem of workload optimization and integration between your large scale databases and performance-intensive mission-critical applications. Azure Elastic SAN is a fully integrated solution that simplifies deploying, scaling, managing, and configuring a SAN. Azure Elastic SAN also offers built-in cloud capabilities, like high availability.

[Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/introduction) supports attaching iSCSI datastores as a persistent storage option. You can create Virtual Machine File System (VMFS) datastores with Azure Elastic SAN volumes and attach them to clusters of your choice. By using VMFS datastores backed by Azure Elastic SAN, you can expand your storage instead of scaling the clusters.

## Prerequisites

The following prerequisites are required to continue.

- Register for the preview by filling out the [form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR8FVh9RJVPdOk_mdTpp--pZUN0RKUklROEc4UE1RRFpRMkhNVFAySTM1TC4u).
- Verify you have a Dev/Test SDDC set up in one of the following regions:
	- East US
	- East US 2
	- South Central US
	- West US 2
	- West US 3
	- North Europe
	- West Europe
	- UK South
	- France Central
	- Sweden Central
	- Southeast Asia
	- Australia East
- Know the availability zone your SCCD is in. 
	- In the UI, select an Azure VMware Solution host.
	> [!NOTE]
	> The host exposes its Availability Zone. You should use that AZ when deploying other Azure resources for the same subscription.
- You have permission to set up new resources in the subscription your SDDC is in.
- Verify that you received an email confirmation that your subscription is now allowlisted.

## Set up Elastic SAN

In this section, you create a virtual network for your Elastic SAN. Then you create the Elastic SAN that includes creating at least one volume group and one volume that becomes your VMFS datastore. Next, you set up a Private Endpoint for your Elastic SAN that allows your SDDC to connect to the Elastic SAN volume. Then you're ready to add an Elastic SAN volume as a datastore in your SDDC.

1. Use one of the following instruction options to set up a dedicated virtual network for your Elastic SAN:
	- [Azure portal](https://learn.microsoft.com/azure/virtual-network/quick-create-portal)
	- [PowerShell](https://learn.microsoft.com/azure/virtual-network/quick-create-powershell)
	- [Azure CLI](https://learn.microsoft.com/azure/virtual-network/quick-create-cli)
2. Use one of the following instruction options to set up an Elastic SAN, your dedicated volume group, and initial volume in that group:
	> [!IMPORTANT]
	> Make sure to create this Elastic SAN in the same region and availability zone as your SDDC for best performance.
	- [Azure portal](https://learn.microsoft.com/azure/storage/elastic-san/elastic-san-create?tabs=azure-portal)
	- [PowerShell](https://learn.microsoft.com/azure/storage/elastic-san/elastic-san-create?tabs=azure-powershell)
	- [Azure CLI](https://learn.microsoft.com/azure/storage/elastic-san/elastic-san-create?tabs=azure-cli)
3. Use one of the following instructions to configure a Private Endpoint (PE) for your Elastic SAN:
	- [PowerShell](https://learn.microsoft.com/azure/storage/elastic-san/elastic-san-networking?tabs=azure-powershell#configure-a-private-endpoint)
	- [Azure CLI](https://learn.microsoft.com/azure/storage/elastic-san/elastic-san-networking?tabs=azure-cli#tabpanel_2_azure-cli)

## Add an Elastic SAN volume as a datastore

After you receive confirmation that your subscription is allowlisted, you can use the Azure portal to add the Elastic SAN volume as a datastore in your SDDC. Use the following steps to add, connect, disconnect, and delete Elastic SAN.

## Configure external storage address block

Start by providing an IP block for deploying external storage. Navigate to the **Storage** tab in your Azure VMware Solution private cloud in the Azure portal. The address block should be a /24 network. 

:::image type="content" source="media/configure-azure-elastic-san/configure-external-storage-address-block.png" alt-text="Screenshot showing External storage address block tab." border="false"lightbox="media/configure-azure-elastic-san/configure-external-storage-address-block.png":::

- The address block must be unique and not overlap with the /22 used to create your Azure VMware Solution private cloud or any other connected Azure virtual networks or on-premises network. 
- The address block must fall within the following allowed network blocks: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. If you want to use a non-RFC 1918 address block, submit a support request. 
- The address block can't overlap any of the following restricted network blocks: 100.72.0.0/15 
- The address block provided is used to enable multipathing from the ESXi hosts to the target, it can’t be edited or changed. If you do need to change it, submit a support request. 

After you provide an External storage address block, you can connect to an Elastic SAN volume from the same page.

## Connect Elastic SAN

1. From the left navigation in your Azure VMware Solution private cloud, select **Storage**, then **+ Connect Elastic SAN**.
2. Select your **Subscription**, **Resource**, **Volume Group**, **Volume(s)**, and **Client cluster**.
3. From section, "Rename datastore as per VMware requirements", under **Volume name** > **Data store name**, give names to the Elastic SAN volumes.
	> [!NOTE]
	> For best performance, verify that your Elastic SAN volume and SDDC are in the same Region and Availability Zone.

## Disconnect and delete an Elastic SAN-based datastore

To delete the Elastic SAN-based datastore, use the following steps from the Azure portal.

1. From the left navigation in your Azure VMware Solution private cloud, select **Storage**, then **Storage list**.
2. Under **Virtual network**, select **Disconnect** to disconnect the datastore from the Cluster(s).
3. Optionally you can delete the volume you previously created in your Elastic SAN.
