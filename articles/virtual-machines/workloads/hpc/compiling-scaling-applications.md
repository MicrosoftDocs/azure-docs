---
title: Scaling HPC applications - Azure Virtual Machines | Microsoft Docs
description: Learn how to scale HPC applications on Azure VMs. 
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

# Scaling HPC applications

Optimal scale-up and scale-out performance of HPC applications on Azure requires performance tuning and optimization experiments for the specific workload. This section and the VM series-specific pages offer general guidance for scaling your applications.

## Compiling applications

Though not necessary, compiling applications with appropriate optimization flags provides the best scale-up performance on HB and HC-series VMs.

### AMD Optimizing C/C++ Compiler

The AMD Optimizing C/C++ Compiler (AOCC) compiler system offers a high level of advanced optimizations, multi-threading, and processor support that includes global optimization, vectorization, inter-procedural analyses, loop transformations, and code generation. AOCC compiler binaries are suitable for Linux systems having GNU C Library (glibc) version 2.17 and above. The compiler suite consists of a C/C++ compiler (clang), a Fortran compiler (FLANG) and a Fortran front end to Clang (Dragon Egg).

### Clang

Clang is a C, C++, and Objective-C compiler handling preprocessing, parsing, optimization, code generation, assembly, and linking. 
Clang supports the  `-march=znver1` flag to enable best code generation and tuning for AMD’s Zen based x86 architecture.

### FLANG

The FLANG compiler is a recent addition to the AOCC suite (added April 2018) and is currently in pre-release for developers to download and test. Based on Fortran 2008, AMD extends the GitHub version of FLANG (https://github.com/flangcompiler/flang). The FLANG compiler supports all Clang compiler options and an additional number of FLANG-specific compiler options.

### DragonEgg

DragonEgg is a gcc plugin that replaces GCC’s optimizers and code generators with those from the LLVM project. DragonEgg that comes with AOCC works with gcc-4.8.x, has been tested for x86-32/x86-64 targets and has been successfully used on various Linux platforms.

GFortran is the actual frontend for Fortran programs responsible for preprocessing, parsing, and semantic analysis generating the GCC GIMPLE intermediate representation (IR). DragonEgg is a GNU plugin, plugging into GFortran compilation flow. It implements the GNU plugin API. With the plugin architecture, DragonEgg becomes the compiler driver, driving the different phases of compilation.  After following the download and installation instructions, Dragon Egg can be invoked using: 

```bash
$ gfortran [gFortran flags] 
   -fplugin=/path/AOCC-1.2-Compiler/AOCC-1.2-     
   FortranPlugin/dragonegg.so [plugin optimization flags]     
   -c xyz.f90 $ clang -O3 -lgfortran -o xyz xyz.o $./xyz
```
   
### PGI Compiler
PGI Community Edition ver. 17 is confirmed to work with AMD EPYC. A PGI-compiled version of STREAM does deliver full memory bandwidth of the platform. The newer Community Edition 18.10 (Nov 2018) should likewise work well. Below is sample CLI to compiler optimally with the Intel Compiler:

```bash
pgcc $(OPTIMIZATIONS_PGI) $(STACK) -DSTREAM_ARRAY_SIZE=800000000 stream.c -o stream.pgi
```

### Intel Compiler
Intel Compiler ver. 18 is confirmed to work with AMD EPYC. Below is sample CLI to compiler optimally with the Intel Compiler.

```bash
icc -o stream.intel stream.c -DSTATIC -DSTREAM_ARRAY_SIZE=800000000 -mcmodel=large -shared-intel -Ofast –qopenmp
```

### GCC Compiler 
For HPC, AMD recommends GCC compiler 7.3 or newer. Older versions, such as 4.8.5 included with RHEL/CentOS 7.4, are not recommended. GCC 7.3, and newer, will deliver significantly higher performance on HPL, HPCG, and DGEMM tests.

```bash
gcc $(OPTIMIZATIONS) $(OMP) $(STACK) $(STREAM_PARAMETERS) stream.c -o stream.gcc
```

## Scaling applications 

The following suggestions apply for optimal application scaling efficiency, performance, and consistency:

* Pin processes to cores 0-59 using a sequential pinning approach (as opposed to an auto-balance approach). 
* Binding by Numa/Core/HwThread is better than default binding.
* For hybrid parallel applications (OpenMP+MPI), use 4 threads and 1 MPI rank per CCX.
* For pure MPI applications, experiment with 1-4 MPI ranks per CCX for optimal performance.
* Some applications with extreme sensitivity to memory bandwidth may benefit from using a reduced number of cores per CCX. For these applications, using 3 or 2 cores per CCX may reduce memory bandwidth contention and yield higher real-world performance or more consistent scalability. In particular, MPI Allreduce may benefit from this.
* For significantly larger scale runs, it is recommended to use UD or hybrid RC+UD transports. Many MPI libraries/runtime libraries do this internally (such as UCX or MVAPICH2). Check your transport configurations for large-scale runs.

## Next steps

Learn more about [HPC](https://docs.microsoft.com/azure/architecture/topics/high-performance-computing/) on Azure.
