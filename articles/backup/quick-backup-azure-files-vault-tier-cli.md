---
title: Quickstart - Azure CLI for Azure Files vaulted backup
description: Learn how to back up your Azure Files to vault-tier with Azure CLI.
ms.devlang: azurecli
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 10/07/2024
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

#  Quickstart: Configure vaulted backup for Azure Files using Azure CLI

This quickstart describes how to configure vaulted backup for Azure Files using Azure CLI. The Azure CLI is used to create and manage Azure resources from the command line or in scripts. You can also perform these steps with Azure PowerShell or in the Azure portal.

[Azure Backup](backup-overview.md) supports configuring [snapshot](azure-file-share-backup-overview.md?tabs=snapshot) and [vaulted](azure-file-share-backup-overview.md?tabs=vault-standard) backups for Azure Files in your storage accounts.  Vaulted backups offer an offsite solution, storing data in a general v2 storage account to protect against ransomware and malicious admin actions. You can:

- Define backup schedules and retention settings.
- Store backup data in the Recovery Service vault, retaining it for up to **10 years**.

## Prerequisites

Before you configure vaulted backup for Azure Files, ensure that the following prerequisites are met:

•	Use the Bash environment in Azure Cloud Shell. For more information, see Quickstart for Bash in Azure Cloud Shell.
 
•	If you prefer to run CLI reference commands locally, install the Azure CLI. If you're running on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see How to run the Azure CLI in a Docker container.
o	If you're using a local installation, sign in to the Azure CLI by using the az login command. To finish the authentication process, follow the steps displayed in your terminal. For other sign-in options, see Sign in with the Azure CLI.
o	When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see Use extensions with the Azure CLI.
o	Run az version to find the version and dependent libraries that are installed. To upgrade to the latest version, run az upgrade.
•	This quickstart requires version 2.0.18 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
•	Ensure the file share is present in one of the supported storage account types. Review the support matrix. 
•	In case you have restricted access to your storage account, check the firewall settings of the account to ensure that the exception "Allow Azure services on the trusted services list to access this storage account" is granted. You can refer to this link for the steps to grant an exception. 

 


- Use Bash in Azure Cloud Shell. See the [Quickstart guide]().

- Install Azure CLI to run CLI Commands Locally. For Windows or macOS, use a Docker container. Learn how to use Docker container.
  To install and upgrade Azure CLI locally, follow these steps:

  1. Sign in using az login and follow the instructions. See sign-in options.
  2. When prompted, install the Azure CLI extension. See how to use extensions.
  3. Run az version to check your version and update if needed with az upgrade.

- Ensure you have Azure CLI version 2.0.18 or later. The latest version is already in Azure Cloud Shell.

- Ensure that File Share is in a supported storage account type. Check the support matrix.

- Allow "Azure services on the trusted services list" to access your storage account, if access is restricted. See how to grant an exception.