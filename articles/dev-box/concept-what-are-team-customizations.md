---
title: Streamline Your Workflow with Dev Box Team Customizations
description: Understand how to use Dev Box Team Customizations to create ready-to-code configurations for your development teams.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: concept-article
ms.date: 10/2/2024

#customer intent: As a Project Admin or Dev Center Admin, I want to understand how to use Dev Box Team Customizations so that I can create efficient, ready-to-code configurations for my development teams.
---

# Microsoft Dev Box Team Customizations
Getting developers started on a new project or team can be complex and time-consuming. Microsoft Dev Box Team Customizations enables you to streamline developer environment setup. With Team Customizations, you can configure ready-to-code workstations with necessary applications, tools, repositories, code libraries, packages, and build scripts.
Team Customizations allows you to define a shared Dev Box configuration for each of your development teams without having to invest in setting up an imaging solution like Packer or Azure virtual machine (VM) Image Templates. It provides a lightweight alternative that allows central platform engineering teams to delegate Dev Box configuration management to the teams that use them. Team Customizations also offers an in-built way of optimizing your team's Dev Box customizations by flattening them into a custom image using the same customization file, without the need to manage added infrastructure or maintain image templates.

## How does Dev Box Team Customizations work?
When you configure Dev Box Team Customizations for your organization, careful planning and informed decision-making are essential. The following diagram provides an overview of the process and highlights key decision points.

:::image type="content" source="media/concept-what-are-team-customizations/dev-box-customizations-workflow.svg" alt-text="Diagram showing the workflow for Dev Box Team Customizations, including steps for planning, configuring, and deploying customizations." lightbox="media/concept-what-are-team-customizations/dev-box-customizations-workflow.svg":::
 
- **Configure your dev center:**
  - Enable project-level catalogs.
  - Assign permissions for Project Admins.
- **Decide whether to use a catalog:**
  - Dev center (quick start catalog)
    - Simple PowerShell or WinGet statements.
  - Your own catalog
    - Host in Azure Repos or GitHub.
    - Add tasks.
    - Attach to dev center or project.
- **Create a team customizations file:**
  - Create a team customizations file called definition.yaml.
- **Specify image in a dev box pool:**
  - Create or modify a dev box pool and specify definition.yaml as the image definition.
- **Choose how you'll use the image definition:**
    - Optimize for team customization.
    - Build each time you create a dev box.
- **Create dev box:**
  - Create your dev box from the configured pool using the developer portal.

## What is a customization file?
Dev Box customizations use a yaml formatted file to specify a list of tasks to apply from the catalog when creating a new dev box. These tasks identify the catalog task and provide parameters like the name of the software to install. The customization file is then made available to the developers creating new dev boxes. 

You can use secrets from your Azure Key Vault in your customization file to clone private repositories, or with any custom task you author that requires an access token.

## What are tasks?
A task performs a specific action, like installing software. You can store a collection of curated tasks in a catalog attached to your dev center, with each task in a separate folder. Each task consists of one or more PowerShell scripts, along with a task.yaml file that provides parameters and defines how the scripts run. 

## Differences Between Team and Individual Customizations
Individual developers can attach a yaml-based customization file when creating their Dev Box to control the development environment on their Dev Box. While teams of developers can share common yaml files, this approach can be inefficient and error-prone, and against compliance policies. Dev Box Team Customizations provides a workflow for developer team leaders, Project Admins, and dev center administrators to preconfigure customization files on Dev Box pools. This way, a developer creating a dev box doesn't need to find and upload a customization file for themselves.

## Key terms
**Catalog**
- Repository for storing tasks
- Hosted on GitHub or Azure Repos
- Attached to dev center or project to make tasks accessible to the developer team
**Tasks**
- Perform specific actions, like installing software
- Consist of one or more PowerShell scripts and a task.yaml file
**Customization file**
- Yaml-based file defining tasks for dev boxes
**Image definition**
- Dev box definition or definition.yaml
- Specifies OS, compute, storage

## Related content
- Quickstart
- Write a customization file
- Configure customization imaging
- Configure customization tasks