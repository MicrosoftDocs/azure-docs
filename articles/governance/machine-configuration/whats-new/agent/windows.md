---
title: Azure machine configuration Windows agent release notes
description:  >-
  Details guest configuration agent for Windows release notes, issues, and frequently asked
  questions.
ms.date:  04/13/2026
ms.topic: release-notes
---

# Azure machine configuration Windows agent release notes

The machine configuration agent receives improvements on an ongoing basis. To stay up to date with
the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

For information on release notes for the connected machine agent, see
[What's new with the connected machine agent][01].

> [!NOTE]
> This article includes the release notes for the Windows extension for Azure machine configuration
> (`Microsoft.GuestConfiguration.ConfigurationforWindows`).
>
> To review the release notes for Linux (`Microsoft.GuestConfiguration.ConfigurationforLinux`),
> see [Azure machine configuration Windows agent release notes][02].

The following sections of this article detail the notes for each release of the agent. The heading
for each section includes the specific version for that release and the date for the release.

## Version 1.29.108.0 - April 2026

<a id="1.29.108.0"></a>
<a id="2026-04"></a>

### Updated

- Updated OpenSSL library from version `3.6.1` to `3.6.2`.
- Updated bundled PowerShell version from `7.4.13` to `7.4.14`.
- Improved compliance reporting for security baseline policy assignments.

### Fixed

- Improved reliability of unzip during installation.

## Version 1.29.106.0 - March 2026

<a id="1.29.106.0"></a>
<a id="2026-03"></a>

### Updated

- Updated OpenSSL library from version `3.6.0` to `3.6.1`.

## Version 1.29.104.0 - January 2026

<a id="1.29.104.0"></a>
<a id="2026-01"></a>

### Updated

- Updated bundled PowerShell version from `7.4.7` to `7.4.13`.
- Updated Azure Storage API version from `2019-02-02` to `2025-11-05`.

### Fixed

- Fixed support for security baseline customization on localized operating systems.
- Enhanced reliability for compliance evaluation for `ApplyAndAutoCorrect` Machine Configuration
  policy assignments.

## Version 1.29.101.0 - November 2025

<a id="1.29.101.0"></a>
<a id="2025-11"></a>

### New Features

- Baseline customization.

### Updated

- Updated OpenSSL library from version `3.4.1` to `3.6.0`.

## Version 1.29.98.0 - July 2025

<a id="1.29.98.0"></a>
<a id="2025-07"></a>

### New Features

- Announcing the general availability of System Assigned Identities for Azure Machine Configuration
  as well as Arc Machines, enhancing security and simplifying at-scale server management by
  allowing private access to configuration packages in Azure Storage. For more information, see
  [System-Assigned Identity-based Access for Machine Configuration Packages][aa].

### Fixed

- Resolved an issue where the compliance status didn't update correctly until services were
  restarted.
- Updated local `PATH` environment variable to resolve service install and delete errors.
  
## Version 1.29.92.0 - April 2025

<a id="1.29.92.0"></a>
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

- Migrated to .NET 8
- Upgraded to PowerShell `7.4.7`

## Version 1.29.91.0 - March 2025

<a id="1.29.91.0"></a>
<a id="2025-03"></a>

### Updated

- Updated OpenSSL from version `3.4.0` to `3.4.1`.

### Fixed

- Resolved an issue causing a deadlock during policy execution.

## Version 1.29.86.0 - January 2025

<a id="1.29.86.0"></a>
<a id="2025-01"></a>

### Updated

- Updated OpenSSL from version `3.3.2` to `3.4.0`.

## Version 1.29.85.0 - October 2024

<a id="1.29.85.0"></a>
<a id="2024-10"></a>

### Updated

- Updated OpenSSL from version `3.3.1` to `3.3.2`.

### Fixed

- Added timeouts to address an issue that caused the agent to become unresponsive when
  trying to read a response from the service. If the agent takes more than 3 minutes to
  read a response or send a request to the service, it will now time out and continue
  execution.

## Version 1.29.82.0 - September 2024

<a id="1.29.82.0"></a>
<a id="2024-09"></a>

### New Features

- Announcing the general availability of User Assigned Identities for Azure Machine Configuration,
  enhancing security and simplifying at-scale server management by allowing private access to
  configuration packages in Azure Storage. For more information, see
  [User-Assigned Identity-based Access for Machine Configuration Packages][ab].

<!-- Reference link definitions -->
[01]: /azure/azure-arc/servers/agent-release-notes
[02]: ./linux.md
[aa]: https://techcommunity.microsoft.com/blog/azuregovernanceandmanagementblog/system-assigned-identity-based-access-for-machine-configuration-packages-%E2%80%93-ga-on/4446603
[ab]: https://techcommunity.microsoft.com/blog/azuregovernanceandmanagementblog/user-assigned-identity-based-access-for-machine-configuration-packages-%E2%80%93-general/4305594
