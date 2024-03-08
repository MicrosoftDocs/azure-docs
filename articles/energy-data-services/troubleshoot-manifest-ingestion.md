---
title: Troubleshoot manifest ingestion in Microsoft Azure Data Manager for Energy
description: Find out how to troubleshoot manifest ingestion by using Airflow task logs.
author: bharathim
ms.author: bselvaraj
ms.service: energy-data-services
ms.topic: troubleshooting-general
ms.date: 02/06/2023
---

# Troubleshoot manifest ingestion problems by using Airflow task logs

This article helps you troubleshoot workflow problems with manifest ingestion in Azure Data Manager for Energy by using Airflow task logs.

## Manifest ingestion DAG workflow types

There are two types of directed acyclic graph (DAG) workflows for manifest ingestion: single manifest and batch upload.

### Single manifest

One single manifest file is used to trigger the manifest ingestion workflow.

|DagTaskName value  |Description  |
|---------|---------|
|`update_status_running_task` | Calls the workflow service and marks the status of the DAG as `running` in the database.        |
|`check_payload_type` | Validates whether the type of ingestion is batch or single manifest.|
|`validate_manifest_schema_task` | Ensures that all the schema types mentioned in the manifest are present and there's referential schema integrity. All invalid values are evicted from the manifest. |
|`provide_manifest_intergrity_task` | Validates references inside the OSDU&trade; R3 manifest and removes invalid entities. This operator is responsible for parent/child validation. All orphan-like entities are logged and excluded from the validated manifest. Any external referenced records are searched. If none are found, the manifest entity is dropped. All surrogate key references are also resolved. |
|`process_single_manifest_file_task` | Performs ingestion of the final manifest entities obtained from the previous step. Data records are ingested via the storage service. |
|`update_status_finished_task` | Calls the workflow service and marks the status of the DAG as `finished` or `failed` in the database. |

### Batch upload

Multiple manifest files are part of the same workflow service request. The manifest section in the request payload is a list instead of a dictionary of items.

|DagTaskName value |Description |
|---------|---------|
|`update_status_running_task` | Calls the workflow service and marks the status of the DAG as `running` in the database.        |
|`check_payload_type` | Validates whether the type of ingestion is batch or single manifest.|
|`batch_upload` | Divides the list of manifests into three batches to be processed in parallel. (No task logs are emitted.) |
|`process_manifest_task_(1 / 2 / 3)` | Divides the list of manifests into groups of three and processes them. All the steps performed in `validate_manifest_schema_task`, `provide_manifest_intergrity_task`, and `process_single_manifest_file_task` are condensed and performed sequentially in these tasks. |
|`update_status_finished_task` | Calls the workflow service and marks the status of the DAG as `finished` or `failed` in the database. |

Based on the payload type (single or batch), the `check_payload_type` task chooses the appropriate branch and skips the tasks in the other branch.

## Prerequisites

You should have integrated Airflow task logs with Azure Monitor. See [Integrate Airflow logs with Azure Monitor](how-to-integrate-airflow-logs-with-azure-monitor.md).

The following columns are exposed in Airflow task logs for you to debug the problem:

|Parameter name  |Description  |
|---------|---------|
|`RunID`    |  Unique run ID of the triggered DAG run.  |
|`CorrelationID`     | Unique correlation ID of the DAG run (same as the run ID).        |
|`DagName`     |  DAG workflow name. For instance, `Osdu_ingest` is the workflow name for manifest ingestion.       |
|`DagTaskName`     | Task name for the DAG workflow. For instance, `update_status_running_task` is the task name for manifest ingestion.        |
|`Content`     |  Error log messages (errors or exceptions) that Airflow emits during the task execution.|
|`LogTimeStamp`     | Time interval of DAG runs.       |
|`LogLevel`     | Level of the error. Values are `DEBUG`, `INFO`, `WARNING`, and `ERROR`. You can see most exception and error messages by filtering at the `ERROR` level.        |

## Failed DAG run

The workflow run failed in `Update_status_running_task` or `Update_status_finished_task`, and the data records weren't ingested.

### Possible reasons

* Call to partition API wasn't authenticated as the data partition ID is incorrect.
* A key name in the execution context of the request body is incorrect.
* The workflow service isn't running or is throwing 5xx errors.

### Workflow status

The workflow status is marked as `failed`.

### Solution

Check the Airflow task logs for `update_status_running_task` or `update_status_finished_task`. Fix the payload by passing the correct data partition ID or key name.

Sample Kusto query:

```kusto
    OEPAirFlowTask
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

## Failed schema validation

Records weren't ingested because schema validation failed.

### Possible reasons

* The schema service is throwing "Schema not found" errors.
* The manifest body doesn't conform to the schema type.
* The schema references are incorrect.
* The schema service is throwing 5xx errors.
  
### Workflow status

The workflow status is marked as `finished`. You don't observe a failure in the workflow status because the invalid entities are skipped and the ingestion is continued.

### Solution

Check the Airflow task logs for `validate_manifest_schema_task` or `process_manifest_task`. Fix the payload by passing the correct data partition ID or key name.

Sample Kusto query:

```kusto
    OEPAirFlowTask
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

Records weren't ingested because reference checks failed.

### Possible reasons

* Referenced records weren't found.
* Parent records weren't found.
* The search service is throwing 5xx errors.
  
### Workflow status

The workflow status is marked as `finished`. You don't observe a failure in the workflow status because the invalid entities are skipped and the ingestion is continued.

### Solution

Check the Airflow task logs for `provide_manifest_integrity_task` or `process_manifest_task`.

Sample Kusto query:

```kusto
    OEPAirFlowTask
        | where DagName has "Osdu_ingest"
        | where DagTaskName == "provide_manifest_integrity_task" or DagTaskName has "process_manifest_task"
        | where Content has 'Search query "'or Content has 'response ids: ['
        | where RunID has "<run_id>"
```

Because there are no error logs specifically for referential integrity tasks, check the debug log statements to see whether all external records were fetched via the search service.

For instance, the following sample trace output shows a record queried via the search service for referential integrity:

```md
    [2023-02-05, 19:14:40 IST] {search_record_ids.py:75} DEBUG - Search query "contoso-dp1:work-product-component--WellLog:5ab388ae0e140838c297f0e6559" OR "contoso-dp1:work-product-component--WellLog:5ab388ae0e1b40838c297f0e6559" OR "contoso-dp1:work-product-component--WellLog:5ab388ae0e1b40838c297f0e6559758a"
```

The output shows the records that were retrieved and were in the system. The related manifest object that referenced a record would be dropped and no longer be ingested if you noticed that some of the records weren't present.

```md
    [2023-02-05, 19:14:40 IST] {search_record_ids.py:141} DEBUG - response ids: ['contoso-dp1:work-product-component--WellLog:5ab388ae0e1b40838c297f0e6559758a:1675590506723615', 'contoso-dp1:work-product-component--WellLog:5ab388ae0e1b40838c297f0e6559758a    ']
```

## Invalid legal tags or ACLs in the manifest

Records weren't ingested because the manifest contains invalid legal tags or access control lists (ACLs).

### Possible reasons

* ACLs are incorrect.
* Legal tags are incorrect.
* The storage service is throwing 5xx errors.
  
### Workflow status

The workflow status is marked as `finished`. You don't observe a failure in the workflow status.

### Solution

Check the Airflow task logs for `process_single_manifest_file_task` or `process_manifest_task`.

Sample Kusto query:

```kusto
    OEPAirFlowTask
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

The output indicates records that were retrieved. Manifest entity records that correspond to missing search records are dropped and not ingested.

```md
    "PUT /api/storage/v2/records HTTP/1.1" 400 None
    [2023-02-05, 16:58:46 IST] {authorization.py:137} ERROR - {"code":400,"reason":"Validation error.","message":"createOrUpdateRecords.records[0].acl: Invalid group name 'data1.default.viewers@contoso-dp1.dataservices.energy'"}
    [2023-02-05, 16:58:46 IST] {single_manifest_processor.py:83} WARNING - Can't process entity SRN: surrogate-key:0ef20853-f26a-456f-b874-3f2f5f35b6fb
```

## Known issues

- Because there are no specific error logs for referential integrity tasks, you must manually search for the debug log statements to see whether all external records were retrieved via the search service.

## Next steps

Advance to the following tutorial and learn how to perform a manifest-based file ingestion:

> [!div class="nextstepaction"]
> [Tutorial: Sample steps to perform a manifest-based file ingestion](tutorial-manifest-ingestion.md)

## References

- [Manifest-based ingestion concepts](concepts-manifest-ingestion.md)
- [Ingestion DAGs](https://community.opengroup.org/osdu/platform/data-flow/ingestion/ingestion-dags/-/blob/master/README.md#operators-description)
