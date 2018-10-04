---
title: "include file"
description: "include file"
services: automation
author: georgewallace
ms.service: automation
ms.topic: "include"
ms.date: 04/05/2018
ms.author: gwallace
ms.custom: "include file"
---

| Resource | Maximum Limit |Notes|
| --- | --- |---|
| Max number of new jobs that can be submitted every 30 seconds per Automation Account (non Scheduled jobs) |100 |When this limit it hit, the subsequent requests to create a job fail. The client receives an error response.|
| Max number of concurrent running jobs at the same instance of time per Automation Account (non Scheduled jobs) |200 |When this limit it hit, the subsequent requests to create a job fail. The client receives an error response.|
| Max number of modules that can be imported every 30 seconds per Automation Account |5 ||
| Max size of a Module |100 MB ||
| Job Run Time - Free tier |500 minutes per subscription per calendar month ||
| Max amount of disk space allowed per sandbox **<sup>1</sup>** |1 GB |Applies to Azure sandboxes only|
| Max amount of memory given to a sandbox **<sup>1</sup>** |400 MB |Applies to Azure sandboxes only|
| Max number of network sockets allowed per sandbox **<sup>1</sup>** |1000 |Applies to Azure sandboxes only|
| Maximum runtime allowed per runbook  **<sup>1</sup>** |3 hours |Applies to Azure sandboxes only|
| Max number of Automation Accounts in a subscription |No Limit ||
|Max number of concurrent jobs that be run on a single Hybrid Runbook Worker|50 ||
| Max Runbook Job parameters size   | 512 kb||
| Max Runbook parameters   | 50|You can pass a JSON or XML string to a parameter and parse it with the runbook if you hit the 50 parameter limit|
| Max webhook payload size |  512 kb|

**<sup>1</sup>** A sandbox is a shared environment that can be used by multiple jobs, jobs using the same sandbox are bound by the resource limitations of the sandbox.
