---
title: Streamline Your Workflow with Dev Box Team Customizations
description: Understand how to use Dev Box team customizations to create ready-to-code configurations for your development teams.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
ms.topic: concept-article
ms.date: 01/29/2025

#customer intent: As a Dev Center Admin or Project Admin, I want to understand how to use Dev Box team customizations so that I can create efficient, ready-to-code configurations for my development teams.
---

# Microsoft Dev Box team customizations

Getting developers started on a new project or team can be complex and time-consuming. The Microsoft Dev Box *team customizations* feature helps you streamline setup of the developer environment. With team customizations, you can configure ready-to-code workstations with necessary applications, tools, repositories, code libraries, packages, and build scripts.

You can use team customizations to define a shared Dev Box configuration for each of your development teams without having to invest in setting up an imaging solution like Packer or Azure virtual machine (VM) image templates. Team customizations provide a lightweight alternative that allows central platform engineering teams to delegate Dev Box configuration management to the teams that use them.

Team customizations also offer an in-built way of optimizing your team's Dev Box customizations by flattening them into a custom image. You use the same customization file, without the need to manage added infrastructure or maintain image templates.

[!INCLUDE [customizations-preview-text](includes/customizations-preview-text.md)]

## How do Dev Box team customizations work?

When you configure Dev Box team customizations for your organization, careful planning and informed decision-making are essential. The following diagram provides an overview of the process and highlights key decision points.

:::image type="content" source="media/concept-what-are-team-customizations/dev-box-customizations-workflow.svg" alt-text="Diagram that shows the workflow for Dev Box team customizations, including steps for planning, configuring, and deploying customizations." lightbox="media/concept-what-are-team-customizations/dev-box-customizations-workflow.svg":::

- **Configure your dev center**:
  - Enable project-level catalogs.
  - Assign permissions for project admins.
- **Decide whether to use a catalog with custom reusable components**:
  - Dev center:
    - Use PowerShell or WinGet statements.
  - Your own catalog:
    - Host in Azure Repos or GitHub.
    - Add tasks.
    - Attach to a dev center or project.
- **Create a customization file:**
  - Create a customization file called imagedefinition.yaml.
- **Specify an image in a dev box pool:**
  - Create or modify a dev box pool and specify imagedefinition.yaml as the image definition.
- **Choose how you'll use the image definition:**
  - Optimize for team customization.
  - Build each time you create a dev box.
- **Create dev box:**
  - Create your dev box from the configured pool by using the developer portal.

## What is a customization file?

Dev Box customizations use a YAML-formatted file to specify a list of tasks to apply from the catalog when developers are creating a dev box. These tasks identify the catalog task and provide parameters like the name of the software to install. You then make the customization file available to the developers.

You can use secrets from your Azure key vault in your customization file to clone private repositories, or with any custom task you author that requires an access token.

## What are tasks?

Dev Box customization tasks are wrappers for PowerShell scripts. You use them to define reusable components that your teams can use in their customizations. WinGet and PowerShell are available as primitive tasks.

When you're creating tasks, determine which of them need to run in a system context and which of them can run in a user context (after sign-in). Team customizations can run in both contexts. Individual customizations can run only in a user context.

## Differences between team customizations and individual customizations

Individual developers can attach a YAML-based customization file when creating their dev box to control the development environment. Developers should use individual customizations only for personal settings and apps. Tasks specified in the individual customization file run only in the user context, after sign-in.

Although teams of developers can share common YAML files, this approach can be inefficient and error prone. It can also be against compliance policies. Dev Box team customizations provide a workflow for developer team leaders, project admins, and dev center administrators to preconfigure customization files in dev box pools. This way, a developer who's creating a dev box doesn't need to find and upload a customization file.

## Key terms

When you're working with Dev Box team customizations, you should be familiar with the following key terms:

- **Catalog**:
  - Stored in your code repository or in a separate repository of customization files.
  - Hosted on GitHub or Azure Repos.
  - Attached to a dev center or project to make tasks accessible to the developer team.
- **Task**:
  - Performs specific actions, like installing software.
  - Consists of one or more PowerShell scripts and a task.yaml file.
- **Customization file**:
  - Defines tasks for dev boxes and is YAML based.
  - Provides an image definition when shared across a team by specifying the base image and customization options for a dev box.
 
You can find instructions for creating a customization file in the [Write a customization file for a dev box](how-to-write-customization-file.md) article, along with links to example customization files.

## Related content

- [Quickstart: Create a dev box by using team customizations](quickstart-team-customizations.md)
- [Write a customization file for a dev box](how-to-write-customization-file.md)
- [Configure imaging for Dev Box team customizations](how-to-configure-customization-imaging.md)
- [Create tasks for Dev Box team customizations](how-to-create-customization-tasks-catalog.md)