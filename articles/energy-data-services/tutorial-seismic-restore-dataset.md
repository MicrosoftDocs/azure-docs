---
title: "Tutorial: Restore a seismic dataset to a previous point in time"
titleSuffix: Microsoft Azure Data Manager for Energy
description: "Learn how to restore a single seismic dataset and its metadata to a previous point in time in Azure Data Manager for Energy."
author: abpatil
ms.author: abpatil
ms.service: azure-data-manager-energy
ms.topic: tutorial
ms.date: 08/11/2026

#Customer intent: As a data manager, I want to restore a seismic dataset to a previous point in time so that I can recover from an unintended update or deletion.

---

# Tutorial: Restore a seismic dataset to a previous point in time

> [!IMPORTANT]
> This feature is currently in preview and is available on request for the Standard SKU. To enable it, create an Azure support request. For instructions, see [How do I raise a support request for Azure Data Manager for Energy?](faq-energy-data-services.yml#how-do-i-raise-a-support-request-for-azure-data-manager-for-energy) See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Use the Seismic DDMS restore operation in Azure Data Manager for Energy to restore one seismic dataset to an earlier point in time. The operation restores both the dataset metadata and its associated blob data to the state that existed at the timestamp you specify. This operation can help recover a dataset after an unintended update or deletion, provided that a restorable version is still available within the fixed 30-day retention period.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Choose a valid restore point
> * Initiate a restore operation for a single dataset
> * Monitor the restore operation status
> * Understand restore limitations

## Prerequisites

Before you begin, make sure you meet the following prerequisites:

- An Azure Data Manager for Energy Standard SKU resource with the Seismic DDMS restore preview enabled.
- A registered `tenant` and `subproject` in the Seismic DDMS service.
- The `subproject.admin` role assigned to your user account.
- A bearer token for API authentication. See [How to generate auth token](how-to-generate-auth-token.md).
- The `sdPath` of the seismic dataset that you want to restore.
- A restore point within the fixed 30-day retention period. The retention period isn't configurable.

## Restore API operations

The restore workflow uses two API operations:

| Operation | Method and endpoint | Purpose |
| --- | --- | --- |
| Start a restore | `POST /seistore-svc/api/v3/operation/restore` | Starts an asynchronous restore for the dataset identified by `sdPath`. The request body includes `restorePointInTime`, which specifies the historical state to restore. |
| Get restore status | `GET /seistore-svc/api/v3/operation/restore/{operation_id}` | Returns the current status of the restore. Use the `operation_id` returned by the start operation. |

## Choose a restore point

The `restorePointInTime` value identifies the state to restore. Specify the value as an ISO 8601 UTC timestamp, for example, `2026-07-10T08:30:00.000Z`.

The restore point must meet all the following requirements:

- It's in the past.
- It's within the fixed 30-day restore retention period.
- It's later than the dataset creation time.

Choose a timestamp immediately before the unintended update or deletion. The restored state doesn't include any dataset changes made after the selected timestamp.

## Initiate a restore operation

Before you submit the request, stop write and delete operations on the dataset. The restore operation locks the dataset while it restores the metadata and blob data.

1. Submit a POST request to the restore endpoint. The `sdPath` must identify one dataset, not a directory:

   ```http
   POST <instance>.energy.azure.com/seistore-svc/api/v3/operation/restore
   Authorization: Bearer <access_token>
   data-partition-id: <data_partition_id>
   Content-Type: application/json

   {
     "sdPath": "sd://<tenant>/<subproject>/<path>/<dataset_name>",
     "restorePointInTime": "2026-07-10T08:30:00.000Z"
   }
   ```

1. Save the `operation_id` or `statusUrl` from the `202 Accepted` response. You need one of these values to monitor the operation:

   ```json
   {
     "operation_id": "c3d282e6-e7d1-40d8-8ac2-edc15b6d174c",
     "statusUrl": "/seistore-svc/api/v3/operation/restore/c3d282e6-e7d1-40d8-8ac2-edc15b6d174c"
   }
   ```

> [!NOTE]
> A `202 Accepted` response means that the request passed initial validation and was queued. It doesn't mean that the restore completed successfully. Continue to poll the status endpoint until the operation reaches a terminal state.

## Monitor the restore operation

Poll the status endpoint to track the asynchronous restore.

1. Send a GET request with the `operation_id`:

   ```http
   GET <instance>.energy.azure.com/seistore-svc/api/v3/operation/restore/<operation_id>
   Authorization: Bearer <access_token>
   data-partition-id: <data_partition_id>
   ```

1. Check the `status` field in the response. The operation can move through `Enqueued` and `InProgress` before it reaches a terminal state.

   ```json
   {
     "operationId": "c3d282e6-e7d1-40d8-8ac2-edc15b6d174c",
     "status": "InProgress",
     "sdPath": "sd://opendes/test-subproject/surveys/dataset1",
     "restorePointInTime": "2026-07-10T08:30:00.000Z",
     "tenant": "opendes",
     "subproject": "test-subproject",
     "createdBy": "00000000-0000-0000-0000-000000000000",
     "startedAt": "2026-07-15T10:00:00.000Z",
     "lastUpdatedAt": "2026-07-15T10:00:05.000Z"
   }
   ```

1. Stop polling when `status` is one of the following terminal values:

   | Status | Description |
   | --- | --- |
   | `Succeeded` | The dataset metadata and blob data were restored to the selected point in time. |
   | `Failed` | The restore started but couldn't complete. Review `errorDetails` for the cause. |
   | `Rejected` | The service couldn't start the restore, for example because the dataset was locked or no restorable state was available. Review `errorDetails` for the cause. |

   The following example shows a rejected restore:

   ```json
   {
     "operationId": "c3d282e6-e7d1-40d8-8ac2-edc15b6d174c",
     "status": "Rejected",
     "sdPath": "sd://opendes/test-subproject/surveys/dataset1",
     "restorePointInTime": "2026-07-10T08:30:00.000Z",
     "createdBy": "00000000-0000-0000-0000-000000000000",
     "errorDetails": "Restore rejected: the dataset is currently locked by another in-progress write operation. Wait for that operation to finish and release the lock, then retry this restore.",
     "lastUpdatedAt": "2026-07-15T10:00:07.000Z",
     "completedAt": "2026-07-15T10:00:07.000Z"
   }
   ```

After the operation succeeds, retrieve or download the dataset and confirm that its metadata and contents match the expected state.

## Limitations and considerations

Consider the following limitations before you initiate a restore:

- **Single dataset only**—Each request restores one dataset. You can't specify a directory, restore every dataset under a path, or submit multiple datasets in one request.
- **Fixed retention window applies**—You can't restore to a timestamp outside the 30-day retention period. The retention period isn't configurable and can't be overridden in the request.
- **One restore per data partition**—Only one restore operation can run in a data partition at a time, even if another request targets a different dataset. A concurrent request returns `409 Conflict`.
- **Restore is asynchronous**—A `202 Accepted` response isn't confirmation of success. You must poll the status endpoint.
- **Writes must be paused**—An active write lock can cause the operation to be rejected. Don't update or delete the dataset until the restore reaches a terminal state.
- **The current state is replaced**—A successful restore makes the selected historical version the current dataset state. Updates made after the restore point aren't present in the restored version.
- **Feature availability is limited**—The restore operation is a preview feature that must be enabled for a Standard SKU instance. If it isn't enabled, the service returns `403 Forbidden`.

## Clean up resources

This tutorial doesn't create any billable Azure resources. If you performed a restore for testing, verify the dataset state before resuming write operations.

## Related content

- [Tutorial: Work with seismic data by using Seismic DDMS APIs](tutorial-seismic-ddms.md)
- [Change the storage tier of seismic datasets](tutorial-seismic-change-tier.md)
- [How to generate auth token](how-to-generate-auth-token.md)
- [Seismic DDMS API reference](https://microsoft.github.io/adme-samples/)
