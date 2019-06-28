---
title: Create an environment from a blueprint sample
description: Use a blueprint sample to create a blueprint definition that sets up two resource groups and configures a role assignment for each.
author: DCtheGeek
ms.author: dacoulte
ms.date: 03/05/2019
ms.topic: tutorial
ms.service: blueprints
manager: carmonm
---
# Tutorial: Create an environment from a blueprint sample

Sample blueprints provide examples of what can be done using Azure Blueprints. Each is a sample with
a specific intent or purpose, but doesn't create a complete environment by themselves. Each is
intended as a starting place to explore using Azure Blueprints with various combinations of included
artifacts, designs, and parameters.

The following tutorial uses the **Resource Groups with RBAC** blueprint sample to showcase different
aspects of the Blueprints service. The following steps are covered:

> [!div class="checklist"]
> - Create a new blueprint definition from the sample
> - Mark your copy of the sample as **Published**
> - Assign your copy of the blueprint to an existing subscription
> - Inspect deployed resources for the assignment
> - Unassign the blueprint to remove the locks

## Prerequisites

To complete this tutorial, an Azure subscription is needed. If you don't have an Azure
subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Create blueprint definition from sample

First, implement the blueprint sample. Importing creates a new blueprint in your environment based
on the sample.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. From the **Getting started** page on the left, select the **Create** button under _Create a
   blueprint_.

1. Find the **Resource Groups with RBAC** blueprint sample under _Other Samples_ and select **Use
   this sample**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the blueprint sample. For this tutorial,
     we'll use the name _two-rgs-with-role-assignments_.
   - **Definition location**: Use the ellipsis and select the management group or subscription to
     save your copy of the sample to.

1. Select the _Artifacts_ tab at the top of the page or **Next: Artifacts** at the bottom of the
   page.

1. Review the list of artifacts that make up the blueprint sample. This sample defines two resource
   groups, with display names of _ProdRG_ and _PreProdRG_. The final name and location of each
   resource group are set during blueprint assignment. The _ProdRG_ resource group is assigned the
   _Contributor_ role and the _PreProdRG_ resource group is assigned the _Owner_ and _Readers_
   roles. The roles assigned in the definition are static, but user, app, or group that is assigned
   the role is set during blueprint assignment.

1. Select **Save Draft** when you've finished reviewing the blueprint sample.

This step creates a copy of the sample blueprint definition in the selected management group or
subscription. The saved blueprint definition is managed like any blueprint created from scratch. You
may save the sample to your management group or subscription as many times as needed. However, each
copy must be provided a unique name.

Once the **Saving blueprint definition succeeded** portal notification appears, move to the next
step.

## Publish the sample copy

Your copy of the blueprint sample has now been created in your environment. It's created in
**Draft** mode and must be **Published** before it can be assigned and deployed. The copy of the
blueprint sample can be customized to your environment and needs. For this tutorial, we won't make
any changes.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find the
   _two-rgs-with-role-assignments_ blueprint definition and then select it.

1. Select **Publish blueprint** at the top of the page. In the new pane on the right, provide
   **Version** as _1.0_ for your copy of the blueprint sample. This property is useful for if you
   make a modification later. Provide **Change notes** such as "First version published from the
   resource groups with RBAC blueprint sample." Then select **Publish** at the bottom of the page.

This step makes it possible to assign the blueprint to a subscription. Once published, changes can
still be made. Additional changes require publishing with a new **Version** value to track
differences between different versions of the same blueprint definition.

Once the **Publishing blueprint definition succeeded** portal notification appears, move to the next
step.

## Assign the sample copy

Once the copy of the blueprint sample has been successfully **Published**, it can be assigned to a
subscription within the management group it was saved to. This step is where parameters are provided
to make each deployment of the copy of the blueprint sample unique.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find the
   _two-rgs-with-role-assignments_ blueprint definition and then select it.

1. Select **Assign blueprint** at the top of the blueprint definition page.

1. Provide the parameter values for the blueprint assignment:

   - Basics

     - **Subscriptions**: Select one or more of the subscriptions that are in the management group
       you saved your copy of the blueprint sample to. If you select more than one subscription, an
       assignment will be created for each using the parameters entered.
     - **Assignment name**: The name is pre-populated for you based on the name of the blueprint
       definition.
     - **Location**: Select a region for the managed identity to be created in. Azure Blueprint uses
       this managed identity to deploy all artifacts in the assigned blueprint. To learn more, see
       [managed identities for Azure resources](../../../active-directory/managed-identities-azure-resources/overview.md).
       For this tutorial, select _East US 2_.
     - **Blueprint definition version**: Pick the **Published** version _1.0_ of your copy of the
       sample blueprint definition.

   - Lock Assignment

     Select the _Read Only_ blueprint lock mode. For more information, see [blueprints resource locking](../concepts/resource-locking.md).

   - Managed Identity

     Leave the default _System assigned_ option. For more information, see [managed identities](../../../active-directory/managed-identities-azure-resources/overview.md).

   - Artifact parameters

     The parameters defined in this section apply to the artifact under which it's defined. These
     parameters are [dynamic parameters](../concepts/parameters.md#dynamic-parameters) since they're
     defined during the assignment of the blueprint. For each artifact, set the parameter value to
     what is defined in the **Value** column. For `{Your ID}`, select your Azure user account.

     |Artifact name|Artifact type|Parameter name|Value|Description|
     |-|-|-|-|-|
     |ProdRG resource group|Resource group|Name|ProductionRG|Defines the name of the first resource group.|
     |ProdRG resource group|Resource group|Location|West US 2|Sets the location of the first resource group.|
     |Contributor|Role assignment|User or Group|{Your ID}|Defines which user or group to grant the _Contributor_ role assignment within the first resource group.|
     |PreProdRG resource group|Resource group|Name|PreProductionRG|Defines the name of the second resource group.|
     |PreProdRG resource group|Resource group|Location|West US|Sets the location of the second resource group.|
     |Owner|Role assignment|User or Group|{Your ID}|Defines which user or group to grant the _Owner_ role assignment within the second resource group.|
     |Readers|Role assignment|User or Group|{Your ID}|Defines which user or group to grant the _Readers_ role assignment within the second resource group.|

1. Once all parameters have been entered, select **Assign** at the bottom of the page.

This step deploys the defined resources and configures the selected **Lock Assignment**. Blueprint
locks can take up to 30 minutes to apply.

Once the **Assigning blueprint definition succeeded** portal notification appears, move to the next
step.

## Inspect resources deployed by the assignment

The blueprint assignment creates and tracks the artifacts defined in the blueprint definition. We
can see the status of the resources from the blueprint assignment page and by looking at the
resources directly.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Assigned blueprints** page on the left. Use the filters to find the
   _Assignment-two-rgs-with-role-assignments_ blueprint assignment and then select it.

   From this page, we can see the assignment succeeded and the list of created resources along with
   their blueprint lock state. If the assignment is updated, the **Assignment operation** drop-down
   shows details about the deployment of each definition version. Each listed resource that was
   created can be clicked and opens that resources property page.

1. Select the **ProductionRG** resource group.

   We see that the name of the resource group is **ProductionRG** and not the artifact display name
   _ProdRG_. This name matches the value set during the blueprint assignment.

1. Select the **Access control (IAM)** page on the left and then the **Role assignments** tab.

   Here we see that your account has been granted the _Contributor_ role on the scope of _This
   resource_. The _Assignment-two-rgs-with-role-assignments_ blueprint assignment has the _Owner_
   role as it was used to create the resource group. These permissions are also used to manage
   resources with configured blueprint locks.

1. From the Azure portal breadcrumb, select **Assignment-two-rgs-with-role-assignments** to go back
   one page, then select the **PreProductionRG** resource group.

1. Select the **Access control (IAM)** page on the left and then the **Role assignments** tab.

   Here we see that your account has been granted both the _Owner_ and _Reader_ roles, both on the
   scope of _This resource_. The blueprint assignment also has the _Owner_ role like the first
   resource group.

1. Select the **Deny assignments** tab.

   The blueprint assignment created a [deny assignment](../../../role-based-access-control/deny-assignments.md)
   on the deployed resource group to enforce the _Read Only_ blueprint lock mode. The deny
   assignment prevents someone with appropriate rights on the _Role assignments_ tab from taking
   specific actions. The deny assignment affects _All principals_.

1. Select the deny assignment, then select the **Denied Permissions** page on the left.

   The deny assignment is preventing all operations with the **\*** and **Action** configuration,
   but allows read access by excluding **\*/read** via **NotActions**.

1. From the Azure portal breadcrumb, select **PreProductionRG - Access control (IAM)**. Then select
   the **Overview** page on the left and then the **Delete resource group** button. Enter the name
   _PreProductionRG_ to confirm the delete and select **Delete** at the bottom of the pane.

   The portal notification **Delete resource group PreProductionRG failed** is displayed. The error
   states that while your account has permission to delete the resource group, access is denied by
   the blueprint assignment. Remember that we selected the _Read Only_ blueprint lock mode during
   blueprint assignment. The blueprint lock prevents an account with permission, even _Owner_, from
   deleting the resource. For more information, see [blueprints resource locking](../concepts/resource-locking.md).

These steps show that our resources were created as defined and the blueprint locks prevented
unwanted deletion, even from an account with permission.

## Unassign the blueprint

The last step is to remove the assignment of the blueprint and the resources that it deployed.
Removing the assignment doesn't remove the deployed artifacts.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Assigned blueprints** page on the left. Use the filters to find the
   _Assignment-two-rgs-with-role-assignments_ blueprint assignment and then select it.

1. Select the **Unassign blueprint** button at the top of the page. Read the warning in the
   confirmation dialog, then select **OK**.

   With the blueprint assignment removed, the blueprint locks are also removed. The created
   resources can once again be deleted by an account with permissions.

1. Select **Resource groups** from the Azure menu, then select **ProductionRG**.

1. Select the **Access control (IAM)** page on the left and then the **Role assignments** tab.

The security for each resource groups still has the deployed role assignments, but the blueprint
assignment no longer has _Owner_ access.

Once the **Removing blueprint assignment succeeded** portal notification appears, move to the next
step.

## Clean up resources

When finished with this tutorial, delete the following resources:

- Resource group _ProductionRG_
- Resource group _PreProductionRG_
- Blueprint definition _two-rgs-with-role-assignments_

## Next steps

- Learn about the [blueprint life-cycle](../concepts/lifecycle.md)
- Understand how to use [static and dynamic parameters](../concepts/parameters.md)
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md)
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md)
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md)
- Resolve issues during the assignment of a blueprint with [general troubleshooting](../troubleshoot/general.md)