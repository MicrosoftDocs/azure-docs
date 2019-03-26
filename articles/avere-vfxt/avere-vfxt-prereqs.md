---
title: Avere vFXT prerequisites - Azure
description: Prerequisites for Avere vFXT for Azure
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 02/20/2019
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

There are two workarounds if you do not want to give owner access to the users who create the vFXT:

* A resource group owner can create a cluster if these conditions are met:

  * A subscription owner must [accept the Avere vFXT software terms](#accept-software-terms) and [create the cluster node access role](#create-the-cluster-node-access-role). 
  * All Avere vFXT resources must be deployed inside the resource group, including:
    * Cluster controller
    * Cluster nodes
    * Blob storage
    * Network elements
 
* A user with no owner privileges can create vFXT clusters by using role-based access control (RBAC) ahead of time to assign privileges to the user. This method gives significant permissions to these users. [This article](avere-vfxt-non-owner.md) explains how to create an access role to authorize non-owners to create clusters.

## Quota for the vFXT cluster

You must have sufficient quota for the following Azure components. If needed, [request a quota increase](https://docs.microsoft.com/azure/azure-supportability/resource-manager-core-quotas-request).

> [!NOTE]
> The virtual machines and SSD components listed here are for the vFXT cluster itself. You will need additional quota for the VMs and SSD you intend to use for your compute farm.  Make sure the quota is enabled for the region where you intend to run the workflow.

|Azure component|Quota|
|----------|-----------|
|Virtual machines|3 or more E32s_v3|
|Premium SSD storage|200 GB OS space plus 1 TB to 4 TB cache space per node |
|Storage account (optional) |v2|
|Data backend storage (optional) |One new LRS Blob container |

## Accept software terms

> [!NOTE] 
> This step is not required if a subscription owner creates the Avere vFXT cluster.

During cluster creation, you must accept the terms of service for the Avere vFXT software. If you are not a subscription owner, have a subscription owner accept the terms ahead of time. This step only needs to be done once per subscription.

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

## Create access roles 

[Role-based access control](../role-based-access-control/index.yml) (RBAC) gives the vFXT cluster controller and cluster nodes authorization to perform necessary tasks.

* The cluster controller needs permission to create and modify VMs in order to create the cluster. 

* Individual vFXT nodes need to do things like read Azure resource properties, manage storage, and control other nodes' network interface settings as part of normal cluster operation.

Before you can create your Avere vFXT cluster, you must define a custom role to use with the cluster nodes. 

For the cluster controller, you can accept the default role from the template. The default gives the cluster controller resource group owner privileges. If you prefer to create a custom role for the controller, see [Customized controller access role](avere-vfxt-controller-role.md).

> [!NOTE] 
> Only a subscription owner, or a user with the role Owner or User Access Administrator, can create roles. The roles can be created ahead of time.  

### Create the cluster node access role

<!-- caution - this header is linked to in the template so don't change it unless you can change that -->

You must create the cluster node role before you can create the Avere vFXT for Azure cluster.

> [!TIP] 
> Microsoft internal users should use the existing role named "Avere Cluster Runtime Operator" instead of attempting to create one. 

1. Copy this file. Add your subscription ID in the AssignableScopes line.

   (The current version of this file is stored in the github.com/Azure/Avere repository as [AvereOperator.txt](https://github.com/Azure/Avere/blob/master/src/vfxt/src/roles/AvereOperator.txt).)  

   ```json
   {
      "AssignableScopes": [
          "/subscriptions/PUT_YOUR_SUBSCRIPTION_ID_HERE"
      ],
      "Name": "Avere Operator",
      "IsCustom": "true",
      "Description": "Used by the Avere vFXT cluster to manage the cluster",
      "NotActions": [],
      "Actions": [
          "Microsoft.Compute/virtualMachines/read",
          "Microsoft.Network/networkInterfaces/read",
          "Microsoft.Network/networkInterfaces/write",
          "Microsoft.Network/virtualNetworks/read",
          "Microsoft.Network/virtualNetworks/subnets/read",
          "Microsoft.Network/virtualNetworks/subnets/join/action",
          "Microsoft.Network/networkSecurityGroups/join/action",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Storage/storageAccounts/blobServices/containers/delete",
          "Microsoft.Storage/storageAccounts/blobServices/containers/read",
          "Microsoft.Storage/storageAccounts/blobServices/containers/write"
      ],
      "DataActions": [
          "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete",
          "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
          "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write"
      ]
   }
   ```

1. Save the file as ``avere-operator.json`` or a similar memorable file name. 


1. Open an Azure Cloud shell and sign in with your subscription ID (described [earlier in this document](#accept-software-terms)). Use this command to create the role:

   ```bash
   az role definition create --role-definition /avere-operator.json
   ```

The role name is used when creating the cluster. In this example, the name is ``avere-operator``.

## Create a storage service endpoint in your virtual network (if needed)

A [service endpoint](../virtual-network/virtual-network-service-endpoints-overview.md) keeps Azure Blob traffic local instead of routing it outside the virtual network. It is recommended for any Avere vFXT for Azure cluster that uses Azure Blob for back-end data storage. 

If you are providing an existing vnet and creating a new Azure Blob container for your back-end storage as part of the cluster creation, you must have a service endpoint in the vnet for Microsoft storage. This endpoint must exist before creating the cluster, or the creation will fail. 

A storage service endpoint is recommended for any Avere vFXT for Azure cluster that uses Azure Blob storage, even if you add the storage later. 

> [!TIP] 
> * Skip this step if you are creating a new virtual network as part of cluster creation. 
> * This step is optional if you are not creating Blob storage during cluster creation. In that case, you can create the service endpoint later if you decide to use Azure Blob.

Create the storage service endpoint from the Azure portal. 

1. From the portal, click **Virtual networks** on the left.
1. Select the vnet for your cluster. 
1. Click **Service endpoints** on the left.
1. Click **Add** at the top.
1. Leave the service as ``Microsoft.Storage`` and choose the cluster's subnet.
1. At the bottom, click **Add**.

   ![Azure portal screenshot with annotations for the steps of creating the service endpoint](media/avere-vfxt-service-endpoint.png)


## Next step: Create the vFXT cluster

After completing these prerequisites, you can jump into creating the cluster itself. Read [Deploy the vFXT cluster](avere-vfxt-deploy.md) for instructions.