---
title: Azure CycleCloud Node Configuration Resource | Microsoft Docs
description: Resource information for Node Configuration in Azure CycleCloud.
author: KimliW
ms.topic: reference
ms.date: 08/01/2018
ms.author: adjohnso
---
# Node Configuration Reference

Once an Azure CycleCloud node has been started, the configuration of the node itself is determined by using the software already installed via the image used to start the node, user defined actions specified in cluster­-init, or by specifying configuration parameters to the node at launch time. Here are some of the most commonly used parameters that can be set on nodes to customize their behavior at runtime.

All configuration parameters go inside a [[[configuration]]] section for a node defined in a [cluster template](cluster-templates.md).

Clusters consist of nodes, which define a single instance, and node arrays, which can be automatically scaled on demand. Node arrays support two size limits: `MaxCount`, which limits how many instances to start, and `MaxCoreCount`, which limits how many cores to start. The `MaxCount` and `MaxCoreCount` limits can also be set on the cluster to keep the size of clusters as a whole bounded. These maximums are hard limits, meaning no nodes will be started at any time if they would violate these constraints. That being said, neither setting will terminate existing instances.

## CycleCloud

Configuration attributes in the "cyclecloud" namespace are general parameters available on any node in a CycleCloud cluster.

| Parameter                                      | Description                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cyclecloud.maintenance_converge.enabled        | CycleCloud nodes are reconfigured every 20 minutes to ensure they are in the correct state. There are times when you may not want this to be the default behavior such as when you are manually testing and updating the configuration on a node. Setting this value to "false" will make the node configure itself only once. Default: true |
| cyclecloud.timezone                            | The timezone for a node can be changed by setting this attribute to any valid timezone string, for example “PST” or “EST”. Default: “UTC”                                                                                                                                                                                                    |
| cyclecloud.ntp.servers                         | A list of NTP servers to use. Default: “pool.ntp.org”                                                                                                                                                                                                                                                                                        |
| cyclecloud.keepalive.timeout                   | The amount of time in seconds to keep a node “alive” if it has not finished installing/configuring software. Default: 14400 (4 hours).                                                                                                                                                                                                       |
| cyclecloud.discoverable                        | Whether or not this node can be “discovered” (searched for) by other nodes started by CycleCloud. Default: "false".                                                                                                                                                                                                                          |
| cyclecloud.autoscale.forced_shutdown_timeout   | The amount of time (in minutes) before a forced shutdown occurs if autoscale cannot scale the node down successfully. Default: 15                                                                                                                                                                                                            |
| cyclecloud.hyperthreading.enabled              | Linux only. Whether or not to enable hyperthreading on the node. Default: "true"                                                                                                                                                                                                                                                             |
| cyclecloud.security.limits                  | Linux only. The limits to apply to the node. Domain, type, and item can be specified for any [valid value](https://linux.die.net/man/5/limits.conf) defined. Defaults: cyclecloud.security.limits.*.hard.nofile = 524288 and cyclecloud.security.limits.*.soft.nofile = 1048576                                                        |
| cyclecloud.shared_user.name                    | The username for the shared cluster user which is available on every node in the cluster. Default: “cluster.user”                                                                                                                                                                                                                            |
| cyclecloud.shared_user.password                | The password for the shared cluster user which is available on every node in the cluster. Default: Randomly generated if not specified.                                                                                                                                                                                                      |
| cyclecloud.mounts.                             | For [NFS exporting and mounting](storage-nfs-mounts.md) and volume mounting.                                                                                                                                                        |
| cyclecloud.selinux.policy                      | 	Linux only. Add "cyclecloud.selinux.policy = permissive" to your configuration to bypass an enforced selinux policy for custom images. Already disabled on core CycleCloud images.                                                                                                                                                          |

## CycleServer

Configuration attributes in the "cycle_server" namespace are available for any node running CycleServer monitoring software.

| Parameter                           | Description                                                                                                                              |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| cycle_server.admin.name             | The username for the CycleServer administrator account. Default: admin                                                                   |
| cycle_server.admin.pass             | The password for the CycleServer administrator account. Example: P@ssw0rd                                                                |
| cycle_server.user.name              | The username for a generic (non­administrator) account. Default: Undefined                                                               |
| cycle_server.user.pass              | The password for the generic (non­administrator) account. Default: Undefined                                                             |
| cycle_server.http_port              | Set the HTTP port for CycleServer. Default: 8080                                                                                         |
| cycle_server.https_port             | The HTTPS port for CycleServer. Default: 8443                                                                                            |
| cycle_server.use_https              | Enable or disable https support. Default: true                                                                                           |
| cycle_server.broker_port            | The port for the AMQP broker packaged with CycleServer. Default: 5672                                                                    |
| cycle_server.home                   | The location on the filesystem to install CycleServer. Default: /mnt/cycle_server                                                        |
| cycle_server.webserver_heap_size    | The size of the CycleServer webserver heap, expressed in megabytes (including “M”). Default: half of the instance’s total memory.        |

## GridEngine

Configuration attributes in the "gridengine" namespace are available to any node running the GridEngine scheduling software.

| Parameter                   | Description                                                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| gridengine.slots            | The number of slots this node should advertise are available for consumption. Default: The numbers of CPU cores on the node. |
| gridengine.slot_type        | The type of slot the node advertises is available for consumption. Default: “execute”                                        |
| gridengine.ignore_fqdn      | Whether or not fully qualified domain names will be ignored during hostname resolving. Default: "true"                       |
| gridengine.group.name       | The name for the Grid Engine group. Default: “sgeadmin”                                                                      |
| gridengine.group.gid        | The id for the Grid Engine group. Default: 546                                                                               |
| gridengine.user.name        | The username for the Grid Engine user. Default: “sgeadmin”                                                                   |
| gridengine.user.description | The description for the Grid Engine user. Default: “SGE admin user”                                                          |
| gridengine.user.home        | The home directory for the Grid Engine user. Default: “/shared/home sgeadmin”                                                |
| gridengine.user.shell       | The default shell for the Grid Engine user. Default: “/bin/bash                                                              |
| gridengine.user.uid         | The ID for the Grid Engine user. Default: 536                                                                                |
| gridengine.user.gid         | The group ID for the Grid Engine user. Default: The group ID specified by "gridengine.group.gid"                             |

## HTCondor

Configuration attributes in the "htcondor" namespace are available to any node running the HTCondor software stack.

| Parameters | Description                                                                                                                                                                                                                                                            |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| htcondor.agent_enabled                  | If true, use the condor_agent for job submission and polling. Default: false                                                                                                                                                                                           |
| htcondor.agent_version                  | The version of the condor_agent to use. Default: 1.27                                                                                                                                                                                                                  |
| htcondor.classad_lifetime               | The default lifetime of classads (in seconds). Default: 700                                                                                                                                                                                                            |
| htcondor.condor_owner                   | The Linux account that owns the HTCondor scaledown scripts. Default: root                                                                                                                                                                                              |
| htcondor.condor_group                   | The Linux group that owns the HTCondor scaledown scripts. Default: root                                                                                                                                                                                                |
| htcondor.data_dir                       | The directory for logs, spool directories, execute directories, and local config file. Default: /mnt/condor_data (Linux), C:\All Services\condor_local (Windows)                                                                                                       |
| htcondor.ignore_hyperthreads            | (Windows only) Set the number of CPUs to be half of the detected CPUs as a way to "disable" hyperthreading. If using autoscale, specify the non-hyperthread core count with the `Cores` configuration setting in the [[node]] or [[nodearray]] section. Default: false |
| htcondor.install_dir                    | The directory that HTCondor is installed to. Default: /opt/condor (Linux), C:\condor (Windows)                                                                                                                                                                         |
| htcondor.job_start_count                | The number of jobs a schedd will start per cycle. 0 is unlimited. Default: 20                                                                                                                                                                                          |
| htcondor.job_start_delay                | The number of seconds between each job start interval. 0 is immediate. Default: 1                                                                                                                                                                                      |
| htcondor.max_history_log                | The maximum size of the job history file in bytes. Default: 20971520                                                                                                                                                                                                   |
| htcondor.max_history_rotations          | The maximum number of job history files to keep. Default: 20                                                                                                                                                                                                           |
| htcondor.negotiator_cycle_delay         | The minimum number of seconds before a new negotiator cycle may start. Default: 20                                                                                                                                                                                     |
| htcondor.negotiator_interval            | How often (in seconds) the condor_negotiator starts a negotiation cycle. Default: 60                                                                                                                                                                                   |
| htcondor.negotiator_inform_startd       | If true, the negotiator informs the startd when it is matched to a job. Default: true                                                                                                                                                                                  |
| htcondor.remove_stopped_nodes           | If true, stopped execute nodes are removed from the CycleServer view instead of being marked as "down". Default: true                                                                                                                                                  |
| htcondor.running                        | If true, HTCondor collector and negotiator daemons run on the central manager. Otherwise, only the condor_master runs. Default: true                                                                                                                                   |
| htcondor.scheduler_dual                 | If true, schedulers run two schedds. Default: true                                                                                                                                                                                                                     |
| htcondor.single_slot                    | If true, treats the machine as a single slot (regardless of the number of cores the machine possesses). Default: false                                                                                                                                                 |
| htcondor.slot_type                      | Defines the slot_type of a node array for autoscaling. Default: execute                                                                                                                                                                                                |
| htcondor.update_interval                | The interval (in seconds) for the startd to publish an update to the collector. Default: 240                                                                                                                                                                           |
| htcondor.use_cache_config               | If true, use cache_config to have the instance poll CycleServer for configuration. Default: false                                                                                                                                                                      |
| htcondor.version                        | The version of HTCondor to install. Default: 8.2.6                                                                                                                                                                                                                     |

HTCondor has large number of configuration settings, including user-defined attributes. CycleCloud offers the ability to create a custom configuration file using attributes defined in the cluster:

| Attribute                                             | Description                                                                                               |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| htcondor.custom_config.enabled | If true, a configuration file is generated using the specified attributes. Default: false                                                              |
| htcondor.custom_config.file_name | The name of the file (placed in htcondor.data_dir /config) to write. Default: ZZZ-custom_config.txt   |
| htcondor.custom_config.settings | The attributes to write to the custom config file such as htcondor.custom_config.settings.max_jobs_running = 5000|

> [!NOTE]
> HTCondor configuration attributes containing a . cannot be specified using this method. If such attributes are needed, they should be specified in a cookbook or a file installed with cluster-init.

## Cluster­ Init

Configuration attribute in the [cluster_init](projects.md) namespace are available to all nodes started by CycleCloud, and are used for customizing how cluster-init operates.

| Parameter                          | Description                                                                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| cluster_init.allowed_executables   | The list of file extensions which will be allowed executed from within the "executables" directory. Default: .sh (Linux), .exe, .bat, .cmd (Windows). |
| cluster_init.fail_on_error         | Whether or not to fail the configuration process if a script error happens when running a cluster-­init executable. Default: "true"                   |
