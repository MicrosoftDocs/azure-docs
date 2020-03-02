---
title: Cyclecloud Log Locations
description: The location of the different logs associated with CycleCloud
author: adriankjohnson
ms.date: 12/16/2019
ms.author: adjohnso
---

# Common Logs

Depending on the issue you're trying to troubleshoot, there are different logs and standard paths to check for more information.

| Server       | Purpose                                                | Path                                                     |
| ------------ | -------------------------------------------------------| -------------------------------------------------------- |
| CycleCloud   | CycleCloud server application logs                     | /opt/cycle_server/logs/cycle_server.log                  |
| CycleCloud   | Log of all API requests to Azure from CycleCloud       | /opt/cycle_server/logs/azure-*.log                       |
| Cluster Node | Chef logs/troubleshooting software installation issues | /opt/cycle/jetpack/logs/chef-client.log                  |
| Cluster Node | Detailed chef stacktrace output                        | /opt/cycle/jetpack/system/chef/cache/chef-stacktrace.out |
| Cluster Node | Detailed cluster-init log output                       | /opt/cycle/jetpack/logs/cluster-init/{PROJECT_NAME}      |
| Cluster Node | Waagent logs (used to install Jetpack)                 | /var/log/waagent.log                                     |