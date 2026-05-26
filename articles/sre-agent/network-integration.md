---
title: Azure SRE Agent network integration (preview)
description: Learn how VNet integration controls outbound access for the SRE Agent. Understand the three network modes, and data-plane operations on private resources.
ms.topic: concept-article
ms.date: 05/26/2026
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.service: azure-sre-agent
ms.collection: ce-skilling-ai-copilot
---

# Azure SRE Agent network integration (preview)

When you grant the SRE Agent's managed identity the appropriate RBAC permissions, it can act on your infrastructure, query your databases, and run commands against your clusters. RBAC is the primary security boundary that controls what the agent can do. Virtual network (VNet) integration adds a complementary layer of protection by controlling where the agent can send traffic. Without VNet integration, outbound traffic from the agent flows over the public internet. With it, every outbound call routes through your Azure Virtual Network and your existing network security infrastructure.

This article explains why network-level control matters for enterprise deployments, how VNet integration works, and how to choose the right network control mode for your workload.

## Why network control matters

By default, the SRE Agent can reach any endpoint on the internet. For development and test workloads, this permissive behavior is acceptable. For production enterprise deployments, this level of access creates unnecessary risk.

Two risks drive the enterprise requirement for network controls:

- **Data exfiltration**: An agent with access to sensitive internal data and unrestricted internet access can create a path for data to leave your organization.

- **Prompt injection**: Malicious content on the public internet can be crafted to manipulate agent behavior. An unrestricted agent that fetches external content is exposed to injection attacks through those responses.

Place the SRE Agent inside a virtual network for better control over its behavior.

## How VNet integration works

VNet integration connects the SRE Agent to your existing Azure Virtual Network. When the agent makes an outbound call, traffic flows through your network infrastructure instead of the public internet.

After you configure VNet integration, agent traffic:

- Appears in your **network logs** for auditing and monitoring
- Passes through your **Layer 4 and Layer 7 firewalls**
- Respects your **custom DNS** configuration
- Follows your **enterprise security policies** and egress rules

After the SRE Agent joins the VNet, it operates under the same rules as any other workload on that network, including firewall inspection, DNS resolution, and traffic logging.

> [!IMPORTANT]
> VNet integration controls **outbound (egress) traffic only**.

## Network control modes

The SRE Agent offers three network control modes. Select the mode that matches your security posture and operational context.

| Mode | Description | Best for |
|------|-------------|----------|
| **Unrestricted** | No network restrictions. The agent can reach any internet endpoint. | Development and test environments; non-sensitive workloads. |
| **Limited** | A URL allow list that uses wildcard-based rules restricts which endpoints the agent can call. | Scenarios where you want to block specific external destinations without full VNet routing. |
| **Full VNet** | All outbound traffic routes through your Azure VNet with your custom DNS and firewall rules applied. | Enterprise production deployments requiring maximum security posture and audit compliance. |

The three modes form a spectrum from fully open to fully controlled. Unrestricted mode imposes no constraints. Limited mode uses wildcard-based URL rules to control which endpoints the agent can reach. Full VNet mode routes all traffic through your network with your own custom DNS and firewall rules.

### Choose a network control mode for your workload

Use the following criteria to select a mode:

- **Full VNet**: Choose this mode if the workload handles sensitive or regulated data, requires a full audit trail of outbound network activity, or must comply with enterprise security policies. This mode is the recommended mode for production enterprise deployments.

- **Limited**: Choose this mode if you want to restrict specific external destinations without routing all traffic through a VNet. This mode works well when you need partial control without the overhead of full VNet configuration.

- **Unrestricted**: Choose this mode if the workload is a short-lived development or test environment with no access to sensitive data. This mode is the default.

## Access network control modes

To select a control mode for your agent, open your agent in the Azure portal, and select **Settings** > **Workspace configuration**.

:::image type="content" source="media/network-integration/azure-sre-agent-networking-vnet.png" alt-text="Screenshot of Azure SRE Agent workspace configuration showing network control mode options for unrestricted, limited, and full VNet." lightbox="media/network-integration/azure-sre-agent-networking-vnet.png":::

From this screen, select your egress mode and provide your own virtual network for your agent to run in.

## Preinstalled packages

Preinstall packages in the sandbox base disk image so they're available every time the agent runs. This feature is useful when your tools or scripts depend on specific packages that aren't included in the default sandbox environment.

To configure preinstalled packages:

1. Open your agent in the Azure portal, and select **Settings** > **Workspace configuration**.
1. Select the **Packages** tab.
1. Enter the package name, select the package manager (**pip** or **NuGet**), and optionally specify a version.
1. Select **+ Add package**.

:::image type="content" source="media/network-integration/azure-sre-agent-packages.png" alt-text="Screenshot of the Packages tab in Azure SRE Agent workspace configuration showing fields for package name, package manager, and version." lightbox="media/network-integration/azure-sre-agent-packages.png":::

> [!NOTE]
> NuGet entries must be .NET CLI tools (for example, `dotnet-ef`). You can't install library packages globally.

## VNet bypass controls

When you enable full VNet mode, the **On the infra network** section of the workspace configuration page lets you selectively route certain categories of traffic outside your VNet over the public internet. If you don't enable any of these controls, all agent traffic routes through your VNet.

If you don't have control over every part of your environment, configure these settings to account for those unknowns in the VNet.

Not every external service provides an Azure service tag. GitHub, for example, isn't an Azure service and doesn't expose a service tag. If your agent needs to reach GitHub, your only option with a Layer 4, IP-based firewall is to maintain a list of the provider's IP addresses, and those lists change frequently. A firewall that doesn't stay current breaks the agent.

The bypass controls help you handle exactly these situations. While your network team updates firewall rules or transitions to a firewall capable of hostname-based filtering, you can keep the agent running. Service tags and DNS were invented to solve the brittleness of IP-based rules. This feature acknowledges that reality and gives you time to get your network configuration in order. These settings aren't a permanent alternative to proper network configuration.

The following controls are available:

| Control | Description |
|---------|-------------|
| **MCP server access** | When enabled, MCP server traffic routes over the public internet instead of your VNet. |
| **Package manager access** | When enabled, package manager traffic (PyPI, npm, NuGet) routes over the public internet instead of your VNet. |
| **Code repositories** | Select which code repository providers (GitHub, GitHub Enterprise, Azure DevOps) route over the public internet instead of your VNet. |
| **Additional hosts** | Enter extra hostnames or wildcard patterns (for example, `github.com`, `*.example.com`, `raw.contoso.io`) to route over the public internet instead of your VNet. Your configured packages automatically allow their own hosts. |

### Governance considerations

Access to these controls is scoped to users with the SRE Agent Administrator role. Creating an SRE agent in an enterprise environment is itself a significant governance act because organizations typically require substantial approval to deploy services into production. The bypass controls are one aspect of the broader enterprise governance story that includes managed identity, on-behalf-of (OBO) credentials, and RBAC permissions. The agent can only do what its permissions allow, and network configuration controls where that traffic goes.

## Limitations

The following limitations apply during public preview.

- **Egress only**: VNet integration controls outbound (egress) traffic only. Inbound connections to the agent from inside a private network aren't supported.

- **Connectors don't route through the VNet**: Routing connector traffic through the VNet is out of scope for V1 and requires additional engineering work.

- **kubectl requires managed identity**: kubectl works only with managed identity credentials during the public preview of VNet integration. On-behalf-of (OBO) credential support for kubectl isn't available.

> [!NOTE]
> MCP servers and Azure resources behind the VNet are accessible as expected, provided your IP address and service tag configuration is correct.

> [!NOTE]
> Connectors are also in preview. During preview, connector traffic routes over the public internet rather than through the VNet. For more information, see [SRE Agent connectors](mcp-connectors.md).
