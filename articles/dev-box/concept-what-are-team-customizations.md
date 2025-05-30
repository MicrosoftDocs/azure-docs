---
title: Streamline Your Workflow with Dev Box Customizations
description: Understand how to use Dev Box customizations to create ready-to-code configurations for your development teams and individual developers.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
ms.topic: concept-article
ms.date: 05/10/2025

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

| Feature                     | Team customizations       | User customizations |
|-----------------------------|---------------------------|---------------------------|
| Configure on            | Dev box pool             | Dev box                   |
| Customizations apply to | All dev boxes in pool    | Individual dev box        |
| Easily shareable        | Yes                      | No                        |
| Customizations file name| `imagedefinition.yaml`    | `myfilename.yaml`         |
| Sourced from            | Catalog or personal repository | Uploaded or from personal repository |
| Supports key vault secrets | Yes                  | Yes                       |

## What is a customization file?

Dev Box customizations use a YAML-formatted file to specify a list of tasks to apply from the dev center or a catalog when developers create a dev box. These tasks identify the catalog task and provide parameters like the name of the software to install. Developers can create their own customization files or use a shared customization file.

You can use secrets from your Azure key vault in your customization file to clone private repositories. You can also use them with any custom task that you author that requires an access token.

## What are tasks?

Dev Box customization tasks are wrappers for PowerShell scripts. You use them to define reusable components that your teams can use in their customizations. WinGet and PowerShell tasks are available through the platform. You can add new ones through a catalog. Tasks can run in either a system context or a user context after sign-in.

- Project admins define team customizations, which can use both custom and built-in tasks.
- User customizations can use system tasks only if the user is an administrator, or if the tasks are custom tasks preapproved through a catalog. Standard dev box users can't run built-in PowerShell and WinGet tasks in a system context, which prevents privilege escalation.

When you create tasks, determine which ones need to run in a system context and which ones can run in a user context after sign-in.

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

:::image type="content" source="media/concept-what-are-team-customizations/dev-box-customizations-workflow.svg" alt-text="Diagram that shows the workflow for Dev Box team customizations, including steps for planning, configuring, and deploying customizations." lightbox="media/concept-what-are-team-customizations/dev-box-customizations-workflow.svg":::

#### Configure Dev Box for team customizations

To set up Dev Box to support team customizations, follow these steps:

1. Configure your dev center:
   1. Enable project-level catalogs.
   1. Assign permissions for project admins.
1. Decide whether to use a catalog with custom reusable components:
   - Built-in (provided by the platform):
      1. Use PowerShell or WinGet built-in tasks (starts with ~/). We recommend that you start with the built-in tasks.
   - Your own catalog:
      1. Host in Azure Repos or GitHub.
      1. Add tasks.
      1. Attach to a dev center.
1. Create a YAML customization file called `imagedefinition.yaml`.
1. Specify an image in a dev box pool:
   1. Create or modify a dev box pool.
   1. Specify `imagedefinition.yaml` as the image definition.
1. Choose how to use the image definition:
   - Run the tasks in the image definition at the time of every dev box creation.
   - Optimize your image definition into a custom image.
1. Create your dev box from the configured pool by using the developer portal.

To learn more about team customization and writing image definitions, see [Write an image definition file for Dev Box team customizations](how-to-write-image-definition-file.md).
Then, to learn how to optimize your image definition into a custom image, see [Configure imaging for Dev Box team customizations](how-to-configure-customization-imaging.md).

# [User customizations](#tab/user-customizations)

### How do user customizations work?

Individual developers can attach a YAML-based customization file when they create their dev box to control the development environment. Developers use user customizations only for personal settings and apps.

:::image type="content" source="media/concept-what-are-team-customizations/dev-box-user-customizations-workflow.svg" alt-text="Diagram that shows the workflow for Dev Box user customizations, including steps for planning, configuring, and deploying customizations." lightbox="media/concept-what-are-team-customizations/dev-box-user-customizations-workflow.svg":::

#### Configure Dev Box for user customizations

To set up Dev Box to support user customizations, follow these steps:

1. Decide whether to use a catalog with custom reusable components:
    - Built-in (provided by the platform):
        1. Use PowerShell or WinGet built-in tasks (starts with ~/). We recommend that you start with the built-in tasks.
    - Your own catalog:
        1. Host in Azure Repos or GitHub.
        1. Add tasks.
        1. Attach to a dev center.
1. Create a customization file.
1. Create a dev box:
    1. Create your dev box from the configured pool by using the developer portal.
    1. Upload and validate your customization file as you create your dev box.

The dev box is created with customizations.

To learn more about user customizations, see [Write a user customization file for a dev box](how-to-write-user-customization-file.md).

---

## Related content

- [Quickstart: Create a dev box by using team customizations](quickstart-team-customizations.md)
- [Configure imaging for dev box team customizations](how-to-configure-customization-imaging.md)

