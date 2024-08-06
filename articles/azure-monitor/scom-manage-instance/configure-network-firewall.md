---
ms.assetid: 
title: Configure the network firewall for Azure Monitor SCOM Managed Instance
description: This article describes how to configure the network firewall.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Configure the network firewall for Azure Monitor SCOM Managed Instance

This article describes how to configure the network firewall and Azure network security group (NSG) rules.

> [!NOTE]
> To learn about the Azure Monitor SCOM Managed Instance architecture, see [Azure Monitor SCOM Managed Instance](overview.md).

## Network prerequisites

This section discusses network prerequisites with three network model examples.

### Establish direct connectivity (line of sight) between your domain controller and the Azure network

Ensure that there's direct network connectivity (line of sight) between the network of your desired domain controller and the Azure subnet (virtual network) where you want to deploy an instance of SCOM Managed Instance. Ensure that there's direct network connectivity (line of sight) between the workloads/agents and the Azure subnet in which the SCOM Managed Instance is deployed.

Direct connectivity is required so that all your following resources can communicate with each other over the network:

- Domain controller
- Agents
- System Center Operations Manager components, such as the Operations console
- SCOM Managed Instance components, such as management servers

The following three distinct network models are visually represented to create the SCOM Managed Instance.

#### Network model 1: The domain controller is located on-premises

In this model, the desired domain controller is located within your on-premises network. You must establish an Azure ExpressRoute connection between your on-premises network and the Azure subnet used for the SCOM Managed Instance.

If your domain controller and other component are on-premises, you must establish the line of sight through ExpressRoute or a virtual private network (VPN). For more information, see [ExpressRoute documentation](/azure/expressroute/) and [Azure VPN Gateway documentation](/azure/vpn-gateway/).

The following network model shows where the desired domain controller is situated within the on-premises network. A direct connection exists (via ExpressRoute or VPN) between the on-premises network and the Azure subnet that's used for SCOM Managed Instance creation.

:::image type="Network model 1" source="media/configure-network-firewall/network-model-1-inline.png" alt-text="Screenshot that shows the network model 1 with the domain controller located on-premises." lightbox="media/configure-network-firewall/network-model-1-expanded.png":::

#### Network model 2: The domain controller is hosted in Azure

In this configuration, the designated domain controller is hosted in Azure, and you must establish an ExpressRoute or VPN connection between your on-premises network and the Azure subnet. It's used for the SCOM Managed Instance creation and the Azure subnet that's used for the designated domain controller. For more information, see [ExpressRoute](/azure/expressroute/) and [VPN Gateway](/azure/vpn-gateway/).

In this model, the desired domain controller remains integrated into your on-premises domain forest. However, you chose to create a dedicated Active Directory controller in Azure to support Azure resources that rely on the on-premises Active Directory infrastructure.

:::image type="Network model 2" source="media/configure-network-firewall/network-model-2-inline.png" alt-text="Screenshot that shows the network model 2 with the domain controller hosted in Azure." lightbox="media/configure-network-firewall/network-model-2-expanded.png":::

### Network model 3: The domain controller and SCOM Managed Instances are in Azure virtual networks

In this model, both the desired domain controller and the SCOM Managed Instances are placed in separate and dedicated virtual networks in Azure.

If the domain controller you want and all other components are in the same virtual network of Azure (a conventional active domain controller) with no presence on-premises, you already have a line of sight between all your components.

If the domain controller you want and all other components are in different virtual networks of Azure (a conventional active domain controller) with no presence on-premises, you need to do virtual network peering between all the virtual networks that are in your network. For more information, see [Virtual network peering in Azure](/azure/virtual-network/virtual-network-peering-overview).

:::image type="Network model 3" source="media/configure-network-firewall/network-model-3-inline.png" alt-text="Screenshot that shows the network model 3 with the domain controller and SCOM Managed Instances in Azure virtual networks." lightbox="media/configure-network-firewall/network-model-3-expanded.png":::

Take care of the following issues for all three networking models mentioned earlier:

1. Ensure that the SCOM Managed Instance subnet can establish connectivity to the designated domain controller configured for Azure or SCOM Managed Instance. Also, ensure that domain name resolution within the SCOM Managed Instance subnet lists the designated domain controller as the top entry among the resolved domain controllers to avoid network latency or performance and firewall issues.

1. The following ports on the designated domain controller and Domain Name System (DNS) must be accessible from the SCOM Managed Instance subnet:
     - TCP port 389 or 636 for LDAP
     - TCP port 3268 or 3269 for global catalog
     - TCP and UDP port 88 for Kerberos
     - TCP and UDP port 53 for DNS
     - TCP 9389 for Active Directory web service
     - TCP 445 for SMB
     - TCP 135 for RPC

       The internal firewall rules and NSG must allow communication from the SCOM Managed Instance virtual network and the designated domain controller/DNS for all the ports listed earlier.

1. The Azure SQL Managed Instance virtual network and SCOM Managed Instance must be peered to establish connectivity. Specifically, the port 1433 (private port) or 3342 (public port) must be reachable from the SCOM Managed Instance to the SQL managed instance. Configure the NSG rules and firewall rules on both virtual networks to allow ports 1433 and 3342.

1. Allow communication on ports 5723, 5724, and 443 from the machine being monitored to SCOM Managed Instance.

      - If the machine is on-premises, set up the NSG rules and firewall rules on the SCOM Managed Instance subnet and on the on-premises network where the monitored machine is located to ensure specified essential ports (5723, 5724, and 443) are reachable from the monitored machine to the SCOM Managed Instance subnet.
      
      - If the machine is in Azure, set up the NSG rules and firewall rules on the SCOM Managed Instance virtual network and on the virtual network where the monitored machine is located to ensure specified essential ports (5723, 5724, and 443) are reachable from the monitored machine to the SCOM Managed Instance subnet.

## Firewall requirements

To function properly, SCOM Managed Instance must have access to the following port number and URLs. Configure the NSG and firewall rules to allow this communication.  

|Resource|Port|Direction|Service Tags|Purpose|
|---|---|---|---|---|
|*.blob.core.windows.net|443|Outbound|Storage|Azure Storage|
|management.azure.com|443|Outbound|AzureResourceManager|Azure Resource Manager|
|gcs.prod.monitoring.core.windows.net <br/> *.prod.warm.ingest.monitor.core.windows.net|443|Outbound|AzureMonitor|SCOM MI Logs|
|*.prod.microsoftmetrics.com <br/> *.prod.hot.ingest.monitor.core.windows.net <br/> *.prod.hot.ingestion.msftcloudes.com|443|Outbound|AzureMonitor|SCOM MI Metrics|
|*.workloadnexus.azure.com|443|Outbound| |Nexus Service|
|*.azuremonitor-scommiconnect.azure.com|443|Outbound| |Bridge Service|

> [!IMPORTANT]
> To minimize the need for extensive communication with both your Active Directory admin and the network admin, see [Self-verification](self-verification-steps.md). The article outlines the procedures that the Active Directory admin and the network admin use to validate their configuration changes and ensure their successful implementation. This process reduces unnecessary back-and-forth interactions from the Operations Manager admin to the Active Directory admin and the network admin. This configuration saves time for the admins.

## Next steps

- [Verify Azure and internal GPO policies](verify-azure-internal-group-policy-object-policies.md)
