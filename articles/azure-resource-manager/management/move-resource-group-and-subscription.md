---
title: Move Azure resources to a new resource group or subscription
description: Learn how to move resources to a new resource group or subscription, and understand the steps to ensure a successful move operation.
ms.topic: conceptual
ms.date: 02/11/2025
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template, devx-track-python
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
---

# Move Azure resources to a new resource group or subscription

This article explains how to move Azure resources between resource groups within the same subscription or across different subscriptions. If the move involves different subscriptions, both subscriptions must be part of the same Microsoft Entra ID tenant. You can use tools like the [Azure portal](#use-the-azure-portal), [Azure PowerShell](#use-azure-powershell), [Azure CLI](#use-the-azure-cli), the [REST API](#use-rest-api), or [Python](#use-python) to move the resources.

During the move operation, both the source and target resource groups are locked. You can't create, delete, or update resources within these resource groups while the move is in progress. However, existing resources remain fully operational. For example, if you move a virtual machine from one resource group to another, you can't delete it or modify its properties (such as its size) during the move. Despite this restriction, the virtual machine continues to operate normally, and services relying on it don't experience any downtime. The lock can last up to four hours. Most moves are completed faster, and the lock is removed accordingly.

Only top-level (parent) resources should be specified in the move request. Child resources move automatically with their parent but can't be moved independently. For example, you can move a parent resource like `Microsoft.Compute/virtualMachines`, and its child resource such as `Microsoft.Compute/virtualMachines/extensions` moves with it. However, you can't move the child resource on its own.

While moving a resource preserves its dependencies with child resources, dependencies with other resources can break and might need to be configured again. Moving a resource only changes its associated resource group and doesn't alter the physical region of the resource.

> [!NOTE]  
> Azure resources can't be moved if a read-only lock exists on the source, destination resource group, or subscription.

## Changed resource ID

When you move a resource, you change its resource ID. The standard format for a resource ID is `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}`. When you move a resource to a new resource group or subscription, you change one or more values in that path.

If you use the resource ID anywhere, change that value. For example, if you have a [custom dashboard](/azure/azure-portal/quickstart-portal-dashboard-azure-cli) in the portal that references a resource ID, update that value. Look for any scripts or templates that need to be updated for the new resource ID.

## Checklist before moving resources

Some important steps precede moving a resource. You can avoid errors if you verify these conditions.

1. The source and destination subscriptions must be active. If you have trouble enabling an account that's disabled, [create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request). Select **Subscription Management** for the issue type.

1. The source and destination subscriptions must exist within the same [Microsoft Entra tenant](../../active-directory/develop/quickstart-create-new-tenant.md). Use the Azure CLI or PowerShell to check that both subscriptions have the same tenant ID.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    az account show --subscription <your-source-subscription> --query tenantId
    az account show --subscription <your-destination-subscription> --query tenantId
    ```

    # [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    (Get-AzSubscription -SubscriptionName <your-source-subscription>).TenantId
    (Get-AzSubscription -SubscriptionName <your-destination-subscription>).TenantId
    ```

    ---

    If the tenant IDs for the source and destination subscriptions don't match, use the following methods to reconcile them:

    - [Transfer billing ownership of an Azure subscription](../../cost-management-billing/manage/billing-subscription-transfer.md#transfer-billing-ownership-of-an-azure-subscription).
    - [Associate or add an Azure subscription to your Microsoft Entra tenant](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).

1. To move resources to or from a Cloud Solution Provider (CSP) partner, see [Transfer Azure subscriptions between subscribers and CSPs](../../cost-management-billing/manage/transfer-subscriptions-subscribers-csp.yml).

1. The resources you want to move must support the move operation. For a list of which resources support move operations, see [Azure resource types for move operations](move-support-resources.md).

1. Some services have specific limitations or requirements when moving resources. Check the following move guidance before moving resources within these services:

- If you're using Azure Stack Hub, you can't move resources between groups.
    - [Azure App Services](./move-limitations/app-service-move-limitations.md)
    - [Azure DevOps Services](/azure/devops/organizations/billing/change-azure-subscription?toc=/azure/azure-resource-manager/toc.json)
    - [Classic deployment model](./move-limitations/classic-model-move-limitations.md) for classic compute, storage, virtual networks, and cloud services
    - [Cloud Services (extended support)](./move-limitations/classic-model-move-limitations.md)
    - [Networking](./move-limitations/networking-move-limitations.md)
    - [Azure Recovery Services](../../backup/backup-azure-move-recovery-services-vault.md?toc=/azure/azure-resource-manager/toc.json)
    - [Virtual machines](./move-limitations/virtual-machines-move-limitations.md)
    - To move an Azure subscription to a new management group, see [Move subscriptions](../../governance/management-groups/manage.md#move-management-groups-and-subscriptions).

1. The destination subscription must be registered for the resource provider of the resource you're moving. If it's not, you receive an error stating that the **subscription isn't registered for a resource type**. You might see this error when moving a resource to a new subscription, but you didn't previously use the resource type in the subscription.

    # [Azure CLI](#tab/azure-cli)

    To get the registration status:

    ```azurecli-interactive
    az account set -s <destination-subscription-name-or-id>
    az provider list --query "[].{Provider:namespace, Status:registrationState}" --out table
    ```

    To register a resource provider:

    ```azurecli-interactive
    az provider register --namespace Microsoft.Batch
    ```

    # [Azure PowerShell](#tab/azure-powershell)

    To get the registration status:

    ```azurepowershell-interactive
    Set-AzContext -Subscription <destination-subscription-name-or-id>
    Get-AzResourceProvider -ListAvailable | Select-Object ProviderNamespace, RegistrationState
    ```

    To register a resource provider:

    ```azurepowershell-interactive
    Register-AzResourceProvider -ProviderNamespace Microsoft.Batch
    ```

    ---

1. Before starting a move operation, check the subscription quota for the subscription to which you're moving resources. Verify if you can request an increase in a quota that would cause a destination subscription to exceed its limit. For detailed guidance about limits and how to request an increase, see [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md).

1. The account moving the resources must have at least the following permissions:

    - At the source resource group: **Microsoft.Resources/subscriptions/resourceGroups/moveResources/action**
    - At the destination resource group: **Microsoft.Resources/subscriptions/resourceGroups/write**

1. If you move a resource with an active Azure role assignment (or its child resource with this same assignment), the role assignment doesn't move and becomes orphaned. You must create the role assignment again after the move. Although the system automatically removes the orphaned role assignment, we recommend that you remove it before the move.

    To learn more about how to manage role assignments, see [List Azure role assignments](../../role-based-access-control/role-assignments-list-portal.yml#list-role-assignments-at-a-scope) and [Assign Azure roles](../../role-based-access-control/role-assignments-portal.yml).

1. **For a move across subscriptions, the resource and its dependent resources must be located in the same resource group and they must be moved together.** For example, a virtual machine with managed disks requires you to move the virtual machine, managed disks, and other dependent resources together.

    If you're moving a resource to a new subscription, check if the resource has any dependent resources and if they're located in the same resource group. If the resources aren't in the same resource group, check if you can combine them into the same resource group. If you can, use one move operation across resource groups to consolidate all the resources into the same resource group.

    For more information, see [Scenario for move across subscriptions](#scenario-for-moving-across-subscriptions).

## Scenario for moving across subscriptions

Moving resources from one subscription to another is a three-step process. To illustrate these steps, the following diagram depicts only one dependent resource:

:::image type="content" source="./media/move-resource-group-and-subscription/cross-subscription-move-scenario.png" alt-text="Diagram that shows the three-step process of moving resources across subscriptions." border="false":::

- Step 1: If dependent resources are distributed across different resource groups, first move them into one resource group.
- Step 2: Move the resource and dependent resources together from the source subscription to the target subscription.
- Step 3: Optionally, redistribute the dependent resources to different resource groups within the target subscription.

## Move resources

### Use the Azure portal

1. To move resources, select the resource group that contains those resources.

1. Select the resources that you want to move. To move all of the resources, select the checkbox at the top of list. Or, select resources individually.

   :::image type="content" source="./media/move-resource-group-and-subscription/select-resources-to-move.png" alt-text="Screenshot of the Azure portal showing the selection of resources to move.":::

1. Select the **Move** button.

   :::image type="content" source="./media/move-resource-group-and-subscription/select-move.png" alt-text="Screenshot of the Azure portal displaying the Move button with three options.":::

    This button gives you three options:

    - Move to a new resource group.
    - Move to a new subscription.
- Move to a new region. To change regions, see [Move resources across regions (from resource group) with Azure Resource Mover](../../resource-mover/move-region-within-resource-group.md?toc=/azure/azure-resource-manager/management/toc.json).

1. Select if you're moving the resources to a new resource group or subscription.

1. The source resource group sets automatically. Specify the destination resource group. If you're moving to a new subscription, specify this option. Select **Next**.

   :::image type="content" source="./media/move-resource-group-and-subscription/select-destination-group.png" alt-text="Screenshot of the Azure portal where the user specifies the destination resource group for the move operation.":::

1. The portal validates that the resources can be moved. Wait for validation to complete.

:::image type="content" source="./media/move-resource-group-and-subscription/validation.png" alt-text="Screenshot of the Azure portal showing the validation process for the move operation.":::

1. When validation completes successfully, select **Next**.

1. Acknowledge that you need to update tools and scripts for these resources. To start moving the resources, select **Move**.

:::image type="content" source="./media/move-resource-group-and-subscription/acknowledge-change.png" alt-text="Screenshot of the Azure portal where the user acknowledges the need to update tools and scripts before starting the move operation.":::

1. The Azure portal notifies you when the move completes.

:::image type="content" source="./media/move-resource-group-and-subscription/view-notification.png" alt-text="Screenshot of the Azure portal displaying a notification with the results of the move operation.":::

### Use the Azure CLI

#### Validate

To test your move scenario without actually moving resources in real time, use the [`az resource invoke-action`](/cli/azure/resource#az-resource-invoke-action) command. Use this command only when you need to model the results without following through. To run this operation, you need the resource ID of the source resource group, target resource group, and each resource that you're moving.

Use `\"` to escape double quotes in the body of the request.

```azurecli
az resource invoke-action --action validateMoveResources \
  --ids "/subscriptions/{subscription-id}/resourceGroups/{source-rg}" \
  --request-body "{  \"resources\": [\"/subscriptions/{subscription-id}/resourceGroups/{source-rg}/providers/{resource-provider}/{resource-type}/{resource-name}\", \"/subscriptions/{subscription-id}/resourceGroups/{source-rg}/providers/{resource-provider}/{resource-type}/{resource-name}\", \"/subscriptions/{subscription-id}/resourceGroups/{source-rg}/providers/{resource-provider}/{resource-type}/{resource-name}\"],\"targetResourceGroup\":\"/subscriptions/{subscription-id}/resourceGroups/{destination-rg}\" }" 
```

If validation passes, you see:

```azurecli
{} Finished .. 
```

If validation fails, you see an error message that explains why you can't move the resources.

#### Move

To move existing resources to another resource group or subscription, use the [`az resource move`](/cli/azure/resource#az-resource-move) command. In the `--ids` parameter, provide a space-separated list of the resource IDs to move.

The following commands show how to move several resources to a new resource group. They work with the Azure CLI in a Bash terminal or in an Azure PowerShell console. To move resources to a new subscription, provide the `--destination-subscription-id` parameter.

# [Azure CLI](#tab/azure-cli)

```azurecli
webapp=$(az resource show -g OldRG -n ExampleSite --resource-type "Microsoft.Web/sites" --query id --output tsv)
plan=$(az resource show -g OldRG -n ExamplePlan --resource-type "Microsoft.Web/serverfarms" --query id --output tsv)
az resource move --destination-group newgroup --ids $webapp $plan
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$webapp=$(az resource show -g OldRG -n ExampleSite --resource-type "Microsoft.Web/sites" --query id --output tsv)
$plan=$(az resource show -g OldRG -n ExamplePlan --resource-type "Microsoft.Web/serverfarms" --query id --output tsv)
az resource move --destination-group newgroup --ids $webapp $plan
```

---

### Use Azure PowerShell

#### Validate

To test your move scenario without actually moving resources in real time, use the [`Invoke-AzResourceAction`](/powershell/module/az.resources/invoke-azresourceaction) command in Azure PowerShell. Use this command only when you need to model the results without following through.

```azurepowershell
$sourceName = "sourceRG"
$destinationName = "destinationRG"
$resourcesToMove = @("app1", "app2")

$sourceResourceGroup = Get-AzResourceGroup -Name $sourceName
$destinationResourceGroup = Get-AzResourceGroup -Name $destinationName

$resources = Get-AzResource -ResourceGroupName $sourceName | Where-Object { $_.Name -in $resourcesToMove }

Invoke-AzResourceAction -Action validateMoveResources `
  -ResourceId $sourceResourceGroup.ResourceId `
  -Parameters @{
  resources = $resources.ResourceId;  # Wrap in an @() array if providing a single resource ID string.
  targetResourceGroup = $destinationResourceGroup.ResourceId
  }
```

An output doesn't display if the validation succeeds. However, if the validation fails, an error message explains why you can't move the resources.

#### Move

To move existing resources to another resource group or subscription, use the [Move-AzResource](/powershell/module/az.resources/move-azresource) command. The following example shows how to move several resources to a new resource group.

```azurepowershell-interactive
$sourceName = "sourceRG"
$destinationName = "destinationRG"
$resourcesToMove = @("app1", "app2")

$resources = Get-AzResource -ResourceGroupName $sourceName | Where-Object { $_.Name -in $resourcesToMove }

Move-AzResource -DestinationResourceGroupName $destinationName -ResourceId $resources.ResourceId
```

To move to a new subscription, include a value for the `DestinationSubscriptionId` parameter.

### Use Python

#### Validate

To test your move scenario without actually moving resources in real time, use the [`ResourceManagementClient.resources.begin_validate_move_resources`](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.resourcesoperations#azure-mgmt-resource-resources-v2022-09-01-operations-resourcesoperations-begin-validate-move-resources) method. Use this method only when you need to model the results without following through.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

source_name = "sourceRG"
destination_name = "destinationRG"
resources_to_move = ["app1", "app2"]

destination_resource_group = resource_client.resource_groups.get(destination_name)

resources = [
  resource for resource in resource_client.resources.list_by_resource_group(source_name)
  if resource.name in resources_to_move
]

resource_ids = [resource.id for resource in resources]

validate_move_resources_result = resource_client.resources.begin_validate_move_resources(
  source_name,
  {
  "resources": resource_ids,
  "target_resource_group": destination_resource_group.id
  }
).result()

print("Validate move resources result: {}".format(validate_move_resources_result))
```

An output doesn't display if the validation succeeds. However, if the validation fails, an error message explains why you can't move the resources.

#### Move

To move existing resources to another resource group or subscription, use the [`ResourceManagementClient.resources.begin_move_resources`](/python/api/azure-mgmt-resource/azure.mgmt.resource.resources.v2022_09_01.operations.resourcesoperations#azure-mgmt-resource-resources-v2022-09-01-operations-resourcesoperations-begin-move-resources) method in Python. The following example shows how to move several resources to a new resource group.

```python
import os
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient

credential = AzureCliCredential()
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

resource_client = ResourceManagementClient(credential, subscription_id)

source_name = "sourceRG"
destination_name = "destinationRG"
resources_to_move = ["app1", "app2"]

destination_resource_group = resource_client.resource_groups.get(destination_name)

resources = [
  resource for resource in resource_client.resources.list_by_resource_group(source_name)
  if resource.name in resources_to_move
]

resource_ids = [resource.id for resource in resources]

resource_client.resources.begin_move_resources(
  source_name,
  {
  "resources": resource_ids,
  "target_resource_group": destination_resource_group.id
  }
)
```

### Use REST API

#### Validate

The [`validate move operation`](/rest/api/resources/resources/validate-move-resources) operation tests your move scenario without actually moving resources. Use this operation to check if the move can succeed. Validation is automatically called when you send a move request. Use this operation only when you need to model the results without following through. To run this operation, you need the:

- Name of the source resource group
- Resource ID of the target resource group
- Resource ID of each resource to move
- The [access token](/rest/api/azure/#acquire-an-access-token) for your account

Send the following request:

```HTTP
POST https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<source-group>/validateMoveResources?api-version=2019-05-10
Authorization: Bearer <access-token>
Content-type: application/json
```

With a request body:

```json
{
 "resources": ["<resource-id-1>", "<resource-id-2>"],
 "targetResourceGroup": "/subscriptions/<subscription-id>/resourceGroups/<target-group>"
}
```

If the request is formatted correctly, the operation returns:

```HTTP
Response Code: 202
cache-control: no-cache
pragma: no-cache
expires: -1
location: https://management.azure.com/subscriptions/<subscription-id>/operationresults/<operation-id>?api-version=2018-02-01
retry-after: 15
...
```

A **202** status code indicates that the validation request was accepted, but it hasn't yet determined if the move operation will succeed. The `location` value contains a URL that you use to check the status of the long-running operation.

To check the status, send the following request:

```HTTP
GET <location-url>
Authorization: Bearer <access-token>
```

You continue to receive a **202** status code while the operation runs. Wait the number of seconds indicated in the `retry-after` value before trying again. You receive a **204** status code if the move validation succeeds. If the move validation fails, you receive an error message that resembles:

```json
{"error":{"code":"ResourceMoveProviderValidationFailed","message":"<message>"...}}
```

#### Move

To move existing resources to another resource group or subscription, use the [`Move resources`](/rest/api/resources/resources/moveresources) operation.

```HTTP
POST https://management.azure.com/subscriptions/{source-subscription-id}/resourcegroups/{source-resource-group-name}/moveResources?api-version={api-version}
```

Specify the target resource group and resources to move in the body of the request.

```json
{
 "resources": ["<resource-id-1>", "<resource-id-2>"],
 "targetResourceGroup": "/subscriptions/<subscription-id>/resourceGroups/<target-group>"
}
```

## Frequently asked questions

**My resource move operation that usually takes a few minutes is running for almost an hour. Is something wrong?**

Moving a resource is a complex operation with different phases. It can involve more than just the resource provider of the resource you're trying to move. Azure Resource Manager allows a move operation four hours to finish because of the dependencies between resource providers. This duration gives them time to recover from transient issues. If your move request is within the four-hour period, the operation keeps trying to complete and might succeed. The operation locks the source and destination resource groups during this time to avoid consistency issues.

**Why is my resource group locked for four hours during resource move?**

- Move operations are allowed four hours to complete. The operation locks the source and destination resource groups during this time to prevent them from being modified.

- There are two phases in a move request. Resources move during the first phase, and resource providers that depend on the resources being moved are notified during the second phase. A resource group can be locked for all four hours when a resource provider fails either phase. Resource Manager initiates any failed steps during the span of the move operation.

- Resource Manager unlocks both resource groups if a resource doesn't move within four hours. Resources that move successfully are in the destination resource group. Resources that fail to move remain in the source resource group.

**What are the implications of the source and destination resource groups being locked during the resource move?**

The lock prevents you from deleting either resource group. The lock also prevents you from creating a new resource, deleting a resource, or updating a resource's properties within each resource group (for example, changing a virtual machine's size).

The following image shows an error message from the Azure portal when you try to delete a resource group that's part of an ongoing move:

:::image type="content" source="./media/move-resource-group-and-subscription/move-error-delete.png" alt-text="Screenshot of the Azure portal showing an error message when trying to delete a resource group involved in an ongoing move operation.":::

In the preceding image, the virtual machine resource belongs to a resource group ("TestB") that's currently undergoing a move operation. When you attempt to update a virtual machine's property (such as its size), the Azure portal returns an error message. This error occurs because the resource group is locked during the move, which protects its resources from being modified.

:::image type="content" source="./media/move-resource-group-and-subscription/move-error-delete-2.png" alt-text="Screenshot of the Azure portal showing an error message when a user tries to update a property (virtual machine size) of the virtual machine.":::

Additionally, the source and the destination resource groups can't participate in other move operations simultaneously during a resource move. For example, if you're moving resources from resource group A to resource group B, both resource group A and resource group B can't be involved in another move operation at the same time. You can't simultaneously move resources to or from resource group C. This restriction prevents multiple conflicting operations from locking resource groups during the move process.

**What does the error code "MissingMoveDependentResources" mean?**

When you move a resource, its dependent resources must exist in the destination resource group or subscription, or be included in the move request. You get the **MissingMoveDependentResources** error code when a dependent resource doesn't meet this requirement. The error message provides details about the dependent resource that you need to include in the move request.

For example, moving a virtual machine could require moving seven resource types with three different resource providers. Those resource providers and types are:

- Microsoft.Compute
  - virtualMachines
  - disks

- Microsoft.Network
  - networkInterfaces
  - publicIPAddresses
  - networkSecurityGroups
  - virtualNetworks

- Microsoft.Storage
  - storageAccounts

Another common example involves moving a virtual network where you might have to move several other resources associated with that virtual network. The move request could require moving public IP addresses, route tables, virtual network gateways, network security groups, and other resources. A virtual network gateway should be in the same resource group as its virtual network since they can't move separately.

**What does the error code "RequestDisallowedByPolicy" mean?**

Resource Manager validates your move request before attempting a move. This validation includes checking policies defined for the resources involved in the move. For example, the validation fails when you're attempting to move a key vault but your organization has a policy to deny creating a key vault in the target resource group. The returned error code is **RequestDisallowedByPolicy**.

For more information about policies, see [What is Azure Policy?](../../governance/policy/overview.md).

**Why can't I move some resources in Azure?**

Not all Azure resources allow move operations.

**How many resources can I move in one operation?**

Separate large moves into different move operations when possible. Resource Manager immediately returns an error when there are more than 800 resources in a single operation. However, moving fewer than 800 resources can also fail by timing out.

**What is the meaning of the error that a resource isn't in a "succeeded" state?**

When you get an error message indicating that you can't move a resource because it isn't in a **Succeeded** state, it might be because a dependent resource is blocking the move. Typically, the error code is **MoveCannotProceedWithResourcesNotInSucceededState**.

If the source or target resource group contains a virtual network, the states of all resources that depend on that virtual network are checked during the move. This check includes resources that directly and indirectly depend on the network. The move is blocked if any resources aren't in a succeeded state. For example, if a virtual machine using a virtual network that doesn't report a succeeded state, the move is blocked. The move is blocked even when the virtual machine isn't one of the resources being moved. The move is also blocked even when the virtual machine isn't in the source or destination resource group.

To resolve this issue, move your resources to a resource group that doesn't have a virtual network or [contact support](/azure/azure-portal/supportability/how-to-create-azure-support-request).

**Can I move a resource group to a different subscription?**

No, you can't move a resource group to a new subscription. But, you can move all resources in a resource group to a resource group in another subscription. Settings such as tags, role assignments, and policies don't transfer automatically from the original resource group to the destination resource group. You need to apply these settings manually to the new resource group. 

## Next steps

To verify which Azure resources support move operations, see [Move operation support for resources](move-support-resources.md).
