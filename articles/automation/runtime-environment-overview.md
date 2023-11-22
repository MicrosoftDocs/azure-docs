---
title: Runtime environment (preview) in Azure Automation
description: This article provides an overview on runtime environment in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 11/22/2023
ms.topic: conceptual
ms.custom:
---

# Runtime environment in Azure Automation

This article provides an overview on Runtime environment, scope and its capabilities.

## About Runtime environment (preview)

**Runtime environment** enables you to configure the job execution environment and provides the flexibility to choose the runtime language and runtime version according to your requirements. It's the single source of truth to define and manage the environment in which a job is executed. Every runbook comprises of two components:

- Script code
- Runtime environment - defines the Runtime language, Runtime version and Packages required during job execution.

You can change these components independently without impacting the other.

> [!NOTE]
> You can associate each runbook with a single Runtime environment. However, a Runtime environment could be linked to multiple runbooks.

### Components of Runtime environment

Runtime environment captures the following details about the job execution environment:

1. **Language** - the scripting language targeted for runbook execution. For example, PowerShell, Python.
1. **Runtime version** - the version of the language selected for runbook execution. For example, PowerShell 7.2, Python 3.8
1. **Packages** - the packages are the assemblies and the *.dll* files that you import and required by runbooks for execution. There are two types of packages supported for Runtime environment.
    
   |**Package Types** | **Description** |
   |---------|---------|
   |**Default packages**  | The packages enable you to manage Azure resources. For example, - Az PowerShell 8.0.0 |
   |**Customer-provided packages** | These are custom packages that are required by runbooks during execution. The packages can be from: </br> - Public gallery:- PSGallery, pypi </br> - Self-authored. |

## Key Benefits

**Granular control** - enables you to configure the script execution environment by choosing the Runtime language, its version, and dependent modules.
**Runbook update** - allows easy portability of runbooks across different versions to keep pace with latest PowerShell and Python releases. You can test updates before publishing them to production.
**Module management** - enables you to test compatibility during module updates and avoid unexpected changes that might affect the execution of their production scenarios.
**Rollback capability** - allows you to easily revert to a previous version in case a runbook update introduces issues or unexpected behavior.
**Streamlined code** - allows you to organize your code easily by linking runbooks to different runtime environments without the need to create multiple Automation accounts.

## Known limitations

- Runtime environment is currently supported in all Public regions except Central India, Germany North, Italy North, Israel Central, Poland Central, UAE Central and Gov clouds.
- Currently cloud jobs are supported for runbooks linked to Runtime environment. Hybrid jobs aren't supported.
- Runtime environment is currently not supported for PowerShell Workflow, Graphical PowerShell and Graphical PowerShell Workflow runbooks.
- RBAC permissions can't be currently assigned to Runtime environment.
- Runtime environment can't be configured through Azure Automation extension for Visual Studio code


## System-generated Runtime environments

Azure Automation creates system-generated Runtime environments based on the Runtime language, version and packages/modules present in your Azure Automation account. There are six system-generated Runtime environments:
- PowerShell-5.1
- PowerShell-7.1
- PowerShell-7.2
- Python-2.7
- Python-3.8
- Python-3.10

You can't edit these runtime environments. However, any changes that are made in Modules/Packages blades for the Automation account are automatically reflected in these system-generated Runtime environments. 

> [!NOTE]
> Packages present in System-generated Runtime environments are unique to your Azure Automation account and might vary across different accounts. 

## Next steps

* To work with runbooks and runtime environment, see [Manage Runtime environment](manage-runtime-environment.md).
* For details of PowerShell, see [PowerShell Docs](/powershell/scripting/overview).

