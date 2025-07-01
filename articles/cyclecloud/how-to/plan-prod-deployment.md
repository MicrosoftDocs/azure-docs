---
title: Plan for CycleCloud Production Deployment
description: A checklist to help plan for your CycleCloud production deployment
author: adriankjohnson
ms.date: 07/01/2025
ms.author: adjohnso
---

# Plan your CycleCloud production deployment

## Azure CycleCloud deployment

* Choose the version of CycleCloud to deploy:
  * [Azure CycleCloud 8.2 - Current Release](../release-notes.md)
  * [Azure CycleCloud 7.9 - Previous Release](../release-notes-previous.md)
* [Prepare your Azure subscription](./configuration.md) by choosing the subscription, virtual network, subnet, and resource group for the CycleCloud server deployment
* Choose the [resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal) to host clusters or let CycleCloud create the resource group (default setting)
* Create a storage account for [locker access](./storage-blobs.md)
* Decide if you want to use SSH keys, Microsoft Entra ID, or LDAP for [authentication](./user-access.md)
* Decide if CycleCloud should use a Service Principal or a Managed Identity (recommended with a single subscription) [Choosing between a Service Principal and a Managed Identity](./service-principals.md#using-service-principal)
* Confirm which SKU to use for CycleCloud: [CycleCloud System Requirements](./install-manual.md#system-requirements)
* Decide if you want to deploy the environment in a locked down network. If so, consider the following requirements: [Operating in a locked down network](./running-in-locked-down-network.md)
* [Deploy the CycleCloud server](../qs-install-marketplace.md)

> [!WARNING]
> Don't set "Enable hierarchical namespace" for Azure Data Lake Storage Gen 2 during storage account creation.
> CycleCloud can't use Blob storage with ADLS Gen 2 enabled as a storage Locker.

## Azure CycleCloud Configuration

* Sign in to the CycleCloud server and create a site and a CycleCloud admin account: [CycleCloud Setup](../qs-install-marketplace.md#log-into-the-cyclecloud-application-server)
* [Create CycleCloud locker](./storage-blobs.md#lockers) that points to the storage account

## Azure CycleCloud cluster configuration

* Define user access to the clusters [Cluster User Management](./user-access.md)
* Choose the scheduler to use
* Choose the version for the scheduler and head node
* Choose the versions for the compute and execute nodes. This choice depends entirely on the application you're running.
* Decide whether to deploy clusters using a template or manually:
  * Define and upload cluster templates to the locker: [Cluster Template Reference](../cluster-references/cluster-reference.md)
  * Manually create a cluster: [Create a New Cluster](./create-cluster.md)
* Decide if you need to run any scripts on the scheduler or execute nodes once deployed:
  * [Cluster-Init](../cluster-references/cluster-init-reference.md)
  * [Cloud-Init](./cloud-init.md)

## Applications

* What dependencies (libraries, and so on) do the applications have? How will you make these dependencies available?
* How long does it take to set up and install an application? This factor might determine how you make the application available to the execution nodes. It might also require a custom image.
* Are there any license dependencies that you need to consider? Does the application need to contact an on-premises license server?
* Where will you execute the applications? This choice depends on install times and performance requirements:
  * Through a custom image:
    * [Custom Images in a CycleCloud Cluster](./create-custom-image.md)
    * [Create a Customer Linux Image](/azure/virtual-machines/linux/tutorial-custom-images)
  * Using a marketplace image
  * From an NFS share, blob storage, Azure NetApp Files
* Is there a specific VM version you need to use for the applications to run on? Is MPI a requirement? If it is, you'll need a different family of machines, like the H series.
  * [Azure VM sizes - HPC](/azure/virtual-machines/sizes-hpc)
  * [HB/HC Cluster Best Practices](./hb-hc-best-practices.md)
* What's the best number of cores per job for each application?
* Can you use spot VMs? [Using Spot VMs in CycleCloud](./use-spot-instances.md)
* Make sure you have the right [subscription quotas](/azure/azure-resource-manager/management/azure-subscription-service-limits) to meet the core requirements for the applications.

## Data

* Determine where in Azure the input data resides. This determination depends on the performance of the applications and data size.  
  * Locally on the execute nodes
  * From an NFS share
  * In blob storage
  * Using Azure NetApp Files
* Determine if there's any post-processing needed on the output data
* Decide where the output data resides once processing is complete
* Decide if the output data needs to be copied elsewhere
* Determine archive and backup requirements

## Job Submission

* How do users submit jobs?
* Do users have a script to run on the scheduler VM, or is there a frontend to help with data upload and job submission?

## Backup and disaster recovery

* Will you use templates for cluster creation? Using templates makes recreating a CycleCloud server faster and keeps deployments consistent.
* What are your disaster recovery requirements? What would happen to your business if an Azure region wasn't available when you expected?
* Did your internal business define any application SLAs?
* Can you use another region as a standby?
* Are your jobs long running? Would checkpointing help?
