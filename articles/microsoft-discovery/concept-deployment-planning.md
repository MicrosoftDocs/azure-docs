---
title: Microsoft Discovery deployment planning overview
description: Plan a Microsoft Discovery deployment, compare deployment paths, identify prerequisites, and coordinate network, identity, and readiness decisions.
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: concept-article
ms.date: 10/24/2026
# Customer intent: As a platform administrator, I want to plan deployment and preparation work so that I can provision Discovery with approved access and connectivity.
---

# Microsoft Discovery deployment planning overview

A Microsoft Discovery deployment combines Discovery resources with customer-owned networking, identities, and project storage. Planning establishes who owns these dependencies, which deployment path to use, and what evidence is needed before provisioning.

## Choose a deployment path

Choose the experience that fits your operating practices. None of these paths removes your responsibility for subscription access, quota, governance, or connectivity.

| Path | Use it when | Start here |
| --- | --- | --- |
| Azure portal | You want to create and inspect resources through a guided UI. | [Infrastructure quickstart](quickstart-infrastructure.md), Azure portal tab |
| Bicep | You want to use the infrastructure-as-code experience in the quickstart. | [Infrastructure quickstart](quickstart-infrastructure.md), Bicep tab |
| Onboarding tool | You want planning forms, staged PowerShell execution, and reports for team handoffs. | [Set up the onboarding tool](how-to-set-up-deployment-tool.md) |

The paths have different automation boundaries. The onboarding tool deploys a supercomputer and node pool, workspace, chat model, project storage container, and project. Its final Q&A verification creates an agent and test conversation. It doesn't deploy Bookshelf, ingest knowledge, publish tools, or create a customer container registry.

## Identify prerequisites and owners

Use this checklist before selecting deployment parameters.

| Decision or dependency | Required work | Owner |
| --- | --- | --- |
| Subscription access | Confirm that the subscription is enabled for Discovery. Registration alone doesn't enable a subscription for the service. | Subscription administrator and Microsoft account representative |
| Resource providers | Register providers needed for the resources you use. Stage 2 automates registration for the tool's deployment scope. | Subscription administrator |
| Region and capacity | Select supported placement and confirm compute/model quota and service availability. Available quota isn't a capacity guarantee. | Platform administrator |
| Resource naming | Select valid names and check uniqueness in the appropriate scope. | Platform administrator |
| Human access | Select permanent assignments or customer-managed just-in-time (JIT) eligibility according to organizational policy. Activate eligible roles when needed. | IAM team and individual users |
| Workload identity | Create a user-assigned managed identity (UAMI) and plan its resource access before deployment. | Platform administrator and IAM team |
| Network | Approve address space, subnet roles, DNS ownership, egress, and runner access. | Network team |
| Project storage | Create a customer-owned storage account and plan platform and browser access to its blob endpoint. Required even without Bookshelf. | Storage and network teams |
| Governance | Resolve applicable policy exemptions and approval requests before affected operations. | Policy and governance teams |
| Optional capabilities | Plan Bookshelf and tool/registry prerequisites separately when those capabilities are needed. | Capability owner |

For detailed requirements, see [quota and capacity](concept-quota-reservation.md), [resource naming](reference-resource-naming.md), [role assignments](concept-role-assignments.md), and [managed identities](concept-managed-identities.md).

## Plan networking and access independently

Network ownership, outbound routing, and workspace access are separate decisions. The onboarding tool supports tool-provisioned and existing-network modes; an existing enterprise VNet isn't automatically safe to use with a provisioning mode.

[Plan onboarding networking](how-to-plan-deployment-network.md) before completing the workbook. Confirm which team creates peering, operates the firewall or network virtual appliance (NVA), applies rules and source network address translation (SNAT), and maintains private DNS.

For a deployment spanning regions, review [Deploy Discovery across Azure regions](how-to-deploy-across-regions.md). That service architecture doesn't imply that every onboarding-tool network mode supports the same placement.

## Understand the onboarding stages

The tool in the [Microsoft Discovery repository](https://github.com/microsoft/discovery/tree/main/utilities/onboarding-tool) uses one configuration that flows through five stages. Each stage has its own operator permissions. Don't run the entire sequence with subscription-wide administrative access merely because preparation needs elevation.

| Stage | Purpose and output | Azure writes | Learn task |
| --- | --- | --- | --- |
| 1. Planning | Validate the workbook and generate `config.json`. | No; live checks read Azure state. | [Create a configuration](how-to-create-deployment-configuration.md) |
| 2. Landing zone | Prepare providers, access, networking, and storage settings; generate team request artifacts. | Yes, including in existing-network mode. | [Prepare the landing zone](how-to-prepare-landing-zone.md) |
| 3. Validation | Inspect readiness and generate reports for the selected profiles. | No by default; the optional probe mode creates resources. | [Validate readiness](how-to-validate-deployment-readiness.md) |
| 4. Deployment | Provision the core platform in dependency order. | Yes | [Deploy with the tool](how-to-deploy-platform.md) |
| 5. Scenario verification | Exercise a Q&A agent and inspect project-storage configuration. | Yes; creates scenario objects and sends a model request. | [Verify the deployment](how-to-verify-deployment.md) |

After Stage 1, you can optionally [preview Stages 2-5 offline](how-to-preview-deployment-changes.md). Previewing is not a readiness gate and doesn't replace live checks.

## Coordinate handoffs

Stage 2 can produce firewall, quota, policy-exemption, and PIM eligibility artifacts. These files are requests or records, not evidence that the requested change is effective. The owning team must complete the action and return confirmation.

Before deployment, the operator needs both fresh Stage 3 profile reports and independent evidence that required compute subnets can reach their dependencies. A static report doesn't prove working DNS, routing, firewall rules, SNAT, or image downloads.

Keep the reviewed configuration, tool revision, reports, approvals, and resource IDs together in customer-approved storage. Generated files can contain tenant details, object IDs, network configuration, and scientific prompts or responses.

## Distinguish the outcomes

- A generated configuration establishes the inputs for later stages, not complete Azure readiness.
- A `PLAN` result describes intended actions without evaluating Azure.
- A live `GO` means the tool recorded no failed checks. Warnings, skipped checks, and approved waivers still need review.
- Successful provisioning establishes resource state, not end-to-end scenario correctness.
- A completed Q&A response is a bounded smoke test, not scientific, security, or compliance certification.

Use [permissions by stage](reference-deployment-permissions.md) to plan access and [reports and artifacts](reference-deployment-reports.md) to interpret evidence.

## Related content

- [Set up the onboarding tool](how-to-set-up-deployment-tool.md)
- [Register resource providers manually](how-to-register-resource-providers.md)
- [Troubleshoot onboarding](troubleshoot-deployment-tool.md)
