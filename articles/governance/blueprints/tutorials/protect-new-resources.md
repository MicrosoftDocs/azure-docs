---
title: Protect new resources with blueprint resource locks
description: Learn to use the Azure Blueprints resource locks Read Only and Do Not Delete to protect newly deployed resources.
author: DCtheGeek
ms.author: dacoulte
ms.date: 03/28/2019
ms.topic: tutorial
ms.service: blueprints
manager: carmonm
---
# Protect new resources with Azure Blueprints resource locks

Azure Blueprints [resource locks](../concepts/resource-locking.md) make it possible to protect newly
deployed resources from being tampered with, even by an account with the _Owner_ role. This
protection can be added to resources created by a Resource Manager template artifact in the
blueprint definition.

The following steps are covered:

> [!div class="checklist"]
> - Create a new blueprint definition
> - Mark your blueprint definition as **Published**
> - Assign your blueprint definition to an existing subscription
> - Inspect the new resource group
> - Unassign the blueprint to remove the locks

## Prerequisites

To complete this tutorial, an Azure subscription is needed. If you don't have an Azure subscription,
create a [free account](https://azure.microsoft.com/free/) before you begin.

## Create new blueprint definition

First, create the new blueprint definition.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. From the **Getting started** page on the left, select the **Create** button under _Create a
   blueprint_.

1. Find the **Blank Blueprint** blueprint sample at the top of the page and select **Start with
   blank blueprint**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the blueprint sample. For this tutorial,
     we'll use the name _locked-storageaccount_.
   - **Blueprint description**: Describes the blueprint definition. Use "For testing blueprint
     resource locking on deployed resources."
   - **Definition location**: Use the ellipsis and select the management group or subscription to
     save your blueprint definition to.

1. Select the _Artifacts_ tab at the top of the page or **Next: Artifacts** at the bottom of the
   page.

1. Add resource group at subscription: Select the **+ Add artifact...** row under **Subscription**.
   Select 'Resource Group' for _Artifact type_. Set the _Artifact display name_ to **RGtoLock**.
   Leave the _Resource Group Name_ and _Location_ fields blank, but make sure that the checkbox is
   checked on each property to make them **dynamic parameters**. Click **Add** to add this artifact
   to the blueprint.

1. Add template under resource group: Select the **+ Add artifact..** row under the **RGtoLock**
   entry. Select 'Azure Resource Manager template' for _Artifact type_, set _Artifact display name_
   to 'StorageAccount', and leave _Description_ blank. On the **Template** tab in the editor box,
   paste the following Resource Manager template. After pasting the template, select **Add** to add
   this artifact to the blueprint.

   ```json
   {
       "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
       "contentVersion": "1.0.0.0",
       "parameters": {
           "storageAccountType": {
               "type": "string",
               "defaultValue": "Standard_LRS",
               "allowedValues": [
                   "Standard_LRS",
                   "Standard_GRS",
                   "Standard_ZRS",
                   "Premium_LRS"
               ],
               "metadata": {
                   "description": "Storage Account type"
               }
           }
       },
       "variables": {
           "storageAccountName": "[concat('store', uniquestring(resourceGroup().id))]"
       },
       "resources": [{
           "type": "Microsoft.Storage/storageAccounts",
           "name": "[variables('storageAccountName')]",
           "location": "[resourceGroup().location]",
           "apiVersion": "2018-07-01",
           "sku": {
               "name": "[parameters('storageAccountType')]"
           },
           "kind": "StorageV2",
           "properties": {}
       }],
       "outputs": {
           "storageAccountName": {
               "type": "string",
               "value": "[variables('storageAccountName')]"
           }
       }
   }
   ```

1. Select **Save Draft** at the bottom of the page.

This step creates the blueprint definition in the selected management group or subscription.

Once the **Saving blueprint definition succeeded** portal notification appears, move to the next
step.

## Publish the blueprint definition

Your blueprint definition has now been created in your environment. It's created in **Draft** mode
and must be **Published** before it can be assigned and deployed.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find the
   _locked-storageaccount_ blueprint definition and then select it.

1. Select **Publish blueprint** at the top of the page. In the new pane on the right, provide
   **Version** as _1.0_. This property is useful for if you make a modification later. Provide
   **Change notes** such as "First version published for locking blueprint deployed resources." Then
   select **Publish** at the bottom of the page.

This step makes it possible to assign the blueprint to a subscription. Once published, changes can
still be made. Additional changes require publishing with a new **Version** value to track
differences between different versions of the same blueprint definition.

Once the **Publishing blueprint definition succeeded** portal notification appears, move to the next
step.

## Assign the blueprint definition

Once the blueprint definition has been successfully **Published**, it can be assigned to a
subscription within the management group it was saved to. This step is where parameters are provided
to make each deployment of the blueprint definition unique.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find the
   _locked-storageaccount_ blueprint definition and then select it.

1. Select **Assign blueprint** at the top of the blueprint definition page.

1. Provide the parameter values for the blueprint assignment:

   - Basics

     - **Subscriptions**: Select one or more of the subscriptions that are in the management group
       you saved your blueprint definition to. If you select more than one subscription, an
       assignment will be created for each using the parameters entered.
     - **Assignment name**: The name is pre-populated for you based on the name of the blueprint
       definition. We want this assignment to represent locking the new resource group, so change
       the assignment name to _assignment-locked-storageaccount-TestingBPLocks_.
     - **Location**: Select a region for the managed identity to be created in. Azure Blueprint uses
       this managed identity to deploy all artifacts in the assigned blueprint. To learn more, see
       [managed identities for Azure resources](../../../active-directory/managed-identities-azure-resources/overview.md).
       For this tutorial, select _East US 2_.
     - **Blueprint definition version**: Pick the **Published** version _1.0_ of the blueprint
       definition.

   - Lock Assignment

     Select the _Read Only_ blueprint lock mode. For more information, see [blueprints resource locking](../concepts/resource-locking.md).

   - Managed Identity

     Leave the default _System assigned_ option. For more information, see [managed identities](../../../active-directory/managed-identities-azure-resources/overview.md).

   - Artifact parameters

     The parameters defined in this section apply to the artifact under which it's defined. These
     parameters are [dynamic parameters](../concepts/parameters.md#dynamic-parameters) since they're
     defined during the assignment of the blueprint. For each artifact, set the parameter value to
     what is defined in the **Value** column.

     |Artifact name|Artifact type|Parameter name|Value|Description|
     |-|-|-|-|-|
     |RGtoLock resource group|Resource group|Name|TestingBPLocks|Defines the name of the new resource group to apply blueprint locks to.|
     |RGtoLock resource group|Resource group|Location|West US 2|Defines the location of the new resource group to apply blueprint locks to.|
     |StorageAccount|Resource Manager template|storageAccountType (StorageAccount)|Standard_GRS|Select storage SKU. Default value is _Standard_LRS_.|

1. Once all parameters have been entered, select **Assign** at the bottom of the page.

This step deploys the defined resources and configures the selected **Lock Assignment**. Blueprint
locks can take up to 30 minutes to apply.

Once the **Assigning blueprint definition succeeded** portal notification appears, move to the next
step.

## Inspect resources deployed by the assignment

The assignment created the resource group _TestingBPLocks_ and the storage account deployed by the
Resource Manager template artifact. The new resource group and the selected lock state are displayed
on the assignment details page.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Assigned blueprints** page on the left. Use the filters to find the
   _assignment-locked-storageaccount-TestingBPLocks_ blueprint assignment and then select it.

   From this page, we can see the assignment succeeded and the resources were deployed with the new
   blueprint lock state. If the assignment is updated, the **Assignment operation** drop-down shows
   details about the deployment of each definition version. The resource group can be clicked to
   directly open the property page.

1. Select the **TestingBPLocks** resource group.

1. Select the **Access control (IAM)** page on the left and then the **Role assignments** tab.

   Here we see that the _assignment-locked-storageaccount-TestingBPLocks_ blueprint assignment has
   the _Owner_ role as it was used to deploy and lock the resource group.

1. Select the **Deny assignments** tab.

   The blueprint assignment created a [deny assignment](../../../role-based-access-control/deny-assignments.md)
   on the deployed resource group to enforce the _Read Only_ blueprint lock mode. The deny
   assignment prevents someone with appropriate rights on the _Role assignments_ tab from taking
   specific actions. The deny assignment affects _All principals_.

   For information about excluding a principal from a deny assignment, see [blueprints resource locking](../concepts/resource-locking.md#exclude-a-principal-from-a-deny-assignment).

1. Select the deny assignment, then select the **Denied Permissions** page on the left.

   The deny assignment is preventing all operations with the **\*** and **Action** configuration,
   but allows read access by excluding **\*/read** via **NotActions**.

1. From the Azure portal breadcrumb, select **TestingBPLocks - Access control (IAM)**. Then select
   the **Overview** page on the left and then the **Delete resource group** button. Enter the name
   _TestingBPLocks_ to confirm the delete and select **Delete** at the bottom of the pane.

   The portal notification **Delete resource group TestingBPLocks failed** is displayed. The error
   states that while your account has permission to delete the resource group, access is denied by
   the blueprint assignment. Remember that we selected the _Read Only_ blueprint lock mode during
   blueprint assignment. The blueprint lock prevents an account with permission, even _Owner_, from
   deleting the resource. For more information, see [blueprints resource locking](../concepts/resource-locking.md).

These steps show that our deployed resources are now protected with blueprint locks that prevented
unwanted deletion, even from an account with permission.

## Unassign the blueprint

The last step is to remove the assignment of the blueprint definition. Removing the assignment
doesn't remove the touched artifacts.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Assigned blueprints** page on the left. Use the filters to find the
   _assignment-locked-storageaccount-TestingBPLocks_ blueprint assignment and then select it.

1. Select the **Unassign blueprint** button at the top of the page. Read the warning in the
   confirmation dialog, then select **OK**.

   With the blueprint assignment removed, the blueprint locks are also removed. The created
   resources can once again be deleted by an account with permissions.

1. Select **Resource groups** from the Azure menu, then select **TestingBPLocks**.

1. Select the **Access control (IAM)** page on the left and then the **Role assignments** tab.

The security for the resource group shows that the blueprint assignment no longer has _Owner_
access.

Once the **Removing blueprint assignment succeeded** portal notification appears, move to the next
step.

## Clean up resources

When finished with this tutorial, delete the following resources:

- Resource group _TestingBPLocks_
- Blueprint definition _locked-storageaccount_

## Next steps

- Learn about the [blueprint life-cycle](../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../concepts/parameters.md).
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md).
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md).
- Resolve issues during the assignment of a blueprint with [general troubleshooting](../troubleshoot/general.md).