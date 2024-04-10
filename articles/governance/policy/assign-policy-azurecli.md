---
title: "Quickstart: Create policy assignment using Azure CLI"
description: In this quickstart, you create an Azure Policy assignment to identify non-compliant resources using Azure CLI.
ms.date: 02/26/2024
ms.topic: quickstart
ms.custom: devx-track-azurecli
---

# Quickstart: Create a policy assignment to identify non-compliant resources using Azure CLI

The first step in understanding compliance in Azure is to identify the status of your resources. In this quickstart, you create a policy assignment to identify non-compliant resources using Azure CLI. The policy is assigned to a resource group and audits virtual machines that don't use managed disks. After you create the policy assignment, you identify non-compliant virtual machines.

Azure CLI is used to create and manage Azure resources from the command line or in scripts. This guide uses Azure CLI to create a policy assignment and to identify non-compliant resources in your Azure environment.

## Prerequisites

- If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli).
- [Visual Studio Code](https://code.visualstudio.com/).
- `Microsoft.PolicyInsights` must be [registered](../../azure-resource-manager/management/resource-providers-and-types.md) in your Azure subscription. To register a resource provider, you must have permission to register resource providers. That permission is included in the Contributor and Owner roles.
- A resource group with at least one virtual machine that doesn't use managed disks.

## Connect to Azure

From a Visual Studio Code terminal session, connect to Azure. If you have more than one subscription, run the commands to set context to your subscription. Replace `<subscriptionID>` with your Azure subscription ID.

```azurecli
az login

# Run these commands if you have multiple subscriptions
az account list --output table
az account set --subscription <subscriptionID>
```

## Register resource provider

When a resource provider is registered, it's available to use in your Azure subscription.

To verify if `Microsoft.PolicyInsights` is registered, run `Get-AzResourceProvider`. The resource provider contains several resource types. If the result is `NotRegistered` run `Register-AzResourceProvider`:

```azurecli
az provider show \
  --namespace Microsoft.PolicyInsights \
  --query "{Provider:namespace,State:registrationState}" \
  --output table

az provider register --namespace Microsoft.PolicyInsights
```

The Azure CLI commands use a backslash (`\`) for line continuation to improve readability. For more information, go to [az provider](/cli/azure/provider).

## Create policy assignment

Use the following commands to create a new policy assignment for your resource group. This example uses an existing resource group that contains a virtual machine _without_ managed disks. The resource group is the scope for the policy assignment. This example uses the built-in policy definition [Audit VMs that do not use managed disks](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMRequireManagedDisk_Audit.json).

Run the following commands and replace `<resourceGroupName>` with your resource group name:

```azurepowershell
rgid=$(az group show --resource-group <resourceGroupName> --query id --output tsv)

definition=$(az policy definition list \
  --query "[?displayName=='Audit VMs that do not use managed disks']".name \
  --output tsv)
```

The `rgid` variable stores the resource group ID. The `definition` variable stores the policy definition's name, which is a GUID.

Run the following command to create the policy assignment:

```azurecli
az policy assignment create \
  --name 'audit-vm-managed-disks' \
  --display-name 'Audit VM managed disks' \
  --scope $rgid \
  --policy $definition \
  --description 'Azure CLI policy assignment to resource group'
```

- `name` creates the policy assignment name used in the assignment's `ResourceId`.
- `display-name` is the name for the policy assignment and is visible in Azure portal.
- `scope` uses the `$rgid` variable to assign the policy to the resource group.
- `policy` assigns the policy definition stored in the `$definition` variable.
- `description` can be used to add context about the policy assignment.

The results of the policy assignment resemble the following example:

```output
"description": "Azure CLI policy assignment to resource group",
"displayName": "Audit VM managed disks",
"enforcementMode": "Default",
"id": "/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.Authorization/policyAssignments/audit-vm-managed-disks",
"identity": null,
"location": null,
"metadata": {
  "createdBy": "11111111-1111-1111-1111-111111111111",
  "createdOn": "2024-02-23T18:42:27.4780803Z",
  "updatedBy": null,
  "updatedOn": null
},
"name": "audit-vm-managed-disks",
```

If you want to redisplay the policy assignment information, run the following command:

```azurecli
az policy assignment show --name "audit-vm-managed-disks" --scope $rgid
```

For more information, go to [az policy assignment](/cli/azure/policy/assignment).

## Identify non-compliant resources

The compliance state for a new policy assignment takes a few minutes to become active and provide results about the policy's state.

Use the following command to identify resources that aren't compliant with the policy assignment
you created:

```azurecli
policyid=$(az policy assignment show \
  --name "audit-vm-managed-disks" \
  --scope $rgid \
  --query id \
  --output tsv)

az policy state list --resource $policyid --filter "(isCompliant eq false)"
```

The `policyid` variable uses an expression to get the policy assignment's ID. The `filter` parameter limits the output to non-compliant resources.

The `az policy state list` output is verbose, but for this article the `complianceState` shows `NonCompliant`:

```output
"complianceState": "NonCompliant",
"components": null,
"effectiveParameters": "",
"isCompliant": false,
```

For more information, go to [az policy state](/cli/azure/policy/state).

## Clean up resources

To remove the policy assignment, run the following command:

```azurecli
az policy assignment delete --name "audit-vm-managed-disks" --scope $rgid
```

To sign out of your Azure CLI session:

```azurecli
az logout
```

## Next steps

In this quickstart, you assigned a policy definition to identify non-compliant resources in your Azure environment.

To learn more about how to assign policies that validate resource compliance, continue to the tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Create and manage policies to enforce compliance](./tutorials/create-and-manage.md)
