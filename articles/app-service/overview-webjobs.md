---
title: "Azure WebJobs Overview"
description: "An overview of Azure WebJobs, covering its types, supported platforms, file types, scheduling with NCRONTAB expressions, deployment options, and benefits for background processing within Azure App Service."
keywords: "Azure WebJobs, App Service, background processing, triggered jobs, continuous jobs, NCRONTAB, deployment, Azure, technical overview"
ms.topic: conceptual
ms.date: 2/22/2025
author: msangapu-msft
ms.author: msangapu
ms.reviewer: cephalin;ggailey
#Customer intent: As a web developer, I want to leverage background tasks to keep my application running smoothly.
---

# Azure WebJobs Overview

## Introduction
Azure WebJobs is a built-in feature of Azure App Service that enables you to run background tasks, scripts, and programs alongside your web, API, or mobile applications without needing separate infrastructure. This integration simplifies the automation of routine or resource-intensive operations—such as data processing, file cleanups, or queue monitoring—by leveraging the same scalable, managed environment as your primary application.

## WebJob Types
WebJobs come in two primary types:
- **Triggered WebJobs:** Run on demand, on a schedule, or in response to specific events.
- **Continuous WebJobs:** Operate perpetually, ensuring that critical background processes are always active.

For scheduled tasks, NCRONTAB expressions are used to define precise execution intervals, giving you fine-grained control over when the jobs run.

## Supported Platforms and File Types
Azure WebJobs support multiple platforms:
- **Windows:** Fully supported for traditional WebJobs.
- **Linux and Containers:** Preview support is available for Linux code, Linux containers, and Windows containers.

Supported file types include:
- Windows command scripts (`.cmd`, `.bat`, `.exe`)
- PowerShell scripts (`.ps1`)
- Bash scripts (`.sh`)
- Scripting languages such as Python (`.py`), PHP (`.php`), Node.js (`.js`), and F# (`.fsx`)

This versatility enables integration of WebJobs into a wide range of application architectures.

## Benefits and Deployment
By incorporating WebJobs into your App Service, you reduce operational overhead while gaining robust capabilities for background processing. Deployment options are flexible and include:
- **Visual Studio Integration:** Seamlessly deploy WebJobs alongside your ASP.NET applications.
- **Azure Portal and ZIP Deployment:** Easily upload and deploy your WebJob packages.
- **Automated Pipelines:** Use ARM templates or Git for automated deployments.

Additionally, WebJobs provide built-in logging and monitoring, as well as seamless integration with other Azure services, making them a cost-effective and efficient solution for automating background tasks.