---
title: Azure SRE Agent security and compliance FAQ
description: Security, compliance, and enterprise evaluation questions for Azure SRE Agent.
#customer intent: As an IT security professional, I want to understand the encryption methods used by Azure SRE Agent so that I can ensure compliance with my organization's data protection policies.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.topic: faq
ms.date: 02/06/2026
ms.service: azure-sre-agent
ms.collection: rai-skilling-ai-copilot
---

# Azure SRE Agent security and compliance FAQ

> [!IMPORTANT]
> Azure SRE Agent is currently in **Preview**. Security details, compliance certifications, and data handling policies might change before General Availability.
>
> For the most current information, see the [Azure SRE Agent overview](overview.md).

This FAQ addresses security, compliance, and data handling questions that enterprise teams ask when evaluating Azure SRE Agent for production use.

## Architecture overview

Azure SRE Agent follows a multi-layered cloud-native architecture built on standard Azure services to ensure enterprise-grade security, compliance, and scalability.

### What is the high-level architecture?

Azure SRE Agent is a cloud-native AI service with three main layers:

:::image type="content" source="media/faq/azure-sre-agent-architecture-diagram.png" alt-text="Diagram of high-level architecture of Azure SRE Agent.":::

### What data stores does SRE Agent use?

SRE Agent uses several Azure data services:

| Data Type | Storage Service | Purpose |
|--|--|--|
| Conversation threads | Cosmos DB | Thread and message history |
| User memories | Cosmos DB | Per-user context storage |
| Knowledge documents | Azure Blob Storage + AI Search | Document storage and semantic search |
| Telemetry/traces | Azure Data Explorer (optional) | Investigation traces |
| Workflow state | Durable Task Hub | Long-running workflow state |

## Access control and identity

Azure SRE Agent uses Azure Role-Based Access Control (RBAC) and Managed Identities to provide granular access control over resources and operations.

### How is access controlled?

Azure SRE Agent uses **Azure Role-Based Access Control (RBAC)**.

To create an agent, your user account needs `Microsoft.Authorization/roleAssignments/write` permissions, typically through:

- Role Based Access Control Administrator
- User Access Administrator
- Owner

### What identities does SRE Agent use internally?

The agent uses **Managed Identities** for all Azure resource access:

| Component | Identity Type | Access Scope |
|--|--|--|
| Agent Runtime | System-Assigned Managed Identity | Cosmos DB, AI Search, Blob Storage, LLM Provider |
| Tool Execution | System-Assigned Managed Identity | Azure ARM, Log Analytics, Kusto |
| AI Search | User-Assigned Managed Identity | Blob Storage |

The configuration doesn't store any secrets or connection strings.

### How do I control what resources the agent can access?

Associate specific resource groups with your agent during creation. The agent only accesses resources within those associated resource groups.

RBAC assignments grant the minimum required permissions:

- **Log Analytics:** Reader access for queries
- **Azure Resources:** Reader for ARM operations  
- **Storage:** Blob Data Contributor for knowledge base

### What user authentication does the solution use?

Users authenticate by using **Azure AD (Microsoft Entra ID)**. The Frontend API validates tokens and enforces access policies.

## Data handling and storage

Azure SRE Agent stores and processes data using enterprise-grade Azure services with configurable retention policies and regional data residency controls.

### Where is my data stored?

You store data in the Azure region where you deploy your agent. The data plane uses:

| Service | Data Stored | Replication |
|--|--|--|
| Cosmos DB | Threads, messages, memories | Configurable (single-region default) |
| Blob Storage | Knowledge documents, files | LRS default (configurable) |
| AI Search | Document indexes, embeddings | Single-region |
| LLM Provider | Prompts/completions (transient) | Regional |

### What data is sent to the LLM?

When you interact with Azure SRE Agent, the following data types might be sent to the underlying LLM:

| Data Type | Sent to LLM | Purpose |
|-----------|-------------|----------|
| User message | Yes | Your question or request |
| System prompt | Yes | Agent behavior instructions |
| Conversation history | Yes (limited) | Multi-turn context |
| Retrieved knowledge | Yes | RAG context from your docs |
| Tool results | Yes | Output from Azure API calls |

Azure SRE Agent uses enterprise-grade AI services with the following data handling policies:

- Your data isn't used to train models.
- Prompts and completions aren't stored unless you opt in.
- Abuse monitoring might store data for up to 30 days, but you can opt out.

### What actions can the agent take?

Azure SRE Agent operates in one of two access modes:

| Mode | Capabilities |
|------|-------------|
| **Reader Mode** | Read-only access. The agent can investigate, query logs, and analyze resources but can't make changes. |
| **Privileged Mode** | Full access. The agent can take remediation actions (restart services, scale resources, and more) on your resources. |

By default, agents start in **Reader mode**. To upgrade to Privileged mode:

1. Connect resource groups.
1. Grant write permissions to the agent's managed identity.
1. Enable the agent to execute remediation actions.
1. Log all actions with user context.

You can downgrade back to Reader mode at any time.

## Network security

Azure SRE Agent provides enterprise-grade network security with support for private endpoints, VNet integration, and firewall controls to meet your organization's connectivity requirements.

### What firewall settings are required?

Add `*.azuresre.ai` to your firewall allowlist. Some networking profiles might block access to this domain by default.

### Can I deploy in a private network?

Yes, Azure SRE Agent supports:

| Capability | Supported |
|------------|----------|
| Private endpoints | Yes (Cosmos DB, AI Search, Storage) |
| VNet integration | Yes (outbound traffic) |
| IP allowlisting | Yes |
| Azure Firewall | Yes (control egress traffic) |
| Internal-only (no public endpoint) | Yes |

### What network paths does the agent use?

| Connection | Path |
|------------|------|
| Agent to Cosmos DB | Azure backbone |
| Agent to AI Search | Azure backbone |
| Agent to LLM Provider | Azure backbone |
| Agent to ARM API | Azure backbone |
| Agent to Log Analytics | Azure backbone |
| Agent to MCP Servers | Customer-defined |

## Compliance and certifications

Azure SRE Agent inherits compliance certifications from its underlying Azure platform services, providing enterprise-grade regulatory compliance for security-conscious organizations.

### What compliance certifications apply?

Azure SRE Agent is built on Azure platform services, such as Cosmos DB, AI Search, and Blob Storage. These underlying services hold compliance certifications, which SRE Agent inherits through its architecture:

| Certification | Status | How Inherited |
|---------------|--------|---------------|
| SOC 1 Type 2 | Yes | Via Azure platform services |
| SOC 2 Type 2 | Yes | Via Azure platform services |
| ISO 27001 | Yes | Via Azure platform services |
| ISO 27017 | Yes | Via Azure platform services |
| ISO 27018 | Yes | Via Azure platform services |
| HIPAA BAA | Contact support | May require configuration |
| FedRAMP High | Contact support | Check current status |
| PCI DSS | Contact support | Customer responsibility |

For authoritative compliance information, see [Azure Compliance Documentation](/azure/compliance/).

### What about European data protection compliance?

Azure SRE Agent supports compliance with European data protection regulations:

- **Data residency:** Single-region deployment available
- **Right to erasure:** Delete threads and memories via API
- **Data portability:** Export conversations via API
- **DPA available:** Via Microsoft DPA

## Data retention and deletion

Azure SRE Agent provides configurable data retention policies with APIs for data deletion to help organizations meet their data governance requirements.

### How long is data retained?

Data retention depends on the underlying services:

- **Threads/Messages:** Stored until you delete them (configurable TTL in Cosmos DB).
- **Knowledge Documents:** Stored until you delete them.
- **Application Insights:** 90 days default (configurable).
- **Activity Logs:** 90 days (configurable via diagnostic settings).

### Can I delete my data?

Yes. The APIs support:

- Deleting individual threads.
- Removing user memories.
- Purging knowledge documents.

### What happens if Microsoft support needs access?

Microsoft follows standard Azure support procedures. For sensitive access, [Customer Lockbox](/azure/security/fundamentals/customer-lockbox-overview) provides approval workflows for Microsoft engineer access.

## Audit and monitoring

Azure SRE Agent provides comprehensive logging, audit trails, and approval workflows to meet enterprise monitoring and compliance requirements.

### What logging and audit capabilities exist?

| Activity | Log Location |
|--|--|
| User authentication | Azure AD Sign-in logs |
| API calls | Azure Activity Log |
| LLM interactions | Application Insights |
| Tool executions | Application Insights traces |
| Approvals | Cosmos DB (queryable via API) |

You can export all logs to a SIEM through Azure Event Hub.

### Is there an approval workflow for sensitive actions?

When the agent is in Privileged mode, it can execute remediation actions, but:

- The system tracks all actions with user context, timestamps, and decision history.
- You can configure scheduled tasks, runbooks, and subagents with specific action scopes.
- Azure RBAC still limits what the managed identity can access.
- You can downgrade to Reader mode at any time to disable all write operations.

## Encryption

Azure SRE Agent uses industry-standard AES-256 encryption for data at rest and TLS 1.3 for data in transit across all Azure services.

### What encryption is used?

| Data State | Encryption |
|------------|------------|
| Data at rest | AES-256 |
| Data in transit | TLS 1.3 |
| Database encryption | Transparent Data Encryption (TDE) |
| Storage encryption | Azure Storage Service Encryption (SSE) |

## Quick reference: Security checklist

Use this checklist to quickly verify that Azure SRE Agent meets your organization's security requirements.

### Agent Access Modes

| Question | Answer |
|----------|--------|
| Default mode? | Reader (read-only) |
| Can agent take actions? | Only in Privileged mode |
| How to enable writes? | Upgrade to Privileged mode in Overview |
| Can I restrict later? | Yes, downgrade to Reader anytime |

### Data Handling

| Question | Answer |
|----------|--------|
| Where is data stored? | Customer's selected Azure region |
| Is data replicated cross-region? | No, by default (configurable) |
| Is data used to train models? | No |
| How long is data retained? | Configurable (default: 90 days) |

### Access control

| Question | Answer |
|----------|--------|
| Authentication method? | Azure AD (Entra ID) |
| Authorization model? | Azure RBAC |
| Service identity? | Managed identity (no secrets) |
| Can access be scoped? | Yes, standard Azure RBAC |

### Network security

| Question | Answer |
|----------|--------|
| Private endpoint support? | Yes |
| VNet integration? | Yes |
| Public endpoint required? | No (can be internal-only) |
| IP allowlisting? | Yes |

## Related content

- [General FAQ](faq.md)
- [Operations troubleshooting FAQ](faq-troubleshooting.md)
- [Roles and permissions overview](roles-permissions-overview.md)
- [Agent run modes](agent-run-modes.md)
- [Data residency and privacy](data-privacy.md)
