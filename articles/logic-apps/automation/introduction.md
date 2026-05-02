---
title: Dynamic Workflows with Logic Apps Automation
description: Build dynamic, agentic workflows that reason, make choices, and course-correct during runtime. Speed up development with flexible no-code, low-code tools. Include agents, model context protocol (MCP) servers, connector-based tools, and other automation components. Reduce manual work for ambiguous, high-churn, high-effort, and evolving tasks.
services: azure-logic-apps
ms.reviewers: estfan, divswa, azla
ms.topic: overview
ai-usage: ai-assisted
ms.update-cycle: 180-days
ms.date: 06/02/2026
ms.custom:
  - build-2026
#Customer intent: As an automation developer, I want to learn about building dynamically-run, AI-first, agentic workflow automation that adapts during runtime by using Logic Apps Automation. 
---

# What is Logic Apps Automation (preview)

> [!NOTE]
>
> This preview capability might incur charges and is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Automation teams often handle business processes where you can't predict every step in advance. Conditions change, priorities shift, exceptions surface, and data is messy. Logic Apps Automation helps you build dynamic workflows that adapt at runtime, so you spend less time reacting and more time meeting business goals.

For stable, repetitive processes with defined behavior and predictable steps, use traditional automation like [Azure Logic Apps (Standard or Consumption)](../logic-apps-overview.md). However, some business processes don't follow fixed paths. You might not know the business rules in advance. Rather than hardcode behavior up front, Logic Apps Automation lets you create workflows that understand requests, reason with context, choose the next best action, and continue with human oversight when needed. This model works well for ambiguous, fast-changing work with high cognitive load, so you stay focused on the business outcome.

This overview explains when to use Logic Apps Automation, how it works, how to get started, and key concepts.

## Why use Logic Apps Automation

Logic Apps Automation is designed so you can build and run dynamic, agentic workflows where the best path can change at runtime. When your team's success is measured by outcomes, and each request can take a different path, let workflows handle reasoning and decision-making, while you stay in control with human approval. This helps reduce rework when business rules change, exceptions increase, or new tools must be added quickly.

| When | Choose |
|------|--------|
| Business process is variable and decision-loaded. | Logic Apps Automation |
| Business process is stable, known, and predictable. | Azure Logic Apps |

Compared with other automation platforms, Logic Apps Automation combines adaptive orchestration with enterprise controls, so you can move faster without giving up governance, monitoring, or traceability.

For more comparison information, use the following table to review your options:

| Area | Logic Apps Automation | Azure Logic Apps | Other automation platforms |
|------|-----------------------|------------------|----------------------------|
| Primary model | Ambiguous, changing workflows that need runtime adaptation | Stable, repeatable workflows with defined paths | Varies by platform and design |
| Orchestration model | Probabilistic with agentic planning and execution | Deterministic, rule-based workflow orchestration | Usually deterministic, sometimes hybrid |
| Flow pathing | Dynamic next-step selection at runtime | Predefined branches and conditions | Typically predefined with dynamic behavior depending on the platform |
| Human oversight | Built-in for approval and intervention points | Supported through workflow steps and integrations | Varies by platform capabilities |
| Tooling | Agents, MCP servers, connectors, and typed tools | Connectors, agent loops, built-in native operations, and custom integrations | Varies, often connectors and API integrations |
| Best use cases | Ambiguous tasks, high-change processes, exception handling | Defined and structured business process automation, integrations, scheduled jobs | General automation, depending on platform strengths |
| Governance and operations | Enterprise controls, monitoring, and tracing | Enterprise controls, monitoring, and diagnostics | Varies by platform maturity |
| Learning curve | Faster for intent-driven, agentic patterns | Faster for explicit process modeling | Depends on platform and team experience |

## How Logic Apps Automation works

Logic Apps Automation uses a *probabilistic* approach that supports agentic behavior. The runtime performs the following tasks:

| Task | Description |
|------|-------------|
| 1 | Interpret the provided requests or instructions. |
| 2 | Evaluate the available and relevant data, context, and domain knowledge. |
| 3 | Iteratively reason and assess the possible actions. |
| 4 | Choose and plan the best way to complete the task. |
| 5 | Execute the plan with human approval where needed. |

This solution works well when the best path varies during each run, for example:

- Purchase order processing workflows across systems and tools.
- Case triage and exception handling across systems.
- Agents deployed to tools like Microsoft Teams and Slack.
- Conversational agents backed by deterministic workflow orchestrations.
- Scenarios that need typed tools, orchestration, and summarization.

If you used Azure Logic Apps before, think about Logic Apps Automation as a complementary model for ambiguous, changing scenarios and workloads.

If you're coming from another automation platform, think about Logic Apps Automation as a way to build dynamic workflows with connectors, governance, and monitoring. Both models use the same runtime, connectors, and management plane.

If you're new to dynamic automation, start here. Logic Apps Automation shares a foundation with Azure Logic Apps, but you don't need Azure Logic Apps experience to begin.

## Get started with Logic Apps Automation

Start with the following approaches, based on your preference:

- Workflow designer

  A graphical and structured experience where you visually build, test, and run agentic workflows. Add triggers, actions, agents, tools, MCP servers, and other items to drive your workflow.

- Chat prompts

  A chat experience where you use prompts to quickly generate or refine agentic workflows. Review and adjust the results in the designer.

Together, these experiences help you move faster from idea to working automation, while you stay in control over security, reliability, governance, and other enterprise requirements. Monitor and trace every step that happens in your workflow, including agent activities, for diagnostics and auditing.

## Key concepts and terminology

As you work with Logic Apps Automation, you learn more about the following core components:

| Component | Description |
|-----------|-------------|
| Project | A top-level unit that organizes and groups your apps. |
| Apps | A deployment container that stores your workflow definitions and settings. |
| Workflow | A sequence of tasks that always start with an event. A workflow uses items like built-in operations, connectors, agents, and MCP servers. |
| Trigger | An event that starts a workflow, such as an incoming HTTP request, message arrival, or schedule occurrence. |
| Action | A step that runs in a workflow, such as an outgoing HTTP call, loop, condition, or transformation. |
| Connection | A reusable authenticated link to a service, for example, an API key or OAuth. |

## Next steps

> [!div class="nextstepaction"]
> [Create your first dynamic automation workflow](quickstart-create-dynamic-workflows.md)
