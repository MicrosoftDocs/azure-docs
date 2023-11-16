---
title: UK OFFICIAL and UK NHS blueprint sample
description: Overview of the UK OFFICIAL and UK NHS blueprint sample. This blueprint sample helps customers assess specific controls.
ms.date: 09/07/2023
ms.topic: sample
---
# UK OFFICIAL and UK NHS blueprint sample

[!INCLUDE [Blueprints deprecation note](../../../../includes/blueprints-deprecation-note.md)]

The UK OFFICIAL and UK NHS blueprint sample provides governance guardrails using
[Azure Policy](../../policy/overview.md) that help you assess specific
[UK OFFICIAL and UK NHS](https://www.gov.uk/government/publications/government-security-classifications)
controls. This blueprint helps customers deploy a core set of policies for any Azure-deployed
architecture that must implement controls for UK OFFICIAL and UK NHS.

## Control mapping

The [Azure Policy control mapping](../../policy/samples/ukofficial-uknhs.md) provides details on
policy definitions included within this blueprint and how these policy definitions map to the
**controls** in the UK OFFICIAL and UK NHS framework. When assigned to an architecture, resources
are evaluated by Azure Policy for non-compliance with assigned policy definitions. For more
information, see [Azure Policy](../../policy/overview.md).

## Deploy

To deploy the Azure Blueprints UK OFFICIAL and UK NHS blueprint sample,
the following steps must be taken:

> [!div class="checklist"]
> - Create a new blueprint from the sample
> - Mark your copy of the sample as **Published**
> - Assign your copy of the blueprint to an existing subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free)
before you begin.

### Create blueprint from sample

First, implement the blueprint sample by creating a new blueprint in your environment using the
sample as a starter.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. From the **Getting started** page on the left, select the **Create** button under _Create a
   blueprint_.

1. Find the **UK OFFICIAL and UK NHS** blueprint sample under _Other Samples_ and select **Use this
   sample**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the UK OFFICIAL and UK NHS blueprint
     sample.
   - **Definition location**: Use the ellipsis and select the management group to save your copy of
     the sample to.

1. Select the _Artifacts_ tab at the top of the page or **Next: Artifacts** at the bottom of the
   page.

1. Review the list of artifacts that are included in the blueprint sample. Many of the artifacts
   have parameters that we'll define later. Select **Save Draft** when you've finished reviewing the
   blueprint sample.

### Publish the sample copy

Your copy of the blueprint sample has now been created in your environment. It's created in
**Draft** mode and must be **Published** before it can be assigned and deployed. The copy of the
blueprint sample can be customized to your environment and needs, but that modification may move it
away from alignment with UK OFFICIAL and UK NHS controls.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Publish blueprint** at the top of the page. In the new page on the right, provide a
   **Version** for your copy of the blueprint sample. This property is useful for if you make a
   modification later. Provide **Change notes** such as "First version published from the UK
   OFFICIAL and UK NHS blueprint sample." Then select **Publish** at the bottom of the page.

### Assign the sample copy

Once the copy of the blueprint sample has been successfully **Published**, it can be assigned to a
subscription within the management group it was saved to. This step is where parameters are provided
to make each deployment of the copy of the blueprint sample unique.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Assign blueprint** at the top of the blueprint definition page.

1. Provide the parameter values for the blueprint assignment:

   - Basics

     - **Subscriptions**: Select one or more of the subscriptions that are in the management group
       you saved your copy of the blueprint sample to. If you select more than one subscription, an
       assignment will be created for each using the parameters entered.
     - **Assignment name**: The name is pre-populated for you based on the name of the blueprint.
       Change as needed or leave as is.
     - **Location**: Select a region for the managed identity to be created in. Azure Blueprints uses
       this managed identity to deploy all artifacts in the assigned blueprint. To learn more, see
       [managed identities for Azure resources](../../../active-directory/managed-identities-azure-resources/overview.md).
     - **Blueprint definition version**: Pick a **Published** version of your copy of the blueprint
       sample.

   - Lock Assignment

     Select the blueprint lock setting for your environment. For more information, see
     [blueprints resource locking](../concepts/resource-locking.md).

   - Managed Identity

     Leave the default _system assigned_ managed identity option.

   - Artifact parameters

     The parameters defined in this section apply to the artifact under which it's defined. These
     parameters are [dynamic parameters](../concepts/parameters.md#dynamic-parameters) since they're
     defined during the assignment of the blueprint. For a full list or artifact parameters and
     their descriptions, see [Artifact parameters table](#artifact-parameters-table).

1. Once all parameters have been entered, select **Assign** at the bottom of the page. The blueprint
   assignment is created and artifact deployment begins. Deployment takes roughly an hour. To check
   on the status of deployment, open the blueprint assignment.

> [!WARNING]
> The Azure Blueprints service and the built-in blueprint samples are **free of cost**. Azure
> resources are [priced by product](https://azure.microsoft.com/pricing/). Use the
> [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate the cost of
> running resources deployed by this blueprint sample.

### Artifact parameters table

The following table provides a list of the blueprint artifact parameters:

|Artifact name|Artifact type|Parameter name|Description|
|-|-|-|-|
|Blueprint initiative for UK OFFICIAL or UK NHS|Policy assignment |Resource types to audit diagnostic logs (Policy: Blueprint initiative for UK OFFICIAL or UK NHS) |List of resource types to audit if diagnostic log setting is note enabled. For acceptable values, see [Supported services, schemas, and categories for Azure Diagnostic Logs](../../../azure-monitor/essentials/resource-logs-schema.md). |
|\[Preview\]: Deploy Log Analytics Agent for Linux VMs |Policy assignment |Optional: List of VM images that have supported Linux OS to add to scope (Policy: \[Preview\]: Deploy Log Analytics Agent for Linux VMs) |(Optional) Default value is _none_. For more information, see [Create a Log Analytics workspace in the Azure portal](../../../azure-monitor/logs/quick-create-workspace.md). |
|\[Preview\]: Deploy Log Analytics Agent for Windows VMs |Policy assignment |Optional: List of VM images that have supported Windows OS to add to scope (Policy: \[Preview\]: Deploy Log Analytics Agent for Windows VMs) |(Optional) Default value is _none_. For more information, see [Create a Log Analytics workspace in the Azure portal](../../../azure-monitor/logs/quick-create-workspace.md). |

## Next steps

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md).
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md).
