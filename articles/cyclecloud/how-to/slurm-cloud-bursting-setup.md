---
title: Cloud Bursting Using Azure CycleCloud and Slurm
description: Learn how to configure Cloud bursting using Azure CycleCloud and Slurm.
author: vinil-v
ms.date: 12/23/2024
ms.author: padmalathas
---

# What is Cloud Bursting?

Cloud bursting is a configuration in cloud computing that allows an organization to handle peaks in IT demand by using a combination of private and public clouds. When the resources in a private cloud reach their maximum capacity, the overflow traffic is directed to a public cloud to ensure there is no interruption in services. This setup provides flexibility and cost savings, as you only pay for the additional resources when there is a demand for them.

For example, an application can run on a private cloud and "burst" to a public cloud only when necessary to meet peak demands. This approach helps avoid the costs associated with maintaining extra capacity that is not always in use

Cloud bursting can be used in various scenarios, such as enabling on-premises workloads to be sent to the cloud for processing, known as hybrid HPC (High-Performance Computing). This allows users to optimize their resource utilization and cost efficiency while accessing the scalability and flexibility of the cloud.

## Overview

This document offers a step-by-step guide on installing and configuring a Slurm scheduler to burst computing resources into the cloud using Azure CycleCloud. It explains how to create a Hybrid HPC (High-Performance Computing) environment by extending on-premises Slurm clusters into Azure, allowing for seamless access to scalable and flexible cloud computing resources. The guide provides a practical example of optimizing compute capacity by integrating local infrastructure with cloud-based solutions.


## Requirements to Setup Slurm Cloud Bursting Using CycleCloud on Azure

## Azure subscription account
You must obtain an Azure subscription or be assigned as an Owner role of the subscription.

* To create an Azure subscription, go to the [Create a Subscription](/azure/cost-management-billing/manage/create-subscription#create-a-subscription) documentation.
* To access an existing subscription, go to the [Azure portal](https://portal.azure.com/).

## Network infrastructure
If you intend to create a Slurm cluster entirely within Azure, you must deploy both the head node(s) and the CycleCloud compute nodes within a single Azure Virtual Network (VNET). 

![Slurm cluster](../images/slurm-cloud-burst/diagram.png)

However, if your goal is to establish a hybrid HPC cluster with the head node(s) located on your on-premises corporate network and the compute nodes in Azure, you will need to set up a [Site-to-Site](/azure/vpn-gateway/tutorial-site-to-site-portal) VPN or an [ExpressRoute](/azure/expressroute/) connection between your on-premises network and the Azure VNET. The head node(s) must have the capability to connect to Azure services over the Internet. You may need to coordinate with your network administrator to configure this connectivity.

## Network Ports and Security
The following NSG rules must be configured for successful communication between Master node, CycleCloud server and Compute nodes.


| **Service**                        | **Port**        | **Protocol** | **Direction**    | **Purpose**                                                            | **Requirement**                                                                 |
|------------------------------------|-----------------|--------------|------------------|------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| **SSH (Secure Shell)**             | 22              | TCP          | Inbound/Outbound | Secure command-line access to the Slurm Master node                     | Open on both on-premises firewall and Azure NSGs                                |
| **Slurm Control (slurmctld, slurmd)** | 6817, 6818   | TCP          | Inbound/Outbound | Communication between Slurm Master and compute nodes                    | Open in on-premises firewall and Azure NSGs                                     |
| **Munge Authentication Service**   | 4065            | TCP          | Inbound/Outbound | Authentication between Slurm Master and compute nodes                   | Open on both on-premises network and Azure NSGs                                 |
| **CycleCloud Service**             | 443             | TCP          | Outbound         | Communication between Slurm Master node and Azure CycleCloud            | Allow outbound connections to Azure CycleCloud services from the Slurm Master node |
| **NFS ports**                      | 2049            | TCP          | Inbound/Outbound | Shared filesystem access between Master node and Azure CycleCloud       | Open on both on-premises network and Azure NSGs                                 |
| **LDAP port** (Optional)           | 389             | TCP          | Inbound/Outbound | Centralized authentication mechanism for user management                | Open on both on-premises network and Azure NSGs                             

Please refer [Slurm Network Configuration Guide](https://slurm.schedmd.com/network.html)

## Software Requirement

- **OS Version**: AlmaLinux release 8.7 (`almalinux:almalinux-hpc:8_7-hpc-gen2:latest`) & Ubuntu HPC 22.04 (`microsoft-dsvm:ubuntu-hpc:2204:latest`)
- **Slurm Version**: 23.11.9-1
- **CycleCloud Version**: 8.6.4-3320

## NFS File server
A shared file system between the external Slurm Scheduler node and the CycleCloud cluster. You can use Azure NetApp Files, Azure Files, NFS, or other methods to mount the same file system on both sides. In this example, we are using a Scheduler VM as an NFS server.

## Centralized User management system (LDAP or AD)
In HPC environments, maintaining consistent user IDs (UIDs) and group IDs (GIDs) across the cluster is critical for seamless user access and resource management. A centralized user management system, such as LDAP or Active Directory (AD), ensures that UIDs and GIDs are synchronized across all compute nodes and storage systems.

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

![NFS settings](../images/slurm-cloud-burst/cyclecloud-ui-config.png)

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
![Node Creation](../images/slurm-cloud-burst/cyclecloud-ui-new-node.png)

You should see the job running successfully, indicating a successful integration with CycleCloud.

For further details and advanced configurations, refer to the scripts and documentation within this repository.

### Next Steps

* [GitHub repo - cyclecloud-slurm](https://github.com/Azure/cyclecloud-slurm/tree/master)
* [Azure CycleCloud Documentation](../overview.md)
* [Slurm documentation](https://slurm.schedmd.com/documentation.html)
