<properties
 pageTitle="Create an HPC Pack head node in an Azure VM | Microsoft Azure"
 description="Learn how to use the Azure portal and the Resource Manager deployment model to create a Microsoft HPC Pack head node in an Azure VM."
 services="virtual-machines-windows"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""
 tags="azure-resource-manager,hpc-pack"/>
<tags
ms.service="virtual-machines-windows"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-windows"
 ms.workload="big-compute"
 ms.date="05/19/2016"
 ms.author="danlep"/>

# Create the head node of an HPC Pack cluster in an Azure VM with a Marketplace image


Use a [Microsoft HPC Pack virtual machine image](https://azure.microsoft.com/marketplace/partners/microsoft/hpcpack2012r2onwindowsserver2012r2/) from the Azure Marketplace
to create the head node of an HPC cluster by using the Azure portal. This HPC Pack
VM image is based on Windows Server 2012 R2 Datacenter with HPC
Pack 2012 R2 Update 3 pre-installed. Use this head node for a proof of concept deployment of HPC Pack in Azure. You can then add compute nodes to the cluster to run HPC workloads.



>[AZURE.TIP]For a deployment of a complete HPC Pack cluster in Azure that includes the head node and compute nodes, we recommend that you use an automated method, such as the [HPC Pack IaaS deployment script](virtual-machines-windows-classic-hpcpack-cluster-powershell-script.md) or a Resource Manager template such as the [HPC Pack cluster for Windows workloads](https://azure.microsoft.com/marketplace/partners/microsofthpc/newclusterwindowscn/) template. See [HPC Pack cluster options in Azure](virtual-machines-windows-hpcpack-cluster-options.md) for additional templates. 


## Planning considerations

As shown in the following figure, you'll deploy the head node in an Active Directory domain in an Azure virtual network.

![HPC Pack head node][headnode]

* **Active Directory domain** - The HPC Pack head node must be joined to an Active Directory domain in Azure before you start the HPC services on the VM. As shown in this article, for a proof of concept deployment, you can promote the VM you create for the head node as a domain controller before starting the HPC services. Another option is deploy a separate domain controller and forest in Azure to which you join the head node VM.

* **Azure virtual network** - As shown in this article, when you deploy the HPC Pack head node by using the Resource Manager deployment model in the Azure portal, you specify or create an Azure virtual network. You'll need to use the virtual network later to add cluster compute node VMs to the HPC cluster, or if you join the head node to an existing Active Directory domain.

    
## Steps to create the head node

These are high level steps to create an Azure VM for the HPC
Pack head node by using the Resource Manager deployment model in the Azure portal. 


1. If you want to create a new Active Directory forest in Azure with separate domain controller VMs, one option is to use a [Resource Manager template](https://azure.microsoft.com/documentation/templates/active-directory-new-domain-ha-2-dc/). For a simple proof of concept deployment of HPC Pack, it's fine to omit this. Instead, you'll configure the head node VM itself as a domain controller as described later in this article.
    
2. To create the HPC Pack head node in the [Azure portal](https://portal.azure.com), select the HPC Pack 2012 R2 image from the Azure Marketplace. To do this, click **New** and search the Marketplace for **HPC Pack**. Select the **HPC Pack 2012 R2 on Windows Server 2012 R2** image.

3. On the **HPC Pack 2012 R2 on Windows Server 2012 R2** page, select the **Resource Manager** deployment model and then click **Create**.

    ![HPC Pack image][marketplace]

4. Use the portal to configure the settings and create the VM. If you're new to Azure, follow the tutorial [Create a Windows virtual machine in the Azure portal](virtual-machines-windows-hero-tutorial.md). For a proof of concept deployment you can usually accept many default or recommended settings.

    **Virtual network considerations**

   * If you want to join the head node to an existing Active Directory domain in Azure, make sure you specify the virtual network for that domain when creating the head node VM.
   
   * If you want to create a new virtual network, in **Settings**, specify a private network address range such as 10.0.0.0/16 and a subnet address range such as 10.0.0.0/24.
    
4. After you create the VM and the VM is running, [connect to the VM](virtual-machines-windows-connect-logon.md) by Remote Desktop. 

5. Join the VM to an existing domain forest, or create a new domain forest on the VM itself.

    * If you created the VM in an Azure virtual network with an existing domain forest, use standard Server Manager or Windows PowerShell tools to join it to the domain forest. Then restart.

    * If you created the VM in a new virtual network without an existing domain forest, then promote the VM as a domain controller. To do this, use standard Server Manager or Windows PowerShell tools to install and configure the Active Directory Domain Services role. For detailed steps, see [Install a New Windows Server 2012 Active Directory Forest](https://technet.microsoft.com/library/jj574166.aspx).

5. After the VM is running and is joined to an Active Directory forest, start the HPC Pack services on the head node. To do this:

    a. Connect to the VM using a domain account that is a member of the local Administrators group. For example, use the administrator account you set up when you created the head node VM.

    b. For a default head node configuration, start Windows PowerShell as an administrator and type the following:

    ```
    & $env:CCP_HOME\bin\HPCHNPrepare.ps1 –DBServerInstance ".\ComputeCluster"
    ```

    It can take several minutes for the HPC Pack services to start.

    For additional head node configuration options, type `get-help HPCHNPrepare.ps1`.


## Next steps

* You can now work with the head node of your HPC Pack cluster. For
example, start HPC Cluster Manager, and complete the [Deployment To-do List](https://technet.microsoft.com/library/jj884141.aspx).
* Add [Azure burst nodes](virtual-machines-windows-classic-hpcpack-cluster-node-burst.md) in a cloud service to increase the cluster compute capacity on-demand. 

* Try running a test workload on the cluster. For an example, see the HPC Pack [getting started guide](https://technet.microsoft.com/library/jj884144).

<!--Image references-->
[headnode]: ./media/virtual-machines-windows-hpcpack-cluster-headnode/headnode.png
[marketplace]: ./media/virtual-machines-windows-hpcpack-cluster-headnode/marketplace.png
