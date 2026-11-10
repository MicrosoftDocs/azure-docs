---
title: Plan networking for Microsoft Discovery onboarding
description: Compare onboarding network modes, select outbound routing, and define subnet, DNS, workspace access, and network-team responsibilities.
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: how-to
ms.date: 11/10/2026
# Customer intent: As a network administrator, I want to select approved onboarding network settings so that Discovery can reach its dependencies without changing an existing network unexpectedly.
---

# Plan networking for Microsoft Discovery onboarding

Choose network ownership, egress, and access settings for the Microsoft Discovery onboarding tool before completing its Stage 1 planning workbook. The tool is a five-stage PowerShell pipeline available in the [Microsoft Discovery repository](https://github.com/microsoft/discovery/tree/main/utilities/onboarding-tool). The output of this task is an approved network plan, not a deployed virtual network or a connectivity verdict.

## Prerequisites

- Access to the Microsoft Discovery onboarding tool and its planning workbooks. For download instructions and runner requirements, see [Set up the onboarding tool](how-to-set-up-deployment-tool.md).
- An identified deployment subscription, control-plane and workload regions, platform resource group, and storage account.
- Network-team approval for address ranges, subnet allocation, DNS ownership, and egress.
- An understanding of [Discovery virtual networks](concept-virtual-networks.md) and [network security](concept-network-security.md).
- For an existing virtual network: its resource group, name, region, subnet CIDRs, delegations, routes, and DNS links.

## Select a network mode

The tool has two workbooks and four `network.model` values. Choose the mode that matches who provisions the network; no mode guarantees outbound connectivity.

| Mode | Workbook | Stage 2 network behavior | Customer responsibilities |
| --- | --- | --- | --- |
| `managed` | Managed virtual network | Deploy the tool's virtual network and subnet layout, delegations, NSG, applicable route tables, and private DNS zones and links. | Approve addressing and provide a working outbound architecture. |
| `byo` | BYO virtual network | Deploy the network template with customer-provided settings. This deployment isn't existing-network validation only. | Supply an approved layout and connectivity. |
| `byo-spoke` | BYO virtual network | Deploy the same network template for the spoke. It doesn't create hub peering or a firewall. | Provide nonoverlapping addressing, hub connectivity, and any appliance routing, rules, and SNAT. |
| `byo-existing` | BYO virtual network | Skip the virtual network and network-template deployment. Validate customer-prepared networking. | Prepare the virtual network, required subnets and delegations, NSGs, routes, and egress. Approve blob private DNS zone and VNet-link changes when private-endpoint storage is selected. |

`managed`, `byo`, and `byo-spoke` declare virtual network address space and a subnet collection in a template. They can change an existing virtual network and aren't add-only subnet operations. Select `byo-existing` when you must avoid that template deployment.

Even with `byo-existing`, Stage 2 still registers providers, assigns access, and configures project-storage networking. It isn't a read-only stage.

In an [Azure landing zone](/azure/cloud-adoption-framework/ready/landing-zone/), hub connectivity and DNS can be shared platform services. Coordinate their use with the platform team. `byo-spoke` doesn't create hub connectivity. `byo-existing` skips network-template deployment, not all Stage 2 changes. Neither mode establishes compliance with the organization's landing-zone policies.

## Select outbound connectivity

Select `network.outboundType` independently of `network.model`.

1. For **`UserDefinedRouting`**, record the actual reachable firewall or NVA private IP in `network.nvaNextHop`. Assign ownership for peering and connectivity, forwarding, firewall allow rules, and SNAT. A NAT Gateway public IP isn't an NVA next hop.
1. For **`LoadBalancer`**, select AKS load-balancer-based egress. No NVA IP is required and Stage 2 doesn't create UDR tables. This option doesn't create a NAT Gateway or override customer network controls.

Review [supercomputer outbound dependencies](how-to-configure-supercomputer-network-security.md#enable-connectivity-to-platform-services) and the authoritative [AKS outbound requirements](/azure/aks/outbound-rules-control-egress) for the actual cluster configuration. NSGs don't express FQDN-based rules; use [NSG planning guidance](how-to-plan-supercomputer-network-security-groups.md) together with appliance rules, not instead of them.

## Record subnet and DNS settings

1. Allocate nonoverlapping ranges with enough capacity for the workbook's sizing requirements and growth. Record existing subnet CIDRs outside the planned Discovery subnets in `network.existingSubnets`. This field doesn't make provisioning modes preserve unlisted subnets.
1. Record the virtual network name and network resource group. The virtual network, subnets, and all resources in the managed resource groups must be in `workloadRegion`. `controlPlaneRegion` places Discovery control-plane resources and can differ. The managed resource groups themselves remain in the control-plane home region; see [Deploy across regions](how-to-deploy-across-regions.md#understand-resource-placement). For `byo-existing`, Stage 1 checks the existing virtual network against `workloadRegion`, and each `SUBNET` row must match an actual subnet CIDR. Provisioning modes create the network in `workloadRegion`.
1. Review delegation by subnet function:

   | Function | Tool subnet role | Delegation |
   | --- | --- | --- |
   | Workspace, agent, and search container apps | `workspace-containerapp`, `agent-containerapp`, `search-containerapp` | `Microsoft.App/environments` |
   | Supercomputer system nodes (`aksSubnet`) | `managedcluster` | None |
   | Supercomputer workload nodes | `nodepool` | None |
   | Private endpoints | `private-endpoints` | None |
   | Separate UDR management subnet | `spare` in the tool configuration | `Microsoft.ContainerService/managedClusters` |

   The name `managedcluster` identifies the system-node subnet, not the separately delegated management subnet. For UDR, review the [management subnet requirements](how-to-configure-supercomputer-network-security.md#managementsubnetid-required).

1. Record `network.dnsResourceGroup` if DNS zones are centralized. If blank, the tool uses the network resource group. The DNS zones must be linked to the exact selected VNet, not just a similarly named VNet.
1. For `byo-existing` with `storage.access=privateEndpoint`, plan `privatelink.blob.core.windows.net` in the selected DNS resource group and its link to the selected VNet. Stage 2 skips network-template DNS creation in this mode, but storage preparation reuses or creates the blob zone and VNet link, verifies the link, and associates the storage endpoint's zone group. Don't precreate platform-managed resource-prefixed zones: the platform creates them in its managed resource groups during Stage 4. Stage 3 doesn't check private DNS-zone existence or VNet links.

Don't treat the default NSG outbound allowance or a subnet without an NSG as proof that the approved enterprise egress design is effective.

## Plan workspace and client access

Record both workspace fields; they control different access paths.

| Field | Values | Access consequence |
| --- | --- | --- |
| `workspace.publicNetworkAccess` | `Enabled` or `Disabled` | `Disabled` restricts workspace data-plane access to private connectivity. The Stage 5 runner must have that access. |
| `workspace.networkIsolation` | `true` or `false` | `true` isolates the Workbench and requires private network access such as VPN or ExpressRoute. `false` permits authenticated public Workbench access. |

The tool defaults are `publicNetworkAccess=Enabled` and `networkIsolation=true`; review them explicitly rather than accepting them as an organizational recommendation.

These defaults apply to the onboarding tool. The ARM contract doesn't declare a universal default for public network access. Backend network hardening doesn't make the client APIs private. For private workspace API access, plan an approved client private endpoint, DNS resolution and routing from the runner and clients, and `publicNetworkAccess=Disabled`. Workbench `networkIsolation` is independent of that API control.

If you also require a private supercomputer management plane, plan it before creation. It requires `UserDefinedRouting`, a separate delegated management subnet, the creation-time `discovery.enableprivatecluster=true` tag, and the Private Link service subnet-policy configuration described in [Private supercomputer](how-to-configure-supercomputer-network-security.md#private-supercomputer). Client API private endpoints don't enable it.

Project storage has its own network controls. Users opening outputs in Discovery Studio need direct browser access to blob storage, through private connectivity or an approved client-IP rule when the account permits selected public access. CORS doesn't grant network access or Azure permissions.

## Confirm customer-owned work

Before generating configuration, have the network team confirm:

- Approved VNet/subnet changes and any separate platform, network, storage, and DNS resource groups.
- Hub peering, routes, reachable NVA, firewall rules, and SNAT where applicable.
- DNS forwarding and zone links for the selected VNet.
- Runner, researcher browser, and compute-subnet access paths.
- The method and owner for testing required DNS, TCP/TLS, and image-download dependencies from the actual compute subnets.

A generated firewall request isn't confirmation that the appliance is configured. Preserve the resulting evidence for [readiness validation](how-to-validate-deployment-readiness.md).

## Next step

> [!div class="nextstepaction"]
> [Create an onboarding configuration](how-to-create-deployment-configuration.md)
