---
title: Deployment overview - Avere vFXT for Azure 
description: Learn how to deploy an Avere vFXT for Azure cluster with this overview. Related articles have specific deployment instructions.
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 01/13/2020
ms.author: rohogue
---
<!-- filename is linked to in the marketplace template, make sure it gets a redirect if we rename it -->

# Avere vFXT for Azure - deployment overview

This article gives an overview of the steps needed to get an Avere vFXT for Azure cluster up and running.

Several tasks are needed before and after you create the vFXT cluster from the Azure Marketplace. Having a clear sense of the start-to-finish process will help you scope the effort needed.

## Deployment steps

After [planning your system](avere-vfxt-deploy-plan.md), you can begin to create your Avere vFXT cluster.

An Azure Resource Manager template in the Azure Marketplace collects the necessary information and automatically deploys the entire cluster.

After the vFXT cluster is up and running, there are still some configuration steps to take before using it. If you created a new Blob storage container, you'll want to move your data to it. If you use a NAS storage system, you need to add it after the cluster is created. You will want to connect clients to the cluster.

Here is an overview of all of the steps.

1. Configure prerequisites

   Before creating a VM, you must create a new subscription for the Avere vFXT project, configure subscription ownership, check quotas and request an increase if needed, and accept terms for using the Avere vFXT software. Read [Prepare to create the Avere vFXT](avere-vfxt-prereqs.md) for detailed instructions.

1. Create the Avere vFXT cluster

   Use the Azure Marketplace to create the Avere vFXT for Azure cluster. A template collects the required information and executes scripts to create the final product.

   Cluster creation involves these steps, which are all done by the marketplace template:

   * Create new network infrastructure and resource groups, if needed
   * Create a cluster controller

     The cluster controller is a simple VM that resides in the same virtual network as the Avere vFXT cluster and has the custom software needed to create and manage the cluster. The controller creates the vFXT nodes and forms the cluster, and it also provides a command-line interface to manage the cluster during its lifetime.

     If you create a new virtual network or subnet during the deployment, your controller will have a public IP address. This means the controller can serve as a jump host for connecting to the cluster from outside the virtual network.

   * Create the cluster node VMs

   * Create the cluster from the individual nodes

   * Optionally, create a new Blob container and configure it as back-end storage for the cluster

   Cluster creation is described in detail in [Deploy the vFXT cluster](avere-vfxt-deploy.md).

1. Configure the cluster

   Connect to the Avere vFXT configuration interface (Avere Control Panel) to customize the cluster's settings. Opt in for support monitoring, and add your storage system if you are using hardware storage or additional Blob containers.

   * [Access the vFXT cluster](avere-vfxt-cluster-gui.md)
   * [Enable support](avere-vfxt-enable-support.md)
   * [Configure storage](avere-vfxt-add-storage.md) (if needed)

1. Mount clients

   Follow the guidelines in [Mount the Avere vFXT cluster](avere-vfxt-mount-clients.md) to learn about load balancing and how client machines should mount the cluster.

1. Add data (if needed)

   Because the Avere vFXT is a scalable multi-client cache, the best way to move data to a new back-end storage container is with a multi-client, multi-threaded file copy strategy.

   If you need to move working set data to a new Blob container or other back-end storage system, follow the instructions in [Moving data to the vFXT cluster](avere-vfxt-data-ingest.md).

## Next steps

Continue to [Prepare to create the Avere vFXT](avere-vfxt-prereqs.md) to complete the prerequisite tasks.
