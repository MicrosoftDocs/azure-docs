---
title: Troubleshooting manifest ingestion #Required; this page title is displayed in search results; Always include the word "troubleshoot" in this line.
description: Find out how to troubleshoot manifest ingestion using Airflow task logs #Required; this article description is displayed in search results.
author: bharathim #Required; your GitHub user alias — correct capitalization is needed.
ms.author: bselvaraj #Required; Microsoft alias of the author.
ms.topic: troubleshooting-general #Required; leave this attribute/value as-is.
ms.date: 02/06/2023
---


<!-- Remove all the comments in this template before you sign-off or merge to the main branch.

This template provides the basic structure of a general troubleshooting article pattern. See the
[instructions troubleshooting -general](contribute-how-to-general-troubleshoot.md) in the pattern
library.

You can provide feedback about this template at: https://aka.ms/patterns-feedback

We write general troubleshooting articles when a specific error message isn't known.

-->

<!-- 1. H1 -----------------------------------------------------------------------------

Required: The headline (H1) is the primary heading at the top of the article. Pick an H1 that
clearly conveys what the content's about.

The heading of the general troubleshooting article should concisely describe the issue that the
customer is trying to fix. Make sure to include the word **troubleshoot** somewhere in the H1 of the
article to improve SEO.

-->

# Troubleshoot Manifest ingestion issues using Airflow task logs
This article helps you troubleshoot manifest ingestion issues in Microsoft Energy Data Services Preview instance using the Airflow task logs.

## Manifest Ingestion DAG workflow types
The Manifest ingestion workflow is of two types:
- Single manifest
- Batch upload

### Single Manifest Flow
One single manifest file is used to trigger the manifest ingestion workflow.

|DAGTaskName  |Description  |
|---------|---------|
|**Update_status_running_task** | Calls Workflow service and marks the status of DAG as running in the database        |
|**Check_payload_type** | Validates whether the ingestion is of batch type or single manifest|
|**Validate_manifest_schema_task** |  Performs schema validation check; ensures all the schema kinds mentioned in the manifest are present in the system and ensures manifest schema integrity (all references are resolved and validated against its schemas), all invalid values will be evicted from the manifest |
|**Provide_manifest_intergrity_task** | Validates references inside the OSDU&trade; R3 manifest and removes invalid entities. This operator is responsible for parent-child validation. All orphan-like entities will be logged and excluded from the validated manifest. Any external referenced records will be searched and in case not found, the manifest entity will be dropped. All surrogate key references are also resolved |
|**Process_single_manifest_file_task** | Performs ingestion of the final obtained manifest entities from the previous step, data records will be ingested via the storage service |
|**Update_status_finished_task** | Calls workflow service and marks the status of DAG as `finished` or `failed` in the database |

### Batch manifest flow
Multiple manifest objects are part of the same request, that is, the manifest section in the request payload is a list instead of a dictionary.

|DAGTaskName  |Description  |
|---------|---------|
|**Update_status_running_task** | Calls Workflow service and marks the status of DAG as running in the database        |
|**Check_payload_type** | Validates whether the ingestion is of batch type or single manifest|
|**Batch_upload** | List of manifests are divided into three batches to be processed in parallel (no task logs are emitted) |
|**Process_manifest_task_(1 / 2 / 3)** | List of manifests is divided into groups of three and processed by these tasks. All the steps performed in Validate_manifest_schema_task, Provide_manifest_intergrity_task, Process_single_manifest_file_task are condensed and performed sequentially in these tasks |
|**Update_status_finished_task** | Calls workflow service and marks the status of DAG as `finished` or `failed` in the database |
 
Based on the payload type (single or batch), `check_payload_type` task will pick the appropriate branch and the tasks in the other branch will be skipped.


## Prerequisites
You should have integrated airflow task logs with Azure monitor. See [Integrate airflow logs with Azure Monitor](how-to-integrate-airflow-logs-with-azure-monitor.md)

Following columns are exposed in Airflow Task Logs for you to debug the issue:

|Parameter Name  |Description  |
|---------|---------|
|**Run Id**    |  Unique run id of the DAG run which was triggered  |
|**Correlation ID**     | Unique correlation id of the DAG run (same as run id)        |
|**DagName**     |  DAG workflow name. For instance, `Osdu_ingest` in case of manifest ingestion       |
|**DagTaskName**     | DAG workflow task name. For instance `Update_status_running_task` in case of manifest ingestion        |
|**Content**     |  Contains error log messages (errors/exceptions) emitted by Airflow during the task execution|
|**LogTimeStamp**     | Captures the time interval of DAG runs       |
|**LogLevel**     | DEBUG/INFO/WARNING/ERROR. Mostly all exception and error messages can be seen by filtering at ERROR level        |


## Cause 1: A DAG run failed in Update_status_running_task or Update_status_finished_task

**Possible reasons**

Most of the time these tasks fail if the end-user passed incorrect data partition id value or the key name in the execution context of request body, data-partition-id must be used in the payload. In very rare scenarios this task can fail if the workflow service is itself not running and throwing 5xx error

**Workflow status**

For this issue workflow status will be marked as failed.

**How the issue will be discovered by the end-user?** 

Workflow run itself would have failed and data records won't get ingested.

### Solution 1: Check the logs for task failed exception. Fix the payload and pass correct data partition id or key name

**Sample Kusto query**
```kusto
    AirflowTaskLogs
        | where DagName == "Osdu_ingest"
        | where DagTaskName == "update_status_running_task"
        | where LogLevel == "ERROR" // ERROR/DEBUG/INFO/WARNING
        | where RunID == '<run_id>'
```

**Traces**
```md
    [2023-02-05, 12:21:54 IST] {taskinstance.py:1703} ERROR - Task failed with exception
    Traceback (most recent call last):
      File "/home/airflow/.local/lib/python3.8/site-packages/osdu_ingestion/libs/context.py", line 50, in populate
        data_partition_id = ctx_payload['data-partition-id']
    KeyError: 'data-partition-id'
    
    requests.exceptions.HTTPError: 403 Client Error: Forbidden for url: https://it1672283875.oep.ppe.azure-int.net/api/workflow/v1/workflow/Osdu_ingest/workflowRun/e9a815f2-84f5-4513-9825-4d37ab291264
```

## Cause 2: Schema validation failures

**Possible reasons** 
* Schema not found errors
* Manifest body not conforming to the schema kind
* Incorrect schema references
* Schema service throwing 5xx errors
  
**Workflow Status**

For this issue workflow status will be marked as finished, that is no failure in the workflow status will be observed because invalid entities are skipped and ingestion in continued

**How issue will be discovered by the end** 
Records were not ingested

### Solution 1: Check the logs for task failed exception. 

**Sample Kusto query**
```kusto
    AirflowTaskLogs
    | where DagName has "Osdu_ingest"
    | where DagTaskName == "validate_manifest_schema_task" or DagTaskName has "process_manifest_task"
    | where LogLevel == "ERROR"
    | where RunID == "<run_id>"
    | order by ['time'] asc  
```

**Traces**
```md
    Error traces to look out for
    [2023-02-05, 14:55:37 IST] {connectionpool.py:452} DEBUG - https://it1672283875.oep.ppe.azure-int.net:443 "GET /api/schema-service/v1/schema/osdu:wks:work-product-component--WellLog:2.2.0 HTTP/1.1" 404 None
    [2023-02-05, 14:55:37 IST] {authorization.py:137} ERROR - {"error":{"code":404,"message":"Schema is not present","errors":[{"domain":"global","reason":"notFound","message":"Schema is not present"}]}}
    [2023-02-05, 14:55:37 IST] {validate_schema.py:170} ERROR - Error on getting schema of kind 'osdu:wks:work-product-component--WellLog:2.2.0'
    [2023-02-05, 14:55:37 IST] {validate_schema.py:171} ERROR - 404 Client Error: Not Found for url: https://it1672283875.oep.ppe.azure-int.net/api/schema-service/v1/schema/osdu:wks:work-product-component--WellLog:2.2.0
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

## Cause 3: Failed reference checks

**Possible reasons** 
* Failed to find referenced records
* Parent records not found
* Search service throwing 5xx errors
  
**Workflow Status**

For this issue workflow status will be marked as finished, that is no failure in workflow status will be observed because invalid entities are skipped and ingestion in continued

**How issue will be discovered by the end** 
Records were not ingested

### Solution 1: Check the logs for task failed exception. 

**Sample Kusto query**
```kusto
    AirflowTaskLogs
        | where DagName has "Osdu_ingest"
        | where DagTaskName == "provide_manifest_integrity_task" or DagTaskName has "process_manifest_task"
        | where Content has 'Search query "'or Content has 'response ids: ['
        | where RunID has "<run_id>"
```

**Traces**

For referential integrity task, there are no such error logs per se, clients would want to look out for the debug log statements to figure out if all external records were retrieved via search service. 

For instance, below output shows records queried using search service for referential integrity 
```md
    [2023-02-05, 19:14:40 IST] {search_record_ids.py:75} DEBUG - Search query "it1672283875-dp1:work-product-component--WellLog:5ab388ae0e140838c297f0e6559" OR "it1672283875-dp1:work-product-component--WellLog:5ab388ae0e1b40838c297f0e6559" OR "it1672283875-dp1:work-product-component--WellLog:5ab388ae0e1b40838c297f0e6559758a"
```
and below output indicates records which were retrieved and present in the system, if we observe some of the records were not present and hence the corresponding manifest entity which referenced that record would get dropped and no longer be ingested

```md
    [2023-02-05, 19:14:40 IST] {search_record_ids.py:141} DEBUG - response ids: ['it1672283875-dp1:work-product-component--WellLog:5ab388ae0e1b40838c297f0e6559758a:1675590506723615', 'it1672283875-dp1:work-product-component--WellLog:5ab388ae0e1b40838c297f0e6559758a    ']
```
In the coming release, we plan to enhance the logs by appropriately logging skipped records with reasons

## Cause 4: Invalid Legal Tags/ACLs in manifest

**Possible reasons** 
* Incorrect ACLs
* Incorrect legal tags 
* Storage service throws 5xx errors
  
**Workflow Status**

For this issue workflow status will be marked as finished, that is no failure in workflow status will be observed

**How issue will be discovered by the end** 
Records were not ingested

### Solution 1: Check the logs for task failed exception. 

**Sample Kusto query**
```kusto
    AirflowTaskLogs
    | where DagName has "Osdu_ingest"
    | where DagTaskName == "process_single_manifest_file_task" or DagTaskName has "process_manifest_task"
    | where LogLevel == "ERROR"
    | where RunID has "<run_id>"
    | order by ['time'] asc 
```

**Traces**

```md
    "PUT /api/storage/v2/records HTTP/1.1" 400 None
    [2023-02-05, 16:57:05 IST] {authorization.py:137} ERROR - {"code":400,"reason":"Invalid legal tags","message":"Invalid legal tags: it1672283875-dp1-R3FullManifest-Legal-Tag-Test779759112"}
    
```
and below output indicates records which were retrieved and present in the system, if we observe some of the records were not present and hence the corresponding manifest entity which referenced that record would get dropped and no longer be ingested

```md
    "PUT /api/storage/v2/records HTTP/1.1" 400 None
    [2023-02-05, 16:58:46 IST] {authorization.py:137} ERROR - {"code":400,"reason":"Validation error.","message":"createOrUpdateRecords.records[0].acl: Invalid group name 'data1.default.viewers@it1672283875-dp1.dataservices.energy'"}
    [2023-02-05, 16:58:46 IST] {single_manifest_processor.py:83} WARNING - Can't process entity SRN: surrogate-key:0ef20853-f26a-456f-b874-3f2f5f35b6fb
```
In the coming release, we plan to enhance the logs by appropriately logging skipped records with reasons


## Next steps
TODO: Add your next step link(s)

- Next step 1
- Next step 2


## Reference
- [Manifest-based ingestion concepts](concepts-manifest-ingestion.md)
- [Ingestion DAGs](https://community.opengroup.org/osdu/platform/data-flow/ingestion/ingestion-dags/-/blob/master/README.md#operators-description)
