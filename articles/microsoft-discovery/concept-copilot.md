---
ms.service: azure
ms.author: reburkea
author: reburkea
title: GitHub Copilot & Microsoft Discovery
description: Conceptual overview and canonical examples of using GitHub Copilot in Microsoft Discovery.
ms.topic: concept-article
ms.date: 06/29/2026
---

# GitHub Copilot & Microsoft Discovery

GitHub Copilot serves as the conversational and developer interface for Microsoft Discovery. It connects to the Discovery platform through the Discovery MCP Server, enabling you to invoke Discovery agents, manage resources, and orchestrate scientific workflows using natural language — all from within the Discovery Studio.

While Copilot handles prompt interpretation and user interaction, all workflow execution, data access, and governance remain within the Discovery platform.

## Architecture overview

GitHub Copilot and Microsoft Discovery have a clear separation of responsibilities:

| Layer | Responsibility |
|-------|----------------|
| **GitHub Copilot** | Natural language interface, prompt reasoning, user interaction |
| **Discovery MCP Server** | API surface, authentication, routing, policy enforcement |
| **Discovery agents** | Scientific workflow execution, tool invocation, reasoning |
| **Azure infrastructure** | Compute, data storage, governance, compliance |

This separation means Copilot evolves independently from Discovery while enterprise governance and security controls remain in the platform layer.

## How the integration works

Microsoft Discovery exposes its capabilities through a **Discovery MCP Server** — a managed runtime hosted in Azure. GitHub Copilot connects to this server as an MCP (Model Context Protocol) client, which gives it access to all Discovery APIs without needing local adapters or custom configurations.

The interaction flow follows this pattern:

1. You write a natural language prompt in Copilot Chat within the Discovery Studio.
2. Copilot interprets your intent and translates it into MCP tool calls.
3. The Discovery MCP Server receives the calls, authenticates the request, and routes it to the appropriate Discovery service.
4. Discovery agents execute the workflow — invoking tools, accessing data, running computations.
5. Results are stored in Discovery and returned through Copilot to you.

> [!IMPORTANT]
> Copilot does not execute scientific workflows itself. It translates your prompts into structured requests that the Discovery platform executes. This ensures that all compute, data access, and security enforcement happen within your governed Azure environment.

## What Copilot provides

GitHub Copilot brings several capabilities to the Discovery experience:

- **Natural language orchestration** — Describe what you want to accomplish and Copilot routes your request to the right Discovery agents and tools.
- **Plan generation** — Copilot helps you break down complex research objectives into structured investigation plans that the Discovery Engine can execute.
- **Report generation** — After agents complete their work, Copilot can synthesize results into readable summaries and reports.
- **Resource management** — Create and configure workspaces, projects, agents, knowledge bases, and compute jobs through conversational prompts.
- **Built-in skills** — The workbench includes skills optimized for Discovery workflows, providing guided orchestration for common research tasks.

## What Discovery provides

The Discovery platform handles all aspects of execution and governance:

- **Agent runtime** — Discovery agents execute scientific tasks using tool-augmented reasoning, multi-agent orchestration, and specialized domain knowledge.
- **Compute infrastructure** — Azure-based compute including CPUs, GPUs, and specialized hardware for large-scale simulations and analyses.
- **Data access and storage** — Secure access to private and enterprise data sources, with results persisted in your workspace's managed storage.
- **Governance and compliance** — Enterprise security controls, role-based access, audit trails, and compliance certifications.
- **Discovery Engine** — The autonomous reasoning engine that plans, executes, and manages long-running scientific investigations.

## Copilot as one client among many

Because Discovery uses the Model Context Protocol (MCP) as its integration layer, Copilot is one of potentially many clients that can connect to Discovery. The platform's capabilities aren't locked to a single interface. This design ensures:

- **Flexibility** — Teams can build custom tools or integrate other agent frameworks that also connect via MCP.
- **Consistency** — All clients interact through the same authenticated, policy-enforced API surface regardless of the interface they use.
- **Future-proofing** — As new MCP-compatible tools emerge, they can connect to Discovery without platform changes.

## Where Copilot runs in Discovery

GitHub Copilot is integrated into the **Discovery Studio** — a VS Code–based web environment where you conduct interactive research. Discovery Studio provides:

- A fully featured VS Code environment with a compute runtime
- A file explorer backed by Azure Storage for persistent file management
- Direct access to the Discovery MCP Server for managing Discovery resources
- Integration with the GitHub Copilot ecosystem including models, skills, custom agents, and extensions

Authentication is handled automatically when you open the workbench. You interact with Copilot through the chat panel, and it has full access to Discovery capabilities through the pre-configured MCP connection.

> [!NOTE]
> GitHub Copilot features require a GitHub account. Workspace administrators must enable Copilot through resource tags before it becomes available. For setup steps, see [Use GitHub Copilot in Microsoft Discovery](how-to-copilot.md).

## Design principles

The Copilot–Discovery integration is built on these principles:

### Decoupled UX and execution

Copilot and Discovery evolve independently. Updates to Copilot's reasoning capabilities don't require Discovery platform changes, and Discovery can add new agents and tools without modifying the Copilot integration.

### Enterprise control stays in Discovery

Security, governance, data access policies, and compliance controls are enforced at the Discovery platform layer. Copilot cannot bypass these controls — it interacts through the same authenticated API surface as any other client.

### Prompt-driven science

Rather than requiring researchers to learn platform-specific APIs or navigate complex UIs, Copilot provides a natural language layer that makes Discovery's capabilities accessible through conversation. This lowers the barrier to entry while preserving the platform's full power.
