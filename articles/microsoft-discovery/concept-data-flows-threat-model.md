---
title: Data flows and threat model for Microsoft Discovery
description: Understand the trust boundaries and data flows in a Microsoft Discovery deployment, and use a STRIDE threat model to map built-in mitigations to the controls you configure.
author: loubigard
ms.author: loubigard
ms.service: azure
ms.topic: concept-article
ms.date: 10/30/2026
ms.custom: security

#CustomerIntent: As a security reviewer, I want to see how data moves through a Microsoft Discovery deployment and which threats apply at each boundary so that I can build a threat model for my environment.
---

# Data flows and threat model for Microsoft Discovery

This article describes the trust boundaries and data flows in a Discovery deployment. It maps them to threats, built-in mitigations, and the controls that you own. Use it as a starting point for your own threat model. Your network design, workspace configuration, agents, and tools change the flows, so record your actual configuration as evidence.

For the shared responsibility model and the controls you inherit from Azure, see [Security and compliance overview](concept-security-overview.md) and [Compliance guidance](concept-compliance-framework-mappings.md).

## Trust boundaries

Each trust boundary groups components by where they're hosted and who operates them.

| Boundary | Contents | Hosted in | Operated by |
| --- | --- | --- | --- |
| User device | The browser that runs Discovery Studio, and the user's sign-in session | Your users' devices | You |
| Microsoft service endpoints | Discovery Studio, the Discovery control plane in the home region, and the Discovery MCP Server | Microsoft-operated infrastructure, outside your subscription | Microsoft |
| Discovery managed resource groups | Backend resources that Discovery creates for each workspace, supercomputer, and bookshelf: Microsoft Foundry, Azure Cosmos DB, Azure AI Search, Azure SQL Database, Azure Storage, Azure Key Vault, Azure Container Apps, Azure Kubernetes Service, and Log Analytics | Your subscription | Microsoft, through Discovery service principals. Don't modify these resources. |
| Your resources | Resources that you create and connect to Discovery: virtual network and subnets, storage accounts, container registry, Key Vault, managed identities, and firewall | Your subscription | You |
| External services | GitHub Copilot, Grounding with Bing Search, remote MCP servers, public scientific databases, and package registries | Outside your subscription | GitHub, Microsoft, or third parties, under their own terms |

Discovery managed resource groups and your resources are both in your subscription and Microsoft Entra tenant, so the resources that store customer data stay within your subscription and tenant boundary. The difference is who operates them. Discovery operates the managed resource groups for you, and you operate your own resources. The Azure Storage and Azure Key Vault resources in a managed resource group are separate from the storage accounts and Key Vault that you create. In a [cross-region deployment](how-to-deploy-across-regions.md#understand-the-data-flow), the home-region control plane handles authorization context, resource metadata, provisioning, and operation status, but it doesn't transport or persist bulk customer data.

## Data flows

| ID | Flow | Data | Protection |
| --- | --- | --- | --- |
| F1 | Users sign in to Microsoft Discovery Studio. | Credentials and session | Discovery Studio is publicly accessible and secured with Microsoft Entra ID. |
| F2 | Discovery Studio and API clients call the workspace and bookshelf data planes. | Prompts, results, and metadata | Entra ID and Azure RBAC. Optionally, [private endpoints](how-to-configure-network-security.md#create-private-endpoints-for-data-plane-access) with public network access disabled. |
| F3 | The browser reads and writes files in your storage account. | Input and output files | Direct browser access with [CORS rules](how-to-configure-project-storage.md#cors-configuration) for Discovery Studio and the Visual Studio Code origins. |
| F4 | The control plane provisions and operates resources in managed resource groups. | Configuration and metadata | Discovery service principals, and a network security perimeter (NSP) around managed resources. |
| F5 | Agents call chat model deployments. | Prompts, retrieved content, and responses | NSP and private endpoints, and Microsoft Foundry Guardrails content filtering applied by default. |
| F6 | Agents run tools on the supercomputer, and tools read and write your storage. | Input and output files | The workload identity and [input and output mounts](how-to-data-handling-with-tools-agents.md). |
| F7 | Tools call public endpoints and download packages. | Queries and identifiers | Your firewall and network security groups. |
| F8 | A bookshelf indexes documents and answers queries. | Document text, embeddings, and graph | The bookshelf workload identity and the bookshelf managed resource group. |
| F9 | Discovery Studio displays results. | Summarized results and size-limited previews | Entra ID. |
| F10 | GitHub Copilot runs in the workbench. | Prompts and file context | Requires a GitHub account and the `discovery.workbench.enableGhcpAiFeatures` tag. Calls reach Discovery through the authenticated Discovery MCP Server. See [GitHub Copilot and Microsoft Discovery](concept-copilot.md). |
| F11 | Agents use the web search tool. | Search queries derived from the conversation | Data sent to [Grounding with Bing Search](/azure/foundry/agents/how-to/tools/web-search) is subject to Bing's terms. |
| F12 | Agents call remote MCP servers. | Tool arguments and results | Third-party terms and API keys. |
| F13 | Discovery writes logs. | Operation traces | Application logs in the managed resource group, activity logs in Azure Monitor, and audit logs that you [enable](how-to-enable-audit-logging.md). |
| F14 | The supercomputer pulls tool images. | Container images | The kubelet identity with the AcrPull role. |

## Threats and mitigations

The following tables apply the STRIDE categories to the data flows. Each row lists the built-in mitigation and the control that you configure.

### Spoofing

| Threat | Flows | Built-in mitigation | Your control |
| --- | --- | --- | --- |
| A stolen user token is used to access Discovery Studio or the data plane. | F1, F2 | Entra ID authentication | Conditional Access, phishing-resistant multifactor authentication, and private endpoints with public network access disabled |
| A caller other than the Discovery service reaches the supercomputer management plane. | F4 | IP restrictions to the Discovery service, or a private supercomputer | Register the required feature or create a [private supercomputer](how-to-configure-supercomputer-network-security.md#private-supercomputer) when you create the supercomputer |

### Tampering

| Threat | Flows | Built-in mitigation | Your control |
| --- | --- | --- | --- |
| A compromised base image or package enters a tool image. | F14 | None specific to Discovery | Use immutable image digests, a private registry, and image scanning. See [Supercomputer AKS upgrades](concept-supercomputer-aks-upgrades.md#prepare-tools-for-kubernetes-upgrades). |
| Someone modifies resources in a managed resource group. | F4 | Discovery manages these resources | Limit write access to managed resource groups, and exclude them from Azure Policy remediation. |
| A tool changes data that it shouldn't access. | F6 | Storage containers scope project data | Scope the workload identity's storage role to the storage account. |

### Repudiation

| Threat | Flows | Built-in mitigation | Your control |
| --- | --- | --- | --- |
| A change or data access can't be attributed after the activity log retention period. | F13 | Activity logs retained for 90 days, and correlation IDs | Enable audit logging to a Log Analytics workspace or storage account that you own, with a retention policy. |

### Information disclosure

| Threat | Flows | Built-in mitigation | Your control |
| --- | --- | --- | --- |
| Code generated by an agent sends data to an arbitrary endpoint. | F7 | Discovery-delegated subnets have no default outbound route | Allow only required FQDNs on a firewall for the node pool subnets. |
| Conversation content reaches web search or a third-party MCP server. | F11, F12 | The agent definition decides which tools are available | Approve web search and remote MCP agents for each project, and review third-party terms. |
| Prompts and file context reach GitHub Copilot. | F10 | GitHub Copilot features require a workspace tag | Decide on the tag when you create the workspace. See [Use GitHub Copilot in Microsoft Discovery](how-to-copilot.md). |
| Your storage account is reachable from public networks. | F3 | Microsoft Entra ID authentication | Use [network-hardened customer storage](how-to-deploy-network-hardened-stack.md#step-4-add-network-hardened-customer-blob-storage). |
| The supercomputer's AKS API server is reachable through a public FQDN. | F4 | IP restrictions to the Discovery service | Create a private supercomputer. |
| Users with read access to logs see sensitive operation details. | F13 | Logs stay in your subscription | Restrict access to Log Analytics workspaces. |

### Denial of service

| Threat | Flows | Built-in mitigation | Your control |
| --- | --- | --- | --- |
| Quota exhaustion blocks workspace or node pool creation. | F4 | None | Plan and monitor quota. See [Quota reservations](concept-quota-reservation.md). |
| AKS upgrades or Spot evictions interrupt long-running jobs. | F6 | A pod disruption budget protects running tools from voluntary disruption | Make jobs restartable, and use `Regular` priority for jobs that can't restart. |
| Public APIs limit or block tool requests. | F7 | None | Use API keys where providers offer them, and handle retries in tools. |

### Elevation of privilege

| Threat | Flows | Built-in mitigation | Your control |
| --- | --- | --- | --- |
| An agent uses the workload identity to manage Discovery resources. | F6 | Separate identity slots | Assign the workload identity only Storage Blob Data Contributor on the storage account. See [Managed identities](concept-managed-identities.md#advanced-configuration-granular-role-assignments-per-identity). |
| A user with a platform role reaches every project in a workspace. | F2 | Project-level roles | Assign project roles with companion resource roles. See [Project-level access control](concept-project-rbac.md). |

## AI-specific risks

The following table maps risks from the [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) to Discovery.

| Risk | How it appears in Discovery | Built-in mitigation | Your control |
| --- | --- | --- | --- |
| Prompt injection | Instructions in web pages, knowledge base documents, or API results steer an agent. | Foundry Guardrails content filtering | Least-privilege workload identity, restricted outbound access, and human review |
| Sensitive information disclosure | An agent includes private data in a web search, an MCP call, or a shared output. | NSP on managed resources | Project isolation, storage scoping, and approval of external tools |
| Supply chain | Third-party tool images, packages, and model weights | None specific to Discovery | Image pinning and scanning, and a private registry |
| Excessive agency | A tool with broad permissions or open outbound access acts beyond the request. | Identity slots | Separate identities and FQDN-based firewall rules |
| Misinformation | Plausible but incorrect scientific output | Grounding with citations | Human review of agent and model outputs |

For Discovery's responsible AI controls and prohibited uses, see [Responsible AI in Microsoft Discovery](concept-responsible-ai.md).

## Related content

- [Security and compliance overview](concept-security-overview.md)
- [Compliance guidance](concept-compliance-framework-mappings.md)
- [Network security](concept-network-security.md)
- [Managed identities](concept-managed-identities.md)
- [Configure secure networking for a supercomputer](how-to-configure-supercomputer-network-security.md)
