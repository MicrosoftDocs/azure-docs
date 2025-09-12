---
title: Roles and permissions overview in Azure SRE Agent Preview
description: Learn about roles, permissions, and security models in Azure SRE Agent.
author: craigshoemaker
ms.topic: overview
ms.date: 09/12/2025
ms.author: cshoe
ms.service: azure-sre-agent
---

# Roles and permissions overview in Azure SRE Agent Preview

Azure SRE Agent provides a comprehensive security model based on role-based access control (RBAC) that governs how users interact with the agent and how the agent interacts with Azure resources. This article serves as an overview to the key concepts related to roles and permissions in Azure SRE Agent.

## Key concepts

The security model in Azure SRE Agent consists of three main components:

| Component | Description |
|---|---|
| **[User access roles](./user-access-roles.md)** | Defines who can do what within the agent interface |
| **[Agent and user permissions](./agent-user-permissions.md)** | Controls access to Azure resources |
| **[Agent run modes](./agent-actions.md)** | Determines how the agent handles consent and credentials |

## Security model at a glance

- **Role-based access**: Three primary roles (*SRE Agent Admin*, *SRE Agent Standard User*, and *SRE Agent Reader*) control user capabilities

- **Permission levels**: The agent's managed identity can have either *Reader* or *Privileged* access to resources

- **Operation modes**: The agent can run in either *Review* or *Autonomous* mode, affecting how it handles consent

- **Security boundaries**: Agent permissions take precedence over direct user permissions to prevent privilege escalation

## Next steps

For detailed information about each component of the security model, refer to these articles:

- [User access roles](./user-access-roles.md)
- [Agent and user permissions](./agent-user-permissions.md)
- [Agent run modes](./agent-actions.md)
