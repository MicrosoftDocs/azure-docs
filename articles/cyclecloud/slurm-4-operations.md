---
title: Operate and troubleshoot CycleCloud Slurm 4 clusters
description: Learn how to configure Slurm 4 operational services, monitor cluster health, verify support, and troubleshoot clusters in Azure CycleCloud.
author: anhoward
ai-usage: ai-assisted
ms.date: 08/14/2026
ms.topic: how-to
ms.author: anhoward
---

# Operate and troubleshoot CycleCloud Slurm 4 clusters

This article reflects CycleCloud Slurm project version 4.0.10.

Use this article after you configure a CycleCloud Slurm 4 cluster. It explains how to configure job accounting and REST API access, monitor cluster health, verify supported configurations, and resolve common problems.

For cluster changes, partitions, scaling, topology, KeepAlive, and high availability, see [Configure and manage CycleCloud Slurm 4 clusters](slurm-4.md).

For the project source and release-specific information, see the [CycleCloud Slurm project](https://github.com/Azure/cyclecloud-slurm).

## Configure Slurm job accounting

Slurm job accounting preserves cluster job history and is highly recommended. For general information, see [Slurm accounting](https://slurm.schedmd.com/accounting.html).

Configure accounting in the cluster creation UI:

* **Database URL**: The DNS name or IP address of the MySQL server.
* **Database Name**: The database that the cluster uses. If you don't provide a name, the default is `<cluster-name>-acct-db`.
* **Database User** and **Database Password**: The credentials that `slurmdbd` uses.
* **Custom SSL Certificate**: Enables a custom certificate instead of the default CA bundle for Azure Database for MySQL Flexible Server.
* **Custom SSL Certificate for DB Authentication**: The PEM contents of the custom certificate.

Deleting a cluster doesn't delete its accounting database. Archive or delete databases separately to control MySQL costs.

### Report costs

The experimental `azslurm cost` command maps Azure retail prices to Slurm accounting data. It requires CycleCloud 8.4 or later and job accounting.

```bash
azslurm cost -s 2026-08-01 -e 2026-08-14 -o august-2026
```

The output directory contains:

* `jobs.csv`: Cost per job, including running jobs.
* `partition.csv`: Cost per partition and VM size.
* `partition_hourly.csv`: Hourly cost per partition.

Use `-f` to append fields available from `sacct -e` to `jobs.csv`:

```bash
azslurm cost -s 2026-08-01 -e 2026-08-14 -o august-2026 \
    -f account,cluster,jobid,jobname,start,end,state,user
```

Cost reporting uses retail Azure prices, which might not match the customer invoice.

## Use slurmrestd

Starting with project version 4.0.5, `slurmrestd` is automatically configured and started on scheduler and scheduler-ha nodes. If `libjwt` is installed, `slurmrestd` uses JWT authentication. Otherwise, it uses MUNGE authentication.

For more information, see the [Slurm REST API](https://slurm.schedmd.com/rest_api.html) and [Slurm REST API security](https://slurm.schedmd.com/rest.html#security).

## Configure node health checks

CycleCloud Slurm installs [CycleCloud Healthagent](https://azure.github.io/cyclecloud-healthagent/) on every node. Healthagent runs continuously and reports node health issues. The Slurm health-check script reads Healthagent results and drains unhealthy nodes.

The default `slurm.conf` includes:

* `HealthCheckProgram`: Calls the Healthagent CLI and drains nodes with health errors.
* `HealthCheckInterval`: Runs the program every 60 seconds.
* `HealthCheckState`: Runs checks for nodes in any state.

To disable Slurm health checks while retaining Healthagent reporting, set `slurm.enable_healthchecks = false` before you start the cluster. You can also set `HealthCheckInterval=-1` or limit `HealthCheckState`.

To disable Healthagent entirely, set `cyclecloud.healthagent.disable = true`. Disabling Healthagent isn't recommended.

## Configure monitoring

Starting with project version 4.0.3, you can enable the [CycleCloud monitoring project](https://github.com/Azure/cyclecloud-monitoring) on the cluster **Monitoring** tab.

First, deploy the Azure managed monitoring infrastructure and grant the **Monitoring Metrics Publisher** role to a user-assigned managed identity. In the cluster settings, enter the identity's client ID and the Azure Monitor workspace ingestion endpoint.

Monitoring installs and configures:

* Prometheus Node Exporter on every node, on port 9100.
* NVIDIA DCGM Exporter on NVIDIA GPU nodes, on port 9400.
* AzSlurm Exporter on the scheduler, on port 9101.

Test the exporters locally:

```bash
curl -s http://localhost:9100/metrics
curl -s http://localhost:9400/metrics
curl -s http://localhost:9101/metrics
```

AzSlurm Exporter collects job state from `squeue`, terminal job data from `sacct`, node state from `sinfo`, scheduler diagnostics from `sdiag`, quota and partition data from `azslurm`, and Azure region metadata from `jetpack`. Its log is `/var/log/azslurm-exporter.log`.

Change the AzSlurm Exporter port as root:

```bash
export AZSLURM_EXPORTER_PORT=<port>
/opt/azurehpc/slurm/venv/bin/azslurm-exporter-install
systemctl restart azslurm-exporter
```

## Supported versions and operating systems

The current supported Slurm version is 25.11.5, compiled with PMIx 4.2.9. You can download Slurm and PMIx packages exclusively from packages.microsoft.com.

| Operating system | Architecture | Package repository |
| --- | --- | --- |
| Ubuntu 22.04 | amd64 | `https://packages.microsoft.com/repos/slurm-ubuntu-jammy/` |
| Ubuntu 24.04 | amd64, arm64 | `https://packages.microsoft.com/repos/slurm-ubuntu-noble/` |
| AlmaLinux 8 | amd64 | `https://packages.microsoft.com/yumrepos/slurm-el8/` |
| AlmaLinux 9 | amd64 | `https://packages.microsoft.com/yumrepos/slurm-el9/` |
| Red Hat Enterprise Linux 8 | amd64 | `https://packages.microsoft.com/yumrepos/slurm-el8/` |
| Red Hat Enterprise Linux 9 | amd64 | `https://packages.microsoft.com/yumrepos/slurm-el9/` |
| Rocky Linux 8 | amd64 | `https://packages.microsoft.com/yumrepos/slurm-el8/` |
| Rocky Linux 9 | amd64 | `https://packages.microsoft.com/yumrepos/slurm-el9/` |

CycleCloud also supports SUSE Linux Enterprise Server (SLES) 15 HPC, but it installs only the Slurm version available from the SLES HPC repositories. For SLES, `slurmrestd`, monitoring, and background health checks are disabled.

Azure Linux 3 requires a custom image with Slurm and its dependencies preinstalled because no packages.microsoft.com repository is available. Scheduler images also require `slurm-slurmctld`, `slurm-slurmdbd`, and `slurm-slurmrestd`. Execute-node images require `slurm-slurmd`.

## Slurm template configuration reference

| Configuration option | Default | Description |
| --- | --- | --- |
| `slurm.version` | `25.11.5` | Slurm version to install and run. |
| `slurm.insiders` | `false` | Installs Slurm from the packages.microsoft.com insiders repository when `true`. |
| `slurm.autoscale` | `false` | Enables automatic start and stop for a node array. |
| `slurm.hpc` | `true` | Places autoscaled nodes in the same placement group for tightly coupled jobs. |
| `slurm.partition` | Node-array name | Overrides the Slurm partition name for a node array. |
| `slurm.default_partition` | `false` | Makes the node array the default partition. |
| `slurm.dynamic_config` | None | Supplies `slurmd` options for a dynamic partition. |
| `slurm.dampen_memory` | `5` | Percentage of memory reserved for operating-system and VM overhead. |
| `slurm.suspend_timeout` | `600` | Seconds between a suspend request and when the node can be used again. |
| `slurm.resume_timeout` | `1800` | Seconds to wait for a node to start. |
| `slurm.use_pcpu` | `true` | Schedules with physical CPUs when hyperthreading is enabled. |
| `slurm.enable_healthchecks` | `true` | Enables Slurm background health checks every minute. |
| `slurm.accounting.enabled` | `false` | Enables Slurm job accounting. |
| `slurm.accounting.url` | None | Database URL for Slurm accounting. Required when accounting is enabled. |
| `slurm.accounting.storageloc` | `<cluster-name>-acct-db` | Accounting database name. |
| `slurm.accounting.user` | None | Database user. Required when accounting is enabled. |
| `slurm.accounting.password` | None | Database password. Required when accounting is enabled. |
| `slurm.accounting.certificate` | Azure Database for MySQL CA bundle | Optional custom SSL certificate. |
| `slurm.additional.config` | None | Extra lines to add to `slurm.conf`. |
| `slurm.ha_enabled` | `false` | Deploys a second scheduler node. |
| `slurm.launch_parameters` | `use_interactive_step` | Comma-separated Slurm launch parameters. |
| `slurm.user.name` | `slurm` | Slurm service user name. |
| `slurm.user.uid`, `slurm.user.gid` | `11100` | Slurm service user and group IDs. |
| `munge.user.name` | `munge` | MUNGE service user name. |
| `munge.user.uid`, `munge.user.gid` | `11101` | MUNGE service user and group IDs. |
| `slurm.slurmrestd.user.name` | `slurmrestd` | Slurm REST service user name. |
| `slurm.slurmrestd.user.uid`, `slurm.slurmrestd.user.gid` | `11102` | Slurm REST service user and group IDs. |
| `slurm.imex.enabled` | VM dependent | Enables IMEX for jobs. Defaults to `true` for GB200 and GB300 nodes. |

## Troubleshooting

### Resolve UID conflicts

The default Slurm, MUNGE, and `slurmrestd` UID and GID values are 11100, 11101, and 11102, respectively. If one of these values conflicts with another user or group, terminate the cluster and override these values in the **Configuration** section for every node array, including `scheduler` and `scheduler-ha`:

```ini
munge.user.uid = <uid>
munge.user.gid = <gid>
slurm.slurmrestd.user.uid = <uid>
slurm.slurmrestd.user.gid = <gid>
slurm.user.uid = <uid>
slurm.user.gid = <gid>
```

The UID and GID values for each service must be consistent across the cluster. Inconsistent values result in `slurmd` security-violation errors.

### Correct the number of GPUs

CycleCloud might report an incorrect GPU count for some VM sizes or subscriptions. Override the `slurm_gpus` resource for the VM size in `/opt/azurehpc/slurm/autoscale.json`. Put specific selectors before the default selector:

```json
{
  "default_resources": [
    {
      "select": {"node.vm_size": "Standard_XYZ"},
      "name": "slurm_gpus",
      "value": 8
    },
    {
      "select": {},
      "name": "slurm_gpus",
      "value": "node.gpu_count"
    }
  ]
}
```

Run `azslurm scale` to apply the change. To preview the generated partition definition, run `azslurm partitions`.

### Adjust reported memory

Slurm must report memory after operating-system and application overhead. By default, CycleCloud Slurm reserves 5 percent or 1 GiB, whichever is larger.

Set `slurm.dampen_memory` to change the reserved percentage. Alternatively, define a `slurm_memory` default resource in `/opt/azurehpc/slurm/autoscale.json`. The `slurm.dampen_memory` setting takes precedence over a default resource.

### Handle KeepAlive zombie nodes from versions earlier than 4.0

Before native KeepAlive integration, a node could continue running in CycleCloud while Slurm marked it powered down. Project versions 3.0.7 and later leave these zombie nodes in `down~` or `drained~`.

To return a node to the cluster, connect to it and restart `slurmd`. To terminate it, use the CycleCloud UI or `azslurm suspend`. To terminate zombie nodes automatically, add the following setting to `/opt/azurehpc/slurm/autoscale.json`:

```json
{
  "return-to-idle": {
    "terminate-zombie-nodes": true
  }
}
```

### Transition from 3.0 to 4.0

When you move from project version 3.x to 4.x:

1. Slurm downloads come exclusively from packages.microsoft.com. You can't disable packages.microsoft.com, and GitHub binary blobs aren't used.
1. The system automatically configures and starts `slurmrestd` on scheduler and scheduler-ha nodes.
1. `azslurm topology` replaces `azslurm generate_topology`.
1. Check custom images and supported operating systems against the current package repositories.
1. If service user IDs conflict in your environment, configure the new `slurmrestd` UID and GID consistently across all node arrays.

For changes from project version 2.7 to 3.0, including the `/opt/azurehpc/slurm` installation path, `azslurm` CLI, and on-demand node creation, see [Transitioning from 2.7 to 3.0](slurm-3.md#transitioning-from-27-to-30).

### Resolve Ubuntu 22.04 or later DNS hostname issues

CycleCloud Slurm restarts `systemd-networkd` after changing the hostname of a VM deployed in a Virtual Machine Scale Set. This action mitigates an Azure DNS registration issue. To disable this mitigation, add:

```ini
[[[configuration]]]
slurm.ubuntu22_waagent_fix = false
```

### Capture troubleshooting data

Run the following command on every scheduler, login, or execute node that needs investigation:

```bash
/opt/cycle/capture_logs.sh
```

The script creates a tar archive of logs and configuration data to provide with a support case.

[!INCLUDE [scheduler-integration](~/articles/cyclecloud/includes/scheduler-integration.md)]