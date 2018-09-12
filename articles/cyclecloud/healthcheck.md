---
title: Azure CycleCloud HealthCheck Service | Microsoft Docs
description: Learn about the Azure CycleCloud HealthCheck service.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# HealthCheck

Azure CycleCloud provides a mechanism for terminating instances that are in an undesired state called HealthCheck. HealthCheck scripts are run on a periodic basis (every 5 minutes on Windows, every 10 minutes on Linux). HealthCheck scripts are arbitrary Python or shell/batch scripts. This allows administrators to define conditions under which instances should be terminated without having to manually monitor and remediate.

CycleCloud images come with two default HealthCheck scripts:

* The converge_timeout script will terminate an instance that has not finished installation within four hours of launch. This timeout period can be controlled with the `cyclecloud.keepalive.timeout` setting (defined in seconds).
* The scheduled_shutdown check looks for marker files in _/opt/cycle/jetpack/run/scheduled_shutdown/_ that contain a line giving a time to shut down in [Unix timestamp seconds](https://en.wikipedia.org/wiki/Unix_time) and an optional second line with an explanation. When the current time is later than the earliest timestamp in the files, the instance terminates.

Customer­-defined scripts are placed in _/opt/cycle/jetpack/config/healthcheck.d_. When the script exits with a status of `254`, HealthCheck will terminate the instance. To prevent HealthCheck scripts from terminating an instance, run the `jetpack keepalive` command. On Linux instances, you can specify a timeframe in hours or `forever`.

Because HealthCheck scripts run regularly, they can be used to detect conditions that might
appear after an instance has been running. For example, if jobs fill an execute node’s disk, the
scheduler daemons may die, which would prevent autostop from working. A HealthCheck script
can detect this case and terminate the instance. There is no guarantee that HealthCheck scripts
will run before an instance has fully installed, so in some cases an instance may start running
jobs before a bad state can be detected. In those cases, a script that calls the appropriate
operating system command to terminate should be included in Cluster­ Init.
