---
description: Overview of features in Azure Cloud Shell
ms.contributor: jahelmic
ms.date: 12/06/2023
ms.topic: article
tags: azure-resource-manager
title: Azure Cloud Shell features
---
# Features & tools for Azure Cloud Shell

Azure Cloud Shell is a browser-based shell experience to manage and develop Azure resources.

Cloud Shell offers a browser-accessible, preconfigured shell experience for managing Azure
resources without the overhead of installing, versioning, and maintaining a machine yourself.

Cloud Shell allocates machines on a per-request basis and as a result machine state doesn't
persist across sessions. Since Cloud Shell is built for interactive sessions, shells automatically
terminate after 20 minutes of shell inactivity.

Azure Cloud Shell runs on **Azure Linux**, Microsoft's Linux distribution for cloud infrastructure
edge products and services. Microsoft internally compiles all the packages included in the **Azure
Linux** repository to help guard against supply chain attacks.

## Features

### Secure automatic authentication

Cloud Shell securely and automatically authenticates account access for the Azure CLI and Azure
PowerShell.

### $HOME persistence across sessions

To persist files across sessions, Cloud Shell walks you through attaching an Azure file share on
first launch. Once completed, Cloud Shell will automatically attach your storage (mounted as
`$HOME\clouddrive`) for all future sessions. Additionally, your `$HOME` directory is persisted as an
.img in your Azure File share. Files outside of `$HOME` and machine state aren't persisted across
sessions. Learn more about [Persisting files in Cloud Shell][09].

Use best practices when storing secrets such as SSH keys. You can use Azure Key Vault to securely
store and retrieve your keys. For more information, see [Manage Key Vault using the Azure CLI][02].

### Azure drive (Azure:)

PowerShell in Cloud Shell provides the Azure drive (`Azure:`). You can switch to the Azure drive
with `cd Azure:` and back to your home directory with `cd  ~`. The Azure drive enables easy
discovery and navigation of Azure resources such as Compute, Network, Storage etc. similar to
filesystem navigation. You can continue to use the familiar [Azure PowerShell cmdlets][14] to manage
these resources regardless of the drive you are in. Any changes made to the Azure resources, either
made directly in Azure portal or through Azure PowerShell cmdlets, are reflected in the Azure drive.
You can run `dir -Force` to refresh your resources.

![Screenshot of an Azure Cloud Shell being initialized and a list of directory resources.][06]

### Manage Exchange Online

PowerShell in Cloud Shell contains the ExchangeOnlineManagement module. Run the following command to
get a list of Exchange cmdlets.

```powershell
Get-Command -Module ExchangeOnlineManagement
```

For more information about using the ExchangeOnlineManagement module, see
[Exchange Online PowerShell][15].

### Deep integration with open source tooling

Cloud Shell includes preconfigured authentication for open source tools such as Terraform, Ansible,
and Chef InSpec. For more information, see the following articles:

- [Run Ansible playbook][11]
- [Manage your Azure dynamic inventories][10]
- [Install and configure Terraform][12]

### Preinstalled tools

The most commonly used tools are preinstalled in Cloud Shell.

#### Azure tools

Cloud Shell comes with the following Azure command-line tools preinstalled:

|           Tool            | Version  |            Command             |
| ------------------------- | -------- | ------------------------------ |
| [Azure CLI][13]           | 2.55.0   | `az --version`                 |
| [Azure PowerShell][14]    | 11.1.0   | `Get-Module Az -ListAvailable` |
| [AzCopy][04]              | 10.15.0  | `azcopy --version`             |
| [Azure Functions CLI][01] | 4.0.5390 | `func --version`               |
| [Service Fabric CLI][03]  | 11.2.0   | `sfctl --version`              |
| [Batch Shipyard][18]      | 3.9.1    | `shipyard --version`           |
| [blobxfer][19]            | 1.11.0   | `blobxfer --version`           |

You can verify the version of the language using the command listed in the table.
Use the `Get-PackageVersion` to see a more complete list of tools and versions.

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

- [Docker Desktop][24]
- [Kubectl][29]
- [Helm][28]
- [D2iQ Kubernetes Platform CLI][23]

#### Databases

- MySQL client
- PostgreSql client
- [sqlcmd Utility][17]
- [mssql-scripter][27]

#### Other

- iPython Client
- [Cloud Foundry CLI][22]
- [Terraform][33]
- [Ansible][32]
- [Chef InSpec][21]
- [Puppet Bolt][31]
- [HashiCorp Packer][20]
- [Office 365 CLI][30]

### Preinstalled developer languages

Cloud Shell comes with the following languages preinstalled:

|  Language  |    Version    |      Command       |
| ---------- | ------------- | ------------------ |
| .NET Core  | [7.0.400][25] | `dotnet --version` |
| Go         | 1.19.11       | `go version`       |
| Java       | 17.0.8        | `java --version`   |
| Node.js    | 16.20.1       | `node --version`   |
| PowerShell | [7.4.0][16]   | `pwsh -Version`    |
| Python     | 3.9.14        | `python --version` |
| Ruby       | 3.1.4p223     | `ruby --version`   |

You can verify the version of the language using the command listed in the table.

## Next steps

- [Cloud Shell Quickstart][05]
- [Learn about Azure CLI][13]
- [Learn about Azure PowerShell][14]

<!-- link references -->
[01]: ../azure-functions/functions-run-local.md
[02]: ../key-vault/general/manage-with-cli2.md#prerequisites
[03]: ../service-fabric/service-fabric-cli.md
[04]: ../storage/common/storage-use-azcopy-v10.md
[05]: ./get-started.md
[06]: ./media/features/azure-drive.png
[09]: ./persisting-shell-storage.md
[10]: /azure/developer/ansible/dynamic-inventory-configure
[11]: /azure/developer/ansible/getting-started-cloud-shell
[12]: /azure/developer/terraform/quickstart-configure
[13]: /cli/azure/
[14]: /powershell/azure
[15]: /powershell/exchange/exchange-online-powershell
[16]: /powershell/scripting/whats-new/what-s-new-in-powershell-74
[17]: /sql/tools/sqlcmd-utility
[18]: https://batch-shipyard.readthedocs.io/en/latest/
[19]: https://blobxfer.readthedocs.io/en/latest/
[20]: https://developer.hashicorp.com/packer/docs
[21]: https://docs.chef.io/
[22]: https://docs.cloudfoundry.org/cf-cli/
[23]: https://docs.d2iq.com/dkp/2.6/azure-infrastructure
[24]: https://docs.docker.com/desktop/
[25]: https://dotnet.microsoft.com/download/dotnet/7.0
[27]: https://github.com/microsoft/mssql-scripter/blob/dev/doc/usage_guide.md
[28]: https://helm.sh/docs/
[29]: https://kubernetes.io/docs/reference/kubectl/
[30]: https://pnp.github.io/office365-cli/
[31]: https://puppet.com/docs/bolt/latest/bolt.html
[32]: https://www.ansible.com/microsoft-azure
[33]: https://www.terraform.io/docs/providers/azurerm/
