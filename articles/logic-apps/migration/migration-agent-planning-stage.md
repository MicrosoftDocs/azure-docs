---
title: "Migration Stage 2 - Planning: Create Migration Plan"
titleSuffix: Azure Logic Apps
description: "Learn how the Migration Agent creates plans or roadmaps for migration to Azure Logic Apps (Standard) during the Planning stage."
services: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewers: estfan, azla
ms.topic: concept-article
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 04/27/2026
# Customer intent: As a developer who works with enterprise integration platforms, such as BizTalk Server, MuleSoft, and others, I want to learn how the Azure Logic Apps (Standard) Migration Agent in Visual Studio Code generates migration plans or roadmaps during the Planning stage.
---

# Migration to Azure Logic Apps Stage 2 - Planning: Create migration plan (preview)

[!INCLUDE [logic-apps-sku-standard](../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> This preview feature is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Although the previous Discovery stage gives you concrete information about your integration project's design, artifacts, components, and dependencies, you still face a key challenge: turning inventory into an executable migration roadmap. You need information about how artifacts and components map to equivalents in Azure Logic Apps (Standard), which parts might need redesign, and how much effort these activities take before you start the conversion process.

In the Planning stage, the Azure Logic Apps Migration Agent in Visual Studio Code uses the cataloged artifacts and generates a detailed migration plan for each logical flow group. This migration plan includes action mappings, migration gaps with recommended approaches, effort estimates, and task plans. With this knowledge, you can move on to the Conversion stage with greater predictability and a clear, low-risk plan.

This article explains how the Azure Logic Apps Migration Agent creates a migration plan during the Planning stage. You can then use this migration plan to map source artifacts to Azure Logic Apps (Standard), identify redesign gaps, and estimate effort before you start the conversion process.

## Planning stage actions

In the Azure Logic Apps Migration Agent, after you complete the **Analyze Source Design** activity, the **Plan Logic App Design** activity becomes available. When you select this activity, the `@migration-planner` GitHub Copilot agent generates the following information for each flow group:

   | Section name | Description |
   |--------------|-------------|
   | **Architecture** | The designer view, code view, and architecture diagram for the proposed solution. |
   | **Additional Azure components** | The explicit and nonexplicit Azure component conversions required for the proposed design. |
   | **Operations mapping** | The one-to-one mappings from source platform components to their equivalents in Azure Logic Apps (Standard). <br><br>For example: <br><br>- A BizTalk FILE receive port maps to a **File System** trigger in a Standard workflow. <br>- A BizTalk HTTP send port maps to an **HTTP** action in a Standard workflow. <br><br>For more information, see [Operations mapping](#operations-mapping). |
   | **Artifact dispositions** | The artifacts that require conversion and their upload destinations. |
   | **Migration gaps** | The features or components that don't have direct equivalents in Standard workflows and the recommended workarounds. For example, a BizTalk custom pipeline component might require a .NET local function in a Standard workflow. <br><br>For more information, see [Migration gaps](#migration-gaps). |
   | **Integration patterns** | The detected patterns in the integration flow. |
   | **Summary** | A high-level overview about the proposed workflow. |
   | **Effort estimates** | The estimated complexity (low, medium, high) and effort for each integration flow based on the number of actions, gaps, and dependencies. |
   | **Task plans** | The step-by-step instructions for conversion tasks in the next stage. For more information, see [Task plans](#task-plans). |

   The following example shows a sample generated migration plan:

   :::image type="content" source="media/migration-agent-planning-stage/planning-stage-main.png" alt-text="Screenshot that shows the Planning stage with the migration plan for a logical flow group and action mappings." lightbox="media/migration-agent-planning-stage/planning-stage-main.png":::

The following sections provide more information about specific migration plan areas:

### Operations mapping

The **Operations mapping** section describes how each source component maps to an equivalent in a Standard workflow, for example:

| Source component | Standard workflow equivalent | Operation type | Mapping type | Notes |
|------------------|-----------------------------|----------------|--------------|-------|
| Receive port (FILE) | **File System** trigger named **When a file is added or modified** | Built-in | Runtime native | Choose the *built-in* version that runs in the same process as the Azure Logic Apps runtime. The *shared* version runs in multitenant Azure. <br><br>For more information, see: <br><br>- [Connect to on-premises file systems from Azure Logic Apps](../../connectors/file-system.md?tabs=standard) <br>- [File System built-in connector reference](/azure/logic-apps/connectors/built-in/reference/filesystem/) |
| Send port (HTTP) | **HTTP** action | Built-in | Runtime native | For more information, see [Call external HTTP or HTTPS endpoints from Azure Logic Apps](../../connectors/connectors-native-http.md?tabs=standard). |
| Orchestration shape (Transform) | **XML Operations** action named **Transform XML** | Built-in | Runtime native | For more information, see [Transform XML in Azure Logic Apps](../logic-apps-enterprise-integration-transform.md?tabs=standard). |
| Custom pipeline component | An **Azure Functions** function <br>-or- <br>A .NET local function | Built-in | Custom | Requires code migration. <br><br>For more information, see: <br><br>- [Call Azure Functions from Azure Logic Apps](../call-azure-functions-from-workflows.md?tabs=standard) <br>- [Create and run .NET code from Standard workflows in Azure Logic Apps](../create-run-custom-code-functions.md) |

### Migration gaps

For each identified gap, the plan includes the following information:

| Item | Description |
|------|-------------|
| **Gap description** | What the source component does and why no direct equivalent exists. |
| **Recommended resolution** | The suggested workaround, such as using a .NET local function, Azure Functions function, or a custom connector. |
| **Effort impact** | How the gap affects the migration effort estimate. |

### Task plans

Each migration plan includes task plans that provide step-by-step instructions that drive Stage 3 - Conversion. Each task specifies the following information:

- The artifacts to convert.
- The target Standard workflow structure in Azure Logic Apps.
- The connections and configurations to generate.
- Any custom code that you need to write.

## Review and adjust the plans

After the migration agent generates the migration plan, carefully review the plan so you understand the roadmap and recommendations. Make any updates necessary for your scenario before you go on to the Conversion stage. The accuracy of your plan greatly affects the quality of the conversion output.

To help you better understand the plan and determine whether you need to make updates, interact with the `@migration-planner` GitHub Copilot agent by using Copilot chat in Visual Studio Code for the following tasks:
   
   - Ask questions about specific mappings.
   - Request alternative approaches for gap resolution.
   - Adjust effort estimates.
   - Request plan modifications before moving on to conversion.

## Related content

- [Migration automation from integration platforms to Azure Logic Apps](migration-agent-overview.md)
- [Quickstart: Migrate an integration project using the Azure Logic Apps Migration Agent](migration-agent-quickstart.md#migration-stage-2-planning)

## Next steps

> [!div class="nextstepaction"]
> [Migration agent stage 3 - Conversion: Generate workflows](migration-agent-conversion-stage.md)
