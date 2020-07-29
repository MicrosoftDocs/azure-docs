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
of these systems going to the **Settings** page under the user menu in the top
right-hand corner of the web interface, double-clicking the **CycleCloud**
settings item, and checking the box labelled **Enable monitoring for CycleCloud
services**.

When this option is enabled, supported services in each cluster will
automatically register with CycleCloud, which will configure monitoring for that
service.

::: moniker range="=cyclecloud-7"
## Supported Services

**[Ganglia](http://ganglia.sourceforge.net/)**

Every version of CycleCloud ships with Ganglia monitoring support for collecting
performance metrics such as cpu/memory/bandwidth usage. If your cluster is
configured to use Ganglia (the default in most cases), automatic monitoring
will work as long as port 8652 is open between CycleCloud and the cluster's
master node (the one running the gmetad service).

### Ganglia on CentOS/RHEL

Ganglia on CentOS and RHEL is provided by [EPEL](https://fedoraproject.org/wiki/EPEL).
Azure CycleCloud configures and installs EPEL, and the Ganglia dependencies, by default.

One may choose to opt out of using EPEL by setting `cyclecloud.install_epel = false` in a cluster
template. Opting out of EPEL will skip Ganglia monitoring setup. This will not impact the computational
functionality of your compute cluster, but will forego data that would have been collected for the reports
view of your cluster.

For informational purposes, here are the "client" dependencies installed on execute cluster nodes,
and the "server" dependencies installed on master/head cluster nodes.

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

If you are running the Grid Scheduling Edition of CycleCloud, Grid Engine
monitoring will automatically be configured when a Grid Engine cluster is
started. The only requirement is that CycleCloud can SSH to the node running the
qmaster service with the keypair configured for the cluster.
::: moniker-end

::: moniker range=">=cyclecloud-8"
## Azure Monitor
Clusters deployed by CycleCloud can be monitored using the [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/) service. It's also possible to store log data from CycleCloud clusters to Log Analytics and create custom metrics dashboards. For more information on creating custom metrics dashboards from Log Analytics for your clusters, see the How-to section and the tutorials in the [Azure Monitor documentation](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-logs-dashboards).
::: moniker-end