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

A user with owner permissions for the subscription should create the vFXT cluster. Subscription owner permissions are needed to accept the software terms of service and perform other actions. 

There are some workaround scenarios that allow a non-owner to create an Avere vFTX for Azure cluster. These scenarios involve restricting resources and assigning additional roles to the creator. In both of these cases, a subscription owner also must [accept the Avere vFXT software terms](#accept-software-terms) ahead of time. 

| Scenario | Restrictions | Access roles required to create the Avere vFXT cluster | 
|----------|--------|-------|
| Resource group administrator | The virtual network, cluster controller, and cluster nodes must be created within the resource group | [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) and [Contributor](../role-based-access-control/built-in-roles.md#contributor) roles, both scoped to the target resource group | 
| External vnet | The cluster controller and cluster nodes are created within the resource group but an existing virtual network in a different resource group is used | (1) [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator) and [Contributor](../role-based-access-control/built-in-roles.md#contributor) roles scoped to the vFXT resource group; and (2) [Virtual Machine Contributor](../role-based-access-control/built-in-roles.md#virtual-machine-contributor), [User Access Administrator](../role-based-access-control/built-in-roles.md#user-access-administrator), and [Avere Contributor](../role-based-access-control/built-in-roles.md#avere-contributor) roles scoped to the VNET resource group. |
 
An alternative is to create a custom role-based access control (RBAC) role ahead of time and assign privileges to the user, as explained in [this article](avere-vfxt-non-owner.md). This method gives significant permissions to these users. 

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