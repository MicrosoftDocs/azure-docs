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
   ms.date="03/07/2016"
   ms.author="bruceper" />

# Azure Key Vault Developer's Guide

> [AZURE.VIDEO azure-key-vault-developer-quick-start]

Using Key Vault, you will be able to securely access sensitive information from within your applications such that:

- Keys and secrets will be protected, without having to write the code yourself and, you will be easily able to use them from your applications.
- You'll be able to have your customers own and manage their own keys so you can concentrate on providing the core software features. In this way your applications will not own the responsibility or potential liability for your customers’ tenant keys and secrets.
- Your application can use keys for signing and encryption yet keeps the key management external from your application such that the solution is suitable for an application that is geographically distributed.

For more general information on Azure Key Vault, see [What is Key Vault](key-vault-whatis.md).

## Creating and Managing Key Vaults

Before working with Azure Key Vault in your code, you can create and manage vaults through REST, Resource Manager Templates, PowerShell or CLI, as described in the following articles:

- [Create and Manage Key Vaults with REST](https://msdn.microsoft.com/library/azure/mt620024.aspx)
- [Create and Manage Key Vaults with PowerShell](key-vault-get-started.md)
- [Create and Manage Key Vaults with CLI](key-vault-manage-with-cli.md)
- [Create a key vault and add a secret via an ARM template](../resource-manager-template-keyvault.md)

>[AZURE.NOTE] Operations against key vaults are authenticated through AAD and authorized through Key Vault’s own Access Policy, defined per vault.

## Coding with Key Vault

The Key Vault management system for programmers consists of several interfaces, with REST as the foundation, [Key Vault REST API Reference](https://msdn.microsoft.com/library/azure/dn903609.aspx).

You can, subject to successful authorization, do the following:

- Manage cryptographic keys using [Create](https://msdn.microsoft.com/library/azure/dn903634.aspx), [Import](https://msdn.microsoft.com/library/azure/dn903626.aspx), [Update](https://msdn.microsoft.com/library/azure/dn903616.aspx), [Delete](https://msdn.microsoft.com/library/azure/dn903611.aspx) and other operations

- Manage secrets using [Get](https://msdn.microsoft.com/library/azure/dn903633.aspx), [Update](https://msdn.microsoft.com/library/azure/dn986818.aspx), [Delete](https://msdn.microsoft.com/library/azure/dn903613.aspx) and other operations

- Use cryptographic keys with [Sign](https://msdn.microsoft.com/library/azure/dn878096.aspx)/[Verify](https://msdn.microsoft.com/library/azure/dn878082.aspx), [WrapKey](https://msdn.microsoft.com/library/azure/dn878066.aspx)/[UnwrapKey](https://msdn.microsoft.com/library/azure/dn878079.aspx) and [Encrypt](https://msdn.microsoft.com/library/azure/dn878060.aspx)/[Decrypt](https://msdn.microsoft.com/library/azure/dn878097.aspx) operations

The following SDKs are available for working with Key Vault:

|[![.NET](./media/key-vault-developers-guide/net.png)](https://msdn.microsoft.com/library/azure/dn903301.aspx)|[![Node.js](./media/key-vault-developers-guide/nodejs.png)](http://azure.github.io/azure-sdk-for-node/azure-arm-keyvault/latest)
|:--:|:--:|
|[.NET SDK Documentation](https://msdn.microsoft.com/library/azure/dn903301.aspx)|[Node.js SDK Documentation](http://azure.github.io/azure-sdk-for-node/azure-arm-keyvault/latest)|
|[.NET SDK Package](https://azure.microsoft.com/documentation/api/)|[Node.js SDK Package](https://www.npmjs.com/package/azure-keyvault)|


For complete examples of using Key Vault with your applications, see:

- .NET sample application *HelloKeyVault* and an Azure web service example. [Azure Key Vault code samples](http://www.microsoft.com/download/details.aspx?id=45343)
- Tutorial to help you learn how to use Azure Key Vault from a web application in Azure. [Use Azure Key Vault from a Web Application](key-vault-use-from-web-application.md)

## How-tos

The following articles and scenarios provide task specific guidance for working with Azure Key Vault:

- [How to Generate and Transfer HSM-Protected Keys for Azure Key Vault](key-vault-hsm-protected-keys.md) - This will help you plan for, generate and then transfer your own HSM-protected keys to use with Azure Key Vault.
- [How to pass secure values (such as passwords) during deployment](../resource-manager-keyvault-parameter.md) - When you need to pass a secure value (like a password) as a parameter during deployment, you can store that value as a secret in an Azure Key Vault and reference the value in other Resource Manager templates.
- [How to use Key Vault for extensible key management with SQL Server](https://msdn.microsoft.com/library/dn198405.aspx) - The SQL Server Connector for Microsoft Azure Key Vault enables SQL Server encryption to leverage the Azure Key Vault service as an Extensible Key Management (EKM) provider to protect its encryption keys.

For more task-specific guidance on integrating and using Key Vaults with Azure, see [Ryan Jones ARM template examples for Key Vault](https://github.com/rjmax/ArmExamples/tree/master/keyvaultexamples).

## Supporting Libraries

- [Microsoft Azure Key Vault Core Library](http://www.nuget.org/packages/Microsoft.Azure.KeyVault.Core/1.0.0) provides `IKey` and `IKeyResolver` interfaces for locating keys from identifiers and performing operations with keys.

- [Microsoft Azure Key Vault Extensions](http://www.nuget.org/packages/Microsoft.Azure.KeyVault.Extensions/1.0.0) provides extended capabilities for Azure Key Vault.
