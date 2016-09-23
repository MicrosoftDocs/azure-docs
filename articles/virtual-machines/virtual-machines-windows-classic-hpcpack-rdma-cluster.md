<properties
 pageTitle="Set up a Windows RDMA cluster to run MPI applications | Microsoft Azure"
 description="Learn how to create a Windows HPC Pack cluster with size A8 or A9 VMs to use the Azure RDMA network to run MPI apps."
 services="virtual-machines-windows"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""
 tags="azure-service-management,hpc-pack"/>
<tags
ms.service="virtual-machines-windows"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-windows"
 ms.workload="big-compute"
 ms.date="07/15/2016"
 ms.author="danlep"/>

# Set up a Windows RDMA cluster with HPC Pack and A8 and A9 instances to run MPI applications

Set up a Windows RDMA cluster in Azure with [Microsoft HPC Pack](https://technet.microsoft.com/library/cc514029) and [size A8 and A9 compute-intensive instances](virtual-machines-windows-a8-a9-a10-a11-specs.md) to run parallel Message Passing Interface (MPI) applications. When you set up size A8 and A9 Windows Server-based instances to run in an HPC Pack cluster, MPI applications communicate efficiently over a low latency, high throughput network in Azure that is based on remote direct memory access (RDMA) technology.

If you want to run MPI workloads on Linux VMs that access the Azure RDMA network, see [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-classic-rdma-cluster.md).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

## HPC Pack cluster deployment options
Microsoft HPC Pack is a tool provided at no additional cost to create Windows Server–based HPC clusters in Azure. HPC Pack includes a runtime environment for the Microsoft implementation of the Message Passing Interface for Windows (MS-MPI). When used with A8 and A9 instances, HPC Pack provides an efficient way to run Windows-based MPI applications that access the RDMA network in Azure. 

This article introduces two scenarios and links to detailed guidance to deploy clustered A8 and A9
instances with Microsoft HPC Pack.

* Scenario 1. Deploy compute intensive worker role instances (PaaS)

* Scenario 2. Deploy compute nodes in compute intensive VMs (IaaS)

## Prerequisites

* **Review [background information and considerations](virtual-machines-windows-a8-a9-a10-a11-specs.md)** about the compute-intensive instances

* **Azure subscription** - If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes. 

* **Cores quota** - You might need to increase the quota of cores to deploy a cluster of A8 or A9 VMs. For example, you will need at least 128 cores if you want to deploy 8 A9 instances with HPC Pack. To increase a quota, open an [online customer support request](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) at no charge.

## Scenario 1. Deploy compute intensive worker role instances (PaaS)

From an existing HPC Pack cluster, add extra compute resources in Azure worker role instances (Azure nodes) running in a cloud
service (PaaS). This feature, also called “burst to Azure” from HPC
Pack, supports a range of sizes for the worker role instances. To use
the compute intensive instances, simply specify a size of A8 or A9 when
adding the Azure nodes.

The following are considerations and steps to burst to A8 or A9 Azure instances from an
existing (typically on-premises) cluster. Use similar procedures
to add worker role instances to an HPC Pack head node that is deployed
in an Azure VM.

>[AZURE.NOTE] For a tutorial to burst to Azure with HPC Pack, see [Set up a hybrid cluster with HPC Pack](../cloud-services/cloud-services-setup-hybrid-hpcpack-cluster.md). Note the considerations in the steps below that apply specifically to size A8 and A9 Azure nodes.

![Burst to Azure][burst]

### Steps

4. **Deploy and configure an HPC Pack 2012 R2 head node**

    Download the latest HPC Pack installation package from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=49922). For requirements and instructions to prepare for an Azure burst deployment, see [HPC Pack Getting Started Guide](https://technet.microsoft.com/library/jj884144.aspx) and [Burst to Azure Worker Instances with Microsoft HPC Pack](https://technet.microsoft.com/library/gg481749.aspx)

5. **Configure a management certificate in the Azure subscription**

    Configure a certificate to secure the connection between the head node and Azure. For options and procedures, see [Scenarios to Configure the Azure Management Certificate for HPC Pack](http://technet.microsoft.com/library/gg481759.aspx). For test deployments, HPC Pack installs a Default Microsoft HPC Azure Management Certificate you can quickly upload to your Azure subscription.

6. **Create a new cloud service and a storage account**

    Use the Azure classic portal to create a cloud service and a storage account for the deployment in a region where the compute intensive instances are available.

7. **Create an Azure node template**

    Use the Create Node Template Wizard in HPC Cluster Manager. For steps, see [Create an Azure node template](http://technet.microsoft.com/library/gg481758.aspx#BKMK_Templ) in “Steps to Deploy Azure Nodes with Microsoft HPC Pack”.

    For initial tests, we suggest configuring a manual availability policy in the template.

8. **Add nodes to the cluster**

    Use the Add Node Wizard in HPC Cluster Manager. For more information, see [Add Azure Nodes to the Windows HPC Cluster](http://technet.microsoft.com/library/gg481758.aspx#BKMK_Add).

    When specifying the size of the nodes, select A8 or A9.
    
    >[AZURE.NOTE]In each burst to Azure deployment with the compute-intensive instances, HPC Pack automatically deploys a minimum of 2 size A8 instances as proxy nodes, in addition to the Azure worker role instances you specify. The proxy nodes use cores that are allocated to the subscription and incur charges along with the Azure worker role instances.

9. **Start (provision) the nodes and bring them online to run jobs**

    Select the nodes and use the **Start** action in HPC Cluster Manager. When provisioning is complete, select the nodes and use the **Bring Online** action in HPC Cluster Manager. The nodes are ready to run jobs.

10. **Submit jobs to the cluster**

    Use HPC Pack job submission tools to run cluster jobs. See [Microsoft HPC Pack: Job Management](http://technet.microsoft.com/library/jj899585.aspx).

11. **Stop (deprovision) the nodes**

    When you are done running jobs, take the nodes offline and use the **Stop** action in HPC Cluster Manager.





## Scenario 2. Deploy compute nodes in compute-intensive VMs (IaaS)

In this scenario, you deploy the HPC Pack head node and cluster compute nodes on VMs joined to an Active Directory domain in an Azure virtual network. HPC Pack provides a number of [deployment options in Azure VMs](virtual-machines-linux-hpcpack-cluster-options.md), including automated deployment scripts and Azure quickstart templates. As an example, the considerations and steps below guide you to use
the [HPC Pack IaaS deployment
script](virtual-machines-windows-classic-hpcpack-cluster-powershell-script.md) to
automate most of this process.

![Cluster in Azure VMs][iaas]



### Steps

1. **Create a cluster head node and compute node VMs by running the HPC Pack IaaS deployment script on a client computer**

    Download the HPC Pack IaaS Deployment Script package from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=49922).

    To prepare the client computer, create the script configuration file, and run the script, see [Create an HPC Cluster with the HPC Pack IaaS deployment script](virtual-machines-windows-classic-hpcpack-cluster-powershell-script.md). 
    
    To deploy size A8 and A9 compute nodes, note the following additional considerations:
    
    * **Virtual network** - Specify a new virtual network in a region in which the A8 and A9 instances are available.

    * **Windows Server operating system** - To support RDMA connectivity, specify a Windows Server 2012 R2 or Windows Server 2012 operating system for the size A8 or A9 VMs.

    * **Cloud services** - We recommend deploying your head node in one cloud service and your A8 and A9 compute nodes in a different cloud service.

    * **Head node size** - For this scenario, consider a size of at least A4 (Extra Large) for the head node.

    * **HpcVmDrivers extension** - The deployment script installs the Azure VM Agent and the HpcVmDrivers extension automatically when you deploy size A8 or A9 compute nodes with a Windows Server operating system. HpcVmDrivers installs drivers on the compute node VMs so they can connect to the RDMA network.

    * **Cluster network configuration** - The deployment script automatically sets up the HPC Pack cluster in Topology 5 (all nodes on the Enterprise network). This topology is required for all HPC Pack cluster deployments in VMs. Do not change the cluster network topology later.

2. **Bring the compute nodes online to run jobs**

    Select the nodes and use the **Bring Online** action in HPC Cluster Manager. The nodes are ready to run jobs.

3. **Submit jobs to the cluster**

    Connect to the head node to submit jobs, or set up an on-premises computer to do this. For information, see [Submit Jobs to an HPC cluster in Azure](virtual-machines-windows-hpcpack-cluster-submit-jobs.md).

4. **Take the nodes offline and stop (deallocate) them**

    When you are done running jobs, take the nodes offline in HPC Cluster Manager. Then, use Azure management tools to shut them down.



## Run MPI applications on the A8 and A9 instances

### Example: Run mpipingpong on an HPC Pack cluster

To verify an HPC Pack deployment of the compute-intensive instances, run the HPC Pack **mpipingpong** command on the cluster. **mpipingpong**
sends packets of data between paired nodes repeatedly to calculate
latency and throughput measurements and statistics for the RDMA-enabled
application network. This example shows a typical pattern for running an
MPI job (in this case, **mpipingpong**) by using the cluster **mpiexec**
command.

This example assumes you added Azure nodes in a “burst to Azure”
configuration ([Scenario 1](#scenario-1.-deploy-compute-intensive-worker-role-instances-(PaaS) in this article). If you deployed HPC Pack on a cluster of Azure VMs,
you’ll need to modify the command syntax to specify a different node
group and set additional environment variables to direct network traffic
to the RDMA network.


To run mpipingpong on the cluster:


1. On the head node or on a properly configured client computer, open a Command Prompt.

2. To estimate latency between pairs of nodes in an Azure burst deployment of 4 nodes, type the following command to submit a job to run mpipingpong with a small packet size and a large number of iterations:

    ```
    job submit /nodegroup:azurenodes /numnodes:4 mpiexec -c 1 -affinity mpipingpong -p 1:100000 -op -s nul
    ```

    The command returns the ID of the job that is submitted.

    If you deployed the HPC Pack cluster deployed on Azure VMs, specify a node group that contains compute node VMs deployed in a single cloud service, and modify the **mpiexec** command as follows:

    ```
    job submit /nodegroup:vmcomputenodes /numnodes:4 mpiexec -c 1 -affinity -env MSMPI_DISABLE_SOCK 1 -env MSMPI_PRECONNECT all -env MPICH_NETMASK 172.16.0.0/255.255.0.0 mpipingpong -p 1:100000 -op -s nul
    ```

3. When the job completes, to view the output (in this case, the output of task 1 of the job), type the following

    ```
    task view <JobID>.1
    ```

    where &lt;*JobID*&gt; is the ID of the job that was submitted.

    The output will include latency results similar to the following.

    ![Ping pong latency][pingpong1]

4. To estimate throughput between pairs of Azure burst nodes, type the following command to submit a job to run **mpipingpong** with a large packet size and a small number of iterations:

    ```
    job submit /nodegroup:azurenodes /numnodes:4 mpiexec -c 1 -affinity mpipingpong -p 4000000:1000 -op -s nul
    ```

    The command returns the ID of the job that is submitted.

    On an HPC Pack cluster deployed on Azure VMs, modify the command as noted in step 2.

5. When the job completes, to view the output (in this case, the output of task 1 of the job), type the following:

    ```
    task view <JobID>.1
    ```

  The output will include throughput results similar to the following.

  ![Ping pong throughput][pingpong2]


### MPI application considerations


The following are considerations for running MPI applications on Azure
instances. Some apply only to deployments of Azure nodes (worker role
instances added in a “burst to Azure” configuration).

* Worker role instances in a cloud service are periodically reprovisioned without notice by Azure (for example, for system maintenance, or in case an instance fails). If an instance is reprovisioned while it is running an MPI job, the instance loses all its data and returns to the state when it was first deployed, which can cause the MPI job to fail. The more nodes that you use for a single MPI job, and the longer the job runs, the more likely that one of the instances will be reprovisioned while a job is running. You should also consider this if you designate a single node in the deployment as a file server.


* You don't have to use the A8 and A9 instances to run MPI jobs in Azure. You can use any instance size that is supported by HPC Pack. However, the A8 and A9 instances are recommended for running relatively large-scale MPI jobs that are sensitive to the latency and the bandwidth of the network that connects the nodes. If you use instances other than A8 and A9 to run latency and bandwidth sensitive MPI jobs, we recommend running small jobs, in which a single task runs on only a few nodes.

* Applications deployed to Azure instances are subject to the licensing terms associated with the application. Check with the vendor of any commercial application for licensing or other restrictions for running in the cloud. Not all vendors offer pay-as-you-go licensing.


* Azure instances need further setup to access on-premises nodes, shares, and license servers. For example, to enable the Azure nodes to access an on-premises license server, you can configure a site-to-site Azure virtual network.


* To run MPI applications on Azure instances, register each MPI application with Windows Firewall on the instances by running the **hpcfwutil** command. This allows MPI communications to take place on a port that is assigned dynamically by the firewall.

    >[AZURE.NOTE] For burst to Azure deployments, you can also configure a firewall exception command to run automatically on all new Azure nodes that are added to your cluster. After you run the **hpcfwutil** command and verify that your application works, add the command to a startup script for your Azure nodes. For more information, see [Use a Startup Script for Azure Nodes](https://technet.microsoft.com/library/jj899632.aspx).



* HPC Pack uses the CCP_MPI_NETMASK cluster environment variable to specify a range of acceptable addresses for MPI communication. Starting in HPC Pack 2012 R2, the CCP_MPI_NETMASK cluster environment variable only affects MPI communication between domain-joined cluster compute nodes (either on-premises or in Azure VMs). The variable is ignored by nodes added in a burst to Azure configuration.


* MPI jobs can't run across Azure instances that are deployed in different cloud services (for example, in burst to Azure deployments with different node templates, or Azure VM compute nodes deployed in multiple cloud services). If you have multiple Azure node deployments that are started with different node templates, the MPI job must run on only one set of Azure nodes.


* When you add Azure nodes to your cluster and bring them online, the HPC Job Scheduler Service immediately tries to start jobs on the nodes. If only a portion of your workload can run on Azure, ensure that you update or create job templates to define what job types can run on Azure. For example, to ensure that jobs submitted with a job template only run on Azure nodes, add the Node Groups property to the job template and select AzureNodes as the required value. To create custom groups for your Azure nodes, use the Add-HpcGroup HPC PowerShell cmdlet.


## Next steps

* As an alternative to using HPC Pack, develop with the Azure Batch service to run MPI applications on managed pools of compute nodes in Azure. See [Use multi-instance tasks to run Message Passing Interface (MPI) applications in Azure Batch](../batch/batch-mpi.md).

* If you want to run Linux MPI applications that access the Azure RDMA network, see [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-classic-rdma-cluster.md).

<!--Image references-->
[burst]: ./media/virtual-machines-windows-classic-hpcpack-rdma-cluster/burst.png
[iaas]: ./media/virtual-machines-windows-classic-hpcpack-rdma-cluster/iaas.png
[pingpong1]: ./media/virtual-machines-windows-classic-hpcpack-rdma-cluster/pingpong1.png
[pingpong2]: ./media/virtual-machines-windows-classic-hpcpack-rdma-cluster/pingpong2.png
