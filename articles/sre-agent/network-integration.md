<!--
WRITER CHOICE: Angle 3 + Angle 1 hybrid
Primary structure: Angle 3 ("Three Levels of SRE Agent Network Control") because the meeting explicitly requested a conceptual article covering the three modes, the data-plane unlock, and governance. Angle 3 maps directly to a concept article's natural shape: taxonomy first, then mechanisms, then governance.
Angle 1 framing applied to the opening: the enterprise security problem (data exfiltration + prompt injection) gives the "why" before the "what," which is stronger reader entry than leading with a feature table.
Rejected angles:
- Angle 2 (data-plane unlock as hero): Strong hook, but data-plane is a consequence of network membership, not the lead. Better as a section than a frame.
- Angle 4 (CISO thought leadership): Too abstract for a Learn article. Craig's call was "high level... totally fine to share" — not a whitepaper.
-->

---
title: SRE Agent network integration
description: Learn how VNet integration controls outbound access for the SRE Agent. Understand the three network modes, data-plane operations on private resources, and enterprise governance with Azure Policy.
ms.topic: conceptual
ms.date: 05/20/2026
author: craigshoemaker
ms.author: cshoe
ms.service: TODO-confirm-service-slug
---

# SRE Agent network integration

The SRE Agent can act on your infrastructure, query your databases, and run commands against your clusters. Without network controls, all of that outbound traffic flows unrestricted across the public internet. VNet integration changes that: the agent joins your Azure Virtual Network, and every outbound call routes through your existing security infrastructure.

This article explains why network-level control matters for enterprise deployments, how VNet integration works, and how to choose the right network control mode for your workload.

## Why network control matters

By default, the SRE Agent can reach any endpoint on the internet. For development and test workloads, this permissive behavior is acceptable. For production enterprise deployments, it is not.

Two risks drive the enterprise requirement for network controls:

- **Data exfiltration**: An agent with access to sensitive internal data and unrestricted internet access creates a path for data to leave your organization. As Dalibor Kovacevic of the SRE Agent product group described: "imagine you gave it access to private banking information... and somebody tells the agent to post... to Facebook."
- **Prompt injection**: Malicious content on the public internet can be crafted to manipulate agent behavior. An unrestricted agent that fetches external content is exposed to injection attacks through those responses.

Enterprise customers have a direct ask: "we want to control what the agent can do by injecting into our virtual network" (Dalibor Kovacevic). Without network controls, operators "basically have to just trust that nobody does anything dumb... and so that's not generally good enough for any enterprise customer."

## How VNet integration works

VNet integration connects the SRE Agent to your existing Azure Virtual Network. When the agent makes an outbound call, traffic flows through your network infrastructure instead of the public internet.

After VNet integration is configured, agent traffic:

- Appears in your **network logs** for auditing and monitoring
- Passes through your **Layer 4 and Layer 7 firewalls**
- Respects your **custom DNS** configuration
- Follows your **enterprise security policies** and egress rules

Think of it as the agent joining a corporate Wi-Fi segment. Once it joins, it operates under the same rules as any other workload on that network, including firewall inspection, DNS resolution, and traffic logging.

Most enterprise customers already have Azure VNets in place for their other workloads. VNet integration plugs the SRE Agent into that existing infrastructure without requiring new network architecture.

> [!IMPORTANT]
> VNet integration controls **outbound (egress) traffic only**. Inbound connections and private endpoint support are not in scope for this release.

## Network control modes

The SRE Agent offers three network control modes. You select the mode that matches your security posture and operational context.

| Mode | Description | Best for |
|------|-------------|----------|
| **Unrestricted** | No network restrictions. The agent can reach any internet endpoint. | Development and test environments; non-sensitive workloads. |
| **Limited** | A URL allowlist using wildcard-based rules restricts which endpoints the agent can call. | Scenarios where you want to block specific external destinations without full VNet routing. |
| **Full VNet** | All outbound traffic routes through your Azure VNet with your custom DNS and firewall rules applied. | Enterprise production deployments requiring maximum security posture and audit compliance. |

The three modes form a spectrum. As Dalibor Kovacevic described them: "the first version, unrestricted... the YOLO mode"; "the middle one... limited... you can just control which things it can do... wildcard-based URLs"; "the last one... Azure VNet... provide your own custom DNS... go entirely over your network."

### Choosing a mode

Use the following criteria to select a mode:

- **Full VNet**: The workload handles sensitive or regulated data, requires a full audit trail of outbound network activity, or must comply with enterprise security policies. This is the recommended mode for production enterprise deployments.
- **Limited**: You want to restrict specific external destinations without routing all traffic through a VNet. This mode works well when you need partial control without the overhead of full VNet configuration.
- **Unrestricted**: The workload is a short-lived development or test environment with no access to sensitive data. This is the default mode.

## Data-plane access on private networks

VNet integration unlocks a capability class that was previously out of reach: data-plane operations on resources inside a private network.

Before VNet integration, the SRE Agent could only interact with Azure resources through the control plane (Azure CLI commands). Resources deployed inside private, locked-down networks were unreachable for agent operations because the agent had no path into those networks.

With Full VNet integration, the agent joins your network and gains direct access to resources running inside it. As Dalibor Kovacevic described: "it is no longer impossible for you to do data plane commands... now when you're part of the network, you can do all those commands."

**Example:** An AKS cluster on a private network was previously inaccessible for agent operations. With VNet integration, the agent can run `kubectl` commands against that cluster because it now shares the same network segment. The same applies to private database instances such as PostgreSQL.

### The proxy workaround this feature replaces

Before VNet integration, teams that needed data-plane access inside a private network used a workaround: deploy an Azure Function inside the VNet, expose a limited public endpoint from that function, and have the agent call through it. Dalibor Kovacevic described the pattern: "you can make an Azure function... inside your network... expose some public UI."

VNet integration eliminates the need for this proxy architecture.

## Escape hatches and governance

Full VNet mode includes escape-hatch toggles: UI controls that let operators temporarily bypass VNet routing. The intended use case is network troubleshooting. By disabling VNet routing for a test run, an operator can confirm whether a problem is in the agent or in the network configuration. As Dalibor described the diagnostic reasoning: "we're just going to not use your networking. Does it work? Okay, it's your networking's fault."

Escape hatches can also be applied selectively, bypassing VNet routing for a specific operation while keeping it active for everything else.

### Enterprise governance with Azure Policy

For enterprises that require all agent traffic to route through the VNet at all times, escape hatches present a compliance gap. If an operator can toggle off VNet routing, the security guarantee of Full VNet mode is not enforceable.

Azure Policy addresses this. You can apply a policy to suppress or disable escape hatches, ensuring no operator can bypass the VNet configuration. Dalibor Kovacevic: "we need an Azure policy to suppress that because nobody can break the network... otherwise it defeats the whole thing."

> [!NOTE]
> TODO: Confirm with Dalibor whether the Azure Policy for suppressing escape hatches ships with this feature release or requires a separate customer-defined policy. Confirm whether the policy definition doc is in scope for this article or warrants a standalone how-to.

## Limitations

VNet integration as released has the following constraints:

- **Egress only**: Agent outbound (egress) traffic routes through the VNet. Inbound connections to the agent from inside a private network are not supported in this release.
- **No inbound / private endpoint support**: There is no timeline available for inbound support at this time.

> [!NOTE]
> TODO: Confirm with Dalibor whether inbound / private endpoint support has a target release window, or whether it should remain documented as out of scope without a timeline.

## Next steps

> [!div class="nextstepaction"]
> [TODO: Add link to "Configure VNet integration for the SRE Agent" how-to when available]

- [SRE Agent overview](TODO-link)
- [Azure Policy documentation](https://learn.microsoft.com/azure/governance/policy/overview)
- [Azure Virtual Network documentation](https://learn.microsoft.com/azure/virtual-network/virtual-networks-overview)

<!--
DRAFT NOTES (not visible to readers)

ARTICLE TYPE CHOSEN: Concept (ms.topic: conceptual)
Rationale: Craig's explicit call in the meeting was "conceptual article." The content maps cleanly to the concept article shape: What is it > Why it matters > How it works > Modes and mechanisms > Governance > Limitations. No step-by-step procedures exist yet (UI not finalized, no screenshots). A concept article holds its value until the how-to procedures can be written.

ANGLES REJECTED:
- Angle 2 (data-plane unlock as hero lead): Compelling hook but wrong article shape. Data-plane access is a consequence of network membership, not the primary concept. Works better as a section. Could be the angle for a future how-to or blog post.
- Angle 4 (CISO thought leadership): Too abstract for a Learn article and contradicts Craig's "high level... totally fine to share" guidance. Better suited to a whitepaper or Tech Community post.

TODOS FOR CRAIG:
1. ms.service: Confirm the correct Azure service slug for the SRE Agent. Placeholder "TODO-confirm-service-slug" in YAML.
2. Escape hatch Azure Policy: Confirm whether the policy ships with the feature release or is customer-defined, and whether it warrants a standalone doc or a section here.
3. Inbound / private endpoint: Confirm whether to document as out of scope with no timeline, or whether there is a target window Craig can reference.
4. "Next steps" links: Add target URL for VNet integration how-to (once UI stabilizes and how-to is written), and SRE Agent overview URL.
5. Publish timing: Dalibor said "bits should hopefully be today... broadly tested" and docs freeze is May 27. Confirm feature GA status before marking this article publish-ready. Consider a "coming soon" callout in the SRE Agent overview if the article beats the feature.
6. "anthropic thing" reference from the meeting transcript: Not documented here. Confirm whether this is a relevant integration that should appear in this article or is out of scope.

OPEN QUESTIONS FROM MEETING:
- Q1: When does the feature ship broadly? (Determines publish timing.)
- Q2: Inbound / private endpoint: on roadmap with a date, or no timeline?
- Q3: Azure Policy for escape hatches: in scope for this article? Separate doc?

SUGGESTED TARGET LOCATION:
- If this is for Azure DevOps / GitHub: articles/sre-agent/network-integration.md (or equivalent service directory)
- Branch suggestion: crs/sre-agent-vnet-integration from the relevant docs repo
- Source file: .squad/files/dalibor-meeting-source.md (Meeting Analyst output, 2026-05-20)
-->
