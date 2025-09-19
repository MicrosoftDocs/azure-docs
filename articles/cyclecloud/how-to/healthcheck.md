---
title: Health Checks Services
description: Learn about the HealthCheck service in Azure CycleCloud. HealthCheck can be used to terminate VMs that are in an unhealthy state.
author: aevdokimova
ms.date: 07/01/2025
ms.author: adjohnso
---

# Health Checks
 
CycleCloud offers two mechanisms for checking the health of VMs: Node Health Checks is newer feature that performs the checks during the provisioning stage and prevents the unhealthy VMs from joining, while HealthCheck runs them periodically after the VM joins the cluster as a node.
 
## Node Health Checks
 
Node Health Checks detects unhealthy hardware before a VM joins a CycleCloud cluster. This feature runs health check scripts built into the official AzureHPC images that you can find under _/opt/azurehpc/test/azurehpc-health-checks/_. The source for these scripts is located in the [AzureHPC Node Health Checks repository](https://github.com/Azure/azurehpc-health-checks/tree/main), but the version built into your cluster's version of the AzureHPC image might not be the latest one available in the repository.

### Requirements
 
The current version of Node Health Checks only supports AzureHPC images released after November 7, 2023 (containing azurehpc-health-checks version v2.0.6 or greater) and custom images derived from them.
Node Health Checks currently doesn't support Windows.
 
### Enable Node Health Checks for Slurm Clusters
 
The Slurm cluster creation form offers a checkbox to enable Node Health Checks located under the **Advanced Settings** tab. When you select the checkbox, you enable Node Health Checks on the HPC node array of the cluster. To enable Node Health Checks on other node arrays or for other cluster types, use a custom cluster template.
 
You can disable Node Health Checks on a running cluster by clearing the checkbox. You don't need to scale the node array down for the changes to take effect.
 
![Node Health Checks GUI](../images/node-health-checks-template.png)

### Understanding node health check results

After a VM passes health checks, it moves on to the software configuration phase.

If a VM fails any of the health check scripts, it sends an error message to CycleCloud and automatically prevents the VM from joining the cluster.

![Node Health Checks error logs](../images/node-health-checks-error-logs.png)

If you start the VM in a NodeArray with over-provisioning enabled (for example, the Slurm hpc Node Array), the VM is automatically replaced as part of over-provisioning. In that case, you don't need to take any action. The healthy VMs join the cluster, though you see an error message on your cluster page indicating that one or more VMs failed checks.

If you start the VM for a single node but disable over-provisioning on the node array (such as the Slurm htc node array), or if more VMs fail health checks than over-provisioning supports, the node moves to the **Failed** state and allocation fails. CycleCloud might try to reimage the VM to fix the problem. If reimaging fails, you need to terminate and replace the node. An admin can do this step manually, or the autoscaler can do it automatically.

> [!NOTE]
> If you enable node health checks but the VM image doesn't meet the requirements, all the VMs can join the cluster. However, the status shows a warning that indicates checks are unsupported.
> ![Node Health Checks error details](../images/node-health-checks-warning.png)

## Attribute reference
 
Attribute | Type | Definition
------ | ----- | ----------
EnableNodeHealthChecks | Boolean | (Optional) Enable on-boot Node Health Checks for this Node or Node Array

## HealthCheck

Azure CycleCloud provides a mechanism for terminating virtual machines (VMs) that are in an unhealthy state called HealthCheck. Both system and user-defined scripts (Python and Bash) run on a periodic basis (five minutes on Windows, 10 minutes on Linux) to determine the overall health of a VM. HealthCheck allows administrators to define conditions under which VMs should be terminated without having to manually monitor and remediate.

### Built-in HealthCheck scripts

CycleCloud enabled VMs include two default HealthCheck scripts:

* The **converge_timeout** script terminates an instance that doesn't finish software configuration within four hours of launch. You can control this timeout period with the `cyclecloud.keepalive.timeout` setting (defined in seconds).
* The **scheduled_shutdown** script looks for marker files in _$JETPACK_HOME/run/scheduled_shutdown_ which contain a single line giving a shutdown time in [Unix timestamp seconds](https://en.wikipedia.org/wiki/Unix_time) and an optional second line with an explanation. When the current time is later than the earliest timestamp in the files, the VM is considered unhealthy.

### How it works

The HealthCheck scripts are in the _$JETPACK_HOME/config/healthcheck.d_ directory. Linux supports both Python and Bash scripts, while Windows supports only Python scripts. The script checks the health of the VM. If the script finds the VM unhealthy, it exits with a status of `254`. This status tells CycleCloud that the VM is unhealthy and should be terminated.

When you sign in to a VM running HealthCheck, you can prevent the VM from shutting down by running the command [jetpack keepalive](../jetpack.md#jetpack-keepalive). On Linux instances, you can specify a timeframe in hours or `forever`. On Windows, `forever` is the only option.

> [!NOTE]
> When the HealthCheck agent determines that a VM is unhealthy, it requests that CycleCloud terminate the VM. The agent doesn't shut down the VM locally by using the `shutdown` command. If the VM can't communicate with CycleCloud, the VM stays up even though it's unhealthy until the VM can reach CycleCloud.

### Example

As a simple example, you write a HealthCheck script that ensures a Linux VM isn't active for more than 24 hours. Use this script to simulate low priority evictions and test how a workflow reacts to an evicted VM. Place this script in _/opt/cycle/jetpack/config/healthcheck.d/healthcheck_example.sh_.

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
> Place this script on a VM by using [CycleCloud Project](~/articles/cyclecloud/how-to/projects.md) or by adding it directly when [Creating a Custom Image](create-custom-image.md).
