---
title: Streamline Your Workflow with Dev Box Customizations
description: Understand how to use Dev Box customizations to create ready-to-code configurations for your development teams and individual developers.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
  - ai-usage: ai-assisted
ms.topic: concept-article
ms.date: 02/06/2026

#customer intent: As a Dev Center admin or project admin, I want to understand how to use Dev Box customizations so that I can create efficient, ready-to-code configurations for my development teams.
---

# Microsoft Dev Box customizations

Getting developers started on a new project or with a new team is often complex and time consuming. The Microsoft Dev Box customizations feature helps you streamline the setup of the developer environment. With customizations, you can configure ready-to-code workstations with the necessary applications, tools, repositories, code libraries, packages, and build scripts.

Dev Box customizations let you:

- Install the necessary tools and applications.
- Enforce organizational security policies.
- Ensure consistency across dev boxes.

Dev Box offers two ways to use customizations:

- **Team customizations**: Used to create a standard shared configuration for a team of developers in place of creating multiple standard or *golden* images for your teams.
- **User customizations**: Used by developers to create configurations for their personal preferences. With user customizations, developers can store their configurations in files and run them when they create dev boxes. Customizations provide consistency across all dev boxes.

### Choose the right customization type

| If you want to... | Use |
|-------------------|-----|
| Standardize tools for your entire team | Team customizations |
| Apply personal preferences to your dev box | User customizations |
| Enforce security policies across dev boxes | Team customizations |
| Install software that requires admin approval | Team customizations |
| Install personal tools (approved tasks only) | User customizations |

## What is a customization file?

Dev Box customizations use a YAML-formatted file to specify a list of tasks to apply from the dev center or a catalog when developers create a dev box. These tasks identify the catalog task and provide parameters like the name of the software to install. Developers can create their own customization files or use a shared customization file.

You can use secrets from your Azure key vault in your customization file to clone private repositories. You can also use them with any custom task that you author that requires an access token.

## What are tasks?

Dev Box customization tasks are wrappers for PowerShell scripts. You use them to define reusable components that your teams can use in their customizations. WinGet and PowerShell tasks are available through the platform. You can add new ones through a catalog. Tasks can run in either a system context or a user context after sign-in.

- Project admins define team customizations, which can use both custom and built-in tasks.
- User customizations can use system tasks only if the user is an administrator, or if the tasks are custom tasks preapproved through a catalog. Standard dev box users can't run built-in PowerShell and WinGet tasks in a system context, which prevents privilege escalation.

When you create tasks, determine which ones need to run in a system context and which ones can run in a user context after sign-in.

You can use both system and user tasks in your image definition file. The tasks section of the image definition file is divided into system tasks and user tasks sections, which share the same parameters based on the task definitions in your catalog.

- **System tasks**: These tasks run as `LocalSystem` during the provisioning stage of the dev box. They're typically used for system-level configurations, like installing software or configuring system settings that require administrative privileges.
- **User tasks**: These tasks run as the user after the user's first sign-in to the dev box. They're typically used for user-level configurations, like installing user-specific applications or configuring user settings under user context. For example, users often prefer to install Python and Visual Studio Code under user context instead of systemwide. Put WinGet tasks in the `userTasks` section for better results when they don't work under tasks.

Standard users who set up user customizations can use only user tasks. They can't use system tasks.

## Permissions for customizations

Different actions require different roles and permissions. The following table shows what you need for common customization scenarios.

| Action | Permission or role |
|--------|-------------------|
| Enable project-level catalogs for a dev center | Platform engineer with write access on the subscription |
| Enable catalog sync settings for a project | Platform engineer with write access on the subscription |
| Attach a catalog to a project | Project Admin or Contributor permissions on the project |
| Create a customization file | None specified (anyone can create a file) |
| Upload and apply a YAML file during dev box creation | Dev Box User |
| Add tasks to a catalog | Permission to add to the repository that hosts the catalog |
| Create, delete, or update a dev box pool | Owner or Contributor permissions on an Azure subscription, DevCenter Owner, or DevCenter Project Admin |


## Differences between team customizations and user customizations

Dev Box team customizations allow developer team leads and IT admins to preconfigure customization files for dev box pools. Customizations eliminate the need for developers to go through manual setup.

We recommend that you use team customizations to secure and standardize Dev Box deployments for a team. Sharing common YAML files among developer teams can be inefficient, lead to errors, and violate compliance policies.

In addition to team customizations, individual developers can upload a customization file when they create their dev box to control the development environment. Developers should use individual customizations for personal settings and apps only.

## How do customizations work?

Team customizations and user customizations are both YAML-based files that specify a list of tasks to apply when you create a dev box. Select the appropriate tab to learn more about how each type of customization works.

# [Team customizations](#tab/team-customizations)

### How do team customizations work?

You can use team customizations to define a shared Dev Box configuration for each of your development teams without having to invest in setting up an imaging solution like Packer or Azure virtual machine (VM) image templates. Team customizations provide a lightweight alternative that allows central platform engineering teams to delegate Dev Box configuration management to the teams that use them.

Team customizations also offer a built-in way to optimize your team's Dev Box customizations by flattening them into a custom image. You use the same customization file, without the need to manage added infrastructure or maintain image templates.

Configuring Dev Box team customizations for your organization requires careful planning and informed decision-making. The following diagram provides an overview of the process and highlights key decision points.

:::image type="content" source="media/concept-what-are-dev-box-customizations/dev-box-customizations-workflow.svg" alt-text="Diagram that shows the workflow for Dev Box team customizations, including steps for planning, configuring, and deploying customizations." lightbox="media/concept-what-are-dev-box-customizations/dev-box-customizations-workflow.svg":::

Team customizations involve these high-level steps:

1. Configure your dev center and enable project-level catalogs.
1. Decide whether to use built-in tasks (WinGet, PowerShell, Git-Clone) or create custom tasks in a catalog.
1. Create an image definition file (`imagedefinition.yaml`) that specifies the tasks to run.
1. Attach the catalog to your project and configure a dev box pool to use the image definition.
1. Optionally, build a reusable image to optimize dev box creation time.

To learn more, see [Configure team customizations](how-to-configure-team-customizations.md) and [Configure dev center imaging](how-to-configure-dev-center-imaging.md).

# [User customizations](#tab/user-customizations)

### How do user customizations work?

Individual developers can attach a YAML-based customization file when they create their dev box to control the development environment. Developers use user customizations only for personal settings and apps.

:::image type="content" source="media/concept-what-are-dev-box-customizations/dev-box-user-customizations-workflow.svg" alt-text="Diagram that shows the workflow for Dev Box user customizations, including steps for planning, configuring, and deploying customizations." lightbox="media/concept-what-are-dev-box-customizations/dev-box-user-customizations-workflow.svg":::

User customizations involve these high-level steps:

1. Create a customization file that uses approved tasks from your organization's catalog or built-in tasks.
1. When creating a dev box, upload your customization file through the developer portal.
1. Validate the customization file and create your dev box.

To learn more, see [Configure user customizations for dev boxes](how-to-configure-user-customizations.md).

---

## Related content

- [Configure team customizations](how-to-configure-team-customizations.md)
- [Configure dev center imaging](how-to-configure-dev-center-imaging.md)

