---
title: App Service Builder overview (preview)
description: Learn what App Service Builder does, understand its app model, and find current product guidance.
author: btardif
ms.author: jordanselig
ms.date: 10/27/2026
ms.topic: overview
ms.service: azure-app-service
#customer intent: As a developer, I want to understand App Service Builder so that I can decide whether to use it and find current guidance.
---

# App Service Builder overview (preview)

App Service Builder helps you go from code to a running app. Describe your application in `builder.yaml`, build a version from source, and deploy it. Use the portal, Builder CLI, or agent-assisted tools to work with your app.

> [!IMPORTANT]
> App Service Builder public preview is for development and test only. **Don't deploy production workloads.** Preview has no financially backed SLA, and Microsoft might change or discontinue features and availability. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) apply.

## Who it's for

Use App Service Builder to explore source-defined static websites, web applications, and HTTP APIs. You can also combine a static frontend with an HTTP backend.

For the current supported scenarios and preview boundaries, see [feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/). Standard App Service capabilities and service guarantees don't automatically apply to Builder.

## Understand the app model

A Builder App represents one environment and owns its source configuration, components, versions, and deployments.

- **Source and manifest**: Connect an authorized source repository. The `builder.yaml` manifest describes what to build and serve.
- **Components**: Components describe the static content or HTTP processes that make up your application.
- **Versions**: A version captures a source revision, build outputs, and version-specific configuration.
- **Deployments**: A deployment activates a version. A successful build alone doesn't mean that the application is running.

The [full product documentation](https://builder.appservice.azure.com/docs/) covers configuration, deployment, and app management.

## Plan your evaluation

Use App Service Builder at no charge during the initial preview period, subject to service limits. Resources and services that you provision separately can have their own charges.

Review these resources before deploying:

- [Cost](https://builder.appservice.azure.com/docs/resources/cost/) for current preview terms and separately billed dependencies.
- [Regions](https://builder.appservice.azure.com/docs/resources/regions/) for supported locations.
- [Quotas and limits](https://builder.appservice.azure.com/docs/reference/limits/) for current service boundaries.

## Next steps

- [Choose how to get started with App Service Builder](app-service-builder-get-started.md).
- [Read the full App Service Builder documentation](https://builder.appservice.azure.com/docs/).
- [Find Builder CLI, agent skills, and canvas releases](https://github.com/microsoft/azure-app-service-builder).
