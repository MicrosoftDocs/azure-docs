---
title: Increase Private Endpoints for Azure VMware Solution Datastores
description: Update Azure VMware Solution generation 1 datastores to use the recommended number of private endpoints. Learn how to migrate VMs and templates.
ms.service: azure-elastic-san-storage
author: shaynasrag
ms.author: shaynasrag
ms.reviewer: rogarana
ms.date: 04/23/2026
ms.topic: how-to
---


# Ensure reliable connections between Azure Elastic SAN volumes and Azure VMware Solution generation 1 datastores

Deploying Azure VMware Solution datastores on Elastic SAN with the recommended number of private endpoints enhances performance and reliability. If you have existing Azure VMware Solution datastores and need to adjust the number of endpoints while avoiding downtime, you must create a new datastore with the recommended configuration and migrate your workloads using vSphere. This article guides you through creating a new datastore with the recommended endpoint configuration and migrating your VMs and templates.

> [!IMPORTANT]
> This article only applies to Azure VMware Solution generation 1. If you're using Azure VMware Solution generation 2, you shouldn't need to perform the steps in this article since you should need to use a single private endpoint because Azure VMware Solution generation 2 clones iSCSI sessions.

## Prerequisites

- You must have permissions to create and manage Elastic SAN resources.
- You must have vSphere Client access for VM migration.

## Create new Azure VMware Solution datastore with recommended configuration

To increase the number of private endpoints, create a new datastore in Elastic SAN with the recommended configuration.

1. [Create volume groups and new volumes](elastic-san-create.md#create-volume-groups) in your Elastic SAN.
1. Review the [recommended number of private endpoints](../../azure-vmware/configure-azure-elastic-san.md#configuration-recommendations) to your volume group for your host type.
1. [Create the number of private endpoints you need](../../azure-vmware/configure-azure-elastic-san.md#configure-private-endpoint) until your configuration matches the appropriate recommended configuration for your host type.
1. [Create a new Elastic SAN Datastore](../../azure-vmware/configure-azure-elastic-san.md#add-an-elastic-san-volume-as-a-datastore) on Azure VMware Solution. This is your target datastore.

## Migrate VMs and templates to the new datastore

After creating the new datastore, use storage vMotion to relocate all VMs and templates from the source datastore to the target datastore.

1. Go to the **Storage** view in the vSphere Client.
1. Find and select the **Source ElasticSAN Datastore**.
1. Under the **VMs** tab, select multiple virtual machines for migration.
1. Right-click the selected VMs and choose **Migrate**.

    :::image type="content" source="media/elastic-san-increase-private-endpoints-azure-vmware-solutions/select-vms-for-migration.png" alt-text="Screenshot of vSphere Client showing migration option for selected VMs.":::
    
    - Select the migration type: **Change storage only**.

    :::image type="content" source="media/elastic-san-increase-private-endpoints-azure-vmware-solutions/migration-wizard-change-storage.png" alt-text="Screenshot of migration wizard with 'Change storage only' selected.":::

    - Select the **Target Datastore** that you created in the previous steps.

    :::image type="content" source="media/elastic-san-increase-private-endpoints-azure-vmware-solutions/select-target-datastore.png" alt-text="Screenshot of selecting target datastore for VM migration.":::

1. After you successfully relocate all VMs and templates to the target datastore, [disconnect and delete](../../azure-vmware/configure-azure-elastic-san.md#disconnect-and-delete-an-elastic-san-based-datastore) from the cluster.

    :::image type="content" source="media/elastic-san-increase-private-endpoints-azure-vmware-solutions/delete-source-datastore.png" alt-text="Screenshot of deleting the source datastore from the cluster in vSphere Client.":::

## Next steps

Learn more about [managing Azure VMware Solution datastores](https://learn.microsoft.com/azure/azure-vmware/).
