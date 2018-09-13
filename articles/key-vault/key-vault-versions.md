---
title: Key Vault versions
description: The various versions of Azure Key Vault
services: key-vault
documentationcenter:
author: bryanla
manager: mbaldwin
tags: azure-resource-manager

ms.assetid: e8622dcc-59a3-4f4b-9f63-cd2232515a65
ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/09/2018
ms.author: bryanla

---

# Key Vault versions

## 2016-10-01 - Managed Storage Account Keys

Summer 2017 - Storage Account Keys feature added easier integration with Azure Storage. See the overview topic for more information, [Managed Storage Account Keys overview](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-storage-keys).

## 2016-10-01 - Soft-delete

Summer 2017 - soft-delete feature added for improved data protection of your key vaults and key vault objects. See the overview topic for more information, [Soft-delete overview](https://docs.microsoft.com/azure/key-vault/key-vault-ovw-soft-delete).

## 2015-06-01 - Certificate management

Certificate management is added as a feature to the GA version 2015-06-01 on September 26, 2016.

## 2015-06-01 - General availability

General Availability version 2015-06-01, announced on June 24, 2015.

The following changes were made at this release:

- Delete a key - “use” field removed.
- Get information about a key - “use” field removed.
- Import a key into a vault - “use” field removed.
- Restore a key - “use” field removed.
- Changed “RSA_OAEP” to “RSA-OAEP” for RSA Algorithms. See [About keys, secrets, and certificates](about-keys-secrets-and-certificates.md).

## 2015-02-01-preview 

Second preview version 2015-02-01-preview, announced on April 20, 2015. For more information, see [REST API Update](http://blogs.technet.com/b/kv/archive/2015/04/20/empty-3.aspx) blog post.

The following tasks were updated:

- List the keys in a vault - added pagination support to operation.
- List the versions of a key - added operation to list the versions of a key.
- List secrets in a vault - added pagination support.
- List versions of a secret - add operation to list the versions of a secret.
- All operations - Added created/updated timestamps to attributes.
- Create a secret - added Content-Type to secrets.
- Create a key - added tags as optional information.
- Create a secret - added tags as optional information.
- Update a key - added tags as optional information.
- Update a secret - added tags as optional information.
- Changed max size for secrets from 10 K to 25 K Bytes. See, [About keys, secrets, and certificates](about-keys-secrets-and-certificates.md).

## 2014-12-08-preview

First preview version 2014-12-08-preview, announced on January 8, 2015.

## See also
- [About keys, secrets, and certificates](about-keys-secrets-and-certificates.md)
