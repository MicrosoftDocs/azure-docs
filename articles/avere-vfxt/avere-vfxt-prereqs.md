---
title: Avere vFXT prerequisites - Azure
description: Prerequisites for Avere vFXT for Azure
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 10/31/2018
ms.author: v-erkell
---

# Prepare to create the Avere vFXT

This article explains the prerequisite tasks for creating an Avere vFXT cluster.

## Create a new subscription

Start by creating a new Azure subscription. Use a separate subscription for each Avere vFXT project to let you easily track all project resources and expenses, protect other projects from possible resource throttling during provisioning, and simplify cleanup.  

To create a new Azure subscription in the Azure portal:

* Navigate to the [Subscriptions blade](https://ms.portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade)
* Click the **+ Add** button at the top
* Sign in if prompted
* Select an offer and walk through the steps to create a new subscription

## Configure subscription owner permissions

A user with owner permissions for the subscription should create the vFXT cluster. Subscription owner permissions are needed for these actions, among others:

* Accept terms for the Avere vFXT software
* Create the cluster node access role
* Allow the cluster controller node to manage resource groups and virtual networks 
* Allow the cluster controller to create and modify the cluster nodes 

There are two workarounds if you do not want to give owner access to the users who create the vFXT:

* A resource group owner can create a cluster if these conditions are met:

  * A subscription owner must [accept the Avere vFXT software terms](#accept-software-terms-in-advance) and [create the cluster node access role](avere-vfxt-deploy.md#create-the-cluster-node-access-role).
  * All Avere vFXT resources must be deployed inside the resource group, including:
    * Cluster controller
    * Cluster nodes
    * Blob storage
    * Network elements
 
* A user with no owner privileges can create vFXT clusters if an extra access role is created and assigned to the user ahead of time. However, this role gives significant permissions to these users. [This article](avere-vfxt-non-owner.md) explains how to authorize non-owners to create clusters.

## Quota for the vFXT cluster

You must have sufficient quota for the following Azure components. If needed, [request a quota increase](https://docs.microsoft.com/azure/azure-supportability/resource-manager-core-quotas-request).

> [!NOTE]
> The virtual machines and SSD components listed here are for the vFXT cluster itself. You will need additional quota for the VMs and SSD you intend to use for your compute farm.  Make sure the quota is enabled for the region where you intend to run the workflow.

|Azure component|Quota|
|----------|-----------|
|Virtual machines|3 or more D16s_v3 or E32s_v3|
|Premium SSD storage|200 GB OS space plus 1 TB to 4 TB cache space per node |
|Storage account (optional) |v2|
|Data backend storage (optional) |One new LRS Blob container |

## Accept software terms in advance

> [!NOTE] 
> This step is not required if a subscription owner creates the Avere vFXT cluster.

Before you can create a cluster, you must accept the terms of service for the Avere vFXT software. If you are not a subscription owner, have a subscription owner accept the terms ahead of time. This step only needs to be done once per subscription.

To accept the software terms in advance: 

1. Open a cloud shell in the Azure portal or by browsing to <https://shell.azure.com>. Sign in with your subscription ID.

   ```azurecli
    az login​
    az account set --subscription abc123de-f456-abc7-89de-f01234567890​
   ```

1. Issue this command to accept service terms and enable programmatic access for the Avere vFXT for Azure software image: 

   ```azurecli
   az vm image accept-terms --urn microsoft-avere:vfxt:avere-vfxt-controller:latest
   ```

## Next step: Create the vFXT cluster

After completing these prerequisites, you can jump into creating the cluster itself. Read [Deploy the vFXT cluster](avere-vfxt-deploy.md) for instructions.