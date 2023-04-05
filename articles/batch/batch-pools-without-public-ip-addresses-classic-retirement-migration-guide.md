---
title: Migrate pools without public IP addresses (classic) in Batch
description: Learn how to migrate Azure Batch pools without public IP addresses (classic) and plan for feature end of support.
author: harperche
ms.author: harpercheng
ms.service: batch
ms.topic: how-to
ms.date: 09/01/2022
---

# Migrate pools without public IP addresses (classic) in Batch

The Azure Batch feature pools without public IP addresses (classic) will be retired on *March 31, 2023*. Learn how to migrate eligible pools to simplified compute node communication pools without public IP addresses. You must opt in to migrate your Batch pools.

## About the feature

By default, all the compute nodes in an Azure Batch virtual machine (VM) configuration pool are assigned a public IP address. The Batch service uses the IP address to schedule tasks and for communication with compute nodes, including outbound access to the internet. To restrict access to these nodes and reduce public discoverability of the nodes, we released the Batch feature [pools without public IP addresses (classic)](./batch-pool-no-public-ip-address.md). Currently, the feature is in preview.

## Feature end of support

In late 2021, we launched a simplified compute node communication model for Azure Batch. The new communication model improves security and simplifies the user experience. Batch pools no longer require inbound internet access and outbound access to Azure Storage. Batch pools now need only outbound access to the Batch service. As a result, on March 31, 2023, we'll retire the Batch feature pools without public IP addresses (classic). The feature will be replaced in Batch with simplified compute node communication for pools without public IP addresses.

## Alternative: Use simplified node communication

The alternative to using a Batch pool without a public IP address (classic) requires using [simplified node communication](./simplified-node-communication-pool-no-public-ip.md). The option gives you enhanced security for your workload environments on network isolation and data exfiltration to Batch accounts. The key benefits include:

- You can create simplified node communication pools without public IP addresses.
- You can create a Batch private pool by using a new private endpoint (in the nodeManagement subresource) for an Azure Batch account.
- Use a simplified private link DNS zone for Batch account private endpoints. The private link changes from `privatelink.<region>.batch.azure.com` to `privatelink.batch.azure.com`.
- Use mutable public network access for Batch accounts.
- Get firewall support for Batch account public endpoints. You can configure IP address network rules to restrict public network access to your Batch account.

## Migrate your eligible pools

When the Batch pools without public IP addresses (classic) feature retires on March 31, 2023, existing pools that use the feature can migrate only if the pools were created in a virtual network. To migrate your eligible pools, use simplified compute node communication:

1. Take steps to enable [simplified compute node communication](./simplified-compute-node-communication.md) on your pools.

1. Create a private endpoint for Batch node management in the virtual network.

   :::image type="content" source="media/certificates/private-endpoint.png" alt-text="Screenshot that shows how to create an endpoint.":::

1. Scale down the pool to zero nodes.

   :::image type="content" source="media/certificates/scale-down-pool.png" alt-text="Screenshot that shows how to scale down a pool.":::

1. Scale out the pool again. The pool is then automatically migrated to the new version.

   :::image type="content" source="media/certificates/scale-out-pool.png" alt-text="Screenshot that shows how to scale out a pool.":::

## FAQs

- How can I migrate my Batch pools that use the pools without public IP addresses (classic) feature to simplified compute node communication?

  If you created the pools in a virtual network, [complete the migration process](#migrate-your-eligible-pools).

  If your pools weren't created in a virtual network, create a new simplified compute node communication pool without public IP addresses.

- What differences will I see in billing?

  Compared to Batch pools without public IP addresses (classic), the simplified compute node communication pools without public IP addresses support reduces cost because it doesn't create the following network resources with Batch pool deployments: load balancer, network security groups, and private link service. However, you'll see a cost associated with [Azure Private Link](https://azure.microsoft.com/pricing/details/private-link/) or other outbound network connectivity that your pools use for communication with the Batch service.

- Will I see any changes in performance?

  No known performance differences exist for simplified compute node communication pools without public IP addresses compared to Batch pools without public IP addresses (classic).

- How can I connect to my pool nodes for troubleshooting?

  The process is similar to the way you connect for pools without public IP addresses (classic). Because there the Batch pool doesn't have a public IP address, connect to your pool nodes from within the virtual network. You can create a jump box VM in the virtual network or use a remote connectivity solution like [Azure Bastion](../bastion/bastion-overview.md).

- Will there be any change to how my workloads are downloaded from Azure Storage?

  Like for Batch pools without public IP addresses (classic), you must provide your own internet outbound connectivity if your workloads need access to a resource like Azure Storage.

- What if I don’t migrate my pools to simplified compute node communication pools without public IP addresses?

  After *March 31, 2023*, we'll stop supporting Batch pools without public IP addresses (classic). After that date, existing pool functionality, including scale-out operations, might break. The pool might actively be scaled down to zero at any time.

## Next steps

For more information, see [Simplified compute node communication](./simplified-compute-node-communication.md).
