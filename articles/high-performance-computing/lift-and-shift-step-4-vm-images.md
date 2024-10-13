---
title: "Deployment step 4: compute nodes - VM images component"
description: Learn about the configuration of virtual machine (VM) images during migration deployment step four.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Deployment step 4: compute nodes - VM images component

A Virtual Machine (VM) image is a snapshot of a virtual machine's operating system, software, configurations, and data stored at a specific point in time. It's a valuable asset that encapsulates most of what is required to enable virtual machines to run end-user jobs.

In the context of HPC environments, VM images should have or could have support for drivers (for example, IB, GPUs), MPI libraries (for example, mpich, intel-mpi, pmix), and other HPC relevant software (for example, CUDA, NCCL, compilers, health checkers).

## Define VM image needs

* **Libraries, middleware, drivers:**
   - Understand the major libraries (for example, MPI flavors) and, eventually, middleware (for example, Slurm/PBS/LFS) needed for the HPC applications. Drivers to support GPUs, for instance,  can also be placed in the image.

* **Utilities and configurations:**
   - Small utilities (for example, healthchecks) or configurations (for example, ulimit) used by most users.

## Tools and services

**Azure HPC images:**
  - Azure HPC images are available for usage, which contains several packages relevant for HPC settings.
  - Azure HPC images contain both Ubuntu and AlmaLinux Linux distributions.

## Best practices for HPC images in HPC lift and shift architecture

* **Make use of Azure HPC images:**
   - These images are extensively tested to run in Azure SKUs and Azure HPC systems, such as CycleCloud.

* **Custom images and other Linux distributions:**
   - If a custom image needs to be created, we recommend using the Azure HPC image GitHub repo as much as possible. It contains all scripts used to create the Azure HPC images.

## Example steps for setup and deployment

This section provides an overview on deploying a VM using an Azure HPC image via Azure portal.

1. **Go to the Azure portal and select HPC VM image to create a VM:**

   - **Select VM image:**
     - Navigate in Azure portal to create the VM following the standard VM provisioning steps.
     - When selecting the VM image (from marketplace), look for either "AlmaLinux HPC" or  "Ubuntu-based HPC and AI"
     - Fill up all fields (including networking, disk, management, etc.)
     - Provision VM
     - Define partitions/queues, Azure SKUs, compute node hostnames, and other parameters.

2. **Test the VM:**
   - **SSH into the VM:**
     - Here you can use your operating system ssh tool or use the Azure portal cloud shell, or go into the VM access tab to select, for instance, access via Bastion (depending on the network setup)
   - **See some HPC related tools:**
     - One can observe the Azure HPC image in action by the following command, which lists the module available, including various mpi implementations

     ```bash
      module av
     ```

     - To load `openmpi`:

     ```bash
      module load mpi/openmpi
      which mpirun
     ```

     - HPC tools and libraries can be found in `/opt/` directory.

## Resources

- Azure HPC SKUs and supported images: [product website](/azure/virtual-machines/configure#vm-images)
- Azure HPC image overview: [product website](/azure/virtual-machines/configure#centos-hpc-vm-images)
- Azure HPC image release notes (with software + software versions): [GitHub](https://github.com/Azure/azhpc-images/releases)
- Azure HPC image installation scripts: [GitHub](https://github.com/Azure/azhpc-images)
- Image creation (general purpose): [product website](/azure/virtual-machines/image-version)
