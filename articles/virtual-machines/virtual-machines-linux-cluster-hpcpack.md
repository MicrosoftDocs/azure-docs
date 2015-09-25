<properties
 pageTitle="Use Linux compute VMs in an HPC Pack cluster | Microsoft Azure"
 description="Learn how to script the deployment of an HPC Pack cluster in Azure containing a head node running Windows Server with Linux compute nodes."
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
 ms.date="09/01/2015"
 ms.author="danlep"/>

# Get started with Linux compute nodes in an HPC Pack cluster in Azure

This article shows you how to use an Azure PowerShell script to set up a Microsoft HPC Pack cluster in Azure which contains a head node running Windows Server and several compute nodes running a CentOS Linux distribution. We also show several ways to move data files to the Linux compute nodes. You can use this cluster to run Linux HPC workloads in Azure.

At a high level the following diagram shows the HPC Pack cluster you'll create.

![HPC cluster with Linux nodes][scenario]

## Deploy an HPC Pack cluster with Linux compute nodes

You'll use the Microsoft HPC Pack IaaS deployment script (**New-HpcIaaSCluster.ps1**) to automate the cluster deployment in Azure infrastructure services (IaaS). This Azure PowerShell script uses an HPC Pack VM image in the Azure Marketplace for fast deployment and provides a comprehensive set of configuration parameters to make the deployment easy and flexible. The script deploys the Azure virtual network, storage accounts, cloud services, domain controller, optional separate SQL Server database server, cluster head node, compute nodes, broker nodes, Azure PaaS (“burst”) nodes, and Linux compute nodes (Linux support introduced in [HPC Pack 2012 R2 Update 2](https://technet.microsoft.com/library/mt269417.aspx)).

For an overview of HPC Pack cluster deployment options, see the [Getting Started Guide for HPC Pack 2012 R2 and HPC Pack 2012](https://technet.microsoft.com/library/jj884144.aspx).

### Prerequisites

* **Client computer** - You'll need a Windows-based client computer to run the cluster deployment script.

* **Azure PowerShell** - [Install and configure Azure PowerShell](../powershell-install-configure.md) (version 0.8.10 or later) on your client computer.

* **HPC Pack IaaS deployment script** - Download and unpack the latest version of the script from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=44949). You can check the version of the script by running `New-HPCIaaSCluster.ps1 –Version`. This article is based on version 4.4.0 or later of the script.

* **Azure subscription** - You can use a subscription in either the Azure Global or Azure China service. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).

* **Cores quota** - You might need to increase the quota of cores, especially if you choose to deploy several cluster nodes with multicore VM sizes. For the example in this article, you will need at least 24 cores. To increase a quota, [open an online customer support request](http://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) at no charge.

### Create the configuration file
The HPC Pack IaaS deployment script uses an XML configuration file as input which describes the infrastructure of the HPC cluster. To deploy a small cluster consisting of a head node and 2 Linux compute nodes, substitute values for your environment into the following sample configuration file. For more information about the configuration file, see the Manual.rtf file in the script folder or the [script documentation](https://msdn.microsoft.com/library/azure/dn864734.aspx).

```
<?xml version="1.0" encoding="utf-8" ?>
<IaaSClusterConfig>
  <Subscription>
    <SubscriptionName>Subscription-1</SubscriptionName>
    <StorageAccount>allvhdsje</StorageAccount>
  </Subscription>
  <Location>Japan East</Location>  
  <VNet>
    <VNetName>centos7rdmavnetje</VNetName>
    <SubnetName>CentOS7RDMACluster</SubnetName>
  </VNet>
  <Domain>
    <DCOption>HeadNodeAsDC</DCOption>
    <DomainFQDN>hpc.local</DomainFQDN>
  </Domain>
  <Database>
    <DBOption>LocalDB</DBOption>
  </Database>
  <HeadNode>
    <VMName>CentOS7RDMA-HN</VMName>
    <ServiceName>centos7rdma-je</ServiceName>
  <VMSize>A4</VMSize>
  <EnableRESTAPI />
  <EnableWebPortal />
  </HeadNode>
  <LinuxComputeNodes>
    <VMNamePattern>CentOS7RDMA-LN%1%</VMNamePattern>
    <ServiceName>centos7rdma-je</ServiceName>
    <VMSize>A7</VMSize>
    <NodeCount>2</NodeCount>
    <ImageName>5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-70-20150325</ImageName>
  </LinuxComputeNodes>
</IaaSClusterConfig>
```

Here are brief descriptions of the elements in the configuration file.

* **IaaSClusterConfig** - Root element of the configuration file.

* **Subscription** - Azure subscription used to deploy the HPC Pack cluster. Use the command below to make sure the Azure subscription name is configured and unique in your client computer. In this sample, we use the Azure subscription “Subscription-1”.

    ```
    PS > Get-AzureSubscription –SubscriptionName <SubscriptionName>
    ```

    >[AZURE.NOTE]Alternatively, you can use the subscription ID to specify the subscription you want to use. See the Manual.rtf file in the script folder.

* **StorageAccount** - All the persistent data for the HPC Pack cluster will be stored to the specified storage account (allvhdsje in this example). If the storage account doesn’t exist, the script will create it in the region specified in **Location**.

* **Location** - Azure region where you'll deploy the HPC Pack cluster (Japan East in this example).

* **VNet** - Settings of the virtual network and subnet where the HPC cluster will be created. You can create the virtual network and subnet yourself before running this script, or the script creates a virtual network with address space 192.168.0.0/20, and subnet with address space 192.168.0.0/23. In this example, the script creates the virtual network centos7rdmavnetje and subnet CentOS7RDMACluster.

* **Domain** - Active Directory domain settings for the HPC Pack cluster. All the Windows VMs created by the script will join the domain. Currently, the script supports three domain options: ExistingDC, NewDC, and HeadNodeAsDC. In this example, we will configure the head node as the domain controller with a fully qualified domain name of hpc.local.

* **Database** - Database settings for the HPC Pack cluster. Currently, the script supports three database options: ExistingDB, NewRemoteDB, and LocalDB. In this example, we will create a local database on the head node.

* **HeadNode** - Settings for the HPC Pack head node. In this example, we will create a size A7 head node named CentOS7RDMA-HN in the cloud service centos7rdma-je. To support HPC job submission from remote (non-domain-joined) client computers, the script will enable the HPC job scheduler REST API and HPC web portal.

* **LinuxComputeNodes** - Settings for the HPC Pack Linux compute nodes. In this xample, we will create two size A7 CentOS 7 Linux compute nodes (CentOS7RDMA-LN1 and CentOS7RDMA-LN2) in the cloud service centos7rdma-je.

### Additional considerations for Linux compute nodes

* Currently HPC Pack supports the following Linux distributions for compute nodes: Ubuntu Server 14.10, CentOS 6.6, CentOS 7.0, and SUSE Linux Enterprise Server 12.

* The example in this article uses a specific CentOS version available in the Azure Marketplace to create the cluster. If you want to use other images available, use the **get-azurevmimage** Azure PowerShell cmdlet  to find the one you need. For example, to list all the CentOS 7.0 images, run the following command:
    ```
    get-azurevmimage | ?{$_.Label -eq "OpenLogic 7.0"}
    ```

    Find the one you need and replace the **ImageName** value in the configuration file.

* Linux images that support RDMA connectivity for size A8 and A9 VMs are available. If you specify an image with Linux RDMA drivers installed and enabled, the HPC Pack IaaS deployment script will deploy them. For example, specify the image name `b4590d9e3ed742e4a1d46e5424aa335e__suse-sles-12-hpc-v20150708` for the current SUSE Linux Enterprise Server 12 – Optimized for High Performance Compute image in the Marketplace.

* To enable Linux RDMA on the Linux VMs created from supported images to run MPI jobs, install and configure a specific MPI library on the Linux nodes after cluster deployment according to your application needs. For more information about how to use RDMA in Linux nodes on Azure, see [Set up a Linux RDMA cluster to run MPI applications](virtual-machines-linux-cluster-rdma.md).

* Make sure you deploy all the Linux RDMA nodes within one service so that the RDMA network connection works between the nodes.


## Run the HPC Pack IaaS deployment script

1. Open the PowerShell console on the client computer as an administrator.

2. Change directory to the script folder (E:\IaaSClusterScript in this example).

    ```
    cd E:\IaaSClusterScript
    ```

3. Run the command below to deploy the HPC Pack cluster. This example assumes that the configuration file is located in E:\HPCDemoConfig.xml.

    ```
    .\New-HpcIaaSCluster.ps1 –ConfigFile E:\HPCDemoConfig.xml –AdminUserName MyAdminName
    ```

    The script generates a log file automatically since  the **-LogFile** parameter isn't specified. The logs aren't written in real time, but collected at the end of the validation and the deployment, so if the PowerShell process is stopped while the script is running, some logs will be lost.

    a. Because the **AdminPassword** is not specified in the above command, you'll be prompted to enter the password for user *MyAdminName*.

    b. The script then starts to validate the configuration file. It takes from tens of seconds to several minutes depending on the network connection.

    ![Validation][validate]

    c. After validations pass, the script lists the resources which will be created for the HPC cluster. Enter *Y* to continue.

    ![Resources][resources]

    d. The script starts to deploy the HPC Pack cluster and completes the configuration without further manual steps. This can take several minutes.

    ![Deploy][deploy]

4. After the configuration finishes successfully, Remote Desktop to the head node and open HPC Cluster Manager to check the status of the HPC Pack cluster. You can manage and monitor Linux compute nodes the same way you work with Windows compute nodes. For example, you'll see the Linux nodes listed in Node Management.

    ![Node Management][management]

    You'll also see the Linux nodes in the Heat Map view.

    ![Heat map][heatmap]

## How to move data in a cluster with Linux nodes

You have several choices to move data among Linux nodes and the Windows head node of the cluster. Here are three common methods.

* **Azure File** - Exposes a file share to store data files in Azure storage. Both Windows nodes and the Linux nodes can mount an Azure File share as a drive or folder at the same time even if they are deployed in different virtual networks.

* **Head node SMB share** - Mounts a shared folder of the head node on Linux nodes.

* **Head node NFS server**  - Provides a file-sharing solution for a mixed Windows and Linux environment.

### Azure File

The [Azure File](https://azure.microsoft.com/services/storage/files/) service exposes file shares using the standard SMB 2.1 protocol. Azure VMs and cloud services can share file data across application components via mounted shares, and on-premises applications can access file data in a share through the File storage API. For more information, see [How to use Azure File storage with PowerShell and .NET](../storage/storage-dotnet-how-to-use-files.md).

To create an Azure File share, see the detailed steps in [Introducing Microsoft Azure File Service](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/12/introducing-microsoft-azure-file-service.aspx). To set up persisting connections, see [Persisting connections to Microsoft Azure Files](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/27/persisting-connections-to-microsoft-azure-files.aspx).

In this example, we create an Azure File share named rdma on our storage account allvhdsje. To mount the share on the head node, we open a Command window and enter the following commands:

```
> cmdkey /add:allvhdsje.file.core.windows.net /user:allvhdsje /pass:<storageaccountkey>
> net use Z: \\allvhdje.file.core.windows.net\rdma /persistent:yes
```

In this example, allvhdsje is the storage account name, storageaccountkey is the storage account key, and rdma is the Azure File share name. The Azure File share will be mounted onto Z: on your head node.

To mount the Azure File share on Linux nodes, run a **clusrun** command on the head node. **[Clusrun](https://technet.microsoft.com/library/cc947685.aspx)** is a useful HPC Pack tool to carry out administrative tasks on multiple nodes. (See also [CLusrun for Linux nodes](#CLusrun-for-Linux-nodes) in this article.)

Open a Windows PowerShell window and enter the following commands.

```
PS > clusrun /nodegroup:LinuxNodes mkdir -p /rdma

PS > clusrun /nodegroup:LinuxNodes mount -t cifs //allvhdsje.file.core.windows.net/rdma /rdma -o vers=2.1`,username=allvhdsje`,password=<storageaccountkey>'`,dir_mode=0777`,file_mode=0777
```

The first command creates a folder named /rdma on all nodes in the LinuxNodes group. The second command mounts the Azure File share allvhdsjw.file.core.windows.net/rdma onto the /rdma folder with dir and file mode bits set to 777. In the second command, allvhdsje is your storage account name  and storageaccountkey is your storage account key.

>[AZURE.NOTE]The “\`” symbol in the second command is an escape symbol for PowerShell. “\`,” means the “,” (comma character) is a part of the command.

### Head node share

Alternatively, you can mount a shared folder of the head node on Linux nodes. This is the simplest way to share files, but the head node and all Linux nodes have to be deployed in the same virtual network. Here are the steps.

1. Create a folder on the head node and share it to Everyone with Read/Write permissions. For example, we share D:\OpenFOAM on the head node as \\CentOS7RDMA-HN\OpenFOAM. Here CentOS7RDMA-HN is the hostname of our head node.

    ![File share permissions][fileshareperms]

    ![File sharing][filesharing]

2. Open a Windows PowerShell window and run the following commands to mount the shared folder.

```
PS > clusrun /nodegroup:LinuxNodes mkdir -p /openfoam

PS > clusrun /nodegroup:LinuxNodes mount -t cifs //CentOS7RDMA-HN/OpenFOAM /openfoam -o vers=2.1`,username=<username>`,password='<password>'`,dir_mode=0777`,file_mode=0777
```

The first command creates a folder named /openfoam on all nodes in LinuxNodes group. The second command mounts the shared folder //CentOS7RDMA-HN/OpenFOAM onto the folder with dir and file mode bits set to 777. The username and password in the command should be the username and password of a cluster user on the head node.

>[AZURE.NOTE]The “\`” symbol in the second command is an escape symbol for PowerShell. “\`,” means the “,” (comma character) is a part of the command.


### NFS server

The NFS service enables users to share and migrate files between computers running the Windows Server 2012 operating system using the SMB protocol and Linux-based computers using the NFS protocol. The NFS server and all other nodes have to be deployed in same virtual network. It provides better compatibility with Linux nodes compared with an SMB share; for example, it supports file link.

1. To install and set up an NFS server, follow the steps in [Server for Network File System First Share End-to-End](http://blogs.technet.com/b/filecab/archive/2012/10/08/server-for-network-file-system-first-share-end-to-end.aspx).

    For example, create an NFS share named nfs with the following properties.

    ![NFS authorization][nfsauth]

    ![NFS share permissions][nfsshare]

    ![NFS NTFS permissions][nfsperm]

    ![NFS management properties][nfsmanage]

2. Open a Windows PowerShell window and run the following command to mount the NFS share.

    ```
PS > clusrun /nodegroup:LinuxNodes mkdir -p /nfsshare
PS > clusrun /nodegroup:LinuxNodes mount CentOS7RDMA-HN:/nfs /nfsshared
```

    The first command creates a folder named /nfsshared on all nodes in the LinuxNodes group. The second command mounts the NFS share CentOS7RDMA-HN:/nfs onto the folder. Here CentOS7RDMA-HN:/nfs is the remote path of your NFS share.

## How to submit jobs
There are several ways to submit jobs to the HPC Pack cluster

* HPC Cluster Manager or HPC Job Manager GUI

* HPC web portal

* REST API

Job submission to the cluster in Azure via HPC Pack GUI tools and the HPC web portal are the same as for Windows compute nodes. See [HPC Pack Job Manager](https://technet.microsoft.com/library/ff919691.aspx) and [How to Submit Jobs from and On-premises Client](https://msdn.microsoft.com/library/azure/dn689084.aspx).

To submit jobs via the REST API, refer to [Creating and Submitting Jobs by Using the REST API in Microsoft HPC Pack](http://social.technet.microsoft.com/wiki/contents/articles/7737.creating-and-submitting-jobs-by-using-the-rest-api-in-microsoft-hpc-pack-windows-hpc-server.aspx). Also refer to the Python sample in the [HPC Pack SDK](https://www.microsoft.com/download/details.aspx?id=47756) to submit jobs from a Linux client.

## Clusrun for Linux nodes

The HPC Pack **clusrun** tool can be used to execute commands on Linux nodes either through a Command window or HPC Cluster Manager. Following are some examples.

* Show current user names on all nodes in the cluster

    ```
    > clusrun whoami
    ```

* Install the **gdb** debugger tool ith **yum** on all nodes in the linuxnodes group and then restart the nodes after 10 minutes

    ```
    > clusrun /nodegroup:linuxnodes yum install gdb –y; shutdown –r 10
    ```

* Create a shell script displaying each number 1 through 10 for one second on each node in the cluster, run it, and show output from the nodes immediately.

    ```
    > clusrun /interleaved echo \"for i in {1..10}; do echo \\\"\$i\\\"; sleep 1; done\" ^> script.sh; chmod +x script.sh; ./script.sh
    ```

>[AZURE.NOTE] You might need to use certain escape characters in **clusrun** commands. As shown in this example, use ^ in a Command window to escape the ">" symbol.

## Next steps

* Try running a Linux workload on the cluster. For an example, see [Run NAMD with Microsoft HPC Pack on Linux compute nodes in Azure](virtual-machines-linux-cluster-hpcpack-namd.md).

* Try scaling up the cluster to a larger number of nodes, or deploy size [A8 or A9](virtual-machines-a8-a9-a10-a11-specs.md) compute nodes to run MPI workloads.

* Try an [Azure quickstart template](https://azure.microsoft.com/documentation/templates/create-hpc-cluster-linux-cn/) with Azure Resource Manager to speed up deployments of HPC Pack with a larger number of  Linux compute nodes.

<!--Image references-->
[scenario]: ./media/virtual-machines-linux-cluster-hpcpack/scenario.png
[validate]: ./media/virtual-machines-linux-cluster-hpcpack/validate.png
[resources]: ./media/virtual-machines-linux-cluster-hpcpack/resources.png
[deploy]: ./media/virtual-machines-linux-cluster-hpcpack/deploy.png
[management]: ./media/virtual-machines-linux-cluster-hpcpack/management.png
[heatmap]: ./media/virtual-machines-linux-cluster-hpcpack/heatmap.png
[fileshareperms]: ./media/virtual-machines-linux-cluster-hpcpack/fileshare1.png
[filesharing]: ./media/virtual-machines-linux-cluster-hpcpack/fileshare2.png
[nfsauth]: ./media/virtual-machines-linux-cluster-hpcpack/nfsauth.png
[nfsshare]: ./media/virtual-machines-linux-cluster-hpcpack/nfsshare.png
[nfsperm]: ./media/virtual-machines-linux-cluster-hpcpack/nfsperm.png
[nfsmanage]: ./media/virtual-machines-linux-cluster-hpcpack/nfsmanage.png
