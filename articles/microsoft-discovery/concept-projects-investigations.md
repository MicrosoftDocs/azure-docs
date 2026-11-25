---
title: Microsoft Discovery projects and shared sessions
description: Learn about projects and shared sessions in Microsoft Discovery, how they organize scientific research, and how they relate to other platform resources.
author: surajmb
ms.author: surmb
ms.service: azure
ms.topic: concept-article
ms.date: 11/08/2026

#CustomerIntent: As a researcher or scientist, I want to understand how projects and shared sessions work in Microsoft Discovery so that I can organize my scientific research effectively.
---

# Microsoft Discovery projects and shared sessions

Microsoft Discovery organizes scientific research through two key concepts: **projects** and **shared sessions**. Projects define the functional boundary for your research resources, while shared sessions are where you interact with agents and conduct research. This article explains how both concepts work, how they relate to other platform resources, and best practices for using them.

## Projects

A project is the organizational unit within a Microsoft Discovery workspace for agents, shared sessions, and related research tasks. It references shared tools, knowledge bases, and storage containers, but the project doesn't own those resources. Project access and access to shared resources are separate authorization boundaries.

### Resources a project contains and uses

Projects contain project-owned resources and reference shared resources:

| Resource | Description |
| --- | --- |
| **Agents** | Every project includes a default **Discovery** agent ready to use. You can also create custom prompt agents that execute specific scientific tasks. Agents declare their project affiliation at creation and can't be shared across projects. However, you can clone agents between projects using the **add existing agents** option.|
| **Tools and knowledge bases** | Shared resources that exist outside the project scope. Users need the corresponding companion roles to view and select them while creating or updating an agent. A Project Contributor can run a pre-created agent without those reader roles. |
| **Shared sessions** | Research sessions where you chat with agents, run analyses, and collect insights. |
| **Storage containers** | Shared Microsoft Discovery resources that reference Azure Blob Storage for project inputs and outputs. They exist outside the project scope and require separate Discovery and Azure Storage role assignments. |

### Project and workspace relationship

Projects exist within a [workspace](quickstart-infrastructure.md#4-create-a-workspace), which provides the shared infrastructure layer:

- **Workspace** provides workspace networking, managed identities, and chat model deployments, and references supercomputers used by its projects.
- **Projects** use this infrastructure while maintaining their own agents, shared sessions, and tasks. Access to referenced storage and knowledge resources is controlled separately.

This separation allows platform administrators to manage infrastructure at the workspace level while scientists work independently within their projects.

### Project access boundary

Each project is an Azure RBAC access boundary. A platform administrator can assign **Microsoft Discovery Project Contributor (Preview)** or **Microsoft Discovery Project Reader (Preview)** directly to a project without granting access to other projects in the workspace.

Project roles cover project-owned resources such as agents, investigations, shared sessions, conversations, tasks, and Discovery Engine operations. Tools, chat model deployments, storage containers, and bookshelves are shared resources outside the project scope and require separate least-privilege role assignments.

For role inheritance, supplementary roles, and security limitations, see [Project-level access control in Microsoft Discovery](concept-project-rbac.md). For assignment steps, see [Configure project-level access](how-to-configure-project-rbac.md).

### Creating a project

You create projects in [Microsoft Discovery Studio](https://studio.discovery.microsoft.com). Each project requires:

- A workspace to host it
- A storage container for input and output data

For step-by-step instructions, see [Create a project](quickstart-infrastructure.md#9-create-a-project).

## Shared sessions

A shared session is a research session within a project where you interact with agents through natural language conversations. Shared sessions are the primary interface for conducting AI-powered scientific research and collaboration in Microsoft Discovery.

The interface uses *shared session* for this research experience. APIs and authorization descriptions also use resource names such as *investigation* and *conversation*. Preserve those names when working with the corresponding API; they aren't interchangeable resource identifiers.

### How shared sessions work

Within a shared session, you can:

- **Chat with agents** by selecting an agent and entering prompts in natural language. Use the agent selector in the chat input box or `@` and select to route messages to specific agents.
- **Run computational analyses** where agents invoke tools and knowledge bases, on your behalf to accomplish a given task.
- **Collect data-driven insights** as agents reason over your knowledge bases, run calculations, and synthesize findings.
- **Orchestrate multi-agent research** by using the Discovery Engine that coordinates multiple prompt agents across research steps.

Each shared session maintains its own conversation history and context, allowing you to track the progression of a research thread from initial question to final insight.

### Creating a shared session

You create shared sessions from the **Discovery** tab within your project in Discovery Studio, or by simply typing a prompt in the chat box on the Welcome page. For step-by-step instructions, see [Create a shared session](quickstart-agents-studio.md#3-create-a-shared-session).

## How projects and shared sessions fit in the platform

The following diagram distinguishes resource-group-level resources from workspace children. The agents and shared sessions beneath a project represent project-owned data-plane resources, not additional ARM resource types.

```
Subscription
└── Resource Group
    ├── Supercomputer
    │   └── Node Pools
    ├── Bookshelf
    │   └── Knowledge Bases
    ├── Tool
    ├── Storage Container
    │   └── Storage Assets
    └── Workspace
        ├── Chat Model Deployments (shared across projects)
        └── Project
            ├── Agents (prompt)
            │   └── References to approved tools and knowledge bases
            └── Shared Sessions
                └── Conversations with agents
```

## Best practices

- **One project per research initiative** — Scope each project to a distinct research initiative or team. Assign project roles and companion resource roles separately; referencing a shared storage container or knowledge base doesn't make its data project-isolated.
- **Use descriptive shared session names** — Since shared sessions track the evolution of a research question, use names that reflect the research objective (for example, `Aspirin Synthesis` or `Molecule Screening`).
- **Leverage workspace-level resources** — Chat model deployments and supercomputers are shared at the workspace level. You don't need to create them for each project.
- **Plan your agent structure first** — Before creating shared sessions, set up the agents your research requires. You can create agents individually or use the default Discovery agent provided with every project.

## Related content

- [Project-level access control in Microsoft Discovery](concept-project-rbac.md)
- [Configure project-level access](how-to-configure-project-rbac.md)
- [Get started with Microsoft Discovery Infrastructure](quickstart-infrastructure.md)
- [Get started with agents and shared sessions in Microsoft Discovery Studio](quickstart-agents-studio.md)
- [Microsoft Discovery agents](concept-discovery-agent.md)
- [Agent types in Microsoft Discovery](concept-discovery-agent-types.md)
- [Bookshelves and knowledge bases](concept-bookshelf-knowledge-bases.md)
