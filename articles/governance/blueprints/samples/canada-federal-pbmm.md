---
title: Canada Federal PBMM blueprint sample
description: Overview of the Canada Federal PBMM blueprint sample. This blueprint sample helps customers assess specific controls.
ms.date: 09/07/2023
ms.topic: sample
---
# Canada Federal PBMM blueprint sample

[!INCLUDE [Blueprints deprecation note](../../../../includes/blueprints-deprecation-note.md)]

The Canada Federal PBMM blueprint sample provides governance guardrails using
[Azure Policy](../../policy/overview.md) that help you assess specific
[Canada Federal PBMM](https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/cloud-services/government-canada-security-control-profile-cloud-based-it-services.html)
controls. This blueprint helps customers deploy a core set of policies for any Azure-deployed
architecture that must implement controls for Canada Federal PBMM.

## Control mapping

The [Azure Policy control mapping](../../policy/samples/canada-federal-pbmm.md) provides details on
policy definitions included within this blueprint and how these policy definitions map to the
**controls** in the Canada Federal PBMM framework. When assigned to an architecture, resources are
evaluated by Azure Policy for non-compliance with assigned policy definitions. For more information,
see [Azure Policy](../../policy/overview.md).

## Deploy

To deploy the Azure Blueprints Canada Federal PBMM blueprint sample,
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

1. Find the **Canada Federal PBMM** blueprint sample under _Other Samples_ and select **Use this
   sample**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the Canada Federal PBMM blueprint sample.
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
away from alignment with Canada Federal PBMM controls.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Publish blueprint** at the top of the page. In the new page on the right, provide a
   **Version** for your copy of the blueprint sample. This property is useful for if you make a
   modification later. Provide **Change notes** such as "First version published from the Canada
   Federal PBMM blueprint sample." Then select **Publish** at the bottom of the page.

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
|\[Preview\]: Deploy Log Analytics Agent for Linux VMs |Policy assignment |Log Analytics workspace for Linux VMs |For more information, see [Create a Log Analytics workspace in the Azure portal](/azure/azure-monitor/logs/quick-create-workspace). |
|\[Preview\]: Deploy Log Analytics Agent for Linux VMs |Policy assignment |Optional: List of VM images that have supported Linux OS to add to scope |An empty array may be used to indicate no optional parameters: `[]` |
|\[Preview\]: Deploy Log Analytics Agent for Windows VMs |Policy assignment |Optional: List of VM images that have supported Windows OS to add to scope |An empty array may be used to indicate no optional parameters: `[]` |
|\[Preview\]: Deploy Log Analytics Agent for Windows VMs |Policy assignment |Log Analytics workspace for Windows VMs |For more information, see [Create a Log Analytics workspace in the Azure portal](/azure/azure-monitor/logs/quick-create-workspace). |
|\[Preview\]: Audit Canada Federal PBMM controls and deploy specific VM Extensions to support audit requirements |Policy assignment |Log Analytics workspace ID that VMs should be configured for |This is the ID (GUID) of the Log Analytics workspace that the VMs should be configured for. |
|\[Preview\]: Audit Canada Federal PBMM controls and deploy specific VM Extensions to support audit requirements |Policy assignment |List of resource types that should have diagnostic logs enabled |List of resource types to audit if diagnostic log setting isn't enabled. Acceptable values can be found at [Azure Monitor diagnostic logs schemas](/azure/azure-monitor/essentials/resource-logs-schema#service-specific-schemas). |
|\[Preview\]: Audit Canada Federal PBMM controls and deploy specific VM Extensions to support audit requirements |Policy assignment |Administrators group |Group. Example: `Administrator; myUser1; myUser2` |
|\[Preview\]: Audit Canada Federal PBMM controls and deploy specific VM Extensions to support audit requirements |Policy assignment |List of users that should be included in Windows VM Administrators group |A semicolon-separated list of members that should be included in the Administrators local group. Example: `Administrator; myUser1; myUser2` |
|Deploy Advanced Threat Protection on Storage Accounts |Policy assignment |Effect |Information about policy effects can be found at [Understand Azure Policy Effects](../../policy/concepts/effects.md). |
|Deploy Auditing on SQL servers |Policy assignment |The value in days of the retention period (0 indicates unlimited retention) |Retention days (optional, _180_ days if unspecified) |
|Deploy Auditing on SQL servers |Policy assignment |Resource group name for storage account for SQL server auditing |Auditing writes database events to an audit log in your Azure Storage account (a storage account is created in each region where a SQL Server is created that is shared by all servers in that region). Important - for proper operation of Auditing don't delete or rename the resource group or the storage accounts. |
|Deploy diagnostic settings for Network Security Groups |Policy assignment |Storage account prefix for network security group diagnostics |This prefix is combined with the network security group location to form the created storage account name. |
|Deploy diagnostic settings for Network Security Groups |Policy assignment |Resource group name for storage account for network security group diagnostics (must exist) |The resource group that the storage account is created in. This resource group must already exist. |

## Next steps

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md).
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md).
