---
title: Connect to On-premises environment
description: Learn how to connect your on-premises environment to Azure VMware Solution using ExpressRoute or Site-to-Site VPN for seamless integration.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/14/2025
ms.custom: engagement-fy25
#customer intent: As an IT administrator, I want to connect my on-premises environment to Azure VMware Solution in an Azure virtual network so that I can extend my infrastructure seamlessly.
---

# Connect to On-premises environment

In this article, you learn how the private cloud gets connectivity to your on-premises environments. It discusses how you deploy Azure VMware Solution on an Azure virtual network. You may need to have network connectivity between the private cloud and other networks you have on Azure virtual network, on-premises, other Azure VMware Solution private clouds, or on the Internet. 

## Prerequisites

- Have Azure VMware Solution on native private cloud deployed successfully within your Azure virtual network.
- Ensure that you have a virtual network and a virtual network gateway created and fully provisioned. Follow the instructions to create a virtual network gateway for ExpressRoute. A virtual network gateway for ExpressRoute uses the GatewayType ExpressRoute, not VPN.
- You must have an active ExpressRoute circuit.

## Connect to an on-premises environment

The Azure VMware Solution on native connectivity to on-premises is done using a standard ExpressRoute connection or Site-to-Site VPN. This is similar to the way customers have been establishing connectivity between Azure Virtual Network (virtual network) and on-premises connectivity as described in the Azure virtual network documentation.

> [!NOTE]
> You can connect through VPN, but that information is out of scope for this article.

:::image type="content" source="./media/native-connectivity/native-connect-onpremise.png" alt-text="Diagram of an Azure VMware Solution connection to on-premise environment":::
