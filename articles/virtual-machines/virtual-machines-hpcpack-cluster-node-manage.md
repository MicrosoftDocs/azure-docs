<properties
 pageTitle="Manage HPC Pack cluster compute nodes | Microsoft Azure"
 description="Learn about PowerShell script tools to add, remove, start, and stop HPC Pack cluster compute nodes in Azure"
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

# Manage the number and availability of compute nodes in an HPC Pack cluster in Azure

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)] This article applies to managing a resource created with the classic deployment model.

If you created an HPC Pack cluster in Azure VMs, you might want ways to easily add, remove,
start (provision), or stop (deprovision) a number of compute node VMs in the
cluster. To do these tasks, run Azure PowerShell scripts that are
installed on the head node VM (starting with HPC Pack 2012 R2 Update 1). These scripts help you control the number
and availability of your HPC Pack cluster resources so you can control costs.

>[AZURE.NOTE] The scripts are in the %CCP\_HOME%bin folder on the head node. You must
run each of the scripts as an administrator.

## Prerequisites

* **HPC Pack cluster in Azure VMs** - Create an HPC Pack cluster in the classic (Service Management) deployment model by using at least HPC Pack 2012 R2 Update 1. For example, you can automate the deployment by using the HPC Pack VM image in the Azure Marketplace and an Azure PowerShell script. For information and prerequisites, see [Create an HPC Cluster with the HPC Pack IaaS deployment script](virtual-machines-hpcpack-cluster-powershell-script.md).

* **Azure management certificate or publish settings file** - You need to do one of the following on the head node:

    * **Import the Azure publish settings file**. To do this, run the following Azure PowerShell cmdlets on the head node:
        ```
        Get-AzurePublishSettingsFile  
Import-AzurePublishSettingsFile –PublishSettingsFile <publish settings file>
        ```
    * **Configure the Azure management certificate on the head node**. If you have the .cer file, import it in the CurrentUser\My certificate store and then run the following Azure PowerShell cmdlet for your Azure environment (either AzureCloud or AzureChinaCloud):

    ```
    Set-AzureSubscription -SubscriptionName <Sub Name> -SubscriptionId <Sub ID> -Certificate (Get-Item Cert:\CurrentUser\My\<Cert Thrumbprint>) -Environment <AzureCloud | AzureChinaCloud>
    ```




## Add compute node VMs

Add compute nodes with the **Add-HpcIaaSNode.ps1** script.

### Syntax
```
Add-HPCIaaSNode.ps1 [-ServiceName] <String> [-ImageName] <String>
 [-Quantity] <Int32> [-InstanceSize] <String> [-DomainUserName] <String> [[-DomainUserPassword] <String>]
 [[-NodeNameSeries] <String>] [<CommonParameters>]

```
### Parameters

* **ServiceName** - Name of the cloud service that new compute node VMs will be added to.

* **ImageName** -Azure VM image name, which can be obtained through the AzurePortal or Azure PowerShell cmdlet **Get-AzureVMImage**. The image must meet the following requirements:

    1. A Windows operating system must be installed.

    2. HPC Pack must be installed in the compute node role.

    3. The image must be a private image in the User category, not a public Azure VM image.

* **Quantity**- Number of compute node VMs to be added.

* **InstanceSize** - Size of the compute node VMs.

* **DomainUserName** - Domain user name, which will be used to join the new VMs to the domain.

* **DomainUserPassword*** Password of the domain user

* **NodeNameSeries** (optional) 0 Naming pattern for the compute nodes. format must be &lt;*Root\_Name*&gt;&lt;*Start\_Number*&gt;%. For example, MyCN%10% means a series of the compute node names starting from MyCN11. If not specified, the script uses the configured node naming series in the HPC cluster.

### Example

The following example adds 20 size Large compute node VMs in the cloud
service hpcservice1, based on the VM image hpccnimage1.

```
Add-HPCIaaSNode.ps1 –ServiceName hpcservice1 –ImageName hpccniamge1
–Quantity 20 –InstanceSize Large –DomainUserName <username>
-DomainUserPassword <password>
```


## Remove compute node VMs

Remove compute nodes with the **Remove-HpcIaaSNode.ps1** script.

### Syntax

```
Remove-HPCIaaSNode.ps1 -Name <String[]> [-DeleteVHD] [-Force] [-WhatIf] [-Confirm] [<CommonParameters>]

Remove-HPCIaaSNode.ps1 -Node <Object> [-DeleteVHD] [-Force] [-Confirm] [<CommonParameters>]
```

### Parameters

 * **Name** - Names of cluster nodes to be removed. Wildcards are supported. The parameter set name is Name. You can't specify both the **Name** and **Node** parameters.

* **Node** * The HpcNode object for the nodes to be removed, which can be obtained through the HPC PowerShell cmdlet [Get-HpcNode](https://technet.microsoft.com/library/dn887927.aspx). The parameter set name is Node. You can't specify both the **Name** and **Node** parameters.

* **DeleteVHD** (optional) - Setting to delete the associated disks for the VMs that are removed.

* **Force** (optional) - Setting to force HPC nodes offline before removing them.

* **Confirm** (optional) - Prompt for confirmation before executing the command.

* **WhatIf** - Setting to describe what would happen if you executed the command without actually executing the command.

### Example

The following example forces offline nodes with names beginning
*HPCNode-CN-* and them removes the nodes and their associated disks.

```
Remove-HPCIaaSNode.ps1 –Name HPCNodeCN-* –DeleteVHD -Force
```

## Start compute node VMs

Start compute nodes with the **Start-HpcIaaSNode.ps1** script.

### Syntax

```
Start-HPCIaaSNode.ps1 -Name <String[]> [<CommonParameters>]

Start-HPCIaaSNode.ps1 -Node <Object> [<CommonParameters>]
```
### Parameters

* **Name** - Names of the cluster nodes to be started. Wildcards are supported. The parameter set name is Name. You cannot specify both the **Name** and **Node** parameters.

* **Node**- The HpcNode object for the nodes to be started, which can be obtained through the HPC PowerShell cmdlet [Get-HpcNode](https://technet.microsoft.com/library/dn887927.aspx). The parameter set name is Node. You cannot specify both the **Name** and **Node** parameters.

### Example

The following example starts nodes with names beginning *HPCNode-CN-*.

```
Start-HPCIaaSNode.ps1 –Name HPCNodeCN-*
```

## Stop compute node VMs

Stop compute nodes with the **Stop-HpcIaaSNode.ps1** script

### Syntax

```
Stop-HPCIaaSNode.ps1 -Name <String[]> [-Force] [<CommonParameters>]

Stop-HPCIaaSNode.ps1 -Node <Object> [-Force] [<CommonParameters>]
```

### Parameters


* **Name**- Names of the cluster nodes to be stopped. Wildcards are supported. The parameter set name is Name. You cannot specify both the **Name** and **Node** parameters.

* **Node** - The HpcNode object for the nodes to be stopped, which can be obtained through the HPC PowerShell cmdlet Get-HpcNode. The parameter set name is Node. You cannot specify both the **Name** and **Node** parameters.

* **Force** (optional) - Setting to force HPC nodes offline before stopping them.

### Example

The following example forces offline nodes with names beginning
*HPCNode-CN-* and then stops the nodes.

Stop-HPCIaaSNode.ps1 –Name HPCNodeCN-* -Force

## Next steps

* If you want a way to
automatically grow or shrink the Azure computing resources according to
the current workload of jobs and tasks on the cluster, see [Grow and shrink Azure compute resources in an HPC Pack cluste](virtual-machines-hpcpack-cluster-node-autogrowshrink.md).
