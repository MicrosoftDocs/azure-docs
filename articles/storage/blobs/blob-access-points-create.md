---
title: Create a blob access point
titleSuffix: Azure Blob Storage
description: Allow blob access point creation on a storage account, connect an external data source with a configuration, and create a blob access point to read the data.
author: cmuppala4746
ms.author: cmuppala
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 11/09/2026
# Customer intent: As a storage administrator, I want to connect an external data source to my storage account, so that applications can read its data through Blob Storage APIs.
---

# Create a blob access point

This article shows you how to connect an external data source to your storage account and read its data through a blob access point. You allow blob access point creation on the account, create a blob access point configuration, test the connection, and then create the blob access point.

This article uses a public connection. To connect over a private connection, see [Connect blob access points privately (preview)](blob-access-points-private-connectivity.md).

To learn how blob access points work, see [Blob access points overview](blob-access-points-overview.md).

## Prerequisites

- A standard general-purpose v2 or premium block blob storage account in a [supported region](blob-access-points-overview.md#supported-regions). To create one, see [Create a storage account](../common/storage-account-create.md). The Azure portal steps work only in regions where the Azure portal experience for blob access points is available. In other supported regions, use the REST API.

- Network access to the storage account from the client that you use to read data, or to create the blob access point by using the REST API. The network rules of the storage account apply to blob access points the same way that they apply to other containers. For more information, see [Networking considerations](blob-access-points-overview.md#networking-considerations).

- The following permissions. For details, see [Authorize access to blob access points](blob-access-points-authorize.md).

  | Task | Permission |
  |---|---|
  | Allow blob access point creation | Permission to update the storage account (`Microsoft.Storage/storageAccounts/write`), such as the [Storage Account Contributor](/azure/role-based-access-control/built-in-roles/storage#storage-account-contributor) role |
  | Create and test a configuration | [Storage Account Contributor](/azure/role-based-access-control/built-in-roles/storage#storage-account-contributor), or Storage Blob Access Point Contributor (preview) |
  | Create a blob access point | [Storage Account Contributor](/azure/role-based-access-control/built-in-roles/storage#storage-account-contributor) in the Azure portal. With the REST API, Storage Blob Access Point Contributor (preview) or [Storage Blob Data Contributor](/azure/role-based-access-control/built-in-roles/storage#storage-blob-data-contributor). |

- The details of your data source, such as its source endpoint and credentials. For the complete list, see [Data source requirements for blob access points](blob-access-points-data-sources.md).

## Allow blob access point creation

Blob access point creation is off by default for every storage account. Turn it on before you create a configuration.

This account-level setting affects security and billing:

- **Impact on security.** When the setting is on, users who can manage configurations can connect the storage account to data sources outside Azure Storage. To audit or block the setting across your organization, use Azure Policy. See [Govern blob access points with Azure Policy](blob-access-points-authorize.md#govern-blob-access-points-with-azure-policy).
- **Impact on billing.** Turning on the setting doesn't start billing. You're billed for each configuration while it's active. See [Pricing and billing](blob-access-points-overview.md#pricing-and-billing).

> [!IMPORTANT]
> After you allow blob access point creation, the storage account doesn't return [List Blobs](/rest/api/storageservices/list-blobs) results in Apache Arrow format. List Blobs requests that accept only Apache Arrow aren't supported, and requests that accept Apache Arrow with XML fallback return XML. For details, see [Apache Arrow listings](blob-access-points-known-issues.md#apache-arrow-listings).

### [Portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), go to your storage account.

1. Under **Data management**, select **Blob access points**.

1. Select **Access settings**.

   :::image type="content" source="media/blob-access-points-create/get-started-steps.png" alt-text="Screenshot of the Blob access points page in the Azure portal, with the Access settings button and the menu item highlighted." lightbox="media/blob-access-points-create/get-started-steps.png":::

1. Select **Allow blob access point creation**, and then select **Apply**.

   :::image type="content" source="media/blob-access-points-create/allow-creation.png" alt-text="Screenshot of the Access settings pane with the Allow blob access point creation option selected and highlighted.":::

   A notification confirms that access point creation is enabled.

### [REST API](#tab/rest-api)

Set the `allowBlobAccessPoints` property to `true` by using the [Storage Accounts - Update](/rest/api/storagerp/storage-accounts/update) operation.

```http
PATCH https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>?api-version=2026-09-01
Content-Type: application/json
```

```json
{
  "properties": {
    "dataCollaborationPolicyProperties": {
      "allowBlobAccessPoints": true
    }
  }
}
```

The response returns the storage account. Confirm that `dataCollaborationPolicyProperties` shows `"allowBlobAccessPoints": true`. The setting can take a few minutes to take effect.

---

## Create a configuration

The configuration tells Azure Storage where your data is, how to reach it, and how to sign in to it.

The configuration name must be 3 to 63 characters long and contain only lowercase letters, numbers, and hyphens. It must begin and end with a letter or number, and each hyphen must be preceded and followed by a letter or number.

### [Portal](#tab/azure-portal)

1. On the **Blob access points** page, select **Create configuration**.

1. On the **Basics** tab, under **Project details**, enter the following values:

   - **Name**: The configuration name.
   - **Data source type**: The type that matches your data source. You can't change it later.
   - **Source endpoint**: The URL of your bucket.
   - **Description**: Optional. Add aliases or identifiers that help you match the configuration to its data source.
   - **Activate configuration**: Leave it selected so the configuration serves data as soon as it's created. You're billed for each hour that a configuration is active.

   :::image type="content" source="media/blob-access-points-create/data-source-type-list.png" alt-text="Screenshot of the Data source type list in a new configuration, showing Azure NetApp Files, Qumulo, Nasuni, and Commvault.":::

1. Under **Networking**, select **Public: Access data via the internet**. You can't change the connection type later.

1. Under **Authentication**, enter the **Access key ID** and the **Secret access key**. Change **Signing region** only if your data source uses a region other than `us-east-1`.

   Select **Allow self-signed certificates for TLS verification (Less secure)** only if your data source uses a self-signed certificate.

   :::image type="content" source="media/blob-access-points-create/basics-tab.png" alt-text="Screenshot of the Basics tab of a new blob access point configuration, with a public connection and sample values entered.":::

1. Select **Next**.

1. On the **Create blob access point** tab, select **+ Blob access point**, and then enter a name for the blob access point. Add only one blob access point. The name follows [container naming rules](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names) and must not match an existing container in the storage account.

   :::image type="content" source="media/blob-access-points-create/create-blob-access-point-tab.png" alt-text="Screenshot of the Create blob access point tab with one blob access point name entered.":::

1. Select **Next**, review your settings, and then select **Create**.

   :::image type="content" source="media/blob-access-points-create/review-create.png" alt-text="Screenshot of the Review + create tab for a new blob access point configuration with a public connection.":::

When the deployment finishes, the configuration appears in the list with the status **Active**, and its blob access point appears on the **Containers** page, on the **Blob access points** tab.

### [REST API](#tab/rest-api)

Create the configuration by sending a `PUT` request. Replace the placeholder values with your own.

```http
PUT https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobAccessPointConfigurations/<configuration-name>?api-version=2026-09-01
Content-Type: application/json
```

```json
{
  "location": "<storage-account-region>",
  "properties": {
    "state": "Active",
    "description": "<description>",
    "source": {
      "sourceType": "AzureNetAppFiles",
      "connection": {
        "connectionType": "Endpoint",
        "endpoint": "https://s3.contoso.com/bucket1",
        "tlsVerification": "Perform"
      },
      "auth": {
        "authType": "AccessKey",
        "accessKeyId": "<access-key-id>",
        "secretAccessKey": "<secret-access-key>",
        "signingRegion": "us-east-1"
      }
    }
  }
}
```

The following table describes the request body.

| Property | Required | Description |
|---|---|---|
| `location` | Yes | The region of the storage account. |
| `properties.state` | No | `Active` or `Inactive`. Use `Active` to serve data. |
| `properties.description` | No | Free text. |
| `properties.source.sourceType` | Yes | `AzureNetAppFiles`, `Qumulo`, `Nasuni`, or `Commvault`. |
| `properties.source.connection.connectionType` | Yes | `Endpoint` for a public connection. `PrivateLink` for a private connection. |
| `properties.source.connection.endpoint` | Yes | The source endpoint URL, including the bucket. |
| `properties.source.connection.tlsVerification` | No | `Perform` validates the certificate of the data source. `Skip` accepts self-signed certificates and is less secure. |
| `properties.source.auth.authType` | Yes | `AccessKey`. |
| `properties.source.auth.accessKeyId` | Yes | The access key ID for the data source. |
| `properties.source.auth.secretAccessKey` | Yes | The secret access key for the data source. |
| `properties.source.auth.signingRegion` | No | The signing region. The default is `us-east-1`. |

`PUT` creates a configuration only. If a configuration with the same name already exists, the request is rejected. To change a configuration, use `PATCH`. For more information, see [Manage blob access points](blob-access-points-manage.md).

A `201` or `202` response means the service accepted the request, not that provisioning is complete. Send `GET` requests to the same URL until `properties.provisioningState` is `Succeeded`, `Failed`, or `Canceled`.

When provisioning succeeds, save the value of `properties.uniqueId` from the response. You need it to test the connection and to create the blob access point.

---

> [!IMPORTANT]
> Billing starts when you create an active configuration. You're billed for every hour that the configuration stays active, even when no one reads data through it. To stop charges for a data source that you aren't using, [deactivate the configuration](blob-access-points-manage.md#deactivate-or-activate-a-configuration).

## Test the connection

Creating a configuration doesn't prove that Azure Storage can reach your data source or that your credentials work. The connection test checks the following items:

| Check | Passes when |
|---|---|
| Network path | Azure Storage reaches the source endpoint. |
| Authentication | The data source accepts the access key ID and secret access key. |
| Request signing | The signing region matches what the data source expects. |

### [Portal](#tab/azure-portal)

1. On the **Blob access points** page, select the configuration.

1. On the **Overview** page, select **Test connection**.

   When the test finishes, **Connection tested** shows **Successful** with the time of the test.

   :::image type="content" source="media/blob-access-points-create/connection-tested.png" alt-text="Screenshot of a blob access point configuration overview, with a successful connection test highlighted." lightbox="media/blob-access-points-create/connection-tested.png":::

### [REST API](#tab/rest-api)

```http
POST https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobAccessPointConfigurations/<configuration-name>/testExistingConnection?api-version=2026-09-01
Content-Type: application/json
```

```json
{
  "uniqueId": "<configuration-unique-id>"
}
```

A successful test returns a response in which `errorMessage` is `null`.

```json
{
  "errorMessage": null,
  "methodName": "TestExistingConnection",
  "requestId": "<request-id>"
}
```

---

If the test fails, see [Connection test fails](blob-access-points-troubleshoot.md#connection-test-fails).

## Create a blob access point

A blob access point is a container that's linked to your configuration. You link it when you create it, and you can't change the link later. Each configuration serves one blob access point. The name of the blob access point follows [container naming rules](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names) and must not match an existing container in the storage account.

### [Portal](#tab/azure-portal)

If you added a blob access point on the **Create blob access point** tab, it already exists. Skip to [Verify blob access point creation](#verify-blob-access-point-creation).

Otherwise, create it from the configuration:

1. On the **Overview** page of the configuration, select **+ Blob access point**.

1. Enter a **Name** for the blob access point.

1. Select **Create**.

### [REST API](#tab/rest-api)

Use the [Create Container](/rest/api/storageservices/create-container) operation with two extra headers that link the container to the configuration.

```http
PUT https://<storage-account>.blob.core.windows.net/<blob-access-point>?restype=container
x-ms-version: 2026-12-06
x-ms-date: <utc-date-time>
x-ms-blob-access-point-configuration-name: <configuration-name>
x-ms-blob-access-point-configuration-unique-id: <configuration-unique-id>
Authorization: <authorization>
```

| Header | Description |
|---|---|
| `x-ms-version` | `2026-12-06` or later. Earlier versions don't recognize the blob access point headers. |
| `x-ms-date` | The current UTC time in RFC 1123 format, such as `Mon, 02 Nov 2026 16:00:00 GMT`. |
| `x-ms-blob-access-point-configuration-name` | The name of the configuration. |
| `x-ms-blob-access-point-configuration-unique-id` | The `uniqueId` of the configuration. If you omit it, the service uses the current unique ID of the named configuration. Send both headers so that the service validates both. |

A `201 Created` response means the blob access point was created. If the configuration doesn't exist in the storage account, or the unique ID doesn't match, the request fails with status code `409`. For more information, see [Troubleshoot blob access points](blob-access-points-troubleshoot.md).

---

## Verify blob access point creation

### [Portal](#tab/azure-portal)

1. In your storage account, under **Data storage**, select **Containers**.

1. Select the **Blob access points** tab, and then select your blob access point.

   The blobs from your data source appear. The **Blob access point configuration** field shows the configuration that the blob access point uses.

   :::image type="content" source="media/blob-access-points-create/browse-blob-access-point.png" alt-text="Screenshot of blobs from an external data source listed in a blob access point in the Azure portal." lightbox="media/blob-access-points-create/browse-blob-access-point.png":::

   If the portal says that the networking settings of the storage account might be blocking access, allow your client in the network rules of the storage account. For more information, see [Networking considerations](blob-access-points-overview.md#networking-considerations).

### [REST API](#tab/rest-api)

Call [Get Container Properties](/rest/api/storageservices/get-container-properties) with `x-ms-version` set to `2026-12-06` or later. For a blob access point, the response includes these headers:

| Header | Value |
|---|---|
| `x-ms-is-blob-access-point-container` | `true` |
| `x-ms-blob-access-point-configuration-name` | The name of the configuration |
| `x-ms-blob-access-point-configuration-unique-id` | The unique ID of the configuration |

To see all the blob access points in the storage account, call [List Containers](/rest/api/storageservices/list-containers2) instead. Each blob access point entry includes the same three values as elements under `Properties`. For an example, see [Access data in a blob access point](blob-access-points-access-data.md#read-data-with-the-rest-api).

Then call [List Blobs](/rest/api/storageservices/list-blobs) on the blob access point to list the objects from your data source.

---

## Related content

- [Access data in a blob access point](blob-access-points-access-data.md)
- [Manage blob access points](blob-access-points-manage.md)
- [Troubleshoot blob access points](blob-access-points-troubleshoot.md)
