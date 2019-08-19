---
title: Set up Message Passing Interface for HPC - Azure Virtual Machines | Microsoft Docs
description: Learn how to set up MPI for HPC on Azure. 
services: virtual-machines
documentationcenter: ''
author: vermagit
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 05/15/2019
ms.author: amverma
---

# Set up Message Passing Interface for HPC

Message Passing Interface (MPI) workloads are a significant part of traditional HPC workloads. The SR-IOV enabled VM sizes on Azure allow almost any flavor of MPI to be used. 

Running MPI jobs on VMs requires setting up of partition keys (p-keys) across a tenant. Follow the steps in the [Discover partition keys](#discover-partition-keys) section for details on determining the p-key values.

## UCX

[UCX](https://github.com/openucx/ucx) offers the best performance on IB and works with MPICH and OpenMPI.

```bash
wget https://github.com/openucx/ucx/releases/download/v1.4.0/ucx-1.4.0.tar.gz
tar -xvf ucx-1.4.0.tar.gz
cd ucx-1.4.0
./configure --prefix=<ucx-install-path>
make -j 8 && make install
```

## OpenMPI

Install UCX as previously described.

```bash
sudo yum install –y openmpi
```

Build OpenMPI.

```bash
wget https://download.open-mpi.org/release/open-mpi/v4.0/openmpi-4.0.0.tar.gz
tar -xvf openmpi-4.0.0.tar.gz
cd openmpi-4.0.0
./configure --with-ucx=<ucx-install-path> --prefix=<ompi-install-path>
make -j 8 && make install
```

Run OpenMPI.

```bash
<ompi-install-path>/bin/mpirun -np 2 --map-by node --hostfile ~/hostfile -mca pml ucx --mca btl ^vader,tcp,openib -x UCX_NET_DEVICES=mlx5_0:1  -x UCX_IB_PKEY=0x0003  ./osu_latency
```

Check your partition key as mentioned above.

## MPICH

Install UCX as previously described.

Build MPICH.

```bash
wget https://www.mpich.org/static/downloads/3.3/mpich-3.3.tar.gz
tar -xvf mpich-3.3.tar.gz
cd mpich-3.3
./configure --with-ucx=<ucx-install-path> --prefix=<mpich-install-path> --with-device=ch4:ucx
make -j 8 && make install
```

Running MPICH.

```bash
<mpich-install-path>/bin/mpiexec -n 2 -hostfile ~/hostfile -env UCX_IB_PKEY=0x0003 -bind-to hwthread ./osu_latency
```

Check your partition key as mentioned above.

## MVAPICH2

Build MVAPICH2.

```bash
wget http://mvapich.cse.ohio-state.edu/download/mvapich/mv2/mvapich2-2.3.tar.gz
tar -xv mvapich2-2.3.tar.gz
cd mvapich2-2.3
./configure --prefix=<mvapich2-install-path>
make -j 8 && make install
```

Running MVAPICH2.

```bash
<mvapich2-install-path>/bin/mpirun_rsh -np 2 -hostfile ~/hostfile MV2_CPU_MAPPING=48 ./osu_latency
```

## Platform MPI Community Edition

Install required packages for Platform MPI.

```bash
sudo yum install libstdc++.i686
sudo yum install glibc.i686
Download platform MPI at https://www.ibm.com/developerworks/downloads/im/mpi/index.html 
sudo ./platform_mpi-09.01.04.03r-ce.bin
```

Follow the installation process.

## Intel MPI

[Download Intel MPI](https://software.intel.com/mpi-library/choose-download).

Change the I_MPI_FABRICS environment variable depending on the version. For Intel MPI 2018, use `I_MPI_FABRICS=shm:ofa` and for 2019, use `I_MPI_FABRICS=shm:ofi`.

Process pinning works correctly for 15, 30 and 60 PPN by default.

## OSU MPI Benchmarks

[Download OSU MPI Benchmarks](http://mvapich.cse.ohio-state.edu/benchmarks/) and untar.

```bash
wget http://mvapich.cse.ohio-state.edu/download/mvapich/osu-micro-benchmarks-5.5.tar.gz
tar –xvf osu-micro-benchmarks-5.5.tar.gz
cd osu-micro-benchmarks-5.5
```

Build Benchmarks using a particular MPI library:

```bash
CC=<mpi-install-path/bin/mpicc>CXX=<mpi-install-path/bin/mpicxx> ./configure 
make
```

MPI Benchmarks are under `mpi/` folder.


## Discover partition keys

Discover partition keys (p-keys) for communicating with other VMs within the same tenant (Availability Set or VM Scale Set).

```bash
/sys/class/infiniband/mlx5_0/ports/1/pkeys/0
/sys/class/infiniband/mlx5_0/ports/1/pkeys/1
```

The larger of the two is the tenant key that should be used with MPI. Example: If the following are the p-keys, 0x800b should be used with MPI.

```bash
cat /sys/class/infiniband/mlx5_0/ports/1/pkeys/0
0x800b
cat /sys/class/infiniband/mlx5_0/ports/1/pkeys/1
0x7fff
```

Use the partition other than default (0x7fff) partition key. UCX requires the MSB of p-key to be cleared. For example, set UCX_IB_PKEY as 0x000b for 0x800b.

Also note that as long as the tenant (AVSet or VMSS) exists, the PKEYs remain the same. This is true even when nodes are added/deleted. New tenants get different PKEYs.


## Set up user limits for MPI

Set up user limits for MPI.

```bash
cat << EOF | sudo tee -a /etc/security/limits.conf
*               hard    memlock         unlimited
*               soft    memlock         unlimited
*               hard    nofile          65535
*               soft    nofile          65535
EOF
```


## Set up SSH keys for MPI

Set up SSH keys for MPI types that require it.

```bash
ssh-keygen -f /home/$USER/.ssh/id_rsa -t rsa -N ''
cat << EOF > /home/$USER/.ssh/config
Host *
    StrictHostKeyChecking no
EOF
cat /home/$USER/.ssh/id_rsa.pub >> /home/$USER/.ssh/authorized_keys
chmod 644 /home/$USER/.ssh/config
```

The above syntax assumes a shared home directory, else .ssh directory must be copied to each node.

## Next steps

Learn more about [HPC](https://docs.microsoft.com/azure/architecture/topics/high-performance-computing/) on Azure.
