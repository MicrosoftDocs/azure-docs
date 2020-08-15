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

Each SDK has separate client libraries for secrets, keys, and certificates.

## .NET

### Secrets

- [API Reference](/dotnet/api/azure.security.keyvault.secrets?view=azure-dotnet)
- [NuGet package](https://www.nuget.org/packages/Azure.Security.KeyVault.Secrets/)
- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault/Azure.Security.KeyVault.Secrets)
- [Quickstart](../secrets/quick-create-net.md)

### Keys

- [API Reference](/dotnet/api/azure.security.keyvault.keys?view=azure-dotnet)
- [NuGet package](https://www.nuget.org/packages/Azure.Security.KeyVault.Keys/)
- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault/Azure.Security.KeyVault.Keys)
- [Quickstart](../keys/quick-create-net.md)

### Certificates

- [API Reference](/dotnet/api/azure.security.keyvault.certificates?view=azure-dotnet)
- [NuGet package](https://www.nuget.org/packages/Azure.Security.KeyVault.Certificates/)
- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault/Azure.Security.KeyVault.Certificates)
- [Quickstart](../certificates/quick-create-net.md)

## Python

### Secrets

- [API Reference](/python/api/overview/azure/keyvault-secrets-readme?view=azure-python)
- [PyPi package](https://pypi.org/project/azure-keyvault-secrets/)
- [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-secrets)
- [Quickstart](../secrets/quick-create-python.md)

### Keys

- [API Reference](/python/api/overview/azure/keyvault-keys-readme?view=azure-python)
- [PyPi package](https://pypi.org/project/azure-keyvault-keys/)
- [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-keys)
- [Quickstart](../keys/quick-create-python.md)

### Certificates

- [API Reference](/python/api/overview/azure/keyvault-certificates-readme?view=azure-python)
- [PyPi package](https://pypi.org/project/azure-keyvault-certificates/)
- [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-certificates)
- [Quickstart](../certificates/quick-create-python.md)

## Java

### Secrets

- [API Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-secrets/4.2.0/index.html)
- [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets)
- [Quickstart](../secrets/quick-create-java.md)

### Keys

- [API Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-keys/4.2.0/index.html)
- [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-keys)
- [Quickstart](../keys/quick-create-java.md)

### Certificates

- [API Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-certificates/4.2.0/index.html)
- [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-certificate)
- [Quickstart](../certificates/quick-create-java.md)

## Node.js

### Secrets

- [API Reference](/javascript/api/@azure/keyvault-secrets/?view=azure-node-latest)
- [npm package](https://www.npmjs.com/package/@azure/keyvault-secrest)
- [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault/keyvault-secrets)
- [Quickstart](../secrets/quick-create-javascript.md)

### Keys

- [API Reference](/javascript/api/@azure/keyvault-keys/?view=azure-node-latest)
- [npm package](https://www.npmjs.com/package/@azure/keyvault-keys)
- [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault/keyvault-keys)
- [Quickstart](../keys/quick-create-javascript.md)

### Certificates


- [API Reference](/javascript/api/@azure/keyvault-certificates/?view=azure-node-latest)
- [npm package](https://www.npmjs.com/package/@azure/keyvault-certificates)
- [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault/keyvault-certificates)
- [Quickstart](../certificates/quick-create-javascript.md)

## Next steps

- See the [Azure Key Vault developers-guide.md](developers-guide.md)
- Read more about [managed identity for Azure Key Vault](managed-identity.md)