---
title: Data storage in Azure Fluid Relay
description: Better understand the data storage in Fluid Relay Server
ms.date: 5/18/2022
ms.service: azure-fluid
ms.topic: reference
---

# Data storage in Azure Fluid Relay

A Container is the atomic unit of storage in the Azure Fluid Relay service and represents the data stored from a Fluid session, including operations and snapshots. The Fluid runtime uses the container to rehydrate the state of a Fluid session when a user joins for the first time or rejoins after leaving.

You have control of the Azure region where container data is stored. During the provisioning of the Azure Fluid Relay resource, you can select the region where you want that data to be stored at-rest. All containers created in that Azure Fluid Relay resource will be stored in that region. Once selected, the region can't be changed. You'll need to create a new Azure Fluid Relay resource in another region to store data in a different region.

To deliver a highly available service, the container data is replicated to another region. This data replication helps in the cases where disaster recovery is needed in face of a full regional outage. Internally, Azure Fluid Relay uses Azure Blob Storage cross-region replication to achieve that. The region where data is replicated is defined by the Azure regional pairs listed on the [Cross-region replication in Azure](../../availability-zones/cross-region-replication-azure.md#azure-paired-regions) page.

## Single region offering

For regions that have the cross-region replication done outside of the geography (like Brazil South), Azure Fluid Relay provides a single region offering. You can select between the cross-region replication or this single region offering during the provisioning of the Azure Fluid Relay resource. If you select the single region offering, you don't get the benefits of recovery from regional outage. Your application will experience downtime for the entire time the region is down. 

## What about in-transit data?
During the session’s lifetime, some data may live temporarily in-transit outside the region selected during resource provisioning. This allows the Azure Fluid Relay service to distribute changes in the DDSes between users at lower latency by placing the session in the closest region to your end users. The result is a better user experience for your end users.
For the single region offering, in-transit data is scoped to the region selected. This may result in higher latencies distributing changes in DDSes to your end users if they aren't near that region.

If the Fluid container is required during the collaborative session only, you can delete the container from the Azure Fluid Relay service. This helps you control the storage cost of your Azure Fluid Relay resource.

## See also

- [Overview of Azure Fluid Relay architecture](architecture.md)
- [How to: Provision an Azure Fluid Relay service](../how-tos/provision-fluid-azure-portal.md)
- [Delete Fluid containers in Azure Fluid Relay](../how-tos/container-deletion.md)
