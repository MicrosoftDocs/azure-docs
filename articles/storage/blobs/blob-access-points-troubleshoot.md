---
title: Troubleshoot blob access points
titleSuffix: Azure Blob Storage
description: Find the cause and fix for common blob access point errors, including BlobAccessPointsNotAllowed, BlobAccessPointDisabled, and failed connection tests.
author: cmuppala4746
ms.author: cmuppala
ms.service: azure-blob-storage
ms.topic: troubleshooting
ms.date: 11/06/2026
# Customer intent: As a storage administrator, I want to resolve blob access point errors quickly, so that applications can read data again.
---

# Troubleshoot blob access points

This article helps you find the cause of common blob access point errors and fix them. Each section lists the symptom, the cause, and the resolution.

## BlobAccessPointsNotAllowed

**Symptom:** Creating, updating, or deactivating a configuration fails with status code `409` and error code `BlobAccessPointsNotAllowed`. The message says that the `allowBlobAccessPoints` property isn't set or is set to false.

**Cause:** Blob access point creation isn't allowed on the storage account.

**Resolution:** Allow blob access point creation, and then try again. For steps, see [Allow blob access point creation](blob-access-points-create.md#allow-blob-access-point-creation). The setting can take a few minutes to take effect.

## Reads fail because of network settings

**Symptom:** The configuration exists and its connection test passes, but reads through the blob access point fail. In the Azure portal, a message says that the networking settings of the storage account might be blocking access. Other clients typically receive status code `403` with error code `AuthorizationFailure`.

**Cause:** The network rules of the storage account block the client. Blob access points follow the same network rules as other containers in the storage account.

**Resolution:** Allow the client in the network rules of the storage account. For example, set public network access to **Enabled from all networks**, add the client's virtual network or IP address under **Enabled from selected virtual networks and IP addresses**, or connect through a private endpoint for the storage account. For more information, see [Networking considerations](blob-access-points-overview.md#networking-considerations) and [Set the default public network access rule](../common/storage-network-security-set-default-access.md).

## Connection test fails

**Symptom:** The connection test fails with error code `TestConnectionFailure`. The message can mention a storage connector, which is the internal name for a configuration.

**Cause and resolution:**

| Cause | Resolution |
|---|---|
| Wrong access key ID, secret access key, or signing region | Check the values on your data source, and then update the credentials. See [Update credentials](blob-access-points-manage.md#update-credentials) and [BlobAccessPointAuthError](#blobaccesspointautherror). |
| The source endpoint isn't reachable from Azure | For a public connection, check DNS and the firewall rules on your data source. If your data source restricts inbound traffic, allow the IP address ranges of the `Storage` service tag for the region of your storage account. For a private connection, check that the private endpoint connection is approved. |
| The certificate of the data source isn't trusted | Install a certificate from a trusted certificate authority on your data source. For testing only, allow self-signed certificates. See [Change TLS verification](blob-access-points-manage.md#change-tls-verification). |

## BlobAccessPointConfigurationNameNotFound

**Symptom:** Creating a blob access point fails with status code `409` and error code `BlobAccessPointConfigurationNameNotFound`.

**Cause:** No configuration with that name exists in the storage account.

**Resolution:** Check the configuration name. The configuration must be in the same storage account as the blob access point.

## BlobAccessPointConfigurationUniqueIdMismatch

**Symptom:** Creating a blob access point fails with status code `409` and error code `BlobAccessPointConfigurationUniqueIdMismatch`.

**Cause:** The configuration exists, but its unique ID doesn't match the value in the request.

**Resolution:** Get the configuration again, and use its current `uniqueId` value.

## OperationNotSupportedForBlobAccessPoints

**Symptom:** A request to write, update, or delete a blob fails with status code `409` and error code `OperationNotSupportedForBlobAccessPoints`.

**Cause:** Blobs in a blob access point are read-only. This error is expected.

**Resolution:** No action is needed. To write data, write it to your data source directly, or use a regular container.

## BlobAccessPointDisabled

**Symptom:** Reads through a blob access point fail with status code `409` and error code `BlobAccessPointDisabled`. The message says that the blob access point is disabled.

**Cause:** The configuration is inactive.

**Resolution:** Activate the configuration. See [Deactivate or activate a configuration](blob-access-points-manage.md#deactivate-or-activate-a-configuration).

## BlobAccessPointConfigError

**Symptom:** Reads through a blob access point fail with status code `409` and error code `BlobAccessPointConfigError`.

**Cause:** The configuration that the blob access point uses was deleted.

**Resolution:** You can't reconnect the blob access point. Delete it, create a new configuration if needed, and then create a new blob access point. See [Create a blob access point](blob-access-points-create.md).

## BlobAccessPointAuthError

**Symptom:** [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), and [Get Blob](/rest/api/storageservices/get-blob) requests to a blob access point fail with status code `409`, error code `BlobAccessPointAuthError`, and the message "BlobAccessPoint returned an Authentication Error." The connection test fails with error code `TestConnectionFailure`.

**Cause:** Your data source rejected the request that Azure Storage signed with the credentials in the configuration. For example, the access key ID or secret access key is wrong, the keys were rotated on the data source but not in the configuration, the signing region is wrong, or the access key can't list and read objects in the bucket. The credentials of the caller that reads from the blob access point aren't involved. Your data source returned status code `403`, but Azure Storage returns `409` because the configuration needs to be fixed.

**Resolution:**

1. Check the access key ID, the secret access key, and the signing region on your data source. If its logs show the rejected request, the error code points to the cause:

   | Error code from the data source | Likely cause |
   |---|---|
   | `SignatureDoesNotMatch` | The secret access key or the signing region is wrong. |
   | `InvalidAccessKeyId` | The access key ID is wrong or was deleted. |
   | `AccessDenied` | The access key doesn't have permission on the bucket. |

   If you work with a data source provider, give them the UTC time of the failed request so that they can find it in their logs.

1. Update the credentials in the configuration. Enter the access key ID and the secret access key together. See [Update credentials](blob-access-points-manage.md#update-credentials).
1. Test the connection. See [Test the connection](blob-access-points-create.md#test-the-connection).

## 403 errors when reading data

**Symptom:** Reads through a blob access point fail with status code `403`.

**Cause:** The caller doesn't have permission to read blob data, or a new role assignment hasn't taken effect yet. If the error code is `AuthorizationFailure`, the network rules of the storage account might be blocking the client instead.

**Resolution:** Assign a role that can read blob data, such as [Storage Blob Data Reader](/azure/role-based-access-control/built-in-roles/storage#storage-blob-data-reader), and wait a few minutes for the assignment to take effect. See [Authorize access to blob access points](blob-access-points-authorize.md). For network causes, see [Reads fail because of network settings](#reads-fail-because-of-network-settings).

## Blob access point headers are missing

**Symptom:** Get Container Properties or List Containers doesn't return the blob access point headers or fields.

**Cause:** The request uses an `x-ms-version` earlier than `2026-12-06`.

**Resolution:** Set `x-ms-version` to `2026-12-06` or later.

## Blob access points don't appear in the Azure portal

**Symptom:** You can't find **Blob access points** for your storage account in the Azure portal.

**Cause:** The storage account is in a region where the Azure portal experience for blob access points isn't available yet, or in a region where blob access points aren't available.

**Resolution:** Check the region of your storage account in [Supported regions](blob-access-points-overview.md#supported-regions). If blob access points are available in the region but the Azure portal experience isn't, use the REST API. For steps, select the **REST API** tab in [Create a blob access point](blob-access-points-create.md).

## Information to include in a support request

If you can't resolve an issue, [open a support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview) and include the following information:

- The time of the request in UTC, the region, and the storage account name.
- The configuration name and unique ID.
- The `x-ms-request-id` header for data requests, or the `x-ms-correlation-request-id` header for management requests.
- The full response body, with secrets removed.

## Related content

- [Limitations and known issues with blob access points](blob-access-points-known-issues.md)
- [Manage blob access points](blob-access-points-manage.md)
