---
title: "Migration Stage 4 - Validation: Test Workflows"
titleSuffix: Azure Logic Apps
description: "Learn how the Migration Agent tests generated workflows in Azure Logic Apps (Standard) against source behavior during the Validation stage."
services: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewers: estfan, azla
ms.topic: concept-article
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 04/27/2026
# Customer intent: As a developer who works with enterprise integration platforms, such as BizTalk Server, MuleSoft, and others, I want to learn how the Azure Logic Apps (Standard) Migration Agent in Visual Studio Code verifies the generated workflows, connections, and other supporting files against the source behavior during the Validation stage.
---

# Migration to Azure Logic Apps Stage 4 - Validation: Test workflows (preview)

[!INCLUDE [logic-apps-sku-standard](../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> This preview feature is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The validation process can be difficult because behavior differences between source and target systems are easy to miss. After you generate the Standard logic app project, workflows, and other artifacts, verify the workflow behavior against the source system's behavior before you deploy them to Azure Logic Apps. In the Validation stage, the Azure Logic Apps Migration Agent in Visual Studio Code helps you with task by running the generated workflows and checking whether the triggers, actions, transformations, and connections work correctly.

This article describes the general process that the migration agent follows to test the generated Standard workflows against the source behavior, compare the results, and identify any problems or gaps you need to resolve.

## Validation actions

The Validation stage tests your generated Standard workflows against the original source specifications and behavior. During validation, the agent locally runs the generated workflows and compares their behavior with the original integration flows.

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
| 1 | **Set up local runtime** | The migration agent locally runs the generated Standard workflows by using the Azure Functions runtime and Docker Desktop. |
| 2 | **Provision connector resources** | Docker Desktop provides the local connector resources that workflows need like file system watchers, message queues, and database connections. |
| 3 | **Test behavior** | You test the generated workflows with sample inputs and compare the outputs to the expected results from the source platform. |
| 4 | **Identify discrepancies** | The migration agent flags any differences between the source and target behavior for investigation and remediation. |

## Related content

- [Migration automation from integration platforms to Azure Logic Apps](migration-agent-overview.md)
- [Quickstart: Migrate an integration project using the Azure Logic Apps Migration Agent](migration-agent-quickstart.md#migration-stage-4-validation)

## Next steps

> [!div class="nextstepaction"]
> [Migration agent stage 5 - Deployment: Deploy to Azure](migration-agent-deployment-stage.md)
