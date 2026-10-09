---
title: "Tutorial: Manage seismic analytics schedules and download reports"
titleSuffix: Microsoft Azure Data Manager for Energy
description: Learn how to use the Seismic DDMS Analytics API in Azure Data Manager for Energy to create analytics schedules, list generated reports, and download them with short-lived SAS URLs.
author: bharathim
ms.author: bselvaraj
ms.service: azure-data-manager-energy
ms.topic: tutorial
ms.date: 09/30/2026
ms.custom:
  - template-tutorial

#Customer intent: As a data manager, I want to schedule and download seismic usage-statistics reports so that I can track data usage and optimize storage costs.
---

# Tutorial: Manage seismic analytics schedules and download reports

> [!IMPORTANT]
> This feature is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This tutorial demonstrates how to use the Seismic DDMS Analytics operation in Azure Data Manager for Energy to create recurring analytics schedules for your seismic data, list and download the generated reports, and delete schedules you no longer need. Scheduled analytics help you track storage consumption and data-access patterns across subprojects and tenants over time, so you can plan capacity and optimize storage costs without building a custom reporting pipeline. A background job computes the requested statistics on a recurring cadence and writes each report to Azure Blob Storage. You download report data directly from storage, and it never flows through the service.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create an analytics schedule for a subproject or a tenant
> * List analytics schedules and generated reports
> * Download a report with a short-lived SAS URL
> * Delete an analytics schedule

## Prerequisites

Before you begin, ensure you meet the following prerequisites:

- An Azure subscription.
- An Azure Data Manager for Energy resource with Seismic DDMS configured.
- A registered `tenant` and `subproject` in the Seismic DDMS service.
- The `subproject.admin`, `datamanager`, or `tenant.admin` role assigned to your user account, depending on the scope.
- A bearer token for API authentication. When you use `DefaultAzureCredential`, request the `https://energy.azure.com/.default` scope. See [How to generate auth token](how-to-generate-auth-token.md).
- The `data-partition-id` of your tenant. A missing value returns `400 BAD_REQUEST`.

## Understand analytics scopes

Analytics jobs run at one of two scopes. The scope determines which datasets are measured and which role is required.

| Scope | What it measures | How you target it | Required role |
| --- | --- | --- | --- |
| **Subproject** | A single subproject within the partition | `name` in the request body (create), or `subprojectid` in the URL path | `subproject.admin`, `datamanager`, or `tenant.admin` |
| **Tenant** | The entire data partition | Empty or omitted `name` (create), or the `/tenant/...` routes | `datamanager` or `tenant.admin` |

Each schedule stores three settings: the `statistics` to compute, the day of the week for the first run (`first_execution`), and how often it repeats in days (`freq_execution`). The API uses `/job` endpoints for schedule operations. A background job reads the schedules and writes reports to the `sdms-analytics-reports` container by using the path layout `<subproject>/YYYY/MM/DD/`.

## Submit an analytics schedule

Submit a `PUT` request with a JSON array that contains a single schedule object. Omit `name` (or send an empty string) to create a tenant-wide schedule; provide a subproject `name` to scope the schedule to that subproject.

The request body supports the following fields:

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | No | string | Subproject name. When empty or omitted, the schedule is created at the tenant scope and defaults to the `data-partition-id`. |
| `statistics` | Yes | string | Comma-separated list of statistics to compute. Whitespace is removed and the value is lowercased before storage. |
| `first_execution` | No | integer (1–7) | Day of week for the first run. Defaults to the current day. Values outside `1`–`7` return `400 BAD_REQUEST`. |
| `freq_execution` | No | integer (>0) | Execution frequency in days. Defaults to `7`. |

1. Submit the request. For a subproject schedule, include the subproject `name`:

    ```http
    PUT https://<instance>.energy.azure.com/seistore-svc/api/v3/analytics/job
    Authorization: Bearer {access_token}
    data-partition-id: {data_partition_id}
    Content-Type: application/json

    [
      {
        "name": "{subproject_name}",
        "statistics": "count,size",
        "first_execution": 1,
        "freq_execution": 7
      }
    ]
    ```

    For a tenant-wide schedule, omit `name`:

    ```http
    PUT https://<instance>.energy.azure.com/seistore-svc/api/v3/analytics/job
    Authorization: Bearer {access_token}
    data-partition-id: {data_partition_id}
    Content-Type: application/json

    [
      {
        "statistics": "count,size",
        "freq_execution": 7
      }
    ]
    ```

1. Review the normalized schedule returned in the response. The `type` field is `subproject` for a subproject schedule and `partition` for a tenant-wide schedule. The `first_execution` field is returned as a timestamp for the next scheduled run:

    ```json
    [
      {
        "name": "{subproject_name}",
        "type": "subproject",
        "statistics": "count,size",
        "first_execution": 1743552000000,
        "freq_execution": 7
      }
    ]
    ```

The service creates the recurring analytics schedule for the selected scope. Request only the statistics you need, and set `freq_execution` to match how often you consume reports.

## Retrieve analytics schedules

Call the schedules endpoint to see the schedules you can view. Users with the `tenant.admin` or `datamanager` role get the complete list. A user with the `subproject.admin` role gets only the schedules for subprojects they can administer.

1. Submit the request.

    ```http
    GET https://<instance>.energy.azure.com/seistore-svc/api/v3/analytics/job
    Authorization: Bearer {access_token}
    data-partition-id: {data_partition_id}
    ```

1. Review the returned schedules.

    ```json
    [
      {
        "name": "{subproject_name}",
        "type": "subproject",
        "statistics": "count,size",
        "first_execution": 1743552000000,
        "freq_execution": 7
      }
    ]
    ```

The response contains the analytics schedules that your assigned role can view.

## Retrieve generated reports

Reports become available after the first scheduled run completes. Retrieve reports for a single subproject or for the whole tenant, and optionally narrow the results by date.

The following query parameters control report-list and SAS URL requests:

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `filter-date` | No | string | Restricts results by date. Must be `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`. Any other format returns `400 BAD_REQUEST`. |
| `extension` | No | string | Selects an alternate reports container named `sdms-analytics-reports-<extension>`. Must contain only lowercase alphanumeric characters and hyphens, with no consecutive hyphens, and the combined container name must not exceed 63 characters. |

1. To list reports for a subproject, call the subproject route:

    ```http
    GET https://<instance>.energy.azure.com/seistore-svc/api/v3/analytics/job/{subprojectid}?filter-date=2026-09
    Authorization: Bearer {access_token}
    data-partition-id: {data_partition_id}
    ```

    To list reports for the whole tenant, call the tenant route:

    ```http
    GET https://<instance>.energy.azure.com/seistore-svc/api/v3/analytics/tenant/job?filter-date=2026
    Authorization: Bearer {access_token}
    data-partition-id: {data_partition_id}
    ```

1. Review the list of report blob paths in the response:

    ```json
    [
      "{subproject_name}/2026/09/15/{report_file_name}",
      "{subproject_name}/2026/09/22/{report_file_name}"
    ]
    ```

The response contains the report blob paths that match the selected scope and date filter. Use the most specific `filter-date` that meets your needs to reduce the number of returned paths.

## Download a report with a SAS URL

Report data never flows through the service. Instead, request a short-lived SAS credential from the `/connection-string` endpoint, then use the returned SAS URL to read the report blobs directly from Azure Blob Storage. The `filter-date` you supply is appended to the storage path, so a more specific date scopes the credential to a narrower set of blobs. You can also use the `extension` parameter described in the preceding section to target an alternate reports container.

1. To request a SAS URL for a subproject report, call the subproject route:

    ```http
    GET https://<instance>.energy.azure.com/seistore-svc/api/v3/analytics/job/{subprojectid}/connection-string?filter-date=2026-09-15
    Authorization: Bearer {access_token}
    data-partition-id: {data_partition_id}
    ```

    To request a SAS URL for a tenant report, call the tenant route:

    ```http
    GET https://<instance>.energy.azure.com/seistore-svc/api/v3/analytics/tenant/job/connection-string?filter-date=2026-09
    Authorization: Bearer {access_token}
    data-partition-id: {data_partition_id}
    ```

1. Review the response. The `access_token` contains the SAS URL:

    ```json
    {
      "access_token": "https://<account>.blob.core.windows.net/sdms-analytics-reports/...&sig=...",
      "expires_in": 3599,
      "token_type": "SasUrl"
    }
    ```

  1. Use the SAS URL with the Azure Storage SDK or REST API to download the report path that you selected in the preceding section.

The returned SAS URL provides temporary access to the report blobs for the selected path and expires in just under one hour. Treat the URL as a secret: don't log or persist it, and request a new one after it expires.

## Delete an analytics schedule

Delete an analytics schedule when you no longer want the service to generate recurring reports for that scope.

1. To delete a subproject schedule, call the subproject route:

    ```http
    DELETE https://<instance>.energy.azure.com/seistore-svc/api/v3/analytics/job/{subprojectid}
    Authorization: Bearer {access_token}
    data-partition-id: {data_partition_id}
    ```

    To delete a tenant schedule, call the tenant route:

    ```http
    DELETE https://<instance>.energy.azure.com/seistore-svc/api/v3/analytics/tenant/job
    Authorization: Bearer {access_token}
    data-partition-id: {data_partition_id}
    ```

1. Confirm that the request returns `200 OK`. Deleting a schedule that doesn't exist also succeeds, so the operation is safe to retry.

The analytics schedule is deleted, and the service no longer generates recurring reports for that scope.

## Clean up resources

This tutorial doesn't provision a new Azure resource. To stop future reports from being generated, delete the analytics schedule as described in [Delete an analytics schedule](#delete-an-analytics-schedule).

## Related content

- [Tutorial: Work with seismic data by using Seismic DDMS APIs](tutorial-seismic-ddms.md)
- [How to generate auth token](how-to-generate-auth-token.md)
- [Seismic DDMS API reference](https://microsoft.github.io/adme-samples/)

