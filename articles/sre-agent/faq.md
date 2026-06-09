---
title: Azure SRE Agent general FAQ
description: General frequently asked questions about Azure SRE Agent service overview, pricing, and availability.
#customer intent: As a Site Reliability Engineer, I want to understand what Azure SRE Agent is so that I can evaluate its relevance to my team's operations.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.topic: faq
ms.date: 06/02/2026
ms.service: azure-sre-agent
ms.custom: references_regions
---

# Azure SRE Agent general FAQ

This article answers general questions about Azure SRE Agent service overview, licensing, regional availability, and core capabilities.

## Service overview

### What is Azure SRE Agent?

Azure SRE Agent is an AI-powered service that helps Site Reliability Engineers and operations teams investigate incidents, troubleshoot problems, and automate remediation tasks across Azure resources. The agent uses large language models to understand natural language queries and can take actions on your behalf.

### What can Azure SRE Agent do?

Azure SRE Agent can:
- Investigate incidents across Azure resources.
- Query logs and metrics from Azure Monitor and Application Insights.
- Analyze error patterns and suggest solutions.
- Create incident response plans.
- Build custom subagents for specialized scenarios.
- Connect to external services through integrations.
- Take remediation actions when configured in privileged mode.

### How is Azure SRE Agent different from other AI assistants?

Azure SRE Agent is specifically designed for operations and reliability scenarios with:
- Deep integration with Azure monitoring and observability tools.
- Understanding of SRE methodologies and incident response patterns.
- Ability to take actions on Azure resources (when authorized).
- Context retention across investigation sessions.
- Specialized knowledge of Azure services and common failure patterns.

## Pricing and licensing

### How is Azure SRE Agent priced?

For current pricing information, see [Azure SRE Agent pricing](pricing-billing.md).

### Is there a free tier?

For pricing information, see [Billing for Azure SRE Agent](pricing-billing.md).

### What costs are included?

Pricing includes:
- Agent compute and orchestration
- Data storage (conversations, knowledge base)
- AI model usage
- Integration with Azure services

Separate charges might apply for:
- Azure Monitor logs and metrics consumption
- Third-party integrations
- Data egress charges

## Regional availability

### Where is Azure SRE Agent available?

Azure SRE Agent is currently available in:
- Sweden Central
- East US 2
- Australia East

### Can I deploy in other regions?

Support for additional regions will be added as the service expands. For the latest regional availability, check the Azure portal during agent creation.

### Does the agent work with resources in other regions?

Yes, once deployed, Azure SRE Agent can manage and investigate resources across all Azure regions, regardless of where the agent is hosted.

## Getting started

### What permissions do I need to create an agent?

To create an Azure SRE Agent, you need:
- Owner or User Access Administrator permissions on the subscription
- Permissions to create resources in supported regions
- The Microsoft.App resource provider registered for the subscription

### How do I get started?

For a step-by-step walkthrough, see [Diagnose your first incident](usage.md).

### Can I try the agent without affecting production systems?

Yes, use Azure SRE Agent in **Reader mode**. This mode provides read-only access to investigate and analyze resources without making any changes.

## Integration capabilities

### What Azure services does SRE Agent integrate with?

SRE Agent integrates with:
- Azure Monitor (logs, metrics, alerts)
- Application Insights
- Log Analytics
- Azure Resource Manager
- Azure Data Explorer
- Azure DevOps
- GitHub

For a complete list, see [Connect to external services](connectors.md).

### Can I connect custom tools or APIs?

Yes, connect custom tools or APIs through Model Context Protocol (MCP) servers. For more information, see [Connect to custom MCP server](mcp-connector.md).

## Data and privacy

### Where is my data stored?

The agent stores data in the same Azure region where you deploy it. For detailed information, see [Data residency and privacy](data-privacy.md).

### Is my data used to train AI models?

No, Azure SRE Agent doesn't use your data to train AI models. Azure SRE Agent uses enterprise-grade AI services that follow strict data handling policies.

## Network and VNet integration

### Do I need VNet integration to use the agent?

No. The SRE Agent works fully without VNet integration. In **Unrestricted** mode (the default), the agent investigates incidents, runs tools, queries Azure resources, and takes management actions over the public internet. Control plane operations (resource discovery, ARM calls, Azure Monitor metrics) work regardless of network configuration.

VNet integration is for organizations that need egress control, private endpoint access, network-level audit trails, or compliance with enterprise network policies.

### What can the agent do without VNet?

Everything that doesn't require access to private-network-only resources:

- Investigate incidents using publicly accessible Azure resources.
- Run Azure CLI and kubectl commands against public endpoints.
- Query Log Analytics and Application Insights (if public access is enabled).
- Connect to GitHub, Jira, Slack, and other SaaS services.
- Create and manage scheduled tasks and response plans.
- Use all connectors and MCP servers.

### When should I enable VNet?

Enable VNet integration when your Log Analytics workspaces, AKS clusters, or databases have public access disabled (behind AMPLS or private endpoints), your security policy requires all outbound traffic to pass through a firewall, you need to reach on-premises systems via ExpressRoute or VPN, or compliance requires network-level visibility into where the agent sends data.

For more information, see [Network integration](network-integration.md).

### Can I switch network modes on a running agent?

Yes. You can switch between Unrestricted, Limited, and Azure VNet modes at any time. Settings persist across mode changes. When you connect a VNet, the other mode cards are disabled until you disconnect the VNet.

## Related content

- [Operations troubleshooting FAQ](faq-troubleshooting.md)
- [Security and compliance FAQ](data-privacy.md)
- [Azure SRE Agent overview](overview.md)
- [Billing](pricing-billing.md)
