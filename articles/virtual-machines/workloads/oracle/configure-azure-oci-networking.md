---
title: Connect Azure ExpressRoute with Oracle Cloud Infrastructure | Microsoft Docs
description: Connect Azure ExpressRoute with Oracle Cloud Infrastructure (OCI) FastConnect to enable cross-cloud Oracle application solutions.
author: jjaygbay1
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 04/16/2023
ms.author: jacobjaygbay

---

# Set up a direct interconnection between Azure and Oracle Cloud Infrastructure  

**Applies to:** :heavy_check_mark: Linux VMs

To create an [integrated multicloud experience](oracle-oci-overview.md), Microsoft and Oracle offer direct interconnection between Azure and Oracle Cloud Infrastructure (OCI) through [ExpressRoute](../../../expressroute/expressroute-introduction.md) and [FastConnect](https://docs.cloud.oracle.com/iaas/Content/Network/Concepts/fastconnectoverview.htm). Through the ExpressRoute and FastConnect interconnection, you can experience low latency, high throughput, private direct connectivity between the two clouds.

> [!IMPORTANT]
> Oracle has certified these applications to run in Azure when using the Azure / Oracle Cloud interconnect solution:
>
> - E-Business Suite
> - JD Edwards EnterpriseOne
> - PeopleSoft
> - Oracle Retail applications
> - Oracle Hyperion Financial Management

The following image shows a high-level overview of the interconnection:

:::image type="content" source="https://user-images.githubusercontent.com/37556655/115093592-bced0180-9ecf-11eb-976d-9d4c7a1be2a8.png" alt-text="Diagram shows cross-cloud network connection that uses FastConnect and ExpressRoute." lightbox="https://user-images.githubusercontent.com/37556655/115093592-bced0180-9ecf-11eb-976d-9d4c7a1be2a8.png":::

> [!NOTE]
> The ExpressRoute connection seen in the diagram is a regular [ExpressRoute circuit](../../../expressroute/expressroute-introduction.md) and supports all fuctionality, such as Global Reach.
>

## Prerequisites

- To establish connectivity between Azure and OCI, you must have an active Azure subscription and an active OCI tenancy.

- Connectivity is only possible where an Azure ExpressRoute peering location is in proximity to or in the same peering location as the OCI FastConnect. See [Region Availability](oracle-oci-overview.md#region-availability).

## Configure direct connectivity between ExpressRoute and FastConnect

Create a standard ExpressRoute circuit on your Azure subscription under a resource group. For more information, see [Create and modify an ExpressRoute circuit](../../../expressroute/expressroute-howto-circuit-portal-resource-manager.md).

1. In the Azure portal, enter *ExpressRoute* in the search bar, and then select **ExpressRoute circuits**.
1. Under **Express Route circuits**, select **Create**.
1. Select your subscription, enter or create a resource group, and enter a name for your ExpressRoute. Select **Next: Configuration** to continue.
1. Select **Oracle Cloud FastConnect** as the service provider and select your peering location.
1. An Azure ExpressRoute circuit provides granular bandwidth options. FastConnect supports 1, 2, 5, or 10 Gbps. For **Bandwidth**, choose one of these matching bandwidth options.

   :::image type="content" source="media/configure-azure-oci-networking/exr-create-new.png" alt-text="Screenshot shows the Create ExpressRoute circuit dialog." lightbox ="media/configure-azure-oci-networking/exr-create-new.png":::

1. Select **Review + create** to create your ExpressRoute.

After you create your ExpressRoute, configure direct connectivity between ExpressRoute and FastConnect.

1. Go to your new ExpressRoute and find the **Service key**. You need to provide the key while configuring your FastConnect circuit.

   :::image type="content" source="media/configure-azure-oci-networking/exr-service-key.png" alt-text="Screenshot shows the Oracle ExpressRoute circuit with Service key." lightbox="media/configure-azure-oci-networking/exr-service-key.png":::

   > [!IMPORTANT]
   > You are billed for ExpressRoute charges as soon as the ExpressRoute circuit is provisioned, even if **Provider Status** is **Not Provisioned**.

1. Carve out two private IP address spaces of `/30` each. Be sure that the spaces don't overlap with your Azure virtual network or OCI virtual cloud network IP Address space. The first IP address space is the *primary address space* and the second IP address space is the *secondary address space*. You need these addresses when you configure your FastConnect circuit.
1. Create a Dynamic Routing Gateway (DRG). You need this gateway when you create your FastConnect circuit. For more information, see [Dynamic Routing Gateway](https://docs.cloud.oracle.com/iaas/Content/Network/Tasks/managingDRGs.htm).
1. Create a FastConnect circuit under your Oracle tenant. For more information, see [Access to Microsoft Azure](https://docs.cloud.oracle.com/iaas/Content/Network/Concepts/azure.htm).
  
   1. Under FastConnect configuration, select **Microsoft Azure: ExpressRoute** as the provider.
   1. Select the Dynamic Routing Gateway that you provisioned in the previous step.
   1. Select the bandwidth to be provisioned. For optimal performance, the bandwidth must match the bandwidth selected when creating the ExpressRoute circuit.
   1. In **Provider Service Key**, paste the ExpressRoute service key.
   1. Use the first `/30` private IP address space carved out in a previous step for the **Primary BGP IP Address** and the second `/30` private IP address space for the **Secondary BGP IP Address**.
   1. Assign the first useable address of the two ranges for the Oracle BGP IP Address (primary and secondary) and the second address to the customer BGP IP Address from a FastConnect perspective. The first useable IP address is the second IP address in the `/30` address space. Microsoft reserves the first IP address.
   1. Select **Create**.

1. Complete linking the FastConnect to virtual cloud network under your Oracle tenant with Dynamic Routing Gateway, using Route Table.
1. Navigate to Azure and ensure that the **Provider Status** for your ExpressRoute circuit has changed to **Provisioned** and that a peering of type **Azure private** has been provisioned. This status is a prerequisite for the following step.

   :::image type="content" source="media/configure-azure-oci-networking/exr-provider-status.png" alt-text="Screenshot shows the Oracle ExpressRoute circuit with the ExpressRoute provider status highlighted." lightbox="media/configure-azure-oci-networking/exr-provider-status.png":::

1. Select the **Azure private** peering. You see the peering details have automatically been configured based on the information you entered when setting up your FastConnect circuit.

   :::image type="content" source="media/configure-azure-oci-networking/exr-private-peering.png" alt-text="Screenshot shows private peering settings." lightbox="media/configure-azure-oci-networking/exr-private-peering.png":::

## Connect virtual network to ExpressRoute

Create a virtual network and virtual network gateway, if you haven't already. For more information, see [Configure a virtual network gateway for ExpressRoute using the Azure portal](../../../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md).

Set up the connection between the virtual network gateway and your ExpressRoute circuit by using the [Terraform script](https://github.com/microsoft/azure-oracle/tree/master/InterConnect-2) or by using the PowerShell command to [Configure ExpressRoute FastPath](../../../expressroute/expressroute-howto-linkvnet-arm.md#configure-expressroute-fastpath).

Once you have completed the network configuration, you can verify your configuration by selecting **Get ARP Records** and **Get route table** under the ExpressRoute Private peering page in the Azure portal.

## Automation

Microsoft has created Terraform scripts to enable automated deployment of the network interconnect. The Terraform scripts need to authenticate with Azure before they run, because they require adequate permissions on the Azure subscription. Authentication can be performed using an [Azure Active Directory service principal](../../../active-directory/develop/app-objects-and-service-principals.md#service-principal-object) or using the Azure CLI. For more information, see [CLI Authentication](https://www.terraform.io/cli/auth).

For the Terraform scripts and related documentation to deploy the inter-connect, see [Azure-OCI Cloud Inter-Connect](https://aka.ms/azureociinterconnecttf).

## Monitoring

Installing agents on both the clouds, you can use Azure [Network Performance Monitor](../../../expressroute/how-to-npm.md) to monitor the performance of the end-to-end network. Network Performance Monitor helps you to readily identify network issues, and helps eliminate them.

## Delete the interconnect link

To delete the interconnect, perform these steps in the order given. Failure to do so results in a *failed state* ExpressRoute circuit.

1. Delete the ExpressRoute connection. Delete the connection by selecting the **Delete** icon on the page for your connection. For more information, see [Clean up resources](../../../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md#clean-up-resources).
1. Delete the Oracle FastConnect from the Oracle Cloud Console.
1. Once the Oracle FastConnect circuit has been deleted, you can delete the Azure ExpressRoute circuit.

The delete and deprovisioning process is complete.

## Next steps

- For more information about the cross-cloud connection between OCI and Azure, see [Access to Microsoft Azure](https://docs.cloud.oracle.com/iaas/Content/Network/Concepts/azure.htm).
- Use Terraform scripts to deploy infrastructure for targeted Oracle applications over Azure, and configure the network interconnect. For more information, see [Azure-OCI Cloud Inter-Connect](https://aka.ms/azureociinterconnecttf).
