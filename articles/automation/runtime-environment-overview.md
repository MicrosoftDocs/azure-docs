---
title: Runtime environment (preview) in Azure Automation
description: This article provides an overview on Runtime environment in Azure Automation.
services: automation
ms.subservice: process-automation
ms.date: 04/01/2024
ms.topic: conceptual
ms.custom: references_regions, devx-track-azurecli
---

# Runtime environment (preview) in Azure Automation

This article provides an overview on Runtime environment, scope and its capabilities.

## About Runtime environment

**Runtime environment** enables you to configure the job execution environment and provides the flexibility to choose the runtime language and runtime version according to your requirements. It's the single source of truth to define and manage the environment in which a job is executed. Every runbook has two components:

- Script code
- Runtime environment - defines the Runtime language, Runtime version and Packages required during job execution.

You can change these components independently without impacting the other.

> [!NOTE]
> You can associate each runbook with a single Runtime environment. However, a Runtime environment could be linked to multiple runbooks.


## Components of Runtime environment

Runtime environment captures the following details about the job execution environment:

-  **Language** - the scripting language targeted for runbook execution. For example, PowerShell and Python.
- **Runtime version** - the version of the language selected for runbook execution. For example - PowerShell 7.2 and Python 3.8.
- **Packages** - the packages are the assemblies and the *.dll* files that you import and required by runbooks for execution. There are two types of packages supported for Runtime environment.
    
   |**Package Types** | **Description** |
   |---------|---------|
   |**Default packages**  | The packages enable you to manage Azure resources. For example, Az PowerShell 8.0.0, Azure CLI 2.56.0|
   |**Customer-provided packages** | These are custom packages that are required by runbooks during execution. The packages can be from: </br> - Public gallery: PSGallery, pypi </br> - Self-authored. |

> [!NOTE]
> Azure CLI commands are supported (public preview) in runbooks associated with PowerShell 7.2 Runtime environment. Azure CLI commands version 2.56.0 is available as a default package in PowerShell 7.2 Runtime environment.

## Azure CLI package in Runtime environment 

Azure CLI commands are supported (public preview) in runbooks associated with PowerShell 7.2 Runtime environment. **Azure CLI version 2.56.0** is available as a default package in PowerShell 7.2 Runtime environment. Azure Automation closely follows the release cadence of newer versions of Azure CLI and supports them in runbooks. 

Runbooks linked to PowerShell 7.2 Runtime environment would always execute with the latest Azure CLI version supported by Azure Automation. Likewise, versions declared end-of-support by parent product Azure CLI would no longer be supported by Azure Automation as these could potentially suffer from bugs or security vulnerabilities. Ensure your runbooks are designed to execute seamlessly in newer versions of Azure CLI.

## System-generated Runtime environments

Azure Automation creates system-generated Runtime environments based on the Runtime language, version, and packages/modules present in your Azure Automation account. There are six system-generated Runtime environments:

- PowerShell-5.1
- PowerShell-7.1
- PowerShell-7.2
- Python-2.7
- Python-3.8
- Python-3.10

You can't edit these Runtime environments. However, any changes that are made in Modules/Packages for the Automation account are automatically reflected in these system-generated Runtime environments. 

:::image type="content" source="./media/runtime-environment-overview/system-generated.png" alt-text="Screenshot shows the system generated Runtime environment." lightbox="./media/runtime-environment-overview/system-generated.png":::

> [!NOTE]
> Packages present in System-generated Runtime environments are unique to your Azure Automation account and might vary across different accounts. 

## Key benefits

- **Granular control** - enables you to configure the script execution environment by choosing the Runtime language, its version, and dependent modules.
- **Runbook update** - allows easy portability of runbooks across different runtime versions by updating runtime environment of runbooks to keep pace with the latest PowerShell and Python releases. You can test updates before publishing them to production.
- **Module management** - enables you to test compatibility during module updates and avoid unexpected changes that might affect the execution of their production scenarios.
- **Rollback capability** - allows you to easily revert runbook to a previous Runtime environment. In case a runbook update introduces issues or unexpected behavior.
- **Streamlined code** - allows you to organize your code easily by linking runbooks to different Runtime environments without the need to create multiple Automation accounts.

## Limitations

- Runtime environment is currently supported in all Public regions except Central India, Germany North, Italy North, Israel Central, Poland Central, UAE Central, and Government clouds.
- Existing runbooks that are automatically moved from old experience to Runtime environment experience would be able to execute as both cloud and hybrid job. 
- PowerShell Workflow, Graphical PowerShell, and Graphical PowerShell Workflow runbooks only work with System-generated PowerShell-5.1 Runtime environment.
- Runbooks created in Runtime environment experience with Runtime version PowerShell 7.2 would show as PowerShell 5.1 runbooks in old experience.
- RBAC permissions cannot be assigned to Runtime environment.
- Runtime environment can't be configured through Azure Automation extension for Visual Studio Code.
- Deleted Runtime environments cannot be recovered.  
- The feature is only supported through Azure portal and [REST API](/rest/api/automation/runtime-environments?view=rest-automation-2023-05-15-preview&preserve-view=true).

## Switch between new and old experience

While the new Runtime environment experience is recommended, you can also switch to the default experience anytime. Learn more on [how to toggle between the two experiences](manage-runtime-environment.md#switch-between-runtime-environment-and-old-experience).

> [!NOTE]
> Runbook updates persist between new Runtime environment experience and old experience. Any changes done in Runtime environment linked to a runbook would persist during runbook execution in old experience.

## Next steps

* To work with runbooks and Runtime environment, see [Manage Runtime environment](manage-runtime-environment.md).
* For details of PowerShell, see [PowerShell Docs](/powershell/scripting/overview).
