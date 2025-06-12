---
title: "App Service WebJobs Overview"
description: "An overview of Azure WebJobs, covering its types, supported platforms, file types, scheduling with NCRONTAB expressions, deployment options, and benefits for background processing within Azure App Service."
keywords: "Azure WebJobs, App Service, background processing, triggered jobs, continuous jobs, NCRONTAB, deployment, Azure, technical overview"
ms.topic: overview
ms.date: 5/2/2025
author: msangapu-msft
ms.author: msangapu
ms.reviewer: ggailey
ms.collection: ce-skilling-ai-copilot
#Customer intent: I want to understand what WebJobs are, how they work with Azure App Service, and whether they’re the right solution for running background tasks in my app. I'm looking for guidance on supported platforms, types of jobs, deployment options, and how to get started or go deeper based on my use case.
---

# App Service WebJobs overview

Azure WebJobs is a built-in feature of [Azure App Service](overview.md) that enables you to run background tasks, scripts, and programs alongside your web, API, or mobile applications. WebJobs simplify automation for common operations—such as data processing, image resizing, queue handling, or file cleanup—by running in the same scalable, managed environment as your application.

## Choosing WebJobs

WebJobs are a good fit when:
- You're already hosting your application on App Service.
- You want to deploy and manage background tasks together with your app.
- You don't require a separate scaling model or event-based triggers beyond basic scheduling or queue polling.

For more scalable, independently hosted, or event-driven workloads, consider using [Azure Functions](../azure-functions/functions-overview.md).

## Key capabilities

- Run background tasks without provisioning separate infrastructure
- Trigger jobs on demand, on a schedule, or continuously
- Use multiple languages and scripting platforms
- Deploy using the Azure portal, Visual Studio, zip deployment, or automation pipelines
- Monitor and troubleshoot using Kudu or App Service diagnostics
- Integrate with other Azure services such as Azure Storage, Event Hubs, or Service Bus

## WebJob types

WebJobs come in three main types:

- **Triggered WebJobs**: Run on demand or in response to specific events. You can trigger them manually or from a service like Azure Storage.
- **Scheduled WebJobs**: A specialized type of triggered WebJob that runs on a defined schedule using a `settings.job` file with [NCRONTAB expressions](webjobs-create.md#ncrontab-expressions).
- **Continuous WebJobs**: Run persistently in the background while your App Service app is running. Ideal for queue polling or background monitoring tasks.


:::image type="content" border="false" source="media/overview-webjobs/webjob-types-app-service.png" alt-text="Diagram overview of WebJobs in Azure App Service, showing job types.":::

## Supported platforms and file types

WebJobs are supported on the following App Service hosting options:

- Windows code
- Windows containers
- Linux code
- Linux containers

Supported file/script types include:

- Windows executables and scripts: `.exe`, `.cmd`, `.bat`
- PowerShell scripts: `.ps1`
- Bash scripts: `.sh`
- Scripting languages: Python (`.py`), Node.js (`.js`), PHP (`.php`), F# (`.fsx`)
- Any language runtime included in your container app

This versatility enables you to integrate WebJobs into a wide range of application architectures using the tools and languages you're already comfortable with.

## Deployment options

You can deploy WebJobs using several methods:

- **Azure portal or zip upload**: Manually upload your script or job files.
- **Visual Studio**: Deploy directly with your ASP.NET app to Windows App Service.
- **CI/CD pipelines**: Automate deployment with GitHub Actions, Azure DevOps, or Azure CLI.
- **ARM/Bicep templates**: Deploy infrastructure and jobs declaratively.

WebJobs also provide **built-in logging** via Kudu and integration with App Service diagnostics to help you monitor job activity and troubleshoot issues.

## Scaling considerations

WebJobs scale together with your App Service plan. If your app is configured to scale out to multiple instances, your WebJobs will run on each instance as appropriate:
- **Triggered WebJobs** will run on a single instance by default.
- **Continuous WebJobs** can be configured to run on all instances or a single one using the `WEBJOBS_RUN_ONCE` setting.

If you need independently scalable or event-driven execution, [Azure Functions](../azure-functions/functions-overview.md) may be more appropriate.

## Best practices

- Use **triggered** WebJobs for ad hoc or scheduled operations.
- Use **continuous** WebJobs only when the task needs to run constantly (e.g., polling a queue).
- Implement **retry logic and error handling** within your scripts.
- Use **application logging** and **Kudu logs** to monitor job behavior.
- Keep job logic **separate from main app logic** when possible.
- Use **storage-based triggers** (e.g., Azure Queues) for reliable, decoupled communication.


## Choose your scenario

| Goal | Article |
|------|---------|
| Quickly run a scheduled WebJob | [Quickstart: Create a scheduled WebJob](quickstart-webjobs.md) |
| Build a WebJob manually using scripts or code | [Create a WebJob in Azure App Service](webjobs-create.md) |
| Follow a tutorial using a practical use case | [Tutorial: Run background tasks with WebJobs](tutorial-webjobs.md) |

## <a name="NextSteps"></a> Next steps

- [Background jobs best practices – Azure Architecture Center](/azure/architecture/best-practices/background-jobs)
- [Develop WebJobs using Visual Studio](webjobs-dotnet-deploy-vs.md)
- [Get started with the WebJobs SDK](webjobs-sdk-get-started.md)
- [Use the WebJobs SDK to build advanced jobs](webjobs-sdk-how-to.md)
- [Kudu WebJobs reference on GitHub](https://github.com/projectkudu/kudu/wiki/WebJobs)