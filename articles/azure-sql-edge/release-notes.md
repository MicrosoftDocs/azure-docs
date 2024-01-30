---
title: Release notes for Azure SQL Edge
description: Release notes detailing what's new or what has changed in the Azure SQL Edge images.
author: kendalvandyke
ms.author: kendalv
ms.reviewer: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: conceptual
keywords: release notes SQL Edge
---
# Azure SQL Edge release notes

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

This article describes what's new and what has changed with every new build of Azure SQL Edge.

## Azure SQL Edge 2.0.0

SQL Engine build: 16.0.5100.7245

**Applies to:** AMD64 only. No ARM64 update is available for this version.

### What's new?

- Support for SQL Server 2022 features relevant for Azure SQL Edge
- Upgraded base image to Ubuntu 20.04
- Upgraded ONNX runtime to [v1.12.1](https://github.com/microsoft/onnxruntime/releases/tag/v1.12.1)

## Azure SQL Edge 1.0.7

SQL Engine build 15.0.2000.1574

### What's new?

- Security bug fixes

## Azure SQL Edge 1.0.6

SQL Engine build 15.0.2000.1565

### What's new?

- Security bug fixes

## Azure SQL Edge 1.0.5

SQL Engine build 15.0.2000.1562

### What's new?

- Security bug fixes

## Azure SQL Edge 1.0.4

SQL Engine build 15.0.2000.1559

### What's new?

- PREDICT support for ONNX
  - Improvements in handling of null data in PREDICT for ONNX

## Azure SQL Edge 1.0.3

SQL Engine build 15.0.2000.1557

### Fixes

- Upgrade ONNX runtime to 1.5.3
- Update to Microsoft.SqlServer.DACFx version 150.5084.2
- Miscellaneous bug fixes

## Azure SQL Edge 1.0.2

SQL Engine build 15.0.2000.1557

### Fixes

- T-SQL streaming
  - Fix in ownership and permissions for streaming objects
  - Logging improvements with log rotation and log prefixing
  - Azure Stream Analytics: Logging improvements, improve error code/ error messages in adapters

- ONNX
  - Bug fixes for parallel query scenario and model cleanup failures
  - Upgraded ONNX runtime to 1.5.1

## Azure SQL Edge 1.0.1

SQL Engine build 15.0.2000.1553

### What's new?

- Allow DATE_BUCKET expressions defined in computed columns.

### Fixes

- Retention policy fix for dropping a table that has a retention policy enabled with an infinite timeout
- DacFx deployment support for streaming features and retention-policy features
- DacFx deployment fix to enable deployment from a nested folder in a SAS URL
- PREDICT fix to support long column names in error messages

## Azure SQL Edge 1.0.0 (RTM)

SQL Engine build 15.0.2000.1552

### What's new?

- Container images based on Ubuntu 18.04
- Support for `IGNORE NULL` and `RESPECT NULL` syntax with `LAST_VALUE()` and `FIRST_VALUE()` functions
- Reliability improvements for PREDICT with ONNX
- Support for cleanup based on the data-retention policy:
  - Ring buffer support for a retention cleanup task for troubleshooting
- New feature support:
  - Fast recovery
  - Automatic tuning of queries
  - Parallel-execution scenarios
- Power-saving improvements for low-power mode
- Streaming new-feature support:
  - [Snapshot windows](/stream-analytics-query/snapshot-window-azure-stream-analytics): A new window type allows you to group by events that arrive at the same time.
  - [TopOne](/stream-analytics-query/topone-azure-stream-analytics) and [CollectTop](/stream-analytics-query/collecttop-azure-stream-analytics) can be enabled as analytic functions. You can return records ordered by the column of your choice. They don't need to be part of a window.
  - Improvements to [MATCH_RECOGNIZE](/stream-analytics-query/match-recognize-stream-analytics).

### Fixes

- Additional error messages and details for troubleshooting T-SQL streaming operations
- Improvements to preserve battery life in idle mode
- T-SQL streaming engine fixes:
  - Cleanup for stopped streaming jobs
  - Fixes for localization
  - Improved Unicode handling
  - Improved debugging for SQL Edge T-SQL streaming, allowing users to query job-failure errors from get_streaming_job
- Cleanup based on data-retention policy:
  - Fixes for retention-policy creation and cleanup scenarios
- Fixes for background timer tasks to improve power savings for low-power mode

### Known issues

- The DATE_BUCKET T-SQL function can't be used in a computed column.

## CTP 2.3

SQL Engine build 15.0.2000.1549

### What's new?

- Support for custom origins in the DATE_BUCKET() function
- Support for BACPAC files as part of SQL deployment
- Support for cleanup based on the data-retention policy:
  - DDL support for enabling the retention policy
  - Cleanup for stored procedures and the background cleanup task
  - Extended events to monitor cleanup tasks

### Fixes

- Additional error messages and details for troubleshooting T-SQL streaming operations
- Improvements to preserve battery life in idle mode
- T-SQL streaming engine:
  - Fix for stuck watermark in the substreamed hopping window
  - Fix for framework exception handling to make sure it's collected as a user-actionable error

## CTP 2.2

SQL Engine build 15.0.2000.1546

### What's new?

- Support for non root containers
- Support for the usage and diagnostic data collection
- T-SQL streaming updates:
  - Support for Unicode characters for stream object names

### Fixes

- T-SQL streaming updates:
  - Process cleanup improvements
  - Logging and diagnostics improvements
- Performance improvement for data ingestion

## CTP 2.1

SQL Engine build 15.0.2000.1545

### Fixes

- Allowed the PREDICT-with-ONNX models to handle a CPUID issue in ARM64
- Improved handling of the failure path when T-SQL streaming starts
- Corrected value of the watermark delay in job metrics when there's no data.
- Fix for an issue with the output adapter when the adapter has a variable schema between batches

## CTP 2.0

SQL Engine build 15.0.2000.1401

### What's new?

- Product name updated to *Azure SQL Edge*
- DATE_BUCKET function:
  - Support for **date**, **time**, and **datetime** types
- PREDICT with ONNX:
  - ONNX requirement for the RUNTIME parameter
- T-SQL streaming support (limited preview)

### Known issues

- Issue: Potential failures with applying DACPAC on startup because of a timing issue.
- Workaround: Restart SQL Server. Otherwise, the container retries applying the DACPAC.

### Request support

You can request support on the [support page](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Select the following fields:

- **Issue type**: *Technical*
- **Service**: *IoT Edge*
- **Problem type**: *My problem relates to an IoT Edge module*
- **Problem subtype**: *Azure SQL Edge*

:::image type="content" source="media/get-support/support-ticket.png" alt-text="Screenshot showing a sample support ticket.":::

## CTP 1.5

SQL Engine build 15.0.2000.1331

### What's new?

- DATE_BUCKET function:
  - Support for the DateTimeOffset type
- PREDICT with ONNX models:
  - **nvarchar** support

## CTP 1.4

SQL Engine build 15.0.2000.1247

### What's new?

- PREDICT with ONNX models:
  - **varchar** support
  - Migration to ONNX runtime version 1.0

- The following features are enabled:
  - CDC support
  - History table with compression
  - A higher-scale factor for log read-ahead
  - Batch mode ES filter pushdown
  - Read-ahead optimizations

## CTP 1.3

SQL Engine build 15.0.2000.1147

### What's new?

- Azure IoT portal deployment:
    - Support for deploying AMD64 and ARM64 images
    - Support for streaming job creation
    - DACPAC deployment
- PREDICT with ONNX models:
    - Numeric type support
- The following features are enabled:
    - Pushdown aggregate to column store scan
    - Merry-go-round scans
- Footprint and memory-consumption reduction work
