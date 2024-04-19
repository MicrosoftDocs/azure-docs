---
title: Exporting Azure Node Health Check Logs to Kusto
description: Documentation for exporting Azure Node Health Checks (AzNHC) results to Kusto.
ms.service: azure-node-health-checks
ms.topic: Kusto How To
author: rafsalas19
ms.author: rafaelsalas
ms.date: 04/15/2024
---

# Kusto Export

## Procedure
The script ./distributed_nhc/export_nhc_result_to_kusto.py can be used to export health and debug logs to Kusto.

It's requirements can be installed with
```
pip3 install -r ./distributed_nhc/requirements.txt
```

## Example Usage
```
User Assigned Managed Identity
python3 ./export_nhc_result_to_kusto.py --ingest_url https://ingest-<cluster>.kusto.windows.net --database mydatabase --identity client_id -- my.health.log my.debug.log

System Assigned Managed Identity
python3 ./export_nhc_result_to_kusto.py --ingest_url https://ingest-<cluster>.kusto.windows.net --database mydatabase --identity -- my.health.log my.debug.log

Default Azure Credentials
python3 ./export_nhc_result_to_kusto.py --ingest_url https://ingest-<cluster>.kusto.windows.net --database mydatabase -- my.health.log my.debug.log

Specifying Custom Table Names
python3 ./export_nhc_result_to_kusto.py --ingest_url https://ingest-<cluster>.kusto.windows.net --database mydatabase --health_table_name MyHealthTable --debug_table_name MyDebugTable -- my.health.log my.debug.log
```

## Table Schema
The default table name and it's Schema for the health and debug tables are as follows
```
NodeHealthCheck: Timestamp:datetime,JobName:string,Hostname:string,Healthy:bool,RawResult:string
NodeHealthCheck_Debug: Timestamp:datetime,JobName:string,Hostname:string,DebugLog:string
``` 
