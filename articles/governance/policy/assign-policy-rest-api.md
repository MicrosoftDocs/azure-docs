---
title: "Quickstart: New policy assignment with REST API"
description: In this quickstart, you use REST API to create an Azure Policy assignment to identify non-compliant resources.
ms.date: 08/17/2021
ms.topic: quickstart
---
# Quickstart: Create a policy assignment to identify non-compliant resources with REST API

The first step in understanding compliance in Azure is to identify the status of your resources.
This quickstart steps you through the process of creating a policy assignment to identify virtual
machines that aren't using managed disks.

At the end of this process, you'll successfully identify virtual machines that aren't using managed
disks. They're _non-compliant_ with the policy assignment.

REST API is used to create and manage Azure resources. This guide uses REST API to create a policy
assignment and to identify non-compliant resources in your Azure environment.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/)
  account before you begin.

- If you haven't already, install [ARMClient](https://github.com/projectkudu/ARMClient). It's a tool
  that sends HTTP requests to Azure Resource Manager-based REST APIs. You can also use the "Try It"
  feature in REST documentation or tooling like PowerShell's
  [Invoke-RestMethod](/powershell/module/microsoft.powershell.utility/invoke-restmethod) or
  [Postman](https://www.postman.com).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create a policy assignment

In this quickstart, you create a policy assignment and assign the **Audit VMs that do not use
managed disks** (`06a78e20-9358-41c9-923c-fb736d382a4d`) definition. This policy definition
identifies resources that aren't compliant to the conditions set in the policy definition.

Run the following command to create a policy assignment:

   - REST API URI

     ```http
     PUT https://management.azure.com/{scope}/providers/Microsoft.Authorization/policyAssignments/audit-vm-manageddisks?api-version=2021-09-01
     ```

   - Request Body

     ```json
     {
       "properties": {
         "displayName": "Audit VMs without managed disks Assignment",
         "description": "Shows all virtual machines not using managed disks",
         "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d",
         "nonComplianceMessages": [
             {
                 "message": "Virtual machines should use a managed disk"
             }
         ]
       }
     }
     ```

The preceding endpoint and request body uses the following information:

REST API URI:
- **Scope** - A scope determines what resources or grouping of resources the policy assignment gets
  enforced on. It could range from a management group to an individual resource. Be sure to replace
  `{scope}` with one of the following patterns:
  - Management group: `/providers/Microsoft.Management/managementGroups/{managementGroup}`
  - Subscription: `/subscriptions/{subscriptionId}`
  - Resource group: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}`
  - Resource: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/[{parentResourcePath}/]{resourceType}/{resourceName}`
- **Name** - The actual name of the assignment. For this example, _audit-vm-manageddisks_ was used.

Request Body:
- **DisplayName** - Display name for the policy assignment. In this case, you're using _Audit VMs
  without managed disks Assignment_.
- **Description** - A deeper explanation of what the policy does or why it's assigned to this scope.
- **policyDefinitionId** - The policy definition ID, based on which you're using to create the
  assignment. In this case, it's the ID of policy definition _Audit VMs that do not use managed
  disks_.
- **nonComplianceMessages** - Set the message seen when a resource is denied due to non-compliance
  or evaluated to be non-compliant. For more information, see
  [assignment non-compliance messages](./concepts/assignment-structure.md#non-compliance-messages).

## Identify non-compliant resources

To view the resources that aren't compliant under this new assignment, run the following command to
get the resource IDs of the non-compliant resources that are output into a JSON file:

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d/providers/Microsoft.PolicyInsights/policyStates/latest/queryResults?api-version=2019-10-01&$filter=IsCompliant eq false and PolicyAssignmentId eq 'audit-vm-manageddisks'&$apply=groupby((ResourceId))"
```

Your results resemble the following example:

```json
{
    "@odata.context": "https://management.azure.com/subscriptions/<subscriptionId>/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest",
    "@odata.count": 3,
    "value": [{
            "@odata.id": null,
            "@odata.context": "https://management.azure.com/subscriptions/<subscriptionId>/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest/$entity",
            "ResourceId": "/subscriptions/<subscriptionId>/resourcegroups/<rgname>/providers/microsoft.compute/virtualmachines/<virtualmachineId>"
        },
        {
            "@odata.id": null,
            "@odata.context": "https://management.azure.com/subscriptions/<subscriptionId>/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest/$entity",
            "ResourceId": "/subscriptions/<subscriptionId>/resourcegroups/<rgname>/providers/microsoft.compute/virtualmachines/<virtualmachine2Id>"
        },
        {
            "@odata.id": null,
            "@odata.context": "https://management.azure.com/subscriptions/<subscriptionId>/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest/$entity",
            "ResourceId": "/subscriptions/<subscriptionName>/resourcegroups/<rgname>/providers/microsoft.compute/virtualmachines/<virtualmachine3Id>"
        }

    ]
}
```

The results are comparable to what you'd typically see listed under **Non-compliant resources** in
the Azure portal view.

## Clean up resources

To remove the assignment created, use the following command:

```http
DELETE https://management.azure.com/{scope}/providers/Microsoft.Authorization/policyAssignments/audit-vm-manageddisks?api-version=2021-09-01
```

Replace `{scope}` with the scope you used when you first created the policy assignment.

## Next steps

In this quickstart, you assigned a policy definition to identify non-compliant resources in your
Azure environment.

To learn more about assigning policies to validate that new resources are compliant, continue to the
tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)
