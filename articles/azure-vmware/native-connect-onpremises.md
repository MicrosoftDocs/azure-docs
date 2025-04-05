---
title: Connect to On-Premises environment
description: Learn how to connect your on-premises environment to Azure VMware Solution using ExpressRoute or Site-to-Site VPN for seamless integration.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/14/2025
ms.custom: engagement-fy25
#customer intent: As an IT administrator, I want to connect my on-premises environment to Azure VMware Solution in an Azure Virtual Network so that I can extend my infrastructure seamlessly.
---

# Connect to an on-premises environment

You require network connectivity between the private cloud and other networks you deployed in an Azure Virtual Network, on-premises, other Azure VMware Solution private clouds, or on the Internet. In this article, you learn how the private cloud gets connectivity to your on-premises environments.

## Prerequisites

- Ensure you have an Azure VMware Solution private cloud in an Azure Virtual Network deployed successfully within your Azure Virtual Network.
- Ensure that you have a Virtual Network and a Virtual Network gateway created and fully provisioned. Follow the instructions to create a Virtual Network gateway for ExpressRoute. A Virtual Network gateway for ExpressRoute uses the GatewayType ExpressRoute, not VPN.
- Ensure you have an active ExpressRoute circuit provisioned.

## Connect to an on-premises environment

Connectivity to on-premises is performed using a standard ExpressRoute connection or Site-to-Site VPN. This is similar to the way customers establish connectivity between Azure Virtual Network and on-premises connectivity as described in the Azure Virtual Network documentation.

> [!NOTE]
> You can connect through VPN, but that information is out of scope for this article.

:::image type="content" source="./media/native-connectivity/native-connect-onpremise.png" alt-text="Diagram of an Azure VMware Solution connection to on-premise environment":::
