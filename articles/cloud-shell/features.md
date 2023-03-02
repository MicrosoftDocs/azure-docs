---
author: sdwheeler
description: Overview of features in Azure Cloud Shell
manager: mkluck
ms.author: sewhee
ms.contributor: jahelmic
ms.date: 11/14/2022
ms.service: cloud-shell
ms.tgt_pltfrm: vm-linux
ms.topic: article
ms.workload: infrastructure-services
services: Azure
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

<!--
TODO:
- need to verify Distro - showing Ubuntu currently
- need to verify all experiences described here eg. cd Azure: - I have different results
-->
Azure Cloud Shell runs on **Common Base Linux - Mariner** (CBL-Mariner), Microsoft's Linux
distribution for cloud-infrastructure-edge products and services.

Microsoft internally compiles all the packages included in the **CBL-Mariner** repository to help
guard against supply chain attacks. Tooling has been updated to reflect the new base image
CBL-Mariner. You can get a full list of installed package versions using the following command:
`tdnf list installed`. If these changes affected your Cloud Shell environment, contact Azure Support
or create an issue in the [Cloud Shell repository][12].

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

[Learn more about persisting files in Cloud Shell.][29]

### Azure drive (Azure:)

PowerShell in Cloud Shell provides the Azure drive (`Azure:`). You can switch to the Azure drive
with `cd Azure:` and back to your home directory with `cd  ~`. The Azure drive enables easy
discovery and navigation of Azure resources such as Compute, Network, Storage etc. similar to
filesystem navigation. You can continue to use the familiar [Azure PowerShell cmdlets][07] to manage
these resources regardless of the drive you are in. Any changes made to the Azure resources, either
made directly in Azure portal or through Azure PowerShell cmdlets, are reflected in the Azure drive.
You can run `dir -Force` to refresh your resources.

![Screenshot of an Azure Cloud Shell being initialized and a list of directory resources.][26]

### Manage Exchange Online

PowerShell in Cloud Shell contains a private build of the Exchange Online module. Run
`Connect-EXOPSSession` to get your Exchange cmdlets.

![Screenshot of an Azure Cloud Shell running the commands Connect-EXOPSSession and Get-User.][27]

 Run `Get-Command -Module tmp_*`

> [!NOTE]
> The module name should begin with `tmp_`, if you have installed modules with the same prefix,
> their cmdlets will also be surfaced.

![Screenshot of an Azure Cloud Shell running the command Get-Command -Module tmp_*.][28]

### Deep integration with open source tooling

Cloud Shell includes pre-configured authentication for open source tools such as Terraform, Ansible,
and Chef InSpec. Try it out from the example walkthroughs.

### Pre-installed tools

<!--
TODO:
- remove obsolete tools
- separate by bash vs. pwsh
- link to docs rather than github
-->

Linux tools

- bash
- zsh
- sh
- tmux
- dig

Azure tools

- [Azure CLI][09]
- [AzCopy][04]
- [Azure Functions CLI][05]
- [Service Fabric CLI][03]
- [Batch Shipyard][10]
- [blobxfer][11]

Text editors

- code (Cloud Shell editor)
- vim
- nano
- emacs

Source control

- git

Build tools

- make
- maven
- npm
- pip

Containers

- [Docker Desktop][15]
- [Kubectl][19]
- [Helm][17]
- [DC/OS CLI][14]

Databases

- MySQL client
- PostgreSql client
- [sqlcmd Utility][09]
- [mssql-scripter][18]

Other

- iPython Client
- [Cloud Foundry CLI][13]
- [Terraform][25]
- [Ansible][22]
- [Chef InSpec][23]
- [Puppet Bolt][21]
- [HashiCorp Packer][24]
- [Office 365 CLI][20]

### Language support

|  Language  |        Version        |
| ---------- | --------------------- |
| .NET Core  | [6.0.402][16]         |
| Go         | 1.9                   |
| Java       | 1.8                   |
| Node.js    | 8.16.0                |
| PowerShell | [7.2][08]             |
| Python     | 2.7 and 3.7 (default) |

## Next steps

- [Bash in Cloud Shell Quickstart][31]
- [PowerShell in Cloud Shell Quickstart][30]
- [Learn about Azure CLI][06]
- [Learn about Azure PowerShell][07]

<!-- link references -->
[02]: ../key-vault/general/manage-with-cli2.md#prerequisites
[03]: ../service-fabric/service-fabric-cli.md
[04]: ../storage/common/storage-use-azcopy-v10.md
[05]: ../azure-functions/functions-run-local.md
[06]: /cli/azure/
[07]: /powershell/azure
[08]: /powershell/scripting/whats-new/what-s-new-in-powershell-72
[09]: /sql/tools/sqlcmd-utility
[10]: https://batch-shipyard.readthedocs.io/en/latest/
[11]: https://blobxfer.readthedocs.io/en/latest/
[12]: https://github.com/Azure/CloudShell/issues
[13]: https://docs.cloudfoundry.org/cf-cli/
[14]: https://docs.d2iq.com/dkp/2.3/azure-quick-start
[15]: https://docs.docker.com/desktop/
[16]: https://dotnet.microsoft.com/download/dotnet/6.0
[17]: https://helm.sh/docs/
[18]: https://github.com/microsoft/mssql-scripter/blob/dev/doc/usage_guide.md
[19]: https://kubernetes.io/docs/user-guide/kubectl-overview/
[20]: https://pnp.github.io/office365-cli/
[21]: https://puppet.com/docs/bolt/latest/bolt.html
[22]: https://www.ansible.com/microsoft-azure
[23]: https://docs.chef.io/
[24]: https://developer.hashicorp.com/packer/docs
[25]: https://www.terraform.io/docs/providers/azurerm/
[26]: media/features/azure-drive.png
[27]: media/features/exchangeonline.png
[28]: media/features/exchangeonlinecmdlets.png
[29]: persisting-shell-storage.md
[30]: quickstart-powershell.md
[31]: quickstart.md