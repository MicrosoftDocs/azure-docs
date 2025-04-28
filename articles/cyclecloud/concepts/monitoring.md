---
title: Service Monitoring
description: Learn to monitor external services using Azure CycleCloud. Use Ganglia or Azure Monitor to collect performance metrics such as CPU, memory, and bandwidth usage.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Monitoring

Azure CycleCloud supports monitoring of external services through its pluggable
architecture. Administrators can enable automatic monitoring
of these systems by going to the **Settings** page under the user menu in the top
right corner of the web interface, double-clicking the **CycleCloud**
settings item, and checking the box labeled **Enable monitoring for CycleCloud
services**.

When you enable this option, supported services in each cluster automatically
register with CycleCloud, which configures monitoring for that
service.

::: moniker range="=cyclecloud-7"
## Supported services

**[Ganglia](http://ganglia.sourceforge.net/)**

Every version of CycleCloud ships with Ganglia monitoring support for collecting
performance metrics such as CPU/memory/bandwidth usage. If your cluster is
configured to use Ganglia (the default in most cases), automatic monitoring
works as long as port 8652 is open between CycleCloud and the cluster's
primary node (the one running the `gmetad` service).

### Ganglia on CentOS/RHEL

[EPEL](https://fedoraproject.org/wiki/EPEL) provides Ganglia on CentOS and RHEL.
Azure CycleCloud configures and installs EPEL and the Ganglia dependencies by default.

To opt out of using EPEL, set `cyclecloud.install_epel = false` in a cluster
template. Opting out of EPEL skips Ganglia monitoring setup. This change doesn't affect the computational
functionality of your compute cluster, but it foregoes data that the reports
view of your cluster collects.

For informational purposes, here are the "client" dependencies installed on execute cluster nodes,
and the "server" dependencies installed on primary cluster nodes.

```bash
# Ganglia client dependencies from CentOS/RHEL base
yum -y install apr bash expat glibc pcre python python-libs systemd zlib

# Ganglia client dependencies provided by EPEL
yum -y install ganglia ganglia-gmond ganglia-gmond-python libconfuse

# Ganglia server dependencies from CentOS/RHEL base
yum -y install apr bash expat glibc libmemcached pcre rrdtool systemd zlib

# Ganglia server dependencies provided by EPEL
yum -y install ganglia ganglia-gmetad libconfuse
```

**[Grid Engine](http://gridscheduler.sourceforge.net/)**

If you run the Grid Scheduling Edition of CycleCloud, Grid Engine
monitoring is automatically configured when you start a Grid Engine cluster. The only requirement is that CycleCloud can SSH to the node running the
`qmaster` service with the keypair configured for the cluster.
::: moniker-end

::: moniker range=">=cyclecloud-8"
## Azure Monitor
Starting with CycleCloud 8.0, metrics for a cluster are pulled from [Azure Monitor](/azure/azure-monitor/) instead of Ganglia.
This change removes the need to open port 8652 inbound on nodes.

> [!NOTE]
> Even clusters that use version 7 with Ganglia preinstalled get their metrics from Azure Monitor in CycleCloud 8.

The collected metrics are:

 * Percentage CPU
 * Disk Read Bytes
 * Disk Write Bytes
 * Network In
 * Network Out

You can also store log data from CycleCloud clusters to Log Analytics and create custom metrics dashboards. For more information on creating custom metrics dashboards from Log Analytics for your clusters, see the How-to section and the tutorials in the [Azure Monitor documentation](/azure/azure-monitor/visualize/tutorial-logs-dashboards).
::: moniker-end