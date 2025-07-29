---
title: Cyclecloud Log Locations
description: The location of the different logs associated with CycleCloud
author: adriankjohnson
ms.date: 06/10/2025
ms.author: adjohnso
---

# Common logs

Depending on the issue that you're trying to troubleshoot, there are different logs and standard paths to check for more information.

| Server       | Purpose                                                | Path                                                     |
| ------------ | -------------------------------------------------------| -------------------------------------------------------- |
| CycleCloud   | CycleCloud server application logs                     | `/opt/cycle_server/logs/cycle_server.log`                  |
| CycleCloud   | Log of all API requests to Azure from CycleCloud       | `/opt/cycle_server/logs/azure-*.log`                       |
| Cluster Node | Chef logs/troubleshooting software installation issues | `/opt/cycle/jetpack/logs/chef-client.log`                  |
| Cluster Node | Detailed chef stacktrace output                        | `/opt/cycle/jetpack/system/chef/cache/chef-stacktrace.out` |
| Cluster Node | Detailed cluster-init log output                       | `/opt/cycle/jetpack/logs/cluster-init/{PROJECT_NAME}`      |
| Cluster Node | Waagent logs (used to install Jetpack)                 | /var/log/waagent.log                                     |

## CycleCloud Workspace for Slurm logs

In a CycleCloud Workspace for Slurm environment, additional logs are created on top of the CycleCloud ones described earlier.

| Server       | Purpose                                                | Path                                                     |
| ------------ | -------------------------------------------------------| -------------------------------------------------------- |
| CycleCloud   | Log of the CycleCloud Workspace installation           | /var/log/cloud-init-output.log                           |
| Any machine with access to `/shared` | Compute node diagnostics, Slurm, and Jetpack logs | /shared/<cluster_name>/node_logs/<vm_name> |

