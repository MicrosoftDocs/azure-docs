---
title: Change feed for Azure Files
titleSuffix: Azure Storage
description: Learn how Azure Files change feed records file and directory changes and how applications can consume those records.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 10/05/2026
ms.author: kendownie
# Customer intent: As an application developer, I want to process file and directory changes without repeatedly scanning an Azure file share.
---

# Change feed for Azure Files

Azure Files change feed provides a durable, ordered, immutable, read-only log of changes to files and directories in an Azure file share. Applications can process the feed in streaming or batch mode to identify changes without repeatedly scanning the entire share.

Use Azure Files change feed to build solutions that:

- Perform incremental backup and disaster recovery.
- Maintain a search index, cache, or catalog.
- Synchronize data to another store or an on-premises file system.
- Audit and analyze file and directory changes.
- Drive pipelines that process changed content.

> [!IMPORTANT]
> Azure Files change feed is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Preview features aren't recommended for production workloads.

## How the change feed works

Enabling change feed is a two-step operation. First, enable the capability on the storage account. Then enable change feed on each file share that you want to track. This scope differs from Blob Storage change feed, which is enabled once for an entire account.

Every supported data or metadata change to a tracked share is recorded as an event in an append-only Apache Avro log. The service stores each share's log in a system blob container in the same storage account.

Change feed has the following characteristics:

- **Ordered and immutable:** Events are grouped into time windows called *segments*. After a segment is finalized, it doesn't change, so reads are repeatable and a consumer can restart from a saved position.
- **Asynchronous:** Events become available shortly after the operation that produced them completes. Change feed isn't a synchronous notification mechanism.
- **Resumable:** Consumers can persist continuation tokens and resume after an interruption.
- **Configurable retention:** The service automatically removes events after the retention period configured on the share.
- **Independent consumers:** Each application reads and checkpoints the log independently.

Logging starts after change feed is enabled. Changes made before enablement or while the feed is disabled aren't recorded.

## Feature support

Your subscription and region must be enabled for the preview. If the feature isn't available, an enablement request returns `400 Bad Request` with the error code `FeatureNotAvailableInRegion`.

| Item | Preview support |
| --- | --- |
| Billing models | Standard pay-as-you-go and provisioned v2 |
| Premium file shares | Not supported |
| Share protocols | SMB and File REST API |
| Tracked operations | Data and metadata changes made over SMB and the File REST API |
| Minimum File service version | `2026-02-06` |
| Minimum management API version | `2026-04-01` |
| Client library | .NET `Azure.Storage.Files.Shares.ChangeFeed` prerelease package |

Provisioned v2 accounts require the `Microsoft.Storage/EnableFilesChangeFeed` subscription feature. To request registration, use [Register-AzProviderFeature](/powershell/module/az.resources/register-azproviderfeature):

```azurepowershell
Register-AzProviderFeature `
    -ProviderNamespace Microsoft.Storage `
    -FeatureName EnableFilesChangeFeed
```

Registration can take time to complete. Check its state by using `Get-AzProviderFeature` before enabling change feed.

## Enable and configure change feed

Change feed configuration uses the management plane. You can't enable, disable, or reconfigure change feed through the File REST API, SMB, or NFS. The data plane reports the current settings and log location so that consumers can find the feed.

### Enable change feed on the storage account

# [Azure portal](#tab/portal-account)

When you create a storage account, enable **Files change feed** on the **Data protection** tab. You can also enable the account capability when you configure change feed on an existing file share.

# [PowerShell](#tab/powershell-account)

The following example uses management API version `2026-04-01` to enable the account capability. Replace the placeholder values with values for your environment.

```azurepowershell
$subscriptionId = '<subscription-id>'
$resourceGroupName = '<resource-group>'
$storageAccountName = '<storage-account>'
$apiVersion = '2026-04-01'

$accountPath = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName" +
    "/providers/Microsoft.Storage/storageAccounts/$storageAccountName" +
    "?api-version=$apiVersion"

$body = @{
    properties = @{
        enableFilesChangeFeed = $true
    }
} | ConvertTo-Json -Depth 10

Invoke-AzRestMethod -Method PATCH -Path $accountPath -Payload $body
```

# [REST API](#tab/rest-account)

Send the following management request with an access token that is authorized to update the storage account:

```http
PATCH https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>?api-version=2026-04-01
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "properties": {
    "enableFilesChangeFeed": true
  }
}
```

---

Enabling this property provisions a Blob Storage endpoint on the account because the service stores change feed logs as blobs.

### Enable change feed on a file share

# [Azure portal](#tab/portal-share)

1. In the Azure portal, open the storage account.
1. Under **Data storage**, select **File shares**, and then select the file share.
1. Under **Properties**, find **Feature status**, and select **Change feed**.
1. Enable change feed and specify a retention period from 1 through 365 days.
1. Select **Save**.

You can also enable change feed and set retention when you create a file share.

# [PowerShell](#tab/powershell-share)

Set `changeFeedEnabled` and `changeFeedRetentionInDays` on the file share resource:

```azurepowershell
$shareName = '<file-share>'
$sharePath = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName" +
    "/providers/Microsoft.Storage/storageAccounts/$storageAccountName" +
    "/fileServices/default/shares/$shareName?api-version=$apiVersion"

$body = @{
    properties = @{
        changeFeedEnabled = $true
        changeFeedRetentionInDays = 7
    }
} | ConvertTo-Json -Depth 10

Invoke-AzRestMethod -Method PATCH -Path $sharePath -Payload $body
```

# [REST API](#tab/rest-share)

```http
PATCH https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/shares/<file-share>?api-version=2026-04-01
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "properties": {
    "changeFeedEnabled": true,
    "changeFeedRetentionInDays": 7
  }
}
```

---

If you enable change feed without specifying retention, the default is seven days. Valid retention values are 1 through 365 days. Increasing retention doesn't recover records that the service already deleted.

### Verify the configuration

Read the file share resource from the management plane and inspect `changeFeedEnabled` and `changeFeedRetentionInDays`:

```azurepowershell
$share = (Invoke-AzRestMethod -Method GET -Path $sharePath).Content |
    ConvertFrom-Json

$share.properties |
    Select-Object changeFeedEnabled, changeFeedRetentionInDays
```

A consumer can discover the log by calling Get Share Properties with File service version `2026-02-06` or later:

```http
GET https://<storage-account>.file.core.windows.net/<file-share>?restype=share
x-ms-version: 2026-02-06
Authorization: Bearer <access-token>
```

The response includes the following headers:

```http
x-ms-file-enable-change-feed: True
x-ms-file-change-feed-retention-in-days: 7
x-ms-file-blob-container-for-xfiles-change-feed: $fileschangefeed-<GUID>
```

These values aren't returned for share snapshots. A share that has never had change feed configured reports `false` and `0`.

### Disable change feed

To stop recording events for a share, set `changeFeedEnabled` to `false`:

```azurepowershell
$body = @{
    properties = @{
        changeFeedEnabled = $false
    }
} | ConvertTo-Json -Depth 10

Invoke-AzRestMethod -Method PATCH -Path $sharePath -Payload $body
```

To turn off the account capability, set `enableFilesChangeFeed` to `false`. You can't disable the account capability while any share in the account still has change feed data. The request fails with `FilesChangeFeedContainersExist`. Disable change feed on every share and allow retained log data to expire first.

## Consume the change feed

The recommended way to read change feed is the .NET client library. The client handles log discovery, segment ordering, the last consumable watermark, Avro deserialization, reset detection, and resumable reads.

Install the prerelease package:

```dotnetcli
dotnet add package Azure.Storage.Files.Shares.ChangeFeed --prerelease
```

Create a client from an existing `ShareClient`, and enumerate the available events:

```csharp
using Azure.Identity;
using Azure.Storage.Files.Shares;
using Azure.Storage.Files.Shares.ChangeFeed;

var serviceUri = new Uri("https://<storage-account>.file.core.windows.net");
var shareClient = new ShareServiceClient(serviceUri, new DefaultAzureCredential())
    .GetShareClient("<file-share>");

ShareChangeFeedClient changeFeedClient =
    shareClient.GetShareChangeFeedClient();

await foreach (ShareChangeFeedEvent change in changeFeedClient.GetChangesAsync())
{
    Console.WriteLine(
        $"{change.EventTime:o} {change.Reason} {change.EventData.FullFilePath}");
}
```

The client provides methods to:

- Enumerate all available events up to the last consumable watermark.
- Read a bounded time range.
- Resume from a continuation token.
- Enumerate changes between two share snapshots.
- Get the latest complete and safe point in the log.
- Check whether snapshot metadata is finalized.

### Resume with a continuation token

For a long-running consumer, enumerate by page and persist the continuation token only after successfully processing the entire page:

```csharp
string? continuationToken = LoadCheckpoint();

await foreach (Page<ShareChangeFeedEvent> page in
    changeFeedClient.GetChangesAsync(continuationToken).AsPages())
{
    foreach (ShareChangeFeedEvent change in page.Values)
    {
        Process(change);
    }

    SaveCheckpoint(page.ContinuationToken);
}
```

A continuation token is bound to the storage account that issued it. Pass a saved token to `GetChanges` or `GetChangesBetweenSnapshots`, not to `AsPages`.

### Read the log directly

For languages without a change feed client library, you can read the system container with a Blob Storage client library:

1. Call Get Share Properties and read the container name from `x-ms-file-blob-container-for-xfiles-change-feed`.
1. Read `meta/reset-latest.json` and check for a new reset identifier.
1. Read `meta/segments.json` and note the `lastConsumable` watermark.
1. For each segment up to the watermark, read its `meta.json` file and confirm that its status is `Finalized`.
1. Read the Avro blobs listed by `chunkFilePaths`.
1. Process the records and advance your checkpoint to the end of the window.

> [!WARNING]
> System containers are managed by the service. Treat their contents as read-only. Don't write, modify, or delete objects in these containers. Read segment duration and log locations from segment metadata instead of constructing paths or hard-coding a window length.

Each share uses a container named `$fileschangefeed-<GUID>`. An account-level `$fileschangefeedsys` container is reserved for service use and isn't accessible with customer credentials.

## Change event records

Each Avro record describes one change. The current schema version is `0`.

| Field | Description |
| --- | --- |
| `SchemaVersion` | Version of the record schema. Read fields by name and ignore unrecognized fields. |
| `Reason` | Code that describes the change. |
| `Protocol` | Protocol that produced the change: `Smb`, `Rest`, or `Unknown`. |
| `EventTime` | UTC time at which the change occurred. |
| `Id` | Correlation identifier for the operation. |
| `Cvnt` | Container version number of the share at the time of the change. |
| `Data.FileId` | Stable identifier of the file or directory. |
| `Data.ParentFileId` | File ID of the parent directory. |
| `Data.NewParentFileId` | Destination parent ID for a rename or move. |
| `Data.Etag` | Entity tag after the change. |
| `Data.FileName` | Item name without its directory path. |
| `Data.FullFilePath` | Path relative to the share root at the time of the change. |
| `Data.NewFullFilePath` | Destination path for a rename or move. |
| `Data.IsDirectory` | Indicates whether the item is a directory. |
| `Data.Identity` | Reserved identity fields. These fields aren't populated in the current preview. |
| `Data.Initiator` | Reserved initiator field. This field isn't populated in the current preview. |

Unavailable string values are emitted as `N/A`. `NewParentFileId` and `NewFullFilePath` are empty when the event isn't a rename or move. Treat both forms as no value.

### Change reason codes

Reason codes include the following values:

| Protocol | Reason codes |
| --- | --- |
| SMB | `SmbCreate`, `SmbRename`, `SmbDelete`, `SmbWrite`, `SmbExtend`, `SmbCreateTruncate`, `SetInfo`, `SetSecurityInfo` |
| REST | `RestCreate`, `RestRename`, `RestDelete`, `RestWrite`, `RestCreateTruncate`, `RestSetInfo`, `RestSetSecurityInfo`, `SyncCopyFile`, `AsyncCopyFile` |
| Service | `RESET`, `ControlEvent`, `UnknownEventType` |

The list can grow over time. Design consumers to ignore reason codes they don't recognize. Ignore `ControlEvent` and `UnknownEventType` records.

## Handle reset events

A reset marks a boundary where the log is no longer continuous with its earlier history. Records before the boundary might be missing or might describe changes that are no longer reflected in the share. Records after the boundary are complete and consistent with the share.

Resets can occur after a customer-managed unplanned failover or when the service restarts change tracking for the account. The service reports a reset both as an in-band `RESET` record and as marker blobs under `meta/resets/`.

The `meta/reset-latest.json` pointer identifies the newest reset marker:

```json
{
    "schemaVersion": 1,
    "latestResetId": "9f2c1c6e-4c0a-4d1e-9d6b-2b7a4c1e83f0",
    "latestResetFileTime": 134288352000000000,
    "latestResetTimeUtc": "2026-07-18T08:00:00.000Z",
    "accountName": "mystorageaccount",
    "containerName": "myshare",
    "reason": "CustomerManagedUnplannedFailover",
    "latestMarkerPath": "meta/resets/00134288352000000000.json"
}
```

The pointer doesn't exist for a share that has never been reset. Treat a `404` response as no reset. Use `latestResetId` to detect a new boundary and `latestMarkerPath` to read its immutable marker.

When a consumer detects a new reset identifier:

1. Stop incremental processing and discard checkpoints issued before the reset.
1. Record the reset identifier and reset time.
1. Rebaseline by enumerating the entire share or a new share snapshot.
1. Resume incremental processing from the reset boundary.

> [!IMPORTANT]
> Never treat records from before and after a reset as a complete history. Backup and replication workloads must perform a full enumeration after a reset.

The client library can either throw `ShareChangeFeedResetException` or return a `ShareChangeFeedResetEvent`, depending on the configured `ShareChangeFeedResetPolicy`. Bounded reads fail on reset by default. Open-ended reads return reset events in order by default.

## Work with share snapshots

Every event includes a container version number. When a share snapshot is taken, the feed writes metadata that maps the snapshot to a container version and its bounding log windows.

Use `GetSnapshotStatus` to confirm that the ending snapshot is finalized, and then use `GetChangesBetweenSnapshots` to enumerate events between two snapshots. Snapshot-scoped queries support continuation tokens.

## Differences from Blob Storage change feed

Azure Files change feed uses the container layout, Avro encoding, segment model, and last consumable watermark from Blob Storage change feed. The following table describes the key differences:

| Aspect | Blob Storage change feed | Azure Files change feed |
| --- | --- | --- |
| Scope | Enabled once for an account and covers all containers. | Enabled on the account and then on each share. |
| Log location | One `$blobchangefeed` container per account. | One `$fileschangefeed-<GUID>` container per share. |
| Log discovery | Uses a well-known container name. | Uses the container name returned by Get Share Properties. |
| Item identity | Uses the blob name. A rename is a copy followed by a delete. | Uses stable file and parent IDs. Renames and moves preserve the file ID. |
| Hierarchy | Blob names can contain `/`, but directories aren't distinct resources. | Includes directory resources and directory events. |
| Snapshot integration | Doesn't expose snapshot-scoped change enumeration. | Uses container version numbers and snapshot metadata for snapshot-scoped queries. |
| Protocol attribution | Not applicable. | Identifies whether a change occurred over SMB or REST. |
| Discontinuities | Doesn't expose reset markers. | Uses reset markers to identify failover and tracking reset boundaries. |

## Pricing and billing

The service stores change feed data as blobs in the same storage account. Stored log data and requests made to read it are billed at the applicable Blob Storage rates. Retention duration and change volume directly affect storage and transaction costs. For more information about Azure Files billing models, see [Understand Azure Files billing](understanding-billing.md).

## Preview limitations

- Change feed is available only to enabled subscriptions and regions.
- Premium file shares and NFS operations aren't supported.
- Configuration uses the management plane and isn't available through the File REST API, SMB, or NFS.
- Configuration isn't returned for share snapshots and can't be set on a snapshot or a soft-deleted share.
- Events are asynchronous and only changes made while the feed is enabled are recorded.
- Identity and initiator fields aren't populated.
- Consumers must tolerate unknown fields and reason codes and must handle resets.
- An asynchronous copy emits an event when the copy starts, but not when it completes.
- A rename that replaces an existing file doesn't identify the replaced file.

## Next steps

- [Overview of application development with Azure Files](storage-files-developer-overview.md)
- [Share snapshots for Azure Files](storage-snapshots-files.md)
- [File service REST API](/rest/api/storageservices/file-service-rest-api)
- [Change feed support in Azure Blob Storage](../blobs/storage-blob-change-feed.md)