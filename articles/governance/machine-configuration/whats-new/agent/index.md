---
title: Azure machine configuration agent release notes overview
description: >-
  Overview of the guest configuration agent release notes, issues, and frequently asked questions.
ms.date:  04/13/2026
ms.topic: release-notes
---

# Azure machine configuration agent release notes overview

The machine configuration agent receives improvements on an ongoing basis. To stay up to date with
the most recent developments by platform, see the following articles:

- [Azure machine configuration agent for Linux release notes][01]
  (`Microsoft.GuestConfiguration.ConfigurationforWindows`)
- [Azure machine configuration agent for Windows release notes][02]
  (`Microsoft.GuestConfiguration.ConfigurationforLinux`)

Each article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

For information on release notes for the connected machine agent, see
[What's new with the connected machine agent][03].

## Release timeline

The following table shows the releases for both platforms from most recent to oldest. Each entry
includes a direct link to the relevant release for more information.

| Platform |   Version    |  Release date  |                   Link                   |
|:--------:|:------------:|:--------------:|:----------------------------------------:|
|  Linux   | `1.26.104.0` |  January 2026  |  [Release notes](./linux.md#1.26.104.0)  |
| Windows  | `1.29.104.0` |  January 2026  | [Release notes](./windows.md#1.29.104.0) |
|  Linux   | `1.26.101.0` | November 2025  |  [Release notes](./linux.md#1.26.101.0)  |
| Windows  | `1.29.101.0` | November 2025  | [Release notes](./windows.md#1.29.101.0) |
|  Linux   | `1.26.93.0`  |   July 2025    |  [Release notes](./linux.md#1.26.93.0)   |
| Windows  | `1.29.98.0`  |   July 2025    | [Release notes](./windows.md#1.29.98.0)  |
|  Linux   |  `1.26.87`   |   April 2025   |   [Release notes](./linux.md#1.26.87)    |
| Windows  | `1.29.92.0`  |   April 2025   | [Release notes](./windows.md#1.29.92.0)  |
|  Linux   |  `1.26.85`   |   March 2025   |   [Release notes](./linux.md#1.26.85)    |
| Windows  | `1.29.91.0`  |   March 2025   | [Release notes](./windows.md#1.29.91.0)  |
|  Linux   |  `1.26.80`   |  January 2025  |   [Release notes](./linux.md#1.26.80)    |
| Windows  | `1.29.86.0`  |  January 2025  | [Release notes](./windows.md#1.29.86.0)  |
|  Linux   |  `1.26.79`   |  October 2024  |   [Release notes](./linux.md#1.26.79)    |
| Windows  | `1.29.85.0`  |  October 2024  | [Release notes](./windows.md#1.29.85.0)  |
|  Linux   |  `1.26.77`   | September 2024 |   [Release notes](./linux.md#1.26.77)    |
|  Linux   |  `1.26.76`   | September 2024 |   [Release notes](./linux.md#1.26.76)    |
| Windows  | `1.29.82.0`  | September 2024 | [Release notes](./windows.md#1.29.82.0)  |
|  Linux   |  `1.26.47`   |  January 2023  |   [Release notes](./linux.md#1.26.76)    |
|  Linux   |  `1.26.38`   |       -        |   [Release notes](./linux.md#1.26.76)    |

## Next steps

- Set up a custom machine configuration package [development environment][04].
- [Create a package artifact][05] for machine configuration.
- [Test the package artifact][06] from your development environment.
- Use the `GuestConfiguration` module to [create an Azure Policy definition][07] for at-scale
  management of your environment.
- [Assign your custom policy definition][08] using Azure portal.
- Learn how to view [compliance details for machine configuration][09] policy assignments.

<!-- Reference link definitions -->
[01]: ./windows.md
[02]: ./linux.md
[03]: /azure/azure-arc/servers/agent-release-notes
[04]: ../../how-to/develop-custom-package/1-set-up-authoring-environment.md
[05]: ../../how-to/develop-custom-package/2-create-package.md
[06]: ../../how-to/develop-custom-package/3-test-package.md
[07]: ../../how-to/create-policy-definition.md
[08]: ../../../policy/assign-policy-portal.md
[09]: ../../../policy/how-to/determine-non-compliance.md
