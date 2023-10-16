---
title: Remediation options for machine configuration
description: Azure Policy's machine configuration feature offers options for continuous remediation or control using remediation tasks.
ms.date: 04/18/2023
ms.topic: how-to
---
# Remediation options for machine configuration

[!INCLUDE [Machine configuration rename banner](../includes/banner.md)]

Before you begin, it's a good idea to read the overview page for [machine configuration][01].

> [!IMPORTANT]
> The machine configuration extension is required for Azure virtual machines. To deploy the
> extension at scale across all machines, assign the following policy initiative:
> `Deploy prerequisites to enable guest configuration policies on virtual machines`
>
> To use machine configuration packages that apply configurations, Azure VM guest configuration
> extension version 1.26.24 or later, or Arc agent 1.10.0 or later, is required.
>
> Custom machine configuration policy definitions using `AuditIfNotExists` as well as
> `DeployIfNotExists` are in Generally Available (GA) support status.

## How machine configuration manages remediation (Set)

Machine configuration uses the policy effect [DeployIfNotExists][02] for definitions that deliver
changes inside machines. Set the properties of a policy assignment to control how [evaluation][03]
delivers configurations automatically or on-demand.

[A video walk-through of this document is available][04].

### Machine configuration assignment types

There are three available assignment types when guest assignments are created. The property is
available as a parameter of machine configuration definitions that support `DeployIfNotExists`.

|    Assignment type    |                                                                                       Behavior                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Audit`               | Report on the state of the machine, but don't make changes.                                                                                                                           |
| `ApplyAndMonitor`     | Applied to the machine once and then monitored for changes. If the configuration drifts and becomes `NonCompliant`, it isn't automatically corrected unless remediation is triggered. |
| `ApplyAndAutoCorrect` | Applied to the machine. If it drifts, the local service inside the machine makes a correction at the next evaluation.                                                                 |

When a new policy assignment is assigned to an existing machine, a guest assignment is
automatically created to audit the state of the configuration first. The audit gives you
information you can use to decide which machines need remediation.

## Remediation on-demand (ApplyAndMonitor)

By default, machine configuration assignments operate in a remediation on demand scenario. The
configuration is applied and then allowed to drift out of compliance.

The compliance status of the guest assignment is `Compliant` unless either:

- An error occurs while applying the configuration
- If the machine is no longer in the desired state during the next evaluation

When either of those conditions are met, the agent reports the status as `NonCompliant` and doesn't
automatically remediate.

To enable this behavior, set the [assignmentType property][05] of the machine configuration
assignment to `ApplyandMonitor`. Each time the assignment is processed within the machine, the
agent reports `Compliant` for each resource when the [Test][06] method returns `$true` or
`NonCompliant` if the method returns `$false`.

## Continuous remediation (autocorrect)

Machine configuration supports the concept of _continuous remediation_. If the machine drifts out
of compliance for a configuration, the next time it's evaluated the configuration is corrected
automatically. Unless an error occurs, the machine always reports status as `Compliant` for the
configuration. There's no way to report when a drift was automatically corrected when using
continuous remediation.

To enable this behavior, set the [assignmentType property][05] of the machine configuration
assignment to `ApplyandAutoCorrect`. Each time the assignment is processed within the machine, the
[Set][07] method runs automatically for each resource the [Test][06] method returns `false`.

## Disable remediation

When the **assignmentType** property is set to `Audit`, the agent only performs an audit of the
machine and doesn't try to remediate the configuration if it isn't compliant.

### Disable remediation of custom content

You can override the assignment type property for custom content packages by adding a tag to the
machine with name **CustomGuestConfigurationSetPolicy** and value `disable`. Adding the tag
disables remediation for custom content packages only, not for built-in content provided by
Microsoft.

## Azure Policy enforcement

Azure Policy assignments include a required property [Enforcement Mode][08] that determines
behavior for new and existing resources. Use this property to control whether configurations are
automatically applied to machines.

By default, enforcement is set to `Enabled`. Azure Policy automatically applies the configuration
when a new machine is deployed. It also applies the configuration when the properties of a machine
in the scope of an Azure Policy assignment with a policy in the category `Guest Configuration` is
updated. Update operations include actions that occur in Azure Resource Manager, like adding or
changing a tag. Update operations also include changes for virtual machines like resizing or
attaching a disk.

Leave enforcement enabled if the configuration should be remediated when changes occur to the
machine resource in Azure. Changes happening inside the machine don't trigger automatic remediation
as long as they don't change the machine resource in Azure Resource Manager.

If enforcement is set to `Disabled`, the configuration assignment audits the state of the machine
until a [remediation task][09] changes the behavior. By default, machine configuration definitions
update the [assignmentType property][05] from `Audit` to `ApplyandMonitor` so the configuration is
applied one time and then it isn't applied again until a remediation is triggered.

## Optional: Remediate all existing machines

If an Azure Policy assignment is created from the Azure portal, on the "Remediation" tab a checkbox
labeled "Create a remediation task" is available. When the box is checked, after the policy
assignment is created remediation tasks automatically correct any resources that evaluate to
`NonCompliant`.

The effect of this setting for machine configuration is that you can deploy a configuration across
many machines by assigning a policy. You don't also have to run the remediation task manually for
machines that aren't compliant.

## Manually trigger remediation outside of Azure Policy

You can orchestrate remediation outside of the Azure Policy experience by updating a
guest assignment resource, even if the update doesn't make changes to the resource properties.

When a machine configuration assignment is created, the [complianceStatus property][10] is set to
`Pending`. The machine configuration service requests a list of assignments every 5 minutes. If the
machine configuration assignment's **complianceStatus** is `Pending` and its **configurationMode**
is `ApplyandMonitor` or `ApplyandAutoCorrect`, the service in the machine applies the
configuration.

After the configuration is applied, the configuration mode dictates whether the behavior is to only
report on compliance status and allow drift or to automatically correct.

## Understanding combinations of settings

|          ~           |        Audit        |                                      ApplyandMonitor                                      |                                           ApplyandAutoCorrect                                           |
| -------------------- | ------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Enforcement Enabled  | Only reports status | Configuration applied on VM Create and reapplied on Update but otherwise allowed to drift | Configuration applied on VM Create, reapplied on Update, and corrected on next interval if drift occurs |
| Enforcement Disabled | Only reports status | Configuration applied but allowed to drift                                                | Configuration applied on VM Create or Update and corrected on next interval if drift occurs             |

## Next steps

- Read the [machine configuration overview][01].
- Set up a custom machine configuration package [development environment][11].
- [Create a package artifact][12] for machine configuration.
- [Test the package artifact][13] from your development environment.
- Use the **GuestConfiguration** module to [create an Azure Policy definition][14] for at-scale
  management of your environment.
- [Assign your custom policy definition][15] using Azure portal.
- Learn how to view [compliance details for machine configuration][16] policy assignments.

<!-- Reference link definitions -->
[01]: ./overview.md
[02]: ../policy/concepts/effects.md#deployifnotexists
[03]: ../policy/concepts/effects.md#deployifnotexists-evaluation
[04]: https://youtu.be/rjAk1eNmDLk
[05]: /rest/api/guestconfiguration/guest-configuration-assignments/get#assignmenttype
[06]: /powershell/dsc/resources/get-test-set#test
[07]: /powershell/dsc/resources/get-test-set#set
[08]: ../policy/concepts/assignment-structure.md#enforcement-mode
[09]: ../policy/how-to/remediate-resources.md
[10]: /rest/api/guestconfiguration/guest-configuration-assignments/get#compliancestatus
[11]: ./how-to-set-up-authoring-environment.md
[12]: ./how-to-create-package.md
[13]: ./how-to-test-package.md
[14]: ./how-to-create-policy-definition.md
[15]: ../policy/assign-policy-portal.md
[16]: ../policy/how-to/determine-non-compliance.md
