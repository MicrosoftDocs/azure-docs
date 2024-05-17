---
title: "Quickstart: Create policy assignment with REST API"
description: In this quickstart, you use REST API to create an Azure Policy assignment to identify non-compliant resources.
ms.date: 03/26/2024
ms.topic: quickstart
---

# Quickstart: Create a policy assignment to identify non-compliant resources with REST API

The first step in understanding compliance in Azure is to identify the status of your resources. In this quickstart, you create a policy assignment to identify non-compliant resources using REST API. The policy is assigned to a resource group and audits virtual machines that don't use managed disks. After you create the policy assignment, you identify non-compliant virtual machines.

This guide uses REST API to create a policy assignment and to identify non-compliant resources in your Azure environment. The examples in this article use PowerShell and the Azure CLI `az rest` commands. You can also run the `az rest` commands from a Bash shell like Git Bash.

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Latest version of [PowerShell](/powershell/scripting/install/installing-powershell) or a Bash shell like Git Bash.
- Latest version of [Azure CLI](/cli/azure/install-azure-cli).
- [Visual Studio Code](https://code.visualstudio.com/).
- A resource group with at least one virtual machine that doesn't use managed disks.

## Review the REST API syntax

There are two elements to run REST API commands: the REST API URI and the request body. For information, go to [Policy Assignments - Create](/rest/api/policy/policy-assignments/create).

The following example shows the REST API URI syntax to create a policy definition.

```http
PUT https://management.azure.com/{scope}/providers/Microsoft.Authorization/policyAssignments/{policyAssignmentName}?api-version=2023-04-01
```

- `scope`: A scope determines which resources or group of resources the policy assignment gets
  enforced on. It could range from a management group to an individual resource. Replace
  `{scope}` with one of the following patterns:
  - Management group: `/providers/Microsoft.Management/managementGroups/{managementGroup}`
  - Subscription: `/subscriptions/{subscriptionId}`
  - Resource group: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}`
  - Resource: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/[{parentResourcePath}/]{resourceType}/{resourceName}`
- `policyAssignmentName`: Creates the policy assignment name for your assignment. The name is included in the policy assignment's `policyAssignmentId` property.

The following example is the JSON to create a request body file.

```json
{
  "properties": {
    "displayName": "",
    "description": "",
    "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/11111111-1111-1111-1111-111111111111",
    "nonComplianceMessages": [
      {
        "message": ""
      }
    ]
  }
}
```

- `displayName`: Display name for the policy assignment.
- `description`: Can be used to add context about the policy assignment.
- `policyDefinitionId`: The policy definition ID that to create the assignment.
- `nonComplianceMessages`: Set the message to use when a resource is evaluated as non-compliant. For more information, see [assignment non-compliance messages](./concepts/assignment-structure.md#non-compliance-messages).

## Connect to Azure

From a Visual Studio Code terminal session, connect to Azure. If you have more than one subscription, run the commands to set context to your subscription. Replace `<subscriptionID>` with your Azure subscription ID.

```azurecli
az login

# Run these commands if you have multiple subscriptions
az account list --output table
az account set --subscription <subscriptionID>
```

Use `az login` even if you're using PowerShell because the examples use Azure CLI [az rest](/cli/azure/reference-index#az-rest) commands.

## Create a policy assignment

In this example, you create a policy assignment and assign the [Audit VMs that do not use managed disks](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMRequireManagedDisk_Audit.json) definition.

A request body is needed to create the assignment. Save the following JSON in a file named _request-body.json_.

```json
{
  "properties": {
    "displayName": "Audit VM managed disks",
    "description": "Policy assignment to resource group scope created with REST API",
    "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d",
    "nonComplianceMessages": [
      {
        "message": "Virtual machines should use managed disks"
      }
    ]
  }
}
```

To create your policy assignment in an existing resource group scope, use the following REST API URI with a file for the request body. Replace `{subscriptionId}` and `{resourceGroupName}` with your values. The command displays JSON output in your shell.

```azurepowershell
az rest --method put --uri https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/policyAssignments/audit-vm-managed-disks?api-version=2023-04-01 --body `@request-body.json
```

In PowerShell, the backtick (``` ` ```) is needed to escape the `at sign` (`@`) to specify a filename. In a Bash shell like Git Bash, omit the backtick.

For information, go to [Policy Assignments - Create](/rest/api/policy/policy-assignments/create).

## Identify non-compliant resources

The compliance state for a new policy assignment takes a few minutes to become active and provide results about the policy's state. You use REST API to display the non-compliant resources for this policy assignment and the output is in JSON.

To identify non-compliant resources, run the following command. Replace `{subscriptionId}` and `{resourceGroupName}` with your values used when you created the policy assignment.

```azurepowershell
az rest --method post --uri https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.PolicyInsights/policyStates/latest/queryResults?api-version=2019-10-01 --uri-parameters `$filter="complianceState eq 'NonCompliant' and PolicyAssignmentName eq 'audit-vm-managed-disks'"
```

The `filter` queries for resources that are evaluated as non-compliant with the policy definition named _audit-vm-managed-disks_ that you created with the policy assignment. Again, notice the backtick is used to escape the dollar sign (`$`) in the filter. For a Bash client, a backslash (`\`) is a common escape character.

Your results resemble the following example:

```json
{
  "@odata.context": "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest",
  "@odata.count": 1,
  "@odata.nextLink": null,
  "value": [
    {
      "@odata.context": "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest/$entity",
      "@odata.id": null,
      "complianceReasonCode": "",
      "complianceState": "NonCompliant",
      "effectiveParameters": "",
      "isCompliant": false,
      "managementGroupIds": "",
      "policyAssignmentId": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.authorization/policyassignments/audit-vm-managed-disks",
      "policyAssignmentName": "audit-vm-managed-disks",
      "policyAssignmentOwner": "tbd",
      "policyAssignmentParameters": "",
      "policyAssignmentScope": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}",
      "policyAssignmentVersion": "",
      "policyDefinitionAction": "audit",
      "policyDefinitionCategory": "tbd",
      "policyDefinitionGroupNames": [
        ""
      ],
      "policyDefinitionId": "/providers/microsoft.authorization/policydefinitions/06a78e20-9358-41c9-923c-fb736d382a4d",
      "policyDefinitionName": "06a78e20-9358-41c9-923c-fb736d382a4d",
      "policyDefinitionReferenceId": "",
      "policyDefinitionVersion": "1.0.0",
      "policySetDefinitionCategory": "",
      "policySetDefinitionId": "",
      "policySetDefinitionName": "",
      "policySetDefinitionOwner": "",
      "policySetDefinitionParameters": "",
      "policySetDefinitionVersion": "",
      "resourceGroup": "{resourceGroupName}",
      "resourceId": "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/microsoft.compute/virtualmachines/{vmName}>",
      "resourceLocation": "westus3",
      "resourceTags": "tbd",
      "resourceType": "Microsoft.Compute/virtualMachines",
      "subscriptionId": "{subscriptionId}",
      "timestamp": "2024-03-26T02:19:28.3720191Z"
    }
  ]
}
```

For more information, go to [Policy States - List Query Results For Resource Group](/rest/api/policy/policy-states/list-query-results-for-resource-group).

## Clean up resources

To remove the policy assignment, use the following command. Replace `{subscriptionId}` and `{resourceGroupName}` with your values used when you created the policy assignment. The command displays JSON output in your shell.

```azurepowershell
az rest --method delete --uri https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/policyAssignments/audit-vm-managed-disks?api-version=2023-04-01
```

You can verify the policy assignment was deleted with the following command. A message is displayed in your shell.

```azurepowershell
az rest --method get --uri https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/policyAssignments/audit-vm-managed-disks?api-version=2023-04-01
```

```output
The policy assignment 'audit-vm-managed-disks' is not found.
```

For more information, go to [Policy Assignments - Delete](/rest/api/policy/policy-assignments/delete) and [Policy Assignments - Get](/rest/api/policy/policy-assignments/get).

## Next steps

In this quickstart, you assigned a policy definition to identify non-compliant resources in your Azure environment.

To learn more about how to assign policies that validate resource compliance, continue to the tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Create and manage policies to enforce compliance](./tutorials/create-and-manage.md)
