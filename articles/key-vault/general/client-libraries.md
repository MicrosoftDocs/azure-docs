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


---

# Client Libraries for Azure Key Vault

The client libraries for Azure Key Vault allow programmatic access to Key Vault functionality from a variety of languages, including .NET, Python, Java, and JavaScript.

## Client libraries per language and object

Each SDK has separate client libraries for key vault, secrets, keys, and certificates, per the table below.

| Language | Secrets | Keys | Certificates | Key Vault (Management plane) |
|--|--|--|--|--|
| .NET | - [API Reference](/dotnet/api/azure.security.keyvault.secrets)<br>- [NuGet package](https://www.nuget.org/packages/Azure.Security.KeyVault.Secrets/)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault/Azure.Security.KeyVault.Secrets)<br>- [Quickstart](../secrets/quick-create-net.md) | - [API Reference](/dotnet/api/azure.security.keyvault.keys)<br>- [NuGet package](https://www.nuget.org/packages/Azure.Security.KeyVault.Keys/)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault/Azure.Security.KeyVault.Keys)<br>- [Quickstart](../keys/quick-create-net.md) | - [API Reference](/dotnet/api/azure.security.keyvault.certificates)<br>- [NuGet package](https://www.nuget.org/packages/Azure.Security.KeyVault.Certificates/)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault/Azure.Security.KeyVault.Certificates)<br>- [Quickstart](../certificates/quick-create-net.md) | - [API Reference](/dotnet/api/microsoft.azure.management.keyvault)<br>- [NuGet Package](https://www.nuget.org/packages/Microsoft.Azure.Management.KeyVault/)<br> - [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault/Microsoft.Azure.Management.KeyVault)|
| Python| - [API Reference](/python/api/overview/azure/keyvault-secrets-readme)<br>- [PyPi package](https://pypi.org/project/azure-keyvault-secrets/)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-secrets)<br>- [Quickstart](../secrets/quick-create-python.md) |- [API Reference](/python/api/overview/azure/keyvault-keys-readme)<br>- [PyPi package](https://pypi.org/project/azure-keyvault-keys/)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-keys)<br>- [Quickstart](../keys/quick-create-python.md) | - [API Reference](/python/api/overview/azure/keyvault-certificates-readme)<br>- [PyPi package](https://pypi.org/project/azure-keyvault-certificates/)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-certificates)<br>- [Quickstart](../certificates/quick-create-python.md) | - [API Reference](/python/api/azure-mgmt-keyvault/azure.mgmt.keyvault)<br> - [PyPi package](https://pypi.org/project/azure-mgmt-keyvault/)<br> - [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-mgmt-keyvault)|
| Java | - [API Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-secrets/4.2.0/index.html)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-secrets)<br>- [Quickstart](../secrets/quick-create-java.md) |- [API Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-keys/4.2.0/index.html)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-keys)<br>- [Quickstart](../keys/quick-create-java.md) | - [API Reference](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-security-keyvault-certificates/4.1.0/index.html)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/azure-security-keyvault-certificates)<br>- [Quickstart](../certificates/quick-create-java.md) |- [API Reference](/java/api/com.microsoft.azure.management.keyvault)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/keyvault/mgmt-v2016_10_01)|
| Node.js | - [API Reference](/javascript/api/@azure/keyvault-secrets/)<br>- [npm package](https://www.npmjs.com/package/@azure/keyvault-secrets)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault/keyvault-secrets)<br>- [Quickstart](../secrets/quick-create-node.md) |- [API Reference](/javascript/api/@azure/keyvault-keys/)<br>- [npm package](https://www.npmjs.com/package/@azure/keyvault-keys)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault/keyvault-keys)<br>- [Quickstart](../keys/quick-create-node.md)| - [API Reference](/javascript/api/@azure/keyvault-certificates/)<br>- [npm package](https://www.npmjs.com/package/@azure/keyvault-certificates)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault/keyvault-certificates)<br>- [Quickstart](../certificates/quick-create-node.md) |  - [API Reference](/javascript/api/@azure/arm-keyvault/)<br>- [npm package](https://www.npmjs.com/package/@azure/arm-keyvault)<br>- [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/keyvault/arm-keyvault)

## Next steps

- See the [Azure Key Vault developers guide](developers-guide.md)
- Read more about [Authenticating to a Key vault](authentication.md)
- Read more about [Securing access to a Key Vault](security-overview.md)
