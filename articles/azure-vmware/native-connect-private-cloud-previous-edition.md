---
title: Connect Azure VMware Solution in an Azure Virtual Network to previous editions of the Azure VMware Solution private cloud
description: Learn about connecting Azure VMware Solution on Native private cloud to previous edition of Azure VMware Solution private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/14/2025
ms.author: jacobjaygbay
#customer intent: As a cloud administrator, I want to connect Azure VMware Solution on Native private cloud to previous edition of Azure VMware Solution private cloud so that I can enable seamless communication between private clouds.
---

# Connect Azure VMware Solution in an Azure Network Network private cloud to previous edition of Azure VMware Solution private cloud

In this article, you learn how to connect Azure VMware Solution private cloud in an Azure Virtual Network to the previous edition of Azure VMware Solution private cloud. After you deploy Azure VMware Solution in an Azure Virtual Network private clouds, you may need to have network connectivity between the private cloud and other networks you have on Azure Virtual Network, on-premises, other Azure VMware Solution private clouds, or the internet.  

This article discusses how the Azure VMware Solution in an Azure Virtual Network private cloud gets connectivity to the previous edition of (not in an Azure Virtual Network) Azure VMware Solution private cloud. 

## Prerequisite

Have Azure VMware Solution in an Azure Virtual Network and previous edition of the private cloud deployed successfully.

## Connect Azure VMware Solution in an Azure Network Network private cloud to previous edition of Azure VMware Solution private cloud

Azure VMware Solution in an Azure Virtual Network can be connected to the previous edition of Azure VMware Solution using a standard ExpressRoute connection, similar to how earlier Azure VMware Solution editions connect to the Virtual Network.

For more information about how to connect Virtual Networks using ExtressRoute, see [Azure VMware Solution's previous edition ExpressRoute connectivity to ExpressRoute Gateway](/azure/azure-vmware/deploy-azure-vmware-solution?tabs=azure-portal#connect-to-azure-virtual-network-with-expressroute).

### The steps are as follows:
1. Both types of Azure VMware Solution private clouds deployed; Azure VMware Solution in an Azure Virtual Network and Azure VMware Solution previous edition.
2. On Azure VMware Solution previous edition, request an ExpressRoute authorization key, and copy the authorization key and ExpressRoute ID.
3. Ensure an ExpressRoute gateway is present or create one on the Azure VNET/peered Virtual Network where Azure VMware Solution in an Azure Virtual Network is deployed.
4. Add a connection to the ExpressRoute gateway using the ER authorization key and ExpressRoute ID from the previous step.

:::image type="content" source="./media/native-connectivity/native-connect-express-route-previous-edition.png" alt-text="Diagram showing an Azure VMware Solution connection to previous edition of private cloud."::: 
