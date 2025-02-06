---
description: Overview of features in Azure Cloud Shell
ms.contributor: jahelmic
ms.date: 06/05/2024
ms.topic: overview
tags: azure-resource-manager
title: Azure Cloud Shell features
---
# Features & tools for Azure Cloud Shell

Azure Cloud Shell is a browser-based terminal that provides an authenticated, preconfigured shell
experience for managing Azure resources. Cloud Shell comes with the tools you need, already
installed.

Azure Cloud Shell runs on **Azure Linux**, Microsoft's Linux distribution for cloud infrastructure
edge products and services. You can choose Bash or PowerShell as your default shell.

## Features

### Secure environment

Microsoft internally compiles all the packages included in the **Azure Linux** repository to help
guard against supply chain attacks. For more information or to request changes to the **Azure
Linux** image, see the [Cloud Shell GitHub repository][22].

Cloud Shell automatically authenticates your Azure account to allow secure access for Azure CLI,
Azure PowerShell, and other cloud management tools.

### $HOME persistence across sessions

When you start Cloud Shell for the first time, you have the option of using Cloud Shell with or
without an attached storage account. Choosing to continue without storage is the fastest way to
start using Cloud Shell. Using Cloud Shell without storage is known as an _ephemeral session_. When
you close the Cloud Shell window, all files you saved are deleted and don't persist across sessions.

To persist files across sessions, you can choose to mount a storage account. Cloud Shell
automatically attaches your storage (mounted as `$HOME\clouddrive`) for all future sessions.
Additionally, your `$HOME` directory is persisted as an `.img` file in your Azure File share. The
machine state and files outside of `$HOME` aren't persisted across sessions. Learn more about
[Persisting files in Cloud Shell][29].

Use best practices when storing secrets such as SSH keys. You can use Azure Key Vault to securely
store and retrieve your keys. For more information, see [Manage Key Vault using the Azure CLI][05].

### Azure drive (Azure:)

PowerShell in Cloud Shell provides the Azure drive (`Azure:`). You can switch to the Azure drive
with `cd Azure:` and back to your home directory with `cd  ~`. The Azure drive enables easy
discovery and filesystem-like navigation of Azure resources such as Compute, Network, Storage, and
others. You can continue to use the familiar [Azure PowerShell cmdlets][09] to manage these
resources regardless of the drive you are in.

> [!NOTE]
> Any changes made to the Azure resources, either made directly in Azure portal or through Azure
> PowerShell cmdlets, are reflected in the `Azure:` drive. However, you must run `dir -Force` to
> refresh the view of your resources in the `Azure:`.

### Deep integration with open source tooling

Cloud Shell includes preconfigured authentication for open source tools such as Terraform, Ansible,
and Chef InSpec. For more information, see the following articles:

- [Run Ansible playbook][02]
- [Manage your Azure dynamic inventories][01]
- [Install and configure Terraform][04]

## Preinstalled tools

The most commonly used tools are preinstalled in Cloud Shell. This curated collection of tools is
updated monthly. Use the following commands to see the current list of tools and versions.

- In PowerShell, use the `Get-Module -ListAvailable` command to get a list of installed module
- In Bash or PowerShell
  - Use the `tdnf list` command to list the TDNF packages that are installed
  - Use the `pip3 list` command to list the Python packages that are installed

### Azure tools

Cloud Shell comes with the following Azure command-line tools preinstalled:

- [Azure CLI][08]
- [Azure PowerShell][09]
- [Az.Tools.Predictor][10]
- [AzCopy][07]
- [Service Fabric CLI][06]

### Other Microsoft services

- [Office 365 CLI][26]
- [Exchange Online PowerShell][11]
- A basic set of [Microsoft Graph PowerShell][12] modules
  - Microsoft.Graph.Applications
  - Microsoft.Graph.Authentication
  - Microsoft.Graph.Groups
  - Microsoft.Graph.Identity.DirectoryManagement
  - Microsoft.Graph.Identity.Governance
  - Microsoft.Graph.Identity.SignIns
  - Microsoft.Graph.Users.Actions
  - Microsoft.Graph.Users.Functions
- [MicrosoftPowerBIMgmt][13] PowerShell modules
- [SqlServer][14] PowerShell modules

### Productivity tools

Linux tools

- `bash`
- `zsh`
- `sh`
- `tmux`
- `dig`

Text editors

- Cloud Shell editor (code)
- vim
- nano
- emacs

### Cloud management tools

- [Docker Desktop][21]
- [Kubectl][25]
- [Helm][24]
- [D2iQ Kubernetes Platform CLI][20]
- [Cloud Foundry CLI][19]
- [Terraform][28]
- [Ansible][03]
- [Chef InSpec][18]
- [Puppet Bolt][27]
- [HashiCorp Packer][17]

### Developer tools

Build tools

- `make`
- `maven`
- `npm`
- `pip`

Source control

- Git
- GitHub CLI

Database tools

- MySQL client
- PostgreSql client
- [sqlcmd Utility][15]
- [mssql-scripter][23]

Programming languages

- .NET 7.0
- PowerShell 7.4
- Node.js
- Java
- Python 3.9
- Ruby
- Go

## Installing your own tools

If you configured Cloud Shell to use a storage account, you can install your own tools. You can
install any tool that doesn't require root permissions. For example, you can install Python modules,
PowerShell modules, Node.js packages, and most packages that can be installed with `wget`.

## Next steps

- [Cloud Shell Quickstart][16]
- [Learn about Azure CLI][08]
- [Learn about Azure PowerShell][09]

<!-- link references -->
[01]: /azure/developer/ansible/dynamic-inventory-configure
[02]: /azure/developer/ansible/getting-started-cloud-shell
[03]: /azure/developer/ansible/overview
[04]: /azure/developer/terraform/quickstart-configure
[05]: /azure/key-vault/general/manage-with-cli2#prerequisites
[06]: /azure/service-fabric/service-fabric-cli
[07]: /azure/storage/common/storage-use-azcopy-v10
[08]: /cli/azure/
[09]: /powershell/azure
[10]: /powershell/azure/predictor-overview
[11]: /powershell/exchange/exchange-online-powershell
[12]: /powershell/module/?term=Microsoft.Graph
[13]: /powershell/module/?term=MicrosoftPowerBIMgmt
[14]: /powershell/module/sqlserver
[15]: /sql/tools/sqlcmd-utility
[16]: get-started.md
[17]: https://developer.hashicorp.com/packer/docs
[18]: https://docs.chef.io/
[19]: https://docs.cloudfoundry.org/cf-cli/
[20]: https://docs.d2iq.com/dkp/2.7/application-deployment
[21]: https://docs.docker.com/desktop/
[22]: https://github.com/Azure/CloudShell
[23]: https://github.com/microsoft/mssql-scripter/blob/dev/doc/usage_guide.md
[24]: https://helm.sh/docs/
[25]: https://kubernetes.io/docs/reference/kubectl/
[26]: https://pnp.github.io/office365-cli/
[27]: https://puppet.com/docs/bolt/latest/bolt.html
[28]: https://www.terraform.io/docs/providers/azurerm/
[29]: persisting-shell-storage.md
