---
title: "Quickstart: New policy assignment with Azure CLI"
description: In this quickstart, you use Azure CLI to create an Azure Policy assignment to identify non-compliant resources.
ms.date: 01/11/2020
ms.topic: quickstart
---
# Quickstart: Create a policy assignment to identify non-compliant resources with Azure CLI

The first step in understanding compliance in Azure is to identify the status of your resources.
This quickstart steps you through the process of creating a policy assignment to identify virtual
machines that aren't using managed disks.

At the end of this process, you'll successfully identify virtual machines that aren't using managed
disks. They're _non-compliant_ with the policy assignment.

Azure CLI is used to create and manage Azure resources from the command line or in scripts. This
guide uses Azure CLI to create a policy assignment and to identify non-compliant resources in your
Azure environment.

## Prerequisites

- If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/)
  account before you begin.

- This quickstart requires that you run Azure CLI version 2.0.76 or later to install and use the CLI
  locally. To find the version, run `az --version`. If you need to install or upgrade, see
  [Install Azure CLI](/cli/azure/install-azure-cli).

- Register the Azure Policy Insights resource provider using Azure CLI. Registering the resource
  provider makes sure that your subscription works with it. To register a resource provider, you
  must have permission to the register resource provider operation. This operation is included in
  the Contributor and Owner roles. Run the following command to register the resource provider:

  ```azurecli-interactive
  az provider register --namespace 'Microsoft.PolicyInsights'
  ```

  For more information about registering and viewing resource providers, see
  [Resource Providers and Types](../../azure-resource-manager/management/resource-providers-and-types.md)

- If you haven't already, install the [ARMClient](https://github.com/projectkudu/ARMClient). It's a
  tool that sends HTTP requests to Azure Resource Manager-based APIs.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create a policy assignment

In this quickstart, you create a policy assignment and assign the **Audit VMs that do not use
managed disks** definition. This policy definition identifies resources that aren't compliant to the
conditions set in the policy definition.

Run the following command to create a policy assignment:

```azurecli-interactive
az policy assignment create --name 'audit-vm-manageddisks' --display-name 'Audit VMs without managed disks Assignment' --scope '<scope>' --policy '<policy definition ID>'
```

The preceding command uses the following information:

- **Name** - The actual name of the assignment. For this example, _audit-vm-manageddisks_ was used.
- **DisplayName** - Display name for the policy assignment. In this case, you're using _Audit VMs
  without managed disks Assignment_.
- **Policy** – The policy definition ID, based on which you're using to create the assignment. In
  this case, it's the ID of policy definition _Audit VMs that do not use managed disks_. To get the
  policy definition ID, run this command: `az policy definition list --query "[?displayName=='Audit VMs that do not use managed disks']"`
- **Scope** - A scope determines what resources or grouping of resources the policy assignment gets
  enforced on. It could range from a subscription to resource groups. Be sure to replace
  &lt;scope&gt; with the name of your resource group.

## Identify non-compliant resources

To view the resources that aren't compliant under this new assignment, get the policy assignment ID
by running the following commands:

```azurecli-interactive
az policy assignment list --query "[?displayName=='Audit VMs without managed disks Assignment'].id"
```

For more information about policy assignment IDs, see
[az policy assignment](/cli/azure/policy/assignment).

Next, run the following command to get the resource IDs of the non-compliant resources that are
output into a JSON file:

```console
armclient post "/subscriptions/<subscriptionID>/resourceGroups/<rgName>/providers/Microsoft.PolicyInsights/policyStates/latest/queryResults?api-version=2019-10-01&$filter=IsCompliant eq false and PolicyAssignmentId eq '<policyAssignmentID>'&$apply=groupby((ResourceId))" > <json file to direct the output with the resource IDs into>
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
            "ResourceId": "/subscriptions/<subscriptionName>/resourcegroups/<rgname>/providers/microsoft.compute/virtualmachines/<virtualmachine3ID>"
        }

    ]
}
```

The results are comparable to what you'd typically see listed under **Non-compliant resources** in
the Azure portal view.

## Clean up resources

To remove the assignment created, use the following command:

```azurecli-interactive
az policy assignment delete --name 'audit-vm-manageddisks' --scope '/subscriptions/<subscriptionID>/<resourceGroupName>'
```

## Next steps

In this quickstart, you assigned a policy definition to identify non-compliant resources in your
Azure environment.

To learn more about assigning policies to validate that new resources are compliant, continue to the
tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)