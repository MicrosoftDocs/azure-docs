<properties
 pageTitle="Run StarCCM+ with HPC Pack on Linux VMs | Microsoft Azure"
 description="Deploy a Microsoft HPC Pack cluster on Azure and run an StarCCM+ job on multiple Linux compute nodes across an RDMA network."
 services="virtual-machines-linux"
 documentationCenter=""
 authors="xpillons"
 manager="kateh"
 editor=""
 tags="azure-service-management,azure-resource-manager,hpc-pack"/>
<tags
 ms.service="virtual-machines-linux"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-linux"
 ms.workload="big-compute"
 ms.date="04/13/2016"
 ms.author="xpillons"/>

# Run StarCCM+ with Microsoft HPC Pack on a Linux RDMA cluster in Azure
This article shows you how to deploy a Microsoft HPC Pack cluster on Azure and run a [CD-Adapco StarCCM+](http://www.cd-adapco.com/products/star-ccm%C2%AE) job on multiple Linux compute nodes interconnected with Infiniband.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

Microsoft HPC Pack provides features to run a variety of large-scale HPC and parallel applications, including MPI applications, on clusters of Microsoft Azure virtual machines. HPC Pack also supports running Linux HPC applications on Linux compute node VMs deployed in an HPC Pack cluster. See [Get started with Linux compute nodes in an HPC Pack cluster in Azure](virtual-machines-linux-classic-hpcpack-cluster.md) for an introduction to using Linux compute nodes with HPC Pack.

## Setup HPC Pack cluster
Download the HPC Pack IaaS deployment scripts from [here](https://www.microsoft.com/en-us/download/details.aspx?id=44949) and extract them locally.

Azure Powershell is a pre-requisite please read this article [How to install and configure Azure PowerShell](../powershell-install-configure.md) if not configured on your local machine.

At the time of this writing, the Linux images from the Azure Gallery which contains the Infiniband drivers for Azure are for SLES 12, CentOS 6.5 and CentOS 7.1. This article is based on the usage of  SLES 12. In order to retrieve the name of all Linux images supporting HPC in the gallery you can run the following powershell command :

```
    get-azurevmimage | ?{$_.ImageName.Contains("hpc") -and $_.OS -eq "Linux" }
```

The output list the location in which these images are available and the **ImageName** to be used in the deployment template later.
Before deploying the cluster, you have to build an HPC Pack deployment template file, and because we are targeting a small cluster, the Head Node will be the Domain Controller and host a local SQL database.
The template below will deploy such a HeadNode, create an xml file names **MyCluster.xml** and replace the values of **SubscriptionId**, **StorageAccount**, **Location**, **VMName** and **ServiceName** with yours.

    <?xml version="1.0" encoding="utf-8" ?>
    <IaaSClusterConfig>
      <Subscription>
        <SubscriptionId>99999999-9999-9999-9999-999999999999</SubscriptionId>
        <StorageAccount>mystorageaccount</StorageAccount>
      </Subscription>
      <Location>North Europe</Location>
      <VNet>
        <VNetName>hpcvnetne</VNetName>
        <SubnetName>subnet-hpc</SubnetName>
      </VNet>
      <Domain>
        <DCOption>HeadNodeAsDC</DCOption>
        <DomainFQDN>hpc.local</DomainFQDN>
      </Domain>
      <Database>
        <DBOption>LocalDB</DBOption>
      </Database>
      <HeadNode>
        <VMName>myhpchn</VMName>
        <ServiceName>myhpchn</ServiceName>
        <VMSize>Standard_D4</VMSize>
      </HeadNode>
      <LinuxComputeNodes>
        <VMNamePattern>lnxcn-%0001%</VMNamePattern>
        <ServiceNamePattern>mylnxcn%01%</ServiceNamePattern>
        <MaxNodeCountPerService>20</MaxNodeCountPerService>
        <StorageAccountNamePattern>mylnxstorage%01%</StorageAccountNamePattern>
        <VMSize>A9</VMSize>
        <NodeCount>0</NodeCount>
        <ImageName>b4590d9e3ed742e4a1d46e5424aa335e__suse-sles-12-hpc-v20150708</ImageName>
      </LinuxComputeNodes>
    </IaaSClusterConfig>

Kickoff the HeadNode creation by running the powershell command in an elevated command windows:

```
    .\New-HPCIaaSCluster.ps1 -ConfigFile MyCluster.xml
```

After 20 to 30mn the HeadNode should be ready. You can connect to it from the Azure portal by clicking on the Connect icon of the Virtual Machine.

You may eventually have to fix the DNS forwarder. To do so, start the DNS Manager.

1.  Right-click the server name in DNS Manager, select Properties, select the Forwarders tab

2.  Click the Edit button remove any forwarders then click OK

3.  Make sure that the check box “Use root hints if no forwarders are available” is checked and click OK

## Setup Linux Compute Nodes
Deploying the Linux Compute nodes is done thru the exact same deployment template used above to create the HeadNode.
Copy the file **MyCluster.xml** from your local machine to the HeadNode and update the **NodeCount** tag with the number of nodes you want to deploy (<=20). Be careful to have enough available cores in your Azure quota as each A9 instance will consume 16 cores in your subscription. You can use A8 instances (8 cores) instead of A9 if you want to use more VMs in the same budget.

On the Head Node, copy the HPC Pack IaaS deployment scripts.

Open an Azure Powershell in an elevated command window :

1.  Run **Add-AzureAccount** to connect to your azure subscription

2.  If you have multiple subscriptions, run the **Get-AzureSubscription** to list them

3.  Set a default one running the command **Select-AzureSubscription -SubscriptionName xxxx -Default**

4.  Run **.\New-HPCIaaSCluster.ps1 -ConfigFile MyCluster.xml** to start deploying Linux Compute Nodes.
    ![HeadNode deployment in action][hndeploy]

Open the HPC Pack Cluster Manager tool, after few minutes, Linux Compute Nodes will regularly appear in list of cluster compute nodes. With the classic deployment mode, IaaS VMs are created sequentially, so if the number of nodes is important, it can take a significant amount of time to get them all deployed.
![Linux Nodes in HPC Pack cluster manager][clustermanager]

Now that all nodes are up and running in the cluster there are additional infrastructure settings to do.

## Setup Azure File Share for Windows and Linux Nodes
To make our life easier we use Azure Files which provides CIFS capabilities on top of Azure Blobs as a persistent store, to store our scripts, application packages and data files. Be aware that this is not the most scalable solution, but it is the simplest one and doesn’t require dedicated VMs.

Create an Azure File Share by following the instructions available from the article [Get started with Azure File storage on Windows](..\storage\storage-dotnet-how-to-use-files.md)

Keep the name of your storage account **saname**, the file share name **sharename** and the storage account key **sakey**.

### Mounting Azure File Share on the Head Node
Open an elevated command prompt and run the following command to store the credentials in the local machine vault

```
    cmdkey /add:<saname>.file.core.windows.net /user:<saname> /pass:<sakey>
```

Then to mount the Azure File share run

```
    net use Z: \\<saname>.file.core.windows.net\<sharename> /persistent:yes
```

### Mounting Azure File Share on Linux compute nodes
One useful tool that comes with HPC Pack is the clusrun utility. This command line allows you to run the same command simultaneously on a set of compute nodes. In our case it is used to mount the Azure File Share and persist it to survive reboots.
In an elevated command windows on the HeadNode run the following commands.

To create the mount directory.

```
    clusrun /nodegroup:LinuxNodes mkdir -p /hpcdata
```

To mount the Azure File Share

```
    clusrun /nodegroup:LinuxNodes mount -t cifs //<saname>.file.core.windows.net/<sharename> /hpcdata -o vers=2.1,username=<saname>,password='<sakey>',dir_mode=0777,file_mode=0777
```

To persist the mount share

```
    clusrun /nodegroup:LinuxNodes "echo //<saname>.file.core.windows.net/<sharename> /hpcdata cifs vers=2.1,username=<saname>,password='<sakey>',dir_mode=0777,file_mode=0777 >> /etc/fstab"
```

## Update the Linux Drivers
You may have to eventually update the Infiniband drivers of the Linux compute nodes. Please read this article to know if and how to do it [Update the Linux RDMA drivers for SLES 12](virtual-machines-linux-classic-rdma-cluster.md/#update-the-linux-rdma-drivers-for-sles-12)

## Install StarCCM+
Azure VM instances A8 and A9 provides Infiniband support and RDMA capabilities. The kernel drivers enabling those capabilities are available at the time of writing for Windows 2012 R2 and SUSE 12 images in the Azure gallery, CentOS 7.x will be available soon. Microsoft MPI and Intel MPI (release 5.x) are the two MPI libraries supporting those drivers in Azure.

CD-Adapco StarCCM+ release 11.x and above is bundled with Intel MPI version 5.x, so Infiniband support for Azure is included.

Get the Linux64 StarCCM+ package from the [CD-Adapco portal](https://steve.cd-adapco.com)  in our case we used version 11.02.010 in mixed precision.

On the HeadNode, in the **/hpcdata** azure file share, create a shell script named **setupstarccm.sh** with the following content. This script will be launched on each compute nodes to setup StarCCM+ locally.

#### sample setupstarcm.sh script
```
    #!/bin/bash
    # setupstarcm.sh setup StarCCM+ locally

    # create the CD-adapco main directory
    mkdir -p /opt/CD-adapco

    # copy the starccm package from the file share to the local dir
    cp /hpcdata/StarCCM/STAR-CCM+11.02.010_01_linux-x86_64.tar.gz /opt/CD-adapco/

    # extract the package
    tar -xzf /opt/CD-adapco/STAR-CCM+11.02.010_01_linux-x86_64.tar.gz -C /opt/CD-adapco/

    # start a silent installation of starccm without flexlm component
    /opt/CD-adapco/starccm+_11.02.010/STAR-CCM+11.02.010_01_linux-x86_64-2.5_gnu4.8.bin -i silent -DCOMPUTE_NODE=true -DNODOC=true -DINSTALLFLEX=false

    # update memory limits
    echo "*               hard    memlock         unlimited" >> /etc/security/limits.conf
    echo "*               soft    memlock         unlimited" >> /etc/security/limits.conf
```
Now, to setup StarCCM+ on all your Linux compute nodes, open an elevated command window and run the following command

```
    clusrun /nodegroup:LinuxNodes bash /hpcdata/setupstarccm.sh
```

While the command is running, you can monitor the CPU usage with the heatmap of the Cluster Manager. After few minutes all nodes should be correctly setup.

## Running StarCCM+ Jobs
HPC Pack is used for its job scheduler capabilities in order to run StarCCM+ jobs. To do so we need the support of few scripts that are used to kick off the job and execute StarCCM+. The input data are kept on the Azure File share first for simplicity.
The following Powershell script is used to queue a StarCCM+ job. It takes 3 arguments :

*  The Model name
*  The number of nodes to be used
*  The number of cores on each node to be used

Because StarCCM+ can max out the memory bandwidth it is usually better to use less cores per compute nodes and add new nodes. The exact core ratio per node will depend on the processor family and the interconnect speed.

The nodes are allocated exclusively for the job and can’t be shared with other jobs. As you can notice the job is not started as an MPI job directly, the MPI launcher will be started from the **runstarccm.sh** shell script.

The input model and the **runstarccm.sh** are expected to be stored in the **/hpcdata** share previously mounted.

Log files are named with the job ID and are stored in the **/hpcdata share** as well as the StarCCM+ output files.


#### sample SubmitStarccmJob.ps1 script
```
    Add-PSSnapin Microsoft.HPC -ErrorAction silentlycontinue
    $scheduler="headnodename"
    $modelName=$args[0]
    $nbCoresPerNode=$args[2]
    $nbNodes=$args[1]

    #---------------------------------------------------------------------------------------------------------
    # create a new job, this will give us the JobId used to identify the name of the uploaded package in azure
    #
    $job = New-HpcJob -Name "$modelName $nbNodes $nbCoresPerNode" -Scheduler $scheduler -NumNodes $nbNodes -NodeGroups "LinuxNodes" -FailOnTaskFailure $true -Exclusive $true
    $jobId = [String]$job.Id

    #---------------------------------------------------------------------------------------------------------
    # submit job 	
    $workdir =  "/hpcdata"
    $execName = "$nbCoresPerNode runner.java $modelName.sim"

    $job | Add-HpcTask -Scheduler $scheduler -Name "Compute" -stdout "$jobId.log" -stderr "$jobId.err" -Rerunnable $false -NumNodes $nbNodes -Command "runstarccm.sh $execName" -WorkDir "$workdir"


    Submit-HpcJob -Job $job -Scheduler $scheduler
```
Replace the **runner.java** with your preferred StarCCM+ java model launcher and logging code.

#### sample runstarccm.sh script
```
    #!/bin/bash
    echo "start"
    # The path of this script
    SCRIPT_PATH="$( dirname "${BASH_SOURCE[0]}" )"
    echo ${SCRIPT_PATH}
    # Set mpirun runtime environment
    export CDLMD_LICENSE_FILE=1999@flex.cd-adapco.com

    # mpirun command
    STARCCM=/opt/CD-adapco/STAR-CCM+11.02.010/star/bin/starccm+

    # Get node information from ENVs
    NODESCORES=(${CCP_NODES_CORES})
    COUNT=${#NODESCORES[@]}
    NBCORESPERNODE=$1

    # Create the hostfile file
    NODELIST_PATH=${SCRIPT_PATH}/hostfile_$$
    echo ${NODELIST_PATH}

    # Get every node name and write into the hostfile file
    I=1
    NBNODES=0
    while [ ${I} -lt ${COUNT} ]
    do
    	echo "${NODESCORES[${I}]}" >> ${NODELIST_PATH}
    	let "I=${I}+2"
    	let "NBNODES=${NBNODES}+1"
    done
    let "NBCORES=${NBNODES}*${NBCORESPERNODE}"

    # Run the starccm with hostfile arg
    #  
    ${STARCCM} -np ${NBCORES} -machinefile ${NODELIST_PATH} \
    	-power -podkey "<yourkey>" -rsh ssh \
    	-mpi intel -fabric UDAPL -cpubind bandwidth,v \
    	-mppflags "-ppn $NBCORESPERNODE -genv I_MPI_DAPL_PROVIDER=ofa-v2-ib0 -genv I_MPI_DAPL_UD=0 -genv I_MPI_DYNAMIC_CONNECTION=0" \
    	-batch $2 $3
    RTNSTS=$?
    rm -f ${NODELIST_PATH}

    exit ${RTNSTS}
```

In our test we were using a Power-One-Demand license token for which you have to set the **$CDLMD_LICENSE_FILE** environment variable to **1999@flex.cd-adapco.com** and the key in the **-podkey** option of the command line.

After some initialization, the script extract from the **$CCP_NODES_CORES** environment variables set by HPC Pack, the list of nodes to build a hostfile used by the MPI launcher. This hostfile will contain the list of compute node names used for the job, one name per line.

The format of **$CCP_NODES_CORES** follows this pattern:

```
<Number of nodes> <Name of node1> <Cores of node1> <Name of node2> <Cores of node2>...`
```

where

* `<Number of nodes>`: the number of nodes allocated to this job.  
* `<Name of node_n_...>`: the name of each node allocated to this job.
* `<Cores of node_n_...>`: the number of cores on the node allocated to this job.

The number of cores **$NBCORES** is also calculated based on the number of nodes **$NBNODES** and the number of cores per node provided as parameter **$NBCORESPERNODE**.

For the MPI options the one used with Intel MPI on Azure are :

*   -mpi intel => to specify IntelMPI
*   -fabric UDAPL => to use Azure Infiniband Verbs
*   -cpubind bandwidth,v => this is to optimize bandwidth for MPI with StarCCM+
*   -mppflags "-ppn $NBCORESPERNODE -genv I_MPI_DAPL_PROVIDER=ofa-v2-ib0 -genv I_MPI_DAPL_UD=0 -genv I_MPI_DYNAMIC_CONNECTION=0" => those are Intel MPI settings to work with Azure Infiniband, and it also set the required number of cores per node
*   -batch => to start StarCCM+ to in batch mode with no UI


Finally, to start a job, make sure that your nodes are up and running and are online in the Cluster Manager. Then from a powershell command window run this :

```
    .\ SubmitStarccmJob.ps1 <model> <nbNodes> <nbCoresPerNode>
```

## Stopping Nodes
Later on, once you are done with your tests, to stop and start nodes you can use the following HPC Pack powershell commands :

```
    Stop-HPCIaaSNode.ps1 -Name <prefix>-00*
    Start-HPCIaaSNode.ps1 -Name <prefix>-00*
```

## Next steps
Try running other Linux workloads for example see :

* [Run NAMD with Microsoft HPC Pack on Linux compute nodes in Azure](virtual-machines-linux-classic-hpcpack-cluster-namd.md).

* [Run OpenFOAM with Microsoft HPC Pack on a Linux RDMA cluster in Azure](virtual-machines-linux-classic-hpcpack-cluster-openfoam.md).


<!--Image references-->
[hndeploy]: ./media/virtual-machines-linux-classic-hpcpack-cluster-starccm/hndeploy.png
[clustermanager]: ./media/virtual-machines-linux-classic-hpcpack-cluster-starccm/ClusterManager.png
