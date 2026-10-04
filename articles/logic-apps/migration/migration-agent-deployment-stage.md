---
title: "Migration Stage 5 - Deployment: Deploy Workflows to Azure"
titleSuffix: Azure Logic Apps
description: Learn how the Migration Agent deploys migrated Standard workflows to Azure during the Deployment stage.
services: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewers: estfan, azla
ms.topic: concept-article
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 09/13/2026
# Customer intent: As an enterprise integration developer who works with BizTalk Server, MuleSoft, TIBCO BusinessWorks, or others, I want to learn how the Migration Agent extension in Visual Studio Code for Azure Logic Apps Standard deploys migrated Standard workflows to Azure during the Deployment stage.
---

# Migration to Azure Logic Apps Stage 5 - Deployment: Deploy migrated workflows to Azure

[!INCLUDE [logic-apps-sku-standard](../includes/logic-apps-sku-standard.md)]

After you locally test your migrated Standard workflows and validate that their behavior matches the source integration flows, you need a reliable way to deploy them to Azure without manually provisioning infrastructure or risking configuration errors.

In the Deployment stage, the Azure Logic Apps Migration Agent in Visual Studio Code generates deployment files and uses the Azure CLI to provision the required Azure resources and deploy your validated workflows, connections, and supporting artifacts. This optional task is excluded from **Execute All** and runs only after you choose to execute it.

This article describes the general process that the migration agent follows to deploy migrated Standard workflows to Azure.

## Deployed Azure resources architecture

The Deployment stage creates the following Azure resources:

| Resource | Description |
|----------|-------------|
| Workflow Service Plan | The App Service plan that hosts the Standard logic app. |
| Standard logic app resource with the Workflow Service Plan hosting option | The logic app resource that hosts your migrated workflows. |
| Storage account | The resource that stores workflow state and run history. |

Depending on the workflow, the deployment can also create resources such as an integration account or an Azure Files share and mount for the built-in File System connector.

## Deployment stage actions

The migration agent generates an ARM or Bicep template and uses `az deployment group create` to create the necessary infrastructure. The agent then uploads runtime content to the logic app's Azure Files content share and restarts the logic app. Version 1.12.1 supports the Workflow Service Plan deployment model. App Service Environment v3 and Hybrid are listed as future options but aren't supported.

| Step | Action | Description |
|------|--------|-------------|
| 1 | **Generate deployment files** | Creates the ARM or Bicep template, parameter file, and required app settings for the approved solution. |
| 2 | **Provision resources** | Creates the required Azure resources, including the Workflow Service Plan, Standard logic app, and storage account. |
| 3 | **Deploy artifacts** | Uploads `host.json`, `connections.json`, workflow definitions, and compiled local-function files to the Azure Files content share under `site/wwwroot`, and then restarts the logic app. Local-only files aren't uploaded. |
| 4 | **Test in Azure** | Runs the applicable cloud tests and records the results. Shared connectors might require separate authorization. |

## Related content

- [Migration automation from integration platforms to Azure Logic Apps](migration-agent-overview.md)
- [Quickstart: Migrate an integration project using the Azure Logic Apps Migration Agent](migration-agent-quickstart.md#migration-stage-5-deployment)

## Next steps

> [!div class="nextstepaction"]
> [Extend the migration agent by creating custom parsers for unsupported integration platforms](migration-agent-extend.md)
