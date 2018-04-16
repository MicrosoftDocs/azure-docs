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

| Resource | Maximum Limit |
| --- | --- |
| Max number of new jobs that can be submitted every 30 seconds per Automation Account (non Scheduled jobs) |100 |
| Max number of concurrent running jobs at the same instance of time per Automation Account (non Scheduled jobs) |200 |
| Max number of modules that can be imported every 30 seconds per Automation Account |5 |
| Max size of a Module |100 MB |
| Job Run Time - Free tier |500 minutes per subscription per calendar month |
| Max amount of memory given to a job <sup>1</sup> |400 MB |
| Max number of network sockets allowed per job <sup>1</sup> |1000 |
| Max number of Automation Accounts in a subscription |No Limit |

<sup>1</sup> These limits apply only to the sandboxes in Azure, for Hybrid workers these are only limited by the capabilities of the machine where the hybrid worker is located.