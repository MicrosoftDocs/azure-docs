---
title: HealthCheck Service
description: Learn about the HealthCheck service in Azure CycleCloud. HealthCheck can be used to terminate VMs that are in an unhealthy state.
author: KimliW
ms.date: 03/01/2018
ms.author: adjohnso
---

# HealthCheck

Azure CycleCloud provides a mechanism for terminating virtual machines (VMs) that are in an unhealthy state called HealthCheck. Both system and user defined scripts (Python and Bash) are run on a periodic basis (5 minutes on Windows, 10 minutes on Linux) to determine the overall health of a VM. HealthCheck allows administrators to define conditions under which VMs should be terminated without having to manually monitor and remediate.

## Built in HealthCheck scripts

CycleCloud enabled VMs come with two default HealthCheck scripts:

* The **converge_timeout** script will terminate an instance that has not finished software configuration within four hours of launch. This timeout period can be controlled with the `cyclecloud.keepalive.timeout` setting (defined in seconds).
* The **scheduled_shutdown** script looks for maker files in _$JETPACK_HOME/run/scheduled_shutdown_ which contain a single line giving a shutdown time in [Unix timestamp seconds](https://en.wikipedia.org/wiki/Unix_time) and an optional second line with an explanation. When the current time is later than the earliest timestamp in the files, the VM is considered unhealthy.

## How it works

The HealthCheck scripts are located in the _$JETPACK_HOME/config/healthcheck.d_ directory. Linux supports both Python and Bash scripts, while Windows supports only Python scripts. The script should determine the health of the VM. If the VM is found to be unhealthy the script should exit with a status of `254`, which indicates to CycleCloud that the VM is unhealthy and should be terminated.

When logged onto a VM that is running HealthCheck you can keep the VM from being shutdown by running the command [jetpack keepalive](../jetpack.md#jetpack-keepalive). On Linux instances you can specify a timeframe in hours or `forever` while on Windows `forever` is the only option.

> [!NOTE]
> When a VM is determined to be unhealthy, the HealthCheck agent will make a request for CycleCloud to terminate the VM, the VM will never be shutdown locally via `shutdown` command. In the event that the VM is unable to communicate with CycleCloud, the VM will stay up even though it is unhealthy until a time at which CycleCloud can be reached.

## Example

As a simple example we will write a HealthCheck script which will ensure that a Linux VM is not active for more than 24 hours. This script could be used to simulate low priority evictions to test how a workflow reacts to an evicted VM. This script would be placed in _/opt/cycle/jetpack/config/healthcheck.d/healthcheck_example.sh_

```bash
#!/bin/bash

# Get the uptime of the system (in seconds) and check to see if it is
# greater than 86,400 (24 hours in seconds). If it is, exit 254 to
# signal that the VM is unhealthy.
if (( $(cat /proc/uptime | awk '{print ($1 > 86400)}'))); then
  exit 254
fi
```

> [!NOTE]
> This script can be placed on a VM via [CycleCloud Project](~/how-to/projects.md) or by adding it directly when [Creating a Custom Image](create-custom-image.md).
