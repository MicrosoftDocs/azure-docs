---
title: Client Libraries for Azure Key Vault | Microsoft Docs
description: Client Libraries for Azure Key Vault
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 08/14/2020
ms.author: mbaldwin

#Customer intent: As an Azure Key Vault administrator, I want to react to soft-delete being turned on for all key vaults.

---

# Client Libraries for Azure Key Vault

The client libraries for Azure Key Vault allow programmatic access to Key Vault functionality from a variety of languages, including .NET, Python, Java, and Javascript.

Each SDK has separate client libraries for secrets, keys, and certificates, per the table below.

Client library | Secrets | Keys | Certificates |
|--|--|--|--|
| .NET | <li>[API Reference](/dotnet/api/azure.security.keyvault.secrets?view=azure-dotnet)</li><br><li>[NuGet package](https://www.nuget.org/packages/Azure.Security.KeyVault.Secrets/)</li><br><li>[Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault/Azure.Security.KeyVault.Secrets) | <li>[API Reference](/dotnet/api/azure.security.keyvault.keys?view=azure-dotnet)</li><br><li>[NuGet package](https://www.nuget.org/packages/Azure.Security.KeyVault.Keys/)</li><br><li>[Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault/Azure.Security.KeyVault.Keys) | <li>[API Reference](/dotnet/api/azure.security.keyvault.certificates?view=azure-dotnet)</li><br><li>[NuGet package](https://www.nuget.org/packages/Azure.Security.KeyVault.Certificates/)</li><br><li>[Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault/Azure.Security.KeyVault.Certificates)</li> |
| Python |  <li>[API Reference](/python/api/overview/azure/keyvault-secrets-readme?view=azure-python)</li><br><li>[PyPi package](https://pypi.org/project/azure-keyvault-secrets/)</li><br><li>[Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-secrets) | <li>[API Reference](/python/api/overview/azure/keyvault-keys-readme?view=azure-python)</li><br><li>[PyPi package](https://pypi.org/project/azure-keyvault-keys/)</li><br><li>[Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-keys) | <li>[API Reference](/python/api/overview/azure/keyvault-certificates-readme?view=azure-python)</li><br><li>[PyPi package](https://pypi.org/project/azure-keyvault-certificates/)</li><br><li>[Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-certificates)</li> |
| Java | <li>[API Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-secrets/4.2.0/index.html)</li><br><li>[Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets) | <li>[API Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-keys/4.2.0/index.html)</li><br><li>[Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-keys) | <li>[API Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-certificates/4.2.0/index.html)</li><br><li>[Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-certificate) |
| Node.js |  <li>[API Reference](/javascript/api/@azure/keyvault-secrets/?view=azure-node-latest)</li><br><li>[npm package](https://www.npmjs.com/package/@azure/keyvault-secrest)</li><br><li>[Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault/keyvault-secrets) | <li>[API Reference](/javascript/api/@azure/keyvault-keys/?view=azure-node-latest)</li><br><li>[npm package](https://www.npmjs.com/package/@azure/keyvault-keys)</li><br><li>[Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault/keyvault-keys) | <li>[API Reference](/javascript/api/@azure/keyvault-certificates/?view=azure-node-latest)</li><br><li>[npm package](https://www.npmjs.com/package/@azure/keyvault-certificates)</li><br><li>[Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault/keyvault-certificates)</li> |
