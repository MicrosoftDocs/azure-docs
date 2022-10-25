---
title: "Quickstart: New policy assignment with Python"
description: In this quickstart, you use Python to create an Azure Policy assignment to identify non-compliant resources.
ms.date: 10/01/2021
ms.topic: quickstart
ms.custom: devx-track-python
---
# Quickstart: Create a policy assignment to identify non-compliant resources using Python

The first step in understanding compliance in Azure is to identify the status of your resources. In
this quickstart, you create a policy assignment to identify virtual machines that aren't using
managed disks. When complete, you'll identify virtual machines that are _non-compliant_.

The Python library is used to manage Azure resources from the command line or in scripts. This guide
explains how to use Python library to create a policy assignment.

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Add the Policy library

To enable Python to work with Azure Policy, the library must be added. This library works wherever
Python can be used, including [bash on Windows 10](/windows/wsl/install-win10) or locally installed.

1. Check that the latest Python is installed (at least **3.8**). If it isn't yet installed, download
   it at [Python.org](https://www.python.org/downloads/).

1. Check that the latest Azure CLI is installed (at least **2.5.1**). If it isn't yet installed, see
   [Install the Azure CLI](/cli/azure/install-azure-cli).

   > [!NOTE]
   > Azure CLI is required to enable Python to use the **CLI-based authentication** in the following
   > examples. For information about other options, see
   > [Authenticate using the Azure management libraries for Python](/azure/developer/python/sdk/authentication-overview).

1. Authenticate through Azure CLI.

   ```azurecli
   az login
   ```

1. In your Python environment of choice, install the required libraries for Azure Policy:

   ```bash
   # Add the Python library for Python
   pip install azure-mgmt-policyinsights

   # Add the Resources library for Python
   pip install azure-mgmt-resource

   # Add the CLI Core library for Python for authentication (development only!)
   pip install azure-cli-core

   # Add the Azure identity library for Python
   pip install azure.identity
   ```

   > [!NOTE]
   > If Python is installed for all users, these commands must be run from an elevated console.

1. Validate that the libraries have been installed. `azure-mgmt-policyinsights` should be **0.5.0**
   or higher, `azure-mgmt-resource` should be **9.0.0** or higher, and `azure-cli-core` should be
   **2.5.0** or higher.

   ```bash
   # Check each installed library
   pip show azure-mgmt-policyinsights azure-mgmt-resource azure-cli-core azure.identity
   ```

## Create a policy assignment

In this quickstart, you create a policy assignment and assign the **Audit VMs that do not use
managed disks** (`06a78e20-9358-41c9-923c-fb736d382a4d`) definition. This policy definition
identifies resources that aren't compliant to the conditions set in the policy definition.

Run the following code to create a new policy assignment:

```python
# Import specific methods and models from other libraries
from azure.mgmt.resource.policy import PolicyClient
from azure.mgmt.resource.policy.models import PolicyAssignment, Identity, UserAssignedIdentitiesValue, PolicyAssignmentUpdate
from azure.identity import AzureCliCredential

# Set subscription
subId = "{subId}"
assignmentLocation = "westus2"

# Get your credentials from Azure CLI (development only!) and get your subscription list
credential = AzureCliCredential()
policyClient = PolicyClient(credential, subId, base_url=none)

# Create details for the assignment
policyAssignmentIdentity = Identity(type="SystemAssigned")
policyAssignmentDetails = PolicyAssignment(display_name="Audit VMs without managed disks Assignment", policy_definition_id="/providers/Microsoft.Authorization/policyDefinitions/06a78e20-9358-41c9-923c-fb736d382a4d", description="Shows all virtual machines not using managed disks", identity=policyAssignmentIdentity, location=assignmentLocation)

# Create new policy assignment
policyAssignment = policyClient.policy_assignments.create("{scope}", "audit-vm-manageddisks", policyAssignmentDetails)

# Show results
print(policyAssignment)
```

The preceding commands use the following information:

Assignment details:
- **subId** - Your subscription. Needed for authentication. Replace `{subId}` with your
  subscription.
- **display_name** - Display name for the policy assignment. In this case, you're using _Audit VMs
  without managed disks Assignment_.
- **policy_definition_id** - The policy definition path, based on which you're using to create the
  assignment. In this case, it's the ID of policy definition _Audit VMs that do not use managed
  disks_. In this example, the policy definition is a built-in and the path doesn't include
  management group or subscription information.
- **scope** - A scope determines what resources or grouping of resources the policy assignment gets
  enforced on. It could range from a management group to an individual resource. Be sure to replace
  `{scope}` with one of the following patterns:
  - Management group: `/providers/Microsoft.Management/managementGroups/{managementGroup}`
  - Subscription: `/subscriptions/{subscriptionId}`
  - Resource group: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}`
  - Resource: `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/[{parentResourcePath}/]`
- **description** - A deeper explanation of what the policy does or why it's assigned to this scope.

Assignment creation:

- Scope - This scope determines where the policy assignment gets saved. The scope set in the
  assignment details must exist within this scope.
- Name - The actual name of the assignment. For this example, _audit-vm-manageddisks_ was used.
- Policy assignment - The Python **PolicyAssignment** object created in the previous step.

You're now ready to identify non-compliant resources to understand the compliance state of your
environment.

## Identify non-compliant resources

Use the following information to identify resources that aren't compliant with the policy assignment
you created. Run the following code:

```python
# Import specific methods and models from other libraries
from azure.mgmt.policyinsights._policy_insights_client import PolicyInsightsClient
from azure.mgmt.policyinsights.models import QueryOptions
from azure.identity import AzureCliCredential

# Set subscription
subId = "{subId}"

# Get your credentials from Azure CLI (development only!) and get your subscription list
credential = AzureCliCredential()
policyClient = PolicyInsightsClient(credential, subId, base_url=none)

# Set the query options
queryOptions = QueryOptions(filter="IsCompliant eq false and PolicyAssignmentId eq 'audit-vm-manageddisks'",apply="groupby((ResourceId))")

# Fetch 'latest' results for the subscription
results = policyInsightsClient.policy_states.list_query_results_for_subscription(policy_states_resource="latest", subscription_id=subId, query_options=queryOptions)

# Show results
print(results)
```

Replace `{subId}` with the subscription you want to see the compliance results for this policy
assignment. For a list of other scopes and ways to summarize the data, see
[Policy State methods](/python/api/azure-mgmt-policyinsights/azure.mgmt.policyinsights.operations.policystatesoperations#methods).

Your results resemble the following example:

```output
{
    'additional_properties': {
        '@odata.nextLink': None
    },
    'odatacontext': 'https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.PolicyInsights/policyStates/$metadata#latest',
    'odatacount': 12,
    'value': [{data}]
}
```

The results match what you see in the **Resource compliance** tab of a policy assignment in the
Azure portal view.

## Clean up resources

To remove the assignment created, use the following command:

```python
# Import specific methods and models from other libraries
from azure.mgmt.resource.policy import PolicyClient
from azure.identity import AzureCliCredential

# Set subscription
subId = "{subId}"

# Get your credentials from Azure CLI (development only!) and get your subscription list
credential = AzureCliCredential()
policyClient = PolicyClient(credential, subId, base_url=none)

# Delete the policy assignment
policyAssignment = policyClient.policy_assignments.delete("{scope}", "audit-vm-manageddisks")

# Show results
print(policyAssignment)
```

Replace `{subId}` with your subscription and `{scope}` with the same scope you used to create the
policy assignment.

## Next steps

In this quickstart, you assigned a policy definition to identify non-compliant resources in your
Azure environment.

To learn more about assigning policy definitions to validate that new resources are compliant,
continue to the tutorial for:

> [!div class="nextstepaction"]
> [Creating and managing policies](./tutorials/create-and-manage.md)
