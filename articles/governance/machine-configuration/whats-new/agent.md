---
title: Azure machine configuration agent release notes
description: Details guest configuration agent release notes, issues, and frequently asked questions.
ms.date:  02/01/2024
ms.topic: release-notes
---
# Azure machine configuration agent release notes

## About the machine configuration agent

The machine configuration agent receives improvements on an ongoing basis. To stay up to date with
the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

For information on release notes for the connected machine agent, see
[What's new with the connected machine agent][01].

## Windows extension release notes

### Version 1.29.85.0 - October 2024

#### Updated

- Updated OpenSSL from version 3.3.1 to 3.3.2.

#### Fixed

- Added time-outs to address an issue that caused the agent to become unresponsive when
  trying to read a response from the service. If the agent takes more than 3 minutes to
  read a response or send a request to the service, it will now time out and continue
  execution.

### Version 1.29.82.0 - September 2024

#### New Features

- Announcing the general availability of User Assigned Identities for Azure Machine Configuration,
  enhancing security and simplifying at-scale server management by allowing private access to
  configuration packages in Azure Storage. For more information, see
  [User-Assigned Identity-based Access for Machine Configuration Packages][10].


## Extension for Linux extension release notes

### Version 1.26.79 - October 2024

##### Fixed

- Added time-outs to address an issue that caused the agent to become unresponsive when
  trying to read a response from the service. If the agent takes more than 3 minutes to
  read a response or send a request to the service, it will now time out and continue
  execution.

### Version 1.26.77 - September 2024

#### Updated

- Updated OpenSSL from version 3.0.14 to 3.0.15.

### Version 1.26.76 - September 2024

#### New Features

- Announcing the general availability of User Assigned Identities for Azure Machine Configuration,
  enhancing security and simplifying at-scale server management by allowing private access to
  configuration packages in Azure Storage. For more information, see
  [User-Assigned Identity-based Access for Machine Configuration Packages][10].

### Version 1.26.48 - January 2023

#### New Features

- Added support for Linux distributions such as Red Hat Enterprise Linux (RHEL) 9, Mariner 1 and 2,
  Alma 9, and Rocky 9.

#### Fixed

- Improved reliability for the guest configuration policy engine.

### Version 1.26.38

In this release, various improvements were made.

- You can now restrict which URLs can be used to download machine configuration packages by setting
  the `allowedGuestConfigPkgUrls` tag on the server resource and providing a comma-separated list of
  URL patterns to allow. If the tag exists, the agent only allows custom packages to be
  downloaded from the specified URLs. Built-in packages are unaffected by this feature.

#### Fixed

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
[01]: /azure/azure-arc/servers/agent-release-notes
[03]: https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-38007
[04]: ../how-to/develop-custom-package/1-set-up-authoring-environment.md
[05]: ../how-to/develop-custom-package/2-create-package.md
[06]: ../how-to/develop-custom-package/3-test-package.md
[07]: ../how-to/create-policy-definition.md
[08]: ../../policy/assign-policy-portal.md
[09]: ../../policy/how-to/determine-non-compliance.md
[10]: https://techcommunity.microsoft.com/blog/azuregovernanceandmanagementblog/user-assigned-identity-based-access-for-machine-configuration-packages-%E2%80%93-general/4305594
