---
title: Microsoft Discovery projects and shared sessions
description: Learn about projects and shared sessions in Microsoft Discovery, how they organize scientific research, and how they relate to other platform resources.
author: surajmb
ms.author: surmb
ms.service: azure
ms.topic: concept-article
ms.date: 05/20/2026

#CustomerIntent: As a researcher or scientist, I want to understand how projects and shared sessions work in Microsoft Discovery so that I can organize my scientific research effectively.
---

# Microsoft Discovery projects and shared sessions

Microsoft Discovery organizes scientific research through two key concepts: **projects** and **shared sessions**. Projects define the functional boundary for your research resources, while shared sessions are where you interact with agents and conduct research. This article explains how both concepts work, how they relate to other platform resources, and best practices for using them.

## Projects

A project is the organizational unit within a Microsoft Discovery workspace where you bring together agents, tools, knowledge bases, storage containers, and shared sessions into a single, access-controlled boundary. Every research activity in Microsoft Discovery happens within the context of a project.

### What a project contains

Projects scope access to the following resources:

| Resource | Description |
| --- | --- |
| **Agents** | Every project includes a default **Discovery** agent ready to use. You can also create custom prompt agents and workflow agents that execute specific scientific tasks. Agents declare their project affiliation at creation and can't be shared across projects. However, you can clone agents between projects using the **add existing agents** option.|
| **Tools and knowledge bases** | Tools and knowledge bases are not directly associated to a project, however, they are used by agents within a project.
| **Shared sessions** | Research sessions where you chat with agents, run analyses, and collect insights. |
| **Storage containers** | Azure Blob Storage containers that hold input and output data for your shared sessions. |

### Project and workspace relationship

Projects exist within a [workspace](quickstart-infrastructure-portal.md#4-create-a-workspace), which provides the shared infrastructure layer:

- **Workspace** provides the networking, supercomputers, managed identities, and chat model deployments that all projects in the workspace share.
- **Projects** consume workspace-level resources while maintaining their own isolated set of agents, shared sessions, and data.

This separation allows platform administrators to manage infrastructure at the workspace level while scientists work independently within their projects.

### Creating a project

You create projects in [Microsoft Discovery Studio](https://studio.discovery.microsoft.com). Each project requires:

- A workspace to host it
- A storage container for input and output data

For step-by-step instructions, see [Create a project](quickstart-infrastructure-portal.md#9-create-a-project).

## Shared sessions

A shared session is a research session within a project where you interact with agents through natural language conversations. Shared sessions are the primary interface for conducting AI-powered scientific research and collaboration in Microsoft Discovery.

### How shared sessions work

Within a shared session, you can:

- **Chat with agents** by selecting an agent and entering prompts in natural language. Use the agent selector in the chat input box or `@` and select to route messages to specific agents.
- **Run computational analyses** where agents invoke tools and knowledge bases, on your behalf to accomplish a given task.
- **Collect data-driven insights** as agents reason over your knowledge bases, run calculations, and synthesize findings.
- **Orchestrate multi-agent workflows** by invoking workflow agents that coordinate multiple prompt agents across research steps.

Each shared session maintains its own conversation history and context, allowing you to track the progression of a research thread from initial question to final insight.

### Creating a shared session

You create shared sessions from the **Home** tab within your project in Discovery Studio, or by simply typing a prompt in the chat box on the Welcome page. For step-by-step instructions, see [Create a shared session](quickstart-agents-studio.md#3-create-a-shared-session).

## How projects and shared sessions fit in the platform

The following hierarchy shows how projects and shared sessions relate to other Microsoft Discovery resources:

```
Subscription
└── Resource Group
    ├── Supercomputer
    │   └── Node Pools
    ├── Bookshelf
    │   └── Knowledge Bases
    └── Workspace
        ├── Chat Model Deployments (shared across projects)
        └── Project
            ├── Agents (prompt and workflow)
            │   └── Knowledge Bases
            │   └── Tools
            ├── Storage Containers
            └── Shared Sessions
                └── Conversations with agents
```

## Best practices

- **One project per research initiative** — Scope each project to a distinct research initiative or team. This keeps agents, knowledge bases, and data isolated and manageable.
- **Use descriptive shared session names** — Since shared sessions track the evolution of a research question, use names that reflect the research objective (for example, `Aspirin Synthesis` or `Molecule Screening`).
- **Leverage workspace-level resources** — Chat model deployments and supercomputers are shared at the workspace level. You don't need to create them for each project.
- **Plan your agent structure first** — Before creating shared sessions, set up the agents your research requires. You can create agents individually or deploy a preconfigured set using [agent bundles](quickstart-agents-bundles.md).

## Related content

- [Get started with Microsoft Discovery Infrastructure](quickstart-infrastructure-portal.md)
- [Get started with agents and shared sessions in Microsoft Discovery Studio](quickstart-agents-studio.md)
- [Add agents using bundles](quickstart-agents-bundles.md)
- [Microsoft Discovery agents](concept-discovery-agent.md)
- [Agent types in Microsoft Discovery](concept-discovery-agent-types.md)
- [Bookshelf & Knowledge Bases](concept-bookshelf-knowledge-bases.md)
