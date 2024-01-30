---
title: Understand machine configuration assignment resources
description: Machine configuration creates extension resources named machine configuration assignments that map configurations to machines.
ms.date: 08/10/2023
ms.topic: conceptual
---
# Understand machine configuration assignment resources

[!INCLUDE [Machine configuration rename banner](../includes/banner.md)]

When an Azure Policy is assigned, if it's in the category `Guest Configuration` there's metadata
included to describe a guest assignment.

[A video walk-through of this document is available][01].

You can think of a guest assignment as a link between a machine and an Azure Policy scenario. For
example, the following snippet associates the Azure Windows Baseline configuration with minimum
version `1.0.0` to any machines in scope of the policy.

```json
"metadata": {
    "category": "Guest Configuration",
    "guestConfiguration": {
        "name": "AzureWindowsBaseline",
        "version": "1.*"
    }
  //additional metadata properties exist
}
```

## How Azure Policy uses machine configuration assignments

The machine configuration service uses the metadata information to automatically create an audit
resource for definitions with either `AuditIfNotExists` or `DeployIfNotExists` policy effects. The
resource type is `Microsoft.GuestConfiguration/guestConfigurationAssignments`. Azure Policy uses
the **complianceStatus** property of the guest assignment resource to report compliance status. For
more information, see [getting compliance data][02].

### Deletion of guest assignments from Azure Policy

When an Azure Policy assignment is deleted, if the policy created a machine configuration
assignment, the machine configuration assignment is also deleted.

When an Azure Policy assignment is deleted from an initiative, you need to manually delete any
machine configuration assignments the policy created. You can do so by navigating to the guest
assignments page on Azure portal and deleting the assignment there.

## Manually creating machine configuration assignments

You can create guest assignment resources in Azure Resource Manager by using Azure Policy or any
client SDK.

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

|          Property          |                                                            Description                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **name**                   | Name of the configuration inside the content package MOF file.                                                                    |
| **contentUri**             | HTTPS URI path to the content package (`.zip`).                                                                                   |
| **contentHash**            | A SHA256 hash value of the content package, used to verify it hasn't changed.                                                     |
| **version**                | Version of the content package. Only used for built-in packages and not used for custom content packages.                         |
| **assignmentType**         | Behavior of the assignment. Allowed values: `Audit`, `ApplyandMonitor`, and `ApplyandAutoCorrect`.                                |
| **configurationParameter** | List of DSC resource type, name, and value in the content package MOF file to be overridden after it's downloaded in the machine. |

### Deletion of manually created machine configuration assignments

You must manually delete machine configuration assignments created through any manual approach
(such as an Azure Resource Manager template deployment). Deleting the parent resource (virtual
machine or Arc-enabled machine) also deletes the machine configuration assignment.

To manually delete a machine configuration assignment, use the following example. Make sure to
replace all example strings, indicated by `<>` brackets.

```azurepowershell-interactive
# First get details about the machine configuration assignment
$resourceDetails = @{
  ResourceGroupName = '<resource-group-name>'
  ResourceType      = 'Microsoft.Compute/virtualMachines/providers/guestConfigurationAssignments/'
  ResourceName      = '<vm-name>/Microsoft.GuestConfiguration'
  ApiVersion        = '2020-06-25'
}
$guestAssignment = Get-AzResource @resourceDetails

# Review details of the machine configuration assignment
$guestAssignment

# After reviewing properties of $guestAssignment to confirm
$guestAssignment | Remove-AzResource
```

## Next steps

- Read the [machine configuration overview][03].
- Set up a custom machine configuration package [development environment][04].
- [Create a package artifact][05] for machine configuration.
- [Test the package artifact][06] from your development environment.
- Use the **GuestConfiguration** module to [create an Azure Policy definition][07] for at-scale
  management of your environment.
- [Assign your custom policy definition][08] using Azure portal.
- Learn how to view [compliance details for machine configuration][09] policy assignments.

<!-- Reference link definitions -->
[01]: https://youtu.be/DmCphySEB7A
[02]: ../policy/how-to/get-compliance-data.md
[03]: ./overview.md
[04]: ./how-to-set-up-authoring-environment.md
[05]: ./how-to-create-package.md
[06]: ./how-to-test-package.md
[07]: ./how-to-create-policy-definition.md
[08]: ../policy/assign-policy-portal.md
[09]: ../policy/how-to/determine-non-compliance.md
