---
title: Manage blob access points
titleSuffix: Azure Blob Storage
description: Activate or deactivate a blob access point configuration, rotate source credentials, change TLS verification, and delete blob access points and configurations.
author: cmuppala4746
ms.author: cmuppala
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 11/09/2026
# Customer intent: As a storage administrator, I want to manage blob access point configurations over time, so that I can rotate credentials, pause access, and remove resources safely.
---

# Manage blob access points

After you create a blob access point, you can pause access to its data source, rotate credentials, change TLS verification, and remove resources. This article shows you how to do these tasks by using the Azure portal and the REST API.

## Prerequisites

- A blob access point configuration and its blob access point. To create them, see [Create a blob access point](blob-access-points-create.md).
- The [Storage Account Contributor](/azure/role-based-access-control/built-in-roles/storage#storage-account-contributor) role, or Storage Blob Access Point Contributor (preview), on the storage account. For details, see [Authorize access to blob access points](blob-access-points-authorize.md).
- Blob access point creation allowed on the storage account. While it's turned off, you can't update or deactivate configurations.
- For the Azure portal steps, a storage account in a region where the Azure portal experience for blob access points is available. In other supported regions, use the REST API. See [Supported regions](blob-access-points-overview.md#supported-regions).

The REST API examples in this article use the following base URL for a configuration. Replace the placeholder values with your own.

```http
https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobAccessPointConfigurations/<configuration-name>?api-version=2026-09-01
```

## View configurations and blob access points

### [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), go to your storage account.

1. Under **Data management**, select **Blob access points**.

   The list shows each configuration with its **Data source type**, **Status**, and **Created on** date.

1. Select a configuration to open its **Overview** page.

   The **Essentials** section shows the unique ID, configuration status, last connection test, data source type, source endpoint, signing region, self-signed certificate setting, and provisioning state.

   :::image type="content" source="media/blob-access-points-manage/configuration-overview.png" alt-text="Screenshot of the overview page of a blob access point configuration in the Azure portal, with the toolbar highlighted." lightbox="media/blob-access-points-manage/configuration-overview.png":::

1. To see the blob access point that uses the configuration, select **See all blob access points associated with this configuration**.

You can also see all blob access points in the storage account. Under **Data storage**, select **Containers**, and then select the **Blob access points** tab.

### [REST API](#tab/rest-api)

To list the configurations in a storage account, send a `GET` request to the collection URL, without a configuration name:

```http
GET https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobAccessPointConfigurations?api-version=2026-09-01
```

To get one configuration, send a `GET` request to the configuration URL.

To find blob access points, call [List Containers](/rest/api/storageservices/list-containers2) with `x-ms-version` set to `2026-12-06` or later. In the `Properties` element of each blob access point entry, the response includes `IsBlobAccessPointContainer`, `BlobAccessPointConfigurationName`, and `BlobAccessPointConfigurationUniqueId`. For an example, see [Access data in a blob access point](blob-access-points-access-data.md#read-data-with-the-rest-api).

---

## Deactivate or activate a configuration

Deactivate a configuration to stop all reads through its blob access point without deleting anything. You aren't billed for an inactive configuration.

While a configuration is inactive:

- Its blob access point stays in place.
- Reads through the blob access point fail with error code `BlobAccessPointDisabled`.
- You can't test the connection.

Reads work again after you activate the configuration.

### [Portal](#tab/azure-portal)

1. Open the configuration's **Overview** page.

1. Select **Deactivate**, and then select **Deactivate configuration** to confirm.

   :::image type="content" source="media/blob-access-points-manage/deactivate-dialog.png" alt-text="Screenshot of the dialog that asks you to confirm that you want to deactivate a blob access point configuration.":::

To activate the configuration again, select **Activate**.

### [REST API](#tab/rest-api)

Send a `PATCH` request that sets `state` to `Inactive`. To activate the configuration again, set `state` to `Active`.

```http
PATCH https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobAccessPointConfigurations/<configuration-name>?api-version=2026-09-01
Content-Type: application/json
```

```json
{
  "properties": {
    "state": "Inactive"
  }
}
```

`PATCH` keeps every property that you leave out. Each `PATCH` runs asynchronously, so wait until `properties.provisioningState` is `Succeeded`, `Failed`, or `Canceled` before you send another request. If it's `Failed`, check the error, and then try again.

---

> [!NOTE]
> Deactivating a configuration that uses a private connection releases its managed private endpoint. When you activate it again, Azure Storage creates a new managed private endpoint. Approve the new connection, and then test the connection again. For more information, see [Connect blob access points privately (preview)](blob-access-points-private-connectivity.md).

## Update credentials

If your data source allows two active access keys at the same time, use these steps to rotate its credentials without interrupting reads:

1. Test the connection, and confirm that it passes.
1. Create a new access key on your data source.
1. Update the configuration with the new access key ID and secret access key.
1. Test the connection again, and read a blob through the blob access point.
1. Retire the old access key on your data source.

> [!NOTE]
> Some data sources allow only one active access key. For example, in Azure NetApp Files, generating new credentials immediately invalidates the existing credentials. For these data sources, reads through the blob access point fail until you update the configuration. Update the configuration as soon as you generate the new key, and plan for a short interruption. For more information, see [Configure object REST API in Azure NetApp Files](/azure/azure-netapp-files/object-rest-api-access-configure).

### [Portal](#tab/azure-portal)

1. Open the configuration, and then select **Authentication**.

1. Enter the **Access key ID**, the **Secret access key**, and, if needed, the **Signing region**.

   You must enter the secret access key every time you change these settings. Azure doesn't show a saved secret access key, and you can't retrieve it.

1. Optionally, select **Test connection before applying changes**.

1. Select **Apply**.

   :::image type="content" source="media/blob-access-points-manage/update-authentication.png" alt-text="Screenshot of the Authentication page of a blob access point configuration in the Azure portal, with the credential fields highlighted." lightbox="media/blob-access-points-manage/update-authentication.png":::

### [REST API](#tab/rest-api)

Send a `PATCH` request with the new credentials. Always send `accessKeyId` and `secretAccessKey` together. The service rejects a request that includes only one of them. Set `signingRegion` to the region that your data source uses.

```http
PATCH https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobAccessPointConfigurations/<configuration-name>?api-version=2026-09-01
Content-Type: application/json
```

```json
{
  "properties": {
    "source": {
      "auth": {
        "authType": "AccessKey",
        "accessKeyId": "<new-access-key-id>",
        "secretAccessKey": "<new-secret-access-key>",
        "signingRegion": "<signing-region>"
      }
    }
  }
}
```

---

## Change TLS verification

TLS verification is the only network setting that you can change after you create a configuration. Allow self-signed certificates only for testing, because the option is less secure.

### [Portal](#tab/azure-portal)

1. Open the configuration, and then select **Networking**.

1. Select or clear **Allow self-signed certificates for TLS verification (Less secure)**.

1. Select **Apply**.

   :::image type="content" source="media/blob-access-points-manage/networking-page.png" alt-text="Screenshot of the Networking page of a blob access point configuration, where only TLS verification can be changed." lightbox="media/blob-access-points-manage/networking-page.png":::

### [REST API](#tab/rest-api)

Send a `PATCH` request that sets `tlsVerification` to `Perform` or `Skip`. `Skip` accepts self-signed certificates.

```json
{
  "properties": {
    "source": {
      "connection": {
        "tlsVerification": "Perform"
      }
    }
  }
}
```

---

## Edit the description

### [Portal](#tab/azure-portal)

Open the configuration, select **Edit description**, enter the new description, and save it.

### [REST API](#tab/rest-api)

Send a `PATCH` request that sets `properties.description`.

```json
{
  "properties": {
    "description": "<new-description>"
  }
}
```

---

## What you can change after creation

| You can change | To change these settings, create a new configuration |
|---|---|
| Description | Data source type |
| State (active or inactive) | Source endpoint |
| Credentials | Connection type |
| TLS verification | Private Link resource |

A blob access point stays linked to the configuration that you chose when you created it. To use a different configuration, create a new blob access point.

## Delete a blob access point

Deleting a blob access point removes the container from your storage account. It doesn't delete the configuration or any data in your data source.

### [Portal](#tab/azure-portal)

1. In your storage account, under **Data storage**, select **Containers**.

1. Select the **Blob access points** tab.

1. Select the blob access point, and then select **Delete**.

### [REST API](#tab/rest-api)

Call [Delete Container](/rest/api/storageservices/delete-container) on the blob access point. Replace `<utc-date-time>` with the current UTC time in RFC 1123 format.

```http
DELETE https://<storage-account>.blob.core.windows.net/<blob-access-point>?restype=container
x-ms-version: 2026-12-06
x-ms-date: <utc-date-time>
Authorization: <authorization>
```

---

## Delete a configuration

Delete the blob access point first, and then delete the configuration.

> [!CAUTION]
> If you delete a configuration first, its blob access point stays in the storage account but can no longer read data. Reads fail with error code `BlobAccessPointConfigError`. A new configuration with the same name doesn't reconnect the blob access point, because the new configuration has a different unique ID. Delete the blob access point, and create a new one.

### [Portal](#tab/azure-portal)

1. Open the configuration, and then select **Delete**.

1. Enter the configuration name to confirm, and then select **Delete**.

   :::image type="content" source="media/blob-access-points-manage/delete-configuration.png" alt-text="Screenshot of the pane that confirms deletion of a blob access point configuration, with the name confirmation box highlighted.":::

1. Select **Confirm delete**.

### [REST API](#tab/rest-api)

Send a `DELETE` request to the configuration URL.

```http
DELETE https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobAccessPointConfigurations/<configuration-name>?api-version=2026-09-01
```

Send `GET` requests to the same URL until the service returns a not found response.

---

## Turn off blob access point creation

When you turn off blob access point creation, no one can create configurations or blob access points in the storage account. This change doesn't affect existing blob access points. While the setting is off, you can't update or deactivate existing configurations.

### [Portal](#tab/azure-portal)

1. Under **Data management**, select **Blob access points**.

1. Select **Access settings**.

1. Clear **Allow blob access point creation**, and then select **Apply**.

   :::image type="content" source="media/blob-access-points-manage/turn-off-creation.png" alt-text="Screenshot of the Access settings pane with the Allow blob access point creation option cleared.":::

### [REST API](#tab/rest-api)

Send a [Storage Accounts - Update](/rest/api/storagerp/storage-accounts/update) request that sets `allowBlobAccessPoints` to `false`.

```json
{
  "properties": {
    "dataCollaborationPolicyProperties": {
      "allowBlobAccessPoints": false
    }
  }
}
```

---

## Related content

- [Create a blob access point](blob-access-points-create.md)
- [Troubleshoot blob access points](blob-access-points-troubleshoot.md)
- [Blob access points overview](blob-access-points-overview.md)
