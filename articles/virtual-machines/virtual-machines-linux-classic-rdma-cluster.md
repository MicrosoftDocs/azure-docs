<properties
 pageTitle="Linux RDMA cluster to run MPI applications | Microsoft Azure"
 description="Create a Linux cluster of size A8 or A9 VMs to use RDMA to run MPI apps"
 services="virtual-machines-linux"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""
 tags="azure-service-management"/>
<tags
ms.service="virtual-machines-linux"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-linux"
 ms.workload="infrastructure-services"
 ms.date="05/09/2016"
 ms.author="danlep"/>

# Set up a Linux RDMA cluster to run MPI applications

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]


Learn how to set up a Linux RDMA cluster in Azure with [size A8 and A9 virtual machines](virtual-machines-linux-a8-a9-a10-a11-specs.md) to run parallel Message Passing Interface (MPI) applications. When you set up a cluster of size A8 and A9 VMs to run a supported Linux HPC distribution and a supported MPI implementation, MPI applications communicate efficiently over a low latency, high throughput network in Azure that is based on remote direct memory access (RDMA) technology.

>[AZURE.NOTE] Azure Linux RDMA is currently supported with Intel MPI Library version 5 running on size A8 or A9 VMs created from a SUSE Linux Enterprise Server (SLES) 12 HPC image or a CentOS-based 6.5 or 7.1 HPC image in the Azure Marketplace. The Centos-based HPC Marketplace images install Intel MPI version 5.1.3.181. 



## Cluster deployment options

Following are methods you can use to create a Linux RDMA cluster either with or without a job scheduler.

* **HPC Pack** - Create a Microsoft HPC Pack cluster in Azure and add size A8 or A9 compute nodes that run supported Linux distributions to access the RDMA network. See [Get started with Linux compute nodes in an HPC Pack cluster in Azure](virtual-machines-linux-classic-hpcpack-cluster.md).

* **Azure CLI scripts** - As shown in the steps in the rest of this article, use the [Azure Command-Line Interface](../xplat-cli-install.md) (CLI) to script the deployment of a virtual network and the other necessary components to create a cluster of size A8 or A9 Linux VMs. The CLI in Service Management mode creates the cluster nodes serially in the classic deployment model, so if you are deploying many compute nodes it might take several minutes to complete the deployment.

* **Azure Resource Manager templates** - Use the Resource Manager deployment model to deploy multiple A8 and A9 Linux VMs as well as define virtual networks, static IP addresses, DNS settings, and other resources for a compute cluster that can take advantage of the RDMA network to run MPI workloads. You can [create your own template](../resource-group-authoring-templates.md), or check the [Azure quickstart templates](https://azure.microsoft.com/documentation/templates/) for templates contributed by Microsoft or the community to deploy the solution you want. Resource Manager templates can provide a fast and reliable way to deploy a Linux cluster.

## Sample deployment in classic model

The following steps will help you use the Azure CLI to deploy a SUSE Linux Enterprise Server 12 HPC VM from the Azure Marketplace, install Intel MPI Library and other customizations, create a custom VM image, and then script the deployment of a cluster of A8 or A9 VMs. 

>[AZURE.TIP]  Use similar steps to deploy a cluster of A8 or A9 VMs based on the CentOS-based 6.5 or 7.1 HPC image in the Azure Marketplace. Differences are noted in the steps. For example, because the CentOS-based HPC images include Intel MPI, you do not need to install Intel MPI separately on VMs created from those images.

### Prerequisites

*   **Client computer** - You'll need a Mac, Linux, or Windows-based client computer to communicate with Azure. These steps assume you are using a Linux client.

*   **Azure subscription** - If you don't have a subscription, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes. For larger clusters, consider a pay-as-you-go subscription or other purchase options. 

*   **Cores quota** - You might need to increase the quota of cores to deploy a cluster of A8 or A9 VMs. For example, you will need at least 128 cores if you want to deploy 8 A9 VMs as shown in this article. To increase a quota, [open an online customer support request](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) at no charge.

*   **Azure CLI** - [Install](../xplat-cli-install.md) the Azure CLI and [connect to your Azure subscription](../xplat-cli-connect.md) from the client computer.

*   **Intel MPI** - To customize a SLES 12 HPC VM image for your cluster (see details later in this article), you need to download and install a current Intel MPI Library 5 runtime from the [Intel.com site](https://software.intel.com/en-us/intel-mpi-library/). To prepare for this, after you register with Intel, follow the link in the confirmation email to the related web page and copy the download link for the .tgz file for the appropriate version of Intel MPI. This article is based on Intel MPI version 5.0.3.048.

    >[AZURE.NOTE] If you use the CentOS 6.5 or CentOS 7.1 HPC image in the Azure Marketplace to create your cluster nodes, Intel MPI version 5.1.3.181 is preinstalled for you on the VM.

### Provision a SLES 12 VM

After logging in to Azure with the Azure CLI, run `azure config list` to confirm that the output shows Service Management mode. If it is not, set the mode by running this command:


    azure config mode asm


Type the following to list all the subscriptions you are authorized to use:


    azure account list

The current active subscription will be identified with `Current` set to `true`. If this is not the subscription you want to use to create the cluster, set the appropriate subscription number as the active subscription:

    azure account set <subscription-number>

To see the publicly available SLES 12 HPC images in Azure, run a command similar to the following, assuming your shell environment supports **grep**:


    azure vm image list | grep "suse.*hpc"

Now provision a size A9 VM with an available SLES 12 HPC image by running a command similar to the following:

    azure vm create -g <username> -p <password> -c <cloud-service-name> -l <location> -z A9 -n <vm-name> -e 22 b4590d9e3ed742e4a1d46e5424aa335e__suse-sles-12-hpc-v20150708

where

* the size (A9 in this example) can be A8 or A9

* the external SSH port number (22 in this example, which is the SSH default) is any valid port number; the internal SSH  port number will be set to 22

* a new cloud service will be created in the Azure region specified by the location; specify a location such as "West US" in which the A8 and A9 instances are available

* the SLES 12 image name currently can be `b4590d9e3ed742e4a1d46e5424aa335e__suse-sles-12-hpc-v20150708` or `b4590d9e3ed742e4a1d46e5424aa335e__suse-sles-12-hpc-priority-v20150708` for SUSE priority support (charges apply)

    >[AZURE.NOTE]If you want to use a CentOS-based HPC image, the current image names are `5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-65-HPC-20160408` and `5112500ae3b842c8b9c604889f8753c3__OpenLogic-CentOS-71-HPC-20160408`.

### Customize the VM

After the VM completes provisioning, SSH to the VM using the VM's external IP address (or DNS name) and the external port number you configured, and customize it. For connection details, see [How to Log on to a Virtual Machine Running Linux](virtual-machines-linux-classic-log-on.md). You should perform commands as the user you configured on the VM, unless root access is required to complete a step.

>[AZURE.IMPORTANT]Microsoft Azure does not provide root access to Linux VMs. To gain administrative access when connected as a user to the VM, run commands using `sudo`.

* **Updates** - Install updates using **zypper**. You might also want to install NFS utilities.  

    >[AZURE.IMPORTANT]If you deployed an SLES 12 HPC V, at this time we recommend that you don't apply kernel updates, which can cause issues with the Linux RDMA drivers.
    >
    >On the CentOS-based HPC images from the Marketplace, kernel updates are disabled in the **yum** configuration file. This is because the Linux RDMA drivers are distributed as an RPM package, and driver updates might not work if the kernel is updated.

* **Linux RDMA driver updates** - If you deployed an SLES 12 HPC VM, you'll need to update the RDMA drivers. See [About the A8, A9, A10, and A11 compute-intensive instances](virtual-machines-linux-a8-a9-a10-a11.md#Linux-RDMA-driver-updates-for-SLES-12) for details.

* **Intel MPI** - If you deployed an SLES 12 HPC VM, download and install the Intel MPI Library 5 runtime from the Intel.com site by running commands similar to the following. This step isn't necessary if you deployed a CentOS-based 6.5 or 7.1 HPC VM.

        sudo wget <download link for your registration>

        sudo tar xvzf <tar-file>

        cd <mpi-directory>

        sudo ./install.sh

    Accept default settings to install Intel MPI on the VM.

* **Lock memory** - For MPI codes to lock the memory available for RDMA, you need to add or change the following settings in the /etc/security/limits.conf file. (You will need root access to edit this file.) If you deployed a CentOS-based 6.5 or 7.1 HPC VM, settings are already added to this file.

        <User or group name> hard    memlock <memory required for your application in KB>

        <User or group name> soft    memlock <memory required for your application in KB>

    >[AZURE.NOTE]For testing purposes, you can also set memlock to unlimited. For example: `<User or group name>    hard    memlock unlimited.

* **SSH keys for SLES 12 VMs** - Generate SSH keys to establish trust for your user account among all the compute nodes in the SLES 12 HPC cluster when running MPI jobs. (If you deployed a CentOS-based HPC VM, don't follow this step. See instructions later in the article to set up passwordless SSH trust among the cluster nodes after you capture the image and deploy the cluster.) 

    Run the following command to create SSH keys. Just press Enter to generate the keys in the default location without setting a passphrase.

        ssh-keygen

    Append the public key to the authorized_keys file for known public keys.

        cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

    In the ~/.ssh directory edit or create the "config" file. Provide the IP address range of the private network that you will use in Azure (10.32.0.0/16 in this example):

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

    >[AZURE.NOTE]Configuring `StrictHostKeyChecking no` can create a potential security risk if a specific IP address or range is not specified as shown in these examples.

* **Applications** - Install any applications you need on this VM or perform other customizations before you capture the image.

### Capture the image

To capture the image, first run the following command in the Linux VM. This deprovisions the VM but maintains user accounts and SSH keys that you set up.

```
sudo waagent -deprovision
```

Then, from your client computer, run the following Azure CLI commands to capture the image. See [How to capture a classic Linux virtual machine as an image](virtual-machines-linux-classic-capture-image.md) for details.  

```
azure vm shutdown <vm-name>

azure vm capture -t <vm-name> <image-name>

```

After you run these commands, the VM image is captured for your use and the VM is deleted. Now you have your custom image ready to deploy a cluster.

### Deploy a cluster with the image

Modify the following Bash script with appropriate values for your environment, and run it from your client computer. Because Azure deploys the VMs serially in the classic deployment model, it takes a few minutes to deploy the 8 A9 VMs suggested in this script.

```
#!/bin/bash -x
# Script to create a compute cluster without a scheduler in a VNet in Azure
# Create a custom private network in Azure
# Replace 10.32.0.0 with your virtual network address space
# Replace <network-name> with your network identifier
# Select a region where A8 and A9 VMs are available, such as West US
# See Azure Pricing pages for prices and availability of A8 and A9 VMs

azure network vnet create -l "West US" -e 10.32.0.0 -i 16 <network-name>

# Create a cloud service. All the A8 and A9 instances need to be in the same cloud service for Linux RDMA to work across InfiniBand.
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

## Passwordless SSH trust on a CentOS cluster

If you deployed a cluster using a CentOS-based HPC image, there are two methods for establishing trust between the compute nodes: host-based authentication and user-based authentication. Host-based authentication is outside of the scope of this article and generally must be done through an extension script during deployment. User-based authentication is convenient for establishing trust after deployment and requires the generation and sharing of SSH keys among the compute nodes in the cluster. This is commonly known as passwordless SSH login and is required when running MPI jobs. 

A sample script contributed from the community is available on [GitHub](https://github.com/tanewill/utils/blob/master/user_authentication.sh) to enable easy user authentication on a CentOS-based HPC cluster. You can download and use this script using the following steps. You can also modify this script or use any other method to establish passwordless SSH authentication between the cluster compute nodes.

    wget https://raw.githubusercontent.com/tanewill/utils/master/ user_authentication.sh
    
To run the script, you'll need to know the prefix for your subnet IP addresses. You can get this by running the following command on one of the cluster nodes. Your output should look something like 10.1.3.5, and the prefix is the 10.1.3 portion.

    ifconfig eth0 | grep -w inet | awk '{print $2}'

Now run the script using three parameters: the common user name on the compute nodes, the common password for that user on the compute nodes, and the subnet prefix that was returned from the previous command.


    ./user_authentication.sh <myusername> <mypassword> 10.1.3

This script does the following:

* Creates a directory on the host node named .ssh, which is required for passwordless login. 
* Creates a configuration file in the .ssh directory which instructs passwordless login to allow login from any node in the cluster. 
* Creates files containing the node names and node IP addresses for all the nodes in the cluster. These files are left after the script is run for reference by the user. 
* Creates a private and public key pair for each cluster node including the host node and shares the information about the key pair and creates an entry in the authorized_keys file.

>[AZURE.WARNING]Running this script can create a potential security risk. Please ensure that the public key information in ~/.ssh is not distributed.


## Configure and run Intel MPI

To run MPI applications on Azure Linux RDMA, you need to configure certain environment variables specific to Intel MPI. Here is a sample Bash script to configure the variables and run an application. Change the path to mpivars.sh as needed for your installation of Intel MPI.

```
#!/bin/bash -x

# For a SLES 12 HPC cluster

source /opt/intel/impi_latest/bin64/mpivars.sh

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

The format of the host file is as follows. Add one line for each node in your cluster. Specify private IP addresses from the VNet defined earlier, not DNS names. For example, for two hosts with IP addresses 10.32.0.1 and 10.32.0.2 the file contains the following:

```
10.32.0.1:16
10.32.0.2:16
```

## Verify a basic two node cluster after Intel MPI is installed

If you haven't already done so, first set up the environment for Intel MPI. 

```
# For a SLES 12 HPC cluster

source /opt/intel/impi_latest/bin64/mpivars.sh

# For a CentOS-based HPC cluster 

# source /opt/intel/impi/5.1.3.181/bin64/mpivars.sh
```

### Run a simple MPI command

Run a simple MPI command on one of the compute nodes to show that MPI is installed properly and can communicate between at least two compute nodes. The following **mpirun** command runs the **hostname** command on two nodes  nodes.

```
mpirun -ppn 1 -n 2 -hosts <host1>,<host2> -env I_MPI_FABRICS=shm:dapl -env I_MPI_DAPL_PROVIDER=ofa-v2-ib0 -env I_MPI_DYNAMIC_CONNECTION=0 hostname
```
Your output should list the names of all the nodes that you passed as input for `-hosts`. For example, an **mpirun** command with two nodes will return an output similar to the following:

```
cluster11
cluster12
```

### Run an MPI benchmark

The following Intel MPI command verifies the cluster configuration and connection to the RDMA network by using a pingpong benchmark.

```
mpirun -hosts <host1>,<host2> -ppn 1 -n 2 -env I_MPI_FABRICS=dapl -env I_MPI_DAPL_PROVIDER=ofa-v2-ib0 -env I_MPI_DYNAMIC_CONNECTION=0 IMB-MPI1 pingpong
```

You should see output similar to the following on a working cluster with two nodes. On the Azure RDMA network, latency at or below 3 microseconds is expected for message sizes up to 512 bytes.

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

* Try deploying and running your Linux MPI applications on your Linux cluster.

* See the [Intel MPI Library documentation](https://software.intel.com/en-us/articles/intel-mpi-library-documentation/) for guidance on Intel MPI.

* Try a [quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/intel-lustre-clients-on-centos) to create an Intel Lustre cluster by using a CentOS-based HPC image. 
