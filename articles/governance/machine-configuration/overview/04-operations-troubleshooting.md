---
description: Monitor, troubleshoot, and manage Azure Machine Configuration deployments including availability, data residency, and common issues.
ms.date: 11/07/2025
ms.topic: how-to
title: Troubleshooting Azure Machine Configuration 
ms.custom: references_regions
---

# Troubleshooting Azure Machine Configuration

## Availability

Customers designing a highly available solution should consider the redundancy planning
requirements for [virtual machines][28] because guest assignments are extensions of machine
resources in Azure. Guest assignment resources can be provisioned into Azure regions that are
[paired][29]. You can view guest assignment reports if at least one region in the pair is
available. When the Azure region isn't paired and it becomes unavailable, you can't access reports
for a guest assignment. When the region is restored, you can access the reports again.

It's best practice to assign the same policy definitions with the same parameters to all machines
in the solution for highly available applications. These considerations are especially important for scenarios where
virtual machines are provisioned in [Availability Sets][30] behind a load balancer solution. A
single policy assignment spanning all machines has the least administrative overhead.

For machines protected by [Azure Site Recovery][31], ensure that the machines in the primary and
secondary site are within scope of Azure Policy assignments for the same definitions. Use the same
parameter values for both sites.

## Data residency

Machine configuration stores and processes customer data. By default, customer data is replicated
to the [paired region.][29] For the regions Singapore, Brazil South, and East Asia, all customer
data is stored and processed in the region.

## Troubleshooting machine configuration

For more information about troubleshooting machine configuration, see
[Azure Policy troubleshooting][32].

### Multiple assignments

At this time, only some built-in machine configuration policy definitions support multiple
assignments. However, all custom policies support multiple assignments by default if you used the
latest version of [the GuestConfiguration PowerShell module][33] to create machine configuration
packages and policies.

Following is the list of built-in machine configuration policy definitions that support multiple
assignments:

| ID                                                                                        | DisplayName                                                                                                 |
|--------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| /providers/Microsoft.Authorization/policyDefinitions/5fe81c49-16b6-4870-9cee-45d13bf902ce | Local authentication methods should be disabled on Windows Servers                                          |
| /providers/Microsoft.Authorization/policyDefinitions/fad40cac-a972-4db0-b204-f1b15cced89a | Local authentication methods should be disabled on Linux machines                                           |
| /providers/Microsoft.Authorization/policyDefinitions/f40c7c00-b4e3-4068-a315-5fe81347a904 | [Preview]: Add user-assigned managed identity to enable Guest Configuration assignments on virtual machines |
| /providers/Microsoft.Authorization/policyDefinitions/63594bb8-43bb-4bf0-bbf8-c67e5c28cb65 | [Preview]: Linux machines should meet STIG compliance requirement for Azure compute                         |
| /providers/Microsoft.Authorization/policyDefinitions/50c52fc9-cb21-4d99-9031-d6a0c613361c | [Preview]: Windows machines should meet STIG compliance requirements for Azure compute                      |
| /providers/Microsoft.Authorization/policyDefinitions/e79ffbda-ff85-465d-ab8e-7e58a557660f | [Preview]: Linux machines with OMI installed should have version 1.6.8-1 or later                           |
| /providers/Microsoft.Authorization/policyDefinitions/934345e1-4dfb-4c70-90d7-41990dc9608b | Audit Windows machines that don't contain the specified certificates in Trusted Root                       |
| /providers/Microsoft.Authorization/policyDefinitions/08a2f2d2-94b2-4a7b-aa3b-bb3f523ee6fd | Audit Windows machines on which the DSC configuration isn't compliant                                      |
| /providers/Microsoft.Authorization/policyDefinitions/c648fbbb-591c-4acd-b465-ce9b176ca173 | Audit Windows machines that don't have the specified Windows PowerShell execution policy                   |
| /providers/Microsoft.Authorization/policyDefinitions/3e4e2bd5-15a2-4628-b3e1-58977e9793f3 | Audit Windows machines that don't have the specified Windows PowerShell modules installed                  |
| /providers/Microsoft.Authorization/policyDefinitions/58c460e9-7573-4bb2-9676-339c2f2486bb | Audit Windows machines on which Windows Serial Console isn't enabled                                       |
| /providers/Microsoft.Authorization/policyDefinitions/e6ebf138-3d71-4935-a13b-9c7fdddd94df | Audit Windows machines on which the specified services aren't installed and 'Running'                      |
| /providers/Microsoft.Authorization/policyDefinitions/c633f6a2-7f8b-4d9e-9456-02f0f04f5505 | Audit Windows machines that aren't set to the specified time zone                                          |

> [!NOTE]
> Check this page periodically for updates to the list of built-in machine configuration
> policy definitions that support multiple assignments.

### Assignments to Azure management groups

Azure Policy definitions in the category `Guest Configuration` can be assigned to management groups
when the effect is `AuditIfNotExists` or `DeployIfNotExists`.

> [!IMPORTANT]
> When [policy exemptions][47] are created on a Machine Configuration policy, the associated guest assignment needs to be deleted to stop the agent from scanning.

### Client log files

The machine configuration extension writes log files to the following locations:

Windows

- Azure Virtual Machine: `C:\ProgramData\GuestConfig\gc_agent_logs\gc_agent.log`
- Arc-enabled server: `C:\ProgramData\GuestConfig\arc_policy_logs\gc_agent.log`

Linux

- Azure VM: `/var/lib/GuestConfig/gc_agent_logs/gc_agent.log`
- Arc-enabled server: `/var/lib/GuestConfig/arc_policy_logs/gc_agent.log`

### Collecting logs remotely

The first step in troubleshooting machine configurations or modules should be to use the cmdlets
following the steps in [How to test machine configuration package artifacts][34]. If that isn't
successful, collecting client logs can help diagnose issues.

#### Windows

Capture information from log files using [Azure VM Run Command][35], the following example
PowerShell script can be helpful.

```powershell
$linesToIncludeBeforeMatch = 0
$linesToIncludeAfterMatch  = 10
$params = @{
    Path = 'C:\ProgramData\GuestConfig\gc_agent_logs\gc_agent.log'
    Pattern = @(
        'DSCEngine'
        'DSCManagedEngine'
    )
    CaseSensitive = $true
    Context = @(
        $linesToIncludeBeforeMatch
        $linesToIncludeAfterMatch
    )
}
Select-String @params | Select-Object -Last 10
```

#### Linux

Capture information from log files using [Azure VM Run Command][36], the following example Bash
script can be helpful.

```bash
LINES_TO_INCLUDE_BEFORE_MATCH=0
LINES_TO_INCLUDE_AFTER_MATCH=10
LOGPATH=/var/lib/GuestConfig/gc_agent_logs/gc_agent.log
egrep -B $LINES_TO_INCLUDE_BEFORE_MATCH -A $LINES_TO_INCLUDE_AFTER_MATCH 'DSCEngine|DSCManagedEngine' $LOGPATH | tail
```

### Agent files

The machine configuration agent downloads content packages to a machine and extracts the contents.
To verify downloaded and stored content, view the folder locations in the following
list.

- Windows: `C:\ProgramData\guestconfig\configuration`
- Linux: `/var/lib/GuestConfig/Configuration`


### Open-source nxtools module functionality

A new open-source [nxtools module][37] is now available to help make managing Linux systems easier
for PowerShell users.

The module helps in managing common tasks such as:

- Managing users and groups
- Performing file system operations
- Managing services
- Performing archive operations
- Managing packages

The module includes class-based DSC resources for Linux and built-in machine configuration
packages.

To provide feedback about this functionality, open an issue on the documentation. We currently
_don't_ accept PRs for this project, and support is best effort.

## Next steps

Now that you understand operations and troubleshooting, you're ready to start working with machine configuration policies:

[Discover and assign built-in policies for Azure Machine Configuration][48]


<!-- Link reference definitions -->
[28]: /azure/virtual-machines/availability
[29]: /azure/reliability/cross-region-replication-azure
[30]: /azure/virtual-machines/availability#availability-sets
[31]: /azure/site-recovery/site-recovery-overview
[32]: ../../policy/troubleshoot/general.md
[33]: ../how-to/develop-custom-package/overview.md
[34]: ../how-to/develop-custom-package/3-test-package.md
[35]: /azure/virtual-machines/windows/run-command
[36]: /azure/virtual-machines/linux/run-command
[37]: https://github.com/azure/nxtools#getting-started
[47]: ../../policy/concepts/exemption-structure.md
[48]: ../how-to/assign-built-in-policies.md
