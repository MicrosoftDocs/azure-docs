---
title: Remediation options for machine configuration
description: Azure Policy's machine configuration feature offers options for continuous remediation or control using remediation tasks.
author: timwarner-msft
ms.date: 07/25/2022
ms.topic: how-to
ms.author: timwarner
ms.service: machine-configuration
---
# Remediation options for machine configuration

[!INCLUDE [Machine config rename banner](../includes/banner.md)]

Before you begin, it's a good idea to read the overview page for
[machine configuration](./overview.md).

> [!IMPORTANT]
> The machine configuration extension is required for Azure virtual machines. To
> deploy the extension at scale across all machines, assign the following policy
> initiative: `Deploy prerequisites to enable guest configuration policies on
> virtual machines`
>
> To use machine configuration packages that apply configurations, Azure VM guest
> configuration extension version **1.29.24** or later,
> or Arc agent **1.10.0** or later, is required.
>
> Custom machine configuration policy definitions using **AuditIfNotExists** 
> as well as **DeployIfNotExists** are now Generally Available. 

## How remediation (Set) is managed by machine configuration

Machine configuration uses the policy effect
[DeployIfNotExists](../policy/concepts/effects.md#deployifnotexists)
for definitions that deliver changes inside machines.
Set the properties of a policy assignment to control how
[evaluation](../policy/concepts/effects.md#deployifnotexists-evaluation)
delivers configurations automatically or on-demand.

[A video walk-through of this document is available](https://youtu.be/rjAk1eNmDLk).

### Machine configuration assignment types

There are three available assignment types when guest assignments are created.
The property is available as a parameter of machine configuration definitions
that support **DeployIfNotExists**.

| Assignment type | Behavior |
|-|-|
| Audit | Report on the state of the machine, but don't make changes. |
| ApplyandMonitor | Applied to the machine once and then monitored for changes. If the configuration drifts and becomes NonCompliant, it won't be automatically corrected unless remediation is triggered. |
| ApplyandAutoCorrect | Applied to the machine. If it drifts, the local service inside the machine makes a correction at the next evaluation. |

In each of the three assignment types, when a new policy assignment is assigned
to an existing machine, a guest assignment is automatically created to
audit the state of the configuration first, providing information to make
decisions about which machines need remediation.

## Remediation on-demand (ApplyAndMonitor)

By default, machine configuration assignments operates in a "remediation on
demand" scenario. The configuration is applied and then allowed to drift out of
compliance. The compliance status of the guest assignment is "Compliant"
unless an error occurs while applying the configuration or if during the next
evaluation the machine is no longer in the desired state. The agent reports
the status as "NonCompliant" and doesn't automatically remediate.

To enable this behavior, set the
[assignmentType property](/rest/api/guestconfiguration/guest-configuration-assignments/get#assignmenttype)
of the machine configuration assignment to "ApplyandMonitor". Each time the
assignment is processed within the machine, for each resource the
[Test](/powershell/dsc/resources/get-test-set#test)
method returns "true" the agent reports "Compliant"
or if the method returns "false" the agent reports "NonCompliant".

## Continuous remediation (AutoCorrect)

Machine configuration supports the concept of "continuous remediation". If the machine drifts out of compliance for a configuration, the next time it's evaluated the configuration is corrected automatically. Unless an error occurs, the machine always reports status as "Compliant" for the configuration. There's no way to report when a drift was automatically corrected when using continuous remediation.

To enable this behavior, set the
[assignmentType property](/rest/api/guestconfiguration/guest-configuration-assignments/get#assignmenttype)
of the machine configuration assignment to "ApplyandAutoCorrect". Each time the
assignment is processed within the machine, for each resource the
[Test](/powershell/dsc/resources/get-test-set#test)
method returns "false", the
[Set](/powershell/dsc/resources/get-test-set#set)
method runs automatically.

## Disable remediation

When the `assignmentType` property is set to "Audit", the agent only
performs an audit of the machine and doesn't attempt to remediate the configuration
if it isn't compliant.

### Disable remediation of custom content

You can override the assignment type property for custom content packages by
adding a tag to the machine with name **CustomGuestConfigurationSetPolicy** and
value **disable**. Adding the tag disables remediation for custom content
packages only, not for built-in content provided by Microsoft.

## Azure Policy enforcement

Azure Policy assignments include a required property
[Enforcement Mode](../policy/concepts/assignment-structure.md#enforcement-mode)
that determines behavior for new and existing resources.
Use this property to control whether configurations are automatically applied to
machines.

**By default, enforcement is "Enabled"**. When a new machine is deployed **or the
properties of a machine are updated**, if the machine is in the scope of an Azure
Policy assignment with a policy definition in the category "Guest
Configuration", Azure Policy automatically applies the configuration. **Update
operations include actions that occur in Azure Resource Manager** such as adding
or changing a tag, and for virtual machines, changes such as resizing or
attaching a disk. Leave enforcement enabled if the configuration should be
remediated when changes occur to the machine resource in Azure. Changes
happening inside the machine don't trigger automatic remediation as long as they
don't change the machine resource in Azure Resource Manager.

If enforcement is set to "Disabled", the configuration assignment
audits the state of the machine until the behavior is changed by a
[remediation task](../policy/how-to/remediate-resources.md). By default, machine configuration
definitions update the
[assignmentType property](/rest/api/guestconfiguration/guest-configuration-assignments/get#assignmenttype) from "Audit" to "ApplyandMonitor" so the configuration
is applied one time and then it won't apply again until a remediation is
triggered.

## OPTIONAL: Remediate all existing machines

If an Azure Policy assignment is created from the Azure portal, on the
"Remediation" tab a checkbox is available "Create a remediation task". When the
box is checked, after the policy assignment is created any resources that
evaluate to "NonCompliant" is automatically be corrected by remediation tasks.

The effect of this setting for machine configuration is that you can deploy a
configuration across many machines simply by assigning a policy. You won't
also have to run the remediation task manually for machines that aren't
compliant.

## Manually trigger remediation outside of Azure Policy

It's also possible to orchestrate remediation outside of the Azure Policy
experience by updating a guest assignment resource, even if the update
doesn't make changes to the resource properties.

When a machine configuration assignment is created, the
[complianceStatus property](/rest/api/guestconfiguration/guest-configuration-assignments/get#compliancestatus)
is set to "Pending".
The machine configuration service inside the machine (delivered to Azure
virtual machines by the
[Guest configuration extension](./overview.md)
and included with Arc-enabled servers) requests a list of assignments every 5
minutes.
If the machine configuration assignment has both requirements, a
`complianceStatus` of "Pending" and a `configurationMode` of either
"ApplyandMonitor" or "ApplyandAutoCorrect", the service in the machine
applies the configuration. After the configuration is applied, at the
[next interval](./overview.md)
the configuration mode dictates whether the behavior is to only report on
compliance status and allow drift or to automatically correct.

## Understanding combinations of settings

|~| Audit | ApplyandMonitor | ApplyandAutoCorrect |
|-|-|-|-|
| Enforcement Enabled | Only reports status | Configuration applied on VM Create **and re-applied on Update** but otherwise allowed to drift | Configuration applied on VM Create and reapplied on Update and corrected on next interval if drift occurs |
| Enforcement Disabled | Only reports status | Configuration applied but allowed to drift | Configuration applied on VM Create or Update and corrected on next interval if drift occurs |

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
