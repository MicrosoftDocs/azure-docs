---
title: Streamline Your Workflow with Dev Box customizations
description: Understand how to use Dev Box customizations to create ready-to-code configurations for your development teams and individual developers.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
ms.topic: concept-article
ms.date: 04/18/2025

#customer intent: As a Dev Center Admin or Project Admin, I want to understand how to use Dev Box customizations so that I can create efficient, ready-to-code configurations for my development teams.
---

# Microsoft Dev Box customizations

[!INCLUDE [note-build-2025](includes/note-build-2025.md)]


Starting developers on a new project or team is often complex and time consuming. The Microsoft Dev Box customizations feature helps you streamline the setup of the developer environment. With customizations, you can configure ready-to-code workstations with the necessary applications, tools, repositories, code libraries, packages, and build scripts.

Dev Box customizations let you:
- Install the necessary tools and applications.
- Enforce organizational security policies.
- Ensure consistency across dev boxes.

Microsoft Dev Box offers two ways to use customizations. Team customizations are used to create a shared configuration for a team of developers. Individual customizations are used to create a personal configuration for an individual developer. The following table summarizes the differences between the two types of customizations.

| Feature                     | Team customizations       | Individual customizations |
|-----------------------------|---------------------------|---------------------------|
| **Configure on**            | Dev box pool             | Dev box                   |
| **Customizations apply to** | All dev boxes in pool    | Individual dev box        |
| **Easily shareable**        | Yes                      | No                        |
| **Customizations file name**| imagedefinition.yaml     | myfilename.yaml           |
| **Sourced from**            | Catalog or personal repository | Uploaded or from personal repository |
| **Supports key vault secrets** | Yes                  | Yes                       |

## What is a customization file?

Dev Box customizations use a YAML-formatted file to specify a list of tasks to apply from the dev center or a catalog when developers are creating a dev box. These tasks identify the catalog task and provide parameters like the name of the software to install. Developers create their own customization files or use shared ones. 
You can use secrets from your Azure key vault in your customization file to clone private repositories, or with any custom task you author that requires an access token.

## What are tasks?

Dev Box customization tasks are wrappers for PowerShell scripts. You use them to define reusable components that your teams can use in their customizations. 
WinGet and PowerShell tasks are available through the platform, and new ones can be added through a catalog.
Tasks run in either a system context or a user context after sign-in.
Team customizations are defined by project admins and can use both custom and built-in tasks.
User customizations can only use system tasks if the user is an administrator, or if the tasks are custom tasks preapproved by through a catalog.
When you're creating tasks, determine which of them need to run in a system context and which of them can run in a user context (after sign-in). 
When creating tasks, determine which need to run in a system context and which run in a user context after sign-in.

## Differences between team customizations and individual customizations

Individual developers can upload a customization file when creating their dev box to control the development environment. Developers should use individual customizations only for personal settings and apps. Tasks specified in the individual customization file run only in the user context, after sign-in.
Developers use individual customizations only for personal settings and apps.
Sharing common YAML files among developer teams is inefficient, leads to errors, and violates compliance policies. Dev Box team customizations allow developer team leads and IT admins to preconfigure customization files, eliminating the need for developers to find and upload these files when creating a dev box.

## How do customizations work?
Team customization and individual customizations are both YAML-based files that specify a list of tasks to apply when creating a dev box. Select the appropriate tab to learn more about how each type of customization works.

# [Team customizations](#tab/team-customizations)
### How do team customizations work?

You can use team customizations to define a shared Dev Box configuration for each of your development teams without having to invest in setting up an imaging solution like Packer or Azure virtual machine (VM) image templates. Team customizations provide a lightweight alternative that allows central platform engineering teams to delegate Dev Box configuration management to the teams that use them.

Team customizations also offer an in-built way of optimizing your team's Dev Box customizations by flattening them into a custom image. You use the same customization file, without the need to manage added infrastructure or maintain image templates.

When you configure Dev Box team customizations for your organization, careful planning and informed decision-making are essential. The following diagram provides an overview of the process and highlights key decision points.


:::image type="content" source="media/concept-what-are-team-customizations/dev-box-customizations-workflow.svg" alt-text="Diagram that shows the workflow for Dev Box team customizations, including steps for planning, configuring, and deploying customizations." lightbox="media/concept-what-are-team-customizations/dev-box-customizations-workflow.svg":::

#### Configure your Dev Box service for team customizations

To set up your Dev Box service to support team customizations, follow these steps:

1. **Configure your dev center**:
    a. Enable project-level catalogs.
    b. Assign permissions for project admins.

1. **Decide whether to use a catalog with custom reusable components**:
    a. **Built-in**:
    b. Use PowerShell or WinGet statements.
    c. **Catalog**:
    d. Host in Azure Repos or GitHub.
    e. Add tasks.
    f. Attach to a dev center.

1. **Create a customization file**:
    a. Create a YAML file named `imagedefinition.yaml`.

1. **Specify an image in a dev box pool**:
    a. Create or modify a dev box pool and specify `imagedefinition.yaml` as the image definition.

1. **Choose how you'll use the image definition**:
    a. Build the image each time you create a dev box.
    b. Optimize the image for team customizations.

1. **Create a dev box**:
    a. Use the developer portal to create your dev box from the configured pool.

For more information, see [Write a team customization file](how-to-write-customization-file.md).

# [Individual customizations](#tab/individual-customizations)
### How do individual customizations work?
Individual developers can attach a YAML-based customization file when creating their dev box to control the development environment. Developers use individual customizations only for personal settings and apps.  

:::image type="content" source="media/concept-what-are-team-customizations/individual-customizations-workflow.png" alt-text="Diagram that shows the workflow for Dev Box individual customizations, including steps for planning, configuring, and deploying customizations." lightbox="media/concept-what-are-team-customizations/individual-customizations-workflow.png":::

#### Configure your Dev Box service for individual customizations

To set up your Dev Box service to support individual customizations, follow these steps:

1. **Use a PowerShell and WinGet tasks**:
    a. Platform supports PowerShell and WinGet.
    b. No catalog required.
    c. No further configuration required.

1. **Create a customization file**:
    a. Create a YAML-based customization file.

1. **Create a dev box**:
    a. Use the developer portal to create your dev box from the configured pool.
    b. Upload and validate your customization file during the dev box creation process.

1. **Dev box creation**:
    a. The dev box is created with the specified customizations.

For more information, see [Write an individual customization file](how-to-write-customization-file.md).

---

## Related content

- [Quickstart: Create a dev box by using team customizations](quickstart-team-customizations.md)
- [Write a customization file for a dev box](how-to-write-customization-file.md)
- [Configure imaging for Dev Box team customizations](how-to-configure-customization-imaging.md)

