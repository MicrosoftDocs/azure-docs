---
title: 'Azure ExpressRoute: Circuit configuration workflow'
description: This page shows the workflow for configuring ExpressRoute circuits and peerings
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: conceptual
ms.date: 06/30/2023
ms.author: duau
---
# ExpressRoute workflows for circuit provisioning and circuit states

This article walks you through service provisioning and routing configuration workflows at a high level. The following sections outline the tasks to provision an ExpressRoute circuit end-to-end.

## Workflow steps

### 1. Prerequisites

Ensure that the prerequisites are met. For a full list, see [Prerequisites and checklist](expressroute-prerequisites.md).

* An Azure subscription has been created.
* Physical connectivity has been established with the ExpressRoute partner or configured via ExpressRoute Direct. Review location, see [Locations and partners](expressroute-locations-providers.md#partners) to view ExpressRoute partner and ExpressRoute Direct connectivity across peering locations.

### 2. Order connectivity or configure ExpressRoute Direct

Order connectivity from the service provider or configure ExpressRoute Direct.

#### ExpressRoute partner model

Order connectivity from the service provider. This process varies. Contact your connectivity provider for more details about how to order connectivity.

* Select the ExpressRoute partner
* Select the peering location
* Select the bandwidth
* Select the billing model
* Select standard or premium add-on

#### ExpressRoute Direct model

* View available ExpressRoute Direct capacity across peering locations.
* Reserve ports by creating the ExpressRoute Direct resource in your Azure subscription.
* Request and receive the Letter of Authorization and order the physical cross connections from the peering location provider.
* Enable admin state and view light levels and physical link using [Azure Monitor](expressroute-monitoring-metrics-alerts.md#expressroute-direct-metrics).

### 3. Create an ExpressRoute circuit

#### ExpressRoute partner model

Verify that the ExpressRoute partner is ready to provision connectivity. Your ExpressRoute circuit is billed from the moment a service key is issued. Use the instructions in [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) to create your circuit.

#### ExpressRoute Direct model

Ensure that the physical link and admin state are enabled across both links. Refer to [How to configure ExpressRoute Direct](how-to-expressroute-direct-portal.md) for guidance. Your ExpressRoute circuit is billed from the moment a service key is issued. Use the instructions in [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) to create your circuit.

### 4. Service provider provisions connectivity

This section only pertains to the ExpressRoute partner connectivity model:

* Provide the service key (s-key) to the connectivity provider.
* Provide additional information needed by the connectivity provider (for example, VPN ID).
* If the provider manages the routing configuration, provide the necessary details.

You can ensure that the circuit has been provisioned successfully by verifying the ExpressRoute circuit provisioning state using PowerShell, the Azure portal or, CLI.

### 5. Configure routing domains

Configure routing domains. If your connectivity provider manages Layer 3 configuration, they configure routing for your circuit. If your connectivity provider only offers Layer 2 services or if you're using ExpressRoute Direct, you must configure routing per the guidelines described in the [Routing requirements](expressroute-routing.md) and [Routing configuration](expressroute-howto-routing-classic.md) articles.

#### For Azure private peering

Enable private peering to connect to VMs and cloud services deployed within the Azure virtual network.

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

#### For Microsoft peering

Enable this peering to access Microsoft online services, such as Microsoft 365. Additionally, all Azure PaaS services are accessible through Microsoft peering. You must ensure that you use a separate proxy/edge to connect to Microsoft than the one you use for the Internet. Using the same edge for both ExpressRoute and the Internet causes asymmetric routing and you experience connectivity issues for your network.

* IPv4 subnets:
    * Peering subnet for path 1 (/30) - must be public IP
    * Peering subnet for path 2 (/30) - must be public IP
* IPv6 subnets (optional):
    * Peering subnet for path 1 (/126) - must be public IP
    * Peering subnet for path 2 (/126) - must be public IP
* VLAN ID for peering
* ASN for peering
* Advertised prefixes - must be public IP prefixes
* Customer ASN (optional if different from peering ASN)
* RIR / IRR for IP and ASN validation
* ExpressRoute ASN = 12076
* MD5 Hash (Optional)

### 6. Start using the ExpressRoute circuit

* You can link Azure virtual networks to your ExpressRoute circuit to enable connectivity from on-premises to the Azure virtual network. Refer to the [Link a VNet to a circuit](expressroute-howto-linkvnet-arm.md) article for guidance. These VNets can either be in the same Azure subscription as the ExpressRoute circuit, or can be in a different subscription.
* Connect to Azure services and Microsoft cloud services through Microsoft peering.

##  <a name="expressroute-circuit-provisioning-states"></a>ExpressRoute partner circuit provisioning states

The following section outlines the different ExpressRoute circuit states for the ExpressRoute partner connectivity model.
Each ExpressRoute partner circuit has two states:

* **ServiceProviderProvisioningState** represents the state on the connectivity provider's side. It can either be *NotProvisioned*, *Provisioning*, or *Provisioned*. The ExpressRoute circuit must be in a Provisioned state in order to configure peering. **This state only pertains to ExpressRoute partner circuits and is not displayed in the properties of an ExpressRoute Direct circuit**.

* **Status** represents Microsoft's provisioning state. This property is set to Enabled when you create an ExpressRoute circuit

### Possible states of an ExpressRoute circuit

This section outlines the possible states of an ExpressRoute circuit created under the ExpressRoute partner connectivity model.

**At creation time**

The ExpressRoute circuit reports the following states at resource creation.

```output
ServiceProviderProvisioningState : NotProvisioned
Status                           : Enabled
```

**When the connectivity provider is in the process of provisioning the circuit**

The ExpressRoute circuit reports the following states while the connectivity provider is working to provision the circuit.

```output
ServiceProviderProvisioningState : Provisioning
Status                           : Enabled
```

**When the connectivity provider has completed the provisioning process**

The ExpressRoute circuit reports the following states once the connectivity provider has successfully provisioned the circuit.

```output
ServiceProviderProvisioningState : Provisioned
Status                           : Enabled
```

**When the connectivity provider is deprovisioning the circuit**

If the ExpressRoute circuit needs to be deprovisioned, the circuit reports the following states once the service provider has completed the deprovisioning process.

```output
ServiceProviderProvisioningState : NotProvisioned
Status                           : Enabled
```

You can choose to re-enable it if needed, or run PowerShell cmdlets to delete the circuit.  

> [!IMPORTANT]
> A circuit cannot be deleted when the ServiceProviderProvisioningState is Provisioning or Provisioned. The connectivity provider needs to deprovision the circuit before it can be deleted. Microsoft will continue to bill the circuit until the ExpressRoute circuit resource is deleted in Azure.
> 

## Routing session configuration state

The BGP provisioning state reports if the BGP session has been enabled on the Microsoft Edge. The state must be enabled to use private or Microsoft peering.

It's important to check the BGP session state especially for Microsoft peering. In addition to the BGP provisioning state, there's another state called *advertised public prefixes state*. The advertised public prefixes state must be in the *configured* state, both for the BGP session to be up and for your routing to work end-to-end. 

If the advertised public prefix state is set to a *validation needed* state, the BGP session isn't enabled, as the advertised prefixes didn't match the AS number in any of the routing registries.

> [!IMPORTANT]
> If the advertised public prefixes state is in *manual validation* state, you need to open a support ticket with [Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) and provide evidence that you own the IP addresses advertised along with the associated Autonomous System number.
> 

## Next steps

* Configure your ExpressRoute connection.
  
  * [Create an ExpressRoute circuit](expressroute-howto-circuit-arm.md)
  * [Configure routing](expressroute-howto-routing-arm.md)
  * [Link a VNet to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
