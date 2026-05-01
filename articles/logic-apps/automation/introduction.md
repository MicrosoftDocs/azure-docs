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

# What is Logic Apps Automation? (preview)

> [!NOTE]
>
> This preview capability might incur charges and is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Every day, your business process and automation development or engineering teams feel the pressure to move faster. They also have to handle increasing complexity, changing variables, various stakeholder channels, and unstructured data. For stable, repetitive processes where you know or can predict the steps, you can build traditional automation that follows a *deterministic* model with defined behavior, components, and business rules to complete business tasks by using a service like [Azure Logic Apps (Standard or Consumption)](../logic-apps-overview.md).

But some business processes don't follow fixed or determinable paths. You might not know the business rules that you need to define in advance. Priorities and conditions often change. Exceptions can unexpectedly surface. Logic Apps Automation addresses this reality by helping you design automation that adapts during runtime when conditions change.

Rather than hardcode behavior and outcomes up front, you create workflows that can understand requests, reason with context, choose the next best action, and continue running with human oversight where needed. This dynamic model handles and manages high cognitive loads, while you stay focused on fulfilling the business intent.

This overview provides a high-level description about how Logic Apps Automation works, ways to get started, and key concepts to help you learn the basics in this space.

## How does Logic Apps Automation work?

Logic Apps Automation uses a *probabilistic* approach that supports agentic behavior. The runtime performs the following tasks:

| Task | Description |
|------|-------------|
| 1 | Interpret the provided requests or instructions. |
| 2 | Evaluate the available and relevant data, context, and domain knowledge. |
| 3 | Iteratively reason and assess the possible actions. |
| 4 | Choose and plan the best way to complete the task. |
| 5 | Execute the plan with human approval where needed. |

This solution works well for scenarios, processes, and operations where the best path can vary during each run, for example:

- Purchase order processing workflows across systems and tools.
- Case triage and exception handling across systems.
- Agents deployed to tools like Microsoft Teams, Slack, and so on.
- Conversational agents backed by deterministic workflow orchestrations.
- Scenarios that need typed tools, orchestration, and summarization.

If you worked with Azure Logic Apps before, you can consider Logic Apps Automation as a sibling or complementary model that supports ambiguous, constantly changing, or evolving scenarios, conditions, and Workloads. Both models use the same runtime, connectors, and management plane.

If you're new to dynamic automation, don't worry. While Logic Apps Automation shares some heritage and DNA with Azure Logic Apps, you don't need to know anything about its sibling before you start building.

## How do I use Logic Apps Automation?

Choose from the following options or use both, based on how your team prefers to work:

- Workflow designer

  A graphical and structured experience where you visually build, test, and run agentic workflows. Add triggers, actions, agents and tools, MCP servers, and other items to drive your workflow.

- Chat prompts

  A chat experience where you use prompts to quickly generate or refine agentic workflows. You can review and adjust the results in the designer.

Together, these experiences help you move faster from idea to working automation, while you stay in control over security, reliability, governance, and other enterprise requirements. Monitor and trace every step that happens in your workflow, including agent activities, for diagnostics and auditing.

## Key concepts and terminology

As you work with Logic Apps Automation, you learn more about the following core components:

| Component | Description |
|-----------|-------------|
| Project | A top-level unit that organizes and groups your apps |
| Apps | A deployment container that stores your workflow definitions and settings |
| Workflow | A sequence of components, such as triggers, actions, agents, MCP servers, and other that automate tasks |
| Trigger | An event that starts a workflow, such as an incoming HTTP request, message arrival, or schedule occurrence |
| Action | A step that runs in a workflow, such as an outgoing HTTP call, loop, condition, transformation, and so on |
| Connection | A reusable authenticated link to a service, for example, API key, OAuth, and so on |

## Next steps

> [!div class="nextstepaction"]
> [Create your first dynamic automation workflow](quickstart-create-dynamic-automation-workflow.md)
