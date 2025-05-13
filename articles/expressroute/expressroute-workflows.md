---
title: 'Azure ExpressRoute: Circuit configuration workflow'
description: This page shows the workflow for configuring ExpressRoute circuits and peerings
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 01/31/2025
ms.author: duau
---
# ExpressRoute workflows for circuit provisioning and circuit states
This article provides a high-level overview of the workflows for service provisioning and routing configuration for ExpressRoute circuits.

## Workflow steps

### 1. Prerequisites

Ensure the following prerequisites are met. For a complete list, see [Prerequisites and checklist](expressroute-prerequisites.md).

* An Azure subscription is created.
* Physical connectivity is established with the ExpressRoute partner or configured via ExpressRoute Direct. Review [Locations and partners](expressroute-locations-providers.md#partners) for details.

### 2. Order connectivity or configure ExpressRoute Direct

Order connectivity from the service provider or configure ExpressRoute Direct.

#### ExpressRoute partner model

Order connectivity from the service provider. Contact your provider for details.

* Select the ExpressRoute partner
* Select the peering location
* Select the bandwidth
* Select the billing model
* Choose standard or premium add-on

#### ExpressRoute Direct model

* View available ExpressRoute Direct capacity.
* Reserve ports by creating the ExpressRoute Direct resource in your Azure subscription.
* Request and receive the Letter of Authorization and order the physical cross connections.
* Enable admin state and monitor using [Azure Monitor](expressroute-monitoring-metrics-alerts.md#expressroute-direct-metrics).

### 3. Create an ExpressRoute circuit

#### ExpressRoute partner model

Verify readiness with the ExpressRoute partner. Follow [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) to create your circuit.

#### ExpressRoute Direct model

Ensure physical link and admin state are enabled. Follow [How to configure ExpressRoute Direct](how-to-expressroute-direct-portal.md). Use [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) to create your circuit.

### 4. Service provider provisions connectivity

For the ExpressRoute partner model:

* Provide the service key (s-key) to the provider.
* Provide additional information (for example, VLAN ID).
* If the provider manages to route, provide necessary details.

Verify provisioning using PowerShell, the Azure portal, or CLI.

### 5. Configure routing domains

Configure routing domains. If the provider manages Layer 3 configuration, they handle routing. Otherwise, follow [Routing requirements](expressroute-routing.md) and [Routing configuration](expressroute-howto-routing-arm.md).

#### Azure private peering

Enable private peering for VMs and cloud services within the Azure virtual network.

* IPv4 subnets:
    * Peering subnet for path 1 (/30)
    * Peering subnet for path 2 (/30)
* IPv6 subnets (optional):
    * Peering subnet for path 1 (/126)
    * Peering subnet for path 2 (/126)
* VLAN ID for peering
* ASN for peering
* ExpressRoute ASN = 12076
* MD5 Hash (Optional)

#### Microsoft peering

Enable this peering for Microsoft online services and Azure PaaS services. Ensure separate proxy/edge for ExpressRoute and Internet to avoid asymmetric routing.

* IPv4 subnets:
    * Peering subnet for path 1 (/30) - public IP
    * Peering subnet for path 2 (/30) - public IP
* IPv6 subnets (optional):
    * Peering subnet for path 1 (/126) - public IP
    * Peering subnet for path 2 (/126) - public IP
* VLAN ID for peering
* ASN for peering
* Advertised prefixes - public IP prefixes
* Customer ASN (optional if different from peering ASN)
* RIR / IRR for IP and ASN validation
* ExpressRoute ASN = 12076
* MD5 Hash (Optional)

### 6. Start using the ExpressRoute circuit

* Link Azure virtual networks to your ExpressRoute circuit for on-premises connectivity. See [Link a virtual network to a circuit](expressroute-howto-linkvnet-arm.md).
* Connect to Azure and Microsoft cloud services through Microsoft peering.

## ExpressRoute partner circuit provisioning states

ExpressRoute partner circuits have two states:

* **ServiceProviderProvisioningState**: State on the provider's side (*NotProvisioned*, *Provisioning*, *Provisioned*). Must be *Provisioned* to configure peering.
* **Status**: Microsoft's provisioning state, set to Enabled when the circuit is created.

### Possible states of an ExpressRoute circuit

**At creation time**

```output
ServiceProviderProvisioningState : NotProvisioned
Status                           : Enabled
```

**During provisioning**

```output
ServiceProviderProvisioningState : Provisioning
Status                           : Enabled
```

**After provisioning**

```output
ServiceProviderProvisioningState : Provisioned
Status                           : Enabled
```

**During deprovisioning**

```output
ServiceProviderProvisioningState : NotProvisioned
Status                           : Enabled
```

> [!IMPORTANT]
> A circuit can't be deleted when the ServiceProviderProvisioningState is Provisioning or Provisioned. The provider must deprovision the circuit first. Microsoft continues billing until the circuit is deleted in Azure.

## Routing session configuration state

The BGP provisioning state must be enabled for private or Microsoft peering. Check the BGP session state, especially for Microsoft peering. The advertised public prefixes state must be *configured* for routing to work.

If the advertised public prefixes state is *validation needed*, the BGP session isn't enabled.

> [!IMPORTANT]
> If the advertised public prefixes state is *manual validation*, open a support ticket with [Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) and provide evidence of IP address ownership and associated ASN.
> 

## Next steps

* Configure your ExpressRoute connection.
  
  * [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md)
  * [Configure routing](expressroute-howto-routing-arm.md)
  * [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
