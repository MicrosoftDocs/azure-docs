---
title: Set up MPI for high-performance computing in Azure | Microsoft Docs
description: Learn how to set up MPI for high-performance computing in Azure. 
services: virtual-machines
documentationcenter: ''
author: githubname
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: article
ms.date: 02/28/2019
ms.author: msalias
---


# Set up MPI

<intro text>

## UCX

UCX (https://github.com/openucx/ucx) offers the best performance on IB and works with MPICH and OpenMPI.

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
wget http://www.mpich.org/static/downloads/3.3/mpich-3.3.tar.gz
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
Download from: [https://software.intel.com/en-us/mpi-library/choose-download](https://software.intel.com/en-us/mpi-library/choose-download ).

Change the I_MPI_FABRICS environment variable depending on the version. For Intel MPI 2018, use `I_MPI_FABRICS=shm:ofa` and for 2019, use `I_MPI_FABRICS=shm:ofi`.

Process pinning works correctly for 15, 30 and 60 PPN by default.


## OSU MPI Benchmarks
Download and untar from [http://mvapich.cse.ohio-state.edu/benchmarks/](http://mvapich.cse.ohio-state.edu/benchmarks/).


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

## Next steps

Learn more about [high-performance computing](https://docs.microsoft.com/azure/architecture/topics/high-performance-computing/) in Azure.