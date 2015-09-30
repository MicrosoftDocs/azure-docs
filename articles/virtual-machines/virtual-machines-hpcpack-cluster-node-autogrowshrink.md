<properties
 pageTitle="Autoscale compute resources in HPC cluster | Microsoft Azure"
 description="Learn about ways to automatically grow and shrink compute resources in an HPC Pack cluster in Azure"
 services="virtual-machines"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""
 tags="azure-service-management"/>
<tags
ms.service="virtual-machines"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-multiple"
 ms.workload="big-compute"
 ms.date="09/28/2015"
 ms.author="danlep"/>

# Automatically scale Azure compute resources up and down in an HPC Pack cluster according to the cluster workload

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)] This article applies to managing a resource created with the classic deployment model.

If you deploy Azure “burst” nodes in your HPC Pack cluster, or you
create an HPC Pack cluster in Azure VMs, you may want a way to
automatically grow or shrink the Azure computing resources according to
the current workload of jobs and tasks on the cluster. This allows you
to use your Azure resources more efficiently and control their costs.
To do this, use the
**AzureAutoGrowShrink.ps1** HPC PowerShell script that is installed with
HPC Pack.

>[AZURE.TIP] Starting in HPC Pack 2012 R2 Update 2, HPC Pack includes a built-in
service to automatically grow and shrink Azure burst nodes or
Azure VM compute nodes. Configure the service with a setting in the [HPC
Pack IaaS deployment script](virtual-machines-hpcpack-cluster-powershell-script.md) or manually set the **AutoGrowShrink** cluster
property. See [What’s New in Microsoft HPC Pack 2012 R2 Update
2](https://technet.microsoft.com/library/mt269417.aspx).

## Prerequisites

* **HPC Pack 2012 R2 Update 1 or later cluster** - The **AzureAutoGrowShrink.ps1** script is installed in the %CCP_HOME%bin folder. The cluster head node can be deployed either on-premises or in an Azure VM. See [Set up a hybrid cluster with HPC Pack](../cloud-services/cloud-services-setup-hybrid-hpcpack-cluster.md) to get started with an on-premises head node and Azure "burst" nodes. See the [HPC Pack IaaS deployment script](virtual-machines-hpcpack-cluster-powershell-script.md)) to quickly deploy a HPC Pack cluster in Azure VMs.

* **For a cluster with Azure burst nodes** - Run the script on a client computer where HPC Pack is installed, or on the head node. If running on a client computer, ensure that you set the variable $env:CCP_SCHEDULER properly to point to the head node. The Azure “burst” nodes must already be added to the cluster, but they may be in the Not-Deployed state.


* **For a cluster deployed in Azure VMs** - Run the script on the head node VM, because it depends on the **Start-HpcIaaSNode.ps1** and **Stop-HpcIaaSNode.ps1** scripts that are installed there. Those scripts additionally require an Azure management certificate or publish settings file (see [Manage compute nodes in an HPC Pack cluster in Azure](virtual-machines-hpcpack-cluster-node-manage.md)). Make sure all the compute node VMs you need are already added to the cluster, but they may be in the Stopped state.

## Syntax

```
AzureAutoGrowShrink.ps1
[[-NodeTemplates] <String[]>] [[-JobTemplates] <String[]>] [[-NodeType] <String>]
[[-NumOfQueuedJobsPerNodeToGrow] <Int32>]
[[-NumOfQueuedJobsToGrowThreshold] <Int32>]
[[-NumOfActiveQueuedTasksPerNodeToGrow] <Int32>]
[[-NumOfActiveQueuedTasksToGrowThreshold] <Int32>]
[[-NumOfInitialNodesToGrow] <Int32>] [[-GrowCheckIntervalMins] <Int32>]
[[-ShrinkCheckIntervalMins] <Int32>] [[-ShrinkCheckIdleTimes] <Int32>]
[-UseLastConfigurations] [[-ArgFile] <String>] [[-LogFilePrefix] <String>]
[<CommonParameters>]

```
## Parameters

 * **NodeTemplates** - Names of the node templates to define the scope for the nodes to grow and shrink. If not specified (the default value is @()), all nodes in the **AzureNodes** node group are in scope when **NodeType** has a value of AzureNodes, and all nodes in the **ComputeNodes** node group are in scope when **NodeType** has a value of ComputeNodes.

 * **JobTemplates** -Names of the job templates to define the scope for the nodes to grow.

 * **NodeType** - The type of node  to grow and shrink. Supported values are:

     * **AzureNodes** – for Azure PaaS (burst) nodes in an on-premises or Azure IaaS cluster.

     * **ComputeNodes** - for compute node VMs only in an Azure IaaS cluster.

* **NumOfQueuedJobsPerNodeToGrow** - Number of queued jobs required to grow one node.

* **NumOfQueuedJobsToGrowThreshold** - The threshold number of queued jobs to start the grow process.

* **NumOfActiveQueuedTasksPerNodeToGrow** - The number of active queued tasks required to grow one node. If **NumOfQueuedJobsPerNodeToGrow** is specified with a value greater than 0, this parameter is ignored.

* **NumOfActiveQueuedTasksToGrowThreshold**- The threshold number of active queued tasks to start the grow process.

* **NumOfInitialNodesToGrow** - The initial minimum number of nodes to grow if all the nodes in scope are **Not-Deployed** or **Stopped (Deallocated)**.

* **GrowCheckIntervalMins** - The interval in minutes between checks to grow.

* **ShrinkCheckIntervalMins** - The interval in minutes between checks to shrink.

* **ShrinkCheckIdleTimes**- The number of continuous shrink checks (separated by **ShrinkCheckIntervalMins**) to indicate the nodes are idle.

* **UseLastConfigurations*** The previous configurations saved in the argument file.

* **ArgFile**- The name of the argument file used to save and update the configurations to run the script.

* **LogFilePrefix**- The prefix name of the log file. You can specify a path. By default the log is written to the current working directory.

### Example 1

The following example configures the Azure burst nodes deployed with the
Default AzureNode Template to grow and shrink automatically. If all the
nodes are initially in the **Not-Deployed** state, at least 3 nodes are
started. If the number of queued jobs exceeds 8, the script starts nodes
until their number exceeds the ratio of queued jobs to
**NumOfQueuedJobsPerNodeToGrow**. If a node is found to be idle in 3
consecutive idle times, it is stopped.

```
.\AzureAutoGrowShrink.ps1 -NodeTemplates @('Default AzureNode
 Template') -NodeType AzureNodes -NumOfQueuedJobsPerNodeToGrow 5
 -NumOfQueuedJobsToGrowThreshold 8 -NumOfInitialNodesToGrow 3
 -GrowCheckIntervalMins 1 -ShrinkCheckIntervalMins 1 -ShrinkCheckIdleTimes 3
```

### Example 2

The following example configures the Azure compute node VMs deployed
with the Default ComputeNode Template to grow and shrink automatically.
The jobs configured by the Default job template define the scope of the
workload on the cluster. If all the nodes are initially stopped, at
least 5 nodes are started. If the number of active queued tasks exceeds
15, the script starts nodes until their number exceeds the ratio of
active queued tasks to **NumOfActiveQueuedTasksPerNodeToGrow**. If a
node is found to be idle in 10 consecutive idle times, it is stopped.

```
.\AzureAutoGrowShrink.ps1 -NodeTemplates 'Default ComputeNode Template' -JobTemplates 'Default' -NodeType ComputeNodes -NumOfActiveQueuedTasksPerNodeToGrow 10 -NumOfActiveQueuedTasksToGrowThreshold 15 -NumOfInitialNodesToGrow 5 -GrowCheckIntervalMins 1 -ShrinkCheckIntervalMins 1 -ShrinkCheckIdleTimes 10 -ArgFile 'IaaSVMComputeNodes_Arg.xml' -LogFilePrefix 'IaaSVMComputeNodes_log'
```
