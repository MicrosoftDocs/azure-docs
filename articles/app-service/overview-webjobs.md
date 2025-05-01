---
title: "App Service WebJobs Overview"
description: "An overview of Azure WebJobs, covering its types, supported platforms, file types, scheduling with NCRONTAB expressions, deployment options, and benefits for background processing within Azure App Service."
keywords: "Azure WebJobs, App Service, background processing, triggered jobs, continuous jobs, NCRONTAB, deployment, Azure, technical overview"
ms.topic: overview
ms.date: 5/1/2025
author: msangapu-msft
ms.author: msangapu
ms.reviewer: ggailey
#Customer intent: As a web developer, I want to leverage background tasks to keep my application running smoothly.
---

# App Service WebJobs overview

## Introduction
Azure WebJobs is a built-in feature of Azure App Service that enables you to run background tasks, scripts, and programs alongside your web, API, or mobile applications without needing separate infrastructure. This integration simplifies the automation of routine or resource-intensive operations—such as data processing, file cleanups, or queue monitoring—by leveraging the same scalable, managed environment as your primary application.

## WebJob types
WebJobs come in two primary types:
- Triggered WebJobs: Run on demand, on a schedule, or in response to specific events.
- Continuous WebJobs: Operate perpetually, ensuring that critical background processes are always active.

For scheduled tasks, NCRONTAB expressions are used to define precise execution intervals, giving you fine-grained control over when the jobs run.

## Supported platforms and file types
Azure WebJobs is fully supported on Windows code, Windows containers, Linux code, and Linux containers.

Supported file types include:
- Windows command scripts (`.cmd`, `.bat`, `.exe`)
- PowerShell scripts (`.ps1`)
- Bash scripts (`.sh`)
- Scripting languages such as Python (`.py`), PHP (`.php`), Node.js (`.js`), and F# (`.fsx`)
- WebJobs written in the language runtime of the Windows/Linux container app.

This versatility enables integration of WebJobs into a wide range of application architectures.

## Benefits and deployment
WebJobs provide a straightforward way to run background tasks as part of your App Service app, without needing separate infrastructure. They support various deployment methods depending on your workflow:

- Visual Studio: Supports direct deployment of WebJobs along with ASP.NET apps on Windows App Service.
- Azure portal or ZIP upload: Upload a .zip package containing your script or executable and trigger configuration.
- Automation tools: WebJobs can be deployed using ARM templates, Git, or CI/CD pipelines (like GitHub Actions or Azure DevOps).
- Built-in logging and integration with Kudu make it easy to monitor execution and troubleshoot issues.
- Additionally, WebJobs provide built-in logging and monitoring, as well as seamless integration with other Azure services, making them a practical solution for automating background tasks.

## <a name="NextSteps"></a> Next step
[Create a scheduled WebJob](quickstart-webjobs.md).
[Build a custom scheduled WebJob from scratch using .NET, Python, Node.js, Java, or PHP](tutorial-webjobs.md).
[How to run background tasks with WebJobs](webjobs-create.md).