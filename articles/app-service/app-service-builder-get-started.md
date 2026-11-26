---
title: Get started with App Service Builder (preview)
description: Choose a portal, CLI, agent skills, or canvas guide to prepare and deploy your first App Service Builder app.
author: btardif
ms.author: jordanselig
ms.date: 10/27/2026
ms.topic: get-started
ms.service: azure-app-service
#customer intent: As a developer, I want to choose a way to get started with App Service Builder so that I can follow the appropriate product guide.
---

# Get started with App Service Builder (preview)

Choose how you want to work with App Service Builder, and then follow the linked product guide. The guides provide the current prerequisites, installation instructions, deployment steps, verification, and cleanup. You can read the [full documentation](https://builder.appservice.azure.com/docs/) without signing in.

> [!IMPORTANT]
> App Service Builder public preview is for development and test only. **Don't deploy production workloads.** Preview has no financially backed SLA, and Microsoft might change or discontinue features and availability. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) apply.

## Prepare to get started

For deployment, have an Azure subscription and an account with permissions to create and manage the app's Azure resources. You also need a GitHub account that can authorize access to the source repository. Azure resource permissions and GitHub source authorization are separate.

Choose a supported location from the [regions guide](https://builder.appservice.azure.com/docs/resources/regions/). Check the prerequisites in your chosen guide before installing tools or preparing source.

Use App Service Builder at no charge during the initial preview period, subject to service limits. Separately provisioned Azure resources and external services can have their own charges. Review [cost](https://builder.appservice.azure.com/docs/resources/cost/) and [quotas and limits](https://builder.appservice.azure.com/docs/reference/limits/) for current details.

## Choose your path

| Path | Why choose it | Complete guide |
| --- | --- | --- |
| **Portal** | Connect source and deploy a sample through your browser. | [Deploy with the Portal](https://builder.appservice.azure.com/docs/quickstarts/portal/) |
| **Builder CLI** | Prepare and deploy from a terminal. | [Deploy with Builder CLI](https://builder.appservice.azure.com/docs/quickstarts/builder-cli/) |
| **Agent skills** | Give your coding agent Builder-specific instructions to help prepare source and guide deployment. | [Use agent skills](https://builder.appservice.azure.com/docs/quickstarts/agent-skills/) |
| **GitHub Copilot app canvas** | Use a visual workspace alongside chat in a compatible host with native canvas support. | [Use the App Service Builder canvas](https://builder.appservice.azure.com/docs/resources/copilot-canvas/) |

Agent skills and the canvas are optional; neither is a prerequisite for the Portal or CLI quickstart. The public [App Service Builder repository](https://github.com/microsoft/azure-app-service-builder) contains CLI, agent skills, and canvas distribution resources.

## What to expect

The portal and CLI quickstarts guide you through preparing sample source code, connecting it to a Builder App, and deploying it. Follow the guide to check that deployment succeeds and that the running app returns the expected result.

When you finish, follow the guide's cleanup steps to delete the test app. Review any resources or services you created separately and remove those you no longer need.

## Next steps

- [Review the App Service Builder overview](app-service-builder-overview.md).
- [Check current feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/).
- [Explore the full product documentation](https://builder.appservice.azure.com/docs/).
