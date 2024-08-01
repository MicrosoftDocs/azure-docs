---
title: How to migrate from legacy Log Analytics agents in non-Azure environments with Azure Arc
description: Learn how to migrate from legacy Log Analytics agents in non-Azure environments with Azure Arc.
ms.date: 07/01/2024
ms.topic: conceptual
---

# Migrate from legacy Log Analytics agents in non-Azure environments with Azure Arc

Azure Monitor Agent (AMA) replaces the Log Analytics agent (also known as Microsoft Monitor Agent (MMA) and OMS) for Windows and Linux machines. Azure Arc is required to migrate off the legacy Log Analytics agents for non-Azure environments, including on-premises or multicloud infrastructure.

Azure Arc is a bridge, extending not only Azure Monitor but the breadth of Azure management capabilities across Microsoft Defender, Azure Policy, and Azure Update Manager to non-Azure environments. Through the lightweight Connected Machine agent, Azure Arc projects non-Azure servers into the Azure control plane, providing a consistent management experience across Azure VMs and non-Azure servers.   

This article focuses on considerations when migrating from legacy Log Analytics agents in non-Azure environments. For core migration guidance, see [Migrate to Azure Monitor Agent from Log Analytics agent](../../azure-monitor/agents/azure-monitor-agent-migration.md).

## Advantages of Azure Arc  

Deploying Azure Monitor Agent as an extension with Azure Arc-enabled servers provides several benefits over the legacy Log Analytics agents (MMA and OMS), which directly connect non-Azure servers to Log Analytics workspaces:  

- Azure Arc centralizes the identity, connectivity, and governance of non-Azure resources. This streamlines operational overhead and improves the security posture and performance.   

- Azure Arc offers extension management capabilities including auto-extension upgrade, reducing typical maintenance overhead.   

- Azure Arc enables access to the breadth of server management capabilities beyond monitoring, such as Cloud Security Posture Management with [Microsoft Defender](../../defender-for-cloud/defender-for-cloud-introduction.md) or scripting with [Run Command](run-command.md). As you centralize operations in Azure, Azure Arc provides a robust foundation for these other capabilities.  

Azure Arc is the foundation for a cloud-based inventory bringing together Azure and on-premises, multicloud, and edge infrastructure that can be queried and organized through Azure Resource Manager (ARM). 

## Limitations on Azure Arc

Azure Arc relies on the [Connected Machine agent](/azure/azure-arc/servers/agent-overview) and is an agent-based solution requiring connectivity and designed for server infrastructure: 

- Azure Arc requires the Connected Machine agent in addition to the Azure Monitor Agent as a VM extension. The Connected Machine agent must be configured specifying details of the Azure resource.  

- Azure Arc only supports client-like Operating Systems when computers are in a server-like environment and doesn't support short-lived servers or virtual desktop infrastructure. 

- Azure Arc has two regional availability gaps with Azure Monitor Agent:
    - Qatar Central (Availability expected in August 2024)
    - Australia Central (Other Australia regions are available)  
    
- Azure Arc requires servers to have regular connectivity and the allowance of key endpoints. While proxy and private link connectivity are supported, Azure Arc doesn't support completely disconnected scenarios. Azure Arc doesn't support the Log Analytics (OMS) Gateway.  

- Azure Arc defines a System Managed Identity for connected servers, but doesn't support User Assigned Identities.  

Learn more about the full Connected Machine agent [prerequisites](/azure/azure-arc/servers/prerequisites#supported-operating-systems) for environmental constraints.

## Relevant services

Azure Arc-enabled servers is required for deploying all solutions that previously required the legacy Log Analytics agents (MMA/OMS) to non-Azure infrastructure. The new Azure Monitor Agent is only required for a subset of these services.

|Azure Monitor Agent and Azure Arc required  |Only Azure Arc required  |
|---------|---------|
|Microsoft Sentinel |Microsoft Defender for Cloud |
|Virtual Machine Insights (previously Dependency Agent) |Azure Update Management |
|Change Tracking and Inventory |Automation Hybrid Runbook Worker |

As you design the holistic migration from the legacy Log Analytics agents (MMA/OMS), it's critical to consider and prepare for the migration of these solutions.

## Deploying Azure Arc

Azure Arc can be deployed interactively on a single server basis or programmatically at scale:

- PowerShell and Bash deployment scripts can be generated from Azure portal or written manually following documentation.  

- Windows Server machines can be connected through Windows Admin Center and the Windows Server Graphical Installer.  

- At scale deployment options include Configuration Manager, Ansible, and Group Policy using the Azure service principal, a limited identity for Arc server onboarding.  

- Azure Automation Update Manager customers can onboard from Azure portal with the Arc-enablement of all detected non-Azure servers connected to the Log Analytics workspace with the Azure Automation Update Management solution.  

See [Azure Connected Machine agent deployment options](/azure/azure-arc/servers/deployment-options) to learn more.

## Agent control and footprint

You can lock down the Connected Machine agent by specifying the extensions and capabilities that are enabled. If migrating from the legacy Log Analytics agent, the Monitor mode is especially salient. Monitor mode applies a Microsoft-managed extension allowlist, disables remote connectivity, and disables the machine configuration agent. If you’re using Azure Arc solely for monitoring purposes, setting the agent to Monitor mode makes it easy to restrict the agent to just the functionality required to use Azure Monitor and solutions that use Azure Monitor. You can configure the agent mode with the following command (run locally on each machine): 

`azcmagent config set config.mode monitor` 

See [Extensions security](/azure/azure-arc/servers/security-extensions) to learn more.

## Networking options

Azure Arc-enabled servers supports three networking options:

- Connectivity over public endpoint
- Proxy 
- Private Link (Azure Express Route). 

All connections are TCP and outbound over port 443 unless specified. All HTTP connections use HTTPS and SSL/TLS with officially signed and verifiable certificates.  

Azure Arc doesn't officially support using the Log Analytics gateway as a proxy for the Connected Machine agent.  

The connectivity method specified can be changed after onboarding.   

See [Connected Machine agent network requirements](/azure/azure-arc/servers/network-requirements?tabs=azure-cloud) to learn more.

## Deploying Azure Monitor Agent with Azure Arc

There are multiple methods to deploy the Azure Monitor Agent extension on Azure Arc-enabled servers programmatically, graphically, and automatically. Some popular methods to deploy Azure Monitor Agent on Azure Arc-enabled servers include:  

- Azure portal 
- PowerShell, Azure CLI, or Azure Resource Manager (ARM) templates 
- Azure Policy 

Azure Arc doesn't eliminate the need to configure and define Data Collection Rules. You should configure Data Collection Rules similar to your Azure VMs for Azure Arc-enabled servers.

See [Deployment options for Azure Monitor Agent on Azure Arc-enabled servers](/azure/azure-arc/servers/concept-log-analytics-extension-deployment) to learn more.

## Standalone Azure Monitor Agent installation

For Windows client machines running in non-Azure environments, use a standalone Azure Monitor Agent installation that doesn't require deployment of the Azure Connected Machine agent through Azure Arc. See [Install Azure Monitor Agent on Windows client devices using the client installer](/azure/azure-monitor/agents/azure-monitor-agent-windows-client) to learn more.
