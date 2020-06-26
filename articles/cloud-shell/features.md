---
title: Azure Cloud Shell features | Microsoft Docs
description: Overview of features in Azure Cloud Shell
services: Azure
documentationcenter: ''
author: maertendMSFT
manager: timlt
tags: azure-resource-manager

ms.assetid:
ms.service: azure
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 04/26/2019
ms.author: damaerte
---

# Features & tools for Azure Cloud Shell

[!INCLUDE [features-introblock](../../includes/cloud-shell-features-introblock.md)]

Azure Cloud Shell runs on `Ubuntu 16.04 LTS`.

## Features

### Secure automatic authentication

Cloud Shell securely and automatically authenticates account access for the Azure CLI and Azure PowerShell.

### $HOME persistence across sessions

To persist files across sessions, Cloud Shell walks you through attaching an Azure file share on first launch.
Once completed, Cloud Shell will automatically attach your storage (mounted as `$HOME\clouddrive`) for all future sessions.
Additionally, your `$HOME` directory is persisted as an .img in your Azure File share.
Files outside of `$HOME` and machine state are not persisted across sessions. Use best practices when storing secrets such as SSH keys. Services like [Azure Key Vault have tutorials for setup](https://docs.microsoft.com/azure/key-vault/key-vault-manage-with-cli2#prerequisites).

[Learn more about persisting files in Cloud Shell.](persisting-shell-storage.md)

### Azure drive (Azure:)

PowerShell in Cloud Shell provides the Azure drive (`Azure:`). You can switch to the Azure drive with `cd Azure:` and back to your home directory with `cd  ~`.
The Azure drive enables easy discovery and navigation of Azure resources such as Compute, Network, Storage etc. similar to filesystem navigation.
You can continue to use the familiar [Azure PowerShell cmdlets](https://docs.microsoft.com/powershell/azure) to manage these resources regardless of the drive you are in.
Any changes made to the Azure resources, either made directly in Azure portal or through Azure PowerShell cmdlets, are reflected in the Azure drive.  You can run `dir -Force` to refresh your resources.

![](media/features-powershell/azure-drive.png)

### Manage Exchange Online

PowerShell in Cloud Shell contains a private build of the Exchange Online module.  Run `Connect-EXOPSSession` to get your Exchange cmdlets.

![](media/features-powershell/exchangeonline.png)

 Run `Get-Command -Module tmp_*`
> [!NOTE]
> The module name should begin with `tmp_`, if you have installed modules with the same prefix, their cmdlets will also be surfaced. 

![](media/features-powershell/exchangeonlinecmdlets.png)

### Deep integration with open-source tooling

Cloud Shell includes pre-configured authentication for open-source tools such as Terraform, Ansible, and Chef InSpec. Try it out from the example walkthroughs.

## Tools

|Category   |Name   |
|---|---|
|Linux tools            |bash<br> zsh<br> sh<br> tmux<br> dig<br>               |
|Azure tools            |[Azure CLI](https://github.com/Azure/azure-cli) and [Azure classic CLI](https://github.com/Azure/azure-xplat-cli)<br> [AzCopy](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10)<br> [Azure Functions CLI](https://github.com/Azure/azure-functions-core-tools)<br> [Service Fabric CLI](https://docs.microsoft.com/azure/service-fabric/service-fabric-cli)<br> [Batch Shipyard](https://github.com/Azure/batch-shipyard)<br> [blobxfer](https://github.com/Azure/blobxfer)|
|Text editors           |code (Cloud Shell editor)<br> vim<br> nano<br> emacs    |
|Source control         |git                    |
|Build tools            |make<br> maven<br> npm<br> pip         |
|Containers             |[Docker Machine](https://github.com/docker/machine)<br> [Kubectl](https://kubernetes.io/docs/user-guide/kubectl-overview/)<br> [Helm](https://github.com/kubernetes/helm)<br> [DC/OS CLI](https://github.com/dcos/dcos-cli)         |
|Databases              |MySQL client<br> PostgreSql client<br> [sqlcmd Utility](https://docs.microsoft.com/sql/tools/sqlcmd-utility)<br> [mssql-scripter](https://github.com/Microsoft/sql-xplat-cli) |
|Other                  |iPython Client<br> [Cloud Foundry CLI](https://github.com/cloudfoundry/cli)<br> [Terraform](https://www.terraform.io/docs/providers/azurerm/)<br> [Ansible](https://www.ansible.com/microsoft-azure)<br> [Chef InSpec](https://www.chef.io/inspec/)<br> [Puppet Bolt](https://puppet.com/docs/bolt/latest/bolt.html)<br> [HashiCorp Packer](https://www.packer.io/)|

## Language support

|Language   |Version   |
|---|---|
|.NET Core  |2.2.402       |
|Go         |1.9        |
|Java       |1.8        |
|Node.js    |8.16.0      |
|PowerShell |[7.0.0](https://github.com/PowerShell/powershell/releases)       |
|Python     |2.7 and 3.5 (default)|

## Next steps
[Bash in Cloud Shell Quickstart](quickstart.md) <br>
[PowerShell in Cloud Shell Quickstart](quickstart-powershell.md) <br>
[Learn about Azure CLI](https://docs.microsoft.com/cli/azure/) <br>
[Learn about Azure PowerShell](https://docs.microsoft.com/powershell/azure/) <br>
