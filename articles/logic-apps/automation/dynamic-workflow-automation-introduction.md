---
title: Overview
titleSuffix: Azure Logic Apps Automation
description: This service automates unpredictable AI-driven workflows that run dynamically, reason with context, choose actions, and adapt at runtime. Reduce work for ambiguous, high-churn, high-effort, and evolving tasks. Speed up development with flexible no-code, low-code tools.
ms.reviewer: estfan, krmitta, divswa, azla
ms.topic: overview
ai-usage: ai-assisted
ms.update-cycle: 180-days
ms.date: 06/02/2026
ms.custom:
  - build-2026
#Customer intent: As an automation developer, I want to learn about building dynamically-run, AI-powered, agentic workflow automation that adapts at runtime by using Azure Logic Apps Automation. 
---

# What is Azure Logic Apps Automation (preview)

> [!NOTE]
>
> This preview capability is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Whether you're new or experienced with business process automation, some processes don't follow fixed paths and resist traditional, prescriptive automation. These processes pose the following challenges:

- Steps change each time that a process runs.
- Unclear rules, shifting requirements or priorities, and exceptions that multiply.
- Unstructured, unpredictable, or undefined data.

When you hardcode every path, you end up with brittle workflows that break when conditions change. You also spend hours setting up connections, writing glue code, and managing infrastructure before you even reach the business logic. So, when you have to automate unpredictable processes or handle quickly changing requirements, this setup work slows you down and forces you to shift focus away from building out your business logic.

Azure Logic Apps Automation offers a different approach. You describe what you want to automate, and the platform builds workflows that reason about each request, choose the best next step at runtime, and escalate to a human when needed. This approach works well for ambiguous, fast-changing work with high cognitive load, so you stay focused on the business outcome. You get a visual designer, an AI assistant, and 1,400+ ready-to-use connectors so you can build, test, and monitor workflows entirely inside your browser. There's nothing else to install on your computer.

If you already use [Azure Logic Apps Standard or Consumption](compare-automation-services.md#compare-azure-logic-apps-automation-with-azure-logic-apps), consider Azure Logic Apps Automation as a sibling automation tool for scenarios with unpredictable paths. Both have the same runtime, connectors, and management tools. If you're coming from another automation platform, you can get started without experience in Azure Logic Apps.

This overview explains when to use Azure Logic Apps Automation, how it works, how to get started, and key concepts.

> [!NOTE]
>
> For stable, repetitive processes with defined behavior and predictable steps, use traditional automation like [Azure Logic Apps Standard or Consumption](../logic-apps-overview.md).

## Why use Azure Logic Apps Automation

Azure Logic Apps Automation helps you build and run dynamic, AI-driven workflows where the best path can change at runtime. When your team's success is measured by outcomes, and each request can take a different path, let workflows handle reasoning and decision-making, while you stay in control with human approval. This approach helps reduce rework when business rules change, exceptions increase, or new tools must be added quickly.

Compared with other automation platforms, Azure Logic Apps Automation combines adaptive orchestration with enterprise controls, so you can move faster without giving up governance, monitoring, or traceability.

| When | Choose |
|------|--------|
| Business process is variable and decision-loaded. | Azure Logic Apps Automation |
| Business process is stable, known, and predictable. | Azure Logic Apps Standard or Consumption |

For more comparison information, use the following table to review your options:

| Area | Azure Logic Apps Automation | Azure Logic Apps Standard and Consumption | Other automation platforms |
|------|-----------------------------|-------------------------------------------|----------------------------|
| Primary model | Ambiguous, changing workflows that need runtime adaptation | Stable, repeatable workflows with defined paths | Varies by platform and design |
| Orchestration model | Probabilistic with agentic planning and execution | Deterministic, rule-based workflow orchestration | Usually deterministic, sometimes hybrid |
| Flow pathing | Dynamic next-step selection at runtime | Predefined branches and conditions | Typically predefined with dynamic behavior depending on the platform |
| Human oversight | Built-in for approval and intervention points | Supported through workflow steps and integrations | Varies by platform capabilities |
| Tooling | Agents, MCP servers, connectors, and typed tools | Connectors, agent loops, built-in native operations, and custom integrations | Varies, often connectors and API integrations |
| Best use cases | Ambiguous tasks, high-change processes, exception handling | Defined and structured business process automation, integrations, scheduled jobs | General automation, depending on platform strengths |
| Governance and operations | Enterprise controls, monitoring, and tracing | Enterprise controls, monitoring, and diagnostics | Varies by platform maturity |
| Learning curve | Faster for intent-driven, agentic patterns | Faster for explicit process modeling | Depends on platform and team experience |

The following table provides some ways you might think about Azure Logic Apps Automation relative to other automation services, based on your prior experience:

| Experience | Recommendation |
|------------|----------------|
| Some knowledge about Azure Logic Apps Standard or Consumption | Consider Azure Logic Apps Automation a sibling service for automating processes with ambiguous, unpredictable, or unstructured workloads. Azure Logic Apps Automation and Azure Logic Apps Standard use the same runtime, connectors, and management plane. So, you might think about them as siblings. |
| None | Begin with Azure Logic Apps Automation. You don't need experience with Azure Logic Apps Standard or Consumption to get started. |
| Other automation services | Consider Azure Logic Apps Automation as a way to build dynamic workflows with connectors, governance, and monitoring, without defining every path up front. |

For more information, see [Compare automation services](compare-automation-services.md).

## How Azure Logic Apps Automation works

Azure Logic Apps Automation uses a *probabilistic* approach that supports agentic behavior. The runtime performs the following tasks:

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

## Get started with Azure Logic Apps Automation

Choose from the following approaches based on your preference:

| Starting point | Description |
|----------------|-------------|
| AI assistant | A chat experience where you use prompts to quickly generate or refine workflows. Review and adjust the results in the designer. |
| Workflow designer | A visual graphical experience where you build, test, and run agentic workflows. Manually add a trigger, actions, agents, tools, MCP servers, and other items to drive your workflow. |
| Workflow templates | Prebuilt workflow patterns for common, specific automation scenarios that include a prepopulated trigger and actions. You need to complete any setup requirements, such as authentication and parameter values, for your particular workload. |

Together, these experiences help you move faster from idea to working automation, while you stay in control over security, reliability, governance, and other enterprise requirements. Monitor and trace every step that happens in your workflow, including agent activities, for diagnostics and auditing.

## Key concepts and terminology

As you work with Azure Logic Apps Automation, you learn more about the following core components:

| Component | Description |
|-----------|-------------|
| *Project* | A top-level unit that organizes and groups your *applications*. <br><br>If you worked with Azure Logic Apps Standard, consider this component similar to a Visual Studio Code project that includes one or multiple Standard logic apps and their workflows. |
| *Application* | A deployment package that stores your *workflow* definitions and settings. <br><br>Consider this component similar to a Standard logic app. |
| *Workflow* | A sequence of tasks that always starts with an event *trigger*. A workflow uses items like *built-in operations*, *connections*, *agents*, and *MCP servers*. <br><br>Consider this component like other workflows in Azure Logic Apps Standard and Consumption. |
| *Connection* | A reusable authenticated link to a service, for example, an API key or OAuth. |
| *Trigger* | An event that runs a workflow, such as an incoming HTTP request, message arrival, or schedule occurrence. |
| *Action* | A step that runs in a workflow, such as an outgoing HTTP call, conditional branch, loop, or transformation. |
| *Agent* | An AI agent with tool capabilities. |
| *Tool* | A tool that an agent calls to complete a task. |
| *Sub-workflow* | A nested workflow that another workflow calls and runs. |

For more information, see:

- [Introduction - Azure Logic Apps Automation portal](https://auto.azure.com/docs/getting-started/introduction/)
- [Features overview - Azure Logic Apps Automation portal](https://auto.azure.com/docs/features/overview/)

## Related content

- [What is Azure Logic Apps](../logic-apps-overview.md)?

## Next steps

> [!div class="nextstepaction"]
>
> - [Create dynamic automation projects](quickstart-create-dynamic-automation-projects.md)
