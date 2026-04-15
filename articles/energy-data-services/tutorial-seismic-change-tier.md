---
title: Change storage tier for seismic datasets in Azure Data Manager for Energy
description: "Learn how to change the storage tier of seismic datasets in Azure Data Manager for Energy to optimize storage costs using Hot, Cool, and Cold tiers."
author: bharathim
ms.author: bselvaraj
ms.service: azure-data-manager-energy
ms.topic: tutorial
ms.date: 03/10/2026

#Customer intent: As a data manager, I want to change the storage tier of my seismic datasets so that I can optimize storage costs based on data access frequency.

---

# Tutorial: Change the storage tier of seismic datasets

> [!IMPORTANT]
> This feature is currently in preview and available by default on Developer SKU. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Use the Seismic DDMS Change Tier operation in Azure Data Manager for Energy to move datasets between **Hot**, **Cool**, and **Cold** storage tiers based on access frequency. Moving rarely accessed data to cooler tiers reduces storage costs, while keeping active datasets in the Hot tier ensures optimal performance. This operation is especially valuable for seismic data management, where large volumes of historical data must remain available for future analysis or compliance but don't require frequent access.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
>
> * Initiate a change tier operation for a dataset or path
> * Monitor the change tier operation status
> * Retrieve failure details for failed datasets

## Understand storage tiers

Seismic DDMS supports the following storage tiers, which map to the underlying cloud provider's storage classes:

| Tier | Access frequency | Access latency | Storage cost | Use case |
| --- | --- | --- | --- | --- |
| **Hot** | Frequently accessed | Milliseconds | Highest | Active projects, recent acquisitions |
| **Cool** | Infrequently accessed (30+ days) | Milliseconds | Lower | Completed projects, periodic reprocessing |
| **Cold** | Rarely accessed (90+ days) | Milliseconds to hours | Lowest | Long-term storage, regulatory compliance |

Each tier has a minimum retention period. Moving data out of a tier before the minimum retention period elapses might incur early deletion charges.

## Prerequisites

Before you begin, make sure you meet the following prerequisites:

- An Azure Data Manager for Energy resource with Seismic DDMS configured.
- A registered `tenant` and `subproject` in the Seismic DDMS service.
- The `subproject.admin` role assigned to your user account.
- A bearer token for API authentication. See [How to generate auth token](how-to-generate-auth-token.md).
- At least one dataset registered in the target subproject.

## Initiate a change tier operation

Before you submit the request, pause all write and delete operations on the target path. Adding or deleting datasets while a change tier operation is in progress can lead to inconsistent results.

1. Submit a PUT request with the path and target tier. Use a trailing `/` for directory paths (for example, `sd://tenant/subproject/a/b/c/`) and no trailing slash for a single dataset (for example, `sd://tenant/subproject/a/b/c/dataset-name`):

   - All datasets in a path:

     ```http
     PUT <instance>.energy.azure.com/seistore-svc/api/v3/operation/change-tier?path=sd://{tenant}/{subproject}/{path}/&tier=Cool
     Authorization: Bearer {access_token}
     Content-Type: application/json
     ```

   - Single dataset:

     ```http
     PUT <instance>.energy.azure.com/seistore-svc/api/v3/operation/change-tier?path=sd://{tenant}/{subproject}/{path}/{dataset_name}&tier=Cool
     Authorization: Bearer {access_token}
     Content-Type: application/json
     ```

1. Save the `operation_id` from the `202 Accepted` response. You need it to monitor the operation.

   ```json
   {
     "operation_id": "c3d282e6-e7d1-40d8-8ac2-edc15b6d174c"
   }
   ```

## Monitor the operation status

After you initiate the change tier operation, poll the status endpoint to track progress.

1. Poll the status endpoint with the `operation_id` until `status` is `Completed` or `Failed`:

   ```http
   GET <instance>.energy.azure.com/seistore-svc/api/v3/operation/change-tier/{operation_id}
   Authorization: Bearer {access_token}
   data-partition-id: {data_partition_id}
   ```

1. Check the `status` field in the response. While the operation is running:

   ```json
   {
     "operation_id": "c3d282e6-e7d1-40d8-8ac2-edc15b6d174c",
     "created_at": "2026-03-10T06:15:00Z",
     "created_by": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
     "last_updated_at": "2026-03-10T06:17:30Z",
     "status": "Running",
     "dataset_cnt": 500,
     "completed_cnt": 342,
     "failed_cnt": 0,
     "target_tier": "Cool"
   }
   ```

   When the operation finishes, `status` changes to `Completed`. Check `failed_cnt` for partial failures:

   ```json
   {
     "operation_id": "c3d282e6-e7d1-40d8-8ac2-edc15b6d174c",
     "created_at": "2026-03-10T06:15:00Z",
     "created_by": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
     "last_updated_at": "2026-03-10T06:25:00Z",
     "status": "Completed",
     "dataset_cnt": 500,
     "completed_cnt": 497,
     "failed_cnt": 3,
     "target_tier": "Cool"
   }
   ```

## Retrieve failure details

Use the `show_details=true` parameter to get per-dataset error information for any datasets that fail during the tier change.

1. Add `show_details=true` to the status request:

   ```http
   GET <instance>.energy.azure.com/seistore-svc/api/v3/operation/change-tier/{operation_id}?show_details=true&limit=100
   Authorization: Bearer {access_token}
   data-partition-id: {data_partition_id}
   ```

   The following query parameters control the response:

   | Parameter | Required | Type | Description |
   | --------- | -------- | ---- | ----------- |
   | `show_details` | No | boolean | Set to `true` to include the `failed_datasets` array in the response. Default: `false`. |
   | `limit` | No | integer (1–1000) | Maximum number of failed datasets to return per page. Default: `100`. Only applicable when `show_details=true`. |
   | `cursor` | No | string | Base64 URL-safe-encoded cursor from a previous response to retrieve the next page of failures. |

1. Review the `failed_datasets` array in the response:

   ```json
   {
     "operation_id": "c3d282e6-e7d1-40d8-8ac2-edc15b6d174c",
     "created_at": "2026-03-10T08:00:00Z",
     "created_by": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
     "last_updated_at": "2026-03-10T08:45:00Z",
     "status": "CompletedWithErrors",
     "dataset_cnt": 2000,
     "completed_cnt": 1994,
     "failed_cnt": 6,
     "target_tier": "Cold",
     "failed_datasets": [
       {
         "sdpath": "sd://opendes/project-alpha/seismic/survey-2024-001",
         "error": "Failed to change tier for 12 blob(s)"
       },
       {
         "sdpath": "sd://opendes/project-alpha/seismic/survey-2024-002",
         "error": "Access denied: user is not authorized to modify this dataset (ACL validation failed)"
       },
       {
         "sdpath": "sd://opendes/project-alpha/seismic/survey-2024-003",
         "error": "Failed to acquire lock"
       },
       {
         "sdpath": "sd://opendes/project-alpha/seismic/survey-2024-004",
         "error": "Dataset has no associated storage location"
       },
       {
         "sdpath": "sd://opendes/project-alpha/seismic/survey-2024-005",
         "error": "Dataset storage location has invalid format"
       },
       {
         "sdpath": "sd://opendes/project-alpha/seismic/survey-2024-006",
         "error": "Tier changed but metadata update failed after retries"
       }
     ],
     "cursor": "ZXlKamIyNTBhVzUxWVhScGIyNVViMnRsYmlJNkltVjRZVzF3YkdVaWZRPT0"
   }
   ```

   If the response includes a `cursor` value, pass it in the next request to retrieve the next page of failures.

## Storage tier retention policies

Each storage tier enforces a minimum retention period. If you move data from a cooler tier to a warmer tier before the retention period expires, early deletion fees might apply.

| Tier | Minimum retention period |
| ---- | ------------------------ |
| **Hot** | None |
| **Cool** | 30 days |
| **Cold** | 90 days |

Follow these practices when you manage storage tier changes:

- **Audit before changing tiers**—Use the dataset list API to identify which datasets are candidates for tier changes before initiating a bulk operation.
- **Respect retention periods**—Moving data out of Cool or Cold tiers before the minimum retention period incurs early deletion charges.
- **Monitor operations to completion**—Always poll the operation status until `status` is `Completed` or `Failed`. Don't assume success after the `202 Accepted` response.
- **Handle failures gracefully**—Use `show_details=true` to retrieve per-dataset error information and address root causes (permissions, missing blobs, retention violations) before retrying.
- **Plan for access latency changes**—Datasets in Cool and Cold tiers might have higher first-byte latency. Ensure downstream consumers are aware of potential latency increases.

## Clean up resources

There are no billable Azure resources created in this tutorial. If you changed storage tiers for testing purposes, restore them by running another change tier operation.

## Related content

- [Tutorial: Work with seismic data by using Seismic DDMS APIs](tutorial-seismic-ddms.md)
- [Azure Blob Storage access tiers overview](../storage/blobs/access-tiers-overview.md)
- [Azure Blob Storage lifecycle management policies](../storage/blobs/lifecycle-management-overview.md)
- [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)
- [Seismic DDMS API reference](https://microsoft.github.io/adme-samples/)

