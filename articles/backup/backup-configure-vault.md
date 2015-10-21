<properties
	pageTitle="Configure Azure Backup Services to prepare for back up of Windows Server | Microsoft Azure"
	description="Use this tutorial to learn how to use the Backup service in Microsoft's Azure cloud offering to back up Windows Server to the cloud."
	services="backup"
	documentationCenter=""
	authors="Jim-Parker"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="08/21/2015"
	ms.author="jimpark"; "aashishr"/>

# Configure Azure Backup to prepare for back up of Windows Server

This article will lead you through enabling the Azure Backup feature. To back up Windows Server or Windows Client to Azure, you need an Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).
>[AZURE.NOTE] Previously you needed to create or acquire a X.509 v3 certificate in order to register your backup server. Certificates are still supported, but now to make Azure vault registration with a server easier, you can generate a vault credential right from the Quick Start page.

## Before you start
To back up files and data from your Windows Server to Azure, you must first:

- **Create a Backup vault** — Create a vault in the Azure Backup console.
- **Download vault credentials** — In Azure Backup, upload the management certificate you created to the vault.
- **Install the Azure Backup Agent and register the server** — From Azure Backup, install the agent and register the server in the backup vault.

[AZURE.INCLUDE [backup-create-vault-wgif](../../includes/backup-create-vault-wgif.md)]

[AZURE.INCLUDE [backup-download-credentials](../../includes/backup-download-credentials.md)]

[AZURE.INCLUDE [backup-install-agent](../../includes/backup-install-agent.md)]

## Next steps
- [Backup Windows Server or Windows Client](backup-azure-backup-windows-server.md)
- [Manage Windows Server or Windows Client](backup-azure-manage-windows-server.md)
- [Restore Windows Server or Windows Client from Azure](backup-azure-restore-windows-server.md)
- [Azure Backup FAQ](backup-azure-backup-faq.md)
- [Azure Backup Forum](http://go.microsoft.com/fwlink/p/?LinkId=290933)
