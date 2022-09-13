---
title: Azure Automanage machine configuration agent release notes
description: Details guest configuration agent release notes, issues, and frequently asked questions.
author: timwarner-msft
ms.date: 09/13/2022
ms.topic: conceptual
ms.author: timwarner
ms.service: machine-configuration
---
# Azure Automanage machine configuration agent release notes

[!INCLUDE [Machine config rename banner](../includes/banner.md)]

## About the guest configuration agent

The guest configuration agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

For information on release notes for the connected machine agent, please see [What's new with the connected machine agent](/azure/azure-arc/servers/agent-release-notes).

## Release notes

### Guest Configuration Linux Extension version 1.26.38

In this release, various improvements were made. 

- You can now restrict which URLs can be used to download machine configuration packages by setting the allowedGuestConfigPkgUrls tag on the server resource and providing a comma-separated list of URL patterns to allow. If the tag exists, the agent will only allow custom packages to be downloaded from the specified URLs. Built-in packages are unaffected by this feature. 

## Fixed

- Resolves local elevation of privilege vulnerability [CVE-2022-38007](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-38007). 
- If you're currently running an older version of the AzurePolicyforLinux extension, use the PowerShell or Azure CLI commands below to update your extension to the latest version. 

```powershell
Set-AzVMExtension -Publisher 'Microsoft.GuestConfiguration' -Type 'ConfigurationforLinux' -Name 'AzurePolicyforLinux' -TypeHandlerVersion 1.26.38 -ResourceGroupName 'myResourceGroup' -Location 'myLocation' -VMName 'myVM' -EnableAutomaticUpgrade $true
```

```azurecli
az vm extension set  --publisher Microsoft.GuestConfiguration --name ConfigurationforLinux --extension-instance-name AzurePolicyforLinux --resource-group myResourceGroup --vm-name myVM --version 1.26.38 --enable-auto-upgrade true
```

## Next steps

- Set up a custom machine configuration package [development environment](./machine-configuration-create-setup.md).
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
