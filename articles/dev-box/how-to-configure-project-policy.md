---
title: Enforce Governance with Project Policies in Microsoft Dev Box
description: Control resource use in Microsoft Dev Box with project policies that ensure compliance and streamline development workflows.
#customer intent: As a platform engineer, I want to set up project policies in Microsoft Dev Box to control resource use for my development teams.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to
ms.date: 05/08/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:03/28/2025
  - ai-gen-title
---

# Control resource use with project policies in Microsoft Dev Box

Efficient resource management is critical for development teams working on diverse projects. Microsoft Dev Box uses *project policies* to help platform engineers enforce governance while maintaining flexibility. With project policies, define guardrails for resource usage on a per-project basis across your organization. This article explains how to set up and manage project policies in Dev Box to optimize resource control and governance.

When policies are enforced, Dev Box checks the health of existing resource pools against the new policy settings:

- **Pool health check**: Dev Box checks each resource pool for compliance with the enforced policies.
- **Unhealthy pools**: A pool that doesn't meet the enforced requirements is marked unhealthy, which blocks the creation of new dev boxes in that pool.
- **Existing dev boxes remain active**: Dev boxes already created in an unhealthy pool continue to function normally, letting your teams keep working without disruption.

This enforcement mechanism ensures projects use only the resources they're approved for, maintaining a secure by default environment with efficient operations across all projects in a dev center.

## Prerequisites

- Microsoft Dev Box configured with a dev center, and projects.

## Create a default project policy

The first policy you create becomes the default project policy. It applies to all projects in the dev center. A default policy sets up a baseline for your projects, ensuring they have a minimum level of governance and control over accessible resources. In a default project policy, you select resources to allow, like networks, images, and SKUs. Projects use the default policy unless they have a custom project policy. If a project uses a custom policy, only the resources defined in that policy are available. If no custom policy is assigned to the project, the resources defined in the default policy are available. A project can have only one policy applied.

To create a default project policy:

1. Sign in to the [Azure portal](https://portal.azure.com). Navigate to your dev center, expand **Manage** in the left pane, and select **Project policy**. On the **Project policy** page, select **Create a policy**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-page.png" alt-text="Screenshot of the Project policy page in the Azure portal, showing options to create a new project policy.":::

1. The first policy you create is the **Default** policy. Under **Allow resources**, select the resources you want to allow for the project. You must select at least one resource for each category: images, networks, and SKUs.

   - In **Images**, select **Allow all current and future images**.
     :::image type="content" source="media/how-to-configure-project-policy/project-policy-select-images.png" alt-text="Screenshot showing the Create project policy page, with Select images highlighted.":::

   - In **Networks**, select **All current and future networks**.
     :::image type="content" source="media/how-to-configure-project-policy/project-policy-select-networks.png" alt-text="Screenshot showing the Create project policy page, with Select networks highlighted.":::

   - To allow specific SKU usage, in **SKUs**, select **Select a specific SKU or group of SKUs**.
     :::image type="content" source="media/how-to-configure-project-policy/project-policy-select-skus.png" alt-text="Screenshot showing the Create project policy page, with Select SKUs highlighted.":::

   - In the **Select SKUs** pane, select the SKUs you want to allow (for example, all **16 vCPU** SKUs). Confirm your selection by selecting **Select**.
     :::image type="content" source="media/how-to-configure-project-policy/project-policy-select-multiple-skus.png" alt-text="Screenshot showing the Select SKUs pane in the Azure portal, with multiple SKUs selected.":::

1. After selecting the resources, select **Create** to finalize the policy.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-create.png" alt-text="Screenshot showing the Create button in the Azure portal to finalize a project policy.":::

1. To confirm that the default project policy includes the resources, expand **Default**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-summary.png" alt-text="Screenshot showing the summary of a default project policy in the Azure portal.":::

## Create a custom project policy

Custom project policies enable you to control resources for specific projects. These policies allow you to control which resources are available to projects, ensuring better governance and resource management. Each project can have only one custom policy, but the same policy can be applied to multiple projects.

To create and apply a custom project policy:

1. Sign in to the [Azure portal](https://portal.azure.com), go to your dev center, and in the left pane, expand **Manage**, then select **Project policy**.

1. On the **Project policy** page, select **Create**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-create-custom.png" alt-text="Screenshot showing the Create button for a custom project policy in the Azure portal.":::

    - On the **Create project policy** page, enter a **Name** for the project policy.

      :::image type="content" source="media/how-to-configure-project-policy/project-policy-custom-name.png" alt-text="Screenshot showing the name field for a custom project policy in the Azure portal.":::

    - Under **Target projects**, select **Select projects**.

      :::image type="content" source="media/how-to-configure-project-policy/project-policy-custom-select-projects.png" alt-text="Screenshot showing the Select projects option for a custom project policy in the Azure portal.":::

    - In the **Select projects** pane, select the projects you want to apply the policy to, and then select **Select**.

      :::image type="content" source="media/how-to-configure-project-policy/project-policy-target-projects.png" alt-text="Screenshot showing the selected target projects for a custom project policy in the Azure portal.":::

1. Under **Allow resources**, select the resources you want to allow for the project. For example, to let a project use only Visual Studio 2022 images, in **Images**, select **Select a specific image or group of images**.
   :::image type="content" source="media/how-to-configure-project-policy/project-policy-custom-select-images.png" alt-text="Screenshot showing the Select images option for a custom project policy in the Azure portal.":::
   
    - Select all Visual Studio 2022 images. To confirm your selection, select **Select**.
      :::image type="content" source="media/how-to-configure-project-policy/project-policy-custom-select-multiple-images.png" alt-text="Screenshot showing the Select images pane for a custom project policy in the Azure portal.":::

1. Select more resources if needed. When you finish selecting resources, select **Create**.

## View policies for a project
When you create a custom project policy and apply it to the target project, the default project policy doesn't apply to that project. The custom project policy must define all resources you want to allow in the project.

To view the project policies that apply to projects:

1. Sign in to the [Azure portal](https://portal.azure.com), navigate to your dev center, and in the left pane, expand **Manage**, then select **Project policy**. 

1. On the **Project policy** page, expand the custom project policy you created.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-custom-summary.png" alt-text="Screenshot showing the summary of an applied custom project policy in the Azure portal.":::

## Edit a project policy

Edit a project policy to update allowed resources, modify governance settings, or adjust resource availability as project requirements evolve.

To edit a project policy:

1. Sign in to the [Azure portal](https://portal.azure.com), navigate to your dev center, and in the left pane, expand **Manage**, then select **Project policy**. 

1. For the project policy you want to edit, scroll to the right and select **Edit**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-edit.png" alt-text="Screenshot showing the Edit button for a project policy in the Azure portal.":::

1. After making changes, select **Apply**.

## Delete a project policy

Deleting policies removes them from the projects where they are applied and applies the default policy. Delete custom policies first. You can't delete the default policy until all custom policies are deleted.

To delete a project policy: 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your dev center.

1. In the left pane, expand **Manage**, and select **Project policy**.

1. Select the project policy to delete, and select **Delete**.

   :::image type="content" source="media/how-to-configure-project-policy/project-policy-delete.png" alt-text="Screenshot showing the Delete button for a project policy in the Azure portal.":::

1. In the **Delete project policy**, read the message: *"Deleting a custom policy will cause a pool to become unhealthy if the pool resources are allowed by the custom policy but not allowed by the default policy."*, and select **OK**.

## Related content

- Learn more about [key concepts for Microsoft Dev Box](concept-dev-box-concepts.md).