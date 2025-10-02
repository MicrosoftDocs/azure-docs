---
title: Roles and permissions overview in Azure SRE Agent Preview
description: Learn about roles, permissions, and security models in Azure SRE Agent.
author: craigshoemaker
ms.topic: overview
ms.date: 09/15/2025
ms.author: cshoe
ms.service: azure-sre-agent
---

# Roles and permissions overview in Azure SRE Agent Preview

Azure SRE Agent helps you manage Azure resources by automating diagnostics, root cause analysis, and mitigation actions. The agent supports secure, multi-user access through a layered permission model. This security model governs both how users interact with the agent and how the agent acts on resources. With these controls, the agent operates in a safe and customizable context aligned with your governance needs and trust boundaries.

Built on Azure role-based access control (RBAC), the security model combines agent identity and configurable run modes. Available modes include review and autonomous agent execution modes. These modes ensure agent actions are performed only when authorized.

## Key concepts

The security model in Azure SRE Agent consists of three main components:

| Component | Description |
|---|---|
| **[Role-based access control](./user-access-roles.md)** | Determines how users can access SRE Agent with different permission levels. |
| **[Agent managed identity](./agent-managed-identity.md)** | Controls how does SRE Agent get permissions to perform actions on resources. |
| **[Agent run modes](./agent-run-modes.md)** | Shows how agent execution mode, agent identity, and user permissions work together. |

## Security model at a glance

- **Role-based access control**: Three primary roles (*SRE Agent Admin*, *SRE Agent Standard User*, and *SRE Agent Reader*) control user capabilities

- **Permission levels**: The agent's managed identity can have either *Reader* or *Privileged* access to resources

- **Operation modes**: The agent can run in either *Review* or *Autonomous* mode, affecting how it handles consent

- **Security boundaries**: Agent permissions take precedence over direct user permissions to prevent privilege escalation

## Next steps

For detailed information about each component of the security model, refer to these articles:

- [User access roles](./user-access-roles.md)
- [Agent managed identity](./agent-managed-identity.md)
- [Agent run modes](./agent-run-modes.md)
