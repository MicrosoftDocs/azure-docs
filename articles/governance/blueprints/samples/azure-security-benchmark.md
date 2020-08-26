---
title: Azure Security Benchmark blueprint sample overview
description: Overview of the Azure Security Benchmark blueprint sample. This blueprint sample helps customers assess specific controls.
ms.date: 06/02/2020
ms.topic: sample
---
# Azure Security Benchmark blueprint sample

The Azure Security Benchmark blueprint sample provides governance guard-rails using
[Azure Policy](../../policy/overview.md) that help you assess specific
[Azure Security Benchmark](../../../security/benchmarks/overview.md) controls. This blueprint
helps customers deploy a core set of policies for any Azure-deployed architecture where they intend
to implement Azure Security Benchmark controls.

## Control mapping

The [Azure Policy control mapping](../../policy/samples/azure-security-benchmark.md) provides
details on policy definitions included within this blueprint and how these policy definitions map to
the **compliance domains** and **controls** in the Azure Security Benchmark. When assigned to an
architecture, resources are evaluated by Azure Policy for non-compliance with assigned policy
definitions. For more information, see [Azure Policy](../../policy/overview.md).

## Deploy

To deploy the Azure Blueprints Azure Security Benchmark blueprint sample, the following steps must
be taken:

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

1. Find the **Azure Security Benchmark** blueprint sample under _Other Samples_ and select click the
   name to select this sample.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the Azure Security Benchmark blueprint
     sample.
   - **Definition location**: Use the ellipsis and select the management group to save your copy of
     the sample to.

1. Select the _Artifacts_ tab at the top of the page or **Next: Artifacts** at the bottom of the
   page.

1. Review the list of artifacts that make up the blueprint sample. Many of the artifacts have
   parameters that we'll define later. Select **Save Draft** when you've finished reviewing the
   blueprint sample.

### Publish the sample copy

Your copy of the blueprint sample has now been created in your environment. It's created in
**Draft** mode and must be **Published** before it can be assigned and deployed. The copy of the
blueprint sample can be customized to your environment and needs, but that modification may move
it away from alignment with Azure Security Benchmark recommendations.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Publish blueprint** at the top of the page. In the new page on the right, provide a
   **Version** for your copy of the blueprint sample. This property is useful for if you make a
   modification later. Provide **Change notes** such as "First version published from the Azure
   Security Benchmark blueprint sample." Then select **Publish** at the bottom of the page.

### Assign the sample copy

Once the copy of the blueprint sample has been successfully **Published**, it can be assigned to a
subscription within the management group it was saved to. This step is where parameters are
provided to make each deployment of the copy of the blueprint sample unique.

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
     - **Location**: Select a region for the managed identity to be created in. Azure Blueprint uses
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
|Audit Azure Security Benchmark recommendations and deploy specific supporting VM Extensions|Policy assignment|List of users excluded from Windows VM Administrators group|A semicolon-separated list of members that should be excluded in the Administrators local group. Ex: Administrator; myUser1; myUser2|
|Audit Azure Security Benchmark recommendations and deploy specific supporting VM Extensions|Policy assignment|List of users that must be included in Windows VM Administrators group|A semicolon-separated list of members that should be included in the Administrators local group. Ex: Administrator; myUser1; myUser2|
|Audit Azure Security Benchmark recommendations and deploy specific supporting VM Extensions|Policy assignment|List of users that Windows VM Administrators group must *only* include|A semicolon-separated list of all the expected members of the Administrators local group. Ex: Administrator; myUser1; myUser2|
|Audit Azure Security Benchmark recommendations and deploy specific supporting VM Extensions|Policy assignment|List of regions where Network Watcher should be enabled|To see a complete list of regions use Get-AzLocation|
|Audit Azure Security Benchmark recommendations and deploy specific supporting VM Extensions|Policy assignment|Virtual network where VMs should be connected|Example: /subscriptions/YourSubscriptionId/resourceGroups/YourResourceGroupName/providers/Microsoft.Network/virtualNetworks/Name|
|Audit Azure Security Benchmark recommendations and deploy specific supporting VM Extensions|Policy assignment|Network gateway that virtual networks should use|Example: /subscriptions/YourSubscriptionId/resourceGroups/YourResourceGroup/providers/Microsoft.Network/virtualNetworkGateways/Name|
|Audit Azure Security Benchmark recommendations and deploy specific supporting VM Extensions|Policy assignment|List of workspace IDs where Log Analytics agents should connect|A semicolon-separated list of the workspace IDs that the Log Analytics agent should be connected to|
|Audit Azure Security Benchmark recommendations and deploy specific supporting VM Extensions|Policy assignment|List of resource types that should have diagnostic logs enabled|Audit diagnostic setting for selected resource types|
|Audit Azure Security Benchmark recommendations and deploy specific supporting VM Extensions|Policy assignment|Latest PHP version|Latest supported PHP version for App Services|
|Audit Azure Security Benchmark recommendations and deploy specific supporting VM Extensions|Policy assignment|Latest Java version|Latest supported Java version for App Services|
|Audit Azure Security Benchmark recommendations and deploy specific supporting VM Extensions|Policy assignment|Latest Windows Python version|Latest supported Python version for App Services|
|Audit Azure Security Benchmark recommendations and deploy specific supporting VM Extensions|Policy assignment|Latest Linux Python version|Latest supported Python version for App Services|

## Next steps

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md).
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md).