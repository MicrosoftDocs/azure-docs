---
title: Validate a Microsoft Discovery deployment before provisioning
description: Run Discovery onboarding Stage 3 profiles, interpret static and effective-network checks, and collect independent connectivity evidence before deployment.
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: how-to
ms.date: 11/10/2026
# Customer intent: As a platform administrator, I want readiness reports and subnet connectivity evidence so that I can detect preparation gaps before provisioning.
---

# Validate a Microsoft Discovery deployment before provisioning

Run Stage 3 after preparing the landing zone. By default, it inspects Azure configuration without creating resources. Requested reports are local files. Run both the `supercomputer` and `workspace` profiles and collect independent connectivity evidence before Stage 4.

A static `GO` doesn't establish working outbound connectivity or certify the deployment.

## Prerequisites

- A completed [landing zone](how-to-prepare-landing-zone.md) and current reviewed `config.json`.
- Resolved applicable firewall, quota, and policy handoffs; required user roles activated.
- Azure **Reader at target-subscription scope** and any [conditional effective-network permissions](reference-deployment-permissions.md#stage-3-readiness-validation).
- A network-team-approved method to test connectivity from the required compute subnets.
- Azure CLI signed into the intended subscription and a PowerShell 7 prompt in `utilities\onboarding-tool\scripts`.

## Run both readiness profiles

1. Run the supercomputer profile:

   ```powershell
   .\stage3-validation\stage3_validate.ps1 `
     -ConfigPath .\config.json -Profile supercomputer `
     -JsonPath .\out\stage3-supercomputer.json
   ```

1. Run the workspace profile with a different report name:

   ```powershell
   .\stage3-validation\stage3_validate.ps1 `
     -ConfigPath .\config.json -Profile workspace `
     -JsonPath .\out\stage3-workspace.json
   ```

1. Review both Markdown reports and their JSON companions. Record the tool revision and configuration used to generate them.

`supercomputer` is the default profile when `-Profile` is omitted. `bookshelf` is also available for its check set, but it doesn't deploy Bookshelf or replace the two reports used by this deployment procedure.

## Review actual check coverage

Check the `results` and profile information in each report instead of inferring coverage from its filename.

| Check type | Evidence provided | What it doesn't establish |
| --- | --- | --- |
| Configuration checks | Subnet sizing and delegation, configured NSG rules and routes, private-endpoint approval and DNS metadata, resource state, compute and model quota. | Private DNS-zone existence or VNet links, packet-level connectivity, available physical capacity, or every external approval. |
| Effective-network actions, when a usable NIC exists | Azure-calculated effective NSG rules, effective routes, and Network Watcher next hop. | Successful DNS and TLS exchanges or image downloads. These actions also need additional permissions. |
| Independent in-network tests | Actual observed reachability from an approved test location. | Coverage of subnets and endpoints that weren't tested. |

The checked-out `stage3-validation/dependency-spec.json` defines profile-specific dependencies. Stage 3 doesn't check private DNS-zone existence or VNet links. Stage 2 prepares DNS for tool-provisioned networks and verifies the blob-zone link when configuring a customer-owned storage private endpoint. With `byo-existing`, Stage 2 skips network-template provisioning, so prepare that zone and VNet link beforehand. The platform creates resource-prefixed private DNS zones in its managed resource groups during Stage 4; those zones aren't prerequisites for Stage 3.

The supercomputer profile also lists workspace-related subnet roles and doesn't list `spare`, the tool's UDR management-subnet role. Don't assume that running both profiles checks that separate subnet. Inspect its delegation and topology against [management subnet requirements](how-to-configure-supercomputer-network-security.md#managementsubnetid-required); Stage 4 also performs its own topology preflight.

Review Warn, Skip, and Waived entries even when the overall verdict is `GO`. An unavailable effective-network check isn't a successful connectivity test. Unreadable required quota checks can fail the stage.

## Verify connectivity from the required subnets

Before Stage 4, have the network team:

1. Confirm the configured next-hop address identifies the reachable firewall or NVA, where UDR is used.
1. Verify peering, forwarding, route tables, firewall allows, and SNAT for the actual outbound path.
1. Test required DNS resolution, TCP and TLS reachability, and AKS bootstrap image downloads from the system-node and workload-node subnet paths. Use the [Discovery outbound dependencies](how-to-configure-supercomputer-network-security.md#enable-connectivity-to-platform-services) and [AKS outbound rules](/azure/aks/outbound-rules-control-egress).
1. Test applicable private endpoints and researcher and runner access paths separately.
1. Retain the source subnet, destination, test method, result, and time of evidence with the approved configuration.

Use an approved existing node or VM or a separately approved temporary probe. Testing only from a laptop or Cloud Shell doesn't establish compute-subnet reachability. Obtain approval for probe creation, cost, access, and cleanup before using temporary resources.

For AKS extension egress failures, see [OutboundConnFailVMExtensionError guidance](/troubleshoot/azure/azure-kubernetes/create-upgrade-delete/error-code-outboundconnfailvmextensionerror).

## Understand the optional VM probe

The `-WithVm` parameter starts a temporary VM, NIC, and disk lifecycle and attempts cleanup. It requires Contributor on the probe resource group and Network Contributor for a VNet or subnet in a different resource group, in addition to baseline reads. It can incur costs.

The onboarding tool user guide reports VM creation and incomplete subnet coverage limitations for this revision. **Don't use `-WithVm` as the validation path for this procedure.** The parameter is available, but neither its presence nor attempted cleanup guarantees successful comprehensive testing or resource removal.

## Refresh and hand off the evidence

After configuration, access, quota, or networking changes, rerun the affected checks and create fresh reports for both profiles. Fix failed checks before proceeding and record the disposition of warnings or waivers.

Stage 4 reads reports supplied through `-ReadinessReport`, but it doesn't bind them to the current configuration or enforce freshness. It can proceed with a warning if you don't supply a report. The deployment procedure therefore explicitly supplies both reports and requires independent connectivity evidence as operator responsibilities.

Keep `config.json`, the tool revision, both reports, approvals, and connectivity evidence together. Never substitute an offline `PLAN` for a live readiness report.

For verdict and output-field definitions, see [reports and artifacts](reference-deployment-reports.md). For failed checks, see [onboarding troubleshooting](troubleshoot-deployment-tool.md).

## Next step

> [!div class="nextstepaction"]
> [Deploy with the onboarding tool](how-to-deploy-platform.md)
