---
title: "Tutorial: Install the Slurm Workload Manager on Azure Modeling and Simulation Workbench"
description: "Learn how to install the Slurm Workload Manager in the Azure Modeling and Simulation Workbench."
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: tutorial
ms.date: 10/02/2024

#CustomerIntent: As an administrator, I want to learn how to install, setup, and configure the Slurm workload manager in the Azure Modeling and Simulation Workbench.
---

# Tutorial: Install the Slurm workload manager in the Azure Modeling and Simulation Workbench

The [Slurm](https://slurm.schedmd.com/overview.html) Workload Manager is a scheduler used in microelectronics design and other high-performance computing scenarios to manage jobs across compute clusters. The Modeling and Simulation Workbench can be deployed with a range of high-performance virtual machines (VM) ideal for large, compute-intensive workloads. Slurm clusters consist of a *controller node* that manages, stages, and schedules jobs bound for the *compute nodes*. Compute nodes are where the actual workloads are performed. A *node* is an individual element of the cluster, such as a VM.

The Slurm installation package is already available on all Modeling and Simulation Workbench Chamber VMs. This tutorial shows you how to create VMs for your Slurm cluster and install Slurm.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a cluster for Slurm
> * Create an inventory of VMs
> * Designate controller and compute nodes and install Slurm on each

If you don’t have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

[!INCLUDE [prerequisite-chamber](./includes/prerequisite-chamber.md)]

[!INCLUDE [prerequisite-user-chamber-admin](./includes/prerequisite-user-chamber-admin.md)]

## Sign in to the Azure portal and navigate to your workbench

If you aren't already signed into the Azure portal, go to [portal.azure.com](https://portal.azure.com). Navigate to your workbench, then to the chamber you want to create your Slurm cluster.

## Create a cluster for Slurm

Slurm requires one node to serve as the controller and a set of compute nodes where workloads execute. The controller is traditionally a modestly sized VM. The controller isn't used for computational workloads and is left deployed between jobs, while the compute nodes themselves are typically sized for a specific task and often deleted after the job. Learn about the different VMs available in Modeling and Simulation Workbench on the [VM Offerings page](./concept-vm-offerings.md).

### Create the Slurm controller node

1. From the chamber overview page, select **Chamber VM** from the **Settings** menu, then either the **+ Create** button on action menu along the top or the blue **Create chamber VM** button in center of the page.
    :::image type="content" source="media/tutorial-slurm/create-chamber-vm.png" alt-text="Screenshot of chamber VM overview page with Chamber VM in Settings and the create options on the page highlighted by red outlines."  lightbox="media/tutorial-slurm/create-chamber-vm.png":::
1. On the **Create chamber VM** page:
    * Enter a **Name** for the VM. We recommend choosing a name that indicates it's the controller node.
    * Select a VM size. For the controller, you can select the smallest VM available. The *D4s_v4* is currently the smallest.
    * Leave the **Chamber VM image type** and **Chamber VM count** as the default of *Semiconductor* and *1*.
    * Select **Review + create**.
    :::image type="content" source="media/tutorial-slurm/configure-create-chamber-vm.png" alt-text="Screenshot of create chamber VM page with the name and VM size textboxes and the create button highlighted in red outline.":::
1. After the validation check passes, select the **Create** button.

Once the VM deploys, it's available in the connector desktop dashboard.

### Create a Slurm compute cluster

A *cluster* is a collection of VMs, individually referred to as *nodes* that perform the actual work. The compute nodes have their workloads dispatched and managed by the controller node. Similar to the steps you took when you created the  controller, return to the **Chamber VM** page to create a cluster. The Modeling and Simulation Workbench allows you to create multiple, identical VMs in a single step.

1. On the **Create chamber VM** page:
    * Enter a **Name** for the VM cluster. Use a name that identifies these VMs as compute nodes. For example, include the word "node" or the type of workload somewhere in the name.
    * Select a VM appropriately sized for the workload. Refer to the [VM Offerings](concept-vm-offerings.md) page for guidance on VM offerings, capabilities, features, and sizes.
    * Leave the **Chamber VM image type** as the default of *Semiconductor*.
    * In the **Chamber VM count** box, enter the number of nodes required.
    * Select **Review + create**.
1. After the validation check passes, select the **Create** button.

VMs are deployed in parallel and appear in the dashboard. It isn't typically necessary to individually access worker nodes, however you can ssh to worker nodes in the same chamber if needed. In the next steps, you'll configure the compute nodes from the controller.

### Connect to the controller node desktop

Slurm installation is performed from the controller node.

1. Navigate to the connector. From the **Settings** menu of the chamber, select **Connector**. Select the sole connector that appears in the resource list.
    :::image type="content" source="media/tutorial-slurm/connector-overview.png" alt-text="Screenshot of connector overview page with Connector in Settings and the target connector highlighted with a red rectangle.":::
1. From the connector page, select the **Desktop dashboard** URL.
    :::image type="content" source="media/tutorial-slurm/connector-desktop-dashboard-url.png" alt-text="Screenshot of connector overview page with desktop dashboard URL highlighted in red rectangle.":::
1. The desktop dashboard opens. Select your controller VM.

## Create an inventory of VMs

Slurm installation requires that you have a technical inventory of the compute nodes and as host names.

### Get a list of deployed VMs

Configuring Slurm requires an inventory of nodes. From the controller node:

1. Open a terminal in your desktop by selecting the terminal icon from the menu bar at the top.
    :::image type="content" source="media/tutorial-slurm/open-terminal.png" alt-text="Screenshot of desktop with terminal button highlighted in red.":::
1. Execute the following commands to print a list of all VMs in the chamber. In this example, we have one controller and five nodes. The command prints the IP addresses in the first column and the hostnames in the second. From the naming, you can see the controller node and the compute nodes.

    ```bash
    ip=$(hostname -i | cut -d'.' -f1-3)
    for i in {1..254}; do host "$ip.$i" | grep -v "not found" | awk -F'[. ]' '{print $4"."$3"."$2"."$1" "$10}'; done
    ```

    Your output will be similar to:

    ```bash
    10.163.4.4 wrkldvmslurmcont29085dd
    10.163.4.5 wrkldvmslurm-nod0aef63d
    10.163.4.6 wrkldvmslurm-nod10870ad
    10.163.4.7 wrkldvmslurm-node4689c2
    10.163.4.8 wrkldvmslurm-noddfe3a7c
    10.163.4.9 wrkldvmslurm-nod034b970    
    ```

1. Create a file with just the worker nodes, one host per line and call it *slurm_worker.txt*. For the remaining steps of this tutorial, use this list to configure the compute nodes from your controller. In some steps, the nodes need to be in a comma-delimited format. In those instances, we use a command-line shortcut to format the list without having to create a new file. To create *slurm_worker.txt*, remove the IP addresses in the first column, and the controller node which is listed first.

### Gather technical specifications about the compute nodes

Assuming that you created all the worker nodes in your cluster using the same VM, choose any node to retrieve technical information about the platform. In this example, we use `head` to grab the first host name in the compute node list and using `ssh` send the `lscpu` command to be executed:

```bash
$ ssh `head -1 ./slurm_worker.txt` lscpu
The authenticity of host 'wrkldvmslurm-nod034b970 (10.163.4.9)' can't be established.
ECDSA key fingerprint is SHA256:1I2zBg8N/1c0LBRfa+fOvpAoKe90OIr0FvgqwFSfoc0.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'wrkldvmslurm-nod034b970,10.163.4.9' (ECDSA) to the list of known hosts.
Architecture:        x86_64
CPU op-mode(s):      32-bit, 64-bit
Byte Order:          Little Endian
CPU(s):              4
On-line CPU(s) list: 0-3
Thread(s) per core:  2
Core(s) per socket:  2
Socket(s):           1
NUMA node(s):        1
Vendor ID:           GenuineIntel
CPU family:          6
Model:               85
Model name:          Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz
Stepping:            7
CPU MHz:             2593.907
BogoMIPS:            5187.81
Virtualization:      VT-x
Hypervisor vendor:   Microsoft
Virtualization type: full
L1d cache:           32K
L1i cache:           32K
L2 cache:            1024K
L3 cache:            36608K
NUMA node0 CPU(s):   0-3
Flags:               fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht syscall nx pdpe1gb rdtscp lm constant_tsc rep_good nopl xtopology cpuid pni pclmulqdq vmx ssse3 fma cx16 pcid sse4_1 sse4_2 movbe popcnt aes xsave avx f16c rdrand hypervisor lahf_lm abm 3dnowprefetch invpcid_single tpr_shadow vnmi ept vpid ept_ad fsgsbase bmi1 hle avx2 smep bmi2 erms invpcid rtm avx512f avx512dq rdseed adx smap clflushopt clwb avx512cd avx512bw avx512vl xsaveopt xsavec xgetbv1 xsaves avx512_vnni arch_capabilities
```

You'll be asked by the ssh client to verify the ECDSA key fingerprint of the remote machines. Take note of the following parameters:

* **CPU(s)**
* **Socket(s)**
* **Core(s) per socket**
* **Thread(s) per core**

Slurm also requires an estimate of available memory on the compute nodes. To obtain the available memory of a worker node, execute the `free` command on any of the compute nodes from your controller and note the **available** memory reported in the output. Again, we use the first worker node in our list using the `head` command submitted via `ssh`.

```bash
$ ssh `head -1 ./slurm_worker.txt` free
              total        used        free      shared  buff/cache   available
Mem:       16139424     1433696     7885256      766356     6820472    13593564
Swap:             0           0           0
```

Note the available memory listed in the **available** column.

## Install Slurm on your cluster

### Prerequisite: Install MariaDB

Slurm requires the MySql fork MariaDB to be installed from the Red Hat repository before installation. Azure maintains a private Red Hat repository mirror and chamber VMs have access to this repository. Install and configure MariaDB with the following commands:

```bash
sudo yum install -y mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb
mysql_secure_installation
```

The *mysql_secure_installation* script asks for more configuration.

* The default database password isn't set. Hit <kbd>Enter</kbd> when asked for current password.
* Enter *Y* when asked to set root password. Create a new, secure root password for MariaDB, take note of it for later, then reenter to confirm. You need this password when you configure the Slurm controller in the following step.
* Enter *Y* for the remaining questions for:
  * Reloading privileged tables
  * Removing anonymous users
  * Disabling remote root login
  * Removing tests databases
  * Reloading privilege tables

### Install Slurm on the controller

The Modeling and Simulation Workbench provides a setup script to speed installation. It requires the parameters you collected earlier in this tutorial. Replace the placeholders with the parameters you collected. Execute these commands on the controller node. The \<clusternodes\> placeholder is a comma-separated, no space list of hostnames. The examples include a shortcut to do so, reformatting your compute node list in *slurm_worker.txt* into the proper comma-delimited format. The argument of the *sdwChamberSlurm.sh* script is as follows:

```bash
sudo /usr/sdw/slurm/sdwChamberSlurm.sh CONTROLLER <databaseSecret> <clusterNodes> <numberOfCpus> <numberOfSockets> <coresPerSocket> <threadsPerCore> <availableMemory>
```

For this example, we use the list of nodes we created in the previous steps and substitute our values collected during discovery. The `paste` command is used to reformat the list of worker nodes into the comma-delimited format without needing to create a new file.

```bash
sudo /usr/sdw/slurm/sdwChamberSlurm.sh CONTROLLER <databasepassword> `paste -d, -s ./slurm_nodes.txt` 4 1 2 2 13593564
```

The output should be similar to:

```bash
Last metadata expiration check: 4:00:15 ago on Thu 03 Oct 2024 01:52:40 PM UTC.
Package bzip2-devel-1.0.6-26.el8.x86_64 is already installed.
Package gcc-8.5.0-18.2.el8_8.x86_64 is already installed..

...

Installed:
  slurm-24.05.0-1.el8.x86_64        slurm-slurmctld-24.05.0-1.el8.x86_64        slurm-slurmdbd-24.05.0-1.el8.x86_64       

Complete!
[INFO] Slurm Controller successfully installed.
[INFO] Slurm Config successfully updated.
[INFO] slurmdbd successfully started.
[INFO] slurmctld successfully started.
```

> [!TIP]
> If your installation shows any [ERROR] message in these steps, check that you haven't mistyped or misplaced any parameter. Review your information and repeat the step.

### Install Slurm on compute nodes

Slurm must now be installed on the compute nodes. To ease this task, use your home directory which is mounted on all VMs, to ease distribution of files and scripts used.  

From your user account, copy the *munge.key* file to your home directory.

```bash
cd
sudo cp /etc/munge/munge.key .
```

Create a script named *node-munge.sh* to set up each node's **munge** settings. This script should be in your home directory.

```bash
$ cat > node-munge.sh <<END
#!/bin/bash

mkdir -p /etc/munge
yum install -y munge
cp munge.key /etc/munge/munge.key
chown -R munge:munge /etc/munge/munge.key

END
```

Using the same file of the node hostnames that you previously used, execute the bash script you created on the node.

```bash
for host in `cat ./slurm_nodes.txt`; do ssh $host sudo sh ~/node-munge.sh; done
```

Your output should be similar to:

```bash
Last metadata expiration check: 4:02:25 ago on Thu 03 Oct 2024 09:35:58 PM UTC.
Dependencies resolved.
================================================================================
 Package
        Arch    Version        Repository                                  Size
================================================================================
Installing:
 munge  x86_64  0.5.13-2.el8   rhel-8-for-x86_64-appstream-eus-rhui-rpms  122 k

...

Running transaction
  Preparing        :                                                        1/1 
  Running scriptlet: munge-0.5.13-2.el8.x86_64                              1/1 
  Installing       : munge-0.5.13-2.el8.x86_64                              1/1 
  Running scriptlet: munge-0.5.13-2.el8.x86_64                              1/1 
  Verifying        : munge-0.5.13-2.el8.x86_64                              1/1 
Installed products updated.

Installed:
  munge-0.5.13-2.el8.x86_64                                                     

Complete!
```

> [!IMPORTANT]
> After configuring the compute nodes, be sure to delete the *munge.key* file from your home directory.

## Validate installation

To validate that Slurm installed successfully, a Chamber Admin can execute the `sinfo` command on any Slurm node, either on the controller or on a compute node.

```bash
$ sinfo
PARTITION               AVAIL  TIMELIMIT  NODES  STATE NODELIST
chamberSlurmPartition1*    up   infinite      5   idle wrkldvmslurm-nod0aef63d,wrkldvmslurm-nod034b970...
```

You can validate execution on compute nodes by sending a simple command using the `srun` command.

```shell
$ srun --nodes=6 hostname && srun sleep 30
wrkldvmslurm-nod034b970
wrkldvmslurm-nod0aef63d
wrkldvmslurm-nod10870ad
```

If a job shows as *queued*, run `squeue` to list the job queue.

```shell
$ squeue
      JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
         12 ChamberSl    sleep jane.doe  R       0:11      1        nodename1

$ scontrol show job
JobId=11 JobName=hostname
   UserId=jane.doe(2982) GroupId=jane.doe(2982) MCS_label=N/A
   Priority=4294901749 Nice=0 Account=(null) QOS=(null)
   JobState=COMPLETED Reason=None Dependency=(null)
   ...
   NodeList=nodename[1-3]
   BatchHost=nodename1
   NumNodes=3 NumCPUs=48 NumTasks=3 CPUs/Task=1 ReqB:S:C:T=0:0:*:*
   ...
   Command=hostname
   WorkDir=/mount/sharedhome/jane.doe
   Power=
   
JobId=12 JobName=sleep
   UserId=jane.doe(2982) GroupId=jane.doe(2982) MCS_label=N/A
   Priority=429490148 Nice=0 Account=(null) QOS=(null)
   JobState=COMPLETED Reason=None Dependency=(null)
   ...
   NodeList=nodename1
   BatchHost=nodename1
   NumNodes=1 NumCPUs=16 NumTasks=1 CPUs/Task=1 ReqB:S:C:T=0:0:*:*
   ...
   Command=sleep
   WorkDir=/mount/sharedhome/jane.doe
   Power=
```

## Troubleshooting

If a node's state is reported as *down* or *drain*, the `scontrol` command can restart it. Follow that with the `sinfo` command to verify activation.

```bash
$ sudo -u slurm scontrol update nodename=nodename1,nodename2 state=resume

$ sinfo
PARTITION               AVAIL  TIMELIMIT  NODES  STATE      NODELIST
chamberSlurmPartition1*    up   infinite      3   idle nodename[1-3]
```

## Related content

* [Slurm Workload Manager](https://slurm.schedmd.com/overview.html)
* [Slurm Workload Manager Quick Start Administrator Guide](https://slurm.schedmd.com/quickstart_admin.html)
* [Slurm Workload Manager configuration](https://slurm.schedmd.com/slurm.conf.html)
* [Slurm Accounting Storage configuration](https://slurm.schedmd.com/slurmdbd.conf.html)
* [VM Offerings on Modeling and Simulation Workbench](./concept-vm-offerings.md)
* [Create chamber storage](./how-to-guide-manage-chamber-storage.md)
* [Create shared storage](./how-to-guide-manage-shared-storage.md)
