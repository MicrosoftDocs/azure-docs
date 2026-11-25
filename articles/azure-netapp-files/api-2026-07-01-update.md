---
title: Azure NetApp Files API 2026-07-01 PATCH model changes
description: Learn about the PATCH model changes in Azure NetApp Files REST API version 2026-07-01, including removed properties, optional properties, secret fields, and the volume capacity limit.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 09/29/2026
ms.author: anfdocs
# Customer intent: As a developer using the Azure NetApp Files REST API or SDKs, I want to understand the PATCH model changes in API version 2026-07-01, so that I can update my applications and automation before I upgrade.
---

# Azure NetApp Files API 2026-07-01 PATCH model changes

The Azure NetApp Files REST API version 2026-07-01 introduces changes to the models used to update NetApp accounts with `PATCH`. If you use the Azure NetApp Files REST API, Azure SDKs, or automation that updates NetApp accounts, review these changes before adopting API version 2026-07-01 or an SDK based on this API version.

> [!IMPORTANT]
> These changes affect only `PATCH .../netAppAccounts/{accountName}` request payloads. No action is required for existing `PUT` or `GET` calls.

## What's changing

Beginning with API version 2026-07-01, `PATCH` request bodies for NetApp accounts use dedicated update models instead of reusing the full resource models.

As part of this change:

* Read-only and server-assigned properties are removed from the update contract.
* Properties required only when creating a resource are optional when updating it.
* Schema defaults are removed from the update contract so omitted values aren't reapplied during an update.
* Certain secret fields are identified as passwords for SDK and tooling handling.
* The stable API defines a maximum Azure NetApp Files volume capacity of 2,400 TiB.

## New PATCH models

The following dedicated models are used for update operations:

| New model | Replaces in PATCH body | Referenced from |
| --- | --- | --- |
| `AccountPropertiesPatch` | `AccountProperties` | `NetAppAccountPatch.properties` |
| `ActiveDirectoryPatch` | `ActiveDirectory` | `AccountPropertiesPatch.activeDirectories[]` |
| `AccountEncryptionPatch` | `AccountEncryption` | `AccountPropertiesPatch.encryption` |
| `KeyVaultPropertiesPatch` | `KeyVaultProperties` | `AccountEncryptionPatch.keyVaultProperties` |
| `EncryptionIdentityPatch` | `EncryptionIdentity` | `AccountEncryptionPatch.identity` |

The `NetAppAccountPatch` model name is unchanged, but the properties supported by the model have been updated.

## Properties removed from PATCH requests

The following properties are no longer part of the update contract because they're read-only, server-assigned, or immutable after resource creation. These properties remain available through `GET` and `PUT` responses.

| Model | Property removed | Reason |
| --- | --- | --- |
| `NetAppAccountPatch` | `id` | Server-assigned, read-only |
| `NetAppAccountPatch` | `name` | Server-assigned, read-only |
| `NetAppAccountPatch` | `type` | Server-assigned, read-only |
| `NetAppAccountPatch` | `location` | Immutable after creation |
| `AccountPropertiesPatch` | `provisioningState` | Read-only |
| `AccountPropertiesPatch` | `disableShowmount` | Read-only |
| `AccountPropertiesPatch` | `multiAdStatus` | Read-only |
| `ActiveDirectoryPatch` | `status` | Read-only |
| `ActiveDirectoryPatch` | `statusDetails` | Read-only |
| `KeyVaultPropertiesPatch` | `keyVaultId` | Read-only |
| `KeyVaultPropertiesPatch` | `status` | Read-only |
| `EncryptionIdentityPatch` | `principalId` | Read-only |

Previously, these properties could be included in `PATCH` requests but were ignored. REST clients that construct `PATCH` request bodies should stop including them. Clients that perform strict schema validation must use the new update contract.

## Key Vault properties are optional during updates

The following properties are no longer required when updating Key Vault settings:

| Model | Property | Change |
| --- | --- | --- |
| `KeyVaultPropertiesPatch` | `keyVaultUri` | Required to optional |
| `KeyVaultPropertiesPatch` | `keyName` | Required to optional |

This behavior is consistent with JSON Merge Patch semantics. If you omit one of these properties from a `PATCH` request, its existing value remains unchanged.

## Default values aren't applied during PATCH operations

Schema defaults no longer flow into `PATCH` operations for the following properties:

| Model | Property | Previously advertised default |
| --- | --- | --- |
| `ActiveDirectoryPatch` | `organizationalUnit` | `CN=Computers` |
| `AccountEncryptionPatch` | `keySource` | `Microsoft.NetApp` |

If you omit either property from an update request, its existing value remains unchanged instead of being reset to the previously advertised default.

If your automation depends on either default being reapplied during an update, specify the required value explicitly in the `PATCH` request.

## Secret fields are identified as passwords

The following properties are declared with `format: password` so SDKs and tooling can treat their values as secrets and redact them in logs or traces:

| Model | Property |
| --- | --- |
| `PeeringPassphrases` | `clusterPeeringPassphrase` |
| `ClusterPeerCommandResponseProperties` | `passphrase` |

The property values and their wire type (`string`) are unchanged.

## Volume capacity limit

For API version 2026-07-01, the maximum value for `usageThreshold` on `VolumeProperties` and `VolumePatchProperties` is 2,638,827,906,662,400 bytes (2,400 TiB).

The 7,200-TiB maximum remains available only with API version 2026-07-15-preview.

The minimum volume capacity of 50 GiB and default of 100 GiB are unchanged.

If your application or automation provisions or updates volumes larger than 2,400 TiB, continue using the preview API version.

## Required action

Review how your applications and automation use Azure NetApp Files before upgrading to API version 2026-07-01 or an SDK based on this API version.

### REST API callers

Remove the read-only, server-assigned, and immutable properties listed in this article from NetApp account `PATCH` request bodies. These properties were previously ignored but are no longer included in the update schema.

### Azure SDK users

When you upgrade to an SDK generated from API version 2026-07-01, update NetApp account `PATCH` call sites to use the new update-model classes. For example, use `ActiveDirectoryPatch` instead of `ActiveDirectory` when constructing the corresponding update payload.

Read operations are unaffected.

### Automation and infrastructure-as-code users

Review automation or templates that set `organizationalUnit` or `keySource` and depend on their defaults being reapplied during an update. Specify these properties explicitly when your update requires a particular value.

### Volume configurations

If your deployment requires volumes larger than 2,400 TiB, continue using API version 2026-07-15-preview. The stable 2026-07-01 API supports a maximum of 2,400 TiB.

## Related content

* [Develop for Azure NetApp Files with REST API](azure-netapp-files-develop-with-rest-api.md)
