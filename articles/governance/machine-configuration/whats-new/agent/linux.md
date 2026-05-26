---
title: Azure machine configuration Linux agent release notes
description: >-
  Details guest configuration agent for Linux release notes, issues, and frequently asked questions.
ms.date:  04/13/2024
ms.topic: release-notes
---

# Azure machine configuration Linux agent release notes

The machine configuration agent receives improvements on an ongoing basis. To stay up to date with
the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

For information on release notes for the connected machine agent, see
[What's new with the connected machine agent][01].

> [!NOTE]
> This article includes the release notes for the Linux extension for Azure machine configuration
> (`Microsoft.GuestConfiguration.ConfigurationforLinux`).
>
> To review the release notes for Windows (`Microsoft.GuestConfiguration.ConfigurationforWindows`),
> see [Azure machine configuration Windows agent release notes][02].

The following sections of this article detail the notes for each release of the agent. The heading
for each section includes the specific version for that release and the date for the release.

## Version 1.26.109.0 - April 2026

<a id="1.26.109.0"></a>
<a id="2026-04"></a>

### New Features

- Added support for Azure Container Linux.

### Updated

- Updated OpenSSL library from version `3.6.1` to `3.6.2`.
- Updated bundled PowerShell version from `7.4.13` to `7.4.14`.
- Improved compliance reporting for security baseline policy assignments.

## Version 1.26.107.0 - March 2026

<a id="1.26.107.0"></a>
<a id="2026-03"></a>

### Updated

- Updated OpenSSL library from version `3.4.3` to `3.6.1`.

## Version 1.26.104.0 - January 2026

<a id="1.26.104.0"></a>
<a id="2026-01"></a>

### Updated

- Updated bundled PowerShell version from `7.4.7` to `7.4.13`.
- Updated Azure Storage API version from `2019-02-02` to `2025-11-05`.

### Fixed

- Fixed support for security baseline customization on localized operating systems.
- Enhanced reliability for compliance evaluation for ApplyAndAutoCorrect Machine Configuration
  policy assignments.
- Fixed bugs that cause Machine Configuration agent and GC worker to crash.

## Version 1.26.101.0 - November 2025

<a id="1.26.101.0"></a>
<a id="2025-11"></a>

### New Features

- Baseline customization.

### Updated

- Updated OpenSSL library from version 3.4.1 to 3.4.3.

### Fixed

- Use `systemctl daemon-reload` instead of `systemctl daemon-reexec` for better stability and
  compatibility.

## Version 1.26.93.0 - July 2025

<a id="1.26.93.0"></a>
<a id="2025-07"></a>

### New Features

- Announcing the general availability of System Assigned Identities for Azure Machine Configuration
  as well as Arc Machines, enhancing security and simplifying at-scale server management by
  allowing private access to configuration packages in Azure Storage. For more information, see
  [System-Assigned Identity-based Access for Machine Configuration Packages][aa].

### Fixed

- Resolved an issue where the compliance status didn't update correctly until services were restarted.
- Updated Boost on Linux to resolve service start issues caused by compatibility problems.
- Resolved "No public key" error by adding GPG package signature validation.
- Resolved gpg installation issues on debian

## Version 1.26.87 - April 2025

<a id="1.26.87"></a>
<a id="2025-04"></a>

### New features 

- Today our extension uses a maximum of 5% CPU. For cases where this needs to be configured, a
  configuration file `cpu_config.json` can be written under the path, `/var/opt/azcmagent/`. This
  file should contain the following configuration:

```json
{
    "PolicyAgentCpu": 5
}
```
 
In this case the maximum CPU utilization of the service will be 5%. This can be configured per the
needs of the required scenario.

### Updated

- Updated .NET from version `6` to `8`
- Updated PowerShell from version `7.2.x` to `7.4.7`

## Version 1.26.85 - March 2025

<a id="1.26.85"></a>
<a id="2025-03"></a>

### New Features

- Added support for the Linux distribution Azure Linux 3!

### Updated

- Updated OpenSSL from version `3.4.0` to `3.4.1`.

### Fixed

- Resolved an issue causing a deadlock during policy execution.

## Version 1.26.80 - January 2025

<a id="1.26.80"></a>
<a id="2025-01"></a>

### Updated

- Updated OpenSSL from version `3.0.15` to `3.4.0`.

## Version 1.26.79 - October 2024

<a id="1.26.79"></a>
<a id="2024-10"></a>

#### Fixed

- Added timeouts to address an issue that caused the agent to become unresponsive when
  trying to read a response from the service. If the agent takes more than 3 minutes to
  read a response or send a request to the service, it will now time out and continue
  execution.

## Version 1.26.77 - September 2024

<a id="1.26.77"></a>
<a id="2024-09-b"></a>

### Updated

- Updated OpenSSL from version `3.0.14` to `3.0.15`.

## Version 1.26.76 - September 2024

<a id="1.26.76"></a>
<a id="2024-09-a"></a>

### New Features

- Announcing the general availability of User Assigned Identities for Azure Machine Configuration,
  enhancing security and simplifying at-scale server management by allowing private access to
  configuration packages in Azure Storage. For more information, see
  [User-Assigned Identity-based Access for Machine Configuration Packages][ab].

## Version 1.26.48 - January 2023

<a id="1.26.48"></a>
<a id="2023-01"></a>

### New Features

- Added support for Linux distributions such as Red Hat Enterprise Linux (RHEL) 9, Mariner 1 and 2,
  Alma 9, and Rocky 9.

### Fixed

- Improved reliability for the guest configuration policy engine.

## Version 1.26.38

<a id="1.26.93.0"></a>

### New features

- You can now restrict which URLs can be used to download machine configuration packages by setting
  the `allowedGuestConfigPkgUrls` tag on the server resource and providing a comma-separated list
  of URL patterns to allow. If the tag exists, the agent only allows custom packages to be
  downloaded from the specified URLs. Built-in packages are unaffected by this feature.

### Fixed

- Resolves local elevation of privilege vulnerability [CVE-2022-38007][ac].
- If you're currently running an older version of the `AzurePolicyforLinux` extension, use the
  PowerShell or Azure CLI commands in the following examples to update your extension to the latest
  version.

```azurepowershell-interactive
$params = @{
    Publisher              = 'Microsoft.GuestConfiguration'
    Type                   = 'ConfigurationforLinux'
    Name                   = 'AzurePolicyforLinux'
    TypeHandlerVersion     = '1.26.38'
    ResourceGroupName      = '<resource-group>'
    Location               = '<location>'
    VMName                 = '<vm-name>'
    EnableAutomaticUpgrade = $true
}
Set-AzVMExtension @params
```

```azurecli
az vm extension set \
    --publisher Microsoft.GuestConfiguration \
    --name ConfigurationforLinux \
    --extension-instance-name AzurePolicyforLinux \
    --resource-group <resource-group> \
    --vm-name <vm-name> \
    --version 1.26.38 \
    --enable-auto-upgrade true
```

<!-- Reference link definitions -->
[01]: /azure/azure-arc/servers/agent-release-notes
[02]: ./windows.md
[aa]: https://techcommunity.microsoft.com/blog/azuregovernanceandmanagementblog/system-assigned-identity-based-access-for-machine-configuration-packages-%E2%80%93-ga-on/4446603
[ab]: https://techcommunity.microsoft.com/blog/azuregovernanceandmanagementblog/user-assigned-identity-based-access-for-machine-configuration-packages-%E2%80%93-general/4305594
[ac]: https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-38007
