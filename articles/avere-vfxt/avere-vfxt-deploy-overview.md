---
title: Deployment overview - Avere vFXT for Azure 
description: Overview of deploying Avere vFXT for Azure
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 10/31/2018
ms.author: v-erkell
---

# Avere vFXT for Azure - deployment overview

This article gives an overview of the steps needed to get an Avere vFXT for Azure cluster up and running.

The first time you deploy an Avere vFXT system, you might notice that it involves more steps than deploying most other Azure tools. Having a clear sense of the start-to-finish process will help you scope the effort needed. After the system is up and running, its power to expedite cloud-based compute tasks will make it worth the effort.

## Deployment steps

After [planning your system](avere-vfxt-deploy-plan.md), you can begin to create your Avere vFXT cluster. 

Begin by creating a cluster controller VM, which is used to create the vFXT cluster.

After the vFXT cluster is up and running, you will want to know how to connect clients to it and, if necessary, how to move your data to the new Blob storage container.  

Here is an overview of all of the steps.

1. Configure prerequisites 

   Before creating a VM, you must create a new subscription for the Avere vFXT project, configure subscription ownership, check quotas and request an increase if needed, and accept terms for using the Avere vFXT software. Read [Prepare to create the Avere vFXT](avere-vfxt-prereqs.md) for detailed instructions.

1. Create the cluster controller

   The *cluster controller* is a simple VM that resides in the same virtual network as the Avere vFXT cluster. The controller creates the vFXT nodes and forms the cluster, and it also provides a command-line interface to manage the cluster during its lifetime.

   If you configure your controller with a public IP address, it also can serve as a jump host for connecting to the cluster from outside the vnet.

   All of the software needed to create the vFXT cluster and manage its nodes is preinstalled on the cluster controller.

   Read [Create the cluster controller VM](avere-vfxt-deploy.md#create-the-cluster-controller-vm) for details.

1. Create a runtime role for the cluster nodes 

   Azure uses [role-based access control](https://docs.microsoft.com/azure/role-based-access-control/) (RBAC) to authorize the cluster node VMs to perform certain tasks. For example, the cluster nodes need to be able to assigning or reassign IP addresses to other cluster nodes. Before you create the cluster, you must define a role that gives them adequate permissions.

   The cluster controller's preinstalled software includes a prototype role for you to customize. Read [Create the cluster node access role](avere-vfxt-deploy.md#create-the-cluster-node-access-role) for instructions.

1. Create the Avere vFXT cluster 

   On the controller, edit the appropriate cluster creation script and execute it to create the cluster. [Edit the deployment script](avere-vfxt-deploy.md#edit-the-deployment-script) has detailed instructions. 

1. Configure the cluster 

   Connect to the Avere vFXT configuration interface (Avere Control Panel) to customize the cluster's settings. Opt in for support monitoring, and add your storage system if you are using an on-premises data center.

   * [Access the vFXT cluster](avere-vfxt-cluster-gui.md)
   * [Enable support](avere-vfxt-enable-support.md)
   * [Configure storage](avere-vfxt-add-storage.md) (if needed)

1. Mount clients

   Follow the guidelines in [Mount the Avere vFXT cluster](avere-vfxt-mount-clients.md) to learn about load balancing and how client machines should mount the cluster.

1. Add data (if needed)

   Because the Avere vFXT is a scalable multi-client cache, the best way to move data to a new back-end storage container is with multi-client, multithreaded file copy strategy. Read [Moving data to the vFXT cluster](avere-vfxt-data-ingest.md) for details.

## Next steps

Continue to [Prepare to create the Avere vFXT](avere-vfxt-prereqs.md) to complete the preliminary tasks for deploying the Avere vFXT for Azure. 