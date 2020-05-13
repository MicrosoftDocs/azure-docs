---
title: "Tutorial: Protect new resources with locks"
description: In this tutorial, you use the Azure Blueprints resource locks options Read Only and Do Not Delete to protect newly deployed resources.
ms.date: 05/06/2020
ms.topic: tutorial
---
# Tutorial: Protect new resources with Azure Blueprints resource locks

With Azure Blueprints [resource locks](../concepts/resource-locking.md), you can protect newly
deployed resources from being tampered with, even by an account with the _Owner_ role. You can add
this protection in the blueprint definitions of resources created by a Resource Manager template
artifact.

In this tutorial, you'll complete these steps:

> [!div class="checklist"]
> - Create a blueprint definition
> - Mark your blueprint definition as **Published**
> - Assign your blueprint definition to an existing subscription
> - Inspect the new resource group
> - Unassign the blueprint to remove the locks

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free)
before you begin.

## Create a blueprint definition

First, create the blueprint definition.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. On the **Getting started** page on the left, select **Create** under **Create a
   blueprint**.

1. Find the **Blank Blueprint** blueprint sample at the top of the page. Select **Start with
   blank blueprint**.

1. Enter this information on the **Basics** tab:

   - **Blueprint name**: Provide a name for your copy of the blueprint sample. For this tutorial,
     we'll use the name **locked-storageaccount**.
   - **Blueprint description**: Add a description for the blueprint definition. Use **For testing
     blueprint resource locking on deployed resources**.
   - **Definition location**: Select the ellipsis button (...) and then select the management group
     or subscription to save your blueprint definition to.

1. Select the **Artifacts** tab at the top of the page, or select **Next: Artifacts** at the bottom
   of the page.

1. Add a resource group at the subscription level:
   1. Select the **Add artifact** row under **Subscription**.
   1. Select **Resource Group** under **Artifact type**.
   1. Set the **Artifact display name** to **RGtoLock**.
   1. Leave the **Resource Group Name** and **Location** boxes blank, but make sure the check box is
      selected on each property to make them **dynamic parameters**.
   1. Select **Add** to add the artifact to the blueprint.

1. Add a template under the resource group:
   1. Select the **Add artifact** row under the **RGtoLock** entry.
   1. Select **Azure Resource Manager template** under **Artifact type**, set **Artifact display
      name** to **StorageAccount**, and leave **Description** blank.
   1. On the **Template** tab, paste the following Resource Manager template into the editor box.
      After you paste in the template, select **Add** to add the artifact to the blueprint.

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

After the **Saving blueprint definition succeeded** portal notification appears, go to the next
step.

## Publish the blueprint definition

Your blueprint definition has now been created in your environment. It's created in **Draft** mode
and must be published before it can be assigned and deployed.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find the
   **locked-storageaccount** blueprint definition, and then select it.

1. Select **Publish blueprint** at the top of the page. In the new pane on the right, enter **1.0**
   as the **Version**. This property is useful if you make a change later. Enter **Change notes**,
   such as **First version published for locking blueprint deployed resources**. Then select
   **Publish** at the bottom of the page.

This step makes it possible to assign the blueprint to a subscription. After the blueprint
definition is published, you can still make changes. If you make changes, you need to publish the
definition with a new version value to track differences between versions of the same blueprint
definition.

After the **Publishing blueprint definition succeeded** portal notification appears, go to the next
step.

## Assign the blueprint definition

After the blueprint definition is published, you can assign it to a subscription within the
management group where you saved it. In this step, you provide parameters to make each deployment of
the blueprint definition unique.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find the
   **locked-storageaccount** blueprint definition, and then select it.

1. Select **Assign blueprint** at the top of the blueprint definition page.

1. Provide the parameter values for the blueprint assignment:

   - **Basics**

     - **Subscriptions**: Select one or more of the subscriptions that are in the management group
       where you saved your blueprint definition. If you select more than one subscription, an
       assignment will be created for each subscription, using the parameters you enter.
     - **Assignment name**: The name is pre-populated based on the name of the blueprint
       definition. We want this assignment to represent locking the new resource group, so change
       the assignment name to **assignment-locked-storageaccount-TestingBPLocks**.
     - **Location**: Select a region in which to create the managed identity. Azure Blueprint uses
       this managed identity to deploy all artifacts in the assigned blueprint. To learn more, see
       [managed identities for Azure resources](../../../active-directory/managed-identities-azure-resources/overview.md).
       For this tutorial, select **East US 2**.
     - **Blueprint definition version**: Select the published version **1.0** of the blueprint
       definition.

   - **Lock Assignment**

     Select the **Read Only** blueprint lock mode. For more information, see
     [blueprints resource locking](../concepts/resource-locking.md).

   - **Managed Identity**

     Use the default option: **System assigned**. For more information, see
     [managed identities](../../../active-directory/managed-identities-azure-resources/overview.md).

   - **Artifact parameters**

     The parameters defined in this section apply to the artifact under which they're defined. These
     parameters are [dynamic parameters](../concepts/parameters.md#dynamic-parameters) because
     they're defined during the assignment of the blueprint. For each artifact, set the parameter
     value to what you see in the **Value** column.

     |Artifact name|Artifact type|Parameter name|Value|Description|
     |-|-|-|-|-|
     |RGtoLock resource group|Resource group|Name|TestingBPLocks|Defines the name of the new resource group to apply blueprint locks to.|
     |RGtoLock resource group|Resource group|Location|West US 2|Defines the location of the new resource group to apply blueprint locks to.|
     |StorageAccount|Resource Manager template|storageAccountType (StorageAccount)|Standard_GRS|The storage SKU. The default value is _Standard_LRS_.|

1. After you've entered all parameters, select **Assign** at the bottom of the page.

This step deploys the defined resources and configures the selected **Lock Assignment**. It can take
up to 30 minutes to apply blueprint locks.

After the **Assigning blueprint definition succeeded** portal notification appears, go to the next
step.

## Inspect resources deployed by the assignment

The assignment creates the resource group _TestingBPLocks_ and the storage account deployed by the
Resource Manager template artifact. The new resource group and the selected lock state are shown on
the assignment details page.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Assigned blueprints** page on the left. Use the filters to find the
   **assignment-locked-storageaccount-TestingBPLocks** blueprint assignment, and then select it.

   From this page, we can see that the assignment succeeded and that the resources were deployed
   with the new blueprint lock state. If the assignment is updated, the **Assignment operation**
   drop-down shows details about the deployment of each definition version. You can select the
   resource group to open the property page.

1. Select the **TestingBPLocks** resource group.

1. Select the **Access control (IAM)** page on the left. Then select the **Role assignments** tab.

   Here we see that the _assignment-locked-storageaccount-TestingBPLocks_ blueprint assignment has
   the _Owner_ role. It has this role because this role was used to deploy and lock the resource
   group.

1. Select the **Deny assignments** tab.

   The blueprint assignment created a
   [deny assignment](../../../role-based-access-control/deny-assignments.md) on the deployed
   resource group to enforce the **Read Only** blueprint lock mode. The deny assignment prevents
   someone with appropriate rights on the **Role assignments** tab from taking specific actions. The
   deny assignment affects _All principals_.

   For information about excluding a principal from a deny assignment, see
   [blueprints resource locking](../concepts/resource-locking.md#exclude-a-principal-from-a-deny-assignment).

1. Select the deny assignment, and then select the **Denied Permissions** page on the left.

   The deny assignment is preventing all operations with the **\*** and **Action** configuration,
   but it allows read access by excluding **\*/read** via **NotActions**.

1. In the Azure portal breadcrumb, select **TestingBPLocks - Access control (IAM)**. Then select
   the **Overview** page on the left and then the **Delete resource group** button. Enter the name
   **TestingBPLocks** to confirm the delete and then select **Delete** at the bottom of the pane.

   The portal notification **Delete resource group TestingBPLocks failed** appears. The error states
   that although your account has permission to delete the resource group, access is denied by the
   blueprint assignment. Remember that we selected the **Read Only** blueprint lock mode during
   blueprint assignment. The blueprint lock prevents an account with permission, even _Owner_, from
   deleting the resource. For more information, see
   [blueprints resource locking](../concepts/resource-locking.md).

These steps show that our deployed resources are now protected with blueprint locks that prevent
unwanted deletion, even from an account that has permission to delete the resources.

## Unassign the blueprint

The last step is to remove the assignment of the blueprint definition. Removing the assignment
doesn't remove the associated artifacts.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Assigned blueprints** page on the left. Use the filters to find the
   **assignment-locked-storageaccount-TestingBPLocks** blueprint assignment, and then select it.

1. Select **Unassign blueprint** at the top of the page. Read the warning in the confirmation dialog
   box, and then select **OK**.

   When the blueprint assignment is removed, the blueprint locks are also removed. The resources can
   once again be deleted by an account with appropriate permissions.

1. Select **Resource groups** from the Azure menu, and then select **TestingBPLocks**.

1. Select the **Access control (IAM)** page on the left and then select the **Role assignments** tab.

The security for the resource group shows that the blueprint assignment no longer has _Owner_
access.

After the **Removing blueprint assignment succeeded** portal notification appears, go to the next
step.

## Clean up resources

When you're finished with this tutorial, delete these resources:

- Resource group _TestingBPLocks_
- Blueprint definition _locked-storageaccount_

## Next steps

In this tutorial, you've learned how to protect new resources deployed with Azure Blueprints. To
learn more about Azure Blueprints, continue to the blueprint lifecycle article.

> [!div class="nextstepaction"]
> [Learn about the blueprint lifecycle](../concepts/lifecycle.md)