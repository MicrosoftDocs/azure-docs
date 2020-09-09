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

The client libraries for Azure Key Vault allow programmatic access to Key Vault functionality from a variety of languages, including .NET, Python, Java, and JavaScript.

## Client libraries per language and object

Each SDK has separate client libraries for secrets, keys, and certificates, per the table below.

| Language | Secrets | Keys | Certificates |
|--|--|--|--|
| .NET | - [API Reference](/dotnet/api/azure.security.keyvault.secrets?view=azure-dotnet)<br>- [NuGet package](https://www.nuget.org/packages/Azure.Security.KeyVault.Secrets/)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault/Azure.Security.KeyVault.Secrets)<br>- [Quickstart](../secrets/quick-create-net.md) | - [API Reference](/dotnet/api/azure.security.keyvault.keys?view=azure-dotnet)<br>- [NuGet package](https://www.nuget.org/packages/Azure.Security.KeyVault.Keys/)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault/Azure.Security.KeyVault.Keys) | - [API Reference](/dotnet/api/azure.security.keyvault.certificates?view=azure-dotnet)<br>- [NuGet package](https://www.nuget.org/packages/Azure.Security.KeyVault.Certificates/)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault/Azure.Security.KeyVault.Certificates) |
| Python| - [API Reference](/python/api/overview/azure/keyvault-secrets-readme?view=azure-python)<br>- [PyPi package](https://pypi.org/project/azure-keyvault-secrets/)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-secrets)<br>- [Quickstart](../secrets/quick-create-python.md) |- [API Reference](/python/api/overview/azure/keyvault-keys-readme?view=azure-python)<br>- [PyPi package](https://pypi.org/project/azure-keyvault-keys/)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-keys)<br>- [Quickstart](../keys/quick-create-python.md) | - [API Reference](/python/api/overview/azure/keyvault-certificates-readme?view=azure-python)<br>- [PyPi package](https://pypi.org/project/azure-keyvault-certificates/)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-certificates)<br>- [Quickstart](../certificates/quick-create-python.md) |
| Java | - [API Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-secrets/4.2.0/index.html)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets)<br>- [Quickstart](../secrets/quick-create-java.md) |- [API Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-keys/4.2.0/index.html)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-keys) | - [API Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-certificates/4.1.0/index.html)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-certificates) |
| Node.js | - [API Reference](/javascript/api/@azure/keyvault-secrets/?view=azure-node-latest)<br>- [npm package](https://www.npmjs.com/package/@azure/keyvault-secrest)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault/keyvault-secrets)<br>- [Quickstart](../secrets/quick-create-node.md) |- [API Reference](/javascript/api/@azure/keyvault-keys/?view=azure-node-latest)<br>- [npm package](https://www.npmjs.com/package/@azure/keyvault-keys)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault/keyvault-keys)| - [API Reference](/javascript/api/@azure/keyvault-certificates/?view=azure-node-latest)<br>- [npm package](https://www.npmjs.com/package/@azure/keyvault-certificates)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault/keyvault-certificates) |

## Next steps

- See the [Azure Key Vault developers guide](developers-guide.md)
- Read more about [Authenticating to Key vault](authentication.md)
