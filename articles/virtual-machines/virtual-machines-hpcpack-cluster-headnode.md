<properties
 pageTitle="Create an HPC Pack head node in an Azure VM | Microsoft Azure"
 description="Learn how to use the Azure portal and the classic deployment model to create a Microsoft HPC Pack head node in an Azure VM."
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

# Create the head node of an HPC Pack cluster in an Azure VM with a Marketplace image

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-include.md)] This article applies to creating a resource with the classic deployment model.

This article shows you how to use the [Microsoft HPC Pack virtual machine image](https://azure.microsoft.com/marketplace/partners/microsoft/hpcpack2012r2onwindowsserver2012r2/) in the Azure Marketplace
to create the head node of a Windows HPC cluster in Azure in the classic (Service Management) deployment model. The head node needs to be joined to an Active Directory domain in an Azure virtual network. You can use this head node for a proof of concept deployment of HPC Pack in Azure and add compute resources to the cluster to run HPC workloads.


![HPC Pack head node][headnode]

>[AZURE.NOTE] Currently the HPC Pack
VM image is based on Windows Server 2012 R2 Datacenter with HPC
Pack 2012 R2 Update 2 pre-installed. Microsoft SQL Server 2014 Express
is also pre-installed.


For a production deployment of an HPC Pack cluster in Azure, we recommend an automated deployment method, such as the [HPC Pack IaaS deployment
script](virtual-machines-hpcpack-cluster-powershell-script.md) or an Azure Resource Manager [quickstart template](https://azure.microsoft.com/documentation/templates/).

## Planning considerations

* **Active Directory domain** - The HPC Pack head node must be joined to an Active Directory domain in Azure before you start the HPC services. One option is deploy a separate domain controller and forest deployed in Azure to which you can join the VM. For a proof of concept deployment, you can promote the VM you create for the head node as a domain controller before starting the HPC services.

* **Azure virtual network** - If you plan to add cluster compute node VMs to the HPC cluster, or you create a separate domain controller for the cluster, you'll need to deploy the head node in an Azure virtual network (VNet). Without a VNet you can still add Azure "burst" nodes to the cluster.

## Steps to create the head node

The following are high level steps to create an Azure VM for the HPC
Pack head node. You can use a variety of Azure tools to do these steps in the Azure classic (Service Management) deployment model.


1. If you plan to create a VNet for the head node VM, see [Create a virtual nework (classic) by using the Azure preview portal](../virtual-networks/virtual-networks-create-vnet-classic-pportal.md).

    **Considerations**

    * You can accept the default configuration of the virtual network address space and subnets.

    * If you plan to use a compute-intensive instance size (A8 – A11) for the HPC Pack head node or when later adding compute resources to the cluster, choose a region in which the instances are available. When using A8 or A9 instances for MPI workloads, also ensure that the address space of the virtual network doesn't overlap the address space reserved by the RDMA network in Azure (172.16.0.0/12). For more information, see [About the A8, A9, A10, and A11 compute-intensive instances](virtual-machines-a8-a9-a10-a11-specs.md).

2. If you need to create a new Active Directory forest on a separate VM, see [Install a new Active Directory forest on an Azure virtual network](../active-directory/active-directory-new-forest-virtual-machine.md).

    **Considerations**

    * For many test deployments you can create a single domain controller in Azure. To ensure high availability of the Active Directory domain, you can deploy an additional, backup domain controller.

    * For a simple proof of concept deployment, you can omit this step and later promote the head node VM as a domain controller.

3. In the Azure Management Portal or Azure Preview Portal, create a classic VM by selecting the HPC Pack 2012 R2 image from the Azure Marketplace. (See steps for the Management Portal [here](virtual-machines-windows-tutorial-classic-portal.md).)

    **Considerations**

    * Select a VM size of at least A4.

    * If you want to deploy the head node in a VNet, be sure to specify the VNet in the VM configuration.

    * We recommend that you create a new cloud service for the VM.

4. After you create the VM and the VM is running, join the VM to an existing domain forest, or create a new domain forest on the VM.

    **Considerations**

    * If you created the VM in an Azure VNet with an existing domain forest, connect to the VM. Then use standard Server Manager or Windows PowerShell tools to join it to the domain forest. Then restart.

    * If the VM wasn’t created in an Azure VNet, or it was created in a VNet without an existing domain forest, then promote it as a domain controller. To do this, connect to the VM, and then use standard Server Manager or Windows PowerShell tools. For detailed steps, see [Install a New Windows Server 2012 Active Directory Forest](https://technet.microsoft.com/library/jj574166.aspx).

5. After the VM is running and is joined to an Active Directory forest, start the HPC Pack services on the head node. To do this:

    a. Connect to the VM using a domain account that is a member of the local Administrators group. For example, you could use the administrator account you set up when you created the head node VM.

    b. For a default head node configuration, start Windows PowerShell as an administrator and type the following:

    ```
    & $env:CCP_HOME\bin\HPCHNPrepare.ps1 –DBServerInstance ".\ComputeCluster"
    ```

    It can take several minutes for the HPC Pack services to start.

    For additional head node configuration options, type `get-help HPCHNPrepare.ps1`.


## Next steps

* You can now work with the head node of your Windows HPC cluster. For
example, you can start HPC Cluster Manager, or start working with the
HPC PowerShell cmdlets.

* [Add compute node VMs](virtual-machines-hpcpack-cluster-node-manage.md) to your cluster, or add [Azure burst nodes](virtual-machines-hpcpack-cluster-node-burst.md) in a cloud service.

* Try running a test workload on the cluster. For an example, see the HPC Pack [getting started guide](https://technet.microsoft.com/library/jj884144).

<!--Image references-->
[headnode]: ./media/virtual-machines-hpcpack-cluster-headnode/headnode.png
