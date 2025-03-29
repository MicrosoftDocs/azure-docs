---
title: Use project policies to control resource use in Dev Box
description: Simplify resource management in Microsoft Dev Box with project policies. Set guardrails for projects and ensure secure, efficient workflows.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to
ms.date: 03/28/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:03/28/2025
#customer intent: As a platform engineer, I want to set up project policies in Microsoft Dev Box to control resource use for my development teams. 
---

# Control resource use with project policies in Microsoft Dev Box

Efficient resource management is critical for development teams working on diverse projects. Microsoft Dev Box uses **project policies**, a feature now available in preview, to help platform engineers enforce governance while maintaining flexibility. With project policies, you can define guardrails for resource usage on a per-project basis across your organization. This article explains how to set up and manage project policies in Dev Box to optimize resource control and governance.

When policies are enforced, Dev Box evaluates the health of existing resource pools against the new policy settings:

- **Pool health check**: Dev Box evaluates each resource pool to check compliance with the enforced policies.
- **Unhealthy pools**: If a pool doesn't meet the enforced requirements, it's marked as unhealthy, blocking the creation of new Dev Boxes in that pool.
- **Existing Dev Boxes remain active**: Dev Boxes already created in an unhealthy pool continue to function normally, so your teams can keep working without disruption.

This enforcement mechanism ensures projects access only the resources they're approved for, maintaining a secure-by-default environment with efficient operations across all projects in the Dev Center.

## Prerequisites
- Microsoft Dev Box configured with a dev center and projects.

## Enforce project policy for a dev center

By enforcing project policies for a resource type, you control which resources are available to all projects in the dev center. When you enforce project policies for a resource type, all resources of that type are disallowed unless explicitly allowed in the default or project policy.

To enforce project policies:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your dev center.
1. In the left pane, expand **Settings**, and then select **Project policy (preview)**.
1. Under **Enforce project policy**, select the resources you want to restrict for all projects in the dev center.
   For example, to restrict the SKUs available to projects in the dev center, select **SKUs**.
1. To confirm your selection and enforce it, select **Apply**.

## Create a default policy
You should first create a default policy, which applies to all projects in the dev center. This is a good way to set up a baseline for your projects, ensuring that all projects have a minimum level of governance and control over the resources they can access. In a default policy, you select resources to restrict, such as networks, images, and SKUs.

When project policies are enforced, projects apply the default policy unless they have a custom project policy. This means that projects with a custom policy can access resources that aren't available to projects without a custom policy. In other words, projects with a custom policy can access resources that aren't available to all projects in the dev center.

To create a default policy:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your dev center.
1. In the left pane, expand **Settings**, and then select **Project policy (preview)**.
1. Under **Project policies**, select **Create project policy**.
1. On the **Create project policy** page, for **Targeted projects**, select **All current and future projects**.
1. The name of the policy is **default**.
1. Under **Allow access to the following**, select the resources you want to restrict for the project.
   For example, to restrict SKU usage, select **SKUs**.
1. In the **Select SKUs** pane, select **A specific SKU or group of SKUs**. 
   For example, to restrict the project to only use 16 vCPU SKUs, select **SKUs**, and then select all 16 vCPU SKUs. 
1. To confirm your selection, select **Select**.
1. You can select one or more resources: images, networks, and SKUs. When you finish selecting the resources, select **Create**.
1. To confirm that the default policy is applied to all projects, under **Project policies** > **default**, select **Show selected**.

## Create a Project policy
Custom project policies enable you to control resources for specific projects. These policies allow you to control and restrict resources available to projects, ensuring better governance and resource management. Each project can have only one custom policy, but the same policy can be applied to multiple projects. These policies allow you to control and restrict resources available to projects, ensuring better governance and resource management.

To create and apply a custom project policy:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your dev center.
1. In the left pane, expand **Settings**, and then select **Project policy (preview)**.
1. Under **Project policies**, select **Create project policy**.
1. On the **Create project policy** page, for **Targeted projects**, select **Select projects**.
1. In the **Select projects** pane, select the projects you want to apply the policy to, and then select **Select**.
   For example, select **AI-dev**, and then select **Select**.
1. In the **Name** field, enter a name for the project policy.
   For example, enter **AI-dev policy**.
1. Under **Allow access to the following**, select the resources you want to restrict for the project.
   For example, to restrict the AI-dev project to only use 32 vCPU SKUs, select **SKUs**, and then select all 32 vCPU SKUs.
1. To confirm your selection, select **Select**. 
1. You can select one or more resources. When you finish selecting the resources, select **Create**.

## View policies for a project

1. To confirm that the project policy is applied to the project, under **Project policies**, select the name of the project policy you created.
1. Under **Project policy**, select **Show selected**.
1. The project policy shows the projects wo ahich it is appliedm and the resources that are restricted for the project.
 
1. To view the project policy for a specific project, select **Group by** > **Group by project**.
1. Select the project you want to view the policy for, and then select **Show selected**.
1. The project policy shows the resources that are restricted for the project. Note that the default policy and the project policy restrictions are combined. For example, if the default policy restricts the project to only use 16 vCPU SKUs, and the project policy restricts the project to only use 32 vCPU SKUs, the project can use both 16 vCPU SKUs and 32 vCPU SKUs.


## Edit a project policy

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your dev center.
1. In the left pane, expand **Settings**, and then select **Project policy (preview)**.
1. To view a specific project policy, select **Group by** > **Group by policy**.
1.  Under **Project policies**, on the project policy you want to edit, scroll to the right and select **...** > **Edit**.
1. When you finish making changes, select **Apply**.

## Disable project policies

You can disable project policies to allow all projects in the dev center to access all resources. This is useful when you want to temporarily lift restrictions on resource usage for all projects in the dev center.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your dev center.
1. In the left pane, expand **Settings**, and then select **Project policy (preview)**.
1. Under **Enforce project policy**, clear the check boxes for the resources you want to allow all projects in the dev center to access.

## Related content

- [Autostop your Dev Boxes on schedule](how-to-configure-stop-schedule.md)
- [Control costs by setting dev box limits on a project](tutorial-dev-box-limits.md)