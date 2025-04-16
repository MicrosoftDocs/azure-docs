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

Efficient resource management is critical for development teams working on diverse projects. Microsoft Dev Box uses **project policies** to help platform engineers enforce governance while maintaining flexibility. With project policies, you can define guardrails for resource usage on a per-project basis across your organization. This article explains how to set up and manage project policies in Dev Box to optimize resource control and governance.

When policies are enforced, Dev Box evaluates the health of existing resource pools against the new policy settings:

- **Pool health check**: Dev Box evaluates each resource pool to check compliance with the enforced policies.
- **Unhealthy pools**: If a pool doesn't meet the enforced requirements, it's marked as unhealthy, blocking the creation of new Dev Boxes in that pool.
- **Existing Dev Boxes remain active**: Dev Boxes already created in an unhealthy pool continue to function normally, so your teams can keep working without disruption.

This enforcement mechanism ensures projects access only the resources they're approved for, maintaining a secure-by-default environment with efficient operations across all projects in the Dev Center.

## Prerequisites
- Microsoft Dev Box configured with a dev center and projects.

## Create a default policy
The first policy you create is the default policy, which applies to all projects in the dev center. This is a good way to set up a baseline for your projects, ensuring that all projects have a minimum level of governance and control over the resources they can access. In a default policy, you select resources to restrict, such as networks, images, and SKUs.

Projects apply the default policy unless they have a custom project policy. This means that projects with a custom policy can access resources that aren't available to projects without a custom policy. In other words, projects with a custom policy can access resources that aren't available to all projects in the dev center.

To create a default policy:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your dev center.
1. In the left pane, expand **Manage**, and then select **Project policy**.
1. On the **Project policy** page, select **Create a policy**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-page.png" alt-text="Screenshot of the Project policy page in the Azure portal, showing options to create a new project policy.":::

1. The name of the policy is **default**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-default-name.png" alt-text="Screenshot showing the default project policy name field in the Azure portal.":::

1. Under **Allow resources**, select the resources you want to allow for the project. You must select at least one resource for each category: images, networks, and SKUs. To restrict SKU usage, select **Select SKUs**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-select-skus.png" alt-text="Screenshot showing the Select SKUs pane in the Azure portal, with options to restrict SKU usage for a project.":::

1. In the **Select SKUs** pane, select **A specific SKU or group of SKUs**, and then select the SKUs you want to allow. In this example, you can select all the **16 vCPU** SKUs. To confirm your selection, select **Select**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-select-multiple-skus.png" alt-text="Screenshot showing the Select SKUs pane in the Azure portal, with multiple SKUs selected for a project policy.":::

1. Select **Select images**.
1. In the **Select images** pane, to allow all current and future images for projects, select **All current and future images**, and then select **Select**.
1. Select **Select networks**.
1. In the **Select networks** pane, to allow all current and future networks for projects, select **All current and future networks**, and then select **Select**. 

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-create.png" alt-text="Screenshot showing the Create button in the Azure portal to finalize a project policy.":::

1. When you finish selecting the resources, select **Create**.
1. To confirm that the default policy applies the resources, expand **default**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-summary.png" alt-text="Screenshot showing the summary of a default project policy in the Azure portal.":::

## Create a Project policy
Custom project policies enable you to control resources for specific projects. These policies allow you to control and restrict resources available to projects, ensuring better governance and resource management. Each project can have only one custom policy, but the same policy can be applied to multiple projects. These policies allow you to control and restrict resources available to projects, ensuring better governance and resource management.

To create and apply a custom project policy:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your dev center.
1. In the left pane, expand **Manage**, and then select **Project policy**.
1. On the **Project policy** page, select **Create**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-create-custom.png" alt-text="Screenshot showing the Create button for a custom project policy in the Azure portal.":::

1. On the **Create project policy** page, enter a name for the project policy. 

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-custom-name.png" alt-text="Screenshot showing the name field for a custom project policy in the Azure portal.":::

1. Under **Target projects**, select **Select projects**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-custom-select-projects.png" alt-text="Screenshot showing the Select projects option for a custom project policy in the Azure portal.":::

1. In the **Select projects** pane, select the projects you want to apply the policy to, and then select **Select**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-target-projects.png" alt-text="Screenshot showing the selected target projects for a custom project policy in the Azure portal.":::

1. Under **Allow resources**, select the resources you want to restrict for the project.
   For example, to restrict a project to only use Visual Studio 2022 images, select **Select images**, and then select all Visual Studio 2022 images. To confirm your selection, select **Select**. 

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-custom-select-images.png" alt-text="Screenshot showing the Select images pane for a custom project policy in the Azure portal.":::

1. You can select more resources. When you finish selecting resources, select **Create**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-custom-summary-create.png" alt-text="Screenshot showing the summary of a custom project policy before creation in the Azure portal.":::


## View policies for a project

To confirm that the project policy is applied to the project:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your dev center.
1. In the left pane, expand **Manage**, and then select **Project policy**.
1. On the **Project policy** page, expand the project policy you created.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-custom-summary.png" alt-text="Screenshot showing the summary of an applied custom project policy in the Azure portal.":::

The default policy and the project policy restrictions are combined. For example, if the default policy restricts the project to only use 16 vCPU SKUs, and the project policy restricts the project to only use Visual Studio 2022, the project can use both 16 vCPU SKUs and Visual Studio 2022 images.


## Edit a project policy

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your dev center.
1. In the left pane, expand **Manage**, and then select **Project policy**.
1. For the project policy you want to edit, scroll to the right and select **Edit**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-edit.png" alt-text="Screenshot showing the Edit button for a project policy in the Azure portal.":::

1. When you finish making changes, select **Apply**.

## Related content

- [Autostop your Dev Boxes on schedule](how-to-configure-stop-schedule.md)
- [Control costs by setting dev box limits on a project](tutorial-dev-box-limits.md)