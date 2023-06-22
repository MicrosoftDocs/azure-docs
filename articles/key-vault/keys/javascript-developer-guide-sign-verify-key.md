---
title: Encrypt and decrypt using Azure Key Vault keys with JavaScript
description: Encrypt and decrypt data with keys in JavaScript. 
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: keys
ms.topic: how-to
ms.custom: devx-track-js
ms.date: 06/21/2023
ms.author: mbaldwin
#Customer intent: As a JavaScript developer who is new to Azure, I want to encrypt and decrypt data using a key to the Key Vault with the SDK.
---

# Sign and verify data using a key in Azure Key Vault with JavaScript

Create the [KeyClient](/javascript/api/@azure/keyvault-keys/keyclient) with the appropriate [programmatic authentication credentials](javascript-developer-guide-get-started.md#authorize-access-and-connect-to-key-vault), then create a [CryptographyClient]() use the client to set, update, and rotate a key in Azure Key Vault.



## Next steps

* [Get a key with JavaScript SDK](javascript-developer-guide-get-key.md)