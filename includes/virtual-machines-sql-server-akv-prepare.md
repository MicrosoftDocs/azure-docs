---
title: "include file" 
description: "include file" 
services: virtual-machines-windows
author: rothja
manager: craigg
tags: azure-service-management
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: "include"
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 04/30/2018
ms.author: jroth
ms.custom: "include file"
---
## Prepare for AKV Integration
To use Azure Key Vault Integration to configure your SQL Server VM, there are several prerequisites: 

1. [Install Azure Powershell](#install)
2. [Create an Azure Active Directory](#register)
3. [Create a key vault](#createkeyvault)

The following sections describe these prerequisites and the information you need to collect to later run the PowerShell cmdlets.

[!INCLUDE [updated-for-az](./updated-for-az.md)]

### <a id="install"></a> Install Azure PowerShell
Make sure you have installed the latest Azure PowerShell module. For more information, see [How to install and configure Azure PowerShell](/powershell/azure/install-az-ps).

### <a id="register"></a> Register an application in your Azure Active Directory

First, you need to have an [Azure Active Directory](https://azure.microsoft.com/trial/get-started-active-directory/) (AAD) in your subscription. Among many benefits, this allows you to grant permission to your key vault for certain users and applications.

Next, register an application with AAD. This will give you a Service Principal account that has access to your key vault, which your VM will need. In the Azure Key Vault article, you can find these steps in the [Register an application with Azure Active Directory](../articles/key-vault/key-vault-manage-with-cli2.md#registering-an-application-with-azure-active-directory) section, or you can see the steps with screenshots in the **Get an identity for the application section** of [this blog post](https://blogs.technet.com/b/kv/archive/2015/01/09/azure-key-vault-step-by-step.aspx). Before completing these steps, you need to collect the following information during this registration that is needed later when you enable Azure Key Vault Integration on your SQL VM.

* After the application is added, find the **Application ID** on the **Registered app** blade.
    The application ID is assigned later to the **$spName** (Service Principal name) parameter in the PowerShell script to enable Azure Key Vault Integration.

   ![Application ID](./media/virtual-machines-sql-server-akv-prepare/aad-application-id.png)

* During these steps when you create your key, copy the secret for your key as is shown in the following screenshot. This key secret is assigned later to the **$spSecret** (Service Principal secret) parameter in the PowerShell script.

   ![AAD secret](./media/virtual-machines-sql-server-akv-prepare/aad-sp-secret.png)

* The application ID and the secret will also be used to create a credential in SQL Server.

* You must authorize this new client ID to have the following access permissions: **get**, **wrapKey**, **unwrapKey**. This is done with the [Set-AzKeyVaultAccessPolicy](https://docs.microsoft.com/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy) cmdlet. For more information, see [Azure Key Vault overview](../articles/key-vault/key-vault-overview.md).

### <a id="createkeyvault"></a> Create a key vault
In order to use Azure Key Vault to store the keys you will use for encryption in your VM, you need access to a key vault. If you have not already set up your key vault, create one by following the steps in the [Getting Started with Azure Key Vault](../articles/key-vault/key-vault-overview.md) article. Before completing these steps, there is some information you need to collect during this set up that is needed later when you enable Azure Key Vault Integration on your SQL VM.

    New-AzKeyVault -VaultName 'ContosoKeyVault' -ResourceGroupName 'ContosoResourceGroup' -Location 'East Asia'

When you get to the Create a key vault step, note the returned **vaultUri** property, which is the key vault URL. In the example provided in that step, shown below, the key vault name is ContosoKeyVault, therefore the key vault URL would be https://contosokeyvault.vault.azure.net/.

The key vault URL is assigned later to the **$akvURL** parameter in the PowerShell script to enable Azure Key Vault Integration.

After the key vault is created, we need to add a key to the key vault, this key will be referred when we create an asymmetric key create  in SQL Server later.
