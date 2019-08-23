---
title: Sample - Audit if applications aren't installed inside Linux VMs
description: This sample Policy Guest Configuration initiative and definitions audit if the specified applications are not installed inside Linux virtual machines.
author: DCtheGeek
manager: carmonm
ms.service: azure-policy
ms.topic: sample
ms.date: 05/02/2019
ms.author: dacoulte
---
# Sample - Audit if specified applications aren't installed inside Linux VMs

This Policy Guest Configuration initiative creates an audit event when the specified applications
aren't installed inside Linux virtual machines. The ID of this built-in initiative is
`/providers/Microsoft.Authorization/policySetDefinitions/c937dcb4-4398-4b39-8d63-4a6be432252e`.

> [!IMPORTANT]
> All Guest Configuration initiatives are composed of **audit** and **deployIfNotExists** policy
> definitions. Assigning only one of the policy definitions cause Guest Configuration not to work
> correctly.

You can assign this sample using:

- The [Azure portal](#azure-portal)
- [Azure PowerShell](#azure-powershell)

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Components of the initiative

This [Guest Configuration](../concepts/guest-configuration.md) initiative is made up of the
following policies:

- [audit](#audit-definition) - Audit when applications aren't installed inside Linux VMs
  - ID: `/providers/Microsoft.Authorization/policyDefinitions/fee5cb2b-9d9b-410e-afe3-2902d90d0004`
- [deployIfNotExists](#deployIfNotExists-definition) - Deploy VM extension to audit when
  applications aren't installed inside Linux VMs
  - ID: `/providers/Microsoft.Authorization/policyDefinitions/4d1c04de-2172-403f-901b-90608c35c721`

### Initiative definition

The initiative is created by joining the **audit** and **deployIfNotExists** definitions together
and the [initiative Parameters](#initiative-parameters). This is the JSON of the definition.

[!code-json[initiative-definition](../../../../policy-templates/samples/GuestConfiguration/installed-application-linux/azurepolicyset.json "Initiative definition (JSON)")]

### Initiative parameters

|Name |Type |Description |
|---|---|---|
|applicationName |String |Application names. Example: 'python', 'powershell', or a comma-separated list such as 'python,powershell'. Use \* for wildcard matching, like 'power\*'. |

When creating an assignment via PowerShell or Azure CLI, the parameter values can be passed as JSON
in either a string or via a file using `-PolicyParameter` (PowerShell) or `--params` (Azure CLI).
PowerShell also supports `-PolicyParameterObject` which requires passing the cmdlet a Name/Value
hashtable where **Name** is the parameter name and **Value** is the single value or array of values
being passed during assignment.

In this example parameter, the installation of applications _python_ and _powershell_ is audited.

```json
{
    "applicationName": {
        "value": "python,powershell"
    }
}
```

Only the **deployIfNotExists** policy definition makes use of the initiative parameters.

### audit definition

The JSON defining the rules of the **audit** policy definition.

[!code-json[audit-definition](../../../../policy-templates/samples/GuestConfiguration/installed-application-linux/audit/azurepolicy.rules.json "audit policy rules (JSON)")]

### deployIfNotExists definition

The JSON defining the rules of the **deployIfNotExists** policy definition.

[!code-json[deployIfNotExists-definition](../../../../policy-templates/samples/GuestConfiguration/installed-application-linux/deployIfNotExists/azurepolicy.rules.json "deployIfNotExists policy rules (JSON)")]

The **deployIfNotExists** policy definition defines the Azure images the policy has been validated
on:

|Publisher |Offer |SKU |
|-|-|-|
|OpenLogic |CentOS\* |All except 6\* |
|RedHat |RHEL |All except 6\* |
|RedHat |osa | All |
|credativ |Debian | All except 7\* |
|Suse |SLES\* |All except 11\* |
|Canonical| UbuntuServer |All except 12\* |
|microsoft-dsvm |linux-data-science-vm-ubuntu |All |
|microsoft-dsvm |azureml |All |
|cloudera |cloudera-centos-os |All except 6\* |
|cloudera |cloudera-altus-centos-os |All |
|microsoft-ads |linux\* |All |
|microsoft-aks |All |All |
|AzureDatabricks |All |All |
|qubole-inc |All |All |
|datastax |All |All |
|couchbase |All |All |
|scalegrid |All |All |
|checkpoint |All |All |
|paloaltonetworks |All |All |

The **deployment** portion of the rule passes the _installedApplication_ parameter to the Guest
Configuration agent on the virtual machine. This configuration enables the agent to perform the
validations and report compliance back through the **audit** policy definition.

## Azure portal

After the **audit** and **deployIfNotExists** definitions are created in the portal, it's
recommended to group them into an [initiative](../concepts/definition-structure.md#initiatives) for
assignment.

### Create copy of audit definition

[![Deploy the Policy sample to Azure](https://azuredeploy.net/deploybutton.png)](https://portal.azure.com/?#blade/Microsoft_Azure_Policy/CreatePolicyDefinitionBlade/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-policy%2Fmaster%2Fsamples%2FGuestConfiguration%2Finstalled-application-linux%2Faudit%2Fazurepolicy.json)
[![Deploy the Policy sample to Azure Gov](https://docs.microsoft.com/azure/governance/policy/media/deploy/deployGovbutton.png)](https://portal.azure.us/?#blade/Microsoft_Azure_Policy/CreatePolicyDefinitionBlade/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-policy%2Fmaster%2Fsamples%2FGuestConfiguration%2Finstalled-application-linux%2Faudit%2Fazurepolicy.json)

Using these buttons to deploy via the portal creates a copy of the **audit** policy definition.
Without the paired **deployIfNotExists** policy definition, the Guest Configuration won't work
correctly.

### Create copy of deployIfNotExists definition

[![Deploy the Policy sample to Azure](https://azuredeploy.net/deploybutton.png)](https://portal.azure.com/?#blade/Microsoft_Azure_Policy/CreatePolicyDefinitionBlade/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-policy%2Fmaster%2Fsamples%2FGuestConfiguration%2Finstalled-application-linux%2FdeployIfNotExists%2Fazurepolicy.json)
[![Deploy the Policy sample to Azure Gov](https://docs.microsoft.com/azure/governance/policy/media/deploy/deployGovbutton.png)](https://portal.azure.us/?#blade/Microsoft_Azure_Policy/CreatePolicyDefinitionBlade/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-policy%2Fmaster%2Fsamples%2FGuestConfiguration%2Finstalled-application-linux%2FdeployIfNotExists%2Fazurepolicy.json)

Using these buttons to deploy via the portal creates a copy of the **deployIfNotExists** policy
definition. Without the paired **audit** policy definition, the Guest Configuration won't work
correctly.

## Azure PowerShell

[!INCLUDE [sample-powershell-install](../../../../includes/sample-powershell-install-no-ssh-az.md)]

### Deploy with Azure PowerShell

#### Copy and assign the initiative

These steps create a copy of the initiative that includes the built-in policies for both **audit**
and **deployIfNotExists** and assigns the initiative to a resource group.

```azurepowershell-interactive
# Create the policy initiative (Subscription scope)
$initDef = New-AzPolicySetDefinition -Name 'guestconfig-installed-application-linux' -DisplayName 'GuestConfig - Audit that an application is installed inside Linux VMs' -description 'This initiative will both deploy the policy requirements and audit that the specified application is installed inside Linux virtual machines.' -Policy 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/GuestConfiguration/installed-application-linux/azurepolicyset.definitions.json' -Parameter 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/GuestConfiguration/installed-application-linux/azurepolicyset.parameters.json' -Mode All

# Set the scope to a resource group; may also be a resource, subscription, or management group
$scope = Get-AzResourceGroup -Name 'YourResourceGroup'

# Set the initiative parameter (JSON format)
$initParam = '{ "applicationName": { "value": "python,powershell" } }'

# Create the initiative assignment
$assignment = New-AzPolicyAssignment -Name 'guestconfig-installed-application-linux-assignment' -DisplayName 'GuestConfig - Python and PowerShell apps on Linux' -Scope $scope.ResourceID -PolicySetDefinition $initDef -PolicyParameter $initParam -AssignIdentity -Location 'westus2'

# Get the system-assigned managed identity created by the assignment with -AssignIdentity
$saIdentity = $assignment.Identity.principalId

# Give the system-assigned managed identity the 'Contributor' role on the scope (needed by deployIfNotExists)
$roleAssignment = New-AzRoleAssignment -ObjectId $saIdentity -Scope $scope.ResourceId -RoleDefinitionName 'Contributor'
```

Run the following commands to remove the previous assignment and definition:

```azurepowershell-interactive
# Remove the initiative assignment
Remove-AzPolicyAssignment -Id $assignment.ResourceId

# Remove the 'Contributor' role from the system-assigned managed identity
Remove-AzRoleAssignment -ObjectId $saIdentity -Scope $scope.ResourceId -RoleDefinitionName 'Contributor'

# Remove the initiative definition
Remove-AzPolicySetDefinition -Id $initDef
```

#### Copy and assign the audit definition

These steps create a copy of the **audit** definition and assign it to a resource group. This
definition will not work correctly without the paired **deployIfNotExists** definition also being
assigned.

```azurepowershell-interactive
# Create the policy definition (Subscription scope)
$definition = New-AzPolicyDefinition -Name 'guestconfig-installed-application-linux-audit' -DisplayName 'GuestConfig - Audit that an application is installed inside Linux VMs' -description 'This policy audits that the specified application is installed inside Linux virtual machines. This policy should only be used along with its corresponding deploy policy in an initiative/policy set.' -Policy 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/GuestConfiguration/installed-application-linux/audit/azurepolicy.rules.json' -Mode All

# Set the scope to a resource group; may also be a resource, subscription, or management group
$scope = Get-AzResourceGroup -Name 'YourResourceGroup'

# Create the policy assignment
$assignment = New-AzPolicyAssignment -Name 'guestconfig-installed-application-linux-audit-assignment' -DisplayName 'GuestConfig - Python and PowerShell apps on Linux' -Scope $scope.ResourceID -PolicyDefinition $definition
```

Run the following commands to remove the previous assignment and definition:

```azurepowershell-interactive
# Remove the policy definition
Remove-AzPolicyAssignment -Id $assignment.ResourceId

# Remove the policy definition
Remove-AzPolicyDefinition -Id $definition
```

#### Copy and assign the deployIfNotExists definition

These steps create a copy of the **deployIfNotExists** definition and assign it to a resource group.
This definition will not work correctly without the paired **audit** definition also being assigned.

```azurepowershell-interactive
# Create the policy definition (Subscription scope)
$definition = New-AzPolicyDefinition -Name 'guestconfig-installed-application-linux-deployIfNotExists' -DisplayName 'GuestConfig - Deploy VM extension to audit that an application is installed inside Linux VMs' -description 'Include this rule to deploy the VM extension for Microsoft Guest Configuration, the VM extension for Microsoft Azure Managed Service Identity, and the content required to audit that an application is installed inside Linux virtual machines. This policy should only be used along with its corresponding audit policy in an initiative/policy set.' -Policy 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/GuestConfiguration/installed-application-linux/deployIfNotExists/azurepolicy.rules.json' -Parameter 'https://raw.githubusercontent.com/Azure/azure-policy/master/samples/GuestConfiguration/installed-application-linux/deployIfNotExists/azurepolicy.parameters.json' -Mode All

# Set the scope to a resource group; may also be a resource, subscription, or management group
$scope = Get-AzResourceGroup -Name 'YourResourceGroup'

# Set the definition parameter (JSON format)
$policyParam  = '{ "applicationName": { "value": "python,powershell" } }'

# Create the policy assignment
$assignment = New-AzPolicyAssignment -Name 'guestconfig-installed-application-linux-deployIfNotExists-assignment' -DisplayName 'GuestConfig - Deploy VM extension to audit that Python and PowerShell are installed inside Linux VMs' -Scope $scope.ResourceID -PolicyDefinition $definition -PolicyParameter $policyParam -AssignIdentity -Location 'westus2'

# Get the system-assigned managed identity created by the assignment with -AssignIdentity
$saIdentity = $assignment.Identity.principalId

# Give the system-assigned managed identity the 'Contributor' role on the scope (needed by deployIfNotExists)
$roleAssignment = New-AzRoleAssignment -ObjectId $saIdentity -Scope $scope.ResourceId -RoleDefinitionName 'Contributor'
```

Run the following commands to remove the previous assignment and definition:

```azurepowershell-interactive
# Remove the policy assignment
Remove-AzPolicyAssignment -Id $assignment.ResourceId

# Remove the 'Contributor' role from the system-assigned managed identity
Remove-AzRoleAssignment -ObjectId $saIdentity -Scope $scope.ResourceId -RoleDefinitionName 'Contributor'

# Remove the policy definition
Remove-AzPolicyDefinition -Id $definition
```

### Azure PowerShell explanation

The deploy and remove scripts use the following commands. Each command in the following table links
to command-specific documentation:

| Command | Notes |
|---|---|
| [New-AzPolicySetDefinition](/powershell/module/az.resources/New-AzPolicySetDefinition) | Creates an Azure Policy initiative. |
| [New-AzPolicyDefinition](/powershell/module/az.resources/New-AzPolicyDefinition) | Creates an Azure Policy definition. |
| [Get-AzResourceGroup](/powershell/module/az.resources/Get-AzResourceGroup) | Gets a single resource group. |
| [New-AzPolicyAssignment](/powershell/module/az.resources/New-AzPolicyAssignment) | Creates a new Azure Policy assignment for an initiative or definition. |
| [New-AzRoleAssignment](/powershell/module/az.resources/New-AzRoleAssignment) | Gives an existing role assignment to the specific principal. |
| [Remove-AzPolicyAssignment](/powershell/module/az.resources/Remove-AzPolicyAssignment) | Removes an existing Azure Policy assignment. |
| [Remove-AzPolicySetDefinition](/powershell/module/az.resources/Remove-AzPolicySetDefinition) | Removes an initiative. |
| [Remove-AzPolicyDefinition](/powershell/module/az.resources/Remove-AzPolicyDefinition) | Removes a definition. |

## Next steps

- Review additional [Azure Policy samples](index.md).
- Learn more about [Azure Policy Guest Configuration](../concepts/guest-configuration.md).
- Review [Azure Policy definition structure](../concepts/definition-structure.md).
