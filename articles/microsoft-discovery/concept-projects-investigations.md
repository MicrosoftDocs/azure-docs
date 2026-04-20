---
title: Microsoft Discovery projects and investigations
description: Learn about projects and investigations in Microsoft Discovery, how they organize scientific research, and how they relate to other platform resources.
author: surajmb
ms.author: surmb
ms.service: azure
ms.topic: concept-article
ms.date: 04/03/2026

#CustomerIntent: As a researcher or scientist, I want to understand how projects and investigations work in Microsoft Discovery so that I can organize my scientific research effectively.
---

# Microsoft Discovery projects and investigations

Microsoft Discovery organizes scientific research through two key concepts: **projects** and **investigations**. Projects define the functional boundary for your research resources, while investigations are where you interact with agents and conduct research. This article explains how both concepts work, how they relate to other platform resources, and best practices for using them.

## Projects

A project is the organizational unit within a Microsoft Discovery workspace where you bring together agents, tools, knowledge bases, storage containers, and investigations into a single, access-controlled boundary. Every research activity in Microsoft Discovery happens within the context of a project.

### What a project contains

Projects scope access to the following resources:

| Resource | Description |
| --- | --- |
| **Agents** | Prompt agents and workflow agents that execute scientific tasks. Agents declare their project affiliation at creation and can't be shared across projects. However, you can clone agents between projects using the **add existing agents** option.|
| **Tools and knowledge bases** | Tools and knowledge bases are not directly associated to a project, however, they are used by agents within a project.
| **Investigations** | Research sessions where you chat with agents, run analyses, and collect insights. |
| **Storage containers** | Azure Blob Storage containers that hold input and output data for your investigations. |

### Project and workspace relationship

Projects exist within a [workspace](quickstart-infrastructure-portal.md#3-create-a-workspace), which provides the shared infrastructure layer:

- **Workspace** provides the networking, supercomputers, managed identities, and chat model deployments that all projects in the workspace share.
- **Projects** consume workspace-level resources while maintaining their own isolated set of agents, investigations, and data.

This separation allows platform administrators to manage infrastructure at the workspace level while scientists work independently within their projects.

### Creating a project

You create projects in [Microsoft Discovery Studio](https://studio.discovery.microsoft.com). Each project requires:

- A workspace to host it
- A storage container for input and output data

For step-by-step instructions, see [Create a project](quickstart-infrastructure-portal.md#8-create-a-project).

## Investigations

An investigation is a research session within a project where you interact with agents through natural language conversations. Investigations are the primary interface for conducting AI-powered scientific research in Microsoft Discovery.

### How investigations work

Within an investigation, you can:

- **Chat with agents** by selecting an agent and entering prompts in natural language. Use the agent selector in the chat input box or `@` and select to route messages to specific agents.
- **Run computational analyses** where agents invoke tools and knowledge bases, on your behalf to accomplish a given task.
- **Collect data-driven insights** as agents reason over your knowledge bases, run calculations, and synthesize findings.
- **Orchestrate multi-agent workflows** by invoking workflow agents that coordinate multiple prompt agents across research steps.

Each investigation maintains its own conversation history and context, allowing you to track the progression of a research thread from initial question to final insight.

### Creating an investigation

You create investigations from the **Investigations** tab within your project in Discovery Studio. Provide a name and an optional description to get started. For step-by-step instructions, see [Create an investigation](quickstart-agents-studio.md#3-create-an-investigation).

## How projects and investigations fit in the platform

The following hierarchy shows how projects and investigations relate to other Microsoft Discovery resources:

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
            └── Investigations
                └── Conversations with agents
```

## Best practices

- **One project per research initiative** — Scope each project to a distinct research initiative or team. This keeps agents, knowledge bases, and data isolated and manageable.
- **Use descriptive investigation names** — Since investigations track the evolution of a research question, use names that reflect the research objective (for example, `Aspirin Synthesis` or `Molecule Screening`).
- **Leverage workspace-level resources** — Chat model deployments and supercomputers are shared at the workspace level. You don't need to create them for each project.
- **Plan your agent structure first** — Before creating investigations, set up the agents your research requires. You can create agents individually or deploy a preconfigured set using [agent bundles](quickstart-agents-bundles.md).

## Related content

- [Get started with Microsoft Discovery Infrastructure](quickstart-infrastructure-portal.md)
- [Get started with agents and investigations in Microsoft Discovery Studio](quickstart-agents-studio.md)
- [Add agents using bundles](quickstart-agents-bundles.md)
- [Microsoft Discovery agents](concept-discovery-agent.md)
- [Agent types in Microsoft Discovery](concept-discovery-agent-types.md)
- [Bookshelf & Knowledge Bases](concept-bookshelf-knowledge-bases.md)
