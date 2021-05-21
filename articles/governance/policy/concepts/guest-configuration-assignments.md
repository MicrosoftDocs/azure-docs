---
title: Understand guest configuration assignment resources
description: Guest configuration creates extension resources named guest configuration assignments that map configurations to machines.
ms.date: 08/15/2021
ms.topic: conceptual
---
# Understand guest configuration assignment resources

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

## How guest configuration metadata is used by Azure

The metadata information is used by the guest configuration service to
automatically create an audit resource for definitions with either
**AuditIfNotExists** or **DeployIfNotExists** policy effects. That's how
Azure Policy displays guest configuration results about the current
state and inform decisions about remediation.

## Manually creating guest configuration assignments

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

Guest assignments are created automatically per machine by the guest
configuration service. The resource type is `Microsoft.GuestConfiguration/guestConfigurationAssignments`. Azure Policy uses the **complianceStatus**
property of the guest assignment resource to report compliance status. For more
information, see [getting compliance data](../how-to/get-compliance-data.md).

## Next steps

- Read the [guest configuration overview](./guest-configuration.md).
- Setup a custom guest configuration package [development environment](../how-to/guest-configuration-create-setup.md).
- [Create a package artifact](../how-to/guest-configuration-create.md)
  for guest configuration.
- [Test the package artifact](../how-to/guest-configuration-create-test.md)
  from your development environment.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](../how-to/guest-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../assign-policy-portal.md) using
  Azure portal.
- Learn how to view
  [compliance details for guest configuration](../how-to/determine-non-compliance.md#compliance-details-for-guest-configuration) policy assignments.
