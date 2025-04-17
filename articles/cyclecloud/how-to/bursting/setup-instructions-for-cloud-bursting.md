---
title: Cloud Bursting Setup Instruction
description: Learn how to setup Cloud bursting using Azure CycleCloud and Slurm.
author: vinil-v
ms.date: 12/23/2024
ms.author: padmalathas
---

## Setup Instructions

After we have the prerequisites ready, we can follow these steps to integrate the external Slurm Scheduler node with the CycleCloud cluster:

### Importing a Cluster Using the Slurm Headless Template in CycleCloud

- This step must be executed on the **CycleCloud VM**.
- Make sure that the **CycleCloud 8.6.4 VM** is running and accessible via the `cyclecloud` CLI.
- Execute the `cyclecloud-project-build.sh` script and provide the desired cluster name (e.g., `hpc1`). This will set up a custom project based on the `cyclecloud-slurm-3.0.9` version and import the cluster using the Slurm headless template.
- In the example provided, `hpc1` is used as the cluster name. You can choose any cluster name, but be consistent and use the same name throughout the entire setup.


```bash
git clone https://github.com/Azure/cyclecloud-slurm.git
cd cyclecloud-slurm/cloud_bursting/slurm-23.11.9-1/cyclecloud
sh cyclecloud-project-build.sh
```

Output :

```bash
[user1@cc86vm ~]$ cd cyclecloud-slurm/cloud_bursting/slurm-23.11.9-1/cyclecloud
[user1@cc86vm cyclecloud]$ sh cyclecloud-project-build.sh
Enter Cluster Name: hpc1
Cluster Name: hpc1
Use the same cluster name: hpc1 in building the scheduler
Importing Cluster
Importing cluster Slurm_HL and creating cluster hpc1....
----------
hpc1 : off
----------
Resource group:
Cluster nodes:
Total nodes: 0
Locker Name: cyclecloud_storage
Fetching CycleCloud project
Uploading CycleCloud project to the locker
```

### Slurm Scheduler Installation and Configuration

- A VM should be deployed using the specified **AlmaLinux HPC 8.7** or **Ubuntu HPC 22.04** image. 
- If you already have a Slurm Scheduler installed, you may skip this step. However, it is recommended to review the script to ensure compatibility with your existing setup.
- Run the Slurm scheduler installation script (`slurm-scheduler-builder.sh`) and provide the cluster name (`hpc1`) when prompted.
- This script will setup NFS server and install and configure Slurm Scheduler.
- If you are using an external NFS server, you can remove the NFS setup entries from the script.


```bash
git clone https://github.com/Azure/cyclecloud-slurm.git
cd cyclecloud-slurm/cloud_bursting/slurm-23.11.9-1/scheduler
sh slurm-scheduler-builder.sh
```
Output 

```bash
------------------------------------------------------------------------------------------------------------------------------
Building Slurm scheduler for cloud bursting with Azure CycleCloud
------------------------------------------------------------------------------------------------------------------------------

Enter Cluster Name: hpc1
------------------------------------------------------------------------------------------------------------------------------

Summary of entered details:
Cluster Name: hpc1
Scheduler Hostname: masternode2
NFSServer IP Address: 10.222.xxx.xxx
```

### CycleCloud UI Configuration

- Access the **CycleCloud UI** and navigate to the settings for the `hpc1` cluster.
- Edit the cluster settings to configure the VM SKUs and networking options as needed.
- In the **Network Attached Storage** section, enter the NFS server IP address for the `/sched` and `/shared` mounts.
- Select the OS from Advance setting tab - **Ubuntu 22.04** or **AlmaLinux 8** from the drop down based on the scheduler VM.
- Once all settings are configured, click **Save** and then **Start** the `hpc1` cluster.

![NFS settings](../../images/slurm-cloud-burst/cyclecloud-ui-config.png)

### CycleCloud Autoscaler Integration on Slurm Scheduler

- Integrate Slurm with CycleCloud using the `cyclecloud-integrator.sh` script.
- Provide CycleCloud details (username, password, and ip address) when prompted.

```bash
cd cyclecloud-slurm/cloud_bursting/slurm-23.11.9-1/scheduler
sh cyclecloud-integrator.sh
```
Output:

```bash
[root@masternode2 scripts]# sh cyclecloud-integrator.sh
Please enter the CycleCloud details to integrate with the Slurm scheduler

Enter Cluster Name: hpc1
Enter CycleCloud Username: user1
Enter CycleCloud Password:
Enter CycleCloud IP (e.g., 10.220.x.xx): 10.220.x.xx
------------------------------------------------------------------------------------------------------------------------------

Summary of entered details:
Cluster Name: hpc1
CycleCloud Username: user1
CycleCloud URL: https://10.220.x.xx

------------------------------------------------------------------------------------------------------------------------------
```

### User and Group Setup (Optional)

- Ensure consistent user and group IDs across all nodes.
- It is advisable to use a centralized User Management system like LDAP to maintain consistent UID and GID across all nodes.
- In this example, we are using the `useradd_example.sh` script to create a test user `user1` and a group for job submission. (User `user1` already exists in CycleCloud)

```bash
cd cyclecloud-slurm/cloud_bursting/slurm-23.11.9-1/scheduler
sh useradd_example.sh
```

### Testing the Setup

- Log in as a test user (e.g., `user1`) on the Scheduler node.
- Submit a test job to verify that the setup is functioning correctly.

```bash
su - user1
srun hostname &
```
Output:
```bash
[root@masternode2 scripts]# su - user1
Last login: Tue May 14 04:54:51 UTC 2024 on pts/0
[user1@masternode2 ~]$ srun hostname &
[1] 43448
[user1@masternode2 ~]$ squeue
             JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
                 1       hpc hostname    user1 CF       0:04      1 hpc1-hpc-1
[user1@masternode2 ~]$ hpc1-hpc-1
```
![Node Creation](../../images/slurm-cloud-burst/cyclecloud-ui-new-node.png)

You should see the job running successfully, indicating a successful integration with CycleCloud.

For further details and advanced configurations, refer to the scripts and documentation within this repository.
