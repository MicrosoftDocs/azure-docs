<properties
   pageTitle="Key Vault Developer's Guide | Microsoft Azure"
   description="Developers can use Azure Key Vault to manage cryptographic keys within the Microsoft Azure environment. "
   services="key-vault"
   documentationCenter=""
   authors="BrucePerlerMS"
   manager="mbaldwin"
   editor="bruceper" />
<tags
   ms.service="key-vault"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="03/03/2016"
   ms.author="bruceper" />

# Azure Key Vault Developer's Guide

> [AZURE.VIDEO azure-key-vault-developer-quick-start]

As a developer, you can use Azure Key Vault to manage cryptographic keys within the Microsoft Azure environment. Key Vault supports multiple key types and algorithms and can be used with hardware security modules (HSM) for high-value keys. In addition, you can use Key Vault to securely store secrets which are limited size octet objects with no specific semantics. Access control for the types of objects is independently managed.

You can, subject to successful authorization, do the following:

- Manage cryptographic keys using [Create](https://msdn.microsoft.com/library/azure/dn903634.aspx), [Import](https://msdn.microsoft.com/library/azure/dn903626.aspx), [Update](https://msdn.microsoft.com/library/azure/dn903616.aspx), [Delete](https://msdn.microsoft.com/library/azure/dn903611.aspx) and other operations

- Manage secrets using [Get](https://msdn.microsoft.com/library/azure/dn903633.aspx), [Update](https://msdn.microsoft.com/library/azure/dn986818.aspx), [Delete](https://msdn.microsoft.com/library/azure/dn903613.aspx) and other operations

- Use cryptographic keys with [Sign](https://msdn.microsoft.com/library/azure/dn878096.aspx)/[Verify](https://msdn.microsoft.com/library/azure/dn878082.aspx), [WrapKey](https://msdn.microsoft.com/library/azure/dn878066.aspx)/[UnwrapKey](https://msdn.microsoft.com/library/azure/dn878079.aspx) and [Encrypt](https://msdn.microsoft.com/library/azure/dn878060.aspx)/[Decrypt](https://msdn.microsoft.com/library/azure/dn878097.aspx) operations

Operations against key vaults are authenticated and authorized through Azure Active Directory.

## Programming for Key Vault

The Key Vault management system for programmers consists of several interfaces, with REST as the foundation.
[Key Vault REST API Reference](https://msdn.microsoft.com/library/azure/dn903609.aspx)

|[![.NET](./media/key-vault-developers-guide/net.png)](https://msdn.microsoft.com/library/azure/dn903301.aspx)|[![Node.js](./media/key-vault-developers-guide/nodejs.png)](http://azure.github.io/azure-sdk-for-node/azure-arm-keyvault/latest)
|:--:|:--:|
|[.NET SDK Documentation](https://msdn.microsoft.com/library/azure/dn903301.aspx)|[Node.js SDK Documentation](http://azure.github.io/azure-sdk-for-node/azure-arm-keyvault/latest)|
|[.NET SDK Package](https://azure.microsoft.com/en-us/documentation/api/)|[Node.js SDK Package](https://www.npmjs.com/package/azure-keyvault)|

## Managing Key Vaults

Azure Key Vault containers (vaults) can be managed using REST, PowerShell or CLI, as described in the following articles:

- [Create and Manage Key Vaults with REST](https://msdn.microsoft.com/library/azure/mt620024.aspx)
- [Create and Manage Key Vaults with PowerShell](key-vault-get-started.md)
- [Create and Manage Key Vaults with CLI](key-vault-manage-with-cli.md)


## How-tos

The following articles and scenarios provide task specific guidance:

- [How to Generate and Transfer HSM-Protected Keys for Azure Key Vault](key-vault-hsm-protected-keys.md)

### How to use Key Vault with Azure Resource Manager Templates (ARM)

The following scenarios make use of ARM templates as a method for driving automation in your Key Vault work.

- **How to create a Key Vault and add a secret using an ARM template** - In this scenario, a Key Vault secret is passed in as a parameter.
[How to create a key vault and add a secret via an ARM template](resource-manager-template-keyvault.md)

- **How to use secrets in a Key Vault when deploying resources via an ARM template** - Creating a VM and passing in a secret (admin password). In this case, you are creating a VM and ARM passes an admin password to this VM as part of the template driven creation process. For more information, see [Pass secure values during deployment](resource-manager-keyvault-parameter.md).
**Note:** You must set the `EnabledForTemplateDeployment` permission on your key vault for this case. For more information on setting this permission, see [Set-AzureRmKeyVaultAccessPolicy](https://msdn.microsoft.com/library/azure/mt603625.aspx).

## Examples

- This download contains both the sample application *HelloKeyVault* and an Azure web service example. [Azure Key Vault code samples](http://www.microsoft.com/download/details.aspx?id=45343)
- Use this tutorial to help you learn how to use Azure Key Vault from a web application in Azure. [Use Azure Key Vault from a Web Application](key-vault-use-from-web-application.md)

## Supporting Libraries

- [Microsoft Azure Key Vault Core Library](http://www.nuget.org/packages/Microsoft.Azure.KeyVault.Core/1.0.0) provides `IKey` and `IKeyResolver` interfaces for locating keys from identifiers and performing operations with keys.

- [Microsoft Azure Key Vault Extensions](http://www.nuget.org/packages/Microsoft.Azure.KeyVault.Extensions/1.0.0) provides extended capabilities for Azure Key Vault.
