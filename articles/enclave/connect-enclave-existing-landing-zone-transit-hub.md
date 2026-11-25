---
title: Connect Azure Enclave to an existing Azure landing zone through transit hub peering
description: Learn how to connect an Azure Enclave transit hub to an existing Azure landing zone hub virtual network and update routing so selected spokes can reach enclave-connected resources.
author: mitchellly-msft
ms.author: mitchellly
ms.service: azure-enclave
ai-usage: ai-assisted
ms.topic: how-to
ms.date: 09/23/2026
---

# Connect Azure Enclave to an existing Azure landing zone through transit hub peering

Azure Enclave can coexist with an existing Azure landing zone (ALZ) deployment. In a brownfield or pre-existing environment, you typically retain the established ALZ management group hierarchy, policy assignments, subscriptions, and hub-and-spoke network topology. You can introduce Azure Enclave in two ways:

- Side-by-side, as a managed isolation boundary for selected sensitive workloads.
- As a deployment option within an Azure landing zone for ALZ hub-and-spoke and Azure Virtual WAN enterprise architectures. For more information, see [Azure landing zone architecture](/azure/cloud-adoption-framework/ready/landing-zone/).

This article explains how to introduce Azure Enclave in a side-by-side configuration, where Azure Enclave serves as a managed isolation boundary for selected sensitive workloads. Specifically, this article walks through how to plan and connect an Azure Enclave [transit hub](./what-transit-hub.md) to an existing ALZ hub virtual network, and how to update routing so selected ALZ spokes can reach enclave-connected resources through an explicitly engineered network path.

> [!IMPORTANT]
> Peering or connecting an Azure Enclave transit hub to an ALZ hub doesn't automatically make all ALZ spokes reachable. Standard virtual network peering is non-transitive, and Azure Virtual WAN-based hub connectivity, which Azure Enclave uses for its connection management features, has its own route table, propagation, and association model. You must plan and validate the forward path, return path, route tables, firewall rules, DNS, and policy controls for each spoke that needs connectivity.

## Architecture

A typical existing Azure landing zone architecture includes:

- An ALZ management group hierarchy for platform, landing zone, sandbox, and decommissioned subscriptions.
- A connectivity subscription that contains either:
  - An existing ALZ hub virtual network (ALZ hub-and-spoke), or
  - An existing ALZ Virtual WAN (ALZ VWAN).
- One or more landing zone subscriptions that contain workload spokes.
- Azure Firewall, network virtual appliances, VPN Gateway, ExpressRoute Gateway, Azure DNS Private Resolver, or other shared services in the ALZ hub.

A typical Azure Enclave architecture includes:

- Azure Enclave communities and one or more enclaves for isolated workloads, spread across subscriptions based on billing preferences and requirements.
- Transit hubs that enable connectivity between enclave-managed networks and external private networks.
- [Enclave connections](./what-enclave-connection.md) that provide platform-managed connectivity and routing between enclaves and trusted destinations, including transit hubs.

An example Azure Landing Zone implementation with a side-by-side Azure Enclave deployment:
:::image type="content" source="./media/azure-enclave-azure-landing-zone.png" alt-text="Diagram showing Azure Enclave integrated with an Azure Landing Zone" border="true" lightbox="./media/azure-enclave-azure-landing-zone.png":::

The side-by-side integration pattern is:

1. Create a new management group (for example, named `Isolated`) at the same hierarchy level as the platform and landing zone management groups in your ALZ management group structure.
1. Deploy or identify the Azure Enclave transit hub used to enable side-by-side connectivity between ALZ and Azure Enclave. This transit hub should exist under the `Isolated` management group.
1. Connect the transit hub to the existing ALZ hub virtual network using the supported Azure Enclave transit hub remote virtual network peering option (for ALZ hub-and-spoke), or a gateway or ExpressRoute connection (for ALZ VWAN).
   - If you use ALZ hub-and-spoke, update ALZ hub-and-spoke routing so selected ALZ spokes send traffic for enclave address spaces to the intended next hop.
   - If you use ALZ VWAN, update the ALZ VWAN hub connection and routing intent, as applicable, so selected ALZ spokes send traffic for enclave address spaces to the intended next hop.
1. Create or update the Azure Enclave-side enclave connection configuration so return traffic follows a symmetric path.
1. Validate effective routes, firewall logs, DNS resolution, and spoke-to-enclave reachability.
1. If you use Microsoft first-party or trusted third-party web services across your ALZ enterprise, ensure a community endpoint is defined for those dependencies. Create enclave connections from enclaves that require connectivity to that community endpoint.

> [!NOTE]
> When the Azure Enclave transit hub uses the remote virtual network peering option, the underlying implementation might use Azure Virtual WAN virtual hub connectivity rather than ordinary transitive virtual network peering. Treat the transit hub connection, ALZ hub routes, and spoke routes as explicit routing domains that you must validate.

## Prerequisites

Before you begin, confirm the following prerequisites:

- You have permission to read and update the existing ALZ hub virtual network.
- You have permission to create or update Azure Enclave transit hub connectivity.
- You have permission to review Azure Policy assignments and exemptions at the relevant management group, subscription, and resource group scopes.
- If your environment uses Azure Enclave approvals or maintenance mode workflows, you understand which operations require administrative approval.
- The Azure Enclave address spaces and the ALZ hub and spoke address spaces don't overlap.
- The ALZ hub virtual network doesn't have gateway or remote gateway settings that conflict with the selected transit hub connection pattern.
- ALZ policy assignments are reviewed for allowed resource types, networking restrictions, subnet delegation rules, private endpoint policies, encryption requirements, and deployment location constraints.
- Role separation between ALZ platform owners, Azure Enclave administrators, network operators, and workload owners is defined.
- You can inspect effective routes on network interfaces and subnets.
- You can review firewall logs and connection diagnostics.
- You can test DNS resolution from both ALZ and enclave-connected workloads.

## Planning considerations

For existing ALZ environments, start with a dependency assessment. Identify which ALZ spokes need to communicate with Azure Enclave workloads, which enclave workloads need to communicate back to ALZ resources, and which shared services are required.

Review the following design areas:

- **Connectivity type**: Determine whether the transit hub connection is the right pattern, or whether gateway-based integration, direct virtual hub connections, or another architecture is required.
- **Transit assumptions**: Don't assume a single hub connection automatically reaches all spokes. Validate the routing model for each spoke.
- **Firewalls**: Decide whether traffic should traverse Azure Firewall, a secured virtual hub, a network virtual appliance, or another inspection point.
- **Return path**: Ensure enclave return traffic follows the same intended security path to avoid asymmetric routing.
- **DNS**: Confirm how enclave workloads resolve ALZ resources and how ALZ workloads resolve enclave resources.
- **Private endpoints**: Review private endpoint DNS zones, zone links, and policy requirements.
- **Service dependencies**: Identify dependencies on identity, monitoring, Microsoft Defender, Microsoft Fabric, Microsoft 365, package feeds, update services, and other Microsoft or third-party SaaS or platform endpoints.

## Management group and policy considerations

Azure Enclave doesn't replace ALZ governance. Existing tenant, management group, subscription, and resource group policy assignments continue to evaluate. Azure Enclave workload policy assignments are optional, and deny assignments are additive controls that protect enclave-managed resources and customer workloads.

A representative ALZ hierarchy for coexistence might look like this:

```text
Tenant Root Group
└── Contoso
    ├── Platform
    │   ├── Management
    │   ├── Connectivity
    │   └── Identity
    ├── Landing Zones
    │   ├── Corp
    │   └── Online
    ├── Isolated
    │   ├── Isolated Platform
    │   └── Isolated Workloads
    ├── Sandbox
    └── Decommissioned
```

In this model:

- The existing ALZ `Connectivity` subscription continues to host shared networking, such as the ALZ hub, firewall, DNS, VPN, or ExpressRoute.
- Azure Enclave resources designed for the isolated platform are placed in subscriptions underneath the `Isolated` management group and governed by Azure Enclave-specific controls.
- Enclave workload subscriptions are placed where ALZ governance and Azure Enclave guardrails can both apply.
- Policies that must apply across all enterprise workloads remain assigned at the ALZ parent scope.

Review the following areas for alignment:

- Allowed resource types.
- Allowed locations.
- Required tags.
- Subnet delegation restrictions.
- Private endpoint policies.
- Route table and network security group restrictions.
- Firewall policy restrictions.
- Data collection rules, endpoints, flow logs, and diagnostic settings telemetry aggregation.
- Deny assignments that prevent direct modification of enclave-managed resources.

## Routing model

The routing model has three parts: ALZ-to-enclave routing, enclave-to-ALZ routing, and spoke propagation.

### ALZ-to-enclave routing

ALZ spokes that need enclave access must have routes for enclave prefixes. Depending on the topology, those routes might point to:

- The ALZ hub firewall.
- A network virtual appliance.
- A virtual network gateway.
- A Virtual WAN hub route table.
- Another approved next hop in the ALZ connectivity design.

### Enclave-to-ALZ routing

Azure Enclave must have a return route for ALZ prefixes. Return traffic must pass through the intended inspection and control points. If traffic enters through a firewall or secured hub, the return path shouldn't bypass that control point.

### Spoke propagation

Spoke reachability depends on the ALZ networking model:

- In a classic hub-and-spoke model, virtual network peering is non-transitive. Spokes don't automatically learn routes through another peered network.
- In a firewall-centric hub model, spoke route tables commonly send non-local traffic to the hub firewall. Add enclave prefixes to the relevant route tables or route policies.
- In a Virtual WAN model, associate and propagate routes through the correct virtual hub route tables.
- In hybrid models, review ExpressRoute, VPN, and remote gateway settings to avoid conflicts.

Validate every affected spoke. Don't rely only on the connection state between the transit hub and the ALZ hub.

## Troubleshooting

### Transit hub connection fails

| Possible cause | Action |
| --- | --- |
| You don't have permission on the remote ALZ hub virtual network. | Verify you have Network Contributor or equivalent permissions. |
| The remote virtual network has an existing gateway or remote gateway setting that conflicts with the selected connection model. | Check whether the hub virtual network already has VPN, ExpressRoute, or remote gateway dependencies. |
| The remote virtual network resource ID is incorrect or not discoverable. | Confirm the full resource ID of the ALZ hub virtual network. |

### Routes don't appear in spokes

| Possible cause | Action |
| --- | --- |
| The spoke route table wasn't updated. | Add or correct enclave prefix routes. |
| Virtual network peering is treated as transitive when it isn't. | Confirm the next hop is reachable, and inspect effective routes on a VM network interface in the affected spoke. |
| Virtual WAN route table association or propagation is incomplete. | Validate Virtual WAN route table association and propagation. |
| A more specific route overrides the intended enclave route. | Inspect effective routes on a VM network interface in the affected spoke. |
| The route table isn't associated with the subnet being tested. | Confirm the route table association on the subnet. |

### Traffic is asymmetric

| Possible cause | Action |
| --- | --- |
| ALZ-to-enclave traffic uses the hub firewall, but return traffic bypasses it. | Update enclave-side and ALZ-side routes to use the same intended control point. |
| Different route tables are used for forward and return paths. | Trace both forward and return effective routes. |
| Firewall or network virtual appliance SNAT behavior isn't accounted for. | Confirm SNAT, DNAT, and inspection behavior. |
| On-premises or hybrid routes advertise a competing path. | Review firewall logs for only one direction of traffic, and trace both effective routes. |

### Address spaces overlap

| Possible cause | Action |
| --- | --- |
| Enclave prefixes overlap with ALZ hub, spokes, on-premises, or another connected environment. | Update the address plan, and readdress the enclave or affected network where required. |
| A summarized route unintentionally overlaps with enclave prefixes. | Stop route propagation for the conflicting prefix. |

### DNS resolution fails

| Possible cause | Action |
| --- | --- |
| Private DNS zones aren't linked to the correct networks. | Confirm private DNS zone links. |
| DNS forwarding rules don't include enclave or ALZ zones. | Review DNS resolver inbound and outbound endpoint rules. |
| Firewall rules block DNS traffic. | Confirm that UDP/TCP port 53 or other approved DNS paths are allowed. |

## Related content

- [Azure landing zone architecture](/azure/cloud-adoption-framework/ready/landing-zone/)
- [What is a transit hub?](./what-transit-hub.md)
- [What is an enclave connection?](./what-enclave-connection.md)
- [Azure virtual network traffic routing](/azure/virtual-network/virtual-networks-udr-overview)
- [Hub-spoke network topology in Azure](/azure/architecture/networking/architecture/hub-spoke)
- [About virtual hub routing](/azure/virtual-wan/about-virtual-hub-routing)
- [Azure Virtual Network peering](/azure/virtual-network/virtual-network-peering-overview)
- [Use Azure Firewall to route a multi-hub and spoke topology](/azure/firewall/firewall-multi-hub-spoke)
- [Details of the policy exemption structure](/azure/governance/policy/concepts/exemption-structure)
