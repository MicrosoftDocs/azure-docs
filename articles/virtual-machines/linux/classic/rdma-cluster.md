---
title: Set up a Linux RDMA cluster to run MPI applications | Microsoft Docs
description: Create a Linux cluster of size H16r, H16mr, A8, or A9 VMs to use the Azure RDMA network to run MPI apps
services: virtual-machines-linux
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: azure-service-management

ms.assetid: 01834bad-c8e6-48a3-b066-7f1719047dd2
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 03/14/2017
ms.author: danlep

---
# Set up a Linux RDMA cluster to run MPI applications
Learn how to set up a Linux RDMA cluster in Azure with [H-series or compute-intensive A-series VMs](../a8-a9-a10-a11-specs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) to run parallel Message Passing Interface (MPI) applications. This article provides steps to prepare a Linux HPC image to run Intel MPI on a cluster. After preparation, you deploy a cluster of VMs using this image and one of the RDMA-capable Azure VM sizes (currently H16r, H16mr, A8, or A9). Use the cluster to run MPI applications that communicate efficiently over a low-latency, high-throughput network based on remote direct memory access (RDMA) technology.

> [!IMPORTANT]
> Azure has two different deployment models for creating and working with resources: [Azure Resource Manager](../../../resource-manager-deployment-model.md) and classic. This article covers using the classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model.

## Cluster deployment options
Following are methods you can use to create a Linux RDMA cluster with or without a job scheduler.

* **Azure CLI scripts**: As shown later in this article, use the [Azure command-line interface](../../../cli-install-nodejs.md) (CLI) to script the deployment of a cluster of RDMA-capable VMs. The CLI in Service Management mode creates the cluster nodes serially in the classic deployment model, so deploying many compute nodes might take several minutes. To enable the RDMA network connection when you use the classic deployment model, deploy the VMs in the same cloud service.
* **Azure Resource Manager templates**: You can also use the Resource Manager deployment model to deploy a cluster of RDMA-capable VMs that connects to the RDMA network. You can [create your own template](../../../resource-group-authoring-templates.md), or check the [Azure quickstart templates](https://azure.microsoft.com/documentation/templates/) for templates contributed by Microsoft or the community to deploy the solution you want. Resource Manager templates can provide a fast and reliable way to deploy a Linux cluster. To enable the RDMA network connection when you use the Resource Manager deployment model, deploy the VMs in the same availability set.
* **HPC Pack**: Create a Microsoft HPC Pack cluster in Azure and add RDMA-capable compute nodes that run a supported Linux distribution to access the RDMA network. For more information, see [Get started with Linux compute nodes in an HPC Pack cluster in Azure](hpcpack-cluster.md).

## Sample deployment steps in the classic model
The following steps show how to use the Azure CLI to deploy a SUSE Linux Enterprise Server (SLES) 12 SP1 HPC VM from the Azure Marketplace, customize it, and create a custom VM image. Then you can use the image to script the deployment of a cluster of RDMA-capable VMs.

> [!TIP]
> Use similar steps to deploy a cluster of RDMA-capable VMs based on CentOS-based HPC images in the Azure Marketplace. Some steps differ slightly, as noted. 
>
>

### Prerequisites
* **Client computer**: You need a Mac, Linux, or Windows client computer to communicate with Azure. These steps assume you are using a Linux client.
* **Azure subscription**: If you don't have a subscription, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes. For larger clusters, consider a pay-as-you-go subscription or other purchase options.
* **VM size availability**: The following instance sizes are RDMA capable: H16r, H16mr, A8, and A9. Check [Products available by region](https://azure.microsoft.com/regions/services/) for availability in Azure regions.
* **Cores quota**: You might need to increase the quota of cores to deploy a cluster of compute-intensive VMs. For example, you need at least 128 cores if you want to deploy 8 A9 VMs as shown in this article. Your subscription might also limit the number of cores you can deploy in certain VM size families, including the H-series. To request a quota increase, [open an online customer support request](../../../azure-supportability/how-to-create-azure-support-request.md) at no charge.
* **Azure CLI**: [Install](../../../cli-install-nodejs.md) the Azure CLI and [connect to your Azure subscription](../../../xplat-cli-connect.md) from the client computer.

### Provision an SLES 12 SP1 HPC VM
After signing in to Azure with the Azure CLI, run `azure config list` to confirm that the output shows Service Management mode. If it does not, set the mode by running this command:

    azure config mode asm


Type the following to list all the subscriptions you are authorized to use:

    azure account list

The current active subscription is identified with `Current` set to `true`. If this subscription isn't the one you want to use to create the cluster, set the appropriate subscription ID as the active subscription:

    azure account set <subscription-Id>

To see the publicly available SLES 12 SP1 HPC images in Azure, run a command like the following, assuming your shell environment supports **grep**:

    azure vm image list | grep "suse.*hpc"

Provision an RDMA-capable VM with a SLES 12 SP1 HPC image by running a command like the following:

    azure vm create -g <username> -p <password> -c <cloud-service-name> -l <location> -z A9 -n <vm-name> -e 22 b4590d9e3ed742e4a1d46e5424aa335e__suse-sles-12-sp1-hpc-v20160824

Where:

* The size (A9 in this example) is one of the RDMA-capable VM sizes.
* The external SSH port number (22 in this example, which is the SSH default) is any valid port number. The internal SSH port number is set to 22.
* A new cloud service is created in the Azure region specified by the location. Specify a location in which the VM size you choose is available.
* For SUSE priority support (which incurs additional charges), the SLES 12 SP1 image name currently can be one of these two options: 

 `b4590d9e3ed742e4a1d46e5424aa335e__suse-sles-12-sp1-hpc-v20160824`

  `b4590d9e3ed742e4a1d46e5424aa335e__suse-sles-12-sp1-hpc-priority-v20160824`


### Customize the VM
After the VM finishes provisioning, SSH to the VM by using the VM's external IP address (or DNS name) and the external port number you configured, and then customize it. For connection details, see [How to log on to a virtual machine running Linux](../mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). Perform commands as the user you configured on the VM, unless root access is required to complete a step.

> [!IMPORTANT]
> Microsoft Azure does not provide root access to Linux VMs. To gain administrative access when connected as a user to the VM, run commands by using `sudo`.
>
>

* **Updates**: Install updates by using zypper. You might also want to install NFS utilities.

  > [!IMPORTANT]
  > In a SLES 12 SP1 HPC VM, we recommend that you don't apply kernel updates, which can cause issues with the Linux RDMA drivers.
  >
  >
* **Intel MPI**: Complete the installation of Intel MPI on the SLES 12 SP1 HPC VM by running the following command:

        sudo rpm -v -i --nodeps /opt/intelMPI/intel_mpi_packages/*.rpm
* **Lock memory**: For MPI codes to lock the memory available for RDMA, add or change the following settings in the /etc/security/limits.conf file. You need root access to edit this file.

    ```
    <User or group name> hard    memlock <memory required for your application in KB>

    <User or group name> soft    memlock <memory required for your application in KB>
    ```

  > [!NOTE]
  > For testing purposes, you can also set memlock to unlimited. For example: `<User or group name>    hard    memlock unlimited`. For more information, see [Best known methods for setting locked memory size](https://software.intel.com/en-us/blogs/2014/12/16/best-known-methods-for-setting-locked-memory-size).
  >
  >
* **SSH keys for SLES VMs**: Generate SSH keys to establish trust for your user account among the compute nodes in the SLES cluster when running MPI jobs. If you deployed a CentOS-based HPC VM, don't follow this step. See instructions later in this article to set up passwordless SSH trust among the cluster nodes after you capture the image and deploy the cluster.

    To create SSH keys, run the following command. When you are prompted for input, select **Enter** to generate the keys in the default location without setting a password.

        ssh-keygen

    Append the public key to the authorized_keys file for known public keys.

        cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

    In the ~/.ssh directory, edit or create the config file. Provide the IP address range of the private network that you plan to use in Azure (10.32.0.0/16 in this example):

        host 10.32.0.*
        StrictHostKeyChecking no

    Alternatively, list the private network IP address of each VM in your cluster as follows:

    ```
    host 10.32.0.1
     StrictHostKeyChecking no
    host 10.32.0.2
     StrictHostKeyChecking no
    host 10.32.0.3
     StrictHostKeyChecking no
    ```

  > [!NOTE]
  > Configuring `StrictHostKeyChecking no` can create a potential security risk when a specific IP address or range is not specified.
  >
  >
* **Applications**: Install any applications you need or perform other customizations before you capture the image.

### Capture the image
To capture the image, first run the following command on the Linux VM. This command deprovisions the VM but maintains user accounts and SSH keys that you set up.

```
sudo waagent -deprovision
```

From your client computer, run the following Azure CLI commands to capture the image. For more information, see [How to capture a classic Linux virtual machine as an image](capture-image.md).  

```
azure vm shutdown <vm-name>

azure vm capture -t <vm-name> <image-name>

```

After you run these commands, the VM image is captured for your use and the VM is deleted. Now you have your custom image ready to deploy a cluster.

### Deploy a cluster with the image
Modify the following Bash script with appropriate values for your environment and run it from your client computer. Because Azure deploys the VMs serially in the classic deployment model, it takes a few minutes to deploy the eight A9 VMs suggested in this script.

```
#!/bin/bash -x
# Script to create a compute cluster without a scheduler in a VNet in Azure
# Create a custom private network in Azure
# Replace 10.32.0.0 with your virtual network address space
# Replace <network-name> with your network identifier
# Replace "West US" with an Azure region where the VM size is available
# See Azure Pricing pages for prices and availability of compute-intensive VMs

azure network vnet create -l "West US" -e 10.32.0.0 -i 16 <network-name>

# Create a cloud service. All the compute-intensive instances need to be in the same cloud service for Linux RDMA to work across InfiniBand.
# Note: The current maximum number of VMs in a cloud service is 50. If you need to provision more than 50 VMs in the same cloud service in your cluster, contact Azure Support.

azure service create <cloud-service-name> --location "West US" –s <subscription-ID>

# Define a prefix naming scheme for compute nodes, e.g., cluster11, cluster12, etc.

vmname=cluster

# Define a prefix for external port numbers. If you want to turn off external ports and use only internal ports to communicate between compute nodes via port 22, don’t use this option. Since port numbers up to 10000 are reserved, use numbers after 10000. Leave external port on for rank 0 and head node.

portnumber=101

# In this cluster there will be 8 size A9 nodes, named cluster11 to cluster18. Specify your captured image in <image-name>. Specify the username and password you used when creating the SSH keys.

for (( i=11; i<19; i++ )); do
        azure vm create -g <username> -p <password> -c <cloud-service-name> -z A9 -n $vmname$i -e $portnumber$i -w <network-name> -b Subnet-1 <image-name>
done

# Save this script with a name like makecluster.sh and run it in your shell environment to provision your cluster
```

## Considerations for a CentOS HPC cluster
If you want to set up a cluster based on one of the CentOS-based HPC images in the Azure Marketplace instead of SLES 12 for HPC, follow the general steps in the preceding section. Note the following differences when you provision and configure the VM:

- Intel MPI is already installed on a VM provisioned from a CentOS-based HPC image.
- Lock memory settings are already added in the VM's /etc/security/limits.conf file.
- Do not generate SSH keys on the VM you provision for capture. Instead, we recommend setting up user-based authentication after you deploy the cluster. For more information, see the following section.  

### Set up passwordless SSH trust on the cluster
On a CentOS-based HPC cluster, there are two methods for establishing trust between the compute nodes: host-based authentication and user-based authentication. Host-based authentication is outside of the scope of this article and generally must be done through an extension script during deployment. User-based authentication is convenient for establishing trust after deployment and requires the generation and sharing of SSH keys among the compute nodes in the cluster. This method is commonly known as passwordless SSH login and is required when running MPI jobs.

A sample script contributed from the community is available on [GitHub](https://github.com/tanewill/utils/blob/master/user_authentication.sh) to enable easy user authentication on a CentOS-based HPC cluster. Download and use this script by using the following steps. You can also modify this script or use any other method to establish passwordless SSH authentication between the cluster compute nodes.

    wget https://raw.githubusercontent.com/tanewill/utils/master/ user_authentication.sh

To run the script, you need to know the prefix for your subnet IP addresses. Get the prefix by running the following command on one of the cluster nodes. Your output should look something like 10.1.3.5, and the prefix is the 10.1.3 portion.

    ifconfig eth0 | grep -w inet | awk '{print $2}'

Now run the script using three parameters: the common user name on the compute nodes, the common password for that user on the compute nodes, and the subnet prefix that was returned from the previous command.

    ./user_authentication.sh <myusername> <mypassword> 10.1.3

This script does the following:

* Creates a directory on the host node named .ssh, which is required for passwordless login.
* Creates a configuration file in the .ssh directory that instructs passwordless login to allow login from any node in the cluster.
* Creates files containing the node names and node IP addresses for all the nodes in the cluster. These files are left after the script is run for later reference.
* Creates a private and public key pair for each cluster node (including the host node) and creates entries in the authorized_keys file.

> [!WARNING]
> Running this script can create a potential security risk. Ensure that the public key information in ~/.ssh is not distributed.
>
>

## Configure Intel MPI
To run MPI applications on Azure Linux RDMA, you need to configure certain environment variables specific to Intel MPI. Here is a sample Bash script to configure the variables needed to run an application. Change the path to mpivars.sh as needed for your installation of Intel MPI.

```
#!/bin/bash -x

# For a SLES 12 SP1 HPC cluster

source /opt/intel/impi/5.0.3.048/bin64/mpivars.sh

# For a CentOS-based HPC cluster

# source /opt/intel/impi/5.1.3.181/bin64/mpivars.sh

export I_MPI_FABRICS=shm:dapl

# THIS IS A MANDATORY ENVIRONMENT VARIABLE AND MUST BE SET BEFORE RUNNING ANY JOB
# Setting the variable to shm:dapl gives best performance for some applications
# If your application doesn’t take advantage of shared memory and MPI together, then set only dapl

export I_MPI_DAPL_PROVIDER=ofa-v2-ib0

# THIS IS A MANDATORY ENVIRONMENT VARIABLE AND MUST BE SET BEFORE RUNNING ANY JOB

export I_MPI_DYNAMIC_CONNECTION=0

# THIS IS A MANDATORY ENVIRONMENT VARIABLE AND MUST BE SET BEFORE RUNNING ANY JOB

# Command line to run the job

mpirun -n <number-of-cores> -ppn <core-per-node> -hostfile <hostfilename>  /path <path to the application exe> <arguments specific to the application>

#end
```

The format of the host file is as follows. Add one line for each node in your cluster. Specify private IP addresses from the virtual network defined earlier, not DNS names. For example, for two hosts with IP addresses 10.32.0.1 and 10.32.0.2, the file contains the following:

```
10.32.0.1:16
10.32.0.2:16
```

## Run MPI on a basic two-node cluster
If you haven't already done so, first set up the environment for Intel MPI.

```
# For a SLES 12 SP1 HPC cluster

source /opt/intel/impi/5.0.3.048/bin64/mpivars.sh

# For a CentOS-based HPC cluster

# source /opt/intel/impi/5.1.3.181/bin64/mpivars.sh
```

### Run an MPI command
Run an MPI command on one of the compute nodes to show that MPI is installed properly and can communicate between at least two compute nodes. The following **mpirun** command runs the **hostname** command on two nodes.

```
mpirun -ppn 1 -n 2 -hosts <host1>,<host2> -env I_MPI_FABRICS=shm:dapl -env I_MPI_DAPL_PROVIDER=ofa-v2-ib0 -env I_MPI_DYNAMIC_CONNECTION=0 hostname
```
Your output should list the names of all the nodes that you passed as input for `-hosts`. For example, an **mpirun** command with two nodes returns output like the following:

```
cluster11
cluster12
```

### Run an MPI benchmark
The following Intel MPI command runs a pingpong benchmark to verify the cluster configuration and connection to the RDMA network.

```
mpirun -hosts <host1>,<host2> -ppn 1 -n 2 -env I_MPI_FABRICS=dapl -env I_MPI_DAPL_PROVIDER=ofa-v2-ib0 -env I_MPI_DYNAMIC_CONNECTION=0 IMB-MPI1 pingpong
```

On a working cluster with two nodes, you should see output like the following. On the Azure RDMA network, expect latency at or below 3 microseconds for message sizes up to 512 bytes.

```
#------------------------------------------------------------
#    Intel (R) MPI Benchmarks 4.0 Update 1, MPI-1 part
#------------------------------------------------------------
# Date                  : Fri Jul 17 23:16:46 2015
# Machine               : x86_64
# System                : Linux
# Release               : 3.12.39-44-default
# Version               : #5 SMP Thu Jun 25 22:45:24 UTC 2015
# MPI Version           : 3.0
# MPI Thread Environment:
# New default behavior from Version 3.2 on:
# the number of iterations per message size is cut down
# dynamically when a certain run time (per message size sample)
# is expected to be exceeded. Time limit is defined by variable
# "SECS_PER_SAMPLE" (=> IMB_settings.h)
# or through the flag => -time

# Calling sequence was:
# /opt/intel/impi_latest/bin64/IMB-MPI1 pingpong
# Minimum message length in bytes:   0
# Maximum message length in bytes:   4194304
#
# MPI_Datatype                   :   MPI_BYTE
# MPI_Datatype for reductions    :   MPI_FLOAT
# MPI_Op                         :   MPI_SUM
#
#
# List of Benchmarks to run:
# PingPong
#---------------------------------------------------
# Benchmarking PingPong
# #processes = 2
#---------------------------------------------------
       #bytes #repetitions      t[usec]   Mbytes/sec
            0         1000         2.23         0.00
            1         1000         2.26         0.42
            2         1000         2.26         0.85
            4         1000         2.26         1.69
            8         1000         2.26         3.38
           16         1000         2.36         6.45
           32         1000         2.57        11.89
           64         1000         2.36        25.81
          128         1000         2.64        46.19
          256         1000         2.73        89.30
          512         1000         3.09       157.99
         1024         1000         3.60       271.53
         2048         1000         4.46       437.57
         4096         1000         6.11       639.23
         8192         1000         7.49      1043.47
        16384         1000         9.76      1600.76
        32768         1000        14.98      2085.77
        65536          640        25.99      2405.08
       131072          320        50.68      2466.64
       262144          160        80.62      3101.01
       524288           80       145.86      3427.91
      1048576           40       279.06      3583.42
      2097152           20       543.37      3680.71
      4194304           10      1082.94      3693.63

# All processes entering MPI_Finalize

```



## Next steps
* Deploy and run your Linux MPI applications on your Linux cluster.
* See the [Intel MPI Library documentation](https://software.intel.com/en-us/articles/intel-mpi-library-documentation/) for guidance on Intel MPI.
* Try a [quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/intel-lustre-clients-on-centos) to create an Intel Lustre cluster by using a CentOS-based HPC image. For details, see [Deploying Intel Cloud Edition for Lustre on Microsoft Azure](https://blogs.msdn.microsoft.com/arsen/2015/10/29/deploying-intel-cloud-edition-for-lustre-on-microsoft-azure/).
