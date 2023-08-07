---
title: "include file"
description: "include file"
services: automation
author: mgoedtel
ms.service: automation
ms.topic: "include"
ms.date: 07/22/2021
ms.author: magoedte
ms.custom: "include file"
---

#### Process automation

| Resource | Limit |Notes|
| --- | --- |---|
| Maximum number of new jobs that can be submitted every 30 seconds per Azure Automation account (nonscheduled jobs) |100 |When this limit is reached, the subsequent requests to create a job fail. The client receives an error response.|
| Maximum number of concurrent running jobs at the same instance of time per Automation account (nonscheduled jobs) |200 |When this limit is reached, the subsequent requests to create a job fail. The client receives an error response.|
| Maximum storage size of job metadata for a 30-day rolling period | 10 GB (approximately 4 million jobs)|When this limit is reached, the subsequent requests to create a job fail. |
| Maximum job stream limit|1 MiB|A single stream cannot be larger than 1 MiB.|
| Maximum job stream limit on Azure Automation portal | 200KB | Portal limit to show the job logs.|
| Maximum number of modules that can be imported every 30 seconds per Automation account |5 ||
| Maximum size of a module |100 MB ||
| Maximum size of a  node configuration file | 1 MB | Applies to state configuration |
| Job run time, Free tier |500 minutes per subscription per calendar month ||
| Maximum amount of disk space allowed per sandbox<sup>1</sup> |1 GB |Applies to Azure sandboxes only.|
| Maximum amount of memory given to a sandbox<sup>1</sup> |900 MB |Applies to Azure sandboxes only.|
| Maximum number of network sockets allowed per sandbox<sup>1</sup> |1,500 |Applies to Azure sandboxes only.|
| Maximum runtime allowed per runbook<sup>1</sup> |3 hours |Applies to Azure sandboxes only.|
| Maximum number of Automation accounts in a subscription |No limit ||
| Maximum number of system hybrid runbook workers per Automation Account|4,000||
| Maximum number of user hybrid runbook workers per Automation Account|4,000||
|Maximum number of concurrent jobs that can be run on a single Hybrid Runbook Worker|50 ||
| Maximum runbook job parameter size   | 512 kilobytes||
| Maximum runbook parameters   | 50|If you reach the 50-parameter limit, you can pass a JSON or XML string to a parameter and parse it with the runbook.|
| Maximum webhook payload size |  512 kilobytes|
| Maximum days that job data is retained|30 days|
| Maximum PowerShell workflow state size |5 MB| Applies to PowerShell workflow runbooks when checkpointing workflow.|
| Maximum number of tags supported by an Automation account|15||
|Maximum number of characters in the value field of a variable| 1048576||

<sup>1</sup>A sandbox is a shared environment that can be used by multiple jobs. Jobs that use the same sandbox are bound by the resource limitations of the sandbox.

#### Change Tracking and Inventory

The following table shows the tracked item limits per machine for change tracking.

| **Resource** | **Limit**| **Notes** |
|---|---|---|
|File|500||
|File size|5 MB||
|Registry|250||
|Windows software|250|Doesn't include software updates.|
|Linux packages|1,250||
|Services|250||
|Daemon|250||

#### Update Management

The following table shows the limits for Update Management.

| **Resource** | **Limit**| **Notes** |
|---|---|---|
|Number of machines per update deployment|1000||
|Number of dynamic groups per update deployment |500 ||
