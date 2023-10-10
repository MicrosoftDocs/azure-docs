---
title: Migrate to a new ExpressRoute circuit
description: Learn how to migrate your ExpressRoute circuit from one circuit to another with minimum service interruption.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: conceptual
ms.date: 10/06/2023
ms.author: duau
---

# Migrate to a new ExpressRoute circuit

If you want to switch from one ExpressRoute circuit to another, you may want to do it smoothly with minimum service interruption. This document helps you to follow the steps to migrate your production traffic without causing major disruptions or risks. You can use this method whether you're moving to a new or the same peering location.

If you've got your ExpressRoute circuit through a Layer 3 service provider, create the new circuit under your subscription in the Azure portal. Work with your service provider to switch the traffic seamlessly to the new circuit. After the service provider has deprovisioned your old circuit, delete it from the Azure portal.

The rest of the article applies to you if you've got your ExpressRoute circuit through a Layer 2 service provider or ExpressRoute direct ports.

## Steps to seamlessly migrate your ExpressRoute circuit

:::image type="content" source="./media/circuit-migration/migrate-circuit.png" alt-text="Diagram showing an ExpressRoute circuit migration from Circuit A to Circuit B.":::

The diagram above illustrates the migration process from an existing ExpressRoute circuit, referred to as Circuit A, to a new ExpressRoute circuit, referred to as Circuit B. Circuit B can be in the same or a different peering location as Circuit A. The migration process consists of the following steps:

1. **Deploy Circuit B in isolation:** While the traffic continues to flow over Circuit A, deploy a new Circuit B without affecting the production environment.

1. **Block the production traffic flow over Circuit B:** Prevent any traffic from using Circuit B until it's fully tested and validated.

1. **Complete and validate end-to-end connectivity of Circuit B:** Ensure that Circuit B can establish and maintain a stable and secure connection with all the required endpoints.

1. **Switch over the traffic:** Redirect the traffic flow from Circuit A to Circuit B and block the traffic flow over Circuit A.

1. **Decommission Circuit A:** Remove Circuit A from the network and release its resources.

### Deploy new circuit in isolation

Follow the steps in [Create a circuit with ExpressRoute](expressroute-howto-circuit-portal-resource-manager.md), to create your new ExpressRoute circuit (Circuit B) in the desired peering location. Then, follow the steps in [Tutorial: Configure peering for ExpressRoute circuit](expressroute-howto-routing-portal-resource-manager.md) to configure the required peering types: private and Microsoft. 

To prevent the private peering production traffic from using Circuit B before testing and validating it, don't link virtual network gateway that has production deployment to Circuit B. Similarly to avoid Microsoft peering production traffic from using Circuit B, don't associate a route filter to Circuit B. 

### Block the production traffic flow over the newly created circuit

Prevent the route advertisement over the new peering(s) on the CE devices.

For Cisco IOS, you can use a `route-map` and a `prefix-list` to filter the routes advertised over a BGP peering. The following example shows how to create and apply a `route-map` and a `prefix-list` for this purpose:

```
route-map BLOCK ADVERTISEMENTS deny 10
 match ip address prefix-list BLOCK-ALL-PREFIXES

ip prefix-list BLOCK-ALL-PREFIXES seq 10 deny 0.0.0.0/0 le 32

router bgp <your_AS_number>
 neighbor <neighbor_IP_address> route-map BLOCK-ADVERTISEMENTS out
 neighbor <neighbor_IP_address> route-map BLOCK-ADVERTISEMENTS in
```

Use export/import policy to filter the routes advertised and received on the new peering(s) on the Junos devices. The following example shows how to configure export/import policy for this purpose:

```
user@router>show configuration policy-options policy-statement BLOCK-ALL-ROUTES

term reject-all {

    the reject;
}

protocols {
    bgp {
        group <your_group_name> {
            neighbor <neighbor_IP_address> {
                export [ BLOCK-ALL-ROUTES ];
                import [ BLOCK-ALL-ROUTES ];
            }
        }
    }
}
```
### Validate the end-to-end connectivity of the newly created circuit

#### Private Peering

Follow the steps in [Connect a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md) to link the new circuit to the gateway of a test virtual network and verify your private peering connectivity. After linking virtual networks to the circuit, examine the route table of the private peering of the circuit and verify that the address space of the virtual network is included in the table. The following example shows a route table of the private peering of an ExpressRoute circuit in the Azure Management portal:

:::image type="content" source="./media/circuit-migration/route-table.png" alt-text="Screenshot of the route table for the primary link of the ExpressRoute circuit.":::

The following diagram illustrates a test VM configured in a test virtual network and a test device located on-premises for verifying the connectivity over the ExpressRoute private peering.

:::image type="content" source="./media/circuit-migration/test-connectivity.png" alt-text="Diagram showing a VM in Azure communicating with a test device on-premises through the ExpressRoute connection.":::

Modify the route-map or the policy configuration that you have applied to filter the routes advertised and allow the specific IP address of the test device from on-premises. Similarly, allow the test virtual network’s address space from Azure.

```
route-map BLOCK ADVERTISEMENTS permit 5
 match ip address prefix-list PERMIT-ROUTE

route-map BLOCK ADVERTISEMENTS deny 10
 match ip address prefix-list BLOCK-ALL-PREFIXES

ip prefix-list PERMIT-ROUTE seq 10 permit 10.17.1.0/24
ip prefix-list PERMIT-ROUTE seq 20 permit 10.1.18.10/32

ip prefix-list BLOCK-ALL-PREFIXES seq 10 deny 0.0.0.0/0 le 32


```

To allow specific IP prefixes for test devices on Junos, configure a prefix-list. Then, configure the BGP import/export policy to allow these prefixes and reject everything else.

```
user@router>show configuration policy-options policy-statement BLOCK-ADVERTISEMENTS

term PERMIT-ROUTES {
    from {
        prefix-list PERMIT-ROUTE;
    }
    then accept;
}

term reject-all {
    then reject;
}

user@router>show configuration policy-options prefix-list PERMIT-ROUTE

10.1.18.10/32;
10.17.1.0/24;
```

Verify the end-to-end connectivity over the private peering. For example, you can ping the test VM in Azure from your on-premises test device and check the results. For step-by-step detailed validation, see [Verifying ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md).

#### Microsoft Peering

The verification of your Microsoft peering requires careful planning to avoid any effect on the production traffic. You need to use [distinct prefixes](expressroute-howto-routing-portal-resource-manager.md#to-create-microsoft-peering) for the Microsoft peering of Circuit B that are different from the ones used for Circuit A, to prevent any routing conflicts between the two circuits. You also need to link the Microsoft peering of Circuit B to a separate route filter than the one linked to Circuit A, following the steps in [configuring route filters for Microsoft peering](how-to-routefilter-portal.md). Additionally, you need to ensure that the route filters for both circuits don't have any common routes that are advertised to the on-premises network, to avoid asymmetrical routing between Circuit A and Circuit B. To achieve this, you can either: 
 - select a service or an Azure region for testing Circuit B that isn't used by the production traffic on Circuit A, or
 - minimize the overlap between the two route filters and permit only more specific test public endpoints received through Circuit B

Once you have linked a route filter, you need to check the routes that are advertised and received over the BGP peering on the CE device. To filter the routes that are advertised and allow only the on-premises prefixes of the Microsoft peering and the specific IP address of the selected Microsoft public endpoints for testing, you need to modify the route-map or the Junos policy configuration that you have applied.

To test the connectivity to Microsoft 365 endpoints, follow the steps in [Implementing ExpressRoute for Microsoft 365 – Build your test procedures](/microsoft-365/enterprise/implementing-expressroute#build-your-test-procedures). For Azure public endpoints, you could start with basic connectivity testing such as traceroute from on-premises and verify that the request goes over ExpressRoute endpoints. Beyond ExpressRoute endpoints, ICMP messages are suppressed over Microsoft network. You could also test the connectivity at the application level, in addition to basic ping tests. For instance, if you have an Azure VM with Azure public IP running a web server, you can try accessing the web server public IP from your on-premises network through the ExpressRoute connection. This helps you confirm that more complex traffic, such as HTTP requests, can reach Azure services.

### Switch over the production traffic

#### Private Peering

1. Disconnect Circuit B from any test virtual network gateways that you have connected it to.
1. Remove any exceptions that you have made to the Cisco route-maps or Junos policy.
1. Follow the steps in [Connect a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md) and connect Circuit B to production virtual network gateway(s).
1. On the CE, make sure that you're ready to advertise all the routes that you're currently advertising over Circuit A, over Circuit B when you remove the route-map or policy applied to Circuit B interfaces on CE. This also includes ensuring that the interfaces of Circuit B are associated with the appropriate VRF or routing-instance, if any.
1. Remove the route-maps or policy on Circuit B interfaces. Apply the route-maps or policy on Circuit A interfaces to block the route advertisement over Circuit A. This will switch the traffic flow over Circuit B.
1. Verify the traffic flow over Circuit B. If the verification fails, undo the route-map or firewall association that you did in the previous step and switch the traffic flow back over Circuit A.
1. If the verification of traffic flow over Circuit B is successful, delete Circuit A.

#### Microsoft Peering

1. Remove Circuit B from any test Azure route filter that you have linked it to.
1. Remove any exceptions that you have made to the route-maps or policy.
1. On CE, make sure that the interface of Circuit B is associated with the appropriate VRF or routing-instance.
1. Validate and confirm the advertised prefix over the Microsoft peering.
1. Associate Circuit B Microsoft peering to the Azure route filter that is currently associated to Circuit A.
1. Remove the route-maps or export/import policy on Circuit B interfaces. Apply the route-maps or export/import policy on Circuit A interfaces to block the route advertisement over Circuit A. This will switch the traffic flow over Circuit B.
1. Verify the traffic flow over Circuit B. If the verification fails, undo the route-map or policy association that you did in the previous step and switch the traffic flow back over Circuit A.
1. If the verification of traffic flow over Circuit B is successful, delete Circuit A.

## Next step

For more information about router configuration, see [Router configuration samples to set up and manage routing](expressroute-config-samples-routing.md).
