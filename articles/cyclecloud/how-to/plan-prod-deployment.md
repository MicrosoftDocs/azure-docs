---
title: Plan for CycleCloud Production Deployment
description: A checklist to help plan for your CycleCloud production deployment
author: adriankjohnson
ms.date: 03/09/2022
ms.author: adjohnso
---

# Plan Your CycleCloud Production Deployment

## Azure CycleCloud Deployment

* Decide which version of CycleCloud will be deployed:
  * [Azure CycleCloud 8.2 - Current Release](../release-notes.md)
  * [Azure CycleCloud 7.9 - Previous Release](../release-notes-previous.md)
* [Prepare your Azure Subscription](./configuration.md) by defining which Subscription, vNet, Subnet and Resource Group for the CycleCloud server deployment
* Define which [Resource Group](/azure/azure-resource-manager/management/manage-resource-groups-portal) will host clusters or if CycleCloud should create them (default setting)
* Create a storage account for [locker access](./storage-blobs.md)
* Determine if SSH keys, AD or LDAP will be [used for authentication](./user-access.md)
* Determine if CycleCloud will use a Service Principal or a Managed Identity (recommended with a single subscription) [Choosing between a Service Principal and a Managed Identity](./service-principals.md#using-service-principal)
* Confirm which SKU will be used for CycleCloud: [CycleCloud System Requirements](./install-manual.md#system-requirements)
* Will the environment be deployed in a locked down network? If so, take into account the following requirements: [Operating in a locked down network](./running-in-locked-down-network.md)
* [Deploy the CycleCloud server](../qs-install-marketplace.md)

> [!WARNING]
> Ensure that "Enable hierarchical namespace" for Azure Data Lake Storage Gen 2 is not set during storage account creation.
> CycleCloud is unable to use Blob storage with ADLS Gen 2 enabled as a storage Locker.

## Azure CycleCloud Configuration

* Login to the CycleCloud server, create a site and a CycleCloud admin account: [CycleCloud Setup](../qs-install-marketplace.md#log-into-the-cyclecloud-application-server)
* [Create CycleCloud locker](./storage-blobs.md#lockers) that points to the storage account

## Azure CycleCloud Cluster Configuration

* Define user access to the clusters [Cluster User Management](./user-access.md)
* Determine which scheduler will be used
* Determine which SKU will be required for the scheduler/head node
* Determine what SKUs will be required for the compute/execute nodes. This will be entirely dependent on the application being run
* Will clusters be deployed using a template or manually?
  * Cluster templates will need to be defined and uploaded to the locker: [Cluster Template Reference](../cluster-references/cluster-reference.md)
  * Manual creation: [Create a New Cluster](./create-cluster.md)
* Will any scripts need to be run on the scheduler or execute nodes once deployed:
  * [Cluster-Init](../cluster-references/cluster-init-reference.md)
  * [Cloud-Init](./cloud-init.md)

## Applications

* What dependencies (libraries, etc) do the applications have? How will these be made available?
* How long does an application take to setup and install? This may determine how an application is made available to the execute nodes and could necessitate a custom image.
* Are there any license dependencies that need to be taken into account? Does the application need to contact an on-premise license server?
* Determine where applications will be executed from, this will be dependent on install times and performance requirements:
  * Through a custom image:
    * [Custom Images in a CycleCloud Cluster](./create-custom-image.md)
    * [Create a Customer Linux Image](/azure/virtual-machines/linux/tutorial-custom-images)
  * Using a marketplace image
  * From an NFS share, blob storage, Azure NetApp Files
* Is there a specific VM SKU which will need to be used for the applications to run on? Will MPI be a requirement as that would necessitate a different family of machines like the H series?
  * [Azure VM sizes - HPC](/azure/virtual-machines/sizes-hpc)
  * [HB/HC Cluster Best Practices](./hb-hc-best-practices.md)
* What will be the optimum number of cores per job for each application?
* Can spot VMs be used? [Using Spot VMs in CycleCloud](./use-spot-instances.md)
* Ensure [subscription quotas](/azure/azure-resource-manager/management/azure-subscription-service-limits) are in place to fulfill the core requirements for the applications

## Data

* Determine where in Azure the input data will reside. This will be dependent on the performance of the applications and data size.  
  * Locally on the execute nodes
  * From an NFS share
  * In blob storage
  * Using Azure NetApp Files
* Determine if there is any post-processing needed on the output data
* Decide where the output data will reside once processing is complete
* Does it need to be copied elsewhere?
* What archive/backup requirements are there?

## Job Submission

* How will users submit jobs?
* Will they have a script to run on the scheduler VM or will there be a frontend to help with data upload and job submission?

## Backup and Disaster Recovery

* Will templates be used for cluster creation? This will make the recreation of a CycleCloud server a lot quicker and consistent across deployments
* What requirements for Disaster Recovery are there? What would happen to the business if an Azure region wasn’t available as expected?
* Are there any application SLAs defined by the internal business?
* Could another region be used as a standby?
* Are jobs long running? Would checkpointing be beneficial?
