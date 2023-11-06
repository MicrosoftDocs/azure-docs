---
title: Runtime environment in Azure Automation
description: This article provides an overview of runtime environment in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 11/06/2023
ms.topic: conceptual
ms.custom:
---

# Runtime environment in Azure Automation

This article provides an overview on Runtime environment, scope and its new capabilities.

## About Runtime environment

The **Runtime environment** feature enables you to configure the job execution environment and provies the flexibility to choose the runtime language and version according to your requirements. Most importantly, you can update your PowerShell and Python runbooks as per the latest versions. 

It's the single source of truth to define and manage the environment in which a job is executed. Every runbook comprises of two components:
- Script code
- Runtime environment
These components can be changed independently without impacting the other. Each runbook can be associated with a single Runtime environment. However, a Runtime environment could be linked to multiple runbooks.

### Job execution environment

The Runtime environment captures the following details about the job execution environment:

1. **Language** - the scripting language targeted for runbook execution. For example, PowerShell, Python.
1. **Runtime version** - the version of the language selected for runbook execution. For example, PowerShell 7.2, Python 3.8
1. **Packages** - the packages are the assemblies and the *.dll* files that you import and required by runbooks for execution. There are two types of packages supported for Runtime environment.
   |**Default packages**  |**Customer-provided packages** |
   |---------|---------|
   |These packages enable you to manage Azure resources. For example, - Az PowerShell 8.0.0| These are custom packages that are required by runbooks during execution. The packages can be from: </br> - Public gallery:- PSgallery, pypi </br> - Self-authored. |

### Scope of Runtime environment
You can test the following scenarios through Azure portal and REST API:
- [Create](manage-runtime-environment.md#create-runtime-environment), [view](manage-runtime-environment.md#view-runtime-environment), [delete](manage-runtime-environment.md#delete-runtime-environment) and [update](manage-runtime-environment.md#update-runtime-environment) Runtime environment.
- [Create runbooks](manage-runtime-environment.md#create-runbook) linked to Runtime environment.
- [Update Runtime environments of existing runbooks](manage-runtime-environment.md#map-existing-runbooks-to-system-created-runtime-environments).
- [Run a cloud job using  runbook linked to Runtime environment](manage-runtime-environment.md#create-cloud-job).

### Upcoming capabilities
Following are the upcoming capabilities:
- Linking the execution of Runbooks to Runtime environment on Hybrid worker.
- Test Runbook update by changing its associated Runtime environment without published runbook.
- Support for PowerShell workflow, Graphical PowerShell, and Graphical PowerShell Workflow runbooks linked with customer defined Runtime environment.
- Support of latest Az PowerShell package.
- RBAC permissions for Runtime environment

## Next steps

* To work with runbooks and runtime environment, see [Manage Runtime environment](manage-runtime-environment.md).
* For details of PowerShell, see [PowerShell Docs](/powershell/scripting/overview).

