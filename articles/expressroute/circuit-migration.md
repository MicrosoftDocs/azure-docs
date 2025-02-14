---
title: Migrate to a new ExpressRoute circuit
description: Learn how to migrate your ExpressRoute circuit from one circuit to another with minimum service interruption.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 01/31/2025
ms.author: duau
---

# Migrate to a new ExpressRoute circuit

If you want to switch from one ExpressRoute circuit to another, you can do it smoothly with minimal service interruption. This document guides you through the steps to migrate your production traffic without causing major disruptions or risks. This method applies whether you're moving to a new or the same peering location.

If you have your ExpressRoute circuit through a Layer 3 service provider, create the new circuit under your subscription in the Azure portal. Work with your service provider to switch the traffic seamlessly to the new circuit. After the service provider has deprovisioned your old circuit, delete it from the Azure portal.

The rest of the article applies if you have your ExpressRoute circuit through a Layer 2 service provider or ExpressRoute direct ports.

## Steps for seamless ExpressRoute circuit migration

:::image type="content" source="./media/circuit-migration/migrate-circuit.png" alt-text="Diagram showing an ExpressRoute circuit migration from Circuit A to Circuit B.":::

The previous diagram illustrates the migration process from an existing ExpressRoute circuit, referred to as Circuit A, to a new ExpressRoute circuit, referred to as Circuit B. Circuit B can be in the same or a different peering location as Circuit A. The migration process consists of the following steps:

1. **Deploy Circuit B in isolation:** While the traffic continues to flow over Circuit A, deploy a new Circuit B without affecting the production environment.

2. **Block the production traffic flow over Circuit B:** Prevent any traffic from using Circuit B until it's tested fully and validated.

3. **Complete and validate end-to-end connectivity of Circuit B:** Ensure that Circuit B can establish and maintain a stable and secure connection with all the required endpoints.

4. **Switch over the traffic:** Redirect the traffic flow from Circuit A to Circuit B and block the traffic flow over Circuit A.

5. **Decommission Circuit A:** Remove Circuit A from the network and release its resources.

## Deploy new circuit in isolation

For a one-to-one replacement of the existing circuit, select the **Standard Resiliency** option and follow the steps outlined in the [Create a circuit with ExpressRoute](expressroute-howto-circuit-portal-resource-manager.md) guide to create your new ExpressRoute circuit (Circuit B) in the desired peering location. Then, follow the steps in [Configure peering for ExpressRoute circuit](expressroute-howto-routing-portal-resource-manager.md) to configure the required peering types: private and Microsoft.

To prevent the private peering production traffic from using Circuit B before testing and validating it, don't link a virtual network gateway that has production deployment to Circuit B. Similarly, to avoid Microsoft peering production traffic from using Circuit B, don't associate a route filter to Circuit B.

## Block the production traffic flow over the newly created circuit

Prevent the route advertisement over one or more new peerings on the CE devices.

For Cisco IOS, you can use a `route-map` and a `prefix-list` to filter the routes advertised over a BGP peering. The following example shows how to create and apply a `route-map` and a `prefix-list` for this purpose:

```
route-map BLOCK ADVERTISEMENTS deny 10
 match ip address prefix-list BLOCK-ALL-PREFIXES

ip prefix-list BLOCK-ALL-PREFIXES seq 10 deny 0.0.0.0/0 le 32

router bgp <your_AS_number>
 neighbor <neighbor_IP_address> route-map BLOCK-ADVERTISEMENTS out
 neighbor <neighbor_IP_address> route-map BLOCK-ADVERTISEMENTS in
```

Use export/import policy to filter the routes advertised and received on the new peering on the Junos devices. The following example shows how to configure export/import policy for this purpose:

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
## Validate the end-to-end connectivity of the newly created circuit

### Private peering

To link the new circuit to the gateway of a test virtual network and verify your private peering connectivity, follow the steps in [Connect a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md) . After linking the virtual networks to the circuit, check the route table of the private peering to ensure the address space of the virtual network is included. The following example shows a route table of the private peering of an ExpressRoute circuit in the Azure Management portal:

:::image type="content" source="./media/circuit-migration/route-table.png" alt-text="Screenshot of the route table for the primary link of the ExpressRoute circuit.":::

The following diagram illustrates a test VM in a test virtual network and a test device on-premises used to verify connectivity over the ExpressRoute private peering.

:::image type="content" source="./media/circuit-migration/test-connectivity.png" alt-text="Diagram showing a VM in Azure communicating with a test device on-premises through the ExpressRoute connection.":::

Modify the route-map or policy configuration to filter the advertised routes and allow the specific IP address of the on-premises test device. Similarly, allow the test virtual network’s address space from Azure.

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

### Microsoft peering

The verification of your Microsoft peering requires careful planning to avoid affecting production traffic. Follow these steps to ensure a smooth process:

1. **Use Distinct Prefixes:** Configure the Microsoft peering for Circuit B with prefixes different from the ones used for Circuit A to prevent routing conflicts. Refer to [creating Microsoft peering](expressroute-howto-routing-portal-resource-manager.md#to-create-microsoft-peering) for guidance.
2. **Separate Route Filters:** Link Circuit B's Microsoft peering to a different route filter than Circuit A. Follow the steps in [configuring route filters for Microsoft peering](how-to-routefilter-portal.md).
3. **Avoid Common Routes:** Ensure the route filters for both circuits don't share common routes to prevent asymmetrical routing. This can be done by:
    - Selecting a service or Azure region for testing Circuit B that isn't used by Circuit A's production traffic.
    - Minimizing overlap between the two route filters and permitting only specific test public endpoints through Circuit B.

After linking a route filter, check the routes advertised and received over the BGP peering on the CE device. Modify the route-map or Junos policy configuration to filter the advertised routes, allowing only the on-premises prefixes of the Microsoft peering and specific IP addresses of the selected Microsoft public endpoints for testing.

To test connectivity to Microsoft 365 endpoints, follow the steps in [Implementing ExpressRoute for Microsoft 365 – Build your test procedures](/microsoft-365/enterprise/implementing-expressroute#build-your-test-procedures). For Azure public endpoints, start with basic connectivity tests like traceroute from on-premises to ensure requests go over ExpressRoute endpoints. Beyond ExpressRoute endpoints, ICMP messages are suppressed over the Microsoft network. Additionally, test connectivity at the application level. For example, if you have an Azure VM with a public IP running a web server, try accessing the web server's public IP from your on-premises network through the ExpressRoute connection. This confirms that complex traffic, such as HTTP requests, can reach Azure services.

### Private peering

1. Disconnect Circuit B from any test virtual network gateways.
2. Remove any exceptions made to the Cisco route-maps or Junos policy.
3. Connect Circuit B to the production virtual network gateway following the steps in [Connect a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md).
4. Ensure that Circuit B is ready to advertise all routes currently advertised over Circuit A. Verify that Circuit B interfaces are associated with the appropriate VRF or routing-instance.
5. Remove the route-maps or policy on Circuit B interfaces and apply them to Circuit A interfaces to block route advertisements over Circuit A, switching the traffic flow to Circuit B.
6. Verify the traffic flow over Circuit B. If verification fails, revert the changes and switch the traffic flow back to Circuit A.
7. If verification is successful, delete Circuit A.

### Microsoft peering

1. Remove Circuit B from any test Azure route filter.
2. Remove any exceptions made to the route-maps or policy.
3. Ensure that Circuit B interfaces are associated with the appropriate VRF or routing-instance.
4. Validate and confirm the advertised prefixes over the Microsoft peering.
5. Associate Circuit B Microsoft peering with the Azure route filter currently associated with Circuit A.
6. Remove the route-maps or export/import policy on Circuit B interfaces and apply them to Circuit A interfaces to block route advertisements over Circuit A, switching the traffic flow to Circuit B.
7. Verify the traffic flow over Circuit B. If verification fails, revert the changes and switch the traffic flow back to Circuit A.
8. If verification is successful, delete Circuit A.

## Next step

For more information about router configuration, see [Router configuration samples to set up and manage routing](expressroute-config-samples-routing.md).
