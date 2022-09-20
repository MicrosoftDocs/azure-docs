---
title: Opt in to migrate Azure Batch pools without public IP addresses (classic)
description: Learn how to opt in to migrate Azure Batch pools without public IP addresses (classic) and plan for feature end of support.
author: harperche
ms.author: harpercheng
ms.service: batch
ms.topic: how-to
ms.date: 09/01/2022
---

# Opt in to migrate Batch pools without public IP addresses (feature retirement)

Azure Batch pools without public IP addresses (classic) will retire on *March 31, 2023*. Existing pools will migrate to simplified compute node communication pools without public IP addresses. You must opt in to migrate your Batch pools.

## About Batch pools without public IP addresses

By default, all the compute nodes in an Azure Batch virtual machine (VM) configuration pool are assigned a public IP address. The Batch service uses the IP address to schedule tasks and for communication with compute nodes, including outbound access to the internet. To restrict access to these nodes and reduce the discoverability of these nodes from the internet, we released [Batch pools without public IP addresses (classic)](./batch-pool-no-public-ip-address.md).

## End of support for pools without public IP addresses

In late 2021, we launched a simplified compute node communication model for Azure Batch. The new communication model improves security and simplifies the user experience. Batch pools no longer require inbound internet access and outbound access to Azure Storage. Batch pools now need only outbound access to the Batch service. As a result, Batch pools without public IP addresses (classic), currently in public preview, will be retired on *March 31, 2023*. The feature will be replaced by simplified compute node communication pools without public IPs.

## Use simplified node communication for a pool with no public IP address

The alternative to using a Batch pool without a public IP address (classic) requires using [simplified node communication](./simplified-node-communication-pool-no-public-ip.md). The option gives you enhanced security for your workload environments on network isolation and data exfiltration to Azure Batch accounts. Its key benefits include:

- You can create simplified node communication pools without public IP addresses.
- You can create a Batch private pool by using a new private endpoint (sub-resource nodeManagement) for an Azure Batch account.
- A simplified private link DNS zone for Batch account private endpoints. The private link changed from `privatelink.<region>.batch.azure.com` to `privatelink.batch.azure.com`.
- Mutable public network access for Batch accounts.
- Firewall support for Batch account public endpoints. You can configure IP address network rules to restrict public network access with Batch accounts.

## Opt in and migrate your eligible pools

Batch pools without public IP addresses (classic) will retire on *March 31, 2023*. For existing pools that use the earlier preview version of Batch pools without public IP addresses (classic), you can migrate only pools that you created in a virtual network. To migrate the pool, follow the opt-in process for simplified compute node communication:

1. Opt in to [use simplified compute node communication](./simplified-compute-node-communication.md#opt-your-batch-account-in-or-out-of-simplified-compute-node-communication).

   :::image type="content" source="media/certificates/opt-in.png" alt-text="Screenshot that shows creating a support request to opt in.":::

1. Create a private endpoint for Batch node management in the virtual network.

   :::image type="content" source="media/certificates/private-endpoint.png" alt-text="Screenshot that shows how to create an endpoint.":::

1. Scale down the pool to zero nodes.

   :::image type="content" source="media/certificates/scale-down-pool.png" alt-text="Screenshot that shows how to scale down a pool.":::

1. Scale out the pool again. The pool is then automatically migrated to the new version of the preview.

   :::image type="content" source="media/certificates/scale-out-pool.png" alt-text="Screenshot that shows how to scale out a pool.":::

## FAQs

- How can I migrate my Batch pool without public IP addresses (classic) to simplified compute node communication pools without public IPs?

  You can migrate your pool to simplified compute node communication pools only if you created the pool in a virtual network. Otherwise, create a new simplified compute node communication pool without public IP addresses.

- What differences will I see in billing?

  Compared with Batch pools without public IP addresses (classic), the simplified compute node communication pools without public IPs support will reduce costs because it won’t need to create the following network resources: load balancer, network security groups, and private link service with the Batch pool deployments. However, there will be a [cost associated with  private link](https://azure.microsoft.com/pricing/details/private-link/) or other outbound network connectivity used by pools, as controlled by the user, to allow communication with the Batch service without public IP addresses.

- Will I see any changes in performance?

  No known performance differences exist for simplified compute node communication pools without public IPs compared to Batch pools without public IP addresses (classic).

- How can I connect to my pool nodes for troubleshooting?

  Similar to Batch pools without public IP addresses (classic). As there is no public IP address for the Batch pool, users will need to connect their pool nodes from within the virtual network. You can create a jump box VM in the virtual network or use other remote connectivity solutions like [Azure Bastion](../bastion/bastion-overview.md).

- Will there be any change to how my workloads are downloaded from Azure Storage?

  Similar to Batch pools without public IP addresses (classic), users will need to provide their own internet outbound connectivity if their workloads need access to other resources like Azure Storage.

- What if I don’t migrate to simplified compute node communication pools without public IPs?

  After *March 31, 2023*, we will stop supporting Batch pools without public IP addresses. The functionality of the existing pool in that configuration might break, including scale-out operations, or the pool might be actively scaled down to zero at any point in time after that date.

## Next steps

For more information, see [Simplified compute node communication](./simplified-compute-node-communication.md).
