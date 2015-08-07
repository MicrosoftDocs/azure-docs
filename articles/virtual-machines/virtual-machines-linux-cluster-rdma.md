<properties
 pageTitle="Set up a Linux RDMA cluster to run MPI applications | Microsoft Azure"
 description="Learn how to create a Linux cluster of size A8 or A9 VMs to use RDMA to run MPI apps."
 services="virtual-machines"
 documentationCenter=""
 authors="dlepow"
 manager="timlt"
 editor=""/>
<tags
ms.service="virtual-machines"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-linux"
 ms.workload="infrastructure-services"
 ms.date="07/17/2015"
 ms.author="danlep"/>

# Set up a Linux RDMA cluster to run MPI applications

This article shows you how to set up a Linux RDMA cluster in Azure with [size A8 and A9 virtual machines](virtual-machines-a8-a9-a10-a11-specs.md) to run parallel Message Passing Interface (MPI) applications. When you configure size A8 and A9 Linux-based VMs to run a supported MPI implementation, MPI applications communicate efficiently over a low latency, high throughput network in Azure that is based on remote direct memory access (RDMA) technology.

>[AZURE.NOTE] Azure Linux RDMA is currently supported with Intel MPI Library version 5.0 running on SUSE Linux Enterprise Server 12 (SLES 12).
>
> Azure also provides A10 and A11 compute intensive instances, with processing capabilities identical to the A8 and A9 instances, but without a connection to an RDMA backend network. To run MPI workloads in Azure, you will generally get best performance with the A8 and A9 instances.


## Linux cluster deployment options

Following are methods you can use to create a Linux RDMA cluster either with or without a job scheduler.

* **HPC Pack** - You can create a Microsoft HPC Pack cluster in Azure and add compute nodes that run supported Linux distributions (supported starting in HPC Pack 2012 R2 Update 2). Some Linux nodes can be configured to access the RDMA network. See the [HPC Pack documentation](http://go.microsoft.com/fwlink/?LinkId=617894) to get started.

* **Azure CLI scripts** - You can use the [Azure Command Line Interface](../xplat-cli.md) (CLI) for Mac, Linux, and Windows to build your own scripts to deploy a virtual network and the other necessary components to create a Linux cluster. The CLI in Azure Service Management (asm) mode will deploy the cluster nodes serially, so if you are deploying many compute nodes it might take several minutes to complete the deployment. See steps in the rest of this article for an example.

* **Azure Resource Manager templates** - By creating a straightforward Azure Resource Manager JSON template file and running Azure CLI arm-mode commands or using the Azure Preview Portal, you can deploy multiple A8 and A9 Linux VMs as well as define virtual networks, static IP addresses, DNS settings, and other resources to create a compute cluster that can take advantage of the RDMA network and run MPI workloads. You can [create your own template](../resource-group-authoring-templates.md), or check the [Azure Quickstart Templates page](https://azure.microsoft.com/documentation/templates/) for templates contributed by Microsoft or the community to deploy the solution you want. Resource Manager templates generally provide the fastest and most reliable way to deploy a Linux cluster.

## Deployment in Azure Service Management with Azure CLI scripts

The following steps will help you use the Azure CLI to deploy a SLES 12 VM, install Intel MPI Library and other customizations, create a custom VM image, and then script the deployment of a cluster of A8 or A9 VMs.

### Prerequisites

* **Client computer** - You'll need a Mac, Linux, or Windows-based client computer to communicate with Azure.

* **Azure subscription** - If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).

* **Cores quota** - You might need to increase the quota of cores to deploy a cluster of A8 or A9 VMs. For example, you will need at least 128 cores if you want to deploy 8 A9 VMs as shown in this article. To increase a quota, [open an online customer support request](http://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/) at no charge.

* **Azure CLI** - [Install](../xplat-cli-install.md) the Azure CLI and [configure it ](../xplat-cli-connect.md) to use your Azure subscription on the client computer.


### Provision a SLES 12 VM

After logging in to Azure with the Azure CLI, run the `azure config list` command to confirm that the CLI is in Azure Service Management (asm) mode. If it is not, set the mode by running this command:

```
azure config mode asm
```

Type the following to list all the subscriptions you are authorized to use:

```
azure account list
```

The current active subscription will be identified with `Current` set to `true`. If this is not the subscription you want to use to create the cluster, set the appropriate subscription number as the active subscription:

```he
azure account set <subscription-number>
```

To see the publicly available SLES 12 HPC images in Azure, run a command similar to the following, if your shell environment supports **grep**:

```
azure vm image list | grep "suse.*hpc"
```

>[AZURE.NOTE]The SLES 12 HPC images are preconfigured with the necessary Linux RDMA drivers for Azure.

Now provision a size A9 VM with an available SLES 12 HPC image by running a command similar to the following:

```
azure vm create -g <username> -p <password> -c <cloud-service-name> -l <location> -z A9 -n <vm-name> -e 10004 b4590d9e3ed742e4a1d46e5424aa335e__suse-sles-12-hpc-v20150708
```

where

* the size (A9 in this example) can be A8 or A9

* the external SSH port number (10004 in this example) is any valid port number; the internal SSH  port number will be set to 22

* a new cloud service will be created in the Azure region specified by the location; specify a location such as "West US" in which the A8 and A9 instances are available

* the image name currently can be `b4590d9e3ed742e4a1d46e5424aa335e__suse-sles-12-hpc-v20150708` (free of charge) or `b4590d9e3ed742e4a1d46e5424aa335e__suse-sles-12-hpc-priority-v20150708` for SUSE priority support (charges will apply)

### Customize the VM

After the VM completes provisioning, SSH to the VM using the VM's external IP address (or DNS name) and the external port number you configured, and customize it. For connection details, see [How to Log on to a Virtual Machine Running Linux](virtual-machines-linux-how-to-log-on.md).

>[AZURE.NOTE]Microsoft Azure does not provide root access to Linux VMs. To gain administrative access when connected as a user you can use `sudo –s`.

**Updates** - You can install updates using **zypper**, and also NFS utilities.  

>[AZURE.IMPORTANT]At this time we recommend that you don't apply kernel updates, which can cause issues with the Linux RDMA drivers.

**Intel MPI** - Download and install the Intel MPI Library 5.0 runtime from the [Intel.com site](https://software.intel.com/en-us/intel-mpi-library/). After you register with Intel, follow the link in the confirmation email to the related web page and copy the download link for the .tgz file for the appropriate version of Intel MPI.

Run commands similar to the following to install Intel MPI on the VM:

```

$ wget <download link for your registration>
$ tar xvzf <tar-file>
$ cd <mpi-directory>
$ sudo ./install.sh
```

**Lock memory** - For MPI codes to lock the memory available for RDMA, you need to add or change the following settings in the /etc/security/limits.conf file:

```
<User or group name> hard    memlock <memory required for your application in KB>
<User or group name> soft    memlock <memory required for your application in KB>
```

>[AZURE.NOTE]For testing purposes, you can also set memlock to unlimited. For example: `<User or group name>    hard    memlock unlimited`.


**SSH keys** - Establish trust for the user name and password that you used to create this VM among all the compute nodes in the cluster. Use the following command to create SSH keys:

```
$ ssh-keygen
```

Save the public key in a default location and remember the passphrase entered.

```
$ cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

In the ~/.ssh directory edit or create the ssh_config file. Provide the IP address range of the private network that you will use in Azure:

```
host 10.32.0.*
StrictHostKeyChecking no
```

Alternatively, you can list the private network IP address of each VM in your cluster as follows:

```
host 10.32.0.1
 StrictHostKeyChecking no
host 10.32.0.2
 StrictHostKeyChecking no
host 10.32.0.3
 StrictHostKeyChecking no
```

>[AZURE.NOTE]Configuring `StrictHostKeyChecking no` can create a potential security risk if a specific IP address or range is not specified as shown above.

**Applications** - Copy any applications you need onto this VM or perform other customizations before you capture the image.

### Capture the image

To capture the image, first run the following command in the Linux VM:

```
$ sudo waagent -deprovision
```

Then, from your client computer, run the following Azure CLI commands to capture the image. See [How to Capture a Linux Virtual Machine to Use as a Template](virtual-machines-linux-capture-image.md) for details.  

```
azure vm shutdown <vm-name>

azure vm capture -t <vm-name> <image-name>

```

After you run these commands, the VM image will be captured for your use and the VM will be deleted. Now you have your custom image ready to deploy a cluster.

### Deploy a cluster with the image

Modify the following script with appropriate values for your environment, and run it from your client computer. Becuase the ASM deployment method deploys the VMs serially, it will take a few minutes to deploy the 8 A9 VMs suggested in this script.

```
### Script to create a compute cluster without a scheduler in a VNet in Azure
### Create a custom private network in Azure
### Replace 10.32.0.0 with your virtual network address space
### Replace <network-name> with your network identifier
### Select a region where A8 and A9 VMs are available, such as West US
### See Azure Pricing pages for prices and availability of A8 and A9 VMs

azure network vnet create -l "West US" –e 10.32.0.0 <network-name>

### Create a cloud service. All the A8 and A9 instances need to be in the same cloud service for Linux RDMA to work across InfiniBand.
### Note: The current maximum number of VMs in a cloud service is 50. If you need to provision more than 50 VMs in the same cloud service in your cluster, contact Azure Support.

azure service create <cloud-service-name> --location "West US" –s <subscription-ID>

### Define a prefix naming scheme for compute nodes, e.g., cluster11, cluster12, etc.

vmname=cluster

### Define a prefix for external port numbers. If you want to turn off external ports and use only internal ports to communicate between compute nodes via port 22, don’t use this option. Since port numbers up to 10000 are reserved, use numbers after 10000. Leave external port on for rank 0 and head node.

portnumber=101

### In this cluster there will be 8 size A9 nodes, named cluster11 to cluster18. Specify your captured image in <image-name>.

for (( i=11; i<19; i++ )); do
        azure vm create -g <username> -p <password> -c <cloud-service-name> -z A9 -n $vmname$i -e $portnumber$i <image-name>
done

### Save this script and run it at the CLI prompt to provision your cluster
```

## Configure and run Intel MPI

To run MPI applications on Azure Linux RDMA, you need to configure certain environment variables specific to Intel MPI. Here is a sample script to configure the variables and run an application.

```
#!/bin/bash -x
source /opt/intel/impi_latest/bin64/mpivars.sh

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

The format of the host file is as follows. Add one line for each node in your cluster. Specify private IP addresses from the VNet defined earlier, not DNS names.

```
private ip address1:16 [e.g. 10.32.0.1:16]
private ip address2:16
...
```

## Verify a basic two node cluster after Intel MPI is installed

You can run the following Intel MPI commands to verify the cluster configuration by using a pingpong benchmark.

```
/opt/intel/impi_latest/bin64/mpirun -hosts <host1>, <host2> -ppn 1 -n 2 -env I_MPI_FABRICS dapl -env I_MPI_DAPL_PROVIDER=ofa-v2-ib0 -env I_MPI_DYNAMIC_CONNECTION=0 /opt/intel/impi_latest/bin64/IMB-MPI1 pingpong
```

You should see output similar to the following on a working cluster with two nodes:

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

## Network topology considerations

* On Linux VMs, Eth1 is reserved for RDMA network traffic. Do not change any Eth1 settings or any information in the configuration file referring to this network.

* In Azure IP over Infiniband (IB) is not supported. Only RDMA over IB is supported.

* On Linux VMs, Eth0 is reserved for regular Azure network traffic.

## Next steps

* Try deploying and running your Linux MPI applications on your Linux cluster.

* See the [Intel MPI Library documentation](https://software.intel.com/en-us/articles/intel-mpi-library-documentation/) for guidance on Intel MPI.
