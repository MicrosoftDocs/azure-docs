---
title: Use Project Policies to Control Resource Use in Dev Box
description: Simplify resource management in Microsoft Dev Box with project policies. Set guardrails for projects and ensure secure, efficient workflows.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to
ms.date: 05/07/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:03/28/2025
#customer intent: As a platform engineer, I want to set up project policies in Microsoft Dev Box to control resource use for my development teams.
---

# Control resource use with project policies in Microsoft Dev Box

Efficient resource management is critical for development teams working on diverse projects. Microsoft Dev Box uses *project policies* to help platform engineers enforce governance while maintaining flexibility. With project policies, you can define guardrails for resource usage on a per-project basis across your organization. This article explains how to set up and manage project policies in Dev Box to optimize resource control and governance.

When policies are enforced, Dev Box evaluates the health of existing resource pools against the new policy settings:

- **Pool health check**: Dev Box evaluates each resource pool to check compliance with the enforced policies.
- **Unhealthy pools**: A pool that doesn't meet the enforced requirements is marked as unhealthy, blocking the creation of new dev boxes in that pool.
- **Existing dev boxes remain active**: dev boxes already created in an unhealthy pool continue to function normally, so your teams can keep working without disruption.

This enforcement mechanism ensures projects access only the resources they're approved for, maintaining a secure-by-default environment with efficient operations across all projects in a dev center.

## Prerequisites

- Microsoft Dev Box configured with a dev center and projects.

## Create a default project policy

The first policy you create is the default project policy, which applies to all projects in the dev center. A default policy is an effective way to set up a baseline for your projects, ensuring that all projects have a minimum level of governance and control over the resources they can access. In a default project policy, you select resources to allow, like networks, images, and SKUs.

Projects apply the default policy unless they have a custom project policy. If a project has custom policy applied, then only the resources defined in custom policy are available to the project. If there's no custom policy assigned to the project, then the resources defined in the Default policy are available to the project. A project can only have one policy applied to it.

To create a default project policy:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your dev center.

1. In the left pane, expand **Manage**, and then select **Project policy**.

1. On the **Project policy** page, select **Create a policy**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-page.png" alt-text="Screenshot of the Project policy page in the Azure portal, showing options to create a new project policy.":::

1. The name of the policy is **Default**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-default-name.png" alt-text="Screenshot showing the default project policy name field in the Azure portal.":::

1. Under **Allow resources**, select the resources you want to allow for the project. You must select at least one resource for each category: images, networks, and SKUs.

1. Select **Select images**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-select-images.png" alt-text="Screenshot showing the Create project policy page, with Select images highlighted.":::

1. In the **Select images** pane, to allow all current and future images for projects, select **All current and future images**, and then select **Select**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-select-current-future-images.png" alt-text="Screenshot showing the Select images pane in the Azure portal, with All current and future images selected.":::

1. Select **Select networks**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-select-networks.png" alt-text="Screenshot showing the Create project policy page, with Select networks highlighted.":::

1. In the **Select networks** pane, to allow all current and future networks for projects, select **All current and future networks**, and then select **Select**.

1. To allow specific SKU usage, select **Select SKUs**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-select-skus.png" alt-text="Screenshot showing the Create project policy page, with Select SKUs highlighted.":::

1. In the **Select SKUs** pane, select **A specific SKU or group of SKUs**, and then select the SKUs you want to allow. In this example, you can select all the **16 vCPU** SKUs. To confirm your selection, select **Select**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-select-multiple-skus.png" alt-text="Screenshot showing the Select SKUs pane in the Azure portal, with multiple SKUs selected.":::

1. When you finish selecting the resources, select **Create**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-create.png" alt-text="Screenshot showing the Create button in the Azure portal to finalize a project policy.":::

1. To confirm that the default project policy applies the resources, expand **Default**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-summary.png" alt-text="Screenshot showing the summary of a default project policy in the Azure portal.":::

## Create a custom project policy

Custom project policies enable you to control resources for specific projects. These policies allow you to control which resources are available to projects, ensuring better governance and resource management. Each project can have only one custom policy, but the same policy can be applied to multiple projects.

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

1. Under **Allow resources**, select the resources you want to allow for the project. For example, to allow a project to only use Visual Studio 2022 images, select **Select images**, and then select all Visual Studio 2022 images. To confirm your selection, select **Select**.

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

Once you create a custom project policy and apply it to the target project, the default project policy no longer applies to that project. The custom project policy must define all the resources you want to allow in the project.

## Edit a project policy

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your dev center.

1. In the left pane, expand **Manage**, and then select **Project policy**.

1. For the project policy you want to edit, scroll to the right and select **Edit**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-edit.png" alt-text="Screenshot showing the Edit button for a project policy in the Azure portal.":::

1. When you finish making changes, select **Apply**.

## Delete a project policy

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your dev center.

1. In the left pane, expand **Manage**, and then select **Project policy**.

1. Select the project policy you want to delete, and then select **Delete**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-delete.png" alt-text="Screenshot showing the Delete button for a project policy in the Azure portal.":::

1. In the **Delete project policy** read the message: *"Deleting a custom policy will cause a pool to become unhealthy if the pool resources are allowed by the custom policy, but not allowed by the default policy."* , and then select **OK**.

## Related content

- [Key concepts for Microsoft Dev Box](concept-dev-box-concepts.md)