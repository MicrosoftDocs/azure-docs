---
title: Dynamic Agentic Workflows
titleSuffix: Logic Apps Automation
description: Learn about agentic workflow automation that runs dynamically, reasons with context, chooses actions, and adapts at runtime. Speed up development with flexible no-code, low-code tools. Reduce work for ambiguous, high-churn, high-effort, and evolving tasks.
services: azure-logic-apps
ms.reviewers: estfan, krmitta, divswa, azla
ms.topic: overview
ai-usage: ai-assisted
ms.update-cycle: 180-days
ms.date: 06/02/2026
ms.custom:
  - build-2026
#Customer intent: As an automation developer, I want to learn about building dynamically-run, AI-powered, agentic workflow automation that adapts at runtime by using Logic Apps Automation. 
---

# What is Logic Apps Automation (preview)

> [!NOTE]
>
> This preview capability is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Whether you're new or experienced with business process automation, you likely run into similar walls. While you can easily automate simple tasks, you face real business processes that pose the following challenges:

- The steps differ each time when the processes run.
- The steps are undefined, unstructured, or unpredictable with rules, paths, choices, and data.
- Requirements often change. Priorities shift. Conditions and exceptions might arise.

As a result, you wind up with brittle, hardcoded paths that break when the landscape flexes. Before you can even build and test a single workflow, you have the following tasks to complete:

- Connect different services, systems, apps, and data in your automation workloads.
- Write extra code to connect these components.
- Set up any necessary servers or other infrastructure.

When the business process steps are unpredictable or when requirements change quickly, this setup work slows you down, forcing you to divert focus away from building out your business logic.

Logic Apps Automation offers a different approach. You describe what you want to automate, and the platform provides a visual designer, an AI assistant, and 1,400+ ready-to-use connectors so you can build, test, and monitor workflows entirely inside your browser. There's nothing else to install on your computer.

Logic Apps Automation helps you build dynamic agentic workflows that adapt at runtime, so you spend less time reacting and more time meeting business goals. You don't have to define every possible path up front because you can build workflows that reason about each request, choose the best next step at runtime, and ask for human approval when necessary or required. You describe the goal you want to accomplish, and the platform figures out how to get there.

If you have experience with Azure Logic Apps (Standard or Consumption), consider Logic Apps Automation as a sibling model for scenarios that have unpredictable paths. Both services use the same runtime, connectors, and management tools. If you're coming from another automation platform, you can get started without experience in Azure Logic Apps.

For stable, repetitive processes with defined behavior and predictable steps, use traditional automation like [Azure Logic Apps (Standard or Consumption)](../logic-apps-overview.md). However, some business processes don't follow fixed paths. You might not know the business rules in advance. Rather than hardcode behavior up front, Logic Apps Automation lets you create workflows that understand requests, reason with context, choose the next best action, and continue with human oversight when needed. This model works well for ambiguous, fast-changing work with high cognitive load, so you stay focused on the business outcome.

This overview explains when to use Logic Apps Automation, how it works, how to get started, and key concepts.

## Why use Logic Apps Automation

Logic Apps Automation is designed for you to build and run dynamic, agentic workflows where the best path can change at runtime. When your team's success is measured by outcomes, and each request can take a different path, let workflows handle reasoning and decision-making, while you stay in control with human approval. This helps reduce rework when business rules change, exceptions increase, or new tools must be added quickly.

| When | Choose |
|------|--------|
| Business process is variable and decision-loaded. | Logic Apps Automation |
| Business process is stable, known, and predictable. | Azure Logic Apps (Standard or Consumption) |

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

For more information, see [Compare automation tools](compare-automation-tools.md).

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

If you used Azure Logic Apps before, consider Logic Apps Automation as a complementary model for ambiguous, changing scenarios and workloads. Both the models for Azure Logic Apps (Standard) and Logic Apps Automation use the same runtime, connectors, and management plane. You might think about them as siblings.

If you're coming from another automation platform, think about Logic Apps Automation as a way to build dynamic workflows with connectors, governance, and monitoring.

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
| *Project* | A top-level unit that organizes and groups your *applications*. |
| *Application* | A deployment package that stores your *workflow* definitions and settings. |
| *Workflow* | A sequence of tasks that always start with an event *trigger*. A workflow uses items like built-in operations, *connections*, *agents*, and *MCP servers*. |
| *Connection* | A reusable authenticated link to a service, for example, an API key or OAuth. |
| *Trigger* | An event that runs a workflow, such as an incoming HTTP request, message arrival, or schedule occurrence. |
| *Action* | A step that runs in a workflow, such as an outgoing HTTP call, conditional branch, loop, or transformation. |
| *Agent* | An AI agent with tool capabilities. |
| *Tool* | A tool that an agent calls to complete a task. |
| *Sub-workflow* | A nested workflow that another workflow calls and runs. |

## Next steps

> [!div class="nextstepaction"]
>
> - [Create dynamic automation projects](quickstart-create-dynamic-automation-projects.md)
