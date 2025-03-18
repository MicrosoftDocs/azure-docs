---
title: Connect Azure VMware Solution on Native private cloud to previous edition of Azure VMware Solution private cloud
description: Learn about connecting Azure VMware Solution on Native private cloud to previous edition of Azure VMware Solution private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/14/2025
ms.custom: engagement-fy25
---

# Connect Azure VMware Solution on Native private cloud to previous edition of Azure VMware Solution private cloud

After you deploy Azure VMware Solution on native private clouds, you may need to have network connectivity between the private cloud and other networks you have on Azure Virtual Network (virtual network), on-premises, other Azure VMware Solution private clouds, or the internet.  

This article focuses on how the Azure VMware Solution on native private cloud gets connectivity to the previous edition of (not on native) Azure VMware Solution private cloud. In this article, you learn to connect Azure VMware Solution on native private cloud to the previous edition of Azure VMware Solution private cloud.


## Prerequisite
- Have Azure VMware Solution on native and previous edition of private cloud deployed successfully.

## Connect Azure VMware Solution on Native Private Cloud to Previous Edition of Azure VMware Solution Private Cloud

Azure VMware Solution on native SDDC (shown on the right of the diagram) can be connected to the previous edition of Azure VMware Solution SDDC (shown on the left in the diagram) using a standard ExpressRoute connection, just like how you have been connecting earlier Azure VMware Solution editions to the virtual network.

See details on [Azure VMware Solution's previous edition ExpressRoute connectivity to ExpressRoute Gateway](/azure/azure-vmware/deploy-azure-vmware-solution?tabs=azure-portal#connect-to-azure-virtual-network-with-expressroute).

### The main steps are:
1. Have Azure VMware Solution private clouds deployed – Azure VMware Solution on native and Azure VMware Solution previous edition.
2. On Azure VMware Solution previous edition, request an ExpressRoute authorization key, and copy the authorization key and ExpressRoute ID.
3. Ensure an ExpressRoute gateway is present or create one on the Azure VNET/peered virtual network where Azure VMware Solution on native is deployed.
4. Add a connection to the ExpressRoute gateway using the ER authorization key and ExpressRoute ID from the previous step.

:::image type="content" source="./media/native-connectivity/native-connect-express-route-previous-edition.png" alt-text="Diagram showing an Azure VMware Solution connection to previous edition of private cloud."::: 
