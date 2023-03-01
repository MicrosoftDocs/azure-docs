---
title: Troubleshoot manifest ingestion in Microsoft Azure Data Manager for Energy Preview
description: Find out how to troubleshoot manifest ingestion by using Airflow task logs.
author: bharathim
ms.author: bselvaraj
ms.service: energy-data-services
ms.topic: troubleshooting-general
ms.date: 02/06/2023
---

# Troubleshoot manifest ingestion problems by Airflow task logs

This article helps you troubleshoot workflow problems with manifest ingestion in Azure Data Manager for Energy Preview by using Airflow task logs.

## Manifest ingestion DAG workflow types

There are two types of directed acyclic graph (DAG) workflows for manifest ingestion: single manifest and batch upload.

### Single manifest

One single manifest file is used to trigger the manifest ingestion workflow.

|DagTaskName value  |Description  |
|---------|---------|
|`Update_status_running_task` | Calls Workflow service and marks the status of DAG as running in the database.        |
|`Check_payload_type` | Validates whether the ingestion is of batch type or single manifest.|
|`Validate_manifest_schema_task` | Ensures all the schema kinds mentioned in the manifest are present and there's referential schema integrity. All invalid values will be evicted from the manifest. |
|`Provide_manifest_intergrity_task` | Validates references inside the OSDU&trade; R3 manifest and removes invalid entities. This operator is responsible for parent-child validation. All orphan-like entities will be logged and excluded from the validated manifest. Any external referenced records will be searched and in case not found, the manifest entity will be dropped. All surrogate key references are also resolved. |
|`Process_single_manifest_file_task` | Performs ingestion of the final obtained manifest entities from the previous step, data records will be ingested via the storage service. |
|`Update_status_finished_task` | Calls workflow service and marks the status of DAG as `finished` or `failed` in the database. |

### Batch upload

Multiple manifest files are part of the same workflow service request, that is, the manifest section in the request payload is a list instead of a dictionary of items.

|DagTaskName value |Description |
|---------|---------|
|`Update_status_running_task` | Calls Workflow service and marks the status of DAG as running in the database.        |
|`Check_payload_type` | Validates whether the ingestion is of batch type or single manifest.|
|`Batch_upload` | List of manifests are divided into three batches to be processed in parallel (no task logs are emitted). |
|`Process_manifest_task_(1 / 2 / 3)` | List of manifests is divided into groups of three and processed by these tasks. All the steps performed in Validate_manifest_schema_task, Provide_manifest_intergrity_task, Process_single_manifest_file_task are condensed and performed sequentially in these tasks. |
|`Update_status_finished_task` | Calls workflow service and marks the status of DAG as `finished` or `failed` in the database. |

Based on the payload type (single or batch), `check_payload_type` task will pick the appropriate branch and the tasks in the other branch will be skipped.

## Prerequisites

You should have integrated airflow task logs with Azure monitor. See [Integrate airflow logs with Azure Monitor](how-to-integrate-airflow-logs-with-azure-monitor.md)

Following columns are exposed in Airflow Task Logs for you to debug the issue:

|Parameter name  |Description  |
|---------|---------|
|`Run Id`    |  Unique run ID of the DAG run, which was triggered  |
|`Correlation ID`     | Unique correlation ID of the DAG run (same as run ID)        |
|`DagName`     |  DAG workflow name. For instance, `Osdu_ingest` for manifest ingestion.       |
|`DagTaskName`     | DAG workflow task name. For instance, `Update_status_running_task` for manifest ingestion.        |
|`Content`     |  Contains error log messages (errors/exceptions) emitted by Airflow during the task execution.|
|`LogTimeStamp`     | Captures the time interval of DAG runs.       |
|`LogLevel`     | DEBUG/INFO/WARNING/ERROR. Mostly all exception and error messages can be seen by filtering at ERROR level.        |

## A DAG run has failed in Update_status_running_task or Update_status_finished_task

The workflow run has failed and the data records weren't ingested.

### Possible reasons

* Provided incorrect data partition ID.
* Provided incorrect key name in the execution context of the request body.
* Workflow service isn't running or throwing 5xx errors.

### Workflow status

Workflow status is marked as `failed`.

### Solution

Check the airflow task logs for `update_status_running_task` or `update_status_finished_task`. Fix the payload (pass the correct data partition ID or key name)

Sample Kusto query:

```kusto
    AirflowTaskLogs
        | where DagName == "Osdu_ingest"
        | where DagTaskName == "update_status_running_task"
        | where LogLevel == "ERROR" // ERROR/DEBUG/INFO/WARNING
        | where RunID == '<run_id>'
```

Sample trace output:

```md
    [2023-02-05, 12:21:54 IST] {taskinstance.py:1703} ERROR - Task failed with exception
    Traceback (most recent call last):
      File "/home/airflow/.local/lib/python3.8/site-packages/osdu_ingestion/libs/context.py", line 50, in populate
        data_partition_id = ctx_payload['data-partition-id']
    KeyError: 'data-partition-id'
    
    requests.exceptions.HTTPError: 403 Client Error: Forbidden for url: https://contoso.energy.azure.com/api/workflow/v1/workflow/Osdu_ingest/workflowRun/e9a815f2-84f5-4513-9825-4d37ab291264
```

## Schema validation failures

Records weren't ingested due to schema validation failures.

### Possible reasons

* Schema not found errors.
* Manifest body not conforming to the schema kind.
* Incorrect schema references.
* Schema service throwing 5xx errors.
  
### Workflow status

Workflow status is marked as `finished`. No failure in the workflow status will be observed because the invalid entities are skipped and the ingestion is continued.

### Solution

Check the airflow task logs for `validate_manifest_schema_task` or `process_manifest_task`. Fix the payload (pass the correct data partition ID or key name).

Sample Kusto query:

```kusto
    AirflowTaskLogs
    | where DagName has "Osdu_ingest"
    | where DagTaskName == "validate_manifest_schema_task" or DagTaskName has "process_manifest_task"
    | where LogLevel == "ERROR"
    | where RunID == "<run_id>"
    | order by ['time'] asc  
```

Sample trace output:

```md
    Error traces to look out for
    [2023-02-05, 14:55:37 IST] {connectionpool.py:452} DEBUG - https://contoso.energy.azure.com:443 "GET /api/schema-service/v1/schema/osdu:wks:work-product-component--WellLog:2.2.0 HTTP/1.1" 404 None
    [2023-02-05, 14:55:37 IST] {authorization.py:137} ERROR - {"error":{"code":404,"message":"Schema is not present","errors":[{"domain":"global","reason":"notFound","message":"Schema is not present"}]}}
    [2023-02-05, 14:55:37 IST] {validate_schema.py:170} ERROR - Error on getting schema of kind 'osdu:wks:work-product-component--WellLog:2.2.0'
    [2023-02-05, 14:55:37 IST] {validate_schema.py:171} ERROR - 404 Client Error: Not Found for url: https://contoso.energy.azure.com/api/schema-service/v1/schema/osdu:wks:work-product-component--WellLog:2.2.0
    [2023-02-05, 14:55:37 IST] {validate_schema.py:314} WARNING - osdu:wks:work-product-component--WellLog:2.2.0 is not present in Schema service.
    [2023-02-05, 15:01:23 IST] {validate_schema.py:322} ERROR - Schema validation error. Data field.
    [2023-02-05, 15:01:23 IST] {validate_schema.py:323} ERROR - Manifest kind: osdu:wks:work-product-component--WellLog:1.1.0
    [2023-02-05, 15:01:23 IST] {validate_schema.py:324} ERROR - Error: 'string-value' is not of type 'number'
    
    Failed validating 'type' in schema['properties']['data']['allOf'][3]['properties']['SamplingStop']:
        {'description': 'The stop value/last value of the ReferenceCurveID, '
                        'typically the end depth of the logging.',
         'example': 7500,
         'title': 'Sampling Stop',
         'type': 'number',
         'x-osdu-frame-of-reference': 'UOM'}
    
    On instance['data']['SamplingStop']:
        'string-value'
```

## Failed reference checks

Records weren't ingested due to failed reference checks.

### Possible reasons

* Failed to find referenced records.
* Parent records not found.
* Search service throwing 5xx errors.
  
### Workflow status

Workflow status is marked as `finished`. No failure in the workflow status will be observed because the invalid entities are skipped and the ingestion is continued.

### Solution

Check the airflow task logs for `provide_manifest_integrity_task` or `process_manifest_task`.

Sample Kusto query:

```kusto
    AirflowTaskLogs
        | where DagName has "Osdu_ingest"
        | where DagTaskName == "provide_manifest_integrity_task" or DagTaskName has "process_manifest_task"
        | where Content has 'Search query "'or Content has 'response ids: ['
        | where RunID has "<run_id>"
```

Sample trace output:

Because there are no such error logs specifically for referential integrity tasks, you should watch out for the debug log statements to see whether all external records were fetched using the search service.

For instance, the output shows record queried using the Search service for referential integrity.

```md
    [2023-02-05, 19:14:40 IST] {search_record_ids.py:75} DEBUG - Search query "contoso-dp1:work-product-component--WellLog:5ab388ae0e140838c297f0e6559" OR "contoso-dp1:work-product-component--WellLog:5ab388ae0e1b40838c297f0e6559" OR "contoso-dp1:work-product-component--WellLog:5ab388ae0e1b40838c297f0e6559758a"
```

The records that were retrieved and were in the system are shown in the output. The related manifest object that referenced a record would be dropped and no longer be ingested if we noticed that some of the records weren't present.

```md
    [2023-02-05, 19:14:40 IST] {search_record_ids.py:141} DEBUG - response ids: ['contoso-dp1:work-product-component--WellLog:5ab388ae0e1b40838c297f0e6559758a:1675590506723615', 'contoso-dp1:work-product-component--WellLog:5ab388ae0e1b40838c297f0e6559758a    ']
```

In the coming release, we plan to enhance the logs by appropriately logging skipped records with reasons.

## Invalid legal tags/ACLs in manifest

Records weren't ingested due to invalid legal tags or ACLs present in the manifest.

### Possible reasons

* Incorrect ACLs.
* Incorrect legal tags.
* Storage service throws 5xx errors.
  
### Workflow status

Workflow status is marked as `finished`. No failure in the workflow status will be observed.

### Solution

Check the airflow task logs for `process_single_manifest_file_task` or `process_manifest_task`.

Sample Kusto query:

```kusto
    AirflowTaskLogs
    | where DagName has "Osdu_ingest"
    | where DagTaskName == "process_single_manifest_file_task" or DagTaskName has "process_manifest_task"
    | where LogLevel == "ERROR"
    | where RunID has "<run_id>"
    | order by ['time'] asc 
```

Sample trace output:

```md
    "PUT /api/storage/v2/records HTTP/1.1" 400 None
    [2023-02-05, 16:57:05 IST] {authorization.py:137} ERROR - {"code":400,"reason":"Invalid legal tags","message":"Invalid legal tags: contoso-dp1-R3FullManifest-Legal-Tag-Test779759112"}
    
```

The output indicates records that were retrieved. Manifest entity records corresponding to missing search records will get dropped and not ingested.

```md
    "PUT /api/storage/v2/records HTTP/1.1" 400 None
    [2023-02-05, 16:58:46 IST] {authorization.py:137} ERROR - {"code":400,"reason":"Validation error.","message":"createOrUpdateRecords.records[0].acl: Invalid group name 'data1.default.viewers@contoso-dp1.dataservices.energy'"}
    [2023-02-05, 16:58:46 IST] {single_manifest_processor.py:83} WARNING - Can't process entity SRN: surrogate-key:0ef20853-f26a-456f-b874-3f2f5f35b6fb
```

## Known issues

- Exception traces weren't exporting with Airflow Task Logs due to a known problem in the logs; the patch has been submitted and will be included in the February release.
- Because there are no specific error logs for referential integrity tasks, you must manually search for the debug log statements to see whether all external records were retrieved via the search service. We intend to improve the logs in the upcoming release by properly logging skipped data with justifications.

## Next steps

Advance to the manifest ingestion tutorial and learn how to perform a manifest-based file ingestion:

> [!div class="nextstepaction"]
> [Tutorial: Sample steps to perform a manifest-based file ingestion](tutorial-manifest-ingestion.md)

## References

- [Manifest-based ingestion concepts](concepts-manifest-ingestion.md)
- [Ingestion DAGs](https://community.opengroup.org/osdu/platform/data-flow/ingestion/ingestion-dags/-/blob/master/README.md#operators-description)
