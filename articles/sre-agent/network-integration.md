---
title: Azure SRE Agent network integration (preview)
description: Learn how VNet integration controls outbound access for the SRE Agent. Understand the three network modes, data-plane operations on private resources, and enterprise governance with Azure Policy.
ms.topic: concept-article
ms.date: 05/22/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.service: azure-sre-agent
ms.collection: ce-skilling-ai-copilot
---

# Azure SRE Agent network integration (preview)

The Azure SRE Agent can act on your infrastructure, query your databases, and run commands against your clusters. Without network controls, all of that outbound traffic flows unrestricted across the public internet. Virtual network (VNet) integration changes that by connecting the agent to your Azure Virtual Network so that every outbound call routes through your existing security infrastructure.

This article explains why network-level control matters for enterprise deployments, how VNet integration works, and how to choose the right network control mode for your workload.

## Why network control matters

By default, the SRE Agent can reach any endpoint on the internet. For development and test workloads, this permissive behavior is acceptable. For production enterprise deployments this level of access, it isn't ideal.

Two risks drive the enterprise requirement for network controls:

- **Data exfiltration**: An agent with access to sensitive internal data and unrestricted internet access can create a path for data to leave your organization.

- **Prompt injection**: Malicious content on the public internet can be crafted to manipulate agent behavior. An unrestricted agent that fetches external content is exposed to injection attacks through those responses.

You can better control how SRE Agent behaves by placing it inside a virtual network.

## How VNet integration works

VNet integration connects the SRE Agent to your existing Azure Virtual Network. When the agent makes an outbound call, traffic flows through your network infrastructure instead of the public internet.

After you configure VNet integration, agent traffic:

- Appears in your **network logs** for auditing and monitoring
- Passes through your **Layer 4 and Layer 7 firewalls**
- Respects your **custom DNS** configuration
- Follows your **enterprise security policies** and egress rules

Once the SRE Agent joins the VNet, it operates under the same rules as any other workload on that network, including firewall inspection, DNS resolution, and traffic logging.

> [!IMPORTANT]
> VNet integration controls **outbound (egress) traffic only**.

## Network control modes

The SRE Agent offers three network control modes. Select the mode that matches your security posture and operational context.

| Mode | Description | Best for |
|------|-------------|----------|
| **Unrestricted** | No network restrictions. The agent can reach any internet endpoint. | Development and test environments; non-sensitive workloads. |
| **Limited** | A URL allowlist that uses wildcard-based rules restricts which endpoints the agent can call. | Scenarios where you want to block specific external destinations without full VNet routing. |
| **Full VNet** | All outbound traffic routes through your Azure VNet with your custom DNS and firewall rules applied. | Enterprise production deployments requiring maximum security posture and audit compliance. |

The three modes form a spectrum from fully open to fully controlled. Unrestricted mode imposes no constraints. Limited mode uses wildcard-based URL rules to control which endpoints the agent can reach. Full VNet mode routes all traffic through your network with your own custom DNS and firewall rules.

### Choose a network control mode

Use the following criteria to select a mode:

- **Full VNet**: Choose this mode if the workload handles sensitive or regulated data, requires a full audit trail of outbound network activity, or must comply with enterprise security policies. This mode is the recommended mode for production enterprise deployments.

- **Limited**: Choose this mode if you want to restrict specific external destinations without routing all traffic through a VNet. This mode works well when you need partial control without the overhead of full VNet configuration.

- **Unrestricted**: Choose this mode if the workload is a short-lived development or test environment with no access to sensitive data. This mode is the default.

## Access network control modes

To select a control mode for your agent, open your agent in the Azure portal, and select *Settings* > *Workspace configuration*.

:::image type="content" source="media/network-integration/azure-sre-agent-networking-vnet.png" alt-text="Screenshot of SRE Agent network control modes selector." lightbox="media/network-integration/sre-agent-networking-vnet.png":::

From this screen you can select your egress mode with the option to provide your own virtual network for your agent to run in.

## Pre-installed packages

You can pre-install packages in the sandbox base disk image so they're available every time the agent runs. This feature is useful when your tools or scripts depend on specific packages that aren't included in the default sandbox environment.

To configure pre-installed packages:

1. Open your agent in the Azure portal, and select *Settings* > *Workspace configuration*.
1. Select the **Packages** tab.
1. Enter the package name, select the package manager (**pip** or **NuGet**), and optionally specify a version.
1. Select **+ Add package**.

:::image type="content" source="media/network-integration/azure-sre-agent-packages.png" alt-text="Screenshot of the Packages tab in Workspace configuration showing fields for package name, package manager, and version." lightbox="media/network-integration/azure-sre-agent-packages.png":::

> [!NOTE]
> NuGet entries must be .NET CLI tools (for example, `dotnet-ef`). Library packages can't be installed globally.

## Bypass controls and governance

Full VNet mode includes bypass controls that let you temporarily disable VNet routing. These bypasses allow you to conduct network troubleshooting. By disabling VNet routing for a test run, you can isolate whether a problem originates in the agent or in the network configuration.

### Enterprise governance with Azure Policy

For enterprises that require all agent traffic to route through the VNet at all times, bypass controls present a compliance gap. Azure Policy addresses this gap. You can apply a policy to restrict or disable bypass controls, ensuring that no operator can circumvent the VNet configuration.

## Limitations

VNet integration has the following constraints:

- **Egress only**: Agent outbound (egress) traffic routes through the VNet. Inbound connections to the agent from inside a private network aren't supported in this release.

- **No inbound / private endpoint support**: There's no inbound support at this time.
