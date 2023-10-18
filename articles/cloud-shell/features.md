---
description: Overview of features in Azure Cloud Shell
ms.contributor: jahelmic
ms.date: 10/02/2023
ms.topic: article
tags: azure-resource-manager
title: Azure Cloud Shell features
---
# Features & tools for Azure Cloud Shell

Azure Cloud Shell is a browser-based shell experience to manage and develop Azure resources.

Cloud Shell offers a browser-accessible, pre-configured shell experience for managing Azure
resources without the overhead of installing, versioning, and maintaining a machine yourself.

Cloud Shell allocates machines on a per-request basis and as a result machine state doesn't
persist across sessions. Since Cloud Shell is built for interactive sessions, shells automatically
terminate after 20 minutes of shell inactivity.

Azure Cloud Shell runs on **Azure Linux**, Microsoft's Linux distribution for
cloud-infrastructure-edge products and services.

Microsoft internally compiles all the packages included in the **Azure Linux** repository to help
guard against supply chain attacks. Tooling has been updated to reflect the new base image for Azure
Linux. If these changes affected your Cloud Shell environment, contact Azure Support or create an
issue in the [Cloud Shell repository][17].

## Features

### Secure automatic authentication

Cloud Shell securely and automatically authenticates account access for the Azure CLI and Azure
PowerShell.

### $HOME persistence across sessions

To persist files across sessions, Cloud Shell walks you through attaching an Azure file share on
first launch. Once completed, Cloud Shell will automatically attach your storage (mounted as
`$HOME\clouddrive`) for all future sessions. Additionally, your `$HOME` directory is persisted as an
.img in your Azure File share. Files outside of `$HOME` and machine state aren't persisted across
sessions. Use best practices when storing secrets such as SSH keys. Services, like
Azure Key Vault, have [tutorials for setup][02].

Learn more about [Persisting files in Cloud Shell][28].

### Azure drive (Azure:)

PowerShell in Cloud Shell provides the Azure drive (`Azure:`). You can switch to the Azure drive
with `cd Azure:` and back to your home directory with `cd  ~`. The Azure drive enables easy
discovery and navigation of Azure resources such as Compute, Network, Storage etc. similar to
filesystem navigation. You can continue to use the familiar [Azure PowerShell cmdlets][06] to manage
these resources regardless of the drive you are in. Any changes made to the Azure resources, either
made directly in Azure portal or through Azure PowerShell cmdlets, are reflected in the Azure drive.
You can run `dir -Force` to refresh your resources.

![Screenshot of an Azure Cloud Shell being initialized and a list of directory resources.][25]

### Manage Exchange Online

PowerShell in Cloud Shell contains a private build of the Exchange Online module. Run
`Connect-EXOPSSession` to get your Exchange cmdlets.

![Screenshot of an Azure Cloud Shell running the commands Connect-EXOPSSession and Get-User.][26]

 Run `Get-Command -Module tmp_*`

> [!NOTE]
> The module name should begin with `tmp_`, if you have installed modules with the same prefix,
> their cmdlets will also be surfaced.

![Screenshot of an Azure Cloud Shell running the command Get-Command -Module tmp_*.][27]

### Deep integration with open source tooling

Cloud Shell includes pre-configured authentication for open source tools such as Terraform, Ansible,
and Chef InSpec. Try it out from the example walkthroughs.

### Pre-installed tools

The most commonly used tools are preinstalled in Cloud Shell.

#### Azure tools

Cloud Shell comes with the following Azure command-line tools preinstalled:

|           Tool            | Version  |            Command             |
| ------------------------- | -------- | ------------------------------ |
| [Azure CLI][05]           | 2.51.0   | `az --version`                 |
| [Azure PowerShell][06]    | 10.2.0   | `Get-Module Az -ListAvailable` |
| [AzCopy][04]              | 10.15.0  | `azcopy --version`             |
| [Azure Functions CLI][01] | 4.0.5198 | `func --version`               |
| [Service Fabric CLI][03]  | 11.2.0   | `sfctl --version`              |
| [Batch Shipyard][09]      | 3.9.1    | `shipyard --version`           |
| [blobxfer][10]            | 1.11.0   | `blobxfer --version`           |

You can verify the version of the language using the command listed in the table.

#### Linux tools

- bash
- zsh
- sh
- tmux
- dig

#### Text editors

- Cloud Shell editor (code)
- vim
- nano
- emacs

#### Source control

- Git
- GitHub CLI

#### Build tools

- make
- maven
- npm
- pip

#### Containers

- [Docker Desktop][15]
- [Kubectl][20]
- [Helm][19]
- [D2iQ Kubernetes Platform CLI][14]

#### Databases

- MySQL client
- PostgreSql client
- [sqlcmd Utility][08]
- [mssql-scripter][18]

#### Other

- iPython Client
- [Cloud Foundry CLI][13]
- [Terraform][24]
- [Ansible][23]
- [Chef InSpec][12]
- [Puppet Bolt][22]
- [HashiCorp Packer][11]
- [Office 365 CLI][21]

### Preinstalled developer languages

Cloud Shell comes with the following languages preinstalled:

|  Language  |    Version    |      Command       |
| ---------- | ------------- | ------------------ |
| .NET Core  | [7.0.400][16] | `dotnet --version` |
| Go         | 1.19.11       | `go version`       |
| Java       | 17.0.8        | `java --version`   |
| Node.js    | 16.20.1       | `node --version`   |
| PowerShell | [7.3.6][07]   | `pwsh -Version`    |
| Python     | 3.9.14        | `python --version` |
| Ruby       | 3.1.4p223     | `ruby --version`   |

You can verify the version of the language using the command listed in the table.

## Next steps

- [Cloud Shell Quickstart][29]
- [Learn about Azure CLI][05]
- [Learn about Azure PowerShell][06]

<!-- link references -->
[01]: ../azure-functions/functions-run-local.md
[02]: ../key-vault/general/manage-with-cli2.md#prerequisites
[03]: ../service-fabric/service-fabric-cli.md
[04]: ../storage/common/storage-use-azcopy-v10.md
[05]: /cli/azure/
[06]: /powershell/azure
[07]: /powershell/scripting/whats-new/what-s-new-in-powershell-73
[08]: /sql/tools/sqlcmd-utility
[09]: https://batch-shipyard.readthedocs.io/en/latest/
[10]: https://blobxfer.readthedocs.io/en/latest/
[11]: https://developer.hashicorp.com/packer/docs
[12]: https://docs.chef.io/
[13]: https://docs.cloudfoundry.org/cf-cli/
[14]: https://docs.d2iq.com/dkp/2.6/azure-infrastructure
[15]: https://docs.docker.com/desktop/
[16]: https://dotnet.microsoft.com/download/dotnet/7.0
[17]: https://github.com/Azure/CloudShell/issues
[18]: https://github.com/microsoft/mssql-scripter/blob/dev/doc/usage_guide.md
[19]: https://helm.sh/docs/
[20]: https://kubernetes.io/docs/reference/kubectl/
[21]: https://pnp.github.io/office365-cli/
[22]: https://puppet.com/docs/bolt/latest/bolt.html
[23]: https://www.ansible.com/microsoft-azure
[24]: https://www.terraform.io/docs/providers/azurerm/
[25]: media/features/azure-drive.png
[26]: media/features/exchangeonline.png
[27]: media/features/exchangeonlinecmdlets.png
[28]: persisting-shell-storage.md
[29]: quickstart.md
