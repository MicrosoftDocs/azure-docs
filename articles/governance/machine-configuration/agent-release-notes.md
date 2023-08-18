---
title: Azure Automanage machine configuration agent release notes
description: Details guest configuration agent release notes, issues, and frequently asked questions.
ms.date: 04/18/2023
ms.topic: conceptual
---
# Azure Automanage machine configuration agent release notes

[!INCLUDE [Machine configuration rename banner](../includes/banner.md)]

## About the machine configuration agent

The machine configuration agent receives improvements on an ongoing basis. To stay up to date with
the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

For information on release notes for the connected machine agent, see
[What's new with the connected machine agent][01].

## Release notes

### Version 1.26.48 - January 2023

#### New Features

- In this release, we've added support for Linux distributions such as Red Hat Enterprise Linux
  (RHEL) 9, Mariner 1&2, Alma 9, and Rocky 9.

#### Fixed

- Reliability improvements were made to the guest configuration policy engine


### Guest Configuration Linux Extension version 1.26.38

In this release, various improvements were made.

- You can now restrict which URLs can be used to download machine configuration packages by setting
  the `allowedGuestConfigPkgUrls` tag on the server resource and providing a comma-separated list of
  URL patterns to allow. If the tag exists, the agent only allows custom packages to be
  downloaded from the specified URLs. Built-in packages are unaffected by this feature.

## Fixed

- Resolves local elevation of privilege vulnerability [CVE-2022-38007][03].
- If you're currently running an older version of the AzurePolicyforLinux extension, use the
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

## Next steps

- Set up a custom machine configuration package [development environment][04].
- [Create a package artifact][05] for machine configuration.
- [Test the package artifact][06] from your development environment.
- Use the `GuestConfiguration` module to [create an Azure Policy definition][07] for at-scale
  management of your environment.
- [Assign your custom policy definition][08] using Azure portal.
- Learn how to view [compliance details for machine configuration][09] policy assignments.

<!-- Reference link definitions -->
[01]: ../../azure-arc/servers/agent-release-notes.md
[03]: https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-38007
[04]: ./how-to-set-up-authoring-environment.md
[05]: ./how-to-create-package.md
[06]: ./how-to-test-package.md
[07]: ./how-to-create-policy-definition.md
[08]: ../policy/assign-policy-portal.md
[09]: ../policy/how-to/determine-non-compliance.md
