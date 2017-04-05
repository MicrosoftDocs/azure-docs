---
title: Autoscale HPC Pack cluster nodes | Microsoft Docs
description: Automatically grow and shrink the number of HPC Pack cluster compute nodes in Azure
services: virtual-machines-windows
documentationcenter: ''
author: dlepow
manager: ''
editor: tysonn


ms.assetid: 38762cd1-f917-464c-ae5d-b02b1eb21e3f
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-multiple
ms.workload: big-compute
ms.date: 12/08/2016
ms.author: danlep

---
# Automatically grow and shrink the HPC Pack cluster resources in Azure according to the cluster workload
If you deploy Azure “burst” nodes in your HPC Pack cluster, or you
create an HPC Pack cluster in Azure VMs, you may want a way to
automatically grow or shrink the cluster resources such as nodes or cores according to
the workload on the cluster. Scaling the cluster resources in this way allows you
to use your Azure resources more efficiently and control their costs.

This article shows you two ways that HPC Pack provides to autoscale compute resources:

* The HPC Pack cluster property **AutoGrowShrink**

* The **AzureAutoGrowShrink.ps1** HPC PowerShell script

[!INCLUDE [learn-about-deployment-models](../../../../includes/learn-about-deployment-models-both-include.md)]

Currently you can only automatically grow and shrink HPC Pack compute nodes that are running a Windows Server operating system.


## Set the AutoGrowShrink cluster property
### Prerequisites

* **HPC Pack 2012 R2 Update 2 or later cluster** - The cluster head node can be deployed either on-premises or in an Azure VM. See [Set up a hybrid cluster with HPC Pack](../../../cloud-services/cloud-services-setup-hybrid-hpcpack-cluster.md) to get started with an on-premises head node and Azure "burst" nodes. See the [HPC Pack IaaS deployment script](hpcpack-cluster-powershell-script.md) to quickly deploy an HPC Pack cluster in Azure VMs.

* **For a cluster with a head node in Azure (Resource Manager deployment model)** - Starting in HPC Pack 2016, certificate authentication in an Azure Active Directory application is used for automatically growing and shrinking cluster VMs deployed using Azure Resource Manager. Configure a certificate as follows:

  1. After cluster deployment, connect by Remote Desktop to one head node.

  2. Upload the certificate (PFX format with private key) to each head node and install to Cert:\LocalMachine\My and Cert:\LocalMachine\Root.

  3. Start Azure PowerShell as an administrator and run the following commands on one head node:

    ```powershell
        cd $env:CCP_HOME\bin

        Login-AzureRmAccount
    ```
        
    If your account is in more than one Azure Active Directory tenant or Azure subscription, you can run the following command to select the correct tenant and subscription:
  
    ```powershell
        Login-AzureRMAccount -TenantId <TenantId> -SubscriptionId <subscriptionId>
    ```     
       
    Run the following command to view the currently selected tenant and subscription:
    
    ```powershell
        Get-AzureRMContext
    ```

  4. Run the following script

    ```powershell
        .\ConfigARMAutoGrowShrinkCert.ps1 -DisplayName “YourHpcPackAppName” -HomePage "https://YourHpcPackAppHomePage" -IdentifierUri "https://YourHpcPackAppUri" -CertificateThumbprint "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" -TenantId xxxxxxxx-xxxxx-xxxxx-xxxxx-xxxxxxxxxxxx
    ```

    where

    **DisplayName** - Azure Active Application display name. If the application does not exist, it is created in Azure Active Directory.

    **HomePage** - The home page of the application. You can configure a dummy URL, as in the preceding example.

    **IdentifierUri** - Identifier of the application. You can configure a dummy URL, as in the preceding example.

    **CertificateThumbprint** - Thumbprint of the certificate you installed on the head node in Step 1.

    **TenantId** - Tenant ID of your Azure Active Directory. You can get the Tenant ID from the Azure Active Directory portal **Properties** page.

    For more details about **ConfigARMAutoGrowShrinkCert.ps1**, run `Get-Help .\ConfigARMAutoGrowShrinkCert.ps1 -Detailed`.


* **For a cluster with a head node in Azure (classic deployment model)** - If you use the HPC Pack IaaS deployment script to create the cluster in the classic deployment model, enable the **AutoGrowShrink** cluster property by setting the AutoGrowShrink option in the cluster configuration file. For details, see the documentation accompanying the [script download](https://www.microsoft.com/download/details.aspx?id=44949).

    Alternatively, enable the **AutoGrowShrink** cluster property after you deploy the cluster by using HPC PowerShell commands described in the following section. To prepare for this, first complete the following steps:

  1. Configure an Azure management certificate on the head node and in the Azure subscription. For a test deployment, you can use the Default Microsoft HPC Azure self-signed certificate that HPC Pack installs on the head node, and then upload that certificate to your Azure subscription. For options and steps, see the [TechNet Library guidance](https://technet.microsoft.com/library/gg481759.aspx).

  2. Run **regedit** on the head node, go to HKLM\SOFTWARE\Micorsoft\HPC\IaasInfo, and add a string value. Set the Value name to “ThumbPrint”, and Value data to the thumbprint of the certificate in Step 1.

### HPC PowerShell commands to set the AutoGrowShrink property
Following are sample HPC PowerShell commands to set **AutoGrowShrink** and to tune its behavior with additional parameters. See [AutoGrowShrink parameters](#AutoGrowShrink-parameters) later in this article for the complete list of settings.

To run these commands, start HPC PowerShell on the cluster head node as an administrator.

**To enable the AutoGrowShrink property**

```powershell
Set-HpcClusterProperty –EnableGrowShrink 1
```

**To disable the AutoGrowShrink property**

```powershell
Set-HpcClusterProperty –EnableGrowShrink 0
```

**To change the grow interval in minutes**

```powershell
Set-HpcClusterProperty –GrowInterval <interval>
```

**To change the shrink interval in minutes**

```powershell
Set-HpcClusterProperty –ShrinkInterval <interval>
```

**To view the current configuration of AutoGrowShrink**

```powershell
Get-HpcClusterProperty –AutoGrowShrink
```

**To exclude node groups from AutoGrowShrink**

```powershell
Set-HpcClusterProperty –ExcludeNodeGroups <group1,group2,group3>
```

>[!NOTE] 
> This parameter is supported starting in HPC Pack 2016
>

### AutoGrowShrink parameters
The following are AutoGrowShrink parameters that you can modify by using the **Set-HpcClusterProperty** command.

* **EnableGrowShrink** - Switch to enable or disable the **AutoGrowShrink** property.
* **ParamSweepTasksPerCore** - Number of parametric sweep tasks to grow one core. The default is to grow one core per task.

  > [!NOTE]
  > HPC Pack QFE KB3134307 changes **ParamSweepTasksPerCore** to **TasksPerResourceUnit**. It is based on the job resource type and can be node, socket, or core.
  >
  >
* **GrowThreshold** - Threshold of queued tasks to trigger automatic growth. The default is 1, which means that if there are 1 or more tasks in the queued state, automatically grow nodes.
* **GrowInterval** - Interval in minutes to trigger automatic growth. The default interval is 5 minutes.
* **ShrinkInterval** - Interval in minutes to trigger automatic shrinking. The default interval is 5 minutes.|
* **ShrinkIdleTimes** - Number of continuous checks to shrink to indicate the nodes are idle. The default is 3 times. For example, if the **ShrinkInterval** is 5 minutes, HPC Pack checks whether the node is idle every 5 minutes. If the nodes are in the idle state after 3 continuous checks (15 minutes), then HPC Pack shrinks that node.
* **ExtraNodesGrowRatio** - Additional percentage of nodes to grow for Message Passing Interface (MPI) jobs. The default value is 1, which means that HPC Pack grows nodes 1% for MPI jobs.
* **GrowByMin** - Switch to indicate whether the autogrow policy is based on the minimum resources required for the job. The default is false, which means that HPC Pack grows nodes for jobs based on the maximum resources required for the jobs.
* **SoaJobGrowThreshold** - Threshold of incoming SOA requests to trigger the automatic grow process. The default value is 50000.

  > [!NOTE]
  > This parameter is supported starting in HPC Pack 2012 R2 Update 3.
  >
  >
* **SoaRequestsPerCore** -Number of incoming SOA requests to grow one core. The default value is 20000.

  > [!NOTE]
  > This parameter is supported starting in HPC Pack 2012 R2 Update 3.
  >
* **ExcludeNodeGroups** – Nodes in the specified node groups do not automatically grow and shrink.
  
  > [!NOTE]
  > This parameter is supported starting in HPC Pack 2016.
  >

### MPI example
By default HPC Pack grows 1% extra nodes for MPI jobs (**ExtraNodesGrowRatio** is set to 1). The reason is that MPI may require multiple nodes, and the job can only run when all nodes are ready. When Azure starts nodes, occasionally one node might need more time to start than others, causing other nodes to be idle while waiting for that node to get ready. By growing extra nodes, HPC Pack reduces this resource waiting time, and potentially saves costs. To increase the percentage of extra nodes for MPI jobs (for example, to 10%), run a command similar to

    Set-HpcClusterProperty -ExtraNodesGrowRatio 10

### SOA example
By default, **SoaJobGrowThreshold** is set to 50000 and **SoaRequestsPerCore** is set to 200000. If you submit one SOA job with 70000 requests, there is one queued task and incoming requests are 70000. In this case HPC Pack grows 1 core for the queued task, and for incoming requests, grows (70000 - 50000)/20000 = 1 core, so in total grows 2 cores for this SOA job.

## Run the AzureAutoGrowShrink.ps1 script
### Prerequisites

* **HPC Pack 2012 R2 Update 1 or later cluster** - The **AzureAutoGrowShrink.ps1** script is installed in the %CCP_HOME%bin folder. The cluster head node can be deployed either on-premises or in an Azure VM. See [Set up a hybrid cluster with HPC Pack](../../../cloud-services/cloud-services-setup-hybrid-hpcpack-cluster.md) to get started with an on-premises head node and Azure "burst" nodes. See the [HPC Pack IaaS deployment script](hpcpack-cluster-powershell-script.md) to quickly deploy an HPC Pack cluster in Azure VMs, or use an [Azure quickstart template](https://azure.microsoft.com/documentation/templates/create-hpc-cluster/).
* **Azure PowerShell 1.4.0** - The script currently depends on this specific version of Azure PowerShell.
* **For a cluster with Azure burst nodes** - Run the script on a client computer where HPC Pack is installed, or on the head node. If running on a client computer, ensure that you set the variable $env:CCP_SCHEDULER to point to the head node. The Azure “burst” nodes must be added to the cluster, but they may be in the Not-Deployed state.
* **For a cluster deployed in Azure VMs (Resource Manager deployment model)** - For a cluster of Azure VMs deployed in the Resource Manager deployment model, the script supports two methods for Azure authentication: sign in to your Azure account to run the script every time (by running `Login-AzureRmAccount`, or configure a service principal to authenticate with a certificate. HPC Pack provides the script **ConfigARMAutoGrowShrinkCert.ps** to create a service principal with certificate. The script creates an Azure Active Directory (Azure AD) application and a service principal, and assigns the Contributor role to the service principal. To run the script, start Azure PowerShell  as administrator and run the following commands:

    ```powershell
    cd $env:CCP_HOME\bin

    Login-AzureRmAccount

    .\ConfigARMAutoGrowShrinkCert.ps1 -DisplayName “YourHpcPackAppName” -HomePage "https://YourHpcPackAppHomePage" -IdentifierUri "https://YourHpcPackAppUri" -PfxFile "d:\yourcertificate.pfx"
    ```

    For more details about **ConfigARMAutoGrowShrinkCert.ps1**, run `Get-Help .\ConfigARMAutoGrowShrinkCert.ps1 -Detailed`,

* **For a cluster deployed in Azure VMs (classic deployment model)** - Run the script on the head node VM, because it depends on the **Start-HpcIaaSNode.ps1** and **Stop-HpcIaaSNode.ps1** scripts that are installed there. Those scripts additionally require an Azure management certificate or publish settings file (see [Manage compute nodes in an HPC Pack cluster in Azure](hpcpack-cluster-node-manage.md)). Make sure all the compute node VMs you need are already added to the cluster. They may be in the Stopped state.



### Syntax
```powershell
AzureAutoGrowShrink.ps1 [-NodeTemplates <String[]>] [-JobTemplates <String[]>] [-NodeType <String>]
    -NumOfActiveQueuedTasksPerNodeToGrow <Single> [-NumOfActiveQueuedTasksToGrowThreshold <Int32>]
    [-NumOfInitialNodesToGrow <Int32>] [-GrowCheckIntervalMins <Int32>] [-ShrinkCheckIntervalMins <Int32>]
    [-ShrinkCheckIdleTimes <Int32>] [-ExtraNodesGrowRatio <Int32>] [-ArgFile <String>] [-LogFilePrefix <String>]
    [<CommonParameters>]

AzureAutoGrowShrink.ps1 [-NodeTemplates <String[]>] [-JobTemplates <String[]>] [-NodeType <String>]
    -NumOfQueuedJobsPerNodeToGrow <Single> [-NumOfQueuedJobsToGrowThreshold <Int32>] [-NumOfInitialNodesToGrow
    <Int32>] [-GrowCheckIntervalMins <Int32>] [-ShrinkCheckIntervalMins <Int32>] [-ShrinkCheckIdleTimes <Int32>]
    [-ExtraNodesGrowRatio <Int32>] [-ArgFile <String>] [-LogFilePrefix <String>] [<CommonParameters>]

AzureAutoGrowShrink.ps1 -UseLastConfigurations [-ArgFile <String>] [-LogFilePrefix <String>] [<CommonParameters>]
```
### Parameters
* **NodeTemplates** - Names of the node templates to define the scope for the nodes to grow and shrink. If not specified (the default value is @()), all nodes in the **AzureNodes** node group are in scope when **NodeType** has a value of AzureNodes, and all nodes in the **ComputeNodes** node group are in scope when **NodeType** has a value of ComputeNodes.
* **JobTemplates** - Names of the job templates to define the scope for the nodes to grow.
* **NodeType** - The type of node to grow and shrink. Supported values are:

  * **AzureNodes** – for Azure PaaS (burst) nodes in an on-premises or Azure IaaS cluster.
  * **ComputeNodes** - for compute node VMs only in an Azure IaaS cluster.

* **NumOfQueuedJobsPerNodeToGrow** - Number of queued jobs required to grow one node.
* **NumOfQueuedJobsToGrowThreshold** - The threshold number of queued jobs to start the grow process.
* **NumOfActiveQueuedTasksPerNodeToGrow** - The number of active queued tasks required to grow one node. If **NumOfQueuedJobsPerNodeToGrow** is specified with a value greater than 0, this parameter is ignored.
* **NumOfActiveQueuedTasksToGrowThreshold** - The threshold number of active queued tasks to start the grow process.
* **NumOfInitialNodesToGrow** - The initial minimum number of nodes to grow if all the nodes in scope are **Not-Deployed** or **Stopped (Deallocated)**.
* **GrowCheckIntervalMins** - The interval in minutes between checks to grow.
* **ShrinkCheckIntervalMins** - The interval in minutes between checks to shrink.
* **ShrinkCheckIdleTimes** - The number of continuous shrink checks (separated by **ShrinkCheckIntervalMins**) to indicate the nodes are idle.
* **UseLastConfigurations** - The previous configurations saved in the argument file.
* **ArgFile**- The name of the argument file used to save and update the configurations to run the script.
* **LogFilePrefix** - The prefix name of the log file. You can specify a path. By default the log is written to the current working directory.

### Example 1
The following example configures the Azure burst nodes deployed with the
Default AzureNode Template to grow and shrink automatically. If all the
nodes are initially in the **Not-Deployed** state, at least 3 nodes are
started. If the number of queued jobs exceeds 8, the script starts nodes
until their number exceeds the ratio of queued jobs to
**NumOfQueuedJobsPerNodeToGrow**. If a node is found to be idle in 3
consecutive idle times, it is stopped.

```powershell
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

```powershell
.\AzureAutoGrowShrink.ps1 -NodeTemplates 'Default ComputeNode Template' -JobTemplates 'Default' -NodeType ComputeNodes -NumOfActiveQueuedTasksPerNodeToGrow 10 -NumOfActiveQueuedTasksToGrowThreshold 15 -NumOfInitialNodesToGrow 5 -GrowCheckIntervalMins 1 -ShrinkCheckIntervalMins 1 -ShrinkCheckIdleTimes 10 -ArgFile 'IaaSVMComputeNodes_Arg.xml' -LogFilePrefix 'IaaSVMComputeNodes_log'
```
