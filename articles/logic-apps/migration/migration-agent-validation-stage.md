---
title: "Migration Stage 4 - Validation: Test Workflows"
titleSuffix: Azure Logic Apps
description: Learn how the Migration Agent tests generated workflows in Azure Logic Apps Standard against source behavior during the Validation stage.
services: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewers: estfan, azla
ms.topic: concept-article
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 09/13/2026
# Customer intent: As an enterprise integration developer who works with BizTalk Server, MuleSoft, TIBCO BusinessWorks, or others, I want to learn how the Azure Logic Apps (Standard) Migration Agent in Visual Studio Code verifies the generated workflows, connections, and other supporting files against the source behavior during the Validation stage.
---

# Migration to Azure Logic Apps Stage 4 - Validation: Test workflows

[!INCLUDE [logic-apps-sku-standard](../includes/logic-apps-sku-standard.md)]

The validation process can be difficult because you can easily miss behavior differences between source and target systems. After you generate the Standard logic app project, workflows, and other artifacts, verify the workflow behavior against the source system's behavior before you deploy them to Azure Logic Apps. In the Validation stage, the Azure Logic Apps Migration Agent in Visual Studio Code helps run the generated workflows and check whether the triggers, actions, transformations, and connections work correctly.

This article describes the general process that the migration agent follows to test the generated Standard workflows against the source behavior, compare the results, and identify any problems or gaps you need to resolve.

## Validation actions

The Validation stage tests your generated Standard workflows against the original source specifications and behavior. The `@migration-converter` agent follows the generated validation tasks, while you provide representative inputs and expected results and review the evidence.

> [!IMPORTANT]
>
> Before you start, make sure that you reviewed the workflows, connections, and any .NET local functions for correct information and configuration compared to the source behavior.
>
> For more information, see:
>
> - [Conversion stage: Check completeness and quality](migration-agent-conversion-stage.md#check-completeness)
> - [Quickstart - Conversion stage: Check completeness and quality](migration-agent-quickstart.md#check-completeness)

| Step | Action | Description |
|------|--------|-------------|
| 1 | **Validate the runtime** | Runs `func start --verbose`, fixes startup errors, and reruns the command until the runtime starts cleanly. |
| 2 | **Prepare test resources** | Uses Azurite and local resources where possible, Docker containers for supported local services, and Azure resources only for connectors without a local alternative. |
| 3 | **Test behavior** | Runs happy-path, failure-path, cross-workflow, retry, timeout, resubmission, and other applicable scenarios. Compares field-level output values with expected source behavior. |
| 4 | **Report and resolve discrepancies** | Treats incorrect, empty, or truncated output values as failures, records expected and actual results, fixes the cause, and reruns affected tests. |

Validation isn't complete until all required tests pass and the agent creates `TEST-REPORT.md` in the generated project root. Review this report for per-workflow results, field-level checks, test adaptations, design deviations, provisioned Azure resources, and exact retest commands.

## Related content

- [Migration automation from integration platforms to Azure Logic Apps](migration-agent-overview.md)
- [Quickstart: Migrate an integration project using the Azure Logic Apps Migration Agent](migration-agent-quickstart.md#migration-stage-4-validation)

## Next steps

> [!div class="nextstepaction"]
> [Migration agent stage 5 - Deployment: Deploy to Azure](migration-agent-deployment-stage.md)
