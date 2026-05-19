---
title: "Migration Stage 5 - Deployment: Deploy Workflows to Azure"
description: "Learn how the Migration Agent deploys migrated Standard workflows to Azure during the Deployment stage."
titleSuffix: Azure Logic Apps
services: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewers: estfan, azla
ms.topic: concept-article
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 04/27/2026
# Customer intent: As a developer who works with enterprise integration platforms, such as BizTalk Server, MuleSoft, and others, I want to learn how the Azure Logic Apps (Standard) Migration Agent in Visual Studio Code deploys migrated Standard workflows to Azure during the Deployment stage.
---

# Migration to Azure Logic Apps Stage 5 - Deployment: Deploy migrated workflows to Azure (preview)

[!INCLUDE [logic-apps-sku-standard](../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> This preview feature is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you locally test your migrated Standard workflows and validate that their behavior matches the source integration flows, you need a reliable way to deploy them to Azure without manually provisioning infrastructure or risking configuration errors.

In the Deployment stage, the Azure Logic Apps Migration Agent in Visual Studio Code automates this process by using the Azure CLI to provision the required Azure resources and deploy your validated workflows, connections, and supporting artifacts to Azure in a single step.

This article describes the general process that the migration agent follows to deploy migrated Standard workflows to Azure.

## Deployed Azure resources architecture

The Deployment stage creates the following Azure resources:

| Resource | Description |
|----------|-------------|
| Standard logic app resource with the Workflow Service Plan hosting option | The logic app resource that hosts your migrated workflows. |
| Storage account | The resource that stores workflow state and run history. |
| Application Insights | The resource that provides monitoring, logging, and diagnostics. |

## Deployment stage actions

The migration agent uses the Azure CLI to create the necessary infrastructure, deploy your logic app workflows and other artifacts, and authorize any shared connections as required.

| Step | Action | Description |
|------|--------|-------------|
| 1 | **Provision resources** | Creates the required Azure resources, including the Standard logic app resource with the Workflow Service Plan as the hosting option, storage account, and Application Insights resource. |
| 2 | **Deploy artifacts** | Deploys the generated `workflow.json`, `connections.json`, and `host.json` files plus any .NET local functions to the created Standard logic app resource. |
| 3 | **Authorize connections** | Configures connections for any shared connectors and prompts for any authorization steps as required. |

## Related content

- [Migration automation from integration platforms to Azure Logic Apps](migration-agent-overview.md)
- [Quickstart: Migrate an integration project using the Azure Logic Apps Migration Agent](migration-agent-quickstart.md#migration-stage-5-deployment)

## Next steps

> [!div class="nextstepaction"]
> [Extend the migration agent by creating custom parsers for unsupported integration platforms](migration-agent-extend.md)
