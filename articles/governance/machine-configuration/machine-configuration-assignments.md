---
title: Understand machine configuration assignment resources
description: Machine configuration creates extension resources named machine configuration assignments that map configurations to machines.
author: timwarner-msft
ms.date: 07/15/2022
ms.topic: conceptual
ms.author: timwarner
ms.service: machine-configuration
---
# Understand machine configuration assignment resources

[!INCLUDE [Machine config rename banner](../includes/banner.md)]

When an Azure Policy is assigned, if it's in the category "Guest Configuration"
there's metadata included to describe a guest assignment.

[A video walk-through of this document is available](https://youtu.be/DmCphySEB7A).

You can think of a guest assignment as a link between a machine and an Azure
Policy scenario. For example, the following snippet associates the Azure Windows
Baseline configuration with minimum version `1.0.0` to any machines in scope of
the policy.

```json
"metadata": {
    "category": "Guest Configuration",
    "guestConfiguration": {
        "name": "AzureWindowsBaseline",
        "version": "1.*"
    }
//additional metadata properties exist
```

## How Azure Policy uses machine configuration assignments

The metadata information is used by the machine configuration service to
automatically create an audit resource for definitions with either
**AuditIfNotExists** or **DeployIfNotExists** policy effects. The resource type
is `Microsoft.GuestConfiguration/guestConfigurationAssignments`. Azure Policy
uses the **complianceStatus** property of the guest assignment resource to
report compliance status. For more information, see
[getting compliance data](../policy/how-to/get-compliance-data.md).

### Deletion of guest assignments from Azure Policy

When an Azure Policy assignment is deleted, if a machine configuration assignment
was created by the policy, the machine configuration assignment is also deleted.

When an Azure Policy assignment is deleted from an initiative, if a machine configuration assignment was created by the policy, you will need to manually delete the corresponding machine configuration assignment. This can be done by navigating to the guest assignments page on Azure portal and deleting the assignment there.

## Manually creating machine configuration assignments

Guest assignment resources in Azure Resource Manager can be created by Azure
Policy or any client SDK.

An example deployment template:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "apiVersion": "2021-01-25",
      "type": "Microsoft.Compute/virtualMachines/providers/guestConfigurationAssignments",
      "name": "myMachine/Microsoft.GuestConfiguration/myConfig",
      "location": "westus2",
      "properties": {
        "guestConfiguration": {
          "name": "myConfig",
          "contentUri": "https://mystorageaccount.blob.core.windows.net/mystoragecontainer/myConfig.zip?sv=SASTOKEN",
          "contentHash": "SHA256HASH",
          "version": "1.0.0",
          "assignmentType": "ApplyAndMonitor",
          "configurationParameter": {}
        }
      }
    }
  ]
}
```

The following table describes each property of guest assignment resources.

| Property | Description |
|-|-|
| name | Name of the configuration inside the content package MOF file. |
| contentUri | HTTPS URI path to the content package (.zip). |
| contentHash | A SHA256 hash value of the content package, used to verify it has not changed. |
| version | Version of the content package. Only used for built-in packages and not used for custom content packages. |
| assignmentType | Behavior of the assignment. Allowed values: `Audit`, `ApplyandMonitor`, and `ApplyandAutoCorrect`. |
| configurationParameter | List of DSC resource type, name, and value in the content package MOF file to be overridden after it's downloaded in the machine. |

### Deletion of manually created machine configuration assignments

Machine configuration assignments created through any manual approach (such as
an Azure Resource Manager template deployment) must be deleted manually.
Deleting the parent resource (virtual machine or Arc-enabled machine) will also
delete the machine configuration assignment.

To manually delete a machine configuration assignment, use the following
example. Make sure to replace all example strings, indicated by "\<\>" brackets.

```PowerShell
# First get details about the machine configuration assignment
$resourceDetails = @{
  ResourceGroupName = '<myResourceGroupName>'
  ResourceType      = 'Microsoft.Compute/virtualMachines/providers/guestConfigurationAssignments/'
  ResourceName      = '<myVMName>/Microsoft.GuestConfiguration'
  ApiVersion        = '2020-06-25'
}
$guestAssignment = Get-AzResource @resourceDetails

# Review details of the machine configuration assignment
$guestAssignment

# After reviewing properties of $guestAssignment to confirm
$guestAssignment | Remove-AzResource
```

## Next steps

- Read the [machine configuration overview](./overview.md).
- Setup a custom machine configuration package [development environment](./machine-configuration-create-setup.md).
- [Create a package artifact](./machine-configuration-create.md)
  for machine configuration.
- [Test the package artifact](./machine-configuration-create-test.md)
  from your development environment.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](./machine-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../policy/assign-policy-portal.md) using
  Azure portal.
- Learn how to view
  [compliance details for machine configuration](../policy/how-to/determine-non-compliance.md) policy assignments.
