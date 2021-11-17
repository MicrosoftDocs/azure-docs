---
title: How-to create a guest configuration policy from Group Policy
description: Learn how to convert Group Policy into a policy definition.
ms.date: 03/31/2021
ms.topic: how-to
---
# How-to create a guest configuration policy from Group Policy

Before you begin, it's a good idea to read the overview page for
[guest configuration](../concepts/guest-configuration.md),
and the details about guest configuration policy effects
[How to configure remediation options for guest configuration](../concepts/guest-configuration-policy-effects.md).

> [!IMPORTANT]
> Converting Group Policy to guest configuration is **in preview**. Not all types
> of Group Policy settings have corresponding DSC resources available for
> PowerShell 7.
>
> All of the commands on this page must be run in **Windows PowerShell 5.1**.
> The resulting output MOF files should then be packaged using the
> `GuestConfiguration` module in PowerShell 7.1.3 or later.
> 
> Custom guest configuration policy definitions using **AuditIfNotExists** are
> Generally Available, but definitions using **DeployIfNotExists** with guest
> configuration are **in preview**.
> 
> The guest configuration extension is required for Azure virtual machines. To
> deploy the extension at scale across all machines, assign the following policy
> initiative: `Deploy prerequisites to enable guest configuration policies on
> virtual machines`
>
> Don't use secrets or confidential information in custom content packages.

The open source community has published the module
[BaselineManagement](https://github.com/microsoft/BaselineManagement)
to convert exported
[Group Policy](/support/windows-server/group-policy/group-policy-overview)
templates to PowerShell DSC format. Together with the `GuestConfiguration`
module, you can create a guest configuration package for Windows
from exported Group Policy Objects. The guest configuration package can then
be used to audit or configure servers using local policy, even if they aren't
domain joined.

In this guide, we walk through the process to create an Azure Policy guest
configuration package from a Group Policy Object (GPO).

## Download required PowerShell modules

To install all required modules in PowerShell:

```powershell
Install-Module guestconfiguration
Install-Module baselinemanagement
```

To backup Group Policy Objects (GPOs) from an Active Directory environment,
you need the PowerShell commands available in the Remote Server Administration
Toolkit (RSAT).

To enable RSAT for Group Policy Management Console on Windows 10:

```powerShell
Add-WindowsCapability -Online -Name 'Rsat.GroupPolicy.Management.Tools~~~~0.0.1.0'
Add-WindowsCapability -Online -Name 'Rsat.ActiveDirectory.DS-LDS.Tools~~~~0.0.1.0'
```

## Export and convert Group Policy to guest configuration

There are three options to export Group Policy files and convert them to DSC to
use in guest configuration.

- Export a single Group Policy Object
- Export the merged Group Policy Objects for an OU
- Export the merged Group Policy Objects from within a machine

### Single Group Policy Object

Identify the GUID of the Group Policy Object to export by using the commands in
the `Group Policy` module. In a large environment, consider piping the output
to `where-object` and filtering by name.

Run each of the following in a **Windows PowerShell 5.1** environment on a
**domain joined** Windows machine:

```powershell
# List all Group Policy Objects
Get-GPO -all
```

Backup the Group Policy to files. The command also accepts a "Name" parameter,
but using the GUID of the policy is less error prone.

```powershell
Backup-GPO -Guid 'f0cf623e-ae29-4768-9bb4-406cce1f3cff' -Path C:\gpobackup\
```

```

The output of the command returns the details of the files.

ConfigurationScript                   Configuration                   Name
-------------------                   -------------                   ----
C:\convertfromgpo\myCustomPolicy1.ps1 C:\convertfromgpo\localhost.mof myCustomPolicy1
```

Review the exported PowerShell script to make sure all settings have been
populated and no error messages were written. Create a new configuration package
using the MOF file by following the guidance in page
[How to create custom guest configuration package artifacts](./guest-configuration-create.md).
The steps to create and test the guest configuration package should be run in
a PowerShell 7 environment.

### Merged Group Policy Objects for an OU

Export the merged combination of Group Policy Objects (similar to a resultant
set of policy) at a specified Organizational Unit. The merge operation takes in
to account link state, enforcement, and access, but not WMI filters.

```powershell
Merge-GPOsFromOU -Path C:\mergedfromou\ -OUDistinguishedName 'OU=mySubOU,OU=myOU,DC=mydomain,DC=local' -OutputConfigurationScript
```

The output of the command returns the details of the files.

```powershell
Configuration                                Name    ConfigurationScript
-------------                                ----    -------------------
C:\mergedfromou\mySubOU\output\localhost.mof mySubOU C:\mergedfromou\mySubOU\output\mySubOU.ps1
```

### Merged Group Policy Objects from within a machine

You can also merge the policies applied to a specific machine, by running the
`Merge-GPOs` command from Windows PowerShell. WMI Filters are only evaluated
if you merge from within a machine.

```powershell
Merge-GPOs -OutputConfigurationScript -Path c:\mergedgpo
```

The output of the command will return the details of the files.

```powershell
Configuration              Name                  ConfigurationScript                    PolicyDetails
-------------              ----                  -------------------                    -------------
C:\mergedgpo\localhost.mof MergedGroupPolicy_ws1 C:\mergedgpo\MergedGroupPolicy_ws1.ps1 {@{Name=myEnforcedPolicy; Ap...
```

## OPTIONAL: Download sample Group Policy files for testing

If you aren't ready to export Group Policy files from an Active Directory environment, you can
download Windows Server security baseline from the Windows Security and Compliant Toolkit.

Create a directory for and download the Windows Server 2019 Security Baseline from the Windows
Security Compliance toolkit.

```azurepowershell-interactive
# Download the 2019 Baseline files from https://docs.microsoft.com/windows/security/threat-protection/security-compliance-toolkit-10
New-Item -Path 'C:\git\policyfiles\downloads' -Type Directory
Invoke-WebRequest -Uri 'https://download.microsoft.com/download/8/5/C/85C25433-A1B0-4FFA-9429-7E023E7DA8D8/Windows%2010%20Version%201909%20and%20Windows%20Server%20Version%201909%20Security%20Baseline.zip' -Out C:\git\policyfiles\downloads\Server2019Baseline.zip
```

Unblock and expand the downloaded Server 2019 Baseline.

```azurepowershell-interactive
Unblock-File C:\git\policyfiles\downloads\Server2019Baseline.zip
Expand-Archive -Path C:\git\policyfiles\downloads\Server2019Baseline.zip -DestinationPath C:\git\policyfiles\downloads\
```

Validate the Server 2019 Baseline contents using **MapGuidsToGpoNames.ps1**.

```azurepowershell-interactive
# Show content details of downloaded GPOs
C:\git\policyfiles\downloads\Scripts\Tools\MapGuidsToGpoNames.ps1 -rootdir C:\git\policyfiles\downloads\GPOs\ -Verbose
```

## Next steps

- [Create a package artifact](./guest-configuration-create.md)
  for guest configuration.
- [Test the package artifact](./guest-configuration-create-test.md)
  from your development environment.
- [Publish the package artifact](./guest-configuration-create-publish.md)
  so it is accessible to your machines.
- Use the `GuestConfiguration` module to
  [create an Azure Policy definition](./guest-configuration-create-definition.md)
  for at-scale management of your environment.
- [Assign your custom policy definition](../assign-policy-portal.md) using
  Azure portal.
- Learn how to view
  [compliance details for guest configuration](./determine-non-compliance.md#compliance-details-for-guest-configuration) policy assignments.
