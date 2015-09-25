<properties
   pageTitle="Key Vault Developer's Guide | Microsoft Azure"
   description="Developers can use Azure Key Vault  to manage cryptographic keys within the Microsoft Azure environment. "
   services="key-vault"
   documentationCenter=""
   authors="BrucePerlerMS"
   manager="mbaldwin"
   editor="mbaldwin" />
<tags
   ms.service="key-vault"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="09/22/2015"
   ms.author="mbaldwin" />

# Azure Key Vault Developer's Guide

> [AZURE.VIDEO azure-key-vault-developer-quick-start]

Developers can use Azure Key Vault to manage cryptographic keys within the Microsoft Azure environment. Key Vault supports multiple key types and algorithms and can be used with hardware security modules (HSM) for high-value customer keys. In addition, you can use Key Vault to securely store secrets which are limited size octet objects with no specific semantics. A key vault can contain a mix of keys and secrets. Access control for the types of objects is independently managed.

Users, subject to successful authorization, can do the following:

- Manage cryptographic keys using [Create](https://msdn.microsoft.com/library/azure/dn903634.aspx), [Import](https://msdn.microsoft.com/library/azure/dn903626.aspx), [Update](https://msdn.microsoft.com/library/azure/dn903616.aspx), [Delete](https://msdn.microsoft.com/library/azure/dn903611.aspx) and other operations

- Manage secrets using [Get](https://msdn.microsoft.com/library/azure/dn903633.aspx), [Update](https://msdn.microsoft.com/library/azure/dn986818.aspx, [Delete](https://msdn.microsoft.com/library/azure/dn903613.aspx) and other operations

- Use cryptographic keys with [Sign](https://msdn.microsoft.com/library/azure/dn878096.aspx)/[Verify](https://msdn.microsoft.com/library/azure/dn878082.aspx), [WrapKey](https://msdn.microsoft.com/library/azure/dn878066.aspx)/[UnwrapKey](https://msdn.microsoft.com/library/azure/dn878079.aspx) and [Encrypt](https://msdn.microsoft.com/library/azure/dn878060.aspx)/[Decrypt](https://msdn.microsoft.com/library/azure/dn878097.aspx) operations

Operations against key vaults are authenticated and authorized by using Azure Active Directory.

## Programming for Key Vault

The Key Vault management system for programmers consists of several interfaces, with REST as the foundation. This article in the REST reference provides core concepts, [About Keys and Secrets](https://msdn.microsoft.com/library/azure/dn903623.aspx)

### REST

The REST API is the foundation of all programmatic interaction with the Key Vault.

Key Vault has its own REST endpoint which is described in the [Key Vault REST API Reference](https://msdn.microsoft.com/library/azure/dn903609.aspx)

### .NET

The .NET API is a set of wrappers that allows implementation through the C# programming model without needing to interact directly with the REST endpoint. Here you can find the [Azure Key Vault .NET client API reference](https://msdn.microsoft.com/library/azure/dn903301.aspx).

### Node.js

The Node.js API is a set of wrappers that allows implementation through the JavaScript programming model without needing to interact directly with the REST endpoint.  Here you can find the [Microsoft Azure SDK for Node.js - Key Vault Management](http://azure.github.io/azure-sdk-for-node/azure-arm-keyvault/latest/).

## Managing Key Vaults

Azure Key Vault containers (vaults) can be managed using PowerShell or CLI, as described in the following articles:

- [Create and Manage Key Vaults with PowerShell](key-vault-get-started.md)
- [Create and Manage Key Vaults with CLI](key-vault-manage-with-cli.md)


## How-tos

The following articles provide task specific guidance:

- [How to Generate and Transfer HSM-Protected Keys for Azure Key Vault](key-vault-hsm-protected-keys.md)

## See also

- [Azure Key Vault code samples](http://www.microsoft.com/download/details.aspx?id=45343)
